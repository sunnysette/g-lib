import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';

import CustomerContext from '../../context/Customer/CustomerContext';
import CustomerItem from './components/CustomerItem';

const CustomersView = () => {
	const customerStore = useContext(CustomerContext);

	return (
		<Container>
			<Box p={4} display="flex" flexWrap="wrap">
				{ Object.keys(customerStore.customers).map((key) => <CustomerItem key={key} id={key} customer={customerStore.customers[key]} />)}
			</Box>
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