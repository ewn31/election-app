const {Admins} = require('./connnectMongo')
const hashedPassword = require('../lib/hash');




async function addAdmin(data){
    const password = data.password
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;
    const admin = new Admins({username:data[username], hashed_password:data[hashed_password]});
    admin.save().then(()=>{
        console.log('Admin:', data[username], 'created')
    });
}

async function getAdmin(user_name) {
    console.log('Getting Admin')
    try {
        const admin = await Admins.findOne({
            username: user_name
        })
        return {id:`${admin._id}`, username:`${admin.username}`, hashed_password:`${admin.hashed_password}`};
    } catch (error) {
       console.log(error);
    }
}

async function updateAdmin(id,data){
    const password = data.password
    const hashed_password = hashedPassword(password);
    data['hashed_password'] = hashed_password;
    try {
        await Admins.replaceOne({_id: id},
            {
            username:data.username,
            hashed_password: data.hashed_password
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getAdmin, addAdmin, updateAdmin}