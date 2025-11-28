import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Circulation = () => {
    //db list
    const [catalog, setCatalog] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    
    //student search
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    //transac
    const [student, setStudent] = useState(null);
    const [activeLoans, setActiveLoans] = useState([]);
    const [mode, setMode] = useState('borrow'); // 'borrow' or 'return'
    const [cart, setCart] = useState([]);
    
    //book filtering
    const [bookSearch, setBookSearch] = useState(''); 
    
    //ui stating
    const [toast, setToast] = useState(null);
    const dropdownRef = useRef(null);

    //backend fetching
    const fetchCatalog = () => {
        axios.get('http://127.0.0.1:8000/books/api/books/')
            .then(res => setCatalog(res.data));
    };
    useEffect(() => {
        fetchCatalog();
        axios.get('http://127.0.0.1:8000/books/api/students/')
            .then(res => setAllStudents(res.data));
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //searching w/ predictions
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setPredictions([]);
            return;
        }
        const lowerQuery = searchQuery.toLowerCase();
        const matches = allStudents.filter(s => 
            s.tup_id.toLowerCase().includes(lowerQuery) ||
            s.first.toLowerCase().includes(lowerQuery) ||
            s.last.toLowerCase().includes(lowerQuery)
        ).slice(0, 5);
        setPredictions(matches);
    }, [searchQuery, allStudents]);
    const selectStudent = (stud) => {
        setSearchQuery(`${stud.first} ${stud.last}`);
        setShowDropdown(false);
        loadStudentData(stud.tup_id);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (predictions.length > 0) selectStudent(predictions[0]);
            else showToast("Student not registered.", "error");
        }
    };
    const loadStudentData = (tupId) => {
        axios.get(`http://127.0.0.1:8000/books/api/history/${tupId}`)
            .then(res => {
                const studInfo = allStudents.find(s => s.tup_id === tupId);
                setStudent({ 
                    name: `${studInfo.first} ${studInfo.last}`,
                    id: studInfo.tup_id,
                    email: studInfo.email
                });
                const loans = res.data.filter(r => r.status !== 'Returned').map(r => ({
                    id: catalog.find(b => b.title === r.book_title)?.id,
                    title: r.book_title,
                    cover_image: catalog.find(b => b.title === r.book_title)?.cover_image
                })).filter(item => item.id);
                setActiveLoans(loans);
                setMode('borrow');
                setCart([]);
                setBookSearch('');
            })
            .catch(() => showToast("Error loading student history.", "error"));
    };
    const toggleCart = (book) => {
        if (cart.find(b => b.id === book.id)) {
            setCart(cart.filter(b => b.id !== book.id));
        } else {
            setCart([...cart, book]);
        }
    };
    const submitTransaction = () => {
        if (!student || cart.length === 0) return;
        axios.post('http://127.0.0.1:8000/books/api/circulation/', {
            action: mode,
            tup_id: student.id,
            book_ids: cart.map(b => b.id)
        })
        .then(res => {
            const hasFailure = res.data.results.some(r => r.includes('⛔') || r.includes('❌'));
            if (hasFailure) alert(res.data.results.join('\n'));
            else showToast(`Successfully ${mode === 'borrow' ? 'Borrowed' : 'Returned'} ${cart.length} books.`, "success");
            fetchCatalog();
            loadStudentData(student.id);
            setCart([]);
            setBookSearch('');
        })
        .catch(err => showToast("Transaction Failed. Server Error.", "error"));
    };
    const showToast = (msg, type) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };
    const getFilteredBooks = (list) => {
        if (!bookSearch) return list;
        return list.filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()));
    };
    return (
        <div className="dashboard-layout">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

            {/*left col, student identifer */}
            <div className="circ-sidebar">
                <div className="circ-card">
                    <h2 style={{marginTop:0}}>Identify Student</h2>
                    <div className="search-wrapper" ref={dropdownRef}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Type Name or ID..."
                            value={searchQuery}
                            onChange={e => {setSearchQuery(e.target.value); setShowDropdown(true);}}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowDropdown(true)}
                        />
                        {showDropdown && predictions.length > 0 && (
                            <ul className="predictive-list">
                                {predictions.map(s => (
                                    <li key={s.tup_id} onClick={() => selectStudent(s)}>
                                        <strong>{s.first} {s.last}</strong><br/><small>{s.tup_id}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {student && (
                        <div className="student-profile-mini">
                            <div className="avatar-mini">{student.name.charAt(0)}</div>
                            <div className="info">
                                <h3>{student.name}</h3>
                                <p>{student.id}</p>
                                <span className="badge">{activeLoans.length} Active Loans</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/*right col, */}
            <div className="circ-main-area">
                {!student ? (
                    <div className="empty-state-circ">
                        <div style={{fontSize: '4rem'}}>👋</div>
                        <h3>Welcome to Circulation</h3>
                        <p>Search for a registered student on the left to begin.</p>
                    </div>
                ) : (
                    <>
                        <div className="mode-tabs">
                            <button className={`tab-btn ${mode === 'borrow' ? 'active' : ''}`} onClick={() => {setMode('borrow'); setCart([]); setBookSearch('');}}>
                                Borrow Books
                            </button>
                            <button className={`tab-btn ${mode === 'return' ? 'active' : ''}`} onClick={() => {setMode('return'); setCart([]); setBookSearch('');}}>
                                Return Books ({activeLoans.length})
                            </button>
                        </div>
                        {/*borrow/return search*/}
                        <div style={{marginBottom: '20px'}}>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder={`Search ${mode === 'borrow' ? 'catalog' : 'loans'} by title...`}
                                value={bookSearch}
                                onChange={(e) => setBookSearch(e.target.value)}
                            />
                        </div>
                        <div className="book-selection-grid">
                            {mode === 'borrow' ? (
                                getFilteredBooks(catalog.filter(b => b.status === 'Available')).map(book => (
                                    <div key={book.id} className={`book-select-card ${cart.find(c=>c.id===book.id) ? 'selected' : ''}`} onClick={() => toggleCart(book)}>
                                        <div className="cover-thumb">
                                            {book.cover_image ? <img src={`http://127.0.0.1:8000/static/books/images/${book.cover_image}`} alt="" /> : <span>📘</span>}
                                        </div>
                                        <div className="book-meta">
                                            <h4>{book.title}</h4>
                                            <p>{book.author.join(', ')}</p>
                                        </div>
                                        <div className="checkbox"></div>
                                    </div>
                                ))
                            ) : (
                                getFilteredBooks(activeLoans).length === 0 ? <p className="no-data">No books found.</p> :
                                getFilteredBooks(activeLoans).map(book => (
                                    <div key={book.id} className={`book-select-card ${cart.find(c=>c.id===book.id) ? 'selected' : ''}`} onClick={() => toggleCart(book)}>
                                        <div className="cover-thumb">
                                            {book.cover_image ? <img src={`http://127.0.0.1:8000/static/books/images/${book.cover_image}`} alt="" /> : <span>📘</span>}
                                        </div>
                                        <div className="book-meta">
                                            <h4>{book.title}</h4>
                                            <p className="due-alert">Checked Out</p>
                                        </div>
                                        <div className="checkbox"></div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="transaction-footer">
                            <div className="cart-summary"><strong>{cart.length}</strong> books selected</div>
                            <button className={`confirm-action-btn ${mode}`} disabled={cart.length === 0} onClick={submitTransaction}>
                                Confirm {mode === 'borrow' ? 'Borrow' : 'Return'}
                            </button>
                        </div>
                    </>
                )}
            </div>
            {toast && <div className={`toast-popup ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
};
export default Circulation;