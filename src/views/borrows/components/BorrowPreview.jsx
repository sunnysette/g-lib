import React, { useContext, useState, useCallback } from 'react';
import { Link as RouterLink } from "react-router-dom";
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import BookIcon from '@material-ui/icons/Book';
import EditIcon from '@material-ui/icons/EditOutlined';

import BookContext from '../../../context/Book/BookContext';
import CustomerContext from '../../../context/Customer/CustomerContext';

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
const BorrowPreview = ({ borrowId, borrow, goBack }) => {
	const firebase = useContext(FirebaseContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [returnDialogOpen, setReturnDialogOpen] = useState(false);
	const bookStore = useContext(BookContext);
	const customerStore = useContext(CustomerContext);

	const book = borrow && bookStore.getBook(borrow.book);
	const customer = borrow && customerStore.getCustomer(borrow.customer);

	const handleReturnDialogOpen = useCallback(() => setReturnDialogOpen(true), []);
	const handleReturnDialogClose = useCallback(() => setReturnDialogOpen(false), []);
	const handleDeleteDialogOpen = useCallback(() => setDeleteDialogOpen(true), []);
	const handleDeleteDialogClose = useCallback(() => setDeleteDialogOpen(false), []);
	const handleReturn = useCallback(() => {
		firebase.db.collection('borrows').doc(borrowId).update({
			returnDate: new Date()
		}).then(() => handleReturnDialogClose());
	}, [borrowId, goBack]);
	const handleDelete = useCallback(() => {
		firebase.db.collection('borrows').doc(borrowId).delete()
			.then(() => goBack());
	}, [borrowId, handleReturnDialogClose]);

	if (!borrow || !book || !customer) return null;
	
	return (
		<>
			<DrawerHeader onBack={goBack}>
				<Box mr={2}>
					<Button
						startIcon={<DeleteIcon fontSize="small" />}
						onClick={handleDeleteDialogOpen}
					>Delete</Button>
				</Box>
				{ !borrow.returnDate &&
					<Box mr={2}>
						<Button
							color="secondary"
							startIcon={<BookIcon fontSize="small" />}
							onClick={handleReturnDialogOpen}
						>Return</Button>
					</Box>
				}
				<Button
					variant="contained"
					color="primary"
					to={`/borrows/edit/${borrowId}`}
					component={RouterLink}
					disableElevation={true}
					startIcon={<EditIcon fontSize="small" />}
				>Edit</Button>
			</DrawerHeader>
			
			<BookDetail book={book} />
			<CustomerDetail customer={customer} />

			<Dialog open={returnDialogOpen} onClose={handleReturnDialogClose}>
				<DialogTitle>Return this borrow?</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure to return this borrow? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleReturnDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleReturn} variant="contained" color="secondary" autoFocus>Return</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>Delete this borrow?</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure about deleting this borrow? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleDelete} variant="contained" color="secondary" autoFocus>Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function BookDetail ({ book }) {
	return (
		<div>
			<h2>{ book.title }</h2>
			<p>{ book.author }</p>
		</div>
	);
}
function CustomerDetail ({ customer }) {
	return (
		<div>

		</div>
	);
}
export default BorrowPreview;