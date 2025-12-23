import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category_id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [features, setFeatures] = useState({
        is_special_dish: false,
        is_special_offer: false,
        is_chef_selection: false
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/menu-items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const product = response.data.data;
                setFormData({
                    title: product.name,
                    price: product.price,
                    description: product.description || '',
                    category_id: product.category_id
                });
                setFeatures({
                    is_special_dish: product.is_special_dish || false,
                    is_special_offer: product.is_special_offer || false,
                    is_chef_selection: product.is_chef_selection || false
                });
                if (product.image) {
                    setImagePreview(`/storage/${product.image}`);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleToggle = (field) => {
        setFeatures({
            ...features,
            [field]: !features[field]
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size should not exceed 2MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!isEditMode && !imageFile) {
            setError('Image is required');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.title);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category_id', formData.category_id);
            formDataToSend.append('is_special_dish', features.is_special_dish ? '1' : '0');
            formDataToSend.append('is_special_offer', features.is_special_offer ? '1' : '0');
            formDataToSend.append('is_chef_selection', features.is_chef_selection ? '1' : '0');

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response;
            if (isEditMode) {
                formDataToSend.append('_method', 'PUT');
                response = await axios.post(
                    `/api/menu-items/${id}`,
                    formDataToSend,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                response = await axios.post(
                    '/api/menu-items',
                    formDataToSend,
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            if (response.data.success) {
                navigate('/staff/products');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
                <Link to="/staff/products" className="btn-back">
                    † Back to List
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter product title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                        placeholder="Enter product description"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Categories *</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <h3>Features</h3>
                    
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <span>Special Dish</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={features.is_special_dish}
                                    onChange={() => handleToggle('is_special_dish')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </label>
                    </div>

                    <div className="toggle-group">
                        <label className="toggle-label">
                            <span>Special Offer</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={features.is_special_offer}
                                    onChange={() => handleToggle('is_special_offer')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </label>
                    </div>

                    <div className="toggle-group">
                        <label className="toggle-label">
                            <span>Chef Selection</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={features.is_chef_selection}
                                    onChange={() => handleToggle('is_chef_selection')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Image * {isEditMode && '(Leave empty to keep current image)'}</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control-file"
                        required={!isEditMode}
                    />
                    <small className="form-text">
                        Preferred dimension: 500px x 500px. Max 2MB.
                    </small>
                </div>

                {imagePreview && (
                    <div className="image-preview-square">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;

