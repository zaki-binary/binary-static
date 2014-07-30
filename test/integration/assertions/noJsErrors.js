exports.assertion = function () {

    this.message = 'Page loaded with no errors.';

    this.expected = [];

    this.pass = function (result) {

        return !result.value && result.length === 0;
    };

    this.failure = function (result) {
        
        var failed = result.value && result.value.length > 0;
        if (failed) {
            this.message = result.value;
        }

        return failed;
    };

    this.value = function (result) {
        return result ? result.value : [];
    };

    this.command = function (callback) {

        this.api.getJsErrors(callback);
        return this;
    };

};