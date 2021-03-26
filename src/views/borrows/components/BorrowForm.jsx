import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { reduce, isEmpty } from 'lodash';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

import BookContext from '../../../context/Book/BookContext';
import CustomerContext from '../../../context/Customer/CustomerContext';

import { dbWritePromise } from '../../../utils/functions';

const BorrowForm = ({ create, borrowId, borrow, goBack }) => {
	const [formBorrow, setBorrow] = useState(create ? {
		book: '',
		customer: '',
		date: '',
		returnDate: null
	} : borrow);
	const firebase = useContext(FirebaseContext);
	const formRef = useRef(null);

	const bookStore = useContext(BookContext);
	const customerStore = useContext(CustomerContext);

	const getCustomerDiffs = useCallback(() => {
		return reduce(formBorrow, (diffs, value, key) => {
			if (borrow[key] !== value) {
				diffs[key] = value;
			}
			return diffs;
		}, {});
	}, [formBorrow, borrow]);

	const saveBorrow = useCallback((e) => {
		e.preventDefault();
		if (create) {
			formBorrow.date = new Date();
			dbWritePromise(firebase.db.collection('borrows').doc().set(formBorrow))
				.then(() => goBack());
		}
		else {
			const customerDiffs = getCustomerDiffs();
			if (!isEmpty(customerDiffs)) {
				dbWritePromise(firebase.db.collection('borrows').doc(borrowId).update(formBorrow))
					.then(() => goBack());
			}
			else {
				goBack();
			}
		}
		return false;
	}, [create, borrowId, goBack, formBorrow, getCustomerDiffs, firebase]);

	useEffect(() => {
		!create && typeof formBorrow === 'undefined' && setBorrow(borrow);
	}, [borrow, formBorrow, create]);

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
					onClick={saveBorrow}
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
					onClick={saveBorrow}
				>Save</Button>
			</>
		);
	}

	if (typeof formBorrow === 'undefined' || isEmpty(bookStore.books) || isEmpty(customerStore.customers)) return null;

	const books = reduce(bookStore.books, (arr, value, key) => [...arr, { uid: key, ...value}], []);
	const customers = reduce(customerStore.customers, (arr, value, key) => [...arr, { uid: key, ...value}], []);

	return (
		<>
			<DrawerHeader onBack={goBack}>{ headerActions }</DrawerHeader>
			<form ref={formRef}>
				<FormControl fullWidth={true} margin="dense">
					<Autocomplete
						value={books.filter((book) => book.uid === formBorrow.book)[0] || []}
						onChange={(event, newValue) => {
							if (!!newValue) {
								setBorrow({ ...formBorrow, book: newValue.uid || "" });
							}  else {
								setBorrow({ ...formBorrow, book: "" });
							}
						}}
						options={books}
						getOptionLabel={(option) => option.title || ""}
						renderInput={(params) => <TextField {...params} type="text" name="book" label="Book" />}
					/>
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<Autocomplete
						value={customers.filter((customer) => customer.uid === formBorrow.customer)[0] || []}
						onChange={(event, newValue) => {
							if (!!newValue) {
								setBorrow({ ...formBorrow, customer: newValue.uid || "" });
							} else {
								setBorrow({ ...formBorrow, customer: "" });
							}
						}}
						options={customers}
						getOptionLabel={(option) => option.name || ""}
						renderInput={(params) => <TextField {...params} type="text" name="customer" label="Customer" />}
					/>
				</FormControl>
			</form>
		</>
	);
}

export default BorrowForm;