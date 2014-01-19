/*!
 * Leapstrap v1.1.0 by Alex Wilkes
 * Copyright 2014 Alex Wilkes
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */
if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(window.jQuery);

/*global Leap*/
var LeapElement = function(dom) {
    this.dom = dom;
    this.cursor = null;
};

LeapElement.prototype = {
    isAttractor: function() {
        return this.dom.getAttribute("leap-attractor") === "true" || (this.dom.getAttribute("leap-attractor-x-padding") != null && !isNaN(this.dom.getAttribute("leap-attractor-x-padding"))) || (this.dom.getAttribute("leap-attractor-y-padding") != null && !isNaN(this.dom.getAttribute("leap-attractor-y-padding")));
    },
    appendChild: function(element) {
        if (element instanceof HTMLElement) {
            return this.dom.appendChild(element);
        } else {
            return this.dom.appendChild(element.getDom());
        }
    },
    removeChild: function(element) {
        if (element instanceof HTMLElement) {
            return this.dom.removeChild(element);
        } else {
            return this.dom.removeChild(element.getDom());
        }
    },
    getID: function() {
        return this.dom.id;
    },
    setStyle: function(style) {
        for (var key in style) {
            this.dom.style[key] = style[key];
        }
    },
    getParent: function() {
        return this.dom.parentNode;
    },
    getWidth: function() {
        return this.dom.offsetWidth;
    },
    getHeight: function() {
        return this.dom.offsetHeight;
    },
    getDom: function() {
        return this.dom;
    },
    hasCursor: function() {
        return this.cursor !== null;
    },
    capture: function(cursor) {
        // console.log("Cursor Captured");
        this.cursor = cursor;
        this.cursor.capture(this);
    },
    release: function() {
        // console.log("Cursor Released");
        if (this.cursor) {
            this.cursor.release();
            this.cursor = null;
        }
    },
    getAttractorPadding: function() {
        return {
            x: parseInt(this.dom.getAttribute("leap-attractor-x-padding"), 10) || 0,
            y: parseInt(this.dom.getAttribute("leap-attractor-y-padding"), 10) || 0
        };
    },
    setAttribute: function(name, value){
        this.dom.setAttribute(name, value);
    },
    getClickDelay: function() {
        return this.dom.getAttribute("leap-click-delay");
    },
    hasMultitap: function() {
        return this.dom.getAttribute("leap-enable-multitap") === "true";
    },
    isTappable: function() {
        return this.dom.getAttribute("leap-disable-tap") !== "true";
    },
    isHoverable: function() {
        return this.dom.getAttribute("leap-disable-hover") !== "true";
    },
    hasRelay: function() {
      return this.dom.getAttribute("leap-relay") !== null;
    },
    getRelay: function() {
        var selector = this.dom.getAttribute("leap-relay");
        return selector;
    },
    setXY: function(x, y) {
        this.setX(x);
        this.setY(y);
    },
    setX: function(x) {
        this.dom.style.left = x + "px";
    },
    setY: function(y) {
        this.dom.style.top = y + "px";
    },
    getX: function() {
        return this.dom.getBoundingClientRect().left;
    },
    getY: function() {
        return this.dom.getBoundingClientRect().top;
    },
    scroll:function(speed) {
        var dom = this.dom,
            domParent = dom.parentElement,
            yDiff = dom.clientHeight > domParent.clientHeight,
            xDiff = dom.clientWidth > domParent.clientWidth;

        if(dom === document.body) {
            if(yDiff > 0 && yDiff > xDiff) {
                this.scrollY(speed);
            }else if(xDiff >0) {
                this.scrollX(speed);
            }
        }else {
            if(dom.scrollHeight > dom.clientHeight) {
                this.scrollY(speed);
            }else if (dom.scrollWidth > dom.clientWidth) {
                this.scrollX(speed);
            }
        }
    },
    scrollX: function(speed) {
        this.dom.scrollLeft += speed;
    },
    scrollY: function(speed) {
        this.dom.scrollTop += speed;
    },
    addClass: function(classname) {
        var cn = this.dom.className;
        //test for existance
        if (cn && cn.indexOf(classname) !== -1) {
            return;
        }
        //add a space if the element already has class
        if (cn !== '') {
            classname = ' ' + classname;
        }
        this.dom.className = cn + classname;
    },
    removeClass: function(classname) {
        var cn = this.dom.className;
        var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
        cn = cn.replace(rxp, '');
        this.dom.className = cn;
    },
    fireEvent: function(event) {
        this.dom.dispatchEvent(event);
    }
};

var LeapManagerUtils = (function() {
    var elementsCache = {};
    var ELEMENT_ID_PREFIX = "leap_element_";
    var elementCount = 0;
    var queryCache = {};

    return {
        getLeapElement: function(domElement) {
            if(domElement == null) return null;
            if (!domElement.id) domElement.id = ELEMENT_ID_PREFIX + elementCount++;
            if (!elementsCache[domElement.id]) {
                elementsCache[domElement.id] = new LeapElement(domElement);
            }
            return elementsCache[domElement.id];
        },
        isElementVisible: function(element) {
            while (element !== document.body.parentNode) {
                if ('0' === LeapManagerUtils.getStyle(element, "opacity") || 'none' === LeapManagerUtils.getStyle(element, "display") || 'hidden' === LeapManagerUtils.getStyle(element, "visibility")) {
                    return false;
                }
                element = element.parentNode;
            }
            return true;
        },
        getStyle: function(el, style) {
            if (window.getComputedStyle) {
                return document.defaultView.getComputedStyle(el)[style];
            }
            if (el.currentStyle) {
                return el.currentStyle[style];
            }
        },
        extend: function(a, b) {
            for (var i in b) {
                a[i] = b[i];
            }
        },
        extendIf: function(a, b) {
            for (var i in b) {
                if (b[i] instanceof Object && b[i].constructor === Object) {
                    if (a[i] === undefined || a[i] === null) a[i] = {};
                    LeapManagerUtils.extendIf(a[i], b[i]);
                } else {
                    if (a[i] === undefined || a[i] === null) a[i] = b[i];
                }
            }
        },
        exists: function(obj){
            return obj !== undefined && obj !== null;
        },
        bind: function(func, scope, args) {
            return function() {
                if (!args) args = [];
                args = Array.prototype.slice.call(arguments).concat(args);
                func.apply(scope, args);
            };
        },
        map: function(value, srcLow, srcHigh, resultLow, resultHigh) {
            return (value === srcLow) ? resultLow : (value - srcLow) * (resultHigh - resultLow) / (srcHigh - srcLow) + resultLow;
        },
        error: function(error) {
            console.log(error);
        },
        testStructure: function(obj, structure){
            var value;
            for (var i = 0; i < structure.length; i++) {
                value = structure[i];
                if(typeof(value) === "string") {
                    if(!LeapManagerUtils.exists(obj[value])) {
                        return false;
                    }else{
                        obj = obj[value];
                    }
                }
            }
            return true;
        },
        createStructure: function(obj, structure){
            var structureExists = true,
            value;
            for (var i = 0; i < structure.length; i++) {
                value = structure[i];
                if(typeof(value) === "string") {
                    if(!LeapManagerUtils.exists(obj[value])) {
                        obj = obj[value] = {};
                        structureExists = false;
                    }
                }
            }
            return structureExists;
        },
        distance: function(a, b) {
            var xs, ys;
            xs = b.x - a.x;
            xs = xs * xs;

            ys = b.y - a.y;
            ys = ys * ys;

            return Math.sqrt( xs + ys );
        },
        getQueryAll: function(id, selector, useCache) {
            if(useCache) {
                if(!LeapManagerUtils.exists(queryCache[id])) {
                    queryCache[id] = document.querySelectorAll(selector);
                }
                return queryCache[id];
            } else {
                return document.querySelectorAll(selector);
            }
        },
        getQuery: function(id, selector) {
            if(!LeapManagerUtils.exists(queryCache[id])) {
                queryCache[id] = document.querySelector(selector);
            }
            return queryCache[id];
        }
    };
})();

