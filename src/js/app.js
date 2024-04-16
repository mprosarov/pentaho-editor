//= _utils-ui.js
//= baseComponent.js
//= headerComponent.js
//= tabsComponent.js
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

