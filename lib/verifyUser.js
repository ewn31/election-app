const {verifyToken} = require('./token.js')
const {getAdmin} = require('../Database/adminDb.js');
const hashedPassword = require('./hash');

function verifyUser(req, res, next){

    const unproctedRoutes = ['/', '/admin', '/register'];

    const cookieToken = req.cookies.token

    const authHeader = req.headers['authorization'];


    if(unproctedRoutes.includes(req.url)){
        return next();  
    }

    if((!authHeader) && (!cookieToken)){
        //request for authentification
        return res.status(401).send('unauthorized');
    }
    if(!cookieToken){var token = authHeader.split(' ')[1];}
    else{var token = cookieToken}
    if(!token){
        return res.status(401).send('Token missing');
    }
    try {
        var user = verifyToken(token);
    } catch (TokenExpiredError) {
        return res.status(401).send('Token Expired');
    }
    
    console.log(user)

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
               if(!(hashed_password === admin.hashed_password)) return res.status(401).send('Invalid credentials'); 
            })()
        } catch (error) {
            console.log(error);
        }
    }

    next()
}

module.exports = verifyUser;