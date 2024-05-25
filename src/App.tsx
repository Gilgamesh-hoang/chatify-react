import React from 'react';
import './App.css';
import {privateRoutes, publicRoutes, RouteType} from "./router";
import DefaultLayout from "./layout/DefaultLayout";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {useSelector} from 'react-redux';
import {userSelector} from './redux/selector';
import Login from './pages/Login';
import {Toaster} from "react-hot-toast";


function App() {
    const token = localStorage.getItem('token') || '';
    const user = useSelector(userSelector);
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
            <Router>

                <Routes>
                    {
                        publicRoutes.map((routeObject, index: number) =>
                            RouteRender(routeObject, index)
                        )
                    }
                    {
                        token &&
                        privateRoutes.map((routeObject, index: number) =>
                            RouteRender(routeObject, index)
                        )
                    }
                    <Route path='*' element={<Login/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;