const commentModel = require("../model/comment.cjs");
const userMesage = require("../model/message.cjs");
const creatorModel = require("../model/user.cjs");

const makeComment = async (req, res) => {
	const userRef = req.params.uuid;
	const { refMessage } = req.query;
	const { comment } = req.body;

	if (!userRef) return res.status(401).json({ message: "No comment can't be made" });

	if (!refMessage) return res.status(401).json({ message: "Your need to provide a token" });
	try {
		const searchUser = await userMesage.findOne({ _id: refMessage });
		const getUserName = await creatorModel.findOne({ _id: userRef });
		// const searchUser = await userMesage.findOne({ user: userRef, _id: refMessage });
		if (!searchUser) return res.status(404).json({ message: "No user founded" });
		if (!getUserName) return res.status(405).json({ message: "The user is needed" });

		await commentModel.insertMany({ message: comment, postToComment: searchUser._id, sender: getUserName.userName, likes: {} }, { timestamps: true });

		const newPostId = await commentModel.findOne({ message: comment });

		searchUser.comments.push(newPostId._id);

		await searchUser.save();

		res.status(200).json({ mesage: "Everything is ok" });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong", error: err.message });
	}
};
const likeComment = async (req, res) => {
	const userId = req.params.uuid;
	const commnetID = req.body.commnetRef;
	z;
	if (!userId || !commnetID) return res.status(401).json({ message: "Some content is missing" });
	try {
		const postTolike = await commentModel.findById(commnetID);
		if (!postTolike) return res.status(404).json({ message: "Error no post to like founded" });
		const likeData = postTolike.likes.get(commnetID);
		if (likeData) {
			postTolike.likes.delete(userId);
		} else {
			postTolike.likes.set(userId, true);
		}
		await postTolike.save();
		await commentModel.findByIdAndUpdate(uuid, { $set: { likes: postTolike.likes } }, { new: true });
		res.status(200).json({ message: "Like status changed" });
	} catch (err) {
		res.status(500).json({ message: "Error happen ", error: err.message });
	}
};
const deleteComment = async (req, res) => {
	const commentId = req.params.uuid;
	if (!commentId) return res.status(401).json({ message: "Missing value" });

	try {
		const searchComment = await commentModel.findOne({ _id: commentId });
		const searchMessage = await userMesage.findOne({ $comment: searchComment });

		if (!searchComment) return res.status(404).json({ messsage: "Stop due to some error" });
		if (!searchMessage) return res.status(404).json({ message: "The content is not available" });

		await searchMessage.updateOne({ $pull: { comments: searchComment._id } });
		await searchComment.deleteOne();

		searchMessage.save();
		res.status(201).json({ message: "Deleted without any issues" });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong", error: err.message });
	}
};
const getComment = async (req, res) => {
	const owner = req.params.uuid;
	const limit = req.query.limit;

	if (!owner) return res.status(401).json({ message: "Nothing will happen unless all requirement are put in" });
	try {
		const allComment = await commentModel.find({ postToComment: owner });
		if (!allComment) return res.status(400).json({ message: "No such message is found" });

		res.status(200).json(allComment);
	} catch (err) {
		res.status(500).json({ message: "Error happen", error: err.message });
	}
};
module.exports = { makeComment, likeComment, deleteComment, getComment };
