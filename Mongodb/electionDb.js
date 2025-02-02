const {Students, Candidates, Elections, Votes} = require('./connnectMongo')

async function getElections() {
    const current_date = Date.now();
    try {
        const elections = await Elections.find({ end_date:{$gte: current_date}
    
            }).exec();
            return elections
    } catch (error) {
        console.log(error)
    }
}

async function getStudentElections(id){
    const current_date = Date.now();
    try {
        const student =  await Students.findOne({
                matricule:id
        }).exec()
        const elections = await Elections.find({
                end_date:{
                    $gte: current_date,
                },
                start_date:{
                    $lte: current_date
                },
                $or: [{scope:'School'}, {scope:student.faculty}, {scope:student.department}]
            })

        const votedAlready =  await Votes.find({
            matricule:id
        })
        if(votedAlready.length === 0) return elections;
        let VotedAlreadyId = votedAlready.map(e=>e.election_id)
        let validElections = elections.filter(e=>!(VotedAlreadyId.includes((e._id).toString())))
        return validElections
    } catch (error) {
        console.log(error)
    }
}

async function createElection(data) {
    try {
        const elections =  new Elections(data)
        elections.save().then((e)=>{
            console.log('Election created: ', e.name )
        }
        );
        
    } catch (error) {
        console.log(error)
    }
}

async function getElection(id){
    try {
        const election =  await Elections.findOne({
                _id:id
        })
            return election
    } catch (error) {
        console.log(error);
    }
}

async function updateElection(id, data){
    try {
        await Elections.update({_id:id},data)
    } catch (error) {
        console.log(error)
    }
}

async function deleteElection(id) {
    try {
        await Candidates.deleteOne({
                election_id:id
        })
        await Elections.deleteOne({
                _id:id
        })
    } catch (error) {
        console.log(error);
    }
}

async function addCandidate(data) {
    console.log("in addCandidate data:", data);
    try {
        const candidate = new Candidates(data)
        candidate.save().then((c)=>{
            console.log(`Added ${c.name} as a candidate for ${c.position}  in the ${c.election_name}`)
        })
    } catch (error) {
       console.log(error) 
    }
}

async function getCandidates(id) {
    try {
        const candidates = await Candidates.find({
                election_id:id
        })
        console.log(candidates)
        return candidates;
    } catch (error) {
        console.log(error)
    }
}

async function updateCandidate(id, data) {
    try {
        await Candidates.updateOne({
                election_id:id,
                matricule: data.matricule
        },{$set:data}
        )
    } catch (error) {
        console.log(error);
    }
}


async function updateCandidateVote(id, data) {
    console.log(data, id)
    for(let position in data){
        let name = data[position];
        try {
            await Candidates.updateOne({
                    election_id: id,
                    name:name,
                    position:position
            }, {$inc:{vote_count:1}});
        } catch (error) {
            console.log(error);
        }
    }
    
}

async function registerVote(matricule, id){
    const voteTime = Date.now()
    try {
        const vote = new Votes({election_id:id, matricule, vote_time:voteTime})
        vote.save().then((v)=>{
            console.log(`${v.matricule} has voted`)
        })
    } catch (error) {
        console.log(error)
    }
    
}

async function deleteCandidate(id, matricule) {
    try {
        await Candidates.deleteOne({
                election_id:id,
                matricule:matricule,
            })
    } catch (error) {
        console.log(error);
    }
}

async function getElectionResults(id){
    try {
        const candidates = await Candidates.find({
                election_id:id
        })
        return candidates
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createElection, getStudentElections, getElection,getElections, getElectionResults, updateCandidateVote, updateElection, deleteElection, addCandidate, getCandidates, updateCandidate, deleteCandidate, registerVote}
