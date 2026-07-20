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

const MissingQRList = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const filteredQrCodes = qrCodes.filter(item => {
        if (!keyword) return true;
        const searchStr = keyword.toLowerCase();
        return (
            (item.first_name && item.first_name.toLowerCase().includes(searchStr)) ||
            (item.last_name && item.last_name.toLowerCase().includes(searchStr)) ||
            (item.code && item.code.toLowerCase().includes(searchStr)) ||
            (item.type_title && item.type_title.toLowerCase().includes(searchStr))
        );
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/qrcode/getMissingStatusQrCode`);
            let data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setQrCodes(data);
        } catch (err) {
            console.error("Failed to fetch Missing QR Codes:", err);
            setQrCodes([]);
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
            name: 'User Name',
            selector: row => row.first_name,
            sortable: true,
            minWidth: '200px',
            cell: row => {
                const fullName = [row.first_name, row.last_name].filter(Boolean).join(' ');
                return (
                    <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {fullName || '-'}
                    </div>
                );
            },
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Type',
            selector: row => row.type_title || row.type,
            sortable: true,
            minWidth: '100px',
            cell: row => row.type_title || row.type || '-'
        },
        {
            name: 'Date/Time',
            selector: row => row.created_at,
            sortable: true,
            minWidth: '180px',
        },
        // {
        //     name: 'Action',
        //     cell: row => (
        //         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        //             {/* Details Button */}
        //             <button
        //                 onClick={() => navigate(`/missing-qr-detail/${row.id}`)}
        //                 style={{
        //                     padding: '6px 12px',
        //                     border: 'none',
        //                     borderRadius: '6px',
        //                     backgroundColor: '#1abc9c',
        //                     color: 'white',
        //                     cursor: 'pointer',
        //                     fontWeight: 'bold',
        //                     display: 'flex',
        //                     alignItems: 'center',
        //                     justifyContent: 'center',
        //                     width: '32px',
        //                     height: '32px',
        //                     transition: 'background 0.3s'
        //                 }}
        //                 title="Details"
        //                 onMouseOver={(e) => e.target.style.backgroundColor = '#16a085'}
        //                 onMouseOut={(e) => e.target.style.backgroundColor = '#1abc9c'}
        //             >
        //                 <i className="fa fa-eye"></i>
        //             </button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        //     width: '120px',
        // },
    ];

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">
                {/* Top bar with Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Missing QR List</h2>
                </div>

                {/* Filters and Actions Card */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>
                            {/* Search Box */}
                            <div style={{ width: '100%', maxWidth: '350px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by serial number, code, name..."
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
                            data={filteredQrCodes}
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
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No Missing QR Codes found.</div>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissingQRList;