var Cursor = function(config) {
    var TIMER_CURSOR_CLASS = "leap-timer-cursor";
    if(!config) {
        LeapManagerUtils.error('Cursor#constructor: You must specify a config object.');
        return null;
    }
    if (!config.source) {
        LeapManagerUtils.error('Cursor#constructor: You must specify a `source`.');
        return null;
    }
    if (!config.id) {
        LeapManagerUtils.error('Cursor#constructor: You must specify a `id`.');
        return null;
    }
    if (!config.icon) {
        LeapManagerUtils.error('Cursor#constructor: You must specify a `icon`.');
        return null;
    }
    LeapManagerUtils.extendIf(config, this.defaultConfig);
    this.source = config.source;
    this.id = config.id;
    this.type = config.type;
    this.icon = config.icon;
    this.easing = config.easing;
    this.clickDelay = config.clickDelay;
    this.multitapEnabled = config.multitapEnabled;

    //Cursor that created this virtual cursor
    this.virtualParent = config.virtualParent || null;
    if(this.virtualParent) {
        this.type = "virtual";
        this.setElement(this.virtualParent.getElement());
        this.virtualParent.addVirtual(this);
    }

    //Virtual Cursors attached to this cursor
    this.virtualCursors = [];

    if (this.clickDelay === 0 || isNaN(this.clickDelay)) this.clickDelay = null;
    this.onTapUpdate = LeapManagerUtils.bind(this._onTapUpdate, this);
    if (this.clickDelay) this.icon.addClass(TIMER_CURSOR_CLASS);
    if (this.icon instanceof HTMLElement) this.icon = new LeapElement(this.icon);
    if (config.position) {
        this.update(config.position.x, config.position.y);
        var halfWidth = (this.icon.getWidth() / 2);
        var halfHeight = (this.icon.getHeight() / 2);
        this.icon.setX((config.position.x * window.innerWidth) + halfWidth);
        this.icon.setY((config.position.y * window.innerHeight) + halfHeight);
    }
};

