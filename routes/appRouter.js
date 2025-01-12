const express = require("express");
const {addStudent, updateStudent, verifyUser, verifyAdmin, addElection, getElections, getElection, addCandidate, getStudent, getStudentElections, getCandidates, voteCandidates, getElectionStatus, registerVote, getHistory, updateElection, deleteElection} = require('../lib/dbConnect');
const formidable = require("formidable");
//const session = require("express-session");

const appRouter = express.Router();

appRouter.all('/', (req, res)=>{
    if (req.method === 'GET'){
        res.render("login", {title:"login", message:"" , feedback:""});
    }
    if (req.method === 'POST'){
        (async ()=>{
            try {
                const accessGranted = await verifyUser(req.body)
                if (accessGranted) {
                    res.cookie("session", "123qwe", {maxAge: (1000*60*15)});
                    res.cookie("matricule", req.body.matricule, {maxAge:(1000*60*15)});
                    res.redirect(`/student/${req.body.matricule}`);}
                else res.render("login",{title:"login", message:"incorrect username or password", feedback:""})
            } catch (error) {
                console.log(error)
            }
        })();
    }
})

appRouter.all('/admin', (req, res)=>{
    if (req.method === 'GET'){
        res.render("admin", {title:"admin", message:""});
    }
    if (req.method === 'POST'){
        (async ()=>{
            try {
                const accessGranted = await verifyAdmin(req.body);
                if (accessGranted){
                    res.cookie("session", "123qwe", {maxAge: (1000*60*15)}); 
                    res.redirect("/elections");
                }
                else res.redirect('/admin');
            } catch (error) {
                console.log(error)
            }
        })();
    }
});
    
appRouter.all("/student/:id", (req, res)=>{
    if (req.method === 'GET'){
        (async () => {
            try {
                const student = await getStudent(req.params.id);
                console.log(student);
                const elections = await getStudentElections(student[0]);
                console.log(elections);
                res.render("student", {title:"vote",data:student[0], elections:elections, feedback:"Hello"});
            } catch (error) {
                console.log(error);
            }
        })();
    } 
    
    if (req.method === 'POST'){
        res.send("voting page");
    }
})
appRouter.all("/vote/:id", (req, res)=>{
    const info = (req.params.id).split("-");
    const id = info[0];
    const matricule = info[1];
    console.log(req.params.id, info, id, matricule);
    if (req.method === 'GET'){
        (async()=>{
            try {
                const candidates = await getCandidates(id);
                console.log(candidates);
                res.render('vote', {title:"vote",candidates:candidates, id:id, matricule})
            } catch (error) {
                console.log(error);
            }
        })();
    }
    if(req.method === 'POST'){
        (async () => {
            const election_id = id;
            const data = req.body;
            try {
                const status = await voteCandidates(election_id, data);
                await registerVote(id, matricule);
                console.log(status);
                const student = await getStudent(req.cookies.matricule);
                console.log(student);
                const elections = await getStudentElections(student[0]);
                console.log(elections);
                res.render("student", {title:"vote",data:student[0], elections:elections, feedback:status})
            } catch (error) {
                console.log(error)
                res.send("failed")
            }
        })();
    }
        
            
})


appRouter.all('/register', (req, res)=>{
    if (req.method === 'GET'){
        res.render('registration', {title: "registration"})
    }
    if (req.method === 'POST'){
       (async ()=>{
        try {
            await addStudent(req.body)
            res.render('login', {title:"Login", message:"", feedback:"Registration Complete"})
        } catch (error) {
            console.log(error) 
            res.render('login', {title:"Login", message:"", feedback:"Registration failed"})
        }
       })();
    }
})
async function renderElections (res, feedback) {
    const elections = await getElections();
    console.log(elections);
    const f = feedback || "Welcome Back";
    res.render("elections",{title:"elections", elections:elections, feedback:f})
};
appRouter.all("/elections", (req, res)=>{
    if(req.method === 'GET'){
        renderElections(res, "Welcome back");
    }
    if(req.method === 'POST'){
        (async () => {
            try {
                await addElection(req.body)
                const elections = await getElections();
                console.log(elections);
                res.render("elections",{title:"elections", elections:elections, feedback:"Election Added Successfully"})
            } catch (error) {
                console.log(error)
                const elections = await getElections();
                console.log(elections);
                res.render("elections",{title:"elections", elections:elections, feedback:"Failed to Add Election"})
            }
        })()
        
    }
})
appRouter.all('/elections/:id', (req, res)=>{
    if(req.method === 'GET'){
        console.log(req.params.id);
        const p = (req.params.id).split("-");
        const id = p[0];
        let n = ""
        p.forEach((value, k)=>{
            if(k == 0) n+="";
            else{
                value = value + " ";
                n += value;
            }
        });
        n = n.trim();
        res.cookie("elec_id", id);
        res.cookie("link", req.params.id);
        res.cookie("n", n);
        res.render('addCandidates',{title:"Add Candidate", link:req.params.id, id:id, name:n, feedback:''});
    }
    if(req.method === 'POST'){
        (async () => {
            console.log(req.body);
            try {
                await addCandidate(req.body);
                const id = req.cookies.elec_id;
                const n = req.cookies.n;
                const link = req.cookies.link;
                console.log(req.cookies);
                res.clearCookie("elec_id");
                res.clearCookie("n");
                res.clearCookie("link");
                res.render('addCandidates',{title:"Add Candidate", link:link, id:id, name:n, feedback:true});
            } catch (error) {
                console.log(error);
                const id = req.cookies.elec_id;
                const n = req.cookies.n;
                const link = req.cookies.link;
                res.clearCookie("elec_id");
                res.clearCookie("n");
                res.clearCookie("link");
                res.render('addCandidates',{title:"Add Candidate",link:link, id:id, name:n, feedback:false});
            }
        })();
    }
})
appRouter.get("/election-status/:id",(req, res)=>{
    (async () => {
        id = req.params.id;
        try {
            const electionStatus = await getElectionStatus(id)
            console.log(electionStatus);
            res.render('electionStatus', {title:'election status', data:electionStatus})
        } catch (error) {
            console.log(error)
        }
    })();
} )
appRouter.get("/history",(req, res)=>{
    (async () => {
        try {
            const package = await getHistory();
            package.title = "History"
            res.render("history", package)
        } catch (error) {
            console.log(error);
        }
    })();  
})
appRouter.get("/candidates/:id", (req, res) =>{
    (async () => {
        const election_id = req.params.id;
        try {
            const candidates = await getCandidates(election_id);
            console.log("candidates:", candidates);
            res.json(candidates);
        } catch (error) {
            console.log(error);
        }
        
    })();
})
appRouter.get("/logout", (req, res)=>{
    if(req.cookies.session){
        res.clearCookie("session");
    }
    if(req.cookies.matricule){
       res.clearCookie("matricule");
    }
    res.redirect("/");
})
appRouter.all("/uploads", (req, res)=>{
    if(req.method === 'GET'){
        res.render('upload', {title:'Upload file'})
    }
    if(req.method === 'POST'){
        const form = formidable({uploadDir:'../uploads', keepExtensions:true});
        form.parse(req, (err, data, files=>{
            if(err){
                console.log(err)
                next(err);
            }
            if(files){
                console.log("file uploaded");
            }
        }))
    }
})
appRouter.all('/update-student', (req, res)=>{
    if(req.method === "GET"){
        (async () => {
            try {
                const student = await getStudent(req.cookies.matricule);
                console.log(student);
                const elections = await getStudentElections(student[0]);
                console.log(elections);
                res.render("updateStudent", {title:"update-student",data:student[0], feedback:"Hello"});
            } catch (error) {
                console.log(error);
            }
        })();
    }
    if(req.method === 'POST'){
        (async () => {
            try {
                await updateStudent(req.body)
                res.send('profile modified')
            } catch (error) {
                console.log(error)
            }
        })()
    }
})
appRouter.all('/modify-election/:id',(req, res)=>{
    if(req.method === 'GET'){
        (async () => {
            const election = await getElection(req.params.id);
            console.log(election);
            res.render('modifyElection',{title:"Modify Election",election});
        })();
    }
    if(req.method === 'POST'){
        (async () => {
            const data = req.body;
            const id = req.params.id;
            try {
                const feedback = await updateElection(data,id);
                res.send(feedback);
            } catch (error) {
                console.log(error)
            }
        })();
    }
})
appRouter.get('/delete-election/:id', (req, res)=>{
    const id = req.params.id;
    (async () => {
        try {
            const feedback = await deleteElection(id);
            if (feedback === true){
                await renderElections(res, "Election succesfully deleted")
            }else{
                await renderElections(res, "Election delete failed")
            }
        } catch (error) {
            console.log(error)
            await renderElections(res, "An error occurred")
        }
    })()
})
module.exports = appRouter;