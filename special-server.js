// Special server for Windows environment with connection issues
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Get all network interfaces
const networkInterfaces = os.networkInterfaces();
let ipAddresses = [];

// Find all IPv4 addresses from all network interfaces
Object.keys(networkInterfaces).forEach(ifaceName => {
  networkInterfaces[ifaceName].forEach(iface => {
    // Skip internal/loopback interfaces and non-IPv4
    if (!iface.internal && iface.family === 'IPv4') {
      ipAddresses.push(iface.address);
    }
  });
});

// Also add localhost variations
ipAddresses.push('127.0.0.1');
ipAddresses.push('0.0.0.0');

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.ip}]: ${req.method} ${req.url}`);
  next();
});

// Handle static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    interfaces: ipAddresses
  });
});

// Serve index.html for all other routes (for React routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Try ports until one works
const ports = [8000, 5000, 3000, 8080];
let currentPortIndex = 0;

// Create minimal HTML if build directory doesn't exist
if (!fs.existsSync(path.join(__dirname, 'build'))) {
  console.log('Build directory not found, creating minimal content...');
  
  if (!fs.existsSync(path.join(__dirname, 'build'))) {
    fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
  }

  const minimalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EuropeGAS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f0f2f5;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1);
      padding: 30px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 {
      color: #1877f2;
      margin-top: 0;
    }
    .success {
      color: #42b72a;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    .interfaces {
      background: #f5f6f7;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: left;
    }
    .button {
      background: #1877f2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;
      text-decoration: none;
      display: inline-block;
    }
    .button:hover {
      background: #166fe5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>EuropeGAS Server</h1>
    <p class="success">✓ Server is running correctly!</p>
    <p>Your connection to the server is working. If you don't see your React application, make sure to build it first with:</p>
    <pre>npm run build</pre>
    
    <div class="interfaces" id="interfaces">
      <p><strong>Available interfaces:</strong></p>
      <ul id="ip-list">
        <li>Loading...</li>
      </ul>
    </div>
    
    <a href="/health" class="button">Check Server Health</a>
  </div>

  <script>
    // Fetch health info and update interface list
    fetch('/health')
      .then(response => response.json())
      .then(data => {
        const ipList = document.getElementById('ip-list');
        ipList.innerHTML = '';
        
        if (data.interfaces && data.interfaces.length > 0) {
          data.interfaces.forEach(ip => {
            const li = document.createElement('li');
            li.innerHTML = '<a href="http://' + ip + ':PORT" target="_blank">' + ip + ':PORT</a>'.replace(/PORT/g, window.location.port);
            ipList.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = 'No network interfaces found';
          ipList.appendChild(li);
        }
      })
      .catch(error => {
        const ipList = document.getElementById('ip-list');
        ipList.innerHTML = '<li>Error fetching network information</li>';
        console.error('Error:', error);
      });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(__dirname, 'build', 'index.html'), minimalHtml);
}

// Try to bind to each port until one works
function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║  EUROPEGAS SERVER RUNNING SUCCESSFULLY                   ║
║                                                          ║
║  Server is running on all network interfaces:            ║
║                                                          ║
║  → Local: http://localhost:${port}                        ║
║  → LAN:   http://<your-ip-address>:${port}                ║
║                                                          ║
║  Available IP addresses:                                 ║
${ipAddresses.map(ip => `║  → http://${ip}:${port}`).join('\n').padEnd(59)}║
║                                                          ║
║  Try any of these URLs if localhost doesn't work         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying next port...`);
      
      currentPortIndex++;
      if (currentPortIndex < ports.length) {
        startServer(ports[currentPortIndex]);
      } else {
        console.error('All ports are in use. Please close some applications and try again.');
      }
    } else {
      console.error('Server error:', err.message);
    }
  });
}

// Start server with the first port
startServer(ports[currentPortIndex]);
