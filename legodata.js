// ============================================================
// LegoData — el Lego de los DATOS de Letra Caribe
// ============================================================
// La UI tiene Legos (components.js); esta es la capa hermana para Supabase.
// REGLA: los paneles NO consultan Supabase directo para las tablas cubiertas
// aqui. Piden a LegoData. Una tabla = una forma de leerla = un solo lugar
// que arreglar cuando cambie el esquema.
//
// CONTRATO de cada helper:
//   - async; devuelve datos ya normalizados (array u objeto), nunca la
//     respuesta cruda de Supabase.
//   - si Supabase da error: LANZA (throw). El panel decide como mostrarlo
//     (los paneles ya tienen sus try/catch).
//   - no toca estado global ni DOM. Recibe parametros, devuelve datos.
//   - agregar un helper = agregar una funcion aqui; NUNCA escribir la query
//     en el panel "mientras tanto".
//
// Usa el cliente global `db` (creado en cada panel tras cargar este archivo).
// Migracion: incremental — las queries viejas de los paneles se mueven aqui
// cuando se toquen (mismo patron que LegoTable). Las NUEVAS nacen aqui.

var LegoData = (function(){

  function _throw(where, error){
    var e = new Error('[LegoData.' + where + '] ' + (error && error.message ? error.message : String(error)));
    e.cause = error;
    throw e;
  }

  return {

    // ── nucleo ──────────────────────────────────────────────

    students: async function(){
      var r = await db.from('students').select('*').order('full_name');
      if (r.error) _throw('students', r.error);
      return r.data || [];
    },

    activities: async function(opts){
      opts = opts || {};
      var ob = opts.orderBy || 'created_at';
      var asc = opts.orderBy ? (opts.ascending !== false) : false;
      var r = await db.from('activities').select(opts.columns || '*').order(ob, { ascending: asc });
      if (r.error) _throw('activities', r.error);
      return r.data || [];
    },

    // Resuelve actividades por id PRESERVANDO el orden de la lista pedida
    // (los pasos de una leccion son una lista ordenada de ids).
    activitiesByIds: async function(ids){
      ids = ids || [];
      if (!ids.length) return [];
      var r = await db.from('activities').select('*').in('id', ids);
      if (r.error) _throw('activitiesByIds', r.error);
      var byId = {};
      (r.data || []).forEach(function(a){ byId[String(a.id)] = a; });
      return ids.map(function(id){ return byId[String(id)] || null; }).filter(function(a){ return a; });
    },

    activityByKey: async function(key){
      if (!key) return null;
      var value = String(key);
      var isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      var q = db.from('activities').select('*').limit(1);
      q = isUuid ? q.eq('id', value) : q.eq('slug', value);
      var r = await q;
      if (r.error) _throw('activityByKey', r.error);
      return (r.data || [])[0] || null;
    },

    insertActivity: async function(row){
      var r = await db.from('activities').insert(row).select();
      if (r.error) _throw('insertActivity', r.error);
      return r.data && r.data[0];
    },

    updateActivity: async function(id, patch){
      var r = await db.from('activities').update(patch).eq('id', id).select();
      if (r.error) _throw('updateActivity', r.error);
      if (!r.data || !r.data.length) _throw('updateActivity', { message: 'RLS bloqueo el update (0 filas) en actividad ' + id });
      return r.data[0];
    },
    reassignActivitiesCategory: async function(fromCategoryId, toCategoryId){
      var r = await db.from('activities').update({ grammar_category_id: toCategoryId || null }).eq('grammar_category_id', fromCategoryId).select('id');
      if (r.error) _throw('reassignActivitiesCategory', r.error);
      return r.data || [];
    },

    grammarCategories: async function(){
      var r = await db.from('grammar_categories').select('*').order('name');
      if (r.error) _throw('grammarCategories', r.error);
      return r.data || [];
    },

    // ── assignments ─────────────────────────────────────────

    // Con la actividad Y la leccion embebidas (una asignacion apunta a una u otra).
    assignmentsByStudent: async function(studentId){
      var r = await db.from('assignments').select('*, activities(*), lessons(*)').eq('student_id', studentId).order('assigned_at', { ascending: false });
      if (r.error) _throw('assignmentsByStudent', r.error);
      return r.data || [];
    },

    assignmentsByStudents: async function(studentIds){
      var ids = (studentIds || []).filter(Boolean);
      if (!ids.length) return [];
      var r = await db.from('assignments').select('*, activities(*), lessons(*)').in('student_id', ids).order('assigned_at', { ascending: false });
      if (r.error) _throw('assignmentsByStudents', r.error);
      return r.data || [];
    },

    assignmentsAll: async function(){
      var r = await db.from('assignments').select('*, students(full_name,level), activities(title,slug,level), lessons(title,level)').order('assigned_at', { ascending: false });
      if (r.error) _throw('assignmentsAll', r.error);
      return r.data || [];
    },

    assignmentsAllPlain: async function(){
      var r = await db.from('assignments').select('*').order('assigned_at', { ascending: false });
      if (r.error) _throw('assignmentsAllPlain', r.error);
      return r.data || [];
    },

    insertAssignments: async function(rows){
      var r = await db.from('assignments').insert(rows);
      if (r.error) _throw('insertAssignments', r.error);
      return true;
    },

    updateAssignment: async function(id, patch){
      var r = await db.from('assignments').update(patch).eq('id', id).select();
      if (r.error) _throw('updateAssignment', r.error);
      // .select() devuelve las filas afectadas: si RLS bloqueo en silencio, avisamos.
      if (!r.data || !r.data.length) _throw('updateAssignment', { message: 'RLS bloqueo el update (0 filas afectadas) en assignment ' + id });
      return r.data[0];
    },

    // ── responses ───────────────────────────────────────────

    insertResponses: async function(rows){
      if (!rows || !rows.length) return true;
      var r = await db.from('responses').insert(rows);
      if (r.error) _throw('insertResponses', r.error);
      return true;
    },

    responsesAll: async function(){
      var r = await db.from('responses').select('*').order('submitted_at', { ascending: false });
      if (r.error) _throw('responsesAll', r.error);
      return r.data || [];
    },

        unreviewedResponsesAll: async function(){
      // Trae la leccion embebida (assignment -> lesson) para agrupar los pasos de una leccion como 1 en Por revisar.
      // Fallback sin embed si PostgREST no resuelve la relacion (no rompe el panel).
      var sel = '*, assignments(lesson_id, lessons(id,title))';
      var r = await db.from('responses').select(sel).eq('reviewed', false).order('submitted_at', { ascending: false });
      if (r.error) {
        var r2 = await db.from('responses').select('*').eq('reviewed', false).order('submitted_at', { ascending: false });
        if (r2.error) _throw('unreviewedResponsesAll', r2.error);
        return r2.data || [];
      }
      return r.data || [];
    },

    responsesByAssignment: async function(assignmentId){
      var r = await db.from('responses').select('*').eq('assignment_id', assignmentId).order('question_num');
      if (r.error) _throw('responsesByAssignment', r.error);
      return r.data || [];
    },

    // Regla unica de revision: para estudiante + contenido, mostrar solo la
    // asignacion cuyo max(submitted_at) sea el mas reciente. Las respuestas
    // historicas sin assignment_id se descartan y nunca compiten.
    responsesLatestAttempt: async function(studentId, activitySlug){
      var r = await db.from('responses').select('*')
        .eq('student_id', studentId)
        .eq('activity_slug', activitySlug)
        .not('assignment_id', 'is', null)
        .order('submitted_at', { ascending: false });
      if (r.error) _throw('responsesLatestAttempt', r.error);
      var groups = {};
      (r.data || []).forEach(function(row){
        if (row.assignment_id == null) return;
        var key = String(row.assignment_id);
        if (!groups[key]) groups[key] = { rows: [], latest: -Infinity };
        groups[key].rows.push(row);
        var stamp = row.submitted_at ? new Date(row.submitted_at).getTime() : -Infinity;
        if (!isNaN(stamp) && stamp > groups[key].latest) groups[key].latest = stamp;
      });
      var latest = null;
      Object.keys(groups).forEach(function(key){
        var group = groups[key];
        if (!latest || group.latest > latest.latest) latest = group;
      });
      if (!latest) return [];
      return latest.rows.slice().sort(function(a, b){ return (a.question_num || 0) - (b.question_num || 0); });
    },

    // Fallback para respuestas viejas (sin assignment_id): por estudiante + slug.
    responsesByStudentSlug: async function(studentId, slug){
      var r = await db.from('responses').select('*').eq('student_id', studentId).eq('activity_slug', slug).order('question_num');
      if (r.error) _throw('responsesByStudentSlug', r.error);
      return r.data || [];
    },

    responsesByStudent: async function(studentId){
      var r = await db.from('responses').select('*').eq('student_id', studentId).order('submitted_at', { ascending: false });
      if (r.error) _throw('responsesByStudent', r.error);
      return r.data || [];
    },

        unreviewedResponsesByStudent: async function(studentId){
      // Embed de leccion (assignment -> lesson) para agrupar los pasos de una leccion como 1 en Preparar clase.
      // Fallback sin embed si PostgREST no resuelve la relacion (no rompe el panel).
      var sel = '*, assignments(lesson_id, lessons(id,title))';
      var r = await db.from('responses').select(sel).eq('student_id', studentId).eq('reviewed', false).order('submitted_at', { ascending: false });
      if (r.error) {
        var r2 = await db.from('responses').select('*').eq('student_id', studentId).eq('reviewed', false).order('submitted_at', { ascending: false });
        if (r2.error) _throw('unreviewedResponsesByStudent', r2.error);
        return r2.data || [];
      }
      return r.data || [];
    },

    // Filas de respuesta normalizadas al formato que LegoPlayer(review) espera.
    toSavedRows: function(responses){
      return (responses || []).map(function(r){
        return { answer: r.answer, isCorrect: r.is_correct, questionText: r.question_text };
      });
    },

    // ── lessons ─────────────────────────────────────────────

    // Contrato canonico de pasos de leccion (Plato 4): `steps` manda cuando
    // existe y no esta vacio. Las lecciones antiguas se derivan de activity_ids
    // sin mutar el registro; al volver a guardarlas quedan migradas al modelo nuevo.
    lessonSteps: function(lesson){
      lesson = lesson || {};
      var raw = lesson.steps;
      if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch(e) { raw = null; } }
      if (Array.isArray(raw) && raw.length) {
        return raw.map(function(step){
          step = step || {};
          if (step.kind === 'vocab') {
            return {
              kind: 'vocab',
              format: step.format || 'match',
              source: step.source || 'bank',
              bank_ids: Array.isArray(step.bank_ids) ? step.bank_ids.filter(function(id){ return id != null; }) : [],
              title: step.title || ''
            };
          }
          if (step.id == null) return null;
          return { kind: 'activity', id: step.id };
        }).filter(function(step){ return step; });
      }
      var ids = lesson.activity_ids;
      if (typeof ids === 'string') { try { ids = JSON.parse(ids); } catch(e) { ids = []; } }
      if (!Array.isArray(ids)) ids = [];
      return ids.filter(function(id){ return id != null; }).map(function(id){ return { kind: 'activity', id: id }; });
    },

    lessons: async function(){
      var r = await db.from('lessons').select('*').order('created_at', { ascending: false });
      if (r.error) _throw('lessons', r.error);
      return (r.data || []).map(function(l){
        if (typeof l.activity_ids === 'string') { try { l.activity_ids = JSON.parse(l.activity_ids); } catch(e) { l.activity_ids = []; } }
        if (!Array.isArray(l.activity_ids)) l.activity_ids = [];
        return l;
      });
    },

    insertLesson: async function(lesson){
      var r = await db.from('lessons').insert(lesson).select();
      if (r.error) _throw('insertLesson', r.error);
      return r.data && r.data[0];
    },

    updateLesson: async function(id, patch){
      var r = await db.from('lessons').update(patch).eq('id', id).select();
      if (r.error) _throw('updateLesson', r.error);
      if (!r.data || !r.data.length) _throw('updateLesson', { message: 'RLS bloqueo el update (0 filas) en lesson ' + id });
      return r.data[0];
    },

        deleteLesson: async function(id){
      // Borrado en cadena: responses -> assignments -> lesson.
      // Decidido 2026-07-14: borrar una leccion arrastra las respuestas de quienes ya la hicieron.
      var asg = await db.from('assignments').select('id').eq('lesson_id', id);
      if (asg.error) _throw('deleteLesson.assignments', asg.error);
      var ids = (asg.data || []).map(function(a){ return a.id; });
      if (ids.length){
        var rr = await db.from('responses').delete().in('assignment_id', ids).select('id');
        if (rr.error) _throw('deleteLesson.responses', rr.error);
        var ra = await db.from('assignments').delete().eq('lesson_id', id).select('id');
        if (ra.error) _throw('deleteLesson.assignmentsDel', ra.error);
      }
      var r = await db.from('lessons').delete().eq('id', id).select('id');
      if (r.error) _throw('deleteLesson', r.error);
      if (!r.data || !r.data.length) _throw('deleteLesson', { message: 'RLS bloqueo o leccion inexistente ' + id });
      return true;
    }

  };
})();

