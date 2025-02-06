const express = require('express');
//const {getStudentElections, getCandidates, updateCandidateVote, registerVote} = require('../Database/electionDB')
//const {getStudent, updateStudent, addStudent} = require('../Database/studentDb');
const {getStudentElections, getCandidates, updateCandidateVote, registerVote, getVotingHistory} = require('../Mongodb/electionDb')
const {getStudent, updateStudent, addStudent} = require('../Mongodb/studentDb');
const hashPassword = require('../lib/hash');
const {generateToken} = require('../lib/token')
const studentRouter = express.Router();

studentRouter.get('/:matricule/home', (req, res)=>{
    try {
        const matricule = req.params.matricule
        res.render('student',{title:'student', matricule, election:{}, data:{}, feedback:'Welcome' })
    } catch (error) {
        console.log(error)
    }
})

studentRouter.get('/', (req, res)=>{
    res.render('loginStudent', {title:'Login',message:'', feedback:""})
})

studentRouter.get('/:id', (req, res)=>{
    const matricule = req.params.id;
    (async () => {
        const student = await getStudent(matricule)
        res.json(student);
    })()
})
studentRouter.post('/register', (req, res)=>{
    const data = req.body;
    try {
        (async () => {
            await addStudent(data);  
        })()
        res.render('loginStudent', {title:"Login", message:"", feedback:"Registration Complete"})
    } catch (error) {
        console.log(error)
        res.render('loginStudent', {title:"Login", message:"", feedback:"Registration failed"})
    }
})
studentRouter.post('/', (req, res)=>{
    const {matricule, password} = req.body
    const hashed_password = hashPassword(password)
    try {
        (async ()=>{
            const data = await getStudent(matricule);
            if(!data){
                return res.render("loginStudent",{title:"login", message:"incorrect username or password", feedback:""})
            }
            console.log((data.hashed_password).toString(), hashed_password, 'in student Route');
            if((data.hashed_password).toString() !== hashed_password){
                return res.render("loginStudent",{title:"login", message:"incorrect username or password", feedback:""})
            }
            const user = {
                user: req.body.matricule,
                isAdmin: false,
                password: req.body.password
            }
            const token =  generateToken(user);
            res.cookie("token", token, {httpOnly: true});
            res.setHeader('Authorization','Bearer '+ token);
            res.redirect(`/student/${matricule}/home`)
            
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
    const election_ids = elections.map(e => (e._id).toString())
    
        try {
            if(!(election_ids.includes(id)))return res.status(401).send('forbidden')
        } catch (error) {
            console.log(error)
            return res.status(401).send('forbidden')
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
                        if(Object.keys(positions).includes(e.position)){
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
            console.log('in vote route,', req.body)
            await updateCandidateVote(req.params.id, req.body)
            await registerVote(mat, election_id);
            //res.send('Vote registered')
            res.render('student',{title:'student', matricule:mat, election:{}, data:{}, feedback:'Vote Registered' })
        })()
    } catch (error) {
        console.log(error)
        res.send('Voting failed')
    }
})

studentRouter.get('/:matricule/history', (req, res)=>{
    const matricule =  req.params.matricule;
    try {
        (async () => {
            const history = await getVotingHistory(matricule)
            console.log('In student routes getting history: ', history);
            res.json(history); 
         })()
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error');
    }
})

module.exports = studentRouter;
