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

const languageSelectorContainer = fragmentElement.querySelector(
	'.language-selector-container'
);

const languageSelector = fragmentElement.querySelector('.language-selector');

const languageDropdownList = fragmentElement.querySelector(
	'.language-dropdown-list-container'
);
const suggestedText = fragmentElement.querySelector('.suggested-text');

const noResultsMessage = fragmentElement.querySelector('.no-results-message');

const searchSuggestionsSeeAllResults = fragmentElement.querySelector('.search-suggestions-see-all-results');

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

languageSelectorContainer.addEventListener('click', () => {
	languageDropdownList.classList.toggle('list-open');
});

languageSelectorContainer.addEventListener('click', () => {
	languageSelector.classList.toggle('list-open');
});

const searchSuggestionsInput = fragmentElement.querySelector(".search-suggestions-input");
const searchSuggestionsResult = fragmentElement.querySelector(".search-suggestions");

searchSuggestionsInput.oninput = function() {
	searchSuggestionsResult.innerHTML = "";

	const query = searchSuggestionsInput.value;
	navSearch(query);
};

function navSearch(query) {
	const postDataUrl = window.location.origin + `/o/portal-search-rest/v1.0/suggestions?currentURL=${window.location.origin}&destinationFriendlyURL=/search&groupId=${Liferay.ThemeDisplay.getScopeGroupId()}&plid=${Liferay.ThemeDisplay.getPlid()}&scope=this-site&search=${query}`;

	postData(
		postDataUrl,
		[{
			attributes: {
				fields: ['content_en_US'],
				includeAssetSearchSummary: true,
				includeAssetURL: true,
				sxpBlueprintId: configuration.searchBlueprintId
			},
			contributorName: 'sxpBlueprint',
			displayGroupName: 'Public Nav Search Recommendations',
			size: '3'
		}]
	).then((data) => {

		const searchSuggestions = fragmentElement.querySelector(".search-suggestions");

		if (data.items[0] !== void(0)) {
			const myjson = JSON.parse(JSON.stringify(data.items[0]));
			if (myjson) {
				for (const suggestion of myjson.suggestions) {
					const newSuggestion = document.createElement("div");
					newSuggestion.classList.add("search-suggestion-item");
					newSuggestion.href = suggestion.attributes.assetURL;

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

					searchSuggestionsSeeAllResults.classList.remove('d-none');
					suggestedText.classList.remove('d-none');
					noResultsMessage.classList.add('d-none');
				}

				// search highlighting

				const searchSuggestionItemContents = document.querySelectorAll('.search-suggestion-item-content');

				const highlightedTerm = "<b>" + query + "</b>";

				if (searchSuggestionItemContents) {
					for (const searchSuggestionItemContent of searchSuggestionItemContents) {
						searchSuggestionItemContent.innerHTML = searchSuggestionItemContent.innerHTML.replaceAll(query, highlightedTerm);
					}
				}
			}
		} else {
			searchSuggestionsSeeAllResults.classList.add('d-none');
			suggestedText.classList.add('d-none');
			noResultsMessage.classList.remove('d-none');
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
