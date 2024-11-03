import fs from 'fs'
import path from 'path'

export default function getData(req, res) {
        
    const {
        query: { guid },
    } = req

    if (guid) {

        const filePath =  "uploads/" + guid + '.zip';
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Length': stat.size,
            'Content-Disposition': 'attachment; filename=' + filePath
        });
        
        var readStream = fs.createReadStream(filePath);

        readStream.on('open', function() {
            readStream.pipe(res);
        });
        readStream.on('error', function(err) {
            res.end(err);
        });
    } else {
        res.statusCode = 400;
        res.end();
    }

}