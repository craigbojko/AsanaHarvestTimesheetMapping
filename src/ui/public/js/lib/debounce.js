/**
* @Author: craigbojko
* @Date:   2016-06-26T16:16:27+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T16:16:30+01:00
*/

module.exports = function ($, sr) {
  var debounce = function (func, threshold, execAsap) {
    var timeout

    return function debounced () {
      var obj = this
      var args = arguments
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args)
        }
        timeout = null
      }

      if (timeout) {
        clearTimeout(timeout)
      } else if (execAsap) {
        func.apply(obj, args)
      }
      timeout = setTimeout(delayed, threshold || 100)
    }
  }

  $.fn[sr] = function (fn) {
    return fn ? this.bind('resize.main', debounce(fn)) : this.trigger(sr)
  }
}
