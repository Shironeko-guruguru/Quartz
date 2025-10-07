// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');

// トリガーボタンがクリックされた時の処理
trigger.addEventListener('click', () => {
    // .pie-menu要素に 'is-open' クラスを付け外しする
    menu.classList.toggle('is-open');
});

const menuitem = document.querySelectorAll('.pie-menu__button');
const pages = document.querySelectorAll('.page');
function showPage(pageId) {
  pages.forEach(page => page.classList.remove('active'));
  navButtons.forEach(button => button.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelector(`.nav-button[data-page="${pageId}"]`).classList.add('active');
}
  menuitem.forEach(button => {
  button.addEventListener('click', () => {
    showPage(button.dataset.page);
  });
});

async function initializeGame() {
    showPage('home-page');
}

initializeGame();
