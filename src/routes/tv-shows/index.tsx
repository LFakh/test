import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import { Row } from "~/components/row/row";
import type { Movie } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default component$(() => {
  const tvShows = useSignal<Movie[]>([]);
  const lotsofflexOriginals = useSignal<Movie[]>([]);
  const isLoading = useSignal(true);

  useTask$(async () => {
    try {
      const [tvShowsRes, originalsRes] = await Promise.all([
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`),
      ]);

      const [tvShowsData, originalsData] = await Promise.all([
        tvShowsRes.json(),
        originalsRes.json(),
      ]);

      tvShows.value = tvShowsData.results || [];
      lotsofflexOriginals.value = originalsData.results || [];
      isLoading.value = false;
    } catch (error) {
      console.error("Error fetching TV shows:", error);
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

  return (
    <div class={styles.container}>
      <Navbar />

      <main class={styles.main}>
        <h1 class={styles.pageTitle}>TV Shows</h1>

        <section class={styles.sectionsContainer}>
          <Row title="Lotsoflex Originals" movies={lotsofflexOriginals.value} category="tv" />
          <Row title="Popular TV Shows" movies={tvShows.value} category="tv" />
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "TV Shows - Lotsoflex",
  meta: [
    {
      name: "description",
      content: "Browse our collection of TV shows including Lotsoflex originals and popular series.",
    },
  ],
};