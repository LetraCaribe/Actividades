// ============================================================
// components.js — Letra Caribe universal components
// ============================================================

// ── LegoCard CSS ───────────────────────────────────────────
(function injectLegoStyles() {
  if (document.getElementById('lego-styles')) return;
  const s = document.createElement('style');
  s.id = 'lego-styles';
  s.textContent = [
    '.lego-card{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--r);background:var(--white);margin-bottom:8px;}.lego-card--clickable{cursor:pointer;transition:border-color 0.15s,box-shadow 0.15s;}.lego-card--clickable:hover{border-color:var(--coral);box-shadow:0 2px 8px rgba(0,0,0,0.08);}',
    '.lego-card--fixed{min-height:72px;}',
    '.lego-card--stack{flex-direction:column;align-items:stretch;gap:10px;}.lego-stack-top{display:flex;align-items:center;gap:12px;}.lego-stack-top .lego-main{flex:1;min-width:0;}.lego-corner{margin-left:auto;flex-shrink:0;}.lego-stack-bottom{display:flex;align-items:center;gap:8px;}.lego-card--stack .lego-actions{margin-left:auto;}',
    '.lego-l1{flex-shrink:0;display:flex;align-items:center;}',
    '.lego-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}',
    '.lego-l2{font-weight:600;font-size:14px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.lego-l3{font-size:12px;color:var(--muted);}',
    '.lego-badges{display:flex;flex-wrap:wrap;gap:4px;}',
    '.lego-badge{font-size:11px;padding:2px 8px;border-radius:99px;background:var(--sand);color:var(--muted);font-weight:500;}.lego-badge--level{background:#E6F1FB;color:#185FA5;}.lego-badge--cat{background:#EEEDFE;color:#534AB7;}',
    '.lego-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:auto;}',
    '.lego-action{display:flex;align-items:center;}',
    '.lego-category{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--white);border:1px solid var(--border);border-radius:var(--r);gap:12px;}.lego-category__info{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;}.lego-category__name{font-size:14px;font-weight:600;color:var(--ink);}.lego-category__meta{display:flex;align-items:center;gap:8px;}.lego-category__count{font-size:12px;color:var(--muted);}.lego-category__actions{display:flex;gap:6px;flex-shrink:0;}'
  ].join('');
  document.head.appendChild(s);
})();

// ── LegoScore ──────────────────────────────────────────────
// Circulo de porcentaje con color segun rango
// LegoScore(85) → elemento DOM

function LegoScore(pct) {
  const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow, #f59e0b)' : 'var(--red)';
  const el = document.createElement('div');
  el.className = 'lego-score';
  el.style.cssText = 'width:40px;height:40px;border-radius:50%;border:3px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:' + color + ';flex-shrink:0';
  el.textContent = pct + '%';
  return el;
}

// ── LegoCard ───────────────────────────────────────────────
// Card universal de 10 slots. Slots vacios colapsan.
//
// Layout:
//   [ L1 ] [ L2 titulo          ] [ L8 ] [ L9 ] [ L10 ]
//          [ L3 subtitulo       ]
//          [ L4 ] [ L5 ] [ L6 ] [ L7 ]
//
// Uso:
//   LegoCard({ L1: iconoEl, L2: 'Titulo', L4: 'B1', L8: btnEl })

