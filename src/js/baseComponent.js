class HtmlComponent {
  #node = null;
  constructor(templateId, parentNode) {
    this.template = document.getElementById(templateId);
    this.parentNode = parentNode;
    this.node = this.template.content.cloneNode(true);
    let that = this;
    this.node.children[0].addEventListener("click", function () {
      that.onClick();
    });
    this.parentNode.appendChild(this.node);
    this.#node = parentNode.lastElementChild;
    this.nodeElement = parentNode.lastElementChild;
  }
  eventsObj = {
    'click': function() { return false }
  }
  onClick(e){
    this.#node.classList.add("selected-click");
    this.eventsObj.click(this);
    console.log("click component", this);
  }
  select(){
    this.#node.classList.add("selected-click");
  }
  unselect(){
    this.#node.classList.remove("selected-click");
    console.log("unselect component", this);
  }
  on(eventName,clbk){
    let evnt = this.eventsObj[eventName];
    if (evnt && typeof clbk === 'function') this.eventsObj[eventName] = clbk;
  }
  addListener(event, listener, options = false) {
    this.node.addEventListener(event, listener, options);
  }
  getSettings(){
    return document.getElementById('base-setting').innerHTML;
  }
  initSettingsEvents(parentSetting){
    let styles = window.getComputedStyle(this.#node);
    let paddingInput = parentSetting.querySelector('[data-setting="base-padding"]')
    paddingInput.value = parseInt(window.getComputedStyle(this.#node).padding);
    let paddingLeftInput = parentSetting.querySelector('[data-setting="left-padding"]')
    paddingLeftInput.value = parseInt(styles.paddingLeft);
    let that = this;
    function updateAllPadding(){
      paddingLeftInput.value = parseInt(window.getComputedStyle(this.#node).paddingLeft);
    }
    paddingInput.onchange = function(){
      that.#node.style.padding = paddingInput.value + 'px';
      updateAllPadding();
    }

  }

}

/**
 * Represents a component for creating and managing HTML elements with additional functionalities.
 * @class
 */
class Component {
  /**
   * @type {Array<Component>} - An array to store child components.
   */
  #children = [];

  /**
   * @type {HTMLElement} - The HTML node associated with the component.
   */
  #node = null;

  /**
   * Creates a new Component.
   * @constructor
   * @param {Object} options - The options for creating the component.
   * @param {string=} options.tag - HTML element tag (default is 'div').
   * @param {string=} options.className - CSS class name for the element.
   * @param {string=} options.text - Text content of the element.
   * @param {...Component} children - Child components to be appended.
   */
  constructor(
    {
      parentNode = document,
      tag = "div",
      className = "",
      text = "",
      click = function () {
        console.log("click");
      },
    },
    ...children
  ) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    this.#node = node;
    console.log(parentNode);
    parentNode.appendChild(node);
    if (children) {
      this.appendChildren(children);
    }
    node.addEventListener("mouseenter", function () {
      node.classList.add("hover-component");
    });
    node.addEventListener("mouseleave", function () {
      node.classList.remove("hover-component");
    });
    let that = this;
    node.addEventListener("click", function () {
      click(that);
      console.log("select");
      node.classList.add("selected-click");
      that.getSetting();
    });
  }

  /**
   * Appends a child component to the current component.
   * @param {Component} child - The child component to be appended.
   */
  append(child) {
    this.#children.push(child);
    this.#node.append(child.getNode());
  }

  /**
   * Appends an array of child components to the current component.
   * @param {Array<Component>} children - Array of child components to be appended.
   */
  appendChildren(children) {
    children.forEach((el) => {
      this.append(el);
    });
  }

  /**
   * Returns the HTML node associated with the component.
   * @returns {HTMLElement} - The HTML node.
   */
  getNode() {
    return this.#node;
  }

  /**
   * Returns an array of child components.
   * @returns {Array<Component>} - Array of child components.
   */
  getChildren() {
    return this.#children;
  }
  select() {
    this.#node.classList.add("selected-click");
  }
  unselect() {
    this.#node.classList.remove("selected-click");
    console.log("unselect");
  }

  /**
   * Sets the text content of the component.
   * @param {string} content - The text content to be set.
   */
  setTextContent(content) {
    this.#node.textContent = content;
  }

  /**
   * Sets an attribute on the component's HTML node.
   * @param {string} attribute - The attribute to set.
   * @param {string} value - The value to set for the attribute.
   */
  setAttribute(attribute, value) {
    this.#node.setAttribute(attribute, value);
  }

  /**
   * Removes an attribute from the component's HTML node.
   * @param {string} attribute - The attribute to remove.
   */
  removeAttribute(attribute) {
    this.#node.removeAttribute(attribute);
  }

  /**
   * Toggles the presence of a CSS class on the component's HTML node.
   * @param {string} className - The class name to toggle.
   */
  toggleClass(className) {
    this.#node.classList.toggle(className);
  }

  /**
   * Adds an event listener to the component's HTML node.
   * @param {string} event - The event type to listen for.
   * @param {EventListener} listener - The callback function to be executed when the event occurs.
   * @param {boolean|AddEventListenerOptions} [options=false] - An options object specifying characteristics of the event listener.
   */
  addListener(event, listener, options = false) {
    this.#node.addEventListener(event, listener, options);
  }

  /**
   * Removes an event listener from the component's HTML node.
   * @param {string} event - The event type for which to remove the listener.
   * @param {EventListener} listener - The listener function to be removed.
   * @param {boolean|EventListenerOptions} [options=false] - Options that were used when adding the listener.
   */
  removeListener(event, listener, options = false) {
    this.#node.removeEventListener(event, listener, options);
  }

  /**
   * Destroys all child components associated with the current component.
   */
  destroyChildren() {
    this.#children.forEach((child) => {
      child.destroy();
    });
    this.#children.length = 0;
  }
  getSetting() {
    console.warn("Необходимо реализовать метод получения настроек");
  }
  /**
   * Destroys the current component and removes its HTML node from the DOM.
   */
  destroy() {
    this.destroyChildren();
    this.#node.remove();
  }
}
