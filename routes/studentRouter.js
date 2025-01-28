const express = require('express');
const {getStudentElections, getCandidates, updateCandidateVote, registerVote} = require('../Database/electionDB')
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

studentRouter.post('/', (req, res)=>{
    const {matricule, password} = req.body
    const hashed_password = hashPassword(password)
    try {
        (async ()=>{
            const data = await getStudent(matricule);
            if(!data){
                return res.render("login",{title:"login", message:"incorrect username or password", feedback:""})
            }
            console.log(data, hashed_password);
            if(data.hashed_password !== hashed_password){
                return res.render("login",{title:"login", message:"incorrect username or password", feedback:""})
            }
            const user = {
                user: req.body.username,
                isAdmin: false,
                password: req.body.password
            }
            const token =  generateToken(user);
            res.cookie("token", token, {httpOnly: true});
            res.setHeader('Authorization','Bearer '+ token);
            res.render('student',{title:'student', matricule:mat, election:{}, data:{}, feedback:'' })
            
        })()
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
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

async  function verifyIfEligibleElection(res, mat, id){
    const elections = await getStudentElections(mat)
    const election_ids = elections.map(e => e.id)
        try {
            if(!(election_ids.includes(parseInt(id)))) res.status(401).send('forbidden')
        } catch (error) {
            console.log(error)
            res.status(401).send('forbidden')
        }
}

studentRouter.get('/:matricule/vote/:id', (req, res)=>{
    const mat = req.params.matricule
    const election_id = req.params.id
    try {
        (async () => {
            await verifyIfEligibleElection(res, mat, election_id)
            const candidates = await getCandidates(election_id)
            try {
                if(candidates.length !== 0){
                    var positions = {}
                    candidates.forEach((e)=>{
                        if(Object.keys(candidates).includes(e.position)){
                            positions[e.position].push({id:e.id, name:e.name, matricule:e.matricule})
                        }else{
                            positions[e.position] = []
                            positions[e.position].push({id:e.id, name:e.name})
                        }
                    })
                }else{
                    var positions = {}
                }
                console.log(positions)
            } catch (error) {
              console.log(error)   
            }
            res.render('vote', {title:`Vote`,matricule:mat, id:election_id, candidates:positions})
        })()
    } catch (error) {
        console.log(error)
        res.send('Error')
    }
})

studentRouter.post('/:matricule/vote/:id', (req, res)=>{
    const mat = req.params.matricule;
    const election_id = req.params.id
    try {
        (async () => {
            await verifyIfEligibleElection(res, mat, election_id)
            await updateCandidateVote(req.params.id, req.body)
            await registerVote(mat, election_id);
            res.send('Vote registered')
        })()
    } catch (error) {
        console.log(error)
        res.send('Voting failed')
    }
})

module.exports = studentRouter;
