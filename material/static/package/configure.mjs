(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ao.U === region.av.U)
	{
		return 'on line ' + region.ao.U;
	}
	return 'on lines ' + region.ao.U + ' through ' + region.av.U;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bh,
		impl.bf,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		a6: func(record.a6),
		be: record.be,
		bb: record.bb
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.a6;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.be;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bb) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bh,
		impl.bf,
		function(sendToApp, initialModel) {
			var view = impl.bi;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bh,
		impl.bf,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.an && impl.an(sendToApp)
			var view = impl.bi;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aZ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bg) && (_VirtualDom_doc.title = title = doc.bg);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.a8;
	var onUrlRequest = impl.a9;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		an: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aK === next.aK
							&& curr.az === next.az
							&& curr.aH.a === next.aH.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		a4: function(flags)
		{
			return A3(impl.a4, flags, _Browser_getUrl(), key);
		},
		bi: impl.bi,
		bh: impl.bh,
		bf: impl.bf
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a2: 'hidden', a_: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a2: 'mozHidden', a_: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a2: 'msHidden', a_: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a2: 'webkitHidden', a_: 'webkitvisibilitychange' }
		: { a2: 'hidden', a_: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aO: _Browser_getScene(),
		aT: {
			aV: _Browser_window.pageXOffset,
			aW: _Browser_window.pageYOffset,
			aU: _Browser_doc.documentElement.clientWidth,
			ay: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aU: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ay: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aO: {
				aU: node.scrollWidth,
				ay: node.scrollHeight
			},
			aT: {
				aV: node.scrollLeft,
				aW: node.scrollTop,
				aU: node.clientWidth,
				ay: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aO: _Browser_getScene(),
			aT: {
				aV: x,
				aW: y,
				aU: _Browser_doc.documentElement.clientWidth,
				ay: _Browser_doc.documentElement.clientHeight
			},
			a0: {
				aV: x + rect.left,
				aW: y + rect.top,
				aU: rect.width,
				ay: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.g) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.g * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.m) : builder.m;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.g);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{m: nodeList, g: (len / $elm$core$Array$branchFactor) | 0, i: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ax: fragment, az: host, aF: path, aH: port_, aK: protocol, aL: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$FS$Directory = 0;
var $author$project$ChirunPackageConfig$PackageSettingsTab = {$: 0};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$ChirunPackageConfig$blank_package = {f: _List_Nil, p: $elm$core$Dict$empty, ap: _List_Nil};
var $zwilias$elm_rosetree$Tree$Tree = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $zwilias$elm_rosetree$Tree$singleton = function (v) {
	return A2($zwilias$elm_rosetree$Tree$Tree, v, _List_Nil);
};
var $author$project$ChirunPackageConfig$blank_model = {
	ad: $elm$core$Maybe$Nothing,
	ae: $zwilias$elm_rosetree$Tree$singleton(
		{a7: '', n: 0}),
	aC: $elm$core$Dict$empty,
	ag: '',
	e: $author$project$ChirunPackageConfig$blank_package,
	q: $author$project$ChirunPackageConfig$PackageSettingsTab
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$FS$File = 1;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $zwilias$elm_rosetree$Tree$tree = $zwilias$elm_rosetree$Tree$Tree;
function $author$project$FS$cyclic$decode() {
	return A4(
		$elm$json$Json$Decode$map3,
		function (path) {
			return function (dirs) {
				return function (files) {
					return A2(
						$zwilias$elm_rosetree$Tree$tree,
						{a7: path, n: 0},
						_Utils_ap(dirs, files));
				};
			};
		},
		A2($elm$json$Json$Decode$field, 'path', $elm$json$Json$Decode$string),
		A2(
			$elm$json$Json$Decode$field,
			'dirs',
			$elm$json$Json$Decode$list(
				$elm$json$Json$Decode$lazy(
					function (_v0) {
						return $author$project$FS$cyclic$decode();
					}))),
		A2(
			$elm$json$Json$Decode$field,
			'files',
			$elm$json$Json$Decode$list(
				A2(
					$elm$json$Json$Decode$map,
					function (n) {
						return $zwilias$elm_rosetree$Tree$singleton(
							{a7: n, n: 1});
					},
					$elm$json$Json$Decode$string))));
}
var $author$project$FS$decode = $author$project$FS$cyclic$decode();
$author$project$FS$cyclic$decode = function () {
	return $author$project$FS$decode;
};
var $author$project$ChirunPackageConfig$Chapter = 2;
var $author$project$ChirunPackageConfig$Document = 3;
var $author$project$ChirunPackageConfig$Exam = 9;
var $author$project$ChirunPackageConfig$HTML = 8;
var $author$project$ChirunPackageConfig$Introduction = 0;
var $author$project$ChirunPackageConfig$Notebook = 6;
var $author$project$ChirunPackageConfig$Part = 1;
var $author$project$ChirunPackageConfig$Slides = 5;
var $author$project$ChirunPackageConfig$Standalone = 4;
var $author$project$ChirunPackageConfig$URL = 7;
var $author$project$ChirunPackageConfig$content_item_types = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$ChirunPackageConfig$item_type_code = function (type_) {
	switch (type_) {
		case 0:
			return 'introduction';
		case 1:
			return 'part';
		case 3:
			return 'document';
		case 2:
			return 'chapter';
		case 4:
			return 'standalone';
		case 7:
			return 'url';
		case 8:
			return 'html';
		case 5:
			return 'slides';
		case 9:
			return 'exam';
		default:
			return 'notebook';
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$ChirunPackageConfig$code_to_item_type = function (s) {
	return A2(
		$elm$core$Maybe$withDefault,
		2,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (x) {
					return _Utils_eq(
						$author$project$ChirunPackageConfig$item_type_code(x),
						s);
				},
				$author$project$ChirunPackageConfig$content_item_types)));
};
var $author$project$ChirunPackageConfig$StringSetting = function (a) {
	return {$: 0, a: a};
};
var $author$project$ChirunPackageConfig$BoolSetting = function (a) {
	return {$: 2, a: a};
};
var $author$project$ChirunPackageConfig$DictSetting = function (a) {
	return {$: 3, a: a};
};
var $author$project$ChirunPackageConfig$IntSetting = function (a) {
	return {$: 1, a: a};
};
var $author$project$ChirunPackageConfig$ListSetting = function (a) {
	return {$: 4, a: a};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
function $author$project$ChirunPackageConfig$cyclic$decode_setting() {
	return $elm$json$Json$Decode$maybe(
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$map, $author$project$ChirunPackageConfig$IntSetting, $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$map, $author$project$ChirunPackageConfig$StringSetting, $elm$json$Json$Decode$string),
					A2($elm$json$Json$Decode$map, $author$project$ChirunPackageConfig$BoolSetting, $elm$json$Json$Decode$bool),
					A2(
					$elm$json$Json$Decode$map,
					$author$project$ChirunPackageConfig$DictSetting,
					A2(
						$elm$json$Json$Decode$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Dict$toList,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$List$filterMap(
									function (_v1) {
										var k = _v1.a;
										var mv = _v1.b;
										return A2(
											$elm$core$Maybe$map,
											$elm$core$Tuple$pair(k),
											mv);
									}),
								$elm$core$Dict$fromList)),
						$elm$json$Json$Decode$dict(
							$elm$json$Json$Decode$lazy(
								function (_v0) {
									return $author$project$ChirunPackageConfig$cyclic$decode_setting();
								})))),
					A2(
					$elm$json$Json$Decode$map,
					$author$project$ChirunPackageConfig$ListSetting,
					A2(
						$elm$json$Json$Decode$map,
						$elm$core$List$filterMap($elm$core$Basics$identity),
						$elm$json$Json$Decode$list(
							$elm$json$Json$Decode$lazy(
								function (_v2) {
									return $author$project$ChirunPackageConfig$cyclic$decode_setting();
								}))))
				])));
}
var $author$project$ChirunPackageConfig$decode_setting = $author$project$ChirunPackageConfig$cyclic$decode_setting();
$author$project$ChirunPackageConfig$cyclic$decode_setting = function () {
	return $author$project$ChirunPackageConfig$decode_setting;
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Basics$not = _Basics_not;
var $author$project$ChirunPackageConfig$decode_settings = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Dict$map(
		function (_v0) {
			return $elm$core$Maybe$withDefault(
				$author$project$ChirunPackageConfig$StringSetting(''));
		}),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$filter(
			F2(
				function (k, v) {
					return (!A2(
						$elm$core$List$member,
						k,
						_List_fromArray(
							['content', 'type']))) && (!_Utils_eq(v, $elm$core$Maybe$Nothing));
				})),
		$elm$json$Json$Decode$dict($author$project$ChirunPackageConfig$decode_setting)));
function $author$project$ChirunPackageConfig$cyclic$decode_content_item() {
	return A4(
		$elm$json$Json$Decode$map3,
		F3(
			function (type_, mcontent, settings) {
				var item = {p: settings, n: type_};
				if (!mcontent.$) {
					var content = mcontent.a;
					return A2($zwilias$elm_rosetree$Tree$tree, item, content);
				} else {
					return $zwilias$elm_rosetree$Tree$singleton(item);
				}
			}),
		A2(
			$elm$json$Json$Decode$map,
			$author$project$ChirunPackageConfig$code_to_item_type,
			A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string)),
		$elm$json$Json$Decode$maybe(
			A2(
				$elm$json$Json$Decode$field,
				'content',
				$elm$json$Json$Decode$list(
					$elm$json$Json$Decode$lazy(
						function (_v1) {
							return $author$project$ChirunPackageConfig$cyclic$decode_content_item();
						})))),
		$author$project$ChirunPackageConfig$decode_settings);
}
var $author$project$ChirunPackageConfig$decode_content_item = $author$project$ChirunPackageConfig$cyclic$decode_content_item();
$author$project$ChirunPackageConfig$cyclic$decode_content_item = function () {
	return $author$project$ChirunPackageConfig$decode_content_item;
};
var $author$project$ChirunPackageConfig$decode_package = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (content, settings) {
			return {f: content, p: settings, ap: _List_Nil};
		}),
	A2(
		$elm$json$Json$Decode$field,
		'structure',
		$elm$json$Json$Decode$list($author$project$ChirunPackageConfig$decode_content_item)),
	$author$project$ChirunPackageConfig$decode_settings);
var $author$project$ChirunPackageConfig$decode_flags = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (files, _package, media_root) {
			return _Utils_update(
				$author$project$ChirunPackageConfig$blank_model,
				{ae: files, ag: media_root, e: _package});
		}),
	A2($elm$json$Json$Decode$field, 'files', $author$project$FS$decode),
	A2($elm$json$Json$Decode$field, 'config', $author$project$ChirunPackageConfig$decode_package),
	A2($elm$json$Json$Decode$field, 'media_root', $elm$json$Json$Decode$string));
