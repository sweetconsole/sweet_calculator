const fieldExample = document.getElementById("fieldExample");
const fieldEqually = document.getElementById("fieldEqually");

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
			fieldExample.innerText = digit.toString()
			programExample = digit.toString()
		} else {
			fieldExample.innerText += digit
			programExample += digit
		}

		console.log(programExample)
	})
})

buttonsSymbol.forEach(button => {
	button.addEventListener("click", (e) => {
		const symbol = button.innerText

		if (fieldExample.innerText === "0") {
			fieldExample.innerText = "0"
			programExample = "0"
		} else {
			fieldExample.innerText += symbol

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

buttonClear.addEventListener('click', function () {
	fieldExample.innerText = "0"
	fieldEqually.innerText = "0"
})

buttonBackspace.addEventListener("click", e => {
	const text = fieldExample.innerText

	if (text.length === 1) {
		fieldExample.innerText = "0"
	} else {
		fieldExample.innerText = text.substring(0, text.length - 1)
	}
})

buttonEqually.addEventListener('click', function() {
	const expression = fieldExample.innerText.trim()

	try {
		const result = parser.evaluate(expression)

		fieldEqually.innerText = fieldExample.innerText
		fieldExample.innerText = result
	} catch (e) {
		fieldEqually.innerText = "Ошибка"
	}

	console.log(fieldExample.innerText)
})

buttonPi.addEventListener("click", function() {
	if (fieldExample.innerText === "0") {
		fieldExample.innerText = "pi"
	} else {
		fieldExample.innerText += "pi"
	}

})

