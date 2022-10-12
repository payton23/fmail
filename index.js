const fs = require('fs')

//Initialize dotenv for reading environmental variables
const dotenv = require('dotenv')
dotenv.config()

//Initialize server
var express = require('express');
var http = require('http');
var nodemailer = require('nodemailer');
var cors = require('cors')
var app = express();
const path = require('path');
const { response } = require('express');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.use(cors())

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, ()=> {
    console.log("Listening on port " + port)
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: false }));

app.post('/blast', (request, response) => {
    console.log(request.body)

    /*
        mock data
        {
            smtpData: {
                host: "smtp-relay.sendinblue.com",
                port: 587,
                secure: port == 465 ? true : false, // true for 465, false for other ports
                user: "",
                pass: "",
            },
            emailData: {
                from: 'Bruce Wayne <batman@wayne.net>',
                to: "abc@k.com, xyz@h.com",
                replyTo: '',
                subject: '',
                html: ''
            }
        }
    */
    
    //To avoid crashing of server by errors from post method, try and catch is implemented

    try {
        var transporter = nodemailer.createTransport({
            host: request.body.smtpData.host,
            port: parseInt(request.body.smtpData.port) || 587,
            secure: request.body.smtpData.port === 465 ? true : false, // true for 465, false for other ports
            auth: {
                user: request.body.smtpData.user,
                pass: request.body.smtpData.pass,
            },
        });
        
        transporter.verify((error, success) => {
            if (error) {
                console.log(error);
                response.json({status: "failed", message: error})
            } else {
                console.log("Server is ready to take our messages");
            }
            });
    
        var mail = {
            ...request.body.emailData,
            to: ''
        }
        var emailList = request.body.emailData.to.split(',')
    
        sendBulkMail(mail, emailList, transporter)
        
        response.json({status: "success"})
    } catch (error) {
        response.json({status: "failed"})
    }
})


function sendMail(mail, transporter){
    return new Promise((resolve, reject) => {
        transporter.sendMail(mail, function(error, response){
            if(error){
                console.log(error);
                reject(error)
            }
            else {
                console.log("Message sent: " + JSON.stringify(response));
                resolve(response)
            }
            transporter.close();
        })
    })
}

function sendBulkMail(mail, emailList, transporter){
    var promiseArray = [];

    for(let addr of emailList){
        promiseArray.push( sendMail({ ...mail, to: addr.trim() }, transporter) )
    }

    Promise.all(promiseArray)
        .then( result =>  console.log('all mail completed'))
        .catch( error => console.log(error))
}
