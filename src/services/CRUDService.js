import { where } from 'sequelize';
import db from '../models/index';

let createNewUser = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            await db.User.create({
                 email: data.email,
                 password: data.password,
                 firstName: data.firstName,
                 lastName: data.lastName,
                 address : data.address,
                 phonenumber: data.phonenumber,
                 gender: data.gender === '1' ?  true : false,
                 roleId: data.roleId,
            })
            resolve('ok, create new user sucessful')
        }
        catch(e)
        {
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e){
            reject(e);
        }
    })
}

let getUserInfoById  = (userId) => {
    return new Promise( async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true,
            })
            if(user)
            {
                resolve(user)
            }else{
                resolve([])
            }

        }catch(e){
            reject(e);
        }
    })

}

let updateUserData = (data) => {
    return new Promise( async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user)
            {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        }catch(e)
        {
            console.log(e);
        }
    })
}

let deleteUserById = (userId) => {
 return new Promise( async (resolve, reject) => {
    try {
        let user = await db.User.findOne({
            where: {id: userId}
        })
        if(user){
            user.destroy();
        }
        resolve();
    }catch(e){
        reject(e);
    }
 })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}