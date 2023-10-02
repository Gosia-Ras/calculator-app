// Calculator Functions

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  switch (operator) {
    case "add":
      return firstNum + secondNum;
    case "subtract":
      return firstNum - secondNum;
    case "multiply":
      return firstNum * secondNum;
    case "divide":
      return firstNum / secondNum;
    default:
      return NaN;
  }
};

const getKeyType = (key) => {
  const action = key.dataset.action;

  if (!action) return "number";
  if (["add", "subtract", "multiply", "divide"].includes(action))
    return "operator";
  if (action === "delete") return "delete";
  return action;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = state;

  if (keyType === "number") {
    return displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "decimal") {
    if (!displayedNum.includes(".")) return displayedNum + ".";
    if (previousKeyType === "operator" || previousKeyType === "calculate")
      return "0.";
    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "clear") return "0";

  if (keyType === "delete") {
    return displayedNum === "0" ? "0" : displayedNum.slice(0, -1);
  }

  if (keyType === "calculate") {
    if (calculateClicked) {
      return displayedNum;
    }
    return firstValue
      ? previousKeyType === "calculate"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

let calculateClicked = false;

const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  const keyType = getKeyType(key);
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
        : displayedNum;
    calculateClicked = false;
  }

  if (keyType === "calculate") {
    if (calculateClicked) {
      return;
    }
    calculator.dataset.modValue =
      firstValue && previousKeyType === "calculate" ? modValue : displayedNum;
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

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  const clearButton = calculator.querySelector("[data-action=clear]");

  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  if (keyType === "operator") key.classList.add("is-depressed");
  if (keyType === "clear" && key.textContent !== "DEL")
    key.textContent = "RESET";
  if (keyType !== "clear") {
    clearButton.textContent = "RESET";
  }
};

// Calculator Event Listener

const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".calculator__display");
const keys = calculator.querySelector(".calculator__keys");

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});

// Theme Switcher

const toggler = document.querySelector(".toggler");
const body = document.body;

toggler.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
  } else if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("default");
  } else {
    body.classList.remove("default");
    body.classList.add("dark");
  }
});
