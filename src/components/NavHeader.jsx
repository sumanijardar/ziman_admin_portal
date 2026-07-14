import React from 'react';

const NavHeader = () => {
    return (
        <div className="nav-header">
            <div className="brand-logo">
                <a href="/">
                    <b className="logo-abbr"><img src="/images/logo.png" alt="" /> </b>
                    <span className="logo-compact"><img src="/images/logo-compact.png" alt="" /></span>
                    <span className="brand-title">
                        {/* <img src="/images/logo-text.png" alt="" /> */}
                        <h2 className='text-white text-center'>Ziman Admin</h2>
                    </span>
                </a>
            </div>
        </div>
    );
};

export default NavHeader;
