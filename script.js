// ==============================
// CẤU HÌNH GOOGLE SHEETS
// ==============================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8U1PXxfmcP91LK-Jf8pemy1BXRvSOFfI15HcRTtOBT1mEcAB9I8kDMVKnVSVVbhixNg/exec";

const intro = document.getElementById("intro");
const site = document.getElementById("site");

document.getElementById("openBtn").addEventListener("click", () => {

  const music = document.getElementById("bgMusic");
  music.play();
  intro.style.transition = "opacity .8s ease, transform .8s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.03)";

  setTimeout(() => {
    intro.style.display = "none";
    site.classList.remove("hidden");
    site.scrollIntoView({ behavior: "smooth" });
    burst();

  }, 700);

});


// ==============================
// COUNTDOWN
// ==============================
const target = new Date("2026-09-23T16:00:00+07:00").getTime();

function countdown() {
  let d = target - Date.now();

  if (d < 0) d = 0;

  const day = Math.floor(d / 86400000);
  d %= 86400000;

  const hour = Math.floor(d / 3600000);
  d %= 3600000;

  const min = Math.floor(d / 60000);
  const sec = Math.floor((d % 60000) / 1000);

  document.getElementById("days").textContent =
    String(day).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hour).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(min).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(sec).padStart(2, "0");
}

countdown();
setInterval(countdown, 1000);


// ==============================
// HIỆU ỨNG MỞ THIỆP
// ==============================
function burst() {
  for (let i = 0; i < 35; i++) {
    const e = document.createElement("i");

    e.textContent = Math.random() > .5 ? "✦" : "•";
    e.style.position = "fixed";
    e.style.left = (50 + Math.random() * 30 - 15) + "vw";
    e.style.top = "25vh";
    e.style.zIndex = 50;
    e.style.color =
      Math.random() > .5 ? "#b89c52" : "#172b4d";
    e.style.fontSize =
      (8 + Math.random() * 15) + "px";
    e.style.pointerEvents = "none";
    e.style.transition =
      "transform 1.8s ease, opacity 1.8s ease";

    document.body.appendChild(e);

    requestAnimationFrame(() => {
      e.style.transform =
        `translate(${(Math.random() - .5) * 500}px,${150 + Math.random() * 500}px) rotate(${Math.random() * 500}deg)`;
      e.style.opacity = 0;
    });

    setTimeout(() => e.remove(), 1900);
  }
}


// ==============================
// KIỂM TRA KẾT NỐI GOOGLE SHEETS
// ==============================
function apiReady() {
  return GOOGLE_SCRIPT_URL &&
    !GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE");
}

function buildUrl(action, params = {}) {
  const url = new URL(GOOGLE_SCRIPT_URL);

  url.searchParams.set("action", action);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value ?? "")
  );

  return url.toString();
}


// ==============================
// GỬI DỮ LIỆU LÊN GOOGLE SHEETS
// ==============================
async function submitToGoogleSheet(action, params) {
  const r = await fetch(
    buildUrl(action, params),
    { method: "GET" }
  );

  return await r.json();
}


// ==============================
// FORM GỬI LỜI CHÚC
// Lời chúc chỉ được lưu vào Google Sheets.
// KHÔNG hiển thị danh sách lời chúc trên website.
// ==============================
document.getElementById("wishForm").addEventListener("submit", async e => {
  e.preventDefault();

  const status = document.getElementById("wishStatus");

  if (!apiReady()) {
    status.textContent =
      "Thiệp chưa được kết nối với Google Sheets.";
    return;
  }

  status.textContent = "Đang gửi...";

  try {
    const data = await submitToGoogleSheet("wish", {
      name: document.getElementById("wishName").value.trim(),
      message: document.getElementById("wishMessage").value.trim()
    });

    status.textContent =
      data.message || "Đã gửi lời chúc!";

    if (data.ok) {
      e.target.reset();
    }

  } catch (err) {
    status.textContent =
      "Không thể gửi. Vui lòng thử lại.";
  }
});


// ==============================
// FORM RSVP
// ==============================
document.getElementById("rsvpForm").addEventListener("submit", async e => {
  e.preventDefault();

  const status = document.getElementById("rsvpStatus");

  const attendance =
    document.querySelector(
      'input[name="attendance"]:checked'
    )?.value;

  if (!apiReady()) {
    status.textContent =
      "Thiệp chưa được kết nối với Google Sheets.";
    return;
  }

  status.textContent =
    "Đang lưu xác nhận...";

  try {
    const data = await submitToGoogleSheet("rsvp", {
      name: document.getElementById("rsvpName").value.trim(),
      attendance,
      note: document.getElementById("rsvpNote").value.trim()
    });

    status.textContent =
      data.message || "Đã ghi nhận!";

    if (data.ok) {
      e.target.reset();
    }

  } catch (err) {
    status.textContent =
      "Không thể lưu xác nhận. Vui lòng thử lại.";
  }
});