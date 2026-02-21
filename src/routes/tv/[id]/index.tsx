import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation, Link } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import type { TvShowDetails } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default component$(() => {
  const location = useLocation();
  const show = useSignal<TvShowDetails | null>(null);
  const isLoading = useSignal(true);
  const id = location.params.id;

  useTask$(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,similar,credits`
      );
      const data = await response.json();
      show.value = data;
    } catch (error) {
      console.error("Error fetching TV show:", error);
    } finally {
      isLoading.value = false;
    }
  });

  if (isLoading.value) {
    return (
      <div class={styles.loadingContainer}>
        <div class={styles.loadingContent}>
          <img src="/lotsoflex-logo.png" alt="Lotsoflex" width={120} height={32} class={styles.loadingLogo} />
        </div>
      </div>
    );
  }

  if (!show.value) {
    return (
      <div class={styles.notFoundContainer}>
        <p class={styles.notFoundMessage}>TV show not found</p>
      </div>
    );
  }

  const trailer = show.value.videos?.results.find((video) => video.type === "Trailer" || video.type === "Teaser");
  const creator = show.value.created_by?.[0];
  const cast = show.value.credits?.cast.slice(0, 5);

  return (
    <div class={styles.container}>
      <Navbar />

      <main class={styles.main}>
        <div class={styles.heroSection}>
          {(show.value.backdrop_path || show.value.poster_path) && (
            <img
              src={`https://image.tmdb.org/t/p/original${show.value.backdrop_path || show.value.poster_path}`}
              alt={show.value.name || "TV Show"}
              class={styles.heroImage}
            />
          )}
          <div class={styles.heroOverlay} />
        </div>

        <div class={styles.content}>
          <h1 class={styles.title}>{show.value.name}</h1>

          <div class={styles.metadata}>
            <p class={styles.matchScore}>{Math.round(show.value.vote_average * 10)}% Match</p>
            <p class={styles.year}>{show.value.first_air_date?.split("-")[0]}</p>
            <p class={styles.seasons}>
              {show.value.number_of_seasons} Season{show.value.number_of_seasons !== 1 ? "s" : ""}
            </p>
            <span class={styles.hdBadge}>HD</span>
          </div>

          <div class={styles.actions}>
            <Link
              href={`/watch/${id}?type=tv`}
              class={styles.playButton}
            >
              <svg class={styles.playIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span>Play</span>
            </Link>
            <button class={styles.listButton}>
              <svg class={styles.listIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>My List</span>
            </button>
            <button class={styles.likeButton}>
              <svg class={styles.likeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
          </div>

          <div class={styles.description}>
            <p class={styles.overview}>{show.value.overview}</p>

            <div class={styles.details}>
              {creator && (
                <p class={styles.detailItem}>
                  <span class={styles.detailLabel}>Creator:</span> {creator.name}
                </p>
              )}

              {cast && cast.length > 0 && (
                <p class={styles.detailItem}>
                  <span class={styles.detailLabel}>Cast:</span> {cast.map((person) => person.name).join(", ")}
                </p>
              )}

              {show.value.genres && (
                <p class={styles.detailItem}>
                  <span class={styles.detailLabel}>Genres:</span> {show.value.genres.map((genre) => genre.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

// Head export for SEO, matching the movie page logic
export const head: DocumentHead = async ({ params }) => {
  const id = params.id;
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
    const show = await response.json();
    return {
      title: show ? `${show.name} - Lotsoflex` : "TV Show - Lotsoflex",
    };
  } catch {
    return {
      title: "TV Show - Lotsoflex",
    };
  }
};
