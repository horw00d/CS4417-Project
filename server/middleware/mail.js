const sgMail = require('@sendgrid/mail')
require('dotenv').config({ path: __dirname + '/../.env' });
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
function mail(email, tempPassword){
    const msg = {
        to: email,
        from: 'chorwood@unb.ca',
        subject: 'CS4417 Project Authentication (Temporary Password Included)',
        text: 'Your temporary password is: ' + tempPassword + ' and will be changed upon your first login.',
        html: '<strong>Your temporary password is: ' + tempPassword + ' and will be changed upon your first login.</strong>',
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent to ' + email)
        })
        .catch((error) => {
          console.error(error)
        })
}

module.exports = mail;
