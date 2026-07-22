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

const TravelSafe = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchTravels = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/user/getPreTriggerNotifications/1/${page}`);

      const data = response.data?.data || response.data || [];
      
      // Calculate total rows based on pagination fields in the response (nxt_page_id)
      let total = data.length;
      if (data.length > 0) {
        const currentPage = data[0].curr_page_id || page;
        const hasNextPage = data[0].nxt_page_id && data[0].nxt_page_id !== 0;
        
        if (hasNextPage) {
          // Force DataTable to show the Next page button
          total = (currentPage * 10) + 1;
        } else {
          // On the last page, total is exact
          total = ((currentPage - 1) * 10) + data.length;
        }
      }
      
      setTravels(data);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching travels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels(1);
  }, []);

  const handlePageChange = page => {
    fetchTravels(page);
  };

  // DataTable Columns Configuration
  const columns = [
    {
      name: '#',
      selector: (row, index) => row.sr_no || index + 1,
      sortable: false,
      width: '60px',
    },
    {
      name: 'Name',
      selector: row => row.user_id || row.name || 'N/A',
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Mobile No',
      selector: row => row.mobile_no || row.mobile || 'N/A',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Start Date Time',
      selector: row => row.tracking_start_time || row.startDateTime || 'N/A',
      sortable: true,
      minWidth: '220px',
      wrap: true,
    },
    {
      name: 'Stop Date Time',
      selector: row => row.tracking_end_time || row.stopDateTime || 'N/A',
      sortable: true,
      minWidth: '220px',
      wrap: true,
    },
    {
      name: 'Vehicle Number',
      selector: row => row.vehicle_number || row.vehicleNumber || 'N/A',
      sortable: true,
      minWidth: '200px',
      wrap: true,
    },
    {
      name: 'Last Status',
      selector: row => row.last_status || row.lastStatus || 'N/A',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },

    {
      name: 'View',
      cell: row => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                color: '#2c3e50',
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
                navigate(`/travel-safe-detail/${row.tracking_id || row.id || row._id}`);
              }}
            >
              <i className="fa fa-eye"></i> Details
            </button>

          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '220px',
    },
  ];

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">

        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Travel Safe</h3>
          </div>

          <div className="card-body" style={{ padding: '30px', paddingTop: '10px' }}>
            {/* DataTable */}
            <DataTable
              columns={columns}
              data={travels}
              customStyles={customStyles}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangePage={handlePageChange}
              paginationPerPage={perPage}
              paginationComponentOptions={{ noRowsPerPage: true }}
              highlightOnHover
              pointerOnHover
              persistTableHead
              responsive
              noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No records found.</div>}
            />

          </div>
        </div>

      </div>
    </div>
  );
};

export default TravelSafe;
