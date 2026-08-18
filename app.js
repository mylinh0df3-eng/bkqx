// ==================== 全局工具 / Global Utilities ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 页面切换
function showPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  const navLinks = $$('.vertical-nav a');
  navLinks.forEach(a => {
    if (a.dataset.page === pageId) a.classList.add('active');
    else a.classList.remove('active');
  });
}

// Toast 提示
function showToast(msg, duration = 3000) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, duration);
}

// ==================== 开场页 / Intro ====================
function startIntro() {
  setTimeout(() => { $('#introText1').style.display = 'block'; }, 2000);
  setTimeout(() => { $('#introText2').style.display = 'block'; }, 4000);
  setTimeout(() => { $('#introCursor').style.display = 'inline'; }, 6000);
  setTimeout(() => {
    $('#introHint').style.display = 'block';
    $('#introButtons').style.display = 'block';
    $('#skipBtn').style.display = 'none';
  }, 7000);
  $('#skipBtn').style.display = 'block';
}
document.getElementById('skipBtn').addEventListener('click', () => {
  $('#introText1').style.display = 'none';
  $('#introText2').style.display = 'none';
  $('#introCursor').style.display = 'none';
  $('#introHint').style.display = 'block';
  $('#introButtons').style.display = 'block';
  $('#skipBtn').style.display = 'none';
});
document.querySelector('[data-action="write"]').addEventListener('click', () => {
  showPage('letter-choice');
});
document.querySelector('[data-action="browse"]').addEventListener('click', () => {
  showPage('home');
  initBarrage();
});
startIntro();

// ==================== 弹幕墙 / Barrage ====================
const presetBarrages = [
  '在一起第1247天，他还是会在过马路时走在车来的那一侧。',
  '我没敢发出去的那句话是：我还在等你。',
  '异地恋第三年，今天终于可以见面了。',
  '如果重来一次，我还是会选你。',
  '你知道吗，我收藏了你所有的语音消息。',
  '今天路过我们第一次见面的地方，我停了三秒。',
  '其实我早就原谅你了，只是不知道怎么说。',
  '你煮的面真的很难吃，但我每次都吃完了。',
  '我喜欢你看我时眼里的光。',
  '我们吵架后，我躲在被子里哭了很久。',
  '你睡着的呼吸声让我觉得很安心。',
  '你说要给我一个家的时候，我信了。',
  '我想和你一起变老。',
  '对不起，那天我不该说那么重的话。',
  '我们第一次牵手时，我手心里全是汗。',
  '你笑起来真的很好看。',
  '我想每天醒来第一眼看到你。',
  '你说我们能不能走到最后？',
  '我愿意把所有的运气都花在遇见你这件事上。',
  '七夕快乐，我的爱人。',
  '今天是我们的纪念日，你记得吗？',
  '你是我平淡生活里的刺青。'
];

function initBarrage() {
  const tracks = ['#track1', '#track2', '#track3'];
  tracks.forEach(t => $(t).innerHTML = '');
  const redIndex = Math.floor(Math.random() * presetBarrages.length);
  const allBarrages = [...presetBarrages];
  const localBarrages = JSON.parse(localStorage.getItem('localBarrages') || '[]');
  allBarrages.push(...localBarrages);
  allBarrages.forEach((text, index) => {
    const track = $(tracks[index % 3]);
    const el = document.createElement('div');
    el.className = 'barrage-item' + (index === redIndex ? ' red' : '');
    el.textContent = text;
    const duration = 5 + Math.random() * 3;
    el.style.animationDuration = duration + 's';
    el.style.top = (Math.random() * 60) + '%';
    el.addEventListener('click', () => {
      const wasPaused = el.style.animationPlayState === 'paused';
      if (!wasPaused) {
        el.style.animationPlayState = 'paused';
        el.style.fontSize = '1.2em';
        el.style.color = '#fff';
        showToast('这句话让你想起一个人吗？');
      } else {
        el.style.animationPlayState = 'running';
        el.style.fontSize = '0.95em';
      }
    });
    track.appendChild(el);
  });
}

