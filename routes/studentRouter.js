const express = require('express');
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
        const student = await getStudent(matricule)
        res.json(student);
    })()
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

module.exports = studentRouter;
