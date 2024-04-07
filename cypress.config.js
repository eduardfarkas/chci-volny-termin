const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        sendEmail({text}) {
          let nodemailer = require('nodemailer');
          let transporter = nodemailer.createTransport({
            host: "smtp.seznam.cz",
            port: 465,
            secure: true,
            auth: {
              user: "eda.farkas@seznam.cz", // musi byt stejne jako "from"
              pass: "heslo",
            },
          });

          var mailOptions = {
            from: 'eda.farkas@seznam.cz',
            to: 'eda.farkas@seznam.cz',
            subject: 'Nalezen volny termin na zkousku z realii a cesky jazyl pro obcanstvi CR',
            text: text
          };

          return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                reject(error);
              } else {
                resolve('Email sent: ' + info.response);
              }
            });
          });
        }
      });
    },
  },
});
