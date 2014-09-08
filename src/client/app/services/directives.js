/**
 * Copyright 2014 Peter Bernhardt, et. al.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    'use strict';

    var app = angular.module('FHIRStarter');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);

    app.directive('ccSidebar', function () {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });

    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var elementent = element.children('i');
                if ($wcontent.is(':visible')) {
                    elementent.removeClass('fa fa-chevron-up');
                    elementent.addClass('fa fa-chevron-down');
                } else {
                    elementent.removeClass('fa fa-chevron-down');
                    elementent.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown() : element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('fsAddListItem', function ($parse) {
        // Description:
        //
        // Usage: <div data-fs-add-list-item="item" on-change="addListItem()"></div>
        var directive = {
            restrict: "EA",
            template: "<input multiple='false' type='file' />",
            replace: true,
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            var modelGet = $parse(attrs.fsAddListItem);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);

            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].files[0]);
                    onChange(scope);
                });
            };
            element.bind('change', updateModel);
        }
    });

    app.directive('fsAddToList', [function () {
        // Description: if value is true, set image to check mark
        // Usage: <i data-add-to-list="vm.isRequired"/></i>
        var directive = {
            restrict: 'A',
            replace: true,
            link: link,
            scope: {
                fsAddToList: "=?"
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('fsAddToList', function (value) {
                if (value === true) {
                    attrs.$set('class', 'glyphicon glyphicon-plus');
                    attrs.$set('tooltip', 'Add item to list');
                    // <span class="glyphicon glyphicon-plus"></span>
                }
            });
        }
    }]);

    app.directive('fsFileInput', function ($parse) {
        // Description:
        //
        // Usage: <div fs-file-input="file" on-change="readFile()"></div>
        var directive = {
            restrict: "EA",
            template: "<input multiple='false' type='file' />",
            replace: true,
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            var modelGet = $parse(attrs.fsFileInput);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);

            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].files[0]);
                    onChange(scope);
                });
            };
            element.bind('change', updateModel);
        }
    });

    app.directive('fsImgPerson', ['config', function (config) {
        //Usage:
        //<img data-fs-img-person="vm.person.photo[0]"/>
        var directive = {
            link: link,
            scope: {
                fsImgPerson: "=?"
            },
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('fsImgPerson', function (value) {
                var imgSource = config.imageSettings.unknownPersonImageSource;
                if (value) {
                    if (value.url) {
                        imgSource = value.url;
                    } else if (value.data) {
                        imgSource = 'data:' + value.contentType + ';base64,' + value.data;
                    }
                }
                attrs.$set('src', imgSource);
            });
        }
    }]);

    app.directive('fsRepeats', [function () {
        // Description: if value is true, set image to check mark
        // Usage: <i data-fs-repeats="vm.isRepeatable"/></i>
        var directive = {
            restrict: 'A',
            replace: true,
            link: link,
            scope: {
                fsRepeats: "=?"
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('fsRepeats', function (value) {
                if (value === true) {
                    attrs.$set('class', 'fa fa-repeat');
                }
            });
        }
    }]);

    app.directive('fsRequired', [function () {
        // Description: if value is true, set image to check mark
        // Usage: <i data-fs-required="vm.isRequired"/></i>
        var directive = {
            restrict: 'A',
            replace: true,
            link: link,
            scope: {
                fsRequired: "=?"
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('fsRequired', function (value) {
                if (value === true) {
                    attrs.$set('class', 'fa fa-asterisk');
                }
            });
        }
    }]);

    app.directive('fsSearchItem', function () {
        // Description:
        //  renders search results in list
        //
        // Usage:
        //   <data-fs-search-item name="" resourceId="" summary="" />
        var directive = {
            restrict: 'E',
            replace: true,
            require: true,
            templateUrl: '/app/templates/searchItem.html',
            scope: {
                name: "@name",
                resourceid: "@resourceid",
                summary: "@summary"
            }
        };
        return directive;
    });

    app.directive('fsTrueCheck', [function () {
        // Description: if value is true, set image to check mark
        // Usage: <i data-fs-true-check="vm.isRequired"/></i>
        var directive = {
            restrict: 'A',
            replace: true,
            link: link,
            scope: {
                fsTrueCheck: "=?"
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('fsTrueCheck', function (value) {
                if (value === true) {
                    attrs.$set('class', 'fa fa-check');
                }
            });
        }
    }]);

/*
    app.directive('fsQuestionnaireGroup', ['$compile', 'config', function ($compile, config) {
        // Description: Process individual group of profile questionnaire data. This may be entered recursively for sub-groups.
        // Usage: <fs-questionnaire-group group="group" offset="2" cols="10" ng-model="vm.answers" />
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            transclude: false,
            link: link,
            scope: {
                group: '=?',
                offset: '=',
                cols: '=',
                ngModel: '='
            }
        };
        return directiveDefinitionObject;

        function link(scope, element, attrs) {
            //TODO: handle complex types
            // If group valueString is a known resource or complex type, this will have multiple questions

            var typeValue = undefined;
            var questionCount = 0;
            var fhirType = undefined;
            if (scope.group.extension) {
                var groupType = _.find(scope.group.extension, {'url': 'http://www.healthintersections.com.au/fhir/Profile/metadata#type'});
                if (groupType) {
                    typeValue = groupType.valueString;
                    if (_.contains(config.fhirPrimitiveTypes, typeValue)) {
                        fhirType = config.fhirTypes.Primitive;
                    } else if (_.contains(config.fhirComplexTypes, typeValue)) {
                        fhirType = config.fhirTypes.Complex;
                    } else if (_.contains(config.fhirResources, typeValue)) {
                        fhirType = config.fhirTypes.Resource;
                    }
                }
            }

            if (scope.group.question && angular.isArray(scope.group.question)) {
                questionCount = scope.group.question.length;
            }

            var newOffset = scope.offset + 1;
            var newCol = scope.cols - 1;
            var baseTemplate = '<div class="form-group col-md-12" >' +
                '<legend>{{group.linkId | questionnaireLabel }}</legend>' +
                '<span class="help-block">{{group.text || (group.extension | questionnaireFlyover)}}</span>' +
                '<div class="controls col-md-' + scope.cols + ' col-md-offset-' + scope.offset + '" >';

            //TODO: if this is a repeating group

            //TODO: if this is a required group

            if (scope.group && angular.isArray(scope.group.group)) {
                var subGroup = baseTemplate +
                    '<data-fs-questionnaire-groups groups="group.group" data-ng-model="ngModel" offset="' + newOffset + '" cols="' + newCol + '"/>' +
                    '</div></div>';
                $compile(subGroup)(scope, function (cloned) {
                    element.replaceWith(cloned);
                });
            } else {
                var mainGroup = baseTemplate +
                    '<span data-fs-repeats="group.repeats"/><div data-ng-repeat="q in group.question">' +
                    '    <data-fs-questionnaire-question question="q" repeats="group.repeats" data-ng-model="ngModel" total-questions="' + (scope.group.question ? scope.group.question.length : 0) + '" group-type="' + fhirType + '"/>' +
                    '</div>' +
                    '<span data-fs-required="group.required"/></span>' +
                    '</span>' +
                    '</div></div>';
                $compile(mainGroup)(scope, function (cloned) {
                    element.replaceWith(cloned);
                });
            }
        }
    }]);
    */
