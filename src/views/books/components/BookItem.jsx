import React from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing(2),
		'&:hover,&:focus': {
			boxShadow: theme.shadows[8],
		},
	}
}));

const BookItem = ({book, id}) => {
	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardActionArea to={`/books/view/${id}`} component={Link}>
				<img src={ book.picture ? book.picture : `https://picsum.photos/200?random=${id}` } />
				<CardContent>
					Title: {book.title}
					<br/>
					Author: {book.author}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default BookItem;