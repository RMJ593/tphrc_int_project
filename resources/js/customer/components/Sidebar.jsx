import React from 'react';

function Sidebar({ isOpen, onClose, menuItems, settings, onNavigate }) {
    const handleNavClick = (url) => {
        // Extract section ID from URL (e.g., "#about" or "/about" becomes "about")
        const sectionId = url.replace(/^[#/]/, '');
        onNavigate(sectionId);
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <nav className="sidebar-nav">
                    {menuItems.filter(item => item.is_active).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.url)}
                            className="sidebar-link"
                        >
                            <span className="diamond">—†</span>
                            {item.title}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <h3>Visit Us</h3>
                    
                    {settings?.address && (
                        <p className="sidebar-address">{settings.address}</p>
                    )}

                    {settings?.timing && (
                        <p className="sidebar-timing">Daily : {settings.timing}</p>
                    )}

                    {settings?.email && (
                        <p className="sidebar-email">{settings.email}</p>
                    )}

                    <div className="sidebar-divider">—†</div>

                    <p className="booking-label">Booking Request</p>
                    {settings?.phone && (
                        <a href={`tel:${settings.phone}`} className="sidebar-phone">
                            {settings.phone}
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;

