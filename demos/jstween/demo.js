import { html } from '../../modules/preact/index.js';
import { sourceled } from '../../src/sourceled.js';


import { to, seqTimeline, parTimeline, Eases } from './2.0.4/src/index.js';
import { CSSColor, CSSPixels, CSSVariableTarget } from './2.0.4/src/plugins/css-property-target.js';
import { rgb } from './2.0.4/src/plugins/rgb.js';

export function demo() {
  const h1 = new CSSVariableTarget('--header-tr', new CSSPixels(0));
  const div = new CSSVariableTarget('--div-bg', new CSSColor(rgb(0,0,0,0)));
  const animate = parTimeline(
    seqTimeline(
      to(h1, '0', '-4px', .3).withEase(Eases.easeOutQuart),
      to(h1, '-4px', '0', .7).withEase(Eases.easeInOutQuart),
      to(h1, '0', '-2px', 1).withEase(Eases.easeInOutQuart),
      to(h1, '-2px', '0', 1).withEase(Eases.easeInOutQuart),
    ),
    seqTimeline(
      to(div, 'rgba(0,0,0,0)', 'rgba(255,255,0,1)', 1),
      to(div, 'rgba(255,255,0,1)', 'rgba(0,255,255,1)', 1),
      to(div, 'rgba(0,255,255,1)', 'rgba(0,0,0,0)', 1),
    )
  );

  return html`
    <div class="marked">
      <h1 style="transform: translateY(${h1.var})">JSTween: A Demonstration</h1>
      <div style="background: ${div.var}">
        <p>Animations via modern ESM, in functional style</p>
        <p>
          This works in all Evergreen browsers without any compilers or extra tools, today,
          and in most browsers all the way back to IE-11 with the right polyfills and Webpack config.
        </p>
        <button onclick=${() => animate.start()}>Click me!</button>
      </div>
      <p>The purpose of this demo is best explained on the Home page.</p>
      <${sourceled} src=${import.meta.url}/>
    </div>
  `;
}
