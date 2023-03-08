import {useEffect, useState} from 'react';

import accountLogo from '../../assets/icons/mainAppLogo.svg';
import {DashboardListItems, DashboardNavigation} from '../../components/DashboardNavigation/DashboardNavigation';
import {
	AppProps,
	DashboardTable,
} from '../../components/DashboardTable/DashboardTable';
import {Footer} from '../../components/Footer/Footer';
import {Header} from '../../components/Header/Header';
import {getProducts, getProductSpecifications, getCatalog} from '../../utils/api';
import {getCatalogId} from '../../utils/util';
import {AppDetailsPage} from '../AppDetailsPage/AppDetailsPage';
import {initialDashboardNavigationItems} from './DashboardPageUtil';

import './DashboardPage.scss';

export function DashboardPage() {
	const [selectedApp, setSelectedApp] = useState<AppProps>();
	const [apps, setApps] = useState<AppProps[]>(Array<AppProps>());
	const [loading, setLoading] = useState(false);
	const [catalogName, setCatalogName] = useState('');
	const [dashboardNavigationItems, setDashboardNavigationItems] = useState(
		initialDashboardNavigationItems
	);

	const formatDate = (date: string) => {
		let formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', day: 'numeric'}).format(new Date(date));

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
			setLoading(true);

			const appList = await getProducts();

			const appListProductIds : number[] = getAppListProductIds(appList);

			const appListProductSpecifications = await getAppListProductSpecifications(appListProductIds);

			const catalogIdResponse = await getCatalogId();

			const catalog = await getCatalog({catalogId: catalogIdResponse});

			setCatalogName(catalog.name);

			const newAppList = appList.items.map((product: any, index: number) => {
				return {
					name: product.name.en_US,
					lastUpdatedBy: product.lastUpdatedBy,
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
                ...dashboardNavigationItems.filter((navigationItem) => navigationItem.itemName !== 'apps'),
                newAppNavigationItem,
            ]);

			setLoading(false);
			setApps(newAppList);
		})();
	}, []);

	return (
		<div className="dashboard-page-container">
			<div className="dashboard-page-body-container">
				<DashboardNavigation
					accountAppsNumber="4"
					accountIcon={accountLogo}
					accountTitle={catalogName}
					dashboardNavigationItems={dashboardNavigationItems}
					onSelectAppChange={setSelectedApp}
					setDashboardNavigationItems={
						setDashboardNavigationItems
					}
				/>

				{selectedApp ? (
					<AppDetailsPage
						dashboardNavigationItems={dashboardNavigationItems}
						selectedApp={selectedApp}
						setSelectedApp={setSelectedApp}
					/>
				) : (
					<div className="dashboard-page-body">
						<div className="dashboard-page-body-header-container">
							<Header
								description="Manage and publish apps on the Marketplace"
								title="Apps"
							/>

							<a href="/create-new-app">
								<button className="dashboard-page-body-header-button">
									+ New App
								</button>
							</a>
						</div>

						<DashboardTable apps={apps} loading={loading}/>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
