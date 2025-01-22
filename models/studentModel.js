const sequelize = require('../Database/connectDb');
const Sequelize = require('sequelize');

class Student extends Sequelize.Model{}

Student.init({

    matricule:{
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING(60),
        allowNull: false
    },
    faculty:{
        type: Sequelize.STRING(60),
        allowNull: false
    },
    department:{
        type: Sequelize.STRING(60),
        allowNull: false
    },
    hashed_password:{
        type: Sequelize.STRING(64),
    }
},
{
    sequelize,
    modelName:'Student',

 },
)
async function syncModel (){
    try {
        await sequelize.sync();
    } catch (error) {
        console.log(error);
    }
        
}

(async () => {
    await syncModel();
})()

module.exports = Student;