Cursor.prototype = {
    //Position
    x: 0,
    y: 0,
    z: 0,
    //Speed
    X: 0,
    Y: 0,
    Z: 0,
    //Velocity
    vX: 0,
    vY: 0,
    vZ: 0,
    enabled: true,
    captureHost: null,
    attractor: null,
    element: null,
    isTimerRunning: false,
    type: "real",
    startTime: null,
    animiationIntervalID: null,
    state: "up",
    currentClickDelay: 0,
    defaultConfig: {
        multitapEnabled: false,
        clickDelay: 0,
        easing: 0.3
    },
    _tapCapable: true,
    _startPoint: null,
    onAdded: function() {},
    onRemoved: function() {},
    setManager: function(manager){
        this.manager = manager;
    },
    //Enabled
    setEnabled: function(value) {
        this.enabled = value;
    },
    isEnabled: function() {
        return this.enabled;
    },
    //Element
    setElement: function(element) {
        this.element = element;
    },
    getElement: function(element) {
        return this.element;
    },
    hasElement: function() {
        return this.element !== null;
    },
    //Callbacks from Manager for Element Interactions
    onElementOver: function(element) {
        this.setElement(element);
        this.currentClickDelay = this.element.getClickDelay() || this.clickDelay;
        if (element.isHoverable()) {
            element.addClass("hover");
        }
        if (this._tapCapable && this.manager.isHoverTapEnabled() && this.currentClickDelay && element.isTappable()) {
            this.startTimer();
        }
    },
    onElementDown: function(element) {
        element.addClass("leap-down");
        this.icon.addClass("cursor-down");
        this.state = "down";
    },
    onElementMove: function(element) {},
    onElementUp: function(element) {
        this.state = "up";
        element.removeClass("leap-down");
        this.icon.removeClass("cursor-down");
    },
    onElementOut: function(element) {
        if (element.isHoverable()) {
            element.removeClass("hover");
        }
        if (this.manager.isHoverTapEnabled() && this.currentClickDelay && element.isTappable()) {
            this.stopTimer();
        }
        this.setElement(null);
    },
    isDown:function() {
        return this.state === "down";
    },
    disableTap: function() {
        if(this.element) {
            if (this.element.isHoverable()) {
                this.element.removeClass("hover");
            }

            if (this.currentClickDelay && this.element.isTappable()) {
                this.stopTimer();
            }
        }
        this._tapCapable = false;
    },
    restartTap: function() {
        this._tapCapable = true;
    },
    //Attractor
    setAttractor: function(attractor) {
        this.attractor = attractor;
    },
    hasAttractor: function() {
        return this.attractor !== null;
    },
    //Capture  & Release
    capture: function(host) {
        this.captureHost = host;
        this.setAttractor(null);
    },
    isCaptured: function() {
        return this.captureHost != null;
    },
    release: function() {
        this.captureHost = null;
    },
    //Position
    update: function(x, y, z) {
        this.setPositionX(x);
        this.setPositionY(y);
        this.setPositionZ(z);
    },
    setPositionX: function(value) {
        this.X = value - this.x;
        this.x = value;
    },
    setPositionY: function(value) {
        this.Y = value - this.y;
        this.y = value;
    },
    setPositionZ: function(value) {
        this.Z = value - this.z;
        this.z = value;
    },
    //Speed
    getX: function() {
        return this.x;
    },
    getY: function() {
        return this.y;
    },
    getZ: function() {
        return this.z;
    },
    //Velocity
    setVelocityXYZ: function(x, y, z) {
        this.setVelocityX(x);
        this.setVelocityY(y);
        this.setVelocityZ(z);
    },
    setVelocityX: function(value) {
        this.vX = value;
    },
    setVelocityY: function(value) {
        this.vY = value;
    },
    setVelocityZ: function(value) {
        this.vZ = value;
    },
    getVelocityX: function() {
        return this.vX;
    },
    getVelocityY: function() {
        return this.vY;
    },
    getVelocityZ: function() {
        return this.vZ;
    },
    //Easing
    getEasing: function() {
        return this.easing;
    },
    fireEvent: function(event) {
        if (this.element) {
            event.cursor = this;
            this.element.fireEvent.apply(this.element, [event]);
        }
    },
    startTimer: function() {
        // console.log("startTimer");
        if (this.animiationIntervalID) this.stopTimer();
        this.startTime = new Date();
        var me = this;
        this.animiationIntervalID = setInterval(
            function() {
                me.onTapUpdate();
            }, 1000 / 30
        );
        this.onTimerStart();
    },
    stopTimer: function() {
        clearInterval(this.animiationIntervalID);
        this.startTime = null;
        this.onTimerStop();
    },
    isVirtual: function() {
        return this.type === "virtual";
    },
    addVirtual: function(virtualCursor) {
        this.virtualCursors.push(virtualCursor);
    },
    _onTapUpdate: function() {
        // console.log("_onTapUpdate"); 
        if (!this.startTime) {
            this.stopTimer();
            return;
        }
        var now = new Date();
        var time = now - this.startTime;
        this.onTimerUpdate(time);
        if (time >= this.currentClickDelay) {
            this.stopTimer();
            this.onTimerComplete();
        }
    },
    onTimerStart: function() {
        // console.log("onTimerStart");
        this.icon.setStyle({
            "transitionDuration": this.currentClickDelay / 1000 + "s"
        });
        this.icon.addClass("active-timer");
    },
    onTimerStop: function() {
        // console.log("onTimerStop");
        this.icon.setStyle({
            "transitionDuration": "0s"
        });
        this.icon.removeClass("active-timer");
    },
    onTimerUpdate: function(time) {},
    onTimerComplete: function() {
        if (this.element) {
            this.dispatchDown();
            this.dispatchUp();
            this.dispatchClick();
            this.dispatchTap();
            
            if (this.multitapEnabled || this.element.hasMultitap()) {
                var me = this;
                setTimeout(function() {
                    me.startTimer();
                }, 100);
            } else {
                this.release();
            }
        } else {
            this.release();
        }
    },
    initEvent: function(evtType, type) {
        var evt = document.createEvent(evtType),
            args = [
                // Type
                type, 
                // CanBubble
                true, 
                // Cancelable
                true, 
                // view
                window,
                // detail 
                1, 
                // screenX
                this.icon.getX(), 
                // screenY
                this.icon.getY(), 
                // clientX
                this.icon.getX(), 
                // client Y
                this.icon.getY(), 
                // ctrlKey, altKey, shiftKey, metaKey
                false, false, false, false, 
                // button
                0, 
                // related target
                this.element.getDom()
            ],
            fn;

        if(evtType === "MouseEvent") {
            fn = evt.initMouseEvent;
        } else if(evtType === "UIEvent") {
            fn = evt.initUIEvent;
        } else {
            fn = evt.initEvent;
        }

        fn.apply(evt, args);
        return evt;
    },
    initAndFireEvent: function(evtType, type) {
        var evt = this.initEvent(evtType, type);
        this.fireEvent(evt);
    },
    dispatchOver: function(element) {
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "mouseover");
            this.onElementOver(this.element);
        }
    },
    dispatchMove: function(element) {
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "mousemove");
            this.onElementMove(this.element);
            if(this.manager.isPressDownEnabled() && this.element.isTappable()) {
                if(!this.isDown() && this.getZ() < this.manager.getPressThreshold()) {
                    this.dispatchDown(element);
                }else if(this.isDown() && this.getZ() > this.manager.getPressThreshold()) {
                    this.dispatchUp(element);
                }
            }
        }
    },
    dispatchOut: function(element) {
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "mouseout");
            if(this.isDown()) this.dispatchUp(element, false);
            this.onElementOut(this.element);
        }
    },
    dispatchDown: function(element) {
        if(element) this.setElement(element);
        this._startPoint = {x:this.icon.getX(), y: this.icon.getY()};
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "mousedown");
            this.onElementDown(this.element);
        }
    },
    dispatchUp: function(element, dispatchClick) {
        if(!LeapManagerUtils.exists(dispatchClick)) dispatchClick = true;
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "mouseup");
            this.onElementUp(this.element);

            var distance = LeapManagerUtils.distance(this._startPoint, {x:this.icon.getX(), y: this.icon.getY()});
            if(dispatchClick && distance > 0 && distance < 100) {
                this.dispatchClick();
                this.dispatchTap();
            }
        }
    },
    dispatchClick: function(element) {
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("MouseEvent", "click");
        }  
    },
    dispatchTap: function(element) {
        if(element) this.setElement(element);
        if(this.hasElement()) {
            this.initAndFireEvent("UIEvent", "tap");
        }  
    }
};

