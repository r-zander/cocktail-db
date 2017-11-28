import './main.scss';
import './main.html';
import './bottomSheet.html';

export class MainController {
	constructor($mdBottomSheet, databaseService) {
		'ngInject';

		this.$mdBottomSheet = $mdBottomSheet;

		// TODO alles in der Datenbank sortieren
		databaseService.getCocktails().then(cocktails => {
			this.cocktails = cocktails
		});
		databaseService.getInventory().then(inventory => {
			this.inventory = inventory.filter(item => {
				return item.Inventarmenge > 0;
			});
			this.ingredients = inventory;
		});
		databaseService.getMixableDrinks().then(mixableDrinks => {
			this.mixableDrinks = mixableDrinks.filter(drink => {
				// TODO muss in der Datenbank passieren
				return drink.Anzahl > 0;
			});
		});

		this.selectedTab = 1;
	}

	openBottomSheet() {
		this.$mdBottomSheet.show({
			templateUrl: 'main/bottomSheet.html',
			preserveScope: true,
			controller: BottomSheetController,
			controllerAs: 'ctrl',
			locals: {
				selectedTab: () => {
					return this.selectedTab;
				},
				ingredients: this.ingredients
			},
			bindToController: true,
		});
	}
}

class BottomSheetController {
	constructor($scope) {
		'ngInject';

		this.$scope = $scope;

		$scope.cocktail = {
			ingredients: []
		};

		this.ensureIngredientsCapacity(1);
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
			return this.ingredients.filter((ingredient) => {
				let lowercaseQuery = angular.lowercase(query);
				return (ingredient.Name.indexOf(lowercaseQuery) === 0)
			});
		}

		return this.ingredients;
	}
}