import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { reduce, isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

import { dbWritePromise } from '../../../utils/functions';

const BookForm = ({ create, bookId, book, goBack }) => {
	const [formBook, setBook] = useState(create ? {
		id: 0,
		title: '',
		author: '',
		copies: 1,
		picture: ''
	} : book);
	const firebase = useContext(FirebaseContext);
	const formRef = useRef(null);

	const getBookDiffs = useCallback(() => {
		return reduce(formBook, (diffs, value, key) => {
			if (book[key] !== value) {
				diffs[key] = value;
			}
			return diffs;
		}, {});
	}, [formBook, book]);

	const saveBook = useCallback((e) => {
		e.preventDefault();
		if (create) {
			dbWritePromise(firebase.db.collection('books').doc().set(formBook))
				.then(() => goBack());
		}
		else {
			const bookDiffs = getBookDiffs();
			if (!isEmpty(bookDiffs)) {
				dbWritePromise(firebase.db.collection('books').doc(bookId).update(formBook))
					.then(() => goBack());
			}
			else {
				goBack();
			}
		}
		return false;
	}, [create, bookId, goBack, formBook, getBookDiffs, firebase]);

	useEffect(() => {
		!create && typeof formBook === 'undefined' && setBook(book);
	}, [book, formBook, create]);

	const handleChange = (event) => {
		setBook({
			...formBook,
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
					<TextField value={formBook.punjabi_title} type="text" name="punjabi_title" label="Punjabi Title" onChange={handleChange} />
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
		</>
	);
}

export default BookForm;