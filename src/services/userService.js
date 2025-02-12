import { where } from "sequelize";
import db from "../models/index";

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);

      if (isExist) {
        let user = await db.User.findOne({
          attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'], // Đảm bảo có firstName và lastName
          where: { email: email },
          raw: true,
        });
console.log(user);
        if (user) {
          let check = user.password === password; // So sánh trực tiếp mật khẩu
          if (check) {
                    userData.errCode = 0;
                    userData.errMessage = 'ok';
                    delete user.password;
                    userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is not found!!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Your Email isn't exist in your system!!";
      }

      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};


let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};


let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try{
      let users = '';
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password'] // Đảm bảo đúng tên trường, không phải 'passwords'
          }
        });
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password'] // Đảm bảo đúng tên trường
          }
        });
      }      
      resolve(users)
    } catch(e){
      reject(e)
    }
  })
}
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!typeInput)
      {
         resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!!'
         })
      }else{

        let res = {};
        let allcode = await db.Allcode.findAll({
          where: {type: typeInput}
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res)
      }
    }catch(e)
    {
      reject(e)
    }
  })
}
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  getAllCodeService: getAllCodeService
};
