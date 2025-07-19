import express from 'express';
import fs from 'fs';
import path from 'path';
import { DownloadLedger } from '../queue/DownloadLedger';

const router = express.Router();
const downloadsDir = path.resolve(__dirname, '../../data/downloads');

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const item = DownloadLedger.getHistory().find(h => h.id === id);

  if (!item || !item.fileName) {
    return res.status(404).send('Download not found');
  }

  const filePath = path.join(downloadsDir, `${item.fileName}.mp4`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found on disk');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    stream.pipe(res);
  }
});

export default router;
