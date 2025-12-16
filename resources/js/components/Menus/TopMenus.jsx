import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopMenus() {
    const [links, setLinks] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const [linkForm, setLinkForm] = useState({
        name: '',
        link_text: '',
        page_id: '',
        page_type: '',
        open_new_tab: false,
        order: 1
    });

    const [groupForm, setGroupForm] = useState({
        name: '',
        link_text: '',
        page_type: '',
        order: 1
    });

    // Page types - adjust these based on your actual page types
    const pageTypes = [
        'Home',
        'About',
        'Services',
        'Contact',
        'Blog',
        'Gallery',
        'Menu',
        'Custom Page',
        'External Link'
    ];

    useEffect(() => {
        fetchLinks();
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get('/api/pages');
            if (response.data.success) {
                setPages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

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

    const handleLinkSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: linkForm.name,
                link_text: linkForm.link_text,
                url: linkForm.page_id ? `/page/${linkForm.page_id}` : linkForm.link_text,
                page_id: linkForm.page_id,
                page_type: linkForm.page_type,
                order: linkForm.order,
                target: linkForm.open_new_tab ? '_blank' : '_self',
                menu_id: 1,
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
                resetLinkForm();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving link:', error);
            setMessage(error.response?.data?.message || 'Failed to save link');
        }
    };

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                title: groupForm.name,
                link_text: groupForm.link_text,
                page_type: groupForm.page_type,
                order: groupForm.order,
                is_group: true,
                menu_id: 1,
                is_active: true
            };

            const response = await axios.post('/api/menu-links', data);

            if (response.data.success) {
                setMessage('Group created successfully');
                fetchLinks();
                resetGroupForm();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving group:', error);
            setMessage(error.response?.data?.message || 'Failed to save group');
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
            link_text: link.link_text || link.title,
            page_id: link.page_id || '',
            page_type: link.page_type || '',
            open_new_tab: link.target === '_blank',
            order: link.order
        });
        setEditingLink(link.id);
        setShowLinkForm(true);
    };

    const resetLinkForm = () => {
        setLinkForm({ 
            name: '', 
            link_text: '', 
            page_id: '', 
            page_type: '',
            open_new_tab: false,
            order: 1 
        });
        setEditingLink(null);
        setShowLinkForm(false);
    };

    const resetGroupForm = () => {
        setGroupForm({ 
            name: '', 
            link_text: '', 
            page_type: '',
            order: 1 
        });
        setShowGroupForm(false);
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
                <h1>Top Menu</h1>
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
                    <button onClick={() => setShowGroupForm(true)} className="btn-new-green">
                        + New Group
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
                                <th>Link Text ↑</th>
                                <th>Page Type ↑</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLinks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        No menu links found
                                    </td>
                                </tr>
                            ) : (
                                filteredLinks.slice(0, entriesPerPage).map((link) => (
                                    <tr key={link.id}>
                                        <td>{link.order}</td>
                                        <td>{link.title}</td>
                                        <td>{link.link_text || link.title}</td>
                                        <td>{link.page_type || 'N/A'}</td>
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

            {/* New Link Form Modal */}
            {showLinkForm && (
                <div className="modal-overlay" onClick={resetLinkForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingLink ? 'Edit Link' : 'Add New Link'}</h3>
                            <button onClick={resetLinkForm} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleLinkSubmit}>
                            <div className="form-group">
                                <label>Name to Identify *</label>
                                <input
                                    type="text"
                                    value={linkForm.name}
                                    onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })}
                                    className="form-control"
                                    placeholder="e.g., Main About Page"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Link Text *</label>
                                <input
                                    type="text"
                                    value={linkForm.link_text}
                                    onChange={(e) => setLinkForm({ ...linkForm, link_text: e.target.value })}
                                    className="form-control"
                                    placeholder="Text shown on menu"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Select Page</label>
                                <select
                                    value={linkForm.page_id}
                                    onChange={(e) => setLinkForm({ ...linkForm, page_id: e.target.value })}
                                    className="form-control"
                                >
                                    <option value="">-- Select a Page --</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.title}
                                        </option>
                                    ))}
                                </select>
                                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                                    Leave empty if using custom URL in Link Text
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Page Type *</label>
                                <select
                                    value={linkForm.page_type}
                                    onChange={(e) => setLinkForm({ ...linkForm, page_type: e.target.value })}
                                    className="form-control"
                                    required
                                >
                                    <option value="">-- Select Page Type --</option>
                                    {pageTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
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
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={linkForm.open_new_tab}
                                        onChange={(e) => setLinkForm({ ...linkForm, open_new_tab: e.target.checked })}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span>Open in New Tab</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-submit">
                                    {editingLink ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetLinkForm} className="btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Group Form Modal */}
            {showGroupForm && (
                <div className="modal-overlay" onClick={resetGroupForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Group</h3>
                            <button onClick={resetGroupForm} className="modal-close">×</button>
                        </div>
                        <form onSubmit={handleGroupSubmit}>
                            <div className="form-group">
                                <label>Name to Identify *</label>
                                <input
                                    type="text"
                                    value={groupForm.name}
                                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                                    className="form-control"
                                    placeholder="e.g., Services Group"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Link Text *</label>
                                <input
                                    type="text"
                                    value={groupForm.link_text}
                                    onChange={(e) => setGroupForm({ ...groupForm, link_text: e.target.value })}
                                    className="form-control"
                                    placeholder="Text shown on menu"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Page Type *</label>
                                <select
                                    value={groupForm.page_type}
                                    onChange={(e) => setGroupForm({ ...groupForm, page_type: e.target.value })}
                                    className="form-control"
                                    required
                                >
                                    <option value="">-- Select Page Type --</option>
                                    {pageTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Order</label>
                                <input
                                    type="number"
                                    value={groupForm.order}
                                    onChange={(e) => setGroupForm({ ...groupForm, order: parseInt(e.target.value) })}
                                    className="form-control"
                                    min="1"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-submit">
                                    Create Group
                                </button>
                                <button type="button" onClick={resetGroupForm} className="btn-cancel">
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

export default TopMenus;