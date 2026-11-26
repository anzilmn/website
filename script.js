/* =====================================================
   SORRY WEBSITE — all content & settings are editable here
   ===================================================== */
const CONFIG = {
  whatsappNumber: "919446550263",          // <- country code + number, digits only (e.g. 919876543210)
  whatsappMessage: "Hey... I read everything. 💙",
  musicFile: "",                            // <- e.g. "music.mp3" (put file next to index.html). Empty = no music
  secretMessage: "You found my secret heart 🤍 You're one of the best people I know.",
  photos: ["", "", ""]                      // <- e.g. ["photos/1.jpg","photos/2.jpg","photos/3.jpg"]
};

/* type: normal | photos | glow | letter | final */
const SCREENS = [
  { art: "🧸", sign: "I'm Sorry 🥺", title: "Hey... I Have Something to Say to You.",
    sub: "I don't know if you'll read all of this, but I really hope you give me a few minutes.", btn: "Hear me out 💗" },
  { art: "🧸💧🐻", title: "I Know I Hurt You...",
    text: ["I know things haven't been okay between us. I know my words, my actions, or the way I handled things might have hurt you. And honestly, I keep thinking about it.",
           "I don't want to pretend nothing happened. I know I made mistakes, and I'm genuinely sorry for the pain I caused you."], btn: "Next →" },
  { art: "🥺💗", title: "You Still Matter to Me.",
    text: ["No matter how things turned out, the bond we had still means a lot to me. I miss our conversations, our silly moments, our random laughs, and the comfort of having you around.",
           "I never wanted things between us to become like this. I wish I could go back and handle everything differently."], btn: "There's more... 💌" },
  { art: "💌", title: "I'm Truly Sorry.", script: true,
    text: ["I'm sorry for everything that made you feel bad. I'm sorry if I made you feel ignored, unimportant, disappointed, or misunderstood. You didn't deserve to feel that way because of me.",
           "I don't have a perfect explanation, and I don't want to make excuses. I just want to accept where I went wrong and let you know that I'm sorry from the bottom of my heart.",
           "If I could change those moments, I genuinely would."], btn: "One more thing 🥺" },
  { type: "photos", title: "I Miss Our Friendship.",
    text: ["I miss the friendship we had. The random talks, stupid jokes, teasing each other, sharing things without thinking twice, and all those little moments that might have seemed ordinary but mean a lot to me now.",
           "I don't expect everything to suddenly become normal. I just wish we could slowly find our way back to talking, laughing, and being comfortable around each other again.",
           "Even a small conversation with you would mean a lot."], btn: "Can I ask you something? 💜" },
  { type: "glow", title: "Can We Start Again? 🥺", script: true,
    text: ["I know saying sorry doesn't magically fix everything. Trust takes time, and I understand if you still feel hurt.",
           "But if there's even a little space in your heart for me, would you give our friendship one more chance?",
           "Not to forget what happened. Not to force anything. Just to start slowly, talk again, and make things better this time.",
           "I'll respect whatever you decide. I just didn't want to leave these words unsaid."], btn: "Read my little letter 💌" },
  { type: "letter", art: "🐱💐",
    text: ["Hey... 💙", "I don't really know how to put everything into words, but I wanted to try.",
           "I'm genuinely sorry for hurting you. I know things aren't the same right now, and I know I can't fix everything just by writing this. But I wanted you to know that you're important to me and that our friendship isn't something I take lightly.",
           "I miss you. I miss the way we used to talk, the laughs, the silly things, and just being able to be ourselves around each other.",
           "I don't expect you to forget anything or forgive me just because I said sorry. Take your time. I just hope someday we can talk again without all this distance between us.",
           "If you're willing to give me a second chance, I'll be really grateful. And if you need time, I'll understand that too.",
           "I'm sorry. Truly.", "— Anzil 💙"], btn: "One last question..." },
  { type: "final", art: "🐻", title: "Can We Be Friends Again? 🥹", sub: "No pressure. Just answer honestly." }
];

const ENDINGS = {
  yes: { art: "🫂", title: "You have no idea how happy this makes me. 💗",
         text: ["Thank you for giving me a chance. I won't take it for granted. Let's take it slowly, one step at a time."], confetti: true },
  wait: { art: "💜", title: "That's okay. Take all the time you need. 💜",
          text: ["I just wanted to say what was in my heart. I won't pressure you. Whenever you're ready, if you ever feel like talking, I'll be here."] },
  hug: { art: "🫂", title: "Sending you a virtual hug. 🫂💜", text: [] }
};

/* ================= Code ================= */
const $ = s => document.querySelector(s);
const stage = $("#stage"), overlay = $("#overlay"), toast = $("#toast");
let current = 0, stopTyping = null;

