const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require('html-to-text');
const path = require("path");

class EmailService {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name;
        this.url = url;
        this.from = process.env.EMAIL_FROM;
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return 1; // production transport logic
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    }

    getTemplatePath(template) {
        // Chuẩn hóa đường dẫn template
        return path.join(__dirname, '../../views/email', `${template}.pug`);
    }
    getLogoPath() {
        // Chuẩn hóa đường dẫn logo
        return path.join(__dirname, '../../views', 'logo.png');
    }

    async sendOtpCode({ template, subject, otp }) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            firstName: this.name,
            url: this.url,
            subject,
            otp: otp,
            logo: 'cid:logo',
            resetLink: `${process.env.FRONTEND_URL}/reset-password`
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.convert(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo"
                }
            ]
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendWelcome() {
        const template = 'welcome'; // sửa nếu có template welcome
        await this.sendOtpCode({ template, subject: 'Welcome to ShopMan', otp: null });
    }

    async sendNotificationNewProduct(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            firstName: this.name,
            productName: data.productName,
            productPrice: data.productPrice,
            productDescription: data.productDescription,
            productThumb: data.productThumb,
            productLink: `${process.env.FRONTEND_URL}/products/${data.productSlug}`,
            logo: 'cid:logo',
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.convert(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo"
                }
            ]
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendInvoice(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            firstName: this.name,
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
            text: htmlToText.convert(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo"
                }
            ]
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendNotificationProductRefill(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            firstName: this.name,
            shopName: data.shopName,
            productName: data.productName,
            productThumb: data.productThumb,
            productLink: `${process.env.FRONTEND_URL}/products/${data.productSlug}`,
            logo: 'cid:logo'
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.convert(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo"
                }
            ]
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendNotificationNewDiscount(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            firstName: this.name,
            shopName: data.shopName,
            discountCode: data.discountCode,
            discountValue: data.discountValue,
            discountDesc: data.discountDesc,
            discountMinOrder: data.discountMinOrder,
            discountEndDate: data.discountEndDate,
            shopLink: `${process.env.FRONTEND_URL}/shops/${data.shopSlug}`,
            logo: 'cid:logo'
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: htmlToText.convert(html),
            html: html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo"
                }
            ]
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendInviteShopMember(template, subject, data) {
        const html =  pug.renderFile(this.getTemplatePath(template), {
            logo: "cid:logo",
            shopName: data.shopName,
            memberName: data.memberName,
            roleName: data.roleName,
            inviteLink: data.inviteLink,
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.convert(html),
            html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo",
                },
            ],
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendOrderCanceledAll(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            logo: "cid:logo",
            orderId: data.orderId,
            userName: data.userName,
            canceledBy: data.canceledBy,
            cancelReason: data.cancelReason,
            orderDetails: data.orderDetails, // [{productName, shopName, quantity}]
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.convert(html),
            html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo",
                },
            ],
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }

    async sendOrderCanceledPartial(template, subject, data) {
        const html = pug.renderFile(this.getTemplatePath(template), {
            logo: "cid:logo",
            orderId: data.orderId,
            userName: data.userName,
            canceledBy: data.canceledBy,
            cancelReason: data.cancelReason,
            canceledItems: data.canceledItems, // [{productName, shopName, quantity}]
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.convert(html),
            html,
            attachments: [
                {
                    filename: "logo.png",
                    path: this.getLogoPath(),
                    cid: "logo",
                },
            ],
        };
        const transport = this.newTransport();
        await transport.sendMail(mailOptions);
    }
}

module.exports = EmailService;
