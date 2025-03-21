require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"ThanhLuong Nguyen" <nthanhluong612@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if(dataSend.language === 'vi') {
        result = 
        `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website đặt lịch khám bệnh của bệnh viện</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>
            <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
            <b>Bác sĩ: ${dataSend.doctorName}</b>
        </div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
            <a href= ${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!!</div>
        `
    }
    if(dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received this email because you have made an appointment online on the hospital's appointment booking website</p>
        <p>Appointment information:</p>
        <div>
        <b>Time: ${dataSend.time}</b>
        </div>
        <div>
        <b>Doctor: ${dataSend.doctorName}</b>
        </div>
        <p>If the above information is true, please click on the correct link below to confirm the completion of the appointment booking procedure.</p>
        <div>
        <a href= ${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Thank you very much!!</div>
        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if(dataSend.language === 'vi') {
        result = 
        `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website đặt lịch khám bệnh của bệnh viện</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn!!</div>
        `
    }
    if(dataSend.language === 'en') {
        result = 
        `
        <h3>Hello ${dataSend.PatientName}!</h3>
        <p>You have received this email because you have booked an appointment online on the hospital's appointment booking website</p>
        <p>The prescription/invoice information is sent in the attached file</p>

        <div>Thank you very much!!</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise (async(resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
            let info = await transporter.sendMail({
                from: '"ThanhLuong Nguyen" <nthanhluong612@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve(true)
        } catch(e) {
            reject(e);
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}