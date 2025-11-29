import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const StudentHistory = () => {
    const { tupId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        axios.get(`${API_URL}/books/api/history/${tupId}`)
            .then(res => {
                setHistory(res.data);
                if (res.data.length > 0) {
                    const first = res.data[0];
                    setProfile({
                        first: first.student_first,
                        last: first.student_last,
                        email: first.student_email,
                        tupId: first.student_tup_id
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [tupId]);

    // const formatDate = (dateStr) => {
    //     return new Date(dateStr).toSessionDateString('en-US', {
    //         month: 'short', day: 'numeric'
    //     });
    // };
    
        const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Profile...</div>;

    if (!profile && !loading) return (
        <div style={{textAlign:'center', marginTop:'50px'}}>
            <h2>No records found for ID: {tupId}</h2>
            <Link to="/search">Go Back</Link>
        </div>
    );



    return (
        <div className="profile-page-container">
            <Link to="/search" className="back-link">← Back to Search</Link>          
            <div className="profile-grid">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-circle">
                            {profile.first[0]}{profile.last[0]}
                        </div>
                        <h2>{profile.first} {profile.last}</h2>
                        <span className="role-badge">Student</span>
                    </div>
                    <div className="profile-details">
                        <div className="detail-row">
                            <label>TUP ID</label>
                            <p>{profile.tupId}</p>
                        </div>
                        <div className="detail-row">
                            <label>Email</label>
                            <p>{profile.email}</p>
                        </div>
                        <div className="detail-row">
                            <label>Status</label>
                            <p style={{color: 'green'}}>Active</p>
                        </div>
                    </div>
                </div>
                <div className="history-section">
                    <h3>My Borrowing History</h3>
                    <div className="table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Date Borrowed</th>
                                    <th>Status</th>
                                    <th>Due / Returned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record, index) => (
                                    <tr key={index}>
                                        <td className="book-title-cell">{record.book_title}</td>
                                        <td>{formatDate(record.borrowed_date)}</td>
                                        <td>
                                            <span className={`status-pill ${record.status.toLowerCase()}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(record.due_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default StudentHistory;