import React from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		margin: theme.spacing(2),
		width: 'calc(20% - ' + theme.spacing(4) + 'px)',
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
				<img src={ customer.picture ? customer.picture : `https://picsum.photos/200?random=${id}` } style={{ width: '100%' }} />
				<CardContent>
					<span>{ customer.firstname } { customer.lastname }</span>
					<br/>
					<span>{ customer.address }</span>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CustomerItem;