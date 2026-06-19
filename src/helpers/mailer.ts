import nodemailer from 'nodemailer';
import { EMAIL_SMTP_PASSWORD, EMAIL_SMTP_USERNAME } from '../config/index.ts';

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "gmail",
	// host: process.env.EMAIL_SMTP_HOST,
	// port: process.env.EMAIL_SMTP_PORT,
	//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: EMAIL_SMTP_USERNAME,
		pass: EMAIL_SMTP_PASSWORD
	}
});


const sendMail =  (from: string, to: string, subject: string, html: string) => {
	// send mail with defined transport object
	// visit https://nodemailer.com/ for more options
	return transporter.sendMail({
		from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
		to: to, // list of receivers e.g. bar@example.com, baz@example.com
		subject: subject, // Subject line e.g. 'Hello ✔'
		//text: text, // plain text body e.g. Hello world?
		html: html // html body e.g. '<b>Hello world?</b>'
	});
};

export { sendMail };