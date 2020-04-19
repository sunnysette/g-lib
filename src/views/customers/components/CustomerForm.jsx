import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { reduce, isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import CloseIcon from '@material-ui/icons/Close';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

const CustomerForm = ({ create, customerId, customer, goBack }) => {
	const [formCustomer, setCustomer] = useState(create ? {
		firstname: '',
		lastname: '',
		address: '',
		email: '',
		deposit: 0,
		registration_date: new Date()
	} : customer);
	const [openModSnackbar, setModSnackbar] = useState(false);
	const [saving, setSaving] = useState(false);
	const firebase = useContext(FirebaseContext);
	const formRef = useRef(null);

	const getCustomerDiffs = useCallback(() => {
		return reduce(formCustomer, (diffs, value, key) => {
			if (customer[key] !== value) {
				diffs[key] = value;
			}
			return diffs;
		}, {});
	}, [formCustomer, customer]);

	const modSnackbarUpdate = useCallback(() => {
		setCustomer(customer);
		setModSnackbar(false);
	}, [customer]);

	const saveCustomer = useCallback((e) => {
		e.preventDefault();
		if (create) {
			firebase.db.collection('customers').doc().set(formCustomer)
				.then(() => {
					goBack();
				});
		}
		else {
			const customerDiffs = getCustomerDiffs();
			if (!isEmpty(customerDiffs)) {
				setSaving(true);
				firebase.db.collection('customers').doc(customerId).update(formCustomer)
					.then(() => {
						goBack();
					});
			}
			else {
				goBack();
			}
		}
		return false;
	}, [create, customerId, goBack, formCustomer, getCustomerDiffs, firebase]);

	useEffect(() => {
		if (!create) {
			if (typeof formCustomer === 'undefined'){
				setCustomer(customer);
			}
			else {
				const customerDiffs = getCustomerDiffs();
				if (!isEmpty(customerDiffs) && !saving) {
					setModSnackbar(true);
				}
			}
		}
	}, [customer, saving, formCustomer, create, getCustomerDiffs]);

	const modSnackbarClose = () => setModSnackbar(false);

	const handleChange = (event) => {
		setCustomer({
			...formCustomer,
			[event.target.name]: event.target.value
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
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.id} type="number" name="id" label="Card number" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.firstname} type="text" name="firstname" label="First name" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.lastname} type="text" name="lastname" label="Last name" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formCustomer.email} type="email" name="email" label="Email" onChange={handleChange} />
				</FormControl>
			</form>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={openModSnackbar}
				autoHideDuration={6000}
				onClose={modSnackbarClose}
				message="This customer has changed. Update the view to see the changes."
				action={
					<>
						<Button color="secondary" size="small" onClick={modSnackbarUpdate}>Update</Button>
						<IconButton size="small" aria-label="close" color="inherit" onClick={modSnackbarClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</>
				}
			/>
		</>
	);
}

export default CustomerForm;