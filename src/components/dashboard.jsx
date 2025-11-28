import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, borrowed: 0, available: 0 });
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const adminName = user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "User";
    const initials = user ? user.username.slice(0, 2).toUpperCase() : "AA";

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/books/api/books/')
            .then(res => {
                const books = res.data;
                setStats({
                    total: books.length,
                    borrowed: books.filter(b => b.status === 'Borrowed').length,
                    available: books.filter(b => b.status === 'Available').length
                });
            })
            .catch(err => console.error("Error fetching stats:", err));

        //clock
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

        //signout
        const handleLogout = () => {
            sessionStorage.removeItem('user');
            navigate('/login');
        };

    //for current date debugging
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };

    return (
        <div className="dashboard-layout">
            {/*left sb, admin pf*/}
            <aside className="dashboard-sidebar">
                <div className="admin-card">
                    <div className="admin-avatar">
                        {initials}
                    </div>
                    <h2>Admin {adminName}</h2>
                    <p className="admin-role">Super Administrator</p>
                    <div className="admin-status">
                        <span className="status-dot"></span> Online
                    </div>
                    <div className="sidebar-divider"></div>
                    <div className="sidebar-info">
                    <label>System Time</label>
                        <p>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>



                    <button onClick={handleLogout} className="signout-btn">
                        Sign Out
                    </button>

                    <div className="sidebar-footer">
                        <p>TUP Library System v1.0</p>
                    </div>
                </div>
            </aside>

            {/*right content, greetins*/}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Overview</h1>
                    <p>Welcome back, {adminName}. Here is what's happening today.</p>
                </div>

                {/*current stats row*/}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <h3>Total Books</h3>
                            <div className="number">{stats.total}</div>
                        </div>
                    </div>
                    <div className="stat-card borrowed">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Borrowed</h3>
                            <div className="number">{stats.borrowed}</div>
                        </div>
                    </div>
                    <div className="stat-card available">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Available</h3>
                            <div className="number">{stats.available}</div>
                        </div>
                    </div>
                </div>
                <h2 className="section-title">Quick Actions</h2>
                
                {/*my tools*/}
                <div className="tools-grid">
                    {/*studentsearch tool*/}
                    <Link to="/search" className="tool-card primary">
                        <div className="tool-icon-circle">🔍</div>
                        <div className="tool-content">
                            <h3>Student Tracker</h3>
                            <p>Lookup IDs & History</p>
                        </div>
                        <div className="arrow-icon">→</div>
                    </Link>


                    {/*django admin tool*/}
                    <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="tool-card secondary">
                        <div className="tool-icon-circle">⚙️</div>
                        <div className="tool-content">
                            <h3>Database Admin</h3>
                            <p>Manage Records</p>
                        </div>
                        <div className="arrow-icon">→</div>
                    </a>





                    <Link to="/circulation" className="tool-card primary">
                        <div className="tool-icon-circle" style={{background: '#6f42c1'}}>📚</div>
                        <div className="tool-content">
                            <h3>Circulation Desk</h3>
                            <p>Borrow & Return Books</p>
                        </div>
                        <div className="arrow-icon">→</div>
                    </Link>
                </div>
            </main>
        </div>
    );
};
export default Dashboard;