const express = require('express');
const {getStudentElections, getCandidates, updateCandidateVote} = require('../Database/electionDB')
const {getStudent, updateStudent, addStudent} = require('../Database/studentDb');

const studentRouter = express.Router();

studentRouter.get('/', (req, res)=>{
    res.send('student /');
})

studentRouter.get('/test', (req, res)=>{
    res.send('student route');
})

studentRouter.get('/:id', (req, res)=>{
    const matricule = req.params.id;
    (async () => {
        const [student] = await getStudent(matricule)
        res.json(student);
    })()
})

studentRouter.get('/:id/elections', (req,res)=>{
    try {
        (async () => {
           const elections =  await getStudentElections(req.params.id)
           res.json(elections) 
        })()
    } catch (error) {
        console.log(error)
        res.send('Error');
    }
})

studentRouter.post('/', (req, res)=>{
    const data = req.body
    console.log(data);
    try {
        (async () => {
            await addStudent(data);
            res.send('student added succesfully');
        })();
    } catch (error) {
        console.log(error);
        res.send('failed to add student')
    }
})

studentRouter.put('/:id', (req, res)=>{
    try {
        (async () =>{
            await updateStudent(req.params.id, req.body)
            res.status(201).send(`${req.params.id} profile updated`);
        })()
    } catch (error) {
        console.log(error);
        res.status(401).send('Unable to update profile');
    }
})

studentRouter.get('/:matricule/vote/:id', (req, res)=>{
    try {
        (async () => {
            const candidates = await getCandidates(req.params.id)
            res.json(candidates)
        })()
    } catch (error) {
        console.log(error)
        res.send('Error')
    }
})

studentRouter.post('/:matricule/vote/:id', (res, req)=>{
    try {
        (async () => {
            await updateCandidateVote(req.params.id, req.body)
            res.send('Vote registered')
        })()
    } catch (error) {
        console.log(error)
        res.send('Voting failed')
    }
})

module.exports = studentRouter;
