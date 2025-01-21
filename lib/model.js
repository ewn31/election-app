const sequelize = require('sequelize');
const dotenv = require('dotenv');

class Student extends sequelize.Model{}

Student.init({

    matricule:{
        type: sequelize.STRING(8),
        allowNull: false
    },
    name:{
        type: sequelize.STRING(60),
        allowNull: false
    },
    faculty:{
        type: sequelize.STRING(60),
        allowNull: false
    },
    depertment:{
        type: sequelize.STRING(60),
        allowNull: false
    },
    hashed_password:{
        type: sequelize.STRING(64),
    }
},
{
    sequelize,
    modelName:Student,

 },
)

class Elections extends sequelize.Model{
    otherPublicField;
}

Elections.init({
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: sequelize.STRING,
        allowNull: false
    },
    type:{
        type: sequelize.ENUM('GENERAL', 'FACULTY', 'DEPARTMENT'),
    },
    scope:{
        type: sequelize.STRING,
    },
    start_date:{
        type: sequelize.DATE
    },

    end_date:{
        type: sequelize.DATE
    },
},
{
    sequelize,
    modelName:Elections
}
)

class Candidate {
    otherPublicField
}

Candidates.init({
    id:{
        type: sequelize.INTEGER,
        allowNull: false,
        unique:true,
        primaryKey: true,
        autoIncrement: true,
    },
    matricule:{
        type: sequelize.STRING(8),
        allowNull:false,
        references:{
            model: Student,
            key: 'matricule'
        },
        unique:true,
    },
    election_id:{
        type: sequelize.INTEGER,
        allowNull:false,
        references:{
            model: Elections,
            key: 'id',
        },
        unique:true
    },
    election_name:{
        type: sequelize.STRING,
        allowNull:false,
    },
    position:{
        type: sequelize.STRING,
        allowNull:false
    },
    vote_count:{
        type: sequelize.INTEGER,
        defaultValue: 0
    }
},
{
    sequelize,
    modelName: Candidate
})

class Vote extends sequelize.Model{
    otherPublicField
}

Vote.init({
    id:{
        type: sequelize.INTEGER,
        primaryKey:true,
        unique:true,
    },
    election_id:{
        type: sequelize.INTEGER,
        allowNull: false,
        references:{
            model: Elections,
            key: "id",
        },

    },
    matricule:{
        type: sequelize.STRING(8),
        allowNull: false,
        references:{
            model: Student,
            key: 'matricule'
        }
    },
    vote_time:{
        type:sequelize.DATE,
    },
},
{
    sequelize,
    modelName:Vote
}
)

class Admin extends sequelize.Model{
    otherPublicField
}

Admin.init({
    id:{
        type:sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },
    username:{
        type:sequelize.STRING,
        defaultValue: 'ADMIN',
        allowNull: false,
    },
    hashed_password:{
        type: sequelize.BLOB,
    }
},
{
    sequelize,
    modelName: Admin,
})