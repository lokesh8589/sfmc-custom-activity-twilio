'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');
var request = require('request');
var express     = require('express');
var bodyParser  = require('body-parser');

const { JsonWebTokenError } = require('jsonwebtoken');


exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Edited: "+req.body.inArguments[0]);    
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log("coming in exports of edit");
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
  //  console.log( req.body );
    console.log("in the save function ");
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log("5 -- For Execute");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
      console.log("Executed: "+req.body.inArguments[0]);


    var requestBody = req.body.inArguments[0];
    var uniqueEmail = req.body.keyValue;
    console.log(uniqueEmail);
    const accountSid = requestBody.accountSid;
    const authToken = requestBody.authToken;
    const to = requestBody.to;
    const from = requestBody.messagingService;
    const body = requestBody.body;
    
    //this line is responsible for userName is required  error 
    const client = require('twilio')(accountSid, authToken);
       
    client.messages 
          .create({ 
             body: body,
             from :'+18304026371',
             to: '+91'+to 
           }) 
           .then(message => {
                 console.log("message id:"+message.sid);
        var AuthenticationBaseURI = "mc6vgk-sxj9p08pqwxqz9hw9-4my.auth.marketingcloudapis.com"
                 
                 const data = JSON.stringify({
                     client_id : "27oou1v6804u1niltlfzwn6r",
                     client_secret : "QqBAkEzwo3dQcHPLRV89Ig2v",
                     grant_type : "client_credentials"
                     
                  })
                 console.log("data:"+ data);
                 const values = {
                     hostname : AuthenticationBaseURI,
                     path : "/v2/token",
                     method : "POST",
                     headers : {
                         'Content-Type': 'application/json',
                     }
                 
                 }
                 var accTok = '';
                var restURL = '';
                 const getToken = http.request(values,res =>{
                     console.log('status code: ${res.statusCode}')
                     var jsonString = "" 
     
                    res.on('data', d => {
                        jsonString += d;
                    });
    
    // Ending the response 
                    res.on('end', function() {
                    var resData = JSON.parse(jsonString);
                    accTok += resData.access_token
                    restURL += resData.rest_instance_url
                    console.log('Access Token : ' + accTok); 
                    console.log('Rest URL Endpoint : ' + restURL);

                   // yaha se start hora h 
                    const TrackingData = {
                        "items": [{
                            "Email": uniqueEmail,
                            "Status": message.status,
                            "AccountSID": message.accountSid,
                            "apiVersion": message.apiVersion,
                            "Body": message.body,
                            "dateCreated": message.dateCreated,
                            "dateUpdated": message.dateUpdated,
                            "dateSent": message.dateSent,
                            "direction": message.direction,
                            "from": message.from,
                            "messagingServiceSid": message.messagingServiceSid,
                            "price": message.price,
                            "priceUnit": message.priceUnit,
                            "sid": message.sid,
                            "uri": message.uri
                        }]
                    }
                    console.log(TrackingData);
                    console.log("access token yeh jarha hai put me " + accTok);
                    //data extension me insert krwana hai ..
                    request.post({
                        headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + accTok },
                        url: restURL + '/data/v1/async/dataextensions/key:5FE0A8E3-42BE-41B0-959A-75B484866FD4/rows',
                        body: TrackingData,
                        json: true
                    }, function(error, response, body) {
                        console.log(error);
                        console.log("resultMessages" + body.resultMessages);
                        console.log("resultMessages" + response.requestId);
                    });
                    
                })
            })
            getToken.on('error', error => {
                console.error(error);
            })
            getToken.write(data);
            getToken.end();

            

            console.log(message);
        })
        .done(); 
    // FOR TESTING
    logData(req);
    res.send(200, 'Publish');

    // Used to decode JWT
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];
            
    //         logData(req);
    //         res.send(200, 'Execute');
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Published: "+req.body.inArguments[0]);        
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
     logData(req);
     res.send(200, 'Publish');
     console.log("coming to publish");
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Validated: "+req.body.inArguments[0]);       
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
    
};
