(function() {
"use strict";

var app = angular.module("angular-smarty", ["angular-smarty-config"]);


app.directive("smartyInput", function() {
    function link(scope, element) {
        element.bind("keydown", function(event) {
            switch(event.which) {
                case 40: // down arrow
                    scope.$apply(function() {
                        scope.select({"x": parseInt(scope.index) + 1});
                    });
                    break;
                case 38: // up arrow
                    scope.$apply(function() {
                        scope.select({"x": parseInt(scope.index) - 1});
                    });
                    break;
                case 13: // enter
                    event.preventDefault();
                    if (scope.selectionMade == false) {
                        if (scope.index == "-1") {
                            scope.$apply(function() {
                                scope.listItems = [];
                            });
                        }
                        scope.$apply(function() {
                            scope.close();
                        })
                    }
                    break;
                default:
                    scope.$apply(function() {
                        scope.selectionMade = false;
                        scope.index = -1;
                    });
            }
        });
        element.bind("blur", function(event) {
            if (scope.listItems.length) {
                event.preventDefault();
                scope.$apply(function() {
                    scope.close();
                })
            }
        });
    }
    return {
        restrict: "A",
        link: link,
        scope: {
            prefix: "=ngModel",
            select: "&",
            index: "=",
            selectionMade: "=",
            listItems: "=",
            close: "&"
        }
    };
})

app.directive("smartySuggestions", ["$document", function($document) {
    // Watches the scope variable prefix, which is bound to an input field.
    // Updates suggestions when there is a change in prefix, but only when
    // selectionMade equals false.
    function link(scope, element, attrs) {
        element.bind("click", function(e) {
            e.stopPropagation();
        });
    }
    return {
        restrict: "A",
        link: link,
        scope: {
            suggestions: "=",
            selected: "=",
            applyClass: "&",
            selectSuggestion: "&",
            prefix: "@"
        },
        template: '<p ng-repeat="suggestion in suggestions" ' +
            'ng-class="{selected: $index == selected}" ' +
            'ng-mouseover="applyClass({x:$index})" ' +
            'ng-click="selectSuggestion()"> '+
                '{{suggestion}} ' +
            '</p>'
    };
}]);

app.directive("focusMe", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            attrs.$observe("focusWhen", function() {
                if (attrs.focusWhen == "true") {
                    element[0].focus();
                }
            });
        }
    };
});

app.directive("smartySuggestionsBox", function() {
// Removes the need for duplicating the scode that makes the suggestions list.
    return {
        restrict: "A",
        template: '<div smarty-suggestions apply-class="setSelected(x)"' +
            'select-suggestion="suggestionPicked()" suggestions="suggestions"' +
            'selected="selected" clicked-elsewhere="clickedSomewhereElse()"' +
            'ng-if="suggestions.length > 0" prefix="[[prefix]]"' +
            'class="autocomplete-suggestions-menu ng-cloak"></div>'
    };
});
})();
