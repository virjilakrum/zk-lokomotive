import formidable from 'formidable';
import fs from 'fs-extra';
import Server from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req, res) => {
 
    if (req.method === 'POST') {
        const guid = generateGUID();
        const form = new formidable.IncomingForm();
        
        form.keepExtensions = true;
        form.maxFileSize = 10000 * 1024 * 1024;

        form.on('fileBegin', (name, file) => {
            file.path = './uploads/' + guid + '.zip'; //file.name;
        });
        form.on('progress', (recv, exp) => {
            const percent = (recv / exp) * 100;
            res.socket.server.io.emit('uploadProgress', percent);
        });

        //form.parse(req);
        setTimeout(() => {
            form.parse(req, (err, fields, files) => {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ files, 'guid':guid }, null, 2));
            });
        }, 50);

    } else {
        if (!res.socket.server.io) {
            console.log('*First use, starting socket.io')

            const io = new Server(res.socket.server)
            res.socket.server.io = io

        } else {
            console.log('socket.io already running')
        }
        res.end()
    }
}

const generateGUID = () => {

    let guid = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    while (fs.existsSync('./' + guid + '.zip')) {
        guid = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    }

    return guid;
}
