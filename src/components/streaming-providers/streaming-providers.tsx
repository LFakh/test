import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import styles from "./streaming-providers.module.css";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface StreamingProvidersProps {
  id: string;
  type: "movie" | "tv";
}

export const StreamingProviders = component$<StreamingProvidersProps>(({ id, type }) => {
  const providers = useSignal<Provider[]>([]);
  const loading = useSignal(true);

  useTask$(async ({ track }) => {
    track(() => id);
    track(() => type);

    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch providers: ${response.status}`);
      }

      const data = await response.json();

      if (data.results?.US?.flatrate) {
        providers.value = data.results.US.flatrate;
      } else {
        providers.value = [];
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      providers.value = [];
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) {
    return (
      <div class={styles.container}>
        <h2 class={styles.title}>Loading streaming providers...</h2>
      </div>
    );
  }

  if (providers.value.length === 0) {
    return (
      <div class={styles.container}>
        <h2 class={styles.title}>Streaming Providers</h2>
        <p class={styles.noProvidersMessage}>No streaming information available for this title.</p>
      </div>
    );
  }

  return (
    <div class={styles.container}>
      <h2 class={styles.title}>Available on Streaming</h2>
      <div class={styles.grid}>
        {providers.value.map((provider) => (
          <div key={provider.provider_id} class={styles.providerItem}>
            <div class={styles.logoContainer}>
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                class={styles.logo}
              />
            </div>
            <p class={styles.providerName}>{provider.provider_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
});