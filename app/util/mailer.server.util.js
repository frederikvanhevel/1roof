'use strict';

var path = require('path'),
    emailTemplates = require('swig-email-templates'),
    nodemailer = require('nodemailer'),
    config = require('../../config/config'),
    _ = require('lodash');

exports.send = function(template, context, to, subject) {

    var options = {
        root: path.join(__dirname, '../views/email'),
        varControls: ['<%=', '%>']
    };

    emailTemplates(options, function(err, render) {
        render(template, _.assign(context, { app: config.app }), function(err, html, text) {
            sendMail(err, html, text);
        });
    });


    function sendMail(err, html, text) {
        if (err) {
            console.error(err);
        } else {
          // ## Send a single email

            var transporter = nodemailer.createTransport(config.email);

            var mailOptions = {
                from: '1roof.be <noreply@1roof.be>', // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                html: html // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.error(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });

        }

    }

};
