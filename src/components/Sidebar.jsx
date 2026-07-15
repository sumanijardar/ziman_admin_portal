import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [activeMenu, setActiveMenu] = useState('');

    // Automatically expand the parent menu based on current route
    useEffect(() => {
        if (currentPath.includes('/role') || currentPath.includes('/permission')) {
            setActiveMenu('admin');
        } else if (currentPath.includes('/user')) {
            setActiveMenu('users');
        }
    }, [currentPath]);

    const toggleMenu = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(''); // close if already open
        } else {
            setActiveMenu(menu); // open new menu
        }
    };

    return (
        <div className="nk-sidebar">
            <div className="nk-nav-scroll">
                <ul className="metismenu" id="menu">
                    <li className={currentPath === '/' ? 'active' : ''}>
                        <Link to="/" aria-expanded="false">
                            <i className="icon-speedometer menu-icon"></i><span className="nav-text">Dashboard</span>
                        </Link>
                    </li>

                    {/* <li className={activeMenu === 'admin' ? 'active' : ''}>
                        <a
                            className="has-arrow"
                            href="#!"
                            aria-expanded={activeMenu === 'admin' ? 'true' : 'false'}
                            onClick={(e) => { e.preventDefault(); toggleMenu('admin'); }}
                        >
                            <i className="icon-badge menu-icon"></i><span className="nav-text">Admin</span>
                        </a>
                        <ul
                            aria-expanded={activeMenu === 'admin' ? 'true' : 'false'}
                            className={activeMenu === 'admin' ? 'collapse in' : 'collapse'}
                            style={{ display: activeMenu === 'admin' ? 'block' : 'none' }}
                        >
                            <li className={currentPath === '/role' ? 'active' : ''}><Link to="/role">Roles</Link></li>
                            <li className={currentPath === '/permissions' ? 'active' : ''}><Link to="#!">Permissions</Link></li>
                        </ul>
                    </li> */}

                    <li className={activeMenu === 'users' ? 'active' : ''}>
                        <a
                            className="has-arrow"
                            href="#!"
                            aria-expanded={activeMenu === 'users' ? 'true' : 'false'}
                            onClick={(e) => { e.preventDefault(); toggleMenu('users'); }}
                        >
                            <i className="icon-people menu-icon"></i><span className="nav-text">Users</span>
                        </a>
                        <ul
                            aria-expanded={activeMenu === 'users' ? 'true' : 'false'}
                            className={activeMenu === 'users' ? 'collapse in' : 'collapse'}
                            style={{ display: activeMenu === 'users' ? 'block' : 'none' }}
                        >
                            <li className={currentPath === '/users' ? 'active' : ''}><Link to="/users"> Users List</Link></li>
                            <li className={currentPath === '/add-user' ? 'active' : ''}><Link to="/add-user">Add User</Link></li>
                            <li className={currentPath === '/user-bulk-import' ? 'active' : ''}><Link to="/user-bulk-import">User Bulk Import</Link></li>
                        </ul>
                    </li>

                    <li className={currentPath === '/panic-evidence' ? 'active' : ''}>
                        <Link to="/panic-evidence" aria-expanded="false">
                            <i className="icon-camera menu-icon"></i><span className="nav-text">SOS</span>
                        </Link>
                    </li>

                    <li className={currentPath === '/posh-request' ? 'active' : ''}>
                        <Link to="/posh-request" aria-expanded="false">
                            <i className="icon-badge menu-icon"></i><span className="nav-text">Employee Cop</span>
                        </Link>
                    </li>


                    {/* <li className={currentPath === '/travel-safe' ? 'active' : ''}>
                        <Link to="/travel-safe" aria-expanded="false">
                            <i className="icon-plane menu-icon"></i><span className="nav-text">Travel Safe</span>
                        </Link>
                    </li> */}






                    <li className={activeMenu === 'manage-location' ? 'active' : ''}>
                        <a
                            className="has-arrow"
                            href="#!"
                            aria-expanded={activeMenu === 'manage-location' ? 'true' : 'false'}
                            onClick={(e) => { e.preventDefault(); toggleMenu('manage-location'); }}
                        >
                            <i className="icon-map menu-icon"></i><span className="nav-text">Manage Location</span>
                        </a>
                        <ul
                            aria-expanded={activeMenu === 'manage-location' ? 'true' : 'false'}
                            className={activeMenu === 'manage-location' ? 'collapse in' : 'collapse'}
                            style={{ display: activeMenu === 'manage-location' ? 'block' : 'none' }}
                        >
                            <li className={currentPath === '/tracking' ? 'active' : ''}><Link to="/tracking">Tracking</Link></li>
                            <li className={currentPath === '/live-tracking' ? 'active' : ''}><Link to="/live-tracking">Live Tracking</Link></li>
                            {/* <li className={currentPath === '/trips' ? 'active' : ''}><Link to="/trips">Trips</Link></li>
                            <li className={currentPath === '/tracker-device' ? 'active' : ''}><Link to="/tracker-device">Tracker Device</Link></li> */}
                        </ul>
                    </li>

                    <li className={currentPath === '/faq' ? 'active' : ''}>
                        <Link to="/faq" aria-expanded="false">
                            <i className="icon-info menu-icon"></i><span className="nav-text">FAQ</span>
                        </Link>
                    </li>



                    <li className={activeMenu === 'officelocation' ? 'active' : ''}>
                        <Link to="/office-location" aria-expanded="false">
                            <i className="icon-home menu-icon"></i><span className="nav-text">Office Location</span>
                        </Link>
                    </li>


                    <li className={activeMenu === 'qrcode' ? 'active' : ''}>
                        <a
                            className="has-arrow"
                            href="#!"
                            aria-expanded={activeMenu === 'qrcode' ? 'true' : 'false'}
                            onClick={(e) => { e.preventDefault(); toggleMenu('qrcode'); }}
                        >
                            <i className="fa fa-qrcode menu-icon"></i><span className="nav-text">QR Code</span>
                        </a>
                        <ul
                            aria-expanded={activeMenu === 'qrcode' ? 'true' : 'false'}
                            className={activeMenu === 'qrcode' ? 'collapse in' : 'collapse'}
                            style={{ display: activeMenu === 'qrcode' ? 'block' : 'none' }}
                        >
                            <li className={currentPath === '/qrcode-list' ? 'active' : ''}><Link to="/qrcode-list">QR List</Link></li>

                        </ul>
                    </li>



                    {/* <li className={currentPath === '/settings' ? 'active' : ''}>
                        <Link to="#!" aria-expanded="false">
                            <i className="icon-settings menu-icon"></i><span className="nav-text">Settings</span>
                        </Link>
                    </li> */}

                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
