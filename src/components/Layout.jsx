import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from './Preloader';
import NavHeader from './NavHeader';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({
    children,
    showNavHeader = true,
    showHeader = true,
    showSidebar = true,
    showFooter = false
}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const checkSession = () => {
            const loginTimestamp = localStorage.getItem('login_timestamp');
            if (loginTimestamp) {
                const now = Date.now();
                const diff = now - parseInt(loginTimestamp, 10);
                // const oneHours = 120000; // 2 hours in milliseconds
                const oneHours = 1 * 60 * 60 * 1000; // 2 hours in milliseconds

                if (diff > oneHours) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        };

        // Check session immediately
        checkSession();

        // Periodically check session every minute
        const intervalId = setInterval(checkSession, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [token, navigate]);

    // If there is no token, render nothing to prevent a flash of the dashboard before redirect
    if (!token) {
        return null;
    }

    return (
        <>
            <Preloader />
            <div id="main-wrapper" className="show">
                {showNavHeader && <NavHeader />}
                {showHeader && <Header />}
                {showSidebar && <Sidebar />}

                {children}

                {showFooter && <Footer />}
            </div>
        </>
    );
};

export default Layout;
