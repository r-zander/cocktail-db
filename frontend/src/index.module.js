import './vendor';
import './index.scss';
import './angular-material.scss';

import {themeConfig} from './config/theme.config';
import {routerConfig} from './ui-routing';
import {MainController} from "./main/main.controller";
import {DatabaseService} from "./api/database.service";
import {ExpansionPanelDirective} from './expansionPanel/expansionPanel.directive';
import {LoginController} from "./login/login.controller";

let app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngMaterial',
    'ui.router',
    'pascalprecht.translate',
])
    .config(themeConfig)
    .config(routerConfig)

    .directive('expansionPanel', ExpansionPanelDirective)

    .service('databaseService', DatabaseService)

    .controller('LoginController', LoginController)
    .controller('MainController', MainController);