var HandCursor = function(config) {
    var HAND_OPEN = "open", 
        HAND_GRAB = "grab",
        HAND_CLOSED = "closed",
        EVT_GRAB = "grab",
        EVT_RELEASE = "release",
        EVT_MOVE = "move",
        ACTIVE_CLASS = "grabbed",
        ACTIVE_CURSOR_CLASS = "leap-cursor-grabbing",
        cursor = new Cursor(config);

    LeapManagerUtils.extend(cursor, 
        {
            isHand: true,
            lastOpenTime: new Date(),
            grabDelay: 200,
            handState: null,
            isOutside: false,
            update: function(x,y,z,fingers) {
                    var timeDiff;

                Cursor.prototype.update.apply(this, arguments);

                if(this.hasElement()) {
                    if(this.handState === null) {
                        this.handState = HAND_CLOSED;
                        return;
                    }

                    if(this.handState !== HAND_GRAB && fingers > 2) {
                        this.handState = HAND_OPEN;
                        this.lastOpenTime = new Date();
                    } else if(this.handState === HAND_GRAB && fingers  <=2 ) {
                        this.dispatchGrab(EVT_MOVE);
                    } else if(this.handState === HAND_GRAB && fingers  > 2 ) {
                        this.handState = HAND_OPEN;
                        this.dispatchGrab(EVT_RELEASE);
                    } else if (this.handState === HAND_OPEN && fingers <= 2) {
                        timeDiff = new Date() - this.lastOpenTime;
                        if(timeDiff < this.grabDelay) {
                            this.handState = HAND_GRAB;
                            this.dispatchGrab(EVT_GRAB);
                        } else {
                            this.handState = HAND_CLOSED;
                        }
                    }
                }
            },
            dispatchGrab: function(type) {
                var evt;
                if (this.hasElement()) {
                    evt = this.initEvent("MouseEvent", "leap-hand-grab");
                    evt.state = type;
                    evt.gesture = "grab";
                    this.element.fireEvent(evt);
                }

                if(this.hasElement()) {
                    if(type === EVT_GRAB) {
                        this.element.addClass(ACTIVE_CLASS);
                        cursor.icon.addClass(ACTIVE_CURSOR_CLASS);
                    } else if(type === EVT_RELEASE ) {
                        this.element.removeClass(ACTIVE_CLASS);
                        cursor.icon.removeClass(ACTIVE_CURSOR_CLASS);
                        if(this.isOutside) {
                            this.setElement(null);
                        }
                    }
                }
            },
            onElementOver: function(element) { 
                this.isOutside = false;
                Cursor.prototype.onElementOver.apply(this, arguments);
            },
            onElementOut: function(element) {
                if(this.handState !== HAND_GRAB) {
                    Cursor.prototype.onElementOut.apply(this, arguments);
                } else {
                    this.isOutside = true;
                    if (element.isHoverable()) {
                        element.removeClass("hover");
                    }
                    if (this.manager.isHoverTapEnabled() && this.currentClickDelay && element.isTappable()) {
                        this.stopTimer();
                    }
                }
            }
        }
    );
    return cursor;
};

var CursorManager = function(config) {
    this.globalInteractiveSelector = '.leap-interactive';
    this.cursorContainerClass = 'leap-cursor-container';
    this.leapCursorClass = 'leap-cursor';

    this.interactiveSelector = config.interactiveSelector || null;
    this.untappableSelector = config.untappableSelector || null;
    this.pressThreshold = config.pressThreshold || 0;
    this.enableHoverTap = config.enableHoverTap === true;
    this.enablePressDown = config.enablePressDown === true;
    this.greedySelector = config.greedySelector || null;
    this.cacheAllQueries = config.cacheAllQueries || false;

    if (!this.cursorContainer) {
        this.cursorContainer = new LeapElement(document.createElement('div'));
        var root = config.root || document.body;
        root.appendChild(this.cursorContainer.getDom());
        this.cursorContainer.addClass(this.cursorContainerClass);
        this.cursorContainer.setStyle({
            zIndex: 100000,
            position: "fixed",
            top: "0px",
            left: "0px"
        });
    }
};

