
const DB=window.EXAMS||{};const LK=p=>{const u=((window.EXAM_LINKS||{})[S?S.ex:'']||{})[p];return u?` <a href="${u}" target="_blank" rel="noopener" title="คลิปต้นทาง">▶️ YouTube</a>`:''};let S=null;const $=i=>document.getElementById(i);
function init(){$('ex').innerHTML=Object.keys(DB).map(k=>`<option>${k}</option>`).join('');$('ex').onchange=fp;fp()}
function fp(){const ps=[...new Set(DB[$('ex').value].map(q=>q.part))];$('pt').innerHTML='<option value="all">ทั้งหมด</option>'+ps.map(p=>`<option value="${p}">Part ${p}</option>`).join('')}
function start(){let L=DB[$('ex').value].filter(q=>$('pt').value=='all'||q.part==$('pt').value);if($('sh').checked)L=[...L].sort(()=>Math.random()-.5);
const ex=$('ex').value,pt=$('pt').value,k=sk(ex,pt),o=(ld().s||{})[k];if(o&&!o.fin&&o.a&&!confirm('มีความคืบหน้าค้างอยู่ ('+o.a+'/'+o.n+') — เริ่มใหม่จะทับของเดิม ตกลงไหม?'))return;
S={ex,pt,L,i:0,md:+$('md').value,sel:L.map(()=>[]),done:L.map(()=>false),fin:false};$('setup').style.display='none';draw()}
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const right=k=>eq(k)&&!(S.miss&&S.miss[k]);const eq=k=>{const q=S.L[k],s=[...S.sel[k]].sort().join();return s==[...q.a].sort().join()};
function pick(l){const k=S.i,q=S.L[k];if(S.done[k])return;let s=S.sel[k];if(q.a.length>1){s.includes(l)?s.splice(s.indexOf(l),1):s.push(l)}else S.sel[k]=s=[l];
if(S.md==1&&s.length==q.a.length&&chk(k))S.done[k]=true;draw()}
function sub(){if(!S.sel[S.i].length)return alert('ยังไม่ได้เลือกคำตอบ');if(chk(S.i))S.done[S.i]=true;draw()}
function finish(){const n=S.sel.filter(s=>!s.length).length;if(n&&!confirm(`ยังไม่ตอบ ${n} ข้อ ส่งเลยไหม?`))return;S.done=S.done.map(()=>true);S.fin=true;draw()}
function go(k){if(k!=S.i)S._jump=1;S.i=k;draw()}
function draw(){const k=S.i,q=S.L[k],sh=S.done[k],s=S.sel[k];
let h=`<div class="c nav">${S.L.map((x,j)=>`<span class="${j==k?'cur ':''}${S.done[j]&&(S.md<3||S.fin)?(right(j)?'ok':'ng'):(S.sel[j].length?'an':'')}" onclick="go(${j})">${j+1}</span>`).join('')}</div>`;
if(S.fin||S.done.every(x=>x)&&S.md<3)h+=summary();
h+=`<div class="c" id="qc"><div>ข้อ ${k+1}/${S.L.length} · Q${q.n} · Part ${q.part}${q.a.length>1?` · <b>เลือก ${q.a.length} ข้อ</b>`:''}</div><p class="q">${esc(q.q)}</p>`;
q.o.forEach(o=>{const l=o[0],c=sh?(q.a.includes(l)?'ok':s.includes(l)?'ng':''):'';h+=`<label class="o ${c}" ${s.includes(l)&&!sh?'style="background:#d6e8fa"':''} onclick="pick('${l}')">${esc(o)}</label>`});
if(S.msg){h+=`<div class="res" style="color:#d33">${S.msg}</div>`;S.msg=''}
if(!sh&&S.md<3&&S.miss&&S.miss[k])h+=`<button class="g" onclick="S.done[S.i]=true;draw()">👀 ดูเฉลย</button>`;
if(sh){h+=`<div class="res" style="color:${right(k)?'#2e9e44':'#d33'}">${right(k)?'✅ ถูกต้อง':'❌ ผิด'} — เฉลย: ${q.a.join(', ')} ${s.length?'| คุณตอบ: '+s.sort().join(', '):'| ไม่ได้ตอบ'}</div>`;if(q.r)h+=`<div class="rm"><b>Remarks:</b>\n${esc(q.r)}</div>`}
h+=`<div><button class="g" onclick="go(${Math.max(0,k-1)})">◀ ก่อนหน้า</button>`;if(S.md==2&&!sh)h+=`<button onclick="sub()">ส่งคำตอบ</button>`;
h+=`<button class="g" onclick="nextQ()">ถัดไป ▶</button>`;if(S.md==3&&!S.fin)h+=`<button onclick="finish()" style="background:#c50">ส่งทั้งพาร์ท</button>`;
h+=`<button class="g" onclick="home()">🏠 Status / หน้าแรก</button></div></div>`;$('app').innerHTML=bar()+h;save();if(S._jump){S._jump=0;const e=$('qc');if(e)e.scrollIntoView({block:'start'})}}
function summary(){const c=S.L.filter((_,j)=>right(j)).length,n=S.L.length,p=Math.round(c/n*100),w=S.L.map((q,j)=>right(j)?'':`<span onclick="go(${j})" style="cursor:pointer;color:#d33;margin-right:6px">${j+1}</span>`).join('');
return `<div class="c"><h2>สรุปคะแนน: ${c}/${n} (${p}%) ${p>=70?'🎉 ผ่าน':'❌ ยังไม่ผ่าน'}</h2>ถูก ${c} · ผิด/ไม่ตอบ ${n-c} · ⏱ ${fmt(S.el||0)}<br>ข้อที่ผิด (คลิกเพื่อดู): ${w||'-'}</div>`}


