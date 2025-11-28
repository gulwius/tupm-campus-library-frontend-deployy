import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import tupSeal from '../assets/Technological_University_of_the_Philippines_Seal.svg.png';
import booksBg from '../assets/books.jpg';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        axios.get('http://127.0.0.1:8000/books/api/books/')
            .then(res => setBooks(res.data))
            .catch(err => console.error("Error fetching books:", err));
        return () => clearInterval(timer);
    }, []);

    const filteredBooks = books.filter(book => {
        const matchesStatus = filter === 'All' || book.status === filter;
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = 
            book.title.toLowerCase().includes(lowerSearch) || 
            (book.author && book.author.join(" ").toLowerCase().includes(lowerSearch));

        return matchesStatus && matchesSearch;
    });

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="home-wrapper">

            <div className="hero-banner">



                <div className="hero-left">
                    <div className="time-display">
                        <h2>Philippine Standard Time</h2>
                        <div className="date">{currentTime.toLocaleDateString('en-US', dateOptions)}</div>
                        <div className="clock">{currentTime.toLocaleTimeString()}</div>
                    </div>
                </div>



                <div className="hero-center-logo">
                    <img src={tupSeal} alt="TUP Seal" className="tup-logo-img" />
                </div>
                <div className="hero-right" style={{
                    backgroundImage: `linear-gradient(to right, rgba(139, 0, 0, 0.7), rgba(60, 0, 0, 0.4)), url(${booksBg})`
                }}>
                </div>
            </div>

                    <div className="dashboard-layout">                
                    <aside className="circ-sidebar">
                        <div className="circ-card">
                            <h2 style={{marginTop: 0}}>Library Catalog</h2>
                            <p style={{color: '#666', marginBottom: '20px'}}>Manage and search the collection.</p>
                            <div className="search-wrapper" style={{marginBottom: '25px'}}>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Search Title or Author..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
        <div style={{marginTop: '20px'}}>
            <h3 style={{fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', marginBottom: '10px'}}>System Policies</h3>
            
            <div style={{background: '#fff0f3', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #b91d47', marginBottom: '10px'}}>
                <strong style={{color: '#b91d47', display: 'block', marginBottom: '5px'}}>Student Limits</strong>
                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#555'}}>
                    <li style={{marginBottom: '4px'}}>Max <strong>3 active books</strong> per student.</li>
                    <li>Max <strong>1 borrow</strong> transaction per day.</li>
                </ul>
            </div>
            <div style={{background: '#f8f9fa', borderRadius: '8px', padding: '15px', borderLeft: '4px solid #333'}}>
                <strong style={{color: '#333', display: 'block', marginBottom: '5px'}}>Catalog Stats</strong>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555'}}>
                    <span>Total Titles:</span>
                    <strong>{books.length}</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginTop: '5px'}}>
                    <span>Daily Book Limit:</span>
                    <strong>50 / day</strong>
                </div>
            </div>
        </div>
    </div>
</aside>
                <main className="circ-main-area">
                    <div className="filter-tabs-container">
                        <button 
                            className={`filter-tab ${filter === 'All' ? 'active' : ''}`}
                            onClick={() => setFilter('All')}
                        >
                            All Books
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'Available' ? 'active' : ''}`}
                            onClick={() => setFilter('Available')}
                        >
                            Available
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'Borrowed' ? 'active' : ''}`}
                            onClick={() => setFilter('Borrowed')}
                        >
                            Borrowed
                        </button>
                    </div>
                    <div className="book-grid-home">
                        {filteredBooks.map((book) => (
                            <Link to={`/book/${book.id}`} key={book.id} className="book-card-clean">
                                <div className="card-image">
                                    <span className={`status-tag ${book.status.toLowerCase()}`}>
                                        {book.status}
                                    </span>
                                    {book.cover_image ? (
                                        <img 
                                            src={`http://127.0.0.1:8000/static/books/images/${book.cover_image}`} 
                                            onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/200x300/eee/999?text=No+Cover"}}
                                            alt={book.title} 
                                        />
                                    ) : (
                                        <div className="no-cover"><span>📚</span></div>
                                    )}
                                </div>
                                <div className="card-details">
                                    <h3 className="card-title">{book.title}</h3>
                                    <p className="card-author">
                                        {book.author && book.author.join(", ")}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {filteredBooks.length === 0 && (
                            <div className="empty-state-home">
                                <div style={{fontSize: '3rem'}}>🔍</div>
                                <h3>No books found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Home;