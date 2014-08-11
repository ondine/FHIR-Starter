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