// ── clases y finanzas ───────────────────────────────────
// Regla de contrato aqui: operaciones POR ID lanzan si afectaron 0 filas
// (RLS silencioso detectado); operaciones POR CONJUNTO (bulk/series/filtros)
// devuelven las filas afectadas y el caller decide que significa 0.

LegoData.classCredits = async function(){
  var r = await db.from('class_credits').select('*').order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCredits] ' + r.error.message); }
  return r.data || [];
};
LegoData.classCreditsByYear = async function(year){
  var y = Number(year) || new Date().getFullYear();
  var fromDate = y + '-01-01';
  var nextDate = (y + 1) + '-01-01';
  var r = await db.from('class_credits')
    .select('*')
    .or('and(paid_at.gte.' + fromDate + ',paid_at.lt.' + nextDate + '),and(paid_at.is.null,created_at.gte.' + fromDate + ',created_at.lt.' + nextDate + ')')
    .order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCreditsByYear] ' + r.error.message); }
  return r.data || [];
};
LegoData.classCreditsByStudent = async function(studentId){
  var r = await db.from('class_credits').select('*').eq('student_id', studentId).order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCreditsByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.classCreditsWithAccountByStudent = async function(studentId){
  var r = await db.from('class_credits_with_account').select('*').eq('student_id', studentId).order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCreditsWithAccountByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.classCreditsByStudentYear = async function(studentId, year){
  if (!studentId) { throw new Error('[LegoData.classCreditsByStudentYear] Falta studentId'); }
  if (String(year || '').toLowerCase() === 'all') return LegoData.classCreditsWithAccountByStudent(studentId);
  var y = Number(year) || new Date().getFullYear();
  var fromDate = y + '-01-01';
  var nextDate = (y + 1) + '-01-01';
  var r = await db.from('class_credits_with_account')
    .select('*')
    .eq('student_id', studentId)
    .or('and(paid_at.gte.' + fromDate + ',paid_at.lt.' + nextDate + '),and(paid_at.is.null,created_at.gte.' + fromDate + ',created_at.lt.' + nextDate + ')')
    .order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCreditsByStudentYear] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertClassCredit = async function(row){
  var r = await db.from('class_credits').insert(row).select();
  if (r.error) { throw new Error('[LegoData.insertClassCredit] ' + r.error.message); }
  return r.data || [];
};
LegoData.updateClassCredit = async function(id, patch){
  var r = await db.from('class_credits').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateClassCredit] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateClassCredit] RLS bloqueo el update (0 filas) en credit ' + id); }
  return r.data[0];
};
LegoData.deleteClassCredit = async function(id){
  var r = await db.from('class_credits').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteClassCredit] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteClassCredit] RLS bloqueo el delete (0 filas) en credit ' + id); }
  return r.data;
};
LegoData.paymentAccounts = async function(opts){
  opts = opts || {};
  var q = db.from('payment_accounts').select('id,name,currency,active,sort_order,created_at').order('sort_order', { ascending: true }).order('name', { ascending: true });
  if (!opts.includeInactive) q = q.eq('active', true);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.paymentAccounts] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      id: row.id,
      name: row.name || '',
      currency: row.currency || '',
      active: row.active !== false,
      sort_order: Number(row.sort_order) || 100,
      created_at: row.created_at || null
    };
  });
};
LegoData.insertPaymentAccount = async function(row){
  var r = await db.from('payment_accounts').insert(row).select('id,name,currency,active,sort_order,created_at');
  if (r.error) { throw new Error('[LegoData.insertPaymentAccount] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.insertPaymentAccount] No se creó la cuenta'); }
  return r.data[0];
};

LegoData.classSessions = async function(){
  var r = await db.from('class_sessions').select('*').order('class_date', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classSessions] ' + r.error.message); }
  return r.data || [];
};
LegoData.classSessionsByStudent = async function(studentId){
  var r = await db.from('class_sessions').select('*').eq('student_id', studentId).order('class_date', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classSessionsByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.classSessionsByStudentYear = async function(studentId, year){
  if (!studentId) { throw new Error('[LegoData.classSessionsByStudentYear] Falta studentId'); }
  if (String(year || '').toLowerCase() === 'all') return LegoData.classSessionsByStudent(studentId);
  var y = Number(year) || new Date().getFullYear();
  var fromDate = y + '-01-01';
  var nextDate = (y + 1) + '-01-01';
  var r = await db.from('class_sessions')
    .select('*')
    .eq('student_id', studentId)
    .gte('class_date', fromDate)
    .lt('class_date', nextDate)
    .order('class_date', { ascending: false })
    .order('class_time', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classSessionsByStudentYear] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentClassLedger = async function(studentId){
  if (!studentId) { throw new Error('[LegoData.studentClassLedger] Falta studentId'); }
  var result = await Promise.all([
    LegoData.classCreditsByStudent(studentId),
    LegoData.classSessionsByStudent(studentId)
  ]);
  return {
    credits: result[0] || [],
    sessions: result[1] || []
  };
};
LegoData.studentClassLedgerByYear = async function(studentId, year){
  if (!studentId) { throw new Error('[LegoData.studentClassLedgerByYear] Falta studentId'); }
  var result = await Promise.all([
    LegoData.classCreditsByStudentYear(studentId, year),
    LegoData.classSessionsByStudentYear(studentId, year)
  ]);
  return {
    credits: result[0] || [],
    sessions: result[1] || []
  };
};
LegoData.studentClassLedgerYears = async function(studentId){
  if (!studentId) { throw new Error('[LegoData.studentClassLedgerYears] Falta studentId'); }
  var result = await Promise.all([
    db.from('class_sessions').select('class_date').eq('student_id', studentId),
    db.from('class_credits').select('paid_at,created_at').eq('student_id', studentId)
  ]);
  if (result[0].error) { throw new Error('[LegoData.studentClassLedgerYears:sessions] ' + result[0].error.message); }
  if (result[1].error) { throw new Error('[LegoData.studentClassLedgerYears:credits] ' + result[1].error.message); }
  var yearMap = {};
  (result[0].data || []).forEach(function(row){
    var y = String(row.class_date || '').slice(0, 4);
    if (y) yearMap[y] = true;
  });
  (result[1].data || []).forEach(function(row){
    var y = String(row.paid_at || row.created_at || '').slice(0, 4);
    if (y) yearMap[y] = true;
  });
  return Object.keys(yearMap).sort(function(a, b){ return String(b).localeCompare(String(a)); });
};
LegoData.classSessionsByRange = async function(fromDate, toDate){
  if (!fromDate || !toDate) { throw new Error('[LegoData.classSessionsByRange] Falta rango'); }
  var r = await db.from('class_sessions')
    .select('*')
    .gte('class_date', fromDate)
    .lte('class_date', toDate)
    .order('class_date', { ascending: true })
    .order('class_time', { ascending: true });
  if (r.error) { throw new Error('[LegoData.classSessionsByRange] ' + r.error.message); }
  return r.data || [];
};
LegoData.classPrepSessionsByDate = async function(date){
  if (!date) { throw new Error('[LegoData.classPrepSessionsByDate] Falta fecha'); }
  var r = await db.from('class_sessions')
    .select('*')
    .eq('class_date', date)
    .eq('cancelled', false)
    .not('student_id', 'is', null)
    .order('class_time', { ascending: true });
  if (r.error) { throw new Error('[LegoData.classPrepSessionsByDate] ' + r.error.message); }
  var rows = r.data || [];
  var ids = Array.from(new Set(rows.map(function(sess){ return sess.student_id; }).filter(Boolean).map(String)));
  if (!ids.length) return rows;
  var p = await db.from('students')
    .select('id,full_name,level,status,exclude_from_stats')
    .in('id', ids);
  if (p.error) { throw new Error('[LegoData.classPrepSessionsByDate:students] ' + p.error.message); }
  var byId = {};
  (p.data || []).forEach(function(student){ byId[String(student.id)] = student; });
  return rows.map(function(sess){
    sess.student = byId[String(sess.student_id)] || null;
    return sess;
  });
};
LegoData.classSessionsByCalendarUids = async function(studentId, uids){
  if (!uids || !uids.length) return [];
  var r = await db.from('class_sessions').select('id,calendar_uid').eq('student_id', studentId).in('calendar_uid', uids);
  if (r.error) { throw new Error('[LegoData.classSessionsByCalendarUids] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertClassSession = async function(row){
  var r = await db.from('class_sessions').insert(row).select();
  if (r.error) { throw new Error('[LegoData.insertClassSession] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertClassSessions = async function(rows){
  if (!rows || !rows.length) return [];
  var r = await db.from('class_sessions').insert(rows).select();
  if (r.error) { throw new Error('[LegoData.insertClassSessions] ' + r.error.message); }
  return r.data || [];
};
LegoData.updateClassSession = async function(id, patch){
  var r = await db.from('class_sessions').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateClassSession] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateClassSession] RLS bloqueo el update (0 filas) en session ' + id); }
  return r.data[0];
};
LegoData.setClassSessionCancelled = async function(id, cancelled){
  var r = await db.from('class_sessions').update({ cancelled: !!cancelled }).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.setClassSessionCancelled] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.setClassSessionCancelled] RLS bloqueo el update (0 filas) en session ' + id); }
  return r.data[0];
};
LegoData.deleteClassSession = async function(id){
  var r = await db.from('class_sessions').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteClassSession] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteClassSession] RLS bloqueo el delete (0 filas) en session ' + id); }
  return r.data;
};

LegoData.classBoardBySession = async function(sessionId){
  if (!sessionId) return null;
  var r = await db.from('class_session_boards').select('*').eq('session_id', sessionId);
  if (r.error) { throw new Error('[LegoData.classBoardBySession] ' + r.error.message); }
  return (r.data || [])[0] || null;
};

LegoData.classBoardsBySessionIds = async function(sessionIds, opts){
  opts = opts || {};
  var ids = (sessionIds || []).filter(function(id){ return id !== null && id !== undefined; }).map(function(id){ return String(id); });
  if (!ids.length) return [];
  var q = db.from('class_session_boards').select('*').in('session_id', ids).order('updated_at', { ascending: false });
  if (opts.visibleOnly) q = q.eq('visible_to_student', true);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.classBoardsBySessionIds] ' + r.error.message); }
  return r.data || [];
};
LegoData.previousClassBoardForStudent = async function(studentId, beforeDate, beforeTime, currentSessionId){
  if (!studentId || !beforeDate) return null;
  var sessions = await db.from('class_sessions')
    .select('id,class_date,class_time')
    .eq('student_id', studentId)
    .lt('class_date', beforeDate)
    .order('class_date', { ascending: false })
    .order('class_time', { ascending: false })
    .limit(40);
  if (sessions.error) { throw new Error('[LegoData.previousClassBoardForStudent:sessions] ' + sessions.error.message); }
  var ids = (sessions.data || []).filter(function(row){ return String(row.id) !== String(currentSessionId); }).map(function(row){ return row.id; });
  if (beforeTime) {
    var sameDay = await db.from('class_sessions')
      .select('id,class_date,class_time')
      .eq('student_id', studentId)
      .eq('class_date', beforeDate)
      .lt('class_time', beforeTime)
      .order('class_time', { ascending: false })
      .limit(10);
    if (sameDay.error) { throw new Error('[LegoData.previousClassBoardForStudent:sameDay] ' + sameDay.error.message); }
    ids = (sameDay.data || []).filter(function(row){ return String(row.id) !== String(currentSessionId); }).map(function(row){ return row.id; }).concat(ids);
  }
  var rows = await LegoData.classBoardsBySessionIds(ids);
  var bySession = {};
  (rows || []).forEach(function(row){ bySession[String(row.session_id)] = row; });
  for (var i = 0; i < ids.length; i++) {
    if (bySession[String(ids[i])]) return bySession[String(ids[i])];
  }
  return null;
};

