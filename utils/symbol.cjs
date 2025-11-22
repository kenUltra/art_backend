const allSymbol = "~!@#$%^&*()+{}./,><?|'\";]:[-*/";
const symbols = [...allSymbol];

const nameToUppercase = (target) => {
	if (typeof target !== "string") return "";
	const slipt = [...target];
	const res = slipt.map((res) => {
		return res.toLocaleLowerCase();
	});
	const fullName = res.join("");
	return fullName.replace(fullName[0], fullName[0].toUpperCase());
};

module.exports = { symbols, nameToUppercase };
