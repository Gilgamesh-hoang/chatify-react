import React from "react";
import DefaultLayout from "../layout/DefaultLayout";
import Login from "../pages/Login";
import NoLayout from "../layout/NoLayout";
import Register from "../pages/Register";
import Home from "../pages/Home";
import MessagePage from "~/pages/component/chatbox/MessagePage";
import {createBrowserRouter} from "react-router-dom";
import App from "~/App";

export interface RouteType {
    path: string;
    element: React.ComponentType;
    layout: React.ComponentType<{ children: React.ReactNode }>;
    child: RouteType[];
}


export const publicRoutes: RouteType[] = [
    {path: '/login', element: Login, layout: NoLayout, child: []},
    {path: '/register', element: Register, layout: NoLayout, child: []},
]
export const privateRoutes: RouteType[] = [
    {
        path: '/', element: Home, layout: DefaultLayout, child: [
            {path: 'u/:id', element: MessagePage, layout: DefaultLayout, child: []},
            {path: 'g/:id', element: MessagePage, layout: DefaultLayout, child: []},
        ]
    },
]