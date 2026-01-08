// === Паник атака – симптоми с тежест и техники ===
const symptoms = [
  {
    id: "palpitations",
    name: "Сърцебиене / учестен пулс",
    weight: 1.5,
    techniques: [
      "Седни или се облегни, отпусни раменете",
      "Вдишвай 4 сек → задръж 2 сек → издишай 6 сек",
      "Повтори 5–10 пъти",
      "Повтаряй мислено: „В безопасност съм“"
    ],
    thresholds: [
      { max: 3, message: "Леко сърцебиене", color: "green" },
      { max: 6, message: "Умерено", color: "yellow" },
      { max: 10, message: "Силно", color: "red" }
    ]
  },
  {
    id: "shortnessbreath",
    name: "Задух / трудно дишане",
    weight: 1.7,
    techniques: [
      "Седни с изправен гръб",
      "Дишай бавно през носа",
      "Ръка върху корема – дишане с диафрагмата",
      "Фокус върху ритъма, не върху страха"
    ],
    thresholds: [
      { max: 3, message: "Лек задух", color: "green" },
      { max: 6, message: "Умерен", color: "yellow" },
      { max: 10, message: "Силен", color: "red" }
    ]
  },
  {
    id: "feardeath",
    name: "Страх от смърт / загуба на контрол",
    weight: 1.8,
    techniques: [
      "Признай: това е паник атака",
      "Не се бори с мислите – наблюдавай ги",
      "Метод 5-4-3-2-1 за заземяване",
      "Утвърждение: „Атаката ще премине“"
    ],
    thresholds: [
      { max: 3, message: "Лек страх", color: "green" },
      { max: 6, message: "Умерен", color: "yellow" },
      { max: 10, message: "Силен", color: "red" }
    ]
  },
  {
    id: "dizziness",
    name: "Замайване / слабост",
    weight: 1.4,
    techniques: [
      "Седни или легни",
      "Пий вода на малки глътки",
      "Фокусирай поглед в една точка",
      "Бавно и равномерно дишане"
    ],
    thresholds: [
      { max: 3, message: "Леко", color: "green" },
      { max: 6, message: "Умерено", color: "yellow" },
      { max: 10, message: "Силно", color: "red" }
    ]
  },
  {
    id: "sweating",
    name: "Изпотяване",
    weight: 1.2,
    techniques: [
      "Остани на хладно",
      "Разкопчай дрехи",
      "Бавно дишане",
      "Приеми усещането – ще отмине"
    ],
    thresholds: [
      { max: 3, message: "Леко", color: "green" },
      { max: 6, message: "Умерено", color: "yellow" },
      { max: 10, message: "Силно", color: "red" }
    ]
  }
];

// === Генериране на симптоми с ПЛЪЗГАЧ ===
function populateSymptomsCheckboxes() {
  const container = document.getElementById("symptom-container");
  container.innerHTML = "";

  symptoms.forEach(s => {
    const row = document.createElement("div");
    row.className = "symptom-row";

    row.innerHTML = `
      <label class="symptom-label">
        <input type="checkbox" data-id="${s.id}">
        <span>${s.name}</span>
      </label>

      <div class="slider-wrap">
        <input type="range" min="0" max="10" value="5" class="intensity">
        <span class="value">5</span>
      </div>
    `;

    const slider = row.querySelector(".intensity");
    const value = row.querySelector(".value");

    slider.addEventListener("input", () => {
      value.textContent = slider.value;
    });

    container.appendChild(row);
  });
}

// === Взимане на избраните симптоми ===
function getSelectedSymptoms() {
  const selected = [];

  document.querySelectorAll(".symptom-row").forEach(row => {
    const checkbox = row.querySelector("input[type='checkbox']");
    const slider = row.querySelector(".intensity");

    if (checkbox.checked) {
      selected.push({
        id: checkbox.dataset.id,
        intensity: Number(slider.value)
      });
    }
  });

  return selected;
}

// === Изчисляване на тежест ===
function calculateSeverity(selected, duration, frequency) {
  let score = 0;
  let maxScore = 0;

  selected.forEach(s => {
    const symptom = symptoms.find(x => x.id === s.id);
    score += s.intensity * symptom.weight;
    maxScore += 10 * symptom.weight;
  });

  const durationFactor = Math.min(duration / 60, 1);
  const frequencyFactor = Math.min(frequency / 7, 1);

  score = score * 0.6 + score * durationFactor * 0.2 + score * frequencyFactor * 0.2;

  return Math.min(Math.round((score / maxScore) * 100), 100);
}

// === Цвят ===
function getColor(p) {
  if (p < 40) return "green";
  if (p < 70) return "yellow";
  return "red";
}

// === Показване на резултата ===
function showResult() {
  const selected = getSelectedSymptoms();
  const duration = Number(document.getElementById("duration").value);
  const frequency = Number(document.getElementById("frequency").value);
  const output = document.getElementById("output");
  const bar = document.getElementById("severity-bar");

  output.innerHTML = "";

  if (!selected.length || duration <= 0) {
    output.innerHTML = `<div class="result yellow">Моля, въведете коректни данни.</div>`;
    bar.style.width = "0%";
    return;
  }

  const severity = calculateSeverity(selected, duration, frequency);
  bar.style.width = severity + "%";
  bar.style.background = getColor(severity);

  selected.forEach(s => {
    const symptom = symptoms.find(x => x.id === s.id);
    const level = symptom.thresholds.find(t => s.intensity <= t.max);

    const div = document.createElement("div");
    div.className = "result " + level.color;
    div.innerHTML = `
      <strong>${symptom.name}</strong> (${s.intensity}/10) – ${level.message}
      <ul>${symptom.techniques.map(t => `<li>${t}</li>`).join("")}</ul>
    `;
    output.appendChild(div);
  });

  output.innerHTML += `<div class="note">Обща тежест: <strong>${severity}%</strong></div>`;
}

// === Старт ===
populateSymptomsCheckboxes();
document.getElementById("checkBtn").addEventListener("click", showResult);
