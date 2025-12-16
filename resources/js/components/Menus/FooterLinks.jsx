import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FooterLinks() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const [linkForm, setLinkForm] = useState({
        name: '',
        url_name: '',
        order: 1,
        link_type: 'Nav Link'
    });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await axios.get('/api/menu-links');
            if (response.data.success) {
                setLinks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching links:', error);
            setMessage('Failed to load menu links');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: linkForm.name,
                url: linkForm.url_name,
                order: linkForm.order,
                target: '_self',
                menu_id: 2, // Footer menu ID - adjust as needed
                is_active: true
            };

            let response;
            if (editingLink) {
                response = await axios.put(`/api/menu-links/${editingLink}`, data);
            } else {
                response = await axios.post('/api/menu-links', data);
            }

            if (response.data.success) {
                setMessage(editingLink ? 'Link updated successfully' : 'Link created successfully');
                fetchLinks();
                resetForm();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving link:', error);
            setMessage(error.response?.data?.message || 'Failed to save link');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            const response = await axios.delete(`/api/menu-links/${id}`);
            if (response.data.success) {
                setMessage('Link deleted successfully');
                fetchLinks();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            setMessage('Failed to delete link');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            const response = await axios.put(`/api/menu-links/${id}`, {
                is_active: !currentStatus
            });

            if (response.data.success) {
                fetchLinks();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const editLink = (link) => {
        setLinkForm({
            name: link.title,
            url_name: link.url,
            order: link.order,
            link_type: 'Nav Link'
        });
        setEditingLink(link.id);
        setShowLinkForm(true);
    };

    const resetForm = () => {
        setLinkForm({ name: '', url_name: '', order: 1, link_type: 'Nav Link' });
        setEditingLink(null);
        setShowLinkForm(false);
    };

    const filteredLinks = links.filter(link =>
        link.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="footer-menu-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="footer-menu-container">
            <div className="page-header-simple">
                <h1>Footer Links</h1>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div className="table-card">
                <div className="table-header-actions">
                    <button onClick={() => setShowLinkForm(true)} className="btn-new-green">
                        + New
                    </button>
                    <button className="btn-reorder">
                        Reorder
                    </button>
                </div>

                <div className="table-controls">
                    <div className="entries-control">
                        <label>Show</label>
                        <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>entries</span>
                    </div>

                    <div className="search-control">
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ↑</th>
                                <th>Name ↑</th>
                                <th>Url Name ↑</th>
                                <th>Link Type ↑</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLinks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        No footer links found
                                    </td>
                                </tr>
                            ) : (
                                filteredLinks.slice(0, entriesPerPage).map((link) => (
                                    <tr key={link.id}>
                                        <td>{link.order}</td>
                                        <td>{link.title}</td>
                                        <td>{link.url}</td>
                                        <td>Nav Link</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => editLink(link)}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <label className="toggle-switch-small">
                                                    <input
                                                        type="checkbox"
                                                        checked={link.is_active}
                                                        onChange={() => toggleActive(link.id, link.is_active)}
                                                    />
                                                    <span className="toggle-slider-small"></span>
                                                </label>
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <div className="showing-info">
                        Showing {filteredLinks.length > 0 ? '1' : '0'} to {Math.min(entriesPerPage, filteredLinks.length)} of {filteredLinks.length} entries
                    </div>
                    <div className="pagination">
                        <button className="page-btn" disabled>Previous</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Link Form Modal */}
            {showLinkForm && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingLink ? 'Edit Link' : 'Add New Link'}</h3>
                            <button onClick={resetForm} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={linkForm.name}
                                    onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>URL Name *</label>
                                <input
                                    type="text"
                                    value={linkForm.url_name}
                                    onChange={(e) => setLinkForm({ ...linkForm, url_name: e.target.value })}
                                    className="form-control"
                                    placeholder="/privacy or https://example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Order</label>
                                <input
                                    type="number"
                                    value={linkForm.order}
                                    onChange={(e) => setLinkForm({ ...linkForm, order: parseInt(e.target.value) })}
                                    className="form-control"
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Link Type</label>
                                <select
                                    value={linkForm.link_type}
                                    onChange={(e) => setLinkForm({ ...linkForm, link_type: e.target.value })}
                                    className="form-control"
                                >
                                    <option value="Nav Link">Nav Link</option>
                                    <option value="External Link">External Link</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-submit">
                                    {editingLink ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FooterLinks;