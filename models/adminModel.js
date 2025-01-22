const sequelize = require('../Database/connectDb');
const Sequelize = require('sequelize');

class Admin extends Sequelize.Model{
    otherPublicField
}

Admin.init({
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },
    username:{
        type:Sequelize.STRING,
        defaultValue: 'ADMIN',
        allowNull: false,
    },
    hashed_password:{
        type: Sequelize.BLOB,
    }
},
{
    sequelize,
    modelName: 'Admin',
})

async function syncModel() {
    await sequelize.sync();
}

(async () => {
    await syncModel();
})()

module.exports = Admin;