function LegoCard(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    const el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  function badgeRow() {
    const keys = ['L4', 'L5', 'L6', 'L7'];
    const active = keys.filter(function(k){ return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
    if (!active.length) return null;
    const row = document.createElement('div');
    row.className = 'lego-badges';
    active.forEach(function(k) { const b = mkSlot(slots[k], 'lego-badge'); if (b) row.appendChild(b); });
    return row;
  }

  function actionRow() {
    const keys = ['L8', 'L9', 'L10'];
    const active = keys.filter(function(k){ return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
    if (!active.length) return null;
    const row = document.createElement('div');
    row.className = 'lego-actions';
    active.forEach(function(k) { const a = mkSlot(slots[k], 'lego-action'); if (a) row.appendChild(a); });
    return row;
  }

  const stack = slots.layout === 'stack';
  const card = document.createElement('div');
  card.className = 'lego-card' + (slots.fixedHeight ? ' lego-card--fixed' : '') + (stack ? ' lego-card--stack' : '');

  if (stack) {
    const top = document.createElement('div');
    top.className = 'lego-stack-top';
    const l1 = mkSlot(slots.L1, 'lego-l1');
    if (l1) top.appendChild(l1);
    const main = document.createElement('div');
    main.className = 'lego-main';
    const l2 = mkSlot(slots.L2, 'lego-l2'); if (l2) main.appendChild(l2);
    const l3 = mkSlot(slots.L3, 'lego-l3'); if (l3) main.appendChild(l3);
    top.appendChild(main);
    const corner = mkSlot(slots.corner, 'lego-corner');
    if (corner) top.appendChild(corner);
    card.appendChild(top);
    const br = badgeRow();
    const ar = actionRow();
    if (br || ar) {
      const bottom = document.createElement('div');
      bottom.className = 'lego-stack-bottom';
      if (br) bottom.appendChild(br);
      if (ar) bottom.appendChild(ar);
      card.appendChild(bottom);
    }
  } else {
    const l1 = mkSlot(slots.L1, 'lego-l1');
    if (l1) card.appendChild(l1);
    const main = document.createElement('div');
    main.className = 'lego-main';
    const l2 = mkSlot(slots.L2, 'lego-l2'); if (l2) main.appendChild(l2);
    const l3 = mkSlot(slots.L3, 'lego-l3'); if (l3) main.appendChild(l3);
    const br = badgeRow(); if (br) main.appendChild(br);
    card.appendChild(main);
    const ar = actionRow(); if (ar) card.appendChild(ar);
  }

  if (slots.onclick) { card.classList.add('lego-card--clickable'); card.onclick = slots.onclick; }
  return card;
}
// -- LegoForm -----------------------------------------------
// Formulario universal de 15 slots. Slots vacios colapsan.
//
// Slots:
//   F1  - titulo    F2  - nivel    F3  - categoria
//   F4 F5 F6        - campos especificos del tipo
//   F7 F8 F9        - campos secundarios
//   F10 F11 F12     - slots reservados
//   F13 F14 F15     - acciones (guardar, previsualizar, cancelar)
//
// Uso:
//   LegoForm({ F1: campoTitulo, F2: campoNivel, F13: btnGuardar })

function LegoForm(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    const el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  const form = document.createElement('div');
  form.className = 'lego-form';

  // Header - F1 F2 F3
  const headerKeys = ['F1', 'F2', 'F3'];
  const activeHeader = headerKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeHeader.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-header';
    activeHeader.forEach(function(k) {
      const f = mkSlot(slots[k], 'lego-form-field lego-form-' + k.toLowerCase());
      if (f) row.appendChild(f);
    });
    form.appendChild(row);
  }

  // Body - F4 through F12
  const bodyKeys = ['F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
  const activeBody = bodyKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeBody.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-body';
    activeBody.forEach(function(k) {
      const f = mkSlot(slots[k], 'lego-form-field lego-form-' + k.toLowerCase());
      if (f) row.appendChild(f);
    });
    form.appendChild(row);
  }

  // Actions - F13 F14 F15
  const actionKeys = ['F13', 'F14', 'F15'];
  const activeActions = actionKeys.filter(function(k) { return slots[k] !== undefined && slots[k] !== null && slots[k] !== ''; });
  if (activeActions.length) {
    const row = document.createElement('div');
    row.className = 'lego-form-actions';
    activeActions.forEach(function(k) {
      const a = mkSlot(slots[k], 'lego-form-action');
      if (a) row.appendChild(a);
    });
    form.appendChild(row);
  }

  return form;
}

// -- LegoForm CSS -------------------------------------------
(function injectLegoFormStyles() {
  if (document.getElementById('lego-form-styles')) return;
  const s = document.createElement('style');
  s.id = 'lego-form-styles';
  s.textContent = [
    '.lego-form{display:flex;flex-direction:column;gap:14px;}',
    '.lego-form-header{display:flex;flex-wrap:wrap;gap:10px;}',
    '.lego-form-body{display:flex;flex-direction:column;gap:12px;}',
    '.lego-form-actions{display:flex;gap:8px;margin-top:4px;}',
    '.lego-form-field{display:flex;flex-direction:column;gap:4px;}',
    '.lego-form-f1{flex:2;min-width:200px;}',
    '.lego-form-f2{flex:1;min-width:100px;}',
    '.lego-form-f3{flex:1;min-width:120px;}',
    '.lego-form-action{display:flex;align-items:center;}'
  ].join('');
  document.head.appendChild(s);
})();
/* LegoHub ------------------------------------------------
   Frame outer: header + breadcrumb + pills + contenido
   Slots: H1 titulo, H2 subtitulo, H3 H4 H5 acciones,
          B1 breadcrumb, pills array, default id
   Retorna elemento DOM con .switchTo(id)
*/
function LegoHub(cfg) {
  cfg = cfg || {};

  function mk(tag, cls, style) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (style) el.style.cssText = style;
    return el;
  }

  function appendSlot(parent, content, cls) {
    if (content === undefined || content === null || content === '') return;
    var wrap = mk('div', cls);
    if (content instanceof HTMLElement) wrap.appendChild(content);
    else wrap.textContent = content;
    parent.appendChild(wrap);
  }

  var hub = mk('div', 'lego-hub');

  var actKeys = ['H3', 'H4', 'H5'];
  var activeActs = actKeys.filter(function(k) { return cfg[k] !== undefined && cfg[k] !== null && cfg[k] !== ''; });
  var actionsInPills = !!cfg.actionsInPills && activeActs.length;
  if (cfg.stickyPills) hub.classList.add('lego-hub--sticky-tools');
  if (activeActs.length && !actionsInPills) {
    var header = mk('div', 'lego-hub-header');
    var acts = mk('div', 'lego-hub-actions');
    activeActs.forEach(function(k) { appendSlot(acts, cfg[k], 'lego-hub-action'); });
    header.appendChild(acts);
    hub.appendChild(header);
  }

  if (cfg.B1 !== undefined && cfg.B1 !== null && cfg.B1 !== '') {
    appendSlot(hub, cfg.B1, 'lego-hub-breadcrumb');
  }

  var pills = cfg.pills || [];
  var activeId = cfg.default || (pills[0] && pills[0].id);

  if (pills.length) {
    var pillRow = mk('div', 'lego-hub-pills' + (cfg.stickyPills ? ' lego-hub-pills--sticky' : ''));
    var contentArea = mk('div', 'lego-hub-content');

    pills.forEach(function(p) {
      var btn = mk('button', 'lego-hub-pill' + (p.id === activeId ? ' active' : ''));
      btn.textContent = p.label;
      btn.type = 'button';
      pillRow.appendChild(btn);

      var panel = mk('div', 'lego-hub-panel');
      panel.style.display = p.id === activeId ? '' : 'none';
      if (p.content instanceof HTMLElement) panel.appendChild(p.content);
      else if (p.content) panel.textContent = p.content;
      contentArea.appendChild(panel);

      btn.addEventListener('click', function() { hub.switchTo(p.id); });
    });

    if (actionsInPills) {
      pillRow.appendChild(mk('div', 'lego-hub-pills-spacer'));
      var pillActs = mk('div', 'lego-hub-actions');
      activeActs.forEach(function(k) { appendSlot(pillActs, cfg[k], 'lego-hub-action'); });
      pillRow.appendChild(pillActs);
    }

    hub.appendChild(pillRow);
    hub.appendChild(contentArea);

    if (activeId) {
      var activePill = pills.find(function(p) { return p.id === activeId; });
      if (activePill && activePill.onShow) activePill.onShow();
    }
  }

  hub.switchTo = function(id) {
    var pr = hub.querySelector('.lego-hub-pills');
    var ca = hub.querySelector('.lego-hub-content');
    if (!pr || !ca) return;
    pills.forEach(function(p, i) {
      var isTarget = p.id === id;
      pr.children[i].classList.toggle('active', isTarget);
      ca.children[i].style.display = isTarget ? '' : 'none';
      if (isTarget && p.onShow) p.onShow();
    });
    activeId = id;
  };

  return hub;
}

/* LegoInnerHub --------------------------------------------
   Hub de tabs interior: tabs + contenido. Sin header ni breadcrumb.
   Slots: tabs array { id, label, content, onShow }, default id
   Retorna elemento DOM con .switchTo(id)
*/
function LegoInnerHub(cfg) {
  cfg = cfg || {};

  var tabs = cfg.tabs || [];
  var activeId = cfg.default || (tabs[0] && tabs[0].id);

  function mk(tag, cls) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  var hub = mk('div', 'lego-inner-hub');
  var tabRow = mk('div', 'lego-inner-tabs');
  var contentArea = mk('div', 'lego-inner-content');

  tabs.forEach(function(t) {
    var btn = mk('button', 'lego-inner-tab' + (t.id === activeId ? ' active' : ''));
    btn.textContent = t.label;
    btn.type = 'button';
    tabRow.appendChild(btn);

    var panel = mk('div', 'lego-inner-panel');
    panel.style.display = t.id === activeId ? '' : 'none';
    if (t.content instanceof HTMLElement) panel.appendChild(t.content);
    else if (t.content) panel.textContent = t.content;
    contentArea.appendChild(panel);

    btn.addEventListener('click', function() { hub.switchTo(t.id); });
  });

  hub.appendChild(tabRow);
  hub.appendChild(contentArea);

  hub.switchTo = function(id) {
    tabs.forEach(function(t, i) {
      var isTarget = t.id === id;
      tabRow.children[i].classList.toggle('active', isTarget);
      contentArea.children[i].style.display = isTarget ? '' : 'none';
      if (isTarget && t.onShow) t.onShow();
    });
    activeId = id;
  };

  if (activeId) {
    var activeTab = tabs.find(function(t) { return t.id === activeId; });
    if (activeTab && activeTab.onShow) activeTab.onShow();
  }

  return hub;
}

/* LegoHub + LegoInnerHub CSS */
(function injectLegoHubStyles() {
  if (document.getElementById('lego-hub-styles')) return;
  var s = document.createElement('style');
  s.id = 'lego-hub-styles';
  s.textContent = [
    '.lego-hub{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r);background:var(--white);overflow:hidden;}',
    '.lego-hub--sticky-tools{overflow:visible;}',
    '.lego-hub-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);}',
    '.lego-hub-header-left{display:flex;flex-direction:column;gap:2px;}',
    '.lego-hub-h1{font-size:15px;font-weight:600;color:var(--ink);}',
    '.lego-hub-h2{font-size:12px;color:var(--muted);}',
    '.lego-hub-actions{display:flex;align-items:center;gap:8px;}',
    '.lego-hub-action{display:flex;align-items:center;}',
    '.lego-hub-breadcrumb{padding:6px 16px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--border);}',
    '.lego-hub-pills{display:flex;align-items:center;gap:4px;padding:8px 16px;border-bottom:1px solid var(--border);background:var(--white);flex-wrap:wrap;}',
    '.lego-hub-pills--sticky{position:sticky;top:0;z-index:30;}',
    '.lego-hub-pills-spacer{flex:1 1 auto;min-width:12px;}',
    '.lego-hub-pills .lego-hub-actions{margin-left:auto;flex-wrap:wrap;justify-content:flex-end;}',
    '.lego-hub-pill{font-size:12px;padding:4px 14px;border-radius:99px;border:1px solid var(--border);background:var(--sand);color:var(--muted);cursor:pointer;font-weight:500;}',
    '.lego-hub-pill.active{background:#185FA5;color:#E6F1FB;border-color:#185FA5;}',
    '.lego-hub-content{flex:1;}',
    '.lego-hub-panel{padding:16px;}',
    '.lego-inner-hub{display:flex;flex-direction:column;}',
    '.lego-inner-tabs{display:flex;gap:3px;padding:8px 12px;border-bottom:1px solid var(--border);flex-wrap:wrap;}',
    '.lego-inner-tab{font-size:12px;padding:3px 12px;border-radius:99px;border:1px solid transparent;background:transparent;color:var(--muted);cursor:pointer;font-weight:500;}',
    '.lego-inner-tab.active{background:var(--white);border-color:var(--border);color:var(--ink);}',
    '.lego-inner-content{flex:1;}',
    '.lego-inner-panel{padding:12px;}.lego-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;}.lego-modal{background:var(--white);border-radius:var(--r);width:90%;max-width:560px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;}.lego-modal-header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border);}.lego-modal-m0{flex-shrink:0;}.lego-modal-m1{flex:1;font-size:16px;font-weight:600;color:var(--ink);text-align:center;}.lego-modal-m6{flex-shrink:0;}.lego-modal-m2{font-size:13px;color:var(--muted);padding:10px 20px;border-bottom:1px solid var(--border);text-align:center;}.lego-modal-m3{padding:20px;}.lego-modal-m4{padding:0 20px 16px;}.lego-modal-actions{display:flex;gap:8px;padding:14px 20px;border-top:1px solid var(--border);}.lego-modal-m5{flex:1;}.lego-modal-m7{flex:1;}.lego-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-top:1px solid var(--border);font-size:12px;color:var(--muted);}.lego-modal-m8,.lego-modal-m9,.lego-modal-m10{}.lego-modal--tall{height:90vh}.lego-modal--tall .lego-modal-m3{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}.lego-modal--wide{max-width:1100px}'
  ].join('');
  document.head.appendChild(s);
})();

function LegoModal(slots) {
  slots = slots || {};

  function mkSlot(content, cls) {
    if (content === undefined || content === null || content === '') return null;
    var el = document.createElement('div');
    el.className = cls;
    if (content instanceof HTMLElement) el.appendChild(content);
    else el.textContent = content;
    return el;
  }

  var overlay = document.createElement('div');
  overlay.className = 'lego-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) LegoModal.close(); };

  var modal = document.createElement('div');
  modal.className = 'lego-modal';

  var header = document.createElement('div');
  header.className = 'lego-modal-header';
  var m0 = mkSlot(slots.M0, 'lego-modal-m0');
  var m1 = mkSlot(slots.M1, 'lego-modal-m1');
  var m6 = mkSlot(slots.M6, 'lego-modal-m6');
  if (m0) header.appendChild(m0);
  if (m1) header.appendChild(m1);
  if (m6) header.appendChild(m6);
  modal.appendChild(header);

  var m2 = mkSlot(slots.M2, 'lego-modal-m2');
  if (m2) modal.appendChild(m2);

  var m3 = mkSlot(slots.M3, 'lego-modal-m3');
  if (m3) modal.appendChild(m3);

  var m4 = mkSlot(slots.M4, 'lego-modal-m4');
  if (m4) modal.appendChild(m4);

  var actions = document.createElement('div');
  actions.className = 'lego-modal-actions';
  var m5 = mkSlot(slots.M5, 'lego-modal-m5');
  var m7 = mkSlot(slots.M7, 'lego-modal-m7');
  if (m5) actions.appendChild(m5);
  if (m7) actions.appendChild(m7);
  if (actions.children.length) modal.appendChild(actions);

  var footer = document.createElement('div');
  footer.className = 'lego-modal-footer';
  var m8  = mkSlot(slots.M8,  'lego-modal-m8');
  var m9  = mkSlot(slots.M9,  'lego-modal-m9');
  var m10 = mkSlot(slots.M10, 'lego-modal-m10');
  if (m8)  footer.appendChild(m8);
  if (m10) footer.appendChild(m10);
  if (m9)  footer.appendChild(m9);
  if (footer.children.length) modal.appendChild(footer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  if (!LegoModal._stack) LegoModal._stack = [];
  LegoModal._stack.push(overlay);

  LegoModal.close = function() {
    var ov = (LegoModal._stack && LegoModal._stack.length) ? LegoModal._stack.pop() : overlay;
    if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
  };

  return overlay;
}
function LegoCategory(cat, opts) {
  if (!opts) opts = {};
  var card = document.createElement('div');
  card.className = 'lego-category';
  var actCount = opts.actCount || 0;
  var statusBg = cat.active ? '#E6F4EA' : '#F5F5F5';
  var statusColor = cat.active ? '#2E7D32' : '#888';
  var statusLabel = cat.active ? 'Activa' : 'Inactiva';
  var actLabel = actCount + (actCount !== 1 ? ' actividades' : ' actividad');
  var info = document.createElement('div');
  info.className = 'lego-category__info';
  var nameDiv = document.createElement('div');
  nameDiv.className = 'lego-category__name';
  nameDiv.textContent = cat.name;
  var badge = LegoChip(statusLabel, { bg: statusBg, color: statusColor });
  var count = document.createElement('span');
  count.className = 'lego-category__count';
  count.textContent = actLabel;
  var meta = document.createElement('div');
  meta.className = 'lego-category__meta';
  meta.append(badge, count);
  info.append(nameDiv, meta);
  var actions = document.createElement('div');
  actions.className = 'lego-category__actions';
  if (opts.onEdit) {
    var btnEdit = document.createElement('button');
    btnEdit.className = 'btn btn-sm';
    btnEdit.textContent = 'Editar';
    btnEdit.onclick = opts.onEdit;
    actions.appendChild(btnEdit);
  }
  if (opts.onToggle) {
    var btnToggle = document.createElement('button');
    btnToggle.className = 'btn btn-sm';
    btnToggle.textContent = cat.active ? 'Desactivar' : 'Activar';
    btnToggle.onclick = opts.onToggle;
    actions.appendChild(btnToggle);
  }
  if (opts.onDelete) {
    var btnDel = document.createElement('button');
    btnDel.className = 'btn btn-sm';
    btnDel.style.color = 'var(--danger)';
    btnDel.textContent = 'Eliminar';
    btnDel.onclick = opts.onDelete;
    actions.appendChild(btnDel);
  }
  card.appendChild(info);
  card.appendChild(actions);
  return card;
}
// -- LegoChip ----------------------------------------------
// Pildora de texto sellada: badge (nivel/categoria/estado) o chip removible.
//   LegoChip('A1', 'level')                                       badge de nivel
//   LegoChip('Verbos', 'cat')                                     badge de categoria
//   LegoChip('Completada', { bg: '#E6F4EA', color: '#2E7D32' })   estado con color
//   LegoChip('Mate', { onRemove: fn })                            chip removible con x
function LegoChip(text, opts) {
  opts = opts || {};
  if (typeof opts === 'string') opts = { variant: opts };
  if (!document.getElementById('lego-chip-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-chip-styles';
    st.textContent = '.lego-chip--removable{display:inline-flex;align-items:center;gap:4px;}.lego-chip__x{border:none;background:none;cursor:pointer;font-size:13px;line-height:1;color:inherit;opacity:.6;padding:0;font-family:inherit;}.lego-chip__x:hover{opacity:1;}';
    document.head.appendChild(st);
  }
  var chip = document.createElement('span');
  chip.className = 'lego-badge' + (opts.variant ? ' lego-badge--' + opts.variant : '');
  if (opts.bg) chip.style.background = opts.bg;
  if (opts.color) chip.style.color = opts.color;
  chip.textContent = text;
  if (opts.onRemove) {
    chip.classList.add('lego-chip--removable');
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'lego-chip__x';
    x.textContent = '×';
    x.setAttribute('aria-label', 'Quitar');
    x.onclick = function(e) { e.stopPropagation(); opts.onRemove(); };
    chip.appendChild(x);
  }
  return chip;
}

// -- LegoLibraryMaterial ------------------------------------
// Card sellada para materiales de biblioteca. Reusa LegoCard + LegoChip.
//   LegoLibraryMaterial(item, { grammarName:'Ser/estar', onRead:fn, onEdit:fn, onDelete:fn })
function LegoLibraryMaterial(item, opts) {
  item = item || {};
  opts = opts || {};

  var grammarName = opts.grammarName || '';
  if (!grammarName && item.grammar_categories && item.grammar_categories.name) {
    grammarName = item.grammar_categories.name;
  }

  function action(label, fn, danger) {
    if (typeof fn !== 'function') return '';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm';
    btn.textContent = label;
    if (danger) btn.style.color = 'var(--red)';
    btn.onclick = function() { fn(item); };
    return btn;
  }

  return LegoCard({
    L2: item.title || 'Material sin titulo',
    L3: item.description || '',
    L4: LegoChip(item.level || 'A1', 'level'),
    L5: grammarName ? LegoChip(grammarName, 'cat') : '',
    L8: action('Leer', opts.onRead, false),
    L9: action('Editar', opts.onEdit, false),
    L10: action('Eliminar', opts.onDelete, true)
  });
}


// -- LegoPdfViewer ------------------------------------------
// Visor especializado para PDFs de Google Drive dentro de Biblioteca.
//   LegoPdfViewer({ title, driveUrl, previewUrl }) -> nodo DOM
function LegoPdfViewer(section, opts) {
  section = section || {};
  opts = opts || {};

  if (!document.getElementById('lego-pdf-viewer-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-pdf-viewer-styles';
    st.textContent = '.lego-pdf-reader{position:fixed;inset:0;z-index:2000;background:#1C1A17;display:flex;flex-direction:column}.lego-pdf-reader__bar{height:58px;display:flex;align-items:center;gap:10px;padding:0 18px;background:var(--white);border-bottom:1px solid var(--border);flex-shrink:0}.lego-pdf-reader__title{font-size:16px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lego-pdf-reader__spacer{flex:1}.lego-pdf-reader__frame{width:100%;height:calc(100vh - 58px);border:0;background:#1C1A17;display:block}.lego-pdf-inline{display:flex;flex-direction:column;gap:10px;min-height:0;flex:1}.lego-pdf-inline__frame{width:100%;flex:1;min-height:520px;border:1px solid var(--border);border-radius:var(--r);background:var(--sand)}.lego-pdf-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.lego-pdf-hint{font-size:12px;color:var(--muted);margin-left:auto}@media(max-width:720px){.lego-pdf-reader__bar{height:54px;padding:0 10px}.lego-pdf-reader__title{font-size:14px}.lego-pdf-reader__frame{height:calc(100vh - 54px)}.lego-pdf-hint{display:none}}';
    document.head.appendChild(st);
  }

  var previewUrl = section.previewUrl || '';
  var driveUrl = section.driveUrl || previewUrl;

  function addActions(parent) {
    var actions = document.createElement('div');
    actions.className = 'lego-pdf-actions';
    if (driveUrl) {
      var openBtn = document.createElement('a');
      openBtn.className = 'btn btn-coral';
      openBtn.href = driveUrl;
      openBtn.target = '_blank';
      openBtn.rel = 'noopener';
      openBtn.textContent = 'Abrir en Drive';
      actions.appendChild(openBtn);
    }
    if (previewUrl) {
      var previewBtn = document.createElement('a');
      previewBtn.className = 'btn';
      previewBtn.href = previewUrl;
      previewBtn.target = '_blank';
      previewBtn.rel = 'noopener';
      previewBtn.textContent = 'Abrir preview';
      actions.appendChild(previewBtn);
    }
    parent.appendChild(actions);
  }

  if (opts.fullscreen) {
    var reader = document.createElement('div');
    reader.className = 'lego-pdf-reader';

    var bar = document.createElement('div');
    bar.className = 'lego-pdf-reader__bar';

    var title = document.createElement('div');
    title.className = 'lego-pdf-reader__title';
    title.textContent = opts.title || section.title || 'PDF';
    bar.appendChild(title);

    var spacer = document.createElement('div');
    spacer.className = 'lego-pdf-reader__spacer';
    bar.appendChild(spacer);

    if (driveUrl) {
      var driveBtn = document.createElement('a');
      driveBtn.className = 'btn btn-sm';
      driveBtn.href = driveUrl;
      driveBtn.target = '_blank';
      driveBtn.rel = 'noopener';
      driveBtn.textContent = 'Drive';
      bar.appendChild(driveBtn);
    }

    var closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-sm';
    closeBtn.type = 'button';
    closeBtn.textContent = 'Cerrar';
    closeBtn.onclick = function() { if (reader.parentNode) reader.parentNode.removeChild(reader); };
    bar.appendChild(closeBtn);
    reader.appendChild(bar);

    if (previewUrl) {
      var fullFrame = document.createElement('iframe');
      fullFrame.className = 'lego-pdf-reader__frame';
      fullFrame.src = previewUrl;
      fullFrame.title = section.title || 'PDF de Google Drive';
      fullFrame.loading = 'lazy';
      fullFrame.allow = 'autoplay';
      reader.appendChild(fullFrame);
    } else {
      reader.appendChild(LegoEmpty({ text: 'Este PDF no tiene enlace de preview.' }));
    }

    document.body.appendChild(reader);
    return reader;
  }

  var wrap = document.createElement('div');
  wrap.className = 'lego-pdf-inline';

  if (previewUrl) {
    var frame = document.createElement('iframe');
    frame.className = 'lego-pdf-inline__frame';
    frame.src = previewUrl;
    frame.title = section.title || 'PDF de Google Drive';
    frame.loading = 'lazy';
    frame.allow = 'autoplay';
    wrap.appendChild(frame);
  } else {
    wrap.appendChild(LegoEmpty({ text: 'Este PDF no tiene enlace de preview.' }));
  }

  addActions(wrap);
  var hint = document.createElement('span');
  hint.className = 'lego-pdf-hint';
  hint.textContent = 'Si no carga, revisa que Drive permita ver con el enlace.';
  wrap.lastChild.appendChild(hint);
  return wrap;
}


// -- LegoLibraryViewer --------------------------------------
// Visor de un material de biblioteca dentro de un LegoModal. Sellado con textContent.
// Reusado en index (estudiante lee) y admin (preview del profesor).
//   LegoLibraryViewer(item)  // item: { title, level, content:{sections:[]}, grammar_categories:{name} | grammarName }
function _llpImgSrc(url) {
  url = (url || '').trim();
  var m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (m && m[1]) return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1200';
  return url;
}

function LegoLibraryViewer(item) {
  item = item || {};
  var content = item.content || {};
  var sections = (content && content.sections) || [];
  var hasPdfDrive = sections.some(function(section) { return section && section.type === 'pdf-drive'; });
  if (hasPdfDrive) {
    var pdfSection = sections.find(function(section) { return section && section.type === 'pdf-drive'; });
    return LegoPdfViewer(pdfSection, { fullscreen: true, title: item.title || (pdfSection && pdfSection.title) || 'PDF' });
  }

  if (!document.getElementById('lego-libpage-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-libpage-styles';
    st.textContent = [
      '.lego-libpage{font-family:Arial,Helvetica,sans-serif;color:#1C1A17;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-hero{background:linear-gradient(135deg,#D4522A,#A83E1E 60%,#B54D07);padding:24px 28px;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-kick{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;opacity:.9}',
      '.llp-title{font-family:Georgia,"Times New Roman",serif;font-size:36px;line-height:1.05;margin:6px 0 8px}',
      '.llp-sub{font-size:13.5px;line-height:1.5;opacity:.93;max-width:560px;margin:0}',
      '.llp-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}',
      '.llp-chip{background:rgba(255,255,255,.92);color:#A83E1E;border-radius:999px;font-size:11px;font-weight:800;padding:5px 11px}',
      '.llp-body{padding:22px 28px 26px}',
      '.llp-secs{display:flex;flex-wrap:wrap;gap:2px 14px;align-items:flex-start}.llp-sec-full{flex:1 1 100%;min-width:0}.llp-sec-half{flex:1 1 calc(50% - 7px);min-width:0}@media(max-width:640px){.llp-sec-half{flex:1 1 100%}}',
      '.llp-h{font-family:Georgia,"Times New Roman",serif;font-size:18px;color:#1C1A17;margin:18px 0 8px}',
      '.llp-body>.llp-h:first-child{margin-top:0}',
      '.llp-p{font-size:14px;line-height:1.65;color:#4A4540;margin:0 0 12px;white-space:pre-wrap;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;border-radius:12px;padding:12px 14px;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-ex{font-size:14px;line-height:1.6;color:#4A4540;font-style:italic;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;border-radius:12px;padding:12px 14px;margin:0 0 12px;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13.5px;margin:0 0 12px}',
      '.llp-table td{padding:9px 12px;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid #E0DAD2;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-table tr:first-child td{background:#A83E1E;color:#fff;font-weight:700}',
      '.llp-table tr:not(:first-child) td.llp-c0{background:linear-gradient(180deg,#fff,#E4F5E8)}.llp-table tr:not(:first-child) td.llp-c1{background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-table tr:not(:first-child) td.llp-c2{background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-table tr:not(:first-child) td.llp-c3{background:linear-gradient(180deg,#fff,#E6F5FB)}.llp-table tr:not(:first-child) td.llp-c4{background:linear-gradient(180deg,#fff,#FBE8FA)}',
      '.llp-tbl-rayada tr:not(:first-child):nth-child(odd) td{background:#fff}.llp-tbl-rayada tr:not(:first-child):nth-child(even) td{background:#F5F0E8}',
      '.llp-conj{display:flex;flex-direction:column;gap:8px;margin:0 0 14px}.llp-conj-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.llp-conj-p{border-radius:11px;padding:9px 12px;text-align:center;font-weight:700;font-size:14px;background:linear-gradient(180deg,#fff,#E4F5E8);border:1px solid #E0DAD2;box-shadow:0 6px 14px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-conj-f{border-radius:11px;padding:9px 12px;text-align:center;font-weight:800;font-size:15px;color:#C41E1E;background:linear-gradient(180deg,#fff,#FDF0E4);border:1px solid #E0DAD2;box-shadow:0 6px 14px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}',
      '.llp-vcards{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:0 0 14px}.llp-vcard{border-radius:16px;padding:14px;text-align:center;border:2px solid #E0DAD2;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-vc0{border-color:#E8670A;background:linear-gradient(180deg,#fff,#FDF0E4)}.llp-vc1{border-color:#1E6B72;background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-vc2{border-color:#7AB010;background:linear-gradient(180deg,#fff,#F0F7DC)}.llp-vc3{border-color:#C49A2A;background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-vcard-name{font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:.02em;color:#1C1A17;margin-bottom:6px}.llp-vcard-ex{font-size:13px;color:#4A4540;line-height:1.35}',
      '.llp-formula{background:linear-gradient(180deg,#fff,#FBE8FA);border:2px solid #EFA7E9;border-radius:16px;padding:14px 16px;text-align:center;font-size:18px;font-weight:800;line-height:1.4;color:#1C1A17;box-shadow:0 8px 18px rgba(28,26,23,.05);margin:0 0 10px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-formula .hi{color:#C41E1E}.llp-tokens{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:0 0 14px}.llp-token{border-radius:10px;padding:6px 11px;font-size:13px;font-weight:800;-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-tk0{background:linear-gradient(180deg,#fff,#FEECEC);color:#C41E1E;border:1px solid rgba(196,30,30,.18)}.llp-tk1{background:linear-gradient(180deg,#fff,#F8EBC5);color:#854F0B;border:1px solid rgba(196,154,42,.22)}.llp-tk2{background:linear-gradient(180deg,#fff,#E6F5FB);color:#185FA5;border:1px solid rgba(145,211,240,.45)}.llp-tk3{background:linear-gradient(180deg,#fff,#E4F5E8);color:#1A7A2A;border:1px solid rgba(26,122,42,.2)}.llp-tk4{background:linear-gradient(180deg,#fff,#E4F2F4);color:#0F6E56;border:1px solid rgba(30,107,114,.2)}',
      '.llp-excards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin:0 0 14px}.llp-excard{border:2px solid #E0DAD2;border-radius:14px;overflow:hidden;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-excard-h{padding:11px 14px;font-family:Georgia,"Times New Roman",serif;font-size:15px;font-weight:700;border-bottom:1px solid rgba(28,26,23,.08);color:#1C1A17}.llp-exc0{border-color:#E8670A;background:linear-gradient(180deg,#fff,#FDF0E4)}.llp-exc1{border-color:#1E6B72;background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-exc2{border-color:#7AB010;background:linear-gradient(180deg,#fff,#F0F7DC)}.llp-exc3{border-color:#C49A2A;background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-excard-list{margin:0;padding:12px 14px 14px 30px}.llp-excard-list li{font-size:13px;line-height:1.45;color:#4A4540;margin:0 0 8px}.llp-excard-list li:last-child{margin-bottom:0}',
      '.llp-doctor{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 14px}.llp-dbox{border-radius:14px;padding:12px 14px;border:2px solid #E0DAD2;box-shadow:0 8px 18px rgba(28,26,23,.05);-webkit-print-color-adjust:exact;print-color-adjust:exact}.llp-db0{border-color:#E8670A;background:linear-gradient(180deg,#fff,#FDF0E4)}.llp-db1{border-color:#1E6B72;background:linear-gradient(180deg,#fff,#E4F2F4)}.llp-db2{border-color:#7AB010;background:linear-gradient(180deg,#fff,#F0F7DC)}.llp-db3{border-color:#C49A2A;background:linear-gradient(180deg,#fff,#F8EBC5)}.llp-db-letter{font-family:Georgia,"Times New Roman",serif;font-size:28px;font-weight:700;color:#1C1A17;line-height:1}.llp-db-word{font-size:13px;font-weight:700;color:#1C1A17;margin:4px 0 6px}.llp-db-ex{font-size:12px;color:#4A4540;line-height:1.35}',
      '.llp-table td:first-child{border-radius:10px 0 0 10px}',
      '.llp-table td:last-child{border-radius:0 10px 10px 0}',
      '.llp-img{max-width:100%;border-radius:12px;margin:6px 0;display:block}',
      '.llp-cap{font-size:12px;color:#8C8479;text-align:center;margin:0 0 12px}',
      '.llp-foot{display:flex;justify-content:space-between;color:#8C8479;font-size:11px;border-top:1px solid #E0DAD2;padding-top:14px;margin-top:20px}',
      '.llp-foot b{color:#A83E1E}',
      '@media print{body.printing-lib>*:not(.lego-modal-overlay){display:none!important}body.printing-lib .lego-modal-overlay{position:static!important;background:#fff!important;padding:0!important;display:block!important}body.printing-lib .lego-modal{box-shadow:none!important;max-width:none!important;width:100%!important;max-height:none!important;border:0!important;border-radius:0!important}body.printing-lib .lego-modal-header,body.printing-lib .lego-modal-actions{display:none!important}body.printing-lib .lego-modal-m3{padding:0!important;overflow:visible!important}@page{size:letter;margin:0.4in}}'
    ].join('');
    document.head.appendChild(st);
  }

  var page = document.createElement('div');
  page.className = 'lego-libpage';

  // hero
  var hero = document.createElement('div');
  hero.className = 'llp-hero';
  var kick = document.createElement('div');
  kick.className = 'llp-kick';
  kick.textContent = 'Letra Caribe Language School';
  hero.appendChild(kick);
  var title = document.createElement('div');
  title.className = 'llp-title';
  title.textContent = item.title || 'Material';
  hero.appendChild(title);
  if (item.description) {
    var sub = document.createElement('div');
    sub.className = 'llp-sub';
    sub.textContent = item.description;
    hero.appendChild(sub);
  }
  var chips = document.createElement('div');
  chips.className = 'llp-chips';
  var lvlChip = document.createElement('span');
  lvlChip.className = 'llp-chip';
  lvlChip.textContent = item.level || 'A1';
  chips.appendChild(lvlChip);
  var gramName = (item.grammar_categories && item.grammar_categories.name) || item.grammarName || '';
  if (gramName) {
    var catChip = document.createElement('span');
    catChip.className = 'llp-chip';
    catChip.textContent = gramName;
    chips.appendChild(catChip);
  }
  hero.appendChild(chips);
  page.appendChild(hero);

  // body
  var body = document.createElement('div');
  body.className = 'llp-body';
  var secsBox = document.createElement('div');
  secsBox.className = 'llp-secs';

  function heading(txt) {
    var h = document.createElement('div');
    h.className = 'llp-h';
    h.textContent = txt;
    return h;
  }

  if (!sections.length) {
    body.appendChild(LegoEmpty({ text: 'Este material no tiene contenido todavia.' }));
  }

  sections.forEach(function(section) {
    var secEl = document.createElement('div');
    secEl.className = 'llp-sec ' + (section.col === 'half' ? 'llp-sec-half' : 'llp-sec-full');
    var body = secEl;
    if (section.type === 'text') {
      if (section.title) body.appendChild(heading(section.title));
      var p = document.createElement('p');
      p.className = 'llp-p';
      p.textContent = section.body || '';
      body.appendChild(p);
    } else if (section.type === 'table') {
      if (section.title) body.appendChild(heading(section.title));
      var table = document.createElement('table');
      var tblModel = section.model || 'colorida';
      table.className = 'llp-table llp-tbl-' + tblModel;
      (section.rows || []).forEach(function(rowArr, rIdx) {
        var tr = document.createElement('tr');
        (Array.isArray(rowArr) ? rowArr : Object.values(rowArr || {})).forEach(function(val, cIdx) {
          var td = document.createElement('td');
          td.textContent = (val === null || val === undefined) ? '' : val;
          if (rIdx > 0 && tblModel === 'colorida') td.className = 'llp-c' + (cIdx % 5);
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      body.appendChild(table);
    } else if (section.type === 'exercise') {
      if (section.title) body.appendChild(heading(section.title));
      var ex = document.createElement('p');
      ex.className = 'llp-ex';
      ex.textContent = section.text || '';
      body.appendChild(ex);
    } else if (section.type === 'conjugation') {
      if (section.title) body.appendChild(heading(section.title));
      var cj = document.createElement('div');
      cj.className = 'llp-conj';
      (section.rows || []).forEach(function(pair) {
        var cr = document.createElement('div');
        cr.className = 'llp-conj-row';
        var cp = document.createElement('div');
        cp.className = 'llp-conj-p';
        cp.textContent = (pair && pair[0]) || '';
        var cf = document.createElement('div');
        cf.className = 'llp-conj-f';
        cf.textContent = (pair && pair[1]) || '';
        cr.appendChild(cp); cr.appendChild(cf);
        cj.appendChild(cr);
      });
      body.appendChild(cj);
    } else if (section.type === 'verb-cards') {
      if (section.title) body.appendChild(heading(section.title));
      var vc = document.createElement('div');
      vc.className = 'llp-vcards';
      (section.rows || []).forEach(function(pair, i) {
        var card = document.createElement('div');
        card.className = 'llp-vcard llp-vc' + (i % 4);
        var nm = document.createElement('div');
        nm.className = 'llp-vcard-name';
        nm.textContent = (pair && pair[0]) || '';
        var ex = document.createElement('div');
        ex.className = 'llp-vcard-ex';
        ex.textContent = (pair && pair[1]) || '';
        card.appendChild(nm); card.appendChild(ex);
        vc.appendChild(card);
      });
      body.appendChild(vc);
    } else if (section.type === 'formula') {
      if (section.title) body.appendChild(heading(section.title));
      if (section.formula) {
        var fb = document.createElement('div');
        fb.className = 'llp-formula';
        String(section.formula).split('*').forEach(function(seg, i) {
          if (seg === '') return;
          if (i % 2 === 1) {
            var hi = document.createElement('span');
            hi.className = 'hi';
            hi.textContent = seg;
            fb.appendChild(hi);
          } else {
            fb.appendChild(document.createTextNode(seg));
          }
        });
        body.appendChild(fb);
      }
      if (section.tokens && section.tokens.length) {
        var tkRow = document.createElement('div');
        tkRow.className = 'llp-tokens';
        section.tokens.forEach(function(tk, i) {
          if (!tk) return;
          var sp = document.createElement('span');
          sp.className = 'llp-token llp-tk' + (i % 5);
          sp.textContent = tk;
          tkRow.appendChild(sp);
        });
        body.appendChild(tkRow);
      }
    } else if (section.type === 'examples') {
      if (section.title) body.appendChild(heading(section.title));
      var eg = document.createElement('div');
      eg.className = 'llp-excards';
      (section.cards || []).forEach(function(card, ci) {
        var c = document.createElement('div');
        c.className = 'llp-excard llp-exc' + (ci % 4);
        var h = document.createElement('div');
        h.className = 'llp-excard-h';
        h.textContent = (card && card.heading) || '';
        c.appendChild(h);
        var ol = document.createElement('ol');
        ol.className = 'llp-excard-list';
        ((card && card.items) || []).forEach(function(it) {
          if (it === '' || it == null) return;
          var li = document.createElement('li');
          li.textContent = it;
          ol.appendChild(li);
        });
        c.appendChild(ol);
        eg.appendChild(c);
      });
      body.appendChild(eg);
    } else if (section.type === 'doctor') {
      if (section.title) body.appendChild(heading(section.title));
      var dg = document.createElement('div');
      dg.className = 'llp-doctor';
      (section.rows || []).forEach(function(row, i) {
        var b = document.createElement('div');
        b.className = 'llp-dbox llp-db' + (i % 4);
        var l = document.createElement('div');
        l.className = 'llp-db-letter';
        l.textContent = (row && row[0]) || '';
        b.appendChild(l);
        if (row && row[1]) {
          var w = document.createElement('div');
          w.className = 'llp-db-word';
          w.textContent = row[1];
          b.appendChild(w);
        }
        if (row && row[2]) {
          var e = document.createElement('div');
          e.className = 'llp-db-ex';
          e.textContent = row[2];
          b.appendChild(e);
        }
        dg.appendChild(b);
      });
      body.appendChild(dg);
    } else if (section.type === 'image') {
      if (section.url) {
        var img = document.createElement('img');
        img.className = 'llp-img';
        img.src = _llpImgSrc(section.url);
        img.alt = section.caption || '';
        body.appendChild(img);
      }
      if (section.caption) {
        var cap = document.createElement('p');
        cap.className = 'llp-cap';
        cap.textContent = section.caption;
        body.appendChild(cap);
      }
    }
    secsBox.appendChild(secEl);
  });

  body.appendChild(secsBox);
  var foot = document.createElement('div');
  foot.className = 'llp-foot';
  var fb = document.createElement('b');
  fb.textContent = 'Letra Caribe';
  var fs = document.createElement('span');
  fs.textContent = item.title || '';
  foot.appendChild(fb);
  foot.appendChild(fs);
  body.appendChild(foot);
  page.appendChild(body);

  // botones
  var xBtn = document.createElement('button');
  xBtn.className = 'btn';
  xBtn.style.cssText = 'background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted)';
  xBtn.appendChild(LegoIcon('ti-x'));
  xBtn.onclick = function() { if (window.LegoModal && LegoModal.close) LegoModal.close(); };

  var btnPrint = document.createElement('button');
  btnPrint.className = 'btn btn-coral';
  btnPrint.textContent = 'Imprimir / PDF';
  btnPrint.onclick = function() {
    document.body.classList.add('printing-lib');
    window.print();
    document.body.classList.remove('printing-lib');
  };

  var cerrar = document.createElement('button');
  cerrar.className = 'btn';
  cerrar.textContent = 'Cerrar';
  cerrar.onclick = function() { if (window.LegoModal && LegoModal.close) LegoModal.close(); };

  var overlay = LegoModal({ M6: xBtn, M3: page, M5: btnPrint, M7: cerrar });
  var m3 = overlay.querySelector('.lego-modal-m3');
  if (m3) m3.style.padding = '0';
  var m = overlay.querySelector('.lego-modal');
  if (m) m.style.maxWidth = '760px';
  return overlay;
}

// -- LegoLibraryFilters -------------------------------------
// Barra de filtros para biblioteca: busqueda + nivel + categoria. Compartida admin/index.
//   LegoLibraryFilters({ items, catName, onFilter })  catName(item)->string ; onFilter(filtered)
function LegoLibraryFilters(opts) {
  opts = opts || {};
  var items = opts.items || [];
  var catName = opts.catName || function(it){ return (it.grammar_categories && it.grammar_categories.name) || ''; };
  var onFilter = opts.onFilter || function(){};

  var ctrlCss = 'padding:8px 10px;border:1px solid var(--border);border-radius:var(--r);font-size:13px;font-family:inherit;background:var(--white);color:var(--ink)';

  var bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px';

  var search = document.createElement('input');
  search.type = 'text';
  search.placeholder = 'Buscar material...';
  search.style.cssText = 'flex:1;min-width:160px;' + ctrlCss;

  var levelOpts = [{ value:'', label:'Todos los niveles' }].concat(['A1','A2','B1','B2','C1'].map(function(l){ return { value:l, label:l }; }));
  var levelSel = LegoSelect({ options: levelOpts });
  levelSel.style.cssText = ctrlCss + ';min-width:130px';

  var cats = [];
  items.forEach(function(it){ var n = catName(it); if (n && cats.indexOf(n) === -1) cats.push(n); });
  cats.sort();
  var catOpts = [{ value:'', label:'Todas las categorias' }].concat(cats.map(function(c){ return { value:c, label:c }; }));
  var catSel = LegoSelect({ options: catOpts });
  catSel.style.cssText = ctrlCss + ';min-width:150px';

  function apply() {
    var q = (search.value || '').toLowerCase();
    var lvl = levelSel.value;
    var cat = catSel.value;
    var filtered = items.filter(function(it){
      var mQ = !q || ((it.title || '').toLowerCase().indexOf(q) !== -1) || ((it.description || '').toLowerCase().indexOf(q) !== -1);
      var mL = !lvl || it.level === lvl;
      var mC = !cat || catName(it) === cat;
      return mQ && mL && mC;
    });
    onFilter(filtered);
  }
  search.addEventListener('input', apply);
  levelSel.addEventListener('change', apply);
  catSel.addEventListener('change', apply);

  bar.appendChild(search); bar.appendChild(levelSel); bar.appendChild(catSel);
  return bar;
}

// -- LegoActionGrid -----------------------------------------
// Agrupa botones de accion en una grilla compacta. No crea botones: ordena nodos existentes.
//   LegoActionGrid([btnAsignar, btnEliminar, btnVer, btnEditar])
function LegoActionGrid(actions, opts) {
  opts = opts || {};
  if (!document.getElementById('lego-action-grid-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-action-grid-styles';
    st.textContent = '.lego-action-grid{display:grid;grid-template-columns:repeat(2,auto);gap:6px;align-items:center;justify-content:end}.lego-action-grid .btn{width:38px;height:32px;justify-content:center;padding:0}.lego-action-grid .btn .ti{font-size:15px}';
    document.head.appendChild(st);
  }
  var grid = document.createElement('div');
  grid.className = 'lego-action-grid';
  if (opts.className) grid.classList.add(opts.className);
  (actions || []).forEach(function(action) {
    if (action instanceof HTMLElement) grid.appendChild(action);
  });
  return grid;
}


// -- LegoIcon ----------------------------------------------
// Atomo de icono: devuelve un <i> Tabler. name = 'ti-...'.
//   LegoIcon('ti-pencil')
//   LegoIcon('ti-check', { size: 14, color: '#2E7D32' })
function LegoIcon(name, opts) {
  opts = opts || {};
  var i = document.createElement('i');
  i.className = 'ti ' + name;
  var s = '';
  if (opts.size)  s += 'font-size:' + opts.size + 'px;';
  if (opts.color) s += 'color:' + opts.color + ';';
  if (s) i.style.cssText = s;
  return i;
}

// -- LegoSelect --------------------------------------------
// Picker sellado: devuelve un <select> DOM. value = id (el cable), label = texto.
//   LegoSelect({ options: cats.map(c=>({value:c.id,label:c.name})), value: a.grammar_category_id, id:'rd-grammar-cat', placeholder:'— Sin categoría —' })
function LegoSelect(opts) {
  opts = opts || {};
  var sel = document.createElement('select');
  sel.className = opts.className || 'form-select';
  if (opts.id) sel.id = opts.id;
  if (opts.placeholder !== undefined && opts.placeholder !== null) {
    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = opts.placeholder;
    sel.appendChild(ph);
  }
  (opts.options || []).forEach(function(o) {
    var op = document.createElement('option');
    op.value = (o.value === null || o.value === undefined) ? '' : String(o.value);
    op.textContent = (o.label === null || o.label === undefined) ? '' : String(o.label);
    sel.appendChild(op);
  });
  if (opts.value !== undefined && opts.value !== null) sel.value = String(opts.value);
  if (typeof opts.onChange === 'function') {
    sel.addEventListener('change', function(e) { opts.onChange(e.target.value, e); });
  }
  return sel;
}

// -- LegoEmpty ---------------------------------------------
// Estado vacío sellado: devuelve un nodo .empty. El icono es slot opcional (colapsa si falta).
//   LegoEmpty({ text: 'No hay nada.' })
//   LegoEmpty({ icon: '📚', text: 'No hay actividades aún.' })
function LegoTable(opts) {
  opts = opts || {};
  if (!document.getElementById('lego-table-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-table-styles';
    st.textContent = '.lego-table-wrap{border:1px solid var(--border);border-radius:var(--r);overflow:auto;background:var(--white)}.lego-table{width:100%;border-collapse:collapse}.lego-table th{padding:8px 10px;background:var(--sand);color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.06em;text-align:left;white-space:nowrap}.lego-table td{padding:8px 10px;font-size:13px;line-height:1.35;color:var(--ink);vertical-align:top;border-bottom:1px solid var(--border)}.lego-table tr:last-child td{border-bottom:none}.lego-table-empty{text-align:center;color:var(--muted);font-size:13px;padding:18px!important}';
    document.head.appendChild(st);
  }
  var columns = opts.columns || [];
  var rows = opts.rows || [];
  var wrap = document.createElement('div');
  wrap.className = 'lego-table-wrap';
  if (opts.className) wrap.className += ' ' + opts.className;
  if (opts.style) wrap.style.cssText = opts.style;
  var table = document.createElement('table');
  table.className = 'lego-table';
  if (opts.minWidth) table.style.minWidth = typeof opts.minWidth === 'number' ? opts.minWidth + 'px' : String(opts.minWidth);
  var thead = document.createElement('thead');
  var hr = document.createElement('tr');
  columns.forEach(function(col) {
    var th = document.createElement('th');
    th.textContent = col.label || '';
    if (col.width) th.style.width = typeof col.width === 'number' ? col.width + 'px' : String(col.width);
    if (col.headerStyle) th.style.cssText += ';' + col.headerStyle;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);
  var tbody = document.createElement('tbody');
  if (!rows.length) {
    var emptyTr = document.createElement('tr');
    var emptyTd = document.createElement('td');
    emptyTd.className = 'lego-table-empty';
    emptyTd.colSpan = Math.max(columns.length, 1);
    emptyTd.textContent = opts.emptyText || 'Sin resultados.';
    emptyTr.appendChild(emptyTd);
    tbody.appendChild(emptyTr);
  } else {
    rows.forEach(function(row, rowIndex) {
      var tr = document.createElement('tr');
      columns.forEach(function(col) {
        var td = document.createElement('td');
        if (col.width) td.style.width = typeof col.width === 'number' ? col.width + 'px' : String(col.width);
        if (col.cellStyle) td.style.cssText += ';' + col.cellStyle;
        var value = typeof col.render === 'function' ? col.render(row, rowIndex) : row[col.key];
        if (value instanceof HTMLElement) td.appendChild(value);
        else if (value !== undefined && value !== null) td.textContent = String(value);
        if (typeof col.onClick === 'function') td.onclick = function(e){ col.onClick(row, rowIndex, e); };
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

function LegoEmpty(opts) {
  opts = opts || {};
  if (typeof opts === 'string') opts = { text: opts };
  if (!document.getElementById('lego-empty-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-empty-styles';
    st.textContent = '.empty{text-align:center;padding:44px 20px;color:var(--muted)}.empty-icon{font-size:32px;margin-bottom:10px}.empty-text{font-size:13px;line-height:1.6}';
    document.head.appendChild(st);
  }
  var wrap = document.createElement('div');
  wrap.className = 'empty';
  if (opts.icon) {
    var ic = document.createElement('div');
    ic.className = 'empty-icon';
    ic.textContent = opts.icon;
    wrap.appendChild(ic);
  }
  var txt = document.createElement('div');
  txt.className = 'empty-text';
  txt.textContent = opts.text || '';
  wrap.appendChild(txt);
  return wrap;
}

// -- LegoBanner --------------------------------------------
// Banner sellado con variante de color. icon (emoji o 'ti-...') y action opcionales (colapsan).
//   LegoBanner({ variant:'success', icon:'✓', text:'Guardado.' })
//   LegoBanner({ variant:'warning', icon:'ti-pencil', text:'Editando: X', action:{ label:'Cancelar', onClick:fn } })
function LegoBanner(opts) {
  opts = opts || {};
  if (!document.getElementById('lego-banner-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-banner-styles';
    st.textContent = '.lego-banner{display:flex;align-items:center;gap:8px;border-radius:var(--r);padding:10px 13px;font-size:13px;border:1px solid transparent}.lego-banner__text{flex:1}.lego-banner--success{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lego-banner--error{background:var(--red-lt);border-color:var(--red);color:var(--red)}.lego-banner--info{background:var(--sand);border-color:transparent;color:var(--muted);font-size:12px}.lego-banner--warning{background:#FDF0E4;border-color:#F5D3B0;color:#B85A00}.lego-banner__action{background:none;border:none;cursor:pointer;font-size:12px;color:inherit;text-decoration:underline;font-family:inherit}';
    document.head.appendChild(st);
  }
  var wrap = document.createElement('div');
  wrap.className = 'lego-banner lego-banner--' + (opts.variant || 'info');
  if (opts.icon) {
    if (typeof opts.icon === 'string' && opts.icon.indexOf('ti-') === 0) {
      wrap.appendChild(LegoIcon(opts.icon));
    } else {
      var ie = document.createElement('span');
      ie.textContent = opts.icon;
      wrap.appendChild(ie);
    }
  }
  var txt = document.createElement('span');
  txt.className = 'lego-banner__text';
  txt.textContent = opts.text || '';
  wrap.appendChild(txt);
  if (opts.action) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lego-banner__action';
    btn.textContent = opts.action.label;
    btn.onclick = opts.action.onClick;
    wrap.appendChild(btn);
  }
  return wrap;
}


// -- LegoPlayer --------------------------------------------
// Reproductor sellado de actividades. Puro: rinde + juega + califica, reporta via onResult. NO toca DB.
//   LegoPlayer(activity, { mode:'play'|'review', onResult: fn })  -> nodo DOM
//   onResult({ type, score, total, answers:[{key,questionText,answer,isCorrect}] })
// Extensible: cada tipo es un helper que registra state.score() y state.detail(). Agregar tipo = un helper, sin tocar el core.
function LegoPlayer(activity, opts) {
  opts = opts || {};
  var mode = opts.mode || 'play';
  var onResult = typeof opts.onResult === 'function' ? opts.onResult : null;
  var feedback = opts.feedback !== false;
  if (!document.getElementById('lego-player-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-player-styles';
    st.textContent = '.lego-player{font-size:15px;height:100%;display:flex;flex-direction:column;min-height:0}.lp-instr{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px}.lp-legend{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;font-size:11px;font-weight:500}.lp-sentence{font-family:var(--serif,serif);font-size:15px;line-height:2.2;color:var(--ink);margin-bottom:10px}.lp-input{border:none;border-bottom:2px solid var(--border);background:transparent;font-family:inherit;font-size:15px;text-align:center;min-width:70px;outline:none;padding:2px 4px}.lp-input.correct{border-color:var(--green);color:var(--green)}.lp-input.tilde{border-color:#DAA520;color:#DAA520}.lp-input.wrong{border-color:var(--red);color:var(--red)}.lp-fb{font-size:11px;margin-top:2px;min-height:13px}.lp-score{font-weight:700;margin-bottom:12px;color:var(--ink-soft);flex-shrink:0}.lp-text{font-family:var(--serif,serif);font-size:15px;line-height:1.8;color:var(--ink);margin-bottom:14px}.lp-mc-block{margin-bottom:16px}.lp-mc-q{display:flex;gap:8px;font-weight:600;margin-bottom:8px;align-items:flex-start}.lp-mc-num{background:var(--coral);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}.lp-mc-opts{display:flex;flex-direction:column;gap:6px}.lp-mc-opt{text-align:left;padding:9px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-mc-opt:disabled{cursor:default}.lp-mc-opt.correct{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lp-mc-opt.wrong{background:var(--red-lt);border-color:var(--red);color:var(--red)}.lp-mc-fb{font-size:12px;margin-top:6px;min-height:14px}.lp-open{width:100%;border:1px solid var(--border);border-radius:8px;padding:8px;font:inherit;font-size:14px}.lp-body{flex:1 1 auto;min-height:0;overflow:auto}.lp-submit-msg{font-size:12px;font-weight:700;color:var(--red);margin-top:8px;min-height:16px;flex-shrink:0}.lp-nofeedback .lp-input.correct,.lp-nofeedback .lp-input.wrong,.lp-nofeedback .lp-input.tilde{border-color:var(--border)!important;color:var(--ink)!important}.lp-nofeedback .lp-mc-opt.correct,.lp-nofeedback .lp-mc-opt.wrong{background:var(--white,#fff)!important;border-color:var(--border)!important;color:var(--ink)!important}.lp-nofeedback .lp-fb,.lp-nofeedback .lp-mc-fb,.lp-nofeedback .lp-legend{display:none!important}.lp-mc-opt.lp-picked{background:var(--sand);border-color:var(--coral);color:var(--ink)}.lp-input.lp-picked{border-color:var(--coral)}';
    document.head.appendChild(st);
  }
  var content = {};
  try { content = typeof activity.content === 'string' ? JSON.parse(activity.content) : (activity.content || {}); } catch(e) {}
  var type = activity.type || content.type || 'mc';
  if (content.version === 2) return _lpCompose(activity, content, opts);
  return _lpCompose(activity, _lpAdapt(activity), opts);
}

function _lpFillBlank(content, isDropdown, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var instr = document.createElement('div');
  instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Completa los espacios en blanco.';
  wrap.appendChild(instr);
  if (!isDropdown) {
    var legend = document.createElement('div');
    legend.className = 'lp-legend';
    [['var(--green)','Correcto'],['#DAA520','Falta tilde'],['var(--red)','Incorrecto']].forEach(function(p){
      var sp = document.createElement('span'); sp.style.color = p[0]; sp.textContent = p[1]; legend.appendChild(sp);
    });
    wrap.appendChild(legend);
  }
  function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }
  (content.sentences||[]).forEach(function(s, si){
    if (!s.hasBlank || !s.parts) {
      var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return;
    }
    var line = document.createElement('div');
    line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var key = si + '-' + pi;
        if (isDropdown && (blank.options||[]).length) {
          var sel = document.createElement('select');
          sel.className = 'lp-input';
          var pho = document.createElement('option'); pho.value = ''; pho.textContent = 'elige'; sel.appendChild(pho);
          (blank.options||[]).forEach(function(o){ var op = document.createElement('option'); op.value = o; op.textContent = o; sel.appendChild(op); });
          sel.addEventListener('change', function(){
            var val = sel.value, ans = (blank.answer||'').trim();
            if (!val) { sel.className = 'lp-input'; delete answers[key]; refreshScore(); return; }
            if (val.toLowerCase() === ans.toLowerCase()) { sel.className = 'lp-input correct'; sel.disabled = true; answers[key] = { correct:true, answer:val }; }
            else { sel.className = 'lp-input wrong'; answers[key] = { correct:false, answer:val }; }
            refreshScore();
          });
          line.appendChild(sel);
        } else {
          var box = document.createElement('span');
          box.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px';
          var input = document.createElement('input');
          input.className = 'lp-input';
          input.placeholder = blank.hint || '___';
          input.setAttribute('autocomplete','off'); input.setAttribute('autocorrect','off'); input.spellcheck = false;
          var fb = document.createElement('span');
          fb.className = 'lp-fb';
          input.addEventListener('input', function(){
            var val = input.value.trim(), ans = (blank.answer||'').trim();
            if (!val) { input.className = 'lp-input'; fb.textContent = ''; delete answers[key]; refreshScore(); return; }
            if (val.toLowerCase() === ans.toLowerCase()) { input.className = 'lp-input correct'; fb.style.color = 'var(--green)'; fb.textContent = 'ok'; answers[key] = { correct:true, tilde:false, answer:val }; }
            else if (norm(val) === norm(ans)) { input.className = 'lp-input tilde'; fb.style.color = '#DAA520'; fb.textContent = 'tilde: ' + ans; answers[key] = { correct:false, tilde:true, answer:val }; }
            else if (val.length >= ans.length || val.length >= 3) { input.className = 'lp-input wrong'; fb.style.color = 'var(--red)'; fb.textContent = 'x'; answers[key] = { correct:false, tilde:false, answer:val }; }
            else { input.className = 'lp-input'; fb.textContent = ''; delete answers[key]; }
            refreshScore();
          });
          box.appendChild(input); box.appendChild(fb);
          line.appendChild(box);
        }
      }
    });
    wrap.appendChild(line);
  });
  state.score = function(){
    var total = 0, correct = 0;
    (content.sentences||[]).forEach(function(s, si){
      if (!s.hasBlank || !s.blanks) return;
      s.blanks.forEach(function(b, bi){ total++; var a = answers[si+'-'+bi]; if (a && a.correct) correct++; });
    });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    var d = [];
    (content.sentences||[]).forEach(function(s, si){
      if (!s.hasBlank || !s.blanks) return;
      s.blanks.forEach(function(b, bi){
        var a = answers[si+'-'+bi] || {};
        d.push({ key: si+'-'+bi, questionText: (s.parts||[]).join(' ___ '), answer: a.answer || '', isCorrect: !!a.correct });
      });
    });
    return d;
  };
  return wrap;
}

function _lpSplit(stim, qs){
  if (!document.getElementById('lego-split-styles')) {
    var sp = document.createElement('style'); sp.id = 'lego-split-styles';
    sp.textContent = '.lp-split-c{container-type:inline-size;height:100%;min-height:0}.lp-split{display:flex;flex-direction:column;gap:10px;height:100%;min-height:0}.lp-split-stim{flex:0 0 auto;overflow:auto;max-height:45%}.lp-split-qs{flex:1 1 auto;min-height:0;overflow:auto}@container (min-width:600px){.lp-split{flex-direction:row;align-items:stretch}.lp-split-stim{flex:0 0 42%;max-height:none}}';
    document.head.appendChild(sp);
  }
  var c = document.createElement('div'); c.className = 'lp-split-c';
  var box = document.createElement('div'); box.className = 'lp-split';
  var a = document.createElement('div'); a.className = 'lp-split-stim'; a.appendChild(stim);
  var b = document.createElement('div'); b.className = 'lp-split-qs'; b.appendChild(qs);
  box.appendChild(a); box.appendChild(b);
  c.appendChild(box);
  return c;
}
function _lpMC(content, activity, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var readingText = content.readingText || (activity && activity.reading_text) || '';
  var rt = null;
  if (readingText) { rt = document.createElement('div'); rt.className = 'lp-text'; rt.textContent = readingText; }
  var qBox = readingText ? document.createElement('div') : wrap;
  var questions = content.questions || [];
  questions.forEach(function(q, qi){
    var block = document.createElement('div');
    block.className = 'lp-mc-block';
    var qrow = document.createElement('div');
    qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(q.num || qi+1);
    var qtext = document.createElement('span'); qtext.style.flex = '1'; qtext.textContent = q.text || q.q || '';
    qrow.appendChild(num); qrow.appendChild(qtext);
    block.appendChild(qrow);
    if (q.type === 'open') {
      var ta = document.createElement('textarea');
      ta.className = 'lp-open'; ta.rows = 2; ta.placeholder = 'Escribe tu respuesta...';
      ta.addEventListener('input', function(){ answers['open-'+qi] = { open:true, answer: ta.value.trim() }; });
      block.appendChild(ta);
    } else {
      var opts = q.opts || [];
      var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
      var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
      var fb = document.createElement('div'); fb.className = 'lp-mc-fb';
      var btns = [];
      opts.forEach(function(o, oi){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'lp-mc-opt'; b.textContent = o;
        b.addEventListener('click', function(){
          if (block.dataset.done) return;
          block.dataset.done = '1';
          btns.forEach(function(bb, i){ bb.disabled = true; if (state.feedback === false) { if (i === oi) bb.classList.add('lp-picked'); } else if (i === correctIdx) bb.classList.add('correct'); else if (i === oi) bb.classList.add('wrong'); });
          var ok = oi === correctIdx;
          answers['mc-'+qi] = { correct: ok, answer: o };
          fb.style.color = ok ? 'var(--green)' : 'var(--red)';
          fb.textContent = ok ? 'Correcto' : 'Incorrecto';
          refreshScore();
        });
        btns.push(b); optsWrap.appendChild(b);
      });
      block.appendChild(optsWrap); block.appendChild(fb);
    }
    qBox.appendChild(block);
  });
  state.score = function(){
    var total = 0, correct = 0;
    questions.forEach(function(q, qi){ if (q.type === 'open') return; total++; var a = answers['mc-'+qi]; if (a && a.correct) correct++; });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    return questions.map(function(q, qi){
      if (q.type === 'open') { var oa = answers['open-'+qi] || {}; return { key:'open-'+qi, questionText: q.text||q.q||'', answer: oa.answer||'', isCorrect: null }; }
      var a = answers['mc-'+qi] || {};
      return { key:'mc-'+qi, questionText: q.text||q.q||'', answer: a.answer||'', isCorrect: a.correct === undefined ? false : a.correct };
    });
  };
  if (readingText) return _lpSplit(rt, qBox);
  return wrap;
}

function _lpAudioControls(content) {
  var audioUrl = content.audioUrl || content.audio_url || '';
  var youtubeUrl = content.youtubeUrl || content.youtube_url || '';
  var title = content.audioTitle || content.title || 'Audio';
  var isVideo = !!youtubeUrl || !!content.isVideo;
  if (youtubeUrl) {
    var ytId = (youtubeUrl.match(/(?:v=|youtu\.be\/)([\w-]{11})/) || [])[1] || '';
    if (ytId) {
      var yt = document.createElement('div');
      yt.style.cssText = 'width:100%;aspect-ratio:16/9;max-height:46vh;overflow:hidden;border-radius:10px;background:#000';
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube.com/embed/' + ytId;
      ifr.style.cssText = 'width:100%;height:100%;border:0';
      ifr.allowFullscreen = true;
      yt.appendChild(ifr);
      return yt;
    }
  }
  if (audioUrl && audioUrl.indexOf('drive.google.com') !== -1) {
    var driveId = '';
    var dPos = audioUrl.indexOf('/d/');
    if (dPos !== -1) { driveId = audioUrl.substring(dPos + 3).split('/')[0].split('?')[0]; }
    else { var iPos = audioUrl.indexOf('id='); if (iPos !== -1) driveId = audioUrl.substring(iPos + 3).split('&')[0]; }
    var dv = document.createElement('div'); dv.style.cssText = 'margin-bottom:18px';
    if (driveId) {
      var difr = document.createElement('iframe');
      difr.src = 'https://drive.google.com/file/d/' + driveId + '/preview';
      difr.setAttribute('allow', 'autoplay');
      if (isVideo) {
        dv.style.cssText = 'width:100%;aspect-ratio:16/9;max-height:46vh;overflow:hidden;border-radius:10px;background:#000';
        difr.style.cssText = 'width:100%;height:100%;border:0';
      } else {
        difr.style.cssText = 'width:100%;height:80px;border:0;border-radius:10px';
      }
      dv.appendChild(difr);
    }
    return dv;
  }  if (!audioUrl) return document.createElement('div');
  if (!document.getElementById('lego-audio-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-audio-styles';
    st.textContent = '.lp-audio{display:flex;align-items:center;gap:12px;background:var(--sand);border-radius:12px;padding:12px 14px;margin-bottom:18px}.lp-audio-play{width:44px;height:44px;border-radius:50%;border:none;background:var(--coral);color:#fff;font-size:16px;cursor:pointer;flex-shrink:0}.lp-audio-info{flex:1}.lp-audio-title{font-weight:600;font-size:13px;margin-bottom:6px}.lp-audio-prog{height:6px;background:var(--border);border-radius:3px;cursor:pointer;overflow:hidden;margin-bottom:4px}.lp-audio-bar{height:100%;background:var(--coral);width:0%}.lp-audio-time{font-size:11px;color:var(--muted)}.lp-audio-ctrl{background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;margin-left:8px}';
    document.head.appendChild(st);
  }
  var repeat = false;
  var audio = document.createElement('audio');
  audio.src = audioUrl; audio.preload = 'auto';
  var wrap = document.createElement('div'); wrap.className = 'lp-audio';
  var playBtn = document.createElement('button'); playBtn.className = 'lp-audio-play'; playBtn.textContent = 'play';
  var info = document.createElement('div'); info.className = 'lp-audio-info';
  var titleEl = document.createElement('div'); titleEl.className = 'lp-audio-title'; titleEl.textContent = title;
  var prog = document.createElement('div'); prog.className = 'lp-audio-prog';
  var bar = document.createElement('div'); bar.className = 'lp-audio-bar'; prog.appendChild(bar);
  var row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:space-between;align-items:center';
  var timeEl = document.createElement('span'); timeEl.className = 'lp-audio-time'; timeEl.textContent = '0:00 / 0:00';
  var ctrls = document.createElement('div');
  var repeatBtn = document.createElement('button'); repeatBtn.className = 'lp-audio-ctrl'; repeatBtn.textContent = 'Repetir'; repeatBtn.style.opacity = '0.6';
  var restartBtn = document.createElement('button'); restartBtn.className = 'lp-audio-ctrl'; restartBtn.textContent = 'Inicio';
  ctrls.appendChild(repeatBtn); ctrls.appendChild(restartBtn);
  row.appendChild(timeEl); row.appendChild(ctrls);
  info.appendChild(titleEl); info.appendChild(prog); info.appendChild(row);
  wrap.appendChild(playBtn); wrap.appendChild(info); wrap.appendChild(audio);
  function fmt(s){ return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }
  function updateBar(){ if (isNaN(audio.duration)) return; bar.style.width = (audio.currentTime/audio.duration*100) + '%'; timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration); }
  playBtn.addEventListener('click', function(){ if (audio.paused) { audio.play(); playBtn.textContent = 'pausa'; } else { audio.pause(); playBtn.textContent = 'play'; } });
  audio.addEventListener('timeupdate', updateBar);
  audio.addEventListener('loadedmetadata', updateBar);
  audio.addEventListener('ended', function(){ playBtn.textContent = 'play'; if (repeat) { audio.currentTime = 0; audio.play(); playBtn.textContent = 'pausa'; } });
  prog.addEventListener('click', function(e){ if (isNaN(audio.duration)) return; var rect = prog.getBoundingClientRect(); audio.currentTime = (e.clientX - rect.left) / rect.width * audio.duration; });
  repeatBtn.addEventListener('click', function(){ repeat = !repeat; repeatBtn.style.opacity = repeat ? '1' : '0.6'; });
  restartBtn.addEventListener('click', function(){ audio.currentTime = 0; audio.play(); playBtn.textContent = 'pausa'; });
  return wrap;
}

function _lpTrueFalse(content, state, refreshScore) {
  var answers = state.answers;
  var wrap = document.createElement('div');
  var statements = content.statements || [];
  statements.forEach(function(s, si){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(si+1);
    var txt = document.createElement('span'); txt.style.flex = '1'; txt.textContent = s.text || '';
    qrow.appendChild(num); qrow.appendChild(txt); block.appendChild(qrow);
    var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
    var fb = document.createElement('div'); fb.className = 'lp-mc-fb';
    var btns = [];
    [true, false].forEach(function(val){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lp-mc-opt'; b.textContent = val ? 'Verdadero' : 'Falso';
      b.addEventListener('click', function(){
        if (block.dataset.done) return;
        block.dataset.done = '1';
        var ok = val === s.correct;
        btns.forEach(function(bb, i){ bb.disabled = true; var bv = (i === 0); if (state.feedback === false) { if (bv === val) bb.classList.add('lp-picked'); } else if (bv === s.correct) bb.classList.add('correct'); else if (bv === val) bb.classList.add('wrong'); });
        answers['tf-'+si] = { correct: ok, answer: val ? 'Verdadero' : 'Falso' };
        fb.style.color = ok ? 'var(--green)' : 'var(--red)';
        fb.textContent = ok ? 'Correcto' : 'Incorrecto';
        refreshScore();
      });
      btns.push(b); optsWrap.appendChild(b);
    });
    block.appendChild(optsWrap); block.appendChild(fb);
    wrap.appendChild(block);
  });
  state.score = function(){ var t = 0, c = 0; statements.forEach(function(s, si){ t++; var a = answers['tf-'+si]; if (a && a.correct) c++; }); return { correct: c, total: t }; };
  state.detail = function(){ return statements.map(function(s, si){ var a = answers['tf-'+si] || {}; return { key:'tf-'+si, questionText: s.text || '', answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpOrderVocabStyles() {
  if (document.getElementById('lego-orderv-styles')) return;
  var st = document.createElement('style');
  st.id = 'lego-orderv-styles';
  st.textContent = '.lp-ov-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:8px 0 6px}.lp-order-bank{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.lp-order-item{padding:7px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-order-item.placed{opacity:.4;cursor:default}.lp-order-slot{padding:9px 12px;border:1px dashed var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;color:var(--muted)}.lp-order-slot.filled{border-style:solid;color:var(--ink);background:var(--sand)}.lp-vocab-word{padding:7px 12px;border:1px solid var(--border);border-radius:99px;background:var(--white,#fff);cursor:pointer;font:inherit;font-size:14px}.lp-vocab-word.selected{background:var(--coral);color:#fff;border-color:var(--coral)}';
  document.head.appendChild(st);
}

function _lpOrder(content, state, refreshScore) {
  _lpOrderVocabStyles();
  var answers = state.answers;
  var events = content.events || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Ordena los eventos en el orden en que ocurren.';
  wrap.appendChild(instr);
  var slots = [];
  var bankItems = [];
  function fillNext(text, itemEl) {
    for (var si = 0; si < slots.length; si++) {
      if (!slots[si].dataset.filled) {
        slots[si].dataset.filled = text;
        slots[si].textContent = (si+1) + '. ' + text;
        slots[si].classList.add('filled');
        itemEl.classList.add('placed');
        answers['order-' + si] = { answer: text, correct: text === events[si] };
        refreshScore();
        return;
      }
    }
  }
  var bankLabel = document.createElement('div'); bankLabel.className = 'lp-ov-label'; bankLabel.textContent = 'Banco de eventos';
  var bank = document.createElement('div'); bank.className = 'lp-order-bank';
  var shuffled = events.map(function(e){ return e; }).sort(function(){ return Math.random() - 0.5; });
  shuffled.forEach(function(ev){
    var it = document.createElement('button'); it.type = 'button'; it.className = 'lp-order-item'; it.textContent = ev;
    it.addEventListener('click', function(){ if (it.classList.contains('placed')) return; fillNext(ev, it); });
    bankItems.push(it); bank.appendChild(it);
  });
  var slotsLabel = document.createElement('div'); slotsLabel.className = 'lp-ov-label'; slotsLabel.textContent = 'Orden correcto';
  var slotsWrap = document.createElement('div');
  events.forEach(function(ev, i){
    var slot = document.createElement('div'); slot.className = 'lp-order-slot'; slot.textContent = (i+1) + '. (vacio)';
    slot.addEventListener('click', function(){
      if (!slot.dataset.filled) return;
      var text = slot.dataset.filled;
      delete slot.dataset.filled; slot.classList.remove('filled'); slot.textContent = (i+1) + '. (vacio)';
      bankItems.forEach(function(b){ if (b.textContent === text) b.classList.remove('placed'); });
      delete answers['order-' + i]; refreshScore();
    });
    slots.push(slot); slotsWrap.appendChild(slot);
  });
  wrap.appendChild(bankLabel); wrap.appendChild(bank); wrap.appendChild(slotsLabel); wrap.appendChild(slotsWrap);
  state.score = function(){ var t = events.length, c = 0; for (var i = 0; i < events.length; i++) { var a = answers['order-'+i]; if (a && a.correct) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return events.map(function(ev, i){ var a = answers['order-'+i] || {}; return { key:'order-'+i, questionText: 'Posición ' + (i+1), answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpVocab(content, state, refreshScore) {
  _lpOrderVocabStyles();
  var answers = state.answers;
  var wordList = content.wordList || [];
  var heard = content.wordsHeard || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Marca las palabras que escuchas en el audio.';
  wrap.appendChild(instr);
  var grid = document.createElement('div'); grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
  wordList.forEach(function(w, wi){
    var correct = heard.indexOf(w) !== -1;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lp-vocab-word'; b.textContent = w;
    b.addEventListener('click', function(){
      b.classList.toggle('selected');
      answers['vocab-'+wi] = { selected: b.classList.contains('selected'), correct: correct, answer: w };
      refreshScore();
    });
    grid.appendChild(b);
  });
  wrap.appendChild(grid);
  state.score = function(){ var t = heard.length, c = 0; wordList.forEach(function(w, wi){ var a = answers['vocab-'+wi]; if (a && a.correct && a.selected) c++; }); return { correct: c, total: t }; };
  state.detail = function(){ var sel = []; wordList.forEach(function(w, wi){ var a = answers['vocab-'+wi]; if (a && a.selected) sel.push(w); }); return [{ key:'vocab', questionText: 'Vocabulario identificado', answer: sel.join(', '), isCorrect: null }]; };
  return wrap;
}

function _lpMatch(content, state, refreshScore) {
  if (!document.getElementById('lego-match-styles')) {
    var mst = document.createElement('style');
    mst.id = 'lego-match-styles';
    mst.textContent = '.lp-match-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}.lp-match-col-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px}.lp-match-item{padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:13px;background:var(--white,#fff)}.lp-match-item.sel{border-color:var(--orange);background:var(--orange-lt)}.lp-match-item.matched{border-color:var(--green);background:var(--green-lt);color:var(--green);cursor:default}.lp-match-item.wrong{border-color:var(--red);background:var(--red-lt)}';
    document.head.appendChild(mst);
  }
  var answers = state.answers;
  var pairs = content.pairs || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Conecta cada elemento con su par correcto.';
  wrap.appendChild(instr);
  if (!pairs.length) { wrap.appendChild(LegoEmpty({ text: 'Sin pares configurados.' })); state.score = function(){ return { correct:0, total:0 }; }; state.detail = function(){ return []; }; return wrap; }
  var grid = document.createElement('div'); grid.className = 'lp-match-grid';
  var colA = document.createElement('div'); var colB = document.createElement('div');
  var la = document.createElement('div'); la.className = 'lp-match-col-label'; la.textContent = 'Columna A'; colA.appendChild(la);
  var lb = document.createElement('div'); lb.className = 'lp-match-col-label'; lb.textContent = 'Columna B'; colB.appendChild(lb);
  var selectedLeft = null;
  var leftEls = [];
  pairs.forEach(function(p, i){
    var el = document.createElement('div'); el.className = 'lp-match-item'; el.textContent = p.left;
    el.addEventListener('click', function(){
      if (el.dataset.matched) return;
      leftEls.forEach(function(le){ if (!le.dataset.matched) le.classList.remove('sel'); });
      selectedLeft = i; el.classList.add('sel');
    });
    leftEls.push(el); colA.appendChild(el);
  });
  var rightItems = pairs.map(function(p, i){ return { text: p.right, idx: i }; }).sort(function(){ return Math.random() - 0.5; });
  rightItems.forEach(function(item){
    var el = document.createElement('div'); el.className = 'lp-match-item'; el.textContent = item.text;
    el.addEventListener('click', function(){
      if (selectedLeft === null || el.dataset.matched) return;
      var leftEl = leftEls[selectedLeft];
      var ok = item.idx === selectedLeft;
      if (ok) {
        leftEl.classList.remove('sel'); leftEl.classList.add('matched'); el.classList.add('matched');
        leftEl.dataset.matched = '1'; el.dataset.matched = '1';
        answers['match-'+selectedLeft] = { correct: true, answer: item.text };
        selectedLeft = null;
      } else {
        var sl = selectedLeft;
        el.classList.add('wrong'); leftEl.classList.add('wrong');
        answers['match-'+sl] = { correct: false, answer: item.text };
        setTimeout(function(){ el.classList.remove('wrong'); leftEls[sl].classList.remove('wrong'); }, 600);
      }
      refreshScore();
    });
    colB.appendChild(el);
  });
  grid.appendChild(colA); grid.appendChild(colB);
  wrap.appendChild(grid);
  state.score = function(){ var t = pairs.length, c = 0; for (var i = 0; i < pairs.length; i++) { var a = answers['match-'+i]; if (a && a.correct) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return pairs.map(function(p, i){ var a = answers['match-'+i] || {}; return { key:'match-'+i, questionText: p.left, answer: a.answer || '', isCorrect: a.correct === undefined ? false : a.correct }; }); };
  return wrap;
}

function _lpDragDrop(content, state, refreshScore) {
  if (!document.getElementById('lego-dnd-styles')) {
    var dst = document.createElement('style');
    dst.id = 'lego-dnd-styles';
    dst.textContent = '.lp-dnd-bank{position:sticky;top:0;z-index:4;display:flex;flex-wrap:wrap;gap:6px;max-height:132px;overflow:auto;margin:0 0 16px;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--white,#fff);box-shadow:0 6px 16px rgba(0,0,0,.08);overscroll-behavior:contain}.lp-dnd-word{padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:var(--white,#fff);cursor:grab;font-size:14px;user-select:none;touch-action:none}.lp-dnd-word.sel{outline:2px solid var(--orange)}.lp-dnd-word.used{opacity:.35;pointer-events:none}.lp-dnd-word.dragging{opacity:.4}.lp-dnd-ghost{position:fixed;z-index:9999;pointer-events:none;padding:6px 12px;border:1px solid var(--orange);border-radius:8px;background:var(--white,#fff);font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.18)}.lp-dnd-blank{display:inline-block;min-width:88px;border:1.5px dashed var(--border);border-radius:8px;text-align:center;cursor:pointer;margin:0 4px;padding:8px 12px;vertical-align:middle}.lp-dnd-blank.over{background:var(--orange-lt,#FDEEE8);outline:2px dashed var(--orange);outline-offset:2px}.lp-dnd-blank.filled-correct{border-color:var(--green);color:var(--green)}.lp-dnd-blank.filled-wrong{border-color:var(--red);color:var(--red)}';
    document.head.appendChild(dst);
  }
  var answers = state.answers;
  var sentences = content.sentences || [];
  var wrap = document.createElement('div');
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Arrastra las palabras a los espacios correctos.';
  wrap.appendChild(instr);
  var allWords = [];
  sentences.forEach(function(s){ if (s.hasBlank && s.blanks) s.blanks.forEach(function(b){ if (b.answer) allWords.push(b.answer); }); });
  var bankWords = allWords.concat(content.distractors || []).sort(function(){ return Math.random() - 0.5; });
  var selected = null;
  var bankEls = [];
  function clearSel(){ bankEls.forEach(function(b){ b.classList.remove('sel'); }); }
  var bank = document.createElement('div'); bank.className = 'lp-dnd-bank';
  var drag = null;
  function blankFromPoint(x, y){
    var t = document.elementFromPoint(x, y);
    while (t && !(t.classList && t.classList.contains('lp-dnd-blank'))) t = t.parentElement;
    return t;
  }
  function onMove(e){
    if (!drag) return;
    var dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;
    if (!drag.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      drag.moved = true;
      drag.srcEl.classList.add('dragging');
      var g = document.createElement('div'); g.className = 'lp-dnd-ghost'; g.textContent = drag.word;
      document.body.appendChild(g); drag.ghost = g;
    }
    if (drag.moved && drag.ghost){
      drag.ghost.style.left = (e.clientX - 14) + 'px';
      drag.ghost.style.top = (e.clientY - 16) + 'px';
      if (drag.over) drag.over.classList.remove('over');
      var b = blankFromPoint(e.clientX, e.clientY);
      drag.over = b; if (b) b.classList.add('over');
    }
  }
  function onUp(e){
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    if (!drag) return;
    var d = drag; drag = null;
    if (d.moved){
      if (d.ghost) d.ghost.remove();
      d.srcEl.classList.remove('dragging');
      if (d.over) d.over.classList.remove('over');
      var b = blankFromPoint(e.clientX, e.clientY);
      if (b && b._lpPlace) b._lpPlace(d.word, d.srcEl);
      selected = null; clearSel();
    } else {
      if (selected && selected.el === d.srcEl) { selected = null; clearSel(); }
      else { selected = { word: d.word, el: d.srcEl }; clearSel(); d.srcEl.classList.add('sel'); }
    }
  }
  bankWords.forEach(function(w){
    var el = document.createElement('span'); el.className = 'lp-dnd-word'; el.textContent = w;
    el.addEventListener('pointerdown', function(e){
      if (el.classList.contains('used')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      drag = { word: w, srcEl: el, ghost: null, over: null, startX: e.clientX, startY: e.clientY, moved: false };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
    bankEls.push(el); bank.appendChild(el);
  });
  wrap.appendChild(bank);
  sentences.forEach(function(s, si){
    if (!s.hasBlank || !s.parts) { var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return; }
    var line = document.createElement('div'); line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var key = si + '-' + pi;
        var blankEl = document.createElement('span'); blankEl.className = 'lp-dnd-blank';
        function place(word, srcEl){
          if (!word) return;
          if (blankEl._srcEl) blankEl._srcEl.classList.remove('used');
          blankEl.textContent = word;
          if (srcEl) { srcEl.classList.add('used'); blankEl._srcEl = srcEl; } else { blankEl._srcEl = null; }
          var ok = word.toLowerCase() === (blank.answer || '').trim().toLowerCase();
          blankEl.className = 'lp-dnd-blank ' + (ok ? 'filled-correct' : 'filled-wrong');
          answers[key] = { correct: ok, answer: word };
          refreshScore();
        }
        blankEl._lpPlace = place;
        blankEl.addEventListener('click', function(){ if (selected) { place(selected.word, selected.el); selected = null; clearSel(); } });
        line.appendChild(blankEl);
      }
    });
    wrap.appendChild(line);
  });
  state.score = function(){
    var total = 0, correct = 0;
    sentences.forEach(function(s, si){ if (!s.hasBlank || !s.blanks) return; s.blanks.forEach(function(b, bi){ total++; var a = answers[si+'-'+bi]; if (a && a.correct) correct++; }); });
    return { correct: correct, total: total };
  };
  state.detail = function(){
    var d = [];
    sentences.forEach(function(s, si){ if (!s.hasBlank || !s.blanks) return; s.blanks.forEach(function(b, bi){ var a = answers[si+'-'+bi] || {}; d.push({ key: si+'-'+bi, questionText: (s.parts||[]).join(' ___ '), answer: a.answer || '', isCorrect: !!a.correct }); }); });
    return d;
  };
  return wrap;
}

// -- LegoPassToggle ----------------------------------------
// Ojo de mostrar/ocultar contraseña. Envuelve el input y agrega el botón.
//   LegoPassToggle(document.getElementById('login-pass'))
function LegoPassToggle(input){
  if (!input || input._passToggle) return;
  input._passToggle = true;
  var holder = document.createElement('div');
  holder.style.cssText = 'position:relative';
  if (input.parentElement) input.parentElement.insertBefore(holder, input);
  holder.appendChild(input);
  input.style.paddingRight = '38px';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Mostrar u ocultar la contraseña');
  btn.style.cssText = 'position:absolute;top:50%;right:10px;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);padding:0;display:flex;align-items:center';
  btn.appendChild(LegoIcon('ti-eye'));
  btn.onclick = function(){
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.replaceChildren(LegoIcon(show ? 'ti-eye-off' : 'ti-eye'));
  };
  holder.appendChild(btn);
  return btn;
}

function _lpReviewScoreHeader(saved){
  var graded = (saved||[]).filter(function(s){ return s.isCorrect !== null && s.isCorrect !== undefined; });
  var correct = graded.filter(function(s){ return s.isCorrect; }).length;
  var h = document.createElement('div');
  h.className = 'lp-score';
  h.textContent = correct + ' de ' + graded.length + ' correctas';
  return h;
}
function _lpReviewFillBlank(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  wrap.appendChild(instr);
  var idx = 0;
  (content.sentences||[]).forEach(function(s){
    if (!s.hasBlank || !s.parts) {
      var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return;
    }
    var line = document.createElement('div'); line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var sv = saved[idx] || {}; idx++;
        var span = document.createElement('span');
        span.className = 'lp-input ' + (sv.isCorrect ? 'correct' : 'wrong');
        span.style.cssText = 'display:inline-block;min-width:50px;font-weight:600';
        span.textContent = sv.answer || '(vacio)';
        line.appendChild(span);
        if (!sv.isCorrect && blank.answer) {
          var corr = document.createElement('span');
          corr.style.cssText = 'font-size:11px;color:var(--green);margin:0 5px';
          corr.textContent = blank.answer;
          line.appendChild(corr);
        }
      }
    });
    wrap.appendChild(line);
  });
  return wrap;
}
function _lpReviewMC(content, activity, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var readingText = content.readingText || (activity && activity.reading_text) || '';
  if (readingText) { var rt = document.createElement('div'); rt.className = 'lp-text'; rt.textContent = readingText; wrap.appendChild(rt); }
  var questions = content.questions || [];
  questions.forEach(function(q, qi){
    var sv = saved[qi] || {};
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(q.num || qi+1);
    var qtext = document.createElement('span'); qtext.style.flex = '1'; qtext.textContent = q.text || q.q || '';
    qrow.appendChild(num); qrow.appendChild(qtext); block.appendChild(qrow);
    if (q.type === 'open') {
      var ta = document.createElement('div'); ta.className = 'lp-open'; ta.style.whiteSpace = 'pre-wrap';
      ta.textContent = sv.answer || '(vacio)';
      block.appendChild(ta);
    } else {
      var opts2 = q.opts || [];
      var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
      var optsWrap = document.createElement('div'); optsWrap.className = 'lp-mc-opts';
      var answered = sv.answer !== undefined && sv.answer !== null && String(sv.answer).trim() !== '';
      opts2.forEach(function(o, oi){
        var b = document.createElement('div'); b.className = 'lp-mc-opt';
        if (answered && oi === correctIdx) b.className = 'lp-mc-opt correct';
        else if (answered && o === sv.answer) b.className = 'lp-mc-opt wrong';
        b.textContent = o;
        optsWrap.appendChild(b);
      });
      block.appendChild(optsWrap);
      if (!answered) {
        var miss = document.createElement('div');
        miss.style.cssText = 'font-size:12px;font-weight:700;color:var(--red);margin-top:6px';
        miss.textContent = 'Sin responder. Respuesta correcta: ' + (opts2[correctIdx] || '');
        block.appendChild(miss);
      } else if (sv.isCorrect === false && opts2.indexOf(sv.answer) === -1) {
        var picked = document.createElement('div');
        picked.style.cssText = 'font-size:12px;font-weight:700;color:var(--red);margin-top:6px';
        picked.textContent = 'Respuesta del estudiante: ' + sv.answer;
        block.appendChild(picked);
      }
    }
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpReviewDragDrop(content, saved){
  // Reusa los estilos .lp-dnd-* que _lpDragDrop inyecta (LegoPlayer construye el body de juego antes de sustituirlo por review).
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  wrap.appendChild(instr);
  var idx = 0;
  (content.sentences||[]).forEach(function(s){
    if (!s.hasBlank || !s.parts) {
      var pr = document.createElement('p'); pr.className = 'lp-sentence'; pr.textContent = s.text || ''; wrap.appendChild(pr); return;
    }
    var line = document.createElement('div'); line.className = 'lp-sentence';
    s.parts.forEach(function(part, pi){
      var seg = document.createElement('span'); seg.textContent = part; line.appendChild(seg);
      if (pi < s.blanks.length) {
        var blank = s.blanks[pi] || {};
        var sv = saved[idx] || {}; idx++;
        var box = document.createElement('span');
        box.className = 'lp-dnd-blank ' + (sv.isCorrect ? 'filled-correct' : 'filled-wrong');
        box.style.cursor = 'default';
        box.textContent = sv.answer || '(vacio)';
        line.appendChild(box);
        if (!sv.isCorrect && blank.answer) {
          var corr = document.createElement('span');
          corr.style.cssText = 'font-size:11px;color:var(--green);margin:0 5px';
          corr.textContent = blank.answer;
          line.appendChild(corr);
        }
      }
    });
    wrap.appendChild(line);
  });
  return wrap;
}
function _lpReviewMatch(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.textContent = content.instructions || 'Revision de tus respuestas.';
  wrap.appendChild(instr);
  (content.pairs||[]).forEach(function(p, i){
    var sv = saved[i] || {};
    var row = document.createElement('div'); row.className = 'lp-sentence';
    row.style.cssText = 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap';
    var l = document.createElement('span'); l.style.fontWeight = '600'; l.textContent = p.left || '';
    var ar = document.createElement('span'); ar.style.color = 'var(--muted)'; ar.textContent = '->';
    var a = document.createElement('span');
    a.style.cssText = 'font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = sv.answer || '(vacio)';
    row.appendChild(l); row.appendChild(ar); row.appendChild(a);
    if (!sv.isCorrect && p.right) {
      var corr = document.createElement('span');
      corr.style.cssText = 'font-size:11px;color:var(--green)';
      corr.textContent = p.right;
      row.appendChild(corr);
    }
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReviewTrueFalse(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  (content.statements||[]).forEach(function(s, si){
    var sv = saved[si] || {};
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(si+1);
    var txt = document.createElement('span'); txt.style.flex = '1'; txt.textContent = s.text || '';
    qrow.appendChild(num); qrow.appendChild(txt); block.appendChild(qrow);
    var a = document.createElement('div');
    a.style.cssText = 'font-size:14px;font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = sv.answer || '(vacio)';
    block.appendChild(a);
    if (!sv.isCorrect) {
      var corr = document.createElement('div');
      corr.style.cssText = 'font-size:11px;color:var(--green)';
      corr.textContent = s.correct ? 'Verdadero' : 'Falso';
      block.appendChild(corr);
    }
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpReviewOrder(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  (content.events||[]).forEach(function(ev, i){
    var sv = saved[i] || {};
    var line = document.createElement('div'); line.className = 'lp-sentence';
    var a = document.createElement('span');
    a.style.cssText = 'font-weight:600;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)');
    a.textContent = (i+1) + '. ' + (sv.answer || '(vacio)');
    line.appendChild(a);
    if (!sv.isCorrect && ev) {
      var corr = document.createElement('span');
      corr.style.cssText = 'font-size:11px;color:var(--green);margin:0 6px';
      corr.textContent = ev;
      line.appendChild(corr);
    }
    wrap.appendChild(line);
  });
  return wrap;
}
function _lpReviewVocab(content, saved){
  var wrap = document.createElement('div');
  var sv = saved[0] || {};
  var lbl = document.createElement('div'); lbl.className = 'lp-instr'; lbl.textContent = 'Vocabulario identificado';
  wrap.appendChild(lbl);
  var a = document.createElement('div');
  a.style.cssText = 'font-size:14px;font-weight:600;margin-bottom:10px';
  a.textContent = sv.answer || '(nada seleccionado)';
  wrap.appendChild(a);
  var heard = content.wordsHeard || [];
  if (heard.length) {
    var lbl2 = document.createElement('div'); lbl2.className = 'lp-instr'; lbl2.textContent = 'Palabras del audio';
    wrap.appendChild(lbl2);
    var h = document.createElement('div');
    h.style.cssText = 'font-size:13px;color:var(--green)';
    h.textContent = heard.join(', ');
    wrap.appendChild(h);
  }
  return wrap;
}
function _lpEditable(value, onSave){
  if (!document.getElementById('lego-edit-styles')) {
    var est = document.createElement('style');
    est.id = 'lego-edit-styles';
    est.textContent = '.lp-edit{border-bottom:1px dashed var(--coral);outline:none;cursor:text;padding:0 2px;min-width:24px;display:inline-block}.lp-edit:focus{background:var(--coral-lt,#FDF0E4)}';
    document.head.appendChild(est);
  }
  var s = document.createElement('span');
  s.className = 'lp-edit';
  s.contentEditable = 'true';
  s.spellcheck = false;
  s.textContent = (value === undefined || value === null) ? '' : value;
  s.addEventListener('blur', function(){ if (onSave) onSave(s.textContent); });
  return s;
}
function _lpEditInstr(content, wrap){
  var instr = document.createElement('div'); instr.className = 'lp-instr';
  instr.appendChild(_lpEditable(content.instructions || '', function(v){ content.instructions = v; }));
  wrap.appendChild(instr);
}
function _lpEditFillBlank(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.sentences||[]).forEach(function(s){
    var line = document.createElement('div'); line.className = 'lp-sentence';
    if (!s.hasBlank || !s.parts) {
      line.appendChild(_lpEditable(s.text || '', function(v){ s.text = v; }));
      wrap.appendChild(line); return;
    }
    s.parts.forEach(function(part, pi){
      line.appendChild(_lpEditable(part, function(v){ s.parts[pi] = v; }));
      if (pi < (s.blanks||[]).length) {
        var blank = s.blanks[pi] || {};
        var box = document.createElement('span'); box.className = 'lp-input correct'; box.style.margin = '0 4px';
        box.appendChild(_lpEditable(blank.answer || '', function(v){ blank.answer = v; }));
        if (blank.hint) {
          var stack = document.createElement('span');
          stack.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 4px';
          box.style.margin = '0';
          var hint = document.createElement('span');
          hint.style.cssText = 'font-size:11px;line-height:1.35;color:var(--muted);white-space:nowrap';
          hint.appendChild(document.createTextNode('Pista: '));
          hint.appendChild(_lpEditable(blank.hint, function(v){ blank.hint = v; }));
          stack.appendChild(box); stack.appendChild(hint); line.appendChild(stack);
        } else {
          line.appendChild(box);
        }
      }
    });
    wrap.appendChild(line);
  });
  if (content.distractors && content.distractors.length) {
    var dl = document.createElement('div'); dl.className = 'lp-instr'; dl.style.marginTop = '12px'; dl.textContent = 'Distractores';
    wrap.appendChild(dl);
    var dbank = document.createElement('div'); dbank.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
    content.distractors.forEach(function(d, di){
      var chip = document.createElement('span'); chip.className = 'lp-input wrong'; chip.style.margin = '2px';
      chip.appendChild(_lpEditable(d, function(v){ content.distractors[di] = v; }));
      dbank.appendChild(chip);
    });
    wrap.appendChild(dbank);
  }
  return wrap;
}
function _lpEditMC(content, activity){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  if (content.readingText !== undefined && content.readingText !== null) {
    var rt = document.createElement('div'); rt.className = 'lp-text';
    rt.appendChild(_lpEditable(content.readingText || '', function(v){ content.readingText = v; }));
    wrap.appendChild(rt);
  }
  (content.questions||[]).forEach(function(q, qi){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var qrow = document.createElement('div'); qrow.className = 'lp-mc-q';
    var num = document.createElement('span'); num.className = 'lp-mc-num'; num.textContent = String(qi+1);
    var qt = document.createElement('span'); qt.style.flex = '1';
    qt.appendChild(_lpEditable(q.text || q.q || '', function(v){ q.text = v; }));
    qrow.appendChild(num); qrow.appendChild(qt); block.appendChild(qrow);
    var opts = q.opts || [];
    var correctIdx = q.correct !== undefined ? q.correct : (q.ans || 0);
    var ow = document.createElement('div'); ow.className = 'lp-mc-opts';
    opts.forEach(function(o, oi){
      var b = document.createElement('div'); b.className = 'lp-mc-opt' + (oi === correctIdx ? ' correct' : '');
      b.appendChild(_lpEditable(o, function(v){ q.opts[oi] = v; }));
      ow.appendChild(b);
    });
    block.appendChild(ow);
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpEditMatch(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.pairs||[]).forEach(function(p){
    var row = document.createElement('div'); row.style.cssText = 'display:flex;gap:12px;margin-bottom:8px;align-items:center';
    var left = document.createElement('div'); left.className = 'lp-mc-opt'; left.style.flex = '1';
    left.appendChild(_lpEditable(p.left || '', function(v){ p.left = v; }));
    var right = document.createElement('div'); right.className = 'lp-mc-opt'; right.style.flex = '1';
    right.appendChild(_lpEditable(p.right || '', function(v){ p.right = v; }));
    row.appendChild(left); row.appendChild(right);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpEditTrueFalse(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.statements||[]).forEach(function(s){
    var block = document.createElement('div'); block.className = 'lp-mc-block';
    var row = document.createElement('div'); row.className = 'lp-mc-q';
    row.appendChild(_lpEditable(s.text || '', function(v){ s.text = v; }));
    block.appendChild(row);
    var tag = document.createElement('span'); tag.className = 'lp-mc-opt' + (s.correct ? ' correct' : ' wrong'); tag.style.display = 'inline-block';
    tag.textContent = s.correct ? 'Verdadero' : 'Falso';
    block.appendChild(tag);
    wrap.appendChild(block);
  });
  return wrap;
}
function _lpEditOrder(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  (content.events||[]).forEach(function(ev, i){
    var row = document.createElement('div'); row.className = 'lp-sentence';
    row.appendChild(document.createTextNode((i+1) + '. '));
    row.appendChild(_lpEditable(ev, function(v){ content.events[i] = v; }));
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpEditVocab(content){
  var wrap = document.createElement('div');
  _lpEditInstr(content, wrap);
  var grid = document.createElement('div'); grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
  (content.wordList||[]).forEach(function(w, i){
    var heard = (content.wordsHeard || []).indexOf(w) !== -1;
    var chip = document.createElement('span'); chip.className = 'lp-mc-opt' + (heard ? ' correct' : '');
    chip.appendChild(_lpEditable(w, function(v){ content.wordList[i] = v; }));
    grid.appendChild(chip);
  });
  wrap.appendChild(grid);
  return wrap;
}
// -- _lpAdapt ----------------------------------------------
// F1+F4 del motor unificado (docs/blueprint-motor-unificado.md, seccion 3).
// activity -> content v2 { version:2, stimulus, questions:[...] } o { version:2, task, ... }.
// No toca DOM ni DB. El content viejo NO se migra en la base: se traduce en memoria al rendir.
// F4 (write-through de edit): los bloques SON los objetos originales del content viejo
// (el adaptador les anota id/type encima; idempotente) o llevan referencia _srcObj/_srcField.
// Asi editar por el motor escribe sobre el objeto que admin guarda. Los campos id/type
// que puedan persistirse al guardar son inofensivos para los lectores legacy.
// qids: secuenciales deterministas en el orden de iteracion actual (solo compatibilidad;
// la identidad estable real nace con el creador v2 - decision D1).
// Sello de compatibilidad: el orden de bloques respeta el orden de detail() del motor viejo.
function _lpAdapt(activity) {
  activity = activity || {};
  var content = {};
  try { content = typeof activity.content === 'string' ? JSON.parse(activity.content) : (activity.content || {}); } catch(e) {}
  if (content.version === 2) return content;
  var type = activity.type || content.type || 'mc';
  var n = 0;
  function qid() { n++; return 'q' + n; }

  function stimText(text, srcObj, srcField) { return { type: 'text', text: text, _srcObj: srcObj, _srcField: srcField }; }
  function stimNone() { return { type: 'none' }; }
  function stimAudio(c) {
    var audioUrl = c.audioUrl || c.audio_url || '';
    var youtubeUrl = c.youtubeUrl || c.youtube_url || '';
    var title = c.audioTitle || c.title || 'Audio';
    if (youtubeUrl) return { type: 'video', youtubeUrl: youtubeUrl, title: title };
    if (c.isVideo) return { type: 'video', driveUrl: audioUrl, title: title };
    return { type: 'audio', url: audioUrl, title: title };
  }

  function mapFillSentences(sentences, out) {
    (sentences || []).forEach(function(s) {
      s.id = qid();
      s.type = (!s.hasBlank || !s.parts) ? 'text' : 'fillblank';
      out.push(s);
    });
  }
  function mapQuestions(questions, out) {
    (questions || []).forEach(function(q) {
      q.id = qid();
      q.type = (q.type === 'open') ? 'open' : 'mc';
      out.push(q);
    });
  }
  function mapStatements(statements, out) {
    (statements || []).forEach(function(s) {
      s.id = qid();
      s.type = 'truefalse';
      out.push(s);
    });
  }

  var v2 = { version: 2, _srcObj: content };
  if (content.instructions) v2.instructions = content.instructions;

  if (type === 'drag-drop') {
    v2.task = 'drag-drop';
    v2.sentences = content.sentences || [];
    v2.distractors = content.distractors || [];
    return v2;
  }
  if (type === 'match') {
    v2.task = 'match';
    v2.pairs = content.pairs || [];
    return v2;
  }

  var qs = [];
  if (type === 'fill-blank' || type === 'dropdown') {
    v2.stimulus = stimNone();
    mapFillSentences(content.sentences, qs);
  } else if (type === 'mc' || type === 'reading') {
    var readingText = content.readingText || activity.reading_text || '';
    v2.stimulus = readingText ? stimText(readingText, content, 'readingText') : stimNone();
    mapQuestions(content.questions, qs);
  } else if (type === 'mixed') {
    v2.stimulus = stimNone();
    (content.sections || []).forEach(function(sec) {
      if (sec.title) qs.push({ id: qid(), type: 'heading', text: sec.title, _srcObj: sec, _srcField: 'title' });
      if (sec.instructions) qs.push({ id: qid(), type: 'text', text: sec.instructions, _srcObj: sec, _srcField: 'instructions' });
      if (sec.type === 'fill-blank' || sec.type === 'drag-drop') mapFillSentences(sec.sentences, qs);
      else if (sec.type === 'mc' || sec.type === 'truefalse') mapQuestions(sec.questions, qs);
    });
  } else if (type === 'audio') {
    v2.stimulus = stimAudio(content);
    var subtype = content.audioType || content.subtype || 'comprehension';
    if (subtype === 'comprehension' || subtype === 'mc') mapQuestions(content.questions, qs);
    else if (subtype === 'fillblank') mapFillSentences(content.sentences, qs);
    else if (subtype === 'dictation') qs.push({ id: qid(), type: 'open', text: 'Dictado', rows: 6, placeholder: 'Escribe lo que escuchas...' });
    else if (subtype === 'truefalse') mapStatements(content.statements, qs);
    else if (subtype === 'order') qs.push({ id: qid(), type: 'order', events: content.events || [] });
    else if (subtype === 'vocab') qs.push({ id: qid(), type: 'vocab', wordList: content.wordList || [], wordsHeard: content.wordsHeard || [] });
  } else {
    v2.stimulus = stimNone();
  }
  v2.questions = qs;
  return v2;
}

// -- Motor unificado F2: registros + compositor -------------
// (docs/blueprint-motor-unificado.md, secciones 1 y 4)
// LegoQ / LegoStimulus / LegoTask son REGISTROS: agregar un tipo = registrar una entrada.
// NUNCA reintroducir if(type === ...) en el core - tipo desconocido degrada a LegoEmpty.
// Las piezas nacen como WRAPPERS de los trios actuales (_lpX / _lpReviewX / _lpEditX) - snap-in:
// cero logica de juego reescrita. La fusion interna de cada trio es F4.
// _lpCompose solo se activa desde LegoPlayer cuando content.version === 2.
// Contrato de pieza: maker(data, ctx) -> { el, score(), detail() }
//   ctx: { mode:'play'|'review'|'edit', config:{feedback}, onChange, saved, num }
//   score() -> objeto extensible { correct, total, ... }
//   detail() -> [ { qid, part, key, questionText, answer, isCorrect } ]

function _lpZero(){ return { correct: 0, total: 0 }; }
function _lpNone(){ return []; }
function _lpStrip(node, selector){
  var el = node.querySelector(selector);
  if (el && el.parentNode) el.parentNode.removeChild(el);
  return node;
}
function _lpSetNum(node, num){
  if (!num) return node;
  var el = node.querySelector('.lp-mc-num');
  if (el) el.textContent = String(num);
  return node;
}
function _lpSubState(ctx){
  var st = { answers: {}, score: _lpZero, detail: _lpNone };
  st.feedback = !(ctx && ctx.config && ctx.config.feedback === false);
  return st;
}
function _lpTagQid(rows, qid){
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    out.push({ qid: qid, part: i, key: rows.length > 1 ? qid + '-' + i : qid, questionText: r.questionText, answer: r.answer, isCorrect: r.isCorrect });
  }
  return out;
}
function _lpRowCount(b){
  if (b.type === 'fillblank') return (b.blanks || []).length;
  if (b.type === 'order') return (b.events || []).length;
  if (b.type === 'text' || b.type === 'heading') return 0;
  return 1;
}

function _lpMissingAnswers(rows){
  return (rows || []).filter(function(r){
    if (!r) return false;
    if (r.isCorrect === null && !r.questionText && !r.key) return false;
    return String(r.answer || '').trim() === '';
  });
}

var LegoQ = {};
LegoQ.mc = function(b, ctx){
  var mini = { questions: [b] };
  if (ctx.mode === 'review') return { el: _lpSetNum(_lpStrip(_lpReviewMC(mini, null, ctx.saved || []), '.lp-score'), ctx.num), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpSetNum(_lpStrip(_lpEditMC(mini, null), '.lp-instr'), ctx.num), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpSetNum(_lpMC(mini, null, st, ctx.onChange), ctx.num);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return _lpTagQid(st.detail(), b.id); } };
};
LegoQ.open = function(b, ctx){
  var piece = LegoQ.mc(b, ctx);
  var ta = piece.el.querySelector('textarea');
  if (ta) {
    if (b.rows) ta.rows = b.rows;
    if (b.placeholder) ta.placeholder = b.placeholder;
  }
  return piece;
};
LegoQ.truefalse = function(b, ctx){
  var mini = { statements: [b] };
  if (ctx.mode === 'review') return { el: _lpSetNum(_lpStrip(_lpReviewTrueFalse(mini, ctx.saved || []), '.lp-score'), ctx.num), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpStrip(_lpEditTrueFalse(mini), '.lp-instr'), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpSetNum(_lpTrueFalse(mini, st, ctx.onChange), ctx.num);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return _lpTagQid(st.detail(), b.id); } };
};
LegoQ.fillblank = function(b, ctx){
  var mini = { sentences: [ { parts: b.parts, blanks: b.blanks, hasBlank: true } ] };
  var isDropdown = false;
  (b.blanks || []).forEach(function(bl){ if ((bl.options || []).length) isDropdown = true; });
  if (ctx.mode === 'review') return { el: _lpStrip(_lpStrip(_lpReviewFillBlank(mini, ctx.saved || []), '.lp-score'), '.lp-instr'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpStrip(_lpEditFillBlank(mini), '.lp-instr'), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpStrip(_lpStrip(_lpFillBlank(mini, isDropdown, st, ctx.onChange), '.lp-instr'), '.lp-legend');
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return _lpTagQid(st.detail(), b.id); } };
};
LegoQ.order = function(b, ctx){
  var mini = { events: b.events || [] };
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewOrder(mini, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpStrip(_lpEditOrder(mini), '.lp-instr'), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpStrip(_lpOrder(mini, st, ctx.onChange), '.lp-instr');
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return _lpTagQid(st.detail(), b.id); } };
};
LegoQ.vocab = function(b, ctx){
  var mini = { wordList: b.wordList || [], wordsHeard: b.wordsHeard || [] };
  if (ctx.mode === 'review') return { el: _lpReviewVocab(mini, ctx.saved || []), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpStrip(_lpEditVocab(mini), '.lp-instr'), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpStrip(_lpVocab(mini, st, ctx.onChange), '.lp-instr');
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return _lpTagQid(st.detail(), b.id); } };
};
LegoQ.text = function(b, ctx){
  var p = document.createElement('p');
  p.className = 'lp-sentence';
  if (ctx.mode === 'edit') p.appendChild(_lpEditable(b.text || '', function(v){ b.text = v; if (b._srcObj && b._srcField) b._srcObj[b._srcField] = v; }));
  else p.textContent = b.text || '';
  return { el: p, score: _lpZero, detail: _lpNone };
};
LegoQ.heading = function(b, ctx){
  var t = document.createElement('div');
  t.style.cssText = 'font-size:13px;font-weight:700;color:var(--ink);margin:18px 0 12px;display:flex;align-items:center;gap:8px';
  var n = document.createElement('span');
  n.style.cssText = 'background:var(--orange);color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0';
  n.textContent = String(ctx.num || '');
  var tt = document.createElement('span');
  if (ctx.mode === 'edit') tt.appendChild(_lpEditable(b.text || '', function(v){ b.text = v; if (b._srcObj && b._srcField) b._srcObj[b._srcField] = v; }));
  else tt.textContent = b.text || '';
  t.appendChild(n); t.appendChild(tt);
  return { el: t, score: _lpZero, detail: _lpNone };
};

var LegoStimulus = {};
LegoStimulus.none = function(){ return null; };
LegoStimulus.text = function(d, ctx){
  var t = document.createElement('div');
  t.className = 'lp-text';
  if (ctx.mode === 'edit') t.appendChild(_lpEditable(d.text || '', function(v){ d.text = v; if (d._srcObj && d._srcField) d._srcObj[d._srcField] = v; }));
  else t.textContent = d.text || '';
  return t;
};
LegoStimulus.audio = function(d){
  return _lpAudioControls({ audioUrl: d.url || '', audioTitle: d.title || 'Audio' });
};
LegoStimulus.video = function(d){
  if (d.youtubeUrl) return _lpAudioControls({ youtubeUrl: d.youtubeUrl });
  return _lpAudioControls({ audioUrl: d.driveUrl || '', isVideo: true, audioTitle: d.title || 'Video' });
};

var LegoTask = {};
LegoTask['drag-drop'] = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewDragDrop(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditFillBlank(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpDragDrop(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};
LegoTask.match = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewMatch(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditMatch(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpMatch(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};

function _lpCompose(activity, content, opts){
  opts = opts || {};
  if (opts.fcMode && content.task === 'flashcard') content.mode = opts.fcMode;
  var rawMode = opts.mode || 'play';
  var mode = (rawMode === 'review' || rawMode === 'edit') ? rawMode : 'play';
  var feedback = opts.feedback !== false;
  var onResult = typeof opts.onResult === 'function' ? opts.onResult : null;
  var saved = opts.saved || [];
  var root = document.createElement('div');
  root.className = 'lego-player';
  if (!feedback) root.classList.add('lp-nofeedback');
  var pieces = [];
  var scoreEl = document.createElement('div');
  scoreEl.className = 'lp-score';
  function refreshScore(){
    var c = 0, t = 0;
    pieces.forEach(function(p){ var s = p.score(); c += s.correct; t += s.total; });
    scoreEl.textContent = c + '/' + (t || '?');
    if (typeof opts.onProgress === 'function') { try { opts.onProgress(); } catch(e){} }
  }
  var cfg = { feedback: feedback };
  var inner = document.createElement('div');

  if (content.task) {
    var makerT = LegoTask[content.task];
    var pieceT = makerT
      ? makerT(content, { mode: mode, config: cfg, onChange: refreshScore, saved: saved })
      : { el: LegoEmpty({ text: 'Tarea "' + content.task + '" no registrada.' }), score: _lpZero, detail: _lpNone };
    pieces.push(pieceT);
    inner.appendChild(pieceT.el);
    if (mode === 'play' && saved.length) _lpRestorePiece(pieceT.el, saved, content.task);
  } else {
    if (mode === 'edit') {
      var ei = document.createElement('div');
      ei.className = 'lp-instr';
      ei.appendChild(_lpEditable(content.instructions || '', function(v){ content.instructions = v; if (content._srcObj) content._srcObj.instructions = v; }));
      inner.appendChild(ei);
    } else if (content.instructions) {
      var gi = document.createElement('div');
      gi.className = 'lp-instr';
      gi.textContent = content.instructions;
      inner.appendChild(gi);
    }
    var hasTypedBlank = false;
    (content.questions || []).forEach(function(b){
      if (b.type !== 'fillblank') return;
      var opt = false;
      (b.blanks || []).forEach(function(bl){ if ((bl.options || []).length) opt = true; });
      if (!opt) hasTypedBlank = true;
    });
    if (mode === 'play' && feedback && hasTypedBlank) {
      var legend = document.createElement('div');
      legend.className = 'lp-legend';
      [ ['var(--green)', 'Correcto'], ['#DAA520', 'Falta tilde'], ['var(--red)', 'Incorrecto'] ].forEach(function(p2){
        var sp = document.createElement('span');
        sp.style.color = p2[0];
        sp.textContent = p2[1];
        legend.appendChild(sp);
      });
      inner.appendChild(legend);
    }
    var cursor = 0, qNum = 0, hNum = 0;
    (content.questions || []).forEach(function(b){
      var maker = LegoQ[b.type];
      var count = _lpRowCount(b);
      var mySaved = [];
      if (mode === 'review' || mode === 'play') {
        for (var i = 0; i < saved.length; i++) { if (saved[i] && saved[i].qid && saved[i].qid === b.id) mySaved.push(saved[i]); }
        if (!mySaved.length && count) mySaved = saved.slice(cursor, cursor + count);
      }
      cursor += count;
      var num = null;
      if (b.type === 'heading') { hNum++; num = hNum; }
      else if (b.type === 'mc' || b.type === 'open' || b.type === 'truefalse') { qNum++; num = qNum; }
      var piece = maker
        ? maker(b, { mode: mode, config: cfg, onChange: refreshScore, saved: mySaved, num: num })
        : { el: LegoEmpty({ text: 'Tipo "' + b.type + '" no registrado.' }), score: _lpZero, detail: _lpNone };
      pieces.push(piece);
      inner.appendChild(piece.el);
      if (mode === 'play' && mySaved.length) _lpRestorePiece(piece.el, mySaved, b.type);
    });
  }

  if (!content.task && pieces.length === 0) inner.appendChild(LegoEmpty({ text: 'Actividad sin contenido compatible con el motor.' }));
  var bodyContent = inner;
  if (!content.task) {
    var stimD = content.stimulus || { type: 'none' };
    var sMaker = LegoStimulus[stimD.type] || LegoStimulus.none;
    var stimEl = sMaker(stimD, { mode: mode });
    if (stimEl) bodyContent = (stimD.type === 'video') ? _lpVSplit(stimEl, inner) : _lpSplit(stimEl, inner);
  }

  if (mode === 'review') {
    root.appendChild(_lpReviewScoreHeader(saved));
  } else if (mode === 'play' && feedback) {
    root.appendChild(scoreEl);
  }
  var lpBody = document.createElement('div');
  lpBody.className = 'lp-body';
  lpBody.appendChild(bodyContent);
  root.appendChild(lpBody);
  refreshScore();

  root.getProgress = function(){ var all = []; pieces.forEach(function(p){ (p.detail() || []).forEach(function(r){ all.push(r); }); }); return all; };
  if (rawMode === 'play') {
    var submitMsg = document.createElement('div');
    submitMsg.className = 'lp-submit-msg';
    var submit = document.createElement('button');
    submit.className = 'btn btn-coral';
    submit.style.marginTop = '16px';
    submit.style.flexShrink = '0';
    submit.textContent = opts.submitLabel || 'Enviar respuestas';
    submit.onclick = function(){
      var c = 0, t = 0, all = [];
      pieces.forEach(function(p){
        var s = p.score();
        c += s.correct; t += s.total;
        p.detail().forEach(function(r){ all.push(r); });
      });
      var missing = _lpMissingAnswers(all);
      if (missing.length) {
        submitMsg.textContent = 'Responde todos los espacios antes de enviar.';
        if (lpBody && lpBody.scrollIntoView) lpBody.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
      submitMsg.textContent = '';
      submit.disabled = true;
      if (onResult) onResult({ type: activity.type || 'v2', score: c, total: t, answers: all });
    };
    if (typeof opts.onPause === 'function') {
      var pauseBtn = document.createElement('button');
      pauseBtn.type = 'button';
      pauseBtn.textContent = 'Pausar';
      pauseBtn.style.cssText = 'flex:1;padding:11px;border-radius:10px;border:1px solid var(--red);background:var(--red-lt);color:var(--red);font:inherit;font-size:15px;font-weight:700;cursor:pointer';
      pauseBtn.onclick = function(){ try { opts.onPause(root.getProgress()); } catch(e){} };
      submit.className = '';
      submit.style.cssText = 'flex:1;padding:11px;border-radius:10px;border:none;background:var(--green);color:#fff;font:inherit;font-size:15px;font-weight:700;cursor:pointer';
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;gap:10px;margin-top:16px;flex-shrink:0';
      bar.appendChild(pauseBtn);
      bar.appendChild(submit);
      root.appendChild(bar);
      root.appendChild(submitMsg);
    } else {
      root.appendChild(submit);
      root.appendChild(submitMsg);
    }
  }
  return root;
}


// -- _lpVSplit ---------------------------------------------
// Layout estimulo+preguntas para VIDEO (55% pantalla), extraido del que _lpAudio inyecta.
// Mismo id de estilos 'lego-vsplit-styles': se inyecta una vez, gane quien gane la carrera.
function _lpVSplit(stim, qs){
  if (!document.getElementById('lego-vsplit-styles')) {
    var vsp = document.createElement('style'); vsp.id = 'lego-vsplit-styles';
    vsp.textContent = '.lp-vsplit-c{container-type:inline-size;height:100%;min-height:0}.lp-vsplit{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}.lp-vsplit-stim{flex:0 0 auto}.lp-vsplit-qs{flex:1 1 auto;min-height:0;overflow:auto}@container (min-width:600px){.lp-vsplit{flex-direction:row;align-items:stretch}.lp-vsplit-stim{flex:0 0 55%;align-self:flex-start}.lp-vsplit-qs{height:100%}}';
    document.head.appendChild(vsp);
  }
  var vc = document.createElement('div'); vc.className = 'lp-vsplit-c';
  var vbox = document.createElement('div'); vbox.className = 'lp-vsplit';
  var va = document.createElement('div'); va.className = 'lp-vsplit-stim'; va.appendChild(stim);
  var vb = document.createElement('div'); vb.className = 'lp-vsplit-qs'; vb.appendChild(qs);
  vbox.appendChild(va); vbox.appendChild(vb);
  vc.appendChild(vbox);
  return vc;
}


// -- reanudar (restore) -------------------------------------
// Re-aplica respuestas guardadas sobre el DOM YA construido, por replay de eventos:
// mismo code-path que el usuario, sin tocar los _lp*. NUNCA lanza (try/catch por tipo);
// si una pieza no restaura, queda sin responder y el estudiante la re-hace. Agnostico al
// almacenamiento (sirve localStorage o DB). Las respuestas van por qid estable (motor F1-F6).
function _lpFire(el, type){ var ev = document.createEvent('Event'); ev.initEvent(type, true, false); el.dispatchEvent(ev); }
function _lpRestorePiece(el, saved, type){
  if (!el || !saved || !saved.length) return;
  try {
    if (type === 'mc' || type === 'open' || type === 'truefalse') {
      var ta = el.querySelector('textarea.lp-open');
      if (ta) { ta.value = saved[0].answer || ''; _lpFire(ta, 'input'); return; }
      var ans = saved[0].answer;
      var opts = el.querySelectorAll('.lp-mc-opt');
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].textContent === ans && !opts[i].disabled) { opts[i].click(); break; }
      }
      return;
    }
    if (type === 'fillblank' || type === 'dropdown') {
      var inputs = el.querySelectorAll('.lp-input');
      saved.forEach(function(row, k){
        var idx = (row.part != null) ? row.part : k;
        var inp = inputs[idx];
        if (!inp) return;
        inp.value = row.answer || '';
        _lpFire(inp, inp.tagName === 'SELECT' ? 'change' : 'input');
      });
      return;
    }
    if (type === 'order') {
      saved.slice().sort(function(a, b){ return (a.part || 0) - (b.part || 0); }).forEach(function(row){
        var items = el.querySelectorAll('.lp-order-item');
        for (var i = 0; i < items.length; i++) {
          if (items[i].textContent === row.answer && !items[i].classList.contains('placed')) { items[i].click(); break; }
        }
      });
      return;
    }
    if (type === 'vocab') {
      var words = (saved[0].answer || '').split(',').map(function(w){ return w.trim(); }).filter(Boolean);
      var vb = el.querySelectorAll('.lp-vocab-word');
      words.forEach(function(w){
        for (var i = 0; i < vb.length; i++) {
          if (vb[i].textContent === w && !vb[i].classList.contains('selected')) { vb[i].click(); break; }
        }
      });
      return;
    }
    if (type === 'match') {
      var lefts = el.querySelectorAll('.lp-match-grid > div:first-child .lp-match-item');
      saved.forEach(function(row, k){
        var li = (row.part != null) ? row.part : k;
        var leftEl = lefts[li];
        if (!leftEl || leftEl.dataset.matched) return;
        leftEl.click();
        var rights = el.querySelectorAll('.lp-match-grid > div:last-child .lp-match-item');
        for (var i = 0; i < rights.length; i++) {
          if (rights[i].textContent === row.answer && !rights[i].dataset.matched) { rights[i].click(); break; }
        }
      });
      return;
    }
    if (type === 'drag-drop') {
      var blanks = el.querySelectorAll('.lp-dnd-blank');
      saved.forEach(function(row, k){
        var idx = (row.part != null) ? row.part : k;
        var blank = blanks[idx];
        if (!blank || !blank._lpPlace) return;
        var bankEls = el.querySelectorAll('.lp-dnd-word');
        var src = null;
        for (var i = 0; i < bankEls.length; i++) {
          if (bankEls[i].textContent === row.answer && !bankEls[i].classList.contains('used')) { src = bankEls[i]; break; }
        }
        blank._lpPlace(row.answer, src);
      });
      return;
    }
  } catch(e) {}
}


// -- LegoTask: flashcard + memory ---------------------------
// Piezas auto-contenidas (la mecanica ES la tarea), mismo contrato {el,score,detail} que
// drag-drop/match. Formato unificado: pairs:[{left,right}] (izq=frente/termino, der=reverso/significado)
// -> una lista de vocabulario alimenta match, memory y flashcard sin transformar.
// Sellado: createElement + textContent, cero HTML crudo. CSS inyectado una vez.
function _lpPairFront(p){ return (p && (p.left != null ? p.left : p.front)) || ''; }
function _lpPairBack(p){ return (p && (p.right != null ? p.right : p.back)) || ''; }
function _lpPairAccepted(p){ return (p && Array.isArray(p.accepted)) ? p.accepted : []; }
function _lpPairBackLines(p){ return (p && Array.isArray(p.backLines)) ? p.backLines : []; }

function _lpRenderFlashcardBack(card, pair){
  var lines = _lpPairBackLines(pair);
  if (!lines.length) {
    card.textContent = _lpPairBack(pair);
    return;
  }
  var list = document.createElement('div'); list.className = 'lp-fc-senses';
  lines.forEach(function(line){
    var data = (line && typeof line === 'object') ? line : { meaning: String(line || '') };
    var row = document.createElement('div'); row.className = 'lp-fc-sense';
    var meaning = document.createElement('div'); meaning.className = 'lp-fc-sense-main'; meaning.textContent = data.meaning || '';
    row.appendChild(meaning);
    if (data.context) {
      var context = document.createElement('div'); context.className = 'lp-fc-sense-context'; context.textContent = data.context; row.appendChild(context);
    }
    if (data.example) {
      var example = document.createElement('div'); example.className = 'lp-fc-sense-example'; example.textContent = data.example; row.appendChild(example);
    }
    list.appendChild(row);
  });
  card.replaceChildren(list);
}

function _lpFlashcardStyles(){
  if (document.getElementById('lego-fc-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-fc-styles';
  st.textContent = '.lp-fc{display:flex;flex-direction:column;align-items:center;gap:14px}.lp-fc-prog{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.lp-fc-card{width:100%;max-width:340px;min-height:150px;border:1.5px solid var(--border);border-radius:14px;background:var(--white);display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:20px;cursor:pointer;user-select:none;box-shadow:0 4px 14px rgba(0,0,0,.06)}.lp-fc-card.back{background:var(--sand);font-size:18px}.lp-fc-senses{width:100%;display:flex;flex-direction:column;gap:10px;text-align:left}.lp-fc-sense{padding-bottom:9px;border-bottom:1px solid var(--border)}.lp-fc-sense:last-child{padding-bottom:0;border-bottom:0}.lp-fc-sense-main{font-size:18px;font-weight:800;color:var(--ink)}.lp-fc-sense-context{margin-top:2px;font-size:13px;color:var(--ink-soft)}.lp-fc-sense-example{margin-top:3px;font-size:12px;font-style:italic;color:var(--muted)}.lp-fc-hint{font-size:11px;color:var(--muted);min-height:14px}.lp-fc-rate{display:flex;gap:10px}.lp-fc-btn{padding:9px 18px;border-radius:10px;border:1px solid var(--border);background:var(--white);font:inherit;font-size:14px;cursor:pointer}.lp-fc-btn.know{border-color:var(--green);color:var(--green)}.lp-fc-btn.dunno{border-color:var(--red);color:var(--red)}.lp-fc-done{font-size:16px;color:var(--ink);text-align:center}';
  document.head.appendChild(st);
}
function _lpFlashcard(content, state, refreshScore){ if ((content.mode || 'flip') === 'write') return _lpFlashcardWrite(content, state, refreshScore);
  _lpFlashcardStyles();
  var answers = state.answers;
  var pairs = content.pairs || content.cards || [];
  var wrap = document.createElement('div'); wrap.className = 'lp-fc';
  if (content.instructions){ var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions; wrap.appendChild(instr); }
  var prog = document.createElement('div'); prog.className = 'lp-fc-prog';
  var card = document.createElement('div'); card.className = 'lp-fc-card';
  var hint = document.createElement('div'); hint.className = 'lp-fc-hint';
  var rate = document.createElement('div'); rate.className = 'lp-fc-rate';
  var bKnow = document.createElement('button'); bKnow.type = 'button'; bKnow.className = 'lp-fc-btn know'; bKnow.textContent = 'Lo sé';
  var bDunno = document.createElement('button'); bDunno.type = 'button'; bDunno.className = 'lp-fc-btn dunno'; bDunno.textContent = 'No lo sé';
  rate.appendChild(bKnow); rate.appendChild(bDunno);
  var idx = 0, flipped = false;
  function draw(){
    if (idx >= pairs.length){
      prog.textContent = pairs.length + ' / ' + pairs.length;
      card.className = 'lp-fc-card'; card.textContent = '';
      var done = document.createElement('div'); done.className = 'lp-fc-done'; done.textContent = 'Terminaste las ' + pairs.length + ' tarjetas.';
      card.appendChild(done);
      hint.textContent = ''; rate.style.display = 'none'; card.style.cursor = 'default';
      return;
    }
    flipped = false;
    prog.textContent = (idx + 1) + ' / ' + pairs.length;
    card.className = 'lp-fc-card'; card.textContent = _lpPairFront(pairs[idx]);
    hint.textContent = 'Toca la tarjeta para ver el significado';
    rate.style.display = 'none';
  }
  card.addEventListener('click', function(){
    if (idx >= pairs.length || flipped) return;
    flipped = true;
    card.className = 'lp-fc-card back'; _lpRenderFlashcardBack(card, pairs[idx]);
    hint.textContent = '¿La sabías?';
    rate.style.display = 'flex';
  });
  function rateCard(known){
    if (idx >= pairs.length) return;
    answers['fc-' + idx] = { known: known, answer: known ? 'Lo sé' : 'No lo sé' };
    idx++; refreshScore(); draw();
  }
  bKnow.onclick = function(){ rateCard(true); };
  bDunno.onclick = function(){ rateCard(false); };
  wrap.appendChild(prog); wrap.appendChild(card); wrap.appendChild(hint); wrap.appendChild(rate);
  draw();
  state.score = function(){ var c = 0, t = pairs.length; for (var i = 0; i < pairs.length; i++){ var a = answers['fc-' + i]; if (a && a.known) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return pairs.map(function(p, i){ var a = answers['fc-' + i] || {}; return { key: 'fc-' + i, questionText: _lpPairFront(p), answer: a.answer || '(sin ver)', isCorrect: a.known === undefined ? null : !!a.known }; }); };
  return wrap;
}

function _lpTrueFalseVocabStyles(){
  if (document.getElementById('lego-tfv-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-tfv-styles';
  st.textContent = '.lp-tfv{display:flex;flex-direction:column;align-items:center;gap:14px}.lp-tfv-prog{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.lp-tfv-card{width:100%;max-width:460px;min-height:160px;border:1.5px solid var(--border);border-radius:14px;background:var(--white);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px;gap:10px;box-shadow:0 4px 14px rgba(0,0,0,.06)}.lp-tfv-term{font-size:24px;font-weight:800;color:var(--ink);overflow-wrap:anywhere}.lp-tfv-eq{font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.lp-tfv-meaning{font-size:20px;font-weight:600;color:var(--ink-soft);overflow-wrap:anywhere}.lp-tfv-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}.lp-tfv-btn{padding:10px 18px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);font:inherit;font-size:14px;font-weight:700;cursor:pointer}.lp-tfv-btn.yes{border-color:var(--green);color:var(--green)}.lp-tfv-btn.no{border-color:var(--red);color:var(--red)}.lp-tfv-fb{font-size:13px;min-height:18px;text-align:center;font-weight:700}.lp-tfv-done{font-size:16px;color:var(--ink);text-align:center}';
  document.head.appendChild(st);
}
function _lpTrueFalseRounds(content){
  var pairs = (content.pairs || []).filter(function(p){ return _lpPairFront(p) && _lpPairBack(p); });
  var rounds = [];
  if (pairs.length < 2) return rounds;
  pairs.forEach(function(p, i){
    rounds.push({ pair: i, term: _lpPairFront(p), meaning: _lpPairBack(p), shown: _lpPairBack(p), expected: true });
    var j = (i + 1) % pairs.length;
    if (_lpPairBack(pairs[j]) === _lpPairBack(p)) j = (i + 2) % pairs.length;
    rounds.push({ pair: i, term: _lpPairFront(p), meaning: _lpPairBack(p), shown: _lpPairBack(pairs[j]), expected: false });
  });
  rounds.sort(function(){ return Math.random() - 0.5; });
  var limit = Number(content.rounds) || rounds.length;
  return rounds.slice(0, Math.max(1, Math.min(limit, rounds.length)));
}
function _lpTrueFalseVocab(content, state, refreshScore){
  _lpTrueFalseVocabStyles();
  var answers = state.answers;
  var rounds = _lpTrueFalseRounds(content);
  var wrap = document.createElement('div'); wrap.className = 'lp-tfv';
  if (content.instructions){ var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions; wrap.appendChild(instr); }
  if (!rounds.length) {
    wrap.appendChild(LegoEmpty({ text: 'Necesitas al menos 2 pares para jugar Correcto o Incorrecto.' }));
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ return []; };
    return wrap;
  }
  var prog = document.createElement('div'); prog.className = 'lp-tfv-prog';
  var card = document.createElement('div'); card.className = 'lp-tfv-card';
  var term = document.createElement('div'); term.className = 'lp-tfv-term';
  var eq = document.createElement('div'); eq.className = 'lp-tfv-eq'; eq.textContent = 'significa';
  var meaning = document.createElement('div'); meaning.className = 'lp-tfv-meaning';
  card.replaceChildren(term, eq, meaning);
  var fb = document.createElement('div'); fb.className = 'lp-tfv-fb';
  var actions = document.createElement('div'); actions.className = 'lp-tfv-actions';
  var yes = document.createElement('button'); yes.type = 'button'; yes.className = 'lp-tfv-btn yes'; yes.textContent = 'Correcto';
  var no = document.createElement('button'); no.type = 'button'; no.className = 'lp-tfv-btn no'; no.textContent = 'Incorrecto';
  actions.replaceChildren(yes, no);
  var idx = 0, done = 0;
  function draw(){
    if (idx >= rounds.length) {
      prog.textContent = rounds.length + ' / ' + rounds.length;
      card.replaceChildren();
      var end = document.createElement('div'); end.className = 'lp-tfv-done'; end.textContent = 'Terminaste.';
      card.appendChild(end); fb.textContent = ''; actions.style.display = 'none'; return;
    }
    var r = rounds[idx];
    prog.textContent = (idx + 1) + ' / ' + rounds.length;
    term.textContent = r.term;
    meaning.textContent = r.shown;
    if (!card.contains(term)) card.replaceChildren(term, eq, meaning);
    fb.textContent = '';
    actions.style.display = 'flex';
  }
  function choose(value){
    if (idx >= rounds.length) return;
    var r = rounds[idx];
    var ok = value === r.expected;
    answers['tfv-' + idx] = { answer: value ? 'Correcto' : 'Incorrecto', correct: ok, expected: r.expected, term: r.term, shown: r.shown, meaning: r.meaning };
    fb.style.color = ok ? 'var(--green)' : 'var(--red)';
    fb.textContent = ok ? 'Correcto' : ('Era ' + (r.expected ? 'correcto' : 'incorrecto') + ': ' + r.term + ' = ' + r.meaning);
    done++; refreshScore();
    idx++;
    setTimeout(draw, 650);
  }
  yes.onclick = function(){ choose(true); };
  no.onclick = function(){ choose(false); };
  wrap.appendChild(prog); wrap.appendChild(card); wrap.appendChild(fb); wrap.appendChild(actions);
  draw();
  state.score = function(){ var c = 0; for (var i = 0; i < rounds.length; i++){ var a = answers['tfv-' + i]; if (a && a.correct) c++; } return { correct: c, total: rounds.length }; };
  state.detail = function(){ return rounds.map(function(r, i){ var a = answers['tfv-' + i] || {}; return { key: 'tfv-' + i, questionText: r.term + ' = ' + r.shown, answer: a.answer || '(sin responder)', isCorrect: a.correct === undefined ? false : !!a.correct }; }); };
  return wrap;
}
function _lpLetterOrderStyles(){
  if (document.getElementById('lego-lo-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-lo-styles';
  st.textContent = '.lp-lo{display:flex;flex-direction:column;align-items:center;gap:14px}.lp-lo-prog{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.lp-lo-card{width:100%;max-width:500px;border:1.5px solid var(--border);border-radius:14px;background:var(--white);display:flex;flex-direction:column;align-items:center;text-align:center;padding:20px;gap:12px;box-shadow:0 4px 14px rgba(0,0,0,.06)}.lp-lo-clue{font-size:15px;font-weight:700;color:var(--ink-soft);overflow-wrap:anywhere}.lp-lo-answer{min-height:46px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center}.lp-lo-slot{min-width:32px;height:38px;border-bottom:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:var(--ink)}.lp-lo-bank{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}.lp-lo-tile{min-width:34px;height:36px;border:1.5px solid var(--border);border-radius:9px;background:var(--sand);font:inherit;font-size:17px;font-weight:800;color:var(--ink);cursor:pointer}.lp-lo-tile.ok{background:var(--green-lt);border-color:var(--green);color:var(--green)}.lp-lo-tile.bad{background:#FEE2E2;border-color:var(--red);color:var(--red)}.lp-lo-tile:disabled{opacity:1;cursor:default}.lp-lo-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.lp-lo-btn{padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--white);font:inherit;font-size:13px;font-weight:700;cursor:pointer}.lp-lo-btn.primary{border-color:var(--coral);background:var(--coral);color:#fff}.lp-lo-fb{font-size:13px;min-height:18px;text-align:center;font-weight:700}.lp-lo-done{font-size:16px;color:var(--ink);text-align:center}';
  document.head.appendChild(st);
}
function _lpLetterOrderRounds(content){
  var pairs = (content.pairs || []).filter(function(p){
    var target = p && p.target != null ? p.target : _lpPairBack(p);
    var clue = p && p.clue != null ? p.clue : _lpPairFront(p);
    return target && clue;
  });
  var rounds = pairs.map(function(p, i){
    var target = p && p.target != null ? p.target : _lpPairBack(p);
    var clue = p && p.clue != null ? p.clue : _lpPairFront(p);
    return { pair: i, term: String(target).trim(), clue: String(clue).trim() };
  }).filter(function(r){ return r.term.replace(/\s+/g, '').length > 1; });
  rounds.sort(function(){ return Math.random() - 0.5; });
  var limit = Number(content.rounds) || rounds.length;
  return rounds.slice(0, Math.max(1, Math.min(limit, rounds.length)));
}
function _lpShuffleLetters(text){
  var arr = Array.from(String(text || '').replace(/\s+/g, ''));
  var original = arr.join('');
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  if (arr.length > 2 && arr.join('') === original) {
    var first = arr[0]; arr[0] = arr[1]; arr[1] = first;
  }
  return arr;
}
function _lpLetterOrder(content, state, refreshScore){
  _lpLetterOrderStyles();
  var answers = state.answers;
  var rounds = _lpLetterOrderRounds(content);
  var wrap = document.createElement('div'); wrap.className = 'lp-lo';
  if (content.instructions){ var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions; wrap.appendChild(instr); }
  if (!rounds.length) {
    wrap.appendChild(LegoEmpty({ text: 'Necesitas palabras de al menos 2 letras para ordenar.' }));
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ return []; };
    return wrap;
  }
  function norm(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '').trim(); }
  var prog = document.createElement('div'); prog.className = 'lp-lo-prog';
  var card = document.createElement('div'); card.className = 'lp-lo-card';
  var clue = document.createElement('div'); clue.className = 'lp-lo-clue';
  var answer = document.createElement('div'); answer.className = 'lp-lo-answer';
  var bank = document.createElement('div'); bank.className = 'lp-lo-bank';
  var fb = document.createElement('div'); fb.className = 'lp-lo-fb';
  var actions = document.createElement('div'); actions.className = 'lp-lo-actions';
  var erase = document.createElement('button'); erase.type = 'button'; erase.className = 'lp-lo-btn'; erase.textContent = 'Borrar';
  var reset = document.createElement('button'); reset.type = 'button'; reset.className = 'lp-lo-btn'; reset.textContent = 'Reiniciar';
  var check = document.createElement('button'); check.type = 'button'; check.className = 'lp-lo-btn primary'; check.textContent = 'Comprobar';
  actions.replaceChildren(erase, reset, check);
  card.replaceChildren(answer, bank, fb, actions);
  var idx = 0, selected = [], tileButtons = [], checked = false;
  function targetChars(){ return Array.from(rounds[idx].term.replace(/\s+/g, '')); }
  function renderAnswer(){
    var chars = targetChars();
    answer.replaceChildren.apply(answer, chars.map(function(ch, i){
      var slot = document.createElement('div'); slot.className = 'lp-lo-slot'; slot.textContent = selected[i] ? selected[i].char : '';
      return slot;
    }));
  }
  function draw(){
    if (idx >= rounds.length) {
      prog.textContent = rounds.length + ' / ' + rounds.length;
      card.replaceChildren();
      var end = document.createElement('div'); end.className = 'lp-lo-done'; end.textContent = 'Terminaste.';
      card.appendChild(end); return;
    }
    checked = false; selected = []; tileButtons = [];
    var r = rounds[idx];
    prog.textContent = (idx + 1) + ' / ' + rounds.length;
    fb.textContent = '';
    bank.replaceChildren();
    _lpShuffleLetters(r.term).forEach(function(ch, i){
      var tile = document.createElement('button'); tile.type = 'button'; tile.className = 'lp-lo-tile'; tile.textContent = ch;
      tile.onclick = function(){
        if (checked || tile.disabled) return;
        var expected = targetChars()[selected.length] || '';
        if (norm(ch) === norm(expected)) {
          tile.classList.add('ok');
          tile.disabled = true;
          selected.push({ char: ch, tile: tile });
          fb.textContent = '';
          renderAnswer();
          return;
        }
        tile.classList.add('bad');
        setTimeout(function(){ tile.classList.remove('bad'); }, 450);
      };
      tileButtons.push(tile); bank.appendChild(tile);
    });
    if (!card.contains(answer)) card.replaceChildren(answer, bank, fb, actions);
    renderAnswer();
  }
  erase.onclick = function(){ if (checked || !selected.length) return; var last = selected.pop(); if (last && last.tile) { last.tile.disabled = false; last.tile.classList.remove('ok', 'bad'); } renderAnswer(); };
  reset.onclick = function(){ if (checked) return; selected.forEach(function(s){ if (s.tile) { s.tile.disabled = false; s.tile.classList.remove('ok', 'bad'); } }); selected = []; fb.textContent = ''; renderAnswer(); };
  check.onclick = function(){
    if (idx >= rounds.length || checked) return;
    var r = rounds[idx];
    var answerText = selected.map(function(s){ return s.char; }).join('');
    var ok = norm(answerText) === norm(r.term);
    answers['lo-' + idx] = { answer: answerText, correct: ok, term: r.term, clue: r.clue };
    fb.style.color = ok ? 'var(--green)' : 'var(--red)';
    fb.textContent = ok ? 'Correcto' : ('Respuesta: ' + r.term);
    checked = true; refreshScore();
    setTimeout(function(){ idx++; draw(); }, 750);
  };
  wrap.appendChild(prog); wrap.appendChild(card);
  draw();
  state.score = function(){ var c = 0; for (var i = 0; i < rounds.length; i++){ var a = answers['lo-' + i]; if (a && a.correct) c++; } return { correct: c, total: rounds.length }; };
  state.detail = function(){ return rounds.map(function(r, i){ var a = answers['lo-' + i] || {}; return { key: 'lo-' + i, questionText: r.clue, answer: a.answer || '(sin responder)', isCorrect: a.correct === undefined ? false : !!a.correct }; }); };
  return wrap;
}
function _lpMemoryStyles(){
  if (document.getElementById('lego-mem-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-mem-styles';
  st.textContent = '.lp-mem{display:flex;flex-direction:column;min-height:0}.lp-mem-round{font-size:12px;font-weight:700;color:var(--muted);text-align:center;margin-bottom:7px}.lp-mem-grid{display:grid;gap:8px;width:100%;max-width:560px;margin:0 auto;min-height:0}.lp-mem-card{min-width:0;min-height:0;border:1.5px solid var(--border);border-radius:10px;background:var(--coral);display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;font-size:13px;line-height:1.1;cursor:pointer;user-select:none;overflow:hidden;overflow-wrap:anywhere;word-break:break-word}.lp-mem-back{font-size:24px;font-weight:800;color:rgba(255,255,255,.8)}.lp-mem-face{display:none;max-width:100%;max-height:100%;color:var(--ink);font-weight:600;overflow-wrap:anywhere;word-break:break-word}.lp-mem-card.up{background:var(--white)}.lp-mem-card.up .lp-mem-face,.lp-mem-card.matched .lp-mem-face{display:block}.lp-mem-card.up .lp-mem-back,.lp-mem-card.matched .lp-mem-back{display:none}.lp-mem-card.matched{background:var(--green-lt);border-color:var(--green);color:var(--green);cursor:default}.lp-mem-card.matched .lp-mem-face{color:var(--green)}.lp-mem-finish{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:9px;min-height:18px}.lp-mem-done{font-size:13px;font-weight:700;color:var(--green);text-align:center}@media (max-width:520px){.lp-mem-grid{gap:5px}.lp-mem-card{border-radius:8px;padding:4px}.lp-mem-back{font-size:20px}}';
  document.head.appendChild(st);
}
function _lpMemoryRoundSize(pairs){
  var longest = 0;
  (pairs || []).forEach(function(pair){
    longest = Math.max(longest, String(_lpPairFront(pair)).length, String(_lpPairBack(pair)).length);
  });
  if (longest > 28) return 6;
  if (longest > 14) return 8;
  return 10;
}
function _lpMemory(content, state, refreshScore){
  _lpMemoryStyles();
  var answers = state.answers;
  var pairs = content.pairs || [];
  var wrap = document.createElement('div'); wrap.className = 'lp-mem';
  if (content.instructions){ var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions; wrap.appendChild(instr); }
  if (!pairs.length) {
    wrap.appendChild(LegoEmpty({ text: 'No hay pares para jugar Memory.' }));
    state.score = function(){ return { correct: 0, total: 0 }; };
    state.detail = function(){ return []; };
    return wrap;
  }
  var roundSize = _lpMemoryRoundSize(pairs);
  var rounds = [];
  for (var ri = 0; ri < pairs.length; ri += roundSize) {
    rounds.push(pairs.slice(ri, ri + roundSize).map(function(pair, offset){ return { pair: pair, index: ri + offset }; }));
  }
  var roundLabel = document.createElement('div'); roundLabel.className = 'lp-mem-round';
  var grid = document.createElement('div'); grid.className = 'lp-mem-grid';
  var finish = document.createElement('div'); finish.className = 'lp-mem-finish';
  var doneEl = document.createElement('div'); doneEl.className = 'lp-mem-done';
  var nextBtn = LegoButton({ label: 'Siguiente ronda', variant: 'primary', size: 'sm' }); nextBtn.style.display = 'none';
  finish.appendChild(doneEl); finish.appendChild(nextBtn);
  var roundIndex = 0, matchedCount = 0, activeCards = [];
  function fitFace(card){
    var face = card.querySelector('.lp-mem-face');
    if (!face || !card.classList.contains('up') && !card.classList.contains('matched')) return;
    var size = 13;
    face.style.fontSize = size + 'px';
    while (size > 7 && (face.scrollHeight > Math.max(0, card.clientHeight - 8) || face.scrollWidth > Math.max(0, card.clientWidth - 8))) {
      size -= 1; face.style.fontSize = size + 'px';
    }
  }
  function layoutGrid(){
    var total = activeCards.length;
    if (!total) return;
    var width = Math.min(560, Math.max(220, wrap.clientWidth || ((window.innerWidth || 360) - 32)));
    var viewportHeight = window.innerHeight || 700;
    var gridTop = grid.getBoundingClientRect().top || ((window.innerWidth || 700) <= 520 ? 190 : 230);
    var availableHeight = Math.max(120, viewportHeight - gridTop - 54);
    var gap = (window.innerWidth || 700) <= 520 ? 5 : 8;
    var longest = 0;
    activeCards.forEach(function(card){ longest = Math.max(longest, String(card._cd.text || '').length); });
    var ratio = longest > 28 ? 1.35 : (longest > 14 ? 1.15 : 1);
    var best = null;
    for (var cols = 2; cols <= Math.min(6, total); cols++) {
      var rows = Math.ceil(total / cols);
      var maxCellHeight = longest > 28 ? 92 : 82;
      var height = Math.min(availableHeight, rows * maxCellHeight);
      var cellWidth = (width - ((cols - 1) * gap)) / cols;
      var cellHeight = (height - ((rows - 1) * gap)) / rows;
      var score = Math.min(cellWidth / ratio, cellHeight);
      if (!best || score > best.score) best = { cols: cols, rows: rows, height: height, score: score };
    }
    grid.style.gridTemplateColumns = 'repeat(' + best.cols + ',minmax(0,1fr))';
    grid.style.gridTemplateRows = 'repeat(' + best.rows + ',minmax(0,1fr))';
    grid.style.height = Math.floor(best.height) + 'px';
    activeCards.forEach(fitFace);
  }
  function renderRound(){
    var round = rounds[roundIndex] || [];
    var cards = [];
    round.forEach(function(item){
      cards.push({ pair: item.index, text: _lpPairFront(item.pair) });
      cards.push({ pair: item.index, text: _lpPairBack(item.pair) });
    });
    cards.sort(function(){ return Math.random() - 0.5; });
    grid.replaceChildren(); activeCards = [];
    doneEl.textContent = ''; nextBtn.style.display = 'none';
    roundLabel.textContent = rounds.length > 1 ? ('Ronda ' + (roundIndex + 1) + ' de ' + rounds.length + ' · ' + round.length + ' pares') : (round.length + ' pares');
    var upCards = [], roundMatched = 0, lock = false;
    cards.forEach(function(cd){
      var el = document.createElement('div'); el.className = 'lp-mem-card';
      var back = document.createElement('span'); back.className = 'lp-mem-back'; back.textContent = '?';
      var face = document.createElement('span'); face.className = 'lp-mem-face'; face.textContent = cd.text;
      el.appendChild(back); el.appendChild(face);
      el._cd = cd; el._matched = false; el._up = false;
      el.addEventListener('click', function(){
        if (lock || el._up || el._matched) return;
        el.classList.add('up'); el._up = true; upCards.push(el);
        requestAnimationFrame(function(){ fitFace(el); });
        if (upCards.length === 2){
          var a = upCards[0], b = upCards[1];
          if (a._cd.pair === b._cd.pair){
            a.classList.add('matched'); b.classList.add('matched'); a._matched = true; b._matched = true; a._up = false; b._up = false;
            matchedCount++; roundMatched++; answers['mem-' + a._cd.pair] = { matched: true };
            upCards = []; refreshScore();
            if (roundMatched === round.length) {
              if (roundIndex < rounds.length - 1) { doneEl.textContent = 'Ronda completada.'; nextBtn.style.display = ''; }
              else doneEl.textContent = 'Todas emparejadas.';
            }
          } else {
            lock = true;
            setTimeout(function(){ a.classList.remove('up'); b.classList.remove('up'); a._up = false; b._up = false; upCards = []; lock = false; }, 850);
          }
        }
      });
      grid.appendChild(el); activeCards.push(el);
    });
    requestAnimationFrame(layoutGrid);
  }
  nextBtn.onclick = function(){ if (roundIndex < rounds.length - 1) { roundIndex++; renderRound(); } };
  var onResize = function(){
    if (!wrap.isConnected) { window.removeEventListener('resize', onResize); return; }
    layoutGrid();
  };
  window.addEventListener('resize', onResize);
  wrap.appendChild(roundLabel); wrap.appendChild(grid); wrap.appendChild(finish);
  renderRound();
  state.score = function(){ return { correct: matchedCount, total: pairs.length }; };
  state.detail = function(){ return pairs.map(function(p, i){ var a = answers['mem-' + i]; return { key: 'mem-' + i, questionText: _lpPairFront(p), answer: _lpPairBack(p), isCorrect: !!(a && a.matched) }; }); };
  return wrap;
}

function _lpReviewFlashcard(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Revisión de tus respuestas.'; wrap.appendChild(instr);
  (content.pairs || content.cards || []).forEach(function(p, i){
    var sv = saved[i] || {};
    var row = document.createElement('div'); row.className = 'lp-sentence'; row.style.cssText = 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap';
    var l = document.createElement('span'); l.style.fontWeight = '600'; l.textContent = _lpPairFront(p);
    var ar = document.createElement('span'); ar.style.color = 'var(--muted)'; ar.textContent = '->';
    var r = document.createElement('span'); r.textContent = _lpPairBack(p);
    var tag = document.createElement('span'); tag.style.cssText = 'font-size:12px;font-weight:600;margin-left:6px;color:' + (sv.isCorrect ? 'var(--green)' : 'var(--red)'); tag.textContent = sv.answer ? ('· ' + sv.answer) : '';
    row.appendChild(l); row.appendChild(ar); row.appendChild(r); row.appendChild(tag);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReviewTrueFalseVocab(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Revisión de tus respuestas.'; wrap.appendChild(instr);
  (saved || []).forEach(function(sv){
    var row = document.createElement('div'); row.className = 'lp-sentence'; row.style.cssText = 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap';
    var q = document.createElement('span'); q.style.fontWeight = '600'; q.textContent = sv.questionText || '';
    var ans = document.createElement('span'); ans.style.color = sv.isCorrect ? 'var(--green)' : 'var(--red)'; ans.textContent = sv.answer || '';
    row.appendChild(q); row.appendChild(ans);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReviewLetterOrder(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Revisión de tus respuestas.'; wrap.appendChild(instr);
  (saved || []).forEach(function(sv){
    var row = document.createElement('div'); row.className = 'lp-sentence'; row.style.cssText = 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap';
    var q = document.createElement('span'); q.style.fontWeight = '600'; q.textContent = sv.questionText || '';
    var ans = document.createElement('span'); ans.style.color = sv.isCorrect ? 'var(--green)' : 'var(--red)'; ans.textContent = sv.answer || '';
    row.appendChild(q); row.appendChild(ans);
    wrap.appendChild(row);
  });
  return wrap;
}
function _lpReviewMemory(content, saved){
  var wrap = document.createElement('div');
  wrap.appendChild(_lpReviewScoreHeader(saved));
  var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions || 'Revisión de tus respuestas.'; wrap.appendChild(instr);
  (content.pairs || []).forEach(function(p, i){
    var sv = saved[i] || {};
    var row = document.createElement('div'); row.className = 'lp-sentence'; row.style.cssText = 'display:flex;gap:8px;align-items:baseline';
    var l = document.createElement('span'); l.style.fontWeight = '600'; l.textContent = _lpPairFront(p);
    var ar = document.createElement('span'); ar.style.color = 'var(--muted)'; ar.textContent = '->';
    var r = document.createElement('span'); r.style.color = sv.isCorrect ? 'var(--green)' : 'var(--red)'; r.textContent = _lpPairBack(p);
    row.appendChild(l); row.appendChild(ar); row.appendChild(r);
    wrap.appendChild(row);
  });
  return wrap;
}

LegoTask.flashcard = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewFlashcard(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditMatch(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpFlashcard(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};
LegoTask['true-false-vocab'] = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewTrueFalseVocab(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditMatch(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpTrueFalseVocab(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};
LegoTask['letter-order'] = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewLetterOrder(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditMatch(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpLetterOrder(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};
LegoTask.memory = function(c, ctx){
  if (ctx.mode === 'review') return { el: _lpStrip(_lpReviewMemory(c, ctx.saved || []), '.lp-score'), score: _lpZero, detail: _lpNone };
  if (ctx.mode === 'edit') return { el: _lpEditMatch(c._srcObj || c), score: _lpZero, detail: _lpNone };
  var st = _lpSubState(ctx);
  var el = _lpMemory(c, st, ctx.onChange);
  return { el: el, score: function(){ return st.score(); }, detail: function(){ return st.detail(); } };
};


// -- flashcard modo ESCRIBIR (recuerdo activo, calificacion real) -----------
// content.mode === 'write' -> el estudiante teclea el significado; se compara
// tolerante a tildes/mayusculas (mismo norm que fill-blank). isCorrect objetivo.
function _lpFlashcardWriteStyles(){
  if (document.getElementById('lego-fcw-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-fcw-styles';
  st.textContent = '.lp-fcw{display:flex;flex-direction:column;align-items:center;gap:14px}.lp-fcw-prog{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.lp-fcw-term{width:100%;max-width:360px;min-height:90px;border:1.5px solid var(--border);border-radius:14px;background:var(--sand);display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-size:22px;font-weight:600;color:var(--ink)}.lp-fcw-in{width:100%;max-width:360px;border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font:inherit;font-size:16px;text-align:center;outline:none}.lp-fcw-in.correct{border-color:var(--green);color:var(--green)}.lp-fcw-in.wrong{border-color:var(--red);color:var(--red)}.lp-fcw-fb{font-size:13px;min-height:18px;text-align:center}.lp-fcw-btn{padding:9px 20px;border-radius:10px;border:none;background:var(--coral);color:#fff;font:inherit;font-size:14px;cursor:pointer}';
  document.head.appendChild(st);
}
function _lpFlashcardWrite(content, state, refreshScore){
  _lpFlashcardWriteStyles();
  var answers = state.answers;
  var pairs = content.pairs || content.cards || [];
  function norm(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
  var wrap = document.createElement('div'); wrap.className = 'lp-fcw';
  if (content.instructions){ var instr = document.createElement('div'); instr.className = 'lp-instr'; instr.textContent = content.instructions; wrap.appendChild(instr); }
  var prog = document.createElement('div'); prog.className = 'lp-fcw-prog';
  var term = document.createElement('div'); term.className = 'lp-fcw-term';
  var input = document.createElement('input'); input.className = 'lp-fcw-in';
  input.setAttribute('autocomplete', 'off'); input.setAttribute('autocorrect', 'off'); input.spellcheck = false;
  input.placeholder = 'Escribe el significado';
  var fb = document.createElement('div'); fb.className = 'lp-fcw-fb';
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lp-fcw-btn'; btn.textContent = 'Comprobar';
  var idx = 0, checked = false;
  function draw(){
    if (idx >= pairs.length){
      prog.textContent = pairs.length + ' / ' + pairs.length;
      term.textContent = 'Terminaste.'; input.style.display = 'none'; btn.style.display = 'none'; fb.textContent = '';
      return;
    }
    checked = false;
    prog.textContent = (idx + 1) + ' / ' + pairs.length;
    term.textContent = _lpPairFront(pairs[idx]);
    input.value = ''; input.className = 'lp-fcw-in'; input.disabled = false; input.style.display = 'block';
    fb.textContent = ''; btn.textContent = 'Comprobar'; btn.style.display = 'inline-block';
    setTimeout(function(){ try { input.focus(); } catch(e){} }, 0);
  }
  function check(){
    if (idx >= pairs.length) return;
    if (!checked){
      var correct = _lpPairBack(pairs[idx]);
      var accepted = [correct].concat(_lpPairAccepted(pairs[idx]));
      var typed = norm(input.value);
      var ok = typed !== '' && accepted.some(function(answer){ return typed === norm(answer); });
      answers['fc-' + idx] = { answer: input.value.trim(), correct: ok };
      input.className = 'lp-fcw-in ' + (ok ? 'correct' : 'wrong'); input.disabled = true;
      fb.style.color = ok ? 'var(--green)' : 'var(--red)';
      fb.textContent = ok ? 'Correcto' : ('Respuesta: ' + correct);
      checked = true; btn.textContent = 'Siguiente'; refreshScore();
    } else {
      idx++; draw();
    }
  }
  btn.onclick = check;
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); check(); } });
  wrap.appendChild(prog); wrap.appendChild(term); wrap.appendChild(input); wrap.appendChild(fb); wrap.appendChild(btn);
  draw();
  state.score = function(){ var c = 0, t = pairs.length; for (var i = 0; i < pairs.length; i++){ var a = answers['fc-' + i]; if (a && a.correct) c++; } return { correct: c, total: t }; };
  state.detail = function(){ return pairs.map(function(p, i){ var a = answers['fc-' + i] || {}; return { key: 'fc-' + i, questionText: _lpPairFront(p), answer: a.answer || '(sin responder)', isCorrect: a.correct === undefined ? false : !!a.correct }; }); };
  return wrap;
}


// -- LegoLesson (stepper) -----------------------------------
// Leccion multi-paso ENCIMA del motor (docs/blueprint-legolesson.md). Cada elemento
// de activities es una actividad real o sintetica, siempre rendida por LegoPlayer:
// cover opcional -> pasos en orden -> resultado agregado. No toca DB: reporta por
// callbacks (onStepResult por paso, onFinish al final) y el caller guarda.
//   LegoLesson(lesson, activities, opts) -> nodo DOM
//     lesson: { title, cover, steps } (activity_ids puede existir por compatibilidad)
//     activities: array ORDENADO, ya resuelto en el mismo orden canonico de steps
//     activity._warmup === true: cuenta como paso, pero no aporta score ni total
//     opts: { feedback:true, fcMode, onStepResult(i, activity, result), onFinish(aggregate) }
//   aggregate: { score, total, pct, steps:[{ title, type, score, total, answers, warmup }] }
// Sellado: createElement + textContent. CSS inyectado una vez.
function _llCoverStyles(){
  if (document.getElementById('lego-cover-styles')) return;
  var st = document.createElement('style'); st.id = 'lego-cover-styles';
  st.textContent = [
    '.llc-btn{margin-top:6px;padding:11px 26px;border:none;border-radius:12px;background:var(--coral);color:#fff;font:inherit;font-size:15px;font-weight:700;cursor:pointer}',
    '.llc-split{display:flex;flex-direction:column;height:100%;min-height:0;border-radius:16px;overflow:hidden;border:1px solid var(--border)}',
    '.llc-split-img{width:100%;height:180px;object-fit:cover;background:var(--sand)}',
    '.llc-split-body{padding:22px 24px;display:flex;flex-direction:column;gap:10px;align-items:flex-start;text-align:left}',
    '@media(min-width:640px){.llc-split{flex-direction:row}.llc-split-img{width:45%;height:auto;min-height:320px}.llc-split-body{flex:1;justify-content:center}}',
    '.llc-ruta{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding:26px 20px;border-radius:18px;background:linear-gradient(180deg,#fff,#F5F0E8);border:1px solid var(--border)}',
    '.llc-ruta-img{max-width:240px;max-height:150px;border-radius:12px;object-fit:cover}',
    '.llc-ruta-title{font-size:22px;font-weight:800;color:var(--ink)}',
    '.llc-ruta-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}',
    '.llc-steps{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center}',
    '.llc-step{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:56px}',
    '.llc-step-ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center}',
    '.llc-step-t{font-size:10px;font-weight:600;color:var(--ink-soft)}',
    '.llc-arrow{color:var(--muted);font-size:14px}',
    '.llc-hero{position:relative;border-radius:18px;overflow:hidden;min-height:280px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff}',
    '.llc-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center}',
    '.llc-hero-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.72))}',
    '.llc-hero-in{position:relative;padding:22px 24px;display:flex;flex-direction:column;gap:10px;align-items:flex-start;text-align:left}',
    '.llc-hero-title{font-size:26px;font-weight:800;color:#fff;line-height:1.15}',
    '.llc-hero-sub{font-size:14px;color:rgba(255,255,255,.9)}',
    '.llc-hero-meta{font-size:12px;font-weight:700;color:rgba(255,255,255,.85)}'
  ].join('');
  document.head.appendChild(st);
}
function _llMeta(lesson, activities){
  return (lesson.level ? lesson.level + ' · ' : '') + activities.length + (activities.length === 1 ? ' paso' : ' pasos');
}
function _llBtn(cv, onStart){
  var b = document.createElement('button'); b.type = 'button'; b.className = 'llc-btn'; b.textContent = cv.buttonLabel || 'Empezar';
  b.onclick = function(){ onStart(); };
  return b;
}
function _llTypeLabel(type){
  var m = { match: 'Vocab', memory: 'Memory', flashcard: 'Cards', 'fill-blank': 'Completar', mc: 'Opcion', reading: 'Lectura', audio: 'Audio', 'true-false-vocab': 'V o F', 'letter-order': 'Letras', 'drag-drop': 'Arrastrar', mixed: 'Mixta' };
  return m[type] || 'Paso';
}
function _llStepIcons(activities){
  var wrap = document.createElement('div'); wrap.className = 'llc-steps';
  activities.forEach(function(act, i){
    if (i > 0){ var ar = document.createElement('span'); ar.className = 'llc-arrow'; ar.textContent = String.fromCharCode(8594); wrap.appendChild(ar); }
    var ic = (ACTIVITY_ICONS && ACTIVITY_ICONS[act.type]) || { icon: 'ti-file', bg: '#F1EFE8', color: '#5F5E5A' };
    var step = document.createElement('div'); step.className = 'llc-step';
    var box = document.createElement('div'); box.className = 'llc-step-ico'; box.style.background = ic.bg;
    box.appendChild(LegoIcon(ic.icon, { size: 20, color: ic.color }));
    var t = document.createElement('div'); t.className = 'llc-step-t'; t.textContent = _llTypeLabel(act.type);
    step.appendChild(box); step.appendChild(t);
    wrap.appendChild(step);
  });
  return wrap;
}
var LessonCover = {};
LessonCover.simple = function(cv, lesson, activities, onStart){
  _llCoverStyles();
  var box = document.createElement('div'); box.className = 'll-cover ll-cover-b-' + (cv.border || 'none');
  if (cv.imageUrl){ var img = document.createElement('img'); img.className = 'll-cover-img'; img.src = _llpImgSrc(cv.imageUrl); img.alt = ''; box.appendChild(img); }
  var t = document.createElement('div'); t.className = 'll-cover-title'; t.textContent = cv.title || lesson.title || 'Leccion'; box.appendChild(t);
  if (cv.subtitle){ var sb = document.createElement('div'); sb.className = 'll-cover-sub'; sb.textContent = cv.subtitle; box.appendChild(sb); }
  if (cv.text){ var tx = document.createElement('div'); tx.className = 'll-cover-text'; tx.textContent = cv.text; box.appendChild(tx); }
  var meta = document.createElement('div'); meta.className = 'll-cover-meta'; meta.textContent = _llMeta(lesson, activities); box.appendChild(meta);
  box.appendChild(_llStepIcons(activities));
  box.appendChild(_llBtn(cv, onStart));
  return box;
};
LessonCover.split = function(cv, lesson, activities, onStart){
  _llCoverStyles();
  var box = document.createElement('div'); box.className = 'llc-split';
  if (cv.imageUrl){ var img = document.createElement('img'); img.className = 'llc-split-img'; img.src = _llpImgSrc(cv.imageUrl); img.alt = ''; box.appendChild(img); }
  var body = document.createElement('div'); body.className = 'llc-split-body';
  var meta = document.createElement('div'); meta.className = 'll-cover-meta'; meta.textContent = _llMeta(lesson, activities); body.appendChild(meta);
  var t = document.createElement('div'); t.className = 'll-cover-title'; t.textContent = cv.title || lesson.title || 'Leccion'; body.appendChild(t);
  if (cv.subtitle){ var sb = document.createElement('div'); sb.className = 'll-cover-sub'; sb.textContent = cv.subtitle; body.appendChild(sb); }
  if (cv.text){ var tx = document.createElement('div'); tx.className = 'll-cover-text'; tx.textContent = cv.text; body.appendChild(tx); }
  body.appendChild(_llStepIcons(activities));
  body.appendChild(_llBtn(cv, onStart));
  box.appendChild(body);
  return box;
};
LessonCover.ruta = function(cv, lesson, activities, onStart){
  _llCoverStyles();
  var box = document.createElement('div'); box.className = 'llc-ruta';
  if (cv.imageUrl){ var img = document.createElement('img'); img.className = 'llc-ruta-img'; img.src = _llpImgSrc(cv.imageUrl); img.alt = ''; box.appendChild(img); }
  var t = document.createElement('div'); t.className = 'llc-ruta-title'; t.textContent = cv.title || lesson.title || 'Leccion'; box.appendChild(t);
  if (cv.subtitle){ var sb = document.createElement('div'); sb.className = 'll-cover-sub'; sb.textContent = cv.subtitle; box.appendChild(sb); }
  var meta = document.createElement('div'); meta.className = 'll-cover-meta'; meta.textContent = _llMeta(lesson, activities); box.appendChild(meta);
  var lbl = document.createElement('div'); lbl.className = 'llc-ruta-lbl'; lbl.textContent = 'Tu ruta'; box.appendChild(lbl);
  box.appendChild(_llStepIcons(activities));
  box.appendChild(_llBtn(cv, onStart));
  return box;
};
LessonCover.hero = function(cv, lesson, activities, onStart){
  _llCoverStyles();
  var box = document.createElement('div'); box.className = 'llc-hero';
  var bg = document.createElement('div'); bg.className = 'llc-hero-bg';
  if (cv.imageUrl) bg.style.backgroundImage = 'url("' + _llpImgSrc(cv.imageUrl) + '")';
  else bg.style.background = 'linear-gradient(135deg,#D4522A,#A83E1E 60%,#B54D07)';
  box.appendChild(bg);
  var ov = document.createElement('div'); ov.className = 'llc-hero-ov'; box.appendChild(ov);
  var inn = document.createElement('div'); inn.className = 'llc-hero-in';
  var meta = document.createElement('div'); meta.className = 'llc-hero-meta'; meta.textContent = _llMeta(lesson, activities); inn.appendChild(meta);
  var t = document.createElement('div'); t.className = 'llc-hero-title'; t.textContent = cv.title || lesson.title || 'Leccion'; inn.appendChild(t);
  if (cv.subtitle){ var sb = document.createElement('div'); sb.className = 'llc-hero-sub'; sb.textContent = cv.subtitle; inn.appendChild(sb); }
  inn.appendChild(_llStepIcons(activities));
  inn.appendChild(_llBtn(cv, onStart));
  box.appendChild(inn);
  return box;
};

// Plato 4: una actividad sintetica con `_warmup === true` sigue siendo un paso
// normal para navegacion y pausa, pero no aporta score al agregado de la leccion.
// El core no conoce tipos concretos: todo paso se reproduce con LegoPlayer.
function LegoLesson(lesson, activities, opts){
  lesson = lesson || {}; activities = activities || []; opts = opts || {};
  if (!document.getElementById('lego-lesson-styles')) {
    var st = document.createElement('style'); st.id = 'lego-lesson-styles';
    st.textContent = '.lego-lesson{display:flex;flex-direction:column;height:100%;min-height:0}.ll-head{flex-shrink:0;margin-bottom:12px}.ll-title{font-size:15px;font-weight:700;color:var(--ink)}.ll-prog-row{display:flex;align-items:center;gap:10px;margin-top:6px}.ll-prog-txt{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}.ll-bar{flex:1;height:6px;background:var(--sand);border-radius:3px;overflow:hidden}.ll-bar-fill{height:100%;background:var(--coral);border-radius:3px;transition:width .3s}.ll-body{flex:1 1 auto;min-height:0;overflow:auto}.ll-foot{flex-shrink:0;display:flex;align-items:center;gap:12px;margin-top:14px}.ll-foot-score{font-size:13px;font-weight:700;color:var(--ink-soft)}.ll-next{padding:10px 22px;border:none;border-radius:10px;background:var(--coral);color:#fff;font:inherit;font-size:14px;cursor:pointer}.ll-cover{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding:26px 18px}.ll-cover-img{max-width:280px;max-height:180px;border-radius:12px;object-fit:cover}.ll-cover-title{font-size:22px;font-weight:800;color:var(--ink)}.ll-cover-text{font-size:15px;line-height:1.6;color:var(--ink-soft);max-width:460px}.ll-cover-meta{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.ll-end{display:flex;flex-direction:column;align-items:center;gap:14px;padding:20px}.ll-end-pct{font-size:40px;font-weight:800;color:var(--coral)}.ll-end-rows{width:100%;max-width:440px}.ll-end-row{display:flex;justify-content:space-between;gap:10px;padding:8px 4px;border-bottom:1px solid var(--border);font-size:13px}.ll-end-row-t{color:var(--ink)}.ll-end-row-s{font-weight:700;color:var(--ink-soft);white-space:nowrap}.ll-cover-sub{font-size:14px;color:var(--muted);max-width:460px;margin-top:-6px}.ll-cover-b-a,.ll-cover-b-b,.ll-cover-b-c,.ll-cover-b-d{margin:6px auto;max-width:520px;width:100%}.ll-cover-b-a{border:1px solid var(--border);border-radius:14px}.ll-cover-b-b{border:2px solid var(--ink-soft);border-left:6px solid var(--coral);border-radius:12px}.ll-cover-b-c{border:1px solid var(--border);border-radius:20px;background:var(--sand)}.ll-cover-b-d{border:3px double var(--ink-soft);border-radius:8px}';
    document.head.appendChild(st);
  }
  var feedback = opts.feedback !== false;
  var results = [];
  var idx = opts.startStep || 0;
  if (idx < 0) idx = 0; if (idx > activities.length) idx = activities.length;
  var baseScore = Number(opts.baseScore) || 0;
  var baseTotal = Number(opts.baseTotal) || 0;
  var pendingResume = (opts.resumeAnswers && opts.resumeAnswers.length) ? opts.resumeAnswers : null;
  function accProgress(){
    var s = baseScore, t = baseTotal;
    results.forEach(function(r){ if (r && !r.warmup) { s += (r.score || 0); t += (r.total || 0); } });
    return { score: s, total: t };
  }
  var root = document.createElement('div'); root.className = 'lego-lesson';
  var head = document.createElement('div'); head.className = 'll-head';
  var titleEl = document.createElement('div'); titleEl.className = 'll-title'; titleEl.textContent = lesson.title || 'Lección';
  var progRow = document.createElement('div'); progRow.className = 'll-prog-row';
  var progTxt = document.createElement('div'); progTxt.className = 'll-prog-txt';
  var bar = document.createElement('div'); bar.className = 'll-bar';
  var fill = document.createElement('div'); fill.className = 'll-bar-fill'; fill.style.width = '0%';
  bar.appendChild(fill);
  progRow.appendChild(progTxt); progRow.appendChild(bar);
  head.appendChild(titleEl); head.appendChild(progRow);
  var body = document.createElement('div'); body.className = 'll-body';
  var foot = document.createElement('div'); foot.className = 'll-foot'; foot.style.display = 'none';
  var footScore = document.createElement('div'); footScore.className = 'll-foot-score';
  var nextBtn = document.createElement('button'); nextBtn.type = 'button'; nextBtn.className = 'll-next';
  foot.appendChild(footScore); foot.appendChild(nextBtn);
  root.appendChild(head); root.appendChild(body); root.appendChild(foot);

  function setProg(){
    var total = activities.length;
    var n = Math.min(idx + 1, total);
    progTxt.textContent = 'Paso ' + n + ' de ' + total;
    fill.style.width = (total ? Math.round((idx / total) * 100) : 0) + '%';
  }

  function showCover(){
    var cv = lesson.cover || {};
    var layout = LessonCover[cv.layout] || LessonCover.simple;
    var box = layout(cv, lesson, activities, function(){ showStep(); });
    progTxt.textContent = activities.length + ' pasos'; fill.style.width = '0%';
    body.replaceChildren(box); foot.style.display = 'none';
  }

  function showStep(){
    if (idx >= activities.length) { showEnd(); return; }
    setProg();
    var act = activities[idx];
    foot.style.display = 'none';
    var savedForStep = pendingResume; pendingResume = null;
    var node = LegoPlayer(act, {
      mode: 'play',
      feedback: feedback,
      fcMode: opts.fcMode,
      saved: (savedForStep && savedForStep.length) ? savedForStep : undefined,
      onPause: (typeof opts.onPause === 'function') ? function(partial){ var acc = accProgress(); opts.onPause({ step: idx, score: acc.score, total: acc.total, stepAnswers: partial || [] }); } : undefined,
      submitLabel: (idx + 1 < activities.length) ? 'Siguiente paso →' : 'Ver resultado',
      onResult: function(res){
        results[idx] = { title: act.title || ('Paso ' + (idx + 1)), type: res.type, score: res.score, total: res.total, answers: res.answers, warmup: act._warmup === true };
        if (typeof opts.onStepResult === 'function') { try { opts.onStepResult(idx, act, res); } catch(e){} }
        idx++; showStep();
      }
    });
    body.replaceChildren(node);
  }

  nextBtn.onclick = function(){ idx++; showStep(); };

  function showEnd(){
    progTxt.textContent = 'Paso ' + activities.length + ' de ' + activities.length;
    fill.style.width = '100%';
    var _acc = accProgress(); var score = _acc.score, total = _acc.total;
    var pct = total ? Math.round((score / total) * 100) : 0;
    var box = document.createElement('div'); box.className = 'll-end';
    var big = document.createElement('div'); big.className = 'll-end-pct'; big.textContent = feedback ? (pct + '%') : '✓';
    box.appendChild(big);
    var lbl = document.createElement('div'); lbl.className = 'll-cover-meta'; lbl.textContent = 'Lección completada'; box.appendChild(lbl);
    if (feedback) {
      var rows = document.createElement('div'); rows.className = 'll-end-rows';
      results.forEach(function(r, i){
        var row = document.createElement('div'); row.className = 'll-end-row';
        var t = document.createElement('span'); t.className = 'll-end-row-t'; t.textContent = (i + 1) + '. ' + ((r && r.title) || 'Paso');
        var s = document.createElement('span'); s.className = 'll-end-row-s'; s.textContent = (r && r.warmup) ? '\u2014' : (r ? (r.score + '/' + (r.total || 0)) : '\u2014');
        row.appendChild(t); row.appendChild(s);
        rows.appendChild(row);
      });
      box.appendChild(rows);
    }
    body.replaceChildren(box); foot.style.display = 'none';
    if (typeof opts.onFinish === 'function') {
      try { opts.onFinish({ score: score, total: total, pct: pct, steps: results.slice() }); } catch(e){}
    }
  }

  if (lesson.cover && idx === 0 && !pendingResume) showCover(); else showStep();
  return root;
}


// -- LegoBoard ----------------------------------------------
// Pizarra editable/readonly sellada. No toca DB ni estado global.
//   LegoBoard({ data, readonly:false, height:560, onChange:function(data){} })
//   node._getValue() -> { version, strokes, texts, shapes }
function LegoBoard(opts){
  opts = opts || {};
  if (!document.getElementById('lego-board-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-board-styles';
    st.textContent = '.lego-board{border:1px solid var(--border);border-radius:var(--r);background:var(--white);overflow:hidden;display:flex;flex-direction:column;min-height:0}.lego-board__tools{padding:8px 10px;border-bottom:1px solid var(--border);background:var(--sand);display:flex;align-items:center;gap:6px;flex-wrap:wrap}.lego-board__tool{width:30px;height:30px;border:1px solid var(--border);background:var(--white);border-radius:7px;padding:0;font:inherit;color:var(--ink-soft);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}.lego-board__tool.active{background:var(--coral);border-color:var(--coral);color:#fff}.lego-board__submenu{display:none;align-items:center;gap:4px;border:1px solid var(--border);border-radius:8px;background:var(--white);padding:3px}.lego-board__submenu.open{display:flex}.lego-board__subtool{width:28px;height:28px;border:none;background:transparent;border-radius:6px;padding:0;color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}.lego-board__subtool.active{background:var(--sand);color:var(--coral)}.lego-board__swatch{width:22px;height:22px;border-radius:50%;border:2px solid var(--white);outline:1px solid var(--border);cursor:pointer}.lego-board__stage{position:relative;flex:1;min-height:0;background:#fffdf8}.lego-board__canvas{width:100%;height:100%;display:block;background:#fffdf8;touch-action:none}.lego-board__text-editor{position:absolute;z-index:2;min-width:120px;max-width:320px;min-height:34px;border:1px solid var(--coral);border-radius:7px;background:#fff;padding:6px 8px;box-shadow:0 6px 18px rgba(28,26,23,.12);font:700 22px Arial,sans-serif;color:#2D2A24;outline:none;resize:both}.lego-board--readonly .lego-board__canvas{cursor:default}.lego-board:not(.lego-board--readonly) .lego-board__canvas{cursor:crosshair}';
    document.head.appendChild(st);
  }

  function emptyBoard(){
    return { version: 1, strokes: [], texts: [], shapes: [] };
  }
  function clonePoint(p){
    return { x: Number(p && p.x) || 0, y: Number(p && p.y) || 0 };
  }
  function normalizeBoard(raw){
    if (raw && raw.board_data) raw = raw.board_data;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch(e) { raw = emptyBoard(); }
    }
    raw = raw || emptyBoard();
    return {
      version: 1,
      strokes: Array.isArray(raw.strokes) ? raw.strokes.map(function(stroke){
        return {
          tool: stroke && stroke.tool === 'eraser' ? 'eraser' : 'pen',
          color: stroke && stroke.color ? String(stroke.color) : '#2D2A24',
          width: Number(stroke && stroke.width) || (stroke && stroke.tool === 'eraser' ? 18 : 3),
          points: Array.isArray(stroke && stroke.points) ? stroke.points.map(clonePoint) : []
        };
      }) : [],
      texts: Array.isArray(raw.texts) ? raw.texts.map(function(t){
        return {
          x: Number(t && t.x) || 0,
          y: Number(t && t.y) || 0,
          text: String(t && t.text || ''),
          color: t && t.color ? String(t.color) : '#2D2A24',
          size: Number(t && t.size) || 22
        };
      }) : [],
      shapes: Array.isArray(raw.shapes) ? raw.shapes.map(function(s){
        var type = s && (s.type === 'rect' || s.type === 'circle' || s.type === 'line' || s.type === 'arrow') ? s.type : 'line';
        return {
          type: type,
          x: Number(s && s.x) || 0,
          y: Number(s && s.y) || 0,
          w: Number(s && s.w) || 0,
          h: Number(s && s.h) || 0,
          x1: Number(s && s.x1) || 0,
          y1: Number(s && s.y1) || 0,
          x2: Number(s && s.x2) || 0,
          y2: Number(s && s.y2) || 0,
          color: s && s.color ? String(s.color) : '#2D2A24',
          width: Number(s && s.width) || 3
        };
      }) : []
    };
  }
  function boardCopy(){
    return normalizeBoard(board);
  }
  function emit(){
    if (typeof opts.onChange === 'function') opts.onChange(boardCopy());
  }
  function canvasPoint(ev){
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (ev.clientX - rect.left) / Math.max(1, rect.width))),
      y: Math.max(0, Math.min(1, (ev.clientY - rect.top) / Math.max(1, rect.height)))
    };
  }
  function textBounds(t, rect){
    var size = Number(t.size) || 22;
    var width = Math.max(60, String(t.text || '').length * size * 0.58);
    var height = size * 1.25;
    return { x: (t.x || 0) * rect.width, y: (t.y || 0) * rect.height, w: width, h: height };
  }
  function textAtPoint(p){
    var rect = canvas.getBoundingClientRect();
    for (var i = board.texts.length - 1; i >= 0; i--) {
      var b = textBounds(board.texts[i], rect);
      var x = p.x * rect.width;
      var y = p.y * rect.height;
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return board.texts[i];
    }
    return null;
  }
  function makeShape(type, start, end){
    if (type === 'line' || type === 'arrow') {
      return { type: type, x1: start.x, y1: start.y, x2: end.x, y2: end.y, color: color, width: 3 };
    }
    return {
      type: type,
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      w: Math.abs(end.x - start.x),
      h: Math.abs(end.y - start.y),
      color: color,
      width: 3
    };
  }
  function drawShape(ctx, shape, rect, isPreview){
    ctx.save();
    ctx.strokeStyle = shape.color || '#2D2A24';
    ctx.lineWidth = shape.width || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (isPreview) ctx.setLineDash([8, 5]);
    ctx.beginPath();
    if (shape.type === 'line' || shape.type === 'arrow') {
      var x1 = (shape.x1 || 0) * rect.width;
      var y1 = (shape.y1 || 0) * rect.height;
      var x2 = (shape.x2 || 0) * rect.width;
      var y2 = (shape.y2 || 0) * rect.height;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      if (shape.type === 'arrow') {
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var len = 14;
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - len * Math.cos(angle - Math.PI / 6), y2 - len * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - len * Math.cos(angle + Math.PI / 6), y2 - len * Math.sin(angle + Math.PI / 6));
      }
    } else if (shape.type === 'circle') {
      ctx.ellipse(
        ((shape.x || 0) + (shape.w || 0) / 2) * rect.width,
        ((shape.y || 0) + (shape.h || 0) / 2) * rect.height,
        Math.max(1, Math.abs(shape.w || 0) * rect.width / 2),
        Math.max(1, Math.abs(shape.h || 0) * rect.height / 2),
        0,
        0,
        Math.PI * 2
      );
    } else {
      ctx.rect((shape.x || 0) * rect.width, (shape.y || 0) * rect.height, (shape.w || 0) * rect.width, (shape.h || 0) * rect.height);
    }
    ctx.stroke();
    ctx.restore();
  }
  function drawSelection(ctx, item, rect){
    if (!item) return;
    var shape = item.kind === 'text' ? null : item.ref;
    var text = item.kind === 'text' ? item.ref : null;
    ctx.save();
    ctx.strokeStyle = '#D95B43';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    if (text) {
      var tb = textBounds(text, rect);
      ctx.strokeRect(tb.x, tb.y, tb.w, tb.h);
    } else if (shape.type === 'line' || shape.type === 'arrow') {
      ctx.beginPath();
      ctx.moveTo((shape.x1 || 0) * rect.width, (shape.y1 || 0) * rect.height);
      ctx.lineTo((shape.x2 || 0) * rect.width, (shape.y2 || 0) * rect.height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#D95B43';
      ctx.beginPath();
      ctx.arc((shape.x1 || 0) * rect.width, (shape.y1 || 0) * rect.height, 4, 0, Math.PI * 2);
      ctx.arc((shape.x2 || 0) * rect.width, (shape.y2 || 0) * rect.height, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeRect((shape.x || 0) * rect.width, (shape.y || 0) * rect.height, (shape.w || 0) * rect.width, (shape.h || 0) * rect.height);
    }
    ctx.restore();
  }
  function distanceToSegment(px, py, x1, y1, x2, y2){
    var dx = x2 - x1;
    var dy = y2 - y1;
    if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
    var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }
  function shapeAtPoint(p){
    var rect = canvas.getBoundingClientRect();
    var px = p.x * rect.width;
    var py = p.y * rect.height;
    for (var i = board.shapes.length - 1; i >= 0; i--) {
      var s = board.shapes[i];
      if (s.type === 'line' || s.type === 'arrow') {
        if (distanceToSegment(px, py, (s.x1 || 0) * rect.width, (s.y1 || 0) * rect.height, (s.x2 || 0) * rect.width, (s.y2 || 0) * rect.height) <= 10) return s;
      } else {
        var x = (s.x || 0) * rect.width;
        var y = (s.y || 0) * rect.height;
        var w = (s.w || 0) * rect.width;
        var h = (s.h || 0) * rect.height;
        if (px >= x - 6 && px <= x + w + 6 && py >= y - 6 && py <= y + h + 6) return s;
      }
    }
    return null;
  }
  function moveShape(shape, dx, dy){
    if (!shape) return;
    if (shape.type === 'line' || shape.type === 'arrow') {
      shape.x1 = Math.max(0, Math.min(1, (shape.x1 || 0) + dx));
      shape.y1 = Math.max(0, Math.min(1, (shape.y1 || 0) + dy));
      shape.x2 = Math.max(0, Math.min(1, (shape.x2 || 0) + dx));
      shape.y2 = Math.max(0, Math.min(1, (shape.y2 || 0) + dy));
    } else {
      shape.x = Math.max(0, Math.min(1 - (shape.w || 0), (shape.x || 0) + dx));
      shape.y = Math.max(0, Math.min(1 - (shape.h || 0), (shape.y || 0) + dy));
    }
  }
  function boardItemAtPoint(p){
    var text = textAtPoint(p);
    if (text) return { kind: 'text', ref: text };
    var shape = shapeAtPoint(p);
    if (shape) return { kind: 'shape', ref: shape };
    return null;
  }
  function moveBoardItem(item, dx, dy){
    if (!item) return;
    if (item.kind === 'text') {
      item.ref.x = Math.max(0, Math.min(1, (item.ref.x || 0) + dx));
      item.ref.y = Math.max(0, Math.min(1, (item.ref.y || 0) + dy));
    } else {
      moveShape(item.ref, dx, dy);
    }
  }
  function deleteBoardItem(item){
    if (!item) return;
    if (item.kind === 'text') {
      board.texts = board.texts.filter(function(t){ return t !== item.ref; });
    } else {
      board.shapes = board.shapes.filter(function(shape){ return shape !== item.ref; });
    }
  }
  function openTextEditor(point, existing){
    if (readonly) return;
    if (textEditor && textEditor.parentNode) textEditor.blur();
    var rect = canvas.getBoundingClientRect();
    textEditor = document.createElement('textarea');
    textEditor.className = 'lego-board__text-editor';
    textEditor.value = existing ? existing.text || '' : '';
    textEditor.style.left = Math.max(0, Math.min(rect.width - 140, point.x * rect.width)) + 'px';
    textEditor.style.top = Math.max(0, Math.min(rect.height - 44, point.y * rect.height)) + 'px';
    textEditor.style.color = existing && existing.color ? existing.color : color;
    textEditor.style.fontSize = ((existing && existing.size) || 22) + 'px';
    stage.appendChild(textEditor);
    var done = false;
    function commit(){
      if (done) return;
      done = true;
      var value = textEditor.value.trim();
      if (existing) {
        if (value) {
          existing.text = value;
          existing.color = existing.color || color;
          existing.size = existing.size || 22;
        } else {
          board.texts = board.texts.filter(function(t){ return t !== existing; });
        }
      } else if (value) {
        board.texts.push({ x: point.x, y: point.y, text: value, color: color, size: 22 });
      }
      if (textEditor && textEditor.parentNode) textEditor.parentNode.removeChild(textEditor);
      textEditor = null;
      draw();
      emit();
    }
    textEditor.addEventListener('keydown', function(ev){
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        commit();
      }
      if (ev.key === 'Escape') {
        done = true;
        if (textEditor && textEditor.parentNode) textEditor.parentNode.removeChild(textEditor);
        textEditor = null;
      }
    });
    textEditor.addEventListener('blur', commit);
    setTimeout(function(){ textEditor.focus(); textEditor.select(); }, 0);
  }
  function draw(){
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var width = Math.max(1, Math.round(rect.width * dpr));
    var height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = 'rgba(61,55,46,.12)';
    ctx.lineWidth = 1;
    for (var gx = 32; gx < rect.width; gx += 32) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, rect.height);
      ctx.stroke();
    }
    for (var gy = 32; gy < rect.height; gy += 32) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(rect.width, gy);
      ctx.stroke();
    }
    board.strokes.forEach(function(stroke){
      var pts = stroke.points || [];
      if (!pts.length) return;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#fffdf8' : (stroke.color || '#2D2A24');
      ctx.lineWidth = stroke.tool === 'eraser' ? (stroke.width || 18) : (stroke.width || 3);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(function(p, idx){
        var x = p.x * rect.width;
        var y = p.y * rect.height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    });
    board.shapes.forEach(function(shape){ drawShape(ctx, shape, rect, false); });
    if (selectedItem) drawSelection(ctx, selectedItem, rect);
    board.texts.forEach(function(t){
      ctx.save();
      ctx.fillStyle = t.color || '#2D2A24';
      ctx.font = '700 ' + (t.size || 22) + 'px Arial, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(t.text || '', (t.x || 0) * rect.width, (t.y || 0) * rect.height);
      ctx.restore();
    });
    if (previewShape) drawShape(ctx, previewShape, rect, true);
  }
  function setTool(next){
    tool = next;
    var penMode = tool === 'pen' || tool === 'line' || tool === 'arrow' || tool === 'rect' || tool === 'circle';
    toolButtons.forEach(function(item){
      item.btn.classList.toggle('active', item.tool === tool || (item.tool === 'pen-menu' && penMode));
    });
    if (penMenu) penMenu.classList.toggle('open', penMenuOpen && penMode);
    shapeButtons.forEach(function(item){
      item.btn.classList.toggle('active', item.tool === tool);
    });
  }
  function toolIcon(iconName, label){
    var wrap = document.createElement('span');
    wrap.title = label;
    wrap.setAttribute('aria-label', label);
    wrap.appendChild(LegoIcon(iconName, { size: 16 }));
    return wrap;
  }
  function addTool(label, value, iconName){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lego-board__tool';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.appendChild(LegoIcon(iconName || 'ti-square', { size: 16 }));
    btn.onclick = function(){ setTool(value); };
    toolButtons.push({ tool: value, btn: btn });
    tools.appendChild(btn);
  }
  function addAction(label, fn){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lego-board__tool';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.appendChild(LegoIcon(label === 'Deshacer' ? 'ti-arrow-back-up' : 'ti-trash', { size: 16 }));
    btn.onclick = fn;
    tools.appendChild(btn);
  }
  function addShapeTool(label, value, iconName){
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lego-board__subtool';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.appendChild(LegoIcon(iconName || 'ti-square', { size: 15 }));
    btn.onclick = function(){ setTool(value); };
    shapeButtons.push({ tool: value, btn: btn });
    penMenu.appendChild(btn);
  }

  var readonly = !!opts.readonly;
  var board = normalizeBoard(opts.data);
  var tool = 'pen';
  var color = '#2D2A24';
  var drawing = false;
  var currentStroke = null;
  var shapeStart = null;
  var previewShape = null;
  var selectedItem = null;
  var movingItem = false;
  var lastMovePoint = null;
  var textEditor = null;
  var toolButtons = [];
  var shapeButtons = [];
  var penMenu = null;
  var penMenuOpen = false;

  var root = document.createElement('div');
  root.className = 'lego-board' + (readonly ? ' lego-board--readonly' : '');
  root.style.minHeight = (Number(opts.height) || 520) + 'px';
  root._getValue = boardCopy;
  root._setValue = function(next){
    board = normalizeBoard(next);
    selectedItem = null;
    previewShape = null;
    draw();
    emit();
  };
  root._redraw = draw;

  var tools = document.createElement('div');
  tools.className = 'lego-board__tools';
  if (!readonly) {
    var penBtn = document.createElement('button');
    penBtn.type = 'button';
    penBtn.className = 'lego-board__tool';
    penBtn.title = 'Lápiz';
    penBtn.setAttribute('aria-label', 'Lápiz');
    penBtn.appendChild(LegoIcon('ti-pencil', { size: 16 }));
    penBtn.onclick = function(){
      var penMode = tool === 'pen' || tool === 'line' || tool === 'arrow' || tool === 'rect' || tool === 'circle';
      penMenuOpen = penMode ? !penMenuOpen : true;
      setTool(penMode ? tool : 'pen');
    };
    toolButtons.push({ tool: 'pen-menu', btn: penBtn });
    tools.appendChild(penBtn);
    penMenu = document.createElement('div');
    penMenu.className = 'lego-board__submenu';
    tools.appendChild(penMenu);
    addShapeTool('Libre', 'pen', 'ti-pencil');
    addShapeTool('Línea', 'line', 'ti-minus');
    addShapeTool('Flecha', 'arrow', 'ti-arrow-right');
    addShapeTool('Rectángulo', 'rect', 'ti-rectangle');
    addShapeTool('Círculo', 'circle', 'ti-circle');
    addTool('Texto', 'text', 'ti-letter-t');
    addTool('Borrar', 'eraser', 'ti-eraser');
    ['#2D2A24', '#D95B43', '#2F6FA3', '#2F7D5B'].forEach(function(c){
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'lego-board__swatch';
      sw.setAttribute('aria-label', 'Color');
      sw.style.background = c;
      sw.onclick = function(){ color = c; };
      tools.appendChild(sw);
    });
    addAction('Deshacer', function(){
      if (board.strokes.length) board.strokes.pop();
      else if (board.texts.length) board.texts.pop();
      else if (board.shapes.length) board.shapes.pop();
      draw();
      emit();
    });
    addAction('Limpiar', function(){
      if (!confirm('¿Limpiar la pizarra actual?')) return;
      board = emptyBoard();
      previewShape = null;
      selectedItem = null;
      draw();
      emit();
    });
    setTool('pen');
    root.appendChild(tools);
  }

  var stage = document.createElement('div');
  stage.className = 'lego-board__stage';
  stage.style.minHeight = Math.max(220, (Number(opts.height) || 520) - (readonly ? 0 : 42)) + 'px';
  var canvas = document.createElement('canvas');
  canvas.className = 'lego-board__canvas';
  if (!readonly) {
    canvas.addEventListener('pointerdown', function(ev){
      ev.preventDefault();
      var p = canvasPoint(ev);
      if (tool === 'text') {
        var hitText = textAtPoint(p);
        if (!hitText) {
          openTextEditor(p, null);
          return;
        }
        selectedItem = { kind: 'text', ref: hitText };
        drawing = true;
        movingItem = true;
        lastMovePoint = p;
        if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId);
        draw();
        return;
      }
      var hitItem = boardItemAtPoint(p);
      if (hitItem) {
        if (tool === 'eraser') {
          deleteBoardItem(hitItem);
          selectedItem = null;
          draw();
          emit();
          return;
        }
        selectedItem = hitItem;
        drawing = true;
        movingItem = true;
        lastMovePoint = p;
        if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId);
        draw();
        return;
      }
      selectedItem = null;
      if (tool === 'line' || tool === 'arrow' || tool === 'rect' || tool === 'circle') {
        drawing = true;
        shapeStart = p;
        previewShape = makeShape(tool, shapeStart, p);
        if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId);
        draw();
        return;
      }
      drawing = true;
      currentStroke = { tool: tool === 'eraser' ? 'eraser' : 'pen', color: color, width: tool === 'eraser' ? 20 : 3, points: [p] };
      board.strokes.push(currentStroke);
      if (canvas.setPointerCapture) canvas.setPointerCapture(ev.pointerId);
      draw();
    });
    canvas.addEventListener('pointermove', function(ev){
      if (!drawing) return;
      ev.preventDefault();
      var now = canvasPoint(ev);
      if (movingItem && selectedItem && lastMovePoint) {
        moveBoardItem(selectedItem, now.x - lastMovePoint.x, now.y - lastMovePoint.y);
        lastMovePoint = now;
        draw();
        return;
      }
      if (shapeStart && (tool === 'line' || tool === 'arrow' || tool === 'rect' || tool === 'circle')) {
        previewShape = makeShape(tool, shapeStart, canvasPoint(ev));
        draw();
        return;
      }
      if (!currentStroke) return;
      currentStroke.points.push(canvasPoint(ev));
      draw();
      emit();
    });
    function endDraw(){
      if (movingItem) {
        movingItem = false;
        drawing = false;
        lastMovePoint = null;
        emit();
        draw();
        return;
      }
      if (shapeStart && previewShape) {
        var lineLike = previewShape.type === 'line' || previewShape.type === 'arrow';
        if ((lineLike && (previewShape.x1 !== previewShape.x2 || previewShape.y1 !== previewShape.y2)) || (!lineLike && previewShape.w > 0.003 && previewShape.h > 0.003)) {
          board.shapes.push(previewShape);
          selectedItem = { kind: 'shape', ref: previewShape };
          emit();
        }
      }
      drawing = false;
      currentStroke = null;
      shapeStart = null;
      previewShape = null;
      draw();
    }
    canvas.addEventListener('dblclick', function(ev){
      var p = canvasPoint(ev);
      var t = textAtPoint(p);
      if (t) openTextEditor({ x: t.x, y: t.y }, t);
    });
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointercancel', endDraw);
  }
  stage.appendChild(canvas);
  root.appendChild(stage);
  setTimeout(draw, 0);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function(){ draw(); });
    ro.observe(stage);
  }
  return root;
}




// -- LegoButton --------------------------------------------
// Boton universal sellado. Variante visual + tamano + icono opcional.
//   LegoButton({ label, variant, size, icon, onClick, disabled, type, title })
//   variant: 'primary'(coral) | 'outline' | 'danger' | 'ghost' | 'teal'   (default primary)
//   size: 'sm' | 'md'   (default md)
//   icon: 'ti-...' (Tabler via LegoIcon) o emoji   (opcional, colapsa si falta)
// Portable: usa variables CSS con fallback, no depende de las clases .btn del host.
function LegoButton(opts) {
  opts = opts || {};
  if (!document.getElementById('lego-button-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-button-styles';
    st.textContent = '.lego-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:var(--r,10px);border:none;cursor:pointer;font-family:var(--sans,inherit);font-size:13px;font-weight:500;line-height:1;transition:all .15s;white-space:nowrap}'
      + '.lego-btn:focus-visible{outline:2px solid var(--coral,#D4522A);outline-offset:2px}'
      + '.lego-btn--primary{background:var(--coral,#D4522A);color:#fff}'
      + '.lego-btn--primary:hover{filter:brightness(1.06)}'
      + '.lego-btn--teal{background:var(--teal,#1E6B72);color:#fff}'
      + '.lego-btn--teal:hover{filter:brightness(1.06)}'
      + '.lego-btn--outline{background:var(--white,#fff);color:var(--ink,#1C1A17);border:1.5px solid var(--border,#DDD7CE)}'
      + '.lego-btn--outline:hover{border-color:var(--ink,#1C1A17)}'
      + '.lego-btn--danger{background:var(--red-lt,#FEECEC);color:var(--red,#C0392B)}'
      + '.lego-btn--danger:hover{filter:brightness(.97)}'
      + '.lego-btn--ghost{background:transparent;color:var(--muted,#8C8479)}'
      + '.lego-btn--ghost:hover{color:var(--ink,#1C1A17)}'
      + '.lego-btn--sm{padding:6px 12px;font-size:12px}'
      + '.lego-btn:disabled{opacity:.5;cursor:not-allowed}';
    document.head.appendChild(st);
  }
  var b = document.createElement('button');
  b.type = opts.type || 'button';
  var variant = opts.variant || 'primary';
  b.className = 'lego-btn lego-btn--' + variant + (opts.size === 'sm' ? ' lego-btn--sm' : '');
  if (opts.icon) {
    if (typeof LegoIcon === 'function' && /^ti-/.test(String(opts.icon))) {
      b.appendChild(LegoIcon(opts.icon, { size: opts.size === 'sm' ? 15 : 16 }));
    } else {
      var ic = document.createElement('span');
      ic.textContent = opts.icon;
      b.appendChild(ic);
    }
  }
  if (opts.label != null && opts.label !== '') {
    var lbl = document.createElement('span');
    lbl.textContent = String(opts.label);
    b.appendChild(lbl);
  }
  if (opts.disabled) b.disabled = true;
  if (opts.title) b.title = opts.title;
  if (typeof opts.onClick === 'function') b.addEventListener('click', opts.onClick);
  return b;
}

// -- LegoField ---------------------------------------------
// Campo sellado: label + control + hint/error opcionales.
//   LegoField({ label:'Nivel', control: LegoSelect(...), hint:'Opcional' })
function LegoField(opts) {
  opts = opts || {};
  if (!document.getElementById('lego-field-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-field-styles';
    st.textContent = '.lego-field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;min-width:0}'
      + '.lego-field__label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0;color:var(--ink-soft,#5E554A)}'
      + '.lego-field__optional{font-weight:400;color:var(--muted,#8C8479);text-transform:none;letter-spacing:0;margin-left:4px}'
      + '.lego-field__hint{font-size:11px;line-height:1.35;color:var(--muted,#8C8479)}'
      + '.lego-field__error{font-size:12px;line-height:1.35;color:var(--red,#C0392B)}'
      + '.lego-field--compact{margin-bottom:0}';
    document.head.appendChild(st);
  }
  var field = document.createElement('div');
  field.className = 'lego-field' + (opts.compact ? ' lego-field--compact' : '');
  if (opts.className) field.className += ' ' + opts.className;
  if (opts.style) field.style.cssText = opts.style;
  if (opts.label) {
    var label = document.createElement('label');
    label.className = 'lego-field__label';
    if (opts.forId) label.htmlFor = opts.forId;
    label.textContent = String(opts.label);
    if (opts.optional) {
      var opt = document.createElement('span');
      opt.className = 'lego-field__optional';
      opt.textContent = opts.optional === true ? '(opcional)' : String(opts.optional);
      label.appendChild(opt);
    }
    field.appendChild(label);
  }
  if (opts.control instanceof HTMLElement) {
    field.appendChild(opts.control);
  } else if (opts.control != null) {
    var text = document.createElement('div');
    text.textContent = String(opts.control);
    field.appendChild(text);
  }
  if (opts.hint) {
    var hint = document.createElement('div');
    hint.className = 'lego-field__hint';
    hint.textContent = String(opts.hint);
    field.appendChild(hint);
  }
  if (opts.error) {
    var err = document.createElement('div');
    err.className = 'lego-field__error';
    err.textContent = String(opts.error);
    field.appendChild(err);
  }
  return field;
}

// -- LegoActionRow -----------------------------------------
// Fila generica de acciones selladas. Recibe botones/nodos.
function LegoActionRow(opts) {
  opts = opts || {};
  if (Array.isArray(opts)) opts = { actions: opts };
  if (!document.getElementById('lego-action-row-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-action-row-styles';
    st.textContent = '.lego-action-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}'
      + '.lego-action-row--end{justify-content:flex-end}'
      + '.lego-action-row--between{justify-content:space-between}'
      + '.lego-action-row__spacer{flex:1 1 auto}';
    document.head.appendChild(st);
  }
  var row = document.createElement('div');
  row.className = 'lego-action-row';
  if (opts.align === 'end') row.classList.add('lego-action-row--end');
  if (opts.align === 'between') row.classList.add('lego-action-row--between');
  if (opts.className) row.className += ' ' + opts.className;
  if (opts.style) row.style.cssText = opts.style;
  function add(item) {
    if (item === 'spacer') {
      var sp = document.createElement('div');
      sp.className = 'lego-action-row__spacer';
      row.appendChild(sp);
    } else if (item instanceof HTMLElement) {
      row.appendChild(item);
    }
  }
  (opts.left || []).forEach(add);
  if (opts.right && opts.right.length) add('spacer');
  (opts.actions || []).forEach(add);
  (opts.right || []).forEach(add);
  return row;
}

// -- LegoStudentVocabulary ---------------------------------
// Lista visual compartida por portal, perfil y Preparar clase.
// El consumidor conserva las acciones y el acceso a datos.
function LegoStudentVocabulary(opts) {
  opts = opts || {};
  var rows = Array.isArray(opts.rows) ? opts.rows : [];
  var state = { letter: '', type: '', q: '' };
  var root = document.createElement('div');
  root.className = 'lego-student-vocabulary';

  var head = document.createElement('div');
  head.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px';
  var title = document.createElement('div');
  title.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--ink)';
  title.replaceChildren(LegoIcon('ti-book'), document.createTextNode(' ' + (opts.title || 'Vocabulario')));
  head.appendChild(title);
  if (typeof opts.onAdd === 'function') {
    var add = document.createElement('button');
    add.type = 'button';
    add.className = 'btn btn-coral btn-sm';
    add.replaceChildren(LegoIcon('ti-plus', { size: 15 }), document.createTextNode(' ' + (opts.addLabel || 'Añadir')));
    add.onclick = opts.onAdd;
    head.appendChild(add);
  }
  root.appendChild(head);

  if (opts.beforeFilters instanceof HTMLElement) root.appendChild(opts.beforeFilters);

  var controls = document.createElement('div');
  controls.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0';
  var search = document.createElement('input');
  search.className = opts.inputClass || 'fi';
  search.placeholder = opts.searchPlaceholder || 'Buscar palabra o significado...';
  search.style.cssText = 'flex:1;min-width:220px';
  controls.appendChild(search);
  controls.appendChild(LegoSelect({
    className: opts.selectClass || 'fs',
    options: [
      { value: '', label: 'Todas' },
      { value: 'word', label: 'Palabras' },
      { value: 'expression', label: 'Expresiones' }
    ],
    onChange: function(v){ state.type = v; renderList(); }
  }));
  root.appendChild(controls);

  var letters = document.createElement('div');
  letters.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px';
  var letterButtons = [];
  function addLetter(label, value) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.cssText = 'min-width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--white);color:var(--muted);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit';
    button.onclick = function(){ state.letter = value; renderList(); };
    letterButtons.push({ value: value, node: button });
    letters.appendChild(button);
  }
  addLetter('Todos', '');
  addLetter('0-9', '#');
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(letter){ addLetter(letter, letter); });
  root.appendChild(letters);

  if (opts.afterFilters instanceof HTMLElement) root.appendChild(opts.afterFilters);

  var currentFiltered = rows.slice();
  var practiceState = { kind: '', limit: 10, flashMode: 'flip' };
  if (typeof opts.onPractice === 'function') {
    var practice = document.createElement('div');
    practice.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-bottom:10px';
    var choices = document.createElement('div');
    choices.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center';
    var practiceControls = document.createElement('div');
    practiceControls.style.cssText = 'display:none;gap:8px;flex-wrap:wrap;align-items:center';
    var practiceButtons = [];
    function renderPracticeControls() {
      practiceControls.replaceChildren();
      practiceButtons.forEach(function(item){ item.node.className = item.kind === practiceState.kind ? 'btn btn-coral btn-sm' : 'btn btn-outline btn-sm'; });
      if (!practiceState.kind) { practiceControls.style.display = 'none'; return; }
      practiceControls.style.display = 'flex';
      var limitSelect = LegoSelect({
        className: opts.selectClass || 'fs',
        value: String(practiceState.limit),
        options: [5, 10, 15, 20].map(function(value){ return { value: value, label: value + ' palabras' }; }),
        onChange: function(value){ practiceState.limit = parseInt(value, 10) || 10; }
      });
      limitSelect.style.width = 'auto';
      practiceControls.appendChild(limitSelect);
      if (practiceState.kind === 'flashcard') {
        var modeSelect = LegoSelect({
          className: opts.selectClass || 'fs',
          value: practiceState.flashMode,
          options: [{ value: 'flip', label: 'Estudiar' }, { value: 'write', label: 'Escribir' }],
          onChange: function(value){ practiceState.flashMode = value || 'flip'; }
        });
        modeSelect.style.width = 'auto';
        practiceControls.appendChild(modeSelect);
      }
      var start = document.createElement('button');
      start.type = 'button';
      start.className = 'btn btn-coral btn-sm';
      start.textContent = 'Empezar';
      start.onclick = function(){
        var available = currentFiltered.filter(function(entry){ return !(opts.packageName && opts.packageName(entry)); });
        if (!available.length && currentFiltered.length && typeof opts.onNoLooseEntries === 'function') return opts.onNoLooseEntries();
        opts.onPractice(practiceState.kind, available, practiceState.limit, practiceState.flashMode);
      };
      practiceControls.appendChild(start);
    }
    [
      ['flashcard', 'Flashcards'],
      ['match', 'Emparejar'],
      ['memory', 'Memory'],
      ['true-false-vocab', 'Correcto / Incorrecto'],
      ['letter-order', 'Ordenar Letras']
    ].forEach(function(definition){
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-outline btn-sm';
      button.textContent = definition[1];
      button.onclick = function(){ practiceState.kind = definition[0]; renderPracticeControls(); };
      practiceButtons.push({ kind: definition[0], node: button });
      choices.appendChild(button);
    });
    practice.appendChild(choices);
    practice.appendChild(practiceControls);
    root.appendChild(practice);
  }

  var count = document.createElement('div');
  count.style.cssText = 'font-size:12px;color:var(--muted);font-weight:600;margin-bottom:6px';
  root.appendChild(count);
  var tableMount = document.createElement('div');
  root.appendChild(tableMount);
  search.addEventListener('input', function(){ state.q = search.value; renderList(); });

  function senses(entry) {
    if (typeof opts.getSenses === 'function') return opts.getSenses(entry) || [];
    if (entry && Array.isArray(entry.senses)) return entry.senses;
    return entry && entry.meaning ? [{ meaning: entry.meaning }] : [];
  }
  function key(value) {
    if (typeof opts.normalize === 'function') return opts.normalize(value);
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }
  function matches(entry) {
    var entrySenses = senses(entry);
    if (state.type && (state.type === 'word' ? entry.entry_type === 'expression' : entry.entry_type !== state.type)) return false;
    if (state.letter) {
      var values = [entry.term].concat(entrySenses.map(function(s){ return s.meaning; }));
      var letterMatch = state.letter === '#'
        ? values.some(function(value){ return /\d/.test(String(value || '').trim().charAt(0)); })
        : values.some(function(value){ return key(value).indexOf(String(state.letter).toLowerCase()) === 0; });
      if (!letterMatch) return false;
    }
    if (state.q) {
      var text = [entry.term, entry.entry_type, entry.source];
      entrySenses.forEach(function(s){
        text.push(s.meaning, s.context, s.example);
        text = text.concat(s.accepted_answers || []);
      });
      if (key(text.join(' ')).indexOf(key(state.q)) === -1) return false;
    }
    return true;
  }
  function pairs(entries) {
    var result = [];
    for (var i = 0; i < entries.length; i += 2) result.push({ left: entries[i], right: entries[i + 1] || null });
    return result;
  }
  function renderList() {
    letterButtons.forEach(function(item){
      var active = item.value === state.letter;
      item.node.style.background = active ? 'var(--coral)' : 'var(--white)';
      item.node.style.borderColor = active ? 'var(--coral)' : 'var(--border)';
      item.node.style.color = active ? '#fff' : 'var(--muted)';
    });
    var filtered = rows.filter(matches).sort(function(a, b){
      return String(a.term || '').localeCompare(String(b.term || ''), 'es', { sensitivity: 'base' });
    });
    currentFiltered = filtered;
    count.textContent = filtered.length + ' de ' + rows.length + ' entradas';
    if (typeof opts.onFiltered === 'function') opts.onFiltered(filtered.slice());
    tableMount.replaceChildren(LegoTable({
      minWidth: 760,
      emptyText: rows.length ? 'Sin resultados para este filtro.' : (opts.emptyText || 'Aún no hay vocabulario guardado.'),
      columns: [
        { label: 'Palabra', width: '22%', render: function(row){ return opts.renderTerm(row.left); } },
        { label: 'Significado', width: '28%', render: function(row){ return opts.renderMeaning(row.left); } },
        { label: 'Palabra', width: '22%', render: function(row){ return opts.renderTerm(row.right); } },
        { label: 'Significado', width: '28%', render: function(row){ return opts.renderMeaning(row.right); } }
      ],
      rows: pairs(filtered)
    }));
  }
  renderList();
  root.refresh = renderList;
  var packageMap = {};
  if (typeof opts.packageName === 'function') {
    rows.forEach(function(entry){
      var name = opts.packageName(entry);
      if (!name) return;
      if (!packageMap[name]) packageMap[name] = [];
      packageMap[name].push(entry);
    });
  }
  var packageNames = Object.keys(packageMap).sort(function(a, b){ return a.localeCompare(b, 'es', { sensitivity: 'base' }); });
  if (!packageNames.length || typeof opts.onPractice !== 'function') return root;
  var packagePanel = document.createElement('div');
  var packageSelect = LegoSelect({
    className: opts.selectClass || 'fs',
    value: packageNames[0],
    options: packageNames.map(function(name){ return { value: name, label: name + ' (' + packageMap[name].length + ')' }; }),
    onChange: renderPackage
  });
  packagePanel.appendChild(packageSelect);
  var packageBody = document.createElement('div');
  packageBody.style.marginTop = '10px';
  packagePanel.appendChild(packageBody);
  var packagePracticeState = { limit: 10, flashMode: 'flip' };
  function renderPackage(name) {
    var selectedName = name || packageNames[0];
    var entries = packageMap[selectedName] || [];
    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px';
    var packageLimit = LegoSelect({
      className: opts.selectClass || 'fs',
      value: String(packagePracticeState.limit),
      options: [5, 10, 15, 20].map(function(value){ return { value: value, label: value + ' palabras' }; }),
      onChange: function(value){ packagePracticeState.limit = parseInt(value, 10) || 10; }
    });
    packageLimit.style.width = 'auto';
    actions.appendChild(packageLimit);
    var packageMode = LegoSelect({
      className: opts.selectClass || 'fs',
      value: packagePracticeState.flashMode,
      options: [{ value: 'flip', label: 'Flashcards: estudiar' }, { value: 'write', label: 'Flashcards: escribir' }],
      onChange: function(value){ packagePracticeState.flashMode = value || 'flip'; }
    });
    packageMode.style.width = 'auto';
    actions.appendChild(packageMode);
    [['flashcard', 'Flashcards'], ['match', 'Emparejar'], ['memory', 'Memory'], ['true-false-vocab', 'Correcto / Incorrecto'], ['letter-order', 'Ordenar Letras']].forEach(function(definition){
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-outline btn-sm';
      button.textContent = definition[1];
      button.onclick = function(){ opts.onPractice(definition[0], entries, packagePracticeState.limit, packagePracticeState.flashMode); };
      actions.appendChild(button);
    });
    packageBody.replaceChildren(actions, LegoTable({
      minWidth: 760,
      emptyText: 'Este paquete no tiene entradas.',
      columns: [
        { label: 'Palabra', width: '22%', render: function(row){ return opts.renderTerm(row.left); } },
        { label: 'Significado', width: '28%', render: function(row){ return opts.renderMeaning(row.left); } },
        { label: 'Palabra', width: '22%', render: function(row){ return opts.renderTerm(row.right); } },
        { label: 'Significado', width: '28%', render: function(row){ return opts.renderMeaning(row.right); } }
      ],
      rows: pairs(entries)
    }));
  }
  renderPackage(packageNames[0]);
  return LegoInnerHub({
    tabs: [
      { id: 'todo', label: 'Todo', content: root, onShow: renderList },
      { id: 'paquetes', label: 'Paquetes', content: packagePanel }
    ],
    default: 'todo'
  });
}

// -- LegoVocabularyEntryForm -------------------------------
// Formulario compartido de vocabulario canonico: termino en espanol,
// significados en ingles y un ejemplo opcional por significado.
// No conoce estudiante, Banco ni Supabase: entrega un value normalizado al caller.
//   LegoVocabularyEntryForm({ value, readOnly, onSubmit, onCancel }) -> nodo DOM
//   value: { term, entry_type, senses:[{meaning,example,locked}] }
function LegoVocabularyEntryForm(opts) {
  opts = opts || {};
  var value = opts.value || {};
  if (!document.getElementById('lego-vocabulary-entry-form-styles')) {
    var st = document.createElement('style');
    st.id = 'lego-vocabulary-entry-form-styles';
    st.textContent = '.lego-vocab-form{display:flex;flex-direction:column;gap:14px;color:var(--ink,#1C1A17)}'
      + '.lego-vocab-control{width:100%;box-sizing:border-box;border:1.5px solid var(--border,#DDD7CE);border-radius:var(--r,10px);padding:10px 12px;background:var(--white,#fff);color:var(--ink,#1C1A17);font:inherit;font-size:14px;outline:none}'
      + '.lego-vocab-control:focus{border-color:var(--coral,#D4522A)}'
      + '.lego-vocab-control:disabled{background:var(--sand,#F5F0E8);color:var(--muted,#8C8479)}'
      + '.lego-vocab-senses-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-soft,#5E554A)}'
      + '.lego-vocab-senses{display:flex;flex-direction:column;gap:10px}'
      + '.lego-vocab-sense{border:1.5px solid var(--border,#DDD7CE);border-radius:var(--r,10px);padding:12px;background:var(--white,#fff)}'
      + '.lego-vocab-sense.is-locked{background:var(--sand,#F5F0E8)}'
      + '.lego-vocab-sense-line{display:flex;align-items:center;gap:8px;margin-bottom:10px}'
      + '.lego-vocab-sense-line .lego-vocab-control{flex:1;min-width:0}'
      + '.lego-vocab-note{font-size:12px;line-height:1.4;color:var(--muted,#8C8479);background:var(--sand,#F5F0E8);border-radius:var(--r,10px);padding:9px 11px}'
      + '.lego-vocab-error{display:none;font-size:12px;font-weight:700;color:var(--red,#C0392B)}';
    document.head.appendChild(st);
  }

  var root = document.createElement('div'); root.className = 'lego-vocab-form';
  var term = document.createElement('input'); term.className = 'lego-vocab-control'; term.value = value.term || ''; term.placeholder = 'ej. esperar';
  term.disabled = !!opts.readOnly || !!opts.termLocked;
  root.appendChild(LegoField({ label: 'Español', control: term, compact: true }));

  if (opts.notice) {
    var notice = document.createElement('div'); notice.className = 'lego-vocab-note'; notice.textContent = String(opts.notice); root.appendChild(notice);
  }

  var sensesTitle = document.createElement('div'); sensesTitle.className = 'lego-vocab-senses-title'; sensesTitle.textContent = 'Significados en inglés';
  root.appendChild(sensesTitle);
  var sensesWrap = document.createElement('div'); sensesWrap.className = 'lego-vocab-senses'; root.appendChild(sensesWrap);
  var rows = [];

  function updateRows(){
    rows.forEach(function(row){
      row.remove.style.visibility = (!opts.readOnly && !row.locked && rows.length > 1) ? 'visible' : 'hidden';
    });
  }

  function addSense(data){
    data = data || {};
    var locked = !!data.locked || !!opts.readOnly;
    var row = document.createElement('div'); row.className = 'lego-vocab-sense' + (locked ? ' is-locked' : '');
    var line = document.createElement('div'); line.className = 'lego-vocab-sense-line';
    var meaning = document.createElement('input'); meaning.className = 'lego-vocab-control'; meaning.value = data.meaning || ''; meaning.placeholder = 'ej. wait'; meaning.disabled = locked;
    var remove = LegoButton({ variant: 'ghost', size: 'sm', icon: 'ti-trash', title: 'Eliminar significado' });
    line.replaceChildren(meaning, remove);
    var example = document.createElement('input'); example.className = 'lego-vocab-control'; example.value = data.example || ''; example.placeholder = 'ej. Espero el autobús.'; example.disabled = locked;
    row.appendChild(line);
    row.appendChild(LegoField({ label: 'Ejemplo', control: example, optional: true, compact: true }));
    var record = {
      el: row,
      remove: remove,
      meaning: meaning,
      example: example,
      context: data.context || '',
      accepted_answers: Array.isArray(data.accepted_answers) ? data.accepted_answers.slice() : [],
      locked: locked,
      bank_sense_id: data.bank_sense_id || null
    };
    remove.onclick = function(){
      if (locked || rows.length <= 1) return;
      rows = rows.filter(function(r){ return r !== record; });
      row.remove();
      updateRows();
    };
    rows.push(record);
    sensesWrap.appendChild(row);
    updateRows();
  }

  var initial = Array.isArray(value.senses) && value.senses.length ? value.senses : [{ meaning: value.meaning || '' }];
  initial.forEach(addSense);

  if (!opts.readOnly) {
    var add = LegoButton({ label: 'Añadir otro significado', variant: 'outline', size: 'sm', icon: 'ti-plus', onClick: function(){ addSense({}); } });
    root.appendChild(add);
  }

  var error = document.createElement('div'); error.className = 'lego-vocab-error'; root.appendChild(error);
  root.setError = function(message){
    error.textContent = message || '';
    error.style.display = message ? 'block' : 'none';
  };
  root.getValue = function(){
    var cleanTerm = term.value.trim();
    return {
      term: cleanTerm,
      entry_type: /\s/.test(cleanTerm) ? 'expression' : (value.entry_type || 'word'),
      senses: rows.map(function(row){
        return {
          bank_sense_id: row.bank_sense_id,
          locked: row.locked,
          meaning: row.meaning.value.trim(),
          context: row.context,
          example: row.example.value.trim(),
          accepted_answers: row.accepted_answers.slice()
        };
      })
    };
  };

  var actions = [];
  if (typeof opts.onCancel === 'function') {
    actions.push(LegoButton({ label: opts.readOnly ? 'Cerrar' : 'Cancelar', variant: 'outline', size: 'sm', onClick: opts.onCancel }));
  }
  if (!opts.readOnly && typeof opts.onSubmit === 'function') {
    var save = LegoButton({ label: opts.submitLabel || 'Añadir', variant: 'primary', size: 'sm' });
    save.onclick = async function(){
      root.setError('');
      save.disabled = true;
      try { await opts.onSubmit(root.getValue(), root); }
      finally { if (root.isConnected) save.disabled = false; }
    };
    actions.push(save);
  }
  if (actions.length) root.appendChild(LegoActionRow({ actions: actions, align: 'end' }));
  return root;
}
