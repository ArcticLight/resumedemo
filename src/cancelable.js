/**
 * @type {<F extends (...any) => void>(f: F) => [() => void, (...a: Parameters<F>) => void]}
 */
export function cancelable(f) {
 let cancelled = false;
 const cancel = () => { cancelled = true; };
 const call = (...args) => {
   if (!cancelled) {
     f(...args);
   }
 }
 return [cancel, call];
}
