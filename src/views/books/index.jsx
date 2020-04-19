import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';

import BookContext from '../../context/Book/BookContext';
import BookItem from './components/BookItem';

const BooksView = () => {
	const bookStore = useContext(BookContext);

	return (
		<Container>
			<Box p={4} display="flex" flexWrap="wrap">
				{ Object.keys(bookStore.books).map((key) => <BookItem key={key} id={key} book={bookStore.books[key]} />)}
			</Box>
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