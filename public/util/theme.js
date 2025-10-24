const darkTheme = "dark-mode-ctx",
	lightTheme = "light-mode-ctx";
const windowTheme = window.matchMedia("(prefers-color-scheme: dark)");

function updateForDarkMode() {
	const html = document.querySelector("html");
	if (windowTheme.matches) {
		html.classList.add(darkTheme);
		html.classList.remove(lightTheme);
	} else {
		html.classList.add(lightTheme);
		html.classList.remove(darkTheme);
	}
}

windowTheme.addEventListener("change", updateForDarkMode);
updateForDarkMode();
