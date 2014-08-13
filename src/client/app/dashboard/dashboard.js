(function () {
    'use strict';

    var controllerId = 'dashboard';

    angular.module('FHIRStarter').controller(controllerId, ['common', 'conformanceService', 'fhirServers', 'organizationService', 'patientService', 'profileService', dashboard]);

    function dashboard(common, conformanceService, fhirServers, organizationService, patientService, profileService) {
        var getLogFn = common.logger.getLogFn;
        var logError = getLogFn(controllerId, "error");
        var logSuccess = getLogFn(controllerId, "success");
        var vm = this;

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.cacheInfo = null;
        vm.changeServer = changeServer;
        vm.conformance = null;
        vm.isBusy = false;
        vm.servers = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getServers(), getActiveServer()];
            common.activateController(promises, controllerId)
                .then(function () {
                    if (vm.activeServer) {
                        fetchConformance(vm.activeServer);
                    }
                });
        }

        function changeServer(id) {
            conformanceService.clearCache();
            organizationService.clearCache();
            patientService.clearCache();
            fhirServers.getServerById(id)
                .then(function (selectedServer) {
                    return vm.activeServer = selectedServer;
                }, function (error) {
                    logError('Error ' + error);
                    toggleSpinner(false);
                })
                .then(setActiveServer)
                .then(fetchConformance)
                .then(fetchProfiles);
        }

        function fetchConformance(server) {
            if (server) {
                conformanceService.getConformance(vm.activeServer.baseUrl)
                    .then(function (conformance) {
                        logSuccess('Loaded conformance statement for ' + vm.activeServer.name);
                        return vm.conformance = conformance;
                    }, function (error) {
                        logError(error);
                    });
            }
        }

        function fetchProfiles() {
            profileService.clearCache();
            profileService.getProfiles(true, vm.activeServer.baseUrl, 0, 20, '')
                .then(function (data) {
                    logSuccess('Loaded profiles for ' + vm.activeServer.name);
                }, function (error) {
                    logError(error);
                });
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getServers() {
            fhirServers.getAllServers()
                .then(function (servers) {
                    return vm.servers = servers;
                });
        }

        function setActiveServer(server) {
            fhirServers.setActiveServer(server);
            return server;
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();