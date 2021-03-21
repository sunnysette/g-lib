import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';

import CustomerContext from '../../../context/Customer/CustomerContext';
import CustomerPreview from './CustomerPreview';
import CustomerForm from './CustomerForm';

const StyledDrawer = styled(Drawer)`
	.MuiDrawer-paper {
		max-width: 100%;
		min-width: 50vw;

		@media(max-width: 767px){
			min-width: 100%;
		}
	}
`;

const CustomerDetails = ({ match, ...props }) => {
	const [open, setOpen] = useState(false);
	const customerStore = useContext(CustomerContext);
	const history = useHistory();

	const customerId = match.params.id;
	const mode = match.params.mode;

	const customer = customerStore.getCustomer(customerId);

	const goToCustomers = useCallback(() => {
		setOpen(false);
		setTimeout(() => history.push("/customers/"), 300);
	}, [history]);
	const goBack = useCallback(() => {
		if (mode === 'edit') {
			history.push(`/customers/view/${customerId}`);
		}
		else {
			goToCustomers();
		}
	}, [customerId, mode, history, goToCustomers]);

	useEffect(() => {
		setTimeout(() => setOpen(true), 100);
	}, []);

	const componentToShow = useMemo(() => {
		let component = null;
		switch (mode) {
			case 'new':
				component = <CustomerForm create={true} goBack={goBack} />
				break;
			case 'edit':
				component = <CustomerForm customerId={customerId} customer={customer} goBack={goBack} />
				break;
			default:
				component = <CustomerPreview customerId={customerId} customer={customer} goBack={goBack} />
				break;
		}
		return component;
	}, [customerId, customer, mode, goBack]);

	return (
		<StyledDrawer anchor="right" open={open} onClose={goToCustomers}>
			<Container style={{ minWidth: '40vw' }}>
				<Box p={2}>
					{ componentToShow }
				</Box>
			</Container>
		</StyledDrawer>
	);
};

export default CustomerDetails;