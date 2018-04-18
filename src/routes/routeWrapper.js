module.exports = fn => (...args) =>
  fn(...args).catch(err => {
    args[2](err);
  });
