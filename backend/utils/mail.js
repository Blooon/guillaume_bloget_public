var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: process.env.GMAILUSER,
           pass: process.env.GMAILPASSWORD
       }
   });

module.exports = {
    sendNotifMail: () => {
    const mailOptions = {
      from: 'notif@guillaumebloget.com', // sender address
      to: 'guillaume.bloget@gmail.com', // list of receivers
      subject: 'New command on guillaumebloget.com', // Subject line
      html: '<p>You should check out !</p>'// plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err);
      console.log(info);
    })
  }
}