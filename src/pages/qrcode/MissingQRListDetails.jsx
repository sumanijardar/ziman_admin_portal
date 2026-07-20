import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MissingQRListDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock data based on the requirements
    const [details, setDetails] = useState(null);

    useEffect(() => {
        // Simulating API fetch
        setTimeout(() => {
            setDetails({
                user_name: 'Nishant Sharma',
                mobile_no: '7738233469',
                code: 'R73PHULQBK',
                type: 'Things',
                code_for: 'Other',
                missing_status: 'Yes',
                child_qr_code: '',
                date_time: '2026-05-29 11:34:50',
                general_image: 'https://via.placeholder.com/150', // Placeholder
                things_detail: {
                    name: 'na',
                    device_name: 'na',
                    model_number: 'na',
                    serial_number: 'nana',
                    color: 'na',
                    description: 'na',
                    mobile_no: '7738233469',
                    image: 'https://via.placeholder.com/150', // Placeholder
                    emergency_contact: 'Available' // Or placeholder details
                }
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading || !details) {
        return (
            <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const DetailRow = ({ label, value }) => (
        <div style={{ display: 'flex', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ flex: '0 0 150px', fontWeight: 'bold', color: '#34495e' }}>{label}</div>
            <div style={{ flex: 1, color: '#7f8c8d' }}>{value || '-'}</div>
        </div>
    );

    return (
        <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
            <div className="container-fluid">
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>QR Code Details</h2>
                    <button 
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
                    >
                        <i className="fa fa-arrow-left"></i> Back
                    </button>
                </div>

                <div className="row">
                    {/* General Details Card */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
                            <div className="card-header" style={{ backgroundColor: '#fff', borderBottom: '2px solid #f4f6f9', padding: '20px', borderRadius: '15px 15px 0 0' }}>
                                <h4 style={{ margin: 0, color: '#2980b9', fontWeight: 'bold' }}>General Details</h4>
                            </div>
                            <div className="card-body" style={{ padding: '25px' }}>
                                <DetailRow label="User Name" value={details.user_name} />
                                <DetailRow label="Mobile no" value={details.mobile_no} />
                                <DetailRow label="Code" value={details.code} />
                                <DetailRow label="Type" value={details.type} />
                                <DetailRow label="Code For" value={details.code_for} />
                                <DetailRow label="Missing status" value={
                                    <span style={{ 
                                        backgroundColor: details.missing_status === 'Yes' ? '#e74c3c' : '#2ecc71', 
                                        color: 'white', 
                                        padding: '4px 12px', 
                                        borderRadius: '15px', 
                                        fontSize: '12px', 
                                        fontWeight: 'bold' 
                                    }}>
                                        {details.missing_status}
                                    </span>
                                } />
                                <DetailRow label="Child QR Code" value={details.child_qr_code} />
                                <DetailRow label="Date/Time" value={details.date_time} />
                                
                                <div style={{ display: 'flex', marginBottom: '15px', paddingTop: '10px' }}>
                                    <div style={{ flex: '0 0 150px', fontWeight: 'bold', color: '#34495e' }}>Image</div>
                                    <div style={{ flex: 1 }}>
                                        {details.general_image ? (
                                            <img src={details.general_image} alt="QR Code Image" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }} />
                                        ) : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Things Detail Card */}
                    <div className="col-lg-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
                            <div className="card-header" style={{ backgroundColor: '#fff', borderBottom: '2px solid #f4f6f9', padding: '20px', borderRadius: '15px 15px 0 0' }}>
                                <h4 style={{ margin: 0, color: '#8e44ad', fontWeight: 'bold' }}>Things Detail</h4>
                            </div>
                            <div className="card-body" style={{ padding: '25px' }}>
                                <DetailRow label="Name" value={details.things_detail.name} />
                                <DetailRow label="Device name" value={details.things_detail.device_name} />
                                <DetailRow label="Model number" value={details.things_detail.model_number} />
                                <DetailRow label="Serial number" value={details.things_detail.serial_number} />
                                <DetailRow label="Color" value={details.things_detail.color} />
                                <DetailRow label="Description" value={details.things_detail.description} />
                                <DetailRow label="Mobile no" value={details.things_detail.mobile_no} />
                                
                                <div style={{ display: 'flex', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <div style={{ flex: '0 0 150px', fontWeight: 'bold', color: '#34495e' }}>Image</div>
                                    <div style={{ flex: 1 }}>
                                        {details.things_detail.image ? (
                                            <div>
                                                <img src={details.things_detail.image} alt="Things Image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '8px' }} />
                                                <div style={{ fontSize: '12px', color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }}><i className="fa fa-eye"></i> Preview</div>
                                            </div>
                                        ) : '-'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex' }}>
                                    <div style={{ flex: '0 0 150px', fontWeight: 'bold', color: '#34495e' }}>Emergency contact</div>
                                    <div style={{ flex: 1 }}>
                                        <button style={{ 
                                            padding: '6px 15px', 
                                            borderRadius: '6px', 
                                            border: 'none', 
                                            backgroundColor: '#e67e22', 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <i className="fa fa-phone"></i> View Emergency Contact
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MissingQRListDetails;
