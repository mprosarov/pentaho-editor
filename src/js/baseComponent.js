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
  getUID(){
    return window.crypto.randomUUID();
  }
  onClick(e){
    this.#node.classList.add("selected-click");
    this.eventsObj.click(this);
    // console.log("click component", this);
    console.log("click component. Base");
  }
  select(){
    this.#node.classList.add("selected-click");
  }
  unselect(){
    this.#node.classList.remove("selected-click");
    console.log("unselect component");
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
    // TODO: сделать, чтоб клик по заголовку блока в любом месте(не только по стрелке) схлопывал/разворачивал блок
    // Если кликнули по стрелки, то открываем/закрываем блок с настройками
    parentSetting.onclick = function(){
      let toggleBlock = event.target.closest('.s-title_action');
      if (!toggleBlock) return;
      if (!toggleBlock.parentNode.nextElementSibling.classList.contains('setting-content')) return;
      toggleBlock.classList.toggle('close');
      $(toggleBlock.parentNode.nextElementSibling).toggle( 'blind', 300 );
    }

    let styles = window.getComputedStyle(this.nodeElement);
    // Настройка padding
    let paddingInput = parentSetting.querySelector('[data-setting="base-padding"]')
    let paddingLeftInput = parentSetting.querySelector('[data-setting="left-padding"]');
    let paddingRightinput = parentSetting.querySelector('[data-setting="right-padding"]');
    let paddingTopInput = parentSetting.querySelector('[data-setting="top-padding"]');
    let paddingBottomInput = parentSetting.querySelector('[data-setting="bottom-padding"]');
    // Настройка margin
    let marginAllinput = parentSetting.querySelector('[data-setting="base-all-margin"]');
    let marginLeftInput = parentSetting.querySelector('[data-setting="base-left-margin"]');
    let marginRightInput = parentSetting.querySelector('[data-setting="base-right-margin"]');
    let marginTopInput = parentSetting.querySelector('[data-setting="base-top-margin"]');
    let marginBottomInput = parentSetting.querySelector('[data-setting="base-bottom-margin"]');
    let that = this;
    updateAllPadding();
    updateAllMarginInputs()
    // ===== Настройка размеров =====
    let wEl = parentSetting.querySelector('[data-base-width="value"]');
    let hEl = parentSetting.querySelector('[data-base-height="value"]');
    let wSizeUnits = parentSetting.querySelector('[data-base-width="units"]');
    let hSizeUnits = parentSetting.querySelector('[data-base-height="units"]');
    if (this.nodeElement.style.width.endsWith('px')){
      wSizeUnits.value = 'px';
    } else if (this.nodeElement.style.width.endsWith('%')){
      wSizeUnits.value = '%';
    }
    if (this.nodeElement.style.height.endsWith('px')) {
      hSizeUnits.value = 'px';
    } else if (this.nodeElement.style.height.endsWith('%')) {
      hSizeUnits.value = '%';
    }
    wEl.value = parseInt(this.nodeElement.style.width) || '';
    hEl.value = parseInt(this.nodeElement.style.height) || '';
    wEl.onchange = () => { that.nodeElement.style.width = `${wEl.value}${wSizeUnits.value}` }
    hEl.onchange = () => { that.nodeElement.style.height = `${hEl.value}${hSizeUnits.value}` }
    wSizeUnits.onchange = () => { that.nodeElement.style.width = `${wEl.value}${wSizeUnits.value}` }
    hSizeUnits.onchange = () => { that.nodeElement.style.height = `${hEl.value}${hSizeUnits.value}` }
    // ----- end -----
    //Обновить все значения в полях ввода padding'a
    function updateAllPadding(){
      if(styles.padding.split(' ').length>1) paddingInput.value = '';
      else paddingInput.value = parseInt(styles.padding);
      paddingLeftInput.value = parseInt(styles.paddingLeft);
      paddingRightinput.value = parseInt(styles.paddingRight);
      paddingTopInput.value = parseInt(styles.paddingTop);
      paddingBottomInput.value = parseInt(styles.paddingBottom);
    };
    //Обвновить все значения в полях ввода margin'ов
    function updateAllMarginInputs(){
      if(styles.margin.split(' ').length>1) marginAllinput.value = '';
      else marginAllinput.value = parseInt(styles.margin);
      marginLeftInput.value = parseInt(styles.marginLeft);
      marginRightInput.value = parseInt(styles.marginRight);
      marginTopInput.value = parseInt(styles.marginTop);
      marginBottomInput.value = parseInt(styles.marginBottom);
    };
    //====== Установка внешних отступов(padding'ов) ======
    paddingInput.onchange = function(){
      that.nodeElement.style.padding = paddingInput.value + 'px';
      updateAllPadding();
    }
    paddingLeftInput.onchange = () => {
      that.nodeElement.style.paddingLeft = paddingLeftInput.value + 'px';
      updateAllPadding()
    }
    paddingRightinput.onchange = () => {
      that.nodeElement.style.paddingRight = paddingRightinput.value + 'px';
      updateAllPadding()
    }
    paddingTopInput.onchange = () => {
      that.nodeElement.style.paddingTop = paddingTopInput.value + 'px';
      updateAllPadding()
    }
    paddingBottomInput.onchange = () => {
      that.nodeElement.style.paddingBottom = paddingBottomInput.value + 'px';
      updateAllPadding()
    }
    //====== Установка внутренних отступов(margin'ов) ======
    function setMarginStyle(inp,styleName){
      that.nodeElement.style[styleName] = inp.value + 'px';
      updateAllMarginInputs();
    }
    marginAllinput.onchange = () => { setMarginStyle(marginAllinput,'margin'); }
    marginLeftInput.onchange = () => { setMarginStyle(marginLeftInput, 'marginLeft'); }
    marginRightInput.onchange = () => { setMarginStyle(marginRightInput, 'marginRight'); }
    marginTopInput.onchange = () => { setMarginStyle(marginTopInput, 'marginTop'); }
    marginBottomInput.onchange = () => { setMarginStyle(marginBottomInput, 'marginBottom'); }
    // ----------------------------------------------
    // ===== Настройка Типографика ======
    /** выравнивание */
    let alignButtonGroup = UtilsEditor.CreateRadioButtonGroup(parentSetting.querySelector('[data-base-font="align"]'), applyTextAlign);
    function applyTextAlign(btnEl,isActive){
      let alignValue = btnEl.dataset.align;
      if(alignValue && isActive) that.nodeElement.style.textAlign = alignValue;
    }
    alignButtonGroup.setByData('data-align',this.nodeElement.style.textAlign);
    /** размер шрифта */
    let fontSizeValue = parentSetting.querySelector('[data-base-font-size="value"]');
    let fontSizeUnits = parentSetting.querySelector('[data-base-font-size="units"]');
    let fontSize;
    if (this.nodeElement.style.fontSize != ''){
      fontSize = Helper.parseCss(this.nodeElement.style.fontSize);
    } else {
      fontSize = Helper.parseCss(styles.fontSize);
    }
    if (fontSize) {
      fontSizeValue.value = fontSize[0];
      fontSizeUnits.value = fontSize[1];
    }
    fontSizeValue.onchange = function(){
      that.nodeElement.style.fontSize = `${fontSizeValue.value}${fontSizeUnits.value}`;
    }
    fontSizeUnits.onchange = function(){
      that.nodeElement.style.fontSize = `${fontSizeValue.value}${fontSizeUnits.value}`;
    }
    /** цвет текста */
    let fontColorInput = parentSetting.querySelector('[data-base-color="text"]');
    // console.log(styles.color);
    fontColorInput.value = this.nodeElement.style.color;
    fontColorInput.oninput = function(){
      that.nodeElement.style.color = this.value;
    }
    // ----------------------------------
    // ====== Настройка рамок ======
    /** Рамки(все,слева,справа,вверхняя,нижняя) */
    let borderWidthAlign = UtilsEditor.CreateCheckboxButtonGroup(parentSetting.querySelector('[data-base-border="visible"]'),aplpyBorderAlign);
    function aplpyBorderAlign(btnElement,isActive){
      applyAllBorderSettings(parentSetting.querySelector('[data-base-border="visible"]'));
      return;
      let borderPosition = btnElement.dataset.border;
      if(borderPosition=='all' && isActive) that.nodeElement.style.border = `1px solid`;
      else if(borderPosition=='all' && !isActive) that.nodeElement.style.border = ``;
      else{
        if(isActive)
        that.nodeElement.style[`border${borderPosition}`] = `1px solid`;
      }
    }
    function applyAllBorderSettings(borderWidthAlign){
      let btns = borderWidthAlign.querySelectorAll('button');
      let borderPosition;
      let isActive;
      for(let i=0;i<btns.length;i++){
        let btn = btns[i];
        borderPosition = btn.dataset.border;
        isActive = btn.classList.contains('active');
        if(borderPosition=='all'){
          if (isActive){
            that.nodeElement.style.border = `1px solid`;
            return;
          }
          else that.nodeElement.style.border = ``;
        } else {
          if (isActive) that.nodeElement.style[`border${borderPosition}`] = `1px solid`;
          else that.nodeElement.style[`border${borderPosition}`]= ``;
        }

      }
    }
    //------------------------------
    /** border radius setting */
    let borderRadiusValue = parentSetting.querySelector('[data-base-border-radius="value"]');
    let borderRadiusUnits = parentSetting.querySelector('[data-base-border-radius="units"]');
    let cssBorderRadius = Helper.parseCss(styles.borderRadius);
    borderRadiusValue.value = cssBorderRadius[0];
    borderRadiusUnits.value = cssBorderRadius[1];
    borderRadiusValue.onchange = ()=>{
      that.nodeElement.style.borderRadius = `${borderRadiusValue.value}${borderRadiusUnits.value}`;
    }
    borderRadiusUnits.onchange = ()=>{
      that.nodeElement.style.borderRadius = `${borderRadiusValue.value}${borderRadiusUnits.value}`;
    }
    console.log(cssBorderRadius);
    //------------------------------
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
