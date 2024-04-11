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