import { where } from "sequelize";
import db from "../models/index";
import emailService from './emailService';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import { raw } from "body-parser";


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName
                || !data.selectedGender || !data.address) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Misshjyjhjhing required parameters!!!'
                });
            }
            let [user, created] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    gender: data.selectedGender,
                    address: data.address,
                    firstName: data.fullName
                },
            });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'User creation failed!'
                });
            }
            let existingBooking = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    patientId: user.id,
                    date: data.date 
                }
            });

            if (existingBooking) {
                return resolve({
                    errCode: 3,
                    errMessage: 'You already have an appointment on this day!'
                });
            }

            let token = uuidv4();
            await db.Booking.create({
                statusId: 'S1',
                doctorId: data.doctorId,
                patientId: user.id,
                date: data.date,
                timeType: data.timeType,
                token: token
            });
            await emailService.sendSimpleEmail({
                reciverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            });

            resolve({
                errCode: 0,
                errMessage: 'Appointment booked successfully!'
            });

        } catch (e) {
            console.error("Error in postBookAppointment:", e);
            reject({
                errCode: -1,
                errMessage: 'Server error!'
            });
        }
    });
}

let postVerifyBookAppointment = (data) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!data.token || !data.doctorId)
            {
                resolve ({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve ({
                        errCode: 0,
                        errMessage: 'Update the appointment successfully'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activate or does not exist"
                    })
                }
            }
        } catch(e){
            reject(e);
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment
}