function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
(function () {
  const ICON2 = n => `./assets/icons/${n}.svg`;
  const DEMO_USER = 'LittleBugs';
  const DEMO_PASS = 'bugs123';
  const DEMO_PIN = '1234';
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
  const ROOM_PHOTO = name => {
    const slug = (name || 'room').replace(/\s*room$/i, '').trim().toLowerCase().split(/\s+/).join('-');
    return `img/room-${slug}.jpg`;
  };
  function agoLabel(m) {
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.round(m / 60)}h ago`;
    return `${Math.round(m / 1440)}d ago`;
  }
  function sortedEducators(sort, query) {
    const list = EDUCATORS.slice().sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => a.login - b.login);
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
    if (step === 'service' || step === 'e-creds' || step === 'e-offline' || step === 'e-bootstrap') return React.createElement(PLogo, {
      size: size
    });
    if (step === 'pin' || step === 'edupass' || step === 'rooms' || step === 'sameday' || step === 'e-locked' || step === 'e-password' || step === 'e-lock') {
      return React.createElement(EduPhotoMark, {
        e: educator || EDUCATORS[0],
        size: size
      });
    }
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
    placeholder,
    value,
    onChange,
    lead,
    trail,
    onTrail,
    invalid,
    error
  }) {
    const border = invalid ? 'var(--sd-colour-feedback-error-default)' : 'var(--sd-colour-border-default)';
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
    }, lead && React.createElement("img", {
      src: ICON2(lead),
      alt: "",
      style: {
        width: 18,
        height: 18,
        opacity: 0.5,
        flexShrink: 0
      }
    }), React.createElement("input", {
      type: type,
      placeholder: placeholder,
      value: value,
      onChange: e => onChange(e.target.value),
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
    }, React.createElement("img", {
      src: ICON2(trail),
      alt: "",
      style: {
        width: 18,
        height: 18,
        opacity: 0.5
      }
    }))), error && React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--sd-colour-feedback-error-default)',
        lineHeight: 1.45
      }
    }, error));
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
        fontFamily: 'var(--sd-font-family)',
        fontSize: sz.body,
        fontWeight: 500,
        color: 'var(--sd-colour-action-primary)'
      }
    }, children));
  }
  function Terms({
    sz
  }) {
    const a = {
      color: LINK,
      textDecoration: 'underline'
    };
    return React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        lineHeight: 1.5,
        color: 'var(--sd-colour-text-secondary)',
        textAlign: 'left'
      }
    }, "By clicking sign in, you agree to our ", React.createElement("span", {
      style: a
    }, "Terms of Service"), " and ", React.createElement("span", {
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
    return React.createElement("svg", {
      viewBox: "0 0 16 16",
      width: "16",
      height: "16",
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block',
        flexShrink: 0
      }
    }, React.createElement("circle", {
      cx: "7",
      cy: "7",
      r: "4.6",
      stroke: color,
      strokeWidth: "1.5"
    }), React.createElement("path", {
      d: "M10.4 10.4 L14 14",
      stroke: color,
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }));
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
        opacity: disabled ? 0.55 : 1,
        overflow: 'hidden'
      }
    }, children, trailing);
  }
  function Chevron({
    sz
  }) {
    return React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: sz.chev,
      height: sz.chev,
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block',
        flexShrink: 0
      }
    }, React.createElement("path", {
      d: "M9 5l7 7-7 7",
      stroke: "var(--sd-colour-action-primary)",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  function Plus({
    sz
  }) {
    return React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: sz.chev,
      height: sz.chev,
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block',
        flexShrink: 0
      }
    }, React.createElement("path", {
      d: "M12 5v14M5 12h14",
      stroke: "var(--sd-colour-action-primary)",
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }));
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
    onClick
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
    return React.createElement(ClickableCard, {
      sz: sz,
      onClick: onClick,
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
      src: EDU_PHOTO(e),
      fallback: initials
    }), React.createElement(RowTitle, {
      sz: sz,
      title: e.name,
      sub: `Signed in ${agoLabel(e.login)}`
    })));
  }
  function AddRow({
    sz,
    onClick
  }) {
    return React.createElement(ClickableCard, {
      sz: sz,
      onClick: onClick,
      trailing: React.createElement(Plus, {
        sz: sz
      })
    }, React.createElement(RowTitle, {
      sz: sz,
      title: "Add New Educator"
    }));
  }
  function RoomRow({
    sz,
    name,
    ratio,
    attention,
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
    const sub = React.createElement(React.Fragment, null, ratio ? `Ratio ${ratio}` : null, note && React.createElement("span", null, ratio ? ' · ' : '', note));
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
    }), attention && !disabled && React.createElement("span", {
      className: "ds-pill ds-pill--sm ds-pill--orange ds-pill--minimal"
    }, "Needs attention"))));
  }
  function RoomSummary({
    sz,
    name,
    ratio
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
      sub: ratio ? `Ratio ${ratio}` : null
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
    return React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, React.createElement("path", {
      d: "M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12",
      stroke: "var(--sd-colour-text-primary)",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), React.createElement("path", {
      d: "M10.5 11v6M13.5 11v6",
      stroke: "var(--sd-colour-text-primary)",
      strokeWidth: "1.6",
      strokeLinecap: "round"
    }));
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
    onAction
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
    }, React.createElement("span", null, text), action && React.createElement("button", {
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
  function LockGlyph({
    size = 30
  }) {
    return React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      "aria-hidden": "true",
      style: {
        display: 'block'
      }
    }, React.createElement("rect", {
      x: "4.5",
      y: "10.5",
      width: "15",
      height: "10.5",
      rx: "2.5",
      stroke: "currentColor",
      strokeWidth: "1.8"
    }), React.createElement("path", {
      d: "M8 10.5V8a4 4 0 0 1 8 0v2.5",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round"
    }), React.createElement("circle", {
      cx: "12",
      cy: "15.8",
      r: "1.5",
      fill: "currentColor"
    }));
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
    }, node || (iconName ? React.createElement("img", {
      src: ICON2(iconName),
      alt: "",
      style: {
        width: d * 0.4,
        height: d * 0.4,
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
    onNav
  }) {
    if (!kind) return null;
    const label = kind === 'logout' ? 'Sign Out' : 'Back';
    return React.createElement("button", {
      type: "button",
      onClick: onNav,
      style: {
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'absolute',
        top: sz.navInset,
        left: sz.navInset,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        height: 48,
        padding: '0 16px',
        background: ON_TEAL.navBg,
        color: ON_TEAL.navFg,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: ON_TEAL.navFg,
        borderRadius: 'var(--sd-radius-lg)',
        fontFamily: 'var(--sd-font-family)',
        fontSize: 16,
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
    wide
  }) {
    const split = sz.split;
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
          height: panelH
        }),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: split ? '32px' : '24px 32px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }
    }, React.createElement(VScene, null), React.createElement(NavPill, {
      sz: sz,
      kind: nav,
      onNav: onNav
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
    }, React.createElement(PanelMark, {
      step: step,
      educator: educator,
      size: sz.mark
    }), title && React.createElement("h1", {
      style: {
        margin: 0,
        maxWidth: sz.titleW,
        fontSize: sz.h1,
        lineHeight: `${sz.h1lh}px`,
        fontWeight: 700,
        color: ON_TEAL.title,
        letterSpacing: '-0.01em'
      }
    }, title), subtitle && React.createElement("p", {
      style: {
        margin: 0,
        maxWidth: sz.subW,
        fontSize: sz.h2,
        lineHeight: `${sz.h2lh}px`,
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
        justifyContent: center ? 'center' : 'flex-start',
        padding: `${sz.pad}px ${sz.listPad}px`,
        boxSizing: 'border-box'
      }
    }, React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: measure,
        display: 'flex',
        flexDirection: 'column',
        gap: sz.gap
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
      pin,
      shake,
      attempts,
      room,
      rooms,
      addEmail,
      addPin,
      showAddPin,
      scenario,
      eduSort,
      eduQuery,
      setEduSort,
      setEduQuery,
      pickRoom,
      samedayContinue,
      switchEducator,
      setStep,
      setEducator,
      setPin,
      setAttempts,
      setRoom,
      setAddEmail,
      setAddPin,
      setShowAddPin,
      resetFlow
    } = ctx;
    if (step === 'educators') {
      const list = sortedEducators(eduSort, eduQuery);
      return {
        title: `Welcome to ${SERVICE.name}`,
        subtitle: 'Select your educator profile',
        nav: 'logout',
        onNav: resetFlow,
        wide: true,
        children: React.createElement(React.Fragment, null, React.createElement("div", {
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
        }, React.createElement(AddRow, {
          sz: sz,
          onClick: () => {
            setAddEmail('');
            setAddPin('');
            setStep('addEducator');
          }
        }), list.map(e => React.createElement(EduRow, {
          key: e.name,
          sz: sz,
          e: e,
          onClick: () => {
            setEducator(e);
            setPin('');
            setAttempts(0);
            setStep('pin');
          }
        }))), list.length === 0 && React.createElement("p", {
          style: {
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--sd-colour-text-secondary)',
            margin: '8px 0'
          }
        }, "No educators match \u201C", eduQuery, "\u201D."))
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
          onChange: setAddEmail
        }), React.createElement(Field, {
          sz: sz,
          label: "Password or access PIN",
          type: showAddPin ? 'text' : 'password',
          placeholder: "Password or Pin",
          value: addPin,
          onChange: setAddPin,
          trail: showAddPin ? 'view-hide' : 'view',
          onTrail: () => setShowAddPin(s => !s)
        }), React.createElement(Terms, {
          sz: sz
        }), React.createElement(Btn, {
          sz: sz,
          disabled: !ready,
          onClick: () => {
            setEducator({
              initials: 'NE',
              color: 'var(--sd-colour-cyan-600)',
              name: 'New educator'
            });
            setAddEmail('');
            setAddPin('');
            setStep('rooms');
          }
        }, "Sign in")),
        footer: React.createElement(TextLink, {
          sz: sz,
          onClick: () => setStep('educators')
        }, "Forgot Password?")
      };
    }
    if (step === 'pin') {
      const ed = educator || EDUCATORS[0];
      const first = ed.name.split(' ')[0];
      const MAX = 5;
      if (attempts >= MAX) {
        return {
          title: null,
          subtitle: null,
          nav: 'back',
          center: true,
          onNav: () => {
            setAttempts(0);
            setPin('');
            setStep(scenario === 'return' ? 'sameday' : 'educators');
          },
          children: React.createElement(StatePanel, {
            sz: sz,
            tone: "error",
            node: React.createElement(LockGlyph, {
              size: sz.split ? 34 : 28
            }),
            title: "PIN locked",
            body: `Too many incorrect attempts for ${first}. Try again in 5 minutes, or switch educator.`,
            secondary: "Switch Educator",
            onSecondary: switchEducator
          })
        };
      }
      const left = MAX - attempts;
      return {
        title: React.createElement(React.Fragment, null, "Welcome Back", React.createElement("br", null), ed.name),
        subtitle: 'Enter your PIN to continue',
        nav: 'back',
        center: true,
        onNav: () => {
          setPin('');
          setStep(scenario === 'return' ? 'sameday' : 'educators');
        },
        children: React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40
          }
        }, React.createElement(PinDots, {
          sz: sz,
          filled: pin.length,
          shake: shake
        }), attempts > 0 && React.createElement("p", {
          style: {
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--sd-colour-feedback-error-default)',
            margin: -24
          }
        }, "Incorrect PIN \u2014 ", left, " ", left === 1 ? 'try' : 'tries', " left"), React.createElement(Keypad, {
          sz: sz,
          onPress: d => setPin(p => p.length < 4 ? p + d : p),
          onDelete: () => setPin(p => p.slice(0, -1))
        }), React.createElement(TextLink, {
          sz: sz,
          onClick: () => {
            setPin('');
            setAttempts(0);
            setAddPin('');
            setStep('edupass');
          }
        }, "Forgot PIN? Use password"))
      };
    }
    if (step === 'edupass') {
      const ed = educator || EDUCATORS[0];
      return {
        title: React.createElement(React.Fragment, null, "Welcome Back", React.createElement("br", null), ed.name),
        subtitle: 'Enter your password',
        nav: 'back',
        onNav: () => setStep('pin'),
        center: true,
        children: React.createElement(Field, {
          sz: sz,
          label: "Password",
          type: showAddPin ? 'text' : 'password',
          placeholder: "Your password",
          value: addPin,
          onChange: setAddPin,
          trail: showAddPin ? 'view-hide' : 'view',
          onTrail: () => setShowAddPin(s => !s)
        }),
        footer: React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, React.createElement(Btn, {
          sz: sz,
          disabled: !addPin,
          onClick: () => {
            setAddPin('');
            setRoom(rm => rm || firstRoom(rooms).name);
            setStep(scenario === 'return' ? 'hub' : 'rooms');
          }
        }, "Sign in"), React.createElement(TextLink, {
          sz: sz,
          onClick: () => setStep('pin')
        }, "Use PIN instead"))
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
        nav: 'logout',
        onNav: resetFlow,
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
          ratio: rr.ratio
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
        }, "Switch Educator"))),
        footer: React.createElement(Btn, {
          sz: sz,
          onClick: samedayContinue
        }, "Continue to ", rn)
      };
    }
    if (isErrorView(step) && step !== 'gallery') {
      const toGallery = () => setStep('gallery');
      const back = {
        nav: 'back',
        onNav: toGallery
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
          onClick: toGallery
        }, "Sign in")),
        footer: React.createElement(TextLink, {
          sz: sz,
          onClick: toGallery
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
          onAction: toGallery
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
          onClick: toGallery
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
          onClick: toGallery
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
          onClick: toGallery
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
            body: `Too many incorrect attempts for ${first}. Try again in 5 minutes, or switch educator.`,
            secondary: "Switch Educator",
            onSecondary: toGallery
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
          onSecondary: toGallery
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
            onClick: toGallery
          }, "Use PIN instead"))
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
          onClick: toGallery
        }, "Retry")
      };
    }
    return {};
  }
  function useCreds() {
    const [username, setUsername] = useState(DEMO_USER);
    const [password, setPassword] = useState(DEMO_PASS);
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
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
    const submit = onOk => {
      if (username === DEMO_USER && password === DEMO_PASS) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          onOk();
        }, 1150);
      } else setErr(true);
    };
    return {
      userProps,
      pwProps,
      ready: !!(username && password),
      err,
      loading,
      submit
    };
  }
  function serviceCfg(sz, creds, onSignIn) {
    const {
      userProps,
      pwProps,
      ready,
      loading,
      submit
    } = creds;
    return {
      title: 'Sign in to Playground',
      subtitle: 'Please sign into your service',
      nav: null,
      center: true,
      children: React.createElement(React.Fragment, null, React.createElement(Field, _extends({
        sz: sz
      }, userProps)), React.createElement(Field, _extends({
        sz: sz
      }, pwProps)), React.createElement(Terms, {
        sz: sz
      }), React.createElement(Btn, {
        sz: sz,
        disabled: !ready,
        loading: loading,
        onClick: () => submit(onSignIn)
      }, "Sign in")),
      footer: React.createElement(TextLink, {
        sz: sz,
        onClick: () => {}
      }, "Forgot Password?")
    };
  }
  function LockOverlay({
    educator,
    onUnlock,
    onSwitch,
    onLogout,
    big,
    layout
  }) {
    const [pin, setPin] = useState('');
    const [shake, setShake] = useState(false);
    useEffect(() => {
      if (pin.length < 4) return;
      const t = setTimeout(() => {
        if (pin === DEMO_PIN) onUnlock();else {
          setShake(true);
          setTimeout(() => setShake(false), 450);
          setPin('');
        }
      }, 200);
      return () => clearTimeout(t);
    }, [pin]);
    const sz = layout ? sizeFor(layout) : big ? SZ.land : SZ.phone;
    const ed = educator || EDUCATORS[0];
    const first = ed.name.split(' ')[0];
    const panelH = sz.split ? 834 : sz === SZ.phone ? 260 : 330;
    const link = {
      all: 'unset',
      cursor: 'pointer',
      fontFamily: 'var(--sd-font-family)',
      fontSize: sz.body,
      fontWeight: 500,
      color: 'var(--sd-colour-action-primary)'
    };
    return React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 40
      }
    }, React.createElement(V1Shell, {
      sz: sz,
      step: "pin",
      educator: ed,
      panelH: panelH,
      center: true,
      title: "Screen locked",
      subtitle: `Enter ${first}’s PIN to continue`
    }, React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40
      }
    }, React.createElement(PinDots, {
      sz: sz,
      filled: pin.length,
      shake: shake
    }), React.createElement(Keypad, {
      sz: sz,
      onPress: d => setPin(p => p.length < 4 ? p + d : p),
      onDelete: () => setPin(p => p.slice(0, -1))
    }), React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22
      }
    }, React.createElement("button", {
      type: "button",
      onClick: onSwitch,
      style: link
    }, "Not ", first, "?"), React.createElement("button", {
      type: "button",
      onClick: onLogout,
      style: link
    }, "Log out")))));
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
    onSignedIn
  }) {
    const sz = sizeFor(layout);
    const panelH = sz.split ? null : layout.device === 'phone' ? 260 : Math.round(1194 * BAND_FRACTION);
    const STEP_FOR = {
      service: 'service',
      educator: 'educators',
      return: 'sameday',
      errors: 'gallery'
    };
    const _s0 = start.step || STEP_FOR[start.scenario] || 'service';
    const _sc0 = start.scenario || (_s0 === 'sameday' ? 'return' : 'service');
    const _needEdu = ['pin', 'rooms', 'sameday', 'hub'].includes(_s0);
    const _needRoom = ['sameday', 'hub'].includes(_s0);
    const [scenario, setScenario] = useState(_sc0);
    const [step, setStep] = useState(_s0);
    const [educator, setEducator] = useState(_needEdu ? EDUCATORS[0] : null);
    const [pin, setPin] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [shake, setShake] = useState(false);
    const [room, setRoom] = useState(_needRoom ? firstRoom(rooms).name : null);
    const [eduSort, setEduSort] = useState('recent');
    const [eduQuery, setEduQuery] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPin, setAddPin] = useState('');
    const [showAddPin, setShowAddPin] = useState(false);
    const [nonce, setNonce] = useState(0);
    const [splash, setSplash] = useState(!bare && _s0 === 'service');
    const [splashId, setSplashId] = useState(0);
    const creds = useCreds();
    const launch = () => {
      if (bare) return;
      setSplashId(n => n + 1);
      setSplash(true);
    };
    const goScenario = sc => {
      setScenario(sc);
      setPin('');
      setAttempts(0);
      setEduSort('recent');
      setEduQuery('');
      setAddEmail('');
      setAddPin('');
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
      setNonce(n => n + 1);
      if (sc !== 'errors') launch();
    };
    const resetFlow = () => goScenario('service');
    const pickRoom = name => {
      setRoom(name);
      setStep(scenario === 'return' ? 'sameday' : 'hub');
    };
    const samedayContinue = () => {
      setPin('');
      setAttempts(0);
      setStep('pin');
    };
    const switchEducator = () => {
      setScenario('educator');
      setEducator(null);
      setRoom(null);
      setPin('');
      setAttempts(0);
      setStep('educators');
      setNonce(n => n + 1);
    };
    useEffect(() => {
      if (pin.length < 4) return;
      const ok = pin === DEMO_PIN;
      const t = setTimeout(() => {
        if (ok) {
          setRoom(rm => rm || firstRoom(rooms).name);
          setStep(scenario === 'return' ? 'hub' : 'rooms');
          setPin('');
          setAttempts(0);
        } else {
          setAttempts(a => a + 1);
          setShake(true);
          setTimeout(() => setShake(false), 450);
          setPin('');
        }
      }, 220);
      return () => clearTimeout(t);
    }, [pin]);
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
      pin,
      shake,
      attempts,
      room,
      rooms,
      addEmail,
      addPin,
      showAddPin,
      scenario,
      eduSort,
      eduQuery,
      setEduSort,
      setEduQuery,
      pickRoom,
      samedayContinue,
      switchEducator,
      setStep,
      setEducator,
      setPin,
      setAttempts,
      setRoom,
      setAddEmail,
      setAddPin,
      setShowAddPin,
      resetFlow
    };
    let screen;
    if (step === 'hub') {
      screen = null;
    } else if (step === 'gallery') {
      screen = React.createElement(ErrorGallery, {
        sz: sz,
        onPick: setStep
      });
    } else if (step === 'e-lock') {
      screen = React.createElement(LockOverlay, {
        educator: educator,
        layout: layout,
        onUnlock: () => setStep('gallery'),
        onSwitch: switchEducator,
        onLogout: resetFlow
      });
    } else {
      const cfg = step === 'service' ? serviceCfg(sz, creds, () => setStep('educators')) : buildStepCfg(step, ctx);
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
      className: "v-rise screen-fill"
    }, screen), splash && React.createElement(VSplash, {
      key: `splash-${splashId}`,
      onDone: () => setSplash(false)
    }));
  }
  window.PgSignin = {
    SignInFlow,
    EDUCATORS,
    EDU_PHOTO,
    firstRoom,
    roomByName,
    LockOverlay,
    ErrorGallery,
    ERROR_STATES,
    ERROR_STEPS,
    VSplash,
    DEMO_USER,
    DEMO_PASS,
    DEMO_PIN,
    LOGIN_ERR
  };
})();