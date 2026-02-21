import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import { Banner } from "~/components/banner/banner";
import { Row } from "~/components/row/row";
import type { Movie } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default component$(() => {
  const lotsofflexOriginals = useSignal<Movie[]>([]);
  const trending = useSignal<Movie[]>([]);
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
        originalsRes,
        trendingRes,
        topRatedRes,
        actionRes,
        comedyRes,
        horrorRes,
        romanceRes,
        docsRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`),
        fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`),
      ]);

      const [
        originalsData,
        trendingData,
        topRatedData,
        actionData,
        comedyData,
        horrorData,
        romanceData,
        docsData,
      ] = await Promise.all([
        originalsRes.json(),
        trendingRes.json(),
        topRatedRes.json(),
        actionRes.json(),
        comedyRes.json(),
        horrorRes.json(),
        romanceRes.json(),
        docsRes.json(),
      ]);

      lotsofflexOriginals.value = originalsData.results || [];
      trending.value = trendingData.results || [];
      topRated.value = topRatedData.results || [];
      actionMovies.value = actionData.results || [];
      comedyMovies.value = comedyData.results || [];
      horrorMovies.value = horrorData.results || [];
      romanceMovies.value = romanceData.results || [];
      documentaries.value = docsData.results || [];
      isLoading.value = false;
    } catch (error) {
      console.error("Error fetching data:", error);
      isLoading.value = false;
    }
  });

  return (
    <div class={styles.container}>
      <Navbar />
      <main class={styles.main}>
        {isLoading.value ? (
          <div class={styles.loadingContainer}>
            <div class={styles.loadingContent}>
              <img src="/lotsoflex-logo.png" alt="Lotsoflex" width={120} height={32} class={styles.loadingLogo} />
            </div>
          </div>
        ) : (
          <>
            <Banner movies={lotsofflexOriginals.value} />
            <section class={styles.sectionsContainer}>
              <Row title="Trending Now" movies={trending.value} />
              <Row title="Top Rated" movies={topRated.value} />
              <Row title="Lotsoflex Originals" movies={lotsofflexOriginals.value} category="tv" />
              <Row title="Action Thrillers" movies={actionMovies.value} category="movie" />
              <Row title="Comedies" movies={comedyMovies.value} category="movie" />
              <Row title="Scary Movies" movies={horrorMovies.value} category="movie" />
              <Row title="Romance Movies" movies={romanceMovies.value} category="movie" />
              <Row title="Documentaries" movies={documentaries.value} category="movie" />
            </section>
          </>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Lotsoflex - Stream Movies & TV Shows",
  meta: [
    {
      name: "description",
      content: "A streaming platform built as a school project, no ads, may all your favourite movies and shows be here",
    },
  ],
};