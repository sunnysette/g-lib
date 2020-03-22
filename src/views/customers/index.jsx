import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../context/Firebase';

const CustomersView = () => {
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		let mounted = true;
		return () => { mounted = false; };
	}, []);

	return (
		<p>This is the Customers</p>
	);
};

export default CustomersView;