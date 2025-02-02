const {Students} = require('./connnectMongo');
const hashedPassword = require('../lib/hash');

console.log(Students);

async function addStudent(data){
    const password = data.password;
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;

    try {
        const newStudent = new Students(data);
        newStudent.save().then((student)=>{
            console.log('Student Created with matricule: ', student.matricule);
        })
    } catch (error) {
        console.log(error);
    }
}

async function getStudent(id){
    try {
        const student = await Students.findOne({
                matricule:id
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
    await Students.updateOne(
        {matricule:matricule}
    , {
        data
    })
}

module.exports = {addStudent, getStudent, updateStudent}

