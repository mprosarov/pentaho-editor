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
