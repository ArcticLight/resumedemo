import express from 'express';
const app = express();
app.use(express.static('.'));
const port = (() => {
  const p = process.env['PORT']
  if (typeof p === 'string' && p !== '') {
    try {
      let n = Number.parseInt(p);
      if (Number.isInteger(n)) {
        return n;
      }
      throw new TypeError('Oops');
    } catch (e) {
      console.error(`Bad $PORT env, didn't understand "${p}".`);
      console.error("Running on the default port, 3000, instead.");
    }
  }
  return 3000;
})();

app.listen(port, () => {
  console.log('Serving on http://localhost:3000');
});
