const {
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} = React;
const PG_VERSION = '0.16.4';
const PG_LEARNING = false;
const PG_CONN_SWITCH = false;
const TEAL = 'var(--sd-colour-action-primary)';
const LINK = 'var(--sd-colour-text-link)';
const HERO_GRAD = 'radial-gradient(120% 70% at 50% 0%, var(--sd-colour-cyan-700), var(--sd-colour-cyan-900))';
const IMMERSIVE = 'linear-gradient(165deg, var(--sd-colour-cyan-700), var(--sd-colour-cyan-900))';
const D_FILL = 'rgba(255,255,255,0.10)';
const D_BORDER = 'rgba(255,255,255,0.30)';
const D_SUBTLE = 'rgba(255,255,255,0.75)';
const SVC_URLS = {
  supportUrl: 'https://support.example.com/little-bugs',
  feedbackUrl: 'https://feedback.example.com/little-bugs',
  webUrl: 'https://web.example.com/little-bugs'
};
const SERVICE = {
  name: 'Little Bugs Early Learning',
  supportUrl: SVC_URLS.supportUrl,
  feedbackUrl: SVC_URLS.feedbackUrl,
  webUrl: SVC_URLS.webUrl,
  features: {
    headcount: true,
    incidents: true,
    learning: true,
    learningMoments: true,
    learningLibrary: true,
    account: true,
    pinLogin: true,
    singleSignOn: true,
    attendance: true,
    medication: true,
    nutrition: true,
    visitors: true,
    playgroundWeb: true,
    eventTimesEditable: true,
    nappyCream: true,
    bulkAttendance: true,
    absence: true,
    fuzzySignIn: true,
    signOutTo: true
  }
};
const svcOn = key => SERVICE.features[key] !== false;
const SVC_LINK_KEYS = ['supportUrl', 'feedbackUrl', 'webUrl'];
const svcOffList = () => [...Object.keys(SERVICE.features).filter(k => SERVICE.features[k] === false), ...SVC_LINK_KEYS.filter(k => SERVICE[k] === null)].join(',');
(function () {
  const off = new URLSearchParams(window.location.search).get('off');
  if (!off) return;
  off.split(',').forEach(k => {
    if (Object.prototype.hasOwnProperty.call(SERVICE.features, k)) SERVICE.features[k] = false;else if (SVC_LINK_KEYS.indexOf(k) >= 0) SERVICE[k] = null;
  });
})();
const screenBase = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  fontFamily: 'var(--sd-font-family)',
  color: 'var(--sd-colour-text-primary)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};
const SD_ICONS_ROOT = '../../assets/icons/';
const SD_LOCAL_ICONS = ['backspace', 'badge-med', 'badge-nappy', 'badge-sleep', 'badge-sun', 'bag', 'mobile', 'theme', 'wifi', 'wifi-off'];
function sdIconUrl(name) {
  const inlined = window.__PG_ICONS && window.__PG_ICONS[name];
  if (inlined) return inlined;
  if (name.indexOf('colour/') === 0) return SD_ICONS_ROOT + name + '.svg';
  return SD_LOCAL_ICONS.indexOf(name) >= 0 ? './assets/icons/' + name + '.svg' : SD_ICONS_ROOT + 'outline/' + name + '.svg';
}
function SdIcon({
  name,
  size = 20,
  style
}) {
  const url = sdIconUrl(name);
  if (name.indexOf('colour/') === 0) {
    return React.createElement("img", {
      src: url,
      alt: "",
      "aria-hidden": "true",
      width: size,
      height: size,
      style: {
        display: 'inline-block',
        flexShrink: 0,
        objectFit: 'contain',
        ...style
      }
    });
  }
  const mask = `url("${url}")`;
  return React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      flexShrink: 0,
      background: 'currentColor',
      WebkitMaskImage: mask,
      maskImage: mask,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      ...style
    }
  });
}
function Spinner({
  size = 18,
  color = 'currentColor'
}) {
  return React.createElement("svg", {
    className: "ds-btn__spinner",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true",
    style: {
      width: size,
      height: size,
      color
    }
  }, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeDasharray: "28 9"
  }));
}