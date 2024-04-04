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