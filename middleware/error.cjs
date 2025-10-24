const errorHandler = (err, req, res, next) => {
	res.status(500).json({ status: 500, message: err.message, host: req.hostname });
};

module.exports = { errorHandler };
