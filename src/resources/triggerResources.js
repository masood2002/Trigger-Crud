const successResponse = (message, result) => {
  return {
    status: true,
    message: message,
    ...(result && { result }),
  };
};

const errorResponse = (message, result) => {
  return {
    status: false,
    message: message,
    ...(result && { result }),
  };
};

export { successResponse, errorResponse };
