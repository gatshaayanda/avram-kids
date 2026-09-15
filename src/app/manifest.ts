import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Avram Kids",
    short_name: "Avram Kids",
    description: "Kids entertainment and event equipment hire in Gaborone, Botswana.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf5",
    theme_color: "#ff7a59",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
