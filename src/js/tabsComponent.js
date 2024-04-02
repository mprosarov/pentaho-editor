class H extends HtmlComponent {
  constructor(parentNode) {
    super("header-component", parentNode);
  }
  getSettings() {
    let paretnSetting = super.getSettings();
    return (paretnSetting += `
    <div class="setting-block">
      <div class="s-title">Текст заголовка</div>
        <div class="settingInput">
            <input data-inp="h" class="settingInput-field" value="${this.nodeElement.innerText}">
        </div>
    </div>`);
  }
  initSettingsEvents(parentSetting) {
    let node = this.nodeElement;
    super.initSettingsEvents(parentSetting);
    parentSetting.querySelector('input[data-inp="h"]').oninput = function () {
      node.innerText = this.value;
    };
  }
}
class TabsComponent extends HtmlComponent {
  constructor(parentNode){
    super("tabs-component",parentNode);
    this.init();
  }
  init(){
    var jsTriggers = this.parentNode.parentNode.querySelectorAll('.js-tab-trigger');

    jsTriggers.forEach(function (trigger) {
      trigger.onclick = function () {
        var id = this.getAttribute('data-tab'),
          content = this.parentNode.parentNode.querySelector('.js-tab-content[data-tab="' + id + '"]'),
          activeTrigger = this.parentNode.parentNode.querySelector('.js-tab-trigger.active'),
          activeContent = this.parentNode.parentNode.querySelector('.js-tab-content.active');
          console.log(activeContent)


        activeTrigger.classList.remove('active');
        trigger.classList.add('active');

        activeContent.classList.remove('active');
        content.classList.add('active');
      };
    });
  }
  getSettings(){
    let setingsHTML = super.getSettings()
    setingsHTML += document.getElementById('tabs-settings').innerHTML;
    let tabs = this.nodeElement.querySelector('.tab-header').querySelectorAll('.tab-header__item');
    for (let i = 0; i < tabs.length;i++){
      setingsHTML+=`<div>Вкладка-${i+1}<div><div><input data-inp="tab" data-tab="${tabs[i].dataset.tab}" type="text" value="${tabs[i].innerText}"/> <button>УД</button>  </div>`
    }
    setingsHTML+='<button data-btn="add">Добавить вкладку</button>'
    return setingsHTML;
  }
  initSettingsEvents(parentSetting) {
    let parent = this.nodeElement;
    super.initSettingsEvents(parentSetting)
    this.setEvents(parentSetting)
    let that = this;
    //Добавить вкладку
    parentSetting.querySelector('[data-btn="add"]').onclick = function(){
      let headers = parent.querySelector('.tab-header');
      let content = parent.querySelector(".tab-content");
      headers.innerHTML += `<li class="tab-header__item js-tab-trigger" data-tab="${headers.childElementCount+1}">${headers.childElementCount+1}</li>`;
      content.innerHTML += `<li class="tab-content__item js-tab-content" data-tab="${content.childElementCount + 1}"></li>`;
      let newTabContent = content.lastElementChild;
      $(newTabContent).droppable({
        greedy: true,
        drop: function (event, ui) { console.log('DROP IN COMPONENT'); Editor.addComponent(ui.draggable[0].dataset["type"], newTabContent); event.stopPropagation(); }
      })
      that.setEvents(parentSetting);
      that.init();
    }
  }
//   $(".dropped-zone").droppable({
//     drop: function (event, ui) {
//       Editor.addComponent(ui.draggable[0].dataset["type"]);
//     },
// });
  setEvents(parentSetting ){
    let parent = this.nodeElement;
    let inputs = parentSetting.querySelectorAll('[data-inp]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].oninput = function () {
        let tabNum = this.dataset.tab;
        parent.querySelector(`[data-tab="${tabNum}"]`).innerText = this.value;
      }
    }
    parentSetting.querySelector('[data-inp-st="active-tab-color"]').oninput = function(){
      parent.style.setProperty('--border-tab-color',this.value)
    }
  }
}