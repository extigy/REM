
var Module;
if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    }
    var PACKAGE_NAME = 'index.data';
    var REMOTE_PACKAGE_BASE = 'index.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
    var REMOTE_PACKAGE_SIZE = 1110256;
    var PACKAGE_UUID = '141f9b8a-5a4b-40ce-a8a3-e760f843d8f4';
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

function assert(check, msg) {
  if (!check) throw msg + new Error().stack;
}
Module['FS_createPath']('/', 'textures', true, true);
Module['FS_createPath']('/', 'shader', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;
        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        this.requests[this.name] = null;
      },
    };
      new DataRequest(0, 22610, 0, 0).open('GET', '/textures/awesome.png');
    new DataRequest(22610, 1108744, 0, 0).open('GET', '/textures/brick.jpg');
    new DataRequest(1108744, 1109136, 0, 0).open('GET', '/shader/UL_F0.glsl');
    new DataRequest(1109136, 1109492, 0, 0).open('GET', '/shader/UL_V0.glsl');
    new DataRequest(1109492, 1109926, 0, 0).open('GET', '/shader/UU_F0.glsl');
    new DataRequest(1109926, 1110256, 0, 0).open('GET', '/shader/UU_V0.glsl');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/textures/awesome.png"].onload();
          DataRequest.prototype.requests["/textures/brick.jpg"].onload();
          DataRequest.prototype.requests["/shader/UL_F0.glsl"].onload();
          DataRequest.prototype.requests["/shader/UL_V0.glsl"].onload();
          DataRequest.prototype.requests["/shader/UU_F0.glsl"].onload();
          DataRequest.prototype.requests["/shader/UU_V0.glsl"].onload();
          Module['removeRunDependency']('datafile_index.data');

    };
    Module['addRunDependency']('datafile_index.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

})();

// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = (typeof Module !== 'undefined' ? Module : null) || {};

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
  Module['arguments'] = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    var data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    window['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
if (!Module['thisProgram']) {
  Module['thisProgram'] = './this.program';
}

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in: 
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at: 
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  setTempRet0: function (value) {
    tempRet0 = value;
  },
  getTempRet0: function () {
    return tempRet0;
  },
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  STACK_ALIGN: 16,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      assert(args.length == sig.length-1);
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      assert(sig.length == 1);
      assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    var source = Pointer_stringify(code);
    if (source[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (source.indexOf('"', 1) === source.length-1) {
        source = source.substr(1, source.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + source + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    try {
      // Module is the only 'upvar', which we provide directly. We also provide FS for legacy support.
      var evalled = eval('(function(Module, FS) { return function(' + args.join(',') + '){ ' + source + ' } })')(Module, typeof FS !== 'undefined' ? FS : null);
    } catch(e) {
      Module.printErr('error in executing inline EM_ASM code: ' + e + ' on: \n\n' + source + '\n\nwith args |' + args + '| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)');
      throw e;
    }
    return Runtime.asmConstCache[code] = evalled;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[sig]) {
      Runtime.funcWrappers[sig] = {};
    }
    var sigCache = Runtime.funcWrappers[sig];
    if (!sigCache[func]) {
      sigCache[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return sigCache[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          (((codePoint - 0x10000) / 0x400)|0) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      /* TODO: use TextEncoder when present,
        var encoder = new TextEncoder();
        encoder['encoding'] = "utf-8";
        var utf8Array = encoder['encode'](aMsg.data);
      */
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+15)&-16);(assert((((STACKTOP|0) < (STACK_MAX|0))|0))|0); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + (assert(!staticSealed),size))|0;STATICTOP = (((STATICTOP)+15)&-16); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + (assert(DYNAMICTOP > 0),size))|0;DYNAMICTOP = (((DYNAMICTOP)+15)&-16); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 16))*(quantum ? quantum : 16); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  if (!func) {
    try {
      func = eval('_' + ident); // explicit lookup
    } catch(e) {}
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

var cwrap, ccall;
(function(){
  var stack = 0;
  var JSfuncs = {
    'stackSave' : function() {
      stack = Runtime.stackSave();
    },
    'stackRestore' : function() {
      Runtime.stackRestore(stack);
    },
    // type conversion from js to c
    'arrayToC' : function(arr) {
      var ret = Runtime.stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
    'stringToC' : function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        ret = Runtime.stackAlloc((str.length << 2) + 1);
        writeStringToMemory(str, ret);
      }
      return ret;
    }
  };
  // For fast lookup of conversion functions
  var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

  // C calling interface. 
  ccall = function ccallFunc(ident, returnType, argTypes, args) {
    var func = getCFunc(ident);
    var cArgs = [];
    assert(returnType !== 'array', 'Return type should not be "array".');
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = Runtime.stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func.apply(null, cArgs);
    if (returnType === 'string') ret = Pointer_stringify(ret);
    if (stack !== 0) JSfuncs['stackRestore']();
    return ret;
  }

  var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
  function parseJSFunc(jsfunc) {
    // Match the body and the return value of a javascript function source
    var parsed = jsfunc.toString().match(sourceRegex).slice(1);
    return {arguments : parsed[0], body : parsed[1], returnValue: parsed[2]}
  }
  var JSsource = {};
  for (var fun in JSfuncs) {
    if (JSfuncs.hasOwnProperty(fun)) {
      // Elements of toCsource are arrays of three items:
      // the code, and the return value
      JSsource[fun] = parseJSFunc(JSfuncs[fun]);
    }
  }

  
  cwrap = function cwrap(ident, returnType, argTypes) {
    argTypes = argTypes || [];
    var cfunc = getCFunc(ident);
    // When the function takes numbers and returns a number, we can just return
    // the original function
    var numericArgs = argTypes.every(function(type){ return type === 'number'});
    var numericRet = (returnType !== 'string');
    if ( numericRet && numericArgs) {
      return cfunc;
    }
    // Creation of the arguments list (["$1","$2",...,"$nargs"])
    var argNames = argTypes.map(function(x,i){return '$'+i});
    var funcstr = "(function(" + argNames.join(',') + ") {";
    var nargs = argTypes.length;
    if (!numericArgs) {
      // Generate the code needed to convert the arguments from javascript
      // values to pointers
      funcstr += JSsource['stackSave'].body + ';';
      for (var i = 0; i < nargs; i++) {
        var arg = argNames[i], type = argTypes[i];
        if (type === 'number') continue;
        var convertCode = JSsource[type + 'ToC']; // [code, return]
        funcstr += 'var ' + convertCode.arguments + ' = ' + arg + ';';
        funcstr += convertCode.body + ';';
        funcstr += arg + '=' + convertCode.returnValue + ';';
      }
    }

    // When the code is compressed, the name of cfunc is not literally 'cfunc' anymore
    var cfuncname = parseJSFunc(function(){return cfunc}).returnValue;
    // Call the function
    funcstr += 'var ret = ' + cfuncname + '(' + argNames.join(',') + ');';
    if (!numericRet) { // Return type can only by 'string' or 'number'
      // Convert the result to a string
      var strgfy = parseJSFunc(function(){return Pointer_stringify}).returnValue;
      funcstr += 'ret = ' + strgfy + '(ret);';
    }
    if (!numericArgs) {
      // If we had a stack, restore it
      funcstr += JSsource['stackRestore'].body + ';';
    }
    funcstr += 'return ret})';
    return eval(funcstr);
  };
})();
Module["cwrap"] = cwrap;
Module["ccall"] = ccall;


function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;


function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))>>0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))>>0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;


function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;


function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;


function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var hasLibcxxabi = !!Module['___cxa_demangle'];
  if (hasLibcxxabi) {
    try {
      var buf = _malloc(func.length);
      writeStringToMemory(func.substr(1), buf);
      var status = _malloc(4);
      var ret = Module['___cxa_demangle'](buf, 0, 0, status);
      if (getValue(status, 'i32') === 0 && ret) {
        return Pointer_stringify(ret);
      }
      // otherwise, libcxxabi failed, we can try ours which may return a partial result
    } catch(e) {
      // failure when using libcxxabi, we can try ours which may return a partial result
    } finally {
      if (buf) _free(buf);
      if (status) _free(status);
      if (ret) _free(ret);
    }
  }
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    if (rawList) {
      if (ret) {
        list.push(ret + '?');
      }
      return list;
    } else {
      return ret + flushList();
    }
  }
  var final = func;
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    final = parse();
  } catch(e) {
    final += '?';
  }
  if (final.indexOf('?') >= 0 && !hasLibcxxabi) {
    Runtime.warnOnce('warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
  }
  return final;
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  return demangleAll(jsStackTrace());
}
Module['stackTrace'] = stackTrace;

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}


var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 200000000;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 64*1024;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module.printErr('Exiting runtime. Any attempt to access the compiled C code may fail from now. If you want to keep the runtime alive, set Module["noExitRuntime"] = true or build with -s NO_EXIT_RUNTIME=1');
  }
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools


function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))>>0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))>>0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[(((buffer)+(i))>>0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))>>0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===





STATIC_BASE = 8;

STATICTOP = STATIC_BASE + Runtime.alignMemory(1915);
  /* global initializers */ __ATINIT__.push();
  

/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,0,3,0,1,0,4,0,5,0,6,0,4,0,7,0,5,0,7,0,1,0,5,0,7,0,1,0,3,0,4,0,2,0,6,0,0,0,2,0,4,0,4,0,3,0,0,0,4,0,7,0,3,0,2,0,5,0,6,0,2,0,1,0,5,0,116,101,120,116,117,114,101,115,47,98,114,105,99,107,46,106,112,103,0,0,0,0,0,0,103,108,102,119,79,112,101,110,87,105,110,100,111,119,40,41,32,102,97,105,108,101,100,0,103,108,102,119,73,110,105,116,40,41,32,102,97,105,108,101,100,0,0,0,0,0,0,0,114,98,0,0,0,0,0,0,91,73,77,65,71,69,93,58,32,67,111,117,108,100,110,39,116,32,108,111,97,100,32,37,115,0,0,0,0,0,0,0,91,73,77,65,71,69,93,58,32,76,111,97,100,101,100,32,37,115,46,32,37,100,120,37,100,32,119,105,116,104,32,37,100,32,98,98,112,46,10,0,46,47,115,104,97,100,101,114,47,85,76,95,86,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,76,95,70,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,85,95,86,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,85,95,70,48,46,103,108,115,108,0,0,0,0,0,109,97,116,68,105,102,102,117,115,101,0,0,0,0,0,0,109,97,116,65,109,98,105,101,110,116,0,0,0,0,0,0,109,97,116,83,112,101,99,117,108,97,114,0,0,0,0,0,109,97,116,69,109,105,115,115,105,118,101,0,0,0,0,0,109,97,116,80,111,119,101,114,0,0,0,0,0,0,0,0,87,86,80,77,97,116,0,0,87,86,80,77,97,116,84,114,97,110,115,0,0,0,0,0,0,0,0,0,0,0,0,0,128,2,0,0,104,1,0,0,114,0,0,0,0,0,0,0,69,114,114,111,114,32,99,111,109,112,105,108,105,110,103,32,115,104,97,100,101,114,58,10,37,115,46,0,0,0,0,0,67,114,101,97,116,101,100,32,86,101,114,116,101,120,32,83,104,97,100,101,114,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,0,0,0,67,114,101,97,116,101,100,32,70,114,97,103,109,101,110,116,32,83,104,97,100,101,114,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,0,67,114,101,97,116,101,100,32,83,104,97,100,101,114,32,112,114,111,103,114,97,109,109,101,58,32,37,100,46,0,0,0,65,99,116,105,118,97,116,101,100,32,83,104,97,100,101,114,32,80,114,111,103,114,97,109,58,32,37,100,46,0,0,0,91,83,104,97,100,101,114,77,97,110,97,103,101,114,93,58,32,0,0,0,0,0,0,0,73,110,105,116,105,97,108,105,115,105,110,103,46,46,46,0,73,110,105,116,105,97,108,105,115,101,100,46,0,0,0,0,67,114,101,97,116,101,100,32,110,101,119,32,115,107,105,110,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,69,82,82,79,82,58,32,97,100,100,84,101,120,116,117,114,101,40,41,32,102,97,105,108,101,100,58,32,65,108,108,32,56,32,116,101,120,116,117,114,101,115,32,102,105,108,108,101,100,46,0,0,0,0,0,0,91,83,107,105,110,77,97,110,97,103,101,114,93,58,32,0,67,114,101,97,116,105,110,103,32,86,101,114,116,101,120,32,66,117,102,102,101,114,115,46,46,46,0,0,0,0,0,0,68,111,110,101,46,0,0,0,91,86,101,114,116,101,120,67,97,99,104,101,77,97,110,97,103,101,114,93,58,32,0,0,97,80,111,115,105,116,105,111,110,0,0,0,0,0,0,0,97,78,111,114,109,97,108,0,97,84,101,120,67,111,111,114,100,0,0,0,0,0,0,0,97,67,111,108,111,117,114,0,109,97,116,68,105,102,102,117,115,101,0,0,0,0,0,0,109,97,116,65,109,98,105,101,110,116,0,0,0,0,0,0,109,97,116,83,112,101,99,117,108,97,114,0,0,0,0,0,109,97,116,69,109,105,115,115,105,118,101,0,0,0,0,0,109,97,116,80,111,119,101,114,0,0,0,0,0,0,0,0,116,101,120,116,117,114,101,32,98,105,110,100,105,110,103,32,45,32,37,100,10,0,0,0,117,83,97,109,112,108,101,114,48,0,0,0,0,0,0,0,0,0,0,0,80,4,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,56,5,0,0,64,4,0,0,120,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,16,5,0,0,104,4,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,16,5,0,0,128,4,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,56,5,0,0,152,4,0,0,144,4,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,56,5,0,0,208,4,0,0,192,4,0,0,0,0,0,0,0,0,0,0,248,4,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,0,0,0,0,128,5,0,0,4,0,0,0,12,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,56,5,0,0,88,5,0,0,248,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);




var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  
  var GL={counter:1,lastError:0,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},packAlignment:4,unpackAlignment:4,init:function () {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
          GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i+1);
        }
      },recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MINI_TEMP_BUFFER_SIZE:16,miniTempBuffer:null,miniTempBufferViews:[0],getSource:function (shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var frag;
          if (length) {
            var len = HEAP32[(((length)+(i*4))>>2)];
            if (len < 0) {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
            } else {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)], len);
            }
          } else {
            frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
          }
          source += frag;
        }
        return source;
      },computeImageSize:function (width, height, sizePerPixel, alignment) {
        // FIXME: possible bug with negative x
        function roundedToNextMultipleOf(x, y) {
          return Math.floor((x + y - 1) / y) * y
        }
        var plainRowSize = width * sizePerPixel;
        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
        return (height <= 0) ? 0 :
                 ((height - 1) * alignedRowSize + plainRowSize);
      },get:function (name_, p, type) {
        // Guard against user passing a null pointer.
        // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
        // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
        // better to report an error instead of doing anything random.
        if (!p) {
          GL.recordError(0x0501 /* GL_INVALID_VALUE */);
          return;
        }
        var ret = undefined;
        switch(name_) { // Handle a few trivial GLES values
          case 0x8DFA: // GL_SHADER_COMPILER
            ret = 1;
            break;
          case 0x8DF8: // GL_SHADER_BINARY_FORMATS
            if (type !== 'Integer') {
              GL.recordError(0x0500); // GL_INVALID_ENUM
            }
            return; // Do not write anything to the out pointer, since no binary formats are supported.
          case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
            ret = 0;
            break;
          case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
            // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
            // so implement it ourselves to allow C++ GLES2 code get the length.
            var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
            ret = formats.length;
            break;
          case 0x8B9A: // GL_IMPLEMENTATION_COLOR_READ_TYPE
            ret = 0x1401; // GL_UNSIGNED_BYTE
            break;
          case 0x8B9B: // GL_IMPLEMENTATION_COLOR_READ_FORMAT
            ret = 0x1908; // GL_RGBA
            break;
        }
  
        if (ret === undefined) {
          var result = GLctx.getParameter(name_);
          switch (typeof(result)) {
            case "number":
              ret = result;
              break;
            case "boolean":
              ret = result ? 1 : 0;
              break;
            case "string":
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
            case "object":
              if (result === null) {
                // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
                // can mean an invalid name_, which we need to report as an error
                switch(name_) {
                  case 0x8894: // ARRAY_BUFFER_BINDING
                  case 0x8B8D: // CURRENT_PROGRAM
                  case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                  case 0x8CA6: // FRAMEBUFFER_BINDING
                  case 0x8CA7: // RENDERBUFFER_BINDING
                  case 0x8069: // TEXTURE_BINDING_2D
                  case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                    ret = 0;
                    break;
                  }
                  default: {
                    GL.recordError(0x0500); // GL_INVALID_ENUM
                    return;
                  }
                }
              } else if (result instanceof Float32Array ||
                         result instanceof Uint32Array ||
                         result instanceof Int32Array ||
                         result instanceof Array) {
                for (var i = 0; i < result.length; ++i) {
                  switch (type) {
                    case 'Integer': HEAP32[(((p)+(i*4))>>2)]=result[i];   break;
                    case 'Float':   HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                    case 'Boolean': HEAP8[(((p)+(i))>>0)]=result[i] ? 1 : 0;    break;
                    default: throw 'internal glGet error, bad type: ' + type;
                  }
                }
                return;
              } else if (result instanceof WebGLBuffer ||
                         result instanceof WebGLProgram ||
                         result instanceof WebGLFramebuffer ||
                         result instanceof WebGLRenderbuffer ||
                         result instanceof WebGLTexture) {
                ret = result.name | 0;
              } else {
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return;
              }
              break;
            default:
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
          }
        }
  
        switch (type) {
          case 'Integer': HEAP32[((p)>>2)]=ret;    break;
          case 'Float':   HEAPF32[((p)>>2)]=ret;  break;
          case 'Boolean': HEAP8[((p)>>0)]=ret ? 1 : 0; break;
          default: throw 'internal glGet error, bad type: ' + type;
        }
      },getTexPixelData:function (type, format, width, height, pixels, internalFormat) {
        var sizePerPixel;
        switch (type) {
          case 0x1401 /* GL_UNSIGNED_BYTE */:
            switch (format) {
              case 0x1906 /* GL_ALPHA */:
              case 0x1909 /* GL_LUMINANCE */:
                sizePerPixel = 1;
                break;
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4;
                break;
              case 0x190A /* GL_LUMINANCE_ALPHA */:
                sizePerPixel = 2;
                break;
              default:
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return {
                  pixels: null,
                  internalFormat: 0x0
                };
            }
            break;
          case 0x1403 /* GL_UNSIGNED_SHORT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 2;
            } else {
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return {
                pixels: null,
                internalFormat: 0x0
              };
            }
            break;
          case 0x1405 /* GL_UNSIGNED_INT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 4;
            } else {
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return {
                pixels: null,
                internalFormat: 0x0
              };
            }
            break;
          case 0x84FA /* UNSIGNED_INT_24_8_WEBGL */:
            sizePerPixel = 4;
            break;
          case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
          case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
          case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
            sizePerPixel = 2;
            break;
          case 0x1406 /* GL_FLOAT */:
            switch (format) {
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3*4;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4*4;
                break;
              default:
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return {
                  pixels: null,
                  internalFormat: 0x0
                };
            }
            internalFormat = GLctx.RGBA;
            break;
          case 0x8D61 /* GL_HALF_FLOAT_OES */:
            switch (format) {
              case 0x1903 /* GL_RED */:
                sizePerPixel = 2;
                break;
              case 0x8277 /* GL_RG */:
                sizePerPixel = 2*2;
                break;
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3*2;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4*2;
                break;
              default:
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return {
                  pixels: null,
                  internalFormat: 0x0
                };
            }
            break;
          default:
            GL.recordError(0x0500); // GL_INVALID_ENUM
            return {
              pixels: null,
              internalFormat: 0x0
            };
        }
        var bytes = GL.computeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
        if (type == 0x1401 /* GL_UNSIGNED_BYTE */) {
          pixels = HEAPU8.subarray((pixels),(pixels+bytes));
        } else if (type == 0x1406 /* GL_FLOAT */) {
          pixels = HEAPF32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else if (type == 0x1405 /* GL_UNSIGNED_INT */ || type == 0x84FA /* UNSIGNED_INT_24_8_WEBGL */) {
          pixels = HEAPU32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else {
          pixels = HEAPU16.subarray((pixels)>>1,(pixels+bytes)>>1);
        }
        return {
          pixels: pixels,
          internalFormat: internalFormat
        };
      },createContext:function (canvas, webGLContextAttributes) {
        // Default to creating a WebGL 1.0 context if nothing else is specified.
        if (typeof webGLContextAttributes.majorVersion === 'undefined' && typeof webGLContextAttributes.minorVersion === 'undefined') {
          webGLContextAttributes.majorVersion = 1;
          webGLContextAttributes.minorVersion = 0;
        }
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
          try {
            if (webGLContextAttributes.majorVersion == 1 && webGLContextAttributes.minorVersion == 0) {
              ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
            } else {
              throw 'Unsupported WebGL context version ' + majorVersion + '.' + minorVersion + '!'
            }
          } finally {
            canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return 0;
        }
        // possible GL_DEBUG entry point: ctx = wrapDebugGL(ctx);
  
        if (!ctx) return 0;
        var handle = GL.getNewId(GL.contexts);
        var context = { handle: handle };
        context.GLctx = ctx;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes['webGLContextAttributes'] === 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }
        return handle;
      },makeContextCurrent:function (contextHandle) {
        var context = GL.contexts[contextHandle];
        if (!context) return false;
        GLctx = Module.ctx = context.GLctx; // Active WebGL context object.
        GL.currentContext = context; // Active Emscripten GL layer context object.
        return true;
      },getContext:function (contextHandle) {
        return GL.contexts[contextHandle];
      },deleteContext:function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = 0;
        GL.contexts[contextHandle] = null;
      },initExtensions:function (context) {
  
        // If this function is called without a specific context object, init the extensions of the currently active context.
        if (!context) context = GL.currentContext;
  
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
  
        var GLctx = context.GLctx;
  
        context.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist. 
        context.compressionExt = GLctx.getExtension('WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
  
        context.anisotropicExt = GLctx.getExtension('EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  
        context.floatExt = GLctx.getExtension('OES_texture_float');
  
        // Extension available from Firefox 26 and Google Chrome 30
        context.instancedArraysExt = GLctx.getExtension('ANGLE_instanced_arrays');
        
        // Extension available from Firefox 25 and WebKit
        context.vaoExt = GLctx.getExtension('OES_vertex_array_object');
  
        context.drawBuffersExt = GLctx.getExtension('WEBGL_draw_buffers');
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays",
                                               "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc",
                                               "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                               "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources",
                                               "EXT_shader_texture_lod" ];
  
        function shouldEnableAutomatically(extension) {
          var ret = false;
          automaticallyEnabledExtensions.forEach(function(include) {
            if (ext.indexOf(include) != -1) {
              ret = true;
            }
          });
          return ret;
        }
  
   
        GLctx.getSupportedExtensions().forEach(function(ext) {
          ext = ext.replace('MOZ_', '').replace('WEBKIT_', '');
          if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
            GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
          }
        });
      },populateUniformTable:function (program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1 // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
        };
  
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // Strip off any trailing array specifier we might have got, e.g. "[0]".
          if (name.indexOf(']', name.length-1) !== -1) {
            var ls = name.lastIndexOf('[');
            name = name.slice(0, ls);
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then 
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          var id = GL.getNewId(GL.uniforms);
          utable[name] = [u.size, id];
          GL.uniforms[id] = loc;
  
          for (var j = 1; j < u.size; ++j) {
            var n = name + '['+j+']';
            loc = GLctx.getUniformLocation(p, n);
            id = GL.getNewId(GL.uniforms);
  
            GL.uniforms[id] = loc;
          }
        }
      }};function _glClearColor(x0, x1, x2, x3) { GLctx.clearColor(x0, x1, x2, x3) }

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  
  
  var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:function (adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
        for (var ptr in EXCEPTIONS.infos) {
          var info = EXCEPTIONS.infos[ptr];
          if (info.adjusted === adjusted) {
            return ptr;
          }
        }
        return adjusted;
      },addRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++;
      },decRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;
        if (info.refcount === 0) {
          if (info.destructor) {
            Runtime.dynCall('vi', info.destructor, [ptr]);
          }
          delete EXCEPTIONS.infos[ptr];
          ___cxa_free_exception(ptr);
        }
      },clearRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0;
      }};
  function ___resumeException(ptr) {
      if (!EXCEPTIONS.last) { EXCEPTIONS.last = ptr; }
      EXCEPTIONS.clearRef(EXCEPTIONS.deAdjust(ptr)); // exception refcount should be cleared, but don't free it
      throw ptr;
    }function ___cxa_find_matching_catch() {
      var thrown = EXCEPTIONS.last;
      if (!thrown) {
        // just pass through the null ptr
        return ((asm["setTempRet0"](0),0)|0);
      }
      var info = EXCEPTIONS.infos[thrown];
      var throwntype = info.type;
      if (!throwntype) {
        // just pass through the thrown ptr
        return ((asm["setTempRet0"](0),thrown)|0);
      }
      var typeArray = Array.prototype.slice.call(arguments);
  
      var pointer = Module['___cxa_is_pointer_type'](throwntype);
      // can_catch receives a **, add indirection
      if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
      HEAP32[((___cxa_find_matching_catch.buffer)>>2)]=thrown;
      thrown = ___cxa_find_matching_catch.buffer;
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && Module['___cxa_can_catch'](typeArray[i], throwntype, thrown)) {
          thrown = HEAP32[((thrown)>>2)]; // undo indirection
          info.adjusted = thrown;
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
        }
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      thrown = HEAP32[((thrown)>>2)]; // undo indirection
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: ptr,
        type: type,
        destructor: destructor,
        refcount: 0
      };
      EXCEPTIONS.last = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr;
    }

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.buffer.byteLength which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function (node) {
        if (node.contents && node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function (node, newCapacity) {
  
        // If we are asked to expand the size of a file that already exists, revert to using a standard JS array to store the file
        // instead of a typed array. This makes resizing the array more flexible because we can just .push() elements at the back to
        // increase the size.
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
          node.contents = MEMFS.getFileDataAsRegularArray(node);
          node.usedBytes = node.contents.length; // We might be writing to a lazy-loaded file which had overridden this property, so force-reset it.
        }
  
        if (!node.contents || node.contents.subarray) { // Keep using a typed array if creating a new storage, or if old one was a typed array as well.
          var prevCapacity = node.contents ? node.contents.buffer.byteLength : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
          return;
        }
        // Not using a typed array to back the file storage. Use a standard JS array instead.
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0);
      },resizeFileStorage:function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
  
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) { // Can we just reuse the buffer we are given?
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
          // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.chmod(path, entry.mode);
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0;
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto !== 'undefined') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else if (ENVIRONMENT_IS_NODE) {
          // for nodejs
          random_device = function() { return require('crypto').randomBytes(1)[0]; };
        } else {
          // default for ES5 platforms
          random_device = function() { return (Math.random()*256)|0; };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
          if (this.stack) this.stack = demangleAll(this.stack);
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperty(node, "usedBytes", {
            get: function() { return this.contents.length; }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) return -1;
      return stream.fd;
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      var fd = _fileno(stream);
      _fsync(fd);
      return _close(fd);
    }

  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }

  var _emscripten_landingpad=true;

  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }

  
  
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        // If Module['websocket'] has already been defined (e.g. for configuring
        // the subprotocol/url) use that, if not initialise it to a new object.
        Module['websocket'] = (Module['websocket'] && 
                               ('object' === typeof Module['websocket'])) ? Module['websocket'] : {};
  
        // Add the Event registration mechanism to the exported websocket configuration
        // object so we can register network callbacks from native JavaScript too.
        // For more documentation see system/include/emscripten/emscripten.h
        Module['websocket']._callbacks = {};
        Module['websocket']['on'] = function(event, callback) {
  	    if ('function' === typeof callback) {
  		  this._callbacks[event] = callback;
          }
  	    return this;
        };
  
        Module['websocket'].emit = function(event, param) {
  	    if ('function' === typeof this._callbacks[event]) {
  		  this._callbacks[event].call(this, param);
          }
        };
  
        // If debug is enabled register simple default logging callbacks for each Event.
  
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          error: null, // Used in getsockopt for SOL_SOCKET/SO_ERROR test
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              // runtimeConfig gets set to true if WebSocket runtime configuration is available.
              var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));
  
              // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
              // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
              var url = 'ws:#'.replace('#', '//');
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['url']) {
                  url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                }
              }
  
              if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                var parts = addr.split('/');
                url = url + parts[0] + ":" + port + "/" + parts.slice(1).join('/');
              }
  
              // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
              var subProtocols = 'binary'; // The default value is 'binary'
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['subprotocol']) {
                  subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                }
              }
  
              // The regex trims the string (removes spaces at the beginning and end, then splits the string by
              // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
              subProtocols = subProtocols.replace(/^ +| +$/g,"").split(/ *, */);
  
              // The node ws library API for specifying optional subprotocol is slightly different than the browser's.
              var opts = ENVIRONMENT_IS_NODE ? {'protocol': subProtocols.toString()} : subProtocols;
  
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
  
            Module['websocket'].emit('open', sock.stream.fd);
  
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
            Module['websocket'].emit('message', sock.stream.fd);
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('close', function() {
              Module['websocket'].emit('close', sock.stream.fd);
            });
            peer.socket.on('error', function(error) {
              // Although the ws library may pass errors that may be more descriptive than
              // ECONNREFUSED they are not necessarily the expected error code e.g. 
              // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
              // is still probably the most useful thing to do.
              sock.error = ERRNO_CODES.ECONNREFUSED; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
              Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onclose = function() {
              Module['websocket'].emit('close', sock.stream.fd);
            };
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
            peer.socket.onerror = function(error) {
              // The WebSocket spec only allows a 'simple event' to be thrown on error,
              // so we only really know as much as ECONNREFUSED.
              sock.error = ERRNO_CODES.ECONNREFUSED; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
              Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          Module['websocket'].emit('listen', sock.stream.fd); // Send Event with listen fd.
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
              Module['websocket'].emit('connection', newsock.stream.fd);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
              Module['websocket'].emit('connection', sock.stream.fd);
            }
          });
          sock.server.on('closed', function() {
            Module['websocket'].emit('close', sock.stream.fd);
            sock.server = null;
          });
          sock.server.on('error', function(error) {
            // Although the ws library may pass errors that may be more descriptive than
            // ECONNREFUSED they are not necessarily the expected error code e.g. 
            // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
            // is still probably the most useful thing to do. This error shouldn't
            // occur in a well written app as errors should get trapped in the compiled
            // app's own getaddrinfo call.
            sock.error = ERRNO_CODES.EHOSTUNREACH; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
            Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'EHOSTUNREACH: Host is unreachable']);
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return (bytesWritten / size)|0;
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[((textIndex)>>0)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)>>0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)>>0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)>>0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)>>0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)>>0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)>>0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)>>0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)>>0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[((i)>>0)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }

  function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
    }

  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var fd = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return fd === -1 ? 0 : FS.getPtrForStream(FS.getStream(fd));
    }

  var _sqrtf=Math_sqrt;

  var _fabsf=Math_abs;

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: {
          if (typeof navigator === 'object') return navigator['hardwareConcurrency'] || 1;
          return 1;
        }
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)>>0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }

  function _glClear(x0) { GLctx.clear(x0) }

  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }

  function _glActiveTexture(x0) { GLctx.activeTexture(x0) }

  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }

  function _glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
  
      GLctx.bindBuffer(target, bufferObj);
    }

  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function (func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          try {
            func();
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else {
              if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
              throw e;
            }
          }
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
          
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      function(){};
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && canvas.requestPointerLock) {
                canvas.requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          contextHandle = GL.createContext(canvas, contextAttributes);
          if (contextHandle) {
            ctx = GL.getContext(contextHandle).GLctx;
          }
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement'] ||
               document['msFullScreenElement'] || document['msFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'] ||
                                      document['msExitFullscreen'] ||
                                      document['exitFullscreen'] ||
                                      function() {};
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          document.addEventListener('MSFullscreenChange', fullScreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullScreen = canvasContainer['requestFullScreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvasContainer.requestFullScreen();
      },nextRAF:0,fakeRequestAnimationFrame:function (func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          Browser.fakeRequestAnimationFrame(func);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           Browser.fakeRequestAnimationFrame;
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll': 
            delta = event.detail;
            break;
          case 'mousewheel': 
            delta = event.wheelDelta;
            break;
          case 'wheel': 
            delta = event['deltaY'];
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
            
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              Browser.lastTouches[touch.identifier] = Browser.touches[touch.identifier];
              Browser.touches[touch.identifier] = { x: adjustedX, y: adjustedY };
            } 
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
             document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
             document['fullScreenElement'] || document['fullscreenElement'] ||
             document['msFullScreenElement'] || document['msFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function () {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      }};

  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }

  
  
  function _emscripten_get_now() {
      if (!_emscripten_get_now.actual) {
        if (ENVIRONMENT_IS_NODE) {
          _emscripten_get_now.actual = function _emscripten_get_now_actual() {
            var t = process['hrtime']();
            return t[0] * 1e3 + t[1] / 1e6;
          }
        } else if (typeof dateNow !== 'undefined') {
          _emscripten_get_now.actual = dateNow;
        } else if (ENVIRONMENT_IS_WEB && window['performance'] && window['performance']['now']) {
          _emscripten_get_now.actual = function _emscripten_get_now_actual() { return window['performance']['now'](); };
        } else {
          _emscripten_get_now.actual = Date.now;
        }
      }
      return _emscripten_get_now.actual();
    }var GLFW={Window:function (id, width, height, title, monitor, share) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.storedX = 0; // Used to store X before fullscreen
        this.storedY = 0; // Used to store Y before fullscreen
        this.width = width;
        this.height = height;
        this.storedWidth = width; // Used to store width before fullscreen
        this.storedHeight = height; // Used to store height before fullscreen
        this.title = title;
        this.monitor = monitor;
        this.share = share;
        this.attributes = GLFW.hints;
        this.inputModes = {
          0x00033001:0x00034001, // GLFW_CURSOR (GLFW_CURSOR_NORMAL)
          0x00033002:0, // GLFW_STICKY_KEYS
          0x00033003:0, // GLFW_STICKY_MOUSE_BUTTONS
        };
        this.buttons = 0;
        this.keys = new Array();
        this.shouldClose = 0;
        this.title = null;
        this.windowPosFunc = null; // GLFWwindowposfun
        this.windowSizeFunc = null; // GLFWwindowsizefun
        this.windowCloseFunc = null; // GLFWwindowclosefun
        this.windowRefreshFunc = null; // GLFWwindowrefreshfun
        this.windowFocusFunc = null; // GLFWwindowfocusfun
        this.windowIconifyFunc = null; // GLFWwindowiconifyfun
        this.framebufferSizeFunc = null; // GLFWframebuffersizefun
        this.mouseButtonFunc = null; // GLFWmousebuttonfun
        this.cursorPosFunc = null; // GLFWcursorposfun
        this.cursorEnterFunc = null; // GLFWcursorenterfun
        this.scrollFunc = null; // GLFWscrollfun
        this.keyFunc = null; // GLFWkeyfun
        this.charFunc = null; // GLFWcharfun
        this.userptr = null;
      },WindowFromId:function (id) {
        if (id <= 0 || !GLFW.windows) return null;
        return GLFW.windows[id - 1];
      },errorFunc:null,monitorFunc:null,active:null,windows:null,monitors:null,monitorString:null,versionString:null,initialTime:null,extensions:null,hints:null,defaultHints:{131073:0,131074:0,131075:1,131076:1,131077:1,135169:8,135170:8,135171:8,135172:8,135173:24,135174:8,135175:0,135176:0,135177:0,135178:0,135179:0,135180:0,135181:0,135182:0,135183:0,139265:196609,139266:1,139267:0,139268:0,139269:0,139270:0,139271:0,139272:0},DOMToGLFWKeyCode:function (keycode) {
        switch (keycode) {
          case 0x20:return 32; // DOM_VK_SPACE -> GLFW_KEY_SPACE
          case 0xDE:return 39; // DOM_VK_QUOTE -> GLFW_KEY_APOSTROPHE
          case 0xBC:return 44; // DOM_VK_COMMA -> GLFW_KEY_COMMA
          case 0xAD:return 45; // DOM_VK_HYPHEN_MINUS -> GLFW_KEY_MINUS
          case 0xBE:return 46; // DOM_VK_PERIOD -> GLFW_KEY_PERIOD
          case 0xBF:return 47; // DOM_VK_SLASH -> GLFW_KEY_SLASH
          case 0x30:return 48; // DOM_VK_0 -> GLFW_KEY_0
          case 0x31:return 49; // DOM_VK_1 -> GLFW_KEY_1
          case 0x32:return 50; // DOM_VK_2 -> GLFW_KEY_2
          case 0x33:return 51; // DOM_VK_3 -> GLFW_KEY_3
          case 0x34:return 52; // DOM_VK_4 -> GLFW_KEY_4
          case 0x35:return 53; // DOM_VK_5 -> GLFW_KEY_5
          case 0x36:return 54; // DOM_VK_6 -> GLFW_KEY_6
          case 0x37:return 55; // DOM_VK_7 -> GLFW_KEY_7
          case 0x38:return 56; // DOM_VK_8 -> GLFW_KEY_8
          case 0x39:return 57; // DOM_VK_9 -> GLFW_KEY_9
          case 0x3B:return 59; // DOM_VK_SEMICOLON -> GLFW_KEY_SEMICOLON
          case 0x61:return 61; // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
          case 0x41:return 65; // DOM_VK_A -> GLFW_KEY_A
          case 0x42:return 66; // DOM_VK_B -> GLFW_KEY_B
          case 0x43:return 67; // DOM_VK_C -> GLFW_KEY_C
          case 0x44:return 68; // DOM_VK_D -> GLFW_KEY_D
          case 0x45:return 69; // DOM_VK_E -> GLFW_KEY_E
          case 0x46:return 70; // DOM_VK_F -> GLFW_KEY_F
          case 0x47:return 71; // DOM_VK_G -> GLFW_KEY_G
          case 0x48:return 72; // DOM_VK_H -> GLFW_KEY_H
          case 0x49:return 73; // DOM_VK_I -> GLFW_KEY_I
          case 0x4A:return 74; // DOM_VK_J -> GLFW_KEY_J
          case 0x4B:return 75; // DOM_VK_K -> GLFW_KEY_K
          case 0x4C:return 76; // DOM_VK_L -> GLFW_KEY_L
          case 0x4D:return 77; // DOM_VK_M -> GLFW_KEY_M
          case 0x4E:return 78; // DOM_VK_N -> GLFW_KEY_N
          case 0x4F:return 79; // DOM_VK_O -> GLFW_KEY_O
          case 0x50:return 80; // DOM_VK_P -> GLFW_KEY_P
          case 0x51:return 81; // DOM_VK_Q -> GLFW_KEY_Q
          case 0x52:return 82; // DOM_VK_R -> GLFW_KEY_R
          case 0x53:return 83; // DOM_VK_S -> GLFW_KEY_S
          case 0x54:return 84; // DOM_VK_T -> GLFW_KEY_T
          case 0x55:return 85; // DOM_VK_U -> GLFW_KEY_U
          case 0x56:return 86; // DOM_VK_V -> GLFW_KEY_V
          case 0x57:return 87; // DOM_VK_W -> GLFW_KEY_W
          case 0x58:return 88; // DOM_VK_X -> GLFW_KEY_X
          case 0x59:return 89; // DOM_VK_Y -> GLFW_KEY_Y
          case 0x5a:return 90; // DOM_VK_Z -> GLFW_KEY_Z
          case 0xDB:return 91; // DOM_VK_OPEN_BRACKET -> GLFW_KEY_LEFT_BRACKET
          case 0xDC:return 92; // DOM_VK_BACKSLASH -> GLFW_KEY_BACKSLASH
          case 0xDD:return 93; // DOM_VK_CLOSE_BRACKET -> GLFW_KEY_RIGHT_BRACKET
          case 0xC0:return 94; // DOM_VK_BACK_QUOTE -> GLFW_KEY_GRAVE_ACCENT
          case 0x1B:return 256; // DOM_VK_ESCAPE -> GLFW_KEY_ESCAPE
          case 0x0D:return 257; // DOM_VK_RETURN -> GLFW_KEY_ENTER
          case 0x09:return 258; // DOM_VK_TAB -> GLFW_KEY_TAB
          case 0x08:return 259; // DOM_VK_BACK -> GLFW_KEY_BACKSPACE
          case 0x2D:return 260; // DOM_VK_INSERT -> GLFW_KEY_INSERT
          case 0x2E:return 261; // DOM_VK_DELETE -> GLFW_KEY_DELETE
          case 0x27:return 262; // DOM_VK_RIGHT -> GLFW_KEY_RIGHT
          case 0x25:return 263; // DOM_VK_LEFT -> GLFW_KEY_LEFT
          case 0x28:return 264; // DOM_VK_DOWN -> GLFW_KEY_DOWN
          case 0x26:return 265; // DOM_VK_UP -> GLFW_KEY_UP
          case 0x21:return 266; // DOM_VK_PAGE_UP -> GLFW_KEY_PAGE_UP
          case 0x22:return 267; // DOM_VK_PAGE_DOWN -> GLFW_KEY_PAGE_DOWN
          case 0x24:return 268; // DOM_VK_HOME -> GLFW_KEY_HOME
          case 0x23:return 269; // DOM_VK_END -> GLFW_KEY_END
          case 0x14:return 280; // DOM_VK_CAPS_LOCK -> GLFW_KEY_CAPS_LOCK
          case 0x91:return 281; // DOM_VK_SCROLL_LOCK -> GLFW_KEY_SCROLL_LOCK
          case 0x90:return 282; // DOM_VK_NUM_LOCK -> GLFW_KEY_NUM_LOCK
          case 0x2C:return 283; // DOM_VK_SNAPSHOT -> GLFW_KEY_PRINT_SCREEN
          case 0x13:return 284; // DOM_VK_PAUSE -> GLFW_KEY_PAUSE
          case 0x70:return 290; // DOM_VK_F1 -> GLFW_KEY_F1
          case 0x71:return 291; // DOM_VK_F2 -> GLFW_KEY_F2
          case 0x72:return 292; // DOM_VK_F3 -> GLFW_KEY_F3
          case 0x73:return 293; // DOM_VK_F4 -> GLFW_KEY_F4
          case 0x74:return 294; // DOM_VK_F5 -> GLFW_KEY_F5
          case 0x75:return 295; // DOM_VK_F6 -> GLFW_KEY_F6
          case 0x76:return 296; // DOM_VK_F7 -> GLFW_KEY_F7
          case 0x77:return 297; // DOM_VK_F8 -> GLFW_KEY_F8
          case 0x78:return 298; // DOM_VK_F9 -> GLFW_KEY_F9
          case 0x79:return 299; // DOM_VK_F10 -> GLFW_KEY_F10
          case 0x7A:return 300; // DOM_VK_F11 -> GLFW_KEY_F11
          case 0x7B:return 301; // DOM_VK_F12 -> GLFW_KEY_F12
          case 0x7C:return 302; // DOM_VK_F13 -> GLFW_KEY_F13
          case 0x7D:return 303; // DOM_VK_F14 -> GLFW_KEY_F14
          case 0x7E:return 304; // DOM_VK_F15 -> GLFW_KEY_F15
          case 0x7F:return 305; // DOM_VK_F16 -> GLFW_KEY_F16
          case 0x80:return 306; // DOM_VK_F17 -> GLFW_KEY_F17
          case 0x81:return 307; // DOM_VK_F18 -> GLFW_KEY_F18
          case 0x82:return 308; // DOM_VK_F19 -> GLFW_KEY_F19
          case 0x83:return 309; // DOM_VK_F20 -> GLFW_KEY_F20
          case 0x84:return 310; // DOM_VK_F21 -> GLFW_KEY_F21
          case 0x85:return 311; // DOM_VK_F22 -> GLFW_KEY_F22
          case 0x86:return 312; // DOM_VK_F23 -> GLFW_KEY_F23
          case 0x87:return 313; // DOM_VK_F24 -> GLFW_KEY_F24
          case 0x88:return 314; // 0x88 (not used?) -> GLFW_KEY_F25
          case 0x60:return 320; // DOM_VK_NUMPAD0 -> GLFW_KEY_KP_0
          case 0x61:return 321; // DOM_VK_NUMPAD1 -> GLFW_KEY_KP_1
          case 0x62:return 322; // DOM_VK_NUMPAD2 -> GLFW_KEY_KP_2
          case 0x63:return 323; // DOM_VK_NUMPAD3 -> GLFW_KEY_KP_3
          case 0x64:return 324; // DOM_VK_NUMPAD4 -> GLFW_KEY_KP_4
          case 0x65:return 325; // DOM_VK_NUMPAD5 -> GLFW_KEY_KP_5
          case 0x66:return 326; // DOM_VK_NUMPAD6 -> GLFW_KEY_KP_6
          case 0x67:return 327; // DOM_VK_NUMPAD7 -> GLFW_KEY_KP_7
          case 0x68:return 328; // DOM_VK_NUMPAD8 -> GLFW_KEY_KP_8
          case 0x69:return 329; // DOM_VK_NUMPAD9 -> GLFW_KEY_KP_9
          case 0x6E:return 330; // DOM_VK_DECIMAL -> GLFW_KEY_KP_DECIMAL
          case 0x6F:return 331; // DOM_VK_DIVIDE -> GLFW_KEY_KP_DIVIDE
          case 0x6A:return 332; // DOM_VK_MULTIPLY -> GLFW_KEY_KP_MULTIPLY
          case 0x6D:return 333; // DOM_VK_SUBTRACT -> GLFW_KEY_KP_SUBTRACT
          case 0x6B:return 334; // DOM_VK_ADD -> GLFW_KEY_KP_ADD
          // case 0x0D:return 335; // DOM_VK_RETURN -> GLFW_KEY_KP_ENTER (DOM_KEY_LOCATION_RIGHT)
          // case 0x61:return 336; // DOM_VK_EQUALS -> GLFW_KEY_KP_EQUAL (DOM_KEY_LOCATION_RIGHT)
          case 0x10:return 340; // DOM_VK_SHIFT -> GLFW_KEY_LEFT_SHIFT
          case 0x11:return 341; // DOM_VK_CONTROL -> GLFW_KEY_LEFT_CONTROL
          case 0x12:return 342; // DOM_VK_ALT -> GLFW_KEY_LEFT_ALT
          case 0x5B:return 343; // DOM_VK_WIN -> GLFW_KEY_LEFT_SUPER
          // case 0x10:return 344; // DOM_VK_SHIFT -> GLFW_KEY_RIGHT_SHIFT (DOM_KEY_LOCATION_RIGHT)
          // case 0x11:return 345; // DOM_VK_CONTROL -> GLFW_KEY_RIGHT_CONTROL (DOM_KEY_LOCATION_RIGHT)
          // case 0x12:return 346; // DOM_VK_ALT -> GLFW_KEY_RIGHT_ALT (DOM_KEY_LOCATION_RIGHT)
          // case 0x5B:return 347; // DOM_VK_WIN -> GLFW_KEY_RIGHT_SUPER (DOM_KEY_LOCATION_RIGHT)
          case 0x5D:return 348; // DOM_VK_CONTEXT_MENU -> GLFW_KEY_MENU
  
          // XXX: GLFW_KEY_WORLD_1, GLFW_KEY_WORLD_2 what are these?
          default:return -1; // GLFW_KEY_UNKNOWN
        };
      },getModBits:function (win) {
        var mod = 0;
        if (win.keys[0x10]) mod |= 0x0001; // GLFW_MOD_SHIFT
        if (win.keys[0x11]) mod |= 0x0002; // GLFW_MOD_CONTROL
        if (win.keys[0x12]) mod |= 0x0004; // GLFW_MOD_ALT
        if (win.keys[0x5B]) mod |= 0x0008; // GLFW_MOD_SUPER
        return mod;
      },onKeyPress:function (event) {
        if (!GLFW.active || !GLFW.active.charFunc) return;
  
        // correct unicode charCode is only available with onKeyPress event
        var charCode = event.charCode;
        if (charCode == 0 || (charCode >= 0x00 && charCode <= 0x1F)) return;
  
        Runtime.dynCall('vii', GLFW.active.charFunc, [charCode, 1]);
  
      },onKeyChanged:function (event, status) {
        if (!GLFW.active) return;
  
        var key = GLFW.DOMToGLFWKeyCode(event.keyCode);
        if (key == -1) return;
  
        GLFW.active.keys[key] = status;
        if (!GLFW.active.keyFunc) return;
  
        Runtime.dynCall('vii', GLFW.active.keyFunc, [key, status]);
  
      },onKeydown:function (event) {
        GLFW.onKeyChanged(event, 1); // GLFW_PRESS
  
        // This logic comes directly from the sdl implementation. We cannot
        // call preventDefault on all keydown events otherwise onKeyPress will
        // not get called
        if (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */) {
          event.preventDefault();
        }
      },onKeyup:function (event) {
        GLFW.onKeyChanged(event, 0); // GLFW_RELEASE
      },onMousemove:function (event) {
        if (!GLFW.active) return;
  
        Browser.calculateMouseEvent(event);
  
        if (event.target != Module["canvas"] || !GLFW.active.cursorPosFunc) return;
  
        Runtime.dynCall('vii', GLFW.active.cursorPosFunc, [Browser.mouseX, Browser.mouseY]);
  
      },onMouseButtonChanged:function (event, status) {
        if (!GLFW.active || !GLFW.active.mouseButtonFunc) return;
  
        Browser.calculateMouseEvent(event);
  
        if (event.target != Module["canvas"]) return;
  
        if (status == 1) { // GLFW_PRESS
          try {
            event.target.setCapture();
          } catch (e) {}
        }
  
        // DOM and glfw have different button codes
        var eventButton = event['button'];
        if (eventButton > 0) {
          if (eventButton == 1) {
            eventButton = 2;
          } else {
            eventButton = 1;
          }
        }
  
        Runtime.dynCall('vii', GLFW.active.mouseButtonFunc, [eventButton, status]);
  
      },onMouseButtonDown:function (event) {
        if (!GLFW.active) return;
        GLFW.active.buttons |= (1 << event['button']);
        GLFW.onMouseButtonChanged(event, 1); // GLFW_PRESS
      },onMouseButtonUp:function (event) {
        if (!GLFW.active) return;
        GLFW.active.buttons &= ~(1 << event['button']);
        GLFW.onMouseButtonChanged(event, 0); // GLFW_RELEASE
      },onMouseWheel:function (event) {
        // Note the minus sign that flips browser wheel direction (positive direction scrolls page down) to native wheel direction (positive direction is mouse wheel up)
        var delta = -Browser.getMouseWheelDelta(event);
        delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1)); // Quantize to integer so that minimum scroll is at least +/- 1.
        GLFW.wheelPos += delta;
  
        if (!GLFW.active || !GLFW.active.scrollFunc || event.target != Module['canvas']) return;
  
        Runtime.dynCall('vi', GLFW.mouseWheelFunc, [GLFW.wheelPos]);
  
  
        event.preventDefault();
      },onFullScreenEventChange:function (event) {
        if (!GLFW.active) return;
  
        if (document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
          GLFW.active.storedX = GLFW.active.x;
          GLFW.active.storedY = GLFW.active.y;
          GLFW.active.x = GLFW.active.y = 0;
          GLFW.active.storedWidth = GLFW.active.width;
          GLFW.active.storedHeight = GLFW.active.height;
          GLFW.active.width = screen.width;
          GLFW.active.height = screen.height;
        } else {
          document.removeEventListener('fullscreenchange', GLFW.onFullScreenEventChange, true);
          document.removeEventListener('mozfullscreenchange', GLFW.onFullScreenEventChange, true);
          document.removeEventListener('webkitfullscreenchange', GLFW.onFullScreenEventChange, true);
          GLFW.active.width = GLFW.active.storedWidth;
          GLFW.active.height = GLFW.active.storedHeight;
        }
  
        Browser.setCanvasSize(GLFW.active.width, GLFW.active.height);
  
        if (!GLFW.active.windowResizeFunc) return;
  
        Runtime.dynCall('vii', GLFW.active.windowResizeFunc, [width, height]);
  
      },requestFullScreen:function () {
        var RFS = Module["canvas"]['requestFullscreen'] ||
                  Module["canvas"]['requestFullScreen'] ||
                  Module["canvas"]['mozRequestFullScreen'] ||
                  Module["canvas"]['webkitRequestFullScreen'] ||
                  (function() {});
        RFS.apply(Module["canvas"], []);
      },cancelFullScreen:function () {
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['webkitCancelFullScreen'] ||
            (function() {});
        CFS.apply(document, []);
      },getTime:function () {
        return _emscripten_get_now() / 1000;
      },setWindowTitle:function (winid, title) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        win.title = Pointer_stringify(title);
        if (GLFW.active.id == win.id) {
          document.title = win.title;
        }
      },setKeyCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.keyFunc = cbfun;
      },setCharCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.charFunc = cbfun;
      },setMouseButtonCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.mouseButtonFunc = cbfun;
      },setCursorPosCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.mousePosFunc = cbfun;
      },setScrollCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.mouseWheelFunc = cbfun;
      },setWindowSizeCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowSizeFunc = cbfun;
      },setWindowCloseCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowCloseFunc = cbfun;
      },setWindowRefreshCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.windowRefreshFunc = cbfun;
      },getKey:function (winid, key) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return 0;
        return win.keys[key];
      },getMouseButton:function (winid, button) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return 0;
        return (win.buttons & (1 << button)) > 0;
      },getCursorPos:function (winid, x, y) {
        setValue(x, Browser.mouseX, 'i32');
        setValue(y, Browser.mouseY, 'i32');
      },setCursorPos:function (winid, x, y) {
      },getWindowPos:function (winid, x, y) {
        var wx = 0;
        var wy = 0;
  
        var win = GLFW.WindowFromId(winid);
        if (win) {
          wx = win.x;
          wy = win.y;
        }
  
        setValue(x, wx, 'i32');
        setValue(y, wy, 'i32');
      },setWindowPos:function (winid, x, y) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.x = x;
        win.y = y;
      },getWindowSize:function (winid, width, height) {
        var ww = 0;
        var wh = 0;
  
        var win = GLFW.WindowFromId(winid);
        if (win) {
          ww = win.width;
          wh = win.height;
        }
  
        setValue(width, ww, 'i32');
        setValue(height, wh, 'i32');
      },setWindowSize:function (winid, width, height) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
        if (GLFW.active.id == win.id) {
          if (width == screen.width && height == screen.height) {
            GLFW.requestFullScreen();
          } else {
            GLFW.cancelFullScreen();
            Browser.setCanvasSize(width, height);
            win.width = width;
            win.height = height;
          }
        }
  
        if (!win.windowResizeFunc) return;
  
        Runtime.dynCall('vii', win.windowResizeFunc, [width, height]);
  
      },createWindow:function (width, height, title, monitor, share) {
        var i, id;
        for (i = 0; i < GLFW.windows.length && GLFW.windows[i] !== null; i++);
        if (i > 0) throw "glfwCreateWindow only supports one window at time currently";
  
        // id for window
        id = i + 1;
  
        // not valid
        if (width <= 0 || height <= 0) return 0;
  
        if (monitor) {
          GLFW.requestFullScreen();
        } else {
          Browser.setCanvasSize(width, height);
        }
  
        // Create context when there are no existing alive windows
        for (i = 0; i < GLFW.windows.length && GLFW.windows[i] == null; i++);
        if (i == GLFW.windows.length) {
          var contextAttributes = {
            antialias: (GLFW.hints[0x0002100D] > 1), // GLFW_SAMPLES
            depth: (GLFW.hints[0x00021005] > 0),     // GLFW_DEPTH_BITS
            stencil: (GLFW.hints[0x00021006] > 0)    // GLFW_STENCIL_BITS
          }
          Module.ctx = Browser.createContext(Module['canvas'], true, true, contextAttributes);
        }
  
        // Get non alive id
        var win = new GLFW.Window(id, width, height, title, monitor, share);
  
        // Set window to array
        if (id - 1 == GLFW.windows.length) {
          GLFW.windows.push(win);
        } else {
          GLFW.windows[id - 1] = win;
        }
  
        GLFW.active = win;
        return win.id;
      },destroyWindow:function (winid) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
  
  
        GLFW.windows[win.id - 1] = null;
        if (GLFW.active.id == win.id)
          GLFW.active = null;
  
        // Destroy context when no alive windows
        for (var i = 0; i < GLFW.windows.length; i++)
          if (GLFW.windows[i] !== null) return;
  
        Module.ctx = Browser.destroyContext(Module['canvas'], true, true);
      },swapBuffers:function (winid) {
      },GLFW2ParamToGLFW3Param:function (param) {
        table = {
          0x00030001:0, // GLFW_MOUSE_CURSOR
          0x00030002:0, // GLFW_STICKY_KEYS
          0x00030003:0, // GLFW_STICKY_MOUSE_BUTTONS
          0x00030004:0, // GLFW_SYSTEM_KEYS
          0x00030005:0, // GLFW_KEY_REPEAT
          0x00030006:0, // GLFW_AUTO_POLL_EVENTS
          0x00020001:0, // GLFW_OPENED
          0x00020002:0, // GLFW_ACTIVE
          0x00020003:0, // GLFW_ICONIFIED
          0x00020004:0, // GLFW_ACCELERATED
          0x00020005:0x00021001, // GLFW_RED_BITS
          0x00020006:0x00021002, // GLFW_GREEN_BITS
          0x00020007:0x00021003, // GLFW_BLUE_BITS
          0x00020008:0x00021004, // GLFW_ALPHA_BITS
          0x00020009:0x00021005, // GLFW_DEPTH_BITS
          0x0002000A:0x00021006, // GLFW_STENCIL_BITS
          0x0002000B:0x0002100F, // GLFW_REFRESH_RATE
          0x0002000C:0x00021007, // GLFW_ACCUM_RED_BITS
          0x0002000D:0x00021008, // GLFW_ACCUM_GREEN_BITS
          0x0002000E:0x00021009, // GLFW_ACCUM_BLUE_BITS
          0x0002000F:0x0002100A, // GLFW_ACCUM_ALPHA_BITS
          0x00020010:0x0002100B, // GLFW_AUX_BUFFERS
          0x00020011:0x0002100C, // GLFW_STEREO
          0x00020012:0, // GLFW_WINDOW_NO_RESIZE
          0x00020013:0x0002100D, // GLFW_FSAA_SAMPLES
          0x00020014:0x00022002, // GLFW_OPENGL_VERSION_MAJOR
          0x00020015:0x00022003, // GLFW_OPENGL_VERSION_MINOR
          0x00020016:0x00022006, // GLFW_OPENGL_FORWARD_COMPAT
          0x00020017:0x00022007, // GLFW_OPENGL_DEBUG_CONTEXT
          0x00020018:0x00022008, // GLFW_OPENGL_PROFILE
        };
        return table[param];
      }};function _glfwOpenWindow(width, height, redbits, greenbits, bluebits, alphabits, depthbits, stencilbits, mode) {
      GLFW.hints[0x00021001] = redbits;     // GLFW_RED_BITS
      GLFW.hints[0x00021002] = greenbits;   // GLFW_GREEN_BITS
      GLFW.hints[0x00021003] = bluebits;    // GLFW_BLUE_BITS
      GLFW.hints[0x00021004] = alphabits;   // GLFW_ALPHA_BITS
      GLFW.hints[0x00021005] = depthbits;   // GLFW_DEPTH_BITS
      GLFW.hints[0x00021006] = stencilbits; // GLFW_STENCIL_BITS
      GLFW.createWindow(width, height, "GLFW2 Window", 0, 0);
      return 1; // GL_TRUE
    }

  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)>>0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(streamObj.fd, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return (bytesRead / size)|0;
    }

  function _vprintf(format, va_arg) {
      return _printf(format, HEAP32[((va_arg)>>2)]);
    }

  function _glBufferData(target, size, data, usage) {
      switch (usage) { // fix usages, WebGL only has *_DRAW
        case 0x88E1: // GL_STREAM_READ
        case 0x88E2: // GL_STREAM_COPY
          usage = 0x88E0; // GL_STREAM_DRAW
          break;
        case 0x88E5: // GL_STATIC_READ
        case 0x88E6: // GL_STATIC_COPY
          usage = 0x88E4; // GL_STATIC_DRAW
          break;
        case 0x88E9: // GL_DYNAMIC_READ
        case 0x88EA: // GL_DYNAMIC_COPY
          usage = 0x88E8; // GL_DYNAMIC_DRAW
          break;
      }
      if (!data) {
        GLctx.bufferData(target, size, usage);
      } else {
        GLctx.bufferData(target, HEAPU8.subarray(data, data+size), usage);
      }
    }

  var _emscripten_resume=true;

  function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    }

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  function _glGenTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = GL.getNewId(GL.textures);
        var texture = GLctx.createTexture();
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[(((textures)+(i*4))>>2)]=id;
      }
    }

  var _emscripten_preinvoke=true;

  function ___gxx_personality_v0() {
    }

  function _glfwInit() {
      if (GLFW.windows) return 1; // GL_TRUE
  
      GLFW.initalTime = GLFW.getTime();
      GLFW.hints = GLFW.defaultHints;
      GLFW.windows = new Array()
      GLFW.active = null;
  
      window.addEventListener("keydown", GLFW.onKeydown, true);
      window.addEventListener("keypress", GLFW.onKeyPress, true);
      window.addEventListener("keyup", GLFW.onKeyup, true);
      Module["canvas"].addEventListener("mousemove", GLFW.onMousemove, true);
      Module["canvas"].addEventListener("mousedown", GLFW.onMouseButtonDown, true);
      Module["canvas"].addEventListener("mouseup", GLFW.onMouseButtonUp, true);
      Module["canvas"].addEventListener('wheel', GLFW.onMouseWheel, true);
      Module["canvas"].addEventListener('mousewheel', GLFW.onMouseWheel, true);
      return 1; // GL_TRUE
    }

  function _glUniform1f(location, v0) {
      location = GL.uniforms[location];
      GLctx.uniform1f(location, v0);
    }

  function _glfwSwapBuffers() {
      GLFW.swapBuffers(GLFW.active.id);
    }

  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  
  
  
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;
  
  function _free() {
  }
  Module["_free"] = _free;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  var _environ=allocate(1, "i32*", ALLOC_STATIC);var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
  
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = 'web_user';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/web_user';
        ENV['LANG'] = 'C';
        ENV['_'] = Module['thisProgram'];
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr;
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
  
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
  
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }var ENV={};function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
  
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }
  
  function _putenv(string) {
      // int putenv(char *string);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/putenv.html
      // WARNING: According to the standard (and the glibc implementation), the
      //          string is taken by reference so future changes are reflected.
      //          We copy it instead, possibly breaking some uses.
      if (string === 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      }
      string = Pointer_stringify(string);
      var splitPoint = string.indexOf('=')
      if (string === '' || string.indexOf('=') === -1) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      }
      var name = string.slice(0, splitPoint);
      var value = string.slice(splitPoint + 1);
      if (!(name in ENV) || ENV[name] !== value) {
        ENV[name] = value;
        ___buildEnvironment(ENV);
      }
      return 0;
    }
  
  function _SDL_RWFromConstMem(mem, size) {
      var id = SDL.rwops.length; // TODO: recycle ids when they are null
      SDL.rwops.push({ bytes: mem, count: size });
      return id;
    }function _TTF_RenderText_Solid(font, text, color) {
      // XXX the font and color are ignored
      text = Pointer_stringify(text) || ' '; // if given an empty string, still return a valid surface
      var fontData = SDL.fonts[font];
      var w = SDL.estimateTextWidth(fontData, text);
      var h = fontData.size;
      var color = SDL.loadColorToCSSRGB(color); // XXX alpha breaks fonts?
      var fontString = h + 'px ' + fontData.name;
      var surf = SDL.makeSurface(w, h, 0, false, 'text:' + text); // bogus numbers..
      var surfData = SDL.surfaces[surf];
      surfData.ctx.save();
      surfData.ctx.fillStyle = color;
      surfData.ctx.font = fontString;
      surfData.ctx.textBaseline = 'top';
      surfData.ctx.fillText(text, 0, 0);
      surfData.ctx.restore();
      return surf;
    }function _Mix_HaltMusic() {
      var audio = SDL.music.audio;
      if (audio) {
        audio.src = audio.src; // rewind <media> element
        audio.currentPosition = 0; // rewind Web Audio graph playback.
        audio.pause();
      }
      SDL.music.audio = null;
      if (SDL.hookMusicFinished) {
        Runtime.dynCall('v', SDL.hookMusicFinished);
      }
      return 0;
    }function _Mix_PlayMusic(id, loops) {
      // Pause old music if it exists.
      if (SDL.music.audio) {
        if (!SDL.music.audio.paused) Module.printErr('Music is already playing. ' + SDL.music.source);
        SDL.music.audio.pause();
      }
      var info = SDL.audios[id];
      var audio;
      if (info.webAudio) { // Play via Web Audio API
        // Create an instance of the WebAudio object.
        audio = {};
        audio.resource = info; // This new webAudio object is an instance that refers to this existing resource.
        audio.paused = false;
        audio.currentPosition = 0;
        audio.play = function() { SDL.playWebAudio(this); }
        audio.pause = function() { SDL.pauseWebAudio(this); }
      } else if (info.audio) { // Play via the <audio> element
        audio = info.audio;
      }
      audio['onended'] = function() { if (SDL.music.audio == this) _Mix_HaltMusic(); } // will send callback
      audio.loop = loops != 0; // TODO: handle N loops for finite N
      audio.volume = SDL.music.volume;
      SDL.music.audio = audio;
      audio.play();
      return 0;
    }function _Mix_FreeChunk(id) {
      SDL.audios[id] = null;
    }function _Mix_LoadWAV_RW(rwopsID, freesrc) {
      var rwops = SDL.rwops[rwopsID];
  
      if (rwops === undefined)
        return 0;
  
      var filename = '';
      var audio;
      var webAudio;
      var bytes;
  
      if (rwops.filename !== undefined) {
        filename = PATH.resolve(rwops.filename);
        var raw = Module["preloadedAudios"][filename];
        if (!raw) {
          if (raw === null) Module.printErr('Trying to reuse preloaded audio, but freePreloadedMediaOnUse is set!');
          if (!Module.noAudioDecoding) Runtime.warnOnce('Cannot find preloaded audio ' + filename);
  
          // see if we can read the file-contents from the in-memory FS
          try {
            bytes = FS.readFile(filename);
          } catch (e) {
            Module.printErr('Couldn\'t find file for: ' + filename);
            return 0;
          }
        }
        if (Module['freePreloadedMediaOnUse']) {
          Module["preloadedAudios"][filename] = null;
        }
        audio = raw;
      }
      else if (rwops.bytes !== undefined) {
        // For Web Audio context buffer decoding, we must make a clone of the audio data, but for <media> element,
        // a view to existing data is sufficient.
        if (SDL.webAudioAvailable()) bytes = HEAPU8.buffer.slice(rwops.bytes, rwops.bytes + rwops.count);
        else bytes = HEAPU8.subarray(rwops.bytes, rwops.bytes + rwops.count);
      }
      else {
        return 0;
      }
  
      var arrayBuffer = bytes ? bytes.buffer || bytes : bytes;
  
      // To allow user code to work around browser bugs with audio playback on <audio> elements an Web Audio, enable
      // the user code to hook in a callback to decide on a file basis whether each file should use Web Audio or <audio> for decoding and playback.
      // In particular, see https://bugzilla.mozilla.org/show_bug.cgi?id=654787 and ?id=1012801 for tradeoffs.
      var canPlayWithWebAudio = Module['SDL_canPlayWithWebAudio'] === undefined || Module['SDL_canPlayWithWebAudio'](filename, arrayBuffer);
  
      if (bytes !== undefined && SDL.webAudioAvailable() && canPlayWithWebAudio) {
        audio = undefined;
        webAudio = {};
        // The audio decoding process is asynchronous, which gives trouble if user code plays the audio data back immediately
        // after loading. Therefore prepare an array of callback handlers to run when this audio decoding is complete, which
        // will then start the playback (with some delay).
        webAudio.onDecodeComplete = []; // While this member array exists, decoding hasn't finished yet.
        function onDecodeComplete(data) {
          webAudio.decodedBuffer = data;
          // Call all handlers that were waiting for this decode to finish, and clear the handler list.
          webAudio.onDecodeComplete.forEach(function(e) { e(); });
          webAudio.onDecodeComplete = undefined; // Don't allow more callback handlers since audio has finished decoding.
        }
  
        SDL.audioContext['decodeAudioData'](arrayBuffer, onDecodeComplete);
      } else if (audio === undefined && bytes) {
        // Here, we didn't find a preloaded audio but we either were passed a filepath for
        // which we loaded bytes, or we were passed some bytes
        var blob = new Blob([bytes], {type: rwops.mimetype});
        var url = URL.createObjectURL(blob);
        audio = new Audio();
        audio.src = url;
        audio.mozAudioChannelType = 'content'; // bugzilla 910340
      }
  
      var id = SDL.audios.length;
      // Keep the loaded audio in the audio arrays, ready for playback
      SDL.audios.push({
        source: filename,
        audio: audio, // Points to the <audio> element, if loaded
        webAudio: webAudio // Points to a Web Audio -specific resource object, if loaded
      });
      return id;
    }function _Mix_PlayChannel(channel, id, loops) {
      // TODO: handle fixed amount of N loops. Currently loops either 0 or infinite times.
  
      // Get the audio element associated with the ID
      var info = SDL.audios[id];
      if (!info) return -1;
      if (!info.audio && !info.webAudio) return -1;
  
      // If the user asks us to allocate a channel automatically, get the first
      // free one.
      if (channel == -1) {
        for (var i = SDL.channelMinimumNumber; i < SDL.numChannels; i++) {
          if (!SDL.channels[i].audio) {
            channel = i;
            break;
          }
        }
        if (channel == -1) {
          Module.printErr('All ' + SDL.numChannels + ' channels in use!');
          return -1;
        }
      }
      var channelInfo = SDL.channels[channel];
      var audio;
      if (info.webAudio) {
        // Create an instance of the WebAudio object.
        audio = {};
        audio.resource = info; // This new object is an instance that refers to this existing resource.
        audio.paused = false;
        audio.currentPosition = 0;
        // Make our instance look similar to the instance of a <media> to make api simple.
        audio.play = function() { SDL.playWebAudio(this); }
        audio.pause = function() { SDL.pauseWebAudio(this); }
      } else {
        // We clone the audio node to utilize the preloaded audio buffer, since
        // the browser has already preloaded the audio file.
        audio = info.audio.cloneNode(true);
        audio.numChannels = info.audio.numChannels;
        audio.frequency = info.audio.frequency;
      }
      audio['onended'] = function SDL_audio_onended() { // TODO: cache these
        if (channelInfo.audio == this) { channelInfo.audio.paused = true; channelInfo.audio = null; }
        if (SDL.channelFinished) Runtime.getFuncWrapper(SDL.channelFinished, 'vi')(channel);
      }
      channelInfo.audio = audio;
      // TODO: handle N loops. Behavior matches Mix_PlayMusic
      audio.loop = loops != 0;
      audio.volume = channelInfo.volume;
      audio.play();
      return channel;
    }function _SDL_PauseAudio(pauseOn) {
      if (!SDL.audio) {
        return;
      }
      if (pauseOn) {
        if (SDL.audio.timer !== undefined) {
          clearTimeout(SDL.audio.timer);
          SDL.audio.numAudioTimersPending = 0;
          SDL.audio.timer = undefined;
        }
      } else if (!SDL.audio.timer) {
        // Start the audio playback timer callback loop.
        SDL.audio.numAudioTimersPending = 1;
        SDL.audio.timer = Browser.safeSetTimeout(SDL.audio.caller, 1);
      }
      SDL.audio.paused = pauseOn;
    }function _SDL_CloseAudio() {
      if (SDL.audio) {
        _SDL_PauseAudio(1);
        _free(SDL.audio.buffer);
        SDL.audio = null;
        SDL.allocateChannels(0);
      }
    }function _SDL_LockSurface(surf) {
      var surfData = SDL.surfaces[surf];
  
      surfData.locked++;
      if (surfData.locked > 1) return 0;
  
      if (!surfData.buffer) {
        surfData.buffer = _malloc(surfData.width * surfData.height * 4);
        HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
      }
  
      // Mark in C/C++-accessible SDL structure
      // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
      // So we have fields all of the same size, and 5 of them before us.
      // TODO: Use macros like in library.js
      HEAP32[(((surf)+(20))>>2)]=surfData.buffer;
  
      if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
  
      surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      if (surf == SDL.screen) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock) {
        // Copy pixel data to somewhere accessible to 'C/C++'
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
          // If this is neaded then
          // we should compact the data from 32bpp to 8bpp index.
          // I think best way to implement this is use
          // additional colorMap hash (color->index).
          // Something like this:
          //
          // var size = surfData.width * surfData.height;
          // var data = '';
          // for (var i = 0; i<size; i++) {
          //   var color = SDL.translateRGBAToColor(
          //     surfData.image.data[i*4   ], 
          //     surfData.image.data[i*4 +1], 
          //     surfData.image.data[i*4 +2], 
          //     255);
          //   var index = surfData.colorMap[color];
          //   HEAP8[(((surfData.buffer)+(i))>>0)]=index;
          // }
          throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
        } else {
        HEAPU8.set(surfData.image.data, surfData.buffer);
        }
      }
  
      return 0;
    }
  
  function _SDL_FreeRW(rwopsID) {
      SDL.rwops[rwopsID] = null;
      while (SDL.rwops.length > 0 && SDL.rwops[SDL.rwops.length-1] === null) {
        SDL.rwops.pop();
      }
    }function _IMG_Load_RW(rwopsID, freeSrc) {
      try {
        // stb_image integration support
        function cleanup() {
          if (rwops && freeSrc) _SDL_FreeRW(rwopsID);
        };
        function addCleanup(func) {
          var old = cleanup;
          cleanup = function added_cleanup() {
            old();
            func();
          }
        }
        function callStbImage(func, params) {
          var x = Module['_malloc'](4);
          var y = Module['_malloc'](4);
          var comp = Module['_malloc'](4);
          addCleanup(function() {
            Module['_free'](x);
            Module['_free'](y);
            Module['_free'](comp);
            if (data) Module['_stbi_image_free'](data);
          });
          var data = Module['_' + func].apply(null, params.concat([x, y, comp, 0]));
          if (!data) return null;
          return {
            rawData: true,
            data: data,
            width: HEAP32[((x)>>2)],
            height: HEAP32[((y)>>2)],
            size: HEAP32[((x)>>2)] * HEAP32[((y)>>2)] * HEAP32[((comp)>>2)],
            bpp: HEAP32[((comp)>>2)]
          };
        }
  
        var rwops = SDL.rwops[rwopsID];
        if (rwops === undefined) {
          return 0;
        }
  
        var filename = rwops.filename;
        if (filename === undefined) {
          Runtime.warnOnce('Only file names that have been preloaded are supported for IMG_Load_RW. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js)');
          return 0;
        }
  
        if (!raw) {
          filename = PATH.resolve(filename);
          var raw = Module["preloadedImages"][filename];
          if (!raw) {
            if (raw === null) Module.printErr('Trying to reuse preloaded image, but freePreloadedMediaOnUse is set!');
            Runtime.warnOnce('Cannot find preloaded image ' + filename);
            Runtime.warnOnce('Cannot find preloaded image ' + filename + '. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js)');
            return 0;
          } else if (Module['freePreloadedMediaOnUse']) {
            Module["preloadedImages"][filename] = null;
          }
        }
  
        var surf = SDL.makeSurface(raw.width, raw.height, 0, false, 'load:' + filename);
        var surfData = SDL.surfaces[surf];
        surfData.ctx.globalCompositeOperation = "copy";
        if (!raw.rawData) {
          surfData.ctx.drawImage(raw, 0, 0, raw.width, raw.height, 0, 0, raw.width, raw.height);
        } else {
          var imageData = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
          if (raw.bpp == 4) {
            // rgba
            imageData.data.set(HEAPU8.subarray((raw.data),(raw.data+raw.size)));
          } else if (raw.bpp == 3) {
            // rgb
            var pixels = raw.size/3;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              data[destPtr++] = HEAPU8[((sourcePtr++)>>0)];
              data[destPtr++] = HEAPU8[((sourcePtr++)>>0)];
              data[destPtr++] = HEAPU8[((sourcePtr++)>>0)];
              data[destPtr++] = 255;
            }
          } else if (raw.bpp == 1) {
            // grayscale
            var pixels = raw.size;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              var value = HEAPU8[((sourcePtr++)>>0)];
              data[destPtr++] = value;
              data[destPtr++] = value;
              data[destPtr++] = value;
              data[destPtr++] = 255;
            }
          } else {
            Module.printErr('cannot handle bpp ' + raw.bpp);
            return 0;
          }
          surfData.ctx.putImageData(imageData, 0, 0);
        }
        surfData.ctx.globalCompositeOperation = "source-over";
        // XXX SDL does not specify that loaded images must have available pixel data, in fact
        //     there are cases where you just want to blit them, so you just need the hardware
        //     accelerated version. However, code everywhere seems to assume that the pixels
        //     are in fact available, so we retrieve it here. This does add overhead though.
        _SDL_LockSurface(surf);
        surfData.locked--; // The surface is not actually locked in this hack
        if (SDL.GL) {
          // After getting the pixel data, we can free the canvas and context if we do not need to do 2D canvas blitting
          surfData.canvas = surfData.ctx = null;
        }
        return surf;
      } finally {
        cleanup();
      }
    }
  
  function _SDL_RWFromFile(_name, mode) {
      var id = SDL.rwops.length; // TODO: recycle ids when they are null
      var name = Pointer_stringify(_name)
      SDL.rwops.push({ filename: name, mimetype: Browser.getMimetype(name) });
      return id;
    }function _IMG_Load(filename){
      var rwops = _SDL_RWFromFile(filename);
      var result = _IMG_Load_RW(rwops, 1);
      return result;
    }function _SDL_UpperBlitScaled(src, srcrect, dst, dstrect) {
      return SDL.blitSurface(src, srcrect, dst, dstrect, true);
    }function _SDL_UpperBlit(src, srcrect, dst, dstrect) {
      return SDL.blitSurface(src, srcrect, dst, dstrect, false);
    }function _SDL_GetTicks() {
      return (Date.now() - SDL.startTime)|0;
    }var SDL={defaults:{width:320,height:200,copyOnLock:true},version:null,surfaces:{},canvasPool:[],events:[],fonts:[null],audios:[null],rwops:[null],music:{audio:null,volume:1},mixerFrequency:22050,mixerFormat:32784,mixerNumChannels:2,mixerChunkSize:1024,channelMinimumNumber:0,GL:false,glAttributes:{0:3,1:3,2:2,3:0,4:0,5:1,6:16,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:1,16:0,17:0,18:0},keyboardState:null,keyboardMap:{},canRequestFullscreen:false,isRequestingFullscreen:false,textInput:false,startTime:null,initFlags:0,buttonState:0,modState:0,DOMButtons:[0,0,0],DOMEventToSDLEvent:{},TOUCH_DEFAULT_ID:0,eventHandler:null,eventHandlerContext:null,keyCodes:{16:1249,17:1248,18:1250,20:1081,33:1099,34:1102,35:1101,36:1098,37:1104,38:1106,39:1103,40:1105,44:316,45:1097,46:127,91:1251,93:1125,96:1122,97:1113,98:1114,99:1115,100:1116,101:1117,102:1118,103:1119,104:1120,105:1121,106:1109,107:1111,109:1110,110:1123,111:1108,112:1082,113:1083,114:1084,115:1085,116:1086,117:1087,118:1088,119:1089,120:1090,121:1091,122:1092,123:1093,124:1128,125:1129,126:1130,127:1131,128:1132,129:1133,130:1134,131:1135,132:1136,133:1137,134:1138,135:1139,144:1107,160:94,161:33,162:34,163:35,164:36,165:37,166:38,167:95,168:40,169:41,170:42,171:43,172:124,173:45,174:123,175:125,176:126,181:127,182:129,183:128,188:44,190:46,191:47,192:96,219:91,220:92,221:93,222:39},scanCodes:{8:42,9:43,13:40,27:41,32:44,35:204,39:53,44:54,46:55,47:56,48:39,49:30,50:31,51:32,52:33,53:34,54:35,55:36,56:37,57:38,58:203,59:51,61:46,91:47,92:49,93:48,96:52,97:4,98:5,99:6,100:7,101:8,102:9,103:10,104:11,105:12,106:13,107:14,108:15,109:16,110:17,111:18,112:19,113:20,114:21,115:22,116:23,117:24,118:25,119:26,120:27,121:28,122:29,127:76,305:224,308:226,316:70},loadRect:function (rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },checkPixelFormat:function (fmt) {
        // Canvas screens are always RGBA.
        var format = HEAP32[((fmt)>>2)];
        if (format != -2042224636) {
          Runtime.warnOnce('Unsupported pixel format!');
        }
      },loadColorToCSSRGB:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgb(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ')';
      },loadColorToCSSRGBA:function (color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgba(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ',' + (((rgba >> 24)&255)/255) + ')';
      },translateColorToCSSRGBA:function (rgba) {
        return 'rgba(' + (rgba&0xff) + ',' + (rgba>>8 & 0xff) + ',' + (rgba>>16 & 0xff) + ',' + (rgba>>>24)/0xff + ')';
      },translateRGBAToCSSRGBA:function (r, g, b, a) {
        return 'rgba(' + (r&0xff) + ',' + (g&0xff) + ',' + (b&0xff) + ',' + (a&0xff)/255 + ')';
      },translateRGBAToColor:function (r, g, b, a) {
        return r | g << 8 | b << 16 | a << 24;
      },makeSurface:function (width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        flags = flags || 0;
        var is_SDL_HWSURFACE = flags & 0x00000001;
        var is_SDL_HWPALETTE = flags & 0x00200000;
        var is_SDL_OPENGL = flags & 0x04000000;
  
        var surf = _malloc(60);
        var pixelFormat = _malloc(44);
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        var buffer = 0;
  
        // preemptively initialize this for software surfaces,
        // otherwise it will be lazily initialized inside of SDL_LockSurface
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
          buffer = _malloc(width * height * 4);
        }
  
        HEAP32[((surf)>>2)]=flags;
        HEAP32[(((surf)+(4))>>2)]=pixelFormat;
        HEAP32[(((surf)+(8))>>2)]=width;
        HEAP32[(((surf)+(12))>>2)]=height;
        HEAP32[(((surf)+(16))>>2)]=width * bpp;  // assuming RGBA or indexed for now,
                                                                                          // since that is what ImageData gives us in browsers
        HEAP32[(((surf)+(20))>>2)]=buffer;
  
        HEAP32[(((surf)+(36))>>2)]=0;
        HEAP32[(((surf)+(40))>>2)]=0;
        HEAP32[(((surf)+(44))>>2)]=Module["canvas"].width;
        HEAP32[(((surf)+(48))>>2)]=Module["canvas"].height;
  
        HEAP32[(((surf)+(56))>>2)]=1;
  
        HEAP32[((pixelFormat)>>2)]=-2042224636;
        HEAP32[(((pixelFormat)+(4))>>2)]=0;// TODO
        HEAP8[(((pixelFormat)+(8))>>0)]=bpp * 8;
        HEAP8[(((pixelFormat)+(9))>>0)]=bpp;
  
        HEAP32[(((pixelFormat)+(12))>>2)]=rmask || 0x000000ff;
        HEAP32[(((pixelFormat)+(16))>>2)]=gmask || 0x0000ff00;
        HEAP32[(((pixelFormat)+(20))>>2)]=bmask || 0x00ff0000;
        HEAP32[(((pixelFormat)+(24))>>2)]=amask || 0xff000000;
  
        // Decide if we want to use WebGL or not
        SDL.GL = SDL.GL || is_SDL_OPENGL;
        var canvas;
        if (!usePageCanvas) {
          if (SDL.canvasPool.length > 0) {
            canvas = SDL.canvasPool.pop();
          } else {
            canvas = document.createElement('canvas');
          }
          canvas.width = width;
          canvas.height = height;
        } else {
          canvas = Module['canvas'];
        }
  
        var webGLContextAttributes = {
          antialias: ((SDL.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (SDL.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
          depth: (SDL.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
          stencil: (SDL.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0)
        };
        
        var ctx = Browser.createContext(canvas, is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);
              
        SDL.surfaces[surf] = {
          width: width,
          height: height,
          canvas: canvas,
          ctx: ctx,
          surf: surf,
          buffer: buffer,
          pixelFormat: pixelFormat,
          alpha: 255,
          flags: flags,
          locked: 0,
          usePageCanvas: usePageCanvas,
          source: source,
  
          isFlagSet: function(flag) {
            return flags & flag;
          }
        };
  
        return surf;
      },copyIndexedColorData:function (surfData, rX, rY, rW, rH) {
        // HWPALETTE works with palette
        // setted by SDL_SetColors
        if (!surfData.colors) {
          return;
        }
        
        var fullWidth  = Module['canvas'].width;
        var fullHeight = Module['canvas'].height;
  
        var startX  = rX || 0;
        var startY  = rY || 0;
        var endX    = (rW || (fullWidth - startX)) + startX;
        var endY    = (rH || (fullHeight - startY)) + startY;
        
        var buffer  = surfData.buffer;
        var data    = surfData.image.data;
        var colors  = surfData.colors;
  
        for (var y = startY; y < endY; ++y) {
          var indexBase = y * fullWidth;
          var colorBase = indexBase * 4;
          for (var x = startX; x < endX; ++x) {
            // HWPALETTE have only 256 colors (not rgba)
            var index = HEAPU8[((buffer + indexBase + x)>>0)] * 3;
            var colorOffset = colorBase + x * 4;
  
            data[colorOffset   ] = colors[index   ];
            data[colorOffset +1] = colors[index +1];
            data[colorOffset +2] = colors[index +2];
            //unused: data[colorOffset +3] = color[index +3];
          }
        }
      },freeSurface:function (surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[((refcountPointer)>>2)];
        if (refcount > 1) {
          HEAP32[((refcountPointer)>>2)]=refcount - 1;
          return;
        }
  
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        if (info.buffer) _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
  
        if (surf === SDL.screen) {
          SDL.screen = null;
        }
      },blitSurface__deps:["SDL_LockSurface"],blitSurface:function (src, srcrect, dst, dstrect, scale) {
        var srcData = SDL.surfaces[src];
        var dstData = SDL.surfaces[dst];
        var sr, dr;
        if (srcrect) {
          sr = SDL.loadRect(srcrect);
        } else {
          sr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
        }
        if (dstrect) {
          dr = SDL.loadRect(dstrect);
        } else {
          dr = { x: 0, y: 0, w: -1, h: -1 };
        }
        var oldAlpha = dstData.ctx.globalAlpha;
        dstData.ctx.globalAlpha = srcData.alpha/255;
        var blitw, blitr;
        if (scale) {
          blitw = dr.w; blith = dr.h;
        } else {
          blitw = sr.w; blith = sr.h;
        }
        dstData.ctx.drawImage(srcData.canvas, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, blitw, blith);
        dstData.ctx.globalAlpha = oldAlpha;
        if (dst != SDL.screen) {
          // XXX As in IMG_Load, for compatibility we write out |pixels|
          Runtime.warnOnce('WARNING: copying canvas data to memory for compatibility');
          _SDL_LockSurface(dst);
          dstData.locked--; // The surface is not actually locked in this hack
        }
        return 0;
      },downFingers:{},savedKeydown:null,receiveEvent:function (event) {
        function unpressAllPressedKeys() {
          // Un-press all pressed keys: TODO
          for (var code in SDL.keyboardMap) {
            SDL.events.push({
              type: 'keyup',
              keyCode: SDL.keyboardMap[code]
            });
          }
        };
        switch(event.type) {
          case 'touchstart': case 'touchmove': {
            event.preventDefault();
  
            var touches = [];
            
            // Clear out any touchstart events that we've already processed
            if (event.type === 'touchstart') {
              for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                if (SDL.downFingers[touch.identifier] != true) {
                  SDL.downFingers[touch.identifier] = true;
                  touches.push(touch);
                }
              }
            } else {
              touches = event.touches;
            }
            
            var firstTouch = touches[0];
            if (event.type == 'touchstart') {
              SDL.DOMButtons[0] = 1;
            }
            var mouseEventType;
            switch(event.type) {
              case 'touchstart': mouseEventType = 'mousedown'; break;
              case 'touchmove': mouseEventType = 'mousemove'; break;
            }
            var mouseEvent = {
              type: mouseEventType,
              button: 0,
              pageX: firstTouch.clientX,
              pageY: firstTouch.clientY
            };
            SDL.events.push(mouseEvent);
  
            for (var i = 0; i < touches.length; i++) {
              var touch = touches[i];
              SDL.events.push({
                type: event.type,
                touch: touch
              });
            };
            break;
          }
          case 'touchend': {
            event.preventDefault();
            
            // Remove the entry in the SDL.downFingers hash
            // because the finger is no longer down.
            for(var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              if (SDL.downFingers[touch.identifier] === true) {
                delete SDL.downFingers[touch.identifier];
              }
            }
  
            var mouseEvent = {
              type: 'mouseup',
              button: 0,
              pageX: event.changedTouches[0].clientX,
              pageY: event.changedTouches[0].clientY
            };
            SDL.DOMButtons[0] = 0;
            SDL.events.push(mouseEvent);
            
            for (var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              SDL.events.push({
                type: 'touchend',
                touch: touch
              });
            };
            break;
          }
          case 'DOMMouseScroll': case 'mousewheel': case 'wheel':
            var delta = -Browser.getMouseWheelDelta(event); // Flip the wheel direction to translate from browser wheel direction (+:down) to SDL direction (+:up)
            delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1)); // Quantize to integer so that minimum scroll is at least +/- 1.
  
            // Simulate old-style SDL events representing mouse wheel input as buttons
            var button = delta > 0 ? 3 /*SDL_BUTTON_WHEELUP-1*/ : 4 /*SDL_BUTTON_WHEELDOWN-1*/; // Subtract one since JS->C marshalling is defined to add one back.
            SDL.events.push({ type: 'mousedown', button: button, pageX: event.pageX, pageY: event.pageY });
            SDL.events.push({ type: 'mouseup', button: button, pageX: event.pageX, pageY: event.pageY });
  
            // Pass a delta motion event.
            SDL.events.push({ type: 'wheel', deltaX: 0, deltaY: delta });
            event.preventDefault(); // If we don't prevent this, then 'wheel' event will be sent again by the browser as 'DOMMouseScroll' and we will receive this same event the second time.
            break;
          case 'mousemove':
            if (SDL.DOMButtons[0] === 1) {
              SDL.events.push({
                type: 'touchmove',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            }
            if (Browser.pointerLock) {
              // workaround for firefox bug 750111
              if ('mozMovementX' in event) {
                event['movementX'] = event['mozMovementX'];
                event['movementY'] = event['mozMovementY'];
              }
              // workaround for Firefox bug 782777
              if (event['movementX'] == 0 && event['movementY'] == 0) {
                // ignore a mousemove event if it doesn't contain any movement info
                // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                event.preventDefault();
                return;
              }
            }
            // fall through
          case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup':
            // If we preventDefault on keydown events, the subsequent keypress events
            // won't fire. However, it's fine (and in some cases necessary) to
            // preventDefault for keys that don't generate a character. Otherwise,
            // preventDefault is the right thing to do in general.
            if (event.type !== 'keydown' || (!SDL.unicode && !SDL.textInput) || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
              event.preventDefault();
            }
  
            if (event.type == 'mousedown') {
              SDL.DOMButtons[event.button] = 1;
              SDL.events.push({
                type: 'touchstart',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            } else if (event.type == 'mouseup') {
              // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
              // since we add a mouseup in that case
              if (!SDL.DOMButtons[event.button]) {
                return;
              }
  
              SDL.events.push({
                type: 'touchend',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
              SDL.DOMButtons[event.button] = 0;
            }
  
            // We can only request fullscreen as the result of user input.
            // Due to this limitation, we toggle a boolean on keydown which
            // SDL_WM_ToggleFullScreen will check and subsequently set another
            // flag indicating for us to request fullscreen on the following
            // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
            // to work as the result of a keypress (which is an extremely
            // common use case).
            if (event.type === 'keydown' || event.type === 'mousedown') {
              SDL.canRequestFullscreen = true;
            } else if (event.type === 'keyup' || event.type === 'mouseup') {
              if (SDL.isRequestingFullscreen) {
                Module['requestFullScreen'](true, true);
                SDL.isRequestingFullscreen = false;
              }
              SDL.canRequestFullscreen = false;
            }
  
            // SDL expects a unicode character to be passed to its keydown events.
            // Unfortunately, the browser APIs only provide a charCode property on
            // keypress events, so we must backfill in keydown events with their
            // subsequent keypress event's charCode.
            if (event.type === 'keypress' && SDL.savedKeydown) {
              // charCode is read-only
              SDL.savedKeydown.keypressCharCode = event.charCode;
              SDL.savedKeydown = null;
            } else if (event.type === 'keydown') {
              SDL.savedKeydown = event;
            }
  
            // Don't push keypress events unless SDL_StartTextInput has been called.
            if (event.type !== 'keypress' || SDL.textInput) {
              SDL.events.push(event);
            }
            break;
          case 'mouseout':
            // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
            for (var i = 0; i < 3; i++) {
              if (SDL.DOMButtons[i]) {
                SDL.events.push({
                  type: 'mouseup',
                  button: i,
                  pageX: event.pageX,
                  pageY: event.pageY
                });
                SDL.DOMButtons[i] = 0;
              }
            }
            event.preventDefault();
            break;
          case 'focus':
            SDL.events.push(event);
            event.preventDefault();
            break;
          case 'blur':
            SDL.events.push(event);
            unpressAllPressedKeys();
            event.preventDefault();
            break;
          case 'visibilitychange':
            SDL.events.push({
              type: 'visibilitychange',
              visible: !document.hidden
            });
            unpressAllPressedKeys();
            event.preventDefault();
            break;
          case 'unload':
            if (Browser.mainLoop.runner) {
              SDL.events.push(event);
              // Force-run a main event loop, since otherwise this event will never be caught!
              Browser.mainLoop.runner();
            }
            return;
          case 'resize':
            SDL.events.push(event);
            // manually triggered resize event doesn't have a preventDefault member
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
        }
        if (SDL.events.length >= 10000) {
          Module.printErr('SDL event queue full, dropping events');
          SDL.events = SDL.events.slice(0, 10000);
        }
        // If we have a handler installed, this will push the events to the app
        // instead of the app polling for them.
        SDL.flushEventsToHandler();
        return;
      },lookupKeyCodeForEvent:function (event) {
          var code = event.keyCode;
          if (code >= 65 && code <= 90) {
            code += 32; // make lowercase for SDL
          } else {
            code = SDL.keyCodes[event.keyCode] || event.keyCode;
            // If this is one of the modifier keys (224 | 1<<10 - 227 | 1<<10), and the event specifies that it is
            // a right key, add 4 to get the right key SDL key code.
            if (event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT && code >= (224 | 1<<10) && code <= (227 | 1<<10)) {
              code += 4;
            }
          }
          return code;
      },handleEvent:function (event) {
        if (event.handled) return;
        event.handled = true;
  
        switch (event.type) {
          case 'touchstart': case 'touchend': case 'touchmove': {
            Browser.calculateMouseEvent(event);
            break;
          }
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            var code = SDL.lookupKeyCodeForEvent(event);
            HEAP8[(((SDL.keyboardState)+(code))>>0)]=down;
            // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
            SDL.modState = (HEAP8[(((SDL.keyboardState)+(1248))>>0)] ? 0x0040 : 0) | // KMOD_LCTRL
              (HEAP8[(((SDL.keyboardState)+(1249))>>0)] ? 0x0001 : 0) | // KMOD_LSHIFT
              (HEAP8[(((SDL.keyboardState)+(1250))>>0)] ? 0x0100 : 0) | // KMOD_LALT
              (HEAP8[(((SDL.keyboardState)+(1252))>>0)] ? 0x0080 : 0) | // KMOD_RCTRL
              (HEAP8[(((SDL.keyboardState)+(1253))>>0)] ? 0x0002 : 0) | // KMOD_RSHIFT
              (HEAP8[(((SDL.keyboardState)+(1254))>>0)] ? 0x0200 : 0); //  KMOD_RALT
            if (down) {
              SDL.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
            } else {
              delete SDL.keyboardMap[code];
            }
  
            break;
          }
          case 'mousedown': case 'mouseup':
            if (event.type == 'mousedown') {
              // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
              // and DOM buttons are 0-2, so this means that the below formula is
              // correct.
              SDL.buttonState |= 1 << event.button;
            } else if (event.type == 'mouseup') {
              SDL.buttonState &= ~(1 << event.button);
            }
            // fall through
          case 'mousemove': {
            Browser.calculateMouseEvent(event);
            break;
          }
        }
      },flushEventsToHandler:function () {
        if (!SDL.eventHandler) return;
  
        // All SDLEvents take the same amount of memory
        var sdlEventPtr = allocate(28, "i8", ALLOC_STACK);
  
        while (SDL.pollEvent(sdlEventPtr)) {
          Runtime.dynCall('iii', SDL.eventHandler, [SDL.eventHandlerContext, sdlEventPtr]);
        }
      },pollEvent:function (ptr) {
        if (SDL.initFlags & 0x200 && SDL.joystickEventState) {
          // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
          // to automatically query for events, query for joystick events.
          SDL.queryJoysticks();
        }
        if (ptr) {
          while (SDL.events.length > 0) {
            if (SDL.makeCEvent(SDL.events.shift(), ptr) !== false) return 1;
          }
          return 0;
        } else {
          // XXX: somewhat risky in that we do not check if the event is real or not (makeCEvent returns false) if no pointer supplied
          return SDL.events.length > 0;
        }
      },makeCEvent:function (event, ptr) {
        if (typeof event === 'number') {
          // This is a pointer to a copy of a native C event that was SDL_PushEvent'ed
          _memcpy(ptr, event, 28);
          _free(event); // the copy is no longer needed
          return;
        }
  
        SDL.handleEvent(event);
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            //Module.print('Received key event: ' + event.keyCode);
            var key = SDL.lookupKeyCodeForEvent(event);
            var scan;
            if (key >= 1024) {
              scan = key - 1024;
            } else {
              scan = SDL.scanCodes[key] || key;
            }
  
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(8))>>0)]=down ? 1 : 0;
            HEAP8[(((ptr)+(9))>>0)]=0; // TODO
            HEAP32[(((ptr)+(12))>>2)]=scan;
            HEAP32[(((ptr)+(16))>>2)]=key;
            HEAP16[(((ptr)+(20))>>1)]=SDL.modState;
            // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
            HEAP32[(((ptr)+(24))>>2)]=event.keypressCharCode || key;
  
            break;
          }
          case 'keypress': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            // Not filling in windowID for now
            var cStr = intArrayFromString(String.fromCharCode(event.charCode));
            for (var i = 0; i < cStr.length; ++i) {
              HEAP8[(((ptr)+(8 + i))>>0)]=cStr[i];
            }
            break;
          }
          case 'mousedown': case 'mouseup': case 'mousemove': {
            if (event.type != 'mousemove') {
              var down = event.type === 'mousedown';
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)]=0;
              HEAP32[(((ptr)+(8))>>2)]=0;
              HEAP32[(((ptr)+(12))>>2)]=0;
              HEAP8[(((ptr)+(16))>>0)]=event.button+1; // DOM buttons are 0-2, SDL 1-3
              HEAP8[(((ptr)+(17))>>0)]=down ? 1 : 0;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseY;
            } else {
              HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)]=0;
              HEAP32[(((ptr)+(8))>>2)]=0;
              HEAP32[(((ptr)+(12))>>2)]=0;
              HEAP32[(((ptr)+(16))>>2)]=SDL.buttonState;
              HEAP32[(((ptr)+(20))>>2)]=Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)]=Browser.mouseY;
              HEAP32[(((ptr)+(28))>>2)]=Browser.mouseMovementX;
              HEAP32[(((ptr)+(32))>>2)]=Browser.mouseMovementY;
            }
            break;
          }
          case 'wheel': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(16))>>2)]=event.deltaX;
            HEAP32[(((ptr)+(20))>>2)]=event.deltaY; 
            break;       
          }
          case 'touchstart': case 'touchend': case 'touchmove': {
            var touch = event.touch;
            if (!Browser.touches[touch.identifier]) break;
            var w = Module['canvas'].width;
            var h = Module['canvas'].height;
            var x = Browser.touches[touch.identifier].x / w;
            var y = Browser.touches[touch.identifier].y / h;
            var lx = Browser.lastTouches[touch.identifier].x / w;
            var ly = Browser.lastTouches[touch.identifier].y / h;
            var dx = x - lx;
            var dy = y - ly;
            if (touch['deviceID'] === undefined) touch.deviceID = SDL.TOUCH_DEFAULT_ID;
            if (dx === 0 && dy === 0 && event.type === 'touchmove') return false; // don't send these if nothing happened
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=_SDL_GetTicks();
            (tempI64 = [touch.deviceID>>>0,(tempDouble=touch.deviceID,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((ptr)+(8))>>2)]=tempI64[0],HEAP32[(((ptr)+(12))>>2)]=tempI64[1]);
            (tempI64 = [touch.identifier>>>0,(tempDouble=touch.identifier,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((ptr)+(16))>>2)]=tempI64[0],HEAP32[(((ptr)+(20))>>2)]=tempI64[1]);
            HEAPF32[(((ptr)+(24))>>2)]=x;
            HEAPF32[(((ptr)+(28))>>2)]=y;
            HEAPF32[(((ptr)+(32))>>2)]=dx;
            HEAPF32[(((ptr)+(36))>>2)]=dy;
            if (touch.force !== undefined) {
              HEAPF32[(((ptr)+(40))>>2)]=touch.force;
            } else { // No pressure data, send a digital 0/1 pressure.
              HEAPF32[(((ptr)+(40))>>2)]=event.type == "touchend" ? 0 : 1;
            }
            break;
          }
          case 'unload': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            break;
          }
          case 'resize': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=event.w;
            HEAP32[(((ptr)+(8))>>2)]=event.h;
            break;
          }
          case 'joystick_button_up': case 'joystick_button_down': {
            var state = event.type === 'joystick_button_up' ? 0 : 1;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))>>0)]=event.index;
            HEAP8[(((ptr)+(5))>>0)]=event.button;
            HEAP8[(((ptr)+(6))>>0)]=state;
            break;
          }
          case 'joystick_axis_motion': {
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(((ptr)+(4))>>0)]=event.index;
            HEAP8[(((ptr)+(5))>>0)]=event.axis;
            HEAP32[(((ptr)+(8))>>2)]=SDL.joystickAxisValueConversion(event.value);
            break;
          }
          case 'focus': {
            var SDL_WINDOWEVENT_FOCUS_GAINED = 12 /* SDL_WINDOWEVENT_FOCUS_GAINED */;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=0;
            HEAP8[(((ptr)+(8))>>0)]=SDL_WINDOWEVENT_FOCUS_GAINED;
            break;
          }
          case 'blur': {
            var SDL_WINDOWEVENT_FOCUS_LOST = 13 /* SDL_WINDOWEVENT_FOCUS_LOST */;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=0;
            HEAP8[(((ptr)+(8))>>0)]=SDL_WINDOWEVENT_FOCUS_LOST;
            break;
          }
          case 'visibilitychange': {
            var SDL_WINDOWEVENT_SHOWN  = 1 /* SDL_WINDOWEVENT_SHOWN */;
            var SDL_WINDOWEVENT_HIDDEN = 2 /* SDL_WINDOWEVENT_HIDDEN */;
            var visibilityEventID = event.visible ? SDL_WINDOWEVENT_SHOWN : SDL_WINDOWEVENT_HIDDEN;
            HEAP32[((ptr)>>2)]=SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)]=0;
            HEAP8[(((ptr)+(8))>>0)]=visibilityEventID;
            break;
          }
          default: throw 'Unhandled SDL event: ' + event.type;
        }
      },estimateTextWidth:function (fontData, text) {
        var h = fontData.size;
        var fontString = h + 'px ' + fontData.name;
        var tempCtx = SDL.ttfContext;
        assert(tempCtx, 'TTF_Init must have been called');
        tempCtx.save();
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        tempCtx.restore();
        return ret;
      },allocateChannels:function (num) { // called from Mix_AllocateChannels and init
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
          SDL.channels[i] = {
            audio: null,
            volume: 1.0
          };
        }
      },setGetVolume:function (info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume != -1) {
          info.volume = Math.min(Math.max(volume, 0), 128) / 128;
          if (info.audio) {
            try {
              info.audio.volume = info.volume; // For <audio> element
              if (info.audio.webAudioGainNode) info.audio.webAudioGainNode['gain']['value'] = info.volume; // For WebAudio playback
            } catch(e) {
              Module.printErr('setGetVolume failed to set audio volume: ' + e);
            }
          }
        }
        return ret;
      },playWebAudio:function (audio) {
        if (!audio) return;
        if (audio.webAudioNode) return; // This instance is already playing, don't start again.
        if (!SDL.webAudioAvailable()) return;
        try {
          var webAudio = audio.resource.webAudio;
          audio.paused = false;
          if (!webAudio.decodedBuffer) {
            if (webAudio.onDecodeComplete === undefined) abort("Cannot play back audio object that was not loaded");
            webAudio.onDecodeComplete.push(function() { if (!audio.paused) SDL.playWebAudio(audio); });
            return;
          }
          audio.webAudioNode = SDL.audioContext['createBufferSource']();
          audio.webAudioNode['buffer'] = webAudio.decodedBuffer;
          audio.webAudioNode['loop'] = audio.loop;
          audio.webAudioNode['onended'] = function() { audio.onended(); } // For <media> element compatibility, route the onended signal to the instance.
  
          // Add an intermediate gain node to control volume.
          audio.webAudioGainNode = SDL.audioContext['createGain']();
          audio.webAudioGainNode['gain']['value'] = audio.volume;
          audio.webAudioNode['connect'](audio.webAudioGainNode);
          audio.webAudioGainNode['connect'](SDL.audioContext['destination']);
          audio.webAudioNode['start'](0, audio.currentPosition);
          audio.startTime = SDL.audioContext['currentTime'] - audio.currentPosition;
        } catch(e) {
          Module.printErr('playWebAudio failed: ' + e);
        }
      },pauseWebAudio:function (audio) {
        if (!audio) return;
        if (audio.webAudioNode) {
          try {
            // Remember where we left off, so that if/when we resume, we can restart the playback at a proper place.
            audio.currentPosition = (SDL.audioContext['currentTime'] - audio.startTime) % audio.resource.webAudio.decodedBuffer.duration;
            // Important: When we reach here, the audio playback is stopped by the user. But when calling .stop() below, the Web Audio
            // graph will send the onended signal, but we don't want to process that, since pausing should not clear/destroy the audio
            // channel.
            audio.webAudioNode['onended'] = undefined;
            audio.webAudioNode.stop();
            audio.webAudioNode = undefined;
          } catch(e) {
            Module.printErr('pauseWebAudio failed: ' + e);
          }
        }
        audio.paused = true;
      },openAudioContext:function () {
        // Initialize Web Audio API if we haven't done so yet. Note: Only initialize Web Audio context ever once on the web page,
        // since initializing multiple times fails on Chrome saying 'audio resources have been exhausted'.
        if (!SDL.audioContext) {
          if (typeof(AudioContext) !== 'undefined') SDL.audioContext = new AudioContext();
          else if (typeof(webkitAudioContext) !== 'undefined') SDL.audioContext = new webkitAudioContext();
        }
      },webAudioAvailable:function () { return !!SDL.audioContext; },fillWebAudioBufferFromHeap:function (heapPtr, sizeSamplesPerChannel, dstAudioBuffer) {
        // The input audio data is interleaved across the channels, i.e. [L, R, L, R, L, R, ...] and is either 8-bit or 16-bit as
        // supported by the SDL API. The output audio wave data for Web Audio API must be in planar buffers of [-1,1]-normalized Float32 data,
        // so perform a buffer conversion for the data.
        var numChannels = SDL.audio.channels;
        for(var c = 0; c < numChannels; ++c) {
          var channelData = dstAudioBuffer['getChannelData'](c);
          if (channelData.length != sizeSamplesPerChannel) {
            throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + sizeSamplesPerChannel + ' samples!';
          }
          if (SDL.audio.format == 0x8010 /*AUDIO_S16LSB*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              channelData[j] = (HEAP16[(((heapPtr)+((j*numChannels + c)*2))>>1)]) / 0x8000;
            }
          } else if (SDL.audio.format == 0x0008 /*AUDIO_U8*/) {
            for(var j = 0; j < sizeSamplesPerChannel; ++j) {
              var v = (HEAP8[(((heapPtr)+(j*numChannels + c))>>0)]);
              channelData[j] = ((v >= 0) ? v-128 : v+128) /128;
            }
          }
        }
      },debugSurface:function (surfData) {
        console.log('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
          console.log('   diagonal ' + i + ':' + [data[i*surfData.width*4 + i*4 + 0], data[i*surfData.width*4 + i*4 + 1], data[i*surfData.width*4 + i*4 + 2], data[i*surfData.width*4 + i*4 + 3]]);
        }
      },joystickEventState:1,lastJoystickState:{},joystickNamePool:{},recordJoystickState:function (joystick, state) {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
          buttons[i] = SDL.getJoystickButtonState(state.buttons[i]);
        }
  
        SDL.lastJoystickState[joystick] = {
          buttons: buttons,
          axes: state.axes.slice(0),
          timestamp: state.timestamp,
          index: state.index,
          id: state.id
        };
      },getJoystickButtonState:function (button) {
        if (typeof button === 'object') {
          // Current gamepad API editor's draft (Firefox Nightly)
          // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
          return button.pressed;
        } else {
          // Current gamepad API working draft (Firefox / Chrome Stable)
          // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
          return button > 0;
        }
      },queryJoysticks:function () {
        for (var joystick in SDL.lastJoystickState) {
          var state = SDL.getGamepad(joystick - 1);
          var prevState = SDL.lastJoystickState[joystick];
          // Check only if the timestamp has differed.
          // NOTE: Timestamp is not available in Firefox.
          if (typeof state.timestamp !== 'number' || state.timestamp !== prevState.timestamp) {
            var i;
            for (i = 0; i < state.buttons.length; i++) {
              var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
              // NOTE: The previous state already has a boolean representation of
              //       its button, so no need to standardize its button state here.
              if (buttonState !== prevState.buttons[i]) {
                // Insert button-press event.
                SDL.events.push({
                  type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                  joystick: joystick,
                  index: joystick - 1,
                  button: i
                });
              }
            }
            for (i = 0; i < state.axes.length; i++) {
              if (state.axes[i] !== prevState.axes[i]) {
                // Insert axes-change event.
                SDL.events.push({
                  type: 'joystick_axis_motion',
                  joystick: joystick,
                  index: joystick - 1,
                  axis: i,
                  value: state.axes[i]
                });
              }
            }
  
            SDL.recordJoystickState(joystick, state);
          }
        }
      },joystickAxisValueConversion:function (value) {
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value+1) * 32767.5) - 32768);
      },getGamepads:function () {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
          // The function must be applied on the navigator object.
          return fcn.apply(navigator);
        } else {
          return [];
        }
      },getGamepad:function (deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
          return gamepads[deviceIndex];
        }
        return null;
      }};function _SDL_LoadBMP_RW() {
  return _IMG_Load_RW.apply(null, arguments)
  }

  function _glUniform1i(location, v0) {
      location = GL.uniforms[location];
      GLctx.uniform1i(location, v0);
    }

  var _cosf=Math_cos;

  function _SDL_SetColorKey(surf, flag, key) {
      // SetColorKey assigns one color to be rendered as transparent. I don't
      // think the canvas API allows for anything like this, and iterating through
      // each pixel to replace that color seems prohibitively expensive.
      Runtime.warnOnce('SDL_SetColorKey is a no-op for performance reasons');
      return 0;
    }

  function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
      if (pixels) {
        var data = GL.getTexPixelData(type, format, width, height, pixels, internalFormat);
        pixels = data.pixels;
        internalFormat = data.internalFormat;
      } else {
        pixels = null;
      }
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
    }

  function _glDisable(x0) { GLctx.disable(x0) }


  function ___errno_location() {
      return ___errno_state;
    }

   
  Module["_memset"] = _memset;

  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    }

  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      // Work around a bug in Chromium which causes getShaderInfoLog to return null
      if (!log) log = '(unknown error)';
      log = log.substr(0, maxLength - 1);
      writeStringToMemory(log, infoLog);
      if (length) {
        HEAP32[((length)>>2)]=log.length
      }
    }

  function _abort() {
      Module['abort']();
    }

  function _glGetUniformLocation(program, name) {
      name = Pointer_stringify(name);
  
      var arrayOffset = 0;
      // If user passed an array accessor "[index]", parse the array index off the accessor.
      if (name.indexOf(']', name.length-1) !== -1) {
        var ls = name.lastIndexOf('[');
        var arrayIndex = name.slice(ls+1, -1);
        if (arrayIndex.length > 0) {
          arrayOffset = parseInt(arrayIndex);
          if (arrayOffset < 0) {
            return -1;
          }
        }
        name = name.slice(0, ls);
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        return -1;
      }
      var utable = ptable.uniforms;
      var uniformInfo = utable[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
      if (uniformInfo && arrayOffset < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
        return uniformInfo[1]+arrayOffset;
      } else {
        return -1;
      }
    }


  function _glEnable(x0) { GLctx.enable(x0) }

  function _glUniform4fv(location, count, value) {
      location = GL.uniforms[location];
      var view;
      if (count === 1) {
        // avoid allocation for the common case of uploading one uniform
        view = GL.miniTempBufferViews[3];
        view[0] = HEAPF32[((value)>>2)];
        view[1] = HEAPF32[(((value)+(4))>>2)];
        view[2] = HEAPF32[(((value)+(8))>>2)];
        view[3] = HEAPF32[(((value)+(12))>>2)];
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniform4fv(location, view);
    }

  
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var fd = _fileno(stream);
      var ret = _lseek(fd, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStreamFromPtr(stream);
      stream.eof = false;
      return 0;
    }

  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }

  function _glGenBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = GL.getNewId(GL.buffers);
        var buffer = GLctx.createBuffer();
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[(((buffers)+(i*4))>>2)]=id;
      }
    }

  function _SDL_MapRGB(fmt, r, g, b) {
      SDL.checkPixelFormat(fmt);
      // We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|0xff000000;
    }

  function _glGetAttribLocation(program, name) {
      program = GL.programs[program];
      name = Pointer_stringify(name);
      return GLctx.getAttribLocation(program, name);
    }

  function _rewind(stream) {
      // void rewind(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/rewind.html
      _fseek(stream, 0, 0);  // SEEK_SET.
      var streamObj = FS.getStreamFromPtr(stream);
      if (streamObj) streamObj.error = false;
    }

  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

  var _sin=Math_sin;

  function _glBlendFunc(x0, x1) { GLctx.blendFunc(x0, x1) }

  function _glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function _glViewport(x0, x1, x2, x3) { GLctx.viewport(x0, x1, x2, x3) }

  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg) {
      Module['noExitRuntime'] = true;
  
      assert(!Browser.mainLoop.scheduler, 'there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one, if you want to');
  
      Browser.mainLoop.shouldPause = Browser.mainLoop.paused = false; // if we were cancelled or paused, undo that
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from non-main loop sources
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(function() {
          if (typeof arg !== 'undefined') {
            Runtime.dynCall('vi', func, [arg]);
          } else {
            Runtime.dynCall('v', func);
          }
        });
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        if (Browser.mainLoop.shouldPause) {
          // catch pauses from the main loop itself
          Browser.mainLoop.paused = true;
          Browser.mainLoop.shouldPause = false;
          return;
        }
        Browser.mainLoop.scheduler();
      }
      if (fps && fps > 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, 1000/fps); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      }
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }

  function _glDrawElements(mode, count, type, indices) {
  
      GLctx.drawElements(mode, count, type, indices);
  
    }

  function _glDepthMask(x0) { GLctx.depthMask(x0) }

  var _sinf=Math_sin;

  function _glUniformMatrix4fv(location, count, transpose, value) {
      location = GL.uniforms[location];
      var view;
      if (count === 1) {
        // avoid allocation for the common case of uploading one uniform matrix
        view = GL.miniTempBufferViews[15];
        for (var i = 0; i < 16; i++) {
          view[i] = HEAPF32[(((value)+(i*4))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
      }
      GLctx.uniformMatrix4fv(location, transpose, view);
    }

  var _cos=Math_cos;

  function _glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  var _emscripten_postinvoke=true;

  function _glTexParameteri(x0, x1, x2) { GLctx.texParameteri(x0, x1, x2) }

  function _glGenerateMipmap(x0) { GLctx.generateMipmap(x0) }

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function _glGetShaderiv(shader, pname, p) {
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        // Work around a bug in Chromium which causes getShaderInfoLog to return null
        if (!log) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }
var GLctx; GL.init()
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
___buildEnvironment(ENV);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");


  var Math_min = Math.min;
function nullFunc_viddd(x) { Module["printErr"]("Invalid function pointer called with signature 'viddd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_iiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_viiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_vi(x) { Module["printErr"]("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_vii(x) { Module["printErr"]("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_ii(x) { Module["printErr"]("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_v(x) { Module["printErr"]("Invalid function pointer called with signature 'v'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_viiiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_viiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function invoke_viddd(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viddd"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

  // EMSCRIPTEN_START_ASM
  var asm = (function(global, env, buffer) {
    'almost asm';
    
    var HEAP8 = new global.Int8Array(buffer);
    var HEAP16 = new global.Int16Array(buffer);
    var HEAP32 = new global.Int32Array(buffer);
    var HEAPU8 = new global.Uint8Array(buffer);
    var HEAPU16 = new global.Uint16Array(buffer);
    var HEAPU32 = new global.Uint32Array(buffer);
    var HEAPF32 = new global.Float32Array(buffer);
    var HEAPF64 = new global.Float64Array(buffer);

  
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;

    var __THREW__ = 0;
    var threwValue = 0;
    var setjmpId = 0;
    var undef = 0;
    var nan = +env.NaN, inf = +env.Infinity;
    var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  
    var tempRet0 = 0;
    var tempRet1 = 0;
    var tempRet2 = 0;
    var tempRet3 = 0;
    var tempRet4 = 0;
    var tempRet5 = 0;
    var tempRet6 = 0;
    var tempRet7 = 0;
    var tempRet8 = 0;
    var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var Math_min=env.min;
  var nullFunc_viddd=env.nullFunc_viddd;
  var nullFunc_iiii=env.nullFunc_iiii;
  var nullFunc_viiiii=env.nullFunc_viiiii;
  var nullFunc_vi=env.nullFunc_vi;
  var nullFunc_vii=env.nullFunc_vii;
  var nullFunc_ii=env.nullFunc_ii;
  var nullFunc_v=env.nullFunc_v;
  var nullFunc_viiiiii=env.nullFunc_viiiiii;
  var nullFunc_viiii=env.nullFunc_viiii;
  var invoke_viddd=env.invoke_viddd;
  var invoke_iiii=env.invoke_iiii;
  var invoke_viiiii=env.invoke_viiiii;
  var invoke_vi=env.invoke_vi;
  var invoke_vii=env.invoke_vii;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_viiiiii=env.invoke_viiiiii;
  var invoke_viiii=env.invoke_viiii;
  var _glUseProgram=env._glUseProgram;
  var _fread=env._fread;
  var _glUniformMatrix4fv=env._glUniformMatrix4fv;
  var _SDL_RWFromFile=env._SDL_RWFromFile;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var _glBindBuffer=env._glBindBuffer;
  var _glGetShaderInfoLog=env._glGetShaderInfoLog;
  var _ftell=env._ftell;
  var _sbrk=env._sbrk;
  var _glBlendFunc=env._glBlendFunc;
  var _glGetAttribLocation=env._glGetAttribLocation;
  var _Mix_PlayChannel=env._Mix_PlayChannel;
  var _TTF_RenderText_Solid=env._TTF_RenderText_Solid;
  var _sysconf=env._sysconf;
  var _close=env._close;
  var _Mix_PlayMusic=env._Mix_PlayMusic;
  var _rewind=env._rewind;
  var _cos=env._cos;
  var _fileno=env._fileno;
  var _puts=env._puts;
  var _Mix_LoadWAV_RW=env._Mix_LoadWAV_RW;
  var _glfwInit=env._glfwInit;
  var _write=env._write;
  var _fsync=env._fsync;
  var _glGenBuffers=env._glGenBuffers;
  var _glShaderSource=env._glShaderSource;
  var _Mix_HaltMusic=env._Mix_HaltMusic;
  var _SDL_LoadBMP_RW=env._SDL_LoadBMP_RW;
  var _glGenerateMipmap=env._glGenerateMipmap;
  var _glVertexAttribPointer=env._glVertexAttribPointer;
  var __reallyNegative=env.__reallyNegative;
  var _send=env._send;
  var _SDL_GetTicks=env._SDL_GetTicks;
  var _glfwOpenWindow=env._glfwOpenWindow;
  var ___cxa_find_matching_catch=env.___cxa_find_matching_catch;
  var _glDrawElements=env._glDrawElements;
  var _glDepthMask=env._glDepthMask;
  var _glBufferSubData=env._glBufferSubData;
  var _SDL_LockSurface=env._SDL_LockSurface;
  var _glViewport=env._glViewport;
  var ___setErrNo=env.___setErrNo;
  var ___resumeException=env.___resumeException;
  var _putchar=env._putchar;
  var _glEnable=env._glEnable;
  var _printf=env._printf;
  var _glGenTextures=env._glGenTextures;
  var _glCreateShader=env._glCreateShader;
  var _emscripten_get_now=env._emscripten_get_now;
  var _SDL_MapRGB=env._SDL_MapRGB;
  var _glCreateProgram=env._glCreateProgram;
  var _read=env._read;
  var _fwrite=env._fwrite;
  var _time=env._time;
  var _fprintf=env._fprintf;
  var _SDL_UpperBlitScaled=env._SDL_UpperBlitScaled;
  var _putenv=env._putenv;
  var _IMG_Load=env._IMG_Load;
  var _lseek=env._lseek;
  var _SDL_SetColorKey=env._SDL_SetColorKey;
  var _glClearColor=env._glClearColor;
  var ___cxa_allocate_exception=env.___cxa_allocate_exception;
  var ___buildEnvironment=env.___buildEnvironment;
  var _pwrite=env._pwrite;
  var _open=env._open;
  var _fabsf=env._fabsf;
  var _glBindTexture=env._glBindTexture;
  var _glUniform1f=env._glUniform1f;
  var _glUniform1i=env._glUniform1i;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var _glAttachShader=env._glAttachShader;
  var _fseek=env._fseek;
  var _getenv=env._getenv;
  var _fclose=env._fclose;
  var _sqrtf=env._sqrtf;
  var _glActiveTexture=env._glActiveTexture;
  var _glfwSwapBuffers=env._glfwSwapBuffers;
  var _recv=env._recv;
  var _glCompileShader=env._glCompileShader;
  var _glEnableVertexAttribArray=env._glEnableVertexAttribArray;
  var _abort=env._abort;
  var _glBufferData=env._glBufferData;
  var _glTexImage2D=env._glTexImage2D;
  var _fopen=env._fopen;
  var _sin=env._sin;
  var _cosf=env._cosf;
  var _SDL_CloseAudio=env._SDL_CloseAudio;
  var ___gxx_personality_v0=env.___gxx_personality_v0;
  var _fflush=env._fflush;
  var _SDL_FreeRW=env._SDL_FreeRW;
  var _SDL_PauseAudio=env._SDL_PauseAudio;
  var _glGetUniformLocation=env._glGetUniformLocation;
  var _glClear=env._glClear;
  var _glUniform4fv=env._glUniform4fv;
  var _Mix_FreeChunk=env._Mix_FreeChunk;
  var _sinf=env._sinf;
  var _IMG_Load_RW=env._IMG_Load_RW;
  var _vprintf=env._vprintf;
  var _glGetShaderiv=env._glGetShaderiv;
  var _pread=env._pread;
  var _mkport=env._mkport;
  var _glLinkProgram=env._glLinkProgram;
  var _emscripten_set_main_loop=env._emscripten_set_main_loop;
  var ___errno_location=env.___errno_location;
  var _fputc=env._fputc;
  var ___cxa_throw=env.___cxa_throw;
  var _glDisable=env._glDisable;
  var _glTexParameteri=env._glTexParameteri;
  var __formatString=env.__formatString;
  var _fputs=env._fputs;
  var _SDL_UpperBlit=env._SDL_UpperBlit;
  var _SDL_RWFromConstMem=env._SDL_RWFromConstMem;
  var tempFloat = 0.0;

  // EMSCRIPTEN_START_FUNCS
  function stackAlloc(size) {
    size = size|0;
    var ret = 0;
    ret = STACKTOP;
    STACKTOP = (STACKTOP + size)|0;
  STACKTOP = (STACKTOP + 15)&-16;
if ((STACKTOP|0) >= (STACK_MAX|0)) abort();

    return ret|0;
  }
  function stackSave() {
    return STACKTOP|0;
  }
  function stackRestore(top) {
    top = top|0;
    STACKTOP = top;
  }

  function setThrew(threw, value) {
    threw = threw|0;
    value = value|0;
    if ((__THREW__|0) == 0) {
      __THREW__ = threw;
      threwValue = value;
    }
  }
  function copyTempFloat(ptr) {
    ptr = ptr|0;
    HEAP8[tempDoublePtr>>0] = HEAP8[ptr>>0];
    HEAP8[tempDoublePtr+1>>0] = HEAP8[ptr+1>>0];
    HEAP8[tempDoublePtr+2>>0] = HEAP8[ptr+2>>0];
    HEAP8[tempDoublePtr+3>>0] = HEAP8[ptr+3>>0];
  }
  function copyTempDouble(ptr) {
    ptr = ptr|0;
    HEAP8[tempDoublePtr>>0] = HEAP8[ptr>>0];
    HEAP8[tempDoublePtr+1>>0] = HEAP8[ptr+1>>0];
    HEAP8[tempDoublePtr+2>>0] = HEAP8[ptr+2>>0];
    HEAP8[tempDoublePtr+3>>0] = HEAP8[ptr+3>>0];
    HEAP8[tempDoublePtr+4>>0] = HEAP8[ptr+4>>0];
    HEAP8[tempDoublePtr+5>>0] = HEAP8[ptr+5>>0];
    HEAP8[tempDoublePtr+6>>0] = HEAP8[ptr+6>>0];
    HEAP8[tempDoublePtr+7>>0] = HEAP8[ptr+7>>0];
  }
  function setTempRet0(value) {
    value = value|0;
    tempRet0 = value;
  }
  function getTempRet0() {
    return tempRet0|0;
  }
  
function __Z9web_framev() {
 var $0 = 0.0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $2 = 0, $3 = 0.0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $add = 0.0, $call = 0;
 var $call1 = 0, $call10 = 0, $call14 = 0, $call16 = 0, $call2 = 0.0, $call5 = 0.0, $conv = 0.0, $conv3 = 0.0, $conv7 = 0.0, $ehselector$slot$0 = 0, $exn$slot$0 = 0, $indis = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 80|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $indis = sp;
 $0 = +HEAPF32[24>>2];
 $add = $0 + 0.00300000002607703208923;
 HEAPF32[24>>2] = $add;
 _glClear(16640);
 $call = (__Znwj(16)|0);
 __THREW__ = 0;
 invoke_viddd(16,($call|0),0.0,0.0,0.0);
 $1 = __THREW__; __THREW__ = 0;
 $2 = $1&1;
 if ($2) {
  $12 = ___cxa_find_matching_catch()|0;
  $13 = tempRet0;
  __ZdlPv($call);
  $ehselector$slot$0 = $13;$exn$slot$0 = $12;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 $call1 = (__Znwj(16)|0);
 $3 = +HEAPF32[24>>2];
 $conv = $3;
 $call2 = (+Math_cos((+$conv)));
 $conv3 = $call2;
 $call5 = (+Math_sin((+$conv)));
 $conv7 = $call5;
 __THREW__ = 0;
 invoke_viddd(16,($call1|0),(+$conv3),0.0,(+$conv7));
 $4 = __THREW__; __THREW__ = 0;
 $5 = $4&1;
 if ($5) {
  $14 = ___cxa_find_matching_catch()|0;
  $15 = tempRet0;
  __ZdlPv($call1);
  $ehselector$slot$0 = $15;$exn$slot$0 = $14;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 $call10 = (__Znwj(16)|0);
 __THREW__ = 0;
 invoke_viddd(16,($call10|0),0.0,0.0,0.0);
 $6 = __THREW__; __THREW__ = 0;
 $7 = $6&1;
 if (!($7)) {
  $8 = HEAP32[8>>2]|0;
  (__ZN15REMRenderDevice13setViewLookAtERK9REMVectorS2_S2_($8,$call,$call1,$call10)|0);
  dest=$indis+0|0; src=32+0|0; stop=dest+72|0; do { HEAP16[dest>>1]=HEAP16[src>>1]|0; dest=dest+2|0; src=src+2|0; } while ((dest|0) < (stop|0));
  $9 = HEAP32[8>>2]|0;
  $call14 = (__ZN15REMRenderDevice16getVertexManagerEv($9)|0);
  $10 = HEAP32[16>>2]|0;
  (__ZN21REMVertexCacheManager6renderE14REMVERTEX_TYPEjjjPvPKt($call14,1,0,8,36,$10,$indis)|0);
  $11 = HEAP32[8>>2]|0;
  $call16 = (__ZN15REMRenderDevice16getVertexManagerEv($11)|0);
  (__ZN21REMVertexCacheManager14forcedFlushAllEv($call16)|0);
  _glfwSwapBuffers();
  STACKTOP = sp;return;
 }
 $16 = ___cxa_find_matching_catch()|0;
 $17 = tempRet0;
 __ZdlPv($call10);
 $ehselector$slot$0 = $17;$exn$slot$0 = $16;
 ___resumeException($exn$slot$0|0);
 // unreachable;
}
function _main($argc,$argv) {
 $argc = $argc|0;
 $argv = $argv|0;
 var $$compoundliteral$sroa$1$4$idx54 = 0, $$compoundliteral$sroa$2$8$idx55 = 0, $$compoundliteral$sroa$3$12$idx56 = 0, $$compoundliteral101$sroa$0$0$idx = 0, $$compoundliteral101$sroa$1$2$idx22 = 0, $$compoundliteral106$sroa$0$0$idx = 0, $$compoundliteral106$sroa$1$4$idx19 = 0, $$compoundliteral106$sroa$2$8$idx20 = 0, $$compoundliteral106$sroa$3$12$idx21 = 0, $$compoundliteral113$sroa$0$0$idx = 0, $$compoundliteral113$sroa$1$4$idx16 = 0, $$compoundliteral113$sroa$2$8$idx17 = 0, $$compoundliteral113$sroa$3$12$idx18 = 0, $$compoundliteral120$sroa$0$0$idx = 0, $$compoundliteral120$sroa$1$2$idx15 = 0, $$compoundliteral125$sroa$0$0$idx = 0, $$compoundliteral125$sroa$1$4$idx12 = 0, $$compoundliteral125$sroa$2$8$idx13 = 0, $$compoundliteral125$sroa$3$12$idx14 = 0, $$compoundliteral132$sroa$0$0$idx = 0;
 var $$compoundliteral132$sroa$1$4$idx9 = 0, $$compoundliteral132$sroa$2$8$idx10 = 0, $$compoundliteral132$sroa$3$12$idx11 = 0, $$compoundliteral139$sroa$0$0$idx = 0, $$compoundliteral139$sroa$1$2$idx8 = 0, $$compoundliteral144$sroa$0$0$idx = 0, $$compoundliteral144$sroa$1$4$idx5 = 0, $$compoundliteral144$sroa$2$8$idx6 = 0, $$compoundliteral144$sroa$3$12$idx7 = 0, $$compoundliteral151$sroa$0$0$idx = 0, $$compoundliteral151$sroa$1$4$idx2 = 0, $$compoundliteral151$sroa$2$8$idx3 = 0, $$compoundliteral151$sroa$3$12$idx4 = 0, $$compoundliteral158$sroa$0$0$idx = 0, $$compoundliteral158$sroa$1$2$idx1 = 0, $$compoundliteral19$sroa$0$0$idx = 0, $$compoundliteral19$sroa$1$4$idx51 = 0, $$compoundliteral19$sroa$2$8$idx52 = 0, $$compoundliteral19$sroa$3$12$idx53 = 0, $$compoundliteral25$sroa$0$0$idx = 0;
 var $$compoundliteral25$sroa$1$2$idx50 = 0, $$compoundliteral30$sroa$0$0$idx = 0, $$compoundliteral30$sroa$1$4$idx47 = 0, $$compoundliteral30$sroa$2$8$idx48 = 0, $$compoundliteral30$sroa$3$12$idx49 = 0, $$compoundliteral37$sroa$0$0$idx = 0, $$compoundliteral37$sroa$1$4$idx44 = 0, $$compoundliteral37$sroa$2$8$idx45 = 0, $$compoundliteral37$sroa$3$12$idx46 = 0, $$compoundliteral44$sroa$0$0$idx = 0, $$compoundliteral44$sroa$1$2$idx43 = 0, $$compoundliteral49$sroa$0$0$idx = 0, $$compoundliteral49$sroa$1$4$idx40 = 0, $$compoundliteral49$sroa$2$8$idx41 = 0, $$compoundliteral49$sroa$3$12$idx42 = 0, $$compoundliteral56$sroa$0$0$idx = 0, $$compoundliteral56$sroa$1$4$idx37 = 0, $$compoundliteral56$sroa$2$8$idx38 = 0, $$compoundliteral56$sroa$3$12$idx39 = 0, $$compoundliteral63$sroa$0$0$idx = 0;
 var $$compoundliteral63$sroa$1$2$idx36 = 0, $$compoundliteral68$sroa$0$0$idx = 0, $$compoundliteral68$sroa$1$4$idx33 = 0, $$compoundliteral68$sroa$2$8$idx34 = 0, $$compoundliteral68$sroa$3$12$idx35 = 0, $$compoundliteral75$sroa$0$0$idx = 0, $$compoundliteral75$sroa$1$4$idx30 = 0, $$compoundliteral75$sroa$2$8$idx31 = 0, $$compoundliteral75$sroa$3$12$idx32 = 0, $$compoundliteral82$sroa$0$0$idx = 0, $$compoundliteral82$sroa$1$2$idx29 = 0, $$compoundliteral87$sroa$0$0$idx = 0, $$compoundliteral87$sroa$1$4$idx26 = 0, $$compoundliteral87$sroa$2$8$idx27 = 0, $$compoundliteral87$sroa$3$12$idx28 = 0, $$compoundliteral94$sroa$0$0$idx = 0, $$compoundliteral94$sroa$1$4$idx23 = 0, $$compoundliteral94$sroa$2$8$idx24 = 0, $$compoundliteral94$sroa$3$12$idx25 = 0, $0 = 0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $cAmbient = 0, $cMat = 0, $cNone = 0, $call$i = 0;
 var $call1 = 0, $call11 = 0, $call13 = 0, $call15 = 0, $call2$i = 0, $cmp$i = 0, $cmp3$i = 0, $fA = 0, $fA10 = 0, $fA6 = 0, $fB = 0, $fB5 = 0, $fB9 = 0, $fG = 0, $fG4 = 0, $fG8 = 0, $nSkinID = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $nSkinID = sp + 48|0;
 $cMat = sp + 32|0;
 $cNone = sp + 16|0;
 $cAmbient = sp;
 $call$i = (_glfwInit()|0);
 $cmp$i = ($call$i|0)==(1);
 if (!($cmp$i)) {
  (_puts((152|0))|0);
  STACKTOP = sp;return 0;
 }
 $call2$i = (_glfwOpenWindow(640,360,8,8,8,8,32,0,65537)|0);
 $cmp3$i = ($call2$i|0)==(1);
 if (!($cmp3$i)) {
  (_puts((128|0))|0);
  STACKTOP = sp;return 0;
 }
 _glClearColor(1.0,0.5,0.0,1.0);
 _glEnable(2929);
 _glEnable(3042);
 _glClear(16640);
 $call1 = (__Znwj(1016)|0);
 __THREW__ = 0;
 invoke_vi(17,($call1|0));
 $0 = __THREW__; __THREW__ = 0;
 $1 = $0&1;
 if ($1) {
  $15 = ___cxa_find_matching_catch()|0;
  $16 = tempRet0;
  __ZdlPv($call1);
  ___resumeException($15|0);
  // unreachable;
 }
 HEAP32[8>>2] = $call1;
 (__ZN15REMRenderDevice11oneTimeInitEv($call1)|0);
 HEAPF32[$cMat>>2] = 1.0;
 $fG = (($cMat) + 4|0);
 HEAPF32[$fG>>2] = 1.0;
 $fB = (($cMat) + 8|0);
 HEAPF32[$fB>>2] = 1.0;
 $fA = (($cMat) + 12|0);
 HEAPF32[$fA>>2] = 1.0;
 HEAPF32[$cNone>>2] = 0.0;
 $fG4 = (($cNone) + 4|0);
 HEAPF32[$fG4>>2] = 0.0;
 $fB5 = (($cNone) + 8|0);
 HEAPF32[$fB5>>2] = 0.0;
 $fA6 = (($cNone) + 12|0);
 HEAPF32[$fA6>>2] = 1.0;
 HEAPF32[$cAmbient>>2] = 0.20000000298023223877;
 $fG8 = (($cAmbient) + 4|0);
 HEAPF32[$fG8>>2] = 0.20000000298023223877;
 $fB9 = (($cAmbient) + 8|0);
 HEAPF32[$fB9>>2] = 0.20000000298023223877;
 $fA10 = (($cAmbient) + 12|0);
 HEAPF32[$fA10>>2] = 1.0;
 $2 = HEAP32[8>>2]|0;
 $call11 = (__ZN15REMRenderDevice14getSkinManagerEv($2)|0);
 (__ZN14REMSkinManager7addSkinEPK14REMCOLOUR_TYPES2_S2_S2_fPj($call11,$cAmbient,$cMat,$cNone,$cNone,1.0,$nSkinID)|0);
 $3 = HEAP32[8>>2]|0;
 $call13 = (__ZN15REMRenderDevice14getSkinManagerEv($3)|0);
 $4 = HEAP32[$nSkinID>>2]|0;
 (__ZN14REMSkinManager10addTextureEjPKcbfP14REMCOLOUR_TYPEj($call13,$4,104,1,1.0,0,0)|0);
 $call15 = (_malloc(288)|0);
 HEAP32[16>>2] = $call15;
 HEAPF32[$call15>>2] = -5.0;
 $$compoundliteral$sroa$1$4$idx54 = (($call15) + 4|0);
 HEAPF32[$$compoundliteral$sroa$1$4$idx54>>2] = 5.0;
 $$compoundliteral$sroa$2$8$idx55 = (($call15) + 8|0);
 HEAPF32[$$compoundliteral$sroa$2$8$idx55>>2] = -5.0;
 $$compoundliteral$sroa$3$12$idx56 = (($call15) + 12|0);
 HEAPF32[$$compoundliteral$sroa$3$12$idx56>>2] = 1.0;
 $$compoundliteral19$sroa$0$0$idx = (($call15) + 16|0);
 HEAPF32[$$compoundliteral19$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral19$sroa$1$4$idx51 = (($call15) + 20|0);
 HEAPF32[$$compoundliteral19$sroa$1$4$idx51>>2] = 1.0;
 $$compoundliteral19$sroa$2$8$idx52 = (($call15) + 24|0);
 HEAPF32[$$compoundliteral19$sroa$2$8$idx52>>2] = 1.0;
 $$compoundliteral19$sroa$3$12$idx53 = (($call15) + 28|0);
 HEAPF32[$$compoundliteral19$sroa$3$12$idx53>>2] = 1.0;
 $$compoundliteral25$sroa$0$0$idx = (($call15) + 32|0);
 HEAP16[$$compoundliteral25$sroa$0$0$idx>>1] = 0;
 $$compoundliteral25$sroa$1$2$idx50 = (($call15) + 34|0);
 HEAP16[$$compoundliteral25$sroa$1$2$idx50>>1] = 0;
 $$compoundliteral30$sroa$0$0$idx = (($call15) + 36|0);
 HEAPF32[$$compoundliteral30$sroa$0$0$idx>>2] = 5.0;
 $$compoundliteral30$sroa$1$4$idx47 = (($call15) + 40|0);
 HEAPF32[$$compoundliteral30$sroa$1$4$idx47>>2] = -5.0;
 $$compoundliteral30$sroa$2$8$idx48 = (($call15) + 44|0);
 HEAPF32[$$compoundliteral30$sroa$2$8$idx48>>2] = -5.0;
 $$compoundliteral30$sroa$3$12$idx49 = (($call15) + 48|0);
 HEAPF32[$$compoundliteral30$sroa$3$12$idx49>>2] = 1.0;
 $$compoundliteral37$sroa$0$0$idx = (($call15) + 52|0);
 HEAPF32[$$compoundliteral37$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral37$sroa$1$4$idx44 = (($call15) + 56|0);
 HEAPF32[$$compoundliteral37$sroa$1$4$idx44>>2] = 1.0;
 $$compoundliteral37$sroa$2$8$idx45 = (($call15) + 60|0);
 HEAPF32[$$compoundliteral37$sroa$2$8$idx45>>2] = 1.0;
 $$compoundliteral37$sroa$3$12$idx46 = (($call15) + 64|0);
 HEAPF32[$$compoundliteral37$sroa$3$12$idx46>>2] = 1.0;
 $$compoundliteral44$sroa$0$0$idx = (($call15) + 68|0);
 HEAP16[$$compoundliteral44$sroa$0$0$idx>>1] = -1;
 $$compoundliteral44$sroa$1$2$idx43 = (($call15) + 70|0);
 HEAP16[$$compoundliteral44$sroa$1$2$idx43>>1] = -1;
 $$compoundliteral49$sroa$0$0$idx = (($call15) + 72|0);
 HEAPF32[$$compoundliteral49$sroa$0$0$idx>>2] = -5.0;
 $$compoundliteral49$sroa$1$4$idx40 = (($call15) + 76|0);
 HEAPF32[$$compoundliteral49$sroa$1$4$idx40>>2] = -5.0;
 $$compoundliteral49$sroa$2$8$idx41 = (($call15) + 80|0);
 HEAPF32[$$compoundliteral49$sroa$2$8$idx41>>2] = -5.0;
 $$compoundliteral49$sroa$3$12$idx42 = (($call15) + 84|0);
 HEAPF32[$$compoundliteral49$sroa$3$12$idx42>>2] = 1.0;
 $$compoundliteral56$sroa$0$0$idx = (($call15) + 88|0);
 HEAPF32[$$compoundliteral56$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral56$sroa$1$4$idx37 = (($call15) + 92|0);
 HEAPF32[$$compoundliteral56$sroa$1$4$idx37>>2] = 1.0;
 $$compoundliteral56$sroa$2$8$idx38 = (($call15) + 96|0);
 HEAPF32[$$compoundliteral56$sroa$2$8$idx38>>2] = 1.0;
 $$compoundliteral56$sroa$3$12$idx39 = (($call15) + 100|0);
 HEAPF32[$$compoundliteral56$sroa$3$12$idx39>>2] = 1.0;
 $$compoundliteral63$sroa$0$0$idx = (($call15) + 104|0);
 HEAP16[$$compoundliteral63$sroa$0$0$idx>>1] = 0;
 $$compoundliteral63$sroa$1$2$idx36 = (($call15) + 106|0);
 HEAP16[$$compoundliteral63$sroa$1$2$idx36>>1] = -1;
 $$compoundliteral68$sroa$0$0$idx = (($call15) + 108|0);
 HEAPF32[$$compoundliteral68$sroa$0$0$idx>>2] = 5.0;
 $$compoundliteral68$sroa$1$4$idx33 = (($call15) + 112|0);
 HEAPF32[$$compoundliteral68$sroa$1$4$idx33>>2] = 5.0;
 $$compoundliteral68$sroa$2$8$idx34 = (($call15) + 116|0);
 HEAPF32[$$compoundliteral68$sroa$2$8$idx34>>2] = -5.0;
 $$compoundliteral68$sroa$3$12$idx35 = (($call15) + 120|0);
 HEAPF32[$$compoundliteral68$sroa$3$12$idx35>>2] = 1.0;
 $$compoundliteral75$sroa$0$0$idx = (($call15) + 124|0);
 HEAPF32[$$compoundliteral75$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral75$sroa$1$4$idx30 = (($call15) + 128|0);
 HEAPF32[$$compoundliteral75$sroa$1$4$idx30>>2] = 1.0;
 $$compoundliteral75$sroa$2$8$idx31 = (($call15) + 132|0);
 HEAPF32[$$compoundliteral75$sroa$2$8$idx31>>2] = 1.0;
 $$compoundliteral75$sroa$3$12$idx32 = (($call15) + 136|0);
 HEAPF32[$$compoundliteral75$sroa$3$12$idx32>>2] = 1.0;
 $$compoundliteral82$sroa$0$0$idx = (($call15) + 140|0);
 HEAP16[$$compoundliteral82$sroa$0$0$idx>>1] = -1;
 $$compoundliteral82$sroa$1$2$idx29 = (($call15) + 142|0);
 HEAP16[$$compoundliteral82$sroa$1$2$idx29>>1] = 0;
 $$compoundliteral87$sroa$0$0$idx = (($call15) + 144|0);
 HEAPF32[$$compoundliteral87$sroa$0$0$idx>>2] = -5.0;
 $$compoundliteral87$sroa$1$4$idx26 = (($call15) + 148|0);
 HEAPF32[$$compoundliteral87$sroa$1$4$idx26>>2] = 5.0;
 $$compoundliteral87$sroa$2$8$idx27 = (($call15) + 152|0);
 HEAPF32[$$compoundliteral87$sroa$2$8$idx27>>2] = 5.0;
 $$compoundliteral87$sroa$3$12$idx28 = (($call15) + 156|0);
 HEAPF32[$$compoundliteral87$sroa$3$12$idx28>>2] = 1.0;
 $$compoundliteral94$sroa$0$0$idx = (($call15) + 160|0);
 HEAPF32[$$compoundliteral94$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral94$sroa$1$4$idx23 = (($call15) + 164|0);
 HEAPF32[$$compoundliteral94$sroa$1$4$idx23>>2] = 1.0;
 $$compoundliteral94$sroa$2$8$idx24 = (($call15) + 168|0);
 HEAPF32[$$compoundliteral94$sroa$2$8$idx24>>2] = 1.0;
 $$compoundliteral94$sroa$3$12$idx25 = (($call15) + 172|0);
 HEAPF32[$$compoundliteral94$sroa$3$12$idx25>>2] = 1.0;
 $5 = HEAP32[16>>2]|0;
 $$compoundliteral101$sroa$0$0$idx = (($5) + 176|0);
 HEAP16[$$compoundliteral101$sroa$0$0$idx>>1] = -1;
 $$compoundliteral101$sroa$1$2$idx22 = (($5) + 178|0);
 HEAP16[$$compoundliteral101$sroa$1$2$idx22>>1] = 0;
 $6 = HEAP32[16>>2]|0;
 $$compoundliteral106$sroa$0$0$idx = (($6) + 180|0);
 HEAPF32[$$compoundliteral106$sroa$0$0$idx>>2] = 5.0;
 $$compoundliteral106$sroa$1$4$idx19 = (($6) + 184|0);
 HEAPF32[$$compoundliteral106$sroa$1$4$idx19>>2] = -5.0;
 $$compoundliteral106$sroa$2$8$idx20 = (($6) + 188|0);
 HEAPF32[$$compoundliteral106$sroa$2$8$idx20>>2] = 5.0;
 $$compoundliteral106$sroa$3$12$idx21 = (($6) + 192|0);
 HEAPF32[$$compoundliteral106$sroa$3$12$idx21>>2] = 1.0;
 $7 = HEAP32[16>>2]|0;
 $$compoundliteral113$sroa$0$0$idx = (($7) + 196|0);
 HEAPF32[$$compoundliteral113$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral113$sroa$1$4$idx16 = (($7) + 200|0);
 HEAPF32[$$compoundliteral113$sroa$1$4$idx16>>2] = 1.0;
 $$compoundliteral113$sroa$2$8$idx17 = (($7) + 204|0);
 HEAPF32[$$compoundliteral113$sroa$2$8$idx17>>2] = 1.0;
 $$compoundliteral113$sroa$3$12$idx18 = (($7) + 208|0);
 HEAPF32[$$compoundliteral113$sroa$3$12$idx18>>2] = 1.0;
 $8 = HEAP32[16>>2]|0;
 $$compoundliteral120$sroa$0$0$idx = (($8) + 212|0);
 HEAP16[$$compoundliteral120$sroa$0$0$idx>>1] = 0;
 $$compoundliteral120$sroa$1$2$idx15 = (($8) + 214|0);
 HEAP16[$$compoundliteral120$sroa$1$2$idx15>>1] = -1;
 $9 = HEAP32[16>>2]|0;
 $$compoundliteral125$sroa$0$0$idx = (($9) + 216|0);
 HEAPF32[$$compoundliteral125$sroa$0$0$idx>>2] = -5.0;
 $$compoundliteral125$sroa$1$4$idx12 = (($9) + 220|0);
 HEAPF32[$$compoundliteral125$sroa$1$4$idx12>>2] = -5.0;
 $$compoundliteral125$sroa$2$8$idx13 = (($9) + 224|0);
 HEAPF32[$$compoundliteral125$sroa$2$8$idx13>>2] = 5.0;
 $$compoundliteral125$sroa$3$12$idx14 = (($9) + 228|0);
 HEAPF32[$$compoundliteral125$sroa$3$12$idx14>>2] = 1.0;
 $10 = HEAP32[16>>2]|0;
 $$compoundliteral132$sroa$0$0$idx = (($10) + 232|0);
 HEAPF32[$$compoundliteral132$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral132$sroa$1$4$idx9 = (($10) + 236|0);
 HEAPF32[$$compoundliteral132$sroa$1$4$idx9>>2] = 1.0;
 $$compoundliteral132$sroa$2$8$idx10 = (($10) + 240|0);
 HEAPF32[$$compoundliteral132$sroa$2$8$idx10>>2] = 1.0;
 $$compoundliteral132$sroa$3$12$idx11 = (($10) + 244|0);
 HEAPF32[$$compoundliteral132$sroa$3$12$idx11>>2] = 1.0;
 $11 = HEAP32[16>>2]|0;
 $$compoundliteral139$sroa$0$0$idx = (($11) + 248|0);
 HEAP16[$$compoundliteral139$sroa$0$0$idx>>1] = -1;
 $$compoundliteral139$sroa$1$2$idx8 = (($11) + 250|0);
 HEAP16[$$compoundliteral139$sroa$1$2$idx8>>1] = -1;
 $12 = HEAP32[16>>2]|0;
 $$compoundliteral144$sroa$0$0$idx = (($12) + 252|0);
 HEAPF32[$$compoundliteral144$sroa$0$0$idx>>2] = 5.0;
 $$compoundliteral144$sroa$1$4$idx5 = (($12) + 256|0);
 HEAPF32[$$compoundliteral144$sroa$1$4$idx5>>2] = 5.0;
 $$compoundliteral144$sroa$2$8$idx6 = (($12) + 260|0);
 HEAPF32[$$compoundliteral144$sroa$2$8$idx6>>2] = 5.0;
 $$compoundliteral144$sroa$3$12$idx7 = (($12) + 264|0);
 HEAPF32[$$compoundliteral144$sroa$3$12$idx7>>2] = 1.0;
 $13 = HEAP32[16>>2]|0;
 $$compoundliteral151$sroa$0$0$idx = (($13) + 268|0);
 HEAPF32[$$compoundliteral151$sroa$0$0$idx>>2] = 1.0;
 $$compoundliteral151$sroa$1$4$idx2 = (($13) + 272|0);
 HEAPF32[$$compoundliteral151$sroa$1$4$idx2>>2] = 1.0;
 $$compoundliteral151$sroa$2$8$idx3 = (($13) + 276|0);
 HEAPF32[$$compoundliteral151$sroa$2$8$idx3>>2] = 1.0;
 $$compoundliteral151$sroa$3$12$idx4 = (($13) + 280|0);
 HEAPF32[$$compoundliteral151$sroa$3$12$idx4>>2] = 1.0;
 $14 = HEAP32[16>>2]|0;
 $$compoundliteral158$sroa$0$0$idx = (($14) + 284|0);
 HEAP16[$$compoundliteral158$sroa$0$0$idx>>1] = 0;
 $$compoundliteral158$sroa$1$2$idx1 = (($14) + 286|0);
 HEAP16[$$compoundliteral158$sroa$1$2$idx1>>1] = 0;
 _glfwSwapBuffers();
 _emscripten_set_main_loop((18|0),0,1);
 STACKTOP = sp;return 0;
}
function __ZN9REMVectorC2Ev($this) {
 $this = $this|0;
 var $w = 0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = 0.0;
 $y = (($this) + 4|0);
 HEAPF32[$y>>2] = 0.0;
 $z = (($this) + 8|0);
 HEAPF32[$z>>2] = 0.0;
 $w = (($this) + 12|0);
 HEAPF32[$w>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVectorC2Efff($this,$_x,$_y,$_z) {
 $this = $this|0;
 $_x = +$_x;
 $_y = +$_y;
 $_z = +$_z;
 var $w = 0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = $_x;
 $y = (($this) + 4|0);
 HEAPF32[$y>>2] = $_y;
 $z = (($this) + 8|0);
 HEAPF32[$z>>2] = $_z;
 $w = (($this) + 12|0);
 HEAPF32[$w>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVector3setEffff($this,$_x,$_y,$_z,$_w) {
 $this = $this|0;
 $_x = +$_x;
 $_y = +$_y;
 $_z = +$_z;
 $_w = +$_w;
 var $w = 0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = $_x;
 $y = (($this) + 4|0);
 HEAPF32[$y>>2] = $_y;
 $z = (($this) + 8|0);
 HEAPF32[$z>>2] = $_z;
 $w = (($this) + 12|0);
 HEAPF32[$w>>2] = $_w;
 STACKTOP = sp;return;
}
function __ZN9REMVector9getLengthEv($this) {
 $this = $this|0;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $add = 0.0, $add7 = 0.0, $conv8 = 0.0, $mul = 0.0, $mul4 = 0.0, $mul6 = 0.0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $mul = $0 * $0;
 $y = (($this) + 4|0);
 $1 = +HEAPF32[$y>>2];
 $mul4 = $1 * $1;
 $add = $mul + $mul4;
 $z = (($this) + 8|0);
 $2 = +HEAPF32[$z>>2];
 $mul6 = $2 * $2;
 $add7 = $add + $mul6;
 $conv8 = (+Math_sqrt((+$add7)));
 STACKTOP = sp;return (+$conv8);
}
function __ZN9REMVector9normaliseEv($this) {
 $this = $this|0;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $add = 0.0, $add7 = 0.0, $cmp = 0, $conv8 = 0.0, $div = 0.0, $div11 = 0.0, $div13 = 0.0, $mul = 0.0, $mul4 = 0.0, $mul6 = 0.0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $mul = $0 * $0;
 $y = (($this) + 4|0);
 $1 = +HEAPF32[$y>>2];
 $mul4 = $1 * $1;
 $add = $mul + $mul4;
 $z = (($this) + 8|0);
 $2 = +HEAPF32[$z>>2];
 $mul6 = $2 * $2;
 $add7 = $add + $mul6;
 $conv8 = (+Math_sqrt((+$add7)));
 $cmp = $conv8 != 0.0;
 if (!($cmp)) {
  STACKTOP = sp;return;
 }
 $div = $0 / $conv8;
 HEAPF32[$this>>2] = $div;
 $div11 = $1 / $conv8;
 HEAPF32[$y>>2] = $div11;
 $div13 = $2 / $conv8;
 HEAPF32[$z>>2] = $div13;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormlERKS_($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $add = 0.0, $add7 = 0.0, $mul = 0.0, $mul4 = 0.0, $mul6 = 0.0, $y = 0, $y3 = 0, $z = 0, $z5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = +HEAPF32[$v>>2];
 $mul = $0 * $1;
 $y = (($this) + 4|0);
 $2 = +HEAPF32[$y>>2];
 $y3 = (($v) + 4|0);
 $3 = +HEAPF32[$y3>>2];
 $mul4 = $2 * $3;
 $add = $mul + $mul4;
 $z = (($this) + 8|0);
 $4 = +HEAPF32[$z>>2];
 $z5 = (($v) + 8|0);
 $5 = +HEAPF32[$z5>>2];
 $mul6 = $4 * $5;
 $add7 = $add + $mul6;
 STACKTOP = sp;return (+$add7);
}
function __ZN9REMVectordVEf($this,$f) {
 $this = $this|0;
 $f = +$f;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $div = 0.0, $div2 = 0.0, $div3 = 0.0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $div = $0 / $f;
 HEAPF32[$this>>2] = $div;
 $y = (($this) + 4|0);
 $1 = +HEAPF32[$y>>2];
 $div2 = $1 / $f;
 HEAPF32[$y>>2] = $div2;
 $z = (($this) + 8|0);
 $2 = +HEAPF32[$z>>2];
 $div3 = $2 / $f;
 HEAPF32[$z>>2] = $div3;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormlEf($agg$result,$this,$f) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $f = +$f;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $mul = 0.0, $mul2 = 0.0, $mul3 = 0.0, $w$i = 0, $y = 0, $y$i = 0, $z = 0, $z$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $mul = $0 * $f;
 $y = (($this) + 4|0);
 $1 = +HEAPF32[$y>>2];
 $mul2 = $1 * $f;
 $z = (($this) + 8|0);
 $2 = +HEAPF32[$z>>2];
 $mul3 = $2 * $f;
 HEAPF32[$agg$result>>2] = $mul;
 $y$i = (($agg$result) + 4|0);
 HEAPF32[$y$i>>2] = $mul2;
 $z$i = (($agg$result) + 8|0);
 HEAPF32[$z$i>>2] = $mul3;
 $w$i = (($agg$result) + 12|0);
 HEAPF32[$w$i>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormiERKS_($agg$result,$this,$v) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $v = $v|0;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $sub = 0.0, $sub4 = 0.0, $sub6 = 0.0, $w$i = 0, $y = 0, $y$i = 0, $y3 = 0, $z = 0, $z$i = 0, $z5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = +HEAPF32[$v>>2];
 $sub = $0 - $1;
 $y = (($this) + 4|0);
 $2 = +HEAPF32[$y>>2];
 $y3 = (($v) + 4|0);
 $3 = +HEAPF32[$y3>>2];
 $sub4 = $2 - $3;
 $z = (($this) + 8|0);
 $4 = +HEAPF32[$z>>2];
 $z5 = (($v) + 8|0);
 $5 = +HEAPF32[$z5>>2];
 $sub6 = $4 - $5;
 HEAPF32[$agg$result>>2] = $sub;
 $y$i = (($agg$result) + 4|0);
 HEAPF32[$y$i>>2] = $sub4;
 $z$i = (($agg$result) + 8|0);
 HEAPF32[$z$i>>2] = $sub6;
 $w$i = (($agg$result) + 12|0);
 HEAPF32[$w$i>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVector5crossERKS_S1_($this,$u,$v) {
 $this = $this|0;
 $u = $u|0;
 $v = $v|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0.0, $11 = 0.0, $2 = 0.0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $6 = 0.0, $7 = 0.0, $8 = 0.0, $9 = 0.0, $mul = 0.0, $mul10 = 0.0, $mul15 = 0.0, $mul18 = 0.0, $mul4 = 0.0, $mul7 = 0.0, $sub = 0.0, $sub11 = 0.0;
 var $sub19 = 0.0, $w = 0, $y = 0, $y12 = 0, $y3 = 0, $z = 0, $z2 = 0, $z20 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $y = (($u) + 4|0);
 $0 = +HEAPF32[$y>>2];
 $z = (($v) + 8|0);
 $1 = +HEAPF32[$z>>2];
 $mul = $0 * $1;
 $z2 = (($u) + 8|0);
 $2 = +HEAPF32[$z2>>2];
 $y3 = (($v) + 4|0);
 $3 = +HEAPF32[$y3>>2];
 $mul4 = $2 * $3;
 $sub = $mul - $mul4;
 HEAPF32[$this>>2] = $sub;
 $4 = +HEAPF32[$z2>>2];
 $5 = +HEAPF32[$v>>2];
 $mul7 = $4 * $5;
 $6 = +HEAPF32[$u>>2];
 $7 = +HEAPF32[$z>>2];
 $mul10 = $6 * $7;
 $sub11 = $mul7 - $mul10;
 $y12 = (($this) + 4|0);
 HEAPF32[$y12>>2] = $sub11;
 $8 = +HEAPF32[$u>>2];
 $9 = +HEAPF32[$y3>>2];
 $mul15 = $8 * $9;
 $10 = +HEAPF32[$y>>2];
 $11 = +HEAPF32[$v>>2];
 $mul18 = $10 * $11;
 $sub19 = $mul15 - $mul18;
 $z20 = (($this) + 8|0);
 HEAPF32[$z20>>2] = $sub19;
 $w = (($this) + 12|0);
 HEAPF32[$w>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMMatrixC2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZN9REMMatrix8identityEv($this) {
 $this = $this|0;
 var $_22 = 0, $_33 = 0, $_44 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 dest=$this+0|0; stop=dest+60|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $_44 = (($this) + 60|0);
 HEAPF32[$_44>>2] = 1.0;
 $_33 = (($this) + 40|0);
 HEAPF32[$_33>>2] = 1.0;
 $_22 = (($this) + 20|0);
 HEAPF32[$_22>>2] = 1.0;
 HEAPF32[$this>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZNK9REMMatrixmlERKS_($agg$result,$this,$m) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $m = $m|0;
 var $$pre = 0.0, $$pre33 = 0.0, $$pre34 = 0.0, $$pre35 = 0.0, $$pre36 = 0.0, $$pre37 = 0.0, $$pre38 = 0.0, $$pre39 = 0.0, $$pre40 = 0.0, $$pre41 = 0.0, $$pre42 = 0.0, $$pre43 = 0.0, $$pre44 = 0.0, $$pre45 = 0.0, $$pre46 = 0.0, $$pre47 = 0.0, $0 = 0.0, $1 = 0.0, $2 = 0.0, $3 = 0.0;
 var $4 = 0.0, $5 = 0.0, $6 = 0.0, $7 = 0.0, $add$148 = 0, $add$249 = 0, $add$350 = 0, $add1128 = 0, $add19 = 0.0, $add19$1 = 0.0, $add19$2 = 0.0, $add19$3 = 0.0, $add2129 = 0, $add29 = 0.0, $add29$1 = 0.0, $add29$2 = 0.0, $add29$3 = 0.0, $add3130 = 0, $add39 = 0.0, $add39$1 = 0.0;
 var $add39$2 = 0.0, $add39$3 = 0.0, $add9 = 0.0, $add9$1 = 0.0, $add9$2 = 0.0, $add9$3 = 0.0, $arrayidx = 0, $arrayidx12 = 0, $arrayidx14$1$phi$trans$insert = 0, $arrayidx14$2$phi$trans$insert = 0, $arrayidx14$3$phi$trans$insert = 0, $arrayidx14$phi$trans$insert = 0, $arrayidx22 = 0, $arrayidx24$1$phi$trans$insert = 0, $arrayidx24$2$phi$trans$insert = 0, $arrayidx24$3$phi$trans$insert = 0, $arrayidx24$phi$trans$insert = 0, $arrayidx32 = 0, $arrayidx34$1$phi$trans$insert = 0, $arrayidx34$2$phi$trans$insert = 0;
 var $arrayidx34$3$phi$trans$insert = 0, $arrayidx34$phi$trans$insert = 0, $arrayidx5$1$phi$trans$insert = 0, $arrayidx5$2$phi$trans$insert = 0, $arrayidx5$3$phi$trans$insert = 0, $arrayidx8 = 0, $arrayidx8$1 = 0, $arrayidx8$2 = 0, $arrayidx8$3 = 0, $exitcond = 0, $i$032 = 0, $inc41 = 0, $mul = 0, $mul15 = 0.0, $mul15$1 = 0.0, $mul15$2 = 0.0, $mul15$3 = 0.0, $mul25 = 0.0, $mul25$1 = 0.0, $mul25$2 = 0.0;
 var $mul25$3 = 0.0, $mul35 = 0.0, $mul35$1 = 0.0, $mul35$2 = 0.0, $mul35$3 = 0.0, $mul6 = 0.0, $mul6$1 = 0.0, $mul6$2 = 0.0, $mul6$3 = 0.0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 dest=$agg$result+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $$pre = +HEAPF32[$m>>2];
 $arrayidx14$phi$trans$insert = (($m) + 16|0);
 $$pre33 = +HEAPF32[$arrayidx14$phi$trans$insert>>2];
 $arrayidx24$phi$trans$insert = (($m) + 32|0);
 $$pre34 = +HEAPF32[$arrayidx24$phi$trans$insert>>2];
 $arrayidx34$phi$trans$insert = (($m) + 48|0);
 $$pre35 = +HEAPF32[$arrayidx34$phi$trans$insert>>2];
 $arrayidx5$1$phi$trans$insert = (($m) + 4|0);
 $$pre36 = +HEAPF32[$arrayidx5$1$phi$trans$insert>>2];
 $arrayidx14$1$phi$trans$insert = (($m) + 20|0);
 $$pre37 = +HEAPF32[$arrayidx14$1$phi$trans$insert>>2];
 $arrayidx24$1$phi$trans$insert = (($m) + 36|0);
 $$pre38 = +HEAPF32[$arrayidx24$1$phi$trans$insert>>2];
 $arrayidx34$1$phi$trans$insert = (($m) + 52|0);
 $$pre39 = +HEAPF32[$arrayidx34$1$phi$trans$insert>>2];
 $arrayidx5$2$phi$trans$insert = (($m) + 8|0);
 $$pre40 = +HEAPF32[$arrayidx5$2$phi$trans$insert>>2];
 $arrayidx14$2$phi$trans$insert = (($m) + 24|0);
 $$pre41 = +HEAPF32[$arrayidx14$2$phi$trans$insert>>2];
 $arrayidx24$2$phi$trans$insert = (($m) + 40|0);
 $$pre42 = +HEAPF32[$arrayidx24$2$phi$trans$insert>>2];
 $arrayidx34$2$phi$trans$insert = (($m) + 56|0);
 $$pre43 = +HEAPF32[$arrayidx34$2$phi$trans$insert>>2];
 $arrayidx5$3$phi$trans$insert = (($m) + 12|0);
 $$pre44 = +HEAPF32[$arrayidx5$3$phi$trans$insert>>2];
 $arrayidx14$3$phi$trans$insert = (($m) + 28|0);
 $$pre45 = +HEAPF32[$arrayidx14$3$phi$trans$insert>>2];
 $arrayidx24$3$phi$trans$insert = (($m) + 44|0);
 $$pre46 = +HEAPF32[$arrayidx24$3$phi$trans$insert>>2];
 $arrayidx34$3$phi$trans$insert = (($m) + 60|0);
 $$pre47 = +HEAPF32[$arrayidx34$3$phi$trans$insert>>2];
 $i$032 = 0;
 while(1) {
  $mul = $i$032 << 2;
  $arrayidx = (($this) + ($mul<<2)|0);
  $0 = +HEAPF32[$arrayidx>>2];
  $add1128 = $mul | 1;
  $arrayidx12 = (($this) + ($add1128<<2)|0);
  $1 = +HEAPF32[$arrayidx12>>2];
  $add2129 = $mul | 2;
  $arrayidx22 = (($this) + ($add2129<<2)|0);
  $2 = +HEAPF32[$arrayidx22>>2];
  $add3130 = $mul | 3;
  $arrayidx32 = (($this) + ($add3130<<2)|0);
  $3 = +HEAPF32[$arrayidx32>>2];
  $mul6 = $0 * $$pre;
  $arrayidx8 = (($agg$result) + ($mul<<2)|0);
  $4 = +HEAPF32[$arrayidx8>>2];
  $add9 = $4 + $mul6;
  $mul15 = $1 * $$pre33;
  $add19 = $add9 + $mul15;
  $mul25 = $2 * $$pre34;
  $add29 = $add19 + $mul25;
  $mul35 = $3 * $$pre35;
  $add39 = $add29 + $mul35;
  HEAPF32[$arrayidx8>>2] = $add39;
  $mul6$1 = $0 * $$pre36;
  $add$148 = $mul | 1;
  $arrayidx8$1 = (($agg$result) + ($add$148<<2)|0);
  $5 = +HEAPF32[$arrayidx8$1>>2];
  $add9$1 = $5 + $mul6$1;
  $mul15$1 = $1 * $$pre37;
  $add19$1 = $add9$1 + $mul15$1;
  $mul25$1 = $2 * $$pre38;
  $add29$1 = $add19$1 + $mul25$1;
  $mul35$1 = $3 * $$pre39;
  $add39$1 = $add29$1 + $mul35$1;
  HEAPF32[$arrayidx8$1>>2] = $add39$1;
  $mul6$2 = $0 * $$pre40;
  $add$249 = $mul | 2;
  $arrayidx8$2 = (($agg$result) + ($add$249<<2)|0);
  $6 = +HEAPF32[$arrayidx8$2>>2];
  $add9$2 = $6 + $mul6$2;
  $mul15$2 = $1 * $$pre41;
  $add19$2 = $add9$2 + $mul15$2;
  $mul25$2 = $2 * $$pre42;
  $add29$2 = $add19$2 + $mul25$2;
  $mul35$2 = $3 * $$pre43;
  $add39$2 = $add29$2 + $mul35$2;
  HEAPF32[$arrayidx8$2>>2] = $add39$2;
  $mul6$3 = $0 * $$pre44;
  $add$350 = $mul | 3;
  $arrayidx8$3 = (($agg$result) + ($add$350<<2)|0);
  $7 = +HEAPF32[$arrayidx8$3>>2];
  $add9$3 = $7 + $mul6$3;
  $mul15$3 = $1 * $$pre45;
  $add19$3 = $add9$3 + $mul15$3;
  $mul25$3 = $2 * $$pre46;
  $add29$3 = $add19$3 + $mul25$3;
  $mul35$3 = $3 * $$pre47;
  $add39$3 = $add29$3 + $mul35$3;
  HEAPF32[$arrayidx8$3>>2] = $add39$3;
  $inc41 = (($i$032) + 1)|0;
  $exitcond = ($inc41|0)==(4);
  if ($exitcond) {
   break;
  } else {
   $i$032 = $inc41;
  }
 }
 STACKTOP = sp;return;
}
function __Z15rawImageFromBMPPKc($chName) {
 $chName = $chName|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $BitsPerPixel = 0, $bmp = 0, $call = 0, $call1 = 0, $call2 = 0, $cmp = 0, $cond = 0, $conv15 = 0, $format = 0, $format8 = 0, $h = 0, $height = 0, $pData = 0, $pixels = 0, $retval$0 = 0;
 var $type = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vararg_ptr4 = 0, $vararg_ptr5 = 0, $vararg_ptr6 = 0, $w = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $call = (__Znwj(24)|0);
 $call1 = (_SDL_RWFromFile(($chName|0),(176|0))|0);
 $call2 = (_SDL_LoadBMP_RW(($call1|0),1)|0);
 $bmp = (($call) + 20|0);
 HEAP32[$bmp>>2] = $call2;
 $cmp = ($call2|0)==(0|0);
 if ($cmp) {
  HEAP32[$vararg_buffer>>2] = $chName;
  (_printf((184|0),($vararg_buffer|0))|0);
  $retval$0 = 0;
  STACKTOP = sp;return ($retval$0|0);
 }
 $w = (($call2) + 8|0);
 $0 = HEAP32[$w>>2]|0;
 HEAP32[$call>>2] = $0;
 $h = (($call2) + 12|0);
 $1 = HEAP32[$h>>2]|0;
 $height = (($call) + 4|0);
 HEAP32[$height>>2] = $1;
 $format = (($call2) + 4|0);
 $2 = HEAP32[$format>>2]|0;
 $BitsPerPixel = (($2) + 8|0);
 $3 = HEAP8[$BitsPerPixel>>0]|0;
 $cond = ($3<<24>>24)==(32);
 if ($cond) {
  $format8 = (($call) + 8|0);
  HEAP32[$format8>>2] = 6408;
  $type = (($call) + 12|0);
  HEAP32[$type>>2] = 5121;
 }
 $pixels = (($call2) + 20|0);
 $4 = HEAP32[$pixels>>2]|0;
 $pData = (($call) + 16|0);
 HEAP32[$pData>>2] = $4;
 $conv15 = $3&255;
 HEAP32[$vararg_buffer1>>2] = $chName;
 $vararg_ptr4 = (($vararg_buffer1) + 4|0);
 HEAP32[$vararg_ptr4>>2] = $0;
 $vararg_ptr5 = (($vararg_buffer1) + 8|0);
 HEAP32[$vararg_ptr5>>2] = $1;
 $vararg_ptr6 = (($vararg_buffer1) + 12|0);
 HEAP32[$vararg_ptr6>>2] = $conv15;
 (_printf((216|0),($vararg_buffer1|0))|0);
 $retval$0 = $call;
 STACKTOP = sp;return ($retval$0|0);
}
function __Z14setAlphaKeyRawP16REMRAWIMAGE_TYPEhhhh($rI,$R,$G,$B,$A) {
 $rI = $rI|0;
 $R = $R|0;
 $G = $G|0;
 $B = $B|0;
 $A = $A|0;
 var $0 = 0, $1 = 0, $2 = 0, $bmp = 0, $call = 0, $call2 = 0, $format = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $bmp = (($rI) + 20|0);
 $0 = HEAP32[$bmp>>2]|0;
 $format = (($0) + 4|0);
 $1 = HEAP32[$format>>2]|0;
 $call = (_SDL_MapRGB(($1|0),($R|0),($G|0),($B|0))|0);
 $2 = HEAP32[$bmp>>2]|0;
 $call2 = (_SDL_SetColorKey(($2|0),1,($call|0))|0);
 STACKTOP = sp;return ($call2|0);
}
function __Z11setAlphaRawP16REMRAWIMAGE_TYPEh($rI,$A) {
 $rI = $rI|0;
 $A = $A|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return 0;
}
function __ZN15REMRenderDeviceC2Ev($this) {
 $this = $this|0;
 var $_bRunning = 0, $_mProj2D = 0, $_mView2D = 0, $_mView3D = 0, $_mViewProj = 0, $_mWorld = 0, $_mWorldViewProj = 0, $array$begin = 0, $array$begin2 = 0, $arrayctor$next = 0, $arrayctor$next$1 = 0, $arrayctor$next$2 = 0, $arrayctor$next6 = 0, $arrayctor$next6$1 = 0, $arrayctor$next6$2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_mView2D = (($this) + 104|0);
 __ZN9REMMatrixC2Ev($_mView2D);
 $_mView3D = (($this) + 168|0);
 __ZN9REMMatrixC2Ev($_mView3D);
 $_mProj2D = (($this) + 232|0);
 __ZN9REMMatrixC2Ev($_mProj2D);
 $array$begin = (($this) + 296|0);
 __ZN9REMMatrixC2Ev($array$begin);
 $arrayctor$next = (($this) + 360|0);
 __ZN9REMMatrixC2Ev($arrayctor$next);
 $arrayctor$next$1 = (($this) + 424|0);
 __ZN9REMMatrixC2Ev($arrayctor$next$1);
 $arrayctor$next$2 = (($this) + 488|0);
 __ZN9REMMatrixC2Ev($arrayctor$next$2);
 $array$begin2 = (($this) + 552|0);
 __ZN9REMMatrixC2Ev($array$begin2);
 $arrayctor$next6 = (($this) + 616|0);
 __ZN9REMMatrixC2Ev($arrayctor$next6);
 $arrayctor$next6$1 = (($this) + 680|0);
 __ZN9REMMatrixC2Ev($arrayctor$next6$1);
 $arrayctor$next6$2 = (($this) + 744|0);
 __ZN9REMMatrixC2Ev($arrayctor$next6$2);
 $_mWorld = (($this) + 808|0);
 __ZN9REMMatrixC2Ev($_mWorld);
 $_mViewProj = (($this) + 872|0);
 __ZN9REMMatrixC2Ev($_mViewProj);
 $_mWorldViewProj = (($this) + 936|0);
 __ZN9REMMatrixC2Ev($_mWorldViewProj);
 $_bRunning = (($this) + 36|0);
 HEAP8[$_bRunning>>0] = 1;
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice15getActiveSkinIDEv($this) {
 $this = $this|0;
 var $0 = 0, $_nActiveSkin = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_nActiveSkin = (($this) + 32|0);
 $0 = HEAP32[$_nActiveSkin>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN15REMRenderDevice15setActiveSkinIDEj($this,$skinID) {
 $this = $this|0;
 $skinID = $skinID|0;
 var $_nActiveSkin = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_nActiveSkin = (($this) + 32|0);
 HEAP32[$_nActiveSkin>>2] = $skinID;
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice14getSkinManagerEv($this) {
 $this = $this|0;
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[$this>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN15REMRenderDevice16getShaderManagerEv($this) {
 $this = $this|0;
 var $0 = 0, $_pShaderMan = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_pShaderMan = (($this) + 4|0);
 $0 = HEAP32[$_pShaderMan>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN15REMRenderDevice16getVertexManagerEv($this) {
 $this = $this|0;
 var $0 = 0, $_pVertexMan = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_pVertexMan = (($this) + 8|0);
 $0 = HEAP32[$_pVertexMan>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN15REMRenderDevice11oneTimeInitEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_mView3D = 0, $_mWorld2$i = 0, $_mode = 0, $_nActiveSkin$i = 0, $_nStage = 0, $_pShaderMan = 0, $_pVertexMan = 0, $_shadeMode$i = 0, $cMat = 0, $call = 0, $call2 = 0;
 var $call30 = 0, $call31 = 0, $call33 = 0, $call34 = 0, $call38 = 0, $call39 = 0, $call43 = 0, $call44 = 0, $call48 = 0, $call49 = 0, $call5 = 0, $cmp$i = 0, $ehselector$slot$0 = 0, $exn$slot$0 = 0, $fA = 0, $fA28 = 0, $fB = 0, $fB27 = 0, $fG = 0, $fG26 = 0;
 var $fR = 0, $vpView = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vpView = sp + 16|0;
 $cMat = sp;
 $call = (__Znwj(24)|0);
 __THREW__ = 0;
 invoke_vi(19,($call|0));
 $0 = __THREW__; __THREW__ = 0;
 $1 = $0&1;
 if ($1) {
  $23 = ___cxa_find_matching_catch()|0;
  $24 = tempRet0;
  __ZdlPv($call);
  $ehselector$slot$0 = $24;$exn$slot$0 = $23;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 HEAP32[$this>>2] = $call;
 $call2 = (__Znwj(786440)|0);
 __THREW__ = 0;
 invoke_vii(20,($call2|0),($this|0));
 $2 = __THREW__; __THREW__ = 0;
 $3 = $2&1;
 if ($3) {
  $25 = ___cxa_find_matching_catch()|0;
  $26 = tempRet0;
  __ZdlPv($call2);
  $ehselector$slot$0 = $26;$exn$slot$0 = $25;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 $_pShaderMan = (($this) + 4|0);
 HEAP32[$_pShaderMan>>2] = $call2;
 $call5 = (__Znwj(420)|0);
 __THREW__ = 0;
 invoke_viiii(21,($call5|0),($this|0),300,450);
 $4 = __THREW__; __THREW__ = 0;
 $5 = $4&1;
 if ($5) {
  $27 = ___cxa_find_matching_catch()|0;
  $28 = tempRet0;
  __ZdlPv($call5);
  $ehselector$slot$0 = $28;$exn$slot$0 = $27;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 $_pVertexMan = (($this) + 8|0);
 HEAP32[$_pVertexMan>>2] = $call5;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($call5)|0);
 _glDisable(2884);
 _glEnable(2929);
 _glClear(16640);
 ;HEAP32[$vpView+0>>2]=HEAP32[456+0>>2]|0;HEAP32[$vpView+4>>2]=HEAP32[456+4>>2]|0;HEAP32[$vpView+8>>2]=HEAP32[456+8>>2]|0;HEAP32[$vpView+12>>2]=HEAP32[456+12>>2]|0;
 $_mode = (($this) + 24|0);
 HEAP32[$_mode>>2] = 0;
 $_nStage = (($this) + 28|0);
 HEAP32[$_nStage>>2] = -1;
 $_nActiveSkin$i = (($this) + 32|0);
 HEAP32[$_nActiveSkin$i>>2] = 65535;
 $fR = (($this) + 1000|0);
 HEAPF32[$fR>>2] = 1.0;
 $fG = (($this) + 1004|0);
 HEAPF32[$fG>>2] = 1.0;
 $fB = (($this) + 1008|0);
 HEAPF32[$fB>>2] = 1.0;
 $fA = (($this) + 1012|0);
 HEAPF32[$fA>>2] = 1.0;
 $6 = HEAP32[$_pVertexMan>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($6)|0);
 $_shadeMode$i = (($this) + 12|0);
 $7 = HEAP32[$_shadeMode$i>>2]|0;
 $cmp$i = ($7|0)==(9);
 if (!($cmp$i)) {
  HEAP32[$_shadeMode$i>>2] = 9;
 }
 $8 = HEAP32[$_pVertexMan>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($8)|0);
 _glEnable(2929);
 _glDepthMask(1);
 _glClear(256);
 $_mView3D = (($this) + 168|0);
 __ZN9REMMatrix8identityEv($_mView3D);
 __ZN15REMRenderDevice17setClippingPlanesEff($this,0.100000001490116119385,1000.0);
 $9 = HEAP32[$_pVertexMan>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($9)|0);
 $_mWorld2$i = (($this) + 808|0);
 __ZN9REMMatrix8identityEv($_mWorld2$i);
 $10 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager16getActiveProgramEv($10)|0);
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 $11 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createVShaderEPKcbPj($11,256,1,0)|0);
 $12 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createFShaderEPKcbPj($12,280,1,0)|0);
 $13 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createProgramEjjPj($13,0,0,0)|0);
 $14 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager15activateProgramEj($14,0)|0);
 $15 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createVShaderEPKcbPj($15,304,1,0)|0);
 $16 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createFShaderEPKcbPj($16,328,1,0)|0);
 $17 = HEAP32[$_pShaderMan>>2]|0;
 (__ZN16REMShaderManager13createProgramEjjPj($17,1,1,0)|0);
 HEAPF32[$cMat>>2] = 1.0;
 $fG26 = (($cMat) + 4|0);
 HEAPF32[$fG26>>2] = 1.0;
 $fB27 = (($cMat) + 8|0);
 HEAPF32[$fB27>>2] = 1.0;
 $fA28 = (($cMat) + 12|0);
 HEAPF32[$fA28>>2] = 1.0;
 $18 = HEAP32[$_pShaderMan>>2]|0;
 $call30 = (__ZN16REMShaderManager16getActiveProgramEv($18)|0);
 $call31 = (_glGetUniformLocation(($call30|0),(352|0))|0);
 _glUniform4fv(($call31|0),1,($cMat|0));
 $19 = HEAP32[$_pShaderMan>>2]|0;
 $call33 = (__ZN16REMShaderManager16getActiveProgramEv($19)|0);
 $call34 = (_glGetUniformLocation(($call33|0),(368|0))|0);
 _glUniform4fv(($call34|0),1,($cMat|0));
 $20 = HEAP32[$_pShaderMan>>2]|0;
 $call38 = (__ZN16REMShaderManager16getActiveProgramEv($20)|0);
 $call39 = (_glGetUniformLocation(($call38|0),(384|0))|0);
 _glUniform4fv(($call39|0),1,($cMat|0));
 $21 = HEAP32[$_pShaderMan>>2]|0;
 $call43 = (__ZN16REMShaderManager16getActiveProgramEv($21)|0);
 $call44 = (_glGetUniformLocation(($call43|0),(400|0))|0);
 _glUniform4fv(($call44|0),1,($cMat|0));
 $22 = HEAP32[$_pShaderMan>>2]|0;
 $call48 = (__ZN16REMShaderManager16getActiveProgramEv($22)|0);
 $call49 = (_glGetUniformLocation(($call48|0),(416|0))|0);
 _glUniform1f(($call49|0),1.0);
 (__ZN15REMRenderDevice9initStageEfP16REMVIEWPORT_TYPEi($this,0.850000023841857910156,$vpView,0)|0);
 (__ZN15REMRenderDevice7setModeE18REMENGINEMODE_TYPEi($this,0,0)|0);
 STACKTOP = sp;return 0;
}
function __ZN15REMRenderDevice17setClippingPlanesEff($this,$fNear,$fFar) {
 $this = $this|0;
 $fNear = +$fNear;
 $fFar = +$fFar;
 var $0 = 0.0, $1 = 0.0, $2 = 0.0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $_22$i = 0, $_2215$i = 0, $_33 = 0, $_33$i = 0, $_3324 = 0, $_3327 = 0, $_3330 = 0, $_3348 = 0, $_3351 = 0, $_3354 = 0, $_3357 = 0, $_41$i = 0, $_42$i = 0, $_43 = 0;
 var $_43$i = 0, $_4319$i = 0, $_4335 = 0, $_4338 = 0, $_4341 = 0, $_4360 = 0, $_4363 = 0, $_4366 = 0, $_4369 = 0, $_44$i = 0, $_fFar = 0, $_fNear = 0, $_mProj2D$i = 0, $_mView2D$i = 0, $add = 0.0, $add$i = 0.0, $cmp = 0, $cmp11 = 0, $cmp5 = 0, $div$i = 0.0;
 var $mul$i = 0.0, $mul43 = 0.0, $mul46 = 0.0, $sub$i = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $_fNear = (($this) + 16|0);
 HEAPF32[$_fNear>>2] = $fNear;
 $_fFar = (($this) + 20|0);
 HEAPF32[$_fFar>>2] = $fFar;
 $cmp = !($fNear <= 0.0);
 if ($cmp) {
  $0 = $fNear;
 } else {
  HEAPF32[$_fNear>>2] = 0.00999999977648258209228;
  $0 = 0.00999999977648258209228;
 }
 $cmp5 = !($fFar <= 1.0);
 if ($cmp5) {
  $1 = $fFar;
 } else {
  HEAPF32[$_fFar>>2] = 1.0;
  $1 = 1.0;
 }
 $cmp11 = !($0 >= $1);
 if (!($cmp11)) {
  HEAPF32[$_fNear>>2] = $1;
  $add = $1 + 1.0;
  HEAPF32[$_fFar>>2] = $add;
 }
 $_mProj2D$i = (($this) + 232|0);
 __ZN9REMMatrix8identityEv($_mProj2D$i);
 $_mView2D$i = (($this) + 104|0);
 __ZN9REMMatrix8identityEv($_mView2D$i);
 HEAPF32[$_mProj2D$i>>2] = 0.00312500004656612873077;
 $_22$i = (($this) + 252|0);
 HEAPF32[$_22$i>>2] = 0.00555555569007992744446;
 $2 = +HEAPF32[$_fFar>>2];
 $3 = +HEAPF32[$_fNear>>2];
 $sub$i = $2 - $3;
 $div$i = 1.0 / $sub$i;
 $_33$i = (($this) + 272|0);
 HEAPF32[$_33$i>>2] = $div$i;
 $4 = $3 * $div$i;
 $mul$i = -$4;
 $_43$i = (($this) + 288|0);
 HEAPF32[$_43$i>>2] = $mul$i;
 $_44$i = (($this) + 292|0);
 HEAPF32[$_44$i>>2] = 1.0;
 $add$i = $3 + 0.100000001490116119385;
 $_2215$i = (($this) + 124|0);
 HEAPF32[$_2215$i>>2] = -1.0;
 $_41$i = (($this) + 152|0);
 HEAPF32[$_41$i>>2] = -320.0;
 $_42$i = (($this) + 156|0);
 HEAPF32[$_42$i>>2] = 180.0;
 $_4319$i = (($this) + 160|0);
 HEAPF32[$_4319$i>>2] = $add$i;
 $_33 = (($this) + 656|0);
 HEAPF32[$_33>>2] = $div$i;
 $_3324 = (($this) + 592|0);
 HEAPF32[$_3324>>2] = $div$i;
 $_3327 = (($this) + 784|0);
 HEAPF32[$_3327>>2] = $div$i;
 $_3330 = (($this) + 720|0);
 HEAPF32[$_3330>>2] = $div$i;
 $_43 = (($this) + 672|0);
 HEAPF32[$_43>>2] = $mul$i;
 $_4335 = (($this) + 608|0);
 HEAPF32[$_4335>>2] = $mul$i;
 $_4338 = (($this) + 800|0);
 HEAPF32[$_4338>>2] = $mul$i;
 $_4341 = (($this) + 736|0);
 HEAPF32[$_4341>>2] = $mul$i;
 $mul43 = $div$i * $2;
 $5 = $mul43 * $3;
 $mul46 = -$5;
 $_3348 = (($this) + 400|0);
 HEAPF32[$_3348>>2] = $mul43;
 $_3351 = (($this) + 336|0);
 HEAPF32[$_3351>>2] = $mul43;
 $_3354 = (($this) + 528|0);
 HEAPF32[$_3354>>2] = $mul43;
 $_3357 = (($this) + 464|0);
 HEAPF32[$_3357>>2] = $mul43;
 $_4360 = (($this) + 416|0);
 HEAPF32[$_4360>>2] = $mul46;
 $_4363 = (($this) + 352|0);
 HEAPF32[$_4363>>2] = $mul46;
 $_4366 = (($this) + 544|0);
 HEAPF32[$_4366>>2] = $mul46;
 $_4369 = (($this) + 480|0);
 HEAPF32[$_4369>>2] = $mul46;
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice9initStageEfP16REMVIEWPORT_TYPEi($this,$fFOV,$pView,$nStage) {
 $this = $this|0;
 $fFOV = +$fFOV;
 $pView = $pView|0;
 $nStage = $nStage|0;
 var $$nStage = 0, $0 = 0, $1 = 0, $10 = 0.0, $11 = 0.0, $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $6 = 0.0, $7 = 0, $8 = 0, $9 = 0.0, $_22 = 0, $_22$i = 0, $_33 = 0, $_33$i = 0, $_34$i = 0, $_43 = 0, $_43$i = 0;
 var $_44 = 0, $_44$i = 0, $_fFar$i = 0, $_fNear$i = 0, $arrayidx = 0, $arrayidx12 = 0, $arrayidx13 = 0, $call2$i = 0.0, $call9$i = 0.0, $cmp$i = 0, $cmp5$i = 0, $conv = 0.0, $conv11 = 0.0, $conv17 = 0.0, $conv24 = 0.0, $div = 0.0, $div$i = 0.0, $div10$i = 0.0, $div17$i = 0.0, $div18 = 0.0;
 var $div25 = 0.0, $div28 = 0.0, $fabsf$i = 0.0, $fabsf12$i = 0.0, $height = 0, $mul = 0.0, $mul$i = 0.0, $mul20$i = 0.0, $sub = 0.0, $sub$i = 0.0, $sub35 = 0.0, $tobool = 0, $width = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $tobool = ($pView|0)==(0|0);
 $arrayidx = ((($this) + ($nStage<<4)|0) + 40|0);
 if ($tobool) {
  ;HEAP32[$arrayidx+0>>2]=HEAP32[456+0>>2]|0;HEAP32[$arrayidx+4>>2]=HEAP32[456+4>>2]|0;HEAP32[$arrayidx+8>>2]=HEAP32[456+8>>2]|0;HEAP32[$arrayidx+12>>2]=HEAP32[456+12>>2]|0;
 } else {
  ;HEAP32[$arrayidx+0>>2]=HEAP32[$pView+0>>2]|0;HEAP32[$arrayidx+4>>2]=HEAP32[$pView+4>>2]|0;HEAP32[$arrayidx+8>>2]=HEAP32[$pView+8>>2]|0;HEAP32[$arrayidx+12>>2]=HEAP32[$pView+12>>2]|0;
 }
 $0 = ($nStage>>>0)>(3);
 $$nStage = $0 ? 0 : $nStage;
 $height = ((($this) + ($$nStage<<4)|0) + 52|0);
 $1 = HEAP32[$height>>2]|0;
 $conv = (+($1>>>0));
 $width = ((($this) + ($$nStage<<4)|0) + 48|0);
 $2 = HEAP32[$width>>2]|0;
 $conv11 = (+($2>>>0));
 $div = $conv / $conv11;
 $arrayidx12 = ((($this) + ($$nStage<<6)|0) + 296|0);
 $_fFar$i = (($this) + 20|0);
 $3 = +HEAPF32[$_fFar$i>>2];
 $_fNear$i = (($this) + 16|0);
 $4 = +HEAPF32[$_fNear$i>>2];
 $sub$i = $3 - $4;
 $fabsf$i = (+Math_abs((+$sub$i)));
 $cmp$i = $fabsf$i < 0.00999999977648258209228;
 if (!($cmp$i)) {
  $div$i = $fFOV * 0.5;
  $call2$i = (+Math_sin((+$div$i)));
  $fabsf12$i = (+Math_abs((+$call2$i)));
  $cmp5$i = $fabsf12$i < 0.00999999977648258209228;
  if (!($cmp5$i)) {
   $call9$i = (+Math_cos((+$div$i)));
   $div10$i = $call9$i / $call2$i;
   $mul$i = $div * $div10$i;
   $div17$i = $3 / $sub$i;
   __ZN9REMMatrix8identityEv($arrayidx12);
   HEAPF32[$arrayidx12>>2] = $mul$i;
   $_22$i = ((($this) + ($$nStage<<6)|0) + 316|0);
   HEAPF32[$_22$i>>2] = $div10$i;
   $_33$i = ((($this) + ($$nStage<<6)|0) + 336|0);
   HEAPF32[$_33$i>>2] = $div17$i;
   $_34$i = ((($this) + ($$nStage<<6)|0) + 340|0);
   HEAPF32[$_34$i>>2] = 1.0;
   $5 = +HEAPF32[$_fNear$i>>2];
   $6 = $div17$i * $5;
   $mul20$i = -$6;
   $_43$i = ((($this) + ($$nStage<<6)|0) + 352|0);
   HEAPF32[$_43$i>>2] = $mul20$i;
   $_44$i = ((($this) + ($$nStage<<6)|0) + 356|0);
   HEAPF32[$_44$i>>2] = 0.0;
  }
 }
 $arrayidx13 = ((($this) + ($$nStage<<6)|0) + 552|0);
 __ZN9REMMatrix8identityEv($arrayidx13);
 $7 = HEAP32[$width>>2]|0;
 $conv17 = (+($7>>>0));
 $div18 = 2.0 / $conv17;
 HEAPF32[$arrayidx13>>2] = $div18;
 $8 = HEAP32[$height>>2]|0;
 $conv24 = (+($8>>>0));
 $div25 = 2.0 / $conv24;
 $_22 = ((($this) + ($$nStage<<6)|0) + 572|0);
 HEAPF32[$_22>>2] = $div25;
 $9 = +HEAPF32[$_fFar$i>>2];
 $10 = +HEAPF32[$_fNear$i>>2];
 $sub = $9 - $10;
 $div28 = 1.0 / $sub;
 $_33 = ((($this) + ($$nStage<<6)|0) + 592|0);
 HEAPF32[$_33>>2] = $div28;
 $11 = +HEAPF32[$_fNear$i>>2];
 $mul = $div28 * $11;
 $sub35 = -$mul;
 $_43 = ((($this) + ($$nStage<<6)|0) + 608|0);
 HEAPF32[$_43>>2] = $sub35;
 $_44 = ((($this) + ($$nStage<<6)|0) + 612|0);
 HEAPF32[$_44>>2] = 1.0;
 STACKTOP = sp;return 0;
}
function __ZN15REMRenderDevice7setModeE18REMENGINEMODE_TYPEi($this,$mode,$nStage) {
 $this = $this|0;
 $mode = $mode|0;
 $nStage = $nStage|0;
 var $$nStage = 0, $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_bRunning = 0, $_mProj2D$i = 0, $_mView2D$i = 0, $_mView3D$i = 0, $_mViewProj$i = 0, $_mode = 0, $_nStage = 0, $_pVertexMan = 0, $arrayidx$i = 0;
 var $arrayidx7$i = 0, $cmp$i = 0, $cmp3$i = 0, $cmp5 = 0, $cmp9 = 0, $height = 0, $pA$0$i = 0, $pB$0$i = 0, $ref$tmp$i = 0, $retval$0 = 0, $tobool = 0, $width = 0, $x = 0, $y = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $ref$tmp$i = sp;
 $_bRunning = (($this) + 36|0);
 $0 = HEAP8[$_bRunning>>0]|0;
 $tobool = ($0<<24>>24)==(0);
 if ($tobool) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $1 = ($nStage>>>0)>(3);
 $$nStage = $1 ? 0 : $nStage;
 $_mode = (($this) + 24|0);
 $2 = HEAP32[$_mode>>2]|0;
 $cmp5 = ($2|0)==($mode|0);
 if (!($cmp5)) {
  HEAP32[$_mode>>2] = $mode;
 }
 $_pVertexMan = (($this) + 8|0);
 $3 = HEAP32[$_pVertexMan>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($3)|0);
 $cmp9 = ($mode|0)==(1);
 if ($cmp9) {
  _glViewport(0,0,640,360);
  $retval$0 = 0;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_nStage = (($this) + 28|0);
 HEAP32[$_nStage>>2] = $$nStage;
 $x = ((($this) + ($$nStage<<4)|0) + 40|0);
 $4 = HEAP32[$x>>2]|0;
 $y = ((($this) + ($$nStage<<4)|0) + 44|0);
 $5 = HEAP32[$y>>2]|0;
 $width = ((($this) + ($$nStage<<4)|0) + 48|0);
 $6 = HEAP32[$width>>2]|0;
 $height = ((($this) + ($$nStage<<4)|0) + 52|0);
 $7 = HEAP32[$height>>2]|0;
 _glViewport(($5|0),($4|0),($6|0),($7|0));
 $8 = HEAP32[$_mode>>2]|0;
 $cmp$i = ($8|0)==(1);
 do {
  if ($cmp$i) {
   $_mProj2D$i = (($this) + 232|0);
   $_mView2D$i = (($this) + 104|0);
   $pA$0$i = $_mProj2D$i;$pB$0$i = $_mView2D$i;
  } else {
   $_mView3D$i = (($this) + 168|0);
   $cmp3$i = ($8|0)==(0);
   $9 = HEAP32[$_nStage>>2]|0;
   if ($cmp3$i) {
    $arrayidx$i = ((($this) + ($9<<6)|0) + 296|0);
    $pA$0$i = $arrayidx$i;$pB$0$i = $_mView3D$i;
    break;
   } else {
    $arrayidx7$i = ((($this) + ($9<<6)|0) + 552|0);
    $pA$0$i = $arrayidx7$i;$pB$0$i = $_mView3D$i;
    break;
   }
  }
 } while(0);
 $_mViewProj$i = (($this) + 872|0);
 __ZNK9REMMatrixmlERKS_($ref$tmp$i,$pA$0$i,$pB$0$i);
 dest=$_mViewProj$i+0|0; src=$ref$tmp$i+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN15REMRenderDevice9setView3DERK9REMVectorS2_S2_S2_($this,$vcRight,$vcUp,$vcDir,$vcPos) {
 $this = $this|0;
 $vcRight = $vcRight|0;
 $vcUp = $vcUp|0;
 $vcDir = $vcDir|0;
 $vcPos = $vcPos|0;
 var $0 = 0, $1 = 0.0, $10 = 0, $11 = 0, $2 = 0.0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $6 = 0.0, $7 = 0.0, $8 = 0.0, $9 = 0.0, $_11 = 0, $_12 = 0, $_13 = 0, $_14 = 0, $_21 = 0, $_22 = 0, $_23 = 0, $_24 = 0;
 var $_31 = 0, $_32 = 0, $_33 = 0, $_34 = 0, $_41 = 0, $_42 = 0, $_43 = 0, $_44 = 0, $_bRunning = 0, $_mProj2D$i = 0, $_mView2D$i = 0, $_mView3D$i = 0, $_mViewProj$i = 0, $_mode$i = 0, $_nStage$i = 0, $arrayidx$i = 0, $arrayidx7$i = 0, $call = 0.0, $call15 = 0.0, $call24 = 0.0;
 var $cmp$i = 0, $cmp3$i = 0, $pA$0$i = 0, $pB$0$i = 0, $ref$tmp$i = 0, $retval$0 = 0, $sub = 0.0, $sub16 = 0.0, $sub25 = 0.0, $tobool = 0, $y = 0, $y11 = 0, $y20 = 0, $z = 0, $z13 = 0, $z22 = 0, dest = 0, label = 0, sp = 0, src = 0;
 var stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $ref$tmp$i = sp;
 $_bRunning = (($this) + 36|0);
 $0 = HEAP8[$_bRunning>>0]|0;
 $tobool = ($0<<24>>24)==(0);
 if ($tobool) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_34 = (($this) + 212|0);
 HEAPF32[$_34>>2] = 0.0;
 $_24 = (($this) + 196|0);
 HEAPF32[$_24>>2] = 0.0;
 $_14 = (($this) + 180|0);
 HEAPF32[$_14>>2] = 0.0;
 $_44 = (($this) + 228|0);
 HEAPF32[$_44>>2] = 1.0;
 $1 = +HEAPF32[$vcRight>>2];
 $_11 = (($this) + 168|0);
 HEAPF32[$_11>>2] = $1;
 $y = (($vcRight) + 4|0);
 $2 = +HEAPF32[$y>>2];
 $_21 = (($this) + 184|0);
 HEAPF32[$_21>>2] = $2;
 $z = (($vcRight) + 8|0);
 $3 = +HEAPF32[$z>>2];
 $_31 = (($this) + 200|0);
 HEAPF32[$_31>>2] = $3;
 $call = (+__ZNK9REMVectormlERKS_($vcRight,$vcPos));
 $sub = -$call;
 $_41 = (($this) + 216|0);
 HEAPF32[$_41>>2] = $sub;
 $4 = +HEAPF32[$vcUp>>2];
 $_12 = (($this) + 172|0);
 HEAPF32[$_12>>2] = $4;
 $y11 = (($vcUp) + 4|0);
 $5 = +HEAPF32[$y11>>2];
 $_22 = (($this) + 188|0);
 HEAPF32[$_22>>2] = $5;
 $z13 = (($vcUp) + 8|0);
 $6 = +HEAPF32[$z13>>2];
 $_32 = (($this) + 204|0);
 HEAPF32[$_32>>2] = $6;
 $call15 = (+__ZNK9REMVectormlERKS_($vcUp,$vcPos));
 $sub16 = -$call15;
 $_42 = (($this) + 220|0);
 HEAPF32[$_42>>2] = $sub16;
 $7 = +HEAPF32[$vcDir>>2];
 $_13 = (($this) + 176|0);
 HEAPF32[$_13>>2] = $7;
 $y20 = (($vcDir) + 4|0);
 $8 = +HEAPF32[$y20>>2];
 $_23 = (($this) + 192|0);
 HEAPF32[$_23>>2] = $8;
 $z22 = (($vcDir) + 8|0);
 $9 = +HEAPF32[$z22>>2];
 $_33 = (($this) + 208|0);
 HEAPF32[$_33>>2] = $9;
 $call24 = (+__ZNK9REMVectormlERKS_($vcDir,$vcPos));
 $sub25 = -$call24;
 $_43 = (($this) + 224|0);
 HEAPF32[$_43>>2] = $sub25;
 $_mode$i = (($this) + 24|0);
 $10 = HEAP32[$_mode$i>>2]|0;
 $cmp$i = ($10|0)==(1);
 do {
  if ($cmp$i) {
   $_mProj2D$i = (($this) + 232|0);
   $_mView2D$i = (($this) + 104|0);
   $pA$0$i = $_mProj2D$i;$pB$0$i = $_mView2D$i;
  } else {
   $_mView3D$i = (($this) + 168|0);
   $cmp3$i = ($10|0)==(0);
   $_nStage$i = (($this) + 28|0);
   $11 = HEAP32[$_nStage$i>>2]|0;
   if ($cmp3$i) {
    $arrayidx$i = ((($this) + ($11<<6)|0) + 296|0);
    $pA$0$i = $arrayidx$i;$pB$0$i = $_mView3D$i;
    break;
   } else {
    $arrayidx7$i = ((($this) + ($11<<6)|0) + 552|0);
    $pA$0$i = $arrayidx7$i;$pB$0$i = $_mView3D$i;
    break;
   }
  }
 } while(0);
 $_mViewProj$i = (($this) + 872|0);
 __ZNK9REMMatrixmlERKS_($ref$tmp$i,$pA$0$i,$pB$0$i);
 dest=$_mViewProj$i+0|0; src=$ref$tmp$i+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $_mProj2D = 0, $_mView2D = 0, $_mView3D = 0, $_mWorld = 0, $_mWorldViewProj = 0, $_mode = 0, $_nStage = 0, $_pShaderMan = 0, $arrayidx = 0, $arrayidx7 = 0, $call = 0, $call12 = 0, $call13 = 0, $call9 = 0, $cmp = 0, $cmp3 = 0;
 var $pProj$0 = 0, $pView$0 = 0, $ref$tmp = 0, $tmp = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $ref$tmp = sp + 64|0;
 $tmp = sp;
 $_mWorld = (($this) + 808|0);
 $_mode = (($this) + 24|0);
 $0 = HEAP32[$_mode>>2]|0;
 $cmp = ($0|0)==(1);
 do {
  if ($cmp) {
   $_mProj2D = (($this) + 232|0);
   $_mView2D = (($this) + 104|0);
   $pProj$0 = $_mProj2D;$pView$0 = $_mView2D;
  } else {
   $_mView3D = (($this) + 168|0);
   $cmp3 = ($0|0)==(0);
   $_nStage = (($this) + 28|0);
   $1 = HEAP32[$_nStage>>2]|0;
   if ($cmp3) {
    $arrayidx = ((($this) + ($1<<6)|0) + 296|0);
    $pProj$0 = $arrayidx;$pView$0 = $_mView3D;
    break;
   } else {
    $arrayidx7 = ((($this) + ($1<<6)|0) + 552|0);
    $pProj$0 = $arrayidx7;$pView$0 = $_mView3D;
    break;
   }
  }
 } while(0);
 $_mWorldViewProj = (($this) + 936|0);
 __ZNK9REMMatrixmlERKS_($tmp,$_mWorld,$pView$0);
 __ZNK9REMMatrixmlERKS_($ref$tmp,$tmp,$pProj$0);
 dest=$_mWorldViewProj+0|0; src=$ref$tmp+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 $_pShaderMan = (($this) + 4|0);
 $2 = HEAP32[$_pShaderMan>>2]|0;
 $call = (__ZN16REMShaderManager16getActiveProgramEv($2)|0);
 $call9 = (_glGetUniformLocation(($call|0),(432|0))|0);
 _glUniformMatrix4fv(($call9|0),1,0,($_mWorldViewProj|0));
 $3 = HEAP32[$_pShaderMan>>2]|0;
 $call12 = (__ZN16REMShaderManager16getActiveProgramEv($3)|0);
 $call13 = (_glGetUniformLocation(($call12|0),(440|0))|0);
 _glUniformMatrix4fv(($call13|0),1,1,($_mWorldViewProj|0));
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice13setViewLookAtERK9REMVectorS2_S2_($this,$vcPos,$vcPoint,$vcWorldUp) {
 $this = $this|0;
 $vcPos = $vcPos|0;
 $vcPoint = $vcPoint|0;
 $vcWorldUp = $vcWorldUp|0;
 var $0 = 0.0, $1 = 0.0, $call = 0.0, $call12 = 0.0, $call17 = 0, $call4 = 0.0, $call7 = 0.0, $cmp = 0, $cmp13 = 0, $cmp8 = 0, $conv = 0.0, $fL$0 = 0.0, $ref$tmp = 0, $ref$tmp10 = 0, $ref$tmp11 = 0, $ref$tmp2 = 0, $ref$tmp3 = 0, $ref$tmp5 = 0, $ref$tmp6 = 0, $retval$0 = 0;
 var $vcDir = 0, $vcRight = 0, $vcTemp = 0, $vcUp = 0, $vcY = 0, $y = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 192|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vcDir = sp + 16|0;
 $vcTemp = sp + 64|0;
 $vcUp = sp + 144|0;
 $ref$tmp = sp;
 $ref$tmp2 = sp + 128|0;
 $ref$tmp3 = sp + 160|0;
 $vcY = sp + 176|0;
 $ref$tmp5 = sp + 96|0;
 $ref$tmp6 = sp + 80|0;
 $ref$tmp10 = sp + 32|0;
 $ref$tmp11 = sp + 48|0;
 $vcRight = sp + 112|0;
 __ZN9REMVectorC2Ev($vcDir);
 __ZN9REMVectorC2Ev($vcTemp);
 __ZN9REMVectorC2Ev($vcUp);
 __ZNK9REMVectormiERKS_($ref$tmp,$vcPoint,$vcPos);
 ;HEAP32[$vcDir+0>>2]=HEAP32[$ref$tmp+0>>2]|0;HEAP32[$vcDir+4>>2]=HEAP32[$ref$tmp+4>>2]|0;HEAP32[$vcDir+8>>2]=HEAP32[$ref$tmp+8>>2]|0;HEAP32[$vcDir+12>>2]=HEAP32[$ref$tmp+12>>2]|0;
 __ZN9REMVector9normaliseEv($vcDir);
 $call = (+__ZNK9REMVectormlERKS_($vcWorldUp,$vcDir));
 __ZNK9REMVectormlEf($ref$tmp2,$vcDir,$call);
 ;HEAP32[$vcTemp+0>>2]=HEAP32[$ref$tmp2+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$ref$tmp2+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$ref$tmp2+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$ref$tmp2+12>>2]|0;
 __ZNK9REMVectormiERKS_($ref$tmp3,$vcWorldUp,$vcTemp);
 ;HEAP32[$vcUp+0>>2]=HEAP32[$ref$tmp3+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$ref$tmp3+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$ref$tmp3+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$ref$tmp3+12>>2]|0;
 $call4 = (+__ZN9REMVector9getLengthEv($vcUp));
 $cmp = $call4 < 9.99999997475242707878E-7;
 if ($cmp) {
  __ZN9REMVectorC2Ev($vcY);
  __ZN9REMVector3setEffff($vcY,0.0,1.0,0.0,1.0);
  $y = (($vcDir) + 4|0);
  $0 = +HEAPF32[$y>>2];
  __ZNK9REMVectormlEf($ref$tmp5,$vcDir,$0);
  ;HEAP32[$vcTemp+0>>2]=HEAP32[$ref$tmp5+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$ref$tmp5+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$ref$tmp5+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$ref$tmp5+12>>2]|0;
  __ZNK9REMVectormiERKS_($ref$tmp6,$vcY,$vcTemp);
  ;HEAP32[$vcUp+0>>2]=HEAP32[$ref$tmp6+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$ref$tmp6+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$ref$tmp6+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$ref$tmp6+12>>2]|0;
  $call7 = (+__ZN9REMVector9getLengthEv($vcUp));
  $cmp8 = $call7 < 9.99999997475242707878E-7;
  if ($cmp8) {
   __ZN9REMVector3setEffff($vcY,0.0,0.0,1.0,1.0);
   $z = (($vcDir) + 8|0);
   $1 = +HEAPF32[$z>>2];
   __ZNK9REMVectormlEf($ref$tmp10,$vcDir,$1);
   ;HEAP32[$vcTemp+0>>2]=HEAP32[$ref$tmp10+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$ref$tmp10+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$ref$tmp10+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$ref$tmp10+12>>2]|0;
   __ZNK9REMVectormiERKS_($ref$tmp11,$vcY,$vcTemp);
   ;HEAP32[$vcUp+0>>2]=HEAP32[$ref$tmp11+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$ref$tmp11+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$ref$tmp11+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$ref$tmp11+12>>2]|0;
   $call12 = (+__ZN9REMVector9getLengthEv($vcUp));
   $conv = $call12;
   $cmp13 = $conv < 9.99999999999999954748E-7;
   if ($cmp13) {
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   } else {
    $fL$0 = $call12;
   }
  } else {
   $fL$0 = $call7;
  }
 } else {
  $fL$0 = $call4;
 }
 __ZN9REMVectordVEf($vcUp,$fL$0);
 __ZN9REMVectorC2Ev($vcRight);
 __ZN9REMVector5crossERKS_S1_($vcRight,$vcUp,$vcDir);
 $call17 = (__ZN15REMRenderDevice9setView3DERK9REMVectorS2_S2_S2_($this,$vcRight,$vcUp,$vcDir,$vcPos)|0);
 $retval$0 = $call17;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN15REMRenderDevice12getShadeModeEv($this) {
 $this = $this|0;
 var $0 = 0, $_shadeMode = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_shadeMode = (($this) + 12|0);
 $0 = HEAP32[$_shadeMode>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN16REMShaderManagerC2EP15REMRenderDevice($this,$renderDevice) {
 $this = $this|0;
 $renderDevice = $renderDevice|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 HEAP32[$this>>2] = $renderDevice;
 STACKTOP = sp;return;
}
function __ZN16REMShaderManager13createVShaderEPKcbPj($this,$pData,$bLoadFromFile,$pID) {
 $this = $this|0;
 $pData = $pData|0;
 $bLoadFromFile = $bLoadFromFile|0;
 $pID = $pID|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $_nNumVShaders = 0, $add = 0, $arrayidx = 0, $call = 0, $call13 = 0, $call19 = 0, $call24 = 0, $call7 = 0, $call8 = 0, $cmp = 0, $cmp14 = 0;
 var $cmp22 = 0, $compile_ok = 0, $inc = 0, $infoLen = 0, $retval$0 = 0, $tobool20 = 0, $tobool3 = 0, $tobool31 = 0, $tobool9 = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vs_source = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $vs_source = sp + 20|0;
 $compile_ok = sp + 16|0;
 $infoLen = sp + 12|0;
 HEAP32[$compile_ok>>2] = 0;
 HEAP32[$infoLen>>2] = 0;
 $_nNumVShaders = (($this) + 786424|0);
 $0 = HEAP32[$_nNumVShaders>>2]|0;
 $cmp = ($0>>>0)>(65533);
 if ($cmp) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 do {
  if ($bLoadFromFile) {
   $call = (_fopen(($pData|0),(472|0))|0);
   $tobool3 = ($call|0)==(0|0);
   if ($tobool3) {
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   }
   (_fseek(($call|0),0,2)|0);
   $call7 = (_ftell(($call|0))|0);
   _rewind(($call|0));
   $add = (($call7) + 1)|0;
   $call8 = (_calloc(1,$add)|0);
   HEAP32[$vs_source>>2] = $call8;
   $tobool9 = ($call8|0)==(0|0);
   if ($tobool9) {
    (_fclose(($call|0))|0);
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   }
   $call13 = (_fread(($call8|0),($call7|0),1,($call|0))|0);
   $cmp14 = ($call13|0)==(1);
   if ($cmp14) {
    (_fclose(($call|0))|0);
    break;
   }
   $1 = HEAP32[$vs_source>>2]|0;
   _free($1);
   $retval$0 = -1;
   STACKTOP = sp;return ($retval$0|0);
  } else {
   HEAP32[$vs_source>>2] = $pData;
  }
 } while(0);
 $call19 = (_glCreateShader(35633)|0);
 _glShaderSource(($call19|0),1,($vs_source|0),(0|0));
 _glCompileShader(($call19|0));
 _glGetShaderiv(($call19|0),35713,($compile_ok|0));
 $2 = HEAP32[$compile_ok>>2]|0;
 $tobool20 = ($2|0)==(0);
 if ($tobool20) {
  _glGetShaderiv(($call19|0),35716,($infoLen|0));
  $3 = HEAP32[$infoLen>>2]|0;
  $cmp22 = ($3|0)>(1);
  if ($cmp22) {
   $call24 = (_malloc($3)|0);
   _glGetShaderInfoLog(($call19|0),($3|0),(0|0),($call24|0));
   HEAP32[$vararg_buffer>>2] = $call24;
   __ZN16REMShaderManager3logEPcz(0,480,$vararg_buffer);
   _free($call24);
  }
 }
 if ($bLoadFromFile) {
  $4 = HEAP32[$vs_source>>2]|0;
  _free($4);
 }
 $5 = HEAP32[$_nNumVShaders>>2]|0;
 $arrayidx = ((($this) + ($5<<2)|0) + 4|0);
 HEAP32[$arrayidx>>2] = $call19;
 $tobool31 = ($pID|0)==(0|0);
 if (!($tobool31)) {
  $6 = HEAP32[$_nNumVShaders>>2]|0;
  HEAP32[$pID>>2] = $6;
 }
 $7 = HEAP32[$_nNumVShaders>>2]|0;
 HEAP32[$vararg_buffer1>>2] = $7;
 __ZN16REMShaderManager3logEPcz(0,512,$vararg_buffer1);
 $8 = HEAP32[$_nNumVShaders>>2]|0;
 $inc = (($8) + 1)|0;
 HEAP32[$_nNumVShaders>>2] = $inc;
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN16REMShaderManager3logEPcz($this,$chString,$varargs) {
 $this = $this|0;
 $chString = $chString|0;
 $varargs = $varargs|0;
 var $args = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $args = sp + 8|0;
 HEAP32[$args>>2] = $varargs;
 (_printf((656|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN16REMShaderManager13createFShaderEPKcbPj($this,$pData,$bLoadFromFile,$pID) {
 $this = $this|0;
 $pData = $pData|0;
 $bLoadFromFile = $bLoadFromFile|0;
 $pID = $pID|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $_nNumFShaders = 0, $add = 0, $arrayidx = 0, $call = 0, $call13 = 0, $call19 = 0, $call24 = 0, $call7 = 0, $call8 = 0, $cmp = 0, $cmp14 = 0;
 var $cmp22 = 0, $compile_ok = 0, $fs_source = 0, $inc = 0, $infoLen = 0, $retval$0 = 0, $tobool20 = 0, $tobool3 = 0, $tobool31 = 0, $tobool9 = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $fs_source = sp + 20|0;
 $compile_ok = sp + 16|0;
 $infoLen = sp + 12|0;
 HEAP32[$compile_ok>>2] = 0;
 HEAP32[$infoLen>>2] = 0;
 $_nNumFShaders = (($this) + 786428|0);
 $0 = HEAP32[$_nNumFShaders>>2]|0;
 $cmp = ($0>>>0)>(65533);
 if ($cmp) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 do {
  if ($bLoadFromFile) {
   $call = (_fopen(($pData|0),(472|0))|0);
   $tobool3 = ($call|0)==(0|0);
   if ($tobool3) {
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   }
   (_fseek(($call|0),0,2)|0);
   $call7 = (_ftell(($call|0))|0);
   _rewind(($call|0));
   $add = (($call7) + 1)|0;
   $call8 = (_calloc(1,$add)|0);
   HEAP32[$fs_source>>2] = $call8;
   $tobool9 = ($call8|0)==(0|0);
   if ($tobool9) {
    (_fclose(($call|0))|0);
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   }
   $call13 = (_fread(($call8|0),($call7|0),1,($call|0))|0);
   $cmp14 = ($call13|0)==(1);
   if ($cmp14) {
    (_fclose(($call|0))|0);
    break;
   }
   $1 = HEAP32[$fs_source>>2]|0;
   _free($1);
   $retval$0 = -1;
   STACKTOP = sp;return ($retval$0|0);
  } else {
   HEAP32[$fs_source>>2] = $pData;
  }
 } while(0);
 $call19 = (_glCreateShader(35632)|0);
 _glShaderSource(($call19|0),1,($fs_source|0),(0|0));
 _glCompileShader(($call19|0));
 _glGetShaderiv(($call19|0),35713,($compile_ok|0));
 $2 = HEAP32[$compile_ok>>2]|0;
 $tobool20 = ($2|0)==(0);
 if ($tobool20) {
  _glGetShaderiv(($call19|0),35716,($infoLen|0));
  $3 = HEAP32[$infoLen>>2]|0;
  $cmp22 = ($3|0)>(1);
  if ($cmp22) {
   $call24 = (_malloc($3)|0);
   _glGetShaderInfoLog(($call19|0),($3|0),(0|0),($call24|0));
   HEAP32[$vararg_buffer>>2] = $call24;
   __ZN16REMShaderManager3logEPcz(0,480,$vararg_buffer);
   _free($call24);
  }
 }
 if ($bLoadFromFile) {
  $4 = HEAP32[$fs_source>>2]|0;
  _free($4);
 }
 $5 = HEAP32[$_nNumFShaders>>2]|0;
 $arrayidx = ((($this) + ($5<<2)|0) + 262144|0);
 HEAP32[$arrayidx>>2] = $call19;
 $tobool31 = ($pID|0)==(0|0);
 if (!($tobool31)) {
  $6 = HEAP32[$_nNumFShaders>>2]|0;
  HEAP32[$pID>>2] = $6;
 }
 $7 = HEAP32[$_nNumFShaders>>2]|0;
 HEAP32[$vararg_buffer1>>2] = $7;
 __ZN16REMShaderManager3logEPcz(0,552,$vararg_buffer1);
 $8 = HEAP32[$_nNumFShaders>>2]|0;
 $inc = (($8) + 1)|0;
 HEAP32[$_nNumFShaders>>2] = $inc;
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN16REMShaderManager13createProgramEjjPj($this,$vID,$fID,$pID) {
 $this = $this|0;
 $vID = $vID|0;
 $fID = $fID|0;
 $pID = $pID|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $_nNumPrograms = 0, $arrayidx = 0, $arrayidx2 = 0, $arrayidx3 = 0, $call = 0, $inc = 0, $tobool = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $call = (_glCreateProgram()|0);
 $arrayidx = ((($this) + ($fID<<2)|0) + 262144|0);
 $0 = HEAP32[$arrayidx>>2]|0;
 _glAttachShader(($call|0),($0|0));
 $arrayidx2 = ((($this) + ($vID<<2)|0) + 4|0);
 $1 = HEAP32[$arrayidx2>>2]|0;
 _glAttachShader(($call|0),($1|0));
 _glLinkProgram(($call|0));
 $_nNumPrograms = (($this) + 786432|0);
 $2 = HEAP32[$_nNumPrograms>>2]|0;
 $arrayidx3 = ((($this) + ($2<<2)|0) + 524284|0);
 HEAP32[$arrayidx3>>2] = $call;
 $tobool = ($pID|0)==(0|0);
 if (!($tobool)) {
  $3 = HEAP32[$_nNumPrograms>>2]|0;
  HEAP32[$pID>>2] = $3;
 }
 $4 = HEAP32[$_nNumPrograms>>2]|0;
 HEAP32[$vararg_buffer>>2] = $4;
 __ZN16REMShaderManager3logEPcz(0,592,$vararg_buffer);
 $5 = HEAP32[$_nNumPrograms>>2]|0;
 $inc = (($5) + 1)|0;
 HEAP32[$_nNumPrograms>>2] = $inc;
 STACKTOP = sp;return 0;
}
function __ZN16REMShaderManager15activateProgramEj($this,$pID) {
 $this = $this|0;
 $pID = $pID|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $_activeProgram = 0, $_nNumPrograms = 0, $arrayidx = 0, $call = 0, $cmp = 0, $retval$0 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $_nNumPrograms = (($this) + 786432|0);
 $0 = HEAP32[$_nNumPrograms>>2]|0;
 $cmp = ($0>>>0)>($pID>>>0);
 if (!($cmp)) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $1 = HEAP32[$this>>2]|0;
 $call = (__ZN15REMRenderDevice16getVertexManagerEv($1)|0);
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($call)|0);
 $arrayidx = ((($this) + ($pID<<2)|0) + 524284|0);
 $2 = HEAP32[$arrayidx>>2]|0;
 _glUseProgram(($2|0));
 $3 = HEAP32[$arrayidx>>2]|0;
 $_activeProgram = (($this) + 786436|0);
 HEAP32[$_activeProgram>>2] = $3;
 HEAP32[$vararg_buffer>>2] = $pID;
 __ZN16REMShaderManager3logEPcz(0,624,$vararg_buffer);
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN16REMShaderManager16getActiveProgramEv($this) {
 $this = $this|0;
 var $0 = 0, $_activeProgram = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_activeProgram = (($this) + 786436|0);
 $0 = HEAP32[$_activeProgram>>2]|0;
 STACKTOP = sp;return ($0|0);
}
function __ZN14REMSkinManagerC2Ev($this) {
 $this = $this|0;
 var $vararg_buffer = 0, $vararg_buffer1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 __ZN14REMSkinManager3logEPcz(0,680,$vararg_buffer);
 ;HEAP32[$this+0>>2]=0|0;HEAP32[$this+4>>2]=0|0;HEAP32[$this+8>>2]=0|0;HEAP32[$this+12>>2]=0|0;HEAP32[$this+16>>2]=0|0;HEAP32[$this+20>>2]=0|0;
 __ZN14REMSkinManager3logEPcz(0,696,$vararg_buffer1);
 STACKTOP = sp;return;
}
function __ZN14REMSkinManager3logEPcz($this,$chString,$varargs) {
 $this = $this|0;
 $chString = $chString|0;
 $varargs = $varargs|0;
 var $args = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $args = sp + 8|0;
 HEAP32[$args>>2] = $varargs;
 (_printf((800|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN14REMSkinManager7getSkinEj($agg$result,$this,$nSkinID) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $nSkinID = $nSkinID|0;
 var $0 = 0, $1 = 0, $2 = 0, $_pSkins = 0, $cmp = 0, $emptySkin = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $emptySkin = sp;
 $0 = HEAP32[$this>>2]|0;
 $cmp = ($0>>>0)>($nSkinID>>>0);
 if ($cmp) {
  $_pSkins = (($this) + 12|0);
  $1 = HEAP32[$_pSkins>>2]|0;
  $2 = (($1) + (($nSkinID*40)|0)|0);
  dest=$agg$result+0|0; src=$2+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
  STACKTOP = sp;return;
 } else {
  dest=$agg$result+0|0; src=$emptySkin+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
  STACKTOP = sp;return;
 }
}
function __ZN14REMSkinManager7addSkinEPK14REMCOLOUR_TYPES2_S2_S2_fPj($this,$pcAmbient,$pcDiffuse,$pcEmissive,$pcSpecular,$fSpecPower,$nSkinID) {
 $this = $this|0;
 $pcAmbient = $pcAmbient|0;
 $pcDiffuse = $pcDiffuse|0;
 $pcEmissive = $pcEmissive|0;
 $pcSpecular = $pcSpecular|0;
 $fSpecPower = +$fSpecPower;
 $nSkinID = $nSkinID|0;
 var $$lcssa55 = 0, $$pre = 0, $$pre63 = 0, $$pre64 = 0, $0 = 0, $1 = 0, $10 = 0.0, $11 = 0.0, $12 = 0.0, $13 = 0.0, $14 = 0.0, $15 = 0.0, $16 = 0.0, $17 = 0.0, $18 = 0.0, $19 = 0.0, $2 = 0, $20 = 0.0, $21 = 0.0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $5 = 0.0, $6 = 0.0, $7 = 0.0, $8 = 0.0, $9 = 0.0, $_nNumMaterials = 0, $_pMaterials = 0, $_pMaterials28 = 0, $_pMaterials37$phi$trans$insert = 0, $_pSkins = 0, $_pSkins14 = 0, $_pSkins18 = 0, $arrayidx51 = 0, $arrayidx51$1 = 0, $arrayidx51$2 = 0, $arrayidx51$3 = 0, $arrayidx51$4 = 0;
 var $arrayidx51$5 = 0, $arrayidx51$6 = 0, $arrayidx51$7 = 0, $bAlpha = 0, $call = 0, $call29 = 0, $cmp = 0, $cmp$i = 0, $cmp$i$i = 0, $cmp$i11$i = 0, $cmp$i29$i = 0, $cmp$i47$i = 0, $cmp10$i$i = 0, $cmp10$i22$i = 0, $cmp10$i40$i = 0, $cmp10$i58$i = 0, $cmp23 = 0, $cmp4$i$i = 0, $cmp4$i14$i = 0, $cmp4$i32$i = 0;
 var $cmp4$i50$i = 0, $cmp7 = 0, $cmp7$i$i = 0, $cmp7$i18$i = 0, $cmp7$i36$i = 0, $cmp7$i54$i = 0, $cmp757 = 0, $fA2$i$i = 0, $fA2$i10$i = 0, $fA2$i28$i = 0, $fA2$i46$i = 0, $fB9$i$i = 0, $fB9$i21$i = 0, $fB9$i39$i = 0, $fB9$i57$i = 0, $fG6$i$i = 0, $fG6$i17$i = 0, $fG6$i35$i = 0, $fG6$i53$i = 0, $fPower12$i = 0;
 var $fR3$i$i = 0, $fR3$i13$i = 0, $fR3$i31$i = 0, $fR3$i49$i = 0, $inc = 0, $inc40 = 0, $inc58 = 0, $mat$sroa$0$0$copyload8 = 0.0, $mat$sroa$0$0$idx = 0, $mat$sroa$1$4$copyload11 = 0.0, $mat$sroa$1$4$idx10 = 0, $mat$sroa$1$4$idx9 = 0, $mat$sroa$10$40$copyload36 = 0.0, $mat$sroa$10$40$idx34 = 0, $mat$sroa$10$40$idx35 = 0, $mat$sroa$11$44$copyload39 = 0.0, $mat$sroa$11$44$idx37 = 0, $mat$sroa$11$44$idx38 = 0, $mat$sroa$12$48$copyload41 = 0.0, $mat$sroa$12$48$idx40 = 0;
 var $mat$sroa$13$52$copyload44 = 0.0, $mat$sroa$13$52$idx42 = 0, $mat$sroa$13$52$idx43 = 0, $mat$sroa$14$56$copyload47 = 0.0, $mat$sroa$14$56$idx45 = 0, $mat$sroa$14$56$idx46 = 0, $mat$sroa$15$60$copyload50 = 0.0, $mat$sroa$15$60$idx48 = 0, $mat$sroa$15$60$idx49 = 0, $mat$sroa$16$64$idx51 = 0, $mat$sroa$2$8$copyload14 = 0.0, $mat$sroa$2$8$idx12 = 0, $mat$sroa$2$8$idx13 = 0, $mat$sroa$3$12$copyload17 = 0.0, $mat$sroa$3$12$idx15 = 0, $mat$sroa$3$12$idx16 = 0, $mat$sroa$4$16$copyload19 = 0.0, $mat$sroa$4$16$idx18 = 0, $mat$sroa$5$20$copyload22 = 0.0, $mat$sroa$5$20$idx20 = 0;
 var $mat$sroa$5$20$idx21 = 0, $mat$sroa$6$24$copyload25 = 0.0, $mat$sroa$6$24$idx23 = 0, $mat$sroa$6$24$idx24 = 0, $mat$sroa$7$28$copyload28 = 0.0, $mat$sroa$7$28$idx26 = 0, $mat$sroa$7$28$idx27 = 0, $mat$sroa$8$32$copyload30 = 0.0, $mat$sroa$8$32$idx29 = 0, $mat$sroa$9$36$copyload33 = 0.0, $mat$sroa$9$36$idx31 = 0, $mat$sroa$9$36$idx32 = 0, $mul = 0, $mul27 = 0, $nMat$058 = 0, $nMaterial = 0, $nMaterial20 = 0, $rem = 0, $rem22 = 0, $retval$1 = 0;
 var $tobool = 0, $tobool32 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = HEAP32[$this>>2]|0;
 $rem = (($0>>>0) % 50)&-1;
 $cmp = ($rem|0)==(0);
 if ($cmp) {
  $1 = ($0*40)|0;
  $mul = (($1) + 2000)|0;
  $_pSkins = (($this) + 12|0);
  $2 = HEAP32[$_pSkins>>2]|0;
  $call = (_realloc($2,$mul)|0);
  HEAP32[$_pSkins>>2] = $call;
  $tobool = ($call|0)==(0|0);
  if ($tobool) {
   $retval$1 = -1;
   STACKTOP = sp;return ($retval$1|0);
  }
 }
 $mat$sroa$4$16$copyload19 = +HEAPF32[$pcAmbient>>2];
 $mat$sroa$5$20$idx21 = (($pcAmbient) + 4|0);
 $mat$sroa$5$20$copyload22 = +HEAPF32[$mat$sroa$5$20$idx21>>2];
 $mat$sroa$6$24$idx24 = (($pcAmbient) + 8|0);
 $mat$sroa$6$24$copyload25 = +HEAPF32[$mat$sroa$6$24$idx24>>2];
 $mat$sroa$7$28$idx27 = (($pcAmbient) + 12|0);
 $mat$sroa$7$28$copyload28 = +HEAPF32[$mat$sroa$7$28$idx27>>2];
 $mat$sroa$0$0$copyload8 = +HEAPF32[$pcDiffuse>>2];
 $mat$sroa$1$4$idx10 = (($pcDiffuse) + 4|0);
 $mat$sroa$1$4$copyload11 = +HEAPF32[$mat$sroa$1$4$idx10>>2];
 $mat$sroa$2$8$idx13 = (($pcDiffuse) + 8|0);
 $mat$sroa$2$8$copyload14 = +HEAPF32[$mat$sroa$2$8$idx13>>2];
 $mat$sroa$3$12$idx16 = (($pcDiffuse) + 12|0);
 $mat$sroa$3$12$copyload17 = +HEAPF32[$mat$sroa$3$12$idx16>>2];
 $mat$sroa$12$48$copyload41 = +HEAPF32[$pcEmissive>>2];
 $mat$sroa$13$52$idx43 = (($pcEmissive) + 4|0);
 $mat$sroa$13$52$copyload44 = +HEAPF32[$mat$sroa$13$52$idx43>>2];
 $mat$sroa$14$56$idx46 = (($pcEmissive) + 8|0);
 $mat$sroa$14$56$copyload47 = +HEAPF32[$mat$sroa$14$56$idx46>>2];
 $mat$sroa$15$60$idx49 = (($pcEmissive) + 12|0);
 $mat$sroa$15$60$copyload50 = +HEAPF32[$mat$sroa$15$60$idx49>>2];
 $mat$sroa$8$32$copyload30 = +HEAPF32[$pcSpecular>>2];
 $mat$sroa$9$36$idx32 = (($pcSpecular) + 4|0);
 $mat$sroa$9$36$copyload33 = +HEAPF32[$mat$sroa$9$36$idx32>>2];
 $mat$sroa$10$40$idx35 = (($pcSpecular) + 8|0);
 $mat$sroa$10$40$copyload36 = +HEAPF32[$mat$sroa$10$40$idx35>>2];
 $mat$sroa$11$44$idx38 = (($pcSpecular) + 12|0);
 $mat$sroa$11$44$copyload39 = +HEAPF32[$mat$sroa$11$44$idx38>>2];
 $_nNumMaterials = (($this) + 4|0);
 $3 = HEAP32[$_nNumMaterials>>2]|0;
 $cmp757 = ($3|0)==(0);
 L5: do {
  if ($cmp757) {
   $$lcssa55 = 0;
   label = 24;
  } else {
   $_pMaterials = (($this) + 16|0);
   $4 = HEAP32[$_pMaterials>>2]|0;
   $nMat$058 = 0;
   L7: while(1) {
    $fA2$i$i = ((($4) + (($nMat$058*68)|0)|0) + 28|0);
    $5 = +HEAPF32[$fA2$i$i>>2];
    $cmp$i$i = $mat$sroa$7$28$copyload28 != $5;
    do {
     if (!($cmp$i$i)) {
      $fR3$i$i = ((($4) + (($nMat$058*68)|0)|0) + 16|0);
      $6 = +HEAPF32[$fR3$i$i>>2];
      $cmp4$i$i = $mat$sroa$4$16$copyload19 != $6;
      if (!($cmp4$i$i)) {
       $fG6$i$i = ((($4) + (($nMat$058*68)|0)|0) + 20|0);
       $7 = +HEAPF32[$fG6$i$i>>2];
       $cmp7$i$i = $mat$sroa$5$20$copyload22 != $7;
       if (!($cmp7$i$i)) {
        $fB9$i$i = ((($4) + (($nMat$058*68)|0)|0) + 24|0);
        $8 = +HEAPF32[$fB9$i$i>>2];
        $cmp10$i$i = $mat$sroa$6$24$copyload25 != $8;
        if (!($cmp10$i$i)) {
         $fA2$i46$i = ((($4) + (($nMat$058*68)|0)|0) + 12|0);
         $9 = +HEAPF32[$fA2$i46$i>>2];
         $cmp$i47$i = $mat$sroa$3$12$copyload17 != $9;
         if (!($cmp$i47$i)) {
          $fR3$i49$i = (($4) + (($nMat$058*68)|0)|0);
          $10 = +HEAPF32[$fR3$i49$i>>2];
          $cmp4$i50$i = $mat$sroa$0$0$copyload8 != $10;
          if (!($cmp4$i50$i)) {
           $fG6$i53$i = ((($4) + (($nMat$058*68)|0)|0) + 4|0);
           $11 = +HEAPF32[$fG6$i53$i>>2];
           $cmp7$i54$i = $mat$sroa$1$4$copyload11 != $11;
           if (!($cmp7$i54$i)) {
            $fB9$i57$i = ((($4) + (($nMat$058*68)|0)|0) + 8|0);
            $12 = +HEAPF32[$fB9$i57$i>>2];
            $cmp10$i58$i = $mat$sroa$2$8$copyload14 != $12;
            if (!($cmp10$i58$i)) {
             $fA2$i28$i = ((($4) + (($nMat$058*68)|0)|0) + 60|0);
             $13 = +HEAPF32[$fA2$i28$i>>2];
             $cmp$i29$i = $mat$sroa$15$60$copyload50 != $13;
             if (!($cmp$i29$i)) {
              $fR3$i31$i = ((($4) + (($nMat$058*68)|0)|0) + 48|0);
              $14 = +HEAPF32[$fR3$i31$i>>2];
              $cmp4$i32$i = $mat$sroa$12$48$copyload41 != $14;
              if (!($cmp4$i32$i)) {
               $fG6$i35$i = ((($4) + (($nMat$058*68)|0)|0) + 52|0);
               $15 = +HEAPF32[$fG6$i35$i>>2];
               $cmp7$i36$i = $mat$sroa$13$52$copyload44 != $15;
               if (!($cmp7$i36$i)) {
                $fB9$i39$i = ((($4) + (($nMat$058*68)|0)|0) + 56|0);
                $16 = +HEAPF32[$fB9$i39$i>>2];
                $cmp10$i40$i = $mat$sroa$14$56$copyload47 != $16;
                if (!($cmp10$i40$i)) {
                 $fA2$i10$i = ((($4) + (($nMat$058*68)|0)|0) + 44|0);
                 $17 = +HEAPF32[$fA2$i10$i>>2];
                 $cmp$i11$i = $mat$sroa$11$44$copyload39 != $17;
                 if (!($cmp$i11$i)) {
                  $fR3$i13$i = ((($4) + (($nMat$058*68)|0)|0) + 32|0);
                  $18 = +HEAPF32[$fR3$i13$i>>2];
                  $cmp4$i14$i = $mat$sroa$8$32$copyload30 != $18;
                  if (!($cmp4$i14$i)) {
                   $fG6$i17$i = ((($4) + (($nMat$058*68)|0)|0) + 36|0);
                   $19 = +HEAPF32[$fG6$i17$i>>2];
                   $cmp7$i18$i = $mat$sroa$9$36$copyload33 != $19;
                   if (!($cmp7$i18$i)) {
                    $fB9$i21$i = ((($4) + (($nMat$058*68)|0)|0) + 40|0);
                    $20 = +HEAPF32[$fB9$i21$i>>2];
                    $cmp10$i22$i = $mat$sroa$10$40$copyload36 != $20;
                    if ($cmp10$i22$i) {
                     break;
                    }
                    $fPower12$i = ((($4) + (($nMat$058*68)|0)|0) + 64|0);
                    $21 = +HEAPF32[$fPower12$i>>2];
                    $cmp$i = $21 != $fSpecPower;
                    if (!($cmp$i)) {
                     break L7;
                    }
                   }
                  }
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    } while(0);
    $inc = (($nMat$058) + 1)|0;
    $cmp7 = ($inc>>>0)<($3>>>0);
    if ($cmp7) {
     $nMat$058 = $inc;
    } else {
     $$lcssa55 = $3;
     label = 24;
     break L5;
    }
   }
   $22 = HEAP32[$this>>2]|0;
   $_pSkins14 = (($this) + 12|0);
   $23 = HEAP32[$_pSkins14>>2]|0;
   $nMaterial = ((($23) + (($22*40)|0)|0) + 4|0);
   HEAP32[$nMaterial>>2] = $nMat$058;
   $33 = $23;
  }
 } while(0);
 if ((label|0) == 24) {
  $24 = HEAP32[$this>>2]|0;
  $_pSkins18 = (($this) + 12|0);
  $25 = HEAP32[$_pSkins18>>2]|0;
  $nMaterial20 = ((($25) + (($24*40)|0)|0) + 4|0);
  HEAP32[$nMaterial20>>2] = $$lcssa55;
  $26 = HEAP32[$_nNumMaterials>>2]|0;
  $rem22 = (($26>>>0) % 50)&-1;
  $cmp23 = ($rem22|0)==(0);
  do {
   if ($cmp23) {
    $27 = ($26*68)|0;
    $mul27 = (($27) + 3400)|0;
    $_pMaterials28 = (($this) + 16|0);
    $28 = HEAP32[$_pMaterials28>>2]|0;
    $call29 = (_realloc($28,$mul27)|0);
    HEAP32[$_pMaterials28>>2] = $call29;
    $tobool32 = ($call29|0)==(0|0);
    if ($tobool32) {
     $retval$1 = -1;
     STACKTOP = sp;return ($retval$1|0);
    } else {
     $$pre63 = HEAP32[$_nNumMaterials>>2]|0;
     $29 = $call29;$30 = $$pre63;
     break;
    }
   } else {
    $_pMaterials37$phi$trans$insert = (($this) + 16|0);
    $$pre64 = HEAP32[$_pMaterials37$phi$trans$insert>>2]|0;
    $29 = $$pre64;$30 = $26;
   }
  } while(0);
  $mat$sroa$0$0$idx = (($29) + (($30*68)|0)|0);
  HEAPF32[$mat$sroa$0$0$idx>>2] = $mat$sroa$0$0$copyload8;
  $mat$sroa$1$4$idx9 = ((($29) + (($30*68)|0)|0) + 4|0);
  HEAPF32[$mat$sroa$1$4$idx9>>2] = $mat$sroa$1$4$copyload11;
  $mat$sroa$2$8$idx12 = ((($29) + (($30*68)|0)|0) + 8|0);
  HEAPF32[$mat$sroa$2$8$idx12>>2] = $mat$sroa$2$8$copyload14;
  $mat$sroa$3$12$idx15 = ((($29) + (($30*68)|0)|0) + 12|0);
  HEAPF32[$mat$sroa$3$12$idx15>>2] = $mat$sroa$3$12$copyload17;
  $mat$sroa$4$16$idx18 = ((($29) + (($30*68)|0)|0) + 16|0);
  HEAPF32[$mat$sroa$4$16$idx18>>2] = $mat$sroa$4$16$copyload19;
  $mat$sroa$5$20$idx20 = ((($29) + (($30*68)|0)|0) + 20|0);
  HEAPF32[$mat$sroa$5$20$idx20>>2] = $mat$sroa$5$20$copyload22;
  $mat$sroa$6$24$idx23 = ((($29) + (($30*68)|0)|0) + 24|0);
  HEAPF32[$mat$sroa$6$24$idx23>>2] = $mat$sroa$6$24$copyload25;
  $mat$sroa$7$28$idx26 = ((($29) + (($30*68)|0)|0) + 28|0);
  HEAPF32[$mat$sroa$7$28$idx26>>2] = $mat$sroa$7$28$copyload28;
  $mat$sroa$8$32$idx29 = ((($29) + (($30*68)|0)|0) + 32|0);
  HEAPF32[$mat$sroa$8$32$idx29>>2] = $mat$sroa$8$32$copyload30;
  $mat$sroa$9$36$idx31 = ((($29) + (($30*68)|0)|0) + 36|0);
  HEAPF32[$mat$sroa$9$36$idx31>>2] = $mat$sroa$9$36$copyload33;
  $mat$sroa$10$40$idx34 = ((($29) + (($30*68)|0)|0) + 40|0);
  HEAPF32[$mat$sroa$10$40$idx34>>2] = $mat$sroa$10$40$copyload36;
  $mat$sroa$11$44$idx37 = ((($29) + (($30*68)|0)|0) + 44|0);
  HEAPF32[$mat$sroa$11$44$idx37>>2] = $mat$sroa$11$44$copyload39;
  $mat$sroa$12$48$idx40 = ((($29) + (($30*68)|0)|0) + 48|0);
  HEAPF32[$mat$sroa$12$48$idx40>>2] = $mat$sroa$12$48$copyload41;
  $mat$sroa$13$52$idx42 = ((($29) + (($30*68)|0)|0) + 52|0);
  HEAPF32[$mat$sroa$13$52$idx42>>2] = $mat$sroa$13$52$copyload44;
  $mat$sroa$14$56$idx45 = ((($29) + (($30*68)|0)|0) + 56|0);
  HEAPF32[$mat$sroa$14$56$idx45>>2] = $mat$sroa$14$56$copyload47;
  $mat$sroa$15$60$idx48 = ((($29) + (($30*68)|0)|0) + 60|0);
  HEAPF32[$mat$sroa$15$60$idx48>>2] = $mat$sroa$15$60$copyload50;
  $mat$sroa$16$64$idx51 = ((($29) + (($30*68)|0)|0) + 64|0);
  HEAPF32[$mat$sroa$16$64$idx51>>2] = $fSpecPower;
  $31 = HEAP32[$_nNumMaterials>>2]|0;
  $inc40 = (($31) + 1)|0;
  HEAP32[$_nNumMaterials>>2] = $inc40;
  $$pre = HEAP32[$_pSkins18>>2]|0;
  $33 = $$pre;
 }
 $32 = HEAP32[$this>>2]|0;
 $bAlpha = (($33) + (($32*40)|0)|0);
 HEAP8[$bAlpha>>0] = 0;
 $arrayidx51 = ((($33) + (($32*40)|0)|0) + 8|0);
 HEAP32[$arrayidx51>>2] = 65535;
 $34 = HEAP32[$this>>2]|0;
 $arrayidx51$1 = ((($33) + (($34*40)|0)|0) + 12|0);
 HEAP32[$arrayidx51$1>>2] = 65535;
 $35 = HEAP32[$this>>2]|0;
 $arrayidx51$2 = ((($33) + (($35*40)|0)|0) + 16|0);
 HEAP32[$arrayidx51$2>>2] = 65535;
 $36 = HEAP32[$this>>2]|0;
 $arrayidx51$3 = ((($33) + (($36*40)|0)|0) + 20|0);
 HEAP32[$arrayidx51$3>>2] = 65535;
 $37 = HEAP32[$this>>2]|0;
 $arrayidx51$4 = ((($33) + (($37*40)|0)|0) + 24|0);
 HEAP32[$arrayidx51$4>>2] = 65535;
 $38 = HEAP32[$this>>2]|0;
 $arrayidx51$5 = ((($33) + (($38*40)|0)|0) + 28|0);
 HEAP32[$arrayidx51$5>>2] = 65535;
 $39 = HEAP32[$this>>2]|0;
 $arrayidx51$6 = ((($33) + (($39*40)|0)|0) + 32|0);
 HEAP32[$arrayidx51$6>>2] = 65535;
 $40 = HEAP32[$this>>2]|0;
 $arrayidx51$7 = ((($33) + (($40*40)|0)|0) + 36|0);
 HEAP32[$arrayidx51$7>>2] = 65535;
 $41 = HEAP32[$this>>2]|0;
 HEAP32[$nSkinID>>2] = $41;
 $42 = HEAP32[$this>>2]|0;
 HEAP32[$vararg_buffer>>2] = $42;
 __ZN14REMSkinManager3logEPcz(0,712,$vararg_buffer);
 $43 = HEAP32[$this>>2]|0;
 $inc58 = (($43) + 1)|0;
 HEAP32[$this>>2] = $inc58;
 $retval$1 = 0;
 STACKTOP = sp;return ($retval$1|0);
}
function __ZN14REMSkinManager10addTextureEjPKcbfP14REMCOLOUR_TYPEj($this,$nSkinID,$chName,$bAlpha,$fAlpha,$cColourKeys,$dwNumColourKeys) {
 $this = $this|0;
 $nSkinID = $nSkinID|0;
 $chName = $chName|0;
 $bAlpha = $bAlpha|0;
 $fAlpha = +$fAlpha;
 $cColourKeys = $cColourKeys|0;
 $dwNumColourKeys = $dwNumColourKeys|0;
 var $$arith = 0, $$overflow = 0, $$pre = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_nNumTextures = 0, $_pSkins = 0, $_pTextures = 0, $_pTextures17 = 0, $_pTextures31 = 0, $_pTextures35 = 0, $_pTextures40 = 0;
 var $add43 = 0, $add54 = 0, $arrayidx2 = 0, $arrayidx73 = 0, $arrayidx87 = 0, $bAlpha29 = 0, $call = 0, $call18 = 0, $call42 = 0, $call44 = 0, $call53 = 0, $call60 = 0, $call74 = 0, $chName48 = 0, $chName52 = 0, $chName8 = 0, $cmp = 0, $cmp14 = 0, $cmp3 = 0, $cmp58 = 0;
 var $cmp6 = 0, $cmp619 = 0, $cmp75 = 0, $cmp82 = 0, $cmp88 = 0, $cmp9 = 0, $dwNum = 0, $fAlpha33 = 0, $fAlpha37 = 0, $i$018 = 0, $inc = 0, $inc80 = 0, $inc96 = 0, $mul = 0, $mul69 = 0, $nTex$020 = 0, $or$cond = 0, $pClrKeys = 0, $pClrKeys64 = 0, $pClrKeys68 = 0;
 var $rem = 0, $retval$0 = 0, $tobool21 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = HEAP32[$this>>2]|0;
 $cmp = ($0>>>0)>($nSkinID>>>0);
 if (!($cmp)) {
  $retval$0 = -2;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_pSkins = (($this) + 12|0);
 $1 = HEAP32[$_pSkins>>2]|0;
 $arrayidx2 = ((($1) + (($nSkinID*40)|0)|0) + 36|0);
 $2 = HEAP32[$arrayidx2>>2]|0;
 $cmp3 = ($2|0)==(65535);
 if (!($cmp3)) {
  __ZN14REMSkinManager3logEPcz(0,744,$vararg_buffer);
  $retval$0 = -3;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_nNumTextures = (($this) + 8|0);
 $3 = HEAP32[$_nNumTextures>>2]|0;
 $cmp619 = ($3|0)==(0);
 if ($cmp619) {
  $7 = 0;
  label = 8;
 } else {
  $_pTextures = (($this) + 20|0);
  $4 = HEAP32[$_pTextures>>2]|0;
  $nTex$020 = 0;
  while(1) {
   $chName8 = ((($4) + (($nTex$020*20)|0)|0) + 4|0);
   $5 = HEAP32[$chName8>>2]|0;
   $call = (_strcmp($chName,$5)|0);
   $cmp9 = ($call|0)!=(0);
   $inc = (($nTex$020) + 1)|0;
   $cmp6 = ($inc>>>0)<($3>>>0);
   $or$cond = $cmp9 & $cmp6;
   if ($or$cond) {
    $nTex$020 = $inc;
   } else {
    break;
   }
  }
  $rem = (($3>>>0) % 50)&-1;
  $cmp14 = ($rem|0)==(0);
  if ($cmp14) {
   $7 = $3;
   label = 8;
  }
 }
 if ((label|0) == 8) {
  $6 = ($7*20)|0;
  $mul = (($6) + 1000)|0;
  $_pTextures17 = (($this) + 20|0);
  $8 = HEAP32[$_pTextures17>>2]|0;
  $call18 = (_realloc($8,$mul)|0);
  HEAP32[$_pTextures17>>2] = $call18;
  $tobool21 = ($call18|0)==(0|0);
  if ($tobool21) {
   $retval$0 = -1;
   STACKTOP = sp;return ($retval$0|0);
  }
 }
 if ($bAlpha) {
  $9 = HEAP32[$_pSkins>>2]|0;
  $bAlpha29 = (($9) + (($nSkinID*40)|0)|0);
  HEAP8[$bAlpha29>>0] = 1;
  $10 = HEAP32[$_nNumTextures>>2]|0;
  $_pTextures31 = (($this) + 20|0);
  $11 = HEAP32[$_pTextures31>>2]|0;
  $fAlpha33 = (($11) + (($10*20)|0)|0);
  HEAPF32[$fAlpha33>>2] = $fAlpha;
  $14 = $11;$15 = $10;
 } else {
  $12 = HEAP32[$_nNumTextures>>2]|0;
  $_pTextures35 = (($this) + 20|0);
  $13 = HEAP32[$_pTextures35>>2]|0;
  $fAlpha37 = (($13) + (($12*20)|0)|0);
  HEAPF32[$fAlpha37>>2] = 1.0;
  $14 = $13;$15 = $12;
 }
 $_pTextures40 = (($this) + 20|0);
 $pClrKeys = ((($14) + (($15*20)|0)|0) + 12|0);
 HEAP32[$pClrKeys>>2] = 0;
 $call42 = (_strlen(($chName|0))|0);
 $add43 = (($call42) + 1)|0;
 $call44 = (__Znaj($add43)|0);
 $16 = HEAP32[$_pTextures40>>2]|0;
 $chName48 = ((($16) + (($15*20)|0)|0) + 4|0);
 HEAP32[$chName48>>2] = $call44;
 $17 = HEAP32[$_pTextures40>>2]|0;
 $chName52 = ((($17) + (($15*20)|0)|0) + 4|0);
 $18 = HEAP32[$chName52>>2]|0;
 $call53 = (_strlen(($chName|0))|0);
 $add54 = (($call53) + 1)|0;
 _memcpy(($18|0),($chName|0),($add54|0))|0;
 $19 = HEAP32[$_nNumTextures>>2]|0;
 $20 = HEAP32[$_pTextures40>>2]|0;
 $dwNum = ((($20) + (($19*20)|0)|0) + 16|0);
 HEAP32[$dwNum>>2] = $dwNumColourKeys;
 $cmp58 = ($dwNumColourKeys|0)==(0);
 if ($cmp58) {
  $26 = $20;
 } else {
  $$arith = $dwNumColourKeys<<4;
  $$overflow = ($dwNumColourKeys>>>0)>(268435455);
  $21 = $$overflow ? -1 : $$arith;
  $call60 = (__Znaj($21)|0);
  $22 = HEAP32[$_nNumTextures>>2]|0;
  $pClrKeys64 = ((($20) + (($22*20)|0)|0) + 12|0);
  HEAP32[$pClrKeys64>>2] = $call60;
  $23 = HEAP32[$_pTextures40>>2]|0;
  $pClrKeys68 = ((($23) + (($22*20)|0)|0) + 12|0);
  $24 = HEAP32[$pClrKeys68>>2]|0;
  $mul69 = $dwNumColourKeys << 4;
  _memcpy(($24|0),($cColourKeys|0),($mul69|0))|0;
  $$pre = HEAP32[$_pTextures40>>2]|0;
  $26 = $$pre;
 }
 $25 = HEAP32[$_nNumTextures>>2]|0;
 $arrayidx73 = (($26) + (($25*20)|0)|0);
 $call74 = (__ZN14REMSkinManager13createTextureEP15REMTEXTURE_TYPEb(0,$arrayidx73,0)|0);
 $cmp75 = ($call74|0)<(0);
 if ($cmp75) {
  $retval$0 = $call74;
  STACKTOP = sp;return ($retval$0|0);
 }
 $27 = HEAP32[$_nNumTextures>>2]|0;
 $inc80 = (($27) + 1)|0;
 HEAP32[$_nNumTextures>>2] = $inc80;
 $28 = HEAP32[$_pSkins>>2]|0;
 $i$018 = 0;
 while(1) {
  $arrayidx87 = (((($28) + (($nSkinID*40)|0)|0) + ($i$018<<2)|0) + 8|0);
  $29 = HEAP32[$arrayidx87>>2]|0;
  $cmp88 = ($29|0)==(65535);
  $inc96 = (($i$018) + 1)|0;
  if ($cmp88) {
   break;
  }
  $cmp82 = ($inc96|0)<(8);
  if ($cmp82) {
   $i$018 = $inc96;
  } else {
   $retval$0 = 0;
   label = 19;
   break;
  }
 }
 if ((label|0) == 19) {
  STACKTOP = sp;return ($retval$0|0);
 }
 HEAP32[$arrayidx87>>2] = $27;
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN14REMSkinManager13createTextureEP15REMTEXTURE_TYPEb($this,$pTexture,$bAlpha) {
 $this = $this|0;
 $pTexture = $pTexture|0;
 $bAlpha = $bAlpha|0;
 var $$ = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0.0, $5 = 0.0, $6 = 0.0, $7 = 0.0, $8 = 0.0, $9 = 0, $call = 0, $call14 = 0, $call31 = 0;
 var $chName = 0, $cmp = 0, $cmp15 = 0, $cmp17 = 0, $cmp23 = 0, $cmp26 = 0, $cmp28 = 0, $cmp35 = 0, $conv = 0, $conv13 = 0, $conv5 = 0, $conv9 = 0, $dw$027 = 0, $dwNum = 0, $fA = 0, $fB = 0, $fG = 0, $fR = 0, $format = 0, $height = 0;
 var $hr$0$lcssa = 0, $inc = 0, $mul = 0.0, $mul12 = 0.0, $mul4 = 0.0, $mul8 = 0.0, $pClrKeys = 0, $pData = 0, $pData32 = 0, $retval$0 = 0, $texID = 0, $type = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $texID = sp;
 $chName = (($pTexture) + 4|0);
 $0 = HEAP32[$chName>>2]|0;
 $call = (__Z15rawImageFromBMPPKc($0)|0);
 if ($bAlpha) {
  $dwNum = (($pTexture) + 16|0);
  $1 = HEAP32[$dwNum>>2]|0;
  $cmp26 = ($1|0)==(0);
  L3: do {
   if ($cmp26) {
    $hr$0$lcssa = 0;
   } else {
    $pClrKeys = (($pTexture) + 12|0);
    $dw$027 = 0;
    while(1) {
     $3 = HEAP32[$pClrKeys>>2]|0;
     $fR = (($3) + ($dw$027<<4)|0);
     $4 = +HEAPF32[$fR>>2];
     $mul = $4 * 255.0;
     $conv = (~~(($mul))&255);
     $fG = ((($3) + ($dw$027<<4)|0) + 4|0);
     $5 = +HEAPF32[$fG>>2];
     $mul4 = $5 * 255.0;
     $conv5 = (~~(($mul4))&255);
     $fB = ((($3) + ($dw$027<<4)|0) + 8|0);
     $6 = +HEAPF32[$fB>>2];
     $mul8 = $6 * 255.0;
     $conv9 = (~~(($mul8))&255);
     $fA = ((($3) + ($dw$027<<4)|0) + 12|0);
     $7 = +HEAPF32[$fA>>2];
     $mul12 = $7 * 255.0;
     $conv13 = (~~(($mul12))&255);
     $call14 = (__Z14setAlphaKeyRawP16REMRAWIMAGE_TYPEhhhh($call,$conv,$conv5,$conv9,$conv13)|0);
     $cmp15 = ($call14|0)<(0);
     $inc = (($dw$027) + 1)|0;
     if ($cmp15) {
      $retval$0 = $call14;
      break;
     }
     $2 = HEAP32[$dwNum>>2]|0;
     $cmp = ($inc>>>0)<($2>>>0);
     if ($cmp) {
      $dw$027 = $inc;
     } else {
      $hr$0$lcssa = $call14;
      break L3;
     }
    }
    STACKTOP = sp;return ($retval$0|0);
   }
  } while(0);
  $8 = +HEAPF32[$pTexture>>2];
  $cmp17 = $8 < 1.0;
  if ($cmp17) {
   $cmp23 = ($hr$0$lcssa|0)<(0);
   if ($cmp23) {
    $retval$0 = $hr$0$lcssa;
    STACKTOP = sp;return ($retval$0|0);
   }
  }
 }
 _glGenTextures(1,($texID|0));
 $9 = HEAP32[$texID>>2]|0;
 $cmp28 = ($9|0)==(0);
 if ($cmp28) {
  $retval$0 = -4;
  STACKTOP = sp;return ($retval$0|0);
 }
 _glBindTexture(3553,($9|0));
 $format = (($call) + 8|0);
 $10 = HEAP32[$format>>2]|0;
 $11 = HEAP32[$call>>2]|0;
 $height = (($call) + 4|0);
 $12 = HEAP32[$height>>2]|0;
 $type = (($call) + 12|0);
 $13 = HEAP32[$type>>2]|0;
 $pData = (($call) + 16|0);
 $14 = HEAP32[$pData>>2]|0;
 _glTexImage2D(3553,0,($10|0),($11|0),($12|0),0,6408,($13|0),($14|0));
 _glTexParameteri(3553,10241,9987);
 _glTexParameteri(3553,10240,9729);
 _glGenerateMipmap(3553);
 _glBindTexture(3553,0);
 $call31 = (__Znaj(4)|0);
 $pData32 = (($pTexture) + 8|0);
 HEAP32[$pData32>>2] = $call31;
 $15 = HEAP8[$texID>>0]|0;
 HEAP8[$call31>>0] = $15;
 $cmp35 = ($call31|0)==(0|0);
 $$ = $cmp35 << 31 >> 31;
 $retval$0 = $$;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN21REMVertexCacheManagerC2EP15REMRenderDevicejj($this,$r,$nMaxVerts,$nMaxIndis) {
 $this = $this|0;
 $r = $r|0;
 $nMaxVerts = $nMaxVerts|0;
 $nMaxIndis = $nMaxIndis|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_dwActiveB = 0, $_dwActiveCache = 0, $_dwID$i = 0, $_dwID$i22 = 0, $_nNumB = 0;
 var $_nNumIndis$i = 0, $_nNumIndis$i21 = 0, $_nNumIndisMax$i = 0, $_nNumIndisMax$i19 = 0, $_nNumVerts$i = 0, $_nNumVerts$i20 = 0, $_nNumVertsMax$i = 0, $_nNumVertsMax$i18 = 0, $_nStride$i = 0, $_nStride$i23 = 0, $_pB = 0, $_pInD$i = 0, $_pInD$i30 = 0, $_pSkinMan$i = 0, $_pSkinMan$i15 = 0, $_pVCM$i = 0, $_pVCM$i17 = 0, $_pVD$i = 0, $_pVD$i28 = 0, $_renderDevice = 0;
 var $_skinID$i = 0, $_skinID$i24 = 0, $_vertexFormat$i = 0, $_vertexFormat$i16 = 0, $arrayidx = 0, $arrayidx11 = 0, $arrayinit$element$i = 0, $arrayinit$element$i14 = 0, $call = 0, $call$i = 0, $call$i27 = 0, $call16$i = 0, $call16$i29 = 0, $call2 = 0, $call4 = 0, $call7 = 0, $cmp = 0, $ehselector$slot$0 = 0, $exn$slot$0 = 0, $i$039 = 0;
 var $inc12 = 0, $indvars$iv = 0, $indvars$iv$next = 0, $mul$i = 0, $mul13$i = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $_renderDevice = (($this) + 4|0);
 HEAP32[$_renderDevice>>2] = $r;
 $_pB = (($this) + 8|0);
 HEAP32[$_pB>>2] = 0;
 $_nNumB = (($this) + 12|0);
 HEAP32[$_nNumB>>2] = 0;
 $_dwActiveCache = (($this) + 416|0);
 HEAP16[$_dwActiveCache>>1] = -1;
 $_dwActiveB = (($this) + 418|0);
 HEAP16[$_dwActiveB>>1] = -1;
 __ZN21REMVertexCacheManager3logEPcz(0,816,$vararg_buffer);
 $mul$i = ($nMaxVerts*36)|0;
 $mul13$i = $nMaxIndis << 1;
 $i$039 = 0;$indvars$iv = 1;
 while(1) {
  $call = (__Znwj(96)|0);
  __THREW__ = 0;
  $call2 = (invoke_ii(22,($r|0))|0);
  $0 = __THREW__; __THREW__ = 0;
  $1 = $0&1;
  if ($1) {
   label = 15;
   break;
  }
  $2 = (($indvars$iv) + 1)|0;
  HEAP32[$call>>2] = -1;
  $arrayinit$element$i = (($call) + 4|0);
  HEAP32[$arrayinit$element$i>>2] = -1;
  $_pSkinMan$i = (($call) + 20|0);
  HEAP32[$_pSkinMan$i>>2] = $call2;
  $_vertexFormat$i = (($call) + 12|0);
  HEAP32[$_vertexFormat$i>>2] = 0;
  $_pVCM$i = (($call) + 24|0);
  HEAP32[$_pVCM$i>>2] = $this;
  $_nNumVertsMax$i = (($call) + 76|0);
  HEAP32[$_nNumVertsMax$i>>2] = $nMaxVerts;
  $_nNumIndisMax$i = (($call) + 80|0);
  HEAP32[$_nNumIndisMax$i>>2] = $nMaxIndis;
  $_nNumVerts$i = (($call) + 84|0);
  HEAP32[$_nNumVerts$i>>2] = 0;
  $_nNumIndis$i = (($call) + 88|0);
  HEAP32[$_nNumIndis$i>>2] = 0;
  $_dwID$i = (($call) + 72|0);
  HEAP32[$_dwID$i>>2] = $indvars$iv;
  $_nStride$i = (($call) + 92|0);
  HEAP32[$_nStride$i>>2] = 36;
  $3 = (($call) + 28|0);
  dest=$3+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=4294967295|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
  $_skinID$i = (($call) + 68|0);
  HEAP32[$_skinID$i>>2] = 65535;
  __THREW__ = 0;
  invoke_vii(23,2,($call|0));
  $4 = __THREW__; __THREW__ = 0;
  $5 = $4&1;
  if ($5) {
   label = 15;
   break;
  }
  $6 = HEAP32[$call>>2]|0;
  __THREW__ = 0;
  invoke_vii(24,34962,($6|0));
  $7 = __THREW__; __THREW__ = 0;
  $8 = $7&1;
  if ($8) {
   label = 15;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(25,34962,($mul$i|0),(0|0),35048);
  $9 = __THREW__; __THREW__ = 0;
  $10 = $9&1;
  if ($10) {
   label = 15;
   break;
  }
  $11 = HEAP32[$arrayinit$element$i>>2]|0;
  __THREW__ = 0;
  invoke_vii(24,34963,($11|0));
  $12 = __THREW__; __THREW__ = 0;
  $13 = $12&1;
  if ($13) {
   label = 15;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(25,34963,($mul13$i|0),(0|0),35048);
  $14 = __THREW__; __THREW__ = 0;
  $15 = $14&1;
  if ($15) {
   label = 15;
   break;
  }
  $call$i = (_malloc($mul$i)|0);
  $_pVD$i = (($call) + 8|0);
  HEAP32[$_pVD$i>>2] = $call$i;
  $call16$i = (_malloc($mul13$i)|0);
  $_pInD$i = (($call) + 16|0);
  HEAP32[$_pInD$i>>2] = $call16$i;
  $arrayidx = ((($this) + ($i$039<<2)|0) + 16|0);
  HEAP32[$arrayidx>>2] = $call;
  $call4 = (__Znwj(96)|0);
  __THREW__ = 0;
  $call7 = (invoke_ii(22,($r|0))|0);
  $16 = __THREW__; __THREW__ = 0;
  $17 = $16&1;
  if ($17) {
   label = 16;
   break;
  }
  HEAP32[$call4>>2] = -1;
  $arrayinit$element$i14 = (($call4) + 4|0);
  HEAP32[$arrayinit$element$i14>>2] = -1;
  $_pSkinMan$i15 = (($call4) + 20|0);
  HEAP32[$_pSkinMan$i15>>2] = $call7;
  $_vertexFormat$i16 = (($call4) + 12|0);
  HEAP32[$_vertexFormat$i16>>2] = 1;
  $_pVCM$i17 = (($call4) + 24|0);
  HEAP32[$_pVCM$i17>>2] = $this;
  $_nNumVertsMax$i18 = (($call4) + 76|0);
  HEAP32[$_nNumVertsMax$i18>>2] = $nMaxVerts;
  $_nNumIndisMax$i19 = (($call4) + 80|0);
  HEAP32[$_nNumIndisMax$i19>>2] = $nMaxIndis;
  $_nNumVerts$i20 = (($call4) + 84|0);
  HEAP32[$_nNumVerts$i20>>2] = 0;
  $_nNumIndis$i21 = (($call4) + 88|0);
  HEAP32[$_nNumIndis$i21>>2] = 0;
  $_dwID$i22 = (($call4) + 72|0);
  HEAP32[$_dwID$i22>>2] = $2;
  $_nStride$i23 = (($call4) + 92|0);
  HEAP32[$_nStride$i23>>2] = 36;
  $18 = (($call4) + 28|0);
  dest=$18+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=4294967295|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
  $_skinID$i24 = (($call4) + 68|0);
  HEAP32[$_skinID$i24>>2] = 65535;
  __THREW__ = 0;
  invoke_vii(23,2,($call4|0));
  $19 = __THREW__; __THREW__ = 0;
  $20 = $19&1;
  if ($20) {
   label = 16;
   break;
  }
  $21 = HEAP32[$call4>>2]|0;
  __THREW__ = 0;
  invoke_vii(24,34962,($21|0));
  $22 = __THREW__; __THREW__ = 0;
  $23 = $22&1;
  if ($23) {
   label = 16;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(25,34962,($mul$i|0),(0|0),35048);
  $24 = __THREW__; __THREW__ = 0;
  $25 = $24&1;
  if ($25) {
   label = 16;
   break;
  }
  $26 = HEAP32[$arrayinit$element$i14>>2]|0;
  __THREW__ = 0;
  invoke_vii(24,34963,($26|0));
  $27 = __THREW__; __THREW__ = 0;
  $28 = $27&1;
  if ($28) {
   label = 16;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(25,34963,($mul13$i|0),(0|0),35048);
  $29 = __THREW__; __THREW__ = 0;
  $30 = $29&1;
  if ($30) {
   label = 16;
   break;
  }
  $call$i27 = (_malloc($mul$i)|0);
  $_pVD$i28 = (($call4) + 8|0);
  HEAP32[$_pVD$i28>>2] = $call$i27;
  $call16$i29 = (_malloc($mul13$i)|0);
  $_pInD$i30 = (($call4) + 16|0);
  HEAP32[$_pInD$i30>>2] = $call16$i29;
  $indvars$iv$next = (($indvars$iv) + 2)|0;
  $arrayidx11 = ((($this) + ($i$039<<2)|0) + 216|0);
  HEAP32[$arrayidx11>>2] = $call4;
  $inc12 = (($i$039) + 1)|0;
  $cmp = ($inc12|0)<(50);
  if ($cmp) {
   $i$039 = $inc12;$indvars$iv = $indvars$iv$next;
  } else {
   label = 17;
   break;
  }
 }
 if ((label|0) == 15) {
  $31 = ___cxa_find_matching_catch()|0;
  $32 = tempRet0;
  __ZdlPv($call);
  $ehselector$slot$0 = $32;$exn$slot$0 = $31;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 else if ((label|0) == 16) {
  $33 = ___cxa_find_matching_catch()|0;
  $34 = tempRet0;
  __ZdlPv($call4);
  $ehselector$slot$0 = $34;$exn$slot$0 = $33;
  ___resumeException($exn$slot$0|0);
  // unreachable;
 }
 else if ((label|0) == 17) {
  __ZN21REMVertexCacheManager3logEPcz(0,848,$vararg_buffer1);
  STACKTOP = sp;return;
 }
}
function __ZN21REMVertexCacheManager3logEPcz($this,$chString,$varargs) {
 $this = $this|0;
 $chString = $chString|0;
 $varargs = $varargs|0;
 var $args = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $args = sp + 8|0;
 HEAP32[$args>>2] = $varargs;
 (_printf((856|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN21REMVertexCacheManager6renderE14REMVERTEX_TYPEjjjPvPKt($this,$vertexFormat,$skinID,$nVerts,$nIndis,$pVerts,$pIndis) {
 $this = $this|0;
 $vertexFormat = $vertexFormat|0;
 $skinID = $skinID|0;
 $nVerts = $nVerts|0;
 $nIndis = $nIndis|0;
 $pVerts = $pVerts|0;
 $pIndis = $pIndis|0;
 var $$pCacheEmpty$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_dwActiveB = 0, $_dwActiveCache$i$i = 0, $_dwActiveCache$i$i39 = 0, $_nNumVerts$i = 0, $_nNumVerts$i$i = 0;
 var $_nNumVerts$i$i33 = 0, $_nNumVerts$i28 = 0, $_pSkinMan$i = 0, $_pSkinMan$i32 = 0, $_pVCM$i = 0, $_pVCM$i38 = 0, $_skinID$i = 0, $_skinID$i$i = 0, $_skinID$i$i30 = 0, $arraydecay = 0, $arraydecay3 = 0, $arrayidx = 0, $call19 = 0, $call22 = 0, $call5 = 0, $cmp = 0, $cmp$i = 0, $cmp$i$i = 0, $cmp$i$i31 = 0, $cmp$i26 = 0;
 var $cmp$i3$i = 0, $cmp$i3$i34 = 0, $cmp14 = 0, $i$048 = 0, $inc = 0, $pCache$0 = 0, $pCacheEmpty$046 = 0, $pCacheFullest$047 = 0, $pCacheFullest$1 = 0, $retval$0 = 0, $tmpSkin$i = 0, $tmpSkin$i29 = 0, $tobool = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 80|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $tmpSkin$i29 = sp + 40|0;
 $tmpSkin$i = sp;
 if ((($vertexFormat|0) == 1)) {
  $arraydecay3 = (($this) + 216|0);
  $pCache$0 = $arraydecay3;
 } else if ((($vertexFormat|0) == 0)) {
  $arraydecay = (($this) + 16|0);
  $pCache$0 = $arraydecay;
 } else {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_dwActiveB = (($this) + 418|0);
 HEAP16[$_dwActiveB>>1] = -1;
 $i$048 = 0;$pCacheEmpty$046 = 0;$pCacheFullest$047 = 0;
 while(1) {
  $arrayidx = (($pCache$0) + ($i$048<<2)|0);
  $0 = HEAP32[$arrayidx>>2]|0;
  $_skinID$i = (($0) + 68|0);
  $1 = HEAP32[$_skinID$i>>2]|0;
  $cmp$i = ($1|0)==($skinID|0);
  if ($cmp$i) {
   label = 6;
   break;
  }
  $_nNumVerts$i = (($0) + 84|0);
  $2 = HEAP32[$_nNumVerts$i>>2]|0;
  $cmp$i26 = ($2|0)==(0);
  $$pCacheEmpty$0 = $cmp$i26 ? $0 : $pCacheEmpty$046;
  $_nNumVerts$i28 = (($pCacheFullest$047) + 84|0);
  $3 = HEAP32[$_nNumVerts$i28>>2]|0;
  $cmp14 = ($2|0)>($3|0);
  $pCacheFullest$1 = $cmp14 ? $0 : $pCacheFullest$047;
  $inc = (($i$048) + 1)|0;
  $cmp = ($inc|0)<(50);
  if ($cmp) {
   $i$048 = $inc;$pCacheEmpty$046 = $$pCacheEmpty$0;$pCacheFullest$047 = $pCacheFullest$1;
  } else {
   break;
  }
 }
 if ((label|0) == 6) {
  $call5 = (__ZN14REMVertexCache3addEjjPvPKt($0,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $retval$0 = $call5;
  STACKTOP = sp;return ($retval$0|0);
 }
 $tobool = ($$pCacheEmpty$0|0)==(0|0);
 if ($tobool) {
  (__ZN14REMVertexCache5flushEv($pCacheFullest$1)|0);
  $_skinID$i$i = (($pCacheFullest$1) + 68|0);
  $9 = HEAP32[$_skinID$i$i>>2]|0;
  $cmp$i$i = ($9|0)==($skinID|0);
  if (!($cmp$i$i)) {
   $_pSkinMan$i = (($pCacheFullest$1) + 20|0);
   $10 = HEAP32[$_pSkinMan$i>>2]|0;
   __ZN14REMSkinManager7getSkinEj($tmpSkin$i,$10,$skinID);
   $_nNumVerts$i$i = (($pCacheFullest$1) + 84|0);
   $11 = HEAP32[$_nNumVerts$i$i>>2]|0;
   $cmp$i3$i = ($11|0)==(0);
   if (!($cmp$i3$i)) {
    (__ZN14REMVertexCache5flushEv($pCacheFullest$1)|0);
   }
   $12 = (($pCacheFullest$1) + 28|0);
   dest=$12+0|0; src=$tmpSkin$i+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
   HEAP32[$_skinID$i$i>>2] = $skinID;
   $_pVCM$i = (($pCacheFullest$1) + 24|0);
   $13 = HEAP32[$_pVCM$i>>2]|0;
   $_dwActiveCache$i$i = (($13) + 416|0);
   HEAP16[$_dwActiveCache$i$i>>1] = -1;
  }
  $call22 = (__ZN14REMVertexCache3addEjjPvPKt($pCacheFullest$1,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $retval$0 = $call22;
  STACKTOP = sp;return ($retval$0|0);
 } else {
  $_skinID$i$i30 = (($$pCacheEmpty$0) + 68|0);
  $4 = HEAP32[$_skinID$i$i30>>2]|0;
  $cmp$i$i31 = ($4|0)==($skinID|0);
  if (!($cmp$i$i31)) {
   $_pSkinMan$i32 = (($$pCacheEmpty$0) + 20|0);
   $5 = HEAP32[$_pSkinMan$i32>>2]|0;
   __ZN14REMSkinManager7getSkinEj($tmpSkin$i29,$5,$skinID);
   $_nNumVerts$i$i33 = (($$pCacheEmpty$0) + 84|0);
   $6 = HEAP32[$_nNumVerts$i$i33>>2]|0;
   $cmp$i3$i34 = ($6|0)==(0);
   if (!($cmp$i3$i34)) {
    (__ZN14REMVertexCache5flushEv($$pCacheEmpty$0)|0);
   }
   $7 = (($$pCacheEmpty$0) + 28|0);
   dest=$7+0|0; src=$tmpSkin$i29+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
   HEAP32[$_skinID$i$i30>>2] = $skinID;
   $_pVCM$i38 = (($$pCacheEmpty$0) + 24|0);
   $8 = HEAP32[$_pVCM$i38>>2]|0;
   $_dwActiveCache$i$i39 = (($8) + 416|0);
   HEAP16[$_dwActiveCache$i$i39>>1] = -1;
  }
  $call19 = (__ZN14REMVertexCache3addEjjPvPKt($$pCacheEmpty$0,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $retval$0 = $call19;
  STACKTOP = sp;return ($retval$0|0);
 }
 return 0|0;
}
function __ZN14REMVertexCache3addEjjPvPKt($this,$nVerts,$nIndis,$pVerts,$pIndices) {
 $this = $this|0;
 $nVerts = $nVerts|0;
 $nIndis = $nIndis|0;
 $pVerts = $pVerts|0;
 $pIndices = $pIndices|0;
 var $$pre = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $_nNumIndis = 0, $_nNumIndis21 = 0, $_nNumIndis41 = 0, $_nNumIndis41$promoted = 0, $_nNumIndisMax = 0, $_nNumVerts = 0;
 var $_nNumVertsMax = 0, $_nStride = 0, $_pInD = 0, $_pVD = 0, $add = 0, $add$ptr = 0, $add30$us = 0, $add32$us = 0, $add35 = 0, $add37 = 0, $add44 = 0, $add7 = 0, $arrayidx$us = 0, $arrayidx33$us = 0, $arrayidx39 = 0, $call = 0, $cmp = 0, $cmp11 = 0, $cmp16 = 0, $cmp2716 = 0;
 var $cmp3 = 0, $cmp5 = 0, $cmp9 = 0, $conv$us = 0, $conv31$us = 0, $conv36 = 0, $exitcond = 0, $exitcond20 = 0, $i$017 = 0, $i$017$us = 0, $inc$lcssa = 0, $inc42 = 0, $inc42$us = 0, $mul = 0, $mul20 = 0, $mul22 = 0, $nIndis$nVerts = 0, $nPosI$0 = 0, $nPosV$0 = 0, $retval$0 = 0;
 var $tobool = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $_nStride = (($this) + 92|0);
 $0 = HEAP32[$_nStride>>2]|0;
 $mul = Math_imul($0, $nVerts)|0;
 $_nNumVertsMax = (($this) + 76|0);
 $1 = HEAP32[$_nNumVertsMax>>2]|0;
 $cmp = ($1>>>0)<($nVerts>>>0);
 if ($cmp) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_nNumIndisMax = (($this) + 80|0);
 $2 = HEAP32[$_nNumIndisMax>>2]|0;
 $cmp3 = ($2>>>0)<($nIndis>>>0);
 if ($cmp3) {
  $retval$0 = -1;
  STACKTOP = sp;return ($retval$0|0);
 }
 $_nNumVerts = (($this) + 84|0);
 $3 = HEAP32[$_nNumVerts>>2]|0;
 $add = (($3) + ($nVerts))|0;
 $cmp5 = ($add>>>0)>($1>>>0);
 if ($cmp5) {
  label = 5;
 } else {
  $_nNumIndis = (($this) + 88|0);
  $4 = HEAP32[$_nNumIndis>>2]|0;
  $add7 = (($4) + ($nIndis))|0;
  $cmp9 = ($add7>>>0)>($2>>>0);
  if ($cmp9) {
   label = 5;
  } else {
   $5 = $3;
  }
 }
 do {
  if ((label|0) == 5) {
   $call = (__ZN14REMVertexCache5flushEv($this)|0);
   $cmp11 = ($call|0)==(0);
   if ($cmp11) {
    $$pre = HEAP32[$_nNumVerts>>2]|0;
    $5 = $$pre;
    break;
   } else {
    $retval$0 = -1;
    STACKTOP = sp;return ($retval$0|0);
   }
  }
 } while(0);
 $cmp16 = ($5|0)==(0);
 if ($cmp16) {
  $nPosI$0 = 0;$nPosV$0 = 0;
 } else {
  $6 = HEAP32[$_nStride>>2]|0;
  $mul20 = Math_imul($6, $5)|0;
  $_nNumIndis21 = (($this) + 88|0);
  $7 = HEAP32[$_nNumIndis21>>2]|0;
  $mul22 = $7 << 1;
  $nPosI$0 = $mul22;$nPosV$0 = $mul20;
 }
 $_pVD = (($this) + 8|0);
 $8 = HEAP32[$_pVD>>2]|0;
 $add$ptr = (($8) + ($nPosV$0)|0);
 _memcpy(($add$ptr|0),($pVerts|0),($mul|0))|0;
 $9 = HEAP32[$_nNumVerts>>2]|0;
 $tobool = ($pIndices|0)!=(0|0);
 $nIndis$nVerts = $tobool ? $nIndis : $nVerts;
 $cmp2716 = ($nIndis$nVerts|0)==(0);
 if (!($cmp2716)) {
  $_pInD = (($this) + 16|0);
  $_nNumIndis41 = (($this) + 88|0);
  $_nNumIndis41$promoted = HEAP32[$_nNumIndis41>>2]|0;
  if ($tobool) {
   $i$017$us = 0;
   while(1) {
    $arrayidx$us = (($pIndices) + ($i$017$us<<1)|0);
    $10 = HEAP16[$arrayidx$us>>1]|0;
    $conv$us = $10&65535;
    $add30$us = (($conv$us) + ($9))|0;
    $conv31$us = $add30$us&65535;
    $add32$us = (($i$017$us) + ($nPosI$0))|0;
    $11 = HEAP32[$_pInD>>2]|0;
    $arrayidx33$us = (($11) + ($add32$us<<1)|0);
    HEAP16[$arrayidx33$us>>1] = $conv31$us;
    $inc42$us = (($i$017$us) + 1)|0;
    $exitcond20 = ($inc42$us|0)==($nIndis$nVerts|0);
    if ($exitcond20) {
     break;
    } else {
     $i$017$us = $inc42$us;
    }
   }
  } else {
   $i$017 = 0;
   while(1) {
    $add35 = (($i$017) + ($9))|0;
    $conv36 = $add35&65535;
    $add37 = (($i$017) + ($nPosI$0))|0;
    $12 = HEAP32[$_pInD>>2]|0;
    $arrayidx39 = (($12) + ($add37<<1)|0);
    HEAP16[$arrayidx39>>1] = $conv36;
    $inc42 = (($i$017) + 1)|0;
    $exitcond = ($inc42|0)==($nIndis$nVerts|0);
    if ($exitcond) {
     break;
    } else {
     $i$017 = $inc42;
    }
   }
  }
  $inc$lcssa = (($nIndis$nVerts) + ($_nNumIndis41$promoted))|0;
  HEAP32[$_nNumIndis41>>2] = $inc$lcssa;
 }
 $add44 = (($9) + ($nVerts))|0;
 HEAP32[$_nNumVerts>>2] = $add44;
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN14REMVertexCache5flushEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0.0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, $_clrWire = 0, $_dwActiveCache$i = 0, $_dwActiveCache$i41 = 0, $_dwID = 0, $_nNumIndis = 0, $_nNumIndis102 = 0, $_nNumIndis108$pre = 0, $_nNumIndis108$pre$phiZ2D = 0, $_nNumIndis90 = 0, $_nNumIndis94 = 0, $_nNumIndis98 = 0, $_nNumVerts = 0, $_nStride = 0, $_pInD = 0, $_pMaterials = 0, $_pSkinMan = 0, $_pTextures = 0, $_pVCM = 0;
 var $_pVD = 0, $_renderDevice$i = 0, $_renderDevice$i36 = 0, $_renderDevice$i37 = 0, $_renderDevice$i38 = 0, $_renderDevice$i39 = 0, $_renderDevice$i40 = 0, $_skinID = 0, $_vertexFormat = 0, $add = 0, $arraydecay = 0, $arraydecay42 = 0, $arraydecay45 = 0, $arraydecay48 = 0, $arrayidx23 = 0, $arrayidx52 = 0, $call10 = 0, $call11 = 0, $call12 = 0, $call13 = 0;
 var $call15 = 0, $call16 = 0, $call17 = 0, $call18 = 0, $call19 = 0, $call2 = 0, $call20 = 0, $call3 = 0, $call30 = 0, $call36 = 0, $call39 = 0, $call40 = 0, $call43 = 0, $call46 = 0, $call49 = 0, $call61 = 0, $call66 = 0, $call69 = 0, $call72 = 0, $call75 = 0;
 var $call78 = 0, $call79 = 0, $call8 = 0, $call87 = 0, $call9 = 0, $clrWire = 0, $cmp = 0, $cmp31 = 0, $cmp37 = 0, $cmp50 = 0, $cmp53 = 0, $cmp6 = 0, $conv$i = 0, $conv$i42 = 0, $div = 0, $fA = 0, $fB = 0, $fG = 0, $fPower = 0, $i$043 = 0;
 var $inc = 0, $mul = 0, $mul24 = 0, $nMaterial = 0, $pData = 0, $retval$0 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $clrWire = sp + 8|0;
 $_pVCM = (($this) + 24|0);
 $0 = HEAP32[$_pVCM>>2]|0;
 $_renderDevice$i = (($0) + 4|0);
 $1 = HEAP32[$_renderDevice$i>>2]|0;
 $call2 = (__ZN15REMRenderDevice16getShaderManagerEv($1)|0);
 $call3 = (__ZN16REMShaderManager16getActiveProgramEv($call2)|0);
 $_nNumVerts = (($this) + 84|0);
 $2 = HEAP32[$_nNumVerts>>2]|0;
 $cmp = ($2|0)==(0);
 if ($cmp) {
  $retval$0 = 0;
  STACKTOP = sp;return ($retval$0|0);
 }
 $3 = HEAP32[$_pVCM>>2]|0;
 $_dwActiveCache$i41 = (($3) + 416|0);
 $4 = HEAP16[$_dwActiveCache$i41>>1]|0;
 $conv$i42 = $4&65535;
 $_dwID = (($this) + 72|0);
 $5 = HEAP32[$_dwID>>2]|0;
 $cmp6 = ($conv$i42|0)==($5|0);
 if ($cmp6) {
  $16 = $3;
 } else {
  $6 = HEAP32[$this>>2]|0;
  _glBindBuffer(34962,($6|0));
  $_vertexFormat = (($this) + 12|0);
  $7 = HEAP32[$_vertexFormat>>2]|0;
  if ((($7|0) == 0)) {
   $call8 = (_glGetAttribLocation(($call3|0),(880|0))|0);
   _glVertexAttribPointer(($call8|0),4,5126,0,36,(0|0));
   $call9 = (_glGetAttribLocation(($call3|0),(880|0))|0);
   _glEnableVertexAttribArray(($call9|0));
   $call10 = (_glGetAttribLocation(($call3|0),(896|0))|0);
   _glVertexAttribPointer(($call10|0),4,5126,0,36,((16)|0));
   $call11 = (_glGetAttribLocation(($call3|0),(896|0))|0);
   _glEnableVertexAttribArray(($call11|0));
   $call12 = (_glGetAttribLocation(($call3|0),(904|0))|0);
   _glVertexAttribPointer(($call12|0),2,5123,1,36,((32)|0));
   $call13 = (_glGetAttribLocation(($call3|0),(904|0))|0);
   _glEnableVertexAttribArray(($call13|0));
  } else if ((($7|0) == 1)) {
   $call15 = (_glGetAttribLocation(($call3|0),(880|0))|0);
   _glVertexAttribPointer(($call15|0),4,5126,0,36,(0|0));
   $call16 = (_glGetAttribLocation(($call3|0),(880|0))|0);
   _glEnableVertexAttribArray(($call16|0));
   $call17 = (_glGetAttribLocation(($call3|0),(920|0))|0);
   _glVertexAttribPointer(($call17|0),4,5126,0,36,((16)|0));
   $call18 = (_glGetAttribLocation(($call3|0),(920|0))|0);
   _glEnableVertexAttribArray(($call18|0));
   $call19 = (_glGetAttribLocation(($call3|0),(904|0))|0);
   _glVertexAttribPointer(($call19|0),2,5123,1,36,((32)|0));
   $call20 = (_glGetAttribLocation(($call3|0),(904|0))|0);
   _glEnableVertexAttribArray(($call20|0));
  } else {
   $retval$0 = -1;
   STACKTOP = sp;return ($retval$0|0);
  }
  $8 = HEAP32[$_nNumVerts>>2]|0;
  $_nStride = (($this) + 92|0);
  $9 = HEAP32[$_nStride>>2]|0;
  $mul = Math_imul($9, $8)|0;
  $_pVD = (($this) + 8|0);
  $10 = HEAP32[$_pVD>>2]|0;
  _glBufferSubData(34962,0,($mul|0),($10|0));
  $arrayidx23 = (($this) + 4|0);
  $11 = HEAP32[$arrayidx23>>2]|0;
  _glBindBuffer(34963,($11|0));
  $_nNumIndis = (($this) + 88|0);
  $12 = HEAP32[$_nNumIndis>>2]|0;
  $mul24 = $12 << 1;
  $_pInD = (($this) + 16|0);
  $13 = HEAP32[$_pInD>>2]|0;
  _glBufferSubData(34963,0,($mul24|0),($13|0));
  $14 = HEAP32[$_pVCM>>2]|0;
  $15 = HEAP32[$_dwID>>2]|0;
  $conv$i = $15&65535;
  $_dwActiveCache$i = (($14) + 416|0);
  HEAP16[$_dwActiveCache$i>>1] = $conv$i;
  $16 = $14;
 }
 $_renderDevice$i40 = (($16) + 4|0);
 $17 = HEAP32[$_renderDevice$i40>>2]|0;
 $call30 = (__ZN15REMRenderDevice15getActiveSkinIDEv($17)|0);
 $_skinID = (($this) + 68|0);
 $18 = HEAP32[$_skinID>>2]|0;
 $cmp31 = ($call30|0)==($18|0);
 if (!($cmp31)) {
  $nMaterial = (($this) + 32|0);
  $19 = HEAP32[$nMaterial>>2]|0;
  $_pSkinMan = (($this) + 20|0);
  $20 = HEAP32[$_pSkinMan>>2]|0;
  $_pMaterials = (($20) + 16|0);
  $21 = HEAP32[$_pMaterials>>2]|0;
  $22 = HEAP32[$_pVCM>>2]|0;
  $_renderDevice$i39 = (($22) + 4|0);
  $23 = HEAP32[$_renderDevice$i39>>2]|0;
  $call36 = (__ZN15REMRenderDevice12getShadeModeEv($23)|0);
  $cmp37 = ($call36|0)==(7);
  L14: do {
   if ($cmp37) {
    $31 = HEAP32[$_pVCM>>2]|0;
    $_renderDevice$i38 = (($31) + 4|0);
    $32 = HEAP32[$_renderDevice$i38>>2]|0;
    $_clrWire = (($32) + 1000|0);
    ;HEAP32[$clrWire+0>>2]=HEAP32[$_clrWire+0>>2]|0;HEAP32[$clrWire+4>>2]=HEAP32[$_clrWire+4>>2]|0;HEAP32[$clrWire+8>>2]=HEAP32[$_clrWire+8>>2]|0;HEAP32[$clrWire+12>>2]=HEAP32[$_clrWire+12>>2]|0;
    $call66 = (_glGetUniformLocation(($call3|0),(928|0))|0);
    _glUniform4fv(($call66|0),1,($clrWire|0));
    $call69 = (_glGetUniformLocation(($call3|0),(944|0))|0);
    _glUniform4fv(($call69|0),1,($clrWire|0));
    HEAPF32[$clrWire>>2] = 0.0;
    $fG = (($clrWire) + 4|0);
    HEAPF32[$fG>>2] = 0.0;
    $fB = (($clrWire) + 8|0);
    HEAPF32[$fB>>2] = 0.0;
    $fA = (($clrWire) + 12|0);
    HEAPF32[$fA>>2] = 1.0;
    $call72 = (_glGetUniformLocation(($call3|0),(960|0))|0);
    _glUniform4fv(($call72|0),1,($clrWire|0));
    $call75 = (_glGetUniformLocation(($call3|0),(976|0))|0);
    _glUniform4fv(($call75|0),1,($clrWire|0));
    $call78 = (_glGetUniformLocation(($call3|0),(992|0))|0);
    _glUniform1f(($call78|0),1.0);
    _glActiveTexture(33984);
    _glBindTexture(3553,0);
    $call79 = (_glGetUniformLocation(($call3|0),(1032|0))|0);
    _glUniform1i(($call79|0),0);
   } else {
    $call39 = (_glGetUniformLocation(($call3|0),(928|0))|0);
    $arraydecay = (($21) + (($19*68)|0)|0);
    _glUniform4fv(($call39|0),1,($arraydecay|0));
    $call40 = (_glGetUniformLocation(($call3|0),(944|0))|0);
    $arraydecay42 = ((($21) + (($19*68)|0)|0) + 16|0);
    _glUniform4fv(($call40|0),1,($arraydecay42|0));
    $call43 = (_glGetUniformLocation(($call3|0),(960|0))|0);
    $arraydecay45 = ((($21) + (($19*68)|0)|0) + 32|0);
    _glUniform4fv(($call43|0),1,($arraydecay45|0));
    $call46 = (_glGetUniformLocation(($call3|0),(976|0))|0);
    $arraydecay48 = ((($21) + (($19*68)|0)|0) + 48|0);
    _glUniform4fv(($call46|0),1,($arraydecay48|0));
    $call49 = (_glGetUniformLocation(($call3|0),(992|0))|0);
    $fPower = ((($21) + (($19*68)|0)|0) + 64|0);
    $24 = +HEAPF32[$fPower>>2];
    _glUniform1f(($call49|0),(+$24));
    $i$043 = 0;
    while(1) {
     $arrayidx52 = ((($this) + ($i$043<<2)|0) + 36|0);
     $25 = HEAP32[$arrayidx52>>2]|0;
     $cmp53 = ($25|0)==(65535);
     if ($cmp53) {
      break L14;
     }
     $26 = HEAP32[$_pSkinMan>>2]|0;
     $_pTextures = (($26) + 20|0);
     $27 = HEAP32[$_pTextures>>2]|0;
     $pData = ((($27) + (($25*20)|0)|0) + 8|0);
     $28 = HEAP32[$pData>>2]|0;
     $29 = HEAP32[$28>>2]|0;
     HEAP32[$vararg_buffer>>2] = $29;
     (_printf((1008|0),($vararg_buffer|0))|0);
     $add = (($i$043) + 33984)|0;
     _glActiveTexture(($add|0));
     $30 = HEAP32[$28>>2]|0;
     _glBindTexture(3553,($30|0));
     $call61 = (_glGetUniformLocation(($call3|0),(1032|0))|0);
     _glUniform1i(($call61|0),0);
     $inc = (($i$043) + 1)|0;
     $cmp50 = ($inc|0)<(8);
     if ($cmp50) {
      $i$043 = $inc;
     } else {
      break;
     }
    }
   }
  } while(0);
  _glBlendFunc(770,771);
  $33 = HEAP32[$_pVCM>>2]|0;
  $_renderDevice$i37 = (($33) + 4|0);
  $34 = HEAP32[$_renderDevice$i37>>2]|0;
  $35 = HEAP32[$_skinID>>2]|0;
  __ZN15REMRenderDevice15setActiveSkinIDEj($34,$35);
 }
 $36 = HEAP32[$_pVCM>>2]|0;
 $_renderDevice$i36 = (($36) + 4|0);
 $37 = HEAP32[$_renderDevice$i36>>2]|0;
 $call87 = (__ZN15REMRenderDevice12getShadeModeEv($37)|0);
 if ((($call87|0) == 6)) {
  $_nNumIndis90 = (($this) + 88|0);
  $38 = HEAP32[$_nNumIndis90>>2]|0;
  _glDrawElements(0,($38|0),5123,(0|0));
  $_nNumIndis108$pre$phiZ2D = $_nNumIndis90;
 } else if ((($call87|0) == 8)) {
  $_nNumIndis94 = (($this) + 88|0);
  $39 = HEAP32[$_nNumIndis94>>2]|0;
  _glDrawElements(3,($39|0),5123,(0|0));
  $_nNumIndis108$pre$phiZ2D = $_nNumIndis94;
 } else if ((($call87|0) == 9)) {
  $_nNumIndis98 = (($this) + 88|0);
  $40 = HEAP32[$_nNumIndis98>>2]|0;
  _glDrawElements(4,($40|0),5123,(0|0));
  $_nNumIndis108$pre$phiZ2D = $_nNumIndis98;
 } else if ((($call87|0) == 7)) {
  $_nNumIndis102 = (($this) + 88|0);
  $41 = HEAP32[$_nNumIndis102>>2]|0;
  $div = (($41>>>0) / 3)&-1;
  _glDrawElements(4,($div|0),5123,(0|0));
  $_nNumIndis108$pre$phiZ2D = $_nNumIndis102;
 } else {
  $_nNumIndis108$pre = (($this) + 88|0);
  $_nNumIndis108$pre$phiZ2D = $_nNumIndis108$pre;
 }
 HEAP32[$_nNumVerts>>2] = 0;
 HEAP32[$_nNumIndis108$pre$phiZ2D>>2] = 0;
 $retval$0 = 0;
 STACKTOP = sp;return ($retval$0|0);
}
function __ZN21REMVertexCacheManager14forcedFlushAllEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $_nNumVerts$i = 0, $_nNumVerts$i10 = 0, $arrayidx = 0, $arrayidx13 = 0, $call22 = 0, $call6 = 0, $cmp = 0, $cmp$i = 0, $cmp$i11 = 0, $cmp11 = 0, $cmp23 = 0, $cmp7 = 0, $i$014 = 0, $i$112 = 0, $inc = 0, $inc28 = 0;
 var $retval$0 = 0, $tobool = 0, $tobool14 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $i$014 = 0;
 while(1) {
  $arrayidx = ((($this) + ($i$014<<2)|0) + 16|0);
  $0 = HEAP32[$arrayidx>>2]|0;
  $tobool = ($0|0)==(0|0);
  if (!($tobool)) {
   $_nNumVerts$i = (($0) + 84|0);
   $1 = HEAP32[$_nNumVerts$i>>2]|0;
   $cmp$i = ($1|0)==(0);
   if (!($cmp$i)) {
    $call6 = (__ZN14REMVertexCache5flushEv($0)|0);
    $cmp7 = ($call6|0)<(0);
    if ($cmp7) {
     $retval$0 = -1;
     label = 10;
     break;
    }
   }
  }
  $inc = (($i$014) + 1)|0;
  $cmp = ($inc|0)<(50);
  if ($cmp) {
   $i$014 = $inc;
  } else {
   $i$112 = 0;
   break;
  }
 }
 if ((label|0) == 10) {
  STACKTOP = sp;return ($retval$0|0);
 }
 while(1) {
  $arrayidx13 = ((($this) + ($i$112<<2)|0) + 216|0);
  $2 = HEAP32[$arrayidx13>>2]|0;
  $tobool14 = ($2|0)==(0|0);
  if (!($tobool14)) {
   $_nNumVerts$i10 = (($2) + 84|0);
   $3 = HEAP32[$_nNumVerts$i10>>2]|0;
   $cmp$i11 = ($3|0)==(0);
   if (!($cmp$i11)) {
    $call22 = (__ZN14REMVertexCache5flushEv($2)|0);
    $cmp23 = ($call22|0)<(0);
    if ($cmp23) {
     $retval$0 = -1;
     label = 10;
     break;
    }
   }
  }
  $inc28 = (($i$112) + 1)|0;
  $cmp11 = ($inc28|0)<(50);
  if ($cmp11) {
   $i$112 = $inc28;
  } else {
   $retval$0 = 0;
   label = 10;
   break;
  }
 }
 if ((label|0) == 10) {
  STACKTOP = sp;return ($retval$0|0);
 }
 return 0|0;
}
function __Znwj($size) {
 $size = $size|0;
 var $$size = 0, $call = 0, $call$lcssa = 0, $call2 = 0, $call4 = 0, $cmp = 0, $cmp1 = 0, $cmp15 = 0, $exception = 0, $tobool = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $cmp = ($size|0)==(0);
 $$size = $cmp ? 1 : $size;
 $call4 = (_malloc($$size)|0);
 $cmp15 = ($call4|0)==(0|0);
 if (!($cmp15)) {
  $call$lcssa = $call4;
  STACKTOP = sp;return ($call$lcssa|0);
 }
 while(1) {
  $call2 = (__ZSt15get_new_handlerv()|0);
  $tobool = ($call2|0)==(0|0);
  if ($tobool) {
   label = 4;
   break;
  }
  FUNCTION_TABLE_v[$call2 & 31]();
  $call = (_malloc($$size)|0);
  $cmp1 = ($call|0)==(0|0);
  if (!($cmp1)) {
   $call$lcssa = $call;
   label = 5;
   break;
  }
 }
 if ((label|0) == 4) {
  $exception = (___cxa_allocate_exception(4)|0);
  HEAP32[$exception>>2] = ((1048 + 8|0));
  ___cxa_throw(($exception|0),(1104|0),(1|0));
  // unreachable;
 }
 else if ((label|0) == 5) {
  STACKTOP = sp;return ($call$lcssa|0);
 }
 return 0|0;
}
function __Znaj($size) {
 $size = $size|0;
 var $call = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $call = (__Znwj($size)|0);
 STACKTOP = sp;return ($call|0);
}
function __ZdlPv($ptr) {
 $ptr = $ptr|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _free($ptr);
 STACKTOP = sp;return;
}
function __ZNSt9bad_allocD0Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZdlPv($this);
 STACKTOP = sp;return;
}
function __ZNSt9bad_allocD2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZNKSt9bad_alloc4whatEv($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return (1072|0);
}
function __ZSt15get_new_handlerv() {
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[1120>>2]|0;HEAP32[1120>>2] = (($0+0)|0);
 $1 = $0;
 STACKTOP = sp;return ($1|0);
}
function __ZNSt9exceptionD2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZNSt9type_infoD2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZN10__cxxabiv116__shim_type_infoD2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv116__shim_type_info5noop1Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv116__shim_type_info5noop2Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return;
}
function __ZN10__cxxabiv117__class_type_infoD0Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZdlPv($this);
 STACKTOP = sp;return;
}
function __ZN10__cxxabiv120__si_class_type_infoD0Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZdlPv($this);
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv($this,$thrown_type,$adjustedPtr) {
 $this = $this|0;
 $thrown_type = $thrown_type|0;
 $adjustedPtr = $adjustedPtr|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $cmp = 0, $cmp$i = 0, $cmp4 = 0, $dst_ptr_leading_to_static_ptr = 0, $info = 0, $number_of_dst_type = 0, $path_dst_ptr_to_static_ptr = 0, $retval$1 = 0, $src2dst_offset = 0, $static_type = 0, $vfn = 0, $vtable = 0, dest = 0, label = 0;
 var sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $info = sp;
 $cmp$i = ($this|0)==($thrown_type|0);
 if ($cmp$i) {
  $retval$1 = 1;
  STACKTOP = sp;return ($retval$1|0);
 }
 $0 = ($thrown_type|0)==(0|0);
 if ($0) {
  $retval$1 = 0;
  STACKTOP = sp;return ($retval$1|0);
 }
 $1 = (___dynamic_cast($thrown_type,1216,1272,0)|0);
 $cmp = ($1|0)==(0|0);
 if ($cmp) {
  $retval$1 = 0;
  STACKTOP = sp;return ($retval$1|0);
 }
 dest=$info+0|0; stop=dest+56|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 HEAP32[$info>>2] = $1;
 $static_type = (($info) + 8|0);
 HEAP32[$static_type>>2] = $this;
 $src2dst_offset = (($info) + 12|0);
 HEAP32[$src2dst_offset>>2] = -1;
 $number_of_dst_type = (($info) + 48|0);
 HEAP32[$number_of_dst_type>>2] = 1;
 $vtable = HEAP32[$1>>2]|0;
 $vfn = (($vtable) + 28|0);
 $2 = HEAP32[$vfn>>2]|0;
 $3 = HEAP32[$adjustedPtr>>2]|0;
 FUNCTION_TABLE_viiii[$2 & 31]($1,$info,$3,1);
 $path_dst_ptr_to_static_ptr = (($info) + 24|0);
 $4 = HEAP32[$path_dst_ptr_to_static_ptr>>2]|0;
 $cmp4 = ($4|0)==(1);
 if (!($cmp4)) {
  $retval$1 = 0;
  STACKTOP = sp;return ($retval$1|0);
 }
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $5 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
 HEAP32[$adjustedPtr>>2] = $5;
 $retval$1 = 1;
 STACKTOP = sp;return ($retval$1|0);
}
function __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi($this,$info,$adjustedPtr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $adjustedPtr = $adjustedPtr|0;
 $path_below = $path_below|0;
 var $0 = 0, $1 = 0, $2 = 0, $add = 0, $cmp = 0, $cmp4 = 0, $cmp7 = 0, $dst_ptr_leading_to_static_ptr = 0, $number_to_static_ptr = 0, $number_to_static_ptr11 = 0, $path_dst_ptr_to_static_ptr = 0, $path_dst_ptr_to_static_ptr12 = 0, $path_dst_ptr_to_static_ptr6 = 0, $search_done = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $0 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
 $cmp = ($0|0)==(0|0);
 if ($cmp) {
  HEAP32[$dst_ptr_leading_to_static_ptr>>2] = $adjustedPtr;
  $path_dst_ptr_to_static_ptr = (($info) + 24|0);
  HEAP32[$path_dst_ptr_to_static_ptr>>2] = $path_below;
  $number_to_static_ptr = (($info) + 36|0);
  HEAP32[$number_to_static_ptr>>2] = 1;
  STACKTOP = sp;return;
 }
 $cmp4 = ($0|0)==($adjustedPtr|0);
 if (!($cmp4)) {
  $number_to_static_ptr11 = (($info) + 36|0);
  $2 = HEAP32[$number_to_static_ptr11>>2]|0;
  $add = (($2) + 1)|0;
  HEAP32[$number_to_static_ptr11>>2] = $add;
  $path_dst_ptr_to_static_ptr12 = (($info) + 24|0);
  HEAP32[$path_dst_ptr_to_static_ptr12>>2] = 2;
  $search_done = (($info) + 54|0);
  HEAP8[$search_done>>0] = 1;
  STACKTOP = sp;return;
 }
 $path_dst_ptr_to_static_ptr6 = (($info) + 24|0);
 $1 = HEAP32[$path_dst_ptr_to_static_ptr6>>2]|0;
 $cmp7 = ($1|0)==(2);
 if (!($cmp7)) {
  STACKTOP = sp;return;
 }
 HEAP32[$path_dst_ptr_to_static_ptr6>>2] = $path_below;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($this,$info,$adjustedPtr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $adjustedPtr = $adjustedPtr|0;
 $path_below = $path_below|0;
 var $0 = 0, $cmp$i = 0, $static_type = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($0|0)==($this|0);
 if (!($cmp$i)) {
  STACKTOP = sp;return;
 }
 __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$info,$adjustedPtr,$path_below);
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($this,$info,$adjustedPtr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $adjustedPtr = $adjustedPtr|0;
 $path_below = $path_below|0;
 var $0 = 0, $1 = 0, $2 = 0, $__base_type = 0, $cmp$i = 0, $static_type = 0, $vfn = 0, $vtable = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($this|0)==($0|0);
 if ($cmp$i) {
  __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$info,$adjustedPtr,$path_below);
  STACKTOP = sp;return;
 } else {
  $__base_type = (($this) + 8|0);
  $1 = HEAP32[$__base_type>>2]|0;
  $vtable = HEAP32[$1>>2]|0;
  $vfn = (($vtable) + 28|0);
  $2 = HEAP32[$vfn>>2]|0;
  FUNCTION_TABLE_viiii[$2 & 31]($1,$info,$adjustedPtr,$path_below);
  STACKTOP = sp;return;
 }
}
function ___dynamic_cast($static_ptr,$static_type,$dst_type,$src2dst_offset) {
 $static_ptr = $static_ptr|0;
 $static_type = $static_type|0;
 $dst_type = $dst_type|0;
 $src2dst_offset = $src2dst_offset|0;
 var $$ = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $add$ptr = 0, $add$ptr$ = 0;
 var $arrayidx = 0, $arrayidx1 = 0, $cmp = 0, $cmp$i = 0, $cmp14 = 0, $cmp16 = 0, $cmp19 = 0, $cmp25 = 0, $cmp27 = 0, $cmp30 = 0, $cmp33 = 0, $dst_ptr$0 = 0, $dst_ptr_leading_to_static_ptr = 0, $dst_ptr_not_leading_to_static_ptr = 0, $info = 0, $number_of_dst_type = 0, $number_to_dst_ptr = 0, $number_to_static_ptr = 0, $path_dst_ptr_to_static_ptr = 0, $path_dynamic_ptr_to_dst_ptr = 0;
 var $path_dynamic_ptr_to_static_ptr = 0, $src2dst_offset5 = 0, $static_ptr3 = 0, $static_type4 = 0, $vfn = 0, $vfn11 = 0, $vtable10 = 0, $vtable7 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $info = sp;
 $0 = HEAP32[$static_ptr>>2]|0;
 $arrayidx = (($0) + -8|0);
 $1 = HEAP32[$arrayidx>>2]|0;
 $2 = $1;
 $add$ptr = (($static_ptr) + ($2)|0);
 $arrayidx1 = (($0) + -4|0);
 $3 = HEAP32[$arrayidx1>>2]|0;
 HEAP32[$info>>2] = $dst_type;
 $static_ptr3 = (($info) + 4|0);
 HEAP32[$static_ptr3>>2] = $static_ptr;
 $static_type4 = (($info) + 8|0);
 HEAP32[$static_type4>>2] = $static_type;
 $src2dst_offset5 = (($info) + 12|0);
 HEAP32[$src2dst_offset5>>2] = $src2dst_offset;
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $dst_ptr_not_leading_to_static_ptr = (($info) + 20|0);
 $path_dst_ptr_to_static_ptr = (($info) + 24|0);
 $path_dynamic_ptr_to_static_ptr = (($info) + 28|0);
 $path_dynamic_ptr_to_dst_ptr = (($info) + 32|0);
 $number_to_dst_ptr = (($info) + 40|0);
 $cmp$i = ($3|0)==($dst_type|0);
 dest=$dst_ptr_leading_to_static_ptr+0|0; stop=dest+36|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));HEAP16[$dst_ptr_leading_to_static_ptr+36>>1]=0|0;HEAP8[$dst_ptr_leading_to_static_ptr+38>>0]=0|0;
 if ($cmp$i) {
  $number_of_dst_type = (($info) + 48|0);
  HEAP32[$number_of_dst_type>>2] = 1;
  $vtable7 = HEAP32[$3>>2]|0;
  $vfn = (($vtable7) + 20|0);
  $4 = HEAP32[$vfn>>2]|0;
  FUNCTION_TABLE_viiiiii[$4 & 15]($3,$info,$add$ptr,$add$ptr,1,0);
  $5 = HEAP32[$path_dst_ptr_to_static_ptr>>2]|0;
  $cmp = ($5|0)==(1);
  $add$ptr$ = $cmp ? $add$ptr : 0;
  $dst_ptr$0 = $add$ptr$;
  STACKTOP = sp;return ($dst_ptr$0|0);
 }
 $number_to_static_ptr = (($info) + 36|0);
 $vtable10 = HEAP32[$3>>2]|0;
 $vfn11 = (($vtable10) + 24|0);
 $6 = HEAP32[$vfn11>>2]|0;
 FUNCTION_TABLE_viiiii[$6 & 15]($3,$info,$add$ptr,1,0);
 $7 = HEAP32[$number_to_static_ptr>>2]|0;
 if ((($7|0) == 0)) {
  $8 = HEAP32[$number_to_dst_ptr>>2]|0;
  $cmp14 = ($8|0)==(1);
  if (!($cmp14)) {
   $dst_ptr$0 = 0;
   STACKTOP = sp;return ($dst_ptr$0|0);
  }
  $9 = HEAP32[$path_dynamic_ptr_to_static_ptr>>2]|0;
  $cmp16 = ($9|0)==(1);
  if (!($cmp16)) {
   $dst_ptr$0 = 0;
   STACKTOP = sp;return ($dst_ptr$0|0);
  }
  $10 = HEAP32[$path_dynamic_ptr_to_dst_ptr>>2]|0;
  $cmp19 = ($10|0)==(1);
  $11 = HEAP32[$dst_ptr_not_leading_to_static_ptr>>2]|0;
  $$ = $cmp19 ? $11 : 0;
  $dst_ptr$0 = $$;
  STACKTOP = sp;return ($dst_ptr$0|0);
 } else if ((($7|0) == 1)) {
  $12 = HEAP32[$path_dst_ptr_to_static_ptr>>2]|0;
  $cmp25 = ($12|0)==(1);
  if (!($cmp25)) {
   $13 = HEAP32[$number_to_dst_ptr>>2]|0;
   $cmp27 = ($13|0)==(0);
   if (!($cmp27)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
   $14 = HEAP32[$path_dynamic_ptr_to_static_ptr>>2]|0;
   $cmp30 = ($14|0)==(1);
   if (!($cmp30)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
   $15 = HEAP32[$path_dynamic_ptr_to_dst_ptr>>2]|0;
   $cmp33 = ($15|0)==(1);
   if (!($cmp33)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
  }
  $16 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
  $dst_ptr$0 = $16;
  STACKTOP = sp;return ($dst_ptr$0|0);
 } else {
  $dst_ptr$0 = 0;
  STACKTOP = sp;return ($dst_ptr$0|0);
 }
 return 0|0;
}
function __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i($this,$info,$dst_ptr,$current_ptr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $dst_ptr = $dst_ptr|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $add = 0, $cmp = 0, $cmp10 = 0, $cmp13 = 0, $cmp18 = 0, $cmp2 = 0, $cmp21 = 0, $cmp5 = 0, $cmp7 = 0, $dst_ptr_leading_to_static_ptr = 0, $found_any_static_type = 0, $found_our_static_ptr = 0, $number_of_dst_type = 0;
 var $number_of_dst_type17 = 0, $number_to_static_ptr = 0, $number_to_static_ptr26 = 0, $or$cond = 0, $or$cond19 = 0, $path_dst_ptr_to_static_ptr = 0, $path_dst_ptr_to_static_ptr12 = 0, $search_done = 0, $search_done23 = 0, $search_done27 = 0, $static_ptr = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $found_any_static_type = (($info) + 53|0);
 HEAP8[$found_any_static_type>>0] = 1;
 $static_ptr = (($info) + 4|0);
 $0 = HEAP32[$static_ptr>>2]|0;
 $cmp = ($0|0)==($current_ptr|0);
 if (!($cmp)) {
  STACKTOP = sp;return;
 }
 $found_our_static_ptr = (($info) + 52|0);
 HEAP8[$found_our_static_ptr>>0] = 1;
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $1 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
 $cmp2 = ($1|0)==(0|0);
 if ($cmp2) {
  HEAP32[$dst_ptr_leading_to_static_ptr>>2] = $dst_ptr;
  $path_dst_ptr_to_static_ptr = (($info) + 24|0);
  HEAP32[$path_dst_ptr_to_static_ptr>>2] = $path_below;
  $number_to_static_ptr = (($info) + 36|0);
  HEAP32[$number_to_static_ptr>>2] = 1;
  $number_of_dst_type = (($info) + 48|0);
  $2 = HEAP32[$number_of_dst_type>>2]|0;
  $cmp5 = ($2|0)==(1);
  $cmp7 = ($path_below|0)==(1);
  $or$cond = $cmp5 & $cmp7;
  if (!($or$cond)) {
   STACKTOP = sp;return;
  }
  $search_done = (($info) + 54|0);
  HEAP8[$search_done>>0] = 1;
  STACKTOP = sp;return;
 }
 $cmp10 = ($1|0)==($dst_ptr|0);
 if (!($cmp10)) {
  $number_to_static_ptr26 = (($info) + 36|0);
  $6 = HEAP32[$number_to_static_ptr26>>2]|0;
  $add = (($6) + 1)|0;
  HEAP32[$number_to_static_ptr26>>2] = $add;
  $search_done27 = (($info) + 54|0);
  HEAP8[$search_done27>>0] = 1;
  STACKTOP = sp;return;
 }
 $path_dst_ptr_to_static_ptr12 = (($info) + 24|0);
 $3 = HEAP32[$path_dst_ptr_to_static_ptr12>>2]|0;
 $cmp13 = ($3|0)==(2);
 if ($cmp13) {
  HEAP32[$path_dst_ptr_to_static_ptr12>>2] = $path_below;
  $5 = $path_below;
 } else {
  $5 = $3;
 }
 $number_of_dst_type17 = (($info) + 48|0);
 $4 = HEAP32[$number_of_dst_type17>>2]|0;
 $cmp18 = ($4|0)==(1);
 $cmp21 = ($5|0)==(1);
 $or$cond19 = $cmp18 & $cmp21;
 if (!($or$cond19)) {
  STACKTOP = sp;return;
 }
 $search_done23 = (($info) + 54|0);
 HEAP8[$search_done23>>0] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($this,$info,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $__base_type = 0, $__base_type40 = 0, $add = 0, $cmp = 0;
 var $cmp$i = 0, $cmp$i32 = 0, $cmp$i33 = 0, $cmp11 = 0, $cmp2$i = 0, $cmp26 = 0, $cmp27 = 0, $cmp5 = 0, $cmp7 = 0, $dst_ptr_leading_to_static_ptr = 0, $dst_ptr_not_leading_to_static_ptr = 0, $found_any_static_type = 0, $found_our_static_ptr = 0, $is_dst_type_derived_from_static_type = 0, $is_dst_type_derived_from_static_type13$0$off034 = 0, $not$tobool19 = 0, $number_to_dst_ptr = 0, $number_to_static_ptr = 0, $path_dst_ptr_to_static_ptr = 0, $path_dynamic_ptr_to_dst_ptr = 0;
 var $path_dynamic_ptr_to_dst_ptr10 = 0, $path_dynamic_ptr_to_static_ptr$i = 0, $search_done = 0, $static_ptr$i = 0, $static_type = 0, $tobool16 = 0, $vfn = 0, $vfn42 = 0, $vtable = 0, $vtable41 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($this|0)==($0|0);
 if ($cmp$i) {
  $static_ptr$i = (($info) + 4|0);
  $1 = HEAP32[$static_ptr$i>>2]|0;
  $cmp$i32 = ($1|0)==($current_ptr|0);
  if (!($cmp$i32)) {
   STACKTOP = sp;return;
  }
  $path_dynamic_ptr_to_static_ptr$i = (($info) + 28|0);
  $2 = HEAP32[$path_dynamic_ptr_to_static_ptr$i>>2]|0;
  $cmp2$i = ($2|0)==(1);
  if ($cmp2$i) {
   STACKTOP = sp;return;
  }
  HEAP32[$path_dynamic_ptr_to_static_ptr$i>>2] = $path_below;
  STACKTOP = sp;return;
 }
 $3 = HEAP32[$info>>2]|0;
 $cmp$i33 = ($this|0)==($3|0);
 if (!($cmp$i33)) {
  $__base_type40 = (($this) + 8|0);
  $14 = HEAP32[$__base_type40>>2]|0;
  $vtable41 = HEAP32[$14>>2]|0;
  $vfn42 = (($vtable41) + 24|0);
  $15 = HEAP32[$vfn42>>2]|0;
  FUNCTION_TABLE_viiiii[$15 & 15]($14,$info,$current_ptr,$path_below,$use_strcmp);
  STACKTOP = sp;return;
 }
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $4 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
 $cmp = ($4|0)==($current_ptr|0);
 if (!($cmp)) {
  $dst_ptr_not_leading_to_static_ptr = (($info) + 20|0);
  $5 = HEAP32[$dst_ptr_not_leading_to_static_ptr>>2]|0;
  $cmp5 = ($5|0)==($current_ptr|0);
  if (!($cmp5)) {
   $path_dynamic_ptr_to_dst_ptr10 = (($info) + 32|0);
   HEAP32[$path_dynamic_ptr_to_dst_ptr10>>2] = $path_below;
   $is_dst_type_derived_from_static_type = (($info) + 44|0);
   $6 = HEAP32[$is_dst_type_derived_from_static_type>>2]|0;
   $cmp11 = ($6|0)==(4);
   if ($cmp11) {
    STACKTOP = sp;return;
   }
   $found_our_static_ptr = (($info) + 52|0);
   HEAP8[$found_our_static_ptr>>0] = 0;
   $found_any_static_type = (($info) + 53|0);
   HEAP8[$found_any_static_type>>0] = 0;
   $__base_type = (($this) + 8|0);
   $7 = HEAP32[$__base_type>>2]|0;
   $vtable = HEAP32[$7>>2]|0;
   $vfn = (($vtable) + 20|0);
   $8 = HEAP32[$vfn>>2]|0;
   FUNCTION_TABLE_viiiiii[$8 & 15]($7,$info,$current_ptr,$current_ptr,1,$use_strcmp);
   $9 = HEAP8[$found_any_static_type>>0]|0;
   $tobool16 = ($9<<24>>24)==(0);
   if ($tobool16) {
    $is_dst_type_derived_from_static_type13$0$off034 = 0;
    label = 13;
   } else {
    $10 = HEAP8[$found_our_static_ptr>>0]|0;
    $not$tobool19 = ($10<<24>>24)==(0);
    if ($not$tobool19) {
     $is_dst_type_derived_from_static_type13$0$off034 = 1;
     label = 13;
    }
   }
   do {
    if ((label|0) == 13) {
     HEAP32[$dst_ptr_not_leading_to_static_ptr>>2] = $current_ptr;
     $number_to_dst_ptr = (($info) + 40|0);
     $11 = HEAP32[$number_to_dst_ptr>>2]|0;
     $add = (($11) + 1)|0;
     HEAP32[$number_to_dst_ptr>>2] = $add;
     $number_to_static_ptr = (($info) + 36|0);
     $12 = HEAP32[$number_to_static_ptr>>2]|0;
     $cmp26 = ($12|0)==(1);
     if ($cmp26) {
      $path_dst_ptr_to_static_ptr = (($info) + 24|0);
      $13 = HEAP32[$path_dst_ptr_to_static_ptr>>2]|0;
      $cmp27 = ($13|0)==(2);
      if ($cmp27) {
       $search_done = (($info) + 54|0);
       HEAP8[$search_done>>0] = 1;
       if ($is_dst_type_derived_from_static_type13$0$off034) {
        break;
       }
      } else {
       label = 16;
      }
     } else {
      label = 16;
     }
     if ((label|0) == 16) {
      if ($is_dst_type_derived_from_static_type13$0$off034) {
       break;
      }
     }
     HEAP32[$is_dst_type_derived_from_static_type>>2] = 4;
     STACKTOP = sp;return;
    }
   } while(0);
   HEAP32[$is_dst_type_derived_from_static_type>>2] = 3;
   STACKTOP = sp;return;
  }
 }
 $cmp7 = ($path_below|0)==(1);
 if (!($cmp7)) {
  STACKTOP = sp;return;
 }
 $path_dynamic_ptr_to_dst_ptr = (($info) + 32|0);
 HEAP32[$path_dynamic_ptr_to_dst_ptr>>2] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($this,$info,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $add = 0, $cmp = 0, $cmp$i = 0, $cmp$i19 = 0, $cmp$i20 = 0, $cmp12 = 0, $cmp13 = 0, $cmp2$i = 0, $cmp5 = 0, $cmp7 = 0, $dst_ptr_leading_to_static_ptr = 0;
 var $dst_ptr_not_leading_to_static_ptr = 0, $is_dst_type_derived_from_static_type = 0, $number_to_dst_ptr = 0, $number_to_static_ptr = 0, $path_dst_ptr_to_static_ptr = 0, $path_dynamic_ptr_to_dst_ptr = 0, $path_dynamic_ptr_to_dst_ptr10 = 0, $path_dynamic_ptr_to_static_ptr$i = 0, $search_done = 0, $static_ptr$i = 0, $static_type = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($0|0)==($this|0);
 if ($cmp$i) {
  $static_ptr$i = (($info) + 4|0);
  $1 = HEAP32[$static_ptr$i>>2]|0;
  $cmp$i20 = ($1|0)==($current_ptr|0);
  if (!($cmp$i20)) {
   STACKTOP = sp;return;
  }
  $path_dynamic_ptr_to_static_ptr$i = (($info) + 28|0);
  $2 = HEAP32[$path_dynamic_ptr_to_static_ptr$i>>2]|0;
  $cmp2$i = ($2|0)==(1);
  if ($cmp2$i) {
   STACKTOP = sp;return;
  }
  HEAP32[$path_dynamic_ptr_to_static_ptr$i>>2] = $path_below;
  STACKTOP = sp;return;
 }
 $3 = HEAP32[$info>>2]|0;
 $cmp$i19 = ($3|0)==($this|0);
 if (!($cmp$i19)) {
  STACKTOP = sp;return;
 }
 $dst_ptr_leading_to_static_ptr = (($info) + 16|0);
 $4 = HEAP32[$dst_ptr_leading_to_static_ptr>>2]|0;
 $cmp = ($4|0)==($current_ptr|0);
 if (!($cmp)) {
  $dst_ptr_not_leading_to_static_ptr = (($info) + 20|0);
  $5 = HEAP32[$dst_ptr_not_leading_to_static_ptr>>2]|0;
  $cmp5 = ($5|0)==($current_ptr|0);
  if (!($cmp5)) {
   $path_dynamic_ptr_to_dst_ptr10 = (($info) + 32|0);
   HEAP32[$path_dynamic_ptr_to_dst_ptr10>>2] = $path_below;
   HEAP32[$dst_ptr_not_leading_to_static_ptr>>2] = $current_ptr;
   $number_to_dst_ptr = (($info) + 40|0);
   $6 = HEAP32[$number_to_dst_ptr>>2]|0;
   $add = (($6) + 1)|0;
   HEAP32[$number_to_dst_ptr>>2] = $add;
   $number_to_static_ptr = (($info) + 36|0);
   $7 = HEAP32[$number_to_static_ptr>>2]|0;
   $cmp12 = ($7|0)==(1);
   if ($cmp12) {
    $path_dst_ptr_to_static_ptr = (($info) + 24|0);
    $8 = HEAP32[$path_dst_ptr_to_static_ptr>>2]|0;
    $cmp13 = ($8|0)==(2);
    if ($cmp13) {
     $search_done = (($info) + 54|0);
     HEAP8[$search_done>>0] = 1;
    }
   }
   $is_dst_type_derived_from_static_type = (($info) + 44|0);
   HEAP32[$is_dst_type_derived_from_static_type>>2] = 4;
   STACKTOP = sp;return;
  }
 }
 $cmp7 = ($path_below|0)==(1);
 if (!($cmp7)) {
  STACKTOP = sp;return;
 }
 $path_dynamic_ptr_to_dst_ptr = (($info) + 32|0);
 HEAP32[$path_dynamic_ptr_to_dst_ptr>>2] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($this,$info,$dst_ptr,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $dst_ptr = $dst_ptr|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $2 = 0, $__base_type = 0, $cmp$i = 0, $static_type = 0, $vfn = 0, $vtable = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($this|0)==($0|0);
 if ($cmp$i) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$info,$dst_ptr,$current_ptr,$path_below);
  STACKTOP = sp;return;
 } else {
  $__base_type = (($this) + 8|0);
  $1 = HEAP32[$__base_type>>2]|0;
  $vtable = HEAP32[$1>>2]|0;
  $vfn = (($vtable) + 20|0);
  $2 = HEAP32[$vfn>>2]|0;
  FUNCTION_TABLE_viiiiii[$2 & 15]($1,$info,$dst_ptr,$current_ptr,$path_below,$use_strcmp);
  STACKTOP = sp;return;
 }
}
function __ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($this,$info,$dst_ptr,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $dst_ptr = $dst_ptr|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $cmp$i = 0, $static_type = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $static_type = (($info) + 8|0);
 $0 = HEAP32[$static_type>>2]|0;
 $cmp$i = ($0|0)==($this|0);
 if (!($cmp$i)) {
  STACKTOP = sp;return;
 }
 __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$info,$dst_ptr,$current_ptr,$path_below);
 STACKTOP = sp;return;
}
function _malloc($bytes) {
 $bytes = $bytes|0;
 var $$pre = 0, $$pre$i = 0, $$pre$i$i = 0, $$pre$i144 = 0, $$pre$i66$i = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i145Z2D = 0, $$pre$phi$i67$iZ2D = 0, $$pre$phi$iZ2D = 0, $$pre$phiZ2D = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0;
 var $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0;
 var $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0;
 var $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0;
 var $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0;
 var $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0;
 var $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0;
 var $215 = 0, $216 = 0, $217 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0;
 var $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0;
 var $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0;
 var $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0;
 var $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $F$0$i$i = 0, $F104$0 = 0, $F197$0$i = 0, $F224$0$i$i = 0, $F289$0$i = 0, $I252$0$i$i = 0, $I315$0$i = 0, $I57$0$c$i$i = 0, $I57$0$i$i = 0, $K105$017$i$i = 0, $K305$043$i$i = 0, $K372$024$i = 0;
 var $R$0$i = 0, $R$0$i$i = 0, $R$0$i135 = 0, $R$1$i = 0, $R$1$i$i = 0, $R$1$i137 = 0, $RP$0$i = 0, $RP$0$i$i = 0, $RP$0$i134 = 0, $T$0$lcssa$i = 0, $T$0$lcssa$i$i = 0, $T$0$lcssa$i69$i = 0, $T$016$i$i = 0, $T$023$i = 0, $T$042$i$i = 0, $add$i = 0, $add$i$i = 0, $add$i113 = 0, $add$i147 = 0, $add$ptr$i = 0;
 var $add$ptr$i$i = 0, $add$ptr$i$i$i = 0, $add$ptr$i10$i$i = 0, $add$ptr$i11$i = 0, $add$ptr$i126 = 0, $add$ptr$i160 = 0, $add$ptr$i22$i = 0, $add$ptr$i37$i = 0, $add$ptr$sum$i$i = 0, $add$ptr$sum$i141172 = 0, $add$ptr$sum$i173 = 0, $add$ptr$sum1$i = 0, $add$ptr$sum1$i142 = 0, $add$ptr$sum10$i = 0, $add$ptr$sum104 = 0, $add$ptr$sum11$i = 0, $add$ptr$sum12$i = 0, $add$ptr$sum13$i = 0, $add$ptr$sum14$i = 0, $add$ptr$sum2$i = 0;
 var $add$ptr$sum3$i = 0, $add$ptr$sum4$i = 0, $add$ptr$sum5$i = 0, $add$ptr$sum6$i = 0, $add$ptr$sum7$i = 0, $add$ptr$sum8$i = 0, $add$ptr$sum9$i = 0, $add$ptr14$i$i = 0, $add$ptr16$i$i = 0, $add$ptr16$sum$i$i = 0, $add$ptr16$sum23$i$i = 0, $add$ptr16$sum25$i$i = 0, $add$ptr16$sum2627$i$i = 0, $add$ptr16$sum2829$i$i = 0, $add$ptr16$sum3031$i$i = 0, $add$ptr16$sum32$i$i = 0, $add$ptr16$sum4$i$i = 0, $add$ptr16$sum56$i$i = 0, $add$ptr16$sum7$i$i = 0, $add$ptr165 = 0;
 var $add$ptr165$sum = 0, $add$ptr168 = 0, $add$ptr17$i$i = 0, $add$ptr17$sum$i$i = 0, $add$ptr17$sum10$i$i = 0, $add$ptr17$sum11$i$i = 0, $add$ptr17$sum12$i$i = 0, $add$ptr17$sum13$i$i = 0, $add$ptr17$sum16$i$i = 0, $add$ptr17$sum17$i$i = 0, $add$ptr17$sum18$i$i = 0, $add$ptr17$sum19$i$i = 0, $add$ptr17$sum20$i$i = 0, $add$ptr17$sum21$i$i = 0, $add$ptr17$sum22$i$i = 0, $add$ptr17$sum23$i$i = 0, $add$ptr17$sum33$i$i = 0, $add$ptr17$sum34$i$i = 0, $add$ptr17$sum35$i$i = 0, $add$ptr17$sum8$i$i = 0;
 var $add$ptr17$sum9$i$i = 0, $add$ptr177$sum = 0, $add$ptr181 = 0, $add$ptr181$sum$i = 0, $add$ptr186$i = 0, $add$ptr190 = 0, $add$ptr190$i = 0, $add$ptr190$sum = 0, $add$ptr196 = 0, $add$ptr2$sum$i$i = 0, $add$ptr2$sum1$i$i = 0, $add$ptr205$i$i = 0, $add$ptr212$i$i = 0, $add$ptr224$i = 0, $add$ptr224$sum$i = 0, $add$ptr224$sum131$i = 0, $add$ptr224$sum132$i = 0, $add$ptr224$sum133$i = 0, $add$ptr224$sum134$i = 0, $add$ptr224$sum135$i = 0;
 var $add$ptr224$sum136$i = 0, $add$ptr224$sum137$i = 0, $add$ptr224$sum138$i = 0, $add$ptr224$sum139$i = 0, $add$ptr224$sum140$i = 0, $add$ptr224$sum141$i = 0, $add$ptr224$sum142$i = 0, $add$ptr224$sum143$i = 0, $add$ptr225$i = 0, $add$ptr2418$i$i = 0, $add$ptr2420$i$i = 0, $add$ptr255$i = 0, $add$ptr255$sum$i = 0, $add$ptr262$i = 0, $add$ptr272$sum$i = 0, $add$ptr281$i = 0, $add$ptr3$i$i = 0, $add$ptr30$i$i = 0, $add$ptr30$i52$i = 0, $add$ptr30$sum$i$i = 0;
 var $add$ptr368$i$i = 0, $add$ptr4$i$i = 0, $add$ptr4$i$i$i = 0, $add$ptr4$i28$i = 0, $add$ptr4$i43$i = 0, $add$ptr4$sum$i$i = 0, $add$ptr4$sum$i$i$i = 0, $add$ptr4$sum$i31$i = 0, $add$ptr4$sum$i49$i = 0, $add$ptr4$sum1$i$i = 0, $add$ptr4$sum1415$i$i = 0, $add$ptr436$i = 0, $add$ptr5$i$i = 0, $add$ptr6$sum$i$i = 0, $add$ptr6$sum$i$i$i = 0, $add$ptr6$sum$i33$i = 0, $add$ptr7$i$i = 0, $add$ptr82$i$i = 0, $add$ptr95 = 0, $add$ptr95$sum102 = 0;
 var $add$ptr98 = 0, $add10$i = 0, $add107$i = 0, $add13$i = 0, $add137$i = 0, $add14$i = 0, $add143 = 0, $add147$i = 0, $add17$i = 0, $add17$i150 = 0, $add177$i = 0, $add18$i = 0, $add19$i = 0, $add2 = 0, $add20$i = 0, $add206$i$i = 0, $add209$i = 0, $add212$i = 0, $add22$i = 0, $add243$i = 0;
 var $add26$i$i = 0, $add267$i = 0, $add269$i$i = 0, $add274$i$i = 0, $add278$i$i = 0, $add280$i$i = 0, $add283$i$i = 0, $add336$i = 0, $add341$i = 0, $add345$i = 0, $add347$i = 0, $add350$i = 0, $add43$i = 0, $add48$i = 0, $add50 = 0, $add51$i = 0, $add54 = 0, $add58 = 0, $add62 = 0, $add64 = 0;
 var $add74$i = 0, $add74$i$i = 0, $add77$i = 0, $add79$i$i = 0, $add8 = 0, $add81$i = 0, $add83$i$i = 0, $add85$i = 0, $add85$i$i = 0, $add88$i$i = 0, $add89$i = 0, $add9$i = 0, $add91$i = 0, $add98$i = 0, $and = 0, $and$i = 0, $and$i$i = 0, $and$i$i$i = 0, $and$i110 = 0, $and$i12$i = 0;
 var $and$i14$i = 0, $and$i23$i = 0, $and$i38$i = 0, $and101$i = 0, $and103$i = 0, $and106 = 0, $and11$i = 0, $and119$i$i = 0, $and11914$i$i = 0, $and12$i = 0, $and13$i = 0, $and13$i$i = 0, $and133$i$i = 0, $and14 = 0, $and144 = 0, $and17$i = 0, $and191$i = 0, $and193$i = 0, $and199$i = 0, $and209$i$i = 0;
 var $and21$i = 0, $and21$i116 = 0, $and227$i$i = 0, $and233$i = 0, $and26$i = 0, $and264$i$i = 0, $and268$i$i = 0, $and273$i$i = 0, $and282$i$i = 0, $and291$i = 0, $and295$i$i = 0, $and3$i = 0, $and3$i$i = 0, $and3$i$i$i = 0, $and3$i25$i = 0, $and3$i40$i = 0, $and30$i = 0, $and318$i$i = 0, $and31840$i$i = 0, $and32$i = 0;
 var $and32$i$i = 0, $and33$i$i = 0, $and330$i = 0, $and335$i = 0, $and340$i = 0, $and349$i = 0, $and362$i = 0, $and37$i$i = 0, $and386$i = 0, $and38621$i = 0, $and39$i = 0, $and4 = 0, $and40$i$i = 0, $and41 = 0, $and43 = 0, $and46 = 0, $and46$i = 0, $and49 = 0, $and49$i$i = 0, $and53 = 0;
 var $and57 = 0, $and6$i = 0, $and6$i$i = 0, $and6$i44$i = 0, $and61 = 0, $and63$i = 0, $and67$i = 0, $and69$i$i = 0, $and7 = 0, $and7$i$i = 0, $and72$i = 0, $and73$i$i = 0, $and74 = 0, $and76$i = 0, $and77$$i = 0, $and77$i = 0, $and78$i$i = 0, $and8$i = 0, $and80$i = 0, $and84$i = 0;
 var $and87$i$i = 0, $and88$i = 0, $and9$i = 0, $and96$i$i = 0, $and99$i = 0, $arrayidx = 0, $arrayidx$i = 0, $arrayidx$i$i = 0, $arrayidx$i117 = 0, $arrayidx$i21$i = 0, $arrayidx$i57$i = 0, $arrayidx$sum = 0, $arrayidx$sum$i$i = 0, $arrayidx$sum$pre$i$i = 0, $arrayidx$sum1$i$i = 0, $arrayidx$sum9$i$i = 0, $arrayidx103 = 0, $arrayidx103$i$i = 0, $arrayidx103$sum$pre = 0, $arrayidx103$sum103 = 0;
 var $arrayidx105$i = 0, $arrayidx107$i$i = 0, $arrayidx112$i = 0, $arrayidx113$i = 0, $arrayidx121$i = 0, $arrayidx123$i$i = 0, $arrayidx126$i$i = 0, $arrayidx137$i = 0, $arrayidx143$i$i = 0, $arrayidx148$i = 0, $arrayidx150$i = 0, $arrayidx151$i$i = 0, $arrayidx154$i = 0, $arrayidx154$i131 = 0, $arrayidx160$i = 0, $arrayidx164$i = 0, $arrayidx165$i = 0, $arrayidx178$i$i = 0, $arrayidx183$i = 0, $arrayidx184$i$i = 0;
 var $arrayidx195$i$i = 0, $arrayidx196$i = 0, $arrayidx196$sum$pre$i = 0, $arrayidx196$sum2$i = 0, $arrayidx203$i = 0, $arrayidx211$i = 0, $arrayidx223$i$i = 0, $arrayidx223$sum$pre$i$i = 0, $arrayidx223$sum24$i$i = 0, $arrayidx227$i = 0, $arrayidx23$i = 0, $arrayidx238$i = 0, $arrayidx244$i = 0, $arrayidx255$i = 0, $arrayidx27$i = 0, $arrayidx287$i$i = 0, $arrayidx288$i = 0, $arrayidx288$sum$pre$i = 0, $arrayidx288$sum15$i = 0, $arrayidx290$i$i = 0;
 var $arrayidx325$i$i = 0, $arrayidx354$i = 0, $arrayidx357$i = 0, $arrayidx393$i = 0, $arrayidx40$i = 0, $arrayidx44$i = 0, $arrayidx61$i = 0, $arrayidx65$i = 0, $arrayidx66 = 0, $arrayidx66$sum = 0, $arrayidx71$i = 0, $arrayidx75$i = 0, $arrayidx91$i$i = 0, $arrayidx92$i$i = 0, $arrayidx93$i = 0, $arrayidx94$i = 0, $arrayidx96$i$i = 0, $bk = 0, $bk$i = 0, $bk$i$i = 0;
 var $bk$i128 = 0, $bk$i55$i = 0, $bk102$i$i = 0, $bk122 = 0, $bk124 = 0, $bk135$i = 0, $bk139$i$i = 0, $bk155$i$i = 0, $bk158$i$i = 0, $bk218$i = 0, $bk220$i = 0, $bk246$i$i = 0, $bk248$i$i = 0, $bk302$i$i = 0, $bk310$i = 0, $bk312$i = 0, $bk338$i$i = 0, $bk357$i$i = 0, $bk360$i$i = 0, $bk369$i = 0;
 var $bk406$i = 0, $bk425$i = 0, $bk428$i = 0, $bk43$i$i = 0, $bk47$i = 0, $bk55$i$i = 0, $bk67$i$i = 0, $bk74$i$i = 0, $bk78 = 0, $bk82$i$i = 0, $br$0$i = 0, $call$i$i = 0, $call104$i = 0, $call128$i = 0, $call129$i = 0, $call265$i = 0, $call34$$i = 0, $call34$i = 0, $call6$i$i = 0, $call65$i = 0;
 var $call80$$i = 0, $call80$i = 0, $child$i$i = 0, $child166$i$i = 0, $child289$i$i = 0, $child289$sum$i$i = 0, $child356$i = 0, $child356$sum$i = 0, $cmp = 0, $cmp$i = 0, $cmp$i$i$i = 0, $cmp$i107 = 0, $cmp$i11$i$i = 0, $cmp$i13$i = 0, $cmp$i146 = 0, $cmp$i15$i = 0, $cmp$i24$i = 0, $cmp$i39$i = 0, $cmp$i9$i = 0, $cmp1 = 0;
 var $cmp1$i = 0, $cmp1$i$i = 0, $cmp10 = 0, $cmp100$i$i = 0, $cmp101$i = 0, $cmp102$i = 0, $cmp104$i$i = 0, $cmp105$i = 0, $cmp106$i = 0, $cmp106$i$i = 0, $cmp107$i = 0, $cmp108$i$i = 0, $cmp112$i$i = 0, $cmp113 = 0, $cmp114$i = 0, $cmp115$i = 0, $cmp115$i162 = 0, $cmp118$i = 0, $cmp12$i = 0, $cmp120$i = 0;
 var $cmp120$i$i = 0, $cmp120$i63$i = 0, $cmp12015$i$i = 0, $cmp122$i = 0, $cmp124$i = 0, $cmp124$i$i = 0, $cmp126$i = 0, $cmp127$i = 0, $cmp128 = 0, $cmp128$i$i = 0, $cmp130$i = 0, $cmp132$i = 0, $cmp133$i$i = 0, $cmp134$i = 0, $cmp136$i = 0, $cmp137$i$i = 0, $cmp138 = 0, $cmp138$i = 0, $cmp138$i164 = 0, $cmp139$i = 0;
 var $cmp142$i = 0, $cmp144$i$i = 0, $cmp145 = 0, $cmp147$i$i = 0, $cmp148$i = 0, $cmp15 = 0, $cmp15$i = 0, $cmp150$i$i = 0, $cmp151$i = 0, $cmp154$i = 0, $cmp155 = 0, $cmp155$i = 0, $cmp155$i132 = 0, $cmp156$i = 0, $cmp156$i$i = 0, $cmp159$i = 0, $cmp159$i166 = 0, $cmp16 = 0, $cmp160$i$i = 0, $cmp161 = 0;
 var $cmp161$i = 0, $cmp165$i = 0, $cmp168$i$i = 0, $cmp170$i = 0, $cmp172$i$i = 0, $cmp174$i = 0, $cmp179$i = 0, $cmp183 = 0, $cmp183$i = 0, $cmp184$i = 0, $cmp185$i$i = 0, $cmp187$i = 0, $cmp189$i$i = 0, $cmp19$i = 0, $cmp191$i = 0, $cmp197$i = 0, $cmp2$i$i = 0, $cmp2$i$i$i = 0, $cmp20$i$i = 0, $cmp200$i = 0;
 var $cmp204$i = 0, $cmp206$i = 0, $cmp208$i = 0, $cmp21$i = 0, $cmp215$i = 0, $cmp215$i$i = 0, $cmp216$i = 0, $cmp220$i = 0, $cmp221$i = 0, $cmp225$i = 0, $cmp228$i = 0, $cmp232$i = 0, $cmp236$i$i = 0, $cmp24$i = 0, $cmp24$i$i = 0, $cmp245$i = 0, $cmp249$i = 0, $cmp250$i = 0, $cmp254$i$i = 0, $cmp258$i$i = 0;
 var $cmp26$i = 0, $cmp264$i = 0, $cmp27$i$i = 0, $cmp2719$i$i = 0, $cmp28$i = 0, $cmp28$i$i = 0, $cmp283$i = 0, $cmp29 = 0, $cmp29$i = 0, $cmp3$i$i = 0, $cmp300$i = 0, $cmp306$i$i = 0, $cmp31 = 0, $cmp318$i = 0, $cmp319$i$i = 0, $cmp31941$i$i = 0, $cmp32$i = 0, $cmp32$i152 = 0, $cmp322$i = 0, $cmp327$i$i = 0;
 var $cmp33$i = 0, $cmp332$i$i = 0, $cmp34$i = 0, $cmp34$i$i = 0, $cmp346$i$i = 0, $cmp35$i = 0, $cmp35$i154 = 0, $cmp350$i$i = 0, $cmp36$i = 0, $cmp36$i$i = 0, $cmp373$i = 0, $cmp38$i$i = 0, $cmp387$i = 0, $cmp38722$i = 0, $cmp395$i = 0, $cmp40$i = 0, $cmp40$i155 = 0, $cmp400$i = 0, $cmp41$i$i = 0, $cmp414$i = 0;
 var $cmp418$i = 0, $cmp42$i$i = 0, $cmp44$i$i = 0, $cmp45$i = 0, $cmp45$i123 = 0, $cmp46$i = 0, $cmp46$i$i = 0, $cmp46$i59$i = 0, $cmp48$i = 0, $cmp49$i = 0, $cmp5 = 0, $cmp51$i = 0, $cmp52$i = 0, $cmp54$i = 0, $cmp54$i$i = 0, $cmp54$i156 = 0, $cmp56$i = 0, $cmp57$i = 0, $cmp57$i$i = 0, $cmp59$i$i = 0;
 var $cmp60$i = 0, $cmp60$i$i = 0, $cmp62$i = 0, $cmp63$i = 0, $cmp63$i$i = 0, $cmp64$i = 0, $cmp66$i = 0, $cmp66$i158 = 0, $cmp7$i$i = 0, $cmp70 = 0, $cmp72$i = 0, $cmp75$i$i = 0, $cmp76 = 0, $cmp76$i = 0, $cmp78$i = 0, $cmp79 = 0, $cmp81$i = 0, $cmp81$i$i = 0, $cmp82$i = 0, $cmp83$i$i = 0;
 var $cmp86$i = 0, $cmp86$i$i = 0, $cmp88$i = 0, $cmp9$i$i = 0, $cmp90$i = 0, $cmp90$i161 = 0, $cmp93$i = 0, $cmp95$i = 0, $cmp96$i = 0, $cmp9626$i = 0, $cmp97$i$i = 0, $cmp99 = 0, $cond = 0, $cond$i = 0, $cond$i$i = 0, $cond$i$i$i = 0, $cond$i17$i = 0, $cond$i27$i = 0, $cond$i42$i = 0, $cond$v$0$i = 0;
 var $cond115$i$i = 0, $cond13$i$i = 0, $cond15$i$i = 0, $cond18$i = 0, $cond315$i$i = 0, $cond37$i$i = 0, $cond382$i = 0, $cond4$i = 0, $cond6$i = 0, $exitcond$i$i = 0, $fd$i = 0, $fd$i$i = 0, $fd$i129 = 0, $fd103$i$i = 0, $fd123 = 0, $fd138$i = 0, $fd140$i$i = 0, $fd145$i$i = 0, $fd157$i$i = 0, $fd219$i = 0;
 var $fd247$i$i = 0, $fd303$i$i = 0, $fd311$i = 0, $fd339$i$i = 0, $fd344$i$i = 0, $fd359$i$i = 0, $fd370$i = 0, $fd407$i = 0, $fd412$i = 0, $fd427$i = 0, $fd50$i = 0, $fd54$i$i = 0, $fd59$i$i = 0, $fd68$pre$i$i = 0, $fd68$pre$phi$i$iZ2D = 0, $fd69 = 0, $fd78$i$i = 0, $fd85$i$i = 0, $fd9 = 0, $head = 0;
 var $head$i = 0, $head$i$i = 0, $head$i$i$i = 0, $head$i122 = 0, $head$i18$i = 0, $head$i32$i = 0, $head$i50$i = 0, $head118$i$i = 0, $head11813$i$i = 0, $head167 = 0, $head172 = 0, $head176 = 0, $head178 = 0, $head179$i = 0, $head182$i = 0, $head187$i = 0, $head189$i = 0, $head192 = 0, $head195 = 0, $head208$i$i = 0;
 var $head211$i$i = 0, $head23$i$i = 0, $head25 = 0, $head258$i = 0, $head261$i = 0, $head270$i = 0, $head273$i = 0, $head278$i = 0, $head280$i = 0, $head29$i = 0, $head29$i$i = 0, $head31$i$i = 0, $head317$i$i = 0, $head31739$i$i = 0, $head32$i$i = 0, $head34$i$i = 0, $head385$i = 0, $head38520$i = 0, $head7$i$i = 0, $head7$i$i$i = 0;
 var $head7$i34$i = 0, $head94 = 0, $head97 = 0, $head98$i = 0, $i$02$i$i = 0, $idx$0$i = 0, $inc$i$i = 0, $index$i = 0, $index$i$i = 0, $index$i138 = 0, $index$i64$i = 0, $index288$i$i = 0, $index355$i = 0, $mem$0 = 0, $nb$0 = 0, $neg = 0, $neg$i = 0, $neg$i$i = 0, $neg$i139 = 0, $neg$i149 = 0;
 var $neg100$i = 0, $neg13 = 0, $neg132$i$i = 0, $neg45$i = 0, $neg73 = 0, $next$i = 0, $next$i$i = 0, $next$i$i$i = 0, $next228$i = 0, $notlhs$i = 0, $notrhs$i = 0, $oldfirst$0$i$i = 0, $or$cond$i = 0, $or$cond$i157 = 0, $or$cond1$i = 0, $or$cond16$i = 0, $or$cond2$i = 0, $or$cond3$i = 0, $or$cond4$i = 0, $or$cond6$not$i = 0;
 var $or$cond7$i = 0, $or$cond8$i = 0, $or$cond93$i = 0, $or$i = 0, $or$i$i = 0, $or$i$i$i = 0, $or$i163 = 0, $or$i30$i = 0, $or101$i$i = 0, $or110 = 0, $or166 = 0, $or171 = 0, $or175 = 0, $or178$i = 0, $or179 = 0, $or183$i = 0, $or186$i = 0, $or188$i = 0, $or19$i$i = 0, $or191 = 0;
 var $or194 = 0, $or204$i = 0, $or210$i$i = 0, $or22$i$i = 0, $or23 = 0, $or232$i$i = 0, $or257$i = 0, $or26 = 0, $or260$i = 0, $or269$i = 0, $or274$i = 0, $or277$i = 0, $or279$i = 0, $or28$i$i = 0, $or296$i = 0, $or300$i$i = 0, $or33$i$i = 0, $or367$i = 0, $or40 = 0, $or44$i$i = 0;
 var $or93 = 0, $or96 = 0, $parent$i = 0, $parent$i$i = 0, $parent$i127 = 0, $parent$i61$i = 0, $parent135$i = 0, $parent138$i$i = 0, $parent149$i = 0, $parent159$i$i = 0, $parent165$i$i = 0, $parent166$i = 0, $parent179$i$i = 0, $parent196$i$i = 0, $parent225$i = 0, $parent239$i = 0, $parent256$i = 0, $parent301$i$i = 0, $parent337$i$i = 0, $parent361$i$i = 0;
 var $parent368$i = 0, $parent405$i = 0, $parent429$i = 0, $qsize$0$i$i = 0, $rsize$0$i = 0, $rsize$0$i120 = 0, $rsize$1$i = 0, $rsize$2$i = 0, $rsize$3$lcssa$i = 0, $rsize$328$i = 0, $rst$0$i = 0, $rst$1$i = 0, $sflags190$i = 0, $sflags232$i = 0, $shl = 0, $shl$i = 0, $shl$i$i = 0, $shl$i111 = 0, $shl$i20$i = 0, $shl$i56$i = 0;
 var $shl102 = 0, $shl105 = 0, $shl116$i$i = 0, $shl12 = 0, $shl127$i$i = 0, $shl131$i$i = 0, $shl15$i = 0, $shl18$i = 0, $shl191$i = 0, $shl195$i = 0, $shl198$i = 0, $shl22 = 0, $shl221$i$i = 0, $shl226$i$i = 0, $shl265$i$i = 0, $shl270$i$i = 0, $shl276$i$i = 0, $shl279$i$i = 0, $shl287$i = 0, $shl290$i = 0;
 var $shl294$i$i = 0, $shl31$i = 0, $shl316$i$i = 0, $shl326$i$i = 0, $shl332$i = 0, $shl337$i = 0, $shl343$i = 0, $shl346$i = 0, $shl35 = 0, $shl361$i = 0, $shl37 = 0, $shl383$i = 0, $shl39$i$i = 0, $shl394$i = 0, $shl48$i$i = 0, $shl52$i = 0, $shl59$i = 0, $shl65 = 0, $shl70$i$i = 0, $shl72 = 0;
 var $shl75$i$i = 0, $shl81$i$i = 0, $shl84$i$i = 0, $shl9$i = 0, $shl90 = 0, $shl95$i$i = 0, $shr = 0, $shr$i = 0, $shr$i$i = 0, $shr$i106 = 0, $shr$i54$i = 0, $shr101 = 0, $shr11$i = 0, $shr11$i114 = 0, $shr110$i$i = 0, $shr12$i = 0, $shr123$i$i = 0, $shr15$i = 0, $shr16$i = 0, $shr16$i115 = 0;
 var $shr19$i = 0, $shr194$i = 0, $shr20$i = 0, $shr214$i$i = 0, $shr253$i$i = 0, $shr263$i$i = 0, $shr267$i$i = 0, $shr27$i = 0, $shr272$i$i = 0, $shr277$i$i = 0, $shr281$i$i = 0, $shr282$i = 0, $shr3 = 0, $shr310$i$i = 0, $shr317$i = 0, $shr322$i$i = 0, $shr329$i = 0, $shr334$i = 0, $shr339$i = 0, $shr344$i = 0;
 var $shr348$i = 0, $shr377$i = 0, $shr390$i = 0, $shr4$i = 0, $shr41$i = 0, $shr45 = 0, $shr47 = 0, $shr48 = 0, $shr5$i = 0, $shr5$i109 = 0, $shr51 = 0, $shr52 = 0, $shr55 = 0, $shr56 = 0, $shr58$i$i = 0, $shr59 = 0, $shr60 = 0, $shr63 = 0, $shr68$i$i = 0, $shr7$i = 0;
 var $shr7$i112 = 0, $shr71$i = 0, $shr72$i$i = 0, $shr74$i = 0, $shr75$i = 0, $shr77$i$i = 0, $shr78$i = 0, $shr79$i = 0, $shr8$i = 0, $shr82$i = 0, $shr82$i$i = 0, $shr83$i = 0, $shr86$i = 0, $shr86$i$i = 0, $shr87$i = 0, $shr90$i = 0, $size$i$i = 0, $size$i$i$i = 0, $size185$i = 0, $size242$i = 0;
 var $sizebits$0$i = 0, $sp$0$i$i = 0, $sp$0$i$i$i = 0, $sp$0109$i = 0, $sp$1105$i = 0, $ssize$0$$i = 0, $ssize$0$i = 0, $ssize$1$i = 0, $ssize$2$i = 0, $sub = 0, $sub$i = 0, $sub$i$i = 0, $sub$i105 = 0, $sub$i148 = 0, $sub$ptr$lhs$cast$i = 0, $sub$ptr$lhs$cast$i$i = 0, $sub$ptr$lhs$cast$i46$i = 0, $sub$ptr$rhs$cast$i = 0, $sub$ptr$rhs$cast$i$i = 0, $sub$ptr$rhs$cast$i47$i = 0;
 var $sub$ptr$sub$i = 0, $sub$ptr$sub$i$i = 0, $sub$ptr$sub$i48$i = 0, $sub$ptr$sub$tsize$1$i = 0, $sub10$i = 0, $sub100$i = 0, $sub100$rsize$3$i = 0, $sub109$i = 0, $sub113$i$i = 0, $sub117$i = 0, $sub14$i = 0, $sub159 = 0, $sub16$i$i = 0, $sub169$i = 0, $sub18$i$i = 0, $sub187 = 0, $sub2$i = 0, $sub22$i = 0, $sub253$i = 0, $sub262$i$i = 0;
 var $sub266$i$i = 0, $sub271$i$i = 0, $sub275$i$i = 0, $sub30$i = 0, $sub31$i = 0, $sub31$rsize$0$i = 0, $sub313$i$i = 0, $sub328$i = 0, $sub33$i = 0, $sub333$i = 0, $sub338$i = 0, $sub342$i = 0, $sub38$i = 0, $sub380$i = 0, $sub4$i = 0, $sub42 = 0, $sub44 = 0, $sub47$i = 0, $sub5$i$i = 0, $sub5$i$i$i = 0;
 var $sub5$i29$i = 0, $sub6$i = 0, $sub62$i = 0, $sub66$i = 0, $sub67$i$i = 0, $sub69$i = 0, $sub71$i$i = 0, $sub76$i$i = 0, $sub80$i$i = 0, $sub91 = 0, $sub96$i = 0, $t$0$i = 0, $t$0$i119 = 0, $t$1$i = 0, $t$2$ph$i = 0, $t$2$v$3$i = 0, $t$227$i = 0, $tbase$0$i = 0, $tbase$291$i = 0, $tobool$i$i = 0;
 var $tobool107 = 0, $tobool192$i = 0, $tobool200$i = 0, $tobool228$i$i = 0, $tobool234$i = 0, $tobool27$i = 0, $tobool292$i = 0, $tobool296$i$i = 0, $tobool363$i = 0, $tobool97$i$i = 0, $tsize$0$i = 0, $tsize$0748284$i = 0, $tsize$1$i = 0, $tsize$290$i = 0, $v$0$i = 0, $v$0$i121 = 0, $v$1$i = 0, $v$2$i = 0, $v$3$lcssa$i = 0, $v$329$i = 0;
 var $xor$i$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $cmp = ($bytes>>>0)<(245);
 do {
  if ($cmp) {
   $cmp1 = ($bytes>>>0)<(11);
   if ($cmp1) {
    $cond = 16;
   } else {
    $add2 = (($bytes) + 11)|0;
    $and = $add2 & -8;
    $cond = $and;
   }
   $shr = $cond >>> 3;
   $0 = HEAP32[1424>>2]|0;
   $shr3 = $0 >>> $shr;
   $and4 = $shr3 & 3;
   $cmp5 = ($and4|0)==(0);
   if (!($cmp5)) {
    $neg = $shr3 & 1;
    $and7 = $neg ^ 1;
    $add8 = (($and7) + ($shr))|0;
    $shl = $add8 << 1;
    $arrayidx = ((1424 + ($shl<<2)|0) + 40|0);
    $arrayidx$sum = (($shl) + 2)|0;
    $1 = ((1424 + ($arrayidx$sum<<2)|0) + 40|0);
    $2 = HEAP32[$1>>2]|0;
    $fd9 = (($2) + 8|0);
    $3 = HEAP32[$fd9>>2]|0;
    $cmp10 = ($arrayidx|0)==($3|0);
    do {
     if ($cmp10) {
      $shl12 = 1 << $add8;
      $neg13 = $shl12 ^ -1;
      $and14 = $0 & $neg13;
      HEAP32[1424>>2] = $and14;
     } else {
      $4 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp15 = ($3>>>0)<($4>>>0);
      if ($cmp15) {
       _abort();
       // unreachable;
      }
      $bk = (($3) + 12|0);
      $5 = HEAP32[$bk>>2]|0;
      $cmp16 = ($5|0)==($2|0);
      if ($cmp16) {
       HEAP32[$bk>>2] = $arrayidx;
       HEAP32[$1>>2] = $3;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $shl22 = $add8 << 3;
    $or23 = $shl22 | 3;
    $head = (($2) + 4|0);
    HEAP32[$head>>2] = $or23;
    $add$ptr$sum104 = $shl22 | 4;
    $head25 = (($2) + ($add$ptr$sum104)|0);
    $6 = HEAP32[$head25>>2]|0;
    $or26 = $6 | 1;
    HEAP32[$head25>>2] = $or26;
    $mem$0 = $fd9;
    STACKTOP = sp;return ($mem$0|0);
   }
   $7 = HEAP32[((1424 + 8|0))>>2]|0;
   $cmp29 = ($cond>>>0)>($7>>>0);
   if ($cmp29) {
    $cmp31 = ($shr3|0)==(0);
    if (!($cmp31)) {
     $shl35 = $shr3 << $shr;
     $shl37 = 2 << $shr;
     $sub = (0 - ($shl37))|0;
     $or40 = $shl37 | $sub;
     $and41 = $shl35 & $or40;
     $sub42 = (0 - ($and41))|0;
     $and43 = $and41 & $sub42;
     $sub44 = (($and43) + -1)|0;
     $shr45 = $sub44 >>> 12;
     $and46 = $shr45 & 16;
     $shr47 = $sub44 >>> $and46;
     $shr48 = $shr47 >>> 5;
     $and49 = $shr48 & 8;
     $add50 = $and49 | $and46;
     $shr51 = $shr47 >>> $and49;
     $shr52 = $shr51 >>> 2;
     $and53 = $shr52 & 4;
     $add54 = $add50 | $and53;
     $shr55 = $shr51 >>> $and53;
     $shr56 = $shr55 >>> 1;
     $and57 = $shr56 & 2;
     $add58 = $add54 | $and57;
     $shr59 = $shr55 >>> $and57;
     $shr60 = $shr59 >>> 1;
     $and61 = $shr60 & 1;
     $add62 = $add58 | $and61;
     $shr63 = $shr59 >>> $and61;
     $add64 = (($add62) + ($shr63))|0;
     $shl65 = $add64 << 1;
     $arrayidx66 = ((1424 + ($shl65<<2)|0) + 40|0);
     $arrayidx66$sum = (($shl65) + 2)|0;
     $8 = ((1424 + ($arrayidx66$sum<<2)|0) + 40|0);
     $9 = HEAP32[$8>>2]|0;
     $fd69 = (($9) + 8|0);
     $10 = HEAP32[$fd69>>2]|0;
     $cmp70 = ($arrayidx66|0)==($10|0);
     do {
      if ($cmp70) {
       $shl72 = 1 << $add64;
       $neg73 = $shl72 ^ -1;
       $and74 = $0 & $neg73;
       HEAP32[1424>>2] = $and74;
      } else {
       $11 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp76 = ($10>>>0)<($11>>>0);
       if ($cmp76) {
        _abort();
        // unreachable;
       }
       $bk78 = (($10) + 12|0);
       $12 = HEAP32[$bk78>>2]|0;
       $cmp79 = ($12|0)==($9|0);
       if ($cmp79) {
        HEAP32[$bk78>>2] = $arrayidx66;
        HEAP32[$8>>2] = $10;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $shl90 = $add64 << 3;
     $sub91 = (($shl90) - ($cond))|0;
     $or93 = $cond | 3;
     $head94 = (($9) + 4|0);
     HEAP32[$head94>>2] = $or93;
     $add$ptr95 = (($9) + ($cond)|0);
     $or96 = $sub91 | 1;
     $add$ptr95$sum102 = $cond | 4;
     $head97 = (($9) + ($add$ptr95$sum102)|0);
     HEAP32[$head97>>2] = $or96;
     $add$ptr98 = (($9) + ($shl90)|0);
     HEAP32[$add$ptr98>>2] = $sub91;
     $13 = HEAP32[((1424 + 8|0))>>2]|0;
     $cmp99 = ($13|0)==(0);
     if (!($cmp99)) {
      $14 = HEAP32[((1424 + 20|0))>>2]|0;
      $shr101 = $13 >>> 3;
      $shl102 = $shr101 << 1;
      $arrayidx103 = ((1424 + ($shl102<<2)|0) + 40|0);
      $15 = HEAP32[1424>>2]|0;
      $shl105 = 1 << $shr101;
      $and106 = $15 & $shl105;
      $tobool107 = ($and106|0)==(0);
      if ($tobool107) {
       $or110 = $15 | $shl105;
       HEAP32[1424>>2] = $or110;
       $arrayidx103$sum$pre = (($shl102) + 2)|0;
       $$pre = ((1424 + ($arrayidx103$sum$pre<<2)|0) + 40|0);
       $$pre$phiZ2D = $$pre;$F104$0 = $arrayidx103;
      } else {
       $arrayidx103$sum103 = (($shl102) + 2)|0;
       $16 = ((1424 + ($arrayidx103$sum103<<2)|0) + 40|0);
       $17 = HEAP32[$16>>2]|0;
       $18 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp113 = ($17>>>0)<($18>>>0);
       if ($cmp113) {
        _abort();
        // unreachable;
       } else {
        $$pre$phiZ2D = $16;$F104$0 = $17;
       }
      }
      HEAP32[$$pre$phiZ2D>>2] = $14;
      $bk122 = (($F104$0) + 12|0);
      HEAP32[$bk122>>2] = $14;
      $fd123 = (($14) + 8|0);
      HEAP32[$fd123>>2] = $F104$0;
      $bk124 = (($14) + 12|0);
      HEAP32[$bk124>>2] = $arrayidx103;
     }
     HEAP32[((1424 + 8|0))>>2] = $sub91;
     HEAP32[((1424 + 20|0))>>2] = $add$ptr95;
     $mem$0 = $fd69;
     STACKTOP = sp;return ($mem$0|0);
    }
    $19 = HEAP32[((1424 + 4|0))>>2]|0;
    $cmp128 = ($19|0)==(0);
    if ($cmp128) {
     $nb$0 = $cond;
    } else {
     $sub$i = (0 - ($19))|0;
     $and$i = $19 & $sub$i;
     $sub2$i = (($and$i) + -1)|0;
     $shr$i = $sub2$i >>> 12;
     $and3$i = $shr$i & 16;
     $shr4$i = $sub2$i >>> $and3$i;
     $shr5$i = $shr4$i >>> 5;
     $and6$i = $shr5$i & 8;
     $add$i = $and6$i | $and3$i;
     $shr7$i = $shr4$i >>> $and6$i;
     $shr8$i = $shr7$i >>> 2;
     $and9$i = $shr8$i & 4;
     $add10$i = $add$i | $and9$i;
     $shr11$i = $shr7$i >>> $and9$i;
     $shr12$i = $shr11$i >>> 1;
     $and13$i = $shr12$i & 2;
     $add14$i = $add10$i | $and13$i;
     $shr15$i = $shr11$i >>> $and13$i;
     $shr16$i = $shr15$i >>> 1;
     $and17$i = $shr16$i & 1;
     $add18$i = $add14$i | $and17$i;
     $shr19$i = $shr15$i >>> $and17$i;
     $add20$i = (($add18$i) + ($shr19$i))|0;
     $arrayidx$i = ((1424 + ($add20$i<<2)|0) + 304|0);
     $20 = HEAP32[$arrayidx$i>>2]|0;
     $head$i = (($20) + 4|0);
     $21 = HEAP32[$head$i>>2]|0;
     $and21$i = $21 & -8;
     $sub22$i = (($and21$i) - ($cond))|0;
     $rsize$0$i = $sub22$i;$t$0$i = $20;$v$0$i = $20;
     while(1) {
      $arrayidx23$i = (($t$0$i) + 16|0);
      $22 = HEAP32[$arrayidx23$i>>2]|0;
      $cmp$i = ($22|0)==(0|0);
      if ($cmp$i) {
       $arrayidx27$i = (($t$0$i) + 20|0);
       $23 = HEAP32[$arrayidx27$i>>2]|0;
       $cmp28$i = ($23|0)==(0|0);
       if ($cmp28$i) {
        break;
       } else {
        $cond6$i = $23;
       }
      } else {
       $cond6$i = $22;
      }
      $head29$i = (($cond6$i) + 4|0);
      $24 = HEAP32[$head29$i>>2]|0;
      $and30$i = $24 & -8;
      $sub31$i = (($and30$i) - ($cond))|0;
      $cmp32$i = ($sub31$i>>>0)<($rsize$0$i>>>0);
      $sub31$rsize$0$i = $cmp32$i ? $sub31$i : $rsize$0$i;
      $cond$v$0$i = $cmp32$i ? $cond6$i : $v$0$i;
      $rsize$0$i = $sub31$rsize$0$i;$t$0$i = $cond6$i;$v$0$i = $cond$v$0$i;
     }
     $25 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp33$i = ($v$0$i>>>0)<($25>>>0);
     if ($cmp33$i) {
      _abort();
      // unreachable;
     }
     $add$ptr$i = (($v$0$i) + ($cond)|0);
     $cmp35$i = ($v$0$i>>>0)<($add$ptr$i>>>0);
     if (!($cmp35$i)) {
      _abort();
      // unreachable;
     }
     $parent$i = (($v$0$i) + 24|0);
     $26 = HEAP32[$parent$i>>2]|0;
     $bk$i = (($v$0$i) + 12|0);
     $27 = HEAP32[$bk$i>>2]|0;
     $cmp40$i = ($27|0)==($v$0$i|0);
     do {
      if ($cmp40$i) {
       $arrayidx61$i = (($v$0$i) + 20|0);
       $31 = HEAP32[$arrayidx61$i>>2]|0;
       $cmp62$i = ($31|0)==(0|0);
       if ($cmp62$i) {
        $arrayidx65$i = (($v$0$i) + 16|0);
        $32 = HEAP32[$arrayidx65$i>>2]|0;
        $cmp66$i = ($32|0)==(0|0);
        if ($cmp66$i) {
         $R$1$i = 0;
         break;
        } else {
         $R$0$i = $32;$RP$0$i = $arrayidx65$i;
        }
       } else {
        $R$0$i = $31;$RP$0$i = $arrayidx61$i;
       }
       while(1) {
        $arrayidx71$i = (($R$0$i) + 20|0);
        $33 = HEAP32[$arrayidx71$i>>2]|0;
        $cmp72$i = ($33|0)==(0|0);
        if (!($cmp72$i)) {
         $R$0$i = $33;$RP$0$i = $arrayidx71$i;
         continue;
        }
        $arrayidx75$i = (($R$0$i) + 16|0);
        $34 = HEAP32[$arrayidx75$i>>2]|0;
        $cmp76$i = ($34|0)==(0|0);
        if ($cmp76$i) {
         break;
        } else {
         $R$0$i = $34;$RP$0$i = $arrayidx75$i;
        }
       }
       $cmp81$i = ($RP$0$i>>>0)<($25>>>0);
       if ($cmp81$i) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$RP$0$i>>2] = 0;
        $R$1$i = $R$0$i;
        break;
       }
      } else {
       $fd$i = (($v$0$i) + 8|0);
       $28 = HEAP32[$fd$i>>2]|0;
       $cmp45$i = ($28>>>0)<($25>>>0);
       if ($cmp45$i) {
        _abort();
        // unreachable;
       }
       $bk47$i = (($28) + 12|0);
       $29 = HEAP32[$bk47$i>>2]|0;
       $cmp48$i = ($29|0)==($v$0$i|0);
       if (!($cmp48$i)) {
        _abort();
        // unreachable;
       }
       $fd50$i = (($27) + 8|0);
       $30 = HEAP32[$fd50$i>>2]|0;
       $cmp51$i = ($30|0)==($v$0$i|0);
       if ($cmp51$i) {
        HEAP32[$bk47$i>>2] = $27;
        HEAP32[$fd50$i>>2] = $28;
        $R$1$i = $27;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $cmp90$i = ($26|0)==(0|0);
     do {
      if (!($cmp90$i)) {
       $index$i = (($v$0$i) + 28|0);
       $35 = HEAP32[$index$i>>2]|0;
       $arrayidx94$i = ((1424 + ($35<<2)|0) + 304|0);
       $36 = HEAP32[$arrayidx94$i>>2]|0;
       $cmp95$i = ($v$0$i|0)==($36|0);
       if ($cmp95$i) {
        HEAP32[$arrayidx94$i>>2] = $R$1$i;
        $cond4$i = ($R$1$i|0)==(0|0);
        if ($cond4$i) {
         $shl$i = 1 << $35;
         $neg$i = $shl$i ^ -1;
         $37 = HEAP32[((1424 + 4|0))>>2]|0;
         $and103$i = $37 & $neg$i;
         HEAP32[((1424 + 4|0))>>2] = $and103$i;
         break;
        }
       } else {
        $38 = HEAP32[((1424 + 16|0))>>2]|0;
        $cmp107$i = ($26>>>0)<($38>>>0);
        if ($cmp107$i) {
         _abort();
         // unreachable;
        }
        $arrayidx113$i = (($26) + 16|0);
        $39 = HEAP32[$arrayidx113$i>>2]|0;
        $cmp114$i = ($39|0)==($v$0$i|0);
        if ($cmp114$i) {
         HEAP32[$arrayidx113$i>>2] = $R$1$i;
        } else {
         $arrayidx121$i = (($26) + 20|0);
         HEAP32[$arrayidx121$i>>2] = $R$1$i;
        }
        $cmp126$i = ($R$1$i|0)==(0|0);
        if ($cmp126$i) {
         break;
        }
       }
       $40 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp130$i = ($R$1$i>>>0)<($40>>>0);
       if ($cmp130$i) {
        _abort();
        // unreachable;
       }
       $parent135$i = (($R$1$i) + 24|0);
       HEAP32[$parent135$i>>2] = $26;
       $arrayidx137$i = (($v$0$i) + 16|0);
       $41 = HEAP32[$arrayidx137$i>>2]|0;
       $cmp138$i = ($41|0)==(0|0);
       do {
        if (!($cmp138$i)) {
         $42 = HEAP32[((1424 + 16|0))>>2]|0;
         $cmp142$i = ($41>>>0)<($42>>>0);
         if ($cmp142$i) {
          _abort();
          // unreachable;
         } else {
          $arrayidx148$i = (($R$1$i) + 16|0);
          HEAP32[$arrayidx148$i>>2] = $41;
          $parent149$i = (($41) + 24|0);
          HEAP32[$parent149$i>>2] = $R$1$i;
          break;
         }
        }
       } while(0);
       $arrayidx154$i = (($v$0$i) + 20|0);
       $43 = HEAP32[$arrayidx154$i>>2]|0;
       $cmp155$i = ($43|0)==(0|0);
       if (!($cmp155$i)) {
        $44 = HEAP32[((1424 + 16|0))>>2]|0;
        $cmp159$i = ($43>>>0)<($44>>>0);
        if ($cmp159$i) {
         _abort();
         // unreachable;
        } else {
         $arrayidx165$i = (($R$1$i) + 20|0);
         HEAP32[$arrayidx165$i>>2] = $43;
         $parent166$i = (($43) + 24|0);
         HEAP32[$parent166$i>>2] = $R$1$i;
         break;
        }
       }
      }
     } while(0);
     $cmp174$i = ($rsize$0$i>>>0)<(16);
     if ($cmp174$i) {
      $add177$i = (($rsize$0$i) + ($cond))|0;
      $or178$i = $add177$i | 3;
      $head179$i = (($v$0$i) + 4|0);
      HEAP32[$head179$i>>2] = $or178$i;
      $add$ptr181$sum$i = (($add177$i) + 4)|0;
      $head182$i = (($v$0$i) + ($add$ptr181$sum$i)|0);
      $45 = HEAP32[$head182$i>>2]|0;
      $or183$i = $45 | 1;
      HEAP32[$head182$i>>2] = $or183$i;
     } else {
      $or186$i = $cond | 3;
      $head187$i = (($v$0$i) + 4|0);
      HEAP32[$head187$i>>2] = $or186$i;
      $or188$i = $rsize$0$i | 1;
      $add$ptr$sum$i173 = $cond | 4;
      $head189$i = (($v$0$i) + ($add$ptr$sum$i173)|0);
      HEAP32[$head189$i>>2] = $or188$i;
      $add$ptr$sum1$i = (($rsize$0$i) + ($cond))|0;
      $add$ptr190$i = (($v$0$i) + ($add$ptr$sum1$i)|0);
      HEAP32[$add$ptr190$i>>2] = $rsize$0$i;
      $46 = HEAP32[((1424 + 8|0))>>2]|0;
      $cmp191$i = ($46|0)==(0);
      if (!($cmp191$i)) {
       $47 = HEAP32[((1424 + 20|0))>>2]|0;
       $shr194$i = $46 >>> 3;
       $shl195$i = $shr194$i << 1;
       $arrayidx196$i = ((1424 + ($shl195$i<<2)|0) + 40|0);
       $48 = HEAP32[1424>>2]|0;
       $shl198$i = 1 << $shr194$i;
       $and199$i = $48 & $shl198$i;
       $tobool200$i = ($and199$i|0)==(0);
       if ($tobool200$i) {
        $or204$i = $48 | $shl198$i;
        HEAP32[1424>>2] = $or204$i;
        $arrayidx196$sum$pre$i = (($shl195$i) + 2)|0;
        $$pre$i = ((1424 + ($arrayidx196$sum$pre$i<<2)|0) + 40|0);
        $$pre$phi$iZ2D = $$pre$i;$F197$0$i = $arrayidx196$i;
       } else {
        $arrayidx196$sum2$i = (($shl195$i) + 2)|0;
        $49 = ((1424 + ($arrayidx196$sum2$i<<2)|0) + 40|0);
        $50 = HEAP32[$49>>2]|0;
        $51 = HEAP32[((1424 + 16|0))>>2]|0;
        $cmp208$i = ($50>>>0)<($51>>>0);
        if ($cmp208$i) {
         _abort();
         // unreachable;
        } else {
         $$pre$phi$iZ2D = $49;$F197$0$i = $50;
        }
       }
       HEAP32[$$pre$phi$iZ2D>>2] = $47;
       $bk218$i = (($F197$0$i) + 12|0);
       HEAP32[$bk218$i>>2] = $47;
       $fd219$i = (($47) + 8|0);
       HEAP32[$fd219$i>>2] = $F197$0$i;
       $bk220$i = (($47) + 12|0);
       HEAP32[$bk220$i>>2] = $arrayidx196$i;
      }
      HEAP32[((1424 + 8|0))>>2] = $rsize$0$i;
      HEAP32[((1424 + 20|0))>>2] = $add$ptr$i;
     }
     $add$ptr225$i = (($v$0$i) + 8|0);
     $mem$0 = $add$ptr225$i;
     STACKTOP = sp;return ($mem$0|0);
    }
   } else {
    $nb$0 = $cond;
   }
  } else {
   $cmp138 = ($bytes>>>0)>(4294967231);
   if ($cmp138) {
    $nb$0 = -1;
   } else {
    $add143 = (($bytes) + 11)|0;
    $and144 = $add143 & -8;
    $52 = HEAP32[((1424 + 4|0))>>2]|0;
    $cmp145 = ($52|0)==(0);
    if ($cmp145) {
     $nb$0 = $and144;
    } else {
     $sub$i105 = (0 - ($and144))|0;
     $shr$i106 = $add143 >>> 8;
     $cmp$i107 = ($shr$i106|0)==(0);
     if ($cmp$i107) {
      $idx$0$i = 0;
     } else {
      $cmp1$i = ($and144>>>0)>(16777215);
      if ($cmp1$i) {
       $idx$0$i = 31;
      } else {
       $sub4$i = (($shr$i106) + 1048320)|0;
       $shr5$i109 = $sub4$i >>> 16;
       $and$i110 = $shr5$i109 & 8;
       $shl$i111 = $shr$i106 << $and$i110;
       $sub6$i = (($shl$i111) + 520192)|0;
       $shr7$i112 = $sub6$i >>> 16;
       $and8$i = $shr7$i112 & 4;
       $add$i113 = $and8$i | $and$i110;
       $shl9$i = $shl$i111 << $and8$i;
       $sub10$i = (($shl9$i) + 245760)|0;
       $shr11$i114 = $sub10$i >>> 16;
       $and12$i = $shr11$i114 & 2;
       $add13$i = $add$i113 | $and12$i;
       $sub14$i = (14 - ($add13$i))|0;
       $shl15$i = $shl9$i << $and12$i;
       $shr16$i115 = $shl15$i >>> 15;
       $add17$i = (($sub14$i) + ($shr16$i115))|0;
       $shl18$i = $add17$i << 1;
       $add19$i = (($add17$i) + 7)|0;
       $shr20$i = $and144 >>> $add19$i;
       $and21$i116 = $shr20$i & 1;
       $add22$i = $and21$i116 | $shl18$i;
       $idx$0$i = $add22$i;
      }
     }
     $arrayidx$i117 = ((1424 + ($idx$0$i<<2)|0) + 304|0);
     $53 = HEAP32[$arrayidx$i117>>2]|0;
     $cmp24$i = ($53|0)==(0|0);
     L126: do {
      if ($cmp24$i) {
       $rsize$2$i = $sub$i105;$t$1$i = 0;$v$2$i = 0;
      } else {
       $cmp26$i = ($idx$0$i|0)==(31);
       if ($cmp26$i) {
        $cond$i = 0;
       } else {
        $shr27$i = $idx$0$i >>> 1;
        $sub30$i = (25 - ($shr27$i))|0;
        $cond$i = $sub30$i;
       }
       $shl31$i = $and144 << $cond$i;
       $rsize$0$i120 = $sub$i105;$rst$0$i = 0;$sizebits$0$i = $shl31$i;$t$0$i119 = $53;$v$0$i121 = 0;
       while(1) {
        $head$i122 = (($t$0$i119) + 4|0);
        $54 = HEAP32[$head$i122>>2]|0;
        $and32$i = $54 & -8;
        $sub33$i = (($and32$i) - ($and144))|0;
        $cmp34$i = ($sub33$i>>>0)<($rsize$0$i120>>>0);
        if ($cmp34$i) {
         $cmp36$i = ($and32$i|0)==($and144|0);
         if ($cmp36$i) {
          $rsize$2$i = $sub33$i;$t$1$i = $t$0$i119;$v$2$i = $t$0$i119;
          break L126;
         } else {
          $rsize$1$i = $sub33$i;$v$1$i = $t$0$i119;
         }
        } else {
         $rsize$1$i = $rsize$0$i120;$v$1$i = $v$0$i121;
        }
        $arrayidx40$i = (($t$0$i119) + 20|0);
        $55 = HEAP32[$arrayidx40$i>>2]|0;
        $shr41$i = $sizebits$0$i >>> 31;
        $arrayidx44$i = ((($t$0$i119) + ($shr41$i<<2)|0) + 16|0);
        $56 = HEAP32[$arrayidx44$i>>2]|0;
        $cmp45$i123 = ($55|0)==(0|0);
        $cmp46$i = ($55|0)==($56|0);
        $or$cond$i = $cmp45$i123 | $cmp46$i;
        $rst$1$i = $or$cond$i ? $rst$0$i : $55;
        $cmp49$i = ($56|0)==(0|0);
        $shl52$i = $sizebits$0$i << 1;
        if ($cmp49$i) {
         $rsize$2$i = $rsize$1$i;$t$1$i = $rst$1$i;$v$2$i = $v$1$i;
         break;
        } else {
         $rsize$0$i120 = $rsize$1$i;$rst$0$i = $rst$1$i;$sizebits$0$i = $shl52$i;$t$0$i119 = $56;$v$0$i121 = $v$1$i;
        }
       }
      }
     } while(0);
     $cmp54$i = ($t$1$i|0)==(0|0);
     $cmp56$i = ($v$2$i|0)==(0|0);
     $or$cond16$i = $cmp54$i & $cmp56$i;
     if ($or$cond16$i) {
      $shl59$i = 2 << $idx$0$i;
      $sub62$i = (0 - ($shl59$i))|0;
      $or$i = $shl59$i | $sub62$i;
      $and63$i = $52 & $or$i;
      $cmp64$i = ($and63$i|0)==(0);
      if ($cmp64$i) {
       $nb$0 = $and144;
       break;
      }
      $sub66$i = (0 - ($and63$i))|0;
      $and67$i = $and63$i & $sub66$i;
      $sub69$i = (($and67$i) + -1)|0;
      $shr71$i = $sub69$i >>> 12;
      $and72$i = $shr71$i & 16;
      $shr74$i = $sub69$i >>> $and72$i;
      $shr75$i = $shr74$i >>> 5;
      $and76$i = $shr75$i & 8;
      $add77$i = $and76$i | $and72$i;
      $shr78$i = $shr74$i >>> $and76$i;
      $shr79$i = $shr78$i >>> 2;
      $and80$i = $shr79$i & 4;
      $add81$i = $add77$i | $and80$i;
      $shr82$i = $shr78$i >>> $and80$i;
      $shr83$i = $shr82$i >>> 1;
      $and84$i = $shr83$i & 2;
      $add85$i = $add81$i | $and84$i;
      $shr86$i = $shr82$i >>> $and84$i;
      $shr87$i = $shr86$i >>> 1;
      $and88$i = $shr87$i & 1;
      $add89$i = $add85$i | $and88$i;
      $shr90$i = $shr86$i >>> $and88$i;
      $add91$i = (($add89$i) + ($shr90$i))|0;
      $arrayidx93$i = ((1424 + ($add91$i<<2)|0) + 304|0);
      $57 = HEAP32[$arrayidx93$i>>2]|0;
      $t$2$ph$i = $57;
     } else {
      $t$2$ph$i = $t$1$i;
     }
     $cmp9626$i = ($t$2$ph$i|0)==(0|0);
     if ($cmp9626$i) {
      $rsize$3$lcssa$i = $rsize$2$i;$v$3$lcssa$i = $v$2$i;
     } else {
      $rsize$328$i = $rsize$2$i;$t$227$i = $t$2$ph$i;$v$329$i = $v$2$i;
      while(1) {
       $head98$i = (($t$227$i) + 4|0);
       $58 = HEAP32[$head98$i>>2]|0;
       $and99$i = $58 & -8;
       $sub100$i = (($and99$i) - ($and144))|0;
       $cmp101$i = ($sub100$i>>>0)<($rsize$328$i>>>0);
       $sub100$rsize$3$i = $cmp101$i ? $sub100$i : $rsize$328$i;
       $t$2$v$3$i = $cmp101$i ? $t$227$i : $v$329$i;
       $arrayidx105$i = (($t$227$i) + 16|0);
       $59 = HEAP32[$arrayidx105$i>>2]|0;
       $cmp106$i = ($59|0)==(0|0);
       if (!($cmp106$i)) {
        $rsize$328$i = $sub100$rsize$3$i;$t$227$i = $59;$v$329$i = $t$2$v$3$i;
        continue;
       }
       $arrayidx112$i = (($t$227$i) + 20|0);
       $60 = HEAP32[$arrayidx112$i>>2]|0;
       $cmp96$i = ($60|0)==(0|0);
       if ($cmp96$i) {
        $rsize$3$lcssa$i = $sub100$rsize$3$i;$v$3$lcssa$i = $t$2$v$3$i;
        break;
       } else {
        $rsize$328$i = $sub100$rsize$3$i;$t$227$i = $60;$v$329$i = $t$2$v$3$i;
       }
      }
     }
     $cmp115$i = ($v$3$lcssa$i|0)==(0|0);
     if ($cmp115$i) {
      $nb$0 = $and144;
     } else {
      $61 = HEAP32[((1424 + 8|0))>>2]|0;
      $sub117$i = (($61) - ($and144))|0;
      $cmp118$i = ($rsize$3$lcssa$i>>>0)<($sub117$i>>>0);
      if ($cmp118$i) {
       $62 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp120$i = ($v$3$lcssa$i>>>0)<($62>>>0);
       if ($cmp120$i) {
        _abort();
        // unreachable;
       }
       $add$ptr$i126 = (($v$3$lcssa$i) + ($and144)|0);
       $cmp122$i = ($v$3$lcssa$i>>>0)<($add$ptr$i126>>>0);
       if (!($cmp122$i)) {
        _abort();
        // unreachable;
       }
       $parent$i127 = (($v$3$lcssa$i) + 24|0);
       $63 = HEAP32[$parent$i127>>2]|0;
       $bk$i128 = (($v$3$lcssa$i) + 12|0);
       $64 = HEAP32[$bk$i128>>2]|0;
       $cmp127$i = ($64|0)==($v$3$lcssa$i|0);
       do {
        if ($cmp127$i) {
         $arrayidx150$i = (($v$3$lcssa$i) + 20|0);
         $68 = HEAP32[$arrayidx150$i>>2]|0;
         $cmp151$i = ($68|0)==(0|0);
         if ($cmp151$i) {
          $arrayidx154$i131 = (($v$3$lcssa$i) + 16|0);
          $69 = HEAP32[$arrayidx154$i131>>2]|0;
          $cmp155$i132 = ($69|0)==(0|0);
          if ($cmp155$i132) {
           $R$1$i137 = 0;
           break;
          } else {
           $R$0$i135 = $69;$RP$0$i134 = $arrayidx154$i131;
          }
         } else {
          $R$0$i135 = $68;$RP$0$i134 = $arrayidx150$i;
         }
         while(1) {
          $arrayidx160$i = (($R$0$i135) + 20|0);
          $70 = HEAP32[$arrayidx160$i>>2]|0;
          $cmp161$i = ($70|0)==(0|0);
          if (!($cmp161$i)) {
           $R$0$i135 = $70;$RP$0$i134 = $arrayidx160$i;
           continue;
          }
          $arrayidx164$i = (($R$0$i135) + 16|0);
          $71 = HEAP32[$arrayidx164$i>>2]|0;
          $cmp165$i = ($71|0)==(0|0);
          if ($cmp165$i) {
           break;
          } else {
           $R$0$i135 = $71;$RP$0$i134 = $arrayidx164$i;
          }
         }
         $cmp170$i = ($RP$0$i134>>>0)<($62>>>0);
         if ($cmp170$i) {
          _abort();
          // unreachable;
         } else {
          HEAP32[$RP$0$i134>>2] = 0;
          $R$1$i137 = $R$0$i135;
          break;
         }
        } else {
         $fd$i129 = (($v$3$lcssa$i) + 8|0);
         $65 = HEAP32[$fd$i129>>2]|0;
         $cmp132$i = ($65>>>0)<($62>>>0);
         if ($cmp132$i) {
          _abort();
          // unreachable;
         }
         $bk135$i = (($65) + 12|0);
         $66 = HEAP32[$bk135$i>>2]|0;
         $cmp136$i = ($66|0)==($v$3$lcssa$i|0);
         if (!($cmp136$i)) {
          _abort();
          // unreachable;
         }
         $fd138$i = (($64) + 8|0);
         $67 = HEAP32[$fd138$i>>2]|0;
         $cmp139$i = ($67|0)==($v$3$lcssa$i|0);
         if ($cmp139$i) {
          HEAP32[$bk135$i>>2] = $64;
          HEAP32[$fd138$i>>2] = $65;
          $R$1$i137 = $64;
          break;
         } else {
          _abort();
          // unreachable;
         }
        }
       } while(0);
       $cmp179$i = ($63|0)==(0|0);
       do {
        if (!($cmp179$i)) {
         $index$i138 = (($v$3$lcssa$i) + 28|0);
         $72 = HEAP32[$index$i138>>2]|0;
         $arrayidx183$i = ((1424 + ($72<<2)|0) + 304|0);
         $73 = HEAP32[$arrayidx183$i>>2]|0;
         $cmp184$i = ($v$3$lcssa$i|0)==($73|0);
         if ($cmp184$i) {
          HEAP32[$arrayidx183$i>>2] = $R$1$i137;
          $cond18$i = ($R$1$i137|0)==(0|0);
          if ($cond18$i) {
           $shl191$i = 1 << $72;
           $neg$i139 = $shl191$i ^ -1;
           $74 = HEAP32[((1424 + 4|0))>>2]|0;
           $and193$i = $74 & $neg$i139;
           HEAP32[((1424 + 4|0))>>2] = $and193$i;
           break;
          }
         } else {
          $75 = HEAP32[((1424 + 16|0))>>2]|0;
          $cmp197$i = ($63>>>0)<($75>>>0);
          if ($cmp197$i) {
           _abort();
           // unreachable;
          }
          $arrayidx203$i = (($63) + 16|0);
          $76 = HEAP32[$arrayidx203$i>>2]|0;
          $cmp204$i = ($76|0)==($v$3$lcssa$i|0);
          if ($cmp204$i) {
           HEAP32[$arrayidx203$i>>2] = $R$1$i137;
          } else {
           $arrayidx211$i = (($63) + 20|0);
           HEAP32[$arrayidx211$i>>2] = $R$1$i137;
          }
          $cmp216$i = ($R$1$i137|0)==(0|0);
          if ($cmp216$i) {
           break;
          }
         }
         $77 = HEAP32[((1424 + 16|0))>>2]|0;
         $cmp220$i = ($R$1$i137>>>0)<($77>>>0);
         if ($cmp220$i) {
          _abort();
          // unreachable;
         }
         $parent225$i = (($R$1$i137) + 24|0);
         HEAP32[$parent225$i>>2] = $63;
         $arrayidx227$i = (($v$3$lcssa$i) + 16|0);
         $78 = HEAP32[$arrayidx227$i>>2]|0;
         $cmp228$i = ($78|0)==(0|0);
         do {
          if (!($cmp228$i)) {
           $79 = HEAP32[((1424 + 16|0))>>2]|0;
           $cmp232$i = ($78>>>0)<($79>>>0);
           if ($cmp232$i) {
            _abort();
            // unreachable;
           } else {
            $arrayidx238$i = (($R$1$i137) + 16|0);
            HEAP32[$arrayidx238$i>>2] = $78;
            $parent239$i = (($78) + 24|0);
            HEAP32[$parent239$i>>2] = $R$1$i137;
            break;
           }
          }
         } while(0);
         $arrayidx244$i = (($v$3$lcssa$i) + 20|0);
         $80 = HEAP32[$arrayidx244$i>>2]|0;
         $cmp245$i = ($80|0)==(0|0);
         if (!($cmp245$i)) {
          $81 = HEAP32[((1424 + 16|0))>>2]|0;
          $cmp249$i = ($80>>>0)<($81>>>0);
          if ($cmp249$i) {
           _abort();
           // unreachable;
          } else {
           $arrayidx255$i = (($R$1$i137) + 20|0);
           HEAP32[$arrayidx255$i>>2] = $80;
           $parent256$i = (($80) + 24|0);
           HEAP32[$parent256$i>>2] = $R$1$i137;
           break;
          }
         }
        }
       } while(0);
       $cmp264$i = ($rsize$3$lcssa$i>>>0)<(16);
       L204: do {
        if ($cmp264$i) {
         $add267$i = (($rsize$3$lcssa$i) + ($and144))|0;
         $or269$i = $add267$i | 3;
         $head270$i = (($v$3$lcssa$i) + 4|0);
         HEAP32[$head270$i>>2] = $or269$i;
         $add$ptr272$sum$i = (($add267$i) + 4)|0;
         $head273$i = (($v$3$lcssa$i) + ($add$ptr272$sum$i)|0);
         $82 = HEAP32[$head273$i>>2]|0;
         $or274$i = $82 | 1;
         HEAP32[$head273$i>>2] = $or274$i;
        } else {
         $or277$i = $and144 | 3;
         $head278$i = (($v$3$lcssa$i) + 4|0);
         HEAP32[$head278$i>>2] = $or277$i;
         $or279$i = $rsize$3$lcssa$i | 1;
         $add$ptr$sum$i141172 = $and144 | 4;
         $head280$i = (($v$3$lcssa$i) + ($add$ptr$sum$i141172)|0);
         HEAP32[$head280$i>>2] = $or279$i;
         $add$ptr$sum1$i142 = (($rsize$3$lcssa$i) + ($and144))|0;
         $add$ptr281$i = (($v$3$lcssa$i) + ($add$ptr$sum1$i142)|0);
         HEAP32[$add$ptr281$i>>2] = $rsize$3$lcssa$i;
         $shr282$i = $rsize$3$lcssa$i >>> 3;
         $cmp283$i = ($rsize$3$lcssa$i>>>0)<(256);
         if ($cmp283$i) {
          $shl287$i = $shr282$i << 1;
          $arrayidx288$i = ((1424 + ($shl287$i<<2)|0) + 40|0);
          $83 = HEAP32[1424>>2]|0;
          $shl290$i = 1 << $shr282$i;
          $and291$i = $83 & $shl290$i;
          $tobool292$i = ($and291$i|0)==(0);
          do {
           if ($tobool292$i) {
            $or296$i = $83 | $shl290$i;
            HEAP32[1424>>2] = $or296$i;
            $arrayidx288$sum$pre$i = (($shl287$i) + 2)|0;
            $$pre$i144 = ((1424 + ($arrayidx288$sum$pre$i<<2)|0) + 40|0);
            $$pre$phi$i145Z2D = $$pre$i144;$F289$0$i = $arrayidx288$i;
           } else {
            $arrayidx288$sum15$i = (($shl287$i) + 2)|0;
            $84 = ((1424 + ($arrayidx288$sum15$i<<2)|0) + 40|0);
            $85 = HEAP32[$84>>2]|0;
            $86 = HEAP32[((1424 + 16|0))>>2]|0;
            $cmp300$i = ($85>>>0)<($86>>>0);
            if (!($cmp300$i)) {
             $$pre$phi$i145Z2D = $84;$F289$0$i = $85;
             break;
            }
            _abort();
            // unreachable;
           }
          } while(0);
          HEAP32[$$pre$phi$i145Z2D>>2] = $add$ptr$i126;
          $bk310$i = (($F289$0$i) + 12|0);
          HEAP32[$bk310$i>>2] = $add$ptr$i126;
          $add$ptr$sum13$i = (($and144) + 8)|0;
          $fd311$i = (($v$3$lcssa$i) + ($add$ptr$sum13$i)|0);
          HEAP32[$fd311$i>>2] = $F289$0$i;
          $add$ptr$sum14$i = (($and144) + 12)|0;
          $bk312$i = (($v$3$lcssa$i) + ($add$ptr$sum14$i)|0);
          HEAP32[$bk312$i>>2] = $arrayidx288$i;
          break;
         }
         $shr317$i = $rsize$3$lcssa$i >>> 8;
         $cmp318$i = ($shr317$i|0)==(0);
         if ($cmp318$i) {
          $I315$0$i = 0;
         } else {
          $cmp322$i = ($rsize$3$lcssa$i>>>0)>(16777215);
          if ($cmp322$i) {
           $I315$0$i = 31;
          } else {
           $sub328$i = (($shr317$i) + 1048320)|0;
           $shr329$i = $sub328$i >>> 16;
           $and330$i = $shr329$i & 8;
           $shl332$i = $shr317$i << $and330$i;
           $sub333$i = (($shl332$i) + 520192)|0;
           $shr334$i = $sub333$i >>> 16;
           $and335$i = $shr334$i & 4;
           $add336$i = $and335$i | $and330$i;
           $shl337$i = $shl332$i << $and335$i;
           $sub338$i = (($shl337$i) + 245760)|0;
           $shr339$i = $sub338$i >>> 16;
           $and340$i = $shr339$i & 2;
           $add341$i = $add336$i | $and340$i;
           $sub342$i = (14 - ($add341$i))|0;
           $shl343$i = $shl337$i << $and340$i;
           $shr344$i = $shl343$i >>> 15;
           $add345$i = (($sub342$i) + ($shr344$i))|0;
           $shl346$i = $add345$i << 1;
           $add347$i = (($add345$i) + 7)|0;
           $shr348$i = $rsize$3$lcssa$i >>> $add347$i;
           $and349$i = $shr348$i & 1;
           $add350$i = $and349$i | $shl346$i;
           $I315$0$i = $add350$i;
          }
         }
         $arrayidx354$i = ((1424 + ($I315$0$i<<2)|0) + 304|0);
         $add$ptr$sum2$i = (($and144) + 28)|0;
         $index355$i = (($v$3$lcssa$i) + ($add$ptr$sum2$i)|0);
         HEAP32[$index355$i>>2] = $I315$0$i;
         $add$ptr$sum3$i = (($and144) + 16)|0;
         $child356$i = (($v$3$lcssa$i) + ($add$ptr$sum3$i)|0);
         $child356$sum$i = (($and144) + 20)|0;
         $arrayidx357$i = (($v$3$lcssa$i) + ($child356$sum$i)|0);
         HEAP32[$arrayidx357$i>>2] = 0;
         HEAP32[$child356$i>>2] = 0;
         $87 = HEAP32[((1424 + 4|0))>>2]|0;
         $shl361$i = 1 << $I315$0$i;
         $and362$i = $87 & $shl361$i;
         $tobool363$i = ($and362$i|0)==(0);
         if ($tobool363$i) {
          $or367$i = $87 | $shl361$i;
          HEAP32[((1424 + 4|0))>>2] = $or367$i;
          HEAP32[$arrayidx354$i>>2] = $add$ptr$i126;
          $add$ptr$sum4$i = (($and144) + 24)|0;
          $parent368$i = (($v$3$lcssa$i) + ($add$ptr$sum4$i)|0);
          HEAP32[$parent368$i>>2] = $arrayidx354$i;
          $add$ptr$sum5$i = (($and144) + 12)|0;
          $bk369$i = (($v$3$lcssa$i) + ($add$ptr$sum5$i)|0);
          HEAP32[$bk369$i>>2] = $add$ptr$i126;
          $add$ptr$sum6$i = (($and144) + 8)|0;
          $fd370$i = (($v$3$lcssa$i) + ($add$ptr$sum6$i)|0);
          HEAP32[$fd370$i>>2] = $add$ptr$i126;
          break;
         }
         $88 = HEAP32[$arrayidx354$i>>2]|0;
         $cmp373$i = ($I315$0$i|0)==(31);
         if ($cmp373$i) {
          $cond382$i = 0;
         } else {
          $shr377$i = $I315$0$i >>> 1;
          $sub380$i = (25 - ($shr377$i))|0;
          $cond382$i = $sub380$i;
         }
         $head38520$i = (($88) + 4|0);
         $89 = HEAP32[$head38520$i>>2]|0;
         $and38621$i = $89 & -8;
         $cmp38722$i = ($and38621$i|0)==($rsize$3$lcssa$i|0);
         L225: do {
          if ($cmp38722$i) {
           $T$0$lcssa$i = $88;
          } else {
           $shl383$i = $rsize$3$lcssa$i << $cond382$i;
           $K372$024$i = $shl383$i;$T$023$i = $88;
           while(1) {
            $shr390$i = $K372$024$i >>> 31;
            $arrayidx393$i = ((($T$023$i) + ($shr390$i<<2)|0) + 16|0);
            $90 = HEAP32[$arrayidx393$i>>2]|0;
            $cmp395$i = ($90|0)==(0|0);
            if ($cmp395$i) {
             break;
            }
            $shl394$i = $K372$024$i << 1;
            $head385$i = (($90) + 4|0);
            $91 = HEAP32[$head385$i>>2]|0;
            $and386$i = $91 & -8;
            $cmp387$i = ($and386$i|0)==($rsize$3$lcssa$i|0);
            if ($cmp387$i) {
             $T$0$lcssa$i = $90;
             break L225;
            } else {
             $K372$024$i = $shl394$i;$T$023$i = $90;
            }
           }
           $92 = HEAP32[((1424 + 16|0))>>2]|0;
           $cmp400$i = ($arrayidx393$i>>>0)<($92>>>0);
           if ($cmp400$i) {
            _abort();
            // unreachable;
           } else {
            HEAP32[$arrayidx393$i>>2] = $add$ptr$i126;
            $add$ptr$sum10$i = (($and144) + 24)|0;
            $parent405$i = (($v$3$lcssa$i) + ($add$ptr$sum10$i)|0);
            HEAP32[$parent405$i>>2] = $T$023$i;
            $add$ptr$sum11$i = (($and144) + 12)|0;
            $bk406$i = (($v$3$lcssa$i) + ($add$ptr$sum11$i)|0);
            HEAP32[$bk406$i>>2] = $add$ptr$i126;
            $add$ptr$sum12$i = (($and144) + 8)|0;
            $fd407$i = (($v$3$lcssa$i) + ($add$ptr$sum12$i)|0);
            HEAP32[$fd407$i>>2] = $add$ptr$i126;
            break L204;
           }
          }
         } while(0);
         $fd412$i = (($T$0$lcssa$i) + 8|0);
         $93 = HEAP32[$fd412$i>>2]|0;
         $94 = HEAP32[((1424 + 16|0))>>2]|0;
         $cmp414$i = ($T$0$lcssa$i>>>0)<($94>>>0);
         if ($cmp414$i) {
          _abort();
          // unreachable;
         }
         $cmp418$i = ($93>>>0)<($94>>>0);
         if ($cmp418$i) {
          _abort();
          // unreachable;
         } else {
          $bk425$i = (($93) + 12|0);
          HEAP32[$bk425$i>>2] = $add$ptr$i126;
          HEAP32[$fd412$i>>2] = $add$ptr$i126;
          $add$ptr$sum7$i = (($and144) + 8)|0;
          $fd427$i = (($v$3$lcssa$i) + ($add$ptr$sum7$i)|0);
          HEAP32[$fd427$i>>2] = $93;
          $add$ptr$sum8$i = (($and144) + 12)|0;
          $bk428$i = (($v$3$lcssa$i) + ($add$ptr$sum8$i)|0);
          HEAP32[$bk428$i>>2] = $T$0$lcssa$i;
          $add$ptr$sum9$i = (($and144) + 24)|0;
          $parent429$i = (($v$3$lcssa$i) + ($add$ptr$sum9$i)|0);
          HEAP32[$parent429$i>>2] = 0;
          break;
         }
        }
       } while(0);
       $add$ptr436$i = (($v$3$lcssa$i) + 8|0);
       $mem$0 = $add$ptr436$i;
       STACKTOP = sp;return ($mem$0|0);
      } else {
       $nb$0 = $and144;
      }
     }
    }
   }
  }
 } while(0);
 $95 = HEAP32[((1424 + 8|0))>>2]|0;
 $cmp155 = ($nb$0>>>0)>($95>>>0);
 if (!($cmp155)) {
  $sub159 = (($95) - ($nb$0))|0;
  $96 = HEAP32[((1424 + 20|0))>>2]|0;
  $cmp161 = ($sub159>>>0)>(15);
  if ($cmp161) {
   $add$ptr165 = (($96) + ($nb$0)|0);
   HEAP32[((1424 + 20|0))>>2] = $add$ptr165;
   HEAP32[((1424 + 8|0))>>2] = $sub159;
   $or166 = $sub159 | 1;
   $add$ptr165$sum = (($nb$0) + 4)|0;
   $head167 = (($96) + ($add$ptr165$sum)|0);
   HEAP32[$head167>>2] = $or166;
   $add$ptr168 = (($96) + ($95)|0);
   HEAP32[$add$ptr168>>2] = $sub159;
   $or171 = $nb$0 | 3;
   $head172 = (($96) + 4|0);
   HEAP32[$head172>>2] = $or171;
  } else {
   HEAP32[((1424 + 8|0))>>2] = 0;
   HEAP32[((1424 + 20|0))>>2] = 0;
   $or175 = $95 | 3;
   $head176 = (($96) + 4|0);
   HEAP32[$head176>>2] = $or175;
   $add$ptr177$sum = (($95) + 4)|0;
   $head178 = (($96) + ($add$ptr177$sum)|0);
   $97 = HEAP32[$head178>>2]|0;
   $or179 = $97 | 1;
   HEAP32[$head178>>2] = $or179;
  }
  $add$ptr181 = (($96) + 8|0);
  $mem$0 = $add$ptr181;
  STACKTOP = sp;return ($mem$0|0);
 }
 $98 = HEAP32[((1424 + 12|0))>>2]|0;
 $cmp183 = ($nb$0>>>0)<($98>>>0);
 if ($cmp183) {
  $sub187 = (($98) - ($nb$0))|0;
  HEAP32[((1424 + 12|0))>>2] = $sub187;
  $99 = HEAP32[((1424 + 24|0))>>2]|0;
  $add$ptr190 = (($99) + ($nb$0)|0);
  HEAP32[((1424 + 24|0))>>2] = $add$ptr190;
  $or191 = $sub187 | 1;
  $add$ptr190$sum = (($nb$0) + 4)|0;
  $head192 = (($99) + ($add$ptr190$sum)|0);
  HEAP32[$head192>>2] = $or191;
  $or194 = $nb$0 | 3;
  $head195 = (($99) + 4|0);
  HEAP32[$head195>>2] = $or194;
  $add$ptr196 = (($99) + 8|0);
  $mem$0 = $add$ptr196;
  STACKTOP = sp;return ($mem$0|0);
 }
 $100 = HEAP32[1896>>2]|0;
 $cmp$i146 = ($100|0)==(0);
 do {
  if ($cmp$i146) {
   $call$i$i = (_sysconf(30)|0);
   $sub$i$i = (($call$i$i) + -1)|0;
   $and$i$i = $sub$i$i & $call$i$i;
   $cmp1$i$i = ($and$i$i|0)==(0);
   if ($cmp1$i$i) {
    HEAP32[((1896 + 8|0))>>2] = $call$i$i;
    HEAP32[((1896 + 4|0))>>2] = $call$i$i;
    HEAP32[((1896 + 12|0))>>2] = -1;
    HEAP32[((1896 + 16|0))>>2] = -1;
    HEAP32[((1896 + 20|0))>>2] = 0;
    HEAP32[((1424 + 444|0))>>2] = 0;
    $call6$i$i = (_time((0|0))|0);
    $xor$i$i = $call6$i$i & -16;
    $and7$i$i = $xor$i$i ^ 1431655768;
    HEAP32[1896>>2] = $and7$i$i;
    break;
   } else {
    _abort();
    // unreachable;
   }
  }
 } while(0);
 $add$i147 = (($nb$0) + 48)|0;
 $101 = HEAP32[((1896 + 8|0))>>2]|0;
 $sub$i148 = (($nb$0) + 47)|0;
 $add9$i = (($101) + ($sub$i148))|0;
 $neg$i149 = (0 - ($101))|0;
 $and11$i = $add9$i & $neg$i149;
 $cmp12$i = ($and11$i>>>0)>($nb$0>>>0);
 if (!($cmp12$i)) {
  $mem$0 = 0;
  STACKTOP = sp;return ($mem$0|0);
 }
 $102 = HEAP32[((1424 + 440|0))>>2]|0;
 $cmp15$i = ($102|0)==(0);
 if (!($cmp15$i)) {
  $103 = HEAP32[((1424 + 432|0))>>2]|0;
  $add17$i150 = (($103) + ($and11$i))|0;
  $cmp19$i = ($add17$i150>>>0)<=($103>>>0);
  $cmp21$i = ($add17$i150>>>0)>($102>>>0);
  $or$cond1$i = $cmp19$i | $cmp21$i;
  if ($or$cond1$i) {
   $mem$0 = 0;
   STACKTOP = sp;return ($mem$0|0);
  }
 }
 $104 = HEAP32[((1424 + 444|0))>>2]|0;
 $and26$i = $104 & 4;
 $tobool27$i = ($and26$i|0)==(0);
 L269: do {
  if ($tobool27$i) {
   $105 = HEAP32[((1424 + 24|0))>>2]|0;
   $cmp29$i = ($105|0)==(0|0);
   L271: do {
    if ($cmp29$i) {
     label = 182;
    } else {
     $sp$0$i$i = ((1424 + 448|0));
     while(1) {
      $106 = HEAP32[$sp$0$i$i>>2]|0;
      $cmp$i9$i = ($106>>>0)>($105>>>0);
      if (!($cmp$i9$i)) {
       $size$i$i = (($sp$0$i$i) + 4|0);
       $107 = HEAP32[$size$i$i>>2]|0;
       $add$ptr$i$i = (($106) + ($107)|0);
       $cmp2$i$i = ($add$ptr$i$i>>>0)>($105>>>0);
       if ($cmp2$i$i) {
        break;
       }
      }
      $next$i$i = (($sp$0$i$i) + 8|0);
      $108 = HEAP32[$next$i$i>>2]|0;
      $cmp3$i$i = ($108|0)==(0|0);
      if ($cmp3$i$i) {
       label = 182;
       break L271;
      } else {
       $sp$0$i$i = $108;
      }
     }
     $cmp32$i152 = ($sp$0$i$i|0)==(0|0);
     if ($cmp32$i152) {
      label = 182;
     } else {
      $113 = HEAP32[((1424 + 12|0))>>2]|0;
      $add74$i = (($add9$i) - ($113))|0;
      $and77$i = $add74$i & $neg$i149;
      $cmp78$i = ($and77$i>>>0)<(2147483647);
      if ($cmp78$i) {
       $call80$i = (_sbrk(($and77$i|0))|0);
       $114 = HEAP32[$sp$0$i$i>>2]|0;
       $115 = HEAP32[$size$i$i>>2]|0;
       $add$ptr$i160 = (($114) + ($115)|0);
       $cmp82$i = ($call80$i|0)==($add$ptr$i160|0);
       $and77$$i = $cmp82$i ? $and77$i : 0;
       $call80$$i = $cmp82$i ? $call80$i : (-1);
       $br$0$i = $call80$i;$ssize$1$i = $and77$i;$tbase$0$i = $call80$$i;$tsize$0$i = $and77$$i;
       label = 191;
      } else {
       $tsize$0748284$i = 0;
      }
     }
    }
   } while(0);
   do {
    if ((label|0) == 182) {
     $call34$i = (_sbrk(0)|0);
     $cmp35$i154 = ($call34$i|0)==((-1)|0);
     if ($cmp35$i154) {
      $tsize$0748284$i = 0;
     } else {
      $109 = $call34$i;
      $110 = HEAP32[((1896 + 4|0))>>2]|0;
      $sub38$i = (($110) + -1)|0;
      $and39$i = $sub38$i & $109;
      $cmp40$i155 = ($and39$i|0)==(0);
      if ($cmp40$i155) {
       $ssize$0$i = $and11$i;
      } else {
       $add43$i = (($sub38$i) + ($109))|0;
       $neg45$i = (0 - ($110))|0;
       $and46$i = $add43$i & $neg45$i;
       $sub47$i = (($and11$i) - ($109))|0;
       $add48$i = (($sub47$i) + ($and46$i))|0;
       $ssize$0$i = $add48$i;
      }
      $111 = HEAP32[((1424 + 432|0))>>2]|0;
      $add51$i = (($111) + ($ssize$0$i))|0;
      $cmp52$i = ($ssize$0$i>>>0)>($nb$0>>>0);
      $cmp54$i156 = ($ssize$0$i>>>0)<(2147483647);
      $or$cond$i157 = $cmp52$i & $cmp54$i156;
      if ($or$cond$i157) {
       $112 = HEAP32[((1424 + 440|0))>>2]|0;
       $cmp57$i = ($112|0)==(0);
       if (!($cmp57$i)) {
        $cmp60$i = ($add51$i>>>0)<=($111>>>0);
        $cmp63$i = ($add51$i>>>0)>($112>>>0);
        $or$cond2$i = $cmp60$i | $cmp63$i;
        if ($or$cond2$i) {
         $tsize$0748284$i = 0;
         break;
        }
       }
       $call65$i = (_sbrk(($ssize$0$i|0))|0);
       $cmp66$i158 = ($call65$i|0)==($call34$i|0);
       $ssize$0$$i = $cmp66$i158 ? $ssize$0$i : 0;
       $call34$$i = $cmp66$i158 ? $call34$i : (-1);
       $br$0$i = $call65$i;$ssize$1$i = $ssize$0$i;$tbase$0$i = $call34$$i;$tsize$0$i = $ssize$0$$i;
       label = 191;
      } else {
       $tsize$0748284$i = 0;
      }
     }
    }
   } while(0);
   L291: do {
    if ((label|0) == 191) {
     $sub109$i = (0 - ($ssize$1$i))|0;
     $cmp86$i = ($tbase$0$i|0)==((-1)|0);
     if (!($cmp86$i)) {
      $tbase$291$i = $tbase$0$i;$tsize$290$i = $tsize$0$i;
      label = 202;
      break L269;
     }
     $cmp88$i = ($br$0$i|0)!=((-1)|0);
     $cmp90$i161 = ($ssize$1$i>>>0)<(2147483647);
     $or$cond3$i = $cmp88$i & $cmp90$i161;
     $cmp93$i = ($ssize$1$i>>>0)<($add$i147>>>0);
     $or$cond4$i = $or$cond3$i & $cmp93$i;
     do {
      if ($or$cond4$i) {
       $116 = HEAP32[((1896 + 8|0))>>2]|0;
       $sub96$i = (($sub$i148) - ($ssize$1$i))|0;
       $add98$i = (($sub96$i) + ($116))|0;
       $neg100$i = (0 - ($116))|0;
       $and101$i = $add98$i & $neg100$i;
       $cmp102$i = ($and101$i>>>0)<(2147483647);
       if ($cmp102$i) {
        $call104$i = (_sbrk(($and101$i|0))|0);
        $cmp105$i = ($call104$i|0)==((-1)|0);
        if ($cmp105$i) {
         (_sbrk(($sub109$i|0))|0);
         $tsize$0748284$i = $tsize$0$i;
         break L291;
        } else {
         $add107$i = (($and101$i) + ($ssize$1$i))|0;
         $ssize$2$i = $add107$i;
         break;
        }
       } else {
        $ssize$2$i = $ssize$1$i;
       }
      } else {
       $ssize$2$i = $ssize$1$i;
      }
     } while(0);
     $cmp115$i162 = ($br$0$i|0)==((-1)|0);
     if ($cmp115$i162) {
      $tsize$0748284$i = $tsize$0$i;
     } else {
      $tbase$291$i = $br$0$i;$tsize$290$i = $ssize$2$i;
      label = 202;
      break L269;
     }
    }
   } while(0);
   $117 = HEAP32[((1424 + 444|0))>>2]|0;
   $or$i163 = $117 | 4;
   HEAP32[((1424 + 444|0))>>2] = $or$i163;
   $tsize$1$i = $tsize$0748284$i;
   label = 199;
  } else {
   $tsize$1$i = 0;
   label = 199;
  }
 } while(0);
 if ((label|0) == 199) {
  $cmp124$i = ($and11$i>>>0)<(2147483647);
  if ($cmp124$i) {
   $call128$i = (_sbrk(($and11$i|0))|0);
   $call129$i = (_sbrk(0)|0);
   $notlhs$i = ($call128$i|0)!=((-1)|0);
   $notrhs$i = ($call129$i|0)!=((-1)|0);
   $or$cond6$not$i = $notrhs$i & $notlhs$i;
   $cmp134$i = ($call128$i>>>0)<($call129$i>>>0);
   $or$cond7$i = $or$cond6$not$i & $cmp134$i;
   if ($or$cond7$i) {
    $sub$ptr$lhs$cast$i = $call129$i;
    $sub$ptr$rhs$cast$i = $call128$i;
    $sub$ptr$sub$i = (($sub$ptr$lhs$cast$i) - ($sub$ptr$rhs$cast$i))|0;
    $add137$i = (($nb$0) + 40)|0;
    $cmp138$i164 = ($sub$ptr$sub$i>>>0)>($add137$i>>>0);
    $sub$ptr$sub$tsize$1$i = $cmp138$i164 ? $sub$ptr$sub$i : $tsize$1$i;
    if ($cmp138$i164) {
     $tbase$291$i = $call128$i;$tsize$290$i = $sub$ptr$sub$tsize$1$i;
     label = 202;
    }
   }
  }
 }
 if ((label|0) == 202) {
  $118 = HEAP32[((1424 + 432|0))>>2]|0;
  $add147$i = (($118) + ($tsize$290$i))|0;
  HEAP32[((1424 + 432|0))>>2] = $add147$i;
  $119 = HEAP32[((1424 + 436|0))>>2]|0;
  $cmp148$i = ($add147$i>>>0)>($119>>>0);
  if ($cmp148$i) {
   HEAP32[((1424 + 436|0))>>2] = $add147$i;
  }
  $120 = HEAP32[((1424 + 24|0))>>2]|0;
  $cmp154$i = ($120|0)==(0|0);
  L311: do {
   if ($cmp154$i) {
    $121 = HEAP32[((1424 + 16|0))>>2]|0;
    $cmp156$i = ($121|0)==(0|0);
    $cmp159$i166 = ($tbase$291$i>>>0)<($121>>>0);
    $or$cond8$i = $cmp156$i | $cmp159$i166;
    if ($or$cond8$i) {
     HEAP32[((1424 + 16|0))>>2] = $tbase$291$i;
    }
    HEAP32[((1424 + 448|0))>>2] = $tbase$291$i;
    HEAP32[((1424 + 452|0))>>2] = $tsize$290$i;
    HEAP32[((1424 + 460|0))>>2] = 0;
    $122 = HEAP32[1896>>2]|0;
    HEAP32[((1424 + 36|0))>>2] = $122;
    HEAP32[((1424 + 32|0))>>2] = -1;
    $i$02$i$i = 0;
    while(1) {
     $shl$i$i = $i$02$i$i << 1;
     $arrayidx$i$i = ((1424 + ($shl$i$i<<2)|0) + 40|0);
     $arrayidx$sum$i$i = (($shl$i$i) + 3)|0;
     $123 = ((1424 + ($arrayidx$sum$i$i<<2)|0) + 40|0);
     HEAP32[$123>>2] = $arrayidx$i$i;
     $arrayidx$sum1$i$i = (($shl$i$i) + 2)|0;
     $124 = ((1424 + ($arrayidx$sum1$i$i<<2)|0) + 40|0);
     HEAP32[$124>>2] = $arrayidx$i$i;
     $inc$i$i = (($i$02$i$i) + 1)|0;
     $exitcond$i$i = ($inc$i$i|0)==(32);
     if ($exitcond$i$i) {
      break;
     } else {
      $i$02$i$i = $inc$i$i;
     }
    }
    $sub169$i = (($tsize$290$i) + -40)|0;
    $add$ptr$i11$i = (($tbase$291$i) + 8|0);
    $125 = $add$ptr$i11$i;
    $and$i12$i = $125 & 7;
    $cmp$i13$i = ($and$i12$i|0)==(0);
    if ($cmp$i13$i) {
     $cond$i$i = 0;
    } else {
     $126 = (0 - ($125))|0;
     $and3$i$i = $126 & 7;
     $cond$i$i = $and3$i$i;
    }
    $add$ptr4$i$i = (($tbase$291$i) + ($cond$i$i)|0);
    $sub5$i$i = (($sub169$i) - ($cond$i$i))|0;
    HEAP32[((1424 + 24|0))>>2] = $add$ptr4$i$i;
    HEAP32[((1424 + 12|0))>>2] = $sub5$i$i;
    $or$i$i = $sub5$i$i | 1;
    $add$ptr4$sum$i$i = (($cond$i$i) + 4)|0;
    $head$i$i = (($tbase$291$i) + ($add$ptr4$sum$i$i)|0);
    HEAP32[$head$i$i>>2] = $or$i$i;
    $add$ptr6$sum$i$i = (($tsize$290$i) + -36)|0;
    $head7$i$i = (($tbase$291$i) + ($add$ptr6$sum$i$i)|0);
    HEAP32[$head7$i$i>>2] = 40;
    $127 = HEAP32[((1896 + 16|0))>>2]|0;
    HEAP32[((1424 + 28|0))>>2] = $127;
   } else {
    $sp$0109$i = ((1424 + 448|0));
    while(1) {
     $128 = HEAP32[$sp$0109$i>>2]|0;
     $size185$i = (($sp$0109$i) + 4|0);
     $129 = HEAP32[$size185$i>>2]|0;
     $add$ptr186$i = (($128) + ($129)|0);
     $cmp187$i = ($tbase$291$i|0)==($add$ptr186$i|0);
     if ($cmp187$i) {
      label = 214;
      break;
     }
     $next$i = (($sp$0109$i) + 8|0);
     $130 = HEAP32[$next$i>>2]|0;
     $cmp183$i = ($130|0)==(0|0);
     if ($cmp183$i) {
      break;
     } else {
      $sp$0109$i = $130;
     }
    }
    if ((label|0) == 214) {
     $sflags190$i = (($sp$0109$i) + 12|0);
     $131 = HEAP32[$sflags190$i>>2]|0;
     $and191$i = $131 & 8;
     $tobool192$i = ($and191$i|0)==(0);
     if ($tobool192$i) {
      $cmp200$i = ($120>>>0)>=($128>>>0);
      $cmp206$i = ($120>>>0)<($tbase$291$i>>>0);
      $or$cond93$i = $cmp200$i & $cmp206$i;
      if ($or$cond93$i) {
       $add209$i = (($129) + ($tsize$290$i))|0;
       HEAP32[$size185$i>>2] = $add209$i;
       $132 = HEAP32[((1424 + 12|0))>>2]|0;
       $add212$i = (($132) + ($tsize$290$i))|0;
       $add$ptr$i22$i = (($120) + 8|0);
       $133 = $add$ptr$i22$i;
       $and$i23$i = $133 & 7;
       $cmp$i24$i = ($and$i23$i|0)==(0);
       if ($cmp$i24$i) {
        $cond$i27$i = 0;
       } else {
        $134 = (0 - ($133))|0;
        $and3$i25$i = $134 & 7;
        $cond$i27$i = $and3$i25$i;
       }
       $add$ptr4$i28$i = (($120) + ($cond$i27$i)|0);
       $sub5$i29$i = (($add212$i) - ($cond$i27$i))|0;
       HEAP32[((1424 + 24|0))>>2] = $add$ptr4$i28$i;
       HEAP32[((1424 + 12|0))>>2] = $sub5$i29$i;
       $or$i30$i = $sub5$i29$i | 1;
       $add$ptr4$sum$i31$i = (($cond$i27$i) + 4)|0;
       $head$i32$i = (($120) + ($add$ptr4$sum$i31$i)|0);
       HEAP32[$head$i32$i>>2] = $or$i30$i;
       $add$ptr6$sum$i33$i = (($add212$i) + 4)|0;
       $head7$i34$i = (($120) + ($add$ptr6$sum$i33$i)|0);
       HEAP32[$head7$i34$i>>2] = 40;
       $135 = HEAP32[((1896 + 16|0))>>2]|0;
       HEAP32[((1424 + 28|0))>>2] = $135;
       break;
      }
     }
    }
    $136 = HEAP32[((1424 + 16|0))>>2]|0;
    $cmp215$i = ($tbase$291$i>>>0)<($136>>>0);
    if ($cmp215$i) {
     HEAP32[((1424 + 16|0))>>2] = $tbase$291$i;
    }
    $add$ptr224$i = (($tbase$291$i) + ($tsize$290$i)|0);
    $sp$1105$i = ((1424 + 448|0));
    while(1) {
     $137 = HEAP32[$sp$1105$i>>2]|0;
     $cmp225$i = ($137|0)==($add$ptr224$i|0);
     if ($cmp225$i) {
      label = 224;
      break;
     }
     $next228$i = (($sp$1105$i) + 8|0);
     $138 = HEAP32[$next228$i>>2]|0;
     $cmp221$i = ($138|0)==(0|0);
     if ($cmp221$i) {
      break;
     } else {
      $sp$1105$i = $138;
     }
    }
    if ((label|0) == 224) {
     $sflags232$i = (($sp$1105$i) + 12|0);
     $139 = HEAP32[$sflags232$i>>2]|0;
     $and233$i = $139 & 8;
     $tobool234$i = ($and233$i|0)==(0);
     if ($tobool234$i) {
      HEAP32[$sp$1105$i>>2] = $tbase$291$i;
      $size242$i = (($sp$1105$i) + 4|0);
      $140 = HEAP32[$size242$i>>2]|0;
      $add243$i = (($140) + ($tsize$290$i))|0;
      HEAP32[$size242$i>>2] = $add243$i;
      $add$ptr$i37$i = (($tbase$291$i) + 8|0);
      $141 = $add$ptr$i37$i;
      $and$i38$i = $141 & 7;
      $cmp$i39$i = ($and$i38$i|0)==(0);
      if ($cmp$i39$i) {
       $cond$i42$i = 0;
      } else {
       $142 = (0 - ($141))|0;
       $and3$i40$i = $142 & 7;
       $cond$i42$i = $and3$i40$i;
      }
      $add$ptr4$i43$i = (($tbase$291$i) + ($cond$i42$i)|0);
      $add$ptr224$sum$i = (($tsize$290$i) + 8)|0;
      $add$ptr5$i$i = (($tbase$291$i) + ($add$ptr224$sum$i)|0);
      $143 = $add$ptr5$i$i;
      $and6$i44$i = $143 & 7;
      $cmp7$i$i = ($and6$i44$i|0)==(0);
      if ($cmp7$i$i) {
       $cond15$i$i = 0;
      } else {
       $144 = (0 - ($143))|0;
       $and13$i$i = $144 & 7;
       $cond15$i$i = $and13$i$i;
      }
      $add$ptr224$sum131$i = (($cond15$i$i) + ($tsize$290$i))|0;
      $add$ptr16$i$i = (($tbase$291$i) + ($add$ptr224$sum131$i)|0);
      $sub$ptr$lhs$cast$i46$i = $add$ptr16$i$i;
      $sub$ptr$rhs$cast$i47$i = $add$ptr4$i43$i;
      $sub$ptr$sub$i48$i = (($sub$ptr$lhs$cast$i46$i) - ($sub$ptr$rhs$cast$i47$i))|0;
      $add$ptr4$sum$i49$i = (($cond$i42$i) + ($nb$0))|0;
      $add$ptr17$i$i = (($tbase$291$i) + ($add$ptr4$sum$i49$i)|0);
      $sub18$i$i = (($sub$ptr$sub$i48$i) - ($nb$0))|0;
      $or19$i$i = $nb$0 | 3;
      $add$ptr4$sum1$i$i = (($cond$i42$i) + 4)|0;
      $head$i50$i = (($tbase$291$i) + ($add$ptr4$sum1$i$i)|0);
      HEAP32[$head$i50$i>>2] = $or19$i$i;
      $145 = HEAP32[((1424 + 24|0))>>2]|0;
      $cmp20$i$i = ($add$ptr16$i$i|0)==($145|0);
      L348: do {
       if ($cmp20$i$i) {
        $146 = HEAP32[((1424 + 12|0))>>2]|0;
        $add$i$i = (($146) + ($sub18$i$i))|0;
        HEAP32[((1424 + 12|0))>>2] = $add$i$i;
        HEAP32[((1424 + 24|0))>>2] = $add$ptr17$i$i;
        $or22$i$i = $add$i$i | 1;
        $add$ptr17$sum35$i$i = (($add$ptr4$sum$i49$i) + 4)|0;
        $head23$i$i = (($tbase$291$i) + ($add$ptr17$sum35$i$i)|0);
        HEAP32[$head23$i$i>>2] = $or22$i$i;
       } else {
        $147 = HEAP32[((1424 + 20|0))>>2]|0;
        $cmp24$i$i = ($add$ptr16$i$i|0)==($147|0);
        if ($cmp24$i$i) {
         $148 = HEAP32[((1424 + 8|0))>>2]|0;
         $add26$i$i = (($148) + ($sub18$i$i))|0;
         HEAP32[((1424 + 8|0))>>2] = $add26$i$i;
         HEAP32[((1424 + 20|0))>>2] = $add$ptr17$i$i;
         $or28$i$i = $add26$i$i | 1;
         $add$ptr17$sum33$i$i = (($add$ptr4$sum$i49$i) + 4)|0;
         $head29$i$i = (($tbase$291$i) + ($add$ptr17$sum33$i$i)|0);
         HEAP32[$head29$i$i>>2] = $or28$i$i;
         $add$ptr17$sum34$i$i = (($add26$i$i) + ($add$ptr4$sum$i49$i))|0;
         $add$ptr30$i52$i = (($tbase$291$i) + ($add$ptr17$sum34$i$i)|0);
         HEAP32[$add$ptr30$i52$i>>2] = $add26$i$i;
         break;
        }
        $add$ptr16$sum$i$i = (($tsize$290$i) + 4)|0;
        $add$ptr224$sum132$i = (($add$ptr16$sum$i$i) + ($cond15$i$i))|0;
        $head32$i$i = (($tbase$291$i) + ($add$ptr224$sum132$i)|0);
        $149 = HEAP32[$head32$i$i>>2]|0;
        $and33$i$i = $149 & 3;
        $cmp34$i$i = ($and33$i$i|0)==(1);
        if ($cmp34$i$i) {
         $and37$i$i = $149 & -8;
         $shr$i54$i = $149 >>> 3;
         $cmp38$i$i = ($149>>>0)<(256);
         L356: do {
          if ($cmp38$i$i) {
           $add$ptr16$sum3031$i$i = $cond15$i$i | 8;
           $add$ptr224$sum142$i = (($add$ptr16$sum3031$i$i) + ($tsize$290$i))|0;
           $fd$i$i = (($tbase$291$i) + ($add$ptr224$sum142$i)|0);
           $150 = HEAP32[$fd$i$i>>2]|0;
           $add$ptr16$sum32$i$i = (($tsize$290$i) + 12)|0;
           $add$ptr224$sum143$i = (($add$ptr16$sum32$i$i) + ($cond15$i$i))|0;
           $bk$i55$i = (($tbase$291$i) + ($add$ptr224$sum143$i)|0);
           $151 = HEAP32[$bk$i55$i>>2]|0;
           $shl$i56$i = $shr$i54$i << 1;
           $arrayidx$i57$i = ((1424 + ($shl$i56$i<<2)|0) + 40|0);
           $cmp41$i$i = ($150|0)==($arrayidx$i57$i|0);
           do {
            if (!($cmp41$i$i)) {
             $152 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp42$i$i = ($150>>>0)<($152>>>0);
             if ($cmp42$i$i) {
              _abort();
              // unreachable;
             }
             $bk43$i$i = (($150) + 12|0);
             $153 = HEAP32[$bk43$i$i>>2]|0;
             $cmp44$i$i = ($153|0)==($add$ptr16$i$i|0);
             if ($cmp44$i$i) {
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $cmp46$i59$i = ($151|0)==($150|0);
           if ($cmp46$i59$i) {
            $shl48$i$i = 1 << $shr$i54$i;
            $neg$i$i = $shl48$i$i ^ -1;
            $154 = HEAP32[1424>>2]|0;
            $and49$i$i = $154 & $neg$i$i;
            HEAP32[1424>>2] = $and49$i$i;
            break;
           }
           $cmp54$i$i = ($151|0)==($arrayidx$i57$i|0);
           do {
            if ($cmp54$i$i) {
             $fd68$pre$i$i = (($151) + 8|0);
             $fd68$pre$phi$i$iZ2D = $fd68$pre$i$i;
            } else {
             $155 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp57$i$i = ($151>>>0)<($155>>>0);
             if ($cmp57$i$i) {
              _abort();
              // unreachable;
             }
             $fd59$i$i = (($151) + 8|0);
             $156 = HEAP32[$fd59$i$i>>2]|0;
             $cmp60$i$i = ($156|0)==($add$ptr16$i$i|0);
             if ($cmp60$i$i) {
              $fd68$pre$phi$i$iZ2D = $fd59$i$i;
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $bk67$i$i = (($150) + 12|0);
           HEAP32[$bk67$i$i>>2] = $151;
           HEAP32[$fd68$pre$phi$i$iZ2D>>2] = $150;
          } else {
           $add$ptr16$sum23$i$i = $cond15$i$i | 24;
           $add$ptr224$sum133$i = (($add$ptr16$sum23$i$i) + ($tsize$290$i))|0;
           $parent$i61$i = (($tbase$291$i) + ($add$ptr224$sum133$i)|0);
           $157 = HEAP32[$parent$i61$i>>2]|0;
           $add$ptr16$sum4$i$i = (($tsize$290$i) + 12)|0;
           $add$ptr224$sum134$i = (($add$ptr16$sum4$i$i) + ($cond15$i$i))|0;
           $bk74$i$i = (($tbase$291$i) + ($add$ptr224$sum134$i)|0);
           $158 = HEAP32[$bk74$i$i>>2]|0;
           $cmp75$i$i = ($158|0)==($add$ptr16$i$i|0);
           do {
            if ($cmp75$i$i) {
             $add$ptr16$sum56$i$i = $cond15$i$i | 16;
             $add$ptr224$sum140$i = (($add$ptr16$sum$i$i) + ($add$ptr16$sum56$i$i))|0;
             $arrayidx96$i$i = (($tbase$291$i) + ($add$ptr224$sum140$i)|0);
             $163 = HEAP32[$arrayidx96$i$i>>2]|0;
             $cmp97$i$i = ($163|0)==(0|0);
             if ($cmp97$i$i) {
              $add$ptr224$sum141$i = (($add$ptr16$sum56$i$i) + ($tsize$290$i))|0;
              $child$i$i = (($tbase$291$i) + ($add$ptr224$sum141$i)|0);
              $164 = HEAP32[$child$i$i>>2]|0;
              $cmp100$i$i = ($164|0)==(0|0);
              if ($cmp100$i$i) {
               $R$1$i$i = 0;
               break;
              } else {
               $R$0$i$i = $164;$RP$0$i$i = $child$i$i;
              }
             } else {
              $R$0$i$i = $163;$RP$0$i$i = $arrayidx96$i$i;
             }
             while(1) {
              $arrayidx103$i$i = (($R$0$i$i) + 20|0);
              $165 = HEAP32[$arrayidx103$i$i>>2]|0;
              $cmp104$i$i = ($165|0)==(0|0);
              if (!($cmp104$i$i)) {
               $R$0$i$i = $165;$RP$0$i$i = $arrayidx103$i$i;
               continue;
              }
              $arrayidx107$i$i = (($R$0$i$i) + 16|0);
              $166 = HEAP32[$arrayidx107$i$i>>2]|0;
              $cmp108$i$i = ($166|0)==(0|0);
              if ($cmp108$i$i) {
               break;
              } else {
               $R$0$i$i = $166;$RP$0$i$i = $arrayidx107$i$i;
              }
             }
             $167 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp112$i$i = ($RP$0$i$i>>>0)<($167>>>0);
             if ($cmp112$i$i) {
              _abort();
              // unreachable;
             } else {
              HEAP32[$RP$0$i$i>>2] = 0;
              $R$1$i$i = $R$0$i$i;
              break;
             }
            } else {
             $add$ptr16$sum2829$i$i = $cond15$i$i | 8;
             $add$ptr224$sum135$i = (($add$ptr16$sum2829$i$i) + ($tsize$290$i))|0;
             $fd78$i$i = (($tbase$291$i) + ($add$ptr224$sum135$i)|0);
             $159 = HEAP32[$fd78$i$i>>2]|0;
             $160 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp81$i$i = ($159>>>0)<($160>>>0);
             if ($cmp81$i$i) {
              _abort();
              // unreachable;
             }
             $bk82$i$i = (($159) + 12|0);
             $161 = HEAP32[$bk82$i$i>>2]|0;
             $cmp83$i$i = ($161|0)==($add$ptr16$i$i|0);
             if (!($cmp83$i$i)) {
              _abort();
              // unreachable;
             }
             $fd85$i$i = (($158) + 8|0);
             $162 = HEAP32[$fd85$i$i>>2]|0;
             $cmp86$i$i = ($162|0)==($add$ptr16$i$i|0);
             if ($cmp86$i$i) {
              HEAP32[$bk82$i$i>>2] = $158;
              HEAP32[$fd85$i$i>>2] = $159;
              $R$1$i$i = $158;
              break;
             } else {
              _abort();
              // unreachable;
             }
            }
           } while(0);
           $cmp120$i63$i = ($157|0)==(0|0);
           if ($cmp120$i63$i) {
            break;
           }
           $add$ptr16$sum25$i$i = (($tsize$290$i) + 28)|0;
           $add$ptr224$sum136$i = (($add$ptr16$sum25$i$i) + ($cond15$i$i))|0;
           $index$i64$i = (($tbase$291$i) + ($add$ptr224$sum136$i)|0);
           $168 = HEAP32[$index$i64$i>>2]|0;
           $arrayidx123$i$i = ((1424 + ($168<<2)|0) + 304|0);
           $169 = HEAP32[$arrayidx123$i$i>>2]|0;
           $cmp124$i$i = ($add$ptr16$i$i|0)==($169|0);
           do {
            if ($cmp124$i$i) {
             HEAP32[$arrayidx123$i$i>>2] = $R$1$i$i;
             $cond37$i$i = ($R$1$i$i|0)==(0|0);
             if (!($cond37$i$i)) {
              break;
             }
             $shl131$i$i = 1 << $168;
             $neg132$i$i = $shl131$i$i ^ -1;
             $170 = HEAP32[((1424 + 4|0))>>2]|0;
             $and133$i$i = $170 & $neg132$i$i;
             HEAP32[((1424 + 4|0))>>2] = $and133$i$i;
             break L356;
            } else {
             $171 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp137$i$i = ($157>>>0)<($171>>>0);
             if ($cmp137$i$i) {
              _abort();
              // unreachable;
             }
             $arrayidx143$i$i = (($157) + 16|0);
             $172 = HEAP32[$arrayidx143$i$i>>2]|0;
             $cmp144$i$i = ($172|0)==($add$ptr16$i$i|0);
             if ($cmp144$i$i) {
              HEAP32[$arrayidx143$i$i>>2] = $R$1$i$i;
             } else {
              $arrayidx151$i$i = (($157) + 20|0);
              HEAP32[$arrayidx151$i$i>>2] = $R$1$i$i;
             }
             $cmp156$i$i = ($R$1$i$i|0)==(0|0);
             if ($cmp156$i$i) {
              break L356;
             }
            }
           } while(0);
           $173 = HEAP32[((1424 + 16|0))>>2]|0;
           $cmp160$i$i = ($R$1$i$i>>>0)<($173>>>0);
           if ($cmp160$i$i) {
            _abort();
            // unreachable;
           }
           $parent165$i$i = (($R$1$i$i) + 24|0);
           HEAP32[$parent165$i$i>>2] = $157;
           $add$ptr16$sum2627$i$i = $cond15$i$i | 16;
           $add$ptr224$sum137$i = (($add$ptr16$sum2627$i$i) + ($tsize$290$i))|0;
           $child166$i$i = (($tbase$291$i) + ($add$ptr224$sum137$i)|0);
           $174 = HEAP32[$child166$i$i>>2]|0;
           $cmp168$i$i = ($174|0)==(0|0);
           do {
            if (!($cmp168$i$i)) {
             $175 = HEAP32[((1424 + 16|0))>>2]|0;
             $cmp172$i$i = ($174>>>0)<($175>>>0);
             if ($cmp172$i$i) {
              _abort();
              // unreachable;
             } else {
              $arrayidx178$i$i = (($R$1$i$i) + 16|0);
              HEAP32[$arrayidx178$i$i>>2] = $174;
              $parent179$i$i = (($174) + 24|0);
              HEAP32[$parent179$i$i>>2] = $R$1$i$i;
              break;
             }
            }
           } while(0);
           $add$ptr224$sum138$i = (($add$ptr16$sum$i$i) + ($add$ptr16$sum2627$i$i))|0;
           $arrayidx184$i$i = (($tbase$291$i) + ($add$ptr224$sum138$i)|0);
           $176 = HEAP32[$arrayidx184$i$i>>2]|0;
           $cmp185$i$i = ($176|0)==(0|0);
           if ($cmp185$i$i) {
            break;
           }
           $177 = HEAP32[((1424 + 16|0))>>2]|0;
           $cmp189$i$i = ($176>>>0)<($177>>>0);
           if ($cmp189$i$i) {
            _abort();
            // unreachable;
           } else {
            $arrayidx195$i$i = (($R$1$i$i) + 20|0);
            HEAP32[$arrayidx195$i$i>>2] = $176;
            $parent196$i$i = (($176) + 24|0);
            HEAP32[$parent196$i$i>>2] = $R$1$i$i;
            break;
           }
          }
         } while(0);
         $add$ptr16$sum7$i$i = $and37$i$i | $cond15$i$i;
         $add$ptr224$sum139$i = (($add$ptr16$sum7$i$i) + ($tsize$290$i))|0;
         $add$ptr205$i$i = (($tbase$291$i) + ($add$ptr224$sum139$i)|0);
         $add206$i$i = (($and37$i$i) + ($sub18$i$i))|0;
         $oldfirst$0$i$i = $add$ptr205$i$i;$qsize$0$i$i = $add206$i$i;
        } else {
         $oldfirst$0$i$i = $add$ptr16$i$i;$qsize$0$i$i = $sub18$i$i;
        }
        $head208$i$i = (($oldfirst$0$i$i) + 4|0);
        $178 = HEAP32[$head208$i$i>>2]|0;
        $and209$i$i = $178 & -2;
        HEAP32[$head208$i$i>>2] = $and209$i$i;
        $or210$i$i = $qsize$0$i$i | 1;
        $add$ptr17$sum$i$i = (($add$ptr4$sum$i49$i) + 4)|0;
        $head211$i$i = (($tbase$291$i) + ($add$ptr17$sum$i$i)|0);
        HEAP32[$head211$i$i>>2] = $or210$i$i;
        $add$ptr17$sum8$i$i = (($qsize$0$i$i) + ($add$ptr4$sum$i49$i))|0;
        $add$ptr212$i$i = (($tbase$291$i) + ($add$ptr17$sum8$i$i)|0);
        HEAP32[$add$ptr212$i$i>>2] = $qsize$0$i$i;
        $shr214$i$i = $qsize$0$i$i >>> 3;
        $cmp215$i$i = ($qsize$0$i$i>>>0)<(256);
        if ($cmp215$i$i) {
         $shl221$i$i = $shr214$i$i << 1;
         $arrayidx223$i$i = ((1424 + ($shl221$i$i<<2)|0) + 40|0);
         $179 = HEAP32[1424>>2]|0;
         $shl226$i$i = 1 << $shr214$i$i;
         $and227$i$i = $179 & $shl226$i$i;
         $tobool228$i$i = ($and227$i$i|0)==(0);
         do {
          if ($tobool228$i$i) {
           $or232$i$i = $179 | $shl226$i$i;
           HEAP32[1424>>2] = $or232$i$i;
           $arrayidx223$sum$pre$i$i = (($shl221$i$i) + 2)|0;
           $$pre$i66$i = ((1424 + ($arrayidx223$sum$pre$i$i<<2)|0) + 40|0);
           $$pre$phi$i67$iZ2D = $$pre$i66$i;$F224$0$i$i = $arrayidx223$i$i;
          } else {
           $arrayidx223$sum24$i$i = (($shl221$i$i) + 2)|0;
           $180 = ((1424 + ($arrayidx223$sum24$i$i<<2)|0) + 40|0);
           $181 = HEAP32[$180>>2]|0;
           $182 = HEAP32[((1424 + 16|0))>>2]|0;
           $cmp236$i$i = ($181>>>0)<($182>>>0);
           if (!($cmp236$i$i)) {
            $$pre$phi$i67$iZ2D = $180;$F224$0$i$i = $181;
            break;
           }
           _abort();
           // unreachable;
          }
         } while(0);
         HEAP32[$$pre$phi$i67$iZ2D>>2] = $add$ptr17$i$i;
         $bk246$i$i = (($F224$0$i$i) + 12|0);
         HEAP32[$bk246$i$i>>2] = $add$ptr17$i$i;
         $add$ptr17$sum22$i$i = (($add$ptr4$sum$i49$i) + 8)|0;
         $fd247$i$i = (($tbase$291$i) + ($add$ptr17$sum22$i$i)|0);
         HEAP32[$fd247$i$i>>2] = $F224$0$i$i;
         $add$ptr17$sum23$i$i = (($add$ptr4$sum$i49$i) + 12)|0;
         $bk248$i$i = (($tbase$291$i) + ($add$ptr17$sum23$i$i)|0);
         HEAP32[$bk248$i$i>>2] = $arrayidx223$i$i;
         break;
        }
        $shr253$i$i = $qsize$0$i$i >>> 8;
        $cmp254$i$i = ($shr253$i$i|0)==(0);
        do {
         if ($cmp254$i$i) {
          $I252$0$i$i = 0;
         } else {
          $cmp258$i$i = ($qsize$0$i$i>>>0)>(16777215);
          if ($cmp258$i$i) {
           $I252$0$i$i = 31;
           break;
          }
          $sub262$i$i = (($shr253$i$i) + 1048320)|0;
          $shr263$i$i = $sub262$i$i >>> 16;
          $and264$i$i = $shr263$i$i & 8;
          $shl265$i$i = $shr253$i$i << $and264$i$i;
          $sub266$i$i = (($shl265$i$i) + 520192)|0;
          $shr267$i$i = $sub266$i$i >>> 16;
          $and268$i$i = $shr267$i$i & 4;
          $add269$i$i = $and268$i$i | $and264$i$i;
          $shl270$i$i = $shl265$i$i << $and268$i$i;
          $sub271$i$i = (($shl270$i$i) + 245760)|0;
          $shr272$i$i = $sub271$i$i >>> 16;
          $and273$i$i = $shr272$i$i & 2;
          $add274$i$i = $add269$i$i | $and273$i$i;
          $sub275$i$i = (14 - ($add274$i$i))|0;
          $shl276$i$i = $shl270$i$i << $and273$i$i;
          $shr277$i$i = $shl276$i$i >>> 15;
          $add278$i$i = (($sub275$i$i) + ($shr277$i$i))|0;
          $shl279$i$i = $add278$i$i << 1;
          $add280$i$i = (($add278$i$i) + 7)|0;
          $shr281$i$i = $qsize$0$i$i >>> $add280$i$i;
          $and282$i$i = $shr281$i$i & 1;
          $add283$i$i = $and282$i$i | $shl279$i$i;
          $I252$0$i$i = $add283$i$i;
         }
        } while(0);
        $arrayidx287$i$i = ((1424 + ($I252$0$i$i<<2)|0) + 304|0);
        $add$ptr17$sum9$i$i = (($add$ptr4$sum$i49$i) + 28)|0;
        $index288$i$i = (($tbase$291$i) + ($add$ptr17$sum9$i$i)|0);
        HEAP32[$index288$i$i>>2] = $I252$0$i$i;
        $add$ptr17$sum10$i$i = (($add$ptr4$sum$i49$i) + 16)|0;
        $child289$i$i = (($tbase$291$i) + ($add$ptr17$sum10$i$i)|0);
        $child289$sum$i$i = (($add$ptr4$sum$i49$i) + 20)|0;
        $arrayidx290$i$i = (($tbase$291$i) + ($child289$sum$i$i)|0);
        HEAP32[$arrayidx290$i$i>>2] = 0;
        HEAP32[$child289$i$i>>2] = 0;
        $183 = HEAP32[((1424 + 4|0))>>2]|0;
        $shl294$i$i = 1 << $I252$0$i$i;
        $and295$i$i = $183 & $shl294$i$i;
        $tobool296$i$i = ($and295$i$i|0)==(0);
        if ($tobool296$i$i) {
         $or300$i$i = $183 | $shl294$i$i;
         HEAP32[((1424 + 4|0))>>2] = $or300$i$i;
         HEAP32[$arrayidx287$i$i>>2] = $add$ptr17$i$i;
         $add$ptr17$sum11$i$i = (($add$ptr4$sum$i49$i) + 24)|0;
         $parent301$i$i = (($tbase$291$i) + ($add$ptr17$sum11$i$i)|0);
         HEAP32[$parent301$i$i>>2] = $arrayidx287$i$i;
         $add$ptr17$sum12$i$i = (($add$ptr4$sum$i49$i) + 12)|0;
         $bk302$i$i = (($tbase$291$i) + ($add$ptr17$sum12$i$i)|0);
         HEAP32[$bk302$i$i>>2] = $add$ptr17$i$i;
         $add$ptr17$sum13$i$i = (($add$ptr4$sum$i49$i) + 8)|0;
         $fd303$i$i = (($tbase$291$i) + ($add$ptr17$sum13$i$i)|0);
         HEAP32[$fd303$i$i>>2] = $add$ptr17$i$i;
         break;
        }
        $184 = HEAP32[$arrayidx287$i$i>>2]|0;
        $cmp306$i$i = ($I252$0$i$i|0)==(31);
        if ($cmp306$i$i) {
         $cond315$i$i = 0;
        } else {
         $shr310$i$i = $I252$0$i$i >>> 1;
         $sub313$i$i = (25 - ($shr310$i$i))|0;
         $cond315$i$i = $sub313$i$i;
        }
        $head31739$i$i = (($184) + 4|0);
        $185 = HEAP32[$head31739$i$i>>2]|0;
        $and31840$i$i = $185 & -8;
        $cmp31941$i$i = ($and31840$i$i|0)==($qsize$0$i$i|0);
        L445: do {
         if ($cmp31941$i$i) {
          $T$0$lcssa$i69$i = $184;
         } else {
          $shl316$i$i = $qsize$0$i$i << $cond315$i$i;
          $K305$043$i$i = $shl316$i$i;$T$042$i$i = $184;
          while(1) {
           $shr322$i$i = $K305$043$i$i >>> 31;
           $arrayidx325$i$i = ((($T$042$i$i) + ($shr322$i$i<<2)|0) + 16|0);
           $186 = HEAP32[$arrayidx325$i$i>>2]|0;
           $cmp327$i$i = ($186|0)==(0|0);
           if ($cmp327$i$i) {
            break;
           }
           $shl326$i$i = $K305$043$i$i << 1;
           $head317$i$i = (($186) + 4|0);
           $187 = HEAP32[$head317$i$i>>2]|0;
           $and318$i$i = $187 & -8;
           $cmp319$i$i = ($and318$i$i|0)==($qsize$0$i$i|0);
           if ($cmp319$i$i) {
            $T$0$lcssa$i69$i = $186;
            break L445;
           } else {
            $K305$043$i$i = $shl326$i$i;$T$042$i$i = $186;
           }
          }
          $188 = HEAP32[((1424 + 16|0))>>2]|0;
          $cmp332$i$i = ($arrayidx325$i$i>>>0)<($188>>>0);
          if ($cmp332$i$i) {
           _abort();
           // unreachable;
          } else {
           HEAP32[$arrayidx325$i$i>>2] = $add$ptr17$i$i;
           $add$ptr17$sum19$i$i = (($add$ptr4$sum$i49$i) + 24)|0;
           $parent337$i$i = (($tbase$291$i) + ($add$ptr17$sum19$i$i)|0);
           HEAP32[$parent337$i$i>>2] = $T$042$i$i;
           $add$ptr17$sum20$i$i = (($add$ptr4$sum$i49$i) + 12)|0;
           $bk338$i$i = (($tbase$291$i) + ($add$ptr17$sum20$i$i)|0);
           HEAP32[$bk338$i$i>>2] = $add$ptr17$i$i;
           $add$ptr17$sum21$i$i = (($add$ptr4$sum$i49$i) + 8)|0;
           $fd339$i$i = (($tbase$291$i) + ($add$ptr17$sum21$i$i)|0);
           HEAP32[$fd339$i$i>>2] = $add$ptr17$i$i;
           break L348;
          }
         }
        } while(0);
        $fd344$i$i = (($T$0$lcssa$i69$i) + 8|0);
        $189 = HEAP32[$fd344$i$i>>2]|0;
        $190 = HEAP32[((1424 + 16|0))>>2]|0;
        $cmp346$i$i = ($T$0$lcssa$i69$i>>>0)<($190>>>0);
        if ($cmp346$i$i) {
         _abort();
         // unreachable;
        }
        $cmp350$i$i = ($189>>>0)<($190>>>0);
        if ($cmp350$i$i) {
         _abort();
         // unreachable;
        } else {
         $bk357$i$i = (($189) + 12|0);
         HEAP32[$bk357$i$i>>2] = $add$ptr17$i$i;
         HEAP32[$fd344$i$i>>2] = $add$ptr17$i$i;
         $add$ptr17$sum16$i$i = (($add$ptr4$sum$i49$i) + 8)|0;
         $fd359$i$i = (($tbase$291$i) + ($add$ptr17$sum16$i$i)|0);
         HEAP32[$fd359$i$i>>2] = $189;
         $add$ptr17$sum17$i$i = (($add$ptr4$sum$i49$i) + 12)|0;
         $bk360$i$i = (($tbase$291$i) + ($add$ptr17$sum17$i$i)|0);
         HEAP32[$bk360$i$i>>2] = $T$0$lcssa$i69$i;
         $add$ptr17$sum18$i$i = (($add$ptr4$sum$i49$i) + 24)|0;
         $parent361$i$i = (($tbase$291$i) + ($add$ptr17$sum18$i$i)|0);
         HEAP32[$parent361$i$i>>2] = 0;
         break;
        }
       }
      } while(0);
      $add$ptr4$sum1415$i$i = $cond$i42$i | 8;
      $add$ptr368$i$i = (($tbase$291$i) + ($add$ptr4$sum1415$i$i)|0);
      $mem$0 = $add$ptr368$i$i;
      STACKTOP = sp;return ($mem$0|0);
     }
    }
    $sp$0$i$i$i = ((1424 + 448|0));
    while(1) {
     $191 = HEAP32[$sp$0$i$i$i>>2]|0;
     $cmp$i$i$i = ($191>>>0)>($120>>>0);
     if (!($cmp$i$i$i)) {
      $size$i$i$i = (($sp$0$i$i$i) + 4|0);
      $192 = HEAP32[$size$i$i$i>>2]|0;
      $add$ptr$i$i$i = (($191) + ($192)|0);
      $cmp2$i$i$i = ($add$ptr$i$i$i>>>0)>($120>>>0);
      if ($cmp2$i$i$i) {
       break;
      }
     }
     $next$i$i$i = (($sp$0$i$i$i) + 8|0);
     $193 = HEAP32[$next$i$i$i>>2]|0;
     $sp$0$i$i$i = $193;
    }
    $add$ptr$sum$i$i = (($192) + -47)|0;
    $add$ptr2$sum$i$i = (($192) + -39)|0;
    $add$ptr3$i$i = (($191) + ($add$ptr2$sum$i$i)|0);
    $194 = $add$ptr3$i$i;
    $and$i14$i = $194 & 7;
    $cmp$i15$i = ($and$i14$i|0)==(0);
    if ($cmp$i15$i) {
     $cond$i17$i = 0;
    } else {
     $195 = (0 - ($194))|0;
     $and6$i$i = $195 & 7;
     $cond$i17$i = $and6$i$i;
    }
    $add$ptr2$sum1$i$i = (($add$ptr$sum$i$i) + ($cond$i17$i))|0;
    $add$ptr7$i$i = (($191) + ($add$ptr2$sum1$i$i)|0);
    $add$ptr82$i$i = (($120) + 16|0);
    $cmp9$i$i = ($add$ptr7$i$i>>>0)<($add$ptr82$i$i>>>0);
    $cond13$i$i = $cmp9$i$i ? $120 : $add$ptr7$i$i;
    $add$ptr14$i$i = (($cond13$i$i) + 8|0);
    $sub16$i$i = (($tsize$290$i) + -40)|0;
    $add$ptr$i10$i$i = (($tbase$291$i) + 8|0);
    $196 = $add$ptr$i10$i$i;
    $and$i$i$i = $196 & 7;
    $cmp$i11$i$i = ($and$i$i$i|0)==(0);
    if ($cmp$i11$i$i) {
     $cond$i$i$i = 0;
    } else {
     $197 = (0 - ($196))|0;
     $and3$i$i$i = $197 & 7;
     $cond$i$i$i = $and3$i$i$i;
    }
    $add$ptr4$i$i$i = (($tbase$291$i) + ($cond$i$i$i)|0);
    $sub5$i$i$i = (($sub16$i$i) - ($cond$i$i$i))|0;
    HEAP32[((1424 + 24|0))>>2] = $add$ptr4$i$i$i;
    HEAP32[((1424 + 12|0))>>2] = $sub5$i$i$i;
    $or$i$i$i = $sub5$i$i$i | 1;
    $add$ptr4$sum$i$i$i = (($cond$i$i$i) + 4)|0;
    $head$i$i$i = (($tbase$291$i) + ($add$ptr4$sum$i$i$i)|0);
    HEAP32[$head$i$i$i>>2] = $or$i$i$i;
    $add$ptr6$sum$i$i$i = (($tsize$290$i) + -36)|0;
    $head7$i$i$i = (($tbase$291$i) + ($add$ptr6$sum$i$i$i)|0);
    HEAP32[$head7$i$i$i>>2] = 40;
    $198 = HEAP32[((1896 + 16|0))>>2]|0;
    HEAP32[((1424 + 28|0))>>2] = $198;
    $head$i18$i = (($cond13$i$i) + 4|0);
    HEAP32[$head$i18$i>>2] = 27;
    ;HEAP32[$add$ptr14$i$i+0>>2]=HEAP32[((1424 + 448|0))+0>>2]|0;HEAP32[$add$ptr14$i$i+4>>2]=HEAP32[((1424 + 448|0))+4>>2]|0;HEAP32[$add$ptr14$i$i+8>>2]=HEAP32[((1424 + 448|0))+8>>2]|0;HEAP32[$add$ptr14$i$i+12>>2]=HEAP32[((1424 + 448|0))+12>>2]|0;
    HEAP32[((1424 + 448|0))>>2] = $tbase$291$i;
    HEAP32[((1424 + 452|0))>>2] = $tsize$290$i;
    HEAP32[((1424 + 460|0))>>2] = 0;
    HEAP32[((1424 + 456|0))>>2] = $add$ptr14$i$i;
    $add$ptr2418$i$i = (($cond13$i$i) + 28|0);
    HEAP32[$add$ptr2418$i$i>>2] = 7;
    $199 = (($cond13$i$i) + 32|0);
    $cmp2719$i$i = ($199>>>0)<($add$ptr$i$i$i>>>0);
    if ($cmp2719$i$i) {
     $add$ptr2420$i$i = $add$ptr2418$i$i;
     while(1) {
      $200 = (($add$ptr2420$i$i) + 4|0);
      HEAP32[$200>>2] = 7;
      $201 = (($add$ptr2420$i$i) + 8|0);
      $cmp27$i$i = ($201>>>0)<($add$ptr$i$i$i>>>0);
      if ($cmp27$i$i) {
       $add$ptr2420$i$i = $200;
      } else {
       break;
      }
     }
    }
    $cmp28$i$i = ($cond13$i$i|0)==($120|0);
    if (!($cmp28$i$i)) {
     $sub$ptr$lhs$cast$i$i = $cond13$i$i;
     $sub$ptr$rhs$cast$i$i = $120;
     $sub$ptr$sub$i$i = (($sub$ptr$lhs$cast$i$i) - ($sub$ptr$rhs$cast$i$i))|0;
     $add$ptr30$i$i = (($120) + ($sub$ptr$sub$i$i)|0);
     $add$ptr30$sum$i$i = (($sub$ptr$sub$i$i) + 4)|0;
     $head31$i$i = (($120) + ($add$ptr30$sum$i$i)|0);
     $202 = HEAP32[$head31$i$i>>2]|0;
     $and32$i$i = $202 & -2;
     HEAP32[$head31$i$i>>2] = $and32$i$i;
     $or33$i$i = $sub$ptr$sub$i$i | 1;
     $head34$i$i = (($120) + 4|0);
     HEAP32[$head34$i$i>>2] = $or33$i$i;
     HEAP32[$add$ptr30$i$i>>2] = $sub$ptr$sub$i$i;
     $shr$i$i = $sub$ptr$sub$i$i >>> 3;
     $cmp36$i$i = ($sub$ptr$sub$i$i>>>0)<(256);
     if ($cmp36$i$i) {
      $shl$i20$i = $shr$i$i << 1;
      $arrayidx$i21$i = ((1424 + ($shl$i20$i<<2)|0) + 40|0);
      $203 = HEAP32[1424>>2]|0;
      $shl39$i$i = 1 << $shr$i$i;
      $and40$i$i = $203 & $shl39$i$i;
      $tobool$i$i = ($and40$i$i|0)==(0);
      do {
       if ($tobool$i$i) {
        $or44$i$i = $203 | $shl39$i$i;
        HEAP32[1424>>2] = $or44$i$i;
        $arrayidx$sum$pre$i$i = (($shl$i20$i) + 2)|0;
        $$pre$i$i = ((1424 + ($arrayidx$sum$pre$i$i<<2)|0) + 40|0);
        $$pre$phi$i$iZ2D = $$pre$i$i;$F$0$i$i = $arrayidx$i21$i;
       } else {
        $arrayidx$sum9$i$i = (($shl$i20$i) + 2)|0;
        $204 = ((1424 + ($arrayidx$sum9$i$i<<2)|0) + 40|0);
        $205 = HEAP32[$204>>2]|0;
        $206 = HEAP32[((1424 + 16|0))>>2]|0;
        $cmp46$i$i = ($205>>>0)<($206>>>0);
        if (!($cmp46$i$i)) {
         $$pre$phi$i$iZ2D = $204;$F$0$i$i = $205;
         break;
        }
        _abort();
        // unreachable;
       }
      } while(0);
      HEAP32[$$pre$phi$i$iZ2D>>2] = $120;
      $bk$i$i = (($F$0$i$i) + 12|0);
      HEAP32[$bk$i$i>>2] = $120;
      $fd54$i$i = (($120) + 8|0);
      HEAP32[$fd54$i$i>>2] = $F$0$i$i;
      $bk55$i$i = (($120) + 12|0);
      HEAP32[$bk55$i$i>>2] = $arrayidx$i21$i;
      break;
     }
     $shr58$i$i = $sub$ptr$sub$i$i >>> 8;
     $cmp59$i$i = ($shr58$i$i|0)==(0);
     if ($cmp59$i$i) {
      $I57$0$i$i = 0;
     } else {
      $cmp63$i$i = ($sub$ptr$sub$i$i>>>0)>(16777215);
      if ($cmp63$i$i) {
       $I57$0$i$i = 31;
      } else {
       $sub67$i$i = (($shr58$i$i) + 1048320)|0;
       $shr68$i$i = $sub67$i$i >>> 16;
       $and69$i$i = $shr68$i$i & 8;
       $shl70$i$i = $shr58$i$i << $and69$i$i;
       $sub71$i$i = (($shl70$i$i) + 520192)|0;
       $shr72$i$i = $sub71$i$i >>> 16;
       $and73$i$i = $shr72$i$i & 4;
       $add74$i$i = $and73$i$i | $and69$i$i;
       $shl75$i$i = $shl70$i$i << $and73$i$i;
       $sub76$i$i = (($shl75$i$i) + 245760)|0;
       $shr77$i$i = $sub76$i$i >>> 16;
       $and78$i$i = $shr77$i$i & 2;
       $add79$i$i = $add74$i$i | $and78$i$i;
       $sub80$i$i = (14 - ($add79$i$i))|0;
       $shl81$i$i = $shl75$i$i << $and78$i$i;
       $shr82$i$i = $shl81$i$i >>> 15;
       $add83$i$i = (($sub80$i$i) + ($shr82$i$i))|0;
       $shl84$i$i = $add83$i$i << 1;
       $add85$i$i = (($add83$i$i) + 7)|0;
       $shr86$i$i = $sub$ptr$sub$i$i >>> $add85$i$i;
       $and87$i$i = $shr86$i$i & 1;
       $add88$i$i = $and87$i$i | $shl84$i$i;
       $I57$0$i$i = $add88$i$i;
      }
     }
     $arrayidx91$i$i = ((1424 + ($I57$0$i$i<<2)|0) + 304|0);
     $index$i$i = (($120) + 28|0);
     $I57$0$c$i$i = $I57$0$i$i;
     HEAP32[$index$i$i>>2] = $I57$0$c$i$i;
     $arrayidx92$i$i = (($120) + 20|0);
     HEAP32[$arrayidx92$i$i>>2] = 0;
     $207 = (($120) + 16|0);
     HEAP32[$207>>2] = 0;
     $208 = HEAP32[((1424 + 4|0))>>2]|0;
     $shl95$i$i = 1 << $I57$0$i$i;
     $and96$i$i = $208 & $shl95$i$i;
     $tobool97$i$i = ($and96$i$i|0)==(0);
     if ($tobool97$i$i) {
      $or101$i$i = $208 | $shl95$i$i;
      HEAP32[((1424 + 4|0))>>2] = $or101$i$i;
      HEAP32[$arrayidx91$i$i>>2] = $120;
      $parent$i$i = (($120) + 24|0);
      HEAP32[$parent$i$i>>2] = $arrayidx91$i$i;
      $bk102$i$i = (($120) + 12|0);
      HEAP32[$bk102$i$i>>2] = $120;
      $fd103$i$i = (($120) + 8|0);
      HEAP32[$fd103$i$i>>2] = $120;
      break;
     }
     $209 = HEAP32[$arrayidx91$i$i>>2]|0;
     $cmp106$i$i = ($I57$0$i$i|0)==(31);
     if ($cmp106$i$i) {
      $cond115$i$i = 0;
     } else {
      $shr110$i$i = $I57$0$i$i >>> 1;
      $sub113$i$i = (25 - ($shr110$i$i))|0;
      $cond115$i$i = $sub113$i$i;
     }
     $head11813$i$i = (($209) + 4|0);
     $210 = HEAP32[$head11813$i$i>>2]|0;
     $and11914$i$i = $210 & -8;
     $cmp12015$i$i = ($and11914$i$i|0)==($sub$ptr$sub$i$i|0);
     L499: do {
      if ($cmp12015$i$i) {
       $T$0$lcssa$i$i = $209;
      } else {
       $shl116$i$i = $sub$ptr$sub$i$i << $cond115$i$i;
       $K105$017$i$i = $shl116$i$i;$T$016$i$i = $209;
       while(1) {
        $shr123$i$i = $K105$017$i$i >>> 31;
        $arrayidx126$i$i = ((($T$016$i$i) + ($shr123$i$i<<2)|0) + 16|0);
        $211 = HEAP32[$arrayidx126$i$i>>2]|0;
        $cmp128$i$i = ($211|0)==(0|0);
        if ($cmp128$i$i) {
         break;
        }
        $shl127$i$i = $K105$017$i$i << 1;
        $head118$i$i = (($211) + 4|0);
        $212 = HEAP32[$head118$i$i>>2]|0;
        $and119$i$i = $212 & -8;
        $cmp120$i$i = ($and119$i$i|0)==($sub$ptr$sub$i$i|0);
        if ($cmp120$i$i) {
         $T$0$lcssa$i$i = $211;
         break L499;
        } else {
         $K105$017$i$i = $shl127$i$i;$T$016$i$i = $211;
        }
       }
       $213 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp133$i$i = ($arrayidx126$i$i>>>0)<($213>>>0);
       if ($cmp133$i$i) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$arrayidx126$i$i>>2] = $120;
        $parent138$i$i = (($120) + 24|0);
        HEAP32[$parent138$i$i>>2] = $T$016$i$i;
        $bk139$i$i = (($120) + 12|0);
        HEAP32[$bk139$i$i>>2] = $120;
        $fd140$i$i = (($120) + 8|0);
        HEAP32[$fd140$i$i>>2] = $120;
        break L311;
       }
      }
     } while(0);
     $fd145$i$i = (($T$0$lcssa$i$i) + 8|0);
     $214 = HEAP32[$fd145$i$i>>2]|0;
     $215 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp147$i$i = ($T$0$lcssa$i$i>>>0)<($215>>>0);
     if ($cmp147$i$i) {
      _abort();
      // unreachable;
     }
     $cmp150$i$i = ($214>>>0)<($215>>>0);
     if ($cmp150$i$i) {
      _abort();
      // unreachable;
     } else {
      $bk155$i$i = (($214) + 12|0);
      HEAP32[$bk155$i$i>>2] = $120;
      HEAP32[$fd145$i$i>>2] = $120;
      $fd157$i$i = (($120) + 8|0);
      HEAP32[$fd157$i$i>>2] = $214;
      $bk158$i$i = (($120) + 12|0);
      HEAP32[$bk158$i$i>>2] = $T$0$lcssa$i$i;
      $parent159$i$i = (($120) + 24|0);
      HEAP32[$parent159$i$i>>2] = 0;
      break;
     }
    }
   }
  } while(0);
  $216 = HEAP32[((1424 + 12|0))>>2]|0;
  $cmp250$i = ($216>>>0)>($nb$0>>>0);
  if ($cmp250$i) {
   $sub253$i = (($216) - ($nb$0))|0;
   HEAP32[((1424 + 12|0))>>2] = $sub253$i;
   $217 = HEAP32[((1424 + 24|0))>>2]|0;
   $add$ptr255$i = (($217) + ($nb$0)|0);
   HEAP32[((1424 + 24|0))>>2] = $add$ptr255$i;
   $or257$i = $sub253$i | 1;
   $add$ptr255$sum$i = (($nb$0) + 4)|0;
   $head258$i = (($217) + ($add$ptr255$sum$i)|0);
   HEAP32[$head258$i>>2] = $or257$i;
   $or260$i = $nb$0 | 3;
   $head261$i = (($217) + 4|0);
   HEAP32[$head261$i>>2] = $or260$i;
   $add$ptr262$i = (($217) + 8|0);
   $mem$0 = $add$ptr262$i;
   STACKTOP = sp;return ($mem$0|0);
  }
 }
 $call265$i = (___errno_location()|0);
 HEAP32[$call265$i>>2] = 12;
 $mem$0 = 0;
 STACKTOP = sp;return ($mem$0|0);
}
function _free($mem) {
 $mem = $mem|0;
 var $$pre = 0, $$pre$phiZ2D = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $8 = 0;
 var $9 = 0, $F502$0 = 0, $I526$0 = 0, $I526$0$c = 0, $K575$0270 = 0, $R$0 = 0, $R$1 = 0, $R327$0 = 0, $R327$1 = 0, $RP$0 = 0, $RP355$0 = 0, $T$0$lcssa = 0, $T$0269 = 0, $add$ptr = 0, $add$ptr$sum = 0, $add$ptr$sum230 = 0, $add$ptr16 = 0, $add$ptr16$sum = 0, $add$ptr16$sum251 = 0, $add$ptr16$sum252 = 0;
 var $add$ptr16$sum253 = 0, $add$ptr16$sum254 = 0, $add$ptr16$sum255 = 0, $add$ptr16$sum256 = 0, $add$ptr16$sum257 = 0, $add$ptr16$sum258 = 0, $add$ptr257 = 0, $add$ptr477 = 0, $add$ptr490 = 0, $add$ptr6 = 0, $add$ptr6$sum = 0, $add$ptr6$sum232 = 0, $add$ptr6$sum233234 = 0, $add$ptr6$sum235 = 0, $add$ptr6$sum243 = 0, $add$ptr6$sum244 = 0, $add$ptr6$sum247248 = 0, $add$ptr6$sum249 = 0, $add17 = 0, $add243 = 0;
 var $add254 = 0, $add262 = 0, $add542 = 0, $add547 = 0, $add551 = 0, $add553 = 0, $add556 = 0, $and = 0, $and140 = 0, $and210 = 0, $and215 = 0, $and229 = 0, $and237 = 0, $and261 = 0, $and296 = 0, $and405 = 0, $and46 = 0, $and487 = 0, $and5 = 0, $and504 = 0;
 var $and537 = 0, $and541 = 0, $and546 = 0, $and555 = 0, $and566 = 0, $and584 = 0, $and584267 = 0, $and8 = 0, $arrayidx = 0, $arrayidx108 = 0, $arrayidx113 = 0, $arrayidx130 = 0, $arrayidx149 = 0, $arrayidx157 = 0, $arrayidx182 = 0, $arrayidx188 = 0, $arrayidx198 = 0, $arrayidx274 = 0, $arrayidx357 = 0, $arrayidx369 = 0;
 var $arrayidx374 = 0, $arrayidx395 = 0, $arrayidx414 = 0, $arrayidx422 = 0, $arrayidx449 = 0, $arrayidx455 = 0, $arrayidx465 = 0, $arrayidx501 = 0, $arrayidx501$sum$pre = 0, $arrayidx501$sum242 = 0, $arrayidx559 = 0, $arrayidx562 = 0, $arrayidx591 = 0, $arrayidx99 = 0, $bk = 0, $bk270 = 0, $bk281 = 0, $bk316 = 0, $bk328 = 0, $bk338 = 0;
 var $bk34 = 0, $bk521 = 0, $bk523 = 0, $bk572 = 0, $bk603 = 0, $bk620 = 0, $bk623 = 0, $bk66 = 0, $bk73 = 0, $bk82 = 0, $child = 0, $child$sum = 0, $child171 = 0, $child171$sum = 0, $child356 = 0, $child356$sum = 0, $child438 = 0, $child438$sum = 0, $cmp = 0, $cmp$i = 0;
 var $cmp1 = 0, $cmp100 = 0, $cmp104 = 0, $cmp109 = 0, $cmp114 = 0, $cmp118 = 0, $cmp127 = 0, $cmp13 = 0, $cmp131 = 0, $cmp143 = 0, $cmp150 = 0, $cmp162 = 0, $cmp165 = 0, $cmp173 = 0, $cmp176 = 0, $cmp18 = 0, $cmp189 = 0, $cmp192 = 0, $cmp2 = 0, $cmp211 = 0;
 var $cmp22 = 0, $cmp225 = 0, $cmp240 = 0, $cmp246 = 0, $cmp25 = 0, $cmp251 = 0, $cmp264 = 0, $cmp275 = 0, $cmp278 = 0, $cmp282 = 0, $cmp29 = 0, $cmp291 = 0, $cmp300 = 0, $cmp303 = 0, $cmp307 = 0, $cmp31 = 0, $cmp329 = 0, $cmp335 = 0, $cmp339 = 0, $cmp343 = 0;
 var $cmp35 = 0, $cmp358 = 0, $cmp363 = 0, $cmp370 = 0, $cmp375 = 0, $cmp381 = 0, $cmp390 = 0, $cmp396 = 0, $cmp408 = 0, $cmp415 = 0, $cmp42 = 0, $cmp427 = 0, $cmp430 = 0, $cmp440 = 0, $cmp443 = 0, $cmp456 = 0, $cmp459 = 0, $cmp479 = 0, $cmp494 = 0, $cmp50 = 0;
 var $cmp511 = 0, $cmp528 = 0, $cmp53 = 0, $cmp532 = 0, $cmp57 = 0, $cmp576 = 0, $cmp585 = 0, $cmp585268 = 0, $cmp593 = 0, $cmp597 = 0, $cmp610 = 0, $cmp613 = 0, $cmp628 = 0, $cmp74 = 0, $cmp80 = 0, $cmp83 = 0, $cmp87 = 0, $cond = 0, $cond263 = 0, $cond264 = 0;
 var $dec = 0, $fd = 0, $fd268 = 0, $fd306 = 0, $fd317$pre = 0, $fd317$pre$phiZ2D = 0, $fd333 = 0, $fd342 = 0, $fd522 = 0, $fd56 = 0, $fd573 = 0, $fd604 = 0, $fd609 = 0, $fd622 = 0, $fd67$pre = 0, $fd67$pre$phiZ2D = 0, $fd78 = 0, $fd86 = 0, $head = 0, $head209 = 0;
 var $head216 = 0, $head228 = 0, $head245 = 0, $head256 = 0, $head476 = 0, $head489 = 0, $head583 = 0, $head583266 = 0, $index = 0, $index394 = 0, $index560 = 0, $neg = 0, $neg139 = 0, $neg295 = 0, $neg404 = 0, $next4$i = 0, $or = 0, $or244 = 0, $or255 = 0, $or475 = 0;
 var $or488 = 0, $or508 = 0, $or570 = 0, $p$0 = 0, $parent = 0, $parent170 = 0, $parent183 = 0, $parent199 = 0, $parent326 = 0, $parent437 = 0, $parent450 = 0, $parent466 = 0, $parent571 = 0, $parent602 = 0, $parent624 = 0, $psize$0 = 0, $psize$1 = 0, $shl = 0, $shl138 = 0, $shl273 = 0;
 var $shl294 = 0, $shl403 = 0, $shl45 = 0, $shl500 = 0, $shl503 = 0, $shl538 = 0, $shl543 = 0, $shl549 = 0, $shl552 = 0, $shl565 = 0, $shl582 = 0, $shl592 = 0, $shr = 0, $shr263 = 0, $shr493 = 0, $shr527 = 0, $shr536 = 0, $shr540 = 0, $shr545 = 0, $shr550 = 0;
 var $shr554 = 0, $shr578 = 0, $shr588 = 0, $sp$0$i = 0, $sp$0$in$i = 0, $sub = 0, $sub539 = 0, $sub544 = 0, $sub548 = 0, $sub581 = 0, $tobool230 = 0, $tobool238 = 0, $tobool505 = 0, $tobool567 = 0, $tobool9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $cmp = ($mem|0)==(0|0);
 if ($cmp) {
  STACKTOP = sp;return;
 }
 $add$ptr = (($mem) + -8|0);
 $0 = HEAP32[((1424 + 16|0))>>2]|0;
 $cmp1 = ($add$ptr>>>0)<($0>>>0);
 if ($cmp1) {
  _abort();
  // unreachable;
 }
 $head = (($mem) + -4|0);
 $1 = HEAP32[$head>>2]|0;
 $and = $1 & 3;
 $cmp2 = ($and|0)==(1);
 if ($cmp2) {
  _abort();
  // unreachable;
 }
 $and5 = $1 & -8;
 $add$ptr$sum = (($and5) + -8)|0;
 $add$ptr6 = (($mem) + ($add$ptr$sum)|0);
 $and8 = $1 & 1;
 $tobool9 = ($and8|0)==(0);
 do {
  if ($tobool9) {
   $2 = HEAP32[$add$ptr>>2]|0;
   $cmp13 = ($and|0)==(0);
   if ($cmp13) {
    STACKTOP = sp;return;
   }
   $add$ptr$sum230 = (-8 - ($2))|0;
   $add$ptr16 = (($mem) + ($add$ptr$sum230)|0);
   $add17 = (($2) + ($and5))|0;
   $cmp18 = ($add$ptr16>>>0)<($0>>>0);
   if ($cmp18) {
    _abort();
    // unreachable;
   }
   $3 = HEAP32[((1424 + 20|0))>>2]|0;
   $cmp22 = ($add$ptr16|0)==($3|0);
   if ($cmp22) {
    $add$ptr6$sum = (($and5) + -4)|0;
    $head209 = (($mem) + ($add$ptr6$sum)|0);
    $28 = HEAP32[$head209>>2]|0;
    $and210 = $28 & 3;
    $cmp211 = ($and210|0)==(3);
    if (!($cmp211)) {
     $p$0 = $add$ptr16;$psize$0 = $add17;
     break;
    }
    HEAP32[((1424 + 8|0))>>2] = $add17;
    $29 = HEAP32[$head209>>2]|0;
    $and215 = $29 & -2;
    HEAP32[$head209>>2] = $and215;
    $or = $add17 | 1;
    $add$ptr16$sum = (($add$ptr$sum230) + 4)|0;
    $head216 = (($mem) + ($add$ptr16$sum)|0);
    HEAP32[$head216>>2] = $or;
    HEAP32[$add$ptr6>>2] = $add17;
    STACKTOP = sp;return;
   }
   $shr = $2 >>> 3;
   $cmp25 = ($2>>>0)<(256);
   if ($cmp25) {
    $add$ptr16$sum257 = (($add$ptr$sum230) + 8)|0;
    $fd = (($mem) + ($add$ptr16$sum257)|0);
    $4 = HEAP32[$fd>>2]|0;
    $add$ptr16$sum258 = (($add$ptr$sum230) + 12)|0;
    $bk = (($mem) + ($add$ptr16$sum258)|0);
    $5 = HEAP32[$bk>>2]|0;
    $shl = $shr << 1;
    $arrayidx = ((1424 + ($shl<<2)|0) + 40|0);
    $cmp29 = ($4|0)==($arrayidx|0);
    if (!($cmp29)) {
     $cmp31 = ($4>>>0)<($0>>>0);
     if ($cmp31) {
      _abort();
      // unreachable;
     }
     $bk34 = (($4) + 12|0);
     $6 = HEAP32[$bk34>>2]|0;
     $cmp35 = ($6|0)==($add$ptr16|0);
     if (!($cmp35)) {
      _abort();
      // unreachable;
     }
    }
    $cmp42 = ($5|0)==($4|0);
    if ($cmp42) {
     $shl45 = 1 << $shr;
     $neg = $shl45 ^ -1;
     $7 = HEAP32[1424>>2]|0;
     $and46 = $7 & $neg;
     HEAP32[1424>>2] = $and46;
     $p$0 = $add$ptr16;$psize$0 = $add17;
     break;
    }
    $cmp50 = ($5|0)==($arrayidx|0);
    if ($cmp50) {
     $fd67$pre = (($5) + 8|0);
     $fd67$pre$phiZ2D = $fd67$pre;
    } else {
     $cmp53 = ($5>>>0)<($0>>>0);
     if ($cmp53) {
      _abort();
      // unreachable;
     }
     $fd56 = (($5) + 8|0);
     $8 = HEAP32[$fd56>>2]|0;
     $cmp57 = ($8|0)==($add$ptr16|0);
     if ($cmp57) {
      $fd67$pre$phiZ2D = $fd56;
     } else {
      _abort();
      // unreachable;
     }
    }
    $bk66 = (($4) + 12|0);
    HEAP32[$bk66>>2] = $5;
    HEAP32[$fd67$pre$phiZ2D>>2] = $4;
    $p$0 = $add$ptr16;$psize$0 = $add17;
    break;
   }
   $add$ptr16$sum251 = (($add$ptr$sum230) + 24)|0;
   $parent = (($mem) + ($add$ptr16$sum251)|0);
   $9 = HEAP32[$parent>>2]|0;
   $add$ptr16$sum252 = (($add$ptr$sum230) + 12)|0;
   $bk73 = (($mem) + ($add$ptr16$sum252)|0);
   $10 = HEAP32[$bk73>>2]|0;
   $cmp74 = ($10|0)==($add$ptr16|0);
   do {
    if ($cmp74) {
     $child$sum = (($add$ptr$sum230) + 20)|0;
     $arrayidx99 = (($mem) + ($child$sum)|0);
     $14 = HEAP32[$arrayidx99>>2]|0;
     $cmp100 = ($14|0)==(0|0);
     if ($cmp100) {
      $add$ptr16$sum253 = (($add$ptr$sum230) + 16)|0;
      $child = (($mem) + ($add$ptr16$sum253)|0);
      $15 = HEAP32[$child>>2]|0;
      $cmp104 = ($15|0)==(0|0);
      if ($cmp104) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $15;$RP$0 = $child;
      }
     } else {
      $R$0 = $14;$RP$0 = $arrayidx99;
     }
     while(1) {
      $arrayidx108 = (($R$0) + 20|0);
      $16 = HEAP32[$arrayidx108>>2]|0;
      $cmp109 = ($16|0)==(0|0);
      if (!($cmp109)) {
       $R$0 = $16;$RP$0 = $arrayidx108;
       continue;
      }
      $arrayidx113 = (($R$0) + 16|0);
      $17 = HEAP32[$arrayidx113>>2]|0;
      $cmp114 = ($17|0)==(0|0);
      if ($cmp114) {
       break;
      } else {
       $R$0 = $17;$RP$0 = $arrayidx113;
      }
     }
     $cmp118 = ($RP$0>>>0)<($0>>>0);
     if ($cmp118) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $add$ptr16$sum256 = (($add$ptr$sum230) + 8)|0;
     $fd78 = (($mem) + ($add$ptr16$sum256)|0);
     $11 = HEAP32[$fd78>>2]|0;
     $cmp80 = ($11>>>0)<($0>>>0);
     if ($cmp80) {
      _abort();
      // unreachable;
     }
     $bk82 = (($11) + 12|0);
     $12 = HEAP32[$bk82>>2]|0;
     $cmp83 = ($12|0)==($add$ptr16|0);
     if (!($cmp83)) {
      _abort();
      // unreachable;
     }
     $fd86 = (($10) + 8|0);
     $13 = HEAP32[$fd86>>2]|0;
     $cmp87 = ($13|0)==($add$ptr16|0);
     if ($cmp87) {
      HEAP32[$bk82>>2] = $10;
      HEAP32[$fd86>>2] = $11;
      $R$1 = $10;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $cmp127 = ($9|0)==(0|0);
   if ($cmp127) {
    $p$0 = $add$ptr16;$psize$0 = $add17;
   } else {
    $add$ptr16$sum254 = (($add$ptr$sum230) + 28)|0;
    $index = (($mem) + ($add$ptr16$sum254)|0);
    $18 = HEAP32[$index>>2]|0;
    $arrayidx130 = ((1424 + ($18<<2)|0) + 304|0);
    $19 = HEAP32[$arrayidx130>>2]|0;
    $cmp131 = ($add$ptr16|0)==($19|0);
    if ($cmp131) {
     HEAP32[$arrayidx130>>2] = $R$1;
     $cond263 = ($R$1|0)==(0|0);
     if ($cond263) {
      $shl138 = 1 << $18;
      $neg139 = $shl138 ^ -1;
      $20 = HEAP32[((1424 + 4|0))>>2]|0;
      $and140 = $20 & $neg139;
      HEAP32[((1424 + 4|0))>>2] = $and140;
      $p$0 = $add$ptr16;$psize$0 = $add17;
      break;
     }
    } else {
     $21 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp143 = ($9>>>0)<($21>>>0);
     if ($cmp143) {
      _abort();
      // unreachable;
     }
     $arrayidx149 = (($9) + 16|0);
     $22 = HEAP32[$arrayidx149>>2]|0;
     $cmp150 = ($22|0)==($add$ptr16|0);
     if ($cmp150) {
      HEAP32[$arrayidx149>>2] = $R$1;
     } else {
      $arrayidx157 = (($9) + 20|0);
      HEAP32[$arrayidx157>>2] = $R$1;
     }
     $cmp162 = ($R$1|0)==(0|0);
     if ($cmp162) {
      $p$0 = $add$ptr16;$psize$0 = $add17;
      break;
     }
    }
    $23 = HEAP32[((1424 + 16|0))>>2]|0;
    $cmp165 = ($R$1>>>0)<($23>>>0);
    if ($cmp165) {
     _abort();
     // unreachable;
    }
    $parent170 = (($R$1) + 24|0);
    HEAP32[$parent170>>2] = $9;
    $add$ptr16$sum255 = (($add$ptr$sum230) + 16)|0;
    $child171 = (($mem) + ($add$ptr16$sum255)|0);
    $24 = HEAP32[$child171>>2]|0;
    $cmp173 = ($24|0)==(0|0);
    do {
     if (!($cmp173)) {
      $25 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp176 = ($24>>>0)<($25>>>0);
      if ($cmp176) {
       _abort();
       // unreachable;
      } else {
       $arrayidx182 = (($R$1) + 16|0);
       HEAP32[$arrayidx182>>2] = $24;
       $parent183 = (($24) + 24|0);
       HEAP32[$parent183>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $child171$sum = (($add$ptr$sum230) + 20)|0;
    $arrayidx188 = (($mem) + ($child171$sum)|0);
    $26 = HEAP32[$arrayidx188>>2]|0;
    $cmp189 = ($26|0)==(0|0);
    if ($cmp189) {
     $p$0 = $add$ptr16;$psize$0 = $add17;
    } else {
     $27 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp192 = ($26>>>0)<($27>>>0);
     if ($cmp192) {
      _abort();
      // unreachable;
     } else {
      $arrayidx198 = (($R$1) + 20|0);
      HEAP32[$arrayidx198>>2] = $26;
      $parent199 = (($26) + 24|0);
      HEAP32[$parent199>>2] = $R$1;
      $p$0 = $add$ptr16;$psize$0 = $add17;
      break;
     }
    }
   }
  } else {
   $p$0 = $add$ptr;$psize$0 = $and5;
  }
 } while(0);
 $cmp225 = ($p$0>>>0)<($add$ptr6>>>0);
 if (!($cmp225)) {
  _abort();
  // unreachable;
 }
 $add$ptr6$sum249 = (($and5) + -4)|0;
 $head228 = (($mem) + ($add$ptr6$sum249)|0);
 $30 = HEAP32[$head228>>2]|0;
 $and229 = $30 & 1;
 $tobool230 = ($and229|0)==(0);
 if ($tobool230) {
  _abort();
  // unreachable;
 }
 $and237 = $30 & 2;
 $tobool238 = ($and237|0)==(0);
 if ($tobool238) {
  $31 = HEAP32[((1424 + 24|0))>>2]|0;
  $cmp240 = ($add$ptr6|0)==($31|0);
  if ($cmp240) {
   $32 = HEAP32[((1424 + 12|0))>>2]|0;
   $add243 = (($32) + ($psize$0))|0;
   HEAP32[((1424 + 12|0))>>2] = $add243;
   HEAP32[((1424 + 24|0))>>2] = $p$0;
   $or244 = $add243 | 1;
   $head245 = (($p$0) + 4|0);
   HEAP32[$head245>>2] = $or244;
   $33 = HEAP32[((1424 + 20|0))>>2]|0;
   $cmp246 = ($p$0|0)==($33|0);
   if (!($cmp246)) {
    STACKTOP = sp;return;
   }
   HEAP32[((1424 + 20|0))>>2] = 0;
   HEAP32[((1424 + 8|0))>>2] = 0;
   STACKTOP = sp;return;
  }
  $34 = HEAP32[((1424 + 20|0))>>2]|0;
  $cmp251 = ($add$ptr6|0)==($34|0);
  if ($cmp251) {
   $35 = HEAP32[((1424 + 8|0))>>2]|0;
   $add254 = (($35) + ($psize$0))|0;
   HEAP32[((1424 + 8|0))>>2] = $add254;
   HEAP32[((1424 + 20|0))>>2] = $p$0;
   $or255 = $add254 | 1;
   $head256 = (($p$0) + 4|0);
   HEAP32[$head256>>2] = $or255;
   $add$ptr257 = (($p$0) + ($add254)|0);
   HEAP32[$add$ptr257>>2] = $add254;
   STACKTOP = sp;return;
  }
  $and261 = $30 & -8;
  $add262 = (($and261) + ($psize$0))|0;
  $shr263 = $30 >>> 3;
  $cmp264 = ($30>>>0)<(256);
  do {
   if ($cmp264) {
    $fd268 = (($mem) + ($and5)|0);
    $36 = HEAP32[$fd268>>2]|0;
    $add$ptr6$sum247248 = $and5 | 4;
    $bk270 = (($mem) + ($add$ptr6$sum247248)|0);
    $37 = HEAP32[$bk270>>2]|0;
    $shl273 = $shr263 << 1;
    $arrayidx274 = ((1424 + ($shl273<<2)|0) + 40|0);
    $cmp275 = ($36|0)==($arrayidx274|0);
    if (!($cmp275)) {
     $38 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp278 = ($36>>>0)<($38>>>0);
     if ($cmp278) {
      _abort();
      // unreachable;
     }
     $bk281 = (($36) + 12|0);
     $39 = HEAP32[$bk281>>2]|0;
     $cmp282 = ($39|0)==($add$ptr6|0);
     if (!($cmp282)) {
      _abort();
      // unreachable;
     }
    }
    $cmp291 = ($37|0)==($36|0);
    if ($cmp291) {
     $shl294 = 1 << $shr263;
     $neg295 = $shl294 ^ -1;
     $40 = HEAP32[1424>>2]|0;
     $and296 = $40 & $neg295;
     HEAP32[1424>>2] = $and296;
     break;
    }
    $cmp300 = ($37|0)==($arrayidx274|0);
    if ($cmp300) {
     $fd317$pre = (($37) + 8|0);
     $fd317$pre$phiZ2D = $fd317$pre;
    } else {
     $41 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp303 = ($37>>>0)<($41>>>0);
     if ($cmp303) {
      _abort();
      // unreachable;
     }
     $fd306 = (($37) + 8|0);
     $42 = HEAP32[$fd306>>2]|0;
     $cmp307 = ($42|0)==($add$ptr6|0);
     if ($cmp307) {
      $fd317$pre$phiZ2D = $fd306;
     } else {
      _abort();
      // unreachable;
     }
    }
    $bk316 = (($36) + 12|0);
    HEAP32[$bk316>>2] = $37;
    HEAP32[$fd317$pre$phiZ2D>>2] = $36;
   } else {
    $add$ptr6$sum232 = (($and5) + 16)|0;
    $parent326 = (($mem) + ($add$ptr6$sum232)|0);
    $43 = HEAP32[$parent326>>2]|0;
    $add$ptr6$sum233234 = $and5 | 4;
    $bk328 = (($mem) + ($add$ptr6$sum233234)|0);
    $44 = HEAP32[$bk328>>2]|0;
    $cmp329 = ($44|0)==($add$ptr6|0);
    do {
     if ($cmp329) {
      $child356$sum = (($and5) + 12)|0;
      $arrayidx357 = (($mem) + ($child356$sum)|0);
      $49 = HEAP32[$arrayidx357>>2]|0;
      $cmp358 = ($49|0)==(0|0);
      if ($cmp358) {
       $add$ptr6$sum235 = (($and5) + 8)|0;
       $child356 = (($mem) + ($add$ptr6$sum235)|0);
       $50 = HEAP32[$child356>>2]|0;
       $cmp363 = ($50|0)==(0|0);
       if ($cmp363) {
        $R327$1 = 0;
        break;
       } else {
        $R327$0 = $50;$RP355$0 = $child356;
       }
      } else {
       $R327$0 = $49;$RP355$0 = $arrayidx357;
      }
      while(1) {
       $arrayidx369 = (($R327$0) + 20|0);
       $51 = HEAP32[$arrayidx369>>2]|0;
       $cmp370 = ($51|0)==(0|0);
       if (!($cmp370)) {
        $R327$0 = $51;$RP355$0 = $arrayidx369;
        continue;
       }
       $arrayidx374 = (($R327$0) + 16|0);
       $52 = HEAP32[$arrayidx374>>2]|0;
       $cmp375 = ($52|0)==(0|0);
       if ($cmp375) {
        break;
       } else {
        $R327$0 = $52;$RP355$0 = $arrayidx374;
       }
      }
      $53 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp381 = ($RP355$0>>>0)<($53>>>0);
      if ($cmp381) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$RP355$0>>2] = 0;
       $R327$1 = $R327$0;
       break;
      }
     } else {
      $fd333 = (($mem) + ($and5)|0);
      $45 = HEAP32[$fd333>>2]|0;
      $46 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp335 = ($45>>>0)<($46>>>0);
      if ($cmp335) {
       _abort();
       // unreachable;
      }
      $bk338 = (($45) + 12|0);
      $47 = HEAP32[$bk338>>2]|0;
      $cmp339 = ($47|0)==($add$ptr6|0);
      if (!($cmp339)) {
       _abort();
       // unreachable;
      }
      $fd342 = (($44) + 8|0);
      $48 = HEAP32[$fd342>>2]|0;
      $cmp343 = ($48|0)==($add$ptr6|0);
      if ($cmp343) {
       HEAP32[$bk338>>2] = $44;
       HEAP32[$fd342>>2] = $45;
       $R327$1 = $44;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $cmp390 = ($43|0)==(0|0);
    if (!($cmp390)) {
     $add$ptr6$sum243 = (($and5) + 20)|0;
     $index394 = (($mem) + ($add$ptr6$sum243)|0);
     $54 = HEAP32[$index394>>2]|0;
     $arrayidx395 = ((1424 + ($54<<2)|0) + 304|0);
     $55 = HEAP32[$arrayidx395>>2]|0;
     $cmp396 = ($add$ptr6|0)==($55|0);
     if ($cmp396) {
      HEAP32[$arrayidx395>>2] = $R327$1;
      $cond264 = ($R327$1|0)==(0|0);
      if ($cond264) {
       $shl403 = 1 << $54;
       $neg404 = $shl403 ^ -1;
       $56 = HEAP32[((1424 + 4|0))>>2]|0;
       $and405 = $56 & $neg404;
       HEAP32[((1424 + 4|0))>>2] = $and405;
       break;
      }
     } else {
      $57 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp408 = ($43>>>0)<($57>>>0);
      if ($cmp408) {
       _abort();
       // unreachable;
      }
      $arrayidx414 = (($43) + 16|0);
      $58 = HEAP32[$arrayidx414>>2]|0;
      $cmp415 = ($58|0)==($add$ptr6|0);
      if ($cmp415) {
       HEAP32[$arrayidx414>>2] = $R327$1;
      } else {
       $arrayidx422 = (($43) + 20|0);
       HEAP32[$arrayidx422>>2] = $R327$1;
      }
      $cmp427 = ($R327$1|0)==(0|0);
      if ($cmp427) {
       break;
      }
     }
     $59 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp430 = ($R327$1>>>0)<($59>>>0);
     if ($cmp430) {
      _abort();
      // unreachable;
     }
     $parent437 = (($R327$1) + 24|0);
     HEAP32[$parent437>>2] = $43;
     $add$ptr6$sum244 = (($and5) + 8)|0;
     $child438 = (($mem) + ($add$ptr6$sum244)|0);
     $60 = HEAP32[$child438>>2]|0;
     $cmp440 = ($60|0)==(0|0);
     do {
      if (!($cmp440)) {
       $61 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp443 = ($60>>>0)<($61>>>0);
       if ($cmp443) {
        _abort();
        // unreachable;
       } else {
        $arrayidx449 = (($R327$1) + 16|0);
        HEAP32[$arrayidx449>>2] = $60;
        $parent450 = (($60) + 24|0);
        HEAP32[$parent450>>2] = $R327$1;
        break;
       }
      }
     } while(0);
     $child438$sum = (($and5) + 12)|0;
     $arrayidx455 = (($mem) + ($child438$sum)|0);
     $62 = HEAP32[$arrayidx455>>2]|0;
     $cmp456 = ($62|0)==(0|0);
     if (!($cmp456)) {
      $63 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp459 = ($62>>>0)<($63>>>0);
      if ($cmp459) {
       _abort();
       // unreachable;
      } else {
       $arrayidx465 = (($R327$1) + 20|0);
       HEAP32[$arrayidx465>>2] = $62;
       $parent466 = (($62) + 24|0);
       HEAP32[$parent466>>2] = $R327$1;
       break;
      }
     }
    }
   }
  } while(0);
  $or475 = $add262 | 1;
  $head476 = (($p$0) + 4|0);
  HEAP32[$head476>>2] = $or475;
  $add$ptr477 = (($p$0) + ($add262)|0);
  HEAP32[$add$ptr477>>2] = $add262;
  $64 = HEAP32[((1424 + 20|0))>>2]|0;
  $cmp479 = ($p$0|0)==($64|0);
  if ($cmp479) {
   HEAP32[((1424 + 8|0))>>2] = $add262;
   STACKTOP = sp;return;
  } else {
   $psize$1 = $add262;
  }
 } else {
  $and487 = $30 & -2;
  HEAP32[$head228>>2] = $and487;
  $or488 = $psize$0 | 1;
  $head489 = (($p$0) + 4|0);
  HEAP32[$head489>>2] = $or488;
  $add$ptr490 = (($p$0) + ($psize$0)|0);
  HEAP32[$add$ptr490>>2] = $psize$0;
  $psize$1 = $psize$0;
 }
 $shr493 = $psize$1 >>> 3;
 $cmp494 = ($psize$1>>>0)<(256);
 if ($cmp494) {
  $shl500 = $shr493 << 1;
  $arrayidx501 = ((1424 + ($shl500<<2)|0) + 40|0);
  $65 = HEAP32[1424>>2]|0;
  $shl503 = 1 << $shr493;
  $and504 = $65 & $shl503;
  $tobool505 = ($and504|0)==(0);
  if ($tobool505) {
   $or508 = $65 | $shl503;
   HEAP32[1424>>2] = $or508;
   $arrayidx501$sum$pre = (($shl500) + 2)|0;
   $$pre = ((1424 + ($arrayidx501$sum$pre<<2)|0) + 40|0);
   $$pre$phiZ2D = $$pre;$F502$0 = $arrayidx501;
  } else {
   $arrayidx501$sum242 = (($shl500) + 2)|0;
   $66 = ((1424 + ($arrayidx501$sum242<<2)|0) + 40|0);
   $67 = HEAP32[$66>>2]|0;
   $68 = HEAP32[((1424 + 16|0))>>2]|0;
   $cmp511 = ($67>>>0)<($68>>>0);
   if ($cmp511) {
    _abort();
    // unreachable;
   } else {
    $$pre$phiZ2D = $66;$F502$0 = $67;
   }
  }
  HEAP32[$$pre$phiZ2D>>2] = $p$0;
  $bk521 = (($F502$0) + 12|0);
  HEAP32[$bk521>>2] = $p$0;
  $fd522 = (($p$0) + 8|0);
  HEAP32[$fd522>>2] = $F502$0;
  $bk523 = (($p$0) + 12|0);
  HEAP32[$bk523>>2] = $arrayidx501;
  STACKTOP = sp;return;
 }
 $shr527 = $psize$1 >>> 8;
 $cmp528 = ($shr527|0)==(0);
 if ($cmp528) {
  $I526$0 = 0;
 } else {
  $cmp532 = ($psize$1>>>0)>(16777215);
  if ($cmp532) {
   $I526$0 = 31;
  } else {
   $sub = (($shr527) + 1048320)|0;
   $shr536 = $sub >>> 16;
   $and537 = $shr536 & 8;
   $shl538 = $shr527 << $and537;
   $sub539 = (($shl538) + 520192)|0;
   $shr540 = $sub539 >>> 16;
   $and541 = $shr540 & 4;
   $add542 = $and541 | $and537;
   $shl543 = $shl538 << $and541;
   $sub544 = (($shl543) + 245760)|0;
   $shr545 = $sub544 >>> 16;
   $and546 = $shr545 & 2;
   $add547 = $add542 | $and546;
   $sub548 = (14 - ($add547))|0;
   $shl549 = $shl543 << $and546;
   $shr550 = $shl549 >>> 15;
   $add551 = (($sub548) + ($shr550))|0;
   $shl552 = $add551 << 1;
   $add553 = (($add551) + 7)|0;
   $shr554 = $psize$1 >>> $add553;
   $and555 = $shr554 & 1;
   $add556 = $and555 | $shl552;
   $I526$0 = $add556;
  }
 }
 $arrayidx559 = ((1424 + ($I526$0<<2)|0) + 304|0);
 $index560 = (($p$0) + 28|0);
 $I526$0$c = $I526$0;
 HEAP32[$index560>>2] = $I526$0$c;
 $arrayidx562 = (($p$0) + 20|0);
 HEAP32[$arrayidx562>>2] = 0;
 $69 = (($p$0) + 16|0);
 HEAP32[$69>>2] = 0;
 $70 = HEAP32[((1424 + 4|0))>>2]|0;
 $shl565 = 1 << $I526$0;
 $and566 = $70 & $shl565;
 $tobool567 = ($and566|0)==(0);
 L199: do {
  if ($tobool567) {
   $or570 = $70 | $shl565;
   HEAP32[((1424 + 4|0))>>2] = $or570;
   HEAP32[$arrayidx559>>2] = $p$0;
   $parent571 = (($p$0) + 24|0);
   HEAP32[$parent571>>2] = $arrayidx559;
   $bk572 = (($p$0) + 12|0);
   HEAP32[$bk572>>2] = $p$0;
   $fd573 = (($p$0) + 8|0);
   HEAP32[$fd573>>2] = $p$0;
  } else {
   $71 = HEAP32[$arrayidx559>>2]|0;
   $cmp576 = ($I526$0|0)==(31);
   if ($cmp576) {
    $cond = 0;
   } else {
    $shr578 = $I526$0 >>> 1;
    $sub581 = (25 - ($shr578))|0;
    $cond = $sub581;
   }
   $head583266 = (($71) + 4|0);
   $72 = HEAP32[$head583266>>2]|0;
   $and584267 = $72 & -8;
   $cmp585268 = ($and584267|0)==($psize$1|0);
   L205: do {
    if ($cmp585268) {
     $T$0$lcssa = $71;
    } else {
     $shl582 = $psize$1 << $cond;
     $K575$0270 = $shl582;$T$0269 = $71;
     while(1) {
      $shr588 = $K575$0270 >>> 31;
      $arrayidx591 = ((($T$0269) + ($shr588<<2)|0) + 16|0);
      $73 = HEAP32[$arrayidx591>>2]|0;
      $cmp593 = ($73|0)==(0|0);
      if ($cmp593) {
       break;
      }
      $shl592 = $K575$0270 << 1;
      $head583 = (($73) + 4|0);
      $74 = HEAP32[$head583>>2]|0;
      $and584 = $74 & -8;
      $cmp585 = ($and584|0)==($psize$1|0);
      if ($cmp585) {
       $T$0$lcssa = $73;
       break L205;
      } else {
       $K575$0270 = $shl592;$T$0269 = $73;
      }
     }
     $75 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp597 = ($arrayidx591>>>0)<($75>>>0);
     if ($cmp597) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$arrayidx591>>2] = $p$0;
      $parent602 = (($p$0) + 24|0);
      HEAP32[$parent602>>2] = $T$0269;
      $bk603 = (($p$0) + 12|0);
      HEAP32[$bk603>>2] = $p$0;
      $fd604 = (($p$0) + 8|0);
      HEAP32[$fd604>>2] = $p$0;
      break L199;
     }
    }
   } while(0);
   $fd609 = (($T$0$lcssa) + 8|0);
   $76 = HEAP32[$fd609>>2]|0;
   $77 = HEAP32[((1424 + 16|0))>>2]|0;
   $cmp610 = ($T$0$lcssa>>>0)<($77>>>0);
   if ($cmp610) {
    _abort();
    // unreachable;
   }
   $cmp613 = ($76>>>0)<($77>>>0);
   if ($cmp613) {
    _abort();
    // unreachable;
   } else {
    $bk620 = (($76) + 12|0);
    HEAP32[$bk620>>2] = $p$0;
    HEAP32[$fd609>>2] = $p$0;
    $fd622 = (($p$0) + 8|0);
    HEAP32[$fd622>>2] = $76;
    $bk623 = (($p$0) + 12|0);
    HEAP32[$bk623>>2] = $T$0$lcssa;
    $parent624 = (($p$0) + 24|0);
    HEAP32[$parent624>>2] = 0;
    break;
   }
  }
 } while(0);
 $78 = HEAP32[((1424 + 32|0))>>2]|0;
 $dec = (($78) + -1)|0;
 HEAP32[((1424 + 32|0))>>2] = $dec;
 $cmp628 = ($dec|0)==(0);
 if ($cmp628) {
  $sp$0$in$i = ((1424 + 456|0));
 } else {
  STACKTOP = sp;return;
 }
 while(1) {
  $sp$0$i = HEAP32[$sp$0$in$i>>2]|0;
  $cmp$i = ($sp$0$i|0)==(0|0);
  $next4$i = (($sp$0$i) + 8|0);
  if ($cmp$i) {
   break;
  } else {
   $sp$0$in$i = $next4$i;
  }
 }
 HEAP32[((1424 + 32|0))>>2] = -1;
 STACKTOP = sp;return;
}
function _calloc($n_elements,$elem_size) {
 $n_elements = $n_elements|0;
 $elem_size = $elem_size|0;
 var $0 = 0, $and6 = 0, $call = 0, $cmp = 0, $cmp1 = 0, $cmp4 = 0, $cmp7 = 0, $div = 0, $head = 0, $mul = 0, $mul$ = 0, $or = 0, $req$0 = 0, $tobool = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $cmp = ($n_elements|0)==(0);
 if ($cmp) {
  $req$0 = 0;
 } else {
  $mul = Math_imul($elem_size, $n_elements)|0;
  $or = $elem_size | $n_elements;
  $tobool = ($or>>>0)>(65535);
  if ($tobool) {
   $div = (($mul>>>0) / ($n_elements>>>0))&-1;
   $cmp1 = ($div|0)==($elem_size|0);
   $mul$ = $cmp1 ? $mul : -1;
   $req$0 = $mul$;
  } else {
   $req$0 = $mul;
  }
 }
 $call = (_malloc($req$0)|0);
 $cmp4 = ($call|0)==(0|0);
 if ($cmp4) {
  STACKTOP = sp;return ($call|0);
 }
 $head = (($call) + -4|0);
 $0 = HEAP32[$head>>2]|0;
 $and6 = $0 & 3;
 $cmp7 = ($and6|0)==(0);
 if ($cmp7) {
  STACKTOP = sp;return ($call|0);
 }
 _memset(($call|0),0,($req$0|0))|0;
 STACKTOP = sp;return ($call|0);
}
function _realloc($oldmem,$bytes) {
 $oldmem = $oldmem|0;
 $bytes = $bytes|0;
 var $0 = 0, $add$ptr = 0, $add$ptr10 = 0, $add6 = 0, $and = 0, $and15 = 0, $and17 = 0, $call = 0, $call12 = 0, $call3 = 0, $call7 = 0, $cmp = 0, $cmp1 = 0, $cmp13 = 0, $cmp18 = 0, $cmp20 = 0, $cmp5 = 0, $cmp8 = 0, $cond = 0, $cond19 = 0;
 var $cond24 = 0, $head = 0, $mem$0 = 0, $sub = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $cmp = ($oldmem|0)==(0|0);
 if ($cmp) {
  $call = (_malloc($bytes)|0);
  $mem$0 = $call;
  STACKTOP = sp;return ($mem$0|0);
 }
 $cmp1 = ($bytes>>>0)>(4294967231);
 if ($cmp1) {
  $call3 = (___errno_location()|0);
  HEAP32[$call3>>2] = 12;
  $mem$0 = 0;
  STACKTOP = sp;return ($mem$0|0);
 }
 $cmp5 = ($bytes>>>0)<(11);
 if ($cmp5) {
  $cond = 16;
 } else {
  $add6 = (($bytes) + 11)|0;
  $and = $add6 & -8;
  $cond = $and;
 }
 $add$ptr = (($oldmem) + -8|0);
 $call7 = (_try_realloc_chunk($add$ptr,$cond)|0);
 $cmp8 = ($call7|0)==(0|0);
 if (!($cmp8)) {
  $add$ptr10 = (($call7) + 8|0);
  $mem$0 = $add$ptr10;
  STACKTOP = sp;return ($mem$0|0);
 }
 $call12 = (_malloc($bytes)|0);
 $cmp13 = ($call12|0)==(0|0);
 if ($cmp13) {
  $mem$0 = 0;
  STACKTOP = sp;return ($mem$0|0);
 }
 $head = (($oldmem) + -4|0);
 $0 = HEAP32[$head>>2]|0;
 $and15 = $0 & -8;
 $and17 = $0 & 3;
 $cmp18 = ($and17|0)==(0);
 $cond19 = $cmp18 ? 8 : 4;
 $sub = (($and15) - ($cond19))|0;
 $cmp20 = ($sub>>>0)<($bytes>>>0);
 $cond24 = $cmp20 ? $sub : $bytes;
 _memcpy(($call12|0),($oldmem|0),($cond24|0))|0;
 _free($oldmem);
 $mem$0 = $call12;
 STACKTOP = sp;return ($mem$0|0);
}
function _try_realloc_chunk($p,$nb) {
 $p = $p|0;
 $nb = $nb|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $R$0 = 0;
 var $R$1 = 0, $RP$0 = 0, $add = 0, $add$i = 0, $add$ptr = 0, $add$ptr$sum = 0, $add$ptr$sum10 = 0, $add$ptr$sum11 = 0, $add$ptr$sum1516 = 0, $add$ptr$sum2 = 0, $add$ptr$sum3 = 0, $add$ptr$sum7 = 0, $add$ptr$sum8 = 0, $add$ptr$sum9 = 0, $add$ptr17 = 0, $add$ptr17$sum = 0, $add$ptr298$sum6 = 0, $add$ptr303 = 0, $add$ptr303$sum = 0, $add$ptr317$sum5 = 0;
 var $add$ptr41 = 0, $add$ptr41$sum = 0, $add$ptr66 = 0, $add$ptr66$sum = 0, $add$ptr67 = 0, $add$ptr67$sum = 0, $add$ptr91$sum = 0, $add105 = 0, $add58 = 0, $and = 0, $and100 = 0, $and104 = 0, $and128 = 0, $and19 = 0, $and2 = 0, $and216 = 0, $and294 = 0, $and305 = 0, $and43 = 0, $and69 = 0;
 var $and7 = 0, $and80 = 0, $and87 = 0, $arrayidx = 0, $arrayidx179 = 0, $arrayidx186 = 0, $arrayidx190 = 0, $arrayidx206 = 0, $arrayidx226 = 0, $arrayidx234 = 0, $arrayidx261 = 0, $arrayidx267 = 0, $arrayidx278 = 0, $bk = 0, $bk118 = 0, $bk147 = 0, $bk155 = 0, $bk164 = 0, $child = 0, $child$sum = 0;
 var $child249 = 0, $child249$sum = 0, $cmp = 0, $cmp$i = 0, $cmp1$i = 0, $cmp106 = 0, $cmp11 = 0, $cmp111 = 0, $cmp114 = 0, $cmp116 = 0, $cmp119 = 0, $cmp125 = 0, $cmp13 = 0, $cmp133 = 0, $cmp136 = 0, $cmp139 = 0, $cmp15 = 0, $cmp156 = 0, $cmp162 = 0, $cmp165 = 0;
 var $cmp168 = 0, $cmp180 = 0, $cmp183 = 0, $cmp187 = 0, $cmp191 = 0, $cmp195 = 0, $cmp2$i = 0, $cmp203 = 0, $cmp207 = 0, $cmp220 = 0, $cmp227 = 0, $cmp239 = 0, $cmp243 = 0, $cmp251 = 0, $cmp255 = 0, $cmp268 = 0, $cmp272 = 0, $cmp288 = 0, $cmp3 = 0, $cmp34 = 0;
 var $cmp36 = 0, $cmp5 = 0, $cmp56 = 0, $cmp59 = 0, $cmp63 = 0, $cond = 0, $fd = 0, $fd138 = 0, $fd148$pre = 0, $fd148$pre$phiZ2D = 0, $fd159 = 0, $fd167 = 0, $head = 0, $head23 = 0, $head299 = 0, $head310 = 0, $head318 = 0, $head48 = 0, $head6 = 0, $head74 = 0;
 var $head79 = 0, $head92 = 0, $index = 0, $neg = 0, $neg215 = 0, $newp$0 = 0, $or = 0, $or$cond = 0, $or20 = 0, $or28 = 0, $or295 = 0, $or296 = 0, $or300 = 0, $or306 = 0, $or307 = 0, $or315 = 0, $or319 = 0, $or32 = 0, $or44 = 0, $or45 = 0;
 var $or50 = 0, $or70 = 0, $or71 = 0, $or76 = 0, $or88 = 0, $or89 = 0, $or93 = 0, $parent = 0, $parent248 = 0, $parent262 = 0, $parent279 = 0, $shl = 0, $shl$i = 0, $shl127 = 0, $shl214 = 0, $shr = 0, $storemerge = 0, $storemerge12 = 0, $sub = 0, $sub$i = 0;
 var $sub110 = 0, $sub40 = 0, $sub62 = 0, $tobool = 0, $tobool101 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $head = (($p) + 4|0);
 $0 = HEAP32[$head>>2]|0;
 $and = $0 & -8;
 $add$ptr = (($p) + ($and)|0);
 $1 = HEAP32[((1424 + 16|0))>>2]|0;
 $cmp = ($p>>>0)<($1>>>0);
 if ($cmp) {
  _abort();
  // unreachable;
 }
 $and2 = $0 & 3;
 $cmp3 = ($and2|0)!=(1);
 $cmp5 = ($p>>>0)<($add$ptr>>>0);
 $or$cond = $cmp3 & $cmp5;
 if (!($or$cond)) {
  _abort();
  // unreachable;
 }
 $add$ptr$sum1516 = $and | 4;
 $head6 = (($p) + ($add$ptr$sum1516)|0);
 $2 = HEAP32[$head6>>2]|0;
 $and7 = $2 & 1;
 $tobool = ($and7|0)==(0);
 if ($tobool) {
  _abort();
  // unreachable;
 }
 $cmp11 = ($and2|0)==(0);
 if ($cmp11) {
  $cmp$i = ($nb>>>0)<(256);
  if ($cmp$i) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $add$i = (($nb) + 4)|0;
  $cmp1$i = ($and>>>0)<($add$i>>>0);
  if (!($cmp1$i)) {
   $sub$i = (($and) - ($nb))|0;
   $3 = HEAP32[((1896 + 8|0))>>2]|0;
   $shl$i = $3 << 1;
   $cmp2$i = ($sub$i>>>0)>($shl$i>>>0);
   if (!($cmp2$i)) {
    $newp$0 = $p;
    STACKTOP = sp;return ($newp$0|0);
   }
  }
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $cmp13 = ($and>>>0)<($nb>>>0);
 if (!($cmp13)) {
  $sub = (($and) - ($nb))|0;
  $cmp15 = ($sub>>>0)>(15);
  if (!($cmp15)) {
   $newp$0 = $p;
   STACKTOP = sp;return ($newp$0|0);
  }
  $add$ptr17 = (($p) + ($nb)|0);
  $and19 = $0 & 1;
  $or = $and19 | $nb;
  $or20 = $or | 2;
  HEAP32[$head>>2] = $or20;
  $add$ptr17$sum = (($nb) + 4)|0;
  $head23 = (($p) + ($add$ptr17$sum)|0);
  $or28 = $sub | 3;
  HEAP32[$head23>>2] = $or28;
  $4 = HEAP32[$head6>>2]|0;
  $or32 = $4 | 1;
  HEAP32[$head6>>2] = $or32;
  _dispose_chunk($add$ptr17,$sub);
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $5 = HEAP32[((1424 + 24|0))>>2]|0;
 $cmp34 = ($add$ptr|0)==($5|0);
 if ($cmp34) {
  $6 = HEAP32[((1424 + 12|0))>>2]|0;
  $add = (($6) + ($and))|0;
  $cmp36 = ($add>>>0)>($nb>>>0);
  if (!($cmp36)) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $sub40 = (($add) - ($nb))|0;
  $add$ptr41 = (($p) + ($nb)|0);
  $and43 = $0 & 1;
  $or44 = $and43 | $nb;
  $or45 = $or44 | 2;
  HEAP32[$head>>2] = $or45;
  $add$ptr41$sum = (($nb) + 4)|0;
  $head48 = (($p) + ($add$ptr41$sum)|0);
  $or50 = $sub40 | 1;
  HEAP32[$head48>>2] = $or50;
  HEAP32[((1424 + 24|0))>>2] = $add$ptr41;
  HEAP32[((1424 + 12|0))>>2] = $sub40;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $7 = HEAP32[((1424 + 20|0))>>2]|0;
 $cmp56 = ($add$ptr|0)==($7|0);
 if ($cmp56) {
  $8 = HEAP32[((1424 + 8|0))>>2]|0;
  $add58 = (($8) + ($and))|0;
  $cmp59 = ($add58>>>0)<($nb>>>0);
  if ($cmp59) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $sub62 = (($add58) - ($nb))|0;
  $cmp63 = ($sub62>>>0)>(15);
  if ($cmp63) {
   $add$ptr66 = (($p) + ($nb)|0);
   $add$ptr67 = (($p) + ($add58)|0);
   $and69 = $0 & 1;
   $or70 = $and69 | $nb;
   $or71 = $or70 | 2;
   HEAP32[$head>>2] = $or71;
   $add$ptr66$sum = (($nb) + 4)|0;
   $head74 = (($p) + ($add$ptr66$sum)|0);
   $or76 = $sub62 | 1;
   HEAP32[$head74>>2] = $or76;
   HEAP32[$add$ptr67>>2] = $sub62;
   $add$ptr67$sum = (($add58) + 4)|0;
   $head79 = (($p) + ($add$ptr67$sum)|0);
   $9 = HEAP32[$head79>>2]|0;
   $and80 = $9 & -2;
   HEAP32[$head79>>2] = $and80;
   $storemerge = $add$ptr66;$storemerge12 = $sub62;
  } else {
   $and87 = $0 & 1;
   $or88 = $and87 | $add58;
   $or89 = $or88 | 2;
   HEAP32[$head>>2] = $or89;
   $add$ptr91$sum = (($add58) + 4)|0;
   $head92 = (($p) + ($add$ptr91$sum)|0);
   $10 = HEAP32[$head92>>2]|0;
   $or93 = $10 | 1;
   HEAP32[$head92>>2] = $or93;
   $storemerge = 0;$storemerge12 = 0;
  }
  HEAP32[((1424 + 8|0))>>2] = $storemerge12;
  HEAP32[((1424 + 20|0))>>2] = $storemerge;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $and100 = $2 & 2;
 $tobool101 = ($and100|0)==(0);
 if (!($tobool101)) {
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $and104 = $2 & -8;
 $add105 = (($and104) + ($and))|0;
 $cmp106 = ($add105>>>0)<($nb>>>0);
 if ($cmp106) {
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $sub110 = (($add105) - ($nb))|0;
 $shr = $2 >>> 3;
 $cmp111 = ($2>>>0)<(256);
 do {
  if ($cmp111) {
   $add$ptr$sum10 = (($and) + 8)|0;
   $fd = (($p) + ($add$ptr$sum10)|0);
   $11 = HEAP32[$fd>>2]|0;
   $add$ptr$sum11 = (($and) + 12)|0;
   $bk = (($p) + ($add$ptr$sum11)|0);
   $12 = HEAP32[$bk>>2]|0;
   $shl = $shr << 1;
   $arrayidx = ((1424 + ($shl<<2)|0) + 40|0);
   $cmp114 = ($11|0)==($arrayidx|0);
   if (!($cmp114)) {
    $cmp116 = ($11>>>0)<($1>>>0);
    if ($cmp116) {
     _abort();
     // unreachable;
    }
    $bk118 = (($11) + 12|0);
    $13 = HEAP32[$bk118>>2]|0;
    $cmp119 = ($13|0)==($add$ptr|0);
    if (!($cmp119)) {
     _abort();
     // unreachable;
    }
   }
   $cmp125 = ($12|0)==($11|0);
   if ($cmp125) {
    $shl127 = 1 << $shr;
    $neg = $shl127 ^ -1;
    $14 = HEAP32[1424>>2]|0;
    $and128 = $14 & $neg;
    HEAP32[1424>>2] = $and128;
    break;
   }
   $cmp133 = ($12|0)==($arrayidx|0);
   if ($cmp133) {
    $fd148$pre = (($12) + 8|0);
    $fd148$pre$phiZ2D = $fd148$pre;
   } else {
    $cmp136 = ($12>>>0)<($1>>>0);
    if ($cmp136) {
     _abort();
     // unreachable;
    }
    $fd138 = (($12) + 8|0);
    $15 = HEAP32[$fd138>>2]|0;
    $cmp139 = ($15|0)==($add$ptr|0);
    if ($cmp139) {
     $fd148$pre$phiZ2D = $fd138;
    } else {
     _abort();
     // unreachable;
    }
   }
   $bk147 = (($11) + 12|0);
   HEAP32[$bk147>>2] = $12;
   HEAP32[$fd148$pre$phiZ2D>>2] = $11;
  } else {
   $add$ptr$sum = (($and) + 24)|0;
   $parent = (($p) + ($add$ptr$sum)|0);
   $16 = HEAP32[$parent>>2]|0;
   $add$ptr$sum2 = (($and) + 12)|0;
   $bk155 = (($p) + ($add$ptr$sum2)|0);
   $17 = HEAP32[$bk155>>2]|0;
   $cmp156 = ($17|0)==($add$ptr|0);
   do {
    if ($cmp156) {
     $child$sum = (($and) + 20)|0;
     $arrayidx179 = (($p) + ($child$sum)|0);
     $21 = HEAP32[$arrayidx179>>2]|0;
     $cmp180 = ($21|0)==(0|0);
     if ($cmp180) {
      $add$ptr$sum3 = (($and) + 16)|0;
      $child = (($p) + ($add$ptr$sum3)|0);
      $22 = HEAP32[$child>>2]|0;
      $cmp183 = ($22|0)==(0|0);
      if ($cmp183) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $22;$RP$0 = $child;
      }
     } else {
      $R$0 = $21;$RP$0 = $arrayidx179;
     }
     while(1) {
      $arrayidx186 = (($R$0) + 20|0);
      $23 = HEAP32[$arrayidx186>>2]|0;
      $cmp187 = ($23|0)==(0|0);
      if (!($cmp187)) {
       $R$0 = $23;$RP$0 = $arrayidx186;
       continue;
      }
      $arrayidx190 = (($R$0) + 16|0);
      $24 = HEAP32[$arrayidx190>>2]|0;
      $cmp191 = ($24|0)==(0|0);
      if ($cmp191) {
       break;
      } else {
       $R$0 = $24;$RP$0 = $arrayidx190;
      }
     }
     $cmp195 = ($RP$0>>>0)<($1>>>0);
     if ($cmp195) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $add$ptr$sum9 = (($and) + 8)|0;
     $fd159 = (($p) + ($add$ptr$sum9)|0);
     $18 = HEAP32[$fd159>>2]|0;
     $cmp162 = ($18>>>0)<($1>>>0);
     if ($cmp162) {
      _abort();
      // unreachable;
     }
     $bk164 = (($18) + 12|0);
     $19 = HEAP32[$bk164>>2]|0;
     $cmp165 = ($19|0)==($add$ptr|0);
     if (!($cmp165)) {
      _abort();
      // unreachable;
     }
     $fd167 = (($17) + 8|0);
     $20 = HEAP32[$fd167>>2]|0;
     $cmp168 = ($20|0)==($add$ptr|0);
     if ($cmp168) {
      HEAP32[$bk164>>2] = $17;
      HEAP32[$fd167>>2] = $18;
      $R$1 = $17;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $cmp203 = ($16|0)==(0|0);
   if (!($cmp203)) {
    $add$ptr$sum7 = (($and) + 28)|0;
    $index = (($p) + ($add$ptr$sum7)|0);
    $25 = HEAP32[$index>>2]|0;
    $arrayidx206 = ((1424 + ($25<<2)|0) + 304|0);
    $26 = HEAP32[$arrayidx206>>2]|0;
    $cmp207 = ($add$ptr|0)==($26|0);
    if ($cmp207) {
     HEAP32[$arrayidx206>>2] = $R$1;
     $cond = ($R$1|0)==(0|0);
     if ($cond) {
      $shl214 = 1 << $25;
      $neg215 = $shl214 ^ -1;
      $27 = HEAP32[((1424 + 4|0))>>2]|0;
      $and216 = $27 & $neg215;
      HEAP32[((1424 + 4|0))>>2] = $and216;
      break;
     }
    } else {
     $28 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp220 = ($16>>>0)<($28>>>0);
     if ($cmp220) {
      _abort();
      // unreachable;
     }
     $arrayidx226 = (($16) + 16|0);
     $29 = HEAP32[$arrayidx226>>2]|0;
     $cmp227 = ($29|0)==($add$ptr|0);
     if ($cmp227) {
      HEAP32[$arrayidx226>>2] = $R$1;
     } else {
      $arrayidx234 = (($16) + 20|0);
      HEAP32[$arrayidx234>>2] = $R$1;
     }
     $cmp239 = ($R$1|0)==(0|0);
     if ($cmp239) {
      break;
     }
    }
    $30 = HEAP32[((1424 + 16|0))>>2]|0;
    $cmp243 = ($R$1>>>0)<($30>>>0);
    if ($cmp243) {
     _abort();
     // unreachable;
    }
    $parent248 = (($R$1) + 24|0);
    HEAP32[$parent248>>2] = $16;
    $add$ptr$sum8 = (($and) + 16)|0;
    $child249 = (($p) + ($add$ptr$sum8)|0);
    $31 = HEAP32[$child249>>2]|0;
    $cmp251 = ($31|0)==(0|0);
    do {
     if (!($cmp251)) {
      $32 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp255 = ($31>>>0)<($32>>>0);
      if ($cmp255) {
       _abort();
       // unreachable;
      } else {
       $arrayidx261 = (($R$1) + 16|0);
       HEAP32[$arrayidx261>>2] = $31;
       $parent262 = (($31) + 24|0);
       HEAP32[$parent262>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $child249$sum = (($and) + 20)|0;
    $arrayidx267 = (($p) + ($child249$sum)|0);
    $33 = HEAP32[$arrayidx267>>2]|0;
    $cmp268 = ($33|0)==(0|0);
    if (!($cmp268)) {
     $34 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp272 = ($33>>>0)<($34>>>0);
     if ($cmp272) {
      _abort();
      // unreachable;
     } else {
      $arrayidx278 = (($R$1) + 20|0);
      HEAP32[$arrayidx278>>2] = $33;
      $parent279 = (($33) + 24|0);
      HEAP32[$parent279>>2] = $R$1;
      break;
     }
    }
   }
  }
 } while(0);
 $cmp288 = ($sub110>>>0)<(16);
 if ($cmp288) {
  $35 = HEAP32[$head>>2]|0;
  $and294 = $35 & 1;
  $or295 = $add105 | $and294;
  $or296 = $or295 | 2;
  HEAP32[$head>>2] = $or296;
  $add$ptr298$sum6 = $add105 | 4;
  $head299 = (($p) + ($add$ptr298$sum6)|0);
  $36 = HEAP32[$head299>>2]|0;
  $or300 = $36 | 1;
  HEAP32[$head299>>2] = $or300;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 } else {
  $add$ptr303 = (($p) + ($nb)|0);
  $37 = HEAP32[$head>>2]|0;
  $and305 = $37 & 1;
  $or306 = $and305 | $nb;
  $or307 = $or306 | 2;
  HEAP32[$head>>2] = $or307;
  $add$ptr303$sum = (($nb) + 4)|0;
  $head310 = (($p) + ($add$ptr303$sum)|0);
  $or315 = $sub110 | 3;
  HEAP32[$head310>>2] = $or315;
  $add$ptr317$sum5 = $add105 | 4;
  $head318 = (($p) + ($add$ptr317$sum5)|0);
  $38 = HEAP32[$head318>>2]|0;
  $or319 = $38 | 1;
  HEAP32[$head318>>2] = $or319;
  _dispose_chunk($add$ptr303,$sub110);
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 return 0|0;
}
function _dispose_chunk($p,$psize) {
 $p = $p|0;
 $psize = $psize|0;
 var $$pre = 0, $$pre$phiZ2D = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $8 = 0, $9 = 0, $F511$0 = 0, $I539$0 = 0, $I539$0$c = 0;
 var $K591$036 = 0, $R$0 = 0, $R$1 = 0, $R325$0 = 0, $R325$1 = 0, $RP$0 = 0, $RP354$0 = 0, $T$0$lcssa = 0, $T$035 = 0, $add$ptr = 0, $add$ptr$sum = 0, $add$ptr$sum1 = 0, $add$ptr$sum12 = 0, $add$ptr$sum13 = 0, $add$ptr$sum14 = 0, $add$ptr$sum15 = 0, $add$ptr$sum16 = 0, $add$ptr$sum2 = 0, $add$ptr$sum3 = 0, $add$ptr$sum4 = 0;
 var $add$ptr250 = 0, $add$ptr483 = 0, $add$ptr498 = 0, $add$ptr5 = 0, $add$ptr5$sum = 0, $add$ptr5$sum18 = 0, $add$ptr5$sum19 = 0, $add$ptr5$sum20 = 0, $add$ptr5$sum21 = 0, $add$ptr5$sum22 = 0, $add$ptr5$sum23 = 0, $add$ptr5$sum24 = 0, $add$ptr5$sum25 = 0, $add229 = 0, $add246 = 0, $add255 = 0, $add555 = 0, $add560 = 0, $add564 = 0, $add566 = 0;
 var $add569 = 0, $add6 = 0, $and = 0, $and128 = 0, $and2 = 0, $and202 = 0, $and207 = 0, $and223 = 0, $and254 = 0, $and292 = 0, $and32 = 0, $and407 = 0, $and495 = 0, $and514 = 0, $and550 = 0, $and554 = 0, $and559 = 0, $and568 = 0, $and581 = 0, $and600 = 0;
 var $and60033 = 0, $arrayidx = 0, $arrayidx100 = 0, $arrayidx118 = 0, $arrayidx138 = 0, $arrayidx146 = 0, $arrayidx173 = 0, $arrayidx179 = 0, $arrayidx190 = 0, $arrayidx268 = 0, $arrayidx356 = 0, $arrayidx368 = 0, $arrayidx373 = 0, $arrayidx396 = 0, $arrayidx417 = 0, $arrayidx425 = 0, $arrayidx454 = 0, $arrayidx460 = 0, $arrayidx471 = 0, $arrayidx510 = 0;
 var $arrayidx510$sum$pre = 0, $arrayidx510$sum11 = 0, $arrayidx573 = 0, $arrayidx576 = 0, $arrayidx607 = 0, $arrayidx86 = 0, $arrayidx95 = 0, $bk = 0, $bk22 = 0, $bk263 = 0, $bk276 = 0, $bk314 = 0, $bk326 = 0, $bk337 = 0, $bk52 = 0, $bk533 = 0, $bk535 = 0, $bk588 = 0, $bk60 = 0, $bk620 = 0;
 var $bk639 = 0, $bk642 = 0, $bk70 = 0, $child = 0, $child$sum = 0, $child161 = 0, $child161$sum = 0, $child355 = 0, $child355$sum = 0, $child442 = 0, $child442$sum = 0, $cmp = 0, $cmp10 = 0, $cmp101 = 0, $cmp106 = 0, $cmp115 = 0, $cmp119 = 0, $cmp13 = 0, $cmp132 = 0, $cmp139 = 0;
 var $cmp151 = 0, $cmp155 = 0, $cmp163 = 0, $cmp167 = 0, $cmp17 = 0, $cmp180 = 0, $cmp184 = 0, $cmp20 = 0, $cmp203 = 0, $cmp217 = 0, $cmp226 = 0, $cmp23 = 0, $cmp234 = 0, $cmp242 = 0, $cmp257 = 0, $cmp269 = 0, $cmp273 = 0, $cmp277 = 0, $cmp28 = 0, $cmp286 = 0;
 var $cmp297 = 0, $cmp301 = 0, $cmp305 = 0, $cmp327 = 0, $cmp334 = 0, $cmp338 = 0, $cmp342 = 0, $cmp357 = 0, $cmp36 = 0, $cmp362 = 0, $cmp369 = 0, $cmp374 = 0, $cmp381 = 0, $cmp390 = 0, $cmp397 = 0, $cmp40 = 0, $cmp411 = 0, $cmp418 = 0, $cmp430 = 0, $cmp434 = 0;
 var $cmp44 = 0, $cmp444 = 0, $cmp448 = 0, $cmp461 = 0, $cmp465 = 0, $cmp486 = 0, $cmp502 = 0, $cmp523 = 0, $cmp541 = 0, $cmp545 = 0, $cmp592 = 0, $cmp601 = 0, $cmp60134 = 0, $cmp609 = 0, $cmp61 = 0, $cmp614 = 0, $cmp628 = 0, $cmp632 = 0, $cmp68 = 0, $cmp7 = 0;
 var $cmp71 = 0, $cmp75 = 0, $cmp87 = 0, $cmp91 = 0, $cmp96 = 0, $cond = 0, $cond29 = 0, $cond30 = 0, $fd = 0, $fd261 = 0, $fd304 = 0, $fd315$pre = 0, $fd315$pre$phiZ2D = 0, $fd331 = 0, $fd341 = 0, $fd43 = 0, $fd53$pre = 0, $fd53$pre$phiZ2D = 0, $fd534 = 0, $fd589 = 0;
 var $fd621 = 0, $fd626 = 0, $fd641 = 0, $fd65 = 0, $fd74 = 0, $head = 0, $head201 = 0, $head208 = 0, $head222 = 0, $head232 = 0, $head249 = 0, $head482 = 0, $head497 = 0, $head599 = 0, $head59932 = 0, $idx$neg = 0, $index = 0, $index394 = 0, $index574 = 0, $neg = 0;
 var $neg127 = 0, $neg290 = 0, $neg405 = 0, $or = 0, $or231 = 0, $or248 = 0, $or481 = 0, $or496 = 0, $or519 = 0, $or586 = 0, $p$addr$0 = 0, $parent = 0, $parent160 = 0, $parent174 = 0, $parent191 = 0, $parent324 = 0, $parent441 = 0, $parent455 = 0, $parent472 = 0, $parent587 = 0;
 var $parent619 = 0, $parent643 = 0, $psize$addr$0 = 0, $psize$addr$1 = 0, $shl = 0, $shl126 = 0, $shl266 = 0, $shl289 = 0, $shl31 = 0, $shl404 = 0, $shl508 = 0, $shl513 = 0, $shl551 = 0, $shl556 = 0, $shl562 = 0, $shl565 = 0, $shl580 = 0, $shl598 = 0, $shl608 = 0, $shr = 0;
 var $shr256 = 0, $shr501 = 0, $shr540 = 0, $shr549 = 0, $shr553 = 0, $shr558 = 0, $shr563 = 0, $shr567 = 0, $shr594 = 0, $shr604 = 0, $sub = 0, $sub552 = 0, $sub557 = 0, $sub561 = 0, $sub597 = 0, $tobool = 0, $tobool224 = 0, $tobool515 = 0, $tobool582 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $add$ptr = (($p) + ($psize)|0);
 $head = (($p) + 4|0);
 $0 = HEAP32[$head>>2]|0;
 $and = $0 & 1;
 $tobool = ($and|0)==(0);
 do {
  if ($tobool) {
   $1 = HEAP32[$p>>2]|0;
   $and2 = $0 & 3;
   $cmp = ($and2|0)==(0);
   if ($cmp) {
    STACKTOP = sp;return;
   }
   $idx$neg = (0 - ($1))|0;
   $add$ptr5 = (($p) + ($idx$neg)|0);
   $add6 = (($1) + ($psize))|0;
   $2 = HEAP32[((1424 + 16|0))>>2]|0;
   $cmp7 = ($add$ptr5>>>0)<($2>>>0);
   if ($cmp7) {
    _abort();
    // unreachable;
   }
   $3 = HEAP32[((1424 + 20|0))>>2]|0;
   $cmp10 = ($add$ptr5|0)==($3|0);
   if ($cmp10) {
    $add$ptr$sum = (($psize) + 4)|0;
    $head201 = (($p) + ($add$ptr$sum)|0);
    $28 = HEAP32[$head201>>2]|0;
    $and202 = $28 & 3;
    $cmp203 = ($and202|0)==(3);
    if (!($cmp203)) {
     $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
     break;
    }
    HEAP32[((1424 + 8|0))>>2] = $add6;
    $29 = HEAP32[$head201>>2]|0;
    $and207 = $29 & -2;
    HEAP32[$head201>>2] = $and207;
    $or = $add6 | 1;
    $add$ptr5$sum = (4 - ($1))|0;
    $head208 = (($p) + ($add$ptr5$sum)|0);
    HEAP32[$head208>>2] = $or;
    HEAP32[$add$ptr>>2] = $add6;
    STACKTOP = sp;return;
   }
   $shr = $1 >>> 3;
   $cmp13 = ($1>>>0)<(256);
   if ($cmp13) {
    $add$ptr5$sum24 = (8 - ($1))|0;
    $fd = (($p) + ($add$ptr5$sum24)|0);
    $4 = HEAP32[$fd>>2]|0;
    $add$ptr5$sum25 = (12 - ($1))|0;
    $bk = (($p) + ($add$ptr5$sum25)|0);
    $5 = HEAP32[$bk>>2]|0;
    $shl = $shr << 1;
    $arrayidx = ((1424 + ($shl<<2)|0) + 40|0);
    $cmp17 = ($4|0)==($arrayidx|0);
    if (!($cmp17)) {
     $cmp20 = ($4>>>0)<($2>>>0);
     if ($cmp20) {
      _abort();
      // unreachable;
     }
     $bk22 = (($4) + 12|0);
     $6 = HEAP32[$bk22>>2]|0;
     $cmp23 = ($6|0)==($add$ptr5|0);
     if (!($cmp23)) {
      _abort();
      // unreachable;
     }
    }
    $cmp28 = ($5|0)==($4|0);
    if ($cmp28) {
     $shl31 = 1 << $shr;
     $neg = $shl31 ^ -1;
     $7 = HEAP32[1424>>2]|0;
     $and32 = $7 & $neg;
     HEAP32[1424>>2] = $and32;
     $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
     break;
    }
    $cmp36 = ($5|0)==($arrayidx|0);
    if ($cmp36) {
     $fd53$pre = (($5) + 8|0);
     $fd53$pre$phiZ2D = $fd53$pre;
    } else {
     $cmp40 = ($5>>>0)<($2>>>0);
     if ($cmp40) {
      _abort();
      // unreachable;
     }
     $fd43 = (($5) + 8|0);
     $8 = HEAP32[$fd43>>2]|0;
     $cmp44 = ($8|0)==($add$ptr5|0);
     if ($cmp44) {
      $fd53$pre$phiZ2D = $fd43;
     } else {
      _abort();
      // unreachable;
     }
    }
    $bk52 = (($4) + 12|0);
    HEAP32[$bk52>>2] = $5;
    HEAP32[$fd53$pre$phiZ2D>>2] = $4;
    $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
    break;
   }
   $add$ptr5$sum18 = (24 - ($1))|0;
   $parent = (($p) + ($add$ptr5$sum18)|0);
   $9 = HEAP32[$parent>>2]|0;
   $add$ptr5$sum19 = (12 - ($1))|0;
   $bk60 = (($p) + ($add$ptr5$sum19)|0);
   $10 = HEAP32[$bk60>>2]|0;
   $cmp61 = ($10|0)==($add$ptr5|0);
   do {
    if ($cmp61) {
     $add$ptr5$sum20 = (16 - ($1))|0;
     $child$sum = (($add$ptr5$sum20) + 4)|0;
     $arrayidx86 = (($p) + ($child$sum)|0);
     $14 = HEAP32[$arrayidx86>>2]|0;
     $cmp87 = ($14|0)==(0|0);
     if ($cmp87) {
      $child = (($p) + ($add$ptr5$sum20)|0);
      $15 = HEAP32[$child>>2]|0;
      $cmp91 = ($15|0)==(0|0);
      if ($cmp91) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $15;$RP$0 = $child;
      }
     } else {
      $R$0 = $14;$RP$0 = $arrayidx86;
     }
     while(1) {
      $arrayidx95 = (($R$0) + 20|0);
      $16 = HEAP32[$arrayidx95>>2]|0;
      $cmp96 = ($16|0)==(0|0);
      if (!($cmp96)) {
       $R$0 = $16;$RP$0 = $arrayidx95;
       continue;
      }
      $arrayidx100 = (($R$0) + 16|0);
      $17 = HEAP32[$arrayidx100>>2]|0;
      $cmp101 = ($17|0)==(0|0);
      if ($cmp101) {
       break;
      } else {
       $R$0 = $17;$RP$0 = $arrayidx100;
      }
     }
     $cmp106 = ($RP$0>>>0)<($2>>>0);
     if ($cmp106) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $add$ptr5$sum23 = (8 - ($1))|0;
     $fd65 = (($p) + ($add$ptr5$sum23)|0);
     $11 = HEAP32[$fd65>>2]|0;
     $cmp68 = ($11>>>0)<($2>>>0);
     if ($cmp68) {
      _abort();
      // unreachable;
     }
     $bk70 = (($11) + 12|0);
     $12 = HEAP32[$bk70>>2]|0;
     $cmp71 = ($12|0)==($add$ptr5|0);
     if (!($cmp71)) {
      _abort();
      // unreachable;
     }
     $fd74 = (($10) + 8|0);
     $13 = HEAP32[$fd74>>2]|0;
     $cmp75 = ($13|0)==($add$ptr5|0);
     if ($cmp75) {
      HEAP32[$bk70>>2] = $10;
      HEAP32[$fd74>>2] = $11;
      $R$1 = $10;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $cmp115 = ($9|0)==(0|0);
   if ($cmp115) {
    $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
   } else {
    $add$ptr5$sum21 = (28 - ($1))|0;
    $index = (($p) + ($add$ptr5$sum21)|0);
    $18 = HEAP32[$index>>2]|0;
    $arrayidx118 = ((1424 + ($18<<2)|0) + 304|0);
    $19 = HEAP32[$arrayidx118>>2]|0;
    $cmp119 = ($add$ptr5|0)==($19|0);
    if ($cmp119) {
     HEAP32[$arrayidx118>>2] = $R$1;
     $cond29 = ($R$1|0)==(0|0);
     if ($cond29) {
      $shl126 = 1 << $18;
      $neg127 = $shl126 ^ -1;
      $20 = HEAP32[((1424 + 4|0))>>2]|0;
      $and128 = $20 & $neg127;
      HEAP32[((1424 + 4|0))>>2] = $and128;
      $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
      break;
     }
    } else {
     $21 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp132 = ($9>>>0)<($21>>>0);
     if ($cmp132) {
      _abort();
      // unreachable;
     }
     $arrayidx138 = (($9) + 16|0);
     $22 = HEAP32[$arrayidx138>>2]|0;
     $cmp139 = ($22|0)==($add$ptr5|0);
     if ($cmp139) {
      HEAP32[$arrayidx138>>2] = $R$1;
     } else {
      $arrayidx146 = (($9) + 20|0);
      HEAP32[$arrayidx146>>2] = $R$1;
     }
     $cmp151 = ($R$1|0)==(0|0);
     if ($cmp151) {
      $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
      break;
     }
    }
    $23 = HEAP32[((1424 + 16|0))>>2]|0;
    $cmp155 = ($R$1>>>0)<($23>>>0);
    if ($cmp155) {
     _abort();
     // unreachable;
    }
    $parent160 = (($R$1) + 24|0);
    HEAP32[$parent160>>2] = $9;
    $add$ptr5$sum22 = (16 - ($1))|0;
    $child161 = (($p) + ($add$ptr5$sum22)|0);
    $24 = HEAP32[$child161>>2]|0;
    $cmp163 = ($24|0)==(0|0);
    do {
     if (!($cmp163)) {
      $25 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp167 = ($24>>>0)<($25>>>0);
      if ($cmp167) {
       _abort();
       // unreachable;
      } else {
       $arrayidx173 = (($R$1) + 16|0);
       HEAP32[$arrayidx173>>2] = $24;
       $parent174 = (($24) + 24|0);
       HEAP32[$parent174>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $child161$sum = (($add$ptr5$sum22) + 4)|0;
    $arrayidx179 = (($p) + ($child161$sum)|0);
    $26 = HEAP32[$arrayidx179>>2]|0;
    $cmp180 = ($26|0)==(0|0);
    if ($cmp180) {
     $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
    } else {
     $27 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp184 = ($26>>>0)<($27>>>0);
     if ($cmp184) {
      _abort();
      // unreachable;
     } else {
      $arrayidx190 = (($R$1) + 20|0);
      HEAP32[$arrayidx190>>2] = $26;
      $parent191 = (($26) + 24|0);
      HEAP32[$parent191>>2] = $R$1;
      $p$addr$0 = $add$ptr5;$psize$addr$0 = $add6;
      break;
     }
    }
   }
  } else {
   $p$addr$0 = $p;$psize$addr$0 = $psize;
  }
 } while(0);
 $30 = HEAP32[((1424 + 16|0))>>2]|0;
 $cmp217 = ($add$ptr>>>0)<($30>>>0);
 if ($cmp217) {
  _abort();
  // unreachable;
 }
 $add$ptr$sum1 = (($psize) + 4)|0;
 $head222 = (($p) + ($add$ptr$sum1)|0);
 $31 = HEAP32[$head222>>2]|0;
 $and223 = $31 & 2;
 $tobool224 = ($and223|0)==(0);
 if ($tobool224) {
  $32 = HEAP32[((1424 + 24|0))>>2]|0;
  $cmp226 = ($add$ptr|0)==($32|0);
  if ($cmp226) {
   $33 = HEAP32[((1424 + 12|0))>>2]|0;
   $add229 = (($33) + ($psize$addr$0))|0;
   HEAP32[((1424 + 12|0))>>2] = $add229;
   HEAP32[((1424 + 24|0))>>2] = $p$addr$0;
   $or231 = $add229 | 1;
   $head232 = (($p$addr$0) + 4|0);
   HEAP32[$head232>>2] = $or231;
   $34 = HEAP32[((1424 + 20|0))>>2]|0;
   $cmp234 = ($p$addr$0|0)==($34|0);
   if (!($cmp234)) {
    STACKTOP = sp;return;
   }
   HEAP32[((1424 + 20|0))>>2] = 0;
   HEAP32[((1424 + 8|0))>>2] = 0;
   STACKTOP = sp;return;
  }
  $35 = HEAP32[((1424 + 20|0))>>2]|0;
  $cmp242 = ($add$ptr|0)==($35|0);
  if ($cmp242) {
   $36 = HEAP32[((1424 + 8|0))>>2]|0;
   $add246 = (($36) + ($psize$addr$0))|0;
   HEAP32[((1424 + 8|0))>>2] = $add246;
   HEAP32[((1424 + 20|0))>>2] = $p$addr$0;
   $or248 = $add246 | 1;
   $head249 = (($p$addr$0) + 4|0);
   HEAP32[$head249>>2] = $or248;
   $add$ptr250 = (($p$addr$0) + ($add246)|0);
   HEAP32[$add$ptr250>>2] = $add246;
   STACKTOP = sp;return;
  }
  $and254 = $31 & -8;
  $add255 = (($and254) + ($psize$addr$0))|0;
  $shr256 = $31 >>> 3;
  $cmp257 = ($31>>>0)<(256);
  do {
   if ($cmp257) {
    $add$ptr$sum15 = (($psize) + 8)|0;
    $fd261 = (($p) + ($add$ptr$sum15)|0);
    $37 = HEAP32[$fd261>>2]|0;
    $add$ptr$sum16 = (($psize) + 12)|0;
    $bk263 = (($p) + ($add$ptr$sum16)|0);
    $38 = HEAP32[$bk263>>2]|0;
    $shl266 = $shr256 << 1;
    $arrayidx268 = ((1424 + ($shl266<<2)|0) + 40|0);
    $cmp269 = ($37|0)==($arrayidx268|0);
    if (!($cmp269)) {
     $cmp273 = ($37>>>0)<($30>>>0);
     if ($cmp273) {
      _abort();
      // unreachable;
     }
     $bk276 = (($37) + 12|0);
     $39 = HEAP32[$bk276>>2]|0;
     $cmp277 = ($39|0)==($add$ptr|0);
     if (!($cmp277)) {
      _abort();
      // unreachable;
     }
    }
    $cmp286 = ($38|0)==($37|0);
    if ($cmp286) {
     $shl289 = 1 << $shr256;
     $neg290 = $shl289 ^ -1;
     $40 = HEAP32[1424>>2]|0;
     $and292 = $40 & $neg290;
     HEAP32[1424>>2] = $and292;
     break;
    }
    $cmp297 = ($38|0)==($arrayidx268|0);
    if ($cmp297) {
     $fd315$pre = (($38) + 8|0);
     $fd315$pre$phiZ2D = $fd315$pre;
    } else {
     $cmp301 = ($38>>>0)<($30>>>0);
     if ($cmp301) {
      _abort();
      // unreachable;
     }
     $fd304 = (($38) + 8|0);
     $41 = HEAP32[$fd304>>2]|0;
     $cmp305 = ($41|0)==($add$ptr|0);
     if ($cmp305) {
      $fd315$pre$phiZ2D = $fd304;
     } else {
      _abort();
      // unreachable;
     }
    }
    $bk314 = (($37) + 12|0);
    HEAP32[$bk314>>2] = $38;
    HEAP32[$fd315$pre$phiZ2D>>2] = $37;
   } else {
    $add$ptr$sum2 = (($psize) + 24)|0;
    $parent324 = (($p) + ($add$ptr$sum2)|0);
    $42 = HEAP32[$parent324>>2]|0;
    $add$ptr$sum3 = (($psize) + 12)|0;
    $bk326 = (($p) + ($add$ptr$sum3)|0);
    $43 = HEAP32[$bk326>>2]|0;
    $cmp327 = ($43|0)==($add$ptr|0);
    do {
     if ($cmp327) {
      $child355$sum = (($psize) + 20)|0;
      $arrayidx356 = (($p) + ($child355$sum)|0);
      $47 = HEAP32[$arrayidx356>>2]|0;
      $cmp357 = ($47|0)==(0|0);
      if ($cmp357) {
       $add$ptr$sum4 = (($psize) + 16)|0;
       $child355 = (($p) + ($add$ptr$sum4)|0);
       $48 = HEAP32[$child355>>2]|0;
       $cmp362 = ($48|0)==(0|0);
       if ($cmp362) {
        $R325$1 = 0;
        break;
       } else {
        $R325$0 = $48;$RP354$0 = $child355;
       }
      } else {
       $R325$0 = $47;$RP354$0 = $arrayidx356;
      }
      while(1) {
       $arrayidx368 = (($R325$0) + 20|0);
       $49 = HEAP32[$arrayidx368>>2]|0;
       $cmp369 = ($49|0)==(0|0);
       if (!($cmp369)) {
        $R325$0 = $49;$RP354$0 = $arrayidx368;
        continue;
       }
       $arrayidx373 = (($R325$0) + 16|0);
       $50 = HEAP32[$arrayidx373>>2]|0;
       $cmp374 = ($50|0)==(0|0);
       if ($cmp374) {
        break;
       } else {
        $R325$0 = $50;$RP354$0 = $arrayidx373;
       }
      }
      $cmp381 = ($RP354$0>>>0)<($30>>>0);
      if ($cmp381) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$RP354$0>>2] = 0;
       $R325$1 = $R325$0;
       break;
      }
     } else {
      $add$ptr$sum14 = (($psize) + 8)|0;
      $fd331 = (($p) + ($add$ptr$sum14)|0);
      $44 = HEAP32[$fd331>>2]|0;
      $cmp334 = ($44>>>0)<($30>>>0);
      if ($cmp334) {
       _abort();
       // unreachable;
      }
      $bk337 = (($44) + 12|0);
      $45 = HEAP32[$bk337>>2]|0;
      $cmp338 = ($45|0)==($add$ptr|0);
      if (!($cmp338)) {
       _abort();
       // unreachable;
      }
      $fd341 = (($43) + 8|0);
      $46 = HEAP32[$fd341>>2]|0;
      $cmp342 = ($46|0)==($add$ptr|0);
      if ($cmp342) {
       HEAP32[$bk337>>2] = $43;
       HEAP32[$fd341>>2] = $44;
       $R325$1 = $43;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $cmp390 = ($42|0)==(0|0);
    if (!($cmp390)) {
     $add$ptr$sum12 = (($psize) + 28)|0;
     $index394 = (($p) + ($add$ptr$sum12)|0);
     $51 = HEAP32[$index394>>2]|0;
     $arrayidx396 = ((1424 + ($51<<2)|0) + 304|0);
     $52 = HEAP32[$arrayidx396>>2]|0;
     $cmp397 = ($add$ptr|0)==($52|0);
     if ($cmp397) {
      HEAP32[$arrayidx396>>2] = $R325$1;
      $cond30 = ($R325$1|0)==(0|0);
      if ($cond30) {
       $shl404 = 1 << $51;
       $neg405 = $shl404 ^ -1;
       $53 = HEAP32[((1424 + 4|0))>>2]|0;
       $and407 = $53 & $neg405;
       HEAP32[((1424 + 4|0))>>2] = $and407;
       break;
      }
     } else {
      $54 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp411 = ($42>>>0)<($54>>>0);
      if ($cmp411) {
       _abort();
       // unreachable;
      }
      $arrayidx417 = (($42) + 16|0);
      $55 = HEAP32[$arrayidx417>>2]|0;
      $cmp418 = ($55|0)==($add$ptr|0);
      if ($cmp418) {
       HEAP32[$arrayidx417>>2] = $R325$1;
      } else {
       $arrayidx425 = (($42) + 20|0);
       HEAP32[$arrayidx425>>2] = $R325$1;
      }
      $cmp430 = ($R325$1|0)==(0|0);
      if ($cmp430) {
       break;
      }
     }
     $56 = HEAP32[((1424 + 16|0))>>2]|0;
     $cmp434 = ($R325$1>>>0)<($56>>>0);
     if ($cmp434) {
      _abort();
      // unreachable;
     }
     $parent441 = (($R325$1) + 24|0);
     HEAP32[$parent441>>2] = $42;
     $add$ptr$sum13 = (($psize) + 16)|0;
     $child442 = (($p) + ($add$ptr$sum13)|0);
     $57 = HEAP32[$child442>>2]|0;
     $cmp444 = ($57|0)==(0|0);
     do {
      if (!($cmp444)) {
       $58 = HEAP32[((1424 + 16|0))>>2]|0;
       $cmp448 = ($57>>>0)<($58>>>0);
       if ($cmp448) {
        _abort();
        // unreachable;
       } else {
        $arrayidx454 = (($R325$1) + 16|0);
        HEAP32[$arrayidx454>>2] = $57;
        $parent455 = (($57) + 24|0);
        HEAP32[$parent455>>2] = $R325$1;
        break;
       }
      }
     } while(0);
     $child442$sum = (($psize) + 20)|0;
     $arrayidx460 = (($p) + ($child442$sum)|0);
     $59 = HEAP32[$arrayidx460>>2]|0;
     $cmp461 = ($59|0)==(0|0);
     if (!($cmp461)) {
      $60 = HEAP32[((1424 + 16|0))>>2]|0;
      $cmp465 = ($59>>>0)<($60>>>0);
      if ($cmp465) {
       _abort();
       // unreachable;
      } else {
       $arrayidx471 = (($R325$1) + 20|0);
       HEAP32[$arrayidx471>>2] = $59;
       $parent472 = (($59) + 24|0);
       HEAP32[$parent472>>2] = $R325$1;
       break;
      }
     }
    }
   }
  } while(0);
  $or481 = $add255 | 1;
  $head482 = (($p$addr$0) + 4|0);
  HEAP32[$head482>>2] = $or481;
  $add$ptr483 = (($p$addr$0) + ($add255)|0);
  HEAP32[$add$ptr483>>2] = $add255;
  $61 = HEAP32[((1424 + 20|0))>>2]|0;
  $cmp486 = ($p$addr$0|0)==($61|0);
  if ($cmp486) {
   HEAP32[((1424 + 8|0))>>2] = $add255;
   STACKTOP = sp;return;
  } else {
   $psize$addr$1 = $add255;
  }
 } else {
  $and495 = $31 & -2;
  HEAP32[$head222>>2] = $and495;
  $or496 = $psize$addr$0 | 1;
  $head497 = (($p$addr$0) + 4|0);
  HEAP32[$head497>>2] = $or496;
  $add$ptr498 = (($p$addr$0) + ($psize$addr$0)|0);
  HEAP32[$add$ptr498>>2] = $psize$addr$0;
  $psize$addr$1 = $psize$addr$0;
 }
 $shr501 = $psize$addr$1 >>> 3;
 $cmp502 = ($psize$addr$1>>>0)<(256);
 if ($cmp502) {
  $shl508 = $shr501 << 1;
  $arrayidx510 = ((1424 + ($shl508<<2)|0) + 40|0);
  $62 = HEAP32[1424>>2]|0;
  $shl513 = 1 << $shr501;
  $and514 = $62 & $shl513;
  $tobool515 = ($and514|0)==(0);
  if ($tobool515) {
   $or519 = $62 | $shl513;
   HEAP32[1424>>2] = $or519;
   $arrayidx510$sum$pre = (($shl508) + 2)|0;
   $$pre = ((1424 + ($arrayidx510$sum$pre<<2)|0) + 40|0);
   $$pre$phiZ2D = $$pre;$F511$0 = $arrayidx510;
  } else {
   $arrayidx510$sum11 = (($shl508) + 2)|0;
   $63 = ((1424 + ($arrayidx510$sum11<<2)|0) + 40|0);
   $64 = HEAP32[$63>>2]|0;
   $65 = HEAP32[((1424 + 16|0))>>2]|0;
   $cmp523 = ($64>>>0)<($65>>>0);
   if ($cmp523) {
    _abort();
    // unreachable;
   } else {
    $$pre$phiZ2D = $63;$F511$0 = $64;
   }
  }
  HEAP32[$$pre$phiZ2D>>2] = $p$addr$0;
  $bk533 = (($F511$0) + 12|0);
  HEAP32[$bk533>>2] = $p$addr$0;
  $fd534 = (($p$addr$0) + 8|0);
  HEAP32[$fd534>>2] = $F511$0;
  $bk535 = (($p$addr$0) + 12|0);
  HEAP32[$bk535>>2] = $arrayidx510;
  STACKTOP = sp;return;
 }
 $shr540 = $psize$addr$1 >>> 8;
 $cmp541 = ($shr540|0)==(0);
 if ($cmp541) {
  $I539$0 = 0;
 } else {
  $cmp545 = ($psize$addr$1>>>0)>(16777215);
  if ($cmp545) {
   $I539$0 = 31;
  } else {
   $sub = (($shr540) + 1048320)|0;
   $shr549 = $sub >>> 16;
   $and550 = $shr549 & 8;
   $shl551 = $shr540 << $and550;
   $sub552 = (($shl551) + 520192)|0;
   $shr553 = $sub552 >>> 16;
   $and554 = $shr553 & 4;
   $add555 = $and554 | $and550;
   $shl556 = $shl551 << $and554;
   $sub557 = (($shl556) + 245760)|0;
   $shr558 = $sub557 >>> 16;
   $and559 = $shr558 & 2;
   $add560 = $add555 | $and559;
   $sub561 = (14 - ($add560))|0;
   $shl562 = $shl556 << $and559;
   $shr563 = $shl562 >>> 15;
   $add564 = (($sub561) + ($shr563))|0;
   $shl565 = $add564 << 1;
   $add566 = (($add564) + 7)|0;
   $shr567 = $psize$addr$1 >>> $add566;
   $and568 = $shr567 & 1;
   $add569 = $and568 | $shl565;
   $I539$0 = $add569;
  }
 }
 $arrayidx573 = ((1424 + ($I539$0<<2)|0) + 304|0);
 $index574 = (($p$addr$0) + 28|0);
 $I539$0$c = $I539$0;
 HEAP32[$index574>>2] = $I539$0$c;
 $arrayidx576 = (($p$addr$0) + 20|0);
 HEAP32[$arrayidx576>>2] = 0;
 $66 = (($p$addr$0) + 16|0);
 HEAP32[$66>>2] = 0;
 $67 = HEAP32[((1424 + 4|0))>>2]|0;
 $shl580 = 1 << $I539$0;
 $and581 = $67 & $shl580;
 $tobool582 = ($and581|0)==(0);
 if ($tobool582) {
  $or586 = $67 | $shl580;
  HEAP32[((1424 + 4|0))>>2] = $or586;
  HEAP32[$arrayidx573>>2] = $p$addr$0;
  $parent587 = (($p$addr$0) + 24|0);
  HEAP32[$parent587>>2] = $arrayidx573;
  $bk588 = (($p$addr$0) + 12|0);
  HEAP32[$bk588>>2] = $p$addr$0;
  $fd589 = (($p$addr$0) + 8|0);
  HEAP32[$fd589>>2] = $p$addr$0;
  STACKTOP = sp;return;
 }
 $68 = HEAP32[$arrayidx573>>2]|0;
 $cmp592 = ($I539$0|0)==(31);
 if ($cmp592) {
  $cond = 0;
 } else {
  $shr594 = $I539$0 >>> 1;
  $sub597 = (25 - ($shr594))|0;
  $cond = $sub597;
 }
 $head59932 = (($68) + 4|0);
 $69 = HEAP32[$head59932>>2]|0;
 $and60033 = $69 & -8;
 $cmp60134 = ($and60033|0)==($psize$addr$1|0);
 L194: do {
  if ($cmp60134) {
   $T$0$lcssa = $68;
  } else {
   $shl598 = $psize$addr$1 << $cond;
   $K591$036 = $shl598;$T$035 = $68;
   while(1) {
    $shr604 = $K591$036 >>> 31;
    $arrayidx607 = ((($T$035) + ($shr604<<2)|0) + 16|0);
    $70 = HEAP32[$arrayidx607>>2]|0;
    $cmp609 = ($70|0)==(0|0);
    if ($cmp609) {
     break;
    }
    $shl608 = $K591$036 << 1;
    $head599 = (($70) + 4|0);
    $71 = HEAP32[$head599>>2]|0;
    $and600 = $71 & -8;
    $cmp601 = ($and600|0)==($psize$addr$1|0);
    if ($cmp601) {
     $T$0$lcssa = $70;
     break L194;
    } else {
     $K591$036 = $shl608;$T$035 = $70;
    }
   }
   $72 = HEAP32[((1424 + 16|0))>>2]|0;
   $cmp614 = ($arrayidx607>>>0)<($72>>>0);
   if ($cmp614) {
    _abort();
    // unreachable;
   }
   HEAP32[$arrayidx607>>2] = $p$addr$0;
   $parent619 = (($p$addr$0) + 24|0);
   HEAP32[$parent619>>2] = $T$035;
   $bk620 = (($p$addr$0) + 12|0);
   HEAP32[$bk620>>2] = $p$addr$0;
   $fd621 = (($p$addr$0) + 8|0);
   HEAP32[$fd621>>2] = $p$addr$0;
   STACKTOP = sp;return;
  }
 } while(0);
 $fd626 = (($T$0$lcssa) + 8|0);
 $73 = HEAP32[$fd626>>2]|0;
 $74 = HEAP32[((1424 + 16|0))>>2]|0;
 $cmp628 = ($T$0$lcssa>>>0)<($74>>>0);
 if ($cmp628) {
  _abort();
  // unreachable;
 }
 $cmp632 = ($73>>>0)<($74>>>0);
 if ($cmp632) {
  _abort();
  // unreachable;
 }
 $bk639 = (($73) + 12|0);
 HEAP32[$bk639>>2] = $p$addr$0;
 HEAP32[$fd626>>2] = $p$addr$0;
 $fd641 = (($p$addr$0) + 8|0);
 HEAP32[$fd641>>2] = $73;
 $bk642 = (($p$addr$0) + 12|0);
 HEAP32[$bk642>>2] = $T$0$lcssa;
 $parent643 = (($p$addr$0) + 24|0);
 HEAP32[$parent643>>2] = 0;
 STACKTOP = sp;return;
}
function _strcmp($l,$r) {
 $l = $l|0;
 $r = $r|0;
 var $$lcssa = 0, $$lcssa6 = 0, $0 = 0, $1 = 0, $2 = 0, $3 = 0, $cmp = 0, $cmp7 = 0, $conv5 = 0, $conv6 = 0, $incdec$ptr = 0, $incdec$ptr4 = 0, $l$addr$010 = 0, $or$cond = 0, $or$cond9 = 0, $r$addr$011 = 0, $sub = 0, $tobool = 0, $tobool8 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $0 = HEAP8[$l>>0]|0;
 $1 = HEAP8[$r>>0]|0;
 $cmp7 = ($0<<24>>24)!=($1<<24>>24);
 $tobool8 = ($0<<24>>24)==(0);
 $or$cond9 = $cmp7 | $tobool8;
 if ($or$cond9) {
  $$lcssa = $0;$$lcssa6 = $1;
 } else {
  $l$addr$010 = $l;$r$addr$011 = $r;
  while(1) {
   $incdec$ptr = (($l$addr$010) + 1|0);
   $incdec$ptr4 = (($r$addr$011) + 1|0);
   $2 = HEAP8[$incdec$ptr>>0]|0;
   $3 = HEAP8[$incdec$ptr4>>0]|0;
   $cmp = ($2<<24>>24)!=($3<<24>>24);
   $tobool = ($2<<24>>24)==(0);
   $or$cond = $cmp | $tobool;
   if ($or$cond) {
    $$lcssa = $2;$$lcssa6 = $3;
    break;
   } else {
    $l$addr$010 = $incdec$ptr;$r$addr$011 = $incdec$ptr4;
   }
  }
 }
 $conv5 = $$lcssa&255;
 $conv6 = $$lcssa6&255;
 $sub = (($conv5) - ($conv6))|0;
 STACKTOP = sp;return ($sub|0);
}
function runPostSets() {
 
}
function _strlen(ptr) {
    ptr = ptr|0;
    var curr = 0;
    curr = ptr;
    while (((HEAP8[((curr)>>0)])|0)) {
      curr = (curr + 1)|0;
    }
    return (curr - ptr)|0;
}
function _memcpy(dest, src, num) {

    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    if ((num|0) >= 4096) return _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
    ret = dest|0;
    if ((dest&3) == (src&3)) {
      while (dest & 3) {
        if ((num|0) == 0) return ret|0;
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      while ((num|0) >= 4) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
        num = (num-4)|0;
      }
    }
    while ((num|0) > 0) {
      HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
      dest = (dest+1)|0;
      src = (src+1)|0;
      num = (num-1)|0;
    }
    return ret|0;
}
function _memset(ptr, value, num) {
    ptr = ptr|0; value = value|0; num = num|0;
    var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
    stop = (ptr + num)|0;
    if ((num|0) >= 20) {
      // This is unaligned, but quite large, so work hard to get to aligned settings
      value = value & 0xff;
      unaligned = ptr & 3;
      value4 = value | (value << 8) | (value << 16) | (value << 24);
      stop4 = stop & ~3;
      if (unaligned) {
        unaligned = (ptr + 4 - unaligned)|0;
        while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
          HEAP8[((ptr)>>0)]=value;
          ptr = (ptr+1)|0;
        }
      }
      while ((ptr|0) < (stop4|0)) {
        HEAP32[((ptr)>>2)]=value4;
        ptr = (ptr+4)|0;
      }
    }
    while ((ptr|0) < (stop|0)) {
      HEAP8[((ptr)>>0)]=value;
      ptr = (ptr+1)|0;
    }
    return (ptr-num)|0;
}

// EMSCRIPTEN_END_FUNCS

    
    function dynCall_viddd(index,a1,a2,a3,a4) {
      index = index|0;
      a1=a1|0; a2=+a2; a3=+a3; a4=+a4;
      FUNCTION_TABLE_viddd[index&31](a1|0,+a2,+a3,+a4);
    }
  

    function dynCall_iiii(index,a1,a2,a3) {
      index = index|0;
      a1=a1|0; a2=a2|0; a3=a3|0;
      return FUNCTION_TABLE_iiii[index&15](a1|0,a2|0,a3|0)|0;
    }
  

    function dynCall_viiiii(index,a1,a2,a3,a4,a5) {
      index = index|0;
      a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0; a5=a5|0;
      FUNCTION_TABLE_viiiii[index&15](a1|0,a2|0,a3|0,a4|0,a5|0);
    }
  

    function dynCall_vi(index,a1) {
      index = index|0;
      a1=a1|0;
      FUNCTION_TABLE_vi[index&31](a1|0);
    }
  

    function dynCall_vii(index,a1,a2) {
      index = index|0;
      a1=a1|0; a2=a2|0;
      FUNCTION_TABLE_vii[index&31](a1|0,a2|0);
    }
  

    function dynCall_ii(index,a1) {
      index = index|0;
      a1=a1|0;
      return FUNCTION_TABLE_ii[index&31](a1|0)|0;
    }
  

    function dynCall_v(index) {
      index = index|0;
      
      FUNCTION_TABLE_v[index&31]();
    }
  

    function dynCall_viiiiii(index,a1,a2,a3,a4,a5,a6) {
      index = index|0;
      a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0; a5=a5|0; a6=a6|0;
      FUNCTION_TABLE_viiiiii[index&15](a1|0,a2|0,a3|0,a4|0,a5|0,a6|0);
    }
  

    function dynCall_viiii(index,a1,a2,a3,a4) {
      index = index|0;
      a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0;
      FUNCTION_TABLE_viiii[index&31](a1|0,a2|0,a3|0,a4|0);
    }
  
function b0(p0,p1,p2,p3) { p0 = p0|0;p1 = +p1;p2 = +p2;p3 = +p3; nullFunc_viddd(0); }
  function b1(p0,p1,p2) { p0 = p0|0;p1 = p1|0;p2 = p2|0; nullFunc_iiii(1);return 0; }
  function b2(p0,p1,p2,p3,p4) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0; nullFunc_viiiii(2); }
  function b3(p0) { p0 = p0|0; nullFunc_vi(3); }
  function b4(p0,p1) { p0 = p0|0;p1 = p1|0; nullFunc_vii(4); }
  function _glGenBuffers__wrapper(p0,p1) { p0 = p0|0;p1 = p1|0; _glGenBuffers(p0|0,p1|0); }
  function _glBindBuffer__wrapper(p0,p1) { p0 = p0|0;p1 = p1|0; _glBindBuffer(p0|0,p1|0); }
  function b5(p0) { p0 = p0|0; nullFunc_ii(5);return 0; }
  function b6() { ; nullFunc_v(6); }
  function b7(p0,p1,p2,p3,p4,p5) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0;p5 = p5|0; nullFunc_viiiiii(7); }
  function b8(p0,p1,p2,p3) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; nullFunc_viiii(8); }
  function _glBufferData__wrapper(p0,p1,p2,p3) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; _glBufferData(p0|0,p1|0,p2|0,p3|0); }
  // EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_viddd = [b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,__ZN9REMVectorC2Efff,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0
  ,b0,b0,b0];
  var FUNCTION_TABLE_iiii = [b1,b1,b1,b1,b1,b1,b1,b1,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv,b1,b1,b1,b1,b1,b1,b1];
  var FUNCTION_TABLE_viiiii = [b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b2,b2,b2,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b2];
  var FUNCTION_TABLE_vi = [b3,__ZNSt9bad_allocD2Ev,__ZNSt9bad_allocD0Ev,b3,__ZN10__cxxabiv116__shim_type_infoD2Ev,__ZN10__cxxabiv117__class_type_infoD0Ev,__ZNK10__cxxabiv116__shim_type_info5noop1Ev,__ZNK10__cxxabiv116__shim_type_info5noop2Ev,b3,b3,b3,b3,__ZN10__cxxabiv120__si_class_type_infoD0Ev,b3,b3,b3,b3,__ZN15REMRenderDeviceC2Ev,b3,__ZN14REMSkinManagerC2Ev,b3,b3,b3,b3,b3,b3,b3,b3,b3
  ,b3,b3,b3];
  var FUNCTION_TABLE_vii = [b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,__ZN16REMShaderManagerC2EP15REMRenderDevice,b4,b4,_glGenBuffers__wrapper,_glBindBuffer__wrapper,b4,b4,b4,b4
  ,b4,b4,b4];
  var FUNCTION_TABLE_ii = [b5,b5,b5,__ZNKSt9bad_alloc4whatEv,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,__ZN15REMRenderDevice14getSkinManagerEv,b5,b5,b5,b5,b5,b5
  ,b5,b5,b5];
  var FUNCTION_TABLE_v = [b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,__Z9web_framev,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6
  ,b6,b6,b6];
  var FUNCTION_TABLE_viiiiii = [b7,b7,b7,b7,b7,b7,b7,b7,b7,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b7,b7,b7,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b7,b7];
  var FUNCTION_TABLE_viiii = [b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,b8,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b8,b8,b8,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b8,b8,b8,b8,b8,__ZN21REMVertexCacheManagerC2EP15REMRenderDevicejj,b8,b8,b8,_glBufferData__wrapper,b8,b8,b8
  ,b8,b8,b8];

    return { _strlen: _strlen, _free: _free, _main: _main, _realloc: _realloc, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, _calloc: _calloc, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, getTempRet0: getTempRet0, dynCall_viddd: dynCall_viddd, dynCall_iiii: dynCall_iiii, dynCall_viiiii: dynCall_viiiii, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_viiiiii: dynCall_viiiiii, dynCall_viiii: dynCall_viiii };
  })
  // EMSCRIPTEN_END_ASM
  ({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "min": Math_min, "nullFunc_viddd": nullFunc_viddd, "nullFunc_iiii": nullFunc_iiii, "nullFunc_viiiii": nullFunc_viiiii, "nullFunc_vi": nullFunc_vi, "nullFunc_vii": nullFunc_vii, "nullFunc_ii": nullFunc_ii, "nullFunc_v": nullFunc_v, "nullFunc_viiiiii": nullFunc_viiiiii, "nullFunc_viiii": nullFunc_viiii, "invoke_viddd": invoke_viddd, "invoke_iiii": invoke_iiii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_viiiiii": invoke_viiiiii, "invoke_viiii": invoke_viiii, "_glUseProgram": _glUseProgram, "_fread": _fread, "_glUniformMatrix4fv": _glUniformMatrix4fv, "_SDL_RWFromFile": _SDL_RWFromFile, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_glBindBuffer": _glBindBuffer, "_glGetShaderInfoLog": _glGetShaderInfoLog, "_ftell": _ftell, "_sbrk": _sbrk, "_glBlendFunc": _glBlendFunc, "_glGetAttribLocation": _glGetAttribLocation, "_Mix_PlayChannel": _Mix_PlayChannel, "_TTF_RenderText_Solid": _TTF_RenderText_Solid, "_sysconf": _sysconf, "_close": _close, "_Mix_PlayMusic": _Mix_PlayMusic, "_rewind": _rewind, "_cos": _cos, "_fileno": _fileno, "_puts": _puts, "_Mix_LoadWAV_RW": _Mix_LoadWAV_RW, "_glfwInit": _glfwInit, "_write": _write, "_fsync": _fsync, "_glGenBuffers": _glGenBuffers, "_glShaderSource": _glShaderSource, "_Mix_HaltMusic": _Mix_HaltMusic, "_SDL_LoadBMP_RW": _SDL_LoadBMP_RW, "_glGenerateMipmap": _glGenerateMipmap, "_glVertexAttribPointer": _glVertexAttribPointer, "__reallyNegative": __reallyNegative, "_send": _send, "_SDL_GetTicks": _SDL_GetTicks, "_glfwOpenWindow": _glfwOpenWindow, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_glDrawElements": _glDrawElements, "_glDepthMask": _glDepthMask, "_glBufferSubData": _glBufferSubData, "_SDL_LockSurface": _SDL_LockSurface, "_glViewport": _glViewport, "___setErrNo": ___setErrNo, "___resumeException": ___resumeException, "_putchar": _putchar, "_glEnable": _glEnable, "_printf": _printf, "_glGenTextures": _glGenTextures, "_glCreateShader": _glCreateShader, "_emscripten_get_now": _emscripten_get_now, "_SDL_MapRGB": _SDL_MapRGB, "_glCreateProgram": _glCreateProgram, "_read": _read, "_fwrite": _fwrite, "_time": _time, "_fprintf": _fprintf, "_SDL_UpperBlitScaled": _SDL_UpperBlitScaled, "_putenv": _putenv, "_IMG_Load": _IMG_Load, "_lseek": _lseek, "_SDL_SetColorKey": _SDL_SetColorKey, "_glClearColor": _glClearColor, "___cxa_allocate_exception": ___cxa_allocate_exception, "___buildEnvironment": ___buildEnvironment, "_pwrite": _pwrite, "_open": _open, "_fabsf": _fabsf, "_glBindTexture": _glBindTexture, "_glUniform1f": _glUniform1f, "_glUniform1i": _glUniform1i, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_glAttachShader": _glAttachShader, "_fseek": _fseek, "_getenv": _getenv, "_fclose": _fclose, "_sqrtf": _sqrtf, "_glActiveTexture": _glActiveTexture, "_glfwSwapBuffers": _glfwSwapBuffers, "_recv": _recv, "_glCompileShader": _glCompileShader, "_glEnableVertexAttribArray": _glEnableVertexAttribArray, "_abort": _abort, "_glBufferData": _glBufferData, "_glTexImage2D": _glTexImage2D, "_fopen": _fopen, "_sin": _sin, "_cosf": _cosf, "_SDL_CloseAudio": _SDL_CloseAudio, "___gxx_personality_v0": ___gxx_personality_v0, "_fflush": _fflush, "_SDL_FreeRW": _SDL_FreeRW, "_SDL_PauseAudio": _SDL_PauseAudio, "_glGetUniformLocation": _glGetUniformLocation, "_glClear": _glClear, "_glUniform4fv": _glUniform4fv, "_Mix_FreeChunk": _Mix_FreeChunk, "_sinf": _sinf, "_IMG_Load_RW": _IMG_Load_RW, "_vprintf": _vprintf, "_glGetShaderiv": _glGetShaderiv, "_pread": _pread, "_mkport": _mkport, "_glLinkProgram": _glLinkProgram, "_emscripten_set_main_loop": _emscripten_set_main_loop, "___errno_location": ___errno_location, "_fputc": _fputc, "___cxa_throw": ___cxa_throw, "_glDisable": _glDisable, "_glTexParameteri": _glTexParameteri, "__formatString": __formatString, "_fputs": _fputs, "_SDL_UpperBlit": _SDL_UpperBlit, "_SDL_RWFromConstMem": _SDL_RWFromConstMem, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity }, buffer);
  var real__strlen = asm["_strlen"]; asm["_strlen"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__strlen.apply(null, arguments);
};

var real__main = asm["_main"]; asm["_main"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__main.apply(null, arguments);
};

var real__realloc = asm["_realloc"]; asm["_realloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__realloc.apply(null, arguments);
};

var real__calloc = asm["_calloc"]; asm["_calloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__calloc.apply(null, arguments);
};

var real_runPostSets = asm["runPostSets"]; asm["runPostSets"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_runPostSets.apply(null, arguments);
};
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_viddd = Module["dynCall_viddd"] = asm["dynCall_viddd"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
  
  Runtime.stackAlloc = asm['stackAlloc'];
  Runtime.stackSave = asm['stackSave'];
  Runtime.stackRestore = asm['stackRestore'];
  Runtime.setTempRet0 = asm['setTempRet0'];
  Runtime.getTempRet0 = asm['getTempRet0'];
  

// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (typeof Module['locateFile'] === 'function') {
    memoryInitializer = Module['locateFile'](memoryInitializer);
  } else if (Module['memoryInitializerPrefixURL']) {
    memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      for (var i = 0; i < data.length; i++) {
        assert(HEAPU8[STATIC_BASE + i] === 0, "area for memory initializer should not have been touched before it's loaded");
      }
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString(Module['thisProgram']), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    exit(ret);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return; 

    ensureInitRuntime();

    preMain();

    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
    }

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  if (Module['noExitRuntime']) {
    Module.printErr('exit(' + status + ') called, but noExitRuntime, so not exiting');
    return;
  }

  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  if (ENVIRONMENT_IS_NODE) {
    // Work around a node.js bug where stdout buffer is not flushed at process exit:
    // Instead of process.exit() directly, wait for stdout flush event.
    // See https://github.com/joyent/node/issues/1669 and https://github.com/kripken/emscripten/issues/2582
    // Workaround is based on https://github.com/RReverser/acorn/commit/50ab143cecc9ed71a2d66f78b4aec3bb2e9844f6
    process['stdout']['once']('drain', function () {
      process['exit'](status);
    });
    console.log(' '); // Make sure to print something to force the drain event to occur, in case the stdout buffer was empty.
    // Work around another node bug where sometimes 'drain' is never fired - make another effort
    // to emit the exit status, after a significant delay (if node hasn't fired drain by then, give up)
    setTimeout(function() {
      process['exit'](status);
    }, 500);
  } else
  if (ENVIRONMENT_IS_SHELL && typeof quit === 'function') {
    quit(status);
  }
  // if we reach here, we must throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '';

  throw 'abort() at ' + stackTrace() + extra;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}