var $author$project$ChirunPackageConfig$load_model = function (flags) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$ChirunPackageConfig$decode_flags, flags);
	if (!_v0.$) {
		var m = _v0.a;
		return m;
	} else {
		var err = _v0.a;
		return _Utils_update(
			$author$project$ChirunPackageConfig$blank_model,
			{
				ad: $elm$core$Maybe$Just(
					$elm$json$Json$Decode$errorToString(err))
			});
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$ChirunPackageConfig$init = function (flags) {
	return _Utils_Tuple2(
		$author$project$ChirunPackageConfig$load_model(flags),
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$ChirunPackageConfig$ContentItemTab = function (a) {
	return {$: 1, a: a};
};
var $author$project$ChirunPackageConfig$FocusButton = function (a) {
	return {$: 4, a: a};
};
var $zwilias$elm_rosetree$Tree$mapChildren = F2(
	function (f, _v0) {
		var v = _v0.a;
		var cs = _v0.b;
		return A2(
			$zwilias$elm_rosetree$Tree$Tree,
			v,
			f(cs));
	});
var $elm_community$list_extra$List$Extra$uncons = function (list) {
	if (!list.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var first = list.a;
		var rest = list.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(first, rest));
	}
};
var $lue_bird$elm_rosetree_path$Tree$Path$step = $elm_community$list_extra$List$Extra$uncons;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$updateAt = F3(
	function (index, fn, list) {
		if (index < 0) {
			return list;
		} else {
			var tail = A2($elm$core$List$drop, index, list);
			if (tail.b) {
				var x = tail.a;
				var xs = tail.b;
				return _Utils_ap(
					A2($elm$core$List$take, index, list),
					A2(
						$elm$core$List$cons,
						fn(x),
						xs));
			} else {
				return list;
			}
		}
	});
var $lue_bird$elm_rosetree_path$Tree$Navigate$alter = F2(
	function (path, updateAtPath) {
		var _v0 = $lue_bird$elm_rosetree_path$Tree$Path$step(path);
		if (_v0.$ === 1) {
			return updateAtPath;
		} else {
			var _v1 = _v0.a;
			var index = _v1.a;
			var further = _v1.b;
			return $zwilias$elm_rosetree$Tree$mapChildren(
				A2(
					$elm_community$list_extra$List$Extra$updateAt,
					index,
					A2($lue_bird$elm_rosetree_path$Tree$Navigate$alter, further, updateAtPath)));
		}
	});
var $lue_bird$elm_rosetree_path$Forest$Path$pathIntoTreeAtIndex = function (_v0) {
	var pathIntoTreeAtIndexValue = _v0.b;
	return pathIntoTreeAtIndexValue;
};
var $lue_bird$elm_rosetree_path$Forest$Path$treeIndex = function (_v0) {
	var treeIndexValue = _v0.a;
	return treeIndexValue;
};
var $lue_bird$elm_rosetree_path$Forest$Navigate$alter = F3(
	function (path, labelChange, nodes) {
		return A2(
			$elm$core$List$indexedMap,
			function (index) {
				return _Utils_eq(
					index,
					$lue_bird$elm_rosetree_path$Forest$Path$treeIndex(path)) ? A2(
					$lue_bird$elm_rosetree_path$Tree$Navigate$alter,
					$lue_bird$elm_rosetree_path$Forest$Path$pathIntoTreeAtIndex(path),
					labelChange) : $elm$core$Basics$identity;
			},
			nodes);
	});
var $zwilias$elm_rosetree$Tree$appendChild = F2(
	function (c, _v0) {
		var v = _v0.a;
		var cs = _v0.b;
		return A2(
			$zwilias$elm_rosetree$Tree$Tree,
			v,
			_Utils_ap(
				cs,
				_List_fromArray(
					[c])));
	});
var $author$project$ChirunPackageConfig$blank_contentitem = {p: $elm$core$Dict$empty, n: 2};
var $author$project$ChirunPackageConfig$add_item = F3(
	function (path, type_, _package) {
		return _Utils_update(
			_package,
			{
				f: A3(
					$lue_bird$elm_rosetree_path$Forest$Navigate$alter,
					path,
					$zwilias$elm_rosetree$Tree$appendChild(
						$zwilias$elm_rosetree$Tree$singleton(
							_Utils_update(
								$author$project$ChirunPackageConfig$blank_contentitem,
								{n: type_}))),
					_package.f)
			});
	});
var $author$project$ChirunPackageConfig$add_top_item = F2(
	function (type_, _package) {
		return _Utils_update(
			_package,
			{
				f: _Utils_ap(
					_package.f,
					_List_fromArray(
						[
							$zwilias$elm_rosetree$Tree$singleton(
							_Utils_update(
								$author$project$ChirunPackageConfig$blank_contentitem,
								{n: type_}))
						]))
			});
	});
var $zwilias$elm_rosetree$Tree$mapLabel = F2(
	function (f, _v0) {
		var v = _v0.a;
		var cs = _v0.b;
		return A2(
			$zwilias$elm_rosetree$Tree$Tree,
			f(v),
			cs);
	});
var $author$project$ChirunPackageConfig$apply_item_msg = F2(
	function (msg, tree) {
		switch (msg.$) {
			case 2:
				var type_ = msg.a;
				return A2(
					$zwilias$elm_rosetree$Tree$mapLabel,
					function (item) {
						return _Utils_update(
							item,
							{n: type_});
					},
					tree);
			case 1:
				var key = msg.a;
				var setting = msg.b;
				return A2(
					$zwilias$elm_rosetree$Tree$mapLabel,
					function (item) {
						return _Utils_update(
							item,
							{
								p: A3($elm$core$Dict$insert, key, setting, item.p)
							});
					},
					tree);
			case 3:
				return tree;
			default:
				return tree;
		}
	});
var $lue_bird$elm_rosetree_path$Tree$Path$follow = function (childIndices) {
	return childIndices;
};
var $lue_bird$elm_rosetree_path$Tree$Path$atTrunk = $lue_bird$elm_rosetree_path$Tree$Path$follow(_List_Nil);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $zwilias$elm_rosetree$Tree$children = function (_v0) {
	var c = _v0.b;
	return c;
};
var $elm_community$list_extra$List$Extra$removeAt = F2(
	function (index, l) {
		if (index < 0) {
			return l;
		} else {
			var _v0 = A2($elm$core$List$drop, index, l);
			if (!_v0.b) {
				return l;
			} else {
				var rest = _v0.b;
				return _Utils_ap(
					A2($elm$core$List$take, index, l),
					rest);
			}
		}
	});
var $lue_bird$elm_rosetree_path$Forest$Navigate$remove = function (path) {
	var _v0 = $lue_bird$elm_rosetree_path$Tree$Path$step(
		$lue_bird$elm_rosetree_path$Forest$Path$pathIntoTreeAtIndex(path));
	if (_v0.$ === 1) {
		return $elm_community$list_extra$List$Extra$removeAt(
			$lue_bird$elm_rosetree_path$Forest$Path$treeIndex(path));
	} else {
		var furtherInChildren = _v0.a;
		return A2(
			$elm_community$list_extra$List$Extra$updateAt,
			$lue_bird$elm_rosetree_path$Forest$Path$treeIndex(path),
			$zwilias$elm_rosetree$Tree$mapChildren(
				$lue_bird$elm_rosetree_path$Forest$Navigate$remove(furtherInChildren)));
	}
};
var $author$project$ChirunPackageConfig$delete_item = F2(
	function (path, _package) {
		return _Utils_update(
			_package,
			{
				f: A2($lue_bird$elm_rosetree_path$Forest$Navigate$remove, path, _package.f)
			});
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $lue_bird$elm_rosetree_path$Forest$Path$fromIndex = F2(
	function (treeIndexValue, pathIntoTreeAtIndexValue) {
		return _Utils_Tuple2(treeIndexValue, pathIntoTreeAtIndexValue);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$ChirunPackageConfig$last_index = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$length,
	$elm$core$Basics$add(-1));
var $author$project$ChirunPackageConfig$item_has_children = function (item) {
	var _v0 = item.n;
	if (_v0 === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Tree$Navigate$Extra$increment_path = function (path) {
	if (!path.b) {
		return _List_Nil;
	} else {
		if (!path.b.b) {
			var a = path.a;
			return _List_fromArray(
				[a + 1]);
		} else {
			var a = path.a;
			var rest = path.b;
			return A2(
				$elm$core$List$cons,
				a,
				$author$project$Tree$Navigate$Extra$increment_path(rest));
		}
	}
};
var $zwilias$elm_rosetree$Tree$label = function (_v0) {
	var v = _v0.a;
	return v;
};
var $lue_bird$elm_rosetree_path$Tree$Navigate$restructure = function (reduce) {
	return function (tree) {
		return reduce(
			{
				at: A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, childTree) {
							return A2(
								$lue_bird$elm_rosetree_path$Tree$Navigate$restructure,
								function (state) {
									return reduce(
										{
											at: state.at,
											aB: state.aB,
											aF: A2($elm$core$List$cons, index, state.aF)
										});
								},
								childTree);
						}),
					$zwilias$elm_rosetree$Tree$children(tree)),
				aB: $zwilias$elm_rosetree$Tree$label(tree),
				aF: $lue_bird$elm_rosetree_path$Tree$Path$atTrunk
			});
	};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm_community$list_extra$List$Extra$splitAt = F2(
	function (n, xs) {
		return _Utils_Tuple2(
			A2($elm$core$List$take, n, xs),
			A2($elm$core$List$drop, n, xs));
	});
var $elm_community$list_extra$List$Extra$swapAt = F3(
	function (index1, index2, l) {
		swapAt:
		while (true) {
			if (_Utils_eq(index1, index2) || (index1 < 0)) {
				return l;
			} else {
				if (_Utils_cmp(index1, index2) > 0) {
					var $temp$index1 = index2,
						$temp$index2 = index1,
						$temp$l = l;
					index1 = $temp$index1;
					index2 = $temp$index2;
					l = $temp$l;
					continue swapAt;
				} else {
					var _v0 = A2($elm_community$list_extra$List$Extra$splitAt, index1, l);
					var part1 = _v0.a;
					var tail1 = _v0.b;
					var _v1 = A2($elm_community$list_extra$List$Extra$splitAt, index2 - index1, tail1);
					var head2 = _v1.a;
					var tail2 = _v1.b;
					var _v2 = _Utils_Tuple2(
						$elm_community$list_extra$List$Extra$uncons(head2),
						$elm_community$list_extra$List$Extra$uncons(tail2));
					if ((!_v2.a.$) && (!_v2.b.$)) {
						var _v3 = _v2.a.a;
						var value1 = _v3.a;
						var part2 = _v3.b;
						var _v4 = _v2.b.a;
						var value2 = _v4.a;
						var part3 = _v4.b;
						return $elm$core$List$concat(
							_List_fromArray(
								[
									part1,
									A2($elm$core$List$cons, value2, part2),
									A2($elm$core$List$cons, value1, part3)
								]));
					} else {
						return l;
					}
				}
			}
		}
	});
var $author$project$Tree$Navigate$Extra$move_down = F2(
	function (path, forest) {
		var fi = path.a;
		var tpath = path.b;
		if (_Utils_eq(
			fi,
			$elm$core$List$length(forest) - 1)) {
			return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
		} else {
			if (!tpath.b) {
				return _Utils_Tuple2(
					A3($elm_community$list_extra$List$Extra$swapAt, fi, fi + 1, forest),
					$elm$core$Maybe$Just(
						_Utils_Tuple2(fi + 1, tpath)));
			} else {
				return function (f) {
					return _Utils_Tuple2(
						A2(
							$elm$core$List$concatMap,
							$elm$core$Basics$identity,
							A2($elm$core$List$map, $elm$core$Tuple$first, f)),
						$elm$core$List$head(
							A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								A2($elm$core$List$map, $elm$core$Tuple$second, f))));
				}(
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (fn, tree) {
								return _Utils_eq(fn, fi) ? function (_v4) {
									var trees = _v4.a;
									var mpath = _v4.b;
									return _Utils_Tuple2(
										trees,
										function () {
											var _v5 = _Utils_Tuple2(trees, mpath);
											if (_v5.b.$ === 1) {
												var _v6 = _v5.b;
												return $elm$core$Maybe$Nothing;
											} else {
												if (_v5.a.b) {
													if (!_v5.a.b.b) {
														var _v7 = _v5.a;
														var x = _v7.a;
														var npath = _v5.b.a;
														return $elm$core$Maybe$Just(
															_Utils_Tuple2(fi, npath));
													} else {
														var _v8 = _v5.a;
														var a = _v8.a;
														var _v9 = _v8.b;
														var b = _v9.a;
														var npath = _v5.b.a;
														return $elm$core$Maybe$Just(
															_Utils_Tuple2(fi + 1, _List_Nil));
													}
												} else {
													return $elm$core$Maybe$Nothing;
												}
											}
										}());
								}(
									A2(
										$lue_bird$elm_rosetree_path$Tree$Navigate$restructure,
										function (sub) {
											var children = A2(
												$elm$core$List$concatMap,
												$elm$core$Basics$identity,
												A2($elm$core$List$map, $elm$core$Tuple$first, sub.at));
											var mi = A2(
												$elm_community$list_extra$List$Extra$find,
												function (_v3) {
													var i = _v3.a;
													var c = _v3.b;
													return _Utils_eq(
														_Utils_ap(
															sub.aF,
															_List_fromArray(
																[i])),
														tpath);
												},
												A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, children));
											var num_children = $elm$core$List$length(children);
											var li = num_children - 1;
											var child_path = $elm$core$List$head(
												A2($elm$core$List$filterMap, $elm$core$Tuple$second, sub.at));
											if (!mi.$) {
												var _v2 = mi.a;
												var i = _v2.a;
												var c = _v2.b;
												return _Utils_eq(i, li) ? _Utils_Tuple2(
													_Utils_ap(
														_List_fromArray(
															[
																A2(
																$zwilias$elm_rosetree$Tree$tree,
																sub.aB,
																A2($elm$core$List$take, li, children))
															]),
														_List_fromArray(
															[c])),
													$elm$core$Maybe$Just(
														$author$project$Tree$Navigate$Extra$increment_path(sub.aF))) : _Utils_Tuple2(
													_List_fromArray(
														[
															A2(
															$zwilias$elm_rosetree$Tree$tree,
															sub.aB,
															A2(
																$elm$core$List$concatMap,
																$elm$core$Basics$identity,
																A2(
																	$elm$core$List$map,
																	$elm$core$Tuple$first,
																	A3($elm_community$list_extra$List$Extra$swapAt, i, i + 1, sub.at))))
														]),
													$elm$core$Maybe$Just(
														_Utils_ap(
															sub.aF,
															_List_fromArray(
																[i + 1]))));
											} else {
												return _Utils_Tuple2(
													_List_fromArray(
														[
															A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children)
														]),
													child_path);
											}
										},
										tree)) : _Utils_Tuple2(
									_List_fromArray(
										[tree]),
									$elm$core$Maybe$Nothing);
							}),
						forest));
			}
		}
	});
