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

function getJSONTest() {
    $('.text').css("background", "#222")
    $('.text').css("color", "silver")
    $('.text').css("padding", "20px")
    $('.text').css("height", "200px")
    $('.text').css("width", "400px")
    $.getJSON("https://jsonplaceholder.typicode.com/todos/1")
        .done(json => {
            $('.text').html(`<code><pre>${JSON.stringify(json, null, 5).split("\n").join("<br>")}</pre></code>`)
            $('.text').show()
        })
        .always(() => console.log("This runs always no matter if failed or done"))
        .fail(error => console.error)
    setTimeout(() => {
        $('.text').hide()
        $('#checker').prop("checked", true)
        $('#testmode').css("color", "green")
        $('#testmode').html("TestMode DONE")
    }, 5000);
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
    setTimeout(getJSONTest, 6000)
}


$(document).ready(async () => {
    $.loadStyle("./styles.css")
    await cookieTest()
    await cssTest()
    $.loadJS("./loadjs.js")
    $('.text').each(element => console.log(element))
})