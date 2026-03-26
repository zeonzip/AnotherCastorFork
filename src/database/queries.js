import UserSchema from "./schemas/user.js";

export const fetchOrCreateUser = async (userId) =>
{
	let user = await UserSchema.findOne({ userId }).lean();

	if (user)
	{
		return user;
	}

	user = new UserSchema({ userId });
	await user.save();
	return user;
};

export const updateUser = (userId, data) =>
{
	return UserSchema.findOneAndUpdate({ userId }, data, {
		upsert: true
	});
};

export const fetchGuildLeaderboard = async () =>
{
	return UserSchema.find({}).sort({ balance: -1 }).limit(10).lean();
};

export default {
	fetchOrCreateUser,
	updateUser,
	fetchGuildLeaderboard
};
