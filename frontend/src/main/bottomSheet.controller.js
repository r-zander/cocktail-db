"use strict";

/* global angular */

export class BottomSheetController {
	constructor($scope, $mdBottomSheet, databaseService) {
		'ngInject';

		this.$scope = $scope;
		this.$mdBottomSheet = $mdBottomSheet;
		this.databaseService = databaseService;

		if (angular.isObject(this.updateCocktail)){
			$scope.cocktail = this.convertToScopeObject(this.updateCocktail);
			this.ensureIngredientsCapacity($scope.cocktail.ingredients.length + 1);
		} else {
			/* Cocktail Structure:
			{
				name: string,
				ingredients: [{
					item: {
						id: number,
						name: string
					},
					amount: number
				}]
			}
			 */
			$scope.cocktail = {
				ingredients: [],
			};
			this.ensureIngredientsCapacity(1);
		}
		$scope.searchText = [];
		$scope.searchUnit = [];

	}

	convertToScopeObject(updateCocktail){
		let cocktail = angular.copy(updateCocktail);
		cocktail.ingredients = cocktail.ingredients.map(ingredient => {
			return {
				item: ingredient,
				amount: ingredient.amount
			}
		});

		console.log(cocktail);

		return cocktail;
	}

	ensureIngredientsCapacity(capacity) {
		let ingredients = this.$scope.cocktail.ingredients;

		if (capacity > ingredients.length) {
			for (let i = ingredients.length; i < capacity; i++) {
				this.$scope.cocktail.ingredients.push({});
			}
		} else {
			ingredients.length = capacity - 1;
		}
	}

	querySearch(query) {
		if (query) {
			let filteredIngredients = this.ingredients.filter((ingredient) => {
				return ingredient.name.match(new RegExp(query, 'gi'));
			});
			filteredIngredients.push({
				name: query,
				new: true,
			});
			return filteredIngredients;
		}

		return this.ingredients;
	}

	newIngredient(ingredient, newIngredientName) {
		ingredient.item = {
			name: newIngredientName,
			new: true,
		};

		this.ensureIngredientsCapacity(this.$scope.cocktail.ingredients.length + 1);
	}

	querySearchUnit(query) {
		if (query) {
			return this.units.filter(unit => {
				return unit.match(new RegExp(query, 'gi'));
			})
		}
		return this.units;
	}

	isValid() {
		let cocktail = this.$scope.cocktail;
		if (!cocktail.name) {
			return false;
		}

		if (cocktail.ingredients.length < 2) {
			return false;
		}

		// At least 2 valid ingredients are required
		return cocktail.ingredients.filter((ingredient) => {
			return ingredient.item && ingredient.item.name && ingredient.amount > 0;
		}).length >= 2;
	}

	cancel() {
		this.$mdBottomSheet.cancel();
	}

	save() {
		let cocktail = this.$scope.cocktail;

		let result = {
			cocktail: {
				name: cocktail.name,
				ingredients: [],
				newIngredients: [],
			},
		};

		cocktail.ingredients.forEach(ingredient => {
			if (angular.isObject(ingredient.item) &&
				angular.isNumber(ingredient.amount)) {
				if (ingredient.item.new) {
					result.cocktail.newIngredients.push({
						name: ingredient.item.name,
						unit: ingredient.searchUnit,
						amount: ingredient.amount
					});
				} else {
					result.cocktail.ingredients.push({
						id: ingredient.item.id,
						amount: ingredient.amount,
					});
				}
			}
		});

		this.$mdBottomSheet.hide(result);
	}
}