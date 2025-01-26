const Admin = require('../models/adminModel');
//const {Election, Candidate, Vote} = require('../models/electionModel');
const hashedPassword = require('../lib/hash');


async function addAdmin(data){
    const password = data.password
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;
    await Admin.create(data);
}

async function getAdmin(user_name) {
    console.log('Getting Admin')
    try {
        const admin = await Admin.findOne({
            where:{
                username:user_name,
            }
        })
        return {id:`${admin.id}`, username:`${admin.username}`, hashed_password:`${admin.hashed_password}`};
    } catch (error) {
       console.log(error);
    }
}

async function updateAdmin(id,data){
    try {
        await Admin.update(data,
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