LegoData.saveClassBoard = async function(sessionId, boardData, visibleToStudent){
  if (!sessionId) { throw new Error('[LegoData.saveClassBoard] Falta sessionId'); }
  var row = {
    session_id: sessionId,
    board_data: boardData || { version: 1, strokes: [], texts: [], shapes: [] },
    visible_to_student: !!visibleToStudent,
    updated_at: new Date().toISOString()
  };
  var r = await db.from('class_session_boards').upsert(row, { onConflict: 'session_id' }).select();
  if (r.error) { throw new Error('[LegoData.saveClassBoard] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.saveClassBoard] RLS bloqueo el upsert (0 filas) en session ' + sessionId); }
  return r.data[0];
};

LegoData.deleteClassBoardBySession = async function(sessionId){
  if (!sessionId) { throw new Error('[LegoData.deleteClassBoardBySession] Falta sessionId'); }
  var r = await db.from('class_session_boards').delete().eq('session_id', sessionId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteClassBoardBySession] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteClassSeries = async function(seriesId, fromDate){
  var r = await db.from('class_sessions').delete().eq('series_id', seriesId).gte('class_date', fromDate).select();
  if (r.error) { throw new Error('[LegoData.deleteClassSeries] ' + r.error.message); }
  return r.data || [];
};

LegoData.eventCategories = async function(){
  var r = await db.from('event_categories').select('*').order('name');
  if (r.error) { throw new Error('[LegoData.eventCategories] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertEventCategory = async function(row){
  var r = await db.from('event_categories').insert(row).select();
  if (r.error) { throw new Error('[LegoData.insertEventCategory] ' + r.error.message); }
  return r.data || [];
};
LegoData.updateEventCategory = async function(id, patch){
  var r = await db.from('event_categories').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateEventCategory] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateEventCategory] RLS bloqueo el update (0 filas) en category ' + id); }
  return r.data[0];
};
LegoData.deleteEventCategory = async function(id){
  var r = await db.from('event_categories').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteEventCategory] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteEventCategory] RLS bloqueo el delete (0 filas) en category ' + id); }
  return r.data;
};

