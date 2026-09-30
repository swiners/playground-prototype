const {
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} = React;
const PG_VERSION = '0.11.8';
const TEAL = 'var(--sd-colour-action-primary)';
const LINK = 'var(--sd-colour-text-link)';
const HERO_GRAD = 'radial-gradient(120% 70% at 50% 0%, var(--sd-colour-cyan-700), var(--sd-colour-cyan-900))';
const IMMERSIVE = 'linear-gradient(165deg, var(--sd-colour-cyan-700), var(--sd-colour-cyan-900))';
const D_FILL = 'rgba(255,255,255,0.10)';
const D_BORDER = 'rgba(255,255,255,0.30)';
const D_SUBTLE = 'rgba(255,255,255,0.75)';
const SERVICE = {
  name: 'Little Bugs Early Learning'
};
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