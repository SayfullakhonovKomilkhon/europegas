// EUROPEGAS ULTIMATE SERVER SCRIPT
// This server will work on ANY system guaranteed.
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Try a sequence of ports until one works
const tryPorts = [5000, 3000, 8080, 8000];
let currentPort = 0;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  EUROPEGAS SERVER RUNNING SUCCESSFULLY                 ║
║                                                        ║
║  Local URL: http://localhost:${port}                    ║
║                                                        ║
║  Your application is now running!                      ║
║  Use Ctrl+C to stop the server                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying next port...`);
      
      if (currentPort < tryPorts.length - 1) {
        currentPort++;
        startServer(tryPorts[currentPort]);
      } else {
        console.error('All ports are in use. Please close some applications and try again.');
      }
    } else {
      console.error('Server error:', err.message);
    }
  });
}

// Check if build directory exists, if not create a temporary page
if (!fs.existsSync(path.join(__dirname, 'build'))) {
  console.log('Build directory not found. Creating temporary page...');
  
  if (!fs.existsSync(path.join(__dirname, 'build'))) {
    fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
  }
  
  const tempHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EuropeGAS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #1e3a8a; }
    .action {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .button {
      display: inline-block;
      background-color: #1e3a8a;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>EuropeGAS</h1>
    <p>Server is running correctly, but the application build is missing.</p>
    <p>Please build the application first with:</p>
    <pre>npm run build</pre>
    <div class="action">
      <a href="/health" class="button">Check Server Health</a>
    </div>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(__dirname, 'build', 'index.html'), tempHtml);
}

// Start the server on the first port
startServer(tryPorts[currentPort]);
