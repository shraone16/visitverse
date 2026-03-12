/* ==============================
   SAFETY RULES
   ============================== */
const safetyData = {
  production:{name:'Production Unit',icon:'🏭',risk:'high',desc:'Heavy machinery and manufacturing processes. Strict PPE compliance mandatory at all times.',
    rules:['Wear hard hat at all entry points','Steel-toed boots required','High-visibility vest at all times','No loose clothing or jewellery','Eye protection in designated zones','Stay within marked visitor paths','No mobile phones near machinery']},
  chemical:{name:'Chemical Lab',icon:'⚗️',risk:'high',desc:'Hazardous chemicals and reactive substances. Full protective equipment required without exception.',
    rules:['Chemical-resistant gloves required','Safety goggles at all times','Respirator mask in fume areas','No food or drink permitted','Emergency shower locations must be noted','Chemical spill kit locations memorised','MSDS sheets available at entry']},
  server:{name:'Server Room',icon:'🖥️',risk:'medium',desc:'Sensitive IT infrastructure. Static and humidity controls in place. No liquids permitted.',
    rules:['Anti-static wrist strap required','No liquids allowed inside','Temperature-controlled environment','No photography of equipment','Access log mandatory','Two-person access rule applies']},
  warehouse:{name:'Warehouse',icon:'📦',risk:'medium',desc:'Active forklift and heavy goods movement. Maintain awareness at all times.',
    rules:['Hard hat mandatory','Stay in pedestrian walkways','Forklift zones strictly marked','Ear protection in noisy zones','No running at any time','Sign in/out at supervisor desk']},
  rdlab:{name:'R&D Lab',icon:'🔬',risk:'medium',desc:'Experimental materials and precision equipment. Follow researcher guidance at all times.',
    rules:['Lab coat required','Gloves when handling specimens','Closed-toe shoes only','Do not touch equipment without permission','Confidentiality agreement required','Emergency exits noted on entry']},
  admin:{name:'Admin / HR',icon:'🏢',risk:'low',desc:'Standard office environment. Follow general workplace visitor guidelines.',
    rules:['Visitor badge visible at all times','Escorted access only','No access to restricted areas','Sign visitor register on arrival','Mobile phone on silent mode']}
};
function loadSafety(key, el) {
  document.querySelectorAll('.dept-list-item').forEach(d=>d.classList.remove('active'));
  if(el) el.classList.add('active');
  const d = safetyData[key];
  if (!d) return;
  const riskClass = {high:'badge-high',medium:'badge-med',low:'badge-low'}[d.risk];
  const riskLabel = {high:'HIGH RISK',medium:'MEDIUM RISK',low:'LOW RISK'}[d.risk];
  document.getElementById('safetyMain').innerHTML = `
    <div class="safety-header-card">
      <div class="safety-risk-badge ${riskClass}">${riskLabel}</div>
      <div class="safety-dept-title">${d.icon} ${d.name}</div>
      <div class="safety-dept-desc">${d.desc}</div>
    </div>
    <div class="safety-grid">
      <div class="safety-rule-card">
        <div class="rule-card-title">⚠️ Safety Rules</div>
        ${d.rules.map(r=>`<div class="rule-item"><span class="rule-check">✓</span><span>${r}</span></div>`).join('')}
      </div>
      <div class="safety-rule-card">
        <div class="rule-card-title">🦺 Required PPE</div>
        ${key==='production'?`
          <div class="rule-item"><span class="rule-check">✓</span><span>🪖 Hard Hat (EN397)</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🥽 Safety Goggles</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🦺 High-Vis Vest</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>👢 Steel-Toed Boots</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🧤 Work Gloves</span></div>`
        :key==='chemical'?`
          <div class="rule-item"><span class="rule-check">✓</span><span>😷 Respirator Mask</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🥽 Safety Goggles</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🧥 Chemical Lab Coat</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🧤 Chemical-Resistant Gloves</span></div>`
        :`
          <div class="rule-item"><span class="rule-check">✓</span><span>🦺 Visitor Vest</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>🪖 Hard Hat (if required)</span></div>
          <div class="rule-item"><span class="rule-check">✓</span><span>👢 Closed-Toe Shoes</span></div>`}
      </div>
    </div>
    <div style="margin-top:16px;">
      <button class="btn-primary" onclick="navigate('assessment')">Proceed to Assessment →</button>
    </div>
  `;
}
