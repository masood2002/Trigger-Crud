const checkName = (req) => {
  const name = req.body.name;
  if (name !== null && typeof name !== "string") {
    return {
      status: false,
      message: req.__("nameMustBeString"),
    };
  }
  return { status: true };
};

export { checkName };