$('#addBarrageBtn').addEventListener('click', () => {
  const text = prompt('写一句你想说的话，匿名漂流。', '');
  if (text && text.trim()) {
    const barrages = JSON.parse(localStorage.getItem('localBarrages') || '[]');
    barrages.push(text.trim());
    localStorage.setItem('localBarrages', JSON.stringify(barrages));
    initBarrage();
    showToast('这句话漂出去了');
  }
});
// ==================== 电子情书 / Letter ====================
document.querySelector('[data-action="letter-now"]').addEventListener('click', () => {
  showPage('letter-write');
});
document.querySelector('[data-action="letter-timer"]').addEventListener('click', () => {
  showToast('这个功能马上就来，先写一封现在寄出的信吧');
});
document.getElementById('gotoWall').addEventListener('click', (e) => {
  e.preventDefault();
  showPage('letter-wall');
  renderWall();
});

let letterDraft = {};
function loadDraft() {
  const draft = JSON.parse(localStorage.getItem('letterDraft') || '{}');
  if (draft) {
    $('#letterTo').value = draft.to || '';
    $('#letterContent').value = draft.content || '';
    $('#letterFrom').value = draft.from || '';
    updateLetterCount();
  }
}
function updateLetterCount() {
  const len = $('#letterContent').value.length;
  $('#letterCount').textContent = '已写 ' + len + ' 字';
}
$('#letterNo').textContent = 'No. ' + Math.floor(1000 + Math.random() * 9000);

$('#letterContent').addEventListener('input', updateLetterCount);
$('#saveLetterBtn').addEventListener('click', () => {
  letterDraft = {
    to: $('#letterTo').value,
    content: $('#letterContent').value,
    from: $('#letterFrom').value,
  };
  localStorage.setItem('letterDraft', JSON.stringify(letterDraft));
  showToast('已保存');
});
$('#sealLetterBtn').addEventListener('click', () => {
  const content = $('#letterContent').value.trim();
  if (!content) {
    showToast('信还是空的，写点什么再封存吧');
    return;
  }
  letterDraft = {
    to: $('#letterTo').value || '___',
    content: content,
    from: $('#letterFrom').value || '匿名',
    date: new Date().toLocaleDateString('zh-CN'),
  };
  localStorage.setItem('letterDraft', JSON.stringify(letterDraft));
  showPage('letter-seal');
  playSealAnimation();
});

function playSealAnimation() {
  const animEl = $('#sealAnimation');
  animEl.textContent = '信纸三折中...';
  animEl.style.animation = 'fadeIn 1s ease';
  setTimeout(() => {
    animEl.textContent = '信纸折好了...';
  }, 1000);
  setTimeout(() => {
    animEl.style.display = 'none';
    $('#sealOptions').style.display = 'block';
  }, 2000);
}

$('#copyLinkBtn').addEventListener('click', async () => {
  const draft = JSON.parse(localStorage.getItem('letterDraft') || '{}');
  const encoded = encodeURIComponent(JSON.stringify(draft));
  const url = location.href.split('?')[0] + '?letter=' + encoded;
  try {
    await navigator.clipboard.writeText(url);
    showToast('链接已复制');
  } catch (err) {
    showToast('复制失败，请手动复制');
  }
});

$('#downloadImageBtn').addEventListener('click', () => {
  const draft = JSON.parse(localStorage.getItem('letterDraft') || '{}');
  const win = window.open('', '_blank');
  win.document.write('<html><head><title>情书</title></head><body style="background:#f5f0e8; padding:20px; font-family:serif;">' +
    '<h1>致 ' + (draft.to || '___') + '</h1>' +
    '<p style="white-space:pre-wrap;">' + (draft.content || '') + '</p>' +
    '<p style="text-align:right;">—— ' + (draft.from || '匿名') + '</p>' +
    '<p style="text-align:right;">' + (draft.date || '') + '</p>' +
    '</body></html>');
  showToast('请在新窗口中截图保存');
});

$('#generateQRBtn').addEventListener('click', () => {
  showToast('二维码功能需要接入 qrcode 库，一期暂用链接分享');
});

function parseLetterFromURL() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get('letter');
  if (encoded) {
    try {
      const draft = JSON.parse(decodeURIComponent(encoded));
      $('#receiveEnvelope').style.display = 'none';
      $('#receiveContent').style.display = 'block';
      $('#receiveFrom').textContent = '来自 ' + (draft.from || '匿名');
      $('#receiveBody').textContent = draft.content || '';
      $('#receiveDate').textContent = '这封信写于 ' + (draft.date || '未知日期');
    } catch (e) {
      showToast('这封信好像走丢了');
    }
  }
}
parseLetterFromURL();

