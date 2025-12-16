// ==================== PageList.jsx ====================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function PageList() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/pages');
            if (response.data.success) {
                setPages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            setError('Failed to load pages');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/pages/${id}`,
                { is_active: !currentStatus }
            );
            if (response.data.success) {
                fetchPages();
            }
        } catch (error) {
            console.error('Error updating page status:', error);
            alert('Failed to update page status');
        }
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading pages...</div>;
    }

    return (
        <div className="page-list-container">
            <div className="page-header">
                <h1>Pages</h1>
                <Link to="/staff/pages/new" className="btn-new">
                    + New
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="table-controls">
                <div className="show-entries">
                    <label>
                        Show <select defaultValue="10">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select> entries
                    </label>
                </div>
                <div className="search-box">
                    <label>
                        Search:
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search pages..."
                        />
                    </label>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="pages-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Url</th>
                            <th>Route Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No pages found
                                </td>
                            </tr>
                        ) : (
                            filteredPages.map((page, index) => (
                                <tr key={page.id}>
                                    <td>{index + 1}</td>
                                    <td>{page.title}</td>
                                    <td>{page.slug}</td>
                                    <td>{page.route_name}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/staff/pages/edit/${page.id}`}
                                                className="btn-action btn-edit"
                                                title="Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => toggleActive(page.id, page.is_active)}
                                                className={`btn-action btn-toggle ${page.is_active ? 'active' : 'inactive'}`}
                                                title={page.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                <div className="toggle-switch">
                                                    <div className="toggle-slider"></div>
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PageList;