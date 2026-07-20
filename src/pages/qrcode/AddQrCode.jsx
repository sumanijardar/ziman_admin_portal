import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style.css';
import api from '../../services/api';
import Swal from 'sweetalert2';

const AddQrCode = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: '',
        type: '',
        code_for: ''
    });

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
        formdata.append("code", formData.code);
        if (formData.type) formdata.append("type", formData.type);
        if (formData.code_for) formdata.append("code_for", formData.code_for);

        try {
            const response = await api.post("/qrcode/AddQrcode", formdata);
            const result = response.data;

            if (result.code === 200 && result.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.msg || "QR Code added successfully.",
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/qrcode-list');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.msg || "Error adding QR Code.",
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error("API error:", error);
            const errorMessage = error.response?.data?.msg || error.response?.data?.message || "An error occurred while adding the QR Code.";
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
                            <h2 className="zf-title" style={{ margin: 0 }}>Add New QR Code</h2>
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
                            <div className="zf-section-title">QR Code Details</div>

                            <div className="zf-input-group zf-full-width">
                                <label className="zf-label">Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="zf-input"
                                    required
                                    placeholder="Enter the unique QR Code string identifier"
                                />
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="zf-select">
                                    <option value="">Select Type</option>
                                    <option value="1">Person</option>
                                    <option value="2">Animal</option>
                                    <option value="3">Things</option>
                                    <option value="4">Self</option>
                                </select>
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Code For</label>
                                <select name="code_for" value={formData.code_for} onChange={handleChange} className="zf-select">
                                    <option value="">Select Code For</option>
                                    <option value="1">Self</option>
                                    <option value="2">Other</option>
                                </select>
                            </div>

                            <button type="submit" className="zf-submit-btn">
                                Submit Details
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQrCode;
