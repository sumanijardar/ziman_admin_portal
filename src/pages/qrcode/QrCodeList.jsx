import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// import api from '../../services/api'; // Commented out until API is ready

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
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchData = async (page = currentPage, limit = perPage, searchKw = keyword) => {
        setLoading(true);
        try {
            // Replace with actual API integration when ready
            // const response = await api.get(`/QrCode/index?page=${page}&limit=${limit}&keyword=${searchKw}`);
            // let data = response.data?.data || [];
            // let pagination = response.data?.pagination || {};

            // Mock data based on screenshot for now
            const mockData = [
                {
                    id: 1,
                    user_full_name: '-',
                    code: 'N87VBVXGEI',
                    type: '',
                    date_time: '2026-05-29 06:00:56',
                    is_active: 1
                }
            ];

            setQrCodes(mockData);
            setTotalRows(1);
        } catch (err) {
            console.error("Failed to fetch QR Codes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, perPage, keyword);
    }, [currentPage, perPage]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchData(1, perPage, keyword);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleToggleStatus = (id, currentStatus) => {
        // Mock toggle functionality
        Swal.fire({
            title: 'Change Status?',
            text: "Are you sure you want to change the status of this QR code?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3498db',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Updated!', 'QR Code status has been updated.', 'success');
                // Call API here
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
        {
            name: 'User Full Name',
            selector: row => row.user_full_name,
            sortable: true,
            minWidth: '200px',
            cell: row => (
                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {row.user_full_name || '-'}
                </div>
            ),
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
            minWidth: '100px',
        },
        {
            name: 'Date/Time',
            selector: row => row.date_time,
            sortable: true,
            minWidth: '180px',
        },
        {
            name: 'Action',
            cell: row => (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Status Toggle Button */}
                    <button
                        onClick={() => handleToggleStatus(row.id, row.is_active)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: (row.is_active === 1 || row.is_active === true) ? '#2ecc71' : '#e74c3c',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: '80px'
                        }}
                        title="Click to change status"
                    >
                        {(row.is_active === 1 || row.is_active === true) ? 'Active' : 'Inactive'}
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={() => navigate(`/qrcode/edit/${row.id}`)}
                        style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#3498db',
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
                        title="Edit"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        <i className="fa fa-pencil"></i>
                    </button>

                    {/* Download Button */}
                    {/* <button
                        onClick={() => {}}
                        style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#9b59b6',
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
                        title="Download QR"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#8e44ad'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#9b59b6'}
                    >
                        <i className="fa fa-download"></i>
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
                            data={qrCodes}
                            customStyles={customStyles}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            highlightOnHover
                            pointerOnHover
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
