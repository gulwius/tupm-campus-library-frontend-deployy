import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/mainlayout';
import Login from './components/login';
import Home from './components/home';
import Dashboard from './components/Dashboard';
import BookDetail from './components/BookDetail';
import StudentHistory from './components/StudentHistory';
import StudentSearch from './components/StudentSearch';
import Circulation from './components/circulation';
import './App.css';

//security purposes
const ProtectedRoute = () => {
    const user = sessionStorage.getItem('user');
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <MainLayout />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            
            <Route path="/search" element={<StudentSearch />} />
            <Route path="/circulation" element={<Circulation />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/student/:tupId" element={<StudentHistory />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
export default App;