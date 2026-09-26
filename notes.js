const notes=[
{title:"Repair checklist",date:"March 4 · 8:10 PM",body:"Repair the screen.\nCheck the battery.\nDo not erase the device.\nPreserve all messages and call history."},
{title:"Important",date:"March 3 · 11:48 PM",body:"The owner kept a second set of records on the phone.\n\nMessages → older conversations.\nCalls → look for the repeated number.\nGallery → locked.\n\nThe gallery password is 2142."},
{title:"Names",date:"February 27 · 4:21 PM",body:"John Doe\nSarah Miller\nMichael Reed\nNatasha\nDaniel Carter"},
{title:"Bank",date:"February 24 · 6:03 PM",body:"Check the dollar account before assuming the phone only contains personal data."}
];
const c=document.getElementById("notesContent");document.getElementById("backBtn").onclick=()=>parent.postMessage({type:"PHONE_BACK"},"*");
function list(){c.innerHTML=notes.map((n,i)=>`<div class="note-card"><button class="note-open" data-i="${i}"><h3>${n.title}</h3><p>${n.body.replace(/\n/g," ")}</p><div class="date">${n.date}</div></button></div>`).join("");c.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>detail(+b.dataset.i))}
function detail(i){const n=notes[i];c.innerHTML=`<div class="note-detail"><button class="back" id="noteBack">‹</button><h1>${n.title}</h1><div class="muted">${n.date}</div><div class="body">${escapeHTML(n.body)}</div></div>`;document.getElementById("noteBack").onclick=list}
function escapeHTML(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}list();