var $author$project$Tree$Navigate$Extra$alter_with_side_effect = F3(
	function (i, fn, forest) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (_v0, _v1) {
					var j = _v0.a;
					var tree = _v0.b;
					var f2 = _v1.a;
					var b = _v1.b;
					return _Utils_eq(j, i) ? function (_v2) {
						var t2 = _v2.a;
						var b2 = _v2.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, t2, f2),
							$elm$core$Maybe$Just(b2));
					}(
						fn(tree)) : _Utils_Tuple2(
						A2($elm$core$List$cons, tree, f2),
						b);
				}),
			_Utils_Tuple2(_List_Nil, $elm$core$Maybe$Nothing),
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, forest));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $zwilias$elm_rosetree$Tree$Zipper$firstOf = F2(
	function (options, v) {
		firstOf:
		while (true) {
			if (!options.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var option = options.a;
				var rest = options.b;
				var _v1 = option(v);
				if (!_v1.$) {
					var r = _v1.a;
					return $elm$core$Maybe$Just(r);
				} else {
					var $temp$options = rest,
						$temp$v = v;
					options = $temp$options;
					v = $temp$v;
					continue firstOf;
				}
			}
		}
	});
var $zwilias$elm_rosetree$Tree$Zipper$Zipper = $elm$core$Basics$identity;
var $zwilias$elm_rosetree$Tree$Zipper$lastChild = function (_v0) {
	var zipper = _v0;
	var _v1 = $elm$core$List$reverse(
		$zwilias$elm_rosetree$Tree$children(zipper.d));
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var c = _v1.a;
		var rest = _v1.b;
		return $elm$core$Maybe$Just(
			{
				b: _List_Nil,
				c: rest,
				o: A2(
					$elm$core$List$cons,
					{
						b: zipper.b,
						c: zipper.c,
						aB: $zwilias$elm_rosetree$Tree$label(zipper.d)
					},
					zipper.o),
				d: c
			});
	}
};
var $zwilias$elm_rosetree$Tree$Zipper$lastDescendant = function (zipper) {
	lastDescendant:
	while (true) {
		var _v0 = $zwilias$elm_rosetree$Tree$Zipper$lastChild(zipper);
		if (_v0.$ === 1) {
			return zipper;
		} else {
			var child = _v0.a;
			var $temp$zipper = child;
			zipper = $temp$zipper;
			continue lastDescendant;
		}
	}
};
var $zwilias$elm_rosetree$Tree$Zipper$reconstruct = F4(
	function (focus, before, after, l) {
		return A2(
			$zwilias$elm_rosetree$Tree$tree,
			l,
			_Utils_ap(
				$elm$core$List$reverse(before),
				_Utils_ap(
					_List_fromArray(
						[focus]),
					after)));
	});
var $zwilias$elm_rosetree$Tree$Zipper$parent = function (_v0) {
	var zipper = _v0;
	var _v1 = zipper.o;
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var crumb = _v1.a;
		var rest = _v1.b;
		return $elm$core$Maybe$Just(
			{
				b: crumb.b,
				c: crumb.c,
				o: rest,
				d: A4($zwilias$elm_rosetree$Tree$Zipper$reconstruct, zipper.d, zipper.c, zipper.b, crumb.aB)
			});
	}
};
var $zwilias$elm_rosetree$Tree$Zipper$previousSibling = function (_v0) {
	var zipper = _v0;
	var _v1 = zipper.c;
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var previous = _v1.a;
		var rest = _v1.b;
		return $elm$core$Maybe$Just(
			{
				b: A2($elm$core$List$cons, zipper.d, zipper.b),
				c: rest,
				o: zipper.o,
				d: previous
			});
	}
};
var $zwilias$elm_rosetree$Tree$Zipper$backward = function (zipper) {
	return A2(
		$zwilias$elm_rosetree$Tree$Zipper$firstOf,
		_List_fromArray(
			[
				A2(
				$elm$core$Basics$composeR,
				$zwilias$elm_rosetree$Tree$Zipper$previousSibling,
				$elm$core$Maybe$map($zwilias$elm_rosetree$Tree$Zipper$lastDescendant)),
				$zwilias$elm_rosetree$Tree$Zipper$parent
			]),
		zipper);
};
var $zwilias$elm_rosetree$Tree$Zipper$tree = function (_v0) {
	var focus = _v0.d;
	return focus;
};
var $zwilias$elm_rosetree$Tree$Zipper$label = function (zipper) {
	return $zwilias$elm_rosetree$Tree$label(
		$zwilias$elm_rosetree$Tree$Zipper$tree(zipper));
};
var $zwilias$elm_rosetree$Tree$Zipper$find = F3(
	function (predicate, move, zipper) {
		find:
		while (true) {
			var _v0 = move(zipper);
			if (!_v0.$) {
				var next = _v0.a;
				if (predicate(
					$zwilias$elm_rosetree$Tree$Zipper$label(next))) {
					return $elm$core$Maybe$Just(next);
				} else {
					var $temp$predicate = predicate,
						$temp$move = move,
						$temp$zipper = next;
					predicate = $temp$predicate;
					move = $temp$move;
					zipper = $temp$zipper;
					continue find;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $zwilias$elm_rosetree$Tree$Zipper$findPrevious = F2(
	function (f, zipper) {
		return A3($zwilias$elm_rosetree$Tree$Zipper$find, f, $zwilias$elm_rosetree$Tree$Zipper$backward, zipper);
	});
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $zwilias$elm_rosetree$Tree$Zipper$firstChild = function (_v0) {
	var zipper = _v0;
	var _v1 = $zwilias$elm_rosetree$Tree$children(zipper.d);
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var c = _v1.a;
		var cs = _v1.b;
		return $elm$core$Maybe$Just(
			{
				b: cs,
				c: _List_Nil,
				o: A2(
					$elm$core$List$cons,
					{
						b: zipper.b,
						c: zipper.c,
						aB: $zwilias$elm_rosetree$Tree$label(zipper.d)
					},
					zipper.o),
				d: c
			});
	}
};
var $zwilias$elm_rosetree$Tree$Zipper$fromTree = function (t) {
	return {b: _List_Nil, c: _List_Nil, o: _List_Nil, d: t};
};
var $zwilias$elm_rosetree$Tree$Zipper$nextSibling = function (_v0) {
	var zipper = _v0;
	var _v1 = zipper.b;
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var next = _v1.a;
		var rest = _v1.b;
		return $elm$core$Maybe$Just(
			{
				b: rest,
				c: A2($elm$core$List$cons, zipper.d, zipper.c),
				o: zipper.o,
				d: next
			});
	}
};
var $author$project$Tree$Navigate$Extra$path_to_zipper = F2(
	function (path, tree) {
		var topzip = $zwilias$elm_rosetree$Tree$Zipper$fromTree(tree);
		var step = F2(
			function (p, z) {
				if (!p.b) {
					return $elm$core$Maybe$Just(z);
				} else {
					var a = p.a;
					var rest = p.b;
					return A2(
						$elm$core$Maybe$andThen,
						step(rest),
						A3(
							$elm$core$List$foldl,
							F2(
								function (_v1, z2) {
									return A2($elm$core$Maybe$andThen, $zwilias$elm_rosetree$Tree$Zipper$nextSibling, z2);
								}),
							$zwilias$elm_rosetree$Tree$Zipper$firstChild(z),
							A2($elm$core$List$range, 1, a)));
				}
			});
		return A2(step, path, topzip);
	});
var $zwilias$elm_rosetree$Tree$Zipper$siblingsBeforeFocus = function (_v0) {
	var before = _v0.c;
	return $elm$core$List$reverse(before);
};
var $author$project$Tree$Navigate$Extra$zipper_to_path = function (z) {
	var _v0 = $zwilias$elm_rosetree$Tree$Zipper$parent(z);
	if (_v0.$ === 1) {
		return _List_Nil;
	} else {
		var pz = _v0.a;
		var ppath = $author$project$Tree$Navigate$Extra$zipper_to_path(pz);
		var n = $elm$core$List$length(
			$zwilias$elm_rosetree$Tree$Zipper$siblingsBeforeFocus(z));
		return _Utils_ap(
			ppath,
			_List_fromArray(
				[n]));
	}
};
var $author$project$Tree$Navigate$Extra$move_right = F3(
	function (has_children, path, forest) {
		var i = path.a;
		var tpath = path.b;
		if (!path.b.b) {
			if (!path.a) {
				return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
			} else {
				var _v1 = _Utils_Tuple2(
					A2($elm_community$list_extra$List$Extra$getAt, i - 1, forest),
					A2($elm_community$list_extra$List$Extra$getAt, i, forest));
				if ((!_v1.a.$) && (!_v1.b.$)) {
					var ptree = _v1.a.a;
					var tree = _v1.b.a;
					return has_children(
						$zwilias$elm_rosetree$Tree$label(ptree)) ? function (_v2) {
						var f = _v2.a;
						var p = _v2.b;
						return _Utils_Tuple2(
							A2($elm_community$list_extra$List$Extra$removeAt, i, f),
							p);
					}(
						A3(
							$author$project$Tree$Navigate$Extra$alter_with_side_effect,
							i - 1,
							function (t) {
								return _Utils_Tuple2(
									A2(
										$zwilias$elm_rosetree$Tree$tree,
										$zwilias$elm_rosetree$Tree$label(t),
										_Utils_ap(
											$zwilias$elm_rosetree$Tree$children(t),
											_List_fromArray(
												[tree]))),
									_Utils_Tuple2(
										i - 1,
										_List_fromArray(
											[
												$elm$core$List$length(
												$zwilias$elm_rosetree$Tree$children(t))
											])));
							},
							forest)) : _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
				}
			}
		} else {
			return _Utils_eq(
				$elm$core$List$head(
					$elm$core$List$reverse(tpath)),
				$elm$core$Maybe$Just(0)) ? _Utils_Tuple2(forest, $elm$core$Maybe$Nothing) : function (_v5) {
				var f = _v5.a;
				var mp = _v5.b;
				return _Utils_Tuple2(
					f,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(i),
						A2($elm$core$Maybe$andThen, $elm$core$Basics$identity, mp)));
			}(
				A3(
					$author$project$Tree$Navigate$Extra$alter_with_side_effect,
					i,
					function (tree) {
						var zipper = A2($author$project$Tree$Navigate$Extra$path_to_zipper, tpath, tree);
						var prev = A2(
							$elm$core$Maybe$andThen,
							$zwilias$elm_rosetree$Tree$Zipper$findPrevious(has_children),
							zipper);
						var _v3 = _Utils_Tuple2(zipper, prev);
						if ((!_v3.a.$) && (!_v3.b.$)) {
							var z = _v3.a.a;
							var pz = _v3.b.a;
							var t = $zwilias$elm_rosetree$Tree$Zipper$tree(z);
							var prev_path = $author$project$Tree$Navigate$Extra$zipper_to_path(pz);
							var p = $zwilias$elm_rosetree$Tree$Zipper$label(pz);
							if (has_children(p)) {
								var step = function (sub) {
									var side_effect_children = A2(
										$elm$core$List$filterMap,
										function (_v4) {
											var keep = _v4.a;
											var c = _v4.b;
											return keep ? $elm$core$Maybe$Just(c) : $elm$core$Maybe$Nothing;
										},
										sub.at);
									var npath = $elm$core$List$head(
										A2(
											$elm$core$List$filterMap,
											$elm$core$Basics$identity,
											A2($elm$core$List$map, $elm$core$Tuple$second, side_effect_children)));
									var children = A2($elm$core$List$map, $elm$core$Tuple$first, side_effect_children);
									return (_Utils_eq(
										sub.aF,
										A2(
											$elm$core$List$take,
											$elm$core$List$length(sub.aF),
											tpath)) && (($elm$core$List$length(tpath) - $elm$core$List$length(sub.aF)) <= 1)) ? _Utils_Tuple2(
										false,
										_Utils_Tuple2(
											A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children),
											$elm$core$Maybe$Nothing)) : (_Utils_eq(sub.aF, prev_path) ? _Utils_Tuple2(
										true,
										_Utils_Tuple2(
											A2(
												$zwilias$elm_rosetree$Tree$tree,
												sub.aB,
												_Utils_ap(
													children,
													_List_fromArray(
														[t]))),
											$elm$core$Maybe$Just(
												_Utils_ap(
													sub.aF,
													_List_fromArray(
														[
															$elm$core$List$length(children)
														]))))) : _Utils_Tuple2(
										true,
										_Utils_Tuple2(
											A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children),
											npath)));
								};
								return A2($lue_bird$elm_rosetree_path$Tree$Navigate$restructure, step, tree).b;
							} else {
								return _Utils_Tuple2(tree, $elm$core$Maybe$Nothing);
							}
						} else {
							return _Utils_Tuple2(tree, $elm$core$Maybe$Nothing);
						}
					},
					forest));
		}
	});
