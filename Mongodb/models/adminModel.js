const {Schema, createConnection} = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`


const adminSchema = new Schema({
    username:String,
    hashed_password:Buffer
})

/*try {
    var conn = createConnection(uriMongoose)
} catch (error) {
    console.log(error)
}finally{
    conn.close();
}

if(conn){
    var admins = conn.model('Admin', adminSchema, 'Admins')
}*/


module.exports = adminSchema;