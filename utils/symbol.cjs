const allSymbol = "~!@#$%^&*()+{}./,><?|'\";]:[-*/";
const symbols = [...allSymbol];

const nameToUppercase = (target) => {
	if (typeof target !== "string") return "";
	return target.replace(target[0], target[0].toUpperCase());
};

module.exports = { symbols, nameToUppercase };
