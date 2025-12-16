import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TeamMembers.css';

function TeamMemberList() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/team-members');
            if (response.data.success) {
                setMembers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
            setMessage('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;

        try {
            const response = await axios.delete(`/api/team-members/${id}`);
            if (response.data.success) {
                setMessage('Team member deleted successfully');
                fetchMembers();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting team member:', error);
            setMessage('Failed to delete team member');
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="team-members-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="team-members-container">
            <div className="page-header-simple">
                <h1>Team Members</h1>
            </div>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div className="table-card">
                <div className="table-header-actions">
                    <Link to="/staff/team-members/create" className="btn-new-green">
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
                                <th>Name ↑</th>
                                <th>Position ↑</th>
                                <th>Social Links</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">
                                        No team members found
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.slice(0, entriesPerPage).map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.order}</td>
                                        <td>
                                            {member.image ? (
                                                <img
                                                    src={`/storage/${member.image}`}
                                                    alt={member.name}
                                                    className="table-image-small"
                                                />
                                            ) : (
                                                <div className="no-image-placeholder">No Image</div>
                                            )}
                                        </td>
                                        <td><strong>{member.name}</strong></td>
                                        <td>{member.position}</td>
                                        <td>
                                            <div className="social-links">
                                                {member.facebook && (
                                                    <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">📘</a>
                                                )}
                                                {member.twitter && (
                                                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">🐦</a>
                                                )}
                                                {member.instagram && (
                                                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">📷</a>
                                                )}
                                                {!member.facebook && !member.twitter && !member.instagram && (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link
                                                    to={`/staff/team-members/${member.id}/edit`}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
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
                        Showing {filteredMembers.length > 0 ? '1' : '0'} to {Math.min(entriesPerPage, filteredMembers.length)} of {filteredMembers.length} entries
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

export default TeamMemberList;