import ClayTable from '@clayui/table';

import './MemberTableRow.scss';

import {MemberProps} from './MemberTable';

interface MemberTableRowProps {
	member: MemberProps;
}

export function MemberTableRow({member}: MemberTableRowProps) {
	const {
		email,
		name,
		role
	} = member;

	return (
		<ClayTable.Row>
			<ClayTable.Cell>
				<div className="member-table-row-name-container">
					<img
						alt="Member Image"
						className="member-table-row-name-logo"
						// src={image}
					/>

					<span className="member-table-row-name-text">
						{name}
					</span>
				</div>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<span className="member-table-row-text">{email}</span>
			</ClayTable.Cell>

			<ClayTable.Cell>
				<span className="member-table-row-text">{role}</span>
			</ClayTable.Cell>
		</ClayTable.Row>
	);
}