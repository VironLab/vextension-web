# vextension-web

[![License: GPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/785956343407181824.svg)](https://discord.gg/wvcX92VyEH)
_________

Vextension-Web is a fast javascript framework to manage browser actions

----------

#### Would you like some features such as the jQuery selector? But don't you want to import such a large library?

### Vextension-Web enables you to do this.

----------

### Import via jsdelivr !!## Unpublished ATM ##!!

```html
<script src="https://cdn.jsdelivr.net/npm/vextension-web@0.0.3/dist/vextension-web.min.js"></script>

```

----------


## Functionality

```html
<div class="showcase">
    <div class="text"></div>
</div>
```

```js
// launch function when document is loaded
$(document).ready(() => {

    // Set / Remove / Delete Cookies ( TODO: Custom Path )
    function cookieTest() {
        let actualCookie = $.readCookie("TestCookie")
        
        if (!actualCookie)
            $.setCookie("TestCookie", 0, 0)
        else
            $.setCookie("TestCookie", parseInt(actualCookie) || 0 + 1, 1)

        $.deleteCookie("TestCookie")
    }

    cookieTest()

    // hide and show elements
    $('.text').show('block') // sets css property display: block;
    $('.text').hide() // sets css property display: none;

    // manage styling
    $('.text').css("background", "#222")
    $('.text').css("height", "20px")
    $('.text').css("width", "60px")

    // bind functions to events
    $('.text').on('click', () => {
        // set random background color on click
        $('.text').css("background", '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
    })

    // loop through each element in element array with selector .text
    $('.text').each(function (element) {
        console.log(element)
    })

    // adding and removing classes from an alement
    $('.text').addClass("testclass")
    $('.text').removeClass("testclass")

    // add or remove properties from an element
    $('.checkbox').prop("checked", true)
    $('.checkbox').prop("checked", false)

    // set element attributes
    $('.tooltipToggle-1').attr("data-tooltip", "This is a cool tooltiped element")

    // change innetHTML of an element 
    $('.text').html(`<code><pre>Usage example is shown at $.getJSON method</pre></code>`)

    // set a value of an element (maybe to copy text to clipboard)
    $('.text').value(`https://vironlab.eu/`)

    // fetch and set JSON to an element
    $.getJSON("https://jsonplaceholder.typicode.com/todos/1")
        .done(json => {
            $('.text').html(`<code><pre>${JSON.stringify(json, null, 5).split("\n").join("<br>")}</pre></code>`)
            $('.text').show()
        })
        .always(() => console.log("This runs always no matter if failed or done"))
        .fail(error => console.error)

    // dynamic load JS / CSS
    $.loadStyle("https://example.com/styles.css")
    $.loadJS("https://example.com/main.js")

    // Clipboard util
    $.getSelection() // get selected text
    $.copyTextToClipboard(value) // copy a given string to clipboard
    $.copySelectionToClipboard() // copy the selection to clipboard

})

```
______

## TODO: 
```markdown
- Requests ( JSON / TXT ) // POST(form,json)
...
```

### Discord

<div align="center">
    <h1 style="color:#154444">Other Links:</h1>
    <a style="color:#00ff00" target="_blank" href="https://discord.gg/wvcX92VyEH"><img src="https://img.shields.io/discord/785956343407181824?label=vironlab.eu%20Discord&logo=Discord&logoColor=%23ffffff&style=flat-square"></img></a>
</div>