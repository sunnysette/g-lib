import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';

import BorrowContext from '../../../context/Borrow/BorrowContext';
import BorrowForm from './BorrowForm';

const StyledDrawer = styled(Drawer)`
	.MuiDrawer-paper {
		max-width: 100%;
		min-width: 50vw;

		@media(max-width: 767px){
			min-width: 100%;
		}
	}
`;

const BorrowDetails = ({ match, ...props }) => {
	const [open, setOpen] = useState(false);
	const borrowStore = useContext(BorrowContext);
	const history = useHistory();

	const borrowId = match.params.id;
	const mode = match.params.mode;

	const borrow = borrowStore.getBorrow(borrowId);

	const goToBorrows = useCallback(() => {
		setOpen(false);
		setTimeout(() => history.push("/borrows/"), 300);
	}, [history]);
	const goBack = useCallback(() => {
		if (mode === 'edit') {
			history.push(`/borrows/view/${borrowId}`);
		}
		else {
			goToBorrows();
		}
	}, [borrowId, mode, history, goToBorrows]);

	useEffect(() => {
		setTimeout(() => setOpen(true), 100);
	}, []);

	const componentToShow = useMemo(() => {
		let component = null;
		switch (mode) {
			case 'edit':
				component = <BorrowForm borrowId={borrowId} borrow={borrow} goBack={goBack} />
				break;
			default:
				component = <BorrowForm create={true} goBack={goBack} />
				break;
		}
		return component;
	}, [borrowId, borrow, mode, goBack]);

	return (
		<StyledDrawer anchor="right" open={open} onClose={goToBorrows}>
			<Container style={{ minWidth: '40vw' }}>
				<Box p={2}>
					{ componentToShow }
				</Box>
			</Container>
		</StyledDrawer>
	);
};

export default BorrowDetails;