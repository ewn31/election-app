const {exec}  = require("node:child_process");
const { stderr } = require("node:process");


exec("dir", (error, stdout, stderr)=>{
    if(error){
        console.log(error)
    }else{
        console.log(stdout);
    }
})