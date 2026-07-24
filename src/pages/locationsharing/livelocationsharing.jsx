import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
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

  const [position, setPosition] = useState([28.6139, 77.2090]); // Default to New Delhi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [username, setUsername] = useState('');
  const [locationName, setLocationName] = useState('Fetching location...');
  const lastFetchedCoords = useRef({ lat: null, lng: null });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let interval;
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        const formData = new FormData();
        formData.append('loc_user_id', id);
        formData.append('app_security_key', 'yg@@!@fdgdrttrytryghhgjhguyt');
        const response = await api.post('/api/getShareLiveLocation/', formData);

        let resData = response.data;
        if (typeof resData === 'string') {
          try { resData = JSON.parse(resData); } catch (e) { }
        }

        if (!isMounted) return;

        if (resData && resData.status === 'Success') {
          const newLat = Number(resData.lat);
          const newLng = Number(resData.lng);
          setPosition([newLat, newLng]);
          setUsername(resData.username);
          setLastUpdated(new Date());
          setError(null);

          // Fetch location name if it moved significantly
          const latDiff = Math.abs(newLat - (lastFetchedCoords.current.lat || 0));
          const lngDiff = Math.abs(newLng - (lastFetchedCoords.current.lng || 0));

          if (latDiff > 0.0001 || lngDiff > 0.0001) {
            lastFetchedCoords.current = { lat: newLat, lng: newLng };
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=AIzaSyCE1wdfavAG6p3Yztj_f2vH_TGE3n1yJ5I`)
              .then(res => res.json())
              .then(data => {
                if (data && data.results && data.results.length > 0) {
                  setLocationName(data.results[0].formatted_address);
                } else {
                  setLocationName("Location name not found");
                }
              })
              .catch(err => {
                console.error("Reverse geocoding error:", err);
                setLocationName("Unable to fetch location name");
              });
          }
        } else if (resData && resData.status === 'Fail') {
          setError(resData.msg || "Live location sharing has expired or been stopped by the user.");
          if (interval) clearInterval(interval); // Stop polling if location is stopped
        } else {
          setError("Could not fetch location data.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching location", err);
        if (!isMounted) return;
        setError("Could not connect to the server.");
        setLoading(false);
      }
    };

    // Initial call
    fetchLocation();

    // Call API every 2 seconds
    interval = setInterval(fetchLocation, 2000);

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [id]);

  if (!id) {
    return (
      <Container>
        <Header>Live Location Sharing</Header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
          <h2>Invalid Tracking Link</h2>
          <p>User ID is missing from the URL.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>Live Location for User: {username || id}</Header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          Loading location...
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#f0f2f5' }}>
          <div style={{ padding: '40px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '450px', margin: '20px' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>📍🚫</div>
            <h3 style={{ color: '#e74c3c', marginBottom: '15px', marginTop: 0, fontSize: '1.5rem' }}>Location Unavailable</h3>
            <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.5', margin: 0 }}>{error}</p>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 1 }}>
          <StatusText $active={true}>
            Live
          </StatusText>

          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }} attributionControl={false}>
            <LayersControl position="bottomleft">
              <LayersControl.BaseLayer checked name="Street Map (GPS)">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <Marker position={position}>
              <Popup>
                <div style={{ maxWidth: '250px' }}>
                  <strong>Location:</strong><br />
                  {locationName}
                </div>
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
