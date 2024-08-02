const validTrigger = (req) => {
  const errors = {};
  if (!req.body.name || typeof req.body.name !== "string")
    errors.name = req.__("nameMustBeString");

  return errors;
};

export { validTrigger };
