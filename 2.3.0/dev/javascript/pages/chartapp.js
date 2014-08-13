(function () {
    'use strict';

    var isMac = /Mac/i.test(navigator.platform),
        isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent),
        isAndroid = /Android/i.test(navigator.userAgent),
        isWindowsPhone = /Windows Phone/i.test(navigator.userAgent),
        isJavaInstalled = (deployJava.getJREs().length > 0) && deployJava.versionCheck("1.5+"),
        isMobile = isIOS || isAndroid || isWindowsPhone,
        canBeInstalled = isJavaInstalled && !isMobile;

    $('#install-java').toggle(!isJavaInstalled);
    $('#download-app').toggle(canBeInstalled);

    $('#install-java').on('click', function () {
        deployJava.installLatestJava();
    });

    $('#download-app').on('click', function () {
        if (isMac) {
            alert('You need to change your security preferences!');
            return;
        }

        if (isMobile) {
            alert('The charting app is not available on mobile devices!');
        }
    });
})();