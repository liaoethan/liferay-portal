import accountIcon from '../../assets/icons/account-icon.svg';
import appIconPayments from '../../assets/icons/app-icon-payments.svg';
import appIconSales from '../../assets/icons/app-icon-sales.svg';
import appIconTransport from '../../assets/icons/app-icon-transport.svg';
import appsIcon from '../../assets/icons/apps-fill.svg';
import membersIcon from '../../assets/icons/person-fill.svg';
import salesIcon from '../../assets/icons/sales-icon.svg';
import {DashboardListItems} from '../../components/DashboardNavigation/DashboardNavigation';
import {AppProps} from './../../components/DashboardTable/DashboardTable';

export const appList: AppProps[] = [
	{
		image: appIconTransport,
		lastUpdatedBy: 'by Hanna White',
		name: 'A&Co Transport',
		selected: false,
		status: 'Published',
		type: 'SaaS',
		updatedDate: 'Feb 14, 2023',
		updatedResponsible: 'you',
		version: '1.40',
	},
	{
		image: appIconSales,
		lastUpdatedBy: 'by Hanna White',
		name: 'A&Co Sales',
		selected: false,
		status: 'Pending',
		type: 'OSGI',
		updatedDate: 'Feb 14, 2023',
		updatedResponsible: 'you',
		version: '2.28',
	},
	{
		image: appIconPayments,
		lastUpdatedBy: 'by Hanna White',
		name: 'A&Co Payments',
		selected: false,
		status: 'Hidden',
		type: 'OSGI',
		updatedDate: 'Feb 14, 2023',
		updatedResponsible: 'you',
		version: '1.0',
	},
];

export const initialDashboardNavigationItems: DashboardListItems[] = [
	{
		itemIcon: appsIcon,
		itemName: 'apps',
		itemSelected: true,
		itemTitle: 'Apps',
		items: appList,
	},
	{
		itemIcon: salesIcon,
		itemName: 'sales',
		itemSelected: false,
		itemTitle: 'Sales',
	},
	{
		itemIcon: membersIcon,
		itemName: 'members',
		itemSelected: false,
		itemTitle: 'Members',
	},
	{
		itemIcon: accountIcon,
		itemName: 'account',
		itemSelected: false,
		itemTitle: 'Account',
	},
];
