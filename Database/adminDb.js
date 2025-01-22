const Admin = require('../models/adminModel');
const {Election, Candidate, Vote} = require('../models/electionModel');

async function addAdmin(data){
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