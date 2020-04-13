const express = require('express')
const multer = require('multer');
const path = require('path')

const app = express();
app.use(express.static(path.join(__dirname, '../assets')));

function crossOrigin(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", "Express");
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
}

app.use(crossOrigin)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../assets'))
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname.replace(/(.*)\./, `$1-${Date.now()}.`)
        cb(null, fileName)
    }
})

const upload = multer({
    storage: storage
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        data: {
            url: 'http://localhost:3456/' + req.file.filename
        },
        _errCode: '0',
        _errStr: 'success'
    })
})

app.listen(3456, () => console.log('Example app listening on port 3456!'))