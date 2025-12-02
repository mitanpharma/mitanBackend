export const asyncHandler = (handlerfunction) => {
  return (req, res, next) => {
    Promise.resolve(handlerfunction(req, res, next)).catch((error) => {
      next(error);
    });
  };
};
