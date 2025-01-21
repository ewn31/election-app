const express = require("express");
const {addStudent, updateStudent, verifyUser, verifyAdmin, addElection, getElections, getElection, addCandidate, getStudent, getStudentElections, getCandidates, voteCandidates, getElectionStatus, registerVote, getHistory, updateElection, deleteElection, addAuthinfo, getAuthInfo, deleteAuthinfo} = require('../lib/dbConnect');
const formidable = require("formidable");
const {verifyToken, generateToken} = require('../lib/token');
//const session = require("express-session");

const appRouter = express.Router();
//function to verify the id if users for protected routes
async function verifyUserId(res, id, token) {
        try {
            const authinfo = await getAuthInfo(id);
            console.log("in verify user", id, token, authinfo);
            if(authinfo === null) res.send('forbidden');
            else if((authinfo.USER === id) && (authinfo.TOKEN === token)) next()
            else{
                res.send('forbidden')
            }
        } catch (error) {
            console.log(error)
        }
}

// login route
appRouter.get('/', (req, res)=>{
    res.render("login", {title:"login", message:"" , feedback:""});
})
appRouter.post('/', (req, res)=>{
    (async ()=>{
        //const authinfo = await getAuthInfo(req.cookies.user);
        try {
            const accessGranted = await verifyUser(req.body);
            console.log(accessGranted);
            if (accessGranted) {
                const user = req.body.matricule;
                const token = generateToken(user);
                (async () => {
                    try {
                        await addAuthinfo({token:token, user:user});
                    } catch (error) {
                        console.log(error);
                    }
                })();
                res.cookie("session", token);
                res.cookie("user", req.body.matricule);
                res.redirect(`/student/${req.body.matricule}`);}
            else res.render("login",{title:"login", message:"incorrect username or password", feedback:""})
        } catch (error) {
            console.log(error)
        }
    })();
})

//admin route
appRouter.get('/admin', (req, res)=>{
    res.render("admin", {title:"admin", message:""});
});
appRouter.post('/admin', (req, res)=>{
    (async ()=>{
        try {
            const accessGranted = await verifyAdmin(req.body);
            const user = req.body.username;
            const token =  generateToken(user);
            (async () => {
                try {
                    await addAuthinfo({token:token, user:user});
                } catch (error) {
                    console.log(error);
                }
            })();
            if (accessGranted){
                res.cookie("session", token);
                res.cookie("user", user); 
                res.redirect("/elections");
            }
            else res.redirect('/admin');
        } catch (error) {
            console.log(error)
        }
    })();
})

 //student route   
appRouter.get("/student/:id", (req, res)=>{
        (async () => {
            try {
                await verifyUserId(res, req.params.id, req.cookies.session)
                const student = await getStudent(req.params.id);
                console.log(student);
                const elections = await getStudentElections(student[0]);
                console.log(elections);
                res.render("student", {title:"vote",data:student[0], elections:elections, feedback:"Hello"});
            } catch (error) {
                console.log(error);
            }
        })();
})

//vote route
appRouter.get("/vote/:id", (req, res)=>{
    const info = (req.params.id).split("-");
    const id = info[0];
    const matricule = info[1];
    console.log(req.params.id, info, id, matricule);
        (async()=>{
            try {
                await verifyUserId(res, matricule, req.cookies.session)
                const candidates = await getCandidates(id);
                console.log(candidates);
                res.render('vote', {title:"vote",candidates:candidates, id:id, matricule})
            } catch (error) {
                console.log(error);
            }
        })();       
})