var $lue_bird$elm_rosetree_path$Tree$Navigate$to = function (path) {
	var _v0 = $lue_bird$elm_rosetree_path$Tree$Path$step(path);
	if (_v0.$ === 1) {
		return $elm$core$Maybe$Just;
	} else {
		var _v1 = _v0.a;
		var index = _v1.a;
		var further = _v1.b;
		return function (tree) {
			return A2(
				$elm$core$Maybe$andThen,
				$lue_bird$elm_rosetree_path$Tree$Navigate$to(further),
				A2(
					$elm_community$list_extra$List$Extra$getAt,
					index,
					$zwilias$elm_rosetree$Tree$children(tree)));
		};
	}
};
var $lue_bird$elm_rosetree_path$Forest$Navigate$to = function (path) {
	return function (forest) {
		return A2(
			$elm$core$Maybe$andThen,
			$lue_bird$elm_rosetree_path$Tree$Navigate$to(
				$lue_bird$elm_rosetree_path$Forest$Path$pathIntoTreeAtIndex(path)),
			A2(
				$elm_community$list_extra$List$Extra$getAt,
				$lue_bird$elm_rosetree_path$Forest$Path$treeIndex(path),
				forest));
	};
};
var $author$project$Tree$Navigate$Extra$move_up = F2(
	function (path, forest) {
		var i = path.a;
		var tpath = path.b;
		var mtree = A2($elm_community$list_extra$List$Extra$getAt, i, forest);
		var prev_path = A2(
			$elm$core$Maybe$map,
			$author$project$Tree$Navigate$Extra$zipper_to_path,
			A2(
				$elm$core$Maybe$andThen,
				$zwilias$elm_rosetree$Tree$Zipper$backward,
				A2(
					$elm$core$Maybe$andThen,
					function (tree) {
						return A2($author$project$Tree$Navigate$Extra$path_to_zipper, tpath, tree);
					},
					mtree)));
		if (!path.b.b) {
			if (!path.a) {
				return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
			} else {
				return _Utils_Tuple2(
					A3($elm_community$list_extra$List$Extra$swapAt, i - 1, i, forest),
					$elm$core$Maybe$Just(
						_Utils_Tuple2(i - 1, tpath)));
			}
		} else {
			if ((!path.b.a) && (!path.b.b.b)) {
				var _v1 = path.b;
				var _v2 = A2($lue_bird$elm_rosetree_path$Forest$Navigate$to, path, forest);
				if (!_v2.$) {
					var t = _v2.a;
					return _Utils_Tuple2(
						_Utils_ap(
							A2($elm$core$List$take, i, forest),
							_Utils_ap(
								_List_fromArray(
									[t]),
								A2(
									$elm$core$List$drop,
									i,
									A2($lue_bird$elm_rosetree_path$Forest$Navigate$remove, path, forest)))),
						$elm$core$Maybe$Just(
							_Utils_Tuple2(i, _List_Nil)));
				} else {
					return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
				}
			} else {
				var _v3 = $elm$core$List$head(
					$elm$core$List$reverse(tpath));
				if (!_v3.$) {
					if (!_v3.a) {
						return function (_v6) {
							var f = _v6.a;
							var mp = _v6.b;
							return _Utils_Tuple2(
								f,
								A2(
									$elm$core$Maybe$map,
									$elm$core$Tuple$pair(i),
									A2($elm$core$Maybe$andThen, $elm$core$Basics$identity, mp)));
						}(
							A3(
								$author$project$Tree$Navigate$Extra$alter_with_side_effect,
								i,
								function (tree) {
									return function (_v5) {
										var fs = _v5.a;
										var mp = _v5.b;
										return _Utils_Tuple2(
											A2(
												$elm$core$Maybe$withDefault,
												tree,
												$elm$core$List$head(fs)),
											mp);
									}(
										A2(
											$lue_bird$elm_rosetree_path$Tree$Navigate$restructure,
											function (sub) {
												var npath = $elm$core$List$head(
													A2(
														$elm$core$List$filterMap,
														$elm$core$Basics$identity,
														A2($elm$core$List$map, $elm$core$Tuple$second, sub.at)));
												var children = A2(
													$elm$core$List$concatMap,
													$elm$core$Basics$identity,
													A2($elm$core$List$map, $elm$core$Tuple$first, sub.at));
												if (_Utils_eq(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$drop,
															1,
															$elm$core$List$reverse(tpath))),
													sub.aF)) {
													var _v4 = $elm$core$List$head(children);
													if (!_v4.$) {
														var c = _v4.a;
														return _Utils_Tuple2(
															_List_fromArray(
																[
																	c,
																	A2(
																	$zwilias$elm_rosetree$Tree$tree,
																	sub.aB,
																	A2($elm$core$List$drop, 1, children))
																]),
															$elm$core$Maybe$Just(sub.aF));
													} else {
														return _Utils_Tuple2(
															_List_fromArray(
																[
																	A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children)
																]),
															npath);
													}
												} else {
													return _Utils_Tuple2(
														_List_fromArray(
															[
																A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children)
															]),
														npath);
												}
											},
											tree));
								},
								forest));
					} else {
						var n = _v3.a;
						return function (_v7) {
							var f = _v7.a;
							var mp = _v7.b;
							return _Utils_Tuple2(
								f,
								A2(
									$elm$core$Maybe$map,
									$elm$core$Tuple$pair(i),
									A2($elm$core$Maybe$andThen, $elm$core$Basics$identity, mp)));
						}(
							A3(
								$author$project$Tree$Navigate$Extra$alter_with_side_effect,
								i,
								function (tree) {
									return A2(
										$lue_bird$elm_rosetree_path$Tree$Navigate$restructure,
										function (sub) {
											var npath = $elm$core$List$head(
												A2(
													$elm$core$List$filterMap,
													$elm$core$Basics$identity,
													A2($elm$core$List$map, $elm$core$Tuple$second, sub.at)));
											var children = A2($elm$core$List$map, $elm$core$Tuple$first, sub.at);
											return _Utils_eq(
												$elm$core$List$reverse(
													A2(
														$elm$core$List$drop,
														1,
														$elm$core$List$reverse(tpath))),
												sub.aF) ? _Utils_Tuple2(
												A2(
													$zwilias$elm_rosetree$Tree$tree,
													sub.aB,
													A3($elm_community$list_extra$List$Extra$swapAt, n - 1, n, children)),
												$elm$core$Maybe$Just(
													_Utils_ap(
														sub.aF,
														_List_fromArray(
															[n - 1])))) : _Utils_Tuple2(
												A2($zwilias$elm_rosetree$Tree$tree, sub.aB, children),
												npath);
										},
										tree);
								},
								forest));
					}
				} else {
					return _Utils_Tuple2(forest, $elm$core$Maybe$Nothing);
				}
			}
		}
	});
var $author$project$ChirunPackageConfig$move_item = function (direction) {
	switch (direction) {
		case 0:
			return $author$project$Tree$Navigate$Extra$move_up;
		case 1:
			return $author$project$Tree$Navigate$Extra$move_down;
		default:
			return $author$project$Tree$Navigate$Extra$move_right($author$project$ChirunPackageConfig$item_has_children);
	}
};
var $author$project$ChirunPackageConfig$nocmd = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$ChirunPackageConfig$set_package_setting = F4(
	function (whole_path, key, setting, _package) {
		var visit = F2(
			function (settings, path) {
				if (!path.b) {
					return A3($elm$core$Dict$insert, key, setting, settings);
				} else {
					var a = path.a;
					var rest = path.b;
					var _v1 = A2($elm$core$Dict$get, a, settings);
					if (!_v1.$) {
						if (_v1.a.$ === 3) {
							var s = _v1.a.a;
							return A3(
								$elm$core$Dict$insert,
								a,
								$author$project$ChirunPackageConfig$DictSetting(
									A2(visit, s, rest)),
								settings);
						} else {
							return settings;
						}
					} else {
						return A3(
							$elm$core$Dict$insert,
							a,
							$author$project$ChirunPackageConfig$DictSetting(
								A2(visit, $elm$core$Dict$empty, rest)),
							settings);
					}
				}
			});
		return _Utils_update(
			_package,
			{
				p: A2(visit, _package.p, whole_path)
			});
	});
var $lue_bird$elm_rosetree_path$Tree$Path$toChild = function (childIndex) {
	return function (path) {
		return _Utils_ap(
			path,
			_List_fromArray(
				[childIndex]));
	};
};
var $lue_bird$elm_rosetree_path$Forest$Path$toChild = function (childIndex) {
	return function (forestPath) {
		return A2(
			$lue_bird$elm_rosetree_path$Forest$Path$fromIndex,
			$lue_bird$elm_rosetree_path$Forest$Path$treeIndex(forestPath),
			A2(
				$lue_bird$elm_rosetree_path$Tree$Path$toChild,
				childIndex,
				$lue_bird$elm_rosetree_path$Forest$Path$pathIntoTreeAtIndex(forestPath)));
	};
};
var $author$project$ChirunPackageConfig$update_item = F3(
	function (path, fn, _package) {
		return _Utils_update(
			_package,
			{
				f: A3($lue_bird$elm_rosetree_path$Forest$Navigate$alter, path, fn, _package.f)
			});
	});
