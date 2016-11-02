'use strict';

class Browser {
    static open() {
        return browser.get('#/');
    }

    static setSize(width, height) {
        return browser.manage().window().setSize(width, height);
    }

    static wait(conditionFunction, message, timeout) {
        timeout = timeout || 30000;
        return browser.wait(conditionFunction, timeout, message);
    }

    static waitFor(cssSelector, timeout) {
        return Browser.wait(() => element(By.css(cssSelector)).isPresent(),
            `waiting for '${cssSelector}' to be present`, timeout);
    }

    static executeVoidScript() {
        var script, scriptArguments, scriptFunction;
        var slice = [].slice;
        scriptFunction = arguments[0], scriptArguments = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        script = '(' + scriptFunction + ').apply(null, arguments);';
        return browser.executeScript.apply(browser, [script].concat(slice.call(scriptArguments)));
    }
}

global.Browser = Browser;
