let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousInput = '';
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value || '0';
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }
  // Prevent multiple dots
  if (number === '.' && currentInput.includes('.')) return;
  currentInput += number;
  updateDisplay(currentInput);
}

function appendOperator(op) {
  if (currentInput === '' && previousInput === '') return;
  if (currentInput === '' && previousInput !== '') {
    // Change operator
    operator = op;
    return;
  }
  if (previousInput !== '' && operator && !shouldResetDisplay) {
    // If there is a pending operation, calculate first
    calculate();
  }
  operator = op;
  previousInput = currentInput;
  currentInput = '';
  shouldResetDisplay = false;
}

function calculate() {
  if (operator === null || shouldResetDisplay) return;
  if (currentInput === '') currentInput = previousInput;
  let prev = parseFloat(previousInput);
  let curr = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(curr)) return;
  let result;
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      if (curr === 0) {
        result = 'Error';
      } else {
        result = prev / curr;
      }
      break;
    default:
      return;
  }
  // Handle floating point precision
  if (typeof result === 'number') {
    result = parseFloat(result.toFixed(10));
  }
  updateDisplay(result);
  previousInput = result.toString();
  currentInput = '';
  operator = null;
  shouldResetDisplay = true;
}

function clearDisplay() {
  currentInput = '';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay('0');
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    e.preventDefault();
    appendOperator(e.key);
  }
  if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  }
  if (e.key === 'Escape') clearDisplay();
  if (e.key === 'Backspace') {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || '0');
    }
  }
});