import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express();
require('dotenv').config();

import User from '../models/user';

router.post('/signup', ({ body }, res, next) => {
	User.findOne({ email: body.email }).then((user) => {
		if (user) {
			console.log('user exists');
			res.status(400).json({
				errorType: 'email',
				message: 'Email is taken'
			});
		} else if (!user) {
			bcrypt.hash(body.password, 10).then((hash) => {
				const user = new User({
					firstName: body.firstName,
					lastName: body.lastName,
					email: body.email,
					password: hash
				});
				user
					.save()
					.then((result) => {
						res.status(200).json({
							message: 'User Created',
							result: result
						});
					})
					.catch((err) => {
						res.status(500).json({ error: err });
					});
			});
		}
	});
});

router.post('/login', ({ body }, res, next) => {
	let fetchedUser;
	User.findOne({ email: body.email })
		.then((user) => {
			console.log(user);
			if (!user) {
				return res.status(401).json({
					message: 'Email or Password incorrect'
				});
			}
			fetchedUser = user;
			return bcrypt.compare(body.password, user.password);
		})
		.then((result) => {
			console.log(result);
			if (!result) {
				return res.status(401).json({
					message: 'Email or Password incorrect'
				});
			}
			const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_SECRET, {
				expiresIn: '1h'
			});
			res.status(200).json({
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

export default router;
