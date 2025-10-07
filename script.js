// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');
const contentArea = document.getElementById('content-area');
const menuButtons = document.querySelectorAll('.pie-menu__button');

const SAVE_DATA_KEY_PREFIX = 'spa_save_data_';
const NUM_SLOTS = 3;

// --- セーブ／ロード機能 ---

/** セーブスロットの状態を画面に描画する */
const renderSaveSlots = () => {
  // 表示されているページの中から.save-slotsコンテナを探す
  const saveSlotsContainer = document.querySelector('.save-slots');
  if (!saveSlotsContainer) return; // コンテナがなければ何もしない

  saveSlotsContainer.innerHTML = ''; // 中身をクリア
  for (let i = 1; i <= NUM_SLOTS; i++) {
    const key = `${SAVE_DATA_KEY_PREFIX}${i}`;
    const savedData = localStorage.getItem(key);

    const slotHTML = `
      <div class="slot">
        <div class="slot-data">${savedData ? savedData.substring(1) : '----'}</div>
        <div class="slot-actions">
          <button class="save-button" data-slot="${i}">セーブ</button>
          <button class="load-button" data-slot="${i}" ${!savedData ? 'disabled' : ''}>ロード</button>
        </div>
      </div>
    `;
    saveSlotsContainer.insertAdjacentHTML('beforeend', slotHTML);
  }
};

/** セーブ処理 */
const saveGame = (slotNumber) => {
  const currentHash = location.hash || '#home';
  const key = `${SAVE_DATA_KEY_PREFIX}${slotNumber}`;
  localStorage.setItem(key, currentHash);
  renderSaveSlots(); // 画面を再描画
  alert(`スロット${slotNumber}にセーブしました！`);
};

/** ロード処理 */
const loadGame = (slotNumber) => {
  const key = `${SAVE_DATA_KEY_PREFIX}${slotNumber}`;
  const savedHash = localStorage.getItem(key);
  if (savedHash) {
    location.hash = savedHash; // URLのハッシュを書き換える（routerが自動で動く）
    alert(`スロット${slotNumber}からロードしました！`);
    menu.classList.remove('is-open');
  }
};

// --- ルーター機能 ---
const router = () => {
  const path = location.hash.substring(1) || 'home';
  const template = document.getElementById(path);

  if (template) {
    contentArea.innerHTML = '';
    contentArea.append(template.content.cloneNode(true));
  } else {
    const notFoundTemplate = document.getElementById('notFound');
    contentArea.innerHTML = '';
    contentArea.append(notFoundTemplate.content.cloneNode(true));
  }

  // ▼▼▼ ルーターの最後に、もしデータベースページならスロットを描画する処理を追加 ▼▼▼
  if (path === 'data') {
    renderSaveSlots();
  }
};

// --- イベントリスナーの設定 ---

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
    // aタグのリンク遷移を妨げないように、少し遅延させてメニューを閉じる
    setTimeout(() => {
        menu.classList.remove('is-open');
    }, 100);
  });
});

// (D) メインコンテンツエリアでのセーブ・ロードボタンのクリックを監視（イベント委任）
contentArea.addEventListener('click', (e) => {
  const target = e.target;
  const slotNumber = target.dataset.slot;

  if (slotNumber) {
    if (target.classList.contains('save-button')) {
      saveGame(slotNumber);
    }
    if (target.classList.contains('load-button')) {
      loadGame(slotNumber);
    }
  }
});