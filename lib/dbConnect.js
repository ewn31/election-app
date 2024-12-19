const dotenv = require('dotenv');
const mysqlPromise = require('mysql2/promise');
const hashPassword = require('../lib/hash')



dotenv.config();

const db = mysqlPromise.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

 async function getCity(){
    try {
        const [res] = await db.query(
            'SELECT * FROM `city` WHERE name = "Douala";'
        )
        return res;
    } catch (error) {
        throw new Error("DB error", { cause: error})
    }
}
async function addStudent(data){
    console.log(data);
    const matricule = data.matricule;
    const name = data.name;
    const faculty =  data.faculty;
    const dpt = data.department;
    const password = data.password;
    const hash = hashPassword(password);

    console.log(`SHA-256 hash: ${hash}`);
    try {
        await db.execute(
            'INSERT INTO `STUDENTS` (MATRICULE, NAME, FACULTY, DEPARTMENT, HASHED_PASSWORD) VALUES(?, ?, ?, ?, ?);',
            [matricule, name, faculty, dpt, hash] 
        )
    } catch (error) {
        throw new Error('DB Error', {cause: error})
    }
}

async function verifyUser(data){
    const mat = data.matricule;
    const pw = data.password;
    const hash = hashPassword(pw)
    console.log("This is the data",data)
    console.log(hash)
    try {
        const result = await db.query(
            'SELECT HASHED_PASSWORD FROM `STUDENTS` WHERE MATRICULE = ?',
            [mat]
        )
        console.log(result)
        if(result[0].length !== 0){
            const hashedPasswordBinary = result[0][0].HASHED_PASSWORD;
            const hashedPasswordHex = Buffer.from(hashedPasswordBinary).toString();
            if(hash === hashedPasswordHex)return true;
        }
        return false;
    } catch (error) {
        console.log(error)
    }
}


async function verifyAdmin(data){
    const un = data.username;
    const pw = data.password;
    const hash = hashPassword(pw)
    console.log(hash)
    try {
        const result = await db.query(
            'SELECT HASHED_PASSWORD FROM `ADMIN` WHERE USERNAME = ?',
            [un]
        )
        if(result[0].length !== 0){
            const hashedPasswordBinary = result[0][0].HASHED_PASSWORD;
            const hashedPasswordHex = Buffer.from(hashedPasswordBinary).toString();
            console.log(hashedPasswordHex);
            if(hash === hashedPasswordHex)return true;
        }
        return false;
    } catch (error) {
        console.log(error)
    }
}

async function addElection(data) {
    const n = (data.name).replaceAll(" ","-");
    const type = data.type;
    const scope = data.scope || null;
    const startDate = data.startDate;
    const endDate = data.endDate;
    try {
        await db.execute('INSERT INTO `ELECTIONS` (NAME, TYPE, SCOPE, START_DATE, END_DATE) VALUES(?, ?, ?, ?, ?);',
            [n, type, scope, startDate, endDate]
        )
    } catch (error) {
        console.log(error)
    }
}

async function getElections() {
    try {
        const result = await db.query('SELECT * FROM `ELECTIONS` WHERE END_DATE > CURDATE() ORDER BY END_DATE DESC;')
        console.log(result);  
        return result[0];
    } catch (error) {
        
    }
}

async function getStudentElections(data) {
    const faculty = data.FACULTY;
    const department = data.DEPARTMENT
    const mat =  data.MATRICULE
    console.log(faculty, department, mat)
    try {
        const result = await db.query("SELECT * FROM `ELECTIONS` WHERE (END_DATE > CURDATE()) AND (SCOPE = ? OR SCOPE = ? OR SCOPE = 'School') AND (ID NOT IN (SELECT ELECTION_ID FROM `VOTES` WHERE MATRICULE = ?)) ORDER BY END_DATE DESC;",
            [faculty, department, mat]
        )
        console.log(result);  
        return result[0];
    } catch (error) {
        console.log(error)
    }
}

async function addCandidate(data) {
    const mat = data.matricule;
    const n = data.name;
    const elecId = data.election_id
    const elecName = data.election_name
    const pst = data.position
    console.log(pst);

    try {
        await db.execute('INSERT INTO `CANDIDATES`(MATRICULE, NAME, ELECTION_ID, ELECTION_NAME, POSITION) VALUES (?, ?, ?, ?, ?);',
            [mat, n, elecId, elecName, pst]
        )
    } catch (error) {
        console.log(error)
    }
}

async function getStudent(data) {
    const mat = data;
    try {
        result = await db.query('SELECT MATRICULE, NAME, FACULTY, DEPARTMENT FROM `STUDENTS` WHERE MATRICULE = ?;',
            [mat]
        )
        console.log(result);
        return result[0];
    } catch (error) {
        console.log("DB error",{cause:error})
    }
    
}
async function getCandidates (id){
   try {
        const results = await db.query("SELECT * FROM `CANDIDATES` WHERE ELECTION_ID = ?;",
            [id]
        )  
        console.log(results);
        let candidates = {}
        results[0].forEach((value)=>{
            if(Object.keys(candidates).includes(value.POSITION)){
                candidates[value.POSITION].push(value.NAME)
            }else{
                candidates[value.POSITION] = [];
                candidates[value.POSITION].push(value.NAME);
            }
        })
        return candidates;
    } catch (error) {
        console.log(error);
    }
}
async function voteCandidates(id, data){
    const election_id = id;
    console.log(data, id);
    for(const position in data){
        console.log(position, data[position]);
        try {
            await db.execute("UPDATE `CANDIDATES` SET VOTE_COUNT = VOTE_COUNT + 1 WHERE ELECTION_ID = ? AND POSITION = ? AND NAME = ?;",
             [election_id, position, data[position]]
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
async function getElectionStatus(id) {
    try {
        const result = await db.query("select position, name, vote_count from candidates where election_id = ?;",
            [id]
        )
        row = result[0]
        console.log(row);
        const electionStatus = {}
        for (const item of row){
            if(Object.keys(electionStatus).includes(item.position)){
                electionStatus[item.position].push({n:item.name, count:item.vote_count});
            }else{
                electionStatus[item.position] = [];
                electionStatus[item.position].push({n:item.name, count:item.vote_count});
            }
        }
        console.log(electionStatus);
        return electionStatus;
    } catch (error) {
        console.log(error)
    }
}
async function registerVote(id, matricule) {
    console.log(id, matricule);
    try {
        await db.execute("INSERT INTO `VOTES` (ELECTION_ID, MATRICULE, VOTE_TIME) VALUES (?, ?, CURDATE());",
            [id, matricule]
        )
    } catch (error) {
        console.log(error);
    }
}
async function getHistory() {
    try {
        const result = await db.query("SELECT * FROM `ELECTIONS`;");
        const history = result[0];
        return {status:"Success", history};
    } catch (error) {
        console.log(error)
        return {status:"Failed to retrieve history", history:[]}
    }
}
module.exports = {getCity, addStudent, verifyUser, verifyAdmin, addElection, getElections, addCandidate, getStudent, getStudentElections, getCandidates, voteCandidates, getElectionStatus, registerVote, getHistory};
