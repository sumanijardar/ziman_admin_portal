import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

// Premium Custom Styles for the DataTable (Matched with FAQ List)
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

const OfficeList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const fetchData = async (page = currentPage, limit = perPage, searchKw = keyword) => {
        setLoading(true);
        try {
            const response = await api.get(`/OfficeLocation/index?page=${page}&limit=${limit}&keyword=${searchKw}`);
            let data = response.data?.data || [];
            let pagination = response.data?.pagination || {};

            setLocations(data);
            setTotalRows(pagination.total_records || data.length);
        } catch (err) {
            console.error("Failed to fetch office locations:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination changes
    useEffect(() => {
        fetchData(currentPage, perPage, keyword);
    }, [currentPage, perPage]);

    // Handle keyword live search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1); // Reset to first page when searching
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

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.post(`/OfficeLocation/delete/${id}`);
                    const data = response.data;

                    if (data.status === "success" || data.code === 200 || data.success) {
                        Swal.fire('Deleted!', data.message || 'Location deleted successfully.', 'success');
                        fetchData();
                    } else {
                        Swal.fire('Error!', data.message || 'Failed to delete location.', 'error');
                    }
                } catch (error) {
                    console.error("API error:", error);
                    const errorMessage = error.response?.data?.message || 'An error occurred while deleting.';
                    Swal.fire('Error!', errorMessage, 'error');
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
        {
            name: 'Office Name',
            selector: row => row.office_name,
            sortable: true,
            minWidth: '200px',
            cell: row => (
                <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {row.office_name || '-'}
                </div>
            ),
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
            minWidth: '250px',
            wrap: true,
            cell: row => <div style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.address || '-'}</div>,
        },
        {
            name: 'Latitude',
            selector: row => row.latitude,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Longitude',
            selector: row => row.longitude,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
            width: '120px',
            cell: row => (
                <span
                    style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: (row.is_active === 1 || row.is_active === '1') ? '#2ecc71' : '#e74c3c',
                        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
                    }}
                >
                    {(row.is_active === 1 || row.is_active === '1') ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: row => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => navigate(`/office-location/edit/${row.id}`)}
                        style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                        }}
                        title="Edit"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                        }}
                        title="Delete"
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '120px',
        },
    ];



    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                {/* Top bar with add button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Office Locations Management</h2>
                    <button
                        onClick={() => navigate('/add-office-location')}
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
                        <i className="fa fa-plus"></i> Add New Location
                    </button>
                </div>

                {/* Filters Card */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>

                            {/* Search Box */}
                            <input
                                type="text"
                                placeholder="Search by Keyword..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '25px',
                                    border: '1px solid #ced4da',
                                    width: '100%',
                                    maxWidth: '350px',
                                    outline: 'none',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #3498db'}
                                onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
                            />

                            <div className="d-flex" style={{ gap: '15px' }}>

                                <button
                                    onClick={() => { setKeyword(''); setTimeout(() => fetchData(1, perPage, ''), 0); }}
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'background 0.3s',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
                                    onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
                                >
                                    Refresh <i className={`fa fa-refresh ml-2 ${loading ? 'fa-spin' : ''}`}></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* DataTable Card */}
                <div className="card" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body" style={{ padding: '0' }}>
                        <DataTable
                            columns={columns}
                            data={locations}
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
                            persistTableHead
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No Office Locations found.</div>}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OfficeList;
