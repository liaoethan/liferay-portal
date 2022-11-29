/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

/* eslint-disable no-undef */

const menuButtonGroup = fragmentElement.querySelector('.menu-button-group');

const tabletMobileNavSection = fragmentElement.querySelector(
	'.tablet-mobile-nav-section'
);

const menuBtn = fragmentElement.querySelector('.menu-btn');

const closeBtn = fragmentElement.querySelector('.close-btn');

const accountMenus = fragmentElement.querySelectorAll('.account');

const searchIcon = fragmentElement.querySelector('.search-icon');

const searchWrapper = fragmentElement.querySelector('.search-wrapper');

const closeSearch = fragmentElement.querySelector('.close-search');

const sites = fragmentElement.querySelector('.sites');

menuBtn.addEventListener('click', () => {
	menuButtonGroup.classList.toggle('menu-open');
	tabletMobileNavSection.classList.toggle('menu-open');
});

closeBtn.addEventListener('click', () => {
	menuButtonGroup.classList.toggle('menu-open');
	tabletMobileNavSection.classList.toggle('menu-open');
});

accountMenus.forEach((accountMenu) => {
	accountMenu.addEventListener('click', () => {
		accountMenu.classList.toggle('menu-open');
	});
});

searchIcon.addEventListener('click', () => {
	searchWrapper.classList.toggle('search-open');
});

closeSearch.addEventListener('click', () => {
	searchWrapper.classList.toggle('search-open');
});

sites.addEventListener('click', () => {
	sites.classList.toggle('show');
});

const searchSuggestionsInput = fragmentElement.querySelector(".search-suggestions-input");
const searchSuggestionsResult = fragmentElement.querySelector(".search-suggestions");

searchSuggestionsInput.onkeydown = function() {
	searchSuggestionsResult.innerHTML = "";

	const query = searchSuggestionsInput.value;
	navSearch(query);
};

function navSearch(query) {
	postData(
		`http://localhost:8888/o/portal-search-rest/v1.0/suggestions?currentURL=http://localhost:8888/web/learn&destinationFriendlyURL=/search&groupId=43091&plid=28&scope=this-site&search=${query}`,
		[{
			attributes: {
				fields: ['content_en_US'],
				includeAssetSearchSummary: true,
				includeAssetURL: true,
				sxpBlueprintId: 43650
			},
			contributorName: 'sxpBlueprint',
			displayGroupName: 'test',
			size: '3'
		}]
	).then((data) => {

		const searchSuggestions = document.querySelector(".search-suggestions");
		const myjson = JSON.parse(JSON.stringify(data.items[0]));

		for (const suggestion of myjson.suggestions) {
			const newSuggestion = document.createElement("div");
			newSuggestion.classList.add("search-suggestion-item");

			const suggestionTitle = document.createElement("div");
			const suggestionTitleText = document.createTextNode(suggestion.text);
			suggestionTitle.classList.add("search-suggestion-item-title");
			suggestionTitle.appendChild(suggestionTitleText);

			const suggestionContent = document.createElement("div");
			let suggestionContentTextValue = suggestion.attributes.fields.content_en_US;

			if (!suggestionContentTextValue) {
				suggestionContentTextValue = "No content preview";
			}

			const suggestionContentText = document.createTextNode(suggestionContentTextValue);
			suggestionContent.classList.add("search-suggestion-item-content");
			suggestionContent.appendChild(suggestionContentText);

			newSuggestion.appendChild(suggestionTitle);
			newSuggestion.appendChild(suggestionContent);

			searchSuggestions.appendChild(newSuggestion);
		}
	});
}

async function postData(url = '', data = {}) {
	const response = await Liferay.Util.fetch(url, {
		body: JSON.stringify(data),
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Accept-Language': Liferay.ThemeDisplay.getBCP47LanguageId(),
			'Content-Type': 'application/json',
			'x-csrf-token': Liferay.authToken
		},
		method: 'POST'
	});

	return response.json();
}