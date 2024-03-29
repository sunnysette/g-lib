import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
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
		min-width: 50vw;

		@media(max-width: 767px){
			min-width: 100%;
		}
	}
`;

const BookDetails = ({ match, ...props }) => {
	const [open, setOpen] = useState(false);
	const bookStore = useContext(BookContext);
	const history = useHistory();

	const bookId = match.params.id;
	const mode = match.params.mode;

	const book = bookStore.getBook(bookId);

	const goToBooks = useCallback(() => {
		setOpen(false);
		setTimeout(() => history.push("/books/"), 300);
	}, [history]);
	const goBack = useCallback(() => {
		if (mode === 'edit') {
			history.push(`/books/view/${bookId}`);
		}
		else {
			goToBooks();
		}
	}, [bookId, mode, history, goToBooks]);

	useEffect(() => {
		setTimeout(() => setOpen(true), 100);
	}, []);

	const componentToShow = useMemo(() => {
		let component = null;
		switch (mode) {
			case 'new':
				component = <BookForm create={true} goBack={goBack} />
				break;
			case 'edit':
				component = <BookForm bookId={bookId} book={book} goBack={goBack} />
				break;
			default:
				component = <BookPreview bookId={bookId} book={book} goBack={goBack} />
				break;
		}
		return component;
	}, [bookId, book, mode, goBack]);

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