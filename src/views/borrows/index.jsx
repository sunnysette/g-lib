import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../context/Firebase';

const BorrowsView = () => {
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
		let mounted = true;
		return () => { mounted = false; };
	}, []);

	return (
		<p>This is the Borrows</p>
	);
};

export default BorrowsView;