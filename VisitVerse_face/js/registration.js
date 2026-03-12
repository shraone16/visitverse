/* ==============================
   REGISTRATION
   ============================== */
let selectedDept = null, selectedRisk = null;
let consents = {c1:false,c2:false,c3:false,c4:false};

function regNext(step) {
  if (step === 1) {
    const name = document.getElementById('r-name').value;
    const phone = document.getElementById('r-phone').value;
    const email = document.getElementById('r-email').value;
    const host = document.getElementById('r-host').value;
    const dt = document.getElementById('r-datetime').value;
    const purpose = document.getElementById('r-purpose').value;
    if (!name||!phone||!email||!host||!dt||!purpose) { showToast('Please fill all required fields','error'); return; }
  }
  if (step === 2 && !selectedDept) { showToast('Please select a department','error'); return; }
  document.getElementById('reg-step-'+step).style.display='none';
  document.getElementById('reg-step-'+(step+1)).style.display='block';
  updateStepper(step+1);
}
function regPrev(step) {
  document.getElementById('reg-step-'+step).style.display='none';
  document.getElementById('reg-step-'+(step-1)).style.display='block';
  updateStepper(step-1);
}
function updateStepper(active) {
  for(let i=1;i<=5;i++){
    const c=document.getElementById('sc-'+i);
    const l=document.getElementById('sl-'+i);
    const line=document.getElementById('sline-'+i);
    c.className='step-circle'+(i<active?' done':i===active?' active':'');
    l.className='step-label'+(i===active?' active':'');
    if(line) line.className='step-line'+(i<active?' done':'');
  }
}
function selectDept(el, name, risk) {
  document.querySelectorAll('.dept-card').forEach(d=>d.classList.remove('selected'));
  el.classList.add('selected');
  selectedDept = name; selectedRisk = risk;
  const ppeMap = {
    high: ['🥽 Safety Goggles','🧤 Chemical Gloves','🦺 High-Vis Vest','🪖 Hard Hat','👢 Safety Boots','😷 Respirator Mask'],
    medium: ['🦺 High-Vis Vest','🪖 Hard Hat','👢 Safety Boots','🧤 Work Gloves'],
    low: ['🪪 Visitor Badge','👔 Smart Casual Dress Code']
  };
  const list = ppeMap[risk]||[];
  const ppeList = document.getElementById('ppeList');
  ppeList.innerHTML = list.map(p=>`<div class="ppe-item">${p}</div>`).join('');
  document.getElementById('ppePreview').style.display='block';
}
function fakeUpload(successId) {
  setTimeout(()=>{ document.getElementById(successId).classList.add('show'); showToast('File uploaded successfully','success'); },600);
}
function toggleConsent(id) {
  consents[id] = !consents[id];
  const el = document.getElementById(id);
  el.classList.toggle('on', consents[id]);
}
function regSubmit() {
  const sig = document.getElementById('r-signature').value;
  if (!sig) { showToast('Please provide your digital signature','error'); return; }
  const allConsented = Object.values(consents).every(v=>v);
  if (!allConsented) { showToast('Please agree to all required consents','error'); return; }
  const name = document.getElementById('r-name').value || 'Visitor';
  const company = document.getElementById('r-company').value || 'Unknown Company';
  const host = document.getElementById('r-host').value || 'Unknown Host';
  const dt = document.getElementById('r-datetime').value;
  const visitorId = 'V-' + Math.floor(1000+Math.random()*9000);
  const passId = 'PASS-' + Math.random().toString(36).substr(2,8).toUpperCase();
  document.getElementById('passDetails').innerHTML = `
    <div class="pass-row"><span class="key">Visitor ID</span><span class="val cyan">${visitorId}</span></div>
    <div class="pass-row"><span class="key">Name</span><span class="val">${name}</span></div>
    <div class="pass-row"><span class="key">Company</span><span class="val">${company}</span></div>
    <div class="pass-row"><span class="key">Host</span><span class="val">${host}</span></div>
    <div class="pass-row"><span class="key">Department</span><span class="val">${selectedDept||'N/A'}</span></div>
    <div class="pass-row"><span class="key">Visit Time</span><span class="val">${dt?new Date(dt).toLocaleString():'N/A'}</span></div>
    <div class="pass-row"><span class="key">Pass ID</span><span class="val cyan">${passId}</span></div>
    <div class="pass-row"><span class="key">Status</span><span class="val" style="color:var(--green)">✅ ACTIVE</span></div>
  `;
  document.getElementById('reg-step-4').style.display='none';
  document.getElementById('reg-step-5').style.display='block';
  updateStepper(5);
  showToast('QR Pass generated! Sent via SMS, Email & WhatsApp','success');
}
