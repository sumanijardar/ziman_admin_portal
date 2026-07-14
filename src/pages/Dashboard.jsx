import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        user_count: 0,
        panic_count: 0,
        posh_count: 0,
        tracking_count: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('admin/getDashboard/');
                if (response.data && response.data.status === 'success') {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="content-body" style={{ paddingTop: '80px', backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <div className="dashboard-container">

                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back! Here's what's happening with your platform today.</p>
                    </div>
                </div>

                <div className="stat-grid">
                    {/* Users Card */}
                    <div className="stat-card card-users">
                        <i className="fa fa-users stat-deco"></i>
                        <div className="stat-icon-wrapper">
                            <i className="fa fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value">{loading ? '...' : dashboardData.user_count}</div>
                            {/* <div className="stat-desc">
                                <span className="trend-up"><i className="fa fa-arrow-up"></i> 12%</span>
                                <span>vs last month</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Active Trackings Card */}
                    <div className="stat-card card-tracking">
                        <i className="fa fa-map-marker stat-deco"></i>
                        <div className="stat-icon-wrapper">
                            <i className="fa fa-map-marker"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-title">Active Trackings</div>
                            <div className="stat-value">{loading ? '...' : dashboardData.tracking_count}</div>
                            {/* <div className="stat-desc">
                                <span className="trend-up"><i className="fa fa-arrow-up"></i> 5%</span>
                                <span>vs yesterday</span>
                            </div> */}
                        </div>
                    </div>

                    {/* SOS Alerts Card */}
                    <div className="stat-card card-sos">
                        <i className="fa fa-bell stat-deco"></i>
                        <div className="stat-icon-wrapper">
                            <i className="fa fa-bell"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-title">SOS Alerts</div>
                            <div className="stat-value">{loading ? '...' : dashboardData.panic_count}</div>
                            {/* <div className="stat-desc">
                                <span className="trend-down"><i className="fa fa-arrow-down"></i> 3%</span>
                                <span>vs last week</span>
                            </div> */}
                        </div>
                    </div>

                    {/* POSH Requests Card */}
                    <div className="stat-card card-posh">
                        <i className="fa fa-shield stat-deco"></i>
                        <div className="stat-icon-wrapper">
                            <i className="fa fa-shield"></i>
                        </div>
                        <div className="stat-info">
                            <div className="stat-title">POSH Requests</div>
                            <div className="stat-value">{loading ? '...' : dashboardData.posh_count}</div>
                            {/* <div className="stat-desc">
                                <span className="trend-neutral"><i className="fa fa-minus"></i> 0%</span>
                                <span>vs last month</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-grid">
                        <button className="action-btn" onClick={() => navigate('/users')}>
                            <i className="fa fa-user-plus text-primary"></i> Manage Users
                        </button>
                        <button className="action-btn" onClick={() => navigate('/tracking')}>
                            <i className="fa fa-map text-success"></i> View All Tracking
                        </button>
                        <button className="action-btn" onClick={() => navigate('/panic-evidence')}>
                            <i className="fa fa-exclamation-triangle text-danger"></i> Check SOS
                        </button>
                        <button className="action-btn" onClick={() => navigate('/posh-request')}>
                            <i className="fa fa-gavel text-warning"></i> Review POSH
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
