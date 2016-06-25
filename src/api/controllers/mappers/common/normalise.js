module.exports = function __normalise (name) {
  return name.toString().replace(/[^A-z0-9]/g, '').toLowerCase()
}
