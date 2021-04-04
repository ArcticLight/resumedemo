import { html, useState } from '../modules/preact/index.js';
import { useFetch } from './useFetch.js';

/**
 * A tiny View-Source widget, so that demos can display themselves inline.
 * Expects to be fed a src URL where the code lives, and then spits it
 * onto the page without really checking it. Does the job, would be nice
 * if it could be extended to do syntax-highlighting as well.
 */
export function sourceled({src, title}) {
  const { data } = useFetch(src);
  const [hidden, setHidden] = useState(true);
  if (data && typeof data === 'string' && data !== '') {
    if (hidden) {
      return html`<button style="margin-top:2em" onclick=${() => setHidden(false)}>${(title)? title : 'View Source'}</button>`;
    }
    return html`
      <p>File: <code>${src}</code></p>
      <pre><code>${data}</code></pre>
      <button onclick=${() => setHidden(true)}>Collapse</button>
    `;
  }
}
