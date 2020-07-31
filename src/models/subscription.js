import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	startDate: {
		type: Date,
		required: true
	},
	startDateString: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	billingCycle: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	tags: {
		type: Array,
		required: true
	}
});

export default mongoose.model('Subscription', subscriptionSchema);
