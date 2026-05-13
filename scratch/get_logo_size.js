const https = require('https');
https.get('https://i.imgur.com/6H5gxcw.png', (res) => {
  res.once('data', (chunk) => {
    const width = chunk.readUInt32BE(16);
    const height = chunk.readUInt32BE(20);
    console.log(`Resolution: ${width}x${height}`);
    process.exit(0);
  });
});
