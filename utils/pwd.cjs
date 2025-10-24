class PasswordManager {
	_password;
	_changeValue = "_]*-!_";
	_lastValue = "/~_p?+|";
	constructor(password) {
		this._password = password;
	}

	hashPassword() {
		const str = this._password.replaceAll(" ", "");
		const speadPassword = [...str];

		speadPassword.push(this._lastValue);
		return speadPassword.join(this._changeValue);
	}

	decryptPassword(password) {
		const rmSameValue = password.replaceAll(this._changeValue, "");
		const response = rmSameValue.replaceAll(this._lastValue, "");
		return response;
	}

	async comparePassKey(promptValue) {
		const rmSpacer = promptValue.replaceAll(" ", "");
		return this.decryptPassword(this._password) == rmSpacer;
	}
}

module.exports = PasswordManager;
