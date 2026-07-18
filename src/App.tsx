import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminLayout from "./layouts/admin/admin.layout";
import LoginLayout from "./layouts/login/login.layout";
import MainLayout from "./layouts/main.layout";

import "./styles/base.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-datatable/styles.layer.css";

import "@fontsource/sen/400.css";

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
        path: "*",
        element: <MainLayout />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
    },
];

export default function App() {
    const theme = createTheme({
        fontFamily: "Sen",
    });

    return (
        <MantineProvider theme={theme}>
            <Notifications />
            <BrowserRouter>
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
        </MantineProvider>
    );
}
