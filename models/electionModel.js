const sequelize = require('../Database/connectDb');
const Sequelize =  require('sequelize');

class Election extends Sequelize.Model{
    otherPublicField;
}

Election.init({
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type:{
        type: Sequelize.ENUM('GENERAL', 'FACULTY', 'DEPARTMENT'),
    },
    scope:{
        type: Sequelize.STRING,
    },
    start_date:{
        type: Sequelize.DATE
    },

    end_date:{
        type: Sequelize.DATE
    },
},
{
    sequelize,
    modelName:'Election'
}
)


class Candidate extends Sequelize.Model{
    otherPublicField
}

Candidate.init({
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique:true,
        primaryKey: true,
        autoIncrement: true,
    },
    matricule:{
        type: Sequelize.STRING(8),
        allowNull:false,
        references:{
            model: 'Students',
            key: 'matricule'
        },
        unique:true,
    },
    election_id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
            model: 'Elections',
            key: 'id',
        },
        unique:true
    },
    election_name:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    position:{
        type: Sequelize.STRING,
        allowNull:false
    },
    vote_count:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},
{
    sequelize,
    modelName: 'Candidate'
})

class Vote extends Sequelize.Model{
    otherPublicField
}

Vote.init({
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        unique:true,
    },
    election_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: 'Elections',
            key: "id",
        },

    },
    matricule:{
        type: Sequelize.STRING(8),
        allowNull: false,
        references:{
            model: 'Students',
            key: 'matricule'
        }
    },
    vote_time:{
        type:Sequelize.DATE,
    },
},
{
    sequelize,
    modelName:'Vote'
}
)

async function syncModel() {
    await sequelize.sync();

}

(async () => {
    await syncModel();
})

module.exports = {Election, Candidate, Vote};