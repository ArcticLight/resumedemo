import { html } from '../../modules/preact/index.js';
import { MarkedFetchDoc } from '../../src/MarkedComponent.js';
import { sourceled } from '../../src/sourceled.js';

export function demo() {
  return html`
    <div class="marked">
      <${sourceled} src=${`${import.meta.url}/../../../index.html`} title="View Source: Dynamically loaded nav"/><br/>
      <${sourceled} src=${import.meta.url} title="View Source: This home page"/>
    </div>
    <${MarkedFetchDoc} url=${`${import.meta.url}/../../../README.md`}/>
  `;
}
