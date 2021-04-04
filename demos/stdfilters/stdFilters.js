//@ts-check
/**
 * This is a standard ESM module. You can run this, right now,
 * uncompiled, in Node (in ESM mode) and in the Browser without
 * any tooling. It has JSDoc TypeScript annotations that correctly
 * type the entire module, so it _can_ be typechecked by TSC,
 * but does not need to be stripped (babel) or compiled (tsc, fast-ts)
 * in order to do so.
 *
 * I feel really strongly about keeping the required tooling to get a JS
 * file "working" to the smallest possible set of tools. It's regular JavaScript
 * first that can run uncompiled, and then correct TypeScript after as an added cherry on top.
 */


/** */
function executeSimpleFilter(value, specInputs) {
  return (
    (('eq' in specInputs)? value === specInputs.eq : true)
    && (('in' in specInputs)? specInputs['in'].includes(value) : true)
    && (('nin' in specInputs)? !specInputs['nin'].includes(value) : true)
  );
}

function executeMultiFilter(values, specInputs) {
  return (
    (('eq' in specInputs)? values.some((val) => val === specInputs.eq) : true)
    && (('in' in specInputs)? values.some((val) => specInputs['in'].includes(val)) : true)
    && (('nin' in specInputs)? values.every((val) => !specInputs['nin'].includes(val)) : true)
  );
}

/**
 * @typedef {{
 *  m:
 *  <O extends Record<string, {
 *    gqType: string;
 *    type?: 'single';
 *    mapper: (thing: U) => any;
 *  } | {
 *    gqType: string;
 *    type: 'list';
 *    mapper: (thing: U) => any[];
 *  }>, U>(
 *    baseTypename: string,
 *    filterSpec: O,
 *    inferExample?: U,
 *  ) => {
 *  inputTypename: string;
 *  schema: string;
 *  execute: (
 *    <R extends U>(
 *      list: R[],
 *      inputs: {
 *        [k in keyof O]: Partial<{
 *          eq: (ReturnType<O[k]['mapper']> extends (infer X)[] ? X : ReturnType<O[k]['mapper']>);
 *          in: (ReturnType<O[k]['mapper']> extends any[] ? ReturnType<O[k]['mapper']> : ReturnType<O[k]['mapper']>[]);
 *          nin: (ReturnType<O[k]['mapper']> extends any[] ? ReturnType<O[k]['mapper']> : ReturnType<O[k]['mapper']>[]);
 *        }>
 *      }
 *    ) => R[]
 *  );
 * }
 * }} StdFilterFunc
 */

/**
 * 1. A conversation about `const f`:
 *
 * Current TSC does not allow you to define generic types in JSDoc.
 * Inserting a generic type using the JSDoc annotation `@template`
 * is sort of a hack, not very well supported, and causes a number of
 * other weird things to happen to the inferred type.
 *
 * This especially concerning TypeScript choosing to strip `?` and `undefined`
 * from typenames defined in JSDoc - try, for example, creating the function
 * ```
 * /**
 *  * @param {number | undefined} thing
 *  * /
 * function f(thing) { }
 * ```
 * in a `.js` file; it will come out as the TS type `(number) => void` which omits
 * the explicit `| undefined` annotation.
 *
 * So, instead, as a hack _on_ a hack, I've defined a TS object where one of its
 * keys is defined to be an inline generic function. TS will happily accept this
 * as written, even in a `.js` file, and inference will also happily figure out
 * that the type can be applied to the given function. Thus, the generic is properly
 * written into the output JS function and all we've done is added JSDoc. No accidental
 * mangling of our type, and it doesn't "lose" the generic parameter.
 *
 * If this were written in TypeScript, that part would be much more plain and it
 * wouldn't have to be written as a `const f = { /* the thing we actually wanted * / }`
 * declaration.
 *
 * 2. What is stdFilterFunc anyway?
 *
 * Recently I've been really enjoying using Gatsby to draft a personal website, and
 * I especially really like that Gatsby auto-generates a useful set of filters for every
 * top-level GraphQL type. Gatsby does this by inferring what your data looks like, and
 * then constructing GraphQL types. It also has a standard implementation of the filter
 * function. You can do queries where you say `{ allMyThings(filter: {id: {eq: 23}}) { ... } }`
 *
 * stdFilterFunc is a function that I've built that implements a tiny part of that functionality,
 * so I could use it in a handwritten GraphQL api. The intended use is that you construct
 * a valid filter definition, and then stdFilterFunc will spit out the filter implementation
 * _and_ the GraphQL schema to implement the filters. It supports scalar types and the operations
 * `eq, in, nin` on those types.
 *
 * Importantly, the resulting filter (due to the higher-kinded TypeScript function) is also correctly
 * typechecked. The resulting `filter.execute()` function requires that the input list extend
 * the originally supplied type U, that the filter construction take in only the keys specified in
 * the inferred constraint O, and that the output type of the filters is known to be the same as the
 * input list, preserving the type in the same way that `[1, 2, 3].map(i => i + 1)` is known to
 * be `number[]`.
 *
 * 3. Important assumptions:
 * The biggest assumption that is made is that the intended filter is on a scalar. This will not work as-written
 * with non-scalar base types, and it will absolutely explode on object types. If the underlying type is not
 * in the set [bool, number, string, null] this approach almost certainly explodes. For my use, that assumption
 * is perfectly valid. The approach probably is either much more complex or maybe even unworkable when trying
 * to handle objects and lists directly.
 *
 * There's a tiny bandaid in here (in the form of `type: 'list'`) that allows simple lists to "work"
 * but I don't think that's a good, generic solution to the problem (and it's not even a great solution
 * for lists in general, it just did what I needed it to do)
 *
 * @type {StdFilterFunc}
 */
