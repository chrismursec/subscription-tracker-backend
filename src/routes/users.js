import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express();
require('dotenv').config();
const checkAuth = require('../middleware/check-auth');

import User from '../models/user';
import Subscription from '../models/subscription';

router.post('/signup', ({ body }, res, next) => {
	User.findOne({ username: body.username }).then((user) => {
		if (user) {
			return res.status(400).json({
				errorType: 'username',
				message: 'Username is taken'
			});
		} else if (!user) {
			bcrypt.hash(body.password, 10).then((hash) => {
				const user = new User({
					firstName: body.firstName,
					lastName: body.lastName,
					username: body.username,
					password: hash
				});
				user
					.save()
					.then((result) => {
						return res.status(200).json({
							message: 'User Created',
							result: result
						});
					})
					.catch((err) => {
						return res.status(500).json({ error: err });
					});
			});
		}
	});
});

router.post('/login', ({ body }, res, next) => {
	let fetchedUser;
	User.findOne({ username: body.username })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'Username or Password incorrect'
				});
			}
			fetchedUser = user;
			return bcrypt.compare(body.password, user.password);
		})
		.then((result) => {
			if (!result) {
				return res.status(401).json({
					message: 'Username or Password incorrect'
				});
			}
			const token = jwt.sign(
				{ username: fetchedUser.username, userId: fetchedUser._id },
				process.env.JWT_SECRET,
				{
					expiresIn: '1h'
				}
			);
			return res.status(200).json({
				token: token,
				expiresIn: 3600,
				userId: fetchedUser._id,
				firstName: fetchedUser.firstName,
				lastName: fetchedUser.lastName
			});
		})
		.catch((err) => {
			return res.status(401).json({
				error: err
			});
		});
});

router.delete('/:id', checkAuth, (req, res, next) => {
	Subscription.deleteMany({ owner: req.userData.userId }).then(() => {
		User.deleteOne({ _id: req.userData.userId }).then(() => {
			return res.status(200).json({
				message: 'deleted'
			});
		});
	});
});

router.put('/password', checkAuth, (req, res, next) => {
	const oldPassword = req.body.oldPassword;
	User.findOne({ _id: req.userData.userId })
		.then((user) => {
			return bcrypt.compare(oldPassword, user.password);
		})
		.then((result) => {
			if (!result) {
				return res.status(401).json({
					message: 'Incorrect Password'
				});
			}

			bcrypt.hash(req.body.newPassword, 10).then((newHashedPassword) => {
				User.updateOne(
					{ _id: req.userData.userId },
					{
						password: newHashedPassword
					}
				).then((result) => {
					console.log(result);
					res.status(200).json({
						message: 'Password Updated'
					});
				});
			});
		});
});
export default router;
