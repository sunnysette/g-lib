import React, { useEffect, useContext, useReducer } from 'react';
import { isEmpty } from 'lodash';

import { FirebaseContext } from '../Firebase';
import BookContext from './BookContext';

function booksReducer(state, action) {
	switch (action.type) {
		case 'bulkPush':
			return { ...state, ...action.books.reduce((books, book, key) => ({ ...books, [book.id]: book.book }), {}) };
		case 'bulkPops':
			const newBulkState = {...state};
			action.books.forEach((id) => {
				delete newBulkState[id];
			});
			return newBulkState;
		case 'bulkUpdates':
			return { ...state, ...action.books.reduce((books, book, key) => ({...books, [book.id]: book.book }), {}) };
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
			.orderBy('id', 'asc')
			.onSnapshot((snapshot) => {
				if (mounted) {
					const bulkPushes = [];
					const bulkPops = [];
					const bulkUpdates = [];
					snapshot.docChanges().forEach(function(change) {
						switch (change.type) {
							case 'added':
								bulkPushes.push({ id: change.doc.id, book: change.doc.data() });
								break;
							case 'removed':
								bulkPops.push(change.doc.id);
								break;
							case 'modified':
								bulkUpdates.push({ id: change.doc.id, book: change.doc.data() });
								break;
						}
					});
					!isEmpty(bulkPushes) && dispatchBooks({ type: 'bulkPush', books: bulkPushes });
					!isEmpty(bulkPops) && dispatchBooks({ type: 'bulkPops', books: bulkPops });
					!isEmpty(bulkUpdates) && dispatchBooks({ type: 'bulkUpdates', books: bulkUpdates });
				}
			});
		firebase.db.collection('books')
			.orderBy('id', 'asc')
			.get()
			.then(function(querySnapshot) {
				if (mounted) {
					const intBooks = [];
					querySnapshot.forEach(function(doc) {
						intBooks.push({id: doc.id, book: doc.data()});
					});
					dispatchBooks({ type: 'bulkPush', books: intBooks });
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