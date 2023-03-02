import {useEffect, useState} from 'react';

import accountLogo from '../../assets/icons/mainAppLogo.svg';
import {DashboardNavigation} from '../../components/DashboardNavigation/DashboardNavigation';
import {
	AppProps,
	DashboardTable,
} from '../../components/DashboardTable/DashboardTable';
import {Footer} from '../../components/Footer/Footer';
import {Header} from '../../components/Header/Header';
import {getProducts} from '../../utils/api';
import {getProductSpecifications} from '../../utils/api';
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

	const getProductTypeList = async () => {
		const products = await getProducts();

		const productTypeList : string[] = [];

		products.items.map((product: any) => {
			const productId : number = product.productId;

			getProductSpecifications({appProductId : productId}).then(productSpecifications =>
				productTypeList.push(productSpecifications.items[0].value.en_US)
			);
		})

		return productTypeList;
	}

	useEffect(() => {
		(async () => {
			let [products, productTypeList] = await Promise.all([getProducts(), getProductTypeList()]);

			const liferayApps = products.items.map((product: any, index: number) => ({
				thumbnail: product.thumbnail,
				name: product.name.en_US,
				updatedDate: formatDate(product.modifiedDate),
				updatedBy: product.catalogId,
				version: product.version,
				status: product.productStatus,
				type: productTypeList[index]
			}))
			setApps(liferayApps);
		})();
	}, []);

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
