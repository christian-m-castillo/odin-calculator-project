document.addEventListener("DOMContentLoaded", () => {
  // Select the display element where numbers and results will be shown
  const display = document.querySelector(".display");

  // Select all buttons on the calculator
  const buttons = document.querySelectorAll("button");

  // This variable stores the current number being entered
  let currentInput = "";

  // This variable stores the first number in a calculation
  let firstOperand = null;

  // This variable keeps track of which mathematical operator (+, -, *, /) is being used
  let operator = null;

  // This helps determine if the next number entered is part of a new operation
  let waitingForSecondOperand = false;

  // Loop through all buttons and attach a click event listener to each one
  buttons.forEach(button => {
    button.addEventListener("click", () => handleButtonClick(button.textContent));
  });

  /**
   * Handles what happens when a button is clicked.
   * Determines whether it's a number, an operator, an equal sign, or a clear button.
   */
  function handleButtonClick(value) {
    if (!isNaN(value) || value === ".") {
      // If the button is a number or a decimal point, handle it accordingly
      handleNumberInput(value);
    } else if (["+", "-", "*", "/"].includes(value)) {
      // If the button is an operator, process it
      handleOperator(value);
    } else if (value === "=") {
      // If the button is the equals sign, calculate the result
      handleEquals();
    } else if (value === "C") {
      // If the button is "C" (clear), reset the calculator
      clearCalculator();
    }

    // Update the display to reflect the current input or result
    updateDisplay();
  }

  /**
   * Handles number and decimal point inputs.
   * Ensures that numbers are entered correctly and decimals aren't duplicated.
   */
  function handleNumberInput(number) {
    if (waitingForSecondOperand) {
      // If we are waiting for a second number, reset the input
      currentInput = number;
      waitingForSecondOperand = false;
    } else {
      // Prevent multiple decimal points in the same number
      if (number === "." && currentInput.includes(".")) return;

      // If the current input is 0, replace it with the new number; otherwise, append it
      currentInput = currentInput === "0" ? number : currentInput + number;
    }
  }

  /**
   * Handles operator selection (+, -, *, /).
   * Stores the first number and operator for later calculation.
   */
  function handleOperator(selectedOperator) {
    if (firstOperand === null) {
      // If no previous number is stored, save the current input as the first operand
      firstOperand = parseFloat(currentInput);
    } else if (!waitingForSecondOperand) {
      // If an operator was already chosen and a second number exists, perform the previous operation
      firstOperand = operate(firstOperand, parseFloat(currentInput), operator);
    }

    // Store the chosen operator for the next calculation step
    operator = selectedOperator;

    // Indicate that the next number entered will be the second operand
    waitingForSecondOperand = true;
  }

  /**
   * Handles the equals button.
   * Executes the calculation and displays the result.
   */
  function handleEquals() {
    if (firstOperand !== null && operator) {
      // Perform the calculation with the stored first operand, operator, and current input
      currentInput = operate(firstOperand, parseFloat(currentInput), operator).toString();

      // Reset first operand and operator after calculation
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
    }
  }

  /**
   * Clears the calculator and resets all values.
   */
  function clearCalculator() {
    currentInput = "";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
  }

  /**
   * Updates the calculator display.
   * If there's no input, show "0" as the default value.
   */
  function updateDisplay() {
    display.textContent = currentInput || "0";
  }

  /**
   * Performs the actual mathematical operation.
   * Takes two numbers and an operator and returns the result.
   */
  function operate(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : "Err"; // Prevents division by zero
      default: return b; // If no valid operation, return the second number as is
    }
  }
});
