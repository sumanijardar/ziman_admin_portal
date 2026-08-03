import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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

const QrCodeList = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [generatedIds, setGeneratedIds] = useState(new Set());
    const navigate = useNavigate();

    const handleGenerate = (row) => {
        setGeneratedIds(prev => new Set(prev).add(row.id));
        window.open(`/ziman/qrcode-view/${row.code}`, '_blank');
    };

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
            const response = await api.get(`/qrcode/getQrCode`);
            let data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setQrCodes(data);
        } catch (err) {
            console.error("Failed to fetch QR Codes:", err);
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

    const handleToggleStatus = (id, newStatus) => {
        Swal.fire({
            title: 'Change Missing Status?',
            text: "Are you sure you want to change the missing status of this QR code?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3498db',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Yes, change it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new URLSearchParams();
                    formData.append('id', id);
                    formData.append('missing_status', newStatus);

                    const response = await api.post('/qrcode/changeMissingStatus', formData);
                    if (response.data === true || response.data?.status === true || response.data?.success) {
                        Swal.fire('Updated!', 'QR Code missing status has been updated.', 'success');
                        fetchData();
                    } else {
                        Swal.fire('Error', 'Failed to update missing status.', 'error');
                    }
                } catch (error) {
                    console.error("Error updating status:", error);
                    Swal.fire('Error', 'An error occurred while updating status.', 'error');
                }
            }
        });
    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => (currentPage - 1) * perPage + index + 1,
            sortable: false,
            width: '80px',
        },
        // {
        //     name: 'User Full Name',
        //     selector: row => row.first_name,
        //     sortable: true,
        //     minWidth: '200px',
        //     cell: row => {
        //         const fullName = [row.first_name, row.last_name].filter(Boolean).join(' ');
        //         return (
        //             <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
        //                 {fullName || '-'}
        //             </div>
        //         );
        //     },
        // },

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
        {
            name: 'Generate QR',
            cell: row => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {!generatedIds.has(row.id) ? (
                        <button
                            onClick={() => handleGenerate(row)}
                            style={{
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                transition: 'background 0.3s'
                            }}
                            title="Generate QR"
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                        >
                            Generate QR
                        </button>
                    ) : (
                        <span style={{ fontSize: '12px', color: '#7f8c8d', fontStyle: 'italic' }}>Generated</span>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '120px',
        },
        {
            name: 'is Used',
            selector: row => row.user_id ? 'Used' : 'Not Used',
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Action',
            cell: row => (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    {/* Status Toggle Icon */}
                    <button
                        onClick={() => handleToggleStatus(row.id, row.missing_status === '2' ? '0' : '1')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: row.missing_status === '2' ? '#e74c3c' : '#2ecc71',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.3s'
                        }}
                        title={row.missing_status === '2' ? 'Missing (Click to mark safe)' : 'Normal (Click to report missing)'}
                    >
                        <i className={row.missing_status === '2' ? "fa fa-toggle-on" : "fa fa-toggle-off"}></i>
                    </button>

                    {/* Details Button */}
                    {/* <button
                        onClick={() => navigate(`/qrcode-detail/${row.id}`)}
                        style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#1abc9c',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            transition: 'background 0.3s'
                        }}
                        title="Details"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#16a085'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#1abc9c'}
                    >
                        <i className="fa fa-eye"></i>
                    </button> */}


                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '180px',
        },
    ];

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                {/* Top bar with Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>QR Code List</h2>
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

                            {/* Action Buttons */}
                            <div className="d-flex" style={{ gap: '10px', flexWrap: 'wrap' }}>

                                <button
                                    onClick={() => navigate('/add-qrcode')}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: '#27ae60',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'background 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#2ecc71'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
                                >
                                    <i className="fa fa-plus"></i> Add New QR Code
                                </button>

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
                            persistTableHead
                            responsive
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No QR Codes found.</div>}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QrCodeList;
