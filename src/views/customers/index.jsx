import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isEmpty, reduce } from 'lodash';

import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { DataGrid, GridToolbarContainer, GridDensitySelector, GridFilterToolbarButton } from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';

import CustomerContext from '../../context/Customer/CustomerContext';

const columns = [
	{ field: 'internal_id', headerName: 'ID', width: 100 },
	{ field: 'name', headerName: 'Name', flex: 1 },
	{ field: 'city', headerName: 'City', flex: 1 },
	{ field: 'phone', headerName: 'Phone', flex: 1 },
	{ field: 'deposit', headerName: 'Deposit', flex: 1, renderCell: (params) => params.value && <span>{params.value} &euro;</span> },
];

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridDensitySelector />
			<GridFilterToolbarButton />
		</GridToolbarContainer>
	);
}

const CustomersView = () => {
	const customerStore = useContext(CustomerContext);
	const history = useHistory();

	return (
		<Container>
			<div style={{ padding: '50px 0', display: 'flex', height: '100%' }}>
  				<div style={{ flexGrow: 1 }}>
					<DataGrid
						rows={reduce(customerStore.customers, (acc, customer, key) => ([...acc, { ...customer, internal_id: customer.id, id: key }]), [])}
						columns={columns}
						pageSize={15}
						loading={typeof customerStore.customers === 'undefined'}
						density="compact"
						onRowClick={(customer) => history.push(`/customers/view/${customer.row.id}`)}
						rowsPerPageOptions={[15, 30, 50, 100]}
						components={{ Toolbar: CustomToolbar }}
						autoHeight
					/>
				</div>
			</div>
			<Fab 
				to="/customers/new/"
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

export default CustomersView;