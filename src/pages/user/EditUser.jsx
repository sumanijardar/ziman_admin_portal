import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style.css';
import api from '../../services/api';
import Swal from 'sweetalert2';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: '',
    day: '',
    sapcode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobile: '',
    emergentNo1: '',
    emergentNo2: '',
    emergentNo3: '',
    emergentNo4: '',
    bloodGroup: '',
    gender: '',
    dob: '',
    age: '',
    status: '',
    address: ''
  });

  useEffect(() => {
    // Fetch user details by ID from API here
    if (id) {
      // e.g. api.get(`/user/getUserInfo/${id}`).then(...)
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("sap_code", formData.sapcode || "");
    formdata.append("first_name", formData.firstName || "");
    formdata.append("middle_name", formData.middleName || "");
    formdata.append("last_name", formData.lastName || "");
    formdata.append("mobile_no", formData.mobile || "");
    formdata.append("email", formData.email || "");
    formdata.append("designation", "");
    formdata.append("Department_Name", "");
    formdata.append("gender", formData.gender || "");
    formdata.append("blood_group", formData.bloodGroup || "");
    formdata.append("age", formData.age || "");

    let formattedDob = formData.dob;
    if (formattedDob && formattedDob.includes('-')) {
      const parts = formattedDob.split('-');
      if (parts[0].length === 4) {
        formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    formdata.append("date_of_birth", formattedDob || "");
    formdata.append("branch_code", "");
    formdata.append("emergency_contact_1", formData.emergentNo1 || "");
    formdata.append("emergency_contact_2", formData.emergentNo2 || "");
    formdata.append("emergency_contact_3", formData.emergentNo3 || "");
    formdata.append("emergency_contact_4", formData.emergentNo4 || "");
    formdata.append("status", formData.status || "");
    formdata.append("address", formData.address || "");
    formdata.append("start_date", formData.startDate || "");
    formdata.append("day", formData.day || "");

    try {
      const response = await api.post(`/admin/updateUser/${id}`, formdata);
      const result = response.data;

      if (result.status === "success" || result.code === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || "User updated successfully.",
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/users');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || "Error updating user.",
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating the user.";
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="zf-container">
          <div className="zf-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 className="zf-title" style={{ margin: 0 }}>Edit User Details</h2>
                            <button 
                                type="button"
                                onClick={() => navigate(-1)} 
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    backgroundColor: '#7f8c8d',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <i className="fa fa-arrow-left"></i> Back
                            </button>
                        </div>
            <form onSubmit={handleSubmit} className="zf-form-grid">

              <div className="zf-section-title">Personal Details</div>

              <div className="zf-input-group">
                <label className="zf-label">SAP Code</label>
                <input type="text" name="sapcode" value={formData.sapcode} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Middle Name</label>
                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="zf-input" />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="zf-input" />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="zf-select" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="zf-select">
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="zf-section-title">Contact Information</div>

              <div className="zf-input-group">
                <label className="zf-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Mobile Number</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group zf-full-width">
                <label className="zf-label">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="zf-textarea" required></textarea>
              </div>

              <div className="zf-section-title">Emergency Contacts</div>

              <div className="zf-input-group">
                <label className="zf-label">Emergency Number 1</label>
                <input type="tel" name="emergentNo1" value={formData.emergentNo1} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Emergency Number 2</label>
                <input type="tel" name="emergentNo2" value={formData.emergentNo2} onChange={handleChange} className="zf-input" />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Emergency Number 3</label>
                <input type="tel" name="emergentNo3" value={formData.emergentNo3} onChange={handleChange} className="zf-input" />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Emergency Number 4</label>
                <input type="tel" name="emergentNo4" value={formData.emergentNo4} onChange={handleChange} className="zf-input" />
              </div>

              <div className="zf-section-title">Plan Details</div>

              <div className="zf-input-group">
                <label className="zf-label">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="zf-input" required />
              </div>

              <div className="zf-input-group">
                <label className="zf-label">Day</label>
                <input type="text" name="day" value={formData.day} onChange={handleChange} className="zf-input" placeholder="e.g. Monday" />
              </div>

              {/* <div className="zf-input-group">
                <label className="zf-label">Select Plan</label>
                <select name="plan" value={formData.plan} onChange={handleChange} className="zf-select" required>
                  <option value="">Select a Plan</option>
                  <option value="Basic">Basic Plan</option>
                  <option value="Premium">Premium Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div> */}

              <div className="zf-input-group">
                <label className="zf-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="zf-select" required>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <button type="submit" className="zf-submit-btn">
                Update Details
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
