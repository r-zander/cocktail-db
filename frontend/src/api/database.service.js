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

    /**
     * Creates a new cocktail in the database and links t
     * he provided ingredients as recipe.
     *
     * @param recipe
     * @return Promise<number> id of new cocktail
     */
    createCocktailWithRecipe(recipe) {
        recipe = angular.copy(recipe);
        let promise;
        if (recipe.newIngredients.length > 0) {

            promise = this.$http({
                method: 'POST',
                url: this.baseUrl + 'zutat',
                data: recipe.newIngredients.map(ingredient => {
                    return {
                        Name: ingredient.name,
                        Einheit: ingredient.unit
                    }
                })
            });
        }
        // TODO neue zutat ids verlinken
        // Idee: das erste promise returned ein array aus ingredients -
        // entweder einfach so, oder im falle neuer Ingredients mit existierenden und aufgelösten Ingredients


        return this.$http({
            method: 'POST',
            url: this.baseUrl + 'cocktail',
            data: {
                Name: recipe.name,
            },
        }).then(response => {
            return response.data;
        }).then(newCocktailId => {
            let recipeRecords = [];
            recipe.ingredients.forEach(ingredient => {
                recipeRecords.push({
                    Cocktail_ID: newCocktailId,
                    Zutat_ID: ingredient.id,
                    Menge: ingredient.amount,
                });
            });

            return this.$http({
                method: 'POST',
                url: this.baseUrl + 'rezept',
                data: recipeRecords,
            }).then(() => {
                return newCocktailId;
            });
        });
    }

    createIngredient(ingredient) {
        return this.$http({
            method: 'POST',
            url: this.baseUrl + 'zutat',
            data: {
                Name: ingredient.name,
                Menge: ingredient.amount,
                Einheit: ingredient.unit,
            },
        }).then(response => {
            return response.data;
        });
    }
}