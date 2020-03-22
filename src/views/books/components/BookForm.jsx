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

const BookForm = ({ create, bookId, book, goBack }) => {
	const [formBook, setBook] = useState(create ? {
		title: '',
		author: '',
		copies: 1,
		picture: ''
	} : book);
	const [openModSnackbar, setModSnackbar] = useState(false);
	const [saving, setSaving] = useState(false);
	const firebase = useContext(FirebaseContext);
	const formRef = useRef(null);
	const modSnackbarUpdate = useCallback(() => {
		setBook(book);
		setModSnackbar(false);
	}, [book]);

	const saveBook = useCallback((e) => {
		e.preventDefault();
		if (create) {
			firebase.db.collection('books').doc().set(formBook)
				.then(() => {
					goBack();
				});
		}
		else {
			const bookDiffs = reduce(formBook, (diffs, value, key) => {
				if (book[key] !== value) {
					diffs[key] = value;
				}
				return diffs;
			}, {});
			if (!isEmpty(bookDiffs)) {
				setSaving(true);
				firebase.db.collection('books').doc(bookId).update(formBook)
					.then(() => {
						goBack();
					});
			}
			else {
				goBack();
			}
		}
		return false;
	}, [book, formBook, firebase]);

	useEffect(() => {
		if (!create) {
			if (typeof formBook === 'undefined'){
				setBook(book);
			}
			else if (formBook !== book && !saving) {
				setModSnackbar(true);
			}
		}
	}, [book, saving]);

	const modSnackbarClose = () => setModSnackbar(false);

	const handleChange = (event) => {
		setBook({
			...formBook,
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
					onClick={saveBook}
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
					onClick={saveBook}
				>Save</Button>
			</>
		);
	}

	if (typeof formBook === 'undefined') return null;
	return (
		<>
			<DrawerHeader onBack={goBack}>{ headerActions }</DrawerHeader>
			<form ref={formRef}>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formBook.id} type="number" name="id" label="Internal ID" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formBook.title} type="text" name="title" label="Title" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formBook.author} type="text" name="author" label="Author" onChange={handleChange} />
				</FormControl>
				<FormControl fullWidth={true} margin="dense">
					<TextField value={formBook.copies} type="number" name="copies" label="Copies" onChange={handleChange} />
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
				message="This book has changed. Update the view to see the changes."
				action={
					<React.Fragment>
						<Button color="secondary" size="small" onClick={modSnackbarUpdate}>Update</Button>
						<IconButton size="small" aria-label="close" color="inherit" onClick={modSnackbarClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
		</>
	);
}

export default BookForm;