LegoData.studentAliases = async function(){
  var r = await db.from('student_aliases').select('*').order('alias');
  if (r.error) { throw new Error('[LegoData.studentAliases] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentAliasesByStudent = async function(studentId){
  var r = await db.from('student_aliases').select('*').eq('student_id', studentId).order('alias');
  if (r.error) { throw new Error('[LegoData.studentAliasesByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.upsertStudentAlias = async function(payload){
  var r = await db.from('student_aliases').upsert(payload, { onConflict: 'alias_key' }).select();
  if (r.error) { throw new Error('[LegoData.upsertStudentAlias] ' + r.error.message); }
  return r.data || [];
};

function normalizeBillingGroup(row){
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    responsible_student_id: row.responsible_student_id || null,
    starts_on: row.starts_on || null,
    active: row.active !== false,
    created_at: row.created_at || null
  };
}
function normalizeBillingGroupBalance(row){
  if (!row) return null;
  return {
    group_id: row.group_id,
    group_name: row.group_name || '',
    responsible_student_id: row.responsible_student_id || null,
    responsible_student_name: row.responsible_student_name || '',
    starts_on: row.starts_on || null,
    active: row.active !== false,
    total_paid_units: Number(row.total_paid_units) || 0,
    total_given_units: Number(row.total_given_units) || 0,
    total_future_units: Number(row.total_future_units) || 0,
    remaining_units: Number(row.remaining_units) || 0
  };
}
function normalizeBillingGroupMember(row){
  if (!row) return null;
  return {
    id: row.id,
    group_id: row.group_id,
    group_name: row.group_name || '',
    responsible_student_id: row.responsible_student_id || null,
    student_id: row.student_id,
    student_name: row.student_name || '',
    email: row.email || '',
    level: row.level || '',
    status: row.status || '',
    starts_on: row.starts_on || null,
    active: row.active !== false,
    is_responsible: row.is_responsible === true,
    total_individual_paid_units: Number(row.total_individual_paid_units) || 0,
    total_given_units: Number(row.total_given_units) || 0,
    total_future_units: Number(row.total_future_units) || 0
  };
}
function normalizeStudentBillingContext(row){
  if (!row) return null;
  return {
    student_id: row.student_id,
    full_name: row.full_name || '',
    group_id: row.group_id || null,
    group_name: row.group_name || '',
    responsible_student_id: row.responsible_student_id || null,
    responsible_student_name: row.responsible_student_name || '',
    member_starts_on: row.member_starts_on || null,
    group_starts_on: row.group_starts_on || null,
    group_active: row.group_active === true,
    member_active: row.member_active === true,
    billing_role: row.billing_role || 'individual',
    visible_remaining_units: Number(row.visible_remaining_units) || 0,
    group_remaining_units: Number(row.group_remaining_units) || 0,
    group_paid_units: Number(row.group_paid_units) || 0,
    group_given_units: Number(row.group_given_units) || 0,
    group_future_units: Number(row.group_future_units) || 0
  };
}
function normalizeFinanceBalanceRow(row){
  if (!row) return null;
  return {
    row_type: row.row_type || 'student',
    row_id: row.row_id,
    row_name: row.row_name || '',
    student_id: row.student_id || null,
    group_id: row.group_id || null,
    status: row.status || '',
    exclude_from_stats: row.exclude_from_stats === true,
    total_paid_units: Number(row.total_paid_units) || 0,
    total_given_units: Number(row.total_given_units) || 0,
    total_future_units: Number(row.total_future_units) || 0,
    remaining_units: Number(row.remaining_units) || 0
  };
}
LegoData.billingGroups = async function(opts){
  opts = opts || {};
  var q = db.from('billing_groups').select('id,name,responsible_student_id,starts_on,active,created_at').order('name', { ascending: true });
  if (!opts.includeInactive) q = q.eq('active', true);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.billingGroups] ' + r.error.message); }
  return (r.data || []).map(normalizeBillingGroup);
};
LegoData.billingGroupById = async function(groupId){
  if (!groupId) { throw new Error('[LegoData.billingGroupById] Falta groupId'); }
  var r = await db.from('billing_groups')
    .select('id,name,responsible_student_id,starts_on,active,created_at')
    .eq('id', groupId)
    .limit(1);
  if (r.error) { throw new Error('[LegoData.billingGroupById] ' + r.error.message); }
  return normalizeBillingGroup((r.data || [])[0]);
};
LegoData.insertBillingGroup = async function(row){
  var r = await db.from('billing_groups').insert(row).select('id,name,responsible_student_id,starts_on,active,created_at');
  if (r.error) { throw new Error('[LegoData.insertBillingGroup] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.insertBillingGroup] No se creó la bolsa'); }
  return normalizeBillingGroup(r.data[0]);
};
LegoData.updateBillingGroup = async function(groupId, patch){
  if (!groupId) { throw new Error('[LegoData.updateBillingGroup] Falta groupId'); }
  var r = await db.from('billing_groups').update(patch).eq('id', groupId).select('id,name,responsible_student_id,starts_on,active,created_at');
  if (r.error) { throw new Error('[LegoData.updateBillingGroup] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateBillingGroup] RLS bloqueo el update (0 filas) en group ' + groupId); }
  return normalizeBillingGroup(r.data[0]);
};
LegoData.billingGroupBalance = async function(groupId){
  if (!groupId) { throw new Error('[LegoData.billingGroupBalance] Falta groupId'); }
  var r = await db.from('student_finance_group_balances')
    .select('group_id,group_name,responsible_student_id,responsible_student_name,starts_on,active,total_paid_units,total_given_units,total_future_units,remaining_units')
    .eq('group_id', groupId)
    .limit(1);
  if (r.error) { throw new Error('[LegoData.billingGroupBalance] ' + r.error.message); }
  return normalizeBillingGroupBalance((r.data || [])[0]);
};
LegoData.billingGroupMembers = async function(groupId){
  if (!groupId) { throw new Error('[LegoData.billingGroupMembers] Falta groupId'); }
  var r = await db.from('billing_group_member_rows')
    .select('id,group_id,group_name,responsible_student_id,student_id,student_name,email,level,status,starts_on,active,is_responsible')
    .eq('group_id', groupId)
    .order('is_responsible', { ascending: false })
    .order('student_name', { ascending: true });
  if (r.error) { throw new Error('[LegoData.billingGroupMembers] ' + r.error.message); }
  return (r.data || []).map(normalizeBillingGroupMember);
};
LegoData.billingGroupMembersByStudents = async function(studentIds){
  var r = await db.from('billing_group_members').select('id,group_id,student_id').in('student_id', studentIds || []);
  if (r.error) { throw new Error('[LegoData.billingGroupMembersByStudents] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertBillingGroupMember = async function(row){
  var r = await db.from('billing_group_members').insert(row).select('id,group_id,student_id,starts_on,active,created_at');
  if (r.error) { throw new Error('[LegoData.insertBillingGroupMember] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.insertBillingGroupMember] No se creó el miembro'); }
  return r.data[0];
};
LegoData.deleteBillingGroupMember = async function(id){
  var r = await db.from('billing_group_members').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteBillingGroupMember] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteBillingGroupMember] RLS bloqueo el delete (0 filas) en member ' + id); }
  return r.data;
};
LegoData.updateBillingGroupMember = async function(id, patch){
  var r = await db.from('billing_group_members').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateBillingGroupMember] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateBillingGroupMember] RLS bloqueo el update (0 filas) en member ' + id); }
  return r.data[0];
};
LegoData.updateBillingGroupMembersByGroup = async function(groupId, patch){
  if (!groupId) { throw new Error('[LegoData.updateBillingGroupMembersByGroup] Falta groupId'); }
  var r = await db.from('billing_group_members').update(patch).eq('group_id', groupId).eq('active', true).select('id,group_id,student_id,starts_on,active,created_at');
  if (r.error) { throw new Error('[LegoData.updateBillingGroupMembersByGroup] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentBillingContext = async function(studentId){
  if (!studentId) { throw new Error('[LegoData.studentBillingContext] Falta studentId'); }
  var r = await db.rpc('student_billing_context_by_id', { p_student_id: studentId });
  if (r.error) { throw new Error('[LegoData.studentBillingContext] ' + r.error.message); }
  return normalizeStudentBillingContext((r.data || [])[0]) || {
    student_id: studentId,
    full_name: '',
    group_id: null,
    group_name: '',
    responsible_student_id: null,
    responsible_student_name: '',
    member_starts_on: null,
    group_starts_on: null,
    group_active: false,
    member_active: false,
    billing_role: 'individual',
    visible_remaining_units: 0,
    group_remaining_units: 0,
    group_paid_units: 0,
    group_given_units: 0,
    group_future_units: 0
  };
};
LegoData.financeBalanceRows = async function(opts){
  opts = opts || {};
  var q = db.from('student_finance_rows')
    .select('row_type,row_id,row_name,student_id,group_id,status,exclude_from_stats,total_paid_units,total_given_units,total_future_units,remaining_units')
    .order('row_name', { ascending: true });
  if (!opts.includeExcluded) q = q.eq('exclude_from_stats', false);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.financeBalanceRows] ' + r.error.message); }
  return (r.data || []).map(normalizeFinanceBalanceRow);
};
LegoData.financeBillingGroupMembers = async function(){
  var r = await db.from('student_finance_group_members')
    .select('id,group_id,group_name,responsible_student_id,student_id,student_name,email,level,status,starts_on,active,is_responsible,total_individual_paid_units,total_given_units,total_future_units')
    .eq('active', true)
    .order('group_name', { ascending: true })
    .order('is_responsible', { ascending: false })
    .order('student_name', { ascending: true });
  if (r.error) { throw new Error('[LegoData.financeBillingGroupMembers] ' + r.error.message); }
  return (r.data || []).map(normalizeBillingGroupMember);
};

// ── vocabulario ─────────────────────────────────────────
// SELLO DE DERIVACION (Regla 10). Una fila de student_vocabulary es UNA palabra;
// sus significados viven como sentidos hijos. Los sentidos servidos desde Banco
// referencian vocabulary_bank_senses por id; los personales conservan texto propio.
// term/meaning del padre quedan como compatibilidad temporal para vistas antiguas.
// bank_id usa ON DELETE CASCADE: borrar la fuente borra sus asociaciones.
var _SV_SEL = '*, vocabulary_bank(term, term_key, meaning, meaning_key, tema, nivel, entry_type), student_vocabulary_senses(id,bank_sense_id,meaning,meaning_key,context,example,accepted_answers,position,vocabulary_bank_senses(meaning,meaning_key,context,example,accepted_answers,position))';

function _svSense(row){
  row = row || {};
  var bank = row.vocabulary_bank_senses;
  if (Array.isArray(bank)) bank = bank[0] || null;
  var source = bank || row;
  return {
    id: row.id || null,
    bank_sense_id: row.bank_sense_id || null,
    meaning: source.meaning || '',
    meaning_key: source.meaning_key || LegoData.vocabularyKey(source.meaning),
    context: source.context || '',
    example: source.example || '',
    accepted_answers: Array.isArray(source.accepted_answers) ? source.accepted_answers.filter(function(a){ return String(a || '').trim(); }) : [],
    position: Number(source.position != null ? source.position : row.position) || 0,
    locked: !!row.bank_sense_id
  };
}

function _svDerive(rows){
  return (rows || []).map(function(v){
    var b = v.vocabulary_bank;
    if (b) {
      v.term        = b.term        || v.term;
      v.term_key    = b.term_key    || v.term_key;
      v.meaning     = b.meaning     || v.meaning;
      v.meaning_key = b.meaning_key || v.meaning_key;
      v.entry_type  = b.entry_type  || v.entry_type;
      v.tema        = b.tema;
      v.nivel       = b.nivel;
    }
    v.direction = 'es_en';
    var senses = (v.student_vocabulary_senses || []).map(_svSense).filter(function(s){ return s.meaning; });
    senses.sort(function(a, b2){
      if (a.position !== b2.position) return a.position - b2.position;
      return String(a.id || '').localeCompare(String(b2.id || ''));
    });
    if (!senses.length && v.meaning) {
      senses.push({
        id: null,
        bank_sense_id: null,
        meaning: v.meaning,
        meaning_key: v.meaning_key || LegoData.vocabularyKey(v.meaning),
        context: '',
        example: '',
        accepted_answers: [],
        position: 0,
        locked: !!v.bank_id
      });
    }
    v.senses = senses;
    v.meanings = senses.map(function(s){ return s.meaning; });
    if (senses.length) {
      v.meaning = senses[0].meaning;
      v.meaning_key = senses[0].meaning_key;
    }
    delete v.vocabulary_bank;
    delete v.student_vocabulary_senses;
    return v;
  });
}

LegoData.studentVocabulary = async function(){
  var r = await db.from('student_vocabulary').select(_SV_SEL).order('created_at', { ascending: false });
  if (r.error) {
    console.warn('[LegoData.studentVocabulary] embed a vocabulary_bank fallo; mostrando copia SIN derivar:', r.error.message);
    var r2 = await db.from('student_vocabulary').select('*').order('created_at', { ascending: false });
    if (r2.error) { throw new Error('[LegoData.studentVocabulary] ' + r2.error.message); }
    return _svDerive(r2.data);
  }
  return _svDerive(r.data);
};
LegoData.studentVocabularyByStudent = async function(studentId){
  var r = await db.from('student_vocabulary').select(_SV_SEL).eq('student_id', studentId).order('created_at', { ascending: false });
  if (r.error) {
    console.warn('[LegoData.studentVocabularyByStudent] embed a vocabulary_bank fallo; mostrando copia SIN derivar:', r.error.message);
    var r2 = await db.from('student_vocabulary').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
    if (r2.error) { throw new Error('[LegoData.studentVocabularyByStudent] ' + r2.error.message); }
    return _svDerive(r2.data);
  }
  return _svDerive(r.data);
};
LegoData.studentVocabularyByStudents = async function(studentIds){
  if (!studentIds || !studentIds.length) return [];
  var r = await db.from('student_vocabulary').select(_SV_SEL).in('student_id', studentIds);
  if (r.error) {
    console.warn('[LegoData.studentVocabularyByStudents] embed a vocabulary_bank fallo; mostrando copia SIN derivar:', r.error.message);
    var r2 = await db.from('student_vocabulary').select('*').in('student_id', studentIds);
    if (r2.error) { throw new Error('[LegoData.studentVocabularyByStudents] ' + r2.error.message); }
    return _svDerive(r2.data);
  }
  return _svDerive(r.data);
};

// GRIFO: sirve palabras del banco a un estudiante. NO copia el texto como verdad;
// guarda bank_id y deja term/meaning de fallback. El indice unico
// (student_id, bank_id) hace los duplicados IMPOSIBLES a nivel de base, y
// ignoreDuplicates los salta sin error -> servir dos veces es inofensivo.
LegoData.serveBankToStudent = async function(studentId, bankRows, opts){
  if (!studentId || !bankRows || !bankRows.length) return { served: 0, skipped: 0 };
  opts = opts || {};
  var now = new Date().toISOString();
  var payload = bankRows.map(function(b){
    return {
      student_id: studentId,
      bank_id: b.id,
      term: b.term,
      term_key: b.term_key,
      meaning: b.meaning,
      entry_type: b.entry_type || 'word',
      source: opts.source || 'teacher',
      source_detail: opts.sourceDetail || null,
      updated_at: now
    };
  });
  var r = await db.from('student_vocabulary')
    .upsert(payload, { onConflict: 'student_id,bank_id', ignoreDuplicates: true })
    .select('id');
  if (r.error) { throw new Error('[LegoData.serveBankToStudent] ' + r.error.message); }
  var served = (r.data || []).length;
  return { served: served, skipped: payload.length - served };
};
// Re-etiquetar filas del estudiante a un paquete (o soltarlas). Usado por el
// grifo "Destino: Paquete": las sueltas que ya tenia se ORGANIZAN al paquete.
// GRIFO multi-destinatario: sirve parejas {student_id, bank} en lotes de 400
// con UN upsert por lote (no un viaje por estudiante). El indice unico
// (student_id, bank_id) + ignoreDuplicates hace inofensivo repetir.
LegoData.serveBankPairs = async function(pairs, opts){
  if (!pairs || !pairs.length) return { served: 0, skipped: 0 };
  opts = opts || {};
  var now = new Date().toISOString();
  var payload = pairs.map(function(p){
    var b = p.bank;
    return {
      student_id: p.student_id,
      bank_id: b.id,
      term: b.term,
      term_key: b.term_key,
      meaning: b.meaning,
      entry_type: b.entry_type || 'word',
      source: opts.source || 'teacher',
      source_detail: opts.sourceDetail || null,
      updated_at: now
    };
  });
  var served = 0;
  for (var i = 0; i < payload.length; i += 400) {
    var r = await db.from('student_vocabulary')
      .upsert(payload.slice(i, i + 400), { onConflict: 'student_id,bank_id', ignoreDuplicates: true })
      .select('id');
    if (r.error) { throw new Error('[LegoData.serveBankPairs] ' + r.error.message); }
    served += (r.data || []).length;
  }
  return { served: served, skipped: payload.length - served };
};

LegoData.relabelStudentVocabulary = async function(ids, sourceDetail){
  if (!ids || !ids.length) return [];
  var r = await db.from('student_vocabulary')
    .update({ source_detail: sourceDetail || null, updated_at: new Date().toISOString() })
    .in('id', ids)
    .select('id');
  if (r.error) { throw new Error('[LegoData.relabelStudentVocabulary] ' + r.error.message); }
  if (!r.data || r.data.length !== ids.length) { throw new Error('[LegoData.relabelStudentVocabulary] se actualizaron ' + ((r.data||[]).length) + ' de ' + ids.length + ' (RLS?)'); }
  return r.data;
};

LegoData.studentLevelsByIds = async function(studentIds){
  studentIds = (studentIds || []).map(function(id){ return String(id || ''); }).filter(function(id){ return id; });
  var unique = {};
  studentIds.forEach(function(id){ unique[id] = true; });
  var ids = Object.keys(unique);
  if (!ids.length) return {};
  var r = await db.from('students').select('id,level').in('id', ids);
  if (r.error) { throw new Error('[LegoData.studentLevelsByIds] ' + r.error.message); }
  var byId = {};
  (r.data || []).forEach(function(row){ byId[String(row.id)] = row.level || null; });
  return byId;
};
LegoData.withVocabularyLevelSnapshots = async function(rowOrRows){
  var isArray = Array.isArray(rowOrRows);
  var rows = isArray ? (rowOrRows || []) : [rowOrRows];
  var needs = rows.filter(function(row){ return row && row.student_id && !row.level_at_added; });
  if (!needs.length) return rowOrRows;
  var levels = await LegoData.studentLevelsByIds(needs.map(function(row){ return row.student_id; }));
  var mapped = rows.map(function(row){
    if (!row || !row.student_id || row.level_at_added) return row;
    return Object.assign({}, row, { level_at_added: levels[String(row.student_id)] || null });
  });
  return isArray ? mapped : mapped[0];
};
LegoData.withPracticeLevelSnapshot = async function(row){
  if (!row || !row.student_id || row.level_at_practice) return row;
  var levels = await LegoData.studentLevelsByIds([row.student_id]);
  return Object.assign({}, row, { level_at_practice: levels[String(row.student_id)] || null });
};
LegoData.vocabularySharedWords = async function(opts){
  opts = opts || {};
  var limit = Number(opts.limit) || 5;
  var q = db.from('vocabulary_shared_words')
    .select('ticket_key,term,meaning,student_count,entry_count')
    .order('student_count', { ascending: false })
    .order('term')
    .limit(limit);
  if (opts.minStudents) q = q.gte('student_count', Number(opts.minStudents));
  var r = await q;
  if (r.error) {
    if (r.error.code === '42P01' || /vocabulary_shared_words|does not exist/i.test(r.error.message || '')) return [];
    throw new Error('[LegoData.vocabularySharedWords] ' + r.error.message);
  }
  return (r.data || []).map(function(row){
    return {
      ticketKey: row.ticket_key || '',
      term: row.term || '',
      meaning: row.meaning || '',
      studentCount: Number(row.student_count) || 0,
      entryCount: Number(row.entry_count) || 0
    };
  });
};
LegoData.vocabularyOverview = async function(limit){
  var topRows = await LegoData.vocabularySharedWords({ limit: limit || 5 });
  var entriesResult = await db.from('student_vocabulary').select('id', { count: 'exact', head: true });
  if (entriesResult.error) { throw new Error('[LegoData.vocabularyOverview] ' + entriesResult.error.message); }
  var uniqueTerms = topRows.length;
  var uniqueResult = await db.from('vocabulary_shared_words').select('ticket_key', { count: 'exact', head: true });
  if (!uniqueResult.error) uniqueTerms = uniqueResult.count || 0;
  return { entries: entriesResult.count || 0, uniqueTerms: uniqueTerms, topRows: topRows };
};
LegoData.vocabularyUniqueCount = async function(){
  var r = await db.from('vocabulary_shared_words').select('ticket_key', { count: 'exact', head: true });
  if (r.error) { throw new Error('[LegoData.vocabularyUniqueCount] ' + r.error.message); }
  return r.count || 0;
};
LegoData.vocabularyTopSharedWord = async function(){
  var rows = await LegoData.vocabularySharedWords({ limit: 1 });
  return rows[0] || null;
};
LegoData.vocabularyDashboardStats = async function(){
  var r = await db.from('vocabulary_dashboard_stats')
    .select('total_words,total_expressions,students_with_vocabulary,top_shared_term,top_shared_meaning,top_shared_students')
    .maybeSingle();
  if (r.error) { throw new Error('[LegoData.vocabularyDashboardStats] ' + r.error.message); }
  var row = r.data || {};
  return {
    totalWords: Number(row.total_words) || 0,
    totalExpressions: Number(row.total_expressions) || 0,
    studentsWithVocabulary: Number(row.students_with_vocabulary) || 0,
    topShared: {
      term: row.top_shared_term || '',
      meaning: row.top_shared_meaning || '',
      studentCount: Number(row.top_shared_students) || 0
    }
  };
};
LegoData.vocabularyTopShared = async function(opts){
  opts = opts || {};
  var entryType = opts.entryType || 'word';
  var minStudents = Number(opts.minStudents) || 2;
  var limit = Number(opts.limit) || 5;
  var q = db.from('vocabulary_shared_words_organic')
    .select('entry_type,ticket_key,term,meaning,student_count,top_meaning,top_meaning_count')
    .eq('entry_type', entryType)
    .gte('student_count', minStudents)
    .order('student_count', { ascending: false })
    .order('term')
    .limit(limit);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.vocabularyTopShared] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      entryType: row.entry_type || '',
      ticketKey: row.ticket_key || '',
      term: row.term || '',
      meaning: row.meaning || '',
      studentCount: Number(row.student_count) || 0,
      topMeaning: row.top_meaning || '',
      topMeaningCount: Number(row.top_meaning_count) || 0,
      lastSeenAt: row.last_seen_at || null
    };
  });
};
LegoData.vocabularyPracticeLeaders = async function(opts){
  opts = opts || {};
  var practiceType = opts.practiceType || 'flashcard_flip';
  var limit = Number(opts.limit) || 5;
  var r = await db.from('vocabulary_practice_leaders')
    .select('practice_type,student_id,student_name,total')
    .eq('practice_type', practiceType)
    .order('total', { ascending: false })
    .order('student_name')
    .limit(limit);
  if (r.error) { throw new Error('[LegoData.vocabularyPracticeLeaders] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      practiceType: row.practice_type || '',
      studentId: row.student_id || null,
      studentName: row.student_name || 'Estudiante',
      total: Number(row.total) || 0
    };
  });
};
LegoData.vocabularyPracticeLeadersAll = async function(){
  var r = await db.from('vocabulary_practice_leaders').select('practice_type,student_id,student_name,total');
  if (r.error) { throw new Error('[LegoData.vocabularyPracticeLeadersAll] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      practiceType: row.practice_type || '',
      studentId: row.student_id || null,
      studentName: row.student_name || 'Estudiante',
      total: Number(row.total) || 0
    };
  });
};
LegoData.vocabularyLevelBreakdown = async function(){
  var r = await db.from('vocabulary_level_breakdown')
    .select('entry_type,level_at_added,total')
    .order('entry_type')
    .order('level_at_added');
  if (r.error) { throw new Error('[LegoData.vocabularyLevelBreakdown] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      entryType: row.entry_type || '',
      levelAtAdded: row.level_at_added || 'sin nivel',
      total: Number(row.total) || 0
    };
  });
};
LegoData.vocabularyRecentStats = async function(){
  var r = await db.from('vocabulary_recent_stats')
    .select('new_words_7d,new_expressions_7d')
    .maybeSingle();
  if (r.error) { throw new Error('[LegoData.vocabularyRecentStats] ' + r.error.message); }
  var row = r.data || {};
  var newWords7d = Number(row.new_words_7d) || 0;
  var newExpressions7d = Number(row.new_expressions_7d) || 0;
  return {
    newWords7d: newWords7d,
    newExpressions7d: newExpressions7d,
    totalNew7d: newWords7d + newExpressions7d
  };
};
LegoData.insertStudentVocabulary = async function(rowOrRows){
  var rows = await LegoData.withVocabularyLevelSnapshots(rowOrRows);
  var r = await db.from('student_vocabulary').insert(rows).select();
  if (r.error) { throw new Error('[LegoData.insertStudentVocabulary] ' + r.error.message); }
  return r.data || [];
};
// Guardado atomico de una palabra personal y todos sus sentidos. El RPC valida
// ownership y unicidad, marca automaticamente el origen de profesor/estudiante
// y reemplaza los sentidos en una sola transaccion. Los paneles nunca escriben
// las tablas hijas directamente.
LegoData.saveStudentVocabularyWithSenses = async function(payload){
  payload = payload || {};
  var r = await db.rpc('save_student_vocabulary_with_senses', {
    p_student_id: payload.student_id,
    p_entry_id: payload.entry_id || null,
    p_term: payload.term || '',
    p_term_key: payload.term_key || LegoData.vocabularyKey(payload.term),
    p_entry_type: payload.entry_type || 'word',
    p_senses: (payload.senses || []).map(function(s, i){
      return {
        meaning: String(s.meaning || '').trim(),
        meaning_key: s.meaning_key || LegoData.vocabularyKey(s.meaning),
        context: String(s.context || '').trim(),
        example: String(s.example || '').trim(),
        accepted_answers: (s.accepted_answers || []).map(function(a){ return String(a || '').trim(); }).filter(function(a){ return a; }),
        position: i
      };
    })
  });
  if (r.error) { throw new Error('[LegoData.saveStudentVocabularyWithSenses] ' + r.error.message); }
  if (!r.data) { throw new Error('[LegoData.saveStudentVocabularyWithSenses] guardado sin id de retorno'); }
  return r.data;
};
// Bulk con dedup: inserta en tandas de 400 con ignoreDuplicates; devuelve cuantas entraron.
LegoData.insertStudentVocabularyIgnoreDup = async function(rows){
  rows = await LegoData.withVocabularyLevelSnapshots(rows || []);
  var inserted = 0;
  for (var i = 0; i < rows.length; i += 400) {
    var r = await db.from('student_vocabulary').insert(rows.slice(i, i + 400), { ignoreDuplicates: true }).select('id');
    if (r.error) { throw new Error('[LegoData.insertStudentVocabularyIgnoreDup] ' + r.error.message); }
    inserted += (r.data || []).length;
  }
  return inserted;
};
// studentId opcional: scope defensivo extra (index lo usa; RLS igual protege).
LegoData.updateStudentVocabulary = async function(id, patch, studentId){
  var q = db.from('student_vocabulary').update(patch).eq('id', id);
  if (studentId) q = q.eq('student_id', studentId);
  var r = await q.select();
  if (r.error) { throw new Error('[LegoData.updateStudentVocabulary] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateStudentVocabulary] RLS bloqueo el update (0 filas) en entry ' + id); }
  return r.data[0];
};
LegoData.deleteStudentVocabulary = async function(id, studentId){
  var q = db.from('student_vocabulary').delete().eq('id', id);
  if (studentId) q = q.eq('student_id', studentId);
  var r = await q.select();
  if (r.error) { throw new Error('[LegoData.deleteStudentVocabulary] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteStudentVocabulary] RLS bloqueo el delete (0 filas) en entry ' + id); }
  return r.data;
};
LegoData.deleteStudentVocabularyByStudent = async function(studentId){
  if (!studentId) return [];
  var r = await db.from('student_vocabulary').delete().eq('student_id', studentId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteStudentVocabularyByStudent] ' + r.error.message); }
  return r.data || [];
};

