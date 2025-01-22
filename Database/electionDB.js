const { Op } = require('sequelize');
const {Election, Candidate} = require ('../models/electionModel');

async function getElections() {
    const current_date = Date.now();
    try {
        const elections = await Election.findAll({
            where: {
                start_date:{
                    [Op.gt]: current_date,
                }
            },
            })
            return elections
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

module.exports = {createElection, getElections, getElection, updateElection, deleteElection, addCandidate, getCandidates, updateCandidate, deleteCandidate,}