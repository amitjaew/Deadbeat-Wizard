"use strict";

const APP_URL = 'http://127.0.0.1:5173/api';
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
        body: body,
        r_headers: [],
        r_body: '',
        r_status: ''
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
    
    const unparsedHeaders = Array.from(intercept.requestHeaders);
    const parsedHeaders = unparsedHeaders.map(h => Object.fromEntries(h));
    request.headers = parsedHeaders;
    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            1,
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
    console.log('INTERCEPT REQUEST');
    console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};

    const unparsedBody = intercept.requestBody;
    request.body = {};

    if (unparsedBody.formData){
        request.body.formData = unparsedBody.formData;
    }
    if (unparsedBody.raw) {
        let parsedRaw = '';
        const decoder = new TextDecoder();
        for (const chunk in unparsedBody.raw){
            parsedRaw += decoder.decode(chunk);
        }
        request.body.raw = parsedRaw;
    }

    request.method = intercept.method;
    request.type = intercept.type;
    request.url = intercept.url;
    if (isComplete) {
        sendToApp(
            1,
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
        urls: ['https://*/*']
    },
    ["blocking", "requestBody"]
);
