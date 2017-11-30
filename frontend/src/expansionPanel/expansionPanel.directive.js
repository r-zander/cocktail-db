/**
 * Created by raoulzander on 08.11.2017.
 */
import './template.html';
import './style.scss';

/* global angular */

export function ExpansionPanelDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        transclude: {
            'header': 'expansionHeader',
            'body': '?expansionBody',
        },
        templateUrl: 'expansionPanel/template.html',
        controller: ExpansionPanelController,
        controllerAs: 'ctrl',
        // Isolated scope
        scope: {
            // Two way binded state of the panel: either expanded or collapsed
            expanded: '=?',

            // Set to false if you want to manage the expansion state externally
            manageExpansion: '<?',

            onExpand: '&?',
        },
        bindToController: true,
        compile: function ($element) {
            $element.addClass('md-whiteframe-1dp layout-column');
        },
    };

    return directive;
}

class ExpansionPanelController {
    constructor($element, $scope) {
        'ngInject';

        this.$element = $element;

        // Set default value of expanded
        if (angular.isUndefined(this.expanded)) {
            this.expanded = false;
        }
        if (angular.isUndefined(this.manageExpansion)) {
            this.manageExpansion = true;
        }

        $scope.$watch(() => {
            return this.expanded
        }, () => {
            this.applyElementClass();
        })
    }

    toggle() {
        if (this.manageExpansion) {
            this.expanded = !this.expanded;
        }
        if (angular.isFunction(this.onExpansion)) {
            this.onExpansion({newValue: this.expanded});
        }
        this.applyElementClass();
    }

    /**
     * Sets the classes of the directive element according the directives state.
     */
    applyElementClass() {
        if (this.expanded) {
            this.$element.addClass('expanded');
        } else {
            this.$element.removeClass('expanded');
        }
    }
}