import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Gallery.css';

function GalleryList() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get('/api/gallery');
            if (response.data.success) {
                setImages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            setMessage('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            const response = await axios.delete(`/api/gallery/${id}`);
            if (response.data.success) {
                setMessage('Image deleted successfully');
                fetchImages();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setMessage('Failed to delete image');
        }
    };

    const filteredImages = images.filter(image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="gallery-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="gallery-container">
            <div className="page-header-simple">
                <h1>Gallery Images</h1>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div className="table-card">
                <div className="table-header-actions">
                    <Link to="/staff/gallery/create" className="btn-new-green">
                        + New
                    </Link>
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
                                <th>Image</th>
                                <th>Title ↑</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredImages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        No gallery images found
                                    </td>
                                </tr>
                            ) : (
                                filteredImages.slice(0, entriesPerPage).map((image) => (
                                    <tr key={image.id}>
                                        <td>{image.order}</td>
                                        <td>
                                            {image.image ? (
                                                <img
                                                    src={`/storage/${image.image}`}
                                                    alt={image.title}
                                                    className="table-image-rectangle"
                                                />
                                            ) : (
                                                <div className="no-image-placeholder">No Image</div>
                                            )}
                                        </td>
                                        <td><strong>{image.title}</strong></td>
                                        <td>
                                            <div className="description-truncate">
                                                {image.description || '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link
                                                    to={`/staff/gallery/${image.id}/edit`}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(image.id)}
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
                        Showing {filteredImages.length > 0 ? '1' : '0'} to {Math.min(entriesPerPage, filteredImages.length)} of {filteredImages.length} entries
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

export default GalleryList;