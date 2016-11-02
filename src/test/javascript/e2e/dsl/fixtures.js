'use strict';

const Fixtures = (() => {
    let releaseIds = [];

    let configurationItemsIds = [];

    function sendRequest(type, url, data) {
        return Flow.execute(function (fulfill, reject) {
            return Server.doRequest(type, url, data).then(fulfill, function (error) {
                return reject(error);
            });
        });
    }

    function release(release) {
        releaseIds.push(release.id);
        return sendRequest('POST', 'fixtures', getReleaseEntities(release));
    }

    function deleteRelease(releaseId) {
        return sendRequest('DELETE', "fixtures/" + releaseId);
    }

    function ci(ci)  {
        configurationItemsIds.push(ci.id);
        return sendRequest('POST', 'configurations', [ci]);
    }

    function deleteCi(id) {
        return sendRequest('DELETE', 'configurations/' + id);
    }

    function clean() {
        releaseIds.reverse().forEach((id) => deleteRelease(id));
        configurationItemsIds.reverse().forEach((id) => deleteCi(id));
        releaseIds = [];
        configurationItemsIds = [];
    }

    function cleanConfiguration(configId) {
        deleteCi(configId);
    }

    return {
        sendRequest: sendRequest,
        release: release,
        clean: clean,
        ci: ci,
        cleanConfiguration: cleanConfiguration
    }
})();

global.fixtures = () => Fixtures;
