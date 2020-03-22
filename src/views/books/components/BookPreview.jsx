import React, { useContext } from 'react';
import { Link as RouterLink } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

const BookPreview = ({ bookId, book, goBack }) => {
	const firebase = useContext(FirebaseContext);

	function handleDelete() {
		firebase.db.collection('books').doc(bookId).delete()
			.then(() => {
				goBack();
			});
	}

	if (typeof book === 'undefined') return null;
	return (
		<>
			<DrawerHeader onBack={goBack}>
				<Box mr={2}>
					<Button
						startIcon={<DeleteIcon fontSize="small" />}
						onClick={handleDelete}
					>Delete</Button>
				</Box>
				<Button
					variant="contained"
					color="primary"
					to={`/books/edit/${bookId}`}
					component={RouterLink}
					disableElevation={true}
					startIcon={<EditIcon fontSize="small" />}
				>Edit</Button>
			</DrawerHeader>
			<Box display="flex">
				<div>
					<img src={ book.picture ? book.picture : `https://picsum.photos/200?random=${bookId}` } />
				</div>
				<div>
					<h2>{ book.title }</h2>
					<p>{ book.author }</p>
					<p>{ book.copies }</p>
					<p>{ book.id }</p>
				</div>
			</Box>
		</>
	);
}

export default BookPreview;