module.exports = fn => (...args) =>
  fn(...args).catch(err => {
    console.error(err);
    args[2](err);
  });
