import express from 'express';
const router = express.Router();
import Subscription from '../models/subscription';
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, (req, res, next) => {
	console.log(req.userData);
	const subscription = new Subscription({
		title: req.body.title,
		startDate: req.body.startDate,
		startDateString: req.body.startDateString,
		price: req.body.price,
		billingCycle: req.body.billingCycle,
		owner: req.userData.userId,
		tags: req.body.tags
	});

	console.log(subscription);

	subscription.save().then((createdSubscription) => {
		res.status(200).json({
			message: 'Added',
			subscription: createdSubscription,
			id: createdSubscription._id
		});
	});
});

router.get('', checkAuth, (req, res, next) => {
	const pagesize = +req.query.pagesize;
	const currentPage = +req.query.page;

	const subscriptionQuery = Subscription.find({ owner: req.userData.userId });
	let fetchedSubscriptions;

	if (pagesize && currentPage) {
		subscriptionQuery.skip(pagesize * (currentPage - 1)).limit(pagesize);
	}

	subscriptionQuery
		.then((documents) => {
			fetchedSubscriptions = documents;
			return Subscription.find({ owner: req.userData.userId }).countDocuments();
		})
		.then((count) => {
			res.status(200).json({
				message: 'Subs Fetched',
				subscriptions: fetchedSubscriptions,
				maxPosts: count
			});
		});
});

router.get('/:id', checkAuth, (req, res, next) => {
	Subscription.findOne({ _id: req.params.id, owner: req.userData.userId }).then((subscription) => {
		if (subscription) {
			res.status(200).json(subscription);
		} else {
			res.status(400).json({
				message: 'Post not found'
			});
		}
	});
});

router.put('/:id', checkAuth, (req, res, next) => {
	const subscription = new Subscription({
		_id: req.body.id,
		title: req.body.title,
		price: req.body.price,
		startDate: req.body.startDate,
		startDateString: req.body.startDateString,
		billingCycle: req.body.billingCycle,
		tags: req.body.tags,
		owner: req.body.owner
	});
	Subscription.updateOne({ _id: req.params.id, owner: req.userData.userId }, subscription).then((result) => {
		if (result.ok > 0) {
			console.log(result);
			res.status(200).json({ message: 'Update Success' });
			console.log(result);
		} else {
			res.status(401).json({ message: 'Subscription not saved' });
		}
	});
});

router.delete('/:id', checkAuth, (req, res, next) => {
	Subscription.deleteOne({
		_id: req.params.id,
		owner: req.userData.userId
	}).then((result) => {
		if (result.n > 0) {
			res.status(200).json({ message: 'Deleted' });
		} else {
			res.status(401).json({ message: 'Not Authorized' });
		}
	});
});

export default router;
