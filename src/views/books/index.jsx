import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isEmpty, reduce } from 'lodash';

import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { DataGrid, GridToolbarContainer, GridDensitySelector, GridFilterToolbarButton } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';

import BookContext from '../../context/Book/BookContext';

const columns = [
	{ field: 'internal_id', headerName: 'ID', width: 100 },
	{ field: 'punjabi_title', headerName: 'Punjabi title', flex: 1 },
	{ field: 'title', headerName: 'Title', flex: 1 },
	{
	  field: 'author',
	  headerName: 'Author',
	  flex: 1,
	},
];

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridDensitySelector />
			<GridFilterToolbarButton />
		</GridToolbarContainer>
	);
}

const BooksView = () => {
	const bookStore = useContext(BookContext);
	const history = useHistory();

	return (
		<Container>
			<div style={{ padding: '50px 0', display: 'flex', height: '100%' }}>
  				<div style={{ flexGrow: 1 }}>
					<DataGrid
						rows={reduce(bookStore.books, (acc, book, key) => ([...acc, { ...book, internal_id: book.id, id: key }]), [])}
						columns={columns}
						pageSize={15}
						loading={isEmpty(bookStore.books)}
						density="compact"
						onRowClick={(book) => history.push(`/books/view/${book.row.id}`)}
						rowsPerPageOptions={[15, 30, 50, 100]}
						components={{ Toolbar: CustomToolbar }}
						autoHeight
					/>
				</div>
			</div>
			<Fab 
				to="/books/new/"
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
		</Container>
	);
};

export default BooksView;