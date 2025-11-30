const userModel = require("../model/user.cjs");
const messageModel = require("../model/message.cjs");

const getMessages = async (req, res) => {
	const usersUUID = req.params.uuid;
	if (!usersUUID) return res.status(401).json({ status: "Error", message: "No content to share, you need an ID to continue" });
	try {
		const showComment = await messageModel.find({ user: usersUUID }).lean().populate("comments");

		const publicPost = await messageModel
			.find({ isPublic: true, user: { $ne: usersUUID } })
			.lean()
			.populate("comments");

		if (!showComment) return res.status(404).json({ status: "Error", mesage: "The current user is not founded" });

		res.status(200).json({ status: "Success", content: showComment, publicMessage: publicPost });
	} catch (err) {
		res.status(500).json({ status: "Error", message: "We're sorry owner server is stuck ", error: err.message });
	}
};
const postMessage = async (req, res) => {
	const userID = req.params.uuid;
	const { message, isPublic } = req.body;
	if (!userID) return res.status(401).json({ mesage: "A reference is required to make it happen" });

	if (!message || isPublic == undefined || isPublic == null) return res.status(401).json({ message: "Most of the value must are needed to make it happen" });
	if (message.length <= 3) return res.status(409).json({ message: "The post the you submited is too short" });
	try {
		const findUser = await userModel.findOne({ _id: userID }, { post: 1, userName: 1, firstName: 1, lastName: 1 });

		if (!findUser) {
			return res.status(404).json({ message: "Can't find the current user" });
		}
		const newMessage = await messageModel.insertMany({
			user: findUser.id,
			isPublic: isPublic,
			message: message,
			userName: findUser.userName,
			firstName: findUser.firstName,
			lastName: findUser.lastName,
			likes: {},
		});
		await userModel.updateOne({ id: userID }, { $push: { post: newMessage } });

		res.status(200).json({ mesage: "Your post is created " });
	} catch (err) {
		res.status(500).json({ message: "Sorry the current service is not working", status: "Error", error: err.message });
	}
};
const deleteMessage = async (req, res) => {
	const uuid = req.params.uuid;

	if (!uuid) return res.status(402).json({ message: "The user is required" });
	try {
		const findPost = await messageModel.findOne({ _id: uuid });
		const lookUser = await userModel.findOne({ _id: findPost.user });

		if (!findPost) {
			return res.status(401).json({ message: "no content to delete" });
		}
		if (!lookUser) return res.status(403).json({ message: "Can't continue without the reference of the user" });

		await lookUser.post.pull(findPost._id);
		await findPost.deleteOne();

		res.status(200).json({ mesage: "The post is deleted" });
	} catch (err) {
		res.status(500).json({ message: "Sorry our server have some issues ", error: err });
	}
};
const likeMessage = async (req, res) => {
	const uuid = req.params.uuid;
	const messageId = req.body.postId;
	if (!uuid || !messageId) {
		return res.status(403).json({ message: "Some content is missing that's why the process is not a success" });
	}
	try {
		const post = await messageModel.findById(messageId);
		if (!post) {
			return res.status(404).json({ message: "No post found" });
		}
		const isLiked = post.likes.get(uuid);

		if (isLiked) {
			post.likes.delete(uuid);
		} else {
			post.likes.set(uuid, true);
		}
		await post.save();

		res.status(200).json({ message: "Ok created", likeCounting: post.likes });
	} catch (err) {
		res.status(500).json({ message: "Sorry the server have some issues", error: err });
	}
};
const updateCommentName = async (req, res) => {
	const uuid = req.params.uuid;
	if (!uuid) return res.status(401).json({ message: "You can't continue" });
	try {
		const currentUser = await userModel.findById({ _id: uuid });

		if (!currentUser) return res.status(403).json({ message: "You are not allowed to continue" });

		const targetMessage = await messageModel.find({ user: currentUser.id });

		if (!targetMessage) return res.status(403).json({ message: "No post founded" });

		await messageModel.updateMany({ user: currentUser.id }, { userName: currentUser.userName });

		res.status(200).json({ message: "value changed" });
	} catch (err) {
		res.status(500).json({ message: "something went wrong", error: err.message });
	}
};
module.exports = { getMessages, postMessage, deleteMessage, likeMessage, updateCommentName };
