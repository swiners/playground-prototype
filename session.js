(function () {
  const {
    SignInFlow,
    EDUCATORS,
    EDU_PHOTO,
    firstRoom,
    LockOverlay,
    DEMO_USER,
    DEMO_PASS,
    DEMO_PIN
  } = window.PgSignin;
  const {
    FlowApp,
    RD_ROOMS,
    roomStats,
    RD_ALL_CHILDREN
  } = window.PgDash;
  const toDashEducator = e => ({
    name: e.name,
    img: EDU_PHOTO(e),
    initials: e.initials
  });
  const floorRoster = signedIn => [toDashEducator(signedIn), ...EDUCATORS.filter(e => e.name !== signedIn.name && e.login < 120).slice(0, 3).map(toDashEducator)];
  const signinRooms = () => [...RD_ROOMS.map(r => {
    const st = roomStats(r, RD_ALL_CHILDREN);
    return {
      key: r.key,
      name: r.name,
      ratio: `${st.ratio}:1`,
      attention: !st.ratioOk
    };
  }), {
    key: null,
    name: 'Echidna Room',
    ratio: '—',
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
  function layoutForWidth(w) {
    if (!w) return {
      device: 'ipad',
      orient: 'landscape'
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
      room: 'kangaroo',
      hc: '1'
    }
  }, {
    slug: 'club',
    name: 'The club',
    asks: 'Eighteen children aged three to five in one room. Ask for sunscreen for the four-year-old kinder group before they go outside — does the grouping get used, or does the whole room go at once? And notice what the quick-log does NOT offer: no sleep checks, no nappies, because a club does not do them (R-RS-3). Is that right, or do your three-year-olds still need toileting?',
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
    asks: 'Does the one scope rule read as a decision, or as a missing feature? The Kangaroo ratio breach is what this view is for.',
    p: {
      phase: 'dash',
      scope: 'service',
      staff: '1'
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
  }];
  const IDLE_DEFAULT_MS = 10 * 60 * 1000;
  function railSelectArm(params) {
    return params.sel === 'check' ? 'check' : '';
  }
  const RAIL_RULES = [['a', 'A · Filtering'], ['b', 'B · Named bands']];
  function railSelectRule(params) {
    return params.rule === 'b' || params.rule === 'c' ? 'b' : 'a';
  }
  function readParams() {
    const p = new URLSearchParams(window.location.search);
    const o = {};
    p.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  }
  const SHELL_NOTES = [{
    title: 'Where the demo starts',
    lines: ['Today, 12:55 pm · Little Bugs Early Learning — four rooms and two clubs, 112 children.', 'Koala Room: 20 on the roll, 13 signed in, 2 educators.', 'You are recording as William Walker. Two things are due here, and a head count is coming up.', 'Every room carries a different situation — the Nursery is mid-sleep-round, Kangaroo is over ratio.']
  }, {
    title: 'What to look for',
    lines: ['Which route you reach for first when asked to act on a group — the quick-log, the filter, or a group heading. That is the open question (R-RM-2), and OD-15 is the half of it we are testing arms on.', 'Every event time is to the minute, and each child in a batch carries their own.', 'Allergies and dietary flags on every bulk sheet, not only meals.', 'The head count has no "all present" button. That is deliberate.', 'An incident asks five plain questions and works out for itself whether it is serious.', 'Offline is a normal state, not an error.']
  }, {
    title: 'Where this stops',
    lines: ['There is no backend. Every child, room, face and event is invented, and the PIN is a string compare.', 'The camera is a stub — where a photo goes is still open (A10, C5, and OD-10, whose deadline has passed).', 'Educator presence and ratios sit behind Staffing · E11 in the rail; the rest of that work is not built.', 'Emergency lists, transport lists and checklists are out of scope, so they are absent rather than broken.', 'The phone is knowingly squished (S5).']
  }, {
    title: 'Synthetic data',
    lines: ['The children’s faces are AI-generated (D47b) — fake people by requirement, not by fallback, because this sits on a shared room tablet with parents standing at it.', 'No real family data, and nothing here touches the network.']
  }];
  function PlaygroundApp() {
    const [params, setParams] = useState(readParams);
    const [runId, setRunId] = useState(0);
    const bare = !!params.bare;
    const [viewport, setViewport] = useState(() => layoutForWidth(window.innerWidth));
    useEffect(() => {
      const onResize = () => setViewport(layoutForWidth(window.innerWidth));
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
      };
    }, []);
    const framed = params.frame === 'fill' ? null : FRAMES[params.frame] ? params.frame : 'tablet';
    const base = framed ? FRAMES[framed] : viewport;
    const layout = {
      device: base.device,
      orient: params.orient || base.orient
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
    const [locked, setLocked] = useState(!!params.locked);
    const [busy, setBusy] = useState(false);
    const railLocked = true;
    const [railOpen, setRailOpen] = useState(false);
    const [splashLabel, setSplashLabel] = useState(null);
    const onSignedIn = ({
      educator,
      roomKey,
      roomName,
      scenario
    }) => {
      setSplashLabel(roomName);
      setSession({
        phase: 'dash',
        educator,
        roomKey,
        scope: 'room',
        scenario,
        signedInAt: Date.now()
      });
    };
    const leaveDash = scenario => {
      const keep = {};
      ['frame', 'orient', 'theme', 'rail', 'idle', 'bare'].forEach(k => {
        if (params[k]) keep[k] = params[k];
      });
      applyParams(scenario === 'service' ? keep : {
        ...keep,
        scenario
      });
    };
    const signOut = () => {
      leaveDash('service');
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
      setRunId(n => n + 1);
    };
    const switchEducator = () => {
      leaveDash('educator');
      setSigninStart({
        scenario: 'educator',
        step: undefined
      });
      setSession(s => ({
        ...s,
        phase: 'signin',
        educator: null,
        roomKey: null,
        scenario: 'educator'
      }));
      setLocked(false);
      setRunId(n => n + 1);
    };
    const idleMs = params.idle === '0' ? 0 : Number(params.idle) * 1000 || IDLE_DEFAULT_MS;
    const stageRef = useRef(null);
    useEffect(() => {
      if (bare || !idleMs || session.phase !== 'dash' || locked || busy) return;
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
    }, [session.phase, locked, busy, idleMs, bare]);
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
      ['frame', 'orient', 'theme', 'rail', 'idle', 'pane', 'bare'].forEach(k => {
        if (params[k]) keep[k] = params[k];
      });
      const next = {
        ...keep,
        s: sc.slug,
        ...sc.p
      };
      applyParams(next);
      setLocked(!!next.locked);
      setSplashLabel(null);
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
    const setScope = scope => {
      applyParams({
        ...params,
        scope: scope === 'room' ? '' : scope
      });
      setSession(x => ({
        ...x,
        scope
      }));
    };
    const setConn = conn => applyParams({
      ...params,
      conn: conn === 'online' ? '' : conn
    });
    const setRoom = roomKey => {
      applyParams({
        ...params,
        room: roomKey,
        scope: ''
      });
      setSession(x => ({
        ...x,
        scope: 'room',
        roomKey
      }));
    };
    useEffect(() => {
      const onKey = e => {
        const mod = e.ctrlKey || e.metaKey;
        if (railLocked) return;
        if (mod && e.key === '.') {
          e.preventDefault();
          setRailOpen(o => !o);
          return;
        }
        if (e.key === 'Escape' && railOpen) {
          setRailOpen(false);
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
    const taps = useRef([]);
    const cornerTap = e => {
      if (railLocked || e.clientX > 44 || e.clientY > 44) return;
      const now = Date.now();
      taps.current = taps.current.filter(t => now - t < 800).concat(now);
      if (taps.current.length >= 3) {
        taps.current = [];
        setRailOpen(o => !o);
      }
    };
    const educators = session.educator ? floorRoster(session.educator) : undefined;
    const screen = session.phase === 'signin' ? React.createElement(SignInFlow, {
      key: `signin-${runId}`,
      layout: layout,
      bare: bare,
      start: signinStart,
      rooms: rooms,
      onSignedIn: onSignedIn
    }) : React.createElement(FlowApp, {
      key: `dash-${runId}`,
      layout: layout,
      educator: session.educator ? toDashEducator(session.educator) : undefined,
      educators: educators,
      roomKey: session.roomKey,
      scope: session.scope,
      conn: params.conn === 'offline' ? 'offline' : 'online',
      selectArm: railSelectArm(params),
      selectRule: railSelectRule(params),
      initialSplash: splashLabel,
      onSignOut: signOut,
      onSwitchEducator: switchEducator,
      onBusyChange: setBusy
    });
    const stage = React.createElement("div", {
      className: "device-screen",
      ref: stageRef,
      onPointerDown: cornerTap
    }, screen, locked && React.createElement(LockOverlay, {
      educator: session.educator || seedEducator,
      layout: layout,
      onUnlock: () => setLocked(false),
      onSwitch: () => {
        setLocked(false);
        switchEducator();
      },
      onLogout: () => {
        setLocked(false);
        signOut();
      }
    }));
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
    return React.createElement(React.Fragment, null, shellOn ? React.createElement(ReviewShell, {
      params: params,
      setParam: setParam,
      setConn: setConn,
      runScenario: runScenario,
      session: session
    }, stageEl) : stageEl, !bare && React.createElement(React.Fragment, null, params.rail !== 'hide' && !railLocked && !railOpen && React.createElement("button", {
      type: "button",
      onClick: () => setRailOpen(true),
      "aria-label": "Open test rail",
      title: "Test rail (Ctrl+.)",
      style: {
        all: 'unset',
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 79,
        cursor: 'pointer',
        width: 20,
        height: 74,
        borderRadius: '10px 0 0 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,40,34,0.30)',
        color: '#fff'
      }
    }, React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "13",
      height: "13",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }, React.createElement("path", {
      d: "M15 5l-7 7 7 7"
    }))), !railLocked && React.createElement(TestRail, {
      open: railOpen,
      onClose: () => setRailOpen(false),
      params: params,
      setParam: setParam,
      setScope: setScope,
      setRoom: setRoom,
      setConn: setConn,
      runScenario: runScenario,
      session: session,
      layout: layout
    })));
  }
  function ReviewShell({
    params,
    setParam,
    setConn,
    runScenario,
    session,
    children
  }) {
    const lbl = {
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--sd-colour-text-secondary)',
      margin: '0 0 8px'
    };
    const card = {
      background: 'var(--sd-colour-surface-default)',
      border: '1px solid var(--sd-colour-border-default)',
      borderRadius: 'var(--sd-radius-lg)',
      padding: '14px 15px'
    };
    const chip = on => ({
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      padding: '6px 11px',
      borderRadius: 'var(--sd-radius-full)',
      fontSize: 12.5,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      border: '1px solid ' + (on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'),
      background: on ? 'var(--sd-colour-surface-cyan)' : 'var(--sd-colour-surface-default)',
      color: on ? 'var(--sd-colour-text-on-cyan)' : 'var(--sd-colour-text-secondary)'
    });
    const group = (title, items, cur, on) => React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, React.createElement("p", {
      style: lbl
    }, title), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, items.map(([k, l, sub]) => React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => on(k),
      style: {
        ...chip(String(cur) === k),
        padding: '8px 11px',
        textAlign: 'left',
        whiteSpace: 'normal'
      }
    }, React.createElement("span", {
      style: {
        display: 'block',
        fontWeight: 700
      }
    }, l), sub && React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.75,
        marginTop: 1
      }
    }, sub)))));
    return React.createElement("div", {
      className: "pg-shell"
    }, React.createElement("header", {
      className: "pg-shell__head"
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, React.createElement("h1", {
      style: {
        fontSize: 19,
        fontWeight: 700,
        margin: 0
      }
    }, "Playground Room \u2014 sign-in to room dashboard"), React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: '0.02em',
        padding: '3px 9px',
        borderRadius: 'var(--sd-radius-full)',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)',
        whiteSpace: 'nowrap'
      }
    }, "v", PG_VERSION)), React.createElement("p", {
      style: {
        fontSize: 13,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        margin: '6px auto 0',
        maxWidth: 760
      }
    }, "Toggles on the left, journeys and what to look for on the right. Everything outside the device is a control; nothing on the device is.", React.createElement("br", null), React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, "This framing is here because the device is framed. ", React.createElement("code", null, "?frame=fill"), " drops it and leaves the test rail; ", React.createElement("code", null, "?shell=0"), " drops it and keeps the frame."))), React.createElement("div", {
      className: "pg-shell__body"
    }, React.createElement("aside", {
      className: "pg-shell__side"
    }, group('Appearance', [['light', 'Light'], ['dark', 'Dark']], params.theme || 'light', k => {
      try {
        localStorage.setItem('sd-theme', k);
      } catch (e) {}
      document.documentElement.dataset.sdTheme = k;
      setParam('theme', k);
    }), group('Connection', [['online', 'Online'], ['offline', 'Offline', 'no attendance, head counts or amendments']], params.conn || 'online', setConn)), React.createElement("div", {
      className: "pg-shell__stage"
    }, children), React.createElement("aside", {
      className: "pg-shell__side pg-shell__side--scroll"
    }, React.createElement("div", null, React.createElement("p", {
      style: lbl
    }, "Journeys"), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, SCENARIOS.map((sc, i) => React.createElement("button", {
      key: sc.slug,
      type: "button",
      title: sc.asks,
      onClick: () => runScenario(sc),
      style: {
        ...chip(params.s === sc.slug),
        padding: '8px 11px',
        textAlign: 'left',
        whiteSpace: 'normal',
        display: 'flex',
        gap: 8,
        alignItems: 'baseline'
      }
    }, React.createElement("span", {
      style: {
        opacity: 0.55,
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0
      }
    }, i + 1), React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, sc.name))))), React.createElement("div", null, React.createElement("p", {
      style: lbl
    }, "Utilities"), React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, UTILITIES.map(u => React.createElement("button", {
      key: u.slug,
      type: "button",
      onClick: () => runScenario(u),
      style: {
        ...chip(false),
        borderStyle: 'dashed'
      }
    }, u.name)), React.createElement("button", {
      type: "button",
      onClick: () => runScenario(SCENARIOS[0]),
      style: {
        ...chip(false)
      }
    }, "Reset to the start"))), (() => {
      const on = SCENARIOS.find(s => s.slug === params.s);
      return on && on.asks ? React.createElement("div", {
        style: {
          ...card,
          background: 'var(--sd-colour-surface-cyan)',
          color: 'var(--sd-colour-text-on-cyan)'
        }
      }, React.createElement("p", {
        style: {
          ...lbl,
          color: 'var(--sd-colour-text-on-cyan)',
          opacity: 0.8
        }
      }, "What this asks"), React.createElement("p", {
        style: {
          fontSize: 12,
          lineHeight: 1.5,
          margin: 0
        }
      }, on.asks)) : null;
    })(), SHELL_NOTES.map(n => React.createElement("div", {
      key: n.title,
      style: card
    }, React.createElement("p", {
      style: lbl
    }, n.title), React.createElement("ul", {
      style: {
        margin: 0,
        paddingLeft: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, n.lines.map((l, i) => React.createElement("li", {
      key: i,
      style: {
        fontSize: 12,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, l))))))));
  }
  function TestRail({
    open,
    onClose,
    params,
    setParam,
    setScope,
    setRoom,
    setConn,
    runScenario,
    session,
    layout
  }) {
    const [copied, setCopied] = useState(false);
    const group = {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      marginBottom: 18
    };
    const label = {
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--sd-colour-text-secondary)',
      margin: '0 0 2px'
    };
    const row = {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    };
    const seg = (opts, cur, on) => React.createElement("div", {
      style: row
    }, opts.map(([k, l]) => React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => on(k),
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: '6px 11px',
        borderRadius: 'var(--sd-radius-full)',
        fontSize: 12.5,
        fontWeight: 600,
        border: '1px solid ' + (String(cur) === k ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'),
        background: String(cur) === k ? 'var(--sd-colour-surface-cyan)' : 'transparent',
        color: String(cur) === k ? 'var(--sd-colour-text-on-cyan)' : 'var(--sd-colour-text-secondary)'
      }
    }, l)));
    return React.createElement("aside", {
      "aria-label": "Test rail",
      "aria-hidden": !open,
      inert: open ? undefined : '',
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 360,
        maxWidth: '92vw',
        zIndex: 80,
        background: 'var(--sd-colour-surface-grey)',
        borderLeft: '1px solid var(--sd-colour-border-default)',
        boxShadow: open ? '-16px 0 48px rgba(0,40,34,0.18)' : 'none',
        transform: open ? 'none' : 'translateX(100%)',
        transition: 'transform .26s cubic-bezier(.22,.61,.36,1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--sd-font-family)'
      }
    }, React.createElement("header", {
      style: {
        padding: '16px 18px 12px',
        borderBottom: '1px solid var(--sd-colour-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700
      }
    }, "Test rail"), React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "v", PG_VERSION)), React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Ctrl+. to toggle \xB7 Ctrl+1\u20139 for a scenario")), React.createElement("button", {
      type: "button",
      onClick: onClose,
      className: "ds-btn ds-btn--ghost ds-btn--sm"
    }, "Close")), React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '16px 18px 28px',
        fontSize: 13
      }
    }, React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Journey"), SCENARIOS.map((sc, i) => React.createElement("button", {
      key: sc.slug,
      type: "button",
      onClick: () => runScenario(sc),
      title: sc.asks,
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        display: 'flex',
        gap: 10,
        alignItems: 'baseline',
        padding: '8px 10px',
        borderRadius: 'var(--sd-radius-m)',
        background: params.s === sc.slug ? 'var(--sd-colour-surface-cyan)' : 'transparent'
      }
    }, React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--sd-colour-text-secondary)',
        width: 14,
        flexShrink: 0
      }
    }, i + 1), React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600
      }
    }, sc.name)))), React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Utilities"), React.createElement("div", {
      style: row
    }, UTILITIES.map(u => React.createElement("button", {
      key: u.slug,
      type: "button",
      onClick: () => runScenario(u),
      className: "ds-btn ds-btn--ghost ds-btn--sm"
    }, u.name)))), session.phase === 'dash' && React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Where"), seg([['room', 'A room'], ['service', 'All rooms · service']], session.scope, setScope), session.scope === 'room' && seg(RD_ROOMS.map(r => [r.key, r.name.replace(/ (Room|Club)$/, '')]), session.roomKey, setRoom)), React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Surface"), seg([['tablet', 'Tablet frame'], ['phone', 'Phone frame'], ['fill', 'Fill the screen']], params.frame || 'tablet', k => setParam('frame', k)), seg([['', 'Bare — for a session'], ['1', 'Reviewer shell']], params.shell || '', k => setParam('shell', k)), seg([['landscape', 'Horizontal'], ['portrait', 'Vertical']], layout.orient, k => setParam('orient', k))), React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Appearance"), seg([['light', 'Light'], ['dark', 'Dark']], params.theme || 'light', k => {
      localStorage.setItem('sd-theme', k);
      document.documentElement.dataset.sdTheme = k;
      setParam('theme', k);
    }), params.theme === 'dark' && React.createElement("p", {
      style: {
        fontSize: 11.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        margin: '6px 0 0'
      }
    }, "Both halves are dark-ready. The teal brand panel is mode-invariant by design \u2014 it looks the same in both.")), React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Conditions"), seg([['online', 'Online'], ['offline', 'Offline']], params.conn || 'online', setConn), seg([['', 'Staffing off'], ['1', 'Staffing · E11']], params.staff || '', k => setParam('staff', k)), React.createElement("p", {
      style: {
        ...label,
        margin: '10px 0 2px'
      }
    }, "What moves selection to the headings \xB7 OD-15"), seg(RAIL_RULES, railSelectRule(params), k => setParam('rule', k === 'a' ? '' : k)), React.createElement("p", {
      style: {
        fontSize: 11.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        margin: '6px 0 0'
      }
    }, {
      a: '⚑ 29 Sep: this arm is now the product — A, plus a select-all on every heading whenever a grouping is chosen (OD-15 resolved). Filtering drives it — the incumbent, grown up (D36 / D37). Any filter on → the bar’s select-all becomes “Clear all filters” and the headings carry selection. No filters → one global “Select all N”. ⚑ Watch the default view: unfiltered in Possum it offers “Select all 17”, which takes 13 loggable children plus 1 booked in, 1 signed out, 1 absent and 1 on holiday — D57 greys four rows in the sheet.',
      b: 'No trigger. R-RM-4 already makes this a two-level tree, so attendance gets its own heading and the bar never selects: “Select all 13 signed in” on the band, “Select all 6” on each section inside it, nothing on a state you can’t record against. The band control names the set — with Sleeping filtered it reads “Select all 6 sleeping”. Group: All is gone: under bands it would be identical to Attendance. ⚑ The task that separates the arms: set Group: Sleep/rest AND filter to Signed in, then ask for sunscreen — grouping alone does not move selection under A, so without the filter both arms are one tap and the task reports nothing. See CUSTOMER-TESTING.md §5.'
    }[railSelectRule(params)], railSelectArm(params) === 'check' && ' ⚑ Also running ?sel=check: the retired always-on row checkbox.')), React.createElement("div", {
      style: group
    }, React.createElement("p", {
      style: label
    }, "Session"), seg([['', 'Idle lock 10 min'], ['0', 'Idle lock off']], params.idle || '', k => setParam('idle', k)), React.createElement("div", {
      style: row
    }, React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--ghost ds-btn--sm",
      onClick: () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }
    }, copied ? 'Copied' : 'Copy link'), React.createElement("button", {
      type: "button",
      className: "ds-btn ds-btn--ghost ds-btn--sm",
      onClick: () => runScenario(SCENARIOS[0])
    }, "Reset"))), React.createElement("div", {
      style: {
        ...group,
        marginBottom: 0,
        borderTop: '1px solid var(--sd-colour-border-default)',
        paddingTop: 14
      }
    }, React.createElement("p", {
      style: label
    }, "Reference"), React.createElement("dl", {
      style: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '4px 12px',
        fontSize: 12.5
      }
    }, React.createElement("dt", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Service"), React.createElement("dd", {
      style: {
        margin: 0,
        fontWeight: 600
      }
    }, SERVICE.name), React.createElement("dt", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Username"), React.createElement("dd", {
      style: {
        margin: 0,
        fontWeight: 600
      }
    }, DEMO_USER), React.createElement("dt", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Password"), React.createElement("dd", {
      style: {
        margin: 0,
        fontWeight: 600
      }
    }, DEMO_PASS), React.createElement("dt", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Educator PIN"), React.createElement("dd", {
      style: {
        margin: 0,
        fontWeight: 600
      }
    }, DEMO_PIN), React.createElement("dt", {
      style: {
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Signed in as"), React.createElement("dd", {
      style: {
        margin: 0,
        fontWeight: 600
      }
    }, session.educator ? session.educator.name : '—')), React.createElement("p", {
      style: {
        fontSize: 11.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        margin: '8px 0 0'
      }
    }, "Username and password arrive pre-filled \u2014 the only thing a tester types is the PIN."))));
  }
  window.PlaygroundApp = PlaygroundApp;
})();