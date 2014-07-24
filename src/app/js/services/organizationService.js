'use strict';

FHIRStarter.factory('organizationService',
    ['$http', '$q', 'cacheData', 'serverService',
        function ($http, $q, cacheData, serverService) {

            var addOrg = function (resource) {
                resource.type.coding = prepCoding(resource.type.coding);
                var url = serverService.getActiveServer().baseUrl + "/Organization/" + serverService.createNewResourceId();
                var deferred = $q.defer();

                $http.put(url, removeNullProperties(resource))
                    .success(function (status) {
                        deferred.resolve(status);
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var updateOrg = function (resourceId, resource) {
                resource.type.coding = prepCoding(resource.type.coding);
                var deferred = $q.defer();

                $http.post(resourceId, removeNullProperties(resource))
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var getOrg = function (resourceId) {
                var deferred = $q.defer();
                $http.get(resourceId)
                    .success(function (data) {
                        if (angular.isUndefined(data.type)) {
                            data.type = { "coding": []};
                        }
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var deleteOrg = function (resourceId) {
                var deferred = $q.defer();

                $http.delete(resourceId)
                    .success(function () {
                        deferred.resolve();
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var getTypeCodings = function () {
                return [
                    {"code": "prov", "display": "Healthcare Provider", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "dept", "display": "Hospital Department", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "icu", "display": "Intensive Care Unit", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "team", "display": "Organization Team", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "fed", "display": "Federal Government", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "ins", "display": "Insurance Company", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "edu", "display": "Educational Institute", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "reli", "display": "Religious Institution", "system": "http://hl7.org/fhir/organization-type"},
                    {"code": "pharm", "display": "Pharmacy", "system": "http://hl7.org/fhir/organization-type"}
                ]
            };

            var queryOrg = function (name) {
                var url = serverService.getActiveServer().baseUrl + "/Organization/_search?name=" + name;
                var deferred = $q.defer();

                $http.get(url)
                    .success(function (data) {
                        cacheData.addToCache("foundOrganizations", data.entry);
                        deferred.resolve(data);
                    })
                    .error(function (data, status) {
                        var error = { "status": status, "outcome": data };
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            var getCachedSearchItem = function (hashKey) {
                return cacheData.getItemFromCache(hashKey, 'foundOrganizations');
            };

            var initializeOrganization = function () {
                return {
                    "resourceType": "Organization",
                    "identifier": null,
                    "type": { "coding": [] },
                    "telecom": null,
                    "contact": null,
                    "address": null,
                    "partOf": null,
                    "location": null,
                    "active": true};
            };

            var removeNullProperties = function (target) {
                Object.keys(target).map(function (key) {
                    if (target[key] instanceof Object) {
                        if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
                            delete target[key];
                        } else {
                            removeNullProperties(target[key]);
                        }
                    } else if (target[key] === null) {
                        delete target[key];
                    }
                });
                return target;
            };

            var prepCoding = function (coding) {
                if (angular.isArray(coding) && angular.isDefined(coding[0])) {
                    if (angular.isObject(coding[0])) {
                        return coding;
                    } else {
                        var parsedCoding = JSON.parse(coding[0]);
                        coding[0] = ( parsedCoding ? parsedCoding : null);
                    }
                } else {
                    return null;
                }
                return coding;
            };

            return {
                add: addOrg,
                update: updateOrg,
                get: getOrg,
                delete: deleteOrg,
                query: queryOrg,
                init: initializeOrganization,
                getTypeCoding: getTypeCodings,
                getCachedSearchItem: getCachedSearchItem
            }
        }]);