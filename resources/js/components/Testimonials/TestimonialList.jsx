import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Testimonials.css';

function TestimonialList() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('/api/testimonials');
            if (response.data.success) {
                setTestimonials(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setMessage('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const response = await axios.delete(`/api/testimonials/${id}`);
            if (response.data.success) {
                setMessage('Testimonial deleted successfully');
                fetchTestimonials();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            setMessage('Failed to delete testimonial');
        }
    };

    const toggleFeatured = async (id, currentStatus) => {
        try {
            const response = await axios.put(`/api/testimonials/${id}`, {
                is_featured: !currentStatus
            });

            if (response.data.success) {
                fetchTestimonials();
            }
        } catch (error) {
            console.error('Error updating featured status:', error);
        }
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="testimonials-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="testimonials-container">
            <div className="page-header-simple">
                <h1>Testimonials</h1>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div className="table-card">
                <div className="table-header-actions">
                    <Link to="/staff/testimonials/create" className="btn-new-green">
                        + New
                    </Link>
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
                                <th>Image</th>
                                <th>Customer Name ↑</th>
                                <th>Review</th>
                                <th>Rating ↑</th>
                                <th>Featured</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">
                                        No testimonials found
                                    </td>
                                </tr>
                            ) : (
                                filteredTestimonials.slice(0, entriesPerPage).map((testimonial) => (
                                    <tr key={testimonial.id}>
                                        <td>
                                            {testimonial.customer_image ? (
                                                <img
                                                    src={`/storage/${testimonial.customer_image}`}
                                                    alt={testimonial.customer_name}
                                                    className="table-image-small"
                                                />
                                            ) : (
                                                <div className="no-image-placeholder">No Image</div>
                                            )}
                                        </td>
                                        <td><strong>{testimonial.customer_name}</strong></td>
                                        <td>
                                            <div className="review-truncate">
                                                {testimonial.review}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="star-rating">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </td>
                                        <td>
                                            <label className="toggle-switch-small">
                                                <input
                                                    type="checkbox"
                                                    checked={testimonial.is_featured}
                                                    onChange={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                                                />
                                                <span className="toggle-slider-small"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link
                                                    to={`/staff/testimonials/${testimonial.id}/edit`}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(testimonial.id)}
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
                        Showing {filteredTestimonials.length > 0 ? '1' : '0'} to {Math.min(entriesPerPage, filteredTestimonials.length)} of {filteredTestimonials.length} entries
                    </div>
                    <div className="pagination">
                        <button className="page-btn" disabled>Previous</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestimonialList;