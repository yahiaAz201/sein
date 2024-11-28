const error = (error) => {
  console.log(`\x1b[5m\x1b[31mError: ${error.stack}\x1b[0m`);
};

const info = (name, message) => {
  console.log(
    `\x1b[34m${name}\x1b[0m`,
    `\x1b[35m: \x1b[0m`,
    `\x1b[32m${message}\x1b[0m`
  );
};

const statement = (statement) => {
  console.log(`\x1b[36m${statement}\x1b[0m`);
};

export default {
  error,
  info,
  statement,
};
