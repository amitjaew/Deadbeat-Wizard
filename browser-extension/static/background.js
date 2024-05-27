"use strict";

const APP_URL = 'http://127.0.0.1:5173/api';
const queue = [];

const sendToApp = async (
    campaignId,
    method,
    headers,
    body
) => {
    const data = {
        campaign_id: campaignId,
        method: method,
        headers: headers,
        body: body
    };

    let r = await fetch(`${APP_URL}/capture`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    r = r.json();
    return r;
};

const listenerBeforeHeaders = (intercept) => {
    console.log('INTERCEPT HEADERS');
    console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};

    request.headers = intercept.requestHeaders;
    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            1,
            request.method,
            request.headers,
            request.body
        );
    }
    else {
        queue.push(request);
    }
};

const listenerBeforeRequest = (intercept) => {
    console.log('INTERCEPT REQUEST');
    console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};

    request.body = intercept.requestBody;
    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            1,
            request.method,
            request.headers,
            request.body
        );
    }
    else {
        queue.push(request);
    }
};

browser.webRequest.onBeforeSendHeaders.addListener(
    listenerBeforeHeaders,             //  function
    {
        urls: ['https://*/*']
    },
    ["blocking", "requestHeaders"]
);


browser.webRequest.onBeforeRequest.addListener(
    listenerBeforeRequest,             //  function
    {
        urls: ['https://*/*']
    },
    ["blocking", "requestBody"]
);
