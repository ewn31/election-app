const express = require('express');
const {generateToken} =  require('../lib/token')
//const { getElection, createElection, getElections, updateElection, deleteElection, getCandidates, addCandidate, updateCandidate, deleteCandidate, getElectionResults } = require('../Database/electionDB');
const { getElection, createElection, getElections, updateElection, deleteElection, getCandidates, addCandidate, updateCandidate, deleteCandidate, getElectionResults } = require('../Mongodb/electionDb');
//const {addAdmin, updateAdmin, getAdmin} = require('../Database/adminDb');
const {addAdmin, updateAdmin, getAdmin} = require('../Mongodb/adminDb');
const hashPassword = require('../lib/hash');

const adminRouter = express.Router();

adminRouter.post('/', (req, res)=>{
    const {username, password} = req.body
    const hashed_password = hashPassword(password)
    try {
        (async ()=>{
            const data = await getAdmin(username);
            if(!data){
                return res.render("admin",{title:"login", message:"incorrect username or password", feedback:""})
            }
            console.log(data, hashed_password);
            if(data.hashed_password !== hashed_password){
                return res.render("admin",{title:"login", message:"incorrect username or password", feedback:""})
            }
            const user = {
                user: req.body.username,
                isAdmin: true,
                password: req.body.password
            }
            const token =  generateToken(user);
            res.cookie("token", token, {httpOnly: true});
            res.setHeader('Authorization','Bearer '+ token);
            res.redirect('/admin/home');
            
        })()
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})
adminRouter.get('/home',(req, res)=>{
    try {
        res.render('elections', {title:'Admin', feedback:'Welcome'})
    } catch (error) {
        console.log(error);
    }
})

adminRouter.post('/add', (req, res)=>{
    try {
        (async () => {
           await addAdmin(req.body)
           res.send('Admin added');
        })()
    } catch (error) {
        console.log(error);
    }
})

adminRouter.put('/update', (req, res)=>{
    try {
        (async () => {
           await updateAdmin(id, data);
           res.status(201).send('Admin updated succesfully');
        })()
    } catch (error) {
        console.log(error);
    }
})

adminRouter.get('/get/:username', (req, res)=>{
    try {
        (async () => {
           const admin = await getAdmin(req.params.username);
           res.json(admin); 
        })()
    } catch (error) {
        console.log(error);
    }
})

adminRouter.post('/election', (req, res)=>{
    (async () => {
        try {
            await createElection(req.body);
            res.send('Election Created');
        } catch (error) {
            console.log(error);
        }
    })()
})

adminRouter.get("/elections", (req, res)=>{
    (async () => {
        try {
            const elections = await getElections();
            res.json(elections)
        } catch (error) {
            console.log(error);
        }
    })()
})

adminRouter.get('/election/:id', (req, res)=>{
    const id = req.params.id;
    try {
        (async () => {
            const election = await getElection(id);
            res.json(election);
        })() 
    } catch (error) {
        console.log(error);
    }
})

adminRouter.get('/election/:id/modify', (req, res)=>{
    try {
        const [election] = getElection(req.params.id)
        res.render('modifyElection', {title:'modify election', election})
    } catch (error) {
        console.log(error)
    }
})

adminRouter.put('/election/:id', (req, res)=>{
    const id = req.params.id
    const data = req.body
    try {
        (async () => {
            await updateElection(id, data);
            res.send('election updated')
        })();
    } catch (error) {
        console.log(error)
        res.send('election update failed')
    }
})

adminRouter.delete('/election/:id', (req, res)=>{
    const id = req.params.id;
    try {
        (async () => {
            await deleteElection(id);
            res.send('election deleted succesfully');
        })()
    } catch (error) {
        console.log(error);
        res.send('election delete failed');
    }
})

adminRouter.get('/election/:id/addCandidate', (req, res)=>{
    try {
        (async () => {
           const election = await getElection(req.params.id);
           if(election)var {_id, name} = election
           else{var _id = "", name = ""}
           console.log(election)
           res.render('addCandidates',{title:'Candidates', election_name:name, election_id:_id, feedback:"Add Candidates"}) 
        })()
    } catch (error) {
        console.log(error)
    }
})

adminRouter.get("/election/:id/candidates", (req, res)=>{
    try {
        (async () => {
           const candidates = await getCandidates(req.params.id);
           if(candidates.length !== 0){
            console.log(candidates)
            var positions = {}
            candidates.forEach((e)=>{
                if(Object.keys(positions).includes(e.position)){
                    positions[e.position].push({id:e.id, name:e.name, matricule:e.matricule})
                }else{
                    positions[e.position] = []
                    positions[e.position].push({name:e.name, votes:e.vote_count})
                }
            })
        }else{
            var positions = {}
        }
           res.json(positions); 
        })()
    } catch (error) {
        console.log(error);
        res.send('error');
    }
})

adminRouter.post("/election/:id/candidate", (req, res)=>{
    try {
        (async () => {
            await addCandidate(req.body)
            res.send("Candidate added");
        })()
    } catch (error) {
        console.log(error)
        res.send("failed to add candidate");
    }
})

adminRouter.put("/elections/:id/candidate", (req, res)=>{
    try {
        (async () => {
            await updateCandidate(req.params.id, req.body);
            res.send("candidate updated")
        })()
    } catch (error) {
        console.log(error);
    }
})

adminRouter.delete("/elections/:id/candidate/:matricule", (req, res)=>{
    try {
       (async () => {
        await deleteCandidate(req.params.id, req.params.matricule);
        res.send('Candidate succesfully deleted');
       })()
    } catch (error) {
        console.log(error);
    }
})
adminRouter.get('/elections/:electionId/status', (req, res)=>{
    const electionId = req.params.electionId;
    try {
        (async () => {
           const candidates = await getElectionResults(electionId)
           if(candidates.length !== 0){
            var positions = {}
            candidates.forEach((e)=>{
                if(Object.keys(positions).includes(e.position)){
                    positions[e.position].push({name:e.name, votes:e.vote_count })
                }else{
                    positions[e.position] = []
                    positions[e.position].push({name:e.name, votes:e.vote_count})
                }
            })
        }else{
            var positions = {}
        }
        console.log(positions)
        res.render('electionStatus', {title:'election status', positions})
        })()
    } catch (error) {
        console.log(error)
    }
})
module.exports = adminRouter;