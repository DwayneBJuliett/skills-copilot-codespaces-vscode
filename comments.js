// Create web server
// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const comments = [];
const server = http.createServer((req, res) => {
    // Parse the url
    const parsedUrl = url.parse(req.url);
    // Get the path
    let pathname = `.${parsedUrl.pathname}`;
    // Get the query
    const query = querystring.parse(parsedUrl.query);
    // Get the method
    const method = req.method;
    // Get the extension
    const ext = path.parse(pathname).ext;
    // Get the file name
    const filename = path.basename(pathname);
    // Get the file path
    const filepath = path.join(__dirname, pathname);
    // Get the file stream
    const fileStream = fs.createReadStream(filepath);
    // Check if the request is for the root
    if (pathname === './') {
        // Set the status code
        res.statusCode = 200;
        // Set the content type
        res.setHeader('Content-Type', 'text/html');
        // Write the response
        res.end(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Comments</title>
                </head>
                <body>
                    <h1>Comments</h1>
                    <form method="POST" action="/comments">
                        <textarea name="comment"></textarea><br>
                        <button type="submit">Submit</button>
                    </form>
                    <ul>
                        ${comments.map(comment => `<li>${comment}</li>`).join('')}
                    </ul>
                </body>
            </html>
        `);
    }
    // Check if the request is for the comments
    else if (pathname === './comments' && method === 'POST') {
        // Set the status code
        res.statusCode = 302;
        // Set the location
        res.setHeader('Location', '/');
        // Get the data
        req.on('data', data => {
            // Parse the data
            const parsedData = querystring.parse(data.toString());
            // Get the comment
            const comment = parsedData.comment;
            // Add the comment to the list
            comments.push(comment);
        });
        // End the request
        req.on('end', () => {
            res.end();
