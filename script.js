// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');

// トリガーボタンがクリックされた時の処理
trigger.addEventListener('click', () => {
    // .pie-menu要素に 'is-open' クラスを付け外しする
    menu.classList.toggle('is-open');
});
