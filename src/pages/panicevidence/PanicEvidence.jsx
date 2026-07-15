import React, { useState, useEffect, useMemo } from 'react';
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
      color: '#343a40', // Changed from red to standard dark text
      backgroundColor: '#ffffff',
      '&:hover': {
        backgroundColor: '#f1f5f9', // Light gray hover
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

const PanicEvidence = () => {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapModalData, setMapModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvidences = async () => {
      try {
        let allData = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await api.get(`user/getUserEvidence/1/${page}`);
          
          if (Array.isArray(response.data) && response.data.length > 0) {
            const formattedData = response.data.map(item => ({
              id: item.id,
              alertId: item.id,
              name: item.first_name || 'N/A',
              email: item.email || 'N/A',
              mobile: item.mobile_no || 'N/A',
              latitude: item.user_lat || '-',
              longitude: item.user_long || '-',
              datetime: item.timestamp,
              panicType: item.panic_type_value || 'Panic',
              tenant: item.tenant_name || 'N/A'
            }));
            
            allData = [...allData, ...formattedData];
            
            // If we receive less than 10 items, it's the last page
            if (response.data.length < 10) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            // No data array returned
            hasMore = false;
          }
        }
        
        setEvidences(allData);
      } catch (error) {
        console.error("Error fetching panic evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidences();
  }, []);

  // DataTable Columns Configuration
  const columns = [
    {
      name: '#',
      selector: (row) => filteredEvidences.indexOf(row) + 1,
      sortable: false,
      width: '60px',
    },
    {
      name: 'Alert',
      selector: row => row.alertId,
      sortable: true,
      minWidth: '110px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      minWidth: '160px',
      cell: row => <div style={{ fontWeight: 'bold' }}>{row.name}</div>,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      minWidth: '250px',
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      sortable: true,
      minWidth: '140px',
    },
    {
      name: 'Latitude',
      selector: row => row.latitude,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Longitude',
      selector: row => row.longitude,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Date/Time',
      selector: row => row.datetime,
      sortable: true,
      minWidth: '180px',
    },
    {
      name: 'Panic type',
      selector: row => row.panicType,
      sortable: true,
      minWidth: '140px',
      cell: row => (
        <span style={{
          backgroundColor: '#ffeaa7',
          color: '#d35400',
          padding: '4px 10px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          {row.panicType}
        </span>
      ),
    },
    {
      name: 'Tenant',
      selector: row => row.tenant,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Panic Evidences',
      cell: row => {
        const actionButtons = [
          { id: 'inspect', icon: 'fa fa-search-plus', bg: '#3498db', hoverBg: '#2980b9', title: 'Inspect Details' },
          { id: 'location', icon: 'fa fa-map', bg: '#e74c3c', hoverBg: '#c0392b', title: 'Track Location' },
          // { id: 'reports', icon: 'fa fa-file-archive-o', bg: '#2ecc71', hoverBg: '#27ae60', title: 'Attached Reports' },
          // { id: 'download', icon: 'fa fa-cloud-download', bg: '#9b59b6', hoverBg: '#8e44ad', title: 'Save Offline' }
        ];

        return (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '5px 0' }}>
            {actionButtons.map((btn) => (
              <button
                key={btn.id}
                style={btnStyle(btn.bg, btn.hoverBg)}
                title={btn.title}
                onClick={() => {
                  if (btn.id === 'inspect') {
                    navigate(`/panic-evidence-detail/${row.alertId}`);
                  } else if (btn.id === 'location') {
                    setMapModalData(row);
                  } else {
                    alert(`${btn.title} clicked for Alert ${row.alertId}`);
                  }
                }}
              >
                <i className={btn.icon}></i>
              </button>
            ))}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '220px',
    },
  ];

  // Helper for button styles
  function btnStyle(bg, hoverBg) {
    return {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: bg,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.2s',
      fontSize: '14px'
    };
  }

  // Filtering Logic
  const filteredEvidences = evidences.filter(ev => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ev.name.toLowerCase().includes(searchLower) ||
      ev.email.toLowerCase().includes(searchLower) ||
      ev.mobile.includes(searchTerm) ||
      ev.alertId.includes(searchTerm)
    );
  });

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">

        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>All Evidences</h3>
          </div>

          <div className="card-body" style={{ padding: '30px' }}>
            {/* Top Bar with Search and Abbreviation */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4" style={{ gap: '15px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-control"
                style={{
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ced4da',
                  width: '100%',
                  maxWidth: '300px',
                  outline: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #3498db'}
                onBlur={(e) => e.target.style.border = '1px solid #ced4da'}
              />

              {/* <div style={{ color: '#555', fontSize: '14px', fontWeight: '500' }}>
                Abbreviation - 1.NA: No Action, 2.NO: NO
              </div> */}
            </div>

            {/* DataTable */}
            <DataTable
              columns={columns}
              data={filteredEvidences}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30]}
              highlightOnHover
              pointerOnHover
              responsive
              progressPending={loading}
              persistTableHead
              noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No evidences found.</div>}
            />

          </div>
        </div>

      </div>

      {/* Map Modal */}
      {mapModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '700px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '20px 25px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
              <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>
                <i className="fa fa-map-marker text-danger mr-2"></i> Location - <span style={{ textTransform: 'capitalize' }}>{mapModalData.name}</span> (Alert: {mapModalData.alertId})
              </h5>
              <button onClick={() => setMapModalData(null)} style={{ border: 'none', background: 'transparent', fontSize: '28px', lineHeight: '1', cursor: 'pointer', color: '#7f8c8d', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#e74c3c'} onMouseOut={e => e.target.style.color = '#7f8c8d'}>&times;</button>
            </div>
            <div style={{ height: '450px', width: '100%', position: 'relative' }}>
              <iframe
                title="Evidence Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${mapModalData.latitude},${mapModalData.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PanicEvidence;
