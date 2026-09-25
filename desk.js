const INVENTORY_KEY="brokenPhoneInventory";
const ITEM_DATA={
 precision_screwdriver:{name:"Precision Screwdriver",img:"precision_screwdriver.png"},
 replacement_battery:{name:"Replacement Battery",img:"replacement_battery.png"},
 old_key:{name:"Old Key",img:"old_key.png"}
};

const scene=document.getElementById("deskScene");
const unlockButton=document.getElementById("unlockButton");
const puzzle=document.getElementById("drawerPuzzle");
const grid=document.getElementById("matchGrid");
const itemsLayer=document.getElementById("itemsLayer");
const slots=document.getElementById("inventorySlots");
const toast=document.getElementById("toast");
const music=document.getElementById("music");
const clickSound=document.getElementById("clickSound");
const unlockSound=document.getElementById("unlockSound");
const collectSound=document.getElementById("collectSound");

let unlocked=localStorage.getItem("brokenPhoneDeskUnlocked")==="true";
let selected=null;
let matches=0;
let board=[];

const symbols=["●","◆","■","★","▲","✚"];

function getInventory(){
    try{return JSON.parse(localStorage.getItem(INVENTORY_KEY))||[]}
    catch(e){return []}
}
function saveInventory(arr){localStorage.setItem(INVENTORY_KEY,JSON.stringify(arr))}
function showToast(t){
    toast.textContent=t; toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),1600);
}
function play(s){
    if(!s)return;s.currentTime=0;s.volume=.4;s.play().catch(()=>{});
}
function renderInventory(){
    slots.innerHTML="";
    const inv=getInventory();
    for(let i=0;i<8;i++){
        const slot=document.createElement("div");slot.className="inventory-slot";
        if(inv[i]&&ITEM_DATA[inv[i]])slot.innerHTML=`<img src="${ITEM_DATA[inv[i]].img}"><span>${ITEM_DATA[inv[i]].name}</span>`;
        slots.appendChild(slot);
    }
}
function setupScene(){
    if(unlocked){
        scene.classList.remove("locked");scene.classList.add("open");
        unlockButton.classList.add("hidden");
        itemsLayer.classList.remove("hidden");
    }
    renderInventory();
    music.volume=.18;music.play().catch(()=>{});
}
function addItem(id){
    const inv=getInventory();
    if(inv.includes(id)){showToast("Already collected.");return}
    if(inv.length>=8){showToast("Inventory is full.");return}
    inv.push(id);saveInventory(inv);
    const el=document.querySelector(`[data-item="${id}"]`);
    if(el)el.classList.add("hidden");
    renderInventory();play(collectSound);
    showToast(`${ITEM_DATA[id].name} added to inventory.`);
}
function createBoard(){
    board=[];
    grid.innerHTML="";
    for(let i=0;i<144;i++){
        board.push(Math.floor(Math.random()*symbols.length));
    }
    board.forEach((value,index)=>{
        const b=document.createElement("button");
        b.className="tile";
        b.textContent=symbols[value];
        b.dataset.index=index;
        b.addEventListener("click",()=>tileClick(index));
        grid.appendChild(b);
    });
}
function tileClick(index){
    if(selected===null){
        selected=index;
        grid.children[index].classList.add("selected");
        return;
    }
    if(selected===index)return;
    const a=selected,b=index;
    const ar=Math.floor(a/12),ac=a%12,br=Math.floor(b/12),bc=b%12;
    if(Math.abs(ar-br)+Math.abs(ac-bc)!==1){
        grid.children[a].classList.remove("selected");
        selected=null;
        return;
    }
    [board[a],board[b]]=[board[b],board[a]];
    selected=null;
    renderBoard();
    const gained=clearMatches();
    if(gained>0){
        matches+=gained;
        document.getElementById("matchCount").textContent=Math.min(matches,10);
        if(matches>=10){
            unlockDrawer();
            return;
        }
    }
}
function renderBoard(){
    [...grid.children].forEach((b,i)=>{b.textContent=symbols[board[i]];b.classList.remove("selected")});
}
function clearMatches(){
    const remove=new Set();
    for(let r=0;r<12;r++){
        let run=1;
        for(let c=1;c<=12;c++){
            if(c<12&&board[r*12+c]===board[r*12+c-1])run++;
            else{
                if(run>=3)for(let k=0;k<run;k++)remove.add(r*12+c-1-k);
                run=1;
            }
        }
    }
    for(let c=0;c<12;c++){
        let run=1;
        for(let r=1;r<=12;r++){
            if(r<12&&board[r*12+c]===board[(r-1)*12+c])run++;
            else{
                if(run>=3)for(let k=0;k<run;k++)remove.add((r-1-k)*12+c);
                run=1;
            }
        }
    }
    if(!remove.size)return 0;
    remove.forEach(i=>board[i]=Math.floor(Math.random()*symbols.length));
    renderBoard();
    return remove.size>=6?2:1;
}
function unlockDrawer(){
    unlocked=true;
    localStorage.setItem("brokenPhoneDeskUnlocked","true");
    puzzle.classList.add("hidden");
    scene.classList.remove("locked");scene.classList.add("open");
    unlockButton.classList.add("hidden");
    itemsLayer.classList.remove("hidden");
    play(unlockSound);
    showToast("Drawer unlocked.");
    renderInventory();
    hideCollected();
}
function hideCollected(){
    getInventory().forEach(id=>{
        const el=document.querySelector(`[data-item="${id}"]`);
        if(el)el.classList.add("hidden");
    });
}

unlockButton.addEventListener("click",()=>{
    play(clickSound);
    puzzle.classList.remove("hidden");
    matches=0;
    document.getElementById("matchCount").textContent="0";
    createBoard();
});
document.getElementById("closePuzzle").addEventListener("click",()=>puzzle.classList.add("hidden"));
document.getElementById("backButton").addEventListener("click",()=>window.location.href="investigation.html");
document.querySelectorAll(".item").forEach(el=>el.addEventListener("click",()=>addItem(el.dataset.item)));
setupScene();
hideCollected();
