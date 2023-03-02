import {useEffect, useState} from 'react';

import accountLogo from '../../assets/icons/mainAppLogo.svg';
import {DashboardNavigation} from '../../components/DashboardNavigation/DashboardNavigation';
import {
	AppProps,
	DashboardTable,
} from '../../components/DashboardTable/DashboardTable';
import {Footer} from '../../components/Footer/Footer';
import {Header} from '../../components/Header/Header';
import {getProducts, getProductSpecifications} from '../../utils/api';
import {AppDetailsPage} from '../AppDetailsPage/AppDetailsPage';
import {initialDashboardNavigationItems} from './DashboardPageUtil';

import './DashboardPage.scss';

export function DashboardPage() {
	const [selectedApp, setSelectedApp] = useState<AppProps>();
	const [apps, setApps] = useState<AppProps[]>(Array<AppProps>());
	const [dashboardNavigationItems, setDashboardNavigationItems] = useState(
		initialDashboardNavigationItems
	);

	const formatDate = (date: string) => {
		var dateObject = new Date(date);

		var monthNames = [
			"Jan", "Feb", "Mar",
			"Apr", "May", "Jun", "Jul",
			"Aug", "Sep", "Oct",
			"Nov", "Dec"
		];

		var day = dateObject.getDate();
		var monthIndex = dateObject.getMonth();
		var year = dateObject.getFullYear();

  		return monthNames[monthIndex] + ', ' + day + ' ' + year;
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
			}
		})

		return productType;
	}

	useEffect(() => {
		const setNewAppList = async () => {
			const appList = await getProducts();

			const appListProductIds : number[] = getAppListProductIds(appList);

			const appListProductSpecifications = await getAppListProductSpecifications(appListProductIds);

			const newAppList = appList.items.map((product: any, index: number) => {
				return {
					thumbnail: product.thumbnail,
					name: product.name.en_US,
					updatedDate: formatDate(product.modifiedDate),
					updatedBy: product.catalogId,
					version: product.version,
					status: product.workflowStatusInfo.label,
					type: getProductTypeFromSpecifications(appListProductSpecifications[index])
				}
			})
			setApps(newAppList);
		}
		setNewAppList();
	}, [])

	return (
		<div className="dashboard-page-container">
			<div>
				<div className="dashboard-page-body-container">
					<DashboardNavigation
						accountAppsNumber="4"
						accountIcon={accountLogo}
						accountTitle="Acme Co"
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
						<div>
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

							<DashboardTable apps={apps} />
						</div>
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
}
