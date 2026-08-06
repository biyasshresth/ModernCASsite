import React from "react";
 
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  React.useEffect(() => {
    // Set document title
    document.title = "CAS";

    // Set description meta tag
    let metaDescription = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (metaDescription) {
      metaDescription.content = "Created with v0";
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Created with v0";
      document.head.appendChild(meta);
    }

    // Set theme color based on preference
    let themeColor = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;

    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.name = "theme-color";
      document.head.appendChild(themeColor);
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    themeColor.content = prefersDark ? "black" : "white";

    // Handle color scheme changes
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeColor) {
        themeColor.content = e.matches ? "black" : "white";
      }
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  return <div className="antialiased">{children}</div>;
}
