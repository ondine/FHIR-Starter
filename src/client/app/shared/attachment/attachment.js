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

    var controllerId = 'attachment';

    angular.module('FHIRStarter').controller(controllerId, ['$scope', 'common', 'attachmentService', 'fileReader', attachment]);

    function attachment($scope, common, attachmentService, fileReader) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var logError = getLogFn(controllerId, 'error');

        vm.attachments = [];
        vm.readFile = readFile;
        vm.removeListItem = removeListItem;
        vm.reset = reset;
        vm.selectedFile = null;
        vm.title = getTitle;

        activate();

        function activate() {
            common.activateController([getAttachments(), getTitle()], controllerId).then(function () {
                // nothing yet
            });
        }

        function getAttachments() {
            vm.attachments = attachmentService.getAll();
        }

        function getAttachmentTypes() {
            // TODO - load supported attachment file types
        }

        function getTitle() {
            vm.title = attachmentService.getTitle();
        }

        function readFile() {
            attachmentService.add(vm.selectedFile, $scope)
                .then(function (result) {
                    vm.attachments = result;
                }, function (error) {
                    logError(error);
                });
        }

        function removeListItem(item) {
            attachmentService.remove(item);
        }

        function reset(form) {
            vm.attachment = {};
            form.$setPristine();
        }
    }
})();
