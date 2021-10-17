import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { reduce, isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

import { dbWritePromise } from '../../../utils/functions';

const CustomerForm = ({ create, customerId, customer, goBack }) => {
	const firebase = useContext(FirebaseContext);
	// console.log(await firebase.db.collection('customers').orderBy('id', 'desc').get(), 'firebase');
	const [formCustomer, setCustomer] = useState(create ? {
		id: 0,
		city: '',
		deposit: 0,
		email: '',
		name: '',
		phone: '',
		registration_date: new Date()
	} : customer);
	const formRef = useRef(null);

	const getCustomerDiffs = useCallback(() => {
		return reduce(formCustomer, (diffs, value, key) => {
			if (customer[key] !== value) {
				diffs[key] = value;
			}
			return diffs;
		}, {});
	}, [formCustomer, customer]);

	const saveCustomer = useCallback((e) => {
		e.preventDefault();
		if (create) {
			dbWritePromise(firebase.db.collection('customers').doc().set(formCustomer))
				.then(() => goBack());
		}
		else {
			const customerDiffs = getCustomerDiffs();
			if (!isEmpty(customerDiffs)) {
				dbWritePromise(firebase.db.collection('customers').doc(customerId).update(formCustomer))
					.then(() => goBack());
			}
			else {
				goBack();
			}
		}
		return false;
	}, [create, customerId, goBack, formCustomer, getCustomerDiffs, firebase]);

	useEffect(() => {
		async function fetchData() {
			firebase.db.collection('customers')
				.orderBy('id', 'asc')
				.limitToLast(1)
				.get()
				.then((querySnapshot) => {
					querySnapshot.docs.map((doc) => {
						setCustomer((c) => ({
							...c,
							id: doc.data().id + 1
						}));
					})
				})
		}
		fetchData();
	}, []);
	useEffect(() => {
		!create && typeof formCustomer === 'undefined' && setCustomer(customer);
	}, [customer, formCustomer, create]);

	const handleChange = (event) => {
		setCustomer({
			...formCustomer,
			[event.target.name]: event.target.type === 'number' ? parseInt(event.target.value) : event.target.value
		});
	};
	let headerActions = null;
	if (create) {
		headerActions = (
			<>
				<Box mr={2}>
					<Button
						color="primary"
						onClick={goBack}
						disableElevation={true}
					>Cancel</Button>
				</Box>
				<Button
					variant="contained"
					color="secondary"
					disableElevation={true}
					onClick={saveCustomer}
				>Save</Button>
			</>
		);
	}
	else {
		headerActions = (
			<>
				<Box mr={2}>
					<Button
						color="primary"
						onClick={goBack}
						disableElevation={true}
					>Cancel</Button>
				</Box>
				<Button
					variant="contained"
					color="secondary"
					disableElevation={true}
					onClick={saveCustomer}
				>Save</Button>
			</>
		);
	}

	if (typeof formCustomer === 'undefined') return null;
	return (
		<>
			<DrawerHeader onBack={goBack}>{ headerActions }</DrawerHeader>
			<form ref={formRef}>
				<FormControl margin="dense">
					<TextField value={formCustomer.id} type="number" name="id" label="Card number" inputProps={{ readOnly: true }}/>
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.name} type="text" name="name" label="Name" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.email} type="email" name="email" label="Email" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.phone} type="text" name="phone" label="Phone" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.city} type="text" name="city" label="City" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.deposit} type="number" name="deposit" label="Deposit" onChange={handleChange} />
				</FormControl>
			</form>
		</>
	);
}

export default CustomerForm;