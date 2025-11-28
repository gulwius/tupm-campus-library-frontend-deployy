// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// //testing
// const BookList = () => {
//     const [books] = useState([
//         {
//             id: 1,
//             title: "Fundamentals of Information Technology",
//             status: "Borrowed",
//             cover_image: "foit2023.jpg"
//         },
//         {
//             id: 2,
//             title: "Jurassic Park",
//             status: "Available",
//             cover_image: "jp1990.jpg"
//         },
//         {
//             id: 3,
//             title: "Clean Code",
//             status: "Available",
//             cover_image: null
//         },
//         {
//             id: 4,
//             title: "The Pragmatic Programmer",
//             status: "Overdue",
//             cover_image: null
//         }
//     ]);
//     return (
//         <div>
//             <div style={{marginBottom: '20px', textAlign: 'left'}}>
//                 <h2>Library Catalog</h2>
//                 <p style={{color: '#666'}}>Browse our collection of books.</p>
//             </div>
//             <ul className="book-list">
//                 {books.map(book => (
//                     <li key={book.id} className="book-item">
//                         <Link to={`/book/${book.id}`}>
//                             {book.cover_image ? (
//                                 <img 
//                                     src={`http://127.0.0.1:8000/static/books/images/${book.cover_image}`} 
//                                     alt={book.title}
//                                     style={{width: '100%', height: '200px', objectFit: 'cover', marginBottom: '10px', borderRadius: '4px'}}
//                                     onError={(e) => {e.target.onerror = null; e.target.src="https://placehold.co/200x300?text=No+Cover"}}
//                                 />
//                             ) : (
//                                 <div style={{width: '100%', height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', borderRadius: '4px'}}>
//                                     No Cover
//                                 </div>
//                             )}
//                             {book.title}
//                         </Link>
//                         <span className={`status ${book.status.toLowerCase()}`}>
//                             {book.status}
//                         </span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
// export default BookList;