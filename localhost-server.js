const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(Request: \ \);
  
  // Serve test page at root
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'test.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(Error: \);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    });
    return;
  }
  
  // Redirect to React app
  if (req.url === '/app') {
    res.writeHead(302, { 'Location': '/app/' });
    res.end();
    return;
  }
  
  // Serve React app files
  if (req.url.startsWith('/app/')) {
    const filePath = path.join(__dirname, 'build', req.url.substring(4) || 'index.html');
    
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // If file doesn't exist, serve index.html for client-side routing
        fs.readFile(path.join(__dirname, 'build', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end(Error loading React app: \);
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
        return;
      }
      
      // Determine content type
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      
      switch (ext) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpeg';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
      }
      
      // Read and serve the file
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end(Error loading file: \);
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      });
    });
    return;
  }
  
  // 404 for all other routes
  res.writeHead(404);
  res.end('Not found');
});

// Listen strictly on localhost
server.listen(3000, '127.0.0.1', () => {
  console.log(
=================================================
  EUROPEGAS SERVER RUNNING
=================================================
  URL: http://localhost:3000/
  
  • Test page: http://localhost:3000/
  • React app: http://localhost:3000/app/
  
  Server is strictly bound to localhost
=================================================
);
});
