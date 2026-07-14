import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const dummyTrips = [
  { id: 5389, startTime: '2026-05-29 19:33:13', endTime: '2026-05-29 19:35:45', tracker: 'Nishant Sharma', lat: '19.1139', lng: '72.8651' },
  { id: 5368, startTime: '2026-04-18 12:26:18', endTime: '2026-04-18 12:29:39', tracker: 'Gani Khan', lat: '19.1140', lng: '72.8652' },
  { id: 5367, startTime: '2026-04-18 12:25:05', endTime: '2026-04-18 12:25:23', tracker: 'Sujeet Gupta', lat: '19.1150', lng: '72.8660' },
  { id: 5363, startTime: '2026-04-18 11:28:14', endTime: '2026-04-18 11:28:31', tracker: 'Nishant Sharma', lat: '19.1135', lng: '72.8645' },
];

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState(dummyTrips[0]);

  // Assuming id=1 is Rahul Sharma based on dummy data in Trip.jsx
  const userName = id === '1' ? 'Rahul Sharma' : 'Priya Singh'; 

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            style={{ borderRadius: '20px', padding: '8px 20px', fontWeight: 'bold' }}
          >
            <i className="fa fa-arrow-left me-2"></i> Back
          </button>
        </div>

        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Trips Detail - {userName}</h3>
          </div>

          <div className="card-body" style={{ padding: '30px', paddingTop: '10px' }}>
            <div className="row">
              {/* Left Column: Trip List */}
              <div className="col-md-4">
                <div style={{ height: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                  {dummyTrips.map(trip => {
                    const isSelected = selectedTrip.id === trip.id;
                    return (
                      <div 
                        key={trip.id}
                        onClick={() => setSelectedTrip(trip)}
                        style={{
                          border: isSelected ? '2px solid #007bff' : '1px solid #ced4da',
                          backgroundColor: isSelected ? '#007bff' : '#f8f9fa',
                          color: isSelected ? '#fff' : '#333',
                          padding: '15px',
                          marginBottom: '10px',
                          cursor: 'pointer',
                          borderRadius: '5px',
                          boxShadow: isSelected ? '0 4px 10px rgba(0,123,255,0.3)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <h5 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: isSelected ? '#fff' : '#2c3e50' }}>
                          Trip - {trip.id}
                        </h5>
                        <div style={{ fontSize: '13px', marginBottom: '5px' }}>Start Time: {trip.startTime}</div>
                        <div style={{ fontSize: '13px', marginBottom: '5px' }}>End Time: {trip.endTime}</div>
                        <div style={{ fontSize: '13px' }}>Traker: {trip.tracker}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Map */}
              <div className="col-md-8">
                <div style={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${selectedTrip.lat},${selectedTrip.lng}&hl=en&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TripDetail;
