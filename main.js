"""// Quick ranges setup
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const quickRange = document.getElementById('quickRange');
const applyFilter = document.getElementById('applyFilter');
const searchInput = document.getElementById('searchInput');

function formatDateIso(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${da}`;
}

function setRange(type){
  const now = new Date();
  if(type==='today'){
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFrom.value = formatDateIso(start);
    dateTo.value = formatDateIso(end);
  } else if(type==='last7'){
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate()-6);
    dateFrom.value = formatDateIso(start);
    dateTo.value = formatDateIso(end);
  } else if(type==='thisMonth'){
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth()+1, 0);
    dateFrom.value = formatDateIso(start);
    dateTo.value = formatDateIso(end);
  }
}

quickRange.addEventListener('change', (e)=>{
  if(e.target.value !== 'custom') setRange(e.target.value);
});

function applyFilters(){
  const q = searchInput.value.toLowerCase();
  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;

  document.querySelectorAll('#ordersBody tr.row').forEach(row=>{
    const rowDateStr = row.getAttribute('data-date');
    const name = row.children[1].textContent.toLowerCase();
    let show = true;

    if(q && !name.includes(q)) show = false;
    if(rowDateStr && (from || to)){
      const d = new Date(rowDateStr);
      if(from && d < new Date(from.getFullYear(), from.getMonth(), from.getDate())) show = false;
      if(to && d > new Date(to.getFullYear(), to.getMonth(), to.getDate())) show = false;
    }
    row.style.display = show ? '' : 'none';
  });
}

applyFilter.addEventListener('click', applyFilters);
searchInput.addEventListener('input', applyFilters);

// Initialize default quick range
setRange('thisMonth');
applyFilters();

// Quick Lead add logic
const leadName = document.getElementById('leadName');
const leadPhone = document.getElementById('leadPhone');
const leadSource = document.getElementById('leadSource');
const leadNote = document.getElementById('leadNote');
const addLead = document.getElementById('addLead');
const leadsBody = document.getElementById('leadsBody');
const leadsCard = document.getElementById('leadsCard');

addLead.addEventListener('click', ()=>{
  const name = leadName.value.trim();
  const phone = leadPhone.value.trim();
  const source = leadSource.value.trim();
  const note = leadNote.value.trim();
  if(!name || !phone){
    addLead.textContent = 'Name & phone required';
    setTimeout(()=>addLead.textContent='Add Lead', 1300);
    return;
  }
  const tr = document.createElement('tr');
  tr.className = 'row';
  tr.innerHTML = `
    <td class="cell">${name}</td>
    <td class="cell">${phone}</td>
    <td class="cell hide-sm">${source||'-'}</td>
    <td class="cell">${new Date().toLocaleString()}</td>
  `;
  leadsBody.appendChild(tr);
  leadsCard.style.display = '';

  leadName.value='';
  leadPhone.value='';
  leadSource.value='';
  leadNote.value='';
  addLead.textContent = 'Added ✓';
  setTimeout(()=>addLead.textContent='Add Lead', 900);
});

// Export CSV (orders currently visible)
document.getElementById('exportCsv').addEventListener('click', ()=>{
  const visibleRows = [...document.querySelectorAll('#ordersBody tr')]
    .filter(r=>r.style.display!== 'none')
    .map(r=>[...r.querySelectorAll('.cell')].map(td=>`"${td.innerText.replace(/\"/g,'\\\"')}"`).join(','));
  const header = 'id,name,payment,time_remaining,type,status,total';
  const csv = [header, ...visibleRows].join('\\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'orders.csv'; a.click();
  URL.revokeObjectURL(url);
});
"""

# Write files
with open(os.path.join(base, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

with open(os.path.join(base, "style.css"), "w", encoding="utf-8") as f:
    f.write(style_css)

with open(os.path.join(base, "style.js"), "w", encoding="utf-8") as f:
    f.write(script_js)

[os.path.join(base, f) for f in os.listdir(base)]