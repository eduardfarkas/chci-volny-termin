module.exports = (on, config) => {
    on('task', {
        sendEmail() {
            let nodemailer = require('nodemailer');
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'eduard.farkas95@gmail.com',
                    pass: 'rgbhswrgbhsw'
                }
            });

            var mailOptions = {
                from: 'eduard.farkas95@gmail.com',
                to: 'eda.farkas@seznam.cz',
                subject: 'Test Completed',
                text: 'The test has been completed!'
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
};