document.addEventListener('keydown',e=>{if(!S||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
if(e.key==='ArrowLeft'&&S.i>0)go(S.i-1);else if(e.key==='ArrowRight')nextQ();});

// ===== Save progress & Status page =====
const KEY='examman_v1',MN={1:'เฉลยทันที',2:'ส่งทีละข้อ',3:'ส่งทั้งพาร์ท'};
const ld=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}};
const sv=d=>localStorage.setItem(KEY,JSON.stringify(d));
const sk=(ex,pt)=>ex+'|'+pt;
function save(){if(!S)return;if(S.md<3&&S.done.length&&S.done.every(x=>x))S.fin=true;const d=ld();d.s=d.s||{};const a=S.sel.filter(x=>x.length).length,c=S.L.filter((_,j)=>S.done[j]&&right(j)).length;
d.s[sk(S.ex,S.pt)]={ex:S.ex,pt:S.pt,md:S.md,i:S.i,ids:S.L.map(q=>q.n),sel:S.sel,done:S.done,fin:S.fin,miss:S.miss||[],el:S.el||0,t:Date.now(),a,c,n:S.L.length};
if(S.fin&&!S.logged){S.logged=1;d.h=d.h||[];d.h.unshift({ex:S.ex,pt:S.pt,md:S.md,c:S.L.filter((_,j)=>right(j)).length,n:S.L.length,el:S.el||0,t:Date.now()});d.h=d.h.slice(0,50);d.s[sk(S.ex,S.pt)].logged=1}
sv(d)}
function resume(k){const r=ld().s[k],m=new Map(DB[r.ex].map(q=>[q.n,q]));S={ex:r.ex,pt:r.pt,md:r.md,i:r.i,L:r.ids.map(n=>m.get(n)),sel:r.sel,done:r.done,fin:r.fin,miss:r.miss||[],el:r.el||0,logged:r.logged};$('setup').style.display='none';draw()}
function restart(k){const r=ld().s[k];$('ex').value=r.ex;fp();$('pt').value=r.pt;$('md').value=r.md;start()}
function del(k){if(!confirm('ลบความคืบหน้านี้?'))return;const d=ld();delete d.s[k];sv(d);home()}
function home(){S=null;$('setup').style.display='';const d=ld(),s=Object.entries(d.s||{}).sort((a,b)=>b[1].t-a[1].t),f=t=>new Date(t).toLocaleString('th-TH');
let h='<div class="c"><h2>📊 Status</h2>';
if(!s.length)h+='ยังไม่มีความคืบหน้าที่บันทึกไว้';
else h+='<table class="st"><tr><th>วิชา/Part</th><th>โหมด</th><th>ความคืบหน้า</th><th>ถูก</th><th>⏱ เวลา</th><th>สถานะ</th><th>ล่าสุด</th><th></th></tr>'+s.map(([k,r])=>{const st=(r.fin||(r.md<3&&r.done&&r.done.every(x=>x)))?'✅ ส่งแล้ว':r.a?'⏳ กำลังทำ (ข้อ '+(r.i+1)+')':'🆕 ยังไม่เริ่ม';
const cr=(r.md<3||r.fin)?`${r.c}/${r.n} (${Math.round(r.c/r.n*100)}%)`:'(เฉลยตอนส่ง)';
return `<tr><td>${r.ex} · ${r.pt=='all'?'ทั้งหมด':'Part '+r.pt}${r.pt!='all'&&((window.EXAM_LINKS||{})[r.ex]||{})[r.pt]?` <a href="${window.EXAM_LINKS[r.ex][r.pt]}" target="_blank" rel="noopener">▶️</a>`:''}</td><td>${MN[r.md]}</td><td><div class="bar"><i style="width:${r.a/r.n*100}%"></i></div>${r.a}/${r.n}</td><td>${cr}</td><td>${fmt(r.el||0)}</td><td>${st}</td><td>${f(r.t)}</td>
<td><button onclick="resume('${k}')">${r.fin?'ดูผล':'ทำต่อ'}</button><button class="g" onclick="restart('${k}')">เริ่มใหม่</button><button class="g" onclick="del('${k}')">ลบ</button></td></tr>`}).join('')+'</table>';
if(s.length){const tt=s.reduce((x,[,r])=>x+(r.el||0),0);h+=`<div style="margin-top:6px"><b>⏱ เวลารวมทุก Part: ${fmt(tt)}</b></div>`}
if((d.h||[]).length)h+='<h3>ประวัติการส่ง</h3><table class="st"><tr><th>วันที่</th><th>วิชา/Part</th><th>โหมด</th><th>คะแนน</th><th>⏱ เวลา</th></tr>'+d.h.map(x=>`<tr><td>${f(x.t)}</td><td>${x.ex} · ${x.pt=='all'?'ทั้งหมด':'Part '+x.pt}</td><td>${MN[x.md]}</td><td>${x.c}/${x.n} (${Math.round(x.c/x.n*100)}%) ${x.c/x.n>=.7?'🎉':'❌'}</td><td>${x.el!=null?fmt(x.el):'-'}</td></tr>`).join('')+'</table>';
$('app').innerHTML=h+`<div style="margin-top:12px"><button onclick="expP()">💾 Export progress</button><label class="g" style="background:#888;color:#fff;padding:8px 12px;border-radius:6px;cursor:pointer;margin:4px">📂 Import progress<input type="file" accept=".json" style="display:none" onchange="impP(this)"></label></div></div>`;lbl()}

