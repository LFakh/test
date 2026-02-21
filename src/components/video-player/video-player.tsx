import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import styles from "./video-player.module.css";

interface VideoPlayerProps {
  title: string;
  embedUrl: string;
  fallbackEmbedUrl?: string;
  autoPlay?: boolean;
}

export const VideoPlayer = component$<VideoPlayerProps>(({ title, embedUrl, fallbackEmbedUrl, autoPlay = true }) => {
  const isFullscreen = useSignal(false);
  const currentUrl = useSignal(embedUrl);
  const isLoading = useSignal(true);
  const hasError = useSignal(false);

  const toggleFullscreen = $(() => {
    const container = document.querySelector(`[data-video-container="${title}"]`) as HTMLElement;
    if (!container) return;

    if (!isFullscreen.value) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      isFullscreen.value = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      isFullscreen.value = false;
    }
  });

  const handleIframeLoad = $(() => {
    isLoading.value = false;
  });

  const handleIframeError = $(() => {
    isLoading.value = false;
    hasError.value = true;
    if (fallbackEmbedUrl && fallbackEmbedUrl !== currentUrl.value) {
      currentUrl.value = fallbackEmbedUrl;
      hasError.value = false;
      isLoading.value = true;
    }
  });

  useVisibleTask$(() => {
    const handleFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  });

  return (
    <div data-video-container={title} class={styles.videoContainer}>
      <div class={styles.header}>
        <h2 class={styles.title}>{title}</h2>
        <button
          onClick$={toggleFullscreen}
          class={styles.fullscreenButton}
          aria-label={isFullscreen.value ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen.value ? (
            <svg class={styles.fullscreenIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m11 5.5V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5m11-5.5v4.5m0-4.5h4.5m0 0l-5.5 5.5" />
            </svg>
          ) : (
            <svg class={styles.fullscreenIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>
      <div class={styles.videoWrapper}>
        {isLoading.value && (
          <div class={styles.loadingContainer}>
            <div class={styles.loadingSpinner}></div>
          </div>
        )}
        {hasError.value && !isLoading.value && (
          <div class={styles.errorContainer}>
            <div>
              <p class={styles.errorTitle}>Content Unavailable</p>
              <p class={styles.errorMessage}>
                This media is currently unavailable. Please try again later or check another source.
              </p>
            </div>
          </div>
        )}
        <iframe
          src={`${currentUrl.value}${autoPlay ? "?autoplay=1" : ""}`}
          class={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
          onLoad$={handleIframeLoad}
          onError$={handleIframeError}
        ></iframe>
      </div>
    </div>
  );
});