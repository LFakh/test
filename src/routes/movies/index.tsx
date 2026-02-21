import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import { Row } from "~/components/row/row";
import type { Movie } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default component$(() => {
  const topRated = useSignal<Movie[]>([]);
  const actionMovies = useSignal<Movie[]>([]);
  const comedyMovies = useSignal<Movie[]>([]);
  const horrorMovies = useSignal<Movie[]>([]);
  const romanceMovies = useSignal<Movie[]>([]);
  const documentaries = useSignal<Movie[]>([]);
  const isLoading = useSignal(true);

  useTask$(async () => {
    try {
      const [
        topRatedRes,
        actionRes,
        comedyRes,
        horrorRes,
        romanceRes,
        docsRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`),
      ]);

      const [
        topRatedData,
        actionData,
        comedyData,
        horrorData,
        romanceData,
        docsData,
      ] = await Promise.all([
        topRatedRes.json(),
        actionRes.json(),
        comedyRes.json(),
        horrorRes.json(),
        romanceRes.json(),
        docsRes.json(),
      ]);

      topRated.value = topRatedData.results || [];
      actionMovies.value = actionData.results || [];
      comedyMovies.value = comedyData.results || [];
      horrorMovies.value = horrorData.results || [];
      romanceMovies.value = romanceData.results || [];
      documentaries.value = docsData.results || [];
      isLoading.value = false;
    } catch (error) {
      console.error("Error fetching movies:", error);
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
        <h1 class={styles.pageTitle}>Movies</h1>

        <section class={styles.sectionsContainer}>
          <Row title="Top Rated" movies={topRated.value} category="movie" />
          <Row title="Action Thrillers" movies={actionMovies.value} category="movie" />
          <Row title="Comedies" movies={comedyMovies.value} category="movie" />
          <Row title="Scary Movies" movies={horrorMovies.value} category="movie" />
          <Row title="Romance Movies" movies={romanceMovies.value} category="movie" />
          <Row title="Documentaries" movies={documentaries.value} category="movie" />
        </section>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Movies - Lotsoflex",
  meta: [
    {
      name: "description",
      content: "Browse our collection of movies including top rated, action, comedy, horror, romance, and documentaries.",
    },
  ],
};