import React, {useEffect} from 'react'
import {Outlet} from "react-router";
import Sidebar from "./component/Sidebar"
import logo from '../assets/logo.png'
import { userSelector } from '../redux/selector';
import { useSelector } from 'react-redux';

const Home = () => {
    const token = localStorage.getItem('token') || '';
    const user = useSelector(userSelector);
    useEffect(()=> {

        if (!user.username && !token) {
            window.location.href='/login'
        }
        if (user.username && !token) {
        }

    },[])
    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
            <section className={`bg-white lg:block`}>
                <Sidebar/>
            </section>

            {/**message component**/}
            {/*<section className={`${basePath && "hidden"}`}>*/}
            <section className={``}>
                <Outlet/>
            </section>
        </div>
    )
}

export default Home