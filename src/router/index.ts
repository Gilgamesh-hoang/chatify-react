import React from "react";
import {Example} from "../component/Example";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";
import AuthLayouts from "../layout/NoLayout";
import Register from "../pages/Register";
import NoLayout from "../layout/NoLayout";
import Home from "../pages/Home";

export interface RouteType {
    path: string;
    element: React.ComponentType;
    layout: React.ComponentType<{ children: React.ReactNode }>;
}

export const publicRoutes:RouteType[] = [
    { path: '/login', element: Login, layout:NoLayout },
    { path: '/register', element: Register, layout:NoLayout },
]
export const privateRoutes:RouteType[] = [
    { path: '/', element: Home, layout:DefaultLayout },
]