// ===== In-exam switcher (Part / Mode) =====
function bar(){const ps=[...new Set(DB[S.ex].map(q=>q.part))];
return `<div class="c">${S.ex} · Part: <select onchange="swPart(this.value)"><option value="all"${S.pt=='all'?' selected':''}>ทั้งหมด</option>${ps.map(p=>`<option value="${p}"${p==S.pt?' selected':''}>Part ${p}</option>`).join('')}</select>
โหมด: <select onchange="swMode(+this.value)">${[1,2,3].map(m=>`<option value="${m}"${m==S.md?' selected':''}>${MN[m]}</option>`).join('')}</select>${S.pt!='all'?LK(S.pt):''}${S.md<3?` <label><input type="checkbox" ${S.retry!==false?'checked':''} onchange="S.retry=this.checked"> ให้เลือกใหม่ได้เมื่อตอบผิด</label>`:''}
 <span style="float:right">⏱ <b id="tm" style="${TS()?'':'display:none'}">${fmt(S.el||0)}</b> <button class="g" style="padding:3px 8px" onclick="tgT()">${TS()?'ซ่อน':'แสดง'}เวลา</button> <button class="g" style="padding:3px 8px" onclick="S.pause=!S.pause;draw()">${S.pause?'▶ ต่อ':'⏸ พัก'}</button></span></div>`}
