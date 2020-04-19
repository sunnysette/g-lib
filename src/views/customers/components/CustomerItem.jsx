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

const CustomerItem = ({customer, id}) => {
	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardActionArea to={`/customers/view/${id}`} component={Link}>
				<img src={ customer.picture ? customer.picture : `https://picsum.photos/200?random=${id}` } />
				<CardContent>
					{ customer.firstname }
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CustomerItem;