var $author$project$ChirunPackageConfig$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 4:
				return $author$project$ChirunPackageConfig$nocmd(model);
			case 1:
				switch (msg.a.$) {
					case 3:
						var _v1 = msg.a;
						var direction = _v1.a;
						var button_id = _v1.b;
						var path = msg.b;
						var _package = model.e;
						var _v2 = A3($author$project$ChirunPackageConfig$move_item, direction, path, _package.f);
						var ncontent = _v2.a;
						var npath = _v2.b;
						var tab = A2(
							$elm$core$Maybe$withDefault,
							model.q,
							A2($elm$core$Maybe$map, $author$project$ChirunPackageConfig$ContentItemTab, npath));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									e: _Utils_update(
										_package,
										{f: ncontent}),
									q: tab
								}),
							A2(
								$elm$core$Task$attempt,
								$author$project$ChirunPackageConfig$FocusButton,
								$elm$browser$Browser$Dom$focus(button_id)));
					case 0:
						var _v3 = msg.a;
						var path = msg.b;
						var tab = function () {
							var _v4 = model.q;
							if (_v4.$ === 1) {
								var p2 = _v4.a;
								return _Utils_eq(p2, path) ? $author$project$ChirunPackageConfig$PackageSettingsTab : model.q;
							} else {
								return model.q;
							}
						}();
						var npackage = A2($author$project$ChirunPackageConfig$delete_item, path, model.e);
						return $author$project$ChirunPackageConfig$nocmd(
							_Utils_update(
								model,
								{e: npackage, q: tab}));
					default:
						var item_msg = msg.a;
						var path = msg.b;
						return $author$project$ChirunPackageConfig$nocmd(
							_Utils_update(
								model,
								{
									e: A3(
										$author$project$ChirunPackageConfig$update_item,
										path,
										$author$project$ChirunPackageConfig$apply_item_msg(item_msg),
										model.e)
								}));
				}
			case 3:
				var mpath = msg.a;
				var type_ = msg.b;
				if (!mpath.$) {
					var path = mpath.a;
					var npackage = A3($author$project$ChirunPackageConfig$add_item, path, type_, model.e);
					var npath = A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$zwilias$elm_rosetree$Tree$children,
							A2(
								$elm$core$Basics$composeR,
								$author$project$ChirunPackageConfig$last_index,
								A2(
									$elm$core$Basics$composeR,
									function (i) {
										return A2($lue_bird$elm_rosetree_path$Forest$Path$toChild, i, path);
									},
									$author$project$ChirunPackageConfig$ContentItemTab))),
						A2($lue_bird$elm_rosetree_path$Forest$Navigate$to, path, npackage.f));
					var tab = A2($elm$core$Maybe$withDefault, model.q, npath);
					return $author$project$ChirunPackageConfig$nocmd(
						_Utils_update(
							model,
							{e: npackage, q: tab}));
				} else {
					var npackage = A2($author$project$ChirunPackageConfig$add_top_item, type_, model.e);
					return $author$project$ChirunPackageConfig$nocmd(
						_Utils_update(
							model,
							{
								e: npackage,
								q: $author$project$ChirunPackageConfig$ContentItemTab(
									A2(
										$lue_bird$elm_rosetree_path$Forest$Path$fromIndex,
										$author$project$ChirunPackageConfig$last_index(npackage.f),
										$lue_bird$elm_rosetree_path$Tree$Path$atTrunk))
							}));
				}
			case 0:
				var tab = msg.a;
				return $author$project$ChirunPackageConfig$nocmd(
					_Utils_update(
						model,
						{q: tab}));
			default:
				var path = msg.a;
				var key = msg.b;
				var setting = msg.c;
				return $author$project$ChirunPackageConfig$nocmd(
					_Utils_update(
						model,
						{
							e: A4($author$project$ChirunPackageConfig$set_package_setting, path, key, setting, model.e)
						}));
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$ChirunPackageConfig$AddItem = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Localise$localise = $elm$core$Basics$identity;
var $author$project$ChirunPackageConfig$item_type_name = function (type_) {
	switch (type_) {
		case 0:
			return $author$project$Localise$localise('Introduction');
		case 1:
			return $author$project$Localise$localise('Part');
		case 3:
			return $author$project$Localise$localise('Document');
		case 2:
			return $author$project$Localise$localise('Chapter');
		case 4:
			return $author$project$Localise$localise('Standalone');
		case 7:
			return $author$project$Localise$localise('URL');
		case 8:
			return $author$project$Localise$localise('HTML');
		case 5:
			return $author$project$Localise$localise('Slides');
		case 9:
			return $author$project$Localise$localise('Exam');
		default:
			return $author$project$Localise$localise('Notebook');
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Html$ChirunExtra$role = $elm$html$Html$Attributes$attribute('role');
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Html$ChirunExtra$text = A2($elm$core$Basics$composeR, $author$project$Localise$localise, $elm$html$Html$text);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$ChirunPackageConfig$create_item_tab = function (path) {
	var type_selector = F2(
		function (type_, description) {
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('item-type')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								A2($author$project$ChirunPackageConfig$AddItem, path, type_)),
								$elm$html$Html$Attributes$type_('button')
							]),
						_List_fromArray(
							[
								$author$project$Html$ChirunExtra$text(
								$author$project$ChirunPackageConfig$item_type_name(type_))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-hint')
							]),
						_List_fromArray(
							[
								$author$project$Html$ChirunExtra$text(description)
							]))
					]));
		});
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('create-item'),
				$author$project$Html$ChirunExtra$role('tabpanel')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$author$project$Html$ChirunExtra$text('Adding a new item')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input-hint')
					]),
				_List_fromArray(
					[
						$author$project$Html$ChirunExtra$text('Select a type for this item.')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				_List_fromArray(
					[
						A2(type_selector, 0, 'The index page for the course.'),
						A2(type_selector, 1, 'A group of items.'),
						A2(type_selector, 2, 'A single document, or a chapter from a longer document.'),
						A2(type_selector, 3, 'A single document, automatically split into separate pages.'),
						A2(type_selector, 4, 'A single document with no links to other items.'),
						A2(type_selector, 5, 'Slides for presentation.'),
						A2(type_selector, 6, 'A code notebook, with an automatically-created Jupyter notebook version.'),
						A2(type_selector, 7, 'A link to a given address.'),
						A2(type_selector, 8, 'A single passage of HTML code.')
					]))
			]));
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$ChirunPackageConfig$encode_setting = function (setting) {
	switch (setting.$) {
		case 0:
			var s = setting.a;
			return $elm$json$Json$Encode$string(s);
		case 1:
			var i = setting.a;
			return $elm$json$Json$Encode$int(i);
		case 2:
			var b = setting.a;
			return $elm$json$Json$Encode$bool(b);
		case 3:
			var d = setting.a;
			return A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $author$project$ChirunPackageConfig$encode_setting, d);
		default:
			var l = setting.a;
			return A2($elm$json$Json$Encode$list, $author$project$ChirunPackageConfig$encode_setting, l);
	}
};
var $author$project$ChirunPackageConfig$encode_settings = function (settings) {
	return $elm$core$Dict$toList(
		A2(
			$elm$core$Dict$map,
			function (_v0) {
				return $author$project$ChirunPackageConfig$encode_setting;
			},
			settings));
};
var $author$project$ChirunPackageConfig$item_children = function (tree) {
	return $author$project$ChirunPackageConfig$item_has_children(
		$zwilias$elm_rosetree$Tree$label(tree)) ? $elm$core$Maybe$Just(
		$zwilias$elm_rosetree$Tree$children(tree)) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$ChirunPackageConfig$encode_content_item = function (tree) {
	var item = $zwilias$elm_rosetree$Tree$label(tree);
	var children = $author$project$ChirunPackageConfig$item_children(tree);
	return $elm$json$Json$Encode$object(
		_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string(
						$author$project$ChirunPackageConfig$item_type_code(item.n)))
				]),
			_Utils_ap(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						function (c) {
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'content',
									A2($elm$json$Json$Encode$list, $author$project$ChirunPackageConfig$encode_content_item, c))
								]);
						},
						children)),
				$author$project$ChirunPackageConfig$encode_settings(item.p))));
};
var $author$project$ChirunPackageConfig$encode_package = function (_package) {
	return $elm$json$Json$Encode$object(
		_Utils_ap(
			$author$project$ChirunPackageConfig$encode_settings(_package.p),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'structure',
					A2($elm$json$Json$Encode$list, $author$project$ChirunPackageConfig$encode_content_item, _package.f))
				])));
};
var $elm$html$Html$Attributes$enctype = $elm$html$Html$Attributes$stringProperty('enctype');
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$input = _VirtualDom_node('input');
var $author$project$ChirunPackageConfig$Delete = {$: 0};
var $author$project$ChirunPackageConfig$Down = 1;
var $author$project$ChirunPackageConfig$ItemMsg = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$ChirunPackageConfig$Move = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$ChirunPackageConfig$Right = 2;
var $author$project$ChirunPackageConfig$SetSetting = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$ChirunPackageConfig$SetType = function (a) {
	return {$: 2, a: a};
};
var $author$project$ChirunPackageConfig$Up = 0;
var $author$project$Form$add_input = F2(
	function (element, o) {
		return _Utils_update(
			o,
			{
				K: _Utils_ap(
					o.K,
					_List_fromArray(
						[element]))
			});
	});
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $author$project$ChirunPackageConfig$bool_setting = function (setting) {
	if (setting.$ === 2) {
		var b = setting.a;
		return b;
	} else {
		return false;
	}
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $author$project$FS$extension = A2(
	$elm$core$Basics$composeR,
	function ($) {
		return $.a7;
	},
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$split('.'),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$reverse,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$head,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$map(
						$elm$core$Basics$append('.')),
					$elm$core$Maybe$withDefault(''))))));
var $author$project$ChirunPackageConfig$file_extension_filter = F2(
	function (valid_extensions, i) {
		return (!i.n) || A2(
			$elm$core$List$member,
			$author$project$FS$extension(i),
			valid_extensions);
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$Form$just_input = function (element) {
	return {
		K: _List_fromArray(
			[element]),
		aB: _List_Nil
	};
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Form$bool_checkbox = F2(
	function (control, value) {
		return $author$project$Form$just_input(
			A2(
				$elm$html$Html$input,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(control.C),
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$checked(value),
							$elm$html$Html$Events$onCheck(control.L)
						]),
					control.G(value)),
				_List_Nil));
	});
var $author$project$Html$ChirunExtra$optional_attribute = F2(
	function (name, on) {
		return on ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, name, '')
			]) : _List_Nil;
	});
