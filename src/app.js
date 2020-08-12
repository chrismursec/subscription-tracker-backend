import express from 'express';
import mongoose from 'mongoose';
import subscriptionRoute from './routes/subscriptions';
import userRoute from './routes/users';
import statisticsRoute from './routes/user-statistics';
import cors from 'cors';
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
	console.log('Connected to mongo')
);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	next();
});

app.use('/api/subscriptions', subscriptionRoute);
app.use('/api/users', userRoute);
app.use('/api/statistics', statisticsRoute);
export default app;
