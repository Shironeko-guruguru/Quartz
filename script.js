// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');
const contentArea = document.getElementById('content-area');
const menuButtons = document.querySelectorAll('.pie-menu__button');

const SAVE_DATA_KEY_PREFIX = 'spa_save_data_';
const NUM_SLOTS = 3;

// キャラクター一覧表示用のデータ
const initialCharacters = [
  { id: 'char001', name: '勇者アレックス' },
  { id: 'char002', name: '魔法使いリナ' },
  { id: 'char003', name: '戦士ゴードン' },
  { id: 'char004', name: '僧侶マリア' },
  { id: 'char005', name: '盗賊カイト' },
  { id: 'char006', name: '騎士セシル' },
  { id: 'char007', name: '狩人エレン' },
  { id: 'char008', name: '賢者レオ' },
  { id: 'char009', name: '格闘家リュウ' },
  { id: 'char010', name: '暗黒騎士ザイン' },
];

// キャラクター詳細データ（localStorageから読み込み、レベルアップで更新される）
let characterDetails = {};

/**
 * localStorageに保存されたキャラクターデータ、またはJSONファイルを読み込む
 * 優先順位:
 * 1. レベルアップ等を記録したlocalStorageの通常データ ('characterDetailsData')
 * 2. 上記がなければ、初期データとして 'characters.json' を取得
 */
