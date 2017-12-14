import './main.scss';
import './main.html';
import './bottomSheet.html';
import {BottomSheetController} from "./bottomSheet.controller";

/* global angular */

export class MainController {
    constructor($mdBottomSheet, $mdToast, databaseService) {
        'ngInject';

        this.$mdBottomSheet = $mdBottomSheet;
        this.$mdToast = $mdToast;
        this.databaseService = databaseService;

        this.loadLists();

        this.selectedTab = 1;

        // this.newIntentoryItem = {};
    }

    loadLists() {
        // TODO alles in der Datenbank sortieren
        this.databaseService.getRecipes().then(recipes => {
            this.recipes = this.mapRecipes(recipes);
        });
        this.databaseService.getInventory().then(inventory => {
            this.inventory = inventory;
            this.inventory.forEach(item => {
                if (item.stockAmount <= 0) {
                    item.outOfStock = true;
                }
            });
            this.ingredients = inventory;
	        this.ingredients.sort((a, b) => {
		        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	        });

            // Derive units from ingredients
            // TODO Database query?
            this.units = this.ingredients.map(ingredient => {
                return ingredient.unit;
            });
            // Transform Array to Set to distinct values
            // and convert back to Array with '...' spread operator
            this.units = [...new Set(this.units)];
			// Sort case insensitive
			this.units.sort((a, b) => {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
        });
        this.databaseService.getMixableDrinks().then(mixableDrinks => {
            this.mixableDrinks = mixableDrinks.filter(drink => {
                // TODO muss in der Datenbank passieren
                return drink.count > 0;
            });
        });
    }

    inventoryFilter(item) {
        return !item.outOfStock;
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

	/**
     *
	 * @param updateCocktail a cocktail recipe in database format that can be edited by the user
	 */
	openBottomSheet(updateCocktail) {
        return this.$mdBottomSheet.show({
            templateUrl: 'main/bottomSheet.html',
            preserveScope: true,
            controller: BottomSheetController,
            controllerAs: 'ctrl',
            locals: {
                ingredients: this.ingredients,
                units: this.units,
	            updateCocktail: updateCocktail,
            },
            bindToController: true,
            escapeToClose: false,
        });
    }

    saveInventoryItem(item) {
        item.disabled = true;
        this.databaseService.updateInventoryItem(item).then(() => {
            this.$mdToast.showSimple('Inventory item updated.');
            item.disabled = false;
            item.changed = false;
            item.outOfStock = item.stockAmount <= 0;

            // Reload mixable drinks, as they can have changed
            this.loadLists();
        });
    }

    addInventoryItem(item) {
        this.newIntentoryItem = null;

        // Update stockAmount
        item.stockAmount = item.preliminaryStockAmount;

        let promise;
        if (item.new) {
            // Create in DB
            promise = this.databaseService.createInventoryItem(item);
        } else {
            promise = this.databaseService.updateInventoryItem(item);
        }

        promise.then(() => {
            this.loadLists();
            item.outOfStock = item.stockAmount <= 0;
        });
    }

    ingredientsQuerySearch(query) {
        if (query) {
            return this.ingredients.filter((ingredient) => {
                return !this.inventoryFilter(ingredient) && ingredient.name.match(new RegExp(query, 'gi'));
            });
        }

        return this.ingredients.filter((ingredient) => {
            return !this.inventoryFilter(ingredient);
        });
    }

    newIngredient(newIngredientName) {
        this.newIntentoryItem = {
            name: newIngredientName,
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

	createCocktail() {
		this.openBottomSheet()
			.then(result => {
				return this.databaseService.createCocktailWithRecipe(result.cocktail);
			}).then(() => {
                this.loadLists();
            }).catch(() => {
            });
	}

	/**
     * Edit deletes the current cocktail and creates a new cocktail with updated values.
	 * @param $event
	 * @param recipe
	 */
    editCocktail($event, recipe){
	    $event.stopPropagation();
	    this.openBottomSheet(recipe)
            .then(result => {
                return this.databaseService.deleteCocktail(recipe.id)
                    .then(() => {
                        return result;
                    });
            })
		    .then(result => {
			    return this.databaseService.createCocktailWithRecipe(result.cocktail);
		    }).then(() => {
                this.loadLists();
            }).catch(() => {
            });
    }

    deleteCocktail($event, recipe){
	    $event.stopPropagation();
	    this.databaseService.deleteCocktail(recipe.id)
            .then(() => {
	            removeArrayElement(this.recipes, recipe);
	            return this.databaseService.getMixableDrinks().then(mixableDrinks => {
		            this.mixableDrinks = mixableDrinks.filter(drink => {
			            // TODO muss in der Datenbank passieren
			            return drink.count > 0;
		            });
	            });
            });
    }
}

function removeArrayElement(array, element) {
	let index = array.findIndex(e => e === element || e.id === element.id);
	if (index > -1) {
		array.splice(index, 1);
	}
}