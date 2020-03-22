import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";

import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';

import BookContext from '../../../context/Book/BookContext';
import BookPreview from './BookPreview';
import BookForm from './BookForm';

const StyledDrawer = styled(Drawer)`
	.MuiDrawer-paper {
		max-width: 100%;
		min-width: 40vw;
	}
`;

const BookDetails = ({ match, ...props }) => {
	const [open, setOpen] = useState(false);
	const bookStore = useContext(BookContext);
	const history = useHistory();

	const bookId = match.params.id;
	const mode = match.params.mode;

	const book = bookStore.getBook(bookId);

	function goToBooks() {
		setOpen(false);
		setTimeout(() => {
			history.push("/books/");
		}, 300);
	}
	function goBack() {
		if (mode === 'edit') {
			history.push(`/books/view/${bookId}`);
		}
		else {
			goToBooks();
		}
	}

	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setOpen(true);
			}, 100);
		}
	}, [mode]);

	let componentToShow = null;
	switch (mode) {
		case 'new':
			componentToShow = <BookForm create={true} goBack={goBack} />
			break;
		case 'view':
			componentToShow = <BookPreview bookId={bookId} book={book} goBack={goBack} />
			break;
		case 'edit':
			componentToShow = <BookForm bookId={bookId} book={book} goBack={goBack} />
			break;
	}

	return (
		<StyledDrawer anchor="right" open={open} onClose={goToBooks}>
			<Container style={{ minWidth: '40vw' }}>
				<Box p={2}>
					{ componentToShow }
				</Box>
			</Container>
		</StyledDrawer>
	);
};

export default BookDetails;