import { n as __toESM, t as __commonJSMin } from "./chunk-BVTlhY3a.js";
import { t as require_react } from "./react.js";
//#region node_modules/react/cjs/react-jsx-runtime.development.js
/**
* @license React
* react-jsx-runtime.development.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		function getComponentNameFromType(type) {
			if (null == type) return null;
			if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
			if ("string" === typeof type) return type;
			switch (type) {
				case REACT_FRAGMENT_TYPE: return "Fragment";
				case REACT_PROFILER_TYPE: return "Profiler";
				case REACT_STRICT_MODE_TYPE: return "StrictMode";
				case REACT_SUSPENSE_TYPE: return "Suspense";
				case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
				case REACT_ACTIVITY_TYPE: return "Activity";
			}
			if ("object" === typeof type) switch ("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
				case REACT_PORTAL_TYPE: return "Portal";
				case REACT_CONTEXT_TYPE: return type.displayName || "Context";
				case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
				case REACT_FORWARD_REF_TYPE:
					var innerType = type.render;
					type = type.displayName;
					type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
					return type;
				case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
				case REACT_LAZY_TYPE:
					innerType = type._payload;
					type = type._init;
					try {
						return getComponentNameFromType(type(innerType));
					} catch (x) {}
			}
			return null;
		}
		function testStringCoercion(value) {
			return "" + value;
		}
		function checkKeyStringCoercion(value) {
			try {
				testStringCoercion(value);
				var JSCompiler_inline_result = !1;
			} catch (e) {
				JSCompiler_inline_result = !0;
			}
			if (JSCompiler_inline_result) {
				JSCompiler_inline_result = console;
				var JSCompiler_temp_const = JSCompiler_inline_result.error;
				var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
				JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
				return testStringCoercion(value);
			}
		}
		function getTaskName(type) {
			if (type === REACT_FRAGMENT_TYPE) return "<>";
			if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
			try {
				var name = getComponentNameFromType(type);
				return name ? "<" + name + ">" : "<...>";
			} catch (x) {
				return "<...>";
			}
		}
		function getOwner() {
			var dispatcher = ReactSharedInternals.A;
			return null === dispatcher ? null : dispatcher.getOwner();
		}
		function UnknownOwner() {
			return Error("react-stack-top-frame");
		}
		function hasValidKey(config) {
			if (hasOwnProperty.call(config, "key")) {
				var getter = Object.getOwnPropertyDescriptor(config, "key").get;
				if (getter && getter.isReactWarning) return !1;
			}
			return void 0 !== config.key;
		}
		function defineKeyPropWarningGetter(props, displayName) {
			function warnAboutAccessingKey() {
				specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
			}
			warnAboutAccessingKey.isReactWarning = !0;
			Object.defineProperty(props, "key", {
				get: warnAboutAccessingKey,
				configurable: !0
			});
		}
		function elementRefGetterWithDeprecationWarning() {
			var componentName = getComponentNameFromType(this.type);
			didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
			componentName = this.props.ref;
			return void 0 !== componentName ? componentName : null;
		}
		function ReactElement(type, key, props, owner, debugStack, debugTask) {
			var refProp = props.ref;
			type = {
				$$typeof: REACT_ELEMENT_TYPE,
				type,
				key,
				props,
				_owner: owner
			};
			null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
				enumerable: !1,
				get: elementRefGetterWithDeprecationWarning
			}) : Object.defineProperty(type, "ref", {
				enumerable: !1,
				value: null
			});
			type._store = {};
			Object.defineProperty(type._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			});
			Object.defineProperty(type, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			});
			Object.defineProperty(type, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: debugStack
			});
			Object.defineProperty(type, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: debugTask
			});
			Object.freeze && (Object.freeze(type.props), Object.freeze(type));
			return type;
		}
		function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
			var children = config.children;
			if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
				for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++) validateChildKeys(children[isStaticChildren]);
				Object.freeze && Object.freeze(children);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else validateChildKeys(children);
			if (hasOwnProperty.call(config, "key")) {
				children = getComponentNameFromType(type);
				var keys = Object.keys(config).filter(function(k) {
					return "key" !== k;
				});
				isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
				didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
			}
			children = null;
			void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
			hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
			if ("key" in config) {
				maybeKey = {};
				for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
			} else maybeKey = config;
			children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
			return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
		}
		function validateChildKeys(node) {
			isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
		}
		function isValidElement(object) {
			return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		var React = require_react(), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
			return null;
		};
		React = { react_stack_bottom_frame: function(callStackForError) {
			return callStackForError();
		} };
		var specialPropKeyWarningShown;
		var didWarnAboutElementRef = {};
		var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
		var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
		var didWarnAboutKeySpread = {};
		exports.Fragment = REACT_FRAGMENT_TYPE;
		exports.jsx = function(type, config, maybeKey) {
			var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
			return jsxDEVImpl(type, config, maybeKey, !1, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
		};
		exports.jsxs = function(type, config, maybeKey) {
			var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
			return jsxDEVImpl(type, config, maybeKey, !0, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
		};
	})();
}));
//#endregion
//#region node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_development();
}));
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/mimic-function/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
	if (property === "length" || property === "prototype") return;
	if (property === "arguments" || property === "caller") return;
	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) return;
	Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
	return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) return;
	Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
	const withName = name === "" ? "" : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	Object.defineProperty(newToString, "name", toStringName);
	const { writable, enumerable, configurable } = toStringDescriptor;
	Object.defineProperty(to, "toString", {
		value: newToString,
		writable,
		enumerable,
		configurable
	});
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
	const { name } = to;
	for (const property of Reflect.ownKeys(from)) copyProperty(to, from, property, ignoreNonConfigurable);
	changePrototype(to, from);
	changeToString(to, from, name);
	return to;
}
//#endregion
//#region node_modules/memoize/distribution/index.js
var maxTimeoutValue = 2147483647;
var cacheStore = /* @__PURE__ */ new WeakMap();
var cacheTimerStore = /* @__PURE__ */ new WeakMap();
var cacheKeyStore = /* @__PURE__ */ new WeakMap();
function getValidCacheItem(cache, key) {
	const item = cache.get(key);
	if (!item) return;
	if (item.maxAge <= Date.now()) {
		cache.delete(key);
		return;
	}
	return item;
}
/**
[Memoize](https://en.wikipedia.org/wiki/Memoization) functions - An optimization used to speed up consecutive function calls by caching the result of calls with identical input.

@param function_ - The function to be memoized.

@example
```
import memoize from 'memoize';

let index = 0;
const counter = () => ++index;
const memoized = memoize(counter);

memoized('foo');
//=> 1

// Cached as it's the same argument
memoized('foo');
//=> 1

// Not cached anymore as the arguments changed
memoized('bar');
//=> 2

memoized('bar');
//=> 2
```
*/
function memoize(function_, { cacheKey, cache = /* @__PURE__ */ new Map(), maxAge } = {}) {
	if (maxAge === 0) return function_;
	if (typeof maxAge === "number" && Number.isFinite(maxAge)) {
		if (maxAge > maxTimeoutValue) throw new TypeError(`The \`maxAge\` option cannot exceed ${maxTimeoutValue}.`);
		if (maxAge < 0) throw new TypeError("The `maxAge` option should not be a negative number.");
	}
	const memoized = function(...arguments_) {
		const key = cacheKey ? cacheKey(arguments_) : arguments_[0];
		const cacheItem = getValidCacheItem(cache, key);
		if (cacheItem) return cacheItem.data;
		const result = function_.apply(this, arguments_);
		const computedMaxAge = typeof maxAge === "function" ? maxAge(...arguments_) : maxAge;
		if (computedMaxAge !== void 0 && computedMaxAge !== Number.POSITIVE_INFINITY) {
			if (!Number.isFinite(computedMaxAge)) throw new TypeError("The `maxAge` function must return a finite number, `0`, or `Infinity`.");
			if (computedMaxAge <= 0) return result;
			if (computedMaxAge > maxTimeoutValue) throw new TypeError(`The \`maxAge\` function result cannot exceed ${maxTimeoutValue}.`);
		}
		cache.set(key, {
			data: result,
			maxAge: computedMaxAge === void 0 || computedMaxAge === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Date.now() + computedMaxAge
		});
		if (computedMaxAge !== void 0 && computedMaxAge !== Number.POSITIVE_INFINITY) {
			const timer = setTimeout(() => {
				cache.delete(key);
				cacheTimerStore.get(memoized)?.delete(timer);
			}, computedMaxAge);
			timer.unref?.();
			const timers = cacheTimerStore.get(memoized) ?? /* @__PURE__ */ new Set();
			timers.add(timer);
			cacheTimerStore.set(memoized, timers);
		}
		return result;
	};
	mimicFunction(memoized, function_, { ignoreNonConfigurable: true });
	cacheStore.set(memoized, cache);
	cacheKeyStore.set(memoized, cacheKey ?? ((arguments_) => arguments_[0]));
	return memoized;
}
//#endregion
//#region node_modules/get-user-locale/dist/index.js
function isString(el) {
	return typeof el === "string";
}
function isUnique(el, index, arr) {
	return arr.indexOf(el) === index;
}
function isAllLowerCase(el) {
	return el.toLowerCase() === el;
}
function fixCommas(el) {
	return el.indexOf(",") === -1 ? el : el.split(",");
}
function normalizeLocale(locale) {
	if (!locale) return locale;
	if (locale === "C" || locale === "posix" || locale === "POSIX") return "en-US";
	if (locale.indexOf(".") !== -1) {
		var _a = locale.split(".")[0], actualLocale = _a === void 0 ? "" : _a;
		return normalizeLocale(actualLocale);
	}
	if (locale.indexOf("@") !== -1) {
		var _b = locale.split("@")[0], actualLocale = _b === void 0 ? "" : _b;
		return normalizeLocale(actualLocale);
	}
	if (locale.indexOf("-") === -1 || !isAllLowerCase(locale)) return locale;
	var _c = locale.split("-"), splitEl1 = _c[0], _d = _c[1], splitEl2 = _d === void 0 ? "" : _d;
	return "".concat(splitEl1, "-").concat(splitEl2.toUpperCase());
}
function getUserLocalesInternal(_a) {
	var _b = _a === void 0 ? {} : _a, _c = _b.useFallbackLocale, useFallbackLocale = _c === void 0 ? true : _c, _d = _b.fallbackLocale, fallbackLocale = _d === void 0 ? "en-US" : _d;
	var languageList = [];
	if (typeof navigator !== "undefined") {
		var rawLanguages = navigator.languages || [];
		var languages = [];
		for (var _i = 0, rawLanguages_1 = rawLanguages; _i < rawLanguages_1.length; _i++) {
			var rawLanguagesItem = rawLanguages_1[_i];
			languages = languages.concat(fixCommas(rawLanguagesItem));
		}
		var rawLanguage = navigator.language;
		var language = rawLanguage ? fixCommas(rawLanguage) : rawLanguage;
		languageList = languageList.concat(languages, language);
	}
	if (useFallbackLocale) languageList.push(fallbackLocale);
	return languageList.filter(isString).map(normalizeLocale).filter(isUnique);
}
var getUserLocales = memoize(getUserLocalesInternal, { cacheKey: JSON.stringify });
function getUserLocaleInternal(options) {
	return getUserLocales(options)[0] || null;
}
var getUserLocale = memoize(getUserLocaleInternal, { cacheKey: JSON.stringify });
//#endregion
//#region node_modules/@wojtekmaj/date-utils/dist/index.js
/**
* Utils
*/
function makeGetEdgeOfNeighbor(getPeriod, getEdgeOfPeriod, defaultOffset) {
	return function makeGetEdgeOfNeighborInternal(date, offset = defaultOffset) {
		return getEdgeOfPeriod(getPeriod(date) + offset);
	};
}
function makeGetEnd(getBeginOfNextPeriod) {
	return function makeGetEndInternal(date) {
		return /* @__PURE__ */ new Date(getBeginOfNextPeriod(date).getTime() - 1);
	};
}
function makeGetRange(getStart, getEnd) {
	return function makeGetRangeInternal(date) {
		return [getStart(date), getEnd(date)];
	};
}
/**
* Simple getters - getting a property of a given point in time
*/
/**
* Gets year from a given date.
*
* @param {DateLike} date Date to get year from
* @returns {number} Year
*/
function getYear(date) {
	if (date instanceof Date) return date.getFullYear();
	if (typeof date === "number") return date;
	const year = Number.parseInt(date, 10);
	if (typeof date === "string" && !Number.isNaN(year)) return year;
	throw new Error(`Failed to get year from date: ${date}.`);
}
/**
* Gets month from a given date.
*
* @param {Date} date Date to get month from
* @returns {number} Month
*/
function getMonth(date) {
	if (date instanceof Date) return date.getMonth();
	throw new Error(`Failed to get month from date: ${date}.`);
}
/**
* Gets day of the month from a given date.
*
* @param {Date} date Date to get day of the month from
* @returns {number} Day of the month
*/
function getDate(date) {
	if (date instanceof Date) return date.getDate();
	throw new Error(`Failed to get year from date: ${date}.`);
}
/**
* Century
*/
/**
* Gets century start date from a given date.
*
* @param {DateLike} date Date to get century start from
* @returns {Date} Century start date
*/
function getCenturyStart(date) {
	const year = getYear(date);
	const centuryStartYear = year + (-year + 1) % 100;
	const centuryStartDate = /* @__PURE__ */ new Date();
	centuryStartDate.setFullYear(centuryStartYear, 0, 1);
	centuryStartDate.setHours(0, 0, 0, 0);
	return centuryStartDate;
}
/**
* Gets previous century start date from a given date.
*
* @param {DateLike} date Date to get previous century start from
* @param {number} [offset=-100] Offset in years to calculate previous century start from
* @returns {Date} Previous century start date
*/
var getPreviousCenturyStart = makeGetEdgeOfNeighbor(getYear, getCenturyStart, -100);
/**
* Gets next century start date from a given date.
*
* @param {DateLike} date Date to get next century start from
* @param {number} [offset=100] Offset in years to calculate next century start from
* @returns {Date} Next century start date
*/
var getNextCenturyStart = makeGetEdgeOfNeighbor(getYear, getCenturyStart, 100);
/**
* Gets century end date from a given date.
*
* @param {DateLike} date Date to get century end from
* @returns {Date} Century end date
*/
var getCenturyEnd = makeGetEnd(getNextCenturyStart);
/**
* Gets previous century end date from a given date.
*
* @param {DateLike} date Date to get previous century end from
* @param {number} [offset=-100] Offset in years to calculate previous century end from
* @returns {Date} Previous century end date
*/
var getPreviousCenturyEnd = makeGetEdgeOfNeighbor(getYear, getCenturyEnd, -100);
makeGetEdgeOfNeighbor(getYear, getCenturyEnd, 100);
/**
* Gets century start and end dates from a given date.
*
* @param {DateLike} date Date to get century start and end from
* @returns {[Date, Date]} Century start and end dates
*/
var getCenturyRange = makeGetRange(getCenturyStart, getCenturyEnd);
/**
* Decade
*/
/**
* Gets decade start date from a given date.
*
* @param {DateLike} date Date to get decade start from
* @returns {Date} Decade start date
*/
function getDecadeStart(date) {
	const year = getYear(date);
	const decadeStartYear = year + (-year + 1) % 10;
	const decadeStartDate = /* @__PURE__ */ new Date();
	decadeStartDate.setFullYear(decadeStartYear, 0, 1);
	decadeStartDate.setHours(0, 0, 0, 0);
	return decadeStartDate;
}
/**
* Gets previous decade start date from a given date.
*
* @param {DateLike} date Date to get previous decade start from
* @param {number} [offset=-10] Offset in years to calculate previous decade start from
* @returns {Date} Previous decade start date
*/
var getPreviousDecadeStart = makeGetEdgeOfNeighbor(getYear, getDecadeStart, -10);
/**
* Gets next decade start date from a given date.
*
* @param {DateLike} date Date to get next decade start from
* @param {number} [offset=10] Offset in years to calculate next decade start from
* @returns {Date} Next decade start date
*/
var getNextDecadeStart = makeGetEdgeOfNeighbor(getYear, getDecadeStart, 10);
/**
* Gets decade end date from a given date.
*
* @param {DateLike} date Date to get decade end from
* @returns {Date} Decade end date
*/
var getDecadeEnd = makeGetEnd(getNextDecadeStart);
/**
* Gets previous decade end date from a given date.
*
* @param {DateLike} date Date to get previous decade end from
* @param {number} [offset=-10] Offset in years to calculate previous decade end from
* @returns {Date} Previous decade end date
*/
var getPreviousDecadeEnd = makeGetEdgeOfNeighbor(getYear, getDecadeEnd, -10);
makeGetEdgeOfNeighbor(getYear, getDecadeEnd, 10);
/**
* Gets decade start and end dates from a given date.
*
* @param {DateLike} date Date to get decade start and end from
* @returns {[Date, Date]} Decade start and end dates
*/
var getDecadeRange = makeGetRange(getDecadeStart, getDecadeEnd);
/**
* Year
*/
/**
* Gets year start date from a given date.
*
* @param {DateLike} date Date to get year start from
* @returns {Date} Year start date
*/
function getYearStart(date) {
	const year = getYear(date);
	const yearStartDate = /* @__PURE__ */ new Date();
	yearStartDate.setFullYear(year, 0, 1);
	yearStartDate.setHours(0, 0, 0, 0);
	return yearStartDate;
}
/**
* Gets previous year start date from a given date.
*
* @param {DateLike} date Date to get previous year start from
* @param {number} [offset=-1] Offset in years to calculate previous year start from
* @returns {Date} Previous year start date
*/
var getPreviousYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, -1);
/**
* Gets next year start date from a given date.
*
* @param {DateLike} date Date to get next year start from
* @param {number} [offset=1] Offset in years to calculate next year start from
* @returns {Date} Next year start date
*/
var getNextYearStart = makeGetEdgeOfNeighbor(getYear, getYearStart, 1);
/**
* Gets year end date from a given date.
*
* @param {DateLike} date Date to get year end from
* @returns {Date} Year end date
*/
var getYearEnd = makeGetEnd(getNextYearStart);
/**
* Gets previous year end date from a given date.
*
* @param {DateLike} date Date to get previous year end from
* @param {number} [offset=-1] Offset in years to calculate previous year end from
* @returns {Date} Previous year end date
*/
var getPreviousYearEnd = makeGetEdgeOfNeighbor(getYear, getYearEnd, -1);
makeGetEdgeOfNeighbor(getYear, getYearEnd, 1);
/**
* Gets year start and end dates from a given date.
*
* @param {DateLike} date Date to get year start and end from
* @returns {[Date, Date]} Year start and end dates
*/
var getYearRange = makeGetRange(getYearStart, getYearEnd);
/**
* Month
*/
function makeGetEdgeOfNeighborMonth(getEdgeOfPeriod, defaultOffset) {
	return function makeGetEdgeOfNeighborMonthInternal(date, offset = defaultOffset) {
		const year = getYear(date);
		const month = getMonth(date) + offset;
		const previousPeriod = /* @__PURE__ */ new Date();
		previousPeriod.setFullYear(year, month, 1);
		previousPeriod.setHours(0, 0, 0, 0);
		return getEdgeOfPeriod(previousPeriod);
	};
}
/**
* Gets month start date from a given date.
*
* @param {DateLike} date Date to get month start from
* @returns {Date} Month start date
*/
function getMonthStart(date) {
	const year = getYear(date);
	const month = getMonth(date);
	const monthStartDate = /* @__PURE__ */ new Date();
	monthStartDate.setFullYear(year, month, 1);
	monthStartDate.setHours(0, 0, 0, 0);
	return monthStartDate;
}
/**
* Gets previous month start date from a given date.
*
* @param {Date} date Date to get previous month start from
* @param {number} [offset=-1] Offset in months to calculate previous month start from
* @returns {Date} Previous month start date
*/
var getPreviousMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, -1);
/**
* Gets next month start date from a given date.
*
* @param {Date} date Date to get next month start from
* @param {number} [offset=1] Offset in months to calculate next month start from
* @returns {Date} Next month start date
*/
var getNextMonthStart = makeGetEdgeOfNeighborMonth(getMonthStart, 1);
/**
* Gets month end date from a given date.
*
* @param {Date} date Date to get month end from
* @returns {Date} Month end date
*/
var getMonthEnd = makeGetEnd(getNextMonthStart);
/**
* Gets previous month end date from a given date.
*
* @param {Date} date Date to get previous month end from
* @param {number} [offset=-1] Offset in months to calculate previous month end from
* @returns {Date} Previous month end date
*/
var getPreviousMonthEnd = makeGetEdgeOfNeighborMonth(getMonthEnd, -1);
makeGetEdgeOfNeighborMonth(getMonthEnd, 1);
/**
* Gets month start and end dates from a given date.
*
* @param {Date} date Date to get month start and end from
* @returns {[Date, Date]} Month start and end dates
*/
var getMonthRange = makeGetRange(getMonthStart, getMonthEnd);
/**
* Day
*/
function makeGetEdgeOfNeighborDay(getEdgeOfPeriod, defaultOffset) {
	return function makeGetEdgeOfNeighborDayInternal(date, offset = defaultOffset) {
		const year = getYear(date);
		const month = getMonth(date);
		const day = getDate(date) + offset;
		const previousPeriod = /* @__PURE__ */ new Date();
		previousPeriod.setFullYear(year, month, day);
		previousPeriod.setHours(0, 0, 0, 0);
		return getEdgeOfPeriod(previousPeriod);
	};
}
/**
* Gets day start date from a given date.
*
* @param {DateLike} date Date to get day start from
* @returns {Date} Day start date
*/
function getDayStart(date) {
	const year = getYear(date);
	const month = getMonth(date);
	const day = getDate(date);
	const dayStartDate = /* @__PURE__ */ new Date();
	dayStartDate.setFullYear(year, month, day);
	dayStartDate.setHours(0, 0, 0, 0);
	return dayStartDate;
}
makeGetEdgeOfNeighborDay(getDayStart, -1);
/**
* Gets day end date from a given date.
*
* @param {Date} date Date to get day end from
* @returns {Date} Day end date
*/
var getDayEnd = makeGetEnd(makeGetEdgeOfNeighborDay(getDayStart, 1));
makeGetEdgeOfNeighborDay(getDayEnd, -1);
makeGetEdgeOfNeighborDay(getDayEnd, 1);
/**
* Gets day start and end dates from a given date.
*
* @param {DateLike} date Date to get day start and end from
* @returns {[Date, Date]} Day start and end dates
*/
var getDayRange = makeGetRange(getDayStart, getDayEnd);
/**
* Other
*/
/**
* Returns a number of days in a month of a given date.
*
* @param {Date} date Date
* @returns {number} Number of days in a month
*/
function getDaysInMonth(date) {
	return getDate(getMonthEnd(date));
}
//#endregion
//#region node_modules/react-calendar/dist/shared/const.js
var CALENDAR_TYPES = {
	GREGORY: "gregory",
	HEBREW: "hebrew",
	ISLAMIC: "islamic",
	ISO_8601: "iso8601"
};
var CALENDAR_TYPE_LOCALES = {
	gregory: [
		"en-CA",
		"en-US",
		"es-AR",
		"es-BO",
		"es-CL",
		"es-CO",
		"es-CR",
		"es-DO",
		"es-EC",
		"es-GT",
		"es-HN",
		"es-MX",
		"es-NI",
		"es-PA",
		"es-PE",
		"es-PR",
		"es-SV",
		"es-VE",
		"pt-BR"
	],
	hebrew: ["he", "he-IL"],
	islamic: [
		"ar",
		"ar-AE",
		"ar-BH",
		"ar-DZ",
		"ar-EG",
		"ar-IQ",
		"ar-JO",
		"ar-KW",
		"ar-LY",
		"ar-OM",
		"ar-QA",
		"ar-SA",
		"ar-SD",
		"ar-SY",
		"ar-YE",
		"dv",
		"dv-MV",
		"ps",
		"ps-AR"
	]
};
var WEEKDAYS = [
	0,
	1,
	2,
	3,
	4,
	5,
	6
];
//#endregion
//#region node_modules/react-calendar/dist/shared/dateFormatter.js
var formatterCache = /* @__PURE__ */ new Map();
function getFormatter(options) {
	return function formatter(locale, date) {
		var localeWithDefault = locale || getUserLocale();
		if (!formatterCache.has(localeWithDefault)) formatterCache.set(localeWithDefault, /* @__PURE__ */ new Map());
		var formatterCacheLocale = formatterCache.get(localeWithDefault);
		if (!formatterCacheLocale.has(options)) formatterCacheLocale.set(options, new Intl.DateTimeFormat(localeWithDefault || void 0, options).format);
		return formatterCacheLocale.get(options)(date);
	};
}
/**
* Changes the hour in a Date to ensure right date formatting even if DST is messed up.
* Workaround for bug in WebKit and Firefox with historical dates.
* For more details, see:
* https://bugs.chromium.org/p/chromium/issues/detail?id=750465
* https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
*
* @param {Date} date Date.
* @returns {Date} Date with hour set to 12.
*/
function toSafeHour(date) {
	var safeDate = new Date(date);
	return new Date(safeDate.setHours(12));
}
function getSafeFormatter(options) {
	return function(locale, date) {
		return getFormatter(options)(locale, toSafeHour(date));
	};
}
var formatDateOptions = {
	day: "numeric",
	month: "numeric",
	year: "numeric"
};
var formatDayOptions = { day: "numeric" };
var formatLongDateOptions = {
	day: "numeric",
	month: "long",
	year: "numeric"
};
var formatMonthOptions = { month: "long" };
var formatMonthYearOptions = {
	month: "long",
	year: "numeric"
};
var formatShortWeekdayOptions = { weekday: "short" };
var formatWeekdayOptions = { weekday: "long" };
var formatYearOptions = { year: "numeric" };
getSafeFormatter(formatDateOptions);
var formatDay = getSafeFormatter(formatDayOptions);
var formatLongDate = getSafeFormatter(formatLongDateOptions);
var formatMonth = getSafeFormatter(formatMonthOptions);
var formatMonthYear = getSafeFormatter(formatMonthYearOptions);
var formatShortWeekday = getSafeFormatter(formatShortWeekdayOptions);
var formatWeekday = getSafeFormatter(formatWeekdayOptions);
var formatYear = getSafeFormatter(formatYearOptions);
//#endregion
//#region node_modules/react-calendar/dist/shared/dates.js
var SUNDAY = WEEKDAYS[0];
var FRIDAY = WEEKDAYS[5];
var SATURDAY = WEEKDAYS[6];
/**
* Gets day of the week of a given date.
* @param {Date} date Date.
* @param {CalendarType} [calendarType="iso8601"] Calendar type.
* @returns {number} Day of the week.
*/
function getDayOfWeek(date, calendarType) {
	if (calendarType === void 0) calendarType = CALENDAR_TYPES.ISO_8601;
	var weekday = date.getDay();
	switch (calendarType) {
		case CALENDAR_TYPES.ISO_8601: return (weekday + 6) % 7;
		case CALENDAR_TYPES.ISLAMIC: return (weekday + 1) % 7;
		case CALENDAR_TYPES.HEBREW:
		case CALENDAR_TYPES.GREGORY: return weekday;
		default: throw new Error("Unsupported calendar type.");
	}
}
/**
* Century
*/
/**
* Gets the year of the beginning of a century of a given date.
* @param {Date} date Date.
* @returns {number} Year of the beginning of a century.
*/
function getBeginOfCenturyYear(date) {
	return getYear(getCenturyStart(date));
}
/**
* Decade
*/
/**
* Gets the year of the beginning of a decade of a given date.
* @param {Date} date Date.
* @returns {number} Year of the beginning of a decade.
*/
function getBeginOfDecadeYear(date) {
	return getYear(getDecadeStart(date));
}
/**
* Week
*/
/**
* Returns the beginning of a given week.
*
* @param {Date} date Date.
* @param {CalendarType} [calendarType="iso8601"] Calendar type.
* @returns {Date} Beginning of a given week.
*/
function getBeginOfWeek(date, calendarType) {
	if (calendarType === void 0) calendarType = CALENDAR_TYPES.ISO_8601;
	var year = getYear(date);
	var monthIndex = getMonth(date);
	var day = date.getDate() - getDayOfWeek(date, calendarType);
	return new Date(year, monthIndex, day);
}
/**
* Gets week number according to ISO 8601 or US standard.
* In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
* In US calendar week 1 is the one with January 1.
*
* @param {Date} date Date.
* @param {CalendarType} [calendarType="iso8601"] Calendar type.
* @returns {number} Week number.
*/
function getWeekNumber(date, calendarType) {
	if (calendarType === void 0) calendarType = CALENDAR_TYPES.ISO_8601;
	var calendarTypeForWeekNumber = calendarType === CALENDAR_TYPES.GREGORY ? CALENDAR_TYPES.GREGORY : CALENDAR_TYPES.ISO_8601;
	var beginOfWeek = getBeginOfWeek(date, calendarType);
	var year = getYear(date) + 1;
	var dayInWeekOne;
	var beginOfFirstWeek;
	do {
		dayInWeekOne = new Date(year, 0, calendarTypeForWeekNumber === CALENDAR_TYPES.ISO_8601 ? 4 : 1);
		beginOfFirstWeek = getBeginOfWeek(dayInWeekOne, calendarType);
		year -= 1;
	} while (date < beginOfFirstWeek);
	return Math.round((beginOfWeek.getTime() - beginOfFirstWeek.getTime()) / (864e5 * 7)) + 1;
}
/**
* Others
*/
/**
* Returns the beginning of a given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date} Beginning of a given range.
*/
function getBegin(rangeType, date) {
	switch (rangeType) {
		case "century": return getCenturyStart(date);
		case "decade": return getDecadeStart(date);
		case "year": return getYearStart(date);
		case "month": return getMonthStart(date);
		case "day": return getDayStart(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Returns the beginning of a previous given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date} Beginning of a previous given range.
*/
function getBeginPrevious(rangeType, date) {
	switch (rangeType) {
		case "century": return getPreviousCenturyStart(date);
		case "decade": return getPreviousDecadeStart(date);
		case "year": return getPreviousYearStart(date);
		case "month": return getPreviousMonthStart(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Returns the beginning of a next given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date} Beginning of a next given range.
*/
function getBeginNext(rangeType, date) {
	switch (rangeType) {
		case "century": return getNextCenturyStart(date);
		case "decade": return getNextDecadeStart(date);
		case "year": return getNextYearStart(date);
		case "month": return getNextMonthStart(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
function getBeginPrevious2(rangeType, date) {
	switch (rangeType) {
		case "decade": return getPreviousDecadeStart(date, -100);
		case "year": return getPreviousYearStart(date, -10);
		case "month": return getPreviousMonthStart(date, -12);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
function getBeginNext2(rangeType, date) {
	switch (rangeType) {
		case "decade": return getNextDecadeStart(date, 100);
		case "year": return getNextYearStart(date, 10);
		case "month": return getNextMonthStart(date, 12);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Returns the end of a given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date} End of a given range.
*/
function getEnd(rangeType, date) {
	switch (rangeType) {
		case "century": return getCenturyEnd(date);
		case "decade": return getDecadeEnd(date);
		case "year": return getYearEnd(date);
		case "month": return getMonthEnd(date);
		case "day": return getDayEnd(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Returns the end of a previous given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date} End of a previous given range.
*/
function getEndPrevious(rangeType, date) {
	switch (rangeType) {
		case "century": return getPreviousCenturyEnd(date);
		case "decade": return getPreviousDecadeEnd(date);
		case "year": return getPreviousYearEnd(date);
		case "month": return getPreviousMonthEnd(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
function getEndPrevious2(rangeType, date) {
	switch (rangeType) {
		case "decade": return getPreviousDecadeEnd(date, -100);
		case "year": return getPreviousYearEnd(date, -10);
		case "month": return getPreviousMonthEnd(date, -12);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Returns an array with the beginning and the end of a given range.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date Date.
* @returns {Date[]} Beginning and end of a given range.
*/
function getRange(rangeType, date) {
	switch (rangeType) {
		case "century": return getCenturyRange(date);
		case "decade": return getDecadeRange(date);
		case "year": return getYearRange(date);
		case "month": return getMonthRange(date);
		case "day": return getDayRange(date);
		default: throw new Error("Invalid rangeType: ".concat(rangeType));
	}
}
/**
* Creates a range out of two values, ensuring they are in order and covering entire period ranges.
*
* @param {RangeType} rangeType Range type (e.g. 'day')
* @param {Date} date1 First date.
* @param {Date} date2 Second date.
* @returns {Date[]} Beginning and end of a given range.
*/
function getValueRange(rangeType, date1, date2) {
	var rawNextValue = [date1, date2].sort(function(a, b) {
		return a.getTime() - b.getTime();
	});
	return [getBegin(rangeType, rawNextValue[0]), getEnd(rangeType, rawNextValue[1])];
}
function toYearLabel(locale, formatYear$4, dates) {
	return dates.map(function(date) {
		return (formatYear$4 || formatYear)(locale, date);
	}).join(" – ");
}
/**
* @callback FormatYear
* @param {string} locale Locale.
* @param {Date} date Date.
* @returns {string} Formatted year.
*/
/**
* Returns a string labelling a century of a given date.
* For example, for 2017 it will return 2001-2100.
*
* @param {string} locale Locale.
* @param {FormatYear} formatYear Function to format a year.
* @param {Date|string|number} date Date or a year as a string or as a number.
* @returns {string} String labelling a century of a given date.
*/
function getCenturyLabel(locale, formatYear, date) {
	return toYearLabel(locale, formatYear, getCenturyRange(date));
}
/**
* Returns a string labelling a decade of a given date.
* For example, for 2017 it will return 2011-2020.
*
* @param {string} locale Locale.
* @param {FormatYear} formatYear Function to format a year.
* @param {Date|string|number} date Date or a year as a string or as a number.
* @returns {string} String labelling a decade of a given date.
*/
function getDecadeLabel(locale, formatYear, date) {
	return toYearLabel(locale, formatYear, getDecadeRange(date));
}
/**
* Returns a boolean determining whether a given date is the current day of the week.
*
* @param {Date} date Date.
* @returns {boolean} Whether a given date is the current day of the week.
*/
function isCurrentDayOfWeek(date) {
	return date.getDay() === (/* @__PURE__ */ new Date()).getDay();
}
/**
* Returns a boolean determining whether a given date is a weekend day.
*
* @param {Date} date Date.
* @param {CalendarType} [calendarType="iso8601"] Calendar type.
* @returns {boolean} Whether a given date is a weekend day.
*/
function isWeekend(date, calendarType) {
	if (calendarType === void 0) calendarType = CALENDAR_TYPES.ISO_8601;
	var weekday = date.getDay();
	switch (calendarType) {
		case CALENDAR_TYPES.ISLAMIC:
		case CALENDAR_TYPES.HEBREW: return weekday === FRIDAY || weekday === SATURDAY;
		case CALENDAR_TYPES.ISO_8601:
		case CALENDAR_TYPES.GREGORY: return weekday === SATURDAY || weekday === SUNDAY;
		default: throw new Error("Unsupported calendar type.");
	}
}
//#endregion
//#region node_modules/react-calendar/dist/Calendar/Navigation.js
var className$6 = "react-calendar__navigation";
function Navigation(_a) {
	var activeStartDate = _a.activeStartDate, drillUp = _a.drillUp, _b = _a.formatMonthYear, formatMonthYear$2 = _b === void 0 ? formatMonthYear : _b, _c = _a.formatYear, formatYear$3 = _c === void 0 ? formatYear : _c, locale = _a.locale, maxDate = _a.maxDate, minDate = _a.minDate, _d = _a.navigationAriaLabel, navigationAriaLabel = _d === void 0 ? "" : _d, navigationAriaLive = _a.navigationAriaLive, navigationLabel = _a.navigationLabel, _e = _a.next2AriaLabel, next2AriaLabel = _e === void 0 ? "" : _e, _f = _a.next2Label, next2Label = _f === void 0 ? "»" : _f, _g = _a.nextAriaLabel, nextAriaLabel = _g === void 0 ? "" : _g, _h = _a.nextLabel, nextLabel = _h === void 0 ? "›" : _h, _j = _a.prev2AriaLabel, prev2AriaLabel = _j === void 0 ? "" : _j, _k = _a.prev2Label, prev2Label = _k === void 0 ? "«" : _k, _l = _a.prevAriaLabel, prevAriaLabel = _l === void 0 ? "" : _l, _m = _a.prevLabel, prevLabel = _m === void 0 ? "‹" : _m, setActiveStartDate = _a.setActiveStartDate, showDoubleView = _a.showDoubleView, view = _a.view;
	var drillUpAvailable = _a.views.indexOf(view) > 0;
	var shouldShowPrevNext2Buttons = view !== "century";
	var previousActiveStartDate = getBeginPrevious(view, activeStartDate);
	var previousActiveStartDate2 = shouldShowPrevNext2Buttons ? getBeginPrevious2(view, activeStartDate) : void 0;
	var nextActiveStartDate = getBeginNext(view, activeStartDate);
	var nextActiveStartDate2 = shouldShowPrevNext2Buttons ? getBeginNext2(view, activeStartDate) : void 0;
	var prevButtonDisabled = (function() {
		if (previousActiveStartDate.getFullYear() < 0) return true;
		var previousActiveEndDate = getEndPrevious(view, activeStartDate);
		return minDate && minDate >= previousActiveEndDate;
	})();
	var prev2ButtonDisabled = shouldShowPrevNext2Buttons && (function() {
		if (previousActiveStartDate2.getFullYear() < 0) return true;
		var previousActiveEndDate = getEndPrevious2(view, activeStartDate);
		return minDate && minDate >= previousActiveEndDate;
	})();
	var nextButtonDisabled = maxDate && maxDate < nextActiveStartDate;
	var next2ButtonDisabled = shouldShowPrevNext2Buttons && maxDate && maxDate < nextActiveStartDate2;
	function onClickPrevious() {
		setActiveStartDate(previousActiveStartDate, "prev");
	}
	function onClickPrevious2() {
		setActiveStartDate(previousActiveStartDate2, "prev2");
	}
	function onClickNext() {
		setActiveStartDate(nextActiveStartDate, "next");
	}
	function onClickNext2() {
		setActiveStartDate(nextActiveStartDate2, "next2");
	}
	function renderLabel(date) {
		var label = (function() {
			switch (view) {
				case "century": return getCenturyLabel(locale, formatYear$3, date);
				case "decade": return getDecadeLabel(locale, formatYear$3, date);
				case "year": return formatYear$3(locale, date);
				case "month": return formatMonthYear$2(locale, date);
				default: throw new Error("Invalid view: ".concat(view, "."));
			}
		})();
		return navigationLabel ? navigationLabel({
			date,
			label,
			locale: locale || getUserLocale() || void 0,
			view
		}) : label;
	}
	function renderButton() {
		var labelClassName = "".concat(className$6, "__label");
		return (0, import_jsx_runtime.jsxs)("button", {
			"aria-label": navigationAriaLabel,
			"aria-live": navigationAriaLive,
			className: labelClassName,
			disabled: !drillUpAvailable,
			onClick: drillUp,
			style: { flexGrow: 1 },
			type: "button",
			children: [(0, import_jsx_runtime.jsx)("span", {
				className: "".concat(labelClassName, "__labelText ").concat(labelClassName, "__labelText--from"),
				children: renderLabel(activeStartDate)
			}), showDoubleView ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("span", {
				className: "".concat(labelClassName, "__divider"),
				children: " – "
			}), (0, import_jsx_runtime.jsx)("span", {
				className: "".concat(labelClassName, "__labelText ").concat(labelClassName, "__labelText--to"),
				children: renderLabel(nextActiveStartDate)
			})] }) : null]
		});
	}
	return (0, import_jsx_runtime.jsxs)("div", {
		className: className$6,
		children: [
			prev2Label !== null && shouldShowPrevNext2Buttons ? (0, import_jsx_runtime.jsx)("button", {
				"aria-label": prev2AriaLabel,
				className: "".concat(className$6, "__arrow ").concat(className$6, "__prev2-button"),
				disabled: prev2ButtonDisabled,
				onClick: onClickPrevious2,
				type: "button",
				children: prev2Label
			}) : null,
			prevLabel !== null && (0, import_jsx_runtime.jsx)("button", {
				"aria-label": prevAriaLabel,
				className: "".concat(className$6, "__arrow ").concat(className$6, "__prev-button"),
				disabled: prevButtonDisabled,
				onClick: onClickPrevious,
				type: "button",
				children: prevLabel
			}),
			renderButton(),
			nextLabel !== null && (0, import_jsx_runtime.jsx)("button", {
				"aria-label": nextAriaLabel,
				className: "".concat(className$6, "__arrow ").concat(className$6, "__next-button"),
				disabled: nextButtonDisabled,
				onClick: onClickNext,
				type: "button",
				children: nextLabel
			}),
			next2Label !== null && shouldShowPrevNext2Buttons ? (0, import_jsx_runtime.jsx)("button", {
				"aria-label": next2AriaLabel,
				className: "".concat(className$6, "__arrow ").concat(className$6, "__next2-button"),
				disabled: next2ButtonDisabled,
				onClick: onClickNext2,
				type: "button",
				children: next2Label
			}) : null
		]
	});
}
//#endregion
//#region node_modules/react-calendar/dist/Flex.js
var __assign$14 = function() {
	__assign$14 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$14.apply(this, arguments);
};
var __rest$10 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function toPercent(num) {
	return "".concat(num, "%");
}
function Flex(_a) {
	var children = _a.children, className = _a.className, count = _a.count, direction = _a.direction, offset = _a.offset, style = _a.style, wrap = _a.wrap, otherProps = __rest$10(_a, [
		"children",
		"className",
		"count",
		"direction",
		"offset",
		"style",
		"wrap"
	]);
	return (0, import_jsx_runtime.jsx)("div", __assign$14({
		className,
		style: __assign$14({
			display: "flex",
			flexDirection: direction,
			flexWrap: wrap ? "wrap" : "nowrap"
		}, style)
	}, otherProps, { children: import_react.Children.map(children, function(child, index) {
		var marginInlineStart = offset && index === 0 ? toPercent(100 * offset / count) : null;
		return (0, import_react.cloneElement)(child, __assign$14(__assign$14({}, child.props), { style: {
			flexBasis: toPercent(100 / count),
			flexShrink: 0,
			flexGrow: 0,
			overflow: "hidden",
			marginLeft: marginInlineStart,
			marginInlineStart,
			marginInlineEnd: 0
		} }));
	}) }));
}
//#endregion
//#region node_modules/react-calendar/dist/shared/utils.js
/**
* Returns a value no smaller than min and no larger than max.
*
* @param {Date} value Value to return.
* @param {Date} min Minimum return value.
* @param {Date} max Maximum return value.
* @returns {Date} Value between min and max.
*/
function between(value, min, max) {
	if (min && min > value) return min;
	if (max && max < value) return max;
	return value;
}
function isValueWithinRange(value, range) {
	return range[0] <= value && range[1] >= value;
}
function isRangeWithinRange(greaterRange, smallerRange) {
	return greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1];
}
function doRangesOverlap(range1, range2) {
	return isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2);
}
function getRangeClassNames(valueRange, dateRange, baseClassName) {
	var isRange = doRangesOverlap(dateRange, valueRange);
	var classes = [];
	if (isRange) {
		classes.push(baseClassName);
		var isRangeStart = isValueWithinRange(valueRange[0], dateRange);
		var isRangeEnd = isValueWithinRange(valueRange[1], dateRange);
		if (isRangeStart) classes.push("".concat(baseClassName, "Start"));
		if (isRangeEnd) classes.push("".concat(baseClassName, "End"));
		if (isRangeStart && isRangeEnd) classes.push("".concat(baseClassName, "BothEnds"));
	}
	return classes;
}
function isCompleteValue(value) {
	if (Array.isArray(value)) return value[0] !== null && value[1] !== null;
	return value !== null;
}
function getTileClasses(args) {
	if (!args) throw new Error("args is required");
	var value = args.value, date = args.date, hover = args.hover;
	var className = "react-calendar__tile";
	var classes = [className];
	if (!date) return classes;
	var now = /* @__PURE__ */ new Date();
	var dateRange = (function() {
		if (Array.isArray(date)) return date;
		var dateType = args.dateType;
		if (!dateType) throw new Error("dateType is required when date is not an array of two dates");
		return getRange(dateType, date);
	})();
	if (isValueWithinRange(now, dateRange)) classes.push("".concat(className, "--now"));
	if (!value || !isCompleteValue(value)) return classes;
	var valueRange = (function() {
		if (Array.isArray(value)) return value;
		var valueType = args.valueType;
		if (!valueType) throw new Error("valueType is required when value is not an array of two dates");
		return getRange(valueType, value);
	})();
	if (isRangeWithinRange(valueRange, dateRange)) classes.push("".concat(className, "--active"));
	else if (doRangesOverlap(valueRange, dateRange)) classes.push("".concat(className, "--hasActive"));
	var valueRangeClassNames = getRangeClassNames(valueRange, dateRange, "".concat(className, "--range"));
	classes.push.apply(classes, valueRangeClassNames);
	if (hover && (Array.isArray(value) ? value : [value]).length === 1) {
		var hoverRangeClassNames = getRangeClassNames(hover > valueRange[0] ? [valueRange[0], hover] : [hover, valueRange[0]], dateRange, "".concat(className, "--hover"));
		classes.push.apply(classes, hoverRangeClassNames);
	}
	return classes;
}
//#endregion
//#region node_modules/react-calendar/dist/TileGroup.js
function TileGroup(_a) {
	var className = _a.className, _b = _a.count, count = _b === void 0 ? 3 : _b, dateTransform = _a.dateTransform, dateType = _a.dateType, end = _a.end, hover = _a.hover, offset = _a.offset, renderTile = _a.renderTile, start = _a.start, _c = _a.step, step = _c === void 0 ? 1 : _c, value = _a.value, valueType = _a.valueType;
	var tiles = [];
	for (var point = start; point <= end; point += step) {
		var date = dateTransform(point);
		tiles.push(renderTile({
			classes: getTileClasses({
				date,
				dateType,
				hover,
				value,
				valueType
			}),
			date
		}));
	}
	return (0, import_jsx_runtime.jsx)(Flex, {
		className,
		count,
		offset,
		wrap: true,
		children: tiles
	});
}
//#endregion
//#region node_modules/react-calendar/dist/Tile.js
function Tile(props) {
	var activeStartDate = props.activeStartDate, children = props.children, classes = props.classes, date = props.date, formatAbbr = props.formatAbbr, locale = props.locale, maxDate = props.maxDate, maxDateTransform = props.maxDateTransform, minDate = props.minDate, minDateTransform = props.minDateTransform, onClick = props.onClick, onMouseOver = props.onMouseOver, style = props.style, tileClassNameProps = props.tileClassName, tileContentProps = props.tileContent, tileDisabled = props.tileDisabled, view = props.view;
	var tileClassName = (0, import_react.useMemo)(function() {
		return typeof tileClassNameProps === "function" ? tileClassNameProps({
			activeStartDate,
			date,
			view
		}) : tileClassNameProps;
	}, [
		activeStartDate,
		date,
		tileClassNameProps,
		view
	]);
	var tileContent = (0, import_react.useMemo)(function() {
		return typeof tileContentProps === "function" ? tileContentProps({
			activeStartDate,
			date,
			view
		}) : tileContentProps;
	}, [
		activeStartDate,
		date,
		tileContentProps,
		view
	]);
	return (0, import_jsx_runtime.jsxs)("button", {
		className: clsx(classes, tileClassName),
		disabled: minDate && minDateTransform(minDate) > date || maxDate && maxDateTransform(maxDate) < date || (tileDisabled === null || tileDisabled === void 0 ? void 0 : tileDisabled({
			activeStartDate,
			date,
			view
		})),
		onClick: onClick ? function(event) {
			return onClick(date, event);
		} : void 0,
		onFocus: onMouseOver ? function() {
			return onMouseOver(date);
		} : void 0,
		onMouseOver: onMouseOver ? function() {
			return onMouseOver(date);
		} : void 0,
		style,
		type: "button",
		children: [formatAbbr ? (0, import_jsx_runtime.jsx)("abbr", {
			"aria-label": formatAbbr(locale, date),
			children
		}) : children, tileContent]
	});
}
//#endregion
//#region node_modules/react-calendar/dist/CenturyView/Decade.js
var __assign$13 = function() {
	__assign$13 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$13.apply(this, arguments);
};
var __rest$9 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var className$5 = "react-calendar__century-view__decades__decade";
function Decade(_a) {
	var _b = _a.classes, classes = _b === void 0 ? [] : _b, currentCentury = _a.currentCentury, _c = _a.formatYear, formatYear$2 = _c === void 0 ? formatYear : _c, otherProps = __rest$9(_a, [
		"classes",
		"currentCentury",
		"formatYear"
	]);
	var date = otherProps.date, locale = otherProps.locale;
	var classesProps = [];
	if (classes) classesProps.push.apply(classesProps, classes);
	if (className$5) classesProps.push(className$5);
	if (getCenturyStart(date).getFullYear() !== currentCentury) classesProps.push("".concat(className$5, "--neighboringCentury"));
	return (0, import_jsx_runtime.jsx)(Tile, __assign$13({}, otherProps, {
		classes: classesProps,
		maxDateTransform: getDecadeEnd,
		minDateTransform: getDecadeStart,
		view: "century",
		children: getDecadeLabel(locale, formatYear$2, date)
	}));
}
//#endregion
//#region node_modules/react-calendar/dist/CenturyView/Decades.js
var __assign$12 = function() {
	__assign$12 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$12.apply(this, arguments);
};
var __rest$8 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function Decades(props) {
	var activeStartDate = props.activeStartDate, hover = props.hover, showNeighboringCentury = props.showNeighboringCentury, value = props.value, valueType = props.valueType, otherProps = __rest$8(props, [
		"activeStartDate",
		"hover",
		"showNeighboringCentury",
		"value",
		"valueType"
	]);
	var start = getBeginOfCenturyYear(activeStartDate);
	return (0, import_jsx_runtime.jsx)(TileGroup, {
		className: "react-calendar__century-view__decades",
		dateTransform: getDecadeStart,
		dateType: "decade",
		end: start + (showNeighboringCentury ? 119 : 99),
		hover,
		renderTile: function(_a) {
			var date = _a.date, otherTileProps = __rest$8(_a, ["date"]);
			return (0, import_jsx_runtime.jsx)(Decade, __assign$12({}, otherProps, otherTileProps, {
				activeStartDate,
				currentCentury: start,
				date
			}), date.getTime());
		},
		start,
		step: 10,
		value,
		valueType
	});
}
//#endregion
//#region node_modules/react-calendar/dist/CenturyView.js
var __assign$11 = function() {
	__assign$11 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$11.apply(this, arguments);
};
/**
* Displays a given century.
*/
function CenturyView(props) {
	function renderDecades() {
		return (0, import_jsx_runtime.jsx)(Decades, __assign$11({}, props));
	}
	return (0, import_jsx_runtime.jsx)("div", {
		className: "react-calendar__century-view",
		children: renderDecades()
	});
}
//#endregion
//#region node_modules/react-calendar/dist/DecadeView/Year.js
var __assign$10 = function() {
	__assign$10 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$10.apply(this, arguments);
};
var __rest$7 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var className$4 = "react-calendar__decade-view__years__year";
function Year(_a) {
	var _b = _a.classes, classes = _b === void 0 ? [] : _b, currentDecade = _a.currentDecade, _c = _a.formatYear, formatYear$1 = _c === void 0 ? formatYear : _c, otherProps = __rest$7(_a, [
		"classes",
		"currentDecade",
		"formatYear"
	]);
	var date = otherProps.date, locale = otherProps.locale;
	var classesProps = [];
	if (classes) classesProps.push.apply(classesProps, classes);
	if (className$4) classesProps.push(className$4);
	if (getDecadeStart(date).getFullYear() !== currentDecade) classesProps.push("".concat(className$4, "--neighboringDecade"));
	return (0, import_jsx_runtime.jsx)(Tile, __assign$10({}, otherProps, {
		classes: classesProps,
		maxDateTransform: getYearEnd,
		minDateTransform: getYearStart,
		view: "decade",
		children: formatYear$1(locale, date)
	}));
}
//#endregion
//#region node_modules/react-calendar/dist/DecadeView/Years.js
var __assign$9 = function() {
	__assign$9 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$9.apply(this, arguments);
};
var __rest$6 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function Years(props) {
	var activeStartDate = props.activeStartDate, hover = props.hover, showNeighboringDecade = props.showNeighboringDecade, value = props.value, valueType = props.valueType, otherProps = __rest$6(props, [
		"activeStartDate",
		"hover",
		"showNeighboringDecade",
		"value",
		"valueType"
	]);
	var start = getBeginOfDecadeYear(activeStartDate);
	return (0, import_jsx_runtime.jsx)(TileGroup, {
		className: "react-calendar__decade-view__years",
		dateTransform: getYearStart,
		dateType: "year",
		end: start + (showNeighboringDecade ? 11 : 9),
		hover,
		renderTile: function(_a) {
			var date = _a.date, otherTileProps = __rest$6(_a, ["date"]);
			return (0, import_jsx_runtime.jsx)(Year, __assign$9({}, otherProps, otherTileProps, {
				activeStartDate,
				currentDecade: start,
				date
			}), date.getTime());
		},
		start,
		value,
		valueType
	});
}
//#endregion
//#region node_modules/react-calendar/dist/DecadeView.js
var __assign$8 = function() {
	__assign$8 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$8.apply(this, arguments);
};
/**
* Displays a given decade.
*/
function DecadeView(props) {
	function renderYears() {
		return (0, import_jsx_runtime.jsx)(Years, __assign$8({}, props));
	}
	return (0, import_jsx_runtime.jsx)("div", {
		className: "react-calendar__decade-view",
		children: renderYears()
	});
}
//#endregion
//#region node_modules/react-calendar/dist/YearView/Month.js
var __assign$7 = function() {
	__assign$7 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$7.apply(this, arguments);
};
var __rest$5 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var __spreadArray = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var className$3 = "react-calendar__year-view__months__month";
function Month(_a) {
	var _b = _a.classes, classes = _b === void 0 ? [] : _b, _c = _a.formatMonth, formatMonth$1 = _c === void 0 ? formatMonth : _c, _d = _a.formatMonthYear, formatMonthYear$1 = _d === void 0 ? formatMonthYear : _d, otherProps = __rest$5(_a, [
		"classes",
		"formatMonth",
		"formatMonthYear"
	]);
	var date = otherProps.date, locale = otherProps.locale;
	return (0, import_jsx_runtime.jsx)(Tile, __assign$7({}, otherProps, {
		classes: __spreadArray(__spreadArray([], classes, true), [className$3], false),
		formatAbbr: formatMonthYear$1,
		maxDateTransform: getMonthEnd,
		minDateTransform: getMonthStart,
		view: "year",
		children: formatMonth$1(locale, date)
	}));
}
//#endregion
//#region node_modules/react-calendar/dist/YearView/Months.js
var __assign$6 = function() {
	__assign$6 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$6.apply(this, arguments);
};
var __rest$4 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function Months(props) {
	var activeStartDate = props.activeStartDate, hover = props.hover, value = props.value, valueType = props.valueType, otherProps = __rest$4(props, [
		"activeStartDate",
		"hover",
		"value",
		"valueType"
	]);
	var start = 0;
	var end = 11;
	var year = getYear(activeStartDate);
	return (0, import_jsx_runtime.jsx)(TileGroup, {
		className: "react-calendar__year-view__months",
		dateTransform: function(monthIndex) {
			var date = /* @__PURE__ */ new Date();
			date.setFullYear(year, monthIndex, 1);
			return getMonthStart(date);
		},
		dateType: "month",
		end,
		hover,
		renderTile: function(_a) {
			var date = _a.date, otherTileProps = __rest$4(_a, ["date"]);
			return (0, import_jsx_runtime.jsx)(Month, __assign$6({}, otherProps, otherTileProps, {
				activeStartDate,
				date
			}), date.getTime());
		},
		start,
		value,
		valueType
	});
}
//#endregion
//#region node_modules/react-calendar/dist/YearView.js
var __assign$5 = function() {
	__assign$5 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$5.apply(this, arguments);
};
/**
* Displays a given year.
*/
function YearView(props) {
	function renderMonths() {
		return (0, import_jsx_runtime.jsx)(Months, __assign$5({}, props));
	}
	return (0, import_jsx_runtime.jsx)("div", {
		className: "react-calendar__year-view",
		children: renderMonths()
	});
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView/Day.js
var __assign$4 = function() {
	__assign$4 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$4.apply(this, arguments);
};
var __rest$3 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var className$2 = "react-calendar__month-view__days__day";
function Day(_a) {
	var calendarType = _a.calendarType, _b = _a.classes, classes = _b === void 0 ? [] : _b, currentMonthIndex = _a.currentMonthIndex, _c = _a.formatDay, formatDay$1 = _c === void 0 ? formatDay : _c, _d = _a.formatLongDate, formatLongDate$1 = _d === void 0 ? formatLongDate : _d, otherProps = __rest$3(_a, [
		"calendarType",
		"classes",
		"currentMonthIndex",
		"formatDay",
		"formatLongDate"
	]);
	var date = otherProps.date, locale = otherProps.locale;
	var classesProps = [];
	if (classes) classesProps.push.apply(classesProps, classes);
	if (className$2) classesProps.push(className$2);
	if (isWeekend(date, calendarType)) classesProps.push("".concat(className$2, "--weekend"));
	if (date.getMonth() !== currentMonthIndex) classesProps.push("".concat(className$2, "--neighboringMonth"));
	return (0, import_jsx_runtime.jsx)(Tile, __assign$4({}, otherProps, {
		classes: classesProps,
		formatAbbr: formatLongDate$1,
		maxDateTransform: getDayEnd,
		minDateTransform: getDayStart,
		view: "month",
		children: formatDay$1(locale, date)
	}));
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView/Days.js
var __assign$3 = function() {
	__assign$3 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$3.apply(this, arguments);
};
var __rest$2 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function Days(props) {
	var activeStartDate = props.activeStartDate, calendarType = props.calendarType, hover = props.hover, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks, showNeighboringMonth = props.showNeighboringMonth, value = props.value, valueType = props.valueType, otherProps = __rest$2(props, [
		"activeStartDate",
		"calendarType",
		"hover",
		"showFixedNumberOfWeeks",
		"showNeighboringMonth",
		"value",
		"valueType"
	]);
	var year = getYear(activeStartDate);
	var monthIndex = getMonth(activeStartDate);
	var hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth;
	var dayOfWeek = getDayOfWeek(activeStartDate, calendarType);
	var offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek;
	/**
	* Defines on which day of the month the grid shall start. If we simply show current
	* month, we obviously start on day one, but if showNeighboringMonth is set to
	* true, we need to find the beginning of the week the first day of the month is in.
	*/
	var start = (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1;
	return (0, import_jsx_runtime.jsx)(TileGroup, {
		className: "react-calendar__month-view__days",
		count: 7,
		dateTransform: function(day) {
			var date = /* @__PURE__ */ new Date();
			date.setFullYear(year, monthIndex, day);
			return getDayStart(date);
		},
		dateType: "day",
		hover,
		end: (function() {
			if (showFixedNumberOfWeeks) return start + 42 - 1;
			var daysInMonth = getDaysInMonth(activeStartDate);
			if (showNeighboringMonth) {
				var activeEndDate = /* @__PURE__ */ new Date();
				activeEndDate.setFullYear(year, monthIndex, daysInMonth);
				activeEndDate.setHours(0, 0, 0, 0);
				return daysInMonth + (7 - getDayOfWeek(activeEndDate, calendarType) - 1);
			}
			return daysInMonth;
		})(),
		renderTile: function(_a) {
			var date = _a.date, otherTileProps = __rest$2(_a, ["date"]);
			return (0, import_jsx_runtime.jsx)(Day, __assign$3({}, otherProps, otherTileProps, {
				activeStartDate,
				calendarType,
				currentMonthIndex: monthIndex,
				date
			}), date.getTime());
		},
		offset,
		start,
		value,
		valueType
	});
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView/Weekdays.js
var className$1 = "react-calendar__month-view__weekdays";
var weekdayClassName = "".concat(className$1, "__weekday");
function Weekdays(props) {
	var calendarType = props.calendarType, _a = props.formatShortWeekday, formatShortWeekday$1 = _a === void 0 ? formatShortWeekday : _a, _b = props.formatWeekday, formatWeekday$1 = _b === void 0 ? formatWeekday : _b, locale = props.locale, onMouseLeave = props.onMouseLeave;
	var beginOfMonth = getMonthStart(/* @__PURE__ */ new Date());
	var year = getYear(beginOfMonth);
	var monthIndex = getMonth(beginOfMonth);
	var weekdays = [];
	for (var weekday = 1; weekday <= 7; weekday += 1) {
		var weekdayDate = new Date(year, monthIndex, weekday - getDayOfWeek(beginOfMonth, calendarType));
		var abbr = formatWeekday$1(locale, weekdayDate);
		weekdays.push((0, import_jsx_runtime.jsx)("div", {
			className: clsx(weekdayClassName, isCurrentDayOfWeek(weekdayDate) && "".concat(weekdayClassName, "--current"), isWeekend(weekdayDate, calendarType) && "".concat(weekdayClassName, "--weekend")),
			children: (0, import_jsx_runtime.jsx)("abbr", {
				"aria-label": abbr,
				title: abbr,
				children: formatShortWeekday$1(locale, weekdayDate).replace(".", "")
			})
		}, weekday));
	}
	return (0, import_jsx_runtime.jsx)(Flex, {
		className: className$1,
		count: 7,
		onFocus: onMouseLeave,
		onMouseOver: onMouseLeave,
		children: weekdays
	});
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView/WeekNumber.js
var __assign$2 = function() {
	__assign$2 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$2.apply(this, arguments);
};
var __rest$1 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var className = "react-calendar__tile";
function WeekNumber(props) {
	var onClickWeekNumber = props.onClickWeekNumber, weekNumber = props.weekNumber;
	var children = (0, import_jsx_runtime.jsx)("span", { children: weekNumber });
	if (onClickWeekNumber) {
		var date_1 = props.date, onClickWeekNumber_1 = props.onClickWeekNumber, weekNumber_1 = props.weekNumber, otherProps = __rest$1(props, [
			"date",
			"onClickWeekNumber",
			"weekNumber"
		]);
		return (0, import_jsx_runtime.jsx)("button", __assign$2({}, otherProps, {
			className,
			onClick: function(event) {
				return onClickWeekNumber_1(weekNumber_1, date_1, event);
			},
			type: "button",
			children
		}));
	} else {
		props.date;
		props.onClickWeekNumber;
		props.weekNumber;
		var otherProps = __rest$1(props, [
			"date",
			"onClickWeekNumber",
			"weekNumber"
		]);
		return (0, import_jsx_runtime.jsx)("div", __assign$2({}, otherProps, {
			className,
			children
		}));
	}
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView/WeekNumbers.js
function WeekNumbers(props) {
	var activeStartDate = props.activeStartDate, calendarType = props.calendarType, onClickWeekNumber = props.onClickWeekNumber, onMouseLeave = props.onMouseLeave, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;
	var numberOfWeeks = (function() {
		if (showFixedNumberOfWeeks) return 6;
		var days = getDaysInMonth(activeStartDate) - (7 - getDayOfWeek(activeStartDate, calendarType));
		return 1 + Math.ceil(days / 7);
	})();
	var dates = (function() {
		var year = getYear(activeStartDate);
		var monthIndex = getMonth(activeStartDate);
		var day = getDate(activeStartDate);
		var result = [];
		for (var index = 0; index < numberOfWeeks; index += 1) result.push(getBeginOfWeek(new Date(year, monthIndex, day + index * 7), calendarType));
		return result;
	})();
	return (0, import_jsx_runtime.jsx)(Flex, {
		className: "react-calendar__month-view__weekNumbers",
		count: numberOfWeeks,
		direction: "column",
		onFocus: onMouseLeave,
		onMouseOver: onMouseLeave,
		style: {
			flexBasis: "calc(100% * (1 / 8)",
			flexShrink: 0
		},
		children: dates.map(function(date) {
			return getWeekNumber(date, calendarType);
		}).map(function(weekNumber, weekIndex) {
			var date = dates[weekIndex];
			if (!date) throw new Error("date is not defined");
			return (0, import_jsx_runtime.jsx)(WeekNumber, {
				date,
				onClickWeekNumber,
				weekNumber
			}, weekNumber);
		})
	});
}
//#endregion
//#region node_modules/react-calendar/dist/MonthView.js
var __assign$1 = function() {
	__assign$1 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$1.apply(this, arguments);
};
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function getCalendarTypeFromLocale(locale) {
	if (locale) for (var _i = 0, _a = Object.entries(CALENDAR_TYPE_LOCALES); _i < _a.length; _i++) {
		var _b = _a[_i], calendarType = _b[0];
		if (_b[1].includes(locale)) return calendarType;
	}
	return CALENDAR_TYPES.ISO_8601;
}
/**
* Displays a given month.
*/
function MonthView(props) {
	var activeStartDate = props.activeStartDate, locale = props.locale, onMouseLeave = props.onMouseLeave, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;
	var _a = props.calendarType, calendarType = _a === void 0 ? getCalendarTypeFromLocale(locale) : _a, formatShortWeekday = props.formatShortWeekday, formatWeekday = props.formatWeekday, onClickWeekNumber = props.onClickWeekNumber, showWeekNumbers = props.showWeekNumbers, childProps = __rest(props, [
		"calendarType",
		"formatShortWeekday",
		"formatWeekday",
		"onClickWeekNumber",
		"showWeekNumbers"
	]);
	function renderWeekdays() {
		return (0, import_jsx_runtime.jsx)(Weekdays, {
			calendarType,
			formatShortWeekday,
			formatWeekday,
			locale,
			onMouseLeave
		});
	}
	function renderWeekNumbers() {
		if (!showWeekNumbers) return null;
		return (0, import_jsx_runtime.jsx)(WeekNumbers, {
			activeStartDate,
			calendarType,
			onClickWeekNumber,
			onMouseLeave,
			showFixedNumberOfWeeks
		});
	}
	function renderDays() {
		return (0, import_jsx_runtime.jsx)(Days, __assign$1({ calendarType }, childProps));
	}
	var className = "react-calendar__month-view";
	return (0, import_jsx_runtime.jsx)("div", {
		className: clsx(className, showWeekNumbers ? "".concat(className, "--weekNumbers") : ""),
		children: (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "flex-end"
			},
			children: [renderWeekNumbers(), (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flexGrow: 1,
					width: "100%"
				},
				children: [renderWeekdays(), renderDays()]
			})]
		})
	});
}
//#endregion
//#region node_modules/react-calendar/dist/Calendar.js
var __assign = function() {
	__assign = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
var baseClassName = "react-calendar";
var allViews = [
	"century",
	"decade",
	"year",
	"month"
];
var allValueTypes = [
	"decade",
	"year",
	"month",
	"day"
];
var defaultMinDate = /* @__PURE__ */ new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
var defaultMaxDate = /* @__PURE__ */ new Date(864e13);
function toDate(value) {
	if (value instanceof Date) return value;
	return new Date(value);
}
/**
* Returns views array with disallowed values cut off.
*/
function getLimitedViews(minDetail, maxDetail) {
	return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
}
/**
* Determines whether a given view is allowed with currently applied settings.
*/
function isViewAllowed(view, minDetail, maxDetail) {
	return getLimitedViews(minDetail, maxDetail).indexOf(view) !== -1;
}
/**
* Gets either provided view if allowed by minDetail and maxDetail, or gets
* the default view if not allowed.
*/
function getView(view, minDetail, maxDetail) {
	if (!view) return maxDetail;
	if (isViewAllowed(view, minDetail, maxDetail)) return view;
	return maxDetail;
}
/**
* Returns value type that can be returned with currently applied settings.
*/
function getValueType(view) {
	return allValueTypes[allViews.indexOf(view)];
}
function getValue(value, index) {
	var rawValue = Array.isArray(value) ? value[index] : value;
	if (!rawValue) return null;
	var valueDate = toDate(rawValue);
	if (Number.isNaN(valueDate.getTime())) throw new Error("Invalid date: ".concat(value));
	return valueDate;
}
function getDetailValue(_a, index) {
	var value = _a.value, minDate = _a.minDate, maxDate = _a.maxDate, maxDetail = _a.maxDetail;
	var valuePiece = getValue(value, index);
	if (!valuePiece) return null;
	var valueType = getValueType(maxDetail);
	return between((function() {
		switch (index) {
			case 0: return getBegin(valueType, valuePiece);
			case 1: return getEnd(valueType, valuePiece);
			default: throw new Error("Invalid index value: ".concat(index));
		}
	})(), minDate, maxDate);
}
var getDetailValueFrom = function(args) {
	return getDetailValue(args, 0);
};
var getDetailValueTo = function(args) {
	return getDetailValue(args, 1);
};
var getDetailValueArray = function(args) {
	return [getDetailValueFrom, getDetailValueTo].map(function(fn) {
		return fn(args);
	});
};
function getActiveStartDate(_a) {
	var maxDate = _a.maxDate, maxDetail = _a.maxDetail, minDate = _a.minDate, minDetail = _a.minDetail, value = _a.value, view = _a.view;
	return getBegin(getView(view, minDetail, maxDetail), getDetailValueFrom({
		value,
		minDate,
		maxDate,
		maxDetail
	}) || /* @__PURE__ */ new Date());
}
function getInitialActiveStartDate(_a) {
	var activeStartDate = _a.activeStartDate, defaultActiveStartDate = _a.defaultActiveStartDate, defaultValue = _a.defaultValue, defaultView = _a.defaultView, maxDate = _a.maxDate, maxDetail = _a.maxDetail, minDate = _a.minDate, minDetail = _a.minDetail, value = _a.value, view = _a.view;
	var rangeType = getView(view, minDetail, maxDetail);
	var valueFrom = activeStartDate || defaultActiveStartDate;
	if (valueFrom) return getBegin(rangeType, valueFrom);
	return getActiveStartDate({
		maxDate,
		maxDetail,
		minDate,
		minDetail,
		value: value || defaultValue,
		view: view || defaultView
	});
}
function getIsSingleValue(value) {
	return value && (!Array.isArray(value) || value.length === 1);
}
function areDatesEqual(date1, date2) {
	return date1 instanceof Date && date2 instanceof Date && date1.getTime() === date2.getTime();
}
var Calendar = (0, import_react.forwardRef)(function Calendar(props, ref) {
	var activeStartDateProps = props.activeStartDate, allowPartialRange = props.allowPartialRange, calendarType = props.calendarType, className = props.className, defaultActiveStartDate = props.defaultActiveStartDate, defaultValue = props.defaultValue, defaultView = props.defaultView, formatDay = props.formatDay, formatLongDate = props.formatLongDate, formatMonth = props.formatMonth, formatMonthYear = props.formatMonthYear, formatShortWeekday = props.formatShortWeekday, formatWeekday = props.formatWeekday, formatYear = props.formatYear, _a = props.goToRangeStartOnSelect, goToRangeStartOnSelect = _a === void 0 ? true : _a, inputRef = props.inputRef, locale = props.locale, _b = props.maxDate, maxDate = _b === void 0 ? defaultMaxDate : _b, _c = props.maxDetail, maxDetail = _c === void 0 ? "month" : _c, _d = props.minDate, minDate = _d === void 0 ? defaultMinDate : _d, _e = props.minDetail, minDetail = _e === void 0 ? "century" : _e, navigationAriaLabel = props.navigationAriaLabel, navigationAriaLive = props.navigationAriaLive, navigationLabel = props.navigationLabel, next2AriaLabel = props.next2AriaLabel, next2Label = props.next2Label, nextAriaLabel = props.nextAriaLabel, nextLabel = props.nextLabel, onActiveStartDateChange = props.onActiveStartDateChange, onChangeProps = props.onChange, onClickDay = props.onClickDay, onClickDecade = props.onClickDecade, onClickMonth = props.onClickMonth, onClickWeekNumber = props.onClickWeekNumber, onClickYear = props.onClickYear, onDrillDown = props.onDrillDown, onDrillUp = props.onDrillUp, onViewChange = props.onViewChange, prev2AriaLabel = props.prev2AriaLabel, prev2Label = props.prev2Label, prevAriaLabel = props.prevAriaLabel, prevLabel = props.prevLabel, _f = props.returnValue, returnValue = _f === void 0 ? "start" : _f, selectRange = props.selectRange, showDoubleView = props.showDoubleView, showFixedNumberOfWeeks = props.showFixedNumberOfWeeks, _g = props.showNavigation, showNavigation = _g === void 0 ? true : _g, showNeighboringCentury = props.showNeighboringCentury, showNeighboringDecade = props.showNeighboringDecade, _h = props.showNeighboringMonth, showNeighboringMonth = _h === void 0 ? true : _h, showWeekNumbers = props.showWeekNumbers, tileClassName = props.tileClassName, tileContent = props.tileContent, tileDisabled = props.tileDisabled, valueProps = props.value, viewProps = props.view;
	var _j = (0, import_react.useState)(defaultActiveStartDate), activeStartDateState = _j[0], setActiveStartDateState = _j[1];
	var _k = (0, import_react.useState)(null), hoverState = _k[0], setHoverState = _k[1];
	var _l = (0, import_react.useState)(Array.isArray(defaultValue) ? defaultValue.map(function(el) {
		return el !== null ? toDate(el) : null;
	}) : defaultValue !== null && defaultValue !== void 0 ? toDate(defaultValue) : null), valueState = _l[0], setValueState = _l[1];
	var _m = (0, import_react.useState)(defaultView), viewState = _m[0], setViewState = _m[1];
	var activeStartDate = activeStartDateProps || activeStartDateState || getInitialActiveStartDate({
		activeStartDate: activeStartDateProps,
		defaultActiveStartDate,
		defaultValue,
		defaultView,
		maxDate,
		maxDetail,
		minDate,
		minDetail,
		value: valueProps,
		view: viewProps
	});
	var value = (function() {
		var rawValue = (function() {
			if (selectRange && getIsSingleValue(valueState)) return valueState;
			return valueProps !== void 0 ? valueProps : valueState;
		})();
		if (!rawValue) return null;
		return Array.isArray(rawValue) ? rawValue.map(function(el) {
			return el !== null ? toDate(el) : null;
		}) : rawValue !== null ? toDate(rawValue) : null;
	})();
	var valueType = getValueType(maxDetail);
	var view = getView(viewProps || viewState, minDetail, maxDetail);
	var views = getLimitedViews(minDetail, maxDetail);
	var hover = selectRange ? hoverState : null;
	var drillDownAvailable = views.indexOf(view) < views.length - 1;
	var drillUpAvailable = views.indexOf(view) > 0;
	var getProcessedValue = (0, import_react.useCallback)(function(value) {
		return (function() {
			switch (returnValue) {
				case "start": return getDetailValueFrom;
				case "end": return getDetailValueTo;
				case "range": return getDetailValueArray;
				default: throw new Error("Invalid returnValue.");
			}
		})()({
			maxDate,
			maxDetail,
			minDate,
			value
		});
	}, [
		maxDate,
		maxDetail,
		minDate,
		returnValue
	]);
	var setActiveStartDate = (0, import_react.useCallback)(function(nextActiveStartDate, action) {
		setActiveStartDateState(nextActiveStartDate);
		var args = {
			action,
			activeStartDate: nextActiveStartDate,
			value,
			view
		};
		if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) onActiveStartDateChange(args);
	}, [
		activeStartDate,
		onActiveStartDateChange,
		value,
		view
	]);
	var onClickTile = (0, import_react.useCallback)(function(value, event) {
		var callback = (function() {
			switch (view) {
				case "century": return onClickDecade;
				case "decade": return onClickYear;
				case "year": return onClickMonth;
				case "month": return onClickDay;
				default: throw new Error("Invalid view: ".concat(view, "."));
			}
		})();
		if (callback) callback(value, event);
	}, [
		onClickDay,
		onClickDecade,
		onClickMonth,
		onClickYear,
		view
	]);
	var drillDown = (0, import_react.useCallback)(function(nextActiveStartDate, event) {
		if (!drillDownAvailable) return;
		onClickTile(nextActiveStartDate, event);
		var nextView = views[views.indexOf(view) + 1];
		if (!nextView) throw new Error("Attempted to drill down from the lowest view.");
		setActiveStartDateState(nextActiveStartDate);
		setViewState(nextView);
		var args = {
			action: "drillDown",
			activeStartDate: nextActiveStartDate,
			value,
			view: nextView
		};
		if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) onActiveStartDateChange(args);
		if (onViewChange && view !== nextView) onViewChange(args);
		if (onDrillDown) onDrillDown(args);
	}, [
		activeStartDate,
		drillDownAvailable,
		onActiveStartDateChange,
		onClickTile,
		onDrillDown,
		onViewChange,
		value,
		view,
		views
	]);
	var drillUp = (0, import_react.useCallback)(function() {
		if (!drillUpAvailable) return;
		var nextView = views[views.indexOf(view) - 1];
		if (!nextView) throw new Error("Attempted to drill up from the highest view.");
		var nextActiveStartDate = getBegin(nextView, activeStartDate);
		setActiveStartDateState(nextActiveStartDate);
		setViewState(nextView);
		var args = {
			action: "drillUp",
			activeStartDate: nextActiveStartDate,
			value,
			view: nextView
		};
		if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) onActiveStartDateChange(args);
		if (onViewChange && view !== nextView) onViewChange(args);
		if (onDrillUp) onDrillUp(args);
	}, [
		activeStartDate,
		drillUpAvailable,
		onActiveStartDateChange,
		onDrillUp,
		onViewChange,
		value,
		view,
		views
	]);
	var onChange = (0, import_react.useCallback)(function(rawNextValue, event) {
		var previousValue = value;
		onClickTile(rawNextValue, event);
		var isFirstValueInRange = selectRange && !getIsSingleValue(previousValue);
		var nextValue;
		if (selectRange) if (isFirstValueInRange) nextValue = getBegin(valueType, rawNextValue);
		else {
			if (!previousValue) throw new Error("previousValue is required");
			if (Array.isArray(previousValue)) throw new Error("previousValue must not be an array");
			nextValue = getValueRange(valueType, previousValue, rawNextValue);
		}
		else nextValue = getProcessedValue(rawNextValue);
		var nextActiveStartDate = !selectRange || isFirstValueInRange || goToRangeStartOnSelect ? getActiveStartDate({
			maxDate,
			maxDetail,
			minDate,
			minDetail,
			value: nextValue,
			view
		}) : null;
		event.persist();
		setActiveStartDateState(nextActiveStartDate);
		setValueState(nextValue);
		var args = {
			action: "onChange",
			activeStartDate: nextActiveStartDate,
			value: nextValue,
			view
		};
		if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) onActiveStartDateChange(args);
		if (onChangeProps) if (selectRange) {
			if (!getIsSingleValue(nextValue)) onChangeProps(nextValue || null, event);
			else if (allowPartialRange) {
				if (Array.isArray(nextValue)) throw new Error("value must not be an array");
				onChangeProps([nextValue || null, null], event);
			}
		} else onChangeProps(nextValue || null, event);
	}, [
		activeStartDate,
		allowPartialRange,
		getProcessedValue,
		goToRangeStartOnSelect,
		maxDate,
		maxDetail,
		minDate,
		minDetail,
		onActiveStartDateChange,
		onChangeProps,
		onClickTile,
		selectRange,
		value,
		valueType,
		view
	]);
	function onMouseOver(nextHover) {
		setHoverState(nextHover);
	}
	function onMouseLeave() {
		setHoverState(null);
	}
	(0, import_react.useImperativeHandle)(ref, function() {
		return {
			activeStartDate,
			drillDown,
			drillUp,
			onChange,
			setActiveStartDate,
			value,
			view
		};
	}, [
		activeStartDate,
		drillDown,
		drillUp,
		onChange,
		setActiveStartDate,
		value,
		view
	]);
	function renderContent(next) {
		var commonProps = {
			activeStartDate: next ? getBeginNext(view, activeStartDate) : getBegin(view, activeStartDate),
			hover,
			locale,
			maxDate,
			minDate,
			onClick: drillDownAvailable ? drillDown : onChange,
			onMouseOver: selectRange ? onMouseOver : void 0,
			tileClassName,
			tileContent,
			tileDisabled,
			value,
			valueType
		};
		switch (view) {
			case "century": return (0, import_jsx_runtime.jsx)(CenturyView, __assign({
				formatYear,
				showNeighboringCentury
			}, commonProps));
			case "decade": return (0, import_jsx_runtime.jsx)(DecadeView, __assign({
				formatYear,
				showNeighboringDecade
			}, commonProps));
			case "year": return (0, import_jsx_runtime.jsx)(YearView, __assign({
				formatMonth,
				formatMonthYear
			}, commonProps));
			case "month": return (0, import_jsx_runtime.jsx)(MonthView, __assign({
				calendarType,
				formatDay,
				formatLongDate,
				formatShortWeekday,
				formatWeekday,
				onClickWeekNumber,
				onMouseLeave: selectRange ? onMouseLeave : void 0,
				showFixedNumberOfWeeks: typeof showFixedNumberOfWeeks !== "undefined" ? showFixedNumberOfWeeks : showDoubleView,
				showNeighboringMonth,
				showWeekNumbers
			}, commonProps));
			default: throw new Error("Invalid view: ".concat(view, "."));
		}
	}
	function renderNavigation() {
		if (!showNavigation) return null;
		return (0, import_jsx_runtime.jsx)(Navigation, {
			activeStartDate,
			drillUp,
			formatMonthYear,
			formatYear,
			locale,
			maxDate,
			minDate,
			navigationAriaLabel,
			navigationAriaLive,
			navigationLabel,
			next2AriaLabel,
			next2Label,
			nextAriaLabel,
			nextLabel,
			prev2AriaLabel,
			prev2Label,
			prevAriaLabel,
			prevLabel,
			setActiveStartDate,
			showDoubleView,
			view,
			views
		});
	}
	return (0, import_jsx_runtime.jsxs)("div", {
		className: clsx(baseClassName, selectRange && (Array.isArray(value) ? value : [value]).length === 1 && "".concat(baseClassName, "--selectRange"), showDoubleView && "".concat(baseClassName, "--doubleView"), className),
		ref: inputRef,
		children: [renderNavigation(), (0, import_jsx_runtime.jsxs)("div", {
			className: "".concat(baseClassName, "__viewContainer"),
			onBlur: selectRange ? onMouseLeave : void 0,
			onMouseLeave: selectRange ? onMouseLeave : void 0,
			children: [renderContent(), showDoubleView ? renderContent(true) : null]
		})]
	});
});
//#endregion
//#region node_modules/react-calendar/dist/index.js
var dist_default = Calendar;
//#endregion
export { Calendar, CenturyView, DecadeView, MonthView, Navigation, YearView, dist_default as default };

//# sourceMappingURL=react-calendar.js.map