import React, { useContext } from 'react';
import { FirebaseContext } from '../context/Firebase';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	toolbox: {
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
}));

export default function ButtonAppBar() {
	const firebase = useContext(FirebaseContext);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const classes = useStyles();

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar className={classes.toolbox}>
					<Box display="flex" alignItems="center">
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							<MenuIcon />
						</IconButton>
						<Typography variant="h6">G Library</Typography>
					</Box>
					<div>
						<Button to="/" color="inherit" component={RouterLink}>Dashboard</Button>
						<Button to="/books/" color="inherit" component={RouterLink}>Books</Button>
						<Button to="/customers/" color="inherit" component={RouterLink}>Customers</Button>
						<Button to="/borrows/" color="inherit" component={RouterLink}>Borrows</Button>
					</div>
					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={() => {
								handleClose();
								firebase.signOut();
							}}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}
