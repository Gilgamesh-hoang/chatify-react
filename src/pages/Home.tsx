import React from 'react';
import {Outlet, useLocation} from 'react-router';
import {Sidebar} from '~/pages/component/sidebar';
import clsx from 'clsx';
import logo from '~/assets/logo.png';

const Home = () => {
    const location = useLocation();
    const basePath: boolean = location.pathname === '/';

    return (
        <div className="grid lg:grid-cols-[370px,1fr] h-screen max-h-screen">
            <section className={clsx('bg-white lg:block', { hidden: !basePath })}>
                <Sidebar />
            </section>

            {/**message component**/}
            <section className={clsx({ hidden: basePath })}>
                <Outlet />
            </section>

            <div
                className={clsx(
                    'bg-customBackgroundHome justify-center items-center flex-col gap-2 hidden',
                    { ' lg:flex': basePath }
                )}
            >
                <div>
                    <img src={logo} width={250} alt="logo" />
                </div>
                <p className="text-lg mt-2 text-slate-500">
                    Select user to send message
                </p>
            </div>
        </div>
    );
};

export default Home;