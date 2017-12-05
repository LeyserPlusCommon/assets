module.exports = function (buffer, mediaType) {
  return 'base64,' + buffer.toString('base64');
};
