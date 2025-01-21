const express = require('express')
const appRouter = require('./routes/appRouter');
const compression = require('compression');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
const {getAuthInfo} = require('./lib/dbConnect.js');
const validateUser = require('./lib/secureRoute.js');
const cfg = {
    port:3000,
    url:"localhost",
    unproctected_routes:['/', '/register', '/admin']
}
const port = process.env.PORT

const app =  express();


app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended:true }));
app.use(compression());
app.use(cookieParser());
/*app.use(session({
    secret: 'qwerty',
    resave:false,
    saveUninitialized:false
}))*/

app.use(express.static('static'));

//app.use(validateUser);

/*app.use((req, res, next)=>{
    res.setHeader("ngrok-skip-browser-warning", "true");
    const c = req.cookies;
    const route = req.url;
    (async () => {
        try {
            const authinfo = await getAuthInfo(req.cookies.user);
            console.log(c, route, authinfo);
            if((route === "/") || (route === "/admin") || (route === "/register")) next();
            else if((authinfo.USER === c.user) && (authinfo.TOKEN === c.session)) next();
            else {
                res.send("Forbidden");
            }
            //if(!(authTokens.includes(c.session)) && (u !== "/") || (u !== "/admin") || (u !== "/register")) next();
            //if(!(authTokens.includes(c.session))) res.redirect("/");
            /*else {
                //res.render('login',{title:"login",message:""});
                res.redirect("/");
            }*/
        /*} catch (error) {
            console.log(error);
        }
    })();
})*/

app.use('/', appRouter);

app.use((req, res)=>{
    res.status(404).send("Page not found")
})


app.listen(port, ()=>{
    console.log(`Server up and running on http://${cfg.url}:${port}`)
})