function swPart(p){save();const k=sk(S.ex,p);if((ld().s||{})[k])return resume(k);const ex=S.ex,md=S.md;
const L=DB[ex].filter(q=>p=='all'||q.part==p);S={ex,pt:p,L,i:0,md,sel:L.map(()=>[]),done:L.map(()=>false),fin:false};draw()}
function swMode(m){if(S.fin)return alert('ส่งแล้ว เปลี่ยนโหมดไม่ได้ — กดเริ่มใหม่ที่หน้า Status');S.md=m;
if(m==1)S.L.forEach((q,j)=>{if(S.sel[j].length==q.a.length)S.done[j]=true});draw()}


// ===== Retry on wrong & Timer =====
function chk(k){if(S.retry===false||S.md==3||eq(k))return true;(S.miss=S.miss||[])[k]=1;S.sel[k]=[];S.msg='❌ ยังไม่ถูก ลองเลือกใหม่ (ข้อนี้จะไม่นับคะแนน)';return false}
const fmt=s=>[Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');
const TS=()=>localStorage.getItem('examman_timer')!=='0';
function tgT(){localStorage.setItem('examman_timer',TS()?'0':'1');draw()}
setInterval(()=>{if(!S||S.fin||S.pause||document.hidden)return;S.el=(S.el||0)+1;const e=$('tm');if(e)e.textContent=fmt(S.el);if(S.el%10==0)save()},1000);


// ===== Export / Import progress =====
function expP(){const d=ld();d._v=1;d._timer=localStorage.getItem('examman_timer');const t=new Date(),p=n=>String(n).padStart(2,'0');
const u=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:'application/json'})),a=document.createElement('a');
a.href=u;a.download=`examman_progress_${t.getFullYear()}${p(t.getMonth()+1)}${p(t.getDate())}_${p(t.getHours())}${p(t.getMinutes())}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function impP(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.s&&!x.h)throw 0;
const rep=confirm('OK = แทนที่ข้อมูลเดิมทั้งหมด\nCancel = รวมกับข้อมูลเดิม (ใช้อันที่ใหม่กว่า)');const d=rep?{s:{},h:[]}:ld();d.s=d.s||{};
for(const[k,v]of Object.entries(x.s||{}))if(!d.s[k]||v.t>=d.s[k].t)d.s[k]=v;
const seen=new Set((d.h||[]).map(h=>h.t+h.ex+h.pt));d.h=[...(d.h||[]),...(x.h||[]).filter(h=>!seen.has(h.t+h.ex+h.pt))].sort((a,b)=>b.t-a.t).slice(0,50);
sv(d);if(x._timer!=null)localStorage.setItem('examman_timer',x._timer);alert('Import เรียบร้อย');home()}catch(e){alert('ไฟล์ไม่ถูกต้อง')}};r.readAsText(f);inp.value=''}


// ===== Auto next part =====
function nextQ(){if(S.i<S.L.length-1)return go(S.i+1);
if(!S.fin){if(S.md==3)alert('ข้อสุดท้ายแล้ว — กด "ส่งทั้งพาร์ท" เพื่อส่ง');return}
if(S.pt=='all')return;const ps=[...new Set(DB[S.ex].map(q=>q.part))],n=ps[ps.indexOf(S.pt)+1];
if(!n)return alert('🎉 ทำครบทุก Part แล้ว');swPart(n);S._jump=1;draw()}


// ===== Mobile table labels =====
function lbl(){document.querySelectorAll('.st').forEach(t=>{const hs=[...t.querySelectorAll('th')].map(x=>x.textContent);t.querySelectorAll('tr').forEach(r=>[...r.children].forEach((c,i)=>{if(c.tagName=='TD')c.setAttribute('data-l',hs[i]||'')}))})}
init();home();
