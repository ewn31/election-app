const {Schema, createConnection} = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`

const candidateSchema = new Schema({
    matricule:String,
    name:String,
    election_id:String,
    election_name:String,
    position:String,
    vote_count:{type:Number, default:0}
})

/*try {
    var conn = createConnection(uriMongoose)
} catch (error) {
    console.log(error)
}finally{
    conn.close();
}
if(conn)var candidates = conn.model('Candidate', candidateSchema, 'Candidates')*/

module.exports = candidateSchema;