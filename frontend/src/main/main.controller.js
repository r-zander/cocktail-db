import './main.scss';

export class MainController {
	constructor(databaseService) {
		'ngInject';

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
			;
		});
	}
}