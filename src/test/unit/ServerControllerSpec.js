'use strict';

describe('ServerController', function () {
    var scope, $controllerConstructor, mockServerData;

    beforeEach(module("FHIRStarter"));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        mockServerData = sinon.stub({changeServer: function() {}});
        $controllerConstructor = $controller;
    }));

    it('should change the targeted FHIR Server when changeServer is called', function() {
        var mockServers = {};
        mockServerData.getAllServers.returns(mockServers);

        var ctrl = $controllerConstructor("ServerController",
            {$scope: scope, $routeParams:{}, $log:{}, $cookieStore:{}, fhirClient:{}, serverData: mockServerData, cacheData:{}});

        var serverId = 1;

        scope.changeServer(serverId);

        expect(mockUpdatedServer).toBe(mockServerData);
    })
})