const loadCharacterDetails = async () => {
  const savedData = localStorage.getItem('characterDetailsData');
  if (savedData) {
    // 保存されたデータがあれば、それを読み込む
    characterDetails = JSON.parse(savedData);
  } else {
    // なければJSONから初期データを読み込む
    try {
      const response = await fetch('./characters.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      characterDetails = await response.json();
      // 読み込んだ初期データをlocalStorageに保存しておく
      localStorage.setItem('characterDetailsData', JSON.stringify(characterDetails));
    } catch (error) {
      console.error("キャラクターデータの読み込みに失敗しました:", error);
    }
  }
};

// --- ルーター機能 ---
const router = () => {
  const path = location.hash.substring(1) || 'home';
  const pathParts = path.split('/'); // "chara/char001" のようなパスを分割

  contentArea.innerHTML = ''; // 画面をクリア

  // パスに基づいて表示を切り替える
  // 改善点: IDが空でないことを確認 (例: #chara/ )
  if (pathParts[0] === 'chara' && pathParts.length > 1 && pathParts[1]) {
    // キャラクター詳細ページ (例: #chara/char001)
    renderCharacterDetail(pathParts[1]);
  } else {
    // 通常のページ (例: #home, #chara)
    const template = document.getElementById(path);
    if (template) {
      contentArea.append(template.content.cloneNode(true));

      // テンプレートに応じて追加処理
      if (path === 'chara') {
        renderCharacterList();
      } else if (path === 'data') {
        renderSaveSlots();
      }
    } else {
      // 404ページ
      const notFoundTemplate = document.getElementById('notFound');
      contentArea.append(notFoundTemplate.content.cloneNode(true));
    }
  }
};

// --- ページ描画関連 ---

/** キャラクター一覧を描画 */
const renderCharacterList = () => {
  const container = document.querySelector('.chara-list');
  if (!container) return;

  container.innerHTML = '';
  initialCharacters.forEach(char => {
    // aタグで詳細ページへのリンクを作成
    const charHTML = `
      <a href="#chara/${char.id}" class="chara-item" data-char-id="${char.id}">
        <img src="./images/${char.id}.png" alt="${char.name}">
        <p class="name">${char.name}</p>
      </a>
    `;
    container.insertAdjacentHTML('beforeend', charHTML);
  });
};

/** キャラクター詳細を描画 */
const renderCharacterDetail = (charId) => {
  const charData = characterDetails[charId];
  if (!charData) {
    location.hash = '#notFound'; // データがなければ404へ
    return;
  }

  const template = document.getElementById('characterDetail');
  // 改善点: router側でクリアしているので、ここでのクリア処理は不要
  contentArea.append(template.content.cloneNode(true));

  const container = document.querySelector('.character-detail-container');
  const detailHTML = `
    <div class="detail-card">
      <div class="detail-card__header">
        <img src="${charData.image}" alt="${charData.name}" class="detail-card__img">
        <div class="detail-card__title">
          <h2>${charData.name}</h2>
          <p>Lv. ${charData.level} / ${charData.class}</p>
        </div>
      </div>
      <p class="detail-card__description">${charData.description}</p>
      <ul class="detail-card__stats">
        <li>HP<span>${charData.hp}</span></li>
        <li>MP<span>${charData.mp}</span></li>
        <li>攻撃力<span>${charData.attack}</span></li>
        <li>防御力<span>${charData.defense}</span></li>
      </ul>
      <div class="detail-card__actions">
        <button class="levelup-button" data-char-id="${charId}">レベルアップ</button>
      </div>
    </div>
  `;
  container.innerHTML = detailHTML;
};

// --- アクション関連 ---

/** レベルアップ処理 */
const levelUp = (charId) => {
  const charData = characterDetails[charId];
  if (!charData) return;

  // ステータスを更新（上昇値は適当です）
  charData.level++;
  charData.hp += 10;
  charData.mp += 5;
  charData.attack += 3;
  charData.defense += 2;

  // 改善点: 変更をlocalStorageに保存する
  localStorage.setItem('characterDetailsData', JSON.stringify(characterDetails));

  // 画面を再描画して更新後のステータスを反映
  renderCharacterDetail(charId);
};

// --- セーブ／ロード機能 ---
const renderSaveSlots = () => {
  const saveSlotsContainer = document.querySelector('.save-slots');
  if (!saveSlotsContainer) return;

  saveSlotsContainer.innerHTML = '';
  for (let i = 1; i <= NUM_SLOTS; i++) {
    const key = `${SAVE_DATA_KEY_PREFIX}${i}`;
    const savedData = localStorage.getItem(key);
    // 保存されたデータから表示用のハッシュ値を取得
    const displayHash = savedData ? JSON.parse(savedData).hash.substring(1) : '----';

    const slotHTML = `
      <div class="slot">
        <div class="slot-data">${displayHash}</div>
        <div class="slot-actions">
          <button class="save-button" data-slot="${i}">セーブ</button>
          <button class="load-button" data-slot="${i}" ${!savedData ? 'disabled' : ''}>ロード</button>
        </div>
      </div>
    `;
    saveSlotsContainer.insertAdjacentHTML('beforeend', slotHTML);
  }
};

/** 現在のURLとキャラクターデータをスロットに保存する */
const saveGame = (slotNumber) => {
  const currentHash = location.hash || '#home';
  const key = `${SAVE_DATA_KEY_PREFIX}${slotNumber}`;
  
  // 改善点: 現在のURLとキャラクターデータをセットで保存
  const saveData = {
    hash: currentHash,
    characters: characterDetails 
  };
  localStorage.setItem(key, JSON.stringify(saveData));

  renderSaveSlots(); // 画面を再描画
  alert(`スロット${slotNumber}にセーブしました！`);
};

/** スロットからURLとキャラクターデータを読み込む */
const loadGame = (slotNumber) => {
  const key = `${SAVE_DATA_KEY_PREFIX}${slotNumber}`;
  const savedDataJSON = localStorage.getItem(key);

  // 改善点: URLとキャラクターデータの両方を復元
  if (savedDataJSON) {
    const savedData = JSON.parse(savedDataJSON);
    
    // 保存されていたキャラクターデータをグローバル変数とlocalStorageに復元
    characterDetails = savedData.characters;
    localStorage.setItem('characterDetailsData', JSON.stringify(characterDetails));
    
    // URL（ページ）も復元
    // location.hashを変更すると自動でrouterが動いて再描画される
    location.hash = savedData.hash;
    
    alert(`スロット${slotNumber}からロードしました！`);
    menu.classList.remove('is-open');
  }
};

// --- イベントリスナーの設定 ---
trigger.addEventListener('click', () => {
  menu.classList.toggle('is-open');
});

// 改善点: DOMContentLoadedをasyncにして、データ読み込みを待ってからrouterを起動
window.addEventListener('DOMContentLoaded', async () => {
  await loadCharacterDetails(); // データの読み込みが完了するまで待つ
  router(); // 完了後にページを描画する
});

window.addEventListener('hashchange', router);

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    setTimeout(() => { menu.classList.remove('is-open'); }, 100);
  });
});

// contentAreaでのクリックイベントを監視（イベント委任）
contentArea.addEventListener('click', (e) => {
  const target = e.target;

  // レベルアップボタンがクリックされたか
  if (target.classList.contains('levelup-button')) {
    levelUp(target.dataset.charId);
  }

  // セーブ・ロードボタンがクリックされたか
  if (target.classList.contains('save-button')) {
    saveGame(target.dataset.slot);
  }
  if (target.classList.contains('load-button')) {
    loadGame(target.dataset.slot);
  }
});