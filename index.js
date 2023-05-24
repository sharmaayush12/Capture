const express = require('express')
var http = require('http');
var fs = require('fs');
var path = require('path')
const cors = require('cors')
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const app = express()

app.use(cors({
    origin: '*'
}))

app.use(function (res, req, next) {
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    next()
})


app.use(express.static(path.resolve('./public')));
// app.get('/', function (res, req) {
//     http.createServer(function(req,res){    

//         res.writeHead(200,{
//             "Content-Type":"text/html"
//         });
//         fs.createReadStream(path.resolve(__dirname,"index.html"))
//         .pipe(res)
//     })
// });


app.get('/test', function (res, req) {
    
    const ffmpeg = createFFmpeg({ log: true });
    (async () => {
        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'test.webm', await fetchFile('./test.webm'));
        await ffmpeg.run('-i', 'test.webm', 'test.mp4');
        await fs.promises.writeFile('./test.mp4', ffmpeg.FS('readFile', 'test.mp4'));
        process.exit(0);
      })();
});



app.listen(3000, () => {
    console.log("App is Listening on port 3000")
})