import {
  createTheme,
  MantineProvider,
  type MantineColorsTuple,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { Notifications } from "@mantine/notifications";
import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./layouts/admin/admin.layout";
import LoginLayout from "./layouts/login/login.layout";
import MainLayout from "./layouts/homepage/main.layout.tsx";

import "./styles/base.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

import "@fontsource-variable/inter"; // Defaults to wght axis
import "@fontsource-variable/inter/wght.css"; // Specify axis

import "@fontsource-variable/plus-jakarta-sans"; // Defaults to wght axis
import "@fontsource-variable/plus-jakarta-sans/wght.css"; // Specify axis

import CollectionDetailsLayout from "./layouts/collection/collectionDetails.layout.tsx";
import NavigationBar from "./components/navigation/navBar.tsx";
import CollectionsLayout from "./layouts/collection/collections.layout.tsx";
import AboutLayout from "./layouts/about/about.layout.tsx";
import ContactsLayout from "./layouts/contacts/contacts.layout.tsx";
import { ReactLenis } from "lenis/react";

import "lenis/dist/lenis.css";
import Cursor from "./components/cursor/cursor.tsx";
import {
  ColorPalette,
  pitchBlack,
  primaryOrange,
} from "./enums/colors.enum.ts";

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
    element: <MainLayout />,
  },
  {
    path: "/about",
    element: <AboutLayout />,
  },
  {
    path: "/contacts",
    element: <ContactsLayout />,
  },
  {
    path: "/collections",
    element: <CollectionsLayout />,
  },
  {
    path: "/collections/:id",
    element: <CollectionDetailsLayout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  },
];

export default function App() {
  const theme = createTheme({
    fontFamily: "Inter Variable",
    primaryColor: "primaryOrange",
    primaryShade: 6,
    black: ColorPalette.BlackPure,
    colors: {
      primaryOrange,
      dark: pitchBlack,
    },
  });

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
      forceColorScheme="dark"
    >
      <ReactLenis root />
      <Cursor />
      <ModalsProvider>
        <Notifications />
        <BrowserRouter>
          <NavigationBar />
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
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  );
}
