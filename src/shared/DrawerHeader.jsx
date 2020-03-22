import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const DrawerHeader = ({ onBack, children }) => {
	return (
		<Box display="flex" justifyContent="space-between" marginBottom={2}>
			<Button
				onClick={onBack}
				startIcon={<ArrowBackIcon fontSize="small" />}
			>Back</Button>
			<Box display="flex">{ children }</Box>
		</Box>
	);
};

export default DrawerHeader;