LegoData.vocabularyKey = function(term){
  return String(term || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s'-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};
LegoData.parseVocabularyEqualsText = function(text, entryType){
  var rows = [];
  var seen = {};
  String(text || '').split(/\r?\n/).forEach(function(line){
    var raw = line.trim();
    if (!raw || raw.indexOf('=') === -1) return;
    var parts = raw.split('=');
    var term = parts.shift().trim();
    var meaning = parts.join('=').trim();
    var termKey = LegoData.vocabularyKey(term);
    var meaningKey = LegoData.vocabularyKey(meaning);
    var type = entryType || 'word';
    if (!term || !meaning || !termKey || !meaningKey) return;
    var left = type + ':' + termKey;
    var right = type + ':' + meaningKey;
    if (seen[left] || seen[right]) return;
    seen[left] = true;
    seen[right] = true;
    rows.push({ term: term, term_key: termKey, meaning: meaning, meaning_key: meaningKey, entry_type: type });
  });
  return rows;
};

LegoData.vocabularyTicketKey = function(entry){
  var termKey = String((entry && entry.term_key) || LegoData.vocabularyKey(entry && entry.term));
  if (!termKey) return '';
  return termKey;
};

LegoData.vocabularyMatrixStats = function(entries){
  var tickets = {};
  var terms = {};
  var expressions = {};
  (entries || []).forEach(function(v){
    var termKey = String(v.term_key || LegoData.vocabularyKey(v.term));
    var ticketKey = LegoData.vocabularyTicketKey(v);
    var studentKey = String(v.student_id || v.id || '');
    if (!ticketKey) return;
    if (termKey) terms[ticketKey] = true;
    var uniqueTicket = studentKey ? (studentKey + '::' + ticketKey) : ticketKey;
    tickets[uniqueTicket] = true;
    if (v.entry_type === 'expression') expressions[uniqueTicket] = true;
  });
  return {
    entries: Object.keys(tickets).length,
    uniqueTerms: Object.keys(terms).length,
    expressions: Object.keys(expressions).length
  };
};

LegoData.vocabularyPopularityRows = function(entries){
  var map = {};
  (entries || []).forEach(function(v){
    var ticketKey = LegoData.vocabularyTicketKey(v);
    if (!ticketKey) return;
    if (!map[ticketKey]) {
      map[ticketKey] = {
        ticketKey: ticketKey,
        term: v.term || '',
        direction: 'es_en',
        termCounts: {},
        meanings: {},
        students: {},
        entries: [],
        entryKeys: {},
        count: 0,
        rawCount: 0
      };
    }
    var row = map[ticketKey];
    row.rawCount += 1;
    if (v.term) row.termCounts[v.term] = (row.termCounts[v.term] || 0) + 1;
    var meanings = Array.isArray(v.meanings) && v.meanings.length
      ? v.meanings.slice()
      : (Array.isArray(v.senses) && v.senses.length
        ? v.senses.map(function(s){ return s && s.meaning; })
        : [v.meaning]);
    meanings = meanings.map(function(meaning){ return String(meaning || '').trim(); }).filter(function(meaning){ return meaning; });
    meanings.forEach(function(meaning){ row.meanings[meaning] = true; });
    var studentKey = String(v.student_id || '');
    if (studentKey) row.students[studentKey] = true;
    else row.count += 1;
    var entryKey = studentKey ? (studentKey + '::' + ticketKey) : ('row::' + String(v.id || row.rawCount));
    if (!row.entryKeys[entryKey]) {
      row.entryKeys[entryKey] = true;
      row.entries.push({
        id: v.id || '',
        student_id: v.student_id || '',
        term: v.term || '',
        meaning: meanings.join(', '),
        entry_type: v.entry_type || '',
        source: v.source || '',
        source_detail: v.source_detail || ''
      });
    }
  });
  return Object.keys(map).map(function(k){
    var row = map[k];
    var termOptions = Object.keys(row.termCounts).sort(function(a, b){
      if (row.termCounts[b] !== row.termCounts[a]) return row.termCounts[b] - row.termCounts[a];
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    });
    if (termOptions.length) row.term = termOptions[0];
    var studentCount = Object.keys(row.students).length;
    if (studentCount) row.count = studentCount;
    row.meaningList = Object.keys(row.meanings).sort(function(a, b){
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    });
    delete row.termCounts;
    delete row.entryKeys;
    return row;
  }).sort(function(a, b){
    if (b.count !== a.count) return b.count - a.count;
    return String(a.term || '').localeCompare(String(b.term || ''), 'es', { sensitivity: 'base' });
  });
};

LegoData.vocabularySets = async function(){
  var r = await db.from('vocabulary_sets').select('*').order('name');
  if (r.error) { throw new Error('[LegoData.vocabularySets] ' + r.error.message); }
  return r.data || [];
};
LegoData.vocabularySetItems = async function(){
  var r = await db.from('vocabulary_set_items').select('*').order('position');
  if (r.error) { throw new Error('[LegoData.vocabularySetItems] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertVocabularySet = async function(payload){
  var r = await db.from('vocabulary_sets').insert(payload).select();
  if (r.error) { throw new Error('[LegoData.insertVocabularySet] ' + r.error.message); }
  return r.data && r.data[0];
};
LegoData.updateVocabularySet = async function(id, patch){
  var r = await db.from('vocabulary_sets').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateVocabularySet] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateVocabularySet] RLS bloqueo el update (0 filas) en set ' + id); }
  return r.data[0];
};
LegoData.deleteVocabularySet = async function(id){
  var r = await db.from('vocabulary_sets').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteVocabularySet] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteVocabularySet] RLS bloqueo el delete (0 filas) en set ' + id); }
  return r.data;
};
LegoData.insertVocabularySetItems = async function(items){
  if (!items || !items.length) return [];
  var r = await db.from('vocabulary_set_items').insert(items).select('id');
  if (r.error) { throw new Error('[LegoData.insertVocabularySetItems] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteVocabularySetItemsBySet = async function(setId){
  var r = await db.from('vocabulary_set_items').delete().eq('set_id', setId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteVocabularySetItemsBySet] ' + r.error.message); }
  return r.data || [];
};

LegoData.bankWords = async function(opts){
  opts = opts || {};
  var q = db.from('vocabulary_bank').select('*');
  if (opts.tema)  q = q.eq('tema', opts.tema);
  if (opts.nivel) q = q.eq('nivel', opts.nivel);
  q = q.order('created_at', { ascending: false });
  var r = await q;
  if (r.error) { throw new Error('[LegoData.bankWords] ' + r.error.message); }
  return r.data || [];
};
LegoData.bankTemas = async function(){
  var r = await db.from('vocabulary_bank').select('tema');
  if (r.error) { throw new Error('[LegoData.bankTemas] ' + r.error.message); }
  var seen = {};
  (r.data || []).forEach(function(row){ if (row.tema) seen[row.tema] = true; });
  return Object.keys(seen).sort(function(a, b){ return a.localeCompare(b, 'es', { sensitivity: 'base' }); });
};
LegoData.insertBankWords = async function(rows){
  if (!rows || !rows.length) return { inserted: [], skipped: 0 };
  var temas = {}, niveles = {};
  rows.forEach(function(r){ if (r.tema) temas[r.tema] = true; if (r.nivel) niveles[r.nivel] = true; });
  var existing = db.from('vocabulary_bank').select('term_key,tema,nivel');
  var temaList = Object.keys(temas), nivelList = Object.keys(niveles);
  if (temaList.length)  existing = existing.in('tema', temaList);
  if (nivelList.length) existing = existing.in('nivel', nivelList);
  var ex = await existing;
  if (ex.error) { throw new Error('[LegoData.insertBankWords] ' + ex.error.message); }
  var have = {};
  (ex.data || []).forEach(function(row){ have[row.tema + '|' + row.nivel + '|' + row.term_key] = true; });
  var payload = [], skipped = 0;
  rows.forEach(function(r){
    var termKey = r.term_key || LegoData.vocabularyKey(r.term);
    var key = r.tema + '|' + r.nivel + '|' + termKey;
    if (have[key]) { skipped++; return; }
    have[key] = true;
    payload.push({ term: r.term, term_key: termKey, meaning: r.meaning, meaning_key: r.meaning_key || LegoData.vocabularyKey(r.meaning), tema: r.tema, nivel: r.nivel, entry_type: r.entry_type || 'word' });
  });
  if (!payload.length) return { inserted: [], skipped: skipped };
  var ins = await db.from('vocabulary_bank').insert(payload).select();
  if (ins.error) { throw new Error('[LegoData.insertBankWords] ' + ins.error.message); }
  return { inserted: ins.data || [], skipped: skipped };
};

LegoData.updateBankWord = async function(id, patch){
  var r = await db.from('vocabulary_bank').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateBankWord] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateBankWord] RLS bloqueo el update (0 filas) en palabra ' + id); }
  var b = r.data[0];
  // Propagar a las copias servidas. La copia local NO puede eliminarse (las vistas
  // SQL de matriz/tiquetes leen la tabla cruda), asi que se sincroniza AQUI, en el
  // mismo acto de editar la fuente: no existe camino donde la copia quede vieja.
  // 0 filas afectadas es valido (nadie tiene la palabra); error de RLS si lanza.
  var p = await db.from('student_vocabulary')
    .update({ term: b.term, term_key: b.term_key, meaning: b.meaning, entry_type: b.entry_type, updated_at: new Date().toISOString() })
    .eq('bank_id', id)
    .select('id');
  if (p.error) { throw new Error('[LegoData.updateBankWord] propagacion a perfiles: ' + p.error.message); }
  return b;
};
LegoData.deleteBankWord = async function(id){
  var r = await db.from('vocabulary_bank').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteBankWord] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteBankWord] RLS bloqueo el delete (0 filas) en palabra ' + id); }
  return true;
};

