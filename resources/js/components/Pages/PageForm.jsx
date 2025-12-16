// ==================== PageForm.jsx ====================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function PageForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        route_name: '',
        content: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/pages/${id}`);
            if (response.data.success) {
                const page = response.data.data;
                setFormData({
                    title: page.title,
                    slug: page.slug,
                    route_name: page.route_name || '',
                    content: page.content || '',
                    meta_title: page.meta_title || '',
                    meta_description: page.meta_description || '',
                    meta_keywords: page.meta_keywords || '',
                    is_active: page.is_active,
                });
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            setError('Failed to load page');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === 'title' && !isEditMode) {
            const autoSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            
            const autoRouteName = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '')
                .replace(/\s+/g, '');
            
            setFormData({
                ...formData,
                title: value,
                slug: autoSlug,
                route_name: autoRouteName
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            if (isEditMode) {
                response = await axios.put(
                    `http://127.0.0.1:8000/api/pages/${id}`,
                    formData
                );
            } else {
                response = await axios.post(
                    'http://127.0.0.1:8000/api/pages',
                    formData
                );
            }

            if (response.data.success) {
                navigate('/staff/pages');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            setError(error.response?.data?.message || 'Failed to save page');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Page' : 'Create New Page'}</h1>
                <Link to="/staff/pages" className="btn-back">
                    ← Back to Pages
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="page-form">
                <div className="form-section">
                    <h2>Basic Information</h2>

                    <div className="form-group">
                        <label>Page Name *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., About Us Page"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>URL Slug *</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., about-us"
                                required
                            />
                            <small className="form-text">
                                Example: about-us, contact
                            </small>
                        </div>

                        <div className="form-group half-width">
                            <label>Route Name *</label>
                            <input
                                type="text"
                                name="route_name"
                                value={formData.route_name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., about"
                                required
                            />
                            <small className="form-text">
                                Example: about, contact
                            </small>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Page Content *</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="form-control content-textarea"
                            rows="12"
                            placeholder="Enter page content here..."
                            required
                        />
                        <small className="form-text">
                            You can use HTML tags for formatting
                        </small>
                    </div>
                </div>

                <div className="form-section">
                    <h2>SEO Settings</h2>

                    <div className="form-group">
                        <label>Meta Title</label>
                        <input
                            type="text"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Custom title for search engines"
                        />
                        <small className="form-text">
                            Recommended: 50-60 characters. Leave empty to use page name.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Meta Description</label>
                        <textarea
                            name="meta_description"
                            value={formData.meta_description}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            placeholder="Brief description for search engines"
                        />
                        <small className="form-text">
                            Recommended: 150-160 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Meta Keywords</label>
                        <input
                            type="text"
                            name="meta_keywords"
                            value={formData.meta_keywords}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="keyword1, keyword2, keyword3"
                        />
                        <small className="form-text">
                            Separate keywords with commas
                        </small>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Visibility</h2>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            <span>Active (visible on website)</span>
                        </label>
                        <small className="form-text">
                            Uncheck to hide this page from the public website
                        </small>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Saving...' : (isEditMode ? 'Update Page' : 'Create Page')}
                    </button>
                    <Link to="/staff/pages" className="btn-cancel">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default PageForm;