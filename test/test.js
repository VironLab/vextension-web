function cookieTest() {
    // cookieTest
    let actualCookie = $.readCookie("TestCookie")
    if (!actualCookie)
        $.setCookie("TestCookie", 0, 0)
    else
        $.setCookie("TestCookie", parseInt(actualCookie) || 0 + 1, 1)

    setTimeout(() => {
        $.deleteCookie("TestCookie")
    }, 60000);
}

function cssTest() {
    //  selector Tests
    $('.text').css("background", "#ffff")
    $('.text').css("height", "20px")
    $('.text').css("width", "60px")
    var i = 1;
    function loopSlow() {
        setTimeout(function () {
            $('.text').css("background", '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            i++;
            if (i < 10) {
                loopSlow();
            } else $('.text').hide()
        }, 500)
    }
    loopSlow();

}




$(document).ready(() => {

    setTimeout(cookieTest, 1000)
    setTimeout(cssTest, 2000)


})