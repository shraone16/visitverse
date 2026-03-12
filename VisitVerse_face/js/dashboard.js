/* ==============================
   DASHBOARD
   ============================== */
let chartsInit=false;
function initCharts() {
  if(chartsInit) return;
  chartsInit=true;
  const chartOpts={
    plugins:{legend:{labels:{color:'#8b92a5',font:{family:'JetBrains Mono',size:11}}}},
    scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#4a5168',font:{family:'JetBrains Mono',size:10}}},
            y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#4a5168',font:{family:'JetBrains Mono',size:10}}}}
  };

  const tc=document.getElementById('trafficChart');
  if(tc) new Chart(tc,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Visitors',data:[180,210,195,247,230,145,88],borderColor:'#00d4ff',backgroundColor:'rgba(0,212,255,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#00d4ff',pointRadius:4}]},options:{...chartOpts,plugins:{...chartOpts.plugins}}});

  const dc=document.getElementById('deptChart');
  if(dc) new Chart(dc,{type:'doughnut',data:{labels:['Production','Chemical Lab','Server Room','Warehouse','R&D Lab','Admin'],datasets:[{data:[68,42,31,55,28,23],backgroundColor:['#00d4ff','#ff6b35','#00e676','#f5c518','#a855f7','#3b82f6'],borderColor:'#0a0c0f',borderWidth:3}]},options:{plugins:{legend:{position:'bottom',labels:{color:'#8b92a5',font:{family:'JetBrains Mono',size:10},padding:12}}}}});

  const ac=document.getElementById('assessChart');
  if(ac) new Chart(ac,{type:'bar',data:{labels:['Prod','Chem','Server','WH','R&D','Admin'],datasets:[{label:'Pass',data:[58,35,28,48,24,22],backgroundColor:'rgba(0,230,118,0.7)'},{label:'Fail',data:[10,7,3,7,4,1],backgroundColor:'rgba(255,71,87,0.7)'}]},options:{...chartOpts,plugins:{...chartOpts.plugins}}});

  const pc=document.getElementById('peakChart');
  if(pc) new Chart(pc,{type:'line',data:{labels:['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'],datasets:[{label:'Predicted',data:[12,45,68,62,40,35,48,55,38,15],borderColor:'rgba(0,212,255,0.5)',borderDash:[5,5],tension:0.4,pointRadius:0},{label:'Actual',data:[10,42,71,58,44,32,51,58,40,12],borderColor:'#ff6b35',backgroundColor:'rgba(255,107,53,0.06)',fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:'#ff6b35'}]},options:{...chartOpts,plugins:{...chartOpts.plugins}}});

  const tbody=document.getElementById('visitorTableBody');
  if(tbody) {
    const rows=[
      ['Ravi Kumar','Acme Industries','Production Unit','Priya Sharma','10:32 AM','inside','87%'],
      ['Ankit Patel','TechCorp','Server Room','Amit Singh','10:28 AM','inside','92%'],
      ['Sunita Rao','MedTech','Chemical Lab','Dr. Reddy','10:15 AM','inside','78%'],
      ['Carlos Silva','EuroChem','R&D Lab','Dr. Mehta','09:54 AM','inside','95%'],
      ['Leena Joshi','BuildMart','Warehouse','Rajiv Nair','09:40 AM','exited','81%'],
      ['Vivek Sharma','Infosys','Admin / HR','Neha Kapoor','09:22 AM','exited','88%'],
      ['Unknown V-1995','—','Main Gate','—','09:22 AM','pending','—'],
    ];
    tbody.innerHTML=rows.map(r=>`<tr><td style="color:var(--text);font-weight:500;">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td style="font-family:var(--font-mono);">${r[4]}</td><td><span class="status-badge status-${r[5]}">${r[5].toUpperCase()}</span></td><td style="font-family:var(--font-mono);color:var(--cyan);">${r[6]}</td></tr>`).join('');
  }
}
function filterTable(val) {
  const rows=document.querySelectorAll('#visitorTableBody tr');
  rows.forEach(r=>{ r.style.display=r.textContent.toLowerCase().includes(val.toLowerCase())?'':'none'; });
}
function showAnomaly(el) {
  const text=el.querySelector('.anomaly-text').textContent;
  showToast('Alert reviewed: '+text.substring(0,40)+'...','info');
  el.style.opacity='0.5';
}
function exportReport() {
  showToast('Compliance report exported to PDF','success');
}
