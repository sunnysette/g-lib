import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { FirebaseContext } from './context/Firebase';
import BookContextProvider from './context/Book/BookContextProvider';
import CustomerContextProvider from './context/Customer/CustomerContextProvider';
import BorrowContextProvider from './context/Borrow/BorrowContextProvider';

import DashboardView from './views/dashboard';
import BooksView from './views/books';
import BookDetails from './views/books/components/BookDetails';
import CustomersView from './views/customers';
import CustomerDetails from './views/customers/components/CustomerDetails';
import BorrowsView from './views/borrows';
import BorrowDetails from './views/borrows/components/BorrowDetails';
import ImportView from './import/index';
import Login from './views/login/index'
import Navbar from './shared/Navbar'
import './App.css';

function App() {
	const firebase = useContext(FirebaseContext);
	const [user, setUser] = useState(undefined);
	const [darkState, setDarkState] = useState(localStorage.getItem('darkMode') === 'true' || false);
	const palletType = darkState ? "dark" : "light";

	const theme = createMuiTheme({
		palette: {
			type: palletType,
			primary: {
				main: darkState ? '#6379f3' : '#3f51b5'
			}
		},
		overrides: {
			MuiFormControl: {
				root: {
					display: 'flex'
				}
			}
		},
		MuiCssBaseline: {
			'@global': {
				body: {
					backgroundColor: darkState ? '#424242' : '#fafafa'
				},
			},
		},
	});

	useEffect(() => {
		const unlisten = firebase.auth.onAuthStateChanged((authUser) => {
			setUser(authUser);
		});
		return () => unlisten();
	}, []);

	if (typeof user === 'undefined') {
		return null;
	}
	if (!user) {
		return (
			<Login />
		);
	}
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BookContextProvider>
				<CustomerContextProvider>
					<BorrowContextProvider>
						<BrowserRouter>
							<Navbar setDarkState={setDarkState} />
							<Route exact path="/" component={DashboardView} />
							<Route path="/books/" component={BooksView} />
							<Route exact path="/books/:mode(view|edit)/:id" component={BookDetails} />
							<Route exact path="/books/:mode(new)/" component={BookDetails} />
							<Route path="/customers/" component={CustomersView} />
							<Route exact path="/customers/:mode(view|edit)/:id" component={CustomerDetails} />
							<Route exact path="/customers/:mode(new)/" component={CustomerDetails} />
							<Route path="/borrows/" component={BorrowsView} />
							<Route exact path="/borrows/:mode(view|edit)/:id" component={BorrowDetails} />
							<Route exact path="/borrows/:mode(new)/" component={BorrowDetails} />
							<Route path="/import/" component={ImportView} />
						</BrowserRouter>
					</BorrowContextProvider>
				</CustomerContextProvider>
			</BookContextProvider>
		</ThemeProvider>
	);
}

export default App;
