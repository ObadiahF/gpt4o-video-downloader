import express from 'express';
import cors from 'cors';
import path from 'path';
import downloadRoute from './routes/download';
import queueRoute from './routes/queue';
import historyRoute from './routes/history';
import videoRoute from './routes/video';

import { DownloadLedger } from './queue/DownloadLedger';
import { DownloadWorker } from './queue/DownloadWorker';

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong' });
});

app.use('/api/download', downloadRoute);
app.use('/api/queue', queueRoute);
app.use('/api/history', historyRoute);
app.use('/api/video', videoRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
DownloadLedger.init();
DownloadWorker.start();