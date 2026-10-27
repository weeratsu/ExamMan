
const DB=window.EXAMS||{};let S=null;const $=i=>document.getElementById(i);
function init(){$('ex').innerHTML=Object.keys(DB).map(k=>`<option>${k}</option>`).join('');$('ex').onchange=fp;fp()}
function fp(){const ps=[...new Set(DB[$('ex').value].map(q=>q.part))];$('pt').innerHTML='<option value="all">ทั้งหมด</option>'+ps.map(p=>`<option value="${p}">Part ${p}</option>`).join('')}
function start(){let L=DB[$('ex').value].filter(q=>$('pt').value=='all'||q.part==$('pt').value);if($('sh').checked)L=[...L].sort(()=>Math.random()-.5);
const ex=$('ex').value,pt=$('pt').value,k=sk(ex,pt),o=(ld().s||{})[k];if(o&&!o.fin&&o.a&&!confirm('มีความคืบหน้าค้างอยู่ ('+o.a+'/'+o.n+') — เริ่มใหม่จะทับของเดิม ตกลงไหม?'))return;
S={ex,pt,L,i:0,md:+$('md').value,sel:L.map(()=>[]),done:L.map(()=>false),fin:false};$('setup').style.display='none';draw()}
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const right=k=>{const q=S.L[k],s=[...S.sel[k]].sort().join();return s==[...q.a].sort().join()};
function pick(l){const k=S.i,q=S.L[k];if(S.done[k])return;let s=S.sel[k];if(q.a.length>1){s.includes(l)?s.splice(s.indexOf(l),1):s.push(l)}else S.sel[k]=s=[l];
if(S.md==1&&s.length==q.a.length)S.done[k]=true;draw()}
function sub(){if(!S.sel[S.i].length)return alert('ยังไม่ได้เลือกคำตอบ');S.done[S.i]=true;draw()}
function finish(){const n=S.sel.filter(s=>!s.length).length;if(n&&!confirm(`ยังไม่ตอบ ${n} ข้อ ส่งเลยไหม?`))return;S.done=S.done.map(()=>true);S.fin=true;draw()}
function go(k){S.i=k;draw()}
function draw(){const k=S.i,q=S.L[k],sh=S.done[k],s=S.sel[k];
let h=`<div class="c nav">${S.L.map((x,j)=>`<span class="${j==k?'cur ':''}${S.done[j]&&(S.md<3||S.fin)?(right(j)?'ok':'ng'):(S.sel[j].length?'an':'')}" onclick="go(${j})">${j+1}</span>`).join('')}</div>`;
if(S.fin||S.done.every(x=>x)&&S.md<3)h+=summary();
h+=`<div class="c"><div>ข้อ ${k+1}/${S.L.length} · Q${q.n} · Part ${q.part}${q.a.length>1?` · <b>เลือก ${q.a.length} ข้อ</b>`:''}</div><p class="q">${esc(q.q)}</p>`;
q.o.forEach(o=>{const l=o[0],c=sh?(q.a.includes(l)?'ok':s.includes(l)?'ng':''):'';h+=`<label class="o ${c}" ${s.includes(l)&&!sh?'style="background:#d6e8fa"':''} onclick="pick('${l}')">${esc(o)}</label>`});
if(sh){h+=`<div class="res" style="color:${right(k)?'#2e9e44':'#d33'}">${right(k)?'✅ ถูกต้อง':'❌ ผิด'} — เฉลย: ${q.a.join(', ')} ${s.length?'| คุณตอบ: '+s.sort().join(', '):'| ไม่ได้ตอบ'}</div>`;if(q.r)h+=`<div class="rm"><b>Remarks:</b>\n${esc(q.r)}</div>`}
h+=`<div><button class="g" onclick="go(${Math.max(0,k-1)})">◀ ก่อนหน้า</button>`;if(S.md==2&&!sh)h+=`<button onclick="sub()">ส่งคำตอบ</button>`;
h+=`<button class="g" onclick="go(${Math.min(S.L.length-1,k+1)})">ถัดไป ▶</button>`;if(S.md==3&&!S.fin)h+=`<button onclick="finish()" style="background:#c50">ส่งทั้งพาร์ท</button>`;
h+=`<button class="g" onclick="home()">🏠 Status / หน้าแรก</button></div></div>`;$('app').innerHTML=bar()+h;save();scrollTo(0,0)}
function summary(){const c=S.L.filter((_,j)=>right(j)).length,n=S.L.length,p=Math.round(c/n*100),w=S.L.map((q,j)=>right(j)?'':`<span onclick="go(${j})" style="cursor:pointer;color:#d33;margin-right:6px">${j+1}</span>`).join('');
return `<div class="c"><h2>สรุปคะแนน: ${c}/${n} (${p}%) ${p>=70?'🎉 ผ่าน':'❌ ยังไม่ผ่าน'}</h2>ถูก ${c} · ผิด/ไม่ตอบ ${n-c}<br>ข้อที่ผิด (คลิกเพื่อดู): ${w||'-'}</div>`}


