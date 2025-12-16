import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Gallery.css';

function GalleryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: 0
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchImage();
        }
    }, [id]);

    const fetchImage = async () => {
        try {
            const response = await axios.get(`/api/gallery/${id}`);
            if (response.data.success) {
                const image = response.data.data;
                setFormData({
                    title: image.title,
                    description: image.description || '',
                    order: image.order
                });
                if (image.image) {
                    setImagePreview(`/storage/${image.image}`);
                }
            }
        } catch (error) {
            console.error('Error fetching gallery image:', error);
            setError('Failed to load gallery image');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('order', formData.order);

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response;
            if (isEditMode) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(
                    `/api/gallery/${id}`,
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
            } else {
                response = await axios.post(
                    '/api/gallery',
                    formDataToSend,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
            }

            if (response.data.success) {
                navigate('/staff/gallery');
            }
        } catch (error) {
            console.error('Error saving gallery image:', error);
            setError(error.response?.data?.message || 'Failed to save gallery image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Gallery Image' : 'Add Gallery Image'}</h1>
                <Link to="/staff/gallery" className="btn-back">
                    ← Back to List
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="gallery-form">
                <div className="form-section">
                    <h2>Image Information</h2>

                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., Delicious Pasta Dish"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            placeholder="Optional description of the image..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Display Order</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="form-control"
                            min="0"
                        />
                        <small className="form-text">
                            Lower numbers display first
                        </small>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Gallery Image *</h2>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control-file"
                            required={!isEditMode}
                        />
                        <small className="form-text">
                            Recommended size: 1200x800px. Max 2MB. Formats: JPG, PNG, GIF, WebP
                        </small>
                    </div>

                    {imagePreview && (
                        <div className="image-preview-large">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Saving...' : (isEditMode ? 'Update Image' : 'Add Image')}
                    </button>
                    <Link to="/staff/gallery" className="btn-cancel">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default GalleryForm;