import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LiveTracking = () => {
  const [trackingData, setTrackingData] = useState({
    open_request: 0,
    close_request: 0,
    center_arr: [],
    data_array: []
  });

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await api.get('user/getTodayTracking/1');
        if (response.data) {
          setTrackingData({
            open_request: response.data.open_request || 0,
            close_request: response.data.close_request || 0,
            center_arr: response.data.center_arr || [],
            data_array: response.data.data_array || []
          });
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    fetchTrackingData();
  }, []);

  // Determine center for the map
  let mapCenter = '0,0';
  let zoom = '2';
  
  if (trackingData.center_arr && !Array.isArray(trackingData.center_arr) && trackingData.center_arr.latitude) {
      mapCenter = `${trackingData.center_arr.latitude},${trackingData.center_arr.longitude}`;
      zoom = '15';
  } else if (Array.isArray(trackingData.center_arr) && trackingData.center_arr.length >= 2) {
      mapCenter = `${trackingData.center_arr[0]},${trackingData.center_arr[1]}`;
      zoom = '15';
  } else if (trackingData.data_array && trackingData.data_array.length > 0) {
      const firstData = trackingData.data_array[0];
      if (firstData.user_lat) {
          mapCenter = `${firstData.user_lat},${firstData.user_long}`;
          zoom = '15';
      } else if (firstData.latitude) {
          mapCenter = `${firstData.latitude},${firstData.longitude}`;
          zoom = '15';
      }
  }

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">
        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: 'none' }}>
          <div className="card-header bg-white border-0" style={{ padding: '20px 30px', borderRadius: '15px 15px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>Live Tracking</h3>
            <div>
              <span style={{ color: '#27ae60', fontWeight: 'bold', marginRight: '15px' }}>Active Request - {trackingData.open_request}</span>
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Inactive Request - {trackingData.close_request}</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '0', height: '650px' }}>
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src={`https://maps.google.com/maps?q=${mapCenter}&hl=en&z=${zoom}&output=embed`}
              style={{ borderRadius: '0 0 15px 15px', display: 'block' }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
