import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Premium Custom Styles for the DataTable
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
            color: '#2c3e50',
            backgroundColor: '#f4f6f9',
            borderBottom: '2px solid #e0e0e0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            paddingLeft: '8px',
            paddingRight: '8px',
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
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
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

const PoshRequest = () => {
    const [evidences, setEvidences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvidences = async () => {
            try {
                const response = await api.get('user/getUserPoshEvidence/1');
                if (Array.isArray(response.data)) {
                    const formattedData = response.data.map(item => ({
                        id: item.id,
                        alertId: item.id,
                        name: item.first_name ? item.first_name.trim() : 'N/A',
                        email: item.email || 'N/A',
                        mobile: item.mobile_no || 'N/A',
                        latitude: item.user_lat || '-',
                        longitude: item.user_long || '-',
                        tenant: item.tenant_name || 'N/A',
                        datetime: item.timestamp,
                    }));
                    setEvidences(formattedData);
                }
            } catch (error) {
                console.error("Error fetching posh evidence:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvidences();
    }, []);

    // DataTable Columns Configuration
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '60px',
        },
        {
            name: 'Alert',
            selector: row => row.alertId,
            sortable: true,
            minWidth: '110px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            minWidth: '160px',
            cell: row => <div style={{ fontWeight: 'bold' }}>{row.name}</div>,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            minWidth: '250px',
        },
        {
            name: 'Mobile',
            selector: row => row.mobile,
            sortable: true,
            minWidth: '140px',
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
            name: 'Tenant',
            selector: row => row.tenant,
            sortable: true,
            minWidth: '120px',
        },
        {
            name: 'Date/Time',
            selector: row => row.datetime,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'View',
            cell: row => {
                return (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '5px 0' }}>
                        <button
                            style={btnStyle('#3498db', '#2980b9')}
                            title="Inspect Details"
                            onClick={() => {
                                navigate(`/posh-request-detail/${row.alertId}`);
                            }}
                        >
                            <i className="fa fa-eye"></i>
                        </button>
                    </div>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '100px',
        },
    ];

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

    // Filtering Logic
    const filteredEvidences = evidences.filter(ev => {
        const searchLower = searchTerm.toLowerCase();
        return (
            ev.name.toLowerCase().includes(searchLower) ||
            ev.alertId.includes(searchTerm) ||
            ev.tenant.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Posh Evidences</h3>
                    </div>

                    <div className="card-body" style={{ padding: '30px' }}>
                        {/* Top Bar with Search */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4" style={{ gap: '15px' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="form-control"
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '6px',
                                    border: '1px solid #ced4da',
                                    width: '100%',
                                    maxWidth: '300px',
                                    outline: 'none',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #3498db'}
                                onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
                            />
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns}
                            data={filteredEvidences}
                            customStyles={customStyles}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30]}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            progressPending={loading}
                            persistTableHead
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No evidences found.</div>}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PoshRequest;
