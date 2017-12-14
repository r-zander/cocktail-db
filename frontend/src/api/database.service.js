export class DatabaseService {
    constructor($http, $q, $httpParamSerializerJQLike) {
        'ngInject';

		this.baseUrl = '/cocktail-db/api.php/';
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
            url: this.baseUrl + 'cocktail',
	        params: {
		        csrf: this.csrfToken,
		        transform: 1
	        }
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
                include: 'ingredient',
                transform: 1
            }
        }).then(response => {
            return response.data.cocktail.map(cocktail => {
                let recipe = {
                    id: cocktail.id,
                    name: cocktail.name,
                };
                recipe.ingredients = cocktail.recipe.map(recipe => {
                    let ingredient = recipe.ingredient[0];
                    return {
                        id: ingredient.id,
                        name: ingredient.name,
                        unit: ingredient.unit,
                        amount: recipe.amount,
                        stockAmount: ingredient.stockAmount
                    };
                });
                return recipe;
            });
        });
    }

    getInventory() {
        return this.$http({
            method: 'GET',
            url: this.baseUrl + 'ingredient',
	        params: {
		        csrf: this.csrfToken,
		        transform: 1
	        }
        }).then(response => {
            return response.data.ingredient;
        });
    }

    getMixableDrinks() {
        return this.$http({
            method: 'GET',
            url: this.baseUrl + 'mixable_drinks',
	        params: {
		        csrf: this.csrfToken,
		        transform: 1
	        }
        }).then(response => {
            return response.data.mixable_drinks;
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
                url: this.baseUrl + 'ingredient',
                data: recipe.newIngredients.map(ingredient => {
                    return {
                        name: ingredient.name,
                        unit: ingredient.unit,
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
                    name: recipe.name,
                },
            })
        }).then(response => {
            return response.data;
        }).then(newCocktailId => {
            let recipeRecords = [];
            recipe.ingredients.forEach(ingredient => {
                recipeRecords.push({
                    cocktailId: newCocktailId,
	                ingredientId: ingredient.id,
                    amount: ingredient.amount,
                });
            });

            return this.$http({
                method: 'POST',
                url: this.baseUrl + 'recipe',
                data: recipeRecords,
            }).then(() => {
                return newCocktailId;
            });
        });
    }

    createInventoryItem(item) {
        return this.$http({
            method: 'POST',
            url: this.baseUrl + 'ingredient',
            data: {
                name: item.name,
                unit: item.unit,
                stockAmount: item.stockAmount,
            }
        });
    }

    updateInventoryItem(item) {
        return this.$http({
            method: 'PUT',
            url: this.baseUrl + 'ingredient/' + item.id,
            data: {
                stockAmount: item.stockAmount,
            },
        }).then(response => {
            return response.data;
        });
    }

    deleteCocktail(cocktailId){
	    return this.$http({
		    method: 'DELETE',
		    url: this.baseUrl + 'cocktail/' + cocktailId,
	    }).then(response => {
	        // Number of rows affected
		    return response.data;
	    });
    }
}