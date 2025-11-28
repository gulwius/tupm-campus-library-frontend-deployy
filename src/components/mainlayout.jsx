import { Outlet, NavLink } from 'react-router-dom';

const MainLayout = () => {
    //for sign-out so admin is signed out automatically when server shutdown
    const user = JSON.parse(sessionStorage.getItem('user'));
    

const adminName = user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Admin";

    return (
        <div className="app-wrapper">
            <nav className="navbar">
                <div className="nav-links">
                    <NavLink to="/home" className="nav-link">Home</NavLink>
                    <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                </div>
                <div className="admin-profile">
                    Admin {adminName}
                </div>
            </nav>
            <Outlet/>
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-col">
                        <h4>Online Services</h4>
                        <ul>
                            <li><a href="https://ers.tup.edu.ph/aims/faculty/" target="_blank" rel="x">ERS for Faculty</a></li>
                        <li><a href="https://www.tup.edu.ph" target="_blank" rel="x">TUP Website</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Government Links</h4>
                        <ul>
                            <li><a href='https://op-proper.gov.ph/' target="_blank" rel="x">Office of the President</a></li>
                            <li><a href='https://ovp.gov.ph/' target="_blank" rel="x">Office of the Vice President</a></li>
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