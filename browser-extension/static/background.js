"use strict";

const listenerBeforeHeaders = (item) => {
    console.log('INTERCEPT HEADERS');
    console.log(item);
}

const listenerBeforeRequest = (item) => {
    console.log('INTERCEPT REQUEST');
    console.log(item);
}

browser.webRequest.onBeforeSendHeaders.addListener(
    listenerBeforeHeaders,             //  function
    {
        urls: ['https://*/*']
    },
    ["blocking", "requestHeaders"]
)


browser.webRequest.onBeforeRequest.addListener(
    listenerBeforeRequest,             //  function
    {
        urls: ['https://*/*']
    },
    ["blocking", "requestBody"]
)
