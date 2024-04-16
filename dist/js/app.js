const UtilsEditor = (function(){
    const CreateRadioButtonGroup = function(el,clbk){
        return new _createButtonGroup(el,'radio',clbk);
    };
    const CreateCheckboxButtonGroup = function (el, clbk) {
      return new _createButtonGroup(el, "check", clbk);
    };
    const _createButtonGroup = function(buttonGroupElement,typeGroup='radio',clbk){
        let cssActive = 'active';
        let btns = buttonGroupElement.querySelectorAll("button.e-button-group_item");
        let _clbkClick = function() { return false; }
        if(typeof clbk === 'function') _clbkClick = clbk;

        for(let i=0;i<btns.length;i++){
            btns[i].onclick = function(){
                if(typeGroup=='radio'){
                    $(buttonGroupElement).find('.'+cssActive).removeClass(cssActive);
                }
                this.classList.toggle(cssActive);
                let isActive = this.classList.contains(cssActive);
                _clbkClick(this,isActive);
            }
        }
        let setByData = function(dataAttr,val){
            let btn = buttonGroupElement.querySelector(`[${dataAttr}="${val}"]`);
            if(typeGroup=='radio') $(buttonGroupElement).find('.'+cssActive).removeClass(cssActive);
            if(btn) btn.classList.add(cssActive);
        }
        return {
            setByData:setByData
        }
    };
    return {
      CreateRadioButtonGroup: CreateRadioButtonGroup,
      CreateCheckboxButtonGroup: CreateCheckboxButtonGroup,
    };
})();

// TODO: для хэлпера создать отдельную js'ку

