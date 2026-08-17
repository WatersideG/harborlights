/* ---------------- events data ---------------- */
const EVENTS = [
  {d:"2026-08-14", day:"Fri", t:"7 – 11 PM", n:"Live Music: Homegrown", v:"Drift Bar", c:"drift", img:"https://harbor-lights.vercel.app/images/catchourdrift-41-scaled.jpg", ar:"3/2"},
  {d:"2026-08-15", day:"Sat", t:"12 – 4 PM", n:"Pups at Par", v:"Par & Tackle", c:"par", img:"IMG_food_menu", ar:"2/3"},
  {d:"2026-08-15", day:"Sat", t:"6:30 – 10 PM", n:"AYCE Lobster & BBQ Bash by the Bay", v:"Seaside Tent", c:"club", img:"IMG_food_lobster", ar:"3/2"},
  {d:"2026-08-15", day:"Sat", t:"7 – 11 PM", n:"Live Music: 440", v:"Drift Bar", c:"drift", img:"https://harbor-lights.vercel.app/images/tiki-bar-located-outside.jpg", ar:"3/2"},
  {d:"2026-08-16", day:"Sun", t:"3 – 6 PM", n:"Live Music: AK Cody", v:"Par & Tackle", c:"par", img:"IMG_food_spread", ar:"3/2"},
  {d:"2026-08-17", day:"Mon", t:"11 AM – 8 PM", n:"Pizza & Pitchers", v:"Par & Tackle", c:"par", img:"IMG_food_pretzel", ar:"2/3"},
  {d:"2026-08-18", day:"Tue", t:"5 – 7:30 PM", n:"Celebrity Bartender Night for the Izzy Foundation", v:"Drift Bar", c:"drift", img:"https://harbor-lights.vercel.app/images/Drift2.jpg", ar:"3/2"},
  {d:"2026-08-18", day:"Tue", t:"6:30 – 8:30 PM", n:"Music Bingo", v:"Par & Tackle", c:"par", img:"IMG_food_sliders", ar:"2/3"},
  {d:"2026-08-19", day:"Wed", t:"After 5 PM", n:"Ladies' Night", v:"Par & Tackle", c:"par", img:"IMG_food_tacos", ar:"2/3"},
  {d:"2026-08-21", day:"Fri", t:"7 – 11 PM", n:"Live Music: After School Special", v:"Drift Bar", c:"drift", img:"https://harbor-lights.vercel.app/images/Harbor-Lights-food-truck.jpg", ar:"3/2"},
  {d:"2026-08-22", day:"Sat", t:"12 – 4 PM", n:"Pups at Par", v:"Par & Tackle", c:"par", img:"IMG_food_fish", ar:"3/2"},
  {d:"2026-08-23", day:"Sun", t:"7 PM", n:"Full Moon Yoga & Soundbath", v:"Seaside Tent", c:"club", img:"https://harbor-lights.vercel.app/images/GA-10.jpg", ar:"3/2"}
];
const CATS = {all:"All", par:"Par & Tackle", drift:"Drift Bar", club:"Club Events"};
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function evCard(e){
  const dt = e.d.split("-");
  const src = e.img.startsWith("IMG_")
    ? "assets/" + e.img.slice(4).replace(/_/g, "-") + ".webp"
    : e.img;
  return `<article class="ev">
    <div class="thumb"><img src="${src}" alt="" loading="lazy"></div>
    <div class="body">
      <div class="when">${MONTH[+dt[1]-1]} ${+dt[2]} · ${e.day} · ${e.t}</div>
      <h3>${e.n}</h3>
      <div class="where">${e.v}</div>
    </div>
  </article>`;
}

