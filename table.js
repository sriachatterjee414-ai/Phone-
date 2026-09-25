const KEY="brokenPhoneInventory";
const DATA={
screen_connector:{name:"Screen Connector",img:"screen_connector.png"},
cassette_tape:{name:"Cassette Tape",img:"cassette_tape.png"}
};
const slots=document.getElementById("inventorySlots");
const toast=document.getElementById("toast");
function inv(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
function save(a){localStorage.setItem(KEY,JSON.stringify(a))}
function render(){
slots.innerHTML="";
const a=inv();
for(let i=0;i<8;i++){
const s=document.createElement("div");s.className="inventory-slot";
if(a[i]&&DATA[a[i]])s.innerHTML=`<img src="${DATA[a[i]].img}"><span>${DATA[a[i]].name}</span>`;
slots.appendChild(s);
}}
function collect(id,el){
let a=inv();
if(a.includes(id)){toast.textContent="Already collected.";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1500);return}
if(a.length>=8)return;
a.push(id);save(a);el.classList.add("hidden");render();
document.getElementById("collectSound").play().catch(()=>{});
toast.textContent=`${DATA[id].name} added to inventory.`;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1600);
}
document.getElementById("backButton").onclick=()=>location.href="investigation.html";
document.querySelectorAll(".item").forEach(el=>el.onclick=()=>collect(el.dataset.item,el));
document.getElementById("music").volume=.18;document.getElementById("music").play().catch(()=>{});
render();
inv().forEach(id=>{const e=document.querySelector(`[data-item="${id}"]`);if(e)e.classList.add("hidden")});
