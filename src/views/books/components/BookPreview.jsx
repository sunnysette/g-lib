import React, { useContext, useState, useCallback } from 'react';
import { Link as RouterLink } from "react-router-dom";
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';

import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

const GridEl = styled(Grid)`
	img{
		width: 100%;
		max-width: 100%;
	}
	.book-author{
		margin: 5px 0;
	}
	.book-title{
		margin: 0;
		font-size: 30px;
	}
`;
const BookPreview = ({ bookId, book, goBack }) => {
	const firebase = useContext(FirebaseContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDelete = useCallback(() => {
		firebase.db.collection('books').doc(bookId).delete()
			.then(() => {
				goBack();
			});
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
			<GridEl container spacing={2}>
				<Grid item xs={4}>
					<img src={ book.picture ? book.picture : `https://picsum.photos/200/300?random=${bookId}` } />
				</Grid>
				<Grid item xs={8}>
					<p className="book-author">{ book.author }</p>
					<h2 className="book-title">{ book.title }</h2>
					<Box display="flex">
						<Box mr={1}>
							<Chip className="book-copies" label={ "Copies: " + book.copies } />
						</Box>
						<Box mr={1}>
							<Chip className="book-id" label={ "Internal ID: " + book.id } />
						</Box>
					</Box>
				</Grid>
			</GridEl>
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