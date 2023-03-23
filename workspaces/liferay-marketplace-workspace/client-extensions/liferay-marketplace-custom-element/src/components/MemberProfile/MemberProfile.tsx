import { MemberProps } from '../../pages/PublishedAppsDashboardPage/PublishedDashboardPageUtil';

import './MemberProfile.scss';

interface MemberProfileProps {
	member: MemberProps;
}

export function MemberProfile({member}: MemberProfileProps) {
	return (
		<div className="member-profile-view-container">
			<div className="member-profile-card">
				<h2 className="member-profile-card-heading">
					Profile
				</h2>
				<div className="member-profile-card-icon d-inline-block">
					<img src="" alt="Member Card Icon"></img>
				</div>
				<div className="member-profile-information">
					<div className="member-profile-name">
						<div className="member-profile-name-heading d-inline-block">
							Name
						</div>
						<div className="member-profile-name-data d-inline-block ml-4">
							{member.name}
						</div>
					</div>
					<div className="member-profile-name">
						<div className="member-profile-email-heading d-inline-block">
							Email
						</div>
						<div className="member-profile-email-data d-inline-block ml-4">
							{member.email}
						</div>
					</div>
					<div className="member-profile-name">
						<div className="member-profile-user-id-heading d-inline-block">
							User ID
						</div>
						<div className="member-profile-user-id-data  d-inline-block ml-4">
							{member.userId}
						</div>
					</div>
				</div>
			</div>
			<div className="member-roles-card">
				<h2 className="member-roles-card-heading">
					Roles
				</h2>
				<div className="member-roles-card-icon d-inline-block">
					<img src="" alt="Member Roles Icon"></img>
				</div>
				<div className="member-roles-information">
					<div className="member-roles-name">
						<div className="member-roles-name-heading d-inline-block">
							Roles
						</div>
						<div className="member-roles-name-data d-inline-block ml-4">
							Permissions
						</div>
					</div>
				</div>
			</div>
			<div className="member-account-card">
				<h2 className="member-account-card-heading">
					Account
				</h2>
				<div className="member-account-card-icon d-inline-block">
					<img src="" alt="Member Account Icon"></img>
				</div>
				<div className="member-account-information">
					<div className="member-account-name">
						<div className="member-account-name-heading d-inline-block">
							Membership
						</div>
						<div className="member-account-name-data d-inline-block ml-4">
							Invited On {member.dateCreated}
						</div>
						<div className="member-account-name-data ml-4">
							{member.lastLoginDate &&
								<div>
									Last Login at {member.lastLoginDate}
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}