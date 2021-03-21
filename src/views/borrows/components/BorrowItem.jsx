import React, { useState, useRef, useCallback, useContext } from 'react';
import { useHistory } from "react-router-dom";

import { getFormattedDate } from '../../../utils/functions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import { FirebaseContext } from '../../../context/Firebase';

const BorrowItem = ({borrow, book, customer, id}) => {
	const moreOptions = useRef();
	const history = useHistory();
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [returnDialogOpen, setReturnDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const firebase = useContext(FirebaseContext);

	const handleOptionsOpen = () => setOptionsOpen(true);
	const handleOptionsClose = () => setOptionsOpen(false);
	
	const handleReturnDialogOpen = useCallback(() => setReturnDialogOpen(true), []);
	const handleReturnDialogClose = useCallback(() => setReturnDialogOpen(false), []);
	const handleDeleteDialogOpen = useCallback(() => setDeleteDialogOpen(true), []);
	const handleDeleteDialogClose = useCallback(() => setDeleteDialogOpen(false), []);
	const handleReturn = useCallback(() => {
		firebase.db.collection('borrows').doc(id).update({
			returnDate: new Date()
		});
	}, [id]);
	const handleDelete = useCallback(() => {
		firebase.db.collection('borrows').doc(id).delete();
	}, [id]);

	if (!borrow || !book || !customer) return null;
	return (
		<TableRow>
			<TableCell component="td" scope="row">
				{book.title}
			</TableCell>
			<TableCell component="td" scope="row">
				{customer.firstname} {customer.lastname}
			</TableCell>
			<TableCell component="td" scope="row">
				{getFormattedDate(borrow.date.seconds)}
			</TableCell>
			<TableCell component="td" scope="row">
				<IconButton ref={moreOptions} onClick={handleOptionsOpen}>
					<MoreVertIcon />
				</IconButton>
				<Menu
					anchorEl={moreOptions.current}
					open={optionsOpen}
					onClose={handleOptionsClose}
				>
					<MenuItem onClick={() => { setOptionsOpen(false); handleReturnDialogOpen(); }}>
						<KeyboardReturn fontSize="small" color="primary" style={{ marginRight: '10px' }} /> Return
					</MenuItem>
					<MenuItem onClick={() => { setOptionsOpen(false); handleDeleteDialogOpen(); }}>
						<DeleteIcon fontSize="small" color="secondary" style={{ marginRight: '10px' }} /> Delete
					</MenuItem>
				</Menu>

				<Dialog open={returnDialogOpen} onClose={handleReturnDialogClose}>
					<DialogTitle>Return this borrow?</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure to return this borrow? This action can't be reverted.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleReturnDialogClose} color="primary">Cancel</Button>
						<Button onClick={handleReturn} variant="contained" color="primary" autoFocus>Return</Button>
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
			</TableCell>
		</TableRow>
	);
};

export default BorrowItem;