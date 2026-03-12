/* ==============================
   GATE
   ============================== */
const visitors=['Ravi Kumar · Acme Industries','Priya Sharma · TechCorp','Ankit Patel · BuildMart','Sunita Rao · MedTech','Carlos Silva · EuroChem'];
let activeCountVal=12, todayCountVal=47;
function initEntryLog() {
  const log=document.getElementById('entryLog');
  if(!log) return;
  log.innerHTML='';
  const sample=[
    {name:'Ravi Kumar',meta:'Production Unit · V-2041',time:'10:32 AM',status:'green'},
    {name:'Priya Sharma',meta:'Admin / HR · V-2040',time:'10:28 AM',status:'green'},
    {name:'Unknown (Blacklist)',meta:'Main Gate · V-2039',time:'10:15 AM',status:'red'},
    {name:'Ankit Patel',meta:'Server Room · V-2038',time:'10:02 AM',status:'green'},
    {name:'Carlos Silva',meta:'Warehouse · V-2037',time:'09:54 AM',status:'orange'},
  ];
  sample.forEach(e=>{ log.innerHTML+=createEntryItem(e.name,e.meta,e.time,e.status); });
}
function createEntryItem(name,meta,time,status) {
  return `<div class="entry-item"><div class="entry-status-dot status-${status}"></div><div><div class="entry-name">${name}</div><div class="entry-meta">${meta}</div></div><div class="entry-time">${time}</div></div>`;
}
function simulateGateEntry(type) {
  const statusEl=document.getElementById('gateStatus');
  const textEl=document.getElementById('gateStatusText');
  const subEl=document.getElementById('gateStatusSub');
  const arm=document.getElementById('barrierArm');
  const label=document.getElementById('barrierLabel');
  const visitor=visitors[Math.floor(Math.random()*visitors.length)];
  const now=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  if(type==='granted'){
    statusEl.textContent='✅'; statusEl.className='gate-status granted';
    textEl.textContent='Access Granted'; subEl.textContent=visitor;
    arm.classList.add('open'); label.textContent='● OPEN';
    label.style.color='var(--green)';
    activeCountVal++; document.getElementById('activeCount').textContent=activeCountVal;
    todayCountVal++; document.getElementById('todayCount').textContent=todayCountVal;
    const log=document.getElementById('entryLog');
    if(log) log.insertAdjacentHTML('afterbegin',createEntryItem(visitor.split('·')[0].trim(),'Just entered',now,'green'));
    showToast('Gate opened for '+visitor.split('·')[0],'success');
    setTimeout(()=>{ arm.classList.remove('open'); label.textContent='● CLOSED'; label.style.color=''; resetGate(); },4000);
  } else if(type==='denied'){
    statusEl.textContent='❌'; statusEl.className='gate-status denied';
    textEl.textContent='Access Denied'; subEl.textContent='Verification failed — contact security';
    label.textContent='● LOCKED'; label.style.color='var(--red)';
    const log=document.getElementById('entryLog');
    if(log) log.insertAdjacentHTML('afterbegin',createEntryItem('DENIED — '+visitor.split('·')[0].trim(),'Access refused',now,'red'));
    showToast('Entry denied — mismatch detected','error');
    setTimeout(()=>{ label.textContent='● CLOSED'; label.style.color=''; resetGate(); },3000);
  } else {
    statusEl.textContent='🚶'; textEl.textContent='Exit Recorded'; subEl.textContent=visitor+' has exited';
    if(activeCountVal>0){ activeCountVal--; document.getElementById('activeCount').textContent=activeCountVal; }
    const log=document.getElementById('entryLog');
    if(log) log.insertAdjacentHTML('afterbegin',createEntryItem(visitor.split('·')[0].trim(),'Exited facility',now,'orange'));
    showToast(visitor.split('·')[0]+' exit logged','info');
    setTimeout(resetGate,2500);
  }
}
function resetGate() {
  document.getElementById('gateStatus').textContent='🚪';
  document.getElementById('gateStatus').className='gate-status';
  document.getElementById('gateStatusText').textContent='Ready for Scan';
  document.getElementById('gateStatusSub').textContent='Present your QR code at the scanner below';
}
