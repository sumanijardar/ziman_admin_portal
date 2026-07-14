import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

const initialTrips = [
    {
        id: 1,
        user: 'Rahul Sharma',
        trips: '5',
    },
    {
        id: 2,
        user: 'Priya Singh',
        trips: '2',
    }
];

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

const Trip = () => {
    const [tripsData, setTripsData] = useState(initialTrips);
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    const filteredItems = tripsData.filter(
        item =>
            (item.user && item.user.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.trips && item.trips.toLowerCase().includes(filterText.toLowerCase()))
    );

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '60px',
        },
        {
            name: 'User',
            selector: row => row.user,
            sortable: true,
            minWidth: '200px',
            wrap: true,
        },
        {
            name: 'Trips',
            selector: row => row.trips,
            sortable: true,
            minWidth: '300px',
            wrap: true,
        },
        {
            name: 'Action',
            cell: row => {
                return (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
                        <button
                            style={{
                                background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                                color: '#1e3c72',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            title="View Details"
                            onClick={() => {
                                navigate(`/trip-detail/${row.id}`);
                            }}
                        >
                            <i className="fa fa-eye"></i> View
                        </button>
                    </div>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '150px',
        },
    ];

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>All Trips</h3>
                    </div>

                    <div className="card-body" style={{ padding: '30px', paddingTop: '10px' }}>
                        {/* Search Bar */}
                        <div className="mb-3" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control"
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #ced4da',
                                    padding: '10px 15px',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
                                }}
                            />
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns}
                            data={filteredItems}
                            customStyles={customStyles}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30]}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No records found.</div>}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Trip;