const f = {
  /**
   * Construct a standard set of GraphQL filters based on a description.
   * The standard filters operate on simple scalars in types, and they support the operations
   * `eq, in, nin`, where `eq` is standard equality, `in` takes a list to compare for equality, and `nin`
   * is the negation of `in` (filter out all things in the `nin` list, instead of match). All three
   * of the operations may be specified together, resulting in the intersection of all the individual applied
   * filters being the result. "Intersection" being important here - for types whose values are themselves lists,
   * `eq`, `in`, and `nin` combine in ways that may be surprising unless you're thinking about intersection rather than union.
   *
   * @param baseTypename The name of the type, used as a prefix to the type names and filter types
   * in the resulting GraphQL schema.
   * @param filterSpec The filter specification. Basically, the keys that can be used to filter on.
   * The spec is used to map keys -> real objects, because sometimes you want to filter on object
   * properties that may not be valid GraphQL typenames (you can't just say `object['My Key With Whitespace']` in gql)
   * and you also may want to interact with types that have silly names (it's nice to filter on `OPAQUEKEY` but call it
   * `authorName` in the filter spec)
   */
  m: function stdFilter(baseTypename, filterSpec) {
    const inputTypename = `${baseTypename}_filter`;
    const iTypes = Object.entries(filterSpec)
      .flatMap(([key, {gqType}]) => {
        return `input ${baseTypename}_filter_${key} {
  eq: ${gqType}
  in: [${gqType}]
  nin: [${gqType}]
}`;
      });
    const schema = `
${iTypes}
input ${inputTypename} {
${Object.keys(filterSpec).map((key) => `  ${key}: ${baseTypename}_filter_${key}`).join('\n')}
}
`;
    return {
      schema,
      inputTypename,
      execute(list, inputs) {
        return list
          .filter((item) => {
            // Why use Object.entries?
            // first: it's nice to be able to do .every() on the filters,
            // it gives me warm fuzzies to say "items.filter (item) => return Bool(every filter matches item)".
            // so it's my language/readability preference anyway
            //
            // second: Object.entries short-circuits on the number
            // of inputs. I suspect (but haven't yet proven) that
            // doing it this way, instead of as an if-else ladder,
            // is more performant when the inputs is `{}` (empty)
            // which is the relatively common case, because then
            // Object.entries is known to have zero elements and the
            // lambda doesn't even get run, as opposed to the ladder
            // `if (eq in o) { } else if (in in o) { } else if (nin in o) {}`
            // which always needs to test 3 keys.
            return Object.entries(inputs)
              .every(([key, specInputs]) => {
                const filter = filterSpec[key];
                if (filter.type === 'list') {
                  const values = filter.mapper(item);
                  return executeMultiFilter(values, specInputs);
                } else {
                  const value = filter.mapper(item);
                  return executeSimpleFilter(value, specInputs);
                }
              });
          });
      },
    };
  },
}

export const stdFilter = f.m;
