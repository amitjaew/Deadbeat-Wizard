"use strict";

const APP_URL = 'http://localhost:5173/api';
const queue = [];

const sendToApp = async (
    campaignId,
    url,
    method,
    type,
    headers,
    body
) => {
    const data = {
        campaign_id: campaignId,
        url: url,
        method: method,
        type: type,
        headers: headers,
        body: body
    };
    
    console.log('REQUEST', data);
    let r = await fetch(`${APP_URL}/capture`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    console.log('API response', r);
    r = r.json();
    return r;
};

const listenerBeforeHeaders = (intercept) => {
    if (intercept.method.toLowerCase() !== 'post') return;
    //console.log('INTERCEPT HEADERS');
    //console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};
    
    const parsedHeaders = Array.from(intercept.requestHeaders);
    request.requestId = intercept.requestId;
    request.headers = parsedHeaders;
    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            null,
            request.url,
            request.method,
            request.type,
            request.headers,
            request.body
        );
    }
    else {
        queue.push(request);
    }
};

const listenerBeforeRequest = (intercept) => {
    if (intercept.method.toLowerCase() !== 'post') return;
    //console.log('INTERCEPT REQUEST');
    //console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};

    const unparsedBody = intercept.requestBody;
    request.body = {};

    if (unparsedBody && unparsedBody.formData){
        request.body.formData = unparsedBody.formData;
    }
    if (unparsedBody && unparsedBody.raw) {
        let parsedRaw = decodeURIComponent(
            String.fromCharCode.apply(
                null,
                new Uint8Array(unparsedBody.raw[0].bytes)
            )
        );
        request.body.raw = parsedRaw;
    }

    request.requestId = intercept.requestId;
    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            null,
            request.url,
            request.method,
            request.type,
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
        urls: ['https://*/*'],
    },
    ["blocking", "requestBody"]
);
