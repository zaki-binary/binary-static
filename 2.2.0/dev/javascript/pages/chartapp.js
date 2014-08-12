(function () {
    'use strict';

    var javaInstalled = (deployJava.getJREs().length > 0) && deployJava.versionCheck("1.7");

    $('#install-java').toggle(!javaInstalled);
    $('#download-app').toggle(javaInstalled);

    $('#install-java').on('click', function () {
        deployJava.installLatestJava();
    });
})();