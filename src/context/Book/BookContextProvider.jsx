import React, { useEffect, useContext, useReducer } from 'react';

import { FirebaseContext } from '../Firebase';
import BookContext from './BookContext';

function booksReducer(state, action) {
	switch (action.type) {
		case 'push':
			return { ...state, [action.id]: action.book };
		case 'pop':
			const newState = {...state};
			delete newState[action.id];
			return newState;
		case 'update':
			return { ...state, [action.id]: action.book };
		default:
			throw new Error();
	}
}

function BookContextProvider({ children }) {
	const firebase = useContext(FirebaseContext);
	const [books, dispatchBooks] = useReducer(booksReducer, {});

	useEffect(() => {
		let mounted = true;
		firebase.db.collection('books')
			.onSnapshot((snapshot) => {
				if (mounted) {
					snapshot.docChanges().forEach(function(change) {
						switch (change.type) {
							case 'added':
								dispatchBooks({ type: 'push', id: change.doc.id, book: change.doc.data() });
								break;
							case 'removed':
								dispatchBooks({ type: 'pop', id: change.doc.id });
								break;
							case 'modified':
								dispatchBooks({ type: 'update', id: change.doc.id, book: change.doc.data() });
								break;
						} 
					});
				}
			});
		firebase.db.collection('books').get()
			.then(function(querySnapshot) {
				if (mounted) {
					querySnapshot.forEach(function(doc) {
						dispatchBooks({ type: 'push', id: doc.id, book: doc.data() });
					});
				}
			});
		return () => { mounted = false; };
	}, []);

	return (
		<BookContext.Provider value={{
			books,
			getBook: (id) => books[id]
		}}>
			{ children }
		</BookContext.Provider>
	);
}

export default BookContextProvider;