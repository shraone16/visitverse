/* ==============================
   ASSESSMENT / QUIZ
   ============================== */
const questions = [
  {q:'What is the minimum PPE required when entering the Production Unit?',opts:['Casual clothing is fine','Hard hat, safety goggles, hi-vis vest, and steel-toed boots','Only a visitor badge','Sunglasses and formal wear'],ans:1},
  {q:'What should you do if you discover a chemical spill in the lab?',opts:['Clean it up yourself immediately','Ignore it if it is small','Alert the supervisor immediately and evacuate if needed','Take a photo and report later'],ans:2},
  {q:'In which area is photography strictly prohibited without prior written consent?',opts:['Reception area','Cafeteria','All restricted areas including production, labs, and server rooms','Parking lot'],ans:2},
  {q:'What does the NDA you signed restrict?',opts:['Your ability to use the washroom','Disclosure of confidential information observed during the visit','Access to the cafeteria','Bringing personal items'],ans:1},
  {q:'How should you behave near active forklift zones in the warehouse?',opts:['Run to avoid them quickly','Stay in marked pedestrian walkways and remain alert','Wave to the driver for assistance','Stand still and wait'],ans:1},
  {q:'What is the minimum face match confidence score accepted for gate entry?',opts:['50%','60%','75%','80%'],ans:3},
  {q:'What should you do if your OTP verification fails repeatedly?',opts:['Attempt to bypass the system','Contact the facility security desk for assistance','Use a different phone number','Keep trying indefinitely'],ans:1},
  {q:'Anti-static wrist straps are required when entering which area?',opts:['Chemical Lab','Warehouse','Server Room','Admin / HR'],ans:2},
  {q:'How long does the GDPR-compliant biometric data retention period last after your visit?',opts:['1 year','As per facility data policy, typically 30–90 days','Permanently','Until you request deletion'],ans:1},
  {q:'What is the correct action when you hear an evacuation alarm?',opts:['Continue your meeting until it stops','Immediately proceed to the nearest marked emergency exit','Wait for the host to escort you','Call your office first'],ans:1}
];
let currentQ=0, score=0, quizTimer=null, timeLeft=480, answered=false;

function startQuiz() {
  currentQ=0; score=0; timeLeft=480; answered=false;
  document.getElementById('quizStart').style.display='none';
  document.getElementById('quizBody').style.display='block';
  renderQuestion();
  quizTimer = setInterval(()=>{
    timeLeft--;
    const m=Math.floor(timeLeft/60); const s=timeLeft%60;
    const timerEl=document.getElementById('quizTimer');
    timerEl.textContent='⏱ '+m+':'+(s<10?'0':'')+s;
    timerEl.className='quiz-timer'+(timeLeft<60?' urgent':'');
    if(timeLeft<=0){ clearInterval(quizTimer); showResult(); }
  },1000);
}
function renderQuestion() {
  answered=false;
  const q=questions[currentQ];
  document.getElementById('qNum').textContent=currentQ+1;
  document.getElementById('liveScore').textContent=score;
  document.getElementById('quizProgress').style.width=((currentQ+1)/10*100)+'%';
  document.getElementById('nextBtn').disabled=true;
  document.getElementById('questionCard').innerHTML=`
    <div class="question-card">
      <div class="question-text">Q${currentQ+1}. ${q.q}</div>
      ${q.opts.map((o,i)=>`
        <div class="option" onclick="selectOpt(this,${i})" id="opt-${i}">
          <div class="opt-letter">${'ABCD'[i]}</div>
          <span>${o}</span>
        </div>
      `).join('')}
    </div>
  `;
}
function selectOpt(el,idx) {
  if(answered) return;
  answered=true;
  const correct=questions[currentQ].ans;
  document.querySelectorAll('.option').forEach((o,i)=>{
    o.classList.add(i===correct?'correct':(i===idx&&idx!==correct?'wrong':''));
  });
  if(idx===correct) { score++; showToast('Correct! ✓','success'); }
  else showToast('Incorrect. Answer: '+('ABCD'[correct]),'error');
  document.getElementById('liveScore').textContent=score;
  document.getElementById('nextBtn').disabled=false;
}
function nextQuestion() {
  currentQ++;
  if(currentQ>=10){ clearInterval(quizTimer); showResult(); return; }
  renderQuestion();
}
function showResult() {
  document.getElementById('quizBody').style.display='none';
  const pct=Math.round(score/10*100);
  const pass=pct>=75;
  document.getElementById('quizResult').style.display='block';
  document.getElementById('quizResult').innerHTML=`
    <div class="result-card">
      <div class="result-icon">${pass?'🎉':'😔'}</div>
      <div class="result-title ${pass?'result-pass':'result-fail'}">${pass?'Assessment Passed!':'Assessment Failed'}</div>
      <div class="result-score ${pass?'result-pass':'result-fail'}">${pct}%</div>
      <p style="font-size:14px;color:var(--text2);margin-bottom:28px;">${pass?'Congratulations! You have met the minimum requirement of 75%. Your QR pass is now valid for gate entry.':'You scored below the 75% minimum. Please review the safety induction materials and retake the assessment.'}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        ${pass?`<button class="btn-primary" onclick="navigate('verify')">Proceed to Verification →</button>`:''}
        <button class="btn-secondary" onclick="retakeQuiz()">Retake Assessment</button>
      </div>
    </div>
  `;
}
function retakeQuiz() {
  document.getElementById('quizResult').style.display='none';
  document.getElementById('quizStart').style.display='block';
}
