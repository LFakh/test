import { clsx, type ClassValue } from "clsx";

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export async function detectContentType(id: string, apiKey: string): Promise<"movie" | "tv" | null> {
  try {
    // Try as movie first
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);

    if (movieResponse.ok) {
      return "movie";
    }

    // Try as TV show
    const tvResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);

    if (tvResponse.ok) {
      return "tv";
    }

    return null;
  } catch (error) {
    console.error("Error detecting content type:", error);
    return null;
  }
}

export function getVideoEmbedUrls(id: string, type: "movie" | "tv"): string[] {
  return [
    `https://vidsrc.net/embed/${type}/${id}`,
    `https://embed.vidsrc.pk/${type}/${id}`,
    `https://player.vidsrc.co/embed/${type}/${id}`,
    `https://vidsrc.cc/v2/embed/${type}/${id}`,
    `https://player.videasy.net/${type}/${id}`,
  ];
}