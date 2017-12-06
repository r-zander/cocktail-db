export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
        .state('main', {
			url: '/',
            controller: 'MainController as ctrl',
            templateUrl: 'main/main.html',
        })
        .state('login', {
            url: '/login',
            controller: 'LoginController as ctrl',
            templateUrl: 'login/login.html',
        })

        .state('error', {
            url: '/error/{statusCode}',
            templateUrl: 'error/404.html',
        });

    $urlRouterProvider.otherwise('/error/404');
	$urlRouterProvider.when('', '/');
}
