import '../modules/marked/marked-2.0.1/marked.min.js';
// marked sticks itself on Window.
const marked = window.marked;

import { html, useEffect, useRef } from '../modules/preact/index.js';
import { useFetch } from './useFetch.js';

export function MarkedEl({markdown}) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof markdown === 'string' && markdown !== '') {
      ref.current.innerHTML = marked(markdown);
    }
  }, [markdown, ref]);
  return html`<div class="marked" ref=${ref}></div>`
}

export function MarkedFetchDoc({url}) {
  const { data, error, refresh } = useFetch(url);
  console.log({data, error, refresh, url});
  if (error) {
    return html`
      <div class="marked">
      <h1 style="color: red">Oops!</h1>
      <p>An error occurred: ${`${error}`}</p>
      <button onclick=${refresh}>retry</button>
      </div>
    `;
  }
  if (data && typeof data === 'string' && data !== '') {
    return html`<${MarkedEl} markdown=${data}/>`;
  }
  return html`<div class="marked"><p>Loading...</p></div>`;
}