var $author$project$Html$ChirunExtra$aria_current = $author$project$Html$ChirunExtra$optional_attribute('aria-current');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$details = _VirtualDom_node('details');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Form$path_to_pathnames = F2(
	function (path, files) {
		var name = $zwilias$elm_rosetree$Tree$label(files).a7;
		if (!path.b) {
			return (name === '') ? _List_Nil : $elm$core$List$singleton(name);
		} else {
			var i = path.a;
			var rest = path.b;
			var _v1 = A2(
				$elm_community$list_extra$List$Extra$getAt,
				i,
				$zwilias$elm_rosetree$Tree$children(files));
			if (!_v1.$) {
				var sub = _v1.a;
				var subnames = A2($author$project$Form$path_to_pathnames, rest, sub);
				return (name === '') ? subnames : A2($elm$core$List$cons, name, subnames);
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Form$pathnames_to_path = F2(
	function (pathnames, tree) {
		if (!pathnames.b) {
			return $elm$core$Maybe$Just($lue_bird$elm_rosetree_path$Tree$Path$atTrunk);
		} else {
			var pathname = pathnames.a;
			var rest = pathnames.b;
			return A2(
				$elm$core$Maybe$andThen,
				function (_v2) {
					var i = _v2.a;
					var sub = _v2.b;
					var _v3 = _Utils_Tuple2(
						$zwilias$elm_rosetree$Tree$label(sub).n,
						rest);
					if (_v3.a === 1) {
						if (!_v3.b.b) {
							var _v4 = _v3.a;
							return $elm$core$Maybe$Just(
								_List_fromArray(
									[i]));
						} else {
							var _v5 = _v3.a;
							return $elm$core$Maybe$Nothing;
						}
					} else {
						var _v6 = _v3.a;
						return A2(
							$elm$core$Maybe$map,
							$elm$core$List$cons(i),
							A2($author$project$Form$pathnames_to_path, rest, sub));
					}
				},
				A2(
					$elm_community$list_extra$List$Extra$find,
					function (_v1) {
						var i = _v1.a;
						var t = _v1.b;
						return _Utils_eq(
							$zwilias$elm_rosetree$Tree$label(t).a7,
							pathname);
					},
					A2(
						$elm$core$List$indexedMap,
						$elm$core$Tuple$pair,
						$zwilias$elm_rosetree$Tree$children(tree))));
		}
	});
var $elm$html$Html$summary = _VirtualDom_node('summary');
var $author$project$Form$file_selector = F3(
	function (files, control, value) {
		var filepath = A2($elm$core$String$split, '/', value);
		var mpath = A2($author$project$Form$pathnames_to_path, filepath, files);
		var show_item = function (sub) {
			var path = sub.aF;
			var selected = _Utils_eq(
				mpath,
				$elm$core$Maybe$Just(path));
			var name = sub.aB.a7;
			var in_selected = (!_Utils_eq(path, _List_Nil)) && function (p) {
				return _Utils_eq(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(path),
						p),
					path);
			}(
				A2($elm$core$Maybe$withDefault, _List_Nil, mpath));
			var _v0 = sub.aB.n;
			if (!_v0) {
				return function (e) {
					return _Utils_eq(path, _List_Nil) ? e : A2(
						$elm$html$Html$li,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('directory')
							]),
						_List_fromArray(
							[e]));
				}(
					A2(
						$elm$html$Html$details,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('directory-tree', true),
											_Utils_Tuple2('selected', selected)
										])),
									$author$project$Html$ChirunExtra$role('tree')
								]),
							A2($author$project$Html$ChirunExtra$optional_attribute, 'open', in_selected)),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$summary,
								_List_Nil,
								function () {
									if (!path.b) {
										return (value === '') ? _List_fromArray(
											[
												$elm$html$Html$text('Select a file')
											]) : _List_fromArray(
											[
												A2(
												$elm$html$Html$code,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('file-path')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(value)
													]))
											]);
									} else {
										return _List_fromArray(
											[
												$elm$html$Html$text(name)
											]);
									}
								}()),
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								$elm$core$List$isEmpty(sub.at) ? _List_fromArray(
									[
										A2(
										$elm$html$Html$li,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('empty-directory text-muted')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Empty directory')
											]))
									]) : sub.at)
							])));
			} else {
				return A2(
					$elm$html$Html$li,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('file')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('selected', selected),
												_Utils_Tuple2('file', true)
											])),
										$elm$html$Html$Events$onClick(
										control.L(
											A2(
												$elm$core$String$join,
												'/',
												A2($author$project$Form$path_to_pathnames, path, files))))
									]),
								$author$project$Html$ChirunExtra$aria_current(selected)),
							_List_fromArray(
								[
									$elm$html$Html$text(name)
								]))
						]));
			}
		};
		return $author$project$Form$just_input(
			A2($lue_bird$elm_rosetree_path$Tree$Navigate$restructure, show_item, files));
	});
var $zwilias$elm_rosetree$Tree$restructureHelp = F4(
	function (fLabel, fTree, acc, stack) {
		restructureHelp:
		while (true) {
			var _v0 = acc.j;
			if (!_v0.b) {
				var node = A2(
					fTree,
					acc.aB,
					$elm$core$List$reverse(acc.a));
				if (!stack.b) {
					return node;
				} else {
					var top = stack.a;
					var rest = stack.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$acc = _Utils_update(
						top,
						{
							a: A2($elm$core$List$cons, node, top.a)
						}),
						$temp$stack = rest;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					acc = $temp$acc;
					stack = $temp$stack;
					continue restructureHelp;
				}
			} else {
				if (!_v0.a.b.b) {
					var _v2 = _v0.a;
					var l = _v2.a;
					var rest = _v0.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$acc = _Utils_update(
						acc,
						{
							a: A2(
								$elm$core$List$cons,
								A2(
									fTree,
									fLabel(l),
									_List_Nil),
								acc.a),
							j: rest
						}),
						$temp$stack = stack;
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					acc = $temp$acc;
					stack = $temp$stack;
					continue restructureHelp;
				} else {
					var _v3 = _v0.a;
					var l = _v3.a;
					var cs = _v3.b;
					var rest = _v0.b;
					var $temp$fLabel = fLabel,
						$temp$fTree = fTree,
						$temp$acc = {
						a: _List_Nil,
						aB: fLabel(l),
						j: cs
					},
						$temp$stack = A2(
						$elm$core$List$cons,
						_Utils_update(
							acc,
							{j: rest}),
						stack);
					fLabel = $temp$fLabel;
					fTree = $temp$fTree;
					acc = $temp$acc;
					stack = $temp$stack;
					continue restructureHelp;
				}
			}
		}
	});
var $zwilias$elm_rosetree$Tree$restructure = F3(
	function (convertLabel, convertTree, _v0) {
		var l = _v0.a;
		var c = _v0.b;
		return A4(
			$zwilias$elm_rosetree$Tree$restructureHelp,
			convertLabel,
			convertTree,
			{
				a: _List_Nil,
				aB: convertLabel(l),
				j: c
			},
			_List_Nil);
	});
var $author$project$FS$filter = function (test) {
	return A2(
		$zwilias$elm_rosetree$Tree$restructure,
		$elm$core$Basics$identity,
		F2(
			function (l, c) {
				return A2(
					$zwilias$elm_rosetree$Tree$tree,
					l,
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeR, $zwilias$elm_rosetree$Tree$label, test),
						c));
			}));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Form$int_input = F2(
	function (control, value) {
		return $author$project$Form$just_input(
			A2(
				$elm$html$Html$input,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(control.C),
							$elm$html$Html$Attributes$type_('number'),
							A2(
							$elm$html$Html$Events$on,
							'input',
							A2(
								$elm$json$Json$Decode$map,
								control.L,
								A2(
									$elm$json$Json$Decode$field,
									'target',
									A2($elm$json$Json$Decode$field, 'valueAsNumber', $elm$json$Json$Decode$int)))),
							$elm$html$Html$Attributes$value(
							$elm$core$String$fromInt(value))
						]),
					control.G(value)),
				_List_Nil));
	});
var $author$project$ChirunPackageConfig$int_setting = function (setting) {
	if (setting.$ === 1) {
		var i = setting.a;
		return i;
	} else {
		return 0;
	}
};
var $author$project$ChirunPackageConfig$list_setting = F2(
	function (item, setting) {
		if (setting.$ === 4) {
			var l = setting.a;
			return A2($elm$core$List$map, item, l);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Form$add_label = F2(
	function (element, o) {
		return _Utils_update(
			o,
			{
				aB: _Utils_ap(
					o.aB,
					_List_fromArray(
						[element]))
			});
	});
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Form$labelled = F4(
	function (label, element, control, value) {
		return function (o) {
			return (_Utils_eq(o.K, _List_Nil) ? $elm$core$Basics$identity : $author$project$Form$add_label(
				A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(control.C)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]))))(o);
		}(
			A2(element, control, value));
	});
var $author$project$Form$wrap_multiple = function (elements) {
	if (!elements.b) {
		return _List_Nil;
	} else {
		if (!elements.b.b) {
			var x = elements.a;
			return _List_fromArray(
				[x]);
		} else {
			return _List_fromArray(
				[
					A2($elm$html$Html$div, _List_Nil, elements)
				]);
		}
	}
};
var $author$project$Form$render = F8(
	function (getter, store_msg, map_store_to_input, map_output_to_store, element, map_element, id, label) {
		return function (c) {
			return _Utils_ap(
				$author$project$Form$wrap_multiple(c.aB),
				$author$project$Form$wrap_multiple(c.K));
		}(
			A2(
				map_element(
					A2($author$project$Form$labelled, label, element)),
				{
					G: function (_v0) {
						return _List_Nil;
					},
					C: id,
					L: A2(
						$elm$core$Basics$composeR,
						map_output_to_store,
						store_msg(id))
				},
				map_store_to_input(
					getter(id))));
	});
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Form$select = F3(
	function (options, control, value) {
		return $author$project$Form$just_input(
			A2(
				$elm$html$Html$select,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Events$onInput(control.L),
							$elm$html$Html$Attributes$id(control.C)
						]),
					control.G(value)),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var option = _v0.a;
						var option_label = _v0.b;
						return A2(
							$elm$html$Html$option,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(option),
									$elm$html$Html$Attributes$selected(
									_Utils_eq(value, option))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(option_label)
								]));
					},
					options)));
	});
var $author$project$ChirunPackageConfig$string_setting = function (setting) {
	if (!setting.$) {
		var s = setting.a;
		return s;
	} else {
		return '';
	}
};
var $author$project$Form$text_input = F2(
	function (control, value) {
		return $author$project$Form$just_input(
			A2(
				$elm$html$Html$input,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('text'),
							$elm$html$Html$Attributes$id(control.C),
							$elm$html$Html$Events$onInput(control.L),
							$elm$html$Html$Attributes$value(value)
						]),
					control.G(value)),
				_List_Nil));
	});
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Form$textarea = F2(
	function (control, value) {
		return $author$project$Form$just_input(
			A2(
				$elm$html$Html$textarea,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(control.C),
							$elm$html$Html$Events$onInput(control.L)
						]),
					control.G(value)),
				_List_fromArray(
					[
						$elm$html$Html$text(value)
					])));
	});
