// DOM要素を取得
const trigger = document.querySelector('.pie-menu__trigger');
const menu = document.querySelector('.pie-menu');
const contentArea = document.getElementById('content-area');
const menuButtons = document.querySelectorAll('.pie-menu__button');

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

// キャラクター詳細データ（レベルアップで更新される）
let characterDetails = {};

/**
 * JSONファイルを読み込む
 */
const loadCharacterDetails = async () => {
    try {
      const response = await fetch('./characters.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      characterDetails = await response.json();
    } catch (error) {
      console.error("キャラクターデータの読み込みに失敗しました:", error);
    }
};

// --- ルーター機能 ---
const router = () => {
  const path = location.hash.substring(1) || 'home';
  const pathParts = path.split('/'); // "chara/char001" のようなパスを分割

  contentArea.innerHTML = ''; // 画面をクリア

  // パスに基づいて表示を切り替える
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
      }
      // 削除: dataページの処理
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

  // ステータスを更新
  charData.level++;
  charData.hp += 10;
  charData.mp += 5;
  charData.attack += 3;
  charData.defense += 2;

  // 画面を再描画して更新後のステータスを反映
  renderCharacterDetail(charId);
};

// --- イベントリスナーの設定 ---
trigger.addEventListener('click', () => {
  menu.classList.toggle('is-open');
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadCharacterDetails();
  router();
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

  // 削除: セーブ・ロードボタンの処理
});