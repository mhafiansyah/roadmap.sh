import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import guessRoutes from './modules/guess/guess.routes.js'
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', guessRoutes);
app.use('/admin', adminRoutes);

// app.get('/', (req, res) => {
//     // res.json({ message: "Welcome!" });
// });

export { app };