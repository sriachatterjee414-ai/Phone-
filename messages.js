const contacts=[
{id:"john",name:"John Doe",initials:"JD",preview:"We need to talk about the phone.",time:"10:42 PM",online:"Active recently"},
{id:"sarah",name:"Sarah Miller",initials:"SM",preview:"Did you find anything in the repair?",time:"Yesterday",online:"Active yesterday"},
{id:"michael",name:"Michael Reed",initials:"MR",preview:"Keep the device safe.",time:"Monday",online:"Active Monday"},
{id:"natasha",name:"Natasha",initials:"N",preview:"Don't send anything yet.",time:"Sunday",online:"Active Sunday"},
{id:"daniel",name:"Daniel Carter",initials:"DC",preview:"I'll call you later.",time:"Saturday",online:"Active Saturday"}
];

const chats={
john:[
["them","You still have the damaged phone, right?","8:41 PM"],
["me","Yes. I'm repairing it now.","8:43 PM"],
["them","Do not wipe anything from it.","8:44 PM"],
["me","I wasn't planning to.","8:45 PM"],
["them","Good. There may be something important hidden in the messages.","8:47 PM"],
["me","What exactly am I looking for?","8:49 PM"],
["them","A conversation that shouldn't be there.","8:50 PM"],
["me","That's not very specific.","8:52 PM"],
["them","You will know it when you see it.","8:53 PM"],
["me","I found several old chats.","8:56 PM"],
["them","Read the older ones first.","8:57 PM"],
["me","I'm scrolling through them.","8:58 PM"],
["them","And don't contact the number at the top.","9:01 PM"],
["me","Why?","9:02 PM"],
["them","Because whoever owns it isn't supposed to know you have the phone.","9:04 PM"],
["me","That's reassuring.","9:05 PM"],
["them","I'm serious.","9:06 PM"],
["me","Okay. I'll be careful.","9:07 PM"],
["them","Check the notes too.","9:10 PM"],
["me","There's a note with a strange number.","9:11 PM"],
["them","Don't type it anywhere yet.","9:13 PM"],
["me","Then what should I do?","9:15 PM"],
["them","Keep investigating.","9:16 PM"],
["them","The phone belonged to someone who knew more than they should have.","9:19 PM"],
["me","Who?","9:20 PM"],
["them","You'll find the name in the call history.","9:22 PM"],
["me","I'm opening it now.","9:24 PM"],
["them","Then you'll understand why I told you not to call anyone.","9:25 PM"],
["me","Understood.","9:27 PM"],
["them","One more thing.","9:31 PM"],
["me","What?","9:32 PM"],
["them","If you find a locked gallery, don't guess the password.","9:34 PM"],
["me","Why?","9:35 PM"],
["them","The hint is somewhere in the messages.","9:36 PM"],
["me","I'll look for it.","9:37 PM"],
["them","Good.","9:38 PM"],
["them","And John—","9:39 PM"],
["me","Yes?","9:40 PM"],
["them","If this phone suddenly goes missing, stop investigating.","9:41 PM"]
],
sarah:[
["them","Did you find anything useful?","Yesterday"],
["me","Not yet. There are a lot of old messages.","Yesterday"],
["them","That's probably where the answer is.","Yesterday"],
["me","I'm going through them one by one.","Yesterday"],
["them","Be careful with the attachments.","Yesterday"],
["me","Why?","Yesterday"],
["them","Some of them aren't what they look like.","Yesterday"],
["me","I'll keep that in mind.","Yesterday"]
],
michael:[
["them","Keep the device safe.","Monday"],
["me","It's on my desk.","Monday"],
["them","Good.","Monday"],
["them","Don't connect it to anything.","Monday"],
["me","Why not?","Monday"],
["them","Just trust me.","Monday"],
["me","Fine.","Monday"]
],
natasha:[
["them","Don't send anything yet.","Sunday"],
["me","I haven't.","Sunday"],
["them","Good.","Sunday"],
["them","The owner used several names.","Sunday"],
["me","That makes things harder.","Sunday"],
["them","It also makes the truth easier to miss.","Sunday"]
],
daniel:[
["them","I'll call you later.","Saturday"],
["me","Okay.","Saturday"],
["them","Make sure the phone is charged.","Saturday"],
["me","It is.","Saturday"]
]};

let selected=null;
const list=document.getElementById("messageList");
document.getElementById("backBtn").onclick=()=>parent.postMessage({type:"PHONE_BACK"},"*");
document.getElementById("newBtn").onclick=()=>alert("New message is disabled in this investigation build.");

function renderList(){
 list.innerHTML=`<div class="section-label">Messages</div><div class="list">${
 contacts.map(c=>`<div class="row message-list-item"><button data-id="${c.id}">
 <span class="avatar">${c.initials}</span><span class="row-main"><span class="row-title">${c.name}</span><span class="row-sub">${c.preview}</span></span><span class="row-meta">${c.time}</span></button></div>`).join("")
 }</div>`;
 list.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openChat(b.dataset.id));
}
function openChat(id){
 selected=contacts.find(c=>c.id===id);
 const messages=chats[id]||[];
 list.innerHTML=`<section class="conversation">
 <header class="conversation-header"><button class="back" id="chatBack">‹</button><div class="person-head"><span class="mini-avatar">${selected.initials}</span><div><strong>${selected.name}</strong><small>${selected.online}</small></div></div></header>
 <div id="chatScroll" class="chat-scroll">
 <div class="day-divider">Earlier messages</div>
 ${messages.map(m=>`<div class="bubble ${m[0]}">${escapeHTML(m[1])}</div><div class="time ${m[0]==="me"?"me":""}">${m[2]}</div>`).join("")}
 </div>
 <form id="composer" class="composer">
   <button type="button" class="tool-btn" id="photoBtn">＋</button>
   <button type="button" class="tool-btn" id="audioBtn">🎙</button>
   <input id="messageInput" class="message-input" autocomplete="off" placeholder="Message">
   <button class="send-btn" type="submit">↑</button>
 </form>
 </section>`;
 document.getElementById("chatBack").onclick=renderList;
 document.getElementById("photoBtn").onclick=()=>document.getElementById("messageInput").placeholder="Photo selected — type a message";
 document.getElementById("audioBtn").onclick=()=>alert("Audio recording is not connected yet.");
 document.getElementById("composer").onsubmit=e=>{
   e.preventDefault();
   const input=document.getElementById("messageInput");const value=input.value.trim();if(!value)return;
   const bubble=document.createElement("div");bubble.className="bubble me";bubble.textContent=value;
   const time=document.createElement("div");time.className="time me";time.textContent=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
   const scroll=document.getElementById("chatScroll");scroll.append(bubble,time);scroll.scrollTop=scroll.scrollHeight;input.value="";
 };
 const scroll=document.getElementById("chatScroll");scroll.scrollTop=scroll.scrollHeight;
}
function escapeHTML(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderList();
