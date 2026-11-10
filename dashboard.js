function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(function () {
  const RD_ROW_H = 64;
  const RD_FEATURES = {
    childList: {
      label: 'Child list',
      room: true,
      service: true,
      offline: 'stale'
    },
    childProfile: {
      label: 'View single child profile',
      room: true,
      service: true,
      offline: 'stale'
    },
    healthEvents: {
      label: 'Log child health events',
      room: true,
      service: false,
      offline: 'queue'
    },
    incident: {
      label: 'Log incident',
      room: true,
      service: true,
      offline: 'queue'
    },
    medication: {
      label: 'Log medication',
      room: true,
      service: false,
      offline: 'queue'
    },
    learning: {
      label: 'Go to Learning',
      room: true,
      service: true,
      offline: 'stale'
    },
    learningShare: {
      label: 'Share, archive or delete a post',
      room: true,
      service: true,
      offline: 'blocked'
    },
    attendance: {
      label: 'Attendance',
      room: true,
      service: true,
      offline: 'queue'
    },
    headcount: {
      label: 'Headcount',
      room: true,
      service: true,
      offline: 'queue'
    },
    amendEvent: {
      label: 'Amend a logged event',
      room: true,
      service: false,
      offline: 'blocked'
    }
  };
  const can = (feature, scope) => !!RD_FEATURES[feature][scope];
  const offlineMode = feature => RD_FEATURES[feature].offline;
  const rdOffBlocked = (feature, conn) => conn === 'offline' && offlineMode(feature) === 'blocked';
  const rdAttOn = key => svcOn(key);
  const RD_EVENT_POLICY = {
    who: 'author',
    today: true,
    note: true,
    time: 'service',
    timeNever: ['sleep'],
    del: true,
    delKinds: ['sleep', 'nappy', 'meal', 'sun', 'med', 'note'],
    signedLocked: ['med']
  };
  const rdTimesEditable = () => RD_EVENT_POLICY.time === true || RD_EVENT_POLICY.time === 'service' && (SERVICE.features || {}).eventTimesEditable !== false;
  const rdTimeAmendable = kind => rdTimesEditable() && !RD_EVENT_POLICY.timeNever.includes(kind);
  const RD_FLOOR_AT_SIGNIN = ['sleep', 'nappy', 'sun', 'meal'];
  const rdSignInFloor = (kind, c) => RD_FLOOR_AT_SIGNIN.includes(kind) && c && c.status === 'here' && /^\d{1,2}:\d{2}$/.test(String(c.at)) ? c.at : null;
  const rdChange = (kind, by, educator, {
    past = false,
    away = false,
    offline = false,
    signed = false
  } = {}) => {
    let why = null;
    let hint = null;
    let off = false;
    if (past && RD_EVENT_POLICY.today) why = 'A past day is a closed record. It can’t be changed.';else if (away) why = 'Records are changed in the child’s room, not from the service dashboard.';else if (RD_EVENT_POLICY.who === 'author' && (!by || by !== educator.name)) {
      why = by ? `Only ${by} can change this record, because they recorded it.` : 'Only the educator who recorded this can change it, and it doesn’t say who that was.';
    }
    const locked = !why && signed && RD_EVENT_POLICY.signedLocked.includes(kind);
    let ok = !why;
    if (ok && offline) {
      ok = false;
      if (!locked) {
        why = 'Changing a record needs a connection.';
        off = true;
      }
    }
    if (locked) {
      why = 'A signed record can’t be changed.';
      hint = 'If it is wrong, delete it and record the dose again. The audit trail keeps what it said.';
    }
    return {
      amend: ok && !locked,
      del: ok && RD_EVENT_POLICY.del && RD_EVENT_POLICY.delKinds.includes(kind),
      why,
      hint,
      offline: off
    };
  };
  const rdHcOn = key => svcOn(key);
  const RD_SYNC_FG = 'var(--sd-colour-text-on-purple)';
  const RD_SYNC_BG = 'var(--sd-colour-surface-purple)';
  const RD_SYNC_DOT = 'var(--sd-colour-text-on-purple)';
  const RD_ROOMS = [{
    key: 'nursery',
    name: 'Nursery',
    ages: '1 yr',
    educators: 3,
    staffRequired: 4,
    booked: 13,
    limit: 4,
    care: 'ldc'
  }, {
    key: 'possum',
    name: 'Possum Room',
    ages: '2 yrs',
    educators: 4,
    staffRequired: 5,
    booked: 17,
    limit: 4,
    care: 'ldc'
  }, {
    key: 'koala',
    name: 'Koala Room',
    ages: '3–4 yrs',
    educators: 2,
    staffRequired: 2,
    booked: 20,
    limit: 11,
    care: 'ldc'
  }, {
    key: 'kangaroo',
    name: 'Kangaroo Room',
    ages: '4 yrs',
    educators: 1,
    staffRequired: 2,
    booked: 20,
    limit: 11,
    care: 'ldc'
  }, {
    key: 'wombat',
    name: 'Wombat Club',
    ages: '3–5 yrs',
    educators: 2,
    staffRequired: 3,
    booked: 24,
    limit: 11,
    care: 'vac'
  }, {
    key: 'bilby',
    name: 'Bilby Club',
    ages: '5–12 yrs',
    educators: 2,
    staffRequired: 2,
    booked: 18,
    limit: 15,
    care: 'vac'
  }, {
    key: 'brushtail',
    name: 'Brushtail Hall',
    ages: '3–5 yrs',
    educators: 9,
    staffRequired: 10,
    booked: 100,
    limit: 11,
    care: 'ldc'
  }];
  const RD_CARE = {
    ldc: {
      label: 'Long day care',
      events: ['sleep', 'nappy', 'meal', 'sun']
    },
    oshc: {
      label: 'OSHC',
      events: ['meal', 'sun']
    },
    vac: {
      label: 'Vacation care',
      events: ['meal', 'sun']
    }
  };
  const RD_SLEEP_INTERVAL = 10;
  const RD_NAPPY_INTERVAL = 180;
  const RD_SUN_WINDOW = 180;
  const RD_LAST_KEPT = 6;
  const RD_DUE_SOON = 10;
  const RD_SLEEP_SOON = 3;
  const rdDueLabel = (event, dueIn) => dueIn < 0 ? `${event} · due ${-dueIn} min ago` : dueIn === 0 ? `${event} · due now` : `${event} · due in ${dueIn} min`;
  const rdDueAlert = (event, dueIn, kind = 'due') => ({
    kind,
    overdue: dueIn < 0,
    dueIn,
    label: rdDueLabel(event, dueIn)
  });
  const RD_NOW = '12:55';
  const RD_MINS = s => {
    const [h, m] = String(s).split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const RD_HHMM = m => `${Math.floor(m / 60)}:${String((m % 60 + 60) % 60).padStart(2, '0')}`;
  const RD_AGO = mins => RD_HHMM(RD_MINS(RD_NOW) - mins);
  const RD_EVENT_TYPES = [{
    key: 'sleep',
    label: 'Sleep checks',
    hint: 'Sleep and rest rounds'
  }, {
    key: 'nappy',
    label: 'Nappy / toileting',
    hint: 'Changes and toilet events'
  }, {
    key: 'meal',
    label: 'Meals',
    hint: 'What each child was served and ate'
  }, {
    key: 'sun',
    label: 'Sunscreen',
    hint: 'Application rounds'
  }, {
    key: 'med',
    label: 'Medication',
    hint: 'One child at a time · a due dose always shows'
  }];
  const rdGateEvents = ev => ({
    ...ev,
    ...(svcOn('medication') ? {} : {
      med: false
    }),
    ...(svcOn('nutrition') ? {} : {
      meal: false
    })
  });
  const rdEventsDefault = (careKey, sleepTrack) => {
    const on = {};
    RD_EVENT_TYPES.forEach(e => {
      on[e.key] = (RD_CARE[careKey] || RD_CARE.ldc).events.includes(e.key) || e.key === 'med';
    });
    on.sleepTrack = 'Sleep';
    return on;
  };
  const RD_ROW_DETAIL = [{
    key: 'events',
    label: 'Recent events',
    hint: 'The last three event icons and how long ago each was'
  }, {
    key: 'time',
    label: 'Signed-in time',
    hint: 'When the child arrived or left'
  }, {
    key: 'state',
    label: 'Sleep / awake state',
    hint: 'A Sleeping, Resting or Awake pill on every signed-in child'
  }, {
    key: 'health',
    label: 'Health tags',
    hint: 'Allergies, dietary needs and other standing health notes'
  }];
  const RD_ROW_DETAIL_DEFAULT = {
    events: false,
    time: false,
    state: false,
    health: true
  };
  const RD_EDUCATOR = {
    name: 'Grace Chen',
    img: 'img/p5.jpg'
  };
  const RD_EDUCATORS = [RD_EDUCATOR, {
    name: 'Sam Okafor',
    img: 'img/p12.jpg'
  }, {
    name: 'Priya Anand',
    img: 'img/p32.jpg'
  }];
  const RD_GROUPS = [{
    key: 'here',
    label: 'Signed in'
  }, {
    key: 'expected',
    label: 'Booked in'
  }, {
    key: 'gone',
    label: 'Signed out'
  }, {
    key: 'absent',
    label: 'Absent'
  }, {
    key: 'holiday',
    label: 'Holiday'
  }];
  const RD_GROUPINGS = [{
    key: 'attendance',
    label: 'Attendance'
  }, {
    key: 'sleep',
    label: 'Sleep / rest'
  }, {
    key: 'sun',
    label: 'Sunscreen',
    event: 'sun'
  }, {
    key: 'age',
    label: 'Age'
  }, {
    key: 'school',
    label: 'School'
  }, {
    key: 'grade',
    label: 'Grade'
  }, {
    key: 'tags',
    label: 'Tags'
  }, {
    key: 'all',
    label: 'All'
  }];
  const RD_TAG_GROUPING = 'tags';
  const RD_UNGROUPED = 'all';
  const RD_GROUP_MENU = RD_GROUPINGS.filter(g => g.key !== RD_UNGROUPED && !g.event);
  const rdEventGroupingsFor = events => RD_GROUPINGS.filter(g => g.event && events && events[g.event]);
  const rdGroupingOrder = (a, b) => RD_GROUPINGS.findIndex(x => x.key === a.key) - RD_GROUPINGS.findIndex(x => x.key === b.key);
  const rdGroupingFor = (grouping, events) => {
    const g = RD_GROUPINGS.find(x => x.key === grouping);
    return g && g.event && !(events && events[g.event]) ? RD_GROUP_DEFAULT : grouping;
  };
  const RD_GROUP_DEFAULT = 'attendance';
  const rdGroupDefault = () => svcOn('attendance') ? RD_GROUP_DEFAULT : RD_UNGROUPED;
  const RD_GROUP_OFF_LABEL = 'None';
  const RD_FIELD_GROUPINGS = ['age', 'school', 'grade'];
  const RD_GROUPING_LEGACY = {
    class: 'kinder'
  };
  const rdReadGrouping = v => {
    const k = RD_GROUPING_LEGACY[v] || v;
    return RD_GROUPINGS.some(g => g.key === k) ? k : 'attendance';
  };
  const RULE_FILTER = 'a';
  const RULE_BANDS = 'b';
  const RD_SELECT_RULES = [{
    key: RULE_FILTER,
    label: 'A · Filtering'
  }, {
    key: RULE_BANDS,
    label: 'B · Named bands'
  }];
  const rdReadRule = v => v === RULE_BANDS || v === 'c' ? RULE_BANDS : RULE_FILTER;
  const rdGroupsCarry = (rule, facets, grouping) => rule === RULE_BANDS ? true : grouping !== RD_UNGROUPED && (!!rdFacetChips(facets).length || grouping !== 'attendance');
  const RD_SLEEP_GROUPS = [{
    key: 'sleeping',
    label: 'Sleeping',
    test: c => c.state === 'Sleeping'
  }, {
    key: 'resting',
    label: 'Resting',
    test: c => c.state === 'Resting'
  }, {
    key: 'unsettled',
    label: 'Unsettled or crying',
    test: c => c.state === 'Unsettled' || c.state === 'Crying'
  }, {
    key: 'awake',
    label: 'Awake',
    test: c => c.state === 'Awake'
  }];
  const RD_SORTS = [{
    key: 'first',
    label: 'First name'
  }, {
    key: 'last',
    label: 'Last name'
  }];
  const RD_HEALTH_FLAGS = [{
    key: 'allergy',
    label: 'Allergy'
  }, {
    key: 'anaphylaxis',
    label: 'EpiPen / Anapen'
  }, {
    key: 'medication',
    label: 'Medication'
  }, {
    key: 'disability',
    label: 'Additional needs'
  }];
  const RD_AGE_BANDS = [{
    key: 'u2',
    label: 'Under 2',
    test: a => a < 2
  }, {
    key: '2',
    label: '2 years',
    test: a => a >= 2 && a < 3
  }, {
    key: '3',
    label: '3 years',
    test: a => a >= 3 && a < 4
  }, {
    key: '4',
    label: '4 years',
    test: a => a >= 4 && a < 5
  }, {
    key: '5',
    label: '5 years',
    test: a => a >= 5 && a < 6
  }, {
    key: '6-8',
    label: '6–8 years',
    test: a => a >= 6 && a < 9
  }, {
    key: '9-12',
    label: '9–12 years',
    test: a => a >= 9
  }];
  const RD_GRADE_ORDER = ['Preschool', 'Prep', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const rdLastName = name => name.trim().split(/\s+/).slice(-1)[0];
  const rdSortItems = (arr, sortKey) => [...arr].sort((a, b) => {
    const av = sortKey === 'last' ? rdLastName(a.name) : a.name;
    const bv = sortKey === 'last' ? rdLastName(b.name) : b.name;
    return av.localeCompare(bv);
  });
  const rdLatestAt = (c, kind) => {
    const e = rdLastOf(c, kind);
    const was = ((c.pre || {})[kind] || {}).entry;
    const times = [e && e.at, was && was[1]].filter(Boolean);
    return times.length ? times.reduce((a, b) => RD_MINS(b) > RD_MINS(a) ? b : a) : null;
  };
  const rdSunLast = c => rdLatestAt(c, 'sun');
  const rdSunApplied = c => {
    const at = rdSunLast(c);
    if (!at) return false;
    const since = RD_MINS(RD_NOW) - RD_MINS(at);
    return since >= 0 && since < RD_SUN_WINDOW;
  };
  const rdSunWords = c => {
    const at = rdSunLast(c);
    if (!at) return 'None today';
    const ago = rdAgo(at);
    return ago ? `${rdSunApplied(c) ? 'Applied' : 'Last applied'} ${ago.charAt(0).toLowerCase()}${ago.slice(1)}` : null;
  };
  function rdSubGroup(kids, grouping, inList = false) {
    if (grouping === 'age') {
      const g = RD_AGE_BANDS.map(b => ({
        key: 'age-' + b.key,
        label: b.label,
        items: kids.filter(c => c.age != null && b.test(c.age))
      }));
      g.push({
        key: 'age-none',
        label: 'Age not specified',
        items: kids.filter(c => c.age == null)
      });
      return g.filter(x => x.items.length);
    }
    if (grouping === 'grade') {
      const vals = [...new Set(kids.map(c => c.grade).filter(Boolean))].sort((a, b) => RD_GRADE_ORDER.indexOf(a) - RD_GRADE_ORDER.indexOf(b));
      const g = vals.map(v => ({
        key: `grade-${v}`,
        label: v,
        items: kids.filter(c => c.grade === v)
      }));
      g.push({
        key: 'grade-young',
        label: 'Not yet at preschool',
        items: kids.filter(c => !c.grade && c.age != null && c.age < 3)
      });
      g.push({
        key: 'grade-none',
        label: 'Grade not recorded',
        items: kids.filter(c => !c.grade && !(c.age != null && c.age < 3))
      });
      return g;
    }
    if (grouping === 'health') {
      const g = RD_HEALTH_FLAGS.map(f => ({
        key: 'health-' + f.key,
        label: f.label,
        items: kids.filter(c => c[f.key])
      }));
      g.push({
        key: 'health-none',
        label: 'No health flags',
        items: kids.filter(c => !RD_HEALTH_FLAGS.some(f => c[f.key]))
      });
      return g;
    }
    if (grouping === 'sleep') {
      if (!kids.some(c => c.status === 'here')) return [{
        key: 'all',
        label: null,
        items: kids
      }];
      const g = RD_SLEEP_GROUPS.map(s => ({
        key: 'sleep-' + s.key,
        label: s.label,
        items: kids.filter(s.test)
      }));
      g.push({
        key: 'sleep-none',
        label: 'No sleep or rest recorded',
        items: kids.filter(c => !RD_SLEEP_GROUPS.some(s => s.test(c)))
      });
      return g;
    }
    if (grouping === 'sun') {
      if (!inList) return [{
        key: 'all',
        label: null,
        items: kids
      }];
      if (!kids.some(c => c.status === 'here')) return [{
        key: 'all',
        label: null,
        items: kids
      }];
      return [{
        key: 'sun-applied',
        label: 'Applied',
        items: kids.filter(rdSunApplied)
      }, {
        key: 'sun-others',
        label: 'Not applied recently',
        items: kids.filter(c => !rdSunApplied(c))
      }];
    }
    if (grouping === 'school') {
      const vals = [...new Set(kids.map(c => c.school).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      const g = vals.map(v => ({
        key: `school-${v}`,
        label: v,
        items: kids.filter(c => c.school === v)
      }));
      g.push({
        key: 'school-none',
        label: 'Not at school yet',
        items: kids.filter(c => !c.school)
      });
      return g;
    }
    if (grouping === 'kinder') {
      const field = 'kinder';
      const order = RD_KINDER_PROGRAMS;
      const rank = v => {
        const i = order.indexOf(v);
        return i === -1 ? order.length : i;
      };
      const vals = [...new Set(kids.map(c => c[field]).filter(Boolean))].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
      const g = vals.map(v => ({
        key: `${field}-${v}`,
        label: v,
        items: kids.filter(c => c[field] === v)
      }));
      g.push({
        key: 'kinder-school',
        label: 'At school',
        items: kids.filter(c => !c.kinder && c.school)
      });
      g.push({
        key: 'kinder-none',
        label: 'No kinder program recorded',
        items: kids.filter(c => !c.kinder && !c.school)
      });
      return g;
    }
    if (grouping === RD_TAG_GROUPING) {
      const vals = [...new Map(kids.filter(c => c.childTag).map(c => [c.childTag.id, c.childTag])).values()].sort((a, b) => a.name.localeCompare(b.name));
      const g = vals.map(v => ({
        key: `tag-${v.id}`,
        label: v.name,
        items: kids.filter(c => c.childTag && c.childTag.id === v.id)
      }));
      g.push({
        key: 'tag-none',
        label: 'No tag',
        items: kids.filter(c => !c.childTag)
      });
      return g;
    }
    return [{
      key: 'all',
      label: null,
      items: kids
    }];
  }
  function rdGroupChildren(kids, grouping, sortKey) {
    if (grouping === 'all') {
      return [{
        key: 'all',
        label: null,
        items: rdSortItems(kids, sortKey)
      }];
    }
    const out = [];
    RD_GROUPS.forEach(att => {
      const inState = kids.filter(c => c.status === att.key);
      if (!inState.length) return;
      if (grouping === 'attendance') {
        out.push({
          key: att.key,
          label: att.label,
          items: rdSortItems(inState, sortKey)
        });
        return;
      }
      rdSubGroup(inState, grouping, true).forEach(sub => {
        if (!sub.items.length) return;
        out.push({
          key: `${att.key}-${sub.key}`,
          label: sub.label ? `${att.label} · ${sub.label}` : att.label,
          items: rdSortItems(sub.items, sortKey)
        });
      });
    });
    return out.filter(g => g.items.length);
  }
  function rdGroupBands(kids, grouping, sortKey) {
    const bands = [];
    RD_GROUPS.forEach(att => {
      const inState = kids.filter(c => c.status === att.key);
      if (!inState.length) return;
      const subs = grouping === 'attendance' || grouping === RD_UNGROUPED ? [{
        key: 'all',
        label: null,
        items: inState
      }] : rdSubGroup(inState, grouping, true);
      const sections = subs.filter(s => s.items.length).map(s => ({
        key: `${att.key}-${s.key}`,
        label: s.label,
        items: rdSortItems(s.items, sortKey)
      }));
      if (!sections.length) return;
      bands.push({
        key: att.key,
        att: att.key,
        label: att.label,
        items: sections.flatMap(s => s.items),
        sections
      });
    });
    return bands;
  }
  const RD_BULKABLE = ['here', 'expected'];
  const RD_GROUPINGS_C = RD_GROUP_MENU;
  const RD_MEAL_SLOTS = [{
    key: 'breakfast',
    label: 'Breakfast'
  }, {
    key: 'morning_tea',
    label: 'Morning tea'
  }, {
    key: 'lunch',
    label: 'Lunch'
  }, {
    key: 'afternoon_tea',
    label: 'Afternoon tea'
  }, {
    key: 'snack',
    label: 'Late snack'
  }, {
    key: 'dinner',
    label: 'Dinner'
  }, {
    key: 'bottle',
    label: 'Bottle'
  }];
  const rdSlotLabel = k => (RD_MEAL_SLOTS.find(s => s.key === k) || {}).label || null;
  const rdMealSlotAt = hhmm => {
    const m = RD_MINS(hhmm);
    return m < 240 ? 'snack' : m < 540 ? 'breakfast' : m < 690 ? 'morning_tea' : m < 840 ? 'lunch' : m < 1020 ? 'afternoon_tea' : 'dinner';
  };
  const RD_UNITS = {
    serving: {
      label: 'serving',
      many: 'servings',
      max: 10
    },
    portion: {
      label: 'portion',
      many: 'portions',
      max: 10
    },
    cup: {
      label: 'cup',
      many: 'cups',
      max: 10
    },
    slice: {
      label: 'slice',
      many: 'slices',
      max: 20
    },
    piece: {
      label: 'piece',
      many: 'pieces',
      max: 20
    },
    g: {
      label: 'g',
      many: 'g',
      max: 1000
    },
    ml: {
      label: 'mL',
      many: 'mL',
      max: 1000
    }
  };
  const RD_ANY_UNITS = Object.keys(RD_UNITS);
  const rdQty = (raw, unit) => {
    const t = String(raw == null ? '' : raw).trim().replace(',', '.');
    const frac = t.match(/^(\d{1,2})\s*\/\s*(\d{1,2})$/);
    const n = /^\d{1,4}(\.\d{1,2})?$/.test(t) ? parseFloat(t) : frac && Number(frac[2]) > 0 ? Number(frac[1]) / Number(frac[2]) : null;
    return n != null && n > 0 && n <= ((RD_UNITS[unit] || {}).max || 1000) ? Math.round(n * 100) / 100 : null;
  };
  const rdQtyWhy = (raw, unit) => {
    const t = String(raw == null ? '' : raw).trim();
    if (!t || rdQty(t, unit) != null) return null;
    const frac = t.match(/^(\d{1,2})\s*\/\s*(\d{1,2})$/);
    const val = frac && Number(frac[2]) > 0 ? Number(frac[1]) / Number(frac[2]) : /^\d+([.,]\d+)?$/.test(t) ? parseFloat(t.replace(',', '.')) : null;
    const u = RD_UNITS[unit] || {
      many: '',
      max: 1000
    };
    if (val == null) return 'Use a number, like 1 or 0.5';
    if (val <= 0) return 'More than 0';
    if (val > u.max) return `Up to ${u.max} ${u.many}`.trim();
    return 'Use a number, like 1 or 0.5';
  };
  const rdUnitText = (qty, unit) => {
    const u = RD_UNITS[unit];
    return u ? `${qty} ${Number(qty) === 1 ? u.label : u.many}` : String(qty);
  };
  const RD_ITEM_SCOPES = [['all', 'All'], ['food', 'Food'], ['drink', 'Drink'], ['other', 'Other']];
  const RD_ITEMS = [{
    key: 'fruit-yoghurt',
    name: 'Fruit and yoghurt',
    type: 'food',
    units: ['serving', 'portion', 'cup', 'g'],
    allergens: ['dairy'],
    menu: 'morning_tea'
  }, {
    key: 'bolognese',
    name: 'Spaghetti bolognese',
    type: 'food',
    units: ['serving', 'portion', 'cup', 'g'],
    allergens: ['gluten'],
    menu: 'lunch'
  }, {
    key: 'chicken-rice',
    name: 'Chicken and vegetable rice',
    type: 'food',
    units: ['serving', 'portion', 'cup', 'g'],
    allergens: [],
    menu: 'lunch'
  }, {
    key: 'shepherds-pie',
    name: 'Shepherd’s pie',
    type: 'food',
    units: ['serving', 'portion', 'cup', 'g'],
    allergens: ['dairy'],
    menu: 'lunch'
  }, {
    key: 'cheese-crackers',
    name: 'Cheese, crackers and fruit',
    type: 'food',
    units: ['serving', 'portion', 'piece'],
    allergens: ['dairy', 'gluten'],
    menu: 'afternoon_tea'
  }, {
    key: 'toast-fruit',
    name: 'Toast and fruit',
    type: 'food',
    units: ['serving', 'slice', 'piece'],
    allergens: ['gluten'],
    menu: 'snack'
  }, {
    key: 'scrambled-egg',
    name: 'Scrambled egg',
    type: 'food',
    units: ['serving', 'portion', 'g'],
    allergens: ['egg']
  }, {
    key: 'porridge',
    name: 'Porridge',
    type: 'food',
    units: ['serving', 'cup', 'g'],
    allergens: ['gluten']
  }, {
    key: 'toast-butter',
    name: 'Toast with butter',
    type: 'food',
    units: ['slice', 'piece', 'serving'],
    allergens: ['gluten', 'dairy']
  }, {
    key: 'pb-sandwich',
    name: 'Peanut butter sandwich',
    type: 'food',
    units: ['serving', 'slice', 'piece'],
    allergens: ['peanut', 'gluten']
  }, {
    key: 'sesame-crackers',
    name: 'Sesame crackers',
    type: 'food',
    units: ['serving', 'piece'],
    allergens: ['sesame', 'gluten']
  }, {
    key: 'fish-fingers',
    name: 'Fish fingers',
    type: 'food',
    units: ['serving', 'piece'],
    allergens: ['fish', 'gluten']
  }, {
    key: 'fresh-fruit',
    name: 'Fresh fruit',
    type: 'food',
    units: ['serving', 'piece', 'slice', 'g'],
    allergens: []
  }, {
    key: 'veg-sticks',
    name: 'Vegetable sticks',
    type: 'food',
    units: ['serving', 'piece', 'g'],
    allergens: []
  }, {
    key: 'rice-crackers',
    name: 'Rice crackers',
    type: 'food',
    units: ['serving', 'piece'],
    allergens: []
  }, {
    key: 'baby-cereal',
    name: 'Baby cereal',
    type: 'food',
    units: ['serving', 'g'],
    allergens: ['gluten']
  }, {
    key: 'pureed-veg',
    name: 'Pureed vegetables',
    type: 'food',
    units: ['serving', 'g', 'cup'],
    allergens: []
  }, {
    key: 'water',
    name: 'Water',
    type: 'drink',
    units: ['ml', 'cup'],
    allergens: []
  }, {
    key: 'cow-milk',
    name: 'Cow’s milk',
    type: 'drink',
    units: ['ml', 'cup'],
    allergens: ['dairy']
  }, {
    key: 'soy-milk',
    name: 'Soy milk',
    type: 'drink',
    units: ['ml', 'cup'],
    allergens: ['soy']
  }, {
    key: 'juice',
    name: 'Diluted juice',
    type: 'drink',
    units: ['ml', 'cup'],
    allergens: []
  }, {
    key: 'formula',
    name: 'Infant formula',
    type: 'drink',
    units: ['ml'],
    allergens: ['dairy']
  }, {
    key: 'breast-milk',
    name: 'Expressed breast milk',
    type: 'drink',
    units: ['ml'],
    allergens: []
  }, {
    key: 'thickened',
    name: 'Thickened fluid',
    type: 'other',
    units: ['ml', 'cup'],
    allergens: []
  }, {
    key: 'baby-pouch',
    name: 'Baby food pouch',
    type: 'other',
    units: ['serving', 'g'],
    allergens: []
  }, {
    key: 'supplement',
    name: 'Dietary supplement',
    type: 'other',
    units: ['serving', 'ml'],
    allergens: []
  }];
  const rdItemByKey = k => RD_ITEMS.find(i => i.key === k) || null;
  const rdUnitsFor = (item, slot) => slot === 'bottle' ? ['ml'] : item && item.units || RD_ANY_UNITS;
  const rdNotWord = (type, slot) => type === 'drink' || slot === 'bottle' ? 'drunk' : 'eaten';
  const rdMealText = items => (items || []).map(i => `${i.name} ${rdUnitText(i.qty, i.unit)}${i.notEaten ? `, not ${rdNotWord(i.type)}` : ''}`).join(' · ');
  const rdMealEntry = (at, slot, list, note) => {
    const items = list.map(([key, qty, notEaten]) => {
      const it = rdItemByKey(key);
      return {
        key,
        name: it.name,
        type: it.type,
        qty,
        unit: rdUnitsFor(it, slot)[0],
        ...(notEaten ? {
          notEaten: true
        } : null)
      };
    });
    return ['meal', at, rdMealText(items), note || null, rdSlotLabel(slot), null, {
      meal: {
        slot,
        items
      }
    }];
  };
  const RD_ALLERGEN_WORDS = [['peanut', /peanut/i], ['tree_nut', /tree[\s-]*nut/i], ['egg', /\begg/i], ['dairy', /dairy|\bmilk|lactose/i], ['gluten', /gluten|coeliac|celiac|wheat/i], ['sesame', /sesame/i], ['soy', /\bsoy/i], ['fish', /\bfish/i], ['shellfish', /shellfish|crustacean/i]];
  const RD_ALLERGEN_NAME = {
    peanut: 'peanut',
    tree_nut: 'tree nut',
    egg: 'egg',
    dairy: 'dairy',
    gluten: 'gluten',
    sesame: 'sesame',
    soy: 'soy',
    fish: 'fish',
    shellfish: 'shellfish'
  };
  const rdChildTexts = c => [...(c && c.tags || []), ...(c && c.dietary || [])];
  const rdChildAllergens = c => {
    const out = [];
    rdChildTexts(c).forEach(t => RD_ALLERGEN_WORDS.forEach(([k, re]) => {
      if (re.test(t) && !out.some(o => o.key === k)) out.push({
        key: k,
        tag: t
      });
    }));
    return out;
  };
  const rdItemAllergens = i => i.typed ? RD_ALLERGEN_WORDS.filter(([, re]) => re.test(i.name)).map(([k]) => k) : (rdItemByKey(i.key) || {}).allergens || [];
  const rdMealConflicts = (c, items) => rdChildAllergens(c).map(({
    key,
    tag
  }) => ({
    key,
    tag,
    names: (items || []).filter(i => rdItemAllergens(i).includes(key)).map(i => i.name)
  })).filter(x => x.names.length);
  const RD_NONFOOD_TAG = /seasonal|hay ?fever|pollen|dust|\bpets?\b|animal|insect|sting|latex|asthma|eczema|medication|drug/i;
  const rdChildUnread = c => rdChildTexts(c).filter(t => /allerg(y|ies)|intoleran|sensitiv|coeliac|celiac|anaphyl|\bnuts?\b|seafood|kiwi|sulph/i.test(t) && !RD_NONFOOD_TAG.test(t) && !RD_ALLERGEN_WORDS.some(([, re]) => re.test(t)));
  const rdMealUnchecked = (c, items) => {
    const out = [];
    const un = rdChildUnread(c);
    if (un.length) out.push(`Not checked against this meal: ${un.join(', ')}`);
    if ((items || []).some(i => i.typed) && rdChildAllergens(c).length) out.push('Typed items are only checked by their name');
    return out;
  };
  const RD_KOALA = [{
    id: 1,
    name: 'Alex Turner',
    img: 14,
    age: 3,
    at: '7:02',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:47', 'Asleep'], ['nappy', '12:05', 'Wet'], rdMealEntry('11:30', 'lunch', [['bolognese', 1], ['water', 150]])],
    corrected: ['nappy'],
    audit: [{
      at: '12:06',
      by: 'Grace Chen',
      action: 'Amended Nappy check',
      detail: 'Time 11:58 am → 12:05 pm',
      reason: 'Logged from memory after the round'
    }]
  }, {
    id: 2,
    name: 'Mia Chen',
    img: 20,
    age: 3,
    at: '7:05',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:50', 'Asleep'], ['nappy', '11:55', 'Dry'], rdMealEntry('11:30', 'lunch', [['bolognese', 1], ['water', 150]])]
  }, {
    id: 3,
    name: 'Toby Fairweather',
    img: 33,
    age: 3,
    medication: true,
    at: '7:06',
    status: 'here',
    state: 'Awake',
    alert: rdDueAlert('Medication', -2, 'urgent'),
    last: [rdMealEntry('11:30', 'lunch', [['bolognese', 0.5]], 'Off his food today'), ['nappy', '11:10', 'Soiled'], ['sun', '10:15', 'Applied']],
    meds: [{
      name: 'Amoxicillin',
      dose: '5 mL',
      route: 'Oral',
      auth: 'Parent authorisation',
      authBy: 'Rachel Fairweather',
      authOn: '17 Aug',
      expiresIn: -1,
      window: 'Midday, with food'
    }]
  }, {
    id: 4,
    name: 'Emma Johnson',
    img: 45,
    age: 3,
    allergy: true,
    anaphylaxis: true,
    medication: true,
    at: '7:10',
    status: 'here',
    state: 'Sleeping',
    tags: ['Peanut allergy', 'Asthma'],
    last: [['sleep', '12:52', 'Asleep'], rdMealEntry('11:30', 'lunch', [['bolognese', 1], ['water', 150]]), ['sun', '10:15', 'Applied']],
    meds: [{
      name: 'EpiPen Jr (adrenaline)',
      dose: '0.15 mg auto-injector',
      route: 'Intramuscular',
      ongoing: true,
      auth: 'ASCIA action plan',
      authBy: 'Dr N. Okonkwo',
      authOn: '2 Jul',
      expiresIn: 288,
      window: 'Anaphylaxis only — call 000'
    }, {
      name: 'Ventolin (salbutamol)',
      dose: '2 puffs via spacer',
      route: 'Inhaled',
      ongoing: true,
      auth: 'Asthma action plan',
      authBy: 'Dr N. Okonkwo',
      authOn: '2 Jul',
      expiresIn: 15,
      window: 'As needed for wheeze'
    }]
  }, {
    id: 5,
    name: 'Liam Smith',
    img: 52,
    age: 4,
    allergy: true,
    at: '7:12',
    status: 'here',
    state: 'Awake',
    tags: ['Seasonal allergies'],
    last: [rdMealEntry('11:30', 'lunch', [['bolognese', 1]]), ['nappy', '10:40', 'Dry']]
  }, {
    id: 6,
    name: 'Sophia Martinez',
    img: 41,
    age: 4,
    allergy: true,
    at: '7:14',
    status: 'here',
    state: 'Awake',
    tags: ['Gluten sensitivity'],
    last: [rdMealEntry('11:35', 'lunch', [['chicken-rice', 1]]), ['sun', '10:15', 'Applied']]
  }, {
    id: 7,
    name: 'Noah Lee',
    img: 68,
    age: 3,
    medication: true,
    at: '7:18',
    status: 'here',
    state: 'Unsettled',
    tags: ['Asthma'],
    last: [rdMealEntry('11:30', 'lunch', [['bolognese', 1, true]]), ['nappy', '10:20', 'Wet']]
  }, {
    id: 8,
    name: 'Darrin Webb',
    img: 60,
    age: 4,
    disability: true,
    at: '7:40',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:50', 'Asleep'], rdMealEntry('11:30', 'lunch', [['bolognese', 0.5]], 'Packed the rest to take home'), ['sun', '10:15', 'Applied']]
  }, {
    id: 9,
    name: 'Ava Martin',
    img: 47,
    age: 4,
    at: '8:30',
    status: 'expected'
  }, {
    id: 10,
    name: 'Ethan Hall',
    img: 13,
    at: '9:00',
    status: 'expected'
  }, {
    id: 11,
    name: 'Isla Brooks',
    img: 31,
    age: 3,
    status: 'holiday'
  }, {
    id: 12,
    name: 'Oliver Brown',
    img: 12,
    age: 3,
    at: '12:40',
    status: 'gone',
    by: 'Mum'
  }, {
    id: 13,
    name: 'Hannah Patel',
    img: 24,
    age: 3,
    status: 'absent'
  }, {
    id: 14,
    name: 'Zara Mikhail',
    img: 28,
    age: 3,
    at: '7:22',
    status: 'here',
    state: 'Awake',
    last: [rdMealEntry('11:30', 'lunch', [['bolognese', 1]])]
  }, {
    id: 15,
    name: 'Finn O’Donnell',
    img: 17,
    age: 4,
    allergy: true,
    at: '7:26',
    status: 'here',
    state: 'Resting',
    tags: ['Egg allergy'],
    last: [['sleep', '12:50', 'Resting'], rdMealEntry('11:30', 'lunch', [['chicken-rice', 1]])]
  }, {
    id: 16,
    name: 'Amira Haddad',
    img: 36,
    age: 3,
    at: '7:31',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:49', 'Asleep'], ['nappy', '11:50', 'Dry']]
  }, {
    id: 17,
    name: 'Leo Whitaker',
    img: 55,
    age: 4,
    disability: true,
    at: '7:35',
    status: 'here',
    state: 'Awake',
    last: [rdMealEntry('11:30', 'lunch', [['bolognese', 0.5]]), ['sun', '10:15', 'Applied']]
  }, {
    id: 18,
    name: 'Ruth Okonjo',
    img: 43,
    age: 4,
    at: '7:48',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:55', 'Asleep'], rdMealEntry('11:30', 'lunch', [['bolognese', 1]])]
  }, {
    id: 19,
    name: 'Nina Kovac',
    img: 19,
    age: 4,
    at: '8:45',
    status: 'expected'
  }, {
    id: 20,
    name: 'Beau Sinclair',
    img: 49,
    age: 3,
    at: '9:15',
    status: 'expected'
  }].map(c => ({
    ...c,
    room: 'koala'
  }));
  const rdInitialRoster = () => svcOn('attendance') ? RD_ALL_CHILDREN : [...RD_ALL_CHILDREN, ...RD_OTHER.map(rdWithKinder).map(rdWithConsiderations)].map(c => ({
    ...c,
    status: 'here',
    at: c.at || RD_NOW,
    by: null,
    blocked: undefined,
    absentNote: undefined
  }));
  const RD_OTHER = [{
    id: 'other-1',
    name: 'Remy Fisher',
    img: 22,
    age: 3,
    room: 'koala',
    status: 'other'
  }, {
    id: 'other-2',
    name: 'Ivy Nakamura',
    img: 39,
    age: 2,
    allergy: true,
    room: 'koala',
    status: 'other'
  }, {
    id: 'other-4',
    name: 'Mabel Quinn',
    img: 17,
    age: 1,
    room: 'nursery',
    status: 'other'
  }, {
    id: 'other-5',
    name: 'Gus Abbott',
    img: 33,
    age: 2,
    room: 'possum',
    status: 'other'
  }, {
    id: 'other-6',
    name: 'Isla Brennan',
    img: 8,
    age: 4,
    room: 'kangaroo',
    status: 'other'
  }, {
    id: 'other-7',
    name: 'Tomasz Wrona',
    img: 44,
    age: 4,
    room: 'wombat',
    status: 'other'
  }, {
    id: 'other-3',
    name: 'Jasper Reid',
    img: 51,
    age: 3,
    room: 'koala',
    status: 'other',
    blocked: 'Already signed in to Kangaroo Room at 8:02 am'
  }];
  const RD_POOL = {
    nursery: ['Ari Cohen', 'Freya Nolan', 'Zane Petrov', 'Lila Osei', 'Rumi Sato', 'Otto Brandt', 'Sena Yildiz', 'Pia Ferrari', 'Kofi Mensah', 'Wren Halliday', 'Bodhi Nguyen', 'Esme Laurent', 'Noa Feldman'],
    possum: ['Tariq Aziz', 'Nova Kelly', 'Juno Park', 'Ruby Vance', 'Sami Haddad', 'Theo Novak', 'Uma Sharma', 'Vince Calder', 'Willa Kerr', 'Xavi Roca', 'Yara Demir', 'Zoe Ellis', 'Arlo Finch', 'Elsie Moreau', 'Dane Kirby', 'Priya Raman', 'Marcus Webb'],
    kangaroo: ['Milo Grant', 'Aisha Rahman', 'Felix Dorn', 'Greta Lind', 'Hugo Marsh', 'Indira Rao', 'Jonah Reid', 'Kaia Winters', 'Leo Castillo', 'Maya Okafor', 'Nils Berg', 'Orla Byrne', 'Saul Mendez', 'Tilly Grange', 'Ansel Roy', 'Bea Thornton', 'Caleb Ngata', 'Dara Whelan', 'Eli Farkas', 'Fleur Dubois'],
    wombat: ['Harper Vance', 'Jesse Okoro', 'Noor Rahimi', 'Cody Whelan', 'Sadie Lam', 'Toby Marsh', 'Marlow Chen', 'Ines Barros', 'Rafi Suleiman', 'Georgie Platt', 'Hunter Deakin', 'Talia Rossi', 'Ezra Lindqvist', 'Aoife Corrigan', 'Jun Watanabe', 'Priyanka Das', 'Solomon Abebe', 'Clementine Fox', 'Nate Dvorak', 'Rosie Mbeki', 'Kai Tuilagi', 'Lena Sokolov', 'Archie Pennington', 'Malik Bishara'],
    brushtail: (() => {
      const F = ['Amara', 'Bodie', 'Cleo', 'Dashiell', 'Eira', 'Fionn', 'Gaia', 'Hadley', 'Ilias', 'Juniper', 'Kaleo', 'Lumi', 'Mirren', 'Niamh', 'Oisin', 'Perrin', 'Quill', 'Romilly', 'Saoirse', 'Tobias'];
      const L = ['Abara', 'Beaumont', 'Cavanagh', 'Delacroix', 'Eriksen', 'Fontaine', 'Ghazali', 'Holloway', 'Ibarra', 'Janssen', 'Kowalczyk', 'Lindgren', 'Moreira', 'Nakamura', 'Oyelaran', 'Pankhurst', 'Quintero', 'Rasmussen', 'Sandoval', 'Tremblay'];
      return Array.from({
        length: 100
      }, (_, i) => `${F[i % 20]} ${L[(i % 20 + Math.floor(i / 20)) % 20]}`);
    })(),
    bilby: ['Sienna Volkov', 'Booker Ansah', 'Elodie Marchand', 'Rory Kavanagh', 'Nadia Petrova', 'Cass Whitfield', 'Idris Bakare', 'Polly Rourke', 'Teddy Lindgren', 'Anouk Devries', 'Kenji Mori', 'Frankie Laurel', 'Suri Kapoor', 'Max Brennan', 'Hattie Colbourne', 'Zeke Amara', 'Leni Falk', 'Omar Haddad']
  };
  const RD_ROOM_AGE = {
    nursery: () => 1,
    possum: () => 2,
    kangaroo: () => 4,
    wombat: i => 3 + i % 3,
    bilby: i => 5 + i * 3 % 8,
    brushtail: i => 3 + i % 3
  };
  const RD_SIGNED = {
    nursery: 9,
    possum: 13,
    kangaroo: 12,
    wombat: 18,
    bilby: 12,
    brushtail: 92
  };
  const RD_ROOM_SCENARIO = {
    nursery: {
      sleep: [['Sleeping', 11], ['Sleeping', 8], ['Sleeping', 4], ['Sleeping', 5], ['Sleeping', 3], ['Sleeping', 7], ['Resting', 2], ['Awake', null], ['Awake', null]],
      nappy: {
        7: 6,
        8: 4
      }
    },
    possum: {
      sleep: [['Sleeping', 11], ['Sleeping', 5], ['Sleeping', 5], ['Sleeping', 3], ['Sleeping', 6], ['Sleeping', 6], ['Resting', 6], ['Unsettled', 4], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null]],
      nappy: {
        9: 6
      }
    },
    kangaroo: {
      sleep: [['Awake', null], ['Resting', 8], ['Resting', 5], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null]]
    },
    wombat: {},
    bilby: {
      arriving: true
    },
    brushtail: {
      sleep: Array.from({
        length: RD_SIGNED.brushtail
      }, (_, i) => i % 3 === 0 ? ['Sleeping', i % 21 === 0 ? [12, 8, 11, 9, 7][i / 21] : 1 + i % 5] : i % 3 === 1 ? ['Resting', 2 + i % 4] : ['Awake', null]),
      nappy: Object.fromEntries(Array.from({
        length: 12
      }, (_, k) => {
        const i = k * 6 + 5;
        return [i, 2 + i * 3 % 8];
      }))
    }
  };
  const RD_ALLERGEN_TAGS = ['Egg allergy', 'Dairy allergy', 'Seasonal allergies', 'Gluten sensitivity', 'Sesame allergy'];
  const RD_ANAPHYLAXIS_TAGS = ['Peanut allergy', 'Tree nut allergy', 'Shellfish allergy'];
  const RD_OTHERS = Object.entries(RD_POOL).flatMap(([room, names]) => names.map((name, i) => {
    const signed = i < RD_SIGNED[room];
    const age = RD_ROOM_AGE[room](i);
    const flags = i % 5 === 0 ? {
      allergy: true
    } : i % 7 === 0 ? {
      medication: true,
      anaphylaxis: true
    } : {};
    const tags = flags.allergy ? [RD_ALLERGEN_TAGS[(i + room.length) % RD_ALLERGEN_TAGS.length]] : flags.anaphylaxis ? [RD_ANAPHYLAXIS_TAGS[(i + room.length) % RD_ANAPHYLAXIS_TAGS.length], ...(i % 2 ? ['Asthma'] : [])] : [];
    const base = {
      id: room + '-' + i,
      name,
      img: 10 + i * 7 % 60,
      room,
      age,
      ...flags,
      ...(tags.length ? {
        tags
      } : {})
    };
    if (signed) {
      const sc = RD_ROOM_SCENARIO[room] || {};
      const club = room === 'wombat' || room === 'bilby';
      const at = club ? '7:' + String(5 + i * 4 % 50).padStart(2, '0') : '7:' + String(10 + i * 3 % 45).padStart(2, '0');
      const last = club ? [rdMealEntry('12:10', 'lunch', [['chicken-rice', 1]]), ['sun', '9:15', 'Applied']] : [rdMealEntry('11:30', 'lunch', [['chicken-rice', 1]])];
      const seeded = (sc.sleep || [])[i];
      const state = seeded ? {
        state: seeded[0]
      } : {};
      if (seeded && seeded[1] != null) {
        const found = seeded[0] === 'Sleeping' ? 'Asleep' : seeded[0];
        last.unshift(['sleep', RD_AGO(seeded[1]), found]);
      }
      const nappyIn = (sc.nappy || {})[i];
      if (nappyIn != null) last.push(['nappy', RD_AGO(RD_NAPPY_INTERVAL - nappyIn), ['Dry', 'Wet', 'Soiled'][i % 3]]);
      return {
        ...base,
        status: 'here',
        at,
        ...state,
        last
      };
    }
    const notHere = (RD_ROOM_SCENARIO[room] || {}).arriving ? 'expected' : ['absent', 'gone', 'holiday', 'expected'][i % 4];
    if (notHere === 'gone') {
      return {
        ...base,
        status: 'gone',
        at: '12:' + String(10 + i * 7 % 40).padStart(2, '0'),
        by: ['Mum', 'Dad', 'Grandma'][i % 3]
      };
    }
    return {
      ...base,
      status: notHere,
      at: notHere === 'expected' ? '9:' + String(i * 5 % 60).padStart(2, '0') : '—'
    };
  }));
  const RD_KINDER_PROGRAMS = ['3-year-old kinder', '4-year-old kinder'];
  const rdKinderSeed = id => {
    let h = 0;
    const t = String(id);
    for (let i = 0; i < t.length; i++) h = h * 31 + t.charCodeAt(i) >>> 0;
    return h;
  };
  const RD_SCHOOLS = ['Fitzroy Primary', 'Carlton North Primary', 'St Brigid’s Primary', 'Collingwood College'];
  const RD_SCHOOL_ROOMS = ['wombat', 'bilby'];
  const rdGrade = age => age <= 5 ? 'Prep' : `Grade ${Math.min(age - 5, 6)}`;
  const rdWithKinder = c => {
    if (c.age == null || c.age < 3) return c;
    if (!c.kinder && (c.school || c.age >= 5 && RD_SCHOOL_ROOMS.includes(c.room))) {
      const n = parseInt(String(c.id).split('-').pop(), 10) || 0;
      const slot = c.room === 'bilby' ? c.status === 'expected' ? 0 : 1 + n % (RD_SCHOOLS.length - 1) : Math.floor(n / 3);
      return {
        ...c,
        school: c.school || RD_SCHOOLS[slot % RD_SCHOOLS.length],
        grade: c.grade || rdGrade(c.age)
      };
    }
    return {
      ...c,
      grade: c.grade || 'Preschool',
      kinder: c.kinder || RD_KINDER_PROGRAMS[Math.min(Math.max(c.age - 3, 0), RD_KINDER_PROGRAMS.length - 1)]
    };
  };
  const RD_CONSIDERATIONS = ['Grandparents do the Thursday pickup — they are on the authorised list, no need to call ahead.', 'Recently bereaved (grandparent, June). May need extra reassurance at drop-off.', 'Family speaks Cantonese at home. Mum is the confident English speaker of the two.', 'Older sibling in Kangaroo Room — they settle much faster if they see each other at drop-off.'];
  const RD_KOALA_CONSIDERATIONS = {
    5: 0,
    9: 1,
    16: 3,
    18: 2
  };
  const rdWithConsiderations = c => {
    if (c.considerations !== undefined) return c;
    const k = c.room === 'koala' ? RD_KOALA_CONSIDERATIONS[c.id] : (() => {
      const n = parseInt(String(c.id).split('-').pop(), 10);
      return Number.isFinite(n) && n % 6 === 2 ? (n + c.room.length) % RD_CONSIDERATIONS.length : undefined;
    })();
    return k === undefined ? c : {
      ...c,
      considerations: RD_CONSIDERATIONS[k]
    };
  };
  const rdSeedAuthor = (c, kind) => RD_EDUCATORS[(rdSeed(c.id) + rdSeed(kind)) % RD_EDUCATORS.length].name;
  const rdWithAuthors = c => !c.last || !c.last.length ? c : {
    ...c,
    last: c.last.map(e => {
      if (e[7]) return e;
      const t = [...e];
      for (let i = e.length; i < 7; i += 1) t[i] = null;
      t[7] = rdSeedAuthor(c, e[0]);
      return t;
    })
  };
  const RD_KOALA_SLEEP_FROM = {
    1: '11:40',
    2: '11:50',
    4: '11:45',
    8: '12:05',
    15: '12:20',
    16: '12:00',
    18: '12:25'
  };
  const rdWithSleepFrom = c => c.room === 'koala' && RD_KOALA_SLEEP_FROM[c.id] ? {
    ...c,
    sleepFrom: RD_KOALA_SLEEP_FROM[c.id]
  } : c;
  const rdWithAttendance = c => {
    if (c.att) return c;
    const s = rdSeed(c.id);
    const att = c.status === 'here' ? [{
      kind: 'in',
      at: c.at,
      by: rdSeedAuthor(c, 'in'),
      note: null
    }] : c.status === 'gone' ? [{
      kind: 'in',
      at: `${7 + s % 2}:${String(10 + s % 45).padStart(2, '0')}`,
      by: rdSeedAuthor(c, 'in'),
      note: null
    }, {
      kind: 'out',
      at: c.at,
      by: rdSeedAuthor(c, 'out'),
      note: null,
      to: c.by || null
    }] : c.status === 'absent' ? [{
      kind: 'absent',
      at: `8:${String(5 + s % 4 * 5).padStart(2, '0')}`,
      by: rdSeedAuthor(c, 'absent'),
      note: c.absentNote || null
    }] : [];
    const inAt = [...att].reverse().find(e => e.kind === 'in');
    return {
      ...c,
      att,
      ...(inAt ? {
        inAt: inAt.at
      } : null)
    };
  };
  const rdAttOf = c => !svcOn('attendance') ? [] : c.att || rdWithAttendance(c).att;
  const RD_REF = {
    y: 2026,
    m: 10,
    d: 3
  };
  const RD_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const RD_DIETARY_RE = /gluten|lactose|vegetarian|vegan|halal|kosher|no pork|dairy[- ]free/i;
  const rdIsDietaryTag = t => RD_DIETARY_RE.test(String(t));
  const rdDietPref = d => /vegetarian|vegan|halal|kosher|no pork/i.test(String(d));
  const RD_DISABILITY_NOTES = ['Uses a picture schedule for changes in the day. A quiet corner after lunch helps them settle.', 'Speech and language support. Give extra time to answer and keep sentences short.', 'Needs help to hold a cup and cut-up food at meals. Sit with them.'];
  const RD_KOALA_RECORD = {
    3: {
      dietary: ['Vegetarian']
    },
    5: {
      consents: {
        photoVideo: false
      }
    },
    8: {
      disabilityNote: RD_DISABILITY_NOTES[0]
    },
    9: {
      consents: null
    },
    14: {
      dietary: ['No pork']
    },
    17: {
      disabilityNote: RD_DISABILITY_NOTES[1]
    }
  };
  const rdMix = x => {
    let h = Math.imul(x ^ x >>> 16, 0x85ebca6b);
    h = Math.imul(h ^ h >>> 13, 0xc2b2ae35);
    return (h ^ h >>> 16) >>> 0;
  };
  const rdWithRecord = c => {
    const n = rdMix(rdKinderSeed(c.id));
    const hand = c.room === 'koala' && RD_KOALA_RECORD[c.id] || {};
    const out = {
      ...c
    };
    if (c.age != null && !c.dob) {
      const months = c.age * 12 + n % 12;
      out.dob = new Date(Date.UTC(RD_REF.y, RD_REF.m - months, RD_REF.d - (n >>> 3) % 28)).toISOString().slice(0, 10);
    }
    if (c.dietary === undefined) {
      const pool = ['Vegetarian', 'Halal', 'No pork', 'Lactose free'];
      out.dietary = hand.dietary || (c.room !== 'koala' && n % 8 === 3 ? [pool[(n >>> 4) % pool.length]] : []);
    }
    if (c.disability && c.disabilityNote === undefined) out.disabilityNote = hand.disabilityNote || RD_DISABILITY_NOTES[n % RD_DISABILITY_NOTES.length];
    if (c.school && c.age != null && !c.class) out.class = c.age <= 5 ? `Prep ${'ABC'[n % 3]}` : `${Math.min(c.age - 5, 6)}${'ABC'[n % 3]}`;
    if (c.consents === undefined) {
      out.consents = 'consents' in hand ? hand.consents : c.room !== 'koala' && n % 12 === 2 ? {
        photoVideo: false
      } : c.room !== 'koala' && n % 29 === 7 ? null : {
        photoVideo: true
      };
    }
    return out;
  };
  const RD_ALL_CHILDREN = [...RD_KOALA, ...RD_OTHERS].map(rdWithKinder).map(rdWithConsiderations).map(rdWithAuthors).map(rdWithSleepFrom).map(rdWithRecord).map(rdWithAttendance);
  RD_OTHER.forEach((c, i) => {
    RD_OTHER[i] = rdWithRecord(c);
  });
  RD_ROOMS.forEach(r => {
    r.booked = RD_ALL_CHILDREN.filter(c => c.room === r.key).length;
  });
  const RD_PHOTO = c => `img/p${c.img}.jpg`;
  const RD_SKIN = ['#F2CBA6', '#E7B48C', '#C98A5E', '#A5663C', '#7A472A', '#F7DCC0'];
  const RD_HAIR = ['#3A2A20', '#6B4A2F', '#1F1B1A', '#A9743F', '#D8B26A', '#8C3A2B'];
  const RD_SHIRT = ['#7BCAC5', '#F4A26B', '#9BB7E8', '#C2A5DE', '#8FC97F', '#EFA8B8'];
  const RD_TINT = ['#EAF5F4', '#FDF0E6', '#EDF1FB', '#F4EEFA', '#EDF6EA', '#FBEEF1'];
  function rdHairPath(v) {
    if (v === 0) return React.createElement("path", {
      d: "M10 19a10 10 0 0 1 20 0c0-7-3-10-10-10s-10 3-10 10Z"
    });
    if (v === 1) return React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M10 19a10 10 0 0 1 20 0c0-7-3-10-10-10s-10 3-10 10Z"
    }), React.createElement("circle", {
      cx: "9",
      cy: "21",
      r: "3.6"
    }), React.createElement("circle", {
      cx: "31",
      cy: "21",
      r: "3.6"
    }));
    if (v === 2) return React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "14",
      cy: "13",
      r: "5"
    }), React.createElement("circle", {
      cx: "20",
      cy: "10.5",
      r: "5.4"
    }), React.createElement("circle", {
      cx: "26",
      cy: "13",
      r: "5"
    }));
    if (v === 3) return React.createElement("path", {
      d: "M9 30V19a11 11 0 0 1 22 0v11c-1.6 0-2.6-1-2.6-2.6V19c0-4.6-2.8-6.4-8.4-6.4S11.6 14.4 11.6 19v8.4C11.6 29 10.6 30 9 30Z"
    });
    return React.createElement("path", {
      d: "M11 18c1.5-5 5-7.5 9-7.5s7.5 2.5 9 7.5c-2-1.5-4-3.5-5.5-6-1.5 3-6.5 5-12.5 6Z"
    });
  }
  const RD_KID_COUNT = 20;
  const RD_KID_PIN = {
    1: 6,
    2: 8,
    3: 4,
    4: 15,
    5: 13,
    6: 9,
    7: 5,
    8: 16,
    9: 10,
    10: 19,
    11: 14,
    12: 1,
    13: 7,
    'other-1': 11,
    'other-2': 12,
    'other-3': 20
  };
  const RD_KID_PHOTO = c => `img/kids/k${RD_KID_PIN[c.id] || rdSeed(c.id) % RD_KID_COUNT + 1}.jpg`;
  function RdKid({
    c,
    size = 40,
    ring
  }) {
    const [failed, setFailed] = useState(false);
    const seed = rdSeed(c.id);
    if (c.age != null && c.age >= 6) return React.createElement(RdAvatar, {
      name: c.name,
      size: size,
      ring: ring
    });
    if (!failed) {
      return React.createElement("img", {
        src: RD_KID_PHOTO(c),
        alt: "",
        onError: () => setFailed(true),
        style: {
          width: size,
          height: size,
          borderRadius: '50%',
          flexShrink: 0,
          objectFit: 'cover',
          display: 'block',
          background: 'var(--sd-colour-surface-grey)',
          ...(ring ? {
            boxShadow: `0 0 0 2px ${ring}`
          } : {})
        }
      });
    }
    return React.createElement(RdKidFace, {
      c: c,
      size: size,
      ring: ring,
      seed: seed
    });
  }
  function RdKidFace({
    c,
    size = 40,
    ring,
    seed
  }) {
    const skin = RD_SKIN[seed % RD_SKIN.length];
    const hair = RD_HAIR[(seed >> 1) % RD_HAIR.length];
    const shirt = RD_SHIRT[(seed >> 2) % RD_SHIRT.length];
    const tint = RD_TINT[(seed >> 2) % RD_TINT.length];
    const hairV = seed % 5;
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 40 40",
      role: "img",
      "aria-label": c.name,
      style: {
        display: 'block',
        flexShrink: 0,
        borderRadius: '50%',
        background: tint,
        ...(ring ? {
          boxShadow: `0 0 0 2px ${ring}`
        } : {})
      }
    }, React.createElement("clipPath", {
      id: `kc${c.id}`
    }, React.createElement("circle", {
      cx: "20",
      cy: "20",
      r: "20"
    })), React.createElement("g", {
      clipPath: `url(#kc${c.id})`
    }, React.createElement("rect", {
      x: "6",
      y: "31",
      width: "28",
      height: "14",
      rx: "7",
      fill: shirt
    }), React.createElement("circle", {
      cx: "20",
      cy: "21",
      r: "9.4",
      fill: skin
    }), React.createElement("g", {
      fill: hair
    }, rdHairPath(hairV)), React.createElement("circle", {
      cx: "16.8",
      cy: "21",
      r: "1.15",
      fill: "#2B2B2B"
    }), React.createElement("circle", {
      cx: "23.2",
      cy: "21",
      r: "1.15",
      fill: "#2B2B2B"
    }), React.createElement("path", {
      d: "M17.4 24.6a3.4 3.4 0 0 0 5.2 0",
      stroke: "#2B2B2B",
      strokeWidth: "1.1",
      strokeLinecap: "round",
      fill: "none"
    })));
  }
  const RD_MUMS = ['Sarah', 'Emma', 'Priya', 'Mei', 'Aisha', 'Hannah'];
  const RD_DADS = ['David', 'James', 'Omar', 'Wei', 'Tom', 'Raj'];
  const RD_GPS = ['Margaret', 'Joan', 'Rosa', 'Lily', 'Grace', 'Nan'];
  function rdSeed(id) {
    return String(id).split('').reduce((n, ch) => n + ch.charCodeAt(0), 0);
  }
  const RD_LOG_BACK_DAYS = 14;
  const RD_LOG_DAYS = Array.from({
    length: RD_LOG_BACK_DAYS + 1
  }, (_, i) => ({
    offset: i,
    day: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i} days ago`
  }));
  const RD_AUTH_TYPES = [{
    key: 'pickup',
    label: 'Collect from the service'
  }, {
    key: 'medical',
    label: 'Consent to medical treatment'
  }, {
    key: 'medication',
    label: 'Consent to administer medication'
  }, {
    key: 'transport',
    label: 'Consent to transport'
  }, {
    key: 'excursion',
    label: 'Consent to excursions'
  }];
  const RD_ABOUT_NOTES = ['Loves the sandpit and anything with wheels. Will not wear a hat without a fuss — offer the blue one.', 'Very settled once she has her comforter. Doesn’t like loud group singing; happier at the edge.', 'Big eater, but slow. Needs a bit longer at lunch rather than being rushed.', 'Napping is hit and miss — often just rests. Doesn’t need to be woken.', 'Chatty and confident with adults, more cautious with new children. Warms up by about morning tea.'];
  const rdCap = (v, n) => String(v == null ? '' : v).slice(0, n);
  const rdTelHref = n => {
    const raw = String(n == null ? '' : n).trim();
    if (raw.length > 32 || !/^[\d+\s().-]+$/.test(raw)) return null;
    const d = raw.replace(/[^\d+]/g, '');
    return /^\+?\d{3,15}$/.test(d) ? `tel:${d}` : null;
  };
  const RD_MAIL_BAD = '\\s@<>"\'`?&,;:()\\[\\]\\\\';
  const RD_MAIL_RE = new RegExp(`^[^${RD_MAIL_BAD}]+@[^${RD_MAIL_BAD}]+\\.[^${RD_MAIL_BAD}]+$`);
  const rdMailHref = e => {
    const m = String(e == null ? '' : e).trim();
    return m.length <= 254 && RD_MAIL_RE.test(m) ? `mailto:${m.split('@').map(encodeURIComponent).join('@')}` : null;
  };
  const rdEmailLocal = name => String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.');
  const rdDobMatch = dob => /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dob || ''));
  const rdAgeParts = dob => {
    const m = rdDobMatch(dob);
    if (!m) return null;
    const months = (RD_REF.y - +m[1]) * 12 + (RD_REF.m - (+m[2] - 1)) - (RD_REF.d < +m[3] ? 1 : 0);
    return months >= 0 ? {
      years: Math.floor(months / 12),
      months: months % 12
    } : null;
  };
  const rdAgeText = c => {
    const a = rdAgeParts(c.dob);
    if (!a) return c.age != null ? `${c.age} yrs` : 'Age not specified';
    return [a.years ? `${a.years} ${a.years === 1 ? 'yr' : 'yrs'}` : null, a.months || !a.years ? `${a.months} ${a.months === 1 ? 'mth' : 'mths'}` : null].filter(Boolean).join(' ');
  };
  const rdDobText = dob => {
    const m = rdDobMatch(dob);
    return m ? `${+m[3]} ${RD_MONTHS[+m[2] - 1]} ${m[1]}` : null;
  };
  const rdConsent = c => !!(c && c.consents && c.consents.photoVideo === true);
  const rdFloor30 = t => {
    const [h, m] = String(t).split(':').map(Number);
    return `${h}:${m >= 30 ? '30' : '00'}`;
  };
  function rdBooking(c, dayOffset = 0) {
    if (c.status === 'other') return null;
    const seed = rdSeed(c.id) + dayOffset * 11;
    const end = ['17:30', '16:30', '17:00', '16:00'][rdSeed(c.id) % 4];
    const arrives = dayOffset > 0 ? `${7 + seed % 2}:${String(10 + seed % 45).padStart(2, '0')}` : c.status === 'here' || c.status === 'expected' ? c.at : c.status === 'gone' ? c.inAt || '7:45' : null;
    const start = dayOffset === 0 && c.status === 'expected' && c.at ? c.at : arrives ? rdFloor30(arrives) : ['7:00', '8:00', '7:30', '9:00'][seed % 4];
    return {
      start,
      end
    };
  }
  const RD_CARERS = ['Alex', 'Jamie', 'Jordan', 'Casey', 'Taylor', 'Morgan'];
  const RD_KIN_FIRST = ['Kim', 'Pat', 'Lee', 'Robin', 'Dana', 'Jo', 'Rene', 'Ash', 'Cory', 'Lou', 'Kai', 'Nell'];
  const RD_KIN_LAST = ['Nguyen', 'Ellis', 'Marsh', 'Tate', 'Cole', 'Alvarez', 'Brandt', 'Quinn', 'Hayes', 'Okoye', 'Rossi', 'Lindgren'];
  const RD_KIN_REL = ['Family friend', 'Aunt', 'Uncle', 'Neighbour'];
  const RD_FICTION_MOBILES = ['0491 570 006', '0491 570 110', '0491 570 156', '0491 570 157', '0491 570 158', '0491 570 159', '0491 570 313', '0491 570 737', '0491 571 266', '0491 571 491', '0491 571 804', '0491 572 549', '0491 572 665', '0491 572 983', '0491 573 087', '0491 573 770', '0491 574 118', '0491 574 632', '0491 575 254', '0491 575 789', '0491 576 398', '0491 576 801', '0491 577 426', '0491 577 644', '0491 578 148', '0491 578 888', '0491 578 957', '0491 579 212', '0491 579 760'];
  const RD_HUB_PEOPLE = ['Jordan Reyes', 'Sasha Lindqvist', 'Min-jun Park', 'Tamsin Boyle'];
  function rdPeople(c) {
    const surname = rdLastName(c.name);
    const seed = rdSeed(c.id);
    const phone = i => i <= 3 ? RD_FICTION_MOBILES[(seed * 7 + i * 5) % RD_FICTION_MOBILES.length] : `(03) 5550 ${String(1000 + (seed * 37 + i * 211) % 9000)}`;
    const auths = (i, pickup) => RD_AUTH_TYPES.map((a, j) => ({
      ...a,
      on: pickup && a.key === 'pickup' || (seed + i * 5 + j * 3) % 7 !== 0
    }));
    const who = (name, rel, i, extra, pickup) => ({
      name,
      rel,
      phone: phone(i),
      email: `${rdEmailLocal(name)}@example.com`,
      auths: auths(i, pickup),
      ...(extra || {})
    });
    let guardians = [who(`${RD_MUMS[seed % RD_MUMS.length]} ${surname}`, 'Mother', 1, null, true), who(`${RD_DADS[(seed + 2) % RD_DADS.length]} ${surname}`, 'Father', 2, null, true)];
    if (seed % 7 === 3) guardians = guardians.slice(0, 1);else if (seed % 11 === 5) guardians.push(who(`${RD_CARERS[seed % RD_CARERS.length]} ${surname}`, 'Guardian', 3, null, true));
    guardians = guardians.map(g => c.collect && c.collect.who === g.rel ? {
      ...g,
      noCollect: true,
      auths: g.auths.map(a => a.key === 'pickup' ? {
        ...a,
        on: false
      } : a)
    } : g);
    const emergencies = [who(`${RD_GPS[seed % RD_GPS.length]} ${surname}`, 'Grandparent', 4)];
    if (seed % 2 === 0) {
      const h = rdMix(seed);
      emergencies.push(who(`${RD_KIN_FIRST[h % RD_KIN_FIRST.length]} ${RD_KIN_LAST[(h >>> 7) % RD_KIN_LAST.length]}`, RD_KIN_REL[(h >>> 13) % RD_KIN_REL.length], 5));
    }
    const hub = svcOn('visitors') && seed % 5 === 1 ? [who(RD_HUB_PEOPLE[seed % RD_HUB_PEOPLE.length], 'Visitor hub', 6, {
      via: 'hub',
      auths: RD_AUTH_TYPES.map(a => ({
        ...a,
        on: a.key === 'pickup'
      }))
    })] : [];
    return {
      surname,
      guardians,
      emergencies,
      emergency: emergencies[0],
      hub
    };
  }
  const rdHoldsPickup = p => (p.auths || []).some(a => a.key === 'pickup' && a.on);
  function rdCollectors(c) {
    const p = rdPeople(c);
    const tag = (list, source) => list.map(x => ({
      ...x,
      source
    }));
    return [...tag(p.guardians, 'guardian'), ...tag(p.emergencies, 'emergency'), ...tag(p.hub, 'hub')].filter(x => rdHoldsPickup(x) && !x.noCollect);
  }
  const rdCollectBarred = c => rdPeople(c).guardians.filter(g => g.noCollect);
  const rdCollectOthers = c => {
    const p = rdPeople(c);
    return [...p.guardians, ...p.emergencies].filter(x => !rdHoldsPickup(x) && !x.noCollect);
  };
  const rdCollectorLabel = x => `${rdCap(x.name, 80)} (${rdCap(x.rel, 40)})`;
  function rdProfile(c) {
    const {
      surname,
      guardians,
      emergencies,
      emergency,
      hub
    } = rdPeople(c);
    const seed = rdSeed(c.id);
    const special = c.considerations || null;
    const about = RD_ABOUT_NOTES[(seed + 2) % RD_ABOUT_NOTES.length];
    const attachments = [];
    if (c.collect && c.collect.courtOrder) {
      const [kind, on] = String(c.collect.onFile || '').split(/,\s*/);
      attachments.push({
        name: `Court order${kind ? ` · ${kind}` : ''}`,
        type: 'Held by the office',
        updated: on || '—'
      });
    }
    if (c.allergy || c.anaphylaxis) attachments.push({
      name: 'Allergy / anaphylaxis action plan',
      type: 'PDF',
      updated: '2 Jul 2026'
    });
    if (c.meds && c.meds.length || c.medication) attachments.push({
      name: c.meds && c.meds.length ? 'Medication authorisation' : 'Medication authorisation — none on file',
      type: c.meds && c.meds.length ? 'PDF' : 'Missing',
      updated: c.meds && c.meds.length ? '17 Aug 2026' : '—'
    });
    (c.meds || []).filter(m => /action plan/i.test(m.auth || '') && !/ASCIA|anaphylaxis/i.test(m.auth)).forEach(m => {
      if (!attachments.some(a => a.name === m.auth)) attachments.push({
        name: m.auth,
        type: 'PDF',
        updated: m.authOn ? `${m.authOn} 2026` : '—'
      });
    });
    attachments.push({
      name: 'Enrolment record',
      type: 'PDF',
      updated: '3 Feb 2026'
    });
    attachments.push({
      name: 'Immunisation history',
      type: 'PDF',
      updated: '3 Feb 2026'
    });
    const history = RD_LOG_DAYS.slice(1).map(d => {
      const k = seed + d.offset * 11;
      const absent = k % 9 === 0 ? 'Absent' : k % 13 === 0 ? 'On holiday' : null;
      const line = absent || `Signed in ${RD_AMPM(`${7 + k % 2}:${String(10 + k % 45).padStart(2, '0')}`)}, out ${RD_AMPM(`15:${String(20 + k % 39).padStart(2, '0')}`)} · ${rdTimeline(c, d.offset).length} ${rdTimeline(c, d.offset).length === 1 ? 'event' : 'events'}`;
      return {
        ...d,
        line,
        absent: !!absent
      };
    });
    return {
      surname,
      guardians,
      emergencies,
      emergency,
      hub,
      attachments,
      history,
      special,
      about
    };
  }
  const RD_COLOUR_ICON = {
    sleep: 'colour/sleepcheck',
    nappy: 'colour/nappies',
    meal: 'colour/knifr-fork',
    sun: 'colour/sunscreen',
    med: 'colour/pills',
    time: 'colour/time',
    note: 'colour/note',
    incident: 'colour/bandaid-red',
    learning: 'book-edit',
    asleep: 'colour/sleep',
    awake: 'colour/awake'
  };
  const RD_BADGE_ICON = {
    sleep: 'badge-sleep',
    med: 'badge-med',
    sun: 'badge-sun',
    nappy: 'badge-nappy'
  };
  const RD_STATE_PILL = {
    Unsettled: {
      label: 'Unsettled',
      cls: 'ds-pill--blue ds-pill--minimal',
      severity: true
    },
    Crying: {
      label: 'Crying',
      cls: 'ds-pill--blue ds-pill--minimal',
      severity: true
    },
    Sleeping: {
      label: 'Sleeping',
      cls: 'ds-pill--blue ds-pill--minimal'
    },
    Resting: {
      label: 'Resting',
      cls: 'ds-pill--blue ds-pill--minimal'
    },
    Awake: {
      label: 'Awake',
      cls: 'ds-pill--blue ds-pill--minimal'
    }
  };
  function RdStatePill({
    state,
    show
  }) {
    const cfg = RD_STATE_PILL[state];
    if (!cfg) return null;
    if (!cfg.severity && !show) return null;
    return React.createElement("span", {
      className: `ds-pill ds-pill--sm ${cfg.cls}`
    }, cfg.label);
  }
  const RD_EVENT_LABEL = {
    sleep: 'Sleep',
    nappy: 'Nappy / toileting',
    meal: 'Meal',
    sun: 'Sunscreen',
    med: 'Medication'
  };
  const RD_LOG_TITLE = {
    sleep: 'Sleep check',
    nappy: 'Nappy / toileting',
    meal: 'Meal',
    sun: 'Sunscreen',
    med: 'Medication',
    in: 'Signed in',
    out: 'Signed out',
    absent: 'Marked absent'
  };
  const rdLastSleepType = c => {
    const e = (c.last || []).find(([k]) => k === 'sleep');
    if (e && e[5]) return e[5];
    return {
      Sleeping: 'sleep',
      Resting: 'rest_start',
      Unsettled: 'unsettled',
      Crying: 'crying',
      Awake: 'wake_up'
    }[c.state] || null;
  };
  const rdSleepType = (last, found, roomTrack) => {
    if (found === 'Unsettled') return 'unsettled';
    if (found === 'Crying') return 'crying';
    const period = last === 'sleep' || last === 'check' ? 'Sleep' : last === 'rest_start' || last === 'rest_check' ? 'Rest' : null;
    if (found === 'Awake') return (period || roomTrack) === 'Rest' ? 'rest_end' : 'wake_up';
    if (found === 'Resting') return period === 'Rest' ? 'rest_check' : 'rest_start';
    return period === 'Rest' ? 'rest_check' : period === 'Sleep' ? 'check' : 'sleep';
  };
  const RD_FOUND_STATE = {
    Asleep: 'Sleeping',
    Resting: 'Resting',
    Awake: 'Awake',
    Unsettled: 'Unsettled',
    Crying: 'Crying'
  };
  const RD_PERIOD_OF = {
    sleep: 'Sleep',
    rest_start: 'Rest'
  };
  const RD_PERIOD_END = {
    wake_up: 'Sleep',
    rest_end: 'Rest'
  };
  const rdSleepFrom = (c, period) => {
    const open = (c.sleepOpen || {})[period];
    if (open) return open;
    if (c.state === (period === 'Rest' ? 'Resting' : 'Sleeping')) {
      const e = (c.last || []).find(([k]) => k === 'sleep');
      return c.sleepFrom || e && e[1] || null;
    }
    return null;
  };
  const rdSleepAdvance = (c, type, when) => {
    if (RD_PERIOD_OF[type]) return {
      sleepOpen: {
        ...(c.sleepOpen || {}),
        [RD_PERIOD_OF[type]]: when
      }
    };
    if (type === 'check' || type === 'rest_check') {
      const period = type === 'check' ? 'Sleep' : 'Rest';
      const from = rdSleepFrom(c, period);
      return from && !(c.sleepOpen || {})[period] ? {
        sleepOpen: {
          ...(c.sleepOpen || {}),
          [period]: from
        }
      } : {};
    }
    if (RD_PERIOD_END[type]) {
      const period = RD_PERIOD_END[type];
      const from = rdSleepFrom(c, period);
      const open = {
        ...(c.sleepOpen || {})
      };
      delete open[period];
      const ok = from != null && RD_MINS(when) >= RD_MINS(from);
      return {
        sleepOpen: open,
        sleepSpans: ok ? [...(c.sleepSpans || []), {
          period,
          from,
          to: when
        }] : c.sleepSpans || []
      };
    }
    return {};
  };
  const rdSleepTotals = c => {
    const spans = c.sleepSpans || [];
    if (!spans.length) return null;
    const t = {
      Sleep: 0,
      Rest: 0
    };
    spans.forEach(s => {
      t[s.period] += RD_MINS(s.to) - RD_MINS(s.from);
    });
    return t;
  };
  const rdSleepTotalText = c => {
    const t = rdSleepTotals(c);
    if (!t) return null;
    const parts = [];
    if (t.Sleep > 0) parts.push(`Slept ${rdDur(t.Sleep)}`);
    if (t.Rest > 0) parts.push(`${parts.length ? 'rested' : 'Rested'} ${rdDur(t.Rest)}`);
    return parts.length ? parts.join(' · ') : null;
  };
  const rdEntryObj = e => e ? {
    kind: e[0],
    at: e[1],
    detail: e[2] || null,
    note: e[3] || null,
    context: e[4] || null,
    type: e[5] || null,
    rec: e[6] || null,
    by: e[7] || null,
    med: e[8] || null
  } : null;
  const rdLastOf = (c, kind) => rdEntryObj((c.last || []).find(([k]) => k === kind));
  const RD_SLEEP_STATES = ['Sleeping', 'Resting', 'Unsettled', 'Crying'];
  const RD_WAKE_EVENTS = ['sun', 'meal', 'nappy'];
  const RD_JUST_LOGGED = 5;
  const rdCohortReason = (kind, c, cfg) => {
    if (!c || cfg && cfg.attendance) return null;
    if (kind !== 'sleep') {
      const last = (c.last || []).find(([k]) => k === kind);
      if (last) {
        const since = RD_MINS(RD_NOW) - RD_MINS(last[1]);
        if (since >= 0 && since < RD_JUST_LOGGED) {
          return since === 0 ? 'Just recorded' : `Recorded ${since} min ago`;
        }
      }
    }
    if (kind === 'sleep') {
      return RD_SLEEP_STATES.includes(c.state) ? null : 'Awake — adding records them as settled';
    }
    if (RD_WAKE_EVENTS.includes(kind) && (c.state === 'Sleeping' || c.state === 'Resting')) {
      return c.state === 'Resting' ? 'Resting' : 'Asleep';
    }
    return null;
  };
  const rdEventTitle = (kind, context) => kind === 'sleep' && context === 'Rest' ? 'Rest check' : kind === 'in' && context === 'again' ? 'Signed in again' : RD_LOG_TITLE[kind] || kind;
  const RD_AMPM = s => {
    if (s === null || s === undefined) return s;
    const str = String(s).trim();
    const m = str.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return str;
    const h = Number(m[1]);
    return `${h % 12 || 12}:${m[2]}\u00a0${h < 12 ? 'am' : 'pm'}`;
  };
  const rdAgo = (at, now = RD_NOW) => {
    if (!at || !/^\d{1,2}:\d{2}$/.test(String(at))) return null;
    const m = RD_MINS(now) - RD_MINS(at);
    if (!(m >= 0)) return null;
    if (m === 0) return 'Just now';
    return `${rdDur(m)} ago`;
  };
  const rdDur = mins => {
    const m = Math.max(0, Math.round(mins));
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60),
      r = m % 60;
    return r ? `${h} h ${r} min` : `${h} h`;
  };
  const RD_PAD = t => {
    const p = String(t).split(':');
    return `${String(p[0]).padStart(2, '0')}:${p[1] || '00'}`;
  };
  function rdFamily(c, dayOffset = 0) {
    const past = dayOffset > 0;
    const seed = rdSeed(c.id) + dayOffset * 11;
    const none = {
      shown: [],
      hidden: 0,
      hiddenRows: []
    };
    if (c.status === 'other' || seed % 3 !== 0) return none;
    if (past && (seed % 9 === 0 || seed % 13 === 0)) return none;
    const present = past || c.status === 'here' || c.status === 'gone';
    const inT = past ? `${7 + seed % 2}:${String(10 + seed % 45).padStart(2, '0')}` : c.status === 'gone' ? c.inAt || '7:45' : c.at;
    const outT = past ? `15:${String(20 + seed % 39).padStart(2, '0')}` : c.status === 'gone' ? c.at : RD_NOW;
    const from = present ? RD_MINS(inT) : null;
    const to = present ? RD_MINS(outT) : null;
    const by = rdPeople(c).guardians[0].name;
    const at = m => RD_HHMM(m);
    const evs = [{
      at: '6:10',
      kind: 'sleep',
      title: 'Sleep',
      detail: seed % 2 ? 'Slept well last night' : 'Slept badly last night'
    }, {
      at: '6:50',
      kind: 'meal',
      title: 'Meal',
      detail: 'Breakfast · ate most'
    }];
    if (present && seed % 2 === 0) evs.push({
      at: at(from + 20),
      kind: 'meal',
      title: 'Meal',
      detail: 'Breakfast in the car · ate half'
    });
    if (present && !past && c.status === 'gone' && to + 10 <= RD_MINS(RD_NOW)) evs.push({
      at: at(to + 10),
      kind: 'meal',
      title: 'Meal',
      detail: 'Lunch · ate most'
    });
    if (past) evs.push({
      at: '17:50',
      kind: 'meal',
      title: 'Meal',
      detail: 'Dinner · ate all'
    });
    const rows = evs.map(e => ({
      min: RD_MINS(e.at),
      kind: e.kind,
      title: e.title,
      detail: e.detail,
      by,
      origin: 'family'
    }));
    const inside = r => from != null && r.min >= from && r.min <= to;
    return {
      shown: rows.filter(r => !inside(r)),
      hidden: rows.filter(inside).length,
      hiddenRows: rows.filter(inside)
    };
  }
  function rdTimeline(c, dayOffset = 0) {
    const past = dayOffset > 0;
    const seed = rdSeed(c.id) + dayOffset * 11;
    const eds = RD_EDUCATORS;
    const by = i => eds[(seed + i) % eds.length].name;
    const pick = (arr, i) => arr[(seed + i) % arr.length];
    const barred = c.collect ? {
      Father: 'Dad',
      Mother: 'Mum'
    }[c.collect.who] || null : null;
    const carers = ['Mum', 'Dad', 'their grandparent'].filter(x => x !== barred);
    const rows = [];
    const add = (at, kind, detail, extra) => rows.push({
      min: RD_MINS(at),
      kind,
      detail,
      seq: rows.length,
      ...(extra || {})
    });
    if (past) {
      if (seed % 9 === 0 || seed % 13 === 0) return [];
      add(`${7 + seed % 2}:${String(10 + seed % 45).padStart(2, '0')}`, 'in', null, {
        by: rdSeedAuthor(c, `in${dayOffset}`)
      });
      add('9:35', 'meal', 'Morning tea · Fruit and yoghurt 1 serving', {
        by: by(2)
      });
      add('10:20', 'sun', 'Applied', {
        by: by(0)
      });
      add('11:15', 'nappy', pick(['Dry', 'Wet', 'Soiled'], 4), {
        by: by(1)
      });
      add('11:40', 'meal', `Lunch · ${pick(['Spaghetti bolognese 1 serving', 'Chicken and vegetable rice 1 serving', 'Shepherd’s pie 1 serving'], 5)}`, {
        by: by(2)
      });
      add('12:30', 'sleep', 'Down to rest · found asleep', {
        by: by(0)
      });
      add('13:05', 'sleep', 'Check · found asleep', {
        by: by(1)
      });
      const may = rdCollectors(c);
      add(`15:${String(20 + seed % 39).padStart(2, '0')}`, 'out', `Collected by ${may.length ? rdCollectorLabel(may[(seed + 2) % may.length]) : pick(carers, 2)}`, {
        by: rdSeedAuthor(c, `out${dayOffset}`)
      });
      rdFamily(c, dayOffset).shown.forEach(r => rows.push(r));
      (c.doses || []).filter(x => x.on === dayOffset).forEach(x => add(x.at, 'med', `${rdMedLine(x)} · late entry`, {
        by: (x.admin || {}).name || null,
        note: x.note || null,
        doseId: x.id
      }));
      return rows.map(r => ({
        ...r,
        at: RD_HHMM(r.min),
        title: r.title || rdEventTitle(r.kind, r.ctx)
      })).sort((a, b) => b.min - a.min || (b.seq || 0) - (a.seq || 0));
    }
    const present = c.status === 'here' || c.status === 'gone';
    let signIns = 0;
    rdAttOf(c).forEach(e => {
      if (e.kind === 'in') {
        add(e.at, 'in', null, {
          by: e.by || null,
          note: e.note || null,
          ctx: signIns ? 'again' : null
        });
        signIns += 1;
      } else if (e.kind === 'out') add(e.at, 'out', rdOutLine(e.to), {
        by: e.by || null,
        note: e.note || null
      });else add(e.at, 'absent', null, {
        by: e.by || null,
        note: e.note || null
      });
    });
    if (present) {
      add('8:40', 'nappy', pick(['Dry', 'Wet', 'Soiled'], 2), {
        by: by(1)
      });
      add('9:30', 'meal', 'Morning tea · Fruit and yoghurt 1 serving', {
        by: by(2)
      });
      add('10:15', 'sun', 'Applied', {
        by: by(0),
        note: seed % 3 === 0 ? 'Before outdoor play' : null
      });
      const routine = (c.meds || []).find(m => !/anaphylaxis|000|as needed/i.test(m.window || ''));
      if (routine && !(c.alert && /medication/i.test(c.alert.label))) add('11:10', 'med', `${routine.name} · ${routine.dose} · given`, {
        by: by(2),
        note: `Second-checked by ${by(1)}`
      });
      add('11:20', 'nappy', pick(['Dry', 'Wet', 'Soiled'], 4), {
        by: by(1)
      });
      add('11:30', 'meal', `Lunch · ${pick(['Spaghetti bolognese 1 serving', 'Chicken and vegetable rice 1 serving', 'Shepherd’s pie 1 serving'], 5)}`, {
        by: by(2),
        note: seed % 4 === 0 ? 'Second helping' : null
      });
      add(c.sleepFrom || '12:20', 'sleep', 'Down to rest · found asleep', {
        by: by(0)
      });
      add('12:50', 'sleep', 'Check · found asleep', {
        by: by(1)
      });
    }
    const firstArrival = rdAttOf(c).find(e => e.kind === 'in');
    if (firstArrival) {
      const m0 = RD_MINS(firstArrival.at);
      for (let i = rows.length - 1; i >= 0; i -= 1) {
        if (!['in', 'out', 'absent'].includes(rows[i].kind) && rows[i].min < m0) rows.splice(i, 1);
      }
    }
    if (c.status === 'gone') {
      const lastOut = [...rdAttOf(c)].reverse().find(e => e.kind === 'out');
      if (lastOut) {
        const m = RD_MINS(lastOut.at);
        for (let i = rows.length - 1; i >= 0; i -= 1) {
          if (!['in', 'out', 'absent'].includes(rows[i].kind) && rows[i].min > m) rows.splice(i, 1);
        }
      }
    }
    const pretty = (k, v) => {
      const raw = String(v);
      if (raw.includes('·')) return raw;
      if (RD_BULK[k] && RD_BULK[k].perChild && RD_BULK[k].perChild.multi) return raw;
      const lbl = RD_BULK[k] && RD_BULK[k].perChild && RD_BULK[k].perChild.label;
      const val = /^[A-Z][a-z]*(\s[a-z]+)*$/.test(raw) ? raw.toLowerCase() : raw;
      return lbl ? `${lbl} ${val}` : raw;
    };
    const withCtx = (k, detail, context) => {
      if (k === 'meal' && detail) return context ? `${context} · ${detail}` : detail;
      const v = detail ? pretty(k, detail) : null;
      return context ? v ? `${context} · ${v.charAt(0).toLowerCase() + v.slice(1)}` : context : v || 'Logged';
    };
    (c.last || []).forEach(([k, t, detail, note, context,, rec, author, dose]) => {
      const hits = rows.filter(r => r.kind === k && !r.live);
      const hit = hits.length ? hits.reduce((a, b) => b.min > a.min ? b : a) : null;
      if (hit) {
        hit.min = RD_MINS(t);
        hit.live = true;
        hit.by = author || hit.by;
        hit.rec = rec || null;
        if (dose) hit.doseId = dose.id;
        if (detail || context) {
          hit.detail = withCtx(k, detail, context);
          hit.value = detail || null;
          hit.ctx = context || null;
        }
        if (note !== undefined) hit.note = k === 'med' ? note || null : note || hit.note;
      } else {
        add(t, k, withCtx(k, detail, context), {
          by: author || null,
          live: true,
          value: detail || null,
          note: note || null,
          ctx: context || null,
          rec: rec || null,
          doseId: dose ? dose.id : null
        });
      }
    });
    (c.doses || []).filter(x => (x.on || 0) === 0 && !(c.last || []).some(e => e[0] === 'med' && e[8] && e[8].id === x.id)).forEach(x => add(x.at, 'med', rdMedLine(x), {
      by: (x.admin || {}).name || null,
      live: true,
      doseId: x.id,
      value: null,
      note: x.note || null
    }));
    const amended = new Set(c.corrected || []);
    rdFamily(c, 0).shown.forEach(r => rows.push(r));
    return rows.map(r => ({
      ...r,
      at: RD_HHMM(r.min),
      title: r.title || rdEventTitle(r.kind, r.ctx),
      amended: !!r.live && amended.has(r.kind)
    })).sort((a, b) => b.min - a.min || (b.seq || 0) - (a.seq || 0));
  }
  const RD_NAPPY_OPTS = [{
    key: 'dry',
    label: 'Dry',
    cat: 'nappy_change'
  }, {
    key: 'wet',
    label: 'Wet',
    cat: 'nappy_change'
  }, {
    key: 'soiled',
    label: 'Soiled',
    cat: 'nappy_change'
  }, {
    key: 'wet_soiled',
    label: 'Wet & soiled',
    cat: 'nappy_change'
  }, {
    key: 'soiled_clothes',
    label: 'Soiled clothes',
    cat: 'nappy_change'
  }, {
    key: 'cream',
    label: 'Nappy cream',
    cat: 'nappy_change',
    flag: 'nappyCream'
  }, {
    key: 'wee',
    label: 'Wee',
    cat: 'toilet'
  }, {
    key: 'poo',
    label: 'Poo',
    cat: 'toilet'
  }, {
    key: 'attempt',
    label: 'Toileting attempt',
    cat: 'toilet'
  }];
  const RD_REDNOSE_TEMPLATE = true;
  const RD_SLEEP_CHECKS_REDNOSE = [{
    key: 'position',
    label: 'Sleep position',
    options: [{
      key: 'back',
      label: 'Back',
      code: 'B',
      tone: 'ok'
    }, {
      key: 'left',
      label: 'Left side',
      code: 'L',
      tone: 'note',
      rollOk: true
    }, {
      key: 'right',
      label: 'Right side',
      code: 'R',
      tone: 'note',
      rollOk: true
    }, {
      key: 'tummy',
      label: 'Tummy',
      code: 'T',
      tone: 'note',
      rollOk: true
    }, {
      key: 'incline',
      label: 'Incline',
      code: 'I',
      tone: 'note'
    }]
  }, {
    key: 'breathing',
    label: 'Breathing',
    options: [{
      key: 'regular',
      label: 'Regular',
      code: 'R',
      tone: 'ok'
    }, {
      key: 'fast',
      label: 'Fast / difficult',
      code: 'F',
      tone: 'alert',
      prompt: 'call'
    }]
  }, {
    key: 'colour',
    label: 'Skin & lips',
    options: [{
      key: 'normal',
      label: 'Normal',
      code: 'N',
      tone: 'ok'
    }, {
      key: 'pale',
      label: 'Pale',
      code: 'P',
      tone: 'alert',
      prompt: 'call'
    }, {
      key: 'blue',
      label: 'Blue',
      code: 'B',
      tone: 'alert',
      prompt: 'call'
    }]
  }, {
    key: 'head',
    label: 'Head position',
    options: [{
      key: 'up',
      label: 'Face up',
      code: 'FU',
      tone: 'ok'
    }, {
      key: 'down',
      label: 'Face down',
      code: 'FD',
      tone: 'note'
    }, {
      key: 'right',
      label: 'Face right',
      code: 'FR',
      tone: 'note',
      rollOk: true
    }, {
      key: 'left',
      label: 'Face left',
      code: 'FL',
      tone: 'note',
      rollOk: true
    }, {
      key: 'chin',
      label: 'Chin on chest',
      code: 'CC',
      tone: 'note'
    }]
  }, {
    key: 'temp',
    label: 'Body temperature',
    options: [{
      key: 'warm',
      label: 'Warm',
      code: 'W',
      tone: 'ok'
    }, {
      key: 'cool',
      label: 'Cool',
      code: 'C',
      tone: 'note'
    }, {
      key: 'hot',
      label: 'Hot',
      code: 'H',
      tone: 'note'
    }]
  }, {
    key: 'airway',
    label: 'Airway',
    options: [{
      key: 'clear',
      label: 'Clear',
      code: 'C',
      tone: 'ok'
    }, {
      key: 'partial',
      label: 'Partially covered',
      code: 'PC',
      tone: 'alert',
      prompt: 'airway',
      asksWhere: true
    }, {
      key: 'full',
      label: 'Fully covered',
      code: 'FC',
      tone: 'alert',
      prompt: 'airway',
      asksWhere: true
    }],
    where: {
      label: 'Where',
      options: [{
        key: 'mouth',
        label: 'Mouth',
        code: 'M'
      }, {
        key: 'nose',
        label: 'Nose',
        code: 'N'
      }, {
        key: 'face',
        label: 'Face',
        code: 'F'
      }]
    }
  }];
  const RD_SLEEP_CHECKS_API = [{
    key: 'position',
    label: 'Sleep position',
    options: ['Back', 'Side', 'Tummy']
  }, {
    key: 'breathing',
    label: 'Breathing',
    options: ['Normal', 'Noisy', 'Laboured']
  }, {
    key: 'colour',
    label: 'Skin & lips',
    options: ['Normal', 'Pale', 'Flushed', 'Blue']
  }, {
    key: 'temp',
    label: 'Body temperature',
    options: ['Normal', 'Warm', 'Cool']
  }, {
    key: 'head',
    label: 'Head position',
    options: ['Clear', 'Turned', 'Against surface']
  }, {
    key: 'airway',
    label: 'Airway',
    options: ['Clear', 'Partially obstructed', 'Obstructed']
  }];
  const RD_SLEEP_CHECKS = RD_REDNOSE_TEMPLATE ? RD_SLEEP_CHECKS_REDNOSE : RD_SLEEP_CHECKS_API;
  const rdCheckOpt = (o, i) => typeof o === 'string' ? {
    key: o,
    label: o,
    code: null,
    tone: i === 0 ? 'ok' : 'alert'
  } : {
    code: null,
    tone: 'ok',
    ...o,
    label: o.label || o.key
  };
  const rdCheckOpts = k => k.options.map(rdCheckOpt);
  const rdCheckDefault = k => (rdCheckOpts(k).find(o => o.tone === 'ok') || rdCheckOpts(k)[0]).key;
  const RD_CHECKS_START_UNSET = true;
  const rdCheckStart = k => RD_CHECKS_START_UNSET ? null : rdCheckDefault(k);
  const rdChecksAnswered = checks => RD_SLEEP_CHECKS.filter(k => (checks || {})[k.key] != null).length;
  const rdChecksClean = checks => {
    if (!rdChecksAnswered(checks)) return null;
    const out = {};
    RD_SLEEP_CHECKS.forEach(k => {
      if (checks[k.key] != null) {
        out[k.key] = checks[k.key];
        if (k.where && checks[`${k.key}Where`]) out[`${k.key}Where`] = checks[`${k.key}Where`];
      }
    });
    return out;
  };
  const rdCheckTone = (k, v, setup) => {
    const o = rdCheckOpts(k).find(x => x.key === v);
    if (!o) return 'ok';
    return o.rollOk && setup && setup.rolling === 'yes' ? 'ok' : o.tone;
  };
  const rdCheckLabel = (k, v) => {
    const o = rdCheckOpts(k).find(x => x.key === v);
    return o ? o.label : v;
  };
  const rdCheckText = (k, checks) => {
    const w = k.where && (checks || {})[`${k.key}Where`];
    const wo = w && k.where.options.find(x => x.key === w);
    return rdCheckLabel(k, (checks || {})[k.key]) + (wo ? ` (${wo.label.toLowerCase()})` : '');
  };
  const rdCheckPatch = (checks, k, v) => {
    const next = {
      ...(checks || {}),
      [k.key]: v
    };
    const o = rdCheckOpts(k).find(x => x.key === v);
    if (k.where && !(o && o.asksWhere)) delete next[`${k.key}Where`];
    return next;
  };
  const rdFindings = (checks, setup) => {
    const all = RD_SLEEP_CHECKS.filter(k => (checks || {})[k.key] != null && checks[k.key] !== rdCheckDefault(k)).map(k => {
      const tone = rdCheckTone(k, checks[k.key], setup);
      const o = rdCheckOpts(k).find(x => x.key === checks[k.key]);
      return {
        key: k.key,
        tone,
        rolled: !!(o && o.rollOk && o.tone !== 'ok' && tone === 'ok'),
        text: `${k.label}:\u00a0${rdCheckText(k, checks)}`
      };
    });
    return ['alert', 'note', 'ok'].flatMap(t => all.filter(f => f.tone === t));
  };
  const rdRolledPart = found => found.some(f => f.rolled) ? {
    key: 'ro',
    text: 'Rolling, so not flagged'
  } : null;
  const rdCheckPrompt = (checks, setup) => {
    const on = RD_SLEEP_CHECKS.map(k => (checks || {})[k.key] != null && rdCheckTone(k, checks[k.key], setup) === 'alert' ? rdCheckOpts(k).find(o => o.key === checks[k.key]) : null).filter(Boolean);
    return on.some(o => o.prompt === 'call') ? 'call' : on.some(o => o.prompt === 'airway') ? 'airway' : null;
  };
  const RD_PUBLIC_NOTE = 'Families can see this note.';
  const RD_SLEEP_PROMPT = {
    call: 'Call 000 now and start your emergency and first-aid plan.',
    airway: 'Clear the airway now. Any change in skin and lip colour or breathing: call 000.'
  };
  const RD_SLEEP_SETUP = [{
    key: 'dummy',
    label: 'Dummy',
    kind: 'yn',
    yes: 'Dummy',
    no: 'No dummy'
  }, {
    key: 'comforter',
    label: 'Comforter',
    kind: 'yn',
    yes: 'Comforter',
    no: 'No comforter',
    help: 'Informed by the sleep and rest risk assessment'
  }, {
    key: 'rolling',
    label: 'Infant is rolling',
    kind: 'yn',
    yes: 'Rolling',
    no: 'Not rolling',
    help: 'Side, tummy and face-turn findings aren’t flagged for a rolling baby'
  }, {
    key: 'risk',
    label: 'Individual risk assessment completed',
    kind: 'yn',
    yes: 'Risk assessment done',
    no: 'No risk assessment'
  }, {
    key: 'bedding',
    label: 'Bedding',
    kind: 'text',
    quick: ['Sleeping bag', 'Sheet only']
  }];
  const RD_BEDDING_MAX = 60;
  const rdSetupWord = (f, v) => v == null || v === '' ? null : f.kind === 'text' ? String(v).trim() || null : v === 'yes' ? f.yes : f.no;
  const rdSetupText = s => RD_SLEEP_SETUP.map(f => rdSetupWord(f, (s || {})[f.key])).filter(Boolean).join(' · ');
  const rdSetupAnswered = s => RD_SLEEP_SETUP.some(f => rdSetupWord(f, (s || {})[f.key]));
  const rdSetupClean = s => Object.fromEntries(RD_SLEEP_SETUP.map(f => [f.key, rdSetupWord(f, (s || {})[f.key]) ? f.kind === 'text' ? String(s[f.key]).trim().slice(0, RD_BEDDING_MAX) : s[f.key] : null]).filter(([, v]) => v));
  const rdSetupChanged = (now, was) => RD_SLEEP_SETUP.filter(f => (rdSetupWord(f, (now || {})[f.key]) || '') !== (rdSetupWord(f, (was || {})[f.key]) || ''));
  const rdInitials = name => String(name || '').split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('');
  const rdRoomTemp = raw => {
    const t = String(raw || '').trim().replace(/\s*°?\s*c$/i, '').replace(',', '.');
    if (!/^\d{1,2}(\.\d)?$/.test(t)) return null;
    const n = parseFloat(t);
    return n >= 0 && n <= 50 ? n : null;
  };
  const RD_NAPPY_GROUPS = [{
    cat: 'nappy_change',
    label: 'Nappy'
  }, {
    cat: 'toilet',
    label: 'Toilet'
  }];
  const rdMultiLabel = (opts, keys) => (opts || []).filter(o => (keys || []).includes(o.key)).map(o => o.label).join(' · ') || null;
  const rdMultiCats = (opts, keys) => [...new Set((opts || []).filter(o => (keys || []).includes(o.key)).map(o => o.cat))];
  const RD_COLLECTED_BY = ['Parent / guardian', 'Authorised contact', 'School', 'Walked home'];
  const RD_COLLECT_PLACES = RD_COLLECTED_BY.slice(2);
  const RD_COLLECT_REQUIRED = true;
  const rdOutLine = to => !to ? null : to === 'School' ? 'Left with school' : to === 'Walked home' ? 'Walked home' : `Collected by ${to}`;
  const rdNotOnPickup = c => {
    if (!c) return null;
    const off = rdCollectOthers(c);
    if (!off.length) return null;
    const who = off.map(g => `${g.name.split(' ')[0]} (${g.rel})`);
    return `${who.join(' and ')} ${who.length === 1 ? 'is' : 'are'} not on the pick-up list.`;
  };
  const rdCollectOptions = (c, offline) => {
    const people = rdCollectors(c).filter(g => !(offline && g.source === 'hub')).map(g => [rdCollectorLabel(g), `${g.name.split(' ')[0]} · ${g.rel}`]);
    return [...(people.length ? people : RD_COLLECTED_BY.slice(0, 2)), ...RD_COLLECT_PLACES];
  };
  const rdCollectCommon = (children, offline) => {
    const lists = (children || []).map(c => rdCollectOptions(c, offline));
    if (!lists.length) return RD_COLLECT_PLACES;
    const val = o => Array.isArray(o) ? o[0] : o;
    return lists[0].filter(o => lists.every(l => l.some(x => val(x) === val(o))));
  };
  const RD_BULK = {
    sun: {
      label: 'Sunscreen',
      verb: 'Applied',
      record: 'Applied'
    },
    meal: {
      label: 'Meal',
      verb: 'Served',
      items: true
    },
    nappy: {
      label: 'Nappy / toileting',
      verb: 'Checked',
      perChild: {
        label: 'Type',
        multi: true,
        groups: RD_NAPPY_GROUPS,
        options: RD_NAPPY_OPTS,
        value: []
      }
    },
    sleep: {
      label: 'Sleep check',
      verb: 'Checked',
      perChild: {
        label: 'Found',
        options: ['Asleep', 'Resting', 'Awake', 'Unsettled', 'Crying'],
        value: 'Asleep'
      },
      advanced: RD_SLEEP_CHECKS,
      roomTemp: true,
      warning: 'Ensure airways are clear at all times and enact emergency procedures if an infant shows difficulty breathing or blue skin colour.',
      warningAdvanced: RD_REDNOSE_TEMPLATE ? 'Any change in skin or lip colour, breathing or ability to wake, or an unresponsive child: call 000 now (Australia). Keep airways clear.' : null
    },
    med: {
      label: 'Medication',
      verb: 'Recorded',
      singleOnly: true,
      perChild: {
        label: 'Outcome',
        options: ['Given', 'Part dose'],
        value: 'Given'
      }
    },
    note: {
      label: 'Quick note',
      verb: 'Saved',
      singleOnly: true
    },
    in: {
      label: 'Sign in',
      verb: 'Signed in',
      attendance: 'in',
      seedBySelection: true
    },
    out: {
      label: 'Sign out',
      verb: 'Signed out',
      attendance: 'out',
      shared: {
        label: 'Collected by',
        options: RD_COLLECT_PLACES,
        value: null,
        carry: true
      },
      perChild: {
        label: 'Collected by',
        options: RD_COLLECT_PLACES
      }
    },
    absent: {
      label: 'Mark absent',
      verb: 'Marked absent',
      attendance: 'absent'
    }
  };
  const RD_FACETS = [{
    key: 'att',
    label: 'Attendance',
    values: RD_GROUPS.map(g => ({
      key: g.key,
      label: g.label,
      test: c => c.status === g.key
    }))
  }, {
    key: 'sleep',
    label: 'Sleep / rest',
    values: RD_SLEEP_GROUPS.map(s => ({
      key: s.key,
      label: s.label,
      test: c => c.status === 'here' && s.test(c)
    }))
  }, {
    key: 'health',
    label: 'Health',
    values: RD_HEALTH_FLAGS.map(f => ({
      key: f.key,
      label: f.label,
      test: c => !!c[f.key]
    }))
  }, {
    key: 'office',
    label: 'From the office',
    values: [{
      key: 'considerations',
      label: 'Has special considerations',
      narrow: 'with special considerations',
      test: c => !!c.considerations
    }]
  }];
  const rdFacetTest = (facetKey, valueKey) => {
    const f = RD_FACETS.find(x => x.key === facetKey);
    const v = f && f.values.find(x => x.key === valueKey);
    return v ? v.test : () => false;
  };
  const rdFacetPass = (c, on) => RD_FACETS.every(f => {
    const keys = on[f.key];
    if (!keys || !keys.length) return true;
    return f.values.filter(v => keys.includes(v.key)).some(v => v.test(c));
  });
  const rdFacetChips = on => RD_FACETS.flatMap(f => (on[f.key] || []).map(k => ({
    facet: f,
    value: f.values.find(v => v.key === k)
  })).filter(x => x.value));
  const rdNarrowWords = on => RD_FACETS.filter(f => f.key !== 'att').flatMap(f => (on[f.key] || []).map(k => {
    const v = f.values.find(x => x.key === k) || {};
    return v.narrow || v.label;
  })).filter(Boolean).map(l => l.toLowerCase());
  const RD_SHOW_LEGACY = {
    here: {
      att: ['here']
    },
    awake: {
      att: ['here'],
      sleep: ['awake', 'unsettled']
    },
    sleeping: {
      att: ['here'],
      sleep: ['sleeping']
    }
  };
  const rdReadArm = sel => sel === 'check' ? 'check' : '';
  const RD_PAST_DAYS = 3;
  const RD_FUTURE_SPAN = 7;
  const RD_WDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const RD_MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const rdAddDays = (d, n) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  };
  const rdOpenDay = d => d.getDay() !== 0 && d.getDay() !== 6;
  const rdSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const rdShortDate = d => `${RD_WDAY[d.getDay()]} ${d.getDate()} ${RD_MONTH[d.getMonth()].slice(0, 3)}`;
  const RD_TODAY = rdAddDays(new Date(), 0);
  const RD_DATES = (() => {
    const day = (index, offset) => {
      const date = rdAddDays(RD_TODAY, offset);
      const label = offset === 0 ? 'Today' : offset === -1 ? 'Yesterday' : offset === 1 ? 'Tomorrow' : rdShortDate(date);
      return {
        index,
        offset,
        date,
        label
      };
    };
    const out = [day(0, 0)];
    for (let off = -1, n = 1; n <= RD_PAST_DAYS; off--) if (rdOpenDay(rdAddDays(RD_TODAY, off))) out.unshift(day(n++, off));
    for (let off = 1, n = -1; off <= RD_FUTURE_SPAN; off++) if (rdOpenDay(rdAddDays(RD_TODAY, off))) out.push(day(n--, off));
    return out;
  })();
  const rdDateAt = i => RD_DATES.find(x => x.index === i) || null;
  const RD_DATE_MAX = RD_DATES[0].index;
  const RD_DATE_MIN = RD_DATES[RD_DATES.length - 1].index;
  function rdFutureRoster(roster, day) {
    return roster.filter(c => {
      if (day.index === -1 && c.anaphylaxis) return true;
      if (day.index === -1 && c.status === 'holiday') return false;
      return (rdKinderSeed(c.id) + day.offset * 7) % 5 !== 0;
    }).map(c => {
      const h = rdKinderSeed(c.id);
      const usual = (c.status === 'here' || c.status === 'expected') && c.at && c.at !== '—';
      const {
        state,
        last,
        alert,
        by,
        inBy,
        outBy,
        inAt,
        held,
        absentNote,
        att,
        audit,
        corrected,
        pre,
        sleepOpen,
        sleepSpans,
        sleepFrom,
        ...child
      } = c;
      return {
        ...child,
        status: 'expected',
        at: usual ? c.at : `${7 + h % 2}:${String(h % 4 * 15).padStart(2, '0')}`
      };
    });
  }
  const rdNotifToday = n => (n.day || 0) === 0;
  const RD_NOTIFS = [{
    id: 'n1',
    scope: 'room',
    room: 'koala',
    kind: 'booking',
    target: {
      kind: 'child',
      name: 'Ava Martin'
    },
    title: 'New booking added',
    body: 'Ava Martin — arriving 8:30 am today',
    at: '8:12'
  }, {
    id: 'n2',
    scope: 'room',
    room: 'koala',
    kind: 'roster',
    target: {
      kind: 'child',
      name: 'Hannah Patel'
    },
    title: 'Roster updated by the office',
    body: 'Hannah Patel marked absent today',
    at: '7:50'
  }, {
    id: 'n4',
    scope: 'room',
    room: 'nursery',
    kind: 'note',
    derive: 'sleepDue',
    target: {
      kind: 'due'
    },
    at: '12:55'
  }, {
    id: 'n5',
    scope: 'room',
    room: 'nursery',
    kind: 'booking',
    target: {
      kind: 'child',
      name: 'Esme Laurent'
    },
    title: 'New booking added',
    body: 'Esme Laurent — arriving 9:55 am today',
    at: '8:20'
  }, {
    id: 'n6',
    scope: 'room',
    room: 'nursery',
    kind: 'roster',
    target: {
      kind: 'child',
      name: 'Noa Feldman'
    },
    title: 'Roster updated by the office',
    body: 'Noa Feldman marked absent today',
    at: '7:45'
  }, {
    id: 'n8',
    scope: 'service',
    kind: 'note',
    title: 'Staff meeting moved',
    body: 'Thursday now starts at 4:30 pm',
    at: '7:30'
  }, {
    id: 'n7',
    scope: 'room',
    room: 'koala',
    kind: 'booking',
    day: 1,
    title: 'New booking added',
    body: 'Remy Fisher — casual day on the next operating day',
    at: '9:10'
  }];
  const RD_NOTIF_ICON = {
    booking: 'calendar',
    roster: 'list',
    cover: 'user-multiple',
    note: 'book-edit',
    headcount: 'user-multiple'
  };
  const RD_NOTIF_CATEGORY = {
    booking: 'Booking',
    roster: 'Roster',
    cover: 'Cover',
    note: 'Notice',
    headcount: 'Head count'
  };
  const SCOPES = [{
    key: 'room',
    label: 'Room dashboard'
  }, {
    key: 'service',
    label: 'Service dashboard'
  }];
  const RD_LONG_MS = 450;
  function useLongPress(onLong) {
    const timer = React.useRef(null);
    const fired = React.useRef(false);
    const from = React.useRef([0, 0]);
    const clear = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
    const handlers = {
      onPointerDown: e => {
        fired.current = false;
        from.current = [e.clientX, e.clientY];
        clear();
        timer.current = setTimeout(() => {
          fired.current = true;
          clear();
          onLong();
        }, RD_LONG_MS);
      },
      onPointerMove: e => {
        const [x, y] = from.current;
        if (Math.abs(e.clientX - x) > 8 || Math.abs(e.clientY - y) > 8) clear();
      },
      onPointerUp: clear,
      onPointerCancel: clear,
      onPointerLeave: clear
    };
    return {
      fired,
      handlers
    };
  }
  function RdColourIcon({
    kind,
    size = 16
  }) {
    const name = RD_COLOUR_ICON[kind];
    return name ? React.createElement(SdIcon, {
      name: name,
      size: size
    }) : null;
  }
  function RdAvatar({
    src,
    name,
    size = 44,
    ring
  }) {
    const [failed, setFailed] = useState(false);
    const base = {
      width: size,
      height: size,
      borderRadius: '50%',
      flexShrink: 0,
      objectFit: 'cover',
      display: 'block',
      background: 'var(--sd-colour-surface-grey)',
      ...(ring ? {
        boxShadow: `0 0 0 2px ${ring}`
      } : {})
    };
    if (failed || !src) {
      return React.createElement("div", {
        style: {
          ...base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--sd-colour-surface-cyan)',
          color: 'var(--sd-colour-text-on-cyan)',
          fontWeight: 700,
          fontSize: size * 0.38
        }
      }, (name || '?')[0]);
    }
    return React.createElement("img", {
      src: src,
      alt: "",
      onError: () => setFailed(true),
      style: base
    });
  }
  const RD_ALLERGY_RE = /allerg(y|ies)/i;
  const RD_TONE = {
    crit: {
      pill: 'ds-pill--red',
      box: ' ds-message-box--red',
      mark: 'var(--sd-colour-feedback-error-default)',
      nav: 'critical'
    },
    warn: {
      pill: 'ds-pill--orange',
      box: ' ds-message-box--orange',
      mark: 'var(--sd-colour-feedback-warning-default)',
      nav: 'needs attention'
    },
    restrict: {
      pill: 'ds-pill--grey',
      box: '',
      mark: 'var(--sd-colour-text-primary)',
      nav: 'collection restricted'
    }
  };
  const rdTone = (fact, c) => {
    if (!fact) return null;
    if (fact.collect) return 'restrict';
    if (fact.alert) return rdIsLate(fact.alert) ? 'crit' : 'warn';
    if (fact.anaphylaxis) return 'crit';
    if (fact.tag) return c && c.anaphylaxis && RD_ALLERGY_RE.test(fact.tag) ? 'crit' : 'warn';
    return null;
  };
  const rdHealthPills = c => {
    const out = (c.tags || []).map(t => ({
      label: t,
      tone: rdTone({
        tag: t
      }, c)
    }));
    if (c.anaphylaxis && !out.some(p => p.tone === 'crit')) out.unshift({
      label: 'EpiPen / Anapen',
      tone: 'crit'
    });
    (c.dietary || []).forEach(d => {
      if (!out.some(p => p.label.toLowerCase() === String(d).toLowerCase())) out.push({
        label: d,
        tone: rdDietPref(d) ? 'restrict' : 'warn'
      });
    });
    return out;
  };
  function RdTag({
    children,
    tone = 'warn'
  }) {
    const t = RD_TONE[tone] || RD_TONE.warn;
    return React.createElement("span", {
      className: `ds-pill ds-pill--sm ${t.pill} ds-pill--minimal`,
      "data-tone": tone
    }, children, tone === 'crit' && !/epipen|anapen/i.test(String(children)) && React.createElement("span", {
      style: RD_SR_ONLY
    }, " (has an EpiPen or Anapen)"));
  }
  const RdHealthPills = ({
    c
  }) => rdHealthPills(c).map(p => React.createElement(RdTag, {
    key: p.label,
    tone: p.tone
  }, p.label));
  function RdChoiceChips({
    options,
    value,
    onChange,
    ariaLabel
  }) {
    return React.createElement("span", {
      role: "radiogroup",
      "aria-label": ariaLabel,
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        minWidth: 0
      }
    }, options.map(o => {
      const [k, l] = Array.isArray(o) ? o : [o, o];
      const on = value === k;
      return React.createElement("button", {
        key: k,
        type: "button",
        role: "radio",
        "aria-checked": on,
        onClick: () => onChange(k),
        className: `ds-selection-pill${on ? ' ds-selection-pill--selected' : ''}`
      }, React.createElement("span", {
        className: "ds-selection-pill__label"
      }, l));
    }));
  }
  function RdNotAppliedToggle({
    on,
    onToggle,
    name
  }) {
    return React.createElement("button", {
      type: "button",
      "aria-pressed": on,
      "aria-label": `Sunscreen not applied for ${name}`,
      onClick: onToggle,
      className: `ds-selection-pill${on ? ' ds-selection-pill--selected' : ''}`,
      style: {
        flexShrink: 0
      }
    }, React.createElement("span", {
      className: "ds-selection-pill__label"
    }, "Not applied"));
  }
  const rdCollectLabel = k => k.courtOrder ? 'Court order' : 'Pickup restricted';
  function RdCollectPill({
    collect,
    full
  }) {
    if (!collect) return null;
    const label = full ? `${rdCollectLabel(collect)} · ${collect.who} can’t collect` : rdCollectLabel(collect);
    return React.createElement("span", {
      className: `ds-pill ds-pill--sm ${RD_TONE.restrict.pill} ds-pill--minimal`,
      "data-tone": rdTone({
        collect
      }),
      title: `${collect.who} is not permitted to collect`
    }, label);
  }
  function RdConsentPill({
    c
  }) {
    if (!c || rdConsent(c)) return null;
    return React.createElement("span", {
      className: `ds-pill ds-pill--sm ${RD_TONE.restrict.pill} ds-pill--minimal`,
      "data-tone": "restrict",
      "data-consent": "none",
      title: "No photo or video consent on record"
    }, "No photos or video", React.createElement("span", {
      style: RD_SR_ONLY
    }, " (no consent on record)"));
  }
  function RdRoomChip({
    name,
    tone
  }) {
    return React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        background: 'var(--sd-colour-surface-cyan)',
        color: tone || 'var(--sd-colour-text-on-cyan)'
      }
    }, name);
  }
  const rdIsLate = a => !!a && (a.kind === 'urgent' || !!a.overdue);
  function RdAlert({
    alert
  }) {
    const urgent = rdIsLate(alert);
    return React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11.5,
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        background: 'var(--sd-colour-surface-default)',
        border: `1px solid ${urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-feedback-warning-default)'}`,
        color: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)'
      }
    }, React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        flexShrink: 0,
        background: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)'
      }
    }), alert.label);
  }
  const RD_SR_ONLY = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0
  };
  function RdRowDue({
    alert,
    full,
    glyph: showGlyph = true,
    text
  }) {
    const hit = alert && typeof alert.dueIn === 'number' && RD_ALERT_EVENT.find(([, re]) => re.test(alert.label));
    if (!hit) return React.createElement(RdAlert, {
      alert: alert
    });
    const late = alert.dueIn < 0;
    const tone = rdTone({
      alert
    });
    const red = tone === 'crit';
    const paint = {
      background: red ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-surface-orange)',
      color: red ? 'var(--sd-colour-action-foreground)' : 'var(--sd-colour-text-primary)'
    };
    const glyph = React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        flexShrink: 0,
        color: red ? 'inherit' : 'var(--sd-colour-text-on-orange)'
      }
    }, React.createElement(SdIcon, {
      name: RD_BADGE_ICON[hit[0]],
      size: 14
    }));
    if (full) {
      const parts = [...(late ? ['Late'] : []), ...alert.label.split(' · ')];
      return React.createElement("span", {
        "data-tone": tone,
        "data-due": "full",
        style: {
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: 5,
          maxWidth: '100%',
          padding: '4px 10px 4px 8px',
          boxSizing: 'border-box',
          borderRadius: 'var(--sd-radius-lg)',
          fontSize: 12.5,
          fontWeight: 700,
          lineHeight: '18px',
          ...paint
        }
      }, React.createElement("span", {
        style: {
          display: 'inline-flex',
          marginTop: 2
        }
      }, glyph), React.createElement("span", null, parts.map((p, i) => React.createElement(React.Fragment, {
        key: i
      }, React.createElement("span", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, p, i < parts.length - 1 ? ' ·' : ''), i < parts.length - 1 ? ' ' : ''))));
    }
    return React.createElement("span", {
      "data-tone": tone,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 22,
        padding: showGlyph ? '0 8px 0 6px' : '0 8px',
        boxSizing: 'border-box',
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        fontSize: 12,
        fontWeight: 700,
        ...paint
      }
    }, showGlyph && glyph, React.createElement("span", {
      "aria-hidden": "true"
    }, text || (late ? 'Late' : alert.dueIn === 0 ? 'Now' : `${alert.dueIn}m`)), React.createElement("span", {
      style: RD_SR_ONLY
    }, alert.label));
  }
  function RdStat({
    value,
    label,
    tone
  }) {
    return React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6,
        minWidth: 0,
        whiteSpace: 'nowrap'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        lineHeight: 1.1,
        color: tone || '#fff'
      }
    }, value), React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: D_SUBTLE
      }
    }, label));
  }
  function RdHit({
    n
  }) {
    return React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: -n
      }
    });
  }
  function RdActingAs({
    educator,
    onOpen
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      className: "fp-btn",
      "aria-label": `Recording as ${educator.name}. Change who is recording`,
      title: `Recording as ${educator.name}`,
      style: {
        all: 'unset',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'inline-flex',
        position: 'relative',
        borderRadius: 'var(--sd-radius-full)'
      }
    }, React.createElement(RdHit, {
      n: 4
    }), React.createElement(RdAvatar, {
      src: educator.img,
      name: educator.name,
      size: 36,
      ring: "rgba(255,255,255,0.5)"
    }));
  }
  function RdNotifBell({
    count,
    onOpen
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      "aria-label": `Notifications${count ? `, ${count} unread` : ''}`,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'relative',
        width: 38,
        height: 38,
        borderRadius: 'var(--sd-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: D_FILL,
        border: `1px solid ${D_BORDER}`,
        color: '#fff'
      }
    }, React.createElement(SdIcon, {
      name: "notification-bell",
      size: 20
    }), count > 0 && React.createElement("span", {
      style: {
        position: 'absolute',
        top: -3,
        right: -3,
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 'var(--sd-radius-full)',
        background: 'var(--sd-colour-feedback-error-default)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, count));
  }
  function RdSettingsCog({
    onOpen
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      "aria-label": "Room settings",
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: 38,
        height: 38,
        borderRadius: 'var(--sd-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: D_FILL,
        border: `1px solid ${D_BORDER}`,
        color: '#fff'
      }
    }, React.createElement(SdIcon, {
      name: "settings-cog",
      size: 19
    }));
  }
  function RdDateNav({
    date,
    compact
  }) {
    const today = date.index === 0;
    const stepBtn = (glyph, onClick, enabled, label) => React.createElement("button", {
      type: "button",
      "aria-label": label,
      disabled: !enabled,
      onClick: enabled ? onClick : undefined,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: enabled ? 'pointer' : 'default',
        width: 30,
        height: 30,
        borderRadius: 'var(--sd-radius-m)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: D_FILL,
        color: '#fff',
        opacity: enabled ? 1 : 0.4
      }
    }, React.createElement(SdIcon, {
      name: glyph,
      size: 16
    }));
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0
      }
    }, stepBtn('chevron-left', date.older, date.canOlder, 'Previous day'), React.createElement("button", {
      type: "button",
      onClick: date.openCalendar,
      "aria-label": `Pick a date — currently ${date.label}`,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        borderRadius: 'var(--sd-radius-full)',
        background: today ? D_FILL : 'rgba(255,255,255,0.2)',
        border: `1px solid ${D_BORDER}`,
        color: '#fff',
        fontSize: 12.5,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, !compact && React.createElement(SdIcon, {
      name: "calendar",
      size: 15
    }), date.label, !today && !compact && React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--sd-colour-cyan-100)'
      }
    }, "\xB7 read-only")), stepBtn('chevron-right', date.newer, date.canNewer, 'Next day'), !today && !compact && React.createElement("button", {
      type: "button",
      onClick: date.toToday,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--sd-radius-full)',
        background: '#fff',
        color: 'var(--sd-colour-action-primary)',
        fontSize: 12.5,
        fontWeight: 700,
        flexShrink: 0
      }
    }, "Back to today"));
  }
  const RD_CAL_DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  function RdCalendarPopover({
    value,
    onPick,
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const shown = (rdDateAt(value) || rdDateAt(0)).date;
    const [month, setMonth] = useState(new Date(shown.getFullYear(), shown.getMonth(), 1));
    const y = month.getFullYear(),
      m = month.getMonth();
    const lead = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [...Array(lead).fill(null), ...Array.from({
      length: days
    }, (_, i) => new Date(y, m, i + 1))];
    const monthHas = dm => RD_DATES.some(x => x.date.getFullYear() === dm.getFullYear() && x.date.getMonth() === dm.getMonth());
    const monthBtn = (glyph, target, label) => monthHas(target) ? React.createElement("button", {
      type: "button",
      "aria-label": label,
      onClick: () => setMonth(target),
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex',
        padding: 2
      }
    }, React.createElement(SdIcon, {
      name: glyph,
      size: 18
    })) : null;
    return React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 96
      }
    }, React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-label": "Pick a date",
      onClick: e => e.stopPropagation(),
      style: {
        width: 300,
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, monthBtn('chevron-left', new Date(y, m - 1, 1), 'Previous month'), React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        flex: 1
      }
    }, RD_MONTH[m], " ", y), monthBtn('chevron-right', new Date(y, m + 1, 1), 'Next month'), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 18
    }))), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2
      }
    }, RD_CAL_DOW.map((d, i) => React.createElement("span", {
      key: 'h' + i,
      style: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        padding: '2px 0'
      }
    }, d)), cells.map((dt, i) => {
      if (!dt) return React.createElement("span", {
        key: i
      });
      const day = RD_DATES.find(x => rdSameDay(x.date, dt));
      const isToday = rdSameDay(dt, RD_TODAY);
      const on = !!day && day.index === value;
      const tail = !day ? rdOpenDay(dt) ? ' — not available' : ' — closed' : isToday ? ' — today' : ' — read-only';
      return React.createElement("button", {
        key: i,
        type: "button",
        disabled: !day,
        "aria-pressed": on,
        "aria-label": `${rdShortDate(dt)}${tail}`,
        onClick: day ? () => {
          onPick(day.index);
          onClose();
        } : undefined,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: day ? 'pointer' : 'default',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: isToday || on ? 700 : 500,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--sd-radius-m)',
          background: isToday ? 'var(--sd-colour-action-primary)' : on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          border: `1.5px solid ${on && !isToday ? 'var(--sd-colour-action-primary)' : 'transparent'}`,
          color: isToday ? 'var(--sd-colour-action-foreground)' : day ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)',
          opacity: day ? 1 : 0.4
        }
      }, dt.getDate());
    })), React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.4,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Other days are read-only.")));
  }
  function RdEducatorSheet({
    educators,
    current,
    serviceName,
    onPick,
    onLogout,
    onClose,
    confirm = null,
    freeHandoff = false,
    reason = 'enter your PIN to take over recording'
  }) {
    const [pending, setPending] = useState(confirm);
    const [pin, setPin] = useState('');
    const [wrong, setWrong] = useState(false);
    const gate = window.PgSignin;
    const lockedNow = !!(gate && pending && gate.pinLocked(pending));
    const triesLeft = gate && pending ? gate.pinLeft(pending) : 0;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          if (pending && !confirm) {
            setPending(null);
            setPin('');
            setWrong(false);
          } else onClose();
        }
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose, pending]);
    const push = d => {
      if (pin.length >= 4 || lockedNow) return;
      const next = pin + d;
      setWrong(false);
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          const r = gate ? gate.pinCheck(pending, next) : 'ok';
          if (r === 'ok') {
            onPick(pending);
          } else {
            setWrong(true);
            setPin('');
          }
        }, 160);
      }
    };
    const back = () => {
      if (confirm) {
        onClose();
        return;
      }
      setPending(null);
      setPin('');
      setWrong(false);
    };
    const key = (label, onClick, ariaLabel) => React.createElement("button", {
      key: label,
      type: "button",
      onClick: onClick,
      "aria-label": ariaLabel || String(label),
      className: "v-key",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        height: 56,
        borderRadius: 'var(--sd-radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-grey)',
        color: 'var(--sd-colour-text-primary)',
        fontSize: 22,
        fontWeight: 600
      }
    }, label);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }
    }, pending && React.createElement("button", {
      type: "button",
      "aria-label": "Back to the list",
      onClick: back,
      className: "fp-btn",
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "chevron-left",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, pending ? 'Confirm it’s you' : 'Who’s recording?'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, pending ? `${pending.name} · ${reason}` : 'Records are attributed to whoever is selected here')), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), pending ? React.createElement("div", {
      className: wrong ? 'v-shake' : undefined,
      style: {
        padding: '20px 22px 22px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }
    }, React.createElement(RdAvatar, {
      src: pending.img,
      name: pending.name,
      size: 56
    }), React.createElement("span", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, [0, 1, 2, 3].map(i => React.createElement("span", {
      key: i,
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: i < pin.length ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-grey)',
        border: `1px solid ${i < pin.length ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`
      }
    }))), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        minHeight: 18,
        color: wrong || lockedNow ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
      }
    }, lockedNow ? 'PIN locked. Switch educator from the menu to sign in another way.' : wrong ? `Incorrect PIN — ${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left` : 'Every record you make will be signed with this name.'), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        width: '100%',
        maxWidth: 300,
        ...(lockedNow ? {
          opacity: 0.4,
          pointerEvents: 'none'
        } : {})
      }
    }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => key(n, () => push(String(n)))), React.createElement("span", null), key(0, () => push('0')), React.createElement("button", {
      type: "button",
      onClick: () => {
        setWrong(false);
        setPin(v => v.slice(0, -1));
      },
      "aria-label": "Delete",
      className: "v-key",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        height: 56,
        borderRadius: 'var(--sd-radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "backspace",
      size: 22
    })))) : React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '12px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, educators.map(e => {
      const on = e.name === current.name;
      const noPin = !!gate && gate.methodsOf(e).indexOf('pin') < 0;
      const locked = !!gate && !noPin && gate.pinLocked(e);
      const off = !on && (noPin || locked);
      return React.createElement("button", {
        key: e.name,
        type: "button",
        "aria-disabled": off && !freeHandoff ? 'true' : undefined,
        onClick: () => on ? onClose() : freeHandoff ? onPick(e) : off ? undefined : setPending(e),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '11px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: `1px solid ${on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
          background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
          ...(off ? {
            opacity: 0.55,
            cursor: 'default'
          } : {})
        }
      }, React.createElement(RdAvatar, {
        src: e.img,
        name: e.name,
        size: 38
      }), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700
        }
      }, e.name), !on && !freeHandoff && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 500,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, noPin ? 'No PIN set up' : locked ? 'PIN locked' : 'PIN required')), on ? React.createElement("span", {
        style: {
          color: 'var(--sd-colour-action-primary)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "tick",
        size: 18
      })) : noPin ? null : React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-secondary)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "lock",
        size: 16
      })));
    })), React.createElement("div", {
      style: {
        padding: '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdAction, {
      glyph: "signout",
      full: true,
      muted: !onLogout,
      onClick: onLogout
    }, "Log out", serviceName ? ` of ${serviceName}` : ''), React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        textAlign: 'center',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Switching keeps ", serviceName || 'the service', " signed in on this tablet. Logging out doesn\u2019t.")))));
  }
  function RdNotificationsSheet({
    notifs,
    phone,
    hideRead,
    onHideRead,
    onOpen,
    onMarkAll,
    onClose
  }) {
    const full = rdPhoneFull(phone);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const unread = notifs.filter(n => n.unread).length;
    const shown = hideRead ? notifs.filter(n => n.unread) : notifs;
    const roomName = n => (RD_ROOMS.find(r => r.key === n.room) || {}).name;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Notifications",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "notification-bell",
      size: 22
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Notifications"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, unread ? `${unread} unread · today` : 'Today’s notices')), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        padding: '10px 22px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        minHeight: 44
      }
    }, React.createElement(RdToggle, {
      on: hideRead,
      onChange: onHideRead,
      label: "Hide read notices"
    }), React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        flex: 1
      }
    }, "Hide read"), unread > 0 && React.createElement(RdTextAction, {
      onClick: onMarkAll
    }, "Mark all read")), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '8px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, shown.length ? shown.map(n => React.createElement("button", {
      key: n.id,
      type: "button",
      onClick: () => onOpen(n),
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 11,
        padding: '11px 12px',
        minHeight: 44,
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        background: n.unread ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-action-primary)',
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: RD_NOTIF_ICON[n.kind] || 'notification-bell',
      size: 18
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: n.unread ? 700 : 600
      }
    }, n.title), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, n.body), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, RD_NOTIF_CATEGORY[n.kind] || 'Notice', " \xB7 ", n.scope === 'service' ? 'Whole centre' : roomName(n) || 'Room')), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 4,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, RD_AMPM(n.at)), n.unread && React.createElement("span", {
      "aria-label": "Unread",
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--sd-colour-action-primary)'
      }
    }), n.target && React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: 'var(--sd-colour-text-secondary)',
        display: 'flex'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    }))))) : React.createElement("div", {
      style: {
        padding: '34px 8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, notifs.length ? 'All caught up' : 'Nothing new'), React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, notifs.length ? 'Read notices are hidden.' : 'Bookings and roster changes for this room will show here.')))));
  }
  function RdRoomSettingsSheet({
    room,
    careKey,
    rowDetail,
    roomEvents,
    phone,
    onClose,
    onSave
  }) {
    const [care, setCare] = useState(careKey);
    const [detail, setDetail] = useState(rowDetail || RD_ROW_DETAIL_DEFAULT);
    const [events, setEvents] = useState(roomEvents || rdEventsDefault(careKey, room && room.sleepTrack));
    const pickCare = k => {
      setCare(k);
      setEvents(m => rdEventsDefault(k, m.sleepTrack));
    };
    const cfg = RD_CARE[care];
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const base = rowDetail || RD_ROW_DETAIL_DEFAULT;
    const baseEvents = roomEvents || rdEventsDefault(careKey, room && room.sleepTrack);
    const changed = care !== careKey || RD_ROW_DETAIL.some(r => !!detail[r.key] !== !!base[r.key]) || RD_EVENT_TYPES.some(e => !!events[e.key] !== !!baseEvents[e.key]) || events.sleepTrack !== baseEvents.sleepTrack;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 560,
        maxHeight: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Room settings"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, room.name, " \xB7 ", room.ages)), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-grey)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement("b", null, "Placeholder \u2014 not final."), " Care settings are a fast-follow, and whether they live in PG or in the Office system is still an open product question (OQ13). Here to test the idea, not a committed feature.")), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Care type"), React.createElement(RdSegmented, {
      options: Object.keys(RD_CARE).map(k => [k, RD_CARE[k].label]),
      value: care,
      onChange: pickCare,
      ariaLabel: "Care type"
    }), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Sets which events this room does by default and how often head counts are prompted. Switch individual events on or off below.")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Events this room does"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)',
        marginTop: -2
      }
    }, "Switched off disappears from the quick-log, what\u2019s due, and each child\u2019s event sheet, except a dose that is due: that always shows."), RD_EVENT_TYPES.map(e => React.createElement("div", {
      key: e.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '2px 0'
      }
    }, React.createElement(RdColourIcon, {
      kind: e.key,
      size: 17
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, e.label), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, e.hint)), React.createElement(RdToggle, {
      on: !!events[e.key],
      label: `${e.label} in this room`,
      onChange: v => setEvents(m => ({
        ...m,
        [e.key]: v
      }))
    })))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "What each row shows"), RD_ROW_DETAIL.map(r => React.createElement("div", {
      key: r.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '2px 0'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600
      }
    }, r.label), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, r.hint)), React.createElement(RdToggle, {
      on: !!detail[r.key],
      label: `Show ${r.label.toLowerCase()} on each row`,
      onChange: v => setDetail(d => ({
        ...d,
        [r.key]: v
      }))
    })))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Cadence"), [['Sleep checks', `Every ${RD_SLEEP_INTERVAL} min`, 'AU Red Nose best practice · NZ HS107 mandates 5–10 min'], ['Nappy / toileting', `Every ${rdDur(RD_NAPPY_INTERVAL)}`, 'Counted from the last one · the app’s own default']].map(([k, v, why]) => React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '3px 0'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: 'var(--sd-colour-text-secondary)',
        fontWeight: 500
      }
    }, k), React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, why)), React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, v))))), React.createElement(RdSheetFoot, {
      phone: phone
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: !changed,
      onClick: changed ? () => onSave(care, detail, events) : undefined
    }, "Save settings"))));
  }
  function RdToggle({
    on,
    onChange,
    label
  }) {
    return React.createElement("button", {
      type: "button",
      role: "switch",
      "aria-checked": on,
      "aria-label": label,
      onClick: () => onChange(!on),
      className: 'ds-toggle' + (on ? ' ds-toggle--on' : '')
    }, React.createElement("span", {
      className: "ds-toggle__rail",
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "ds-toggle__knob-wrap"
    }, React.createElement("span", {
      className: "ds-toggle__thumb"
    }))));
  }
  function RdAction({
    children,
    glyph,
    primary,
    full,
    grow,
    muted,
    small,
    onClick
  }) {
    const off = muted && primary;
    return React.createElement("button", {
      type: "button",
      onClick: onClick,
      className: muted ? '' : 'fp-btn',
      "aria-disabled": muted ? 'true' : undefined,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: muted ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: small ? 40 : 46,
        padding: small ? '0 14px' : '0 18px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: small ? 13.5 : 15,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: off ? 'var(--sd-colour-surface-grey)' : primary ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-default)',
        color: off ? 'var(--sd-colour-text-disabled)' : primary ? 'var(--sd-colour-text-inverse)' : muted ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-text-primary)',
        border: primary && !off ? '1px solid transparent' : `1px solid var(--sd-colour-border-default)`,
        ...(full ? {
          width: '100%'
        } : {}),
        ...(grow ? {
          flex: '1 1 auto'
        } : {})
      }
    }, glyph && React.createElement(SdIcon, {
      name: glyph,
      size: 18
    }), children);
  }
  function RdSheetFoot(props) {
    const ctx = React.useContext(RdChangedCtx);
    const m = ctx && ctx.list.find(x => !props.only || props.only.includes(x.id));
    if (!m) return React.createElement(RdSheetFootRow, props);
    const first = m.name.split(' ')[0];
    const batch = !!props.only && props.only.length > 1;
    const tail = batch ? ` Leave ${first} out to save the rest.` : props.keep ? ` What you entered is kept as a draft: finish it in ${m.toName}.` : m.kind === 'moved' ? ` Record it in ${m.toName}.` : '';
    const kids = React.Children.map(props.children, ch => !React.isValidElement(ch) ? ch : ch.props.primary ? React.cloneElement(ch, {
      muted: true,
      onClick: undefined
    }) : React.cloneElement(ch, {
      onClick: props.keep || ch.props.onClick
    }, ctx.back));
    return React.createElement(React.Fragment, null, React.createElement("div", {
      role: "alert",
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 22px',
        flexShrink: 0,
        background: RD_SYNC_BG,
        color: RD_SYNC_FG,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.4
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        marginTop: 1,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "info-alert",
      size: 16
    })), React.createElement("span", null, first, " was ", m.kind === 'elsewhere' ? 'signed in to' : 'moved to', " ", m.toName, " at ", RD_AMPM(m.at), ". Nothing here has been saved.", tail)), React.createElement(RdSheetFootRow, props, kids));
  }
  function RdSheetFootRow({
    note,
    phone,
    edge = false,
    divider = true,
    inline = false,
    children
  }) {
    const border = {
      borderTop: divider ? '1px solid var(--sd-colour-border-default)' : 'none',
      flexShrink: 0,
      display: 'flex'
    };
    if (!phone) {
      return React.createElement("div", {
        style: {
          ...border,
          padding: '14px 22px',
          alignItems: 'center',
          gap: 12
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--sd-colour-text-secondary)',
          flex: 1
        }
      }, note), children);
    }
    const acts = React.Children.toArray(children).reverse();
    if (inline) {
      return React.createElement("div", {
        style: {
          ...border,
          padding: edge ? '12px 22px calc(14px + env(safe-area-inset-bottom, 0px))' : '12px 22px 14px',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 8
        }
      }, note != null && note !== false && React.createElement("span", {
        style: {
          fontSize: 13,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, note), React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          gap: 8
        }
      }, acts.map(a => React.cloneElement(a, {
        grow: true
      }))));
    }
    return React.createElement("div", {
      style: {
        ...border,
        padding: edge ? '14px 22px calc(18px + env(safe-area-inset-bottom, 0px))' : '14px 22px 18px',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 8
      }
    }, note != null && note !== false && React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, note), acts.map(a => React.cloneElement(a, {
      full: true
    })));
  }
  function rdPhoneFull(phone) {
    return phone ? {
      gutter: {
        padding: 0
      },
      card: {
        maxWidth: 'none',
        height: '100%',
        borderRadius: 0,
        boxShadow: 'none'
      },
      head: {
        padding: '6px 16px 10px 6px',
        gap: 4
      }
    } : {
      gutter: {},
      card: {},
      head: {}
    };
  }
  function RdSheetBack({
    onClick
  }) {
    return React.createElement("button", {
      type: "button",
      "aria-label": "Back",
      onClick: onClick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        width: 44,
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-left",
      size: 22
    }));
  }
  function RdAlertPill({
    label,
    urgent,
    onClick
  }) {
    const style = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      fontWeight: 700,
      padding: '7px 13px',
      borderRadius: 'var(--sd-radius-full)',
      background: 'var(--sd-colour-surface-default)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      color: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)'
    };
    const dot = React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        flexShrink: 0,
        background: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)'
      }
    });
    if (!onClick) return React.createElement("span", {
      style: style
    }, dot, label);
    return React.createElement("button", {
      type: "button",
      onClick: onClick,
      className: "fp-btn",
      "aria-label": `${label} — see what's due`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        ...style
      }
    }, dot, label, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 14
    }));
  }
  function RdDueSheet({
    d,
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const pick = c => {
      onClose();
      d.openDueChild(c);
    };
    const nothing = !d.dueChildren.length && !d.ratioBreaches.length;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-orange)',
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Due soon"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, d.identity.title)), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '14px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, !!d.ratioBreaches.length && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "Needs staff"), d.ratioBreaches.map(r => React.createElement("div", {
      key: r.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }, r.name, " over ratio"), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, "1:", r.ratio, " \xB7 needs 1:", r.limit))))), !!d.dueChildren.length && React.createElement(RdDueList, {
      d: d,
      onPick: pick,
      label: React.createElement(RdLabel, null, d.dueChildren.length === 1 ? '1 child' : `${d.dueChildren.length} children`)
    }), nothing && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '26px 8px',
        textAlign: 'center'
      }
    }, React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "tick",
      size: 22
    })), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, "Nothing due"), React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "All checks are up to date.")))));
  }
  const RdHeadRule = () => React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 1,
      alignSelf: 'stretch',
      margin: '2px 2px',
      flexShrink: 0,
      background: D_BORDER
    }
  });
  function RdSearch({
    value,
    onChange,
    count,
    placeholder,
    compact,
    autoFocus
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0
      }
    }, React.createElement("label", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        flex: 1,
        minWidth: 0,
        height: compact ? 40 : 42,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "search",
      size: 17
    })), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: value,
      placeholder: placeholder,
      "aria-label": placeholder,
      autoFocus: autoFocus,
      onChange: e => onChange(e.target.value),
      style: {
        all: 'unset',
        flex: 1,
        minWidth: 0,
        fontFamily: 'var(--sd-font-family)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--sd-colour-text-primary)'
      }
    }), !!value && React.createElement("button", {
      type: "button",
      "aria-label": "Clear search",
      onClick: () => onChange(''),
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 15
    })), compact && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, count)), !compact && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, count, " shown"));
  }
  function RdChildRow({
    c,
    selected,
    ticked,
    selectMode,
    alwaysSelect,
    showRoom,
    roomName,
    compact,
    rowDetail,
    onOpen,
    onTick,
    onLongPress,
    hideTag,
    showSlept,
    showSun,
    noAgo,
    pendingAtt
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const on = selected || ticked;
    const edge = on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)';
    const lp = useLongPress(() => onLongPress && onLongPress(c));
    const click = () => {
      if (lp.fired.current) {
        lp.fired.current = false;
        return;
      }
      onOpen();
    };
    const detail = rowDetail || RD_ROW_DETAIL_DEFAULT;
    const tickable = !!(alwaysSelect && onTick);
    const box = React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 24,
        height: 24,
        borderRadius: 'var(--sd-radius-sm)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: ticked ? 'var(--sd-colour-action-primary)' : 'transparent',
        border: ticked ? 'none' : '2px solid var(--sd-colour-border-strong)',
        color: '#fff'
      }
    }, ticked && React.createElement(SdIcon, {
      name: "tick",
      size: 14
    }));
    const frame = {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      minHeight: RD_ROW_H,
      padding: '8px 14px',
      background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: edge,
      borderRadius: 'var(--sd-radius-lg)'
    };
    const noSelect = {
      touchAction: 'pan-y',
      WebkitUserSelect: 'none',
      userSelect: 'none'
    };
    const body = React.createElement(React.Fragment, null, React.createElement(RdKid, {
      c: c,
      size: 40
    }), (() => {
      const nameEl = React.createElement("span", {
        style: {
          fontSize: compact ? 14.5 : 15.5,
          fontWeight: 700,
          color: 'var(--sd-colour-text-primary)',
          ...(compact ? {} : {
            width: 168,
            flexShrink: 0
          }),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, c.name);
      const statusEl = React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          ...(compact ? {
            minWidth: 0
          } : {
            flex: 1,
            minWidth: 0
          })
        }
      }, showRoom && React.createElement(RdRoomChip, {
        name: roomName
      }), c.alert && React.createElement(RdRowDue, {
        alert: c.alert
      }), c.state && React.createElement(RdStatePill, {
        state: c.state,
        show: detail.state
      }), showSlept && c.state === 'Awake' && rdSleepTotalText(c) && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub,
          whiteSpace: 'nowrap'
        }
      }, rdSleepTotalText(c)), showSun && !noAgo && c.status === 'here' && rdSunWords(c) && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub,
          whiteSpace: 'nowrap'
        }
      }, rdSunWords(c)), c.blocked && React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, React.createElement(SdIcon, {
        name: "lock",
        size: 13
      }), "Signed in elsewhere"), c.collect && React.createElement(RdCollectPill, {
        collect: c.collect
      }), detail.health && React.createElement(RdHealthPills, {
        c: c
      }), React.createElement(RdConsentPill, {
        c: c
      }), c.childTag && !hideTag && React.createElement(RdTagChip, {
        tag: c.childTag
      }), pendingAtt && React.createElement(RdPendingTag, null, "Waiting to send"));
      if (!compact) return React.createElement(React.Fragment, null, nameEl, statusEl);
      return React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden'
        }
      }, nameEl, statusEl);
    })(), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0
      }
    }, detail.events && !!(c.last || []).length && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: sub
      }
    }, c.last.slice(0, compact ? 1 : 3).map(([k, t]) => React.createElement("span", {
      key: k,
      title: RD_AMPM(t),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 500
      }
    }, React.createElement(RdColourIcon, {
      kind: k,
      size: 14
    }), !noAgo && rdAgo(t) || RD_AMPM(t)))), detail.time && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
        flexShrink: 0,
        minWidth: 44
      }
    }, (c.status === 'here' || c.status === 'gone' || c.status === 'expected') && React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: sub,
        whiteSpace: 'nowrap'
      }
    }, c.status === 'here' ? 'Signed in' : c.status === 'gone' ? 'Signed out' : 'Booked in'), React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)',
        whiteSpace: 'nowrap'
      }
    }, c.by ? `${RD_AMPM(c.at)} · ${c.by}` : RD_AMPM(c.at)))));
    if (!tickable) {
      return React.createElement("button", _extends({
        type: "button",
        onClick: click
      }, lp.handlers, {
        className: "fp-row",
        style: {
          ...noSelect,
          all: 'unset',
          cursor: 'pointer',
          ...frame
        }
      }), selectMode && box, body);
    }
    return React.createElement("div", {
      className: "fp-row",
      style: {
        ...noSelect,
        ...frame
      }
    }, React.createElement("button", {
      type: "button",
      onClick: () => onTick(c),
      className: "fp-rowpart",
      role: "checkbox",
      "aria-checked": !!ticked,
      "aria-label": `Select ${c.name}`,
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        flexShrink: 0,
        width: 44,
        height: 44,
        margin: '0 -10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, box), React.createElement("button", _extends({
      type: "button",
      onClick: click
    }, lp.handlers, {
      className: "fp-rowpart",
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        minWidth: 0,
        alignSelf: 'stretch'
      }
    }), body));
  }
  const rdRequiredText = r => `${r.staffRequired} educator${r.staffRequired === 1 ? '' : 's'} required`;
  function RdRoomRow({
    r,
    showStaff,
    selected,
    onOpen,
    compact
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const breach = showStaff && !r.ratioOk;
    const edge = selected ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)';
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        minHeight: 70,
        padding: '10px 14px',
        background: selected ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: edge,
        borderRadius: 'var(--sd-radius-lg)'
      }
    }, React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 'var(--sd-radius-m)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)',
        fontWeight: 700,
        fontSize: 15
      }
    }, r.name[0]), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...(compact ? {
          flex: 1,
          minWidth: 0
        } : {
          width: 168,
          flexShrink: 0
        })
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)',
        whiteSpace: 'nowrap'
      }
    }, r.name), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: sub,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, r.ages, " \xB7 ", rdRequiredText(r)), compact && !!r.due && React.createElement("span", {
      style: {
        display: 'flex',
        marginTop: 4
      }
    }, React.createElement(RdAlert, {
      alert: {
        kind: 'due',
        label: r.due === 1 ? '1 check due' : `${r.due} checks due`
      }
    }))), React.createElement("span", {
      style: {
        display: compact ? 'none' : 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        flex: 1,
        minWidth: 0
      }
    }, showStaff && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: 'var(--sd-radius-full)',
        background: breach ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-green)',
        color: breach ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-green)'
      }
    }, React.createElement(SdIcon, {
      name: "user",
      size: 13
    }), breach ? `Over ratio · 1:${r.ratio}` : `Staffed 1:${r.ratio}`), !!r.due && React.createElement(RdAlert, {
      alert: {
        kind: 'due',
        label: r.due === 1 ? '1 check due' : `${r.due} checks due`
      }
    })), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, svcOn('attendance') ? `${r.signed}/${r.booked}` : r.signed), React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: sub
      }
    }, svcOn('attendance') ? 'Signed in' : 'Children')), showStaff && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, r.educators), React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: sub
      }
    }, "Staff")), React.createElement("span", {
      style: {
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 17
    }))));
  }
  const RD_HEAD_H = 30;
  function RdGroupHead({
    label,
    count,
    total,
    action,
    sub,
    compact,
    open,
    onToggle
  }) {
    const narrowed = typeof total === 'number' && total > count;
    const words = React.createElement(React.Fragment, null, React.createElement("span", {
      style: {
        fontSize: sub ? 12.5 : 13,
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: 'var(--sd-colour-text-primary)'
      }
    }, label), React.createElement("span", {
      style: {
        fontSize: sub ? 12.5 : 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, narrowed ? `${count} of ${total}` : count));
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        padding: sub ? '4px 4px 3px' : '6px 4px 4px',
        paddingLeft: sub ? compact ? 12 : 14 : 4,
        position: 'sticky',
        top: sub ? RD_HEAD_H : 0,
        zIndex: sub ? 1 : 2,
        background: 'var(--sd-colour-surface-default)'
      }
    }, onToggle ? React.createElement("button", {
      type: "button",
      onClick: onToggle,
      "aria-expanded": !!open,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: -4,
        right: 0,
        top: -10,
        bottom: -5
      }
    }), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        alignSelf: 'center',
        display: 'inline-flex',
        marginLeft: -4,
        marginRight: -2,
        color: 'var(--sd-colour-text-secondary)',
        transform: open ? 'rotate(90deg)' : 'none',
        transition: 'transform .15s'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    })), words) : words, action && React.createElement(React.Fragment, null, !onToggle && React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement("button", _extends({
      type: "button",
      onClick: action.onClick,
      className: "fp-btn"
    }, rdTickA11y(action.state, `${action.label} — ${label}`), {
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        margin: `${(RD_HEAD_H - 44) / 2}px 0`,
        flexShrink: 0
      }
    }), React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: RD_HEAD_H,
        padding: '0 11px 0 7px',
        borderRadius: 'var(--sd-radius-full)',
        border: '1px solid var(--sd-colour-action-primary)',
        color: 'var(--sd-colour-action-primary)',
        fontSize: 12.5,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, React.createElement(RdTick, {
      state: action.state,
      size: 22
    }), action.label))));
  }
  function rdOpenGroups(d, g) {
    const heads = (d.bands ? [] : d.work || []).filter(x => x.label);
    if (!heads.length) return {
      groupCount: 0
    };
    const key = g.narrow ? `${g.listKey}|${g.narrow}` : g.listKey;
    const stored = g.openGroups[key];
    const openSet = g.narrow ? new Set(heads.map(x => x.key).filter(k => !(stored || []).includes(k))) : new Set(stored || (g.grouping === 'attendance' ? ['here'] : []));
    const write = open => g.setOpenGroups(m => ({
      ...m,
      [key]: g.narrow ? heads.map(x => x.key).filter(k => !open.has(k)) : [...open]
    }));
    return {
      groupCount: heads.length,
      groupOpen: k => openSet.has(k),
      allGroupsOpen: heads.every(x => openSet.has(x.key)),
      toggleGroup: k => {
        const next = new Set(openSet);
        if (next.has(k)) next.delete(k);else next.add(k);
        write(next);
      },
      setAllGroups: open => write(new Set(open ? heads.map(x => x.key) : []))
    };
  }
  function RdPaneShell({
    title,
    onClose,
    children,
    footer,
    wide,
    wrapBody = true
  }) {
    const line = '1px solid var(--sd-colour-border-default)';
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: 'var(--sd-colour-surface-default)',
        border: line,
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 16px',
        borderBottom: line,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        flex: 1,
        color: 'var(--sd-colour-text-primary)'
      }
    }, title), onClose && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 18
    }))), React.createElement("div", {
      style: wide && wrapBody ? {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '14px 28px'
      } : {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, wide && wrapBody ? React.Children.map(children, ch => ch ? React.createElement("div", {
      style: {
        flex: '1 1 300px',
        minWidth: 0
      }
    }, ch) : null) : children), footer && React.createElement("div", {
      style: {
        padding: 14,
        borderTop: line,
        flexShrink: 0,
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        gap: 8
      }
    }, footer));
  }
  const RdLabel = ({
    children
  }) => React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--sd-colour-text-secondary)'
    }
  }, children);
  function RdDueItem({
    c,
    roomName,
    showRoom,
    onPick,
    aa
  }) {
    const urgent = rdIsLate(c.alert);
    const sub = aa ? urgent ? 'var(--sd-colour-text-on-red)' : 'var(--sd-colour-text-secondary)' : urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)';
    return React.createElement("button", {
      type: "button",
      onClick: () => onPick(c),
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: urgent ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement(RdKid, {
      c: c,
      size: 34
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
        flex: 1
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, c.name), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: sub
      }
    }, c.alert.label, showRoom ? ` · ${roomName}` : '')), React.createElement("span", {
      style: {
        color: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    })));
  }
  const RD_DUE_LISTS = ['current', 'a', 'b', 'c'];
  const rdReadDueList = v => RD_DUE_LISTS.includes(v) ? v : 'current';
  const RD_DUE_NEXT = 3;
  const RD_DUE_OPEN_AT = 6;
  const rdDueKey = a => {
    const hit = a && RD_ALERT_EVENT.find(([, re]) => re.test(a.label));
    return hit ? hit[0] : null;
  };
  function RdDueLine({
    c,
    roomName,
    showRoom,
    onPick,
    glyph = true
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: () => onPick(c),
      className: "rd-quiet",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        padding: '4px 8px',
        margin: '0 -8px',
        borderRadius: 'var(--sd-radius-m)'
      }
    }, React.createElement(RdKid, {
      c: c,
      size: 28
    }), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'baseline',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.name), showRoom && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, roomName)), React.createElement(RdRowDue, {
      alert: c.alert,
      glyph: glyph
    }));
  }
  function RdDueList({
    d,
    onPick,
    label,
    count,
    rounds
  }) {
    const mode = d.dueList || 'current';
    const kids = d.dueChildren;
    const showRoom = d.scope === 'service';
    const [open, setOpen] = useState({});
    const toggle = (k, dflt) => setOpen(o => ({
      ...o,
      [k]: !(o[k] ?? dflt)
    }));
    const item = (c, aa) => React.createElement(RdDueItem, {
      key: c.id,
      c: c,
      showRoom: showRoom,
      roomName: d.roomNameOf(c),
      onPick: onPick,
      aa: aa
    });
    const line = (c, glyph) => React.createElement(RdDueLine, {
      key: c.id,
      c: c,
      showRoom: showRoom,
      roomName: d.roomNameOf(c),
      onPick: onPick,
      glyph: glyph
    });
    const groups = rounds ? d.dueGroups || [] : [];
    const roundBtn = g => React.createElement("button", {
      key: g.key,
      type: "button",
      onClick: () => d.openBulk(g.key, g.ids),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 11px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 13,
        fontWeight: 600,
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: g.key,
      size: 15
    }), g.label, " for these ", g.ids.length);
    const roundsRow = groups.length ? React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 7,
        marginTop: 2
      }
    }, groups.map(roundBtn)) : null;
    const col = {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    };
    if (mode === 'current') return React.createElement("div", {
      style: col,
      "data-duelist": mode
    }, label, kids.map(c => item(c, false)), roundsRow);
    const head = !count ? label : React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, label, React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, kids.length));
    const chev = (on, tone) => React.createElement("span", {
      style: {
        color: tone,
        display: 'inline-flex',
        flexShrink: 0,
        transform: on ? 'rotate(90deg)' : 'none',
        transition: 'transform .15s'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    }));
    if (mode === 'b') return React.createElement("div", {
      style: col,
      "data-duelist": mode
    }, head, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, kids.map(c => line(c, true))), roundsRow);
    if (mode === 'c') {
      const whole = kids.length <= RD_DUE_NEXT + 2;
      const top = whole ? kids : kids.slice(0, RD_DUE_NEXT);
      const rest = whole ? [] : kids.slice(RD_DUE_NEXT);
      const lateRest = rest.filter(c => rdIsLate(c.alert));
      const more = !!open.more;
      return React.createElement("div", {
        style: col,
        "data-duelist": mode
      }, head, top.map(c => item(c, true)), !!rest.length && React.createElement("button", {
        type: "button",
        "aria-expanded": more,
        onClick: () => toggle('more', false),
        className: "rd-quiet",
        "aria-label": `${rest.length} more due${lateRest.length ? `, ${lateRest.length} late` : ''}`,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 44,
          padding: '0 12px',
          borderRadius: 'var(--sd-radius-lg)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--sd-colour-action-primary)'
        }
      }, rest.length, " more due"), !!lateRest.length && React.createElement(RdRowDue, {
        alert: lateRest[0].alert,
        glyph: false,
        text: `${lateRest.length} late`
      }), React.createElement("span", {
        style: {
          flex: 1
        }
      }), chev(more, 'var(--sd-colour-action-primary)')), more && rest.map(c => item(c, true)), roundsRow);
    }
    const singles = kids.filter(c => {
      const k = rdDueKey(c.alert);
      return !k || k === 'med';
    });
    const byEvent = [];
    kids.forEach(c => {
      const k = rdDueKey(c.alert);
      if (!k || k === 'med') return;
      let g = byEvent.find(x => x.key === k);
      if (!g) {
        g = {
          key: k,
          kids: []
        };
        byEvent.push(g);
      }
      g.kids.push(c);
    });
    const dflt = kids.length <= RD_DUE_OPEN_AT;
    return React.createElement("div", {
      style: col,
      "data-duelist": mode
    }, head, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, singles.map(c => line(c, true)), byEvent.map(g => {
      if (g.kids.length === 1) return line(g.kids[0], true);
      const isOpen = open[g.key] ?? dflt;
      const late = g.kids.filter(c => rdIsLate(c.alert)).length;
      const ev = g.key === 'sleep' && d.roomEvents ? rdEventTitle('sleep', d.roomEvents.sleepTrack || 'Sleep') : g.kids[0].alert.label.split(' · ')[0];
      const title = /check$/i.test(ev) ? `${ev}s` : ev;
      const round = groups.find(x => x.key === g.key);
      return React.createElement("div", {
        key: g.key,
        style: {
          display: 'flex',
          flexDirection: 'column'
        }
      }, React.createElement("button", {
        type: "button",
        "aria-expanded": isOpen,
        onClick: () => toggle(g.key, dflt),
        className: "rd-quiet",
        "aria-label": `${title}, ${g.kids.length} due${late ? `, ${late} late` : ''}`,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 44,
          padding: '4px 8px',
          margin: '0 -8px',
          borderRadius: 'var(--sd-radius-m)'
        }
      }, React.createElement("span", {
        style: {
          width: 28,
          display: 'inline-flex',
          justifyContent: 'center',
          flexShrink: 0
        }
      }, React.createElement(RdColourIcon, {
        kind: g.key,
        size: 22
      })), React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--sd-colour-text-primary)',
          whiteSpace: 'nowrap'
        }
      }, title), React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--sd-colour-text-secondary)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, g.kids.length), React.createElement("span", {
        style: {
          flex: 1
        }
      }), React.createElement(RdRowDue, {
        alert: g.kids[0].alert,
        glyph: false,
        text: late ? `${late} late` : undefined
      }), chev(isOpen, 'var(--sd-colour-text-secondary)')), isOpen && React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 38
        }
      }, g.kids.map(c => line(c, false)), round && React.createElement("div", {
        style: {
          display: 'flex',
          padding: '4px 0 8px'
        }
      }, roundBtn(round))));
    })));
  }
  function RdPaneBatch({
    d,
    wide
  }) {
    return React.createElement(RdPaneShell, {
      wide: wide,
      title: `${d.tickedCount} selected`,
      onClose: d.clearSelection,
      footer: React.createElement(React.Fragment, null, d.actions.filter(a => a.key === 'headcount').map(a => React.createElement(RdAction, {
        key: a.key,
        glyph: a.glyph,
        primary: true,
        full: true,
        onClick: a.onClick,
        muted: !a.onClick
      }, a.label)), React.createElement(RdAction, {
        full: true,
        onClick: d.clearSelection
      }, "Clear selection"))
    }, !!d.attendanceActions.length && React.createElement(React.Fragment, null, React.createElement(RdLabel, null, "Attendance for these ", d.tickedCount), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, d.attendanceActions.map(([k, n]) => React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => d.openBulk(k),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 14.5,
        fontWeight: 600,
        background: 'var(--sd-colour-surface-grey)',
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(SdIcon, {
      name: k === 'in' ? 'signin' : k === 'out' ? 'signout' : 'close',
      size: 18
    }), RD_BULK[k].label, React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, n), React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    }))))), React.createElement(RdLabel, null, "Log for these ", d.tickedCount), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, d.bulkEvents.map(k => React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => d.openBulk(k),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 14.5,
        fontWeight: 600,
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: k,
      size: 18
    }), d.eventLabel(k), React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    }))), rdLearning.on() && !d.readOnly && React.createElement("button", {
      type: "button",
      onClick: () => rdLearning.start(d.tickedChildren.map(c => c.id)),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 46,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 14.5,
        fontWeight: 600,
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: "learning",
      size: 18
    }), "Learning", React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    }))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "Selected"), React.createElement("span", {
      style: {
        flex: 1
      }
    }), d.canTag && React.createElement(RdTextAction, {
      onClick: d.openTagSheet
    }, "Add to tag")), React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, d.tickedChildren.map(c => React.createElement("button", {
      key: c.id,
      type: "button",
      onClick: () => d.toggleTick(c),
      style: {
        all: 'unset',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px 4px 4px',
        borderRadius: 'var(--sd-radius-full)',
        background: 'var(--sd-colour-surface-grey)',
        fontSize: 12.5,
        fontWeight: 600
      }
    }, React.createElement(RdKid, {
      c: c,
      size: 22
    }), c.name.split(' ')[0], React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 12
    })))))));
  }
  function RdDoorFoot({
    d,
    wide
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: 1,
        minWidth: 0
      }
    }, d.lastCount && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, d.lastCount), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        gap: 8
      }
    }, d.actions.map(a => React.createElement(RdAction, {
      key: a.key,
      glyph: a.glyph,
      primary: a.primary,
      full: true,
      onClick: a.onClick,
      muted: !a.onClick
    }, a.label))));
  }
  function RdPaneNow({
    d,
    wide
  }) {
    return (React.createElement(RdPaneShell, {
        wide: wide,
        title: "Now",
        footer: d.actions.length || d.lastCount ? [React.createElement(RdDoorFoot, {
          key: "door",
          d: d,
          wide: wide
        })] : null
      }, !!d.bulkEvents.length && d.bulkScope.narrowed && React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7
        }
      }, React.createElement(RdLabel, null, d.bulkScope.narrowed ? 'Log for the children shown' : 'Log for the room'), React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)',
          marginTop: -2
        }
      }, d.bulkScope.narrowed ? d.bulkScope.count ? 'Follows the filter — only the children on the list right now. Adjust the exceptions in the sheet.' : 'Nobody on the list right now is signed in, so there is no one to log for.' : 'Each round starts with the children it applies to — a sleep check with those asleep, sunscreen with those awake. The rest are in the sheet, ready to add. Filter or group the list first to log for fewer.'), React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 7
        }
      }, d.bulkEvents.map(k => {
        const n = d.bulkScope.counts && d.bulkScope.counts[k] || 0;
        const total = d.bulkScope.count;
        const none = !total;
        return React.createElement("button", {
          key: k,
          type: "button",
          disabled: none,
          "aria-label": `${d.eventLabel(k)} for ${n === total ? `${n} ${n === 1 ? 'child' : 'children'}` : `${n} of ${total} children`}`,
          onClick: () => d.openBulk(k, d.bulkScope.ids),
          className: "fp-btn",
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: none ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            height: 42,
            padding: '0 12px',
            borderRadius: 'var(--sd-radius-lg)',
            fontSize: 13.5,
            fontWeight: 600,
            opacity: none ? 0.45 : 1,
            background: 'var(--sd-colour-surface-cyan)',
            color: 'var(--sd-colour-action-primary)'
          }
        }, React.createElement(RdColourIcon, {
          kind: k,
          size: 18
        }), React.createElement("span", {
          style: {
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, d.eventLabel(k)), React.createElement("span", {
          style: {
            marginLeft: 'auto',
            paddingLeft: 6,
            fontVariantNumeric: 'tabular-nums',
            opacity: 0.75
          }
        }, n));
      }))), !!d.ratioBreaches.length && React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, React.createElement(RdLabel, null, "Needs staff"), d.ratioBreaches.map(r => React.createElement("button", {
        key: r.key,
        type: "button",
        onClick: () => d.openRoom(r),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-red)'
        }
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-feedback-error-default)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "warning",
        size: 20
      })), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--sd-colour-text-primary)'
        }
      }, r.name, " over ratio"), React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, "1:", r.ratio, " \xB7 needs 1:", r.limit)), React.createElement("span", {
        style: {
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 16
      }))))), d.dueChildren.length ? React.createElement(RdDueList, {
        d: d,
        onPick: d.openDueChild,
        label: React.createElement(RdLabel, null, "Due soon"),
        count: true,
        rounds: true
      }) : !d.ratioBreaches.length && React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          padding: '26px 8px',
          textAlign: 'center'
        }
      }, React.createElement("span", {
        style: {
          width: 46,
          height: 46,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--sd-colour-surface-cyan)',
          color: 'var(--sd-colour-action-primary)'
        }
      }, React.createElement(SdIcon, {
        name: "tick",
        size: 22
      })), React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700
        }
      }, "Nothing due"), React.createElement("span", {
        style: {
          fontSize: 13,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "All checks are up to date.")), React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, React.createElement(RdLabel, null, d.scope === 'service' ? 'Service' : 'Room'), d.paneCounts.map(([k, v, facet, value]) => {
        const live = !!facet && v !== '0';
        const on = live && (d.facets[facet] || []).length === 1 && (d.facets[facet] || [])[0] === value;
        if (!live) {
          return React.createElement("div", {
            key: k,
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13.5,
              padding: '3px 0'
            }
          }, React.createElement("span", {
            style: {
              color: 'var(--sd-colour-text-secondary)',
              fontWeight: 500,
              opacity: facet ? 0.55 : 1
            }
          }, k), React.createElement("span", {
            style: {
              fontWeight: 700,
              opacity: facet ? 0.55 : 1
            }
          }, v));
        }
        return React.createElement("button", {
          key: k,
          type: "button",
          className: "fp-btn",
          "aria-pressed": on,
          "aria-label": on ? `Stop showing only ${k.toLowerCase()}` : `Show only the ${v} ${k.toLowerCase()}`,
          onClick: () => d.setFacets(f => {
            const next = {
              ...f
            };
            if (on) delete next[facet];else next[facet] = [value];
            return next;
          }),
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
            fontSize: 13.5,
            padding: '3px 8px',
            margin: '0 -8px',
            borderRadius: 'var(--sd-radius-sm)',
            background: on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
            color: on ? 'var(--sd-colour-action-primary)' : 'inherit'
          }
        }, React.createElement("span", {
          style: {
            color: on ? 'inherit' : 'var(--sd-colour-text-secondary)',
            fontWeight: on ? 700 : 500
          }
        }, k), React.createElement("span", {
          style: {
            fontWeight: 700
          }
        }, v));
      })))
    );
  }
  function RdPaneChild({
    c,
    scope,
    roomName,
    bookInto,
    wide,
    offline,
    isPending,
    readOnly,
    onChooseEvent,
    onIncident,
    onSign,
    onAbsent,
    onOpenRecord,
    onProfile,
    onClose,
    onOpenRoom,
    onTag
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const absentEv = c.status === 'absent' ? [...rdAttOf(c)].reverse().find(e => e.kind === 'absent') : null;
    const signedIns = rdAttOf(c).filter(e => e.kind === 'in');
    const firstIn = c.status === 'here' && signedIns.length > 1 ? signedIns[0].at : null;
    const anyLocked = !can('healthEvents', scope) || !can('medication', scope);
    const corrected = c.corrected || [];
    const profileLink = onProfile ? React.createElement("button", {
      type: "button",
      onClick: onProfile,
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '10px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-action-primary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "user",
      size: 17
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700
      }
    }, "View full profile"), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: sub,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "contacts \xB7 documents \xB7 full event log")), React.createElement("span", {
      style: {
        color: sub,
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    }))) : null;
    const tagLine = c.childTag || onTag ? React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 22,
        marginTop: 2
      }
    }, c.childTag && React.createElement(RdTagChip, {
      tag: c.childTag
    }), onTag && React.createElement(RdTextAction, {
      onClick: onTag,
      ariaLabel: `${c.childTag ? 'Change tag' : 'Add tag'} for ${c.name.split(' ')[0]}`
    }, c.childTag ? 'Change tag' : 'Add tag')) : null;
    const identity = React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement(RdKid, {
      c: c,
      size: 54
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, c.name), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, scope === 'service' ? `${roomName} · ` : c.status === 'other' ? `Usually in ${roomName} · ` : '', c.age != null && `${rdAgeText(c)} · `, c.status === 'here' ? firstIn ? React.createElement(React.Fragment, null, "Back ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(c.at)), " \xB7 first in ", RD_AMPM(firstIn)) : React.createElement(React.Fragment, null, "Signed in ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(c.at))) : c.status === 'expected' ? React.createElement(React.Fragment, null, "Booked in ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(c.at))) : c.status === 'gone' ? React.createElement(React.Fragment, null, "Signed out ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(c.at)), c.by ? React.createElement(React.Fragment, null, " \xB7 ", c.by) : null) : c.status === 'holiday' ? 'On holiday' : c.status === 'other' ? 'No booking today' : absentEv ? React.createElement(React.Fragment, null, "Marked absent ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(absentEv.at))) : 'Absent today', svcOn('attendance') && (c.status === 'expected' || c.status === 'here') && (() => {
      const bk = rdBooking(c);
      return bk ? React.createElement(React.Fragment, null, " \xB7 ", c.status === 'expected' ? 'until' : 'booked until', " ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, RD_AMPM(bk.end))) : null;
    })()), isPending && isPending(c, 'attendance') && React.createElement("span", {
      style: {
        alignSelf: 'flex-start'
      }
    }, React.createElement(RdPendingTag, null, "Waiting to send")), tagLine));
    const hasPills = !!(c.collect || !rdConsent(c) || rdHealthPills(c).length);
    const flags = c.alert || hasPills ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6
      }
    }, c.alert && React.createElement(RdRowDue, {
      alert: c.alert,
      full: true
    }), hasPills && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, React.createElement(RdCollectPill, {
      collect: c.collect,
      full: true
    }), React.createElement(RdHealthPills, {
      c: c
    }), React.createElement(RdConsentPill, {
      c: c
    }))) : null;
    const canOpen = !!onOpenRecord;
    const attToday = readOnly ? [] : (() => {
      let nIn = 0;
      return rdAttOf(c).map((e, i) => {
        const again = e.kind === 'in' && nIn > 0;
        if (e.kind === 'in') nIn += 1;
        return {
          ...e,
          i,
          title: e.kind === 'in' ? again ? 'Signed in again' : 'Signed in' : e.kind === 'out' ? 'Signed out' : 'Marked absent',
          detail: e.kind === 'out' ? rdOutLine(e.to) : null
        };
      }).reverse().slice(0, 2);
    })();
    const today = readOnly === 'future' ? null : React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Today"), attToday.map(e => React.createElement("div", {
      key: `att-${e.i}`,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 13.5,
        padding: '4px 0'
      }
    }, React.createElement("span", {
      style: {
        color: sub,
        display: 'inline-flex',
        flexShrink: 0
      }
    }, React.createElement(RdLogIcon, {
      kind: e.kind,
      size: 18
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, e.title, e.detail && React.createElement("span", {
      style: {
        color: sub,
        fontWeight: 600
      }
    }, " \xB7 ", e.detail)), e.by && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: sub
      }
    }, e.by), e.note && React.createElement("span", {
      style: {
        fontSize: 12,
        fontStyle: 'italic',
        color: sub
      }
    }, "\u201C", e.note, "\u201D")), React.createElement("span", {
      style: {
        color: sub,
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }
    }, RD_AMPM(e.at)))), (c.last || []).length ? (c.last || []).map(entry => {
      const [k, t, detail, note, ctx, type, rec, by] = entry;
      const amended = corrected.includes(k);
      const ago = readOnly ? null : rdAgo(t);
      const slept = k === 'sleep' && RD_PERIOD_END[type] ? rdSleepTotalText(c) : null;
      const row = React.createElement(React.Fragment, null, React.createElement(RdColourIcon, {
        kind: k,
        size: 18
      }), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flex: 1,
          minWidth: 0,
          textAlign: 'left'
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          flexWrap: 'wrap'
        }
      }, React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, k === 'sleep' && ctx === 'Rest' ? 'Rest' : RD_EVENT_LABEL[k] || RD_LOG_TITLE[k] || 'Note'), detail && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 600
        }
      }, "\xB7 ", k === 'meal' && rec && rec.meal ? ctx || detail : detail), amended && React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 7px',
          borderRadius: 'var(--sd-radius-full)',
          background: 'var(--sd-colour-surface-grey)',
          color: sub
        }
      }, "Amended"), isPending && isPending(c, k) ? React.createElement(RdPendingTag, null) : null), rec && React.createElement(RdSleepRecord, {
        rec: rec,
        style: {
          fontSize: 12,
          lineHeight: '17px',
          color: sub
        }
      }), k === 'meal' && rec && rec.meal && React.createElement(RdMealLine, {
        items: rec.meal.items,
        style: {
          fontSize: 12.5,
          lineHeight: '17px',
          fontWeight: 500,
          color: 'var(--sd-colour-text-primary)'
        }
      }), slept && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, slept), by && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, by), note && React.createElement("span", {
        style: {
          fontSize: 12,
          fontStyle: 'italic',
          color: sub,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, "\u201C", note, "\u201D")), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
          flexShrink: 0
        }
      }, React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }
      }, RD_AMPM(t)), ago && React.createElement("span", {
        style: {
          fontSize: 11.5,
          fontWeight: 500,
          color: sub,
          whiteSpace: 'nowrap'
        }
      }, ago)), canOpen && React.createElement("span", {
        style: {
          color: sub,
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 14
      })));
      return canOpen ? React.createElement("button", {
        key: k,
        type: "button",
        onClick: () => onOpenRecord({
          kind: k,
          at: t,
          detail,
          note,
          context: ctx,
          type,
          rec,
          by
        }),
        className: "fp-row",
        "aria-label": `Open ${k === 'sleep' ? rdEventTitle(k, ctx) : RD_EVENT_LABEL[k] || RD_LOG_TITLE[k] || 'note'} at ${RD_AMPM(t)}${by ? `, recorded by ${by}` : ''}`,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 13.5,
          padding: '5px 8px',
          margin: '0 -8px',
          minHeight: 'var(--sd-spacing-touch-target)',
          borderRadius: 'var(--sd-radius-m)'
        }
      }, row) : React.createElement("div", {
        key: k,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 13.5,
          padding: '4px 0'
        }
      }, row);
    }) : attToday.length ? null : React.createElement("span", {
      style: {
        fontSize: 13,
        color: sub
      }
    }, "Nothing logged yet today."));
    const auditTrail = c.audit && c.audit.length ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Audit trail"), c.audit.map((a, i) => React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '9px 11px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, a.action, " ", React.createElement("span", {
      style: {
        fontWeight: 600,
        color: sub
      }
    }, "\xB7 ", a.detail)), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: sub
      }
    }, a.by, " \xB7 ", RD_AMPM(a.at)), a.reason && React.createElement("span", {
      style: {
        fontSize: 12,
        fontStyle: 'italic',
        color: sub
      }
    }, "\u201C", a.reason, "\u201D")))) : null;
    const logNote = c.status !== 'here' && c.status !== 'gone' && c.status !== 'absent' && !c.blocked || anyLocked ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, c.status !== 'here' && c.status !== 'gone' && c.status !== 'absent' && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, c.status === 'expected' && readOnly === 'future' ? `${c.name.split(' ')[0]} is booked in for this day.` : c.status === 'expected' ? `${c.name.split(' ')[0]} hasn’t been signed in yet — arrival comes first. A dose can’t be recorded until then. If something has happened, use Log incident.` : c.status === 'holiday' ? 'On holiday today.' : bookInto ? `Signing in books them into ${bookInto}.` : 'Signing in will create a booking.'), anyLocked && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, "Health events and medication are logged in the child\u2019s room, so they\u2019re unavailable from the service dashboard.")) : null;
    const blockedSignIn = c.blocked ? React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "lock",
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600
      }
    }, React.createElement("b", null, "Can\u2019t be signed in here."), " ", c.blocked, ". A child can only be signed in to one room at a time.")) : null;
    return React.createElement(RdPaneShell, {
      wide: wide,
      wrapBody: !wide,
      title: "Child",
      onClose: onClose,
      footer: readOnly ? React.createElement(RdAction, {
        glyph: 'lock',
        full: true,
        muted: true
      }, readOnly === 'future' ? 'Read-only · future day' : 'Read-only · past day') : c.blocked ? React.createElement(RdAction, {
        glyph: 'lock',
        full: true,
        muted: true
      }, "Can\u2019t sign in here") : React.createElement(React.Fragment, null, anyLocked && !(c.status === 'expected' || c.status === 'other') ? React.createElement(RdAction, {
        glyph: 'chevron-right',
        primary: true,
        full: true,
        onClick: onOpenRoom
      }, "Open ", roomName, " to log") : c.status === 'expected' || c.status === 'other' ? onSign ? React.createElement(RdAction, {
        glyph: 'signin',
        primary: true,
        full: true,
        onClick: () => onSign('in')
      }, "Sign in ", c.name.split(' ')[0]) : React.createElement(RdAction, {
        glyph: 'lock',
        full: true,
        muted: true
      }, "Sign in needs a connection") : c.status === 'here' ? React.createElement(RdAction, {
        glyph: 'tick',
        primary: true,
        full: true,
        onClick: onChooseEvent
      }, "Log an event") : null, c.status === 'here' && onSign && React.createElement(RdAction, {
        glyph: 'signout',
        full: true,
        onClick: () => onSign('out')
      }, "Sign out"), c.status === 'gone' && onSign && React.createElement(RdAction, {
        glyph: 'signin',
        primary: !anyLocked,
        full: true,
        onClick: () => onSign('in')
      }, "Sign in ", c.name.split(' ')[0], " again"), c.status === 'absent' && onSign && React.createElement(RdAction, {
        glyph: 'signin',
        primary: !anyLocked,
        full: true,
        onClick: () => onSign('in')
      }, "Sign in ", c.name.split(' ')[0]), c.status === 'expected' && onAbsent && React.createElement(RdAction, {
        glyph: "close",
        full: true,
        onClick: onAbsent
      }, "Mark absent"), onIncident && React.createElement(RdAction, {
        glyph: "document",
        full: true,
        onClick: onIncident
      }, "Log incident"))
    }, wide ? React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 28,
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        flex: '1 1 260px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, identity, flags), React.createElement("div", {
      style: {
        flex: '1 1 260px',
        minWidth: 0
      }
    }, today)), blockedSignIn, logNote, profileLink, auditTrail) : React.createElement(React.Fragment, null, identity, flags, blockedSignIn, logNote, profileLink, today, auditTrail));
  }
  function RdLogIcon({
    kind,
    size = 16
  }) {
    if (kind === 'in') return React.createElement(SdIcon, {
      name: "signin",
      size: size
    });
    if (kind === 'out') return React.createElement(SdIcon, {
      name: "signout",
      size: size
    });
    if (kind === 'absent') return React.createElement(SdIcon, {
      name: "close",
      size: size
    });
    return React.createElement(RdColourIcon, {
      kind: kind,
      size: size
    });
  }
  const RD_LOG_CATS = [{
    key: 'attendance',
    label: 'Attendance',
    none: 'attendance'
  }, {
    key: 'sleep',
    label: 'Sleep',
    none: 'sleep checks'
  }, {
    key: 'nappy',
    label: 'Nappies',
    none: 'nappy records'
  }, {
    key: 'meal',
    label: 'Meals',
    none: 'meals'
  }, {
    key: 'sun',
    label: 'Sunscreen',
    none: 'sunscreen'
  }, {
    key: 'med',
    label: 'Medication',
    none: 'medication'
  }, {
    key: 'note',
    label: 'Notes',
    none: 'notes'
  }, {
    key: 'family',
    label: 'From family',
    none: 'events from family'
  }];
  const rdLogKey = e => e.kind === 'in' || e.kind === 'out' ? 'attendance' : e.kind;
  const rdLogIn = (e, cat) => cat === 'all' || (cat === 'family' ? e.origin === 'family' : e.origin !== 'family' && rdLogKey(e) === cat);
  const rdRowEntry = (e, past) => ({
    readOnly: true,
    kind: e.kind,
    at: e.at,
    detail: e.detail || null,
    note: e.note || null,
    by: e.by || null,
    title: e.title,
    origin: e.origin || null,
    past,
    why: e.origin === 'family' ? 'A family member recorded this at home. Only they can change it.' : past ? 'A past day is a closed record. It can’t be changed.' : e.kind === 'in' || e.kind === 'out' ? 'A sign-in or sign-out is a record of attendance. It can’t be changed here.' : null
  });
  function RdEventLog({
    child,
    history,
    dayOffset = 0,
    onOpenRecord,
    hideHeading = false,
    cat = 'all',
    onCat
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const chip = (bg, fg) => ({
      fontSize: 11,
      fontWeight: 700,
      padding: '1px 8px',
      borderRadius: 'var(--sd-radius-full)',
      whiteSpace: 'nowrap',
      background: bg,
      color: fg
    });
    const past = dayOffset > 0;
    const everything = rdTimeline(child, dayOffset);
    const timeline = everything.filter(e => rdLogIn(e, cat));
    const dayLabel = (RD_LOG_DAYS[dayOffset] || RD_LOG_DAYS[0]).day;
    const first = child.name.split(' ')[0];
    const catNone = (RD_LOG_CATS.find(k => k.key === cat) || {}).none || 'events';
    const booking = rdBooking(child, dayOffset);
    const hiddenFamily = rdFamily(child, dayOffset).hiddenRows.filter(r => rdLogIn(r, cat)).length;
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, !hideHeading && React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, React.createElement(RdLabel, null, past ? `${dayLabel} · log` : 'Today’s log'), !!timeline.length && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: sub
      }
    }, timeline.length, " ", timeline.length === 1 ? 'event' : 'events'), past && React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--grey ds-pill--minimal"
    }, "Closed record")), booking && React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 16
    }), React.createElement("span", null, "Booked ", RD_AMPM(booking.start), " to ", RD_AMPM(booking.end))), !!hiddenFamily && React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        color: sub
      }
    }, hiddenFamily === 1 ? '1 event a family member recorded' : `${hiddenFamily} events a family member recorded`, " while ", first, " was signed in ", hiddenFamily === 1 ? 'is' : 'are', " kept off this log."), timeline.length ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, timeline.map((e, i) => {
      const last = i === timeline.length - 1;
      const family = e.origin === 'family';
      const openable = !!onOpenRecord;
      const woke = e.kind === 'sleep' && e.live && !past && RD_PERIOD_END[(rdLastOf(child, 'sleep') || {}).type] ? rdSleepTotalText(child) : null;
      const open = () => onOpenRecord(e.doseId ? rdDoseEntry(child, e.doseId) : e.live && !past && !family ? rdLastOf(child, e.kind) : rdRowEntry(e, past));
      const textBlock = React.createElement(React.Fragment, null, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          flexWrap: 'wrap',
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700
        }
      }, e.title), family && React.createElement("span", {
        className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal",
        "data-origin": "family"
      }, "From family"), e.live && !past && RD_MINS(RD_NOW) - e.min <= RD_JUST_LOGGED && React.createElement("span", {
        style: chip('var(--sd-colour-surface-cyan)', 'var(--sd-colour-text-on-cyan)')
      }, "Just logged"), e.amended && React.createElement("span", {
        style: chip('var(--sd-colour-surface-grey)', sub)
      }, "Amended")), openable && React.createElement("span", {
        style: {
          color: sub,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 14
      }))), React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--sd-colour-text-primary)'
        }
      }, e.detail), e.rec && React.createElement(RdSleepRecord, {
        rec: e.rec,
        style: {
          fontSize: 12.5,
          lineHeight: '18px',
          color: sub
        }
      }), woke && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: sub
        }
      }, woke), (e.by || e.note) && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, e.by, e.by && e.note ? ' · ' : null, e.note ? React.createElement("span", {
        style: {
          fontWeight: 500,
          fontStyle: 'italic'
        }
      }, e.note) : null));
      return React.createElement("div", {
        key: `${e.min}-${e.kind}-${i}`,
        style: {
          display: 'flex',
          gap: 12,
          alignItems: 'stretch'
        }
      }, React.createElement("span", {
        style: {
          width: 58,
          flexShrink: 0,
          textAlign: 'right',
          fontSize: 12.5,
          fontWeight: 700,
          paddingTop: 4
        }
      }, RD_AMPM(e.at)), React.createElement("div", {
        style: {
          flexShrink: 0,
          width: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }, React.createElement("span", {
        style: {
          width: 30,
          height: 30,
          borderRadius: '50%',
          flexShrink: 0,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--sd-colour-text-secondary)',
          ...(family ? {
            background: 'var(--sd-colour-surface-default)',
            border: '1.5px dashed var(--sd-colour-text-secondary)'
          } : {
            background: 'var(--sd-colour-surface-grey)'
          })
        }
      }, React.createElement(RdLogIcon, {
        kind: e.kind,
        size: 16
      })), !last && React.createElement("span", {
        style: {
          flex: 1,
          width: 1,
          background: 'var(--sd-colour-border-default)',
          margin: '3px 0'
        }
      })), React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          paddingBottom: last ? 0 : 18
        }
      }, openable ? React.createElement("button", {
        type: "button",
        className: "fp-row",
        "aria-label": [`Open ${e.title}${family ? ', from family' : ''}`, e.detail || null, RD_AMPM(e.at), e.by ? `recorded by ${e.by}` : null].filter(Boolean).join(', '),
        onClick: open,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          minHeight: 44,
          margin: '-4px -8px',
          padding: '4px 8px',
          borderRadius: 'var(--sd-radius-m)',
          textAlign: 'left'
        }
      }, textBlock) : textBlock));
    })) : everything.length ? React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        fontSize: 13,
        color: sub
      }
    }, "No ", catNone, " ", past ? dayLabel.toLowerCase() : 'today', ".", onCat && React.createElement(RdTextAction, {
      onClick: () => onCat('all')
    }, "Show all")) : React.createElement("span", {
      style: {
        fontSize: 13,
        color: sub
      }
    }, past ? `Nothing logged — ${first} wasn’t in ${dayLabel.toLowerCase()}.` : child.status === 'absent' ? `Nothing logged — ${first} is absent today.` : child.status === 'holiday' ? `Nothing logged — ${first} is on holiday today.` : `Nothing logged yet — ${first} hasn’t been signed in today.`), !past && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "Earlier days"), history.slice(0, 3).map(h => React.createElement("div", {
      key: h.day,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        fontSize: 13,
        padding: '7px 2px',
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, h.day), React.createElement("span", {
      style: {
        color: sub,
        fontWeight: 500,
        textAlign: 'right'
      }
    }, h.line))), React.createElement("span", {
      style: {
        fontSize: 12,
        color: sub
      }
    }, "Open any of the last ", RD_LOG_BACK_DAYS, " days from the day picker above.")));
  }
  function RdDayPicker({
    value,
    history,
    onPick
  }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);
    useEffect(() => {
      if (!open) return;
      const onDoc = e => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      const onEsc = e => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', onDoc);
      window.addEventListener('keydown', onEsc, true);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        window.removeEventListener('keydown', onEsc, true);
      };
    }, [open]);
    const today = value === 0;
    const lineFor = offset => (history.find(h => h.offset === offset) || {}).line;
    return React.createElement("div", {
      ref: ref,
      style: {
        position: 'relative',
        flexShrink: 0
      }
    }, React.createElement("button", {
      type: "button",
      onClick: () => setOpen(o => !o),
      "aria-expanded": open,
      "aria-haspopup": "menu",
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 40,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: `1px solid ${today ? 'var(--sd-colour-border-default)' : 'var(--sd-colour-action-primary)'}`,
        background: today ? 'var(--sd-colour-surface-default)' : 'var(--sd-colour-surface-cyan)',
        color: today ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-action-primary)',
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 16
    }), (RD_LOG_DAYS[value] || RD_LOG_DAYS[0]).day, React.createElement("span", {
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 14
    }))), open && React.createElement("div", {
      role: "menu",
      style: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        zIndex: 20,
        width: 280,
        maxHeight: 340,
        overflowY: 'auto',
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 16px 40px rgba(0,40,34,0.22)',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, RD_LOG_DAYS.map(d => {
      const on = d.offset === value;
      const line = d.offset === 0 ? 'Live — today’s record' : lineFor(d.offset);
      return React.createElement("button", {
        key: d.offset,
        type: "button",
        role: "menuitemradio",
        "aria-checked": on,
        onClick: () => {
          onPick(d.offset);
          setOpen(false);
        },
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: '8px 11px',
          borderRadius: 'var(--sd-radius-m)',
          background: on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          color: on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13.5,
          fontWeight: 700
        }
      }, d.day), line && React.createElement("span", {
        style: {
          fontSize: 11.5,
          fontWeight: 500,
          color: 'var(--sd-colour-text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%'
        }
      }, line));
    }), React.createElement("span", {
      style: {
        fontSize: 11.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)',
        padding: '8px 11px 2px'
      }
    }, "The room tablet keeps the last ", RD_LOG_BACK_DAYS, " days. Anything older is read from Office.")));
  }
  function RdContactCard({
    person,
    open,
    onToggle
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const held = (person.auths || []).filter(a => a.on);
    const name = rdCap(person.name, 80);
    const phone = rdCap(person.phone, 32).trim();
    const email = rdCap(person.email, 254).trim();
    const link = (href, glyph, text, label) => href ? React.createElement("a", {
      href: href,
      "aria-label": label,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 44,
        maxWidth: '100%',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-link)',
        textDecoration: 'none'
      }
    }, React.createElement(SdIcon, {
      name: glyph,
      size: 15
    }), React.createElement("span", {
      style: {
        minWidth: 0,
        overflowWrap: 'anywhere'
      }
    }, text)) : React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 44,
        maxWidth: '100%',
        fontSize: 13,
        fontWeight: 500,
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: glyph,
      size: 15
    }), React.createElement("span", {
      style: {
        minWidth: 0,
        overflowWrap: 'anywhere'
      }
    }, text));
    return React.createElement("div", {
      className: "ds-accordion__item"
    }, React.createElement("h4", {
      className: "ds-accordion__heading"
    }, React.createElement("button", {
      type: "button",
      className: "ds-accordion__header",
      "aria-expanded": open,
      onClick: onToggle
    }, React.createElement("span", {
      className: "ds-accordion__title",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        minWidth: 0,
        flex: 1
      }
    }, React.createElement(RdAvatar, {
      name: name,
      size: 36
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }, name), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: sub
      }
    }, person.rel), person.noCollect && React.createElement("span", {
      style: {
        marginTop: 3
      }
    }, React.createElement("span", {
      className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal"
    }, "Not permitted to collect")))), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: sub,
        flexShrink: 0,
        whiteSpace: 'nowrap'
      }
    }, held.length, " of ", (person.auths || []).length), React.createElement("span", {
      className: "ds-accordion__chevron",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 16
    })))), (phone || email) && React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 20,
        rowGap: 0,
        padding: '0 var(--sd-spacing-4) 2px calc(var(--sd-spacing-4) + 47px)'
      }
    }, phone && link(rdTelHref(phone), 'phone', phone, `Call ${name} on ${phone}`), email && link(rdMailHref(email), 'mail', email, `Email ${name} at ${email}`)), React.createElement("div", {
      className: 'ds-accordion__panel' + (open ? ' ds-accordion__panel--open' : ''),
      inert: open ? undefined : ''
    }, React.createElement("div", {
      className: "ds-accordion__panel-inner"
    }, React.createElement("div", {
      className: "ds-accordion__body"
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, (person.auths || []).map(a => React.createElement("div", {
      key: a.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        fontSize: 13
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        color: a.on ? 'var(--sd-colour-action-primary)' : sub,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: a.on ? 'tick' : 'close',
      size: 15
    })), React.createElement("span", {
      style: {
        fontWeight: a.on ? 600 : 500,
        color: a.on ? 'var(--sd-colour-text-primary)' : sub
      }
    }, a.label), !a.on && React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: sub
      }
    }, a.key === 'pickup' && person.noCollect ? 'Restricted — see Health & safety' : 'Not authorised')))), React.createElement("span", {
      style: {
        display: 'block',
        marginTop: 10,
        fontSize: 12,
        color: sub
      }
    }, "Authorisations are set in Office \u2014 this profile reads them.")))));
  }
  function RdProfileSheet({
    child,
    readOnly,
    split,
    offline = false,
    onOpenRecord,
    onClose,
    covered = false,
    onSign,
    onAbsent,
    pendingAtt = false
  }) {
    const [openContact, setOpenContact] = useState(null);
    const [dayOffset, setDayOffset] = useState(0);
    const [logCat, setLogCat] = useState('all');
    const [active, setActive] = useState(null);
    const scroller = useRef(null);
    const coveredRef = useRef(false);
    coveredRef.current = covered;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape' && !coveredRef.current && !document.querySelector('[role="menu"]')) onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    useEffect(() => {
      const opener = document.activeElement;
      return () => {
        if (opener && opener !== document.body && opener.isConnected && typeof opener.focus === 'function') opener.focus({
          preventScroll: true
        });
      };
    }, []);
    const p = rdProfile(child);
    const sub = 'var(--sd-colour-text-secondary)';
    const line = '1px solid var(--sd-colour-border-default)';
    const hair = '1px solid var(--sd-colour-border-subtle)';
    const roomName = (RD_ROOMS.find(r => r.key === child.room) || {}).name || '—';
    const first = child.name.split(' ')[0];
    const meds = child.meds || [];
    const ongoing = meds.filter(m => m.ongoing);
    const tags = child.tags || [];
    const shortName = n => String(n).replace(/\s*\([^)]*\)\s*$/, '');
    const allergens = tags.filter(t => /allerg(y|ies)/i.test(t)).map(t => t.replace(/\s*allerg(y|ies)\s*$/i, '').toLowerCase()).filter(Boolean);
    const rescue = null;
    const medFor = tag => {
      const key = String(tag).split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return key ? ongoing.find(m => new RegExp(key, 'i').test(m.auth || '')) || null : null;
    };
    const flags = [];
    if (rdTone({
      anaphylaxis: child.anaphylaxis
    }) === 'crit') {
      const bits = rescue ? [`${rescue.auth} on file`, `${shortName(rescue.name)} travels with ${first}`, ...(/000/.test(rescue.window || '') ? ['call 000 after giving'] : [])] : ['Action plan on file'];
      flags.push({
        tone: 'crit',
        mark: 'warning',
        title: 'EpiPen / Anapen',
        meta: bits.join(' · '),
        action: null
      });
    }
    if (child.collect) {
      const k = child.collect;
      flags.push({
        tone: rdTone({
          collect: k
        }),
        mark: 'lock',
        title: `${rdCollectLabel(k)} — ${k.who} can’t collect`,
        meta: [k.note, k.courtOrder ? `Court order held by the office${k.onFile ? ` · ${k.onFile}` : ''}.` : null].filter(Boolean).join(' '),
        action: null
      });
    }
    tags.forEach(t => {
      if (rdIsDietaryTag(t)) return;
      const tone = rdTone({
        tag: t
      }, child);
      if (tone === 'crit') return;
      const m = medFor(t);
      flags.push({
        tone,
        mark: m ? 'badge-med' : 'warning',
        title: t,
        meta: m ? `${m.auth} on file · ${shortName(m.name)} — travels with ${first}, between rooms and on every excursion` : null,
        action: null
      });
    });
    const dietary = [...tags.filter(rdIsDietaryTag), ...(child.dietary || [])].filter((d, i, a) => a.findIndex(x => String(x).toLowerCase() === String(d).toLowerCase()) === i);
    if (dietary.length) flags.push(dietary.some(d => !rdDietPref(d)) ? {
      tone: 'warn',
      mark: 'warning',
      title: 'Dietary requirements',
      meta: dietary.map(d => rdCap(d, 60)).join(' · '),
      action: null
    } : {
      tone: 'calm',
      mark: 'colour/knifr-fork',
      title: 'Dietary requirements',
      meta: dietary.map(d => rdCap(d, 60)).join(' · '),
      action: null
    });
    if (child.disability) flags.push({
      tone: 'calm',
      mark: 'user',
      title: 'Additional needs',
      meta: rdCap(child.disabilityNote, 400) || 'Recorded on the enrolment record.',
      action: null
    });
    const flagRow = (f, i) => f.tone === 'calm' ? React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '6px 2px'
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        marginTop: 1,
        color: sub,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: f.mark,
      size: 18
    })), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.4
      }
    }, f.title), f.meta && React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: sub
      }
    }, f.meta))) : React.createElement("div", {
      key: i,
      className: `ds-message-box${RD_TONE[f.tone].box}`,
      "data-tone": f.tone
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: f.mark,
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, f.title))), f.meta && React.createElement("p", {
      className: "ds-message-box__body"
    }, f.meta)), f.action && React.createElement("button", {
      type: "button",
      className: "ds-message-box__action",
      onClick: () => jump('docs')
    }, f.action));
    const emptyBlock = text => React.createElement("div", {
      style: {
        padding: '13px 15px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-grey)',
        fontSize: 13.5,
        lineHeight: 1.5,
        color: sub
      }
    }, text);
    const medCard = m => {
      const e = rdMedExpiry(m);
      const bad = !!(e && (e.expired || e.soon));
      const statusText = bad ? e.label : m.ongoing ? 'Ongoing' : 'Short course';
      const statusCls = bad ? 'ds-pill--orange' : m.ongoing ? 'ds-pill--orange' : 'ds-pill--grey';
      const critWindow = /anaphylaxis|000/i.test(m.window || '');
      const prov = [m.auth, `${m.authBy}, ${m.authOn}`, !bad && e ? e.label.charAt(0).toLowerCase() + e.label.slice(1) : null].filter(Boolean).join(' · ');
      return React.createElement("div", {
        key: m.name,
        style: {
          border: line,
          borderRadius: 'var(--sd-radius-lg)',
          padding: '13px 15px',
          display: 'flex',
          flexDirection: 'column'
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 10
        }
      }, React.createElement("span", {
        style: {
          fontSize: 15,
          fontWeight: 700
        }
      }, m.name), React.createElement("span", {
        className: `ds-pill ds-pill--xs ${statusCls} ds-pill--minimal`
      }, statusText)), React.createElement("span", {
        style: {
          marginTop: 3,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--sd-colour-text-primary)'
        }
      }, m.dose, m.route ? React.createElement("span", {
        style: {
          fontWeight: 500,
          color: sub
        }
      }, " \xB7 ", m.route) : ''), m.ongoing && m.kept && React.createElement("span", {
        style: {
          marginTop: 9,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13,
          color: sub
        }
      }, React.createElement("span", {
        style: {
          flexShrink: 0,
          display: 'inline-flex',
          opacity: 0.6
        }
      }, React.createElement(SdIcon, {
        name: "bag",
        size: 15
      })), `${m.kept.charAt(0).toUpperCase() + m.kept.slice(1)} — travels with ${first}`), m.window && React.createElement("span", {
        style: {
          marginTop: 10,
          padding: '8px 11px',
          borderRadius: 'var(--sd-radius-m)',
          fontSize: 13.5,
          fontWeight: 600,
          background: critWindow ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-orange)',
          color: critWindow ? 'var(--sd-colour-text-on-red)' : 'var(--sd-colour-text-on-orange)'
        }
      }, m.window), React.createElement("span", {
        style: {
          marginTop: 9,
          fontSize: 12,
          lineHeight: 1.45,
          color: sub
        }
      }, prov), bad && React.createElement("span", {
        style: {
          marginTop: 4,
          fontSize: 12.5,
          fontWeight: 700,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-on-orange)'
        }
      }, e.expired ? 'A dose can still be recorded, and will be flagged.' : 'Ask the office to renew it.'));
    };
    const collectorsAll = {
      may: rdCollectors(child),
      barred: rdCollectBarred(child),
      others: rdCollectOthers(child)
    };
    const hubUnknown = offline && svcOn('visitors');
    const collectors = hubUnknown ? {
      ...collectorsAll,
      may: collectorsAll.may.filter(x => x.source !== 'hub')
    } : collectorsAll;
    const collectStrip = React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '11px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-grey)'
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        marginTop: 1,
        display: 'inline-flex',
        color: collectors.may.length && !hubUnknown ? 'var(--sd-colour-action-primary)' : sub
      }
    }, React.createElement(SdIcon, {
      name: hubUnknown ? 'user-multiple' : collectors.may.length ? 'tick' : 'warning',
      size: 17
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: sub
      }
    }, "May collect today"), collectors.may.length ? React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }
    }, collectors.may.map(x => React.createElement("span", {
      key: `${x.source}-${x.name}`,
      style: {
        fontSize: 14,
        lineHeight: 1.5,
        overflowWrap: 'anywhere'
      }
    }, React.createElement("b", {
      style: {
        fontWeight: 700
      }
    }, rdCap(x.name, 80)), React.createElement("span", {
      style: {
        fontWeight: 500,
        color: sub
      }
    }, " \xB7 ", rdCap(x.rel, 40))))) : React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5
      }
    }, "No one on the record holds the pickup permission. Ask the office before ", first, " goes home."), !!collectors.barred.length && React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.45,
        color: sub
      }
    }, "Not permitted: ", collectors.barred.map(x => rdCap(x.name, 80)).join(' · ')), !!collectors.others.length && React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.45,
        color: sub
      }
    }, "Not on the pickup list: ", collectors.others.map(rdCollectorLabel).join(' · '))));
    const facts = [['Born', child.dob ? `${rdDobText(child.dob)} · ${rdAgeText(child)}` : null], ['School', child.school ? rdCap(child.school, 80) : null], ['Grade', child.grade && !child.kinder ? rdCap(String(child.grade).replace(/^Grade\s+/i, ''), 40) : null], ['Class', child.class ? rdCap(child.class, 40) : null], ['Kinder', child.kinder ? rdCap(child.kinder, 40) : null], ['Photos and video', rdConsent(child) ? 'Consent given' : 'No consent on record']].filter(([, v]) => v);
    const medExpired = meds.filter(m => (rdMedExpiry(m) || {}).expired).length;
    const medSoon = meds.filter(m => (rdMedExpiry(m) || {}).soon).length;
    const medPill = medExpired ? `${medExpired} expired` : medSoon ? `${medSoon} expiring` : null;
    const tile = split ? {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 10,
      alignItems: 'start'
    } : {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    };
    const logPast = dayOffset > 0;
    const logCount = rdTimeline(child, dayOffset).length;
    const logDay = (RD_LOG_DAYS[dayOffset] || RD_LOG_DAYS[0]).day;
    const logTitle = logPast ? `${logDay} · log` : 'Today’s log';
    const glance = logPast ? [] : child.last || [];
    const glanceLabel = k => k === 'meal' ? 'Last meal' : k === 'nappy' ? 'Last nappy' : RD_EVENT_LABEL[k] || k;
    const dayRows = rdTimeline(child, dayOffset);
    const catCounts = {
      all: dayRows.length
    };
    RD_LOG_CATS.forEach(k => {
      catCounts[k.key] = dayRows.filter(e => rdLogIn(e, k.key)).length;
    });
    const catOptions = [{
      key: 'all',
      label: 'All events'
    }, ...RD_LOG_CATS.filter(k => catCounts[k.key] > 0 || k.key === logCat)];
    const catFilter = catOptions.length > 2 && (dayRows.length >= 6 || logCat !== 'all') ? React.createElement("span", {
      style: {
        display: 'flex'
      }
    }, React.createElement(RdSheetMenus.Provider, {
      value: !split
    }, React.createElement(RdDropdown, {
      label: "Show",
      value: logCat,
      options: catOptions,
      counts: catCounts,
      onChange: setLogCat,
      defaultKey: "all"
    }))) : null;
    const logBody = React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, !!glance.length && React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: split ? 'repeat(auto-fit, minmax(150px, 1fr))' : '1fr 1fr',
        gap: 9
      }
    }, glance.map(([kind, at, detail,,,, rec]) => React.createElement("div", {
      key: kind,
      style: {
        border: line,
        borderRadius: 'var(--sd-radius-lg)',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: sub
      }
    }, glanceLabel(kind)), React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700
      }
    }, RD_AMPM(at), !readOnly && rdAgo(at) && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: sub
      }
    }, " \xB7 ", rdAgo(at))), detail && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: sub
      }
    }, detail), kind === 'sleep' && rec && React.createElement(RdSleepRecord, {
      rec: rec,
      compact: true,
      style: {
        fontSize: 12,
        lineHeight: '17px',
        color: sub
      }
    })))), catFilter, React.createElement(RdEventLog, {
      child: child,
      history: p.history,
      dayOffset: dayOffset,
      onOpenRecord: onOpenRecord,
      hideHeading: true,
      cat: logCat,
      onCat: setLogCat
    }));
    const secs = [{
      id: 'health',
      mark: 'health',
      nav: 'Health & safety',
      title: 'Health & safety',
      badge: flags.length || '—',
      dot: ['crit', 'warn', 'restrict'].find(t => flags.some(f => f.tone === t)) || null,
      body: flags.length ? React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, flags.map(flagRow)) : emptyBlock('No allergies, medical conditions or additional needs recorded.')
    }, {
      id: 'meds',
      mark: 'badge-med',
      nav: 'Medication',
      title: 'Medication & action plans',
      pill: medPill,
      badge: meds.length || '—',
      dot: medPill ? 'warn' : null,
      body: React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }
      }, meds.length ? React.createElement("div", {
        style: tile
      }, meds.map(medCard)) : React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          padding: '13px 15px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-grey)'
        }
      }, React.createElement("span", {
        style: {
          color: sub,
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "document",
        size: 17
      })), React.createElement("span", {
        style: {
          fontSize: 13.5,
          lineHeight: 1.45,
          fontWeight: child.medication ? 600 : 400,
          color: child.medication ? undefined : sub
        }
      }, child.medication ? 'No authorisation on file here. A dose can still be recorded — the service may hold a paper form.' : 'No medication on file.')), React.createElement("span", {
        style: {
          fontSize: 12,
          lineHeight: 1.45,
          color: sub
        }
      }, "Authorisations are added in Office. This profile reads them."))
    }, {
      id: 'guardians',
      mark: 'user',
      nav: 'Guardians',
      title: 'Parents & guardians',
      badge: p.guardians.length,
      dot: child.collect ? 'restrict' : null,
      body: React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }
      }, hubUnknown && React.createElement(RdBlockedNote, {
        text: "The visitor hub\u2019s list isn\u2019t available offline. If someone who isn\u2019t named here arrives, ask the office."
      }), collectStrip, React.createElement("div", {
        style: tile
      }, p.guardians.map(g => React.createElement("div", {
        key: g.name,
        className: "ds-accordion ds-accordion--separated"
      }, React.createElement(RdContactCard, {
        person: g,
        open: openContact === g.name,
        onToggle: () => setOpenContact(o => o === g.name ? null : g.name)
      })))))
    }, {
      id: 'emergency',
      mark: 'phone',
      nav: 'Emergency',
      title: p.emergencies.length > 1 ? 'Emergency contacts' : 'Emergency contact',
      badge: p.emergencies.length,
      body: React.createElement("div", {
        style: tile
      }, p.emergencies.map(e => React.createElement("div", {
        key: e.name,
        className: "ds-accordion ds-accordion--separated"
      }, React.createElement(RdContactCard, {
        person: e,
        open: openContact === e.name,
        onToggle: () => setOpenContact(o => o === e.name ? null : e.name)
      }))))
    }, {
      id: 'about',
      mark: 'book-edit',
      nav: `About ${first}`,
      title: `About ${first}`,
      body: React.createElement("div", {
        style: {
          maxWidth: 660,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 700,
          color: sub
        }
      }, "From the office"), React.createElement("span", {
        className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal"
      }, "Read-only")), React.createElement("dl", {
        style: {
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '4px 2px 6px'
        }
      }, facts.map(([k, v]) => React.createElement("div", {
        key: k,
        style: {
          display: 'flex',
          gap: 14,
          alignItems: 'baseline'
        }
      }, React.createElement("dt", {
        style: {
          width: 118,
          flexShrink: 0,
          fontSize: 12.5,
          fontWeight: 700,
          color: sub
        }
      }, k), React.createElement("dd", {
        style: {
          margin: 0,
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          lineHeight: '20px',
          fontWeight: 600,
          overflowWrap: 'anywhere'
        }
      }, v)))), React.createElement("div", {
        style: {
          padding: '13px 15px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-grey)',
          fontSize: 14.5,
          lineHeight: 1.55
        }
      }, p.about), p.special && React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: '12px 15px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-grey)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 700,
          color: sub
        }
      }, "Special considerations"), React.createElement("span", {
        style: {
          fontSize: 14.5,
          lineHeight: 1.55
        }
      }, p.special)), React.createElement("span", {
        style: {
          fontSize: 12,
          lineHeight: 1.45,
          color: sub
        }
      }, "Written in Office. To change it, ask the office."))
    }, {
      id: 'docs',
      mark: 'document',
      nav: 'Documents',
      title: 'Documents',
      badge: p.attachments.length,
      body: React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }
      }, React.createElement("div", {
        style: tile
      }, p.attachments.map(a => {
        const missing = a.type === 'Missing';
        return React.createElement("div", {
          key: a.name,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '11px 13px',
            borderRadius: 'var(--sd-radius-lg)',
            border: line,
            opacity: missing ? 0.7 : 1
          }
        }, React.createElement("span", {
          style: {
            color: missing ? sub : 'var(--sd-colour-action-primary)',
            flexShrink: 0
          }
        }, React.createElement(SdIcon, {
          name: "document",
          size: 18
        })), React.createElement("span", {
          style: {
            fontSize: 13.5,
            fontWeight: 600,
            flex: 1,
            minWidth: 0
          }
        }, a.name), React.createElement("span", {
          style: {
            fontSize: 12,
            fontWeight: 600,
            color: sub,
            whiteSpace: 'nowrap'
          }
        }, a.type, a.updated !== '—' ? ` · ${a.updated}` : ''));
      })), React.createElement("span", {
        style: {
          fontSize: 12,
          color: sub
        }
      }, "Preview and download aren\u2019t wired up in the prototype."))
    }, {
      id: 'log',
      mark: 'time',
      nav: logTitle,
      title: logTitle,
      rule: true,
      badge: logCount,
      notes: (logCount ? [`${logCount} ${logCount === 1 ? 'event' : 'events'}`] : []).concat(logPast ? ['Closed record'] : []),
      body: logBody
    }];
    useEffect(() => {
      const el = scroller.current;
      if (!el) return;
      const spy = () => {
        const base = el.getBoundingClientRect().top;
        const nodes = el.querySelectorAll('[data-sec]');
        if (!nodes.length) return;
        let cur = nodes[0].getAttribute('data-sec');
        nodes.forEach(n => {
          if (n.getBoundingClientRect().top - base <= 48) cur = n.getAttribute('data-sec');
        });
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) cur = nodes[nodes.length - 1].getAttribute('data-sec');
        setActive(cur);
      };
      spy();
      el.addEventListener('scroll', spy, {
        passive: true
      });
      return () => el.removeEventListener('scroll', spy);
    }, [split, child, dayOffset, openContact]);
    const jump = id => {
      const el = scroller.current;
      const n = el && el.querySelector(`[data-sec="${id}"]`);
      if (!n) return;
      const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({
        top: el.scrollTop + (n.getBoundingClientRect().top - el.getBoundingClientRect().top) - 4,
        behavior: still ? 'auto' : 'smooth'
      });
      setActive(id);
    };
    const navRow = s => {
      const on = active === s.id;
      return React.createElement("button", {
        key: s.id,
        type: "button",
        className: "fp-btn",
        onClick: () => jump(s.id),
        "aria-current": on ? 'true' : undefined,
        "aria-label": `${s.nav}${s.dot ? `, ${RD_TONE[s.dot].nav}` : ''}`,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          minHeight: 44,
          padding: '9px 11px',
          borderRadius: 'var(--sd-radius-lg)',
          background: on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          color: on ? 'var(--sd-colour-text-primary)' : sub,
          fontSize: 13.5,
          fontWeight: on ? 700 : 600
        }
      }, React.createElement("span", {
        style: {
          flexShrink: 0,
          display: 'inline-flex',
          color: on ? 'var(--sd-colour-action-primary)' : 'inherit',
          opacity: on ? 1 : 0.65
        }
      }, React.createElement(SdIcon, {
        name: s.mark,
        size: 16
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, s.nav), s.dot === 'crit' && React.createElement("span", {
        "aria-hidden": "true",
        "data-tone": "crit",
        style: {
          flexShrink: 0,
          display: 'inline-flex',
          color: RD_TONE.crit.mark
        }
      }, React.createElement(SdIcon, {
        name: "warning",
        size: 14
      })), (s.dot === 'warn' || s.dot === 'restrict') && React.createElement("span", {
        "aria-hidden": "true",
        "data-tone": s.dot,
        style: {
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: 'var(--sd-radius-full)',
          background: RD_TONE[s.dot].mark
        }
      }), s.badge != null && React.createElement("span", {
        style: {
          fontSize: 11.5,
          fontWeight: 700,
          color: sub,
          flexShrink: 0
        }
      }, s.badge));
    };
    const crit = flags.find(f => f.tone === 'crit') || null;
    const critStrip = crit && React.createElement("div", {
      "data-tone": "crit",
      style: {
        flexShrink: 0,
        display: 'flex',
        flexWrap: split ? 'nowrap' : 'wrap',
        alignItems: 'center',
        columnGap: 10,
        rowGap: 2,
        margin: split ? '0 22px 12px' : '0 16px 12px',
        padding: '9px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)',
        color: 'var(--sd-colour-text-on-red)'
      }
    }, React.createElement("span", {
      style: {
        color: RD_TONE.crit.mark,
        flexShrink: 0,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 17
    })), React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        flexShrink: 0
      }
    }, crit.title), rescue && React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 500,
        minWidth: 0,
        ...(split ? {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        } : {})
      }
    }, "\xB7 ", `${shortName(rescue.name)} ${rescue.kept || 'on file'}`, /000/.test(rescue.window || '') ? ' · call 000' : ''), React.createElement("span", {
      style: {
        flex: 1
      }
    }), split && React.createElement("button", {
      type: "button",
      className: "fp-btn",
      onClick: () => jump('health'),
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 44,
        margin: '-10px 0'
      }
    }, React.createElement("span", {
      style: {
        padding: '3px 11px',
        borderRadius: 'var(--sd-radius-full)',
        border: '1px solid currentColor',
        fontSize: 12,
        fontWeight: 700
      }
    }, "Details")));
    const st = child.status;
    const absentAt = st === 'absent' ? ([...rdAttOf(child)].reverse().find(e => e.kind === 'absent') || {}).at : null;
    const attBtns = !readOnly && dayOffset === 0 && onSign && (st === 'expected' || st === 'other' || st === 'here' || st === 'gone' || st === 'absent') ? React.createElement("span", {
      style: {
        display: 'flex',
        gap: 8,
        ...(split ? {
          flexShrink: 0
        } : {
          flexBasis: '100%'
        })
      }
    }, st === 'expected' && onAbsent && React.createElement(RdAction, {
      glyph: "close",
      small: split,
      grow: !split,
      onClick: onAbsent
    }, "Mark absent"), (st === 'expected' || st === 'other' || st === 'absent') && React.createElement(RdAction, {
      glyph: "signin",
      primary: true,
      small: split,
      grow: !split,
      onClick: () => onSign('in')
    }, "Sign in ", first), st === 'here' && React.createElement(RdAction, {
      glyph: "signout",
      small: split,
      grow: !split,
      onClick: () => onSign('out')
    }, "Sign out"), st === 'gone' && React.createElement(RdAction, {
      glyph: "signin",
      primary: true,
      small: split,
      grow: !split,
      onClick: () => onSign('in')
    }, "Sign in ", first, " again")) : null;
    const signedIns = rdAttOf(child).filter(e => e.kind === 'in');
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 42,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      style: {
        padding: split ? '16px 22px 14px' : '14px 16px 12px',
        display: 'flex',
        flexWrap: split ? 'nowrap' : 'wrap',
        alignItems: 'center',
        columnGap: 14,
        rowGap: 10,
        flexShrink: 0
      }
    }, React.createElement(RdKid, {
      c: child,
      size: 52
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 10,
        rowGap: 4,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        minWidth: 0,
        ...(split ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        } : {
          overflowWrap: 'anywhere'
        })
      }
    }, child.name), !rdConsent(child) && React.createElement(RdConsentPill, {
      c: child
    })), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub,
        ...(split ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        } : {})
      }
    }, rdAgeText(child), " \xB7 ", roomName, dayOffset > 0 ? '' : child.status === 'here' ? signedIns.length > 1 ? ` · back\u00a0${RD_AMPM(child.at)}, first\u00a0in\u00a0${RD_AMPM(signedIns[0].at)}` : ` · here\u00a0since\u00a0${RD_AMPM(child.at)}` : child.status === 'gone' ? ` · signed\u00a0out\u00a0${RD_AMPM(child.at)}` : absentAt ? ` · marked\u00a0absent\u00a0${RD_AMPM(absentAt)}` : ''), pendingAtt && dayOffset === 0 && React.createElement("span", {
      style: {
        alignSelf: 'flex-start'
      }
    }, React.createElement(RdPendingTag, null, "Waiting to send"))), split && attBtns, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        ...(split ? {} : {
          flexBasis: '100%'
        })
      }
    }, React.createElement(RdDayPicker, {
      value: dayOffset,
      history: p.history,
      onPick: d => {
        setDayOffset(d);
        setLogCat('all');
      }
    }), !split && React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement("button", {
      type: "button",
      "aria-label": "Close full profile",
      onClick: onClose,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
        padding: '8px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: line,
        color: 'var(--sd-colour-text-primary)',
        fontSize: 13,
        fontWeight: 700
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 16
    }), "Close"))), critStrip, React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
        borderTop: hair
      }
    }, split && React.createElement("nav", {
      "aria-label": `${child.name}’s profile`,
      style: {
        width: 218,
        boxSizing: 'border-box',
        flexShrink: 0,
        minHeight: 0,
        overflowY: 'auto',
        padding: '14px 12px 24px',
        borderRight: hair,
        background: 'var(--sd-colour-surface-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, secs.map(s => s.rule ? React.createElement(React.Fragment, {
      key: s.id + '-rule'
    }, React.createElement("hr", {
      style: {
        border: 0,
        borderTop: hair,
        margin: '10px 6px',
        width: '100%'
      }
    }), navRow(s)) : navRow(s))), React.createElement("div", {
      ref: scroller,
      style: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflowY: 'auto',
        padding: split ? '4px 26px 40px' : '4px 22px 40px'
      }
    }, !split && attBtns && React.createElement("div", {
      style: {
        display: 'flex',
        padding: '14px 0 0'
      }
    }, attBtns), secs.map((s, i) => React.createElement("section", {
      key: s.id,
      "data-sec": s.id,
      style: {
        padding: '20px 0',
        borderBottom: i === secs.length - 1 ? 0 : hair
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        marginBottom: 14,
        minHeight: 20
      }
    }, React.createElement(RdLabel, null, s.title), !!s.pill && React.createElement("span", {
      className: "ds-pill ds-pill--xs ds-pill--orange ds-pill--minimal"
    }, s.pill), (s.notes || []).map(n => React.createElement("span", {
      key: n,
      className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal"
    }, n))), s.body)))));
  }
  function RdPaneRoom({
    r,
    showStaff,
    wide,
    onClose,
    onOpenRoom
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const breach = showStaff && !r.ratioOk;
    return React.createElement(RdPaneShell, {
      wide: wide,
      title: "Room",
      onClose: onClose,
      footer: React.createElement(React.Fragment, null, React.createElement(RdAction, {
        glyph: 'chevron-right',
        primary: true,
        full: true,
        onClick: onOpenRoom
      }, "Open ", r.name))
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement("span", {
      style: {
        width: 54,
        height: 54,
        borderRadius: 'var(--sd-radius-lg)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)',
        fontWeight: 700,
        fontSize: 20
      }
    }, r.name[0]), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, r.name), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, r.ages))), breach && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700
      }
    }, "Over ratio"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.4,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, r.signed, " children to ", r.educators, " educator", r.educators === 1 ? '' : 's', " is 1:", r.ratio, ". This room needs 1:", r.limit, "."))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Attendance"), [svcOn('attendance') ? ['Signed in', `${r.signed} of ${r.booked}`] : ['Children', String(r.signed)], ['Educators required', String(r.staffRequired)], ...(showStaff ? [['Educators on floor', String(r.educators)], ['Ratio', `1:${r.ratio}` + (breach ? ` (limit 1:${r.limit})` : '')]] : []), ['Checks due', String(r.due)]].map(([k, v]) => React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13.5,
        padding: '3px 0'
      }
    }, React.createElement("span", {
      style: {
        color: sub,
        fontWeight: 500
      }
    }, k), React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, v)))));
  }
  function RdEmpty({
    query,
    scope
  }) {
    const title = query ? `No matches for “${query}”.` : 'No children booked here today.';
    const sub = query ? 'Try a first or last name, or a health flag like “allergy”.' : scope === 'room' ? 'When bookings are made they’ll appear on the roll. A child who turns up without one can still be signed in from Other below.' : 'When bookings are made across the service they’ll appear here.';
    return React.createElement("div", {
      style: {
        padding: '44px 18px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, title), React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        maxWidth: 320,
        alignSelf: 'center'
      }
    }, sub));
  }
  const RdChangedCtx = React.createContext(null);
  function RdOtherAccordion({
    items,
    open,
    onToggle,
    renderRow
  }) {
    return React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("button", {
      type: "button",
      onClick: onToggle,
      "aria-expanded": open,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        transform: open ? 'rotate(90deg)' : 'none',
        transition: 'transform .15s',
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    })), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Other"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, items.length), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "\xB7 no booking today")), open && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, items.map(renderRow)));
  }
  function RdWorkArea({
    d,
    arrangement,
    pad
  }) {
    const [otherOpen, setOtherOpen] = useState(false);
    const [batchOpen, setBatchOpen] = useState(false);
    useEffect(() => {
      if (!d.tickedCount) setBatchOpen(false);
    }, [d.tickedCount]);
    const phoneBar = arrangement === 'none';
    const [viewOpen, setViewOpen] = useState(false);
    const split = arrangement !== 'none';
    const bottom = arrangement === 'bottom';
    const compact = arrangement === 'none' || arrangement === 'side-portrait';
    const side = arrangement === 'side' || arrangement === 'side-portrait';
    const list = React.createElement("div", {
      style: {
        flex: side ? '2 1 0' : '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 10,
        minHeight: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0
      }
    }, d.views && React.createElement(RdSegmented, {
      options: d.views,
      value: d.view,
      onChange: d.setView,
      variant: "raised",
      ariaLabel: "What to show"
    }), React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement(RdSearch, {
      value: d.query,
      onChange: d.setQuery,
      count: d.shownCount,
      placeholder: d.searchPlaceholder,
      compact: compact
    })), phoneBar && (d.showGrouping || d.showFilter) && React.createElement(RdViewButton, {
      d: d,
      onOpen: () => setViewOpen(true)
    })), (d.showGrouping || d.showFilter) && React.createElement(RdFilterBar, {
      d: d,
      compact: compact,
      phone: phoneBar
    }), viewOpen && phoneBar && React.createElement(RdViewSheet, {
      d: d,
      onClose: () => setViewOpen(false)
    }), React.createElement(RdFreshness, {
      d: d
    }), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, (() => {
      const renderItem = it => it.__room ? React.createElement(RdRoomRow, {
        key: it.key,
        r: it,
        showStaff: d.showStaff,
        compact: compact,
        selected: d.selectedRoom && d.selectedRoom.key === it.key,
        onOpen: () => d.openRoom(it)
      }) : React.createElement(RdChildRow, {
        key: it.id,
        c: it,
        selectMode: !!d.tickedCount,
        ticked: d.isTicked(it),
        alwaysSelect: d.alwaysSelect,
        onTick: d.toggleTick,
        selected: d.selected && d.selected.id === it.id,
        showRoom: d.scope === 'service',
        roomName: d.roomNameOf(it),
        compact: compact,
        rowDetail: d.rowDetail,
        hideTag: d.grouping === RD_TAG_GROUPING,
        showSlept: d.grouping === 'sleep',
        showSun: d.grouping === 'sun',
        noAgo: !!d.readOnly,
        pendingAtt: !!d.isPendingEvent && d.isPendingEvent(it, 'attendance'),
        onOpen: () => d.tickedCount ? d.toggleTick(it) : d.openChild(it),
        onLongPress: d.longPressChild
      });
      const rows = items => React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, items.map(renderItem));
      if (d.bands) {
        return d.bands.length ? d.bands.map(b => React.createElement("section", {
          key: b.key,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, React.createElement(RdGroupHead, {
          label: b.label,
          count: b.items.length,
          total: d.totalFor && d.totalFor(b.key),
          action: d.bandAction && d.bandAction(b),
          compact: compact
        }), b.sections.map(sec => React.createElement(React.Fragment, {
          key: sec.key
        }, sec.label && React.createElement(RdGroupHead, {
          sub: true,
          label: sec.label,
          count: sec.items.length,
          total: d.totalFor && d.totalFor(sec.key),
          action: d.sectionAction && d.sectionAction(b, sec),
          compact: compact
        }), rows(sec.items))))) : React.createElement(RdEmpty, {
          query: d.query,
          scope: d.scope
        });
      }
      return d.work.length ? d.work.map(g => {
        const open = !g.label || !d.groupOpen || d.groupOpen(g.key);
        return React.createElement("section", {
          key: g.key,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, g.label && React.createElement(RdGroupHead, {
          label: g.label,
          count: g.items.length,
          action: d.groupAction && d.groupAction(g),
          compact: compact,
          open: open,
          onToggle: d.toggleGroup ? () => d.toggleGroup(g.key) : undefined
        }), open && rows(g.items));
      }) : React.createElement(RdEmpty, {
        query: d.query,
        scope: d.scope
      });
    })(), d.other && !!d.other.length && React.createElement(RdOtherAccordion, {
      items: d.other,
      open: otherOpen,
      onToggle: () => setOtherOpen(o => !o),
      renderRow: c => React.createElement(RdChildRow, {
        key: c.id,
        c: c,
        compact: compact,
        showRoom: c.room !== d.roomKey,
        roomName: d.roomNameOf(c),
        onOpen: () => d.openChild(c)
      })
    })));
    const pane = d.tickedCount ? React.createElement(RdPaneBatch, {
      d: d,
      wide: bottom
    }) : d.selected ? React.createElement(RdPaneChild, {
      c: d.selected,
      scope: d.scope,
      roomName: d.roomNameOf(d.selected),
      bookInto: d.scope === 'room' ? (RD_ROOMS.find(x => x.key === d.roomKey) || {}).name : null,
      wide: bottom,
      offline: d.conn === 'offline',
      isPending: d.isPendingEvent,
      readOnly: d.readOnly,
      onChooseEvent: () => d.openChooser(d.selected),
      onIncident: d.incidentsOn ? () => d.openIncident(d.selected) : undefined,
      onSign: d.canAttend ? dir => d.openSign(d.selected, dir) : undefined,
      onAbsent: d.canAttend && rdAttOn('absence') ? () => d.openBulk('absent', [d.selected.id]) : undefined,
      onOpenRecord: entry => d.openRecord(d.selected, entry),
      onProfile: () => d.openProfile(d.selected),
      onClose: () => d.openChild(null),
      onOpenRoom: () => d.goRoom(d.selected.room),
      onTag: d.canTagOne ? () => d.openTagOne(d.selected) : undefined
    }) : d.selectedRoom ? React.createElement(RdPaneRoom, {
      r: d.selectedRoom,
      showStaff: d.showStaff,
      wide: bottom,
      onClose: () => d.openRoom(null),
      onOpenRoom: () => d.goRoom(d.selectedRoom.key)
    }) : React.createElement(RdPaneNow, {
      d: d,
      wide: bottom
    });
    if (!split) {
      const batchOnly = !!d.tickedCount;
      const overlay = batchOnly ? batchOpen : !!(d.selected || d.selectedRoom);
      return React.createElement("div", {
        style: {
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }
      }, React.createElement("div", {
        style: {
          flex: 1,
          minHeight: 0,
          display: 'flex',
          padding: pad,
          position: 'relative'
        }
      }, list, overlay && React.createElement("div", {
        className: "rd-sheet",
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: 30,
          background: 'var(--sd-colour-surface-default)',
          display: 'flex',
          flexDirection: 'column'
        }
      }, batchOnly && React.createElement("button", {
        type: "button",
        onClick: () => setBatchOpen(false),
        className: "fp-btn",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 48,
          padding: '0 14px',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--sd-colour-action-primary)',
          borderBottom: '1px solid var(--sd-colour-border-default)'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-left",
        size: 18
      }), "Back to the list \xB7 ", d.tickedCount, " selected"), React.createElement("div", {
        style: {
          flex: 1,
          minHeight: 0,
          position: 'relative'
        }
      }, React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0
        }
      }, pane)))), batchOnly && !overlay && React.createElement("div", {
        role: "region",
        "aria-label": "Selection",
        style: {
          padding: '10px 12px',
          flexShrink: 0,
          borderTop: '1px solid var(--sd-colour-border-default)',
          background: 'var(--sd-colour-surface-default)'
        }
      }, React.createElement(RdAction, {
        primary: true,
        full: true,
        onClick: () => setBatchOpen(true)
      }, `Actions for ${d.tickedCount} selected`)));
    }
    return React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: bottom ? 'column' : 'row',
        gap: bottom ? 14 : 16,
        padding: pad
      }
    }, list, React.createElement("aside", {
      style: bottom ? {
        flexShrink: 0,
        height: '46%',
        minHeight: 300
      } : {
        flex: '1 1 0',
        minWidth: 260,
        maxWidth: 400,
        minHeight: 0
      }
    }, pane));
  }
  function RdActionBar({
    d,
    pad
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: pad,
        flexShrink: 0,
        borderTop: '1px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)'
      }
    }, d.lastCount && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, d.lastCount), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, d.actions.map(a => React.createElement(RdAction, {
      key: a.key,
      glyph: a.glyph,
      primary: a.primary,
      full: d.actions.length === 1,
      onClick: a.onClick,
      muted: !a.onClick
    }, a.label))));
  }
  function RdConnChip({
    conn,
    syncing,
    pending,
    synced,
    onOpen,
    compact
  }) {
    if (compact && !(conn === 'online' && !syncing && !pending && !synced)) {
      const done = conn === 'online' && !syncing && !pending && !!synced;
      const n = done ? synced : pending;
      const circle = {
        all: 'unset',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
        width: 38,
        height: 38,
        borderRadius: 'var(--sd-radius-full)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: done ? 'default' : 'pointer',
        background: done ? 'var(--sd-colour-surface-green)' : RD_SYNC_BG,
        color: done ? 'var(--sd-colour-text-on-green)' : RD_SYNC_FG
      };
      const icon = React.createElement("span", {
        className: syncing ? 'rd-spin' : undefined,
        style: {
          display: 'flex'
        }
      }, React.createElement(SdIcon, {
        name: done ? 'tick' : syncing ? 'refresh-update-arrow' : 'wifi-off',
        size: 18
      }));
      const badge = n > 0 && React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          top: -3,
          right: -3,
          minWidth: 18,
          height: 18,
          padding: '0 5px',
          boxSizing: 'border-box',
          borderRadius: 'var(--sd-radius-full)',
          background: done ? 'var(--sd-colour-text-on-green)' : RD_SYNC_DOT,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, n);
      if (done) return React.createElement("span", {
        role: "status",
        "aria-label": `All ${synced} synced`,
        style: circle
      }, icon, badge);
      return React.createElement("button", {
        type: "button",
        onClick: onOpen,
        className: "fp-btn",
        style: circle,
        "aria-label": syncing ? `Syncing ${pending} waiting to send` : conn === 'offline' ? `Offline${pending ? `, ${pending} waiting to send` : ''}` : 'Waiting to sync'
      }, React.createElement(RdHit, {
        n: 3
      }), icon, badge);
    }
    if (conn === 'online' && !syncing && !pending && synced) {
      return React.createElement("span", {
        role: "status",
        "aria-label": `All ${synced} synced`,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
          padding: '6px 13px',
          borderRadius: 'var(--sd-radius-full)',
          background: 'var(--sd-colour-surface-green)',
          color: 'var(--sd-colour-text-on-green)',
          fontSize: 12.5,
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }
      }, React.createElement(SdIcon, {
        name: "tick",
        size: 16
      }), "All ", synced, " synced");
    }
    if (conn === 'online' && !syncing && !pending) return null;
    const offline = conn === 'offline';
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      className: "fp-btn",
      "aria-label": syncing ? `Syncing ${pending} waiting to send` : offline ? `Offline${pending ? `, ${pending} waiting to send` : ''}` : 'Waiting to sync',
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
        padding: '6px 13px',
        borderRadius: 'var(--sd-radius-full)',
        background: RD_SYNC_BG,
        color: RD_SYNC_FG,
        fontSize: 12.5,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, React.createElement("span", {
      className: syncing ? 'rd-spin' : undefined,
      style: {
        display: 'flex',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: syncing ? 'refresh-update-arrow' : 'wifi-off',
      size: 16
    })), syncing ? `Syncing ${pending}…` : offline ? 'Offline' : 'Waiting to sync', !syncing && !!pending && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 19,
        height: 19,
        padding: '0 5px',
        borderRadius: 'var(--sd-radius-full)',
        background: RD_SYNC_DOT,
        color: '#fff',
        fontSize: 11.5,
        fontWeight: 700
      }
    }, pending));
  }
  function RdEmergencyDoor({
    running,
    label,
    onOpen,
    wide
  }) {
    const rest = wide ? '#fff' : 'var(--sd-colour-red-100)';
    const base = {
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      position: 'relative',
      flexShrink: 0,
      height: 38,
      color: running ? '#fff' : rest,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      borderRadius: 'var(--sd-radius-full)',
      fontSize: 13,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      background: running ? 'var(--sd-colour-red-800)' : D_FILL,
      border: `1px solid ${running ? '#fff' : wide ? D_BORDER : 'var(--sd-colour-red-100)'}`,
      ...(wide ? {
        padding: '0 14px'
      } : {
        width: 38
      })
    };
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      className: "fp-btn",
      style: base,
      "aria-label": running ? `Emergency management: ${label} is running. Go back to it` : 'Emergency management: start a count'
    }, React.createElement(RdHit, {
      n: 4
    }), React.createElement(SdIcon, {
      name: "flag",
      size: 20
    }), wide && 'Emergency management');
  }
  function RdPendingTag({
    children = 'Pending'
  }) {
    return React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 'var(--sd-radius-full)',
        background: RD_SYNC_BG,
        color: RD_SYNC_FG,
        whiteSpace: 'nowrap'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 11
    }), children);
  }
  function RdPendingSheet({
    conn,
    pending,
    syncing,
    synced,
    onClose
  }) {
    const shown = React.useRef(pending);
    if (pending.length) shown.current = pending;
    const sent = React.useRef(0);
    if (synced) sent.current = synced;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const done = !syncing && !pending.length && !!sent.current;
    const rows = done || syncing ? shown.current : pending;
    const nSending = shown.current.length;
    const head = done ? {
      title: 'Everything uploaded',
      sub: `${sent.current} record${sent.current === 1 ? '' : 's'} sent from this device`,
      bg: 'var(--sd-colour-surface-green)',
      fg: 'var(--sd-colour-text-on-green)',
      glyph: 'tick'
    } : syncing ? {
      title: 'Sending…',
      sub: nSending === 1 ? '1 record on its way' : `${nSending} records on their way`,
      bg: RD_SYNC_BG,
      fg: RD_SYNC_FG,
      glyph: 'refresh-update-arrow'
    } : {
      title: conn === 'offline' ? 'No connection' : 'Waiting to sync',
      sub: `${pending.length} record${pending.length === 1 ? '' : 's'} saved on this device`,
      bg: RD_SYNC_BG,
      fg: RD_SYNC_FG,
      glyph: 'wifi-off'
    };
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement("span", {
      className: syncing ? 'rd-spin' : undefined,
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: head.bg,
        color: head.fg
      }
    }, React.createElement(SdIcon, {
      name: head.glyph,
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, head.title), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, head.sub)), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '14px 22px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, done ? React.createElement(React.Fragment, null, "Nothing is left on the device. Every record went up with the time it happened and the educator who made it.") : React.createElement(React.Fragment, null, "Everything below is recorded with the time it happened and the educator who made it. It will send on its own once there\u2019s signal \u2014 keep working.")), rows.length ? rows.map(p => React.createElement("div", {
      key: p.id,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        color: RD_SYNC_FG,
        flexShrink: 0
      }
    }, React.createElement(RdColourIcon, {
      kind: RD_COLOUR_ICON[p.kind] ? p.kind : 'time',
      size: 18
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }, p.label), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Recorded ", RD_AMPM(p.at), p.by ? React.createElement(React.Fragment, null, " \xB7 ", p.by) : null)), done ? React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--green ds-pill--minimal"
    }, React.createElement("span", {
      className: "ds-pill__icon"
    }, React.createElement(SdIcon, {
      name: "tick",
      size: 14
    })), "Sent") : syncing ? React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 'var(--sd-radius-full)',
        background: RD_SYNC_BG,
        color: RD_SYNC_FG,
        whiteSpace: 'nowrap'
      }
    }, React.createElement("span", {
      className: "rd-spin",
      style: {
        display: 'flex'
      }
    }, React.createElement(SdIcon, {
      name: "refresh-update-arrow",
      size: 11
    })), "Sending") : React.createElement(RdPendingTag, null))) : React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Nothing waiting.")), React.createElement("div", {
      style: {
        padding: '14px 22px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end'
      }
    }, React.createElement(RdAction, {
      primary: true,
      glyph: done ? 'tick' : undefined,
      onClick: onClose
    }, done ? 'Done' : 'Keep working'))));
  }
  function RdBlockedNote({
    label,
    text
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: RD_SYNC_BG
      }
    }, React.createElement("span", {
      style: {
        color: RD_SYNC_FG,
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "wifi-off",
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: RD_SYNC_FG
      }
    }, text || `${label} needs a connection. Everything else here still works and will sync later.`));
  }
  const RD_SEG_CHROME = 10;
  function RdSegmented({
    options,
    value,
    onChange,
    ariaLabel = 'Choose an option',
    size = 'touch',
    variant,
    onNatural
  }) {
    const box = React.useRef(null);
    const opts = options.map(o => Array.isArray(o) ? o : [o, o]);
    const keys = opts.map(o => o[0]);
    const [wrap, setWrap] = useState(false);
    const labelKey = opts.map(o => o[1]).join(' ');
    useLayoutEffect(() => {
      const el = box.current;
      const parent = el && el.parentElement;
      if (!el || !parent || !window.ResizeObserver) return undefined;
      const fit = () => {
        const cs = getComputedStyle(parent);
        const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const natural = Array.from(el.children).reduce((w, c) => w + c.offsetWidth, 0) + RD_SEG_CHROME;
        if (onNatural) onNatural(natural);
        setWrap(avail > 0 && natural > avail);
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(parent);
      return () => ro.disconnect();
    }, [labelKey]);
    const move = delta => {
      const i = keys.indexOf(value);
      const next = keys[(i + delta + keys.length) % keys.length];
      onChange(next);
      requestAnimationFrame(() => {
        const btns = box.current ? box.current.querySelectorAll('.ds-segmented__item') : [];
        const ni = keys.indexOf(next);
        if (btns[ni]) btns[ni].focus();
      });
    };
    const onKeyDown = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1);
      }
    };
    const cls = 'ds-segmented' + (size === 'touch' ? ' ds-segmented--touch' : '') + (variant === 'raised' ? ' ds-segmented--raised' : '') + (wrap ? ' ds-segmented--wrap' : '');
    return React.createElement("div", {
      ref: box,
      className: cls,
      role: "radiogroup",
      "aria-label": ariaLabel,
      onKeyDown: onKeyDown
    }, opts.map(([k, l]) => {
      const on = value === k;
      return React.createElement("button", {
        key: k,
        type: "button",
        role: "radio",
        "aria-checked": on,
        tabIndex: on ? 0 : -1,
        className: 'ds-segmented__item' + (on ? ' ds-segmented__item--selected' : ''),
        onClick: () => onChange(k)
      }, React.createElement("span", {
        className: "ds-segmented__label"
      }, l));
    }));
  }
  function RdTimeField({
    value,
    onChange,
    now = RD_NOW,
    ariaLabel = 'Time',
    future = false,
    min = null,
    minLabel = null
  }) {
    const ref = React.useRef(null);
    const [floored, setFloored] = useState(false);
    const nowMins = RD_MINS(now);
    const back = future ? 0 : nowMins - RD_MINS(value);
    const set = v => {
      if (!v) return;
      let t = future || RD_MINS(v) <= nowMins ? v : now;
      let hit = false;
      if (min && RD_MINS(t) < RD_MINS(min)) {
        t = min;
        hit = true;
      }
      setFloored(hit);
      onChange(t);
    };
    const open = e => {
      const el = ref.current;
      if (!el) return;
      if (typeof el.showPicker !== 'function') return;
      e.preventDefault();
      el.focus();
      try {
        el.showPicker();
      } catch (_) {}
    };
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, React.createElement("label", {
      onClick: open,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        height: 44,
        padding: '0 14px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        border: '2px solid var(--sd-colour-action-primary)',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 17
    }), React.createElement("input", {
      ref: ref,
      type: "time",
      value: value ? RD_PAD(value) : '',
      max: future ? undefined : RD_PAD(now),
      min: min ? RD_PAD(min) : undefined,
      "aria-label": ariaLabel,
      onChange: e => set(e.target.value),
      style: {
        fontFamily: 'var(--sd-font-family)',
        fontSize: 15,
        fontWeight: 700,
        border: 'none',
        background: 'transparent',
        color: 'inherit',
        padding: 0,
        cursor: 'pointer'
      }
    })), back > 0 && React.createElement("button", {
      type: "button",
      onClick: () => {
        setFloored(false);
        onChange(now);
      },
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        height: 44,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-full)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)',
        whiteSpace: 'nowrap'
      }
    }, "Back to now")), !future && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Recording at ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(value)), back > 0 ? ` · ${rdDur(back)} ago` : ' · now', min && (floored || RD_MINS(value) <= RD_MINS(min)) && React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 500
      }
    }, "Not before ", RD_AMPM(min), minLabel ? `, ${minLabel}` : '', ".")));
  }
  const RdSheetMenus = React.createContext(false);
  function RdDropdownShell({
    label,
    value,
    count,
    active,
    wide,
    ariaLabel,
    reveal,
    children
  }) {
    const [open, setOpen] = useState(false);
    const sheetMenu = React.useContext(RdSheetMenus);
    const ref = React.useRef(null);
    const menuRef = React.useRef(null);
    useEffect(() => {
      if (open && reveal && menuRef.current && menuRef.current.scrollIntoView) menuRef.current.scrollIntoView({
        block: 'nearest'
      });
    }, [open]);
    useEffect(() => {
      if (!open) return;
      const onDoc = e => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      const onEsc = e => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      window.addEventListener('keydown', onEsc);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        window.removeEventListener('keydown', onEsc);
      };
    }, [open]);
    return React.createElement("div", {
      ref: ref,
      style: {
        position: 'relative',
        flexShrink: 0
      }
    }, React.createElement("button", {
      type: "button",
      onClick: () => setOpen(o => !o),
      "aria-expanded": open,
      "aria-haspopup": "menu",
      "aria-label": ariaLabel || `${label} — ${value}`,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 40,
        padding: '0 13px',
        position: 'relative',
        borderRadius: 'var(--sd-radius-lg)',
        border: `1px solid ${open || active ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
        background: active ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: active ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
      }
    }, !!label && React.createElement("span", {
      style: {
        color: active ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, label), value != null && value !== '' && React.createElement("b", {
      style: {
        fontWeight: 700
      }
    }, value), count !== undefined && React.createElement("span", {
      style: {
        fontWeight: 700,
        opacity: 0.7
      }
    }, count), React.createElement("span", {
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 14
    })), React.createElement(RdHit, {
      n: 3
    })), open && React.createElement("div", {
      role: "menu",
      ref: menuRef,
      style: {
        ...(sheetMenu ? {
          position: 'fixed',
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 60,
          boxSizing: 'border-box',
          maxHeight: 'min(420px, 70%)'
        } : {
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 20,
          minWidth: wide ? 320 : 216,
          maxHeight: 400
        }),
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 16px 40px rgba(0,40,34,0.22)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
      }
    }, children(() => setOpen(false))));
  }
  function RdRadioRows({
    options,
    value,
    onPick,
    counts,
    defaultKey
  }) {
    return options.map(o => {
      const on = o.key === value;
      return React.createElement("button", {
        key: o.key,
        type: "button",
        role: "menuitemradio",
        "aria-checked": on,
        onClick: () => onPick(o.key),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          minHeight: 40,
          padding: '0 11px',
          borderRadius: 'var(--sd-radius-m)',
          fontSize: 14,
          fontWeight: on ? 700 : 500,
          background: on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          color: on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
        }
      }, React.createElement("span", {
        style: {
          width: 16,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, on && React.createElement(SdIcon, {
        name: "tick",
        size: 15
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, o.label), defaultKey === o.key && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "Default"), counts && counts[o.key] !== undefined && React.createElement("span", {
        style: {
          fontWeight: 700,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, counts[o.key]));
    });
  }
  function RdDropdown({
    label,
    value,
    options,
    onChange,
    counts,
    plain,
    wide,
    defaultKey,
    offLabel,
    ariaLabel
  }) {
    const found = options.find(o => o.key === value);
    const current = found || (offLabel ? {
      key: value,
      label: offLabel
    } : options[0]);
    const active = !plain && value !== (defaultKey || options[0].key);
    return React.createElement(RdDropdownShell, {
      label: label,
      value: current.label,
      active: active,
      wide: wide,
      ariaLabel: ariaLabel ? `${ariaLabel}: ${current.label}` : undefined,
      count: counts && counts[current.key] !== undefined ? counts[current.key] : undefined
    }, close => React.createElement(RdRadioRows, {
      options: options,
      value: value,
      counts: counts,
      defaultKey: defaultKey,
      onPick: k => {
        onChange(k);
        close();
      }
    }));
  }
  function RdTick({
    state,
    size = 26
  }) {
    return React.createElement("span", {
      "aria-hidden": "true",
      className: `ds-checkbox ds-checkbox--${state}`,
      style: {
        width: size,
        height: size,
        padding: 0,
        flexShrink: 0
      }
    }, React.createElement("span", {
      className: "ds-checkbox__box"
    }, React.createElement("svg", {
      className: "ds-checkbox__icon ds-checkbox__icon--check",
      viewBox: "0 0 24 24",
      fill: "none"
    }, React.createElement("path", {
      d: "M4 12l5 5L20 6",
      stroke: "currentColor",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })), React.createElement("svg", {
      className: "ds-checkbox__icon ds-checkbox__icon--dash",
      viewBox: "0 0 24 24",
      fill: "none"
    }, React.createElement("path", {
      d: "M6 12h12",
      stroke: "currentColor",
      strokeWidth: "3",
      strokeLinecap: "round"
    }))));
  }
  const rdTickA11y = (state, label) => ({
    role: 'checkbox',
    'aria-checked': state === 'indeterminate' ? 'mixed' : state === 'checked',
    'aria-label': label
  });
  const rdTickState = (ids, isTicked) => {
    if (!ids.length) return 'unchecked';
    const n = ids.filter(isTicked).length;
    return !n ? 'unchecked' : n === ids.length ? 'checked' : 'indeterminate';
  };
  function RdFacetRows({
    pool,
    on,
    setOn
  }) {
    const toggle = (f, v) => setOn(o => {
      const cur = o[f.key] || [];
      const next = cur.includes(v.key) ? cur.filter(k => k !== v.key) : [...cur, v.key];
      const out = {
        ...o
      };
      if (next.length) out[f.key] = next;else delete out[f.key];
      return out;
    });
    return RD_FACETS.filter(f => !(f.key === 'att' && !svcOn('attendance'))).map(f => React.createElement("div", {
      key: f.key
    }, React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--sd-colour-text-secondary)',
        padding: '10px 11px 4px'
      }
    }, f.label), f.values.map(v => {
      const isOn = (on[f.key] || []).includes(v.key);
      const count = pool.filter(c => rdFacetPass(c, {
        ...on,
        [f.key]: [...(on[f.key] || []), v.key]
      })).length;
      return React.createElement("button", {
        key: v.key,
        type: "button",
        role: "menuitemcheckbox",
        "aria-checked": isOn,
        onClick: () => toggle(f, v),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          width: '100%',
          minHeight: 40,
          padding: '0 11px',
          borderRadius: 'var(--sd-radius-m)',
          fontSize: 14,
          fontWeight: isOn ? 700 : 500,
          background: isOn ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          color: isOn ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
        }
      }, React.createElement("span", {
        style: {
          width: 16,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, isOn && React.createElement(SdIcon, {
        name: "tick",
        size: 15
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, v.label), React.createElement("span", {
        style: {
          fontWeight: 700,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, count));
    })));
  }
  function RdFacetDropdown({
    pool,
    on,
    setOn
  }) {
    const chips = rdFacetChips(on);
    const value = !chips.length ? '' : chips.length === 1 ? chips[0].value.label : `${chips.length} filters`;
    return React.createElement(RdDropdownShell, {
      wide: true,
      active: !!chips.length,
      label: chips.length ? 'Show only' : 'Show only…',
      value: value,
      ariaLabel: chips.length ? `Show only — ${value}` : 'Show only… — everyone is shown'
    }, () => React.createElement(RdFacetRows, {
      pool: pool,
      on: on,
      setOn: setOn
    }));
  }
  const rdViewActive = d => !!rdFacetChips(d.facets || {}).length || !!d.showGrouping && (d.grouping !== rdGroupDefault() || d.sortKey !== 'first');
  function RdViewButton({
    d,
    onOpen
  }) {
    const n = rdFacetChips(d.facets || {}).length;
    const active = rdViewActive(d);
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      "aria-haspopup": "dialog",
      className: "fp-btn",
      "aria-label": `Filter and sort${n ? ` — ${n} filter${n > 1 ? 's' : ''} on` : ''}`,
      style: {
        all: 'unset',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: 40,
        height: 40,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--sd-radius-lg)',
        border: `1px solid ${active ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
        background: active ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
        color: active ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "filter-eq",
      size: 20
    }), !!n && React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        boxSizing: 'border-box',
        borderRadius: 9,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
        background: 'var(--sd-colour-action-primary)',
        color: '#fff'
      }
    }, n));
  }
  function RdViewSheet({
    d,
    onClose
  }) {
    const full = rdPhoneFull(true);
    const chips = rdFacetChips(d.facets || {});
    const title = 'Filter & sort';
    const hasFilter = !!d.showFilter;
    const hasSort = !!d.showGrouping;
    const [tab, setTab] = useState('filter');
    const pane = hasFilter && hasSort ? tab : hasFilter ? 'filter' : 'sort';
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const head = t => React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)',
        padding: '14px 11px 4px'
      }
    }, t);
    return React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: pane === 'filter' && hasSort ? 'none' : '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        flex: 1,
        minWidth: 0
      }
    }, title), hasFilter && !!chips.length && React.createElement("button", {
      type: "button",
      onClick: () => d.setFacets({}),
      className: "ds-btn ds-btn--minimal ds-btn--sm"
    }, "Clear filters")), hasFilter && hasSort && React.createElement("div", {
      style: {
        padding: '0 16px 12px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        flexShrink: 0
      }
    }, React.createElement(RdSegmented, {
      variant: "raised",
      ariaLabel: "Filter or sort",
      value: tab,
      onChange: setTab,
      options: [['filter', chips.length ? `Show only… · ${chips.length}` : 'Show only…'], ['sort', 'Sort']]
    })), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '4px 11px 16px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, pane === 'filter' && React.createElement(RdFacetRows, {
      pool: d.facetPool,
      on: d.facets,
      setOn: d.setFacets
    }), pane === 'sort' && React.createElement(React.Fragment, null, React.createElement("section", null, head('Sort into'), React.createElement(RdRadioRows, {
      options: d.groupingOptions,
      value: d.grouping,
      defaultKey: rdGroupDefault(),
      onPick: d.setGrouping
    })), React.createElement("section", null, head('A–Z'), React.createElement(RdRadioRows, {
      options: d.sortOptions,
      value: d.sortKey,
      onPick: d.setSortKey
    })))), React.createElement(RdSheetFoot, {
      phone: true,
      edge: true
    }, React.createElement(RdAction, {
      primary: true,
      full: true,
      onClick: onClose
    }, `Done · ${d.shownCount} shown`)));
  }
  function RdFilterBar({
    d,
    compact,
    phone = false
  }) {
    const sel = !!d.tickedCount;
    const summary = !sel ? null : React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)',
        whiteSpace: 'nowrap'
      }
    }, d.tickedCount, " selected"), !!d.hiddenSelected && React.createElement("button", {
      type: "button",
      onClick: d.showSelected,
      className: "ds-btn ds-btn--minimal ds-btn--sm"
    }, d.hiddenSelected, " not shown"), React.createElement("button", {
      type: "button",
      onClick: d.clearSelection,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 40,
        padding: '0 13px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 15
    }), "Clear"));
    const clearFiltersBtn = d.selectRule !== RULE_FILTER || !d.hasFilters ? null : React.createElement("button", {
      type: "button",
      onClick: () => d.setFacets({}),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 40,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '2px solid var(--sd-colour-action-primary)',
        color: 'var(--sd-colour-action-primary)',
        background: 'var(--sd-colour-surface-default)',
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 15
    }), "Clear all filters");
    const selectAll = d.selectRule === RULE_BANDS || d.grouped && d.hasFilters || !d.canSelect || !d.shownIds.length ? null : React.createElement("button", _extends({
      type: "button",
      onClick: d.toggleAllShown,
      className: "fp-btn"
    }, rdTickA11y(d.shownTickState, 'Select everyone shown'), {
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 40,
        padding: '0 14px 0 9px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '2px solid var(--sd-colour-action-primary)',
        color: 'var(--sd-colour-action-primary)',
        background: 'var(--sd-colour-surface-default)',
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }), React.createElement(RdTick, {
      state: d.shownTickState
    }), React.createElement("span", null, d.shownTickState === 'checked' ? `Clear these ${d.shownIds.length}` : d.grouped ? 'Select everyone' : `Select all ${d.shownIds.length}`));
    const expandAll = !!d.showGrouping && d.groupCount > 1 && React.createElement("button", {
      type: "button",
      onClick: () => d.setAllGroups(!d.allGroupsOpen),
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        height: 40,
        padding: '0 6px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)',
        ...(phone ? {
          marginLeft: 'auto'
        } : {})
      }
    }, d.allGroupsOpen ? 'Collapse all' : 'Expand all');
    const hasRow = !phone || !!(summary || clearFiltersBtn || selectAll || expandAll);
    const chips = rdFacetChips(d.facets || {});
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement(RdSheetMenus.Provider, {
      value: !!compact
    }, hasRow && React.createElement("div", {
      style: compact ? {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
        margin: '0 -12px',
        padding: '0 12px'
      } : {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        flexShrink: 0
      }
    }, compact && (summary || clearFiltersBtn || selectAll), d.showFilter && !phone && React.createElement(RdFacetDropdown, {
      pool: d.facetPool,
      on: d.facets,
      setOn: d.setFacets
    }), d.showGrouping && !phone && React.createElement(React.Fragment, null, React.createElement(RdDropdown, {
      label: "Sort into",
      value: d.grouping,
      options: d.groupingOptions,
      onChange: d.setGrouping,
      defaultKey: rdGroupDefault(),
      offLabel: d.grouping === RD_UNGROUPED ? RD_GROUP_OFF_LABEL : (RD_GROUPINGS.find(g => g.key === d.grouping) || {}).label
    }), React.createElement(RdDropdown, {
      label: "A\u2013Z",
      value: d.sortKey,
      options: d.sortOptions,
      onChange: d.setSortKey
    }), expandAll), phone && expandAll, !compact && (summary || clearFiltersBtn || selectAll) && React.createElement("span", {
      style: {
        marginLeft: 'auto',
        display: 'inline-flex',
        flexShrink: 0
      }
    }, summary || clearFiltersBtn || selectAll))), !!chips.length && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, chips.map(({
      facet,
      value
    }) => React.createElement("button", {
      key: facet.key + value.key,
      type: "button",
      className: "ds-selection-pill ds-selection-pill--selected",
      "aria-label": `Remove filter ${value.label}`,
      onClick: () => d.setFacets(o => {
        const next = (o[facet.key] || []).filter(k => k !== value.key);
        const out = {
          ...o
        };
        if (next.length) out[facet.key] = next;else delete out[facet.key];
        return out;
      })
    }, React.createElement("span", {
      className: "ds-selection-pill__label"
    }, value.label), React.createElement("span", {
      className: "ds-selection-pill__dismiss"
    }, React.createElement(SdIcon, {
      name: "close",
      size: 14
    })))), d.selectRule !== RULE_FILTER && React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--ghost ds-btn--sm",
      onClick: () => d.setFacets({})
    }, "Clear filters")));
  }
  const rdOptionOn = o => !o.flag || svcOn(o.flag);
  function RdPillMulti({
    groups,
    options,
    value,
    onChange,
    ariaLabel
  }) {
    const on = value || [];
    const toggle = k => onChange(on.includes(k) ? on.filter(x => x !== k) : [...on, k]);
    const gs = groups && groups.length ? groups : [{
      cat: null,
      label: null
    }];
    return (React.createElement("div", {
        role: "group",
        "aria-label": ariaLabel,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sd-spacing-3)'
        }
      }, gs.map(g => React.createElement("div", {
        key: g.cat || 'all',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sd-spacing-3)',
          flexWrap: 'wrap'
        }
      }, g.label && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--sd-colour-text-secondary)',
          width: 56,
          flexShrink: 0
        }
      }, g.label), options.filter(o => rdOptionOn(o) && (!g.cat || o.cat === g.cat)).map(o => {
        const sel = on.includes(o.key);
        return React.createElement("button", {
          key: o.key,
          type: "button",
          "aria-pressed": sel,
          onClick: () => toggle(o.key),
          className: "rd-pill"
        }, sel && React.createElement(SdIcon, {
          name: "tick",
          size: 12
        }), o.label);
      }))))
    );
  }
  const RD_ROW_NARROW = 600;
  const RD_ROW_CHROME = 24 + 2 + 40 + 96 + 12 * 3 + 44;
  const RD_ROW_HEAD = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--sd-colour-text-secondary)'
  };
  const RD_ROW_LABEL = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--sd-colour-text-secondary)'
  };
  function rdScroller(el) {
    for (let p = el && el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY;
      if (o === 'auto' || o === 'scroll') return p;
    }
    return null;
  }
  function rdAnchor(el, reveal) {
    const sc = rdScroller(el);
    if (!el || !sc) return;
    const top0 = el.getBoundingClientRect().top;
    const t0 = performance.now();
    let live = true;
    const evs = ['wheel', 'touchstart', 'pointerdown'];
    const stop = () => {
      live = false;
      evs.forEach(e => sc.removeEventListener(e, stop));
    };
    evs.forEach(e => sc.addEventListener(e, stop, {
      passive: true
    }));
    const tick = () => {
      if (!live || !el.isConnected) return;
      const d = el.getBoundingClientRect().top - top0;
      if (d) sc.scrollTop += d;
      if (performance.now() - t0 < 320) {
        requestAnimationFrame(tick);
        return;
      }
      stop();
      if (reveal) rdReveal(el, sc);
    };
    requestAnimationFrame(tick);
  }
  function rdReveal(el, sc) {
    const sr = sc.getBoundingClientRect();
    const foot = sc.lastElementChild;
    const stuck = foot && getComputedStyle(foot).position === 'sticky' ? foot.getBoundingClientRect().height : 0;
    const bottom = sr.bottom - stuck;
    const r = el.getBoundingClientRect();
    if (r.bottom + 72 <= bottom) return;
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sc.scrollTo({
      top: sc.scrollTop + (r.top - sr.top) - 12,
      behavior: calm ? 'auto' : 'smooth'
    });
  }
  function RdTileMenu({
    label,
    text,
    muted,
    tone,
    ariaLabel,
    header,
    sections,
    help,
    footer,
    right,
    bottomSheet
  }) {
    const [open, setOpen] = useState(false);
    const [up, setUp] = useState(false);
    const wrap = React.useRef(null);
    const menu = React.useRef(null);
    const trig = React.useRef(null);
    const T = RD_TONE_BLOCK[tone];
    const close = refocus => {
      setOpen(false);
      if (refocus && trig.current) trig.current.focus();
    };
    useEffect(() => {
      if (!open) return undefined;
      const away = e => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener('pointerdown', away);
      return () => document.removeEventListener('pointerdown', away);
    }, [open]);
    useLayoutEffect(() => {
      if (bottomSheet) return;
      if (!open) {
        if (up) setUp(false);
        return;
      }
      const m = menu.current;
      const w = wrap.current;
      if (!m || !w) return;
      const sc = rdScroller(w);
      const sr = sc ? sc.getBoundingClientRect() : {
        top: 0,
        bottom: window.innerHeight
      };
      const mr = m.getBoundingClientRect();
      const wr = w.getBoundingClientRect();
      if (!up && mr.bottom > sr.bottom && wr.top - sr.top > sr.bottom - wr.bottom) {
        setUp(true);
        return;
      }
      if (mr.bottom > sr.bottom || mr.top < sr.top) m.scrollIntoView({
        block: 'nearest'
      });
    }, [open, up]);
    useEffect(() => {
      if (!open || !menu.current) return;
      const el = menu.current.querySelector('[aria-checked="true"]') || menu.current.querySelector('[role="menuitemradio"]');
      if (el) el.focus({
        preventScroll: true
      });
    }, [open]);
    const onKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(true);
        return;
      }
      if (e.key === 'Tab') {
        setOpen(false);
        return;
      }
      if (!e.target.getAttribute || e.target.getAttribute('role') !== 'menuitemradio') return;
      const items = Array.from(menu.current.querySelectorAll('[role="menuitemradio"]'));
      const i = items.indexOf(e.target);
      const j = e.key === 'ArrowDown' ? (i + 1) % items.length : e.key === 'ArrowUp' ? (i - 1 + items.length) % items.length : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null;
      if (j == null) return;
      e.preventDefault();
      items[j].focus();
    };
    const sub = {
      fontSize: 12,
      lineHeight: '16px',
      color: 'var(--sd-colour-text-secondary)'
    };
    return React.createElement("div", {
      ref: wrap,
      style: {
        position: 'relative',
        minWidth: 0,
        display: 'flex'
      }
    }, React.createElement("button", {
      ref: trig,
      type: "button",
      className: "rd-tile",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-label": ariaLabel,
      onClick: () => setOpen(o => !o),
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        flex: 1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
        minHeight: 'var(--sd-spacing-touch-target)',
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: `1px solid ${open ? 'var(--sd-colour-action-primary)' : T ? 'transparent' : 'var(--sd-colour-border-default)'}`,
        boxShadow: open ? '0 0 0 1px var(--sd-colour-action-primary)' : 'none',
        backgroundColor: T ? T.bg : 'var(--sd-colour-surface-default)',
        color: T ? T.fg : 'var(--sd-colour-text-primary)'
      }
    }, React.createElement("span", {
      style: {
        ...RD_ROW_LABEL,
        color: T ? T.fg : 'var(--sd-colour-text-secondary)'
      }
    }, label), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 15,
        lineHeight: '20px',
        fontWeight: muted ? 500 : 600,
        overflowWrap: 'anywhere',
        color: muted ? 'var(--sd-colour-text-secondary)' : undefined
      }
    }, T && React.createElement(SdIcon, {
      name: T.icon,
      size: 14,
      style: {
        flexShrink: 0,
        color: T.iconFg
      }
    }), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, text), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'flex',
        flexShrink: 0,
        color: T ? T.fg : 'var(--sd-colour-text-secondary)',
        transform: open ? 'rotate(180deg)' : 'none'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 16
    })))), open && React.createElement("div", {
      ref: menu,
      role: "menu",
      "aria-label": ariaLabel.replace(/\. Change$/, ''),
      onKeyDown: onKey,
      style: {
        ...(bottomSheet ? {
          position: 'fixed',
          zIndex: 60,
          left: 12,
          right: 12,
          bottom: 12,
          maxHeight: 'min(420px, 70%)'
        } : {
          position: 'absolute',
          zIndex: 30,
          ...(up ? {
            bottom: 'calc(100% + 6px)'
          } : {
            top: 'calc(100% + 6px)'
          }),
          ...(right ? {
            right: 0
          } : {
            left: 0
          }),
          minWidth: 'max(100%, 208px)',
          maxHeight: 340
        }),
        boxSizing: 'border-box',
        overflowY: 'auto',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 16px 40px rgba(0,40,34,0.22)'
      }
    }, header && React.createElement("span", {
      style: {
        ...sub,
        fontWeight: 600,
        padding: '4px 11px 6px'
      }
    }, header), sections.map((sec, si) => React.createElement(React.Fragment, {
      key: si
    }, sec.label && React.createElement("span", {
      style: {
        ...RD_ROW_HEAD,
        padding: '8px 11px 4px'
      }
    }, sec.label), sec.options.map(o => {
      const on = o.key === sec.cur;
      const OT = RD_TONE_BLOCK[o.tone];
      return React.createElement("button", {
        key: o.key,
        type: "button",
        role: "menuitemradio",
        "aria-checked": on,
        className: "fp-row",
        onClick: () => {
          const keep = sec.onPick(o.key);
          if (!keep) close(true);
        },
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          minHeight: 'var(--sd-spacing-touch-target)',
          padding: '0 11px',
          borderRadius: 'var(--sd-radius-m)',
          fontSize: 14,
          fontWeight: on ? 700 : 500,
          backgroundColor: on ? 'var(--sd-colour-surface-cyan)' : 'transparent',
          color: on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
        }
      }, React.createElement("span", {
        style: {
          width: 16,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, on && React.createElement(SdIcon, {
        name: "tick",
        size: 15
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, o.label), OT && React.createElement(React.Fragment, null, React.createElement(SdIcon, {
        name: OT.icon,
        size: 14,
        style: {
          flexShrink: 0,
          color: OT.iconFg
        }
      }), React.createElement("span", {
        style: RD_SR_ONLY
      }, OT.word.trim().replace(/:$/, ''))));
    }))), help && React.createElement("span", {
      style: {
        ...sub,
        padding: '6px 11px 4px'
      }
    }, help), footer && footer(() => close(true))));
  }
  function RdTileGrid({
    stacked,
    children
  }) {
    const cols = stacked ? 2 : 3;
    return React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: 'var(--sd-spacing-2)'
      }
    }, React.Children.map(children, (c, i) => React.cloneElement(c, {
      right: stacked && i % cols === cols - 1,
      bottomSheet: !!stacked
    })));
  }
  function RdObsTiles({
    name,
    checks,
    setup,
    onPick,
    stacked,
    heading = true
  }) {
    return React.createElement("div", {
      role: "group",
      "aria-label": `Physical check for ${name}`,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sd-spacing-3)'
      }
    }, heading && React.createElement("span", {
      style: RD_ROW_HEAD
    }, "Physical check"), React.createElement(RdTileGrid, {
      stacked: stacked
    }, RD_SLEEP_CHECKS.map(k => {
      const cur = (checks || {})[k.key];
      const opts = rdCheckOpts(k);
      const sel = opts.find(o => o.key === cur);
      const tone = rdCheckTone(k, cur, setup);
      const none = {
        key: '__none',
        label: 'Not recorded'
      };
      const sections = [{
        options: [none, ...opts.map(o => ({
          key: o.key,
          label: o.label,
          tone: rdCheckTone(k, o.key, setup)
        }))],
        cur: cur == null ? '__none' : cur,
        onPick: v => {
          const val = v === '__none' ? null : v;
          onPick(k.key, val);
          const o = opts.find(x => x.key === val);
          return !!(o && o.asksWhere);
        }
      }];
      if (k.where && sel && sel.asksWhere) {
        sections.push({
          label: k.where.label,
          options: k.where.options.map(w => ({
            key: w.key,
            label: w.label
          })),
          cur: (checks || {})[`${k.key}Where`],
          onPick: v => {
            onPick(`${k.key}Where`, v);
            return false;
          }
        });
      }
      const text = cur == null ? 'Not recorded' : rdCheckText(k, checks);
      return React.createElement(RdTileMenu, {
        key: k.key,
        label: k.label,
        text: text,
        tone: tone,
        muted: cur == null,
        sections: sections,
        ariaLabel: `${RD_TONE_BLOCK[tone] ? RD_TONE_BLOCK[tone].word : ''}${k.label}: ${text}. Change`
      });
    })));
  }
  function RdSetupTiles({
    name,
    setup,
    onChange,
    stacked,
    heading = true
  }) {
    const none = {
      key: '__none',
      label: 'Not recorded'
    };
    const yn = [none, {
      key: 'yes',
      label: 'Yes'
    }, {
      key: 'no',
      label: 'No'
    }];
    const short = {
      risk: 'Risk assessment'
    };
    const bed = RD_SLEEP_SETUP.find(f => f.kind === 'text');
    const bedText = String((setup || {}).bedding || '');
    const bedQuick = bed.quick.find(q => q.toLowerCase() === bedText.trim().toLowerCase()) || null;
    return React.createElement("div", {
      role: "group",
      "aria-label": `Sleep set-up for ${name}`,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sd-spacing-3)'
      }
    }, heading ? React.createElement("span", {
      style: RD_ROW_HEAD
    }, "Sleep set-up", React.createElement("span", {
      style: {
        textTransform: 'none',
        letterSpacing: 0,
        fontWeight: 500
      }
    }, " \xB7 carried forward to the next check")) : React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: '16px',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Carried forward to the next check"), React.createElement(RdTileGrid, {
      stacked: stacked
    }, RD_SLEEP_SETUP.filter(f => f.kind === 'yn').map(f => {
      const v = (setup || {})[f.key];
      const text = v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
      return React.createElement(RdTileMenu, {
        key: f.key,
        label: short[f.key] || f.label,
        text: text,
        muted: !v,
        header: short[f.key] ? f.label : null,
        help: f.help,
        ariaLabel: `${f.label}: ${text}. Change`,
        sections: [{
          options: yn,
          cur: v || '__none',
          onPick: k => {
            onChange(f.key, k === '__none' ? null : k);
            return false;
          }
        }]
      });
    }), React.createElement(RdTileMenu, {
      key: "bedding",
      label: bed.label,
      text: bedText.trim() || 'Not recorded',
      muted: !bedText.trim(),
      ariaLabel: `${bed.label}: ${bedText.trim() || 'Not recorded'}. Change`,
      sections: [{
        options: [none, ...bed.quick.map(q => ({
          key: q,
          label: q
        }))],
        cur: bedQuick || (bedText.trim() ? null : '__none'),
        onPick: k => {
          onChange('bedding', k === '__none' ? '' : k);
          return false;
        }
      }],
      footer: done => React.createElement("input", {
        type: "text",
        className: "fp-input",
        value: bedText,
        maxLength: RD_BEDDING_MAX,
        "aria-label": "Bedding, in your own words",
        placeholder: "Or say what is in the cot",
        onChange: e => onChange('bedding', e.target.value.slice(0, RD_BEDDING_MAX)),
        onKeyDown: e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            done();
          }
        },
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          margin: '6px 3px 3px',
          height: 'var(--sd-spacing-touch-target)',
          padding: '0 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          fontFamily: 'var(--sd-font-family)',
          fontSize: 14
        }
      })
    })));
  }
  function RdSetupFold({
    rowId,
    name,
    setup,
    onChange,
    stacked
  }) {
    const [open, setOpen] = useState(false);
    const text = rdSetupText(setup);
    const id = `rd-sd-${rowId}`;
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sd-spacing-3)'
      }
    }, React.createElement("button", {
      type: "button",
      className: "rd-tile",
      "aria-expanded": open,
      "aria-controls": id,
      onClick: () => setOpen(o => !o),
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sd-spacing-3)',
        minHeight: 'var(--sd-spacing-touch-target)',
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        backgroundColor: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: RD_ROW_LABEL
    }, "Sleep set-up"), React.createElement("span", {
      style: {
        fontSize: 14,
        lineHeight: '20px',
        fontWeight: 500,
        color: text ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)',
        overflowWrap: 'anywhere'
      }
    }, text || 'Not recorded yet')), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'flex',
        flexShrink: 0,
        color: 'var(--sd-colour-text-secondary)',
        transform: open ? 'rotate(180deg)' : 'none'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 16
    }))), open && React.createElement("div", {
      id: id
    }, React.createElement(RdSetupTiles, {
      name: name,
      setup: setup,
      onChange: onChange,
      stacked: stacked,
      heading: false
    })));
  }
  const RD_TONE_BLOCK = {
    alert: {
      bg: 'var(--sd-colour-surface-red)',
      fg: 'var(--sd-colour-text-on-red)',
      icon: 'warning',
      iconFg: 'var(--sd-colour-text-on-red)',
      word: 'Alert: '
    },
    note: {
      bg: 'var(--sd-colour-surface-orange)',
      fg: 'var(--sd-colour-text-primary)',
      icon: 'info-alert',
      iconFg: 'var(--sd-colour-text-on-orange)',
      word: 'Note: '
    }
  };
  function RdSummaryParts({
    parts,
    style
  }) {
    return (React.createElement("span", {
        style: {
          overflowWrap: 'anywhere',
          ...style
        }
      }, parts.map((p, i) => {
        const prev = parts[i - 1];
        const t = RD_TONE_BLOCK[p.tone];
        return React.createElement(React.Fragment, {
          key: p.key
        }, i > 0 && (RD_TONE_BLOCK[prev.tone] || t ? ' ' : React.createElement("span", {
          "aria-hidden": "true"
        }, " \xB7 ")), t ? React.createElement("span", {
          style: {
            display: 'inline-block',
            maxWidth: '100%',
            verticalAlign: 'top',
            marginBottom: 2,
            background: t.bg,
            color: t.fg,
            padding: '1px 8px',
            borderRadius: 'var(--sd-radius-m)'
          }
        }, React.createElement(SdIcon, {
          name: t.icon,
          size: 14,
          style: {
            verticalAlign: 'text-bottom',
            marginRight: 4,
            color: t.iconFg
          }
        }), React.createElement("span", {
          style: RD_SR_ONLY
        }, t.word), p.text) : React.createElement("span", {
          style: {
            color: p.color,
            fontStyle: p.italic ? 'italic' : undefined
          }
        }, p.text));
      }))
    );
  }
  function RdSleepPrompt({
    prompt
  }) {
    if (!prompt) return null;
    return React.createElement("div", {
      role: "status",
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--sd-spacing-2)',
        padding: '10px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)',
        color: 'var(--sd-colour-text-on-red)',
        fontSize: 13,
        lineHeight: '18px',
        fontWeight: 600
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 16
    })), React.createElement("span", null, RD_SLEEP_PROMPT[prompt]));
  }
  function rdSleepRecordParts(rec, compact) {
    if (!rec) return [];
    const parts = [];
    const checks = rec.checks;
    if (checks) {
      const f = rdFindings(checks, rec.setup);
      if (f.length) {
        f.forEach(x => parts.push({
          key: x.key,
          tone: x.tone,
          text: x.text
        }));
        const ro = compact && rdRolledPart(f);
        if (ro) parts.push(ro);
      } else if (rdChecksAnswered(checks) === RD_SLEEP_CHECKS.length) {
        const pos = RD_SLEEP_CHECKS.find(k => k.key === 'position');
        if (pos && checks.position != null) parts.push({
          key: 'pos',
          text: rdCheckLabel(pos, checks.position)
        });
        parts.push({
          key: 'ok',
          text: 'All normal'
        });
      } else if (rdChecksAnswered(checks)) {
        parts.push({
          key: 'ok',
          text: `${rdChecksAnswered(checks)} of ${RD_SLEEP_CHECKS.length} recorded, all normal`
        });
      }
    }
    const su = compact ? '' : rdSetupText(rec.setup);
    if (su) parts.push({
      key: 'su',
      text: su
    });
    if (!compact && rec.roomTemp != null) parts.push({
      key: 'rt',
      text: `Room ${rec.roomTemp}°C`
    });
    return parts;
  }
  function RdSleepRecord({
    rec,
    style,
    compact
  }) {
    const parts = rdSleepRecordParts(rec, compact);
    if (!parts.length) return null;
    return React.createElement(RdSummaryParts, {
      parts: parts,
      style: style
    });
  }
  function RdAmount({
    value,
    onChange,
    unit,
    ariaLabel,
    id,
    placeholder = 'Amount',
    width = 104,
    describedBy
  }) {
    const bad = !!rdQtyWhy(value, unit);
    return React.createElement("input", {
      className: "fp-input",
      type: "text",
      inputMode: "decimal",
      autoComplete: "off",
      value: value,
      placeholder: placeholder,
      "aria-label": ariaLabel,
      "aria-invalid": bad || undefined,
      "aria-describedby": bad ? describedBy : undefined,
      "data-rd-qty": id,
      onChange: e => onChange(e.target.value),
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width,
        height: 'var(--sd-spacing-touch-target)',
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: `${bad ? 2 : 1}px solid ${bad ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)'}`,
        fontFamily: 'var(--sd-font-family)',
        fontSize: 15,
        fontWeight: 600
      }
    });
  }
  function RdNotEaten({
    on,
    onToggle,
    name,
    word = 'eaten'
  }) {
    return React.createElement("button", {
      type: "button",
      "aria-pressed": on,
      "aria-label": `Offered, not ${word}: ${name}`,
      onClick: onToggle,
      className: `ds-selection-pill${on ? ' ds-selection-pill--selected' : ''}`,
      style: {
        flexShrink: 0
      }
    }, React.createElement("span", {
      className: "ds-selection-pill__label"
    }, "Not ", word));
  }
  const rdUnitOptions = keys => keys.map(k => ({
    key: k,
    label: RD_UNITS[k].label
  }));
  const rdMealFor = (items, mr) => items.map(x => {
    const own = rdQty(((mr || {}).qty || {})[x.id], x.unit);
    return {
      key: x.key,
      name: x.name,
      type: x.type,
      qty: own != null ? own : rdQty(x.qty, x.unit),
      unit: x.unit,
      ...(x.typed ? {
        typed: true
      } : null),
      ...(((mr || {}).out || {})[x.id] ? {
        notEaten: true
      } : null)
    };
  });
  function RdMealItems({
    items,
    slot,
    narrow,
    onItem,
    onDrop,
    onAdd,
    outOf
  }) {
    const cols = narrow ? null : `minmax(120px, 1fr) 132px 100px ${outOf ? '96px ' : ''}auto`;
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: narrow ? 14 : 8,
        paddingBottom: 6
      }
    }, React.createElement(RdLabel, null, "What was served"), items.map(x => {
      const units = rdUnitsFor(x.typed ? null : rdItemByKey(x.key), slot);
      const why = rdQtyWhy(x.qty, x.unit);
      const word = rdNotWord(x.type, slot);
      const name = React.createElement("span", {
        style: {
          flex: '1 1 0',
          minWidth: 0,
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '22px',
          overflowWrap: 'anywhere'
        }
      }, x.name, x.typed && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, " \xB7 typed"));
      const remove = React.createElement(RdTextAction, {
        onClick: () => onDrop(x.id),
        ariaLabel: `Remove ${x.name}`
      }, "Remove");
      const amount = React.createElement(RdAmount, {
        id: x.id,
        value: x.qty,
        unit: x.unit,
        width: narrow ? 88 : 132,
        describedBy: `rd-qe-${x.id}`,
        onChange: v => onItem(x.id, {
          qty: v
        }),
        placeholder: outOf && outOf.map[x.id] ? 'Offered' : narrow ? 'Amount' : 'Amount given',
        ariaLabel: `Amount of ${x.name}`
      });
      const unit = units.length > 1 ? React.createElement(RdDropdown, {
        label: "",
        plain: true,
        value: x.unit,
        options: rdUnitOptions(units),
        onChange: u => onItem(x.id, {
          unit: u
        }),
        ariaLabel: `Unit for ${x.name}`
      }) : React.createElement("span", {
        style: {
          fontSize: 15,
          fontWeight: 600
        }
      }, RD_UNITS[units[0]].label);
      const pill = outOf && React.createElement(RdNotEaten, {
        on: !!outOf.map[x.id],
        onToggle: () => outOf.set(x.id, !outOf.map[x.id]),
        name: x.name,
        word: word
      });
      return React.createElement("div", {
        key: x.id,
        "data-rd-item": x.id,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }, narrow ? React.createElement(React.Fragment, null, React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, name, remove), React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }
      }, amount, unit, pill)) : React.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: cols,
          alignItems: 'center',
          columnGap: 12
        }
      }, name, amount, React.createElement("span", {
        style: {
          display: 'flex'
        }
      }, unit), outOf && React.createElement("span", {
        style: {
          display: 'flex'
        }
      }, pill), remove), !!why && React.createElement("span", {
        id: `rd-qe-${x.id}`,
        style: {
          fontSize: 12.5,
          lineHeight: '16px',
          color: 'var(--sd-colour-text-on-red)'
        }
      }, why));
    }), React.createElement("div", null, React.createElement("button", {
      type: "button",
      id: "rd-mi-add",
      className: 'ds-btn ds-btn--sm ' + (items.length ? 'ds-btn--ghost' : 'ds-btn--solid'),
      onClick: onAdd
    }, React.createElement(SdIcon, {
      name: "add",
      size: 16
    }), items.length ? 'Add another' : 'Add food or drink')));
  }
  function RdMealPicker({
    slot,
    taken,
    phone,
    kids,
    onDone,
    onClose
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const [q, setQ] = useState('');
    const [scope, setScope] = useState(slot === 'bottle' ? 'drink' : 'all');
    const [picked, setPicked] = useState([]);
    const rootRef = React.useRef(null);
    const same = (a, b) => a.typed || b.typed ? !!a.typed && !!b.typed && a.name.toLowerCase() === b.name.toLowerCase() : a.key === b.key;
    const isTaken = it => taken.some(t => same(t, it));
    const isPicked = it => picked.some(p => same(p, it));
    const toggle = it => setPicked(ps => ps.some(p => same(p, it)) ? ps.filter(p => !same(p, it)) : [...ps, it]);
    const typedName = q.trim().replace(/\s+/g, ' ').slice(0, 60);
    const want = typedName.toLowerCase();
    const inScope = it => scope === 'all' || it.type === scope;
    const byName = it => !want || it.name.toLowerCase().includes(want);
    const rank = it => slot === 'bottle' && (it.key === 'formula' || it.key === 'breast-milk') ? 0 : 1;
    const hits = RD_ITEMS.filter(it => inScope(it) && byName(it)).sort((a, b) => rank(a) - rank(b));
    const elsewhere = want ? RD_ITEMS.filter(it => !inScope(it) && byName(it)).length : 0;
    const onMenu = hits.filter(it => it.menu === slot);
    const rest = hits.filter(it => it.menu !== slot);
    const pickedTyped = picked.filter(p => p.typed);
    const known = !!want && [...RD_ITEMS, ...pickedTyped, ...taken.filter(t => t.typed)].some(it => it.name.toLowerCase() === want);
    const useTyped = () => {
      toggle({
        key: null,
        name: typedName,
        type: 'other',
        typed: true
      });
      setQ('');
    };
    const scopeLabel = (RD_ITEM_SCOPES.find(([k]) => k === scope) || [])[1];
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      const root = rootRef.current;
      const made = [];
      if (root && root.parentElement) {
        Array.from(root.parentElement.children).forEach(sib => {
          if (sib !== root && !sib.hasAttribute('inert')) {
            sib.setAttribute('inert', '');
            made.push(sib);
          }
        });
      }
      return () => {
        window.removeEventListener('keydown', esc);
        made.forEach(n => n.removeAttribute('inert'));
      };
    }, [onClose]);
    const risk = it => {
      const al = rdItemAllergens(it);
      const who = (kids || []).filter(k => rdChildAllergens(k).some(x => al.includes(x.key)));
      if (!who.length) return null;
      const kinds = [...new Set(who.flatMap(k => rdChildAllergens(k).filter(x => al.includes(x.key)).map(x => RD_ALLERGEN_NAME[x.key])))];
      const kindText = kinds.join(', ');
      return `${kindText.charAt(0).toUpperCase()}${kindText.slice(1)} · ${who.slice(0, 2).map(k => k.name.split(' ')[0]).join(', ')}${who.length > 2 ? ` and ${who.length - 2} more` : ''}`;
    };
    const row = (it, key) => {
      const added = isTaken(it);
      const on = added || isPicked(it);
      const r = added ? null : risk(it);
      return React.createElement("button", _extends({
        key: key,
        type: "button",
        disabled: added
      }, rdTickA11y(on ? 'checked' : 'unchecked', it.name), {
        onClick: () => toggle(it),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: added ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          minHeight: 48,
          padding: '4px 10px',
          borderRadius: 'var(--sd-radius-m)',
          background: on && !added ? 'var(--sd-colour-surface-cyan)' : 'transparent'
        }
      }), React.createElement(RdTick, {
        state: on ? 'checked' : 'unchecked'
      }), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, React.createElement("span", {
        style: {
          fontSize: 15,
          fontWeight: 600,
          overflowWrap: 'anywhere',
          color: added ? sub : undefined
        }
      }, it.name), r && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--sd-colour-text-on-orange)'
        }
      }, r)), added && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: sub
        }
      }, "Added"));
    };
    const head = t => React.createElement("div", {
      style: {
        padding: '10px 10px 2px'
      }
    }, React.createElement(RdLabel, null, t));
    return React.createElement("div", {
      ref: rootRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-mp-title",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 14px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flexShrink: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...(phone ? {
          margin: '-12px 0 -4px -14px',
          gap: 4
        } : null)
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      id: "rd-mp-title",
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 19,
        fontWeight: 700
      }
    }, "Add food or drink"), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Back to the meal",
      onClick: onClose,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 'var(--sd-spacing-touch-target)',
        height: 'var(--sd-spacing-touch-target)',
        margin: '-12px -12px -12px 0',
        borderRadius: 'var(--sd-radius-full)',
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      onKeyDown: e => {
        if (e.key !== 'Enter') return;
        if (typedName && !known && !hits.length) {
          e.preventDefault();
          useTyped();
        } else if (picked.length) {
          e.preventDefault();
          onDone(picked);
        }
      }
    }, React.createElement(RdSearch, {
      value: q,
      onChange: setQ,
      count: hits.length,
      placeholder: "Search, or type an item",
      compact: phone
    })), React.createElement("div", {
      style: {
        alignSelf: 'flex-start',
        maxWidth: '100%'
      }
    }, React.createElement(RdSegmented, {
      options: RD_ITEM_SCOPES,
      value: scope,
      onChange: setScope,
      ariaLabel: "Show"
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '6px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, pickedTyped.length > 0 && React.createElement(React.Fragment, null, head('Typed'), pickedTyped.map(it => row(it, `t-${it.name}`))), onMenu.length > 0 && React.createElement(React.Fragment, null, head(`On today’s menu · ${rdSlotLabel(slot)}`), onMenu.map(it => row(it, it.key))), rest.length > 0 && React.createElement(React.Fragment, null, head(onMenu.length ? 'Also on the list' : 'On the list'), rest.map(it => row(it, it.key))), !hits.length && !!want && elsewhere > 0 && React.createElement("div", {
      style: {
        padding: '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        color: sub
      }
    }, "Nothing under ", scopeLabel, " matches. ", elsewhere, " ", elsewhere === 1 ? 'item matches' : 'items match', " under another tab."), React.createElement(RdTextAction, {
      onClick: () => setScope('all')
    }, "Show all")), !hits.length && !want && React.createElement("span", {
      style: {
        padding: '14px 10px',
        fontSize: 14,
        color: sub
      }
    }, "Nothing on the list under this tab."), !!typedName && !known && React.createElement("button", {
      type: "button",
      onClick: useTyped,
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        minHeight: 52,
        padding: '4px 10px',
        marginTop: 6,
        borderRadius: 'var(--sd-radius-m)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-action-primary)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "add",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)',
        overflowWrap: 'anywhere'
      }
    }, "Use \u201C", typedName, "\u201D"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: sub
      }
    }, "Not on the list. It stays as typed.")))), React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      inline: true,
      note: picked.length ? `${picked.length} picked` : null
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Back"), React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      muted: !picked.length,
      onClick: picked.length ? () => onDone(picked) : undefined
    }, picked.length ? `Add ${picked.length}` : 'Pick an item')));
  }
  function RdMealChild({
    c,
    items,
    slot,
    mr,
    onOut,
    onQty
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
    const first = c.name.split(' ')[0];
    const openOwn = itemId => {
      onQty(itemId, '');
      setTimeout(() => {
        const el = document.querySelector(`[data-rd-qty="${c.id}-${itemId}"]`);
        if (el) el.focus();
      }, 40);
    };
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sd-spacing-3)'
      }
    }, React.createElement("span", {
      style: RD_ROW_HEAD
    }, "What ", first, " had"), items.map(x => {
      const own = (mr.qty || {})[x.id];
      const why = rdQtyWhy(own, x.unit);
      return React.createElement("div", {
        key: x.id,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 600
        }
      }, x.name, rdQty(x.qty, x.unit) != null && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 ", rdUnitText(rdQty(x.qty, x.unit), x.unit))), React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap'
        }
      }, React.createElement(RdNotEaten, {
        on: !!(mr.out || {})[x.id],
        onToggle: () => onOut(x.id, !(mr.out || {})[x.id]),
        name: `${x.name}, ${first}`,
        word: rdNotWord(x.type, slot)
      }), own == null ? React.createElement(RdTextAction, {
        onClick: () => openOwn(x.id),
        ariaLabel: `Different amount of ${x.name} for ${first}`
      }, "Different amount") : React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8
        }
      }, React.createElement(RdAmount, {
        id: `${c.id}-${x.id}`,
        value: own,
        unit: x.unit,
        onChange: v => onQty(x.id, v),
        describedBy: `rd-qe-${c.id}-${x.id}`,
        ariaLabel: `Amount of ${x.name} for ${c.name}`,
        placeholder: `${first}’s`
      }), React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 600
        }
      }, RD_UNITS[x.unit].label), React.createElement(RdTextAction, {
        onClick: () => onQty(x.id, undefined),
        ariaLabel: `Same amount of ${x.name} as everyone, for ${first}`
      }, "Same as everyone"))), !!why && React.createElement("span", {
        id: `rd-qe-${c.id}-${x.id}`,
        style: {
          fontSize: 12.5,
          lineHeight: '16px',
          color: 'var(--sd-colour-text-on-red)'
        }
      }, why));
    }));
  }
  function RdMealLine({
    items,
    style
  }) {
    return React.createElement("span", {
      style: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        overflowWrap: 'anywhere',
        ...style
      }
    }, rdMealText(items));
  }
  function RdMealConflict({
    c,
    conflicts,
    unchecked
  }) {
    const first = c.name.split(' ')[0];
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingLeft: 52,
        marginTop: 'var(--sd-spacing-2)'
      }
    }, conflicts.map(x => React.createElement(RdSummaryParts, {
      key: x.key,
      style: {
        fontSize: 13.5,
        lineHeight: '20px',
        fontWeight: 600
      },
      parts: [{
        key: x.key,
        tone: rdTone({
          tag: x.tag
        }, c) === 'crit' ? 'alert' : 'note',
        text: `${x.names.join(', ')} ${x.names.length > 1 ? 'contain' : 'contains'} ${RD_ALLERGEN_NAME[x.key]}. ${first}’s record says ${x.tag}.`
      }]
    })), (unchecked || []).map(t => React.createElement(RdSummaryParts, {
      key: t,
      style: {
        fontSize: 13.5,
        lineHeight: '20px',
        fontWeight: 600
      },
      parts: [{
        key: t,
        tone: 'note',
        text: t
      }]
    })));
  }
  function RdBulkSheet({
    eventKey,
    people,
    offline,
    flaky,
    sleepTrack,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onCommit,
    onProfile,
    onLeft,
    covered = false,
    z = 40
  }) {
    const cfg = RD_BULK[eventKey];
    const collectOn = cfg.attendance === 'out' && rdAttOn('signOutTo');
    const single = people.length === 1;
    const advancedOn = !!cfg.advanced;
    const timesOn = cfg.attendance ? true : rdTimesEditable();
    const publicNote = eventKey === 'sleep' || eventKey === 'meal';
    const floorOf = c => {
      if (!c || !/^\d{1,2}:\d{2}$/.test(String(c.at))) return null;
      if (cfg.attendance === 'out') return c.status === 'here' ? c.at : null;
      if (cfg.attendance === 'in') return c.status === 'gone' ? c.at : null;
      return rdSignInFloor(eventKey, c);
    };
    const floorWord = cfg.attendance === 'in' ? 'when they signed out' : 'when they signed in';
    const fold = !single || advancedOn;
    const setupOn = advancedOn && RD_REDNOSE_TEMPLATE && eventKey === 'sleep';
    const [roomTemp, setRoomTemp] = useState('');
    const roomTempBad = roomTemp.trim() !== '' && rdRoomTemp(roomTemp) == null;
    const [shared, setShared] = useState(cfg.shared && (cfg.shared.options || cfg.shared.select) ? cfg.shared.value : null);
    const mealOn = !!cfg.items;
    const [slot, setSlot] = useState(() => mealOn ? rdMealSlotAt(RD_NOW) : null);
    const [items, setItems] = useState([]);
    const [mealRows, setMealRows] = useState({});
    const [pick, setPick] = useState(false);
    const itemSeq = React.useRef(0);
    const focusItem = React.useRef(null);
    const justAdded = React.useRef(false);
    const mealOf = id => mealRows[id] || {};
    const setMealRow = (id, patch) => setMealRows(m => ({
      ...m,
      [id]: {
        ...(m[id] || {}),
        ...patch
      }
    }));
    const setItem = (id, patch) => setItems(xs => xs.map(x => x.id === id ? {
      ...x,
      ...patch
    } : x));
    const changeSlot = k => {
      setSlot(k);
      setItems(xs => xs.map(x => {
        const u = rdUnitsFor(x.typed ? null : rdItemByKey(x.key), k);
        return u.includes(x.unit) ? x : {
          ...x,
          unit: u[0]
        };
      }));
    };
    const addItems = list => {
      const made = list.map(it => ({
        id: `i${++itemSeq.current}`,
        key: it.key,
        name: it.name,
        type: it.type,
        typed: !!it.typed,
        unit: rdUnitsFor(it.typed ? null : it, slot)[0],
        qty: ''
      }));
      focusItem.current = made[0] ? made[0].id : null;
      justAdded.current = true;
      setItems(xs => [...xs, ...made]);
      setPick(false);
    };
    const dropItem = id => {
      setItems(xs => xs.filter(x => x.id !== id));
      setMealRows(m => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, {
        ...v,
        out: {
          ...(v.out || {}),
          [id]: undefined
        },
        qty: (() => {
          const q = {
            ...(v.qty || {})
          };
          delete q[id];
          return q;
        })()
      }])));
    };
    useEffect(() => {
      if (focusItem.current) {
        const el = document.querySelector(`[data-rd-qty="${focusItem.current}"]`);
        focusItem.current = null;
        if (el) el.focus({
          preventScroll: false
        });
      }
    }, [items]);
    const pickedOnce = React.useRef(false);
    useEffect(() => {
      if (!mealOn) return;
      if (pick) {
        pickedOnce.current = true;
        return;
      }
      if (justAdded.current) {
        justAdded.current = false;
        return;
      }
      if (pickedOnce.current) {
        const b = document.getElementById('rd-mi-add');
        if (b) b.focus({
          preventScroll: true
        });
      }
    }, [pick]);
    const [roundNote, setRoundNote] = useState('');
    const roundNoteOn = !single && !cfg.attendance;
    const noteFor = r => [roundNoteOn ? roundNote.trim() : '', (r.note || '').trim()].filter(Boolean).join(' · ') || null;
    const blockedReason = c => {
      if (cfg.attendance === 'in') {
        return c.status === 'expected' || c.status === 'other' || c.status === 'gone' || c.status === 'absent' ? null : c.status === 'here' ? 'Already signed in' : 'On holiday';
      }
      if (cfg.attendance === 'out') return c.status === 'here' ? null : c.status === 'gone' ? 'Already signed out' : 'Not signed in';
      if (cfg.attendance === 'absent') {
        return c.status === 'expected' ? null : c.status === 'here' ? 'Already signed in — sign out instead' : c.status === 'gone' ? 'Already signed out' : 'No booking today';
      }
      return c.status === 'here' ? null : c.status === 'expected' ? 'Not signed in yet' : c.status === 'gone' ? 'Signed out' : c.status === 'holiday' ? 'On holiday' : c.status === 'other' ? 'No booking today' : 'Marked absent';
    };
    const [time, setTime] = useState(RD_NOW);
    const [rows, setRows] = useState(() => people.map((c, i) => ({
      id: c.id,
      value: cfg.attendance === 'out' ? null : cfg.perChild && cfg.perChild.multi ? [...(cfg.perChild.value || [])] : c.prefs && cfg.prefKey && c.prefs[cfg.prefKey] || cfg.perChild && cfg.perChild.value || cfg.shared && cfg.shared.value || null,
      at: cfg.seedBySelection && !single ? (() => {
        const t = RD_MINS(RD_NOW) - (people.length - 1 - i),
          f = floorOf(c);
        return RD_HHMM(f && t < RD_MINS(f) ? RD_MINS(f) : t);
      })() : null,
      checks: advancedOn ? Object.fromEntries(RD_SLEEP_CHECKS.map(k => [k.key, rdCheckStart(k)])) : null,
      setup: setupOn ? {
        ...(c.sleepSetup || {})
      } : null,
      fromPref: !!(c.prefs && cfg.prefKey && c.prefs[cfg.prefKey]),
      named: collectOn,
      note: c.prefNotes && cfg.prefKey && c.prefNotes[cfg.prefKey] || '',
      softReason: rdCohortReason(eventKey, c, cfg),
      excluded: !!rdCohortReason(eventKey, c, cfg)
    })).sort((a, b) => {
      const ba = blockedReason(people.find(x => x.id === a.id) || {}) ? 2 : a.softReason ? 1 : 0;
      const bb = blockedReason(people.find(x => x.id === b.id) || {}) ? 2 : b.softReason ? 1 : 0;
      return ba - bb;
    }));
    const set = (id, patch) => setRows(rs => rs.map(r => r.id === id ? {
      ...r,
      ...patch
    } : r));
    const included = rows.filter(r => !r.excluded && !blockedReason(people.find(x => x.id === r.id) || {}));
    const blockedCount = rows.length - rows.filter(r => !blockedReason(people.find(x => x.id === r.id) || {})).length;
    const missing = cfg.perChild && cfg.perChild.multi ? included.filter(r => !(r.value || []).length) : [];
    const pc = cfg.perChild || {};
    const isNotApplied = v => !!pc.notApplied && (v === pc.notApplied || (pc.reasonFor || []).includes(v));
    const needsReason = r => isNotApplied(r.value);
    const noReason = included.filter(r => needsReason(r) && (r.value === pc.notApplied || !(r.note || '').trim()));
    const noWho = RD_COLLECT_REQUIRED ? included.filter(r => r.named && !r.value) : [];
    const itemsNoAmount = mealOn ? items.filter(x => rdQty(x.qty, x.unit) == null).length : 0;
    const itemsBad = mealOn ? items.filter(x => !!rdQtyWhy(x.qty, x.unit)).length : 0;
    const ownBad = mealOn ? included.reduce((n, r) => n + items.filter(x => {
      const v = (mealOf(r.id).qty || {})[x.id];
      return v != null && String(v).trim() !== '' && rdQty(v, x.unit) == null;
    }).length, 0) : 0;
    const noMeal = mealOn && (!items.length || itemsNoAmount > 0 || ownBad > 0);
    const fixMeal = () => {
      const bad = items.find(x => rdQty(x.qty, x.unit) == null);
      const own = !bad && included.map(r => items.find(x => {
        const v = (mealOf(r.id).qty || {})[x.id];
        return v != null && String(v).trim() !== '' && rdQty(v, x.unit) == null;
      }) && r.id).find(Boolean);
      let el = null;
      if (bad) el = document.querySelector(`[data-rd-qty="${bad.id}"]`);else if (own) {
        changeOpen(own);
        setTimeout(() => {
          const e2 = document.querySelector(`[data-rd-qty^="${own}-"]`);
          if (e2) e2.focus();
        }, 320);
        return;
      } else el = document.getElementById('rd-mi-add');
      if (el) {
        el.scrollIntoView({
          block: 'center'
        });
        el.focus({
          preventScroll: true
        });
      }
    };
    const mealGap = !mealOn ? null : !items.length ? 'Add what was served' : itemsNoAmount > itemsBad ? `Add an amount · ${itemsNoAmount - itemsBad} left` : itemsBad + ownBad ? `Check an amount · ${itemsBad + ownBad} left` : null;
    const conflictRows = mealOn ? included.filter(r => rdMealConflicts(people.find(x => x.id === r.id), items).length) : [];
    const conflictKids = conflictRows.length;
    const conflictNames = conflictRows.map(r => people.find(x => x.id === r.id).name.split(' ')[0]);
    const conflictCrit = conflictRows.some(r => {
      const k = people.find(x => x.id === r.id);
      return rdMealConflicts(k, items).some(x => rdTone({
        tag: x.tag
      }, k) === 'crit');
    });
    const [result, setResult] = useState(null);
    const shownRows = result ? rows.filter(r => result.failedIds.includes(r.id)) : rows;
    const [asking, setAsking] = useState(false);
    const dirty = mealOn && (items.length > 0 || !!result);
    const close = () => dirty ? setAsking(true) : onClose();
    const closeRef = React.useRef(close);
    closeRef.current = close;
    const askingRef = React.useRef(false);
    askingRef.current = asking;
    useEffect(() => {
      if (asking) {
        const k = document.getElementById('rd-disc-keep');
        if (k) k.focus();
      }
    }, [asking]);
    const sharedLabel = () => {
      if (cfg.shared && cfg.shared.options) return shared || null;
      return null;
    };
    const detailsOf = ids => {
      const m = {};
      const ctx = sharedLabel();
      rows.filter(r => ids.includes(r.id)).forEach(r => {
        const child = people.find(p => p.id === r.id);
        const sleepType = eventKey === 'sleep' && child ? rdSleepType(rdLastSleepType(child), r.value, sleepTrack || 'Sleep') : null;
        const own = r.at || time;
        const floor = floorOf(child);
        const mealRec = mealOn ? {
          slot,
          items: rdMealFor(items, mealRows[r.id])
        } : null;
        m[r.id] = {
          at: floor && RD_MINS(own) < RD_MINS(floor) ? floor : own,
          type: sleepType,
          detail: mealOn ? rdMealText(mealRec.items) : cfg.perChild && cfg.perChild.multi ? rdMultiLabel(cfg.perChild.options, r.value) : r.value || cfg.record || null,
          meal: mealRec,
          cats: cfg.perChild && cfg.perChild.multi ? rdMultiCats(cfg.perChild.options, r.value) : null,
          note: noteFor(r),
          context: mealOn ? rdSlotLabel(slot) : eventKey === 'sleep' ? sleepType && sleepType.startsWith('rest_') ? 'Rest' : 'Sleep' : ctx,
          checks: advancedOn ? rdChecksClean(r.checks) : null,
          setup: setupOn ? rdSetupClean(r.setup) : null,
          roomTemp: advancedOn ? rdRoomTemp(roomTemp) : null
        };
      });
      return m;
    };
    const doConfirm = () => {
      const ids = included.map(r => r.id);
      if (flaky && ids.length > 1 && !offline) {
        const failedIds = ids.filter((_, i) => i % 2 === 1);
        const okIds = ids.filter(id => !failedIds.includes(id));
        if (okIds.length) onCommit(okIds, time, {
          silent: true
        }, detailsOf(okIds));
        setResult({
          failedIds,
          savedCount: okIds.length
        });
      } else {
        onCommit(ids, time, undefined, detailsOf(ids));
        onClose();
      }
    };
    const retry = () => {
      onCommit(result.failedIds, time, undefined, detailsOf(result.failedIds));
      onClose();
    };
    const applyShared = v => {
      setShared(v);
      if (cfg.shared && cfg.shared.carry) setRows(rs => rs.map(r => r.fromPref || r.touched ? r : {
        ...r,
        value: v
      }));
    };
    const perOptions = cfg.attendance === 'out' ? null : cfg.perChild && cfg.perChild.options || cfg.shared && cfg.shared.options || null;
    const sharedOptions = cfg.attendance === 'out' ? rdCollectCommon(people, offline) : cfg.shared && cfg.shared.options;
    const [openId, setOpenId] = useState(null);
    const openRef = React.useRef(null);
    openRef.current = openId;
    const [leaving, setLeaving] = useState([]);
    const [settledId, setSettledId] = useState(null);
    const settleTimer = React.useRef(null);
    useEffect(() => () => clearTimeout(settleTimer.current), []);
    const changeOpen = next => {
      const prev = openRef.current;
      openRef.current = next;
      setOpenId(next);
      clearTimeout(settleTimer.current);
      setSettledId(null);
      if (next) settleTimer.current = setTimeout(() => setSettledId(next), 280);
      if (prev && prev !== next) {
        setLeaving(l => l.includes(prev) ? l : [...l, prev]);
        setTimeout(() => setLeaving(l => l.filter(x => x !== prev)), 260);
      }
    };
    const listRef = React.useRef(null);
    const [rowW, setRowW] = useState(0);
    const [segW, setSegW] = useState(0);
    useLayoutEffect(() => {
      const el = listRef.current;
      if (!el || !window.ResizeObserver) return undefined;
      const measure = () => {
        const cs = getComputedStyle(el);
        setRowW(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const narrow = !!phone || rowW > 0 && (rowW < RD_ROW_NARROW || segW > 0 && rowW < RD_ROW_CHROME + segW);
    const pendingFocus = React.useRef(null);
    useEffect(() => {
      const f = pendingFocus.current;
      if (!f) return;
      pendingFocus.current = null;
      const el = document.getElementById(`${f.kind === 'addback' ? 'rd-ab' : 'rd-tg'}-${f.id}`);
      if (el) el.focus();
    }, [rows]);
    const leaveOut = id => {
      pendingFocus.current = {
        id,
        kind: 'addback'
      };
      if (openRef.current === id) setOpenId(null);
      set(id, {
        excluded: true
      });
    };
    const addBack = id => {
      pendingFocus.current = {
        id,
        kind: 'toggle'
      };
      set(id, {
        excluded: false
      });
    };
    const toggleRow = (id, anchor) => {
      const opening = openRef.current !== id;
      rdAnchor(anchor, opening);
      changeOpen(opening ? id : null);
    };
    const coveredRef = React.useRef(false);
    coveredRef.current = covered || pick;
    useEffect(() => {
      const esc = e => {
        if (e.key !== 'Escape' || coveredRef.current) return;
        const id = openRef.current;
        if (id) {
          const a = document.activeElement;
          const row = a && a.closest ? a.closest('[data-rd-row]') : null;
          const tg = document.getElementById(`rd-tg-${id}`);
          if (row && row.getAttribute('data-rd-row') === id) {
            e.preventDefault();
            changeOpen(null);
            if (tg) tg.focus();
            return;
          }
        }
        if (askingRef.current) {
          setAsking(false);
          return;
        }
        closeRef.current();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const rootRef = React.useRef(null);
    const sheetRef = React.useRef(null);
    const full = rdPhoneFull(phone);
    useEffect(() => {
      const opener = document.activeElement;
      const root = rootRef.current;
      const made = [];
      if (root && root.parentElement) {
        Array.from(root.parentElement.children).forEach(sib => {
          if (sib !== root && !sib.hasAttribute('inert')) {
            sib.setAttribute('inert', '');
            made.push(sib);
          }
        });
      }
      if (sheetRef.current) sheetRef.current.focus({
        preventScroll: true
      });
      return () => {
        made.forEach(n => n.removeAttribute('inert'));
        if (opener && opener !== document.body && opener.isConnected && typeof opener.focus === 'function') opener.focus({
          preventScroll: true
        });
      };
    }, []);
    const warning = advancedOn && cfg.warningAdvanced || cfg.warning;
    const setupMissing = setupOn ? included.filter(r => !rdSetupAnswered(r.setup)).length : 0;
    const obsMissing = advancedOn ? included.filter(r => !rdChecksAnswered(r.checks)).length : 0;
    return (React.createElement("div", {
        ref: rootRef,
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: z,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 28,
          ...full.gutter
        }
      }, !phone && React.createElement("button", {
        type: "button",
        "aria-label": "Cancel",
        "aria-hidden": "true",
        tabIndex: -1,
        onClick: close,
        className: "rd-scrim",
        style: {
          all: 'unset',
          cursor: 'pointer',
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,40,34,0.45)'
        }
      }), React.createElement("div", {
        ref: sheetRef,
        className: "rd-sheet",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "rd-bs-title",
        "aria-describedby": warning ? 'rd-bs-warn' : undefined,
        tabIndex: -1,
        style: {
          position: 'relative',
          width: '100%',
          maxWidth: 940,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          background: 'var(--sd-colour-surface-default)',
          borderRadius: 'var(--sd-radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
          ...(pick ? {
            minHeight: 'min(600px, 100%)'
          } : null),
          ...full.card
        }
      }, mealOn && pick && React.createElement(RdMealPicker, {
        slot: slot,
        phone: phone,
        taken: items,
        kids: included.map(r => people.find(x => x.id === r.id)),
        onDone: addItems,
        onClose: () => setPick(false)
      }), React.createElement("div", {
        style: {
          padding: '20px 22px 16px',
          borderBottom: '1px solid var(--sd-colour-border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flexShrink: 0
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          ...(phone ? {
            margin: '-12px 0 -4px -14px',
            gap: 4
          } : null)
        }
      }, phone && React.createElement(RdSheetBack, {
        onClick: close
      }), React.createElement("span", {
        style: {
          width: 40,
          height: 40,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--sd-colour-surface-cyan)',
          color: 'var(--sd-colour-action-primary)'
        }
      }, cfg.attendance ? React.createElement(RdLogIcon, {
        kind: eventKey,
        size: 22
      }) : React.createElement(RdColourIcon, {
        kind: eventKey,
        size: 22
      })), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        id: "rd-bs-title",
        style: {
          fontSize: 19,
          fontWeight: 700
        }
      }, eventKey === 'sleep' ? rdEventTitle('sleep', sleepTrack) : cfg.label), (!single || setupMissing > 0 || obsMissing > 0 || conflictKids > 0) && React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, !single && React.createElement("span", {
        "aria-live": "polite",
        "aria-atomic": "true"
      }, result ? `${result.savedCount} saved · ${result.failedIds.length} not saved` : `${included.length} of ${rows.length} children`, !result && !!blockedCount && React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)'
        }
      }, " \xB7 ", blockedCount, " not in the room")), conflictKids > 0 && React.createElement("span", {
        "aria-live": "polite",
        style: {
          color: conflictCrit ? 'var(--sd-colour-text-on-red)' : 'var(--sd-colour-text-on-orange)',
          ...(phone ? {
            display: 'block'
          } : null)
        }
      }, !single && !phone ? ' · ' : '', "Allergy warning", !single ? `: ${conflictNames.length > 2 ? `${conflictNames.slice(0, 2).join(', ')} and ${conflictNames.length - 2} more` : conflictNames.join(' and ')}` : ''), (obsMissing > 0 || setupMissing > 0) && React.createElement("span", {
        style: phone && !single ? {
          display: 'block'
        } : undefined
      }, !single && !phone ? ' · ' : '', obsMissing > 0 ? obsMissing === setupMissing ? `No observations or set-up ${single ? 'yet' : `for ${obsMissing}`}` : `No observations ${single ? 'yet' : `for ${obsMissing}`}` : single ? 'Set-up not recorded yet' : `Set-up not recorded for ${setupMissing}`))), !phone && React.createElement("button", {
        type: "button",
        "aria-label": "Close",
        onClick: close,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 'var(--sd-spacing-touch-target)',
          height: 'var(--sd-spacing-touch-target)',
          margin: '-12px -12px -12px 0',
          borderRadius: 'var(--sd-radius-full)',
          color: 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement(SdIcon, {
        name: "close",
        size: 20
      }))), React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap'
        }
      }, cfg.shared && cfg.shared.options && (!single || !cfg.shared.carry) && (cfg.attendance !== 'out' || collectOn) && React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          minWidth: 0,
          maxWidth: '100%'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, cfg.shared.label), React.createElement(RdSegmented, {
        options: sharedOptions,
        value: shared,
        onChange: applyShared,
        ariaLabel: cfg.shared.label
      })), mealOn && React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          minWidth: 0
        }
      }, React.createElement(RdLabel, null, "Which meal"), React.createElement(RdDropdown, {
        label: "",
        plain: true,
        value: slot,
        options: RD_MEAL_SLOTS,
        onChange: changeSlot,
        ariaLabel: "Which meal"
      })), warning && (phone ? React.createElement("div", {
        style: {
          padding: '8px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-orange)',
          flexBasis: '100%'
        }
      }, React.createElement(SdIcon, {
        name: "warning",
        size: 16,
        style: {
          verticalAlign: 'text-bottom',
          marginRight: 6,
          color: 'var(--sd-colour-text-on-orange)'
        }
      }), React.createElement("span", {
        id: "rd-bs-warn",
        style: {
          fontSize: 12.5,
          lineHeight: 1.4,
          fontWeight: 600,
          color: 'var(--sd-colour-text-primary)'
        }
      }, warning)) : React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          padding: '11px 13px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-orange)',
          flexBasis: '100%'
        }
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)',
          flexShrink: 0,
          marginTop: 1
        }
      }, React.createElement(SdIcon, {
        name: "warning",
        size: 18
      })), React.createElement("span", {
        id: "rd-bs-warn",
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          fontWeight: 600,
          color: 'var(--sd-colour-text-primary)'
        }
      }, warning))), advancedOn && cfg.roomTemp && React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          ...(phone ? {
            flex: '1 1 130px',
            minWidth: 0
          } : {})
        }
      }, React.createElement(RdLabel, null, "Room temperature (optional)"), React.createElement("input", {
        className: "fp-input",
        type: "text",
        inputMode: "decimal",
        value: roomTemp,
        onChange: e => setRoomTemp(e.target.value),
        placeholder: "\xB0C",
        "aria-invalid": roomTempBad || undefined,
        "aria-describedby": roomTempBad ? 'rd-rt-hint' : undefined,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          width: 120,
          maxWidth: '100%',
          height: 'var(--sd-spacing-touch-target)',
          padding: '0 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: `${roomTempBad ? 2 : 1}px solid ${roomTempBad ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)'}`,
          fontFamily: 'var(--sd-font-family)',
          fontSize: 14
        }
      }), roomTempBad && React.createElement("span", {
        id: "rd-rt-hint",
        style: {
          fontSize: 12,
          lineHeight: '16px',
          color: 'var(--sd-colour-text-on-red)'
        }
      }, "Not recorded: use \xB0C, like 22")), timesOn && React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          ...(phone && advancedOn && cfg.roomTemp ? {
            flex: '1 1 130px',
            minWidth: 0
          } : {})
        }
      }, React.createElement(RdLabel, null, single ? {
        in: 'Arrived at',
        out: 'Left at',
        absent: 'Marked absent at'
      }[cfg.attendance] || 'Time' : 'Time for everyone'), React.createElement(RdTimeField, {
        value: time,
        onChange: setTime,
        ariaLabel: single ? {
          in: 'Time they arrived',
          out: 'Time they left',
          absent: 'Time marked absent'
        }[cfg.attendance] || 'Time' : 'Time for everyone',
        min: single ? floorOf(people[0]) : null,
        minLabel: floorWord
      })))), React.createElement("div", {
        ref: listRef,
        style: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowAnchor: 'none',
          padding: '12px 22px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sd-spacing-2)'
        }
      }, mealOn && React.createElement(RdMealItems, {
        items: items,
        slot: slot,
        narrow: narrow,
        onItem: setItem,
        onDrop: dropItem,
        onAdd: () => setPick(true),
        outOf: single && rows[0] && !rows[0].excluded && !blockedReason(people[0]) ? {
          map: mealOf(rows[0].id).out || {},
          set: (itemId, on) => setMealRow(rows[0].id, {
            out: {
              ...(mealOf(rows[0].id).out || {}),
              [itemId]: on
            }
          })
        } : null
      }), roundNoteOn && React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingBottom: 6
        }
      }, React.createElement(RdLabel, null, "Note for everyone"), React.createElement("input", {
        className: "fp-input",
        type: "text",
        value: roundNote,
        onChange: e => setRoundNote(e.target.value),
        placeholder: "Optional",
        "aria-describedby": publicNote ? 'rd-bs-public' : undefined,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          width: '100%',
          height: 'var(--sd-spacing-touch-target)',
          padding: '0 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          fontFamily: 'var(--sd-font-family)',
          fontSize: 14
        }
      }), publicNote && React.createElement("span", {
        id: "rd-bs-public",
        style: {
          fontSize: 12.5,
          lineHeight: '16px',
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, RD_PUBLIC_NOTE)), shownRows.map(r => {
        const c = people.find(x => x.id === r.id);
        const blocked = blockedReason(c);
        const off = r.excluded || !!blocked;
        const first = c.name.split(' ')[0];
        const isMulti = !!(cfg.perChild && cfg.perChild.multi);
        const open = fold && !off && openId === r.id;
        const hasState = !!perOptions && !isMulti && !r.named && !off;
        const stateWord = isMulti ? rdMultiLabel(cfg.perChild.options, r.value) || '' : r.value || '';
        const stateName = `${cfg.perChild ? cfg.perChild.label : cfg.label} for ${c.name}`;
        const noteText = (r.note || '').trim();
        const setValue = v => set(r.id, {
          value: v,
          touched: true,
          ...(isNotApplied(r.value) ? {
            note: ''
          } : {})
        });
        const toggleNotApplied = () => set(r.id, isNotApplied(r.value) ? {
          value: shared || (pc.options[0] || [])[0],
          touched: true,
          note: ''
        } : {
          value: pc.notApplied,
          touched: true
        });
        const sTone = 'var(--sd-colour-text-secondary)';
        const oTone = 'var(--sd-colour-text-on-orange)';
        const pTone = 'var(--sd-colour-action-primary)';
        const lead = [];
        let stateP = null;
        let found = [];
        let normalP = null;
        const rest = [];
        const failed = !!result && result.failedIds.includes(r.id);
        if (failed) lead.push({
          key: 'f',
          text: 'Not saved. Try again.',
          color: 'var(--sd-colour-feedback-error-default)'
        });
        if (blocked && !failed) lead.push({
          key: 'b',
          text: blocked,
          color: oTone
        });else if (r.excluded) {
          lead.push({
            key: 'x',
            text: r.softReason || 'Not included',
            color: sTone
          });
        } else {
          if (mealOn) {
            const was = rdLastOf(c, 'meal');
            if (was && was.context === rdSlotLabel(slot) && RD_MINS(RD_NOW) - RD_MINS(was.at) >= RD_JUST_LOGGED) lead.push({
              key: 'dup',
              text: `${rdSlotLabel(slot)} already recorded ${RD_AMPM(was.at)}`,
              color: oTone
            });
          }
          if (r.fromPref) {
            lead.push(c.prefs && r.value !== c.prefs[cfg.prefKey] ? {
              key: 'p',
              text: `Changed from profile (${String(c.prefs[cfg.prefKey]).toLowerCase()})`,
              color: oTone
            } : {
              key: 'p',
              text: 'From profile',
              color: pTone
            });
          } else if (r.softReason) {
            lead.push({
              key: 'p',
              text: `Added · ${r.softReason.replace(/ —.*$/, '')}`,
              color: pTone
            });
          }
          if (fold) {
            if (isMulti) stateP = stateWord ? {
              key: 's',
              text: stateWord,
              color: 'var(--sd-colour-text-primary)'
            } : {
              key: 's',
              text: 'Nothing recorded',
              color: oTone
            };else if (narrow && stateWord) stateP = {
              key: 's',
              text: stateWord,
              color: 'var(--sd-colour-text-primary)'
            };
            if (advancedOn) {
              found = rdFindings(r.checks, r.setup);
              if (!found.length) {
                const answered = rdChecksAnswered(r.checks);
                if (answered === RD_SLEEP_CHECKS.length) normalP = {
                  key: 'o',
                  text: 'All normal',
                  color: sTone
                };else if (answered) normalP = {
                  key: 'o',
                  text: `${answered} of ${RD_SLEEP_CHECKS.length} recorded`,
                  color: sTone
                };
              }
            }
            if (setupOn) {
              const was = c.sleepSetup;
              if (!rdSetupAnswered(r.setup)) {
                if (rdSetupAnswered(was)) rest.push({
                  key: 'u',
                  text: 'Set-up cleared',
                  color: pTone
                });
              } else {
                const diff = rdSetupChanged(r.setup, was);
                if (diff.length) rest.push({
                  key: 'u',
                  text: was ? `Set-up changed: ${diff.map(f => rdSetupWord(f, r.setup[f.key]) || `${f.label} cleared`).join(', ')}` : `Set-up: ${rdSetupText(r.setup)}`,
                  color: pTone
                });
              }
            }
            if (r.at && (cfg.seedBySelection || r.at !== time)) rest.push({
              key: 't',
              text: RD_AMPM(r.at),
              color: pTone
            });
            const fl = floorOf(c);
            if (timesOn && fl && RD_MINS(r.at || time) < RD_MINS(fl)) rest.push({
              key: 'sf',
              text: `${cfg.attendance === 'in' ? 'From sign-out' : 'From sign-in'}, ${RD_AMPM(fl)}`,
              color: pTone
            });
            if (mealOn && !single) {
              const mr = mealOf(r.id);
              const names = list => list.length > 2 ? `${list.slice(0, 2).map(x => x.name).join(', ')} and ${list.length - 2} more` : list.map(x => x.name).join(', ');
              const outN = items.filter(x => (mr.out || {})[x.id]);
              const ownN = items.filter(x => rdQty((mr.qty || {})[x.id], x.unit) != null);
              ['eaten', 'drunk'].forEach(w => {
                const l = outN.filter(x => rdNotWord(x.type, slot) === w);
                if (l.length) rest.push({
                  key: `mo-${w}`,
                  text: `Offered, not ${w}: ${names(l)}`,
                  color: 'var(--sd-colour-text-primary)'
                });
              });
              if (ownN.length) rest.push({
                key: 'mq',
                text: `Own amount: ${ownN.map(x => `${x.name} ${rdUnitText(rdQty((mr.qty || {})[x.id], x.unit), x.unit)}`).join(', ')}`,
                color: 'var(--sd-colour-text-primary)'
              });
            }
            if (noteText && !needsReason(r)) rest.push({
              key: 'n',
              text: `“${noteText.length > 28 && !r.fromPref ? `${noteText.slice(0, 27).trimEnd()}…` : noteText}”`,
              italic: true,
              color: sTone
            });
          }
        }
        const foundParts = found.map(f => ({
          key: `o-${f.key}`,
          tone: f.tone,
          text: f.text
        }));
        const rolledP = rdRolledPart(found);
        const worst = found.some(f => f.tone === 'alert') ? 'alert' : found.some(f => f.tone === 'note') ? 'note' : undefined;
        const countP = found.length ? {
          key: 'oc',
          tone: worst,
          text: `${found.length} finding${found.length === 1 ? '' : 's'}`,
          color: sTone
        } : normalP;
        const headParts = (open ? [...lead, stateP, advancedOn && !off ? countP : null] : [...lead, stateP, normalP]).filter(Boolean);
        const stripParts = open ? [] : [...foundParts, rolledP, ...rest].filter(Boolean);
        const summary = headParts.length > 0 && React.createElement(RdSummaryParts, {
          parts: headParts,
          style: {
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
            color: sTone,
            ...(open ? {
              display: 'block',
              minHeight: 24
            } : {})
          }
        });
        const prompt = advancedOn && !off ? rdCheckPrompt(r.checks, r.setup) : null;
        const promptInBody = !fold || open;
        const nameParts = [...lead, stateP, ...(found.length ? foundParts : [normalP]), rolledP, ...rest].filter(Boolean);
        const toggleName = [`${advancedOn ? 'Observations' : 'Details'} for ${c.name}`, !narrow && !isMulti ? stateWord : null, nameParts.map(p => (p.tone === 'alert' ? 'Alert: ' : p.tone === 'note' ? 'Note: ' : '') + p.text).join(', ')].filter(Boolean).join(', ');
        const noteOn = !needsReason(r);
        const noteEl = noteOn && React.createElement("input", {
          key: "note",
          className: "fp-input",
          type: "text",
          value: r.note,
          "aria-label": `Note for ${c.name}`,
          placeholder: mealOn && rdMealConflicts(c, items).length ? 'What was given instead?' : roundNoteOn && roundNote.trim() ? 'Adds to the note for everyone' : `Note for ${first}`,
          onChange: e => set(r.id, {
            note: e.target.value
          }),
          "aria-describedby": publicNote ? `rd-pub-${r.id}` : undefined,
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            ...(single ? {
              width: '100%'
            } : {
              flex: '1 1 220px',
              minWidth: 0
            }),
            height: 'var(--sd-spacing-touch-target)',
            padding: '0 14px',
            borderRadius: 'var(--sd-radius-lg)',
            border: '1px solid var(--sd-colour-border-default)',
            fontFamily: 'var(--sd-font-family)',
            fontSize: 14
          }
        });
        const leaveEl = !single && React.createElement("button", {
          key: "leave",
          type: "button",
          className: "ds-btn ds-btn--minimal ds-btn--sm",
          onClick: () => leaveOut(r.id),
          style: {
            flexShrink: 0,
            marginLeft: 'auto'
          }
        }, "Leave ", first, " out of this ", cfg.verb === 'Checked' ? 'check' : 'record');
        const profileEl = eventKey === 'sleep' && onProfile && React.createElement(RdTextAction, {
          onClick: () => onProfile(c)
        }, "Open ", first, "\u2019s profile");
        const excRow = (noteEl || leaveEl) && React.createElement("div", {
          key: "exc",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sd-spacing-1)'
          }
        }, React.createElement("div", {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--sd-spacing-3)'
          }
        }, noteEl, leaveEl), noteEl && publicNote || profileEl ? React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap'
          }
        }, noteEl && publicNote ? React.createElement("span", {
          id: `rd-pub-${r.id}`,
          style: {
            fontSize: 12.5,
            lineHeight: '16px',
            fontWeight: 600,
            color: 'var(--sd-colour-text-secondary)'
          }
        }, RD_PUBLIC_NOTE) : React.createElement("span", null), profileEl) : null);
        const body = [hasState && narrow && React.createElement("div", {
          key: "found",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sd-spacing-2)'
          }
        }, React.createElement("span", {
          style: RD_ROW_HEAD
        }, cfg.perChild ? cfg.perChild.label : cfg.label), React.createElement(RdChoiceChips, {
          options: perOptions,
          value: isNotApplied(r.value) ? null : r.value,
          onChange: setValue,
          ariaLabel: stateName
        }), pc.notApplied && React.createElement("span", null, React.createElement(RdNotAppliedToggle, {
          on: isNotApplied(r.value),
          name: c.name,
          onToggle: toggleNotApplied
        }))), advancedOn && excRow, isMulti && React.createElement(RdPillMulti, {
          key: "multi",
          groups: cfg.perChild.groups,
          options: cfg.perChild.options,
          value: r.value,
          onChange: v => set(r.id, {
            value: v,
            touched: true
          }),
          ariaLabel: `What to record for ${c.name}`
        }), advancedOn && React.createElement(RdObsTiles, {
          key: "obs",
          name: c.name,
          checks: r.checks,
          setup: r.setup,
          stacked: narrow,
          heading: fold,
          onPick: (key, v) => setRows(rs => rs.map(x => {
            if (x.id !== r.id) return x;
            const k = RD_SLEEP_CHECKS.find(q => q.key === key);
            return {
              ...x,
              checks: k ? rdCheckPatch(x.checks, k, v) : {
                ...(x.checks || {}),
                [key]: v
              }
            };
          }))
        }), prompt && promptInBody && React.createElement(RdSleepPrompt, {
          key: "prompt",
          prompt: prompt
        }), setupOn && React.createElement(RdSetupFold, {
          key: "setup",
          rowId: r.id,
          stacked: narrow,
          name: c.name,
          setup: r.setup,
          onChange: (key, v) => setRows(rs => rs.map(x => x.id === r.id ? {
            ...x,
            setup: {
              ...(x.setup || {}),
              [key]: v
            }
          } : x))
        }), mealOn && !single && items.length > 0 && React.createElement(RdMealChild, {
          key: "meal",
          c: c,
          items: items,
          slot: slot,
          mr: mealOf(r.id),
          onOut: (itemId, on) => setMealRow(r.id, {
            out: {
              ...(mealOf(r.id).out || {}),
              [itemId]: on
            }
          }),
          onQty: (itemId, v) => setMealRows(m => {
            const q = {
              ...((m[r.id] || {}).qty || {})
            };
            if (v === undefined) delete q[itemId];else q[itemId] = v;
            return {
              ...m,
              [r.id]: {
                ...(m[r.id] || {}),
                qty: q
              }
            };
          })
        }), !advancedOn && (single ? noteEl : excRow), !single && timesOn && React.createElement("span", {
          key: "time",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sd-spacing-2)'
          }
        }, React.createElement("span", {
          style: RD_ROW_HEAD
        }, `Time for ${first}`), React.createElement(RdTimeField, {
          value: r.at || time,
          onChange: v => set(r.id, {
            at: v
          }),
          ariaLabel: `Time for ${c.name}`,
          min: floorOf(c),
          minLabel: floorWord
        }))].filter(Boolean);
        const dense = fold && (off || headParts.length === 0 && stripParts.length === 0 && !prompt);
        const canToggle = fold && !off;
        return (React.createElement("div", {
            key: r.id,
            "data-rd-row": r.id,
            style: {
              display: 'flex',
              flexDirection: 'column',
              padding: `${dense ? 'var(--sd-spacing-2)' : 'var(--sd-spacing-3)'} var(--sd-spacing-3)`,
              borderRadius: 'var(--sd-radius-lg)',
              border: '1px solid var(--sd-colour-border-default)',
              background: r.fromPref && !off ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
            }
          }, React.createElement("div", {
            "data-rd-header": true,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sd-spacing-3)'
            }
          }, React.createElement("span", {
            onClick: canToggle ? e => toggleRow(r.id, e.currentTarget.closest('[data-rd-header]')) : undefined,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sd-spacing-3)',
              flex: '1 1 0',
              minWidth: 0,
              cursor: canToggle ? 'pointer' : undefined
            }
          }, React.createElement("span", {
            style: {
              display: 'flex',
              flexShrink: 0,
              opacity: off ? 0.45 : 1
            }
          }, React.createElement(RdKid, {
            c: c,
            size: 40
          })), React.createElement("span", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 0,
              flex: 1
            }
          }, React.createElement("span", {
            style: {
              fontSize: 16,
              fontWeight: 600,
              lineHeight: '20px',
              color: off ? sTone : undefined
            }
          }, c.name), summary)), hasState && !narrow && React.createElement(React.Fragment, null, React.createElement(RdSegmented, {
            options: perOptions,
            value: isNotApplied(r.value) ? null : r.value,
            onChange: setValue,
            ariaLabel: stateName,
            onNatural: setSegW
          }), pc.notApplied && React.createElement(RdNotAppliedToggle, {
            on: isNotApplied(r.value),
            name: c.name,
            onToggle: toggleNotApplied
          })), blocked && React.createElement("span", {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sd-spacing-2)',
              flexShrink: 0,
              color: sTone,
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }
          }, React.createElement(SdIcon, {
            name: "lock",
            size: 16
          }), narrow ? React.createElement("span", {
            style: RD_SR_ONLY
          }, "Can\u2019t log") : 'Can’t log'), !blocked && r.excluded && React.createElement("button", {
            type: "button",
            id: `rd-ab-${r.id}`,
            className: "ds-btn ds-btn--minimal ds-btn--sm",
            "aria-label": `Add back ${first}`,
            onClick: () => addBack(r.id),
            style: {
              flexShrink: 0
            }
          }, React.createElement(SdIcon, {
            name: "add",
            size: 16
          }), "Add back"), canToggle && React.createElement("button", {
            type: "button",
            id: `rd-tg-${r.id}`,
            "data-rd-toggle": r.id,
            className: "rd-acc-toggle",
            "aria-expanded": open,
            "aria-controls": `rd-pn-${r.id}`,
            "aria-label": toggleName,
            style: dense ? {
              margin: '-2px 0'
            } : undefined,
            onClick: e => toggleRow(r.id, e.currentTarget.closest('[data-rd-header]'))
          }, React.createElement("span", {
            className: "rd-acc-chevron",
            "aria-hidden": "true"
          }, React.createElement(SdIcon, {
            name: "chevron-down",
            size: 24
          })))), stripParts.length > 0 && React.createElement("div", {
            style: {
              paddingLeft: narrow ? 0 : 52,
              marginTop: 'var(--sd-spacing-2)'
            }
          }, React.createElement(RdSummaryParts, {
            parts: stripParts,
            style: {
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: sTone
            }
          })), prompt && !promptInBody && React.createElement("div", {
            style: {
              paddingLeft: narrow ? 0 : 52,
              marginTop: 'var(--sd-spacing-2)'
            }
          }, React.createElement(RdSleepPrompt, {
            prompt: prompt
          })), (cfg.attendance === 'out' && c.collect || !!rdHealthPills(c).length) && React.createElement("span", {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--sd-spacing-1) var(--sd-spacing-2)',
              paddingLeft: 52,
              marginTop: 'var(--sd-spacing-2)'
            }
          }, cfg.attendance === 'out' && React.createElement(RdCollectPill, {
            collect: c.collect,
            full: true
          }), React.createElement(RdHealthPills, {
            c: c
          })), mealOn && !off && items.length > 0 && (() => {
            const cf = rdMealConflicts(c, items);
            const un = rdMealUnchecked(c, items);
            return cf.length || un.length ? React.createElement(RdMealConflict, {
              c: c,
              conflicts: cf,
              unchecked: un
            }) : null;
          })(), r.named && !off && React.createElement("span", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              paddingLeft: narrow ? 0 : 52,
              marginTop: 'var(--sd-spacing-2)'
            }
          }, phone ? React.createElement(RdDropdown, {
            label: "",
            plain: true,
            wide: true,
            value: r.value,
            offLabel: "Who collected?",
            ariaLabel: `Collected by for ${c.name}`,
            options: rdCollectOptions(c, offline).map(o => {
              const [k, l] = Array.isArray(o) ? o : [o, o];
              return {
                key: k,
                label: l
              };
            }),
            onChange: v => set(r.id, {
              value: v,
              touched: true
            })
          }) : React.createElement(RdChoiceChips, {
            options: rdCollectOptions(c, offline),
            value: r.value,
            onChange: v => set(r.id, {
              value: v,
              touched: true
            }),
            ariaLabel: `Collected by for ${c.name}`
          }), rdNotOnPickup(c) && React.createElement("span", {
            style: {
              fontSize: 12.5,
              lineHeight: '16px',
              fontWeight: 600,
              color: sTone
            }
          }, rdNotOnPickup(c))), needsReason(r) && !off && React.createElement("span", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sd-spacing-3)',
              marginTop: 'var(--sd-spacing-2)',
              flexWrap: 'wrap',
              paddingLeft: 52
            }
          }, React.createElement(RdLabel, null, "Why not"), React.createElement(RdChoiceChips, {
            options: pc.reasonFor,
            value: r.value === pc.notApplied ? null : r.value,
            onChange: v => set(r.id, {
              value: v,
              touched: true
            }),
            ariaLabel: `Why sunscreen was not applied for ${c.name}`
          })), needsReason(r) && !off && React.createElement("input", {
            className: "fp-input",
            type: "text",
            value: r.note,
            "aria-label": `Reason for ${c.name}`,
            placeholder: "Reason \u2014 required, saved with this child\u2019s time",
            "aria-required": "true",
            onChange: e => set(r.id, {
              note: e.target.value
            }),
            style: {
              all: 'unset',
              boxSizing: 'border-box',
              height: 'var(--sd-spacing-touch-target)',
              padding: '0 14px',
              marginTop: 'var(--sd-spacing-2)',
              marginLeft: 52,
              borderRadius: 'var(--sd-radius-lg)',
              border: '1px solid var(--sd-colour-border-default)',
              fontFamily: 'var(--sd-font-family)',
              fontSize: 14
            }
          }), !fold && !off && body.length > 0 && React.createElement("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sd-spacing-3)',
              paddingLeft: narrow ? 0 : 52,
              marginTop: 'var(--sd-spacing-3)'
            }
          }, body), fold && !off && React.createElement("div", {
            id: `rd-pn-${r.id}`,
            "data-rd-panel": r.id,
            inert: open ? undefined : '',
            className: 'ds-accordion__panel' + (open ? ' ds-accordion__panel--open' : ''),
            style: {
              margin: '0 -4px'
            }
          }, React.createElement("div", {
            className: "ds-accordion__panel-inner",
            style: advancedOn && open && settledId === r.id ? {
              overflow: 'visible'
            } : undefined
          }, (open || leaving.includes(r.id)) && React.createElement("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sd-spacing-3)',
              padding: `var(--sd-spacing-3) 4px 4px ${(narrow ? 0 : 52) + 4}px`
            }
          }, body))))
        );
      })), asking && React.createElement("div", {
        style: {
          padding: '14px 22px 0',
          flexShrink: 0
        }
      }, React.createElement("div", {
        role: "alertdialog",
        "aria-label": "Discard this meal",
        "aria-describedby": "rd-disc-says",
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '12px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-red)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13.5,
          fontWeight: 700
        }
      }, "Discard this meal?"), React.createElement("span", {
        id: "rd-disc-says",
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-primary)'
        }
      }, result ? 'Some children are not saved yet. Closing leaves them unrecorded.' : 'What you added won’t be recorded.'), React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap'
        }
      }, React.createElement(RdTextAction, {
        id: "rd-disc-keep",
        color: "var(--sd-colour-text-primary)",
        onClick: () => setAsking(false)
      }, "Keep editing"), React.createElement("button", {
        type: "button",
        className: "ds-btn ds-btn--destructive ds-btn--sm",
        onClick: onClose
      }, "Discard")))), result && React.createElement("div", {
        style: {
          padding: '14px 22px 0',
          flexShrink: 0
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          padding: '11px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-red)'
        }
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-feedback-error-default)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: "warning",
        size: 20
      })), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13.5,
          fontWeight: 700
        }
      }, result.failedIds.length, " couldn\u2019t be saved"), React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.4,
          fontWeight: 600,
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, result.savedCount, " ", result.savedCount === 1 ? 'was' : 'were', " saved and ", result.savedCount === 1 ? 'has' : 'have', " left this list. Retry just ", result.failedIds.length === 1 ? 'this one' : 'these', ".")))), React.createElement(RdSheetFoot, {
        phone: phone,
        edge: true,
        inline: true,
        divider: !result,
        only: included.map(r => r.id),
        note: React.createElement(React.Fragment, null, included.length ? React.createElement(React.Fragment, null, "Logged as ", React.createElement("b", {
          style: {
            color: 'var(--sd-colour-text-primary)'
          }
        }, educator.name), setupOn && React.createElement(React.Fragment, null, " (", rdInitials(educator.name), ")"), " at ", RD_AMPM(time), (() => {
          const own = included.filter(r => r.at && r.at !== time).length;
          return own ? React.createElement(React.Fragment, null, " \xB7 ", own, " at ", own === 1 ? 'their own time' : 'their own times') : null;
        })(), mealOn && !single && (() => {
          const out = included.reduce((n, r) => n + items.filter(x => (mealOf(r.id).out || {})[x.id]).length, 0);
          const diff = included.filter(r => items.some(x => rdQty((mealOf(r.id).qty || {})[x.id], x.unit) != null)).length;
          return out || diff ? React.createElement(React.Fragment, null, " \xB7 ", [out ? `${out} offered, not taken` : null, diff ? `${diff} with a different amount` : null].filter(Boolean).join(' · ')) : null;
        })()) : blockedCount === rows.length ? single ? `${people[0].name.split(' ')[0]} can’t be recorded for this yet; the reason is on the row.` : 'None of these children can be recorded for this yet; the reason is on each row.' : single ? `${people[0].name.split(' ')[0]} is left out of this ${cfg.verb === 'Checked' ? 'check' : 'record'}. Add them back to record it.` : 'Everyone has been left out of this round. Add someone back to record it.', offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
          style: {
            color: RD_SYNC_FG,
            fontWeight: 600
          }
        }, "Saved on this device \xB7 syncs when there\u2019s signal")))
      }, result ? [React.createElement(RdAction, {
        key: "done",
        onClick: () => {
          if (onLeft) onLeft(people.filter(p => result.failedIds.includes(p.id)).map(p => p.name.split(' ')[0]));
          onClose();
        }
      }, "Not now"), React.createElement(RdAction, {
        key: "retry",
        primary: true,
        glyph: "refresh-update-arrow",
        onClick: retry
      }, "Retry ", result.failedIds.length)] : [React.createElement(RdAction, {
        key: "cancel",
        onClick: close
      }, "Cancel"), React.createElement(RdAction, {
        key: "confirm",
        primary: true,
        glyph: 'tick',
        muted: !included.length || noMeal || !!missing.length || !!noReason.length || !!noWho.length,
        onClick: included.length && !noMeal && !missing.length && !noReason.length && !noWho.length ? doConfirm : included.length && mealOn && noMeal ? fixMeal : undefined
      }, !included.length ? 'Nobody to log for' : noMeal ? mealGap : missing.length ? React.createElement(React.Fragment, null, "Pick what to record \xB7 ", missing.length, " left") : noReason.length ? React.createElement(React.Fragment, null, "Say why not applied \xB7 ", noReason.length, " left") : noWho.length ? React.createElement(React.Fragment, null, "Say who collected \xB7 ", noWho.length, " left") : cfg.attendance ? single ? cfg.attendance === 'absent' ? `Mark ${people[0].name.split(' ')[0]} absent` : `${cfg.label} ${people[0].name.split(' ')[0]}` : `${cfg.label} ${included.length}` : React.createElement(React.Fragment, null, included.some(needsReason) ? 'Recorded' : cfg.verb, " for ", single ? people[0].name.split(' ')[0] : included.length))])))
    );
  }
  const RD_MED_ROUTES = ['Oral', 'Injection', 'Inhaled', 'Topical', 'Ear drops', 'Eye drops', 'Nasal'];
  const RD_MED_UNITS = ['mL', 'fl oz', 'mg', 'tablet', 'dose', 'unit', 'puff', 'drop', 'spray'];
  const RD_MED_COUNTED = ['tablet', 'dose', 'unit', 'puff', 'drop', 'spray', 'application'];
  const rdDoseText = (amount, unit) => {
    const a = String(amount == null ? '' : amount).trim();
    const u = unit && RD_MED_COUNTED.includes(unit) && a !== '1' ? `${unit}s` : unit;
    return [a, u].filter(Boolean).join(' ');
  };
  const RD_MED_UNIT_WORDS = {
    ml: 'mL',
    mg: 'mg',
    'fl oz': 'fl oz',
    tablet: 'tablet',
    tablets: 'tablet',
    dose: 'dose',
    doses: 'dose',
    unit: 'unit',
    units: 'unit',
    puff: 'puff',
    puffs: 'puff',
    drop: 'drop',
    drops: 'drop',
    spray: 'spray',
    sprays: 'spray',
    application: 'application',
    applications: 'application'
  };
  const rdAuthDose = med => {
    const m = med && String(med.dose || '').trim().match(/^(\d+(?:\.\d+)?)\s*(fl oz|[a-zA-Z]+)/i);
    const unit = m && RD_MED_UNIT_WORDS[m[2].toLowerCase()];
    return unit ? {
      amount: m[1],
      unit
    } : null;
  };
  const rdNum = s => {
    const t = String(s).replace(/[^0-9.]/g, '');
    const i = t.indexOf('.');
    return (i < 0 ? t : t.slice(0, i + 1) + t.slice(i + 1).replace(/\./g, '')).slice(0, 6);
  };
  const RD_MED_REFERENCE = [{
    name: 'Adrenaline auto-injector',
    form: 'other',
    units: ['dose'],
    routes: ['Injection']
  }, {
    name: 'Amoxicillin',
    form: 'liquid',
    units: ['mL'],
    routes: ['Oral']
  }, {
    name: 'Cetirizine',
    form: 'liquid',
    units: ['mL'],
    routes: ['Oral']
  }, {
    name: 'Ear drops (antibiotic)',
    form: 'other',
    units: ['drop'],
    routes: ['Ear drops']
  }, {
    name: 'Hydrocortisone cream',
    form: 'other',
    units: ['application'],
    routes: ['Topical']
  }, {
    name: 'Ibuprofen',
    form: 'liquid',
    units: ['mL'],
    routes: ['Oral']
  }, {
    name: 'Ibuprofen tablets',
    form: 'tablet',
    units: ['tablet'],
    routes: ['Oral']
  }, {
    name: 'Loratadine',
    form: 'tablet',
    units: ['tablet'],
    routes: ['Oral']
  }, {
    name: 'Paracetamol',
    form: 'liquid',
    units: ['mL'],
    routes: ['Oral']
  }, {
    name: 'Paracetamol tablets',
    form: 'tablet',
    units: ['tablet', 'mg'],
    routes: ['Oral']
  }, {
    name: 'Prednisolone',
    form: 'liquid',
    units: ['mL'],
    routes: ['Oral']
  }, {
    name: 'Saline eye drops',
    form: 'other',
    units: ['drop'],
    routes: ['Eye drops']
  }, {
    name: 'Saline nasal spray',
    form: 'other',
    units: ['spray'],
    routes: ['Nasal']
  }, {
    name: 'Salbutamol',
    form: 'other',
    units: ['puff'],
    routes: ['Inhaled']
  }];
  const RD_MED_FORMS = [['all', 'All'], ['tablet', 'Tablet'], ['liquid', 'Liquid'], ['other', 'Other']];
  const RD_MED_OTHER = 'other';
  const RD_MED_NEXT_DUE = true;
  const rdSameMed = (a, b) => !!a && !!b && String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  const rdMedLine = m => [m.name, rdDoseText(m.amount, m.unit), m.route, m.outcome === 'Part dose' && m.partAmount ? `Part dose (${rdDoseText(m.partAmount, m.unit)} given)` : m.outcome || 'Given'].filter(Boolean).join(' · ');
  const rdNextText = n => !n ? null : n.mode === 'time' ? n.at ? `Next dose ${RD_AMPM(n.at)}` : null : n.mode === 'circumstances' ? n.when ? `Next dose only if needed — ${n.when}` : null : 'No further doses today';
  const rdMonthText = ym => {
    const m = /^(\d{4})-(\d{2})$/.exec(ym || '');
    return m ? `${RD_MONTH[Number(m[2]) - 1].slice(0, 3)} ${m[1]}` : '';
  };
  const rdMedDay = on => (RD_LOG_DAYS[on] || RD_LOG_DAYS[0]).day;
  const rdMedWhen = m => `${m.on ? `${m.on === 1 ? 'Yesterday' : rdShortDate(rdAddDays(RD_TODAY, -m.on))}, ` : ''}${RD_AMPM(m.at)}`;
  const rdPersonKey = s => String(s || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean).sort().join(' ');
  const rdSamePerson = (a, b) => {
    const x = rdPersonKey(a),
      y = rdPersonKey(b);
    return !!x && x === y;
  };
  const rdMedDecl = (who, first) => who === 'admin' ? `I gave ${first} the dose recorded above.` : `I watched ${first} being given the dose recorded above.`;
  const rdMedHistory = c => [...(c.doses || []).map(d => ({
    kind: 'dose',
    name: d.name,
    on: d.on || 0,
    at: d.at,
    by: (d.admin || {}).name || null,
    next: d.next || null,
    doseText: d.outcome === 'Part dose' && d.partAmount ? `${rdDoseText(d.partAmount, d.unit)} given (part dose)` : rdDoseText(d.amount, d.unit)
  })), ...(c.deletedDoses || []).map(d => ({
    kind: 'deleted',
    name: d.name,
    on: d.on || 0,
    at: d.at,
    by: d.by || null
  })), ...(c.incidents || []).map(i => ({
    kind: 'incident',
    name: null,
    on: i.on || 0,
    at: i.at,
    by: i.by || null
  }))].sort((a, b) => a.on - b.on || RD_MINS(b.at) - RD_MINS(a.at));
  const rdDoseEntry = (c, id) => {
    const d = (c.doses || []).find(x => x.id === id);
    return d ? {
      kind: 'med',
      at: d.at,
      detail: rdMedLine(d),
      note: d.note || null,
      context: null,
      type: null,
      rec: null,
      by: (d.admin || {}).name || null,
      med: d
    } : null;
  };
  const rdDeletedDose = (d, by) => ({
    id: d.id,
    name: d.name,
    on: d.on || 0,
    at: d.at,
    by
  });
  const rdAbsentOn = (c, offset) => {
    const k = rdSeed(c.id) + offset * 11;
    return k % 9 === 0 ? 'absent' : k % 13 === 0 ? 'on holiday' : null;
  };
  const rdNotHere = c => c.status === 'expected' ? 'hasn’t been signed in yet' : c.status === 'other' ? 'has no booking today' : c.status === 'gone' ? 'has been signed out' : c.status === 'holiday' ? 'is on holiday today' : 'is marked absent today';
  const RD_SIG_MIN_INK = 40;
  const rdSigRound = strokes => strokes.map(st => st.map(p => [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]));
  const rdSigMaxX = strokes => {
    let m = 0;
    strokes.forEach(st => st.forEach(p => {
      if (p[0] > m) m = p[0];
    }));
    return m;
  };
  const rdSigWidth = strokes => {
    let lo = Infinity,
      hi = -Infinity;
    strokes.forEach(st => st.forEach(p => {
      if (p[0] < lo) lo = p[0];
      if (p[0] > hi) hi = p[0];
    }));
    return hi > lo ? hi - lo : 0;
  };
  function RdSignaturePad({
    id,
    declaration,
    signerName,
    onChange,
    invalid = false,
    disabled = false,
    disabledText = 'Signing is not available yet'
  }) {
    const padRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const toggleRef = React.useRef(null);
    const typedRef = React.useRef(null);
    const s = React.useRef({
      strokes: [],
      ink: 0,
      scale: 160,
      cur: null,
      last: null
    });
    const [mode, setMode] = useState('drawn');
    const [inked, setInked] = useState(false);
    const [typed, setTyped] = useState('');
    const [signed, setSigned] = useState(false);
    const [wiped, setWiped] = useState(false);
    const pen = ctx => {
      ctx.strokeStyle = getComputedStyle(padRef.current).color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    const redraw = () => {
      const canvas = canvasRef.current;
      if (!canvas || !padRef.current) return;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      pen(ctx);
      s.current.strokes.forEach(st => {
        ctx.beginPath();
        st.forEach((p, i) => {
          const x = p[0] * s.current.scale,
            y = p[1] * s.current.scale;
          if (i) ctx.lineTo(x, y);else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + 0.1, y);
          }
        });
        ctx.stroke();
      });
    };
    const fit = () => {
      const pad = padRef.current,
        canvas = canvasRef.current;
      if (!pad || !canvas) return;
      const r = pad.getBoundingClientRect(),
        dpr = window.devicePixelRatio || 1;
      if (!r.width) return;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      const mx = rdSigMaxX(s.current.strokes);
      s.current.scale = mx ? Math.min(r.height, (r.width - 4) / mx) : r.height;
      redraw();
    };
    useEffect(() => {
      const ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
      if (ro && padRef.current) ro.observe(padRef.current);
      const mo = new MutationObserver(redraw);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-sd-theme', 'class']
      });
      return () => {
        if (ro) ro.disconnect();
        mo.disconnect();
      };
    }, []);
    useEffect(() => {
      if (mode === 'typed' && typedRef.current) typedRef.current.focus();
      if (mode === 'drawn') fit();
    }, [mode]);
    const emit = v => {
      setSigned(!!v);
      if (v) setWiped(false);
      if (onChange) onChange(v);
    };
    const wipe = () => {
      s.current.strokes = [];
      s.current.ink = 0;
      s.current.cur = null;
      setInked(false);
      redraw();
    };
    const drawnValue = () => s.current.ink >= RD_SIG_MIN_INK && rdSigWidth(s.current.strokes) >= 0.15 ? {
      mode: 'drawn',
      ink: {
        format: 'strokes-v1',
        unit: 'pad-height',
        strokes: rdSigRound(s.current.strokes)
      }
    } : null;
    const pt = e => {
      const r = canvasRef.current.getBoundingClientRect();
      const px = [Math.max(0, Math.min(r.width, e.clientX - r.left)), Math.max(0, Math.min(r.height, e.clientY - r.top))];
      return [px, [px[0] / r.height, px[1] / r.height]];
    };
    const down = e => {
      if (disabled || e.button > 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const q = pt(e),
        p = q[0],
        c = s.current;
      c.last = p;
      c.cur = [q[1]];
      c.strokes.push(c.cur);
      const ctx = canvasRef.current.getContext('2d');
      pen(ctx);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(p[0] + 0.1, p[1]);
      ctx.stroke();
      setInked(true);
    };
    const move = e => {
      const c = s.current;
      if (!c.cur) return;
      const q = pt(e),
        p = q[0],
        d = Math.hypot(p[0] - c.last[0], p[1] - c.last[1]);
      if (d < 1.5) return;
      const ctx = canvasRef.current.getContext('2d');
      pen(ctx);
      ctx.beginPath();
      ctx.moveTo(c.last[0], c.last[1]);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
      c.ink += d;
      c.last = p;
      c.cur.push(q[1]);
    };
    const end = () => {
      const c = s.current;
      if (!c.cur) return;
      c.cur = null;
      fit();
      emit(drawnValue());
    };
    const clear = () => {
      wipe();
      setWiped(true);
      emit(null);
      if (toggleRef.current) toggleRef.current.focus();
    };
    const toggle = () => {
      wipe();
      setTyped('');
      setWiped(false);
      setMode(m => m === 'drawn' ? 'typed' : 'drawn');
      emit(null);
    };
    const type = v => {
      setTyped(v);
      emit(v.trim() ? {
        mode: 'typed',
        name: v.trim()
      } : null);
    };
    const who = React.createElement("strong", null, signerName);
    return React.createElement("div", {
      className: 'ds-signature' + (inked ? ' has-ink' : '') + (signed ? ' is-signed' : '') + (invalid && !disabled ? ' ds-signature--error' : '') + (disabled ? ' ds-signature--disabled' : ''),
      role: "group",
      "aria-labelledby": `${id}-decl`,
      "aria-describedby": `${id}-err`
    }, React.createElement("p", {
      className: "ds-signature__decl",
      id: `${id}-decl`
    }, declaration), React.createElement("div", {
      className: "ds-signature__pad",
      ref: padRef,
      hidden: mode === 'typed'
    }, React.createElement("canvas", {
      className: "ds-signature__canvas",
      ref: canvasRef,
      "aria-hidden": "true",
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: end,
      onPointerCancel: end
    }), React.createElement("span", {
      className: "ds-signature__hint",
      "aria-hidden": "true"
    }, "Sign here")), React.createElement("div", {
      className: 'ds-input ds-signature__typed' + (invalid && mode === 'typed' ? ' ds-input--error' : ''),
      hidden: mode !== 'typed'
    }, React.createElement("label", {
      className: "ds-input__label",
      htmlFor: `${id}-typed`
    }, "Type your full name to sign"), React.createElement("div", {
      className: "ds-input__box"
    }, React.createElement("input", {
      ref: typedRef,
      className: "ds-input__field",
      id: `${id}-typed`,
      type: "text",
      autoComplete: "off",
      value: typed,
      disabled: disabled,
      "aria-describedby": `${id}-err`,
      onChange: e => type(e.target.value)
    }))), React.createElement("p", {
      className: "ds-signature__error",
      id: `${id}-err`,
      role: "alert"
    }, invalid && !disabled ? 'A signature is needed here.' : ''), React.createElement("div", {
      className: "ds-signature__bar"
    }, React.createElement("span", {
      className: "ds-signature__status",
      role: "status"
    }, React.createElement("svg", {
      className: "ds-icon",
      viewBox: "0 0 15 16",
      "aria-hidden": "true",
      focusable: "false"
    }, React.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.8676 2.61588C14.0877 2.80237 14.1273 3.14792 13.9561 3.38769L6.88886 13.2877C6.80592 13.4038 6.68372 13.479 6.54957 13.4962C6.41542 13.5135 6.28052 13.4714 6.17504 13.3795L1.12697 8.97949C0.909271 8.78973 0.873974 8.44362 1.04814 8.20643C1.2223 7.96924 1.53997 7.93078 1.75767 8.12053L6.40611 12.1722L13.1592 2.71236C13.3304 2.47259 13.6475 2.42939 13.8676 2.61588Z",
      fill: "currentColor"
    })), React.createElement("span", {
      className: "ds-signature__status-text"
    }, disabled ? disabledText : signed ? React.createElement(React.Fragment, null, "Signed as ", who) : wiped ? 'Not signed yet' : React.createElement(React.Fragment, null, "Signing as ", who))), React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--minimal ds-btn--sm ds-signature__clear",
      hidden: mode !== 'drawn' || !inked,
      onClick: clear
    }, "Clear"), React.createElement("button", {
      type: "button",
      ref: toggleRef,
      className: "ds-btn ds-btn--minimal ds-btn--sm ds-signature__toggle",
      disabled: disabled,
      onClick: toggle
    }, React.createElement("span", {
      className: "ds-btn__icon"
    }, React.createElement(SdIcon, {
      name: "edit",
      size: 16
    })), React.createElement("span", {
      className: "ds-signature__toggle-text"
    }, mode === 'drawn' ? 'Type my name instead' : 'Draw instead'))));
  }
  function RdSignatureReadback({
    capture,
    name,
    role,
    day,
    at,
    declaration
  }) {
    const strokes = capture && capture.mode === 'drawn' ? capture.ink.strokes : null;
    let d = '';
    if (strokes) strokes.forEach(st => st.forEach((p, i) => {
      d += `${i ? 'L' : 'M'}${(p[0] * 100).toFixed(1)} ${(p[1] * 100).toFixed(1)}`;
    }));
    return React.createElement("div", {
      className: "ds-signature ds-signature--readonly"
    }, declaration && React.createElement("p", {
      className: "ds-signature__decl"
    }, declaration), strokes && React.createElement("svg", {
      className: "ds-signature__ink",
      role: "img",
      "aria-label": `${name}’s drawn signature`,
      viewBox: `-5 -5 ${((rdSigMaxX(strokes) + 0.1) * 100 + 5).toFixed(1)} 110`,
      preserveAspectRatio: "xMinYMid meet"
    }, React.createElement("path", {
      d: d,
      vectorEffect: "non-scaling-stroke"
    })), React.createElement("p", {
      className: "ds-signature__by"
    }, "Signed by ", React.createElement("strong", null, name), role ? ` (${role})` : '', " ", day ? `${day} ` : '', "at ", RD_AMPM(at), " \xB7 ", capture && capture.mode === 'drawn' ? 'drew their signature' : `typed “${capture && capture.name || ''}”`));
  }
  const RdFixed = ({
    children
  }) => React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      alignSelf: 'flex-start',
      height: 44,
      padding: '0 14px',
      boxSizing: 'border-box',
      borderRadius: 'var(--sd-radius-lg)',
      background: 'var(--sd-colour-surface-grey)',
      fontSize: 14.5,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, children);
  const RD_MED_INPUT = {
    all: 'unset',
    boxSizing: 'border-box',
    width: '100%',
    height: 44,
    padding: '0 14px',
    borderRadius: 'var(--sd-radius-lg)',
    border: '1px solid var(--sd-colour-border-default)',
    fontFamily: 'var(--sd-font-family)',
    fontSize: 14.5
  };
  const RD_MED_ERR = {
    fontSize: 12.5,
    color: 'var(--sd-colour-feedback-error-default)',
    fontWeight: 600
  };
  function RdPick({
    value,
    options,
    onChange,
    placeholder,
    ariaLabel
  }) {
    const current = options.find(o => o.key === value);
    return React.createElement(RdDropdownShell, {
      reveal: true,
      label: current ? '' : placeholder,
      value: current ? current.short || current.label : '',
      ariaLabel: `${ariaLabel} — ${current ? current.label : 'none chosen'}`
    }, close => React.createElement(RdRadioRows, {
      options: options,
      value: value,
      onPick: k => {
        onChange(k);
        close();
      }
    }));
  }
  function RdMedList({
    options,
    value,
    first,
    phone,
    onPick
  }) {
    const [q, setQ] = useState('');
    const [form, setForm] = useState('all');
    const needle = q.trim().toLowerCase();
    const fits = o => !needle || o.label.toLowerCase().includes(needle);
    const onFile = options.filter(o => o.file && fits(o));
    const listed = options.filter(o => !o.file && o.key !== RD_MED_OTHER && fits(o) && (form === 'all' || o.form === form));
    const other = options.find(o => o.key === RD_MED_OTHER);
    const sub = 'var(--sd-colour-text-secondary)';
    const row = o => {
      const on = o.key === value;
      return React.createElement("button", {
        key: o.key,
        type: "button",
        onClick: () => onPick(o.key),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 52,
          padding: '8px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: on ? '2px solid var(--sd-colour-action-primary)' : '1px solid var(--sd-colour-border-default)',
          background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700
        }
      }, o.name), o.hint && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, o.hint)), on && React.createElement("span", {
        style: {
          color: 'var(--sd-colour-action-primary)'
        }
      }, React.createElement(SdIcon, {
        name: "tick",
        size: 16
      })), React.createElement("span", {
        style: {
          color: sub
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 14
      })));
    };
    return React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        margin: '-16px -22px 0',
        padding: '16px 22px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement(RdSearch, {
      value: q,
      onChange: setQ,
      count: onFile.length + listed.length,
      placeholder: "Search medicines",
      compact: true,
      autoFocus: !phone
    }), React.createElement(RdSegmented, {
      options: RD_MED_FORMS,
      value: form,
      onChange: setForm,
      ariaLabel: "Type of medicine"
    })), onFile.length > 0 && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "On file for ", first), onFile.map(row)), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, onFile.length ? 'All medicines' : 'Medicines'), listed.length ? listed.map(row) : React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: sub
      }
    }, "No medicine matches. Choose \u201CNot on the list\u2026\u201D to type its name.")), other && row(other));
  }
  function RdMonthField({
    value,
    onChange,
    max,
    ariaLabel
  }) {
    const ref = React.useRef(null);
    const [focused, setFocused] = useState(false);
    const open = e => {
      const el = ref.current;
      if (!el || typeof el.showPicker !== 'function') return;
      e.preventDefault();
      el.focus();
      try {
        el.showPicker();
      } catch (_) {}
    };
    return React.createElement("label", {
      onClick: open,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        height: 44,
        padding: '0 14px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        border: `2px solid ${value ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
        background: value ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
        color: value ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 17
    }), React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center'
      }
    }, React.createElement("input", {
      ref: ref,
      type: "month",
      value: value || '',
      max: max,
      "aria-label": ariaLabel,
      onChange: e => onChange(e.target.value),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      style: {
        fontFamily: 'var(--sd-font-family)',
        fontSize: 15,
        fontWeight: 700,
        border: 'none',
        background: 'transparent',
        color: value || focused ? 'inherit' : 'transparent',
        padding: 0,
        cursor: 'pointer'
      }
    }), !value && !focused && React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: 0,
        pointerEvents: 'none',
        fontSize: 15,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, "Month and year")));
  }
  const RD_MED_EXPIRY_SOON = 21;
  function rdMedExpiry(med) {
    if (!med || typeof med.expiresIn !== 'number') return null;
    const d = med.expiresIn;
    if (d < 0) return {
      expired: true,
      label: d === -1 ? 'Expired yesterday' : `Expired ${-d} days ago`
    };
    if (d === 0) return {
      soon: true,
      label: 'Expires today'
    };
    if (d <= RD_MED_EXPIRY_SOON) return {
      soon: true,
      label: d === 1 ? 'Expires tomorrow' : `Expires in ${d} days`
    };
    return {
      label: `Expires in ${d} days`
    };
  }
  function RdMedicationSheet(props) {
    return props.child.status === 'here' ? React.createElement(RdMedForm, props) : React.createElement(RdMedBlocked, props);
  }
  function RdMedBlocked({
    child,
    phone,
    onClose,
    onSignIn,
    onIncident
  }) {
    const full = rdPhoneFull(phone);
    const first = child.name.split(' ')[0];
    const canSignIn = (child.status === 'expected' || child.status === 'other') && !!onSignIn;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-med-blocked",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: "med",
      size: 22
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Record medication"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 19
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, React.createElement("span", {
      id: "rd-med-blocked",
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, first, " ", rdNotHere(child)), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "A dose is recorded for a child who is here.", canSignIn ? ` Sign ${first} in first.` : '', " If something has happened to ", first, ", start an incident record instead.")))), React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true
    }, React.createElement(RdAction, {
      glyph: "document",
      primary: !canSignIn,
      onClick: onIncident
    }, "Start an incident record instead"), canSignIn && React.createElement(RdAction, {
      primary: true,
      glyph: "signin",
      onClick: onSignIn
    }, "Sign in ", first))));
  }
  function RdMedForm({
    child,
    offline,
    phone,
    educator = RD_EDUCATOR,
    roleHint = '',
    initialDraft,
    onClose,
    onConfirm,
    onDismiss
  }) {
    const meds = child.meds || [];
    const first = child.name.split(' ')[0];
    const D0 = initialDraft && (!initialDraft.by || initialDraft.by === educator.name) ? initialDraft : {};
    const restored = D0 === initialDraft && !!initialDraft;
    const [step, setStep] = useState(D0.pick !== undefined || meds.length === 1 ? 'dose' : 'pick');
    const [tried, setTried] = useState(false);
    const [tried2, setTried2] = useState(false);
    const [pick, setPick] = useState(D0.pick !== undefined ? D0.pick : meds.length === 1 ? `auth:${meds[0].name}` : null);
    const authMed = pick ? meds.find(m => `auth:${m.name}` === pick) || null : null;
    const refName = pick && pick.startsWith('ref:') ? pick.slice(4) : null;
    const refMed = refName ? RD_MED_REFERENCE.find(r => r.name === refName) || null : null;
    const onFile = !!authMed;
    const onFileNames = meds.map(m => m.name.toLowerCase());
    const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
    const medOptions = [...meds.map(m => ({
      key: `auth:${m.name}`,
      name: m.name,
      label: `${m.name} · on file`,
      hint: [m.dose, m.route].filter(Boolean).join(' · '),
      file: true
    })), ...RD_MED_REFERENCE.filter(r => !onFileNames.includes(r.name.toLowerCase())).map(r => ({
      key: `ref:${r.name}`,
      name: r.name,
      label: r.name,
      hint: r.form === 'other' ? r.routes.join(', ') : cap(r.form),
      form: r.form
    })), {
      key: RD_MED_OTHER,
      name: 'Not on the list…',
      label: 'Not on the list…',
      hint: 'Type its name'
    }];
    const [freeName, setFreeName] = useState(D0.freeName || '');
    const [amount, setAmount] = useState(D0.amount || '');
    const [unitPick, setUnitPick] = useState(D0.unit || '');
    const [routePick, setRoutePick] = useState(D0.route || '');
    const [reason, setReason] = useState(D0.reason || '');
    const [expiry, setExpiry] = useState(D0.expiry || '');
    const [dayOff, setDayOff] = useState(D0.dayOff || 0);
    const [time, setTime] = useState(D0.time || RD_NOW);
    const [outcome, setOutcome] = useState(D0.outcome || 'Given');
    const [partAmount, setPartAmount] = useState(D0.partAmount || '');
    const [nextMode, setNextMode] = useState(D0.nextMode || 'time');
    const [nextAt, setNextAt] = useState(D0.nextAt || '');
    const [nextWhen, setNextWhen] = useState(D0.nextWhen || '');
    const [note, setNote] = useState(D0.note || '');
    const [adminRole, setAdminRole] = useState(D0.adminRole || roleHint);
    const [witName, setWitName] = useState(D0.witName || '');
    const [witRole, setWitRole] = useState(D0.witRole || '');
    const [adminSig, setAdminSig] = useState(null);
    const [witSig, setWitSig] = useState(null);
    const [epoch, setEpoch] = useState(0);
    const [wiped, setWiped] = useState(false);
    const authDose = onFile ? rdAuthDose(authMed) : null;
    const authFixed = onFile && !!authDose && !!authMed.route;
    const units = authFixed ? [authDose.unit] : refMed ? refMed.units : RD_MED_UNITS;
    const routes = authFixed ? [authMed.route] : refMed ? refMed.routes : RD_MED_ROUTES;
    const unit = units.includes(unitPick) ? unitPick : units.length === 1 ? units[0] : '';
    const route = routes.includes(routePick) ? routePick : routes.length === 1 ? routes[0] : '';
    const amt = authFixed ? authDose.amount : amount;
    const givenName = onFile ? authMed.name : refName || (pick === RD_MED_OTHER ? freeName.trim() : '');
    const expiryAuth = onFile ? rdMedExpiry(authMed) : null;
    const monthKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const expiryNone = expiry === 'none';
    const expiryMonth = /^\d{4}-\d{2}$/.test(expiry) ? expiry : '';
    const medExpired = !!expiryMonth && expiryMonth < monthKey(rdAddDays(RD_TODAY, -dayOff));
    const flags = [...(!onFile ? ['No authorisation on file'] : []), ...(expiryAuth && expiryAuth.expired ? ['Authorisation expired'] : []), ...(medExpired ? ['Medicine expired'] : [])];
    const absentThen = dayOff > 0 ? rdAbsentOn(child, dayOff) : null;
    const partOk = outcome !== 'Part dose' || Number(partAmount) > 0 && !(Number(amt) > 0 && Number(partAmount) >= Number(amt));
    const nextRec = nextMode === 'time' ? nextAt ? {
      mode: 'time',
      at: nextAt
    } : null : nextMode === 'circumstances' ? nextWhen.trim() ? {
      mode: 'circumstances',
      when: nextWhen.trim()
    } : null : {
      mode: 'none'
    };
    const need = [!givenName && ['medication', 'the medication'], !(Number(amt) > 0) && ['amount', 'the amount'], !unit && ['unit', 'the unit'], !route && ['route', 'the route'], !(expiryNone || expiryMonth) && ['expiry', 'the expiry date'], !reason.trim() && ['reason', 'why it’s given'], dayOff > 0 && !time && ['time', 'the time it was given'], !!absentThen && ['time', `a day ${first} was here`], !partOk && ['part', 'how much was given']].filter(Boolean);
    const gap = k => tried && need.some(([key]) => key === k);
    const hint = (k, text) => gap(k) ? React.createElement("span", {
      id: `rd-med-e-${k}`,
      role: "alert",
      style: RD_MED_ERR
    }, text) : null;
    const pickDay = k => {
      const n = Number(k);
      setDayOff(n);
      if (n > 0 && dayOff === 0) setTime('');
      if (n === 0 && (!time || RD_MINS(time) > RD_MINS(RD_NOW))) setTime(RD_NOW);
    };
    const toSign = () => {
      if (need.length) {
        setTried(true);
        requestAnimationFrame(() => {
          const el = document.getElementById(`rd-med-f-${need[0][0]}`);
          if (el) el.scrollIntoView({
            block: 'center'
          });
        });
        return;
      }
      setStep('sign');
    };
    const leaveSign = () => {
      if (adminSig || witSig) {
        setAdminSig(null);
        setWitSig(null);
        setEpoch(n => n + 1);
        setWiped(true);
      }
      setStep('dose');
    };
    const sameAsAdmin = !!witName.trim() && rdSamePerson(witName, educator.name);
    const adminReady = !!adminRole.trim();
    const witReady = !!witName.trim() && !sameAsAdmin && !!witRole.trim();
    const sNeed = [!adminRole.trim() && ['adminRole', 'your role'], !adminSig && ['adminSig', 'your signature'], (!witName.trim() || sameAsAdmin) && ['witName', 'the witness’s name'], !witRole.trim() && ['witRole', 'the witness’s role'], !witSig && ['witSig', 'the witness’s signature']].filter(Boolean);
    const sGap = k => tried2 && sNeed.some(([key]) => key === k);
    const joinAnd = a => a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0];
    const adminSay = [!adminRole.trim() && 'role', !adminSig && 'signature'].filter(Boolean);
    const witSay = [(!witName.trim() || sameAsAdmin) && 'name', !witRole.trim() && 'role', !witSig && 'signature'].filter(Boolean);
    const sSay = [adminSay.length && `your ${joinAnd(adminSay)}`, witSay.length && `the witness’s ${joinAnd(witSay)}`].filter(Boolean).join(', and ');
    const confirm = () => {
      if (sNeed.length) {
        setTried2(true);
        requestAnimationFrame(() => {
          const el = document.getElementById(`rd-med-f-${sNeed[0][0]}`);
          if (el) el.scrollIntoView({
            block: 'center'
          });
        });
        return;
      }
      onConfirm({
        note: note.trim() || null,
        med: {
          id: `dose-${Date.now()}`,
          name: givenName,
          source: onFile ? 'file' : refName ? 'reference' : 'other',
          amount: amt,
          unit,
          route,
          outcome,
          partAmount: outcome === 'Part dose' ? partAmount : null,
          reason: reason.trim(),
          expiry: expiryNone ? 'none' : expiryMonth,
          on: dayOff,
          at: time,
          next: nextRec,
          note: note.trim() || null,
          flags,
          admin: {
            name: educator.name,
            role: adminRole.trim(),
            sig: adminSig,
            at: RD_NOW
          },
          witness: {
            name: witName.trim(),
            role: witRole.trim(),
            sig: witSig,
            at: RD_NOW
          },
          signed: true
        }
      });
    };
    const draft = () => ({
      by: educator.name,
      pick,
      freeName,
      amount,
      unit: unitPick,
      route: routePick,
      reason,
      expiry,
      dayOff,
      time,
      outcome,
      partAmount,
      nextMode,
      nextAt,
      nextWhen,
      note,
      adminRole,
      witName,
      witRole
    });
    const hasContent = () => !!(note.trim() || freeName.trim() || amount.trim() || reason.trim() || expiry || partAmount.trim() || witName.trim() || pick && !authMed);
    const dismiss = () => onDismiss && hasContent() ? onDismiss(draft(), {
      signed: !!(adminSig || witSig)
    }) : onClose();
    const back = () => step === 'sign' ? leaveSign() : step === 'pick' && pick ? setStep('dose') : dismiss();
    const backRef = React.useRef(back);
    backRef.current = back;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') backRef.current();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, []);
    const bodyRef = React.useRef(null);
    const titleRef = React.useRef(null);
    const firstStep = React.useRef(true);
    useEffect(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (firstStep.current) {
        firstStep.current = false;
        return;
      }
      if (step === 'pick' && !phone) return;
      if (titleRef.current) titleRef.current.focus({
        preventScroll: true
      });
    }, [step]);
    const hist = rdMedHistory(child);
    const lastThis = givenName ? hist.find(h => h.kind === 'dose' && rdSameMed(h.name, givenName)) : null;
    const othersToday = [];
    hist.forEach(h => {
      if (h.kind === 'dose' && h.on === 0 && !rdSameMed(h.name, givenName) && !othersToday.some(o => rdSameMed(o.name, h.name))) othersToday.push(h);
    });
    const incidentToday = hist.find(h => h.kind === 'incident' && h.on === 0) || null;
    const deletedSame = givenName ? hist.find(h => h.kind === 'deleted' && rdSameMed(h.name, givenName)) : null;
    const deletedLive = !!deletedSame && (!lastThis || (lastThis.on === deletedSame.on ? RD_MINS(lastThis.at) < RD_MINS(deletedSame.at) : lastThis.on > deletedSame.on));
    const minsSince = lastThis && lastThis.on === 0 ? RD_MINS(RD_NOW) - RD_MINS(lastThis.at) : null;
    const close = minsSince !== null && minsSince >= 0 && minsSince < 120;
    const warm = close || !!incidentToday || deletedLive;
    const full = rdPhoneFull(phone);
    const signing = step === 'sign';
    const picking = step === 'pick';
    const chosen = medOptions.find(o => o.key === pick);
    const fieldStyle = locked => ({
      ...RD_MED_INPUT,
      ...(locked ? {
        background: 'var(--sd-colour-surface-grey)',
        color: 'var(--sd-colour-text-secondary)'
      } : null)
    });
    const preview = {
      name: givenName,
      amount: amt,
      unit,
      route,
      outcome,
      partAmount
    };
    const healthPills = rdHealthPills(child);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: signing && (adminSig || witSig) ? undefined : dismiss,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: signing && (adminSig || witSig) ? 'default' : 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-med-title",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        maxHeight: '100%',
        ...(picking ? {
          height: '100%'
        } : null),
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: back
    }), React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: "med",
      size: 22
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      id: "rd-med-title",
      ref: titleRef,
      tabIndex: -1,
      style: {
        fontSize: 18,
        fontWeight: 700,
        outline: 'none'
      }
    }, signing ? 'Sign the record' : picking ? 'Choose a medication' : 'Record medication'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: dismiss,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      ref: bodyRef,
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, picking && React.createElement(RdMedList, {
      options: medOptions,
      value: pick,
      first: first,
      phone: phone,
      onPick: k => {
        setPick(k);
        setStep('dose');
      }
    }), !signing && !picking && React.createElement(React.Fragment, null, restored && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12.5,
        fontWeight: 600,
        color: RD_SYNC_FG,
        background: RD_SYNC_BG,
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 14
    }), "Draft restored \u2014 you dismissed this without saving."), healthPills.length > 0 && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, React.createElement(RdHealthPills, {
      c: child
    })), React.createElement("span", {
      id: "rd-med-f-medication",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Medication"), React.createElement("button", {
      type: "button",
      onClick: () => setStep('pick'),
      className: "fp-btn",
      "aria-label": `Medication — ${chosen ? chosen.label : 'none chosen'}. Change`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 44,
        padding: '0 14px',
        maxWidth: '100%',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)',
        fontSize: 14.5,
        fontWeight: 700,
        color: chosen ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement("span", {
      style: {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, chosen ? chosen.label : 'Choose a medication'), React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 14
    }))), pick === RD_MED_OTHER && React.createElement("input", {
      className: "fp-input",
      autoFocus: true,
      type: "text",
      value: freeName,
      onChange: e => setFreeName(e.target.value),
      "aria-label": "Medication name",
      placeholder: "Name as it appears on the label",
      style: RD_MED_INPUT
    }), hint('medication', 'Needed before this can be saved.')), onFile ? React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: '13px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-cyan)'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-action-primary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "badge",
      size: 17
    })), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, authMed.name), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "\xB7 ", authMed.dose, authMed.route ? ` · ${authMed.route}` : '')), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "Authorised: ", authMed.auth, " \xB7 ", authMed.authBy, " \xB7 ", authMed.authOn), authMed.window && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "When: ", authMed.window), expiryAuth && !expiryAuth.expired && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: expiryAuth.soon ? 700 : 500,
        color: expiryAuth.soon ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-on-cyan)'
      }
    }, expiryAuth.label, expiryAuth.soon ? ' — ask the office to renew it' : '')), expiryAuth && expiryAuth.expired && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 19
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Authorisation expired \xB7 ", expiryAuth.label.toLowerCase()), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Record the dose anyway if it has been given \u2014 the record will be flagged so the office can chase a renewal for ", first, ".")))) : React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 19
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, meds.length ? `No authorisation on file for ${givenName || 'this medication'}` : 'No authorisation on file in Office'), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Record the dose anyway \u2014 the service may hold a paper form. The record will be flagged for follow-up so the authorisation gets onto ", first, "\u2019s file."))), (givenName || othersToday.length > 0 || incidentToday) && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: warm ? 'var(--sd-colour-surface-orange)' : 'var(--sd-colour-surface-grey)'
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        marginTop: 1,
        color: warm ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 18
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, givenName && React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, lastThis ? lastThis.on === 0 ? `Last given ${RD_AMPM(lastThis.at)}${rdAgo(lastThis.at) ? ` · ${rdAgo(lastThis.at)}` : ''}` : `Last given ${rdMedDay(lastThis.on).toLowerCase()}, ${RD_AMPM(lastThis.at)}` : deletedLive ? `No dose of ${givenName} is on the record now` : `No earlier dose of ${givenName} recorded`), givenName && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: close ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, lastThis ? [lastThis.doseText, lastThis.by && `by ${lastThis.by}`].filter(Boolean).join(' · ') || `Recorded against ${first}.` : `Nothing recorded for ${first} in the app — check the paper chart if the service keeps one.`), close && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Check the dosing interval before giving another dose."), RD_MED_NEXT_DUE && lastThis && rdNextText(lastThis.next) && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: close ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, rdNextText(lastThis.next), " \xB7 set when it was last given"), othersToday.length > 0 && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: warm ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, "Also given today: ", othersToday.map(o => `${o.name} ${RD_AMPM(o.at)}`).join(' · ')), incidentToday && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "An incident record was made today at ", RD_AMPM(incidentToday.at), ". Check whether any medicine was given for it."), deletedLive && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "A dose of ", deletedSame.name, " at ", RD_AMPM(deletedSame.at), " was deleted from the record", deletedSame.by ? ` by ${deletedSame.by}` : '', ". If it was given, record it again, and check the paper chart before giving another."))), pick && React.createElement(React.Fragment, null, !authFixed && React.createElement(React.Fragment, null, React.createElement("div", {
      id: "rd-med-f-amount",
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start'
      }
    }, React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: '0 0 112px'
      }
    }, React.createElement(RdLabel, null, "Amount"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      inputMode: "decimal",
      value: amount,
      onChange: e => setAmount(rdNum(e.target.value)),
      placeholder: "e.g. 5",
      style: RD_MED_INPUT
    })), React.createElement("span", {
      id: "rd-med-f-unit",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: '1 1 0',
        minWidth: 0
      }
    }, React.createElement(RdLabel, null, "Unit"), units.length === 1 ? React.createElement(RdFixed, null, unit) : React.createElement("span", {
      style: {
        paddingTop: 2
      }
    }, React.createElement(RdPick, {
      value: unit,
      options: units.map(u => ({
        key: u,
        label: u
      })),
      onChange: setUnitPick,
      placeholder: "Choose a unit",
      ariaLabel: "Unit"
    })))), (gap('amount') || gap('unit')) && React.createElement("span", {
      style: {
        ...RD_MED_ERR,
        marginTop: -8
      }
    }, gap('amount') ? 'Needed — how much is being given.' : 'Needed — the unit it is measured in.'), React.createElement("span", {
      id: "rd-med-f-route",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Route"), routes.length === 1 ? React.createElement("span", null, React.createElement(RdFixed, null, route)) : React.createElement("span", null, React.createElement(RdPick, {
      value: route,
      options: routes.map(r => ({
        key: r,
        label: r
      })),
      onChange: setRoutePick,
      placeholder: "How it is given",
      ariaLabel: "Route"
    })), hint('route', 'Needed — how it is being given.'))), React.createElement("span", {
      id: "rd-med-f-expiry",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Medicine expiry date"), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, expiryNone ? React.createElement(RdFixed, null, "None on the label") : React.createElement(RdMonthField, {
      value: expiryMonth,
      onChange: setExpiry,
      max: monthKey(rdAddDays(RD_TODAY, 5 * 365)),
      ariaLabel: "Medicine expiry month"
    }), React.createElement(RdTextAction, {
      onClick: () => setExpiry(expiryNone ? '' : 'none')
    }, expiryNone ? 'Add a date' : 'No date on it')), hint('expiry', 'Needed — read it off the label, or say there isn’t one.'), medExpired && React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        flexShrink: 0,
        marginTop: 1
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 19
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "This medicine expired in ", rdMonthText(expiryMonth)), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Don\u2019t give it. If it has already been given, record the dose anyway \u2014 the record will be flagged.")))), React.createElement("label", {
      id: "rd-med-f-reason",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Why it\u2019s being given"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: reason,
      maxLength: 120,
      onChange: e => setReason(e.target.value),
      placeholder: "e.g. fever, wheeze, hay fever",
      "aria-invalid": gap('reason') || undefined,
      "aria-describedby": gap('reason') ? 'rd-med-e-reason' : undefined,
      style: RD_MED_INPUT
    }), hint('reason', 'Needed before this can be saved.')), React.createElement("span", {
      id: "rd-med-f-time",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "When it was given"), React.createElement("span", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, React.createElement("span", {
      style: {
        paddingTop: 2
      }
    }, React.createElement(RdPick, {
      value: String(dayOff),
      options: RD_LOG_DAYS.map(d => {
        const dt = rdShortDate(rdAddDays(RD_TODAY, -d.offset));
        return {
          key: String(d.offset),
          label: d.offset ? `${d.day} · ${dt}` : d.day,
          short: d.offset ? dt : d.day
        };
      }),
      onChange: pickDay,
      placeholder: "Day",
      ariaLabel: "Day it was given"
    })), React.createElement(RdTimeField, {
      value: time,
      onChange: setTime,
      ariaLabel: "Time",
      future: dayOff > 0
    })), hint('time', 'Needed — the time it was given.'), absentThen && React.createElement("span", {
      style: RD_MED_ERR
    }, first, " was marked ", absentThen, " that day, so no dose can be recorded for it."), dayOff > 0 && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "A late entry: it goes on the log for ", dayOff === 1 ? 'yesterday' : rdShortDate(rdAddDays(RD_TODAY, -dayOff)), ", and the audit trail records when it was entered.")), React.createElement("span", {
      id: "rd-med-f-part",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Outcome"), React.createElement(RdSegmented, {
      options: ['Given', 'Part dose'],
      value: outcome,
      onChange: setOutcome,
      ariaLabel: "Dose outcome"
    }), outcome === 'Part dose' && React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginTop: 3
      }
    }, React.createElement(RdLabel, null, "How much was actually given"), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("input", {
      className: "fp-input",
      autoFocus: true,
      type: "text",
      inputMode: "decimal",
      value: partAmount,
      onChange: e => setPartAmount(rdNum(e.target.value)),
      placeholder: "e.g. 2",
      "aria-label": "Amount actually given",
      style: {
        ...RD_MED_INPUT,
        flex: '0 0 112px',
        width: 112
      }
    }), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, unit, Number(amt) > 0 ? ` · of ${rdDoseText(amt, unit)}` : '')), gap('part') && React.createElement("span", {
      style: RD_MED_ERR
    }, Number(partAmount) > 0 ? 'A part dose is less than the full dose — choose Given if it was all of it.' : 'Needed — “part dose” without an amount isn’t a record.'))), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Next dose"), React.createElement(RdSegmented, {
      options: phone ? [['time', 'At a time'], ['circumstances', 'If needed'], ['none', 'No more']] : [['time', 'At a set time'], ['circumstances', 'Only if needed'], ['none', 'No further doses']],
      value: nextMode,
      onChange: setNextMode,
      ariaLabel: "When the next dose is due"
    }), nextMode === 'time' && React.createElement(RdTimeField, {
      value: nextAt,
      onChange: setNextAt,
      ariaLabel: "Time of the next dose",
      future: true
    }), nextMode === 'circumstances' && React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: nextWhen,
      onChange: e => setNextWhen(e.target.value),
      placeholder: "What has to happen first \u2014 e.g. if wheezing returns",
      style: RD_MED_INPUT
    }), nextMode === 'time' && !nextAt && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)',
        fontWeight: 600
      }
    }, "Leave it empty if you don\u2019t know yet.")), React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Note (optional)"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: note,
      onChange: e => setNote(e.target.value),
      placeholder: "Anything worth passing on",
      style: RD_MED_INPUT
    })))), signing && React.createElement(React.Fragment, null, wiped && !adminSig && !witSig && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)',
        background: 'var(--sd-colour-surface-orange)',
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 14
    })), "You went back to the dose, so it needs signing again."), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '13px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-subtle)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        overflowWrap: 'anywhere'
      }
    }, rdMedLine(preview)), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        overflowWrap: 'anywhere'
      }
    }, "For ", reason.trim()), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, rdMedWhen({
      on: dayOff,
      at: time
    }), " \xB7 ", expiryNone ? 'No expiry on the label' : `Expires ${rdMonthText(expiryMonth)}`), flags.map(f => React.createElement("span", {
      key: f,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: 600
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "warning",
      size: 14
    })), "Flagged \u2014 ", f))), React.createElement(RdTextAction, {
      onClick: leaveSign,
      ariaLabel: "Change the dose"
    }, "Change")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement(RdLabel, null, "Given by"), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: phone ? 'column' : 'row',
        gap: 10
      }
    }, React.createElement("span", {
      style: {
        flex: '1 1 0',
        minWidth: 0
      }
    }, React.createElement(RdFixed, null, educator.name)), React.createElement("label", {
      id: "rd-med-f-adminRole",
      style: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: adminRole,
      maxLength: 40,
      disabled: !!adminSig,
      onChange: e => setAdminRole(e.target.value),
      "aria-label": "Your role",
      placeholder: "Your role, e.g. Educator",
      style: fieldStyle(!!adminSig)
    }), sGap('adminRole') && React.createElement("span", {
      style: RD_MED_ERR
    }, "Needed \u2014 your role."))), React.createElement("div", {
      id: "rd-med-f-adminSig"
    }, React.createElement(RdSignaturePad, {
      key: `a${epoch}`,
      id: "rd-sig-admin",
      declaration: rdMedDecl('admin', first),
      signerName: educator.name,
      onChange: v => {
        setAdminSig(v);
        if (v) setWiped(false);
      },
      invalid: sGap('adminSig'),
      disabled: !adminReady,
      disabledText: "Add your role first"
    }))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement(RdLabel, null, "Witnessed by"), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: phone ? 'column' : 'row',
        gap: 10
      }
    }, React.createElement("label", {
      id: "rd-med-f-witName",
      style: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: witName,
      maxLength: 60,
      autoComplete: "off",
      disabled: !!witSig,
      onChange: e => setWitName(e.target.value),
      "aria-label": "Witness\u2019s name",
      placeholder: "Witness\u2019s name",
      style: fieldStyle(!!witSig)
    })), React.createElement("label", {
      id: "rd-med-f-witRole",
      style: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: witRole,
      maxLength: 40,
      autoComplete: "off",
      disabled: !!witSig,
      onChange: e => setWitRole(e.target.value),
      "aria-label": "Witness\u2019s role",
      placeholder: "Their role, e.g. Educator",
      style: fieldStyle(!!witSig)
    }))), sameAsAdmin && React.createElement("span", {
      style: RD_MED_ERR
    }, "The witness has to be someone other than ", educator.name.split(' ')[0], "."), !sameAsAdmin && (sGap('witName') || sGap('witRole')) && React.createElement("span", {
      style: RD_MED_ERR
    }, "Needed \u2014 the witness\u2019s ", sGap('witName') ? 'name' : 'role', "."), React.createElement("div", {
      id: "rd-med-f-witSig"
    }, React.createElement(RdSignaturePad, {
      key: `w${epoch}`,
      id: "rd-sig-witness",
      declaration: rdMedDecl('witness', first),
      signerName: witName.trim(),
      onChange: v => {
        setWitSig(v);
        if (v) setWiped(false);
      },
      invalid: sGap('witSig'),
      disabled: !witReady,
      disabledText: sameAsAdmin ? 'The witness has to be someone else' : 'Add the witness’s name and role first'
    }))))), picking ? null : !signing ? React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      keep: hasContent() ? dismiss : undefined,
      note: !pick ? 'Choose the medication first.' : need.length ? React.createElement(React.Fragment, null, "Still needed: ", need.map(([, l]) => l).join(', ')) : React.createElement(React.Fragment, null, "Given by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), dayOff ? ` · ${rdMedWhen({
        on: dayOff,
        at: time
      })}` : ` at ${RD_AMPM(time)}`, flags.map(f => React.createElement("span", {
        key: f
      }, React.createElement("br", null), React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)',
          fontWeight: 600
        }
      }, "Flagged \u2014 ", f.charAt(0).toLowerCase() + f.slice(1)))), offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: "edit",
      muted: need.length > 0,
      onClick: toSign
    }, "Next: sign")) : React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      keep: hasContent() ? dismiss : undefined,
      note: sNeed.length ? React.createElement(React.Fragment, null, "Still needed: ", sSay) : React.createElement(React.Fragment, null, "Given by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), " \xB7 witnessed by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, witName.trim()), offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: leaveSign
    }, "Back"), React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      muted: sNeed.length > 0,
      onClick: confirm
    }, "Record dose"))));
  }
  const RD_CHILD_EVENTS = [{
    key: 'sleep',
    label: 'Sleep check',
    hint: 'Position, breathing, how they were found'
  }, {
    key: 'nappy',
    label: 'Nappy / toileting',
    hint: 'Changed, or assisted with toileting'
  }, {
    key: 'meal',
    label: 'Meal',
    hint: 'What was served, with an amount for each'
  }, {
    key: 'sun',
    label: 'Sunscreen',
    hint: 'Applied'
  }, {
    key: 'med',
    label: 'Medication',
    hint: 'A dose against this child only'
  }, {
    key: 'note',
    label: 'Quick note',
    hint: 'Anything worth passing on'
  }, {
    key: 'incident',
    label: 'Incident',
    hint: 'Injury, illness or something that needs a record'
  }, {
    key: 'learning',
    label: 'Learning',
    hint: 'A post about this child'
  }];
  const rdLearning = {
    start: null,
    on: () => !!rdLearning.start && svcOn('learning') && !!RD_DEST.learning.body
  };
  function RdEventChooser({
    child,
    roomEvents,
    phone,
    onPick,
    onClose
  }) {
    const events = RD_CHILD_EVENTS.filter(e => e.key === 'learning' ? rdLearning.on() : e.key === 'incident' ? svcOn('incidents') : e.key === 'note' || !roomEvents || roomEvents[e.key]);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const full = rdPhoneFull(phone);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement(RdKid, {
      c: child,
      size: 40
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Log an event"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '12px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, events.map(e => React.createElement("button", {
      key: e.key,
      type: "button",
      onClick: () => onPick(e.key),
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdColourIcon, {
      kind: e.key,
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, e.label), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, e.hint)), React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    })))))));
  }
  const RD_INC_NATURES = [{
    key: 'graze',
    label: 'Abrasion or graze',
    tag: 'trauma'
  }, {
    key: 'bite-child',
    label: 'Bite by a child',
    tag: 'trauma'
  }, {
    key: 'bite-animal',
    label: 'Bite by an animal',
    tag: 'trauma'
  }, {
    key: 'sting',
    label: 'Insect bite or sting',
    tag: 'trauma'
  }, {
    key: 'bruise',
    label: 'Bruise or bump',
    tag: 'trauma'
  }, {
    key: 'burn',
    label: 'Burn or scald',
    tag: 'trauma'
  }, {
    key: 'choking',
    label: 'Choking',
    tag: 'trauma'
  }, {
    key: 'head-knock',
    label: 'Concussion or head knock',
    tag: 'trauma'
  }, {
    key: 'crush',
    label: 'Crush or trapped finger',
    tag: 'trauma'
  }, {
    key: 'cut',
    label: 'Cut or laceration',
    tag: 'trauma'
  }, {
    key: 'dental',
    label: 'Dental injury',
    tag: 'trauma'
  }, {
    key: 'dislocation',
    label: 'Dislocation',
    tag: 'trauma'
  }, {
    key: 'eye',
    label: 'Eye injury',
    tag: 'trauma'
  }, {
    key: 'fall-height',
    label: 'Fall from a height',
    tag: 'trauma'
  }, {
    key: 'fall-level',
    label: 'Fall at ground level',
    tag: 'trauma'
  }, {
    key: 'foreign',
    label: 'Foreign object in ear, nose or eye',
    tag: 'trauma'
  }, {
    key: 'fracture',
    label: 'Fracture (suspected or confirmed)',
    tag: 'trauma'
  }, {
    key: 'nosebleed',
    label: 'Nosebleed',
    tag: 'trauma'
  }, {
    key: 'poison',
    label: 'Poisoning or ingestion',
    tag: 'trauma'
  }, {
    key: 'puncture',
    label: 'Puncture wound',
    tag: 'trauma'
  }, {
    key: 'splinter',
    label: 'Splinter',
    tag: 'trauma'
  }, {
    key: 'sprain',
    label: 'Sprain or strain',
    tag: 'trauma'
  }, {
    key: 'swallowed',
    label: 'Swallowed object',
    tag: 'trauma'
  }, {
    key: 'missing',
    label: 'Child missing or unaccounted for',
    tag: 'trauma',
    ask: 'missing'
  }, {
    key: 'removed',
    label: 'Child taken or removed from the premises',
    tag: 'trauma',
    ask: 'removed'
  }, {
    key: 'locked',
    label: 'Child locked in or out',
    tag: 'trauma',
    ask: 'removed'
  }, {
    key: 'behaviour',
    label: 'Behavioural concern',
    tag: 'trauma'
  }, {
    key: 'near-miss',
    label: 'Near miss',
    tag: 'trauma'
  }, {
    key: 'allergic',
    label: 'Allergic reaction',
    tag: 'illness'
  }, {
    key: 'anaphylaxis',
    label: 'Anaphylaxis',
    tag: 'illness'
  }, {
    key: 'asthma',
    label: 'Asthma attack',
    tag: 'illness'
  }, {
    key: 'breathing',
    label: 'Breathing difficulty',
    tag: 'illness'
  }, {
    key: 'faint',
    label: 'Fainting or collapse',
    tag: 'illness'
  }, {
    key: 'fever',
    label: 'Fever or high temperature',
    tag: 'illness'
  }, {
    key: 'rash',
    label: 'Rash or skin reaction',
    tag: 'illness'
  }, {
    key: 'seizure',
    label: 'Seizure or convulsion',
    tag: 'illness'
  }, {
    key: 'heat',
    label: 'Sunburn or heat illness',
    tag: 'illness'
  }, {
    key: 'gastro',
    label: 'Vomiting or diarrhoea',
    tag: 'illness'
  }];
  const RD_INC_TAGS = [['all', 'All'], ['trauma', 'Injury or trauma'], ['illness', 'Illness']];
  const RD_INC_ROLES = ['Parent', 'Guardian', 'Director', 'Educator', 'Coordinator', 'Nominated supervisor', 'Other agency', 'Regulatory authority', 'Other'].map(r => ({
    key: r,
    label: r
  }));
  const rdIncRole = rel => /^(mother|father)$/i.test(String(rel)) ? 'Parent' : /guardian/i.test(String(rel)) ? 'Guardian' : 'Other';
  const RD_INC_STEPS = ['What happened', 'What was done', 'Who was told', 'Review', 'Sign'];
  const RD_INC_POLICY = {
    draftsSeen: 'everyone'
  };
  const RD_INC_AREAS = {
    front: [['head', 'Head'], ['face', 'Face'], ['neck', 'Neck'], ['chest', 'Chest'], ['tummy', 'Tummy'], ['arm-r', 'Right arm'], ['arm-l', 'Left arm'], ['hand-r', 'Right hand'], ['hand-l', 'Left hand'], ['leg-r', 'Right leg'], ['leg-l', 'Left leg'], ['foot-r', 'Right foot'], ['foot-l', 'Left foot']],
    back: [['head', 'Back of head'], ['neck', 'Neck'], ['upper', 'Upper back'], ['lower', 'Lower back'], ['bottom', 'Bottom'], ['arm-r', 'Right arm'], ['arm-l', 'Left arm'], ['hand-r', 'Right hand'], ['hand-l', 'Left hand'], ['leg-r', 'Right leg'], ['leg-l', 'Left leg'], ['foot-r', 'Right foot'], ['foot-l', 'Left foot']]
  };
  const RD_INC_ZONES = [{
    k: 'head',
    g: [54, 2, 52, 56]
  }, {
    k: 'face',
    g: [62, 34, 36, 22],
    only: 'front',
    pad: 0
  }, {
    k: 'neck',
    g: [70, 58, 20, 12],
    pad: 2
  }, {
    k: 'chest',
    g: [46, 72, 68, 44],
    only: 'front'
  }, {
    k: 'upper',
    g: [46, 72, 68, 44],
    only: 'back'
  }, {
    k: 'tummy',
    g: [50, 118, 60, 42],
    only: 'front'
  }, {
    k: 'lower',
    g: [50, 118, 60, 42],
    only: 'back'
  }, {
    k: 'bottom',
    g: [50, 162, 60, 24],
    only: 'back'
  }, {
    k: 'arm',
    p: 'l',
    g: [18, 76, 24, 70]
  }, {
    k: 'arm',
    p: 'r',
    g: [118, 76, 24, 70]
  }, {
    k: 'hand',
    p: 'l',
    g: [18, 150, 24, 24],
    pad: 8
  }, {
    k: 'hand',
    p: 'r',
    g: [118, 150, 24, 24],
    pad: 8
  }, {
    k: 'leg',
    p: 'l',
    g: [50, 190, 28, 62]
  }, {
    k: 'leg',
    p: 'r',
    g: [82, 190, 28, 62]
  }, {
    k: 'foot',
    p: 'l',
    g: [44, 256, 36, 24],
    pad: 3
  }, {
    k: 'foot',
    p: 'r',
    g: [80, 256, 36, 24],
    pad: 3
  }];
  const rdIncZones = side => RD_INC_ZONES.filter(z => !z.only || z.only === side).map(z => ({
    g: z.g,
    pad: z.pad != null ? z.pad : 5,
    area: z.p ? `${z.k}-${side === 'front' === (z.p === 'l') ? 'r' : 'l'}` : z.k
  }));
  const rdIncAreaLabel = (side, area) => {
    const hit = (RD_INC_AREAS[side] || []).find(a => a[0] === area);
    return hit ? hit[1] : null;
  };
  const rdIncBodyText = body => ['front', 'back'].map(side => {
    const names = (body || []).filter(m => String(m).startsWith(`${side}:`)).map(m => rdIncAreaLabel(side, String(m).slice(side.length + 1))).filter(Boolean);
    return names.length ? `${side === 'front' ? 'Front' : 'Back'}: ${names.map(n => n.toLowerCase()).join(', ')}` : null;
  }).filter(Boolean).join(' · ');
  const rdIncIso = on => {
    const d = rdAddDays(RD_TODAY, -on);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const rdIncOn = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    const n = Math.round((RD_TODAY.getTime() - new Date(+m[1], +m[2] - 1, +m[3]).getTime()) / 86400000);
    return n >= 0 && n < 4000 ? n : null;
  };
  const rdIncDay = on => on === 0 ? 'Today' : on === 1 ? 'Yesterday' : rdShortDate(rdAddDays(RD_TODAY, -on));
  const rdIncWhen = r => `${rdIncDay(r.on || 0)}, ${RD_AMPM(r.at)}`;
  const rdIncNatureText = (r, max) => {
    const names = (r.natures || []).map(n => n.label);
    if (!names.length) return 'No kind chosen';
    return max && names.length > max ? `${names.slice(0, max).join(', ')} +${names.length - max}` : names.join(', ');
  };
  const rdIncFirst = name => String(name || '').split(' ')[0];
  const rdIncAsk = natures => ({
    cause: (natures || []).some(n => n.tag === 'trauma' && !n.ask),
    symp: (natures || []).some(n => n.tag === 'illness'),
    missing: (natures || []).some(n => n.ask === 'missing'),
    removed: (natures || []).some(n => n.ask === 'removed')
  });
  const rdIncStatus = r => r.status === 'draft' ? 'draft' : r.sigs && r.sigs.parent && r.sigs.parent.capture ? 'complete' : 'unsigned';
  const RD_INC_STATUS = {
    draft: 'Draft',
    unsigned: 'Unsigned',
    complete: 'Completed'
  };
  const rdIncStore = {
    data: null
  };
  const rdIncInit = () => rdIncStore.data || (rdIncStore.data = {
    records: rdIncSeed(),
    drafts: rdIncSeedDrafts()
  });
  const rdIncChild = id => RD_ALL_CHILDREN.find(c => c.id === id) || null;
  const rdIncScribble = seed => {
    const k = seed % 5 + 1,
      w = 0.9 + seed % 4 * 0.12;
    const wave = Array.from({
      length: 30
    }, (_, i) => [0.08 + i / 29 * w, 0.5 + Math.sin(i * (0.62 + k * 0.05)) * (0.34 - i / 29 * 0.22) * (1 + seed % 3 * 0.1)]);
    const under = [[0.1, 0.84], [0.1 + w * 0.45, 0.8], [0.08 + w, 0.7]];
    return {
      mode: 'drawn',
      ink: {
        format: 'strokes-v1',
        unit: 'pad-height',
        strokes: [wave, under]
      }
    };
  };
  function rdIncSeed() {
    const ed = n => RD_EDUCATORS[n % RD_EDUCATORS.length].name;
    const kid = (room, i) => RD_ALL_CHILDREN.filter(c => c.room === room)[i];
    const people = c => rdPeople(c).guardians;
    const rec = (n, c, o) => {
      const g = people(c)[0];
      const by = ed(o.by);
      const sigs = {
        author: {
          name: by,
          role: 'Educator',
          capture: o.typed ? {
            mode: 'typed',
            name: by
          } : rdIncScribble(n),
          on: o.on,
          at: o.signedAt || o.enteredAt
        }
      };
      if (o.complete) sigs.parent = {
        name: g.name,
        role: rdIncRole(g.rel),
        capture: rdIncScribble(n + 3),
        on: o.completeOn != null ? o.completeOn : o.on,
        at: o.completeAt || '15:20'
      };
      return {
        id: `inc-seed-${n}`,
        childId: c.id,
        childName: c.name,
        room: c.room,
        status: 'signed',
        by,
        startedBy: by,
        on: o.on,
        at: o.at,
        enteredOn: o.on,
        enteredAt: o.enteredAt,
        place: o.place,
        natures: o.natures.map(k => {
          const x = RD_INC_NATURES.find(m => m.key === k);
          return {
            key: x.key,
            label: x.label,
            tag: x.tag,
            ...(x.ask ? {
              ask: x.ask
            } : {})
          };
        }),
        body: o.body || [],
        circ: o.circ,
        cause: o.cause || '',
        symp: o.symp || '',
        missing: o.missing || '',
        removed: o.removed || '',
        action: o.action,
        prevent: o.prevent,
        med: o.med || {
          on: false,
          text: ''
        },
        emerg: o.emerg || {
          on: false,
          text: ''
        },
        contacts: [{
          name: g.name,
          role: rdIncRole(g.rel),
          on: o.on,
          at: o.callAt,
          ok: o.ok !== false
        }, ...(o.also ? [{
          name: rdPeople(c).emergency.name,
          role: rdIncRole(rdPeople(c).emergency.rel),
          on: o.on,
          at: o.also,
          ok: true
        }] : [])],
        notes: o.notes || '',
        sigs
      };
    };
    const k = RD_ALL_CHILDREN;
    const byId = id => k.find(c => c.id === id);
    return [rec(1, byId(1), {
      by: 2,
      on: 0,
      at: '11:20',
      enteredAt: '11:35',
      place: 'Under the climbing frame',
      natures: ['bruise', 'fall-level'],
      body: ['front:head'],
      circ: 'Alex slipped on the wet edge of the mat while running to the sandpit and bumped their forehead on the frame.',
      cause: 'Wet mat edge after the sprinklers.',
      action: 'Cold pack on the forehead for ten minutes. Alex was watched until they were playing again.',
      prevent: 'Mats moved off the wet ground; a reminder to walk on the mats.',
      callAt: '11:40'
    }), rec(2, byId(5), {
      by: 0,
      on: 0,
      at: '9:40',
      enteredAt: '10:05',
      place: 'Indoor tables',
      natures: ['allergic'],
      circ: 'Liam came up in hives on both arms about ten minutes after morning tea.',
      symp: 'Raised red patches on both forearms, itchy, no swelling of the face and no trouble breathing.',
      action: 'Washed the arms and watched Liam closely. The family were called and came to collect him.',
      prevent: 'Morning tea ingredients checked against Liam’s plan again; the cook told.',
      med: {
        on: true,
        text: 'Parent collected Liam and took him to the family doctor at 11:00.'
      },
      callAt: '9:55',
      also: '10:30'
    }), rec(3, byId(14), {
      by: 1,
      on: 0,
      at: '12:05',
      enteredAt: '12:20',
      place: 'Outdoor climbing area',
      natures: ['fall-height', 'sprain'],
      body: ['front:arm-l', 'front:hand-l'],
      circ: 'Zara fell from the second rung of the low frame and landed on an outstretched left arm.',
      cause: 'Lost grip on the second rung.',
      action: 'Ice pack and a sling. Zara was kept calm and the family were asked to collect her.',
      prevent: 'Rung checked; staff stay within arm’s reach of the frame at all times.',
      med: {
        on: true,
        text: 'Family took Zara to be checked at the hospital.'
      },
      callAt: '12:15',
      ok: true
    }), rec(4, byId(7), {
      by: 2,
      on: 1,
      at: '14:10',
      enteredAt: '14:40',
      place: 'Bathroom',
      natures: ['cut'],
      body: ['front:hand-r'],
      circ: 'Noah caught their finger on the edge of the paper towel dispenser.',
      cause: 'Sharp metal edge on the dispenser lid.',
      action: 'Cleaned, plaster applied and a cold pack. No bleeding after five minutes.',
      prevent: 'Dispenser lid reported to the office and covered until fixed.',
      callAt: '14:25',
      ok: false,
      also: '14:35'
    }), rec(5, byId(2), {
      by: 1,
      on: 1,
      at: '10:05',
      enteredAt: '10:30',
      place: 'Sleep room',
      natures: ['bite-child'],
      body: ['front:arm-r'],
      circ: 'Mia was bitten on the forearm by another child who was sharing a toy.',
      cause: 'Dispute over a toy.',
      action: 'Washed the bite, applied a cold pack. Skin not broken. Both children comforted separately.',
      prevent: 'More of the popular toy put out; staff closer during shared play.',
      callAt: '10:40',
      complete: true,
      completeAt: '15:10',
      completeOn: 1
    }), rec(6, byId(3), {
      by: 2,
      on: 2,
      at: '9:20',
      enteredAt: '9:45',
      place: 'Outdoor play area',
      natures: ['cut', 'bruise'],
      body: ['back:lower'],
      circ: 'Toby tripped over a trike wheel and landed on a block.',
      cause: 'Trike left on the path.',
      action: 'Washed, plaster, cold pack on the bruise.',
      prevent: 'Trikes parked on the shelf at the end of each session.',
      callAt: '9:35',
      complete: true,
      completeOn: 2,
      completeAt: '15:30',
      typed: true
    }), rec(7, byId(6), {
      by: 0,
      on: 3,
      at: '13:15',
      enteredAt: '13:30',
      place: 'Outdoor play area',
      natures: ['nosebleed'],
      circ: 'Sophia’s nose began to bleed while playing in the sun.',
      cause: 'Dry air; no knock.',
      action: 'Sat Sophia forward with a cold cloth to the nose. Bleeding stopped in about six minutes.',
      prevent: 'Water offered more often on dry days.',
      callAt: '13:25',
      complete: true,
      completeOn: 3,
      completeAt: '15:45'
    }), rec(8, byId(15) || byId(10), {
      by: 1,
      on: 4,
      at: '11:00',
      enteredAt: '11:15',
      place: 'Indoor reading corner',
      natures: ['fever'],
      circ: 'Felt warm and became sleepy after morning tea.',
      symp: 'Temperature 38.4, flushed cheeks, no rash.',
      action: 'Rested in a quiet area with water and a light blanket. Temperature checked again after thirty minutes.',
      prevent: 'Family asked to keep the child at home until they have been well for a day.',
      callAt: '11:10',
      complete: true,
      completeOn: 4,
      completeAt: '14:30'
    }), rec(9, kid('bilby', 0) || byId(8), {
      by: 2,
      on: 2,
      at: '15:40',
      enteredAt: '16:00',
      place: 'Garden shed door',
      natures: ['locked'],
      circ: 'The child shut the shed door behind them while collecting a ball and the latch dropped.',
      removed: 'Locked in for about one minute. An educator opened the door straight away; the child was calm and not hurt.',
      action: 'Checked the child over and talked about staying out of the shed.',
      prevent: 'Shed latch fitted with an inside release; shed kept closed.',
      callAt: '15:50',
      complete: true,
      completeOn: 2,
      completeAt: '16:15'
    }), rec(10, kid('nursery', 0) || byId(9), {
      by: 0,
      on: 3,
      at: '8:50',
      enteredAt: '9:10',
      place: 'Nursery floor',
      natures: ['bruise'],
      body: ['front:head'],
      circ: 'The baby rolled off the soft mat when the educator turned to reach a cloth.',
      cause: 'Rolled off the mat onto a carpeted floor.',
      action: 'Checked over, comforted and watched. No marks beyond a small red patch.',
      prevent: 'Baby changing and floor play moved to the ground mat; educators keep a hand on a child on a raised surface.',
      callAt: '9:00',
      complete: true,
      completeOn: 3,
      completeAt: '15:00'
    }), rec(11, kid('wombat', 0) || byId(12), {
      by: 1,
      on: 4,
      at: '10:30',
      enteredAt: '10:50',
      place: 'Craft room',
      natures: ['splinter'],
      body: ['front:hand-l'],
      circ: 'Splinter from a wooden easel in the palm of the left hand.',
      cause: 'Rough edge on the easel.',
      action: 'Splinter removed with tweezers and cleaned.',
      prevent: 'Easel sanded and checked weekly.',
      callAt: '10:40',
      complete: true,
      completeOn: 4,
      completeAt: '15:40'
    }), rec(12, kid('kangaroo', 1) || byId(11), {
      by: 2,
      on: 5,
      at: '13:50',
      enteredAt: '14:05',
      place: 'Outdoor play area',
      natures: ['sting'],
      body: ['front:foot-r'],
      circ: 'Stung on the foot by a bee in the clover.',
      cause: 'Walking barefoot on the clover patch.',
      action: 'Sting removed, cold pack, watched for any reaction for thirty minutes.',
      prevent: 'Clover patch mown; shoes on outside.',
      callAt: '14:00',
      complete: true,
      completeOn: 5,
      completeAt: '16:00'
    }), rec(13, byId(4), {
      by: 0,
      on: 6,
      at: '12:10',
      enteredAt: '12:25',
      place: 'Under the veranda',
      natures: ['asthma'],
      circ: 'Emma began wheezing after running in the cold air and said her chest felt tight.',
      symp: 'Wheeze and a short cough, speaking in full sentences.',
      action: 'Sat Emma upright and followed the asthma action plan on file. Emma rested and recovered within ten minutes.',
      prevent: 'Warm-up walk before running on cold days.',
      med: {
        on: false,
        text: ''
      },
      callAt: '12:20',
      complete: true,
      completeOn: 6,
      completeAt: '15:20'
    })];
  }
  function rdIncSeedDrafts() {
    const ed = n => RD_EDUCATORS[n % RD_EDUCATORS.length].name;
    const c = id => RD_ALL_CHILDREN.find(x => x.id === id);
    const nat = k => {
      const x = RD_INC_NATURES.find(m => m.key === k);
      return {
        key: x.key,
        label: x.label,
        tag: x.tag,
        ...(x.ask ? {
          ask: x.ask
        } : {})
      };
    };
    const base = {
      body: [],
      on: 0,
      cause: '',
      symp: '',
      missing: '',
      removed: '',
      action: '',
      prevent: '',
      med: {
        on: false,
        text: ''
      },
      emerg: {
        on: false,
        text: ''
      },
      notes: ''
    };
    return {
      [c(4).id]: {
        ...base,
        childId: c(4).id,
        childName: c(4).name,
        room: c(4).room,
        by: ed(0),
        startedBy: ed(0),
        startedAt: '12:30',
        at: '12:20',
        step: 1,
        place: 'Under the veranda',
        natures: [nat('asthma')],
        circ: 'Wheezing after running outside.',
        symp: 'Short cough and wheeze.',
        contacts: [rdIncNewContact('12:30', 0)]
      },
      [c(8).id]: {
        ...base,
        childId: c(8).id,
        childName: c(8).name,
        room: c(8).room,
        by: ed(2),
        startedBy: ed(2),
        startedAt: '11:50',
        at: '11:45',
        step: 0,
        place: 'Indoor block area',
        natures: [nat('bruise')],
        body: ['front:leg-l'],
        circ: '',
        contacts: [rdIncNewContact('11:50', 0)]
      }
    };
  }
  const rdIncNewContact = (at, on) => ({
    name: '',
    role: '',
    on: on || 0,
    at: at || RD_NOW,
    ok: null
  });
  const rdIncBlank = () => ({
    natures: [],
    body: [],
    on: 0,
    at: RD_NOW,
    place: '',
    circ: '',
    cause: '',
    symp: '',
    missing: '',
    removed: '',
    action: '',
    prevent: '',
    med: {
      on: false,
      text: ''
    },
    emerg: {
      on: false,
      text: ''
    },
    contacts: [rdIncNewContact(RD_NOW, 0)],
    notes: ''
  });
  const rdIncAll = data => [...data.records.map(r => ({
    ...r,
    kind: rdIncStatus(r)
  })), ...Object.values(data.drafts).map(d => ({
    ...d,
    id: `draft-${d.childId}`,
    status: 'draft',
    kind: 'draft'
  }))];
  const rdIncSortKey = r => r.kind === 'draft' ? r.startedAt ? RD_MINS(r.startedAt) : 0 : -(r.on || 0) * 1440 + RD_MINS(r.at || '0:00');
  const rdIncHasContent = f => !!(f.natures.length || f.body.length || f.place.trim() || f.circ.trim() || f.cause.trim() || f.symp.trim() || f.missing.trim() || f.removed.trim() || f.action.trim() || f.prevent.trim() || f.med.on || f.emerg.on || f.notes.trim() || f.contacts.some(c => c.name.trim() || c.role));
  const RD_INC_SUB = 'var(--sd-colour-text-secondary)';
  const RD_INC_NEED = {
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--sd-colour-feedback-error-default)'
  };
  function RdIncField({
    label,
    value,
    onChange,
    placeholder,
    rows,
    hint,
    need,
    tried,
    max = 2000,
    optional
  }) {
    const bad = !!need && !!tried;
    const box = {
      all: 'unset',
      boxSizing: 'border-box',
      width: '100%',
      padding: '11px 14px',
      borderRadius: 'var(--sd-radius-lg)',
      border: `1px solid ${bad ? 'var(--sd-colour-border-error)' : 'var(--sd-colour-border-default)'}`,
      fontFamily: 'var(--sd-font-family)',
      fontSize: 14.5,
      lineHeight: 1.45,
      overflowWrap: 'anywhere'
    };
    return React.createElement("label", {
      "data-need": bad ? '1' : undefined,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, label, optional ? ' · optional' : ''), hint && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.4,
        color: RD_INC_SUB
      }
    }, hint), rows ? React.createElement("textarea", {
      "aria-label": label,
      "aria-invalid": bad || undefined,
      value: value,
      maxLength: max,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      rows: rows,
      className: "fp-input",
      style: {
        ...box,
        resize: 'none'
      }
    }) : React.createElement("input", {
      "aria-label": label,
      "aria-invalid": bad || undefined,
      type: "text",
      value: value,
      maxLength: max,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      className: "fp-input",
      style: {
        ...box,
        height: 44,
        padding: '0 14px'
      }
    }), bad && React.createElement("span", {
      role: "alert",
      style: RD_INC_NEED
    }, "Needed to continue."));
  }
  function RdIncFlag({
    label,
    on,
    onChange,
    text,
    onText,
    detailLabel,
    placeholder,
    tried
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 44
      }
    }, React.createElement("span", {
      onClick: () => onChange(!on),
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 14.5,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, label), React.createElement(RdToggle, {
      on: on,
      onChange: onChange,
      label: label
    })), on && React.createElement(RdIncField, {
      label: detailLabel,
      value: text,
      onChange: onText,
      placeholder: placeholder,
      rows: 2,
      need: !text.trim(),
      tried: tried
    }));
  }
  function RdIncDanger({
    children,
    onClick,
    grow,
    full
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onClick,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
        padding: '0 18px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 15,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: 'var(--sd-colour-feedback-error-default)',
        color: 'var(--sd-colour-action-foreground)',
        ...(full ? {
          width: '100%'
        } : {}),
        ...(grow ? {
          flex: '1 1 auto'
        } : {})
      }
    }, children);
  }
  function RdDatePill({
    on,
    onChange,
    ariaLabel
  }) {
    const ref = React.useRef(null);
    const [ring, setRing] = useState(false);
    const open = e => {
      const el = ref.current;
      if (!el || typeof el.showPicker !== 'function') return;
      e.preventDefault();
      el.focus();
      try {
        el.showPicker();
      } catch (_) {}
    };
    return React.createElement("label", {
      onClick: open,
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        height: 44,
        padding: '0 14px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        flexShrink: 0,
        borderRadius: 'var(--sd-radius-full)',
        whiteSpace: 'nowrap',
        border: '2px solid var(--sd-colour-action-primary)',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)',
        fontSize: 15,
        fontWeight: 700,
        outline: ring ? '2px solid var(--sd-colour-action-primary)' : 'none',
        outlineOffset: 2
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 17
    }), React.createElement("span", null, rdIncDay(on)), React.createElement("input", {
      ref: ref,
      type: "date",
      value: rdIncIso(on),
      max: rdIncIso(0),
      "aria-label": ariaLabel,
      onFocus: e => setRing(e.target.matches(':focus-visible')),
      onBlur: () => setRing(false),
      onChange: e => {
        const n = rdIncOn(e.target.value);
        if (n != null) onChange(n);
      },
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        border: 0,
        padding: 0,
        margin: 0
      }
    }));
  }
  function RdIncWhen({
    on,
    at,
    onChange,
    ariaLabel
  }) {
    const day = n => onChange({
      on: n,
      at: n === 0 && RD_MINS(at) > RD_MINS(RD_NOW) ? RD_NOW : at
    });
    return React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'nowrap',
        alignItems: 'flex-start'
      }
    }, React.createElement(RdDatePill, {
      on: on,
      onChange: day,
      ariaLabel: `${ariaLabel} date`
    }), React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, React.createElement(RdTimeField, {
      value: at,
      onChange: t => onChange({
        on,
        at: t
      }),
      ariaLabel: `${ariaLabel} time`,
      future: on > 0
    })));
  }
  function rdIncInert(root, {
    levels = 1,
    stopAtDialog = false
  } = {}) {
    const made = [];
    let e = root;
    for (let i = 0; e && e.parentElement && i < levels; i += 1) {
      const par = e.parentElement;
      Array.from(par.children).forEach(sib => {
        if (sib !== e && !sib.hasAttribute('inert')) {
          sib.setAttribute('inert', '');
          made.push(sib);
        }
      });
      if (stopAtDialog && par.getAttribute('role') === 'dialog') break;
      e = par;
    }
    return () => made.forEach(n => n.removeAttribute('inert'));
  }
  function RdIncBody({
    value,
    onChange
  }) {
    const [side, setSide] = useState('front');
    const on = area => value.includes(`${side}:${area}`);
    const flip = area => {
      const k = `${side}:${area}`;
      onChange(value.includes(k) ? value.filter(v => v !== k) : [...value, k]);
    };
    const pc = (n, of) => `${n / of * 100}%`;
    const chips = value.map(m => {
      const i = String(m).indexOf(':');
      const sd = String(m).slice(0, i);
      const label = rdIncAreaLabel(sd, String(m).slice(i + 1));
      return label ? {
        m,
        text: `${sd === 'front' ? 'Front' : 'Back'} · ${label}`
      } : null;
    }).filter(Boolean);
    const edge = {
      position: 'absolute',
      top: pc(54, 290),
      width: 22,
      height: 22,
      borderRadius: '50%',
      boxSizing: 'border-box',
      border: '1.5px solid var(--sd-colour-border-strong)',
      background: 'var(--sd-colour-surface-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11.5,
      fontWeight: 700,
      color: RD_INC_SUB
    };
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement(RdSegmented, {
      options: [['front', 'Front'], ['back', 'Back']],
      value: side,
      onChange: setSide,
      ariaLabel: "Front or back of the body"
    }), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22,
        flexWrap: 'wrap-reverse',
        alignItems: 'flex-start'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
        width: 200,
        maxWidth: '100%'
      }
    }, React.createElement("div", {
      role: "group",
      "aria-label": `${side === 'front' ? 'Front' : 'Back'} of the body`,
      style: {
        position: 'relative',
        width: '100%',
        aspectRatio: '160 / 290'
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        ...edge,
        left: 0
      }
    }, side === 'front' ? 'R' : 'L'), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        ...edge,
        right: 0
      }
    }, side === 'front' ? 'L' : 'R'), side === 'front' && React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: pc(50, 160),
        top: pc(162, 290),
        width: pc(60, 160),
        height: pc(24, 290),
        borderRadius: '24% / 50%',
        background: 'var(--sd-colour-surface-grey)',
        border: '1.5px solid var(--sd-colour-border-default)',
        boxSizing: 'border-box'
      }
    }), rdIncZones(side).map(z => {
      const [x, y, w, h] = z.g;
      const H = z.pad;
      const base = z.area.split('-')[0];
      const r = ['chest', 'upper', 'tummy', 'lower', 'bottom'].includes(base) ? 14 : Math.min(w, h) / 2;
      const label = rdIncAreaLabel(side, z.area);
      const sel = on(z.area);
      return React.createElement("button", {
        key: z.area,
        type: "button",
        "aria-pressed": sel,
        "aria-label": `${side === 'front' ? 'Front' : 'Back'}, ${String(label).toLowerCase()}`,
        onClick: () => flip(z.area),
        className: "fp-btn",
        style: {
          all: 'unset',
          position: 'absolute',
          cursor: 'pointer',
          boxSizing: 'border-box',
          left: pc(x - H, 160),
          top: pc(y - H, 290),
          width: pc(w + 2 * H, 160),
          height: pc(h + 2 * H, 290),
          borderRadius: 10
        }
      }, React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute',
          left: pc(H, w + 2 * H),
          right: pc(H, w + 2 * H),
          top: pc(H, h + 2 * H),
          bottom: pc(H, h + 2 * H),
          boxSizing: 'border-box',
          borderRadius: `${r / w * 100}% / ${r / h * 100}%`,
          background: sel ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-grey)',
          border: sel ? '2px solid var(--sd-colour-feedback-error-default)' : '1.5px solid var(--sd-colour-border-strong)'
        }
      }));
    })), React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: RD_INC_SUB
      }
    }, "R and L are the child\u2019s right and left.")), React.createElement("div", {
      style: {
        flex: '1 1 160px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingTop: 4
      }
    }, chips.length === 0 ? React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: RD_INC_SUB
      }
    }, "Tap the places on the body that were hurt. You can switch between the front and the back.") : React.createElement("span", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, chips.map(c => React.createElement("button", {
      key: c.m,
      type: "button",
      "aria-label": `Take off ${c.text}`,
      onClick: () => onChange(value.filter(v => v !== c.m)),
      className: "ds-selection-pill ds-selection-pill--selected"
    }, React.createElement("span", {
      className: "ds-selection-pill__label"
    }, c.text), React.createElement(SdIcon, {
      name: "close",
      size: 13
    })))))));
  }
  function RdIncNaturePicker({
    value,
    onChange,
    phone
  }) {
    const [q, setQ] = useState('');
    const [tag, setTag] = useState('all');
    const needle = q.trim().toLowerCase();
    const list = RD_INC_NATURES.filter(n => (tag === 'all' || n.tag === tag) && (!needle || n.label.toLowerCase().includes(needle)));
    const has = k => value.some(n => n.key === k);
    const toggle = n => onChange(has(n.key) ? value.filter(x => x.key !== n.key) : [...value, {
      key: n.key,
      label: n.label,
      tag: n.tag,
      ...(n.ask ? {
        ask: n.ask
      } : {})
    }]);
    const typed = rdCap(q.trim(), 60);
    const typedKey = `other:${typed.toLowerCase()}`;
    const canUse = !!typed && !RD_INC_NATURES.some(n => n.label.toLowerCase() === typed.toLowerCase()) && !has(typedKey);
    const row = (key, label, tagText, on, onClick) => React.createElement("button", {
      key: key,
      type: "button",
      role: "checkbox",
      "aria-checked": on,
      onClick: onClick,
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 52,
        padding: '8px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: on ? '2px solid var(--sd-colour-action-primary)' : '1px solid var(--sd-colour-border-default)',
        background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 22,
        height: 22,
        flexShrink: 0,
        borderRadius: 'var(--sd-radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        background: on ? 'var(--sd-colour-action-primary)' : 'transparent',
        border: on ? 'none' : '2px solid var(--sd-colour-border-strong)',
        color: 'var(--sd-colour-action-foreground)'
      }
    }, on && React.createElement(SdIcon, {
      name: "tick",
      size: 13
    })), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 14.5,
        fontWeight: 700
      }
    }, label), tagText && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: RD_INC_SUB,
        flexShrink: 0
      }
    }, tagText));
    return React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        position: 'sticky',
        top: -16,
        zIndex: 1,
        margin: '-16px -22px 0',
        padding: '16px 22px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement(RdSearch, {
      value: q,
      onChange: setQ,
      count: list.length,
      placeholder: "Search kinds of incident",
      compact: true,
      autoFocus: !phone
    }), React.createElement(RdSegmented, {
      options: RD_INC_TAGS,
      value: tag,
      onChange: setTag,
      ariaLabel: "Injury or trauma, or illness"
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, list.map(n => row(n.key, n.label, n.tag === 'illness' ? 'Illness' : null, has(n.key), () => toggle(n))), !list.length && !canUse && React.createElement("span", {
      style: {
        fontSize: 13,
        lineHeight: 1.45,
        color: RD_INC_SUB
      }
    }, "Nothing matches. Type what happened in the search box to add it yourself."), canUse && row('use', React.createElement(React.Fragment, null, "Not on the list? Use \u201C", typed, "\u201D"), null, false, () => {
      onChange([...value, {
        key: typedKey,
        label: typed,
        tag: null,
        other: true
      }]);
      setQ('');
    })), value.filter(n => n.other).map(n => row(n.key, n.label, 'Typed in', true, () => onChange(value.filter(x => x.key !== n.key)))), !needle && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: RD_INC_SUB
      }
    }, "Not on the list? Type it in the search box, then choose \u201CUse\u201D."));
  }
  function RdIncContacts({
    child,
    value,
    onChange,
    triedN
  }) {
    const people = rdPeople(child);
    const known = [...people.guardians, ...people.emergencies];
    const [removing, setRemoving] = useState(null);
    const setAt = (i, patch) => onChange(value.map((c, j) => j === i ? {
      ...c,
      ...patch
    } : c));
    const pick = (i, name) => {
      const p = known.find(x => x.name === name);
      if (p) setAt(i, {
        name: p.name,
        role: rdIncRole(p.rel)
      });
    };
    const remove = i => {
      const rest = value.filter((_, j) => j !== i);
      onChange(rest.length ? rest : [rdIncNewContact(RD_NOW, 0)]);
      setRemoving(null);
    };
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, value.map((c, i) => {
      const bad = i < triedN;
      return React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: 14,
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)'
        }
      }, React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 20
        }
      }, React.createElement("span", {
        style: {
          flex: 1
        }
      }, React.createElement(RdLabel, null, value.length > 1 ? `Contact ${i + 1}` : 'Who you told or tried to reach')), (value.length > 1 || c.name.trim() || c.role) && removing !== i && React.createElement(RdTextAction, {
        danger: true,
        onClick: () => c.name.trim() ? setRemoving(i) : remove(i)
      }, "Remove")), removing === i && React.createElement("div", {
        role: "alertdialog",
        "aria-label": "Remove this entry",
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '12px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-red)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13.5,
          fontWeight: 700
        }
      }, "Remove this entry?"), React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap'
        }
      }, React.createElement(RdTextAction, {
        color: "var(--sd-colour-text-primary)",
        onClick: () => setRemoving(null)
      }, "Keep it"), React.createElement("button", {
        type: "button",
        className: "ds-btn ds-btn--destructive ds-btn--sm",
        onClick: () => remove(i)
      }, "Remove entry"))), known.length > 0 && React.createElement(RdChoiceChips, {
        options: known.map(p => [p.name, `${p.name} · ${p.rel}`]),
        value: c.name,
        onChange: k => pick(i, k),
        ariaLabel: "Pick from this child\u2019s contacts"
      }), React.createElement(RdIncField, {
        label: "Name",
        value: c.name,
        onChange: v => setAt(i, {
          name: v
        }),
        placeholder: "Or type a name",
        max: 80,
        need: !c.name.trim(),
        tried: bad
      }), React.createElement("span", {
        "data-need": bad && !c.role ? '1' : undefined,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "Their role"), React.createElement(RdChoiceChips, {
        options: RD_INC_ROLES.map(r => [r.key, r.label]),
        value: c.role,
        onChange: k => setAt(i, {
          role: k
        }),
        ariaLabel: "Their role"
      }), bad && !c.role && React.createElement("span", {
        role: "alert",
        style: RD_INC_NEED
      }, "Needed to continue.")), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "When"), React.createElement(RdIncWhen, {
        on: c.on,
        at: c.at,
        onChange: w => setAt(i, w),
        ariaLabel: "When you told them"
      })), React.createElement("span", {
        "data-need": bad && c.ok === null ? '1' : undefined,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "Did you get through?"), React.createElement(RdSegmented, {
        options: [['yes', 'Got through'], ['no', 'Didn’t get through']],
        value: c.ok === true ? 'yes' : c.ok === false ? 'no' : null,
        onChange: k => setAt(i, {
          ok: k === 'yes'
        }),
        ariaLabel: "Did you get through to them"
      }), bad && c.ok === null && React.createElement("span", {
        role: "alert",
        style: RD_INC_NEED
      }, "Needed to continue.")));
    }), React.createElement("button", {
      type: "button",
      onClick: () => onChange([...value, rdIncNewContact(RD_NOW, 0)]),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 44,
        padding: '0 16px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 14.5,
        fontWeight: 600
      }
    }, React.createElement(SdIcon, {
      name: "add",
      size: 16
    }), "Add another contact"));
  }
  function RdIncSummary({
    rec,
    onJump
  }) {
    const ask = rdIncAsk(rec.natures);
    const row = (k, label, node) => React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px 14px',
        alignItems: 'baseline'
      }
    }, React.createElement("dt", {
      style: {
        width: 104,
        flexShrink: 0,
        fontSize: 12.5,
        fontWeight: 700,
        color: RD_INC_SUB
      }
    }, label), React.createElement("dd", {
      style: {
        margin: 0,
        flex: '1 1 240px',
        minWidth: 0,
        fontSize: 14.5,
        lineHeight: '21px',
        fontWeight: 600,
        overflowWrap: 'anywhere'
      }
    }, node));
    const flag = (on, text) => on ? React.createElement(React.Fragment, null, "Yes", React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 500
      }
    }, text)) : 'No';
    const section = (title, step, rows) => React.createElement("div", {
      key: title,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 20
      }
    }, React.createElement("span", {
      style: {
        flex: 1
      }
    }, React.createElement(RdLabel, null, title)), onJump && React.createElement(RdTextAction, {
      onClick: () => onJump(step),
      ariaLabel: `Change: ${title}`
    }, "Change")), React.createElement("dl", {
      style: {
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, rows));
    const body = rdIncBodyText(rec.body);
    const told = (rec.contacts || []).map((c, i) => row(`c${i}`, (rec.contacts || []).length > 1 ? `Contact ${i + 1}` : 'Contact', React.createElement(React.Fragment, null, c.name, c.role && c.role !== 'Other' ? ` (${c.role.toLowerCase()})` : '', React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 500,
        color: RD_INC_SUB
      }
    }, rdIncWhen(c), " \xB7 ", c.ok === true ? 'got through' : c.ok === false ? 'did not get through' : 'not answered'))));
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }
    }, section('The incident', 0, [row('kind', 'Kind', rdIncNatureText(rec)), body && row('body', 'On the body', body), row('when', 'When', rdIncWhen(rec)), row('where', 'Where', rec.place)].filter(Boolean)), section('The account', 0, [row('circ', 'What happened', rec.circ), ask.cause && rec.cause && row('cause', 'What caused it', rec.cause), ask.symp && rec.symp && row('symp', 'Symptoms', rec.symp), ask.missing && rec.missing && row('missing', 'Missing', rec.missing), ask.removed && rec.removed && row('removed', 'Taken or locked', rec.removed)].filter(Boolean)), section('What was done', 1, [row('action', 'Action taken', rec.action), row('prevent', 'To prevent it', rec.prevent), row('med', 'Medical attention', flag(rec.med.on, rec.med.text)), row('emerg', 'Emergency services', flag(rec.emerg.on, rec.emerg.text))]), section('Who was told', 2, told), rec.notes && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, React.createElement(RdLabel, null, "Additional notes"), React.createElement("dl", {
      style: {
        margin: 0
      }
    }, row('notes', 'Notes', rec.notes))));
  }
  const RD_INC_SLOTS = {
    author: {
      title: 'Author',
      who: 'you',
      decl: () => 'I have read this record and confirm that it is accurate. I understand that once I sign it, it can’t be changed.'
    },
    witness: {
      title: 'Witness',
      who: 'optional',
      decl: () => 'I was a witness to the incident described in this record.'
    },
    notifier: {
      title: 'Who told the family',
      who: 'optional',
      decl: () => 'I told, or tried to tell, the people listed in this record.'
    },
    parent: {
      title: 'Parent or guardian',
      who: 'in person',
      decl: first => `I have read this record about ${first} and I acknowledge it.`
    }
  };
  const rdIncSlotWhy = {
    witness: 'Whoever saw it happen.',
    notifier: 'Whoever told, or tried to tell, the family.',
    parent: 'Hand the device to them to read and sign.'
  };
  function RdIncSigSlot({
    slot,
    child,
    educator,
    others,
    value,
    onChange,
    open,
    onOpen,
    disabled,
    disabledText,
    invalid,
    id,
    onHandOver,
    onClear,
    offline
  }) {
    const meta = RD_INC_SLOTS[slot];
    const author = slot === 'author';
    const first = rdIncFirst(child.name);
    const v = author ? {
      name: educator.name,
      role: 'Educator',
      capture: value || null
    } : value || {
      name: '',
      role: '',
      capture: null
    };
    const set = patch => onChange({
      name: v.name,
      role: v.role,
      capture: v.capture,
      ...patch
    });
    const head = React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, meta.title, React.createElement("span", {
      style: {
        fontWeight: 500,
        color: RD_INC_SUB
      }
    }, " \xB7 ", meta.who));
    const box = {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 56,
      padding: '6px 14px',
      borderRadius: 'var(--sd-radius-lg)',
      border: '1px solid var(--sd-colour-border-default)',
      opacity: disabled ? 0.6 : 1
    };
    if (slot === 'parent') {
      return React.createElement("div", {
        style: box
      }, React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, head, React.createElement("span", {
        style: {
          fontSize: 12.5,
          color: RD_INC_SUB
        }
      }, disabled ? disabledText : v.capture ? `Signed by ${v.name} (${v.role.toLowerCase()})` : rdIncSlotWhy.parent)), !disabled && !v.capture && !offline && React.createElement(RdTextAction, {
        id: "rd-inc-add-parent",
        onClick: onHandOver,
        ariaLabel: "Hand the device to the family to sign"
      }, "Hand to the family"), !disabled && v.capture && React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          flexShrink: 0
        }
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-action-primary)',
          display: 'inline-flex'
        }
      }, React.createElement(SdIcon, {
        name: "tick",
        size: 18
      })), React.createElement(RdTextAction, {
        onClick: onClear
      }, "Remove")));
    }
    const chips = (others || []).map(e => [e.name, e.name, 'Educator']);
    if (!author && !open && !v.capture) {
      return React.createElement("div", {
        style: box
      }, React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, head, React.createElement("span", {
        style: {
          fontSize: 12.5,
          color: RD_INC_SUB
        }
      }, disabled ? disabledText : rdIncSlotWhy[slot])), !disabled && React.createElement(RdTextAction, {
        id: `rd-inc-add-${slot}`,
        onClick: onOpen,
        ariaLabel: `Add the signature of ${meta.title.toLowerCase()}`
      }, "Add signature"));
    }
    return React.createElement("div", {
      "data-slot": slot,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 14,
        borderRadius: 'var(--sd-radius-lg)',
        border: `1px solid ${invalid && !disabled ? 'var(--sd-colour-border-error)' : 'var(--sd-colour-border-default)'}`,
        opacity: disabled ? 0.6 : 1
      }
    }, head, author ? React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600
      }
    }, v.name, " ", React.createElement("span", {
      style: {
        color: RD_INC_SUB,
        fontWeight: 500
      }
    }, "\xB7 ", v.role)) : React.createElement(React.Fragment, null, chips.length > 0 && !v.capture && React.createElement(RdChoiceChips, {
      options: chips.map(c => [c[0], c[1]]),
      value: v.name,
      onChange: k => {
        const c = chips.find(x => x[0] === k);
        set({
          name: c[0],
          role: c[2]
        });
      },
      ariaLabel: `Pick ${meta.title.toLowerCase()}`
    }), v.capture ? React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Full name"), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 600
      }
    }, v.name)) : React.createElement(RdIncField, {
      label: "Full name",
      value: v.name,
      onChange: n => set({
        name: n
      }),
      placeholder: "Their full name",
      max: 80
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Their role"), v.capture ? React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 600
      }
    }, v.role) : React.createElement(RdChoiceChips, {
      options: RD_INC_ROLES.map(r => [r.key, r.label]),
      value: v.role,
      onChange: k => set({
        role: k
      }),
      ariaLabel: "Their role"
    }))), React.createElement(RdSignaturePad, {
      id: id,
      declaration: meta.decl(first),
      signerName: v.name || 'them',
      invalid: invalid,
      disabled: disabled || !author && (!v.name.trim() || !v.role),
      disabledText: disabled ? disabledText : !v.name.trim() ? 'Add their name first' : 'Choose their role first',
      onChange: cap => author ? onChange(cap) : set({
        capture: cap
      })
    }));
  }
  function RdIncPinGate({
    educator,
    onOk
  }) {
    const [pin, setPin] = useState('');
    const [wrong, setWrong] = useState(false);
    const expected = window.PgSignin && window.PgSignin.DEMO_PIN || '1234';
    const push = d => {
      if (pin.length >= 4) return;
      const next = pin + d;
      setWrong(false);
      setPin(next);
      if (next.length === 4) setTimeout(() => {
        if (next === expected) onOk();else {
          setWrong(true);
          setPin('');
        }
      }, 160);
    };
    const key = (label, onClick, ariaLabel) => React.createElement("button", {
      key: label,
      type: "button",
      onClick: onClick,
      "aria-label": ariaLabel || String(label),
      className: "v-key",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        height: 56,
        borderRadius: 'var(--sd-radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-grey)',
        color: 'var(--sd-colour-text-primary)',
        fontSize: 22,
        fontWeight: 600
      }
    }, label);
    return React.createElement("div", {
      className: wrong ? 'v-shake' : undefined,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14
      }
    }, React.createElement(RdAvatar, {
      src: educator.img,
      name: educator.name,
      size: 52
    }), React.createElement("span", {
      style: {
        display: 'flex',
        gap: 12
      },
      role: "status",
      "aria-label": `${pin.length} of 4 digits entered`
    }, [0, 1, 2, 3].map(i => React.createElement("span", {
      key: i,
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: i < pin.length ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-grey)',
        border: `1px solid ${i < pin.length ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`
      }
    }))), React.createElement("span", {
      role: wrong ? 'alert' : undefined,
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        minHeight: 18,
        color: wrong ? 'var(--sd-colour-feedback-error-default)' : RD_INC_SUB
      }
    }, wrong ? 'That PIN didn’t match. Try again.' : `${educator.name}, enter your PIN to carry on.`), React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        width: '100%',
        maxWidth: 300
      }
    }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => key(n, () => push(String(n)))), React.createElement("span", null), key(0, () => push('0')), React.createElement("button", {
      type: "button",
      onClick: () => {
        setWrong(false);
        setPin(v => v.slice(0, -1));
      },
      "aria-label": "Delete",
      className: "v-key",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        height: 56,
        borderRadius: 'var(--sd-radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: RD_INC_SUB
      }
    }, React.createElement(SdIcon, {
      name: "backspace",
      size: 22
    }))));
  }
  function RdIncFamilySign({
    rec,
    child,
    authorName,
    educator,
    phone,
    onSigned,
    onDone
  }) {
    const first = rdIncFirst(child.name);
    const guardians = rdPeople(child).guardians;
    const [v, setV] = useState({
      name: '',
      role: '',
      capture: null
    });
    const [stage, setStage] = useState('sign');
    const [signed, setSigned] = useState(false);
    const rootRef = React.useRef(null);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
      window.addEventListener('keydown', esc, true);
      const undo = rdIncInert(rootRef.current, {
        levels: 8,
        stopAtDialog: true
      });
      if (rootRef.current) rootRef.current.focus({
        preventScroll: true
      });
      return () => {
        window.removeEventListener('keydown', esc, true);
        undo();
      };
    }, []);
    const set = patch => setV(x => ({
      ...x,
      ...patch
    }));
    const ready = !!(v.capture && v.name.trim() && v.role);
    const save = () => {
      if (!ready) return;
      onSigned({
        name: rdCap(v.name.trim(), 80),
        role: v.role,
        capture: v.capture,
        on: 0,
        at: RD_NOW
      });
      setSigned(true);
      setStage('back');
    };
    const wrap = {
      width: '100%',
      maxWidth: 640,
      margin: '0 auto',
      boxSizing: 'border-box'
    };
    return React.createElement("div", {
      ref: rootRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Sign this record",
      tabIndex: -1,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        outline: 'none',
        background: 'var(--sd-colour-surface-default)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        flexShrink: 0,
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("div", {
      style: {
        ...wrap,
        padding: phone ? '14px 16px' : '20px 22px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, React.createElement(RdKid, {
      c: child,
      size: 44
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, "Incident record"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: RD_INC_SUB
      }
    }, child.name)))), stage === 'sign' ? React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto'
      }
    }, React.createElement("div", {
      style: {
        ...wrap,
        padding: phone ? '16px 16px 24px' : '18px 22px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        lineHeight: 1.5,
        fontWeight: 600
      }
    }, authorName, " has signed this record about ", first, ". Please read it, then sign at the bottom. Once you sign, it can\u2019t be changed."), React.createElement(RdIncSummary, {
      rec: rec
    }), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 14,
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, "Your signature"), guardians.length > 0 && !v.capture && React.createElement(RdChoiceChips, {
      options: guardians.map(g => [g.name, `${g.name} · ${g.rel}`]),
      value: v.name,
      onChange: k => {
        const g = guardians.find(x => x.name === k);
        set({
          name: g.name,
          role: rdIncRole(g.rel)
        });
      },
      ariaLabel: "Who is signing"
    }), v.capture ? React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Your name"), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 600
      }
    }, v.name)) : React.createElement(RdIncField, {
      label: "Your name",
      value: v.name,
      onChange: n => set({
        name: n
      }),
      placeholder: "Your full name",
      max: 80
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Your role"), v.capture ? React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 600
      }
    }, v.role) : React.createElement(RdChoiceChips, {
      options: ['Parent', 'Guardian', 'Other'].map(r => [r, r]),
      value: v.role,
      onChange: k => set({
        role: k
      }),
      ariaLabel: "Your role"
    })), React.createElement(RdSignaturePad, {
      id: "rd-inc-sig-family",
      declaration: RD_INC_SLOTS.parent.decl(first),
      signerName: v.name || 'you',
      disabled: !v.name.trim() || !v.role,
      disabledText: !v.name.trim() ? 'Add your name first' : 'Choose your role first',
      onChange: cap => set({
        capture: cap
      })
    })))), React.createElement("div", {
      style: {
        flexShrink: 0,
        borderTop: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("div", {
      style: wrap
    }, React.createElement(RdSheetFootRow, {
      phone: phone,
      edge: true,
      inline: true,
      divider: false,
      note: null
    }, React.createElement(RdAction, {
      onClick: () => setStage('back')
    }, "Hand back without signing"), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: !ready,
      onClick: ready ? save : undefined
    }, "Save signature"))))) : React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto'
      }
    }, React.createElement("div", {
      style: {
        ...wrap,
        maxWidth: 420,
        padding: '28px 22px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        textAlign: 'center'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 20,
        fontWeight: 700
      }
    }, signed ? 'Thank you' : 'Not signed'), React.createElement("span", {
      style: {
        fontSize: 14.5,
        lineHeight: 1.5,
        color: RD_INC_SUB
      }
    }, "Please hand the tablet back to an educator."), React.createElement(RdIncPinGate, {
      educator: educator,
      onOk: onDone
    }), !signed && React.createElement(RdTextAction, {
      onClick: () => setStage('sign')
    }, "Go back and sign"))));
  }
  function RdIncidentSheet({
    child,
    offline,
    phone,
    educator = RD_EDUCATOR,
    others = [],
    draft,
    onClose,
    onDismiss,
    onDiscard,
    onConfirm
  }) {
    const full = rdPhoneFull(phone);
    const first = rdIncFirst(child.name);
    const [f, setF] = useState(() => draft ? {
      ...rdIncBlank(),
      ...draft,
      contacts: draft.contacts && draft.contacts.length ? draft.contacts : [rdIncNewContact(RD_NOW, 0)]
    } : rdIncBlank());
    const [step, setStep] = useState(draft && draft.step ? Math.min(draft.step, 3) : 0);
    const [view, setView] = useState('form');
    const [tried, setTried] = useState(false);
    const [triedN, setTriedN] = useState(0);
    const [asking, setAsking] = useState(false);
    const [leave, setLeave] = useState(null);
    const [returnTo, setReturnTo] = useState(null);
    const [family, setFamily] = useState(false);
    const [banner, setBanner] = useState(!!draft);
    const [bodyOpen, setBodyOpen] = useState(!!(draft && draft.body && draft.body.length));
    const [sigs, setSigs] = useState({
      author: null,
      witness: null,
      notifier: null,
      parent: null
    });
    const [slotOpen, setSlotOpen] = useState({});
    const [signTried, setSignTried] = useState(false);
    const bodyRef = React.useRef(null);
    const rootRef = React.useRef(null);
    const cardRef = React.useRef(null);
    const set = patch => setF(x => ({
      ...x,
      ...patch
    }));
    const ask = rdIncAsk(f.natures);
    const need = {
      natures: !f.natures.length,
      place: !f.place.trim(),
      circ: !f.circ.trim(),
      cause: ask.cause && !f.cause.trim(),
      symp: ask.symp && !f.symp.trim(),
      missing: ask.missing && !f.missing.trim(),
      removed: ask.removed && !f.removed.trim()
    };
    const oks = [!Object.values(need).some(Boolean), !!f.action.trim() && !!f.prevent.trim() && (!f.med.on || !!f.med.text.trim()) && (!f.emerg.on || !!f.emerg.text.trim()), f.contacts.length > 0 && f.contacts.every(c => c.name.trim() && c.role && c.ok !== null), true, !!sigs.author];
    const anySig = !!sigs.author || ['witness', 'notifier', 'parent'].some(k => sigs[k] && sigs[k].capture);
    const mine = !draft || draft.by === educator.name;
    const handed = !!draft && draft.by !== educator.name;
    const toDraft = () => ({
      ...f,
      step,
      childId: child.id,
      childName: child.name,
      room: child.room,
      by: draft ? draft.by : educator.name,
      startedBy: draft ? draft.by : educator.name,
      startedAt: draft ? draft.startedAt : RD_NOW
    });
    const guarded = (run, text, yes) => step === 4 && anySig ? setLeave({
      run,
      text,
      yes
    }) : run();
    const dismissNow = () => rdIncHasContent(f) ? onDismiss(toDraft(), {
      lostSignatures: anySig
    }) : onClose();
    const dismiss = () => guarded(dismissNow, 'Closing keeps a draft, but not the signatures given so far.', 'Close and keep a draft');
    const back = () => {
      if (family) return;
      if (leave) {
        setLeave(null);
        return;
      }
      if (asking) {
        setAsking(false);
        return;
      }
      if (view === 'nature') {
        setView('form');
        return;
      }
      dismiss();
    };
    const backRef = React.useRef(back);
    backRef.current = back;
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') backRef.current();
      };
      window.addEventListener('keydown', esc);
      const opener = document.activeElement;
      const undo = rdIncInert(rootRef.current, {
        levels: 1
      });
      if (cardRef.current) cardRef.current.focus({
        preventScroll: true
      });
      return () => {
        window.removeEventListener('keydown', esc);
        undo();
        if (opener && opener !== document.body && opener.isConnected && typeof opener.focus === 'function') opener.focus({
          preventScroll: true
        });
      };
    }, []);
    const go = n => {
      if (step === 4) {
        setSigs({
          author: null,
          witness: null,
          notifier: null,
          parent: null
        });
        setSlotOpen({});
        setSignTried(false);
      }
      if (n >= 3) setReturnTo(null);
      setStep(n);
      setTried(false);
      setTriedN(0);
      setBanner(false);
      setAsking(false);
      setLeave(null);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    };
    const jump = n => {
      setReturnTo(3);
      go(n);
    };
    const next = () => {
      if (!oks[step]) {
        setTried(true);
        if (step === 2) setTriedN(f.contacts.length);
        return;
      }
      go(returnTo != null && step < 3 ? 3 : step + 1);
    };
    useEffect(() => {
      if (!tried || !bodyRef.current) return;
      const el = bodyRef.current.querySelector('[data-need]');
      if (!el) return;
      if (el.scrollIntoView) el.scrollIntoView({
        block: 'center'
      });
      const c = el.querySelector('textarea, input, button');
      if (c && c.focus) c.focus({
        preventScroll: true
      });
    }, [tried]);
    useEffect(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    }, [view]);
    const save = () => {
      if (!sigs.author) {
        setSignTried(true);
        return;
      }
      const clamp = (on, at) => on === 0 && RD_MINS(at) > RD_MINS(RD_NOW) ? RD_NOW : at;
      const sg = k => sigs[k] && sigs[k].capture ? {
        name: rdCap(sigs[k].name.trim(), 80),
        role: sigs[k].role,
        capture: sigs[k].capture,
        on: 0,
        at: RD_NOW
      } : null;
      const keep = (on, text) => ({
        on,
        text: on ? rdCap(text.trim(), 2000) : ''
      });
      onConfirm({
        id: `inc-${Date.now()}`,
        childId: child.id,
        childName: child.name,
        room: child.room,
        status: 'signed',
        by: educator.name,
        startedBy: draft ? draft.by : educator.name,
        on: f.on,
        at: clamp(f.on, f.at),
        enteredOn: 0,
        enteredAt: RD_NOW,
        place: rdCap(f.place.trim(), 120),
        natures: f.natures,
        body: f.body,
        circ: rdCap(f.circ.trim(), 2000),
        cause: ask.cause ? rdCap(f.cause.trim(), 300) : '',
        symp: ask.symp ? rdCap(f.symp.trim(), 2000) : '',
        missing: ask.missing ? rdCap(f.missing.trim(), 2000) : '',
        removed: ask.removed ? rdCap(f.removed.trim(), 2000) : '',
        action: rdCap(f.action.trim(), 2000),
        prevent: rdCap(f.prevent.trim(), 2000),
        med: keep(f.med.on, f.med.text),
        emerg: keep(f.emerg.on, f.emerg.text),
        contacts: f.contacts.map(c => ({
          name: rdCap(c.name.trim(), 80),
          role: c.role,
          on: c.on,
          at: clamp(c.on, c.at),
          ok: c.ok === true
        })),
        notes: rdCap(f.notes.trim(), 2000),
        sigs: {
          author: {
            name: educator.name,
            role: 'Educator',
            capture: sigs.author,
            on: 0,
            at: RD_NOW
          },
          witness: sg('witness'),
          notifier: sg('notifier'),
          parent: sg('parent')
        }
      });
    };
    const sub = RD_INC_SUB;
    const picking = view === 'nature';
    const btnRow = {
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 44,
      padding: '0 16px',
      borderRadius: 'var(--sd-radius-lg)',
      border: '1px solid var(--sd-colour-border-default)',
      fontSize: 14.5,
      fontWeight: 600
    };
    const nw = {
      whiteSpace: 'nowrap'
    };
    const b = {
      color: 'var(--sd-colour-text-primary)'
    };
    const stepZero = React.createElement(React.Fragment, null, React.createElement("span", {
      "data-need": tried && need.natures ? '1' : undefined,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement(RdLabel, null, "Kind of incident"), f.natures.length > 0 && React.createElement("span", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, f.natures.map(n => React.createElement("button", {
      key: n.key,
      type: "button",
      "aria-label": `Take off ${n.label}`,
      onClick: () => set({
        natures: f.natures.filter(x => x.key !== n.key)
      }),
      className: "ds-selection-pill ds-selection-pill--selected"
    }, React.createElement("span", {
      className: "ds-selection-pill__label"
    }, n.label), React.createElement(SdIcon, {
      name: "close",
      size: 13
    })))), React.createElement("button", {
      type: "button",
      onClick: () => setView('nature'),
      className: "fp-btn",
      style: {
        ...btnRow,
        alignSelf: 'flex-start'
      }
    }, React.createElement(SdIcon, {
      name: f.natures.length ? 'edit' : 'add',
      size: 16
    }), f.natures.length ? 'Change the kind' : 'Choose the kind'), tried && need.natures && React.createElement("span", {
      role: "alert",
      style: RD_INC_NEED
    }, "Needed to continue.")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement("button", {
      type: "button",
      "aria-expanded": bodyOpen,
      onClick: () => setBodyOpen(o => !o),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 44
      }
    }, React.createElement(RdLabel, null, "Where on the body"), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        fontWeight: 600,
        color: sub,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, rdIncBodyText(f.body) || 'Optional'), React.createElement("span", {
      style: {
        transform: bodyOpen ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex',
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 16
    }))), bodyOpen && React.createElement(RdIncBody, {
      value: f.body,
      onChange: bd => set({
        body: bd
      })
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "When it happened"), React.createElement(RdIncWhen, {
      on: f.on,
      at: f.at,
      onChange: w => set(w),
      ariaLabel: "When it happened"
    })), React.createElement(RdIncField, {
      label: "Where it happened",
      value: f.place,
      onChange: v => set({
        place: v
      }),
      placeholder: "The sandpit, the bathroom, the front gate\u2026",
      max: 120,
      need: need.place,
      tried: tried
    }), React.createElement(RdIncField, {
      label: "What happened",
      hint: "What led up to it: where the child was and what they were doing.",
      rows: 3,
      value: f.circ,
      onChange: v => set({
        circ: v
      }),
      need: need.circ,
      tried: tried
    }), ask.cause && React.createElement(RdIncField, {
      label: "What caused it",
      hint: "In a few words.",
      value: f.cause,
      onChange: v => set({
        cause: v
      }),
      max: 300,
      need: need.cause,
      tried: tried
    }), ask.symp && React.createElement(RdIncField, {
      label: "Symptoms",
      hint: "What the illness looked like, and how it started.",
      rows: 2,
      value: f.symp,
      onChange: v => set({
        symp: v
      }),
      need: need.symp,
      tried: tried
    }), ask.missing && React.createElement(RdIncField, {
      label: "The child being missing",
      hint: "The circumstances in which the child was missing or unaccounted for.",
      rows: 2,
      value: f.missing,
      onChange: v => set({
        missing: v
      }),
      need: need.missing,
      tried: tried
    }), ask.removed && React.createElement(RdIncField, {
      label: "The child being taken or locked in or out",
      hint: "The circumstances in which the child was taken, removed, or locked in or out.",
      rows: 2,
      value: f.removed,
      onChange: v => set({
        removed: v
      }),
      need: need.removed,
      tried: tried
    }));
    const stepOne = React.createElement(React.Fragment, null, React.createElement(RdIncField, {
      label: "Action taken",
      hint: "Include first aid, who gave it, and any medication given.",
      rows: 3,
      value: f.action,
      onChange: v => set({
        action: v
      }),
      need: !f.action.trim(),
      tried: tried
    }), React.createElement(RdIncField, {
      label: "Steps to prevent it happening again",
      rows: 2,
      value: f.prevent,
      onChange: v => set({
        prevent: v
      }),
      need: !f.prevent.trim(),
      tried: tried
    }), React.createElement(RdIncFlag, {
      label: "Medical attention was sought",
      on: f.med.on,
      onChange: v => set({
        med: {
          ...f.med,
          on: v
        }
      }),
      text: f.med.text,
      onText: v => set({
        med: {
          ...f.med,
          text: v
        }
      }),
      detailLabel: "Medical attention",
      placeholder: "From a doctor or a hospital: who, where, and what they said",
      tried: tried
    }), React.createElement(RdIncFlag, {
      label: "Emergency services attended",
      on: f.emerg.on,
      onChange: v => set({
        emerg: {
          ...f.emerg,
          on: v
        }
      }),
      text: f.emerg.text,
      onText: v => set({
        emerg: {
          ...f.emerg,
          text: v
        }
      }),
      detailLabel: "Emergency services",
      placeholder: "Which service, when they arrived, what they did",
      tried: tried
    }));
    const stepTwo = React.createElement(React.Fragment, null, React.createElement("span", {
      style: {
        fontSize: 13.5,
        lineHeight: 1.45,
        color: sub
      }
    }, "Add each person you told, or tried to reach. Your service\u2019s own policy says who needs to be told, and when. Not told them yet? Close this and it stays as a draft until you have."), React.createElement(RdIncContacts, {
      child: child,
      value: f.contacts,
      onChange: c => set({
        contacts: c
      }),
      triedN: triedN
    }));
    const stepThree = React.createElement(React.Fragment, null, React.createElement(RdIncSummary, {
      rec: f,
      onJump: jump
    }), React.createElement(RdIncField, {
      label: "Additional notes",
      optional: true,
      hint: "Anything else that belongs on this record. It can\u2019t be added once the record is signed.",
      rows: 3,
      value: f.notes,
      onChange: v => set({
        notes: v
      })
    }));
    const unlocked = !!sigs.author;
    const stepFour = React.createElement(React.Fragment, null, React.createElement("div", {
      className: "ds-message-box ds-message-box--orange",
      role: "note"
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: "lock",
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, "Signing locks this record"))), React.createElement("p", {
      className: "ds-message-box__body"
    }, "Once you sign, nothing in it can be changed. Going back now clears the signatures given so far."))), React.createElement(RdIncSigSlot, {
      slot: "author",
      id: "rd-inc-sig-author",
      child: child,
      educator: educator,
      value: sigs.author,
      onChange: cap => setSigs(s => ({
        ...s,
        author: cap
      })),
      invalid: signTried && !sigs.author
    }), ['witness', 'notifier'].map(k => React.createElement(RdIncSigSlot, {
      key: k,
      slot: k,
      id: `rd-inc-sig-${k}`,
      child: child,
      educator: educator,
      others: others,
      value: sigs[k],
      onChange: v => setSigs(s => ({
        ...s,
        [k]: v
      })),
      open: !!slotOpen[k],
      disabled: !unlocked,
      disabledText: "Sign as the author first",
      onOpen: () => {
        setSlotOpen(o => ({
          ...o,
          [k]: true
        }));
        setTimeout(() => {
          const el = bodyRef.current && bodyRef.current.querySelector(`[data-slot="${k}"]`);
          if (!el) return;
          if (el.scrollIntoView) el.scrollIntoView({
            block: 'center'
          });
          const c = el.querySelector('input[type=text], button');
          if (c && c.focus) c.focus({
            preventScroll: true
          });
        }, 60);
      }
    })), React.createElement(RdIncSigSlot, {
      slot: "parent",
      child: child,
      educator: educator,
      value: sigs.parent,
      disabled: !unlocked,
      disabledText: "Sign as the author first",
      offline: false,
      onHandOver: () => setFamily(true),
      onClear: () => setSigs(s => ({
        ...s,
        parent: null
      }))
    }), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, offline ? 'No signal: the family can sign here now, in person, or once you’re back online. Asking them to sign in Xplor Home isn’t in this prototype yet.' : 'Asking the family to sign in Xplor Home isn’t in this prototype yet. They can sign here in person, or later from Incident records.'));
    const steps = [stepZero, stepOne, stepTwo, stepThree, stepFour];
    const confirm = leave ? {
      text: leave.text,
      keep: 'Keep signing',
      yes: leave.yes,
      run: () => {
        const r = leave.run;
        setLeave(null);
        r();
      },
      cancel: () => setLeave(null)
    } : asking ? {
      text: `Discard this draft? Nothing has been sent. What you entered about ${first} is deleted from this device and can’t be got back.`,
      keep: 'Keep it',
      yes: 'Discard draft',
      run: onDiscard,
      cancel: () => setAsking(false)
    } : null;
    const when = `${f.on ? `${rdIncDay(f.on)}, ` : ''}${RD_AMPM(f.at)}`;
    const chosen = f.natures.map(n => n.label).join(', ');
    const foot = confirm ? React.createElement(RdSheetFootRow, {
      phone: phone,
      edge: true,
      inline: true,
      note: React.createElement("span", {
        role: "alert"
      }, confirm.text)
    }, React.createElement(RdAction, {
      onClick: confirm.cancel
    }, confirm.keep), React.createElement(RdIncDanger, {
      onClick: confirm.run
    }, confirm.yes)) : picking ? React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      inline: true,
      note: f.natures.length ? chosen.length > 64 ? `${chosen.slice(0, 61)}…` : chosen : null
    }, React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      onClick: () => setView('form')
    }, "Done")) : React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      inline: true,
      keep: rdIncHasContent(f) ? dismiss : undefined,
      note: React.createElement(React.Fragment, null, handed && React.createElement(React.Fragment, null, React.createElement("span", {
        style: nw
      }, "Started by ", React.createElement("b", {
        style: b
      }, draft.by)), ' · '), React.createElement("span", {
        style: nw
      }, "Recorded by ", React.createElement("b", {
        style: b
      }, educator.name)), ' · ', React.createElement("span", {
        style: nw
      }, "happened ", React.createElement("b", {
        style: b
      }, when)), ' · ', React.createElement("span", {
        style: nw
      }, "entered ", React.createElement("b", {
        style: b
      }, RD_AMPM(RD_NOW))), offline && step === 4 && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, step === 0 ? React.createElement(RdAction, {
      onClick: dismiss
    }, "Close") : React.createElement(RdAction, {
      onClick: () => step === 4 ? guarded(() => go(3), 'Going back removes the signatures given so far.', 'Go back') : go(step - 1)
    }, "Back"), step < 4 ? React.createElement(RdAction, {
      primary: true,
      muted: !oks[step],
      onClick: next
    }, returnTo != null && step < 3 ? 'Back to review' : step === 3 ? 'Continue to sign' : 'Next') : React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: !sigs.author,
      onClick: save
    }, "Save and lock"));
    return React.createElement("div", {
      ref: rootRef,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      "aria-hidden": "true",
      tabIndex: -1,
      onClick: back,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      ref: cardRef,
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-inc-title",
      tabIndex: -1,
      style: {
        outline: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        maxHeight: '100%',
        ...(!phone ? {
          height: 700
        } : {}),
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: picking ? '1px solid var(--sd-colour-border-default)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: back
    }), React.createElement(RdKid, {
      c: child,
      size: 44
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      id: "rd-inc-title",
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, picking ? 'Kind of incident' : 'Incident record'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: back,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), !picking && React.createElement("div", {
      style: {
        padding: '0 22px 14px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement("div", {
      role: "progressbar",
      "aria-valuemin": 1,
      "aria-valuemax": 5,
      "aria-valuenow": step + 1,
      "aria-label": `Step ${step + 1} of 5, ${RD_INC_STEPS[step]}`,
      style: {
        display: 'flex',
        gap: 5
      }
    }, RD_INC_STEPS.map((s, i) => React.createElement("span", {
      key: s,
      style: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: i <= step ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'
      }
    }))), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, "Step ", step + 1, " of 5 ", React.createElement("span", {
      style: {
        fontWeight: 500,
        color: sub
      }
    }, "\xB7 ", RD_INC_STEPS[step]))), React.createElement(RdSheetMenus.Provider, {
      value: !!phone
    }, React.createElement("div", {
      ref: bodyRef,
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, picking ? React.createElement(RdIncNaturePicker, {
      value: f.natures,
      onChange: n => set({
        natures: n
      }),
      phone: phone
    }) : React.createElement(React.Fragment, null, banner && draft && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 8,
        fontSize: 12.5,
        lineHeight: 1.4,
        fontWeight: 600,
        color: RD_SYNC_FG,
        background: RD_SYNC_BG,
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)'
      }
    }, React.createElement("span", {
      style: {
        marginTop: 1,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 14
    })), React.createElement("span", null, "Draft restored. ", draft.by === educator.name ? 'You started it' : `${draft.by} started it`, " at ", RD_AMPM(draft.startedAt), ".")), steps[step], step < 4 && rdIncHasContent(f) && (mine ? React.createElement("span", {
      style: {
        display: 'flex'
      }
    }, React.createElement(RdTextAction, {
      danger: true,
      onClick: () => setAsking(true)
    }, "Discard this draft\u2026")) : React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, draft.by, " started this draft, so only they can delete it. You can keep going, or close it and it stays here."))))), foot), family && React.createElement(RdIncFamilySign, {
      rec: f,
      child: child,
      authorName: educator.name,
      educator: educator,
      phone: phone,
      onSigned: sig => setSigs(s => ({
        ...s,
        parent: sig
      })),
      onDone: () => setFamily(false)
    }));
  }
  function RdIncidentRecord({
    rec,
    phone,
    offline,
    educator,
    others,
    onClose,
    onSign
  }) {
    const full = rdPhoneFull(phone);
    const child = rdIncChild(rec.childId) || {
      id: rec.childId,
      name: rec.childName,
      room: rec.room,
      age: null
    };
    const first = rdIncFirst(child.name);
    const status = rdIncStatus(rec);
    const [adding, setAdding] = useState(null);
    const [value, setValue] = useState(null);
    const [tried, setTried] = useState(false);
    const [family, setFamily] = useState(false);
    const closeRef = React.useRef(onClose);
    const cancelAdd = () => {
      const k = adding;
      setAdding(null);
      setValue(null);
      setTried(false);
      setTimeout(() => {
        const el = document.getElementById(`rd-inc-add-${k}`);
        if (el) el.focus({
          preventScroll: true
        });
      }, 60);
    };
    closeRef.current = family ? () => {} : adding ? cancelAdd : onClose;
    const rootRef = React.useRef(null);
    const sheetRef = React.useRef(null);
    const addRef = React.useRef(null);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          closeRef.current();
        }
      };
      window.addEventListener('keydown', esc, true);
      const opener = document.activeElement;
      const undo = rdIncInert(rootRef.current, {
        levels: 8,
        stopAtDialog: true
      });
      if (sheetRef.current) sheetRef.current.focus({
        preventScroll: true
      });
      return () => {
        window.removeEventListener('keydown', esc, true);
        undo();
        if (opener && opener !== document.body && opener.isConnected && typeof opener.focus === 'function') opener.focus({
          preventScroll: true
        });
      };
    }, []);
    useEffect(() => {
      if (!adding) return undefined;
      const t = setTimeout(() => {
        const el = addRef.current;
        if (!el) return;
        if (el.scrollIntoView) el.scrollIntoView({
          block: 'center'
        });
        const c = el.querySelector('input[type=text], textarea, button');
        if (c && c.focus) c.focus({
          preventScroll: true
        });
      }, 60);
      return () => clearTimeout(t);
    }, [adding]);
    const dayWord = on => on === 0 ? 'today' : on === 1 ? 'yesterday' : `on ${rdShortDate(rdAddDays(RD_TODAY, -on))}`;
    const slots = ['author', 'witness', 'notifier', 'parent'];
    const signed = k => rec.sigs && rec.sigs[k] && rec.sigs[k].capture;
    const ready = !!(value && value.capture && value.name.trim() && value.role);
    const others2 = (others || []).filter(e => e.name !== rec.by);
    const pill = status === 'complete' ? 'ds-pill--green' : status === 'unsigned' ? 'ds-pill--orange' : 'ds-pill--grey';
    const lockWho = [rec.sigs.author.name, signed('parent') ? rec.sigs.parent.name : null].filter(Boolean);
    const save = () => {
      if (!ready) {
        setTried(true);
        return;
      }
      onSign(rec.id, adding, {
        name: rdCap(value.name.trim(), 80),
        role: value.role,
        capture: value.capture,
        on: 0,
        at: RD_NOW
      });
      cancelAdd();
    };
    const sigRows = slots.map(k => {
      const s = rec.sigs[k];
      if (signed(k)) {
        return React.createElement(RdSignatureReadback, {
          key: k,
          capture: s.capture,
          name: s.name,
          role: s.role,
          day: dayWord(s.on || 0),
          at: s.at,
          declaration: RD_INC_SLOTS[k].decl(first)
        });
      }
      if (adding === k) {
        return React.createElement("div", {
          key: k,
          ref: addRef,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, React.createElement(RdIncSigSlot, {
          slot: k,
          id: `rd-inc-rec-sig-${k}`,
          child: child,
          educator: educator,
          others: others2,
          value: value,
          onChange: setValue,
          open: true,
          onOpen: () => {},
          invalid: tried && !ready
        }));
      }
      return React.createElement("div", {
        key: k,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 56,
          padding: '6px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)'
        }
      }, React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700
        }
      }, RD_INC_SLOTS[k].title), React.createElement("span", {
        style: {
          fontSize: 12.5,
          color: RD_INC_SUB
        }
      }, "Not signed yet")), !offline && k === 'parent' && React.createElement(RdTextAction, {
        id: "rd-inc-add-parent",
        onClick: () => setFamily(true),
        ariaLabel: "Hand the device to the family to sign"
      }, "Hand to the family"), !offline && k !== 'parent' && React.createElement(RdTextAction, {
        id: `rd-inc-add-${k}`,
        onClick: () => {
          setAdding(k);
          setValue(null);
        },
        ariaLabel: `Add the signature of ${RD_INC_SLOTS[k].title.toLowerCase()}`
      }, "Add signature"));
    });
    return React.createElement("div", {
      ref: rootRef,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      "aria-hidden": "true",
      tabIndex: -1,
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      ref: sheetRef,
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-increc-title",
      tabIndex: -1,
      style: {
        outline: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: 640,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement(RdKid, {
      c: child,
      size: 44
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      id: "rd-increc-title",
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, "Incident record"), React.createElement("span", {
      className: `ds-pill ds-pill--sm ${pill} ds-pill--minimal`
    }, status === 'unsigned' ? 'Waiting for the family’s signature' : RD_INC_STATUS[status])), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: RD_INC_SUB
      }
    }, child.name, " \xB7 recorded by ", rec.by, rec.startedBy && rec.startedBy !== rec.by ? ` · started by ${rec.startedBy}` : '')), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: RD_INC_SUB
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }
    }, rec.local && React.createElement(RdBlockedNote, {
      text: "Not sent yet \xB7 saved on this device. It goes to the centre when you are back online."
    }), React.createElement("div", {
      className: "ds-message-box",
      role: "note"
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: "lock",
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, "Signed by ", lockWho.join(' and '), ". It can\u2019t be changed."))), React.createElement("p", {
      className: "ds-message-box__body"
    }, status === 'unsigned' ? `The parent or guardian’s signature is still to come. ${offline ? 'You can add it once you are back online.' : 'You can add it below.'} ` : '', "If something here is wrong, it can\u2019t be changed in this app. Tell your service\u2019s leader."))), React.createElement(RdIncSummary, {
      rec: rec
    }), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, React.createElement(RdLabel, null, "Signatures"), sigRows, offline && slots.some(k => !signed(k)) && React.createElement(RdBlockedNote, {
      text: "Adding a signature needs a connection. The record the centre holds is not on this device."
    }))), adding ? React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      inline: true
    }, React.createElement(RdAction, {
      onClick: cancelAdd
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: !ready,
      onClick: save
    }, "Save signature")) : React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      inline: true
    }, React.createElement(RdAction, {
      primary: true,
      onClick: onClose
    }, "Close"))), family && React.createElement(RdIncFamilySign, {
      rec: rec,
      child: child,
      authorName: rec.sigs.author.name,
      educator: educator,
      phone: phone,
      onSigned: sig => onSign(rec.id, 'parent', sig),
      onDone: () => {
        setFamily(false);
        setTimeout(() => {
          const el = document.getElementById('rd-inc-add-parent') || sheetRef.current;
          if (el) el.focus({
            preventScroll: true
          });
        }, 60);
      }
    }));
  }
  const RD_INC_PAGE = 8;
  const rdIncRoomName = key => {
    const r = RD_ROOMS.find(x => x.key === key);
    return r ? String(r.name).replace(/ Room$/, '') : '';
  };
  function RdIncidentRecords({
    ctx
  }) {
    const {
      inc,
      saveInc,
      educator,
      others,
      phone,
      offline,
      openDraft
    } = ctx;
    const seen = rdIncAll(inc).filter(r => r.kind !== 'draft' || RD_INC_POLICY.draftsSeen === 'everyone' || r.by === educator.name);
    const all = seen.filter(r => !(offline && r.kind !== 'draft') || r.local);
    const [tab, setTab] = useState(() => {
      if (offline) return all.some(r => r.kind === 'unsigned') ? 'unsigned' : 'draft';
      return all.some(r => r.kind === 'unsigned') ? 'unsigned' : 'complete';
    });
    const [q, setQ] = useState('');
    const [range, setRange] = useState(null);
    const [dates, setDates] = useState(false);
    const [pick, setPick] = useState({
      from: 7,
      to: 0
    });
    const [limit, setLimit] = useState(RD_INC_PAGE);
    const [openId, setOpenId] = useState(null);
    const sub = RD_INC_SUB;
    const needle = q.trim().toLowerCase();
    const filtering = !!(needle || range);
    const passes = r => (!needle || `${r.childName} ${rdIncNatureText(r)}`.toLowerCase().includes(needle)) && (!range || (r.on || 0) <= range.from && (r.on || 0) >= range.to);
    const hits = all.filter(passes);
    const countOf = k => hits.filter(r => r.kind === k).length;
    const rows = hits.filter(r => r.kind === tab).sort((a, b) => tab === 'unsigned' ? rdIncSortKey(a) - rdIncSortKey(b) : rdIncSortKey(b) - rdIncSortKey(a));
    const shown = rows.slice(0, limit);
    const open = openId ? inc.records.find(r => r.id === openId) : null;
    const sign = (id, slot, sig) => saveInc(d => ({
      ...d,
      records: d.records.map(r => r.id === id ? {
        ...r,
        sigs: {
          ...r.sigs,
          [slot]: {
            ...sig,
            by: educator.name
          }
        }
      } : r)
    }));
    const badRange = pick.from < pick.to;
    const names = {
      unsigned: 'Unsigned',
      draft: 'Drafts',
      complete: 'Completed'
    };
    const lab = k => {
      const n = countOf(k);
      return n && (k !== 'complete' || filtering) ? `${names[k]} ${n}` : filtering ? `${names[k]} 0` : names[k];
    };
    const tabs = [['unsigned', lab('unsigned')], ['draft', lab('draft')], ['complete', lab('complete')]];
    const elsewhere = !rows.length && filtering ? ['unsigned', 'draft', 'complete'].find(k => k !== tab && countOf(k) > 0) : null;
    const empty = offline && !filtering && !all.some(r => r.kind === tab) && tab !== 'draft' ? 'Nothing saved on this device is waiting to be sent.' : filtering ? `No match in ${names[tab]}.` : tab === 'unsigned' ? 'No records are waiting for a signature.' : tab === 'draft' ? 'No drafts on this device.' : 'No completed records yet.';
    const held = tab !== 'draft';
    const edgeX = phone ? 16 : 28;
    return React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }
    }, React.createElement("div", {
      style: {
        flexShrink: 0,
        padding: `${phone ? 12 : 16}px ${edgeX}px 12px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 760,
        margin: '0 auto',
        boxSizing: 'border-box'
      }
    }, React.createElement("div", {
      style: phone ? {
        '--sd-spacing-component-md': '10px'
      } : undefined
    }, React.createElement(RdSegmented, {
      options: tabs,
      value: tab,
      onChange: k => {
        setTab(k);
        setLimit(RD_INC_PAGE);
      },
      ariaLabel: "Which incident records"
    })), tab === 'unsigned' && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.4,
        color: sub
      }
    }, "Signed by the educator, waiting for the parent or guardian."), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement(RdSearch, {
      value: q,
      onChange: v => {
        setQ(v);
        setLimit(RD_INC_PAGE);
      },
      count: rows.length,
      placeholder: "Search records",
      compact: true
    })), React.createElement("button", {
      type: "button",
      "aria-expanded": dates,
      onClick: () => setDates(o => !o),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 40,
        padding: '0 13px',
        flexShrink: 0,
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${dates || range ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
        background: range ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
        color: range ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "calendar",
      size: 16
    }), "Dates")), dates && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 14,
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "From"), React.createElement(RdDatePill, {
      on: pick.from,
      onChange: n => setPick(p => ({
        ...p,
        from: n
      })),
      ariaLabel: "From date"
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "To"), React.createElement(RdDatePill, {
      on: pick.to,
      onChange: n => setPick(p => ({
        ...p,
        to: n
      })),
      ariaLabel: "To date"
    }))), badRange && React.createElement("span", {
      role: "alert",
      style: RD_INC_NEED
    }, "The first date has to be on or before the second."), React.createElement("span", {
      style: {
        display: 'flex',
        gap: 10,
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
      }
    }, React.createElement(RdAction, {
      onClick: () => {
        setRange(null);
        setDates(false);
        setLimit(RD_INC_PAGE);
      }
    }, "Clear"), React.createElement(RdAction, {
      primary: true,
      muted: badRange,
      onClick: badRange ? undefined : () => {
        setRange({
          from: pick.from,
          to: pick.to
        });
        setDates(false);
        setLimit(RD_INC_PAGE);
      }
    }, "Apply"))), range && !dates && React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, React.createElement("span", null, "Showing ", rdIncDay(range.from), " to ", rdIncDay(range.to)), React.createElement(RdTextAction, {
      onClick: () => setRange(null)
    }, "Clear")), offline && held && React.createElement(RdBlockedNote, {
      text: "The centre\u2019s records need a connection to open. Drafts, and records saved on this device, are still here."
    })), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        paddingBottom: 28
      }
    }, React.createElement("ul", {
      style: {
        listStyle: 'none',
        margin: '0 auto',
        padding: `0 ${edgeX}px`,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 760,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, shown.map(r => {
      const c = rdIncChild(r.childId);
      const draft = r.kind === 'draft';
      const mine = draft && r.by === educator.name;
      const room = rdIncRoomName(r.room);
      return React.createElement("li", {
        key: r.id
      }, React.createElement("button", {
        type: "button",
        onClick: () => draft ? openDraft(r.childId) : setOpenId(r.id),
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          minHeight: 68,
          padding: '10px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          background: 'var(--sd-colour-surface-default)'
        }
      }, c ? React.createElement(RdKid, {
        c: c,
        size: 40
      }) : React.createElement(RdAvatar, {
        name: r.childName,
        size: 40
      }), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }
      }, React.createElement("span", {
        style: {
          fontSize: 15,
          fontWeight: 700,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, r.childName, room ? React.createElement("span", {
        style: {
          fontWeight: 500,
          color: sub
        }
      }, " \xB7 ", room) : null), React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: sub,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, rdIncNatureText(r, 2)), React.createElement("span", {
        style: {
          fontSize: 12.5,
          color: sub
        }
      }, draft ? `Started by ${r.by} at ${RD_AMPM(r.startedAt)}` : `${rdIncWhen(r)} · by ${r.by}`, r.local && React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, " \xB7 Not sent yet"))), draft && mine && React.createElement("span", {
        className: "ds-pill ds-pill--sm ds-pill--green ds-pill--minimal",
        style: {
          flexShrink: 0
        }
      }, "Yours"), React.createElement("span", {
        style: {
          color: sub,
          flexShrink: 0,
          display: 'inline-flex'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 16
      }))));
    }), !shown.length && React.createElement("li", {
      style: {
        fontSize: 14,
        lineHeight: 1.5,
        color: sub,
        padding: '24px 4px',
        textAlign: 'center',
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, React.createElement("span", null, empty, elsewhere ? ` ${countOf(elsewhere)} in ${names[elsewhere]}.` : ''), elsewhere && React.createElement(RdTextAction, {
      onClick: () => {
        setTab(elsewhere);
        setLimit(RD_INC_PAGE);
      }
    }, "Show ", names[elsewhere]))), rows.length > shown.length && React.createElement("span", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14
      }
    }, React.createElement(RdAction, {
      onClick: () => setLimit(n => n + RD_INC_PAGE)
    }, "Show ", Math.min(RD_INC_PAGE, rows.length - shown.length), " more"))), open && React.createElement(RdIncidentRecord, {
      rec: open,
      phone: phone,
      offline: offline,
      educator: educator,
      others: others,
      onClose: () => setOpenId(null),
      onSign: sign
    }));
  }
  function RdSignSheet({
    child,
    direction,
    offline,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onConfirm,
    z = 40
  }) {
    const full = rdPhoneFull(phone);
    const out = direction === 'out';
    const again = !out && child.status === 'gone';
    const collectOn = out && rdAttOn('signOutTo');
    const mustSay = collectOn && RD_COLLECT_REQUIRED;
    const floor = /^\d{1,2}:\d{2}$/.test(String(child.at)) && (out && child.status === 'here' || again) ? child.at : null;
    const [note, setNote] = useState('');
    const [at, setAt] = useState(RD_NOW);
    const [who, setWho] = useState(null);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: z,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 660,
        maxHeight: '100%',
        overflowY: 'auto',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement(RdKid, {
      c: child,
      size: 44
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, out ? 'Sign out' : again ? 'Sign in again' : 'Sign in'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, out && child.collect && React.createElement("div", {
      className: "ds-message-box"
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: "lock",
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, rdCollectLabel(child.collect), " \u2014 ", child.collect.who, " can\u2019t collect"))), React.createElement("p", {
      className: "ds-message-box__body"
    }, child.collect.note))), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, out ? 'Left at' : 'Arrived at'), React.createElement(RdTimeField, {
      value: at,
      onChange: setAt,
      ariaLabel: out ? 'Time they left' : 'Time they arrived',
      min: floor,
      minLabel: out ? 'when they signed in' : 'when they signed out'
    }), again && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: '16px',
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "This is a new sign-in. The earlier ones stay on their log.")), collectOn && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Collected by"), React.createElement(RdChoiceChips, {
      options: rdCollectOptions(child, offline),
      value: who,
      onChange: setWho,
      ariaLabel: "Who collected them"
    }), rdNotOnPickup(child) && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: '16px',
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, rdNotOnPickup(child))), React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Note"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: note,
      onChange: e => setNote(e.target.value),
      "aria-label": `Note for ${child.name}`,
      placeholder: `Optional · for ${child.name.split(' ')[0]}`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width: '100%',
        height: 'var(--sd-spacing-touch-target)',
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 14
      }
    }))), React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true,
      note: React.createElement(React.Fragment, null, "Recorded by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), " at ", RD_AMPM(at), offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: mustSay && !who,
      onClick: !mustSay || who ? () => onConfirm(at, collectOn ? who : null, note.trim() || null) : undefined
    }, mustSay && !who ? 'Say who collected' : again ? `Sign in ${child.name.split(' ')[0]} again` : `${out ? 'Sign out' : 'Sign in'} ${child.name.split(' ')[0]}`))));
  }
  const rdMedRecordRows = (child, entry, {
    past = false,
    pending = false
  } = {}) => {
    const m = entry.med;
    const sub = 'var(--sd-colour-text-secondary)';
    const first = child.name.split(' ')[0];
    const ago = past || m.on ? null : rdAgo(entry.at);
    const next = RD_MED_NEXT_DUE && m.next ? m.next.mode === 'time' ? m.next.at ? RD_AMPM(m.next.at) : null : m.next.mode === 'circumstances' ? m.next.when ? `Only if needed — ${m.next.when}` : null : 'No further doses today' : null;
    const rows = [{
      key: 'what',
      label: 'Medication',
      node: React.createElement(React.Fragment, null, m.name, m.source === 'file' && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 on file"))
    }, {
      key: 'dose',
      label: 'Dose',
      node: React.createElement(React.Fragment, null, rdDoseText(m.amount, m.unit), m.outcome === 'Part dose' && m.partAmount && React.createElement("span", {
        style: {
          display: 'block',
          fontSize: 12.5,
          color: sub,
          fontWeight: 600
        }
      }, "Part dose: ", rdDoseText(m.partAmount, m.unit), " given"))
    }, {
      key: 'route',
      label: 'Route',
      node: m.route
    }, {
      key: 'reason',
      label: 'Reason',
      node: m.reason
    }, {
      key: 'expiry',
      label: 'Expiry',
      node: m.expiry === 'none' ? React.createElement("span", {
        style: {
          color: sub
        }
      }, "None on the label") : rdMonthText(m.expiry)
    }, {
      key: 'when',
      label: 'Given',
      node: React.createElement(React.Fragment, null, rdMedWhen(m), ago && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 ", ago))
    }];
    if (m.on > 0 && m.admin) rows.push({
      key: 'entered',
      label: 'Entered',
      node: React.createElement(React.Fragment, null, "Today at ", RD_AMPM(m.admin.at), React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 a late entry"))
    });
    if (next) rows.push({
      key: 'next',
      label: 'Next dose',
      node: next
    });
    if ((m.flags || []).length) rows.push({
      key: 'flags',
      label: 'Flagged',
      node: React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)'
        }
      }, m.flags.join(' · '), " \u2014 for follow-up")
    });
    rows.push({
      key: 'note',
      label: 'Note',
      node: entry.note ? React.createElement(React.Fragment, null, "\u201C", entry.note, "\u201D") : React.createElement("span", {
        style: {
          color: sub
        }
      }, "No note")
    });
    rows.push({
      key: 'photo',
      label: 'Photo',
      node: React.createElement("span", {
        style: {
          color: sub
        }
      }, "None")
    });
    if (pending) rows.push({
      key: 'sent',
      label: 'Status',
      node: React.createElement("span", {
        style: {
          color: RD_SYNC_FG
        }
      }, "Not sent yet \xB7 saved on this device")
    });
    [['admin', 'Given by', 'sig-a'], ['witness', 'Witnessed by', 'sig-w']].forEach(([who, label, key]) => {
      const s = m[who];
      if (!s) return;
      rows.push({
        key,
        block: true,
        node: React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 7
          }
        }, React.createElement(RdLabel, null, label), React.createElement(RdSignatureReadback, {
          capture: s.sig,
          name: s.name,
          role: s.role,
          day: "today",
          at: s.at,
          declaration: rdMedDecl(who, first)
        }))
      });
    });
    return rows;
  };
  const rdRecordRows = (child, entry, {
    past = false,
    pending = false
  } = {}) => {
    if (entry.kind === 'med' && entry.med) return rdMedRecordRows(child, entry, {
      past,
      pending
    });
    const sub = 'var(--sd-colour-text-secondary)';
    const cfg = RD_BULK[entry.kind] || {};
    const what = cfg.perChild && cfg.perChild.label && !String(entry.detail || '').includes('·') ? cfg.perChild.label : 'Recorded';
    const ago = past ? null : rdAgo(entry.at);
    const rows = [];
    const snap = !!entry.readOnly;
    const lead = `${what} `;
    const detailShown = String(entry.detail || '').startsWith(lead) ? String(entry.detail).slice(lead.length) : entry.detail;
    const meal = entry.kind === 'meal' && entry.rec && entry.rec.meal ? entry.rec.meal : null;
    if (meal) {
      rows.push({
        key: 'occ',
        label: 'Which meal',
        node: rdSlotLabel(meal.slot) || entry.context
      });
      rows.push({
        key: 'items',
        label: 'Items',
        node: React.createElement("span", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, meal.items.map((i, n) => React.createElement("span", {
          key: n,
          style: {
            display: 'flex',
            flexDirection: 'column'
          }
        }, React.createElement("span", null, i.name, " \xB7 ", rdUnitText(i.qty, i.unit)), i.notEaten && React.createElement("span", {
          style: {
            fontSize: 12.5,
            color: sub,
            fontWeight: 600
          }
        }, "Offered, not ", rdNotWord(i.type, meal.slot)))))
      });
    } else if (entry.detail) rows.push({
      key: 'what',
      label: what,
      node: detailShown
    });
    rows.push({
      key: 'when',
      label: 'Time',
      node: React.createElement(React.Fragment, null, RD_AMPM(entry.at), ago && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 ", ago))
    });
    if (!snap || entry.by) rows.push({
      key: 'by',
      label: 'Recorded by',
      node: entry.origin === 'family' ? React.createElement(React.Fragment, null, entry.by, React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 500
        }
      }, " \xB7 family")) : entry.by || React.createElement("span", {
        style: {
          color: sub
        }
      }, "Not recorded")
    });
    if (entry.origin === 'family') rows.push({
      key: 'where',
      label: 'Where',
      node: 'At home'
    });
    if (pending) rows.push({
      key: 'sent',
      label: 'Status',
      node: React.createElement("span", {
        style: {
          color: RD_SYNC_FG
        }
      }, "Not sent yet \xB7 saved on this device")
    });
    if (entry.kind === 'sleep') {
      if (!snap || rdSleepRecordParts(entry.rec).length) rows.push({
        key: 'obs',
        label: 'Observed',
        node: rdSleepRecordParts(entry.rec).length ? React.createElement(RdSleepRecord, {
          rec: entry.rec,
          style: {
            fontSize: 14,
            lineHeight: '20px'
          }
        }) : React.createElement("span", {
          style: {
            color: sub
          }
        }, "Not recorded")
      });
      if (RD_PERIOD_END[entry.type] && rdSleepTotalText(child)) rows.push({
        key: 'slept',
        label: 'This sleep',
        node: rdSleepTotalText(child)
      });
    }
    if (!snap || entry.note) rows.push({
      key: 'note',
      label: 'Note',
      node: entry.note ? React.createElement(React.Fragment, null, "\u201C", entry.note, "\u201D", (entry.kind === 'sleep' || entry.kind === 'meal') && React.createElement("span", {
        style: {
          display: 'block',
          fontSize: 12.5,
          color: sub,
          fontWeight: 600
        }
      }, RD_PUBLIC_NOTE)) : React.createElement("span", {
        style: {
          color: sub
        }
      }, "No note")
    });
    if (!snap) rows.push({
      key: 'photo',
      label: 'Photo',
      node: React.createElement("span", {
        style: {
          color: sub
        }
      }, "None")
    });
    return rows;
  };
  function RdRecordSheet({
    child,
    entry,
    title,
    can,
    amended,
    pending = false,
    past = false,
    phone,
    onAmend,
    onDelete,
    onClose
  }) {
    const full = rdPhoneFull(phone);
    const sub = 'var(--sd-colour-text-secondary)';
    const first = child.name.split(' ')[0];
    const [confirming, setConfirming] = useState(false);
    const back = () => confirming ? setConfirming(false) : onClose();
    const backRef = React.useRef(back);
    backRef.current = back;
    const rootRef = React.useRef(null);
    const sheetRef = React.useRef(null);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') backRef.current();
      };
      window.addEventListener('keydown', esc);
      const opener = document.activeElement;
      const root = rootRef.current;
      const made = [];
      if (root && root.parentElement) {
        Array.from(root.parentElement.children).forEach(sib => {
          if (sib !== root && !sib.hasAttribute('inert')) {
            sib.setAttribute('inert', '');
            made.push(sib);
          }
        });
      }
      if (sheetRef.current) sheetRef.current.focus({
        preventScroll: true
      });
      return () => {
        window.removeEventListener('keydown', esc);
        made.forEach(n => n.removeAttribute('inert'));
        if (opener && opener !== document.body && opener.isConnected && typeof opener.focus === 'function') opener.focus({
          preventScroll: true
        });
      };
    }, []);
    const asked = React.useRef(false);
    useEffect(() => {
      const target = document.getElementById(confirming ? 'rd-rec-keep' : 'rd-rec-del');
      if (confirming || asked.current) {
        if (target) target.focus({
          preventScroll: true
        });
      }
      if (confirming) {
        const box = document.getElementById('rd-rec-confirm');
        if (box && box.scrollIntoView) box.scrollIntoView({
          block: 'end'
        });
      }
      asked.current = confirming;
    }, [confirming]);
    const rows = rdRecordRows(child, entry, {
      past,
      pending
    });
    const lines = rows.filter(r => !r.block);
    const blocks = rows.filter(r => r.block);
    const signedMed = entry.kind === 'med' && entry.med && entry.med.signed;
    return React.createElement("div", {
      ref: rootRef,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      "aria-hidden": "true",
      tabIndex: -1,
      onClick: back,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      ref: sheetRef,
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-rec-title",
      tabIndex: -1,
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 540,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: back
    }), React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, entry.kind === 'in' || entry.kind === 'out' ? React.createElement(RdLogIcon, {
      kind: entry.kind,
      size: 22
    }) : React.createElement(RdColourIcon, {
      kind: RD_COLOUR_ICON[entry.kind] ? entry.kind : 'note',
      size: 22
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      id: "rd-rec-title",
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, title), amended && React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--grey"
    }, "Amended")), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, child.name)), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: back,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 'var(--sd-spacing-touch-target)',
        height: 'var(--sd-spacing-touch-target)',
        margin: '-12px -12px -12px 0',
        borderRadius: 'var(--sd-radius-full)',
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, React.createElement("dl", {
      style: {
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, lines.map(r => React.createElement("div", {
      key: r.key,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'baseline'
      }
    }, React.createElement("dt", {
      style: {
        width: 92,
        flexShrink: 0,
        fontSize: 12.5,
        fontWeight: 700,
        color: sub
      }
    }, r.label), React.createElement("dd", {
      style: {
        margin: 0,
        flex: 1,
        minWidth: 0,
        fontSize: 14.5,
        lineHeight: '21px',
        fontWeight: 600,
        overflowWrap: 'anywhere'
      }
    }, r.node)))), blocks.map(r => React.createElement("div", {
      key: r.key
    }, r.node)), can.why && React.createElement("div", {
      className: 'ds-message-box' + (can.offline ? ' ds-message-box--purple' : ''),
      role: "note"
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: can.offline ? 'wifi-off' : 'lock',
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, can.why))), (can.offline || can.hint) && React.createElement("p", {
      className: "ds-message-box__body"
    }, can.offline ? 'You can change it once you’re back online.' : can.hint))), can.del && !confirming && React.createElement("span", {
      style: {
        display: 'flex',
        paddingTop: 2
      }
    }, React.createElement(RdTextAction, {
      id: "rd-rec-del",
      danger: true,
      onClick: () => setConfirming(true)
    }, "Delete this record\u2026")), can.del && confirming && React.createElement("div", {
      id: "rd-rec-confirm",
      role: "alertdialog",
      "aria-label": "Delete this record",
      "aria-describedby": "rd-rec-del-says",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700
      }
    }, "Delete this record?"), React.createElement("span", {
      id: "rd-rec-del-says",
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "It comes off ", first, "\u2019s day.", entry.kind === 'sleep' ? ` ${first}’s sleep state goes back to what it was before.` : '', signedMed ? ` It was signed by ${entry.med.admin.name} and ${entry.med.witness.name}. If the dose was given, record it again straight away: until then the sheet warns that a dose was deleted.` : '', " The audit trail keeps a line saying who deleted it, and what it said."), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap'
      }
    }, React.createElement(RdTextAction, {
      id: "rd-rec-keep",
      color: "var(--sd-colour-text-primary)",
      onClick: () => setConfirming(false)
    }, "Keep it"), React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--destructive ds-btn--sm",
      onClick: onDelete
    }, "Delete record")))), React.createElement(RdSheetFoot, {
      phone: phone,
      edge: true
    }, can.amend ? [React.createElement(RdAction, {
      key: "close",
      onClick: back
    }, "Close"), React.createElement(RdAction, {
      key: "amend",
      primary: true,
      glyph: 'edit',
      muted: confirming,
      onClick: confirming ? undefined : onAmend
    }, "Amend")] : [React.createElement(RdAction, {
      key: "close",
      primary: true,
      onClick: back
    }, "Close")])));
  }
  function RdCorrectSheet({
    child,
    kind,
    title,
    at,
    detail,
    note,
    rec,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onConfirm
  }) {
    const full = rdPhoneFull(phone);
    const label = title || RD_EVENT_LABEL[kind] || RD_LOG_TITLE[kind] || 'Note';
    const timeOn = rdTimeAmendable(kind);
    const [newAt, setNewAt] = useState(at);
    const [newNote, setNewNote] = useState(note || '');
    const [reason, setReason] = useState('');
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const timeChanged = timeOn && newAt !== at;
    const noteChanged = (newNote.trim() || '') !== (note || '');
    const ready = timeChanged || noteChanged;
    const noTime = timeOn ? null : !rdTimesEditable() ? 'This service doesn’t allow an event’s time to be changed.' : `A ${label.toLowerCase()}’s time can’t be changed. To change it, delete this record and record it again.`;
    return (React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 28,
          ...full.gutter
        }
      }, !phone && React.createElement("button", {
        type: "button",
        "aria-label": "Cancel",
        onClick: onClose,
        className: "rd-scrim",
        style: {
          all: 'unset',
          cursor: 'pointer',
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,40,34,0.45)'
        }
      }), React.createElement("div", {
        className: "rd-sheet",
        style: {
          position: 'relative',
          width: '100%',
          maxWidth: 540,
          maxHeight: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--sd-colour-surface-default)',
          borderRadius: 'var(--sd-radius-lg)',
          boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
          ...full.card
        }
      }, React.createElement("div", {
        style: {
          padding: '20px 22px 16px',
          borderBottom: '1px solid var(--sd-colour-border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          ...full.head
        }
      }, phone && React.createElement(RdSheetBack, {
        onClick: onClose
      }), React.createElement("span", {
        style: {
          width: 40,
          height: 40,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--sd-colour-surface-cyan)',
          color: 'var(--sd-colour-action-primary)'
        }
      }, React.createElement(RdColourIcon, {
        kind: RD_COLOUR_ICON[kind] ? kind : 'note',
        size: 22
      })), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 18,
          fontWeight: 700
        }
      }, "Amend ", label.toLowerCase()), React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, child.name, " \xB7 logged at ", RD_AMPM(at), detail ? ` · ${detail}` : '')), !phone && React.createElement("button", {
        type: "button",
        "aria-label": "Close",
        onClick: onClose,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 'var(--sd-spacing-touch-target)',
          height: 'var(--sd-spacing-touch-target)',
          margin: '-12px -12px -12px 0',
          borderRadius: 'var(--sd-radius-full)',
          color: 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement(SdIcon, {
        name: "close",
        size: 20
      }))), React.createElement("div", {
        style: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px 22px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }
      }, React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "The original record isn\u2019t deleted \u2014 the amended version stands and the change is kept on the audit trail."), kind === 'meal' && rec && rec.meal && React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }, React.createElement(RdLabel, null, "Items"), React.createElement("span", {
        style: {
          fontSize: 14.5,
          lineHeight: '21px',
          fontWeight: 600,
          overflowWrap: 'anywhere'
        }
      }, rdMealText(rec.meal.items)), React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "Wrong amount? Delete this record and add it again.")), React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "Note"), React.createElement("input", {
        className: "fp-input",
        type: "text",
        autoFocus: true,
        value: newNote,
        onChange: e => setNewNote(e.target.value),
        placeholder: "Anything worth passing on",
        "aria-describedby": kind === 'sleep' || kind === 'meal' ? 'rd-am-public' : undefined,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          width: '100%',
          height: 44,
          padding: '0 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          fontFamily: 'var(--sd-font-family)',
          fontSize: 14.5
        }
      }), (kind === 'sleep' || kind === 'meal') && React.createElement("span", {
        id: "rd-am-public",
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, RD_PUBLIC_NOTE)), timeOn && React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7
        }
      }, React.createElement(RdLabel, null, "Time"), React.createElement(RdTimeField, {
        value: newAt,
        onChange: setNewAt,
        ariaLabel: "Amended time",
        min: rdSignInFloor(kind, child),
        minLabel: "when they signed in"
      })), noTime && React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, noTime), React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "Reason for the change (optional)"), React.createElement("input", {
        className: "fp-input",
        type: "text",
        value: reason,
        onChange: e => setReason(e.target.value),
        placeholder: "Why the original was wrong",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          width: '100%',
          height: 44,
          padding: '0 14px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          fontFamily: 'var(--sd-font-family)',
          fontSize: 14.5
        }
      }), React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "The amendment is attributed and time-stamped either way. Some services will want a reason on every amendment \u2014 that\u2019s a per-service setting, not a rule here."))), React.createElement(RdSheetFoot, {
        phone: phone,
        edge: true,
        note: ready ? React.createElement(React.Fragment, null, "Amended by ", React.createElement("b", {
          style: {
            color: 'var(--sd-colour-text-primary)'
          }
        }, educator.name)) : timeOn ? 'Change the note or the time to save an amendment.' : 'Change the note to save an amendment.'
      }, React.createElement(RdAction, {
        onClick: onClose
      }, "Cancel"), React.createElement(RdAction, {
        primary: true,
        glyph: 'tick',
        muted: !ready,
        onClick: ready ? () => onConfirm({
          at: newAt,
          note: newNote.trim() || null,
          reason: reason.trim()
        }) : undefined
      }, "Save amendment"))))
    );
  }
  function RdHeadcountSheet({
    roster = [],
    rooms = [],
    startView = 'all',
    grouping = null,
    count: countNow = null,
    history = [],
    acting = '',
    educator = RD_EDUCATOR,
    conn = 'online',
    phone = false,
    covered = false,
    emergencyRunning = false,
    openOnCounts = false,
    fromCounts = false,
    onBackToCounts,
    onSignIn,
    onContacts,
    onEmergency,
    onOpenCount,
    onOpenEducator,
    onClose,
    onRecord
  }) {
    const full = rdPhoneFull(phone);
    const count = React.useMemo(() => countNow, []);
    const baseRev = React.useMemo(() => countNow ? countNow.rev || 0 : 0, []);
    const amend = !!count;
    const [saveError, setSaveError] = useState(null);
    const roomKeys = rooms.map(r => r.key);
    const roomName = k => (rooms.find(r => r.key === k) || {}).name || k;
    const initial = React.useMemo(() => count ? new Map(count.children.map(x => [x.id, x])) : null, []);
    const countRooms = amend ? [...new Set(count.children.map(x => x.room))] : roomKeys;
    const draft = amend ? null : rdCountDraft.routine;
    const [view, setView] = useState(() => amend ? countRooms.length === 1 ? countRooms[0] : 'all' : draft && (draft.view === 'all' || roomKeys.includes(draft.view)) ? draft.view : startView);
    const [ticks, setTicks] = useState(() => amend ? Object.fromEntries(count.children.filter(x => x.counted).map(x => [x.id, {
      by: x.by,
      at: x.at
    }])) : draft ? Object.fromEntries(Object.entries(draft.ticks).filter(([id]) => roster.some(c => String(c.id) === id && c.status === 'here'))) : {});
    useEffect(() => {
      if (!amend) rdCountDraft.routine = Object.keys(ticks).length ? {
        ticks,
        view
      } : null;
    }, [ticks, view]);
    const [stage, setStage] = useState('count');
    const [showCounts, setShowCounts] = useState(!!openOnCounts);
    const [gKey, setGKey] = useState(null);
    const [closedX, setClosedX] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [q, setQ] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const askRef = React.useRef(null);
    const sheetRef = React.useRef(null);
    const rowCache = React.useRef(new Map());
    const rowOf = c => {
      const sig = [c.status, c.state, c.childTag && (c.childTag.id || c.childTag.name), c.name].join('|');
      const hit = rowCache.current.get(c.id);
      if (hit && hit.sig === sig) return hit.row;
      const row = {
        ...c,
        roomKey: c.room,
        room: roomNameOf(c),
        notIn: c.status !== 'here',
        stateWord: c.status === 'expected' || c.status === 'here' ? null : RD_EM_STATE_WORD[c.status] || null
      };
      rowCache.current.set(c.id, {
        sig,
        row
      });
      return row;
    };
    const byId = new Map(roster.map(c => [c.id, c]));
    const everyone = amend ? count.children.filter(x => byId.has(x.id)).map(x => rowOf(byId.get(x.id))) : roster.filter(c => (c.status === 'here' || c.status === 'expected') && roomKeys.includes(c.room)).map(rowOf);
    const viewKeys = view === 'all' ? countRooms : [view];
    const people = everyone.filter(p => viewKeys.includes(p.roomKey));
    const tickedRooms = [...new Set(everyone.filter(p => ticks[p.id]).map(p => p.roomKey))];
    const scopeKeys = amend || view === 'all' ? countRooms : tickedRooms.length ? tickedRooms : [view];
    const scope = everyone.filter(p => scopeKeys.includes(p.roomKey));
    const viewSeen = people.filter(p => ticks[p.id]).length;
    const onSite = p => !p.notIn || !!ticks[p.id];
    const onList = people.filter(onSite);
    const total = onList.length;
    const footPool = amend ? everyone : roster.filter(c => viewKeys.includes(c.room)).map(rowOf);
    const footBooked = footPool.filter(p => p.status === 'expected' && viewKeys.includes(p.roomKey) && !ticks[p.id]);
    const footOut = footPool.filter(p => p.status === 'gone' && viewKeys.includes(p.roomKey) && !ticks[p.id]);
    const footAbsent = footPool.filter(p => (p.status === 'absent' || p.status === 'holiday') && viewKeys.includes(p.roomKey) && !ticks[p.id]);
    const recSeen = scope.filter(p => ticks[p.id]).length;
    const recTotal = scope.filter(onSite).length;
    const lostIn = scope.filter(p => !p.notIn && !ticks[p.id]);
    const allSeen = total > 0 && viewSeen === total;
    const want = q.trim().toLowerCase();
    const searching = !!want;
    const hit = p => !searching || p.name.toLowerCase().includes(want);
    const nHit = searching ? [...onList, ...footBooked, ...footOut, ...footAbsent].filter(hit).length : 0;
    const listGrouping = view === 'all' ? 'room' : grouping;
    const peopleSig = onList.map(p => p.id + (p.state || '') + p.status).join(',');
    const hcOpen = React.useMemo(() => rdHcSections(onList, listGrouping), [peopleSig, listGrouping]);
    const hcChoices = React.useMemo(() => {
      const keys = [...(listGrouping === 'room' ? ['room'] : []), ...RD_GROUP_MENU.map(g => g.key).filter(k => k !== 'attendance')];
      const ok = keys.map(k => rdHcTry(onList, k)).filter(Boolean);
      return hcOpen.key && !ok.some(o => o.key === hcOpen.key) ? [hcOpen, ...ok] : ok;
    }, [peopleSig, listGrouping]);
    const defaultKey = hcOpen.key || 'none';
    const gNow = gKey && (gKey === 'none' || hcChoices.some(o => o.key === gKey)) ? gKey : defaultKey;
    const hc = gNow === 'none' ? RD_HC_NONE : hcChoices.find(o => o.key === gNow) || RD_HC_NONE;
    const bigList = onList.length > RD_HC_COLLAPSE_AT;
    const closed = closedX || new Set([...(view === 'all' || bigList ? hc.groups.map(g => g.key) : []), 'f:booked', 'f:out', 'f:absent']);
    const anyOpen = hc.groups.some(g => !closed.has(g.key));
    const chooseGrouping = k => {
      if (k === gNow) return;
      setGKey(k);
      setClosedX(null);
    };
    const chooseView = k => {
      if (k === view) return;
      setView(k);
      setGKey(null);
      setClosedX(null);
    };
    const toggleSection = key => setClosedX(() => {
      const n = new Set(closed);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
    const actingRef = React.useRef(acting);
    actingRef.current = acting;
    const ticksRef = React.useRef(ticks);
    ticksRef.current = ticks;
    const everyoneRef = React.useRef(everyone);
    everyoneRef.current = everyone;
    const signInRef = React.useRef(onSignIn);
    signInRef.current = onSignIn;
    const stampNow = () => ({
      by: actingRef.current,
      at: RD_NOW
    });
    const toggle = React.useCallback(id => {
      const p = everyoneRef.current.find(x => x.id === id);
      const on = !!ticksRef.current[id];
      if (!on && p && p.status === 'expected' && signInRef.current) {
        signInRef.current(p, ok => {
          if (ok) {
            setTicks(t => ({
              ...t,
              [id]: stampNow()
            }));
            rdKeepFocus(sheetRef);
          }
        });
        return;
      }
      setSaveError(null);
      setTicks(t => {
        const n = {
          ...t
        };
        if (on) delete n[id];else n[id] = stampNow();
        return n;
      });
      rdKeepFocus(sheetRef);
    }, []);
    const first = n => String(n || '').split(' ')[0];
    const noteOf = p => {
      const t = ticks[p.id];
      return t && (amend || t.by !== acting) ? `${first(t.by)} ${t.at}` : null;
    };
    const dirty = amend && count.children.some(x => !!x.counted !== !!ticks[x.id]);
    const stampOf = p => {
      const t = ticks[p.id];
      if (t) return {
        counted: true,
        by: t.by,
        at: t.at
      };
      const was = initial && initial.get(p.id);
      if (was && !was.counted) return {
        counted: false,
        by: was.by,
        at: was.at
      };
      return {
        counted: false,
        by: acting,
        at: RD_NOW
      };
    };
    const record = () => [...scope.map(p => ({
      id: p.id,
      name: p.name,
      room: p.roomKey,
      signedIn: !p.notIn,
      ...stampOf(p)
    })), ...(amend ? count.children.filter(x => !byId.has(x.id)) : [])];
    const doRecord = () => {
      if (!amend) rdCountDraft.routine = null;
      const children = record();
      const res = onRecord({
        children,
        rooms: [...new Set(children.map(x => x.room))],
        seen: children.filter(x => x.counted).length,
        of: rdHcOf(children),
        base: initial,
        baseRev
      });
      if (res && res.error) setSaveError(res.error);
    };
    const hasProgress = amend ? dirty : Object.keys(ticks).length > 0;
    const requestClose = () => hasProgress ? setConfirm({
      kind: 'discard'
    }) : onClose();
    const canBack = amend && fromCounts && !!onBackToCounts;
    const requestBack = () => canBack ? hasProgress ? setConfirm({
      kind: 'discard',
      back: true
    }) : onBackToCounts() : requestClose();
    const discard = () => {
      if (!amend) rdCountDraft.routine = null;
      const next = confirm;
      setConfirm(null);
      if (next && next.kind === 'open') onOpenCount(next.h);else if (next && next.back) onBackToCounts();else onClose();
    };
    const openCount = h => {
      if (!amend && hasProgress) setConfirm({
        kind: 'open',
        h
      });else onOpenCount(h);
    };
    useEffect(() => {
      const esc = e => {
        if (e.key !== 'Escape' || covered || viewOpen) return;
        if (confirm) {
          setConfirm(null);
          return;
        }
        if (searching && document.activeElement && document.activeElement.tagName === 'INPUT') {
          setQ('');
          return;
        }
        if (showCounts) {
          setShowCounts(false);
          return;
        }
        requestClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose, covered, viewOpen, confirm, stage, hasProgress, searching, showCounts]);
    useEffect(() => {
      if (confirm && askRef.current) askRef.current.focus();
    }, [confirm]);
    const row = (p, showTag = true, roomChip = true, gone = false) => React.createElement(RdHcRow, {
      key: p.id,
      p: p,
      on: !!ticks[p.id],
      gone: gone && !ticks[p.id],
      showRoom: view === 'all' && roomChip,
      showTag: showTag,
      note: noteOf(p),
      contact: !ticks[p.id] && !!onContacts && !p.notIn,
      onHold: onContacts,
      onToggle: toggle
    });
    const head = (key, label, tally, done, tall) => {
      const open = searching || !closed.has(key);
      return React.createElement("button", {
        type: "button",
        disabled: searching,
        onClick: () => toggleSection(key),
        "aria-expanded": searching ? undefined : open,
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: searching ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          minHeight: tall ? 44 : 40,
          padding: '0 4px',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          background: 'var(--sd-colour-surface-default)'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: 'var(--sd-colour-text-primary)'
        }
      }, label), tally && React.createElement("span", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: done ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
        }
      }, tally), React.createElement("span", {
        style: {
          flex: 1
        }
      }), !searching && React.createElement("span", {
        style: {
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform .15s',
          display: 'inline-flex',
          color: 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-down",
        size: 15
      })));
    };
    const noneHere = view === 'all' ? 'Nobody is signed in yet — there’s nothing to count.' : `Nobody is signed in to ${roomName(view)} yet — there’s nothing to count.`;
    const rosterList = () => searching && !nHit ? [React.createElement("span", {
      key: "nomatch",
      role: "status",
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)',
        padding: '18px 0'
      }
    }, "No child matches \u201C", q.trim(), "\u201D.")] : !onList.length ? [React.createElement("span", {
      key: "none",
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)',
        padding: '18px 0'
      }
    }, noneHere)] : !hc.key ? onList.filter(hit).map(p => row(p)) : hc.groups.map(g => {
      const items = g.items.filter(hit);
      if (!items.length) return null;
      const n = g.items.reduce((k, p) => k + (ticks[p.id] ? 1 : 0), 0);
      return React.createElement("section", {
        key: g.key,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flexShrink: 0
        }
      }, head(g.key, g.label, `${n} of ${g.items.length} accounted`, g.items.length > 0 && n === g.items.length), (searching || !closed.has(g.key)) && items.map(p => row(p, hc.key !== RD_TAG_GROUPING, hc.key !== 'room')));
    });
    const footSection = (key, label, items, inert) => {
      const list = items.filter(hit);
      if (!list.length) return null;
      const open = searching || !closed.has(key);
      return React.createElement("section", {
        key: key,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flexShrink: 0
        }
      }, head(key, label, String(items.length), false, true), open && list.map(p => inert ? React.createElement(RdHcRow, {
        key: p.id,
        p: p,
        inert: true,
        showRoom: view === 'all',
        showTag: false
      }) : row(p, true, view === 'all')));
    };
    const hasPeople = people.length > 0;
    const searchShown = !phone || searchOpen || searching;
    const toggleSearch = () => {
      if (searchShown) {
        setQ('');
        setSearchOpen(false);
      } else setSearchOpen(true);
    };
    const toolBtn = on => ({
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      height: 40,
      flexShrink: 0,
      position: 'relative',
      borderRadius: 'var(--sd-radius-lg)',
      border: `1px solid ${on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--sd-colour-text-primary)'
    });
    const roomOptions = [{
      key: 'all',
      label: 'All rooms'
    }, ...(amend ? rooms.filter(r => countRooms.includes(r.key)) : rooms).map(r => ({
      key: r.key,
      label: r.name
    }))];
    const inRoom = (h, k) => k === 'all' || h.rooms.includes(k);
    const chipN = history.length;
    const lastH = history[0];
    const chipLabel = !lastH ? phone ? 'Counts · 0' : 'Today’s counts · none in this room' : phone ? `Counts · ${chipN}` : `Today’s counts · ${chipN}`;
    const dayChip = history.length > 0 && !amend && stage === 'count' && React.createElement("button", {
      type: "button",
      onClick: () => setShowCounts(true),
      "aria-label": `Today’s counts, ${chipN}${lastH ? `, last at ${RD_AMPM(lastH.at)}, ${lastH.seen} of ${lastH.of}` : ''}`,
      className: "fp-btn",
      style: {
        ...toolBtn(false),
        padding: '0 14px'
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement("span", {
      style: {
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, chipLabel), !phone && React.createElement("span", {
      style: {
        display: 'inline-flex',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    })));
    const showRoomDrop = roomOptions.length > 2;
    const subtitle = amend ? [countRooms.length > 1 ? 'All rooms' : roomName(countRooms[0]), rdHcView(count).people.map(first).join(' + '), RD_MINS(count.updatedAt || count.at) > RD_MINS(count.at) ? `edited ${RD_AMPM(count.updatedAt)}` : null].filter(Boolean).join(' · ') : scopeKeys.length === countRooms.length && countRooms.length > 1 ? `All rooms · ${rdJoin(scopeKeys.map(roomName))}` : rdJoin(scopeKeys.map(roomName));
    const title = amend ? `Edit ${count.by === acting ? 'your' : `${first(count.by)}’s`} ${RD_AMPM(count.at)} count` : 'Head count';
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: requestClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": amend ? 'Amend head count' : 'Head count',
      ref: sheetRef,
      tabIndex: -1,
      style: {
        outline: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: 560,
        maxHeight: '100%',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '16px 22px 12px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, (phone || canBack) && React.createElement(RdSheetBack, {
      onClick: requestBack
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, title), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, subtitle), phone && history.length > 0 && !amend && stage === 'count' && React.createElement("button", {
      type: "button",
      onClick: () => setShowCounts(true),
      "aria-label": `Today’s counts, ${chipN}`,
      className: "fp-btn",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        alignSelf: 'flex-start',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdHit, {
      n: 3
    }), "Today\u2019s counts \xB7 ", chipN, " \u203A")), React.createElement("span", {
      "aria-label": `${viewSeen} of ${total} accounted for`,
      title: `${viewSeen} of ${total} accounted for`,
      style: {
        fontSize: 17,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        color: allSeen ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
      }
    }, viewSeen, " of ", total, !phone && React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, " accounted for")), onOpenEducator && React.createElement(RdActingAs, {
      educator: educator,
      onOpen: onOpenEducator
    }), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: requestClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0,
        position: 'relative'
      }
    }, React.createElement(RdHit, {
      n: 12
    }), React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        padding: phone ? 0 : '12px 22px 8px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 10,
        rowGap: 8,
        flexShrink: 0
      }
    }, stage === 'count' && hasPeople && !phone && React.createElement("div", {
      style: {
        flex: '1 1 150px',
        minWidth: 0
      }
    }, React.createElement(RdSearch, {
      compact: true,
      value: q,
      onChange: setQ,
      placeholder: "Search children",
      count: searching ? `${nHit} shown` : ''
    })), !phone && dayChip), stage === 'count' && hasPeople && phone && searchShown && React.createElement("div", {
      style: {
        padding: '0 22px 8px',
        flexShrink: 0
      }
    }, React.createElement(RdSearch, {
      compact: true,
      autoFocus: true,
      value: q,
      onChange: setQ,
      placeholder: "Search children",
      count: searching ? `${nHit} shown` : ''
    })), stage === 'count' && !searching && (showRoomDrop || hcChoices.length > 0) && React.createElement("div", {
      style: {
        padding: phone ? '12px 22px 8px' : '0 22px 8px',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0
      }
    }, stage === 'count' && hasPeople && phone && React.createElement("button", {
      type: "button",
      onClick: toggleSearch,
      "aria-pressed": searchShown,
      "aria-label": "Search children",
      style: {
        ...toolBtn(searchShown),
        width: 40,
        flexShrink: 0
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "search",
      size: 17
    }))), React.createElement(RdSheetMenus.Provider, {
      value: !!phone
    }, showRoomDrop && React.createElement(RdDropdown, {
      label: "Room",
      value: view,
      options: roomOptions,
      onChange: chooseView,
      defaultKey: startView,
      plain: true
    }), !phone && hcChoices.length > 0 && React.createElement(RdDropdown, {
      label: "Group by",
      value: gNow,
      onChange: chooseGrouping,
      defaultKey: defaultKey,
      options: [...hcChoices.map(o => ({
        key: o.key,
        label: rdHcLabel(o)
      })), {
        key: 'none',
        label: 'None'
      }]
    })), phone && (hcChoices.length > 0 || !!hc.key && bigList) && React.createElement("button", {
      type: "button",
      onClick: () => setViewOpen(true),
      "aria-haspopup": "dialog",
      "aria-label": "Group and view",
      className: "fp-btn",
      style: {
        ...toolBtn(gNow !== defaultKey),
        width: 40,
        position: 'relative'
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement(SdIcon, {
      name: "filter-eq",
      size: 20
    })), !phone && !!hc.key && bigList && React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--minimal ds-btn--sm",
      style: {
        margin: '-6px -12px -6px auto'
      },
      onClick: () => setClosedX(anyOpen ? new Set(hc.groups.map(g => g.key)) : new Set())
    }, anyOpen ? 'Collapse all' : 'Expand all')), conn === 'offline' && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        fontWeight: 600,
        color: RD_SYNC_FG,
        padding: '0 22px 8px',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 14
    }), "Roster as of ", RD_AMPM('12:58')), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '0 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, rosterList(), footSection('f:booked', 'Booked, not arrived', footBooked, false)), showCounts && React.createElement(RdHcCountsSheet, {
      history: history,
      rooms: rooms,
      phone: phone,
      onBack: () => setShowCounts(false),
      onClose: requestClose,
      onOpen: h => {
        setShowCounts(false);
        openCount(h);
      }
    }), React.createElement("div", {
      style: {
        padding: phone ? '14px 22px calc(18px + env(safe-area-inset-bottom, 0px))' : '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, saveError && React.createElement("span", {
      role: "alert",
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        textAlign: 'center',
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, saveError), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      full: true,
      muted: !recTotal || amend && !dirty,
      onClick: !recTotal || amend && !dirty ? undefined : () => setConfirm({
        kind: 'record'
      })
    }, amend ? 'Save' : 'Record'), (amend || !phone) && React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        textAlign: 'center',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, amend ? React.createElement(React.Fragment, null, "Updates ", count.by === acting ? 'your' : `${first(count.by)}’s`, " ", RD_AMPM(count.at), " count, not a new one.") : React.createElement(React.Fragment, null, "Recorded with the time and who made it", history.length ? React.createElement(React.Fragment, null, ". Anyone can add to it later from ", React.createElement("b", {
      style: {
        fontWeight: 700
      }
    }, "Today\u2019s counts")) : '', "."))))), viewOpen && React.createElement(RdCountViewSheet, {
      options: [...hcChoices.map(o => ({
        key: o.key,
        label: rdHcLabel(o)
      })), {
        key: 'none',
        label: 'None'
      }],
      value: gNow,
      defaultKey: defaultKey,
      onPick: chooseGrouping,
      fold: !!hc.key && bigList ? {
        open: anyOpen,
        onFold: () => setClosedX(anyOpen ? new Set(hc.groups.map(g => g.key)) : new Set())
      } : null,
      shown: total,
      onClose: () => setViewOpen(false)
    }), confirm && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": amend ? 'Keep editing' : 'Continue counting',
      onClick: () => setConfirm(null),
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      ref: askRef,
      tabIndex: -1,
      className: "rd-sheet",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": "rd-hc-discard-t",
      "aria-describedby": "rd-hc-discard-d",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        outline: 'none',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("span", {
      id: "rd-hc-discard-t",
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, confirm.kind === 'record' ? amend ? 'Save this count?' : 'Record this count?' : amend ? 'Discard changes?' : 'Discard head count?'), React.createElement("span", {
      id: "rd-hc-discard-d",
      style: {
        fontSize: 14,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, confirm.kind === 'record' ? React.createElement(React.Fragment, null, React.createElement("b", {
      style: {
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, recSeen, " of ", recTotal), " accounted for", recTotal - recSeen > 0 ? React.createElement(React.Fragment, null, ", ", recTotal - recSeen, " not ticked. You can add to it later from Today\u2019s counts.") : '.') : amend ? React.createElement(React.Fragment, null, "Your changes to the ", RD_AMPM(count.at), " count won\u2019t be saved. The count stays as it was.") : React.createElement(React.Fragment, null, "You\u2019ve ticked ", Object.keys(ticks).length === 1 ? '1 child' : `${Object.keys(ticks).length} children`, ". If you discard, this count isn\u2019t recorded."))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, confirm.kind === 'record' ? React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      full: true,
      onClick: () => {
        setConfirm(null);
        doRecord();
      }
    }, amend ? 'Save' : 'Record'), React.createElement(RdAction, {
      full: true,
      onClick: () => setConfirm(null)
    }, amend ? 'Keep editing' : 'Keep counting')) : React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      full: true,
      onClick: () => setConfirm(null)
    }, amend ? 'Keep editing' : 'Keep counting'), React.createElement(RdAction, {
      full: true,
      onClick: discard
    }, "Discard"))))));
  }
  const RD_COUNT_KINDS = [{
    key: 'evacuation',
    group: 'Emergency',
    label: 'Evacuation',
    hint: 'Everyone on the roll',
    type: 'evacuation',
    drill: false
  }, {
    key: 'lockdown',
    group: 'Emergency',
    label: 'Lockdown',
    hint: 'Everyone on the roll',
    type: 'lockdown',
    drill: false
  }, {
    key: 'evacuation-drill',
    group: 'Drill',
    label: 'Evacuation drill',
    hint: 'Everyone on the roll · kept as a drill',
    type: 'evacuation',
    drill: true
  }, {
    key: 'lockdown-drill',
    group: 'Drill',
    label: 'Lockdown drill',
    hint: 'Everyone on the roll · kept as a drill',
    type: 'lockdown',
    drill: true
  }];
  const rdKindKey = run => `${run.type}${run.drill ? '-drill' : ''}`;
  const rdKindTitle = run => (RD_COUNT_KINDS.find(k => k.key === rdKindKey(run)) || RD_COUNT_KINDS[0]).label;
  const RD_EM_STATE_WORD = {
    expected: 'Not signed in',
    gone: 'Signed out',
    absent: 'Absent',
    holiday: 'On holiday'
  };
  const rdTel = n => {
    const d = String(n || '').replace(/[^\d+]/g, '');
    return d.length >= 3 ? `tel:${d}` : null;
  };
  const rdMail = e => {
    const m = String(e || '').trim();
    return /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/.test(m) ? `mailto:${m.split('@').map(encodeURIComponent).join('@')}` : null;
  };
  const rdAsciiName = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.');
  const RD_STAFF = (() => {
    const src = window.PgSignin && window.PgSignin.EDUCATORS || RD_EDUCATORS.map(e => ({
      name: e.name,
      img: e.img,
      login: 0
    }));
    return src.map((e, i) => {
      const sur = rdLastName(e.name);
      const num = k => `03 5550 ${String(1000 + (i * 531 + k * 177) % 9000)}`;
      return {
        id: `s:${e.name}`,
        rkey: `s:${e.name}`,
        kind: 'staff',
        name: e.name,
        roomKey: null,
        room: null,
        rostered: e.login < 120,
        img: typeof e.img === 'number' ? `img/p${e.img}.jpg` : e.img,
        phone: num(1),
        email: `${rdAsciiName(e.name)}@littlebugs.example`,
        emergency: {
          name: `${RD_DADS[i % RD_DADS.length]} ${sur}`,
          rel: 'Emergency contact',
          phone: num(2),
          email: null
        }
      };
    });
  })();
  const RD_VISITORS = [{
    id: 'v1',
    rkey: 'v:v1',
    kind: 'visitor',
    name: 'Jordan Pike',
    sub: 'Maintenance contractor',
    roomKey: null,
    room: null,
    phone: '03 5550 0120',
    email: null
  }, {
    id: 'v2',
    rkey: 'v:v2',
    kind: 'visitor',
    name: 'Dana Whitfield',
    sub: 'Parent helper',
    roomKey: null,
    room: null,
    phone: '03 5550 0187',
    email: 'dana.whitfield@example.com'
  }];
  function rdCountContacts(c) {
    const p = rdProfile(c);
    const seed = rdSeed(c.id);
    const sur = rdLastName(c.name);
    const fic = n => `03 5550 ${String(1000 + Number(String(n || '').replace(/\D/g, '')) % 9000)}`;
    const mail = x => ({
      ...x,
      phone: fic(x.phone),
      email: `${rdAsciiName(x.name)}@example.com`
    });
    const phone = i => `03 5550 ${String(1000 + (seed * 7 + i * 411) % 9000)}`;
    const hubName = `${RD_MUMS[(seed + 3) % RD_MUMS.length]} ${sur}`;
    return {
      guardians: p.guardians.map(mail),
      emergency: mail(p.emergency),
      hub: [{
        name: hubName,
        rel: 'Authorised through the hub',
        phone: phone(7),
        email: `${rdAsciiName(hubName)}@example.com`,
        auths: p.guardians[0].auths.map(a => ({
          ...a,
          on: a.key === 'pickup'
        }))
      }]
    };
  }
  const rdEmStore = {
    run: null,
    events: []
  };
  function rdEmStart(kind, scope) {
    const k = RD_COUNT_KINDS.find(x => x.key === kind);
    rdEmStore.run = {
      id: `em-${Date.now()}`,
      type: k.type,
      drill: k.drill,
      startedAt: Date.now(),
      startClock: RD_NOW,
      scope,
      marks: {},
      added: [],
      notes: {},
      pinFor: null,
      changedActor: false,
      endedAt: null,
      endClock: null
    };
    return rdEmStore.run;
  }
  function rdEmCounts(run, roster, staff, visitors) {
    const scopeKeys = run.scope === 'all' ? rdCountRooms(run.scope).map(r => r.key) : [run.scope];
    const people = [...roster.filter(c => scopeKeys.includes(c.room) && (c.status === 'here' || rdEmAccounted(run, `c:${c.id}`))).map(c => `c:${c.id}`), ...staff.filter(s => s.rostered || rdEmAccounted(run, s.rkey)).map(s => s.rkey), ...visitors.map(v => v.rkey), ...run.added.map(a => `o:${a.id}`)];
    return {
      total: people.length,
      done: people.filter(k => rdEmAccounted(run, k)).length
    };
  }
  const rdEmElapsed = run => Math.max(0, Math.round(((run.endedAt || Date.now()) - run.startedAt) / 1000));
  const rdMMSS = sec => (sec >= 3600 ? `${Math.floor(sec / 3600)}:${String(Math.floor(sec % 3600 / 60)).padStart(2, '0')}` : String(Math.floor(sec / 60)).padStart(2, '0')) + ':' + String(sec % 60).padStart(2, '0');
  const rdEmAccounted = (run, key) => {
    const l = run.marks[key];
    return !!(l && l.length && l[l.length - 1].accounted);
  };
  function RdElapsed({
    since,
    until,
    style
  }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
      if (until) return undefined;
      const t = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(t);
    }, [until]);
    return React.createElement("span", {
      style: {
        fontVariantNumeric: 'tabular-nums',
        ...style
      }
    }, rdMMSS(Math.max(0, Math.round(((until || now) - since) / 1000))));
  }
  function RdCountPicker({
    phone,
    onPick,
    onRoutine,
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const full = rdPhoneFull(phone);
    const row = (k, icon, tone, onClick) => React.createElement("button", {
      key: k.key,
      type: "button",
      onClick: onClick,
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tone.bg,
        color: tone.fg
      }
    }, React.createElement(SdIcon, {
      name: icon,
      size: 19
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, k.label), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, k.hint)), React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    })));
    const red = {
      bg: 'var(--sd-colour-surface-red)',
      fg: 'var(--sd-colour-feedback-error-default)'
    };
    const calm = {
      bg: 'var(--sd-colour-surface-cyan)',
      fg: 'var(--sd-colour-action-primary)'
    };
    const group = name => RD_COUNT_KINDS.filter(k => k.group === name);
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Start a count",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Start a count"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "One tap starts it")), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '12px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Emergency"), group('Emergency').map(k => row(k, 'warning', red, () => onPick(k.key))), React.createElement("div", {
      style: {
        height: 8
      }
    }), React.createElement(RdLabel, null, "Drill"), group('Drill').map(k => row(k, 'warning', calm, () => onPick(k.key))), onRoutine && React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        height: 8
      }
    }), React.createElement(RdLabel, null, "Head count"), row({
      key: 'routine',
      label: 'Head count',
      hint: 'Children only'
    }, 'user-multiple', {
      bg: 'var(--sd-colour-surface-grey)',
      fg: 'var(--sd-colour-text-secondary)'
    }, onRoutine)))));
  }
  function RdCountContacts({
    person,
    conn,
    phone,
    emergency,
    note,
    onNote,
    onSign,
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const full = rdPhoneFull(phone);
    const sub = 'var(--sd-colour-text-secondary)';
    const isKid = person.kind === 'child' || !person.kind && person.status;
    const set = isKid ? rdCountContacts(person) : null;
    const link = (href, glyph, text) => href ? React.createElement("a", {
      href: href,
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minWidth: 0,
        overflowWrap: 'anywhere',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-action-primary)',
        textDecoration: 'none'
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: -6,
        right: -6,
        top: -14,
        bottom: -14
      }
    }), React.createElement(SdIcon, {
      name: glyph,
      size: 15
    }), text) : React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minWidth: 0,
        overflowWrap: 'anywhere',
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: glyph,
      size: 15
    }), text);
    const card = (c, key) => {
      const may = (c.auths || []).find(a => a.key === 'pickup');
      return React.createElement("div", {
        key: key,
        style: {
          display: 'flex',
          gap: 11,
          padding: '11px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)'
        }
      }, React.createElement(RdAvatar, {
        name: c.name,
        size: 36
      }), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '2px 8px'
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700
        }
      }, c.name), c.rel && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 500,
          color: sub
        }
      }, c.rel)), React.createElement("span", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px 18px'
        }
      }, c.phone && link(rdTel(c.phone), 'phone', c.phone), c.email && link(rdMail(c.email), 'mail', c.email)), may && (may.on ? React.createElement("span", null, React.createElement("span", {
        className: "ds-pill ds-pill--xs ds-pill--green ds-pill--minimal"
      }, "May collect")) : React.createElement("span", null, React.createElement("span", {
        className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal"
      }, c.noCollect ? 'Not permitted to collect' : 'May not collect')))));
    };
    const section = (title, kids) => React.createElement("div", {
      key: title,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, title), kids);
    const status = person.status === 'here' ? 'Signed in' : person.status === 'expected' ? 'Not signed in' : null;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Back to the count",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Contacts for ${person.name}`,
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '16px 22px 12px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), isKid ? React.createElement(RdKid, {
      c: person,
      size: 40
    }) : React.createElement(RdAvatar, {
      src: person.img,
      name: person.name,
      size: 40
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, person.name), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, isKid ? [person.room, status].filter(Boolean).join(' · ') : person.kind === 'staff' ? person.rostered ? 'Rostered today' : 'Not rostered today' : person.kind === 'visitor' ? `Visitor${person.sub ? ` · ${person.sub}` : ''}` : 'Added on the spot')), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Back to the count",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: sub,
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '14px 22px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, isKid && React.createElement(React.Fragment, null, section('Parents & guardians', set.guardians.map((c, i) => card(c, `g${i}`))), section('Emergency contact', [card(set.emergency, 'e')]), section('Hub contacts', conn === 'offline' ? [React.createElement(RdBlockedNote, {
      key: "hub",
      label: "Hub contacts"
    })] : set.hub.map((c, i) => card(c, `h${i}`)))), person.kind === 'staff' && React.createElement(React.Fragment, null, section('Contact', [card({
      name: person.name,
      rel: person.role || 'Educator',
      phone: person.phone,
      email: person.email
    }, 'self')]), person.emergency && section('Emergency contact', [card(person.emergency, 'ec')])), (person.kind === 'visitor' || person.kind === 'other') && section('Contact', [person.phone || person.email ? card({
      name: person.name,
      rel: person.sub || '',
      phone: person.phone,
      email: person.email
    }, 'v') : React.createElement("span", {
      key: "none",
      style: {
        fontSize: 13,
        color: sub
      }
    }, "No contact details are held for ", person.name, ".")]), emergency && onNote && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Note"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: note || '',
      maxLength: 160,
      onChange: e => onNote(e.target.value),
      "aria-label": `Note for ${person.name}`,
      placeholder: "Anything worth passing on",
      style: {
        height: 44,
        padding: '0 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 14,
        fontFamily: 'inherit',
        background: 'var(--sd-colour-surface-default)',
        color: 'var(--sd-colour-text-primary)'
      }
    }))), React.createElement("div", {
      style: {
        padding: phone ? '14px 22px calc(18px + env(safe-area-inset-bottom, 0px))' : '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, emergency && isKid && onSign && (person.status === 'here' || person.status === 'expected') && React.createElement(RdAction, {
      full: true,
      glyph: person.status === 'here' ? 'signout' : 'user-add',
      onClick: () => onSign(person, person.status === 'here' ? 'out' : 'in')
    }, person.status === 'here' ? 'Sign out' : 'Sign in', " ", person.name.split(' ')[0]), React.createElement(RdAction, {
      primary: true,
      full: true,
      onClick: onClose
    }, "Back to the count"))));
  }
  function RdAddSomeoneSheet({
    person,
    phone,
    onSave,
    onRemove,
    onClose
  }) {
    const [name, setName] = useState(person ? person.name : '');
    const [num, setNum] = useState(person ? person.phone || '' : '');
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const full = rdPhoneFull(phone);
    const ready = name.trim().length > 0;
    const field = {
      height: 44,
      padding: '0 12px',
      borderRadius: 'var(--sd-radius-lg)',
      border: '1px solid var(--sd-colour-border-default)',
      fontSize: 14,
      fontFamily: 'inherit',
      background: 'var(--sd-colour-surface-default)',
      color: 'var(--sd-colour-text-primary)'
    };
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Add someone",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '18px 22px 14px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, person ? 'Edit this person' : 'Add someone'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Someone who is on no list")), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Name"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      autoFocus: true,
      value: name,
      maxLength: 60,
      onChange: e => setName(e.target.value),
      "aria-label": "Name",
      placeholder: "Their name",
      style: field
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Phone, if you have it"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      inputMode: "tel",
      value: num,
      maxLength: 24,
      onChange: e => setNum(e.target.value),
      "aria-label": "Phone",
      placeholder: "0400 000 000",
      style: field
    }))), React.createElement("div", {
      style: {
        padding: phone ? '14px 22px calc(18px + env(safe-area-inset-bottom, 0px))' : '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      full: true,
      muted: !ready,
      onClick: ready ? () => onSave({
        name: name.trim(),
        phone: num.trim()
      }) : undefined
    }, person ? 'Save' : 'Mark as safe'), person && React.createElement(RdAction, {
      full: true,
      onClick: onRemove
    }, "Remove ", person.name.split(' ')[0]))));
  }
  function rdKeepFocus(ref) {
    setTimeout(() => {
      const el = ref.current;
      if (el && !el.contains(document.activeElement)) el.focus({
        preventScroll: true
      });
    }, 0);
  }
  function RdCountHead({
    open,
    searching,
    onToggle,
    label,
    tally,
    done,
    tall
  }) {
    return React.createElement("button", {
      type: "button",
      disabled: searching,
      onClick: onToggle,
      "aria-expanded": searching ? undefined : open,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: searching ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        minHeight: tall ? 44 : 40,
        padding: '0 4px',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: 'var(--sd-colour-text-primary)'
      }
    }, label), tally && React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: done ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, tally), React.createElement("span", {
      style: {
        flex: 1
      }
    }), !searching && React.createElement("span", {
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-down",
      size: 15
    })));
  }
  function RdEmergencySheet({
    run,
    roster,
    rooms,
    staff,
    visitors,
    grouping,
    educator,
    conn,
    phone,
    covered,
    onContacts,
    onSign,
    onPin,
    onOpenEducator,
    onBack,
    onSubmit,
    onCancel
  }) {
    const full = rdPhoneFull(phone);
    const sub = 'var(--sd-colour-text-secondary)';
    const acting = educator.name;
    const [, bump] = useState(0);
    const refresh = () => bump(n => n + 1);
    const [stage, setStage] = useState('count');
    const [gKey, setGKey] = useState(null);
    const [closedX, setClosedX] = useState(null);
    const [q, setQ] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [askScope, setAskScope] = useState(null);
    const [adding, setAdding] = useState(null);
    const sheetRef = React.useRef(null);
    const roomKeys = rooms.map(r => r.key);
    const roomName = k => (rooms.find(r => r.key === k) || {}).name || k;
    const scopeKeys = run.scope === 'all' ? roomKeys : [run.scope];
    const on = key => rdEmAccounted(run, key);
    const rowCache = React.useRef(new Map());
    const kidRow = c => {
      const sig = [c.status, c.state, c.childTag && (c.childTag.id || c.childTag.name), c.name].join('|');
      const hit = rowCache.current.get(c.id);
      if (hit && hit.sig === sig) return hit.row;
      const row = {
        ...c,
        rkey: `c:${c.id}`,
        kind: 'child',
        roomKey: c.room,
        room: roomNameOf(c),
        notIn: c.status !== 'here',
        stateWord: RD_EM_STATE_WORD[c.status] || null
      };
      rowCache.current.set(c.id, {
        sig,
        row
      });
      return row;
    };
    const kidsInScope = roster.filter(c => scopeKeys.includes(c.room));
    const rollKids = kidsInScope.filter(c => c.status === 'here' || on(`c:${c.id}`)).map(kidRow);
    const shownKids = rollKids;
    const footKids = kidsInScope.filter(c => c.status !== 'here' && !on(`c:${c.id}`)).map(kidRow);
    const footBooked = footKids.filter(p => p.status === 'expected');
    const footOut = footKids.filter(p => p.status === 'gone');
    const footAbsent = footKids.filter(p => p.status === 'absent' || p.status === 'holiday');
    const rostered = staff.filter(s => s.rostered);
    const others = staff.filter(s => !s.rostered);
    const added = run.added.map(a => ({
      ...a,
      id: `o:${a.id}`,
      rkey: `o:${a.id}`,
      kind: 'other',
      roomKey: null,
      room: null
    }));
    const roll = [...rollKids, ...rostered, ...others.filter(s => on(s.rkey)), ...visitors, ...added];
    const total = roll.length;
    const done = roll.filter(p => on(p.rkey)).length;
    const lost = roll.filter(p => !on(p.rkey));
    const want = q.trim().toLowerCase();
    const searching = !!want;
    const hit = p => !searching || p.name.toLowerCase().includes(want);
    const nHit = searching ? [...shownKids, ...footKids, ...staff, ...visitors, ...added].filter(hit).length : 0;
    const listGrouping = run.scope === 'all' ? 'room' : grouping;
    const kidSig = shownKids.map(p => p.id + (p.state || '') + p.status).join(',');
    const hcOpen = React.useMemo(() => rdHcSections(shownKids, listGrouping), [kidSig, listGrouping]);
    const hcChoices = React.useMemo(() => {
      const keys = [...(listGrouping === 'room' ? ['room'] : []), ...RD_GROUP_MENU.map(g => g.key).filter(k => k !== 'attendance')];
      const ok = keys.map(k => rdHcTry(shownKids, k)).filter(Boolean);
      return hcOpen.key && !ok.some(o => o.key === hcOpen.key) ? [hcOpen, ...ok] : ok;
    }, [kidSig, listGrouping]);
    const defaultKey = hcOpen.key || 'none';
    const gNow = gKey && (gKey === 'none' || hcChoices.some(o => o.key === gKey)) ? gKey : defaultKey;
    const hc = gNow === 'none' ? RD_HC_NONE : hcChoices.find(o => o.key === gNow) || RD_HC_NONE;
    const bigList = shownKids.length > RD_HC_COLLAPSE_AT;
    const closedDefault = new Set([...(run.scope === 'all' || bigList ? hc.groups.map(g => g.key) : []), 'not-rostered', 'f:booked', 'f:out', 'f:absent']);
    const closed = closedX || closedDefault;
    const toggleSection = key => setClosedX(() => {
      const n = new Set(closed);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
    const anyOpen = hc.groups.some(g => !closed.has(g.key));
    const actingRef = React.useRef(acting);
    actingRef.current = acting;
    const toggle = React.useCallback(key => {
      const l = run.marks[key] || [];
      const now = !!(l.length && l[l.length - 1].accounted);
      run.marks[key] = [...l, {
        accounted: !now,
        at: RD_NOW,
        by: actingRef.current
      }];
      refresh();
      rdKeepFocus(sheetRef);
    }, [run]);
    const row = (p, showRoom = false, gone = false) => {
      const links = [];
      if (stage === 'find') links.push({
        label: 'Contacts',
        onClick: () => onContacts(p)
      });
      if (p.kind === 'other') links.push({
        label: 'Edit',
        onClick: () => setAdding(p)
      });
      return React.createElement(RdHcRow, {
        key: p.rkey,
        p: p,
        on: on(p.rkey),
        gone: gone && !on(p.rkey),
        showRoom: showRoom,
        showTag: p.kind === 'child',
        note: null,
        hint: p.kind === 'child' && p.status === 'expected' && on(p.rkey),
        onSignIn: p.kind === 'child' && p.status === 'expected' ? c => onSign(c, 'in') : undefined,
        links: links.length ? links : null,
        onHold: onContacts,
        onToggle: toggle
      });
    };
    const section = (key, label, items, tally, done2) => {
      const list = items.filter(hit);
      if (!list.length) return null;
      const open = searching || !closed.has(key);
      return React.createElement("section", {
        key: key,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flexShrink: 0
        }
      }, React.createElement(RdCountHead, {
        open: open,
        searching: searching,
        onToggle: () => toggleSection(key),
        label: label,
        tally: tally,
        done: done2,
        tall: key.indexOf('f:') === 0 || key === 'not-rostered'
      }), open && list.map(p => row(p, run.scope === 'all' && p.kind === 'child' && hc.key !== 'room')));
    };
    const tallyOf = items => {
      const n = items.filter(p => on(p.rkey)).length;
      return [`${n} of ${items.length} accounted`, n === items.length && items.length > 0];
    };
    const kidSections = !shownKids.length ? [] : !hc.key ? [section('children', 'Children', shownKids, ...tallyOf(shownKids))] : hc.groups.map(g => section(g.key, g.label, g.items, ...tallyOf(g.items)));
    const list = [...kidSections, section('staff', 'Staff · rostered today', rostered, ...tallyOf(rostered)), ...(visitors.length ? [section('visitors', 'Visitors', visitors, ...tallyOf(visitors))] : []), ...(added.length ? [section('added', 'Added', added, ...tallyOf(added))] : []), ...(others.length ? [section('not-rostered', 'Not rostered today', others, `${others.filter(p => on(p.rkey)).length} of ${others.length}`, false)] : []), section('f:booked', 'Booked, not arrived', footBooked, String(footBooked.length), false), section('f:out', 'Signed out', footOut, String(footOut.length), false), section('f:absent', 'Absent', footAbsent, String(footAbsent.length), false)];
    const scopeOptions = [{
      key: 'all',
      label: 'All rooms'
    }, ...rooms.map(r => ({
      key: r.key,
      label: r.name
    }))];
    const requestScope = k => {
      if (k === run.scope) return;
      const next = k === 'all' ? roomKeys : [k];
      const drops = roster.filter(c => on(`c:${c.id}`) && !next.includes(c.room)).length;
      if (drops) setAskScope({
        to: k,
        drops
      });else {
        run.scope = k;
        setGKey(null);
        setClosedX(null);
        refresh();
      }
    };
    const chooseGrouping = k => {
      if (k === gNow) return;
      setGKey(k);
      setClosedX(null);
    };
    const end = () => {
      run.endedAt = Date.now();
      run.endClock = RD_HHMM(RD_MINS(RD_NOW) + Math.floor(rdEmElapsed(run) / 60));
      setStage('review');
      refresh();
    };
    const resume = () => {
      run.endedAt = null;
      run.endClock = null;
      setStage('count');
      refresh();
    };
    const elapsed = rdEmElapsed(run);
    const groupsFor = [['Children', roll.filter(p => p.kind === 'child')], ['Staff', roll.filter(p => p.kind === 'staff')], ['Visitors', roll.filter(p => p.kind === 'visitor')], ['Added', roll.filter(p => p.kind === 'other')]].filter(([, l]) => l.length);
    const doSubmit = () => {
      const ev = {
        id: run.id,
        type: run.type,
        drill: run.drill,
        educatorName: acting,
        startTime: run.startClock,
        endTime: run.endClock,
        items: roll.map(p => ({
          kind: p.kind,
          ref: p.kind === 'child' ? p.id : p.rkey,
          name: p.name,
          phone: p.phone || null,
          marks: run.marks[p.rkey] || [],
          accounted: on(p.rkey),
          note: run.notes[p.rkey] || null
        }))
      };
      onSubmit(ev);
    };
    const submit = () => {
      if (run.changedActor && run.pinFor !== acting) onPin(doSubmit);else doSubmit();
    };
    const requestBack = () => onBack();
    useEffect(() => {
      const esc = e => {
        if (e.key !== 'Escape' || covered || viewOpen || adding || askScope) return;
        if (searching && document.activeElement && document.activeElement.tagName === 'INPUT') {
          setQ('');
          return;
        }
        if (stage === 'find') {
          setStage('count');
          return;
        }
        if (stage === 'review') {
          resume();
          return;
        }
        requestBack();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [covered, viewOpen, adding, askScope, stage, searching]);
    const toolBtn = onx => ({
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      height: 40,
      flexShrink: 0,
      position: 'relative',
      borderRadius: 'var(--sd-radius-lg)',
      border: `1px solid ${onx ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--sd-colour-text-primary)'
    });
    const searchShown = !phone || searchOpen || searching;
    const toggleSearch = () => {
      if (searchShown) {
        setQ('');
        setSearchOpen(false);
      } else setSearchOpen(true);
    };
    const kindWord = `${run.type === 'lockdown' ? 'Lockdown' : 'Evacuation'}${run.drill ? ' drill' : ''}`;
    const tone = run.drill ? {
      bg: 'var(--sd-colour-surface-cyan)',
      fg: 'var(--sd-colour-text-on-cyan)'
    } : {
      bg: 'var(--sd-colour-surface-red)',
      fg: 'var(--sd-colour-text-on-red)'
    };
    const groupOptions = [...hcChoices.map(o => ({
      key: o.key,
      label: rdHcLabel(o)
    })), {
      key: 'none',
      label: 'None'
    }];
    const subtitle = `Everyone, ${run.scope === 'all' ? 'all rooms' : roomName(run.scope)}`;
    const canCancel = !Object.keys(run.marks).length && !run.added.length;
    const names = l => l.map(p => p.name.split(' ')[0]).join(', ');
    const link = (text, onClick) => React.createElement("button", {
      type: "button",
      onClick: onClick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        fontSize: 13,
        fontWeight: 700,
        color: 'inherit',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        whiteSpace: 'nowrap'
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: -8,
        right: -8,
        top: -14,
        bottom: -14
      }
    }), text);
    const banner = React.createElement("div", {
      style: {
        padding: '8px 22px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2px 10px',
        flexShrink: 0,
        background: tone.bg,
        color: tone.fg
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.07em',
        textTransform: 'uppercase'
      }
    }, run.drill ? 'Drill' : 'Emergency'), React.createElement(RdElapsed, {
      since: run.startedAt,
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }), React.createElement("span", {
      style: {
        flex: 1
      }
    }), stage === 'count' && lost.length > 0 && link(`${lost.length} not accounted for`, () => setStage('find')));
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 41,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        ...full.gutter
      }
    }, !phone && React.createElement("button", {
      type: "button",
      "aria-label": stage === 'review' ? 'Keep counting' : 'Back to the room',
      onClick: stage === 'review' ? resume : requestBack,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": kindWord,
      ref: sheetRef,
      tabIndex: -1,
      style: {
        outline: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: 560,
        maxHeight: '100%',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column',
        ...full.card
      }
    }, React.createElement("div", {
      style: {
        padding: '16px 22px 12px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, phone && React.createElement(RdSheetBack, {
      onClick: stage === 'review' ? resume : stage === 'find' ? () => setStage('count') : requestBack
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, kindWord), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, subtitle)), onOpenEducator && React.createElement(RdActingAs, {
      educator: educator,
      onOpen: onOpenEducator
    }), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Back to the room",
      onClick: stage === 'review' ? resume : requestBack,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: sub,
        flexShrink: 0,
        position: 'relative'
      }
    }, React.createElement(RdHit, {
      n: 12
    }), React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), stage === 'review' ? React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '14px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: sub
      }
    }, React.createElement("span", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, "Started ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(run.startClock))), " \xB7 ", React.createElement("span", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, "Ended ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, RD_AMPM(run.endClock))), " \xB7 ", React.createElement("span", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, "Total ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, rdMMSS(elapsed)))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Accounted for"), groupsFor.map(([k, l]) => {
      const n = l.filter(p => on(p.rkey)).length;
      return React.createElement("span", {
        key: k,
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          fontSize: 14,
          fontWeight: 600
        }
      }, React.createElement("span", {
        style: {
          flex: 1
        }
      }, k), React.createElement("span", {
        style: {
          color: n === l.length ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-feedback-error-default)',
          fontWeight: 700
        }
      }, n, " of ", l.length));
    }), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        fontSize: 14,
        fontWeight: 700,
        borderTop: '1px solid var(--sd-colour-border-default)',
        paddingTop: 6
      }
    }, React.createElement("span", {
      style: {
        flex: 1
      }
    }, "Everyone"), React.createElement("span", null, done, " of ", total))), !!lost.length && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Not accounted for \xB7 ", lost.length), lost.map(p => React.createElement("button", {
      key: p.rkey,
      type: "button",
      onClick: () => onContacts(p),
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '9px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-feedback-error-default)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }, p.name), run.notes[p.rkey] && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-red)'
      }
    }, run.notes[p.rkey]))), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: sub
      }
    }, "Follow your service\u2019s procedure.")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Recorded as"), React.createElement(RdSheetMenus.Provider, {
      value: !!phone
    }, React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, React.createElement(RdDropdown, {
      label: "",
      value: rdKindKey(run),
      plain: true,
      options: RD_COUNT_KINDS.map(k => ({
        key: k.key,
        label: k.label
      })),
      onChange: k => {
        const kk = RD_COUNT_KINDS.find(x => x.key === k);
        run.type = kk.type;
        run.drill = kk.drill;
        refresh();
      }
    })))), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: sub
      }
    }, "Recording as ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, acting), onOpenEducator && React.createElement(React.Fragment, null, " \xB7 ", React.createElement("button", {
      type: "button",
      onClick: onOpenEducator,
      style: {
        all: 'unset',
        cursor: 'pointer',
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)'
      }
    }, "Change")))) : stage === 'find' ? React.createElement(React.Fragment, null, banner, React.createElement("div", {
      style: {
        padding: '12px 22px 4px',
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1
      }
    }, done), React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: sub,
        whiteSpace: 'nowrap'
      }
    }, "of ", total, " accounted for")), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '6px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: sub
      }
    }, "Follow your service\u2019s procedure. Ticking still works: a person you find leaves this list. Press and hold a row for their contacts."), !!lost.length && React.createElement(RdLabel, null, "Not accounted for \xB7 ", lost.length), lost.length ? lost.map(p => row(p, run.scope === 'all' && p.kind === 'child', true)) : React.createElement("span", {
      style: {
        fontSize: 13,
        color: sub,
        padding: '18px 0'
      }
    }, "Everyone is accounted for."))) : React.createElement(React.Fragment, null, banner, React.createElement("div", {
      style: {
        padding: '12px 22px 8px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 10,
        rowGap: 8,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 10,
        flex: phone ? '1 1 auto' : '0 0 auto'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1,
        color: lost.length === 0 && total > 0 ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
      }
    }, done), React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: sub,
        whiteSpace: 'nowrap'
      }
    }, "of ", total, " accounted for")), !phone && React.createElement("div", {
      style: {
        flex: '1 1 150px',
        minWidth: 0
      }
    }, React.createElement(RdSearch, {
      compact: true,
      value: q,
      onChange: setQ,
      placeholder: "Search people",
      count: searching ? `${nHit} shown` : ''
    })), phone && React.createElement("button", {
      type: "button",
      onClick: toggleSearch,
      "aria-pressed": searchShown,
      "aria-label": "Search people",
      style: {
        ...toolBtn(searchShown),
        width: 40
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement("span", {
      style: {
        color: sub,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "search",
      size: 17
    }))), React.createElement("button", {
      type: "button",
      onClick: () => setAdding('new'),
      "aria-label": "Add someone",
      className: "fp-btn",
      style: {
        ...toolBtn(false),
        ...(phone ? {
          width: 40
        } : {
          padding: '0 12px'
        })
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement("span", {
      style: {
        color: sub,
        display: 'inline-flex'
      }
    }, React.createElement(SdIcon, {
      name: "user-add",
      size: 18
    })), !phone && 'Add someone')), phone && searchShown && React.createElement("div", {
      style: {
        padding: '0 22px 8px',
        flexShrink: 0
      }
    }, React.createElement(RdSearch, {
      compact: true,
      autoFocus: true,
      value: q,
      onChange: setQ,
      placeholder: "Search people",
      count: searching ? `${nHit} shown` : ''
    })), !searching && React.createElement("div", {
      style: {
        padding: '0 22px 8px',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement(RdSheetMenus.Provider, {
      value: !!phone
    }, React.createElement(RdDropdown, {
      label: "Room",
      value: run.scope,
      options: scopeOptions,
      onChange: requestScope,
      plain: true
    }), !phone && hcChoices.length > 0 && React.createElement(RdDropdown, {
      label: "Group by",
      value: gNow,
      onChange: chooseGrouping,
      defaultKey: defaultKey,
      options: groupOptions
    })), phone && React.createElement("button", {
      type: "button",
      onClick: () => setViewOpen(true),
      "aria-haspopup": "dialog",
      "aria-label": "Group and view",
      className: "fp-btn",
      style: {
        ...toolBtn(gNow !== defaultKey),
        width: 40
      }
    }, React.createElement(RdHit, {
      n: 3
    }), React.createElement(SdIcon, {
      name: "filter-eq",
      size: 20
    }))), conn === 'offline' && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        fontWeight: 600,
        color: RD_SYNC_FG,
        padding: '0 22px 8px',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 14
    }), "Roster as of ", RD_AMPM('12:58')), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '0 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, searching && !nHit ? React.createElement("span", {
      role: "status",
      style: {
        fontSize: 13,
        color: sub,
        padding: '18px 0'
      }
    }, "No one matches \u201C", q.trim(), "\u201D.") : list)), React.createElement("div", {
      style: {
        padding: phone ? '14px 22px calc(18px + env(safe-area-inset-bottom, 0px))' : '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, stage === 'count' && React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      full: true,
      onClick: end
    }, "Done"), canCancel && (phone ? React.createElement("button", {
      type: "button",
      onClick: onCancel,
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        alignSelf: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: sub,
        textDecoration: 'underline',
        textUnderlineOffset: 2
      }
    }, React.createElement(RdHit, {
      n: 12
    }), "Cancel, started by mistake") : React.createElement(RdAction, {
      full: true,
      onClick: onCancel
    }, "Cancel, started by mistake"))), stage === 'find' && React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      full: true,
      onClick: end
    }, "Done"), React.createElement(RdAction, {
      full: true,
      onClick: () => setStage('count')
    }, "Keep counting")), stage === 'review' && React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      glyph: "tick",
      full: true,
      onClick: submit
    }, "Record"), React.createElement(RdAction, {
      full: true,
      onClick: resume
    }, "Keep counting")), (stage === 'review' || !phone) && React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        textAlign: 'center',
        color: sub
      }
    }, stage === 'review' ? 'Nothing is filed until you record it. It is kept with the times of each tap and who counted.' : 'Back to the room keeps it running. The record is made when you end it.'))), viewOpen && React.createElement(RdCountViewSheet, {
      options: groupOptions,
      value: gNow,
      defaultKey: defaultKey,
      onPick: chooseGrouping,
      fold: !!hc.key && bigList ? {
        open: anyOpen,
        onFold: () => setClosedX(anyOpen ? new Set([...hc.groups.map(g => g.key), 'not-rostered']) : new Set())
      } : null,
      shown: total,
      onClose: () => setViewOpen(false)
    }), adding && React.createElement(RdAddSomeoneSheet, {
      person: adding === 'new' ? null : adding,
      phone: phone,
      onClose: () => setAdding(null),
      onSave: ({
        name,
        phone: num
      }) => {
        if (adding === 'new') {
          const id = `a${Date.now()}`;
          run.added = [...run.added, {
            id,
            name,
            phone: num
          }];
          run.marks[`o:${id}`] = [{
            accounted: true,
            at: RD_NOW,
            by: acting
          }];
        } else {
          run.added = run.added.map(a => `o:${a.id}` === adding.rkey ? {
            ...a,
            name,
            phone: num
          } : a);
        }
        setAdding(null);
        refresh();
      },
      onRemove: () => {
        const gone = adding;
        run.added = run.added.filter(a => `o:${a.id}` !== gone.rkey);
        delete run.marks[gone.rkey];
        setAdding(null);
        refresh();
      }
    }), askScope && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Keep the room",
      onClick: () => setAskScope(null),
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": "Change the room?",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Change the room?"), React.createElement("span", {
      style: {
        fontSize: 14,
        lineHeight: 1.45,
        fontWeight: 600,
        color: sub
      }
    }, askScope.drops === 1 ? '1 child you have ticked' : `${askScope.drops} children you have ticked`, " would no longer be on the record. The marks are kept: change back and they return.")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdAction, {
      primary: true,
      full: true,
      onClick: () => setAskScope(null)
    }, "Keep ", run.scope === 'all' ? 'all rooms' : roomName(run.scope)), React.createElement(RdAction, {
      full: true,
      onClick: () => {
        run.scope = askScope.to;
        setAskScope(null);
        setGKey(null);
        setClosedX(null);
        refresh();
      }
    }, "Change room")))));
  }
  function RdEmStrip({
    run,
    roll,
    onReturn
  }) {
    const drill = run.drill;
    const tone = drill ? {
      bg: 'var(--sd-colour-surface-cyan)',
      fg: 'var(--sd-colour-text-on-cyan)'
    } : {
      bg: 'var(--sd-colour-surface-red)',
      fg: 'var(--sd-colour-text-on-red)'
    };
    return React.createElement("button", {
      type: "button",
      onClick: onReturn,
      "aria-label": `Return to the ${rdKindTitle(run).toLowerCase()}`,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2px 10px',
        padding: '9px 16px',
        flexShrink: 0,
        background: tone.bg,
        color: tone.fg,
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.07em',
        textTransform: 'uppercase'
      }
    }, drill ? 'Drill' : 'Emergency'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, rdKindTitle(run)), React.createElement(RdElapsed, {
      since: run.startedAt,
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap'
      }
    }, roll.done, " of ", roll.total), React.createElement("span", {
      style: {
        flex: 1
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap'
      }
    }, "Return", React.createElement(SdIcon, {
      name: "chevron-right",
      size: 14
    })));
  }
  function RdCountViewSheet({
    options,
    value,
    defaultKey,
    onPick,
    fold,
    shown,
    onClose
  }) {
    const full = rdPhoneFull(true);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    return React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Group and view",
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        ...full.head
      }
    }, React.createElement(RdSheetBack, {
      onClick: onClose
    }), React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        flex: 1,
        minWidth: 0
      }
    }, "Group and view")), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '4px 11px 16px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        padding: '14px 11px 4px'
      }
    }, "Group by"), React.createElement(RdRadioRows, {
      options: options,
      value: value,
      defaultKey: defaultKey,
      onPick: onPick
    }), fold && React.createElement("div", {
      style: {
        padding: '10px 0 0'
      }
    }, React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--minimal ds-btn--sm",
      onClick: fold.onFold
    }, fold.open ? 'Collapse all' : 'Expand all'))), React.createElement(RdSheetFoot, {
      phone: true,
      edge: true
    }, React.createElement(RdAction, {
      primary: true,
      full: true,
      onClick: onClose
    }, `Show ${shown}`)));
  }
  const RD_DEST = {
    incidents: {
      label: 'Incident records',
      icon: 'document',
      feature: 'incidents',
      fill: true,
      body: p => React.createElement(RdIncidentRecords, {
        ctx: p.ctx
      })
    },
    learning: {
      label: 'Learning',
      icon: 'book-edit',
      feature: 'learning',
      body: null
    },
    web: {
      label: 'Playground web',
      icon: 'desktop',
      feature: 'playgroundWeb',
      full: true,
      body: p => React.createElement(RdWebPage, {
        onBack: p.onBack,
        backLabel: p.backLabel,
        ctx: p
      })
    },
    account: {
      label: 'Account',
      icon: 'user',
      feature: 'account',
      full: true,
      body: p => React.createElement(RdAccountPage, {
        onBack: p.onBack,
        backLabel: p.backLabel,
        ctx: p
      })
    }
  };
  const rdDestKey = k => typeof k === 'string' && Object.prototype.hasOwnProperty.call(RD_DEST, k) && svcOn(RD_DEST[k].feature) ? k : null;
  window.PgDashKit = {
    RD_DEST,
    RdAction,
    RdSheetFoot,
    RdSheetBack,
    rdPhoneFull,
    RdSearch,
    RdDropdown,
    RdSheetMenus,
    RdToggle,
    RdTextAction,
    RdLabel,
    RdKid,
    RdActingAs,
    RdBlockedNote,
    RD_AMPM,
    RD_NOW,
    RD_ROOMS,
    RD_ALL_CHILDREN,
    RD_OTHER,
    RD_EDUCATORS,
    RD_SYNC_FG,
    rdOffBlocked,
    rdAddDays,
    rdShortDate,
    RD_TODAY
  };
  const RD_MENU_SERVICE = [{
    key: 'headcount',
    act: 'headcount',
    label: 'Head count',
    icon: 'user-multiple',
    feature: 'headcount'
  }, {
    key: 'roomsettings',
    act: 'settings',
    label: 'Room settings',
    icon: 'settings-cog',
    hideUnwired: true
  }, {
    key: 'incidents',
    dest: 'incidents',
    label: 'Incident records',
    icon: 'document',
    feature: 'incidents'
  }, {
    key: 'learning',
    dest: 'learning',
    label: 'Learning',
    icon: 'book-edit',
    feature: 'learning'
  }, {
    key: 'web',
    dest: 'web',
    label: 'Playground web',
    icon: 'desktop',
    feature: 'playgroundWeb',
    needs: 'webUrl',
    tabletOnly: true,
    tail: 'chevron-right',
    needsNet: true
  }, {
    key: 'help',
    url: 'supportUrl',
    label: 'Help & support',
    icon: 'question-mark-help',
    none: 'No help link available'
  }];
  const RD_MENU_SWITCH = [{
    key: 'switchedu',
    act: 'switchEducator',
    label: 'Switch educator · keeps the service',
    icon: 'user-refresh'
  }];
  const RD_MENU_LOGOUT = [{
    key: 'signout',
    act: 'signOut',
    label: 'Log out of this service',
    icon: 'signout'
  }];
  function RdDestination({
    dest,
    backLabel,
    onBack,
    ctx,
    covered
  }) {
    const m = RD_DEST[dest];
    const own = !!(m.full && m.body);
    useEffect(() => {
      if (own) return undefined;
      const esc = e => {
        if (e.key === 'Escape' && !covered) onBack();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onBack, own, covered]);
    if (own) return m.body({
      onBack,
      backLabel,
      ...ctx
    });
    return React.createElement("div", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": m.label,
      className: "rd-sheet",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        background: 'var(--sd-colour-surface-default)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        minHeight: 56,
        padding: '6px 14px 6px 6px',
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement(RdSheetBack, {
      onClick: onBack
    }), React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700,
        flex: 1,
        minWidth: 0
      }
    }, m.label)), React.createElement("div", {
      style: m.fill && m.body ? {
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      } : {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, m.body ? m.body({
      onBack,
      backLabel,
      ctx
    }) : React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        maxWidth: 340,
        textAlign: 'center'
      }
    }, React.createElement("span", {
      style: {
        width: 54,
        height: 54,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, React.createElement(SdIcon, {
      name: m.icon,
      size: 24
    })), React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, m.label, " isn\u2019t in this prototype yet"), React.createElement("span", {
      style: {
        fontSize: 13.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "This is where it opens. Everything you were doing in the room is still there."), React.createElement(RdAction, {
      primary: true,
      onClick: onBack
    }, backLabel))));
  }
  const RD_ACCOUNT_ROLES = ['Room leader', 'Educator', 'Assistant educator'];
  const RD_FICTION_PHONES = ['0491 570 156', '0491 570 157', '0491 570 158'];
  const rdAccountDetails = e => {
    const first = String(e.name || '').split(' ')[0];
    const last = String(e.name || '').split(' ').slice(1).join('');
    const slug = t => t.normalize('NFD').replace(/[^A-Za-z]/g, '').toLowerCase();
    const h = Array.from(String(e.name)).reduce((a, ch) => a + ch.charCodeAt(0), 0);
    return {
      role: RD_ACCOUNT_ROLES[h % RD_ACCOUNT_ROLES.length],
      email: slug(first) && slug(last) ? `${slug(first)}.${slug(last)}@example.com` : null,
      phone: e.name === 'Hannah Murphy' ? null : RD_FICTION_PHONES[h % RD_FICTION_PHONES.length]
    };
  };
  function RdAccountPage({
    onBack,
    backLabel,
    ctx
  }) {
    const {
      educator,
      phone,
      conn,
      showToast
    } = ctx;
    const gate = window.PgSignin;
    const [setup, setSetup] = useState(null);
    const [verify, setVerify] = useState(false);
    const [, bump] = useState(0);
    const offline = conn === 'offline';
    const d = educator ? rdAccountDetails(educator) : null;
    const hasPin = !!(gate && educator && gate.pinOf(educator));
    useEffect(() => {
      if (setup || verify) return undefined;
      const esc = e => {
        if (e.key === 'Escape') onBack();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onBack, setup, verify]);
    const host = u => String(u).replace(/^https?:\/\//, '').split('/')[0];
    const row = (key, icon, label, sub, onClick, tail) => React.createElement("button", {
      key: key,
      type: "button",
      onClick: onClick,
      "aria-disabled": onClick ? undefined : 'true',
      className: onClick ? 'fp-row' : '',
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 52,
        padding: '9px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 14.5,
        fontWeight: 600,
        color: onClick ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: icon,
      size: 19
    })), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }
    }, React.createElement("span", null, label), sub && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, sub)), tail && React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: tail,
      size: 16
    })));
    const link = (key, icon, label, url, none) => row(key, icon, label, !url ? none : offline ? 'Needs a connection' : null, url && !offline ? () => showToast(`${label} opens in your browser · ${host(url)}`) : null, url && !offline ? 'link' : null);
    const detail = (label, value) => React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '6px 14px'
      }
    }, React.createElement("span", {
      style: {
        width: 64,
        flexShrink: 0,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, label), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 14.5,
        fontWeight: 600,
        wordBreak: 'break-word',
        color: value ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
      }
    }, value || 'Not held by your centre'));
    const pinSub = offline ? 'Needs a connection' : hasPin ? 'Four digits, to sign in faster' : 'For faster sign-in';
    const startPin = () => {
      if (hasPin) setVerify(true);else setSetup('new');
    };
    return React.createElement("div", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Account",
      className: "rd-sheet",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        background: 'var(--sd-colour-surface-default)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        minHeight: 56,
        padding: '6px 14px 6px 6px',
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement(RdSheetBack, {
      onClick: onBack
    }), React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700,
        flex: 1,
        minWidth: 0
      }
    }, "Account")), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: phone ? '18px 8px 24px' : '26px 24px 30px'
      }
    }, React.createElement("div", {
      style: {
        maxWidth: 520,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, educator && d && React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 14px'
      }
    }, React.createElement(RdAvatar, {
      src: educator.img,
      name: educator.name,
      size: 64
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, educator.name), React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, d.role, " \xB7 ", SERVICE.name))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, detail('Email', d.email), detail('Phone', d.phone), React.createElement("span", {
      style: {
        padding: '4px 14px 0',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Held by your centre. Ask the office to change them."))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, gate && educator && svcOn('pinLogin') && row('pin', 'lock', hasPin ? 'Change PIN' : 'Create PIN', pinSub, offline ? null : startPin, offline ? null : 'chevron-right'), link('help', 'question-mark-help', 'Help & support', SERVICE.supportUrl, 'No help link available'), link('feedback', 'chat', 'Give feedback', SERVICE.feedbackUrl, 'No feedback link available')), React.createElement("span", {
      style: {
        padding: '0 14px',
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Playground v", PG_VERSION))), verify && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 50
      }
    }, React.createElement(RdEducatorSheet, {
      educators: [educator],
      current: educator,
      serviceName: SERVICE.name,
      confirm: educator,
      reason: "enter your current PIN to change it",
      onClose: () => setVerify(false),
      onPick: () => {
        setVerify(false);
        setSetup('reset');
      }
    })), setup && React.createElement(gate.PinSetupOver, {
      educator: educator,
      mode: setup,
      big: !phone,
      onCancel: () => setSetup(null),
      onDone: () => {
        const was = setup;
        setSetup(null);
        bump(n => n + 1);
        showToast(was === 'reset' ? 'PIN changed' : 'PIN created');
      }
    }));
  }
  const rdWebFeedbackAsked = {
    v: false
  };
  function RdWebPage({
    onBack,
    ctx
  }) {
    const {
      educator,
      phone,
      conn
    } = ctx;
    const [asking, setAsking] = useState(false);
    const offline = conn === 'offline';
    const close = () => {
      if (SERVICE.feedbackUrl && !offline && !asking && !rdWebFeedbackAsked.v) {
        rdWebFeedbackAsked.v = true;
        setAsking(true);
      } else onBack();
    };
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          if (asking) onBack();else close();
        }
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    });
    return React.createElement("div", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Playground web",
      className: "rd-sheet",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        background: 'var(--sd-colour-surface-default)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
        minHeight: 56,
        padding: '6px 14px 6px 6px',
        borderBottom: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Close Playground web",
      onClick: close,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: 44,
        height: 44,
        borderRadius: 'var(--sd-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, "Playground web"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "Signed in as ", educator ? educator.name : 'you'))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: phone ? 20 : 28
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        maxWidth: 380,
        textAlign: 'center'
      }
    }, React.createElement("span", {
      style: {
        width: 54,
        height: 54,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, React.createElement(SdIcon, {
      name: "desktop",
      size: 26
    })), React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, "The centre\u2019s web page opens here"), React.createElement("span", {
      style: {
        fontSize: 13.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "It opens already signed in as ", educator ? educator.name.split(' ')[0] : 'you', ", with no sign-in of its own. This test version doesn\u2019t include the web page itself."))), asking && React.createElement("div", {
      role: "alertdialog",
      "aria-label": "Feedback",
      className: "rd-scrim",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: phone ? 0 : 28,
        background: 'rgba(0,40,34,0.45)'
      }
    }, React.createElement("div", {
      className: "rd-sheet",
      style: {
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '20px 20px calc(20px + env(safe-area-inset-bottom, 0px))',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: phone ? 'var(--sd-radius-lg) var(--sd-radius-lg) 0 0' : 'var(--sd-radius-lg)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 17,
        fontWeight: 700
      }
    }, "How was Playground web?"), React.createElement("span", {
      style: {
        fontSize: 13.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "A minute of feedback helps your centre and Xplor. You stay signed in either way."), React.createElement(RdAction, {
      primary: true,
      onClick: () => {
        ctx.showToast('Feedback opens in your browser');
        onBack();
      }
    }, "Give feedback"), React.createElement(RdAction, {
      onClick: onBack
    }, "Not now"))));
  }
  const RD_DEGRADED = {
    attendance: 'Attendance',
    records: 'Saving records',
    headcounts: 'Head counts'
  };
  function RdFreshness({
    d
  }) {
    const f = d.fresh;
    const tone = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 600,
      flexShrink: 0
    };
    if (d.staleNote) return React.createElement("span", {
      style: {
        ...tone,
        alignItems: 'center',
        color: RD_SYNC_FG
      }
    }, React.createElement(SdIcon, {
      name: "time",
      size: 14
    }), d.staleNote);
    if (!f) return null;
    return React.createElement("span", {
      role: "status",
      style: {
        ...tone,
        color: f.degraded ? RD_SYNC_FG : 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement("span", {
      style: {
        flexShrink: 0,
        display: 'flex',
        height: 16,
        alignItems: 'center'
      }
    }, React.createElement(SdIcon, {
      name: f.degraded ? 'warning' : 'time',
      size: 14
    })), React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, f.degraded ? `${f.degraded} is slow right now. What you record is kept and retried.` : f.busy ? 'Refreshing…' : f.just ? 'Up to date' : `Updated ${RD_AMPM(f.at)}`), !f.busy && React.createElement("button", {
      type: "button",
      onClick: f.onRefresh,
      "aria-label": "Refresh the centre\u2019s data",
      style: {
        all: 'unset',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '0 6px',
        margin: '-14px -6px',
        height: 44,
        whiteSpace: 'nowrap',
        color: 'var(--sd-colour-action-primary)',
        fontWeight: 700
      }
    }, React.createElement(SdIcon, {
      name: "refresh-update-arrow",
      size: 13
    }), "Refresh"));
  }
  function RdDrawer({
    scope,
    roomKey,
    rooms,
    educator,
    onClose,
    onRoom,
    onService,
    acts,
    emergencyRow
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const rowStyle = (act, pad) => ({
      all: 'unset',
      boxSizing: 'border-box',
      cursor: act ? 'pointer' : 'default',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: pad || '11px 14px',
      borderRadius: 'var(--sd-radius-lg)',
      fontSize: 14.5,
      fontWeight: 600,
      color: act ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
    });
    const item = m => {
      if (m.feature && !svcOn(m.feature)) return null;
      if (m.needs && !SERVICE[m.needs]) return null;
      if (m.tabletOnly && acts.phone) return null;
      if (m.url) {
        const link = SERVICE[m.url];
        return React.createElement("button", {
          key: m.key,
          type: "button",
          "aria-disabled": link ? undefined : 'true',
          className: link ? 'fp-row' : '',
          onClick: () => {
            if (!link) return;
            onClose();
            acts.external(m.label, link);
          },
          style: rowStyle(!!link)
        }, React.createElement("span", {
          style: {
            color: 'var(--sd-colour-text-secondary)',
            flexShrink: 0
          }
        }, React.createElement(SdIcon, {
          name: m.icon,
          size: 19
        })), React.createElement("span", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }
        }, React.createElement("span", null, m.label), !link && React.createElement("span", {
          style: {
            fontSize: 12,
            fontWeight: 500
          }
        }, m.none)), link && React.createElement("span", {
          style: {
            color: 'var(--sd-colour-text-secondary)',
            flexShrink: 0
          }
        }, React.createElement(SdIcon, {
          name: "link",
          size: 16
        })));
      }
      if (m.needsNet && m.dest && acts.offline) {
        return React.createElement("button", {
          key: m.key,
          type: "button",
          "aria-disabled": "true",
          style: rowStyle(false)
        }, React.createElement("span", {
          style: {
            color: 'var(--sd-colour-text-secondary)',
            flexShrink: 0
          }
        }, React.createElement(SdIcon, {
          name: m.icon,
          size: 19
        })), React.createElement("span", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }
        }, React.createElement("span", null, m.label), React.createElement("span", {
          style: {
            fontSize: 12,
            fontWeight: 500
          }
        }, "Needs a connection")));
      }
      const act = m.dest ? () => acts.openDest(m.dest) : m.act && acts && acts[m.act];
      if (m.hideUnwired && !act) return null;
      const stub = m.dest ? false : !act;
      return React.createElement("button", {
        key: m.key,
        type: "button",
        onClick: () => {
          onClose();
          if (act) act();
        },
        className: "fp-row",
        style: rowStyle(!!act)
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-secondary)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: m.icon,
        size: 19
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, m.label), m.tail && React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-secondary)',
          flexShrink: 0
        }
      }, React.createElement(SdIcon, {
        name: m.tail,
        size: 16
      })), stub && React.createElement("span", {
        className: "ds-pill ds-pill--sm",
        style: {
          flexShrink: 0
        }
      }, "Not in this prototype"));
    };
    const heading = {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--sd-colour-text-secondary)',
      padding: '0 14px',
      margin: '4px 0 2px'
    };
    const rule = React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--sd-colour-border-default)',
        margin: '10px 14px'
      }
    });
    const accountOn = svcOn('account');
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex'
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Close menu",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("aside", {
      className: "rd-drawer",
      style: {
        position: 'relative',
        width: 318,
        maxWidth: '82%',
        height: '100%',
        background: 'var(--sd-colour-surface-default)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '10px 0 40px rgba(0,40,34,0.28)'
      }
    }, React.createElement("div", {
      style: {
        background: IMMERSIVE,
        padding: '22px 18px 18px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        color: '#fff'
      }
    }, "Welcome"), React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--sd-colour-cyan-100)'
      }
    }, SERVICE.name)), React.createElement("button", {
      type: "button",
      "aria-label": "Close menu",
      onClick: onClose,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: 38,
        height: 38,
        borderRadius: 'var(--sd-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: D_FILL,
        border: `1px solid ${D_BORDER}`,
        color: '#fff'
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 19
    })))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, educator && (accountOn ? React.createElement("button", {
      type: "button",
      onClick: () => {
        onClose();
        acts.openDest('account');
      },
      className: "fp-row",
      style: rowStyle(true, '9px 14px')
    }, React.createElement(RdAvatar, {
      src: educator.img,
      name: educator.name,
      size: 36
    }), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, educator.name), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Account")), React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 16
    }))) : React.createElement("div", {
      style: rowStyle(false, '9px 14px')
    }, React.createElement(RdAvatar, {
      src: educator.img,
      name: educator.name,
      size: 36
    }), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, educator.name))), RD_MENU_SWITCH.map(item), rule, React.createElement("div", {
      style: heading
    }, "Service"), emergencyRow && item({
      key: 'emergency',
      act: 'emergency',
      label: 'Emergency',
      icon: 'warning'
    }), RD_MENU_SERVICE.map(item), rule, React.createElement("button", {
      type: "button",
      onClick: () => {
        onService();
        onClose();
      },
      className: "fp-row",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: scope === 'service' ? 'var(--sd-colour-surface-cyan)' : 'transparent'
      }
    }, React.createElement("span", {
      style: {
        color: scope === 'service' ? 'var(--sd-colour-text-on-cyan)' : 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "dashboard",
      size: 19
    })), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, "All rooms \xB7 service")), React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--sd-colour-border-default)',
        margin: '10px 14px'
      }
    }), React.createElement("div", {
      style: heading
    }, "Rooms"), rooms.map(r => {
      const active = scope === 'room' && r.key === roomKey;
      return React.createElement("button", {
        key: r.key,
        type: "button",
        onClick: () => {
          onRoom(r.key);
          onClose();
        },
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          background: active ? 'var(--sd-colour-surface-cyan)' : 'transparent'
        }
      }, React.createElement("span", {
        style: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          flexShrink: 0,
          background: active ? 'var(--sd-colour-text-on-cyan)' : 'var(--sd-colour-border-strong)'
        }
      }), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: 0
        }
      }, React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700
        }
      }, r.name), React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, svcOn('attendance') ? `${r.signed}/${r.booked} signed in` : `${r.signed} ${r.signed === 1 ? 'child' : 'children'}`, " \xB7 ", rdRequiredText(r))));
    }), rule, RD_MENU_LOGOUT.map(item))));
  }
  const RD_ALERT_EVENT = [['sleep', /sleep/i], ['med', /medication/i], ['sun', /sunscreen/i], ['nappy', /nappy|toilet/i]];
  const rdMedicationOn = () => svcOn('medication');
  const rdAlertAllowed = (a, events) => {
    if (!a || !events) return true;
    const hit = RD_ALERT_EVENT.find(([, re]) => re.test(a.label));
    return !hit || (hit[0] === 'med' ? rdMedicationOn() : !!events[hit[0]]);
  };
  const rdSleepDue = (c, events) => {
    if (!events || events.sleep === false) return null;
    if (c.alert || c.status !== 'here') return null;
    if (c.state !== 'Sleeping' && c.state !== 'Resting') return null;
    const last = (c.last || []).find(([k]) => k === 'sleep');
    if (!last) return null;
    const since = RD_MINS(RD_NOW) - RD_MINS(last[1]);
    const dueIn = RD_SLEEP_INTERVAL - since;
    if (dueIn > RD_SLEEP_SOON) return null;
    return rdDueAlert('Sleep check', dueIn);
  };
  const rdNappyDue = (c, events) => {
    if (!events || events.nappy === false) return null;
    if (c.alert || c.status !== 'here') return null;
    if (RD_WAKE_EVENTS.includes('nappy') && (c.state === 'Sleeping' || c.state === 'Resting')) return null;
    const at = rdLatestAt(c, 'nappy');
    if (!at) return null;
    const dueIn = RD_NAPPY_INTERVAL - (RD_MINS(RD_NOW) - RD_MINS(at));
    if (dueIn > RD_DUE_SOON) return null;
    const alert = rdDueAlert('Nappy check', dueIn);
    return dueIn < -59 ? {
      ...alert,
      label: `Nappy check · due ${rdDur(-dueIn)} ago`
    } : alert;
  };
  const rdDerivedDue = (c, events) => rdSleepDue(c, events) || rdNappyDue(c, events);
  const rdLiveAlert = (c, events) => {
    const kept = c.alert && rdAlertAllowed(c.alert, events) ? c.alert : null;
    return kept || rdDerivedDue({
      ...c,
      alert: kept
    }, events);
  };
  const rdSleepNotif = (n, roster, eventsByRoom, careByRoom) => {
    const room = RD_ROOMS.find(r => r.key === n.room) || {};
    const events = rdGateEvents(eventsByRoom[n.room] || rdEventsDefault(careByRoom[n.room] || room.care, room.sleepTrack));
    const late = roster.filter(c => c.room === n.room).map(c => rdLiveAlert(c, events)).filter(a => a && a.overdue && /sleep/i.test(a.label));
    if (!late.length) return null;
    const worst = Math.max(...late.map(a => -(a.dueIn || 0)));
    return {
      ...n,
      title: late.length === 1 ? 'Sleep check overdue' : `${late.length} sleep checks overdue`,
      body: `Longest ${worst} min past the ${RD_SLEEP_INTERVAL}-minute interval`
    };
  };
  const roomStats = (r, roster, opts) => {
    const kids = roster.filter(c => c.room === r.key);
    const signed = kids.filter(c => c.status === 'here').length;
    const ratio = r.educators ? Math.ceil(signed / r.educators) : 0;
    const care = opts && opts.careByRoom && opts.careByRoom[r.key] || r.care;
    const events = rdGateEvents(opts && opts.eventsByRoom && opts.eventsByRoom[r.key] || rdEventsDefault(care, r.sleepTrack));
    const seeded = RD_ALL_CHILDREN.filter(c => c.room === r.key).length;
    return {
      ...r,
      __room: true,
      signed,
      booked: opts && opts.future ? kids.length : r.booked + (kids.length - seeded),
      ratio,
      ratioOk: ratio <= r.limit,
      due: kids.filter(c => rdLiveAlert(c, events)).length
    };
  };
  const roomNameOf = c => (RD_ROOMS.find(r => r.key === c.room) || {}).name || '';
  function buildDashboard(ctx) {
    const {
      roster,
      scope,
      roomKey,
      calm,
      showStaff,
      grouping,
      setGrouping,
      sortKey,
      setSortKey,
      query,
      setQuery,
      view,
      setView,
      selected,
      selectedRoom,
      openChild,
      openRoom,
      goRoom,
      ticked,
      toggleTick,
      selectIds,
      unselectIds,
      clearSelection,
      openBulk,
      openHeadcount,
      openDue,
      longPressChild,
      fresh,
      conn,
      pending,
      syncing,
      synced,
      isPendingEvent,
      openPending,
      openChooser,
      openIncident,
      openSign,
      openCorrect,
      openRecord,
      openProfile,
      educator,
      openEducator,
      readOnly,
      date,
      careOverride,
      rowDetail,
      roomEvents,
      roomMaps,
      selectArm,
      notifUnread,
      openNotifs,
      openSettings,
      facets,
      setFacets,
      showSelectedOnly,
      setShowSelectedOnly,
      selectRule,
      dueList
    } = ctx;
    const strip = c => (calm || readOnly) && c.alert ? {
      ...c,
      alert: null
    } : c;
    const attendanceOff = !svcOn('attendance');
    const incidentsOn = svcOn('incidents');
    const headcountOn = svcOn('headcount');
    const canAttend = !attendanceOff && !rdOffBlocked('attendance', conn);
    const canCount = headcountOn && !rdOffBlocked('headcount', conn);
    const canAmend = !rdOffBlocked('amendEvent', conn);
    const stripOffEvents = c => c.alert && !rdAlertAllowed(c.alert, roomEvents) ? {
      ...c,
      alert: null
    } : c;
    const withDerivedDue = c => {
      const a = rdDerivedDue(c, roomEvents);
      return a ? {
        ...c,
        alert: a
      } : c;
    };
    const liveRaw = selected ? roster.find(c => c.id === selected.id) || RD_OTHER.find(c => c.id === selected.id) || selected : null;
    const liveSelected = liveRaw ? strip(withDerivedDue(stripOffEvents(liveRaw))) : null;
    const RD_ROOM_STATS = RD_ROOMS.map(r => roomStats(r, roster, roomMaps));
    const pool = (scope === 'room' ? roster.filter(c => c.room === roomKey) : roster).map(stripOffEvents).map(withDerivedDue).map(strip);
    const q = query.trim().toLowerCase();
    const matchChild = c => !q || c.name.toLowerCase().includes(q) || (c.tags || []).some(t => t.toLowerCase().includes(q)) || roomNameOf(c).toLowerCase().includes(q);
    const showTest = c => rdFacetPass(c, facets);
    const due = rdSortItems(pool.filter(c => c.alert), sortKey).sort((a, b) => (b.alert.kind === 'urgent') - (a.alert.kind === 'urgent') || !!b.alert.overdue - !!a.alert.overdue || (a.alert.dueIn ?? 99) - (b.alert.dueIn ?? 99));
    const rooms = RD_ROOM_STATS.map(r => calm ? {
      ...r,
      due: 0
    } : r);
    const breaches = !showStaff ? [] : scope === 'service' ? rooms.filter(r => !r.ratioOk) : rooms.filter(r => r.key === roomKey && !r.ratioOk);
    const tickedChildren = pool.filter(c => ticked.has(c.id));
    const common = {
      scope,
      roomKey,
      selected: liveSelected,
      selectedRoom,
      openChild,
      openRoom,
      goRoom,
      query,
      setQuery,
      roomNameOf,
      showStaff,
      canAttend,
      canCount,
      canAmend,
      incidentsOn,
      headcountOn,
      attendanceOff,
      eventLabel: k => k === 'sleep' ? rdEventTitle('sleep', roomEvents && roomEvents.sleepTrack || 'Sleep') : RD_BULK[k].label,
      grouping,
      setGrouping,
      sortKey,
      setSortKey,
      sortOptions: RD_SORTS,
      groupingOptions: RD_GROUP_MENU.filter(g => !(attendanceOff && g.key === 'attendance')).filter(g => g.key === RD_TAG_GROUPING ? pool.some(c => c.childTag) : !RD_FIELD_GROUPINGS.includes(g.key) || new Set(pool.map(c => c[g.key] || '—')).size >= 2).concat(scope === 'room' ? rdEventGroupingsFor(roomEvents) : []).sort(rdGroupingOrder),
      selectArm,
      facets,
      setFacets,
      facetPool: pool,
      selectRule,
      hasFilters: !!rdFacetChips(facets).length,
      grouped: rdGroupsCarry(selectRule, facets, grouping),
      dueChildren: due,
      ratioBreaches: breaches,
      dueList,
      isTicked: c => ticked.has(c.id),
      toggleTick,
      clearSelection,
      selectIds,
      openBulk,
      longPressChild,
      openSign,
      openCorrect,
      openRecord,
      openProfile,
      conn,
      pending,
      syncing,
      synced,
      isPendingEvent,
      openPending,
      openChooser,
      openIncident,
      tickedCount: tickedChildren.length,
      tickedChildren,
      openHeadcount,
      openDue,
      educator,
      openEducator,
      readOnly,
      date,
      rowDetail,
      notifUnread,
      openNotifs,
      openSettings
    };
    if (scope === 'service') {
      const signed = pool.filter(c => c.status === 'here').length;
      const totalBooked = RD_ROOM_STATS.reduce((n, r) => n + r.booked, 0);
      const educators = RD_ROOMS.reduce((n, r) => n + r.educators, 0);
      const showRooms = view === 'rooms';
      const matchedRooms = rooms.filter(r => !q || r.name.toLowerCase().includes(q));
      const matchedKids = pool.filter(showTest).filter(matchChild);
      return {
        ...common,
        identity: {
          title: 'All rooms',
          sub: SERVICE.name
        },
        summary: [attendanceOff ? {
          value: String(signed),
          label: signed === 1 ? 'Child' : 'Children'
        } : {
          value: `${signed}/${totalBooked}`,
          label: 'Signed in'
        }, {
          value: String(RD_ROOMS.reduce((n, r) => n + r.staffRequired, 0)),
          label: 'Educators required'
        }, ...(showStaff ? [{
          value: String(educators),
          label: educators === 1 ? 'Educator' : 'Educators'
        }, {
          value: String(breaches.length),
          label: 'Over ratio',
          tone: breaches.length ? 'var(--sd-colour-red-100)' : '#fff'
        }] : [])],
        serviceSignedIn: signed,
        alerts: breaches.length ? {
          urgent: true,
          label: breaches.length === 1 ? `${breaches[0].name} over ratio` : `${breaches.length} rooms over ratio`
        } : due.length ? {
          urgent: due.some(c => rdIsLate(c.alert)),
          label: due.length === 1 ? '1 due' : `${due.length} due`
        } : null,
        views: [['rooms', 'Rooms'], ['children', 'Children']],
        view,
        setView,
        showFilter: !showRooms,
        canSelect: false,
        shownIds: [],
        attendanceActions: [],
        bulkEvents: [],
        bulkScope: {
          ids: [],
          narrowed: false,
          count: 0
        },
        lastCount: null,
        openDueChild: openChild,
        staleNote: conn === 'offline' ? `Other rooms as of ${RD_AMPM('12:58')} — may have changed` : null,
        fresh,
        searchPlaceholder: showRooms ? 'Search rooms' : 'Search all children',
        shownCount: showRooms ? matchedRooms.length : matchedKids.length,
        work: showRooms ? matchedRooms.length ? [{
          key: 'rooms',
          label: null,
          items: matchedRooms
        }] : [] : rdGroupChildren(matchedKids, grouping, sortKey),
        showGrouping: !showRooms,
        actions: readOnly || !canCount ? [] : [{
          key: 'headcount',
          label: 'Head count · all rooms',
          glyph: 'user-multiple',
          primary: true,
          onClick: openHeadcount
        }],
        paneCounts: [['Rooms open', String(RD_ROOMS.length)], ...(attendanceOff ? [] : [['Still booked in', String(pool.filter(rdFacetTest('att', 'expected')).length), 'att', 'expected'], ['Signed out', String(pool.filter(rdFacetTest('att', 'gone')).length), 'att', 'gone'], ['Absent', String(pool.filter(rdFacetTest('att', 'absent')).length), 'att', 'absent'], ['Holiday', String(pool.filter(rdFacetTest('att', 'holiday')).length), 'att', 'holiday']])]
      };
    }
    const room = RD_ROOM_STATS.find(r => r.key === roomKey) || RD_ROOM_STATS[0];
    const care = RD_CARE[careOverride || room.care] || RD_CARE.ldc;
    const matched = showSelectedOnly ? pool.filter(c => ticked.has(c.id)).filter(matchChild) : pool.filter(showTest).filter(matchChild);
    const matchedIds = matched.map(c => c.id);
    const groupsCarry = rdGroupsCarry(selectRule, facets, grouping);
    const bandTotals = {};
    if (selectRule === RULE_BANDS) {
      rdGroupBands(pool, grouping, sortKey).forEach(b => {
        bandTotals[b.key] = b.items.length;
        b.sections.forEach(sec => {
          bandTotals[sec.key] = sec.items.length;
        });
      });
    }
    const tickedId = id => ticked.has(id);
    return {
      ...common,
      identity: {
        title: room.name,
        sub: SERVICE.name
      },
      care,
      summary: [attendanceOff ? {
        value: String(room.signed),
        label: room.signed === 1 ? 'Child' : 'Children'
      } : {
        value: `${room.signed}/${room.booked}`,
        label: 'Signed in'
      }, {
        value: String(room.staffRequired),
        label: 'Educators required'
      }, ...(showStaff ? [{
        value: `1:${room.ratio}`,
        label: 'Ratio',
        tone: room.ratioOk ? '#fff' : 'var(--sd-colour-red-100)'
      }] : [])],
      alerts: breaches.length ? {
        urgent: true,
        label: `${room.name} over ratio`
      } : due.length ? {
        urgent: due.some(c => rdIsLate(c.alert)),
        label: due.length === 1 ? '1 due' : `${due.length} due`
      } : null,
      views: null,
      searchPlaceholder: 'Search children',
      shownCount: matched.length,
      staleNote: conn === 'offline' ? `Roster as of ${RD_AMPM('12:58')}` : null,
      fresh,
      showFilter: true,
      canSelect: !readOnly,
      shownIds: readOnly ? [] : matchedIds,
      shownTickState: rdTickState(matchedIds, tickedId),
      toggleAllShown: () => rdTickState(matchedIds, tickedId) === 'checked' ? unselectIds(matchedIds) : selectIds(matchedIds),
      hiddenSelected: showSelectedOnly ? 0 : tickedChildren.filter(c => !matchedIds.includes(c.id)).length,
      showSelected: () => setShowSelectedOnly(true),
      alwaysSelect: selectArm === 'check' && !readOnly,
      bulkEvents: readOnly ? [] : care.events.filter(k => !roomEvents || roomEvents[k]),
      bulkScope: (() => {
        const narrowed = !!rdFacetChips(facets).length || !!q || showSelectedOnly;
        const here = (narrowed ? matched : pool).filter(c => c.status === 'here');
        const counts = {};
        Object.keys(RD_BULK).forEach(k => {
          counts[k] = here.filter(c => !rdCohortReason(k, c, RD_BULK[k])).length;
        });
        return {
          ids: here.map(c => c.id),
          narrowed,
          count: here.length,
          counts
        };
      })(),
      openDueChild: c => {
        const hit = !readOnly && c.alert && RD_ALERT_EVENT.find(([k, re]) => re.test(c.alert.label) && (k === 'med' ? rdMedicationOn() : !roomEvents || roomEvents[k]) && (k === 'med' || care.events.includes(k)));
        if (hit) openBulk(hit[0], [c.id]);else openChild(c);
      },
      dueGroups: readOnly ? [] : RD_ALERT_EVENT.filter(([k]) => k !== 'med' && (!roomEvents || roomEvents[k]) && care.events.includes(k)).map(([k, re]) => ({
        key: k,
        label: k === 'sleep' ? rdEventTitle('sleep', roomEvents && roomEvents.sleepTrack || 'Sleep') : RD_BULK[k].label,
        ids: due.filter(c => c.status === 'here' && re.test(c.alert.label)).map(c => c.id)
      })).filter(g => g.ids.length > 1),
      roomEvents,
      groupAction: !groupsCarry || readOnly ? null : g => (g.items.length ? (() => {
        const ids = g.items.map(c => c.id);
        const state = rdTickState(ids, tickedId);
        return {
          state,
          label: state === 'checked' ? `Clear ${ids.length}` : ids.length === 1 ? 'Select' : `Select all ${ids.length}`,
          onClick: () => state === 'checked' ? unselectIds(ids) : selectIds(ids)
        };
      })() : null),
      attendanceActions: readOnly || !canAttend || !rdAttOn('bulkAttendance') ? [] : (() => {
        const nHere = tickedChildren.filter(c => c.status === 'here').length;
        const nBooked = tickedChildren.filter(c => c.status === 'expected').length;
        const nBack = tickedChildren.filter(c => c.status === 'gone' || c.status === 'absent').length;
        return [nBooked + nBack ? ['in', nBooked + nBack] : null, nHere ? ['out', nHere] : null, nBooked && rdAttOn('absence') ? ['absent', nBooked] : null].filter(Boolean);
      })(),
      lastCount: readOnly || !canCount ? null : (() => {
        const last = rdHcLast(rdHcToday(), roomKey);
        return last ? `Last count ${RD_AMPM(last.at)}, ${String(last.by).split(' ')[0]}` : null;
      })(),
      work: rdGroupChildren(matched, grouping, sortKey),
      bands: selectRule === RULE_BANDS ? rdGroupBands(matched, grouping, sortKey) : null,
      totalFor: selectRule !== RULE_BANDS ? null : key => bandTotals[key],
      bandAction: selectRule !== RULE_BANDS || readOnly ? null : b => {
        if (!RD_BULKABLE.includes(b.att)) return null;
        const ids = b.items.map(c => c.id);
        const state = rdTickState(ids, tickedId);
        const narrow = rdNarrowWords(facets);
        const narrowed = ids.length < (bandTotals[b.key] || ids.length);
        const who = !narrowed ? b.label.toLowerCase() : narrow.length && narrow.length <= 2 && !query.trim() ? narrow.join(' · ') : 'shown';
        return {
          state,
          label: state === 'checked' ? `Clear ${ids.length}` : ids.length === 1 ? `Select the 1 ${who}` : `Select all ${ids.length} ${who}`,
          onClick: () => state === 'checked' ? unselectIds(ids) : selectIds(ids)
        };
      },
      sectionAction: selectRule !== RULE_BANDS || readOnly ? null : (b, sec) => {
        if (!RD_BULKABLE.includes(b.att)) return null;
        const ids = sec.items.map(c => c.id);
        const state = rdTickState(ids, tickedId);
        return {
          state,
          label: state === 'checked' ? `Clear ${ids.length}` : ids.length === 1 ? 'Select' : `Select all ${ids.length}`,
          onClick: () => state === 'checked' ? unselectIds(ids) : selectIds(ids)
        };
      },
      showGrouping: true,
      other: attendanceOff ? [] : RD_OTHER.filter(c => !roster.some(r => r.id === c.id) && matchChild(c)),
      actions: readOnly || !canCount ? [] : [{
        key: 'headcount',
        label: 'Head count',
        glyph: 'user-multiple',
        primary: true,
        onClick: openHeadcount
      }],
      paneCounts: [...(!roomEvents || roomEvents.sleep ? [['Sleeping', String(pool.filter(rdFacetTest('sleep', 'sleeping')).length), 'sleep', 'sleeping']] : attendanceOff ? [] : [['Absent', String(pool.filter(rdFacetTest('att', 'absent')).length), 'att', 'absent']]), ...(attendanceOff ? [] : [['Still booked in', String(pool.filter(rdFacetTest('att', 'expected')).length), 'att', 'expected'], ['Signed out', String(pool.filter(rdFacetTest('att', 'gone')).length), 'att', 'gone']]), ['Educators required', String(room.staffRequired)]]
    };
  }
  function RdRoomSwitcher({
    scope,
    roomKey,
    rooms,
    isIpad,
    onPickRoom,
    onPickService,
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const options = [{
      key: 'service',
      label: 'All rooms · service'
    }, ...rooms.map(r => ({
      key: r.key,
      label: r.name
    }))];
    const counts = {};
    rooms.forEach(r => {
      counts[r.key] = svcOn('attendance') ? `${r.signed}/${r.booked}` : String(r.signed);
    });
    return React.createElement(React.Fragment, null, React.createElement("button", {
      type: "button",
      "aria-label": "Close room list",
      onClick: onClose,
      style: {
        all: 'unset',
        position: 'absolute',
        inset: 0,
        zIndex: 24
      }
    }), React.createElement("div", {
      role: "menu",
      "aria-label": "Switch room",
      style: {
        position: 'absolute',
        zIndex: 25,
        boxSizing: 'border-box',
        overflowY: 'auto',
        ...(isIpad ? {
          left: 50,
          top: 64,
          width: 292,
          maxHeight: 'min(520px, 70%)'
        } : {
          left: 12,
          right: 12,
          bottom: 12,
          maxHeight: 'min(440px, 70%)'
        }),
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 16px 40px rgba(0,40,34,0.22)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, React.createElement(RdRadioRows, {
      options: options,
      value: scope === 'service' ? 'service' : roomKey,
      counts: counts,
      onPick: k => {
        onClose();
        if (k === 'service') onPickService();else onPickRoom(k);
      }
    })));
  }
  function SplitShell({
    d,
    isIpad,
    arrangement,
    onMenu,
    rooms,
    onPickRoom,
    onPickService,
    strip
  }) {
    const [pick, setPick] = useState(false);
    const alertPill = d.alerts ? React.createElement(RdAlertPill, {
      label: d.alerts.label,
      urgent: d.alerts.urgent,
      onClick: d.openDue
    }) : null;
    const signedIn = d.summary && d.summary[0] || null;
    const requiredStat = (d.summary || []).find(x => x.label === 'Educators required') || null;
    const roomyBar = arrangement === 'side';
    const stats = roomyBar ? d.summary : d.summary.slice(0, 1);
    return React.createElement("div", {
      style: {
        ...screenBase,
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      className: "rd-on-teal",
      style: {
        background: IMMERSIVE,
        padding: isIpad ? '12px 22px' : '14px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: isIpad ? 0 : 10,
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: isIpad ? roomyBar ? 12 : 9 : 10,
        flexWrap: 'nowrap',
        position: 'relative',
        zIndex: 1,
        minHeight: isIpad ? 44 : 0,
        minWidth: 0
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Menu",
      onClick: onMenu,
      style: {
        all: 'unset',
        cursor: 'pointer',
        flexShrink: 0,
        color: '#fff'
      }
    }, React.createElement(SdIcon, {
      name: "menu-hamburger",
      size: 22
    })), isIpad ? React.createElement("button", {
      type: "button",
      onClick: () => setPick(o => !o),
      "aria-expanded": pick,
      "aria-haspopup": "menu",
      "aria-label": `${d.identity.title} — change room`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        minWidth: 0,
        flex: '0 1 auto',
        overflow: 'hidden',
        padding: '11px 6px',
        margin: '-11px -6px'
      }
    }, React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap'
      }
    }, d.identity.title), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: 'var(--sd-colour-cyan-200)',
        display: 'inline-flex',
        transform: 'rotate(90deg)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    })))) : React.createElement("button", {
      type: "button",
      onClick: () => setPick(o => !o),
      "aria-expanded": pick,
      "aria-haspopup": "menu",
      "aria-label": `${d.identity.title} — change room`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'block',
        minWidth: 0,
        flex: 1,
        padding: '8px 6px',
        margin: '-8px -6px'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.identity.title), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: 'var(--sd-colour-cyan-200)',
        display: 'inline-flex',
        flexShrink: 0,
        transform: 'rotate(90deg)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 15
    }))), React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 11.5,
        fontWeight: 500,
        color: 'var(--sd-colour-cyan-100)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, signedIn && React.createElement(React.Fragment, null, React.createElement("b", {
      style: {
        fontWeight: 700,
        color: '#fff'
      }
    }, signedIn.value), " ", signedIn.label.toLowerCase()), d.scope !== 'room' && React.createElement(React.Fragment, null, " \xB7 ", d.identity.sub), requiredStat && d.scope === 'room' && React.createElement(React.Fragment, null, " \xB7 ", React.createElement("b", {
      style: {
        fontWeight: 700,
        color: '#fff'
      }
    }, requiredStat.value), " ", requiredStat.value === '1' ? 'educator' : 'educators', " required"))), isIpad && React.createElement(React.Fragment, null, React.createElement(RdHeadRule, null), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: roomyBar ? 20 : 14,
        flexShrink: 0
      }
    }, stats.map(st => React.createElement(RdStat, _extends({
      key: st.label
    }, st)))), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 8
      }
    }), React.createElement(RdDateNav, {
      date: d.date
    }), alertPill), d.emergency && d.emergency.door && React.createElement(RdEmergencyDoor, {
      running: d.emergency.running,
      label: d.emergency.label,
      onOpen: d.emergency.open,
      wide: isIpad && !d.readOnly
    }), React.createElement(RdConnChip, {
      conn: d.conn,
      syncing: d.syncing,
      pending: d.pending.length,
      synced: d.synced,
      onOpen: d.openPending,
      compact: !isIpad
    }), React.createElement(RdNotifBell, {
      count: d.notifUnread,
      onOpen: d.openNotifs
    }), isIpad && d.scope === 'room' && React.createElement(RdSettingsCog, {
      onOpen: d.openSettings
    }), React.createElement(RdActingAs, {
      educator: d.educator,
      onOpen: d.openEducator
    })), !isIpad && React.createElement("div", {
      className: "rd-hdr-chips",
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }
    }, React.createElement(RdDateNav, {
      date: d.date,
      compact: true
    }), alertPill)), strip, pick && React.createElement(RdRoomSwitcher, {
      scope: d.scope,
      roomKey: d.roomKey,
      rooms: rooms,
      isIpad: isIpad,
      onPickRoom: onPickRoom,
      onPickService: onPickService,
      onClose: () => setPick(false)
    }), d.readOnly && React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: isIpad ? '10px 26px' : '9px 16px',
        background: 'var(--sd-colour-surface-grey)',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: d.readOnly === 'future' ? 'calendar' : 'lock',
      size: 16
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        flex: 1,
        minWidth: 0,
        color: 'var(--sd-colour-text-primary)'
      }
    }, d.readOnly === 'future' ? React.createElement(React.Fragment, null, "Viewing ", d.date.label, " \u2014 bookings so far. Nothing can be logged until the day.") : React.createElement(React.Fragment, null, "Viewing ", d.date.label, " \u2014 this day is closed. Records can\u2019t be added or changed.")), React.createElement("button", {
      type: "button",
      onClick: d.date.toToday,
      className: "fp-btn",
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-action-primary)',
        fontSize: 12.5,
        fontWeight: 700,
        flexShrink: 0
      }
    }, "Back to today")), React.createElement(RdWorkArea, {
      d: d,
      arrangement: arrangement,
      pad: isIpad ? '18px 26px 18px' : '10px 12px 10px'
    }), arrangement === 'none' && !!d.actions.length && !(d.selected || d.selectedRoom || d.tickedCount) && React.createElement(RdActionBar, {
      d: d,
      pad: isIpad ? '14px 26px' : '12px 16px'
    }));
  }
  function Splash({
    label,
    onDone
  }) {
    const [leaving, setLeaving] = useState(false);
    useEffect(() => {
      const t1 = setTimeout(() => setLeaving(true), 600);
      const t2 = setTimeout(onDone, 1000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, []);
    return React.createElement("div", {
      className: "fp-splash",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: IMMERSIVE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        opacity: leaving ? 0 : 1,
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        width: 66,
        height: 66,
        borderRadius: '50%',
        background: 'var(--sd-colour-surface-default)',
        color: TEAL,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 30
      }
    }, "P"), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14
      }
    }, React.createElement(Spinner, {
      size: 24,
      color: "rgba(255,255,255,0.9)"
    }), React.createElement("p", {
      style: {
        fontSize: 15,
        fontWeight: 500,
        margin: 0,
        color: 'var(--sd-colour-cyan-100)'
      }
    }, "Opening ", label, "\u2026")));
  }
  function FlowApp(props = {}) {
    const _p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const _bare = !!_p.get('bare');
    const conflictMode = _p.get('conflict') === '1' ? '1' : _p.get('conflict') === 'always' ? 'always' : '';
    const _scope0 = props.scope || (_p.get('scope') === 'service' ? 'service' : 'room');
    const _dev0 = props.layout ? props.layout.device : _p.get('device') === 'phone' ? 'phone' : 'ipad';
    const _o0 = props.layout ? props.layout.orient : _p.get('orient') === 'portrait' ? 'portrait' : 'landscape';
    const _room0 = RD_ROOMS.some(r => r.key === props.roomKey) ? props.roomKey : RD_ROOMS.some(r => r.key === _p.get('room')) ? _p.get('room') : 'koala';
    const _view0 = _p.get('view') === 'children' ? 'children' : 'rooms';
    const [scope, setScope] = useState(_scope0);
    const [device, setDevice] = useState(_dev0);
    const [orientation, setOrientation] = useState(_o0);
    const [roomKey, setRoomKey] = useState(_room0);
    const [view, setView] = useState(_view0);
    const [calm, setCalm] = useState(!!_p.get('calm'));
    const [showStaff, setShowStaff] = useState(false);
    const [selectArm, setSelectArm] = useState(rdReadArm(_p.get('sel')));
    useEffect(() => {
      setSelectArm(props.selectArm || '');
    }, [props.selectArm]);
    const [selectRule, setSelectRule] = useState(rdReadRule(_p.get('rule')));
    useEffect(() => {
      setSelectRule(rdReadRule(props.selectRule));
    }, [props.selectRule]);
    const [dueList, setDueList] = useState(rdReadDueList(props.dueList !== undefined ? props.dueList : _p.get('duelist')));
    useEffect(() => {
      if (props.dueList !== undefined) setDueList(rdReadDueList(props.dueList));
    }, [props.dueList]);
    const [facets, setFacets] = useState(RD_SHOW_LEGACY[_p.get('show')] || {});
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [grouping, setGrouping] = useState(rdReadGrouping(_p.get('group')));
    const [sortKey, setSortKey] = useState(_p.get('sort') === 'last' ? 'last' : 'first');
    const [openGroups, setOpenGroups] = useState({});
    const [selected, setSelected] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [dest, setDest] = useState(() => rdDestKey(_p.get('dest')));
    const [launchReq, setLaunchReq] = useState(null);
    rdLearning.start = ids => {
      if (!rdDestKey('learning')) return;
      setLaunchReq({
        childIds: ids,
        nonce: Date.now()
      });
      setDest('learning');
    };
    const [educator, setEducator] = useState(props.educator || RD_EDUCATOR);
    const [educatorOpen, setEducatorOpen] = useState(false);
    const [emView, setEmView] = useState(null);
    const [peek, setPeek] = useState(null);
    const [pinGate, setPinGate] = useState(null);
    const [emSign, setEmSign] = useState(null);
    const [educatorNoPin, setEducatorNoPin] = useState(false);
    const [, setEmTick] = useState(0);
    const emRun = rdEmStore.run;
    const emRunning = !!emRun && !emRun.submitted;
    const emVisitors = rdHcOn('visitors') ? RD_VISITORS : [];
    const emDoor = (() => {
      const v = props.emdoor !== undefined ? props.emdoor : _p.get('emdoor');
      return v === 'menu' || v === 'both' ? v : 'header';
    })();
    const _count = ['picker', 'routine', 'evacuation', 'lockdown', 'evacuation-drill', 'lockdown-drill'].includes(_p.get('count')) ? _p.get('count') : null;
    const countRoster = r => _p.get('roster') === 'none' ? [] : r;
    const [dateIndex, setDateIndex] = useState(_p.get('date') && rdDateAt(Number(_p.get('date'))) ? Number(_p.get('date')) : 0);
    const dateDay = rdDateAt(dateIndex) || rdDateAt(0);
    const readOnly = dateIndex > 0 ? 'past' : dateIndex < 0 ? 'future' : false;
    const readOnlyMsg = readOnly === 'future' ? 'Future days are read-only' : 'Past days are read-only';
    const [calOpen, setCalOpen] = useState(false);
    const [notifRead, setNotifRead] = useState(new Set());
    const [notifHideRead, setNotifHideRead] = useState(false);
    const [notifsOpen, setNotifsOpen] = useState(false);
    const [careByRoom, setCareByRoom] = useState({});
    const [eventsByRoom, setEventsByRoom] = useState({});
    const [rowDetailByRoom, setRowDetailByRoom] = useState({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [roster, setRoster] = useState(rdInitialRoster);
    const [childGroups, setChildGroups] = useState(rdChildGroupSeed);
    const [ticked, setTicked] = useState(new Set());
    const [sheet, setSheet] = useState(null);
    const [toast, setToast] = useState(null);
    const [headcounts, setHeadcounts] = useState(rdHcToday);
    const saveHeadcounts = next => {
      rdHcStore.counts = next;
      setHeadcounts(next);
    };
    const logHeadcount = ({
      children,
      rooms,
      queued
    }) => saveHeadcounts([{
      id: `hc-${Date.now()}`,
      room: rooms.length > 1 ? 'service' : rooms[0],
      rooms,
      at: RD_NOW,
      updatedAt: RD_NOW,
      rev: 0,
      lastBy: educator.name,
      by: educator.name,
      children,
      queued: !!queued
    }, ...(rdHcStore.counts || headcounts)]);
    const [portraitPane, setPortraitPane] = useState(_p.get('pane') === 'side' ? 'side' : 'bottom');
    const [conn, setConn] = useState(props.conn || (_p.get('conn') === 'offline' ? 'offline' : 'online'));
    const [synced, setSynced] = useState(0);
    const [flaky, setFlaky] = useState(!!_p.get('flaky') || !!props.flaky);
    useEffect(() => {
      if (props.flaky !== undefined) setFlaky(!!props.flaky);
    }, [props.flaky]);
    const [fresh, setFresh] = useState({
      at: RD_NOW,
      busy: false,
      just: false
    });
    const refreshTimer = React.useRef(null);
    useEffect(() => () => clearTimeout(refreshTimer.current), []);
    const refreshData = () => {
      if (conn === 'offline' || fresh.busy) return;
      setFresh(f => ({
        ...f,
        busy: true
      }));
      refreshTimer.current = setTimeout(() => {
        setFresh({
          at: RD_NOW,
          busy: false,
          just: true
        });
      }, 900);
    };
    const degradedKey = RD_DEGRADED[_p.get('degraded')] ? _p.get('degraded') : flaky ? 'records' : null;
    const freshCtx = {
      at: fresh.at,
      busy: fresh.busy,
      just: fresh.just,
      onRefresh: refreshData,
      degraded: degradedKey ? RD_DEGRADED[degradedKey] : null
    };
    const [pending, setPending] = useState(() => {
      if ((props.conn || (_p.get('conn') === 'offline' ? 'offline' : 'online')) !== 'offline') {
        rdOutbox.items = [];
        rdHcClearQueued();
        return [];
      }
      return rdOutbox.items.slice();
    });
    const [syncing, setSyncing] = useState(false);
    const [pendingOpen, setPendingOpen] = useState(false);
    const [dueOpen, setDueOpen] = useState(false);
    const [chooser, setChooser] = useState(null);
    const [incident, setIncident] = useState(null);
    const [correct, setCorrect] = useState(null);
    const [med, setMed] = useState(null);
    const [signerRoles, setSignerRoles] = useState({});
    const [profile, setProfile] = useState(null);
    const [drafts, setDrafts] = useState({});
    const stashDraft = (key, data) => setDrafts(d => ({
      ...d,
      [key]: data
    }));
    const clearDraft = key => setDrafts(d => {
      const n = {
        ...d
      };
      delete n[key];
      return n;
    });
    const [inc, setIncData] = useState(rdIncInit);
    const saveInc = fn => setIncData(d => {
      const n = fn(d);
      rdIncStore.data = n;
      return n;
    });
    const [nonce, setNonce] = useState(0);
    const [splash, setSplash] = useState(props.initialSplash || false);
    const [splashId, setSplashId] = useState(0);
    const educators = props.educators || RD_EDUCATORS;
    const drawerActs = {
      signOut: emRunning ? () => emRefuse() : props.onSignOut,
      switchEducator: emRunning ? () => emRefuse() : props.onSwitchEducator,
      headcount: () => openHeadcount(),
      openDest: k => {
        const key = rdDestKey(k);
        if (key) setDest(key);
      },
      phone: device !== 'ipad',
      offline: conn === 'offline',
      emergency: () => openEmergency(),
      external: (label, url) => showToast(`${label} opens in your browser · ${String(url).replace(/^https?:\/\//, '').split('/')[0]}`),
      settings: scope === 'room' ? () => setSettingsOpen(true) : undefined
    };
    const isIpad = device === 'ipad';
    const land = orientation === 'landscape';
    const arrangement = !isIpad ? 'none' : land ? 'side' : portraitPane === 'side' ? 'side-portrait' : 'bottom';
    useEffect(() => {
      if (!props.layout) return;
      setDevice(props.layout.device);
      setOrientation(props.layout.orient);
    }, [props.layout && props.layout.device, props.layout && props.layout.orient]);
    useEffect(() => {
      if (props.scope && props.scope !== scope) {
        setScope(props.scope);
        reset();
      }
    }, [props.scope]);
    useEffect(() => {
      if (props.roomKey && props.roomKey !== roomKey) {
        setRoomKey(props.roomKey);
        reset();
      }
    }, [props.roomKey]);
    const busy = !!(menuOpen || sheet || chooser || incident || correct || med || profile || educatorOpen || emRunning || emSign || pinGate || notifsOpen || settingsOpen || pendingOpen || dueOpen || calOpen || syncing);
    useEffect(() => {
      if (props.onBusyChange) props.onBusyChange(busy);
    }, [busy]);
    const draftCount = Object.keys(drafts).length;
    useEffect(() => {
      if (props.onUnsentChange) props.onUnsentChange({
        records: pending.length,
        drafts: draftCount
      });
    }, [pending.length, draftCount]);
    const launch = label => {
      if (_bare) return;
      setSplashId(n => n + 1);
      setSplash(label);
    };
    const reset = () => {
      setSelected(null);
      setSelectedRoom(null);
      setQuery('');
      setTicked(new Set());
      setSheet(null);
      setNonce(n => n + 1);
    };
    const openChild = c => {
      setSelected(c);
      setSelectedRoom(null);
    };
    const openRoom = r => {
      setSelectedRoom(r);
      setSelected(null);
    };
    const roomPool = roster.filter(c => c.room === roomKey);
    const toggleTick = c => setTicked(s => {
      const n = new Set(s);
      n.has(c.id) ? n.delete(c.id) : n.add(c.id);
      return n;
    });
    const clearSelection = () => {
      setTicked(new Set());
      setShowSelectedOnly(false);
    };
    const afterLog = () => {
      clearSelection();
      setSelected(null);
      setSelectedRoom(null);
    };
    const selectIds = ids => {
      setSelected(null);
      setSelectedRoom(null);
      setTicked(s => new Set([...s, ...ids]));
    };
    const unselectIds = ids => setTicked(s => {
      const n = new Set(s);
      ids.forEach(id => n.delete(id));
      return n;
    });
    const longPressChild = c => {
      if (ticked.size) {
        toggleTick(c);
        return;
      }
      const seed = selected && selected.id !== c.id ? [selected.id, c.id] : [c.id];
      setSelected(null);
      setSelectedRoom(null);
      setTicked(new Set(seed));
    };
    const openBulk = (eventKey, scope) => {
      if (readOnly) {
        showToast(readOnlyMsg);
        return;
      }
      if (RD_BULK[eventKey] && RD_BULK[eventKey].attendance && offlineBlocked('attendance')) {
        showToast('Signing in and out needs a connection');
        return;
      }
      if (eventKey === 'med') {
        const ids = Array.isArray(scope) ? scope : [...ticked];
        const child = roster.find(c => c.id === ids[0]);
        if (child) setMed(child);
        return;
      }
      let ids;
      if (scope === 'expected') {
        ids = [...roomPool.filter(c => c.status === 'expected'), ...RD_OTHER.filter(c => !roster.some(r => r.id === c.id))].map(c => c.id);
        setTicked(new Set(ids));
      } else if (scope === 'here') {
        ids = roomPool.filter(c => c.status === 'here').map(c => c.id);
        setTicked(new Set(ids));
      } else if (Array.isArray(scope)) {
        ids = scope;
      } else {
        ids = [...ticked];
      }
      setSheet({
        kind: 'bulk',
        event: eventKey,
        ids
      });
    };
    const offlineBlocked = f => rdOffBlocked(f, conn);
    const openHeadcount = () => {
      if (readOnly) {
        showToast(readOnlyMsg);
        return;
      }
      if (!rdHcOn('headcount')) return;
      setSheet({
        kind: 'headcount'
      });
    };
    const openCount = h => {
      if (readOnly) {
        showToast(readOnlyMsg);
        return;
      }
      setSheet({
        kind: 'headcount',
        countId: h.id,
        fromCounts: true
      });
    };
    const [hcSign, setHcSign] = useState(null);
    const openHcSign = (c, done) => {
      if (readOnly) {
        showToast(readOnlyMsg);
        if (done) done(false);
        return;
      }
      const go = () => setHcSign({
        id: c.id,
        done
      });
      if (emPinOwed()) setPinGate({
        then: go,
        cancel: () => {
          if (done) done(false);
        }
      });else go();
    };
    const updateCount = (h, rec) => {
      const offline = conn === 'offline';
      let mine = rec.children,
        base = rec.base,
        baseRev = rec.baseRev,
        note = null;
      for (let tries = 0;; tries += 1) {
        if (conflictMode === 'always' || conflictMode === '1' && tries === 0) rdColleagueSave(h.id, educator.name);
        const cur = (rdHcStore.counts || []).find(x => x.id === h.id);
        if (!cur || (cur.rev || 0) === baseRev) break;
        if (tries >= 2) {
          setHeadcounts(rdHcStore.counts);
          return {
            error: 'This count keeps changing, so it was not saved. Your ticks are kept: try Save again.'
          };
        }
        const m = rdHcMerge(base, mine, cur.children);
        mine = m.children;
        base = rdHcById(cur.children);
        baseRev = cur.rev || 0;
        note = {
          who: cur.lastBy || cur.by,
          added: (note ? note.added : 0) + m.added,
          unticked: (note ? note.unticked : 0) + m.unticked
        };
      }
      saveHeadcounts((rdHcStore.counts || headcounts).map(x => x.id === h.id ? {
        ...x,
        children: mine,
        updatedAt: RD_NOW,
        rev: (x.rev || 0) + 1,
        lastBy: educator.name,
        queued: x.queued || offline
      } : x));
      setSheet({
        kind: 'headcount',
        openCounts: true
      });
      const v = rdHcView({
        ...h,
        children: mine
      });
      if (offline) queueCount(`Head count ${RD_AMPM(h.at)} updated · ${v.seen} of ${v.of} accounted for`, 'headcount', mine.filter(x => x.counted).map(x => x.id), RD_NOW);
      if (note) {
        const who = String(note.who).split(' ')[0];
        showToast(`Merged with ${who}’s changes${note.added ? `, ${note.added} added` : ''}${note.unticked ? ` · ${who} unticked ${note.unticked === 1 ? 'a child' : `${note.unticked} children`} since you opened this count` : ''}`, null, 7000);
      } else showToast(offline ? `Saved on this device, ${v.seen} of ${v.of} accounted for` : `Count updated, ${v.seen} of ${v.of} accounted for`);
    };
    const recordCount = ({
      children,
      rooms,
      seen,
      of
    }) => {
      setSheet(null);
      logHeadcount({
        children,
        rooms,
        queued: conn === 'offline'
      });
      const lost = children.filter(x => x.signedIn && !x.counted).map(x => x.name);
      if (conn === 'offline') {
        queueCount(`Head count · ${seen} of ${of} accounted for${lost.length ? ` · not accounted for: ${lost.join(', ')}` : ''}`, 'headcount', children.filter(x => x.counted).map(x => x.id), RD_NOW);
        showToast(`Saved on this device, ${seen} of ${of} accounted for`);
      } else showToast(`Head count recorded, ${seen} of ${of} accounted for`);
    };
    const emScopeStart = () => scope === 'service' ? 'all' : roomKey;
    const openEmergency = () => setEmView(emRunning ? 'run' : 'picker');
    const startEmergency = kind => {
      rdEmStart(kind, emScopeStart());
      setEmView('run');
    };
    const emRefuse = () => showToast('An emergency is running. End it first.');
    const emCancel = () => {
      rdEmStore.run = null;
      setEmView(null);
      showToast('Emergency cancelled. Nothing was recorded');
    };
    const submitEmergency = ev => {
      const run = rdEmStore.run;
      rdEmStore.events = [ev, ...rdEmStore.events];
      run.submitted = true;
      const n = ev.items.filter(i => i.accounted).length;
      const title = rdKindTitle(run);
      const queued = conn === 'offline';
      if (queued) queueCount(`${title} · ${n} of ${ev.items.length} accounted for`, 'emergency', [], ev.endTime);
      rdEmStore.run = null;
      setEmView(null);
      showToast(queued ? `Saved on this device, ${n} of ${ev.items.length} accounted for` : `${title} recorded, ${n} of ${ev.items.length} accounted for`);
    };
    const requestAttendance = (person, direction) => {
      const go = () => setEmSign({
        id: person.id,
        direction
      });
      if (emRun && emRun.pinFor === educator.name) go();else setPinGate({
        then: go
      });
    };
    const emPinOwed = () => emRunning && emRun.changedActor && emRun.pinFor !== educator.name;
    const openChooser = c => {
      if (readOnly) return;
      setChooser(c);
    };
    const openSign = (c, direction) => {
      if (readOnly) {
        showToast(readOnlyMsg);
        return;
      }
      if (offlineBlocked('attendance')) {
        showToast('Signing in and out needs a connection');
        return;
      }
      const go = () => setSheet({
        kind: 'sign',
        id: c.id,
        direction
      });
      if (emPinOwed()) setPinGate({
        then: go
      });else go();
    };
    const openIncident = c => {
      if (readOnly) return;
      setChooser(null);
      setIncident(c);
    };
    const openCorrect = (child, entry) => {
      if (readOnly) return;
      if (offlineBlocked('amendEvent')) {
        showToast('Amending a record needs a connection');
        return;
      }
      setCorrect({
        child,
        ...entry
      });
    };
    const [record, setRecord] = useState(null);
    const openRecord = (child, entry) => setRecord({
      childId: child.id,
      kind: entry.kind,
      doseId: entry.med ? entry.med.id : null,
      ...(entry.readOnly ? {
        snap: entry
      } : {})
    });
    const openProfile = c => setProfile(c);
    const toastTimer = React.useRef(null);
    const showToast = (msg, undo, ms) => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({
        msg,
        undo
      });
      toastTimer.current = setTimeout(() => setToast(null), ms || (undo ? 5200 : 2600));
    };
    const applyEvent = (ids, kind, at, details) => setRoster(rs => rs.map(c => {
      if (!ids.includes(c.id)) return c;
      const clears = c.alert && (kind === 'sleep' && /sleep/i.test(c.alert.label) || kind === 'med' && /medication/i.test(c.alert.label) || kind === 'sun' && /sunscreen/i.test(c.alert.label) || kind === 'nappy' && /nappy/i.test(c.alert.label));
      const d = details && details[c.id] || {};
      if (kind === 'med' && d.med && d.med.on > 0) {
        return {
          ...c,
          doses: [d.med, ...(c.doses || [])],
          audit: [{
            at: RD_NOW,
            by: educator.name,
            action: 'Late entry · Medication',
            detail: `${rdMedWhen(d.med)} · ${rdMedLine(d.med)}`,
            reason: null
          }, ...(c.audit || [])]
        };
      }
      const state = kind === 'sleep' && RD_FOUND_STATE[d.detail] ? RD_FOUND_STATE[d.detail] : c.state;
      const when = d.at || at;
      return {
        ...c,
        alert: clears ? null : c.alert,
        state,
        last: [[kind, when, d.detail || null, d.note || null, d.context || null, d.type || null, d.meal ? {
          meal: d.meal
        } : d.checks || d.setup || d.roomTemp != null ? {
          checks: d.checks || null,
          setup: d.setup || null,
          roomTemp: d.roomTemp != null ? d.roomTemp : null
        } : null, educator.name, d.med || null], ...(c.last || []).filter(([k]) => k !== kind)].slice(0, RD_LAST_KEPT),
        ...(kind === 'med' && d.med ? {
          doses: [d.med, ...(c.doses || [])]
        } : null),
        sleepSetup: kind === 'sleep' && d.setup ? d.setup : c.sleepSetup,
        ...(kind === 'sleep' ? rdSleepAdvance(c, d.type, when) : null),
        pre: {
          ...(c.pre || {}),
          [kind]: {
            entry: (c.last || []).find(([k]) => k === kind) || null,
            state: c.state,
            cleared: clears ? c.alert : null,
            sleepOpen: c.sleepOpen,
            sleepSpans: c.sleepSpans,
            sleepSetup: c.sleepSetup,
            amended: (c.corrected || []).includes(kind)
          }
        },
        corrected: (c.corrected || []).filter(k => k !== kind)
      };
    }));
    const applyCorrection = (childId, kind, next) => setRoster(rs => rs.map(c => {
      if (c.id !== childId) return c;
      const prev = (c.last || []).find(([k]) => k === kind) || [];
      const [, oldAt,, oldNote,, oldType] = prev;
      if (prev[8] && prev[8].signed && RD_EVENT_POLICY.signedLocked.includes(kind)) return c;
      const at = rdTimeAmendable(kind) ? next.at : oldAt;
      const parts = [];
      if (at !== oldAt) parts.push(`Time ${RD_AMPM(oldAt) || '—'} → ${RD_AMPM(at)}`);
      if ((next.note || null) !== (oldNote || null)) parts.push(next.note ? `Note “${next.note}”` : 'Note removed');
      let span = null;
      if (kind === 'sleep' && at !== oldAt) {
        if (RD_PERIOD_END[oldType] && (c.sleepSpans || []).length) span = {
          sleepSpans: c.sleepSpans.map((x, i) => i === c.sleepSpans.length - 1 ? {
            ...x,
            to: at
          } : x)
        };else if (RD_PERIOD_OF[oldType]) span = {
          sleepOpen: {
            ...(c.sleepOpen || {}),
            [RD_PERIOD_OF[oldType]]: at
          }
        };
      }
      return {
        ...c,
        last: (c.last || []).map(e => e[0] === kind ? [kind, at, e[2] || null, next.note || null, e[4] || null, e[5] || null, e[6] || null, e[7] || null, e[8] || null] : e),
        ...span,
        corrected: [...new Set([...(c.corrected || []), kind])],
        audit: [{
          at: RD_NOW,
          by: educator.name,
          action: `Amended ${RD_EVENT_LABEL[kind] || kind}`,
          detail: parts.join(' · ') || 'No change recorded',
          reason: next.reason || null
        }, ...(c.audit || [])]
      };
    }));
    const applyDelete = (ids, kind, via, doseId) => setRoster(rs => rs.map(c => {
      if (!ids.includes(c.id)) return c;
      const cur = (c.last || []).find(([k]) => k === kind);
      if (!cur) return c;
      const saidOf = (at, detail, note, dose) => [RD_AMPM(at), detail, dose && dose.reason ? `for ${dose.reason}` : null, dose && (dose.flags || []).length ? `flagged: ${dose.flags.join(', ').toLowerCase()}` : null, note ? `“${note}”` : null, dose && dose.signed ? `signed by ${dose.admin.name} and ${dose.witness.name}` : null].filter(Boolean).join(' · ');
      const curDose = cur[8] || null;
      if (kind === 'med' && doseId && (!curDose || curDose.id !== doseId)) {
        const d = (c.doses || []).find(x => x.id === doseId);
        if (!d) return c;
        return {
          ...c,
          doses: (c.doses || []).filter(x => x.id !== doseId),
          deletedDoses: [rdDeletedDose(d, educator.name), ...(c.deletedDoses || [])],
          audit: [{
            at: RD_NOW,
            by: educator.name,
            action: 'Deleted Medication record',
            detail: `${saidOf(d.at, rdMedLine(d), d.note, d)}${(d.admin || {}).name && d.admin.name !== educator.name ? ` · recorded by ${d.admin.name}` : ''}`,
            reason: null
          }, ...(c.audit || [])]
        };
      }
      const pre = (c.pre || {})[kind] || null;
      const [, at, detail, note,,,, by, dose] = cur;
      const said = saidOf(at, detail, note, dose);
      const {
        [kind]: gone,
        ...keep
      } = c.pre || {};
      return {
        ...c,
        ...(dose ? {
          doses: (c.doses || []).filter(x => x.id !== dose.id),
          deletedDoses: [rdDeletedDose(dose, educator.name), ...(c.deletedDoses || [])]
        } : null),
        last: [...(c.last || []).filter(([k]) => k !== kind), ...(pre && pre.entry ? [pre.entry] : [])].sort((a, b) => RD_MINS(b[1]) - RD_MINS(a[1])).slice(0, RD_LAST_KEPT),
        state: kind === 'sleep' && pre ? pre.state : c.state,
        alert: pre && pre.cleared ? pre.cleared : c.alert,
        ...(kind === 'sleep' && pre ? {
          sleepOpen: pre.sleepOpen,
          sleepSpans: pre.sleepSpans,
          sleepSetup: pre.sleepSetup
        } : null),
        pre: keep,
        corrected: [...new Set([...(c.corrected || []).filter(k => k !== kind), ...(pre && pre.entry && pre.amended ? [kind] : [])])],
        audit: [{
          at: RD_NOW,
          by: educator.name,
          action: `Deleted ${RD_EVENT_LABEL[kind] || 'Note'} record`,
          detail: `${said}${by && by !== educator.name ? ` · recorded by ${by}` : ''}`,
          reason: via === 'undo' ? 'Undone straight after it was recorded' : null
        }, ...(c.audit || [])]
      };
    }));
    const attEvent = (kind, at, note, to) => ({
      kind,
      at,
      by: educator.name,
      note: note || null,
      ...(kind === 'out' ? {
        to: to || null
      } : null)
    });
    const applySignIn = (id, at, note) => setRoster(rs => {
      const ev = attEvent('in', at, note);
      if (rs.some(c => c.id === id)) {
        return rs.map(c => c.id === id ? {
          ...c,
          status: 'here',
          at,
          by: null,
          inAt: at,
          att: [...rdAttOf(c), ev],
          ...(c.held ? {
            state: c.held.state,
            alert: c.held.alert,
            held: undefined
          } : null)
        } : c);
      }
      const other = RD_OTHER.find(c => c.id === id);
      if (!other) return rs;
      return [...rs, {
        ...other,
        room: roomKey,
        defaultRoom: other.room,
        status: 'here',
        at,
        by: null,
        fuzzy: true,
        inAt: at,
        att: [ev]
      }];
    });
    const applySignOut = (id, at, by, note) => setRoster(rs => rs.map(c => c.id === id ? {
      ...c,
      status: 'gone',
      at,
      by,
      state: null,
      alert: null,
      held: {
        state: c.state,
        alert: c.alert
      },
      att: [...rdAttOf(c), attEvent('out', at, note, by)]
    } : c));
    const applyAbsent = (id, note, at) => setRoster(rs => rs.map(c => c.id === id ? {
      ...c,
      status: 'absent',
      state: null,
      alert: null,
      held: {
        state: c.state,
        alert: c.alert
      },
      absentNote: note || null,
      att: [...rdAttOf(c), attEvent('absent', at || RD_NOW, note)]
    } : c));
    const queue = (label, kind, childIds, at) => setPending(q => [{
      id: 'q' + q.length + '-' + kind,
      label,
      kind,
      childIds: childIds || [],
      at,
      by: educator.name
    }, ...q]);
    const queueCount = (label, kind, childIds, at) => {
      queue(label, kind, childIds, at);
      rdOutbox.items = [{
        id: `o${Date.now()}-${rdOutbox.items.length}-${kind}`,
        label,
        kind,
        childIds: childIds || [],
        at,
        by: educator.name
      }, ...rdOutbox.items];
    };
    const isPendingEvent = (c, kind) => pending.some(p => (p.kind === kind || kind === 'attendance' && !!(RD_BULK[p.kind] && RD_BULK[p.kind].attendance)) && p.childIds.includes(c.id));
    const syncTimers = React.useRef([]);
    const setConnection = next => {
      setConn(next);
      if (next === 'online' && pending.length) {
        const n = pending.length;
        setSynced(0);
        setSyncing(true);
        syncTimers.current.forEach(clearTimeout);
        syncTimers.current = [setTimeout(() => {
          setSyncing(false);
          setPending([]);
          rdOutbox.items = [];
          rdHcClearQueued();
          setHeadcounts(rdHcStore.counts);
          setSynced(n);
          showToast(`All ${n} record${n === 1 ? '' : 's'} uploaded`);
        }, 1600), setTimeout(() => setSynced(0), 8000)];
      }
    };
    useEffect(() => () => syncTimers.current.forEach(clearTimeout), []);
    useEffect(() => {
      if (!pending.length && !syncing && inc.records.some(r => r.local)) saveInc(d => ({
        ...d,
        records: d.records.map(r => r.local ? {
          ...r,
          local: false
        } : r)
      }));
    }, [pending.length, syncing]);
    useEffect(() => {
      if (props.conn && props.conn !== conn) setConnection(props.conn);
    }, [props.conn]);
    const [moved, setMoved] = useState([]);
    const RD_MOVE_TO = {
      nursery: 'possum',
      possum: 'koala',
      koala: 'kangaroo',
      kangaroo: 'koala',
      wombat: 'bilby',
      bilby: 'wombat',
      brushtail: 'koala'
    };
    const recordIds = () => [...(sheet && sheet.kind === 'bulk' ? sheet.ids : []), ...(sheet && sheet.kind === 'sign' ? [sheet.id] : []), ...(med ? [med.id] : []), ...(incident ? [incident.id] : []), ...(correct ? [correct.child.id] : []), ...(chooser ? [chooser.id] : []), ...(hcSign ? [hcSign] : [])];
    const involvedIds = () => [...recordIds(), ...(selected ? [selected.id] : [])];
    const applyChange = id => {
      const inRoster = roster.find(x => x.id === id);
      const other = inRoster ? null : RD_OTHER.find(x => x.id === id);
      const c = inRoster || other;
      const to = RD_MOVE_TO[roomKey];
      if (!c || !to) return;
      const kind = c.status === 'expected' || c.status === 'other' ? 'elsewhere' : 'moved';
      const toName = (RD_ROOMS.find(r => r.key === to) || {}).name || '';
      setRoster(rs => inRoster ? rs.map(x => x.id === id ? {
        ...x,
        room: to,
        movedFrom: x.room,
        ...(kind === 'elsewhere' ? {
          status: 'here',
          at: RD_NOW,
          by: null
        } : {})
      } : x) : [...rs, {
        ...other,
        room: to,
        defaultRoom: other.room,
        status: 'here',
        at: RD_NOW,
        by: null,
        fuzzy: true
      }]);
      setMoved(m => [...m.filter(x => x.id !== id), {
        id,
        name: c.name,
        kind,
        to,
        toName,
        at: RD_NOW
      }]);
      setSelected(cur => cur && cur.id === id ? null : cur);
      setTicked(t => {
        if (!t.has(id)) return t;
        const n = new Set(t);
        n.delete(id);
        return n;
      });
      if (!recordIds().includes(id)) showToast(`${c.name} was ${kind === 'elsewhere' ? 'signed in to' : 'moved to'} ${toName}`);
    };
    useEffect(() => {
      const onMoved = () => {
        if (conn === 'offline') {
          showToast('Offline: a change made on another device cannot reach this one');
          return;
        }
        if (scope !== 'room' || readOnly) return;
        const mine = id => roster.find(x => x.id === id && x.room === roomKey) || (roster.some(x => x.id === id) ? null : RD_OTHER.find(x => x.id === id));
        const child = involvedIds().map(mine).find(Boolean) || roster.find(x => x.room === roomKey && x.status === 'here');
        if (child) applyChange(child.id);
      };
      window.addEventListener('pg-child-moved', onMoved);
      return () => window.removeEventListener('pg-child-moved', onMoved);
    });
    const changedAuto = React.useRef(_p.get('changed') === '1');
    const recordOpen = recordIds().length > 0;
    useEffect(() => {
      if (!changedAuto.current || !recordOpen) return undefined;
      const t = setTimeout(() => {
        changedAuto.current = false;
        window.dispatchEvent(new CustomEvent('pg-child-moved'));
      }, 1200);
      return () => clearTimeout(t);
    }, [recordOpen]);
    const switchTo = (nextScope, nextRoom) => {
      setScope(nextScope);
      if (nextRoom) setRoomKey(nextRoom);
      setSelected(null);
      setSelectedRoom(null);
      setTicked(new Set());
      setSheet(null);
      setDest(null);
      setMoved([]);
      setMenuOpen(false);
      setNonce(n => n + 1);
    };
    const goRoom = key => switchTo('room', key);
    const goService = () => {
      setView('rooms');
      switchTo('service');
    };
    const pickScope = s => s === 'service' ? goService() : goRoom(roomKey);
    const scopeNotifs = RD_NOTIFS.filter(n => scope === 'service' ? true : n.scope === 'service' || n.room === roomKey).filter(rdNotifToday).map(n => n.derive === 'sleepDue' ? rdSleepNotif(n, roster, eventsByRoom, careByRoom) : n).filter(Boolean).map(n => ({
      ...n,
      unread: !notifRead.has(n.id)
    }));
    const hcNotifs = (headcounts || []).filter(h => /^hc-\d/.test(h.id) && !h.queued && (scope === 'service' || h.room === 'service' || h.room === roomKey)).map(h => ({
      id: `n-${h.id}`,
      scope: h.room === 'service' ? 'service' : 'room',
      room: h.room === 'service' ? undefined : h.room,
      kind: 'headcount',
      title: 'Head count finished',
      body: `${SERVICE.name} · ${RD_AMPM(h.at)} · ${h.by}${(h.children || []).length ? ` · ${h.children.filter(x => x.counted).length} of ${rdHcOf(h.children)} accounted for` : ''}`,
      at: h.at,
      unread: !notifRead.has(`n-${h.id}`)
    }));
    scopeNotifs.unshift(...hcNotifs);
    const notifUnread = scopeNotifs.filter(n => n.unread).length;
    const careOverride = careByRoom[roomKey];
    const roomForEvents = RD_ROOMS.find(r => r.key === roomKey) || RD_ROOMS[0];
    const roomEvents = rdGateEvents(eventsByRoom[roomKey] || rdEventsDefault(careOverride || roomForEvents.care, roomForEvents.sleepTrack));
    const rowDetail = rowDetailByRoom[roomKey] || RD_ROW_DETAIL_DEFAULT;
    const roomMaps = {
      careByRoom,
      eventsByRoom,
      future: readOnly === 'future'
    };
    const dayRoster = readOnly === 'future' ? rdFutureRoster(roster, dateDay) : roster;
    const taggedRoster = rdWithChildTags(dayRoster, childGroups);
    const emRoster = readOnly === 'future' ? rdWithChildTags(roster, childGroups) : taggedRoster;
    const groupingTagged = grouping === RD_TAG_GROUPING && !taggedRoster.some(c => c.childTag && (scope === 'service' || c.room === roomKey)) ? 'attendance' : grouping;
    const groupingNow = !svcOn('attendance') && groupingTagged === 'attendance' ? RD_UNGROUPED : groupingTagged;
    const d = buildDashboard({
      roster: taggedRoster,
      scope,
      roomKey,
      calm,
      showStaff,
      grouping: rdGroupingFor(groupingNow, scope === 'room' && !readOnly ? roomEvents : null),
      setGrouping,
      sortKey,
      setSortKey,
      query,
      setQuery,
      view,
      setView,
      selected,
      selectedRoom,
      openChild,
      openRoom,
      goRoom,
      ticked,
      toggleTick,
      selectIds,
      unselectIds,
      clearSelection,
      openBulk,
      openHeadcount,
      openDue: () => setDueOpen(true),
      longPressChild,
      facets,
      setFacets,
      showSelectedOnly,
      setShowSelectedOnly,
      selectRule,
      dueList,
      fresh: freshCtx,
      conn,
      pending,
      syncing,
      synced,
      isPendingEvent,
      openPending: () => setPendingOpen(true),
      openChooser,
      openIncident,
      openSign,
      openCorrect,
      openRecord,
      openProfile,
      educator,
      openEducator: () => {
        if (emRunning) setEducatorNoPin(true);
        setEducatorOpen(true);
      },
      careOverride,
      rowDetail,
      roomEvents,
      roomMaps,
      selectArm,
      notifUnread,
      openNotifs: () => setNotifsOpen(true),
      openSettings: () => setSettingsOpen(true),
      readOnly,
      date: {
        index: dateIndex,
        label: dateDay.label,
        readOnly,
        canOlder: dateIndex < RD_DATE_MAX,
        canNewer: dateIndex > RD_DATE_MIN,
        older: () => setDateIndex(i => Math.min(RD_DATE_MAX, i + 1)),
        newer: () => setDateIndex(i => Math.max(RD_DATE_MIN, i - 1)),
        toToday: () => setDateIndex(0),
        openCalendar: () => setCalOpen(true)
      }
    });
    Object.assign(d, rdOpenGroups(d, {
      listKey: `${scope === 'service' ? 'service' : roomKey}|${groupingNow}`,
      grouping: groupingNow,
      openGroups,
      setOpenGroups,
      narrow: query.trim() || rdFacetChips(facets).length || showSelectedOnly ? JSON.stringify([query.trim().toLowerCase(), facets, showSelectedOnly]) : ''
    }));
    d.canTagOne = scope === 'room' && !readOnly && can('childGroups', 'room') && !rdOffBlocked('childGroups', conn);
    d.canTag = d.canTagOne && !!d.tickedCount;
    d.openTagSheet = () => setSheet({
      kind: 'tag',
      ids: [...ticked]
    });
    d.openTagOne = c => setSheet({
      kind: 'tag',
      ids: [c.id],
      one: true
    });
    d.emergency = {
      door: emDoor !== 'menu',
      running: emRunning,
      label: emRunning ? rdKindTitle(emRun) : '',
      open: openEmergency
    };
    const emStrip = emRunning && emView !== 'run' ? React.createElement(RdEmStrip, {
      run: emRun,
      roll: rdEmCounts(emRun, emRoster, RD_STAFF, emVisitors),
      onReturn: () => setEmView('run')
    }) : null;
    useEffect(() => {
      if (!_count) return;
      if (_count === 'picker') setEmView('picker');else if (_count === 'routine') setSheet({
        kind: 'headcount'
      });else {
        if (!rdEmStore.run) rdEmStart(_count, scope === 'service' ? 'all' : roomKey);
        setEmView('run');
      }
    }, []);
    if (!rdAttOn('fuzzySignIn')) d.other = [];
    const roomList = RD_ROOMS.map(r => roomStats(r, dayRoster, roomMaps));
    const screen = React.createElement(SplitShell, {
      d: d,
      isIpad: isIpad,
      arrangement: arrangement,
      onMenu: () => setMenuOpen(true),
      rooms: roomList,
      onPickRoom: goRoom,
      onPickService: goService,
      strip: emStrip
    });
    const pillToggle = (opts, current, on, label) => React.createElement("div", {
      className: "rail-toggle"
    }, React.createElement(RdSegmented, {
      options: opts,
      value: current,
      onChange: on,
      size: "md",
      ariaLabel: label
    }));
    const scopeCard = s => React.createElement("div", {
      key: s.key,
      className: "ds-card ds-card--selectable ds-card--compact",
      role: "radio",
      "aria-checked": scope === s.key,
      tabIndex: scope === s.key ? 0 : -1,
      onClick: () => pickScope(s.key)
    }, React.createElement("div", {
      className: "ds-title-block"
    }, React.createElement("div", {
      className: "ds-title-block__content"
    }, React.createElement("p", {
      className: "ds-title-block__title ds-title-block__title--medium"
    }, s.label))), React.createElement("span", {
      className: "ds-card__trailing"
    }, React.createElement("span", {
      className: 'ds-radio ' + (scope === s.key ? 'ds-radio--selected' : 'ds-radio--unchecked'),
      "aria-hidden": "true"
    }, React.createElement("svg", {
      className: "ds-radio__svg",
      viewBox: "0 0 20 20",
      fill: "none"
    }, React.createElement("circle", {
      className: "ds-radio__ring",
      cx: "10",
      cy: "10",
      r: "8",
      strokeWidth: "2"
    }), React.createElement("circle", {
      className: "ds-radio__dot",
      cx: "10",
      cy: "10",
      r: "4.5"
    })))));
    const askChange = (() => {
      const involved = recordIds();
      const list = moved.filter(x => involved.includes(x.id));
      return list.length ? {
        list,
        back: scope === 'service' ? 'Back to all rooms' : `Back to ${roomForEvents.name}`
      } : null;
    })();
    return React.createElement(RdChangedCtx.Provider, {
      value: askChange
    }, React.createElement("div", {
      key: `${scope}-${roomKey}-${nonce}`,
      className: "screen-rise screen-fill"
    }, screen), menuOpen && React.createElement(RdDrawer, {
      scope: scope,
      roomKey: roomKey,
      rooms: roomList,
      educator: educator,
      onClose: () => setMenuOpen(false),
      onRoom: goRoom,
      onService: goService,
      acts: drawerActs,
      emergencyRow: emDoor !== 'header'
    }), dest && React.createElement(RdDestination, {
      dest: dest,
      backLabel: scope === 'service' ? 'Back to all rooms' : `Back to ${roomForEvents.name}`,
      onBack: () => {
        setDest(null);
        setLaunchReq(null);
      },
      covered: !!incident,
      ctx: {
        phone: !isIpad,
        educator,
        educators,
        conn,
        flaky,
        roomKey,
        showToast,
        onActingAs: () => setEducatorOpen(true),
        launch: launchReq,
        roster,
        inc,
        saveInc,
        others: educators.filter(e => e.name !== educator.name),
        offline: conn === 'offline',
        openDraft: id => {
          const c = roster.find(x => x.id === id);
          if (c) {
            setChooser(null);
            setIncident(c);
          }
        }
      }
    }), sheet && sheet.kind === 'bulk' && React.createElement(RdBulkSheet, {
      eventKey: sheet.event,
      phone: !isIpad,
      z: sheet.fromProfile ? 44 : 40,
      people: sheet.ids.map(id => roster.find(c => c.id === id) || (RD_BULK[sheet.event].attendance === 'in' ? RD_OTHER.find(c => c.id === id) : null)).filter(Boolean),
      offline: conn === 'offline',
      flaky: flaky,
      educator: educator,
      sleepTrack: roomEvents && roomEvents.sleepTrack || 'Sleep',
      onProfile: c => openProfile(c),
      covered: !!profile,
      onLeft: names => showToast(`Not saved: ${names.join(', ')}`),
      onClose: () => setSheet(null),
      onCommit: (okIds, at, opts, details) => {
        if (askChange && askChange.list.some(m => okIds.includes(m.id))) return;
        const ev = sheet.event;
        const one = okIds.length === 1 ? roster.find(c => c.id === okIds[0]) : null;
        const who = one ? one.name : `${okIds.length} children`;
        const beforeP = pending;
        const att = RD_BULK[ev].attendance;
        if (att) {
          okIds.forEach(id => {
            const d0 = details && details[id] || {};
            const t = d0.at || at || RD_NOW;
            if (att === 'in') applySignIn(id, t, d0.note || null);else if (att === 'out') applySignOut(id, t, d0.detail || null, d0.note || null);else applyAbsent(id, d0.note || null, t);
          });
        } else {
          applyEvent(okIds, ev, at || RD_NOW, details);
        }
        afterLog();
        const ctxs = okIds.map(id => (details && details[id] || {}).context);
        const evLabel = ev === 'meal' && ctxs.every(x => x === rdSlotLabel('bottle')) ? 'Bottle' : rdEventTitle(ev, ctxs.every(x => x === ctxs[0]) ? ctxs[0] : null) || RD_BULK[ev].label;
        if (conn === 'offline') queue(`${evLabel} · ${who}`, ev, okIds, at || RD_NOW);
        if (!(opts && opts.silent)) {
          const undo = att ? undefined : () => {
            applyDelete(okIds, ev, 'undo');
            setPending(beforeP);
            showToast('Change undone · kept on the audit trail');
          };
          showToast(conn === 'offline' ? `Saved on this device · ${who}` : att ? `${RD_BULK[ev].verb} · ${who}` : `${evLabel} logged for ${who}`, undo);
        }
      }
    }), sheet && sheet.kind === 'sign' && (() => {
      const c = roster.find(x => x.id === sheet.id) || RD_OTHER.find(x => x.id === sheet.id);
      if (!c) return null;
      return React.createElement(RdSignSheet, {
        child: c,
        direction: sheet.direction,
        offline: conn === 'offline',
        phone: !isIpad,
        educator: educator,
        z: sheet.fromProfile ? 44 : 40,
        onClose: () => setSheet(null),
        onConfirm: (at, who, note) => {
          if (askChange) return;
          setSheet(null);
          const inbound = sheet.direction === 'in';
          if (inbound) applySignIn(c.id, at, note);else applySignOut(c.id, at, who, note);
          const label = `${inbound ? 'Signed in' : 'Signed out'} · ${c.name}${inbound || !who ? '' : ` · ${who}`} · ${at}`;
          if (conn === 'offline') {
            queue(label, 'attendance', [c.id], at);
            showToast(`Saved on this device · ${c.name.split(' ')[0]}`);
          } else {
            const opt = who ? rdCollectOptions(c).find(o => (Array.isArray(o) ? o[0] : o) === who) : null;
            showToast(`${c.name.split(' ')[0]} signed ${inbound ? 'in' : 'out'}${!inbound && who ? ` to ${Array.isArray(opt) ? opt[1] : who}` : ''} · ${at}`);
          }
        }
      });
    })(), sheet && sheet.kind === 'tag' && (() => {
      const people = sheet.ids.map(id => taggedRoster.find(c => c.id === id)).filter(Boolean);
      const ids = people.map(p => p.id);
      const who = ids.length === 1 ? people[0].name.split(' ')[0] : `${ids.length} children`;
      const groups = [...childGroups].sort((a, b) => a.name.localeCompare(b.name)).map(g => ({
        ...g,
        count: g.childIds.length
      }));
      const commit = (next, msg, queueLabel) => {
        const before = {
          groups: childGroups,
          pend: pending
        };
        setChildGroups(next);
        setSheet(null);
        if (!sheet.one) afterLog();
        if (conn === 'offline') queue(queueLabel, 'tag', ids, RD_NOW);
        showToast(conn === 'offline' ? `Saved on this device · ${msg}` : msg, () => {
          setChildGroups(before.groups);
          setPending(before.pend);
          showToast('Change undone');
        });
      };
      return React.createElement(RdTagSheet, {
        people: people,
        groups: groups,
        roomName: d.identity.title,
        phone: !isIpad,
        offline: conn === 'offline',
        onClose: () => setSheet(null),
        onAdd: target => {
          const g = target.id ? target : {
            id: `grp-${Date.now()}`,
            name: target.name,
            shortName: rdGroupShortName(target.name),
            childIds: []
          };
          const base = target.id ? childGroups : [...childGroups, {
            id: g.id,
            name: g.name,
            shortName: g.shortName,
            childIds: []
          }];
          commit(rdGroupsMove(base, ids, g.id), `${who} added to ${g.name}`, `Tag · ${g.name} · ${who}`);
        },
        onRemove: () => {
          const from = [...new Set(people.filter(p => p.childTag).map(p => p.childTag.name))];
          commit(rdGroupsMove(childGroups, ids, null), `${who} removed from ${from.length === 1 ? from[0] : 'their tags'}`, `Tag · removed from ${from.join(', ')} · ${who}`);
        },
        onDelete: g => commit(childGroups.filter(x => x.id !== g.id), `${g.name} deleted`, `Tag · deleted ${g.name}`)
      });
    })(), sheet && sheet.kind === 'headcount' && (() => {
      const hcCount = sheet.countId ? headcounts.find(h => h.id === sheet.countId) : null;
      return React.createElement(RdHeadcountSheet, {
        key: sheet.countId || 'new',
        roster: countRoster(taggedRoster),
        rooms: rdCountRooms(scope === 'service' ? null : roomKey),
        startView: scope === 'service' ? 'all' : roomKey,
        grouping: groupingNow,
        count: hcCount,
        history: headcounts.map(rdHcView),
        acting: educator.name,
        educator: educator,
        conn: conn,
        phone: !isIpad,
        covered: hcSign != null || educatorOpen || !!peek || !!emView || !!pinGate,
        onSignIn: openHcSign,
        onOpenCount: openCount,
        openOnCounts: !!sheet.openCounts,
        fromCounts: !!sheet.fromCounts,
        onBackToCounts: () => setSheet({
          kind: 'headcount',
          openCounts: true
        }),
        onOpenEducator: () => {
          setEducatorNoPin(false);
          setEducatorOpen(true);
        },
        onContacts: setPeek,
        onEmergency: openEmergency,
        emergencyRunning: emRunning,
        onClose: () => setSheet(null),
        onRecord: rec => hcCount ? updateCount(hcCount, rec) : recordCount(rec)
      });
    })(), emView === 'picker' && React.createElement(RdCountPicker, {
      phone: !isIpad,
      onPick: startEmergency,
      onClose: () => setEmView(null),
      onRoutine: rdHcOn('headcount') && !readOnly ? () => {
        setEmView(null);
        if (!sheet) openHeadcount();
      } : undefined
    }), emView === 'run' && emRun && React.createElement(RdEmergencySheet, {
      run: emRun,
      roster: countRoster(emRoster),
      rooms: rdCountRooms(emRun.scope === 'all' ? null : emRun.scope),
      staff: RD_STAFF,
      visitors: emVisitors,
      grouping: groupingNow,
      educator: educator,
      conn: conn,
      phone: !isIpad,
      covered: !!emSign || educatorOpen || !!pinGate || !!peek,
      onContacts: setPeek,
      onSign: requestAttendance,
      onPin: then => setPinGate({
        then
      }),
      onOpenEducator: () => {
        setEducatorNoPin(true);
        setEducatorOpen(true);
      },
      onBack: () => setEmView(null),
      onSubmit: submitEmergency,
      onCancel: emCancel
    }), hcSign != null && sheet && sheet.kind === 'headcount' && (() => {
      const c = roster.find(x => x.id === hcSign.id);
      if (!c) return null;
      const finish = ok => {
        setHcSign(null);
        if (hcSign.done) hcSign.done(ok);
      };
      return React.createElement(RdSignSheet, {
        child: c,
        direction: "in",
        offline: conn === 'offline',
        phone: !isIpad,
        educator: educator,
        onClose: () => finish(false),
        onConfirm: (at, _who, note) => {
          if (askChange) return;
          applySignIn(c.id, at, note);
          if (conn === 'offline') {
            queue(`Signed in · ${c.name} · ${at}`, 'attendance', [c.id], at);
            showToast(`Saved on this device · ${c.name.split(' ')[0]}`);
          } else showToast(`${c.name.split(' ')[0]} signed in · ${at}`);
          finish(true);
        }
      });
    })(), peek && (() => {
      const live = peek.kind && peek.kind !== 'child' ? null : roster.find(x => x.id === peek.id);
      const person = live ? {
        ...peek,
        status: live.status
      } : peek;
      const inEm = emView === 'run' && !!emRun;
      return React.createElement(RdCountContacts, {
        person: person,
        conn: conn,
        phone: !isIpad,
        emergency: inEm,
        note: inEm ? emRun.notes[peek.rkey] || '' : undefined,
        onNote: inEm ? v => {
          emRun.notes[peek.rkey] = v;
          setEmTick(n => n + 1);
        } : undefined,
        onSign: inEm ? requestAttendance : undefined,
        onClose: () => setPeek(null)
      });
    })(), emSign != null && (() => {
      const c = roster.find(x => x.id === emSign.id);
      if (!c) return null;
      return React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: 46
        }
      }, React.createElement(RdSignSheet, {
        child: c,
        direction: emSign.direction,
        offline: conn === 'offline',
        phone: !isIpad,
        educator: educator,
        onClose: () => setEmSign(null),
        onConfirm: (at, who, note) => {
          if (askChange) return;
          const inbound = emSign.direction === 'in';
          setEmSign(null);
          if (inbound) applySignIn(c.id, at, note);else applySignOut(c.id, at, who, note);
          const label = `${inbound ? 'Signed in' : 'Signed out'} · ${c.name}${inbound || !who ? '' : ` · ${who}`} · ${at}`;
          if (conn === 'offline') {
            queue(label, 'attendance', [c.id], at);
            showToast(`Saved on this device · ${c.name.split(' ')[0]}`);
          } else showToast(`${c.name.split(' ')[0]} signed ${inbound ? 'in' : 'out'} · ${at}`);
        }
      }));
    })(), toast && React.createElement("div", {
      className: "rd-toast",
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 22,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }
    }, React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: toast.undo ? '8px 8px 8px 18px' : '12px 18px',
        borderRadius: 'var(--sd-radius-full)',
        background: 'var(--sd-colour-surface-inverse)',
        color: 'var(--sd-colour-text-inverse)',
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 8px 24px rgba(0,40,34,0.3)',
        pointerEvents: 'auto'
      }
    }, React.createElement(SdIcon, {
      name: "tick",
      size: 17
    }), toast.msg, toast.undo && React.createElement("button", {
      type: "button",
      onClick: () => {
        const undo = toast.undo;
        setToast(null);
        undo();
      },
      style: {
        all: 'unset',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginLeft: 4,
        padding: '6px 14px',
        borderRadius: 'var(--sd-radius-full)',
        background: 'rgba(255,255,255,0.16)',
        color: 'var(--sd-colour-text-inverse)',
        fontSize: 13.5,
        fontWeight: 700
      }
    }, React.createElement(SdIcon, {
      name: "reply",
      size: 15
    }), "Undo"))), chooser && React.createElement(RdEventChooser, {
      child: chooser,
      roomEvents: roomEvents,
      phone: !isIpad,
      onClose: () => setChooser(null),
      onPick: k => {
        const c = chooser;
        setChooser(null);
        if (k === 'incident') {
          setIncident(c);
          return;
        }
        if (k === 'learning') {
          rdLearning.start([c.id]);
          return;
        }
        openBulk(k, [c.id]);
      }
    }), incident && React.createElement(RdIncidentSheet, {
      key: incident.id,
      child: incident,
      offline: conn === 'offline',
      phone: !isIpad,
      educator: educator,
      others: educators.filter(e => e.name !== educator.name),
      draft: inc.drafts[incident.id],
      onDismiss: (dr, info) => {
        saveInc(d => ({
          ...d,
          drafts: {
            ...d.drafts,
            [incident.id]: dr
          }
        }));
        setIncident(null);
        const ch = askChange && askChange.list.find(m => m.id === incident.id);
        showToast(ch ? `Draft kept — finish it in ${ch.toName}` : `Draft saved${info && info.lostSignatures ? ' · the signatures were not kept' : dest ? '' : ' · find it in Incident records'}`);
      },
      onClose: () => setIncident(null),
      onDiscard: () => {
        const id = incident.id;
        saveInc(d => {
          const n = {
            ...d.drafts
          };
          delete n[id];
          return {
            ...d,
            drafts: n
          };
        });
        setIncident(null);
        showToast('Draft discarded');
      },
      onConfirm: r => {
        if (askChange) return;
        const c = incident;
        const offline = conn === 'offline';
        saveInc(d => {
          const n = {
            ...d.drafts
          };
          delete n[c.id];
          return {
            records: [{
              ...r,
              local: offline
            }, ...d.records],
            drafts: n
          };
        });
        setRoster(rs => rs.map(x => x.id === c.id ? {
          ...x,
          incidents: [{
            on: r.on,
            at: r.at,
            by: r.by
          }, ...(x.incidents || [])]
        } : x));
        setIncident(null);
        afterLog();
        const label = `Incident record · ${rdIncNatureText(r, 2)} · ${c.name} · happened ${rdIncWhen(r)}, entered ${RD_AMPM(r.enteredAt)}`;
        if (offline) {
          queue(label, 'incident', [c.id], r.at);
          showToast('Saved on this device · incident record');
        } else {
          showToast(r.sigs.parent ? 'Incident record saved and signed' : 'Incident record saved · waiting for the family’s signature');
        }
      }
    }), (educatorOpen || pinGate) && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 47
      }
    }, React.createElement(RdEducatorSheet, {
      educators: educators,
      current: educator,
      serviceName: SERVICE.name,
      confirm: pinGate ? educator : null,
      freeHandoff: !pinGate && educatorNoPin,
      reason: pinGate ? 'enter your PIN to record this' : undefined,
      onClose: () => {
        if (pinGate && pinGate.cancel) pinGate.cancel();
        setEducatorOpen(false);
        setPinGate(null);
        setEducatorNoPin(false);
      },
      onLogout: props.onSignOut ? () => {
        if (emRunning) {
          emRefuse();
          return;
        }
        setEducatorOpen(false);
        props.onSignOut();
      } : undefined,
      onPick: e => {
        if (pinGate) {
          const g = pinGate;
          setPinGate(null);
          if (emRun) emRun.pinFor = e.name;
          g.then();
          return;
        }
        setEducator(e);
        setEducatorOpen(false);
        if (educatorNoPin && emRun && e.name !== educator.name) {
          emRun.pinFor = null;
          emRun.changedActor = true;
        }
        setEducatorNoPin(false);
        if (e.name !== educator.name) showToast(`Now recording as ${e.name}`);
      }
    })), med && React.createElement(RdMedicationSheet, {
      child: med,
      offline: conn === 'offline',
      phone: !isIpad,
      educator: educator,
      roleHint: signerRoles[educator.name] || '',
      initialDraft: drafts['med-' + med.id],
      onDismiss: (dr, o) => {
        stashDraft('med-' + med.id, dr);
        setMed(null);
        const ch = askChange && askChange.list.find(m => m.id === med.id);
        showToast(ch ? `Draft kept — finish it in ${ch.toName}` : o && o.signed ? 'Draft kept — it will need signing again' : 'Draft kept — reopen to resume');
      },
      onClose: () => {
        clearDraft('med-' + med.id);
        setMed(null);
      },
      onSignIn: () => {
        const c = med;
        setMed(null);
        openSign(c, 'in');
      },
      onIncident: () => {
        const c = med;
        setMed(null);
        openIncident(c);
      },
      onConfirm: ({
        med: rec,
        note
      }) => {
        if (askChange) return;
        const c = med;
        const first = c.name.split(' ')[0];
        clearDraft('med-' + c.id);
        setMed(null);
        afterLog();
        setSignerRoles(m => ({
          ...m,
          [educator.name]: rec.admin.role
        }));
        applyEvent([c.id], 'med', rec.at, {
          [c.id]: {
            detail: rdMedLine(rec),
            note,
            med: rec
          }
        });
        const label = `${rdMedLine(rec)} · ${c.name} · signed by ${rec.admin.name}, witnessed by ${rec.witness.name}${rec.flags.length ? ` · ${rec.flags.join(', ').toLowerCase()}` : ''}`;
        if (conn === 'offline') showToast(`Saved on this device · ${first}`);else showToast(rec.flags.length ? `Recorded · flagged for follow-up · ${first}` : `${rec.outcome === 'Given' ? 'Dose given' : rec.outcome}${rec.on ? ` for ${rec.on === 1 ? 'yesterday' : rdShortDate(rdAddDays(RD_TODAY, -rec.on))}` : ''} · ${first}`);
        if (conn === 'offline') queue(label, 'med', [c.id], rec.at);
      }
    }), record && (() => {
      const c = roster.find(x => x.id === record.childId) || RD_OTHER.find(x => x.id === record.childId);
      const snap = record.snap || null;
      const entry = snap || (c ? record.doseId ? rdDoseEntry(c, record.doseId) : rdLastOf(c, record.kind) : null);
      if (!c || !entry) return null;
      const mine = snap && !snap.why ? rdChange(snap.kind, snap.by, educator, {
        away: scope !== 'room'
      }) : null;
      const can = snap ? {
        amend: false,
        del: false,
        why: snap.why || mine && mine.why || null,
        offline: false
      } : rdChange(entry.kind, entry.by, educator, {
        past: !!readOnly || !!(entry.med && entry.med.on > 0),
        offline: rdOffBlocked('amendEvent', conn),
        away: scope !== 'room',
        signed: !!(entry.med && entry.med.signed)
      });
      const title = snap && snap.title ? snap.title : entry.kind === 'sleep' ? rdEventTitle('sleep', entry.context) : RD_LOG_TITLE[entry.kind] || 'Note';
      return React.createElement(RdRecordSheet, {
        child: c,
        entry: entry,
        title: title,
        can: can,
        phone: !isIpad,
        amended: !snap && (c.corrected || []).includes(entry.kind),
        pending: !snap && isPendingEvent(c, entry.kind),
        past: !!readOnly || !!(snap && snap.past),
        onClose: () => setRecord(null),
        onAmend: () => {
          setRecord(null);
          openCorrect(c, {
            ...entry,
            title,
            from: 'record',
            detail: entry.kind === 'meal' && entry.rec && entry.rec.meal ? entry.context : entry.detail
          });
        },
        onDelete: () => {
          setRecord(null);
          applyDelete([c.id], entry.kind, undefined, entry.med ? entry.med.id : null);
          showToast('Record deleted · kept on the audit trail');
        }
      });
    })(), correct && React.createElement(RdCorrectSheet, {
      child: correct.child,
      kind: correct.kind,
      title: correct.title,
      at: correct.at,
      detail: correct.detail,
      note: correct.note,
      rec: correct.rec,
      phone: !isIpad,
      educator: educator,
      onClose: () => {
        const {
          child,
          kind,
          from
        } = correct;
        setCorrect(null);
        if (from === 'record') setRecord({
          childId: child.id,
          kind
        });
      },
      onConfirm: next => {
        if (askChange) return;
        const {
          child,
          kind
        } = correct;
        setCorrect(null);
        applyCorrection(child.id, kind, next);
        showToast(`${correct.title || RD_EVENT_LABEL[kind] || RD_LOG_TITLE[kind] || 'Note'} amended`);
      }
    }), notifsOpen && React.createElement(RdNotificationsSheet, {
      notifs: scopeNotifs,
      phone: !isIpad,
      hideRead: notifHideRead,
      onHideRead: setNotifHideRead,
      onMarkAll: () => setNotifRead(s => new Set([...s, ...scopeNotifs.map(n => n.id)])),
      onOpen: n => {
        setNotifRead(r => new Set([...r, n.id]));
        const t = n.target;
        if (!t) return;
        if (t.kind === 'child') {
          const c = roster.find(x => x.name === t.name);
          if (!c) {
            showToast('That child is no longer on the list');
            return;
          }
          setNotifsOpen(false);
          if (scope !== 'room' || c.room !== roomKey) goRoom(c.room);
          setSelected(c);
        } else if (t.kind === 'due') {
          setNotifsOpen(false);
          if (scope !== 'room' || n.room !== roomKey) goRoom(n.room);
          setDueOpen(true);
        }
      },
      onClose: () => setNotifsOpen(false)
    }), settingsOpen && scope === 'room' && (() => {
      const room = RD_ROOMS.find(r => r.key === roomKey) || RD_ROOMS[0];
      return React.createElement(RdRoomSettingsSheet, {
        room: room,
        careKey: careByRoom[roomKey] || room.care,
        rowDetail: rowDetail,
        roomEvents: roomEvents,
        phone: !isIpad,
        onClose: () => setSettingsOpen(false),
        onSave: (careKey, detail, events) => {
          const careChanged = careKey !== (careByRoom[roomKey] || room.care);
          setCareByRoom(m => ({
            ...m,
            [roomKey]: careKey
          }));
          setRowDetailByRoom(m => ({
            ...m,
            [roomKey]: detail
          }));
          setEventsByRoom(m => ({
            ...m,
            [roomKey]: events
          }));
          setSettingsOpen(false);
          const hidden = RD_ROW_DETAIL.filter(r => !detail[r.key]).map(r => r.label.toLowerCase());
          const offEvents = RD_EVENT_TYPES.filter(e => !events[e.key]).map(e => e.label.toLowerCase());
          showToast(careChanged ? `${room.name} set to ${RD_CARE[careKey].label}${offEvents.length ? ` · no ${offEvents.join(', ')}` : ''}` : offEvents.length ? `${room.name} doesn’t do ${offEvents.join(', ')}` : hidden.length ? `Rows now hide ${hidden.join(' and ')}` : 'Rows show everything');
        }
      });
    })(), profile && (() => {
      const c = dayRoster.find(x => x.id === profile.id) || roster.find(x => x.id === profile.id) || RD_OTHER.find(x => x.id === profile.id) || profile;
      return React.createElement(RdProfileSheet, {
        child: c,
        readOnly: readOnly,
        split: isIpad,
        offline: conn === 'offline',
        onOpenRecord: entry => openRecord(c, entry),
        covered: !!record || !!correct || !!(sheet && sheet.fromProfile),
        onSign: d.canAttend ? dir => {
          openSign(c, dir);
          setSheet(sh => sh ? {
            ...sh,
            fromProfile: true
          } : sh);
        } : undefined,
        onAbsent: d.canAttend && rdAttOn('absence') ? () => {
          openBulk('absent', [c.id]);
          setSheet(sh => sh ? {
            ...sh,
            fromProfile: true
          } : sh);
        } : undefined,
        pendingAtt: isPendingEvent(c, 'attendance'),
        onClose: () => setProfile(null)
      });
    })(), calOpen && React.createElement(RdCalendarPopover, {
      value: dateIndex,
      onPick: setDateIndex,
      onClose: () => setCalOpen(false)
    }), pendingOpen && React.createElement(RdPendingSheet, {
      conn: conn,
      pending: pending,
      syncing: syncing,
      synced: synced,
      onClose: () => setPendingOpen(false)
    }), dueOpen && React.createElement(RdDueSheet, {
      d: d,
      onClose: () => setDueOpen(false)
    }), splash && React.createElement(Splash, {
      key: `splash-${splashId}`,
      label: splash,
      onDone: () => setSplash(false)
    }));
  }
  RD_FEATURES.childGroups = {
    label: 'Tag children',
    room: true,
    service: false,
    offline: 'queue'
  };
  const RD_CHILD_GROUP_DEFS = [{
    id: 'grp-hall',
    name: 'Hall',
    shortName: 'Hall'
  }, {
    id: 'grp-indoor',
    name: 'Indoor room',
    shortName: 'Indoor'
  }, {
    id: 'grp-excursion',
    name: 'Excursion',
    shortName: 'Excursion'
  }];
  const RD_CHILD_GROUP_DEAL = ['grp-hall', 'grp-indoor', 'grp-hall', 'grp-excursion', 'grp-indoor', 'grp-hall', 'grp-excursion', 'grp-indoor', 'grp-hall', 'grp-excursion', 'grp-indoor', 'grp-hall'];
  function rdChildGroupSeed() {
    const kids = RD_ALL_CHILDREN.filter(c => c.room === 'bilby' && c.status === 'here');
    return RD_CHILD_GROUP_DEFS.map(g => ({
      ...g,
      childIds: kids.filter((c, i) => RD_CHILD_GROUP_DEAL[i % RD_CHILD_GROUP_DEAL.length] === g.id).map(c => c.id)
    }));
  }
  const rdGroupShortName = name => name.length <= 12 ? name : name.split(/\s+/)[0].slice(0, 12);
  function rdWithChildTags(list, groups) {
    const byChild = new Map();
    [...groups].sort((a, b) => a.name.localeCompare(b.name)).forEach(g => {
      const tag = {
        id: g.id,
        name: g.name,
        shortName: g.shortName || g.name
      };
      g.childIds.forEach(id => {
        if (!byChild.has(id)) byChild.set(id, tag);
      });
    });
    if (!byChild.size) return list;
    return list.map(c => byChild.has(c.id) ? {
      ...c,
      childTag: byChild.get(c.id)
    } : c);
  }
  const rdGroupsMove = (groups, ids, targetId) => groups.map(g => {
    const rest = g.childIds.filter(id => !ids.includes(id));
    if (g.id === targetId) return {
      ...g,
      childIds: [...rest, ...ids]
    };
    return rest.length === g.childIds.length ? g : {
      ...g,
      childIds: rest
    };
  });
  function RdTagChip({
    tag
  }) {
    return React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--grey ds-pill--ghost",
      title: `Tag: ${tag.name}`,
      style: {
        flexShrink: 0
      }
    }, tag.shortName || tag.name);
  }
  function RdTextAction({
    children,
    onClick,
    ariaLabel,
    danger,
    id,
    color
  }) {
    return React.createElement("button", {
      type: "button",
      id: id,
      onClick: onClick,
      "aria-label": ariaLabel,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        height: 44,
        padding: '0 8px',
        margin: '-14px -8px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        fontSize: 13,
        fontWeight: 700,
        color: color || (danger ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-action-primary)')
      }
    }, children);
  }
  function RdTagSheet({
    people,
    groups,
    roomName,
    phone,
    offline,
    onClose,
    onAdd,
    onRemove,
    onDelete
  }) {
    const NEW = '__new';
    const NONE = '__none';
    const [pickKey, setPickKey] = useState(groups.length ? null : NEW);
    const [name, setName] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    useEffect(() => {
      setConfirmDelete(false);
    }, [pickKey]);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const n = people.length;
    const who = n === 1 ? people[0].name.split(' ')[0] : `${n}`;
    const tagged = people.filter(p => p.childTag);
    const picked = groups.find(g => g.id === pickKey) || null;
    const typed = name.trim();
    const same = pickKey === NEW && typed ? groups.find(g => g.name.toLowerCase() === typed.toLowerCase()) : null;
    const target = pickKey === NEW ? same || (typed ? {
      id: null,
      name: typed
    } : null) : picked;
    const moving = target ? people.filter(p => p.childTag && p.childTag.id !== target.id).length : 0;
    const already = target && target.id ? people.filter(p => p.childTag && p.childTag.id === target.id).length : 0;
    const ready = pickKey === NONE ? !!tagged.length : !!target && already < n;
    const fromNames = [...new Set(tagged.map(p => p.childTag.name))];
    const options = [...groups.map(g => [g.id, `${g.name} · ${g.count}`]), [NEW, 'New tag…'], ...(tagged.length ? [[NONE, 'No tag']] : [])];
    const sub = 'var(--sd-colour-text-secondary)';
    const title = n === 1 && tagged.length ? 'Change tag' : 'Add to tag';
    const primaryLabel = pickKey === NONE ? `Remove ${tagged.length === n ? who : tagged.length} from ${fromNames.length === 1 ? fromNames[0] : 'their tags'}` : !target ? pickKey === NEW ? 'Name the tag' : 'Pick a tag' : already === n ? `Already in ${target.name}` : `Add ${who} to ${target.name}`;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,40,34,0.45)'
      }
    }), React.createElement("div", {
      className: "rd-sheet",
      role: "dialog",
      "aria-label": title,
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 16px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(SdIcon, {
      name: "tag",
      size: 20
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, title), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: sub
      }
    }, n === 1 ? people[0].name : `${n} selected`, " \xB7 ", roomName)), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: sub
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, React.createElement(RdLabel, null, "Tags"), React.createElement(RdChoiceChips, {
      options: options,
      value: pickKey,
      onChange: setPickKey,
      ariaLabel: "Which tag"
    }), pickKey === NEW && React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: name,
      autoFocus: true,
      maxLength: 24,
      onChange: e => setName(e.target.value),
      placeholder: "Name it \u2014 a space or an activity, like Gym or Bus 2",
      "aria-label": "New tag name",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width: '100%',
        height: 44,
        padding: '0 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 14.5
      }
    }), same && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: sub
      }
    }, same.name, " already exists \u2014 they\u2019ll join it."), !!moving && pickKey !== NONE && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, "A child has one tag at a time \u2014 ", moving === 1 ? n === 1 ? `${who} moves` : '1 child moves' : `${moving} children move`, " from ", moving === 1 && n === 1 ? people[0].childTag.name : 'their current tag', "."), picked && !confirmDelete && React.createElement("span", {
      style: {
        display: 'flex',
        paddingTop: 6
      }
    }, React.createElement(RdTextAction, {
      onClick: () => setConfirmDelete(true)
    }, "Delete ", picked.name, "\u2026")), picked && confirmDelete && React.createElement("div", {
      role: "alertdialog",
      "aria-label": `Delete ${picked.name}`,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700
      }
    }, "Delete ", picked.name, " for the whole service?"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, picked.count === 1 ? 'The 1 child with it loses' : `The ${picked.count} children with it lose`, " the tag. Nothing else on their record changes."), React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap'
      }
    }, React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--destructive ds-btn--sm",
      onClick: () => onDelete(picked)
    }, "Delete tag"), React.createElement(RdTextAction, {
      onClick: () => setConfirmDelete(false)
    }, "Keep it")))), React.createElement(RdSheetFoot, {
      phone: phone,
      note: React.createElement(React.Fragment, null, "Tags stay until you remove them, and they\u2019re shared across the service.", offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: 'tick',
      muted: !ready || confirmDelete,
      onClick: ready && !confirmDelete ? () => pickKey === NONE ? onRemove() : onAdd(target) : undefined
    }, primaryLabel))));
  }
  const RD_HC_FALLBACK = [RD_TAG_GROUPING, 'age', 'school', 'grade'];
  const RD_HC_COLLAPSE_AT = 40;
  const RD_HC_WORD = {
    room: 'room',
    [RD_TAG_GROUPING]: 'tag',
    age: 'age',
    school: 'school',
    grade: 'grade',
    kinder: 'kinder program',
    sleep: 'sleep / rest'
  };
  const RD_HC_NONE = {
    key: null,
    word: null,
    groups: []
  };
  function rdHcTry(people, k) {
    const byRoom = () => [...new Set(people.map(p => p.room).filter(Boolean))].map(r => ({
      key: `room-${r}`,
      label: r,
      items: people.filter(p => p.room === r)
    }));
    const groups = (k === 'room' ? byRoom() : rdSubGroup(people, k)).filter(g => g.label && g.items.length);
    const covered = groups.reduce((n, g) => n + g.items.length, 0) === people.length;
    return groups.length >= 2 && covered ? {
      key: k,
      word: RD_HC_WORD[k] || k,
      groups
    } : null;
  }
  function rdHcSections(people, grouping) {
    const tries = grouping === 'room' ? ['room'] : [...new Set([grouping, ...RD_HC_FALLBACK])].filter(k => k && k !== 'attendance' && k !== RD_UNGROUPED);
    for (const k of tries) {
      const r = rdHcTry(people, k);
      if (r) return r;
    }
    return RD_HC_NONE;
  }
  const rdHcLabel = o => o.key === 'room' ? 'Room' : (RD_GROUPINGS.find(g => g.key === o.key) || {}).label || o.word;
  const RdHcRow = React.memo(function RdHcRow({
    p,
    on,
    gone,
    showRoom,
    showTag,
    note,
    hint,
    onSignIn,
    links,
    contact,
    onHold,
    onToggle,
    inert
  }) {
    const lp = useLongPress(() => onHold && onHold(p));
    const tap = id => {
      if (lp.fired.current) {
        lp.fired.current = false;
        return;
      }
      onToggle(id);
    };
    const frame = {
      borderRadius: 'var(--sd-radius-lg)',
      border: '1px solid ' + (on ? 'var(--sd-colour-action-primary)' : gone ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)'),
      background: on ? 'var(--sd-colour-surface-cyan)' : gone ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-default)'
    };
    const rowStyle = {
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '9px 12px'
    };
    const hold = onHold ? lp.handlers : undefined;
    const link = (label, onClick) => React.createElement("button", {
      key: label,
      type: "button",
      onClick: onClick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        fontWeight: 700,
        color: gone ? 'var(--sd-colour-text-on-red)' : 'var(--sd-colour-action-primary)',
        textDecoration: gone ? 'underline' : 'none',
        textUnderlineOffset: 2
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: -8,
        right: -8,
        top: -14,
        bottom: -14
      }
    }), label);
    if (contact) {
      return React.createElement("div", {
        className: "fp-row",
        style: {
          ...frame,
          position: 'relative'
        }
      }, React.createElement(RdHcRowBody, {
        p: p,
        on: on,
        gone: gone,
        showRoom: showRoom,
        showTag: showTag,
        note: note,
        onToggle: tap,
        hold: hold,
        style: {
          ...rowStyle,
          paddingRight: 56
        }
      }), React.createElement("button", {
        type: "button",
        "aria-label": `Contacts for ${p.name}`,
        onClick: () => onHold && onHold(p),
        className: "fp-btn",
        style: {
          all: 'unset',
          cursor: 'pointer',
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--sd-colour-action-primary)'
        }
      }, React.createElement(SdIcon, {
        name: "phone",
        size: 20
      })));
    }
    const second = !!onSignIn && hint || links && links.length;
    if (onSignIn || links && links.length) {
      return React.createElement("div", {
        className: "fp-row",
        style: {
          ...frame,
          display: 'flex',
          flexDirection: 'column'
        }
      }, React.createElement(RdHcRowBody, {
        p: p,
        on: on,
        gone: gone,
        showRoom: showRoom,
        showTag: showTag,
        note: note,
        onToggle: tap,
        hold: hold,
        style: rowStyle
      }), second && React.createElement("span", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: '4px 6px',
          padding: '0 12px 10px',
          paddingLeft: 'clamp(47px, 18%, 92px)',
          marginTop: -4,
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, onSignIn && hint && React.createElement(React.Fragment, null, "Accounted for \xB7 ", link('Sign in', () => onSignIn(p))), onSignIn && hint && links && links.length ? ' · ' : null, links && links.map((l, i) => React.createElement(React.Fragment, {
        key: l.label
      }, i > 0 && ' · ', link(l.label, l.onClick)))));
    }
    return React.createElement(RdHcRowBody, {
      p: p,
      on: on,
      gone: gone,
      showRoom: showRoom,
      showTag: showTag,
      note: note,
      onToggle: tap,
      hold: hold,
      inert: inert,
      className: inert ? undefined : 'fp-row',
      style: {
        ...rowStyle,
        ...frame
      }
    });
  });
  function RdHcRowBody({
    p,
    on,
    gone,
    showRoom,
    showTag,
    note,
    onToggle,
    hold,
    inert,
    className,
    style
  }) {
    const word = p.stateWord || (p.notIn ? 'Not signed in' : null);
    const Root = inert ? 'div' : 'button';
    const rootProps = inert ? {} : {
      type: 'button',
      onClick: () => onToggle(p.rkey != null ? p.rkey : p.id),
      'aria-pressed': on,
      ...hold
    };
    return React.createElement(Root, _extends({
      className: className,
      style: inert ? {
        ...style,
        cursor: 'default'
      } : style
    }, rootProps), !inert && React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 24,
        height: 24,
        borderRadius: 'var(--sd-radius-sm)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: on ? 'var(--sd-colour-action-primary)' : 'transparent',
        border: on ? 'none' : '2px solid var(--sd-colour-border-strong)',
        color: 'var(--sd-colour-text-inverse)'
      }
    }, on && React.createElement(SdIcon, {
      name: "tick",
      size: 14
    })), p.kind && p.kind !== 'child' ? React.createElement(RdAvatar, {
      src: p.img,
      name: p.name,
      size: 34
    }) : React.createElement(RdKid, {
      c: p,
      size: 34
    }), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px 8px'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)'
      }
    }, p.name), showTag && p.childTag && React.createElement(RdTagChip, {
      tag: p.childTag
    }), word && React.createElement("span", {
      className: "ds-pill ds-pill--xs ds-pill--grey ds-pill--minimal"
    }, word), p.sub && React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, p.sub), note && React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, note)), showRoom && p.room && React.createElement(RdRoomChip, {
      name: p.room
    }));
  }
  const RD_HC_OUTSIDE = [3, 5, 6, 7, 14, 17];
  const rdHcChild = (c, counted, by, at) => ({
    id: c.id,
    name: c.name,
    room: c.room,
    counted,
    signedIn: c.status === 'here',
    by,
    at
  });
  function rdHcSeed() {
    const counts = [];
    RD_ROOMS.forEach(r => {
      const kids = RD_ALL_CHILDREN.filter(c => c.room === r.key && (c.status === 'here' || c.status === 'expected'));
      const rec = (at, by, seen) => ({
        id: `${r.key}-${at}`,
        room: r.key,
        rooms: [r.key],
        at,
        updatedAt: at,
        by,
        children: kids.map(c => rdHcChild(c, c.status === 'here' && seen(c), by, at))
      });
      counts.push(r.key === 'koala' ? rec('12:48', 'Thomas Nguyen', c => !RD_HC_OUTSIDE.includes(c.id)) : rec('12:48', 'Grace Chen', () => true));
      counts.push(rec('12:38', 'Priya Anand', () => true));
    });
    const everyone = RD_ALL_CHILDREN.filter(c => (c.status === 'here' || c.status === 'expected') && !RD_COUNT_FIXTURE_ROOMS.includes(c.room));
    counts.push({
      id: 'service-12:30',
      room: 'service',
      rooms: [...new Set(everyone.map(c => c.room))],
      at: '12:30',
      updatedAt: '12:30',
      by: 'Priya Anand',
      children: everyone.map(c => rdHcChild(c, c.status === 'here' && !(c.room === 'koala' && RD_HC_OUTSIDE.includes(c.id)), 'Priya Anand', '12:30'))
    });
    return counts;
  }
  const rdHcStore = {
    counts: null
  };
  const rdHcToday = () => rdHcStore.counts || (rdHcStore.counts = new URLSearchParams(window.location.search).get('counts') === 'none' ? [] : rdHcSeed());
  const rdCountDraft = {
    routine: null
  };
  const rdOutbox = {
    items: []
  };
  const rdHcClearQueued = () => {
    rdHcStore.counts = (rdHcStore.counts || []).map(h => h.queued ? {
      ...h,
      queued: false
    } : h);
  };
  const RD_COUNT_FIXTURE_ROOMS = ['brushtail'];
  const rdCountRooms = startKey => RD_ROOMS.filter(r => !RD_COUNT_FIXTURE_ROOMS.includes(r.key) || r.key === startKey);
  const rdJoin = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
  const rdHcLast = (counts, roomKey) => (counts || []).filter(h => (h.rooms || [h.room]).includes(roomKey)).reduce((best, h) => !best || RD_MINS(h.at) > RD_MINS(best.at) ? h : best, null);
  const rdHcById = kids => new Map(kids.map(x => [x.id, x]));
  function rdHcMerge(base, mine, theirs) {
    const m = rdHcById(mine);
    let added = 0,
      unticked = 0;
    const children = theirs.map(t => {
      const b = base && base.get(t.id);
      const x = m.get(t.id);
      if (x && b && !!x.counted !== !!b.counted) return x;
      if (b && b.counted && !t.counted) unticked += 1;
      if (t.counted && !(x && x.counted)) added += 1;
      return x ? {
        ...t,
        signedIn: x.signedIn
      } : t;
    });
    return {
      children,
      added,
      unticked
    };
  }
  function rdColleagueSave(id, acting) {
    const rec = (rdHcStore.counts || []).find(x => x.id === id);
    if (!rec) return;
    const who = acting === 'Priya Anand' ? 'Grace Chen' : 'Priya Anand';
    const off = rec.children.find(x => x.counted);
    const on = [...rec.children].reverse().find(x => x.signedIn && !x.counted);
    const children = rec.children.map(x => off && x.id === off.id ? {
      ...x,
      counted: false,
      by: who,
      at: RD_NOW
    } : on && x.id === on.id ? {
      ...x,
      counted: true,
      by: who,
      at: RD_NOW
    } : x);
    rdHcStore.counts = rdHcStore.counts.map(x => x.id === id ? {
      ...x,
      children,
      updatedAt: RD_NOW,
      rev: (x.rev || 0) + 1,
      lastBy: who
    } : x);
  }
  const rdHcOf = kids => kids.filter(x => x.signedIn || x.counted).length;
  function rdHcView(h) {
    const rooms = h.rooms || [...new Set(h.children.map(x => x.room))];
    const lost = h.children.filter(x => x.signedIn && !x.counted);
    return {
      ...h,
      rooms,
      seen: h.children.filter(x => x.counted).length,
      of: rdHcOf(h.children),
      notArrived: h.children.filter(x => !x.signedIn && !x.counted).length,
      short: lost.length > 0,
      missing: lost.map(x => x.name),
      people: [h.by, ...h.children.map(x => x.by)].filter((v, i, a) => v && a.indexOf(v) === i),
      byRoom: rooms.length > 1 ? rooms.map(k => {
        const ks = h.children.filter(x => x.room === k);
        return {
          key: k,
          seen: ks.filter(x => x.counted).length,
          of: rdHcOf(ks)
        };
      }) : null
    };
  }
  function resetCounting() {
    rdHcStore.counts = null;
    rdCountDraft.routine = null;
    rdOutbox.items = [];
    rdEmStore.run = null;
    rdEmStore.events = [];
  }
  window.PgDash = {
    resetCounting,
    FlowApp,
    RD_ROOMS,
    RD_EDUCATORS,
    RD_EDUCATOR,
    RD_DATES,
    roomStats,
    RD_ALL_CHILDREN,
    RD_SYNC_BG,
    RD_SYNC_FG
  };
  function RdHcCountsSheet({
    history: allHistory = [],
    rooms = [],
    phone = false,
    onBack,
    onClose,
    onOpen
  }) {
    const [roomF, setRoomF] = React.useState('all');
    const history = allHistory.filter(h => roomF === 'all' || (h.rooms || []).includes(roomF));
    const roomLabel = roomF === 'all' ? 'All rooms' : (rooms.find(r => r.key === roomF) || {}).name || roomF;
    const [q, setQ] = React.useState('');
    const needle = q.trim().toLowerCase();
    const hits = needle ? history.map(h => ({
      h,
      kid: h.children.filter(x => String(x.name).toLowerCase().includes(needle))
    })).filter(x => x.kid.length) : [];
    const who = h => {
      const f = (h.people || [h.by]).map(x => String(x).split(' ')[0]);
      return f.length > 2 ? `${f[0]}, ${f[1]} + ${f.length - 2} more` : f.join(' + ');
    };
    const n = history.length;
    const latest = history[0];
    const hrOf = h => Math.floor(RD_MINS(h.at) / 60);
    const groups = [];
    history.slice(1).forEach(h => {
      const hr = hrOf(h);
      let g = groups.find(x => x.hr === hr);
      if (!g) {
        g = {
          hr,
          label: `${hr % 12 || 12} ${hr < 12 ? 'am' : 'pm'}`,
          items: []
        };
        groups.push(g);
      }
      g.items.push(h);
    });
    const [openHrs, setOpenHrs] = React.useState(() => new Set(latest ? [hrOf(latest)] : []));
    const toggleHr = hr => setOpenHrs(o => {
      const x = new Set(o);
      x.has(hr) ? x.delete(hr) : x.add(hr);
      return x;
    });
    return React.createElement("div", {
      role: "dialog",
      "aria-label": "Today\u2019s counts",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: phone ? 0 : 'var(--sd-radius-lg)',
        overflow: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        padding: phone ? '6px 16px 10px 6px' : '12px 22px 12px 10px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0
      }
    }, React.createElement(RdSheetBack, {
      onClick: onBack
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flex: 1,
        minWidth: 0,
        paddingLeft: 4
      }
    }, React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, "Today\u2019s counts"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, roomLabel, " \xB7 ", n, " ", n === 1 ? 'count' : 'counts', " \xB7 tap one to open it")), !phone && React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(SdIcon, {
      name: "close",
      size: 20
    }))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, rooms.length > 1 && React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, React.createElement(RdDropdown, {
      label: "Room",
      value: roomF,
      options: [{
        key: 'all',
        label: 'All rooms'
      }, ...rooms.map(r => ({
        key: r.key,
        label: r.name
      }))],
      onChange: setRoomF,
      defaultKey: "all"
    })), allHistory.length > 0 && React.createElement(RdSearch, {
      value: q,
      onChange: setQ,
      count: needle ? hits.length : history.length,
      placeholder: "Search a child by name",
      compact: true
    }), needle && (hits.length === 0 ? React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        padding: '10px 4px'
      }
    }, "No count today has a child called \u201C", q.trim(), "\u201D.") : hits.map(({
      h,
      kid
    }) => React.createElement("button", {
      key: h.id,
      type: "button",
      onClick: () => onOpen(h),
      "aria-label": `Open the ${RD_AMPM(h.at)} count, ${kid.map(x => `${x.name} ${x.counted ? 'accounted for' : 'not accounted for'}`).join(', ')}`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: '100%',
        flexShrink: 0,
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }
    }, RD_AMPM(h.at)), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }
    }, kid.slice(0, 3).map(x => React.createElement("span", {
      key: x.id,
      style: {
        fontSize: 14,
        fontWeight: 600,
        overflowWrap: 'anywhere'
      }
    }, x.name, React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 13,
        color: x.counted || !x.signedIn ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-feedback-error-default)'
      }
    }, x.counted ? 'Accounted for' : x.signedIn ? 'Not seen' : 'Not arrived', h.room === 'service' ? ' · All rooms' : (rooms.find(r => r.key === h.room) || {}).name ? ` · ${rooms.find(r => r.key === h.room).name}` : ''))), kid.length > 3 && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "+ ", kid.length - 3, " more")), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, who(h))))), !needle && latest && React.createElement("button", {
      type: "button",
      onClick: () => onOpen(latest),
      "aria-label": `Open the latest count, ${RD_AMPM(latest.at)}, ${latest.seen} of ${latest.of} accounted for`,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: '100%',
        flexShrink: 0,
        minHeight: 88,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '2px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Latest \xB7 tap to add to it"), React.createElement("span", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'baseline',
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 700
      }
    }, RD_AMPM(latest.at)), React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, latest.seen, " of ", latest.of, " accounted for")), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, who(latest))), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-flex',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(SdIcon, {
      name: "chevron-right",
      size: 20
    }))), !needle && groups.map(g => {
      const isOpen = openHrs.has(g.hr);
      return React.createElement("div", {
        key: g.hr,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flexShrink: 0
        }
      }, React.createElement("button", {
        type: "button",
        "aria-expanded": isOpen,
        onClick: () => toggleHr(g.hr),
        className: "fp-btn",
        style: {
          all: 'unset',
          cursor: 'pointer',
          boxSizing: 'border-box',
          flexShrink: 0,
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 4px',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement("span", {
        style: {
          display: 'inline-flex',
          transform: isOpen ? 'rotate(90deg)' : 'none'
        }
      }, React.createElement(SdIcon, {
        name: "chevron-right",
        size: 15
      })), React.createElement("span", null, g.label), React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, "\xB7 ", g.items.length, " ", g.items.length === 1 ? 'count' : 'counts')), isOpen && g.items.map(h => {
        return React.createElement("button", {
          key: h.id,
          type: "button",
          onClick: () => onOpen(h),
          title: (h.people || [h.by]).join(' + '),
          "aria-label": `Edit the ${RD_AMPM(h.at)} count, by ${(h.people || [h.by]).join(' and ')}`,
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            width: '100%',
            flexShrink: 0,
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 14px',
            borderRadius: 'var(--sd-radius-lg)',
            border: '1px solid var(--sd-colour-border-default)'
          }
        }, React.createElement("span", {
          style: {
            fontSize: 15,
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }
        }, RD_AMPM(h.at)), React.createElement("span", {
          style: {
            fontSize: 15,
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }
        }, h.seen, " of ", h.of, phone ? '' : ' accounted for'), React.createElement("span", {
          style: {
            flex: 1,
            minWidth: 0,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--sd-colour-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'right'
          }
        }, who(h)), React.createElement("span", {
          "aria-hidden": "true",
          style: {
            display: 'inline-flex',
            color: 'var(--sd-colour-text-secondary)'
          }
        }, React.createElement(SdIcon, {
          name: "edit",
          size: 16
        })));
      }));
    }), React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)',
        padding: '2px 4px 0'
      }
    }, roomF === 'all' ? 'Today, across the service.' : `Today, ${roomLabel}.`, " ", phone ? 'The full report across the service is in Playground web, on a tablet.' : 'For the full report across the service, use Playground web.')));
  }
})();