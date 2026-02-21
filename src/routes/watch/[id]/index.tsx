import { component$, Resource } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Navbar } from "~/components/navbar/navbar";
import { VideoPlayer } from "~/components/video-player/video-player";
import { StreamingProviders } from "~/components/streaming-providers/streaming-providers";
import type { MovieDetails, TvShowDetails } from "~/types";
import styles from "./index.module.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const useContentLoader = routeLoader$(async ({ params, url }) => {
  const id = params.id;
  const type = (url.searchParams.get("type") as "movie" | "tv") || "movie";

  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,similar,credits`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} with id ${id}`);
    }
    
    const data = await response.json();
    return { content: data, type };
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    throw error;
  }
});

export default component$(() => {
  const contentResource = useContentLoader();

  return (
    <div class={styles.container}>
      <Navbar />

      <main class={styles.main}>
        <Resource
          value={contentResource}
          onPending={() => (
            <div class={styles.loadingContainer}>
              <div class={styles.loadingContent}>
                <img src="/lotsoflex-logo.png" alt="Lotsoflex" width={120} height={32} class={styles.loadingLogo} />
              </div>
            </div>
          )}
          onRejected={() => (
            <div class={styles.notFoundContainer}>
              <div class={styles.notFoundContent}>
                <p class={styles.notFoundTitle}>Content not found</p>
                <p class={styles.notFoundMessage}>We couldn't find this title in our database.</p>
              </div>
            </div>
          )}
          onResolved={({ content, type }) => {
            const trailer = content.videos?.results.find((video) => video.type === "Trailer" || video.type === "Teaser");
            const trailerKey = trailer?.key;

            return (
              <div class={styles.content}>
                <h1 class={styles.pageTitle}>
                  {(content as any).title || (content as any).name}
                </h1>

                <div class={styles.videoGrid}>
                  <VideoPlayer
                    title="Full Content"
                    embedUrl={`https://vidsrc.net/embed/${type}/${content.id}`}
                    fallbackEmbedUrl={`https://embed.vidsrc.pk/${type}/${content.id}`}
                    autoPlay={true}
                  />

                  {trailerKey && (
                    <VideoPlayer
                      title="Trailer"
                      embedUrl={`https://www.youtube.com/embed/${trailerKey}`}
                      autoPlay={false}
                    />
                  )}
                </div>

                <div class={styles.providersSection}>
                  <StreamingProviders id={content.id} type={type as "movie" | "tv"} />
                </div>

                <div class={styles.alternativeSection}>
                  <h2 class={styles.sectionTitle}>Alternative Sources</h2>
                  <div class={styles.alternativeGrid}>
                    <VideoPlayer
                      title="Source 2"
                      embedUrl={`https://player.vidsrc.co/embed/${type}/${content.id}`}
                      autoPlay={false}
                    />
                    <VideoPlayer
                      title="Source 3"
                      embedUrl={`https://vidsrc.cc/v2/embed/${type}/${content.id}`}
                      autoPlay={false}
                    />
                    <VideoPlayer
                      title="Source 4"
                      embedUrl={`https://player.videasy.net/${type}/${content.id}`}
                      autoPlay={false}
                    />
                    <VideoPlayer
                      title="Source 5"
                      embedUrl={`https://vidsrc.to/embed/${type}/${content.id}`}
                      autoPlay={false}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        />
      </main>
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { content } = resolveValue(useContentLoader);
  return {
    title: content ? `${(content as any).title || (content as any).name} - Lotsoflex` : "Watch - Lotsoflex",
  };
};