import React from 'react';

const NavHeader = () => {
    return (
        <div className="nav-header" style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <a href="/" className="d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%', textDecoration: 'none' }}>
                    <b className="logo-abbr" style={{ display: 'none' }}>
                        <img src={`${import.meta.env.BASE_URL}images/ziman.jpeg`} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', objectPosition: 'left', borderRadius: '4px' }} />
                    </b>
                    <span className="brand-title" style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                        <img src={`${import.meta.env.BASE_URL}images/ziman.jpeg`} alt="Ziman Admin" style={{ width: '100%', maxWidth: '200px', maxHeight: '55px', objectFit: 'contain', borderRadius: '5px' }} />
                    </span>
                </a>
            </div>
        </div>
    );
};

export default NavHeader;
