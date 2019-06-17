// An example configuration file.
exports.config = {
	seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
	chromeDriver: "node_modules/protractor/selenium/chromedriver_2.24",
    onPrepare: function () {

    },
    directConnect: true,
    framework: 'jasmine2',
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',

        'chromeOptions': {
            // Get rid of --ignore-certificate yellow warning
          args: ['--no-sandbox', '--test-type=browser', '--start-maximized'],
            // Set download path and avoid prompting for download even though
            // this is already the default on Chrome but for completeness

            prefs: {
                'download': {
                    'prompt_for_download': false,
                    'default_directory': 'c:/temp/',
                },
            },
        },
        // restart browser between each Spec file
        //'shardTestFiles': true,
        //'maxInstances': 1
    },

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    //specs: ['test_spec.js'],
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    allScriptsTimeout: 30000
};
