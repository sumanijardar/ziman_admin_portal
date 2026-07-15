import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

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

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const flattenTree = (nodes, level = 0) => {
    let flatList = [];
    nodes.forEach(node => {
      flatList.push({ ...node, displayLevel: level });
      if (node.children && node.children.length > 0) {
        flatList = flatList.concat(flattenTree(node.children, level + 1));
      }
    });
    return flatList;
  };

  const fetchData = async () => {
    setLoading(true);
    setSearchTerm('');
    try {
      const response = await api.get('/faq/get_tree');
      let data = response.data?.data || response.data || [];
      if (Array.isArray(data)) {
        // Flatten the tree to display in a flat data table
        const flatData = flattenTree(data);
        setFaqs(flatData);
      }
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! Nested questions will also be deleted if you choose.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Pass recursive=1 to delete nested children
          const response = await api.post(`/faq/delete/${id}`, { recursive: 1 });
          const data = response.data;

          if (data.status === "success" || data.code === 200 || data.success) {
            Swal.fire('Deleted!', data.message || 'FAQ deleted successfully.', 'success');
            fetchData();
          } else {
            Swal.fire('Error!', data.message || 'Failed to delete FAQ.', 'error');
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
      selector: (row) => filteredFaqs.indexOf(row) + 1,
      sortable: false,
      width: '80px',
    },
    {
      name: 'Question',
      selector: row => row.question,
      sortable: true,
      minWidth: '250px',
      cell: row => (
        <div style={{ paddingLeft: `${row.displayLevel * 20}px`, fontWeight: row.displayLevel === 0 ? 'bold' : 'normal', color: '#2c3e50' }}>
          {row.displayLevel > 0 && <span style={{ marginRight: '5px', color: '#95a5a6' }}>↳</span>}
          {row.question || '-'}
        </div>
      ),
    },
    {
      name: 'Answer',
      selector: row => row.answer,
      sortable: true,
      minWidth: '250px',
      wrap: true,
      cell: row => <div style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.answer || '-'}</div>,
    },
    {
      name: 'Sort Order',
      selector: row => row.sort_order,
      sortable: true,
      width: '180px',
      cell: row => <div>{row.sort_order || '0'}</div>,
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
            onClick={() => navigate(`/faq/edit/${row.id}`)}
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

  const filteredFaqs = faqs.filter(faq => {
    return (faq.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.answer || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">

        {/* Top bar with add button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>FAQ Management</h2>
          <button
            onClick={() => navigate('/faq/add')}
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
            <i className="fa fa-plus"></i> Add New FAQ
          </button>
        </div>

        {/* Filters Card */}
        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>

              {/* Search Box */}
              <input
                type="text"
                placeholder="Search Questions or Answers..."
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

              <div className="d-flex" style={{ gap: '15px' }}>
                <button
                  onClick={fetchData}
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
              data={filteredFaqs}
              customStyles={customStyles}
              progressPending={loading}
              pagination
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]}
              highlightOnHover
              pointerOnHover
              responsive
              noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No FAQs found.</div>}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaqList;
