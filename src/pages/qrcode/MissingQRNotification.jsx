import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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

const MissingQRNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const filteredData = notifications.filter(item => {
        if (!keyword) return true;
        const searchStr = keyword.toLowerCase();
        return (
            (item.qr_code && item.qr_code.toLowerCase().includes(searchStr)) ||
            (item.message && item.message.toLowerCase().includes(searchStr))
        );
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/qrcode/getMissingStatusNotification`);
            let data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch Missing QR Notifications:", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => (currentPage - 1) * perPage + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Code',
            selector: row => row.qr_code,
            sortable: true,
            minWidth: '150px',
            cell: row => (
                <div style={{ fontWeight: 'bold', color: '#2980b9' }}>
                    {row.qr_code || '-'}
                </div>
            )
        },
        {
            name: 'Message',
            selector: row => row.message,
            sortable: true,
            minWidth: '350px',
            wrap: true,
            cell: row => (
                <div style={{ padding: '10px 0', color: '#34495e' }}>
                    {row.message}
                </div>
            )
        },
        {
            name: 'Date/Time',
            selector: row => row.created_at,
            sortable: true,
            minWidth: '180px',
        }
    ];

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">
                {/* Top bar with Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Missing QR Notifications</h2>
                </div>

                {/* Filters and Actions Card */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>
                            {/* Search Box */}
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by Code or Message..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    style={{
                                        padding: '10px 15px',
                                        borderRadius: '25px',
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
                            data={filteredData}
                            customStyles={customStyles}
                            progressPending={loading}
                            pagination
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            persistTableHead
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No Notifications found.</div>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissingQRNotification;
