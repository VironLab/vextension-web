/**
 * Vextension-Web v0.0.15 | Copyright (C) 2021 | vironlab.eu
 * Licensed under the GNU Lesser General Public license Version 3
 *
 * ___    _______                        ______         ______
 * __ |  / /___(_)______________ _______ ___  / ______ ____  /_
 * __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ `/__  __ \
 * __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 * _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/
 *
 * ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____
 * |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 * | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |
 * | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |
 * |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|
 *
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 * Contact:
 *
 * Discordserver:   https://discord.gg/wvcX92VyEH
 * Website:         https://vironlab.eu/
 * Mail:            contact@vironlab.eu
 *
 */

var $;
(function (global, factory) {
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document
            ? factory(global, true)
            : function (w) {
                  if (!w.document) {
                      throw new Error('vextension-web requires a window with a document');
                  }
                  return factory(w);
              };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
    'use strict';

    

var serializeDom = (element, stringify = false) => {
    var treeObject = {};
    if (typeof element === 'string') {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element, 'text/xml');
        } else {
            docNode = new ActiveXObject('Microsoft.XMLDOM');
            docNode.async = false;
            docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    function treeHTML(element, object) {
        object['type'] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object['content'] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object['content'].push(nodeList[i].nodeValue);
                    } else {
                        object['content'].push({});
                        treeHTML(nodeList[i], object['content'][object['content'].length - 1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object['attributes'] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object['attributes'][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);
    return stringify ? JSON.stringify(treeObject, null, 2) : treeObject;
};

class VextensionElementCollection extends Array {
    interactive(callbackFunction) {
        switch (document.readyState) {
            case 'interactive':
                callbackFunction();
                break;
            case 'complete':
                callbackFunction();
                break;
            default:
                window.addEventListener('DOMContentLoaded', (event) => {
                    callbackFunction();
                });
                break;
        }
        return this;
    }

    ready(callbackFunction) {
        return this.interactive(callbackFunction);
    }

    load(callbackFunction) {
        switch (document.readyState) {
            case 'complete':
                callbackFunction();
                break;
            default:
                window.addEventListener('load', (event) => {
                    callbackFunction();
                });
                break;
        }
        return this;
    }

    click(callbackFunction) {
        this.on('click', callbackFunction);
        return this;
    }

    mouseover(callbackFunction) {
        this.on('mouseover', callbackFunction);
        return this;
    }

    mouseout(callbackFunction) {
        this.on('mouseout', callbackFunction);
        return this;
    }

    on(event, callbackFunctionOrSelector, callbackFunction) {
        if (typeof callbackFunctionOrSelector === 'function') {
            this.forEach((e) => e.addEventListener(event, callbackFunctionOrSelector));
        } else {
            this.forEach((elem) => {
                elem.addEventListener(event, (e) => {
                    if (e.target.matches(callbackFunctionOrSelector)) callbackFunction(e);
                });
            });
        }
        return this;
    }

    each(callbackFunction) {
        this.forEach((e) => callbackFunction(e));
        return this;
    }

    next() {
        return this.map((e) => e.nextElementSibling).filter((e) => e != null);
    }

    prev() {
        return this.map((e) => e.previousElementSibling).filter((e) => e != null);
    }

    get(index) {
        return this[index];
    }

    removeClass(className) {
        this.forEach((e) => e.classList.remove(className));
        return this;
    }

    addClass(className) {
        this.forEach((e) => e.classList.add(className));
        return this;
    }

    toggleClass(className) {
        this.forEach((e) => (e.classList.includes(className) ? e.classList.remove(className) : e.classList.add(className)));
        return this;
    }

    css(property, value) {
        function addProperty(elements, prop, val) {
            const camelProp = prop.replace(/(-[a-z])/, (g) => {
                return g.replace('-', '').toUpperCase();
            });
            elements.forEach((e) => (e.style[camelProp] = val));
        }
        if (typeof property === 'object' && property !== null) {
            Object.keys(property).forEach((cssProperty) => {
                addProperty(this, cssProperty, property[cssProperty]);
            });
            return this;
        }
        addProperty(this, property, value);
        return this;
    }

    attr(attribute, value) {
        this.forEach((e) => e.setAttribute(attribute, value));
        return this;
    }

    prop(property, value) {
        this.forEach((e) => (e[property] = value));
        return this;
    }

    val(value) {
        this.value(value);
        return this;
    }

    value(value) {
        this.forEach((e) => (evalue = value));
        return this;
    }

    html(html) {
        this.forEach((e) => (e.innerHTML = html));
        return this;
    }

    hide() {
        return this.show('none');
    }

    show(display = 'block') {
        return this.css('display', display);
    }

    select() {
        this.forEach((e) => e.select());
        return this;
    }

    focus() {
        this.forEach((e) => e.focus());
        return this;
    }

    selectAndFocus() {
        this.select();
        this.focus();
        return this;
    }

    array() {
        let arr = [];
        this.forEach((e) => arr.push(e));
        return arr;
    }

    toArray() {
        return this.array();
    }

    serialize() {
        return JSON.stringify(this.toJSON(), null, 2);
    }

    toJSON() {
        let serializedArray = [];
        this.each((e) => {
            if (e) serializedArray.push(serializeDom(e, false));
        });
        return serializedArray;
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }

    doNothing() {
        return this;
    }
}

class VextensionAjaxPromise {
    constructor(promise) {
        this.promise = promise;
    }
    done(cb) {
        this.promise = this.promise.then((data) => {
            cb(data);
            return data;
        });
        return this;
    }
    then(cb) {
        this.promise = this.promise.then((data) => {
            cb(data);
            return data;
        });
        return this;
    }
    fail(cb) {
        this.promise = this.promise.catch(cb);
        return this;
    }
    catch(cb) {
        this.promise = this.promise.catch(cb);
        return this;
    }
    always(cb) {
        this.promise = this.promise.finally(cb);
        return this;
    }
    finally(cb) {
        this.promise = this.promise.finally(cb);
        return this;
    }
}

var vextension,
    version = '0.0.15';

// =================================== selector =================================== //
vextension = (...params) => {
    if (params.length <= 0) throw new Error('Cannot run on empty parameters.');
    if (params[0] !== null && typeof params[0] === 'function') {
        return new VextensionElementCollection(document).ready(params[0]);
    }
    if (typeof params[0] === 'string' || params[0] instanceof String) {
        return new VextensionElementCollection(...document.querySelectorAll(params[0]));
    }
    if (params[0] instanceof VextensionElementCollection) {
        return params[0];
    }
    return new VextensionElementCollection(params[0]);
};
// =================================== selector =================================== //

// =================================== variables =================================== //
vextension.locationName = vextension.pathName = window.location.pathname;
vextension.hostname = window.location.hostname;
vextension.url = window.location.href;

vextension.version = version;
// =================================== variables =================================== //

// =================================== utility =================================== //
vextension.isEmptyObject = (toCheckVar) => typeof toCheckVar === 'object' && toCheckVar !== null && Object.keys(toCkeckVar).length <= 0;
vextension.isPlainObject = (toCheckVar) => typeof toCheckVar === 'object' && toCheckVar !== null;
vextension.isArray = (toCheckVar) => Array.isArray(toCheckVar) && toCheckVar !== null;
vextension.isFunction = (toCheckVar) => toCheckVar !== null && typeof toCheckVar === 'function';
vextension.isNotNull = (toCheckVar) => toCheckVar !== null && toCheckVar !== undefined;
vextension.serializeElement = (element) => serializeDom(element, true);
vextension.elementToJSON = (element) => serializeDom(element);
// =================================== utility =================================== //

// =================================== cookie manipulation =================================== //
vextension.createCookie = vextension.setCookie = (name, value, days) => {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    } else {
        var date = new Date(9999, 0, 1);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=/';
};

vextension.readCookie = vextension.getCookie = (name) => {
    var nameEQ = encodeURIComponent(name) + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
};

vextension.deleteCookie = vextension.removeCookie = (name) => {
    if (vextension.readCookie(name) != null) vextension.createCookie(name, null, -1);
};

vextension.setRandomInterval = (minDelay, maxDelay, intervalFunction) => {
    let timeout;
    const runInterval = () => {
        const timeoutFunction = () => {
            intervalFunction();
            runInterval();
        };
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        timeout = setTimeout(timeoutFunction, delay);
    };
    runInterval();
    return {
        clear() {
            clearTimeout(timeout);
        },
    };
};
// =================================== requests =================================== //
vextension.getJSON = (url, headers = {}, query = {}, success = () => {}, dataType = 'application/json; charset=UTF-8') => {
    var queryString = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    if (!headers['Content-Type']) headers['Content-Type'] = dataType;
    return new VextensionAjaxPromise(
        fetch(`${url}?vextension${queryString}`, {
            method: 'GET',
            headers: headers,
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Status Error: ' + res.status);
                }
            })
            .then((data) => {
                success(data);
                return data;
            })
            .catch((error) => {
                throw new Error(error);
            }),
    );
};

vextension.postJSON =
    vextension.postData =
    vextension.postJsonData =
        (url, data = {}, headers = {}, options = {}, success = () => {}, dataType = 'application/json; charset=UTF-8') => {
            if (!headers['Content-Type']) headers['Content-Type'] = dataType;
            return new VextensionAjaxPromise(
                fetch(url, {
                    method: 'POST',
                    mode: options.mode || 'cors',
                    cache: options.cache || 'no-cache',
                    credentials: options.credentials || 'same-origin',
                    redirect: options.redirect || 'follow',
                    referrerPolicy: options.referrerPolicy || 'no-referrer',
                    headers: headers,
                    body: JSON.stringify(data),
                })
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            throw new Error('Status Error: ' + res.status);
                        }
                    })
                    .then((jsonResp) => {
                        success(jsonResp);
                        return jsonResp;
                    })
                    .catch((error) => {
                        throw new Error(error);
                    }),
            );
        };

vextension.get = (url, options = {}, success = () => {}) => {
    options.method = 'GET';
    return new VextensionAjaxPromise(
        fetch(url, options)
            .then((response) => {
                success(response);
                return response;
            })
            .catch((error) => {
                throw new Error(error);
            }),
    );
};

vextension.post = (url, options = {}, success = () => {}) => {
    options.method = 'POST';
    return new VextensionAjaxPromise(
        fetch(url, options)
            .then((response) => {
                success(response);
                return response;
            })
            .catch((error) => {
                throw new Error(error);
            }),
    );
};

vextension.postForm = vextension.postFormData = (url, formData = {}, options = {}, success = () => {}) => {
    if (vextension.isPlainObject(formData)) {
        function getFormData(object) {
            const formData = new FormData();
            Object.keys(object).forEach((key) => formData.append(key, object[key]));
            return formData;
        }
        formData = getFormData(formData);
    }
    options.method = 'POST';
    options['Content-Type'] = 'application/x-www-form-urlencoded';
    options.body = formData;
    return new VextensionAjaxPromise(
        fetch(url, options)
            .then((response) => {
                success(response);
                return response;
            })
            .catch((error) => {
                throw new Error(error);
            }),
    );
};
// =================================== requests =================================== //

// =================================== JS / STYLE Loader =================================== //
vextension.loadScript = vextension.loadJS = async (url, location = document.head, implementationCode = () => {}) => {
    return new Promise((resolve, reject) => {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = () => {
            implementationCode();
            resolve();
        };
        scriptTag.onerror = (error) => {
            reject(error);
        };
        location.appendChild(scriptTag);
    });
};

vextension.loadStyle = vextension.loadCSS = async (url, location = document.head) => {
    return new Promise((resolve, reject) => {
        var linkCssTag = document.createElement('link');
        linkCssTag.href = url;
        linkCssTag.rel = 'stylesheet';
        location.appendChild(linkCssTag);
        linkCssTag.onload = resolve;
        linkCssTag.onerror = reject;
    });
};
// =================================== JS / STYLE Loader =================================== //

// =================================== clipboard functions =================================== //
function copyTextToClipboard(text) {
    var successful = false;
    try {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textArea);
    } catch (err) {}
    return successful;
}

