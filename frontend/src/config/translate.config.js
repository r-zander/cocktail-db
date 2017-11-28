/**
 * Created by raoulzander on 19.06.17.
 */

export function translateConfig($translateProvider) {
    'ngInject';

    $translateProvider
        .useStaticFilesLoader({
            prefix: 'i18n/translation-',
            suffix: '.json',
        })
        .useSanitizeValueStrategy('escape')
        .determinePreferredLanguage(() => {
            // Only use the language part of the browser locale
            let locale = $translateProvider.resolveClientLocale();
            if (!locale) {
                return 'en';
            }
            let determinedLanguage = locale.split('_')[0].toLowerCase();
            switch (determinedLanguage) {
                case 'en':
                case 'de':
                    return determinedLanguage;
                default:
                    return 'en';
            }
        });
}