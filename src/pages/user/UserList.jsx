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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    // Reset all filters to their original/empty state
    setSearchTerm('');
    setStatusFilter('');
    setTenantFilter('');
    try {
      const usersRes = await api.get('/user/getUsersCSV');
      const usersData = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.data || []);
      setUsers(usersData);

      const tenantsRes = await api.get('/user/getAdmin');
      const tenantsData = Array.isArray(tenantsRes.data) ? tenantsRes.data : (tenantsRes.data?.data || []);
      setTenants(tenantsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users and Tenants from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle Delete
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
          const response = await api.get(`/admin/delete_user/${id}`);
          const data = response.data;

          if (data.status === "success" || data.code === 200) {
            Swal.fire(
              'Deleted!',
              data.message || 'User deleted successfully.',
              'success'
            );
            // Update local state to reflect deletion
            setUsers(prevUsers => prevUsers.filter(user => user.uid !== id && user.id !== id));
          } else {
            Swal.fire(
              'Error!',
              data.message || 'Failed to delete user.',
              'error'
            );
          }
        } catch (error) {
          console.error("API error:", error);
          const errorMessage = error.response?.data?.message || 'An error occurred while deleting.';
          Swal.fire(
            'Error!',
            errorMessage,
            'error'
          );
        }
      }
    });
  };

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  // DataTable Columns Configuration with updated keys based on API
  const columns = [
    {
      name: '#',
      selector: (row) => filteredUsers.indexOf(row) + 1,
      sortable: false,
      width: '100px',
    },
    {
      name: 'Name',
      selector: row => row.first_name,
      sortable: true,
      minWidth: '150px',
      cell: row => <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{row.first_name || '-'}</div>,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      minWidth: '250px',
      wrap: true,
      cell: row => <div style={{ wordBreak: 'break-all' }}>{row.email || '-'}</div>,
    },
    {
      name: 'Mobile No',
      selector: row => row.mobile_no,
      sortable: true,
      minWidth: '150px',
      cell: row => <div>{row.mobile_no || '-'}</div>,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      sortable: true,
      minWidth: '120px',
      cell: row => <div>{row.gender || '-'}</div>,
    },
    {
      name: 'DOB',
      selector: row => row.date_of_birth,
      sortable: true,
      minWidth: '120px',
      cell: row => <div>{row.date_of_birth || '-'}</div>,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      minWidth: '120px',
      cell: row => (
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: row.status === 'Active' ? '#2ecc71' : row.status === 'Inactive' ? '#e74c3c' : '#f1c40f',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          {row.status || 'Pending'}
        </span>
      ),
    },
    {
      name: 'Licence',
      selector: row => row.licence,
      sortable: true,
      minWidth: '100px',
      cell: row => <div>{row.licence || '-'}</div>,
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleEdit(row.uid)}
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
              gap: '6px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            onClick={() => handleDelete(row.uid)}
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
              gap: '6px'
            }}
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
      width: '180px',
    },
  ];

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.first_name || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobile_no || '').includes(searchTerm);

    // Helper to normalize status for robust comparison (e.g. Inactive vs In-Active, lowercase vs uppercase)
    const normalizeStatus = (val) => {
      if (!val) return '';
      return String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const matchesStatus = statusFilter === '' ||
      normalizeStatus(user.status) === normalizeStatus(statusFilter);

    // Check various potential tenant keys since API response format might vary
    const matchesTenant = tenantFilter === '' ||
      (user.tenant && String(user.tenant).toLowerCase() === tenantFilter.toLowerCase()) ||
      (user.tenant_name && String(user.tenant_name).toLowerCase() === tenantFilter.toLowerCase()) ||
      (user.tenant_licence_id && String(user.tenant_licence_id) === tenantFilter);

    return matchesSearch && matchesStatus && matchesTenant;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ['UID', 'Name', 'Email', 'Mobile', 'Gender', 'DOB', 'Status', 'Licence'];
    const csvRows = filteredUsers.map(u =>
      `${u.uid},"${u.first_name || ''}","${u.email || ''}","${u.mobile_no || ''}","${u.gender || ''}","${u.date_of_birth || ''}","${u.status || ''}","${u.licence || ''}"`
    );
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
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
            <h4 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' }}>Filter Users</h4>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100" style={{ gap: '15px' }}>

              {/* Search Box */}
              <input
                type="text"
                placeholder="Search Name, Email, or Mobile..."
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

              {/* Select & Export Area */}
              <div className="d-flex flex-column flex-md-row align-items-center w-100" style={{ gap: '15px', justifyContent: 'flex-end' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '25px',
                    border: '1px solid #ced4da',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '200px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="In-active">In-Active</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '25px',
                    border: '1px solid #ced4da',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '200px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  <option value="">Select User</option>
                  {tenants.map(tenant => (
                    <option key={tenant.uid} value={tenant.first_name}>
                      {tenant.first_name}
                    </option>
                  ))}
                </select>

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
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '25px' }}>Users Management</h3>

            <DataTable
              columns={columns}
              data={filteredUsers}
              customStyles={customStyles}
              progressPending={loading}
              pagination
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100, 150, 200]}
              highlightOnHover
              pointerOnHover
              responsive
              noDataComponent={<div style={{ padding: '24px', fontSize: '16px', color: '#7f8c8d' }}>No users found matching your criteria.</div>}
            />

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserList;
