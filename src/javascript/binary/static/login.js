function jsLogin() {
    $(document).ready(function() {
        $('span#login-fields > input[type="submit"]').submit(function () {
            RealityCheck.init();
        })
    });
}

jsLogin();
