import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Movie } from "~/types";
import styles from "./row.module.css";

interface RowProps {
  title: string;
  movies: Movie[];
  category?: string;
}

export const Row = component$<RowProps>(({ title, movies, category = "movie" }) => {
  const isMoved = useSignal(false);

  const handleClick = $((direction: "left" | "right") => {
    isMoved.value = true;
    const row = document.querySelector(`[data-row="${title}"]`) as HTMLDivElement;
    if (row) {
      const { scrollLeft, clientWidth } = row;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      row.scrollTo({ left: scrollTo, behavior: "smooth" });
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
    // Use the category prop as fallback
    return category === "tv" ? "tv" : "movie";
  };

  return (
    <div class={styles.row}>
      <h2 class={styles.title}>
        {title}
      </h2>
      <div class={styles.container}>
        <button
          class={`${styles.navButton} ${styles.navButtonLeft} ${!isMoved.value ? styles.navButtonHidden : ''}`}
          onClick$={() => handleClick("left")}
          aria-label="Scroll left"
        >
          <svg class={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <div
          data-row={title}
          class={styles.scrollContainer}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              class={styles.movieCard}
            >
              <Link href={`/${getMediaType(movie)}/${movie.id}`} class={styles.movieLink}>
                <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">
                  View {movie.title || movie.name}
                </span>
              </Link>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                alt={movie.title || movie.name || movie.original_name || ""}
                class={styles.movieImage}
              />

              <div class={styles.overlay}></div>

              <div class={styles.actions}>
                <Link
                  href={`/watch/${movie.id}?type=${getMediaType(movie)}`}
                  class={styles.playButton}
                  aria-label={`Play ${movie.title || movie.name}`}
                >
                  <svg class={styles.playIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </Link>

                <Link
                  href={`/${getMediaType(movie)}/${movie.id}`}
                  class={styles.infoButton}
                  aria-label={`More info about ${movie.title || movie.name}`}
                >
                  <svg class={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>

                <button class={styles.addButton} aria-label={`Add ${movie.title || movie.name} to list`}>
                  <svg class={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          class={`${styles.navButton} ${styles.navButtonRight}`}
          onClick$={() => handleClick("right")}
          aria-label="Scroll right"
        >
          <svg class={styles.navIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
});