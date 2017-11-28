import './main.scss';
import './main.html';
import './bottomSheet.html';

/* global angular */

export class MainController {
    constructor($mdBottomSheet, databaseService) {
        'ngInject';

        this.$mdBottomSheet = $mdBottomSheet;
        this.databaseService = databaseService;

        this.loadLists();

        this.selectedTab = 1;
    }

    loadLists() {
// TODO alles in der Datenbank sortieren
        this.databaseService.getCocktails().then(cocktails => {
            this.cocktails = cocktails
        });
        this.databaseService.getInventory().then(inventory => {
            this.inventory = inventory.filter(item => {
                return item.Inventarmenge > 0;
            });
            this.ingredients = inventory;
        });
        this.databaseService.getMixableDrinks().then(mixableDrinks => {
            this.mixableDrinks = mixableDrinks.filter(drink => {
                // TODO muss in der Datenbank passieren
                return drink.Anzahl > 0;
            });
        });
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
                ingredients: this.ingredients,
            },
            bindToController: true,
            escapeToClose: false,
        }).then(result => {
            return this.databaseService.createCocktailWithRecipe(result.cocktail);
        }).then(() => {
            this.loadLists();
        }).catch(() => {
        });
    }
}

class BottomSheetController {
    constructor($scope, $mdBottomSheet, databaseService) {
        'ngInject';

        this.$scope = $scope;
        this.$mdBottomSheet = $mdBottomSheet;
        this.databaseService = databaseService;

        $scope.cocktail = {
            ingredients: [],
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
                let lowercaseQuery = query.toLowerCase();
                return (ingredient.Name.indexOf(lowercaseQuery) === 0)
            });
        }

        return this.ingredients;
    }

    newIngredient(ingredient, newIngredientName) {
        this.databaseService.createIngredient({name: newIngredientName})
            .then(newIngredientId => {
                ingredient.item = {
                    ID: newIngredientId,
                    Name: newIngredientName,
                    new: true,
                };

                this.ingredients.push(ingredient.item);
            });
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
            return ingredient.item && ingredient.item.Name && ingredient.amount > 0;
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
            },
        };

        cocktail.ingredients.forEach(ingredient => {
            if (angular.isObject(ingredient.item) &&
                angular.isNumber(ingredient.amount)) {
                result.cocktail.ingredients.push({
                    id: ingredient.item.ID,
                    amount: ingredient.amount,
                });
            }
        });

        this.$mdBottomSheet.hide(result);
    }
}