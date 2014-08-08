'use strict';

var path = require('path'),
  emailTemplates = require('swig-email-templates'),
  nodemailer = require('nodemailer'),
  config = require('../../config/config');

exports.send = function(template, context, to, subject) {

  var options = {
    root: path.join(__dirname, '../views/email'),
    // any other swig options allowed here
  };
  emailTemplates(options, function(err, render) {
    render(template, context, function(err, html, text) {
      sendMail(err, html, text);
    });
  });


  function sendMail(err, html, text) {
    if (err) {
      console.log(err);
    } else {
      // ## Send a single email

      var transporter = nodemailer.createTransport(config.email);

      var mailOptions = {
        from: 'Apollo <noreply@apollo.be>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
          console.log(error);
        }else {
          console.log('Message sent: ' + info.response);
        }
      });

    }

  }
  
};