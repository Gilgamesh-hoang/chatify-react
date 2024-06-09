import React, {useEffect, useLayoutEffect} from 'react';
import './App.css';
import {privateRoutes, publicRoutes, RouteType} from "./router";
import DefaultLayout from "./layout/DefaultLayout";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {socketSelector, userSelector} from './redux/selector';
import Login from './pages/Login';
import {AppDispatch, RootState} from './redux/store';
import { socketConnect, socketSendMessage } from './redux/socketSlice';
import { SocketEvent } from './model/SocketEvent';


function App() {
    
    const token = localStorage.getItem('token') ?? '';
    const userName = localStorage.getItem('userName') ?? '';
    const user = useSelector(userSelector);
    const dispatch = useDispatch<AppDispatch>();
    // const socket = useSelector(socketSelector)
    const socket: WebSocket | null = useSelector((state: RootState) => state.app.socket.socket);

    useLayoutEffect(()=>{
        console.log("Trying to connect to a websocket...")
        dispatch(socketConnect(null));
    },[])

    useLayoutEffect(()=> {
        if (socket) {
            console.log("Checking for reLogin")
            socket.onopen = ()=> {
                if (token && userName && !user.username) {
                    const reloginParams :SocketEvent = {
                        "action": "onchat",
                        "data": {
                            "event": "RE_LOGIN",
                            "data": {
                                "user": userName,
                                "code": token
                            }
                        }
                    }
                    dispatch(socketSendMessage(reloginParams))
                }
            }
        }

    },[socket])
    const RouteRender = (route: RouteType, index: number) => {
        let Layout = route.layout || DefaultLayout
        let Page = route.element
        let ChildrenNode = route.child
        return (
            <Route key={index} path={route.path} element={
                <Layout>
                    <Page/>
                </Layout>
            }>
                {
                    ChildrenNode.map((routeObject, index: number) =>
                        RouteRender(routeObject, index)
                    )
                }
            </Route>
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
                        token && userName &&
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