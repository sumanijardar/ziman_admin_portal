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

const Tracking = () => {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await api.get('admin/getTracking/1');
        const trackingList = response.data?.data || response.data;
        if (Array.isArray(trackingList)) {
          const formattedData = trackingList.map(item => {
            let lat = '0', lng = '0';
            try {
              const locStr = item.end_location || item.start_location;
              if (locStr) {
                const locObj = JSON.parse(locStr);
                lat = locObj.lat || '0';
                lng = locObj.lng || '0';
              }
            } catch (e) {
              console.error("Error parsing location", e);
            }

            return {
              id: item.id,
              trackee: item.trackee_id || 'N/A',
              tracker: item.tracker_id || 'N/A',
              startTime: item.start_time || '-',
              endTime: item.end_time || '-',
              shareTime: item.share_time ? `${item.share_time} mins` : '-',
              status: item.status || 'N/A',
              tenant: item.tenant_name || 'N/A',
              lat,
              lng
            };
          });
          setTrackings(formattedData);
        }
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, []);

  const handleViewMap = (row) => {
    setSelectedTrack(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  const filteredItems = trackings.filter(
    item =>
      (item.trackee && item.trackee.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.tracker && item.tracker.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns = [
    {
      name: '#',
      selector: (row) => filteredItems.indexOf(row) + 1,
      sortable: false,
      width: '60px',
    },
    {
      name: 'Trackee',
      selector: row => row.trackee,
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Tracker',
      selector: row => row.tracker,
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Start Time',
      selector: row => row.startTime,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'End Time',
      selector: row => row.endTime,
      sortable: true,
      minWidth: '180px',
      wrap: true,
    },
    {
      name: 'Share Time',
      selector: row => row.shareTime,
      sortable: true,
      minWidth: '150px',
      wrap: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      minWidth: '120px',
      wrap: true,
    },
    {
      name: 'Tenant',
      selector: row => row.tenant,
      sortable: true,
      minWidth: '130px',
      wrap: true,
    },
    {
      name: 'View Map',
      cell: row => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                color: '#c0392b',
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
              title="View Map"
              onClick={() => handleViewMap(row)}
            >
              <i className="fa fa-map"></i> View
            </button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '130px',
    },
  ];

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">

        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>All Tracking</h3>
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
              progressPending={loading}
              persistTableHead
              noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No records found.</div>}
            />

          </div>
        </div>

      </div>

      {/* Map Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '15px', width: '90%', maxWidth: '900px',
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
                <i className="fa fa-map-marker text-danger me-2"></i>
                Tracking Map: {selectedTrack?.trackee}
              </h4>
              <button
                onClick={closeModal}
                style={{
                  border: 'none', background: 'transparent', fontSize: '24px',
                  cursor: 'pointer', color: '#64748b', padding: '0 5px'
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '20px', height: '500px' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${selectedTrack?.lat},${selectedTrack?.lng}&hl=en&z=15&output=embed`}
                style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
