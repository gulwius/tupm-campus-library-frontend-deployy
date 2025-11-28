import { Outlet, NavLink, Link } from 'react-router-dom';

const MainLayout = () => {
    //for sign-out so admin is signed out automatically when server shutdown
    const user = JSON.parse(sessionStorage.getItem('user'));
    
const adminName = user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "";

    return (
        <div className="app-wrapper">
            <nav className="navbar">
                <div className="nav-links">
                    <NavLink to="/" className="nav-link" end>Home</NavLink>
                    {user && (
                        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                    )}
                </div>
                <div className="nav-right">
                    {user ? (
                        <div className="admin-profile">
                            <span className="admin-badge">Admin</span> {adminName}
                        </div>
                    ) : (
                        <Link to="/login" className="nav-signin-btn">
                            Sign In as Admin
                        </Link>
                    )}
                </div>
            </nav>

            <Outlet />

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-col">
                        <h4>Online Services</h4>
                        <ul>
                            <li><a href="http://ers.tup.edu.ph/aims/faculty/" target="_blank" rel="noreferrer">ERS for Faculty</a></li>
                            <li><a href="https://www.tup.edu.ph/" target="_blank" rel="noreferrer">TUP Website</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Government Links</h4>
                        <ul>
                            <li><a href="https://op-proper.gov.ph/" target="_blank" rel="noreferrer">Office of the President</a></li>
                            <li><a href="https://ovp.gov.ph/" target="_blank" rel="noreferrer">Office of the Vice President</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2025 TUP - Manila</span>
                    <span>Designed by: Group 6</span>
                </div>
            </footer>
        </div>
    );
};
export default MainLayout;