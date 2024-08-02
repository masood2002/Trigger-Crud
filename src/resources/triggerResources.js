const successResponse = (message, data, meta, code = 200) => {
  return {
    status: true,
    code: 200,
    message: message,
    ...(data && { data }),
    ...(meta && { meta }),
  };
};

const errorResponse = (message, code = 422) => {
  return {
    status: false,
    code: 422,
    message: message,
  };
};

export { successResponse, errorResponse };
