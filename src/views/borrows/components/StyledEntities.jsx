import React from 'react';
import styled, { css } from 'styled-components';

import Badge from '@material-ui/core/Badge';

const ContentContainer = styled.div`
	display: flex;
	line-height: 1.5;
	max-width: 100%;
	${(props) => props.withPadding && css`
		padding: 4px 0;
	`}

	.badge-container{
		padding: 0 5px;
	}
	.content-container{
		flex: 1;
		flex-basis: 0;
		padding-left: 20px;
		max-width: 100%;
		
		> div{
			text-overflow: ellipsis;
			overflow: hidden;
			
			> span + .secondary-info:before{
				content: '-';
				padding: 0 7px;
			}
		}
		.secondary-info{
			opacity: 0.5;
		}
	}
`;
export const StyledBook = ({ book, withPadding = false }) => {
	return (
		<ContentContainer withPadding={withPadding}>
			<div className="badge-container">
				<Badge badgeContent={book.id} color="secondary" max={99999} />
			</div>
			<div className="content-container">
				<div>{book.punjabi_title}</div>
				<div>
					{book.title && (<span>{book.title}</span>)}
					{book.author && (
						<span className="secondary-info">{book.author}</span>
					)}
				</div>
			</div>
		</ContentContainer>
	);
};

export const StyledCustomer = ({ customer }) => {
	return (
		<ContentContainer>
			<div className="badge-container">
				<Badge badgeContent={customer.id} color="primary" max={99999} />
			</div>
			<div className="content-container">
				<div>{customer.name}</div>
				<div>
					{customer.city && (<span>{customer.city}</span>)}
					{customer.phone && (
						<span className="secondary-info">{customer.phone}</span>
					)}
				</div>
			</div>
		</ContentContainer>
	);
};