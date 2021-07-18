function loggerInfo() {
    var css = `font-size: 60px; line-height: 130px; color: #00ee00; text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%);`;
    console.log('%c%s', css, `vironlab.eu    `);
    console.log(`%c You found any bug? Report it here bugs@vironlab.eu or here https://github.com/VironLab/vextension-web/issues!`, 'font-size: 20px; color: #777777');
}

function cookieTest() {
    // cookieTest
    let actualCookie = $.readCookie('TestCookie');
    if (!actualCookie) $.setCookie('TestCookie', 0, 0);
    else $.setCookie('TestCookie', parseInt(actualCookie) || 0 + 1, 1);

    setTimeout(() => {
        $.deleteCookie('TestCookie');
    }, 60000);
}

function getJSONTest() {
    $('.text').css('background', '#222');
    $('.text').css('color', 'silver');
    $('.text').css('padding', '20px');
    $('.text').css('height', '600px');
    $('.text').css('width', '600px');
    $.getJSON('https://testapi.vironlab.eu/json')
        .done((json) => {
            $('.text').html(`<code><pre>${JSON.stringify(json, null, 5).split('\n').join('<br>')}</pre></code>`);
        })
        .always(() => console.log('This runs always no matter if failed or done'))
        .fail((error) => console.error);
    setTimeout(() => {
        $('#checker').prop('checked', true);
        $('#testmode').css('color', 'green');
        $('#testmode').html('TestMode DONE');
        console.log($('.text').toJSON());
        $('.text')
            .wait(5000)
            .then((textCollection) => {
                console.log('Wait 5000');
            });
    }, 5000);
}

function postDataTest() {
    $.postJSON('https://testapi.vironlab.eu/post', {
        text: 'TestPost',
    })
        .done((data) => {
            console.log(data);
        })
        .always(() => console.log('POST Complete'))
        .fail((error) => console.error);

    $.postForm('https://testapi.vironlab.eu/post', {
        text: 'TestPost',
    })
        .done((data) => {
            console.log(data);
        })
        .always(() => console.log('POST Complete'))
        .fail((error) => console.error);
}

function cssTest() {
    //  selector Tests
    $('.text').css('background', '#ffff');
    $('.text').css('height', '20px');
    $('.text').css('width', '60px');
    var i = 1;

    function loopSlow() {
        setTimeout(function () {
            $('.text').css('background', '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
            i++;
            if (i < 10) {
                loopSlow();
            }
        }, 300);
    }
    loopSlow();
    setTimeout(getJSONTest, 6000);
}

$.loadStyle('./styles.css');

$(document).ready(async () => {
    $('.text').each((element) => console.log(element));
    $.loadJS('./loadjs.js');
});

$(document).load(() => {
    cookieTest();
    cssTest();
    postDataTest();
    setTimeout(loggerInfo, 10000);

    $.storeLocal('tmp', {
        test: 'test-local',
    });
    console.log('Local Store: ' + JSON.stringify($.getLocal('tmp')));
    $.unStoreLocal('tmp');

    $.storeSession('tmp', {
        test: 'test-session',
    });
    console.log('Session Store: ' + JSON.stringify($.getSession('tmp')));
    $.unStoreSession('tmp');
});
