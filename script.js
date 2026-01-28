let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;

function startPrepare() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Fayl tanlanmadi");

  mammoth.extractRawText({ arrayBuffer: file })
    .then(res => parseText(res.value));
}

function parseText(text) {
  const lines = text.split("\n");
  let q = null;

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith("#")) {
      if (q) questions.push(q);
      q = { question: line.slice(1), answers: [], correct: "" };
    } else if (line.startsWith("+")) {
      q.correct = line.slice(1);
      q.answers.push(line.slice(1));
    } else if (line && q) {
      q.answers.push(line);
    }
  });
  if (q) questions.push(q);

  questions.forEach(q => q.answers.sort(() => Math.random() - 0.5));
  questions.sort(() => Math.random() - 0.5);

  document.getElementById("home").style.display = "none";
  document.getElementById("test").style.display = "block";
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) return finishTest();

  const q = questions[current];
  document.getElementById("question").innerText = q.question;

  const box = document.getElementById("answers");
  box.innerHTML = "";

  q.answers.forEach(a => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.innerText = a;
    btn.onclick = () => {
      if (a === q.correct) correct++;
      else wrong++;
      current++;
      showQuestion();
    };
    box.appendChild(btn);
  });
}

function nextQuestion() {
  skipped++;
  current++;
  showQuestion();
}

function finishTest() {
  document.getElementById("test").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("stats").innerText =
    `To‘g‘ri: ${correct}, Noto‘g‘ri: ${wrong}, Tashlab ketilgan: ${skipped}`;
}

function restart() {
  location.reload();
}

function exitTest() {
  location.reload();
}