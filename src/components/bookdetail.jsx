import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    const user = JSON.parse(sessionStorage.getItem('user'));
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/books/api/books/${id}`)
            .then(res => setBook(res.data))
            .catch(err => console.error("Error:", err));
    }, [id]);
    if (!book) return <div className="loading-state">Loading Book Details...</div>;
    const imageUrl = book.cover_image 
        ? `http://127.0.0.1:8000/static/books/images/${book.cover_image}`
        : null;
    return (
        <div className="detail-page-container">
            {/*navigation*/}
            <div className="detail-nav">
                <Link to="/" className="back-link">← Back to Library</Link>
            </div>

            {/*books*/}
            <div className="book-profile-card">
                <div className="profile-left">
                    <div className="cover-wrapper">
                        {imageUrl ? (
                            <img src={imageUrl} alt={book.title} className="detail-cover" />
                        ) : (
                            <div className="detail-no-cover"><span>📘</span></div>
                        )}
                        <span className={`status-badge-lg ${book.status.toLowerCase()}`}>
                            {book.status}
                        </span>
                    </div>
                </div>
                <div className="profile-right">
                    <h1 className="detail-title">{book.title}</h1>
                    
                    <div className="meta-tags">
                        <span className="meta-pill year">{book.publication_year}</span>
                        {book.subject && book.subject.map(sub => (
                             <span key={sub} className="meta-pill subject">{sub}</span>
                        ))}
                    </div>
                    <div className="detail-section">
                        <label>Author(s)</label>
                        <p className="author-text">{book.author && book.author.join(", ")}</p>
                    </div>
                    <div className="detail-section">
                        <label>Description</label>
                        <p className="description-text">
                            {book.description || "No description available for this book."}
                        </p>
                    </div>

                    {/*borrowing*/}
                    {user && book.current_borrow && (
                        <div className="borrow-info-box">
                            <h3>⚠️ Current Loan Status</h3>
                            <div className="loan-grid">
                                <div>
                                    <label>Borrowed By</label>
                                    <p>{book.current_borrow.borrower}</p>
                                </div>
                                <div>
                                    <label>Due Date</label>
                                    <p>{new Date(book.current_borrow.due_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default BookDetail;