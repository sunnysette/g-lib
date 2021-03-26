import React, { useRef, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { reduce, isEmpty } from 'lodash';


import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { DataGrid, GridToolbarContainer, GridDensitySelector, GridFilterToolbarButton } from '@material-ui/data-grid';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import BookContext from '../../context/Book/BookContext';
import CustomerContext from '../../context/Customer/CustomerContext';
import { FirebaseContext } from '../../context/Firebase';

import BorrowContext from '../../context/Borrow/BorrowContext';
import { getFormattedDate, dbWritePromise } from '../../utils/functions';

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridDensitySelector />
			<GridFilterToolbarButton />
		</GridToolbarContainer>
	);
}

const Actions = ({ borrow, setBookManaged, setReturnDialogOpen, setDeleteDialogOpen }) => {
	const moreOptions = useRef();
	const [optionsOpen, setOptionsOpen] = useState(false);

	const handleOptionsOpen = (id) => {
		setOptionsOpen(true);
		setBookManaged(id);
	};

	return (
		<>
			<IconButton ref={moreOptions} onClick={() => handleOptionsOpen(borrow.row.id)}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				anchorEl={moreOptions.current}
				open={optionsOpen}
				onClose={() => setOptionsOpen(false)}
			>
				{!borrow.row.returnDate && (
					<MenuItem onClick={() => { setOptionsOpen(false); setReturnDialogOpen(true); }}>
						<KeyboardReturn fontSize="small" color="primary" style={{ marginRight: '10px' }} /> Return
					</MenuItem>
				)}
				<MenuItem onClick={() => { setOptionsOpen(false); setDeleteDialogOpen(true); }}>
					<DeleteIcon fontSize="small" color="secondary" style={{ marginRight: '10px' }} /> Delete
				</MenuItem>
			</Menu>
		</>
	);
};
const StyledCell = ({ borrow }) => {
	if (borrow.row.returnDate === null) return borrow.value || null;
	return <del>{ borrow.value }</del>;
};

const BorrowsView = () => {
	const borrowStore = useContext(BorrowContext);
	const bookStore = useContext(BookContext);
	const customerStore = useContext(CustomerContext);
	const firebase = useContext(FirebaseContext);

	const [bookManaged, setBookManaged] = useState();
	const [returnDialogOpen, setReturnDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleReturnDialogClose = useCallback(() => setReturnDialogOpen(false), []);
	const handleDeleteDialogClose = useCallback(() => setDeleteDialogOpen(false), []);
	
	const handleReturn = useCallback(() => {
		dbWritePromise(firebase.db.collection('borrows').doc(bookManaged).update({ returnDate: new Date() }))
			.then(() => handleReturnDialogClose());
	}, [bookManaged]);
	const handleDelete = useCallback(() => {
		dbWritePromise(firebase.db.collection('borrows').doc(bookManaged).delete())
			.then(() => handleDeleteDialogClose());
	}, [bookManaged]);

	const renderActions = (borrow) => (
		<Actions
			borrow={borrow}
			setBookManaged={setBookManaged}
			setReturnDialogOpen={setReturnDialogOpen}
			setDeleteDialogOpen={setDeleteDialogOpen}
		/>
	);
	const renderStyledCell = (borrow) => <StyledCell borrow={borrow} />;
	const columns = [
		{ field: 'book', headerName: 'Book', flex: 1, valueGetter: (borrow) => borrow.row.bookData && borrow.row.bookData.title, renderCell: renderStyledCell },
		{ field: 'customer', headerName: 'Customer', flex: 0.5, valueGetter: (borrow) => borrow.row.customerData && borrow.row.customerData.name, renderCell: renderStyledCell },
		{ field: 'date', headerName: 'Date', type: 'dateTime', width: 200, valueGetter: (borrow) => getFormattedDate(borrow.row.date.seconds), renderCell: renderStyledCell },
		{ field: 'actions', headerName: 'Actions', renderCell: renderActions }
	];

	return (
		<Container>
			<div style={{ padding: '50px 0', display: 'flex', height: '100%' }}>
  				<div style={{ flexGrow: 1 }}>
					<DataGrid
						rows={reduce(borrowStore.borrows, (acc, borrow, key) => ([
							...acc,
							{
								...borrow,
								id: key,
								bookData: bookStore.books[borrow.book],
								customerData: customerStore.customers[borrow.customer] 
							}
						]), [])}
						columns={columns}
						pageSize={15}
						loading={typeof borrowStore.borrows === 'undefined'}
						density="compact"
						rowsPerPageOptions={[15, 30, 50, 100]}
						components={{ Toolbar: CustomToolbar }}
						autoHeight
						disableColumnMenu
					/>
				</div>
			</div>

			<Fab 
				to="/borrows/new/"
				color="primary"
				aria-label="add"
				component={Link}
				style={{
					position: 'fixed',
					right: '40px',
					bottom: '40px'
				}}
			>
  				<AddIcon />
			</Fab>

			<Dialog open={returnDialogOpen} onClose={handleReturnDialogClose}>
				<DialogTitle>Return this borrow? {bookManaged}</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure to return this borrow? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleReturnDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleReturn} variant="contained" color="primary" autoFocus>Return</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>Delete this borrow? {bookManaged}</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure about deleting this borrow? This action can't be reverted.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">Cancel</Button>
					<Button onClick={handleDelete} variant="contained" color="secondary" autoFocus>Delete</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default BorrowsView;