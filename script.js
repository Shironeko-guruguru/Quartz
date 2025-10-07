// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');
const contentArea = document.getElementById('content-area');
const menuButtons = document.querySelectorAll('.pie-menu__button');

// --- ルーター機能 ---
const router = () => {
  // ハッシュがない場合のデフォルトを設定
  const path = location.hash.substring(1) || 'home'; 
  
  // ハッシュ名に対応するidを持つtemplate要素を探す
  const template = document.getElementById(path);
  
  // templateが見つかったかどうかで内容を分岐
  if (template) {
    // templateの中身のHTML（content）を複製して表示
    contentArea.innerHTML = ''; // 一旦中身を空にする
    contentArea.append(template.content.cloneNode(true));
  } else {
    // 見つからなければ404ページを表示
    const notFoundTemplate = document.getElementById('notFound');
    contentArea.innerHTML = '';
    contentArea.append(notFoundTemplate.content.cloneNode(true));
  }
};

// --- イベントリスナーの設定 ---
// （この部分は前回のコードから変更ありません）

// (A) メニューの開閉
trigger.addEventListener('click', () => {
  menu.classList.toggle('is-open');
});

// (B) ページ読み込み時とハッシュ変更時にルーターを実行
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

// (C) メニュー項目をクリックしたらメニューを閉じる
menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    menu.classList.remove('is-open');
  });
});