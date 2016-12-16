var url = require('url'),
    fs = require('fs'),
    xssfilters = require('xss-filters'),
    querystring = require('querystring'),
    express = require('express')
port = 8080;

//array of post objects: string post, string poster
var posts = [];
var app = express();


app.use(express.static('clientFiles'))

app.post('/addPost', function(req, res) {
    handleAddPost(req, res);
})

app.get('/getPosts', function(req, res) {
    sendJSON(res);
})


function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function(error, content) {
        res.writeHead(200, {
            'Content-type': contentType
        })
        res.end(content, 'utf-8')
    })
}

app.listen(8080, function() {
    console.log('Listening on port 8080!')
})

function handleAddPost(request, response) {
    if (request.method === 'POST') {
        var body = '';
        request.on('data', function(data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var POSTData = JSON.parse(body);
            //[0] = the message, [1] = id
            //do input sanitization
            var postText = xssfilters.inHTMLData(POSTData[0]);
            var id = xssfilters.inHTMLData(POSTData[1]);
            var time = xssfilters.inHTMLData(POSTData[2])
            var postObj = [postText, id, time]
            posts.push(postObj);
            sendJSON(response);

        });
    }
}

function sendJSON(res) {
    res.writeHead(200, {
        'Content-type': 'application/json'
    })

    res.end(JSON.stringify(posts), 'utf-8');

}