import type { NextApiResponse } from 'next'
import sizeOf from "image-size"

const { exec } = require('node:child_process')

type Data = {
    gallery: string[]
}

export default function handler(
    _: any,
    res: NextApiResponse<Data>
) {
    const directoryPath = process.env.IMAGE_PATH || '.';

    // run the `ls` command using exec
    console.log(`Listing files in ${directoryPath}`)
    exec(`find ${directoryPath} -type f`, (err:any, output:string) => {
        // once the command has completed, the callback function is called
        if (err) {
            res.status(500).json({error: err });
            return
        }
        const items = []

        output.split(/\r?\n/).forEach((path:string) => {
            if (!path || !path.match(/(jpg|png)$/)) {
                return
            }
            try {
                const dimensions = sizeOf(path);
                items.push({
                    src: path.replace(directoryPath, '/api/images'),
                    ...dimensions
                })
            } catch (err) {
                console.log(`ignoring: ${path}`, err);
            }
        });
        res.status(200).json({ gallery: items});
    })
}
