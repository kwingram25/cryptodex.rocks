const nodemailer = require('nodemailer');

const { SMTP_PASSWORD, SMTP_USERNAME, SMTP_RECIPIENT } = process.env;
//
// const SMTP_PASSWORD = '98E;MfYWY"nkh~La';
// const SMTP_USERNAME = 'cryptodex.rocks@gmail.com';
// const SMTP_RECIPIENT = 'kwingram25@gmail.com';

const sendMail = (transporter, params, res) => {
  const { name, email, message } = params;

  const mailOptions = {
    from: 'no-reply@cryptodex.rocks', // sender address
    to: SMTP_RECIPIENT, // list of receivers
    subject: `Cryptodex.rocks Message from ${name}`, // Subject line
    text: `
Sender: ${name} <${email}>

Contents: ${message}`,
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      res.sendStatus(500);
    }

    // if (process.env.NODE_ENV === 'development') {
    //   console.log('Message sent: %s', info.messageId);
    //   // // Preview only available when sending through an Ethereal account
    //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // }
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.sendStatus(200);
  });
};
// user: 'SMTP_Injection', // generated ethereal user
// pass: '79adfb7a4f7d92a552f67cfc435c87d1d91025ee', // generated ethereal password


let transporter;

module.exports = function addContactEndpoint(app) {
  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy

  app.post('/contact', async (req, res) => {
    // console.log(req);
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

    if (!req.body.name ||
        !req.body.message ||
        !req.body.email) {
      res.sendStatus(500);
      return;
    }

    switch (process.env.NODE_ENV) {
      case 'development':
        nodemailer.createTestAccount((err, account) => {
          transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: account.user, // generated ethereal user
              pass: account.pass, // generated ethereal password
            },
          });

          sendMail(transporter, req.body, res);
        });
        break;
      default:
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: SMTP_USERNAME, // generated ethereal user
            pass: SMTP_PASSWORD, // generated ethereal password
          },
        });

        sendMail(transporter, req.body, res);
        break;
    }

    // res.sendFile(path.resolve(outputPath, 'index.html'))
  });
};
