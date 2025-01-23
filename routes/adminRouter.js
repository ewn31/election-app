const express = require('express');
const { getElection, createElection, getElections, updateElection, deleteElection, getCandidates, addCandidate, updateCandidate, deleteCandidate } = require('../Database/electionDB');
const {addAdmin, updateAdmin, getAdmin} = require('../Database/adminDb');

const adminRouter = express.Router();

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

adminRouter.get("/election/:id/candidates", (req, res)=>{
    try {
        (async () => {
           const candidates = await getCandidates(req.params.id);
           res.json(candidates); 
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
module.exports = adminRouter;