$('#openLetterBtn').addEventListener('click', () => {
  $('#receiveEnvelope').style.display = 'none';
  $('#receiveContent').style.display = 'block';
});
$('#replyLetterBtn').addEventListener('click', () => {
  showPage('letter-write');
});

const presetLetters = [
  { from: '小满', content: '今天是我们在一起的第999天，我想说，我真的很幸福。', date: '2026-08-15' },
  { from: '匿名', content: '如果那天我没有松开手，现在我们会怎样？', date: '2026-08-10' },
  { from: '阿杰', content: '异地恋很苦，但一想到你就甜了。等我回来。', date: '2026-07-20' }
];
function renderWall(sort = 'new') {
  const wallEl = $('#letterWallCards');
  wallEl.innerHTML = '';
  const localLetters = JSON.parse(localStorage.getItem('publicLetters') || '[]');
  let allLetters = [...presetLetters, ...localLetters];
  if (sort === 'new') allLetters.sort((a,b) => new Date(b.date) - new Date(a.date));
  else allLetters.sort((a,b) => new Date(a.date) - new Date(b.date));

  if (allLetters.length === 0) {
    $('#wallEmpty').style.display = 'block';
  } else {
    $('#wallEmpty').style.display = 'none';
    allLetters.forEach(letter => {
      const card = document.createElement('div');
      card.className = 'wall-card';
      card.innerHTML = '<p>' + letter.content + '</p><span style="font-size:11px; color:#8a8a8a;">—— ' + (letter.from || '匿名') + '</span>';
      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
      wallEl.appendChild(card);
    });
  }
}
document.querySelectorAll('[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => {
    renderWall(btn.dataset.sort);
  });
});
// ==================== 愿望清单 / Wish List ====================
const presetWishes = [
  { text: '一起在凌晨两点去吃海底捞', tag: '美食', done: false },
  { text: '一起养一盆植物，看谁先把它养死', tag: '日常', done: false },
  { text: '一起坐一次绿皮火车，坐到终点站', tag: '旅行', done: false },
  { text: '在大雨里不打伞走一次', tag: '浪漫', done: false },
  { text: '一起学会做一道菜，然后做给双方父母吃', tag: '美食', done: false },
  { text: '一起去看一场演唱会，哪怕不是最喜欢的歌手', tag: '浪漫', done: false },
  { text: '一起在海边等日出', tag: '旅行', done: false },
  { text: '一起拍一组情侣写真，别笑场', tag: '浪漫', done: false },
];
function getWishes() {
  let wishes = JSON.parse(localStorage.getItem('wishes') || 'null');
  if (!wishes) {
    wishes = [...presetWishes];
    localStorage.setItem('wishes', JSON.stringify(wishes));
  }
  return wishes;
}
function renderWishList() {
  const wishes = getWishes();
  const undoneEl = $('#wishUndone');
  const doneEl = $('#wishDone');
  undoneEl.innerHTML = '';
  doneEl.innerHTML = '';
  let doneCount = 0;
  wishes.forEach((wish, index) => {
    const item = document.createElement('div');
    item.className = 'wish-item' + (wish.done ? ' done' : '');
    item.innerHTML = '<span class="wish-circle"></span>' + wish.text;
    item.addEventListener('click', () => {
      wish.done = !wish.done;
      localStorage.setItem('wishes', JSON.stringify(wishes));
      if (wish.done) {
        showToast('完成于今天。要写点什么纪念吗？');
      }
      renderWishList();
    });
    if (wish.done) {
      doneCount++;
      doneEl.appendChild(item);
    } else {
      undoneEl.appendChild(item);
    }
  });
  const total = wishes.length;
  const percent = total ? Math.round(doneCount / total * 100) : 0;
  $('#wishProgress').style.width = percent + '%';
  $('#wishProgressText').textContent = '已完成 ' + doneCount + ' / ' + total;
}
document.querySelector('[data-action="wish-create"]').addEventListener('click', () => {
  showPage('wish-list');
  renderWishList();
});
document.querySelector('[data-action="wish-inspire"]').addEventListener('click', () => {
  showPage('wish-inspire');
  renderInspire();
});
$('#addWishBtn').addEventListener('click', () => {
  const text = prompt('写下想一起做的事：');
  if (text && text.trim()) {
    const wishes = getWishes();
    wishes.push({ text: text.trim(), tag: '自定义', done: false });
    localStorage.setItem('wishes', JSON.stringify(wishes));
    renderWishList();
  }
});
$('#generateWishPosterBtn').addEventListener('click', () => {
  showToast('海报功能一期简化，请截图当前页面');
});