/* ---------------- calendar filter with URL state ---------------- */
function currentFilter(){
  const q = location.hash.split("?")[1] || "";
  return new URLSearchParams(q).get("cat") || "all";
}
function renderCalendar(){
  const wrap = document.getElementById("calEvents");
  if(!wrap) return;
  const f = currentFilter();
  const list = f === "all" ? EVENTS : EVENTS.filter(e => e.c === f);
  wrap.innerHTML = list.map(evCard).join("");
  document.querySelectorAll("#calFilters .chip").forEach(b=>{
    b.setAttribute("aria-pressed", String(b.dataset.cat === f));
  });
  const empty = document.getElementById("calEmpty");
  if(empty) empty.hidden = list.length > 0;
}
function buildFilters(){
  const f = document.getElementById("calFilters");
  if(!f) return;
  f.innerHTML = Object.entries(CATS).map(([k,label])=>{
    const n = k === "all" ? EVENTS.length : EVENTS.filter(e=>e.c===k).length;
    return `<button class="chip" data-cat="${k}" aria-pressed="false">${label}<span class="c">${n}</span></button>`;
  }).join("");
  f.addEventListener("click", ev=>{
    const b = ev.target.closest(".chip");
    if(!b) return;
    const y = window.scrollY;
    location.hash = b.dataset.cat === "all" ? "#calendar" : "#calendar?cat=" + b.dataset.cat;
    requestAnimationFrame(()=>window.scrollTo(0,y));
  });
}

/* ---------------- router ---------------- */
const ROUTE_GROUP = {
  dining:"dining", reservations:"dining", catering:"dining",
  golf:"golf", "tee-times":"golf", tournaments:"golf",
  weddings:"weddings", "special-events":"weddings", corporate:"weddings", holiday:"weddings",
  pool:"pool",
  marina:"marina", transient:"marina", storage:"marina", service:"marina", "boat-club":"marina",
  calendar:"more", team:"more", about:"more", hotels:"more", contact:"more", book:"more"
};
const AB = {
  dining:["Reserve a table","#reservations"], reservations:["Reserve a table","#reservations"],
  catering:["Ask about catering","#catering"],
  golf:["Book a tee time","#tee-times"], "tee-times":["Book a tee time","#tee-times"],
  tournaments:["Reserve your dates","#tournaments"],
  weddings:["Request dates","#weddings"], "special-events":["Plan your event","#special-events"],
  corporate:["Request a proposal","#corporate"], holiday:["Book your party","#holiday"],
  pool:["Membership information","#pool"],
  marina:["Check dockage","#transient"], transient:["Check dockage","#transient"],
  storage:["Request storage","#storage"], service:["Request service","#service"],
  "boat-club":["Join the club","#boat-club"]
};
let lastPage = null;
function route(){
  const raw = (location.hash || "#home").slice(1);
  const id = raw.split("?")[0] || "home";
  const pages = document.querySelectorAll(".pagewrap");
  let found = false;
  pages.forEach(p=>{
    const on = p.dataset.page === id;
    p.classList.toggle("active", on);
    if(on) found = true;
  });
  if(!found){
    document.querySelector('[data-page="home"]').classList.add("active");
  }
  document.querySelectorAll(".nav .item").forEach(it=>{
    it.classList.toggle("active", it.dataset.route === ROUTE_GROUP[id]);
  });
  const ab = AB[id] || ["Book","#book"];
  const abEl = document.getElementById("ab-primary");
  abEl.textContent = ab[0]; abEl.href = ab[1];
  document.getElementById("sheet").classList.remove("open");
  document.getElementById("burger").setAttribute("aria-expanded","false");
  renderCalendar();
  if(lastPage !== id){ window.scrollTo(0,0); lastPage = id; }
}
window.addEventListener("hashchange", route);

/* ---------------- misc wiring ---------------- */
document.getElementById("burger").addEventListener("click", e=>{
  const s = document.getElementById("sheet");
  const open = s.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
document.getElementById("reviewToggle").addEventListener("click", e=>{
  const on = document.body.classList.toggle("notes");
  e.currentTarget.setAttribute("aria-pressed", String(on));
  e.currentTarget.lastChild.textContent = on ? " Hide change notes" : " Show change notes";
});
document.addEventListener("submit", e=>{
  if(e.target.matches("form[data-demo]")){
    e.preventDefault();
    const ok = e.target.querySelector(".ok");
    if(ok) ok.hidden = false;
  }
});
window.addEventListener("DOMContentLoaded", ()=>{
  const he = document.getElementById("homeEvents");
  if(he) he.innerHTML = EVENTS.slice(0,6).map(evCard).join("");
  buildFilters();
  route();
});
