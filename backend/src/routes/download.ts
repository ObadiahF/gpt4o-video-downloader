import express from 'express';
import { handleAddDownloadCommand } from '../commands/AddDownloadCommand';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await handleAddDownloadCommand(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to schedule download' });
  }
});

export default router;