/*
    app.directive('fsQuestionnaireGroups', ['$compile', '$parse', function ($compile, $parse) {
        // Description: Starting point for building profile questionnaire
        // Usage: <data-fs-questionnaire-groups groups="vm.questionnaire.group.group" offset="0" cols="12" ng-model="vm.answers"/>
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            transclude: false,
            link: link,
            scope: {
                groups: '=',
                offset: '=',
                cols: '=',
                ngModel: '='
            }
        };
        return directiveDefinitionObject;

        function link(scope, element, attrs) {
            var newGrouping = '<data-fs-questionnaire-group data-ng-repeat="item in groups" data-ng-model="ngModel" group="item" offset="' + scope.offset + '" cols="' + scope.cols + '"/>';
            $compile(newGrouping)(scope, function (cloned) {
                element.replaceWith(cloned);
            });
        }
    }]);
    */
/*
    app.directive('fsQuestionnaireQuestion', ['$compile', '$filter', '$parse', function ($compile, $filter, $parse) {
        // Description: Renders the HTML input element for a specific question
        // Usage:  <fs-questionnaire-question question="q" total-questions="2" group-type="2" ng-model="vm.answers" />
        var directiveDefinitionObject = {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: link,
            scope: {
                question: '=?',
                totalQuestions: '=?',
                repeats: '=?',
                groupType: '=?',
                ngModel: '='
            }
        };
        return directiveDefinitionObject;

        function link(scope, element, attrs) {
            //TODO: handling for different types of questions
            // Question type / Extension valueString
            // -------------  ----------------------
            // choice        / CodeableConcept - needs value set lookup - must also have options property for question of type choice (if not, make this a simple text input)
            // open-choice   / CodeableConcept - needs valueset and drop down must also have options property for question of type choice (if not, make this a simple text input)
            // reference     / ResourceReference - valueString will identify resource type in ext with url = http://www.healthintersections.com.au/fhir/Profile/metadata#reference
            // fhirPrimitives will be handled as strings, dates, numbers or booleans
            // need special handling for polymorphic properties (with [x] in linkId)

            // remove polymorphic indicator from linkId (note: may need to update to handle this in client processing

            var ngModelGet = $parse(attrs.ngModel)(scope);
            var question = scope.question;
            var linkId = setLinkId(question.linkId);
            setModel(ngModelGet, linkId.replace("[x]", ""), scope.repeats, null);

            function updateModel() {
                scope.$apply(function() {
                    var element = document.getElementById(linkId);
                    var val = element.value;
                    setModel(ngModelGet, linkId, scope.repeats, val);
                });
            }
            element.bind('change', updateModel);

            var template =
                '<input requiredToken@' +
                '    type="' + $filter('questionnaireInputType')(question.type) + '" ' +
                '    id="' + linkId + '" ' +
                '    class="classToken@" ' +
                '    placeholder="' + question.text + '"><span data-fs-add-to-list=' + question.repeats + '/></span>' +
                '</div>';

            template = question.type === 'boolean' ? template.replace("classToken@", "checkbox") : template.replace("classToken@", "form-control");
            template = question.required ? template.replace("requiredToken@", "required ") : template.replace("requiredToken@", "");

            // TODO: if this is a repeating item, add list and list management controls

            // TODO: if this a Code or CodeableConcept, build value set lookup

            if (scope.totalQuestions > 1) {
                template = '<label class="control-label" for="' + linkId + '">' + $filter('questionnaireLabel')(linkId) + '</label>&nbsp;&nbsp;' +
                    template;
            }
            template = '<div class="form-group-lg" >' + template;

            $compile(template)(scope, function (cloned) {
                element.append(cloned);
            });

            function setModel(obj, path, repeats, value) {
                if (typeof path === "string") {
                    path = path.split('.');
                }
                if (path.length > 1) {
                    var p = path.shift();
                    if (obj[p] === null || !angular.isObject(obj[p])) {
                        obj[p] = {};
                    }
                    setModel(obj[p], path, repeats, value);
                } else if (repeats) {
                    obj[path[0]] = [];
                } else {
                    obj[path[0]] = value;
                }
                return obj;
            }

            // removes trailing "value"
            function setLinkId(path) {
                if (typeof path === "string") {
                    path = path.split('.');
                    if (path[path.length - 1] === 'value') {
                        path.pop();
                    }
                }
                return path.join('.');
            }
        }
    }]);
*/
})();