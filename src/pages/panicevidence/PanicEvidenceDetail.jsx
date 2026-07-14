import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PanicEvidenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evidenceData, setEvidenceData] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidenceDetail = async () => {
      try {
        // Fetch all related details concurrently
        const [
          infoResponse, 
          imagesResponse,
          videosResponse,
          audiosResponse,
          emergencyResponse
        ] = await Promise.all([
          api.get(`user/getUserInfo/${id}`),
          api.get(`user/getUserImages/${id}`),
          api.get(`user/getUserVideos/${id}`),
          api.get(`user/getUserAudios/${id}`),
          api.get(`user/getUserEmergencynfo/${id}`)
        ]);

        const data = infoResponse.data;
        if (data) {
          setEvidenceData({
            alertId: id,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'N/A',
            email: data.email || 'N/A',
            mobile: data.mobile_no || 'N/A',
            latitude: data.user_lat || '0',
            longitude: data.user_long || '0',
            gender: data.gender_value || 'N/A',
            bloodGroup: data.blood_group_value || 'N/A',
            criticalIllness: data.critical_illness_value || 'NA',
            datetime: data.date_time || 'N/A'
          });
        }

        const parseArray = (res) => {
          if (Array.isArray(res.data)) return res.data;
          if (res.data && Array.isArray(res.data.data)) return res.data.data;
          return [];
        };

        setImages(parseArray(imagesResponse));
        setVideos(parseArray(videosResponse));
        setAudios(parseArray(audiosResponse));
        setEmergencyContacts(parseArray(emergencyResponse));

      } catch (error) {
        console.error("Error fetching evidence details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvidenceDetail();
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

  if (!evidenceData) {
    return (
      <div className="content-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h4>No details found for this user.</h4>
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
            Evidence - <span style={{ textTransform: 'capitalize' }}>{evidenceData.name}</span>({evidenceData.mobile})
          </h3>
        </div>

        {/* Main Details Card */}
        <div className="card" style={{ borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: 'none' }}>
          <div className="card-body" style={{ padding: '40px' }}>
            <div className="row">
              
              {/* Left Column: User Detail */}
              <div className="col-md-6 mb-4 mb-md-0">
                <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '25px', fontSize: '22px' }}>User Detail</h4>
                
                <div style={{ fontSize: '15px', color: '#34495e', lineHeight: '2' }}>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Name:</strong> {evidenceData.name}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Email:</strong> {evidenceData.email}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Mobile Number:</strong> {evidenceData.mobile}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Latitude:</strong> {evidenceData.latitude}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Longitude:</strong> {evidenceData.longitude}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Gender:</strong> {evidenceData.gender}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Blood Group:</strong> {evidenceData.bloodGroup}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Critical Illness:</strong> {evidenceData.criticalIllness}</div>
                  <div><strong style={{ display: 'inline-block', width: '150px' }}>Date/Time:</strong> {evidenceData.datetime}</div>
                </div>
              </div>

              {/* Right Column: Google Map */}
              <div className="col-md-6">
                <div style={{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  <iframe 
                    title="Evidence Location Map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${evidenceData.latitude},${evidenceData.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>

            </div>

            <hr style={{ margin: '40px 0', borderColor: '#ecf0f1' }} />

            {/* Images Section */}
            <div>
              <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '25px', fontSize: '22px' }}>Images</h4>
              <div className="d-flex flex-wrap gap-4" style={{ gap: '20px' }}>
                {images.length > 0 ? (
                  images.map((img, index) => (
                    <div key={img.id || index} className="text-center" style={{ width: '200px' }}>
                      <div style={{ width: '100%', height: '200px', backgroundColor: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e0e0', overflow: 'hidden', marginBottom: '10px' }}>
                        <img 
                          src={img.file_path} 
                          alt={`Evidence ${index + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <strong style={{ color: '#34495e' }}>{img.notes || `IMAGE ${index + 1}`}</strong>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#7f8c8d', border: '1px solid #e9ecef', width: '100%' }}>
                    <i className="fa fa-image mr-2"></i> No images found.
                  </div>
                )}
              </div>
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#ecf0f1' }} />

            {/* Video Section */}
            <div>
              <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '15px', fontSize: '22px' }}>Video</h4>
              {videos.length > 0 ? (
                <div className="d-flex flex-wrap gap-4" style={{ gap: '20px' }}>
                  {videos.map((vid, index) => (
                    <div key={vid.id || index} style={{ width: '300px' }}>
                      <video controls style={{ width: '100%', borderRadius: '12px', border: '1px solid #e0e0e0', backgroundColor: '#000' }}>
                        <source src={vid.file_path || vid.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <strong style={{ color: '#34495e', display: 'block', marginTop: '10px' }}>{vid.notes || `VIDEO ${index + 1}`}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#7f8c8d', border: '1px solid #e9ecef' }}>
                  <i className="fa fa-video-camera mr-2"></i> No record found.
                </div>
              )}
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#ecf0f1' }} />

            {/* Audio Section */}
            <div>
              <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '15px', fontSize: '22px' }}>Audio</h4>
              {audios.length > 0 ? (
                <div className="d-flex flex-wrap gap-4" style={{ gap: '20px' }}>
                  {audios.map((aud, index) => (
                    <div key={aud.id || index} style={{ width: '350px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                      <audio controls style={{ width: '100%' }}>
                        <source src={aud.file_path || aud.url} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                      <strong style={{ color: '#34495e', display: 'block', marginTop: '10px' }}>{aud.notes || `AUDIO ${index + 1}`}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#7f8c8d', border: '1px solid #e9ecef' }}>
                  <i className="fa fa-microphone mr-2"></i> No record found.
                </div>
              )}
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#ecf0f1' }} />

            {/* Emergency Contacts Section */}
            <div>
              <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '20px', fontSize: '22px' }}>Emergency Contacts</h4>
              {emergencyContacts.length > 0 ? (
                <ul className="list-group list-group-flush border" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  {emergencyContacts.map((contact, index) => (
                    <li key={contact.id || index} className="list-group-item d-flex align-items-center" style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{ width: '35px', height: '35px', backgroundColor: '#3498db', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: 'bold' }}>
                        {index + 1}
                      </div>
                      <div style={{ fontSize: '16px', color: '#2c3e50' }}>
                        <strong>{contact.name || contact.contact_name || contact.first_name || 'Contact'}</strong> 
                        <span style={{ margin: '0 10px', color: '#bdc3c7' }}>|</span> 
                        <span style={{ color: '#7f8c8d' }}>Mobile No: {contact.mobile || contact.contact_number || contact.mobile_no || 'N/A'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '15px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#7f8c8d', border: '1px solid #e9ecef' }}>
                  <i className="fa fa-address-book mr-2"></i> No emergency contacts found.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PanicEvidenceDetail;
