export class DatabaseService {
	constructor($http) {
		'ngInject';

		this.baseUrl = '//localhost/cocktail-db/api.php/';
		this.$http = $http;
	}

	getCocktails() {
		return this.$http({
			method: 'GET',
			url: this.baseUrl + 'cocktail' + '?transform=1',
		}).then(response => {
			return response.data.cocktail;
		});
	}

	getInventory() {
		return this.$http({
			method: 'GET',
			url: this.baseUrl + 'zutat' + '?transform=1',
		}).then(response => {
			return response.data.zutat;
		});
	}

	getMixableDrinks() {
		return this.$http({
			method: 'GET',
			url: this.baseUrl + 'machbare_cocktails' + '?transform=1',
		}).then(response => {
			return response.data.machbare_cocktails;
		});
	}
}