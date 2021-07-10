/**
 *   Vextension-Web | Copyright © 2021 | vironlab.eu | All Rights Reserved.
 *      ___    _______                        ______         ______  
 *      __ |  / /___(_)______________ _______ ___  / ______ ____  /_ 
 *      __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ '/__  __ \
 *      __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 *      _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/ 
 *    ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____ 
 *   |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 *   | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |  
 *   | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |  
 *   |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|  
 *                                                         
 *   This program is free software: you can redistribute it and/or modify it 
 *   under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, 
 *   or (at your option) any later version.
 *   This program is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY without even the implied warranty 
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *   See the GNU General Public License for more details.
 *   You should have received a copy of the GNU Lesser General Public License along with this program.  
 * 
 *   If not, see <http://www.gnu.org/licenses/>.
 * 
 *   Contact:
 * 
 *     Discordserver:   https://discord.gg/wvcX92VyEH
 *     Website:         https://vironlab.eu/ 
 *     Mail:            contact@vironlab.eu
 *   
 */


/* jshint -W097 */ //> ignore global used use strict warning

"use strict" // https://www.w3schools.com/js/js_strict.asp 

var vextension, $

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.vextension = factory());
}(this, function () {
    // Check if Vextension-Web is used in a browser, if not, return
    if (!window) {
        return null;
    }

    // =================================== DOM manipulation =================================== //
    var serializeDom = (element, stringify = false) => {
        var treeObject = {}
        if (typeof element === "string") {
            if (window.DOMParser) {
                parser = new DOMParser()
                docNode = parser.parseFromString(element, "text/xml");
            } else {
                docNode = new ActiveXObject("Microsoft.XMLDOM")
                docNode.async = false
                docNode.loadXML(element)
            }
            element = docNode.firstChild
        }

        function treeHTML(element, object) {
            object["type"] = element.nodeName
            var nodeList = element.childNodes
            if (nodeList != null) {
                if (nodeList.length) {
                    object["content"] = [];
                    for (var i = 0; i < nodeList.length; i++) {
                        if (nodeList[i].nodeType == 3) {
                            object["content"].push(nodeList[i].nodeValue)
                        } else {
                            object["content"].push({});
                            treeHTML(nodeList[i], object["content"][object["content"].length - 1])
                        }
                    }
                }
            }
            if (element.attributes != null) {
                if (element.attributes.length) {
                    object["attributes"] = {}
                    for (var i = 0; i < element.attributes.length; i++) {
                        object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue
                    }
                }
            }
        }
        treeHTML(element, treeObject)
        return stringify ? JSON.stringify(treeObject, null, 2) : treeObject
    }

    class VextensionElementCollection extends Array {

        ready(callbackFunction) {
            const isReady = this.some(e => {
                return e.readyState != null && e.readyState != "loading"
            })
            if (isReady) {
                this.forEach(e => callbackFunction)
            } else {
                this.on("DOMContentLoaded", callbackFunction)
            }
            return this
        }

        load(callbackFunction) {
            this.on("load", callbackFunction)
            return this
        }

        click(callbackFunction) {
            this.on("click", callbackFunction)
            return this
        }

        mouseover(callbackFunction) {
            this.on("mouseover", callbackFunction)
            return this
        }

        mouseout(callbackFunction) {
            this.on("mouseout", callbackFunction)
            return this
        }

        on(event, callbackFunctionOrSelector, callbackFunction) {
            if (typeof callbackFunctionOrSelector === "function") {
                this.forEach(e => e.addEventListener(event, callbackFunctionOrSelector))
            } else {
                this.forEach(elem => {
                    elem.addEventListener(event, e => {
                        if (e.target.matches(callbackFunctionOrSelector)) callbackFunction(e)
                    })
                })
            }
            return this
        }

        each(callbackFunction) {
            this.forEach(e => callbackFunction(e))
            return this
        }

        next() {
            return this.map(e => e.nextElementSibling).filter(e => e != null)
        }

        prev() {
            return this.map(e => e.previousElementSibling).filter(e => e != null)
        }

        get(index) {
            return this[index]
        }

        removeClass(className) {
            this.forEach(e => e.classList.remove(className))
            return this
        }

        addClass(className) {
            this.forEach(e => e.classList.add(className))
            return this
        }

        css(property, value) {
            const camelProp = property.replace(/(-[a-z])/, g => {
                return g.replace("-", "").toUpperCase()
            })
            this.forEach(e => (e.style[camelProp] = value))
            return this
        }

        attr(attribute, value) {
            this.forEach(e => e.setAttribute(attribute, value))
            return this
        }

        prop(property, value) {
            this.forEach(e => e[property] = value)
            return this
        }

        val(value) {
            this.value(value)
            return this
        }
        value(value) {
            this.forEach(e => evalue = value)
            return this
        }

        html(html) {
            this.forEach(e => e.innerHTML = html)
            return this
        }

        hide() {
            this.show("none")
        }

        show(display = "block") {
            this.css("display", display)
        }

        serialize() {
            return this.toString()
        }

        toJSON() {
            let serializedArray = []
            this.each(e => {
                if (e) serializedArray.push(serializeDom(e, false))
            })
            return serializedArray
        }

        toString() {
            return JSON.stringify(this.serialize())
        }

    }
    // =================================== DOM manipulation =================================== //

    // =================================== selector =================================== //
    $ = (param) => {
        if (typeof param === "string" || param instanceof String) {
            return new VextensionElementCollection(...document.querySelectorAll(param))
        } else {
            return new VextensionElementCollection(param)
        }
    }
    // =================================== selector =================================== //

    // =================================== selector =================================== //
    $.locationName = $.pathName = window.location.pathname
    $.hostname = window.location.hostname
    $.url = window.location.href
    // =================================== selector =================================== //

    // =================================== utility =================================== //
    $.isEmptyObject = toCheckVar => typeof toCheckVar === 'object' && toCheckVar !== null && Object.keys(toCkeckVar).length <= 0
    $.isPlainObject = toCheckVar => typeof toCheckVar === 'object' && toCheckVar !== null
    $.isArray = toCheckVar => Array.isArray(toCheckVar) && toCheckVar !== null
    $.isFunction = toCheckVar => toCheckVar !== null && typeof toCheckVar === 'function'
    $.isNotNull = toCheckVar => toCheckVar !== null && toCheckVar !== undefined

    $.serializeElement = element => serializeDom(element, true)
    $.elementToJSON = element => serializeDom(element)

    // =================================== utility =================================== //

    // =================================== cookie manipulation =================================== //
    $.createCookie = $.setCookie = (name, value, days) => {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        } else {
            var date = new Date(9999, 0, 1);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    $.readCookie = $.getCookie = (name) => {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    $.deleteCookie = $.removeCookie = (name) => {
        if ($.readCookie(name) != null) $.createCookie(name, null, -1)
    }

    $.setRandomInterval = (minDelay, maxDelay, intervalFunction) => {
        let timeout
        const runInterval = () => {
            const timeoutFunction = () => {
                intervalFunction()
                runInterval()
            }
            const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
            timeout = setTimeout(timeoutFunction, delay)
        }
        runInterval()
        return {
            clear() {
                clearTimeout(timeout)
            },
        }
    }
    // =================================== cookie manipulation =================================== //

    // =================================== requests =================================== //
    class VextensionAjaxPromise {
        constructor(promise) {
            this.promise = promise
        }
        done(cb) {
            this.promise = this.promise.then(data => {
                cb(data)
                return data
            })
            return this
        }
        then(cb) {
            this.promise = this.promise.then(data => {
                cb(data)
                return data
            })
            return this
        }
        fail(cb) {
            this.promise = this.promise.catch(cb)
            return this
        }
        catch (cb) {
            this.promise = this.promise.catch(cb)
            return this
        }
        always(cb) {
            this.promise = this.promise.finally(cb)
            return this
        }
        finally(cb) {
            this.promise = this.promise.finally(cb)
            return this
        }
    }

    $.getJSON = (url, headers = {}, query = {}, success = () => {}, dataType = 'application/json; charset=UTF-8') => {
        var queryString = Object.entries(query).map(([key, value]) => `${key}=${value}`).join("&")
        if (!headers["Content-Type"]) headers["Content-Type"] = dataType
        return new VextensionAjaxPromise(
            fetch(`${url}?${queryString}`, {
                method: "GET",
                headers: headers,
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error('Status Error: ' + res.status)
                }
            })
            .then(data => {
                success(data)
                return data
            })
            .catch(error => {
                throw new Error(error)
            })
        )
    }

    $.postJSON = $.postData = $.postJsonData = (url, data = {}, headers = {}, options = {}, success = () => {}, dataType = 'application/json; charset=UTF-8') => {
        if (!headers["Content-Type"]) headers["Content-Type"] = dataType
        return new VextensionAjaxPromise(
            fetch(url, {
                method: 'POST',
                mode: options.mode || 'cors',
                cache: options.cache || 'no-cache',
                credentials: options.credentials || 'same-origin',
                redirect: options.redirect || 'follow',
                referrerPolicy: options.referrerPolicy || 'no-referrer',
                headers: headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error('Status Error: ' + res.status)
                }
            })
            .then(jsonResp => {
                success(jsonResp)
                return jsonResp;
            })
            .catch(error => {
                throw new Error(error)
            })
        )
    }

    $.get = (url, options = {}, success = () => {}) => {
        options.method = 'GET'
        return new VextensionAjaxPromise(
            fetch(url, options)
            .then(response => {
                success(response)
                return response;
            })
            .catch(error => {
                throw new Error(error)
            })
        )
    }

    $.post = (url, options = {}, success = () => {}) => {
        options.method = 'POST'
        return new VextensionAjaxPromise(
            fetch(url, options)
            .then(response => {
                success(response)
                return response;
            })
            .catch(error => {
                throw new Error(error)
            })
        )
    }

    $.postForm = $.postFormData = (url, formData = {}, options = {}, success = () => {}) => {
        if ($.isPlainObject(formData)) {
            function getFormData(object) {
                const formData = new FormData();
                Object.keys(object).forEach(key => formData.append(key, object[key]));
                return formData;
            }
            formData = getFormData(formData)
        }
        options.method = 'POST'
        options['Content-Type'] = "application/x-www-form-urlencoded"
        options.body = formData
        return new VextensionAjaxPromise(
            fetch(url, options)
            .then(response => {
                success(response)
                return response;
            })
            .catch(error => {
                throw new Error(error)
            })
        )
    }
    // =================================== requests =================================== //


    // =================================== JS / STYLE Loader =================================== //
    $.loadJS = (url, location = document.head, implementationCode = () => {}) => {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = implementationCode;
        scriptTag.onreadystatechange = implementationCode;
        location.appendChild(scriptTag);
    };

    $.loadStyle = (url, location = document.head) => {
        var linkCssTag = document.createElement('link');
        linkCssTag.href = url;
        linkCssTag.rel = "stylesheet"
        location.appendChild(linkCssTag);
    };
    // =================================== JS / STYLE Loader =================================== //

    // =================================== clipboard functions =================================== //
    function copyTextToClipboard(text) {
        var successful = false
        try {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            successful = document.execCommand('copy');
            document.body.removeChild(textArea);
        } catch (err) {}
        return successful;
    }

    $.getSelection = () => {
        if (document.getSelection) return document.getSelection();
        return ""
    }

    $.copyTextToClipboard = (value) => {
        return copyTextToClipboard(value)
    }

    $.copySelectionToClipboard = () => {
        return copyTextToClipboard($.getSelection());
    }
    // =================================== clipboard functions =================================== //

    window['$'] = window['vextension'] = vextension = $

    return $;
}));