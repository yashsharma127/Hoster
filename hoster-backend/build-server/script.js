require('dotenv').config();

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');

// Create a Redis client using environment variables
const publisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

// Create an S3 client using environment variables
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
    console.log('Executing script.js');
    publishLog('Build Started...');
    const outDirPath = path.join(__dirname, 'output');

    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stderr.on('data', function (data) {
        console.log('Error', data.toString());
        publishLog(`error: ${data.toString()}`);
    });

    p.on('close', async function () {
        console.log('Build Complete');
        publishLog(`Build Complete`);
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { withFileTypes: true });

        publishLog(`Starting to upload`);
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file.name);
            if (file.isDirectory()) continue;

            console.log('uploading', filePath);
            publishLog(`uploading ${file.name}`);

            const command = new PutObjectCommand({
                Bucket: 'vercel-clone-outputs',
                Key: `__outputs/${PROJECT_ID}/${file.name}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            });

            await s3Client.send(command);
            publishLog(`uploaded ${file.name}`);
            console.log('uploaded', filePath);
        }
        publishLog(`Done`);
        console.log('Done...');
    });
}

init();
