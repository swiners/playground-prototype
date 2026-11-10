function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(function () {
  const DEMO_USER = 'LittleBugs';
  const DEMO_PASS = 'bugs123';
  const DEMO_PIN = '1234';
  const DEMO_EMAIL = 'office@littlebugs.example.com';
  const LOGIN_ERR = "We couldn't sign in to that service, please try again. For password reset please contact the service administrator.";
  const C = ['var(--sd-colour-cyan-600)', 'var(--sd-colour-orange-500)', 'var(--sd-colour-purple-500)', 'var(--sd-colour-green-500)', 'var(--sd-colour-cyan-700)'];
  const EDUCATORS = [{
    initials: 'WW',
    color: C[0],
    name: 'William Walker',
    login: 3,
    img: 12
  }, {
    initials: 'MJ',
    color: C[1],
    name: 'Maya Johnson',
    login: 18,
    img: 5
  }, {
    initials: 'AS',
    color: C[2],
    name: 'Alex Smith',
    login: 240,
    img: 33
  }, {
    initials: 'RL',
    color: C[2],
    name: 'Rina Lee',
    login: 52,
    img: 9
  }, {
    initials: 'TN',
    color: C[3],
    name: 'Thomas Nguyen',
    login: 1,
    img: 14
  }, {
    initials: 'PS',
    color: C[4],
    name: 'Priya Sharma',
    login: 9,
    img: 16
  }, {
    initials: 'DO',
    color: C[1],
    name: "Daniel O'Brien",
    login: 75,
    img: 53
  }, {
    initials: 'GC',
    color: C[2],
    name: 'Grace Chen',
    login: 6,
    img: 20
  }, {
    initials: 'HM',
    color: C[0],
    name: 'Hannah Murphy',
    login: 900,
    img: 24
  }, {
    initials: 'OH',
    color: C[3],
    name: 'Omar Haddad',
    login: 2880,
    img: 59
  }, {
    initials: 'SK',
    color: C[3],
    name: 'Sofia Kovač',
    login: 28,
    img: 28
  }, {
    initials: 'LB',
    color: C[4],
    name: 'Liam Brown',
    login: 5760,
    img: 51
  }, {
    initials: 'AO',
    color: C[1],
    name: 'Amara Okafor',
    login: 14,
    img: 31
  }, {
    initials: 'JT',
    color: C[2],
    name: 'Jack Taylor',
    login: 11520,
    img: 60
  }, {
    initials: 'MR',
    color: C[0],
    name: 'Mia Rossi',
    login: 47,
    img: 47
  }, {
    initials: 'NW',
    color: C[3],
    name: 'Noah Wilson',
    login: 20160,
    img: 68
  }, {
    initials: 'IS',
    color: C[3],
    name: 'Isla Stewart',
    login: 12,
    img: 44
  }, {
    initials: 'KP',
    color: C[4],
    name: 'Kai Patel',
    login: 43200,
    img: 65
  }, {
    initials: 'EF',
    color: C[1],
    name: 'Ella Fischer',
    login: 420,
    img: 36
  }, {
    initials: 'YT',
    color: C[2],
    name: 'Yuki Tanaka',
    login: 1500,
    img: 40
  }];
  const EDU_PHOTO = e => e && e.img ? `img/p${e.img}.jpg` : null;
  const PIN_MAX_TRIES = 5;
  const DEFAULT_METHODS = ['pin', 'password'];
  const EDU_METHODS = {
    'Hannah Murphy': ['password'],
    'Omar Haddad': ['password', 'sso'],
    'Liam Brown': ['sso'],
    'Jack Taylor': ['pin', 'sso'],
    'Kai Patel': ['pin', 'password', 'sso'],
    'Noah Wilson': []
  };
  const DEVICE = {};
  function resetDevice(opts) {
    DEVICE.centre = !!(opts && opts.centre);
    DEVICE.username = DEMO_USER;
    DEVICE.seedPassword = true;
    DEVICE.forgotten = [];
    DEVICE.added = [];
    DEVICE.pins = {};
    DEVICE.tries = {};
    DEVICE.noOffer = {};
  }
  resetDevice({
    centre: false
  });
  function methodsOf(e) {
    if (!e) return [];
    const base = e.methods || EDU_METHODS[e.name] || DEFAULT_METHODS;
    const own = DEVICE.pins[e.name] && base.indexOf('pin') < 0 ? ['pin'].concat(base) : base;
    return svcOn('singleSignOn') ? own : own.filter(m => m !== 'sso');
  }
  const pinOf = e => e && DEVICE.pins[e.name] || (methodsOf(e).indexOf('pin') >= 0 ? DEMO_PIN : null);
  const pinLeft = e => Math.max(0, PIN_MAX_TRIES - (e && DEVICE.tries[e.name] || 0));
  const pinLocked = e => !!e && pinLeft(e) === 0;
  const pinUnlock = e => {
    if (e) DEVICE.tries[e.name] = 0;
  };
  function pinCheck(e, entered) {
    if (!e) return 'wrong';
    if (pinLocked(e)) return 'locked';
    const want = pinOf(e);
    if (want && entered === want) {
      DEVICE.tries[e.name] = 0;
      return 'ok';
    }
    DEVICE.tries[e.name] = (DEVICE.tries[e.name] || 0) + 1;
    return pinLocked(e) ? 'locked' : 'wrong';
  }
  const rememberedEducators = () => DEVICE.added.concat(EDUCATORS).filter(e => DEVICE.forgotten.indexOf(e.name) < 0);
  function forgetEducator(name) {
    if (DEVICE.forgotten.indexOf(name) < 0) DEVICE.forgotten.push(name);
    DEVICE.added = DEVICE.added.filter(e => e.name !== name);
  }
  function rememberEducator(e) {
    DEVICE.forgotten = DEVICE.forgotten.filter(n => n !== e.name);
    if (!DEVICE.added.some(x => x.name === e.name) && !EDUCATORS.some(x => x.name === e.name)) DEVICE.added.unshift(e);
  }
  const SERVICE_OUTCOME = {
    NoAccess: 'noaccess',
    AppDisabled: 'disabled'
  };
  const serviceOutcome = u => Object.prototype.hasOwnProperty.call(SERVICE_OUTCOME, u) ? SERVICE_OUTCOME[u] : null;
  const ROOM_PHOTO = name => {
    const slug = (name || 'room').replace(/\s*room$/i, '').trim().toLowerCase().split(/\s+/).join('-');
    return `img/room-${slug}.jpg`;
  };
  function agoLabel(m) {
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.round(m / 60)}h ago`;
    return `${Math.round(m / 1440)}d ago`;
  }
  function sortedEducators(sort, query) {
    const list = rememberedEducators().sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => (a.login === undefined ? 0 : a.login) - (b.login === undefined ? 0 : b.login));
    const q = (query || '').trim().toLowerCase();
    return q ? list.filter(e => e.name.toLowerCase().includes(q)) : list;
  }
  const roomByName = (name, rooms) => (rooms || []).find(r => r.name === name) || {};
  const firstRoom = rs => (rs || []).find(r => !r.disabled) || rs && rs[0] || {};
  const V1_PANEL = 'linear-gradient(180deg, var(--sd-colour-cyan-700), var(--sd-colour-cyan-1000))';
  const PANEL_FRACTION = 0.40;
  const BAND_FRACTION = 283 / 1024;
  const SZ = {
    land: {
      split: true,
      mark: 100,
      h1: 32,
      h1lh: 38,
      h2: 20,
      h2lh: 24,
      col: 400,
      listCol: 460,
      titleW: 280,
      subW: 250,
      key: 86,
      keyGap: 20,
      keyFont: 28,
      dot: 16,
      dotGap: 20,
      thumb: 64,
      rowPad: 20,
      rowTitle: 20,
      rowSub: 15,
      chev: 25,
      gap: 12,
      pad: 60,
      listPad: 60,
      navInset: 30,
      fieldH: 52,
      btnH: 48,
      label: 14,
      body: 16
    },
    port: {
      split: false,
      mark: 72,
      h1: 32,
      h1lh: 38,
      h2: 20,
      h2lh: 24,
      col: 400,
      listCol: 440,
      titleW: 730,
      subW: 640,
      key: 86,
      keyGap: 20,
      keyFont: 28,
      dot: 16,
      dotGap: 20,
      thumb: 64,
      rowPad: 20,
      rowTitle: 20,
      rowSub: 15,
      chev: 25,
      gap: 12,
      pad: 48,
      listPad: 80,
      navInset: 30,
      fieldH: 52,
      btnH: 48,
      label: 14,
      body: 16
    },
    phone: {
      split: false,
      mark: 64,
      h1: 24,
      h1lh: 29,
      h2: 17,
      h2lh: 22,
      col: 342,
      listCol: 342,
      titleW: 300,
      subW: 280,
      key: 72,
      keyGap: 16,
      keyFont: 24,
      dot: 14,
      dotGap: 16,
      thumb: 52,
      rowPad: 16,
      rowTitle: 17,
      rowSub: 14,
      chev: 20,
      gap: 10,
      pad: 24,
      listPad: 20,
      navInset: 16,
      fieldH: 52,
      btnH: 48,
      label: 13,
      body: 15
    }
  };
  const sizeFor = layout => {
    if (layout.device === 'phone') return SZ.phone;
    return layout.orient === 'landscape' ? SZ.land : SZ.port;
  };
  const ON_TEAL = {
    title: '#fff',
    sub: 'var(--sd-colour-cyan-200)',
    navBg: 'var(--sd-colour-cyan-50)',
    navFg: 'var(--sd-colour-cyan-900)'
  };
  function PhotoImg({
    src,
    alt = '',
    style,
    fallback
  }) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) return fallback;
    return React.createElement("img", {
      src: src,
      alt: alt,
      loading: "lazy",
      onError: () => setFailed(true),
      style: style
    });
  }
  function PLogo({
    size = 60,
    shadow = true
  }) {
    return React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: shadow ? '0 8px 20px rgba(0,40,34,0.22)' : 'none'
      }
    }, React.createElement("svg", {
      viewBox: "0 0 67 67",
      width: size,
      height: size,
      fill: "none",
      style: {
        display: 'block'
      },
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: "M67 33.5C67 52.0015 52.0015 67 33.5 67C14.9985 67 0 52.0015 0 33.5C0 14.9985 14.9985 0 33.5 0C52.0015 0 67 14.9985 67 33.5Z",
      fill: "#E2FDFF"
    }), React.createElement("path", {
      d: "M33.526 59.1107C47.6516 59.1107 59.1026 47.6597 59.1026 33.5342C59.1026 19.4087 47.6516 7.9577 33.526 7.9577C19.4005 7.9577 7.94952 19.4087 7.94952 33.5342C7.94952 47.6597 19.4005 59.1107 33.526 59.1107Z",
      fill: "#17AFBD"
    }), React.createElement("path", {
      d: "M29.1946 29.6269C29.1946 29.6276 29.1948 29.6285 29.1948 29.6292C29.1948 31.984 31.1159 33.8999 33.4774 33.8999C35.8381 33.8999 37.7588 31.9853 37.7601 29.6315C37.7613 31.2628 39.0878 32.5849 40.724 32.5849C42.3611 32.5849 43.6882 31.2617 43.6882 29.6292C43.6882 29.6261 43.6881 29.6232 43.6881 29.6201C43.6881 29.6232 43.6883 29.6262 43.6883 29.6292C43.6883 35.2438 39.1078 39.8113 33.4774 39.8113C31.9489 39.8113 30.4978 39.4741 29.1946 38.8712V29.6292V29.6269Z",
      fill: "#E2FDFF"
    }), React.createElement("path", {
      d: "M29.1946 38.8712V44.7131C29.1946 46.3455 27.8676 47.6687 26.2307 47.6687C24.5935 47.6687 23.2665 46.3455 23.2665 44.7131V29.6292C23.2665 29.6322 23.2667 29.6353 23.2667 29.6383C23.2703 33.7245 25.7004 37.2544 29.1946 38.8712Z",
      fill: "#E2FDFF"
    }), React.createElement("path", {
      d: "M23.2668 29.6384C23.2668 29.6354 23.2666 29.6322 23.2666 29.6292C23.2666 27.9967 24.5938 26.6735 26.2307 26.6735C26.4667 26.6735 26.696 26.7018 26.9162 26.7538C28.2225 27.0623 29.1946 28.2322 29.1946 29.6292V38.8712C25.7004 37.2544 23.2704 33.7245 23.2668 29.6384Z",
      fill: "white"
    }), React.createElement("path", {
      d: "M40.724 32.5849C39.0878 32.5849 37.7611 31.2628 37.7601 29.6315L37.7602 29.6293C37.7602 27.2743 35.8389 25.3586 33.4774 25.3586C31.1165 25.3586 29.1958 27.2731 29.1946 29.6269C29.1936 28.2308 28.2216 27.0621 26.9162 26.7538C26.6958 26.7018 26.4667 26.6735 26.2307 26.6735C24.5936 26.6735 23.2666 27.9967 23.2666 29.6292C23.2666 24.0146 27.847 19.4471 33.4774 19.4471C39.1045 19.4471 43.6829 24.0098 43.688 29.6201C43.688 29.6233 43.6881 29.6261 43.6881 29.6293C43.6881 31.2617 42.3609 32.5849 40.724 32.5849Z",
      fill: "#E2FDFF"
    })));
  }
  function SchoolLogo({
    size = 60,
    shadow = true
  }) {
    return React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: shadow ? '0 8px 20px rgba(0,40,34,0.22)' : 'none'
      }
    }, React.createElement("svg", {
      viewBox: "0 0 64 64",
      width: size,
      height: size,
      style: {
        display: 'block'
      },
      "aria-hidden": "true"
    }, React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: "32",
      fill: "#FFFFFF"
    }), React.createElement("circle", {
      cx: "32",
      cy: "32",
      r: "29.5",
      fill: "none",
      stroke: "var(--sd-colour-cyan-700)",
      strokeWidth: "2.5"
    }), React.createElement("path", {
      d: "M16 40 C16 26 30 22 44 22 C44 36 30 42 16 40 Z",
      fill: "var(--sd-colour-cyan-500)",
      opacity: "0.9"
    }), React.createElement("path", {
      d: "M19 38 C27 33 35 29 42 25",
      stroke: "#fff",
      strokeWidth: "1.6",
      fill: "none",
      strokeLinecap: "round"
    }), React.createElement("circle", {
      cx: "40",
      cy: "40",
      r: "9",
      fill: "#E5484D"
    }), React.createElement("path", {
      d: "M40 31 a9 9 0 0 0 0 18 Z",
      fill: "#C2282C"
    }), React.createElement("line", {
      x1: "40",
      y1: "31",
      x2: "40",
      y2: "49",
      stroke: "#2A1212",
      strokeWidth: "1.4"
    }), React.createElement("circle", {
      cx: "36",
      cy: "38",
      r: "1.5",
      fill: "#2A1212"
    }), React.createElement("circle", {
      cx: "44",
      cy: "38",
      r: "1.5",
      fill: "#2A1212"
    }), React.createElement("circle", {
      cx: "37",
      cy: "44",
      r: "1.5",
      fill: "#2A1212"
    }), React.createElement("circle", {
      cx: "43",
      cy: "44",
      r: "1.5",
      fill: "#2A1212"
    }), React.createElement("circle", {
      cx: "40",
      cy: "30",
      r: "3",
      fill: "#2A1212"
    })));
  }
  function EduPhotoMark({
    e,
    size = 60
  }) {
    const [failed, setFailed] = useState(false);
    const photo = EDU_PHOTO(e);
    if (!photo || failed) return React.createElement(SchoolLogo, {
      size: size
    });
    return React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        padding: 3,
        background: '#fff',
        boxShadow: '0 8px 20px rgba(0,40,34,0.22)',
        boxSizing: 'border-box'
      }
    }, React.createElement("img", {
      src: photo,
      alt: "",
      onError: () => setFailed(true),
      style: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block'
      }
    }));
  }
  function PanelMark({
    step,
    educator,
    size
  }) {
    if (step === 'service' || step === 'forgot' || step === 'forgot-sent' || step === 'svc-expired' || step === 'e-creds' || step === 'e-offline' || step === 'e-bootstrap') return React.createElement(PLogo, {
      size: size
    });
    if (step === 'auth' || step === 'pinsetup' || step === 'pin' || step === 'edupass' || step === 'rooms' || step === 'sameday' || step === 'e-locked' || step === 'e-password' || step === 'e-lock') {
      return React.createElement(EduPhotoMark, {
        e: educator || EDUCATORS[0],
        size: size
      });
    }
    if (step === 'eforgot' || step === 'eforgot-sent') return educator ? React.createElement(EduPhotoMark, {
      e: educator,
      size: size
    }) : React.createElement(SchoolLogo, {
      size: size
    });
    return React.createElement(SchoolLogo, {
      size: size
    });
  }
  function FunGlyph({
    t
  }) {
    const c = '#fff';
    const s = {
      width: '100%',
      height: '100%',
      display: 'block'
    };
    if (t === 'cloud') return React.createElement("svg", {
      viewBox: "0 0 100 60",
      fill: c,
      style: s,
      "aria-hidden": "true"
    }, React.createElement("circle", {
      cx: "28",
      cy: "38",
      r: "17"
    }), React.createElement("circle", {
      cx: "52",
      cy: "28",
      r: "22"
    }), React.createElement("circle", {
      cx: "74",
      cy: "40",
      r: "15"
    }), React.createElement("rect", {
      x: "26",
      y: "40",
      width: "50",
      height: "17",
      rx: "8.5"
    }));
    if (t === 'balloon') return React.createElement("svg", {
      viewBox: "0 0 40 58",
      fill: "none",
      style: s,
      "aria-hidden": "true"
    }, React.createElement("ellipse", {
      cx: "20",
      cy: "18",
      rx: "13",
      ry: "16",
      fill: c
    }), React.createElement("path", {
      d: "M20 34 q-3 3 0 6 q3 3 0 6 q-3 3 0 6",
      stroke: c,
      strokeWidth: "1.4",
      fill: "none"
    }));
    if (t === 'sparkle') return React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: c,
      style: s,
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: "M12 1c1 6.5 4.5 10 11 11-6.5 1-10 4.5-11 11-1-6.5-4.5-10-11-11 6.5-1 10-4.5 11-11z"
    }));
    if (t === 'plane') return React.createElement("svg", {
      viewBox: "0 0 48 40",
      fill: c,
      style: s,
      "aria-hidden": "true"
    }, React.createElement("path", {
      d: "M3 20 L45 3 L30 37 L24 27 Z"
    }));
    return React.createElement("svg", {
      viewBox: "0 0 12 12",
      fill: c,
      style: s,
      "aria-hidden": "true"
    }, React.createElement("circle", {
      cx: "6",
      cy: "6",
      r: "6"
    }));
  }
  const V_SCENE = [{
    t: 'cloud',
    top: 0.06,
    left: 0.52,
    w: 64,
    h: 38,
    o: 0.16,
    drift: 'vf-a',
    dur: 26,
    tw: 0,
    delay: 0.5
  }, {
    t: 'cloud',
    top: 0.12,
    left: 0.06,
    w: 50,
    h: 30,
    o: 0.30,
    drift: 'vf-b',
    dur: 18,
    tw: 0,
    delay: 0.2
  }, {
    t: 'cloud',
    top: 0.50,
    left: 0.72,
    w: 40,
    h: 24,
    o: 0.24,
    drift: 'vf-c',
    dur: 16,
    tw: 0,
    delay: 1.0
  }, {
    t: 'sparkle',
    top: 0.10,
    left: 0.84,
    w: 18,
    h: 18,
    o: 0.55,
    drift: 'vf-a',
    dur: 8,
    tw: 4.5,
    delay: 0.4
  }, {
    t: 'sparkle',
    top: 0.60,
    left: 0.16,
    w: 15,
    h: 15,
    o: 0.50,
    drift: 'vf-c',
    dur: 9,
    tw: 3.8,
    delay: 0.7
  }, {
    t: 'sparkle',
    top: 0.30,
    left: 0.48,
    w: 12,
    h: 12,
    o: 0.50,
    drift: 'vf-a',
    dur: 8,
    tw: 3.6,
    delay: 1.2
  }, {
    t: 'sparkle',
    top: 0.46,
    left: 0.63,
    w: 13,
    h: 13,
    o: 0.48,
    drift: 'vf-b',
    dur: 8,
    tw: 4.2,
    delay: 0.5
  }, {
    t: 'dot',
    top: 0.42,
    left: 0.32,
    w: 8,
    h: 8,
    o: 0.50,
    drift: 'vf-b',
    dur: 7,
    tw: 2.8,
    delay: 0.3
  }, {
    t: 'dot',
    top: 0.22,
    left: 0.40,
    w: 6,
    h: 6,
    o: 0.50,
    drift: 'vf-c',
    dur: 8,
    tw: 3.1,
    delay: 0.9
  }, {
    t: 'dot',
    top: 0.66,
    left: 0.50,
    w: 7,
    h: 7,
    o: 0.45,
    drift: 'vf-bob',
    dur: 9,
    tw: 3.4,
    delay: 1.4
  }, {
    t: 'balloon',
    top: 0.22,
    left: 0.80,
    w: 20,
    h: 29,
    o: 0.40,
    drift: 'vf-bob',
    dur: 7,
    tw: 0,
    delay: 0.2
  }, {
    t: 'balloon',
    top: 0.40,
    left: 0.28,
    w: 17,
    h: 25,
    o: 0.30,
    drift: 'vf-sway',
    dur: 6,
    tw: 0,
    delay: 0.6
  }, {
    t: 'plane',
    top: 0.55,
    left: 0.10,
    w: 24,
    h: 20,
    o: 0.32,
    drift: 'vf-glide',
    dur: 17,
    tw: 0,
    delay: 1.1
  }];
  function VScene() {
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }
    }, V_SCENE.map((c, i) => {
      const anim = [`${c.drift} ${c.dur}s ease-in-out ${c.delay}s infinite`, c.tw ? `vf-twinkle ${c.tw}s ease-in-out ${c.delay}s infinite` : null].filter(Boolean).join(', ');
      return React.createElement("span", {
        key: i,
        className: "vf",
        style: {
          position: 'absolute',
          top: `${c.top * 100}%`,
          left: `${c.left * 100}%`,
          width: c.w,
          height: c.h,
          opacity: c.o,
          '--o': c.o,
          animation: anim,
          willChange: 'translate, opacity',
          display: 'block'
        }
      }, React.createElement(FunGlyph, {
        t: c.t
      }));
    }));
  }
  function BounceDots({
    color = '#fff'
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        gap: 7
      }
    }, [0, 1, 2].map(i => React.createElement("span", {
      key: i,
      className: "v-bounce-dot",
      style: {
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: color,
        animationDelay: `${i * 0.15}s`
      }
    })));
  }
  function Field({
    sz,
    label,
    type = 'text',
    inputMode,
    placeholder,
    value,
    onChange,
    onEnter,
    lead,
    trail,
    onTrail,
    clearable,
    invalid,
    error
  }) {
    const border = invalid ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)';
    const inputRef = useRef(null);
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width: '100%'
      }
    }, label && React.createElement("span", {
      style: {
        fontSize: sz.label,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, label), React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: sz.fieldH,
        padding: '0 14px',
        boxSizing: 'border-box',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: border
      }
    }, lead && React.createElement(SdIcon, {
      name: lead,
      size: 18,
      style: {
        opacity: 0.5
      }
    }), React.createElement("input", {
      ref: inputRef,
      type: type,
      inputMode: inputMode,
      placeholder: placeholder,
      value: value,
      onChange: e => onChange(e.target.value),
      onKeyDown: onEnter ? e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnter();
        }
      } : undefined,
      "aria-label": label,
      "aria-invalid": invalid ? 'true' : undefined,
      style: {
        all: 'unset',
        flex: 1,
        minWidth: 0,
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        color: 'var(--sd-colour-text-primary)'
      }
    }), trail && React.createElement("button", {
      type: "button",
      onClick: onTrail,
      "aria-label": "Toggle visibility",
      style: {
        all: 'unset',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex'
      }
    }, React.createElement(SdIcon, {
      name: trail,
      size: 18,
      style: {
        opacity: 0.5
      }
    })), clearable && value && React.createElement("button", {
      type: "button",
      onClick: () => {
        onChange('');
        inputRef.current && inputRef.current.focus();
      },
      "aria-label": `Clear ${label || 'field'}`,
      style: {
        all: 'unset',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement(ClearGlyph, null))), error && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        lineHeight: 1.45
      }
    }, error));
  }
  function ClearGlyph({
    size = 20
  }) {
    return React.createElement(SdIcon, {
      name: "clear-cross-fill",
      size: size
    });
  }
  function Btn({
    sz,
    children = 'Sign in',
    disabled,
    loading,
    onClick,
    loadingLabel = 'Signing in…'
  }) {
    const off = disabled || loading;
    const bg = off && !loading ? 'var(--sd-colour-action-disabled)' : 'var(--sd-colour-action-primary)';
    const fg = off && !loading ? 'var(--sd-colour-text-disabled)' : 'var(--sd-colour-text-inverse)';
    return React.createElement("button", {
      type: "button",
      disabled: off,
      onClick: onClick,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: off ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        height: sz.btnH,
        background: loading ? 'var(--sd-colour-action-primary)' : bg,
        color: loading ? 'var(--sd-colour-text-inverse)' : fg,
        borderRadius: 'var(--sd-radius-lg)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        fontWeight: 500
      }
    }, loading && React.createElement(Spinner, {
      size: 18
    }), loading ? loadingLabel : children);
  }
  function TextLink({
    sz,
    children,
    align = 'center',
    onClick
  }) {
    return React.createElement("div", {
      style: {
        textAlign: align,
        width: '100%'
      }
    }, React.createElement("button", {
      type: "button",
      onClick: onClick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        display: 'inline-block',
        boxSizing: 'border-box',
        padding: '12px 12px',
        margin: '-12px -12px',
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        fontWeight: 500,
        color: 'var(--sd-colour-action-primary)'
      }
    }, children));
  }
  function Terms({
    sz,
    lead = 'By clicking sign in'
  }) {
    const a = {
      color: LINK,
      whiteSpace: 'nowrap'
    };
    return React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        textAlign: 'center',
        textWrap: 'balance'
      }
    }, lead, ", you agree to our ", React.createElement("span", {
      style: a
    }, "Terms of Service"), React.createElement("br", null), "and ", React.createElement("span", {
      style: a
    }, "Privacy Policy"));
  }
  function SortPills({
    sz,
    value,
    onChange
  }) {
    const pill = on => ({
      all: 'unset',
      cursor: 'pointer',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 32,
      padding: '0 12px',
      borderRadius: 'var(--sd-radius-full)',
      fontFamily: 'var(--sd-font-family)',
      fontSize: 12,
      background: on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-cyan)',
      color: on ? 'var(--sd-colour-text-inverse)' : 'var(--sd-colour-text-on-cyan)'
    });
    return React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexShrink: 0
      }
    }, React.createElement("button", {
      type: "button",
      style: pill(value === 'recent'),
      onClick: () => onChange('recent')
    }, "Recent"), React.createElement("button", {
      type: "button",
      style: pill(value === 'name'),
      onClick: () => onChange('name')
    }, "Name"));
  }
  function SearchIcon({
    color = 'currentColor'
  }) {
    return React.createElement(SdIcon, {
      name: "search",
      size: 16,
      style: {
        color
      }
    });
  }
  function Search({
    sz,
    value,
    onChange,
    placeholder = 'Search educators',
    width = 230
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 40,
        padding: '0 12px',
        boxSizing: 'border-box',
        width,
        maxWidth: '100%',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'var(--sd-colour-border-default)'
      }
    }, React.createElement(SearchIcon, {
      color: "var(--sd-colour-text-secondary)"
    }), React.createElement("input", {
      type: "search",
      value: value,
      placeholder: placeholder,
      onChange: e => onChange(e.target.value),
      style: {
        all: 'unset',
        flex: 1,
        minWidth: 0,
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        color: 'var(--sd-colour-text-primary)'
      }
    }));
  }
  function ClickableCard({
    sz,
    onClick,
    disabled,
    soft,
    children,
    trailing
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: disabled ? undefined : onClick,
      disabled: !!disabled,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: disabled ? 'default' : 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: sz.rowPad,
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'var(--sd-colour-border-default)',
        opacity: disabled && !soft ? 0.55 : 1,
        overflow: 'hidden'
      }
    }, children, trailing);
  }
  function Chevron({
    sz
  }) {
    return React.createElement(SdIcon, {
      name: "chevron-right",
      size: sz.chev,
      style: {
        color: 'var(--sd-colour-action-primary)'
      }
    });
  }
  function Plus({
    sz
  }) {
    return React.createElement(SdIcon, {
      name: "add",
      size: sz.chev,
      style: {
        color: 'var(--sd-colour-action-primary)'
      }
    });
  }
  function SquareThumb({
    sz,
    src,
    fallback
  }) {
    const style = {
      width: sz.thumb,
      height: sz.thumb,
      borderRadius: 'var(--sd-radius-m)',
      objectFit: 'cover',
      flexShrink: 0,
      background: 'var(--sd-colour-surface-grey)',
      display: 'block'
    };
    return React.createElement(PhotoImg, {
      src: src,
      style: style,
      fallback: fallback
    });
  }
  function RowTitle({
    sz,
    title,
    sub,
    subNode,
    dim
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start',
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        fontSize: sz.rowTitle,
        lineHeight: 1.2,
        fontWeight: 500,
        color: dim ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-text-primary)',
        textAlign: 'left'
      }
    }, title), (sub || subNode) && React.createElement("span", {
      style: {
        fontSize: sz.rowSub,
        lineHeight: 1.33,
        color: 'var(--sd-colour-text-secondary)',
        textAlign: 'left'
      }
    }, subNode || sub));
  }
  function EduRow({
    sz,
    e,
    onClick,
    forget,
    blocked
  }) {
    const initials = React.createElement("div", {
      style: {
        width: sz.thumb,
        height: sz.thumb,
        borderRadius: 'var(--sd-radius-m)',
        background: e.color || 'var(--sd-colour-cyan-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: sz.thumb * 0.33,
        flexShrink: 0
      }
    }, e.initials || (e.name || '?')[0]);
    const trailing = forget ? React.createElement("span", {
      style: {
        fontSize: sz.body,
        fontWeight: 600,
        color: 'var(--sd-colour-feedback-error-default)',
        flexShrink: 0
      }
    }, "Forget") : React.createElement(Chevron, {
      sz: sz
    });
    return React.createElement(ClickableCard, {
      sz: sz,
      onClick: onClick,
      disabled: blocked,
      soft: true,
      trailing: blocked ? null : trailing
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        flexShrink: 0,
        opacity: blocked ? 0.55 : 1
      }
    }, React.createElement(SquareThumb, {
      sz: sz,
      src: EDU_PHOTO(e),
      fallback: initials
    })), React.createElement(RowTitle, {
      sz: sz,
      title: e.name,
      sub: blocked ? 'Needs a connection to sign in' : `Signed in ${agoLabel(e.login)}`,
      dim: blocked
    })));
  }
  function AddRow({
    sz,
    onClick,
    disabled
  }) {
    return React.createElement(ClickableCard, {
      sz: sz,
      onClick: onClick,
      disabled: disabled,
      soft: true,
      trailing: disabled ? null : React.createElement(Plus, {
        sz: sz
      })
    }, React.createElement(RowTitle, {
      sz: sz,
      title: "Add New Educator",
      sub: disabled ? 'Needs a connection' : undefined,
      dim: disabled
    }));
  }
  function RoomRow({
    sz,
    name,
    required,
    disabled,
    note,
    onClick
  }) {
    const letter = React.createElement("div", {
      style: {
        width: sz.thumb,
        height: sz.thumb,
        borderRadius: 'var(--sd-radius-m)',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: sz.thumb * 0.42,
        flexShrink: 0
      }
    }, (name || 'R')[0]);
    const sub = React.createElement(React.Fragment, null, required ? `${required} educator${required === 1 ? '' : 's'} required` : null, note && React.createElement("span", null, required ? ' · ' : '', note));
    return React.createElement(ClickableCard, {
      sz: sz,
      onClick: onClick,
      disabled: disabled,
      trailing: React.createElement(Chevron, {
        sz: sz
      })
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0
      }
    }, React.createElement(SquareThumb, {
      sz: sz,
      src: ROOM_PHOTO(name),
      fallback: letter
    }), React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-start',
        minWidth: 0
      }
    }, React.createElement(RowTitle, {
      sz: sz,
      title: name,
      subNode: sub,
      dim: disabled
    }))));
  }
  function RoomSummary({
    sz,
    name,
    required
  }) {
    const letter = React.createElement("div", {
      style: {
        width: sz.thumb,
        height: sz.thumb,
        borderRadius: 'var(--sd-radius-m)',
        background: 'var(--sd-colour-surface-cyan)',
        color: 'var(--sd-colour-text-on-cyan)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: sz.thumb * 0.42,
        flexShrink: 0
      }
    }, (name || 'R')[0]);
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
        padding: sz.rowPad,
        boxSizing: 'border-box',
        background: 'var(--sd-colour-surface-default)',
        borderRadius: 'var(--sd-radius-lg)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'var(--sd-colour-border-default)'
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0
      }
    }, React.createElement(SquareThumb, {
      sz: sz,
      src: ROOM_PHOTO(name),
      fallback: letter
    }), React.createElement(RowTitle, {
      sz: sz,
      title: name,
      sub: required ? `${required} educator${required === 1 ? '' : 's'} required` : null
    })), React.createElement(Chevron, {
      sz: sz
    }));
  }
  const VKEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  function Key({
    sz,
    children,
    onClick,
    label
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onClick,
      "aria-label": label,
      className: "v-key",
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: sz.key,
        height: sz.key,
        borderRadius: '50%',
        background: 'var(--sd-colour-surface-grey)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.keyFont,
        fontWeight: 600,
        color: 'var(--sd-colour-text-primary)'
      }
    }, children);
  }
  function BinGlyph({
    size = 26
  }) {
    return React.createElement(SdIcon, {
      name: "delete",
      size: size
    });
  }
  function Keypad({
    sz,
    onPress,
    onDelete
  }) {
    const row = {
      display: 'flex',
      gap: sz.keyGap,
      justifyContent: 'center'
    };
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: sz.keyGap * 0.8,
        alignItems: 'center'
      }
    }, [0, 3, 6].map(i => React.createElement("div", {
      key: i,
      style: row
    }, VKEYS.slice(i, i + 3).map(d => React.createElement(Key, {
      key: d,
      sz: sz,
      onClick: () => onPress(d)
    }, d)))), React.createElement("div", {
      style: row
    }, React.createElement("span", {
      style: {
        width: sz.key,
        height: sz.key,
        flexShrink: 0
      }
    }), React.createElement(Key, {
      sz: sz,
      onClick: () => onPress('0')
    }, "0"), React.createElement(Key, {
      sz: sz,
      onClick: onDelete,
      label: "Delete"
    }, React.createElement(BinGlyph, {
      size: sz.keyFont
    }))));
  }
  function PinDots({
    sz,
    filled,
    shake
  }) {
    return React.createElement("div", {
      className: shake ? 'v-shake' : undefined,
      style: {
        display: 'flex',
        gap: sz.dotGap,
        justifyContent: 'center'
      }
    }, [0, 1, 2, 3].map(i => {
      const on = i < filled;
      return React.createElement("span", {
        key: i,
        style: {
          width: sz.dot,
          height: sz.dot,
          borderRadius: '50%',
          boxSizing: 'border-box',
          background: on ? 'var(--sd-colour-action-primary)' : 'transparent',
          borderStyle: 'solid',
          borderWidth: 1.5,
          borderColor: on ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-border-default)'
        }
      });
    }));
  }
  function Alert({
    sz,
    text,
    action,
    onAction,
    info
  }) {
    return React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        borderRadius: 'var(--sd-radius-lg)',
        background: 'var(--sd-colour-surface-red)',
        color: 'var(--sd-colour-text-on-red)',
        fontSize: 13.5
      }
    }, React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        lineHeight: 1.45
      }
    }, info && React.createElement(InfoGlyph, null), text), action && React.createElement("button", {
      type: "button",
      onClick: onAction,
      style: {
        all: 'unset',
        cursor: 'pointer',
        fontWeight: 700,
        textDecoration: 'underline',
        flexShrink: 0
      }
    }, action));
  }
  function InfoGlyph({
    size = 16
  }) {
    return React.createElement(SdIcon, {
      name: "info-alert",
      size: size,
      style: {
        marginTop: 1
      }
    });
  }
  function Notice({
    icon = 'info-alert',
    title,
    children
  }) {
    return React.createElement("div", {
      className: "ds-message-box ds-message-box--info",
      role: "status"
    }, React.createElement("div", {
      className: "ds-message-box__row"
    }, React.createElement("span", {
      className: "ds-message-box__icon",
      "aria-hidden": "true"
    }, React.createElement(SdIcon, {
      name: icon,
      size: 24
    })), React.createElement("div", {
      className: "ds-message-box__text"
    }, React.createElement("div", {
      className: "ds-message-box__title-row"
    }, React.createElement("p", {
      className: "ds-message-box__title"
    }, title))), children && React.createElement("p", {
      className: "ds-message-box__body"
    }, children)));
  }
  function OfflineNote({
    children
  }) {
    return React.createElement(Notice, {
      icon: "wifi-off",
      title: "You\u2019re offline"
    }, children);
  }
  function QuietLink({
    sz,
    children,
    onClick,
    tone
  }) {
    return React.createElement("button", {
      type: "button",
      onClick: onClick,
      style: {
        all: 'unset',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: '12px 8px',
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        fontWeight: 500,
        color: tone === 'muted' ? 'var(--sd-colour-text-secondary)' : 'var(--sd-colour-action-primary)'
      }
    }, children);
  }
  function ConfirmCard({
    title,
    body,
    keep,
    drop,
    onKeep,
    onDrop,
    z = 45
  }) {
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current) ref.current.focus();
      const esc = e => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onKeep();
        }
      };
      window.addEventListener('keydown', esc, true);
      return () => window.removeEventListener('keydown', esc, true);
    }, []);
    const btn = primary => ({
      all: 'unset',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 46,
      padding: '0 18px',
      borderRadius: 'var(--sd-radius-lg)',
      fontFamily: 'var(--sd-font-family)',
      fontSize: 15,
      fontWeight: 600,
      background: primary ? 'var(--sd-colour-action-primary)' : 'var(--sd-colour-surface-overlay)',
      color: primary ? 'var(--sd-colour-text-inverse)' : 'var(--sd-colour-text-primary)',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: primary ? 'transparent' : 'var(--sd-colour-border-default)'
    });
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: z,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        fontFamily: 'var(--sd-font-family)',
        color: 'var(--sd-colour-text-primary)'
      }
    }, React.createElement("button", {
      type: "button",
      "aria-hidden": "true",
      tabIndex: -1,
      onClick: onKeep,
      className: "rd-scrim",
      style: {
        all: 'unset',
        cursor: 'pointer',
        position: 'absolute',
        inset: 0,
        background: 'var(--sd-colour-scrim)'
      }
    }), React.createElement("div", {
      ref: ref,
      tabIndex: -1,
      className: "rd-sheet",
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": "pg-ask-t",
      "aria-describedby": "pg-ask-d",
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: 340,
        outline: 'none',
        background: 'var(--sd-colour-surface-overlay)',
        borderRadius: 'var(--sd-radius-lg)',
        boxShadow: 'var(--sd-shadow-overlay)',
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
      id: "pg-ask-t",
      style: {
        fontSize: 18,
        fontWeight: 700
      }
    }, title), React.createElement("span", {
      id: "pg-ask-d",
      style: {
        fontSize: 14,
        lineHeight: 1.45,
        fontWeight: 600,
        color: 'var(--sd-colour-text-secondary)'
      }
    }, body)), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, React.createElement("button", {
      type: "button",
      className: "fp-btn",
      onClick: onKeep,
      style: btn(true)
    }, keep), React.createElement("button", {
      type: "button",
      className: "fp-btn",
      onClick: onDrop,
      style: btn(false)
    }, drop))));
  }
  function SentGlyph({
    size = 44
  }) {
    const ray = [0, 45, 90, 135, 180, 225, 270, 315];
    return React.createElement("svg", {
      viewBox: "0 0 48 48",
      width: size,
      height: size,
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, ray.map(a => React.createElement("line", {
      key: a,
      x1: "24",
      y1: "7",
      x2: "24",
      y2: "10.5",
      stroke: "var(--sd-colour-action-primary)",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      transform: `rotate(${a} 24 26)`
    })), React.createElement("circle", {
      cx: "24",
      cy: "26",
      r: "10.5",
      fill: "var(--sd-colour-surface-cyan)",
      stroke: "var(--sd-colour-text-primary)",
      strokeWidth: "2"
    }), React.createElement("path", {
      d: "M19.5 26.2l3.2 3.2 6.2-6.6",
      stroke: "var(--sd-colour-text-primary)",
      strokeWidth: "2.2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), React.createElement("path", {
      d: "M31 19l9-9m0 0l-5 .8m5-.8l-.8 5",
      stroke: "var(--sd-colour-text-primary)",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  function LockGlyph({
    size = 30
  }) {
    return React.createElement(SdIcon, {
      name: "lock",
      size: size
    });
  }
  function StatePanel({
    sz,
    tone = 'neutral',
    glyph,
    iconName,
    node,
    title,
    body,
    secondary,
    onSecondary
  }) {
    const isErr = tone === 'error';
    const circleBg = isErr ? 'var(--sd-colour-surface-red)' : 'var(--sd-colour-surface-grey)';
    const fg = isErr ? 'var(--sd-colour-text-on-red)' : 'var(--sd-colour-text-secondary)';
    const d = sz.split ? 84 : 72;
    return React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        textAlign: 'center',
        width: '100%'
      }
    }, React.createElement("div", {
      style: {
        width: d,
        height: d,
        borderRadius: '50%',
        background: circleBg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: d * 0.38,
        fontWeight: 700
      }
    }, node || (iconName ? React.createElement(SdIcon, {
      name: iconName,
      size: d * 0.4,
      style: {
        opacity: 0.6
      }
    }) : glyph)), React.createElement("div", null, React.createElement("h2", {
      style: {
        margin: '0 0 6px',
        fontSize: sz.h1 * 0.7,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)',
        letterSpacing: '-0.01em'
      }
    }, title), React.createElement("p", {
      style: {
        margin: 0,
        fontSize: sz.body,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        maxWidth: 380
      }
    }, body)), secondary && React.createElement(TextLink, {
      sz: sz,
      onClick: onSecondary
    }, secondary));
  }
  function NavPill({
    sz,
    kind,
    onNav,
    compact
  }) {
    if (!kind) return null;
    const label = kind === 'logout' ? 'Sign Out' : kind === 'cancel' ? 'Cancel' : 'Back';
    return React.createElement("button", {
      type: "button",
      onClick: onNav,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'absolute',
        top: compact ? 8 : sz.navInset,
        left: compact ? 8 : sz.navInset,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        height: compact ? 40 : 48,
        padding: compact ? '0 12px' : '0 16px',
        background: ON_TEAL.navBg,
        color: ON_TEAL.navFg,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: ON_TEAL.navFg,
        borderRadius: 'var(--sd-radius-lg)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: compact ? 14 : 16,
        fontWeight: 500
      }
    }, label);
  }
  function V1Shell({
    sz,
    step,
    educator,
    title,
    subtitle,
    nav,
    onNav,
    children,
    footer,
    center,
    panelH,
    wide,
    forceShort
  }) {
    const split = sz.split;
    const short = !!forceShort || !split && typeof window !== 'undefined' && window.innerHeight > 0 && window.innerHeight < 640;
    const measure = wide ? sz.listCol : sz.col;
    const panel = React.createElement("div", {
      style: {
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        background: V1_PANEL,
        ...(split ? {
          width: `${PANEL_FRACTION * 100}%`,
          height: '100%'
        } : {
          width: '100%',
          height: short ? 'auto' : panelH,
          minHeight: short ? 84 : undefined
        }),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: split ? '32px' : short ? '12px 98px' : '24px 32px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }
    }, React.createElement(VScene, null), React.createElement(NavPill, {
      sz: sz,
      kind: nav,
      onNav: onNav,
      compact: short
    }), React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        maxWidth: '100%'
      }
    }, !short && React.createElement(PanelMark, {
      step: step,
      educator: educator,
      size: sz.mark
    }), title && React.createElement("h1", {
      style: {
        margin: 0,
        maxWidth: short ? '100%' : sz.titleW,
        fontSize: short ? 20 : sz.h1,
        lineHeight: short ? '24px' : `${sz.h1lh}px`,
        fontWeight: 700,
        color: ON_TEAL.title,
        letterSpacing: '-0.01em'
      }
    }, title), subtitle && React.createElement("p", {
      style: {
        margin: 0,
        maxWidth: short ? '100%' : sz.subW,
        fontSize: short ? 14 : sz.h2,
        lineHeight: short ? '18px' : `${sz.h2lh}px`,
        fontWeight: 600,
        color: ON_TEAL.sub
      }
    }, subtitle)));
    const content = React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: `${sz.pad}px ${sz.listPad}px`,
        boxSizing: 'border-box'
      }
    }, React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: measure,
        display: 'flex',
        flexDirection: 'column',
        gap: sz.gap,
        margin: center ? 'auto 0' : 0
      }
    }, children)), footer && React.createElement("div", {
      style: {
        flexShrink: 0,
        padding: `${sz.gap * 1.5}px ${sz.listPad}px ${sz.pad}px`,
        display: 'flex',
        justifyContent: 'center'
      }
    }, React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: measure
      }
    }, footer)));
    return React.createElement("div", {
      style: {
        ...screenBase,
        flexDirection: split ? 'row' : 'column',
        background: 'var(--sd-colour-surface-default)'
      }
    }, panel, content);
  }
  const ERROR_STATES = [{
    step: 'e-creds',
    label: 'Wrong credentials',
    sub: 'Service login · inline error'
  }, {
    step: 'e-offline',
    label: 'Offline / no network',
    sub: 'Service login · banner + retry'
  }, {
    step: 'e-disabled',
    label: 'App disabled',
    sub: 'Blocking state'
  }, {
    step: 'e-noaccess',
    label: 'No access / forbidden',
    sub: 'Blocking state'
  }, {
    step: 'e-edulist',
    label: 'Educator list failed',
    sub: 'Error + retry'
  }, {
    step: 'e-locked',
    label: 'PIN locked',
    sub: 'Lockout · blocking'
  }, {
    step: 'e-norooms',
    label: 'No rooms available',
    sub: 'Empty state'
  }, {
    step: 'e-password',
    label: 'Educator password login',
    sub: 'Password auth branch (mirrors S7)'
  }, {
    step: 'e-bootstrap',
    label: 'Bootstrap failed',
    sub: 'Error + retry'
  }, {
    step: 'e-lock',
    label: 'Auto screen-lock',
    sub: 'Idle · PIN re-auth'
  }];
  const ERROR_STEPS = ERROR_STATES.map(e => e.step);
  const isErrorView = step => step === 'gallery' || ERROR_STEPS.includes(step);
  function ErrorGallery({
    sz = SZ.land,
    onPick
  }) {
    const two = sz.split;
    return React.createElement("div", {
      style: {
        ...screenBase,
        background: 'var(--sd-colour-surface-grey)'
      }
    }, React.createElement("div", {
      style: {
        background: 'var(--sd-colour-surface-default)',
        padding: two ? '56px 56px 22px' : '52px 24px 16px',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'var(--sd-colour-border-default)',
        flexShrink: 0
      }
    }, React.createElement("div", {
      style: {
        fontSize: two ? 14 : 12,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--sd-colour-text-secondary)'
      }
    }, "Error states"), React.createElement("div", {
      style: {
        fontSize: two ? 30 : 22,
        fontWeight: 700,
        color: 'var(--sd-colour-text-primary)',
        letterSpacing: '-0.01em'
      }
    }, "Error & empty states")), React.createElement("div", {
      style: two ? {
        padding: '24px 56px 36px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        alignContent: 'start',
        flex: 1,
        minHeight: 0,
        overflowY: 'auto'
      } : {
        padding: '16px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1,
        minHeight: 0,
        overflowY: 'auto'
      }
    }, ERROR_STATES.map(e => React.createElement(ClickableCard, {
      key: e.step,
      sz: sz,
      onClick: () => onPick(e.step),
      trailing: React.createElement(Chevron, {
        sz: sz
      })
    }, React.createElement(RowTitle, {
      sz: sz,
      title: e.label,
      sub: e.sub
    })))));
  }
  function buildStepCfg(step, ctx) {
    const {
      sz,
      educator,
      room,
      rooms,
      addEmail,
      addPin,
      showAddPin,
      scenario,
      offline,
      overlay,
      forgetMode,
      errBack,
      eduSort,
      eduQuery,
      setEduSort,
      setEduQuery,
      pickRoom,
      pickEducator,
      samedayContinue,
      switchEducator,
      signOutService,
      onCancel,
      setStep,
      setAddEmail,
      setAddPin,
      setShowAddPin,
      setForgetMode,
      askForget,
      addEducatorDone,
      goForgot
    } = ctx;
    if (step === 'educators') {
      const list = sortedEducators(eduSort, eduQuery);
      const any = rememberedEducators().length > 0;
      return {
        title: forgetMode ? 'Forget an educator' : `Welcome to ${SERVICE.name}`,
        subtitle: forgetMode ? 'Tap someone to take them off this tablet’s list' : 'Select your educator profile',
        wide: true,
        nav: overlay ? 'cancel' : null,
        onNav: onCancel,
        children: React.createElement(React.Fragment, null, offline && React.createElement(OfflineNote, null, "Sign in with your PIN. ", svcOn('singleSignOn') ? 'A password, single sign-on or a new educator' : 'A password or a new educator', " needs a connection."), React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap'
          }
        }, React.createElement(SortPills, {
          sz: sz,
          value: eduSort,
          onChange: setEduSort
        }), React.createElement(Search, {
          sz: sz,
          value: eduQuery,
          onChange: setEduQuery,
          width: sz.split ? 230 : '100%'
        })), React.createElement("div", {
          className: "v-stagger",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: sz.gap
          }
        }, !forgetMode && React.createElement(AddRow, {
          sz: sz,
          disabled: offline,
          onClick: () => {
            setAddEmail('');
            setAddPin('');
            setStep('addEducator');
          }
        }), list.map(e => React.createElement(EduRow, {
          key: e.name,
          sz: sz,
          e: e,
          forget: forgetMode,
          blocked: offline && !forgetMode && methodsOf(e).indexOf('pin') < 0,
          onClick: () => forgetMode ? askForget(e) : pickEducator(e)
        }))), list.length === 0 && React.createElement("p", {
          style: {
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--sd-colour-text-secondary)',
            margin: '8px 0'
          }
        }, eduQuery.trim() ? `No educators match “${eduQuery}”.` : 'No educators on this tablet yet. Add one to get started.')),
        footer: React.createElement("div", {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: sz.split ? 28 : 16
          }
        }, (any || forgetMode) && React.createElement(QuietLink, {
          sz: sz,
          onClick: () => setForgetMode(!forgetMode)
        }, forgetMode ? 'Done' : 'Forget an educator'), !forgetMode && React.createElement(QuietLink, {
          sz: sz,
          tone: "muted",
          onClick: signOutService
        }, "Sign out of the service"))
      };
    }
    if (step === 'addEducator') {
      const ready = addEmail && addPin;
      return {
        title: 'Add Educator Profile',
        subtitle: 'Please sign into your Educator Profile',
        nav: 'back',
        onNav: () => setStep('educators'),
        center: true,
        children: React.createElement(React.Fragment, null, React.createElement(Field, {
          sz: sz,
          label: "Educator email or phone",
          placeholder: "Email or phone number",
          value: addEmail,
          onChange: setAddEmail,
          onEnter: () => {
            if (ready) addEducatorDone();
          }
        }), React.createElement(Field, {
          sz: sz,
          label: "Password or access PIN",
          type: showAddPin ? 'text' : 'password',
          placeholder: "Password or Pin",
          value: addPin,
          onChange: setAddPin,
          onEnter: () => {
            if (ready) addEducatorDone();
          },
          trail: showAddPin ? 'view-hide' : 'view',
          onTrail: () => setShowAddPin(s => !s)
        }), React.createElement(Terms, {
          sz: sz
        }), React.createElement(Btn, {
          sz: sz,
          disabled: !ready,
          onClick: addEducatorDone
        }, "Sign in")),
        footer: React.createElement(TextLink, {
          sz: sz,
          onClick: () => goForgot('addEducator')
        }, "Forgot Password?")
      };
    }
    if (step === 'rooms') {
      const ed = educator || EDUCATORS[0];
      return {
        title: React.createElement(React.Fragment, null, "Welcome", React.createElement("br", null), ed.name),
        subtitle: 'Select your Room',
        nav: 'back',
        wide: true,
        onNav: () => setStep(scenario === 'return' ? 'sameday' : 'educators'),
        children: React.createElement("div", {
          className: "v-stagger",
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: sz.gap
          }
        }, (rooms || []).map(r => React.createElement(RoomRow, _extends({
          key: r.name,
          sz: sz
        }, r, {
          onClick: () => pickRoom(r.name)
        }))))
      };
    }
    if (step === 'sameday') {
      const ed = educator || EDUCATORS[0];
      const rn = room || firstRoom(rooms).name;
      const rr = roomByName(rn, rooms);
      const first = ed.name.split(' ')[0];
      return {
        title: React.createElement(React.Fragment, null, "Welcome Back", React.createElement("br", null), ed.name),
        subtitle: 'Your room for today',
        nav: null,
        center: true,
        children: React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 17,
            width: '100%'
          }
        }, React.createElement("span", {
          style: {
            fontSize: sz.body,
            fontWeight: 500,
            color: 'var(--sd-colour-action-hover)'
          }
        }, "Remembered from last Session"), React.createElement(RoomSummary, {
          sz: sz,
          name: rn,
          required: rr.required
        }), React.createElement(TextLink, {
          sz: sz,
          onClick: () => setStep('rooms')
        }, "Change Room"), React.createElement("div", {
          style: {
            height: 2,
            width: '96%',
            background: 'var(--sd-colour-border-default)',
            opacity: 0.5,
            flexShrink: 0
          }
        }), React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap'
          }
        }, React.createElement("span", {
          style: {
            fontSize: sz.body,
            fontWeight: 500,
            color: 'var(--sd-colour-text-primary)'
          }
        }, "Not ", first, "?"), React.createElement("button", {
          type: "button",
          onClick: switchEducator,
          style: {
            all: 'unset',
            cursor: 'pointer',
            fontFamily: 'var(--sd-font-family)',
            fontSize: sz.body,
            fontWeight: 500,
            color: 'var(--sd-colour-action-primary)'
          }
        }, "Switch Educator")), React.createElement(QuietLink, {
          sz: sz,
          tone: "muted",
          onClick: signOutService
        }, "Sign out of the service")),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: samedayContinue
        }, "Continue to ", rn)
      };
    }
    if (isErrorView(step) && step !== 'gallery') {
      const toBack = errBack;
      const back = {
        nav: 'back',
        onNav: toBack
      };
      if (step === 'e-creds') return {
        title: 'Sign in to Playground',
        subtitle: 'Please sign into your service',
        ...back,
        center: true,
        children: React.createElement(React.Fragment, null, React.createElement(Field, {
          sz: sz,
          label: "Service username",
          value: "LittleBugs",
          onChange: () => {},
          lead: "user"
        }), React.createElement(Field, {
          sz: sz,
          label: "Service password",
          type: "password",
          value: "wrongpass123",
          onChange: () => {},
          invalid: true,
          error: LOGIN_ERR
        }), React.createElement(Btn, {
          sz: sz,
          onClick: toBack
        }, "Sign in")),
        footer: React.createElement(TextLink, {
          sz: sz,
          onClick: toBack
        }, "Forgot Password?")
      };
      if (step === 'e-offline') return {
        title: 'Sign in to Playground',
        subtitle: 'Please sign into your service',
        ...back,
        center: true,
        children: React.createElement(React.Fragment, null, React.createElement(Alert, {
          sz: sz,
          text: "No internet connection.",
          action: "Retry",
          onAction: toBack
        }), React.createElement(Field, {
          sz: sz,
          label: "Service username",
          placeholder: "Username",
          value: "",
          onChange: () => {},
          lead: "user"
        }), React.createElement(Field, {
          sz: sz,
          label: "Service password",
          type: "password",
          placeholder: "Password",
          value: "",
          onChange: () => {}
        }), React.createElement(Terms, {
          sz: sz
        }), React.createElement(Btn, {
          sz: sz,
          disabled: true
        }, "Sign in"))
      };
      if (step === 'e-disabled') return {
        ...back,
        center: true,
        children: React.createElement(StatePanel, {
          sz: sz,
          tone: "error",
          glyph: "\u2298",
          title: "App disabled",
          body: "This app has been disabled for your service. Please contact your service administrator."
        }),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: toBack
        }, "Back to sign in")
      };
      if (step === 'e-noaccess') return {
        ...back,
        center: true,
        children: React.createElement(StatePanel, {
          sz: sz,
          tone: "error",
          glyph: "\u2715",
          title: "No access",
          body: "Your account doesn't have access to this app. Contact your service administrator to request access."
        }),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: toBack
        }, "Back to sign in")
      };
      if (step === 'e-edulist') return {
        ...back,
        center: true,
        children: React.createElement(StatePanel, {
          sz: sz,
          tone: "error",
          glyph: "!",
          title: "Couldn't load educators",
          body: "Something went wrong loading the educator list. Check your connection and try again."
        }),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: toBack
        }, "Retry")
      };
      if (step === 'e-locked') {
        const first = (educator || EDUCATORS[0]).name.split(' ')[0];
        return {
          ...back,
          center: true,
          children: React.createElement(StatePanel, {
            sz: sz,
            tone: "error",
            node: React.createElement(LockGlyph, {
              size: sz.split ? 34 : 28
            }),
            title: "PIN locked",
            body: `Too many wrong PINs for ${first}. Sign in another way to unlock it.`,
            secondary: "Use password",
            onSecondary: toBack
          })
        };
      }
      if (step === 'e-norooms') return {
        ...back,
        center: true,
        children: React.createElement(StatePanel, {
          sz: sz,
          iconName: "image",
          title: "No rooms available",
          body: "There are no rooms set up for this service yet. Contact your service administrator.",
          secondary: "Refresh",
          onSecondary: toBack
        })
      };
      if (step === 'e-password') {
        const ed = educator || EDUCATORS[0];
        return {
          title: React.createElement(React.Fragment, null, "Welcome Back", React.createElement("br", null), ed.name),
          subtitle: 'Enter your password',
          ...back,
          center: true,
          children: React.createElement(Field, {
            sz: sz,
            label: "Password",
            type: "password",
            placeholder: "Your password",
            value: "",
            onChange: () => {},
            trail: "view"
          }),
          footer: React.createElement("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }
          }, React.createElement(Btn, {
            sz: sz,
            disabled: true
          }, "Sign in"), React.createElement(TextLink, {
            sz: sz,
            onClick: toBack
          }, "Use PIN instead"), React.createElement(TextLink, {
            sz: sz,
            onClick: toBack
          }, "Forgot password?"))
        };
      }
      if (step === 'e-bootstrap') return {
        ...back,
        center: true,
        children: React.createElement(StatePanel, {
          sz: sz,
          tone: "error",
          glyph: "!",
          title: "Couldn't start the app",
          body: "Something went wrong while loading. Please try again."
        }),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: toBack
        }, "Retry")
      };
    }
    return {};
  }
  function useCreds(opts) {
    const offline = !!(opts && opts.offline);
    const seed = !(opts && opts.seedPassword === false) && DEVICE.seedPassword;
    const [username, setUsername] = useState(DEVICE.username);
    const [password, setPassword] = useState(seed ? DEMO_PASS : '');
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [retried, setRetried] = useState(false);
    useEffect(() => {
      if (!offline) setRetried(false);
    }, [offline]);
    const changeUser = v => {
      setUsername(v);
      setErr(false);
    };
    const changePass = v => {
      setPassword(v);
      setErr(false);
    };
    const userProps = {
      label: 'Service username',
      placeholder: 'Username',
      value: username,
      onChange: changeUser,
      lead: 'user'
    };
    const pwProps = {
      label: 'Service password',
      type: showPw ? 'text' : 'password',
      placeholder: 'Password',
      value: password,
      onChange: changePass,
      trail: showPw ? 'view-hide' : 'view',
      onTrail: () => setShowPw(s => !s),
      invalid: err,
      error: err ? LOGIN_ERR : null
    };
    const submit = (onOk, onBlocked) => {
      if ((username === DEMO_USER || serviceOutcome(username)) && password === DEMO_PASS) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const outcome = serviceOutcome(username);
          if (outcome && onBlocked) {
            onBlocked(outcome);
            return;
          }
          DEVICE.username = username;
          DEVICE.centre = true;
          onOk();
        }, 1150);
      } else setErr(true);
    };
    const reset = () => {
      setUsername(DEVICE.username);
      setPassword('');
      setShowPw(false);
      setErr(false);
      setLoading(false);
      setRetried(false);
    };
    return {
      userProps,
      pwProps,
      ready: !!(username && password),
      err,
      loading,
      submit,
      retried,
      retry: () => setRetried(true),
      reset
    };
  }
  function serviceCfg(sz, creds, onSignIn, onForgot, opts) {
    const {
      offline,
      onBlocked,
      banner,
      subtitle
    } = opts || {};
    const {
      userProps,
      pwProps,
      ready,
      loading,
      submit,
      retried,
      retry
    } = creds;
    const go = () => {
      if (ready && !offline && !loading) submit(onSignIn, onBlocked);
    };
    return {
      title: 'Sign in to Playground',
      subtitle: subtitle || 'Please sign into your service',
      nav: null,
      center: true,
      children: React.createElement(React.Fragment, null, banner, offline && React.createElement(Alert, {
        sz: sz,
        text: retried ? 'Still no internet connection. Check the Wi-Fi and try again.' : 'No internet connection.',
        action: "Retry",
        onAction: retry
      }), React.createElement(Field, _extends({
        sz: sz
      }, userProps, {
        onEnter: go
      })), React.createElement(Field, _extends({
        sz: sz
      }, pwProps, {
        onEnter: go
      })), React.createElement(Terms, {
        sz: sz
      }), React.createElement(Btn, {
        sz: sz,
        disabled: !ready || offline,
        loading: loading,
        onClick: () => submit(onSignIn, onBlocked)
      }, "Sign in")),
      footer: onForgot ? React.createElement(TextLink, {
        sz: sz,
        onClick: onForgot
      }, "Forgot Password?") : undefined
    };
  }
  const RESET_NOT_FOUND = "We couldn't find an account with that email address. Please try again.";
  const RESET_NOT_FOUND_HELP = 'Invalid email lookup. Try registering a new educator profile or contact Playground support.';
  const RESET_BAD_FORMAT = 'Enter an email address, like name@example.com.';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function useForgot(kind) {
    const edu = kind === 'educator';
    const [email, setEmail] = useState(edu ? '' : DEMO_EMAIL);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);
    const change = v => {
      setEmail(v);
      setErr(null);
    };
    const submit = onSent => {
      const v = email.trim();
      if (!edu && !EMAIL_RE.test(v)) {
        setErr('format');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (!edu && v.toLowerCase() !== DEMO_EMAIL) setErr('missing');else {
          setResent(false);
          onSent();
        }
      }, 1150);
    };
    const resend = () => setResent(true);
    const reset = () => {
      setEmail(edu ? '' : DEMO_EMAIL);
      setErr(null);
      setLoading(false);
      setResent(false);
    };
    return {
      email,
      change,
      err,
      loading,
      submit,
      resent,
      resend,
      reset
    };
  }
  function forgotCfg(sz, fp, onBack, onSent, edu) {
    const {
      email,
      change,
      err,
      loading,
      submit
    } = fp;
    return {
      title: 'Reset your password',
      subtitle: edu ? 'Please enter your username for a reset link' : 'Please enter your email for a reset link',
      nav: 'back',
      onNav: onBack,
      center: true,
      children: React.createElement(React.Fragment, null, React.createElement(Field, {
        sz: sz,
        label: edu ? 'Username' : 'Email address',
        type: edu ? 'text' : 'email',
        inputMode: edu ? undefined : 'email',
        placeholder: edu ? 'Enter your username' : 'Enter your email',
        value: email,
        onChange: change,
        clearable: true,
        onEnter: () => {
          if (email.trim() && !loading) submit(onSent);
        },
        invalid: !!err,
        error: err === 'missing' ? RESET_NOT_FOUND : err === 'format' ? RESET_BAD_FORMAT : null
      }), err === 'missing' ? React.createElement(Alert, {
        sz: sz,
        info: true,
        text: RESET_NOT_FOUND_HELP
      }) : React.createElement(Terms, {
        sz: sz,
        lead: "By requesting a link"
      }), React.createElement(Btn, {
        sz: sz,
        disabled: !email.trim(),
        loading: loading,
        loadingLabel: "Sending\u2026",
        onClick: () => submit(onSent)
      }, "Send reset link"))
    };
  }
  function forgotSentCfg(sz, fp, onBack, onDone, edu) {
    const small = {
      fontSize: 13,
      color: 'var(--sd-colour-text-secondary)',
      textAlign: 'center'
    };
    const link = {
      all: 'unset',
      cursor: 'pointer',
      fontWeight: 500,
      color: 'var(--sd-colour-action-primary)'
    };
    const who = fp.email.trim();
    return {
      title: 'Check your inbox',
      subtitle: edu ? 'We’ve sent a reset link if we found your account' : 'We’ve sent a reset link to your email',
      nav: 'back',
      onNav: onBack,
      center: true,
      children: React.createElement(React.Fragment, null, React.createElement(StatePanel, {
        sz: sz,
        node: React.createElement(SentGlyph, {
          size: sz.split ? 46 : 40
        }),
        title: edu ? 'Reset link on its way' : 'Reset link sent',
        body: edu ? React.createElement(React.Fragment, null, "If ", React.createElement("strong", {
          style: {
            color: 'var(--sd-colour-text-primary)',
            fontWeight: 600
          }
        }, who || 'that username'), " has an account, a reset link is on its way to the email we have on file. Please check your inbox and follow the instructions.") : who ? React.createElement(React.Fragment, null, "A password reset link has been sent to ", React.createElement("strong", {
          style: {
            color: 'var(--sd-colour-text-primary)',
            fontWeight: 600
          }
        }, who), ". Please check your inbox and follow the instructions.") : 'A password reset link has been sent to your email address. Please check your inbox and follow the instructions.'
      }), React.createElement(Btn, {
        sz: sz,
        onClick: onDone
      }, "Back to sign in"), React.createElement("p", {
        style: {
          margin: 0,
          ...small
        },
        "aria-live": "polite"
      }, fp.resent ? 'Sent again. It can take a few minutes to arrive.' : React.createElement(React.Fragment, null, "Didn\u2019t receive the email? ", React.createElement("button", {
        type: "button",
        onClick: fp.resend,
        style: link
      }, "Resend email"))))
    };
  }
  const HANG = {
    position: 'absolute',
    left: -48,
    right: -48,
    top: '100%',
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: 13,
    whiteSpace: 'nowrap'
  };
  function PinEntry({
    sz,
    educator,
    onOk,
    onTry
  }) {
    const [pin, setPin] = useState('');
    const [shake, setShake] = useState(false);
    const [missed, setMissed] = useState(false);
    useEffect(() => {
      if (pin.length < 4) return undefined;
      const t = setTimeout(() => {
        const r = pinCheck(educator, pin);
        if (r === 'ok') {
          onOk();
          return;
        }
        setMissed(true);
        setShake(true);
        setTimeout(() => setShake(false), 450);
        setPin('');
        if (onTry) onTry(r);
      }, 220);
      return () => clearTimeout(t);
    }, [pin]);
    const left = pinLeft(educator);
    const used = PIN_MAX_TRIES - left;
    return React.createElement(React.Fragment, null, React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }
    }, React.createElement(PinDots, {
      sz: sz,
      filled: pin.length,
      shake: shake
    }), used > 0 && React.createElement("p", {
      role: "status",
      style: {
        ...HANG,
        color: missed ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-text-secondary)'
      }
    }, missed ? 'Incorrect PIN — ' : '', left, " ", left === 1 ? 'try' : 'tries', " left")), React.createElement(Keypad, {
      sz: sz,
      onPress: d => setPin(p => p.length < 4 ? p + d : p),
      onDelete: () => setPin(p => p.slice(0, -1))
    }));
  }
  const SSO_NAME = React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, "single sign-on");
  function headFor(mode, method, ed) {
    const first = ed.name.split(' ')[0];
    const again = mode === 'expired' ? 'to sign in again' : 'to continue';
    if (method === 'locked' || method === 'none') {
      const why = method === 'none' ? 'No way to sign in yet' : null;
      return mode === 'signin' ? {
        title: null,
        subtitle: null
      } : {
        title: mode === 'lock' ? 'Screen locked' : 'Your session has expired',
        subtitle: why
      };
    }
    const sub = {
      pin: mode === 'signin' ? 'Enter your PIN to continue' : `Enter ${first}’s PIN ${again}`,
      password: mode === 'signin' ? 'Enter your password' : `Enter ${first}’s password ${again}`,
      sso: mode === 'signin' ? React.createElement(React.Fragment, null, "Sign in with ", SSO_NAME) : React.createElement(React.Fragment, null, "Sign ", first, " in with ", SSO_NAME),
      choose: 'Choose how to sign in'
    }[method];
    if (mode === 'lock') return {
      title: 'Screen locked',
      subtitle: sub
    };
    if (mode === 'expired') return {
      title: 'Your session has expired',
      subtitle: sub
    };
    return {
      title: React.createElement(React.Fragment, null, "Welcome Back", React.createElement("br", null), ed.name),
      subtitle: sub
    };
  }
  const WAY_NAME = {
    password: 'password',
    sso: 'single sign-on'
  };
  const WAY_ROW = {
    pin: ['PIN', 'Four digits'],
    password: ['Password', 'Your account password'],
    sso: ['Single sign-on', 'Through your organisation']
  };
  function useDeviceHeight(ref) {
    const [h, setH] = useState(0);
    useLayoutEffect(() => {
      const host = ref.current && ref.current.closest && ref.current.closest('.device-screen');
      if (!host) return undefined;
      const read = () => setH(host.offsetHeight);
      read();
      window.addEventListener('resize', read);
      return () => window.removeEventListener('resize', read);
    }, []);
    return h;
  }
  function AccessGate({
    sz,
    educator: ed,
    conn,
    mode = 'signin',
    panelH,
    startMethod,
    nav,
    onNav,
    onAuthed,
    onForgotPassword,
    links
  }) {
    const first = ed.name.split(' ')[0];
    const offline = conn === 'offline';
    const methods = methodsOf(ed);
    const firstMethod = methods.indexOf('pin') >= 0 ? 'pin' : methods.length === 1 ? methods[0] : methods.length ? 'choose' : 'none';
    const initial = startMethod && methods.indexOf(startMethod) >= 0 ? startMethod : firstMethod;
    const [method, setMethod] = useState(initial);
    const [trail, setTrail] = useState([]);
    const [forgot, setForgot] = useState(false);
    const [from, setFrom] = useState(null);
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [sso, setSso] = useState(initial === 'sso' && !offline ? 'wait' : 'idle');
    const [, bump] = useState(0);
    const rootRef = useRef(null);
    const deviceH = useDeviceHeight(rootRef);
    const compact = sz.key < 80 && deviceH > 0 && deviceH < 700;
    const locked = method === 'pin' && pinLocked(ed);
    const pinUsable = methods.indexOf('pin') >= 0 && !pinLocked(ed);
    const ways = not => methods.filter(m => m !== not && (m !== 'pin' || pinUsable));
    const link = cur => {
      const w = ways(cur);
      if (!w.length) return null;
      if (w.length > 1) return {
        to: 'choose',
        label: cur === 'pin' ? 'Forgot PIN? Other ways to sign in' : 'Other ways to sign in'
      };
      const m = w[0];
      return {
        to: m,
        label: cur === 'pin' ? `Forgot PIN? Use ${WAY_NAME[m]}` : m === 'pin' ? 'Use PIN instead' : `Use ${WAY_NAME[m]} instead`
      };
    };
    const go = (to, cur) => {
      setTrail(t => t.concat(method));
      if (to === 'choose') setFrom(cur);
      if (cur === 'pin') setForgot(true);
      setSso(to === 'sso' && !offline ? 'wait' : 'idle');
      setMethod(to);
    };
    const back = () => {
      if (!trail.length) {
        if (onNav) onNav();
        return;
      }
      const m = trail[trail.length - 1];
      setTrail(trail.slice(0, -1));
      if (m === 'pin') setForgot(false);
      setSso('idle');
      setMethod(m);
    };
    const done = r => {
      if (r.method !== 'pin') pinUnlock(ed);
      onAuthed(r);
    };
    useEffect(() => {
      if (sso !== 'wait') return undefined;
      const t = setTimeout(() => done({
        method: 'sso',
        forgot
      }), 1700);
      return () => clearTimeout(t);
    }, [sso]);
    const stack = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 12
    };
    const row = {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 16
    };
    const extra = links ? React.createElement("div", {
      style: row
    }, links) : null;
    const col = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: extra && sz.key < 80 ? 28 : 40
    };
    let body = null;
    let foot = null;
    if (locked) {
      const l = link('pin');
      body = React.createElement(StatePanel, {
        sz: sz,
        tone: "error",
        node: React.createElement(LockGlyph, {
          size: sz.split ? 34 : 28
        }),
        title: "PIN locked",
        body: l ? `Too many wrong PINs for ${first}. Sign in another way to unlock it.` : `Too many wrong PINs for ${first}. Ask your service administrator to unlock it.`
      });
      foot = l || extra ? React.createElement("div", {
        style: stack
      }, l && React.createElement(Btn, {
        sz: sz,
        onClick: () => go(l.to, 'pin')
      }, l.to === 'choose' ? 'Other ways to sign in' : `Use ${WAY_NAME[l.to]}`), extra) : null;
    } else if (method === 'pin') {
      const l = link('pin');
      body = React.createElement("div", {
        "data-pg-pin": "verify",
        "data-pg-edu": ed.name,
        style: col
      }, React.createElement(PinEntry, {
        sz: sz,
        educator: ed,
        onOk: () => done({
          method: 'pin',
          forgot: false
        }),
        onTry: () => bump(n => n + 1)
      }), extra ? React.createElement("div", {
        style: row
      }, l && React.createElement(QuietLink, {
        sz: sz,
        onClick: () => go(l.to, 'pin')
      }, "Forgot PIN?"), links) : l && React.createElement(TextLink, {
        sz: sz,
        onClick: () => go(l.to, 'pin')
      }, l.label));
    } else if (method === 'password') {
      const l = link('password');
      body = React.createElement(React.Fragment, null, offline && React.createElement(OfflineNote, null, "Signing in with a password needs a connection", pinUsable ? ', but your PIN still works.' : '.'), React.createElement(Field, {
        sz: sz,
        label: "Password",
        type: showPw ? 'text' : 'password',
        placeholder: "Your password",
        value: pw,
        onChange: setPw,
        onEnter: () => {
          if (pw && !offline) done({
            method: 'password',
            forgot
          });
        },
        trail: showPw ? 'view-hide' : 'view',
        onTrail: () => setShowPw(s => !s)
      }));
      foot = React.createElement("div", {
        style: stack
      }, React.createElement(Btn, {
        sz: sz,
        disabled: !pw || offline,
        onClick: () => done({
          method: 'password',
          forgot
        })
      }, "Sign in"), l && React.createElement(TextLink, {
        sz: sz,
        onClick: () => go(l.to, 'password')
      }, l.label), onForgotPassword && React.createElement(TextLink, {
        sz: sz,
        onClick: onForgotPassword
      }, "Forgot password?"), extra);
    } else if (method === 'sso') {
      const l = link('sso');
      if (sso === 'wait') {
        body = React.createElement(StatePanel, {
          sz: sz,
          node: React.createElement(Spinner, {
            size: 30,
            color: "var(--sd-colour-action-primary)"
          }),
          title: "Waiting for your organisation",
          body: "Finish signing in on your organisation\u2019s page. You\u2019ll come straight back here.",
          secondary: "Cancel",
          onSecondary: () => setSso('cancelled')
        });
      } else {
        body = React.createElement(React.Fragment, null, offline && React.createElement(OfflineNote, null, "Single sign-on needs a connection", pinUsable ? ', but your PIN still works.' : '.'), sso === 'cancelled' && React.createElement(Notice, {
          title: "Sign-in was cancelled"
        }, l ? 'Try again, or sign in another way.' : 'Try again.'), React.createElement(StatePanel, {
          sz: sz,
          iconName: "login",
          title: "Single sign-on",
          body: "Sign in through your organisation. You\u2019ll leave Playground for a moment and come straight back."
        }));
        foot = React.createElement("div", {
          style: stack
        }, React.createElement(Btn, {
          sz: sz,
          disabled: offline,
          onClick: () => setSso('wait')
        }, sso === 'cancelled' ? 'Try again' : 'Continue to sign in'), l && React.createElement(TextLink, {
          sz: sz,
          onClick: () => go(l.to, 'sso')
        }, l.label), extra);
      }
    } else if (method === 'choose') {
      const rows = ways(from);
      body = React.createElement(React.Fragment, null, offline && React.createElement(OfflineNote, null, !pinUsable ? 'Signing in needs a connection.' : rows.indexOf('pin') >= 0 ? 'Only your PIN works until the connection is back.' : 'These need a connection, but your PIN still works: go back to it.'), React.createElement("div", {
        className: "v-stagger",
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: sz.gap
        }
      }, rows.map(m => {
        const off = offline && m !== 'pin';
        return React.createElement(ClickableCard, {
          key: m,
          sz: sz,
          disabled: off,
          soft: true,
          onClick: () => go(m, 'choose'),
          trailing: off ? null : React.createElement(Chevron, {
            sz: sz
          })
        }, React.createElement(RowTitle, {
          sz: sz,
          title: WAY_ROW[m][0],
          sub: off ? 'Needs a connection' : WAY_ROW[m][1],
          dim: off
        }));
      })), extra);
    } else {
      body = React.createElement(React.Fragment, null, React.createElement(StatePanel, {
        sz: sz,
        tone: "error",
        glyph: "!",
        title: "No way to sign in yet",
        body: `${ed.name} doesn’t have a sign-in method set up. Ask your service administrator to set one up.`
      }), extra);
    }
    const head = headFor(mode, locked ? 'locked' : method, ed);
    return React.createElement("div", {
      ref: rootRef,
      style: {
        width: '100%',
        height: '100%'
      }
    }, React.createElement(V1Shell, {
      sz: sz,
      step: "auth",
      educator: ed,
      panelH: panelH,
      title: head.title,
      subtitle: head.subtitle,
      forceShort: compact,
      nav: trail.length ? 'back' : nav,
      onNav: back,
      center: true,
      footer: foot,
      wide: method === 'choose'
    }, body));
  }
  function PinSetup({
    sz,
    educator: ed,
    mode = 'new',
    panelH,
    onDone,
    onCancel
  }) {
    const first = ed.name.split(' ')[0];
    const reset = mode === 'reset';
    const [phase, setPhase] = useState(reset ? 'create' : 'offer');
    const [mine, setMine] = useState('');
    const [pin, setPin] = useState('');
    const [shake, setShake] = useState(false);
    const [miss, setMiss] = useState(false);
    const [asking, setAsking] = useState(false);
    const rootRef = useRef(null);
    const deviceH = useDeviceHeight(rootRef);
    const compact = sz.key < 80 && deviceH > 0 && deviceH < 700;
    useEffect(() => {
      if (pin.length < 4 || phase !== 'create' && phase !== 'repeat') return undefined;
      const t = setTimeout(() => {
        if (phase === 'create') {
          setMine(pin);
          setPin('');
          setMiss(false);
          setPhase('repeat');
          return;
        }
        if (pin === mine) {
          DEVICE.pins[ed.name] = pin;
          pinUnlock(ed);
          setPin('');
          setPhase('done');
          return;
        }
        setShake(true);
        setTimeout(() => setShake(false), 450);
        setPin('');
        setMine('');
        setMiss(true);
        setPhase('create');
      }, 200);
      return () => clearTimeout(t);
    }, [pin]);
    const typing = phase === 'create' || phase === 'repeat';
    const requestCancel = () => {
      if (typing) setAsking(true);else onCancel();
    };
    useEffect(() => {
      const esc = e => {
        if (e.key === 'Escape' && typing && !asking) requestCancel();
      };
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }, [typing, asking]);
    const col = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 40
    };
    let head;
    let body;
    let foot = null;
    if (phase === 'offer') {
      head = {
        title: `Hi ${first}`,
        subtitle: 'Create a PIN for faster sign-in'
      };
      body = React.createElement(StatePanel, {
        sz: sz,
        iconName: "lock",
        title: "Sign in with four digits",
        body: "Next time, use a PIN instead of your password. Keep it to yourself."
      });
      foot = React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }
      }, React.createElement(Btn, {
        sz: sz,
        onClick: () => setPhase('create')
      }, "Create PIN"), React.createElement(TextLink, {
        sz: sz,
        onClick: onCancel
      }, "Not now"));
    } else if (phase === 'done') {
      head = {
        title: 'You’re all set',
        subtitle: null
      };
      body = React.createElement(StatePanel, {
        sz: sz,
        node: React.createElement("span", {
          style: {
            color: 'var(--sd-colour-action-primary)',
            display: 'flex'
          }
        }, React.createElement(SdIcon, {
          name: "tick-fill",
          size: sz.split ? 44 : 38
        })),
        title: reset ? 'New PIN saved' : 'PIN created',
        body: "Use it to sign in next time. Keep it to yourself."
      });
      foot = React.createElement(Btn, {
        sz: sz,
        onClick: onDone
      }, "Continue");
    } else {
      head = {
        title: phase === 'repeat' ? 'Repeat your PIN' : reset ? 'Choose a new PIN' : 'Create your PIN',
        subtitle: phase === 'repeat' ? 'Enter the same 4 digits again' : 'Choose 4 digits you’ll remember'
      };
      body = React.createElement("div", {
        "data-pg-pin": "create",
        style: col
      }, React.createElement("div", {
        style: {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        }
      }, React.createElement(PinDots, {
        sz: sz,
        filled: pin.length,
        shake: shake
      }), miss && phase === 'create' && React.createElement("p", {
        role: "status",
        style: {
          ...HANG,
          color: 'var(--sd-colour-feedback-error-default)'
        }
      }, "Those didn\u2019t match. Start again.")), React.createElement(Keypad, {
        sz: sz,
        onPress: d => setPin(p => p.length < 4 ? p + d : p),
        onDelete: () => setPin(p => p.slice(0, -1))
      }));
    }
    return React.createElement("div", {
      ref: rootRef,
      style: {
        position: 'relative',
        width: '100%',
        height: '100%'
      }
    }, React.createElement(V1Shell, {
      sz: sz,
      step: "pinsetup",
      educator: ed,
      panelH: panelH,
      title: head.title,
      subtitle: head.subtitle,
      forceShort: compact,
      nav: typing ? 'cancel' : null,
      onNav: requestCancel,
      center: true,
      footer: foot
    }, body), asking && React.createElement(ConfirmCard, {
      title: reset ? 'Cancel new PIN?' : 'Cancel PIN set-up?',
      body: reset ? 'Your PIN won’t change.' : 'Your PIN won’t be saved. You’ll sign in with your password until you set one up.',
      keep: "Keep going",
      drop: reset ? 'Don’t change my PIN' : 'Skip PIN set-up',
      onKeep: () => setAsking(false),
      onDrop: onCancel
    }));
  }
  function useIdleOut(ref, ms, active, onIdle) {
    const cb = useRef(onIdle);
    cb.current = onIdle;
    useEffect(() => {
      if (!active || !ms) return undefined;
      const host = ref.current && ref.current.closest && ref.current.closest('.device-screen') || window;
      let timer;
      const reset = () => {
        clearTimeout(timer);
        timer = setTimeout(() => cb.current(), ms);
      };
      const evts = ['pointerdown', 'pointermove', 'keydown', 'scroll'];
      evts.forEach(e => host.addEventListener(e, reset, true));
      reset();
      return () => {
        clearTimeout(timer);
        evts.forEach(e => host.removeEventListener(e, reset, true));
      };
    }, [active, ms]);
  }
  function LockOverlay({
    educator,
    onUnlock,
    onSwitch,
    onLogout,
    big,
    layout,
    conn,
    mode = 'lock',
    idleMs
  }) {
    const sz = layout ? sizeFor(layout) : big ? SZ.land : SZ.phone;
    const ed = educator || EDUCATORS[0];
    const first = ed.name.split(' ')[0];
    const panelH = sz.split ? 834 : sz === SZ.phone ? 260 : 330;
    const [setup, setSetup] = useState(false);
    const rootRef = useRef(null);
    useIdleOut(rootRef, idleMs, setup, () => setSetup(false));
    const links = React.createElement(React.Fragment, null, React.createElement(QuietLink, {
      sz: sz,
      onClick: onSwitch
    }, "Not ", first, "?"), mode === 'lock' && React.createElement(QuietLink, {
      sz: sz,
      onClick: onLogout
    }, "Log out"));
    return React.createElement("div", {
      ref: rootRef,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40
      }
    }, setup ? React.createElement(PinSetup, {
      sz: sz,
      educator: ed,
      mode: "reset",
      panelH: panelH,
      onDone: onUnlock,
      onCancel: onUnlock
    }) : React.createElement(AccessGate, {
      sz: sz,
      educator: ed,
      conn: conn,
      mode: mode,
      panelH: panelH,
      links: links,
      onAuthed: r => r.forgot ? setSetup(true) : onUnlock()
    }));
  }
  function ServiceExpired({
    layout,
    conn,
    kept,
    onResume
  }) {
    const sz = sizeFor(layout);
    const panelH = sz.split ? 834 : sz === SZ.phone ? 260 : 330;
    const offline = conn === 'offline';
    const creds = useCreds({
      seedPassword: false,
      offline
    });
    const forgot = useForgot();
    const [view, setView] = useState('form');
    const toForm = () => {
      forgot.reset();
      setView('form');
    };
    const note = kept ? React.createElement(Notice, {
      title: "Your unsent work is kept"
    }, offline ? 'It stays on this tablet until you can sign in again.' : 'Sign in to the service again to carry on.') : null;
    const cfg = view === 'forgot' ? forgotCfg(sz, forgot, toForm, () => setView('sent')) : view === 'sent' ? forgotSentCfg(sz, forgot, () => setView('forgot'), toForm) : serviceCfg(sz, creds, onResume, () => setView('forgot'), {
      offline,
      subtitle: 'Your service session has expired',
      banner: note
    });
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40
      }
    }, React.createElement(V1Shell, _extends({
      sz: sz,
      step: view === 'form' ? 'svc-expired' : view === 'forgot' ? 'forgot' : 'forgot-sent',
      panelH: panelH
    }, cfg)));
  }
  function VSplash({
    onDone
  }) {
    const [leaving, setLeaving] = useState(false);
    useEffect(() => {
      const a = setTimeout(() => setLeaving(true), 700);
      const b = setTimeout(() => onDone && onDone(), 1150);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    }, []);
    return React.createElement("div", {
      className: "v-splash",
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: V1_PANEL,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        opacity: leaving ? 0 : 1
      }
    }, React.createElement(VScene, null), React.createElement("div", {
      className: "v-splash-logo",
      style: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18
      }
    }, React.createElement(PLogo, {
      size: 84
    }), React.createElement("span", {
      style: {
        color: ON_TEAL.title,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.01em'
      }
    }, "Playground"), React.createElement(BounceDots, null)));
  }
  function SignInFlow({
    layout,
    bare,
    start,
    rooms,
    conn,
    overlay,
    idleMs,
    onCancel,
    onSignOut,
    onCentre,
    onSignedIn
  }) {
    const sz = sizeFor(layout);
    const offline = conn === 'offline';
    const panelH = sz.split ? null : layout.device === 'phone' ? 260 : Math.round(1194 * BAND_FRACTION);
    const STEP_FOR = {
      service: 'service',
      educator: 'educators',
      return: 'sameday',
      errors: 'gallery'
    };
    const ALIAS = {
      pin: 'auth',
      edupass: 'auth'
    };
    const _raw = start.step || STEP_FOR[start.scenario] || 'service';
    const _s0 = ALIAS[_raw] || _raw;
    const _sc0 = start.scenario || (_s0 === 'sameday' ? 'return' : 'service');
    const _needEdu = ['auth', 'pinsetup', 'rooms', 'sameday', 'hub'].includes(_s0);
    const _needRoom = ['sameday', 'hub'].includes(_s0);
    const [scenario, setScenario] = useState(_sc0);
    const [step, setStep] = useState(_s0);
    const [educator, setEducator] = useState(_needEdu ? EDUCATORS[0] : null);
    const [gateStart, setGateStart] = useState(_raw === 'edupass' ? 'password' : null);
    const [pinMode, setPinMode] = useState('new');
    const [room, setRoom] = useState(_needRoom ? firstRoom(rooms).name : null);
    const [eduSort, setEduSort] = useState('recent');
    const [eduQuery, setEduQuery] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPin, setAddPin] = useState('');
    const [showAddPin, setShowAddPin] = useState(false);
    const [forgetMode, setForgetMode] = useState(false);
    const [forgetWho, setForgetWho] = useState(null);
    const [askOut, setAskOut] = useState(false);
    const [, listChanged] = useState(0);
    const [forgotFrom, setForgotFrom] = useState('auth');
    const [fromGallery, setFromGallery] = useState(isErrorView(_s0));
    const [nonce, setNonce] = useState(0);
    const [splash, setSplash] = useState(!bare && !overlay && _s0 === 'service');
    const [splashId, setSplashId] = useState(0);
    const rootRef = useRef(null);
    const creds = useCreds({
      offline
    });
    const forgot = useForgot();
    const eduForgot = useForgot('educator');
    const launch = () => {
      if (bare) return;
      setSplashId(n => n + 1);
      setSplash(true);
    };
    const goScenario = sc => {
      setScenario(sc);
      setEduSort('recent');
      setEduQuery('');
      setAddEmail('');
      setAddPin('');
      setForgetMode(false);
      if (sc === 'return') {
        setEducator(EDUCATORS[0]);
        setRoom(firstRoom(rooms).name);
        setStep('sameday');
      } else if (sc === 'educator') {
        setEducator(null);
        setRoom(null);
        setStep('educators');
      } else if (sc === 'errors') {
        setEducator(null);
        setRoom(null);
        setStep('gallery');
      } else {
        setEducator(null);
        setRoom(null);
        setStep('service');
      }
      setFromGallery(sc === 'errors');
      setNonce(n => n + 1);
      if (sc !== 'errors') launch();
    };
    const resetFlow = () => goScenario('service');
    const signOutService = () => {
      if (onSignOut) {
        onSignOut();
        return;
      }
      setAskOut(true);
    };
    const doSignOutService = () => {
      setAskOut(false);
      DEVICE.centre = false;
      DEVICE.seedPassword = false;
      if (onCentre) onCentre(false);
      creds.reset();
      forgot.reset();
      eduForgot.reset();
      resetFlow();
    };
    const pickRoom = name => {
      setRoom(name);
      setStep(scenario === 'return' ? 'sameday' : 'hub');
    };
    const pickEducator = e => {
      setEducator(e);
      setGateStart(null);
      setStep('auth');
    };
    const samedayContinue = () => {
      setGateStart(null);
      setStep('auth');
    };
    const switchEducator = () => {
      setScenario('educator');
      setEducator(null);
      setRoom(null);
      setStep('educators');
      setNonce(n => n + 1);
    };
    const proceed = () => {
      setRoom(rm => rm || firstRoom(rooms).name);
      setStep(scenario === 'return' ? 'hub' : 'rooms');
    };
    useIdleOut(rootRef, bare ? 0 : idleMs, step === 'pinsetup' || step === 'rooms', switchEducator);
    useIdleOut(rootRef, bare ? 0 : idleMs, forgetMode, () => setForgetMode(false));
    const afterAuth = r => {
      if (r.forgot) {
        setPinMode('reset');
        setStep('pinsetup');
        return;
      }
      if (r.method !== 'pin' && methodsOf(educator).indexOf('pin') < 0 && !DEVICE.noOffer[educator.name]) {
        setPinMode('new');
        setStep('pinsetup');
        return;
      }
      proceed();
    };
    const addEducatorDone = () => {
      const e = {
        initials: 'NE',
        color: C[0],
        name: 'New educator',
        methods: ['password'],
        login: 0
      };
      rememberEducator(e);
      setEducator(e);
      setAddEmail('');
      setAddPin('');
      setShowAddPin(false);
      if (methodsOf(e).indexOf('pin') >= 0 || DEVICE.noOffer[e.name]) {
        proceed();
        return;
      }
      setPinMode('new');
      setStep('pinsetup');
    };
    const askForget = e => setForgetWho(e);
    const doForget = () => {
      forgetEducator(forgetWho.name);
      setForgetWho(null);
      listChanged(n => n + 1);
      if (rememberedEducators().length === 0) setForgetMode(false);
    };
    const goForgot = from => {
      setForgotFrom(from);
      if (from === 'auth') setGateStart('password');
      eduForgot.reset();
      setStep('eforgot');
    };
    const backFromForgot = () => {
      eduForgot.reset();
      setStep(forgotFrom);
    };
    const errBack = () => {
      if (fromGallery) setStep('gallery');else setStep('service');
    };
    useEffect(() => {
      if (step !== 'hub') return;
      const r = roomByName(room, rooms);
      onSignedIn({
        educator: educator || EDUCATORS[0],
        roomKey: r.key || 'koala',
        roomName: r.name || room,
        scenario
      });
    }, [step]);
    const ctx = {
      sz,
      educator,
      room,
      rooms,
      addEmail,
      addPin,
      showAddPin,
      scenario,
      offline,
      overlay,
      forgetMode,
      errBack,
      eduSort,
      eduQuery,
      setEduSort,
      setEduQuery,
      pickRoom,
      pickEducator,
      samedayContinue,
      switchEducator,
      signOutService,
      onCancel,
      setStep,
      setAddEmail,
      setAddPin,
      setShowAddPin,
      setForgetMode,
      askForget,
      addEducatorDone,
      goForgot
    };
    let screen;
    if (step === 'hub') {
      screen = null;
    } else if (step === 'gallery') {
      screen = React.createElement(ErrorGallery, {
        sz: sz,
        onPick: s => {
          setFromGallery(true);
          setStep(s);
        }
      });
    } else if (step === 'e-lock') {
      screen = React.createElement(LockOverlay, {
        educator: educator,
        layout: layout,
        conn: conn,
        onUnlock: () => setStep('gallery'),
        onSwitch: switchEducator,
        onLogout: resetFlow
      });
    } else if (step === 'auth') {
      const ed = educator || EDUCATORS[0];
      screen = React.createElement(AccessGate, {
        key: ed.name,
        sz: sz,
        educator: ed,
        conn: conn,
        panelH: panelH,
        startMethod: gateStart,
        nav: "back",
        onNav: () => setStep(scenario === 'return' ? 'sameday' : 'educators'),
        onAuthed: afterAuth,
        onForgotPassword: () => goForgot('auth')
      });
    } else if (step === 'pinsetup') {
      const setupFor = educator || EDUCATORS[0];
      screen = React.createElement(PinSetup, {
        sz: sz,
        educator: setupFor,
        mode: pinMode,
        panelH: panelH,
        onDone: proceed,
        onCancel: () => {
          if (pinMode === 'new') DEVICE.noOffer[setupFor.name] = true;
          proceed();
        }
      });
    } else {
      const toService = () => {
        forgot.reset();
        setStep('service');
      };
      const blocked = kind => {
        setFromGallery(false);
        setStep(kind === 'noaccess' ? 'e-noaccess' : 'e-disabled');
      };
      const cfg = step === 'service' ? serviceCfg(sz, creds, () => {
        if (onCentre) onCentre(true);
        setStep('educators');
      }, () => setStep('forgot'), {
        offline,
        onBlocked: blocked
      }) : step === 'forgot' ? forgotCfg(sz, forgot, toService, () => setStep('forgot-sent')) : step === 'forgot-sent' ? forgotSentCfg(sz, forgot, () => setStep('forgot'), toService) : step === 'eforgot' ? forgotCfg(sz, eduForgot, backFromForgot, () => setStep('eforgot-sent'), true) : step === 'eforgot-sent' ? forgotSentCfg(sz, eduForgot, () => setStep('eforgot'), backFromForgot, true) : buildStepCfg(step, ctx);
      screen = React.createElement(V1Shell, _extends({
        sz: sz,
        step: step,
        educator: educator,
        panelH: panelH
      }, cfg));
    }
    const key = `v1-${layout.device}-${layout.orient}-${step}-${nonce}`;
    return React.createElement(React.Fragment, null, React.createElement("div", {
      key: key,
      ref: rootRef,
      className: "v-rise screen-fill"
    }, screen), forgetWho && React.createElement(ConfirmCard, {
      title: `Forget ${forgetWho.name}?`,
      body: "They\u2019re taken off this tablet\u2019s list. Nothing is deleted: their records and account are untouched, and they can sign in again with their own details.",
      keep: `Keep ${forgetWho.name.split(' ')[0]}`,
      drop: `Forget ${forgetWho.name.split(' ')[0]}`,
      onKeep: () => setForgetWho(null),
      onDrop: doForget
    }), askOut && React.createElement(ConfirmCard, {
      title: `Log out of ${SERVICE.name}?`,
      body: "Everyone using this tablet will need the service password to sign in again.",
      keep: "Stay signed in",
      drop: "Log out",
      onKeep: () => setAskOut(false),
      onDrop: doSignOutService
    }), splash && React.createElement(VSplash, {
      key: `splash-${splashId}`,
      onDone: () => setSplash(false)
    }));
  }
  function PinSetupOver({
    educator,
    mode = 'new',
    big,
    onDone,
    onCancel
  }) {
    const sz = big ? SZ.land : SZ.phone;
    const panelH = sz.split ? 834 : 260;
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'var(--sd-colour-surface-default)'
      }
    }, React.createElement(PinSetup, {
      sz: sz,
      educator: educator,
      mode: mode,
      panelH: panelH,
      onDone: onDone,
      onCancel: onCancel
    }));
  }
  window.PgSignin = {
    PinSetupOver,
    SignInFlow,
    EDUCATORS,
    EDU_PHOTO,
    firstRoom,
    roomByName,
    LockOverlay,
    ServiceExpired,
    PinSetup,
    ConfirmCard,
    ErrorGallery,
    ERROR_STATES,
    ERROR_STEPS,
    VSplash,
    EDU_METHODS,
    SERVICE_OUTCOME,
    DEVICE,
    PIN_MAX_TRIES,
    resetDevice,
    methodsOf,
    pinOf,
    pinCheck,
    pinLeft,
    pinLocked,
    pinUnlock,
    DEMO_USER,
    DEMO_PASS,
    DEMO_PIN,
    DEMO_EMAIL,
    LOGIN_ERR
  };
})();