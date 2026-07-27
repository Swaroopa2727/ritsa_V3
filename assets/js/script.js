// ---- Rail (icon menu) and the submenu panel are BOTH always visible/sticky
// on desktop — neither collapses. Clicking a rail item just switches which
// menu's submenu content is shown. ----
const rail = document.getElementById('rail');
const appShell = document.querySelector('.app-shell');
const mastersPanel = document.getElementById('mastersPanel');
const backdrop = document.getElementById('backdrop');
const panelTitle = document.getElementById('panelTitle');
const menuLists = document.querySelectorAll('.masters-list[data-menu]');
const railToggleBtn = document.getElementById('railToggleBtn');
const mainWrap = document.querySelector('.main-wrap');
const isMobile = () => window.innerWidth < 992;
const isTablet = () => window.innerWidth < 1200;

let activeMenu = 'Dashboard';   // menu currently highlighted on the rail
let panelCollapsed = false;     // whether the submenu panel is collapsed shut

// Show only the submenu list that matches the active rail menu;
// every other menu's submenu stays hidden.
function showMenuContent(menu){
  menuLists.forEach(ul=>{
    ul.style.display = (ul.dataset.menu === menu) ? '' : 'none';
  });
  panelTitle.textContent = menu;
}

// Reveal the submenu panel for the given menu (used on mobile/tablet to
// slide the panel into view; on desktop the panel is always visible).
function openPanel(menu){
  activeMenu = menu;
  showMenuContent(menu);
  mastersPanel.classList.add('show');
  // Picking a menu always re-expands the submenu if it had been collapsed.
  setPanelCollapsed(false);
  if(isTablet()){
    backdrop.classList.add('show');
  }
}

function closeAll(){
  mastersPanel.classList.remove('show');
  rail.classList.remove('show');
  backdrop.classList.remove('show');
}

// ---- Collapsible submenu (toggled from the rail-brand button) ----
function setPanelCollapsed(collapsed){
  panelCollapsed = collapsed;
  mastersPanel.classList.toggle('collapsed', collapsed);
  if(mainWrap) mainWrap.classList.toggle('panel-collapsed', collapsed);
  if(railToggleBtn){
    railToggleBtn.classList.toggle('is-collapsed', collapsed);
    railToggleBtn.setAttribute('aria-expanded', String(!collapsed));
    railToggleBtn.title = collapsed ? 'Expand submenu' : 'Collapse submenu';
  }
}

if(railToggleBtn){
  railToggleBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    setPanelCollapsed(!panelCollapsed);
  });
}

document.getElementById('mobileToggleBtn').addEventListener('click', ()=>{
  rail.classList.add('show');
  openPanel(activeMenu);
});
document.getElementById('mastersCloseBtn').addEventListener('click', closeAll);
backdrop.addEventListener('click', closeAll);

// ---- Submenu leaf selection (always-visible expanded list, no accordion) ----
// Only one item (across the currently visible submenu) can be active at a time.
document.querySelectorAll('.masters-list .m-row').forEach(row=>{
  row.addEventListener('click', (e)=>{
    e.stopPropagation();
    document.querySelectorAll('.masters-list .m-row.active-sub').forEach(el=>el.classList.remove('active-sub'));
    row.classList.add('active-sub');
  });
});

// ---- Rail (main) menu: clicking any item shows its submenu immediately ----
document.querySelectorAll('.rail-link').forEach(link=>{
  link.addEventListener('click', ()=>{
    const menu = link.dataset.menu;

    document.querySelectorAll('.rail-link').forEach(l=>l.classList.remove('active'));
    link.classList.add('active');

    openPanel(menu);

    if(isMobile()){
      rail.classList.remove('show');
    }
  });
});

// init state on load — the rail stays visible/expanded at all times;
// the submenu panel starts EXPANDED on desktop too (not collapsible).
function initLayout(){
  if(isTablet()){
    rail.classList.remove('show');
    mastersPanel.classList.remove('show');
  } else {
    mastersPanel.classList.add('show');
  }
  showMenuContent(activeMenu);
  backdrop.classList.remove('show');
}
window.addEventListener('resize', initLayout);
initLayout();



// ---- Charts ----
const prodCtx = document.getElementById('prodChart');
new Chart(prodCtx, {
  type: 'bar',
  data: {
    labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
    datasets: [
      { label:'Target', data:[850,1000,800,1100,600], backgroundColor:'#BFDBFE', borderRadius:5, maxBarThickness:26 },
      { label:'Achieved', data:[500,760,630,720,320], backgroundColor:'#2563EB', borderRadius:5, maxBarThickness:26 }
    ]
  },
  options:{
    responsive:true,
    plugins:{ legend:{display:false} },
    scales:{
      y:{ beginAtZero:true, max:1250, ticks:{stepSize:250, color:'#8C99A6', font:{size:11}}, grid:{color:'#EFF2F5'} },
      x:{ grid:{display:false}, ticks:{color:'#8C99A6', font:{size:11}} }
    }
  }
});

const invCtx = document.getElementById('invChart');
new Chart(invCtx, {
  type:'doughnut',
  data:{
    labels:['Raw Materials','Packaging Materials','Finished Goods','Semi Finished','Others'],
    datasets:[{
      data:[35,20,25,10,10],
      backgroundColor:['#2563EB','#1D4ED8','#60A5FA','#93C5FD','#1E3A8A'],
      borderWidth:3,
      borderColor:'#fff'
    }]
  },
  options:{
    responsive:true,
    maintainAspectRatio:true,
    cutout:'68%',
    plugins:{ legend:{display:false}, tooltip:{enabled:true} }
  }
});
