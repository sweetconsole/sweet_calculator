
class MathExpressionParser {
	constructor() {
		this.operators = {
			"+": 1,
			"-": 1,
			"*": 2,
			"/": 2,
			"^": 3,
			"sqrt": 3,
			"sin": 3,
			"cos": 3,
			"tan": 3,
			"cot": 3,
			"asin": 3,
			"atan": 3,
			"log": 3,
			"exp": 3,
			"round": 3,
			"floor": 3,
			"ceil": 3,
			"abs": 3,
			"u-": 4
		}

		this.operatorArity = {
			"round": 2,
			"sqrt": 2,
			"sin": 1,
			"cos": 1,
			"tan": 1,
			"cot": 1,
			"asin": 1,
			"atan": 1,
			"log": 1,
			"exp": 1,
			"floor": 1,
			"ceil": 1,
			"abs": 1,
		}

		this.constants = {
			"e": Math.E,
			"pi": Math.PI,
		}
	}

	isValidExpression(expr) {
		return /^[\d\s+\-*/().\^sqrtincoalgeexpπatround,flcebs]+$/.test(expr)
	}

	isNumber(token) {
		return !isNaN(parseFloat(token)) && isFinite(token)
	}

	isConstant(token) {
		return token in this.constants
	}

	isFunction(token) {
		return token in this.operatorArity
	}

	tokenize(expr) {
		expr = expr.replace(/π/g, "pi")
		expr = expr.replace(/,/g, " , ")
		expr = expr.replace(/sqrt|sin|cos|tan|cot|asin|atan|log|exp|round|floor|ceil|abs/g, " $& ")
		expr = expr.replace(/([+\-*/\^()])/g, " $1 ")

		let tokens = expr.split(" ").filter(token => token.length > 0)

		tokens = this.processUnaryMinus(tokens)

		return tokens.map(token => token.toLowerCase())
	}

	processUnaryMinus(tokens) {
		const result = []
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i] === "-") {
				if (i === 0 || ["(", ",", "+", "-", "*", "/", "^"].includes(tokens[i-1])) {
					result.push("u-")
				} else {
					result.push("-")
				}
			} else {
				result.push(tokens[i])
			}
		}
		return result
	}

	toRPN(tokens) {
		const output = []
		const stack = []
		let argCount = new Map()

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i]

			if (this.isNumber(token) || this.isConstant(token)) {
				output.push(token)
			} else if (this.isFunction(token)) {
				stack.push(token)
				argCount.set(token, 0)
			} else if (token === ",") {
				while (stack.length > 0 && stack[stack.length - 1] !== "(") {
					output.push(stack.pop())
				}
				let lastFunc = stack.find(t => this.isFunction(t));

				if (lastFunc) {
					argCount.set(lastFunc, argCount.get(lastFunc) + 1);
				}
			} else if (token in this.operators) {
				while (stack.length > 0 &&
				stack[stack.length - 1] !== "(" &&
				this.operators[stack[stack.length - 1]] >= this.operators[token]) {
					output.push(stack.pop())
				}
				stack.push(token)
			} else if (token === "(") {
				stack.push(token)
			} else if (token === ")") {
				while (stack.length > 0 && stack[stack.length - 1] !== '(') {
					output.push(stack.pop())
				}
				stack.pop()

				if (stack.length > 0 && this.isFunction(stack[stack.length - 1])) {
					let func = stack.pop()
					argCount.set(func, argCount.get(func) + 1)
					output.push(`${func}:${argCount.get(func)}`)
				}
			}
		}

		while (stack.length > 0) {
			output.push(stack.pop())
		}

		return output
	}

	evaluateRPN(rpn) {
		const stack = []

		for (let token of rpn) {
			if (this.isConstant(token)) {
				stack.push(this.constants[token])
			} else if (this.isNumber(token)) {
				stack.push(parseFloat(token))
			} else if (token.includes(":")) {
				const [func, arityStr] = token.split(":");
				const arity = parseInt(arityStr)

				const args = []
				for (let i = 0; i < arity; i++) {
					args.unshift(stack.pop())
				}

				switch (func) {
					case "round":
						const [x, d = 0] = args
						const factor = Math.pow(10, d)
						stack.push(Math.round(x * factor) / factor)
						break;
					case "floor":
						stack.push(Math.floor(args[0]))
						break
					case "ceil":
						stack.push(Math.ceil(args[0]))
						break
					case "abs":
						stack.push(Math.abs(args[0]))
						break
					case "sqrt":
						if (args[0] < 0) throw new Error("Нельзя вычислить чётные корень от отрицательного числа")
						stack.push(Math.sqrt(args[0]))
						break
					case "sin":
						stack.push(Math.sin(args[0]))
						break
					case "cos":
						stack.push(Math.cos(args[0]))
						break
					case "tan":
						if (Math.abs(Math.cos(args[0])) < Number.EPSILON) {
							throw new Error("Тангес нельзя вычислить для данного угла")
						}
						stack.push(Math.tan(args[0]));
						break
					case "cot":
						if (Math.abs(Math.sin(args[0])) < Number.EPSILON) {
							throw new Error("Котангес нельзя вычислить для данного угла")
						}
						stack.push(1 / Math.tan(args[0]));
						break
					case "asin":
						if (Math.abs(args[0]) > 1) {
							throw new Error("Арксинус определяется только для значений от -1 до 1");
						}
						stack.push(Math.asin(args[0]))
						break
					case "atan":
						stack.push(Math.atan(args[0]))
						break
					case "log":
						if (args[0] <= 0) throw new Error("Логарифм можно вычислить только от натурального числа");
						stack.push(Math.log(args[0]))
						break
					case "exp":
						stack.push(Math.exp(args[0]))
						break
				}
			} else {
				if (token === "u-") {
					const a = stack.pop()
					stack.push(-a)
				} else {
					const b = stack.pop()
					const a = stack.pop()

					switch (token) {
						case "+":
							stack.push(a + b)
							break
						case "-":
							stack.push(a - b)
							break
						case "*":
							stack.push(a * b)
							break
						case "/":
							if (Math.abs(b) < Number.EPSILON) throw new Error("Делать на ноль нельзя")
							stack.push(a / b)
							break
						case "^":
							stack.push(Math.pow(a, b))
							break
					}
				}
			}
		}

		return stack[0]
	}

	evaluate(expr) {
		try {
			if (!this.isValidExpression(expr)) {
				throw new Error("Недопустимое выражение")
			}

			const tokens = this.tokenize(expr)
			const rpn = this.toRPN(tokens)
			const result = this.evaluateRPN(rpn)

			if (!isFinite(result)) {
				throw new Error("Был получен неверный результат")
			}

			return result
		} catch (error) {
			throw new Error(`Ошибка при вычислении выражения: ${error.message}`)
		}
	}
}

const parser = new MathExpressionParser()