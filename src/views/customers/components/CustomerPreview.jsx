import React, { useContext, useState, useCallback } from 'react';
import { Link as RouterLink } from "react-router-dom";
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';

import { getFormattedDate } from '../../../utils/functions';
import { FirebaseContext } from '../../../context/Firebase';
import DrawerHeader from '../../../shared/DrawerHeader';

import { dbWritePromise } from '../../../utils/functions';

const CustomerPreview = ({ customerId, customer, goBack }) => {
	const firebase = useContext(FirebaseContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDelete = useCallback(() => {
		dbWritePromise(firebase.db.collection('customers').doc(customerId).delete())
			.then(() => goBack());
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
			<Table>
				<TableBody>
					<TableRow>
						<TableCell width="200px" variant="head">ID</TableCell>
						<TableCell>{ customer.id }</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Name</TableCell>
						<TableCell>{ customer.name }</TableCell>
					</TableRow>
					{!isEmpty(customer.email) && (
						<TableRow>
							<TableCell variant="head">Email</TableCell>
							<TableCell>{ customer.email }</TableCell>
						</TableRow>
					)}
					{!isEmpty(customer.city) && (
						<TableRow>
							<TableCell variant="head">City</TableCell>
							<TableCell>{ customer.city }</TableCell>
						</TableRow>
					)}
					{!isEmpty(customer.phone) && (
						<TableRow>
							<TableCell variant="head">Phone</TableCell>
							<TableCell>{ customer.phone }</TableCell>
						</TableRow>
					)}
					{!isEmpty(customer.deposit) && (
						<TableRow>
							<TableCell variant="head">Deposit</TableCell>
							<TableCell>{ customer.deposit } &euro;</TableCell>
						</TableRow>
					)}
					{customer.registration_date && (
						<TableRow>
							<TableCell variant="head">Registration date</TableCell>
							<TableCell>{ getFormattedDate(customer.registration_date.seconds) }</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
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