var $elm$core$String$trim = _String_trim;
var $author$project$ChirunPackageConfig$form_generator = F3(
	function (model, setting_getter, msg) {
		var pcontrol = A2($author$project$Form$render, setting_getter, msg);
		var select = function (options) {
			return A3(
				pcontrol,
				$author$project$ChirunPackageConfig$string_setting,
				$author$project$ChirunPackageConfig$StringSetting,
				$author$project$Form$select(options));
		};
		var text_input = A3(pcontrol, $author$project$ChirunPackageConfig$string_setting, $author$project$ChirunPackageConfig$StringSetting, $author$project$Form$text_input);
		var textarea = A3(pcontrol, $author$project$ChirunPackageConfig$string_setting, $author$project$ChirunPackageConfig$StringSetting, $author$project$Form$textarea);
		var int_input = A3(pcontrol, $author$project$ChirunPackageConfig$int_setting, $author$project$ChirunPackageConfig$IntSetting, $author$project$Form$int_input);
		var file_selector = function (valid_files) {
			return A3(
				pcontrol,
				$author$project$ChirunPackageConfig$string_setting,
				$author$project$ChirunPackageConfig$StringSetting,
				$author$project$Form$file_selector(
					A2($author$project$FS$filter, valid_files, model.ae)));
		};
		var comma_list = A3(
			pcontrol,
			A2(
				$elm$core$Basics$composeR,
				$author$project$ChirunPackageConfig$list_setting($author$project$ChirunPackageConfig$string_setting),
				$elm$core$String$join(',')),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$String$split(','),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$map($elm$core$String$trim),
					A2(
						$elm$core$Basics$composeR,
						function (x) {
							return A2(
								$elm$core$List$all,
								$elm$core$Basics$eq(''),
								x) ? _List_Nil : x;
						},
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$map($author$project$ChirunPackageConfig$StringSetting),
							$author$project$ChirunPackageConfig$ListSetting)))),
			$author$project$Form$text_input);
		var bool_checkbox = A3(pcontrol, $author$project$ChirunPackageConfig$bool_setting, $author$project$ChirunPackageConfig$BoolSetting, $author$project$Form$bool_checkbox);
		return {B: bool_checkbox, T: comma_list, ai: file_selector, a5: int_input, am: pcontrol, aP: select, r: text_input, aS: textarea};
	});
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $author$project$ChirunPackageConfig$get_setting = F3(
	function (defaults, settings, key) {
		return A2(
			$elm$core$Maybe$withDefault,
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$ChirunPackageConfig$StringSetting(''),
				A2($elm$core$Dict$get, key, defaults)),
			A2(
				$elm$core$Maybe$andThen,
				function (s) {
					if (s.$ === 1) {
						var i = s.a;
						return $elm$core$Basics$isNaN(i) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(s);
					} else {
						return $elm$core$Maybe$Just(s);
					}
				},
				A2($elm$core$Dict$get, key, settings)));
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$ChirunPackageConfig$is_image_file = $author$project$ChirunPackageConfig$file_extension_filter(
	_List_fromArray(
		['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.jxl']));
var $author$project$ChirunPackageConfig$item_defaults = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'title',
			$author$project$ChirunPackageConfig$StringSetting('Unnamed item')),
			_Utils_Tuple2(
			'slug',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'author',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'source',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'is_hidden',
			$author$project$ChirunPackageConfig$BoolSetting(false)),
			_Utils_Tuple2(
			'build_pdf',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'pdf_url',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'sidebar',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'topbar',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'footer',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'pager',
			$author$project$ChirunPackageConfig$BoolSetting(true))
		]));
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $author$project$ChirunPackageConfig$source_extensions = function (item) {
	var _v0 = item.n;
	if (_v0 === 8) {
		return _List_fromArray(
			['.html', '.htm']);
	} else {
		return _List_fromArray(
			['.tex', '.md']);
	}
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$ChirunPackageConfig$map_setting_and_default = F4(
	function (fn, defaults, object, key) {
		return fn(
			_Utils_Tuple2(
				A2($elm$core$Dict$get, key, object),
				A2($elm$core$Dict$get, key, defaults)));
	});
var $author$project$ChirunPackageConfig$get_string_setting_or_default = $author$project$ChirunPackageConfig$map_setting_and_default(
	function (_v0) {
		var setting = _v0.a;
		var _default = _v0.b;
		var _v1 = _Utils_Tuple2(setting, _default);
		if ((!_v1.a.$) && (!_v1.a.a.$)) {
			if (((!_v1.b.$) && (!_v1.b.a.$)) && (_v1.a.a.a === '')) {
				var d = _v1.b.a.a;
				return d;
			} else {
				var s = _v1.a.a.a;
				return s;
			}
		} else {
			if ((!_v1.b.$) && (!_v1.b.a.$)) {
				var d = _v1.b.a.a;
				return d;
			} else {
				return '';
			}
		}
	});
var $author$project$ChirunPackageConfig$structure_button_id = function (item) {
	return $author$project$ChirunPackageConfig$item_type_code(item.n) + ('-' + (A3($author$project$ChirunPackageConfig$get_string_setting_or_default, $author$project$ChirunPackageConfig$item_defaults, item.p, 'title') + '-structure-button'));
};
var $author$project$Form$visible_if = F2(
	function (visible, elements) {
		return visible ? elements : _List_Nil;
	});
var $author$project$Form$with_hint = F4(
	function (hint, element, control, value) {
		return A2(
			$author$project$Form$add_input,
			A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input-hint')
					]),
				_List_fromArray(
					[hint])),
			A2(element, control, value));
	});
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$Form$with_placeholder = F3(
	function (placeholder, element, control) {
		return element(
			_Utils_update(
				control,
				{
					G: function (v) {
						return A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$placeholder(placeholder),
							control.G(v));
					}
				}));
	});
var $author$project$ChirunPackageConfig$item_settings_tab = F3(
	function (model, path, tree) {
		var splitlevel_options = _List_fromArray(
			[
				_Utils_Tuple2(-2, 'Entire document (no splitting)'),
				_Utils_Tuple2(-1, 'Part'),
				_Utils_Tuple2(0, 'Chapter'),
				_Utils_Tuple2(1, 'Section'),
				_Utils_Tuple2(2, 'Subsection')
			]);
		var item_type_options = A2(
			$elm$core$List$map,
			function (t) {
				return _Utils_Tuple2(
					$author$project$ChirunPackageConfig$item_type_code(t),
					$author$project$ChirunPackageConfig$item_type_name(t));
			},
			$author$project$ChirunPackageConfig$content_item_types);
		var item = $zwilias$elm_rosetree$Tree$label(tree);
		var item_setting = function (key) {
			return A3($author$project$ChirunPackageConfig$get_setting, $author$project$ChirunPackageConfig$item_defaults, item.p, key);
		};
		var p = A3(
			$author$project$ChirunPackageConfig$form_generator,
			model,
			item_setting,
			F2(
				function (id, s) {
					return A2(
						$author$project$ChirunPackageConfig$ItemMsg,
						A2($author$project$ChirunPackageConfig$SetSetting, id, s),
						path);
				}));
		var splitlevel_select = A6(
			p.am,
			A2($elm$core$Basics$composeR, $author$project$ChirunPackageConfig$int_setting, $elm$core$String$fromInt),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$String$toInt,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$withDefault(0),
					$author$project$ChirunPackageConfig$IntSetting)),
			$author$project$Form$select(
				A2(
					$elm$core$List$map,
					$elm$core$Tuple$mapFirst($elm$core$String$fromInt),
					splitlevel_options)),
			$elm$core$Basics$identity,
			'splitlevel',
			'Split at');
		var type_select = A8(
			$author$project$Form$render,
			function (_v3) {
				return item.n;
			},
			F2(
				function (_v4, t) {
					return A2(
						$author$project$ChirunPackageConfig$ItemMsg,
						$author$project$ChirunPackageConfig$SetType(t),
						path);
				}),
			$author$project$ChirunPackageConfig$item_type_code,
			$author$project$ChirunPackageConfig$code_to_item_type,
			$author$project$Form$select(item_type_options),
			$elm$core$Basics$identity,
			'type',
			'Type');
		var is_source_file = $author$project$ChirunPackageConfig$file_extension_filter(
			$author$project$ChirunPackageConfig$source_extensions(item));
		var source_input = function () {
			var _v2 = item.n;
			switch (_v2) {
				case 7:
					return A3(
						p.r,
						$author$project$Form$with_hint(
							$author$project$Html$ChirunExtra$text('A URL')),
						'source',
						'URL');
				case 8:
					return A3(p.aS, $elm$core$Basics$identity, 'html', 'HTML code');
				default:
					return A4(p.ai, is_source_file, $elm$core$Basics$identity, 'source', 'Source');
			}
		}();
		var image_preview = F3(
			function (element, control, value) {
				return ((value === '') ? $elm$core$Basics$identity : $author$project$Form$add_input(
					A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								_Utils_ap(model.ag, value)),
								$elm$html$Html$Attributes$class('thumbnail'),
								$elm$html$Html$Attributes$alt('Thumbnail')
							]),
						_List_Nil)))(
					A2(element, control, value));
			});
		var can_build_pdf = function () {
			var _v1 = item.n;
			switch (_v1) {
				case 7:
					return false;
				case 8:
					return false;
				case 1:
					return false;
				default:
					return true;
			}
		}();
		var button_id = $author$project$ChirunPackageConfig$structure_button_id(item);
		var move_button = function (direction) {
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2(
							$author$project$ChirunPackageConfig$ItemMsg,
							A2($author$project$ChirunPackageConfig$Move, direction, button_id),
							path)),
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$disabled(
						_Utils_eq(
							$elm$core$Maybe$Nothing,
							A3($author$project$ChirunPackageConfig$move_item, direction, path, model.e.f).b))
					]),
				_List_fromArray(
					[
						$author$project$Html$ChirunExtra$text(
						function () {
							switch (direction) {
								case 0:
									return '↑';
								case 1:
									return '↓';
								default:
									return '→';
							}
						}())
					]));
		};
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('current-item'),
					$author$project$Html$ChirunExtra$role('tabpanel')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$nav,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('item-nav')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('move-buttons')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Move this item'),
									move_button(0),
									move_button(1),
									move_button(2)
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('delete'),
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Events$onClick(
									A2($author$project$ChirunPackageConfig$ItemMsg, $author$project$ChirunPackageConfig$Delete, path))
								]),
							_List_fromArray(
								[
									$author$project$Html$ChirunExtra$text('Delete this item')
								]))
						])),
					A2(
					$elm$html$Html$fieldset,
					_List_Nil,
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$legend,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$ChirunExtra$text('Metadata')
									]))
							]),
						_Utils_ap(
							type_select,
							_Utils_ap(
								A3(
									p.r,
									$author$project$Form$with_placeholder('Unnamed item'),
									'title',
									'Title'),
								_Utils_ap(
									A3(p.r, $elm$core$Basics$identity, 'slug', 'Slug'),
									A3(p.r, $elm$core$Basics$identity, 'author', 'Author')))))),
					A2(
					$elm$html$Html$fieldset,
					_List_Nil,
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$legend,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$ChirunExtra$text('Source')
									]))
							]),
						_Utils_ap(
							source_input,
							_Utils_ap(
								A4(p.ai, $author$project$ChirunPackageConfig$is_image_file, image_preview, 'thumbnail', 'Thumbnail image'),
								(item.n !== 3) ? _List_Nil : splitlevel_select)))),
					A2(
					$elm$html$Html$fieldset,
					_List_Nil,
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$legend,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$ChirunExtra$text('Display options')
									]))
							]),
						_Utils_ap(
							A3(p.B, $elm$core$Basics$identity, 'is_hidden', 'Hidden?'),
							_Utils_ap(
								A2(
									$author$project$Form$visible_if,
									can_build_pdf,
									_Utils_ap(
										A3(p.B, $elm$core$Basics$identity, 'build_pdf', 'Build PDF?'),
										A2(
											$author$project$Form$visible_if,
											$author$project$ChirunPackageConfig$bool_setting(
												item_setting('build_pdf')),
											A3(p.r, $elm$core$Basics$identity, 'pdf_url', 'PDF URL')))),
								_Utils_ap(
									A3(p.B, $elm$core$Basics$identity, 'sidebar', 'Show the sidebar?'),
									_Utils_ap(
										A3(p.B, $elm$core$Basics$identity, 'topbar', 'Show the top bar?'),
										_Utils_ap(
											A3(p.B, $elm$core$Basics$identity, 'footer', 'Show the footer?'),
											_Utils_ap(
												A3(p.B, $elm$core$Basics$identity, 'pager', 'Show the pager?'),
												_Utils_ap(
													A3(p.T, $elm$core$Basics$identity, 'css', 'Extra CSS files'),
													A3(p.T, $elm$core$Basics$identity, 'js', 'Extra JavaScript files'))))))))))
				]));
	});
var $elm$html$Html$Attributes$method = $elm$html$Html$Attributes$stringProperty('method');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$ChirunPackageConfig$SetPackageSetting = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$ChirunPackageConfig$dict_setting = function (setting) {
	if (setting.$ === 3) {
		var d = setting.a;
		return d;
	} else {
		return $elm$core$Dict$empty;
	}
};
var $author$project$ChirunPackageConfig$locale_options = _List_fromArray(
	[
		_Utils_Tuple2('en', 'English')
	]);
var $author$project$ChirunPackageConfig$package_defaults = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'title',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'author',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'institution',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'year',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'locale',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'static_dir',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'root_url',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'build_pdf',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'build_zip',
			$author$project$ChirunPackageConfig$BoolSetting(true)),
			_Utils_Tuple2(
			'num_pdf_runs',
			$author$project$ChirunPackageConfig$IntSetting(1)),
			_Utils_Tuple2(
			'mathjax_url',
			$author$project$ChirunPackageConfig$StringSetting('')),
			_Utils_Tuple2(
			'css',
			$author$project$ChirunPackageConfig$ListSetting(_List_Nil)),
			_Utils_Tuple2(
			'js',
			$author$project$ChirunPackageConfig$ListSetting(_List_Nil)),
			_Utils_Tuple2(
			'license',
			$author$project$ChirunPackageConfig$DictSetting(
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'name',
							$author$project$ChirunPackageConfig$StringSetting('')),
							_Utils_Tuple2(
							'year',
							$author$project$ChirunPackageConfig$StringSetting('')),
							_Utils_Tuple2(
							'url',
							$author$project$ChirunPackageConfig$StringSetting('')),
							_Utils_Tuple2(
							'by',
							$author$project$ChirunPackageConfig$StringSetting(''))
						]))))
		]));
