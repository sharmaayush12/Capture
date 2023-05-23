const express = require('express')
var http = require('http');
var fs = require('fs');
var path = require('path')
const cors=require('cors')

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
    fs.createReadStream(path.resolve(__dirname,"index.html"))
    .pipe(res)
}).listen('3000');

// app.get('/', (res, req) => {
//     res.sendfile(__dirname + "/index.html")
// })

// app.listen(5000, () => {
//     console.log("App is Listening on port 5000")
// })