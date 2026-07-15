import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../Style.css';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Editofficelocation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        office_name: '',
        address: '',
        lat: '',
        long: '',
        is_active: '1'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await api.get(`/OfficeLocation/view/${id}`);
                const result = response.data;
                
                if (result.status === 'success' || result.code === 200) {
                    const data = result.data;
                    setFormData({
                        office_name: data.office_name || '',
                        address: data.address || '',
                        lat: data.latitude || '',
                        long: data.longitude || '',
                        is_active: data.is_active != null ? data.is_active.toString() : '1'
                    });
                } else {
                    Swal.fire('Error', result.message || 'Failed to fetch location details.', 'error');
                }
            } catch (error) {
                console.error("Error fetching location details:", error);
                Swal.fire('Error', 'An error occurred while fetching details.', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLocation();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchCoordinates = async () => {
        if (!formData.address.trim()) {
            Swal.fire('Error', 'Please enter an address first to fetch coordinates.', 'error');
            return;
        }
        
        // Show loading state
        Swal.fire({
            title: 'Fetching Coordinates...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const GOOGLE_API_KEY = "AIzaSyCE1wdfavAG6p3Yztj_f2vH_TGE3n1yJ5I";
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formData.address)}&key=${GOOGLE_API_KEY}`);
            const data = await response.json();
            
            if (data.status === "OK" && data.results && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                setFormData(prev => ({
                    ...prev,
                    lat: location.lat,
                    long: location.lng
                }));
                Swal.fire('Success', 'Coordinates fetched successfully!', 'success');
            } else {
                const errorMessage = data.error_message || `Status: ${data.status}. Please try a more specific address.`;
                Swal.fire('Not Found / Error', errorMessage, 'warning');
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            Swal.fire('Error', 'Failed to fetch coordinates. Check your internet connection.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("office_name", formData.office_name);
        formdata.append("address", formData.address);
        formdata.append("latitude", formData.lat);
        formdata.append("longitude", formData.long);
        formdata.append("is_active", formData.is_active);

        try {
            const response = await api.post(`/OfficeLocation/update/${id}`, formdata);
            const result = response.data;

            if (result.status === "success" || result.code === 200 || result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.message || "Office location updated successfully.",
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/office-location');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || "Error updating office location.",
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error("API error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred while updating.";
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#d33'
            });
        }
    };

    if (loading) {
        return (
            <div className="content-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="content-body">
            <div className="container-fluid">
                <div className="zf-container">
                    <div className="zf-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 className="zf-title" style={{ margin: 0 }}>Edit Office Location</h2>
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

                            <div className="zf-section-title">Office Details</div>

                            <div className="zf-input-group zf-full-width">
                                <label className="zf-label">Office Name</label>
                                <input
                                    type="text"
                                    name="office_name"
                                    value={formData.office_name}
                                    onChange={handleChange}
                                    className="zf-input"
                                    required
                                    placeholder="Enter the office name"
                                />
                            </div>

                            <div className="zf-input-group zf-full-width">
                                <label className="zf-label">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="zf-textarea"
                                    rows="4"
                                    required
                                    placeholder="Enter full address"
                                ></textarea>
                                <button 
                                    type="button" 
                                    onClick={fetchCoordinates}
                                    style={{
                                        marginTop: '10px',
                                        padding: '8px 16px',
                                        backgroundColor: '#3498db',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'inline-block',
                                        width: 'fit-content'
                                    }}
                                >
                                    <i className="fa fa-map-marker" style={{ marginRight: '5px' }}></i> 
                                    Get Lat/Long from Address
                                </button>
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Latitude (Lat)</label>
                                <input
                                    type="text"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    className="zf-input"
                                    required
                                    placeholder="e.g. 28.704060"
                                    readOnly
                                    style={{ backgroundColor: '#f4f6f9', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Longitude (Long)</label>
                                <input
                                    type="text"
                                    name="long"
                                    value={formData.long}
                                    onChange={handleChange}
                                    className="zf-input"
                                    required
                                    placeholder="e.g. 77.102493"
                                    readOnly
                                    style={{ backgroundColor: '#f4f6f9', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Status</label>
                                <select name="is_active" value={formData.is_active} onChange={handleChange} className="zf-select" required>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
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

export default Editofficelocation;
