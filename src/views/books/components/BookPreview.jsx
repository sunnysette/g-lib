import React, { useContext, useState, useCallback } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

import { dbWritePromise } from '../../../utils/functions';

const BookPreview = ({ bookId, book, goBack }) => {
	const firebase = useContext(FirebaseContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDelete = useCallback(() => {
		dbWritePromise(firebase.db.collection('books').doc(bookId).delete())
			.then(() => goBack());
	}, [bookId, goBack]);
	const handleDeleteDialogOpen = useCallback(() => setDeleteDialogOpen(true), []);
	const handleDeleteDialogClose = useCallback(() => setDeleteDialogOpen(false), []);

	if (typeof book === 'undefined') return null;
	return (
		<>
			<DrawerHeader onBack={goBack}>
				<Box mr={2}>
					<Button
						startIcon={<DeleteIcon fontSize="small" />}
						onClick={handleDeleteDialogOpen}
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
			<Table>
				<TableBody>
					<TableRow>
						<TableCell width="200px" variant="head">ID</TableCell>
						<TableCell>{ book.id }</TableCell>
					</TableRow>
					{ !isEmpty(book.punjabi_title) && (
						<TableRow>
							<TableCell variant="head">Punjabi title</TableCell>
							<TableCell>{ book.punjabi_title }</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell variant="head">Title</TableCell>
						<TableCell>{ book.title }</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Author</TableCell>
						<TableCell>{ book.author }</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Copies</TableCell>
						<TableCell>{ book.copies }</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>Delete this book?</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure about deleting this book? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleDelete} variant="contained" color="secondary" autoFocus>Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default BookPreview;