import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const userName = localStorage.getItem('user_name') || 'Admin';

    return (
        <div className="header">
            <div className="header-content clearfix">

                <div className="header-right">
                    <ul className="clearfix">
                        {/* <li className="icons dropdown"><a href="#!" data-toggle="dropdown">
                            <i className="mdi mdi-email-outline"></i>
                            <span className="badge badge-pill gradient-1">3</span>
                        </a>
                            <div className="drop-down animated fadeIn dropdown-menu">
                                <div className="dropdown-content-heading d-flex justify-content-between">
                                    <span className="">3 New Messages</span>
                                    <a href="#!" className="d-inline-block">
                                        <span className="badge badge-pill gradient-1">3</span>
                                    </a>
                                </div>
                                <div className="dropdown-content-body">
                                    <ul>
                                        <li className="notification-unread">
                                            <a href="#!">
                                                <img className="float-left mr-3 avatar-img" src={`${import.meta.env.BASE_URL}images/avatar/1.jpg`} alt="" />
                                                <div className="notification-content">
                                                    <div className="notification-heading">Saiful Islam</div>
                                                    <div className="notification-timestamp">08 Hours ago</div>
                                                    <div className="notification-text">Hi Teddy, Just wanted to let you ...</div>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="notification-unread">
                                            <a href="#!">
                                                <img className="float-left mr-3 avatar-img" src={`${import.meta.env.BASE_URL}images/avatar/2.jpg`} alt="" />
                                                <div className="notification-content">
                                                    <div className="notification-heading">Adam Smith</div>
                                                    <div className="notification-timestamp">08 Hours ago</div>
                                                    <div className="notification-text">Can you do me a favour?</div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#!">
                                                <img className="float-left mr-3 avatar-img" src={`${import.meta.env.BASE_URL}images/avatar/3.jpg`} alt="" />
                                                <div className="notification-content">
                                                    <div className="notification-heading">Barak Obama</div>
                                                    <div className="notification-timestamp">08 Hours ago</div>
                                                    <div className="notification-text">Hi Teddy, Just wanted to let you ...</div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#!">
                                                <img className="float-left mr-3 avatar-img" src={`${import.meta.env.BASE_URL}images/avatar/4.jpg`} alt="" />
                                                <div className="notification-content">
                                                    <div className="notification-heading">Hilari Clinton</div>
                                                    <div className="notification-timestamp">08 Hours ago</div>
                                                    <div className="notification-text">Hello</div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </li> */}


                        <li className="icons dropdown">
                            <div className="user-img c-pointer position-relative d-flex align-items-center" data-toggle="dropdown" style={{ gap: '10px' }}>
                                <span className="activity active"></span>

                                <span className="d-none d-lg-inline-block text-dark font-weight-bold" style={{ fontSize: '14px' }}>
                                    {userName}
                                </span>
                            </div>
                            <div className="drop-down dropdown-profile animated fadeIn dropdown-menu">
                                <div className="dropdown-content-body">
                                    <div className="px-3 py-2 text-center border-bottom mb-2">
                                        <h6 className="mb-0 text-dark font-weight-bold">{userName}</h6>

                                    </div>
                                    <ul>

                                        <li><Link to="/logout"><i className="icon-key"></i> <span>Logout</span></Link></li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
