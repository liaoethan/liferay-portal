import ClayTable from '@clayui/table';

import swapVert from '../../assets/icons/swap-vert.svg';
import dashboardLoadingIcon from '../../assets/images/dashboard-loading.svg';

import './DashboardTable.scss';
import {DashboardTableRow} from './DashboardTableRow';

export type AppProps = {
	image: string;
	lastUpdatedBy: string;
	name: string;
	selected: boolean;
	status: string;
	type: string;
	updatedDate: string;
	updatedResponsible: string;
	version: string;
};
interface DashboardTableProps {
	apps: AppProps[];
	loading: boolean
}

export function DashboardTable({apps, loading}: DashboardTableProps) {
	if (apps.length === 0) {
		if (loading) {
			return (
				<div className="dashboard-table-loading-container">
					<div className="dashboard-table-loading-image-container">
						<img
							alt="Dashboard Loading Image"
							className="dashboard-table-loading-image"
							src={dashboardLoadingIcon}
						/>
					</div>
					<div className="dashboard-table-loading-text">
						Apps Loading . . .
					</div>
				</div>
			)
		} else {
			return (
				<div className="dashboard-table-loading-container">
					<div className="dashboard-table-loading-image-container">
						<img
							alt="Dashboard Loading Image"
							className="dashboard-table-loading-image"
							src={dashboardLoadingIcon}
						/>
						</div>
					<div className="dashboard-table-no-apps-text">
						No apps yet
					</div>
					<div className="dashboard-table-no-apps-description">
						Create new apps and they will show up here. Click on "<a href="/create-new-app">New App</a>" to start creating apps
					</div>
				</div>
			)
		}
	} else {
		return (
			<ClayTable borderless className="dashboard-table-container">
				<ClayTable.Head>
					<ClayTable.Cell headingCell>
						<div className="dashboard-table-header-name">
							<span className="dashboard-table-header-text">
								Name
							</span>

							<img
								alt="Swap Vert"
								className="dashboard-table-header-name-icon"
								src={swapVert}
							/>
						</div>
					</ClayTable.Cell>

					<ClayTable.Cell headingCell>
						<span className="dashboard-table-header-text">Version</span>
					</ClayTable.Cell>

					<ClayTable.Cell headingCell>
						<span className="dashboard-table-header-text">Type</span>
					</ClayTable.Cell>

					<ClayTable.Cell headingCell>
						<span className="dashboard-table-header-text">
							Last Updated
						</span>
					</ClayTable.Cell>

					<ClayTable.Cell headingCell>
						<span className="dashboard-table-header-text">Status</span>
					</ClayTable.Cell>
				</ClayTable.Head>

				<ClayTable.Body>
					{apps.map((app) => (
						<DashboardTableRow app={app} key={app.name} />
					))}
				</ClayTable.Body>
			</ClayTable>
		);
	}
}
