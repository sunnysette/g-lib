import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { FirebaseContext } from '../../context/Firebase';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const Login = () => {
	const [loginFields, setLoginFields] = useState({
		email: {value: '', valid: true},
		password: {password: '', valid: true}
	});
	const [authError, setAuthError] = useState(false);
	const [loading, setLoading] = useState(false);
	const formRef = useRef(null);
	const firebase = useContext(FirebaseContext);
	
	const handleChange = event => {
		let newLoginFields = {...loginFields};
		newLoginFields[event.target.name] = {
			value: event.target.value,
			valid: true
		};
		setLoginFields(newLoginFields);
	};

	const doLogin = useCallback((e) => {
		e.preventDefault();
		setAuthError(false);
		setLoading(true);
		let newLoginFields = {...loginFields};
		if (!newLoginFields.email.value || newLoginFields.email.value === '') {
			newLoginFields.email.valid = false;
		}
		if (!newLoginFields.password.value || newLoginFields.password.value === '') {
			console.log("it'strue");
			newLoginFields.password.valid = false;
		}
		if (newLoginFields.email.valid && newLoginFields.password.valid) {
			firebase.signIn(
				newLoginFields.email.value,
				newLoginFields.password.value
			)
				.catch(() => {
					setAuthError(true);
					setLoading(false);
				});
		} else {
			setLoginFields(newLoginFields);
			setLoading(false);
		}

		return false;
	}, [firebase, loginFields]);
	
	useEffect(() => {
		const node = formRef.current;
		node.addEventListener('submit', doLogin);
		return () => node.removeEventListener('submit', doLogin);
	});

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			style={{
				minHeight: '100vh',
				width: '99vw'
			}}
		>
			<Box p={2}>
				<Typography align="center" variant="h4" component="h1" gutterBottom>
					Singh Sabha Library
      			</Typography>
				<Paper>
					<Box p={2}>
						<form ref={formRef}>
							<FormControl fullWidth={true} margin="dense">
								<TextField type="email" name="email" label="Email" onChange={handleChange} error={!loginFields.email.valid} />
							</FormControl>
							<FormControl fullWidth={true} margin="dense">
								<TextField type="password" name="password" label="Password" onChange={handleChange} error={!loginFields.password.valid} />
							</FormControl>
							<Box mt={2} mb={2}>
								<Button fullWidth={true} variant="contained" color="primary" type="submit">
								{ loading ?
									<CircularProgress size={25} color="inherit" />
									:
									<Typography>Login</Typography>
								}
								</Button>
							</Box>
						</form>
						{ authError && (
							<Box mt={2}>
								<Alert severity="error">Authentication failed!</Alert>
							</Box>
						)}
					</Box>
				</Paper>
			</Box>
		</Box>
	);
};

export default Login;