import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import api from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styled from 'styled-components';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: #2c3e50;
  color: white;
  padding: 15px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const StatusText = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => props.$active ? '#2ecc71' : '#e74c3c'};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.$active ? '#2ecc71' : '#e74c3c'};
  }
`;

// Component to dynamically update map center
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
};

const LiveLocationSharing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default to New Delhi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        const formData = new FormData();
        formData.append('loc_user_id', id);
        formData.append('app_security_key','yg@@!@fdgdrttrytryghhgjhguyt');
        const response = await api.post('/api/getShareLiveLocation/', formData);

        let resData = response.data;
        if (typeof resData === 'string') {
          try { resData = JSON.parse(resData); } catch (e) { }
        }

        if (resData && resData.status === 'Success') {
          setPosition([Number(resData.lat), Number(resData.lng)]);
          setUsername(resData.username);
          setLastUpdated(new Date());
          setError(null);
        } else {
          setError(resData?.message || "User is offline or not sharing location.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching location", err);
        setError("Could not fetch location data.");
        setLoading(false);
      }
    };

    // Initial call
    fetchLocation();

    // Call API every 2 seconds
    const interval = setInterval(() => {
      fetchLocation();
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  if (!id) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', padding: '20px' }}>
        <h2>Track Live Location</h2>
        <p>Please enter the User ID to view their live location.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="Enter User ID (e.g. 5256)" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={() => {
              if (searchInput) navigate(`/live-location/${searchInput}`);
            }}
            style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Track Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <Header>Live Location for User: {username || id}</Header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          Loading location...
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 1 }}>
          <StatusText $active={!error}>
            {error ? 'Offline' : 'Live'}
          </StatusText>

          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                User ID: {id || 'Unknown'} <br />
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
              </Popup>
            </Marker>

            <MapUpdater position={position} />
          </MapContainer>
        </div>
      )}
    </Container>
  );
};

export default LiveLocationSharing;
