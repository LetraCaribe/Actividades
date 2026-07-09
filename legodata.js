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
      var r = await db.from('profiles').select('*').order('full_name');
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

    assignmentsAll: async function(){
      var r = await db.from('assignments').select('*, profiles(full_name,level), activities(title,slug,level), lessons(title,level)').order('assigned_at', { ascending: false });
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

    responsesByAssignment: async function(assignmentId){
      var r = await db.from('responses').select('*').eq('assignment_id', assignmentId).order('question_num');
      if (r.error) _throw('responsesByAssignment', r.error);
      return r.data || [];
    },

    // Fallback para respuestas viejas (sin assignment_id): por estudiante + slug.
    responsesByStudentSlug: async function(studentId, slug){
      var r = await db.from('responses').select('*').eq('student_id', studentId).eq('activity_slug', slug).order('question_num');
      if (r.error) _throw('responsesByStudentSlug', r.error);
      return r.data || [];
    },

    // Filas de respuesta normalizadas al formato que LegoPlayer(review) espera.
    toSavedRows: function(responses){
      return (responses || []).map(function(r){
        return { answer: r.answer, isCorrect: r.is_correct, questionText: r.question_text };
      });
    },

    // ── lessons ─────────────────────────────────────────────

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
      var r = await db.from('lessons').delete().eq('id', id);
      if (r.error) _throw('deleteLesson', r.error);
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
LegoData.classCreditsByStudent = async function(studentId){
  var r = await db.from('class_credits').select('*').eq('student_id', studentId).order('paid_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.classCreditsByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.insertClassCredit = async function(row){
  var r = await db.from('class_credits').insert(row).select();
  if (r.error) { throw new Error('[LegoData.insertClassCredit] ' + r.error.message); }
  return r.data || [];
};
LegoData.deleteClassCredit = async function(id){
  var r = await db.from('class_credits').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteClassCredit] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteClassCredit] RLS bloqueo el delete (0 filas) en credit ' + id); }
  return r.data;
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
LegoData.deleteClassSession = async function(id){
  var r = await db.from('class_sessions').delete().eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.deleteClassSession] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.deleteClassSession] RLS bloqueo el delete (0 filas) en session ' + id); }
  return r.data;
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
LegoData.upsertStudentAlias = async function(payload){
  var r = await db.from('student_aliases').upsert(payload, { onConflict: 'alias_key' }).select();
  if (r.error) { throw new Error('[LegoData.upsertStudentAlias] ' + r.error.message); }
  return r.data || [];
};

LegoData.billingGroupMembersByStudents = async function(studentIds){
  var r = await db.from('billing_group_members').select('id,group_id,student_id').in('student_id', studentIds || []);
  if (r.error) { throw new Error('[LegoData.billingGroupMembersByStudents] ' + r.error.message); }
  return r.data || [];
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

// ── vocabulario ─────────────────────────────────────────
LegoData.studentVocabulary = async function(){
  var r = await db.from('student_vocabulary').select('*').order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.studentVocabulary] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentVocabularyByStudent = async function(studentId){
  var r = await db.from('student_vocabulary').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.studentVocabularyByStudent] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentVocabularyByStudents = async function(studentIds){
  if (!studentIds || !studentIds.length) return [];
  var r = await db.from('student_vocabulary').select('*').in('student_id', studentIds);
  if (r.error) { throw new Error('[LegoData.studentVocabularyByStudents] ' + r.error.message); }
  return r.data || [];
};
LegoData.studentLevelsByIds = async function(studentIds){
  studentIds = (studentIds || []).map(function(id){ return String(id || ''); }).filter(function(id){ return id; });
  var unique = {};
  studentIds.forEach(function(id){ unique[id] = true; });
  var ids = Object.keys(unique);
  if (!ids.length) return {};
  var r = await db.from('profiles').select('id,level').in('id', ids);
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
    .select('entry_type,ticket_key,term,meaning,student_count')
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
LegoData.insertStudentVocabulary = async function(rowOrRows){
  var rows = await LegoData.withVocabularyLevelSnapshots(rowOrRows);
  var r = await db.from('student_vocabulary').insert(rows).select();
  if (r.error) { throw new Error('[LegoData.insertStudentVocabulary] ' + r.error.message); }
  return r.data || [];
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

LegoData.vocabularyTicketKey = function(entry){
  var termKey = String((entry && entry.term_key) || LegoData.vocabularyKey(entry && entry.term));
  var meaningKey = LegoData.vocabularyKey(entry && entry.meaning);
  if (!termKey && !meaningKey) return '';
  if (!meaningKey) return termKey;
  if (!termKey) return meaningKey;
  return [termKey, meaningKey].sort().join('::');
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
    if (termKey) terms[termKey] = true;
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
    if (!row.term && v.term) row.term = v.term;
    if (v.meaning) row.meanings[v.meaning] = true;
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
        meaning: v.meaning || '',
        entry_type: v.entry_type || '',
        source: v.source || '',
        source_detail: v.source_detail || ''
      });
    }
  });
  return Object.keys(map).map(function(k){
    var row = map[k];
    var studentCount = Object.keys(row.students).length;
    if (studentCount) row.count = studentCount;
    row.meaningList = Object.keys(row.meanings).sort(function(a, b){
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    });
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

LegoData.vocabularyPracticeEvents = async function(){
  var r = await db.from('student_vocabulary_practice_events').select('*').order('created_at', { ascending: false });
  if (r.error) { throw new Error('[LegoData.vocabularyPracticeEvents] ' + r.error.message); }
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


// ── profiles y lecciones (apoyo LegoLesson) ─────────────
LegoData.updateProfile = async function(id, patch){
  var r = await db.from('profiles').update(patch).eq('id', id).select();
  if (r.error) { throw new Error('[LegoData.updateProfile] ' + r.error.message); }
  if (!r.data || !r.data.length) { throw new Error('[LegoData.updateProfile] RLS bloqueo el update (0 filas) en profile ' + id); }
  return r.data[0];
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

// ── profiles: crear / borrar ────────────────────────────
LegoData.insertProfile = async function(row){
  var r = await db.from('profiles').insert(row).select().single();
  if (r.error) { throw new Error('[LegoData.insertProfile] ' + r.error.message); }
  return r.data;
};
LegoData.deleteProfile = async function(id){
  var r = await db.from('profiles').delete().eq('id', id).select('id');
  if (r.error) { throw new Error('[LegoData.deleteProfile] ' + r.error.message); }
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

LegoData.upsertProfile = async function(row){
  var r = await db.from('profiles').upsert(row, { onConflict: 'id' });
  if (r.error) { throw new Error('[LegoData.upsertProfile] ' + r.error.message); }
  return true;
};
LegoData.profileById = async function(id){
  var r = await db.from('profiles').select('*').eq('id', id);
  if (r.error) { throw new Error('[LegoData.profileById] ' + r.error.message); }
  return (r.data || [])[0] || null;
};

LegoData.deleteActivity = async function(id){
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
