import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useParams, useNavigate } from 'react-router-dom';

const initialDetails = [
  { id: 1, status: 'Safe', latitude: '19.1139514', longitude: '72.8651172', datetime: '2026-05-29 14:17:34' },
  { id: 2, status: 'No Action', latitude: '19.1139514', longitude: '72.8651172', datetime: '2026-05-29 14:17:27' },
  { id: 3, status: 'Safe', latitude: '19.113887', longitude: '72.8650365', datetime: '2026-05-29 14:10:01' },
  { id: 4, status: 'Unsafe', latitude: '19.1140633', longitude: '72.8651414', datetime: '2026-05-29 14:04:35' },
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

const TravelSafeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(initialDetails);
  const [filterText, setFilterText] = useState('');

  const filteredItems = details.filter(
    item => 
      (item.status && item.status.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.datetime && item.datetime.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '60px',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Latitude',
      selector: row => row.latitude,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Longitude',
      selector: row => row.longitude,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: 'Date/Time',
      selector: row => row.datetime,
      sortable: true,
      minWidth: '200px',
    },
  ];

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            style={{ borderRadius: '20px', padding: '8px 20px', fontWeight: 'bold' }}
          >
            <i className="fa fa-arrow-left me-2"></i> Back
          </button>
        </div>

        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Travel Safe Detail</h3>
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

export default TravelSafeDetail;
