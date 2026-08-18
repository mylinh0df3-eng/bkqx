// ==================== 全局工具 / Global Utilities ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 页面切换
function showPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
  // 更新竖排导航高亮
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
let introTimeline = [];
function startIntro() {
  // 0-2s 黑屏
  // 2-4s 第一行
  setTimeout(() => {
    $('#introText1').style.display = 'block';
  }, 2000);
  // 4-6s 第二行
  setTimeout(() => {
    $('#introText2').style.display = 'block';
  }, 4000);
  // 6-7s 光标
  setTimeout(() => {
    $('#introCursor').style.display = 'inline';
  }, 6000);
  // 7-8s 提示文字和按钮
  setTimeout(() => {
    $('#introHint').style.display = 'block';
    $('#introButtons').style.display = 'block';
    $('#skipBtn').style.display = 'none';
  }, 7000);
  // 显示跳过按钮
  $('#skipBtn').style.display = 'block';
}
// 跳过
document.getElementById('skipBtn').addEventListener('click', () => {
  // 直接跳到按钮状态
  $('#introText1').style.display = 'none';
  $('#introText2').style.display = 'none';
  $('#introCursor').style.display = 'none';
  $('#introHint').style.display = 'block';
  $('#introButtons').style.display = 'block';
  $('#skipBtn').style.display = 'none';
});
// 写点什么
document.querySelector('[data-action="write"]').addEventListener('click', () => {
  showPage('letter-choice');
});
// 先逛逛
document.querySelector('[data-action="browse"]').addEventListener('click', () => {
  showPage('home');
  initBarrage();
});
// 启动开场时间轴
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
  // 清空
  tracks.forEach(t => $(t).innerHTML = '');
  // 随机选一条红色
  const redIndex = Math.floor(Math.random() * presetBarrages.length);
  const allBarrages = [...presetBarrages];
  // 用户之前发布的本地弹幕
  const localBarrages = JSON.parse(localStorage.getItem('localBarrages') || '[]');
  allBarrages.push(...localBarrages);
  // 分配弹幕到三条轨道
  allBarrages.forEach((text, index) => {
    const track = $(tracks[index % 3]);
    const el = document.createElement('div');
    el.className = 'barrage-item' + (index === redIndex ? ' red' : '');
    el.textContent = text;
    // 随机动画时长 5-8s
    const duration = 5 + Math.random() * 3;
    el.style.animationDuration = duration + 's';
    el.style.top = (Math.random() * 60) + '%';
    el.addEventListener('click', () => {
      // 暂停、放大、显示提示
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

// 发布弹幕
$('#addBarrageBtn').addEventListener('click', () => {
  const text = prompt('写一句你想说的话，匿名漂流。', '');
  if (text && text.trim()) {
    const barrages = JSON.parse(localStorage.getItem('localBarrages') || '[]');
    barrages.push(text.trim());
    localStorage.setItem('localBarrages', JSON.stringify(barrages));
    // 重新初始化弹幕墙
    initBarrage();
    showToast('这句话漂出去了');
  }
});

// ==================== 电子情书 / Letter ====================
// 选择页
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

// 写信页
let letterDraft = {};
function loadDraft() {
  const draft = JSON.parse(localStorage.getItem('letterDraft') || '{}');
  if (draft) {
    $('#letterTo').value = draft.to || '';
    $('#letterContent').value = draft.content || '';
    $('#letterFrom').value = draft.from || '';
    updateL
