import Navbar from '@/components/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const AppLayout = () => {
    return (
        <React.Fragment>
            <ToastContainer/>
                <div>
                    <Navbar />
                    <Outlet />
                </div>
        </React.Fragment>
    );
};

export default AppLayout;
