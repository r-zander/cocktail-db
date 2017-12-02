import './login.html';

/* global angular */

export class LoginController {
    constructor($state, databaseService) {
        'ngInject';

        this.$state = $state;
        this.databaseService = databaseService;
    }

    login() {
        this.databaseService.login(this.username, this.password)
            .then(() => {
                this.$state.go('main');
            });
    }

}