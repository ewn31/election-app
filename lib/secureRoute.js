const {getAuthInfo} = require('./dbConnect.js');

//const exemptionsRoutes=['/']

function validateUser (req, res, next){
    if(req.cookies === null){
        res.redirect('/')
    }else{
    const userId = req.cookies.user;
    const session = req.cookies.session;

    console.log(req.cookies);

        try {
            (async () => {
                //if(exemptionsRoutes.includes(req.url)) next();
                const authinfo = await getAuthInfo(userId);
                if((userId === authinfo.USER) && (session === authinfo.TOKEN)) next();
                else{
                    res.send('forbidden');
                }
            })();
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = validateUser;