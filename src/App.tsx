import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { Notifications } from "@mantine/notifications";
import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./layouts/admin/admin.layout";
import LoginLayout from "./layouts/login/login.layout";

import "./styles/base.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/tiptap/styles.css';
import "mantine-datatable/styles.layer.css";

import "@fontsource-variable/inter"; // Defaults to wght axis
import "@fontsource-variable/inter/wght.css"; // Specify axis

import "@fontsource-variable/plus-jakarta-sans"; // Defaults to wght axis
import "@fontsource-variable/plus-jakarta-sans/wght.css"; // Specify axis

import "@fontsource/dm-mono/400.css"; // Default monospace font
import '@fontsource/dotgothic16'; // Styling fonts

import CollectionDetailsLayout from "./layouts/collection/collectionDetails.layout.tsx";
import NavigationBar from "./components/navigation/navBar.tsx";
import CollectionsLayout from "./layouts/collection/collections.layout.tsx";
import AboutLayout from "./layouts/about/about.layout.tsx";
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
import GalleryLayout from "./layouts/gallery/gallery.layout.tsx";
import MemoriesLayout from "./layouts/memories/memories.layout.tsx";
import PlaygroundLayout from "./layouts/playground/playground.layout.tsx";
import PlaygroundDetails from "./layouts/playground/playgroundDetails.layout.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

type RouteItem = {
  element: JSX.Element;
  path: string;
};

const routes: RouteItem[] = [
  {
    path: "/login",
    element: <LoginLayout />,
  },
  {
    path: "/",
    element: <AboutLayout />,
  },
  {
    path: "/gallery",
    element: <GalleryLayout />,
  },
  {
    path: "/memories",
    element: <MemoriesLayout />,
  },
  {
    path: "/playground/:slug",
    element: <PlaygroundDetails />,
  },
  {
    path: "/playground",
    element: <PlaygroundLayout />,
  },
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
    path: "/admin/blogs",
    element: <AdminLayout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  },
];

export default function App() {
  const theme = createTheme({
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
              <Routes>
                {routes.map((route: RouteItem, index: number) => {
                  return (
                    <Route
                      key={`route-item-${index}-${route.path}`}
                      path={route.path}
                      element={route.element}
                    />
                  );
                })}
              </Routes>
            </PageEntrance>
          </PageTransitionProvider>
        </BrowserRouter>
      </ModalsProvider>
      <SpeedInsights />
      <Analytics />
    </MantineProvider>
  );
}