// Renombrar tema = actualizar todas sus palabras. Si el destino ya existe,
// FUSIONA (las filas simplemente se unen al otro tema). El tema vive SOLO en el
// banco (los perfiles no lo copian), asi que renombrar no toca nada aguas abajo.
LegoData.bankWordsByIds = async function(ids){
  if (!ids || !ids.length) return [];
  var r = await db.from('vocabulary_bank').select('*').in('id', ids);
  if (r.error) { throw new Error('[LegoData.bankWordsByIds] ' + r.error.message); }
  return r.data || [];
};

LegoData.renameBankTema = async function(fromTema, toTema){
  var r = await db.from('vocabulary_bank').update({ tema: toTema }).eq('tema', fromTema).select('id');
  if (r.error) { throw new Error('[LegoData.renameBankTema] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.renameBankTema] 0 filas (RLS o tema inexistente): ' + fromTema); }
  return r.data.length;
};
// Borrar un tema = borrar sus palabras del banco; el CASCADE las quita tambien
// de los perfiles que las tenian servidas.
LegoData.deleteBankTema = async function(tema){
  var r = await db.from('vocabulary_bank').delete().eq('tema', tema).select('id');
  if (r.error) { throw new Error('[LegoData.deleteBankTema] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteBankTema] 0 filas (RLS o tema inexistente): ' + tema); }
  return r.data.length;
};

