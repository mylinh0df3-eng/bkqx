// 全局工具
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showPage(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
}

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// 开场页
function startIntro() {
  setTimeout(() => { $('#introText1').style.display = 'block'; }, 2000);
  setTimeout(() => { $('#introText2').style.display = 'block'; }, 4000);
  setTimeout(() => { $('#introCursor').style.display = 'inline'; }, 6000);
  setTimeout(() => {
    $('#introHint').style.display = 'block';
    $('#introButtons').style.display = 'block';
  }, 7000);
}

document.getElementById('skipBtn').addEventListener('click', () => {
  $('#introText1').style.display = 'none';
  $('#introText2').style.display = 'none';
  $('#introCursor').style.display = 'none';
  $('#introHint').style.display = 'block';
  $('#introButtons').style.display = 'block';
});

document.querySelector('[data-action="write"]').addEventListener('click', () => {
  showPage('letter-choice');
});

document.querySelector('[data-action="browse"]').addEventListener('click', () => {
  showPage('home');
  initBarrage();
});

// 弹幕墙
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
  presetBarrages.forEach((text, index) => {
    const track = $(tracks[index % 3]);
    const el = document.createElement('div');
    el.className = 'barrage-item';
    el.textContent = text;
    el.style.animationDuration = (5 + Math.random() * 3) + 's';
    el.style.top = (Math.random() * 60) + '%';
    track.appendChild(el);
  });
}

$('#addBarrageBtn').addEventListener('click', () => {
  const text = prompt('写一句你想说的话，匿名漂流。', '');
  if (text && text.trim()) {
    showToast('这句话漂出去了');
    initBarrage();
  }
});

// 其他按钮占位
document.querySelector('[data-action="letter-now"]').addEventListener('click', () => {
  showPage('letter-write');
});
document.querySelector('[data-action="letter-timer"]').addEventListener('click', () => {
  showToast('这个功能马上就来，先写一封现在寄出的信吧');
});
document.getElementById('gotoWall').addEventListener('click', (e) => {
  e.preventDefault();
  showPage('letter-wall');
});
document.querySelector('[data-action="wish-create"]').addEventListener('click', () => {
  showPage('wish-list');
});
document.querySelector('[data-action="wish-inspire"]').addEventListener('click', () => {
  showPage('wish-inspire');
});
document.getElementById('uploadPhotoBtn').addEventListener('click', () => {
  showPage('puzzle-entry');
});
document.getElementById('recordCapsuleBtn').addEventListener('click', () => {
  showPage('voice-record');
});
document.getElementById('myCapsulesBtn').addEventListener('click', () => {
  showPage('capsule-wall');
});

// 启动
startIntro();
