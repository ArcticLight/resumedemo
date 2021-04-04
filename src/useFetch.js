//@ts-check
import { useReducer, useEffect } from '../modules/preact/index.js';
import { cancelable } from './cancelable.js';

/**
 * @typedef {({
 *  t: 'idle';
 *  promise: null;
 *  cancel: null;
 * } | {
 *  t: 'fetching';
 *  promise: Promise<any>;
 *  cancel: () => void;
 * }) & {
 *  data: any | null;
 *  error: any | null;
 * }} State
 */
/**
 * @typedef {{
 *  type: 'initiate';
 *  url: string;
 *  selfDispatch: (a: Action) => void;
 * } | {
 *  type: 'receive';
 *  data: any | null;
 *  error: any | null;
 * } | {
 *  type: 'unmount';
 * }} Action
 */

/**
 * @param {State} state
 * @param {Action} action
 * @returns {State}
 */
function reducer(state, action) {
  if (action.type === 'unmount') {
    if (typeof state.cancel === 'function') {
      state.cancel();
    }
    return {t: 'idle', data: null, error: null, promise: null, cancel: null};
  }

  if (state.t === 'idle' && action.type === 'receive') {
    // Not supposed to be a possible transition:
    // log the error, and take on the new data anyway, to reduce
    // friction and keep the webapp running (this is recoverable):
    console.error(new TypeError('This should never happen!'));
    return {
      ...state,
      data: action.data,
      error: action.error,
    };
  }

  if (action.type === 'initiate') {
    if (state.t === 'fetching') {
      // already was fetching, cancel the previous fetch:
      state.cancel();
    }

    if (typeof action.url !== 'string' || action.url === '') {
      // url is not a string, or is empty. We don't initiate anything, and we also
      // don't clear any previous data (this makes the frontend less "blink-y"):
      return {
        t: 'idle',
        cancel: null,
        data: state.data,
        error: state.error,
        promise: null,
      };
    }
    const rawDispatch = action.selfDispatch;
    const [cancel, controlledDispatch] = cancelable(rawDispatch);
    const url = action.url;
    const promise = fetch(action.url).then(
      (result) => {
        if (result.ok) {
          return result.text().then((text) => {
            controlledDispatch({
              type: 'receive',
              data: text,
              error: null,
            });
          });
        }
        throw new TypeError(`Failed to open ${url}`);
      }
    ).catch(
      (error) => {
        controlledDispatch({
          type: 'receive',
          data: null,
          error,
        });
      }
    );
    return {
      t: 'fetching',
      cancel,
      data: state.data,
      error: state.error,
      promise,
    };
  }

  if (action.type === 'receive') {
    if (typeof state.cancel === 'function') {
      // Not that this should matter, but just as a
      // precaution
      state.cancel();
    }
    return {
      t: 'idle',
      cancel: null,
      data: action.data,
      error: action.error,
      promise: null,
    };
  }
};

/**
 * Use-Fetch, Preact-version.
 * Initiates initial request on first use.
 * Handles cancelling and component unmounting somewhat gracefully.
 *
 * Probably not production-ready.
 * @author ArcticLight
 */
export function useFetch(url) {
  /**
   * @type {[State, (a: Action) => void]}
   */
  const [{error, data, promise, cancel}, dispatch] = useReducer(reducer, {
    state: 'idle',
    data: null,
    promise: null,
  });
  useEffect(() => {
    dispatch({
      type: 'initiate',
      url,
      selfDispatch: dispatch,
    });
  }, [url]);
  useEffect(() => {
    return () => {
      dispatch({type: 'unmount'});
    }
  }, []);
  return {
    data,
    error,
    loading: Boolean(promise),
    refresh: () => dispatch({type: 'initiate', url, selfDispatch: dispatch}),
  };
}
