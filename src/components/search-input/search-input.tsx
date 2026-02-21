import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, Link } from "@builder.io/qwik-city";
import type { Movie } from "~/types";
import styles from "./search-input.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const SearchInput = component$(() => {
  const isOpen = useSignal(false);
  const query = useSignal("");
  const suggestions = useSignal<Movie[]>([]);
  const isLoading = useSignal(false);
  const showSuggestions = useSignal(false);
  const nav = useNavigate();

  const searchSuggestions = $(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      suggestions.value = [];
      showSuggestions.value = false;
      return;
    }

    isLoading.value = true;
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=false`
      );
      
      if (response.ok) {
        const data = await response.json();
        const filteredResults = data.results?.filter((item: Movie) => 
          item.media_type !== 'person' && (item.backdrop_path || item.poster_path)
        ).slice(0, 6) || [];
        
        suggestions.value = filteredResults;
        showSuggestions.value = filteredResults.length > 0;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      suggestions.value = [];
      showSuggestions.value = false;
    } finally {
      isLoading.value = false;
    }
  });

  const handleInput = $((e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    query.value = value;
    searchSuggestions(value);
  });

  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    if (query.value.trim()) {
      nav(`/search?q=${encodeURIComponent(query.value)}`);
      closeSuggestions();
    }
  });

  const closeSuggestions = $(() => {
    showSuggestions.value = false;
    isOpen.value = false;
    query.value = "";
    suggestions.value = [];
  });

  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  const getMediaType = (item: Movie) => {
    if (item.media_type === "tv" || item.media_type === "movie") {
      return item.media_type;
    }
    if (item.name && !item.title) return "tv";
    if (item.title && !item.name) return "movie";
    return "movie";
  };

  // Close suggestions when clicking outside
  useVisibleTask$(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      const searchContainer = document.querySelector('[data-search-container]');
      if (searchContainer && !searchContainer.contains(target)) {
        showSuggestions.value = false;
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class={styles.searchContainer} data-search-container>
      {isOpen.value ? (
        <div class={styles.searchWrapper}>
          <form onSubmit$={handleSubmit} class={styles.searchForm}>
            <input
              type="text"
              value={query.value}
              onInput$={handleInput}
              onKeyDown$={handleKeyDown}
              placeholder="Titles, people, genres"
              class={styles.searchInput}
              autoFocus
            />
            <button
              type="submit"
              class={styles.searchSubmitButton}
              aria-label="Search"
            >
              <svg class={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick$={closeSuggestions}
              class={styles.closeButton}
              aria-label="Close search"
            >
              <svg class={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {(showSuggestions.value || isLoading.value) && (
            <div class={styles.suggestionsDropdown}>
              {isLoading.value ? (
                <div class={styles.loadingItem}>
                  <div class={styles.loadingSpinner}></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <>
                  {suggestions.value.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${getMediaType(item)}/${item.id}`}
                      class={styles.suggestionItem}
                      onClick$={closeSuggestions}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path || item.backdrop_path}`}
                        alt={item.title || item.name || ""}
                        class={styles.suggestionImage}
                      />
                      <div class={styles.suggestionContent}>
                        <h4 class={styles.suggestionTitle}>
                          {item.title || item.name}
                        </h4>
                        <p class={styles.suggestionMeta}>
                          {getMediaType(item) === 'tv' ? 'TV Show' : 'Movie'} • {(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'}
                        </p>
                      </div>
                    </Link>
                  ))}
                  
                  {query.value.trim() && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query.value)}`}
                      class={styles.viewAllItem}
                      onClick$={closeSuggestions}
                    >
                      <svg class={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>View all results for "{query.value}"</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick$={() => (isOpen.value = true)}
          class={styles.searchButton}
          aria-label="Search"
        >
          <svg class={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  );
});