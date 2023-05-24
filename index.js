const express = require('express')
var http = require('http');
var fs = require('fs');
var path = require('path')
const cors = require('cors')
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }));



app.use(cors({
  origin: '*'
}))

app.use(function (res, req, next) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next()
})

app.use(express.static(path.resolve('./public')));

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), (req, res) => {
  // Handling file upload
  console.log(req.body)
  if (!{ file: req.file }) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // console.log(req.file.path)
  const ffmpeg = createFFmpeg({ log: true });
  (async () => {
    await ffmpeg.load();
    ffmpeg.FS('writeFile', req.file.path, await fetchFile(req.file.path));
    await ffmpeg.run('-i', req.file.path, 'test.mp4');
    await fs.promises.writeFile(`./convert/test.mp4`, ffmpeg.FS('readFile', 'test.mp4'));

    const filename = 'test.mp4';
    const filePath = `./convert/${filename}`; // Assuming files are stored in the "uploads" directory

    // Implement the logic to retrieve the file
    // For example, you can use the "fs" module to read the file and send it in the response


    // res.download(filePath, { dotfiles: "deny" }, function (err) {
    //   if (err) {
    //     console.error(err);
    //     return res.status(404).json({ error: 'File not found' });
    //   }
    // });
    res.send(filePath)

    // res.sendFile(filePath, { root: __dirname }, (err) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(404).json({ error: 'File not found' });
    //   }
    // });

    // return res.status(200).json({ message: 'File uploaded successfully.' });
    // process.exit(0);
  })();

  

  // File uploaded successfully
});

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `convert/${filename}`; // Assuming files are stored in the "uploads" directory
  
  // Implement the logic to retrieve the file
  // For example, you can use the "fs" module to read the file and send it in the response

  res.sendFile(filePath, { root: __dirname }, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: 'File not found' });
    }
  });
});

app.listen(8080, () => {
  console.log("App is Listening on port 8080")
})