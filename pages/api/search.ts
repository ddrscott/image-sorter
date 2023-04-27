import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
    node: process.env.ELASTIC_URL,
    auth: {
        apiKey: process.env.ELASTIC_API_KEY
    },
    tls: {
        ca: fs.readFileSync('./elastic-ca.crt'),
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    const { prompt, size, offset } = req.query;

    try {
        const query = {};
        if (prompt) {
            query['match'] = {
                prompt: {
                    query: prompt,
                }
            };
        } else {
            query['match_all'] = {};
        }
        const body = await client.search({
            index: 'sd_images',
            from: offset || 0,
            size: size || 100,
            body: {
                sort: [
                    { "_score": { "order": "desc" } },
                    { "timestamp": { "order": "desc" } }
                ],
                query
            },
        });
        res.status(200).json(body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