function renderInspire(tag = '全部') {
  const inspireList = $('#inspireList');
  inspireList.innerHTML = '';
  const allInspires = presetWishes.filter(w => !w.done);
  const filtered = tag === '全部' ? allInspires : allInspires.filter(w => w.tag === tag);
  filtered.forEach(wish => {
    const item = document.createElement('div');
    item.className = 'wish-item';
    item.innerHTML = wish.text + ' <button class="btn" data-add="' + wish.text + '">+ 加入我的清单</button>';
    inspireList.appendChild(item);
  });
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.dataset.add;
      const wishes = getWishes();
      wishes.push({ text: text, tag: '灵感', done: false });
      localStorage.setItem('wishes', JSON.stringify(wishes));
      showToast('已加入清单');
    });
  });
}
document.querySelectorAll('[data-tag]').forEach(btn => {
  btn.addEventListener('click', () => {
    renderInspire(btn.dataset.tag);
  });
});

// ==================== 拼图 / Puzzle ====================
let puzzleImage = null;
let puzzlePieces = [];
let puzzleTimerInterval = null;
let puzzleStartTime = null;
let puzzlePlaced = 0;

$('#uploadPhotoBtn').addEventListener('click', () => {
  $('#puzzleFileInput').click();
});
$('#puzzleFileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        puzzleImage = img;
        showPage('puzzle');
        startPuzzle();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function startPuzzle() {
  puzzlePlaced = 0;
  $('#puzzleCount').textContent = '已归位 0/9';
  clearInterval(puzzleTimerInterval);
  puzzleStartTime = Date.now();
  puzzleTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - puzzleStartTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    $('#puzzleTimer').textContent = minutes + ':' + seconds;
  }, 1000);

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(puzzleImage, 0, 0, 300, 300);
  const size = 100;
  puzzlePieces = [];
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const pieceCanvas = document.createElement('canvas');
    pieceCanvas.width = size;
    pieceCanvas.height = size;
    const pieceCtx = pieceCanvas.getContext('2d');
    pieceCtx.drawImage(canvas, col * size, row * size, size, size, 0, 0, size, size);
    puzzlePieces.push({ id: i, canvas: pieceCanvas, element: null, placed: false });
  }
  puzzlePieces.sort(() => Math.random() - 0.5);
  renderPuzzle();
}

function renderPuzzle() {
  const board = $('#puzzleBoard');
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.dataset.slot = i;
    board.appendChild(slot);
  }
  const pool = $('#piecePool');
  pool.innerHTML = '';
  puzzlePieces.forEach((piece, index) => {
    if (!piece.placed) {
      const img = document.createElement('img');
      img.src = piece.canvas.toDataURL();
      img.className = 'puzzle-piece';
      img.dataset.pieceId = piece.id;
      img.draggable = true;
      img.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', piece.id);
      });
      pool.appendChild(img);
      piece.element = img;
    }
  });
  document.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.addEventListener('dragover', (e) => e.preventDefault());
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
      const piece = puzzlePieces.find(p => p.id === pieceId);
      const slotIndex = parseInt(slot.dataset.slot);
      if (pieceId === slotIndex) {
        piece.placed = true;
        puzzlePlaced++;
        $('#puzzleCount').textContent = '已归位 ' + puzzlePlaced + '/9';
        if (piece.element) piece.element.remove();
        slot.innerHTML = '';
        const img = document.createElement('img');
        img.src = piece.canvas.toDataURL();
        img.style.width = '100%';
        img.style.height = '100%';
        slot.appendChild(img);
        playClickSound();
        if (puzzlePlaced === 9) {
          clearInterval(puzzleTimerInterval);
          showPage('puzzle-complete');
          $('#puzzleCompleteImg').src = puzzleImage.src;
          $('#puzzleCompleteText').textContent = '用时 ' + $('#puzzleTimer').textContent + '，你们一起把回忆拼好了。';
        }
      } else {
        showToast('这块不对哦');
      }
    });
  });
}

function playClickSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 800;
  gain.gain.value = 0.1;
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 100);
}

$('#puzzleResetBtn').addEventListener('click', startPuzzle);
$('#puzzleChangeBtn').addEventListener('click', () => {
  showPage('puzzle-entry');
});
$('#savePuzzleBtn').addEventListener('click', () => {
  showToast('请长按图片保存');
});
$('#puzzleAgainBtn').addEventListener('click', () => {
  showPage('puzzle-entry');
});
$('#puzzleWriteLetterBtn').addEventListener('click', () => {
  showPage('letter-write');
  $('#letterContent').value = '今天我们一起拼好了这张照片。';
  updateLetterCount();
});

