'use strict';

describe('MainController', function () {
    var scope, $controllerConstructor, mockServerData;

    beforeEach(module("FHIRStarter"));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        mockServerData = sinon.stub({getAllServers: function() {}});
        $controllerConstructor = $controller;
    }));

    it('should set the scope servers to the result of serverData.getAllServers', function() {
        var mockServers = {};
        mockServerData.getAllServers.returns(mockServers);

        var ctrl = $controllerConstructor("MainController",
            {$scope: scope, $log:{}, $cookieStore:{}, fhirClient:{}, serverData: mockServerData, cacheData:{}});

        expect(scope.servers).toBe(mockServers);
    })
})