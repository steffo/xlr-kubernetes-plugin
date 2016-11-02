'use strict';

const Utils = (() => {

    function addFirstTask(title, type) {
        waitAndClick('.add-task');
        element(By.model('title')).sendKeys(title);
        element(By.css("option[value='" + type + "']")).click();
        element(By.css(".add")).click();
        return this;
    }

    function addAnotherTask(title, type) {
        element(By.model('title')).sendKeys(title);
        element(By.css("option[value='" + type + "']")).click();
        element(By.css(".add")).click();
        return this;
    }

    function startReleaseAndWait(timeout) {
        waitAndClick('.start-release');
        element(By.css(".modal .primary")).click();
        Browser.waitFor('#release.completed', timeout);
        return this;
    }

    function assertOutput(taskTitle, expected) {
        element(By.cssContainingText(".task-title", taskTitle)).click();
        element(By.css('.comments span')).click();
        element(By.css('.comments-title-collapsed')).isPresent().then(function (isPresent) {
            if (isPresent) {
                return element(By.css('.comments span')).click();
            }
        });
        expect(element(By.css("#resizable-modal .comment")).getText()).toContain(expected);
        closeTask();
        return this;
    }

    function waitAndClick(selector){
        Browser.waitFor(selector, 3000);
        element(By.css(selector)).click();
    }

    function openTask(title) {
        var until = protractor.ExpectedConditions;
        var el = element(By.cssContainingText(".task-title", title));
        Browser.wait(until.presenceOf(el));
        element(By.cssContainingText(".task-title", title)).click();
    }

    function closeTask() {
        element(By.css('#resizable-modal .close')).click();
    }

    function configureTask(taskTitle, config) {
        openTask(taskTitle);
        if(config && config.json)
        {
            inlineEditor().setTextArea(JSON.stringify(config.json), 'spec');
        }
        else if(config && config.url)
        {
            inlineEditor().setField(config.url, 'url');
            inlineEditor().setField(config.username, 'username');
            inlineEditor().setField(config.password, 'password');
        }
        else if(config && config.wait)
        {
            inlineEditor().setField(config.wait.command, 'command');
            inlineEditor().setField(config.wait.pattern, 'pattern');
        }
        closeTask();
        return this;
    }

    return {
        addFirstTask: addFirstTask,
        startReleaseAndWait: startReleaseAndWait,
        assertOutput: assertOutput,
        addAnotherTask: addAnotherTask,
        configureTask: configureTask
    }

})();

global.utils = Utils;
