import React from 'react';

function TopBar({ settings }) {
    if (!settings) return null;

    return (
        <div className="top-bar">
            <div className="top-bar-container">
                <div className="top-bar-left">
                    {settings.address && (
                        <div className="top-bar-item">
                            <span className="icon">kjkjk</span>
                            <span>{settings.address}</span>
                        </div>
                    )}
                    {settings.timing && (
                        <div className="top-bar-item">
                            <span className="icon">hhh</span>
                            <span>Daily : {settings.timing}</span>
                        </div>
                    )}
                </div>

                <div className="top-bar-right">
                    {settings.phone && (
                        <div className="top-bar-item">
                            <span className="icon">hhhj</span>
                            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                        </div>
                    )}
                    {settings.email && (
                        <div className="top-bar-item">
                            <span className="icon">iiuii</span>
                            <a href={`mailto:${settings.email}`}>{settings.email}</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;

