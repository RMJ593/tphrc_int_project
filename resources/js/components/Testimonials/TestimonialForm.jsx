import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Testimonials.css';

function TestimonialForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        customer_name: '',
        review: '',
        rating: 5,
        is_featured: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchTestimonial();
        }
    }, [id]);

    const fetchTestimonial = async () => {
        try {
            const response = await axios.get(`/api/testimonials/${id}`);
            if (response.data.success) {
                const testimonial = response.data.data;
                setFormData({
                    customer_name: testimonial.customer_name,
                    review: testimonial.review,
                    rating: testimonial.rating,
                    is_featured: testimonial.is_featured
                });
                if (testimonial.customer_image) {
                    setImagePreview(`/storage/${testimonial.customer_image}`);
                }
            }
        } catch (error) {
            console.error('Error fetching testimonial:', error);
            setError('Failed to load testimonial');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('customer_name', formData.customer_name);
            formDataToSend.append('review', formData.review);
            formDataToSend.append('rating', formData.rating);
            formDataToSend.append('is_featured', formData.is_featured ? '1' : '0');

            if (imageFile) {
                formDataToSend.append('customer_image', imageFile);
            }

            let response;
            if (isEditMode) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(
                    `/api/testimonials/${id}`,
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
            } else {
                response = await axios.post(
                    '/api/testimonials',
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
            }

            if (response.data.success) {
                navigate('/staff/testimonials');
            }
        } catch (error) {
            console.error('Error saving testimonial:', error);
            setError(error.response?.data?.message || 'Failed to save testimonial');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="testimonial-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Testimonial' : 'Create Testimonial'}</h1>
                <Link to="/staff/testimonials" className="btn-back">
                    ← Back to List
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="testimonial-form">
                <div className="form-section">
                    <h2>Customer Information</h2>

                    <div className="form-group">
                        <label>Customer Name *</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., John Smith"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Customer Photo (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control-file"
                        />
                        <small className="form-text">
                            Recommended size: 200x200px. Max 2MB.
                        </small>
                    </div>

                    {imagePreview && (
                        <div className="image-preview-circle">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h2>Review Content</h2>

                    <div className="form-group">
                        <label>Review *</label>
                        <textarea
                            name="review"
                            value={formData.review}
                            onChange={handleChange}
                            className="form-control"
                            rows="5"
                            placeholder="Enter the customer's review..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rating *</label>
                        <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <label key={star} className="rating-option">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={star}
                                        checked={formData.rating === star}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                    />
                                    <span className="star-display">
                                        {'⭐'.repeat(star)}
                                    </span>
                                    <span className="rating-label">{star} Star{star > 1 ? 's' : ''}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                            />
                            <span>Featured Testimonial</span>
                        </label>
                        <small className="form-text">
                            Featured testimonials are highlighted on the website
                        </small>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Saving...' : (isEditMode ? 'Update Testimonial' : 'Create Testimonial')}
                    </button>
                    <Link to="/staff/testimonials" className="btn-cancel">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default TestimonialForm;