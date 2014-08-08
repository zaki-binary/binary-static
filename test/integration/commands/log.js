exports.command = function (message, callback) {
    if (message) {
        console.log(message);
    }

    if (typeof callback === 'function') {
        callback.call(this);
    }

    return this;
};;