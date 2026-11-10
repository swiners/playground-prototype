function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(function () {
  const {
    SignInFlow,
    EDUCATORS,
    EDU_PHOTO,
    firstRoom,
    LockOverlay,
    ServiceExpired,
    ConfirmCard,
    DEMO_USER,
    DEMO_PASS,
    DEMO_PIN,
    DEVICE,
    resetDevice,
    pinOf,
    EDU_METHODS,
    SERVICE_OUTCOME,
    PIN_MAX_TRIES
  } = window.PgSignin;
  const {
    FlowApp,
    RD_ROOMS,
    roomStats,
    RD_ALL_CHILDREN,
    RD_SYNC_BG,
    RD_SYNC_FG
  } = window.PgDash;
  const toDashEducator = e => ({
    name: e.name,
    img: EDU_PHOTO(e),
    initials: e.initials
  });
  const floorRoster = signedIn => [toDashEducator(signedIn), ...EDUCATORS.filter(e => e.name !== signedIn.name && e.login < 120).slice(0, 3).map(toDashEducator)];
  const signinRooms = () => [...RD_ROOMS.map(r => {
    return {
      key: r.key,
      name: r.name,
      required: r.staffRequired
    };
  }), {
    key: null,
    name: 'Echidna Room',
    disabled: true,
    note: 'Closed today'
  }];
  const FRAMES = {
    phone: {
      device: 'phone',
      orient: 'portrait'
    },
    tablet: {
      device: 'ipad',
      orient: 'landscape'
    }
  };
  function layoutForWidth(w, h) {
    if (!w) return {
      device: 'ipad',
      orient: 'landscape'
    };
    if (h && h < 500 && w < 1000) return {
      device: 'phone',
      orient: 'portrait'
    };
    if (w >= 1100) return {
      device: 'ipad',
      orient: 'landscape'
    };
    if (w >= 700) return {
      device: 'ipad',
      orient: 'portrait'
    };
    return {
      device: 'phone',
      orient: 'portrait'
    };
  }
  const SCENARIOS = [{
    slug: 'cold',
    name: 'First morning',
    asks: 'Does the seam read as one product? Is the room you picked the room you land in?',
    p: {}
  }, {
    slug: 'sleep',
    name: 'The sleep round',
    asks: 'Five things are due in a nine-child room. Do you know what needs doing without being told, and what do you reach for first — the quick-log, the filter, or a group heading? (R-RM-2.) Watch whether "Sleep check for these 3" on the Due list gets used at all.',
    p: {
      phase: 'dash',
      room: 'nursery'
    }
  }, {
    slug: 'filter',
    name: 'Who is asleep, who is awake',
    asks: 'Ask for a sleep check for the children who are asleep, then sunscreen for the ones who are awake. Does the filter get found? Does anyone notice the quick-log now follows it and says how many? This is the task the blanket button used to win by default, because who was asleep was not on the screen at all.',
    p: {
      phase: 'dash',
      room: 'possum'
    }
  }, {
    slug: 'med',
    name: 'Medication at 1 pm',
    asks: 'The one task that must NOT be fast. A missing authorisation now FLAGS rather than blocks (D40), and an expired one is on the roster too — does that still read as careful?',
    p: {
      phase: 'dash',
      room: 'koala'
    }
  }, {
    slug: 'lunch',
    name: 'Lunch, allergies first',
    asks: 'Serve the children with allergies first, then everyone else. Two sittings, two selections — does anyone filter to Allergy, or does the whole room go in one batch with the flags read off the sheet? Health tags are on every bulk sheet, not just meals.',
    p: {
      phase: 'dash',
      room: 'koala'
    }
  }, {
    slug: 'arrival',
    name: 'Arrival at the door',
    asks: 'Does attribution feel like a record or like paperwork? And this room is 12 children to 1 educator against a 1:11 ceiling — is that noticed without being pointed at?',
    p: {
      phase: 'dash',
      room: 'kangaroo'
    }
  }, {
    slug: 'headcount',
    name: 'Head count',
    asks: 'Inverted (D39) — you tick who you have actually SEEN, and there is no all-present button. Does the extra effort read as the point, or as friction?',
    p: {
      phase: 'dash',
      room: 'kangaroo'
    }
  }, {
    slug: 'club',
    name: 'The club',
    asks: 'Eighteen children aged three to five in one room. Ask for sunscreen for the four-year-olds before they go outside — does the Age grouping get used, or does the whole room go at once? And notice what the quick-log does NOT offer: no sleep checks, no nappies, because a club does not do them (R-RS-3). Is that right, or do your three-year-olds still need toileting?',
    p: {
      phase: 'dash',
      room: 'wombat'
    }
  }, {
    slug: 'offline',
    name: 'No signal',
    asks: 'Does offline read as safe, or as broken? Nothing is due in this room — does "Nothing due · All checks are up to date" read as reassurance, or as the app having failed to load?',
    p: {
      phase: 'dash',
      room: 'bilby',
      conn: 'offline'
    }
  }, {
    slug: 'partial',
    name: 'A save that half-lands',
    asks: 'Some children saved, some did not. Does "6 saved · 3 to retry" read as the app protecting the record, or as the app being broken? Watch whether anyone tries to redo the whole round.',
    p: {
      phase: 'dash',
      room: 'bilby',
      flaky: '1'
    }
  }, {
    slug: 'service',
    name: "Who's in the building",
    asks: 'Does the one scope rule read as a decision, or as a missing feature?',
    p: {
      phase: 'dash',
      scope: 'service'
    }
  }, {
    slug: 'handover',
    name: 'Hand the tablet over',
    asks: 'The shared-device model — and the only journey that crosses the seam in both directions.',
    p: {
      phase: 'dash',
      room: 'koala'
    }
  }, {
    slug: 'return',
    name: 'Back after lunch',
    asks: 'Does the same-day shortcut read as "it remembered me", or does re-auth feel punitive?',
    p: {
      step: 'sameday'
    }
  }, {
    slug: 'past',
    name: 'Yesterday',
    asks: 'Does "this day is closed" read as a rule, or as a bug?',
    p: {
      phase: 'dash',
      room: 'koala',
      date: '1'
    }
  }];
  const UTILITIES = [{
    slug: 'errors',
    name: 'Error & empty states',
    p: {
      step: 'gallery'
    }
  }, {
    slug: 'lock',
    name: 'Screen lock',
    p: {
      phase: 'dash',
      room: 'koala',
      locked: '1'
    }
  }, {
    slug: 'expired-educator',
    name: 'Educator session expired',
    p: {
      phase: 'dash',
      room: 'koala',
      expire: 'educator'
    }
  }, {
    slug: 'expired-service',
    name: 'Service session expired',
    p: {
      phase: 'dash',
      room: 'koala',
      expire: 'centre'
    }
  }];
  const IDLE_DEFAULT_MS = 10 * 60 * 1000;
  function cachedCentre(p) {
    if (p.phase === 'dash' || p.scope || p.room) return true;
    if (p.scenario === 'educator' || p.scenario === 'return') return true;
    return ['educators', 'sameday', 'pin', 'auth', 'edupass', 'rooms', 'hub', 'pinsetup', 'addEducator'].indexOf(p.step) >= 0;
  }
  function leaveCopy(kind, u) {
    if (kind === 'centre' && !u.records && !u.drafts) {
      return {
        title: `Log out of ${SERVICE.name}?`,
        body: 'Everyone using this tablet will need the service password to sign in again.',
        keep: 'Stay signed in',
        drop: 'Log out'
      };
    }
    const rec = u.records ? `${u.records} ${u.records === 1 ? 'record hasn’t' : 'records haven’t'} been sent` : '';
    const dra = u.drafts ? `${u.drafts} ${u.drafts === 1 ? 'draft is' : 'drafts are'} saved on this tablet` : '';
    const what = [rec, dra].filter(Boolean).join(' and ');
    const it = u.records + u.drafts === 1 ? 'it' : 'them';
    const stay = u.records ? ' Stay until the records have sent to keep them.' : '';
    return kind === 'centre' ? {
      title: `Log out of ${SERVICE.name}?`,
      body: `${what}. Logging out deletes ${it}.${stay}`,
      keep: 'Stay signed in',
      drop: 'Log out anyway'
    } : {
      title: 'Switch educator?',
      body: `${what}. Switching educator deletes ${it}.${stay}`,
      keep: 'Stay in the room',
      drop: 'Switch anyway'
    };
  }
  function pgIdleSeconds(params) {
    const n = Number(params.idle);
    return params.idle && Number.isFinite(n) && n >= 1 && n <= 86400 ? n : null;
  }
  function railSelectArm(params) {
    return params.sel === 'check' ? 'check' : '';
  }
  const RAIL_RULES = [['a', 'A · Filtering'], ['b', 'B · Named bands']];
  function railSelectRule(params) {
    return params.rule === 'b' || params.rule === 'c' ? 'b' : 'a';
  }
  const RAIL_DUE_LISTS = [['current', 'Today'], ['a', 'A · By event'], ['b', 'B · Quiet list'], ['c', 'C · Next up']];
  const PG_KEEP = ['frame', 'orient', 'theme', 'rail', 'idle', 'pane', 'bare', 'duelist', 'shell', 'rule', 'emdoor', 'off'];
  function readParams() {
    const p = new URLSearchParams(window.location.search);
    const o = {};
    p.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  }
  function PlaygroundApp() {
    const [params, setParams] = useState(readParams);
    const [runId, setRunId] = useState(0);
    const bare = !!params.bare;
    const deviceInit = useRef(false);
    if (!deviceInit.current) {
      deviceInit.current = true;
      resetDevice({
        centre: cachedCentre(params)
      });
    }
    const [viewport, setViewport] = useState(() => layoutForWidth(window.innerWidth, window.innerHeight));
    useEffect(() => {
      const onResize = () => setViewport(layoutForWidth(window.innerWidth, window.innerHeight));
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
      };
    }, []);
    const realPhone = !params.frame && viewport.device === 'phone';
    const frameKey = Object.prototype.hasOwnProperty.call(FRAMES, params.frame) ? params.frame : 'tablet';
    const framed = params.frame === 'fill' || realPhone ? null : frameKey;
    const base = framed ? FRAMES[framed] : viewport;
    const layout = {
      device: base.device,
      orient: params.orient === 'landscape' || params.orient === 'portrait' ? params.orient : base.orient
    };
    const isIpad = layout.device === 'ipad';
    const land = layout.orient === 'landscape';
    const rooms = signinRooms();
    const startedInDash = params.phase === 'dash' || !!params.scope || !!params.room;
    const seedEducator = EDUCATORS[0];
    const [session, setSession] = useState(() => startedInDash ? {
      phase: 'dash',
      educator: seedEducator,
      roomKey: RD_ROOMS.some(r => r.key === params.room) ? params.room : 'koala',
      scope: params.scope === 'service' ? 'service' : 'room',
      scenario: 'service',
      signedInAt: Date.now()
    } : {
      phase: 'signin',
      educator: null,
      roomKey: null,
      scope: 'room',
      scenario: params.scenario || null,
      signedInAt: null
    });
    const [signinStart, setSigninStart] = useState({
      scenario: params.scenario,
      step: params.step
    });
    const [locked, setLocked] = useState(params.locked === '1');
    const [, setBusy] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [centreOn, setCentreOn] = useState(() => DEVICE.centre);
    const [switchId, setSwitchId] = useState(0);
    const [leaving, setLeaving] = useState(null);
    const unsent = useRef({
      records: 0,
      drafts: 0
    });
    const [expired, setExpired] = useState(() => startedInDash && (params.expire === 'educator' || params.expire === 'centre') ? params.expire : null);
    const railLocked = true;
    const [railOpen, setRailOpen] = useState(false);
    const [splashLabel, setSplashLabel] = useState(null);
    const onSignedIn = ({
      educator,
      roomKey,
      roomName,
      scenario
    }) => {
      if (switching) {
        const keep = {};
        PG_KEEP.forEach(k => {
          if (params[k]) keep[k] = params[k];
        });
        if (params.conn) keep.conn = params.conn;
        applyParams(keep);
      }
      setSwitching(false);
      setExpired(null);
      setLocked(false);
      setLeaving(null);
      setSplashLabel(roomName);
      setSession({
        phase: 'dash',
        educator,
        roomKey,
        scope: 'room',
        scenario,
        signedInAt: Date.now()
      });
      setRunId(n => n + 1);
    };
    const leaveDash = scenario => {
      const keep = {};
      PG_KEEP.forEach(k => {
        if (params[k]) keep[k] = params[k];
      });
      if (params.conn) keep.conn = params.conn;
      applyParams(scenario === 'service' ? keep : {
        ...keep,
        scenario
      });
    };
    const doSignOut = () => {
      leaveDash('service');
      DEVICE.centre = false;
      DEVICE.seedPassword = false;
      setCentreOn(false);
      setSigninStart({
        scenario: 'service',
        step: undefined
      });
      setSession({
        phase: 'signin',
        educator: null,
        roomKey: null,
        scope: 'room',
        scenario: 'service',
        signedInAt: null
      });
      setLocked(false);
      setSwitching(false);
      setExpired(null);
      setLeaving(null);
      setRunId(n => n + 1);
    };
    const beginSwitch = () => {
      setLocked(false);
      setExpired(null);
      setLeaving(null);
      setSwitching(true);
      setSwitchId(n => n + 1);
    };
    const leave = (kind, go) => {
      const u = unsent.current;
      if (kind === 'centre' || u.records || u.drafts) setLeaving({
        kind,
        go,
        records: u.records,
        drafts: u.drafts
      });else go();
    };
    const signOut = () => leave('centre', doSignOut);
    const switchEducator = () => leave('educator', beginSwitch);
    const idleMs = params.idle === '0' ? 0 : (pgIdleSeconds(params) || 0) * 1000 || IDLE_DEFAULT_MS;
    const stageRef = useRef(null);
    useEffect(() => {
      if (bare || !idleMs || session.phase !== 'dash' || locked || switching || expired || leaving) return;
      const el = stageRef.current;
      if (!el) return;
      let timer;
      const reset = () => {
        clearTimeout(timer);
        timer = setTimeout(() => setLocked(true), idleMs);
      };
      const evts = ['pointerdown', 'pointermove', 'keydown', 'scroll'];
      evts.forEach(e => el.addEventListener(e, reset, true));
      reset();
      return () => {
        clearTimeout(timer);
        evts.forEach(e => el.removeEventListener(e, reset, true));
      };
    }, [session.phase, locked, switching, expired, leaving, idleMs, bare, framed, params.shell]);
    function applyParams(next) {
      const url = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.set(k, String(v));
      });
      window.history.replaceState(null, '', url.toString() ? `?${url}` : window.location.pathname);
      setParams(readParams());
      return url;
    }
    const runScenario = sc => {
      const keep = {};
      PG_KEEP.forEach(k => {
        if (params[k]) keep[k] = params[k];
      });
      if (window.PgDash && window.PgDash.resetCounting) window.PgDash.resetCounting();
      const leaving = SCENARIOS.find(x => x.slug === params.s);
      if (params.conn && sc.p.phase === 'dash' && !(leaving && leaving.p.conn === params.conn)) keep.conn = params.conn;
      const next = {
        ...keep,
        s: sc.slug,
        ...sc.p
      };
      applyParams(next);
      setLocked(next.locked === '1');
      setSplashLabel(null);
      resetDevice({
        centre: cachedCentre(next)
      });
      setCentreOn(DEVICE.centre);
      setSwitching(false);
      setLeaving(null);
      setExpired(next.phase === 'dash' && (next.expire === 'educator' || next.expire === 'centre') ? next.expire : null);
      if (next.phase === 'dash') {
        setSession({
          phase: 'dash',
          educator: seedEducator,
          roomKey: RD_ROOMS.some(r => r.key === next.room) ? next.room : 'koala',
          scope: next.scope === 'service' ? 'service' : 'room',
          scenario: 'service',
          signedInAt: Date.now()
        });
      } else {
        setSigninStart({
          scenario: next.scenario,
          step: next.step
        });
        setSession({
          phase: 'signin',
          educator: null,
          roomKey: null,
          scope: 'room',
          scenario: next.scenario || 'service',
          signedInAt: null
        });
      }
      setRunId(n => n + 1);
    };
    const setParam = (k, v) => {
      applyParams({
        ...params,
        [k]: v
      });
      setRunId(n => n + 1);
    };
    const setConn = conn => applyParams({
      ...params,
      conn: conn === 'online' ? '' : conn
    });
    const setDueList = v => applyParams({
      ...params,
      duelist: v === 'current' ? '' : v
    });
    const setSoft = (k, v) => applyParams({
      ...params,
      [k]: v
    });
    const setTheme = k => {
      try {
        localStorage.setItem('sd-theme', k);
      } catch (e) {}
      document.documentElement.dataset.sdTheme = k;
      applyParams({
        ...params,
        theme: k
      });
    };
    const refocusMore = useRef(false);
    const closeMore = refocus => {
      refocusMore.current = !!refocus;
      setRailOpen(false);
    };
    useEffect(() => {
      if (railOpen || !refocusMore.current) return;
      refocusMore.current = false;
      const t = document.querySelector('[data-pg-more-trigger]');
      if (t) t.focus();
    }, [railOpen]);
    useEffect(() => {
      const onKey = e => {
        const mod = e.ctrlKey || e.metaKey;
        if (railLocked) return;
        if (mod && e.key === '.') {
          e.preventDefault();
          if (!railOpen) {
            setRailOpen(true);
            return;
          }
          const panel = document.querySelector('.pg-more');
          closeMore(!!(panel && panel.contains(document.activeElement)));
          return;
        }
        if (!mod || e.altKey) return;
        if (e.key === '0') {
          e.preventDefault();
          runScenario(SCENARIOS[0]);
          return;
        }
        const n = Number(e.key);
        if (n >= 1 && n <= 9 && SCENARIOS[n - 1]) {
          e.preventDefault();
          runScenario(SCENARIOS[n - 1]);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [railOpen, params, railLocked]);
    const educators = session.educator ? floorRoster(session.educator) : undefined;
    const connNow = params.conn === 'offline' ? 'offline' : 'online';
    const screen = session.phase === 'signin' ? React.createElement(SignInFlow, {
      key: `signin-${runId}`,
      layout: layout,
      bare: bare,
      start: signinStart,
      rooms: rooms,
      conn: connNow,
      idleMs: idleMs,
      onCentre: setCentreOn,
      onSignedIn: onSignedIn
    }) : React.createElement(FlowApp, {
      key: `dash-${runId}`,
      layout: layout,
      educator: session.educator ? toDashEducator(session.educator) : undefined,
      educators: educators,
      roomKey: session.roomKey,
      scope: session.scope,
      conn: connNow,
      selectArm: railSelectArm(params),
      selectRule: railSelectRule(params),
      dueList: params.duelist || 'current',
      flaky: params.flaky === '1',
      emdoor: params.emdoor === 'menu' || params.emdoor === 'both' ? params.emdoor : 'header',
      initialSplash: splashLabel,
      onSignOut: signOut,
      onSwitchEducator: switchEducator,
      onBusyChange: setBusy,
      onUnsentChange: u => {
        unsent.current = u;
      }
    });
    const covered = locked || !!expired || switching || !!leaving;
    const stage = React.createElement("div", {
      className: "device-screen",
      ref: stageRef
    }, React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        position: 'relative'
      },
      inert: covered ? '' : undefined
    }, screen), locked && !expired && React.createElement(LockOverlay, {
      educator: session.educator || seedEducator,
      layout: layout,
      conn: connNow,
      idleMs: bare ? 0 : idleMs,
      onUnlock: () => setLocked(false),
      onSwitch: () => leave('educator', beginSwitch),
      onLogout: () => leave('centre', doSignOut)
    }), expired === 'educator' && React.createElement(LockOverlay, {
      mode: "expired",
      educator: session.educator || seedEducator,
      layout: layout,
      conn: connNow,
      idleMs: bare ? 0 : idleMs,
      onUnlock: () => {
        setExpired(null);
        setSession(s => ({
          ...s,
          signedInAt: Date.now()
        }));
      },
      onSwitch: () => leave('educator', beginSwitch),
      onLogout: () => leave('centre', doSignOut)
    }), expired === 'centre' && React.createElement(ServiceExpired, {
      layout: layout,
      conn: connNow,
      kept: !!(unsent.current.records || unsent.current.drafts),
      onResume: () => setExpired(null)
    }), switching && session.phase === 'dash' && React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 41
      }
    }, React.createElement(SignInFlow, {
      key: `switch-${switchId}`,
      overlay: true,
      layout: layout,
      bare: bare,
      start: {
        scenario: 'educator'
      },
      rooms: rooms,
      conn: connNow,
      idleMs: idleMs,
      onCancel: () => setSwitching(false),
      onSignOut: signOut,
      onSignedIn: onSignedIn
    })), leaving && (() => {
      const c = leaveCopy(leaving.kind, leaving);
      return React.createElement(ConfirmCard, {
        z: 44,
        title: c.title,
        body: c.body,
        keep: c.keep,
        drop: c.drop,
        onKeep: () => setLeaving(null),
        onDrop: () => {
          const go = leaving.go;
          setLeaving(null);
          go();
        }
      });
    })());
    const stageEl = framed || bare ? React.createElement("div", {
      className: "pg-framed"
    }, React.createElement("div", {
      id: "scaler-box"
    }, React.createElement("div", {
      id: "scaler"
    }, React.createElement("div", {
      className: 'device' + (isIpad ? ' is-ipad' : '') + (isIpad && land ? ' is-landscape' : '')
    }, stage)))) : React.createElement("div", {
      className: "pg-bleed"
    }, stage);
    const shellOn = false;
    const barOn = shellOn && !railLocked;
    useLayoutEffect(() => {
      window.dispatchEvent(new Event('resize'));
    }, [framed, layout.device, layout.orient, barOn, runId]);
    const connSwitch = PG_CONN_SWITCH && !barOn && !bare && !!framed && (session.phase === 'dash' || centreOn);
    useEffect(() => {
      if (railLocked || shellOn || bare) return undefined;
      let taps = [];
      const onDown = e => {
        const el = stageRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - r.left;
        const dy = e.clientY - r.top;
        if (dx < 0 || dy < 0 || dx > 44 || dy > 44) return;
        if (e.target && e.target.closest && e.target.closest('button, a, input, select, textarea, label, summary, [role="button"], [role="menuitem"]')) return;
        const now = Date.now();
        taps = taps.filter(t => now - t < 800).concat(now);
        if (taps.length >= 3) {
          taps = [];
          setRailOpen(o => !o);
        }
      };
      window.addEventListener('pointerdown', onDown, true);
      return () => window.removeEventListener('pointerdown', onDown, true);
    }, [railLocked, shellOn, bare]);
    const morePanel = railOpen ? React.createElement(MorePanel, {
      params: params,
      setParam: setParam,
      setSoft: setSoft,
      setDueList: setDueList,
      session: session,
      layout: layout,
      framed: framed,
      onClose: closeMore,
      onExpire: who => {
        setLocked(false);
        setSwitching(false);
        setLeaving(null);
        setExpired(who);
      }
    }) : null;
    return React.createElement(React.Fragment, null, barOn ? React.createElement(ReviewShell, {
      params: params,
      setParam: setParam,
      setConn: setConn,
      setTheme: setTheme,
      runScenario: runScenario,
      session: session,
      moreOpen: railOpen,
      onMore: () => railOpen ? closeMore(true) : setRailOpen(true),
      more: morePanel,
      deviceRef: stageRef
    }, stageEl) : stageEl, connSwitch && React.createElement(ConnectionSwitch, {
      noun: framed === 'phone' ? 'Phone' : 'Tablet',
      conn: params.conn === 'offline' ? 'offline' : 'online',
      setConn: setConn
    }), !bare && !railLocked && React.createElement(React.Fragment, null, params.frame === 'fill' && params.rail !== 'hide' && !railOpen && React.createElement(FillHandle, {
      onOpen: () => setRailOpen(true)
    }), !barOn && morePanel));
  }
  function ConnectionSwitch({
    conn,
    setConn,
    bar,
    noun = 'Tablet'
  }) {
    const off = conn === 'offline';
    const common = {
      type: 'button',
      'aria-label': noun + ' offline',
      'aria-pressed': off,
      title: off ? noun + ' is offline. Click to reconnect' : 'Take the ' + noun.toLowerCase() + ' offline',
      onClick: () => setConn(off ? 'online' : 'offline')
    };
    const icon = React.createElement(SdIcon, {
      name: off ? 'wifi-off' : 'wifi',
      size: bar ? 16 : 15
    });
    if (bar) {
      return React.createElement("button", _extends({}, common, {
        className: "ds-selection-pill ds-selection-pill--sm",
        style: off ? {
          background: RD_SYNC_BG,
          color: RD_SYNC_FG,
          borderColor: 'transparent'
        } : undefined
      }), React.createElement("span", {
        className: "ds-selection-pill__icon"
      }, icon));
    }
    return React.createElement("button", _extends({}, common, {
      className: "pg-wifi",
      style: {
        all: 'unset',
        position: 'fixed',
        top: 2,
        right: 2,
        zIndex: 80,
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }), React.createElement("span", {
      style: {
        boxSizing: 'border-box',
        width: 28,
        height: 28,
        borderRadius: 'var(--sd-radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid ' + (off ? 'transparent' : 'var(--sd-colour-border-default)'),
        background: off ? RD_SYNC_BG : 'var(--sd-colour-surface-default)',
        color: off ? RD_SYNC_FG : 'var(--sd-colour-text-secondary)'
      }
    }, icon));
  }
  const ReviewShell = props => props.children;
  const MorePanel = () => null;
  const FillHandle = () => null;
  window.PlaygroundApp = PlaygroundApp;
})();