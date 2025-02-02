const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const adminSchema = require('./models/adminModel')
const candidateSchema = require('./models/candidateModel')
const electionSchema = require('./models/electionModel')
const studentSchema = require('./models/studentModel')
const voteSchema = require('./models/voteModel')

dotenv.config()

const uri = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/?retryWrites=true&w=majority&appName=ewnCluster`
const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`
const client = new MongoClient(uri)

async function connectDb(){
    try {
        console.log('Connecting to mongodb')
        await client.connect()
        console.log('Getting Database: VoteApp')
        const Db = await client.db('VoteApp')
        return Db
    } catch (error) {
        console.log(error)   
    }
}

//connectDb();

mongoose.connect(uriMongoose).then(()=>{
    console.log('Db Connected')
}).catch((e)=>{
    console.log('Db connection failed', e);
})


const Admins = mongoose.model('Admin', adminSchema, 'Admins')
const Students = mongoose.model('Student', studentSchema, 'Students')
const Candidates = mongoose.model('Candidate', candidateSchema, 'Candidates')
const Elections = mongoose.model('Election', electionSchema, 'Elections')
const Votes = mongoose.model('Vote', voteSchema, 'Votes')


module.exports = {Admins, Students, Candidates, Elections, Votes}

