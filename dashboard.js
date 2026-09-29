function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(function () {
  const RD_ROW_H = 64;
  const RD_MENU_D = 'M4 7h16M4 12h16M4 17h16';
  const RD_SEARCH_D = 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4';
  const RD_CLOSE_D = 'M6 6l12 12M18 6L6 18';
  const RD_CHEV_D = 'M9 6l6 6-6 6';
  const RD_CAMERA_D = 'M4 8a2 2 0 0 1 2-2h1.2l1-1.6a1 1 0 0 1 .84-.4h4.92a1 1 0 0 1 .84.4l1 1.6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8ZM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z';
  const RD_LOCK_D = 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5v-9Z';
  const RD_TICK_D = 'M4 12l5 5L20 6';
  const RD_SIGNIN_D = 'M15 4h5v16h-5M11 8l4 4-4 4M15 12H3';
  const RD_SIGNOUT_D = 'M9 4H4v16h5M15 8l4 4-4 4M19 12H8';
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
      offline: 'blocked'
    },
    attendance: {
      label: 'Attendance',
      room: true,
      service: true,
      offline: 'blocked'
    },
    headcount: {
      label: 'Headcount',
      room: true,
      service: true,
      offline: 'blocked'
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
  const RD_SYNC_FG = 'var(--sd-colour-text-on-purple)';
  const RD_SYNC_BG = 'var(--sd-colour-surface-purple)';
  const RD_SYNC_DOT = 'var(--sd-colour-text-on-purple)';
  const RD_OFFLINE_D = 'M3 3l18 18M8.5 16.4a5 5 0 0 1 7 0M5.5 13.1a9 9 0 0 1 3-2M18.5 13.1a9 9 0 0 0-6-2.6M2.5 9.5a14 14 0 0 1 4-2.6M21.5 9.5a14 14 0 0 0-8-3.4M12 20h.01';
  const RD_SYNC_D = 'M20 11a8 8 0 0 0-14-4.5L4 8m0-4v4h4M4 13a8 8 0 0 0 14 4.5L20 16m0 4v-4h-4';
  const RD_CLOCK_D = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2';
  const RD_STAFF_D = 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20a7 7 0 0 1 14 0';
  const RD_SHIELD_D = 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01';
  const RD_WARN_D = 'M12 3l9 16H3L12 3ZM12 9v5M12 17h.01';
  const RD_PHONE_D = 'M5 3h3.4l1.6 4-2.2 1.6a11 11 0 0 0 5.6 5.6L15 11.9l4 1.6V17a2 2 0 0 1-2.2 2A14 14 0 0 1 3 5.2 2 2 0 0 1 5 3Z';
  const RD_BAG_D = 'M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8ZM8.5 8V6a3.5 3.5 0 0 1 7 0v2';
  const RD_ROOMS = [{
    key: 'nursery',
    name: 'Nursery',
    ages: '1 yr',
    educators: 3,
    booked: 13,
    limit: 4,
    care: 'ldc'
  }, {
    key: 'possum',
    name: 'Possum Room',
    ages: '2 yrs',
    educators: 4,
    booked: 17,
    limit: 4,
    care: 'ldc'
  }, {
    key: 'koala',
    name: 'Koala Room',
    ages: '3 yrs',
    educators: 2,
    booked: 20,
    limit: 11,
    care: 'ldc'
  }, {
    key: 'kangaroo',
    name: 'Kangaroo Room',
    ages: '4 yrs',
    educators: 1,
    booked: 20,
    limit: 11,
    care: 'ldc',
    sleepTrack: 'Rest'
  }, {
    key: 'wombat',
    name: 'Wombat Club',
    ages: '3–5 yrs',
    educators: 2,
    booked: 24,
    limit: 11,
    care: 'vac',
    sleepTrack: 'Rest'
  }, {
    key: 'bilby',
    name: 'Bilby Club',
    ages: '5–12 yrs',
    educators: 2,
    booked: 18,
    limit: 15,
    care: 'vac',
    sleepTrack: 'Rest'
  }, {
    key: 'brushtail',
    name: 'Brushtail Hall',
    ages: '3–5 yrs',
    educators: 9,
    booked: 100,
    limit: 11,
    care: 'ldc',
    sleepTrack: 'Rest'
  }];
  const RD_CARE = {
    ldc: {
      label: 'Long day care',
      events: ['sleep', 'nappy', 'meal', 'sun'],
      hcInterval: 10
    },
    oshc: {
      label: 'OSHC',
      events: ['meal', 'sun'],
      hcInterval: 15
    },
    vac: {
      label: 'Vacation care',
      events: ['meal', 'sun'],
      hcInterval: 15
    }
  };
  const RD_SLEEP_INTERVAL = 10;
  const rdDueLabel = (event, mins, late) => late ? `${event} · ${mins} min overdue` : mins < 2 ? `${event} · due now` : `${event} · due ${mins} min ago`;
  const RD_HC_DONE = {
    ok: '12:48',
    late: '12:34'
  };
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
    hint: 'Always one child at a time'
  }];
  const rdEventsDefault = (careKey, sleepTrack) => {
    const on = {};
    RD_EVENT_TYPES.forEach(e => {
      on[e.key] = (RD_CARE[careKey] || RD_CARE.ldc).events.includes(e.key) || e.key === 'med';
    });
    on.advancedSleep = false;
    on.sleepTrack = sleepTrack || 'Sleep';
    return on;
  };
  const RD_ROW_DETAIL = [{
    key: 'events',
    label: 'Recent events',
    hint: 'The last three event icons and their times'
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
    key: 'school',
    label: 'School'
  }, {
    key: 'grade',
    label: 'Grade'
  }, {
    key: 'kinder',
    label: 'Kinder program'
  }, {
    key: 'all',
    label: 'All'
  }];
  const RD_UNGROUPED = 'all';
  const RD_FIELD_GROUPINGS = ['school', 'grade', 'kinder'];
  const RD_GROUPING_LEGACY = {
    class: 'kinder',
    age: 'grade'
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
    label: 'Anaphylaxis'
  }, {
    key: 'medication',
    label: 'Medication'
  }, {
    key: 'disability',
    label: 'Additional needs'
  }];
  const RD_GRADE_ORDER = ['Preschool', 'Prep', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const rdLastName = name => name.trim().split(/\s+/).slice(-1)[0];
  const rdSortItems = (arr, sortKey) => [...arr].sort((a, b) => {
    const av = sortKey === 'last' ? rdLastName(a.name) : a.name;
    const bv = sortKey === 'last' ? rdLastName(b.name) : b.name;
    return av.localeCompare(bv);
  });
  function rdSubGroup(kids, grouping) {
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
      rdSubGroup(inState, grouping).forEach(sub => {
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
      }] : rdSubGroup(inState, grouping);
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
  const RD_GROUPINGS_C = RD_GROUPINGS.filter(g => g.key !== RD_UNGROUPED);
  const RD_KOALA = [{
    id: 1,
    name: 'Alex Turner',
    img: 14,
    age: 3,
    at: '7:02',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:40', 'Asleep'], ['nappy', '12:05', 'Wet'], ['meal', '11:30', 'Most']],
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
    collect: {
      who: 'Father',
      courtOrder: true,
      onFile: 'parenting order, 4 Aug 2026',
      note: 'If he arrives, do not release Mia — call the nominated supervisor.'
    },
    last: [['sleep', '12:50', 'Asleep'], ['nappy', '11:55', 'Dry'], ['meal', '11:30', 'All']]
  }, {
    id: 3,
    name: 'Toby Fairweather',
    img: 33,
    age: 3,
    medication: true,
    at: '7:06',
    status: 'here',
    state: 'Awake',
    alert: {
      kind: 'urgent',
      overdue: true,
      mins: 10,
      label: rdDueLabel('Medication', 10, true)
    },
    last: [['meal', '11:30', 'Half', 'Off his food today'], ['nappy', '11:10', 'Soiled'], ['sun', '10:15', 'SPF 30']],
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
    last: [['sleep', '12:52', 'Asleep'], ['meal', '11:30', 'All'], ['sun', '10:15', 'SPF 50']],
    meds: [{
      name: 'EpiPen Jr (adrenaline)',
      dose: '0.15 mg auto-injector',
      route: 'Intramuscular',
      ongoing: true,
      kept: 'in her bag',
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
      kept: 'in her bag',
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
    age: 3,
    allergy: true,
    at: '7:12',
    status: 'here',
    state: 'Awake',
    tags: ['Seasonal allergies'],
    last: [['meal', '11:30', 'Most'], ['nappy', '10:40', 'Dry']]
  }, {
    id: 6,
    name: 'Sophia Martinez',
    img: 41,
    age: 3,
    allergy: true,
    at: '7:14',
    status: 'here',
    state: 'Awake',
    tags: ['Gluten sensitivity'],
    prefs: {
      sun: 'Own sunscreen'
    },
    last: [['meal', '11:35', 'All'], ['sun', '10:15', 'Own sunscreen', 'Brought her own from home']]
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
    last: [['meal', '11:30', 'None'], ['nappy', '10:20', 'Wet']]
  }, {
    id: 8,
    name: 'Darrin Webb',
    img: 60,
    age: 3,
    disability: true,
    at: '7:40',
    status: 'here',
    state: 'Sleeping',
    prefs: {
      sun: 'SPF 50'
    },
    last: [['sleep', '12:48', 'Asleep'], ['meal', '11:30', 'Half', 'Packed the rest to take home'], ['sun', '10:15', 'SPF 50']]
  }, {
    id: 9,
    name: 'Ava Martin',
    img: 47,
    age: 3,
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
    prefs: {
      sun: 'Medical exemption'
    },
    prefNotes: {
      sun: 'Eczema — GP letter on file, parent applies barrier cream'
    },
    last: [['meal', '11:30', 'All'], ['sun', '10:15', 'Medical exemption', 'Eczema — GP letter on file, parent applies barrier cream']]
  }, {
    id: 15,
    name: 'Finn O’Donnell',
    img: 17,
    age: 3,
    allergy: true,
    at: '7:26',
    status: 'here',
    state: 'Resting',
    tags: ['Egg allergy'],
    last: [['sleep', '12:48', 'Resting'], ['meal', '11:30', 'Most']]
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
    age: 3,
    disability: true,
    collect: {
      who: 'Mother',
      courtOrder: false,
      note: 'Mother is not collecting this term, by family arrangement. Check with the office before releasing to her.'
    },
    at: '7:35',
    status: 'here',
    state: 'Awake',
    last: [['meal', '11:30', 'Half'], ['sun', '10:15', 'SPF 30']]
  }, {
    id: 18,
    name: 'Ruth Okonjo',
    img: 43,
    age: 3,
    at: '7:48',
    status: 'here',
    state: 'Sleeping',
    last: [['sleep', '12:55', 'Asleep'], ['meal', '11:30', 'All']]
  }, {
    id: 19,
    name: 'Nina Kovac',
    img: 19,
    age: 3,
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
      sleep: [['Sleeping', 17], ['Sleeping', 11], ['Sleeping', 15], ['Sleeping', 5], ['Sleeping', 3], ['Sleeping', 8], ['Resting', 6], ['Awake', null], ['Awake', null]],
      alerts: {
        7: 'nappy',
        8: 'nappy'
      }
    },
    possum: {
      sleep: [['Sleeping', 12], ['Sleeping', 7], ['Sleeping', 5], ['Sleeping', 3], ['Sleeping', 8], ['Sleeping', 6], ['Resting', 6], ['Unsettled', 4], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null]],
      alerts: {
        9: 'sun'
      }
    },
    kangaroo: {
      sleep: [['Awake', null], ['Resting', 8], ['Resting', 5], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null], ['Awake', null]],
      alerts: {
        0: 'sun'
      }
    },
    wombat: {
      alerts: {
        1: 'sun',
        10: 'sun'
      }
    },
    bilby: {
      arriving: true
    },
    brushtail: {
      sleep: Array.from({
        length: RD_SIGNED.brushtail
      }, (_, i) => i % 3 === 0 ? ['Sleeping', i % 7 === 0 ? 11 + i % 13 : 2 + i % 7] : i % 3 === 1 ? ['Resting', 4 + i % 5] : ['Awake', null]),
      alerts: Object.fromEntries(Array.from({
        length: 12
      }, (_, k) => [k * 7 + 3, k % 2 ? 'sun' : 'nappy']))
    }
  };
  const RD_SCENARIO_ALERTS = {
    nappy: {
      event: 'Nappy check'
    },
    sun: {
      event: 'Sunscreen'
    }
  };
  const rdSeededAlert = (key, i) => {
    const a = RD_SCENARIO_ALERTS[key];
    if (!a) return null;
    const mins = 4 + i * 7 % 26;
    return {
      kind: 'due',
      overdue: false,
      mins,
      label: rdDueLabel(a.event, mins, false)
    };
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
      const alertKey = (sc.alerts || {})[i];
      const alert = alertKey ? rdSeededAlert(alertKey, i) : null;
      const club = room === 'wombat' || room === 'bilby';
      const at = club ? '7:' + String(5 + i * 4 % 50).padStart(2, '0') : '7:' + String(10 + i * 3 % 45).padStart(2, '0');
      const last = club ? [['meal', '12:10', 'All'], ['sun', '9:15', 'SPF 50']] : [['meal', '11:30', 'All']];
      const seeded = (sc.sleep || [])[i];
      const state = seeded ? {
        state: seeded[0]
      } : {};
      if (seeded && seeded[1] != null) {
        const found = seeded[0] === 'Sleeping' ? 'Asleep' : seeded[0];
        last.unshift(['sleep', RD_AGO(seeded[1]), found]);
      }
      return {
        ...base,
        status: 'here',
        at,
        ...state,
        ...(alert ? {
          alert
        } : {}),
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
  const RD_ALL_CHILDREN = [...RD_KOALA, ...RD_OTHERS].map(rdWithKinder);
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
  const RD_ATTACH_D = 'M6 3h9l4 4v14H6V3ZM14 3v5h5M9 13h6M9 17h4';
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
  const RD_SPECIAL_NOTES = [{
    text: 'Grandparents do the Thursday pickup — they are on the authorised list, no need to call ahead.',
    tone: 'calm'
  }, {
    text: 'Recently bereaved (grandparent, June). May need extra reassurance at drop-off.',
    tone: 'calm'
  }, {
    text: 'Family speaks Cantonese at home. Mum is the confident English speaker of the two.',
    tone: 'calm'
  }, {
    text: 'Older sibling in Kangaroo Room — they settle much faster if they see each other at drop-off.',
    tone: 'calm'
  }];
  const RD_ABOUT_NOTES = ['Loves the sandpit and anything with wheels. Will not wear a hat without a fuss — offer the blue one.', 'Very settled once she has her comforter. Doesn’t like loud group singing; happier at the edge.', 'Big eater, but slow. Needs a bit longer at lunch rather than being rushed.', 'Napping is hit and miss — often just rests. Doesn’t need to be woken.', 'Chatty and confident with adults, more cautious with new children. Warms up by about morning tea.'];
  function rdProfile(c) {
    const surname = rdLastName(c.name);
    const seed = rdSeed(c.id);
    const phone = i => `0400 ${String(100 + (seed + i * 37) % 900)} ${String(100 + seed * (i + 3) % 900)}`;
    const auths = i => RD_AUTH_TYPES.map((a, j) => ({
      ...a,
      on: (seed + i * 5 + j * 3) % 7 !== 0
    }));
    const guardians = [{
      name: `${RD_MUMS[seed % RD_MUMS.length]} ${surname}`,
      rel: 'Mother',
      phone: phone(1),
      auths: auths(1)
    }, {
      name: `${RD_DADS[(seed + 2) % RD_DADS.length]} ${surname}`,
      rel: 'Father',
      phone: phone(2),
      auths: auths(2)
    }].map(g => c.collect && c.collect.who === g.rel ? {
      ...g,
      noCollect: true,
      auths: g.auths.map(a => a.key === 'pickup' ? {
        ...a,
        on: false
      } : a)
    } : g);
    const emergency = {
      name: `${RD_GPS[seed % RD_GPS.length]} ${surname}`,
      rel: 'Grandparent',
      phone: phone(4),
      auths: auths(4)
    };
    const drawn = seed % 3 === 0 ? null : RD_SPECIAL_NOTES[seed % RD_SPECIAL_NOTES.length];
    const kept = c.collect && drawn && /collect/i.test(drawn.text) ? null : drawn;
    const special = kept ? kept.text : null;
    const specialTone = kept ? kept.tone : null;
    const about = RD_ABOUT_NOTES[(seed + 2) % RD_ABOUT_NOTES.length];
    const attachments = [];
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
      const line = absent || `Signed in ${RD_AMPM(`${7 + k % 2}:${String(10 + k % 45).padStart(2, '0')}`)}, out ${RD_AMPM(`15:${String(20 + k % 39).padStart(2, '0')}`)} · ${rdTimeline(c, d.offset).length} events`;
      return {
        ...d,
        line,
        absent: !!absent
      };
    });
    return {
      surname,
      guardians,
      emergency,
      attachments,
      history,
      special,
      specialTone,
      about
    };
  }
  const RD_ICONS = {
    sleep: 'M17 12.5a6 6 0 0 1-7.5-7.5 6.5 6.5 0 1 0 7.5 7.5Z',
    nappy: 'M4 6h16v4a8 8 0 0 1-8 8 8 8 0 0 1-8-8V6Z',
    meal: 'M5 4v7a3 3 0 0 0 3 3v6M8 4v6M19 4c-1.5 1-2 3-2 5s.5 3 2 3v8',
    sun: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5',
    med: 'M10.5 3.5 3.5 10.5a5 5 0 0 0 7 7l7-7a5 5 0 0 0-7-7ZM7 7l7 7',
    note: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z'
  };
  const RD_ICON_DIR = 'icons/';
  const RD_COLOUR_ICON = {
    sleep: [{
      src: 'sleep-body.svg',
      t: '7.69%',
      r: '11.77%',
      b: '0',
      l: '8.33%'
    }, {
      src: 'sleep-badge.svg',
      t: '0',
      r: '4.17%',
      b: '53.85%',
      l: '50.18%',
      grow: '-4.69% -4.74%'
    }],
    nappy: [{
      src: 'nappy.svg',
      t: '0',
      r: '0',
      b: '5.66%',
      l: '0'
    }],
    meal: [{
      src: 'meal.svg',
      t: '0.85%',
      r: '21%',
      b: '0',
      l: '20.98%'
    }],
    sun: [{
      src: 'sun-body.svg',
      t: '0.48%',
      r: '4.68%',
      b: '0.48%',
      l: '17.18%'
    }, {
      src: 'sun-mark.svg',
      t: '41.15%',
      r: '60.1%',
      b: '47.21%',
      l: '27.46%'
    }],
    med: [{
      src: 'med.svg',
      t: '0.5%',
      r: '10.29%',
      b: '0.5%',
      l: '9.22%'
    }],
    time: [{
      src: 'time.svg',
      t: '0.87%',
      r: '0.78%',
      b: '0.87%',
      l: '0'
    }],
    note: [{
      src: 'note.svg',
      t: '0',
      r: '0',
      b: '0',
      l: '0'
    }],
    incident: [{
      src: 'incident.svg',
      t: '0',
      r: '0',
      b: '0',
      l: '0'
    }],
    asleep: [{
      src: 'state-asleep.svg',
      t: '0',
      r: '0',
      b: '0',
      l: '0'
    }],
    awake: [{
      src: 'state-awake.svg',
      t: '0',
      r: '0',
      b: '0',
      l: '0'
    }]
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
    nappy: 'Nappy',
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
    out: 'Signed out'
  };
  const RD_SLEEP_TYPE = {
    'Sleep': {
      Asleep: 'sleep',
      Resting: 'rest_start',
      Awake: 'wake_up',
      Unsettled: 'unsettled',
      Crying: 'crying'
    },
    'Rest': {
      Asleep: 'sleep',
      Resting: 'rest_start',
      Awake: 'rest_end',
      Unsettled: 'unsettled',
      Crying: 'crying'
    }
  };
  const RD_SLEEP_ROUND = {
    Sleep: 'check',
    Rest: 'rest_check'
  };
  const RD_FOUND_STATE = {
    Asleep: 'Sleeping',
    Resting: 'Resting',
    Awake: 'Awake',
    Unsettled: 'Unsettled',
    Crying: 'Crying'
  };
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
  const rdEventTitle = (kind, context) => kind === 'sleep' && context === 'Rest' ? 'Rest check' : RD_LOG_TITLE[kind] || kind;
  const RD_AMPM = s => {
    if (s === null || s === undefined) return s;
    const str = String(s).trim();
    const m = str.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return str;
    const h = Number(m[1]);
    return `${h % 12 || 12}:${m[2]}\u00a0${h < 12 ? 'am' : 'pm'}`;
  };
  const RD_PAD = t => {
    const p = String(t).split(':');
    return `${String(p[0]).padStart(2, '0')}:${p[1] || '00'}`;
  };
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
      ...(extra || {})
    });
    if (past) {
      if (seed % 9 === 0 || seed % 13 === 0) return [];
      add(`${7 + seed % 2}:${String(10 + seed % 45).padStart(2, '0')}`, 'in', `Delivered by ${pick(carers, 1)}`, {
        by: by(0)
      });
      add('9:35', 'meal', `Morning tea · ate ${pick(['all', 'most', 'half'], 3)}`, {
        by: by(2)
      });
      add('10:20', 'sun', `Applied · SPF ${seed % 2 ? '50' : '30'}`, {
        by: by(0)
      });
      add('11:15', 'nappy', `Found ${pick(['dry', 'wet', 'soiled'], 4)}`, {
        by: by(1)
      });
      add('11:40', 'meal', `Lunch · ate ${pick(['all', 'most', 'half', 'none'], 5)}`, {
        by: by(2)
      });
      add('12:30', 'sleep', `Down to rest · ${pick(['Sight', 'Touch', 'Sight + touch'], 6)} · found asleep`, {
        by: by(0)
      });
      add('13:05', 'sleep', 'Check · Sight · found asleep', {
        by: by(1)
      });
      add(`15:${String(20 + seed % 39).padStart(2, '0')}`, 'out', `Collected by ${pick(carers, 2)}`, {
        by: by(2)
      });
      return rows.map(r => ({
        ...r,
        at: RD_HHMM(r.min),
        title: rdEventTitle(r.kind, r.ctx)
      })).sort((a, b) => b.min - a.min);
    }
    const present = c.status === 'here' || c.status === 'gone';
    if (present) {
      add(c.at || '7:45', 'in', `Delivered by ${pick(carers, 1)}`, {
        by: by(0)
      });
      add('8:40', 'nappy', `Found ${pick(['dry', 'wet', 'soiled'], 2)}`, {
        by: by(1)
      });
      add('9:30', 'meal', `Morning tea · ate ${pick(['all', 'most', 'half'], 3)}`, {
        by: by(2)
      });
      add('10:15', 'sun', `Applied · SPF ${seed % 2 ? '50' : '30'}`, {
        by: by(0),
        note: seed % 3 === 0 ? 'Before outdoor play' : null
      });
      const routine = (c.meds || []).find(m => !/anaphylaxis|000|as needed/i.test(m.window || ''));
      if (routine && !(c.alert && /medication/i.test(c.alert.label))) add('11:10', 'med', `${routine.name} · ${routine.dose} · given`, {
        by: by(2),
        note: `Second-checked by ${by(1)}`
      });
      add('11:20', 'nappy', `Found ${pick(['dry', 'wet', 'soiled'], 4)}`, {
        by: by(1)
      });
      add('11:30', 'meal', `Lunch · ate ${pick(['all', 'most', 'half', 'none'], 5)}`, {
        by: by(2),
        note: seed % 4 === 0 ? 'Second helping' : null
      });
      add('12:20', 'sleep', `Down to rest · ${pick(['Sight', 'Touch', 'Sight + touch'], 6)} · found asleep`, {
        by: by(0)
      });
      add('12:50', 'sleep', 'Check · Sight · found asleep', {
        by: by(1)
      });
    }
    if (c.status === 'gone') add(c.at || '15:30', 'out', `Collected by ${c.by || 'a parent'}`, {
      by: by(2)
    });
    const pretty = (k, v) => {
      const raw = String(v);
      if (raw.includes('·')) return raw;
      const lbl = RD_BULK[k] && RD_BULK[k].perChild && RD_BULK[k].perChild.label;
      const val = /^[A-Z][a-z]*(\s[a-z]+)*$/.test(raw) ? raw.toLowerCase() : raw;
      return lbl ? `${lbl} ${val}` : raw;
    };
    const withCtx = (k, detail, context) => {
      const v = detail ? pretty(k, detail) : null;
      return context ? v ? `${context} · ${v.charAt(0).toLowerCase() + v.slice(1)}` : context : v || 'Logged';
    };
    (c.last || []).forEach(([k, t, detail, note, context]) => {
      const hits = rows.filter(r => r.kind === k && !r.live);
      const hit = hits.length ? hits.reduce((a, b) => b.min > a.min ? b : a) : null;
      if (hit) {
        hit.min = RD_MINS(t);
        hit.live = true;
        hit.by = c.loggedBy || hit.by;
        if (detail || context) {
          hit.detail = withCtx(k, detail, context);
          hit.value = detail || null;
          hit.ctx = context || null;
        }
        if (note !== undefined) hit.note = note || hit.note;
      } else {
        add(t, k, withCtx(k, detail, context), {
          by: c.loggedBy || by(0),
          live: true,
          value: detail || null,
          note: note || null,
          ctx: context || null
        });
      }
    });
    const amended = new Set(c.corrected || []);
    return rows.map(r => ({
      ...r,
      at: RD_HHMM(r.min),
      title: rdEventTitle(r.kind, r.ctx),
      amended: !!r.live && amended.has(r.kind)
    })).sort((a, b) => b.min - a.min);
  }
  const RD_NAPPY_OPTS = [{
    key: 'dry',
    label: 'Dry',
    log: 'Dry nappy',
    cat: 'nappy_change'
  }, {
    key: 'wet',
    label: 'Wet',
    log: 'Wet nappy',
    cat: 'nappy_change'
  }, {
    key: 'soiled',
    label: 'Soiled',
    log: 'Soiled nappy',
    cat: 'nappy_change'
  }, {
    key: 'wet_soiled',
    label: 'Wet & soiled',
    log: 'Wet & soiled nappy',
    cat: 'nappy_change'
  }, {
    key: 'soiled_clothes',
    label: 'Soiled clothes',
    log: 'Soiled clothes',
    cat: 'nappy_change'
  }, {
    key: 'cream',
    label: 'Nappy cream',
    log: 'Nappy cream applied',
    cat: 'nappy_change',
    flag: true
  }, {
    key: 'wee',
    label: 'Wee',
    log: 'Wee (toilet)',
    cat: 'toilet'
  }, {
    key: 'poo',
    label: 'Poo',
    log: 'Poo (toilet)',
    cat: 'toilet'
  }, {
    key: 'attempt',
    label: 'Toileting attempt',
    log: 'Toileting attempt',
    cat: 'toilet'
  }];
  const RD_SLEEP_CHECKS = [{
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
  }, {
    key: 'uncovered',
    label: 'Head & face uncovered',
    options: ['Uncovered', 'Bedding near face', 'Covered']
  }];
  const RD_NAPPY_GROUPS = [{
    cat: 'nappy_change',
    label: 'Nappy'
  }, {
    cat: 'toilet',
    label: 'Toilet'
  }];
  const rdMultiLabel = (opts, keys) => (opts || []).filter(o => (keys || []).includes(o.key)).map(o => o.log).join(' · ') || null;
  const rdMultiCats = (opts, keys) => [...new Set((opts || []).filter(o => (keys || []).includes(o.key)).map(o => o.cat))];
  const RD_MENU = [{
    key: 'mt-fruit',
    label: 'Morning tea · Fruit and yoghurt'
  }, {
    key: 'l-bol',
    label: 'Lunch · Spaghetti bolognese'
  }, {
    key: 'l-rice',
    label: 'Lunch · Chicken and vegetable rice'
  }, {
    key: 'l-pie',
    label: 'Lunch · Shepherd’s pie'
  }, {
    key: 'at-cheese',
    label: 'Afternoon tea · Cheese, crackers and fruit'
  }, {
    key: 'ls-toast',
    label: 'Late snack · Toast and fruit'
  }];
  const RD_DELIVERED_BY = ['Parent / guardian', 'Authorised contact', 'School', 'Walked in'];
  const RD_COLLECTED_BY = ['Parent / guardian', 'Authorised contact', 'School', 'Walked home'];
  const rdCollectOptions = c => {
    if (!c || !c.collect) return RD_COLLECTED_BY;
    const named = rdProfile(c).guardians.filter(g => !g.noCollect && (g.auths || []).some(a => a.key === 'pickup' && a.on)).map(g => [`${g.name} (${g.rel})`, `${g.name.split(' ')[0]} · ${g.rel}`]);
    return [...named, ...RD_COLLECTED_BY.filter(o => o !== 'Parent / guardian')];
  };
  const RD_BULK = {
    sun: {
      label: 'Sunscreen',
      verb: 'Applied',
      shared: {
        label: 'Applied to all',
        options: ['SPF 30', 'SPF 50'],
        value: 'SPF 30',
        carry: true
      },
      perChild: {
        label: 'Applied',
        options: [['SPF 30', 'SPF 30'], ['SPF 50', 'SPF 50'], ['Own sunscreen', 'Own']],
        notApplied: 'Not applied',
        reasonFor: ['Not applicable', 'Medical exemption', 'Refused']
      },
      prefKey: 'sun'
    },
    meal: {
      label: 'Meal',
      verb: 'Served',
      shared: {
        label: 'Served',
        select: RD_MENU,
        value: RD_MENU[1].key
      },
      perChild: {
        label: 'Ate',
        options: ['All', 'Most', 'Half', 'None'],
        value: 'All'
      }
    },
    nappy: {
      label: 'Nappy / toileting',
      verb: 'Checked',
      perChild: {
        label: 'Found',
        multi: true,
        groups: RD_NAPPY_GROUPS,
        options: RD_NAPPY_OPTS,
        value: []
      }
    },
    sleep: {
      label: 'Sleep check',
      verb: 'Checked',
      shared: {
        label: 'This round is',
        options: [['Sleep', 'Sleep'], ['Rest', 'Rest']],
        value: 'Sleep'
      },
      perChild: {
        label: 'Found',
        options: ['Asleep', 'Resting', 'Awake', 'Unsettled', 'Crying'],
        value: 'Asleep'
      },
      advanced: RD_SLEEP_CHECKS,
      roomTemp: true,
      warning: 'Ensure airways are clear at all times and enact emergency procedures if an infant shows difficulty breathing or blue skin colour.'
    },
    med: {
      label: 'Medication',
      verb: 'Recorded',
      singleOnly: true,
      perChild: {
        label: 'Outcome',
        options: ['Given', 'Part dose', 'Refused'],
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
      seedBySelection: true,
      shared: {
        label: 'Delivered by',
        options: RD_DELIVERED_BY,
        value: 'Parent / guardian',
        carry: true
      },
      perChild: {
        label: 'Delivered by',
        options: RD_DELIVERED_BY
      }
    },
    out: {
      label: 'Sign out',
      verb: 'Signed out',
      attendance: 'out',
      shared: {
        label: 'Collected by',
        options: RD_COLLECTED_BY,
        value: 'Parent / guardian',
        carry: true
      },
      perChild: {
        label: 'Collected by',
        options: RD_COLLECTED_BY
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
  const rdNarrowWords = on => RD_FACETS.filter(f => f.key !== 'att').flatMap(f => (on[f.key] || []).map(k => (f.values.find(v => v.key === k) || {}).label)).filter(Boolean).map(l => l.toLowerCase());
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
  const RD_HC_INTERVAL = 10;
  const RD_NOTE_D = 'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z';
  const RD_CAL_D = 'M4 8h16M7 3v3M17 3v3M5 5h14v15H5V5Z';
  const RD_DATES = ['Today', 'Yesterday', 'Two days ago', 'Three days ago'];
  const RD_BELL_D = 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.5 21a1.5 1.5 0 0 0 3 0';
  const RD_NOTIFS = [{
    id: 'n1',
    scope: 'room',
    room: 'koala',
    kind: 'booking',
    title: 'New booking added',
    body: 'Ava Martin — arriving 8:30 am today',
    at: '8:12'
  }, {
    id: 'n2',
    scope: 'room',
    room: 'koala',
    kind: 'roster',
    title: 'Roster updated by the office',
    body: 'Hannah Patel marked absent today',
    at: '7:50'
  }, {
    id: 'n3',
    scope: 'service',
    kind: 'cover',
    title: 'Kangaroo Room needs cover',
    body: '12 children to 1 educator — over ratio',
    at: '12:40'
  }, {
    id: 'n4',
    scope: 'room',
    room: 'nursery',
    kind: 'note',
    derive: 'sleepDue',
    at: '12:55'
  }, {
    id: 'n5',
    scope: 'room',
    room: 'nursery',
    kind: 'booking',
    title: 'New booking added',
    body: 'Esme Laurent — arriving 9:55 am today',
    at: '8:20'
  }, {
    id: 'n6',
    scope: 'room',
    room: 'nursery',
    kind: 'roster',
    title: 'Roster updated by the office',
    body: 'Noa Feldman marked absent today',
    at: '7:45'
  }];
  const RD_NOTIF_ICON = {
    booking: 'M16 3v4M8 3v4M4 8h16M5 5h14v15H5V5ZM9 14l2 2 4-4',
    roster: 'M4 6h16M4 12h10M4 18h7',
    cover: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20h4a6 6 0 0 0-4-5.7',
    note: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z'
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
  function RdGlyph({
    d,
    size = 16,
    width = 1.7
  }) {
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: d,
      stroke: "currentColor",
      strokeWidth: width,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  const RD_ICON_URL = '../../assets/icons/outline/';
  function RdIcon({
    name,
    size = 20
  }) {
    const url = `url("${window.__PG_ICONS && window.__PG_ICONS[name] || RD_ICON_URL + name + '.svg'}")`;
    return React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        background: 'currentColor',
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain'
      }
    });
  }
  function RdColourIcon({
    kind,
    size = 16
  }) {
    const layers = RD_COLOUR_ICON[kind];
    if (!layers) return RD_ICONS[kind] ? React.createElement(RdGlyph, {
      d: RD_ICONS[kind],
      size: size
    }) : null;
    const fill = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'block'
    };
    return React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0
      }
    }, layers.map((l, i) => {
      const img = React.createElement("img", {
        src: RD_ICON_DIR + l.src,
        alt: "",
        style: {
          ...fill,
          inset: 0
        }
      });
      return React.createElement("span", {
        key: i,
        style: {
          position: 'absolute',
          top: l.t,
          right: l.r,
          bottom: l.b,
          left: l.l
        }
      }, l.grow ? React.createElement("span", {
        style: {
          position: 'absolute',
          inset: l.grow
        }
      }, img) : img);
    }));
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
  function RdTag({
    children
  }) {
    return React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--orange ds-pill--minimal"
    }, children);
  }
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
      className: "ds-pill ds-pill--sm ds-pill--grey ds-pill--minimal",
      title: `${collect.who} is not permitted to collect`
    }, label);
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
        borderRadius: 'var(--sd-radius-full)'
      }
    }, React.createElement(RdAvatar, {
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
    }, React.createElement(RdIcon, {
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
    }, React.createElement(RdIcon, {
      name: "settings-cog",
      size: 19
    }));
  }
  function RdCameraButton({
    onOpen
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      "aria-label": "Take a photo",
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
    }, React.createElement(RdIcon, {
      name: "camera",
      size: 20
    }));
  }
  function RdCameraSheet({
    offline,
    onClose,
    onCapture
  }) {
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
        maxWidth: 480,
        maxHeight: '100%',
        overflowY: 'auto',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        padding: '20px 22px 14px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 19,
        fontWeight: 700
      }
    }, "Take a photo"), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 20
    }))), React.createElement("div", {
      style: {
        padding: '16px 22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, React.createElement("div", {
      style: {
        aspectRatio: '4 / 3',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-grey)',
        border: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CAMERA_D,
      size: 40
    }), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, "Camera preview \u2014 demo only")), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-orange)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-feedback-warning-default)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600
      }
    }, "Photo consent is per child (C5) and isn\u2019t wired up here \u2014 some children must not be photographed, so a real camera has to check who\u2019s in frame first."))), React.createElement("div", {
      style: {
        padding: '0 22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdAction, {
      primary: true,
      glyph: RD_CAMERA_D,
      full: true,
      onClick: onCapture
    }, "Capture"), offline && React.createElement("span", {
      style: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Saved on this device \xB7 syncs when there\u2019s signal"))));
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
    }, React.createElement(RdGlyph, {
      d: glyph,
      size: 16,
      width: 2
    }));
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0
      }
    }, stepBtn('M15 6l-6 6 6 6', date.older, date.canOlder, 'Previous day'), React.createElement("button", {
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
    }, !compact && React.createElement(RdGlyph, {
      d: RD_CAL_D,
      size: 15
    }), date.label, !today && !compact && React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--sd-colour-cyan-100)'
      }
    }, "\xB7 read-only")), stepBtn('M9 6l6 6-6 6', date.newer, date.canNewer, 'Next day'), !today && !compact && React.createElement("button", {
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
    onClose
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const lead = 6;
    const days = 31;
    const today = 17;
    const cells = [...Array(lead).fill(null), ...Array.from({
      length: days
    }, (_, i) => i + 1)];
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
    }, React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        flex: 1
      }
    }, "August 2026"), React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Example"), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, d)), cells.map((n, i) => {
      const isToday = n === today;
      const future = n && n > today;
      return React.createElement("span", {
        key: i,
        style: {
          textAlign: 'center',
          fontSize: 13,
          fontWeight: isToday ? 700 : 500,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--sd-radius-m)',
          background: isToday ? 'var(--sd-colour-action-primary)' : 'transparent',
          color: isToday ? '#fff' : future ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-text-primary)',
          opacity: future ? 0.45 : 1
        }
      }, n || '');
    })), React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.4,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Placeholder \u2014 the real date picker isn\u2019t wired up yet. Click anywhere to close.")));
  }
  function RdEducatorSheet({
    educators,
    current,
    serviceName,
    onPick,
    onLogout,
    onClose
  }) {
    const [pending, setPending] = useState(null);
    const [pin, setPin] = useState('');
    const [wrong, setWrong] = useState(false);
    const expected = window.PgSignin && window.PgSignin.DEMO_PIN || '1234';
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') {
          if (pending) {
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
      if (pin.length >= 4) return;
      const next = pin + d;
      setWrong(false);
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === expected) {
            onPick(pending);
          } else {
            setWrong(true);
            setPin('');
          }
        }, 160);
      }
    };
    const back = () => {
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
    }, React.createElement(RdGlyph, {
      d: "M15 6l-6 6 6 6",
      size: 20,
      width: 2
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
    }, pending ? `${pending.name} · enter your PIN to take over recording` : 'Records are attributed to whoever is selected here')), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
        color: wrong ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
      }
    }, wrong ? 'That PIN didn’t match. Try again.' : 'Every record you make will be signed with this name.'), React.createElement("div", {
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
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: "M9 5h10v14H9L3 12l6-7ZM12 9l5 6M17 9l-5 6",
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
      return React.createElement("button", {
        key: e.name,
        type: "button",
        onClick: () => on ? onClose() : setPending(e),
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
          background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
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
      }, e.name), !on && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 500,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, "PIN required")), on ? React.createElement("span", {
        style: {
          color: 'var(--sd-colour-action-primary)',
          flexShrink: 0
        }
      }, React.createElement(RdGlyph, {
        d: RD_TICK_D,
        size: 18,
        width: 2.4
      })) : React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-secondary)',
          flexShrink: 0
        }
      }, React.createElement(RdGlyph, {
        d: RD_LOCK_D,
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
      glyph: "M14 8V6a2 2 0 0 0-2-2H5v16h7a2 2 0 0 0 2-2v-2M9 12h11m0 0-3-3m3 3-3 3",
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
    onClose
  }) {
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
    }, React.createElement(RdGlyph, {
      d: RD_BELL_D,
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
    }, "Notifications"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Bookings, roster changes and room checks")), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, notifs.length ? notifs.map(n => React.createElement("div", {
      key: n.id,
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 11,
        padding: '11px 12px',
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
    }, React.createElement(RdGlyph, {
      d: RD_NOTIF_ICON[n.kind] || RD_BELL_D,
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
    }, n.title), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, n.body)), React.createElement("span", {
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
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--sd-colour-action-primary)'
      }
    })))) : React.createElement("div", {
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
    }, "Nothing new"), React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Bookings and roster changes for this room will show here.")))));
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
    const changed = care !== careKey || RD_ROW_DETAIL.some(r => !!detail[r.key] !== !!base[r.key]) || [...RD_EVENT_TYPES.map(e => e.key), 'advancedSleep'].some(k => !!events[k] !== !!baseEvents[k]) || events.sleepTrack !== baseEvents.sleepTrack;
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
    }, React.createElement(RdGlyph, {
      d: RD_CAL_D,
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l9 16H3L12 3ZM12 9v5M12 17h.01",
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
    }, "Switched off disappears from the quick-log, what\u2019s due, and each child\u2019s event sheet."), RD_EVENT_TYPES.map(e => React.createElement("div", {
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
    }))), events.sleep && React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '2px 0 2px 29px'
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
    }, "This room runs"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Total slept is reported separately from total rested")), React.createElement(RdSegmented, {
      options: [['Sleep', 'Sleep'], ['Rest', 'Rest']],
      value: events.sleepTrack || 'Sleep',
      onChange: v => setEvents(m => ({
        ...m,
        sleepTrack: v
      })),
      ariaLabel: "Sleep or rest rounds in this room"
    })), events.sleep && React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '2px 0 2px 29px'
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
    }, "Advanced sleep checks"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Record the seven Red Nose observation points on every check")), React.createElement(RdToggle, {
      on: !!events.advancedSleep,
      label: "Advanced sleep checks in this room",
      onChange: v => setEvents(m => ({
        ...m,
        advancedSleep: v
      }))
    }))), React.createElement("div", {
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
    }, React.createElement(RdLabel, null, "Cadence"), [['Head count', `Every ${cfg.hcInterval} min`, 'Service policy — no regulation sets this'], ['Sleep checks', `Every ${RD_SLEEP_INTERVAL} min`, 'AU Red Nose best practice · NZ HS107 mandates 5–10 min']].map(([k, v, why]) => React.createElement("div", {
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
      glyph: RD_TICK_D,
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
    muted,
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
        height: 46,
        padding: '0 18px',
        borderRadius: 'var(--sd-radius-lg)',
        fontSize: 15,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: off ? 'var(--sd-colour-surface-grey)' : primary ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-default)',
        color: off ? 'var(--sd-colour-text-disabled)' : primary ? '#fff' : muted ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-text-primary)',
        border: primary && !off ? '1px solid transparent' : `1px solid var(--sd-colour-border-default)`,
        ...(full ? {
          width: '100%'
        } : {})
      }
    }, glyph && React.createElement(RdGlyph, {
      d: glyph,
      size: 18
    }), children);
  }
  function RdSheetFoot({
    note,
    phone,
    divider = true,
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
    return React.createElement("div", {
      style: {
        ...border,
        padding: '14px 22px 18px',
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
    }, dot, label, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 14,
      width: 2.2
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
    const hc = d.headcount;
    const pick = c => {
      onClose();
      d.openDueChild(c);
    };
    const nothing = !d.dueChildren.length && !d.ratioBreaches.length && !hc;
    const hcCard = hc ? React.createElement("button", {
      type: "button",
      onClick: () => {
        onClose();
        d.openHeadcount();
      },
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
        background: hc.overdue ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-cyan)'
      }
    }, React.createElement("span", {
      style: {
        color: hc.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-action-primary)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
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
        fontWeight: 700
      }
    }, "Head count ", hc.overdue ? 'overdue' : 'due soon'), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        textWrap: 'pretty',
        color: hc.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
      }
    }, hc.note)), React.createElement("span", {
      style: {
        color: hc.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
    }))) : null;
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
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
    }, "Due now"), React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, hc && hc.overdue && hcCard, !!d.ratioBreaches.length && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
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
    }, "1:", r.ratio, " \xB7 needs 1:", r.limit))))), !!d.dueChildren.length && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, d.dueChildren.length === 1 ? '1 child' : `${d.dueChildren.length} children`), d.dueChildren.map(c => React.createElement(RdDueItem, {
      key: c.id,
      c: c,
      showRoom: d.scope === 'service',
      roomName: d.roomNameOf(c),
      onPick: pick
    }))), hc && !hc.overdue && hcCard, nothing && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 22,
      width: 2
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
    compact
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
    }, React.createElement(RdGlyph, {
      d: RD_SEARCH_D,
      size: 17
    })), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: value,
      placeholder: placeholder,
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    onLongPress
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
    }, ticked && React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 14,
      width: 3
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
      }), c.alert && React.createElement(RdAlert, {
        alert: c.alert
      }), c.state && React.createElement(RdStatePill, {
        state: c.state,
        show: detail.state
      }), c.blocked && React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, React.createElement(RdGlyph, {
        d: RD_LOCK_D,
        size: 13
      }), "Signed in elsewhere"), c.collect && React.createElement(RdCollectPill, {
        collect: c.collect
      }), detail.health && (c.tags || []).map(t => React.createElement(RdTag, {
        key: t
      }, t)));
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
    }), RD_AMPM(t)))), detail.time && React.createElement("span", {
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
  function RdRoomRow({
    r,
    showStaff,
    selected,
    onOpen
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
        width: 168,
        flexShrink: 0
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
        color: sub
      }
    }, r.ages)), React.createElement("span", {
      style: {
        display: 'flex',
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
    }, React.createElement(RdGlyph, {
      d: RD_STAFF_D,
      size: 13,
      width: 2
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
    }, r.signed, "/", r.booked), React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: sub
      }
    }, "Signed in")), showStaff && React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 17,
      width: 2
    }))));
  }
  const RD_HEAD_H = 30;
  function RdGroupHead({
    label,
    count,
    total,
    action,
    sub,
    compact
  }) {
    const narrowed = typeof total === 'number' && total > count;
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
    }, React.createElement("span", {
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
    }, narrowed ? `${count} of ${total}` : count), action && React.createElement(React.Fragment, null, React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    onPick
  }) {
    const urgent = rdIsLate(c.alert);
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
        color: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)'
      }
    }, c.alert.label, showRoom ? ` · ${roomName}` : '')), React.createElement("span", {
      style: {
        color: urgent ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-on-orange)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
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
    }, React.createElement(RdGlyph, {
      d: k === 'in' ? RD_SIGNIN_D : k === 'out' ? RD_SIGNOUT_D : RD_CLOSE_D,
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
    }, n), React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 15,
      width: 2
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
    }), React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 15,
      width: 2
    })))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Selected"), React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 12,
      width: 2
    })))))));
  }
  function RdPaneNow({
    d,
    wide
  }) {
    const hcCard = d.headcount ? React.createElement("button", {
      type: "button",
      onClick: d.openHeadcount,
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
        background: d.headcount.overdue ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-cyan)'
      }
    }, React.createElement("span", {
      style: {
        color: d.headcount.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-action-primary)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
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
        fontWeight: 700
      }
    }, "Head count ", d.headcount.overdue ? 'overdue' : 'due soon'), React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        textWrap: 'pretty',
        color: d.headcount.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
      }
    }, d.headcount.note)), React.createElement("span", {
      style: {
        color: d.headcount.overdue ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-action-primary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
    }))) : null;
    return React.createElement(RdPaneShell, {
      wide: wide,
      title: "Now",
      footer: d.actions.map(a => React.createElement(RdAction, {
        key: a.key,
        glyph: a.glyph,
        primary: a.primary,
        full: true,
        onClick: a.onClick,
        muted: !a.onClick
      }, a.label))
    }, d.headcount && d.headcount.overdue && hcCard, !!d.bulkEvents.length && React.createElement("div", {
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
    }, d.bulkScope.narrowed ? d.bulkScope.count ? 'Follows the filter — only the children on the list right now. Adjust the exceptions in the sheet.' : 'Nobody on the list right now is signed in, so there is no one to log for. Clear the filter to log for the room.' : 'Each round starts with the children it applies to — a sleep check with those asleep, sunscreen with those awake. The rest are in the sheet, ready to add. Filter or group the list first to log for fewer.'), React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
    }))))), d.dueChildren.length ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "Due now"), d.dueChildren.map(c => React.createElement(RdDueItem, {
      key: c.id,
      c: c,
      showRoom: d.scope === 'service',
      roomName: d.roomNameOf(c),
      onPick: d.openDueChild
    })), !!(d.dueGroups || []).length && React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 7,
        marginTop: 2
      }
    }, d.dueGroups.map(g => React.createElement("button", {
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
    }), g.label, " for these ", g.ids.length)))) : !d.ratioBreaches.length && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 22,
      width: 2
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
    }, "All checks are up to date.")), d.headcount && !d.headcount.overdue && hcCard, React.createElement("div", {
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
    })));
  }
  function RdPaneChild({
    c,
    scope,
    roomName,
    wide,
    offline,
    isPending,
    readOnly,
    onChooseEvent,
    onIncident,
    onSign,
    onCorrect,
    onProfile,
    onClose,
    onOpenRoom
  }) {
    const sub = 'var(--sd-colour-text-secondary)';
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
    }, React.createElement(RdGlyph, {
      d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
    }))) : null;
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
    }, scope === 'service' ? `${roomName} · ` : '', c.status === 'here' ? React.createElement(React.Fragment, null, "Signed in ", React.createElement("b", {
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
    }, RD_AMPM(c.at))) : c.status === 'holiday' ? 'On holiday' : c.status === 'other' ? 'No booking today' : 'Absent today')));
    const flags = c.alert || c.collect || (c.tags || []).length ? React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, c.alert && React.createElement(RdAlert, {
      alert: c.alert
    }), React.createElement(RdCollectPill, {
      collect: c.collect,
      full: true
    }), (c.tags || []).map(t => React.createElement(RdTag, {
      key: t
    }, t))) : null;
    const canCorrect = onCorrect && c.status === 'here';
    const today = React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Today"), (c.last || []).length ? (c.last || []).map(entry => {
      const [k, t, detail, note, ctx] = entry;
      const amended = corrected.includes(k);
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
      }, k === 'sleep' && ctx === 'Rest' ? 'Rest' : RD_EVENT_LABEL[k]), detail && React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 600
        }
      }, "\xB7 ", detail), amended && React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 7px',
          borderRadius: 'var(--sd-radius-full)',
          background: 'var(--sd-colour-surface-grey)',
          color: sub
        }
      }, "Amended"), isPending && isPending(c, k) ? React.createElement(RdPendingTag, null) : null), note && React.createElement("span", {
        style: {
          fontSize: 12,
          fontStyle: 'italic',
          color: sub
        }
      }, "\u201C", note, "\u201D")), React.createElement("span", {
        style: {
          color: sub,
          fontWeight: 600,
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }
      }, RD_AMPM(t)), canCorrect && React.createElement("span", {
        style: {
          color: sub,
          flexShrink: 0
        }
      }, React.createElement(RdGlyph, {
        d: "M4 20h4l10-10-4-4L4 16v4ZM13.5 6.5l4 4",
        size: 14
      })));
      return canCorrect ? React.createElement("button", {
        key: k,
        type: "button",
        onClick: () => onCorrect({
          kind: k,
          at: t,
          detail,
          note
        }),
        className: "fp-row",
        "aria-label": `Amend ${RD_EVENT_LABEL[k]}`,
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
    }) : React.createElement("span", {
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
    const logNote = c.status !== 'here' && !c.blocked || anyLocked ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, c.status !== 'here' && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, c.status === 'expected' ? `${c.name.split(' ')[0]} hasn’t been signed in yet — arrival comes first.` : c.status === 'gone' ? 'Signed out for the day.' : c.status === 'holiday' ? 'On holiday today.' : c.status === 'other' ? 'No booking today — signing in will create one.' : 'Marked absent today.'), anyLocked && React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: sub
      }
    }, "Health events and medication are logged in the child\u2019s room, so they\u2019re unavailable from the service dashboard.")) : null;
    const blocked = offline ? React.createElement(RdBlockedNote, {
      label: "Messaging a family"
    }) : null;
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
    }, React.createElement(RdGlyph, {
      d: RD_LOCK_D,
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
        glyph: RD_LOCK_D,
        full: true,
        muted: true
      }, "Read-only \xB7 past day") : c.blocked ? React.createElement(RdAction, {
        glyph: RD_LOCK_D,
        full: true,
        muted: true
      }, "Can\u2019t sign in here") : React.createElement(React.Fragment, null, anyLocked ? React.createElement(RdAction, {
        glyph: RD_CHEV_D,
        primary: true,
        full: true,
        onClick: onOpenRoom
      }, "Open ", roomName, " to log") : c.status === 'expected' || c.status === 'other' ? onSign ? React.createElement(RdAction, {
        glyph: RD_SIGNIN_D,
        primary: true,
        full: true,
        onClick: () => onSign('in')
      }, "Sign in ", c.name.split(' ')[0]) : React.createElement(RdAction, {
        glyph: RD_LOCK_D,
        full: true,
        muted: true
      }, "Sign in needs a connection") : c.status === 'here' ? React.createElement(RdAction, {
        glyph: RD_TICK_D,
        primary: true,
        full: true,
        onClick: onChooseEvent
      }, "Log an event") : null, c.status === 'here' && !anyLocked && onSign && React.createElement(RdAction, {
        glyph: RD_SIGNOUT_D,
        full: true,
        onClick: () => onSign('out')
      }, "Sign out"), React.createElement(RdAction, {
        glyph: "M6 3h9l4 4v14H6V3ZM14 3v5h5M9 13h7M9 17h5",
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
    }, today)), blockedSignIn, logNote, profileLink, auditTrail, blocked) : React.createElement(React.Fragment, null, identity, flags, blockedSignIn, logNote, profileLink, today, blocked, auditTrail));
  }
  function RdLogIcon({
    kind,
    size = 16
  }) {
    if (kind === 'in') return React.createElement(RdGlyph, {
      d: RD_SIGNIN_D,
      size: size
    });
    if (kind === 'out') return React.createElement(RdGlyph, {
      d: RD_SIGNOUT_D,
      size: size
    });
    return React.createElement(RdColourIcon, {
      kind: kind,
      size: size
    });
  }
  function RdEventLog({
    child,
    history,
    dayOffset = 0,
    onEdit,
    hideHeading = false
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
    const timeline = rdTimeline(child, dayOffset);
    const dayLabel = (RD_LOG_DAYS[dayOffset] || RD_LOG_DAYS[0]).day;
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
    }, timeline.length, " events"), past && React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--grey ds-pill--minimal"
    }, "Closed record")), timeline.length ? React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, timeline.map((e, i) => {
      const last = i === timeline.length - 1;
      const editable = !!onEdit && !!e.live && !past;
      return React.createElement("div", {
        key: i,
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--sd-colour-surface-grey)',
          color: 'var(--sd-colour-text-secondary)'
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
      }, React.createElement("span", {
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
      }, e.title), e.live && React.createElement("span", {
        style: chip('var(--sd-colour-surface-cyan)', 'var(--sd-colour-text-on-cyan)')
      }, "Just logged"), e.amended && React.createElement("span", {
        style: chip('var(--sd-colour-surface-grey)', sub)
      }, "Amended")), editable && React.createElement("button", {
        type: "button",
        onClick: () => onEdit({
          kind: e.kind,
          at: e.at,
          detail: e.value || null,
          note: e.note || null
        }),
        "aria-label": `Amend ${e.title}`,
        className: "fp-btn",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 9px',
          borderRadius: 'var(--sd-radius-full)',
          border: '1px solid var(--sd-colour-border-default)',
          color: 'var(--sd-colour-action-primary)',
          fontSize: 11.5,
          fontWeight: 700
        }
      }, React.createElement(RdGlyph, {
        d: "M4 20h4l10-10-4-4L4 16v4ZM13.5 6.5l4 4",
        size: 13
      }), "Amend")), React.createElement("span", {
        style: {
          fontSize: 13,
          color: 'var(--sd-colour-text-primary)'
        }
      }, e.detail), React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 600,
          color: sub
        }
      }, e.by, e.note ? React.createElement(React.Fragment, null, " \xB7 ", React.createElement("span", {
        style: {
          fontWeight: 500,
          fontStyle: 'italic'
        }
      }, e.note)) : null)));
    })) : React.createElement("span", {
      style: {
        fontSize: 13,
        color: sub
      }
    }, past ? `Nothing logged — ${child.name.split(' ')[0]} wasn’t in ${dayLabel.toLowerCase()}.` : `Nothing logged yet — ${child.name.split(' ')[0]} hasn’t been signed in today.`), !past && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CAL_D,
      size: 16
    }), (RD_LOG_DAYS[value] || RD_LOG_DAYS[0]).day, React.createElement("span", {
      style: {
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex'
      }
    }, React.createElement(RdGlyph, {
      d: "M6 9l6 6 6-6",
      size: 14,
      width: 2
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
      name: person.name,
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
    }, person.name), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: sub
      }
    }, person.rel, " \xB7 ", person.phone), person.noCollect && React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: "M6 9l6 6 6-6",
      size: 16,
      width: 2
    })))), React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: a.on ? RD_TICK_D : RD_CLOSE_D,
      size: 15,
      width: a.on ? 2.4 : 2
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
    onEdit,
    onClose
  }) {
    const [openContact, setOpenContact] = useState(null);
    const [dayOffset, setDayOffset] = useState(0);
    const [active, setActive] = useState(null);
    const scroller = useRef(null);
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
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
    const rescue = ongoing.find(m => /anaphylaxis|000/i.test(m.window || '')) || null;
    const medFor = tag => {
      const key = String(tag).split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return key ? ongoing.find(m => new RegExp(key, 'i').test(m.auth || '')) || null : null;
    };
    const flags = [];
    if (child.anaphylaxis) {
      const bits = rescue ? [`${rescue.auth} on file`, `${shortName(rescue.name)} travels with ${first}`, ...(/000/.test(rescue.window || '') ? ['call 000 after giving'] : [])] : ['Action plan on file'];
      flags.push({
        tone: 'crit',
        mark: RD_SHIELD_D,
        title: `Anaphylaxis${allergens.length ? ' — ' + allergens.join(' and ') : ''}`,
        meta: bits.join(' · '),
        action: null
      });
    }
    if (child.collect) {
      const k = child.collect;
      flags.push({
        tone: 'restrict',
        mark: RD_LOCK_D,
        title: `${rdCollectLabel(k)} — ${k.who} can’t collect`,
        meta: [k.note, k.courtOrder ? `Court order held by the office${k.onFile ? ` · ${k.onFile}` : ''}.` : null].filter(Boolean).join(' '),
        action: null
      });
    }
    tags.forEach(t => {
      if (child.anaphylaxis && /allerg(y|ies)/i.test(t)) return;
      const m = medFor(t);
      flags.push({
        tone: 'warn',
        mark: m ? RD_ICONS.med : RD_SHIELD_D,
        title: t,
        meta: m ? `${m.auth} on file · ${shortName(m.name)}${m.kept ? ' ' + m.kept : ''} — travels with ${first}, between rooms and on every excursion` : null,
        action: null
      });
    });
    if (child.disability) flags.push({
      tone: 'calm',
      mark: RD_STAFF_D,
      title: 'Additional needs',
      meta: 'Recorded on the enrolment record.',
      action: null
    });
    if (p.special) {
      const cut = p.special.indexOf('. ');
      const tone = p.specialTone === 'warn' ? 'warn' : 'calm';
      flags.push({
        tone,
        mark: tone === 'warn' ? RD_WARN_D : RD_NOTE_D,
        title: cut > 0 ? p.special.slice(0, cut) : p.special,
        meta: cut > 0 ? p.special.slice(cut + 2) : null,
        action: null
      });
    }
    const flagVariant = {
      crit: ' ds-message-box--red',
      warn: ' ds-message-box--orange',
      restrict: ''
    };
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
    }, React.createElement(RdGlyph, {
      d: f.mark,
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
      className: `ds-message-box${flagVariant[f.tone]}`
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(RdGlyph, {
      d: f.mark,
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
      }, React.createElement(RdGlyph, {
        d: RD_BAG_D,
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
    }, glance.map(([kind, at, detail]) => React.createElement("div", {
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
    }, RD_AMPM(at)), detail && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: sub
      }
    }, detail)))), React.createElement(RdEventLog, {
      child: child,
      history: p.history,
      dayOffset: dayOffset,
      onEdit: readOnly ? undefined : onEdit,
      hideHeading: true
    }));
    const secs = [{
      id: 'health',
      mark: RD_SHIELD_D,
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
      mark: RD_ICONS.med,
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
      }, React.createElement(RdGlyph, {
        d: RD_ATTACH_D,
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
      mark: RD_STAFF_D,
      nav: 'Guardians',
      title: 'Parents & guardians',
      badge: p.guardians.length,
      dot: child.collect ? 'restrict' : null,
      body: React.createElement("div", {
        style: tile
      }, p.guardians.map(g => React.createElement("div", {
        key: g.name,
        className: "ds-accordion ds-accordion--separated"
      }, React.createElement(RdContactCard, {
        person: g,
        open: openContact === g.name,
        onToggle: () => setOpenContact(o => o === g.name ? null : g.name)
      }))))
    }, {
      id: 'emergency',
      mark: RD_PHONE_D,
      nav: 'Emergency contact',
      title: 'Emergency contact',
      badge: 1,
      body: React.createElement("div", {
        style: {
          maxWidth: 480
        }
      }, React.createElement("div", {
        className: "ds-accordion ds-accordion--separated"
      }, React.createElement(RdContactCard, {
        person: p.emergency,
        open: openContact === p.emergency.name,
        onToggle: () => setOpenContact(o => o === p.emergency.name ? null : p.emergency.name)
      })))
    }, {
      id: 'about',
      mark: RD_NOTE_D,
      nav: `About ${first}`,
      title: `About ${first}`,
      body: React.createElement("div", {
        style: {
          maxWidth: 660,
          padding: '13px 15px',
          borderRadius: 'var(--sd-radius-lg)',
          background: 'var(--sd-colour-surface-grey)',
          fontSize: 14.5,
          lineHeight: 1.55
        }
      }, p.about)
    }, {
      id: 'docs',
      mark: RD_ATTACH_D,
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
        }, React.createElement(RdGlyph, {
          d: RD_ATTACH_D,
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
      mark: RD_CLOCK_D,
      nav: logTitle,
      title: logTitle,
      rule: true,
      badge: logCount,
      notes: (logCount ? [`${logCount} events`] : []).concat(logPast ? ['Closed record'] : []),
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
    const RD_NAV_MARK = {
      crit: 'critical',
      warn: 'needs attention',
      restrict: 'collection restricted'
    };
    const navRow = s => {
      const on = active === s.id;
      return React.createElement("button", {
        key: s.id,
        type: "button",
        className: "fp-btn",
        onClick: () => jump(s.id),
        "aria-current": on ? 'true' : undefined,
        "aria-label": `${s.nav}${s.dot ? `, ${RD_NAV_MARK[s.dot]}` : ''}`,
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
      }, React.createElement(RdGlyph, {
        d: s.mark,
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
        style: {
          flexShrink: 0,
          display: 'inline-flex',
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, React.createElement(RdGlyph, {
        d: RD_SHIELD_D,
        size: 14,
        width: 2.4
      })), (s.dot === 'warn' || s.dot === 'restrict') && React.createElement("span", {
        "aria-hidden": "true",
        style: {
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: 'var(--sd-radius-full)',
          background: s.dot === 'warn' ? 'var(--sd-colour-feedback-warning-default)' : 'var(--sd-colour-text-secondary)'
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
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0,
        display: 'inline-flex'
      }
    }, React.createElement(RdGlyph, {
      d: RD_SHIELD_D,
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
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        ...(split ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        } : {
          overflowWrap: 'anywhere'
        })
      }
    }, child.name), React.createElement("span", {
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
    }, child.age != null ? `${child.age} yrs` : 'Age not specified', " \xB7 ", roomName, dayOffset > 0 ? '' : child.status === 'here' ? ` · here since ${RD_AMPM(child.at)}` : child.status === 'gone' ? ` · signed out ${RD_AMPM(child.at)}` : '')), React.createElement("span", {
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
      onPick: setDayOffset
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 16,
      width: 2
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
    }, secs.map((s, i) => React.createElement("section", {
      key: s.id,
      "data-sec": s.id,
      style: {
        padding: '20px 0 4px',
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
        glyph: RD_CHEV_D,
        primary: true,
        full: true,
        onClick: onOpenRoom
      }, "Open ", r.name), React.createElement(RdAction, {
        glyph: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20h4a6 6 0 0 0-4-5.7",
        full: true
      }, "Head count"))
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
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
    }, React.createElement(RdLabel, null, "Attendance"), [['Signed in', `${r.signed} of ${r.booked}`], ...(showStaff ? [['Educators on floor', String(r.educators)], ['Ratio', `1:${r.ratio}` + (breach ? ` (limit 1:${r.limit})` : '')]] : []), ['Checks due', String(r.due)]].map(([k, v]) => React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
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
    }))), (d.showGrouping || d.showFilter) && React.createElement(RdFilterBar, {
      d: d,
      compact: compact
    }), d.staleNote && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 12,
        fontWeight: 600,
        color: RD_SYNC_FG,
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 14
    }), d.staleNote), React.createElement("div", {
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
      return d.work.length ? d.work.map(g => React.createElement("section", {
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
        compact: compact
      }), rows(g.items))) : React.createElement(RdEmpty, {
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
      wide: bottom,
      offline: d.conn === 'offline',
      isPending: d.isPendingEvent,
      readOnly: d.readOnly,
      onChooseEvent: () => d.openChooser(d.selected),
      onIncident: () => d.openIncident(d.selected),
      onSign: d.canAttend ? dir => d.openSign(d.selected, dir) : undefined,
      onCorrect: d.scope === 'room' && !d.readOnly && d.canAmend ? entry => d.openCorrect(d.selected, entry) : undefined,
      onProfile: () => d.openProfile(d.selected),
      onClose: () => d.openChild(null),
      onOpenRoom: () => d.goRoom(d.selected.room)
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
    if (!split) return React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        padding: pad,
        position: 'relative'
      }
    }, list, !!(d.selected || d.selectedRoom || d.tickedCount) && React.createElement("div", {
      className: "rd-sheet",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'var(--sd-colour-surface-default)'
      }
    }, pane));
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
        gap: 10,
        padding: pad,
        flexShrink: 0,
        borderTop: '1px solid var(--sd-colour-border-default)',
        background: 'var(--sd-colour-surface-default)'
      }
    }, d.actions.map(a => React.createElement(RdAction, {
      key: a.key,
      glyph: a.glyph,
      primary: a.primary,
      full: d.actions.length === 1,
      onClick: a.onClick,
      muted: !a.onClick
    }, a.label)));
  }
  function RdConnChip({
    conn,
    syncing,
    pending,
    synced,
    onOpen
  }) {
    if (conn === 'online' && !syncing && !pending && synced) {
      return React.createElement("span", {
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
      }, React.createElement(RdGlyph, {
        d: RD_TICK_D,
        size: 16,
        width: 2.4
      }), "All ", synced, " synced");
    }
    if (conn === 'online' && !syncing && !pending) return null;
    const offline = conn === 'offline';
    return React.createElement("button", {
      type: "button",
      onClick: onOpen,
      className: "fp-btn",
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
    }, React.createElement(RdGlyph, {
      d: syncing ? RD_SYNC_D : RD_OFFLINE_D,
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 11,
      width: 2
    }), children);
  }
  function RdPendingSheet({
    conn,
    pending,
    syncing,
    synced,
    educator = RD_EDUCATOR,
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
      glyph: RD_TICK_D
    } : syncing ? {
      title: 'Sending…',
      sub: nSending === 1 ? '1 record on its way' : `${nSending} records on their way`,
      bg: RD_SYNC_BG,
      fg: RD_SYNC_FG,
      glyph: RD_SYNC_D
    } : {
      title: conn === 'offline' ? 'No connection' : 'Waiting to sync',
      sub: `${pending.length} record${pending.length === 1 ? '' : 's'} saved on this device`,
      bg: RD_SYNC_BG,
      fg: RD_SYNC_FG,
      glyph: RD_OFFLINE_D
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
    }, React.createElement(RdGlyph, {
      d: head.glyph,
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, done ? React.createElement(React.Fragment, null, "Nothing is left on the device. Every record went up with the time it happened and ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, educator.name), " on it.") : React.createElement(React.Fragment, null, "Everything below is recorded and attributed to ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, educator.name), " with the time it happened. It will send on its own once there\u2019s signal \u2014 keep working.")), rows.length ? rows.map(p => React.createElement("div", {
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
    }, "Recorded ", RD_AMPM(p.at))), done ? React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--green ds-pill--minimal"
    }, React.createElement("span", {
      className: "ds-pill__icon"
    }, React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 14,
      width: 2.6
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
    }, React.createElement(RdGlyph, {
      d: RD_SYNC_D,
      size: 11,
      width: 2
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
      glyph: done ? RD_TICK_D : undefined,
      onClick: onClose
    }, done ? 'Done' : 'Keep working'))));
  }
  function RdBlockedNote({
    label
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
    }, React.createElement(RdGlyph, {
      d: RD_OFFLINE_D,
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: RD_SYNC_FG
      }
    }, label, " needs a connection. Everything else here still works and will sync later."));
  }
  const RD_SEG_CHROME = 10;
  function RdSegmented({
    options,
    value,
    onChange,
    ariaLabel = 'Choose an option',
    size = 'touch',
    variant
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
    future = false
  }) {
    const ref = React.useRef(null);
    const nowMins = RD_MINS(now);
    const back = future ? 0 : nowMins - RD_MINS(value);
    const set = v => {
      if (v) onChange(future || RD_MINS(v) <= nowMins ? v : now);
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 17
    }), React.createElement("input", {
      ref: ref,
      type: "time",
      value: value ? RD_PAD(value) : '',
      max: future ? undefined : RD_PAD(now),
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
      onClick: () => onChange(now),
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
    }, RD_AMPM(value)), back > 0 ? ` · ${back} minute${back === 1 ? '' : 's'} ago` : ' · now'));
  }
  function RdDropdownShell({
    label,
    value,
    count,
    active,
    wide,
    ariaLabel,
    children
  }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);
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
    }, label), React.createElement("b", {
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
    }, React.createElement(RdGlyph, {
      d: "M6 9l6 6 6-6",
      size: 14,
      width: 2
    }))), open && React.createElement("div", {
      role: "menu",
      style: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        zIndex: 20,
        minWidth: wide ? 320 : 216,
        background: 'var(--sd-colour-surface-default)',
        border: '1px solid var(--sd-colour-border-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 16px 40px rgba(0,40,34,0.22)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: 400,
        overflowY: 'auto'
      }
    }, children(() => setOpen(false))));
  }
  function RdDropdown({
    label,
    value,
    options,
    onChange,
    counts,
    plain,
    wide
  }) {
    const current = options.find(o => o.key === value) || options[0];
    const active = !plain && value !== options[0].key;
    return React.createElement(RdDropdownShell, {
      label: label,
      value: current.label,
      active: active,
      wide: wide,
      count: counts && counts[current.key] !== undefined ? counts[current.key] : undefined
    }, close => options.map(o => {
      const on = o.key === value;
      return React.createElement("button", {
        key: o.key,
        type: "button",
        role: "menuitemradio",
        "aria-checked": on,
        onClick: () => {
          onChange(o.key);
          close();
        },
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
      }, on && React.createElement(RdGlyph, {
        d: RD_TICK_D,
        size: 15,
        width: 2.6
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, o.label), counts && counts[o.key] !== undefined && React.createElement("span", {
        style: {
          fontWeight: 700,
          color: 'var(--sd-colour-text-secondary)'
        }
      }, counts[o.key]));
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
      d: RD_TICK_D,
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
  function RdFacetDropdown({
    pool,
    on,
    setOn
  }) {
    const chips = rdFacetChips(on);
    const toggle = (f, v) => setOn(o => {
      const cur = o[f.key] || [];
      const next = cur.includes(v.key) ? cur.filter(k => k !== v.key) : [...cur, v.key];
      const out = {
        ...o
      };
      if (next.length) out[f.key] = next;else delete out[f.key];
      return out;
    });
    return React.createElement(RdDropdownShell, {
      wide: true,
      active: !!chips.length,
      label: "Filter",
      value: chips.length ? `${chips.length} active` : 'Everyone'
    }, () => RD_FACETS.map(f => React.createElement("div", {
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
      }, isOn && React.createElement(RdGlyph, {
        d: RD_TICK_D,
        size: 15,
        width: 2.6
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
    }))));
  }
  function RdFilterBar({
    d,
    compact
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 15,
      width: 2
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 15,
      width: 2.2
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
    }), React.createElement("span", null, d.shownTickState === 'checked' ? `Clear these ${d.shownIds.length}` : d.grouped ? `Select everyone · ${d.shownIds.length}` : `Select all ${d.shownIds.length}`));
    const chips = rdFacetChips(d.facets || {});
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement("div", {
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
    }, compact && (summary || clearFiltersBtn || selectAll), d.showFilter && React.createElement(RdFacetDropdown, {
      pool: d.facetPool,
      on: d.facets,
      setOn: d.setFacets
    }), d.showGrouping && React.createElement(React.Fragment, null, React.createElement(RdDropdown, {
      label: "Group",
      value: d.grouping,
      options: d.groupingOptions,
      onChange: d.setGrouping
    }), React.createElement(RdDropdown, {
      label: "Sort",
      value: d.sortKey,
      options: d.sortOptions,
      onChange: d.setSortKey
    })), !compact && React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }), !compact && (summary || clearFiltersBtn || selectAll)), !!chips.length && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 14,
      width: 2
    })))), d.selectRule !== RULE_FILTER && React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--ghost ds-btn--sm",
      onClick: () => d.setFacets({})
    }, "Clear filters")));
  }
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
          gap: 8,
          flexBasis: '100%',
          minWidth: '100%',
          marginTop: 10
        }
      }, gs.map(g => React.createElement("div", {
        key: g.cat || 'all',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }
      }, g.label && React.createElement("span", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--sd-colour-text-secondary)',
          width: 48,
          flexShrink: 0
        }
      }, g.label), options.filter(o => !g.cat || o.cat === g.cat).map(o => {
        const sel = on.includes(o.key);
        return React.createElement("button", {
          key: o.key,
          type: "button",
          "aria-pressed": sel,
          onClick: () => toggle(o.key),
          className: "fp-btn",
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 36,
            padding: '0 13px',
            borderRadius: 'var(--sd-radius-full)',
            fontSize: 13.5,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            border: `2px solid ${sel ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
            background: sel ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
            color: sel ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
          }
        }, sel && React.createElement(RdGlyph, {
          d: RD_TICK_D,
          size: 13,
          width: 3
        }), o.label);
      }))))
    );
  }
  function RdBulkSheet({
    eventKey,
    people,
    offline,
    flaky,
    advanced,
    sleepTrack,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onCommit
  }) {
    const cfg = RD_BULK[eventKey];
    const single = people.length === 1;
    const advancedOn = !!(advanced && cfg.advanced);
    const [roomTemp, setRoomTemp] = useState('');
    const [shared, setShared] = useState(eventKey === 'sleep' ? sleepTrack || cfg.shared && cfg.shared.value : cfg.shared && (cfg.shared.options || cfg.shared.select) ? cfg.shared.value : null);
    const [trackOpen, setTrackOpen] = useState(false);
    const blockedReason = c => {
      if (cfg.attendance === 'in') {
        return c.status === 'expected' || c.status === 'other' ? null : c.status === 'here' ? 'Already signed in' : c.status === 'gone' ? 'Already signed out' : c.status === 'holiday' ? 'On holiday' : 'Marked absent';
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
      value: cfg.attendance === 'out' && c.collect ? null : cfg.perChild && cfg.perChild.multi ? [...(cfg.perChild.value || [])] : c.prefs && cfg.prefKey && c.prefs[cfg.prefKey] || cfg.perChild && cfg.perChild.value || cfg.shared && cfg.shared.value || null,
      detailOpen: false,
      at: cfg.seedBySelection ? RD_HHMM(RD_MINS(RD_NOW) - (people.length - 1 - i)) : null,
      checks: advancedOn ? Object.fromEntries(RD_SLEEP_CHECKS.map(k => [k.key, k.options[0]])) : null,
      fromPref: !!(c.prefs && cfg.prefKey && c.prefs[cfg.prefKey]),
      named: cfg.attendance === 'out' && !!c.collect,
      note: c.prefNotes && cfg.prefKey && c.prefNotes[cfg.prefKey] || '',
      noteOpen: !!(c.prefNotes && cfg.prefKey && c.prefNotes[cfg.prefKey]),
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
    const noWho = included.filter(r => r.named && !r.value);
    const [result, setResult] = useState(null);
    const sharedLabel = () => {
      if (cfg.shared && cfg.shared.select) return (cfg.shared.select.find(o => o.key === shared) || {}).label || null;
      if (cfg.shared && cfg.shared.options) return shared || null;
      return null;
    };
    const detailsOf = ids => {
      const m = {};
      const ctx = sharedLabel();
      rows.filter(r => ids.includes(r.id)).forEach(r => {
        m[r.id] = {
          at: r.at || time,
          type: eventKey === 'sleep' ? (RD_SLEEP_TYPE[shared] || {})[r.value] || null : null,
          roundType: eventKey === 'sleep' ? RD_SLEEP_ROUND[shared] || null : null,
          detail: cfg.perChild && cfg.perChild.multi ? rdMultiLabel(cfg.perChild.options, r.value) : r.value || null,
          cats: cfg.perChild && cfg.perChild.multi ? rdMultiCats(cfg.perChild.options, r.value) : null,
          note: (r.note || '').trim() || null,
          context: ctx,
          checks: r.checks || null,
          roomTemp: (roomTemp || '').trim() || null
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
          failedIds
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
      if (cfg.shared && cfg.shared.carry) setRows(rs => rs.map(r => r.fromPref || r.touched || r.named ? r : {
        ...r,
        value: v
      }));
    };
    const perOptions = cfg.perChild && cfg.perChild.options || cfg.shared && cfg.shared.options || null;
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
        maxWidth: 940,
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
        flexDirection: 'column',
        gap: 14,
        flexShrink: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
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
    }, React.createElement(RdColourIcon, {
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
      style: {
        fontSize: 19,
        fontWeight: 700
      }
    }, eventKey === 'sleep' ? rdEventTitle('sleep', shared) : cfg.label), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, single ? people[0].name : `${included.length} of ${rows.length} children`, !single && !!blockedCount && React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, " \xB7 ", blockedCount, " not in the room"))), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 20
    }))), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        flexWrap: 'wrap'
      }
    }, eventKey === 'sleep' && cfg.shared && cfg.shared.options && React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, trackOpen ? React.createElement(React.Fragment, null, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "This round is"), React.createElement(RdSegmented, {
      options: cfg.shared.options,
      value: shared,
      onChange: applyShared,
      ariaLabel: cfg.shared.label
    })) : React.createElement(React.Fragment, null, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, shared === 'Rest' ? 'A rest round' : 'A sleep round', React.createElement("span", {
      style: {
        opacity: 0.75
      }
    }, " \xB7 this room's setting")), React.createElement("button", {
      type: "button",
      onClick: () => setTrackOpen(true),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        height: 30,
        padding: '0 12px',
        borderRadius: 'var(--sd-radius-full)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)'
      }
    }, "Change for this round"))), eventKey !== 'sleep' && cfg.shared && cfg.shared.options && (!single || !cfg.shared.carry) && React.createElement("span", {
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
      options: cfg.shared.options,
      value: shared,
      onChange: applyShared,
      ariaLabel: cfg.shared.label
    })), cfg.shared && cfg.shared.select && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, cfg.shared.label), React.createElement(RdDropdown, {
      label: "",
      plain: true,
      wide: true,
      value: shared,
      options: cfg.shared.select,
      onChange: setShared
    })), cfg.warning && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l9 16H3L12 3ZM12 9v5M12 17h.01",
      size: 18
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, cfg.warning)), advancedOn && cfg.roomTemp && React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Room temperature (optional)"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      inputMode: "decimal",
      value: roomTemp,
      onChange: e => setRoomTemp(e.target.value),
      placeholder: "\xB0C",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width: 120,
        height: 40,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 14
      }
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Time for everyone"), React.createElement(RdTimeField, {
      value: time,
      onChange: setTime,
      ariaLabel: "Time for everyone"
    })))), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '12px 22px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, rows.map(r => {
      const c = people.find(x => x.id === r.id);
      const blocked = blockedReason(c);
      const off = r.excluded || !!blocked;
      return (React.createElement("div", {
          key: r.id,
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            padding: '9px 12px',
            borderRadius: 'var(--sd-radius-lg)',
            border: '1px solid var(--sd-colour-border-default)',
            background: r.fromPref && !off ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)'
          }
        }, React.createElement("span", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flex: 1,
            minWidth: 160,
            opacity: off ? 0.45 : 1
          }
        }, React.createElement(RdKid, {
          c: c,
          size: 34
        }), React.createElement("span", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: 150,
            flexShrink: 0
          }
        }, React.createElement("span", {
          style: {
            fontSize: 14.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, c.name), blocked ? React.createElement("span", {
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--sd-colour-text-on-orange)'
          }
        }, blocked) : r.excluded ? React.createElement("span", {
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--sd-colour-text-secondary)'
          }
        }, r.softReason || 'Not included') : r.fromPref ? c.prefs && r.value !== c.prefs[cfg.prefKey] ? React.createElement("span", {
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--sd-colour-text-on-orange)'
          }
        }, "Changed from profile (", String(c.prefs[cfg.prefKey]).toLowerCase(), ")") : React.createElement("span", {
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--sd-colour-action-primary)'
          }
        }, "From profile") : r.softReason && React.createElement("span", {
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--sd-colour-action-primary)'
          }
        }, "Added \xB7 ", r.softReason.replace(/ —.*$/, ''))), React.createElement("span", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }), !!r.note && !r.noteOpen && React.createElement("span", {
          style: {
            fontSize: 12,
            fontStyle: 'italic',
            color: 'var(--sd-colour-text-secondary)',
            maxWidth: 160,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, "\u201C", r.note, "\u201D")), perOptions && !off && (cfg.perChild && cfg.perChild.multi ? React.createElement("button", {
          type: "button",
          "aria-expanded": !!r.detailOpen,
          onClick: () => set(r.id, {
            detailOpen: !r.detailOpen
          }),
          className: "fp-btn",
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            height: 36,
            padding: '0 12px',
            borderRadius: 'var(--sd-radius-full)',
            maxWidth: 260,
            border: '1px solid var(--sd-colour-border-default)',
            background: 'var(--sd-colour-surface-default)',
            fontSize: 13.5,
            fontWeight: 600,
            color: 'var(--sd-colour-text-primary)'
          }
        }, React.createElement("span", {
          style: {
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, rdMultiLabel(cfg.perChild.options, r.value) || 'Nothing recorded'), React.createElement("span", {
          "aria-hidden": "true",
          style: {
            display: 'inline-flex',
            flexShrink: 0,
            color: 'var(--sd-colour-text-secondary)',
            transform: r.detailOpen ? 'rotate(90deg)' : 'none',
            transition: 'transform .15s'
          }
        }, React.createElement(RdGlyph, {
          d: RD_CHEV_D,
          size: 15,
          width: 2.2
        }))) : r.named ? React.createElement(RdChoiceChips, {
          options: rdCollectOptions(c),
          value: r.value,
          onChange: v => set(r.id, {
            value: v,
            touched: true
          }),
          ariaLabel: `Collected by for ${c.name}`
        }) : React.createElement(React.Fragment, null, React.createElement(RdSegmented, {
          options: perOptions,
          value: isNotApplied(r.value) ? null : r.value,
          onChange: v => set(r.id, {
            value: v,
            touched: true,
            ...(isNotApplied(r.value) ? {
              note: '',
              noteOpen: false
            } : {})
          }),
          ariaLabel: `${cfg.perChild ? cfg.perChild.label : cfg.label} for ${c.name}`
        }), pc.notApplied && React.createElement(RdNotAppliedToggle, {
          on: isNotApplied(r.value),
          name: c.name,
          onToggle: () => set(r.id, isNotApplied(r.value) ? {
            value: shared || (pc.options[0] || [])[0],
            touched: true,
            note: '',
            noteOpen: false
          } : {
            value: pc.notApplied,
            touched: true,
            noteOpen: true
          })
        }))), advancedOn && !off && (() => {
          const bad = RD_SLEEP_CHECKS.filter(k => (r.checks || {})[k.key] && (r.checks || {})[k.key] !== k.options[0]);
          if (!bad.length) return null;
          return React.createElement("span", {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              flexShrink: 0,
              height: 30,
              padding: '0 10px',
              borderRadius: 'var(--sd-radius-full)',
              background: 'var(--sd-colour-surface-red)',
              color: 'var(--sd-colour-feedback-error-default)',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }
          }, bad.map(k => (r.checks || {})[k.key]).join(' · '));
        })(), !off && React.createElement("button", {
          type: "button",
          "aria-expanded": !!r.detailOpen,
          "aria-label": `${RD_AMPM(r.at || time)} for ${c.name} — change this child's time`,
          onClick: () => set(r.id, {
            detailOpen: !r.detailOpen
          }),
          className: "fp-btn",
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
            height: 34,
            padding: '0 11px',
            borderRadius: 'var(--sd-radius-full)',
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: `${r.at ? 2 : 1}px solid ${r.at ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
            background: r.at ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
            color: r.at ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
          }
        }, React.createElement(RdGlyph, {
          d: RD_CLOCK_D,
          size: 14
        }), RD_AMPM(r.at || time)), !off && React.createElement("button", {
          type: "button",
          "aria-label": "Add note",
          onClick: () => set(r.id, {
            noteOpen: !r.noteOpen
          }),
          style: {
            all: 'unset',
            cursor: 'pointer',
            width: 34,
            height: 34,
            borderRadius: 'var(--sd-radius-m)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: r.note || r.noteOpen ? 'var(--sd-colour-surface-cyan)' : 'transparent',
            color: r.note || r.noteOpen ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-secondary)'
          }
        }, React.createElement(RdGlyph, {
          d: RD_NOTE_D,
          size: 17
        })), blocked && React.createElement("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            color: 'var(--sd-colour-text-secondary)',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }
        }, React.createElement(RdGlyph, {
          d: RD_LOCK_D,
          size: 15
        }), "Can\u2019t log"), !single && !blocked && (r.excluded ? React.createElement("button", {
          type: "button",
          onClick: () => set(r.id, {
            excluded: false
          }),
          className: "fp-btn",
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            flexShrink: 0,
            height: 36,
            padding: '0 14px',
            borderRadius: 'var(--sd-radius-full)',
            border: '2px solid var(--sd-colour-action-primary)',
            color: 'var(--sd-colour-action-primary)',
            background: 'var(--sd-colour-surface-default)',
            fontSize: 13.5,
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }
        }, React.createElement(RdGlyph, {
          d: "M12 5v14M5 12h14",
          size: 16,
          width: 2.4
        }), "Add back") : React.createElement("button", {
          type: "button",
          "aria-label": `Leave ${c.name.split(' ')[0]} out of this record`,
          onClick: () => set(r.id, {
            excluded: true
          }),
          style: {
            all: 'unset',
            cursor: 'pointer',
            width: 34,
            height: 34,
            borderRadius: 'var(--sd-radius-m)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--sd-colour-text-secondary)'
          }
        }, React.createElement(RdGlyph, {
          d: RD_CLOSE_D,
          size: 17
        }))), (cfg.attendance === 'out' && c.collect || !!(c.tags || []).length) && React.createElement("span", {
          style: {
            flexBasis: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            paddingLeft: 46,
            opacity: off ? 0.45 : 1
          }
        }, cfg.attendance === 'out' && React.createElement(RdCollectPill, {
          collect: c.collect,
          full: true
        }), (c.tags || []).map(t => React.createElement(RdTag, {
          key: t
        }, t))), needsReason(r) && !off && React.createElement("span", {
          style: {
            flexBasis: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 4,
            flexWrap: 'wrap',
            paddingLeft: 46
          }
        }, React.createElement(RdLabel, null, "Why not"), React.createElement(RdChoiceChips, {
          options: pc.reasonFor,
          value: r.value === pc.notApplied ? null : r.value,
          onChange: v => set(r.id, {
            value: v,
            touched: true,
            noteOpen: true
          }),
          ariaLabel: `Why sunscreen was not applied for ${c.name}`
        })), r.noteOpen && React.createElement("input", {
          className: "fp-input",
          autoFocus: !needsReason(r),
          type: "text",
          value: r.note,
          placeholder: needsReason(r) ? 'Reason — required, saved with this child’s time' : 'Note for this child',
          "aria-required": needsReason(r) || undefined,
          onChange: e => set(r.id, {
            note: e.target.value
          }),
          style: {
            all: 'unset',
            boxSizing: 'border-box',
            flexBasis: '100%',
            height: 40,
            padding: '0 14px',
            marginTop: 8,
            borderRadius: 'var(--sd-radius-lg)',
            border: '1px solid var(--sd-colour-border-default)',
            fontFamily: 'var(--sd-font-family)',
            fontSize: 14
          }
        }), r.detailOpen && !off && React.createElement("div", {
          style: {
            flexBasis: '100%',
            minWidth: '100%',
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, React.createElement("span", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, React.createElement(RdLabel, null, `Time for ${c.name.split(' ')[0]}`), React.createElement(RdTimeField, {
          value: r.at || time,
          onChange: v => set(r.id, {
            at: v
          }),
          ariaLabel: `Time for ${c.name}`
        })), cfg.perChild && cfg.perChild.multi && React.createElement(RdPillMulti, {
          groups: cfg.perChild.groups,
          options: cfg.perChild.options,
          value: r.value,
          onChange: v => set(r.id, {
            value: v,
            touched: true
          }),
          ariaLabel: `What was found for ${c.name}`
        }), advancedOn && React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 9
          }
        }, React.createElement("span", {
          style: {
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--sd-colour-text-secondary)'
          }
        }, "Physical check \xB7 seven observation points"), RD_SLEEP_CHECKS.map(k => React.createElement("div", {
          key: k.key,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }
        }, React.createElement("span", {
          style: {
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--sd-colour-text-secondary)',
            width: 132,
            flexShrink: 0
          }
        }, k.label), k.options.map(o => {
          const on = (r.checks || {})[k.key] === o;
          const abnormal = on && o !== k.options[0];
          return React.createElement("button", {
            key: o,
            type: "button",
            "aria-pressed": on,
            onClick: () => set(r.id, {
              checks: {
                ...(r.checks || {}),
                [k.key]: o
              }
            }),
            className: "fp-btn",
            style: {
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              height: 32,
              padding: '0 11px',
              borderRadius: 'var(--sd-radius-full)',
              fontSize: 12.5,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: `${on ? 2 : 1}px solid ${abnormal ? 'var(--sd-colour-feedback-error-default)' : on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'}`,
              background: abnormal ? 'var(--sd-colour-surface-red)' : on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
              color: abnormal ? 'var(--sd-colour-feedback-error-default)' : on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
            }
          }, o);
        }))))))
      );
    })), result && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
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
    }, "The rest went through. ", people.filter(p => result.failedIds.includes(p.id)).map(p => p.name.split(' ')[0]).join(', '), " didn\u2019t \u2014 retry just these.")))), React.createElement(RdSheetFoot, {
      phone: phone,
      divider: !result,
      note: React.createElement(React.Fragment, null, included.length ? React.createElement(React.Fragment, null, "Logged as ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), " at ", RD_AMPM(time), (() => {
        const own = included.filter(r => r.at && r.at !== time).length;
        return own ? React.createElement(React.Fragment, null, " \xB7 ", own, " at ", own === 1 ? 'their own time' : 'their own times') : null;
      })()) : 'None of these children are signed in to the room, so there’s nothing to record.', offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, result ? [React.createElement(RdAction, {
      key: "done",
      onClick: onClose
    }, "Done"), React.createElement(RdAction, {
      key: "retry",
      primary: true,
      glyph: "M20 11a8 8 0 0 0-14-4.5L4 8m0-4v4h4M4 13a8 8 0 0 0 14 4.5L20 16m0 4v-4h-4",
      onClick: retry
    }, "Retry ", result.failedIds.length)] : [React.createElement(RdAction, {
      key: "cancel",
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      key: "confirm",
      primary: true,
      glyph: RD_TICK_D,
      muted: !included.length || !!missing.length || !!noReason.length || !!noWho.length,
      onClick: included.length && !missing.length && !noReason.length && !noWho.length ? doConfirm : undefined
    }, !included.length ? 'Nobody to log for' : missing.length ? React.createElement(React.Fragment, null, "Pick what was found \xB7 ", missing.length, " left") : noReason.length ? React.createElement(React.Fragment, null, "Say why not applied \xB7 ", noReason.length, " left") : noWho.length ? React.createElement(React.Fragment, null, "Say who collected \xB7 ", noWho.length, " left") : React.createElement(React.Fragment, null, included.some(needsReason) ? 'Recorded' : cfg.verb, " for ", single ? people[0].name.split(' ')[0] : included.length))])));
  }
  const RD_MED_ROUTES = ['Oral', 'Inhaled', 'Topical', 'Other'];
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
  function RdMedicationSheet({
    child,
    offline,
    phone,
    educator = RD_EDUCATOR,
    others = [],
    initialDraft,
    onClose,
    onConfirm,
    onDismiss
  }) {
    const meds = child.meds || [];
    const onFile = meds.length > 0;
    const D0 = initialDraft || {};
    const [medName, setMedName] = useState(D0.medName || meds[0] && meds[0].name || null);
    const [freeName, setFreeName] = useState(D0.freeName || '');
    const [freeDose, setFreeDose] = useState(D0.freeDose || '');
    const [route, setRoute] = useState(D0.route || 'Oral');
    const [outcome, setOutcome] = useState(D0.outcome || 'Given');
    const [partAmount, setPartAmount] = useState(D0.partAmount || '');
    const [time, setTime] = useState(D0.time || RD_NOW);
    const [checker, setChecker] = useState(D0.checker || null);
    const [note, setNote] = useState(D0.note || '');
    const [nextMode, setNextMode] = useState(D0.nextMode || 'time');
    const [nextAt, setNextAt] = useState(D0.nextAt || '');
    const [nextWhen, setNextWhen] = useState(D0.nextWhen || '');
    const draft = () => ({
      medName,
      freeName,
      freeDose,
      route,
      outcome,
      partAmount,
      time,
      checker,
      note,
      nextMode,
      nextAt,
      nextWhen
    });
    const hasContent = () => !!(checker || note.trim() || freeName.trim() || freeDose.trim() || partAmount.trim());
    const dismiss = () => onDismiss && hasContent() ? onDismiss(draft()) : onClose();
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') dismiss();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [medName, freeName, freeDose, route, outcome, partAmount, time, checker, note, nextMode, nextAt, nextWhen]);
    const med = meds.find(m => m.name === medName) || meds[0];
    const givenName = onFile ? med && med.name : freeName.trim();
    const givenDose = onFile ? med && med.dose : freeDose.trim();
    const expiry = onFile ? rdMedExpiry(med) : null;
    const ready = !!givenName && !!outcome && !!checker && (outcome !== 'Part dose' || !!partAmount.trim());
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
      "aria-label": "Dismiss",
      onClick: dismiss,
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
        maxWidth: 600,
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
    }, child.name)), React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: dismiss,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, initialDraft && React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 14
    }), "Draft restored \u2014 you dismissed this without saving."), onFile ? React.createElement(React.Fragment, null, meds.length > 1 && React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Which medication"), React.createElement(RdSegmented, {
      options: meds.map(m => m.name),
      value: medName,
      onChange: setMedName,
      ariaLabel: "Which medication"
    })), React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z",
      size: 17
    })), React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700
      }
    }, med.name), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "\xB7 ", med.dose, med.route ? ` · ${med.route}` : '')), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "Authorised: ", med.auth, " \xB7 ", med.authBy, " \xB7 ", med.authOn), med.window && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: 'var(--sd-colour-text-on-cyan)'
      }
    }, "When: ", med.window), expiry && !expiry.expired && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: expiry.soon ? 700 : 500,
        color: expiry.soon ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-on-cyan)'
      }
    }, expiry.label, expiry.soon ? ' — ask the office to renew it' : '')), expiry && expiry.expired && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l9 16H3L12 3ZM12 9v5M12 17h.01",
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
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, "Authorisation expired \xB7 ", expiry.label.toLowerCase()), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, "Record the dose anyway if it has been given \u2014 the record will be flagged so the office can chase a renewal for ", child.name.split(' ')[0], "."))), (() => {
      const prior = (child.last || []).find(([k]) => k === 'med');
      const mins = prior ? RD_MINS(RD_NOW) - RD_MINS(prior[1]) : null;
      const close = mins !== null && mins < 120;
      return React.createElement("div", {
        style: {
          display: 'flex',
          gap: 11,
          padding: '12px 14px',
          borderRadius: 'var(--sd-radius-lg)',
          background: close ? 'var(--sd-colour-surface-orange)' : 'var(--sd-colour-surface-grey)'
        }
      }, React.createElement("span", {
        style: {
          flexShrink: 0,
          marginTop: 1,
          color: close ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement(RdGlyph, {
        d: RD_CLOCK_D,
        size: 18
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
          color: close ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-primary)'
        }
      }, prior ? `Last given ${RD_AMPM(prior[1])} · ${mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)} hr ${mins % 60} min ago`}` : 'No prior dose recorded today'), React.createElement("span", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.45,
          fontWeight: 600,
          color: close ? 'var(--sd-colour-text-on-orange)' : 'var(--sd-colour-text-secondary)'
        }
      }, prior ? close ? 'Check the dosing interval before giving another dose.' : 'Recorded against this child today.' : `Nothing recorded for ${child.name.split(' ')[0]} today — check the paper chart if the service keeps one.`)));
    })()) : React.createElement(React.Fragment, null, React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: "M12 3l9 16H3L12 3ZM12 9v5M12 17h.01",
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
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, "No authorisation on file in Office"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-on-orange)'
      }
    }, "Record the dose anyway \u2014 the service may hold a paper form. The record will be flagged for follow-up so the authorisation gets onto ", child.name.split(' ')[0], "\u2019s file."))), React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Medication given"), React.createElement("input", {
      className: "fp-input",
      autoFocus: true,
      type: "text",
      value: freeName,
      onChange: e => setFreeName(e.target.value),
      placeholder: "Name as it appears on the label",
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
    }), !freeName.trim() && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, "Needed before this can be saved.")), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: '1 1 200px',
        minWidth: 0
      }
    }, React.createElement(RdLabel, null, "Dose"), React.createElement("input", {
      className: "fp-input",
      type: "text",
      value: freeDose,
      onChange: e => setFreeDose(e.target.value),
      placeholder: "e.g. 5 mL, 1 tablet, 2 puffs",
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
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Route"), React.createElement(RdSegmented, {
      options: RD_MED_ROUTES,
      value: route,
      onChange: setRoute,
      ariaLabel: "How it was given"
    })))), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Outcome"), React.createElement(RdSegmented, {
      options: ['Given', 'Part dose', 'Refused'],
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
        gap: 10,
        flexWrap: 'wrap'
      }
    }, React.createElement("input", {
      className: "fp-input",
      autoFocus: true,
      type: "text",
      value: partAmount,
      onChange: e => setPartAmount(e.target.value),
      placeholder: givenDose ? `e.g. half of ${givenDose}` : 'e.g. 2 mL',
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        flex: '1 1 200px',
        minWidth: 0,
        height: 44,
        padding: '0 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 14.5
      }
    }), !!givenDose && React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        whiteSpace: 'nowrap'
      }
    }, "of ", givenDose, " authorised")), !partAmount.trim() && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, "Needed \u2014 \u201Cpart dose\u201D without an amount isn\u2019t a record."))), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Time"), React.createElement(RdTimeField, {
      value: time,
      onChange: setTime,
      ariaLabel: "Time"
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Next dose"), React.createElement(RdSegmented, {
      options: [['time', 'At a set time'], ['circumstances', 'Only if needed'], ['none', 'No further doses']],
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
    }), nextMode === 'time' && !nextAt && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-text-secondary)',
        fontWeight: 600
      }
    }, "Reg 92(3)(e) wants this on the record.")), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Checked by (second educator)"), others.length ? React.createElement(RdSegmented, {
      options: others.map(e => e.name),
      value: checker,
      onChange: setChecker,
      ariaLabel: "Second educator who checked"
    }) : React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, "No second educator available to verify the dose."), others.length > 0 && !checker && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, "A dose has to be checked by a second educator.")), React.createElement("label", {
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
    }))), React.createElement(RdSheetFoot, {
      phone: phone,
      note: React.createElement(React.Fragment, null, "Given by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), " at ", RD_AMPM(time), !onFile && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)',
          fontWeight: 600
        }
      }, "Flagged \u2014 no authorisation on file")), onFile && expiry && expiry.expired && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-on-orange)',
          fontWeight: 600
        }
      }, "Flagged \u2014 authorisation expired")), offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Cancel"), React.createElement(RdAction, {
      primary: true,
      glyph: RD_TICK_D,
      muted: !ready,
      onClick: ready ? () => onConfirm({
        med: givenName,
        dose: givenDose,
        route: onFile ? med && med.route : route,
        outcome,
        amount: outcome === 'Part dose' ? partAmount.trim() : null,
        checker,
        time,
        note: note.trim() || null,
        flagged: !onFile || !!(expiry && expiry.expired),
        flagReason: !onFile ? 'No authorisation on file' : expiry && expiry.expired ? 'Authorisation expired' : null,
        next: nextMode === 'time' ? nextAt ? `Next dose ${RD_AMPM(nextAt)}` : null : nextMode === 'circumstances' ? nextWhen.trim() ? `Next dose only if needed — ${nextWhen.trim()}` : null : 'No further doses today'
      }) : undefined
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
    hint: 'What was served and how much they ate'
  }, {
    key: 'sun',
    label: 'Sunscreen',
    hint: 'Applied, and which SPF'
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
  }];
  function RdEventChooser({
    child,
    roomEvents,
    onPick,
    onClose
  }) {
    const events = RD_CHILD_EVENTS.filter(e => e.key === 'note' || e.key === 'incident' || !roomEvents || roomEvents[e.key]);
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
    }, React.createElement(RdKid, {
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
    }, child.name)), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 16,
      width: 2
    })))))));
  }
  const RD_INC_KINDS = ['Injury', 'Illness', 'Trauma', 'Behavioural', 'Near miss'];
  const RD_INC_SERIOUS = [{
    key: 'urgent',
    label: 'Needed urgent medical attention or hospital attendance'
  }, {
    key: 'emergency',
    label: 'Emergency services attended, or should have been called'
  }, {
    key: 'missing',
    label: 'Child was missing or unaccounted for'
  }, {
    key: 'removed',
    label: 'Child was taken from the premises, or locked in or out'
  }, {
    key: 'illness',
    label: 'Serious illness requiring hospital attendance'
  }];
  const RD_INC_WHERE = ['Indoors', 'Outdoors', 'Excursion'];
  const RD_INC_NOTIFY = ['Not yet', 'In person', 'Phone', 'Message'];
  function RdIncidentSheet({
    child,
    offline,
    phone,
    educator = RD_EDUCATOR,
    initialDraft,
    onClose,
    onConfirm,
    onDismiss
  }) {
    const D0 = initialDraft || {};
    const [kind, setKind] = useState(D0.kind || 'Injury');
    const [where, setWhere] = useState(D0.where || 'Outdoors');
    const [time, setTime] = useState(D0.time || RD_NOW);
    const [what, setWhat] = useState(D0.what || '');
    const [action, setAction] = useState(D0.action || '');
    const [witness, setWitness] = useState(D0.witness || '');
    const [notify, setNotify] = useState(D0.notify || 'Not yet');
    const [triggers, setTriggers] = useState(D0.triggers || {});
    const [override, setOverride] = useState(D0.override || null);
    const derivedSerious = RD_INC_SERIOUS.some(t => triggers[t.key]);
    const serious = override ? override === 'serious' : derivedSerious;
    const draft = () => ({
      kind,
      where,
      time,
      what,
      action,
      witness,
      notify,
      triggers,
      override
    });
    const hasContent = () => !!(what.trim() || action.trim() || witness.trim() || Object.values(triggers).some(Boolean));
    const dismiss = () => onDismiss && hasContent() ? onDismiss(draft()) : onClose();
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') dismiss();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [kind, where, time, what, action, witness, notify]);
    const field = (label, value, set, placeholder, lines) => React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, label), lines ? React.createElement("textarea", {
      value: value,
      onChange: e => set(e.target.value),
      placeholder: placeholder,
      rows: lines,
      className: "fp-input",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        width: '100%',
        padding: '11px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 14.5,
        lineHeight: 1.45,
        resize: 'none'
      }
    }) : React.createElement("input", {
      type: "text",
      value: value,
      onChange: e => set(e.target.value),
      placeholder: placeholder,
      className: "fp-input",
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
    }));
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }
    }, React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: dismiss,
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
        maxWidth: 640,
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
        background: 'var(--sd-colour-surface-red)',
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, React.createElement(RdGlyph, {
      d: "M6 3h9l4 4v14H6V3ZM14 3v5h5M9 13h7M9 17h5",
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
    }, "Incident record"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name, " \xB7 ", educator.name)), React.createElement("button", {
      type: "button",
      "aria-label": "Dismiss",
      onClick: dismiss,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, initialDraft && React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 14
    }), "Draft restored \u2014 you dismissed this record without saving."), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "What kind"), React.createElement(RdSegmented, {
      options: RD_INC_KINDS,
      value: kind,
      onChange: setKind,
      ariaLabel: "What kind of incident"
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Where"), React.createElement(RdSegmented, {
      options: RD_INC_WHERE,
      value: where,
      onChange: setWhere,
      ariaLabel: "Where it happened"
    }))), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Time it happened"), React.createElement(RdTimeField, {
      value: time,
      onChange: setTime,
      ariaLabel: "Time it happened"
    })), field('What happened', what, setWhat, 'Where the child was, what they were doing, how it happened', 3), !what.trim() && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600,
        marginTop: -10
      }
    }, "Needed before this can be saved."), field('Action taken', action, setAction, 'First aid given, who gave it, what happened next', 2), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, React.createElement(RdLabel, null, "Did any of these apply?"), RD_INC_SERIOUS.map(t => React.createElement("label", {
      key: t.key,
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'pointer'
      }
    }, React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 22,
        height: 22,
        flexShrink: 0,
        marginTop: 1,
        borderRadius: 'var(--sd-radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: triggers[t.key] ? 'var(--sd-colour-feedback-error-default)' : 'transparent',
        border: triggers[t.key] ? 'none' : '2px solid var(--sd-colour-border-strong)',
        color: '#fff'
      }
    }, triggers[t.key] && React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 13,
      width: 3
    })), React.createElement("input", {
      type: "checkbox",
      checked: !!triggers[t.key],
      onChange: e => setTriggers(m => ({
        ...m,
        [t.key]: e.target.checked
      })),
      style: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1
      }
    }), React.createElement("span", {
      style: {
        fontSize: 13.5,
        lineHeight: 1.4,
        fontWeight: 500
      }
    }, t.label))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: serious ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-grey)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: serious ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-primary)'
      }
    }, serious ? 'Serious incident' : 'Minor incident', override && React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, " \xB7 set by you")), serious ? React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, "Reg 12 \xB7 must be notified to the regulatory authority within ", React.createElement("b", null, "24 hours"), " \u2014 by ", React.createElement("b", null, RD_AMPM(time), " tomorrow"), " (s.174(2)(a), reg 176(2)(a)). Playground does not send that notification.") : React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Recorded for compliance. No regulator notification, and the short form is enough."), React.createElement("button", {
      type: "button",
      onClick: () => setOverride(serious ? 'minor' : 'serious'),
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--sd-colour-action-primary)',
        textDecoration: 'underline'
      }
    }, serious ? 'Record this as minor instead' : 'Record this as serious instead'))), field('Witnesses', witness, setWitness, 'Anyone who saw it — educators or others'), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Parent or guardian notified"), React.createElement(RdSegmented, {
      options: RD_INC_NOTIFY,
      value: notify,
      onChange: setNotify,
      ariaLabel: "Parent or guardian notified"
    }), notify === 'Not yet' ? React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-on-orange)',
        fontWeight: 600
      }
    }, "Saved as awaiting notification. Reg 86 requires the family to be told within ", React.createElement("b", null, "24 hours"), " \u2014 by ", React.createElement("b", null, RD_AMPM(time), " tomorrow"), ".") : React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)',
        fontWeight: 600
      }
    }, "Recorded as notified by ", notify.toLowerCase(), " at ", RD_AMPM(RD_NOW), ". NZ HS27 asks for evidence the family knew."))), React.createElement(RdSheetFoot, {
      phone: phone,
      note: React.createElement(React.Fragment, null, "Recorded by ", React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, educator.name), ' · happened ', React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, RD_AMPM(time)), ' · entered ', React.createElement("b", {
        style: {
          color: 'var(--sd-colour-text-primary)'
        }
      }, RD_AMPM(RD_NOW)), offline && React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
        style: {
          color: RD_SYNC_FG,
          fontWeight: 600
        }
      }, "Saved on this device \xB7 syncs when there\u2019s signal")))
    }, React.createElement(RdAction, {
      onClick: onClose
    }, "Discard"), React.createElement(RdAction, {
      primary: true,
      glyph: RD_TICK_D,
      muted: !what.trim(),
      onClick: what.trim() ? () => onConfirm({
        kind,
        notify,
        serious,
        triggers,
        at: time,
        enteredAt: RD_NOW
      }) : undefined
    }, "Save record"))));
  }
  function RdSignSheet({
    child,
    direction,
    offline,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onConfirm
  }) {
    const out = direction === 'out';
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
        maxWidth: 660,
        maxHeight: '100%',
        overflowY: 'auto',
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
    }, out ? 'Sign out' : 'Sign in'), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, child.name)), React.createElement("button", {
      type: "button",
      "aria-label": "Cancel",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, React.createElement(RdGlyph, {
      d: RD_LOCK_D,
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
      ariaLabel: out ? 'Time they left' : 'Time they arrived'
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, out ? 'Collected by' : 'Delivered by'), out && child.collect ? React.createElement(RdChoiceChips, {
      options: rdCollectOptions(child),
      value: who,
      onChange: setWho,
      ariaLabel: "Who collected them"
    }) : React.createElement(RdSegmented, {
      options: out ? RD_COLLECTED_BY : RD_DELIVERED_BY,
      value: who,
      onChange: setWho,
      ariaLabel: out ? 'Who collected them' : 'Who delivered them'
    }), !who && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        fontWeight: 600
      }
    }, "Needed before this can be saved."))), React.createElement(RdSheetFoot, {
      phone: phone,
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
      glyph: RD_TICK_D,
      muted: !who,
      onClick: who ? () => onConfirm(at, who) : undefined
    }, out ? 'Sign out' : 'Sign in', " ", child.name.split(' ')[0]))));
  }
  function RdCorrectSheet({
    child,
    kind,
    at,
    detail,
    note,
    phone,
    educator = RD_EDUCATOR,
    onClose,
    onConfirm
  }) {
    const label = RD_EVENT_LABEL[kind] || RD_LOG_TITLE[kind] || kind;
    const cfg = RD_BULK[kind];
    const valueOptions = cfg && cfg.perChild && cfg.perChild.options || null;
    const valueLabel = cfg && cfg.perChild && cfg.perChild.label || 'Details';
    const naCfg = cfg && cfg.perChild && cfg.perChild.notApplied ? cfg.perChild : null;
    const optionValues = valueOptions ? [...valueOptions.map(o => Array.isArray(o) ? o[0] : o), ...(naCfg ? naCfg.reasonFor : [])] : [];
    const asOption = !!(detail && optionValues.includes(detail));
    const [newAt, setNewAt] = useState(at);
    const [newValue, setNewValue] = useState(asOption ? detail : null);
    const [newText, setNewText] = useState(asOption ? '' : detail || '');
    const [newNote, setNewNote] = useState(note || '');
    const [reason, setReason] = useState('');
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const resolvedDetail = valueOptions && asOption ? newValue : newText.trim() || null;
    const timeChanged = newAt !== at;
    const valueChanged = resolvedDetail !== (detail || null);
    const noteChanged = (newNote.trim() || '') !== (note || '');
    const naValue = !!naCfg && (newValue === naCfg.notApplied || naCfg.reasonFor.includes(newValue));
    const naIncomplete = naValue && (newValue === naCfg.notApplied || !newNote.trim());
    const ready = (timeChanged || valueChanged || noteChanged) && !naIncomplete;
    return (React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          zIndex: 46,
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
          maxWidth: 540,
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
      }, child.name, " \xB7 logged at ", RD_AMPM(at), detail ? ` · ${detail}` : '')), React.createElement("button", {
        type: "button",
        "aria-label": "Close",
        onClick: onClose,
        style: {
          all: 'unset',
          cursor: 'pointer',
          color: 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement(RdGlyph, {
        d: RD_CLOSE_D,
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
      }, "The original record isn\u2019t deleted \u2014 the amended version stands and the change is kept on the audit trail. Change the time, what was recorded, the note, or all three."), React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7
        }
      }, React.createElement(RdLabel, null, "Time"), React.createElement(RdTimeField, {
        value: newAt,
        onChange: setNewAt,
        ariaLabel: "Amended time"
      })), valueOptions && asOption ? React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7
        }
      }, React.createElement(RdLabel, null, valueLabel), naCfg ? React.createElement("span", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8
        }
      }, React.createElement(RdSegmented, {
        options: valueOptions,
        value: naValue ? null : newValue,
        onChange: setNewValue,
        ariaLabel: `Amended ${valueLabel.toLowerCase()}`
      }), React.createElement(RdNotAppliedToggle, {
        on: naValue,
        name: child.name,
        onToggle: () => setNewValue(naValue ? (valueOptions[0] || [])[0] : naCfg.notApplied)
      })) : React.createElement(RdSegmented, {
        options: valueOptions,
        value: newValue,
        onChange: setNewValue,
        ariaLabel: `Amended ${valueLabel.toLowerCase()}`
      }), naValue && React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginTop: 4
        }
      }, React.createElement(RdLabel, null, "Why not"), React.createElement(RdChoiceChips, {
        options: naCfg.reasonFor,
        value: newValue === naCfg.notApplied ? null : newValue,
        onChange: setNewValue,
        ariaLabel: `Why sunscreen was not applied for ${child.name}`
      }), naIncomplete && React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, newValue === naCfg.notApplied ? 'Pick why, then give the reason in the note below.' : 'Give the reason in the note below.'))) : React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, valueLabel), React.createElement("input", {
        className: "fp-input",
        type: "text",
        value: newText,
        onChange: e => setNewText(e.target.value),
        placeholder: "What was recorded",
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
      })), React.createElement("label", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }
      }, React.createElement(RdLabel, null, "Note"), React.createElement("input", {
        className: "fp-input",
        type: "text",
        value: newNote,
        onChange: e => setNewNote(e.target.value),
        placeholder: "Anything worth passing on",
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
      })), React.createElement("label", {
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
        note: ready ? React.createElement(React.Fragment, null, "Amended by ", React.createElement("b", {
          style: {
            color: 'var(--sd-colour-text-primary)'
          }
        }, educator.name)) : 'Change the time, the value or the note to save an amendment.'
      }, React.createElement(RdAction, {
        onClick: onClose
      }, "Cancel"), React.createElement(RdAction, {
        primary: true,
        glyph: RD_TICK_D,
        muted: !ready,
        onClick: ready ? () => onConfirm({
          at: newAt,
          detail: resolvedDetail,
          note: newNote.trim() || null,
          reason: reason.trim()
        }) : undefined
      }, "Save amendment"))))
    );
  }
  const RD_HC_REASONS = [{
    key: 'signedout',
    label: 'Collected — sign-out not logged yet',
    hint: 'Who collected them, and roughly when'
  }, {
    key: 'room',
    label: 'In another room',
    hint: 'Which room, and who has them'
  }, {
    key: 'toilet',
    label: 'Toilet or nappy change',
    hint: 'Which educator is with them'
  }, {
    key: 'outside',
    label: 'Outside',
    hint: 'Where, and who is supervising'
  }, {
    key: 'absent',
    label: 'Absent — not logged yet',
    hint: 'Who told you, and when'
  }];
  const rdHcHint = key => (RD_HC_REASONS.find(x => x.key === key) || {}).hint || 'Anything worth putting on the record';
  function RdHeadcountSheet({
    expected,
    roomName,
    scopeLabel = 'to this room',
    present = null,
    showRoom,
    history = [],
    onClose,
    onConfirm,
    onDiscrepancy,
    onEscalate
  }) {
    const roster = Array.isArray(present) ? present : [];
    const [seen, setSeen] = useState(() => new Set());
    const [stage, setStage] = useState('count');
    const [told, setTold] = useState(null);
    const [showLog, setShowLog] = useState(false);
    const [why, setWhy] = useState({});
    const setReason = (id, patch) => setWhy(w => ({
      ...w,
      [id]: {
        ...(w[id] || {}),
        ...patch
      }
    }));
    const reasonText = p => {
      const r = why[p.id] || {};
      const label = (RD_HC_REASONS.find(x => x.key === r.why) || {}).label;
      return [label, (r.note || '').trim()].filter(Boolean).join(' — ') || null;
    };
    const toggle = id => setSeen(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const total = roster.length || expected;
    const missing = roster.filter(p => !seen.has(p.id));
    const allSeen = roster.length > 0 && missing.length === 0;
    const backToCount = () => {
      setStage('count');
      setTold(null);
    };
    const row = p => {
      const on = seen.has(p.id);
      const gone = stage === 'missing' && !on;
      return React.createElement("button", {
        key: p.id,
        type: "button",
        onClick: () => toggle(p.id),
        "aria-pressed": on,
        className: "fp-row",
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '9px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid ' + (on ? 'var(--sd-colour-action-primary)' : gone ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)'),
          background: on ? 'var(--sd-colour-surface-cyan)' : gone ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-default)'
        }
      }, React.createElement("span", {
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
          color: '#fff'
        }
      }, on && React.createElement(RdGlyph, {
        d: RD_TICK_D,
        size: 14,
        width: 3
      })), React.createElement(RdKid, {
        c: p,
        size: 34
      }), React.createElement("span", {
        style: {
          fontSize: 14.5,
          fontWeight: 700,
          flex: 1,
          minWidth: 0,
          color: 'var(--sd-colour-text-primary)'
        }
      }, p.name), showRoom && p.room && React.createElement(RdRoomChip, {
        name: p.room
      }), gone && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--sd-colour-feedback-error-default)',
          flexShrink: 0
        }
      }, "Not seen"));
    };
    const rosterList = () => roster.length ? roster.map(row) : React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--sd-colour-text-secondary)',
        padding: '18px 0'
      }
    }, "Nobody is signed in ", scopeLabel, " \u2014 there\u2019s nothing to count.");
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
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: '0 24px 60px rgba(0,40,34,0.34)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, React.createElement("div", {
      style: {
        padding: '18px 22px 14px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0
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
        fontSize: 18,
        fontWeight: 700
      }
    }, "Head count \xB7 ", roomName), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Tick every child you can see. ", total, " signed in ", scopeLabel, ".")), React.createElement("button", {
      type: "button",
      "aria-label": "Close",
      onClick: onClose,
      style: {
        all: 'unset',
        cursor: 'pointer',
        color: 'var(--sd-colour-text-secondary)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
      size: 20
    }))), React.createElement("div", {
      style: {
        padding: '14px 22px 10px',
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        flexShrink: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1,
        color: allSeen ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-text-primary)'
      }
    }, seen.size), React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)',
        flex: 1
      }
    }, "of ", total, " seen"), allSeen && React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--green ds-pill--minimal"
    }, React.createElement("span", {
      className: "ds-pill__icon"
    }, React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 14,
      width: 2.6
    })), "All accounted for")), stage === 'missing' && React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '4px 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4ZM12 9v4M12 16h.01",
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
    }, missing.map(p => p.name.split(' ')[0]).join(', '), " not seen"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, "Walk the room again \u2014 finding them comes first. You can still record this count, and the gap becomes part of the record."))), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement(RdLabel, null, "Anything known about them? (optional)"), missing.map(p => {
      const r = why[p.id] || {};
      return React.createElement("div", {
        key: p.id,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          padding: '10px 12px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)'
        }
      }, React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 9
        }
      }, React.createElement(RdKid, {
        c: p,
        size: 28
      }), React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          flex: 1,
          minWidth: 0
        }
      }, p.name), !r.why && React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, "Still looking")), React.createElement("span", {
        style: {
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap'
        }
      }, RD_HC_REASONS.map(x => React.createElement("button", {
        key: x.key,
        type: "button",
        onClick: () => setReason(p.id, {
          why: r.why === x.key ? null : x.key
        }),
        className: 'ds-selection-pill ds-selection-pill--sm' + (r.why === x.key ? ' ds-selection-pill--selected' : ''),
        style: {
          height: 34,
          fontSize: 12.5
        }
      }, React.createElement("span", {
        className: "ds-selection-pill__label"
      }, x.label)))), !!r.why && React.createElement("input", {
        className: "fp-input",
        type: "text",
        value: r.note || '',
        onChange: e => setReason(p.id, {
          note: e.target.value
        }),
        placeholder: rdHcHint(r.why),
        style: {
          all: 'unset',
          boxSizing: 'border-box',
          width: '100%',
          height: 40,
          padding: '0 12px',
          borderRadius: 'var(--sd-radius-lg)',
          border: '1px solid var(--sd-colour-border-default)',
          fontFamily: 'var(--sd-font-family)',
          fontSize: 13.5
        }
      }));
    })), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, React.createElement(RdLabel, null, "Who have you told? (optional)"), React.createElement(RdSegmented, {
      options: ['Nominated supervisor', 'Another educator'],
      value: told,
      onChange: setTold,
      ariaLabel: "Who have you told"
    }), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, told ? `The record will say you told the ${told.toLowerCase()}.` : 'You can record the count without this — it will say nobody has been told yet.')), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-feedback-error-default)'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--sd-colour-feedback-error-default)'
      }
    }, "A child who stays unaccounted for is a serious incident"), React.createElement("span", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Reg 12 \xB7 notifiable to the regulatory authority within ", React.createElement("b", {
      style: {
        color: 'var(--sd-colour-text-primary)'
      }
    }, "24 hours"), ". Recording this count does not raise that notification."), onEscalate && React.createElement(RdAction, {
      glyph: "M6 3h9l4 4v14H6V3ZM14 3v5h5M9 13h7M9 17h5",
      onClick: () => onEscalate(missing, seen.size, told)
    }, "Start an incident record")), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, React.createElement(RdLabel, null, "Room roster"), rosterList())), stage === 'count' && !!history.length && React.createElement("div", {
      style: {
        padding: '0 22px 10px',
        flexShrink: 0
      }
    }, React.createElement("button", {
      type: "button",
      onClick: () => setShowLog(o => !o),
      "aria-expanded": showLog,
      className: "fp-btn",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 12px',
        borderRadius: 'var(--sd-radius-lg)',
        border: '1px solid var(--sd-colour-border-default)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement("span", {
      style: {
        color: 'var(--sd-colour-text-secondary)',
        display: 'inline-flex',
        flexShrink: 0
      }
    }, React.createElement(RdGlyph, {
      d: RD_CLOCK_D,
      size: 16
    })), React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        textAlign: 'left'
      }
    }, "Today\u2019s counts"), React.createElement("span", {
      style: {
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, history.length), React.createElement("span", {
      style: {
        transform: showLog ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s',
        display: 'inline-flex',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, React.createElement(RdGlyph, {
      d: "M6 9l6 6 6-6",
      size: 15,
      width: 2
    }))), showLog && React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 2px 0'
      }
    }, history.map((h, i) => {
      const short = h.seen < h.of;
      return (React.createElement("div", {
          key: i,
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: 8,
            fontSize: 12.5,
            padding: '4px 10px',
            borderRadius: 'var(--sd-radius-m)',
            background: short ? 'var(--sd-colour-surface-red)' : 'transparent'
          }
        }, React.createElement("span", {
          style: {
            fontWeight: 700,
            minWidth: 62
          }
        }, RD_AMPM(h.at)), React.createElement("span", {
          style: {
            fontWeight: 600,
            color: short ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-primary)'
          }
        }, h.seen, " of ", h.of, " seen"), React.createElement("span", {
          style: {
            flex: 1,
            minWidth: 0,
            color: 'var(--sd-colour-text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, h.missing && h.missing.length ? `· not seen: ${(h.why && h.why.length ? h.why : h.missing).join(', ')}` : ''), React.createElement("span", {
          style: {
            color: 'var(--sd-colour-text-secondary)',
            whiteSpace: 'nowrap'
          }
        }, h.by), short && (h.told || h.escalated) && React.createElement("span", {
          style: {
            flexBasis: '100%',
            minWidth: '100%',
            paddingLeft: 70,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }
        }, h.told && React.createElement("span", {
          style: {
            fontWeight: 600,
            color: /nobody/i.test(h.told) ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
          }
        }, /nobody/i.test(h.told) ? '· nobody told yet' : `· told the ${h.told.toLowerCase()}`), h.escalated && React.createElement("span", {
          style: {
            fontWeight: 700,
            color: 'var(--sd-colour-feedback-error-default)'
          }
        }, "\xB7 escalated to an incident record")))
      );
    }), React.createElement("span", {
      style: {
        fontSize: 11.5,
        lineHeight: 1.45,
        color: 'var(--sd-colour-text-secondary)',
        padding: '6px 10px 0'
      }
    }, "This room, today. The full head-count report across the service is a web job \u2014 see S1."))), stage === 'count' && React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '0 22px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, rosterList()), React.createElement("div", {
      style: {
        padding: '14px 22px 18px',
        borderTop: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0
      }
    }, stage === 'count' ? allSeen ? React.createElement(RdAction, {
      primary: true,
      glyph: RD_TICK_D,
      full: true,
      onClick: () => onConfirm(seen.size, roster)
    }, "Record ", seen.size, " seen") : React.createElement(RdAction, {
      primary: true,
      glyph: RD_TICK_D,
      full: true,
      muted: !roster.length,
      onClick: roster.length ? () => setStage('missing') : undefined
    }, seen.size ? `Done — ${missing.length} not seen` : 'Done counting') : React.createElement(React.Fragment, null, React.createElement(RdAction, {
      primary: true,
      glyph: RD_TICK_D,
      full: true,
      onClick: () => onDiscrepancy(seen.size, told, missing.map(p => ({
        ...p,
        why: reasonText(p)
      })))
    }, "Record ", seen.size, " of ", total, " \xB7 ", missing.length, " not seen"), React.createElement(RdAction, {
      full: true,
      onClick: backToCount
    }, "Keep counting")), React.createElement("span", {
      style: {
        fontSize: 12,
        lineHeight: 1.45,
        textAlign: 'center',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Each count is its own record, kept with the time and who made it \u2014 see ", React.createElement("b", {
      style: {
        fontWeight: 700
      }
    }, "Today\u2019s counts"), " above."))));
  }
  const RD_MENU_SERVICE = [{
    key: 'headcount',
    act: 'headcount',
    label: 'Head count',
    d: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20h4a6 6 0 0 0-4-5.7'
  }, {
    key: 'camera',
    act: 'camera',
    label: 'Take a photo',
    d: RD_CAMERA_D
  }, {
    key: 'roomsettings',
    act: 'settings',
    label: 'Room settings',
    d: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.87 1.2V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 3 15a1.7 1.7 0 0 0-1.56-1H1a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 7 2.6h.09A1.7 1.7 0 0 0 8.6 1V1a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 2.87 1.2l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 21.4 9H21a2 2 0 1 1 0 4h-.09'
  }, {
    key: 'incidents',
    label: 'Incident records',
    d: 'M6 3h9l4 4v14H6V3ZM14 3v5h5M9 13h7M9 17h5'
  }, {
    key: 'learning',
    label: 'Learning',
    d: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z'
  }, {
    key: 'help',
    label: 'Help & support',
    d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.6 9.5a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4M12 17h.01'
  }];
  const RD_MENU_ACCOUNT = [{
    key: 'account',
    label: 'Account',
    d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0'
  }, {
    key: 'switchedu',
    act: 'switchEducator',
    label: 'Switch educator · keeps the service',
    d: 'M16 3.1A4 4 0 0 1 16 11M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a6 6 0 0 1 12 0M17 14.3A6 6 0 0 1 22 21'
  }, {
    key: 'signout',
    act: 'signOut',
    label: 'Log out of this service',
    d: 'M14 8V6a2 2 0 0 0-2-2H5v16h7a2 2 0 0 0 2-2v-2M9 12h11m0 0-3-3m3 3-3 3'
  }];
  function RdDrawer({
    scope,
    roomKey,
    rooms,
    onClose,
    onRoom,
    onService,
    acts
  }) {
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [onClose]);
    const item = m => {
      const act = m.act && acts && acts[m.act];
      return React.createElement("button", {
        key: m.key,
        type: "button",
        onClick: () => {
          onClose();
          if (act) act();
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
          fontSize: 14.5,
          fontWeight: 600,
          color: act ? 'var(--sd-colour-text-primary)' : 'var(--sd-colour-text-secondary)'
        }
      }, React.createElement("span", {
        style: {
          color: 'var(--sd-colour-text-secondary)',
          flexShrink: 0
        }
      }, React.createElement(RdGlyph, {
        d: m.d,
        size: 19
      })), React.createElement("span", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, m.label), !act && React.createElement("span", {
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
    }, React.createElement(RdGlyph, {
      d: RD_CLOSE_D,
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
    }, React.createElement("button", {
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
    }, React.createElement(RdGlyph, {
      d: "M3 21V9l9-6 9 6v12M9 21v-6h6v6",
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
          background: active ? 'var(--sd-colour-text-on-cyan)' : r.ratioOk ? 'var(--sd-colour-border-strong)' : 'var(--sd-colour-feedback-error-default)'
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
      }, r.signed, " signed / ", r.booked, " booked", !r.ratioOk && React.createElement("span", {
        style: {
          color: 'var(--sd-colour-feedback-error-default)',
          fontWeight: 700
        }
      }, " \xB7 over ratio"))));
    }), React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--sd-colour-border-default)',
        margin: '10px 14px'
      }
    }), React.createElement("div", {
      style: heading
    }, "Service"), RD_MENU_SERVICE.map(item), React.createElement("div", {
      style: {
        height: 1,
        background: 'var(--sd-colour-border-default)',
        margin: '10px 14px'
      }
    }), RD_MENU_ACCOUNT.map(item))));
  }
  const RD_ALERT_EVENT = [['sleep', /sleep/i], ['med', /medication/i], ['sun', /sunscreen/i], ['nappy', /nappy|toilet/i]];
  const rdAlertAllowed = (a, events) => {
    if (!a || !events) return true;
    const hit = RD_ALERT_EVENT.find(([, re]) => re.test(a.label));
    return !hit || !!events[hit[0]];
  };
  const rdSleepDue = (c, events) => {
    if (!events || events.sleep === false) return null;
    if (c.alert || c.status !== 'here') return null;
    if (c.state !== 'Sleeping' && c.state !== 'Resting') return null;
    const last = (c.last || []).find(([k]) => k === 'sleep');
    if (!last) return null;
    const since = RD_MINS(RD_NOW) - RD_MINS(last[1]);
    if (since < RD_SLEEP_INTERVAL) return null;
    const late = since - RD_SLEEP_INTERVAL;
    return {
      kind: 'due',
      overdue: late > 0,
      mins: late,
      label: rdDueLabel('Sleep check', late, late > 0)
    };
  };
  const rdLiveAlert = (c, events) => {
    const kept = c.alert && rdAlertAllowed(c.alert, events) ? c.alert : null;
    return kept || rdSleepDue({
      ...c,
      alert: kept
    }, events);
  };
  const rdSleepNotif = (n, roster, eventsByRoom, careByRoom) => {
    const room = RD_ROOMS.find(r => r.key === n.room) || {};
    const events = eventsByRoom[n.room] || rdEventsDefault(careByRoom[n.room] || room.care, room.sleepTrack);
    const late = roster.filter(c => c.room === n.room).map(c => rdLiveAlert(c, events)).filter(a => a && a.overdue && /sleep/i.test(a.label));
    if (!late.length) return null;
    const worst = Math.max(...late.map(a => a.mins || 0));
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
    const events = opts && opts.eventsByRoom && opts.eventsByRoom[r.key] || rdEventsDefault(care, r.sleepTrack);
    return {
      ...r,
      __room: true,
      signed,
      booked: r.booked,
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
      hcOverdue,
      hcTick,
      longPressChild,
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
      openCamera,
      facets,
      setFacets,
      showSelectedOnly,
      setShowSelectedOnly,
      selectRule
    } = ctx;
    const strip = c => (calm || readOnly) && c.alert ? {
      ...c,
      alert: null
    } : c;
    const canAttend = !rdOffBlocked('attendance', conn);
    const canCount = !rdOffBlocked('headcount', conn);
    const canAmend = !rdOffBlocked('amendEvent', conn);
    const stripOffEvents = c => c.alert && !rdAlertAllowed(c.alert, roomEvents) ? {
      ...c,
      alert: null
    } : c;
    const withSleepDue = c => {
      const a = rdSleepDue(c, roomEvents);
      return a ? {
        ...c,
        alert: a
      } : c;
    };
    const liveRaw = selected ? roster.find(c => c.id === selected.id) || RD_OTHER.find(c => c.id === selected.id) || selected : null;
    const liveSelected = liveRaw ? strip(withSleepDue(stripOffEvents(liveRaw))) : null;
    const RD_ROOM_STATS = RD_ROOMS.map(r => roomStats(r, roster, roomMaps));
    const pool = (scope === 'room' ? roster.filter(c => c.room === roomKey) : roster).map(stripOffEvents).map(withSleepDue).map(strip);
    const q = query.trim().toLowerCase();
    const matchChild = c => !q || c.name.toLowerCase().includes(q) || (c.tags || []).some(t => t.toLowerCase().includes(q)) || roomNameOf(c).toLowerCase().includes(q);
    const showTest = c => rdFacetPass(c, facets);
    const due = rdSortItems(pool.filter(c => c.alert), sortKey).sort((a, b) => (b.alert.kind === 'urgent') - (a.alert.kind === 'urgent') || !!b.alert.overdue - !!a.alert.overdue || (b.alert.mins || 0) - (a.alert.mins || 0));
    const rooms = RD_ROOM_STATS.map(r => calm ? {
      ...r,
      due: 0
    } : r);
    const breaches = !showStaff ? [] : scope === 'service' ? rooms.filter(r => !r.ratioOk) : rooms.filter(r => r.key === roomKey && !r.ratioOk);
    const tickedChildren = pool.filter(c => ticked.has(c.id));
    const common = {
      scope,
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
      eventLabel: k => k === 'sleep' ? rdEventTitle('sleep', roomEvents && roomEvents.sleepTrack || 'Sleep') : RD_BULK[k].label,
      grouping,
      setGrouping,
      sortKey,
      setSortKey,
      sortOptions: RD_SORTS,
      groupingOptions: (selectRule === RULE_BANDS ? RD_GROUPINGS_C : RD_GROUPINGS).filter(g => !RD_FIELD_GROUPINGS.includes(g.key) || new Set(pool.map(c => c[g.key] || '—')).size >= 2),
      selectArm,
      facets,
      setFacets,
      facetPool: pool,
      selectRule,
      hasFilters: !!rdFacetChips(facets).length,
      grouped: rdGroupsCarry(selectRule, facets, grouping),
      dueChildren: due,
      ratioBreaches: breaches,
      isTicked: c => ticked.has(c.id),
      toggleTick,
      clearSelection,
      selectIds,
      openBulk,
      longPressChild,
      openSign,
      openCorrect,
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
      openSettings,
      openCamera
    };
    if (scope === 'service') {
      const signed = pool.filter(c => c.status === 'here').length;
      const totalBooked = RD_ROOMS.reduce((n, r) => n + r.booked, 0);
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
        summary: [{
          value: `${signed}/${totalBooked}`,
          label: 'Signed in'
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
        bulkEvents: [],
        bulkScope: {
          ids: [],
          narrowed: false,
          count: 0
        },
        headcount: null,
        openDueChild: openChild,
        staleNote: conn === 'offline' ? `Other rooms as of ${RD_AMPM('12:58')} — may have changed` : null,
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
          glyph: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20h4a6 6 0 0 0-4-5.7',
          primary: true,
          onClick: openHeadcount
        }],
        paneCounts: [['Rooms open', String(RD_ROOMS.length)], ['Still booked in', String(pool.filter(rdFacetTest('att', 'expected')).length), 'att', 'expected'], ['Signed out', String(pool.filter(rdFacetTest('att', 'gone')).length), 'att', 'gone'], ['Absent', String(pool.filter(rdFacetTest('att', 'absent')).length), 'att', 'absent'], ['Holiday', String(pool.filter(rdFacetTest('att', 'holiday')).length), 'att', 'holiday']]
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
      summary: [{
        value: `${room.signed}/${room.booked}`,
        label: 'Signed in'
      }, ...(showStaff ? [{
        value: String(room.educators),
        label: room.educators === 1 ? 'Educator' : 'Educators'
      }, {
        value: `1:${room.ratio}`,
        label: 'Ratio',
        tone: room.ratioOk ? '#fff' : 'var(--sd-colour-red-100)'
      }] : [])],
      alerts: breaches.length ? {
        urgent: true,
        label: `${room.name} over ratio`
      } : hcOverdue ? {
        urgent: true,
        label: 'Head count overdue'
      } : due.length ? {
        urgent: due.some(c => rdIsLate(c.alert)),
        label: due.length === 1 ? '1 due' : `${due.length} due`
      } : null,
      views: null,
      searchPlaceholder: 'Search children',
      shownCount: matched.length,
      staleNote: conn === 'offline' ? `Roster as of ${RD_AMPM('12:58')}` : null,
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
        const hit = !readOnly && c.alert && RD_ALERT_EVENT.find(([k, re]) => re.test(c.alert.label) && (!roomEvents || roomEvents[k]) && (k === 'med' || care.events.includes(k)));
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
      attendanceActions: readOnly || !canAttend ? [] : (() => {
        const nHere = tickedChildren.filter(c => c.status === 'here').length;
        const nBooked = tickedChildren.filter(c => c.status === 'expected').length;
        return [nBooked ? ['in', nBooked] : null, nHere ? ['out', nHere] : null, nBooked ? ['absent', nBooked] : null].filter(Boolean);
      })(),
      headcount: readOnly || !canCount ? null : (() => {
        const since = RD_MINS(RD_NOW) - RD_MINS(hcOverdue ? RD_HC_DONE.late : RD_HC_DONE.ok) + hcTick;
        const left = care.hcInterval - since;
        return {
          expected: room.signed,
          overdue: left <= 0,
          note: left > 0 ? `Next count due in ${left} min · last\u00a0done\u00a0${RD_AMPM(RD_AGO(since))}` : `${-left} min overdue · every ${care.hcInterval} min`
        };
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
      other: RD_OTHER.filter(c => c.room === roomKey && !roster.some(r => r.id === c.id) && matchChild(c)),
      actions: readOnly || !canCount ? [] : [{
        key: 'headcount',
        label: 'Head count',
        glyph: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20h4a6 6 0 0 0-4-5.7',
        primary: true,
        onClick: openHeadcount
      }],
      paneCounts: [...(!roomEvents || roomEvents.sleep ? [['Sleeping', String(pool.filter(rdFacetTest('sleep', 'sleeping')).length), 'sleep', 'sleeping']] : [['Absent', String(pool.filter(rdFacetTest('att', 'absent')).length), 'att', 'absent']]), ['Still booked in', String(pool.filter(rdFacetTest('att', 'expected')).length), 'att', 'expected'], ['Signed out', String(pool.filter(rdFacetTest('att', 'gone')).length), 'att', 'gone']]
    };
  }
  function SplitShell({
    d,
    isIpad,
    arrangement,
    onMenu
  }) {
    const alertPill = d.alerts ? React.createElement(RdAlertPill, {
      label: d.alerts.label,
      urgent: d.alerts.urgent,
      onClick: d.openDue
    }) : null;
    const signedIn = d.summary && d.summary[0] || null;
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
    }, React.createElement(RdGlyph, {
      d: RD_MENU_D,
      size: 22,
      width: 2
    })), isIpad ? React.createElement("button", {
      type: "button",
      onClick: onMenu,
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
        overflow: 'hidden'
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
    }, React.createElement(RdGlyph, {
      d: RD_CHEV_D,
      size: 15,
      width: 2.4
    }))), React.createElement("span", {
      "aria-hidden": "true",
      style: {
        fontSize: 14,
        color: 'var(--sd-colour-cyan-200)',
        flexShrink: 0
      }
    }, "/"), React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--sd-colour-cyan-100)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 0
      }
    }, d.identity.sub)) : React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.identity.title), React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 500,
        color: 'var(--sd-colour-cyan-100)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.identity.sub)), isIpad && React.createElement(React.Fragment, null, React.createElement(RdHeadRule, null), React.createElement("span", {
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
    }), alertPill), React.createElement(RdConnChip, {
      conn: d.conn,
      syncing: d.syncing,
      pending: d.pending.length,
      synced: d.synced,
      onOpen: d.openPending
    }), React.createElement(RdNotifBell, {
      count: d.notifUnread,
      onOpen: d.openNotifs
    }), isIpad && React.createElement(RdCameraButton, {
      onOpen: d.openCamera
    }), isIpad && d.scope === 'room' && React.createElement(RdSettingsCog, {
      onOpen: d.openSettings
    }), React.createElement(RdActingAs, {
      educator: d.educator,
      onOpen: d.openEducator
    })), !isIpad && React.createElement("div", {
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
    }), signedIn && React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 5,
        flexShrink: 0,
        padding: '5px 11px',
        borderRadius: 'var(--sd-radius-full)',
        background: D_FILL,
        border: `1px solid ${D_BORDER}`,
        whiteSpace: 'nowrap'
      }
    }, React.createElement("b", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: '#fff'
      }
    }, signedIn.value), React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: 'var(--sd-colour-cyan-100)'
      }
    }, "signed in")), alertPill)), d.readOnly && React.createElement("div", {
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
    }, React.createElement(RdGlyph, {
      d: RD_LOCK_D,
      size: 16
    })), React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        flex: 1,
        minWidth: 0,
        color: 'var(--sd-colour-text-primary)'
      }
    }, "Viewing ", d.date.label, " \u2014 this day is closed. Records can\u2019t be added or changed."), React.createElement("button", {
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
    }), arrangement === 'none' && !!d.actions.length && React.createElement(RdActionBar, {
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
    const [showStaff, setShowStaff] = useState(!!_p.get('staff'));
    const [selectArm, setSelectArm] = useState(rdReadArm(_p.get('sel')));
    useEffect(() => {
      setSelectArm(props.selectArm || '');
    }, [props.selectArm]);
    const [selectRule, setSelectRule] = useState(rdReadRule(_p.get('rule')));
    useEffect(() => {
      setSelectRule(rdReadRule(props.selectRule));
    }, [props.selectRule]);
    const [facets, setFacets] = useState(RD_SHOW_LEGACY[_p.get('show')] || {});
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [grouping, setGrouping] = useState(rdReadGrouping(_p.get('group')));
    const [sortKey, setSortKey] = useState(_p.get('sort') === 'last' ? 'last' : 'first');
    const [selected, setSelected] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [educator, setEducator] = useState(props.educator || RD_EDUCATOR);
    const [educatorOpen, setEducatorOpen] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [dateIndex, setDateIndex] = useState(_p.get('date') && RD_DATES[Number(_p.get('date'))] ? Number(_p.get('date')) : 0);
    const readOnly = dateIndex > 0;
    const [calOpen, setCalOpen] = useState(false);
    const [notifRead, setNotifRead] = useState(new Set());
    const [notifsOpen, setNotifsOpen] = useState(false);
    const [careByRoom, setCareByRoom] = useState({});
    const [eventsByRoom, setEventsByRoom] = useState({});
    const [rowDetailByRoom, setRowDetailByRoom] = useState({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [roster, setRoster] = useState(RD_ALL_CHILDREN);
    const [ticked, setTicked] = useState(new Set());
    const [sheet, setSheet] = useState(null);
    const [toast, setToast] = useState(null);
    const [hcOverdue, setHcOverdue] = useState(!!_p.get('hc'));
    const [hcTick, setHcTick] = useState(0);
    const hcTicking = !!_p.get('hctick');
    useEffect(() => {
      if (!hcTicking) return undefined;
      const t = setInterval(() => setHcTick(n => n + 1), 60000);
      return () => clearInterval(t);
    }, [hcTicking]);
    const [headcounts, setHeadcounts] = useState([{
      at: '12:48',
      by: 'Grace Chen',
      seen: 8,
      of: 8,
      missing: []
    }, {
      at: '12:38',
      by: 'Priya Anand',
      seen: 8,
      of: 8,
      missing: []
    }]);
    const logHeadcount = rec => setHeadcounts(h => [{
      at: '12:55',
      by: educator.name,
      ...rec
    }, ...h]);
    const [portraitPane, setPortraitPane] = useState(_p.get('pane') === 'side' ? 'side' : 'bottom');
    const [conn, setConn] = useState(props.conn || (_p.get('conn') === 'offline' ? 'offline' : 'online'));
    const [synced, setSynced] = useState(0);
    const [flaky, setFlaky] = useState(!!_p.get('flaky'));
    const [pending, setPending] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const [pendingOpen, setPendingOpen] = useState(false);
    const [dueOpen, setDueOpen] = useState(false);
    const [chooser, setChooser] = useState(null);
    const [incident, setIncident] = useState(null);
    const [correct, setCorrect] = useState(null);
    const [med, setMed] = useState(null);
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
    const [nonce, setNonce] = useState(0);
    const [splash, setSplash] = useState(props.initialSplash || false);
    const [splashId, setSplashId] = useState(0);
    const educators = props.educators || RD_EDUCATORS;
    const drawerActs = {
      signOut: props.onSignOut,
      switchEducator: props.onSwitchEducator,
      headcount: () => openHeadcount(),
      camera: () => setCameraOpen(true),
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
    const busy = !!(menuOpen || sheet || chooser || incident || correct || med || profile || educatorOpen || notifsOpen || settingsOpen || cameraOpen || pendingOpen || dueOpen || calOpen || syncing);
    useEffect(() => {
      if (props.onBusyChange) props.onBusyChange(busy);
    }, [busy]);
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
        showToast('Past days are read-only');
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
        ids = [...roomPool.filter(c => c.status === 'expected'), ...RD_OTHER.filter(c => c.room === roomKey && !roster.some(r => r.id === c.id))].map(c => c.id);
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
        showToast('Past days are read-only');
        return;
      }
      if (offlineBlocked('headcount')) {
        showToast('Head counts need a connection');
        return;
      }
      setSheet({
        kind: 'headcount'
      });
    };
    const openChooser = c => {
      if (readOnly) return;
      setChooser(c);
    };
    const openSign = (c, direction) => {
      if (readOnly) {
        showToast('Past days are read-only');
        return;
      }
      if (offlineBlocked('attendance')) {
        showToast('Signing in and out needs a connection');
        return;
      }
      setSheet({
        kind: 'sign',
        id: c.id,
        direction
      });
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
    const openProfile = c => setProfile(c);
    const toastTimer = React.useRef(null);
    const showToast = (msg, undo) => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({
        msg,
        undo
      });
      toastTimer.current = setTimeout(() => setToast(null), undo ? 5200 : 2600);
    };
    const applyEvent = (ids, kind, at, details) => setRoster(rs => rs.map(c => {
      if (!ids.includes(c.id)) return c;
      const clears = c.alert && (kind === 'sleep' && /sleep/i.test(c.alert.label) || kind === 'med' && /medication/i.test(c.alert.label) || kind === 'sun' && /sunscreen/i.test(c.alert.label) || kind === 'nappy' && /nappy/i.test(c.alert.label));
      const d = details && details[c.id] || {};
      const state = kind === 'sleep' && RD_FOUND_STATE[d.detail] ? RD_FOUND_STATE[d.detail] : c.state;
      return {
        ...c,
        alert: clears ? null : c.alert,
        state,
        last: [[kind, d.at || at, d.detail || null, d.note || null, d.context || null, d.type || null], ...(c.last || []).filter(([k]) => k !== kind)].slice(0, 3),
        loggedBy: educator.name
      };
    }));
    const applyCorrection = (childId, kind, next) => setRoster(rs => rs.map(c => {
      if (c.id !== childId) return c;
      const prev = (c.last || []).find(([k]) => k === kind) || [];
      const [, oldAt, oldDetail, oldNote] = prev;
      const parts = [];
      if (next.at !== oldAt) parts.push(`Time ${RD_AMPM(oldAt) || '—'} → ${RD_AMPM(next.at)}`);
      if ((next.detail || null) !== (oldDetail || null)) {
        const what = RD_BULK[kind] && RD_BULK[kind].perChild && RD_BULK[kind].perChild.label || 'Detail';
        parts.push(`${what} ${oldDetail || '—'} → ${next.detail || '—'}`);
      }
      if ((next.note || null) !== (oldNote || null)) parts.push(next.note ? `Note “${next.note}”` : 'Note removed');
      return {
        ...c,
        state: kind === 'sleep' && RD_FOUND_STATE[next.detail] ? RD_FOUND_STATE[next.detail] : c.state,
        last: (c.last || []).map(e => e[0] === kind ? [kind, next.at, next.detail || null, next.note || null, e[4] || null, e[5] || null] : e),
        corrected: [...(c.corrected || []), kind],
        audit: [{
          at: '12:58',
          by: educator.name,
          action: `Amended ${RD_EVENT_LABEL[kind] || kind}`,
          detail: parts.join(' · ') || 'No change recorded',
          reason: next.reason || null
        }, ...(c.audit || [])]
      };
    }));
    const applySignIn = (id, at, by) => setRoster(rs => {
      if (rs.some(c => c.id === id)) {
        return rs.map(c => c.id === id ? {
          ...c,
          status: 'here',
          at,
          deliveredBy: by,
          by: null,
          loggedBy: educator.name
        } : c);
      }
      const other = RD_OTHER.find(c => c.id === id);
      if (!other) return rs;
      return [...rs, {
        ...other,
        status: 'here',
        at,
        deliveredBy: by,
        by: null,
        fuzzy: true,
        loggedBy: educator.name
      }];
    });
    const applySignOut = (id, at, by) => setRoster(rs => rs.map(c => c.id === id ? {
      ...c,
      status: 'gone',
      at,
      by,
      state: null,
      alert: null,
      loggedBy: educator.name
    } : c));
    const applyAbsent = (id, note) => setRoster(rs => rs.map(c => c.id === id ? {
      ...c,
      status: 'absent',
      state: null,
      alert: null,
      absentNote: note || null,
      loggedBy: educator.name
    } : c));
    const queue = (label, kind, childIds, at) => setPending(q => [{
      id: 'q' + q.length + '-' + kind,
      label,
      kind,
      childIds: childIds || [],
      at
    }, ...q]);
    const isPendingEvent = (c, kind) => pending.some(p => p.kind === kind && p.childIds.includes(c.id));
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
          setSynced(n);
          showToast(`All ${n} record${n === 1 ? '' : 's'} uploaded`);
        }, 1600), setTimeout(() => setSynced(0), 8000)];
      }
    };
    useEffect(() => () => syncTimers.current.forEach(clearTimeout), []);
    useEffect(() => {
      if (props.conn && props.conn !== conn) setConnection(props.conn);
    }, [props.conn]);
    const goRoom = key => {
      setScope('room');
      setRoomKey(key);
      reset();
      setMenuOpen(false);
      launch((RD_ROOMS.find(r => r.key === key) || {}).name);
    };
    const goService = () => {
      setScope('service');
      setView('rooms');
      reset();
      launch('all rooms');
    };
    const pickScope = s => s === 'service' ? goService() : goRoom(roomKey);
    const scopeNotifs = RD_NOTIFS.filter(n => scope === 'service' ? true : n.scope === 'service' || n.room === roomKey).map(n => n.derive === 'sleepDue' ? rdSleepNotif(n, roster, eventsByRoom, careByRoom) : n).filter(Boolean).map(n => ({
      ...n,
      unread: !notifRead.has(n.id)
    }));
    const notifUnread = scopeNotifs.filter(n => n.unread).length;
    const careOverride = careByRoom[roomKey];
    const roomForEvents = RD_ROOMS.find(r => r.key === roomKey) || RD_ROOMS[0];
    const roomEvents = eventsByRoom[roomKey] || rdEventsDefault(careOverride || roomForEvents.care, roomForEvents.sleepTrack);
    const rowDetail = rowDetailByRoom[roomKey] || RD_ROW_DETAIL_DEFAULT;
    const roomMaps = {
      careByRoom,
      eventsByRoom
    };
    const d = buildDashboard({
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
      openDue: () => setDueOpen(true),
      hcOverdue,
      hcTick,
      longPressChild,
      facets,
      setFacets,
      showSelectedOnly,
      setShowSelectedOnly,
      selectRule,
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
      openProfile,
      educator,
      openEducator: () => setEducatorOpen(true),
      careOverride,
      rowDetail,
      roomEvents,
      roomMaps,
      selectArm,
      notifUnread,
      openNotifs: () => setNotifsOpen(true),
      openSettings: () => setSettingsOpen(true),
      openCamera: () => setCameraOpen(true),
      readOnly,
      date: {
        index: dateIndex,
        label: RD_DATES[dateIndex],
        readOnly,
        canOlder: dateIndex < RD_DATES.length - 1,
        canNewer: dateIndex > 0,
        older: () => setDateIndex(i => Math.min(RD_DATES.length - 1, i + 1)),
        newer: () => setDateIndex(i => Math.max(0, i - 1)),
        toToday: () => setDateIndex(0),
        openCalendar: () => setCalOpen(true)
      }
    });
    const screen = React.createElement(SplitShell, {
      d: d,
      isIpad: isIpad,
      arrangement: arrangement,
      onMenu: () => setMenuOpen(true)
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
    return React.createElement(React.Fragment, null, React.createElement("div", {
      key: `${scope}-${roomKey}-${nonce}`,
      className: "screen-rise screen-fill"
    }, screen), menuOpen && React.createElement(RdDrawer, {
      scope: scope,
      roomKey: roomKey,
      rooms: RD_ROOMS.map(r => roomStats(r, roster, roomMaps)),
      onClose: () => setMenuOpen(false),
      onRoom: goRoom,
      onService: goService,
      acts: drawerActs
    }), sheet && sheet.kind === 'bulk' && React.createElement(RdBulkSheet, {
      eventKey: sheet.event,
      phone: !isIpad,
      people: sheet.ids.map(id => roster.find(c => c.id === id) || (RD_BULK[sheet.event].attendance === 'in' ? RD_OTHER.find(c => c.id === id) : null)).filter(Boolean),
      offline: conn === 'offline',
      flaky: flaky,
      educator: educator,
      advanced: !!(roomEvents && roomEvents.advancedSleep),
      sleepTrack: roomEvents && roomEvents.sleepTrack || 'Sleep',
      onClose: () => setSheet(null),
      onCommit: (okIds, at, opts, details) => {
        const ev = sheet.event;
        const one = okIds.length === 1 ? roster.find(c => c.id === okIds[0]) : null;
        const who = one ? one.name : `${okIds.length} children`;
        const before = roster,
          beforeP = pending;
        const att = RD_BULK[ev].attendance;
        if (att) {
          okIds.forEach(id => {
            const d0 = details && details[id] || {};
            const t = d0.at || at || RD_NOW;
            if (att === 'in') applySignIn(id, t, d0.detail || null);else if (att === 'out') applySignOut(id, t, d0.detail || null);else applyAbsent(id, d0.note || null);
          });
        } else {
          applyEvent(okIds, ev, at || RD_NOW, details);
        }
        afterLog();
        const evLabel = rdEventTitle(ev, (details && details[okIds[0]] || {}).context) || RD_BULK[ev].label;
        if (conn === 'offline') queue(`${evLabel} · ${who}`, ev, okIds, at || RD_NOW);
        if (!(opts && opts.silent)) {
          const undo = () => {
            setRoster(before);
            setPending(beforeP);
            showToast('Change undone');
          };
          showToast(conn === 'offline' ? `Saved on this device · ${who}` : `${evLabel} logged for ${who}`, undo);
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
        onClose: () => setSheet(null),
        onConfirm: (at, who) => {
          setSheet(null);
          const inbound = sheet.direction === 'in';
          if (inbound) applySignIn(c.id, at, who);else applySignOut(c.id, at, who);
          const label = `${inbound ? 'Signed in' : 'Signed out'} · ${c.name} · ${who} · ${at}`;
          if (conn === 'offline') {
            queue(label, 'attendance', [c.id], at);
            showToast(`Saved on this device · ${c.name.split(' ')[0]}`);
          } else showToast(`${c.name.split(' ')[0]} signed ${inbound ? 'in' : 'out'} · ${at}`);
        }
      });
    })(), sheet && sheet.kind === 'headcount' && (() => {
      const hcPresent = (scope === 'service' ? roster : roster.filter(c => c.room === roomKey)).filter(c => c.status === 'here').map(c => ({
        id: c.id,
        name: c.name,
        img: c.img,
        room: roomNameOf(c)
      }));
      return React.createElement(RdHeadcountSheet, {
        expected: hcPresent.length,
        roomName: d.identity.title,
        scopeLabel: scope === 'service' ? 'across all rooms' : 'to this room',
        present: hcPresent,
        showRoom: scope === 'service',
        history: headcounts,
        onClose: () => setSheet(null),
        onEscalate: (missingChildren, n, told) => {
          const names = (missingChildren || []).map(c => c.name);
          logHeadcount({
            seen: n,
            of: hcPresent.length,
            missing: names,
            told: told || 'nobody told yet',
            escalated: true
          });
          setSheet(null);
          const first = (missingChildren || [])[0];
          if (first) {
            const live = roster.find(c => c.id === first.id) || first;
            setIncident(live);
            showToast(`Count recorded · incident started for ${live.name.split(' ')[0]}`);
          }
        },
        onDiscrepancy: (n, told, missingChildren) => {
          setSheet(null);
          const names = (missingChildren || []).map(c => c.name);
          const toldLabel = told || 'nobody told yet';
          const withWhy = (missingChildren || []).map(c => `${c.name.split(' ')[0]} (${c.why || 'still looking'})`);
          logHeadcount({
            seen: n,
            of: hcPresent.length,
            missing: names,
            told: toldLabel,
            why: withWhy
          });
          const ids = (missingChildren || []).map(c => c.id);
          const label = `Head count · ${n} of ${hcPresent.length} seen · ${toldLabel} · not seen: ${withWhy.join(', ')}`;
          if (conn === 'offline') {
            queue(label, 'headcount', ids, RD_NOW);
            showToast('Saved on this device · not everyone seen');
          } else showToast(`Recorded · ${names.length} not seen · ${toldLabel}`);
        },
        onConfirm: (n, seenChildren) => {
          setSheet(null);
          setHcOverdue(false);
          logHeadcount({
            seen: n,
            of: hcPresent.length,
            missing: []
          });
          const ids = (seenChildren || []).map(c => c.id);
          if (conn === 'offline') {
            queue(`Head count · ${n} of ${n} seen`, 'headcount', ids, '12:55');
            showToast(`Saved on this device · ${n} seen`);
          } else {
            showToast(`Head count recorded · ${n} seen`);
          }
        }
      });
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
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 8px 24px rgba(0,40,34,0.3)',
        pointerEvents: 'auto'
      }
    }, React.createElement(RdGlyph, {
      d: RD_TICK_D,
      size: 17,
      width: 2.4
    }), toast.msg, toast.undo && React.createElement("button", {
      type: "button",
      onClick: () => {
        toast.undo();
        setToast(null);
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
        color: '#fff',
        fontSize: 13.5,
        fontWeight: 700
      }
    }, React.createElement(RdGlyph, {
      d: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
      size: 15,
      width: 2
    }), "Undo"))), chooser && React.createElement(RdEventChooser, {
      child: chooser,
      roomEvents: roomEvents,
      onClose: () => setChooser(null),
      onPick: k => {
        const c = chooser;
        setChooser(null);
        if (k === 'incident') {
          setIncident(c);
          return;
        }
        openBulk(k, [c.id]);
      }
    }), incident && React.createElement(RdIncidentSheet, {
      child: incident,
      offline: conn === 'offline',
      phone: !isIpad,
      educator: educator,
      initialDraft: drafts['incident-' + incident.id],
      onDismiss: dr => {
        stashDraft('incident-' + incident.id, dr);
        setIncident(null);
        showToast('Draft kept — reopen the incident to resume');
      },
      onClose: () => {
        clearDraft('incident-' + incident.id);
        setIncident(null);
      },
      onConfirm: ({
        kind,
        notify,
        serious,
        at,
        enteredAt
      }) => {
        const c = incident;
        clearDraft('incident-' + c.id);
        setIncident(null);
        afterLog();
        const label = `${serious ? 'Serious incident' : 'Incident'} · ${kind} · ${c.name}` + ` · happened ${RD_AMPM(at)}, entered ${RD_AMPM(enteredAt)}` + (notify === 'Not yet' ? ' · family not yet notified' : '');
        if (conn === 'offline') {
          queue(label, 'incident', [c.id], at);
          showToast(`Saved on this device · ${serious ? 'serious ' : ''}${kind.toLowerCase()} record`);
        } else {
          showToast(serious ? `Serious incident recorded · regulator must be notified within 24 hours` : notify === 'Not yet' ? `${kind} recorded · notify the family within 24 hours` : `${kind} recorded`);
        }
      }
    }), educatorOpen && React.createElement(RdEducatorSheet, {
      educators: educators,
      current: educator,
      serviceName: SERVICE.name,
      onClose: () => setEducatorOpen(false),
      onLogout: props.onSignOut ? () => {
        setEducatorOpen(false);
        props.onSignOut();
      } : undefined,
      onPick: e => {
        setEducator(e);
        setEducatorOpen(false);
        if (e.name !== educator.name) showToast(`Now recording as ${e.name}`);
      }
    }), med && React.createElement(RdMedicationSheet, {
      child: med,
      offline: conn === 'offline',
      phone: !isIpad,
      educator: educator,
      others: educators.filter(e => e.name !== educator.name),
      initialDraft: drafts['med-' + med.id],
      onDismiss: dr => {
        stashDraft('med-' + med.id, dr);
        setMed(null);
        showToast('Draft kept — reopen to resume');
      },
      onClose: () => {
        clearDraft('med-' + med.id);
        setMed(null);
      },
      onConfirm: ({
        med: medName,
        dose,
        outcome,
        amount,
        checker,
        time,
        note,
        flagged,
        flagReason,
        next
      }) => {
        const c = med;
        clearDraft('med-' + c.id);
        setMed(null);
        afterLog();
        const before = roster,
          beforeP = pending;
        const detail = `${medName}${dose ? ` · ${dose}` : ''} · ${outcome}${amount ? ` (${amount} given)` : ''}`;
        const trail = [checker ? `Checked by ${checker}` : null, next || null, flagged ? `${flagReason} — flagged for follow-up` : null, note].filter(Boolean).join(' · ');
        applyEvent([c.id], 'med', time, {
          [c.id]: {
            detail,
            note: trail || null
          }
        });
        const undo = () => {
          setRoster(before);
          setPending(beforeP);
          showToast('Change undone');
        };
        const label = `${medName} · ${outcome}${amount ? ` (${amount})` : ''} · ${c.name}${checker ? ` · checked by ${checker}` : ''}${flagged ? ` · ${flagReason.toLowerCase()}` : ''}`;
        if (conn === 'offline') {
          queue(label, 'med', [c.id], time);
          showToast(`Saved on this device · ${c.name.split(' ')[0]}`, undo);
        } else showToast(flagged ? `Recorded · flagged for follow-up` : `${outcome === 'Given' ? 'Dose given' : outcome} · ${c.name.split(' ')[0]}`, undo);
      }
    }), correct && React.createElement(RdCorrectSheet, {
      child: correct.child,
      kind: correct.kind,
      at: correct.at,
      detail: correct.detail,
      note: correct.note,
      phone: !isIpad,
      educator: educator,
      onClose: () => setCorrect(null),
      onConfirm: next => {
        const {
          child,
          kind
        } = correct;
        setCorrect(null);
        applyCorrection(child.id, kind, next);
        showToast(`${RD_EVENT_LABEL[kind] || kind} amended · ${RD_AMPM(next.at)}`);
      }
    }), notifsOpen && React.createElement(RdNotificationsSheet, {
      notifs: scopeNotifs,
      onClose: () => {
        setNotifRead(s => new Set([...s, ...scopeNotifs.map(n => n.id)]));
        setNotifsOpen(false);
      }
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
      const c = roster.find(x => x.id === profile.id) || RD_OTHER.find(x => x.id === profile.id) || profile;
      return React.createElement(RdProfileSheet, {
        child: c,
        readOnly: readOnly,
        split: isIpad,
        onEdit: scope === 'room' && !readOnly && !offlineBlocked('amendEvent') ? entry => openCorrect(c, entry) : undefined,
        onClose: () => setProfile(null)
      });
    })(), cameraOpen && React.createElement(RdCameraSheet, {
      offline: conn === 'offline',
      onClose: () => setCameraOpen(false),
      onCapture: () => {
        setCameraOpen(false);
        if (conn === 'offline') {
          queue('Photo · captured on device', 'photo', [], '12:55');
          showToast('Photo saved on this device');
        } else showToast('Photo captured (demo)');
      }
    }), calOpen && React.createElement(RdCalendarPopover, {
      onClose: () => setCalOpen(false)
    }), pendingOpen && React.createElement(RdPendingSheet, {
      conn: conn,
      pending: pending,
      syncing: syncing,
      synced: synced,
      educator: educator,
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
  window.PgDash = {
    FlowApp,
    RD_ROOMS,
    RD_EDUCATORS,
    RD_EDUCATOR,
    RD_DATES,
    roomStats,
    RD_ALL_CHILDREN
  };
})();