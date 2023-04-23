import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function handler(req, res) {
    const { imagePath, width } = req.query;
    const directoryPath = process.env.IMAGE_PATH || '.';
    const filePath = path.join(directoryPath, ...imagePath);

    try {
        let fileContents = width ?
            await sharp(filePath).resize(parseInt(width)).toBuffer() :
            fs.readFileSync(filePath)
        res.statusCode = 200;
        res.setHeader('Content-Type', `image/${path.extname(filePath).slice(1)}`);
        res.send(fileContents);
    } catch (error) {
        res.statusCode = 404;
        res.send(`Error: ${error.message}`);
    }
}