vextension.getSelection = () => {
    if (document.getSelection) return document.getSelection();
    return '';
};

vextension.copyTextToClipboard = (value) => {
    return copyTextToClipboard(value);
};

vextension.copySelectionToClipboard = () => {
    return copyTextToClipboard(vextension.getSelection());
};
// =================================== clipboard functions =================================== //

// =================================== storage functions =================================== //
vextension.storeLocal = (name = 'tmp', storeObject) => {
    try {
        if (localStorage != null && typeof localStorage.setItem === 'function') {
            localStorage.setItem(name, JSON.stringify(storeObject));
            return true;
        }
    } catch (e) {}
    return false;
};

vextension.unStoreLocal = (name = 'tmp') => {
    try {
        if (localStorage != null && typeof localStorage.setItem === 'function') {
            localStorage.removeItem(name);
            return true;
        }
    } catch (e) {}
    return false;
};

vextension.getLocal = (name = 'tmp') => {
    try {
        if (localStorage != null && typeof localStorage.setItem === 'function') {
            return JSON.parse(localStorage.getItem(name));
        }
    } catch (e) {}
    return null;
};

vextension.storeSession = (name = 'tmp', storeObject) => {
    try {
        if (sessionStorage != null && typeof sessionStorage.setItem === 'function') {
            sessionStorage.setItem(name, JSON.stringify(storeObject));
            return true;
        }
    } catch (e) {}
    return false;
};

vextension.unStoreSession = (name = 'tmp', storeObject) => {
    try {
        if (sessionStorage != null && typeof sessionStorage.setItem === 'function') {
            sessionStorage.removeItem(name);
            return true;
        }
    } catch (e) {}
    return false;
};

vextension.getSession = (name = 'tmp') => {
    try {
        if (sessionStorage != null && typeof sessionStorage.setItem === 'function') {
            return JSON.parse(sessionStorage.getItem(name));
        }
    } catch (e) {}
    return null;
};

    window['$'] = window['vextension'] = $ = vextension;
    return vextension;
});
