const PHONE_KEY = "brokenPhoneStateV2";
const PASSCODE = "0521";

const defaultState = {
  firstRun: true,
  hidden: false,
  unlocked: false,
  currentApp: "home",
  history: []
};

let state = loadState();
const shell = document.getElementById("phoneShell");
const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");
const appFrame = document.getElementById("appFrame");
const toggle = document.getElementById("phoneToggle");

const appFiles = {
  messages: "messages.html",
  calls: "calls.html",
  gallery: "gallery.html",
  notes: "notes.html",
  contacts: "contacts.html",
  bank: "bank.html",
  settings: "settings.html",
  browser: "browser.html",
  music: "music.html",
  clock: "clock.html",
  camera: "camera.html"
};

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem(PHONE_KEY));
    return {...defaultState,...(saved || {})};
  }catch(e){ return {...defaultState}; }
}
function saveState(){ localStorage.setItem(PHONE_KEY, JSON.stringify(state)); }

function render(){
  shell.classList.toggle("hidden-phone", state.hidden);
  if(state.hidden){
    toggle.textContent = "PHONE";
    return;
  }
  toggle.textContent = "HIDE";
  if(!state.unlocked){
    showOnly(lockScreen);
  }else if(state.currentApp === "home"){
    showOnly(homeScreen);
  }else{
    showOnly(appScreen);
    const file = appFiles[state.currentApp];
    if(file && !appFrame.src.endsWith("/"+file)) appFrame.src = file;
  }
}
function showOnly(el){
  [lockScreen,homeScreen,appScreen].forEach(x=>x.classList.add("hidden"));
  el.classList.remove("hidden");
}
function showHome(){
  state.currentApp="home";
  state.history=[];
  saveState();
  render();
}
function openApp(app, push=true){
  if(!state.unlocked) return;
  if(!appFiles[app]) return;
  if(push && state.currentApp !== "home" && state.currentApp !== app){
    state.history.push(state.currentApp);
  }
  if(push && state.currentApp === "home"){
    state.history.push("home");
  }
  state.currentApp=app;
  saveState();
  render();
}
function goBack(){
  if(state.currentApp==="home") return;
  const previous = state.history.pop() || "home";
  state.currentApp=previous;
  saveState();
  render();
}
toggle.addEventListener("click",()=>{
  state.hidden = !state.hidden;
  if(state.hidden){
    // Hiding the phone is the action that locks it.
    state.unlocked=false;
    state.currentApp="home";
    state.history=[];
  }
  saveState();
  render();
});

document.querySelectorAll("[data-app]").forEach(btn=>{
  btn.addEventListener("click",()=>openApp(btn.dataset.app));
});

function setupPasscode(){
  const pad=document.getElementById("passcodePad");
  const dots=[...document.querySelectorAll("#passcodeDots span")];
  let entered="";
  for(let i=1;i<=9;i++) makeKey(i);
  makeKey("0");
  function makeKey(value){
    const b=document.createElement("button");
    b.textContent=value;
    b.addEventListener("click",()=>{
      if(entered.length>=4) return;
      entered += String(value);
      dots.forEach((d,i)=>d.classList.toggle("filled",i<entered.length));
      if(entered.length===4){
        if(entered===PASSCODE){
          state.unlocked=true; state.hidden=false; state.currentApp="home"; state.history=[];
          saveState(); entered=""; dots.forEach(d=>d.classList.remove("filled")); render();
        }else{
          document.getElementById("passcodeError").textContent="Incorrect passcode";
          setTimeout(()=>{
            entered=""; dots.forEach(d=>d.classList.remove("filled"));
            document.getElementById("passcodeError").textContent="";
          },650);
        }
      }
    });
    pad.appendChild(b);
  }
}

function updateClock(){
  const now=new Date();
  const time=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",hour12:false});
  const d=now.toLocaleDateString([], {weekday:"long",month:"long",day:"numeric"});
  const a=document.getElementById("lockTime"),b=document.getElementById("lockStatusTime"),c=document.getElementById("homeTime"),e=document.getElementById("lockDate");
  if(a)a.textContent=time;if(b)b.textContent=time;if(c)c.textContent=time;if(e)e.textContent=d;
}
window.addEventListener("message",(event)=>{
  const data=event.data || {};
  if(data.type==="PHONE_HOME"){showHome();}
  if(data.type==="PHONE_BACK"){goBack();}
  if(data.type==="PHONE_OPEN_APP"){openApp(data.app,true);}
  if(data.type==="PHONE_HIDE"){
    state.hidden=true;state.unlocked=false;state.currentApp="home";state.history=[];saveState();render();
  }
});
setupPasscode();
updateClock(); setInterval(updateClock,1000);

// A fresh installation should always start visible on the repaired phone.
if(state.firstRun){
  state.firstRun=false;
  state.hidden=false;
  state.unlocked=false;
  state.currentApp="home";
  state.history=[];
  saveState();
}
render();
