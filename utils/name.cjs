const correctName = (name) => {
	const changeName = [...name].map((res) => {
		return res.toLocaleLowerCase();
	});
	changeName[0] = name[0].toLocaleUpperCase();
	return changeName.join("");
};

module.exports = { correctName };
