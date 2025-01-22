const express = require('express')
const appRouter = require('./routes/appRouter');
const studentRouter = require('./routes/studentRouter');
const adminRouter = require('./routes/adminRouter.js');
const verifyUser = require('./lib/verifyUser.js');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const cfg = {
    port:3000,
    url:"localhost",
}
const port = process.env.PORT

const app =  express();


app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended:true }));

app.use(compression());

app.use(cookieParser());

app.use(express.static('static'));

app.use(verifyUser)

app.use('/student', studentRouter);

app.use('/admin', adminRouter);

app.use('/', appRouter);

app.use((req, res)=>{
    res.status(404).send("Page not found")
})


app.listen(port, ()=>{
    console.log(`Server up and running on http://${cfg.url}:${port}`)
})
