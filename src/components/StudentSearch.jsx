import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentSearch = () => {
    const [year, setYear] = useState('25');
    const [digits, setDigits] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const fullId = `TUPM-${year}-${digits}`; 
        navigate(`/student/${fullId}`);
    };

    return (
        <div className="search-page-container">

            <Link to="/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>

            <div className="search-card">
                <div className="search-header">
                    <h1>Student Tracker</h1>
                    <p>Enter a Student ID to view borrowing history.</p>
                </div>
                
                <form onSubmit={handleSearch} className="search-form">
                    <div className="form-group">
                        <label>Enrollment Year</label>
                        <select 
                            value={year} 
                            onChange={(e) => setYear(e.target.value)}
                            className="form-input"
                        >
                            <option value="21">2021</option>
                            <option value="22">2022</option>
                            <option value="23">2023</option>
                            <option value="24">2024</option>
                            <option value="25">2025</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Student ID (Last 4 digits)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 1742" 
                            value={digits}
                            onChange={(e) => setDigits(e.target.value)}
                            maxLength="4"
                            required
                            className="form-input"
                        />
                    </div>
                    
                    <button type="submit" className="search-submit-btn">
                        Check History
                    </button>
                </form>
            </div>
        </div>
    );
};
export default StudentSearch;