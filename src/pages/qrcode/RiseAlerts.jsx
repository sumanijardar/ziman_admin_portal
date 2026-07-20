import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../services/api';

// Premium Custom Styles for the DataTable (Matched with Template)
const customStyles = {
    header: {
        style: {
            fontSize: '22px',
            color: '#333',
            fontWeight: 'bold',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px 10px 0 0',
        },
    },
    headRow: {
        style: {
            minHeight: '56px',
        },
    },
    headCells: {
        style: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#495057',
            backgroundColor: '#f4f6f9',
            borderBottom: '2px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
        },
    },
    rows: {
        style: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#343a40',
            backgroundColor: '#ffffff',
            '&:hover': {
                backgroundColor: '#f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            },
        },
    },
    pagination: {
        style: {
            borderTop: '1px solid #e0e0e0',
            borderRadius: '0 0 10px 10px',
            padding: '10px',
        },
    },
};

const RiseAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [mapModalData, setMapModalData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/qrcode/getQrCodeMissingAlertList`);
            let data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setAlerts(data);
        } catch (err) {
            console.error("Failed to fetch Rise Alerts:", err);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper for button styles
    function btnStyle(bg, hoverBg) {
        return {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: bg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            fontSize: '14px'
        };
    }

    const columns = [
        {
            name: '#',
            selector: (row, index) => (currentPage - 1) * perPage + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Name',
            selector: row => row.first_name,
            sortable: true,
            minWidth: '150px',
            cell: row => {
                const fullName = [row.first_name, row.last_name].filter(Boolean).join(' ');
                return fullName || '-';
            }
        },
        {
            name: 'Mobile no',
            selector: row => row.mobile_no,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Latitude',
            selector: row => row.latitude,
            sortable: true,
            minWidth: '130px',
        },
        {
            name: 'Longitude',
            selector: row => row.longitude,
            sortable: true,
            minWidth: '130px',
        },
        {
            name: 'Date/Time',
            selector: row => row.created_at,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Action',
            cell: row => (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '5px 0' }}>
                    <button
                        style={btnStyle('#e74c3c', '#c0392b')}
                        title="View Map"
                        onClick={() => setMapModalData(row)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                    >
                        <i className="fa fa-map-marker"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '100px',
        },
    ];

    const filteredAlerts = alerts.filter(alert => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = [alert.first_name, alert.last_name].filter(Boolean).join(' ').toLowerCase();
        return (
            fullName.includes(searchLower) ||
            (alert.code || '').toLowerCase().includes(searchLower) ||
            (alert.mobile_no || '').includes(searchLower)
        );
    });

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                {/* Top bar with Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>QR Code Raise Alerts</h2>
                </div>

                {/* Filters and Actions Card */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>
                            {/* Search Box */}
                            <div style={{ width: '100%', maxWidth: '350px' }}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: '10px 15px',
                                        borderRadius: '6px',
                                        border: '1px solid #ced4da',
                                        width: '100%',
                                        outline: 'none',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.border = '1px solid #3498db'}
                                    onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* DataTable Card */}
                <div className="card" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none', marginTop: '15px' }}>
                    <div className="card-body" style={{ padding: '0' }}>
                        <DataTable
                            columns={columns}
                            data={filteredAlerts}
                            customStyles={customStyles}
                            progressPending={loading}
                            pagination
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setPerPage(newPerPage);
                                setCurrentPage(page);
                            }}
                            highlightOnHover
                            pointerOnHover
                            persistTableHead
                            responsive
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No alerts found.</div>}
                        />
                    </div>
                </div>

            </div>

            {/* Map Modal */}
            {mapModalData && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '700px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                        <div style={{ padding: '20px 25px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                            <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
                                <i className="fa fa-map-marker text-danger mr-2"></i> Location - <span style={{ textTransform: 'capitalize' }}>{mapModalData.name}</span> (Code: {mapModalData.code})
                            </h5>
                            <button onClick={() => setMapModalData(null)} style={{ border: 'none', background: 'transparent', fontSize: '28px', lineHeight: '1', cursor: 'pointer', color: '#7f8c8d', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#e74c3c'} onMouseOut={e => e.target.style.color = '#7f8c8d'}>&times;</button>
                        </div>
                        <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                            <iframe
                                title="Alert Location Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${mapModalData.latitude},${mapModalData.longitude}&z=15&output=embed`}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiseAlerts;
