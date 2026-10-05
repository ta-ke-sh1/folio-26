import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { Notifications } from "@mantine/notifications";
import { lazy, Suspense, useEffect, type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const AdminLayout = lazy(() => import("./layouts/admin/admin.layout"));
const GalleryLayout = lazy(() => import("./layouts/gallery/gallery.layout"));
const CannisterDetailsLayout = lazy(
  () => import("./layouts/gallery/cannisterDetails.layout"),
);
const MemoriesLayout = lazy(() => import("./layouts/memories/memories.layout"));
const CollectionDetailsLayout = lazy(
  () => import("./layouts/collection/collectionDetails.layout"),
);
const CollectionsLayout = lazy(
  () => import("./layouts/collection/collections.layout"),
);
const AboutLayout = lazy(() => import("./layouts/about/about.layout"));

import "./styles/base.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "@fontsource-variable/inter"; // Defaults to wght axis
import "@fontsource-variable/inter/wght.css"; // Specify axis

import "@fontsource/dm-mono/400.css"; // Default monospace font
import "@fontsource/dotgothic16"; // Styling fonts

import NavigationBar from "./components/navigation/navBar.tsx";
import { ReactLenis } from "lenis/react";

import "lenis/dist/lenis.css";
import Cursor from "./components/cursor/cursor.tsx";
import {
  ColorPalette,
  pitchBlack,
  primaryOrange,
} from "./enums/colors.enum.ts";
import {
  PageEntrance,
  PageTransitionProvider,
} from "./components/transition/transition.tsx";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { MANTINE_BREAKPOINTS } from "./styles/breakpoints";

type RouteItem = {
  element: JSX.Element;
  path: string;
};

const routes: RouteItem[] = [
  {
    path: "/admin/*",
    element: <AdminLayout />,
  },
  {
    path: "/*",
    element: <AboutLayout />,
  },
  {
    path: "/gallery",
    element: <GalleryLayout />,
  },
  {
    path: "/gallery/:id",
    element: <CannisterDetailsLayout />,
  },
  {
    path: "/memories",
    element: <MemoriesLayout />,
  },
  // {
  //   path: "/playground/:slug",
  //   element: <PlaygroundDetails />,
  // },
  // {
  //   path: "/playground",
  //   element: <PlaygroundLayout />,
  // },
  {
    path: "/collections/:id",
    element: <CollectionDetailsLayout />,
  },
  {
    path: "/collections",
    element: <CollectionsLayout />,
  },
  {
    path: "/admin/items",
    element: <AdminLayout />,
  },
  {
    path: "/admin/collections",
    element: <AdminLayout />,
  },
  {
    path: "/admin/categories",
    element: <AdminLayout />,
  },
  {
    path: "/admin/tags",
    element: <AdminLayout />,
  },
  {
    path: "/admin/blogs/new",
    element: <AdminLayout />,
  },
  {
    path: "/admin/blogs/:blogId/edit",
    element: <AdminLayout />,
  },
  {
    path: "/admin/cannisters/:cannisterId/edit",
    element: <AdminLayout />,
  },
  {
    path: "/admin/blogs",
    element: <AdminLayout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  },
];

export default function App() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const updateViewportScale = () => {
      const scale = pointerQuery.matches
        ? Math.max(
            1,
            Math.min(1, window.innerWidth / 1280, window.innerHeight / 720),
          )
        : 1;

      root.style.setProperty("--folio-viewport-scale", String(scale));
    };

    updateViewportScale();
    window.addEventListener("resize", updateViewportScale);
    pointerQuery.addEventListener("change", updateViewportScale);

    return () => {
      window.removeEventListener("resize", updateViewportScale);
      pointerQuery.removeEventListener("change", updateViewportScale);
      root.style.removeProperty("--folio-viewport-scale");
    };
  }, []);

  useEffect(() => {
    const initialSoundEnabled =
      localStorage.getItem("folio-sound-enabled") === "true";
    const applySoundPreference = (node: ParentNode) => {
      const soundEnabled =
        localStorage.getItem("folio-sound-enabled") === "true";
      if (node instanceof HTMLMediaElement) {
        node.muted = !soundEnabled;
      }
      node.querySelectorAll("audio, video").forEach((media) => {
        (media as HTMLMediaElement).muted = !soundEnabled;
      });
    };

    const handleSoundChange = (event: Event) => {
      const enabled = (event as CustomEvent<{ enabled: boolean }>).detail
        .enabled;
      localStorage.setItem("folio-sound-enabled", String(enabled));
      document.querySelectorAll("audio, video").forEach((media) => {
        (media as HTMLMediaElement).muted = !enabled;
      });
    };

    document.querySelectorAll("audio, video").forEach((media) => {
      (media as HTMLMediaElement).muted = !initialSoundEnabled;
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) applySoundPreference(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("folio-sound-change", handleSoundChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("folio-sound-change", handleSoundChange);
    };
  }, []);

  const theme = createTheme({
    breakpoints: MANTINE_BREAKPOINTS,
    fontFamily: "Inter Variable",
    fontFamilyMonospace: "DM Mono",
    primaryColor: "primaryOrange",
    primaryShade: 5,
    black: ColorPalette.BlackPure,
    colors: {
      primaryOrange,
      dark: pitchBlack,
    },
  });

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ReactLenis root />
      <Cursor />
      <ModalsProvider>
        <Notifications />
        <BrowserRouter>
          <PageTransitionProvider>
            <NavigationBar />
            <PageEntrance>
              <Suspense fallback={<div className="route-loading" aria-label="Loading page" />}>
                <Routes>
                  {routes.map((route: RouteItem, index: number) => (
                    <Route
                      key={`route-item-${index}-${route.path}`}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </Suspense>
            </PageEntrance>
          </PageTransitionProvider>
        </BrowserRouter>
      </ModalsProvider>
      <SpeedInsights />
      <Analytics />
    </MantineProvider>
  );
}
