import React from "react";
import {Example} from "../component/Example";
import DefaultLayout from "../layout/DefaultLayout";

export interface RouteType {
    path: string;
    element: React.ComponentType;
    layout: React.ComponentType<{ children: React.ReactNode }>;
}

export const publicRoutes:RouteType[] = [
    { path: '/', element: Example, layout:DefaultLayout },
    { path: '/login', element: Example, layout:DefaultLayout },
    { path: '/register', element: Example, layout:DefaultLayout },
    { path: '/message', element: Example, layout:DefaultLayout },
]