const Student = require('../models/studentModel');
const hashedPassword = require('../lib/hash');


async function addStudent(data){
    const password = data.password;
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;

    try {
        await Student.create(data);
    } catch (error) {
        console.log(error);
    }
}

async function getStudent(id){
    try {
        const student = await Student.findAll({
            where:{
                matricule:id
            }
        })
        return student; 
    } catch (error) {
        console.log(error)
    }
}

async function updateStudent(matricule, data) {
    const password = data.password;
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;
    await Student.update(
        data
    , {
        where:{
            matricule:matricule,
        }
    })
}

module.exports = {addStudent, getStudent, updateStudent}
