const {Schema, createConnection} = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`


const voteSchema = new Schema({
    election_id: String,
    matricule: String,
    vote_time: {
        type:Date,
        default: Date.now()
    }
})

/*try {
    var conn = createConnection(uriMongoose)
} catch (error) {
    console.log(error)
}finally{
    conn.close();
}

if(conn)var votes =  conn.model('Vote', voteSchema, 'Votes')*/

module.exports = voteSchema;