const Helper = (function(){

    /** разделит строку типа "32px" на число (32) и единицы измерения (px)
    и вернет массив из двух элементов [число,единицы_изм.] */
     const parseCss = function(cssValueStr){
        let matches = cssValueStr.match(/^(\d+)(\D+)$/);
        if (matches) {
            return [ matches[1], matches[2] ];
        } else {
            console.log(`Строка: ${cssValueStr} , не соответствует формату`);
            return false;
        }
     }
     return{
        parseCss:parseCss
     }
})();
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
            that.nodeElement.style.borderColor = borderColorInput.value;
            return;
          }
          else that.nodeElement.style.border = ``;
        } else {
          if (isActive){
            that.nodeElement.style[`border${borderPosition}`] = `1px solid`;
            that.nodeElement.style.borderColor = borderColorInput.value;
          } else that.nodeElement.style[`border${borderPosition}`]= ``;
        }

      }
    }
    //------------------------------
    /** Закругление рамок */
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
    //------------------------------
    /** Цвет рамок */
    let borderColorInput = parentSetting.querySelector("[data-base-border-color]");
    let currentBorderColor = '';
    if(that.nodeElement.style.borderColor != '') currentBorderColor = that.nodeElement.style.borderColor;

    borderColorInput.value = styles.borderColor;
    Coloris.wrap(borderColorInput);
    borderColorInput.oninput = ()=>{
      that.nodeElement.style.borderColor = borderColorInput.value;
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
class Header extends Component {
  constructor({parentNode, className, text, onClick, click }) {
    super({parentNode:parentNode, tag: "h1", className, text: "Новый заголовок", click });
    if (onClick) {
      this.onClick = onClick;
      this.addListener("click", this.onClick);
    }
  }

  destroy() {
    this.removeListener("click", this.onClick);
    super.destroy();
  }
  getSetting(){
    let that = this;
    let panel = $("#right-sidebar");
    panel.empty();
    let setting = `<div>Текст заголовка</div><div><input type="text" value="${this.getNode().innerText}" /></div>`;
    panel.html(setting);
    panel.find('input').on('input',function(){
        that.setTextContent(this.value);
    })
  }
}
class H extends HtmlComponent {
  constructor(parentNode) {
    super("header-component", parentNode);
  }
  getSettings() {
    let settings = super.getSettings();
    settings += document.getElementById('header-settings').innerHTML;
    return settings;
  }
  initSettingsEvents(parentSetting) {
    let node = this.nodeElement;
    parentSetting.querySelector('input[data-inp="header-value"]').value = this.nodeElement.innerText;
    super.initSettingsEvents(parentSetting);
    parentSetting.querySelector('input[data-inp="header-value"]').oninput = function () {
      node.innerText = this.value;
    };
  }
}
class TabsComponent extends HtmlComponent {
  cssActiveColor = "--text-color-active";
  cssActiveTabColor = '--border-tab-color-active';
  cssActiveTabHeaderBg = '--tab-header-bg-active';
  cssTabBorderColor = '--tab-border-color';
  cssTabTextColor = '--tab-text-color';
  cssTabHeaderBg = '--tab-header-bg';
  cssTabContentBg = '--tab-content-bg';
  inputsColor = {
    border:'[data-inp-st="tab-border-color"]',
    text: '[data-inp-st="tab-text-color"]',
    activeHeaderBg: '[data-inp-st="active-tab-header-bg"]',
    headerBg: '[data-inp-st="tab-header-bg"]',
    contentBg: '[data-inp-st="tab-content-bg"]'
  };
  constructor(parentNode) {
    super("tabs-component", parentNode);
    this.init();
  }
  init() {
    //Добавляем возможность "бросать" компоненты внутрь вкладок
    let tabContent = this.nodeElement.querySelector(".tab-content");
    for (let child of tabContent.children){
      $(child).droppable({
        greedy: true,
        drop: function (event, ui) {
          Editor.addComponent(ui.draggable[0].dataset["type"], child);
          event.stopPropagation();
        },
      });
    }
    var jsTriggers = this.nodeElement.querySelector(".tab-header").querySelectorAll(".js-tab-trigger");

    jsTriggers.forEach(function (trigger) {
      trigger.onclick = function () {
        var id = this.getAttribute("data-tab"),
          content = this.parentNode.nextElementSibling.querySelector(
            ':scope>.js-tab-content[data-tab="' + id + '"]'
          ),
          activeTrigger = this.parentNode.parentNode.querySelector(
            ".js-tab-trigger.active"
          ),
          activeContent = this.parentNode.nextElementSibling.querySelector(
            ":scope>.js-tab-content.active"
          );
        activeTrigger.classList.remove("active");
        trigger.classList.add("active");

        activeContent.classList.remove("active");
        content.classList.add("active");
      };
    });
  }
  getSettings() {
    let setingsHTML = super.getSettings();
    setingsHTML += document.getElementById("tabs-settings").innerHTML;
    return setingsHTML;
  }
  createTabsControl(parentSetting){
    // Вывести все вкладки в настройки
    let tabsSectionControl = parentSetting.querySelector(
      '[data-section="tabs-control"]'
    );
    let tabs = this.nodeElement
      .querySelector(".tab-header")
      .querySelectorAll(".tab-header__item");
    let tabsHTML = "";
    for (let i = 0; i < tabs.length; i++) {
      tabsHTML += `<div class="setting-row">
        <div class="setting-col">
          <div class="settingInput">
              <span class="settingInput-item">#${i}</span>
              <input class="settingInput-field" data-input="tabtext" value="${tabs[i].innerText}" data-tab="${tabs[i].dataset.tab}">
              <button class="settingInput-item" data-btn="del-tab" data-tab="${tabs[i].dataset.tab}"><img width="20px" src="img/trash-4.svg"></button>
          </div>
        </div>
      </div> `;
    }
    tabsHTML += `<div class="setting-row">
                <button data-btn="add-tab" class="button-setting">Добавить вкладку</button>
            </div>`;
    tabsSectionControl.innerHTML = tabsHTML;
  }
  initSettingsEvents(parentSetting) {
    let parent = this.nodeElement;
    super.initSettingsEvents(parentSetting);
    this.createTabsControl(parentSetting);
    this.setEvents(parentSetting);
    let that = this;
    let cssStyles = window.getComputedStyle(parent);

    //Цвет активной рамки
    let inpAciveBorderColor = parentSetting.querySelector(
      '[data-inp-st="active-tab-color"]'
    );
    inpAciveBorderColor.value = window
      .getComputedStyle(parent)
      .getPropertyValue(this.cssActiveTabColor);
    //Цвет текста активной рамки
    let inpActiveColorText = parentSetting.querySelector(
      '[data-inp-st="active-tab-text-color"]'
    );
    inpActiveColorText.value = window
      .getComputedStyle(parent)
      .getPropertyValue(this.cssActiveColor);
    //Цвет рамки неактивных вкладок
    parentSetting.querySelector(this.inputsColor.border).value = cssStyles.getPropertyValue(this.cssTabBorderColor);
    //Цвет текста неактивного таба
    parentSetting.querySelector(this.inputsColor.text).value = cssStyles.getPropertyValue(this.cssTabTextColor);
    //Фон заголовка активной вкладки
    parentSetting.querySelector(this.inputsColor.activeHeaderBg).value = cssStyles.getPropertyValue(this.cssActiveTabHeaderBg);
    //Фон заголовка неактивной вкладки
    parentSetting.querySelector(this.inputsColor.headerBg).value = cssStyles.getPropertyValue(this.cssTabHeaderBg);
    //Фон контента вкладки
    parentSetting.querySelector(this.inputsColor.contentBg).value = cssStyles.getPropertyValue(this.cssTabContentBg);
  }
  setEvents(parentSetting) {
    let that = this;
    let parent = this.nodeElement;
    //Добавить вкладку
    parentSetting.querySelector('[data-btn="add-tab"]').onclick = function () {
      let tabUID = that.getUID();
      let headers = parent.querySelector(".tab-header");
      let content = parent.querySelector(".tab-content");
      headers.innerHTML += `<li class="tab-header__item js-tab-trigger" data-tab="${tabUID}">
                              Вкладка-${headers.childElementCount + 1}
                            </li>`;
      content.innerHTML += `<li class="tab-content__item js-tab-content" data-tab="${tabUID}"></li>`;
      let newTabContent = content.lastElementChild;
      $(newTabContent).droppable({
        greedy: true,
        drop: function (event, ui) {
          Editor.addComponent(ui.draggable[0].dataset["type"], newTabContent);
          event.stopPropagation();
        },
      });
      that.createTabsControl(parentSetting);
      that.setEvents(parentSetting);
      that.init();
    };
    let inputs = parentSetting.querySelectorAll('[data-input="tabtext"]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].oninput = function () {
        let tabNum = this.dataset.tab;
        parent.querySelector(`[data-tab="${tabNum}"]`).innerText = this.value;
      };
    }
    parentSetting.querySelector('[data-inp-st="active-tab-color"]').oninput =
      function () {
        parent.style.setProperty(that.cssActiveTabColor, this.value);
      };
    parentSetting.querySelector('[data-inp-st="active-tab-text-color"]').oninput = function () {
      parent.style.setProperty(that.cssActiveColor, this.value);
    };
    $(parentSetting).find('[data-btn="del-tab"]').click(function(){
      let dataTab = this.dataset.tab;
      let tabHeader,tabContent;
      if(that.nodeElement.firstElementChild.childElementCount==1){
        alert('Должна быть хотя бы одна вкладка');
        return;
      }
      tabHeader = that.nodeElement.querySelector(`.tab-header>li[data-tab="${dataTab}"]`);
      tabContent = that.nodeElement.querySelector(`.tab-content>li[data-tab="${dataTab}"]`);
      if(!tabHeader || !tabContent){
        throw "Не удалось найти вкладку или тело вкладки, либо некорректная сруктура";
      }
      let wasActiveTab = tabHeader.classList.contains('active')?true:false;
      tabHeader.parentNode.removeChild(tabHeader);
      tabContent.parentNode.removeChild(tabContent);
      if(wasActiveTab){
        that.nodeElement.firstElementChild.firstElementChild.classList.add("active");
        that.nodeElement.querySelector('.tab-content>li:first-child').classList.add("active");
      }
      that.createTabsControl(parentSetting);
      that.setEvents(parentSetting);
      that.init();
    });
    //Цвет рамки неактивных вкладок
    parentSetting.querySelector(this.inputsColor.border).oninput = ()=>{
      parent.style.setProperty(that.cssTabBorderColor, event.target.value);
    };
    //Цвет текста неактивного таба
    parentSetting.querySelector(this.inputsColor.text).oninput = () => {
      parent.style.setProperty(that.cssTabTextColor, event.target.value);
    };
    //Фон заголовка активной вкладки
    parentSetting.querySelector(this.inputsColor.activeHeaderBg).oninput = () => {
      parent.style.setProperty(that.cssActiveTabHeaderBg, event.target.value);
    };
    //Фон заголовка неактивной вкладки
    parentSetting.querySelector(this.inputsColor.headerBg).oninput = () => {
      parent.style.setProperty(that.cssTabHeaderBg, event.target.value);
    };
    //Фон контента вкладки
    parentSetting.querySelector(this.inputsColor.contentBg).oninput = () => {
      parent.style.setProperty(that.cssTabContentBg, event.target.value);
    };
  }
}
Coloris({ inline: false, format: "hex" });
var Editor = (function() {
  $("#page-zone").sortable({distance:5});
  // Развернуть/свернуть на весь экран
  let btnFullScreen = document.getElementById('fullscreen-editor');
  btnFullScreen.onclick = () => { launchFullScreen(document) }

  let $setting = $("#right-sidebar");
  let selectedComponent = null;
  function unselectAll(){
    for (let i = 0; i < components.length; i++) {
      components[i].unselect();
    }
    selectedComponent = null;
  }
  // TODO: Пока временно - переделать потом
  $("#page-zone").click(function(){
    for(let i=0;i<components.length;i++){
      components[i].unselect();
      $setting.empty();
    }
    selectedComponent = null;
    // if(selectedComponent!=null) selectedComponent.select();
  });
  let pageHTML = document.getElementById("page-zone");
  let components = [];
  let addComponent = function(type,parentNode = pageHTML) {
    // Создаем новый компонент и добавляем в массив всех компонентов
    if(type == 'header'){
      let h = new H(parentNode);
      h.on('click',clickElement);
      components.push(h)
      // components.push(
      //   new Header({ parentNode: pageHTML, click: clickElement })
      // );
    }
    if(type == 'tabs'){
      let tabsComp = new TabsComponent(parentNode);
      tabsComp.on('click',clickElement);
      components.push(tabsComp);
    }
  }
  let clickElement = function(el){
    console.log(' on editor')
    event.stopPropagation();
    if(selectedComponent!=el){
      unselectAll();
    }
    selectedComponent = el;
    el.select();
    // console.log(el)
    showSetting(selectedComponent);
  }
  let showSetting = function(comp){
    $setting.empty();
    $setting.append(comp.getSettings())
    comp.initSettingsEvents($setting[0]);
  }
  // ===== Переключатель полного экрана =====
  function launchFullScreen(document) {
    if (document.documentElement.requestFullScreen) {
      if (document.FullScreenElement)
        document.exitFullScreen();
      else
        document.documentElement.requestFullScreen().cath((err)=>{ console.log(err.message) });
      //mozilla
    } else if (document.documentElement.mozRequestFullScreen) {

      if (document.mozFullScreenElement)
        document.mozCancelFullScreen();
      else
        document.documentElement.mozRequestFullScreen();
      //webkit
    } else if (document.documentElement.webkitRequestFullScreen) {
      if (document.webkitFullscreenElement)
        document.webkitExitFullscreen();
      else{
        document.documentElement.webkitRequestFullScreen();
      }
    }
    fullscreenchanged(document)
  }
  function fullscreenchanged(doc){
    if(doc.fullscreenElement){
      btnFullScreen.dataset.fullscreen = false;
    } else btnFullScreen.dataset.fullscreen = true;
  }
  return {
    addComponent:addComponent,
    openPreview: openPreview
  }
  // ----- end -----
  // ===== Открыть предварительный просмотр =====
  function openPreview(){
    //Сохраняем страницу в localStorage
    let dasboardHTML = document.getElementById('page-zone').innerHTML;
    localStorage.setItem('editor-preview',dasboardHTML);
    //Открываем страницу с предварительным просмотром в новом окно
    window.open('preview.html')
  }
  // ----- end -----
})();


$(".component-item").draggable({
  helper: "clone",
});

$(".dropped-zone").droppable({
  greedy:true,
  drop: function (event, ui) {
    console.log('DROP IN PAGE');
    Editor.addComponent(ui.draggable[0].dataset["type"]);
  },
});