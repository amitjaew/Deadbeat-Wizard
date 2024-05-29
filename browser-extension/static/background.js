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
    
    console.log('REQUEST', data);
    return;
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
    if (intercept.method.toLowerCase() !== 'post') return;
    //console.log('INTERCEPT HEADERS');
    //console.log(intercept);
    let request = queue.find(
        r => r.requestId === intercept.requestId
    );
    let isComplete = request ? true : false;
    if (! request) request = {};
    
    const unparsedHeaders = Array.from(intercept.requestHeaders);
    //const parsedHeaders = unparsedHeaders.map(h => Object.fromEntries(h));
    //request.headers = parsedHeaders;
    request.requestId = intercept.requestId;
    request.headers = unparsedHeaders;
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
        let parsedRaw = '';
        console.log('PARSING', unparsedBody.raw);
        const decoder = new TextDecoder('utf-8');
        parsedRaw = decodeURIComponent(String.fromCharCode.apply(null,
                                      new Uint8Array(unparsedBody.raw[0].bytes)));

        /*
        for (const chunk in unparsedBody.raw){
            let bytes = new Uint8Array(chunk.bytes);
            console.log('bytes:', bytes);
            parsedRaw += decoder.decode(bytes, {stream: true});
        }*/
        console.log('PARSED', parsedRaw);
        request.body.raw = parsedRaw;
    }

    request.requestId = intercept.requestId;
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
        urls: ['https://*/*'],
    },
    ["blocking", "requestBody"]
);
