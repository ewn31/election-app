const {Schema, createConnection} = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const uriMongoose = `${process.env.MONGODBPROTOCOL}//${process.env.MONGODBUSER}:${process.env.MONGODBPWD}@${process.env.MONGODBHOST}/VoteApp?retryWrites=true&w=majority&appName=ewnCluster`

const electionSchema =  new Schema({
    name: String,
    type: String,
    scope: String,
    start_date: Date,
    end_date: Date
})

/*try {
    var conn = createConnection(uriMongoose)
} catch (error) {
    console.log(error)
}finally{
    conn.close();
}

if(conn)var elections = conn.model('Election', electionSchema, 'Elections');*/

module.exports = electionSchema;
