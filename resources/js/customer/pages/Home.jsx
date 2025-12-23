import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import WhatsAppButton from '../components/WhatsAppButton';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import TestimonialsSection from '../components/TestimonialsSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const [heroBanner, setHeroBanner] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        fetchSettings();
        fetchHeroBanner();
        fetchMenuItems();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/settings`);
            setSettings(response.data.data || response.data);
            
            // Apply theme colors dynamically
            if (response.data.main_color) {
                document.documentElement.style.setProperty('--main-color', response.data.main_color);
            }
            if (response.data.color_2) {
                document.documentElement.style.setProperty('--color-2', response.data.color_2);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchHeroBanner = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/hero-banners`);
            const banners = response.data.data || response.data;
            if (Array.isArray(banners) && banners.length > 0) {
                setHeroBanner(banners[0]);
            }
        } catch (error) {
            console.error('Error fetching hero banner:', error);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/menu-links`);
            const items = response.data.data || response.data || [];
            // Filter for nav links only
            setMenuItems(items.filter(item => item.link_type === 'nav_link' && item.is_active));
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setSidebarOpen(false);
        }
    };

    return (
        <div className="customer-site">
            {/* Top Info Bar */}
            <TopBar settings={settings} />

            {/* Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                menuItems={menuItems}
                settings={settings}
                onNavigate={scrollToSection}
            />

            {/* Main Navigation */}
            <nav className="main-nav">
                <div className="nav-container">
                    {/* Hamburger Menu */}
                    <button 
                        className="hamburger-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Logo */}
                    <div className="logo">
                        {settings?.logo ? (
                            <img src={settings.logo} alt={settings.site_name || 'Restaurant'} />
                        ) : (
                            <h1>Curry Leaf</h1>
                        )}
                    </div>

                    {/* Find a Table Button */}
                    <button 
                        onClick={() => scrollToSection('booking')} 
                        className="find-table-btn"
                    >
                        FIND A TABLE
                    </button>
                </div>
            </nav>

            {/* Hero Section with Video Background */}
            <section id="home" className="hero-section">
                {/* Video Background */}
                {heroBanner?.video_url && (
                    <video 
                        className="hero-video" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                    >
                        <source src={heroBanner.video_url} type="video/mp4" />
                    </video>
                )}
                
                {/* Dark Overlay */}
                <div className="hero-overlay"></div>

                {/* Hero Content */}
                <div className="hero-content">
                    <p className="hero-subtitle">
                        {heroBanner?.small_heading || 'DELIGHTFUL EXPERIENCE'}
                    </p>
                    
                    <div className="divider">
                        <span>◆</span>
                        <span>◆</span>
                        <span>◆</span>
                    </div>

                    <h1 className="hero-title">
                        {heroBanner?.heading || 'Handcrafted Indian Flavours, Straight from the Heart'}
                    </h1>

                    <p className="hero-description">
                        {heroBanner?.description || 'At Curry Leaf, every dish is a celebration of India\'s rich culinary heritage - prepared with passion, perfected with tradition, and served with love.'}
                    </p>

                    <button 
                        onClick={() => scrollToSection('menu')} 
                        className="view-menu-btn"
                    >
                        VIEW OUR MENU
                    </button>
                </div>
            </section>

            {/* About Section */}
            <AboutSection id="about" />

            {/* Menu Section */}
            <MenuSection id="menu" />

            {/* Testimonials Section */}
            <TestimonialsSection id="testimonials" />

            {/* Gallery Section */}
            <GallerySection id="gallery" />

            {/* Contact/Booking Section */}
            <ContactSection id="booking" />

            {/* WhatsApp Floating Button */}
            <WhatsAppButton phone={settings?.whatsapp_number || '876543219'} />
        </div>
    );
}

export default Home;

