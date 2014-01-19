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
