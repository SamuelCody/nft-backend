const handleResponse = (res, status, message, data, error) => {
  res.json({
    status,
    message,
    data,
    error,
  });
};

module.exports = handleResponse;
