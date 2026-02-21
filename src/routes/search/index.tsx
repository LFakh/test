import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, Link } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import type { Movie } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default component$(() => {
  const location = useLocation();
  const results = useSignal<Movie[]>([]);
  const isLoading = useSignal(false);
  const hasError = useSignal(false);
  const query = location.url.searchParams.get("q") || "";

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    hasError.value = false;
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      results.value = data.results?.filter((item: Movie) => 
        item.media_type !== 'person' && (item.backdrop_path || item.poster_path)
      ) || [];
    } catch (error) {
      console.error("Error searching:", error);
      hasError.value = true;
      results.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  useTask$(async ({ track }) => {
    track(() => query);
    
    if (query) {
      await performSearch(query);
    } else {
      results.value = [];
    }
  });

  const getMediaType = (result: Movie) => {
    // If media_type is explicitly set and valid, use it
    if (result.media_type === "tv" || result.media_type === "movie") {
      return result.media_type;
    }
    // If the item has a 'name' property and no 'title', it's a TV show
    if (result.name && !result.title) {
      return "tv";
    }
    // If the item has a 'title' property and no 'name', it's a movie
    if (result.title && !result.name) {
      return "movie";
    }
    // Default to movie for search results
    return "movie";
  };

  return (
    <div class={styles.container}>
      <Navbar />

      <main class={styles.main}>
        <h1 class={styles.pageTitle}>
          {query ? `Search results for: "${query}"` : "Search for movies and TV shows"}
        </h1>

        {isLoading.value ? (
          <div class={styles.loadingContainer}>
            <div class={styles.loadingSpinner}></div>
            <p class={styles.loadingText}>Searching...</p>
          </div>
        ) : hasError.value ? (
          <div class={styles.errorContainer}>
            <p class={styles.errorTitle}>Search failed</p>
            <p class={styles.errorMessage}>Please try again or check your connection.</p>
          </div>
        ) : !query ? (
          <p class={styles.emptyMessage}>Enter a search term in the search box above to find movies and TV shows.</p>
        ) : results.value.length > 0 ? (
          <div class={styles.resultsGrid}>
            {results.value.map((result) => (
              <Link
                key={result.id}
                href={`/${getMediaType(result)}/${result.id}`}
                class={styles.resultCard}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path || result.backdrop_path}`}
                  alt={result.title || result.name || result.original_name || ""}
                  class={styles.resultImage}
                />

                <div class={styles.resultOverlay}>
                  <h2 class={styles.resultTitle}>
                    {result.title || result.name || result.original_name}
                  </h2>
                  {(result.release_date || result.first_air_date) && (
                    <p class={styles.resultYear}>
                      {(result.release_date || result.first_air_date)?.split("-")[0]}
                    </p>
                  )}
                  {result.vote_average && result.vote_average > 0 && (
                    <p class={styles.resultRating}>
                      ⭐ {result.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>

                <div class={styles.playButton}>
                  <svg class={styles.playIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div class={styles.noResultsContainer}>
            <p class={styles.noResultsTitle}>No results found for "{query}"</p>
            <p class={styles.noResultsMessage}>Try different keywords or check your spelling.</p>
          </div>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = ({ url }) => {
  const query = new URL(url).searchParams.get("q");
  return {
    title: query ? `Search: ${query} - Lotsoflex` : "Search - Lotsoflex",
    meta: [
      {
        name: "description",
        content: query ? `Search results for "${query}" on Lotsoflex` : "Search for movies and TV shows on Lotsoflex",
      },
    ],
  };
};