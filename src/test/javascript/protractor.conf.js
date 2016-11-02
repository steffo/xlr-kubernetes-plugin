'use strict';
var os = require('os');

var DEFAULT_TIMEOUT = 120000;

exports.config = {
    capabilities: {
        "browserName": (process.env.SELENIUM_TEST_BROWSER || "chrome").toLowerCase(),
        "platform": (process.env.SELENIUM_TEST_PLATFORM || "linux").toLowerCase(),
        "requireWindowFocus": true
    },
    baseUrl: "http://" + os.hostname() + ":" + (process.env.XL_RELEASE_PORT || "5516"),
    allScriptsTimeout: DEFAULT_TIMEOUT,
    rootElement: "body",
    getPageTimeout: DEFAULT_TIMEOUT,
    specs: [
        './e2e/scenario/*.js'
    ],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: DEFAULT_TIMEOUT
    },
    framework: 'jasmine2',
    seleniumAddress: (process.env.SELENIUM_TEST_ADDR || null),
    onPrepare: function () {
        global.requestPromise = require('request-promise');
        global._ = require('lodash');

        let SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

        require('./e2e/dsl/fixtures-ci-builder.js');

        let dslFiles = require("glob").sync("./e2e/dsl/**/*.js", {cwd: __dirname});
        _.each(dslFiles, require);

        Browser.open();
        Browser.setSize(1024, 768);
        browser.manage().timeouts().setScriptTimeout(60 * 1000);
    }
};
