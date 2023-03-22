import {useEffect, useState} from 'react';

import accountLogo from '../../assets/icons/mainAppLogo.svg';
import {AppProps, DashboardTable} from '../../components/DashboardTable/DashboardTable';
import { DashboardTableRow } from '../../components/DashboardTable/DashboardTableRow';
import { MemberProps } from '../../components/MemberTable/MemberTable';
import {getAccounts, getProducts, getProductSpecifications} from '../../utils/api';
import {DashboardListItems, DashboardPage} from '../DashBoardPage/DashboardPage';
import {initialDashboardNavigationItems} from './PublishedDashboardPageUtil';

declare let Liferay: {authToken: string, ThemeDisplay: any};

const tableHeaders = [
	{
		iconSymbol: 'order-arrow',
		title: 'Name',
	},
	{
		title: 'Version',
	},
	{
		title: 'Type',
	},
	{
		title: 'Last Updated',
	},
	{
		title: 'Rating',
	},
	{
		title: 'Status',
	},
];

export function PublishedAppsDashboardPage() {
	const [apps, setApps] = useState<AppProps[]>(Array<AppProps>());
	const [dashboardNavigationItems, setDashboardNavigationItems] = useState(
		initialDashboardNavigationItems
	);
	const [selectedNavigationItem, setSelectedNavigationItem] = useState('Apps');
	const [members, setMembers] = useState<MemberProps[]>(Array<MemberProps>());

	const messages = {
		description: 'Manage and publish apps on the Marketplace',
		emptyStateMessage: {
			description1: 'Publish apps and they will show up here.',
			description2: 'Click on “New App” to start.',
			title: 'No apps yet',
		},
		title: 'Apps',
	};

	const formatDate = (date: string) => {
		const locale = Liferay.ThemeDisplay.getLanguageId().replace('_', '-');

		const dateOptions: any = {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		};

		const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(
			new Date(date)
		);

		return formattedDate;
	}

	function getAppListProductSpecifications(productIds : number[]) {
		let appListProductSpecifications : any[] = [];

		productIds.forEach((productId) =>  {
			appListProductSpecifications.push(getProductSpecifications({appProductId: productId}));
		})

		return Promise.all(appListProductSpecifications);
	}

	function getAppListProductIds(products: any) {
		const productIds : any[] = [];

		products.items.map((product: any) => {
			productIds.push(product.productId);
		})

		return productIds;
	}

	function getProductTypeFromSpecifications(specifications: any) {
		var productType = 'no type';

		specifications.items.forEach((specification: any) => {
			if (specification.specificationKey === "type") {
				productType = specification.value.en_US;

				if (productType === "saas") productType = "SaaS"
				else if (productType === "osgi") productType = "OSGI"
			}
		})

		return productType;
	}

	function getProductVersionFromSpecifications(specifications: any) {
		var productVersion = '0';

		specifications.items.forEach((specification: any) => {
			if (specification.specificationKey === "version") {
				productVersion = specification.value.en_US;
			}
		})

		return productVersion;
	}

	useEffect(() => {
		(async () => {
			const appList = await getProducts();

			const appListProductIds : number[] = getAppListProductIds(appList);

			const appListProductSpecifications = await getAppListProductSpecifications(appListProductIds);

			const newAppList = appList.items.map((product: any, index: number) => {
				return {
					lastUpdatedBy: product.lastUpdatedBy,
					name: product.name.en_US,
					status: product.workflowStatusInfo.label.replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase()),
					thumbnail: product.thumbnail,
					type: getProductTypeFromSpecifications(appListProductSpecifications[index]),
					version: getProductVersionFromSpecifications(appListProductSpecifications[index]),
					updatedDate: formatDate(product.modifiedDate)
				}
			})

			const currentAppNavigationItem = dashboardNavigationItems.find((navigationItem) => navigationItem.itemName === 'apps') as DashboardListItems;

			const newAppNavigationItem = {
                ...currentAppNavigationItem,
                items: newAppList,
            }

			setDashboardNavigationItems([
				newAppNavigationItem,
                ...dashboardNavigationItems.filter((navigationItem) => navigationItem.itemName !== 'apps')
            ]);

			setApps(newAppList);
		})();
	}, []);

	useEffect(() => {
		(() => {
			const clickedNavigationItem: any = dashboardNavigationItems.find(
				dashboardNavigationItem => dashboardNavigationItem.itemSelected
			);

			setSelectedNavigationItem(clickedNavigationItem.itemTitle);
		})();
	}, [dashboardNavigationItems]);

	useEffect(() => {
		(async () => {
			if (selectedNavigationItem === "Members") {

				const accountsListResponse = await getAccounts();

				const membersList = accountsListResponse.items.map((account: any) => {
					return {
						name: account.name,
						email: account.emailAddress,
						role: account.roleBriefs[0].name,
						dateCreated: account.dateCreated,
						lastLoginDate: account.lastLoginDate,
						userId: account.id
					}
				})

				setMembers(membersList);
			}
		})();
	}, [selectedNavigationItem]);

	return (
		<DashboardPage
			accountAppsNumber="4"
			accountLogo={accountLogo}
			accountTitle="Acme Co"
			buttonMessage="+ New App"
			dashboardNavigationItems={dashboardNavigationItems}
			items={apps}
			messages={messages}
			setDashboardNavigationItems={setDashboardNavigationItems}
			selectedNavigationItem={selectedNavigationItem}
			members={members}
		>
			<DashboardTable<AppProps>
				emptyStateMessage={messages.emptyStateMessage}
				items={apps}
				tableHeaders={tableHeaders}
			>
				{(item) => <DashboardTableRow item={item} key={item.name} />}
			</DashboardTable>
		</DashboardPage>
	);
}