LegoData.vocabularyPracticeEvents = async function(){
  var r = await db.from('student_vocabulary_practice_events').select('*').order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.vocabularyPracticeEvents] ' + r.error.message); }
  return r.data || [];
};
LegoData.vocabularyPracticeEventsByStudent = async function(studentId){
  var r = await db.from('student_vocabulary_practice_events').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.vocabularyPracticeEventsByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertVocabularyPracticeEvent = async function(row){
  var payload = await LegoData.withPracticeLevelSnapshot(row);
  var r = await db.from('student_vocabulary_practice_events').insert(payload);
  if (r.error) { throw new Error('[LegoData.insertVocabularyPracticeEvent] ' + r.error.message); }
  return true;
};
LegoData.updateVocabularyPracticeEventsStudent = async function(sourceStudentId, targetStudentId){
  var r = await db.from('student_vocabulary_practice_events').update({ student_id: targetStudentId }).eq('student_id', sourceStudentId).select('id');
  if (r.error) { throw new Error('[LegoData.updateVocabularyPracticeEventsStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteVocabularyPracticeEventsByStudent = async function(studentId){
  var r = await db.from('student_vocabulary_practice_events').delete().eq('student_id', studentId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteVocabularyPracticeEventsByStudent] ' + r.error.message); }
  return r.data || [];
};

// ── biblioteca ──────────────────────────────────────────
LegoData.library = async function(){
  var r = await db.from('library').select('*, grammar_categories(name)').order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.library] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertLibraryItem = async function(row){
  var r = await db.from('library').insert(Array.isArray(row) ? row : [row]).select();
  if (r.error) { throw new Error('[LegoData.insertLibraryItem] ' + r.error.message); }
  return r.data || [];
};
LegoData.updateLibraryItem = async function(id, patch){
  var r = await db.from('library').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateLibraryItem] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateLibraryItem] RLS bloqueo el update (0 filas) en item ' + id); }
  return r.data[0];
};
LegoData.deleteLibraryItem = async function(id){
  var r = await db.from('library').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteLibraryItem] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteLibraryItem] RLS bloqueo el delete (0 filas) en item ' + id); }
  return r.data;
};

// ── palabra del dia y leaderboard ───────────────────────
LegoData.wordsOfDay = async function(){
  var r = await db.from('words_of_day').select('*').order('id');
  if (r.error) { throw new Error('[LegoData.wordsOfDay] ' + r.error.message); }
  return r.data || [];
};
LegoData.leaderboard = async function(opts){
  opts = opts || {};
  var q = db.from('leaderboard').select('id,display_name,score,level').order('score', { ascending: false }).limit(opts.limit || 10);
  if (opts.level) q = q.eq('level', opts.level);
  var r = await q;
  if (r.error) { throw new Error('[LegoData.leaderboard] ' + r.error.message); }
  return r.data || [];
};


// ── estudiantes y lecciones (apoyo LegoLesson) ──────────
LegoData.updateStudent = async function(id, patch){
  var r = await db.from('students').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateStudent] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateStudent] RLS bloqueo el update (0 filas) en student ' + id); }
  return r.data[0];
};
LegoData.updateCurrentStudentScore = async function(score){
  var r = await db.rpc('update_current_student_score', { p_score: Number(score) || 0 });
  if (r.error) { throw new Error('[LegoData.updateCurrentStudentScore] ' + r.error.message); }
  if (!r.data || !r.data.id) { throw new Error('[LegoData.updateCurrentStudentScore] El RPC no devolvió al estudiante actualizado'); }
  return r.data;
};
LegoData.lessonById = async function(id){
  var r = await db.from('lessons').select('*').eq('id', id);
  if (r.error) { throw new Error('[LegoData.lessonById] ' + r.error.message); }
  var l = (r.data || [])[0] || null;
  if (l) {
    if (typeof l.activity_ids === 'string') { try { l.activity_ids = JSON.parse(l.activity_ids); } catch(e) { l.activity_ids = []; } }
    if (!Array.isArray(l.activity_ids)) l.activity_ids = [];
  }
  return l;
};

// ── students: borrar ────────────────────────────────────
// La creación sin acceso NO expone insert crudo: usa el RPC transaccional
// createStudentWithoutAccess para sellar identidad + alias sin duplicados.
LegoData.deleteStudent = async function(id){
  var r = await db.from('students').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteStudent] ' + r.error.message); }
  return r.data || [];
};

// ── merge/borrado de estudiante: operan sobre una tabla dinamica de forma uniforme ──
LegoData.reassignRowsByStudent = async function(table, sourceId, targetId){
  var r = await db.from(table).update({ student_id: targetId }).eq('student_id', sourceId).select('id');
  if (r.error) { throw new Error('[LegoData.reassignRowsByStudent:' + table + '] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteRowsByStudent = async function(table, studentId){
  var r = await db.from(table).delete().eq('student_id', studentId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteRowsByStudent:' + table + '] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteAssignment = async function(id){
  var r = await db.from('assignments').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteAssignment] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteResponsesByAssignment = async function(assignmentId){
  var r = await db.from('responses').delete().eq('assignment_id', assignmentId).select('id');
  if (r.error) { throw new Error('[LegoData.deleteResponsesByAssignment] ' + r.error.message); }
  return r.data || [];
};

// ── responses / assignments por estudiante+actividad (reasignar/reiniciar) ──
LegoData.deleteResponsesByStudentSlug = async function(studentId, slug){
  var r = await db.from('responses').delete().eq('student_id', studentId).eq('activity_slug', slug).select('id');
  if (r.error) { throw new Error('[LegoData.deleteResponsesByStudentSlug] ' + r.error.message); }
  return r.data || [];
};
LegoData.updateAssignmentsByStudentActivity = async function(studentId, activityId, patch){
  var r = await db.from('assignments').update(patch).eq('student_id', studentId).eq('activity_id', activityId).select('id');
  if (r.error) { throw new Error('[LegoData.updateAssignmentsByStudentActivity] ' + r.error.message); }
  return r.data || [];
};

// ── grammar_categories: crear / actualizar / borrar ─────
LegoData.insertGrammarCategory = async function(row){
  var r = await db.from('grammar_categories').insert(row).select().single();
  if (r.error) { throw new Error('[LegoData.insertGrammarCategory] ' + r.error.message); }
  return r.data;
};
// Insert en LOTE (un solo viaje). insertGrammarCategory usa .single() y solo
// sirve para una fila; sembrar N de a una abria ventana para doble-clic.
LegoData.insertGrammarCategories = async function(rows){
  if (!rows || !rows.length) return [];
  var r = await db.from('grammar_categories').insert(rows).select();
  if (r.error) { throw new Error('[LegoData.insertGrammarCategories] ' + r.error.message); }
  if (!r.data || r.data.length !== rows.length) { throw new Error('[LegoData.insertGrammarCategories] se insertaron ' + ((r.data||[]).length) + ' de ' + rows.length + ' (RLS?)'); }
  return r.data;
};
LegoData.updateGrammarCategory = async function(id, patch){
  var r = await db.from('grammar_categories').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateGrammarCategory] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateGrammarCategory] RLS bloqueo el update (0 filas) en categoria ' + id); }
  return r.data[0];
};
LegoData.deleteGrammarCategory = async function(id){
  var r = await db.from('grammar_categories').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteGrammarCategory] ' + r.error.message); }
  return r.data || [];
};

LegoData.registerCurrentStudent = async function(row){
  row = row || {};
  var r = await db.rpc('register_current_student', {
    p_full_name: String(row.full_name || '').trim(),
    p_email: String(row.email || '').trim(),
    p_level: String(row.level || 'A1').trim() || 'A1'
  });
  if (r.error) { throw new Error('[LegoData.registerCurrentStudent] ' + r.error.message); }
  if (!r.data || !r.data.id) { throw new Error('[LegoData.registerCurrentStudent] El RPC no devolvió una identidad válida'); }
  return r.data;
};
LegoData.studentById = async function(id){
  var r = await db.from('students').select('*').eq('id', id);
  if (r.error) { throw new Error('[LegoData.studentById] ' + r.error.message); }
  return (r.data || [])[0] || null;
};
LegoData.studentByAuthUserId = async function(authUserId){
  if (!authUserId) { throw new Error('[LegoData.studentByAuthUserId] Falta authUserId'); }
  var r = await db.from('student_portal_profiles').select('*').eq('auth_user_id', authUserId).limit(1);
  if (r.error) { throw new Error('[LegoData.studentByAuthUserId] ' + r.error.message); }
  return (r.data || [])[0] || null;
};
LegoData.createStudentWithoutAccess = async function(fullName, alias, source){
  var r = await db.rpc('create_student_without_access', {
    p_full_name: String(fullName || '').trim(),
    p_alias: String(alias || fullName || '').trim(),
    p_source: source || 'calendar'
  });
  if (r.error) { throw new Error('[LegoData.createStudentWithoutAccess] ' + r.error.message); }
  var payload = r.data || {};
  if (!payload.student || !payload.student.id) { throw new Error('[LegoData.createStudentWithoutAccess] El RPC no devolvió una identidad válida'); }
  return { student: payload.student, created: payload.created === true };
};
LegoData.connectStudentPortalAccount = async function(studentId, accountStudentId){
  var r = await db.rpc('connect_student_portal_account', {
    p_student_id: studentId,
    p_account_student_id: accountStudentId
  });
  if (r.error) { throw new Error('[LegoData.connectStudentPortalAccount] ' + r.error.message); }
  if (!r.data || !r.data.id) { throw new Error('[LegoData.connectStudentPortalAccount] El RPC no devolvió la identidad conectada'); }
  return r.data;
};

LegoData.adminStudentProfileData = async function(studentId, opts){
  opts = opts || {};
  var includeLedger = opts.includeLedger !== false;
  if (!studentId) { throw new Error('[LegoData.adminStudentProfileData] Falta studentId'); }
  var results = await Promise.all([
    LegoData.studentById(studentId),
    LegoData.assignmentsByStudent(studentId),
    LegoData.responsesByStudent(studentId),
    LegoData.studentVocabularyByStudent(studentId),
    includeLedger ? LegoData.classCreditsByStudent(studentId) : Promise.resolve(null),
    includeLedger ? LegoData.classSessionsByStudent(studentId) : Promise.resolve(null),
    LegoData.vocabularyPracticeEventsByStudent(studentId),
    LegoData.studentAliasesByStudent(studentId)
  ]);
  var payload = {
    student: results[0],
    assignments: results[1] || [],
    responses: results[2] || [],
    vocabulary: results[3] || [],
    practiceEvents: results[6] || [],
    aliases: results[7] || []
  };
  if (includeLedger) {
    payload.classCredits = results[4] || [];
    payload.classSessions = results[5] || [];
  }
  return payload;
};

