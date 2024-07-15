require('dotenv').config(); 
const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const { Server } = require('socket.io');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.API_SERVER_PORT || 9000;

const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const io = new Server({ cors: '*' });

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel);
        socket.emit('message', `Joined ${channel}`);
    });
});

io.listen(process.env.SOCKET_SERVER_PORT || 9002, () => console.log('Socket Server Running on port', process.env.SOCKET_SERVER_PORT || 9002));

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const config = {
    CLUSTER: process.env.ECS_CLUSTER,
    TASK: process.env.ECS_TASK_DEFINITION
};

app.use(express.json());

app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: process.env.ECS_SUBNETS.split(','),
                securityGroups: [process.env.ECS_SECURITY_GROUPS]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } });
});

async function initRedisSubscribe() {
    console.log('Subscribed to logs....');
    subscriber.psubscribe('logs:*');
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message);
    });
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API Server Running on port ${PORT}`));
