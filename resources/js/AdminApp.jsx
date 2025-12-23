import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Auth/Login';
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
import TopMenuList from './components/TopMenu/TopMenuList';
import TopMenuForm from './components/TopMenu/TopMenuForm';
import TeamMemberList from './components/TeamMembers/TeamMemberList';
import TeamMemberForm from './components/TeamMembers/TeamMemberForm';
import GalleryList from './components/Gallery/GalleryList';
import GalleryForm from './components/Gallery/GalleryForm';
import TestimonialList from './components/Testimonials/TestimonialList';
import TestimonialForm from './components/Testimonials/TestimonialForm';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import UserResponseList from './components/UserResponses/UserResponseList';
import TableBookingList from './components/TableBookings/TableBookingList';
import GeneralSettings from './components/Settings/GeneralSettings';
import BlogCategoryList from './components/BlogCategories/BlogCategoryList';
import BlogCategoryForm from './components/BlogCategories/BlogCategoryForm';
import BlogList from './components/Blogs/BlogList';
import BlogForm from './components/Blogs/BlogForm';
import MailTemplateList from './components/MailTemplates/MailTemplateList';
import MailTemplateForm from './components/MailTemplates/MailTemplateForm';
import RoleList from './components/Roles/RoleList';
import RoleForm from './components/Roles/RoleForm';
import UserList from './components/Users/UserList';
import UserForm from './components/Users/UserForm';
import FooterLinksList from './components/FooterLinks/FooterLinksList';
import FooterLinksForm from './components/FooterLinks/FooterLinksForm';
import axios from 'axios';
// import './components/TopMenu/TopMenu.css';

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
        <Routes>
            {/* Public Route - Login - TEMPORARILY DISABLED */}
            {/* <Route path="/login" element={<Login onLogin={handleLogin} />} /> */}
            <Route path="/login" element={<div>Login page temporarily disabled</div>} />
            
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

                                {/* Menus */}
                                <Route path="top-menu" element={<TopMenuList />} />
                                <Route path="top-menu/create" element={<TopMenuForm />} />
                                <Route path="top-menu/:id/edit" element={<TopMenuForm />} />

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
                                
                                {/* Products */}
                                <Route path="products" element={<ProductList />} />
                                <Route path="products/create" element={<ProductForm />} />
                                <Route path="products/:id/edit" element={<ProductForm />} />
                                
                                {/* Menu Items (Legacy) */}
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

                                {/* Footer Link */}
                                <Route path="footer-links" element={<FooterLinksList />} />
                                <Route path="footer-links/create" element={<FooterLinksForm />} />
                                <Route path="footer-links/:id/edit" element={<FooterLinksForm />} />

                                {/* Blog Categories */}
                                <Route path="blog-categories" element={<BlogCategoryList />} />
                                <Route path="blog-categories/create" element={<BlogCategoryForm />} />
                                <Route path="blog-categories/:id/edit" element={<BlogCategoryForm />} />
                                
                                {/* Blog */}
                                <Route path="blogs" element={<BlogList />} />
                                <Route path="blogs/create" element={<BlogForm />} />
                                <Route path="blogs/:id/edit" element={<BlogForm />} />

                                {/* Mail Templates */}
                                <Route path="mail-templates" element={<MailTemplateList />} />
                                <Route path="mail-templates/create" element={<MailTemplateForm />} />
                                <Route path="mail-templates/:id/edit" element={<MailTemplateForm />} />

                                {/* Roles */}
                                <Route path="roles" element={<RoleList />} />
                                <Route path="roles/create" element={<RoleForm />} />
                                <Route path="roles/:id/edit" element={<RoleForm />} />

                                {/* Users */}
                                <Route path="users" element={<UserList />} />
                                <Route path="users/create" element={<UserForm />} />
                                <Route path="users/:id/edit" element={<UserForm />} />

                                {/* Catch all - redirect to dashboard */}
                                <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } 
            />
            
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AdminApp;

