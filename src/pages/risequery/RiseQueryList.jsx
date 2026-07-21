import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
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

const RiseQueryList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async (page, size) => {
        setLoading(true);
        try {
            const response = await api.get(`/raisequery/list_raise_query?page=${page}&perpg=${size}`);
            const resData = response.data;

            if (resData.status === 'success') {
                setData(resData.data || []);
                if (resData.pagination) {
                    setTotalRows(resData.pagination.total_records || 0);
                } else {
                    setTotalRows((resData.data || []).length);
                }
            } else {
                setData([]);
                setTotalRows(0);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, perPage);
    }, [currentPage, perPage]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => (currentPage - 1) * perPage + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            minWidth: '150px',
            cell: row => <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{row.name || '-'}</div>,
        },
        {
            name: 'Mobile No',
            selector: row => row.mobile,
            sortable: true,
            minWidth: '150px',
            cell: row => <div>{row.mobile || '-'}</div>,
        },
        {
            name: 'Query',
            selector: row => row.query,
            sortable: true,
            minWidth: '300px',
            wrap: true,
            cell: row => <div style={{ wordBreak: 'break-word', whiteSpace: 'normal', padding: '10px 0' }}>{row.query || '-'}</div>,
        },
        {
            name: 'Created At',
            selector: row => row.created_at,
            sortable: true,
            minWidth: '180px',
            cell: row => <div>{row.created_at || '-'}</div>,
        }
    ];

    // Filtering Logic (client-side for the current page)
    const filteredData = data.filter(item => {
        const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.mobile || '').includes(searchTerm) ||
            (item.query || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Mobile', 'Query', 'Created At'];
        const csvRows = filteredData.map(u =>
            `${u.id},"${u.name || ''}","${u.mobile || ''}","${(u.query || '').replace(/"/g, '""')}","${u.created_at || ''}"`
        );
        const csvString = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rise_queries_export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                {/* Filters Card */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body">
                        <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' }}>Filter Queries</h4>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>

                            {/* Search Box */}
                            <input
                                type="text"
                                placeholder="Search Name, Mobile, or Query..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
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

                            {/* Action Buttons Area */}
                            <div className="d-flex flex-column flex-md-row align-items-center w-100" style={{ gap: '15px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => fetchData(currentPage, perPage)}
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '150px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'background 0.3s',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2980b9')}
                                    onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3498db')}
                                >
                                    Refresh <i className={`fa fa-refresh ml-2 ${loading ? 'fa-spin' : ''}`}></i>
                                </button>

                                <button
                                    onClick={exportToCSV}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: '#2c3e50',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: '150px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#1a252f'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
                                >
                                    Export <i className="fa fa-download ml-2"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* DataTable Card */}
                <div className="card" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body" style={{ padding: '30px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '25px' }}>Raise Queries</h3>

                        <DataTable
                            columns={columns}
                            data={filteredData}
                            customStyles={customStyles}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            persistTableHead
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No queries found matching your criteria.</div>}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RiseQueryList;