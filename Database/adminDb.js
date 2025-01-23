const Admin = require('../models/adminModel');
//const {Election, Candidate, Vote} = require('../models/electionModel');
const hashedPassword = require('../lib/hash');


async function addAdmin(data){
    const password = data.password
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;
    await Admin.create(data);
}

async function getAdmin(username) {
    try {
        const admin = await Admin.findAll({
            where:{
                username:username,
            }
        })
        return admin;
    } catch (error) {
       console.log(error);
    }
}

async function updateAdmin(id,data){
    try {
        Admin.update(data,
            {
            where:{
                id:id
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getAdmin, addAdmin, updateAdmin}