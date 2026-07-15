import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const initialDevices = [
    {
        id: 1,
        name: '4G',
        imei: '861261029135874',
        datetime: '2025-11-12 18:19:16'
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

const TrackerDevice = () => {
    const [devices, setDevices] = useState(initialDevices);
    const [filterText, setFilterText] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentDevice, setCurrentDevice] = useState({ id: null, name: '', imei: '' });

    const filteredItems = devices.filter(
        item =>
            (item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.imei && item.imei.toLowerCase().includes(filterText.toLowerCase()))
    );

    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentDevice({ id: null, name: '', imei: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (device) => {
        setIsEditMode(true);
        setCurrentDevice({ ...device });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            setDevices(devices.filter(d => d.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            setDevices(devices.map(d => (d.id === currentDevice.id ? { ...currentDevice, datetime: d.datetime } : d)));
        } else {
            const newDevice = {
                ...currentDevice,
                id: Date.now(),
                datetime: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            setDevices([...devices, newDevice]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            name: '#',
            selector: (row) => filteredItems.indexOf(row) + 1,
            sortable: false,
            width: '60px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'IMEI',
            selector: row => row.imei,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Date/Time',
            selector: row => row.datetime,
            sortable: true,
            minWidth: '200px',
        },
        {
            name: 'Action',
            cell: row => {
                return (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '8px 0' }}>
                        <i
                            className="fa fa-pencil text-primary"
                            style={{ cursor: 'pointer', fontSize: '16px' }}
                            onClick={() => openEditModal(row)}
                            title="Edit"
                        ></i>
                        <i
                            className="fa fa-times text-danger"
                            style={{ cursor: 'pointer', fontSize: '18px' }}
                            onClick={() => handleDelete(row.id)}
                            title="Delete"
                        ></i>
                    </div>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '100px',
        },
    ];

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">

                {/* Top Card: Title, Search & Add Button */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body" style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Tracker Device</h3>

                        <div className="d-flex align-items-center">
                            <div style={{ width: '250px', marginRight: '15px' }}>
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
                            <button
                                className="btn btn-primary"
                                onClick={openAddModal}
                                style={{
                                    background: '#0056b3',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Add Tracker Device
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Card: DataTable */}
                <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
                    <div className="card-body" style={{ padding: '20px' }}>
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

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '15px', width: '90%', maxWidth: '500px',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{
                            padding: '20px 25px',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#f8fafc'
                        }}>
                            <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 'bold' }}>
                                {isEditMode ? 'Edit Tracker Device' : 'Add Tracker Device'}
                            </h4>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    border: 'none', background: 'transparent', fontSize: '24px',
                                    cursor: 'pointer', color: '#64748b', padding: '0 5px'
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
                            <div className="form-group mb-4">
                                <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={currentDevice.name}
                                    onChange={(e) => setCurrentDevice({ ...currentDevice, name: e.target.value })}
                                    style={{ borderRadius: '8px', padding: '10px 15px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>IMEI</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={currentDevice.imei}
                                    onChange={(e) => setCurrentDevice({ ...currentDevice, imei: e.target.value })}
                                    style={{ borderRadius: '8px', padding: '10px 15px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    background: '#0056b3',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 25px',
                                    fontWeight: '600',
                                    marginTop: '10px'
                                }}
                            >
                                Submit
                            </button>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackerDevice;