const people=[
{name:"John Doe",number:"+1 (334) 555-0193",initials:"JD",type:"Mobile",history:["Mar 4 · 9:12 PM","Mar 3 · 6:21 PM","Feb 28 · 11:03 AM"]},
{name:"Sarah Miller",number:"+1 (212) 555-0174",initials:"SM",type:"Mobile",history:["Mar 2 · 8:44 PM","Feb 25 · 2:15 PM"]},
{name:"Michael Reed",number:"+1 (917) 555-0131",initials:"MR",type:"Work",history:["Mar 1 · 4:09 PM"]},
{name:"Natasha",number:"+1 (646) 555-0118",initials:"N",type:"Mobile",history:["Feb 27 · 10:48 PM","Feb 24 · 7:30 PM"]}];
const c=document.getElementById("callsContent");
document.getElementById("backBtn").onclick=()=>parent.postMessage({type:"PHONE_BACK"},"*");
function list(){
c.innerHTML=`<div class="call-tabs"><button class="active">Recents</button><button id="contactsTab">Contacts</button></div>
<div class="section-label">Recent</div><div class="list">${people.map((p,i)=>`<div class="row"><button data-i="${i}"><span class="avatar">${p.initials}</span><span class="row-main"><span class="row-title">${p.name}</span><span class="row-sub">${i%2?"Missed call":"Outgoing call"}</span></span><span class="row-meta">${p.history[0]}</span></button></div>`).join("")}</div>`;
c.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>detail(+b.dataset.i));
document.getElementById("contactsTab").onclick=contacts;
}
function contacts(){
c.innerHTML=`<div class="call-tabs"><button id="recent">Recents</button><button class="active">Contacts</button></div><div class="section-label">All Contacts</div><div class="list">${people.map((p,i)=>`<div class="row"><button data-i="${i}"><span class="avatar">${p.initials}</span><span class="row-main"><span class="row-title">${p.name}</span><span class="row-sub">${p.number}</span></span></button></div>`).join("")}</div>`;
c.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>detail(+b.dataset.i));document.getElementById("recent").onclick=list;
}
function detail(i){
const p=people[i];
c.innerHTML=`<div class="contact-view"><div class="contact-hero"><div class="large-avatar">${p.initials}</div><h2>${p.name}</h2><p>${p.number}</p><p>${p.type}</p><div class="call-actions"><button class="round-action" id="call">☎</button><button class="round-action" id="message">●</button></div></div>
<div class="section-label">Call History</div><div class="list call-log">${p.history.map((h,j)=>`<div class="row"><div class="row-main"><div class="row-title">${j===1?"Missed call":"Outgoing call"}</div><div class="row-sub">${h}</div></div><span class="row-meta">${j===1?"↙":"↗"}</span></div>`).join("")}</div></div>`;
document.getElementById("call").onclick=()=>simulateCall(p);document.getElementById("message").onclick=()=>parent.postMessage({type:"PHONE_OPEN_APP",app:"messages"},"*");
}
function simulateCall(p){alert("Calling "+p.name+"…\n\nNo answer.");}
list();
