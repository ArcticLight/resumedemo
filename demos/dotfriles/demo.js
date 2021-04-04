import { html } from '../../modules/preact/index.js';
import { MarkedFetchDoc } from '../../src/MarkedComponent.js';

export function demo() {
  return html`
    <${MarkedFetchDoc} url=${`${import.meta.url}/../README.md`}/>
  `;
}