document.addEventListener('keydown',e=>{if(!S||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
if(e.key==='ArrowLeft'&&S.i>0)go(S.i-1);else if(e.key==='ArrowRight'&&S.i<S.L.length-1)go(S.i+1);});

// ===== Save progress & Status page =====
const KEY='examman_v1',MN={1:'เฉลยทันที',2:'ส่งทีละข้อ',3:'ส่งทั้งพาร์ท'};
const ld=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}};
const sv=d=>localStorage.setItem(KEY,JSON.stringify(d));
const sk=(ex,pt)=>ex+'|'+pt;
function save(){if(!S)return;const d=ld();d.s=d.s||{};const a=S.sel.filter(x=>x.length).length,c=S.L.filter((_,j)=>S.done[j]&&right(j)).length;
d.s[sk(S.ex,S.pt)]={ex:S.ex,pt:S.pt,md:S.md,i:S.i,ids:S.L.map(q=>q.n),sel:S.sel,done:S.done,fin:S.fin,t:Date.now(),a,c,n:S.L.length};
if(S.fin&&!S.logged){S.logged=1;d.h=d.h||[];d.h.unshift({ex:S.ex,pt:S.pt,md:S.md,c:S.L.filter((_,j)=>right(j)).length,n:S.L.length,t:Date.now()});d.h=d.h.slice(0,50);d.s[sk(S.ex,S.pt)].logged=1}
sv(d)}
function resume(k){const r=ld().s[k],m=new Map(DB[r.ex].map(q=>[q.n,q]));S={ex:r.ex,pt:r.pt,md:r.md,i:r.i,L:r.ids.map(n=>m.get(n)),sel:r.sel,done:r.done,fin:r.fin,logged:r.logged};$('setup').style.display='none';draw()}
function restart(k){const r=ld().s[k];$('ex').value=r.ex;fp();$('pt').value=r.pt;$('md').value=r.md;start()}
function del(k){if(!confirm('ลบความคืบหน้านี้?'))return;const d=ld();delete d.s[k];sv(d);home()}
function home(){S=null;$('setup').style.display='';const d=ld(),s=Object.entries(d.s||{}).sort((a,b)=>b[1].t-a[1].t),f=t=>new Date(t).toLocaleString('th-TH');
let h='<div class="c"><h2>📊 Status</h2>';
if(!s.length)h+='ยังไม่มีความคืบหน้าที่บันทึกไว้';
else h+='<table class="st"><tr><th>วิชา/Part</th><th>โหมด</th><th>ความคืบหน้า</th><th>ถูก</th><th>สถานะ</th><th>ล่าสุด</th><th></th></tr>'+s.map(([k,r])=>{const st=r.fin?'✅ ส่งแล้ว':r.a?'⏳ กำลังทำ (ข้อ '+(r.i+1)+')':'🆕 ยังไม่เริ่ม';
const cr=(r.md<3||r.fin)?`${r.c}/${r.n} (${Math.round(r.c/r.n*100)}%)`:'(เฉลยตอนส่ง)';
return `<tr><td>${r.ex} · ${r.pt=='all'?'ทั้งหมด':'Part '+r.pt}</td><td>${MN[r.md]}</td><td><div class="bar"><i style="width:${r.a/r.n*100}%"></i></div>${r.a}/${r.n}</td><td>${cr}</td><td>${st}</td><td>${f(r.t)}</td>
<td><button onclick="resume('${k}')">${r.fin?'ดูผล':'ทำต่อ'}</button><button class="g" onclick="restart('${k}')">เริ่มใหม่</button><button class="g" onclick="del('${k}')">ลบ</button></td></tr>`}).join('')+'</table>';
if((d.h||[]).length)h+='<h3>ประวัติการส่ง</h3><table class="st"><tr><th>วันที่</th><th>วิชา/Part</th><th>โหมด</th><th>คะแนน</th></tr>'+d.h.map(x=>`<tr><td>${f(x.t)}</td><td>${x.ex} · ${x.pt=='all'?'ทั้งหมด':'Part '+x.pt}</td><td>${MN[x.md]}</td><td>${x.c}/${x.n} (${Math.round(x.c/x.n*100)}%) ${x.c/x.n>=.7?'🎉':'❌'}</td></tr>`).join('')+'</table>';
$('app').innerHTML=h+'</div>'}

// ===== In-exam switcher (Part / Mode) =====
function bar(){const ps=[...new Set(DB[S.ex].map(q=>q.part))];
return `<div class="c">${S.ex} · Part: <select onchange="swPart(this.value)"><option value="all"${S.pt=='all'?' selected':''}>ทั้งหมด</option>${ps.map(p=>`<option value="${p}"${p==S.pt?' selected':''}>Part ${p}</option>`).join('')}</select>
โหมด: <select onchange="swMode(+this.value)">${[1,2,3].map(m=>`<option value="${m}"${m==S.md?' selected':''}>${MN[m]}</option>`).join('')}</select></div>`}
function swPart(p){save();const k=sk(S.ex,p);if((ld().s||{})[k])return resume(k);const ex=S.ex,md=S.md;
const L=DB[ex].filter(q=>p=='all'||q.part==p);S={ex,pt:p,L,i:0,md,sel:L.map(()=>[]),done:L.map(()=>false),fin:false};draw()}
function swMode(m){if(S.fin)return alert('ส่งแล้ว เปลี่ยนโหมดไม่ได้ — กดเริ่มใหม่ที่หน้า Status');S.md=m;
if(m==1)S.L.forEach((q,j)=>{if(S.sel[j].length==q.a.length)S.done[j]=true});draw()}
init();home();
