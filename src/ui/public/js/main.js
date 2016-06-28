/**
* @Author: craigbojko
* @Date:   2016-06-26T15:06:28+01:00
* @Last modified by:   craigbojko
* @Last modified time: 2016-06-26T22:07:31+01:00
*/

var $ = window.$ = window.jQuery = require('jquery')
require('./lib/debounce')($, 'smartresize')

window.__main = new Main()

function Main () {
  this.debounceResize = debounceResize
  this.setSizeManual = setArticleHeight
  setArticleHeight()
  init()
}

function setArticleHeight () {
  var $article = $('article')
  var $nav = $('nav')

  var winHeight = $(window).height()
  var newHeight = winHeight

  $article.height(newHeight)
  $nav.height(newHeight)
}

function init () {
  debounceResize(setArticleHeight)
}

function debounceResize (cb) {
  $(window).smartresize(cb)
}
