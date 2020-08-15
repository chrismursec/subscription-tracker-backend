import express from 'express';
const router = express.Router();
import Subscription from '../models/subscription';
const checkAuth = require('../middleware/check-auth');

router.get('/tag-data', checkAuth, (req, res, next) => {
	Subscription.find({ owner: req.userData.userId }).select('tags').exec().then((docs) => {
		let tagList = [];
		let tagCount = {
			apps: 0,
			bills: 0,
			donations: 0,
			entertainment: 0,
			finances: 0,
			gaming: 0,
			personalCare: 0,
			shopping: 0
		};
		docs.map((doc) => {
			if (doc.tags.includes('Apps')) {
				tagCount.apps++;
			}
			if (doc.tags.includes('Bills')) {
				tagCount.bills++;
			}
			if (doc.tags.includes('Donations')) {
				tagCount.donations++;
			}
			if (doc.tags.includes('Entertainment')) {
				tagCount.entertainment++;
			}
			if (doc.tags.includes('Finances')) {
				tagCount.finances++;
			}
			if (doc.tags.includes('Gaming')) {
				tagCount.gaming++;
			}
			if (doc.tags.includes('Personal Care')) {
				tagCount.personalCare++;
			}
			if (doc.tags.includes('Shopping')) {
				tagCount.shopping++;
			}

			tagList = [ ...tagList, ...doc.tags ];
		});
		const response = {
			count: docs.length,
			tags: tagList,
			tagCount: tagCount
		};
		res.status(200).json(response);
	});
});

router.get('/costs', checkAuth, (req, res, next) => {
	Subscription.find({ owner: req.userData.userId })
		.select('title price')
		// .sort(`field price`)
		.then((docs) => {
			console.log(docs);

			const titles = [];
			const prices = [];

			docs.map((doc) => {
				titles.push(doc.title);
				prices.push(doc.price);
			});

			console.log(titles);
			console.log(prices);

			return res.status(200).json({
				subscriptionTitles: titles,
				subscriptionPrices: prices
			});
		});
});

export default router;
