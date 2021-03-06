# vextension-web

[![License](https://img.shields.io/github/license/VironLab/vextension-web)](LICENSE.txt)
[![Discord](https://img.shields.io/discord/785956343407181824.svg)](https://discord.gg/wvcX92VyEH)

---

`npm install vextension-web`

Vextension-Web is a fast javascript framework to manage browser actions

---

#### Would you like some features such as the jQuery selector? But don't you want to import such a large library?

### Vextension-Web enables you to do this.

---

## Including Vextension-Web

### Browser

#### Import via jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/vextension-web@0.0.17/dist/vextension-web.min.js"></script>
```

### Import as Module

```js
import $ from 'vextension-web';
```

---

## Functionality

```html
<div class="showcase">
    <div class="text"></div>
</div>
```

```js
// wait until everything is loaded and launch function
$(document).load(() => {
    // DO Somethinf
});

// launch function when document is loaded
$(document).ready(() => {
    // Set / Remove / Delete Cookies ( TODO: Custom Path )
    function cookieTest() {
        let actualCookie = $.readCookie('TestCookie');

        if (!actualCookie) $.setCookie('TestCookie', 0, 0);
        else $.setCookie('TestCookie', parseInt(actualCookie) || 0 + 1, 1);

        $.deleteCookie('TestCookie');
    }

    cookieTest();

    // ===============================================================================

    // hide and show elements
    $('.text').show(/*optional*/ timeout, /*optional*/ 'block'); // sets css property display: block;
    $('.text').hide(/*optional*/ timeout); // sets css property display: none;

    // manage styling
    $('.text').css('background', '#222');
    $('.text').css('height', '20px');
    $('.text').css('width', '60px');
    // or
    $('.text').css({
        width: '60px',
        heigght: '60px',
    });

    // bind functions to events
    $('.text').on('click', () => {
        // set random background color on click
        $('.text').css('background', '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
    });

    // loop through each element in element array with selector .text
    $('.text').each(function (element) {
        console.log(element);
    });

    // ===============================================================================

    // get 'index' element of element array
    $('.text').get(0);
    $('.text').array(); // returns an array with Elements [ekement, element]

    // wait function
    $('.text')
        .wait(2000)
        .then((textElementCollection) => {
            console.log('Waited for 2000ms');
        });

    $('.text').find('a'); // returns an ElementCollection with all a elemts inside of all .text classified elements
    $('.text').find('div'); // returns all divs ElementCollection insite .text

    // adding and removing classes from an alement
    $('.text').addClass('testclass');
    $('.text').removeClass('testclass');
    // add class when not existing and remove when existing
    $('.text').toggleClass('testclass');

    // add or remove properties from an element
    $('.checkbox').prop('checked', true);
    $('.checkbox').prop('checked', false);

    // set element attributes
    $('.tooltipToggle-1').attr('data-tooltip', 'This is a cool tooltiped element');

    // change innetHTML of an element
    $('.text').html(`<code><pre>Usage example is shown at $.getJSON method</pre></code>`);
    // append current innerHTML with new HTML
    $('.text').append(`<code><pre>Usage example is shown at $.getJSON method</pre></code>`);

    // set a value of an element (maybe to copy text to clipboard)
    $('.text').value(`https://vironlab.eu/`);

    // empty operation ( just returns selection )
    $('.text').doNothing();

    // ===============================================================================

    // fetch and set JSON to an element
    $.getJSON('https://testapi.vironlab.eu/json')
        .done((json) => {
            $('.text').html(`<code><pre>${JSON.stringify(json, null, 2).split('\n').join('<br>')}</pre></code>`);
            $('.text').show();
        })
        .always(() => console.log('This runs always no matter if failed or done'))
        .fail((error) => console.error);

    // post json data and get response back as JSON
    $.postJSON('https://testapi.vironlab.eu/post', {
        // $.postData $.postJsonData
        text: 'TestPost',
    })
        .done((response) => {
            console.log(response);
        })
        .always(() => console.log('POST Complete'))
        .fail((error) => console.error);

    // post FormData example
    $.postForm('https://testapi.vironlab.eu/post', {
        text: 'TestPost',
    })
        .done((response) => {
            console.log(response);
        })
        .always(() => console.log('POST Complete'))
        .fail((error) => console.error);

    // post FormData with FormData Object
    const formData = new FormData();
    formData.append('key', 'value');
    $.postForm('https://testapi.vironlab.eu/post', formData)
        .done((response) => {
            console.log(response);
        })
        .always(() => console.log('POST Complete'))
        .fail((error) => console.error);

    // ===============================================================================

    // dynamic load JS / CSS
    $.loadScript('https://example.com/main.js', document.head /*default location*/, () => {
        // callback whendone
    });

    $.loadJS('https://example.com/main.js', document.head).then(() => {
        // todo
    });

    $.loadCSS('https://example.com/styles.css');
    // or async
    $.loadStyle('https://example.com/styles.css').then(() => {
        // todo
    });

    // ===============================================================================

    // select and focus elements
    $('.text').select();
    $('.text').focus();
    $('.text').selectAndFocus();

    // Clipboard util
    $.getSelection(); // get selected text
    $.copyTextToClipboard(value); // copy a given string to clipboard
    $.copySelectionToClipboard(); // copy the selection to clipboard
});
```

### Util

```js
$.locationName && $.pathName; // returns current full windows locationName e.g /home/index.html
$.hostname; // returns current windows location hostame eg example.com
$.url; // returns current full window URL e.g https://example.com/home/index.html

// ===============================================================================

$.isArray([1, 2, 3]); // returns true
$.isEmptyObject({}); // returns true
$.isPlainObject({ data: ['asdf'] }); // returns true
$.isFunction(function () {
    /****/
}); // returns true

$.isNotNull('This is a nice string :)'); // returns true
$.isNotNull(null); // returns false

// ===============================================================================

$.serializeElement(element); // returns a JSON string with all elements attributes
$.elementToJSON(element); // returns an object with all elements attributes

// ===============================================================================

$('.text').serialize(); // .toString() // returns a JSON string with all elements inside the selector collection
$('.text').toJSON(); // returns an object with all elements inside the selector collection

// ===============================================================================

// Session and Local store methods to store objects
$.storeLocal('tmp', {
    test: 'test-local',
}); // returns boolean success
console.log('Local Store: ' + JSON.stringify($.getLocal('tmp')));
$.unStoreLocal('tmp'); // returns boolean success

$.storeSession('tmp', {
    test: 'test-session',
}); // returns boolean success
console.log('Session Store: ' + JSON.stringify($.getSession('tmp')));
$.unStoreSession('tmp'); // returns boolean success
```

---

### Discord

<div align="center">
    <h1 style="color:#154444">Other Links:</h1>
    <a style="color:#00ff00" target="_blank" href="https://discord.gg/wvcX92VyEH"><img src="https://img.shields.io/discord/785956343407181824?label=vironlab.eu%20Discord&logo=Discord&logoColor=%23ffffff&style=flat-square"></img></a>
</div>
