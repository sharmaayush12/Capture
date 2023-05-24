const express = require('express')
var http = require('http');
var fs = require('fs');
var path = require('path')
const cors=require('cors')
const { createFFmpeg } = require('@ffmpeg/ffmpeg');

const app = express()

app.use(cors({
    origin:'*'
}))

app.use(function (res, req, next) {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    next()
})


http.createServer(function(req,res){    

    res.writeHead(200,{
        "Content-Type":"text/html"
    });
    fs.createReadStream(path.resolve(__dirname,"index2.html"))
    .pipe(res)
}).listen('3000');



// app.listen(3000, () => {
//     console.log("App is Listening on port 5000")
// })