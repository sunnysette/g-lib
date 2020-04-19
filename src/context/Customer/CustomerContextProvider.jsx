import React, { useEffect, useContext, useReducer } from 'react';

import { FirebaseContext } from '../Firebase';
import CustomerContext from './CustomerContext';

function customerReducer(state, action) {
	switch (action.type) {
		case 'push':
			return { ...state, [action.id]: action.customer };
		case 'pop':
			const newState = {...state};
			delete newState[action.id];
			return newState;
		case 'update':
			return { ...state, [action.id]: action.customer };
		default:
			throw new Error();
	}
}

function CustomerContextProvider({ children }) {
	const firebase = useContext(FirebaseContext);
	const [customers, dispatchCustomers] = useReducer(customerReducer, {});

	useEffect(() => {
		let mounted = true;
		firebase.db.collection('customers')
			.onSnapshot((snapshot) => {
				if (mounted) {
					snapshot.docChanges().forEach(function(change) {
						switch (change.type) {
							case 'added':
								dispatchCustomers({ type: 'push', id: change.doc.id, customer: change.doc.data() });
								break;
							case 'removed':
								dispatchCustomers({ type: 'pop', id: change.doc.id });
								break;
							case 'modified':
								dispatchCustomers({ type: 'update', id: change.doc.id, customer: change.doc.data() });
								break;
						} 
					});
				}
			});
		firebase.db.collection('customers').get()
			.then(function(querySnapshot) {
				if (mounted) {
					querySnapshot.forEach(function(doc) {
						dispatchCustomers({ type: 'push', id: doc.id, customer: doc.data() });
					});
				}
			});
		return () => { mounted = false; };
	}, []);

	return (
		<CustomerContext.Provider value={{
			customers,
			getCustomer: (id) => customers[id]
		}}>
			{ children }
		</CustomerContext.Provider>
	);
}

export default CustomerContextProvider;