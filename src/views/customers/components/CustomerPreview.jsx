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
const CustomerPreview = ({ customerId, customer, goBack }) => {
	const firebase = useContext(FirebaseContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDelete = useCallback(() => {
		firebase.db.collection('customers').doc(customerId).delete()
			.then(() => {
				goBack();
			});
	}, [customerId, goBack]);
	const handleDeleteDialogOpen = useCallback(() => setDeleteDialogOpen(true), []);
	const handleDeleteDialogClose = useCallback(() => setDeleteDialogOpen(false), []);

	if (typeof customer === 'undefined') return null;
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
					to={`/customers/edit/${customerId}`}
					component={RouterLink}
					disableElevation={true}
					startIcon={<EditIcon fontSize="small" />}
				>Edit</Button>
			</DrawerHeader>
			<GridEl container spacing={2}>
				<Grid item xs={4}>
					<img src={ customer.picture ? customer.picture : `https://picsum.photos/200/300?random=${customerId}` } />
				</Grid>
				<Grid item xs={8}>
					<h2 className="customer-name">{ customer.firstname } { customer.lastname }</h2>
				</Grid>
			</GridEl>
			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>Delete this customer?</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure about deleting this customer? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleDelete} variant="contained" color="secondary" autoFocus>Delete</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default CustomerPreview;