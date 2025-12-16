import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminLayout from './components/Layout/AdminLayout';
import CategoryList from './components/Categories/CategoryList';
import CategoryForm from './components/Categories/CategoryForm';
import MenuItemList from './components/MenuItems/MenuItemList';
import MenuItemForm from './components/MenuItems/MenuItemForm';
import DomainSettings from './components/DomainSettings/DomainSettings';
import HeroBannerList from './components/HeroBanner/HeroBannerList';
import HeroBannerForm from './components/HeroBanner/HeroBannerForm';
import PageList from './components/Pages/PageList';
import PageForm from './components/Pages/PageForm';
import TopMenus from './components/Menus/TopMenus';
import FooterLinks from './components/Menus/FooterLinks';
import TeamMemberList from './components/TeamMembers/TeamMemberList';
import TeamMemberForm from './components/TeamMembers/TeamMemberForm';
import GalleryList from './components/Gallery/GalleryList';
import GalleryForm from './components/Gallery/GalleryForm';
import TestimonialList from './components/Testimonials/TestimonialList';
import TestimonialForm from './components/Testimonials/TestimonialForm';
import UserResponseList from './components/UserResponses/UserResponseList';
import TableBookingList from './components/TableBookings/TableBookingList';
import GeneralSettings from './components/Settings/GeneralSettings';
import axios from 'axios';
import './components/Menus/Menus.css';

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem('auth_token')
    );
    const [username, setUsername] = useState('Super Admin');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserDetails();
        }
    }, [isAuthenticated]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('http://127.0.0.1:8000/api/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('User API Response:', response.data);
            
            let userData = null;
            if (response.data.success && response.data.data) {
                userData = response.data.data;
            } else if (response.data.user) {
                userData = response.data.user;
            } else if (response.data.name) {
                userData = response.data;
            }
            
            if (userData) {
                setUsername(userData.name || userData.username || 'Super Admin');
                setUserEmail(userData.email || '');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setUsername('Super Admin');
        }
    };

    const handleLogin = (token, userData) => {
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
        
        console.log('Login userData:', userData);
        
        if (userData) {
            setUsername(userData.name || userData.username || 'Super Admin');
            setUserEmail(userData.email || '');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUsername('Super Admin');
        setUserEmail('');
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route - Login (Always show login page) */}
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                
                {/* Protected Routes - All under /staff */}
                <Route 
                    path="/staff/*" 
                    element={
                        isAuthenticated ? (
                            <AdminLayout 
                                onLogout={handleLogout} 
                                username={username} 
                                userEmail={userEmail}
                            >
                                <Routes>
                                    {/* Dashboard */}
                                    <Route path="dashboard" element={<Dashboard username={username} />} />
                                    
                                    {/* Domain Settings */}
                                    <Route path="domain-settings" element={<DomainSettings />} />

                                    {/* Menus & Links */}
                                    <Route path="menus/top" element={<TopMenus />} />
                                    <Route path="menus/footer" element={<FooterLinks />} />

                                    {/* Hero Banners */}
                                    <Route path="hero-banners" element={<HeroBannerList />} />
                                    <Route path="hero-banners/create" element={<HeroBannerForm />} />
                                    <Route path="hero-banners/:id/edit" element={<HeroBannerForm />} />
                                    
                                    {/* Pages */}
                                    <Route path="pages" element={<PageList />} />
                                    <Route path="pages/create" element={<PageForm />} />
                                    <Route path="pages/:id/edit" element={<PageForm />} />
                                    
                                    {/* Categories */}
                                    <Route path="categories" element={<CategoryList />} />
                                    <Route path="categories/create" element={<CategoryForm />} />
                                    <Route path="categories/:id/edit" element={<CategoryForm />} />
                                    
                                    {/* Menu Items (Products) */}
                                    <Route path="menu-items" element={<MenuItemList />} />
                                    <Route path="menu-items/create" element={<MenuItemForm />} />
                                    <Route path="menu-items/:id/edit" element={<MenuItemForm />} />
                                    
                                    {/* Team Members */}
                                    <Route path="team-members" element={<TeamMemberList />} />
                                    <Route path="team-members/create" element={<TeamMemberForm />} />
                                    <Route path="team-members/:id/edit" element={<TeamMemberForm />} />

                                    {/* Gallery */}
                                    <Route path="gallery" element={<GalleryList />} />
                                    <Route path="gallery/create" element={<GalleryForm />} />
                                    <Route path="gallery/:id/edit" element={<GalleryForm />} />

                                    {/* Testimonials */}
                                    <Route path="testimonials" element={<TestimonialList />} />
                                    <Route path="testimonials/create" element={<TestimonialForm />} />
                                    <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

                                    {/* User Responses */}
                                    <Route path="user-responses" element={<UserResponseList />} />

                                    {/* Table Bookings */}
                                    <Route path="table-bookings" element={<TableBookingList />} />
                                    
                                    {/* Settings */}
                                    <Route path="settings" element={<GeneralSettings />} />
                                    
                                    {/* Catch all - redirect to dashboard */}
                                    <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                                </Routes>
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                
                {/* Root redirect - ALWAYS go to login first */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Catch all other routes - go to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AdminApp;