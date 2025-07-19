import express from 'express';
import path from 'path';
import fs from 'fs';
import { log } from '../utils/Logger';
import { DownloadLedger } from '../queue/DownloadLedger';

const router = express.Router();
const downloadsDir = path.resolve(__dirname, '../../data/downloads');


router.get('/', (_req, res) => {
  res.json(DownloadLedger.getHistory());
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { deleteFile } = req.query;

  const item = DownloadLedger.getHistory().find(h => h.id === id);

  if (!item) {
    return res.status(404).json({ message: 'History item not found' });
  }

  // Optional: delete the file from disk
  if (deleteFile === 'true' && item.fileName) {
    const filePath = path.join(downloadsDir, `${item.fileName}.mp4`);
    try {
      fs.unlinkSync(filePath);
      log('api', `🗑️ Deleted file from disk: ${filePath}`);
    } catch (err: any) {
      log('api', `⚠️ Failed to delete file: ${filePath} - ${err.message}`);
    }
  }

  // Remove from history.json
  const success = DownloadLedger.deleteFromHistory(id);
  if (!success) {
    return res.status(500).json({ message: 'Failed to remove item from history' });
  }

  return res.status(200).json({ message: 'Deleted from history' });
});


export default router;
