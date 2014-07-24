module.exports = function (config) {
    config.set({

        basePath: '../',

        files: [
            'app/lib/angular/angular.js',
            'app/lib/angular/angular-*.js',
            'app/lib/loading-bar.min.js',
            'app/lib/ui-bootstrap-tpls-0.11.0.min.js',
            'test/lib/angular-mocks.js',
            'test/lib/sinon-1.10.2.js',
            'app/js/**/*.js',
            'test/unit/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};