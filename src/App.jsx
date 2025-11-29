import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/mainlayout';
import Login from './components/login';
import Home from './components/home';
import Dashboard from './components/Dashboard';
import BookDetail from './components/BookDetail';
import StudentHistory from './components/studentHistory';
import StudentSearch from './components/studentSearch';
import Circulation from './components/circulation';
import './App.css';

const ProtectedRoute = () => {
    const user = sessionStorage.getItem('user');
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
            
            {/*public routes*/}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />

            {/*admin routes*/}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<StudentSearch />} />
                <Route path="/circulation" element={<Circulation />} />
                <Route path="/student/:tupId" element={<StudentHistory />} />
            </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;