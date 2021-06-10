const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to:email,
        from: '09pandey@gmail.com',
        subject: 'Thanks for joining',
        text:`Welcome to the app, ${name}. Let me know how you like it.`
    })
}
const sendGoodbyeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: '09pandey@gmail.com',
        subject: 'Sorry to see you go',
        text: `Thanks for using the app, ${name}. Let me know what improvements can I make.`
    })
}

module.exports = {
    sendWelcomeMail,
    sendGoodbyeMail
}