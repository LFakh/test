import { component$, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import type { Movie } from "~/types";
import styles from "./index.module.css";

export default component$(() => {
  // In a real app, this would come from a global state or local storage
  const myList = useStore<Movie[]>([]);

  const handleRemove = $((id: number) => {
    const index = myList.findIndex(movie => movie.id === id);
    if (index > -1) {
      myList.splice(index, 1);
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
    // Default to movie
    return "movie";
  };

  return (
    <div class={styles.container}>
      <Navbar />

      <main class={styles.main}>
        <h1 class={styles.pageTitle}>My List</h1>

        {myList.length > 0 ? (
          <div class={styles.grid}>
            {myList.map((movie) => (
              <div
                key={movie.id}
                class={styles.movieCard}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title || movie.name || movie.original_name || ""}
                  class={styles.movieImage}
                />

                <div class={styles.overlay}></div>

                <button
                  class={styles.removeButton}
                  onClick$={() => handleRemove(movie.id)}
                  aria-label={`Remove ${movie.title || movie.name} from list`}
                >
                  <svg class={styles.removeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                <div class={styles.content}>
                  <h2 class={styles.title}>
                    {movie.title || movie.name || movie.original_name}
                  </h2>

                  <div class={styles.actions}>
                    <Link
                      href={`/watch/${movie.id}?type=${getMediaType(movie)}`}
                      class={styles.playButton}
                    >
                      <svg class={styles.playIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>
                      <span>Play</span>
                    </Link>

                    <Link
                      href={`/${getMediaType(movie)}/${movie.id}`}
                      class={styles.infoButton}
                    >
                      More Info
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div class={styles.emptyContainer}>
            <p class={styles.emptyTitle}>Your list is empty.</p>
            <p class={styles.emptyMessage}>
              Add movies and TV shows to your list by clicking the + button when browsing.
            </p>
          </div>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "My List - Lotsoflex",
  meta: [
    {
      name: "description",
      content: "Your personal list of saved movies and TV shows.",
    },
  ],
};