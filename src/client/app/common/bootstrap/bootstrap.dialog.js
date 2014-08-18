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

    var bootstrapModule = angular.module('common.bootstrap', ['ui.bootstrap']);

    bootstrapModule.factory('bootstrap.dialog', ['$modal', '$templateCache', modalDialog]);

    function modalDialog($modal, $templateCache) {
        var service = {
            deleteDialog: deleteDialog,
            confirmationDialog: confirmationDialog
        };

        $templateCache.put('modalDialog.tpl.html', 
            '<div>' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h3>{{title}}</h3>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '        <p>{{message}}</p>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
            '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
            '    </div>' +
            '</div>');

        return service;

        function deleteDialog(itemName) {
            var title = 'Confirm Delete';
            itemName = itemName || 'item';
            var msg = 'Delete ' + itemName + '?';

            return confirmationDialog(title, msg);
        }

        function confirmationDialog(title, msg, okText, cancelText) {

            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result; 
        }
    }

    var ModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = function () { $modalInstance.close('ok'); };
            $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
        }];
})();