/* ---- Rendering ---- */
function build(i) {
  const s = SCREENS[i], t = s.type || "normal";
  let h = `<section class="card-s">`;
  if (s.sign) h += `<div class="art">${s.art}</div><br><div class="sign">${s.sign}</div>`;
  else if (t === "photos") h += `<div class="pair"><span>🧸</span><span>🐻</span></div>`;
  else if (t === "glow") h += `<div class="glow">💗</div>`;
  else if (s.art) h += `<div class="art">${s.art}</div>`;
  if (s.title) h += `<h1>${s.title}</h1>`;
  if (s.sub) h += `<p class="script">${s.sub}</p>`;
  if (t === "letter") h += `<div class="paper" id="paper" title="Tap to skip typing"></div>`;
  else (s.text || []).forEach(p => h += `<p class="${s.script ? "script" : ""}">${p}</p>`);
  if (t === "photos") h += `<div class="photos">${[0, 1, 2].map(n => `<div class="photo">${CONFIG.photos[n] ? `<img src="${CONFIG.photos[n]}" alt="Our photo">` : "📷"}</div>`).join("")}</div>`;
  if (t === "final") h += `<button class="btn-love" data-a="yes">Okay... let's try 💗</button><button class="btn-love btn-soft" data-a="wait">I need some time 🥺</button>`;
  else h += `<button class="btn-love ${t === "letter" ? "hide" : ""}" id="next">${s.btn}</button>`;
  return h + `</section>`;
}

function go(i, back = false) {
  if (stopTyping) { stopTyping(true); stopTyping = null; }
  current = i;
  stage.innerHTML = build(i);
  if (back) stage.firstElementChild.classList.add("back");
  $("#bar").style.width = ((i + 1) / SCREENS.length) * 100 + "%";
  $("#count").textContent = `${i + 1} / ${SCREENS.length}`;
  $("#backBtn").disabled = i === 0;
  const next = $("#next"); if (next) next.onclick = () => go(i + 1);
  stage.querySelectorAll("[data-a]").forEach(b => b.onclick = () => ending(b.dataset.a));
  if (SCREENS[i].type === "letter") startLetter(SCREENS[i].text);
  window.scrollTo(0, 0);
}

/* ---- Typing animation for the letter ---- */
function startLetter(paras) {
  const box = $("#paper"), nodes = paras.map(() => box.appendChild(document.createElement("p")));
  let p = 0, c = 0, timer, finished = false;
  const finish = () => { if (finished) return; finished = true; clearTimeout(timer); const n = $("#next"); if (n) n.classList.remove("hide"); };
  const tick = () => {
    if (p >= paras.length) return finish();
    nodes[p].textContent = paras[p].slice(0, ++c);
    if (c >= paras[p].length) { p++; c = 0; timer = setTimeout(tick, 300); } else timer = setTimeout(tick, 20);
  };
  stopTyping = (silent) => { clearTimeout(timer); if (!silent) { nodes.forEach((n, i) => n.textContent = paras[i]); finish(); } finished = true; };
  box.onclick = () => stopTyping();
  tick();
}

/* ---- Final answers ---- */
function ending(kind) {
  const e = ENDINGS[kind];
  let h = `<div class="card-s" style="max-width:520px"><div class="art">${e.art}</div><h1>${e.title}</h1>`;
  e.text.forEach(p => h += `<p class="script">${p}</p>`);
  if (kind === "yes") {
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    h += `<a class="btn-love" href="${url}" target="_blank" rel="noopener">Send me a message 💌</a>`;
  }
  if (kind === "wait") h += `<button class="btn-love" id="hugBtn">Close with a hug 🫂</button>`;
  h += `<br><button class="btn-love btn-soft" id="replay">Replay from the beginning ↻</button></div>`;
  overlay.innerHTML = h; overlay.classList.add("show");
  if (e.confetti) rain(60);
  const hug = $("#hugBtn"); if (hug) hug.onclick = () => ending("hug");
  $("#replay").onclick = () => { overlay.classList.remove("show"); document.querySelectorAll(".confetti").forEach(n => n.remove()); go(0); };
}

/* ---- Falling hearts, flowers & confetti ---- */
function rain(n) {
  const set = ["💗", "🌸", "✨", "💜", "🌷", "🎀"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "confetti"; s.textContent = set[i % set.length];
    s.style.cssText = `left:${Math.random() * 100}vw;font-size:${14 + Math.random() * 18}px;animation-duration:${4 + Math.random() * 4}s;animation-delay:${Math.random() * 3}s`;
    document.body.appendChild(s); s.onanimationend = () => s.remove();
  }
}
function floatHeart() {
  const box = $("#hearts"); if (box.children.length > 14) return;
  const s = document.createElement("span"), set = ["💗", "💜", "🌸", "✨", "🤍"];
  s.textContent = set[Math.floor(Math.random() * set.length)];
  s.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 18}px;animation-duration:${8 + Math.random() * 6}s`;
  box.appendChild(s); s.onanimationend = () => s.remove();
}
setInterval(floatHeart, 1200);

/* ---- Controls ---- */
$("#backBtn").onclick = () => current > 0 && go(current - 1, true);
$("#secret").onclick = () => { toast.textContent = CONFIG.secretMessage; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 3500); };
const music = $("#music"), mBtn = $("#musicBtn");
if (!CONFIG.musicFile) mBtn.style.display = "none"; else music.src = CONFIG.musicFile;
mBtn.onclick = () => { // plays only after a tap — never autoplays
  if (music.paused) { music.play().catch(() => {}); mBtn.classList.add("on"); } else { music.pause(); mBtn.classList.remove("on"); }
};

go(0);
