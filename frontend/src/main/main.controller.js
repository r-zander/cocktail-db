import './main.scss';
import './main.html';
import './bottomSheet.html';

/* global angular */

export class MainController {
    constructor($mdBottomSheet, $mdToast, databaseService) {
        'ngInject';

        this.$mdBottomSheet = $mdBottomSheet;
        this.$mdToast = $mdToast;
        this.databaseService = databaseService;

        this.loadLists();

        this.selectedTab = 1;

        this.newIntentoryItem = {};
    }

    loadLists() {
        // TODO alles in der Datenbank sortieren
        this.databaseService.getRecipes().then(recipes => {
            this.recipes = this.mapRecipes(recipes);
        });
        this.databaseService.getInventory().then(inventory => {
            this.inventory = inventory;
            this.ingredients = inventory;
            this.units = this.ingredients.map(ingredient => {
                return ingredient.Einheit;
            });
        });
        this.databaseService.getMixableDrinks().then(mixableDrinks => {
            this.mixableDrinks = mixableDrinks.filter(drink => {
                // TODO muss in der Datenbank passieren
                return drink.Anzahl > 0;
            });
        });
    }

    inventoryFilter(item) {
        return item.Inventarmenge > 0;
    }

    mapRecipes(recipes) {
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.stockAmount === 0) {
                    ingredient.missing = true;
                } else if (ingredient.amount > ingredient.stockAmount) {
                    ingredient.insufficient = true;
                }
            })
        });

        return recipes;
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

    saveInventoryItem(item) {
        item.disabled = true;
        this.databaseService.updateInventoryItem(item).then(() => {
            this.$mdToast.showSimple('Inventory item updated.');
            item.disabled = false;
            item.changed = false;

            // Reload mixable drinks, as they can have changed
            return this.databaseService.getMixableDrinks();
        }).then(mixableDrinks => {
            this.mixableDrinks = mixableDrinks.filter(drink => {
                // TODO muss in der Datenbank passieren
                return drink.Anzahl > 0;
            });

            return this.databaseService.getRecipes()
        }).then(recipes => {
            this.recipes = this.mapRecipes(recipes);
        });
    }

    addInventoryItem(item){
        // TODO
        this.newIntentoryItem = {};
        if (item.new){
            // Create in DB
        } else {
            // Update Inventarmenge
        }
    }

    ingredientsQuerySearch(query) {
        if (query) {
            return this.ingredients.filter((ingredient) => {
                return !this.inventoryFilter(ingredient) &&  ingredient.Name.match(new RegExp(query, 'gi'));
            });
        }

        return this.ingredients.filter((ingredient) => {
            return !this.inventoryFilter(ingredient);
        });
    }

    newIngredient(ingredient, newIngredientName) {
        ingredient.item = {
            Name: newIngredientName,
            new: true,
        };
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
        $scope.searchText = [];
        $scope.searchUnit = [];

        this.ensureIngredientsCapacity(1);

        this.units = this.ingredients.map(ingredient => {
            return ingredient.Einheit;
        });
        this.units.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        // Transform Array to Set to distinct values
        // and convert back to Array with '...' spread operator
        this.units = [...new Set(this.units)];

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
                return ingredient.Name.match(new RegExp(query, 'gi'));
            });
        }

        return this.ingredients;
    }

    newIngredient(ingredient, newIngredientName) {
        ingredient.item = {
            Name: newIngredientName,
            new: true,
        };
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
                newIngredients: [],
            },
        };

        cocktail.ingredients.forEach(ingredient => {
            if (angular.isObject(ingredient.item) &&
                angular.isNumber(ingredient.amount)) {
                if (ingredient.item.new) {
                    result.cocktail.newIngredients.push({
                        name: ingredient.item.Name,
                        unit: ingredient.searchUnit,
                        amount: ingredient.amount
                    });
                } else {
                    result.cocktail.ingredients.push({
                        id: ingredient.item.ID,
                        amount: ingredient.amount,
                    });
                }
            }
        });

        this.$mdBottomSheet.hide(result);
    }
}