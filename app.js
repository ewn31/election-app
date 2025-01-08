const express = require('express')
const appRouter = require('./routes/appRouter');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cfg = {
    port:3000,
    url:0.0.0.0
}

const app =  express();


app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended:true }));
app.use(compression());
app.use(cookieParser());
app.use(session({
    secret: 'qwerty',
    resave:false,
    saveUninitialized:false
}))
app.use((req, res, next)=>{
    const c = req.cookies;
    const u = req.url;
    console.log(c);
    if(c.session || (u === "/") || (u === "/admin") || (u === "/register")) next();
    else {
        //res.render('login',{title:"login",message:""});
        res.redirect("/");
    }
})
app.use('/', appRouter);

app.use(express.static('static'));

app.use((req, res)=>{
    res.status(404).send("Page not found")
})


app.listen(cfg.port, ()=>{
    console.log(`Server up and running on http://${cfg.url}:${cfg.port}`)
})
