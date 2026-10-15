const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const f1Code = fs.readFileSync(path.join(root, "js/f1-racer.js"), "utf8");

// Mock DOM Environment
const createdElements = [];
const eventListeners = {};

class MockElement {
  constructor(id, tagName = "div") {
    this.id = id;
    this.tagName = tagName;
    this.children = [];
    this.classList = {
      classes: new Set(),
      add(...cls) { cls.forEach(c => this.classes.add(c)); },
      remove(...cls) { cls.forEach(c => this.classes.delete(c)); },
      contains(c) { return this.classes.has(c); }
    };
    this.style = {
      properties: {},
      setProperty(k, v) { this.properties[k] = v; },
      getPropertyValue(k) { return this.properties[k]; }
    };
    this.listeners = {};
    this.attributes = {};
    this.textContent = "";
    this.offsetHeight = 112;
    this.clientHeight = 800;
  }

  setAttribute(k, v) {
    this.attributes[k] = v;
  }

  getAttribute(k) {
    return this.attributes[k];
  }

  addEventListener(type, cb) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(cb);
  }

  appendChild(el) {
    this.children.push(el);
    el.parentNode = this;
    createdElements.push(el);
  }

  removeChild(el) {
    const idx = this.children.indexOf(el);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      el.parentNode = null;
    }
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  getBoundingClientRect() {
    return { top: 300, bottom: 400, left: 0, right: 100, height: 100, width: 100 };
  }
}

const elementsMap = {
  "f1-car-wrapper": new MockElement("f1-car-wrapper"),
  "f1-smoke-container": new MockElement("f1-smoke-container"),
  "f1-track-container": new MockElement("f1-track-container"),
  "f1-badge": new MockElement("f1-badge"),
  "f1-sector-label": new MockElement("f1-sector-label"),
  "f1-speed-label": new MockElement("f1-speed-label"),
  "hero": new MockElement("hero"),
  "skills": new MockElement("skills"),
  "work": new MockElement("work"),
  "experience": new MockElement("experience"),
  "contact": new MockElement("contact")
};

let scrollToCalls = [];

const mockWindow = {
  scrollY: 0,
  innerHeight: 800,
  innerWidth: 1200,
  scrollTo: (opts) => scrollToCalls.push(opts),
  addEventListener: (event, handler) => {
    eventListeners[event] = eventListeners[event] || [];
    eventListeners[event].push(handler);
  },
  matchMedia: () => ({ matches: false }),
  performance: {
    now: () => Date.now()
  },
  requestAnimationFrame: (cb) => setTimeout(cb, 16)
};

const mockDocument = {
  readyState: "complete",
  getElementById: (id) => elementsMap[id] || null,
  createElement: (tag) => {
    const el = new MockElement("", tag);
    return el;
  },
  addEventListener: (event, handler) => {
    eventListeners[event] = eventListeners[event] || [];
    eventListeners[event].push(handler);
  },
  documentElement: {
    scrollHeight: 4000
  }
};

// Execute f1-racer.js in mock sandbox
const runner = new Function(
  "window",
  "document",
  "performance",
  "requestAnimationFrame",
  "setTimeout",
  "clearTimeout",
  f1Code
);

runner(
  mockWindow,
  mockDocument,
  mockWindow.performance,
  mockWindow.requestAnimationFrame,
  setTimeout,
  clearTimeout
);

console.log("Testing F1 Racer initialization and interactions...");

// Check car pointer-events and accessibility setup
const car = elementsMap["f1-car-wrapper"];
assert.strictEqual(car.style.pointerEvents, "auto", "Car wrapper should have pointerEvents: auto");
assert.strictEqual(car.style.cursor, "pointer", "Car wrapper should have cursor: pointer");
assert.strictEqual(car.getAttribute("role"), "button", "Car wrapper should have role: button");
assert.strictEqual(car.getAttribute("tabindex"), "0", "Car wrapper should be keyboard focusable");

// Test Turbo Boost click
car.listeners["click"][0]();
assert.strictEqual(scrollToCalls.length, 1, "Clicking car must trigger scrollTo");
assert.deepStrictEqual(scrollToCalls[0], { top: 0, behavior: "smooth" });
console.log("Turbo boost interaction verified!");

// Test Scroll Listener exists
assert.ok(eventListeners["scroll"] && eventListeners["scroll"].length > 0, "Passive scroll listener must be attached");

// Simulate scroll down
mockWindow.scrollY = 800;
eventListeners["scroll"][0]();

assert.ok(car.style.top, "Car wrapper style.top must be updated dynamically on scroll");
assert.ok(parseFloat(car.style.top) > 56, "Car should move downwards when scrolled");

// Check drift class applied
assert.ok(car.classList.contains("drift-right"), "Scrolling down should trigger drift-right");
console.log("Drift and scroll tracking verified!");

// Check sector telemetry
const sector = elementsMap["f1-sector-label"];
assert.ok(sector.textContent.length > 0, "Sector text should not be empty");
console.log("Current sector text:", sector.textContent);

// Verify Zero Emojis in test file and source file
const emojiRegex = /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{200D}\u{FE0F}]/u;
assert.ok(!emojiRegex.test(f1Code), "js/f1-racer.js must contain zero emojis");

console.log("All F1 Racer unit tests passed successfully!");
