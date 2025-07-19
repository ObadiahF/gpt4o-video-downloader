import express from 'express';
import { DownloadLedger } from '../queue/DownloadLedger';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(DownloadLedger.getQueue());
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const success = await DownloadLedger.remove(id);
  if (success) res.status(200).json({ message: 'Unqueued' });
  else res.status(404).json({ error: 'Not found' });
}); 

export default router;
