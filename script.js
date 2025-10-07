// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');

// トリガーボタンがクリックされた時の処理
trigger.addEventListener('click', () => {
    // .pie-menu要素に 'is-open' クラスを付け外しする
    menu.classList.toggle('is-open');
});

(() => {
    // 必要な要素を取得
    const buttons = document.querySelectorAll('nav button');
    const pages = document.querySelectorAll('.page');

    // ボタンがクリックされたときの処理
    const changePage = (e) => {
    // クリックされたボタンから対象ページのIDを取得
        const targetId = e.target.dataset.target;
                
        // すべてのページから is-active クラスを削除（一旦すべて非表示に）
        pages.forEach(page => {
            page.classList.remove('is-active');
        });

        // 対象のページに is-active クラスを追加（表示する）
        const targetPage = document.getElementById(targetId);
        targetPage.classList.add('is-active');
    };

    // 全てのボタンにクリックイベントを設定
    buttons.forEach(button => {
        button.addEventListener('click', changePage);
    });
})();
