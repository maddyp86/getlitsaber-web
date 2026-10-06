// 21+ age gate (compliance-critical, see CLAUDE.md). Hard wall, explicit
// confirmation, 30-day cookie, EXIT to a safe external site.
//
// The gate is server-rendered so it is in the very first paint, and its
// confirm button works from that first paint through a small inline script,
// without waiting for React to hydrate. Two inline scripts do the work:
//
//   AGE_GATE_HEAD_SCRIPT   in <head>: marks <html data-age-ok> before the body
//                          paints when the visitor is verified or the path is
//                          exempt. Fail-closed: if it cannot run, the gate shows.
//   ageGateBodyScript()    right after the gate markup: confirm, keyboard
//                          focus, and the pressed state.
//
// AgeGateController (client) then keeps the gate in sync on client-side
// navigation and sends the analytics event once.

export const AGE_GATE_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AGE_GATE_COOKIE_NAME ?? "litsaber_age_verified";
export const AGE_GATE_COOKIE_MAX_AGE_DAYS = Number(
  process.env.NEXT_PUBLIC_AGE_GATE_COOKIE_MAX_AGE_DAYS ?? "30"
);
export const AGE_GATE_EXIT_URL =
  process.env.NEXT_PUBLIC_AGE_GATE_EXIT_URL ?? "https://www.google.com";

/** Paths that never show the gate (QR-scanned owner pages). */
export const AGE_GATE_EXEMPT_PATHS = ["/activate", "/show-it-off"];

/** Attribute on <html> that hides the gate (verified visitor or exempt path). */
export const AGE_OK_ATTR = "data-age-ok";
/** Attribute on <html> present whenever the gate markup is on the page. */
export const AGE_GATE_ATTR = "data-age-gate";
/** Window event the inline confirm handler fires once confirmation lands. */
export const AGE_CONFIRMED_EVENT = "litsaber:age-confirmed";

export function hasAgeCookie(cookie: string): boolean {
  return new RegExp(`(?:^|; )${AGE_GATE_COOKIE_NAME}=true(?:;|$)`).test(cookie);
}

export function isAgeGateExempt(pathname: string): boolean {
  return AGE_GATE_EXEMPT_PATHS.includes(pathname);
}

const j = JSON.stringify;

export const AGE_GATE_HEAD_SCRIPT = `(function(){try{var d=document.documentElement;if(new RegExp("(?:^|; )"+${j(AGE_GATE_COOKIE_NAME)}+"=true(?:;|$)").test(document.cookie)||${j(AGE_GATE_EXEMPT_PATHS)}.indexOf(location.pathname)>-1)d.setAttribute(${j(AGE_OK_ATTR)},"")}catch(e){}})();`;

/**
 * Confirm runs once (window.__ageGate.confirmedAt guards duplicates), sets the
 * cookie, shows the pressed state at once, and hides the gate on the next
 * frame. Hiding after the click finishes dispatching also lets analytics see
 * the gate close as a response to the click.
 */
export function ageGateBodyScript(): string {
  const maxAge = AGE_GATE_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  return `(function(){
var d=document.documentElement,g=document.getElementById("age-gate");if(!g)return;
d.setAttribute(${j(AGE_GATE_ATTR)},"");
var b=g.querySelector("[data-age-confirm]"),x=g.querySelector("[data-age-exit]");
function isOpen(){return !d.hasAttribute(${j(AGE_OK_ATTR)})}
function press(){b.setAttribute("data-pressed","")}
b.addEventListener("pointerdown",press);
b.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" ")press()});
b.addEventListener("click",function(){
  var s=window.__ageGate||(window.__ageGate={});
  if(s.confirmedAt)return;
  s.confirmedAt=Date.now();
  document.cookie=${j(AGE_GATE_COOKIE_NAME)}+"=true; max-age=${maxAge}; path=/; SameSite=Lax";
  press();b.setAttribute("aria-disabled","true");
  requestAnimationFrame(function(){
    d.setAttribute(${j(AGE_OK_ATTR)},"");g.setAttribute("aria-hidden","true");
    window.dispatchEvent(new Event(${j(AGE_CONFIRMED_EVENT)}));
  });
});
document.addEventListener("keydown",function(e){
  if(e.key!=="Tab"||!isOpen())return;
  e.preventDefault();
  var f=[b,x],i=f.indexOf(document.activeElement);
  f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();
},true);
if(isOpen())b.focus({preventScroll:true});
})();`;
}