// ==================== 声音胶囊 / Voice Capsule ====================
let mediaRecorder = null;
let recordedChunks = [];
let recordedBlob = null;
let recordTimerInterval = null;
let recordSeconds = 0;

document.getElementById('recordCapsuleBtn').addEventListener('click', () => {
  showPage('voice-record');
});
document.getElementById('myCapsulesBtn').addEventListener('click', () => {
  showPage('capsule-wall');
  renderCapsules();
});

const micBtn = document.getElementById('micBtn');
micBtn.addEventListener('pointerdown', startRecording);
micBtn.addEventListener('pointerup', stopRecording);

async function startRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      document.getElementById('recordActions').style.display = 'block';
      document.getElementById('recordingIndicator').style.display = 'none';
      micBtn.classList.remove('recording');
      clearInterval(recordTimerInterval);
    };
    mediaRecorder.start();
    micBtn.classList.add('recording');
    document.getElementById('recordingIndicator').style.display = 'block';
    recordSeconds = 0;
    updateRecordTimer();
    recordTimerInterval = setInterval(() => {
      recordSeconds++;
      updateRecordTimer();
      if (recordSeconds >= 60) {
        stopRecording();
      }
    }, 1000);
  } catch (err) {
    showToast('去设置里允许麦克风，这颗胶囊才装得进声音。');
  }
}

function updateRecordTimer() {
  const minutes = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
  const seconds = String(recordSeconds % 60).padStart(2, '0');
  document.getElementById('recordTimer').textContent = minutes + ':' + seconds;
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
}

document.getElementById('playRecordBtn').addEventListener('click', () => {
  if (recordedBlob) {
    const audio = new Audio(URL.createObjectURL(recordedBlob));
    audio.play();
  }
});
document.getElementById('reRecordBtn').addEventListener('click', () => {
  recordedBlob = null;
  document.getElementById('recordActions').style.display = 'none';
  showToast('已清除，重新录制');
});
document.getElementById('sendRecordBtn').addEventListener('click', () => {
  showToast('链接功能一期简化，请录音后分享音频文件');
});
document.getElementById('sealRecordBtn').addEventListener('click', () => {
  const dateInput = document.getElementById('unlockDateInput');
  dateInput.style.display = 'block';
  dateInput.addEventListener('change', function() {
    if (dateInput.value && recordedBlob) {
      const capsules = JSON.parse(localStorage.getItem('capsules') || '[]');
      capsules.push({
        id: Date.now(),
        unlockDate: dateInput.value,
        blobUrl: URL.createObjectURL(recordedBlob),
        createdAt: new Date().toLocaleDateString('zh-CN'),
      });
      localStorage.setItem('capsules', JSON.stringify(capsules));
      showToast('胶囊已封存');
      showPage('capsule-wall');
      renderCapsules();
    }
  });
});

function renderCapsules() {
  const list = document.getElementById('capsuleList');
  list.innerHTML = '';
  const capsules = JSON.parse(localStorage.getItem('capsules') || '[]');
  const now = new Date();
  if (capsules.length === 0) {
    document.getElementById('capsuleEmpty').style.display = 'block';
    return;
  }
  document.getElementById('capsuleEmpty').style.display = 'none';
  capsules.forEach(capsule => {
    const unlocked = new Date(capsule.unlockDate) <= now;
    const item = document.createElement('div');
    item.className = 'capsule-item';
    item.innerHTML = `
      <button class="capsule-play-btn" data-id="${capsule.id}" ${unlocked ? '' : 'disabled'}>▶</button>
      <div>
        <p style="font-size:0.9em;">${unlocked ? '已解锁' : '封存至 ' + capsule.unlockDate}</p>
        <p style="font-size:12px; color:#8a8a8a;">创建于 ${capsule.createdAt}</p>
      </div>
    `;
    list.appendChild(item);
  });
  document.querySelectorAll('.capsule-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const capsule = capsules.find(c => c.id === id);
      if (capsule && capsule.blobUrl) {
        const audio = new Audio(capsule.blobUrl);
        audio.play();
      }
    });
  });
}

// ==================== 初始化 ====================
parseLetterFromURL();
