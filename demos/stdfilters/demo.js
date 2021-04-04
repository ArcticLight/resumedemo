import { html } from '../../modules/preact/index.js';
import { sourceled } from '../../src/sourceled.js';
import { MarkedFetchDoc } from '../../src/MarkedComponent.js';

import { stdFilter } from './stdFilters.js';

const demoFilter = stdFilter(
  'MyType',
  {
    id: {
      gqType: 'String',
      mapper(s) { return s.id },
    }
  },
  {id: 'hi'},
);

const demoData = [
  {id: 'Yes'},
  {id: 'No' },
  {id: 'Maybe'},
];

const exampleFilter = {
  id: {
    in: ['Maybe', 'No'],
  },
};

const filterResult = demoFilter.execute(demoData, exampleFilter);

export function demo() {
  return html`
    <div class="marked">
      <p>Constructed GraphQL input schema:</p>
      <pre><code>${demoFilter.schema}</code></pre>
      <p>Sample use of filter type (assuming in another GraphQL file):</p>
<pre><code>
type MyType {
  id: String!
}

type Query {
  answers(filter: ${demoFilter.inputTypename}): [MyType!]!
}
</code></pre>
      <p>Some sample data (containing "Yes", "No", "Maybe"):</p>
      <pre><code>${JSON.stringify(demoData)}</code></pre>
      <p>An example filter input:</p>
      <pre><code>${JSON.stringify(exampleFilter, null, 2)}</code></pre>
      <p>Filter execution result:</p>
      <pre><code>${JSON.stringify(filterResult)}</code></pre>
      <${sourceled} title="View Source: This demo" src=${import.meta.url}/><br/>
      <${sourceled} title="View Source: stdFilters.js" src=${`${import.meta.url}/../stdFilters.js`} />
    </div>
    <${MarkedFetchDoc} url=${`${import.meta.url}/../README.md`} />
  `;
}