appRouter.post("/vote/:id", (req, res)=>{
    const info = (req.params.id).split("-");
    const id = info[0];
    const matricule = info[1];
    (async () => {
        const election_id = id;
        const data = req.body;
        try {
            await verifyUserId(res, matricule, req.cookies.session);
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
})

//register route
appRouter.get('/register', (req, res)=>{
    res.render('registration', {title: "registration"})
})

appRouter.post('/register', (req, res)=>{
    (async ()=>{
        try {
            await addStudent(req.body)
            res.render('login', {title:"Login", message:"", feedback:"Registration Complete"})
        } catch (error) {
            console.log(error) 
            res.render('login', {title:"Login", message:"", feedback:"Registration failed"})
        }
       })();
})

//election route
async function renderElections (res, feedback) {
    const elections = await getElections();
    console.log(elections);
    const f = feedback || "Welcome Back";
    res.render("elections",{title:"elections", elections:elections, feedback:f})
};
appRouter.get("/elections", (req, res)=>{
    (async () => {
        await verifyUserId(res, 'ADMIN', req.cookies.session);
        renderElections(res, "Welcome back");
    })()
})

appRouter.post('/elections', (req, res)=>{
    (async () => {
        try {
            //have to modify so that the user reads the admin
            await verifyUserId('ADMIN', req.cookies.session)
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
})

appRouter.get('/elections/:id', (req, res)=>{
        (async () => {
            await verifyUserId(res, req.cookies.user, req.cookies.session);
        })()
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
})

appRouter.post('/elections/:id', (req, res)=>{
    (async () => {
        console.log(req.body);
        try {
            await verifyUserId(res, req.cookies.user, req.cookies.session)
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
})

appRouter.get("/election-status/:id",(req, res)=>{
    (async () => {
        id = req.params.id;
        try {
            await verifyUserId(res, req.cookies.user, req.cookies.session)
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
            await verifyUserId(res, req.cookies.user, req.cookies.session)
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
            await verifyUserId(res, req.cookies.user, req.cookies.session)
            const candidates = await getCandidates(election_id);
            console.log("candidates:", candidates);
            res.json(candidates);
        } catch (error) {
            console.log(error);
        }
        
    })();
})
appRouter.get("/logout", (req, res)=>{
    (async () => {
        await deleteAuthinfo(req.cookies.user);
    })()
    if(req.cookies.session){
        res.clearCookie("session");
    }
    if(req.cookies.user){
       res.clearCookie("user");
    }
    if(req.cookies.elec_id){
        res.clearCookie("elec_id")
    }
    if(req.cookies.link){
        res.clearCookie("link")
    }
    if(req.cookies.n){
        res.clearCookie('n')
    }
    res.redirect("/");
})
/*appRouter.all("/uploads", (req, res)=>{
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
})*/
appRouter.get('/update-student', (req, res)=>{
        (async () => {
            try {
                await verifyUserId(req.cookies.user, req.cookies.session);
                const student = await getStudent(req.cookies.user);
                console.log(student);
                const elections = await getStudentElections(student[0]);
                console.log(elections);
                res.render("updateStudent", {title:"update-student",data:student[0], feedback:"Hello"});
            } catch (error) {
                console.log(error);
            }
        })();
})

appRouter.put('/update-student', (req, res)=>{
    //console.log(req.body)
    (async () => {
        try {
            //await verifyUserId(req.cookies.user, req.cookies.session)
            //if(req.cookies.user === req.body.matricule){
            console.log('In update student',req.body)
            await updateStudent(req.body)
            res.send('profile modified')
            //}else res.send('forbidden');
        } catch (error) {
            console.log(error)
        }
    })()
})
appRouter.get('/modify-election/:id',(req, res)=>{
        (async () => {
            const election = await getElection(req.params.id);
            console.log(election);
            res.render('modifyElection',{title:"Modify Election",election});
        })();
})
appRouter.put('/modidfy-election/:id', (req, res)=>{
    (async () => {
        const data = req.body;
        const id = req.params.id;
        try {
            const feedback = await updateElection(data,id);
            res.send(feedback);
        } catch (error) {
            console.log(error)
            res.send(feedback);
        }
    })();
})
appRouter.delete('/delete-election/:id', (req, res)=>{
    const id = req.params.id;
    (async () => {
        try {
            const feedback = await deleteElection(id);
            /*if (feedback === true){
                await renderElections(res, "Election succesfully deleted")
            }else{
                await renderElections(res, "Election delete failed")
            }*/
           res.send(feedback);
        } catch (error) {
            console.log(error)
            await renderElections(res, "An error occurred")
        }
    })()
})

appRouter.get('/test', (req, res)=>{
    res.setHeader('WWW-Authenticate', 'Basic realm="Access to the Site"');
    res.status(401).send('Unauthorized')
})
module.exports = appRouter;
