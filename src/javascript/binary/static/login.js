function jsLogin() {
    $(document).ready(function() {
        $('span#login-fields > input[type="submit"]').click(function () {
            $.post('login?l=' + getCookieItem('language'))
        })
    });
}
