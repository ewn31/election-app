const {verifyToken} = require('./token.js')
const {getAdmin} = require('../Database/adminDb.js');
const hashedPassword = require('./hash');

function verifyUser(req, res, next){

    const unproctedRoutes = ['/', '/admin', '/register'];

    const authHeader = req.headers['authorization'];

    if(unproctedRoutes.includes(req.url)){
        return next();  
    }

    if(!authHeader){
        //request for authentification
        return res.status(401).send('unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).send('Token missing');
    }
    try {
        var user = verifyToken(token);
    } catch (TokenExpiredError) {
        return res.status(401).send('Token Expired');
    }
    

    if(!user){
        return res.status(401).send('Invalid Token')
    }

    if(!user.isAdmin){
        // verify student
       const matricule =  req.url.split('/')[2];
       if(user.matricule === matricule){
          return res.status(401).send('forbidden')
       }
    }
    if(user.isAdmin){
        //verify admin
        const hashed_password = hashedPassword(user.password);
        try {
            (async () => {
               const admin = await getAdmin(user.user);
               if(!admin) return res.status(401).send("Error");
               if(!(hashed_password === admin.password)) return res.status(401).send('Invalid credentials'); 
            })()
        } catch (error) {
            console.log(error);
        }
    }

    next()
}

module.exports = verifyUser;