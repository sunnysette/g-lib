import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../context/Firebase';

const DashboardView = () => {
	const firebase = useContext(FirebaseContext);

	useEffect(() => {
	}, []);

	return (
		<p>This is the Dashboard</p>
	);
};

export default DashboardView;