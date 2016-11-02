var ConfigurationInstancePage, ConfigurationPage;

ConfigurationPage = (function() {
    function ConfigurationPage() {
        Browser.waitFor('#configuration');
    }

    ConfigurationPage.prototype.refresh = function() {
        return new ConfigurationPage();
    };

    ConfigurationPage.prototype.getInstance = function(instanceName) {
        return element(By.cssContainingText(".configuration-instance",instanceName));
    };

    ConfigurationPage.prototype.getType = function(typeName) {
        return element(By.cssContainingText(".configuration-type", typeName));
    };

    ConfigurationPage.prototype.openInstance = function(instanceName) {
        this.getInstance(instanceName).element(By.css('.open-instance a')).click();
        return new ConfigurationInstancePage;
    };

    ConfigurationPage.prototype.addNewInstance = function(typeName) {
        this.getType(typeName).element(By.css('.new-instance .link')).click();
        return new ConfigurationInstancePage();
    };

    ConfigurationPage.prototype.deleteInstance = function(instanceName) {
        this.getInstance(instanceName).element(By.css('.delete-instance')).click();
        return this;
    };

    ConfigurationPage.prototype.expectTypeDisplayed = function(typeName) {
        expect(this.getType(typeName)).toBeDisplayed();
        return this;
    };

    ConfigurationPage.prototype.expectInstanceDisplayed = function(instanceName) {
        expect(this.getInstance(instanceName)).toBeDisplayed();
        return this;
    };

    ConfigurationPage.prototype.expectNoInstance = function(instanceName) {
        expect(this.getInstance(instanceName).isPresent()).toBe(false);
        return this;
    };

    ConfigurationPage.prototype.expectErrorDisplayed = function() {
        expect(element(By.css(".modal"))).toBeDisplayed();
        element(By.css(".modal .close")).click();
        return this;
    };

    return ConfigurationPage;

})();

ConfigurationInstancePage = (function() {
    function ConfigurationInstancePage() {
        Browser.waitFor('#configuration-instance');
    }

    ConfigurationInstancePage.prototype.setTextField = function(fieldName, fieldValue) {
        element(By.id(fieldName)).clear();
        element(By.id(fieldName)).sendKeys(fieldValue);
        return this;
    };

    ConfigurationInstancePage.prototype.expectFieldToBe = function(fieldName, fieldValue) {
        expect(element(By.id(fieldName)).getAttribute('value')).toBe(fieldValue);
        return this;
    };

    ConfigurationInstancePage.prototype.save = function() {
        element(By.id("submit")).click();
        return this;
    };

    ConfigurationInstancePage.prototype.expectToBeSaved = function() {
        expect(element(By.css(".last-saved"))).toBeDisplayed();
        return this;
    };

    return ConfigurationInstancePage;

})();

global.ConfigurationPage = ConfigurationPage;

global.ConfigurationInstancePage = ConfigurationInstancePage;