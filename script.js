// Calculator Functions

const performCalculation = (num1, operation, num2) => {
  const firstNumber = parseFloat(num1);
  const secondNumber = parseFloat(num2);

  if (operation === "divide" && secondNumber === 0) {
    alert("You really shouldn't do that");
  }

  let result;
  switch (operation) {
    case "add":
      result = firstNumber + secondNumber;
      break;
    case "subtract":
      result = firstNumber - secondNumber;
      break;
    case "multiply":
      result = firstNumber * secondNumber;
      break;
    case "divide":
      result = firstNumber / secondNumber;
      break;
    default:
      return NaN;
  }

  // Round the result to 4 decimal places if necessary
  return Math.round(result * 10000) / 10000;
};

const determineKeyType = (key) => {
  const actionType = key.dataset.action;

  if (!actionType) return "number";
  if (["add", "subtract", "multiply", "divide"].includes(actionType))
    return "operator";
  return actionType;
};

const generateResultDisplay = (key, currentDisplay, calculatorState) => {
  const keyValue = key.textContent;
  const keyType = determineKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = calculatorState;

  if (keyType === "number") {
    return currentDisplay === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
      ? keyValue
      : currentDisplay + keyValue;
  }

  if (keyType === "decimal") {
    if (!currentDisplay.includes(".")) return currentDisplay + ".";
    if (previousKeyType === "operator" || previousKeyType === "calculate")
      return "0.";
    return currentDisplay;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? performCalculation(firstValue, operator, currentDisplay)
      : currentDisplay;
  }

  if (keyType === "clear") return "0";

  if (keyType === "delete") {
    return currentDisplay === "0" ? "0" : currentDisplay.slice(0, -1);
  }

  if (keyType === "calculate") {
    if (calculateClicked) {
      return currentDisplay;
    }
    return firstValue
      ? previousKeyType === "calculate"
        ? performCalculation(currentDisplay, operator, modValue)
        : performCalculation(firstValue, operator, currentDisplay)
      : currentDisplay;
  }
};

let calculateClicked = false;

const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  currentDisplay
) => {
  const keyType = determineKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } =
    calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
        ? calculatedValue
        : currentDisplay;
    calculateClicked = false;
  }

  if (keyType === "calculate") {
    if (calculateClicked) {
      return;
    }
    calculator.dataset.modValue =
      firstValue && previousKeyType === "calculate" ? modValue : currentDisplay;
    calculateClicked = true;
  }

  if (keyType === "clear" && key.textContent === "DEL") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.previousKeyType = "";
    calculateClicked = false;
  }
};

const updateVisualAppearance = (key, calculator) => {
  const keyType = determineKeyType(key);
  const clearButton = calculator.querySelector("[data-action=clear]");

  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  if (keyType === "operator") key.classList.add("is-depressed");
  if (keyType === "clear" && key.textContent !== "DEL")
    key.textContent = "RESET";
  if (keyType !== "clear") clearButton.textContent = "RESET";
};

// Calculator Event Listener

const calculator = document.querySelector(".calculator-container");
const display = calculator.querySelector(".calculator-display");
const keys = calculator.querySelector(".calculator-keys");

keys.addEventListener("click", (event) => {
  if (!event.target.matches("button")) return;

  const key = event.target;
  const currentDisplay = display.textContent;
  const resultDisplay = generateResultDisplay(
    key,
    currentDisplay,
    calculator.dataset
  );

  display.textContent = resultDisplay;
  updateCalculatorState(key, calculator, resultDisplay, currentDisplay);
  updateVisualAppearance(key, calculator);
});

// Theme Switcher

const themeToggler = document.querySelector(".theme-toggler");
const body = document.body;

themeToggler.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
  } else if (body.classList.contains("light")) {
    body.classList.replace("light", "default");
  } else {
    body.classList.replace("default", "dark");
  }
});
