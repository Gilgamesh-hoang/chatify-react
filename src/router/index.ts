import React from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";
import NoLayout from "../layout/NoLayout";
import Register from "../pages/Register";
import Home from "../pages/Home";
import {ChatBox} from "~/pages/component/chatbox/ChatBox";

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
    { path: '/bruh', element: ChatBox, layout:DefaultLayout },
]