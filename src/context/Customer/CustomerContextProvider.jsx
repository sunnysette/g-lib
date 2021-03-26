import React, { useEffect, useContext, useReducer } from 'react';
import { isEmpty } from 'lodash';

import { FirebaseContext } from '../Firebase';
import CustomerContext from './CustomerContext';

function customerReducer(state, action) {
	switch (action.type) {
		case 'init':
			return {};
		case 'bulkPush':
			return { ...action.customers.reduce((customers, customer, key) => ({...customers, [customer.id]: customer.customer }), {}), ...state };
		case 'bulkPops':
			const newBulkState = {...state};
			action.customers.forEach((id) => {
				delete newBulkState[id];
			});
			return newBulkState;
		case 'bulkUpdates':
			return { ...state, ...action.customers.reduce((customers, customer, key) => ({...customers, [customer.id]: customer.customer }), {}) };
		default:
			throw new Error();
	}
}

function CustomerContextProvider({ children }) {
	const firebase = useContext(FirebaseContext);
	const [customers, dispatchCustomers] = useReducer(customerReducer, undefined);

	useEffect(() => {
		let mounted = true;
		firebase.db.collection('customers')
			.orderBy('id', 'asc')
			.onSnapshot((snapshot) => {
				if (mounted) {
					const bulkPushes = [];
					const bulkPops = [];
					const bulkUpdates = [];
					if (snapshot.empty) dispatchCustomers({ type: 'init' });
					snapshot.docChanges().forEach(function(change) {
						switch (change.type) {
							case 'added':
								bulkPushes.push({ id: change.doc.id, customer: change.doc.data() });
								break;
							case 'removed':
								bulkPops.push(change.doc.id);
								break;
							case 'modified':
								bulkUpdates.push({ id: change.doc.id, customer: change.doc.data() });
								break;
						}
					});
					!isEmpty(bulkPushes) && dispatchCustomers({ type: 'bulkPush', customers: bulkPushes });
					!isEmpty(bulkPops) && dispatchCustomers({ type: 'bulkPops', customers: bulkPops });
					!isEmpty(bulkUpdates) && dispatchCustomers({ type: 'bulkUpdates', customers: bulkUpdates });
				}
			});
		/*firebase.db.collection('customers')
			.orderBy('id', 'asc')
			.get()
			.then(function(querySnapshot) {
				if (mounted) {
					const intCustomers = [];
					querySnapshot.forEach(function(doc) {
						intCustomers.push({id: doc.id, customer: doc.data()});
					});
					dispatchCustomers({ type: 'bulkPush', customers: intCustomers });
				}
			});*/
		return () => { mounted = false; };
	}, []);

	return (
		<CustomerContext.Provider value={{
			customers,
			getCustomer: (id) => customers && customers[id]
		}}>
			{ children }
		</CustomerContext.Provider>
	);
}

export default CustomerContextProvider;