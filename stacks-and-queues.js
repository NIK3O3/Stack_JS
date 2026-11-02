"use strict";

class Stack {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  push(value) {
    this.head = { value, next: this.head };
    this.size += 1;
  }

  pop() {
    const value = this.head.value;
    this.head = this.head.next;
    this.size -= 1;
    return value;
  }

  peek() {
    return this.head.value;
  }

  empty() {
    return this.head === null;
  }
}

function visitRange(start, end, action) {
  if (start >= end) return true;
  if (end - start === 1) return action(start) !== false;

  const middle = start + Math.floor((end - start) / 2);
  return visitRange(start, middle, action) && visitRange(middle, end, action);
}

// 1. Валідні дужки
function isValid(s) {
  const stack = new Stack();
  const matching = { ")": "(", "]": "[", "}": "{" };

  const valid = visitRange(0, s.length, (index) => {
    const bracket = s[index];

    if (bracket === "(" || bracket === "[" || bracket === "{") {
      stack.push(bracket);
      return true;
    }

    if (stack.empty()) return false;
    return stack.pop() === matching[bracket];
  });

  return valid && stack.empty();
}

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 2. Inorder: ліве піддерево, поточний вузол, праве піддерево
function inorderTraversal(root) {
  const values = [];

  function visit(node) {
    if (node === null) return;

    visit(node.left);
    values[values.length] = node.val;
    visit(node.right);
  }

  visit(root);
  return values;
}

// 3. Мінімальний стек. Разом зі значенням зберігаємо мінімум до цієї позиції
class MinStack {
  constructor() {
    this.stack = new Stack();
  }

  push(val) {
    let minimum = val;

    if (!this.stack.empty() && this.stack.peek().minimum < minimum) {
      minimum = this.stack.peek().minimum;
    }

    this.stack.push({ val, minimum });
  }

  pop() {
    this.stack.pop();
  }

  top() {
    return this.stack.peek().val;
  }

  getMin() {
    return this.stack.peek().minimum;
  }
}

// 4. Черга через два стеки. Використовуються лише стандартні операції стека
class MyQueue {
  constructor() {
    this.incoming = new Stack();
    this.outgoing = new Stack();
  }

  push(x) {
    this.incoming.push(x);
  }

  moveToOutput() {
    if (!this.outgoing.empty()) return;

    const transfer = () => {
      if (this.incoming.empty()) return;
      this.outgoing.push(this.incoming.pop());
      transfer();
    };

    transfer();
  }

  pop() {
    this.moveToOutput();
    return this.outgoing.pop();
  }

  peek() {
    this.moveToOutput();
    return this.outgoing.peek();
  }

  empty() {
    return this.incoming.empty() && this.outgoing.empty();
  }
}

// 5. Рекурсивне декодування вкладених блоків k[...]
function decodeString(s) {
  let index = 0;

  function readNumber(value = 0) {
    if (index === s.length || s[index] < "0" || s[index] > "9") return value;

    const digit = s.charCodeAt(index) - 48;
    index += 1;
    return readNumber(value * 10 + digit);
  }

  function repeatText(text, count) {
    if (count === 0) return "";
    if (count === 1) return text;

    const half = repeatText(text, Math.floor(count / 2));
    return count % 2 === 0 ? half + half : half + half + text;
  }

  function decodePart() {
    if (index === s.length || s[index] === "]") return "";

    const character = s[index];

    if (character >= "0" && character <= "9") {
      const count = readNumber();
      index += 1;
      const content = decodePart();
      index += 1;

      return repeatText(content, count) + decodePart();
    }

    index += 1;
    return character + decodePart();
  }

  return decodePart();
}

// 6. Обчислити вираз у зворотній польській нотації
function evalRPN(tokens) {
  const stack = new Stack();

  visitRange(0, tokens.length, (index) => {
    const token = tokens[index];

    if (token !== "+" && token !== "-" && token !== "*" && token !== "/") {
      stack.push(Number(token));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();
    let result;

    switch (token) {
      case "+":
        result = left + right;
        break;
      case "-":
        result = left - right;
        break;
      case "*":
        result = left * right;
        break;
      case "/":
        result = Math.trunc(left / right);
        break;
    }

    stack.push(result === 0 ? 0 : result);
  });

  const answer = stack.pop();
  return answer === 0 ? 0 : answer;
}

// 7. Довжина найдовшого правильного підрядка з круглих дужок
function longestValidParentheses(s) {
  const indices = new Stack();
  indices.push(-1);
  let maximum = 0;

  visitRange(0, s.length, (index) => {
    if (s[index] === "(") {
      indices.push(index);
      return;
    }

    indices.pop();

    if (indices.empty()) {
      indices.push(index);
    } else {
      const length = index - indices.peek();
      if (length > maximum) maximum = length;
    }
  });

  return maximum;
}

console.log("1:", isValid("()"));
console.log("1:", isValid("()[]{}"));
console.log("1:", isValid("(]"));

const root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
console.log("2:", inorderTraversal(root));
console.log("2:", inorderTraversal(null));
console.log("2:", inorderTraversal(new TreeNode(1)));

const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log("3: getMin:", minStack.getMin());
minStack.pop();
console.log("3: top:", minStack.top());
console.log("3: getMin:", minStack.getMin());

const queue = new MyQueue();
queue.push(1);
queue.push(2);
console.log("4: peek:", queue.peek());
console.log("4: pop:", queue.pop());
console.log("4: empty:", queue.empty());

console.log("5:", decodeString("3[a]2[bc]"));
console.log("5:", decodeString("3[a2[c]]"));
console.log("5:", decodeString("2[abc]3[cd]ef"));

console.log("6:", evalRPN(["2", "1", "+", "3", "*"]));
console.log("6:", evalRPN(["4", "13", "5", "/", "+"]));
console.log(
  "6:",
  evalRPN([
    "10",
    "6",
    "9",
    "3",
    "+",
    "-11",
    "*",
    "/",
    "*",
    "17",
    "+",
    "5",
    "+",
  ]),
);

console.log("7:", longestValidParentheses("(()"));
console.log("7:", longestValidParentheses(")()())"));
console.log("7:", longestValidParentheses(""));
