import React, { useEffect, useContext, useReducer } from 'react';
import { isEmpty } from 'lodash';

import { FirebaseContext } from '../Firebase';
import BorrowContext from './BorrowContext';

function borrowReducer(state, action) {
	switch (action.type) {
		case 'init':
			return {};
		case 'bulkPush':
			return { ...action.borrows.reduce((borrows, borrow, key) => ({ ...borrows, [borrow.id]: borrow.borrow }), {}), ...state };
		case 'bulkPops':
			const newBulkState = {...state};
			action.borrows.forEach((id) => {
				delete newBulkState[id];
			});
			return newBulkState;
		case 'bulkUpdates':
			return { ...state, ...action.borrows.reduce((borrows, borrow, key) => ({...borrows, [borrow.id]: borrow.borrow }), {}) };
		default:
			throw new Error();
	}
}

function BorrowContextProvider({ children }) {
	const firebase = useContext(FirebaseContext);
	const [borrows, dispatchBorrows] = useReducer(borrowReducer, undefined);

	useEffect(() => {
		let mounted = true;
		firebase.db.collection('borrows')
			.orderBy('date', 'desc')
			.onSnapshot((snapshot) => {
				if (mounted) {
					const bulkPushes = [];
					const bulkPops = [];
					const bulkUpdates = [];
					if (snapshot.empty) dispatchBorrows({ type: 'init' });
					snapshot.docChanges().forEach(function(change) {
						switch (change.type) {
							case 'added':
								bulkPushes.push({ id: change.doc.id, borrow: change.doc.data() });
								break;
							case 'removed':
								bulkPops.push(change.doc.id);
								break;
							case 'modified':
								bulkUpdates.push({ id: change.doc.id, borrow: change.doc.data() });
								break;
						} 
					});
					!isEmpty(bulkPushes) && dispatchBorrows({ type: 'bulkPush', borrows: bulkPushes });
					!isEmpty(bulkPops) && dispatchBorrows({ type: 'bulkPops', borrows: bulkPops });
					!isEmpty(bulkUpdates) && dispatchBorrows({ type: 'bulkUpdates', borrows: bulkUpdates });
				}
			});
		/*firebase.db.collection('borrows')
			.orderBy('date', 'desc')
			.get()
			.then(function(querySnapshot) {
				if (mounted) {
					const intBorrows = [];
					querySnapshot.forEach(function(doc) {
						intBorrows.push({id: doc.id, borrow: doc.data()});
					});
					dispatchBorrows({ type: 'bulkPush', borrows: intBorrows });
				}
			});*/
		return () => { mounted = false; };
	}, []);

	return (
		<BorrowContext.Provider value={{
			borrows,
			getBorrow: (id) => borrows && borrows[id]
		}}>
			{ children }
		</BorrowContext.Provider>
	);
}

export default BorrowContextProvider;