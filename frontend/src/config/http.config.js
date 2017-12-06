export function httpConfig($httpProvider) {
	'ngInject';

	/*
	 * Register a default error handling
	 */
	$httpProvider.interceptors.push(function ($q, $state) {
		'ngInject';

		return {
			responseError: (rejection) => {
				switch (rejection.status) {
					case 401:
						$state.go('login');
						rejection.handled = true;
						break;
				}

				return $q.reject(rejection);
			},
		};
	});
}