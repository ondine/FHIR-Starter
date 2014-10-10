'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('FHIRStarter', function() {

    browser.get('/');

    it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch('/');
    });


    describe('patient', function() {

        beforeEach(function() {
            browser.get('patient');
        });


        it('should render Patient when user navigates to /Patient', function() {
            expect(element(by.model('name')));
        });

    });


    describe('login', function() {

        beforeEach(function() {
            browser.get('login');
        });


        it('should render Login when user navigates to /Login', function() {
            expect(element(by.model('xxx')));
        });

    });
});