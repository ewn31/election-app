const { Op } = require('sequelize');
const {Election, Candidate, Vote} = require ('../models/electionModel');
const Student = require('../models/studentModel');

async function getElections() {
    const current_date = Date.now();
    try {
        const elections = await Election.findAll({
            where: {
                end_date:{
                    [Op.gte]: current_date,
                }
            },
            })
            return elections
    } catch (error) {
        console.log(error)
    }
}

async function getStudentElections(id){
    const current_date = Date.now();
    try {
        const [student] =  await Student.findAll({
            where:{
                matricule:id
            }
        })
        const elections = await Election.findAll({
            where: {
                end_date:{
                    [Op.gte]: current_date,
                },
                start_date:{
                    [Op.lte]: current_date
                },
                scope:{
                    [Op.or]: ['School', student.faculty, student.department ]
                }
            },
            })

        const votedAlready =  await Vote.findAll({
            where:{
                matricule:id
            }
        })
        if(votedAlready.length === 0) return elections;
        let VotedAlreadyId = votedAlready.map(e=>e.election_id)
        let validElections = elections.filter(e=>!(VotedAlreadyId.includes(e.id)))
        return validElections
    } catch (error) {
        console.log(error)
    }
}

async function createElection(data) {
    try {
        
        await Election.create(data);
        
    } catch (error) {
        console.log(error)
    }
}

async function getElection(id){
    try {
        const election =  await Election.findAll({
            where:{
                id:id
            }
        })
            return election
    } catch (error) {
        console.log(error);
    }
}

async function updateElection(id, data){
    try {
        await Election.update(data,
                {
                    where:{
                        id:id
                    }
                })
    } catch (error) {
        console.log(error)
    }
}

async function deleteElection(id) {
    try {
        await Election.destroy({
            where:{
                id:id
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function addCandidate(data) {
    console.log("in addCandidate data:", data);
    try {
        await Candidate.create(data);
    } catch (error) {
       console.log(error) 
    }
}

async function getCandidates(id) {
    try {
        const candidates = await Candidate.findAll({
            where:{
                election_id:id
            }
        })
        return candidates;
    } catch (error) {
        console.log(error)
    }
}

async function updateCandidate(id, data) {
    try {
        await Candidate.update(data,{
            where:{
                election_id:id,
                matricule: data.matricule,
            }
        }
        )
    } catch (error) {
        console.log(error);
    }
}


async function updateCandidateVote(id, data) {
    console.log(data)
    for(let position in data){
        let name = data[position];
        try {
            await Candidate.increment('vote_count', {
                by: 1,
                where: {
                    election_id: id,
                    name:name,
                    position:position
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    
}

async function registerVote(matricule, id){
    const voteTime = Date.now()
    try {
        await Vote.create({election_id:id, matricule, vote_time:voteTime})
    } catch (error) {
        console.log(error)
    }
    
}

async function deleteCandidate(id, matricule) {
    try {
        await Candidate.destroy({
            where:{
                election_id:id,
                matricule:matricule,
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function getElectionResults(id){
    try {
        const candidates = await Candidate.findAll({
            where:{
                election_id:id
            }
        })
        return candidates
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createElection, getStudentElections, getElection,getElections, getElectionResults, updateCandidateVote, updateElection, deleteElection, addCandidate, getCandidates, updateCandidate, deleteCandidate, registerVote}