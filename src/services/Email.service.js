const nodemailer = require("nodemailer")
const pug = require("pug")
const htmlToText = require('html-to-text')
const { template } = require("lodash")
class EmailService {
    constructor(user, url) {
        this.to = user.email
        this.name = user.name
        this.url = url
        this.from = process.env.EMAIL_FROM
    }
    static newTransport() {
        if (process.env.NODE_ENV === "production") {
            return 1
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        })
    }
    static async sendOtpCode ({template, subject, opt}){
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
            otp: opt,
            logo: 'cid:logo',
            resetLink: `${process.env.FRONTEND_URL}/reset-password`
        })

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.fromString(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: `${_dirname}/../views/logo.png`,
                    cid: "logo"
                }
            ]
        }
        const transport = this.newTransport()
        await transport.sendMail(mailOptions)
    }
    static async sendWelcome (){
        const template = ''
        await this.send(template, 'welcome to ShopMan')
    }
    static async sendNotificationNewProduct(template, subject, data){
        const html = pug.renderFile(`${__dirname}/views/email/${template}.pug`, {
            firstName: this.firstName,
            productName: data.productName,
            productPrice: data.productPrice,
            productDescription: data.productDescription,
            productThumb: data.productThumb,
            productLink: `${process.env.FRONTEND_URL}/products/${data.productSlug}`,
            logo: 'cid:logo',
        })
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.fromString(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: `${_dirname}/../views/logo.png`,
                    cid: "logo"
                }
            ]
        }
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }
    static async sendInvoice(template, subject, data){
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            orderId: data.orderId,
            orderDate: data.orderDate,
            paymentMethod: data.paymentMethod,
            orderItems: data.orderItems,
            orderTotal: data.orderTotal,
            invoiceLink: `${process.env.FRONTEND_URL}/invoice/${data.orderId}`,
            logo: 'cid:logo'
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.fromString(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: `${_dirname}/../views/logo.png`,
                    cid: "logo"
                }
            ]
        }
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }
}

module.exports = EmailService