//= tabs.js
//= baseComponent.js
//= headerComponent.js
//= tabsComponent.js
var Editor = (function() {
  $("#page-zone").sortable();
  let $setting = $("#right-sidebar");
  let selectedComponent = null;
  function unselectAll(){
    for (let i = 0; i < components.length; i++) {
      components[i].unselect();
    }
    selectedComponent = null;
  }
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
  let addComponent = function(type) {
    // Создаем новый компонент и добавляем в массив всех компонентов
    if(type == 'header'){
      let h = new H(pageHTML);
      h.on('click',clickElement);
      components.push(h)
      // components.push(
      //   new Header({ parentNode: pageHTML, click: clickElement })
      // );
    }
    if(type == 'tabs'){
      let tabsComp = new TabsComponent(pageHTML);
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
    console.log(el)
    showSetting(selectedComponent);
  }
  let showSetting = function(comp){
    $setting.empty();
    $setting.append(comp.getSettings())
    comp.initSettingsEvents($setting[0]);
  }
  return {
    addComponent:addComponent
  }
})();


Tabs();

$(".component-item").draggable({
  helper: "clone",
});

$(".dropped-zone").droppable({
  drop: function (event, ui) {
    Editor.addComponent(ui.draggable[0].dataset["type"]);
  },
});