CursorManager.prototype = {
    cursorContainer: null,
    elementLookup: {},
    mouseEvent: null,
    interactiveSelector: "",
    cursorLookup: {},
    isHoverTapEnabled:function(){
        return this.enableHoverTap === true;
    },
    isPressDownEnabled: function() {
        return this.enablePressDown === true;
    },
    getPressThreshold: function() {
        return this.pressThreshold || 0;
    },
    get: function(source, id, type) {
        if(type == null) type = "real";
        LeapManagerUtils.createStructure(this.cursorLookup, [type, source]);
        return this.cursorLookup[type][source][id];
    },
    add: function(cursor) {
        var type = cursor.type || "real";
        var source = cursor.source || "default";
        var id = cursor.id || 0;
        LeapManagerUtils.createStructure(this.cursorLookup, [type, source]);

        if(!LeapManagerUtils.exists(this.cursorLookup[type][source][id])) {
            this.cursorLookup[type][source][id] = cursor;
            this.cursorContainer.appendChild(cursor.icon);
            cursor.icon.addClass(this.leapCursorClass);
            cursor.setManager(this);
            cursor.onAdded();
            return cursor;
        }else {
            return this.cursorLookup[type][source][id];
        }
    },
    remove: function(cursor) {
        var type = cursor.type || "real";
        var source = cursor.source || "default";
        var id = cursor.id || 0;

        if(!cursor.isVirtual() && LeapManagerUtils.testStructure(this.elementLookup, [cursor.source, cursor.id])) {
            var element = this.elementLookup[cursor.source][cursor.id];
             if (element && element.isAttractor()) {
                cursor.setAttractor(null);
                //Release Cursor
                if (element.hasCursor()) element.release();
            }
            if(element) {
                this.cursorOut(cursor, element, {x:cursor.icon.getX(), y:cursor.icon.getY()});
            }
            this.elementLookup[cursor.source][cursor.id] = null;
        }

        var virtualCursor;
        for (var i = 0; i < cursor.virtualCursors.length; i++) {
            virtualCursor = cursor.virtualCursors[i];
            this.removeVirtualCursor(virtualCursor);
        }
        cursor.virtualCursors = [];
        cursor.setManager(null);
        cursor.onRemoved();
        if(LeapManagerUtils.exists(cursor.icon.getParent())) this.cursorContainer.removeChild(cursor.icon);
        if(LeapManagerUtils.testStructure(this.cursorLookup, [type, source])) {
            this.cursorLookup[type][source][cursor.id] = null;
            delete this.cursorLookup[type][source][cursor.id];
        }
        return true;
    },
    pruneCursors: function(source, activeIDs, type) {
        if(!LeapManagerUtils.exists(type)) type = "real";
        if(LeapManagerUtils.testStructure(this.cursorLookup, [type, source])) {
            var cursor,
                cursorIndex,
                remove = [];
            for(cursorIndex in this.cursorLookup[type][source]){
                cursor = this.cursorLookup[type][source][cursorIndex];
                if(cursor instanceof Cursor) {
                    if(activeIDs.indexOf(cursor.id) === - 1) {
                        remove.push(cursor);
                    }
                }
            }

            for (var i = 0; i < remove.length; i++) {
                this.remove(remove[i]);
            }
        }
    },
    update: function() {
        var windowPoint, destinationPoint, xDiff, yDiff, xRatio, yRatio, halfWidth, halfHeight, minPull = 0.1,
            maxPull = 1,
            bounds, originalElement, element, attractorElement, i, cursor,
            typeIndex, sourceIndex, cursorIndex;
        for(typeIndex in this.cursorLookup){
            for(sourceIndex in this.cursorLookup[typeIndex]){
                for(cursorIndex in this.cursorLookup[typeIndex][sourceIndex]){
                    cursor = this.cursorLookup[typeIndex][sourceIndex][cursorIndex];
                    if(cursor instanceof Cursor) {
                        //Virtual Cursors just get moved, but are not used in detection.
                        if(cursor.isVirtual()) {
                            cursor.icon.setX(cursor.icon.getX() + cursor.getVelocityX());
                            cursor.icon.setY(cursor.icon.getY() + cursor.getVelocityY());
                            continue;
                        }

                        if (!this.elementLookup[cursor.source]) this.elementLookup[cursor.source] = {};
                        if (!this.elementLookup[cursor.source][cursor.id]) this.elementLookup[cursor.source][cursor.id] = null;
                        windowPoint = {
                            x: Math.round(cursor.getX() * window.innerWidth),
                            y: Math.round(cursor.getY() * window.innerHeight)
                        };
                        element = this.elementLookup[cursor.source][cursor.id];
                        //Cursor Is Not enabled, check for an object under it
                        if (!cursor.isEnabled()) {
                            if (element) {
                                if (element.isAttractor()) {
                                    cursor.setAttractor(null);
                                    //Release Cursor
                                    if (element.hasCursor()) element.release();
                                }
                                this.cursorOut(cursor, element);
                                this.elementLookup[cursor.source][cursor.id] = null;
                            }
                            continue;
                        }
                        halfWidth = (cursor.icon.getWidth() / 2);
                        halfHeight = (cursor.icon.getHeight() / 2);
                        if (!cursor.isCaptured()) {
                            if (cursor.attractor) {
                                attractorElement = cursor.attractor.getDom();
                                bounds = attractorElement.getBoundingClientRect();
                                destinationPoint = {
                                    x: Math.round((bounds.left + (bounds.width / 2)) - halfWidth),
                                    y: Math.round((bounds.top + (bounds.height / 2)) - halfHeight)
                                };
                                xDiff = destinationPoint.x - cursor.icon.getX();
                                yDiff = destinationPoint.y - cursor.icon.getY();
                                xRatio = Math.abs(xDiff / (bounds.width / 2));
                                yRatio = Math.abs(yDiff / (bounds.height / 2));
                                if (xRatio > 1) xRatio = 1;
                                if (yRatio > 1) yRatio = 1;
                                xRatio = Math.abs(1 - xRatio);
                                yRatio = Math.abs(1 - yRatio);
                                cursor.setVelocityXYZ(
                                xDiff * Math.max(minPull, Math.min(maxPull, xRatio)), yDiff * Math.max(minPull, Math.min(maxPull, yRatio)), 0);
                                if (Math.abs(cursor.getVelocityX()) <= 0.1 && Math.abs(cursor.getVelocityY()) <= 0.1) {
                                    cursor.setVelocityXYZ(0, 0, 0);
                                    cursor.icon.setX(destinationPoint.x);
                                    cursor.icon.setY(destinationPoint.y);
                                    cursor.attractor.capture(cursor);
                                }
                            } else {
                                xDiff = (windowPoint.x - halfWidth) - cursor.icon.getX();
                                yDiff = (windowPoint.y - halfHeight) - cursor.icon.getY();
                                cursor.setVelocityXYZ(xDiff * cursor.getEasing(), yDiff * cursor.getEasing());
                            }
                        }
                        cursor.icon.setX(cursor.icon.getX() + cursor.getVelocityX());
                        cursor.icon.setY(cursor.icon.getY() + cursor.getVelocityY());
                        element = this.getCollidingElements(windowPoint);
                        originalElement = this.elementLookup[cursor.source][cursor.id];
                        if (element) {
                            if (originalElement == null) {
                                this.elementLookup[cursor.source][cursor.id] = element;
                                if (element.isAttractor() && !element.hasCursor() && cursor.attractor == null && cursor.captureHost == null) {
                                    cursor.setAttractor(element);
                                }
                                this.cursorOver(cursor, element);
                            }
                            this.cursorMove(cursor, element);
                        }
                        if (originalElement && originalElement !== element) {
                            if (originalElement.isAttractor()) {
                                cursor.setAttractor(null);
                                if (originalElement.hasCursor()) originalElement.release(cursor);
                            }
                            this.cursorOut(cursor, originalElement);
                            this.elementLookup[cursor.source][cursor.id] = element;
                            if (element) {
                                this.cursorOver(cursor, element);
                                if (element.isAttractor() && cursor.attractor == null && cursor.captureHost == null) {
                                    if (!(element.hasCursor())) cursor.setAttractor(element);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    cursorOver: function(cursor, element) {
        cursor.dispatchOver(element);
    },
    cursorMove: function(cursor, element) {
       cursor.dispatchMove(element);
    },
    cursorOut: function(cursor, element) {
        cursor.dispatchOut(element);
    },
    cursorDown: function(cursor, element) {
        cursor.dispatchDown(element);
    },
    cursorUp: function(cursor, element) {
        cursor.dispatchUp(element);
    },

    getCollidingElements: function(point) {
        var selector = this.globalInteractiveSelector;
        if(typeof(this.interactiveSelector) === "string" && this.interactiveSelector.length >0) {
            selector += ", " + this.interactiveSelector;
        }

        var interactiveElements = LeapManagerUtils.getQueryAll("interactiveElements", selector, this.cacheAllQueries) || [],
            horizontalPadding, verticalPadding, i, element, bounds, withinXBounds, withinYBounds;

        for (i = interactiveElements.length-1; i >= 0; i--) {
            element = interactiveElements[i];
            if (!LeapManagerUtils.isElementVisible(element)) continue;
            bounds = element.getBoundingClientRect();
            element = LeapManagerUtils.getLeapElement(element);
            if(element) {
                horizontalPadding = element.isAttractor() ? element.getAttractorPadding().x : 0;
                verticalPadding = element.isAttractor() ? element.getAttractorPadding().y : 0;
                // console.log(point.x + " : " + (bounds.left - horizontalPadding) + " : " + (bounds.left + bounds.width + horizontalPadding));
                // console.log(point.y + " : " + (bounds.top - verticalPadding) + " : " + (bounds.top + bounds.height + verticalPadding));
                withinXBounds = point.x > (bounds.left - horizontalPadding) && point.x < (bounds.left + bounds.width + horizontalPadding);
                withinYBounds = point.y > (bounds.top - verticalPadding) && point.y < (bounds.top + bounds.height + verticalPadding);
                if (withinXBounds && withinYBounds) {
                    if(element.hasRelay()) {
                        element = LeapManagerUtils.getLeapElement(LeapManagerUtils.getQuery(element.getID() + "-relay", element.getRelay()));
                    }

                    if(element) {
                        if(element.isTappable() && typeof(this.untappableSelector) === "string" && this.untappableSelector.length >0) {
                            var untappableElements = LeapManagerUtils.getQueryAll("untappableElements", this.untappableSelector, this.cacheAllQueries) || [];
                            for (i = 0; i < untappableElements.length; i++) {
                                if(untappableElements[i] === element.getDom()) {
                                    element.setAttribute("leap-disable-tap", "true");
                                    break;
                                }
                            }
                        }
                        return element;
                    }
                }
            }
        }

        if(this.greedySelector !== null) {
            element = LeapManagerUtils.getLeapElement(LeapManagerUtils.getQuery("greedySelector", this.greedySelector));
            if(element.hasRelay()) {
                element = LeapManagerUtils.getLeapElement(LeapManagerUtils.getQuery(element.getID() + "-relay", element.getRelay()));
            }
            return element;
        }else {
            return null;
        }
        
    },
    getVirtualCursor: function (source, id) {
        return this.get(source, id, "virtual");
    },
    addVirtualCursor: function (cursor) {
        return this.add(cursor);
    },
    removeVirtualCursor: function(cursor) {
        return this.remove(cursor);
    }
};


var MouseSimulator = (function() {
    var MOUSE_CURSOR_CLASS = "leap-mouse-cursor";
    return {
        cursorManager: null,
        mouseCursor: null,
        init: function(cursorManager, cursorConfig) {
            this.cursorManager = cursorManager;
            var icon = new LeapElement(document.createElement('div'));
            icon.addClass(MOUSE_CURSOR_CLASS);
            var cfg = {
                source: "mouse",
                id: 1,
                icon: icon
            };
            LeapManagerUtils.extendIf(cfg, cursorConfig);
            this.mouseCursor = new Cursor(cfg);
            this.enable();
        },
        enable: function() {
            this._onMouseMove = LeapManagerUtils.bind(this.onMouseMove, this);
            this._onMouseClick = LeapManagerUtils.bind(this.onMouseClick, this);
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('click', this._onMouseClick);
            this.cursorManager.add(this.mouseCursor);
        },
        disable: function() {
            if (!this.mouseCursor) return;
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('click', this._onMouseClick);
            this.cursorManager.remove(this.mouseCursor);
            this.mouseCursor = null;
        },
        update: function(x, y, z) {
            this.mouseCursor.update(x, y, z);
        },
        onMouseMove: function(event) {
            event = event || window.e;
            var x = 0,
                y = 0,
                z = 0;
            if (event.pageX || event.pageY) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = event.clientY + document.body.scollTop + document.documentElement.scrollTop;
            }
            x /= window.innerWidth;
            y /= window.innerHeight;
            z = this.currentZ;
            this.update(x, y, z);
        },
        onMouseClick: function(event) {}
    };
})();

var DualSwipe = function(firstGesture, secondGesture, direction) {
    this.firstGesture = firstGesture;
    this.secondGesture = secondGesture;
    this.direction = direction;
    this.type = "dual-swipe";
    this.state = "stop";
};

var LeapManager = (function() {
    'use strict';
    var LEAP_POINTABLE_CURSOR_CLASS = "leap-pointable-cursor";
    var LEAP_POINTABLE_VIRTUAL_CURSOR_CLASS = "leap-pointable-virtual-cursor";
    var LEAP_POINTABLE_VIRTUAL_SCROLLER_CURSOR_CLASS = "leap-pointable-virtual-scroller-cursor";
    var LEAP_SOURCE = "leap";
    var defaultConfig = {
        maxCursors: 1,
        useHands: false,
        enableTouchScrolling: false,
        enableScrollbarScrolling: true,
        enableHoverTap: true,
        enablePressDown: false,
        pressThreshold: 0,
        simulateWithMouse: false,
        enableInBackground: false,
        cacheQueries: true,
        enableMetaGestures: true,
        enableDefaultMetaGestureActions: true,
        metaGestureMaxDelay: 1200,
        greedySelector: null,
        cacheAllQueries: false,
        root: null,
        gestureCallback: null,
        gestureScope: null,
        frameCallback: null,
        interactiveSelector: null,
        enableSenchaTouch: false,
        boundary: {
            top: 350,
            left: -100,
            right: 100,
            bottom: 150
        },
        touchScrollingConfig: {
            scrollVector: {x:0, y:1, z:0},
            scrollMaxSpeed: 7,
            scrollMinSpeed: 2,
            scrollMaxDuration: 6
        },
        scrollbarScrollingConfig: {
            resetDelay: 1000, 
            scrollMaxSpeed: 7,
            scrollMinSpeed: 2,
            scrollMaxDuration: 6
        },
        cursorConfig: {
            multitapEnabled: false,
            clickDelay: 1000
        },
        mouseCursorConfig: {
            multitapEnabled: false,
            clickDelay: 1000
        },
        loopConfig: {
            enableGestures: true
        }
    };
    return {
        cursorManager: null,
        gestureHistory: {},
        init: function(config) {
            LeapManagerUtils.extendIf(config, defaultConfig);
            this.boundary = config.boundary;
            this.maxCursors = config.maxCursors;
            this.simulateWithMouse = config.simulateWithMouse;
            this.gestureCallback = config.gestureCallback;
            this.gestureScope = config.gestureScope;
            this.frameCallback = config.frameCallback;
            this.cursorConfig = config.cursorConfig;
            
            this.enableTouchScrolling = config.enableTouchScrolling;
            this.touchScrollingConfig = config.touchScrollingConfig;

            this.enableScrollbarScrolling = config.enableScrollbarScrolling;
            this.scrollbarScrollingConfig = config.scrollbarScrollingConfig;

            this.enableMetaGestures = config.enableMetaGestures;
            this.enableDefaultMetaGestureActions = config.enableDefaultMetaGestureActions;
            this.metaGestureMaxDelay = config.metaGestureMaxDelay || 500;

            this.useHands = config.useHands;

            //Sencha Touch Switch
            if (config.enableSenchaTouch) {
                if (config.interactiveSelector == null) {
                    config.interactiveSelector = "";
                } else {
                    config.interactiveSelector += ",";
                }
                config.interactiveSelector += ["a", ".x-tab", ".x-button", ".x-video-ghost", ".x-scroll-scroller", ".x-list-item"].join(",");
                config.untappableSelector = [".x-scroll-scroller"].join(", ");
            }
            this.cursorManager = new CursorManager({
                root: config.root,
                interactiveSelector: config.interactiveSelector,
                untappableSelector: config.untappableSelector,
                enableHoverTap: config.enableHoverTap,
                enablePressDown: config.enablePressDown,
                pressThreshold: config.pressThreshold,
                greedySelector: config.greedySelector,
                cacheAllQueries: config.cacheAllQueries
            });
            if (this.simulateWithMouse) MouseSimulator.init(this.cursorManager, config.mouseCursorConfig || {});
            //Active Tab/Window Checking
            var me = this;
            me.isActiveWindow = true;
            if (!config.enableInBackground) {
                window.addEventListener('blur', function() {
                    me.isActiveWindow = false;
                });
                window.addEventListener('focus', function() {
                    me.isActiveWindow = true;
                });
            }
            var callback = function(frame) {
                    me.onLoop(frame);
                };
            if(Leap !== null) Leap.loop(config.loopConfig, callback);
        },
        onLoop: function(frame) {
            if (!this.isActiveWindow) return;
            this.cursorManager.update();
            if(this.useHands) {
                this.updateHands(frame);
            }else {
                this.updatePointables(frame);
                this.updateGestures(frame);
            }
            if (this.frameCallback) {
                this.frameCallback.call(this, frame);
            }
        },
        updatePointables: function(frame) {
            var pointable, pointableIndex, cursor, posX, posY, posZ, cursorIndex, currentCursors = [];
            if (frame && frame.pointables) {
                for (pointableIndex = 0; pointableIndex < frame.pointables.length && pointableIndex < this.maxCursors; pointableIndex++) {
                    pointable = frame.pointables[pointableIndex];
                    if (pointable) {
                        posX = LeapManagerUtils.map(pointable.tipPosition[0], this.boundary.left, this.boundary.right, 0, 1);
                        posY = LeapManagerUtils.map(pointable.tipPosition[1], this.boundary.bottom, this.boundary.top, 1, 0);
                        posZ = pointable.tipPosition[2]; 
                        cursor = this.getCursor(pointable.id, {
                            x: posX,
                            y: posY,
                            z: posZ
                        });
                        currentCursors.push(cursor.id);
                        cursor.update(posX, posY, posZ);
                    }
                }
            }

            this.cursorManager.pruneCursors(LEAP_SOURCE, currentCursors);
        },
        updateHands: function(frame) {
            var hand, handIndex, cursor, posX, posY, posZ, cursorIndex, currentCursors = [];
            if (frame && frame.hands) {
                for (handIndex = 0; handIndex < frame.hands.length && handIndex < this.maxCursors; handIndex++) {
                    hand = frame.hands[handIndex];
                    if (hand) {
                        posX = LeapManagerUtils.map(hand.palmPosition[0], this.boundary.left, this.boundary.right, 0, 1);
                        posY = LeapManagerUtils.map(hand.palmPosition[1], this.boundary.bottom, this.boundary.top, 1, 0);
                        posZ = hand.palmPosition[2]; 
                        cursor = this.getCursor(
                            hand.id, 
                            {
                                x: posX,
                                y: posY,
                                z: posZ
                            }, 
                            true
                        );
                        currentCursors.push(cursor.id);
                        cursor.update(posX, posY, posZ, hand.fingers.length);
                    }
                }
            }

            this.cursorManager.pruneCursors(LEAP_SOURCE, currentCursors);
        },
        getCursor: function(id, position, isHand) {
            var cursor = this.cursorManager.get(LEAP_SOURCE, id);
            if (cursor) return cursor;

            var icon = new LeapElement(document.createElement('div'));
            icon.addClass(LEAP_POINTABLE_CURSOR_CLASS);
            var cfg = {
                source: LEAP_SOURCE,
                id: id,
                position: position,
                icon: icon
            };
            LeapManagerUtils.extend(cfg, this.cursorConfig);
            if(isHand) {
                cursor = new HandCursor(cfg);
            } else {
                cursor = new Cursor(cfg);
            }
            this.cursorManager.add(cursor);
            return cursor;
        },
        updateGestures: function(frame) {
            var me = this,
                cursor;

            if (frame.gestures.length > 0) {
                frame.gestures.forEach(function(gesture) {
                    if (gesture.pointableIds && gesture.pointableIds.length > 0) {
                        gesture.pointableIds.forEach(function(pointableId) {
                            cursor = me.cursorManager.get(LEAP_SOURCE, pointableId);
                            if (cursor instanceof Cursor) {

                                //Per Element Gesture Events
                                if (cursor.hasElement()) {
                                    var evt = document.createEvent("Event");
                                    evt.initEvent("leap-"+gesture.type, true, true);
                                    evt.state = gesture.state;
                                    evt.gesture = gesture;
                                    cursor.element.fireEvent(evt);

                                    evt = document.createEvent("Event");
                                    evt.initEvent("leap-"+gesture.type+"-"+gesture.state, true, true);
                                    evt.state = gesture.state;
                                    evt.gesture = gesture;
                                    cursor.element.fireEvent(evt);
                                }

                                //Catch-All Gesture Callback
                                if (me.gestureCallback) {
                                    me.gestureCallback.call(me.gestureScope || me, gesture);
                                }


                                //Scrolling Simulation
                                if((me.enableTouchScrolling || me.enableScrollbarScrolling) && gesture.type === "circle") {
                                    var position = {
                                        x: LeapManagerUtils.map(gesture.center[0], me.boundary.left, me.boundary.right, 0, 1),
                                        y: LeapManagerUtils.map(gesture.center[1], me.boundary.bottom, me.boundary.top, 1, 0),
                                        z: 0
                                    };

                                    var speed;
                                    var virtualSource = 'leap-scroller';
                                    var virtualCursor = me.cursorManager.getVirtualCursor(virtualSource, gesture.id);

                                    if(me.enableTouchScrolling) {
                                        if (gesture.state === "start") {
                                            cursor.disableTap();
                                            if(virtualCursor) {
                                                me.removeVirtualCursor(virtualCursor);
                                            }

                                            var icon = new LeapElement(document.createElement('div'));
                                            icon.addClass(LEAP_POINTABLE_CURSOR_CLASS);
                                            icon.addClass(LEAP_POINTABLE_VIRTUAL_CURSOR_CLASS);
                                            icon.addClass(LEAP_POINTABLE_VIRTUAL_SCROLLER_CURSOR_CLASS);
                                            var cfg = {
                                                source: virtualSource,
                                                id: gesture.id,
                                                position: position,
                                                icon: icon
                                            };

                                            cfg.virtualParent = cursor;
                                            virtualCursor = new Cursor(cfg);
                                            virtualCursor.onAdded = function() { 
                                                this.dispatchDown(); 
                                            };
                                            virtualCursor.onRemoved = function() { 
                                                this.setVelocityXYZ(0,0,0);
                                                this.dispatchUp(); 
                                            };

                                            me.cursorManager.addVirtualCursor(virtualCursor);

                                        } else if (gesture.state === "stop" && virtualCursor) {
                                            cursor.restartTap();
                                            me.cursorManager.removeVirtualCursor(virtualCursor);
                                        } else if(virtualCursor) {

                                            speed = LeapManagerUtils.map(
                                                gesture.duration/1000000, 
                                                0, me.touchScrollingConfig.scrollMaxDuration, 
                                                me.touchScrollingConfig.scrollMinSpeed, me.touchScrollingConfig.scrollMaxSpeed);


                                            if(gesture.normal[2] > 0) {
                                                virtualCursor.setVelocityXYZ(
                                                    speed * me.touchScrollingConfig.scrollVector.x,
                                                    speed * me.touchScrollingConfig.scrollVector.y,
                                                    speed * me.touchScrollingConfig.scrollVector.z
                                                );
                                            }else{
                                                virtualCursor.setVelocityXYZ(
                                                    speed * -me.touchScrollingConfig.scrollVector.x,
                                                    speed * -me.touchScrollingConfig.scrollVector.y,
                                                    speed * -me.touchScrollingConfig.scrollVector.z
                                                );
                                            }
                                            
                                            virtualCursor.dispatchMove();
                                        }
                                    } else if(me.enableScrollbarScrolling) {
                                        if (gesture.state === "start") {
                                            if(LeapManagerUtils.exists(cursor._lastElementTime)) {
                                                var timeDiff = new Date() - cursor._lastElementTime;
                                                if(timeDiff > me.scrollbarScrollingConfig.resetDelay) {
                                                    cursor._scrollElement = cursor.getElement();
                                                }
                                            }
                                            cursor._lastElementTime = new Date();

                                            if(cursor.getElement() && !LeapManagerUtils.exists(cursor._scrollElement)) {
                                                cursor._scrollElement = cursor.getElement();
                                            }
                                            
                                            if(LeapManagerUtils.exists(cursor._scrollElement)){
                                                cursor.disableTap();
                                            }
                                        } else if (gesture.state === "update") {
                                            if(LeapManagerUtils.exists(cursor._scrollElement)) {
                                                cursor._lastElementTime = new Date();
                                                speed = LeapManagerUtils.map(
                                                    gesture.duration/1000000, 
                                                    0, me.scrollbarScrollingConfig.scrollMaxDuration, 
                                                    me.scrollbarScrollingConfig.scrollMinSpeed, me.scrollbarScrollingConfig.scrollMaxSpeed);

                                                if(gesture.normal[2] > 0) {
                                                    cursor._scrollElement.scroll(-speed);
                                                } else {
                                                    cursor._scrollElement.scroll(speed);
                                                }
                                            }
                                        }else if(gesture.state === "end") {
                                            cursor.restartTap();
                                        }
                                    }
                                }
                            }
                        });
                    }

                    //Swipe MetaGesture Testing
                    if(me.enableMetaGestures && gesture.state === "stop" && gesture.type === "swipe") {
                        if(!(me.gestureHistory[gesture.type] instanceof Array)) me.gestureHistory[gesture.type] = [];
                        gesture.timestamp = new Date().getTime();

                        var i,
                            largest = 0,
                            largestIndex =0,
                            timeDiff = 0,
                            currentGesture,
                            ignoreZGestures = true,
                            previousGesture;
                        for (i = 0; i < (ignoreZGestures ? 2 : 3); i++) {
                            if(Math.abs(gesture.direction[i]) > largest) {
                                largest = Math.abs(gesture.direction[i]);
                                largestIndex = i;
                            }
                        }

                        if(largestIndex === 0) {
                            gesture._direction = gesture.direction[0] > 0 ? "right" : "left";
                        } else if(largestIndex === 1) {
                            gesture._direction = gesture.direction[1] > 0 ? "up" : "down";
                        }else {
                            gesture._direction = gesture.direction[2] > 0 ? "backward" : "forward";
                        }

                        me.gestureHistory[gesture.type].push(gesture);

                        if(me.gestureHistory[gesture.type].length === 2) {
                            previousGesture = me.gestureHistory[gesture.type][0];
                            if(gesture._direction === previousGesture._direction) {
                                timeDiff = gesture.timestamp - previousGesture.timestamp;
                                if(timeDiff < me.metaGestureMaxDelay) {
                                    var dualSwipe = new DualSwipe(gesture, previousGesture, gesture._direction);

                                    //Catch-All Gesture Callback
                                    if (me.gestureCallback) {
                                        me.gestureCallback.call(me.gestureScope || me, dualSwipe);
                                    }

                                    //MetaEvents are fired on the Body
                                    var evt = document.createEvent("Event");
                                    evt.initEvent("leap-"+dualSwipe.type, true, true);
                                    evt.state = gesture.state;
                                    evt.gesture = dualSwipe;
                                    document.body.dispatchEvent(evt);

                                    //Default Actions
                                    if(me.enableDefaultMetaGestureActions) {
                                        switch(dualSwipe.direction) {
                                            case "left":
                                                history.back();
                                                break;
                                            case "right":
                                                history.forward();
                                                break;
                                            case "up":
                                                break;
                                            case "down":
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        while(me.gestureHistory[gesture.type].length > 1) {
                            me.gestureHistory[gesture.type].shift();
                        }
                    }
                });
            }
        }
    };
})();
