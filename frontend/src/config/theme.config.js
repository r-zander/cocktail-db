export function themeConfig($mdThemingProvider, $mdToastProvider) {
    'ngInject';

    $mdThemingProvider.theme('default')
        .primaryPalette('pink')
        .accentPalette('light-blue')
        .warnPalette('red')
        .dark();

    $mdToastProvider.addPreset('dark', {
        options: () => {
            return {
                template:
                '<md-toast md-colors="{\'background-color\': \'grey-50\'}">' +
                '<div class="md-toast-content">' +
                'This is a custom preset' +
                '</div>' +
                '</md-toast>',
                hideDelay: 50000,
            };
        },
    });
}