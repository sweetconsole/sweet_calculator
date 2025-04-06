

const fieldEqually = document.getElementById("fieldEqually");
const fieldExample = document.getElementById("fieldExample");
const buttonClear = document.getElementById("buttonClear")
const buttonBackspace = document.getElementById("buttonBackspace")
const buttonEqually = document.getElementById("buttonEqually")
const buttonPi = document.getElementById("buttonPi");
const buttonsDigit = document.querySelectorAll(".keyboard__button_digit")
const buttonsSymbol = document.querySelectorAll(".keyboard__button-symbol")

let programExample = "0"

buttonsDigit.forEach(button => {
	button.addEventListener("click", (e) => {
		const digit = Number(button.innerText)

		if (fieldExample.innerText === "0") {
			fieldExample.innerHTML = digit.toString()
			programExample = digit.toString()
		} else {
			fieldExample.innerHTML += digit
			programExample += digit
		}

		console.log(programExample)
	})
})

buttonsSymbol.forEach(button => {
	button.addEventListener("click", (e) => {
		const symbol = button.innerText

		if (fieldExample.innerText === "0") {
			fieldExample.innerHTML = "0"
			programExample = "0"
		} else {
			fieldExample.innerHTML += symbol

			if (symbol === "×") {
				programExample += "*"
			} else if (symbol === ",") {
				programExample += "."
			} else {
				programExample += symbol
			}

			console.log(programExample)
		}
	})
})

buttonClear.addEventListener('click', e => {
	fieldExample.innerText = "0"
})

buttonBackspace.addEventListener("click", e => {
	const text = fieldExample.innerText

	if (text.length === 1) {
		fieldExample.innerText = "0"
	} else {
		fieldExample.innerText = text.substring(0, text.length - 1)
	}
})

buttonEqually.addEventListener('click', e => {
	fieldExample.innerText = "Hello, World!"
})

buttonPi.addEventListener("click", e => {
	const example = fieldExample.innerText

	if (example === "0" || example.slice()) {
		fieldExample.innerText = "pi"
	} else {
		fieldExample.innerText += "pi"
	}
})

