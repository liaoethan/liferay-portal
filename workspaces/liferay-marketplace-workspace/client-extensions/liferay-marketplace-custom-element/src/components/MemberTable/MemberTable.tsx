import ClayTable from '@clayui/table';

import swapVert from '../../assets/icons/swap-vert.svg';

import './MemberTable.scss';
import { MemberTableRow } from './MemberTableRow';

export type MemberProps = {
	dateCreated: string;
	email: string;
	lastLoginDate: string;
	name: string;
	role: string;
	userId: number;
};
interface MemberTableProps {
	members: MemberProps[];
}

export function MemberTable({members}: MemberTableProps) {
	return (
		<ClayTable borderless className="member-table-container">
			<ClayTable.Head>
				<ClayTable.Cell headingCell>
					<div className="member-table-header-name">
						<span className="member-table-header-text">
							Name
						</span>

						<img
							alt="Swap Vert"
							className="member-table-header-name-icon"
							src={swapVert}
						/>
					</div>
				</ClayTable.Cell>

				<ClayTable.Cell headingCell>
					<span className="member-table-header-text">Email</span>
				</ClayTable.Cell>

				<ClayTable.Cell headingCell>
					<span className="member-table-header-text">Role</span>
				</ClayTable.Cell>
			</ClayTable.Head>

			<ClayTable.Body>
				{members.map((member) => (
					<MemberTableRow member={member} key={member.name} />
				))}
			</ClayTable.Body>
		</ClayTable>
	);
}