var $author$project$ChirunPackageConfig$package_settings_tab = function (model) {
	var _package = model.e;
	var package_setting = function (key) {
		return A3($author$project$ChirunPackageConfig$get_setting, $author$project$ChirunPackageConfig$package_defaults, _package.p, key);
	};
	var p = A3(
		$author$project$ChirunPackageConfig$form_generator,
		model,
		package_setting,
		$author$project$ChirunPackageConfig$SetPackageSetting(_List_Nil));
	var license = $author$project$ChirunPackageConfig$dict_setting(
		package_setting('license'));
	var license_setting = function (key) {
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$ChirunPackageConfig$StringSetting(''),
			A2($elm$core$Dict$get, key, license));
	};
	var l = A3(
		$author$project$ChirunPackageConfig$form_generator,
		model,
		license_setting,
		$author$project$ChirunPackageConfig$SetPackageSetting(
			_List_fromArray(
				['license'])));
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('package-settings'),
				$author$project$Html$ChirunExtra$role('tabpanel')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$fieldset,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$legend,
							_List_Nil,
							_List_fromArray(
								[
									$author$project$Html$ChirunExtra$text('Package metadata')
								]))
						]),
					_Utils_ap(
						A3(p.r, $elm$core$Basics$identity, 'title', 'Title'),
						_Utils_ap(
							A3(p.r, $elm$core$Basics$identity, 'author', 'Author'),
							_Utils_ap(
								A3(p.r, $elm$core$Basics$identity, 'institution', 'Institution'),
								_Utils_ap(
									A3(p.r, $elm$core$Basics$identity, 'code', 'Course code'),
									_Utils_ap(
										A3(p.r, $elm$core$Basics$identity, 'year', 'Year'),
										A4(p.aP, $author$project$ChirunPackageConfig$locale_options, $elm$core$Basics$identity, 'locale', 'Language')))))))),
				A2(
				$elm$html$Html$fieldset,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$legend,
							_List_Nil,
							_List_fromArray(
								[
									$author$project$Html$ChirunExtra$text('Licence')
								]))
						]),
					_Utils_ap(
						A3(l.r, $elm$core$Basics$identity, 'name', 'Licence name'),
						_Utils_ap(
							A3(l.r, $elm$core$Basics$identity, 'url', 'Licence URL'),
							_Utils_ap(
								A3(l.r, $elm$core$Basics$identity, 'year', 'Copyright year'),
								A3(l.r, $elm$core$Basics$identity, 'by', 'Copyright attribution')))))),
				A2(
				$elm$html$Html$fieldset,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$legend,
							_List_Nil,
							_List_fromArray(
								[
									$author$project$Html$ChirunExtra$text('Build options')
								]))
						]),
					_Utils_ap(
						A3(p.B, $elm$core$Basics$identity, 'build_pdf', 'Build PDFs?'),
						_Utils_ap(
							A3(p.B, $elm$core$Basics$identity, 'build_zip', 'Build zip of entire package?'),
							_Utils_ap(
								A2(
									$author$project$Form$visible_if,
									$author$project$ChirunPackageConfig$bool_setting(
										package_setting('build_pdf')),
									A6(p.am, $author$project$ChirunPackageConfig$int_setting, $author$project$ChirunPackageConfig$IntSetting, $author$project$Form$int_input, $elm$core$Basics$identity, 'num_pdf_runs', 'Number of PDF runs')),
								_Utils_ap(
									A3(p.r, $elm$core$Basics$identity, 'mathjax_url', 'URL to load MathJax from'),
									_Utils_ap(
										A3(p.T, $elm$core$Basics$identity, 'css', 'Extra CSS files'),
										A3(p.T, $elm$core$Basics$identity, 'js', 'Extra JavaScript files'))))))))
			]));
};
var $author$project$ChirunPackageConfig$SetTab = function (a) {
	return {$: 0, a: a};
};
var $author$project$ChirunPackageConfig$CreateItemTab = function (a) {
	return {$: 2, a: a};
};
var $author$project$ChirunPackageConfig$add_item_button = F2(
	function (model, path) {
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					_Utils_eq(
					model.q,
					$author$project$ChirunPackageConfig$CreateItemTab(path)) ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('adding-item')
						]),
					_List_fromArray(
						[
							$author$project$Html$ChirunExtra$text('Adding an item')
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('action add-item'),
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Events$onClick(
							$author$project$ChirunPackageConfig$SetTab(
								$author$project$ChirunPackageConfig$CreateItemTab(path)))
						]),
					_List_fromArray(
						[
							$author$project$Html$ChirunExtra$text('+ Add an item')
						]))
				]));
	});
var $author$project$Html$ChirunExtra$aria_expanded = $author$project$Html$ChirunExtra$optional_attribute('aria-expanded');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$ChirunPackageConfig$structure_tree = function (model) {
	var move_keypress = F2(
		function (path, id) {
			return A2(
				$elm$json$Json$Decode$map,
				function (dir) {
					return {
						a6: A2(
							$author$project$ChirunPackageConfig$ItemMsg,
							A2($author$project$ChirunPackageConfig$Move, dir, id),
							path),
						bb: true,
						be: true
					};
				},
				A2(
					$elm$json$Json$Decode$andThen,
					function (key) {
						switch (key) {
							case 'ArrowUp':
								return $elm$json$Json$Decode$succeed(0);
							case 'ArrowDown':
								return $elm$json$Json$Decode$succeed(1);
							case 'ArrowRight':
								return $elm$json$Json$Decode$succeed(2);
							default:
								return $elm$json$Json$Decode$fail('not a key I\'m interested in');
						}
					},
					A2(
						$elm$json$Json$Decode$andThen,
						function (s) {
							return s ? A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string) : $elm$json$Json$Decode$fail('shift not pressed');
						},
						A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool))));
		});
	var structure_single_item = F2(
		function (i, sub) {
			var path = A2($lue_bird$elm_rosetree_path$Forest$Path$fromIndex, i, sub.aF);
			var this_tab = $author$project$ChirunPackageConfig$ContentItemTab(path);
			var item = sub.aB;
			var title = A3($author$project$ChirunPackageConfig$get_string_setting_or_default, $author$project$ChirunPackageConfig$item_defaults, item.p, 'title');
			var has_children = $author$project$ChirunPackageConfig$item_has_children(sub.aB);
			var button_id = $author$project$ChirunPackageConfig$structure_button_id(item);
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$author$project$Html$ChirunExtra$role('presentation')
					]),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Attributes$class('item'),
										$elm$html$Html$Attributes$id(button_id),
										$author$project$Html$ChirunExtra$role('tab'),
										$elm$html$Html$Events$onClick(
										$author$project$ChirunPackageConfig$SetTab(this_tab)),
										A2(
										$elm$html$Html$Events$custom,
										'keydown',
										A2(move_keypress, path, button_id))
									]),
								_Utils_ap(
									$author$project$Html$ChirunExtra$aria_expanded(
										!($elm$core$List$isEmpty(sub.at) && has_children)),
									$author$project$Html$ChirunExtra$aria_current(
										_Utils_eq(model.q, this_tab)))),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('item-type')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$ChirunPackageConfig$item_type_name(item.n))
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									$elm$html$Html$text(title)
								]))
						]),
					has_children ? _List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('content')
								]),
							_Utils_ap(
								sub.at,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$author$project$ChirunPackageConfig$add_item_button,
												model,
												$elm$core$Maybe$Just(path))
											]))
									])))
						]) : _List_Nil));
		});
	var structure_item_tree = F2(
		function (i, tree) {
			return A2(
				$lue_bird$elm_rosetree_path$Tree$Navigate$restructure,
				structure_single_item(i),
				tree);
		});
	return A2(
		$elm$html$Html$ul,
		_List_fromArray(
			[
				$author$project$Html$ChirunExtra$role('tree'),
				$elm$html$Html$Attributes$id('structure-tree')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$author$project$Html$ChirunExtra$role('presentation')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_Utils_ap(
							_List_fromArray(
								[
									$author$project$Html$ChirunExtra$role('tab'),
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Events$onClick(
									$author$project$ChirunPackageConfig$SetTab($author$project$ChirunPackageConfig$PackageSettingsTab))
								]),
							_Utils_ap(
								$author$project$Html$ChirunExtra$aria_expanded(
									!$elm$core$List$isEmpty(model.e.f)),
								$author$project$Html$ChirunExtra$aria_current(
									_Utils_eq(model.q, $author$project$ChirunPackageConfig$PackageSettingsTab)))),
						_List_fromArray(
							[
								$author$project$Html$ChirunExtra$text('Package settings')
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								$author$project$Html$ChirunExtra$role('tree')
							]),
						_Utils_ap(
							A2($elm$core$List$indexedMap, structure_item_tree, model.e.f),
							_List_fromArray(
								[
									A2($author$project$ChirunPackageConfig$add_item_button, model, $elm$core$Maybe$Nothing)
								])))
					]))
			]));
};
var $author$project$ChirunPackageConfig$form = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('config-form'),
				$elm$html$Html$Attributes$method('POST'),
				$elm$html$Html$Attributes$enctype('multipart/form-data')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('app')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$nav,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('main-nav')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('action'),
										$elm$html$Html$Attributes$type_('submit')
									]),
								_List_fromArray(
									[
										$author$project$Html$ChirunExtra$text('Save')
									])),
								$author$project$ChirunPackageConfig$structure_tree(model)
							])),
						function () {
						var _v0 = model.q;
						switch (_v0.$) {
							case 0:
								return $author$project$ChirunPackageConfig$package_settings_tab(model);
							case 1:
								var path = _v0.a;
								var _v1 = A2($lue_bird$elm_rosetree_path$Forest$Navigate$to, path, model.e.f);
								if (!_v1.$) {
									var t = _v1.a;
									return A3($author$project$ChirunPackageConfig$item_settings_tab, model, path, t);
								} else {
									return A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												$author$project$Html$ChirunExtra$text('Oh no!')
											]));
								}
							default:
								var path = _v0.a;
								return $author$project$ChirunPackageConfig$create_item_tab(path);
						}
					}()
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('hidden'),
						$elm$html$Html$Attributes$id('id_config'),
						$elm$html$Html$Attributes$name('config'),
						$elm$html$Html$Attributes$value(
						A2(
							$elm$json$Json$Encode$encode,
							0,
							$author$project$ChirunPackageConfig$encode_package(model.e)))
					]),
				_List_Nil)
			]));
};
var $author$project$ChirunPackageConfig$view = function (model) {
	var _v0 = model.ad;
	if (!_v0.$) {
		var err = _v0.a;
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('loading-error')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(err)
				]));
	} else {
		return $author$project$ChirunPackageConfig$form(model);
	}
};
var $author$project$ChirunPackageConfig$main = $elm$browser$Browser$element(
	{
		a4: $author$project$ChirunPackageConfig$init,
		bf: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		bh: $author$project$ChirunPackageConfig$update,
		bi: $author$project$ChirunPackageConfig$view
	});
_Platform_export({'ChirunPackageConfig':{'init':$author$project$ChirunPackageConfig$main($elm$json$Json$Decode$value)(0)}});}(window));
class ChirunPackageConfigElement extends HTMLElement {
    constructor() {
        super();

        const files = JSON.parse(document.getElementById(this.getAttribute('files')).textContent);
        const config = JSON.parse(document.getElementById(this.getAttribute('config')).textContent);
        const media_root = this.getAttribute('media-root');

        var app = Elm.ChirunPackageConfig.init({ node: this, flags: {files, config, media_root} })
    }
}
customElements.define('chirun-package-config', ChirunPackageConfigElement);

