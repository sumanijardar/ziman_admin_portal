import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Signup from './pages/auth/Signup';
import Role from './pages/admin/Role';
import AddUser from './pages/user/AddUser';
import EditUser from './pages/user/EditUser';
import UserList from './pages/user/UserList';
import UserBulkUpload from './pages/user/UserBulkUpload';
import PanicEvidence from './pages/panicevidence/PanicEvidence';
import PanicEvidenceDetail from './pages/panicevidence/PanicEvidenceDetail';
import PoshRequest from './pages/poshrequest/PoshRequest';
import PoshRequestDetail from './pages/poshrequest/PoshRequestDetail';
import TravelSafe from './pages/travel/TravelSafe';
import TravelSafeDetail from './pages/travel/TravelSafeDetail';
import Tracking from './pages/managelocation/Tracking';
import LiveTracking from './pages/managelocation/LiveTracking';
import Trip from './pages/managelocation/Trip';
import TripDetail from './pages/managelocation/TripDetail';
import TrackerDevice from './pages/managelocation/TrackerDevice';
import FaqList from './pages/faq/FaqList';
import FaqAdd from './pages/faq/FaqAdd';
import FaqEdit from './pages/faq/FaqEdit';
import OfficeList from './pages/officelocation/OfficeList';
import Addofficelocation from './pages/officelocation/Addofficelocation';
import Editofficelocation from './pages/officelocation/Editofficelocation';
import QrCodeList from './pages/qrcode/QrCodeList';
import AddQrCode from './pages/qrcode/AddQrCode';
import MissingQRList from './pages/qrcode/MissingQRList';
import MissingQRListDetails from './pages/qrcode/MissingQRListDetails';
import MissingQRNotification from './pages/qrcode/MissingQRNotification';
import RiseAlerts from './pages/qrcode/RiseAlerts';
import ScanAlerts from './pages/qrcode/ScanAlerts';
import LiveLocationSharing from './pages/locationsharing/livelocationsharing';
import RiseQueryList from './pages/risequery/RiseQueryList';

function App() {
  return (
    <BrowserRouter basename='/ziman/' >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout><Dashboard /> </Layout>} />
        <Route path="/role" element={<Layout showFooter={false}><Role /></Layout>} />
        <Route path="/users" element={<Layout showFooter={false}><UserList /></Layout>} />
        <Route path="/add-user" element={<Layout showFooter={false}><AddUser /></Layout>} />
        <Route path="/edit-user/:id" element={<Layout showFooter={false}><EditUser /></Layout>} />
        <Route path="/user-bulk-import" element={<Layout showFooter={false}><UserBulkUpload /></Layout>} />
        <Route path="/panic-evidence" element={<Layout showFooter={false}><PanicEvidence /></Layout>} />
        <Route path="/panic-evidence-detail/:id" element={<Layout showFooter={false}><PanicEvidenceDetail /></Layout>} />
        <Route path="/posh-request" element={<Layout showFooter={false}><PoshRequest /></Layout>} />
        <Route path="/posh-request-detail/:id" element={<Layout showFooter={false}><PoshRequestDetail /></Layout>} />
        <Route path="/travel-safe" element={<Layout showFooter={false}><TravelSafe /></Layout>} />
        <Route path="/travel-safe-detail/:id" element={<Layout showFooter={false}><TravelSafeDetail /></Layout>} />
        <Route path="/tracking" element={<Layout showFooter={false}><Tracking /></Layout>} />
        <Route path="/live-tracking" element={<Layout showFooter={false}><LiveTracking /></Layout>} />
        <Route path="/trips" element={<Layout showFooter={false}><Trip /></Layout>} />
        <Route path="/trip-detail/:id" element={<Layout showFooter={false}><TripDetail /></Layout>} />
        <Route path="/tracker-device" element={<Layout showFooter={false}><TrackerDevice /></Layout>} />
        <Route path="/faq" element={<Layout showFooter={false}><FaqList /></Layout>} />
        <Route path="/faq/add" element={<Layout showFooter={false}><FaqAdd /></Layout>} />
        <Route path="/faq/edit/:id" element={<Layout showFooter={false}><FaqEdit /></Layout>} />

        {/* Office Location Routes */}
        <Route path="/office-location" element={<Layout showFooter={false}><OfficeList /></Layout>} />
        <Route path="/add-office-location" element={<Layout showFooter={false}><Addofficelocation /></Layout>} />
        <Route path="/office-location/edit/:id" element={<Layout showFooter={false}><Editofficelocation /></Layout>} />

        {/* QR Code Routes */}
        <Route path="/qrcode-list" element={<Layout showFooter={false}><QrCodeList /></Layout>} />
        <Route path="/add-qrcode" element={<Layout showFooter={false}><AddQrCode /></Layout>} />
        <Route path="/missing-qrlist" element={<Layout showFooter={false}><MissingQRList /></Layout>} />
        <Route path="/missing-qr-detail/:id" element={<Layout showFooter={false}><MissingQRListDetails /></Layout>} />
        <Route path="/missing-qr-notification" element={<Layout showFooter={false}><MissingQRNotification /></Layout>} />
        <Route path="/rise-alerts" element={<Layout showFooter={false}><RiseAlerts /></Layout>} />
        <Route path="/scan-alerts" element={<Layout showFooter={false}><ScanAlerts /></Layout>} />

        {/* Route for Sidebar link - requires Layout */}
        <Route path="/live-location" element={<Layout showFooter={false}><LiveLocationSharing /></Layout>} />

        {/* Public Live Location Sharing Route - No Login/Layout required */}
        <Route path="/live-location/:id" element={<LiveLocationSharing />} />

        {/* Rise Query Routes */}
        <Route path="/rise-query" element={<Layout showFooter={false}><RiseQueryList /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
