const mongoose = require('mongoose')
//const dbConnect = require('../connnectMongo')
const dotenv = require('dotenv');

dotenv.config();

const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


const studentSchema = new Schema({
    matricule: {type:String, ObjectId },
    name: String,
    faculty: String,
    department: String,
    hashed_password: Buffer
})

/*try {
    var conn = mongoose.createConnection(uriMongoose)
    console.log('Connecting to database')
    conn.on('connected', ()=>{
        console.log('Connected Successfully');
    })
} catch (error) {
    console.log(error)
}finally{
    conn.close();
}

if(conn)var student =  conn.model('Student', studentSchema, 'Students')*/

module.exports = studentSchema