LegoData.deleteActivity = async function(id){
  // Borrado en cadena: responses -> assignments -> activity.
  // Decidido 2026-07-14: borrar una actividad arrastra las respuestas/asignaciones que cuelgan de ella.
  var asg = await db.from('assignments').select('id').eq('activity_id', id);
  if (asg.error) { throw new Error('[LegoData.deleteActivity.assignments] ' + asg.error.message); }
  var ids = (asg.data || []).map(function(a){ return a.id; });
  if (ids.length){
    var rr = await db.from('responses').delete().in('assignment_id', ids).select('id');
    if (rr.error) { throw new Error('[LegoData.deleteActivity.responses] ' + rr.error.message); }
    var ra = await db.from('assignments').delete().eq('activity_id', id).select('id');
    if (ra.error) { throw new Error('[LegoData.deleteActivity.assignmentsDel] ' + ra.error.message); }
  }
  var r = await db.from('activities').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteActivity] ' + r.error.message); }
  return r.data || [];
};
LegoData.markResponsesReviewed = async function(ids){
  if (!ids || !ids.length) return [];
  var r = await db.from('responses').update({ reviewed: true }).in('id', ids).select('id');
  if (r.error) { throw new Error('[LegoData.markResponsesReviewed] ' + r.error.message); }
  return r.data || [];
};

LegoData.overviewCounts = async function(){
  var r = await db.from('overview_counts').select('*').single();
  if (r.error) { throw new Error('[LegoData.overviewCounts] ' + r.error.message); }
  return r.data || {};
};
LegoData.financeByStudent = async function(){
  var r = await db.from('overview_finance_by_student').select('*');
  if (r.error) { throw new Error('[LegoData.financeByStudent] ' + r.error.message); }
  return r.data || [];
};
function normalizeFinanceStudentBalance(row){
  if (!row) return null;
  return {
    student_id: row.student_id,
    student_name: row.student_name || '',
    email: row.email || '',
    status: row.status || '',
    exclude_from_stats: !!row.exclude_from_stats,
    total_paid_units: Number(row.total_paid_units) || 0,
    total_given_units: Number(row.total_given_units) || 0,
    total_future_units: Number(row.total_future_units) || 0,
    remaining_units: Number(row.remaining_units) || 0
  };
}
LegoData.financeStudentBalances = async function(){
  var r = await db.from('student_finance_balances')
    .select('student_id,student_name,email,status,exclude_from_stats,total_paid_units,total_given_units,total_future_units,remaining_units')
    .order('student_name', { ascending: true });
  if (r.error) { throw new Error('[LegoData.financeStudentBalances] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return normalizeFinanceStudentBalance(row);
  });
};
LegoData.studentFinanceBalance = async function(studentId){
  if (!studentId) { throw new Error('[LegoData.studentFinanceBalance] Falta studentId'); }
  var r = await db.from('student_finance_balances')
    .select('student_id,student_name,email,status,exclude_from_stats,total_paid_units,total_given_units,total_future_units,remaining_units')
    .eq('student_id', studentId)
    .limit(1);
  if (r.error) { throw new Error('[LegoData.studentFinanceBalance] ' + r.error.message); }
  return normalizeFinanceStudentBalance((r.data || [])[0]) || {
    student_id: studentId,
    student_name: '',
    email: '',
    status: '',
    exclude_from_stats: false,
    total_paid_units: 0,
    total_given_units: 0,
    total_future_units: 0,
    remaining_units: 0
  };
};
LegoData.studentBalances = async function(){
  var r = await db.from('student_balances').select('*');
  if (r.error) { throw new Error('[LegoData.studentBalances] ' + r.error.message); }
  return r.data || [];
};

LegoData.activityStats = async function(){
  var r = await db.from('activity_stats').select('*');
  if (r.error) { throw new Error('[LegoData.activityStats] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentProgress = async function(){
  var r = await db.from('student_progress').select('*');
  if (r.error) { throw new Error('[LegoData.studentProgress] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentsRoster = async function(){
  var r = await db.from('student_registry').select('*').order('full_name');
  if (r.error) { throw new Error('[LegoData.studentsRoster] ' + r.error.message); }
  return (r.data || []).map(function(row){
    return {
      id: row.student_id,
      student_id: row.student_id,
      full_name: row.full_name || '',
      email: row.email || null,
      level: row.level || '',
      status: row.status || '',
      role: row.role || 'student',
      access_status: row.access_status || '',
      exclude_from_stats: row.exclude_from_stats === true,
      created_at: row.created_at || null,
      completed_count: Number(row.completed_count) || 0,
      pending_count: Number(row.pending_count) || 0,
      review_count: Number(row.review_count) || 0,
      vocab_count: Number(row.vocab_count) || 0,
      paid_units: Number(row.paid_units) || 0,
      given_units: Number(row.given_units) || 0,
      future_units: Number(row.future_units) || 0,
      remaining_units: Number(row.remaining_units) || 0,
      last_class_date: row.last_class_date || null,
      next_class_date: row.next_class_date || null
    };
  });
};
LegoData.upcomingSessions = async function(opts){
  opts = opts || {};
  var d = new Date();
  var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  var r = await db.from('class_sessions').select('*').eq('cancelled', false).gte('class_date', today).order('class_date', { ascending: true }).order('class_time', { ascending: true }).limit(opts.limit || 5);
  if (r.error) { throw new Error('[LegoData.upcomingSessions] ' + r.error.message); }
  return r.data || [];
};

LegoData.lessonStats = async function(){
  var r = await db.from('lesson_stats').select('*');
  if (r.error) { throw new Error('[LegoData.lessonStats] ' + r.error.message); }
  return r.data || [];
};

LegoData.vocabularyPopularOrganic = async function(opts){
  opts = opts || {};
  var r = await db.from('vocabulary_shared_words_organic').select('term,meaning,student_count').order('student_count', { ascending: false }).order('term').limit(Number(opts.limit) || 8);
  if (r.error) { throw new Error('[LegoData.vocabularyPopularOrganic] ' + r.error.message); }
  return (r.data || []).map(function(row){ return { term: row.term || '', meaning: row.meaning || '', studentCount: Number(row.student_count) || 0 }; });
};

LegoData.adminClassPrepBySession = async function(sessionId, opts){
  opts = opts || {};
  if (!sessionId) { throw new Error('[LegoData.adminClassPrepBySession] Falta sessionId'); }
  var sess = await db.from('class_sessions').select('*').eq('id', sessionId);
  if (sess.error) { throw new Error('[LegoData.adminClassPrepBySession:session] ' + sess.error.message); }
  var session = (sess.data || [])[0] || null;
  if (!session) { throw new Error('[LegoData.adminClassPrepBySession] Clase no encontrada'); }
  var studentId = session.student_id || null;
  var boardPromise = LegoData.classBoardBySession(session.id).catch(function(e){ return { _boardError: e.message || String(e) }; });
  var libraryPromise = opts.includeLibrary && LegoData.library ? LegoData.library() : Promise.resolve([]);
  var ledgerSessionsPromise = opts.includeLedger && studentId ? LegoData.classSessionsByStudent(studentId) : Promise.resolve([]);
  var ledgerCreditsPromise = opts.includeLedger && studentId ? LegoData.classCreditsByStudent(studentId) : Promise.resolve([]);
  if (!studentId) {
    var emptyBoard = await boardPromise;
    return {
      session: session,
      student: null,
      assignments: [],
      responses: [],
      vocabulary: [],
      practiceEvents: [],
      classSessions: [],
      classCredits: [],
      board: emptyBoard && !emptyBoard._boardError ? emptyBoard : null,
      boardError: emptyBoard && emptyBoard._boardError ? emptyBoard._boardError : '',
      library: await libraryPromise,
      libraryLoaded: !!opts.includeLibrary,
      ledgerLoaded: !!opts.includeLedger
    };
  }
  var results = await Promise.all([
    LegoData.studentById(studentId),
    LegoData.assignmentsByStudent(studentId),
    LegoData.unreviewedResponsesByStudent(studentId),
    LegoData.studentVocabularyByStudent(studentId),
    LegoData.vocabularyPracticeEventsByStudent(studentId),
    ledgerSessionsPromise,
    ledgerCreditsPromise,
    boardPromise,
    libraryPromise
  ]);
  var board = results[7];
  return {
    session: session,
    student: results[0],
    assignments: results[1] || [],
    responses: results[2] || [],
    vocabulary: results[3] || [],
    practiceEvents: results[4] || [],
    classSessions: results[5] || [],
    classCredits: results[6] || [],
    board: board && !board._boardError ? board : null,
    boardError: board && board._boardError ? board._boardError : '',
    library: results[8] || [],
    libraryLoaded: !!opts.includeLibrary,
    ledgerLoaded: !!opts.includeLedger
  };
};

// ============================================================
// KERNEL DE UNIDADES FACTURABLES (fuente unica, 2026-07-18)
// La regla de "cuantas unidades vale una clase" vive SOLO aqui.
// admin.html (classSession*) e index.html (cls*) DELEGAN a estas
// funciones; no reimplementar la regla en ningun panel.
// Puras y sincronas: derivan de la sesion, no consultan Supabase.
// ============================================================
LegoData.timeToMinutes = function(value){
  var t = value ? String(value).slice(0, 5) : '';
  if (!t || t.indexOf(':') < 0) return null;
  var p = t.split(':');
  var h = parseInt(p[0], 10);
  if (isNaN(h)) return null;
  return (h * 60) + (parseInt(p[1] || '0', 10) || 0);
};
LegoData.sessionDurationMinutes = function(sess){
  var sm = LegoData.timeToMinutes(sess && sess.class_time);
  if (sm === null) return 0;
  var em = LegoData.timeToMinutes(sess && sess.class_end_time);
  if (em === null) em = sm + 60;
  if (em <= sm) em += 24 * 60;
  return Math.max(0, em - sm);
};
LegoData.unitsFromMinutes = function(minutes){
  var mins = Number(minutes) || 0;
  if (mins <= 0) return 1;
  if (Math.abs(mins - 10) < 0.001) return 0.2;
  return Math.round((mins / 60) * 100) / 100;
};
LegoData.sessionSuggestedUnits = function(classTime, classEndTime){
  return LegoData.unitsFromMinutes(LegoData.sessionDurationMinutes({ class_time: classTime, class_end_time: classEndTime }));
};
LegoData.sessionUnits = function(sess){
  var manual = Number(sess && sess.billable_units);
  if (isFinite(manual) && manual > 0) return manual;
  return LegoData.sessionSuggestedUnits(sess && sess.class_time, sess && sess.class_end_time);
};
