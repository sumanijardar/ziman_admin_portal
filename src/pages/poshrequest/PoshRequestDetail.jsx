import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PoshRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poshData, setPoshData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoshDetail = async () => {
      try {
        const response = await api.get(`user/getUserPoshDetail/${id}`);
        let data = response.data;

        // Handle array or object
        if (Array.isArray(data)) {
          data = data[0];
        }

        if (data) {
          setPoshData({
            alertId: id,
            name: data.name_raising_posh || data.first_name || data.name || 'N/A',
            mobile: data.mobile_no || data.mobile || 'N/A',
            date: data.date || data.timestamp || 'N/A',
            employeeRaisingName: data.name_raising_posh || data.employee_raising_name || data.first_name || 'N/A',
            emp_id: data.emp_id || data.employee_id || 'N/A',
            department: data.department || 'N/A',
            incident_detail: data.incident_detail || data.incidentDetails || data.incident_details || 'N/A',
            dateOccurred: data.occurred_date || data.dateOccurred || data.date_occurred || 'N/A',
            timeOccurred: data.occurrece_time || data.timeOccurred || data.time_occurred || 'N/A',
            location: data.location || 'N/A',
            involved_emp_name: data.involved_emp_name || data.employeeInvolved || data.employee_involved || 'N/A',
            involved_emp_id: data.involved_emp_id || data.employeeIdInvolved || data.employee_id_involved || 'N/A',
            departmentInvolved: data.involved_emp_department || data.departmentInvolved || data.department_involved || 'N/A'
          });
        }
      } catch (error) {
        console.error("Error fetching posh detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoshDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="content-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!poshData) {
    return (
      <div className="content-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h4>No details found for this request.</h4>
      </div>
    );
  }

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">

        {/* Header Section */}
        <div className="d-flex align-items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline-secondary mr-3"
            style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          <h3 style={{ fontWeight: '500', color: '#555', margin: 0 }}>
            Posh - <span style={{ textTransform: 'capitalize' }}>{poshData.name}</span>({poshData.mobile})
          </h3>
        </div>

        {/* Main Details Card */}
        <div className="card" style={{ borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: 'none' }}>
          <div className="card-body" style={{ padding: '40px' }}>
            <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '25px', fontSize: '22px' }}>Posh Detail</h4>

            <div style={{ fontSize: '15px', color: '#34495e', lineHeight: '2.5' }}>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Date:</strong> {poshData.date}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Name of the employee raising the posh:</strong> {poshData.employeeRaisingName}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Employee Id:</strong> {poshData.emp_id}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Department:</strong> {poshData.department}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Details of the incident:</strong> {poshData.incident_detail}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Date when Occurred:</strong> {poshData.dateOccurred}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Time of occurrece:</strong> {poshData.timeOccurred}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Location:</strong> {poshData.location}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Name/s of the employee involved:</strong> {poshData.involved_emp_name}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Employee Id/s:</strong> {poshData.involved_emp_id}</div>
              <div><strong style={{ display: 'inline-block', width: '320px' }}>Department/s:</strong> {poshData.department}</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PoshRequestDetail;
