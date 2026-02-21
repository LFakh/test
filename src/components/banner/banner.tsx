import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Movie } from "~/types";
import styles from "./banner.module.css";

interface BannerProps {
  movies: Movie[];
}

export const Banner = component$<BannerProps>(({ movies }) => {
  const movie = useSignal<Movie | null>(null);

  useTask$(({ track }) => {
    track(() => movies);
    if (movies && movies.length > 0) {
      movie.value = movies[Math.floor(Math.random() * movies.length)];
    }
  });

  const getMediaType = (movie: Movie) => {
    // If media_type is explicitly set and valid, use it
    if (movie.media_type === "tv" || movie.media_type === "movie") {
      return movie.media_type;
    }
    // If the item has a 'name' property and no 'title', it's a TV show
    if (movie.name && !movie.title) {
      return "tv";
    }
    // If the item has a 'title' property and no 'name', it's a movie
    if (movie.title && !movie.name) {
      return "movie";
    }
    // Default to movie for banner (Netflix originals are usually TV shows, but we need to be more specific)
    return "tv";
  };

  if (!movie.value) return null;

  return (
    <div class={styles.banner}>
      <div class={styles.backgroundContainer}>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.value?.backdrop_path || movie.value?.poster_path}`}
          alt={movie.value?.title || movie.value?.name || movie.value?.original_name || ""}
          class={styles.backgroundImage}
        />
        <div class={styles.overlay} />
      </div>

      <div class={styles.content}>
        <h1 class={styles.title}>
          {movie.value?.title || movie.value?.name || movie.value?.original_name}
        </h1>
        <p class={styles.description}>
          {movie.value?.overview}
        </p>
        <div class={styles.actions}>
          <Link
            href={`/watch/${movie.value.id}?type=${getMediaType(movie.value)}`}
            class={styles.playButton}
          >
            <svg class={styles.playIcon} fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <span>Play</span>
          </Link>
          <Link
            href={`/${getMediaType(movie.value)}/${movie.value.id}`}
            class={styles.infoButton}
          >
            <svg class={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>More Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
});