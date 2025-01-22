function verifyUser(req, res, next){
    const authHeader = req.headers['authorization'];

    if((req.url === '/') || (req.url === '/admin')){
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
    next()
}

module.exports = verifyUser;