export class DatabaseService {
    constructor($http, $q, $httpParamSerializerJQLike) {
        'ngInject';

        this.baseUrl = '//localhost/cocktail-db/api.php/';
        this.$http = $http;
        this.$q = $q;
        this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
    }

    postForm(req) {
        let prototypeReq = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        };

        // serialize params
        req.data = this.$httpParamSerializerJQLike(req.data).replace(/%5B%5D/g, '');

        return this.$http(angular.extend(prototypeReq, req));
    }

    login(username, password) {
        return this.postForm({
            url: this.baseUrl,
            data: {username, password}
        }).then(response => {
            this.csrfToken = response.data.match(/[^"]+/)[0];
        });
    }

    getCocktails() {
        return this.$http({
            method: 'GET',
            url: this.baseUrl + 'cocktail' + '?transform=1',
        }).then(response => {
            return response.data.cocktail;
        });
    }

    getRecipes() {
        return this.$http({
            method: 'GET',
            url: this.baseUrl + 'cocktail',
            params: {
                csrf: this.csrfToken,
                include: 'zutat',
                transform: 1
            }
        }).then(response => {
            return response.data.cocktail.map(cocktail => {
                let recipe = {
                    id: cocktail.ID,
                    name: cocktail.Name,
                };
                recipe.ingredients = cocktail.rezept.map(rezept => {
                    let ingredient = rezept.zutat[0];
                    return {
                        id: ingredient.ID,
                        name: ingredient.Name,
                        unit: ingredient.Einheit,
                        amount: rezept.Menge,
                        stockAmount: ingredient.Inventarmenge
                    };
                });
                return recipe;
            });
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
                        Einheit: ingredient.unit,
                    }
                }),
            }).then(response => {
                let newIngredientIds = response.data;
                let newIngredients = recipe.newIngredients.map((ingredient, index) => {
                    return {
                        id: newIngredientIds[index],
                        amount: ingredient.amount,
                    }
                });
                recipe.ingredients = recipe.ingredients.concat(newIngredients);
                return recipe.ingredients;
            });
        } else {
            promise = this.$q.resolve(recipe.ingredients);
        }

        return promise.then(() => {
            return this.$http({
                method: 'POST',
                url: this.baseUrl + 'cocktail',
                data: {
                    Name: recipe.name,
                },
            })
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

    createInventoryItem(item) {
        return this.$http({
            method: 'POST',
            url: this.baseUrl + 'zutat',
            data: {
                Name: item.Name,
                Einheit: item.Einheit,
                Inventarmenge: item.Inventarmenge,
            }
        });
    }

    updateInventoryItem(item) {
        return this.$http({
            method: 'PUT',
            url: this.baseUrl + 'zutat/' + item.ID,
            data: {
                Inventarmenge: item.Inventarmenge,
            },
        }).then(response => {
            return response.data;
        });
    }
}