export function themeConfig($mdThemingProvider) {
    'ngInject';

    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('light-blue')
        .warnPalette('red')
        .dark();
}