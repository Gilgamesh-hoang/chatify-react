import React from 'react';
import './App.css';
import {publicRoutes, RouteType} from "./router";
import DefaultLayout from "./layout/DefaultLayout";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";


function App() {
    const RouteRender = (route: RouteType, index: number) => {
        let Layout = route.layout || DefaultLayout
        let Page = route.element
        return (
            <Route key={index} path={route.path} element={
                <Layout>
                    <Page/>
                </Layout>
            }/>
        )
    };
    return (
        <div>
            <h1 className="text-3xl font-bold underline text-red-600">
                Simple React Typescript Tailwind Sample
            </h1>
            <Router>
                <Routes>
                    {
                        publicRoutes.map((routeObject, index: number) =>
                            RouteRender(routeObject, index)
                        )
                    }
                    <Route path='*' element={null}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;