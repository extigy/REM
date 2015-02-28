
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
    var REMOTE_PACKAGE_SIZE = 1236768;
    var PACKAGE_UUID = '1779424c-7eee-47dd-adde-ae9dc338802b';
  
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
Module['FS_createPath']('/', 'models', true, true);
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
      new DataRequest(0, 796, 0, 0).open('GET', '/models/box.obj');
    new DataRequest(796, 57697, 0, 0).open('GET', '/models/sphere.obj');
    new DataRequest(57697, 57870, 0, 0).open('GET', '/models/box.mtl');
    new DataRequest(57870, 80480, 0, 0).open('GET', '/textures/awesome.png');
    new DataRequest(80480, 147244, 0, 0).open('GET', '/textures/brick-detail.jpg');
    new DataRequest(147244, 1233378, 0, 0).open('GET', '/textures/brick.jpg');
    new DataRequest(1233378, 1233744, 0, 0).open('GET', '/shader/UL_F0.glsl');
    new DataRequest(1233744, 1234074, 0, 0).open('GET', '/shader/UL_V0.glsl');
    new DataRequest(1234074, 1235799, 0, 0).open('GET', '/shader/UU_F0.glsl');
    new DataRequest(1235799, 1236768, 0, 0).open('GET', '/shader/UU_V0.glsl');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/models/box.obj"].onload();
          DataRequest.prototype.requests["/models/sphere.obj"].onload();
          DataRequest.prototype.requests["/models/box.mtl"].onload();
          DataRequest.prototype.requests["/textures/awesome.png"].onload();
          DataRequest.prototype.requests["/textures/brick-detail.jpg"].onload();
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

  if (process['argv'].length > 1) {
    Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
  } else {
    Module['thisProgram'] = 'unknown-program';
  }

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
  if (length === 0 || !ptr) return '';
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
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be compliant with the asm.js spec');
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
Module['buffer'] = buffer;
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

STATICTOP = STATIC_BASE + 3504;
  /* global initializers */ __ATINIT__.push();
  

/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,109,111,100,101,108,115,47,98,111,120,46,111,98,106,0,0,103,108,102,119,79,112,101,110,87,105,110,100,111,119,40,41,32,102,97,105,108,101,100,0,103,108,102,119,73,110,105,116,40,41,32,102,97,105,108,101,100,0,0,0,0,0,0,0,114,98,0,0,0,0,0,0,91,73,77,65,71,69,93,58,32,67,111,117,108,100,110,39,116,32,108,111,97,100,32,37,115,0,0,0,0,0,0,0,91,73,77,65,71,69,93,58,32,76,111,97,100,101,100,32,37,115,46,32,37,100,120,37,100,32,119,105,116,104,32,37,100,32,98,98,112,46,10,0,119,111,114,108,100,65,109,98,105,101,110,116,0,0,0,0,83,101,116,116,105,110,103,32,97,109,98,105,101,110,116,32,108,105,103,104,116,32,116,111,32,40,37,53,46,51,102,44,37,53,46,51,102,44,37,53,46,51,102,44,37,53,46,51,102,41,46,0,0,0,0,0,83,101,116,116,105,110,103,32,100,105,114,101,99,116,105,111,110,97,108,32,108,105,103,104,116,32,40,37,53,46,51,102,44,37,53,46,51,102,44,37,53,46,51,102,44,37,53,46,51,102,41,44,32,105,110,32,100,105,114,101,99,116,105,111,110,32,40,37,53,46,51,102,44,37,53,46,51,102,44,37,53,46,51,102,41,46,0,0,100,105,114,76,105,103,104,116,68,105,114,0,0,0,0,0,100,105,114,76,105,103,104,116,67,111,108,111,117,114,0,0,91,76,105,103,104,116,77,97,110,97,103,101,114,93,58,32,0,0,0,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,76,95,86,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,76,95,70,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,85,95,86,48,46,103,108,115,108,0,0,0,0,0,46,47,115,104,97,100,101,114,47,85,85,95,70,48,46,103,108,115,108,0,0,0,0,0,109,97,116,68,105,102,102,117,115,101,0,0,0,0,0,0,109,97,116,65,109,98,105,101,110,116,0,0,0,0,0,0,109,97,116,83,112,101,99,117,108,97,114,0,0,0,0,0,109,97,116,69,109,105,115,115,105,118,101,0,0,0,0,0,109,97,116,80,111,119,101,114,0,0,0,0,0,0,0,0,87,86,77,97,116,0,0,0,86,77,97,116,0,0,0,0,84,73,95,87,86,77,97,116,0,0,0,0,0,0,0,0,87,86,80,77,97,116,0,0,0,0,0,0,0,0,0,0,128,2,0,0,104,1,0,0,87,77,97,116,0,0,0,0,114,0,0,0,0,0,0,0,69,114,114,111,114,32,99,111,109,112,105,108,105,110,103,32,115,104,97,100,101,114,58,10,37,115,46,0,0,0,0,0,67,114,101,97,116,101,100,32,86,101,114,116,101,120,32,83,104,97,100,101,114,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,0,0,0,67,114,101,97,116,101,100,32,70,114,97,103,109,101,110,116,32,83,104,97,100,101,114,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,0,67,114,101,97,116,101,100,32,83,104,97,100,101,114,32,112,114,111,103,114,97,109,109,101,58,32,37,100,46,0,0,0,65,99,116,105,118,97,116,101,100,32,83,104,97,100,101,114,32,80,114,111,103,114,97,109,58,32,37,100,46,0,0,0,91,83,104,97,100,101,114,77,97,110,97,103,101,114,93,58,32,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,102,0,0,0,0,0,0,0,77,111,100,101,108,32,100,101,102,105,110,105,116,105,111,110,32,104,97,115,32,37,100,32,102,97,99,101,115,46,0,0,109,111,100,101,108,115,47,37,115,46,109,116,108,0,0,0,32,10,0,0,0,0,0,0,114,0,0,0,0,0,0,0,69,114,114,111,114,32,114,101,97,100,105,110,103,32,109,97,116,101,114,105,97,108,32,102,105,108,101,33,0,0,0,0,79,112,101,110,101,100,32,109,97,116,101,114,105,97,108,32,102,105,108,101,32,37,115,0,77,97,116,101,114,105,97,108,32,115,112,101,99,117,108,97,114,32,99,111,109,112,111,110,101,110,116,58,32,37,102,0,77,97,116,101,114,105,97,108,32,97,109,98,105,101,110,116,32,99,111,108,111,117,114,58,32,40,37,102,44,32,37,102,44,32,37,102,41,0,0,0,77,97,116,101,114,105,97,108,32,100,105,102,102,117,115,101,32,99,111,108,111,117,114,58,32,40,37,102,44,32,37,102,44,32,37,102,41,0,0,0,77,97,116,101,114,105,97,108,32,115,112,101,99,117,108,97,114,32,99,111,108,111,117,114,58,32,40,37,102,44,32,37,102,44,32,37,102,41,0,0,77,97,116,101,114,105,97,108,32,101,109,105,115,115,105,118,101,32,99,111,108,111,117,114,58,32,40,37,102,44,32,37,102,44,32,37,102,41,0,0,77,97,116,101,114,105,97,108,32,97,108,112,104,97,58,32,37,102,0,0,0,0,0,0,116,101,120,116,117,114,101,115,47,37,115,0,0,0,0,0,65,109,98,105,101,110,116,32,116,101,120,116,117,114,101,58,32,37,115,0,0,0,0,0,68,105,102,102,117,115,101,32,116,101,120,116,117,114,101,58,32,37,115,0,0,0,0,0,70,105,110,105,115,104,101,100,32,114,101,97,100,105,110,103,32,37,115,46,0,0,0,0,78,115,0,0,0,0,0,0,100,0,0,0,0,0,0,0,105,108,108,117,109,0,0,0,75,97,0,0,0,0,0,0,75,100,0,0,0,0,0,0,75,115,0,0,0,0,0,0,75,101,0,0,0,0,0,0,109,97,112,95,75,97,0,0,109,97,112,95,75,100,0,0,69,114,114,111,114,32,82,101,97,100,105,110,103,32,70,105,108,101,33,0,0,0,0,0,79,112,101,110,101,100,32,37,115,46,0,0,0,0,0,0,76,111,97,100,101,100,32,37,100,32,118,101,114,116,105,99,101,115,46,0,0,0,0,0,47,0,0,0,0,0,0,0,118,0,0,0,0,0,0,0,118,110,0,0,0,0,0,0,118,116,0,0,0,0,0,0,117,115,101,109,116,108,0,0,91,83,105,109,112,108,101,77,111,100,101,108,93,58,32,0,73,110,105,116,105,97,108,105,115,105,110,103,46,46,46,0,73,110,105,116,105,97,108,105,115,101,100,46,0,0,0,0,67,114,101,97,116,101,100,32,110,101,119,32,115,107,105,110,32,119,105,116,104,32,73,68,58,32,37,100,46,0,0,0,69,82,82,79,82,58,32,97,100,100,84,101,120,116,117,114,101,40,41,32,102,97,105,108,101,100,58,32,65,108,108,32,56,32,116,101,120,116,117,114,101,115,32,102,105,108,108,101,100,46,0,0,0,0,0,0,91,83,107,105,110,77,97,110,97,103,101,114,93,58,32,0,67,114,101,97,116,105,110,103,32,86,101,114,116,101,120,32,66,117,102,102,101,114,115,46,46,46,0,0,0,0,0,0,68,111,110,101,46,0,0,0,91,86,101,114,116,101,120,67,97,99,104,101,77,97,110,97,103,101,114,93,58,32,0,0,97,80,111,115,105,116,105,111,110,0,0,0,0,0,0,0,97,78,111,114,109,97,108,0,97,84,101,120,67,111,111,114,100,0,0,0,0,0,0,0,97,84,101,120,68,101,116,97,105,108,67,111,111,114,100,0,97,84,97,110,103,101,110,116,0,0,0,0,0,0,0,0,97,67,111,108,111,117,114,0,109,97,116,68,105,102,102,117,115,101,0,0,0,0,0,0,109,97,116,65,109,98,105,101,110,116,0,0,0,0,0,0,109,97,116,83,112,101,99,117,108,97,114,0,0,0,0,0,109,97,116,69,109,105,115,115,105,118,101,0,0,0,0,0,109,97,116,80,111,119,101,114,0,0,0,0,0,0,0,0,110,84,101,120,116,117,114,101,115,0,0,0,0,0,0,0,117,83,97,109,112,108,101,114,37,100,0,0,0,0,0,0,117,83,97,109,112,108,101,114,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,7,0,0,1,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,128,8,0,0,136,7,0,0,192,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,116,57,101,120,99,101,112,116,105,111,110,0,0,0,0,88,8,0,0,176,7,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,88,8,0,0,200,7,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,128,8,0,0,224,7,0,0,216,7,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,128,8,0,0,24,8,0,0,8,8,0,0,0,0,0,0,0,0,0,0,64,8,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,0,0,0,0,200,8,0,0,4,0,0,0,12,0,0,0,6,0,0,0,7,0,0,0,8,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,128,8,0,0,160,8,0,0,64,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,105,110,102,105,110,105,116,121,0,0,0,0,0,0,0,0,110,97,110,0,0,0,0,0,95,112,137,0,255,9,47,15,10,0,0,0,100,0,0,0,232,3,0,0,16,39,0,0,160,134,1,0,64,66,15,0,128,150,152,0,0,225,245,5,17,0,10,0,17,17,17,0,0,0,0,5,0,0,0,0,0,0,9,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,15,10,17,17,17,3,10,7,0,1,19,9,11,11,0,0,9,6,11,0,0,11,0,6,17,0,0,0,17,17,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,10,10,17,17,17,0,10,0,0,2,0,9,11,0,0,0,9,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,4,13,0,0,0,0,9,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,15,0,0,0,0,9,16,0,0,0,0,0,16,0,0,16,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,10,0,0,0,0,9,11,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,45,43,32,32,32,48,88,48,120,0,0,0,0,0,0,0,40,110,117,108,108,41,0,0,45,48,88,43,48,88,32,48,88,45,48,120,43,48,120,32,48,120,0,0,0,0,0,0,105,110,102,0,0,0,0,0,73,78,70,0,0,0,0,0,110,97,110,0,0,0,0,0,78,65,78,0,0,0,0,0,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);




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


   
  Module["_i64Subtract"] = _i64Subtract;

  
  var GL={counter:1,lastError:0,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},packAlignment:4,unpackAlignment:4,init:function () {
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
      },validateBufferTarget:function (target) {
        switch (target) {
          case 0x8892: // GL_ARRAY_BUFFER
          case 0x8893: // GL_ELEMENT_ARRAY_BUFFER
          case 0x8F36: // GL_COPY_READ_BUFFER
          case 0x8F37: // GL_COPY_WRITE_BUFFER
          case 0x88EB: // GL_PIXEL_PACK_BUFFER
          case 0x88EC: // GL_PIXEL_UNPACK_BUFFER
          case 0x8C2A: // GL_TEXTURE_BUFFER
          case 0x8C8E: // GL_TRANSFORM_FEEDBACK_BUFFER
          case 0x8A11: // GL_UNIFORM_BUFFER
            return true;
          default:
            return false;
        }
      },createContext:function (canvas, webGLContextAttributes) {
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
            } else if (webGLContextAttributes.majorVersion == 2 && webGLContextAttributes.minorVersion == 0) {
              ctx = canvas.getContext("webgl2", webGLContextAttributes) || canvas.getContext("experimental-webgl2", webGLContextAttributes);
            } else {
              throw 'Unsupported WebGL context version ' + majorVersion + '.' + minorVersion + '!'
            }
          } finally {
            canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e, JSON.stringify(webGLContextAttributes)]);
          return 0;
        }
        // possible GL_DEBUG entry point: ctx = wrapDebugGL(ctx);
  
        if (!ctx) return 0;
        var handle = GL.getNewId(GL.contexts);
        var context = {
          handle: handle,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        };
        // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
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
        if (typeof JSEvents === 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
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
  
        if (context.version === 2) {
          // drawBuffers is available in WebGL2 by default.
          context.drawBuffersExt = function(n, bufs) {
            GLctx.drawBuffers(n, bufs);
          };
        } else {
          var ext = GLctx.getExtension('WEBGL_draw_buffers');
          if (ext) {
            context.drawBuffersExt = function(n, bufs) {
              ext.drawBuffersWEBGL(n, bufs);
            };
          }
        }
  
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

   
  Module["_i64Add"] = _i64Add;

  
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

  function _glDepthMask(x0) { GLctx.depthMask(x0) }

  
  
  
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
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
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
          if (length === 0) return 0; // node errors on 0 length reads
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
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
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

  var _emscripten_resume=true;

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

  
  function _copysign(a, b) {
      return __reallyNegative(a) === __reallyNegative(b) ? a : -a;
    }function _copysignl() {
  return _copysign.apply(null, arguments)
  }

  function _glClear(x0) { GLctx.clear(x0) }

  function _glGenBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = GL.getNewId(GL.buffers);
        var buffer = GLctx.createBuffer();
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[(((buffers)+(i*4))>>2)]=id;
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
        } else if ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self['performance'] && self['performance']['now']) {
          _emscripten_get_now.actual = function _emscripten_get_now_actual() { return self['performance']['now'](); };
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
  
        Runtime.dynCall('vi', GLFW.active.scrollFunc, [GLFW.wheelPos]);
  
  
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
        win.cursorPosFunc = cbfun;
      },setScrollCallback:function (winid, cbfun) {
        var win = GLFW.WindowFromId(winid);
        if (!win) return;
        win.scrollFunc = cbfun;
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
          } else {
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

  var _BDtoIHigh=true;

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
  
      GLFW.initialTime = GLFW.getTime();
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

  function _glBlendFunc(x0, x1) { GLctx.blendFunc(x0, x1) }

  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  
  
  
  
  function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          setTimeout(Browser.mainLoop.runner, value); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1 /*EM_TIMING_RAF*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      }
      return 0;
    }function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg) {
      Module['noExitRuntime'] = true;
  
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = func;
      Browser.mainLoop.arg = arg;
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  
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
  
        // catch pauses from non-main loop sources
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
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
  
        // catch pauses from the main loop itself
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
      else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
  
      Browser.mainLoop.scheduler();
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function () {
          Browser.mainLoop.scheduler = null;
          Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
        },resume:function () {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
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
    }function _TTF_FontHeight(font) {
      var fontData = SDL.fonts[font];
      return fontData.size;
    }function _TTF_SizeText(font, text, w, h) {
      var fontData = SDL.fonts[font];
      if (w) {
        HEAP32[((w)>>2)]=SDL.estimateTextWidth(fontData, Pointer_stringify(text));
      }
      if (h) {
        HEAP32[((h)>>2)]=fontData.size;
      }
      return 0;
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
  
      if (SDL.defaults.discardOnLock) {
        if (!surfData.image) {
          surfData.image = surfData.ctx.createImageData(surfData.width, surfData.height);
        }
        if (!SDL.defaults.opaqueFrontBuffer) return;
      } else {
        surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      }
  
      // Emulate desktop behavior and kill alpha values on the locked surface. (very costly!) Set SDL.defaults.opaqueFrontBuffer = false
      // if you don't want this.
      if (surf == SDL.screen && SDL.defaults.opaqueFrontBuffer) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock && !SDL.defaults.discardOnLock) {
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
    }var SDL={defaults:{width:320,height:200,copyOnLock:true,discardOnLock:false,opaqueFrontBuffer:true},version:null,surfaces:{},canvasPool:[],events:[],fonts:[null],audios:[null],rwops:[null],music:{audio:null,volume:1},mixerFrequency:22050,mixerFormat:32784,mixerNumChannels:2,mixerChunkSize:1024,channelMinimumNumber:0,GL:false,glAttributes:{0:3,1:3,2:2,3:0,4:0,5:1,6:16,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:1,16:0,17:0,18:0},keyboardState:null,keyboardMap:{},canRequestFullscreen:false,isRequestingFullscreen:false,textInput:false,startTime:null,initFlags:0,buttonState:0,modState:0,DOMButtons:[0,0,0],DOMEventToSDLEvent:{},TOUCH_DEFAULT_ID:0,eventHandler:null,eventHandlerContext:null,keyCodes:{16:1249,17:1248,18:1250,20:1081,33:1099,34:1102,35:1101,36:1098,37:1104,38:1106,39:1103,40:1105,44:316,45:1097,46:127,91:1251,93:1125,96:1122,97:1113,98:1114,99:1115,100:1116,101:1117,102:1118,103:1119,104:1120,105:1121,106:1109,107:1111,109:1110,110:1123,111:1108,112:1082,113:1083,114:1084,115:1085,116:1086,117:1087,118:1088,119:1089,120:1090,121:1091,122:1092,123:1093,124:1128,125:1129,126:1130,127:1131,128:1132,129:1133,130:1134,131:1135,132:1136,133:1137,134:1138,135:1139,144:1107,160:94,161:33,162:34,163:35,164:36,165:37,166:38,167:95,168:40,169:41,170:42,171:43,172:124,173:45,174:123,175:125,176:126,181:127,182:129,183:128,188:44,190:46,191:47,192:96,219:91,220:92,221:93,222:39},scanCodes:{8:42,9:43,13:40,27:41,32:44,35:204,39:53,44:54,46:55,47:56,48:39,49:30,50:31,51:32,52:33,53:34,54:35,55:36,56:37,57:38,58:203,59:51,61:46,91:47,92:49,93:48,96:52,97:4,98:5,99:6,100:7,101:8,102:9,103:10,104:11,105:12,106:13,107:14,108:15,109:16,110:17,111:18,112:19,113:20,114:21,115:22,116:23,117:24,118:25,119:26,120:27,121:28,122:29,127:76,305:224,308:226,316:70},loadRect:function (rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },updateRect:function (rect, r) {
        HEAP32[((rect)>>2)]=r.x;
        HEAP32[(((rect)+(4))>>2)]=r.y;
        HEAP32[(((rect)+(8))>>2)]=r.w;
        HEAP32[(((rect)+(12))>>2)]=r.h;
      },intersectionOfRects:function (first, second) {
        var leftX = Math.max(first.x, second.x);
        var leftY = Math.max(first.y, second.y);
        var rightX = Math.min(first.x + first.w, second.x + second.w);
        var rightY = Math.min(first.y + first.h, second.y + second.h);
  
        return {
          x: leftX,
          y: leftY,
          w: Math.max(leftX, rightX) - leftX,
          h: Math.max(leftY, rightY) - leftY
        }
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
  
        if (!surfData.image.data32) {
          surfData.image.data32 = new Uint32Array(surfData.image.data.buffer);
        }
        var data32   = surfData.image.data32;
  
        var colors32 = surfData.colors32;
  
        for (var y = startY; y < endY; ++y) {
          var base = y * fullWidth;
          for (var x = startX; x < endX; ++x) {
            data32[base + x] = colors32[HEAPU8[((buffer + base + x)>>0)]];
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
          dr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
        }
        if (dstData.clipRect) {
          var widthScale = (!scale || sr.w === 0) ? 1 : sr.w / dr.w;
          var heightScale = (!scale || sr.h === 0) ? 1 : sr.h / dr.h;
          
          dr = SDL.intersectionOfRects(dstData.clipRect, dr);
          
          sr.w = dr.w * widthScale;
          sr.h = dr.h * heightScale;
          
          if (dstrect) {
            SDL.updateRect(dstrect, dr);
          }
        }
        var blitw, blitr;
        if (scale) {
          blitw = dr.w; blith = dr.h;
        } else {
          blitw = sr.w; blith = sr.h;
        }
        if (sr.w === 0 || sr.h === 0 || blitw === 0 || blith === 0) {
          return 0;
        }
        var oldAlpha = dstData.ctx.globalAlpha;
        dstData.ctx.globalAlpha = srcData.alpha/255;
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
      },setPannerPosition:function (info, x, y, z) {
        if (!info) return 0;
        if (info.audio) {
          if (info.audio.webAudioPannerNode)
              info.audio.webAudioPannerNode['setPosition'](x, y, z);
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
          audio.webAudioNode['onended'] = function() { audio['onended'](); } // For <media> element compatibility, route the onended signal to the instance.
  
          audio.webAudioPannerNode = SDL.audioContext['createPanner']();
          audio.webAudioPannerNode['panningModel'] = 'equalpower';
  
          // Add an intermediate gain node to control volume.
          audio.webAudioGainNode = SDL.audioContext['createGain']();
          audio.webAudioGainNode['gain']['value'] = audio.volume;
  
          audio.webAudioNode['connect'](audio.webAudioPannerNode);
          audio.webAudioPannerNode['connect'](audio.webAudioGainNode);
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

  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }

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

  var _BDtoILow=true;

   
  Module["_bitshift64Lshr"] = _bitshift64Lshr;

  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    }

  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      // Work around a bug in Chromium which causes getShaderInfoLog to return null
      if (!log) log = '(unknown error)';
      log = log.substr(0, maxLength - 1);
      if (maxLength > 0 && infoLog) {
        writeStringToMemory(log, infoLog);
        if (length) HEAP32[((length)>>2)]=log.length;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

   
  Module["_bitshift64Shl"] = _bitshift64Shl;

  function _abort() {
      Module['abort']();
    }

  
  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)>>0)];
      }
    }function _fgets(s, n, stream) {
      // char *fgets(char *restrict s, int n, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgets.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) return 0;
      if (streamObj.error || streamObj.eof) return 0;
      var byte_;
      for (var i = 0; i < n - 1 && byte_ != 10; i++) {
        byte_ = _fgetc(stream);
        if (byte_ == -1) {
          if (streamObj.error || (streamObj.eof && i == 0)) return 0;
          else if (streamObj.eof) break;
        }
        HEAP8[(((s)+(i))>>0)]=byte_;
      }
      HEAP8[(((s)+(i))>>0)]=0;
      return s;
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

  var _fabs=Math_abs;

  
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

  
  function _fmod(x, y) {
      return x % y;
    }function _fmodl() {
  return _fmod.apply(null, arguments)
  }

  function _glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function _glViewport(x0, x1, x2, x3) { GLctx.viewport(x0, x1, x2, x3) }


  function _glDrawElements(mode, count, type, indices) {
  
      GLctx.drawElements(mode, count, type, indices);
  
    }

  
  function _strerror_r(errnum, strerrbuf, buflen) {
      if (errnum in ERRNO_MESSAGES) {
        if (ERRNO_MESSAGES[errnum].length > buflen - 1) {
          return ___setErrNo(ERRNO_CODES.ERANGE);
        } else {
          var msg = ERRNO_MESSAGES[errnum];
          writeAsciiToMemory(msg, strerrbuf);
          return 0;
        }
      } else {
        return ___setErrNo(ERRNO_CODES.EINVAL);
      }
    }function _strerror(errnum) {
      if (!_strerror.buffer) _strerror.buffer = _malloc(256);
      _strerror_r(errnum, _strerror.buffer, 256);
      return _strerror.buffer;
    }

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

  function _glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  var _emscripten_postinvoke=true;

  var _BItoD=true;

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
        // Work around a bug in Chromium which causes getShaderInfoLog to return null: https://code.google.com/p/chromium/issues/detail?id=111337
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
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);


function nullFunc_viddd(x) { Module["printErr"]("Invalid function pointer called with signature 'viddd'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_iiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_viiiii(x) { Module["printErr"]("Invalid function pointer called with signature 'viiiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_vi(x) { Module["printErr"]("Invalid function pointer called with signature 'vi'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_vii(x) { Module["printErr"]("Invalid function pointer called with signature 'vii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_ii(x) { Module["printErr"]("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

function nullFunc_viii(x) { Module["printErr"]("Invalid function pointer called with signature 'viii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info."); abort(x) }

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

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
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

Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array };
Module.asmLibraryArg = { "abort": abort, "assert": assert, "min": Math_min, "nullFunc_viddd": nullFunc_viddd, "nullFunc_iiii": nullFunc_iiii, "nullFunc_viiiii": nullFunc_viiiii, "nullFunc_vi": nullFunc_vi, "nullFunc_vii": nullFunc_vii, "nullFunc_ii": nullFunc_ii, "nullFunc_viii": nullFunc_viii, "nullFunc_v": nullFunc_v, "nullFunc_viiiiii": nullFunc_viiiiii, "nullFunc_viiii": nullFunc_viiii, "invoke_viddd": invoke_viddd, "invoke_iiii": invoke_iiii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_viiiiii": invoke_viiiiii, "invoke_viiii": invoke_viiii, "_glUseProgram": _glUseProgram, "_fabs": _fabs, "_fread": _fread, "_glUniformMatrix4fv": _glUniformMatrix4fv, "_fmodl": _fmodl, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_glBindBuffer": _glBindBuffer, "_glGetShaderInfoLog": _glGetShaderInfoLog, "_ftell": _ftell, "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing, "_sbrk": _sbrk, "_glBlendFunc": _glBlendFunc, "_glGetAttribLocation": _glGetAttribLocation, "_Mix_PlayChannel": _Mix_PlayChannel, "_TTF_RenderText_Solid": _TTF_RenderText_Solid, "_sysconf": _sysconf, "_close": _close, "_Mix_PlayMusic": _Mix_PlayMusic, "_rewind": _rewind, "_fileno": _fileno, "_puts": _puts, "_Mix_LoadWAV_RW": _Mix_LoadWAV_RW, "_glfwInit": _glfwInit, "_write": _write, "_fsync": _fsync, "_glGenBuffers": _glGenBuffers, "_glShaderSource": _glShaderSource, "_Mix_HaltMusic": _Mix_HaltMusic, "_TTF_FontHeight": _TTF_FontHeight, "_SDL_LoadBMP_RW": _SDL_LoadBMP_RW, "_glGenerateMipmap": _glGenerateMipmap, "_glVertexAttribPointer": _glVertexAttribPointer, "__reallyNegative": __reallyNegative, "_send": _send, "_SDL_GetTicks": _SDL_GetTicks, "_glfwOpenWindow": _glfwOpenWindow, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_glDrawElements": _glDrawElements, "_glDepthMask": _glDepthMask, "_glBufferSubData": _glBufferSubData, "_SDL_LockSurface": _SDL_LockSurface, "_strerror_r": _strerror_r, "_glViewport": _glViewport, "___setErrNo": ___setErrNo, "___resumeException": ___resumeException, "_putchar": _putchar, "_glEnable": _glEnable, "_printf": _printf, "_glGenTextures": _glGenTextures, "_glCreateShader": _glCreateShader, "_emscripten_get_now": _emscripten_get_now, "_SDL_MapRGB": _SDL_MapRGB, "_glCreateProgram": _glCreateProgram, "_TTF_SizeText": _TTF_SizeText, "_read": _read, "_fwrite": _fwrite, "_time": _time, "_fprintf": _fprintf, "_SDL_UpperBlitScaled": _SDL_UpperBlitScaled, "_putenv": _putenv, "_IMG_Load": _IMG_Load, "_fmod": _fmod, "_lseek": _lseek, "_SDL_SetColorKey": _SDL_SetColorKey, "_glClearColor": _glClearColor, "___cxa_allocate_exception": ___cxa_allocate_exception, "___buildEnvironment": ___buildEnvironment, "_pwrite": _pwrite, "_open": _open, "_fabsf": _fabsf, "_glBindTexture": _glBindTexture, "_glUniform1f": _glUniform1f, "_glUniform1i": _glUniform1i, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_glAttachShader": _glAttachShader, "_fseek": _fseek, "_getenv": _getenv, "_fclose": _fclose, "_sqrtf": _sqrtf, "_glActiveTexture": _glActiveTexture, "_glfwSwapBuffers": _glfwSwapBuffers, "_recv": _recv, "_copysign": _copysign, "_glCompileShader": _glCompileShader, "_glEnableVertexAttribArray": _glEnableVertexAttribArray, "_abort": _abort, "_glBufferData": _glBufferData, "_glTexImage2D": _glTexImage2D, "_fopen": _fopen, "_cosf": _cosf, "_SDL_CloseAudio": _SDL_CloseAudio, "___gxx_personality_v0": ___gxx_personality_v0, "_fflush": _fflush, "_SDL_FreeRW": _SDL_FreeRW, "_SDL_PauseAudio": _SDL_PauseAudio, "_glGetUniformLocation": _glGetUniformLocation, "_strerror": _strerror, "_glClear": _glClear, "_glUniform4fv": _glUniform4fv, "_Mix_FreeChunk": _Mix_FreeChunk, "_sinf": _sinf, "_IMG_Load_RW": _IMG_Load_RW, "_vprintf": _vprintf, "__formatString": __formatString, "_glGetShaderiv": _glGetShaderiv, "_pread": _pread, "_mkport": _mkport, "_glLinkProgram": _glLinkProgram, "_SDL_RWFromFile": _SDL_RWFromFile, "___errno_location": ___errno_location, "_fgetc": _fgetc, "_fputc": _fputc, "___cxa_throw": ___cxa_throw, "_copysignl": _copysignl, "_emscripten_set_main_loop": _emscripten_set_main_loop, "_glDisable": _glDisable, "_glTexParameteri": _glTexParameteri, "_fgets": _fgets, "_fputs": _fputs, "_SDL_UpperBlit": _SDL_UpperBlit, "_SDL_RWFromConstMem": _SDL_RWFromConstMem, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity };
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
  var cttz_i8=env.cttz_i8|0;
  var ctlz_i8=env.ctlz_i8|0;

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
  var nullFunc_viii=env.nullFunc_viii;
  var nullFunc_v=env.nullFunc_v;
  var nullFunc_viiiiii=env.nullFunc_viiiiii;
  var nullFunc_viiii=env.nullFunc_viiii;
  var invoke_viddd=env.invoke_viddd;
  var invoke_iiii=env.invoke_iiii;
  var invoke_viiiii=env.invoke_viiiii;
  var invoke_vi=env.invoke_vi;
  var invoke_vii=env.invoke_vii;
  var invoke_ii=env.invoke_ii;
  var invoke_viii=env.invoke_viii;
  var invoke_v=env.invoke_v;
  var invoke_viiiiii=env.invoke_viiiiii;
  var invoke_viiii=env.invoke_viiii;
  var _glUseProgram=env._glUseProgram;
  var _fabs=env._fabs;
  var _fread=env._fread;
  var _glUniformMatrix4fv=env._glUniformMatrix4fv;
  var _fmodl=env._fmodl;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var _glBindBuffer=env._glBindBuffer;
  var _glGetShaderInfoLog=env._glGetShaderInfoLog;
  var _ftell=env._ftell;
  var _emscripten_set_main_loop_timing=env._emscripten_set_main_loop_timing;
  var _sbrk=env._sbrk;
  var _glBlendFunc=env._glBlendFunc;
  var _glGetAttribLocation=env._glGetAttribLocation;
  var _Mix_PlayChannel=env._Mix_PlayChannel;
  var _TTF_RenderText_Solid=env._TTF_RenderText_Solid;
  var _sysconf=env._sysconf;
  var _close=env._close;
  var _Mix_PlayMusic=env._Mix_PlayMusic;
  var _rewind=env._rewind;
  var _fileno=env._fileno;
  var _puts=env._puts;
  var _Mix_LoadWAV_RW=env._Mix_LoadWAV_RW;
  var _glfwInit=env._glfwInit;
  var _write=env._write;
  var _fsync=env._fsync;
  var _glGenBuffers=env._glGenBuffers;
  var _glShaderSource=env._glShaderSource;
  var _Mix_HaltMusic=env._Mix_HaltMusic;
  var _TTF_FontHeight=env._TTF_FontHeight;
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
  var _strerror_r=env._strerror_r;
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
  var _TTF_SizeText=env._TTF_SizeText;
  var _read=env._read;
  var _fwrite=env._fwrite;
  var _time=env._time;
  var _fprintf=env._fprintf;
  var _SDL_UpperBlitScaled=env._SDL_UpperBlitScaled;
  var _putenv=env._putenv;
  var _IMG_Load=env._IMG_Load;
  var _fmod=env._fmod;
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
  var _copysign=env._copysign;
  var _glCompileShader=env._glCompileShader;
  var _glEnableVertexAttribArray=env._glEnableVertexAttribArray;
  var _abort=env._abort;
  var _glBufferData=env._glBufferData;
  var _glTexImage2D=env._glTexImage2D;
  var _fopen=env._fopen;
  var _cosf=env._cosf;
  var _SDL_CloseAudio=env._SDL_CloseAudio;
  var ___gxx_personality_v0=env.___gxx_personality_v0;
  var _fflush=env._fflush;
  var _SDL_FreeRW=env._SDL_FreeRW;
  var _SDL_PauseAudio=env._SDL_PauseAudio;
  var _glGetUniformLocation=env._glGetUniformLocation;
  var _strerror=env._strerror;
  var _glClear=env._glClear;
  var _glUniform4fv=env._glUniform4fv;
  var _Mix_FreeChunk=env._Mix_FreeChunk;
  var _sinf=env._sinf;
  var _IMG_Load_RW=env._IMG_Load_RW;
  var _vprintf=env._vprintf;
  var __formatString=env.__formatString;
  var _glGetShaderiv=env._glGetShaderiv;
  var _pread=env._pread;
  var _mkport=env._mkport;
  var _glLinkProgram=env._glLinkProgram;
  var _SDL_RWFromFile=env._SDL_RWFromFile;
  var ___errno_location=env.___errno_location;
  var _fgetc=env._fgetc;
  var _fputc=env._fputc;
  var ___cxa_throw=env.___cxa_throw;
  var _copysignl=env._copysignl;
  var _emscripten_set_main_loop=env._emscripten_set_main_loop;
  var _glDisable=env._glDisable;
  var _glTexParameteri=env._glTexParameteri;
  var _fgets=env._fgets;
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
 var $$0 = 0, $$01 = 0, $0 = 0.0, $1 = 0.0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0.0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $exitcond = 0, $exitcond5 = 0, $i$04 = 0, $k$02 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[24>>2];
 $1 = $0 + 0.0030000000260770321;
 HEAPF32[24>>2] = $1;
 _glClear(16640);
 $2 = (__Znwj(16)|0);
 __THREW__ = 0;
 invoke_viddd(17,($2|0),0.0,8.0,-5.0);
 $3 = __THREW__; __THREW__ = 0;
 $4 = $3&1;
 if ($4) {
  $35 = ___cxa_find_matching_catch()|0;
  $36 = tempRet0;
  __ZdlPv($2);
  $$0 = $35;$$01 = $36;
  ___resumeException($$0|0);
  // unreachable;
 }
 $5 = (__Znwj(16)|0);
 __THREW__ = 0;
 invoke_viddd(17,($5|0),0.0,0.0,0.0);
 $6 = __THREW__; __THREW__ = 0;
 $7 = $6&1;
 if ($7) {
  $37 = ___cxa_find_matching_catch()|0;
  $38 = tempRet0;
  __ZdlPv($5);
  $$0 = $37;$$01 = $38;
  ___resumeException($$0|0);
  // unreachable;
 }
 $8 = (__Znwj(16)|0);
 __THREW__ = 0;
 invoke_viddd(17,($8|0),0.0,1.0,0.0);
 $9 = __THREW__; __THREW__ = 0;
 $10 = $9&1;
 if ($10) {
  $39 = ___cxa_find_matching_catch()|0;
  $40 = tempRet0;
  __ZdlPv($8);
  $$0 = $39;$$01 = $40;
  ___resumeException($$0|0);
  // unreachable;
 }
 $11 = HEAP32[8>>2]|0;
 (__ZN15REMRenderDevice13setViewLookAtERK9REMVectorS2_S2_($11,$2,$5,$8)|0);
 $12 = (__Znwj(64)|0);
 __THREW__ = 0;
 invoke_vi(18,($12|0));
 $13 = __THREW__; __THREW__ = 0;
 $14 = $13&1;
 if ($14) {
  $41 = ___cxa_find_matching_catch()|0;
  $42 = tempRet0;
  __ZdlPv($12);
  $$0 = $41;$$01 = $42;
  ___resumeException($$0|0);
  // unreachable;
 } else {
  $i$04 = -5;
 }
 while(1) {
  $15 = $i$04 << 1;
  $16 = (+($15|0));
  $k$02 = -5;
  while(1) {
   __ZN9REMMatrix8identityEv($12);
   $17 = +HEAPF32[24>>2];
   __ZN9REMMatrix5rotaZEf($12,$17);
   $18 = $k$02 << 1;
   $19 = (+($18|0));
   __ZN9REMMatrix9translateEfff($12,$16,0.0,$19);
   $20 = HEAP32[8>>2]|0;
   __ZN15REMRenderDevice17setWorldTransformEPK9REMMatrix($20,$12);
   $21 = HEAP32[8>>2]|0;
   $22 = (__ZN15REMRenderDevice16getVertexManagerEv($21)|0);
   $23 = HEAP32[16>>2]|0;
   $24 = (($23) + 4216|0);
   $25 = HEAP32[$24>>2]|0;
   $26 = (($23) + 4220|0);
   $27 = HEAP32[$26>>2]|0;
   $28 = (($23) + 4228|0);
   $29 = HEAP32[$28>>2]|0;
   $30 = (($23) + 4224|0);
   $31 = HEAP32[$30>>2]|0;
   $32 = (($23) + 4232|0);
   $33 = HEAP32[$32>>2]|0;
   (__ZN21REMVertexCacheManager6renderE14REMVERTEX_TYPEjjjPvPKt($22,0,$25,$27,$29,$31,$33)|0);
   $34 = (($k$02) + 1)|0;
   $exitcond = ($34|0)==(5);
   if ($exitcond) {
    break;
   } else {
    $k$02 = $34;
   }
  }
  $43 = (($i$04) + 1)|0;
  $exitcond5 = ($43|0)==(5);
  if ($exitcond5) {
   break;
  } else {
   $i$04 = $43;
  }
 }
 $44 = HEAP32[8>>2]|0;
 $45 = (__ZN15REMRenderDevice16getVertexManagerEv($44)|0);
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($45)|0);
 $46 = ($12|0)==(0|0);
 if ($46) {
  _glfwSwapBuffers();
  STACKTOP = sp;return;
 }
 __ZdlPv($12);
 _glfwSwapBuffers();
 STACKTOP = sp;return;
}
function _main($argc,$argv) {
 $argc = $argc|0;
 $argv = $argv|0;
 var $$0 = 0, $$01 = 0, $$byval_copy = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $dMat = 0, $dMat$byval_copy = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $dMat$byval_copy = sp + 48|0;
 $$byval_copy = sp + 32|0;
 $dMat = sp + 16|0;
 $0 = sp;
 $1 = (_glfwInit()|0);
 $2 = ($1|0)==(1);
 if (!($2)) {
  (_puts((72|0))|0);
  STACKTOP = sp;return 0;
 }
 $3 = (_glfwOpenWindow(640,360,8,8,8,8,32,0,65537)|0);
 $4 = ($3|0)==(1);
 if (!($4)) {
  (_puts((48|0))|0);
  STACKTOP = sp;return 0;
 }
 _glClearColor(1.0,0.5,0.0,1.0);
 _glEnable(2929);
 _glEnable(3042);
 _glClear(16640);
 $5 = (__Znwj(1148)|0);
 __THREW__ = 0;
 invoke_vi(19,($5|0));
 $6 = __THREW__; __THREW__ = 0;
 $7 = $6&1;
 if ($7) {
  $20 = ___cxa_find_matching_catch()|0;
  $21 = tempRet0;
  __ZdlPv($5);
  $$0 = $20;$$01 = $21;
  ___resumeException($$0|0);
  // unreachable;
 }
 HEAP32[8>>2] = $5;
 (__ZN15REMRenderDevice11oneTimeInitEv($5)|0);
 _glfwSwapBuffers();
 $8 = (__Znwj(4236)|0);
 $9 = HEAP32[8>>2]|0;
 __THREW__ = 0;
 invoke_viii(20,($8|0),($9|0),0);
 $10 = __THREW__; __THREW__ = 0;
 $11 = $10&1;
 if ($11) {
  $22 = ___cxa_find_matching_catch()|0;
  $23 = tempRet0;
  __ZdlPv($8);
  $$0 = $22;$$01 = $23;
  ___resumeException($$0|0);
  // unreachable;
 } else {
  HEAP32[16>>2] = $8;
  __ZN14REMSimpleModel8readFileEPKc($8,32);
  __ZN9REMVectorC2Ev($dMat);
  HEAPF32[$dMat>>2] = 0.57700002193450928;
  $12 = (($dMat) + 4|0);
  HEAPF32[$12>>2] = -0.57700002193450928;
  $13 = (($dMat) + 8|0);
  HEAPF32[$13>>2] = 0.57700002193450928;
  $14 = (($dMat) + 12|0);
  HEAPF32[$14>>2] = 0.0;
  $15 = HEAP32[8>>2]|0;
  $16 = (__ZN15REMRenderDevice15getLightManagerEv($15)|0);
  HEAPF32[$0>>2] = 1.0;
  $17 = (($0) + 4|0);
  HEAPF32[$17>>2] = 1.0;
  $18 = (($0) + 8|0);
  HEAPF32[$18>>2] = 1.0;
  $19 = (($0) + 12|0);
  HEAPF32[$19>>2] = 1.0;
  ;HEAP32[$$byval_copy+0>>2]=HEAP32[$0+0>>2]|0;HEAP32[$$byval_copy+4>>2]=HEAP32[$0+4>>2]|0;HEAP32[$$byval_copy+8>>2]=HEAP32[$0+8>>2]|0;HEAP32[$$byval_copy+12>>2]=HEAP32[$0+12>>2]|0;
  ;HEAP32[$dMat$byval_copy+0>>2]=HEAP32[$dMat+0>>2]|0;HEAP32[$dMat$byval_copy+4>>2]=HEAP32[$dMat+4>>2]|0;HEAP32[$dMat$byval_copy+8>>2]=HEAP32[$dMat+8>>2]|0;HEAP32[$dMat$byval_copy+12>>2]=HEAP32[$dMat+12>>2]|0;
  __ZN15REMLightManager11setDirLightE14REMCOLOUR_TYPE9REMVector($16,$$byval_copy,$dMat$byval_copy);
  _emscripten_set_main_loop((21|0),0,1);
  STACKTOP = sp;return 0;
 }
 return 0|0;
}
function __ZN9REMVectorC2Ev($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = 0.0;
 $0 = (($this) + 4|0);
 HEAPF32[$0>>2] = 0.0;
 $1 = (($this) + 8|0);
 HEAPF32[$1>>2] = 0.0;
 $2 = (($this) + 12|0);
 HEAPF32[$2>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVectorC2Efff($this,$_x,$_y,$_z) {
 $this = $this|0;
 $_x = +$_x;
 $_y = +$_y;
 $_z = +$_z;
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = $_x;
 $0 = (($this) + 4|0);
 HEAPF32[$0>>2] = $_y;
 $1 = (($this) + 8|0);
 HEAPF32[$1>>2] = $_z;
 $2 = (($this) + 12|0);
 HEAPF32[$2>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVector3setEffff($this,$_x,$_y,$_z,$_w) {
 $this = $this|0;
 $_x = +$_x;
 $_y = +$_y;
 $_z = +$_z;
 $_w = +$_w;
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF32[$this>>2] = $_x;
 $0 = (($this) + 4|0);
 HEAPF32[$0>>2] = $_y;
 $1 = (($this) + 8|0);
 HEAPF32[$1>>2] = $_z;
 $2 = (($this) + 12|0);
 HEAPF32[$2>>2] = $_w;
 STACKTOP = sp;return;
}
function __ZN9REMVector9getLengthEv($this) {
 $this = $this|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0.0, $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $6 = 0, $7 = 0.0, $8 = 0.0, $9 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = $0 * $0;
 $2 = (($this) + 4|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $3 * $3;
 $5 = $1 + $4;
 $6 = (($this) + 8|0);
 $7 = +HEAPF32[$6>>2];
 $8 = $7 * $7;
 $9 = $5 + $8;
 $10 = (+Math_sqrt((+$9)));
 STACKTOP = sp;return (+$10);
}
function __ZN9REMVector9normaliseEv($this) {
 $this = $this|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0.0, $11 = 0, $12 = 0.0, $13 = 0.0, $14 = 0.0, $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0.0, $6 = 0, $7 = 0.0, $8 = 0.0, $9 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = $0 * $0;
 $2 = (($this) + 4|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $3 * $3;
 $5 = $1 + $4;
 $6 = (($this) + 8|0);
 $7 = +HEAPF32[$6>>2];
 $8 = $7 * $7;
 $9 = $5 + $8;
 $10 = (+Math_sqrt((+$9)));
 $11 = $10 != 0.0;
 if (!($11)) {
  STACKTOP = sp;return;
 }
 $12 = $0 / $10;
 HEAPF32[$this>>2] = $12;
 $13 = $3 / $10;
 HEAPF32[$2>>2] = $13;
 $14 = $7 / $10;
 HEAPF32[$6>>2] = $14;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormlERKS_($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0.0, $11 = 0, $12 = 0.0, $13 = 0.0, $14 = 0.0, $2 = 0.0, $3 = 0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0.0, $8 = 0.0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = +HEAPF32[$v>>2];
 $2 = $0 * $1;
 $3 = (($this) + 4|0);
 $4 = +HEAPF32[$3>>2];
 $5 = (($v) + 4|0);
 $6 = +HEAPF32[$5>>2];
 $7 = $4 * $6;
 $8 = $2 + $7;
 $9 = (($this) + 8|0);
 $10 = +HEAPF32[$9>>2];
 $11 = (($v) + 8|0);
 $12 = +HEAPF32[$11>>2];
 $13 = $10 * $12;
 $14 = $8 + $13;
 STACKTOP = sp;return (+$14);
}
function __ZN9REMVectordVEf($this,$f) {
 $this = $this|0;
 $f = +$f;
 var $0 = 0.0, $1 = 0.0, $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = $0 / $f;
 HEAPF32[$this>>2] = $1;
 $2 = (($this) + 4|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $3 / $f;
 HEAPF32[$2>>2] = $4;
 $5 = (($this) + 8|0);
 $6 = +HEAPF32[$5>>2];
 $7 = $6 / $f;
 HEAPF32[$5>>2] = $7;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormlEf($agg$result,$this,$f) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $f = +$f;
 var $0 = 0.0, $1 = 0.0, $10 = 0, $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0.0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = $0 * $f;
 $2 = (($this) + 4|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $3 * $f;
 $5 = (($this) + 8|0);
 $6 = +HEAPF32[$5>>2];
 $7 = $6 * $f;
 HEAPF32[$agg$result>>2] = $1;
 $8 = (($agg$result) + 4|0);
 HEAPF32[$8>>2] = $4;
 $9 = (($agg$result) + 8|0);
 HEAPF32[$9>>2] = $7;
 $10 = (($agg$result) + 12|0);
 HEAPF32[$10>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZNK9REMVectormiERKS_($agg$result,$this,$v) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $v = $v|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0, $11 = 0.0, $12 = 0.0, $13 = 0, $14 = 0, $15 = 0, $2 = 0.0, $3 = 0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0.0, $8 = 0, $9 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$this>>2];
 $1 = +HEAPF32[$v>>2];
 $2 = $0 - $1;
 $3 = (($this) + 4|0);
 $4 = +HEAPF32[$3>>2];
 $5 = (($v) + 4|0);
 $6 = +HEAPF32[$5>>2];
 $7 = $4 - $6;
 $8 = (($this) + 8|0);
 $9 = +HEAPF32[$8>>2];
 $10 = (($v) + 8|0);
 $11 = +HEAPF32[$10>>2];
 $12 = $9 - $11;
 HEAPF32[$agg$result>>2] = $2;
 $13 = (($agg$result) + 4|0);
 HEAPF32[$13>>2] = $7;
 $14 = (($agg$result) + 8|0);
 HEAPF32[$14>>2] = $12;
 $15 = (($agg$result) + 12|0);
 HEAPF32[$15>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMVector5crossERKS_S1_($this,$u,$v) {
 $this = $this|0;
 $u = $u|0;
 $v = $v|0;
 var $0 = 0, $1 = 0.0, $10 = 0.0, $11 = 0.0, $12 = 0.0, $13 = 0.0, $14 = 0.0, $15 = 0.0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0.0, $2 = 0, $20 = 0.0, $21 = 0.0, $22 = 0.0, $23 = 0.0, $24 = 0.0, $25 = 0.0, $26 = 0;
 var $27 = 0, $3 = 0.0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0, $8 = 0.0, $9 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($u) + 4|0);
 $1 = +HEAPF32[$0>>2];
 $2 = (($v) + 8|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $1 * $3;
 $5 = (($u) + 8|0);
 $6 = +HEAPF32[$5>>2];
 $7 = (($v) + 4|0);
 $8 = +HEAPF32[$7>>2];
 $9 = $6 * $8;
 $10 = $4 - $9;
 HEAPF32[$this>>2] = $10;
 $11 = +HEAPF32[$5>>2];
 $12 = +HEAPF32[$v>>2];
 $13 = $11 * $12;
 $14 = +HEAPF32[$u>>2];
 $15 = +HEAPF32[$2>>2];
 $16 = $14 * $15;
 $17 = $13 - $16;
 $18 = (($this) + 4|0);
 HEAPF32[$18>>2] = $17;
 $19 = +HEAPF32[$u>>2];
 $20 = +HEAPF32[$7>>2];
 $21 = $19 * $20;
 $22 = +HEAPF32[$0>>2];
 $23 = +HEAPF32[$v>>2];
 $24 = $22 * $23;
 $25 = $21 - $24;
 $26 = (($this) + 8|0);
 HEAPF32[$26>>2] = $25;
 $27 = (($this) + 12|0);
 HEAPF32[$27>>2] = 1.0;
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
 var $0 = 0, $1 = 0, $2 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 dest=$this+0|0; stop=dest+60|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $0 = (($this) + 60|0);
 HEAPF32[$0>>2] = 1.0;
 $1 = (($this) + 40|0);
 HEAPF32[$1>>2] = 1.0;
 $2 = (($this) + 20|0);
 HEAPF32[$2>>2] = 1.0;
 HEAPF32[$this>>2] = 1.0;
 STACKTOP = sp;return;
}
function __ZN9REMMatrix5rotaZEf($this,$a) {
 $this = $this|0;
 $a = +$a;
 var $0 = 0.0, $1 = 0.0, $10 = 0, $11 = 0, $2 = 0, $3 = 0.0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (+Math_cos((+$a)));
 $1 = (+Math_sin((+$a)));
 HEAPF32[$this>>2] = $0;
 $2 = (($this) + 4|0);
 HEAPF32[$2>>2] = $1;
 $3 = -$1;
 $4 = (($this) + 16|0);
 HEAPF32[$4>>2] = $3;
 $5 = (($this) + 20|0);
 HEAPF32[$5>>2] = $0;
 $6 = (($this) + 60|0);
 HEAPF32[$6>>2] = 1.0;
 $7 = (($this) + 40|0);
 HEAPF32[$7>>2] = 1.0;
 $8 = (($this) + 44|0);
 $9 = (($this) + 24|0);
 $10 = (($this) + 12|0);
 HEAPF32[$10>>2] = 0.0;
 $11 = (($this) + 8|0);
 HEAPF32[$11>>2] = 0.0;
 ;HEAP32[$9+0>>2]=0|0;HEAP32[$9+4>>2]=0|0;HEAP32[$9+8>>2]=0|0;HEAP32[$9+12>>2]=0|0;
 ;HEAP32[$8+0>>2]=0|0;HEAP32[$8+4>>2]=0|0;HEAP32[$8+8>>2]=0|0;HEAP32[$8+12>>2]=0|0;
 STACKTOP = sp;return;
}
function __ZN9REMMatrix9translateEfff($this,$dx,$dy,$dz) {
 $this = $this|0;
 $dx = +$dx;
 $dy = +$dy;
 $dz = +$dz;
 var $0 = 0, $1 = 0.0, $2 = 0.0, $3 = 0, $4 = 0.0, $5 = 0.0, $6 = 0, $7 = 0.0, $8 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 48|0);
 $1 = +HEAPF32[$0>>2];
 $2 = $1 + $dx;
 HEAPF32[$0>>2] = $2;
 $3 = (($this) + 52|0);
 $4 = +HEAPF32[$3>>2];
 $5 = $4 + $dy;
 HEAPF32[$3>>2] = $5;
 $6 = (($this) + 56|0);
 $7 = +HEAPF32[$6>>2];
 $8 = $7 + $dz;
 HEAPF32[$6>>2] = $8;
 STACKTOP = sp;return;
}
function __ZN9REMMatrix11transposeOfERKS_($this,$m) {
 $this = $this|0;
 $m = $m|0;
 var $0 = 0.0, $1 = 0, $10 = 0, $11 = 0.0, $12 = 0, $13 = 0, $14 = 0.0, $15 = 0, $16 = 0, $17 = 0.0, $18 = 0, $19 = 0, $2 = 0.0, $20 = 0.0, $21 = 0, $22 = 0, $23 = 0.0, $24 = 0, $25 = 0, $26 = 0.0;
 var $27 = 0, $28 = 0, $29 = 0.0, $3 = 0, $30 = 0, $31 = 0, $32 = 0.0, $33 = 0, $34 = 0, $35 = 0.0, $36 = 0, $37 = 0, $38 = 0.0, $39 = 0, $4 = 0, $40 = 0, $41 = 0.0, $42 = 0, $43 = 0, $44 = 0.0;
 var $45 = 0, $5 = 0.0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$m>>2];
 HEAPF32[$this>>2] = $0;
 $1 = (($m) + 4|0);
 $2 = +HEAPF32[$1>>2];
 $3 = (($this) + 16|0);
 HEAPF32[$3>>2] = $2;
 $4 = (($m) + 8|0);
 $5 = +HEAPF32[$4>>2];
 $6 = (($this) + 32|0);
 HEAPF32[$6>>2] = $5;
 $7 = (($m) + 12|0);
 $8 = +HEAPF32[$7>>2];
 $9 = (($this) + 48|0);
 HEAPF32[$9>>2] = $8;
 $10 = (($m) + 16|0);
 $11 = +HEAPF32[$10>>2];
 $12 = (($this) + 4|0);
 HEAPF32[$12>>2] = $11;
 $13 = (($m) + 20|0);
 $14 = +HEAPF32[$13>>2];
 $15 = (($this) + 20|0);
 HEAPF32[$15>>2] = $14;
 $16 = (($m) + 24|0);
 $17 = +HEAPF32[$16>>2];
 $18 = (($this) + 36|0);
 HEAPF32[$18>>2] = $17;
 $19 = (($m) + 28|0);
 $20 = +HEAPF32[$19>>2];
 $21 = (($this) + 52|0);
 HEAPF32[$21>>2] = $20;
 $22 = (($m) + 32|0);
 $23 = +HEAPF32[$22>>2];
 $24 = (($this) + 8|0);
 HEAPF32[$24>>2] = $23;
 $25 = (($m) + 36|0);
 $26 = +HEAPF32[$25>>2];
 $27 = (($this) + 24|0);
 HEAPF32[$27>>2] = $26;
 $28 = (($m) + 40|0);
 $29 = +HEAPF32[$28>>2];
 $30 = (($this) + 40|0);
 HEAPF32[$30>>2] = $29;
 $31 = (($m) + 44|0);
 $32 = +HEAPF32[$31>>2];
 $33 = (($this) + 56|0);
 HEAPF32[$33>>2] = $32;
 $34 = (($m) + 48|0);
 $35 = +HEAPF32[$34>>2];
 $36 = (($this) + 12|0);
 HEAPF32[$36>>2] = $35;
 $37 = (($m) + 52|0);
 $38 = +HEAPF32[$37>>2];
 $39 = (($this) + 28|0);
 HEAPF32[$39>>2] = $38;
 $40 = (($m) + 56|0);
 $41 = +HEAPF32[$40>>2];
 $42 = (($this) + 44|0);
 HEAPF32[$42>>2] = $41;
 $43 = (($m) + 60|0);
 $44 = +HEAPF32[$43>>2];
 $45 = (($this) + 60|0);
 HEAPF32[$45>>2] = $44;
 STACKTOP = sp;return;
}
function __ZN9REMMatrix9inverseOfERKS_($this,$m) {
 $this = $this|0;
 $m = $m|0;
 var $0 = 0.0, $1 = 0, $10 = 0.0, $100 = 0.0, $101 = 0.0, $102 = 0.0, $103 = 0.0, $104 = 0.0, $105 = 0.0, $106 = 0.0, $107 = 0, $108 = 0.0, $109 = 0.0, $11 = 0, $110 = 0.0, $111 = 0.0, $112 = 0.0, $113 = 0.0, $114 = 0.0, $115 = 0.0;
 var $116 = 0.0, $117 = 0.0, $118 = 0.0, $119 = 0, $12 = 0.0, $120 = 0.0, $121 = 0.0, $122 = 0.0, $123 = 0.0, $124 = 0.0, $125 = 0.0, $126 = 0.0, $127 = 0.0, $128 = 0.0, $129 = 0.0, $13 = 0, $130 = 0.0, $131 = 0, $132 = 0.0, $133 = 0.0;
 var $134 = 0.0, $135 = 0.0, $136 = 0.0, $137 = 0.0, $138 = 0.0, $139 = 0.0, $14 = 0.0, $140 = 0.0, $141 = 0.0, $142 = 0.0, $143 = 0.0, $144 = 0.0, $145 = 0.0, $146 = 0.0, $147 = 0.0, $148 = 0.0, $149 = 0.0, $15 = 0, $150 = 0.0, $151 = 0.0;
 var $152 = 0.0, $153 = 0.0, $154 = 0.0, $155 = 0, $156 = 0.0, $157 = 0.0, $158 = 0.0, $159 = 0.0, $16 = 0.0, $160 = 0.0, $161 = 0.0, $162 = 0.0, $163 = 0.0, $164 = 0.0, $165 = 0.0, $166 = 0.0, $167 = 0, $168 = 0.0, $169 = 0.0, $17 = 0;
 var $170 = 0.0, $171 = 0.0, $172 = 0.0, $173 = 0.0, $174 = 0.0, $175 = 0.0, $176 = 0.0, $177 = 0.0, $178 = 0.0, $179 = 0, $18 = 0.0, $180 = 0.0, $181 = 0.0, $182 = 0.0, $183 = 0.0, $184 = 0.0, $185 = 0.0, $186 = 0.0, $187 = 0.0, $188 = 0.0;
 var $189 = 0.0, $19 = 0, $190 = 0.0, $191 = 0, $192 = 0.0, $193 = 0.0, $194 = 0.0, $195 = 0.0, $196 = 0.0, $197 = 0.0, $198 = 0.0, $199 = 0.0, $2 = 0.0, $20 = 0.0, $200 = 0.0, $201 = 0.0, $202 = 0.0, $203 = 0, $204 = 0.0, $205 = 0.0;
 var $206 = 0.0, $207 = 0.0, $208 = 0.0, $209 = 0.0, $21 = 0, $210 = 0.0, $211 = 0.0, $212 = 0.0, $213 = 0.0, $214 = 0.0, $215 = 0, $216 = 0.0, $217 = 0.0, $218 = 0.0, $219 = 0.0, $22 = 0.0, $220 = 0.0, $221 = 0.0, $222 = 0.0, $223 = 0.0;
 var $224 = 0.0, $225 = 0.0, $226 = 0.0, $227 = 0, $228 = 0.0, $229 = 0.0, $23 = 0, $230 = 0.0, $231 = 0.0, $232 = 0.0, $233 = 0.0, $234 = 0.0, $235 = 0.0, $236 = 0.0, $237 = 0.0, $238 = 0.0, $239 = 0, $24 = 0.0, $240 = 0.0, $241 = 0.0;
 var $242 = 0.0, $243 = 0.0, $244 = 0.0, $245 = 0.0, $246 = 0.0, $247 = 0.0, $248 = 0.0, $249 = 0.0, $25 = 0, $250 = 0.0, $251 = 0.0, $252 = 0.0, $253 = 0.0, $254 = 0.0, $255 = 0.0, $256 = 0.0, $257 = 0.0, $258 = 0.0, $259 = 0.0, $26 = 0.0;
 var $260 = 0.0, $261 = 0.0, $262 = 0.0, $263 = 0.0, $264 = 0.0, $265 = 0.0, $266 = 0.0, $267 = 0.0, $268 = 0.0, $269 = 0.0, $27 = 0, $270 = 0.0, $271 = 0.0, $272 = 0.0, $273 = 0.0, $274 = 0.0, $275 = 0.0, $276 = 0.0, $277 = 0.0, $278 = 0.0;
 var $279 = 0.0, $28 = 0.0, $280 = 0.0, $29 = 0, $3 = 0, $30 = 0.0, $31 = 0.0, $32 = 0.0, $33 = 0.0, $34 = 0.0, $35 = 0.0, $36 = 0.0, $37 = 0.0, $38 = 0.0, $39 = 0.0, $4 = 0.0, $40 = 0.0, $41 = 0.0, $42 = 0.0, $43 = 0.0;
 var $44 = 0.0, $45 = 0.0, $46 = 0.0, $47 = 0.0, $48 = 0.0, $49 = 0.0, $5 = 0, $50 = 0.0, $51 = 0.0, $52 = 0.0, $53 = 0.0, $54 = 0.0, $55 = 0.0, $56 = 0.0, $57 = 0.0, $58 = 0.0, $59 = 0, $6 = 0.0, $60 = 0.0, $61 = 0.0;
 var $62 = 0.0, $63 = 0.0, $64 = 0.0, $65 = 0.0, $66 = 0.0, $67 = 0.0, $68 = 0.0, $69 = 0.0, $7 = 0, $70 = 0.0, $71 = 0, $72 = 0.0, $73 = 0.0, $74 = 0.0, $75 = 0.0, $76 = 0.0, $77 = 0.0, $78 = 0.0, $79 = 0.0, $8 = 0.0;
 var $80 = 0.0, $81 = 0.0, $82 = 0.0, $83 = 0, $84 = 0.0, $85 = 0.0, $86 = 0.0, $87 = 0.0, $88 = 0.0, $89 = 0.0, $9 = 0, $90 = 0.0, $91 = 0.0, $92 = 0.0, $93 = 0.0, $94 = 0.0, $95 = 0, $96 = 0.0, $97 = 0.0, $98 = 0.0;
 var $99 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF32[$m>>2];
 $1 = (($m) + 4|0);
 $2 = +HEAPF32[$1>>2];
 $3 = (($m) + 8|0);
 $4 = +HEAPF32[$3>>2];
 $5 = (($m) + 12|0);
 $6 = +HEAPF32[$5>>2];
 $7 = (($m) + 16|0);
 $8 = +HEAPF32[$7>>2];
 $9 = (($m) + 20|0);
 $10 = +HEAPF32[$9>>2];
 $11 = (($m) + 24|0);
 $12 = +HEAPF32[$11>>2];
 $13 = (($m) + 28|0);
 $14 = +HEAPF32[$13>>2];
 $15 = (($m) + 32|0);
 $16 = +HEAPF32[$15>>2];
 $17 = (($m) + 36|0);
 $18 = +HEAPF32[$17>>2];
 $19 = (($m) + 40|0);
 $20 = +HEAPF32[$19>>2];
 $21 = (($m) + 44|0);
 $22 = +HEAPF32[$21>>2];
 $23 = (($m) + 48|0);
 $24 = +HEAPF32[$23>>2];
 $25 = (($m) + 52|0);
 $26 = +HEAPF32[$25>>2];
 $27 = (($m) + 56|0);
 $28 = +HEAPF32[$27>>2];
 $29 = (($m) + 60|0);
 $30 = +HEAPF32[$29>>2];
 $31 = $20 * $30;
 $32 = $22 * $28;
 $33 = $12 * $30;
 $34 = $14 * $28;
 $35 = $12 * $22;
 $36 = $14 * $20;
 $37 = $4 * $30;
 $38 = $6 * $28;
 $39 = $4 * $22;
 $40 = $6 * $20;
 $41 = $4 * $14;
 $42 = $6 * $12;
 $43 = $10 * $31;
 $44 = $18 * $34;
 $45 = $44 + $43;
 $46 = $35 * $26;
 $47 = $46 + $45;
 $48 = $10 * $32;
 $49 = $18 * $33;
 $50 = $48 + $49;
 $51 = $36 * $26;
 $52 = $51 + $50;
 $53 = $47 - $52;
 HEAPF32[$this>>2] = $53;
 $54 = $2 * $32;
 $55 = $18 * $37;
 $56 = $54 + $55;
 $57 = $40 * $26;
 $58 = $57 + $56;
 $59 = (($this) + 4|0);
 $60 = $2 * $31;
 $61 = $18 * $38;
 $62 = $61 + $60;
 $63 = $39 * $26;
 $64 = $63 + $62;
 $65 = $58 - $64;
 HEAPF32[$59>>2] = $65;
 $66 = $2 * $33;
 $67 = $10 * $38;
 $68 = $67 + $66;
 $69 = $41 * $26;
 $70 = $69 + $68;
 $71 = (($this) + 8|0);
 $72 = $2 * $34;
 $73 = $10 * $37;
 $74 = $72 + $73;
 $75 = $42 * $26;
 $76 = $75 + $74;
 $77 = $70 - $76;
 HEAPF32[$71>>2] = $77;
 $78 = $2 * $36;
 $79 = $10 * $39;
 $80 = $78 + $79;
 $81 = $42 * $18;
 $82 = $81 + $80;
 $83 = (($this) + 12|0);
 $84 = $2 * $35;
 $85 = $10 * $40;
 $86 = $85 + $84;
 $87 = $41 * $18;
 $88 = $87 + $86;
 $89 = $82 - $88;
 HEAPF32[$83>>2] = $89;
 $90 = $8 * $32;
 $91 = $16 * $33;
 $92 = $90 + $91;
 $93 = $36 * $24;
 $94 = $93 + $92;
 $95 = (($this) + 16|0);
 $96 = $8 * $31;
 $97 = $16 * $34;
 $98 = $97 + $96;
 $99 = $35 * $24;
 $100 = $99 + $98;
 $101 = $94 - $100;
 HEAPF32[$95>>2] = $101;
 $102 = $0 * $31;
 $103 = $16 * $38;
 $104 = $103 + $102;
 $105 = $39 * $24;
 $106 = $105 + $104;
 $107 = (($this) + 20|0);
 $108 = $0 * $32;
 $109 = $16 * $37;
 $110 = $108 + $109;
 $111 = $40 * $24;
 $112 = $111 + $110;
 $113 = $106 - $112;
 HEAPF32[$107>>2] = $113;
 $114 = $0 * $34;
 $115 = $8 * $37;
 $116 = $114 + $115;
 $117 = $42 * $24;
 $118 = $117 + $116;
 $119 = (($this) + 24|0);
 $120 = $0 * $33;
 $121 = $8 * $38;
 $122 = $121 + $120;
 $123 = $41 * $24;
 $124 = $123 + $122;
 $125 = $118 - $124;
 HEAPF32[$119>>2] = $125;
 $126 = $0 * $35;
 $127 = $8 * $40;
 $128 = $127 + $126;
 $129 = $41 * $16;
 $130 = $129 + $128;
 $131 = (($this) + 28|0);
 $132 = $0 * $36;
 $133 = $8 * $39;
 $134 = $132 + $133;
 $135 = $42 * $16;
 $136 = $135 + $134;
 $137 = $130 - $136;
 HEAPF32[$131>>2] = $137;
 $138 = $16 * $26;
 $139 = $18 * $24;
 $140 = $8 * $26;
 $141 = $10 * $24;
 $142 = $8 * $18;
 $143 = $10 * $16;
 $144 = $0 * $26;
 $145 = $2 * $24;
 $146 = $0 * $18;
 $147 = $2 * $16;
 $148 = $0 * $10;
 $149 = $2 * $8;
 $150 = $14 * $138;
 $151 = $22 * $141;
 $152 = $151 + $150;
 $153 = $142 * $30;
 $154 = $152 + $153;
 $155 = (($this) + 32|0);
 $156 = $14 * $139;
 $157 = $22 * $140;
 $158 = $156 + $157;
 $159 = $143 * $30;
 $160 = $158 + $159;
 $161 = $154 - $160;
 HEAPF32[$155>>2] = $161;
 $162 = $6 * $139;
 $163 = $22 * $144;
 $164 = $162 + $163;
 $165 = $147 * $30;
 $166 = $164 + $165;
 $167 = (($this) + 36|0);
 $168 = $6 * $138;
 $169 = $22 * $145;
 $170 = $169 + $168;
 $171 = $146 * $30;
 $172 = $170 + $171;
 $173 = $166 - $172;
 HEAPF32[$167>>2] = $173;
 $174 = $6 * $140;
 $175 = $14 * $145;
 $176 = $175 + $174;
 $177 = $148 * $30;
 $178 = $176 + $177;
 $179 = (($this) + 40|0);
 $180 = $6 * $141;
 $181 = $14 * $144;
 $182 = $180 + $181;
 $183 = $149 * $30;
 $184 = $182 + $183;
 $185 = $178 - $184;
 HEAPF32[$179>>2] = $185;
 $186 = $6 * $143;
 $187 = $14 * $146;
 $188 = $186 + $187;
 $189 = $149 * $22;
 $190 = $188 + $189;
 $191 = (($this) + 44|0);
 $192 = $6 * $142;
 $193 = $14 * $147;
 $194 = $193 + $192;
 $195 = $148 * $22;
 $196 = $194 + $195;
 $197 = $190 - $196;
 $198 = $20 * $140;
 $199 = $143 * $28;
 $200 = $198 + $199;
 $201 = $12 * $139;
 $202 = $201 + $200;
 $203 = (($this) + 48|0);
 $204 = $142 * $28;
 $205 = $12 * $138;
 $206 = $204 + $205;
 $207 = $20 * $141;
 $208 = $207 + $206;
 $209 = $202 - $208;
 $210 = $146 * $28;
 $211 = $4 * $138;
 $212 = $210 + $211;
 $213 = $20 * $145;
 $214 = $213 + $212;
 $215 = (($this) + 52|0);
 $216 = $20 * $144;
 $217 = $147 * $28;
 $218 = $216 + $217;
 $219 = $4 * $139;
 $220 = $219 + $218;
 $221 = $214 - $220;
 $222 = $12 * $144;
 $223 = $149 * $28;
 $224 = $222 + $223;
 $225 = $4 * $141;
 $226 = $225 + $224;
 $227 = (($this) + 56|0);
 $228 = $148 * $28;
 $229 = $4 * $140;
 $230 = $228 + $229;
 $231 = $12 * $145;
 $232 = $231 + $230;
 $233 = $226 - $232;
 $234 = $148 * $20;
 $235 = $4 * $142;
 $236 = $234 + $235;
 $237 = $12 * $147;
 $238 = $237 + $236;
 $239 = (($this) + 60|0);
 $240 = $12 * $146;
 $241 = $149 * $20;
 $242 = $240 + $241;
 $243 = $4 * $143;
 $244 = $243 + $242;
 $245 = $238 - $244;
 $246 = +HEAPF32[$this>>2];
 $247 = $0 * $246;
 $248 = +HEAPF32[$59>>2];
 $249 = $8 * $248;
 $250 = $247 + $249;
 $251 = +HEAPF32[$71>>2];
 $252 = $16 * $251;
 $253 = $250 + $252;
 $254 = +HEAPF32[$83>>2];
 $255 = $24 * $254;
 $256 = $253 + $255;
 $257 = 1.0 / $256;
 $258 = $246 * $257;
 HEAPF32[$this>>2] = $258;
 $259 = $257 * $248;
 HEAPF32[$59>>2] = $259;
 $260 = $257 * $251;
 HEAPF32[$71>>2] = $260;
 $261 = $257 * $254;
 HEAPF32[$83>>2] = $261;
 $262 = +HEAPF32[$95>>2];
 $263 = $257 * $262;
 HEAPF32[$95>>2] = $263;
 $264 = +HEAPF32[$107>>2];
 $265 = $257 * $264;
 HEAPF32[$107>>2] = $265;
 $266 = +HEAPF32[$119>>2];
 $267 = $257 * $266;
 HEAPF32[$119>>2] = $267;
 $268 = +HEAPF32[$131>>2];
 $269 = $257 * $268;
 HEAPF32[$131>>2] = $269;
 $270 = +HEAPF32[$155>>2];
 $271 = $257 * $270;
 HEAPF32[$155>>2] = $271;
 $272 = +HEAPF32[$167>>2];
 $273 = $257 * $272;
 HEAPF32[$167>>2] = $273;
 $274 = +HEAPF32[$179>>2];
 $275 = $257 * $274;
 HEAPF32[$179>>2] = $275;
 $276 = $257 * $197;
 HEAPF32[$191>>2] = $276;
 $277 = $257 * $209;
 HEAPF32[$203>>2] = $277;
 $278 = $257 * $221;
 HEAPF32[$215>>2] = $278;
 $279 = $257 * $233;
 HEAPF32[$227>>2] = $279;
 $280 = $257 * $245;
 HEAPF32[$239>>2] = $280;
 STACKTOP = sp;return;
}
function __ZNK9REMMatrixmlERKS_($agg$result,$this,$m) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $m = $m|0;
 var $$phi$trans$insert = 0, $$phi$trans$insert10 = 0, $$phi$trans$insert12 = 0, $$phi$trans$insert14 = 0, $$phi$trans$insert16 = 0, $$phi$trans$insert18 = 0, $$phi$trans$insert20 = 0, $$phi$trans$insert22 = 0, $$phi$trans$insert24 = 0, $$phi$trans$insert26 = 0, $$phi$trans$insert28 = 0, $$phi$trans$insert30 = 0, $$phi$trans$insert4 = 0, $$phi$trans$insert6 = 0, $$phi$trans$insert8 = 0, $$pre = 0.0, $$pre11 = 0.0, $$pre13 = 0.0, $$pre15 = 0.0, $$pre17 = 0.0;
 var $$pre19 = 0.0, $$pre21 = 0.0, $$pre23 = 0.0, $$pre25 = 0.0, $$pre27 = 0.0, $$pre29 = 0.0, $$pre3 = 0.0, $$pre31 = 0.0, $$pre5 = 0.0, $$pre7 = 0.0, $$pre9 = 0.0, $0 = 0, $1 = 0, $10 = 0, $11 = 0.0, $12 = 0.0, $13 = 0, $14 = 0.0, $15 = 0.0, $16 = 0.0;
 var $17 = 0.0, $18 = 0.0, $19 = 0.0, $2 = 0.0, $20 = 0.0, $21 = 0.0, $22 = 0.0, $23 = 0, $24 = 0, $25 = 0.0, $26 = 0.0, $27 = 0.0, $28 = 0.0, $29 = 0.0, $3 = 0, $30 = 0.0, $31 = 0.0, $32 = 0.0, $33 = 0.0, $34 = 0;
 var $35 = 0, $36 = 0.0, $37 = 0.0, $38 = 0.0, $39 = 0.0, $4 = 0, $40 = 0.0, $41 = 0.0, $42 = 0.0, $43 = 0.0, $44 = 0.0, $45 = 0, $46 = 0, $47 = 0.0, $48 = 0.0, $49 = 0.0, $5 = 0.0, $50 = 0.0, $51 = 0.0, $52 = 0.0;
 var $53 = 0.0, $54 = 0.0, $55 = 0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0, $exitcond = 0, $i$02 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 dest=$agg$result+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $$pre = +HEAPF32[$m>>2];
 $$phi$trans$insert = (($m) + 16|0);
 $$pre3 = +HEAPF32[$$phi$trans$insert>>2];
 $$phi$trans$insert4 = (($m) + 32|0);
 $$pre5 = +HEAPF32[$$phi$trans$insert4>>2];
 $$phi$trans$insert6 = (($m) + 48|0);
 $$pre7 = +HEAPF32[$$phi$trans$insert6>>2];
 $$phi$trans$insert8 = (($m) + 4|0);
 $$pre9 = +HEAPF32[$$phi$trans$insert8>>2];
 $$phi$trans$insert10 = (($m) + 20|0);
 $$pre11 = +HEAPF32[$$phi$trans$insert10>>2];
 $$phi$trans$insert12 = (($m) + 36|0);
 $$pre13 = +HEAPF32[$$phi$trans$insert12>>2];
 $$phi$trans$insert14 = (($m) + 52|0);
 $$pre15 = +HEAPF32[$$phi$trans$insert14>>2];
 $$phi$trans$insert16 = (($m) + 8|0);
 $$pre17 = +HEAPF32[$$phi$trans$insert16>>2];
 $$phi$trans$insert18 = (($m) + 24|0);
 $$pre19 = +HEAPF32[$$phi$trans$insert18>>2];
 $$phi$trans$insert20 = (($m) + 40|0);
 $$pre21 = +HEAPF32[$$phi$trans$insert20>>2];
 $$phi$trans$insert22 = (($m) + 56|0);
 $$pre23 = +HEAPF32[$$phi$trans$insert22>>2];
 $$phi$trans$insert24 = (($m) + 12|0);
 $$pre25 = +HEAPF32[$$phi$trans$insert24>>2];
 $$phi$trans$insert26 = (($m) + 28|0);
 $$pre27 = +HEAPF32[$$phi$trans$insert26>>2];
 $$phi$trans$insert28 = (($m) + 44|0);
 $$pre29 = +HEAPF32[$$phi$trans$insert28>>2];
 $$phi$trans$insert30 = (($m) + 60|0);
 $$pre31 = +HEAPF32[$$phi$trans$insert30>>2];
 $i$02 = 0;
 while(1) {
  $0 = $i$02 << 2;
  $1 = (($this) + ($0<<2)|0);
  $2 = +HEAPF32[$1>>2];
  $3 = $0 | 1;
  $4 = (($this) + ($3<<2)|0);
  $5 = +HEAPF32[$4>>2];
  $6 = $0 | 2;
  $7 = (($this) + ($6<<2)|0);
  $8 = +HEAPF32[$7>>2];
  $9 = $0 | 3;
  $10 = (($this) + ($9<<2)|0);
  $11 = +HEAPF32[$10>>2];
  $12 = $2 * $$pre;
  $13 = (($agg$result) + ($0<<2)|0);
  $14 = +HEAPF32[$13>>2];
  $15 = $14 + $12;
  $16 = $5 * $$pre3;
  $17 = $15 + $16;
  $18 = $8 * $$pre5;
  $19 = $17 + $18;
  $20 = $11 * $$pre7;
  $21 = $19 + $20;
  HEAPF32[$13>>2] = $21;
  $22 = $2 * $$pre9;
  $23 = $0 | 1;
  $24 = (($agg$result) + ($23<<2)|0);
  $25 = +HEAPF32[$24>>2];
  $26 = $25 + $22;
  $27 = $5 * $$pre11;
  $28 = $26 + $27;
  $29 = $8 * $$pre13;
  $30 = $28 + $29;
  $31 = $11 * $$pre15;
  $32 = $30 + $31;
  HEAPF32[$24>>2] = $32;
  $33 = $2 * $$pre17;
  $34 = $0 | 2;
  $35 = (($agg$result) + ($34<<2)|0);
  $36 = +HEAPF32[$35>>2];
  $37 = $36 + $33;
  $38 = $5 * $$pre19;
  $39 = $37 + $38;
  $40 = $8 * $$pre21;
  $41 = $39 + $40;
  $42 = $11 * $$pre23;
  $43 = $41 + $42;
  HEAPF32[$35>>2] = $43;
  $44 = $2 * $$pre25;
  $45 = $0 | 3;
  $46 = (($agg$result) + ($45<<2)|0);
  $47 = +HEAPF32[$46>>2];
  $48 = $47 + $44;
  $49 = $5 * $$pre27;
  $50 = $48 + $49;
  $51 = $8 * $$pre29;
  $52 = $50 + $51;
  $53 = $11 * $$pre31;
  $54 = $52 + $53;
  HEAPF32[$46>>2] = $54;
  $55 = (($i$02) + 1)|0;
  $exitcond = ($55|0)==(4);
  if ($exitcond) {
   break;
  } else {
   $i$02 = $55;
  }
 }
 STACKTOP = sp;return;
}
function __Z15rawImageFromBMPPKc($chName) {
 $chName = $chName|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, $cond = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vararg_ptr4 = 0, $vararg_ptr5 = 0, $vararg_ptr6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $0 = (__Znwj(24)|0);
 $1 = (_SDL_RWFromFile(($chName|0),(96|0))|0);
 $2 = (_SDL_LoadBMP_RW(($1|0),1)|0);
 $3 = (($0) + 20|0);
 HEAP32[$3>>2] = $2;
 $4 = ($2|0)==(0|0);
 if ($4) {
  HEAP32[$vararg_buffer>>2] = $chName;
  (_printf((104|0),($vararg_buffer|0))|0);
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $5 = (($2) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 HEAP32[$0>>2] = $6;
 $7 = (($2) + 12|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = (($0) + 4|0);
 HEAP32[$9>>2] = $8;
 $10 = (($2) + 4|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($11) + 8|0);
 $13 = HEAP8[$12>>0]|0;
 $cond = ($13<<24>>24)==(32);
 if ($cond) {
  $14 = (($0) + 8|0);
  HEAP32[$14>>2] = 6408;
  $15 = (($0) + 12|0);
  HEAP32[$15>>2] = 5121;
 }
 $16 = (($2) + 20|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = (($0) + 16|0);
 HEAP32[$18>>2] = $17;
 $19 = $13&255;
 HEAP32[$vararg_buffer1>>2] = $chName;
 $vararg_ptr4 = (($vararg_buffer1) + 4|0);
 HEAP32[$vararg_ptr4>>2] = $6;
 $vararg_ptr5 = (($vararg_buffer1) + 8|0);
 HEAP32[$vararg_ptr5>>2] = $8;
 $vararg_ptr6 = (($vararg_buffer1) + 12|0);
 HEAP32[$vararg_ptr6>>2] = $19;
 (_printf((136|0),($vararg_buffer1|0))|0);
 $$0 = $0;
 STACKTOP = sp;return ($$0|0);
}
function __Z14setAlphaKeyRawP16REMRAWIMAGE_TYPEhhhh($rI,$R,$G,$B,$A) {
 $rI = $rI|0;
 $R = $R|0;
 $G = $G|0;
 $B = $B|0;
 $A = $A|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($rI) + 20|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (($1) + 4|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = (_SDL_MapRGB(($3|0),($R|0),($G|0),($B|0))|0);
 $5 = HEAP32[$0>>2]|0;
 $6 = (_SDL_SetColorKey(($5|0),1,($4|0))|0);
 STACKTOP = sp;return ($6|0);
}
function __Z11setAlphaRawP16REMRAWIMAGE_TYPEh($rI,$A) {
 $rI = $rI|0;
 $A = $A|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = sp;return 0;
}
function __ZN15REMLightManagerC2EP15REMRenderDevice($this,$r) {
 $this = $this|0;
 $r = $r|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 8|0);
 __ZN9REMVectorC2Ev($0);
 HEAP32[$this>>2] = $r;
 $1 = (__ZN15REMRenderDevice16getShaderManagerEv($r)|0);
 $2 = (($this) + 4|0);
 HEAP32[$2>>2] = $1;
 $3 = (($this) + 80|0);
 HEAP32[$3>>2] = -1;
 STACKTOP = sp;return;
}
function __ZN15REMLightManager15setAmbientLightE14REMCOLOUR_TYPE($this,$cMat) {
 $this = $this|0;
 $cMat = $cMat|0;
 var $0 = 0, $1 = 0, $10 = 0.0, $11 = 0.0, $12 = 0, $13 = 0.0, $14 = 0.0, $2 = 0, $3 = 0, $4 = 0.0, $5 = 0.0, $6 = 0, $7 = 0.0, $8 = 0.0, $9 = 0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, $vararg_ptr3 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = (($this) + 4|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (__ZN16REMShaderManager16getActiveProgramEv($1)|0);
 $3 = (_glGetUniformLocation(($2|0),(176|0))|0);
 _glUniform4fv(($3|0),1,($cMat|0));
 $4 = +HEAPF32[$cMat>>2];
 $5 = $4;
 $6 = (($cMat) + 4|0);
 $7 = +HEAPF32[$6>>2];
 $8 = $7;
 $9 = (($cMat) + 8|0);
 $10 = +HEAPF32[$9>>2];
 $11 = $10;
 $12 = (($cMat) + 12|0);
 $13 = +HEAPF32[$12>>2];
 $14 = $13;
 HEAPF64[tempDoublePtr>>3]=$5;HEAP32[$vararg_buffer>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr1 = (($vararg_buffer) + 8|0);
 HEAPF64[tempDoublePtr>>3]=$8;HEAP32[$vararg_ptr1>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr1+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr2 = (($vararg_buffer) + 16|0);
 HEAPF64[tempDoublePtr>>3]=$11;HEAP32[$vararg_ptr2>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr2+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr3 = (($vararg_buffer) + 24|0);
 HEAPF64[tempDoublePtr>>3]=$14;HEAP32[$vararg_ptr3>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr3+4>>2]=HEAP32[tempDoublePtr+4>>2];
 __ZN15REMLightManager3logEPcz(0,192,$vararg_buffer);
 STACKTOP = sp;return;
}
function __ZN15REMLightManager3logEPcz($this,$chString,$varargs) {
 $this = $this|0;
 $chString = $chString|0;
 $varargs = $varargs|0;
 var $args = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $args = sp + 8|0;
 HEAP32[$args>>2] = $varargs;
 (_printf((368|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN15REMLightManager11setDirLightE14REMCOLOUR_TYPE9REMVector($this,$col,$dir) {
 $this = $this|0;
 $col = $col|0;
 $dir = $dir|0;
 var $0 = 0.0, $1 = 0.0, $10 = 0.0, $11 = 0.0, $12 = 0.0, $13 = 0, $14 = 0.0, $15 = 0.0, $16 = 0, $17 = 0.0, $18 = 0.0, $19 = 0.0, $2 = 0, $20 = 0.0, $21 = 0.0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0.0, $30 = 0, $4 = 0.0, $5 = 0, $6 = 0.0, $7 = 0.0, $8 = 0, $9 = 0.0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, $vararg_ptr3 = 0, $vararg_ptr4 = 0, $vararg_ptr5 = 0, $vararg_ptr6 = 0, $wLightDir = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 80|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $wLightDir = sp + 56|0;
 $0 = +HEAPF32[$col>>2];
 $1 = $0;
 $2 = (($col) + 4|0);
 $3 = +HEAPF32[$2>>2];
 $4 = $3;
 $5 = (($col) + 8|0);
 $6 = +HEAPF32[$5>>2];
 $7 = $6;
 $8 = (($col) + 12|0);
 $9 = +HEAPF32[$8>>2];
 $10 = $9;
 $11 = +HEAPF32[$dir>>2];
 $12 = $11;
 $13 = (($dir) + 4|0);
 $14 = +HEAPF32[$13>>2];
 $15 = $14;
 $16 = (($dir) + 8|0);
 $17 = +HEAPF32[$16>>2];
 $18 = $17;
 HEAPF64[tempDoublePtr>>3]=$1;HEAP32[$vararg_buffer>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr1 = (($vararg_buffer) + 8|0);
 HEAPF64[tempDoublePtr>>3]=$4;HEAP32[$vararg_ptr1>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr1+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr2 = (($vararg_buffer) + 16|0);
 HEAPF64[tempDoublePtr>>3]=$7;HEAP32[$vararg_ptr2>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr2+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr3 = (($vararg_buffer) + 24|0);
 HEAPF64[tempDoublePtr>>3]=$10;HEAP32[$vararg_ptr3>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr3+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr4 = (($vararg_buffer) + 32|0);
 HEAPF64[tempDoublePtr>>3]=$12;HEAP32[$vararg_ptr4>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr4+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr5 = (($vararg_buffer) + 40|0);
 HEAPF64[tempDoublePtr>>3]=$15;HEAP32[$vararg_ptr5>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr5+4>>2]=HEAP32[tempDoublePtr+4>>2];
 $vararg_ptr6 = (($vararg_buffer) + 48|0);
 HEAPF64[tempDoublePtr>>3]=$18;HEAP32[$vararg_ptr6>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr6+4>>2]=HEAP32[tempDoublePtr+4>>2];
 __ZN15REMLightManager3logEPcz(0,248,$vararg_buffer);
 $19 = -$11;
 HEAPF32[$dir>>2] = $19;
 $20 = -$14;
 HEAPF32[$13>>2] = $20;
 $21 = -$17;
 HEAPF32[$16>>2] = $21;
 $22 = (($dir) + 12|0);
 HEAPF32[$22>>2] = 0.0;
 $23 = (($this) + 8|0);
 ;HEAP32[$23+0>>2]=HEAP32[$dir+0>>2]|0;HEAP32[$23+4>>2]=HEAP32[$dir+4>>2]|0;HEAP32[$23+8>>2]=HEAP32[$dir+8>>2]|0;HEAP32[$23+12>>2]=HEAP32[$dir+12>>2]|0;
 ;HEAP32[$wLightDir+0>>2]=HEAP32[$dir+0>>2]|0;HEAP32[$wLightDir+4>>2]=HEAP32[$dir+4>>2]|0;HEAP32[$wLightDir+8>>2]=HEAP32[$dir+8>>2]|0;HEAP32[$wLightDir+12>>2]=HEAP32[$dir+12>>2]|0;
 $24 = (($this) + 4|0);
 $25 = HEAP32[$24>>2]|0;
 $26 = (__ZN16REMShaderManager16getActiveProgramEv($25)|0);
 $27 = (_glGetUniformLocation(($26|0),(336|0))|0);
 _glUniform4fv(($27|0),1,($wLightDir|0));
 $28 = HEAP32[$24>>2]|0;
 $29 = (__ZN16REMShaderManager16getActiveProgramEv($28)|0);
 $30 = (_glGetUniformLocation(($29|0),(352|0))|0);
 _glUniform4fv(($30|0),1,($col|0));
 STACKTOP = sp;return;
}
function __ZN15REMRenderDeviceC2Ev($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 108|0);
 __ZN9REMMatrixC2Ev($0);
 $1 = (($this) + 172|0);
 __ZN9REMMatrixC2Ev($1);
 $2 = (($this) + 236|0);
 __ZN9REMMatrixC2Ev($2);
 $3 = (($this) + 300|0);
 __ZN9REMMatrixC2Ev($3);
 $4 = (($this) + 364|0);
 __ZN9REMMatrixC2Ev($4);
 $5 = (($this) + 428|0);
 __ZN9REMMatrixC2Ev($5);
 $6 = (($this) + 492|0);
 __ZN9REMMatrixC2Ev($6);
 $7 = (($this) + 556|0);
 __ZN9REMMatrixC2Ev($7);
 $8 = (($this) + 620|0);
 __ZN9REMMatrixC2Ev($8);
 $9 = (($this) + 684|0);
 __ZN9REMMatrixC2Ev($9);
 $10 = (($this) + 748|0);
 __ZN9REMMatrixC2Ev($10);
 $11 = (($this) + 812|0);
 __ZN9REMMatrixC2Ev($11);
 $12 = (($this) + 876|0);
 __ZN9REMMatrixC2Ev($12);
 $13 = (($this) + 940|0);
 __ZN9REMMatrixC2Ev($13);
 $14 = (($this) + 1004|0);
 __ZN9REMMatrixC2Ev($14);
 $15 = (($this) + 1068|0);
 __ZN9REMMatrixC2Ev($15);
 $16 = (($this) + 40|0);
 HEAP8[$16>>0] = 1;
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice15getActiveSkinIDEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 36|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
}
function __ZN15REMRenderDevice15setActiveSkinIDEj($this,$skinID) {
 $this = $this|0;
 $skinID = $skinID|0;
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 36|0);
 HEAP32[$0>>2] = $skinID;
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
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 4|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
}
function __ZN15REMRenderDevice16getVertexManagerEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
}
function __ZN15REMRenderDevice15getLightManagerEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 12|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
}
function __ZN15REMRenderDevice11oneTimeInitEv($this) {
 $this = $this|0;
 var $$0 = 0, $$01 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $8 = 0, $9 = 0, $cMat = 0, $cMat$byval_copy = 0, $vpView = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $cMat$byval_copy = sp + 32|0;
 $vpView = sp + 16|0;
 $cMat = sp;
 $0 = (__Znwj(24)|0);
 __THREW__ = 0;
 invoke_vi(22,($0|0));
 $1 = __THREW__; __THREW__ = 0;
 $2 = $1&1;
 if ($2) {
  $63 = ___cxa_find_matching_catch()|0;
  $64 = tempRet0;
  __ZdlPv($0);
  $$0 = $64;$$01 = $63;
  ___resumeException($$01|0);
  // unreachable;
 }
 HEAP32[$this>>2] = $0;
 $3 = (__Znwj(786440)|0);
 __THREW__ = 0;
 invoke_vii(23,($3|0),($this|0));
 $4 = __THREW__; __THREW__ = 0;
 $5 = $4&1;
 if ($5) {
  $65 = ___cxa_find_matching_catch()|0;
  $66 = tempRet0;
  __ZdlPv($3);
  $$0 = $66;$$01 = $65;
  ___resumeException($$01|0);
  // unreachable;
 }
 $6 = (($this) + 4|0);
 HEAP32[$6>>2] = $3;
 $7 = (__Znwj(420)|0);
 __THREW__ = 0;
 invoke_viiii(24,($7|0),($this|0),300,450);
 $8 = __THREW__; __THREW__ = 0;
 $9 = $8&1;
 if ($9) {
  $67 = ___cxa_find_matching_catch()|0;
  $68 = tempRet0;
  __ZdlPv($7);
  $$0 = $68;$$01 = $67;
  ___resumeException($$01|0);
  // unreachable;
 }
 $10 = (($this) + 8|0);
 HEAP32[$10>>2] = $7;
 $11 = (__Znwj(84)|0);
 __THREW__ = 0;
 invoke_vii(25,($11|0),($this|0));
 $12 = __THREW__; __THREW__ = 0;
 $13 = $12&1;
 if ($13) {
  $69 = ___cxa_find_matching_catch()|0;
  $70 = tempRet0;
  __ZdlPv($11);
  $$0 = $70;$$01 = $69;
  ___resumeException($$01|0);
  // unreachable;
 }
 $14 = (($this) + 12|0);
 HEAP32[$14>>2] = $11;
 $15 = HEAP32[$10>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($15)|0);
 _glDisable(2884);
 _glEnable(2929);
 _glClear(16640);
 ;HEAP32[$vpView+0>>2]=HEAP32[608+0>>2]|0;HEAP32[$vpView+4>>2]=HEAP32[608+4>>2]|0;HEAP32[$vpView+8>>2]=HEAP32[608+8>>2]|0;HEAP32[$vpView+12>>2]=HEAP32[608+12>>2]|0;
 $16 = (($this) + 28|0);
 HEAP32[$16>>2] = 0;
 $17 = (($this) + 32|0);
 HEAP32[$17>>2] = -1;
 $18 = (($this) + 36|0);
 HEAP32[$18>>2] = 65535;
 $19 = (($this) + 1132|0);
 HEAPF32[$19>>2] = 1.0;
 $20 = (($this) + 1136|0);
 HEAPF32[$20>>2] = 1.0;
 $21 = (($this) + 1140|0);
 HEAPF32[$21>>2] = 1.0;
 $22 = (($this) + 1144|0);
 HEAPF32[$22>>2] = 1.0;
 $23 = HEAP32[$10>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($23)|0);
 $24 = (($this) + 16|0);
 $25 = HEAP32[$24>>2]|0;
 $26 = ($25|0)==(9);
 if (!($26)) {
  HEAP32[$24>>2] = 9;
 }
 $27 = HEAP32[$10>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($27)|0);
 _glEnable(2929);
 _glDepthMask(1);
 _glClear(256);
 $28 = (($this) + 172|0);
 __ZN9REMMatrix8identityEv($28);
 $29 = (($this) + 876|0);
 __ZN9REMMatrix8identityEv($29);
 $30 = (($this) + 1004|0);
 __ZN9REMMatrix8identityEv($30);
 __ZN15REMRenderDevice17setClippingPlanesEff($this,0.10000000149011612,1000.0);
 $31 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createVShaderEPKcbPj($31,392,1,0)|0);
 $32 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createFShaderEPKcbPj($32,416,1,0)|0);
 $33 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createProgramEjjPj($33,0,0,0)|0);
 $34 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager15activateProgramEj($34,0)|0);
 $35 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createVShaderEPKcbPj($35,440,1,0)|0);
 $36 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createFShaderEPKcbPj($36,464,1,0)|0);
 $37 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager13createProgramEjjPj($37,1,1,0)|0);
 $38 = HEAP32[$6>>2]|0;
 (__ZN16REMShaderManager15activateProgramEj($38,1)|0);
 $39 = HEAP32[$10>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($39)|0);
 $40 = (($this) + 812|0);
 __ZN9REMMatrix8identityEv($40);
 $41 = HEAP32[$6>>2]|0;
 $42 = (__ZN16REMShaderManager16getActiveProgramEv($41)|0);
 $43 = (_glGetUniformLocation(($42|0),(624|0))|0);
 _glUniformMatrix4fv(($43|0),1,0,($40|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 HEAPF32[$cMat>>2] = 0.5;
 $44 = (($cMat) + 4|0);
 HEAPF32[$44>>2] = 0.5;
 $45 = (($cMat) + 8|0);
 HEAPF32[$45>>2] = 0.5;
 $46 = (($cMat) + 12|0);
 HEAPF32[$46>>2] = 1.0;
 $47 = HEAP32[$14>>2]|0;
 ;HEAP32[$cMat$byval_copy+0>>2]=HEAP32[$cMat+0>>2]|0;HEAP32[$cMat$byval_copy+4>>2]=HEAP32[$cMat+4>>2]|0;HEAP32[$cMat$byval_copy+8>>2]=HEAP32[$cMat+8>>2]|0;HEAP32[$cMat$byval_copy+12>>2]=HEAP32[$cMat+12>>2]|0;
 __ZN15REMLightManager15setAmbientLightE14REMCOLOUR_TYPE($47,$cMat$byval_copy);
 $48 = HEAP32[$6>>2]|0;
 $49 = (__ZN16REMShaderManager16getActiveProgramEv($48)|0);
 $50 = (_glGetUniformLocation(($49|0),(488|0))|0);
 _glUniform4fv(($50|0),1,($cMat|0));
 $51 = HEAP32[$6>>2]|0;
 $52 = (__ZN16REMShaderManager16getActiveProgramEv($51)|0);
 $53 = (_glGetUniformLocation(($52|0),(504|0))|0);
 _glUniform4fv(($53|0),1,($cMat|0));
 $54 = HEAP32[$6>>2]|0;
 $55 = (__ZN16REMShaderManager16getActiveProgramEv($54)|0);
 $56 = (_glGetUniformLocation(($55|0),(520|0))|0);
 _glUniform4fv(($56|0),1,($cMat|0));
 $57 = HEAP32[$6>>2]|0;
 $58 = (__ZN16REMShaderManager16getActiveProgramEv($57)|0);
 $59 = (_glGetUniformLocation(($58|0),(536|0))|0);
 _glUniform4fv(($59|0),1,($cMat|0));
 $60 = HEAP32[$6>>2]|0;
 $61 = (__ZN16REMShaderManager16getActiveProgramEv($60)|0);
 $62 = (_glGetUniformLocation(($61|0),(552|0))|0);
 _glUniform1f(($62|0),1.0);
 (__ZN15REMRenderDevice9initStageEfP16REMVIEWPORT_TYPEi($this,0.85000002384185791,$vpView,0)|0);
 (__ZN15REMRenderDevice7setModeE18REMENGINEMODE_TYPEi($this,0,0)|0);
 STACKTOP = sp;return 0;
}
function __ZN15REMRenderDevice17setClippingPlanesEff($this,$fNear,$fFar) {
 $this = $this|0;
 $fNear = +$fNear;
 $fFar = +$fFar;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0.0, $12 = 0.0, $13 = 0.0, $14 = 0.0, $15 = 0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0, $2 = 0, $20 = 0.0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0.0, $34 = 0.0, $35 = 0.0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $5 = 0.0;
 var $6 = 0.0, $7 = 0.0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 20|0);
 HEAPF32[$0>>2] = $fNear;
 $1 = (($this) + 24|0);
 HEAPF32[$1>>2] = $fFar;
 $2 = !($fNear <= 0.0);
 if ($2) {
  $5 = $fNear;
 } else {
  HEAPF32[$0>>2] = 0.0099999997764825821;
  $5 = 0.0099999997764825821;
 }
 $3 = !($fFar <= 1.0);
 if ($3) {
  $6 = $fFar;
 } else {
  HEAPF32[$1>>2] = 1.0;
  $6 = 1.0;
 }
 $4 = !($5 >= $6);
 if (!($4)) {
  HEAPF32[$0>>2] = $6;
  $7 = $6 + 1.0;
  HEAPF32[$1>>2] = $7;
 }
 $8 = (($this) + 236|0);
 __ZN9REMMatrix8identityEv($8);
 $9 = (($this) + 108|0);
 __ZN9REMMatrix8identityEv($9);
 HEAPF32[$8>>2] = 0.0031250000465661287;
 $10 = (($this) + 256|0);
 HEAPF32[$10>>2] = 0.0055555556900799274;
 $11 = +HEAPF32[$1>>2];
 $12 = +HEAPF32[$0>>2];
 $13 = $11 - $12;
 $14 = 1.0 / $13;
 $15 = (($this) + 276|0);
 HEAPF32[$15>>2] = $14;
 $16 = $12 * $14;
 $17 = -$16;
 $18 = (($this) + 292|0);
 HEAPF32[$18>>2] = $17;
 $19 = (($this) + 296|0);
 HEAPF32[$19>>2] = 1.0;
 $20 = $12 + 0.10000000149011612;
 $21 = (($this) + 128|0);
 HEAPF32[$21>>2] = -1.0;
 $22 = (($this) + 156|0);
 HEAPF32[$22>>2] = -320.0;
 $23 = (($this) + 160|0);
 HEAPF32[$23>>2] = 180.0;
 $24 = (($this) + 164|0);
 HEAPF32[$24>>2] = $20;
 $25 = (($this) + 660|0);
 HEAPF32[$25>>2] = $14;
 $26 = (($this) + 596|0);
 HEAPF32[$26>>2] = $14;
 $27 = (($this) + 788|0);
 HEAPF32[$27>>2] = $14;
 $28 = (($this) + 724|0);
 HEAPF32[$28>>2] = $14;
 $29 = (($this) + 676|0);
 HEAPF32[$29>>2] = $17;
 $30 = (($this) + 612|0);
 HEAPF32[$30>>2] = $17;
 $31 = (($this) + 804|0);
 HEAPF32[$31>>2] = $17;
 $32 = (($this) + 740|0);
 HEAPF32[$32>>2] = $17;
 $33 = $14 * $11;
 $34 = $33 * $12;
 $35 = -$34;
 $36 = (($this) + 404|0);
 HEAPF32[$36>>2] = $33;
 $37 = (($this) + 340|0);
 HEAPF32[$37>>2] = $33;
 $38 = (($this) + 532|0);
 HEAPF32[$38>>2] = $33;
 $39 = (($this) + 468|0);
 HEAPF32[$39>>2] = $33;
 $40 = (($this) + 420|0);
 HEAPF32[$40>>2] = $35;
 $41 = (($this) + 356|0);
 HEAPF32[$41>>2] = $35;
 $42 = (($this) + 548|0);
 HEAPF32[$42>>2] = $35;
 $43 = (($this) + 484|0);
 HEAPF32[$43>>2] = $35;
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice17setWorldTransformEPK9REMMatrix($this,$mWorld) {
 $this = $this|0;
 $mWorld = $mWorld|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 $0 = (($this) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($1)|0);
 $2 = ($mWorld|0)==(0|0);
 $3 = (($this) + 812|0);
 if ($2) {
  __ZN9REMMatrix8identityEv($3);
 } else {
  dest=$3+0|0; src=$mWorld+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 }
 $4 = (($this) + 4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = (__ZN16REMShaderManager16getActiveProgramEv($5)|0);
 $7 = (_glGetUniformLocation(($6|0),(624|0))|0);
 _glUniformMatrix4fv(($7|0),1,0,($3|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice9initStageEfP16REMVIEWPORT_TYPEi($this,$fFOV,$pView,$nStage) {
 $this = $this|0;
 $fFOV = +$fFOV;
 $pView = $pView|0;
 $nStage = $nStage|0;
 var $$nStage = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0.0, $13 = 0, $14 = 0.0, $15 = 0.0, $16 = 0, $17 = 0.0, $18 = 0.0, $19 = 0, $2 = 0, $20 = 0.0, $21 = 0.0, $22 = 0.0, $23 = 0.0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0.0, $28 = 0.0, $29 = 0.0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0.0, $35 = 0.0, $36 = 0, $37 = 0.0, $38 = 0.0, $39 = 0, $4 = 0, $40 = 0.0, $41 = 0.0, $42 = 0.0, $43 = 0.0;
 var $44 = 0, $45 = 0.0, $46 = 0.0, $47 = 0.0, $48 = 0, $49 = 0, $5 = 0.0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0.0, $fabsf$i = 0.0, $fabsf1$i = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($pView|0)==(0|0);
 $1 = ((($this) + ($nStage<<4)|0) + 44|0);
 if ($0) {
  ;HEAP32[$1+0>>2]=HEAP32[608+0>>2]|0;HEAP32[$1+4>>2]=HEAP32[608+4>>2]|0;HEAP32[$1+8>>2]=HEAP32[608+8>>2]|0;HEAP32[$1+12>>2]=HEAP32[608+12>>2]|0;
 } else {
  ;HEAP32[$1+0>>2]=HEAP32[$pView+0>>2]|0;HEAP32[$1+4>>2]=HEAP32[$pView+4>>2]|0;HEAP32[$1+8>>2]=HEAP32[$pView+8>>2]|0;HEAP32[$1+12>>2]=HEAP32[$pView+12>>2]|0;
 }
 $2 = ($nStage>>>0)>(3);
 $$nStage = $2 ? 0 : $nStage;
 $3 = ((($this) + ($$nStage<<4)|0) + 56|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (+($4>>>0));
 $6 = ((($this) + ($$nStage<<4)|0) + 52|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (+($7>>>0));
 $9 = $5 / $8;
 $10 = ((($this) + ($$nStage<<6)|0) + 300|0);
 $11 = (($this) + 24|0);
 $12 = +HEAPF32[$11>>2];
 $13 = (($this) + 20|0);
 $14 = +HEAPF32[$13>>2];
 $15 = $12 - $14;
 $fabsf$i = (+Math_abs((+$15)));
 $16 = $fabsf$i < 0.0099999997764825821;
 if (!($16)) {
  $17 = $fFOV * 0.5;
  $18 = (+Math_sin((+$17)));
  $fabsf1$i = (+Math_abs((+$18)));
  $19 = $fabsf1$i < 0.0099999997764825821;
  if (!($19)) {
   $20 = (+Math_cos((+$17)));
   $21 = $20 / $18;
   $22 = $9 * $21;
   $23 = $12 / $15;
   __ZN9REMMatrix8identityEv($10);
   HEAPF32[$10>>2] = $22;
   $24 = ((($this) + ($$nStage<<6)|0) + 320|0);
   HEAPF32[$24>>2] = $21;
   $25 = ((($this) + ($$nStage<<6)|0) + 340|0);
   HEAPF32[$25>>2] = $23;
   $26 = ((($this) + ($$nStage<<6)|0) + 344|0);
   HEAPF32[$26>>2] = 1.0;
   $27 = +HEAPF32[$13>>2];
   $28 = $23 * $27;
   $29 = -$28;
   $30 = ((($this) + ($$nStage<<6)|0) + 356|0);
   HEAPF32[$30>>2] = $29;
   $31 = ((($this) + ($$nStage<<6)|0) + 360|0);
   HEAPF32[$31>>2] = 0.0;
  }
 }
 $32 = ((($this) + ($$nStage<<6)|0) + 556|0);
 __ZN9REMMatrix8identityEv($32);
 $33 = HEAP32[$6>>2]|0;
 $34 = (+($33>>>0));
 $35 = 2.0 / $34;
 HEAPF32[$32>>2] = $35;
 $36 = HEAP32[$3>>2]|0;
 $37 = (+($36>>>0));
 $38 = 2.0 / $37;
 $39 = ((($this) + ($$nStage<<6)|0) + 576|0);
 HEAPF32[$39>>2] = $38;
 $40 = +HEAPF32[$11>>2];
 $41 = +HEAPF32[$13>>2];
 $42 = $40 - $41;
 $43 = 1.0 / $42;
 $44 = ((($this) + ($$nStage<<6)|0) + 596|0);
 HEAPF32[$44>>2] = $43;
 $45 = +HEAPF32[$13>>2];
 $46 = $43 * $45;
 $47 = -$46;
 $48 = ((($this) + ($$nStage<<6)|0) + 612|0);
 HEAPF32[$48>>2] = $47;
 $49 = ((($this) + ($$nStage<<6)|0) + 616|0);
 HEAPF32[$49>>2] = 1.0;
 STACKTOP = sp;return 0;
}
function __ZN15REMRenderDevice7setModeE18REMENGINEMODE_TYPEi($this,$mode,$nStage) {
 $this = $this|0;
 $mode = $mode|0;
 $nStage = $nStage|0;
 var $$02 = 0, $$nStage = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $pA$0$i = 0, $pB$0$i = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $0 = sp;
 $1 = (($this) + 40|0);
 $2 = HEAP8[$1>>0]|0;
 $3 = ($2<<24>>24)==(0);
 if ($3) {
  $$02 = -1;
  STACKTOP = sp;return ($$02|0);
 }
 $4 = ($nStage>>>0)>(3);
 $$nStage = $4 ? 0 : $nStage;
 $5 = (($this) + 28|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($6|0)==($mode|0);
 if (!($7)) {
  HEAP32[$5>>2] = $mode;
 }
 $8 = (($this) + 8|0);
 $9 = HEAP32[$8>>2]|0;
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($9)|0);
 $10 = ($mode|0)==(1);
 if ($10) {
  _glViewport(0,0,640,360);
  $$02 = 0;
  STACKTOP = sp;return ($$02|0);
 }
 $11 = (($this) + 32|0);
 HEAP32[$11>>2] = $$nStage;
 $12 = ((($this) + ($$nStage<<4)|0) + 44|0);
 $13 = HEAP32[$12>>2]|0;
 $14 = ((($this) + ($$nStage<<4)|0) + 48|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = ((($this) + ($$nStage<<4)|0) + 52|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = ((($this) + ($$nStage<<4)|0) + 56|0);
 $19 = HEAP32[$18>>2]|0;
 _glViewport(($15|0),($13|0),($17|0),($19|0));
 $20 = HEAP32[$5>>2]|0;
 $21 = ($20|0)==(1);
 do {
  if ($21) {
   $22 = (($this) + 236|0);
   $23 = (($this) + 108|0);
   $pA$0$i = $22;$pB$0$i = $23;
  } else {
   $24 = (($this) + 172|0);
   $25 = ($20|0)==(0);
   $26 = HEAP32[$11>>2]|0;
   if ($25) {
    $27 = ((($this) + ($26<<6)|0) + 300|0);
    $pA$0$i = $27;$pB$0$i = $24;
    break;
   } else {
    $28 = ((($this) + ($26<<6)|0) + 556|0);
    $pA$0$i = $28;$pB$0$i = $24;
    break;
   }
  }
 } while(0);
 $29 = (($this) + 940|0);
 __ZNK9REMMatrixmlERKS_($0,$pA$0$i,$pB$0$i);
 dest=$29+0|0; src=$0+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 $$02 = 0;
 STACKTOP = sp;return ($$02|0);
}
function __ZN15REMRenderDevice9setView3DERK9REMVectorS2_S2_S2_($this,$vcRight,$vcUp,$vcDir,$vcPos) {
 $this = $this|0;
 $vcRight = $vcRight|0;
 $vcUp = $vcUp|0;
 $vcDir = $vcDir|0;
 $vcPos = $vcPos|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0.0, $12 = 0, $13 = 0, $14 = 0.0, $15 = 0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0.0, $2 = 0, $20 = 0, $21 = 0, $22 = 0.0, $23 = 0, $24 = 0, $25 = 0.0;
 var $26 = 0, $27 = 0.0, $28 = 0.0, $29 = 0, $3 = 0, $30 = 0.0, $31 = 0, $32 = 0, $33 = 0.0, $34 = 0, $35 = 0, $36 = 0.0, $37 = 0, $38 = 0.0, $39 = 0.0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0, $pA$0$i = 0, $pB$0$i = 0, dest = 0, label = 0, sp = 0, src = 0;
 var stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $0 = sp;
 $1 = (($this) + 40|0);
 $2 = HEAP8[$1>>0]|0;
 $3 = ($2<<24>>24)==(0);
 if ($3) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $4 = (($this) + 216|0);
 HEAPF32[$4>>2] = 0.0;
 $5 = (($this) + 200|0);
 HEAPF32[$5>>2] = 0.0;
 $6 = (($this) + 184|0);
 HEAPF32[$6>>2] = 0.0;
 $7 = (($this) + 232|0);
 HEAPF32[$7>>2] = 1.0;
 $8 = +HEAPF32[$vcRight>>2];
 $9 = (($this) + 172|0);
 HEAPF32[$9>>2] = $8;
 $10 = (($vcRight) + 4|0);
 $11 = +HEAPF32[$10>>2];
 $12 = (($this) + 188|0);
 HEAPF32[$12>>2] = $11;
 $13 = (($vcRight) + 8|0);
 $14 = +HEAPF32[$13>>2];
 $15 = (($this) + 204|0);
 HEAPF32[$15>>2] = $14;
 $16 = (+__ZNK9REMVectormlERKS_($vcRight,$vcPos));
 $17 = -$16;
 $18 = (($this) + 220|0);
 HEAPF32[$18>>2] = $17;
 $19 = +HEAPF32[$vcUp>>2];
 $20 = (($this) + 176|0);
 HEAPF32[$20>>2] = $19;
 $21 = (($vcUp) + 4|0);
 $22 = +HEAPF32[$21>>2];
 $23 = (($this) + 192|0);
 HEAPF32[$23>>2] = $22;
 $24 = (($vcUp) + 8|0);
 $25 = +HEAPF32[$24>>2];
 $26 = (($this) + 208|0);
 HEAPF32[$26>>2] = $25;
 $27 = (+__ZNK9REMVectormlERKS_($vcUp,$vcPos));
 $28 = -$27;
 $29 = (($this) + 224|0);
 HEAPF32[$29>>2] = $28;
 $30 = +HEAPF32[$vcDir>>2];
 $31 = (($this) + 180|0);
 HEAPF32[$31>>2] = $30;
 $32 = (($vcDir) + 4|0);
 $33 = +HEAPF32[$32>>2];
 $34 = (($this) + 196|0);
 HEAPF32[$34>>2] = $33;
 $35 = (($vcDir) + 8|0);
 $36 = +HEAPF32[$35>>2];
 $37 = (($this) + 212|0);
 HEAPF32[$37>>2] = $36;
 $38 = (+__ZNK9REMVectormlERKS_($vcDir,$vcPos));
 $39 = -$38;
 $40 = (($this) + 228|0);
 HEAPF32[$40>>2] = $39;
 $41 = (($this) + 28|0);
 $42 = HEAP32[$41>>2]|0;
 $43 = ($42|0)==(1);
 do {
  if ($43) {
   $44 = (($this) + 236|0);
   $45 = (($this) + 108|0);
   $pA$0$i = $44;$pB$0$i = $45;
  } else {
   $46 = (($this) + 172|0);
   $47 = ($42|0)==(0);
   $48 = (($this) + 32|0);
   $49 = HEAP32[$48>>2]|0;
   if ($47) {
    $50 = ((($this) + ($49<<6)|0) + 300|0);
    $pA$0$i = $50;$pB$0$i = $46;
    break;
   } else {
    $51 = ((($this) + ($49<<6)|0) + 556|0);
    $pA$0$i = $51;$pB$0$i = $46;
    break;
   }
  }
 } while(0);
 $52 = (($this) + 940|0);
 __ZNK9REMMatrixmlERKS_($0,$pA$0$i,$pB$0$i);
 dest=$52+0|0; src=$0+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this);
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN15REMRenderDevice23calcWorldViewProjMatrixEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $pProj$0 = 0, $pView$0 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 192|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $0 = sp + 128|0;
 $1 = sp + 64|0;
 $2 = sp;
 $3 = (($this) + 812|0);
 $4 = (($this) + 28|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = ($5|0)==(1);
 do {
  if ($6) {
   $7 = (($this) + 236|0);
   $8 = (($this) + 108|0);
   $pProj$0 = $7;$pView$0 = $8;
  } else {
   $9 = (($this) + 172|0);
   $10 = ($5|0)==(0);
   $11 = (($this) + 32|0);
   $12 = HEAP32[$11>>2]|0;
   if ($10) {
    $13 = ((($this) + ($12<<6)|0) + 300|0);
    $pProj$0 = $13;$pView$0 = $9;
    break;
   } else {
    $14 = ((($this) + ($12<<6)|0) + 556|0);
    $pProj$0 = $14;$pView$0 = $9;
    break;
   }
  }
 } while(0);
 $15 = (($this) + 1004|0);
 __ZNK9REMMatrixmlERKS_($0,$3,$pView$0);
 dest=$15+0|0; src=$0+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 $16 = (($this) + 4|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = (__ZN16REMShaderManager16getActiveProgramEv($17)|0);
 $19 = (_glGetUniformLocation(($18|0),(568|0))|0);
 _glUniformMatrix4fv(($19|0),1,0,($15|0));
 $20 = HEAP32[$16>>2]|0;
 $21 = (__ZN16REMShaderManager16getActiveProgramEv($20)|0);
 $22 = (_glGetUniformLocation(($21|0),(576|0))|0);
 _glUniformMatrix4fv(($22|0),1,0,($pView$0|0));
 $23 = (($this) + 876|0);
 __ZN9REMMatrix9inverseOfERKS_($23,$15);
 $24 = (($this) + 1068|0);
 __ZN9REMMatrix11transposeOfERKS_($24,$23);
 $25 = HEAP32[$16>>2]|0;
 $26 = (__ZN16REMShaderManager16getActiveProgramEv($25)|0);
 $27 = (_glGetUniformLocation(($26|0),(584|0))|0);
 _glUniformMatrix4fv(($27|0),1,0,($24|0));
 __ZNK9REMMatrixmlERKS_($2,$3,$pView$0);
 __ZNK9REMMatrixmlERKS_($1,$2,$pProj$0);
 dest=$24+0|0; src=$1+0|0; stop=dest+64|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 $28 = HEAP32[$16>>2]|0;
 $29 = (__ZN16REMShaderManager16getActiveProgramEv($28)|0);
 $30 = (_glGetUniformLocation(($29|0),(600|0))|0);
 _glUniformMatrix4fv(($30|0),1,0,($24|0));
 STACKTOP = sp;return;
}
function __ZN15REMRenderDevice13setViewLookAtERK9REMVectorS2_S2_($this,$vcPos,$vcPoint,$vcWorldUp) {
 $this = $this|0;
 $vcPos = $vcPos|0;
 $vcPoint = $vcPoint|0;
 $vcWorldUp = $vcWorldUp|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0.0, $12 = 0.0, $13 = 0, $14 = 0, $15 = 0.0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0.0, $8 = 0.0;
 var $9 = 0, $fL$0 = 0.0, $vcDir = 0, $vcRight = 0, $vcTemp = 0, $vcUp = 0, $vcY = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 192|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vcDir = sp + 16|0;
 $vcTemp = sp + 64|0;
 $vcUp = sp + 144|0;
 $0 = sp;
 $1 = sp + 128|0;
 $2 = sp + 160|0;
 $vcY = sp + 176|0;
 $3 = sp + 96|0;
 $4 = sp + 80|0;
 $5 = sp + 32|0;
 $6 = sp + 48|0;
 $vcRight = sp + 112|0;
 __ZN9REMVectorC2Ev($vcDir);
 __ZN9REMVectorC2Ev($vcTemp);
 __ZN9REMVectorC2Ev($vcUp);
 __ZNK9REMVectormiERKS_($0,$vcPoint,$vcPos);
 ;HEAP32[$vcDir+0>>2]=HEAP32[$0+0>>2]|0;HEAP32[$vcDir+4>>2]=HEAP32[$0+4>>2]|0;HEAP32[$vcDir+8>>2]=HEAP32[$0+8>>2]|0;HEAP32[$vcDir+12>>2]=HEAP32[$0+12>>2]|0;
 __ZN9REMVector9normaliseEv($vcDir);
 $7 = (+__ZNK9REMVectormlERKS_($vcWorldUp,$vcDir));
 __ZNK9REMVectormlEf($1,$vcDir,$7);
 ;HEAP32[$vcTemp+0>>2]=HEAP32[$1+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$1+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$1+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$1+12>>2]|0;
 __ZNK9REMVectormiERKS_($2,$vcWorldUp,$vcTemp);
 ;HEAP32[$vcUp+0>>2]=HEAP32[$2+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$2+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$2+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$2+12>>2]|0;
 $8 = (+__ZN9REMVector9getLengthEv($vcUp));
 $9 = $8 < 9.9999999747524271E-7;
 if ($9) {
  __ZN9REMVectorC2Ev($vcY);
  __ZN9REMVector3setEffff($vcY,0.0,1.0,0.0,1.0);
  $10 = (($vcDir) + 4|0);
  $11 = +HEAPF32[$10>>2];
  __ZNK9REMVectormlEf($3,$vcDir,$11);
  ;HEAP32[$vcTemp+0>>2]=HEAP32[$3+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$3+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$3+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$3+12>>2]|0;
  __ZNK9REMVectormiERKS_($4,$vcY,$vcTemp);
  ;HEAP32[$vcUp+0>>2]=HEAP32[$4+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$4+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$4+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$4+12>>2]|0;
  $12 = (+__ZN9REMVector9getLengthEv($vcUp));
  $13 = $12 < 9.9999999747524271E-7;
  if ($13) {
   __ZN9REMVector3setEffff($vcY,0.0,0.0,1.0,1.0);
   $14 = (($vcDir) + 8|0);
   $15 = +HEAPF32[$14>>2];
   __ZNK9REMVectormlEf($5,$vcDir,$15);
   ;HEAP32[$vcTemp+0>>2]=HEAP32[$5+0>>2]|0;HEAP32[$vcTemp+4>>2]=HEAP32[$5+4>>2]|0;HEAP32[$vcTemp+8>>2]=HEAP32[$5+8>>2]|0;HEAP32[$vcTemp+12>>2]=HEAP32[$5+12>>2]|0;
   __ZNK9REMVectormiERKS_($6,$vcY,$vcTemp);
   ;HEAP32[$vcUp+0>>2]=HEAP32[$6+0>>2]|0;HEAP32[$vcUp+4>>2]=HEAP32[$6+4>>2]|0;HEAP32[$vcUp+8>>2]=HEAP32[$6+8>>2]|0;HEAP32[$vcUp+12>>2]=HEAP32[$6+12>>2]|0;
   $16 = (+__ZN9REMVector9getLengthEv($vcUp));
   $17 = $16;
   $18 = $17 < 9.9999999999999995E-7;
   if ($18) {
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   } else {
    $fL$0 = $16;
   }
  } else {
   $fL$0 = $12;
  }
 } else {
  $fL$0 = $8;
 }
 __ZN9REMVectordVEf($vcUp,$fL$0);
 __ZN9REMVectorC2Ev($vcRight);
 __ZN9REMVector5crossERKS_S1_($vcRight,$vcUp,$vcDir);
 $19 = (__ZN15REMRenderDevice9setView3DERK9REMVectorS2_S2_S2_($this,$vcRight,$vcUp,$vcDir,$vcPos)|0);
 $$0 = $19;
 STACKTOP = sp;return ($$0|0);
}
function __ZN15REMRenderDevice12getShadeModeEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 16|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
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
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $compile_ok = 0, $infoLen = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vs_source = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $vs_source = sp + 20|0;
 $compile_ok = sp + 16|0;
 $infoLen = sp + 12|0;
 HEAP32[$compile_ok>>2] = 0;
 HEAP32[$infoLen>>2] = 0;
 $0 = (($this) + 786424|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1>>>0)>(65533);
 if ($2) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 do {
  if ($bLoadFromFile) {
   $3 = (_fopen(($pData|0),(632|0))|0);
   $4 = ($3|0)==(0|0);
   if ($4) {
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   }
   (_fseek(($3|0),0,2)|0);
   $5 = (_ftell(($3|0))|0);
   _rewind(($3|0));
   $6 = (($5) + 1)|0;
   $7 = (_calloc(1,$6)|0);
   HEAP32[$vs_source>>2] = $7;
   $8 = ($7|0)==(0|0);
   if ($8) {
    (_fclose(($3|0))|0);
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   }
   $9 = (_fread(($7|0),($5|0),1,($3|0))|0);
   $10 = ($9|0)==(1);
   if ($10) {
    (_fclose(($3|0))|0);
    break;
   }
   $11 = HEAP32[$vs_source>>2]|0;
   _free($11);
   $$0 = -1;
   STACKTOP = sp;return ($$0|0);
  } else {
   HEAP32[$vs_source>>2] = $pData;
  }
 } while(0);
 $12 = (_glCreateShader(35633)|0);
 _glShaderSource(($12|0),1,($vs_source|0),(0|0));
 _glCompileShader(($12|0));
 _glGetShaderiv(($12|0),35713,($compile_ok|0));
 $13 = HEAP32[$compile_ok>>2]|0;
 $14 = ($13|0)==(0);
 if ($14) {
  _glGetShaderiv(($12|0),35716,($infoLen|0));
  $15 = HEAP32[$infoLen>>2]|0;
  $16 = ($15|0)>(1);
  if ($16) {
   $17 = (_malloc($15)|0);
   _glGetShaderInfoLog(($12|0),($15|0),(0|0),($17|0));
   HEAP32[$vararg_buffer>>2] = $17;
   __ZN16REMShaderManager3logEPcz(0,640,$vararg_buffer);
   _free($17);
  }
 }
 if ($bLoadFromFile) {
  $18 = HEAP32[$vs_source>>2]|0;
  _free($18);
 }
 $19 = HEAP32[$0>>2]|0;
 $20 = ((($this) + ($19<<2)|0) + 4|0);
 HEAP32[$20>>2] = $12;
 $21 = ($pID|0)==(0|0);
 if (!($21)) {
  $22 = HEAP32[$0>>2]|0;
  HEAP32[$pID>>2] = $22;
 }
 $23 = HEAP32[$0>>2]|0;
 HEAP32[$vararg_buffer1>>2] = $23;
 __ZN16REMShaderManager3logEPcz(0,672,$vararg_buffer1);
 $24 = HEAP32[$0>>2]|0;
 $25 = (($24) + 1)|0;
 HEAP32[$0>>2] = $25;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
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
 (_printf((816|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN16REMShaderManager13createFShaderEPKcbPj($this,$pData,$bLoadFromFile,$pID) {
 $this = $this|0;
 $pData = $pData|0;
 $bLoadFromFile = $bLoadFromFile|0;
 $pID = $pID|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $compile_ok = 0, $fs_source = 0, $infoLen = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $fs_source = sp + 20|0;
 $compile_ok = sp + 16|0;
 $infoLen = sp + 12|0;
 HEAP32[$compile_ok>>2] = 0;
 HEAP32[$infoLen>>2] = 0;
 $0 = (($this) + 786428|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1>>>0)>(65533);
 if ($2) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 do {
  if ($bLoadFromFile) {
   $3 = (_fopen(($pData|0),(632|0))|0);
   $4 = ($3|0)==(0|0);
   if ($4) {
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   }
   (_fseek(($3|0),0,2)|0);
   $5 = (_ftell(($3|0))|0);
   _rewind(($3|0));
   $6 = (($5) + 1)|0;
   $7 = (_calloc(1,$6)|0);
   HEAP32[$fs_source>>2] = $7;
   $8 = ($7|0)==(0|0);
   if ($8) {
    (_fclose(($3|0))|0);
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   }
   $9 = (_fread(($7|0),($5|0),1,($3|0))|0);
   $10 = ($9|0)==(1);
   if ($10) {
    (_fclose(($3|0))|0);
    break;
   }
   $11 = HEAP32[$fs_source>>2]|0;
   _free($11);
   $$0 = -1;
   STACKTOP = sp;return ($$0|0);
  } else {
   HEAP32[$fs_source>>2] = $pData;
  }
 } while(0);
 $12 = (_glCreateShader(35632)|0);
 _glShaderSource(($12|0),1,($fs_source|0),(0|0));
 _glCompileShader(($12|0));
 _glGetShaderiv(($12|0),35713,($compile_ok|0));
 $13 = HEAP32[$compile_ok>>2]|0;
 $14 = ($13|0)==(0);
 if ($14) {
  _glGetShaderiv(($12|0),35716,($infoLen|0));
  $15 = HEAP32[$infoLen>>2]|0;
  $16 = ($15|0)>(1);
  if ($16) {
   $17 = (_malloc($15)|0);
   _glGetShaderInfoLog(($12|0),($15|0),(0|0),($17|0));
   HEAP32[$vararg_buffer>>2] = $17;
   __ZN16REMShaderManager3logEPcz(0,640,$vararg_buffer);
   _free($17);
  }
 }
 if ($bLoadFromFile) {
  $18 = HEAP32[$fs_source>>2]|0;
  _free($18);
 }
 $19 = HEAP32[$0>>2]|0;
 $20 = ((($this) + ($19<<2)|0) + 262144|0);
 HEAP32[$20>>2] = $12;
 $21 = ($pID|0)==(0|0);
 if (!($21)) {
  $22 = HEAP32[$0>>2]|0;
  HEAP32[$pID>>2] = $22;
 }
 $23 = HEAP32[$0>>2]|0;
 HEAP32[$vararg_buffer1>>2] = $23;
 __ZN16REMShaderManager3logEPcz(0,712,$vararg_buffer1);
 $24 = HEAP32[$0>>2]|0;
 $25 = (($24) + 1)|0;
 HEAP32[$0>>2] = $25;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN16REMShaderManager13createProgramEjjPj($this,$vID,$fID,$pID) {
 $this = $this|0;
 $vID = $vID|0;
 $fID = $fID|0;
 $pID = $pID|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = (_glCreateProgram()|0);
 $1 = ((($this) + ($fID<<2)|0) + 262144|0);
 $2 = HEAP32[$1>>2]|0;
 _glAttachShader(($0|0),($2|0));
 $3 = ((($this) + ($vID<<2)|0) + 4|0);
 $4 = HEAP32[$3>>2]|0;
 _glAttachShader(($0|0),($4|0));
 _glLinkProgram(($0|0));
 $5 = (($this) + 786432|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ((($this) + ($6<<2)|0) + 524284|0);
 HEAP32[$7>>2] = $0;
 $8 = ($pID|0)==(0|0);
 if (!($8)) {
  $9 = HEAP32[$5>>2]|0;
  HEAP32[$pID>>2] = $9;
 }
 $10 = HEAP32[$5>>2]|0;
 HEAP32[$vararg_buffer>>2] = $10;
 __ZN16REMShaderManager3logEPcz(0,752,$vararg_buffer);
 $11 = HEAP32[$5>>2]|0;
 $12 = (($11) + 1)|0;
 HEAP32[$5>>2] = $12;
 STACKTOP = sp;return 0;
}
function __ZN16REMShaderManager15activateProgramEj($this,$pID) {
 $this = $this|0;
 $pID = $pID|0;
 var $$0 = 0, $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = (($this) + 786432|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1>>>0)>($pID>>>0);
 if (!($2)) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $3 = HEAP32[$this>>2]|0;
 $4 = (__ZN15REMRenderDevice16getVertexManagerEv($3)|0);
 (__ZN21REMVertexCacheManager14forcedFlushAllEv($4)|0);
 $5 = ((($this) + ($pID<<2)|0) + 524284|0);
 $6 = HEAP32[$5>>2]|0;
 _glUseProgram(($6|0));
 $7 = HEAP32[$5>>2]|0;
 $8 = (($this) + 786436|0);
 HEAP32[$8>>2] = $7;
 HEAP32[$vararg_buffer>>2] = $pID;
 __ZN16REMShaderManager3logEPcz(0,784,$vararg_buffer);
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN16REMShaderManager16getActiveProgramEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 786436|0);
 $1 = HEAP32[$0>>2]|0;
 STACKTOP = sp;return ($1|0);
}
function __ZN14REMSimpleModelC2EP15REMRenderDevice14REMVERTEX_TYPE($this,$pDevice,$format) {
 $this = $this|0;
 $pDevice = $pDevice|0;
 $format = $format|0;
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAP32[$this>>2] = $pDevice;
 $0 = (($this) + 4212|0);
 HEAP32[$0>>2] = $format;
 $1 = (($this) + 2161|0);
 HEAP8[$1>>0] = 0;
 STACKTOP = sp;return;
}
function __ZN14REMSimpleModel3logEPcz($this,$chString,$varargs) {
 $this = $this|0;
 $chString = $chString|0;
 $varargs = $varargs|0;
 var $args = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $args = sp + 8|0;
 HEAP32[$args>>2] = $varargs;
 (_printf((1456|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN14REMSimpleModel22getNumberOfFacesInFileEv($this) {
 $this = $this|0;
 var $$nof$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $ch = 0, $nof$0$lcssa = 0, $nof$01 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 1040|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $ch = sp + 8|0;
 $0 = (($this) + 2152|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (_fgets(($ch|0),1024,($1|0))|0);
 $3 = ($2|0)==(0|0);
 if ($3) {
  $nof$0$lcssa = 0;
 } else {
  $nof$01 = 0;
  while(1) {
   $4 = (_strtok($ch,840)|0);
   $5 = (_strcmp(848,$4)|0);
   $6 = ($5|0)==(0);
   $7 = $6&1;
   $$nof$0 = (($7) + ($nof$01))|0;
   $8 = HEAP32[$0>>2]|0;
   $9 = (_fgets(($ch|0),1024,($8|0))|0);
   $10 = ($9|0)==(0|0);
   if ($10) {
    $nof$0$lcssa = $$nof$0;
    break;
   } else {
    $nof$01 = $$nof$0;
   }
  }
 }
 $11 = HEAP32[$0>>2]|0;
 _rewind(($11|0));
 HEAP32[$vararg_buffer>>2] = $nof$0$lcssa;
 __ZN14REMSimpleModel3logEPcz(0,856,$vararg_buffer);
 STACKTOP = sp;return ($nof$0$lcssa|0);
}
function __ZN14REMSimpleModel9handleMTLEv($this) {
 $this = $this|0;
 var $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0.0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0;
 var $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0.0, $28 = 0.0, $29 = 0.0, $3 = 0, $30 = 0, $31 = 0.0, $32 = 0.0, $33 = 0, $34 = 0.0, $35 = 0.0, $36 = 0, $37 = 0.0, $38 = 0.0;
 var $39 = 0.0, $4 = 0, $40 = 0.0, $41 = 0.0, $42 = 0.0, $43 = 0.0, $44 = 0, $45 = 0.0, $46 = 0.0, $47 = 0, $48 = 0.0, $49 = 0.0, $5 = 0, $50 = 0, $51 = 0.0, $52 = 0.0, $53 = 0.0, $54 = 0.0, $55 = 0.0, $56 = 0.0;
 var $57 = 0.0, $58 = 0, $59 = 0.0, $6 = 0, $60 = 0.0, $61 = 0, $62 = 0.0, $63 = 0.0, $64 = 0, $65 = 0.0, $66 = 0.0, $67 = 0.0, $68 = 0.0, $69 = 0.0, $7 = 0, $70 = 0.0, $71 = 0.0, $72 = 0, $73 = 0.0, $74 = 0.0;
 var $75 = 0, $76 = 0.0, $77 = 0.0, $78 = 0, $79 = 0.0, $8 = 0, $80 = 0.0, $81 = 0.0, $82 = 0.0, $83 = 0.0, $84 = 0.0, $85 = 0.0, $86 = 0, $87 = 0.0, $88 = 0.0, $89 = 0.0, $9 = 0, $90 = 0, $91 = 0, $92 = 0;
 var $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0.0, $matFilename = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vararg_buffer14 = 0, $vararg_buffer19 = 0, $vararg_buffer24 = 0, $vararg_buffer29 = 0, $vararg_buffer3 = 0, $vararg_buffer32 = 0, $vararg_buffer35 = 0, $vararg_buffer38 = 0, $vararg_buffer41 = 0, $vararg_buffer44 = 0;
 var $vararg_buffer6 = 0, $vararg_buffer9 = 0, $vararg_ptr12 = 0, $vararg_ptr13 = 0, $vararg_ptr17 = 0, $vararg_ptr18 = 0, $vararg_ptr22 = 0, $vararg_ptr23 = 0, $vararg_ptr27 = 0, $vararg_ptr28 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 1200|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer44 = sp + 168|0;
 $vararg_buffer41 = sp + 72|0;
 $vararg_buffer38 = sp + 136|0;
 $vararg_buffer35 = sp + 120|0;
 $vararg_buffer32 = sp + 112|0;
 $vararg_buffer29 = sp + 128|0;
 $vararg_buffer24 = sp + 144|0;
 $vararg_buffer19 = sp + 80|0;
 $vararg_buffer14 = sp + 32|0;
 $vararg_buffer9 = sp + 8|0;
 $vararg_buffer6 = sp + 104|0;
 $vararg_buffer3 = sp + 56|0;
 $vararg_buffer1 = sp;
 $vararg_buffer = sp + 64|0;
 $matFilename = sp + 176|0;
 $0 = (_strtok(0,904)|0);
 HEAP32[$vararg_buffer>>2] = $0;
 (_sprintf($matFilename,888,$vararg_buffer)|0);
 $1 = (_fopen(($matFilename|0),(912|0))|0);
 $2 = (($this) + 2156|0);
 HEAP32[$2>>2] = $1;
 $3 = ($1|0)==(0|0);
 if ($3) {
  __ZN14REMSimpleModel3logEPcz(0,920,$vararg_buffer1);
  STACKTOP = sp;return;
 }
 HEAP32[$vararg_buffer3>>2] = $matFilename;
 __ZN14REMSimpleModel3logEPcz(0,952,$vararg_buffer3);
 $4 = (($this) + 2144|0);
 $5 = (($this) + 2080|0);
 $6 = (($this) + 2084|0);
 $7 = (($this) + 2088|0);
 $8 = (($this) + 2096|0);
 $9 = (($this) + 2100|0);
 $10 = (($this) + 2104|0);
 $11 = (($this) + 2128|0);
 $12 = (($this) + 2132|0);
 $13 = (($this) + 2136|0);
 $14 = (($this) + 2112|0);
 $15 = (($this) + 2116|0);
 $16 = (($this) + 2120|0);
 $17 = (($this) + 2148|0);
 $18 = (($this) + 2092|0);
 $19 = (($this) + 2108|0);
 $20 = (($this) + 2140|0);
 $21 = (($this) + 2124|0);
 $22 = (($this) + 2161|0);
 $23 = (($this) + 32|0);
 $24 = (($this) + 1056|0);
 L5: while(1) {
  $25 = (__ZN14REMSimpleModel15getMTLNextChunkEv($this)|0);
  switch ($25|0) {
  case 5:  {
   $26 = (_strtok(0,840)|0);
   $27 = (+_atof($26));
   $28 = $27;
   HEAPF32[$4>>2] = $28;
   $29 = $28;
   HEAPF64[tempDoublePtr>>3]=$29;HEAP32[$vararg_buffer6>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer6+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,976,$vararg_buffer6);
   continue L5;
   break;
  }
  case 8:  {
   $30 = (_strtok(0,840)|0);
   $31 = (+_atof($30));
   $32 = $31;
   HEAPF32[$5>>2] = $32;
   $33 = (_strtok(0,840)|0);
   $34 = (+_atof($33));
   $35 = $34;
   HEAPF32[$6>>2] = $35;
   $36 = (_strtok(0,840)|0);
   $37 = (+_atof($36));
   $38 = $37;
   HEAPF32[$7>>2] = $38;
   $39 = +HEAPF32[$5>>2];
   $40 = $39;
   $41 = +HEAPF32[$6>>2];
   $42 = $41;
   $43 = $38;
   HEAPF64[tempDoublePtr>>3]=$40;HEAP32[$vararg_buffer9>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer9+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr12 = (($vararg_buffer9) + 8|0);
   HEAPF64[tempDoublePtr>>3]=$42;HEAP32[$vararg_ptr12>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr12+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr13 = (($vararg_buffer9) + 16|0);
   HEAPF64[tempDoublePtr>>3]=$43;HEAP32[$vararg_ptr13>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr13+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,1008,$vararg_buffer9);
   continue L5;
   break;
  }
  case 9:  {
   $44 = (_strtok(0,840)|0);
   $45 = (+_atof($44));
   $46 = $45;
   HEAPF32[$8>>2] = $46;
   $47 = (_strtok(0,840)|0);
   $48 = (+_atof($47));
   $49 = $48;
   HEAPF32[$9>>2] = $49;
   $50 = (_strtok(0,840)|0);
   $51 = (+_atof($50));
   $52 = $51;
   HEAPF32[$10>>2] = $52;
   $53 = +HEAPF32[$8>>2];
   $54 = $53;
   $55 = +HEAPF32[$9>>2];
   $56 = $55;
   $57 = $52;
   HEAPF64[tempDoublePtr>>3]=$54;HEAP32[$vararg_buffer14>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer14+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr17 = (($vararg_buffer14) + 8|0);
   HEAPF64[tempDoublePtr>>3]=$56;HEAP32[$vararg_ptr17>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr17+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr18 = (($vararg_buffer14) + 16|0);
   HEAPF64[tempDoublePtr>>3]=$57;HEAP32[$vararg_ptr18>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr18+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,1048,$vararg_buffer14);
   continue L5;
   break;
  }
  case 10:  {
   $58 = (_strtok(0,840)|0);
   $59 = (+_atof($58));
   $60 = $59;
   HEAPF32[$11>>2] = $60;
   $61 = (_strtok(0,840)|0);
   $62 = (+_atof($61));
   $63 = $62;
   HEAPF32[$12>>2] = $63;
   $64 = (_strtok(0,840)|0);
   $65 = (+_atof($64));
   $66 = $65;
   HEAPF32[$13>>2] = $66;
   $67 = +HEAPF32[$11>>2];
   $68 = $67;
   $69 = +HEAPF32[$12>>2];
   $70 = $69;
   $71 = $66;
   HEAPF64[tempDoublePtr>>3]=$68;HEAP32[$vararg_buffer19>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer19+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr22 = (($vararg_buffer19) + 8|0);
   HEAPF64[tempDoublePtr>>3]=$70;HEAP32[$vararg_ptr22>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr22+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr23 = (($vararg_buffer19) + 16|0);
   HEAPF64[tempDoublePtr>>3]=$71;HEAP32[$vararg_ptr23>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr23+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,1088,$vararg_buffer19);
   continue L5;
   break;
  }
  case 6:  {
   $86 = (_strtok(0,840)|0);
   $87 = (+_atof($86));
   $88 = $87;
   HEAPF32[$17>>2] = $88;
   HEAPF32[$18>>2] = $88;
   HEAPF32[$19>>2] = $88;
   HEAPF32[$20>>2] = $88;
   HEAPF32[$21>>2] = $88;
   $89 = $88;
   HEAPF64[tempDoublePtr>>3]=$89;HEAP32[$vararg_buffer29>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer29+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,1168,$vararg_buffer29);
   continue L5;
   break;
  }
  case 11:  {
   $72 = (_strtok(0,840)|0);
   $73 = (+_atof($72));
   $74 = $73;
   HEAPF32[$14>>2] = $74;
   $75 = (_strtok(0,840)|0);
   $76 = (+_atof($75));
   $77 = $76;
   HEAPF32[$15>>2] = $77;
   $78 = (_strtok(0,840)|0);
   $79 = (+_atof($78));
   $80 = $79;
   HEAPF32[$16>>2] = $80;
   $81 = +HEAPF32[$14>>2];
   $82 = $81;
   $83 = +HEAPF32[$15>>2];
   $84 = $83;
   $85 = $80;
   HEAPF64[tempDoublePtr>>3]=$82;HEAP32[$vararg_buffer24>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_buffer24+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr27 = (($vararg_buffer24) + 8|0);
   HEAPF64[tempDoublePtr>>3]=$84;HEAP32[$vararg_ptr27>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr27+4>>2]=HEAP32[tempDoublePtr+4>>2];
   $vararg_ptr28 = (($vararg_buffer24) + 16|0);
   HEAPF64[tempDoublePtr>>3]=$85;HEAP32[$vararg_ptr28>>2]=HEAP32[tempDoublePtr>>2];HEAP32[$vararg_ptr28+4>>2]=HEAP32[tempDoublePtr+4>>2];
   __ZN14REMSimpleModel3logEPcz(0,1128,$vararg_buffer24);
   continue L5;
   break;
  }
  case 12:  {
   HEAP8[$22>>0] = 1;
   $90 = (_strtok(0,904)|0);
   HEAP32[$vararg_buffer32>>2] = $90;
   (_sprintf($23,1192,$vararg_buffer32)|0);
   HEAP32[$vararg_buffer35>>2] = $23;
   __ZN14REMSimpleModel3logEPcz(0,1208,$vararg_buffer35);
   continue L5;
   break;
  }
  case 13:  {
   HEAP8[$22>>0] = 1;
   $91 = (_strtok(0,904)|0);
   HEAP32[$vararg_buffer38>>2] = $91;
   (_sprintf($24,1192,$vararg_buffer38)|0);
   HEAP32[$vararg_buffer41>>2] = $24;
   __ZN14REMSimpleModel3logEPcz(0,1232,$vararg_buffer41);
   continue L5;
   break;
  }
  case -1:  {
   break L5;
   break;
  }
  default: {
   continue L5;
  }
  }
 }
 HEAP32[$vararg_buffer44>>2] = $matFilename;
 __ZN14REMSimpleModel3logEPcz(0,1256,$vararg_buffer44);
 $92 = HEAP32[$2>>2]|0;
 (_fclose(($92|0))|0);
 $93 = HEAP32[$this>>2]|0;
 $94 = (__ZN15REMRenderDevice14getSkinManagerEv($93)|0);
 $95 = (($this) + 2080|0);
 $96 = (($this) + 2096|0);
 $97 = (($this) + 2128|0);
 $98 = (($this) + 2112|0);
 $99 = +HEAPF32[$4>>2];
 $100 = (($this) + 4216|0);
 (__ZN14REMSkinManager7addSkinEPK14REMCOLOUR_TYPES2_S2_S2_fPj($94,$95,$96,$97,$98,$99,$100)|0);
 $101 = HEAP8[$22>>0]|0;
 $102 = ($101<<24>>24)==(0);
 if ($102) {
  STACKTOP = sp;return;
 }
 $103 = HEAP32[$this>>2]|0;
 $104 = (__ZN15REMRenderDevice14getSkinManagerEv($103)|0);
 $105 = HEAP32[$100>>2]|0;
 $106 = +HEAPF32[$17>>2];
 (__ZN14REMSkinManager10addTextureEjPKcbfP14REMCOLOUR_TYPEj($104,$105,$24,1,$106,0,0)|0);
 STACKTOP = sp;return;
}
function __ZN14REMSimpleModel15getMTLNextChunkEv($this) {
 $this = $this|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $br$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 3187|0);
 $1 = (($this) + 2156|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (_fgets(($0|0),1024,($2|0))|0);
 $4 = ($3|0)==(0|0);
 if ($4) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $5 = (_strtok($0,840)|0);
 $6 = (_strcmp(1280,$5)|0);
 $7 = ($6|0)==(0);
 if ($7) {
  $br$0 = 5;
 } else {
  $8 = (_strcmp(1288,$5)|0);
  $9 = ($8|0)==(0);
  if ($9) {
   $br$0 = 6;
  } else {
   $10 = (_strcmp(1296,$5)|0);
   $11 = ($10|0)==(0);
   if ($11) {
    $br$0 = 7;
   } else {
    $12 = (_strcmp(1304,$5)|0);
    $13 = ($12|0)==(0);
    if ($13) {
     $br$0 = 8;
    } else {
     $14 = (_strcmp(1312,$5)|0);
     $15 = ($14|0)==(0);
     if ($15) {
      $br$0 = 9;
     } else {
      $16 = (_strcmp(1320,$5)|0);
      $17 = ($16|0)==(0);
      if ($17) {
       $br$0 = 10;
      } else {
       $18 = (_strcmp(1328,$5)|0);
       $19 = ($18|0)==(0);
       if ($19) {
        $br$0 = 11;
       } else {
        $20 = (_strcmp(1336,$5)|0);
        $21 = ($20|0)==(0);
        if ($21) {
         $br$0 = 12;
        } else {
         $22 = (_strcmp(1344,$5)|0);
         $23 = ($22|0)==(0);
         if ($23) {
          $br$0 = 13;
         } else {
          $$0 = -2;
          STACKTOP = sp;return ($$0|0);
         }
        }
       }
      }
     }
    }
   }
  }
 }
 $$0 = $br$0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN14REMSimpleModel8readFileEPKc($this,$chFile) {
 $this = $this|0;
 $chFile = $chFile|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0.0, $33 = 0.0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0.0, $39 = 0.0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0.0;
 var $45 = 0.0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0.0, $52 = 0.0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0.0, $58 = 0.0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0;
 var $63 = 0.0, $64 = 0.0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0.0, $71 = 0.0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0.0, $77 = 0.0, $78 = 0, $79 = 0, $8 = 0, $80 = 0;
 var $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vararg_buffer3 = 0, $vararg_buffer6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer6 = sp + 24|0;
 $vararg_buffer3 = sp + 16|0;
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $0 = (_fopen(($chFile|0),(912|0))|0);
 $1 = (($this) + 2152|0);
 HEAP32[$1>>2] = $0;
 $2 = ($0|0)==(0|0);
 if ($2) {
  __ZN14REMSimpleModel3logEPcz(0,1352,$vararg_buffer);
  STACKTOP = sp;return;
 }
 HEAP32[$vararg_buffer1>>2] = $chFile;
 __ZN14REMSimpleModel3logEPcz(0,1376,$vararg_buffer1);
 $3 = (__ZN14REMSimpleModel22getNumberOfFacesInFileEv($this)|0);
 $4 = ($3*3)|0;
 $5 = (($this) + 4|0);
 HEAP32[$5>>2] = $4;
 $6 = (($this) + 4212|0);
 $7 = HEAP32[$6>>2]|0;
 if ((($7|0) == 1)) {
  $11 = ($3*108)|0;
  $12 = (_malloc($11)|0);
  $13 = (($this) + 4224|0);
  HEAP32[$13>>2] = $12;
 } else if ((($7|0) == 0)) {
  $8 = ($3*168)|0;
  $9 = (_malloc($8)|0);
  $10 = (($this) + 4224|0);
  HEAP32[$10>>2] = $9;
 }
 $14 = (($this) + 4220|0);
 HEAP32[$14>>2] = 0;
 $15 = ($3*6)|0;
 $16 = (_malloc($15)|0);
 $17 = (($this) + 4232|0);
 HEAP32[$17>>2] = $16;
 $18 = (($this) + 4228|0);
 HEAP32[$18>>2] = 0;
 $19 = ($3*36)|0;
 $20 = (_malloc($19)|0);
 $21 = (($this) + 8|0);
 HEAP32[$21>>2] = $20;
 $22 = (($this) + 12|0);
 HEAP32[$22>>2] = 0;
 $23 = ($3*24)|0;
 $24 = (_malloc($23)|0);
 $25 = (($this) + 16|0);
 HEAP32[$25>>2] = $24;
 $26 = (($this) + 20|0);
 HEAP32[$26>>2] = 0;
 $27 = (_malloc($19)|0);
 $28 = (($this) + 24|0);
 HEAP32[$28>>2] = $27;
 $29 = (($this) + 28|0);
 HEAP32[$29>>2] = 0;
 L9: while(1) {
  $30 = (__ZN14REMSimpleModel15getObjNextChunkEv($this)|0);
  switch ($30|0) {
  case 0:  {
   $31 = (_strtok(0,840)|0);
   $32 = (+_atof($31));
   $33 = $32;
   $34 = HEAP32[$22>>2]|0;
   $35 = HEAP32[$21>>2]|0;
   $36 = (($35) + (($34*12)|0)|0);
   HEAPF32[$36>>2] = $33;
   $37 = (_strtok(0,840)|0);
   $38 = (+_atof($37));
   $39 = $38;
   $40 = HEAP32[$22>>2]|0;
   $41 = HEAP32[$21>>2]|0;
   $42 = ((($41) + (($40*12)|0)|0) + 4|0);
   HEAPF32[$42>>2] = $39;
   $43 = (_strtok(0,840)|0);
   $44 = (+_atof($43));
   $45 = $44;
   $46 = HEAP32[$22>>2]|0;
   $47 = HEAP32[$21>>2]|0;
   $48 = ((($47) + (($46*12)|0)|0) + 8|0);
   HEAPF32[$48>>2] = $45;
   $49 = (($46) + 1)|0;
   HEAP32[$22>>2] = $49;
   continue L9;
   break;
  }
  case 1:  {
   $50 = (_strtok(0,840)|0);
   $51 = (+_atof($50));
   $52 = $51;
   $53 = HEAP32[$29>>2]|0;
   $54 = HEAP32[$28>>2]|0;
   $55 = (($54) + (($53*12)|0)|0);
   HEAPF32[$55>>2] = $52;
   $56 = (_strtok(0,840)|0);
   $57 = (+_atof($56));
   $58 = $57;
   $59 = HEAP32[$29>>2]|0;
   $60 = HEAP32[$28>>2]|0;
   $61 = ((($60) + (($59*12)|0)|0) + 4|0);
   HEAPF32[$61>>2] = $58;
   $62 = (_strtok(0,840)|0);
   $63 = (+_atof($62));
   $64 = $63;
   $65 = HEAP32[$29>>2]|0;
   $66 = HEAP32[$28>>2]|0;
   $67 = ((($66) + (($65*12)|0)|0) + 8|0);
   HEAPF32[$67>>2] = $64;
   $68 = (($65) + 1)|0;
   HEAP32[$29>>2] = $68;
   continue L9;
   break;
  }
  case 2:  {
   $69 = (_strtok(0,840)|0);
   $70 = (+_atof($69));
   $71 = $70;
   $72 = HEAP32[$26>>2]|0;
   $73 = HEAP32[$25>>2]|0;
   $74 = (($73) + ($72<<3)|0);
   HEAPF32[$74>>2] = $71;
   $75 = (_strtok(0,840)|0);
   $76 = (+_atof($75));
   $77 = $76;
   $78 = HEAP32[$26>>2]|0;
   $79 = HEAP32[$25>>2]|0;
   $80 = ((($79) + ($78<<3)|0) + 4|0);
   HEAPF32[$80>>2] = $77;
   $81 = (($78) + 1)|0;
   HEAP32[$26>>2] = $81;
   continue L9;
   break;
  }
  case 3:  {
   __ZN14REMSimpleModel11readObjFaceEv($this);
   continue L9;
   break;
  }
  case 4:  {
   __ZN14REMSimpleModel9handleMTLEv($this);
   continue L9;
   break;
  }
  case -1:  {
   break L9;
   break;
  }
  default: {
   continue L9;
  }
  }
 }
 $82 = HEAP32[$14>>2]|0;
 HEAP32[$vararg_buffer3>>2] = $82;
 __ZN14REMSimpleModel3logEPcz(0,1392,$vararg_buffer3);
 HEAP32[$vararg_buffer6>>2] = $chFile;
 __ZN14REMSimpleModel3logEPcz(0,1256,$vararg_buffer6);
 $83 = HEAP32[$1>>2]|0;
 (_fclose(($83|0))|0);
 $84 = HEAP32[$21>>2]|0;
 _free($84);
 $85 = HEAP32[$25>>2]|0;
 _free($85);
 $86 = HEAP32[$28>>2]|0;
 _free($86);
 STACKTOP = sp;return;
}
function __ZN14REMSimpleModel15getObjNextChunkEv($this) {
 $this = $this|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $br$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 2163|0);
 $1 = (($this) + 2152|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (_fgets(($0|0),1024,($2|0))|0);
 $4 = ($3|0)==(0|0);
 if ($4) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $5 = (_strtok($0,840)|0);
 $6 = (_strcmp(1424,$5)|0);
 $7 = ($6|0)==(0);
 if ($7) {
  $br$0 = 0;
 } else {
  $8 = (_strcmp(1432,$5)|0);
  $9 = ($8|0)==(0);
  if ($9) {
   $br$0 = 1;
  } else {
   $10 = (_strcmp(1440,$5)|0);
   $11 = ($10|0)==(0);
   if ($11) {
    $br$0 = 2;
   } else {
    $12 = (_strcmp(848,$5)|0);
    $13 = ($12|0)==(0);
    if ($13) {
     $br$0 = 3;
    } else {
     $14 = (_strcmp(1448,$5)|0);
     $15 = ($14|0)==(0);
     if ($15) {
      $br$0 = 4;
     } else {
      $$0 = -2;
      STACKTOP = sp;return ($$0|0);
     }
    }
   }
  }
 }
 $$0 = $br$0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN14REMSimpleModel11readObjFaceEv($this) {
 $this = $this|0;
 var $$phi$trans$insert = 0, $$pre = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0.0, $32 = 0.0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0.0, $41 = 0.0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $7 = 0, $8 = 0, $9 = 0, $cond = 0, $exitcond = 0, $i$01 = 0, $phitmp = 0, $token = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $token = sp;
 $0 = (_strtok(0,840)|0);
 HEAP32[$token>>2] = $0;
 $1 = (_strtok(0,840)|0);
 $2 = (($token) + 4|0);
 HEAP32[$2>>2] = $1;
 $3 = (_strtok(0,840)|0);
 $4 = (($token) + 8|0);
 HEAP32[$4>>2] = $3;
 $5 = (($this) + 4212|0);
 $6 = (($this) + 4220|0);
 $7 = (($this) + 4224|0);
 $8 = (($this) + 8|0);
 $9 = (($this) + 16|0);
 $10 = (($this) + 24|0);
 $11 = (($this) + 4228|0);
 $12 = (($this) + 4232|0);
 $13 = $0;$i$01 = 1;
 while(1) {
  $14 = (_strtok($13,1416)|0);
  $15 = HEAP32[$5>>2]|0;
  $cond = ($15|0)==(0);
  $16 = HEAP32[$6>>2]|0;
  if ($cond) {
   $17 = HEAP32[$7>>2]|0;
   $18 = (($17) + (($16*56)|0)|0);
   $19 = (_atoi($14)|0);
   $20 = (($19) + -1)|0;
   $21 = HEAP32[$8>>2]|0;
   $22 = (($21) + (($20*12)|0)|0);
   ;HEAP32[$18+0>>2]=HEAP32[$22+0>>2]|0;HEAP32[$18+4>>2]=HEAP32[$22+4>>2]|0;HEAP32[$18+8>>2]=HEAP32[$22+8>>2]|0;
   $23 = HEAP32[$6>>2]|0;
   $24 = HEAP32[$7>>2]|0;
   $25 = ((($24) + (($23*56)|0)|0) + 12|0);
   HEAPF32[$25>>2] = 1.0;
   $26 = (_strtok(0,1416)|0);
   $27 = (_atoi($26)|0);
   $28 = (($27) + -1)|0;
   $29 = HEAP32[$9>>2]|0;
   $30 = (($29) + ($28<<3)|0);
   $31 = +HEAPF32[$30>>2];
   $32 = $31 * 65535.0;
   $33 = (~~(($32))&65535);
   $34 = HEAP32[$6>>2]|0;
   $35 = HEAP32[$7>>2]|0;
   $36 = ((($35) + (($34*56)|0)|0) + 32|0);
   HEAP16[$36>>1] = $33;
   $37 = (_atoi($26)|0);
   $38 = (($37) + -1)|0;
   $39 = ((($29) + ($38<<3)|0) + 4|0);
   $40 = +HEAPF32[$39>>2];
   $41 = $40 * 65535.0;
   $42 = (~~(($41))&65535);
   $43 = ((($35) + (($34*56)|0)|0) + 34|0);
   HEAP16[$43>>1] = $42;
   $44 = (_strtok(0,1416)|0);
   $45 = HEAP32[$6>>2]|0;
   $46 = HEAP32[$7>>2]|0;
   $47 = ((($46) + (($45*56)|0)|0) + 16|0);
   $48 = (_atoi($44)|0);
   $49 = (($48) + -1)|0;
   $50 = HEAP32[$10>>2]|0;
   $51 = (($50) + (($49*12)|0)|0);
   ;HEAP32[$47+0>>2]=HEAP32[$51+0>>2]|0;HEAP32[$47+4>>2]=HEAP32[$51+4>>2]|0;HEAP32[$47+8>>2]=HEAP32[$51+8>>2]|0;
   $52 = HEAP32[$6>>2]|0;
   $53 = HEAP32[$7>>2]|0;
   $54 = ((($53) + (($52*56)|0)|0) + 28|0);
   HEAPF32[$54>>2] = 0.0;
   $56 = $52;
  } else {
   $56 = $16;
  }
  $55 = (($56) + 1)|0;
  HEAP32[$6>>2] = $55;
  $57 = HEAP32[$11>>2]|0;
  $58 = $57&65535;
  $59 = HEAP32[$12>>2]|0;
  $60 = (($59) + ($57<<1)|0);
  HEAP16[$60>>1] = $58;
  $61 = (($57) + 1)|0;
  HEAP32[$11>>2] = $61;
  $exitcond = ($i$01|0)==(3);
  if ($exitcond) {
   break;
  }
  $$phi$trans$insert = (($token) + ($i$01<<2)|0);
  $$pre = HEAP32[$$phi$trans$insert>>2]|0;
  $phitmp = (($i$01) + 1)|0;
  $13 = $$pre;$i$01 = $phitmp;
 }
 STACKTOP = sp;return;
}
function __ZN14REMSkinManagerC2Ev($this) {
 $this = $this|0;
 var $vararg_buffer = 0, $vararg_buffer1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 __ZN14REMSkinManager3logEPcz(0,1472,$vararg_buffer);
 ;HEAP32[$this+0>>2]=0|0;HEAP32[$this+4>>2]=0|0;HEAP32[$this+8>>2]=0|0;HEAP32[$this+12>>2]=0|0;HEAP32[$this+16>>2]=0|0;HEAP32[$this+20>>2]=0|0;
 __ZN14REMSkinManager3logEPcz(0,1488,$vararg_buffer1);
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
 (_printf((1592|0),($vararg_buffer|0))|0);
 (_vprintf(($chString|0),($args|0))|0);
 (_putchar(10)|0);
 STACKTOP = sp;return;
}
function __ZN14REMSkinManager7getSkinEj($agg$result,$this,$nSkinID) {
 $agg$result = $agg$result|0;
 $this = $this|0;
 $nSkinID = $nSkinID|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $emptySkin = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $emptySkin = sp;
 $0 = HEAP32[$this>>2]|0;
 $1 = ($0>>>0)>($nSkinID>>>0);
 if ($1) {
  $2 = (($this) + 12|0);
  $3 = HEAP32[$2>>2]|0;
  $4 = (($3) + (($nSkinID*44)|0)|0);
  dest=$agg$result+0|0; src=$4+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
  STACKTOP = sp;return;
 } else {
  dest=$agg$result+0|0; src=$emptySkin+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
  STACKTOP = sp;return;
 }
}
function __ZN14REMSkinManager7addSkinEPK14REMCOLOUR_TYPES2_S2_S2_fPj($this,$pcAmbient,$pcDiffuse,$pcSpecular,$pcEmissive,$fSpecPower,$nSkinID) {
 $this = $this|0;
 $pcAmbient = $pcAmbient|0;
 $pcDiffuse = $pcDiffuse|0;
 $pcSpecular = $pcSpecular|0;
 $pcEmissive = $pcEmissive|0;
 $fSpecPower = +$fSpecPower;
 $nSkinID = $nSkinID|0;
 var $$1 = 0, $$lcssa5 = 0, $$phi$trans$insert14 = 0, $$pre = 0, $$pre13 = 0, $$pre15 = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0.0;
 var $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0;
 var $129 = 0, $13 = 0.0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0;
 var $147 = 0, $148 = 0, $149 = 0, $15 = 0.0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $16 = 0.0, $17 = 0, $18 = 0.0, $19 = 0, $2 = 0, $20 = 0.0, $21 = 0, $22 = 0.0, $23 = 0.0, $24 = 0, $25 = 0.0;
 var $26 = 0, $27 = 0.0, $28 = 0, $29 = 0.0, $3 = 0, $30 = 0.0, $31 = 0, $32 = 0.0, $33 = 0, $34 = 0.0, $35 = 0, $36 = 0.0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0.0;
 var $44 = 0, $45 = 0, $46 = 0.0, $47 = 0, $48 = 0, $49 = 0.0, $5 = 0, $50 = 0, $51 = 0, $52 = 0.0, $53 = 0, $54 = 0, $55 = 0.0, $56 = 0, $57 = 0, $58 = 0.0, $59 = 0, $6 = 0, $60 = 0, $61 = 0.0;
 var $62 = 0, $63 = 0, $64 = 0.0, $65 = 0, $66 = 0, $67 = 0.0, $68 = 0, $69 = 0, $7 = 0, $70 = 0.0, $71 = 0, $72 = 0, $73 = 0.0, $74 = 0, $75 = 0, $76 = 0.0, $77 = 0, $78 = 0, $79 = 0.0, $8 = 0;
 var $80 = 0, $81 = 0, $82 = 0.0, $83 = 0, $84 = 0, $85 = 0.0, $86 = 0, $87 = 0, $88 = 0.0, $89 = 0, $9 = 0.0, $90 = 0, $91 = 0.0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0;
 var $99 = 0, $nMat$07 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = HEAP32[$this>>2]|0;
 $1 = (($0>>>0) % 50)&-1;
 $2 = ($1|0)==(0);
 if ($2) {
  $3 = ($0*44)|0;
  $4 = (($3) + 2200)|0;
  $5 = (($this) + 12|0);
  $6 = HEAP32[$5>>2]|0;
  $7 = (_realloc($6,$4)|0);
  HEAP32[$5>>2] = $7;
  $8 = ($7|0)==(0|0);
  if ($8) {
   $$1 = -1;
   STACKTOP = sp;return ($$1|0);
  }
 }
 $9 = +HEAPF32[$pcAmbient>>2];
 $10 = (($pcAmbient) + 4|0);
 $11 = +HEAPF32[$10>>2];
 $12 = (($pcAmbient) + 8|0);
 $13 = +HEAPF32[$12>>2];
 $14 = (($pcAmbient) + 12|0);
 $15 = +HEAPF32[$14>>2];
 $16 = +HEAPF32[$pcDiffuse>>2];
 $17 = (($pcDiffuse) + 4|0);
 $18 = +HEAPF32[$17>>2];
 $19 = (($pcDiffuse) + 8|0);
 $20 = +HEAPF32[$19>>2];
 $21 = (($pcDiffuse) + 12|0);
 $22 = +HEAPF32[$21>>2];
 $23 = +HEAPF32[$pcEmissive>>2];
 $24 = (($pcEmissive) + 4|0);
 $25 = +HEAPF32[$24>>2];
 $26 = (($pcEmissive) + 8|0);
 $27 = +HEAPF32[$26>>2];
 $28 = (($pcEmissive) + 12|0);
 $29 = +HEAPF32[$28>>2];
 $30 = +HEAPF32[$pcSpecular>>2];
 $31 = (($pcSpecular) + 4|0);
 $32 = +HEAPF32[$31>>2];
 $33 = (($pcSpecular) + 8|0);
 $34 = +HEAPF32[$33>>2];
 $35 = (($pcSpecular) + 12|0);
 $36 = +HEAPF32[$35>>2];
 $37 = (($this) + 4|0);
 $38 = HEAP32[$37>>2]|0;
 $39 = ($38|0)==(0);
 L5: do {
  if ($39) {
   $$lcssa5 = 0;
   label = 24;
  } else {
   $40 = (($this) + 16|0);
   $41 = HEAP32[$40>>2]|0;
   $nMat$07 = 0;
   L7: while(1) {
    $42 = ((($41) + (($nMat$07*68)|0)|0) + 28|0);
    $43 = +HEAPF32[$42>>2];
    $44 = $15 != $43;
    do {
     if (!($44)) {
      $45 = ((($41) + (($nMat$07*68)|0)|0) + 16|0);
      $46 = +HEAPF32[$45>>2];
      $47 = $9 != $46;
      if (!($47)) {
       $48 = ((($41) + (($nMat$07*68)|0)|0) + 20|0);
       $49 = +HEAPF32[$48>>2];
       $50 = $11 != $49;
       if (!($50)) {
        $51 = ((($41) + (($nMat$07*68)|0)|0) + 24|0);
        $52 = +HEAPF32[$51>>2];
        $53 = $13 != $52;
        if (!($53)) {
         $54 = ((($41) + (($nMat$07*68)|0)|0) + 12|0);
         $55 = +HEAPF32[$54>>2];
         $56 = $22 != $55;
         if (!($56)) {
          $57 = (($41) + (($nMat$07*68)|0)|0);
          $58 = +HEAPF32[$57>>2];
          $59 = $16 != $58;
          if (!($59)) {
           $60 = ((($41) + (($nMat$07*68)|0)|0) + 4|0);
           $61 = +HEAPF32[$60>>2];
           $62 = $18 != $61;
           if (!($62)) {
            $63 = ((($41) + (($nMat$07*68)|0)|0) + 8|0);
            $64 = +HEAPF32[$63>>2];
            $65 = $20 != $64;
            if (!($65)) {
             $66 = ((($41) + (($nMat$07*68)|0)|0) + 60|0);
             $67 = +HEAPF32[$66>>2];
             $68 = $29 != $67;
             if (!($68)) {
              $69 = ((($41) + (($nMat$07*68)|0)|0) + 48|0);
              $70 = +HEAPF32[$69>>2];
              $71 = $23 != $70;
              if (!($71)) {
               $72 = ((($41) + (($nMat$07*68)|0)|0) + 52|0);
               $73 = +HEAPF32[$72>>2];
               $74 = $25 != $73;
               if (!($74)) {
                $75 = ((($41) + (($nMat$07*68)|0)|0) + 56|0);
                $76 = +HEAPF32[$75>>2];
                $77 = $27 != $76;
                if (!($77)) {
                 $78 = ((($41) + (($nMat$07*68)|0)|0) + 44|0);
                 $79 = +HEAPF32[$78>>2];
                 $80 = $36 != $79;
                 if (!($80)) {
                  $81 = ((($41) + (($nMat$07*68)|0)|0) + 32|0);
                  $82 = +HEAPF32[$81>>2];
                  $83 = $30 != $82;
                  if (!($83)) {
                   $84 = ((($41) + (($nMat$07*68)|0)|0) + 36|0);
                   $85 = +HEAPF32[$84>>2];
                   $86 = $32 != $85;
                   if (!($86)) {
                    $87 = ((($41) + (($nMat$07*68)|0)|0) + 40|0);
                    $88 = +HEAPF32[$87>>2];
                    $89 = $34 != $88;
                    if ($89) {
                     break;
                    }
                    $90 = ((($41) + (($nMat$07*68)|0)|0) + 64|0);
                    $91 = +HEAPF32[$90>>2];
                    $92 = $91 != $fSpecPower;
                    if (!($92)) {
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
    $93 = (($nMat$07) + 1)|0;
    $94 = ($93>>>0)<($38>>>0);
    if ($94) {
     $nMat$07 = $93;
    } else {
     $$lcssa5 = $38;
     label = 24;
     break L5;
    }
   }
   $95 = HEAP32[$this>>2]|0;
   $96 = (($this) + 12|0);
   $97 = HEAP32[$96>>2]|0;
   $98 = ((($97) + (($95*44)|0)|0) + 4|0);
   HEAP32[$98>>2] = $nMat$07;
   $135 = $97;
  }
 } while(0);
 if ((label|0) == 24) {
  $99 = HEAP32[$this>>2]|0;
  $100 = (($this) + 12|0);
  $101 = HEAP32[$100>>2]|0;
  $102 = ((($101) + (($99*44)|0)|0) + 4|0);
  HEAP32[$102>>2] = $$lcssa5;
  $103 = HEAP32[$37>>2]|0;
  $104 = (($103>>>0) % 50)&-1;
  $105 = ($104|0)==(0);
  do {
   if ($105) {
    $106 = ($103*68)|0;
    $107 = (($106) + 3400)|0;
    $108 = (($this) + 16|0);
    $109 = HEAP32[$108>>2]|0;
    $110 = (_realloc($109,$107)|0);
    HEAP32[$108>>2] = $110;
    $111 = ($110|0)==(0|0);
    if ($111) {
     $$1 = -1;
     STACKTOP = sp;return ($$1|0);
    } else {
     $$pre13 = HEAP32[$37>>2]|0;
     $113 = $110;$114 = $$pre13;
     break;
    }
   } else {
    $$phi$trans$insert14 = (($this) + 16|0);
    $$pre15 = HEAP32[$$phi$trans$insert14>>2]|0;
    $113 = $$pre15;$114 = $103;
   }
  } while(0);
  $112 = (($113) + (($114*68)|0)|0);
  HEAPF32[$112>>2] = $16;
  $115 = ((($113) + (($114*68)|0)|0) + 4|0);
  HEAPF32[$115>>2] = $18;
  $116 = ((($113) + (($114*68)|0)|0) + 8|0);
  HEAPF32[$116>>2] = $20;
  $117 = ((($113) + (($114*68)|0)|0) + 12|0);
  HEAPF32[$117>>2] = $22;
  $118 = ((($113) + (($114*68)|0)|0) + 16|0);
  HEAPF32[$118>>2] = $9;
  $119 = ((($113) + (($114*68)|0)|0) + 20|0);
  HEAPF32[$119>>2] = $11;
  $120 = ((($113) + (($114*68)|0)|0) + 24|0);
  HEAPF32[$120>>2] = $13;
  $121 = ((($113) + (($114*68)|0)|0) + 28|0);
  HEAPF32[$121>>2] = $15;
  $122 = ((($113) + (($114*68)|0)|0) + 32|0);
  HEAPF32[$122>>2] = $30;
  $123 = ((($113) + (($114*68)|0)|0) + 36|0);
  HEAPF32[$123>>2] = $32;
  $124 = ((($113) + (($114*68)|0)|0) + 40|0);
  HEAPF32[$124>>2] = $34;
  $125 = ((($113) + (($114*68)|0)|0) + 44|0);
  HEAPF32[$125>>2] = $36;
  $126 = ((($113) + (($114*68)|0)|0) + 48|0);
  HEAPF32[$126>>2] = $23;
  $127 = ((($113) + (($114*68)|0)|0) + 52|0);
  HEAPF32[$127>>2] = $25;
  $128 = ((($113) + (($114*68)|0)|0) + 56|0);
  HEAPF32[$128>>2] = $27;
  $129 = ((($113) + (($114*68)|0)|0) + 60|0);
  HEAPF32[$129>>2] = $29;
  $130 = ((($113) + (($114*68)|0)|0) + 64|0);
  HEAPF32[$130>>2] = $fSpecPower;
  $131 = HEAP32[$37>>2]|0;
  $132 = (($131) + 1)|0;
  HEAP32[$37>>2] = $132;
  $$pre = HEAP32[$100>>2]|0;
  $135 = $$pre;
 }
 $133 = HEAP32[$this>>2]|0;
 $134 = (($135) + (($133*44)|0)|0);
 HEAP8[$134>>0] = 0;
 $136 = ((($135) + (($133*44)|0)|0) + 8|0);
 HEAP32[$136>>2] = 65535;
 $137 = HEAP32[$this>>2]|0;
 $138 = ((($135) + (($137*44)|0)|0) + 12|0);
 HEAP32[$138>>2] = 65535;
 $139 = HEAP32[$this>>2]|0;
 $140 = ((($135) + (($139*44)|0)|0) + 16|0);
 HEAP32[$140>>2] = 65535;
 $141 = HEAP32[$this>>2]|0;
 $142 = ((($135) + (($141*44)|0)|0) + 20|0);
 HEAP32[$142>>2] = 65535;
 $143 = HEAP32[$this>>2]|0;
 $144 = ((($135) + (($143*44)|0)|0) + 24|0);
 HEAP32[$144>>2] = 65535;
 $145 = HEAP32[$this>>2]|0;
 $146 = ((($135) + (($145*44)|0)|0) + 28|0);
 HEAP32[$146>>2] = 65535;
 $147 = HEAP32[$this>>2]|0;
 $148 = ((($135) + (($147*44)|0)|0) + 32|0);
 HEAP32[$148>>2] = 65535;
 $149 = HEAP32[$this>>2]|0;
 $150 = ((($135) + (($149*44)|0)|0) + 36|0);
 HEAP32[$150>>2] = 65535;
 $151 = HEAP32[$this>>2]|0;
 HEAP32[$nSkinID>>2] = $151;
 $152 = HEAP32[$this>>2]|0;
 HEAP32[$vararg_buffer>>2] = $152;
 __ZN14REMSkinManager3logEPcz(0,1504,$vararg_buffer);
 $153 = HEAP32[$this>>2]|0;
 $154 = (($153) + 1)|0;
 HEAP32[$this>>2] = $154;
 $$1 = 0;
 STACKTOP = sp;return ($$1|0);
}
function __ZN14REMSkinManager10addTextureEjPKcbfP14REMCOLOUR_TYPEj($this,$nSkinID,$chName,$bAlpha,$fAlpha,$cColourKeys,$dwNumColourKeys) {
 $this = $this|0;
 $nSkinID = $nSkinID|0;
 $chName = $chName|0;
 $bAlpha = $bAlpha|0;
 $fAlpha = +$fAlpha;
 $cColourKeys = $cColourKeys|0;
 $dwNumColourKeys = $dwNumColourKeys|0;
 var $$0 = 0, $$arith = 0, $$overflow = 0, $$pre = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0;
 var $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $8 = 0;
 var $9 = 0, $i$02 = 0, $nTex$04 = 0, $or$cond = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $0 = HEAP32[$this>>2]|0;
 $1 = ($0>>>0)>($nSkinID>>>0);
 if (!($1)) {
  $$0 = -2;
  STACKTOP = sp;return ($$0|0);
 }
 $2 = (($this) + 12|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = ((($3) + (($nSkinID*44)|0)|0) + 36|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = ($5|0)==(65535);
 if (!($6)) {
  __ZN14REMSkinManager3logEPcz(0,1536,$vararg_buffer);
  $$0 = -3;
  STACKTOP = sp;return ($$0|0);
 }
 $7 = (($this) + 8|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = ($8|0)==(0);
 if ($9) {
  $21 = 0;
  label = 8;
 } else {
  $10 = (($this) + 20|0);
  $11 = HEAP32[$10>>2]|0;
  $nTex$04 = 0;
  while(1) {
   $12 = ((($11) + (($nTex$04*20)|0)|0) + 4|0);
   $13 = HEAP32[$12>>2]|0;
   $14 = (_strcmp($chName,$13)|0);
   $15 = ($14|0)!=(0);
   $16 = (($nTex$04) + 1)|0;
   $17 = ($16>>>0)<($8>>>0);
   $or$cond = $15 & $17;
   if ($or$cond) {
    $nTex$04 = $16;
   } else {
    break;
   }
  }
  $18 = (($8>>>0) % 50)&-1;
  $19 = ($18|0)==(0);
  if ($19) {
   $21 = $8;
   label = 8;
  }
 }
 if ((label|0) == 8) {
  $20 = ($21*20)|0;
  $22 = (($20) + 1000)|0;
  $23 = (($this) + 20|0);
  $24 = HEAP32[$23>>2]|0;
  $25 = (_realloc($24,$22)|0);
  HEAP32[$23>>2] = $25;
  $26 = ($25|0)==(0|0);
  if ($26) {
   $$0 = -1;
   STACKTOP = sp;return ($$0|0);
  }
 }
 if ($bAlpha) {
  $27 = HEAP32[$2>>2]|0;
  $28 = (($27) + (($nSkinID*44)|0)|0);
  HEAP8[$28>>0] = 1;
  $29 = HEAP32[$7>>2]|0;
  $30 = (($this) + 20|0);
  $31 = HEAP32[$30>>2]|0;
  $32 = (($31) + (($29*20)|0)|0);
  HEAPF32[$32>>2] = $fAlpha;
  $39 = $31;$40 = $29;
 } else {
  $33 = HEAP32[$7>>2]|0;
  $34 = (($this) + 20|0);
  $35 = HEAP32[$34>>2]|0;
  $36 = (($35) + (($33*20)|0)|0);
  HEAPF32[$36>>2] = 1.0;
  $39 = $35;$40 = $33;
 }
 $37 = (($this) + 20|0);
 $38 = ((($39) + (($40*20)|0)|0) + 12|0);
 HEAP32[$38>>2] = 0;
 $41 = (_strlen(($chName|0))|0);
 $42 = (($41) + 1)|0;
 $43 = (__Znaj($42)|0);
 $44 = HEAP32[$37>>2]|0;
 $45 = ((($44) + (($40*20)|0)|0) + 4|0);
 HEAP32[$45>>2] = $43;
 $46 = HEAP32[$37>>2]|0;
 $47 = ((($46) + (($40*20)|0)|0) + 4|0);
 $48 = HEAP32[$47>>2]|0;
 $49 = (_strlen(($chName|0))|0);
 $50 = (($49) + 1)|0;
 _memcpy(($48|0),($chName|0),($50|0))|0;
 $51 = HEAP32[$7>>2]|0;
 $52 = HEAP32[$37>>2]|0;
 $53 = ((($52) + (($51*20)|0)|0) + 16|0);
 HEAP32[$53>>2] = $dwNumColourKeys;
 $54 = ($dwNumColourKeys|0)==(0);
 if ($54) {
  $65 = $52;
 } else {
  $$arith = $dwNumColourKeys<<4;
  $$overflow = ($dwNumColourKeys>>>0)>(268435455);
  $55 = $$overflow ? -1 : $$arith;
  $56 = (__Znaj($55)|0);
  $57 = HEAP32[$7>>2]|0;
  $58 = ((($52) + (($57*20)|0)|0) + 12|0);
  HEAP32[$58>>2] = $56;
  $59 = HEAP32[$37>>2]|0;
  $60 = ((($59) + (($57*20)|0)|0) + 12|0);
  $61 = HEAP32[$60>>2]|0;
  $62 = $dwNumColourKeys << 4;
  _memcpy(($61|0),($cColourKeys|0),($62|0))|0;
  $$pre = HEAP32[$37>>2]|0;
  $65 = $$pre;
 }
 $63 = HEAP32[$7>>2]|0;
 $64 = (($65) + (($63*20)|0)|0);
 $66 = (__ZN14REMSkinManager13createTextureEP15REMTEXTURE_TYPEb(0,$64,0)|0);
 $67 = ($66|0)<(0);
 if ($67) {
  $$0 = $66;
  STACKTOP = sp;return ($$0|0);
 }
 $68 = HEAP32[$7>>2]|0;
 $69 = (($68) + 1)|0;
 HEAP32[$7>>2] = $69;
 $70 = HEAP32[$2>>2]|0;
 $i$02 = 0;
 while(1) {
  $73 = (((($70) + (($nSkinID*44)|0)|0) + ($i$02<<2)|0) + 8|0);
  $74 = HEAP32[$73>>2]|0;
  $75 = ($74|0)==(65535);
  $72 = (($i$02) + 1)|0;
  if ($75) {
   break;
  }
  $71 = ($72|0)<(8);
  if ($71) {
   $i$02 = $72;
  } else {
   $$0 = 0;
   label = 19;
   break;
  }
 }
 if ((label|0) == 19) {
  STACKTOP = sp;return ($$0|0);
 }
 HEAP32[$73>>2] = $68;
 $76 = ((($70) + (($nSkinID*44)|0)|0) + 40|0);
 HEAP32[$76>>2] = $72;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN14REMSkinManager13createTextureEP15REMTEXTURE_TYPEb($this,$pTexture,$bAlpha) {
 $this = $this|0;
 $pTexture = $pTexture|0;
 $bAlpha = $bAlpha|0;
 var $$ = 0, $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0.0, $13 = 0.0, $14 = 0, $15 = 0, $16 = 0.0, $17 = 0.0, $18 = 0, $19 = 0, $2 = 0, $20 = 0.0, $21 = 0.0, $22 = 0, $23 = 0, $24 = 0.0;
 var $25 = 0.0, $26 = 0, $27 = 0, $28 = 0, $29 = 0.0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $dw$02 = 0, $hr$0$lcssa = 0, $texID = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $texID = sp;
 $0 = (($pTexture) + 4|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (__Z15rawImageFromBMPPKc($1)|0);
 if ($bAlpha) {
  $3 = (($pTexture) + 16|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = ($4|0)==(0);
  L3: do {
   if ($5) {
    $hr$0$lcssa = 0;
   } else {
    $6 = (($pTexture) + 12|0);
    $dw$02 = 0;
    while(1) {
     $10 = HEAP32[$6>>2]|0;
     $11 = (($10) + ($dw$02<<4)|0);
     $12 = +HEAPF32[$11>>2];
     $13 = $12 * 255.0;
     $14 = (~~(($13))&255);
     $15 = ((($10) + ($dw$02<<4)|0) + 4|0);
     $16 = +HEAPF32[$15>>2];
     $17 = $16 * 255.0;
     $18 = (~~(($17))&255);
     $19 = ((($10) + ($dw$02<<4)|0) + 8|0);
     $20 = +HEAPF32[$19>>2];
     $21 = $20 * 255.0;
     $22 = (~~(($21))&255);
     $23 = ((($10) + ($dw$02<<4)|0) + 12|0);
     $24 = +HEAPF32[$23>>2];
     $25 = $24 * 255.0;
     $26 = (~~(($25))&255);
     $27 = (__Z14setAlphaKeyRawP16REMRAWIMAGE_TYPEhhhh($2,$14,$18,$22,$26)|0);
     $28 = ($27|0)<(0);
     $9 = (($dw$02) + 1)|0;
     if ($28) {
      $$0 = $27;
      break;
     }
     $7 = HEAP32[$3>>2]|0;
     $8 = ($9>>>0)<($7>>>0);
     if ($8) {
      $dw$02 = $9;
     } else {
      $hr$0$lcssa = $27;
      break L3;
     }
    }
    STACKTOP = sp;return ($$0|0);
   }
  } while(0);
  $29 = +HEAPF32[$pTexture>>2];
  $30 = $29 < 1.0;
  if ($30) {
   $31 = ($hr$0$lcssa|0)<(0);
   if ($31) {
    $$0 = $hr$0$lcssa;
    STACKTOP = sp;return ($$0|0);
   }
  }
 }
 _glGenTextures(1,($texID|0));
 $32 = HEAP32[$texID>>2]|0;
 $33 = ($32|0)==(0);
 if ($33) {
  $$0 = -4;
  STACKTOP = sp;return ($$0|0);
 }
 _glBindTexture(3553,($32|0));
 $34 = (($2) + 8|0);
 $35 = HEAP32[$34>>2]|0;
 $36 = HEAP32[$2>>2]|0;
 $37 = (($2) + 4|0);
 $38 = HEAP32[$37>>2]|0;
 $39 = (($2) + 12|0);
 $40 = HEAP32[$39>>2]|0;
 $41 = (($2) + 16|0);
 $42 = HEAP32[$41>>2]|0;
 _glTexImage2D(3553,0,($35|0),($36|0),($38|0),0,6408,($40|0),($42|0));
 _glTexParameteri(3553,10241,9987);
 _glTexParameteri(3553,10240,9729);
 _glGenerateMipmap(3553);
 _glBindTexture(3553,0);
 $43 = (__Znaj(4)|0);
 $44 = (($pTexture) + 8|0);
 HEAP32[$44>>2] = $43;
 $45 = HEAP8[$texID>>0]|0;
 HEAP8[$43>>0] = $45;
 $46 = ($43|0)==(0|0);
 $$ = $46 << 31 >> 31;
 $$0 = $$;
 STACKTOP = sp;return ($$0|0);
}
function __ZN21REMVertexCacheManagerC2EP15REMRenderDevicejj($this,$r,$nMaxVerts,$nMaxIndis) {
 $this = $this|0;
 $r = $r|0;
 $nMaxVerts = $nMaxVerts|0;
 $nMaxIndis = $nMaxIndis|0;
 var $$0 = 0, $$01 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0;
 var $8 = 0, $80 = 0, $9 = 0, $i$015 = 0, $indvars$iv = 0, $indvars$iv$next = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $0 = (($this) + 4|0);
 HEAP32[$0>>2] = $r;
 $1 = (($this) + 8|0);
 HEAP32[$1>>2] = 0;
 $2 = (($this) + 12|0);
 HEAP32[$2>>2] = 0;
 $3 = (($this) + 416|0);
 HEAP16[$3>>1] = -1;
 $4 = (($this) + 418|0);
 HEAP16[$4>>1] = -1;
 __ZN21REMVertexCacheManager3logEPcz(0,1608,$vararg_buffer);
 $5 = ($nMaxVerts*56)|0;
 $6 = $nMaxIndis << 1;
 $7 = ($nMaxVerts*36)|0;
 $i$015 = 0;$indvars$iv = 1;
 while(1) {
  $8 = (__Znwj(100)|0);
  __THREW__ = 0;
  $9 = (invoke_ii(26,($r|0))|0);
  $10 = __THREW__; __THREW__ = 0;
  $11 = $10&1;
  if ($11) {
   label = 15;
   break;
  }
  $12 = (($indvars$iv) + 1)|0;
  HEAP32[$8>>2] = -1;
  $13 = (($8) + 4|0);
  HEAP32[$13>>2] = -1;
  $14 = (($8) + 20|0);
  HEAP32[$14>>2] = $9;
  $15 = (($8) + 12|0);
  HEAP32[$15>>2] = 0;
  $16 = (($8) + 24|0);
  HEAP32[$16>>2] = $this;
  $17 = (($8) + 80|0);
  HEAP32[$17>>2] = $nMaxVerts;
  $18 = (($8) + 84|0);
  HEAP32[$18>>2] = $nMaxIndis;
  $19 = (($8) + 88|0);
  HEAP32[$19>>2] = 0;
  $20 = (($8) + 92|0);
  HEAP32[$20>>2] = 0;
  $21 = (($8) + 76|0);
  HEAP32[$21>>2] = $indvars$iv;
  $22 = (($8) + 96|0);
  HEAP32[$22>>2] = 56;
  $23 = (($8) + 28|0);
  dest=$23+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=4294967295|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
  $24 = (($8) + 72|0);
  HEAP32[$24>>2] = 65535;
  __THREW__ = 0;
  invoke_vii(27,2,($8|0));
  $25 = __THREW__; __THREW__ = 0;
  $26 = $25&1;
  if ($26) {
   label = 15;
   break;
  }
  $27 = HEAP32[$8>>2]|0;
  __THREW__ = 0;
  invoke_vii(28,34962,($27|0));
  $28 = __THREW__; __THREW__ = 0;
  $29 = $28&1;
  if ($29) {
   label = 15;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(29,34962,($5|0),(0|0),35048);
  $30 = __THREW__; __THREW__ = 0;
  $31 = $30&1;
  if ($31) {
   label = 15;
   break;
  }
  $32 = HEAP32[$13>>2]|0;
  __THREW__ = 0;
  invoke_vii(28,34963,($32|0));
  $33 = __THREW__; __THREW__ = 0;
  $34 = $33&1;
  if ($34) {
   label = 15;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(29,34963,($6|0),(0|0),35048);
  $35 = __THREW__; __THREW__ = 0;
  $36 = $35&1;
  if ($36) {
   label = 15;
   break;
  }
  $37 = (_malloc($5)|0);
  $38 = (($8) + 8|0);
  HEAP32[$38>>2] = $37;
  $39 = (_malloc($6)|0);
  $40 = (($8) + 16|0);
  HEAP32[$40>>2] = $39;
  $41 = ((($this) + ($i$015<<2)|0) + 16|0);
  HEAP32[$41>>2] = $8;
  $42 = (__Znwj(100)|0);
  __THREW__ = 0;
  $43 = (invoke_ii(26,($r|0))|0);
  $44 = __THREW__; __THREW__ = 0;
  $45 = $44&1;
  if ($45) {
   label = 16;
   break;
  }
  HEAP32[$42>>2] = -1;
  $46 = (($42) + 4|0);
  HEAP32[$46>>2] = -1;
  $47 = (($42) + 20|0);
  HEAP32[$47>>2] = $43;
  $48 = (($42) + 12|0);
  HEAP32[$48>>2] = 1;
  $49 = (($42) + 24|0);
  HEAP32[$49>>2] = $this;
  $50 = (($42) + 80|0);
  HEAP32[$50>>2] = $nMaxVerts;
  $51 = (($42) + 84|0);
  HEAP32[$51>>2] = $nMaxIndis;
  $52 = (($42) + 88|0);
  HEAP32[$52>>2] = 0;
  $53 = (($42) + 92|0);
  HEAP32[$53>>2] = 0;
  $54 = (($42) + 76|0);
  HEAP32[$54>>2] = $12;
  $55 = (($42) + 96|0);
  HEAP32[$55>>2] = 36;
  $56 = (($42) + 28|0);
  dest=$56+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=4294967295|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
  $57 = (($42) + 72|0);
  HEAP32[$57>>2] = 65535;
  __THREW__ = 0;
  invoke_vii(27,2,($42|0));
  $58 = __THREW__; __THREW__ = 0;
  $59 = $58&1;
  if ($59) {
   label = 16;
   break;
  }
  $60 = HEAP32[$42>>2]|0;
  __THREW__ = 0;
  invoke_vii(28,34962,($60|0));
  $61 = __THREW__; __THREW__ = 0;
  $62 = $61&1;
  if ($62) {
   label = 16;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(29,34962,($7|0),(0|0),35048);
  $63 = __THREW__; __THREW__ = 0;
  $64 = $63&1;
  if ($64) {
   label = 16;
   break;
  }
  $65 = HEAP32[$46>>2]|0;
  __THREW__ = 0;
  invoke_vii(28,34963,($65|0));
  $66 = __THREW__; __THREW__ = 0;
  $67 = $66&1;
  if ($67) {
   label = 16;
   break;
  }
  __THREW__ = 0;
  invoke_viiii(29,34963,($6|0),(0|0),35048);
  $68 = __THREW__; __THREW__ = 0;
  $69 = $68&1;
  if ($69) {
   label = 16;
   break;
  }
  $70 = (_malloc($7)|0);
  $71 = (($42) + 8|0);
  HEAP32[$71>>2] = $70;
  $72 = (_malloc($6)|0);
  $73 = (($42) + 16|0);
  HEAP32[$73>>2] = $72;
  $indvars$iv$next = (($indvars$iv) + 2)|0;
  $74 = ((($this) + ($i$015<<2)|0) + 216|0);
  HEAP32[$74>>2] = $42;
  $75 = (($i$015) + 1)|0;
  $76 = ($75|0)<(50);
  if ($76) {
   $i$015 = $75;$indvars$iv = $indvars$iv$next;
  } else {
   label = 17;
   break;
  }
 }
 if ((label|0) == 15) {
  $77 = ___cxa_find_matching_catch()|0;
  $78 = tempRet0;
  __ZdlPv($8);
  $$0 = $78;$$01 = $77;
  ___resumeException($$01|0);
  // unreachable;
 }
 else if ((label|0) == 16) {
  $79 = ___cxa_find_matching_catch()|0;
  $80 = tempRet0;
  __ZdlPv($42);
  $$0 = $80;$$01 = $79;
  ___resumeException($$01|0);
  // unreachable;
 }
 else if ((label|0) == 17) {
  __ZN21REMVertexCacheManager3logEPcz(0,1640,$vararg_buffer1);
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
 (_printf((1648|0),($vararg_buffer|0))|0);
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
 var $$0 = 0, $$pCacheEmpty$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $i$09 = 0, $pCache$0 = 0, $pCacheEmpty$07 = 0, $pCacheFullest$08 = 0, $pCacheFullest$1 = 0, $tmpSkin$i = 0, $tmpSkin$i1 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $tmpSkin$i1 = sp + 44|0;
 $tmpSkin$i = sp;
 if ((($vertexFormat|0) == 1)) {
  $1 = (($this) + 216|0);
  $pCache$0 = $1;
 } else if ((($vertexFormat|0) == 0)) {
  $0 = (($this) + 16|0);
  $pCache$0 = $0;
 } else {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $2 = (($this) + 418|0);
 HEAP16[$2>>1] = -1;
 $i$09 = 0;$pCacheEmpty$07 = 0;$pCacheFullest$08 = 0;
 while(1) {
  $3 = (($pCache$0) + ($i$09<<2)|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = (($4) + 72|0);
  $6 = HEAP32[$5>>2]|0;
  $7 = ($6|0)==($skinID|0);
  if ($7) {
   label = 6;
   break;
  }
  $9 = (($4) + 88|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = ($10|0)==(0);
  $$pCacheEmpty$0 = $11 ? $4 : $pCacheEmpty$07;
  $12 = (($pCacheFullest$08) + 88|0);
  $13 = HEAP32[$12>>2]|0;
  $14 = ($10|0)>($13|0);
  $pCacheFullest$1 = $14 ? $4 : $pCacheFullest$08;
  $15 = (($i$09) + 1)|0;
  $16 = ($15|0)<(50);
  if ($16) {
   $i$09 = $15;$pCacheEmpty$07 = $$pCacheEmpty$0;$pCacheFullest$08 = $pCacheFullest$1;
  } else {
   break;
  }
 }
 if ((label|0) == 6) {
  $8 = (__ZN14REMVertexCache3addEjjPvPKt($4,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $$0 = $8;
  STACKTOP = sp;return ($$0|0);
 }
 $17 = ($$pCacheEmpty$0|0)==(0|0);
 if ($17) {
  (__ZN14REMVertexCache5flushEv($pCacheFullest$1)|0);
  $31 = (($pCacheFullest$1) + 72|0);
  $32 = HEAP32[$31>>2]|0;
  $33 = ($32|0)==($skinID|0);
  if (!($33)) {
   $34 = (($pCacheFullest$1) + 20|0);
   $35 = HEAP32[$34>>2]|0;
   __ZN14REMSkinManager7getSkinEj($tmpSkin$i,$35,$skinID);
   $36 = (($pCacheFullest$1) + 88|0);
   $37 = HEAP32[$36>>2]|0;
   $38 = ($37|0)==(0);
   if (!($38)) {
    (__ZN14REMVertexCache5flushEv($pCacheFullest$1)|0);
   }
   $39 = (($pCacheFullest$1) + 28|0);
   dest=$39+0|0; src=$tmpSkin$i+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
   HEAP32[$31>>2] = $skinID;
   $40 = (($pCacheFullest$1) + 24|0);
   $41 = HEAP32[$40>>2]|0;
   $42 = (($41) + 416|0);
   HEAP16[$42>>1] = -1;
  }
  $43 = (__ZN14REMVertexCache3addEjjPvPKt($pCacheFullest$1,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $$0 = $43;
  STACKTOP = sp;return ($$0|0);
 } else {
  $18 = (($$pCacheEmpty$0) + 72|0);
  $19 = HEAP32[$18>>2]|0;
  $20 = ($19|0)==($skinID|0);
  if (!($20)) {
   $21 = (($$pCacheEmpty$0) + 20|0);
   $22 = HEAP32[$21>>2]|0;
   __ZN14REMSkinManager7getSkinEj($tmpSkin$i1,$22,$skinID);
   $23 = (($$pCacheEmpty$0) + 88|0);
   $24 = HEAP32[$23>>2]|0;
   $25 = ($24|0)==(0);
   if (!($25)) {
    (__ZN14REMVertexCache5flushEv($$pCacheEmpty$0)|0);
   }
   $26 = (($$pCacheEmpty$0) + 28|0);
   dest=$26+0|0; src=$tmpSkin$i1+0|0; stop=dest+44|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
   HEAP32[$18>>2] = $skinID;
   $27 = (($$pCacheEmpty$0) + 24|0);
   $28 = HEAP32[$27>>2]|0;
   $29 = (($28) + 416|0);
   HEAP16[$29>>1] = -1;
  }
  $30 = (__ZN14REMVertexCache3addEjjPvPKt($$pCacheEmpty$0,$nVerts,$nIndis,$pVerts,$pIndis)|0);
  $$0 = $30;
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function __ZN14REMVertexCache3addEjjPvPKt($this,$nVerts,$nIndis,$pVerts,$pIndices) {
 $this = $this|0;
 $nVerts = $nVerts|0;
 $nIndis = $nIndis|0;
 $pVerts = $pVerts|0;
 $pIndices = $pIndices|0;
 var $$0 = 0, $$lcssa = 0, $$pre = 0, $$promoted = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $exitcond = 0, $exitcond5 = 0, $i$02 = 0, $i$02$us = 0, $nIndis$nVerts = 0, $nPosI$0 = 0;
 var $nPosV$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($this) + 96|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = Math_imul($1, $nVerts)|0;
 $3 = (($this) + 80|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($4>>>0)<($nVerts>>>0);
 if ($5) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $6 = (($this) + 84|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = ($7>>>0)<($nIndis>>>0);
 if ($8) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $9 = (($this) + 88|0);
 $10 = HEAP32[$9>>2]|0;
 $11 = (($10) + ($nVerts))|0;
 $12 = ($11>>>0)>($4>>>0);
 if ($12) {
  label = 5;
 } else {
  $13 = (($this) + 92|0);
  $14 = HEAP32[$13>>2]|0;
  $15 = (($14) + ($nIndis))|0;
  $16 = ($15>>>0)>($7>>>0);
  if ($16) {
   label = 5;
  } else {
   $20 = $10;
  }
 }
 do {
  if ((label|0) == 5) {
   $17 = (__ZN14REMVertexCache5flushEv($this)|0);
   $18 = ($17|0)==(0);
   if ($18) {
    $$pre = HEAP32[$9>>2]|0;
    $20 = $$pre;
    break;
   } else {
    $$0 = -1;
    STACKTOP = sp;return ($$0|0);
   }
  }
 } while(0);
 $19 = ($20|0)==(0);
 if ($19) {
  $nPosI$0 = 0;$nPosV$0 = 0;
 } else {
  $21 = HEAP32[$0>>2]|0;
  $22 = Math_imul($21, $20)|0;
  $23 = (($this) + 92|0);
  $24 = HEAP32[$23>>2]|0;
  $25 = $24 << 1;
  $nPosI$0 = $25;$nPosV$0 = $22;
 }
 $26 = (($this) + 8|0);
 $27 = HEAP32[$26>>2]|0;
 $28 = (($27) + ($nPosV$0)|0);
 _memcpy(($28|0),($pVerts|0),($2|0))|0;
 $29 = HEAP32[$9>>2]|0;
 $30 = ($pIndices|0)!=(0|0);
 $nIndis$nVerts = $30 ? $nIndis : $nVerts;
 $31 = ($nIndis$nVerts|0)==(0);
 if (!($31)) {
  $32 = (($this) + 16|0);
  $33 = (($this) + 92|0);
  $$promoted = HEAP32[$33>>2]|0;
  if ($30) {
   $i$02$us = 0;
   while(1) {
    $34 = (($pIndices) + ($i$02$us<<1)|0);
    $35 = HEAP16[$34>>1]|0;
    $36 = $35&65535;
    $37 = (($36) + ($29))|0;
    $38 = $37&65535;
    $39 = (($i$02$us) + ($nPosI$0))|0;
    $40 = HEAP32[$32>>2]|0;
    $41 = (($40) + ($39<<1)|0);
    HEAP16[$41>>1] = $38;
    $42 = (($i$02$us) + 1)|0;
    $exitcond5 = ($42|0)==($nIndis$nVerts|0);
    if ($exitcond5) {
     break;
    } else {
     $i$02$us = $42;
    }
   }
  } else {
   $i$02 = 0;
   while(1) {
    $43 = (($i$02) + ($29))|0;
    $44 = $43&65535;
    $45 = (($i$02) + ($nPosI$0))|0;
    $46 = HEAP32[$32>>2]|0;
    $47 = (($46) + ($45<<1)|0);
    HEAP16[$47>>1] = $44;
    $48 = (($i$02) + 1)|0;
    $exitcond = ($48|0)==($nIndis$nVerts|0);
    if ($exitcond) {
     break;
    } else {
     $i$02 = $48;
    }
   }
  }
  $$lcssa = (($nIndis$nVerts) + ($$promoted))|0;
  HEAP32[$33>>2] = $$lcssa;
 }
 $49 = (($29) + ($nVerts))|0;
 HEAP32[$9>>2] = $49;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN14REMVertexCache5flushEv($this) {
 $this = $this|0;
 var $$0 = 0, $$pre = 0, $$pre$phiZ2D = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0;
 var $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0;
 var $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0;
 var $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0;
 var $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0;
 var $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0.0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0;
 var $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $clrWire = 0, $i$01 = 0, $texUniformStr = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $vararg_buffer = sp;
 $texUniformStr = sp + 24|0;
 $clrWire = sp + 8|0;
 $0 = (($this) + 24|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (($1) + 4|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = (__ZN15REMRenderDevice16getShaderManagerEv($3)|0);
 $5 = (__ZN16REMShaderManager16getActiveProgramEv($4)|0);
 $6 = (($this) + 88|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = ($7|0)==(0);
 if ($8) {
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $9 = HEAP32[$0>>2]|0;
 $10 = (($9) + 416|0);
 $11 = HEAP16[$10>>1]|0;
 $12 = $11&65535;
 $13 = (($this) + 76|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = ($12|0)==($14|0);
 if ($15) {
  $53 = $9;
 } else {
  $16 = HEAP32[$this>>2]|0;
  _glBindBuffer(34962,($16|0));
  $17 = (($this) + 12|0);
  $18 = HEAP32[$17>>2]|0;
  if ((($18|0) == 1)) {
   $29 = (_glGetAttribLocation(($5|0),(1672|0))|0);
   _glVertexAttribPointer(($29|0),4,5126,0,36,(0|0));
   $30 = (_glGetAttribLocation(($5|0),(1672|0))|0);
   _glEnableVertexAttribArray(($30|0));
   $31 = (_glGetAttribLocation(($5|0),(1744|0))|0);
   _glVertexAttribPointer(($31|0),4,5126,0,36,((16)|0));
   $32 = (_glGetAttribLocation(($5|0),(1744|0))|0);
   _glEnableVertexAttribArray(($32|0));
   $33 = (_glGetAttribLocation(($5|0),(1696|0))|0);
   _glVertexAttribPointer(($33|0),2,5123,1,36,((32)|0));
   $34 = (_glGetAttribLocation(($5|0),(1696|0))|0);
   _glEnableVertexAttribArray(($34|0));
  } else if ((($18|0) == 0)) {
   $19 = (_glGetAttribLocation(($5|0),(1672|0))|0);
   _glVertexAttribPointer(($19|0),4,5126,0,56,(0|0));
   $20 = (_glGetAttribLocation(($5|0),(1672|0))|0);
   _glEnableVertexAttribArray(($20|0));
   $21 = (_glGetAttribLocation(($5|0),(1688|0))|0);
   _glVertexAttribPointer(($21|0),4,5126,0,56,((16)|0));
   $22 = (_glGetAttribLocation(($5|0),(1688|0))|0);
   _glEnableVertexAttribArray(($22|0));
   $23 = (_glGetAttribLocation(($5|0),(1696|0))|0);
   _glVertexAttribPointer(($23|0),2,5123,1,56,((32)|0));
   $24 = (_glGetAttribLocation(($5|0),(1696|0))|0);
   _glEnableVertexAttribArray(($24|0));
   $25 = (_glGetAttribLocation(($5|0),(1712|0))|0);
   _glVertexAttribPointer(($25|0),2,5123,1,56,((36)|0));
   $26 = (_glGetAttribLocation(($5|0),(1712|0))|0);
   _glEnableVertexAttribArray(($26|0));
   $27 = (_glGetAttribLocation(($5|0),(1728|0))|0);
   _glVertexAttribPointer(($27|0),4,5126,0,56,((40)|0));
   $28 = (_glGetAttribLocation(($5|0),(1728|0))|0);
   _glEnableVertexAttribArray(($28|0));
  } else {
   $$0 = -1;
   STACKTOP = sp;return ($$0|0);
  }
  $35 = HEAP32[$6>>2]|0;
  $36 = (($this) + 96|0);
  $37 = HEAP32[$36>>2]|0;
  $38 = Math_imul($37, $35)|0;
  $39 = (($this) + 8|0);
  $40 = HEAP32[$39>>2]|0;
  _glBufferSubData(34962,0,($38|0),($40|0));
  $41 = (($this) + 4|0);
  $42 = HEAP32[$41>>2]|0;
  _glBindBuffer(34963,($42|0));
  $43 = (($this) + 92|0);
  $44 = HEAP32[$43>>2]|0;
  $45 = $44 << 1;
  $46 = (($this) + 16|0);
  $47 = HEAP32[$46>>2]|0;
  _glBufferSubData(34963,0,($45|0),($47|0));
  $48 = HEAP32[$0>>2]|0;
  $49 = HEAP32[$13>>2]|0;
  $50 = $49&65535;
  $51 = (($48) + 416|0);
  HEAP16[$51>>1] = $50;
  $53 = $48;
 }
 $52 = (($53) + 4|0);
 $54 = HEAP32[$52>>2]|0;
 $55 = (__ZN15REMRenderDevice15getActiveSkinIDEv($54)|0);
 $56 = (($this) + 72|0);
 $57 = HEAP32[$56>>2]|0;
 $58 = ($55|0)==($57|0);
 if (!($58)) {
  $59 = (($this) + 32|0);
  $60 = HEAP32[$59>>2]|0;
  $61 = (($this) + 20|0);
  $62 = HEAP32[$61>>2]|0;
  $63 = (($62) + 16|0);
  $64 = HEAP32[$63>>2]|0;
  $65 = HEAP32[$0>>2]|0;
  $66 = (($65) + 4|0);
  $67 = HEAP32[$66>>2]|0;
  $68 = (__ZN15REMRenderDevice12getShadeModeEv($67)|0);
  $69 = ($68|0)==(7);
  L14: do {
   if ($69) {
    $97 = HEAP32[$0>>2]|0;
    $98 = (($97) + 4|0);
    $99 = HEAP32[$98>>2]|0;
    $100 = (($99) + 1132|0);
    ;HEAP32[$clrWire+0>>2]=HEAP32[$100+0>>2]|0;HEAP32[$clrWire+4>>2]=HEAP32[$100+4>>2]|0;HEAP32[$clrWire+8>>2]=HEAP32[$100+8>>2]|0;HEAP32[$clrWire+12>>2]=HEAP32[$100+12>>2]|0;
    $101 = (_glGetUniformLocation(($5|0),(1752|0))|0);
    _glUniform4fv(($101|0),1,($clrWire|0));
    $102 = (_glGetUniformLocation(($5|0),(1768|0))|0);
    _glUniform4fv(($102|0),1,($clrWire|0));
    HEAPF32[$clrWire>>2] = 0.0;
    $103 = (($clrWire) + 4|0);
    HEAPF32[$103>>2] = 0.0;
    $104 = (($clrWire) + 8|0);
    HEAPF32[$104>>2] = 0.0;
    $105 = (($clrWire) + 12|0);
    HEAPF32[$105>>2] = 1.0;
    $106 = (_glGetUniformLocation(($5|0),(1784|0))|0);
    _glUniform4fv(($106|0),1,($clrWire|0));
    $107 = (_glGetUniformLocation(($5|0),(1800|0))|0);
    _glUniform4fv(($107|0),1,($clrWire|0));
    $108 = (_glGetUniformLocation(($5|0),(1816|0))|0);
    _glUniform1f(($108|0),1.0);
    _glActiveTexture(33984);
    _glBindTexture(3553,0);
    $109 = (_glGetUniformLocation(($5|0),(1864|0))|0);
    _glUniform1i(($109|0),0);
   } else {
    $70 = (_glGetUniformLocation(($5|0),(1752|0))|0);
    $71 = (($64) + (($60*68)|0)|0);
    _glUniform4fv(($70|0),1,($71|0));
    $72 = (_glGetUniformLocation(($5|0),(1768|0))|0);
    $73 = ((($64) + (($60*68)|0)|0) + 16|0);
    _glUniform4fv(($72|0),1,($73|0));
    $74 = (_glGetUniformLocation(($5|0),(1784|0))|0);
    $75 = ((($64) + (($60*68)|0)|0) + 32|0);
    _glUniform4fv(($74|0),1,($75|0));
    $76 = (_glGetUniformLocation(($5|0),(1800|0))|0);
    $77 = ((($64) + (($60*68)|0)|0) + 48|0);
    _glUniform4fv(($76|0),1,($77|0));
    $78 = (_glGetUniformLocation(($5|0),(1816|0))|0);
    $79 = ((($64) + (($60*68)|0)|0) + 64|0);
    $80 = +HEAPF32[$79>>2];
    _glUniform1f(($78|0),(+$80));
    $81 = (_glGetUniformLocation(($5|0),(1832|0))|0);
    $82 = (($this) + 68|0);
    $83 = HEAP32[$82>>2]|0;
    _glUniform1i(($81|0),($83|0));
    $i$01 = 0;
    while(1) {
     $84 = ((($this) + ($i$01<<2)|0) + 36|0);
     $85 = HEAP32[$84>>2]|0;
     $86 = ($85|0)==(65535);
     if ($86) {
      break L14;
     }
     $87 = HEAP32[$61>>2]|0;
     $88 = (($87) + 20|0);
     $89 = HEAP32[$88>>2]|0;
     $90 = ((($89) + (($85*20)|0)|0) + 8|0);
     $91 = HEAP32[$90>>2]|0;
     $92 = (($i$01) + 33984)|0;
     _glActiveTexture(($92|0));
     $93 = HEAP32[$91>>2]|0;
     _glBindTexture(3553,($93|0));
     HEAP32[$vararg_buffer>>2] = $i$01;
     (_sprintf($texUniformStr,1848,$vararg_buffer)|0);
     $94 = (_glGetUniformLocation(($5|0),($texUniformStr|0))|0);
     _glUniform1i(($94|0),($i$01|0));
     $95 = (($i$01) + 1)|0;
     $96 = ($95|0)<(8);
     if ($96) {
      $i$01 = $95;
     } else {
      break;
     }
    }
   }
  } while(0);
  _glBlendFunc(770,771);
  $110 = HEAP32[$0>>2]|0;
  $111 = (($110) + 4|0);
  $112 = HEAP32[$111>>2]|0;
  $113 = HEAP32[$56>>2]|0;
  __ZN15REMRenderDevice15setActiveSkinIDEj($112,$113);
 }
 $114 = HEAP32[$0>>2]|0;
 $115 = (($114) + 4|0);
 $116 = HEAP32[$115>>2]|0;
 $117 = (__ZN15REMRenderDevice12getShadeModeEv($116)|0);
 if ((($117|0) == 7)) {
  $124 = (($this) + 92|0);
  $125 = HEAP32[$124>>2]|0;
  $126 = (($125>>>0) / 3)&-1;
  _glDrawElements(4,($126|0),5123,(0|0));
  $$pre$phiZ2D = $124;
 } else if ((($117|0) == 6)) {
  $118 = (($this) + 92|0);
  $119 = HEAP32[$118>>2]|0;
  _glDrawElements(0,($119|0),5123,(0|0));
  $$pre$phiZ2D = $118;
 } else if ((($117|0) == 8)) {
  $120 = (($this) + 92|0);
  $121 = HEAP32[$120>>2]|0;
  _glDrawElements(3,($121|0),5123,(0|0));
  $$pre$phiZ2D = $120;
 } else if ((($117|0) == 9)) {
  $122 = (($this) + 92|0);
  $123 = HEAP32[$122>>2]|0;
  _glDrawElements(4,($123|0),5123,(0|0));
  $$pre$phiZ2D = $122;
 } else {
  $$pre = (($this) + 92|0);
  $$pre$phiZ2D = $$pre;
 }
 HEAP32[$6>>2] = 0;
 HEAP32[$$pre$phiZ2D>>2] = 0;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN21REMVertexCacheManager14forcedFlushAllEv($this) {
 $this = $this|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, $i$03 = 0, $i$11 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $i$03 = 0;
 while(1) {
  $0 = ((($this) + ($i$03<<2)|0) + 16|0);
  $1 = HEAP32[$0>>2]|0;
  $2 = ($1|0)==(0|0);
  if (!($2)) {
   $3 = (($1) + 88|0);
   $4 = HEAP32[$3>>2]|0;
   $5 = ($4|0)==(0);
   if (!($5)) {
    $6 = (__ZN14REMVertexCache5flushEv($1)|0);
    $7 = ($6|0)<(0);
    if ($7) {
     $$0 = -1;
     label = 10;
     break;
    }
   }
  }
  $8 = (($i$03) + 1)|0;
  $9 = ($8|0)<(50);
  if ($9) {
   $i$03 = $8;
  } else {
   $i$11 = 0;
   break;
  }
 }
 if ((label|0) == 10) {
  STACKTOP = sp;return ($$0|0);
 }
 while(1) {
  $10 = ((($this) + ($i$11<<2)|0) + 216|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = ($11|0)==(0|0);
  if (!($12)) {
   $13 = (($11) + 88|0);
   $14 = HEAP32[$13>>2]|0;
   $15 = ($14|0)==(0);
   if (!($15)) {
    $16 = (__ZN14REMVertexCache5flushEv($11)|0);
    $17 = ($16|0)<(0);
    if ($17) {
     $$0 = -1;
     label = 10;
     break;
    }
   }
  }
  $18 = (($i$11) + 1)|0;
  $19 = ($18|0)<(50);
  if ($19) {
   $i$11 = $18;
  } else {
   $$0 = 0;
   label = 10;
   break;
  }
 }
 if ((label|0) == 10) {
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function ___strchrnul($s,$c) {
 $s = $s|0;
 $c = $c|0;
 var $$0 = 0, $$02$lcssa = 0, $$026 = 0, $$1 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $w$0$lcssa = 0, $w$03 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = $c & 255;
 $1 = ($0|0)==(0);
 if ($1) {
  $6 = (_strlen(($s|0))|0);
  $7 = (($s) + ($6)|0);
  $$0 = $7;
  STACKTOP = sp;return ($$0|0);
 }
 $2 = $s;
 $3 = $2 & 3;
 $4 = ($3|0)==(0);
 L5: do {
  if ($4) {
   $$02$lcssa = $s;
  } else {
   $5 = $c&255;
   $$026 = $s;
   while(1) {
    $12 = HEAP8[$$026>>0]|0;
    $13 = ($12<<24>>24)==(0);
    if ($13) {
     $$0 = $$026;
     label = 13;
     break;
    }
    $14 = ($12<<24>>24)==($5<<24>>24);
    $9 = (($$026) + 1|0);
    if ($14) {
     $$0 = $$026;
     label = 13;
     break;
    }
    $8 = $9;
    $10 = $8 & 3;
    $11 = ($10|0)==(0);
    if ($11) {
     $$02$lcssa = $9;
     break L5;
    } else {
     $$026 = $9;
    }
   }
   if ((label|0) == 13) {
    STACKTOP = sp;return ($$0|0);
   }
  }
 } while(0);
 $15 = Math_imul($0, 16843009)|0;
 $16 = HEAP32[$$02$lcssa>>2]|0;
 $17 = (($16) + -16843009)|0;
 $18 = $16 & -2139062144;
 $19 = $18 ^ -2139062144;
 $20 = $19 & $17;
 $21 = ($20|0)==(0);
 L15: do {
  if ($21) {
   $30 = $16;$w$03 = $$02$lcssa;
   while(1) {
    $29 = $30 ^ $15;
    $31 = (($29) + -16843009)|0;
    $32 = $29 & -2139062144;
    $33 = $32 ^ -2139062144;
    $34 = $33 & $31;
    $35 = ($34|0)==(0);
    $23 = (($w$03) + 4|0);
    if (!($35)) {
     $w$0$lcssa = $w$03;
     break L15;
    }
    $22 = HEAP32[$23>>2]|0;
    $24 = (($22) + -16843009)|0;
    $25 = $22 & -2139062144;
    $26 = $25 ^ -2139062144;
    $27 = $26 & $24;
    $28 = ($27|0)==(0);
    if ($28) {
     $30 = $22;$w$03 = $23;
    } else {
     $w$0$lcssa = $23;
     break;
    }
   }
  } else {
   $w$0$lcssa = $$02$lcssa;
  }
 } while(0);
 $36 = $c&255;
 $$1 = $w$0$lcssa;
 while(1) {
  $37 = HEAP8[$$1>>0]|0;
  $38 = ($37<<24>>24)==(0);
  $39 = ($37<<24>>24)==($36<<24>>24);
  $or$cond = $38 | $39;
  $40 = (($$1) + 1|0);
  if ($or$cond) {
   $$0 = $$1;
   break;
  } else {
   $$1 = $40;
  }
 }
 STACKTOP = sp;return ($$0|0);
}
function _strcspn($s,$c) {
 $s = $s|0;
 $c = $c|0;
 var $$0 = 0, $$025 = 0, $$03$lcssa = 0, $$034 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, $byteset = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $byteset = sp;
 $0 = HEAP8[$c>>0]|0;
 $1 = ($0<<24>>24)==(0);
 if (!($1)) {
  $2 = (($c) + 1|0);
  $3 = HEAP8[$2>>0]|0;
  $4 = ($3<<24>>24)==(0);
  if (!($4)) {
   ;HEAP32[$byteset+0>>2]=0|0;HEAP32[$byteset+4>>2]=0|0;HEAP32[$byteset+8>>2]=0|0;HEAP32[$byteset+12>>2]=0|0;HEAP32[$byteset+16>>2]=0|0;HEAP32[$byteset+20>>2]=0|0;HEAP32[$byteset+24>>2]=0|0;HEAP32[$byteset+28>>2]=0|0;
   $$025 = $c;$13 = $0;
   while(1) {
    $12 = $13&255;
    $14 = $12 & 31;
    $15 = 1 << $14;
    $16 = $12 >>> 5;
    $17 = (($byteset) + ($16<<2)|0);
    $18 = HEAP32[$17>>2]|0;
    $19 = $18 | $15;
    HEAP32[$17>>2] = $19;
    $20 = (($$025) + 1|0);
    $21 = HEAP8[$20>>0]|0;
    $22 = ($21<<24>>24)==(0);
    if ($22) {
     break;
    } else {
     $$025 = $20;$13 = $21;
    }
   }
   $10 = HEAP8[$s>>0]|0;
   $11 = ($10<<24>>24)==(0);
   L7: do {
    if ($11) {
     $$03$lcssa = $s;
    } else {
     $$034 = $s;$27 = $10;
     while(1) {
      $26 = $27&255;
      $28 = $26 >>> 5;
      $29 = (($byteset) + ($28<<2)|0);
      $30 = HEAP32[$29>>2]|0;
      $31 = $26 & 31;
      $32 = 1 << $31;
      $33 = $30 & $32;
      $34 = ($33|0)==(0);
      $24 = (($$034) + 1|0);
      if (!($34)) {
       $$03$lcssa = $$034;
       break L7;
      }
      $23 = HEAP8[$24>>0]|0;
      $25 = ($23<<24>>24)==(0);
      if ($25) {
       $$03$lcssa = $24;
       break;
      } else {
       $$034 = $24;$27 = $23;
      }
     }
    }
   } while(0);
   $35 = $$03$lcssa;
   $36 = $s;
   $37 = (($35) - ($36))|0;
   $$0 = $37;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $5 = $0 << 24 >> 24;
 $6 = (___strchrnul($s,$5)|0);
 $7 = $6;
 $8 = $s;
 $9 = (($7) - ($8))|0;
 $$0 = $9;
 STACKTOP = sp;return ($$0|0);
}
function _strspn($s,$c) {
 $s = $s|0;
 $c = $c|0;
 var $$0 = 0, $$026 = 0, $$03 = 0, $$1$lcssa = 0, $$14 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $4 = 0, $5 = 0;
 var $6 = 0, $7 = 0, $8 = 0, $9 = 0, $byteset = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $byteset = sp;
 ;HEAP32[$byteset+0>>2]=0|0;HEAP32[$byteset+4>>2]=0|0;HEAP32[$byteset+8>>2]=0|0;HEAP32[$byteset+12>>2]=0|0;HEAP32[$byteset+16>>2]=0|0;HEAP32[$byteset+20>>2]=0|0;HEAP32[$byteset+24>>2]=0|0;HEAP32[$byteset+28>>2]=0|0;
 $0 = HEAP8[$c>>0]|0;
 $1 = ($0<<24>>24)==(0);
 if ($1) {
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $2 = (($c) + 1|0);
 $3 = HEAP8[$2>>0]|0;
 $4 = ($3<<24>>24)==(0);
 if ($4) {
  $$03 = $s;
  while(1) {
   $5 = HEAP8[$$03>>0]|0;
   $6 = ($5<<24>>24)==($0<<24>>24);
   $7 = (($$03) + 1|0);
   if ($6) {
    $$03 = $7;
   } else {
    break;
   }
  }
  $8 = $$03;
  $9 = $s;
  $10 = (($8) - ($9))|0;
  $$0 = $10;
  STACKTOP = sp;return ($$0|0);
 } else {
  $$026 = $c;$14 = $0;
 }
 while(1) {
  $13 = $14&255;
  $15 = $13 & 31;
  $16 = 1 << $15;
  $17 = $13 >>> 5;
  $18 = (($byteset) + ($17<<2)|0);
  $19 = HEAP32[$18>>2]|0;
  $20 = $19 | $16;
  HEAP32[$18>>2] = $20;
  $21 = (($$026) + 1|0);
  $22 = HEAP8[$21>>0]|0;
  $23 = ($22<<24>>24)==(0);
  if ($23) {
   break;
  } else {
   $$026 = $21;$14 = $22;
  }
 }
 $11 = HEAP8[$s>>0]|0;
 $12 = ($11<<24>>24)==(0);
 L12: do {
  if ($12) {
   $$1$lcssa = $s;
  } else {
   $$14 = $s;$28 = $11;
   while(1) {
    $27 = $28&255;
    $29 = $27 >>> 5;
    $30 = (($byteset) + ($29<<2)|0);
    $31 = HEAP32[$30>>2]|0;
    $32 = $27 & 31;
    $33 = 1 << $32;
    $34 = $31 & $33;
    $35 = ($34|0)==(0);
    $25 = (($$14) + 1|0);
    if ($35) {
     $$1$lcssa = $$14;
     break L12;
    }
    $24 = HEAP8[$25>>0]|0;
    $26 = ($24<<24>>24)==(0);
    if ($26) {
     $$1$lcssa = $25;
     break;
    } else {
     $$14 = $25;$28 = $24;
    }
   }
  }
 } while(0);
 $36 = $$1$lcssa;
 $37 = $s;
 $38 = (($36) - ($37))|0;
 $$0 = $38;
 STACKTOP = sp;return ($$0|0);
}
function _strtok($s,$sep) {
 $s = $s|0;
 $sep = $sep|0;
 var $$0 = 0, $$01 = 0, $$sum = 0, $$sum2 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($s|0)==(0|0);
 if ($0) {
  $1 = HEAP32[1880>>2]|0;
  $2 = ($1|0)==(0|0);
  if ($2) {
   $$0 = 0;
   STACKTOP = sp;return ($$0|0);
  } else {
   $$01 = $1;
  }
 } else {
  $$01 = $s;
 }
 $3 = (_strspn($$01,$sep)|0);
 $4 = (($$01) + ($3)|0);
 $5 = HEAP8[$4>>0]|0;
 $6 = ($5<<24>>24)==(0);
 if ($6) {
  HEAP32[1880>>2] = 0;
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $7 = (_strcspn($4,$sep)|0);
 $$sum = (($7) + ($3))|0;
 $8 = (($$01) + ($$sum)|0);
 HEAP32[1880>>2] = $8;
 $9 = HEAP8[$8>>0]|0;
 $10 = ($9<<24>>24)==(0);
 if ($10) {
  HEAP32[1880>>2] = 0;
  $$0 = $4;
  STACKTOP = sp;return ($$0|0);
 } else {
  $$sum2 = (($$sum) + 1)|0;
  $11 = (($$01) + ($$sum2)|0);
  HEAP32[1880>>2] = $11;
  HEAP8[$8>>0] = 0;
  $$0 = $4;
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function __Znwj($size) {
 $size = $size|0;
 var $$lcssa = 0, $$size = 0, $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($size|0)==(0);
 $$size = $0 ? 1 : $size;
 $1 = (_malloc($$size)|0);
 $2 = ($1|0)==(0|0);
 if (!($2)) {
  $$lcssa = $1;
  STACKTOP = sp;return ($$lcssa|0);
 }
 while(1) {
  $3 = (__ZSt15get_new_handlerv()|0);
  $4 = ($3|0)==(0|0);
  if ($4) {
   label = 4;
   break;
  }
  FUNCTION_TABLE_v[$3 & 31]();
  $5 = (_malloc($$size)|0);
  $6 = ($5|0)==(0|0);
  if (!($6)) {
   $$lcssa = $5;
   label = 5;
   break;
  }
 }
 if ((label|0) == 4) {
  $7 = (___cxa_allocate_exception(4)|0);
  HEAP32[$7>>2] = ((1888 + 8|0));
  ___cxa_throw(($7|0),(1944|0),(1|0));
  // unreachable;
 }
 else if ((label|0) == 5) {
  STACKTOP = sp;return ($$lcssa|0);
 }
 return 0|0;
}
function __Znaj($size) {
 $size = $size|0;
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (__Znwj($size)|0);
 STACKTOP = sp;return ($0|0);
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
 STACKTOP = sp;return (1912|0);
}
function __ZSt15get_new_handlerv() {
 var $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[1960>>2]|0;HEAP32[1960>>2] = (($0+0)|0);
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
 var $$1 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $info = 0, dest = 0, label = 0;
 var sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $info = sp;
 $0 = ($this|0)==($thrown_type|0);
 if ($0) {
  $$1 = 1;
  STACKTOP = sp;return ($$1|0);
 }
 $1 = ($thrown_type|0)==(0|0);
 if ($1) {
  $$1 = 0;
  STACKTOP = sp;return ($$1|0);
 }
 $2 = (___dynamic_cast($thrown_type,2056,2112,0)|0);
 $3 = ($2|0)==(0|0);
 if ($3) {
  $$1 = 0;
  STACKTOP = sp;return ($$1|0);
 }
 dest=$info+0|0; stop=dest+56|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 HEAP32[$info>>2] = $2;
 $4 = (($info) + 8|0);
 HEAP32[$4>>2] = $this;
 $5 = (($info) + 12|0);
 HEAP32[$5>>2] = -1;
 $6 = (($info) + 48|0);
 HEAP32[$6>>2] = 1;
 $7 = HEAP32[$2>>2]|0;
 $8 = (($7) + 28|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = HEAP32[$adjustedPtr>>2]|0;
 FUNCTION_TABLE_viiii[$9 & 31]($2,$info,$10,1);
 $11 = (($info) + 24|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = ($12|0)==(1);
 if (!($13)) {
  $$1 = 0;
  STACKTOP = sp;return ($$1|0);
 }
 $14 = (($info) + 16|0);
 $15 = HEAP32[$14>>2]|0;
 HEAP32[$adjustedPtr>>2] = $15;
 $$1 = 1;
 STACKTOP = sp;return ($$1|0);
}
function __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi($this,$info,$adjustedPtr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $adjustedPtr = $adjustedPtr|0;
 $path_below = $path_below|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 16|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==(0|0);
 if ($2) {
  HEAP32[$0>>2] = $adjustedPtr;
  $3 = (($info) + 24|0);
  HEAP32[$3>>2] = $path_below;
  $4 = (($info) + 36|0);
  HEAP32[$4>>2] = 1;
  STACKTOP = sp;return;
 }
 $5 = ($1|0)==($adjustedPtr|0);
 if (!($5)) {
  $9 = (($info) + 36|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = (($10) + 1)|0;
  HEAP32[$9>>2] = $11;
  $12 = (($info) + 24|0);
  HEAP32[$12>>2] = 2;
  $13 = (($info) + 54|0);
  HEAP8[$13>>0] = 1;
  STACKTOP = sp;return;
 }
 $6 = (($info) + 24|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = ($7|0)==(2);
 if (!($8)) {
  STACKTOP = sp;return;
 }
 HEAP32[$6>>2] = $path_below;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi($this,$info,$adjustedPtr,$path_below) {
 $this = $this|0;
 $info = $info|0;
 $adjustedPtr = $adjustedPtr|0;
 $path_below = $path_below|0;
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==($this|0);
 if (!($2)) {
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
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($this|0)==($1|0);
 if ($2) {
  __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0,$info,$adjustedPtr,$path_below);
  STACKTOP = sp;return;
 } else {
  $3 = (($this) + 8|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = HEAP32[$4>>2]|0;
  $6 = (($5) + 28|0);
  $7 = HEAP32[$6>>2]|0;
  FUNCTION_TABLE_viiii[$7 & 31]($4,$info,$adjustedPtr,$path_below);
  STACKTOP = sp;return;
 }
}
function ___dynamic_cast($static_ptr,$static_type,$dst_type,$src2dst_offset) {
 $static_ptr = $static_ptr|0;
 $static_type = $static_type|0;
 $dst_type = $dst_type|0;
 $src2dst_offset = $src2dst_offset|0;
 var $$ = 0, $$1 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $dst_ptr$0 = 0, $info = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $info = sp;
 $0 = HEAP32[$static_ptr>>2]|0;
 $1 = (($0) + -8|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2;
 $4 = (($static_ptr) + ($3)|0);
 $5 = (($0) + -4|0);
 $6 = HEAP32[$5>>2]|0;
 HEAP32[$info>>2] = $dst_type;
 $7 = (($info) + 4|0);
 HEAP32[$7>>2] = $static_ptr;
 $8 = (($info) + 8|0);
 HEAP32[$8>>2] = $static_type;
 $9 = (($info) + 12|0);
 HEAP32[$9>>2] = $src2dst_offset;
 $10 = (($info) + 16|0);
 $11 = (($info) + 20|0);
 $12 = (($info) + 24|0);
 $13 = (($info) + 28|0);
 $14 = (($info) + 32|0);
 $15 = (($info) + 40|0);
 $16 = ($6|0)==($dst_type|0);
 dest=$10+0|0; stop=dest+36|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));HEAP16[$10+36>>1]=0|0;HEAP8[$10+38>>0]=0|0;
 if ($16) {
  $17 = (($info) + 48|0);
  HEAP32[$17>>2] = 1;
  $18 = HEAP32[$6>>2]|0;
  $19 = (($18) + 20|0);
  $20 = HEAP32[$19>>2]|0;
  FUNCTION_TABLE_viiiiii[$20 & 15]($6,$info,$4,$4,1,0);
  $21 = HEAP32[$12>>2]|0;
  $22 = ($21|0)==(1);
  $$ = $22 ? $4 : 0;
  $dst_ptr$0 = $$;
  STACKTOP = sp;return ($dst_ptr$0|0);
 }
 $23 = (($info) + 36|0);
 $24 = HEAP32[$6>>2]|0;
 $25 = (($24) + 24|0);
 $26 = HEAP32[$25>>2]|0;
 FUNCTION_TABLE_viiiii[$26 & 15]($6,$info,$4,1,0);
 $27 = HEAP32[$23>>2]|0;
 if ((($27|0) == 0)) {
  $28 = HEAP32[$15>>2]|0;
  $29 = ($28|0)==(1);
  if (!($29)) {
   $dst_ptr$0 = 0;
   STACKTOP = sp;return ($dst_ptr$0|0);
  }
  $30 = HEAP32[$13>>2]|0;
  $31 = ($30|0)==(1);
  if (!($31)) {
   $dst_ptr$0 = 0;
   STACKTOP = sp;return ($dst_ptr$0|0);
  }
  $32 = HEAP32[$14>>2]|0;
  $33 = ($32|0)==(1);
  $34 = HEAP32[$11>>2]|0;
  $$1 = $33 ? $34 : 0;
  $dst_ptr$0 = $$1;
  STACKTOP = sp;return ($dst_ptr$0|0);
 } else if ((($27|0) == 1)) {
  $35 = HEAP32[$12>>2]|0;
  $36 = ($35|0)==(1);
  if (!($36)) {
   $37 = HEAP32[$15>>2]|0;
   $38 = ($37|0)==(0);
   if (!($38)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
   $39 = HEAP32[$13>>2]|0;
   $40 = ($39|0)==(1);
   if (!($40)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
   $41 = HEAP32[$14>>2]|0;
   $42 = ($41|0)==(1);
   if (!($42)) {
    $dst_ptr$0 = 0;
    STACKTOP = sp;return ($dst_ptr$0|0);
   }
  }
  $43 = HEAP32[$10>>2]|0;
  $dst_ptr$0 = $43;
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
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 53|0);
 HEAP8[$0>>0] = 1;
 $1 = (($info) + 4|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)==($current_ptr|0);
 if (!($3)) {
  STACKTOP = sp;return;
 }
 $4 = (($info) + 52|0);
 HEAP8[$4>>0] = 1;
 $5 = (($info) + 16|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($6|0)==(0|0);
 if ($7) {
  HEAP32[$5>>2] = $dst_ptr;
  $8 = (($info) + 24|0);
  HEAP32[$8>>2] = $path_below;
  $9 = (($info) + 36|0);
  HEAP32[$9>>2] = 1;
  $10 = (($info) + 48|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = ($11|0)==(1);
  $13 = ($path_below|0)==(1);
  $or$cond = $12 & $13;
  if (!($or$cond)) {
   STACKTOP = sp;return;
  }
  $14 = (($info) + 54|0);
  HEAP8[$14>>0] = 1;
  STACKTOP = sp;return;
 }
 $15 = ($6|0)==($dst_ptr|0);
 if (!($15)) {
  $25 = (($info) + 36|0);
  $26 = HEAP32[$25>>2]|0;
  $27 = (($26) + 1)|0;
  HEAP32[$25>>2] = $27;
  $28 = (($info) + 54|0);
  HEAP8[$28>>0] = 1;
  STACKTOP = sp;return;
 }
 $16 = (($info) + 24|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = ($17|0)==(2);
 if ($18) {
  HEAP32[$16>>2] = $path_below;
  $23 = $path_below;
 } else {
  $23 = $17;
 }
 $19 = (($info) + 48|0);
 $20 = HEAP32[$19>>2]|0;
 $21 = ($20|0)==(1);
 $22 = ($23|0)==(1);
 $or$cond1 = $21 & $22;
 if (!($or$cond1)) {
  STACKTOP = sp;return;
 }
 $24 = (($info) + 54|0);
 HEAP8[$24>>0] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($this,$info,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $is_dst_type_derived_from_static_type$0$off01 = 0, $not$ = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($this|0)==($1|0);
 if ($2) {
  $3 = (($info) + 4|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = ($4|0)==($current_ptr|0);
  if (!($5)) {
   STACKTOP = sp;return;
  }
  $6 = (($info) + 28|0);
  $7 = HEAP32[$6>>2]|0;
  $8 = ($7|0)==(1);
  if ($8) {
   STACKTOP = sp;return;
  }
  HEAP32[$6>>2] = $path_below;
  STACKTOP = sp;return;
 }
 $9 = HEAP32[$info>>2]|0;
 $10 = ($this|0)==($9|0);
 if (!($10)) {
  $43 = (($this) + 8|0);
  $44 = HEAP32[$43>>2]|0;
  $45 = HEAP32[$44>>2]|0;
  $46 = (($45) + 24|0);
  $47 = HEAP32[$46>>2]|0;
  FUNCTION_TABLE_viiiii[$47 & 15]($44,$info,$current_ptr,$path_below,$use_strcmp);
  STACKTOP = sp;return;
 }
 $11 = (($info) + 16|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = ($12|0)==($current_ptr|0);
 if (!($13)) {
  $14 = (($info) + 20|0);
  $15 = HEAP32[$14>>2]|0;
  $16 = ($15|0)==($current_ptr|0);
  if (!($16)) {
   $19 = (($info) + 32|0);
   HEAP32[$19>>2] = $path_below;
   $20 = (($info) + 44|0);
   $21 = HEAP32[$20>>2]|0;
   $22 = ($21|0)==(4);
   if ($22) {
    STACKTOP = sp;return;
   }
   $23 = (($info) + 52|0);
   HEAP8[$23>>0] = 0;
   $24 = (($info) + 53|0);
   HEAP8[$24>>0] = 0;
   $25 = (($this) + 8|0);
   $26 = HEAP32[$25>>2]|0;
   $27 = HEAP32[$26>>2]|0;
   $28 = (($27) + 20|0);
   $29 = HEAP32[$28>>2]|0;
   FUNCTION_TABLE_viiiiii[$29 & 15]($26,$info,$current_ptr,$current_ptr,1,$use_strcmp);
   $30 = HEAP8[$24>>0]|0;
   $31 = ($30<<24>>24)==(0);
   if ($31) {
    $is_dst_type_derived_from_static_type$0$off01 = 0;
    label = 13;
   } else {
    $32 = HEAP8[$23>>0]|0;
    $not$ = ($32<<24>>24)==(0);
    if ($not$) {
     $is_dst_type_derived_from_static_type$0$off01 = 1;
     label = 13;
    }
   }
   do {
    if ((label|0) == 13) {
     HEAP32[$14>>2] = $current_ptr;
     $33 = (($info) + 40|0);
     $34 = HEAP32[$33>>2]|0;
     $35 = (($34) + 1)|0;
     HEAP32[$33>>2] = $35;
     $36 = (($info) + 36|0);
     $37 = HEAP32[$36>>2]|0;
     $38 = ($37|0)==(1);
     if ($38) {
      $39 = (($info) + 24|0);
      $40 = HEAP32[$39>>2]|0;
      $41 = ($40|0)==(2);
      if ($41) {
       $42 = (($info) + 54|0);
       HEAP8[$42>>0] = 1;
       if ($is_dst_type_derived_from_static_type$0$off01) {
        break;
       }
      } else {
       label = 16;
      }
     } else {
      label = 16;
     }
     if ((label|0) == 16) {
      if ($is_dst_type_derived_from_static_type$0$off01) {
       break;
      }
     }
     HEAP32[$20>>2] = 4;
     STACKTOP = sp;return;
    }
   } while(0);
   HEAP32[$20>>2] = 3;
   STACKTOP = sp;return;
  }
 }
 $17 = ($path_below|0)==(1);
 if (!($17)) {
  STACKTOP = sp;return;
 }
 $18 = (($info) + 32|0);
 HEAP32[$18>>2] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib($this,$info,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==($this|0);
 if ($2) {
  $3 = (($info) + 4|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = ($4|0)==($current_ptr|0);
  if (!($5)) {
   STACKTOP = sp;return;
  }
  $6 = (($info) + 28|0);
  $7 = HEAP32[$6>>2]|0;
  $8 = ($7|0)==(1);
  if ($8) {
   STACKTOP = sp;return;
  }
  HEAP32[$6>>2] = $path_below;
  STACKTOP = sp;return;
 }
 $9 = HEAP32[$info>>2]|0;
 $10 = ($9|0)==($this|0);
 if (!($10)) {
  STACKTOP = sp;return;
 }
 $11 = (($info) + 16|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = ($12|0)==($current_ptr|0);
 if (!($13)) {
  $14 = (($info) + 20|0);
  $15 = HEAP32[$14>>2]|0;
  $16 = ($15|0)==($current_ptr|0);
  if (!($16)) {
   $19 = (($info) + 32|0);
   HEAP32[$19>>2] = $path_below;
   HEAP32[$14>>2] = $current_ptr;
   $20 = (($info) + 40|0);
   $21 = HEAP32[$20>>2]|0;
   $22 = (($21) + 1)|0;
   HEAP32[$20>>2] = $22;
   $23 = (($info) + 36|0);
   $24 = HEAP32[$23>>2]|0;
   $25 = ($24|0)==(1);
   if ($25) {
    $26 = (($info) + 24|0);
    $27 = HEAP32[$26>>2]|0;
    $28 = ($27|0)==(2);
    if ($28) {
     $29 = (($info) + 54|0);
     HEAP8[$29>>0] = 1;
    }
   }
   $30 = (($info) + 44|0);
   HEAP32[$30>>2] = 4;
   STACKTOP = sp;return;
  }
 }
 $17 = ($path_below|0)==(1);
 if (!($17)) {
  STACKTOP = sp;return;
 }
 $18 = (($info) + 32|0);
 HEAP32[$18>>2] = 1;
 STACKTOP = sp;return;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib($this,$info,$dst_ptr,$current_ptr,$path_below,$use_strcmp) {
 $this = $this|0;
 $info = $info|0;
 $dst_ptr = $dst_ptr|0;
 $current_ptr = $current_ptr|0;
 $path_below = $path_below|0;
 $use_strcmp = $use_strcmp|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($this|0)==($1|0);
 if ($2) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$info,$dst_ptr,$current_ptr,$path_below);
  STACKTOP = sp;return;
 } else {
  $3 = (($this) + 8|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = HEAP32[$4>>2]|0;
  $6 = (($5) + 20|0);
  $7 = HEAP32[$6>>2]|0;
  FUNCTION_TABLE_viiiiii[$7 & 15]($4,$info,$dst_ptr,$current_ptr,$path_below,$use_strcmp);
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
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($info) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==($this|0);
 if (!($2)) {
  STACKTOP = sp;return;
 }
 __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0,$info,$dst_ptr,$current_ptr,$path_below);
 STACKTOP = sp;return;
}
function _malloc($bytes) {
 $bytes = $bytes|0;
 var $$$i = 0, $$3$i = 0, $$4$i = 0, $$pre = 0, $$pre$i = 0, $$pre$i$i = 0, $$pre$i25 = 0, $$pre$i25$i = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i26$iZ2D = 0, $$pre$phi$i26Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phi58$i$iZ2D = 0, $$pre$phiZ2D = 0, $$pre57$i$i = 0, $$rsize$0$i = 0, $$rsize$3$i = 0, $$sum = 0, $$sum$i$i = 0, $$sum$i$i$i = 0;
 var $$sum$i14$i = 0, $$sum$i15$i = 0, $$sum$i18$i = 0, $$sum$i21$i = 0, $$sum$i2334 = 0, $$sum$i32 = 0, $$sum$i35 = 0, $$sum1 = 0, $$sum1$i = 0, $$sum1$i$i = 0, $$sum1$i16$i = 0, $$sum1$i22$i = 0, $$sum1$i24 = 0, $$sum10 = 0, $$sum10$i = 0, $$sum10$i$i = 0, $$sum10$pre$i$i = 0, $$sum107$i = 0, $$sum108$i = 0, $$sum109$i = 0;
 var $$sum11$i = 0, $$sum11$i$i = 0, $$sum11$i24$i = 0, $$sum110$i = 0, $$sum111$i = 0, $$sum1112 = 0, $$sum112$i = 0, $$sum113$i = 0, $$sum114$i = 0, $$sum115$i = 0, $$sum116$i = 0, $$sum117$i = 0, $$sum118$i = 0, $$sum119$i = 0, $$sum12$i = 0, $$sum12$i$i = 0, $$sum120$i = 0, $$sum13$i = 0, $$sum13$i$i = 0, $$sum14$i$i = 0;
 var $$sum14$pre$i = 0, $$sum15$i = 0, $$sum15$i$i = 0, $$sum16$i = 0, $$sum16$i$i = 0, $$sum17$i = 0, $$sum17$i$i = 0, $$sum18$i = 0, $$sum1819$i$i = 0, $$sum2 = 0, $$sum2$i = 0, $$sum2$i$i = 0, $$sum2$i$i$i = 0, $$sum2$i17$i = 0, $$sum2$i19$i = 0, $$sum2$i23$i = 0, $$sum2$pre$i = 0, $$sum20$i$i = 0, $$sum21$i$i = 0, $$sum22$i$i = 0;
 var $$sum23$i$i = 0, $$sum24$i$i = 0, $$sum25$i$i = 0, $$sum26$pre$i$i = 0, $$sum27$i$i = 0, $$sum28$i$i = 0, $$sum29$i$i = 0, $$sum3$i = 0, $$sum3$i$i = 0, $$sum3$i27 = 0, $$sum30$i$i = 0, $$sum3132$i$i = 0, $$sum34$i$i = 0, $$sum3536$i$i = 0, $$sum3738$i$i = 0, $$sum39$i$i = 0, $$sum4 = 0, $$sum4$i = 0, $$sum4$i28 = 0, $$sum40$i$i = 0;
 var $$sum41$i$i = 0, $$sum42$i$i = 0, $$sum5$i = 0, $$sum5$i$i = 0, $$sum56 = 0, $$sum6$i = 0, $$sum67$i$i = 0, $$sum7$i = 0, $$sum8$i = 0, $$sum8$pre = 0, $$sum9 = 0, $$sum9$i = 0, $$sum9$i$i = 0, $$tsize$1$i = 0, $$v$0$i = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $1000 = 0;
 var $1001 = 0, $1002 = 0, $1003 = 0, $1004 = 0, $1005 = 0, $1006 = 0, $1007 = 0, $1008 = 0, $1009 = 0, $101 = 0, $1010 = 0, $1011 = 0, $1012 = 0, $1013 = 0, $1014 = 0, $1015 = 0, $1016 = 0, $1017 = 0, $1018 = 0, $1019 = 0;
 var $102 = 0, $1020 = 0, $1021 = 0, $1022 = 0, $1023 = 0, $1024 = 0, $1025 = 0, $1026 = 0, $1027 = 0, $1028 = 0, $1029 = 0, $103 = 0, $1030 = 0, $1031 = 0, $1032 = 0, $1033 = 0, $1034 = 0, $1035 = 0, $1036 = 0, $1037 = 0;
 var $1038 = 0, $1039 = 0, $104 = 0, $1040 = 0, $1041 = 0, $1042 = 0, $1043 = 0, $1044 = 0, $1045 = 0, $1046 = 0, $1047 = 0, $1048 = 0, $1049 = 0, $105 = 0, $1050 = 0, $1051 = 0, $1052 = 0, $1053 = 0, $1054 = 0, $1055 = 0;
 var $1056 = 0, $1057 = 0, $1058 = 0, $1059 = 0, $106 = 0, $1060 = 0, $1061 = 0, $1062 = 0, $1063 = 0, $1064 = 0, $1065 = 0, $1066 = 0, $1067 = 0, $1068 = 0, $1069 = 0, $107 = 0, $1070 = 0, $1071 = 0, $1072 = 0, $1073 = 0;
 var $1074 = 0, $1075 = 0, $1076 = 0, $1077 = 0, $1078 = 0, $1079 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0;
 var $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0;
 var $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0;
 var $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0;
 var $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0;
 var $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0;
 var $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0;
 var $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0;
 var $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0;
 var $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0;
 var $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0;
 var $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0;
 var $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0;
 var $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0;
 var $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0;
 var $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0;
 var $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0;
 var $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0;
 var $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0;
 var $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0, $460 = 0, $461 = 0, $462 = 0;
 var $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0, $48 = 0, $480 = 0;
 var $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0, $498 = 0, $499 = 0;
 var $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0, $515 = 0, $516 = 0;
 var $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0, $532 = 0, $533 = 0, $534 = 0;
 var $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0;
 var $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0, $570 = 0;
 var $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0;
 var $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0, $605 = 0, $606 = 0;
 var $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0;
 var $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0, $641 = 0, $642 = 0;
 var $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0;
 var $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0, $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0, $677 = 0, $678 = 0, $679 = 0;
 var $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0, $695 = 0, $696 = 0, $697 = 0;
 var $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0, $712 = 0, $713 = 0, $714 = 0;
 var $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0, $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0, $727 = 0, $728 = 0, $729 = 0, $73 = 0, $730 = 0, $731 = 0, $732 = 0;
 var $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0, $749 = 0, $75 = 0, $750 = 0;
 var $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0, $766 = 0, $767 = 0, $768 = 0, $769 = 0;
 var $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0, $785 = 0, $786 = 0, $787 = 0;
 var $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0, $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0, $802 = 0, $803 = 0, $804 = 0;
 var $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0, $820 = 0, $821 = 0, $822 = 0;
 var $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0, $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0, $838 = 0, $839 = 0, $84 = 0, $840 = 0;
 var $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0, $856 = 0, $857 = 0, $858 = 0, $859 = 0;
 var $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0, $864 = 0, $865 = 0, $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0, $874 = 0, $875 = 0, $876 = 0, $877 = 0;
 var $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0, $882 = 0, $883 = 0, $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0, $892 = 0, $893 = 0, $894 = 0, $895 = 0;
 var $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0, $90 = 0, $900 = 0, $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0, $91 = 0, $910 = 0, $911 = 0, $912 = 0;
 var $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0, $918 = 0, $919 = 0, $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0, $928 = 0, $929 = 0, $93 = 0, $930 = 0;
 var $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0, $936 = 0, $937 = 0, $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0, $946 = 0, $947 = 0, $948 = 0, $949 = 0;
 var $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0, $954 = 0, $955 = 0, $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0, $964 = 0, $965 = 0, $966 = 0, $967 = 0;
 var $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0, $972 = 0, $973 = 0, $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $980 = 0, $981 = 0, $982 = 0, $983 = 0, $984 = 0, $985 = 0;
 var $986 = 0, $987 = 0, $988 = 0, $989 = 0, $99 = 0, $990 = 0, $991 = 0, $992 = 0, $993 = 0, $994 = 0, $995 = 0, $996 = 0, $997 = 0, $998 = 0, $999 = 0, $F$0$i$i = 0, $F1$0$i = 0, $F4$0 = 0, $F4$0$i$i = 0, $F5$0$i = 0;
 var $I1$0$c$i$i = 0, $I1$0$i$i = 0, $I7$0$i = 0, $I7$0$i$i = 0, $K12$025$i = 0, $K2$014$i$i = 0, $K8$052$i$i = 0, $R$0$i = 0, $R$0$i$i = 0, $R$0$i18 = 0, $R$1$i = 0, $R$1$i$i = 0, $R$1$i20 = 0, $RP$0$i = 0, $RP$0$i$i = 0, $RP$0$i17 = 0, $T$0$lcssa$i = 0, $T$0$lcssa$i$i = 0, $T$0$lcssa$i28$i = 0, $T$013$i$i = 0;
 var $T$024$i = 0, $T$051$i$i = 0, $br$0$i = 0, $cond$i = 0, $cond$i$i = 0, $cond$i21 = 0, $exitcond$i$i = 0, $i$02$i$i = 0, $idx$0$i = 0, $mem$0 = 0, $nb$0 = 0, $notlhs$i = 0, $notrhs$i = 0, $oldfirst$0$i$i = 0, $or$cond$i = 0, $or$cond$i29 = 0, $or$cond1$i = 0, $or$cond10$i = 0, $or$cond19$i = 0, $or$cond2$i = 0;
 var $or$cond49$i = 0, $or$cond5$i = 0, $or$cond6$i = 0, $or$cond8$not$i = 0, $or$cond9$i = 0, $qsize$0$i$i = 0, $rsize$0$i = 0, $rsize$0$i15 = 0, $rsize$1$i = 0, $rsize$2$i = 0, $rsize$3$lcssa$i = 0, $rsize$329$i = 0, $rst$0$i = 0, $rst$1$i = 0, $sizebits$0$i = 0, $sp$0$i$i = 0, $sp$0$i$i$i = 0, $sp$075$i = 0, $sp$168$i = 0, $ssize$0$$i = 0;
 var $ssize$0$i = 0, $ssize$1$i = 0, $ssize$2$i = 0, $t$0$i = 0, $t$0$i14 = 0, $t$1$i = 0, $t$2$ph$i = 0, $t$2$v$3$i = 0, $t$228$i = 0, $tbase$0$i = 0, $tbase$247$i = 0, $tsize$0$i = 0, $tsize$0323841$i = 0, $tsize$1$i = 0, $tsize$246$i = 0, $v$0$i = 0, $v$0$i16 = 0, $v$1$i = 0, $v$2$i = 0, $v$3$lcssa$i = 0;
 var $v$330$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($bytes>>>0)<(245);
 do {
  if ($0) {
   $1 = ($bytes>>>0)<(11);
   if ($1) {
    $5 = 16;
   } else {
    $2 = (($bytes) + 11)|0;
    $3 = $2 & -8;
    $5 = $3;
   }
   $4 = $5 >>> 3;
   $6 = HEAP32[2264>>2]|0;
   $7 = $6 >>> $4;
   $8 = $7 & 3;
   $9 = ($8|0)==(0);
   if (!($9)) {
    $10 = $7 & 1;
    $11 = $10 ^ 1;
    $12 = (($11) + ($4))|0;
    $13 = $12 << 1;
    $14 = ((2264 + ($13<<2)|0) + 40|0);
    $$sum10 = (($13) + 2)|0;
    $15 = ((2264 + ($$sum10<<2)|0) + 40|0);
    $16 = HEAP32[$15>>2]|0;
    $17 = (($16) + 8|0);
    $18 = HEAP32[$17>>2]|0;
    $19 = ($14|0)==($18|0);
    do {
     if ($19) {
      $20 = 1 << $12;
      $21 = $20 ^ -1;
      $22 = $6 & $21;
      HEAP32[2264>>2] = $22;
     } else {
      $23 = HEAP32[((2264 + 16|0))>>2]|0;
      $24 = ($18>>>0)<($23>>>0);
      if ($24) {
       _abort();
       // unreachable;
      }
      $25 = (($18) + 12|0);
      $26 = HEAP32[$25>>2]|0;
      $27 = ($26|0)==($16|0);
      if ($27) {
       HEAP32[$25>>2] = $14;
       HEAP32[$15>>2] = $18;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $28 = $12 << 3;
    $29 = $28 | 3;
    $30 = (($16) + 4|0);
    HEAP32[$30>>2] = $29;
    $$sum1112 = $28 | 4;
    $31 = (($16) + ($$sum1112)|0);
    $32 = HEAP32[$31>>2]|0;
    $33 = $32 | 1;
    HEAP32[$31>>2] = $33;
    $mem$0 = $17;
    STACKTOP = sp;return ($mem$0|0);
   }
   $34 = HEAP32[((2264 + 8|0))>>2]|0;
   $35 = ($5>>>0)>($34>>>0);
   if ($35) {
    $36 = ($7|0)==(0);
    if (!($36)) {
     $37 = $7 << $4;
     $38 = 2 << $4;
     $39 = (0 - ($38))|0;
     $40 = $38 | $39;
     $41 = $37 & $40;
     $42 = (0 - ($41))|0;
     $43 = $41 & $42;
     $44 = (($43) + -1)|0;
     $45 = $44 >>> 12;
     $46 = $45 & 16;
     $47 = $44 >>> $46;
     $48 = $47 >>> 5;
     $49 = $48 & 8;
     $50 = $49 | $46;
     $51 = $47 >>> $49;
     $52 = $51 >>> 2;
     $53 = $52 & 4;
     $54 = $50 | $53;
     $55 = $51 >>> $53;
     $56 = $55 >>> 1;
     $57 = $56 & 2;
     $58 = $54 | $57;
     $59 = $55 >>> $57;
     $60 = $59 >>> 1;
     $61 = $60 & 1;
     $62 = $58 | $61;
     $63 = $59 >>> $61;
     $64 = (($62) + ($63))|0;
     $65 = $64 << 1;
     $66 = ((2264 + ($65<<2)|0) + 40|0);
     $$sum4 = (($65) + 2)|0;
     $67 = ((2264 + ($$sum4<<2)|0) + 40|0);
     $68 = HEAP32[$67>>2]|0;
     $69 = (($68) + 8|0);
     $70 = HEAP32[$69>>2]|0;
     $71 = ($66|0)==($70|0);
     do {
      if ($71) {
       $72 = 1 << $64;
       $73 = $72 ^ -1;
       $74 = $6 & $73;
       HEAP32[2264>>2] = $74;
      } else {
       $75 = HEAP32[((2264 + 16|0))>>2]|0;
       $76 = ($70>>>0)<($75>>>0);
       if ($76) {
        _abort();
        // unreachable;
       }
       $77 = (($70) + 12|0);
       $78 = HEAP32[$77>>2]|0;
       $79 = ($78|0)==($68|0);
       if ($79) {
        HEAP32[$77>>2] = $66;
        HEAP32[$67>>2] = $70;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $80 = $64 << 3;
     $81 = (($80) - ($5))|0;
     $82 = $5 | 3;
     $83 = (($68) + 4|0);
     HEAP32[$83>>2] = $82;
     $84 = (($68) + ($5)|0);
     $85 = $81 | 1;
     $$sum56 = $5 | 4;
     $86 = (($68) + ($$sum56)|0);
     HEAP32[$86>>2] = $85;
     $87 = (($68) + ($80)|0);
     HEAP32[$87>>2] = $81;
     $88 = HEAP32[((2264 + 8|0))>>2]|0;
     $89 = ($88|0)==(0);
     if (!($89)) {
      $90 = HEAP32[((2264 + 20|0))>>2]|0;
      $91 = $88 >>> 3;
      $92 = $91 << 1;
      $93 = ((2264 + ($92<<2)|0) + 40|0);
      $94 = HEAP32[2264>>2]|0;
      $95 = 1 << $91;
      $96 = $94 & $95;
      $97 = ($96|0)==(0);
      if ($97) {
       $98 = $94 | $95;
       HEAP32[2264>>2] = $98;
       $$sum8$pre = (($92) + 2)|0;
       $$pre = ((2264 + ($$sum8$pre<<2)|0) + 40|0);
       $$pre$phiZ2D = $$pre;$F4$0 = $93;
      } else {
       $$sum9 = (($92) + 2)|0;
       $99 = ((2264 + ($$sum9<<2)|0) + 40|0);
       $100 = HEAP32[$99>>2]|0;
       $101 = HEAP32[((2264 + 16|0))>>2]|0;
       $102 = ($100>>>0)<($101>>>0);
       if ($102) {
        _abort();
        // unreachable;
       } else {
        $$pre$phiZ2D = $99;$F4$0 = $100;
       }
      }
      HEAP32[$$pre$phiZ2D>>2] = $90;
      $103 = (($F4$0) + 12|0);
      HEAP32[$103>>2] = $90;
      $104 = (($90) + 8|0);
      HEAP32[$104>>2] = $F4$0;
      $105 = (($90) + 12|0);
      HEAP32[$105>>2] = $93;
     }
     HEAP32[((2264 + 8|0))>>2] = $81;
     HEAP32[((2264 + 20|0))>>2] = $84;
     $mem$0 = $69;
     STACKTOP = sp;return ($mem$0|0);
    }
    $106 = HEAP32[((2264 + 4|0))>>2]|0;
    $107 = ($106|0)==(0);
    if ($107) {
     $nb$0 = $5;
    } else {
     $108 = (0 - ($106))|0;
     $109 = $106 & $108;
     $110 = (($109) + -1)|0;
     $111 = $110 >>> 12;
     $112 = $111 & 16;
     $113 = $110 >>> $112;
     $114 = $113 >>> 5;
     $115 = $114 & 8;
     $116 = $115 | $112;
     $117 = $113 >>> $115;
     $118 = $117 >>> 2;
     $119 = $118 & 4;
     $120 = $116 | $119;
     $121 = $117 >>> $119;
     $122 = $121 >>> 1;
     $123 = $122 & 2;
     $124 = $120 | $123;
     $125 = $121 >>> $123;
     $126 = $125 >>> 1;
     $127 = $126 & 1;
     $128 = $124 | $127;
     $129 = $125 >>> $127;
     $130 = (($128) + ($129))|0;
     $131 = ((2264 + ($130<<2)|0) + 304|0);
     $132 = HEAP32[$131>>2]|0;
     $133 = (($132) + 4|0);
     $134 = HEAP32[$133>>2]|0;
     $135 = $134 & -8;
     $136 = (($135) - ($5))|0;
     $rsize$0$i = $136;$t$0$i = $132;$v$0$i = $132;
     while(1) {
      $137 = (($t$0$i) + 16|0);
      $138 = HEAP32[$137>>2]|0;
      $139 = ($138|0)==(0|0);
      if ($139) {
       $140 = (($t$0$i) + 20|0);
       $141 = HEAP32[$140>>2]|0;
       $142 = ($141|0)==(0|0);
       if ($142) {
        break;
       } else {
        $144 = $141;
       }
      } else {
       $144 = $138;
      }
      $143 = (($144) + 4|0);
      $145 = HEAP32[$143>>2]|0;
      $146 = $145 & -8;
      $147 = (($146) - ($5))|0;
      $148 = ($147>>>0)<($rsize$0$i>>>0);
      $$rsize$0$i = $148 ? $147 : $rsize$0$i;
      $$v$0$i = $148 ? $144 : $v$0$i;
      $rsize$0$i = $$rsize$0$i;$t$0$i = $144;$v$0$i = $$v$0$i;
     }
     $149 = HEAP32[((2264 + 16|0))>>2]|0;
     $150 = ($v$0$i>>>0)<($149>>>0);
     if ($150) {
      _abort();
      // unreachable;
     }
     $151 = (($v$0$i) + ($5)|0);
     $152 = ($v$0$i>>>0)<($151>>>0);
     if (!($152)) {
      _abort();
      // unreachable;
     }
     $153 = (($v$0$i) + 24|0);
     $154 = HEAP32[$153>>2]|0;
     $155 = (($v$0$i) + 12|0);
     $156 = HEAP32[$155>>2]|0;
     $157 = ($156|0)==($v$0$i|0);
     do {
      if ($157) {
       $167 = (($v$0$i) + 20|0);
       $168 = HEAP32[$167>>2]|0;
       $169 = ($168|0)==(0|0);
       if ($169) {
        $170 = (($v$0$i) + 16|0);
        $171 = HEAP32[$170>>2]|0;
        $172 = ($171|0)==(0|0);
        if ($172) {
         $R$1$i = 0;
         break;
        } else {
         $R$0$i = $171;$RP$0$i = $170;
        }
       } else {
        $R$0$i = $168;$RP$0$i = $167;
       }
       while(1) {
        $173 = (($R$0$i) + 20|0);
        $174 = HEAP32[$173>>2]|0;
        $175 = ($174|0)==(0|0);
        if (!($175)) {
         $R$0$i = $174;$RP$0$i = $173;
         continue;
        }
        $176 = (($R$0$i) + 16|0);
        $177 = HEAP32[$176>>2]|0;
        $178 = ($177|0)==(0|0);
        if ($178) {
         break;
        } else {
         $R$0$i = $177;$RP$0$i = $176;
        }
       }
       $179 = ($RP$0$i>>>0)<($149>>>0);
       if ($179) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$RP$0$i>>2] = 0;
        $R$1$i = $R$0$i;
        break;
       }
      } else {
       $158 = (($v$0$i) + 8|0);
       $159 = HEAP32[$158>>2]|0;
       $160 = ($159>>>0)<($149>>>0);
       if ($160) {
        _abort();
        // unreachable;
       }
       $161 = (($159) + 12|0);
       $162 = HEAP32[$161>>2]|0;
       $163 = ($162|0)==($v$0$i|0);
       if (!($163)) {
        _abort();
        // unreachable;
       }
       $164 = (($156) + 8|0);
       $165 = HEAP32[$164>>2]|0;
       $166 = ($165|0)==($v$0$i|0);
       if ($166) {
        HEAP32[$161>>2] = $156;
        HEAP32[$164>>2] = $159;
        $R$1$i = $156;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $180 = ($154|0)==(0|0);
     do {
      if (!($180)) {
       $181 = (($v$0$i) + 28|0);
       $182 = HEAP32[$181>>2]|0;
       $183 = ((2264 + ($182<<2)|0) + 304|0);
       $184 = HEAP32[$183>>2]|0;
       $185 = ($v$0$i|0)==($184|0);
       if ($185) {
        HEAP32[$183>>2] = $R$1$i;
        $cond$i = ($R$1$i|0)==(0|0);
        if ($cond$i) {
         $186 = 1 << $182;
         $187 = $186 ^ -1;
         $188 = HEAP32[((2264 + 4|0))>>2]|0;
         $189 = $188 & $187;
         HEAP32[((2264 + 4|0))>>2] = $189;
         break;
        }
       } else {
        $190 = HEAP32[((2264 + 16|0))>>2]|0;
        $191 = ($154>>>0)<($190>>>0);
        if ($191) {
         _abort();
         // unreachable;
        }
        $192 = (($154) + 16|0);
        $193 = HEAP32[$192>>2]|0;
        $194 = ($193|0)==($v$0$i|0);
        if ($194) {
         HEAP32[$192>>2] = $R$1$i;
        } else {
         $195 = (($154) + 20|0);
         HEAP32[$195>>2] = $R$1$i;
        }
        $196 = ($R$1$i|0)==(0|0);
        if ($196) {
         break;
        }
       }
       $197 = HEAP32[((2264 + 16|0))>>2]|0;
       $198 = ($R$1$i>>>0)<($197>>>0);
       if ($198) {
        _abort();
        // unreachable;
       }
       $199 = (($R$1$i) + 24|0);
       HEAP32[$199>>2] = $154;
       $200 = (($v$0$i) + 16|0);
       $201 = HEAP32[$200>>2]|0;
       $202 = ($201|0)==(0|0);
       do {
        if (!($202)) {
         $203 = HEAP32[((2264 + 16|0))>>2]|0;
         $204 = ($201>>>0)<($203>>>0);
         if ($204) {
          _abort();
          // unreachable;
         } else {
          $205 = (($R$1$i) + 16|0);
          HEAP32[$205>>2] = $201;
          $206 = (($201) + 24|0);
          HEAP32[$206>>2] = $R$1$i;
          break;
         }
        }
       } while(0);
       $207 = (($v$0$i) + 20|0);
       $208 = HEAP32[$207>>2]|0;
       $209 = ($208|0)==(0|0);
       if (!($209)) {
        $210 = HEAP32[((2264 + 16|0))>>2]|0;
        $211 = ($208>>>0)<($210>>>0);
        if ($211) {
         _abort();
         // unreachable;
        } else {
         $212 = (($R$1$i) + 20|0);
         HEAP32[$212>>2] = $208;
         $213 = (($208) + 24|0);
         HEAP32[$213>>2] = $R$1$i;
         break;
        }
       }
      }
     } while(0);
     $214 = ($rsize$0$i>>>0)<(16);
     if ($214) {
      $215 = (($rsize$0$i) + ($5))|0;
      $216 = $215 | 3;
      $217 = (($v$0$i) + 4|0);
      HEAP32[$217>>2] = $216;
      $$sum4$i = (($215) + 4)|0;
      $218 = (($v$0$i) + ($$sum4$i)|0);
      $219 = HEAP32[$218>>2]|0;
      $220 = $219 | 1;
      HEAP32[$218>>2] = $220;
     } else {
      $221 = $5 | 3;
      $222 = (($v$0$i) + 4|0);
      HEAP32[$222>>2] = $221;
      $223 = $rsize$0$i | 1;
      $$sum$i35 = $5 | 4;
      $224 = (($v$0$i) + ($$sum$i35)|0);
      HEAP32[$224>>2] = $223;
      $$sum1$i = (($rsize$0$i) + ($5))|0;
      $225 = (($v$0$i) + ($$sum1$i)|0);
      HEAP32[$225>>2] = $rsize$0$i;
      $226 = HEAP32[((2264 + 8|0))>>2]|0;
      $227 = ($226|0)==(0);
      if (!($227)) {
       $228 = HEAP32[((2264 + 20|0))>>2]|0;
       $229 = $226 >>> 3;
       $230 = $229 << 1;
       $231 = ((2264 + ($230<<2)|0) + 40|0);
       $232 = HEAP32[2264>>2]|0;
       $233 = 1 << $229;
       $234 = $232 & $233;
       $235 = ($234|0)==(0);
       if ($235) {
        $236 = $232 | $233;
        HEAP32[2264>>2] = $236;
        $$sum2$pre$i = (($230) + 2)|0;
        $$pre$i = ((2264 + ($$sum2$pre$i<<2)|0) + 40|0);
        $$pre$phi$iZ2D = $$pre$i;$F1$0$i = $231;
       } else {
        $$sum3$i = (($230) + 2)|0;
        $237 = ((2264 + ($$sum3$i<<2)|0) + 40|0);
        $238 = HEAP32[$237>>2]|0;
        $239 = HEAP32[((2264 + 16|0))>>2]|0;
        $240 = ($238>>>0)<($239>>>0);
        if ($240) {
         _abort();
         // unreachable;
        } else {
         $$pre$phi$iZ2D = $237;$F1$0$i = $238;
        }
       }
       HEAP32[$$pre$phi$iZ2D>>2] = $228;
       $241 = (($F1$0$i) + 12|0);
       HEAP32[$241>>2] = $228;
       $242 = (($228) + 8|0);
       HEAP32[$242>>2] = $F1$0$i;
       $243 = (($228) + 12|0);
       HEAP32[$243>>2] = $231;
      }
      HEAP32[((2264 + 8|0))>>2] = $rsize$0$i;
      HEAP32[((2264 + 20|0))>>2] = $151;
     }
     $244 = (($v$0$i) + 8|0);
     $mem$0 = $244;
     STACKTOP = sp;return ($mem$0|0);
    }
   } else {
    $nb$0 = $5;
   }
  } else {
   $245 = ($bytes>>>0)>(4294967231);
   if ($245) {
    $nb$0 = -1;
   } else {
    $246 = (($bytes) + 11)|0;
    $247 = $246 & -8;
    $248 = HEAP32[((2264 + 4|0))>>2]|0;
    $249 = ($248|0)==(0);
    if ($249) {
     $nb$0 = $247;
    } else {
     $250 = (0 - ($247))|0;
     $251 = $246 >>> 8;
     $252 = ($251|0)==(0);
     if ($252) {
      $idx$0$i = 0;
     } else {
      $253 = ($247>>>0)>(16777215);
      if ($253) {
       $idx$0$i = 31;
      } else {
       $254 = (($251) + 1048320)|0;
       $255 = $254 >>> 16;
       $256 = $255 & 8;
       $257 = $251 << $256;
       $258 = (($257) + 520192)|0;
       $259 = $258 >>> 16;
       $260 = $259 & 4;
       $261 = $260 | $256;
       $262 = $257 << $260;
       $263 = (($262) + 245760)|0;
       $264 = $263 >>> 16;
       $265 = $264 & 2;
       $266 = $261 | $265;
       $267 = (14 - ($266))|0;
       $268 = $262 << $265;
       $269 = $268 >>> 15;
       $270 = (($267) + ($269))|0;
       $271 = $270 << 1;
       $272 = (($270) + 7)|0;
       $273 = $247 >>> $272;
       $274 = $273 & 1;
       $275 = $274 | $271;
       $idx$0$i = $275;
      }
     }
     $276 = ((2264 + ($idx$0$i<<2)|0) + 304|0);
     $277 = HEAP32[$276>>2]|0;
     $278 = ($277|0)==(0|0);
     L126: do {
      if ($278) {
       $rsize$2$i = $250;$t$1$i = 0;$v$2$i = 0;
      } else {
       $279 = ($idx$0$i|0)==(31);
       if ($279) {
        $283 = 0;
       } else {
        $280 = $idx$0$i >>> 1;
        $281 = (25 - ($280))|0;
        $283 = $281;
       }
       $282 = $247 << $283;
       $rsize$0$i15 = $250;$rst$0$i = 0;$sizebits$0$i = $282;$t$0$i14 = $277;$v$0$i16 = 0;
       while(1) {
        $284 = (($t$0$i14) + 4|0);
        $285 = HEAP32[$284>>2]|0;
        $286 = $285 & -8;
        $287 = (($286) - ($247))|0;
        $288 = ($287>>>0)<($rsize$0$i15>>>0);
        if ($288) {
         $289 = ($286|0)==($247|0);
         if ($289) {
          $rsize$2$i = $287;$t$1$i = $t$0$i14;$v$2$i = $t$0$i14;
          break L126;
         } else {
          $rsize$1$i = $287;$v$1$i = $t$0$i14;
         }
        } else {
         $rsize$1$i = $rsize$0$i15;$v$1$i = $v$0$i16;
        }
        $290 = (($t$0$i14) + 20|0);
        $291 = HEAP32[$290>>2]|0;
        $292 = $sizebits$0$i >>> 31;
        $293 = ((($t$0$i14) + ($292<<2)|0) + 16|0);
        $294 = HEAP32[$293>>2]|0;
        $295 = ($291|0)==(0|0);
        $296 = ($291|0)==($294|0);
        $or$cond$i = $295 | $296;
        $rst$1$i = $or$cond$i ? $rst$0$i : $291;
        $297 = ($294|0)==(0|0);
        $298 = $sizebits$0$i << 1;
        if ($297) {
         $rsize$2$i = $rsize$1$i;$t$1$i = $rst$1$i;$v$2$i = $v$1$i;
         break;
        } else {
         $rsize$0$i15 = $rsize$1$i;$rst$0$i = $rst$1$i;$sizebits$0$i = $298;$t$0$i14 = $294;$v$0$i16 = $v$1$i;
        }
       }
      }
     } while(0);
     $299 = ($t$1$i|0)==(0|0);
     $300 = ($v$2$i|0)==(0|0);
     $or$cond19$i = $299 & $300;
     if ($or$cond19$i) {
      $301 = 2 << $idx$0$i;
      $302 = (0 - ($301))|0;
      $303 = $301 | $302;
      $304 = $248 & $303;
      $305 = ($304|0)==(0);
      if ($305) {
       $nb$0 = $247;
       break;
      }
      $306 = (0 - ($304))|0;
      $307 = $304 & $306;
      $308 = (($307) + -1)|0;
      $309 = $308 >>> 12;
      $310 = $309 & 16;
      $311 = $308 >>> $310;
      $312 = $311 >>> 5;
      $313 = $312 & 8;
      $314 = $313 | $310;
      $315 = $311 >>> $313;
      $316 = $315 >>> 2;
      $317 = $316 & 4;
      $318 = $314 | $317;
      $319 = $315 >>> $317;
      $320 = $319 >>> 1;
      $321 = $320 & 2;
      $322 = $318 | $321;
      $323 = $319 >>> $321;
      $324 = $323 >>> 1;
      $325 = $324 & 1;
      $326 = $322 | $325;
      $327 = $323 >>> $325;
      $328 = (($326) + ($327))|0;
      $329 = ((2264 + ($328<<2)|0) + 304|0);
      $330 = HEAP32[$329>>2]|0;
      $t$2$ph$i = $330;
     } else {
      $t$2$ph$i = $t$1$i;
     }
     $331 = ($t$2$ph$i|0)==(0|0);
     if ($331) {
      $rsize$3$lcssa$i = $rsize$2$i;$v$3$lcssa$i = $v$2$i;
     } else {
      $rsize$329$i = $rsize$2$i;$t$228$i = $t$2$ph$i;$v$330$i = $v$2$i;
      while(1) {
       $332 = (($t$228$i) + 4|0);
       $333 = HEAP32[$332>>2]|0;
       $334 = $333 & -8;
       $335 = (($334) - ($247))|0;
       $336 = ($335>>>0)<($rsize$329$i>>>0);
       $$rsize$3$i = $336 ? $335 : $rsize$329$i;
       $t$2$v$3$i = $336 ? $t$228$i : $v$330$i;
       $337 = (($t$228$i) + 16|0);
       $338 = HEAP32[$337>>2]|0;
       $339 = ($338|0)==(0|0);
       if (!($339)) {
        $rsize$329$i = $$rsize$3$i;$t$228$i = $338;$v$330$i = $t$2$v$3$i;
        continue;
       }
       $340 = (($t$228$i) + 20|0);
       $341 = HEAP32[$340>>2]|0;
       $342 = ($341|0)==(0|0);
       if ($342) {
        $rsize$3$lcssa$i = $$rsize$3$i;$v$3$lcssa$i = $t$2$v$3$i;
        break;
       } else {
        $rsize$329$i = $$rsize$3$i;$t$228$i = $341;$v$330$i = $t$2$v$3$i;
       }
      }
     }
     $343 = ($v$3$lcssa$i|0)==(0|0);
     if ($343) {
      $nb$0 = $247;
     } else {
      $344 = HEAP32[((2264 + 8|0))>>2]|0;
      $345 = (($344) - ($247))|0;
      $346 = ($rsize$3$lcssa$i>>>0)<($345>>>0);
      if ($346) {
       $347 = HEAP32[((2264 + 16|0))>>2]|0;
       $348 = ($v$3$lcssa$i>>>0)<($347>>>0);
       if ($348) {
        _abort();
        // unreachable;
       }
       $349 = (($v$3$lcssa$i) + ($247)|0);
       $350 = ($v$3$lcssa$i>>>0)<($349>>>0);
       if (!($350)) {
        _abort();
        // unreachable;
       }
       $351 = (($v$3$lcssa$i) + 24|0);
       $352 = HEAP32[$351>>2]|0;
       $353 = (($v$3$lcssa$i) + 12|0);
       $354 = HEAP32[$353>>2]|0;
       $355 = ($354|0)==($v$3$lcssa$i|0);
       do {
        if ($355) {
         $365 = (($v$3$lcssa$i) + 20|0);
         $366 = HEAP32[$365>>2]|0;
         $367 = ($366|0)==(0|0);
         if ($367) {
          $368 = (($v$3$lcssa$i) + 16|0);
          $369 = HEAP32[$368>>2]|0;
          $370 = ($369|0)==(0|0);
          if ($370) {
           $R$1$i20 = 0;
           break;
          } else {
           $R$0$i18 = $369;$RP$0$i17 = $368;
          }
         } else {
          $R$0$i18 = $366;$RP$0$i17 = $365;
         }
         while(1) {
          $371 = (($R$0$i18) + 20|0);
          $372 = HEAP32[$371>>2]|0;
          $373 = ($372|0)==(0|0);
          if (!($373)) {
           $R$0$i18 = $372;$RP$0$i17 = $371;
           continue;
          }
          $374 = (($R$0$i18) + 16|0);
          $375 = HEAP32[$374>>2]|0;
          $376 = ($375|0)==(0|0);
          if ($376) {
           break;
          } else {
           $R$0$i18 = $375;$RP$0$i17 = $374;
          }
         }
         $377 = ($RP$0$i17>>>0)<($347>>>0);
         if ($377) {
          _abort();
          // unreachable;
         } else {
          HEAP32[$RP$0$i17>>2] = 0;
          $R$1$i20 = $R$0$i18;
          break;
         }
        } else {
         $356 = (($v$3$lcssa$i) + 8|0);
         $357 = HEAP32[$356>>2]|0;
         $358 = ($357>>>0)<($347>>>0);
         if ($358) {
          _abort();
          // unreachable;
         }
         $359 = (($357) + 12|0);
         $360 = HEAP32[$359>>2]|0;
         $361 = ($360|0)==($v$3$lcssa$i|0);
         if (!($361)) {
          _abort();
          // unreachable;
         }
         $362 = (($354) + 8|0);
         $363 = HEAP32[$362>>2]|0;
         $364 = ($363|0)==($v$3$lcssa$i|0);
         if ($364) {
          HEAP32[$359>>2] = $354;
          HEAP32[$362>>2] = $357;
          $R$1$i20 = $354;
          break;
         } else {
          _abort();
          // unreachable;
         }
        }
       } while(0);
       $378 = ($352|0)==(0|0);
       do {
        if (!($378)) {
         $379 = (($v$3$lcssa$i) + 28|0);
         $380 = HEAP32[$379>>2]|0;
         $381 = ((2264 + ($380<<2)|0) + 304|0);
         $382 = HEAP32[$381>>2]|0;
         $383 = ($v$3$lcssa$i|0)==($382|0);
         if ($383) {
          HEAP32[$381>>2] = $R$1$i20;
          $cond$i21 = ($R$1$i20|0)==(0|0);
          if ($cond$i21) {
           $384 = 1 << $380;
           $385 = $384 ^ -1;
           $386 = HEAP32[((2264 + 4|0))>>2]|0;
           $387 = $386 & $385;
           HEAP32[((2264 + 4|0))>>2] = $387;
           break;
          }
         } else {
          $388 = HEAP32[((2264 + 16|0))>>2]|0;
          $389 = ($352>>>0)<($388>>>0);
          if ($389) {
           _abort();
           // unreachable;
          }
          $390 = (($352) + 16|0);
          $391 = HEAP32[$390>>2]|0;
          $392 = ($391|0)==($v$3$lcssa$i|0);
          if ($392) {
           HEAP32[$390>>2] = $R$1$i20;
          } else {
           $393 = (($352) + 20|0);
           HEAP32[$393>>2] = $R$1$i20;
          }
          $394 = ($R$1$i20|0)==(0|0);
          if ($394) {
           break;
          }
         }
         $395 = HEAP32[((2264 + 16|0))>>2]|0;
         $396 = ($R$1$i20>>>0)<($395>>>0);
         if ($396) {
          _abort();
          // unreachable;
         }
         $397 = (($R$1$i20) + 24|0);
         HEAP32[$397>>2] = $352;
         $398 = (($v$3$lcssa$i) + 16|0);
         $399 = HEAP32[$398>>2]|0;
         $400 = ($399|0)==(0|0);
         do {
          if (!($400)) {
           $401 = HEAP32[((2264 + 16|0))>>2]|0;
           $402 = ($399>>>0)<($401>>>0);
           if ($402) {
            _abort();
            // unreachable;
           } else {
            $403 = (($R$1$i20) + 16|0);
            HEAP32[$403>>2] = $399;
            $404 = (($399) + 24|0);
            HEAP32[$404>>2] = $R$1$i20;
            break;
           }
          }
         } while(0);
         $405 = (($v$3$lcssa$i) + 20|0);
         $406 = HEAP32[$405>>2]|0;
         $407 = ($406|0)==(0|0);
         if (!($407)) {
          $408 = HEAP32[((2264 + 16|0))>>2]|0;
          $409 = ($406>>>0)<($408>>>0);
          if ($409) {
           _abort();
           // unreachable;
          } else {
           $410 = (($R$1$i20) + 20|0);
           HEAP32[$410>>2] = $406;
           $411 = (($406) + 24|0);
           HEAP32[$411>>2] = $R$1$i20;
           break;
          }
         }
        }
       } while(0);
       $412 = ($rsize$3$lcssa$i>>>0)<(16);
       L204: do {
        if ($412) {
         $413 = (($rsize$3$lcssa$i) + ($247))|0;
         $414 = $413 | 3;
         $415 = (($v$3$lcssa$i) + 4|0);
         HEAP32[$415>>2] = $414;
         $$sum18$i = (($413) + 4)|0;
         $416 = (($v$3$lcssa$i) + ($$sum18$i)|0);
         $417 = HEAP32[$416>>2]|0;
         $418 = $417 | 1;
         HEAP32[$416>>2] = $418;
        } else {
         $419 = $247 | 3;
         $420 = (($v$3$lcssa$i) + 4|0);
         HEAP32[$420>>2] = $419;
         $421 = $rsize$3$lcssa$i | 1;
         $$sum$i2334 = $247 | 4;
         $422 = (($v$3$lcssa$i) + ($$sum$i2334)|0);
         HEAP32[$422>>2] = $421;
         $$sum1$i24 = (($rsize$3$lcssa$i) + ($247))|0;
         $423 = (($v$3$lcssa$i) + ($$sum1$i24)|0);
         HEAP32[$423>>2] = $rsize$3$lcssa$i;
         $424 = $rsize$3$lcssa$i >>> 3;
         $425 = ($rsize$3$lcssa$i>>>0)<(256);
         if ($425) {
          $426 = $424 << 1;
          $427 = ((2264 + ($426<<2)|0) + 40|0);
          $428 = HEAP32[2264>>2]|0;
          $429 = 1 << $424;
          $430 = $428 & $429;
          $431 = ($430|0)==(0);
          do {
           if ($431) {
            $432 = $428 | $429;
            HEAP32[2264>>2] = $432;
            $$sum14$pre$i = (($426) + 2)|0;
            $$pre$i25 = ((2264 + ($$sum14$pre$i<<2)|0) + 40|0);
            $$pre$phi$i26Z2D = $$pre$i25;$F5$0$i = $427;
           } else {
            $$sum17$i = (($426) + 2)|0;
            $433 = ((2264 + ($$sum17$i<<2)|0) + 40|0);
            $434 = HEAP32[$433>>2]|0;
            $435 = HEAP32[((2264 + 16|0))>>2]|0;
            $436 = ($434>>>0)<($435>>>0);
            if (!($436)) {
             $$pre$phi$i26Z2D = $433;$F5$0$i = $434;
             break;
            }
            _abort();
            // unreachable;
           }
          } while(0);
          HEAP32[$$pre$phi$i26Z2D>>2] = $349;
          $437 = (($F5$0$i) + 12|0);
          HEAP32[$437>>2] = $349;
          $$sum15$i = (($247) + 8)|0;
          $438 = (($v$3$lcssa$i) + ($$sum15$i)|0);
          HEAP32[$438>>2] = $F5$0$i;
          $$sum16$i = (($247) + 12)|0;
          $439 = (($v$3$lcssa$i) + ($$sum16$i)|0);
          HEAP32[$439>>2] = $427;
          break;
         }
         $440 = $rsize$3$lcssa$i >>> 8;
         $441 = ($440|0)==(0);
         if ($441) {
          $I7$0$i = 0;
         } else {
          $442 = ($rsize$3$lcssa$i>>>0)>(16777215);
          if ($442) {
           $I7$0$i = 31;
          } else {
           $443 = (($440) + 1048320)|0;
           $444 = $443 >>> 16;
           $445 = $444 & 8;
           $446 = $440 << $445;
           $447 = (($446) + 520192)|0;
           $448 = $447 >>> 16;
           $449 = $448 & 4;
           $450 = $449 | $445;
           $451 = $446 << $449;
           $452 = (($451) + 245760)|0;
           $453 = $452 >>> 16;
           $454 = $453 & 2;
           $455 = $450 | $454;
           $456 = (14 - ($455))|0;
           $457 = $451 << $454;
           $458 = $457 >>> 15;
           $459 = (($456) + ($458))|0;
           $460 = $459 << 1;
           $461 = (($459) + 7)|0;
           $462 = $rsize$3$lcssa$i >>> $461;
           $463 = $462 & 1;
           $464 = $463 | $460;
           $I7$0$i = $464;
          }
         }
         $465 = ((2264 + ($I7$0$i<<2)|0) + 304|0);
         $$sum2$i = (($247) + 28)|0;
         $466 = (($v$3$lcssa$i) + ($$sum2$i)|0);
         HEAP32[$466>>2] = $I7$0$i;
         $$sum3$i27 = (($247) + 16)|0;
         $467 = (($v$3$lcssa$i) + ($$sum3$i27)|0);
         $$sum4$i28 = (($247) + 20)|0;
         $468 = (($v$3$lcssa$i) + ($$sum4$i28)|0);
         HEAP32[$468>>2] = 0;
         HEAP32[$467>>2] = 0;
         $469 = HEAP32[((2264 + 4|0))>>2]|0;
         $470 = 1 << $I7$0$i;
         $471 = $469 & $470;
         $472 = ($471|0)==(0);
         if ($472) {
          $473 = $469 | $470;
          HEAP32[((2264 + 4|0))>>2] = $473;
          HEAP32[$465>>2] = $349;
          $$sum5$i = (($247) + 24)|0;
          $474 = (($v$3$lcssa$i) + ($$sum5$i)|0);
          HEAP32[$474>>2] = $465;
          $$sum6$i = (($247) + 12)|0;
          $475 = (($v$3$lcssa$i) + ($$sum6$i)|0);
          HEAP32[$475>>2] = $349;
          $$sum7$i = (($247) + 8)|0;
          $476 = (($v$3$lcssa$i) + ($$sum7$i)|0);
          HEAP32[$476>>2] = $349;
          break;
         }
         $477 = HEAP32[$465>>2]|0;
         $478 = ($I7$0$i|0)==(31);
         if ($478) {
          $486 = 0;
         } else {
          $479 = $I7$0$i >>> 1;
          $480 = (25 - ($479))|0;
          $486 = $480;
         }
         $481 = (($477) + 4|0);
         $482 = HEAP32[$481>>2]|0;
         $483 = $482 & -8;
         $484 = ($483|0)==($rsize$3$lcssa$i|0);
         L225: do {
          if ($484) {
           $T$0$lcssa$i = $477;
          } else {
           $485 = $rsize$3$lcssa$i << $486;
           $K12$025$i = $485;$T$024$i = $477;
           while(1) {
            $493 = $K12$025$i >>> 31;
            $494 = ((($T$024$i) + ($493<<2)|0) + 16|0);
            $489 = HEAP32[$494>>2]|0;
            $495 = ($489|0)==(0|0);
            if ($495) {
             break;
            }
            $487 = $K12$025$i << 1;
            $488 = (($489) + 4|0);
            $490 = HEAP32[$488>>2]|0;
            $491 = $490 & -8;
            $492 = ($491|0)==($rsize$3$lcssa$i|0);
            if ($492) {
             $T$0$lcssa$i = $489;
             break L225;
            } else {
             $K12$025$i = $487;$T$024$i = $489;
            }
           }
           $496 = HEAP32[((2264 + 16|0))>>2]|0;
           $497 = ($494>>>0)<($496>>>0);
           if ($497) {
            _abort();
            // unreachable;
           } else {
            HEAP32[$494>>2] = $349;
            $$sum11$i = (($247) + 24)|0;
            $498 = (($v$3$lcssa$i) + ($$sum11$i)|0);
            HEAP32[$498>>2] = $T$024$i;
            $$sum12$i = (($247) + 12)|0;
            $499 = (($v$3$lcssa$i) + ($$sum12$i)|0);
            HEAP32[$499>>2] = $349;
            $$sum13$i = (($247) + 8)|0;
            $500 = (($v$3$lcssa$i) + ($$sum13$i)|0);
            HEAP32[$500>>2] = $349;
            break L204;
           }
          }
         } while(0);
         $501 = (($T$0$lcssa$i) + 8|0);
         $502 = HEAP32[$501>>2]|0;
         $503 = HEAP32[((2264 + 16|0))>>2]|0;
         $504 = ($T$0$lcssa$i>>>0)<($503>>>0);
         if ($504) {
          _abort();
          // unreachable;
         }
         $505 = ($502>>>0)<($503>>>0);
         if ($505) {
          _abort();
          // unreachable;
         } else {
          $506 = (($502) + 12|0);
          HEAP32[$506>>2] = $349;
          HEAP32[$501>>2] = $349;
          $$sum8$i = (($247) + 8)|0;
          $507 = (($v$3$lcssa$i) + ($$sum8$i)|0);
          HEAP32[$507>>2] = $502;
          $$sum9$i = (($247) + 12)|0;
          $508 = (($v$3$lcssa$i) + ($$sum9$i)|0);
          HEAP32[$508>>2] = $T$0$lcssa$i;
          $$sum10$i = (($247) + 24)|0;
          $509 = (($v$3$lcssa$i) + ($$sum10$i)|0);
          HEAP32[$509>>2] = 0;
          break;
         }
        }
       } while(0);
       $510 = (($v$3$lcssa$i) + 8|0);
       $mem$0 = $510;
       STACKTOP = sp;return ($mem$0|0);
      } else {
       $nb$0 = $247;
      }
     }
    }
   }
  }
 } while(0);
 $511 = HEAP32[((2264 + 8|0))>>2]|0;
 $512 = ($nb$0>>>0)>($511>>>0);
 if (!($512)) {
  $513 = (($511) - ($nb$0))|0;
  $514 = HEAP32[((2264 + 20|0))>>2]|0;
  $515 = ($513>>>0)>(15);
  if ($515) {
   $516 = (($514) + ($nb$0)|0);
   HEAP32[((2264 + 20|0))>>2] = $516;
   HEAP32[((2264 + 8|0))>>2] = $513;
   $517 = $513 | 1;
   $$sum2 = (($nb$0) + 4)|0;
   $518 = (($514) + ($$sum2)|0);
   HEAP32[$518>>2] = $517;
   $519 = (($514) + ($511)|0);
   HEAP32[$519>>2] = $513;
   $520 = $nb$0 | 3;
   $521 = (($514) + 4|0);
   HEAP32[$521>>2] = $520;
  } else {
   HEAP32[((2264 + 8|0))>>2] = 0;
   HEAP32[((2264 + 20|0))>>2] = 0;
   $522 = $511 | 3;
   $523 = (($514) + 4|0);
   HEAP32[$523>>2] = $522;
   $$sum1 = (($511) + 4)|0;
   $524 = (($514) + ($$sum1)|0);
   $525 = HEAP32[$524>>2]|0;
   $526 = $525 | 1;
   HEAP32[$524>>2] = $526;
  }
  $527 = (($514) + 8|0);
  $mem$0 = $527;
  STACKTOP = sp;return ($mem$0|0);
 }
 $528 = HEAP32[((2264 + 12|0))>>2]|0;
 $529 = ($nb$0>>>0)<($528>>>0);
 if ($529) {
  $530 = (($528) - ($nb$0))|0;
  HEAP32[((2264 + 12|0))>>2] = $530;
  $531 = HEAP32[((2264 + 24|0))>>2]|0;
  $532 = (($531) + ($nb$0)|0);
  HEAP32[((2264 + 24|0))>>2] = $532;
  $533 = $530 | 1;
  $$sum = (($nb$0) + 4)|0;
  $534 = (($531) + ($$sum)|0);
  HEAP32[$534>>2] = $533;
  $535 = $nb$0 | 3;
  $536 = (($531) + 4|0);
  HEAP32[$536>>2] = $535;
  $537 = (($531) + 8|0);
  $mem$0 = $537;
  STACKTOP = sp;return ($mem$0|0);
 }
 $538 = HEAP32[2736>>2]|0;
 $539 = ($538|0)==(0);
 do {
  if ($539) {
   $540 = (_sysconf(30)|0);
   $541 = (($540) + -1)|0;
   $542 = $541 & $540;
   $543 = ($542|0)==(0);
   if ($543) {
    HEAP32[((2736 + 8|0))>>2] = $540;
    HEAP32[((2736 + 4|0))>>2] = $540;
    HEAP32[((2736 + 12|0))>>2] = -1;
    HEAP32[((2736 + 16|0))>>2] = -1;
    HEAP32[((2736 + 20|0))>>2] = 0;
    HEAP32[((2264 + 444|0))>>2] = 0;
    $544 = (_time((0|0))|0);
    $545 = $544 & -16;
    $546 = $545 ^ 1431655768;
    HEAP32[2736>>2] = $546;
    break;
   } else {
    _abort();
    // unreachable;
   }
  }
 } while(0);
 $547 = (($nb$0) + 48)|0;
 $548 = HEAP32[((2736 + 8|0))>>2]|0;
 $549 = (($nb$0) + 47)|0;
 $550 = (($548) + ($549))|0;
 $551 = (0 - ($548))|0;
 $552 = $550 & $551;
 $553 = ($552>>>0)>($nb$0>>>0);
 if (!($553)) {
  $mem$0 = 0;
  STACKTOP = sp;return ($mem$0|0);
 }
 $554 = HEAP32[((2264 + 440|0))>>2]|0;
 $555 = ($554|0)==(0);
 if (!($555)) {
  $556 = HEAP32[((2264 + 432|0))>>2]|0;
  $557 = (($556) + ($552))|0;
  $558 = ($557>>>0)<=($556>>>0);
  $559 = ($557>>>0)>($554>>>0);
  $or$cond1$i = $558 | $559;
  if ($or$cond1$i) {
   $mem$0 = 0;
   STACKTOP = sp;return ($mem$0|0);
  }
 }
 $560 = HEAP32[((2264 + 444|0))>>2]|0;
 $561 = $560 & 4;
 $562 = ($561|0)==(0);
 L269: do {
  if ($562) {
   $563 = HEAP32[((2264 + 24|0))>>2]|0;
   $564 = ($563|0)==(0|0);
   L271: do {
    if ($564) {
     label = 182;
    } else {
     $sp$0$i$i = ((2264 + 448|0));
     while(1) {
      $565 = HEAP32[$sp$0$i$i>>2]|0;
      $566 = ($565>>>0)>($563>>>0);
      if (!($566)) {
       $567 = (($sp$0$i$i) + 4|0);
       $568 = HEAP32[$567>>2]|0;
       $569 = (($565) + ($568)|0);
       $570 = ($569>>>0)>($563>>>0);
       if ($570) {
        break;
       }
      }
      $571 = (($sp$0$i$i) + 8|0);
      $572 = HEAP32[$571>>2]|0;
      $573 = ($572|0)==(0|0);
      if ($573) {
       label = 182;
       break L271;
      } else {
       $sp$0$i$i = $572;
      }
     }
     $574 = ($sp$0$i$i|0)==(0|0);
     if ($574) {
      label = 182;
     } else {
      $597 = HEAP32[((2264 + 12|0))>>2]|0;
      $598 = (($550) - ($597))|0;
      $599 = $598 & $551;
      $600 = ($599>>>0)<(2147483647);
      if ($600) {
       $601 = (_sbrk(($599|0))|0);
       $602 = HEAP32[$sp$0$i$i>>2]|0;
       $603 = HEAP32[$567>>2]|0;
       $604 = (($602) + ($603)|0);
       $605 = ($601|0)==($604|0);
       $$3$i = $605 ? $599 : 0;
       $$4$i = $605 ? $601 : (-1);
       $br$0$i = $601;$ssize$1$i = $599;$tbase$0$i = $$4$i;$tsize$0$i = $$3$i;
       label = 191;
      } else {
       $tsize$0323841$i = 0;
      }
     }
    }
   } while(0);
   do {
    if ((label|0) == 182) {
     $575 = (_sbrk(0)|0);
     $576 = ($575|0)==((-1)|0);
     if ($576) {
      $tsize$0323841$i = 0;
     } else {
      $577 = $575;
      $578 = HEAP32[((2736 + 4|0))>>2]|0;
      $579 = (($578) + -1)|0;
      $580 = $579 & $577;
      $581 = ($580|0)==(0);
      if ($581) {
       $ssize$0$i = $552;
      } else {
       $582 = (($579) + ($577))|0;
       $583 = (0 - ($578))|0;
       $584 = $582 & $583;
       $585 = (($552) - ($577))|0;
       $586 = (($585) + ($584))|0;
       $ssize$0$i = $586;
      }
      $587 = HEAP32[((2264 + 432|0))>>2]|0;
      $588 = (($587) + ($ssize$0$i))|0;
      $589 = ($ssize$0$i>>>0)>($nb$0>>>0);
      $590 = ($ssize$0$i>>>0)<(2147483647);
      $or$cond$i29 = $589 & $590;
      if ($or$cond$i29) {
       $591 = HEAP32[((2264 + 440|0))>>2]|0;
       $592 = ($591|0)==(0);
       if (!($592)) {
        $593 = ($588>>>0)<=($587>>>0);
        $594 = ($588>>>0)>($591>>>0);
        $or$cond2$i = $593 | $594;
        if ($or$cond2$i) {
         $tsize$0323841$i = 0;
         break;
        }
       }
       $595 = (_sbrk(($ssize$0$i|0))|0);
       $596 = ($595|0)==($575|0);
       $ssize$0$$i = $596 ? $ssize$0$i : 0;
       $$$i = $596 ? $575 : (-1);
       $br$0$i = $595;$ssize$1$i = $ssize$0$i;$tbase$0$i = $$$i;$tsize$0$i = $ssize$0$$i;
       label = 191;
      } else {
       $tsize$0323841$i = 0;
      }
     }
    }
   } while(0);
   L291: do {
    if ((label|0) == 191) {
     $606 = (0 - ($ssize$1$i))|0;
     $607 = ($tbase$0$i|0)==((-1)|0);
     if (!($607)) {
      $tbase$247$i = $tbase$0$i;$tsize$246$i = $tsize$0$i;
      label = 202;
      break L269;
     }
     $608 = ($br$0$i|0)!=((-1)|0);
     $609 = ($ssize$1$i>>>0)<(2147483647);
     $or$cond5$i = $608 & $609;
     $610 = ($ssize$1$i>>>0)<($547>>>0);
     $or$cond6$i = $or$cond5$i & $610;
     do {
      if ($or$cond6$i) {
       $611 = HEAP32[((2736 + 8|0))>>2]|0;
       $612 = (($549) - ($ssize$1$i))|0;
       $613 = (($612) + ($611))|0;
       $614 = (0 - ($611))|0;
       $615 = $613 & $614;
       $616 = ($615>>>0)<(2147483647);
       if ($616) {
        $617 = (_sbrk(($615|0))|0);
        $618 = ($617|0)==((-1)|0);
        if ($618) {
         (_sbrk(($606|0))|0);
         $tsize$0323841$i = $tsize$0$i;
         break L291;
        } else {
         $619 = (($615) + ($ssize$1$i))|0;
         $ssize$2$i = $619;
         break;
        }
       } else {
        $ssize$2$i = $ssize$1$i;
       }
      } else {
       $ssize$2$i = $ssize$1$i;
      }
     } while(0);
     $620 = ($br$0$i|0)==((-1)|0);
     if ($620) {
      $tsize$0323841$i = $tsize$0$i;
     } else {
      $tbase$247$i = $br$0$i;$tsize$246$i = $ssize$2$i;
      label = 202;
      break L269;
     }
    }
   } while(0);
   $621 = HEAP32[((2264 + 444|0))>>2]|0;
   $622 = $621 | 4;
   HEAP32[((2264 + 444|0))>>2] = $622;
   $tsize$1$i = $tsize$0323841$i;
   label = 199;
  } else {
   $tsize$1$i = 0;
   label = 199;
  }
 } while(0);
 if ((label|0) == 199) {
  $623 = ($552>>>0)<(2147483647);
  if ($623) {
   $624 = (_sbrk(($552|0))|0);
   $625 = (_sbrk(0)|0);
   $notlhs$i = ($624|0)!=((-1)|0);
   $notrhs$i = ($625|0)!=((-1)|0);
   $or$cond8$not$i = $notrhs$i & $notlhs$i;
   $626 = ($624>>>0)<($625>>>0);
   $or$cond9$i = $or$cond8$not$i & $626;
   if ($or$cond9$i) {
    $627 = $625;
    $628 = $624;
    $629 = (($627) - ($628))|0;
    $630 = (($nb$0) + 40)|0;
    $631 = ($629>>>0)>($630>>>0);
    $$tsize$1$i = $631 ? $629 : $tsize$1$i;
    if ($631) {
     $tbase$247$i = $624;$tsize$246$i = $$tsize$1$i;
     label = 202;
    }
   }
  }
 }
 if ((label|0) == 202) {
  $632 = HEAP32[((2264 + 432|0))>>2]|0;
  $633 = (($632) + ($tsize$246$i))|0;
  HEAP32[((2264 + 432|0))>>2] = $633;
  $634 = HEAP32[((2264 + 436|0))>>2]|0;
  $635 = ($633>>>0)>($634>>>0);
  if ($635) {
   HEAP32[((2264 + 436|0))>>2] = $633;
  }
  $636 = HEAP32[((2264 + 24|0))>>2]|0;
  $637 = ($636|0)==(0|0);
  L311: do {
   if ($637) {
    $638 = HEAP32[((2264 + 16|0))>>2]|0;
    $639 = ($638|0)==(0|0);
    $640 = ($tbase$247$i>>>0)<($638>>>0);
    $or$cond10$i = $639 | $640;
    if ($or$cond10$i) {
     HEAP32[((2264 + 16|0))>>2] = $tbase$247$i;
    }
    HEAP32[((2264 + 448|0))>>2] = $tbase$247$i;
    HEAP32[((2264 + 452|0))>>2] = $tsize$246$i;
    HEAP32[((2264 + 460|0))>>2] = 0;
    $641 = HEAP32[2736>>2]|0;
    HEAP32[((2264 + 36|0))>>2] = $641;
    HEAP32[((2264 + 32|0))>>2] = -1;
    $i$02$i$i = 0;
    while(1) {
     $642 = $i$02$i$i << 1;
     $643 = ((2264 + ($642<<2)|0) + 40|0);
     $$sum$i$i = (($642) + 3)|0;
     $644 = ((2264 + ($$sum$i$i<<2)|0) + 40|0);
     HEAP32[$644>>2] = $643;
     $$sum1$i$i = (($642) + 2)|0;
     $645 = ((2264 + ($$sum1$i$i<<2)|0) + 40|0);
     HEAP32[$645>>2] = $643;
     $646 = (($i$02$i$i) + 1)|0;
     $exitcond$i$i = ($646|0)==(32);
     if ($exitcond$i$i) {
      break;
     } else {
      $i$02$i$i = $646;
     }
    }
    $647 = (($tsize$246$i) + -40)|0;
    $648 = (($tbase$247$i) + 8|0);
    $649 = $648;
    $650 = $649 & 7;
    $651 = ($650|0)==(0);
    if ($651) {
     $655 = 0;
    } else {
     $652 = (0 - ($649))|0;
     $653 = $652 & 7;
     $655 = $653;
    }
    $654 = (($tbase$247$i) + ($655)|0);
    $656 = (($647) - ($655))|0;
    HEAP32[((2264 + 24|0))>>2] = $654;
    HEAP32[((2264 + 12|0))>>2] = $656;
    $657 = $656 | 1;
    $$sum$i14$i = (($655) + 4)|0;
    $658 = (($tbase$247$i) + ($$sum$i14$i)|0);
    HEAP32[$658>>2] = $657;
    $$sum2$i$i = (($tsize$246$i) + -36)|0;
    $659 = (($tbase$247$i) + ($$sum2$i$i)|0);
    HEAP32[$659>>2] = 40;
    $660 = HEAP32[((2736 + 16|0))>>2]|0;
    HEAP32[((2264 + 28|0))>>2] = $660;
   } else {
    $sp$075$i = ((2264 + 448|0));
    while(1) {
     $661 = HEAP32[$sp$075$i>>2]|0;
     $662 = (($sp$075$i) + 4|0);
     $663 = HEAP32[$662>>2]|0;
     $664 = (($661) + ($663)|0);
     $665 = ($tbase$247$i|0)==($664|0);
     if ($665) {
      label = 214;
      break;
     }
     $666 = (($sp$075$i) + 8|0);
     $667 = HEAP32[$666>>2]|0;
     $668 = ($667|0)==(0|0);
     if ($668) {
      break;
     } else {
      $sp$075$i = $667;
     }
    }
    if ((label|0) == 214) {
     $669 = (($sp$075$i) + 12|0);
     $670 = HEAP32[$669>>2]|0;
     $671 = $670 & 8;
     $672 = ($671|0)==(0);
     if ($672) {
      $673 = ($636>>>0)>=($661>>>0);
      $674 = ($636>>>0)<($tbase$247$i>>>0);
      $or$cond49$i = $673 & $674;
      if ($or$cond49$i) {
       $675 = (($663) + ($tsize$246$i))|0;
       HEAP32[$662>>2] = $675;
       $676 = HEAP32[((2264 + 12|0))>>2]|0;
       $677 = (($676) + ($tsize$246$i))|0;
       $678 = (($636) + 8|0);
       $679 = $678;
       $680 = $679 & 7;
       $681 = ($680|0)==(0);
       if ($681) {
        $685 = 0;
       } else {
        $682 = (0 - ($679))|0;
        $683 = $682 & 7;
        $685 = $683;
       }
       $684 = (($636) + ($685)|0);
       $686 = (($677) - ($685))|0;
       HEAP32[((2264 + 24|0))>>2] = $684;
       HEAP32[((2264 + 12|0))>>2] = $686;
       $687 = $686 | 1;
       $$sum$i18$i = (($685) + 4)|0;
       $688 = (($636) + ($$sum$i18$i)|0);
       HEAP32[$688>>2] = $687;
       $$sum2$i19$i = (($677) + 4)|0;
       $689 = (($636) + ($$sum2$i19$i)|0);
       HEAP32[$689>>2] = 40;
       $690 = HEAP32[((2736 + 16|0))>>2]|0;
       HEAP32[((2264 + 28|0))>>2] = $690;
       break;
      }
     }
    }
    $691 = HEAP32[((2264 + 16|0))>>2]|0;
    $692 = ($tbase$247$i>>>0)<($691>>>0);
    if ($692) {
     HEAP32[((2264 + 16|0))>>2] = $tbase$247$i;
    }
    $693 = (($tbase$247$i) + ($tsize$246$i)|0);
    $sp$168$i = ((2264 + 448|0));
    while(1) {
     $694 = HEAP32[$sp$168$i>>2]|0;
     $695 = ($694|0)==($693|0);
     if ($695) {
      label = 224;
      break;
     }
     $696 = (($sp$168$i) + 8|0);
     $697 = HEAP32[$696>>2]|0;
     $698 = ($697|0)==(0|0);
     if ($698) {
      break;
     } else {
      $sp$168$i = $697;
     }
    }
    if ((label|0) == 224) {
     $699 = (($sp$168$i) + 12|0);
     $700 = HEAP32[$699>>2]|0;
     $701 = $700 & 8;
     $702 = ($701|0)==(0);
     if ($702) {
      HEAP32[$sp$168$i>>2] = $tbase$247$i;
      $703 = (($sp$168$i) + 4|0);
      $704 = HEAP32[$703>>2]|0;
      $705 = (($704) + ($tsize$246$i))|0;
      HEAP32[$703>>2] = $705;
      $706 = (($tbase$247$i) + 8|0);
      $707 = $706;
      $708 = $707 & 7;
      $709 = ($708|0)==(0);
      if ($709) {
       $713 = 0;
      } else {
       $710 = (0 - ($707))|0;
       $711 = $710 & 7;
       $713 = $711;
      }
      $712 = (($tbase$247$i) + ($713)|0);
      $$sum107$i = (($tsize$246$i) + 8)|0;
      $714 = (($tbase$247$i) + ($$sum107$i)|0);
      $715 = $714;
      $716 = $715 & 7;
      $717 = ($716|0)==(0);
      if ($717) {
       $720 = 0;
      } else {
       $718 = (0 - ($715))|0;
       $719 = $718 & 7;
       $720 = $719;
      }
      $$sum108$i = (($720) + ($tsize$246$i))|0;
      $721 = (($tbase$247$i) + ($$sum108$i)|0);
      $722 = $721;
      $723 = $712;
      $724 = (($722) - ($723))|0;
      $$sum$i21$i = (($713) + ($nb$0))|0;
      $725 = (($tbase$247$i) + ($$sum$i21$i)|0);
      $726 = (($724) - ($nb$0))|0;
      $727 = $nb$0 | 3;
      $$sum1$i22$i = (($713) + 4)|0;
      $728 = (($tbase$247$i) + ($$sum1$i22$i)|0);
      HEAP32[$728>>2] = $727;
      $729 = HEAP32[((2264 + 24|0))>>2]|0;
      $730 = ($721|0)==($729|0);
      L348: do {
       if ($730) {
        $731 = HEAP32[((2264 + 12|0))>>2]|0;
        $732 = (($731) + ($726))|0;
        HEAP32[((2264 + 12|0))>>2] = $732;
        HEAP32[((2264 + 24|0))>>2] = $725;
        $733 = $732 | 1;
        $$sum42$i$i = (($$sum$i21$i) + 4)|0;
        $734 = (($tbase$247$i) + ($$sum42$i$i)|0);
        HEAP32[$734>>2] = $733;
       } else {
        $735 = HEAP32[((2264 + 20|0))>>2]|0;
        $736 = ($721|0)==($735|0);
        if ($736) {
         $737 = HEAP32[((2264 + 8|0))>>2]|0;
         $738 = (($737) + ($726))|0;
         HEAP32[((2264 + 8|0))>>2] = $738;
         HEAP32[((2264 + 20|0))>>2] = $725;
         $739 = $738 | 1;
         $$sum40$i$i = (($$sum$i21$i) + 4)|0;
         $740 = (($tbase$247$i) + ($$sum40$i$i)|0);
         HEAP32[$740>>2] = $739;
         $$sum41$i$i = (($738) + ($$sum$i21$i))|0;
         $741 = (($tbase$247$i) + ($$sum41$i$i)|0);
         HEAP32[$741>>2] = $738;
         break;
        }
        $$sum2$i23$i = (($tsize$246$i) + 4)|0;
        $$sum109$i = (($$sum2$i23$i) + ($720))|0;
        $742 = (($tbase$247$i) + ($$sum109$i)|0);
        $743 = HEAP32[$742>>2]|0;
        $744 = $743 & 3;
        $745 = ($744|0)==(1);
        if ($745) {
         $746 = $743 & -8;
         $747 = $743 >>> 3;
         $748 = ($743>>>0)<(256);
         L356: do {
          if ($748) {
           $$sum3738$i$i = $720 | 8;
           $$sum119$i = (($$sum3738$i$i) + ($tsize$246$i))|0;
           $749 = (($tbase$247$i) + ($$sum119$i)|0);
           $750 = HEAP32[$749>>2]|0;
           $$sum39$i$i = (($tsize$246$i) + 12)|0;
           $$sum120$i = (($$sum39$i$i) + ($720))|0;
           $751 = (($tbase$247$i) + ($$sum120$i)|0);
           $752 = HEAP32[$751>>2]|0;
           $753 = $747 << 1;
           $754 = ((2264 + ($753<<2)|0) + 40|0);
           $755 = ($750|0)==($754|0);
           do {
            if (!($755)) {
             $756 = HEAP32[((2264 + 16|0))>>2]|0;
             $757 = ($750>>>0)<($756>>>0);
             if ($757) {
              _abort();
              // unreachable;
             }
             $758 = (($750) + 12|0);
             $759 = HEAP32[$758>>2]|0;
             $760 = ($759|0)==($721|0);
             if ($760) {
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $761 = ($752|0)==($750|0);
           if ($761) {
            $762 = 1 << $747;
            $763 = $762 ^ -1;
            $764 = HEAP32[2264>>2]|0;
            $765 = $764 & $763;
            HEAP32[2264>>2] = $765;
            break;
           }
           $766 = ($752|0)==($754|0);
           do {
            if ($766) {
             $$pre57$i$i = (($752) + 8|0);
             $$pre$phi58$i$iZ2D = $$pre57$i$i;
            } else {
             $767 = HEAP32[((2264 + 16|0))>>2]|0;
             $768 = ($752>>>0)<($767>>>0);
             if ($768) {
              _abort();
              // unreachable;
             }
             $769 = (($752) + 8|0);
             $770 = HEAP32[$769>>2]|0;
             $771 = ($770|0)==($721|0);
             if ($771) {
              $$pre$phi58$i$iZ2D = $769;
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $772 = (($750) + 12|0);
           HEAP32[$772>>2] = $752;
           HEAP32[$$pre$phi58$i$iZ2D>>2] = $750;
          } else {
           $$sum34$i$i = $720 | 24;
           $$sum110$i = (($$sum34$i$i) + ($tsize$246$i))|0;
           $773 = (($tbase$247$i) + ($$sum110$i)|0);
           $774 = HEAP32[$773>>2]|0;
           $$sum5$i$i = (($tsize$246$i) + 12)|0;
           $$sum111$i = (($$sum5$i$i) + ($720))|0;
           $775 = (($tbase$247$i) + ($$sum111$i)|0);
           $776 = HEAP32[$775>>2]|0;
           $777 = ($776|0)==($721|0);
           do {
            if ($777) {
             $$sum67$i$i = $720 | 16;
             $$sum117$i = (($$sum2$i23$i) + ($$sum67$i$i))|0;
             $788 = (($tbase$247$i) + ($$sum117$i)|0);
             $789 = HEAP32[$788>>2]|0;
             $790 = ($789|0)==(0|0);
             if ($790) {
              $$sum118$i = (($$sum67$i$i) + ($tsize$246$i))|0;
              $791 = (($tbase$247$i) + ($$sum118$i)|0);
              $792 = HEAP32[$791>>2]|0;
              $793 = ($792|0)==(0|0);
              if ($793) {
               $R$1$i$i = 0;
               break;
              } else {
               $R$0$i$i = $792;$RP$0$i$i = $791;
              }
             } else {
              $R$0$i$i = $789;$RP$0$i$i = $788;
             }
             while(1) {
              $794 = (($R$0$i$i) + 20|0);
              $795 = HEAP32[$794>>2]|0;
              $796 = ($795|0)==(0|0);
              if (!($796)) {
               $R$0$i$i = $795;$RP$0$i$i = $794;
               continue;
              }
              $797 = (($R$0$i$i) + 16|0);
              $798 = HEAP32[$797>>2]|0;
              $799 = ($798|0)==(0|0);
              if ($799) {
               break;
              } else {
               $R$0$i$i = $798;$RP$0$i$i = $797;
              }
             }
             $800 = HEAP32[((2264 + 16|0))>>2]|0;
             $801 = ($RP$0$i$i>>>0)<($800>>>0);
             if ($801) {
              _abort();
              // unreachable;
             } else {
              HEAP32[$RP$0$i$i>>2] = 0;
              $R$1$i$i = $R$0$i$i;
              break;
             }
            } else {
             $$sum3536$i$i = $720 | 8;
             $$sum112$i = (($$sum3536$i$i) + ($tsize$246$i))|0;
             $778 = (($tbase$247$i) + ($$sum112$i)|0);
             $779 = HEAP32[$778>>2]|0;
             $780 = HEAP32[((2264 + 16|0))>>2]|0;
             $781 = ($779>>>0)<($780>>>0);
             if ($781) {
              _abort();
              // unreachable;
             }
             $782 = (($779) + 12|0);
             $783 = HEAP32[$782>>2]|0;
             $784 = ($783|0)==($721|0);
             if (!($784)) {
              _abort();
              // unreachable;
             }
             $785 = (($776) + 8|0);
             $786 = HEAP32[$785>>2]|0;
             $787 = ($786|0)==($721|0);
             if ($787) {
              HEAP32[$782>>2] = $776;
              HEAP32[$785>>2] = $779;
              $R$1$i$i = $776;
              break;
             } else {
              _abort();
              // unreachable;
             }
            }
           } while(0);
           $802 = ($774|0)==(0|0);
           if ($802) {
            break;
           }
           $$sum30$i$i = (($tsize$246$i) + 28)|0;
           $$sum113$i = (($$sum30$i$i) + ($720))|0;
           $803 = (($tbase$247$i) + ($$sum113$i)|0);
           $804 = HEAP32[$803>>2]|0;
           $805 = ((2264 + ($804<<2)|0) + 304|0);
           $806 = HEAP32[$805>>2]|0;
           $807 = ($721|0)==($806|0);
           do {
            if ($807) {
             HEAP32[$805>>2] = $R$1$i$i;
             $cond$i$i = ($R$1$i$i|0)==(0|0);
             if (!($cond$i$i)) {
              break;
             }
             $808 = 1 << $804;
             $809 = $808 ^ -1;
             $810 = HEAP32[((2264 + 4|0))>>2]|0;
             $811 = $810 & $809;
             HEAP32[((2264 + 4|0))>>2] = $811;
             break L356;
            } else {
             $812 = HEAP32[((2264 + 16|0))>>2]|0;
             $813 = ($774>>>0)<($812>>>0);
             if ($813) {
              _abort();
              // unreachable;
             }
             $814 = (($774) + 16|0);
             $815 = HEAP32[$814>>2]|0;
             $816 = ($815|0)==($721|0);
             if ($816) {
              HEAP32[$814>>2] = $R$1$i$i;
             } else {
              $817 = (($774) + 20|0);
              HEAP32[$817>>2] = $R$1$i$i;
             }
             $818 = ($R$1$i$i|0)==(0|0);
             if ($818) {
              break L356;
             }
            }
           } while(0);
           $819 = HEAP32[((2264 + 16|0))>>2]|0;
           $820 = ($R$1$i$i>>>0)<($819>>>0);
           if ($820) {
            _abort();
            // unreachable;
           }
           $821 = (($R$1$i$i) + 24|0);
           HEAP32[$821>>2] = $774;
           $$sum3132$i$i = $720 | 16;
           $$sum114$i = (($$sum3132$i$i) + ($tsize$246$i))|0;
           $822 = (($tbase$247$i) + ($$sum114$i)|0);
           $823 = HEAP32[$822>>2]|0;
           $824 = ($823|0)==(0|0);
           do {
            if (!($824)) {
             $825 = HEAP32[((2264 + 16|0))>>2]|0;
             $826 = ($823>>>0)<($825>>>0);
             if ($826) {
              _abort();
              // unreachable;
             } else {
              $827 = (($R$1$i$i) + 16|0);
              HEAP32[$827>>2] = $823;
              $828 = (($823) + 24|0);
              HEAP32[$828>>2] = $R$1$i$i;
              break;
             }
            }
           } while(0);
           $$sum115$i = (($$sum2$i23$i) + ($$sum3132$i$i))|0;
           $829 = (($tbase$247$i) + ($$sum115$i)|0);
           $830 = HEAP32[$829>>2]|0;
           $831 = ($830|0)==(0|0);
           if ($831) {
            break;
           }
           $832 = HEAP32[((2264 + 16|0))>>2]|0;
           $833 = ($830>>>0)<($832>>>0);
           if ($833) {
            _abort();
            // unreachable;
           } else {
            $834 = (($R$1$i$i) + 20|0);
            HEAP32[$834>>2] = $830;
            $835 = (($830) + 24|0);
            HEAP32[$835>>2] = $R$1$i$i;
            break;
           }
          }
         } while(0);
         $$sum9$i$i = $746 | $720;
         $$sum116$i = (($$sum9$i$i) + ($tsize$246$i))|0;
         $836 = (($tbase$247$i) + ($$sum116$i)|0);
         $837 = (($746) + ($726))|0;
         $oldfirst$0$i$i = $836;$qsize$0$i$i = $837;
        } else {
         $oldfirst$0$i$i = $721;$qsize$0$i$i = $726;
        }
        $838 = (($oldfirst$0$i$i) + 4|0);
        $839 = HEAP32[$838>>2]|0;
        $840 = $839 & -2;
        HEAP32[$838>>2] = $840;
        $841 = $qsize$0$i$i | 1;
        $$sum10$i$i = (($$sum$i21$i) + 4)|0;
        $842 = (($tbase$247$i) + ($$sum10$i$i)|0);
        HEAP32[$842>>2] = $841;
        $$sum11$i24$i = (($qsize$0$i$i) + ($$sum$i21$i))|0;
        $843 = (($tbase$247$i) + ($$sum11$i24$i)|0);
        HEAP32[$843>>2] = $qsize$0$i$i;
        $844 = $qsize$0$i$i >>> 3;
        $845 = ($qsize$0$i$i>>>0)<(256);
        if ($845) {
         $846 = $844 << 1;
         $847 = ((2264 + ($846<<2)|0) + 40|0);
         $848 = HEAP32[2264>>2]|0;
         $849 = 1 << $844;
         $850 = $848 & $849;
         $851 = ($850|0)==(0);
         do {
          if ($851) {
           $852 = $848 | $849;
           HEAP32[2264>>2] = $852;
           $$sum26$pre$i$i = (($846) + 2)|0;
           $$pre$i25$i = ((2264 + ($$sum26$pre$i$i<<2)|0) + 40|0);
           $$pre$phi$i26$iZ2D = $$pre$i25$i;$F4$0$i$i = $847;
          } else {
           $$sum29$i$i = (($846) + 2)|0;
           $853 = ((2264 + ($$sum29$i$i<<2)|0) + 40|0);
           $854 = HEAP32[$853>>2]|0;
           $855 = HEAP32[((2264 + 16|0))>>2]|0;
           $856 = ($854>>>0)<($855>>>0);
           if (!($856)) {
            $$pre$phi$i26$iZ2D = $853;$F4$0$i$i = $854;
            break;
           }
           _abort();
           // unreachable;
          }
         } while(0);
         HEAP32[$$pre$phi$i26$iZ2D>>2] = $725;
         $857 = (($F4$0$i$i) + 12|0);
         HEAP32[$857>>2] = $725;
         $$sum27$i$i = (($$sum$i21$i) + 8)|0;
         $858 = (($tbase$247$i) + ($$sum27$i$i)|0);
         HEAP32[$858>>2] = $F4$0$i$i;
         $$sum28$i$i = (($$sum$i21$i) + 12)|0;
         $859 = (($tbase$247$i) + ($$sum28$i$i)|0);
         HEAP32[$859>>2] = $847;
         break;
        }
        $860 = $qsize$0$i$i >>> 8;
        $861 = ($860|0)==(0);
        do {
         if ($861) {
          $I7$0$i$i = 0;
         } else {
          $862 = ($qsize$0$i$i>>>0)>(16777215);
          if ($862) {
           $I7$0$i$i = 31;
           break;
          }
          $863 = (($860) + 1048320)|0;
          $864 = $863 >>> 16;
          $865 = $864 & 8;
          $866 = $860 << $865;
          $867 = (($866) + 520192)|0;
          $868 = $867 >>> 16;
          $869 = $868 & 4;
          $870 = $869 | $865;
          $871 = $866 << $869;
          $872 = (($871) + 245760)|0;
          $873 = $872 >>> 16;
          $874 = $873 & 2;
          $875 = $870 | $874;
          $876 = (14 - ($875))|0;
          $877 = $871 << $874;
          $878 = $877 >>> 15;
          $879 = (($876) + ($878))|0;
          $880 = $879 << 1;
          $881 = (($879) + 7)|0;
          $882 = $qsize$0$i$i >>> $881;
          $883 = $882 & 1;
          $884 = $883 | $880;
          $I7$0$i$i = $884;
         }
        } while(0);
        $885 = ((2264 + ($I7$0$i$i<<2)|0) + 304|0);
        $$sum12$i$i = (($$sum$i21$i) + 28)|0;
        $886 = (($tbase$247$i) + ($$sum12$i$i)|0);
        HEAP32[$886>>2] = $I7$0$i$i;
        $$sum13$i$i = (($$sum$i21$i) + 16)|0;
        $887 = (($tbase$247$i) + ($$sum13$i$i)|0);
        $$sum14$i$i = (($$sum$i21$i) + 20)|0;
        $888 = (($tbase$247$i) + ($$sum14$i$i)|0);
        HEAP32[$888>>2] = 0;
        HEAP32[$887>>2] = 0;
        $889 = HEAP32[((2264 + 4|0))>>2]|0;
        $890 = 1 << $I7$0$i$i;
        $891 = $889 & $890;
        $892 = ($891|0)==(0);
        if ($892) {
         $893 = $889 | $890;
         HEAP32[((2264 + 4|0))>>2] = $893;
         HEAP32[$885>>2] = $725;
         $$sum15$i$i = (($$sum$i21$i) + 24)|0;
         $894 = (($tbase$247$i) + ($$sum15$i$i)|0);
         HEAP32[$894>>2] = $885;
         $$sum16$i$i = (($$sum$i21$i) + 12)|0;
         $895 = (($tbase$247$i) + ($$sum16$i$i)|0);
         HEAP32[$895>>2] = $725;
         $$sum17$i$i = (($$sum$i21$i) + 8)|0;
         $896 = (($tbase$247$i) + ($$sum17$i$i)|0);
         HEAP32[$896>>2] = $725;
         break;
        }
        $897 = HEAP32[$885>>2]|0;
        $898 = ($I7$0$i$i|0)==(31);
        if ($898) {
         $906 = 0;
        } else {
         $899 = $I7$0$i$i >>> 1;
         $900 = (25 - ($899))|0;
         $906 = $900;
        }
        $901 = (($897) + 4|0);
        $902 = HEAP32[$901>>2]|0;
        $903 = $902 & -8;
        $904 = ($903|0)==($qsize$0$i$i|0);
        L445: do {
         if ($904) {
          $T$0$lcssa$i28$i = $897;
         } else {
          $905 = $qsize$0$i$i << $906;
          $K8$052$i$i = $905;$T$051$i$i = $897;
          while(1) {
           $913 = $K8$052$i$i >>> 31;
           $914 = ((($T$051$i$i) + ($913<<2)|0) + 16|0);
           $909 = HEAP32[$914>>2]|0;
           $915 = ($909|0)==(0|0);
           if ($915) {
            break;
           }
           $907 = $K8$052$i$i << 1;
           $908 = (($909) + 4|0);
           $910 = HEAP32[$908>>2]|0;
           $911 = $910 & -8;
           $912 = ($911|0)==($qsize$0$i$i|0);
           if ($912) {
            $T$0$lcssa$i28$i = $909;
            break L445;
           } else {
            $K8$052$i$i = $907;$T$051$i$i = $909;
           }
          }
          $916 = HEAP32[((2264 + 16|0))>>2]|0;
          $917 = ($914>>>0)<($916>>>0);
          if ($917) {
           _abort();
           // unreachable;
          } else {
           HEAP32[$914>>2] = $725;
           $$sum23$i$i = (($$sum$i21$i) + 24)|0;
           $918 = (($tbase$247$i) + ($$sum23$i$i)|0);
           HEAP32[$918>>2] = $T$051$i$i;
           $$sum24$i$i = (($$sum$i21$i) + 12)|0;
           $919 = (($tbase$247$i) + ($$sum24$i$i)|0);
           HEAP32[$919>>2] = $725;
           $$sum25$i$i = (($$sum$i21$i) + 8)|0;
           $920 = (($tbase$247$i) + ($$sum25$i$i)|0);
           HEAP32[$920>>2] = $725;
           break L348;
          }
         }
        } while(0);
        $921 = (($T$0$lcssa$i28$i) + 8|0);
        $922 = HEAP32[$921>>2]|0;
        $923 = HEAP32[((2264 + 16|0))>>2]|0;
        $924 = ($T$0$lcssa$i28$i>>>0)<($923>>>0);
        if ($924) {
         _abort();
         // unreachable;
        }
        $925 = ($922>>>0)<($923>>>0);
        if ($925) {
         _abort();
         // unreachable;
        } else {
         $926 = (($922) + 12|0);
         HEAP32[$926>>2] = $725;
         HEAP32[$921>>2] = $725;
         $$sum20$i$i = (($$sum$i21$i) + 8)|0;
         $927 = (($tbase$247$i) + ($$sum20$i$i)|0);
         HEAP32[$927>>2] = $922;
         $$sum21$i$i = (($$sum$i21$i) + 12)|0;
         $928 = (($tbase$247$i) + ($$sum21$i$i)|0);
         HEAP32[$928>>2] = $T$0$lcssa$i28$i;
         $$sum22$i$i = (($$sum$i21$i) + 24)|0;
         $929 = (($tbase$247$i) + ($$sum22$i$i)|0);
         HEAP32[$929>>2] = 0;
         break;
        }
       }
      } while(0);
      $$sum1819$i$i = $713 | 8;
      $930 = (($tbase$247$i) + ($$sum1819$i$i)|0);
      $mem$0 = $930;
      STACKTOP = sp;return ($mem$0|0);
     }
    }
    $sp$0$i$i$i = ((2264 + 448|0));
    while(1) {
     $931 = HEAP32[$sp$0$i$i$i>>2]|0;
     $932 = ($931>>>0)>($636>>>0);
     if (!($932)) {
      $933 = (($sp$0$i$i$i) + 4|0);
      $934 = HEAP32[$933>>2]|0;
      $935 = (($931) + ($934)|0);
      $936 = ($935>>>0)>($636>>>0);
      if ($936) {
       break;
      }
     }
     $937 = (($sp$0$i$i$i) + 8|0);
     $938 = HEAP32[$937>>2]|0;
     $sp$0$i$i$i = $938;
    }
    $$sum$i15$i = (($934) + -47)|0;
    $$sum1$i16$i = (($934) + -39)|0;
    $939 = (($931) + ($$sum1$i16$i)|0);
    $940 = $939;
    $941 = $940 & 7;
    $942 = ($941|0)==(0);
    if ($942) {
     $945 = 0;
    } else {
     $943 = (0 - ($940))|0;
     $944 = $943 & 7;
     $945 = $944;
    }
    $$sum2$i17$i = (($$sum$i15$i) + ($945))|0;
    $946 = (($931) + ($$sum2$i17$i)|0);
    $947 = (($636) + 16|0);
    $948 = ($946>>>0)<($947>>>0);
    $949 = $948 ? $636 : $946;
    $950 = (($949) + 8|0);
    $951 = (($tsize$246$i) + -40)|0;
    $952 = (($tbase$247$i) + 8|0);
    $953 = $952;
    $954 = $953 & 7;
    $955 = ($954|0)==(0);
    if ($955) {
     $959 = 0;
    } else {
     $956 = (0 - ($953))|0;
     $957 = $956 & 7;
     $959 = $957;
    }
    $958 = (($tbase$247$i) + ($959)|0);
    $960 = (($951) - ($959))|0;
    HEAP32[((2264 + 24|0))>>2] = $958;
    HEAP32[((2264 + 12|0))>>2] = $960;
    $961 = $960 | 1;
    $$sum$i$i$i = (($959) + 4)|0;
    $962 = (($tbase$247$i) + ($$sum$i$i$i)|0);
    HEAP32[$962>>2] = $961;
    $$sum2$i$i$i = (($tsize$246$i) + -36)|0;
    $963 = (($tbase$247$i) + ($$sum2$i$i$i)|0);
    HEAP32[$963>>2] = 40;
    $964 = HEAP32[((2736 + 16|0))>>2]|0;
    HEAP32[((2264 + 28|0))>>2] = $964;
    $965 = (($949) + 4|0);
    HEAP32[$965>>2] = 27;
    ;HEAP32[$950+0>>2]=HEAP32[((2264 + 448|0))+0>>2]|0;HEAP32[$950+4>>2]=HEAP32[((2264 + 448|0))+4>>2]|0;HEAP32[$950+8>>2]=HEAP32[((2264 + 448|0))+8>>2]|0;HEAP32[$950+12>>2]=HEAP32[((2264 + 448|0))+12>>2]|0;
    HEAP32[((2264 + 448|0))>>2] = $tbase$247$i;
    HEAP32[((2264 + 452|0))>>2] = $tsize$246$i;
    HEAP32[((2264 + 460|0))>>2] = 0;
    HEAP32[((2264 + 456|0))>>2] = $950;
    $966 = (($949) + 28|0);
    HEAP32[$966>>2] = 7;
    $967 = (($949) + 32|0);
    $968 = ($967>>>0)<($935>>>0);
    if ($968) {
     $970 = $966;
     while(1) {
      $969 = (($970) + 4|0);
      HEAP32[$969>>2] = 7;
      $971 = (($970) + 8|0);
      $972 = ($971>>>0)<($935>>>0);
      if ($972) {
       $970 = $969;
      } else {
       break;
      }
     }
    }
    $973 = ($949|0)==($636|0);
    if (!($973)) {
     $974 = $949;
     $975 = $636;
     $976 = (($974) - ($975))|0;
     $977 = (($636) + ($976)|0);
     $$sum3$i$i = (($976) + 4)|0;
     $978 = (($636) + ($$sum3$i$i)|0);
     $979 = HEAP32[$978>>2]|0;
     $980 = $979 & -2;
     HEAP32[$978>>2] = $980;
     $981 = $976 | 1;
     $982 = (($636) + 4|0);
     HEAP32[$982>>2] = $981;
     HEAP32[$977>>2] = $976;
     $983 = $976 >>> 3;
     $984 = ($976>>>0)<(256);
     if ($984) {
      $985 = $983 << 1;
      $986 = ((2264 + ($985<<2)|0) + 40|0);
      $987 = HEAP32[2264>>2]|0;
      $988 = 1 << $983;
      $989 = $987 & $988;
      $990 = ($989|0)==(0);
      do {
       if ($990) {
        $991 = $987 | $988;
        HEAP32[2264>>2] = $991;
        $$sum10$pre$i$i = (($985) + 2)|0;
        $$pre$i$i = ((2264 + ($$sum10$pre$i$i<<2)|0) + 40|0);
        $$pre$phi$i$iZ2D = $$pre$i$i;$F$0$i$i = $986;
       } else {
        $$sum11$i$i = (($985) + 2)|0;
        $992 = ((2264 + ($$sum11$i$i<<2)|0) + 40|0);
        $993 = HEAP32[$992>>2]|0;
        $994 = HEAP32[((2264 + 16|0))>>2]|0;
        $995 = ($993>>>0)<($994>>>0);
        if (!($995)) {
         $$pre$phi$i$iZ2D = $992;$F$0$i$i = $993;
         break;
        }
        _abort();
        // unreachable;
       }
      } while(0);
      HEAP32[$$pre$phi$i$iZ2D>>2] = $636;
      $996 = (($F$0$i$i) + 12|0);
      HEAP32[$996>>2] = $636;
      $997 = (($636) + 8|0);
      HEAP32[$997>>2] = $F$0$i$i;
      $998 = (($636) + 12|0);
      HEAP32[$998>>2] = $986;
      break;
     }
     $999 = $976 >>> 8;
     $1000 = ($999|0)==(0);
     if ($1000) {
      $I1$0$i$i = 0;
     } else {
      $1001 = ($976>>>0)>(16777215);
      if ($1001) {
       $I1$0$i$i = 31;
      } else {
       $1002 = (($999) + 1048320)|0;
       $1003 = $1002 >>> 16;
       $1004 = $1003 & 8;
       $1005 = $999 << $1004;
       $1006 = (($1005) + 520192)|0;
       $1007 = $1006 >>> 16;
       $1008 = $1007 & 4;
       $1009 = $1008 | $1004;
       $1010 = $1005 << $1008;
       $1011 = (($1010) + 245760)|0;
       $1012 = $1011 >>> 16;
       $1013 = $1012 & 2;
       $1014 = $1009 | $1013;
       $1015 = (14 - ($1014))|0;
       $1016 = $1010 << $1013;
       $1017 = $1016 >>> 15;
       $1018 = (($1015) + ($1017))|0;
       $1019 = $1018 << 1;
       $1020 = (($1018) + 7)|0;
       $1021 = $976 >>> $1020;
       $1022 = $1021 & 1;
       $1023 = $1022 | $1019;
       $I1$0$i$i = $1023;
      }
     }
     $1024 = ((2264 + ($I1$0$i$i<<2)|0) + 304|0);
     $1025 = (($636) + 28|0);
     $I1$0$c$i$i = $I1$0$i$i;
     HEAP32[$1025>>2] = $I1$0$c$i$i;
     $1026 = (($636) + 20|0);
     HEAP32[$1026>>2] = 0;
     $1027 = (($636) + 16|0);
     HEAP32[$1027>>2] = 0;
     $1028 = HEAP32[((2264 + 4|0))>>2]|0;
     $1029 = 1 << $I1$0$i$i;
     $1030 = $1028 & $1029;
     $1031 = ($1030|0)==(0);
     if ($1031) {
      $1032 = $1028 | $1029;
      HEAP32[((2264 + 4|0))>>2] = $1032;
      HEAP32[$1024>>2] = $636;
      $1033 = (($636) + 24|0);
      HEAP32[$1033>>2] = $1024;
      $1034 = (($636) + 12|0);
      HEAP32[$1034>>2] = $636;
      $1035 = (($636) + 8|0);
      HEAP32[$1035>>2] = $636;
      break;
     }
     $1036 = HEAP32[$1024>>2]|0;
     $1037 = ($I1$0$i$i|0)==(31);
     if ($1037) {
      $1045 = 0;
     } else {
      $1038 = $I1$0$i$i >>> 1;
      $1039 = (25 - ($1038))|0;
      $1045 = $1039;
     }
     $1040 = (($1036) + 4|0);
     $1041 = HEAP32[$1040>>2]|0;
     $1042 = $1041 & -8;
     $1043 = ($1042|0)==($976|0);
     L499: do {
      if ($1043) {
       $T$0$lcssa$i$i = $1036;
      } else {
       $1044 = $976 << $1045;
       $K2$014$i$i = $1044;$T$013$i$i = $1036;
       while(1) {
        $1052 = $K2$014$i$i >>> 31;
        $1053 = ((($T$013$i$i) + ($1052<<2)|0) + 16|0);
        $1048 = HEAP32[$1053>>2]|0;
        $1054 = ($1048|0)==(0|0);
        if ($1054) {
         break;
        }
        $1046 = $K2$014$i$i << 1;
        $1047 = (($1048) + 4|0);
        $1049 = HEAP32[$1047>>2]|0;
        $1050 = $1049 & -8;
        $1051 = ($1050|0)==($976|0);
        if ($1051) {
         $T$0$lcssa$i$i = $1048;
         break L499;
        } else {
         $K2$014$i$i = $1046;$T$013$i$i = $1048;
        }
       }
       $1055 = HEAP32[((2264 + 16|0))>>2]|0;
       $1056 = ($1053>>>0)<($1055>>>0);
       if ($1056) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$1053>>2] = $636;
        $1057 = (($636) + 24|0);
        HEAP32[$1057>>2] = $T$013$i$i;
        $1058 = (($636) + 12|0);
        HEAP32[$1058>>2] = $636;
        $1059 = (($636) + 8|0);
        HEAP32[$1059>>2] = $636;
        break L311;
       }
      }
     } while(0);
     $1060 = (($T$0$lcssa$i$i) + 8|0);
     $1061 = HEAP32[$1060>>2]|0;
     $1062 = HEAP32[((2264 + 16|0))>>2]|0;
     $1063 = ($T$0$lcssa$i$i>>>0)<($1062>>>0);
     if ($1063) {
      _abort();
      // unreachable;
     }
     $1064 = ($1061>>>0)<($1062>>>0);
     if ($1064) {
      _abort();
      // unreachable;
     } else {
      $1065 = (($1061) + 12|0);
      HEAP32[$1065>>2] = $636;
      HEAP32[$1060>>2] = $636;
      $1066 = (($636) + 8|0);
      HEAP32[$1066>>2] = $1061;
      $1067 = (($636) + 12|0);
      HEAP32[$1067>>2] = $T$0$lcssa$i$i;
      $1068 = (($636) + 24|0);
      HEAP32[$1068>>2] = 0;
      break;
     }
    }
   }
  } while(0);
  $1069 = HEAP32[((2264 + 12|0))>>2]|0;
  $1070 = ($1069>>>0)>($nb$0>>>0);
  if ($1070) {
   $1071 = (($1069) - ($nb$0))|0;
   HEAP32[((2264 + 12|0))>>2] = $1071;
   $1072 = HEAP32[((2264 + 24|0))>>2]|0;
   $1073 = (($1072) + ($nb$0)|0);
   HEAP32[((2264 + 24|0))>>2] = $1073;
   $1074 = $1071 | 1;
   $$sum$i32 = (($nb$0) + 4)|0;
   $1075 = (($1072) + ($$sum$i32)|0);
   HEAP32[$1075>>2] = $1074;
   $1076 = $nb$0 | 3;
   $1077 = (($1072) + 4|0);
   HEAP32[$1077>>2] = $1076;
   $1078 = (($1072) + 8|0);
   $mem$0 = $1078;
   STACKTOP = sp;return ($mem$0|0);
  }
 }
 $1079 = (___errno_location()|0);
 HEAP32[$1079>>2] = 12;
 $mem$0 = 0;
 STACKTOP = sp;return ($mem$0|0);
}
function _free($mem) {
 $mem = $mem|0;
 var $$pre = 0, $$pre$phi68Z2D = 0, $$pre$phi70Z2D = 0, $$pre$phiZ2D = 0, $$pre67 = 0, $$pre69 = 0, $$sum = 0, $$sum16$pre = 0, $$sum17 = 0, $$sum18 = 0, $$sum19 = 0, $$sum2 = 0, $$sum20 = 0, $$sum2324 = 0, $$sum25 = 0, $$sum26 = 0, $$sum28 = 0, $$sum29 = 0, $$sum3 = 0, $$sum30 = 0;
 var $$sum31 = 0, $$sum32 = 0, $$sum33 = 0, $$sum34 = 0, $$sum35 = 0, $$sum36 = 0, $$sum37 = 0, $$sum5 = 0, $$sum67 = 0, $$sum8 = 0, $$sum9 = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0;
 var $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0;
 var $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0;
 var $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0;
 var $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0;
 var $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0;
 var $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0;
 var $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0;
 var $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0;
 var $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0;
 var $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0;
 var $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0;
 var $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0;
 var $322 = 0, $323 = 0, $324 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $F16$0 = 0, $I18$0 = 0, $I18$0$c = 0, $K19$057 = 0;
 var $R$0 = 0, $R$1 = 0, $R7$0 = 0, $R7$1 = 0, $RP$0 = 0, $RP9$0 = 0, $T$0$lcssa = 0, $T$056 = 0, $cond = 0, $cond54 = 0, $p$0 = 0, $psize$0 = 0, $psize$1 = 0, $sp$0$i = 0, $sp$0$in$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($mem|0)==(0|0);
 if ($0) {
  STACKTOP = sp;return;
 }
 $1 = (($mem) + -8|0);
 $2 = HEAP32[((2264 + 16|0))>>2]|0;
 $3 = ($1>>>0)<($2>>>0);
 if ($3) {
  _abort();
  // unreachable;
 }
 $4 = (($mem) + -4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $5 & 3;
 $7 = ($6|0)==(1);
 if ($7) {
  _abort();
  // unreachable;
 }
 $8 = $5 & -8;
 $$sum = (($8) + -8)|0;
 $9 = (($mem) + ($$sum)|0);
 $10 = $5 & 1;
 $11 = ($10|0)==(0);
 do {
  if ($11) {
   $12 = HEAP32[$1>>2]|0;
   $13 = ($6|0)==(0);
   if ($13) {
    STACKTOP = sp;return;
   }
   $$sum2 = (-8 - ($12))|0;
   $14 = (($mem) + ($$sum2)|0);
   $15 = (($12) + ($8))|0;
   $16 = ($14>>>0)<($2>>>0);
   if ($16) {
    _abort();
    // unreachable;
   }
   $17 = HEAP32[((2264 + 20|0))>>2]|0;
   $18 = ($14|0)==($17|0);
   if ($18) {
    $$sum3 = (($8) + -4)|0;
    $104 = (($mem) + ($$sum3)|0);
    $105 = HEAP32[$104>>2]|0;
    $106 = $105 & 3;
    $107 = ($106|0)==(3);
    if (!($107)) {
     $p$0 = $14;$psize$0 = $15;
     break;
    }
    HEAP32[((2264 + 8|0))>>2] = $15;
    $108 = HEAP32[$104>>2]|0;
    $109 = $108 & -2;
    HEAP32[$104>>2] = $109;
    $110 = $15 | 1;
    $$sum26 = (($$sum2) + 4)|0;
    $111 = (($mem) + ($$sum26)|0);
    HEAP32[$111>>2] = $110;
    HEAP32[$9>>2] = $15;
    STACKTOP = sp;return;
   }
   $19 = $12 >>> 3;
   $20 = ($12>>>0)<(256);
   if ($20) {
    $$sum36 = (($$sum2) + 8)|0;
    $21 = (($mem) + ($$sum36)|0);
    $22 = HEAP32[$21>>2]|0;
    $$sum37 = (($$sum2) + 12)|0;
    $23 = (($mem) + ($$sum37)|0);
    $24 = HEAP32[$23>>2]|0;
    $25 = $19 << 1;
    $26 = ((2264 + ($25<<2)|0) + 40|0);
    $27 = ($22|0)==($26|0);
    if (!($27)) {
     $28 = ($22>>>0)<($2>>>0);
     if ($28) {
      _abort();
      // unreachable;
     }
     $29 = (($22) + 12|0);
     $30 = HEAP32[$29>>2]|0;
     $31 = ($30|0)==($14|0);
     if (!($31)) {
      _abort();
      // unreachable;
     }
    }
    $32 = ($24|0)==($22|0);
    if ($32) {
     $33 = 1 << $19;
     $34 = $33 ^ -1;
     $35 = HEAP32[2264>>2]|0;
     $36 = $35 & $34;
     HEAP32[2264>>2] = $36;
     $p$0 = $14;$psize$0 = $15;
     break;
    }
    $37 = ($24|0)==($26|0);
    if ($37) {
     $$pre69 = (($24) + 8|0);
     $$pre$phi70Z2D = $$pre69;
    } else {
     $38 = ($24>>>0)<($2>>>0);
     if ($38) {
      _abort();
      // unreachable;
     }
     $39 = (($24) + 8|0);
     $40 = HEAP32[$39>>2]|0;
     $41 = ($40|0)==($14|0);
     if ($41) {
      $$pre$phi70Z2D = $39;
     } else {
      _abort();
      // unreachable;
     }
    }
    $42 = (($22) + 12|0);
    HEAP32[$42>>2] = $24;
    HEAP32[$$pre$phi70Z2D>>2] = $22;
    $p$0 = $14;$psize$0 = $15;
    break;
   }
   $$sum28 = (($$sum2) + 24)|0;
   $43 = (($mem) + ($$sum28)|0);
   $44 = HEAP32[$43>>2]|0;
   $$sum29 = (($$sum2) + 12)|0;
   $45 = (($mem) + ($$sum29)|0);
   $46 = HEAP32[$45>>2]|0;
   $47 = ($46|0)==($14|0);
   do {
    if ($47) {
     $$sum31 = (($$sum2) + 20)|0;
     $57 = (($mem) + ($$sum31)|0);
     $58 = HEAP32[$57>>2]|0;
     $59 = ($58|0)==(0|0);
     if ($59) {
      $$sum30 = (($$sum2) + 16)|0;
      $60 = (($mem) + ($$sum30)|0);
      $61 = HEAP32[$60>>2]|0;
      $62 = ($61|0)==(0|0);
      if ($62) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $61;$RP$0 = $60;
      }
     } else {
      $R$0 = $58;$RP$0 = $57;
     }
     while(1) {
      $63 = (($R$0) + 20|0);
      $64 = HEAP32[$63>>2]|0;
      $65 = ($64|0)==(0|0);
      if (!($65)) {
       $R$0 = $64;$RP$0 = $63;
       continue;
      }
      $66 = (($R$0) + 16|0);
      $67 = HEAP32[$66>>2]|0;
      $68 = ($67|0)==(0|0);
      if ($68) {
       break;
      } else {
       $R$0 = $67;$RP$0 = $66;
      }
     }
     $69 = ($RP$0>>>0)<($2>>>0);
     if ($69) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $$sum35 = (($$sum2) + 8)|0;
     $48 = (($mem) + ($$sum35)|0);
     $49 = HEAP32[$48>>2]|0;
     $50 = ($49>>>0)<($2>>>0);
     if ($50) {
      _abort();
      // unreachable;
     }
     $51 = (($49) + 12|0);
     $52 = HEAP32[$51>>2]|0;
     $53 = ($52|0)==($14|0);
     if (!($53)) {
      _abort();
      // unreachable;
     }
     $54 = (($46) + 8|0);
     $55 = HEAP32[$54>>2]|0;
     $56 = ($55|0)==($14|0);
     if ($56) {
      HEAP32[$51>>2] = $46;
      HEAP32[$54>>2] = $49;
      $R$1 = $46;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $70 = ($44|0)==(0|0);
   if ($70) {
    $p$0 = $14;$psize$0 = $15;
   } else {
    $$sum32 = (($$sum2) + 28)|0;
    $71 = (($mem) + ($$sum32)|0);
    $72 = HEAP32[$71>>2]|0;
    $73 = ((2264 + ($72<<2)|0) + 304|0);
    $74 = HEAP32[$73>>2]|0;
    $75 = ($14|0)==($74|0);
    if ($75) {
     HEAP32[$73>>2] = $R$1;
     $cond = ($R$1|0)==(0|0);
     if ($cond) {
      $76 = 1 << $72;
      $77 = $76 ^ -1;
      $78 = HEAP32[((2264 + 4|0))>>2]|0;
      $79 = $78 & $77;
      HEAP32[((2264 + 4|0))>>2] = $79;
      $p$0 = $14;$psize$0 = $15;
      break;
     }
    } else {
     $80 = HEAP32[((2264 + 16|0))>>2]|0;
     $81 = ($44>>>0)<($80>>>0);
     if ($81) {
      _abort();
      // unreachable;
     }
     $82 = (($44) + 16|0);
     $83 = HEAP32[$82>>2]|0;
     $84 = ($83|0)==($14|0);
     if ($84) {
      HEAP32[$82>>2] = $R$1;
     } else {
      $85 = (($44) + 20|0);
      HEAP32[$85>>2] = $R$1;
     }
     $86 = ($R$1|0)==(0|0);
     if ($86) {
      $p$0 = $14;$psize$0 = $15;
      break;
     }
    }
    $87 = HEAP32[((2264 + 16|0))>>2]|0;
    $88 = ($R$1>>>0)<($87>>>0);
    if ($88) {
     _abort();
     // unreachable;
    }
    $89 = (($R$1) + 24|0);
    HEAP32[$89>>2] = $44;
    $$sum33 = (($$sum2) + 16)|0;
    $90 = (($mem) + ($$sum33)|0);
    $91 = HEAP32[$90>>2]|0;
    $92 = ($91|0)==(0|0);
    do {
     if (!($92)) {
      $93 = HEAP32[((2264 + 16|0))>>2]|0;
      $94 = ($91>>>0)<($93>>>0);
      if ($94) {
       _abort();
       // unreachable;
      } else {
       $95 = (($R$1) + 16|0);
       HEAP32[$95>>2] = $91;
       $96 = (($91) + 24|0);
       HEAP32[$96>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $$sum34 = (($$sum2) + 20)|0;
    $97 = (($mem) + ($$sum34)|0);
    $98 = HEAP32[$97>>2]|0;
    $99 = ($98|0)==(0|0);
    if ($99) {
     $p$0 = $14;$psize$0 = $15;
    } else {
     $100 = HEAP32[((2264 + 16|0))>>2]|0;
     $101 = ($98>>>0)<($100>>>0);
     if ($101) {
      _abort();
      // unreachable;
     } else {
      $102 = (($R$1) + 20|0);
      HEAP32[$102>>2] = $98;
      $103 = (($98) + 24|0);
      HEAP32[$103>>2] = $R$1;
      $p$0 = $14;$psize$0 = $15;
      break;
     }
    }
   }
  } else {
   $p$0 = $1;$psize$0 = $8;
  }
 } while(0);
 $112 = ($p$0>>>0)<($9>>>0);
 if (!($112)) {
  _abort();
  // unreachable;
 }
 $$sum25 = (($8) + -4)|0;
 $113 = (($mem) + ($$sum25)|0);
 $114 = HEAP32[$113>>2]|0;
 $115 = $114 & 1;
 $116 = ($115|0)==(0);
 if ($116) {
  _abort();
  // unreachable;
 }
 $117 = $114 & 2;
 $118 = ($117|0)==(0);
 if ($118) {
  $119 = HEAP32[((2264 + 24|0))>>2]|0;
  $120 = ($9|0)==($119|0);
  if ($120) {
   $121 = HEAP32[((2264 + 12|0))>>2]|0;
   $122 = (($121) + ($psize$0))|0;
   HEAP32[((2264 + 12|0))>>2] = $122;
   HEAP32[((2264 + 24|0))>>2] = $p$0;
   $123 = $122 | 1;
   $124 = (($p$0) + 4|0);
   HEAP32[$124>>2] = $123;
   $125 = HEAP32[((2264 + 20|0))>>2]|0;
   $126 = ($p$0|0)==($125|0);
   if (!($126)) {
    STACKTOP = sp;return;
   }
   HEAP32[((2264 + 20|0))>>2] = 0;
   HEAP32[((2264 + 8|0))>>2] = 0;
   STACKTOP = sp;return;
  }
  $127 = HEAP32[((2264 + 20|0))>>2]|0;
  $128 = ($9|0)==($127|0);
  if ($128) {
   $129 = HEAP32[((2264 + 8|0))>>2]|0;
   $130 = (($129) + ($psize$0))|0;
   HEAP32[((2264 + 8|0))>>2] = $130;
   HEAP32[((2264 + 20|0))>>2] = $p$0;
   $131 = $130 | 1;
   $132 = (($p$0) + 4|0);
   HEAP32[$132>>2] = $131;
   $133 = (($p$0) + ($130)|0);
   HEAP32[$133>>2] = $130;
   STACKTOP = sp;return;
  }
  $134 = $114 & -8;
  $135 = (($134) + ($psize$0))|0;
  $136 = $114 >>> 3;
  $137 = ($114>>>0)<(256);
  do {
   if ($137) {
    $138 = (($mem) + ($8)|0);
    $139 = HEAP32[$138>>2]|0;
    $$sum2324 = $8 | 4;
    $140 = (($mem) + ($$sum2324)|0);
    $141 = HEAP32[$140>>2]|0;
    $142 = $136 << 1;
    $143 = ((2264 + ($142<<2)|0) + 40|0);
    $144 = ($139|0)==($143|0);
    if (!($144)) {
     $145 = HEAP32[((2264 + 16|0))>>2]|0;
     $146 = ($139>>>0)<($145>>>0);
     if ($146) {
      _abort();
      // unreachable;
     }
     $147 = (($139) + 12|0);
     $148 = HEAP32[$147>>2]|0;
     $149 = ($148|0)==($9|0);
     if (!($149)) {
      _abort();
      // unreachable;
     }
    }
    $150 = ($141|0)==($139|0);
    if ($150) {
     $151 = 1 << $136;
     $152 = $151 ^ -1;
     $153 = HEAP32[2264>>2]|0;
     $154 = $153 & $152;
     HEAP32[2264>>2] = $154;
     break;
    }
    $155 = ($141|0)==($143|0);
    if ($155) {
     $$pre67 = (($141) + 8|0);
     $$pre$phi68Z2D = $$pre67;
    } else {
     $156 = HEAP32[((2264 + 16|0))>>2]|0;
     $157 = ($141>>>0)<($156>>>0);
     if ($157) {
      _abort();
      // unreachable;
     }
     $158 = (($141) + 8|0);
     $159 = HEAP32[$158>>2]|0;
     $160 = ($159|0)==($9|0);
     if ($160) {
      $$pre$phi68Z2D = $158;
     } else {
      _abort();
      // unreachable;
     }
    }
    $161 = (($139) + 12|0);
    HEAP32[$161>>2] = $141;
    HEAP32[$$pre$phi68Z2D>>2] = $139;
   } else {
    $$sum5 = (($8) + 16)|0;
    $162 = (($mem) + ($$sum5)|0);
    $163 = HEAP32[$162>>2]|0;
    $$sum67 = $8 | 4;
    $164 = (($mem) + ($$sum67)|0);
    $165 = HEAP32[$164>>2]|0;
    $166 = ($165|0)==($9|0);
    do {
     if ($166) {
      $$sum9 = (($8) + 12)|0;
      $177 = (($mem) + ($$sum9)|0);
      $178 = HEAP32[$177>>2]|0;
      $179 = ($178|0)==(0|0);
      if ($179) {
       $$sum8 = (($8) + 8)|0;
       $180 = (($mem) + ($$sum8)|0);
       $181 = HEAP32[$180>>2]|0;
       $182 = ($181|0)==(0|0);
       if ($182) {
        $R7$1 = 0;
        break;
       } else {
        $R7$0 = $181;$RP9$0 = $180;
       }
      } else {
       $R7$0 = $178;$RP9$0 = $177;
      }
      while(1) {
       $183 = (($R7$0) + 20|0);
       $184 = HEAP32[$183>>2]|0;
       $185 = ($184|0)==(0|0);
       if (!($185)) {
        $R7$0 = $184;$RP9$0 = $183;
        continue;
       }
       $186 = (($R7$0) + 16|0);
       $187 = HEAP32[$186>>2]|0;
       $188 = ($187|0)==(0|0);
       if ($188) {
        break;
       } else {
        $R7$0 = $187;$RP9$0 = $186;
       }
      }
      $189 = HEAP32[((2264 + 16|0))>>2]|0;
      $190 = ($RP9$0>>>0)<($189>>>0);
      if ($190) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$RP9$0>>2] = 0;
       $R7$1 = $R7$0;
       break;
      }
     } else {
      $167 = (($mem) + ($8)|0);
      $168 = HEAP32[$167>>2]|0;
      $169 = HEAP32[((2264 + 16|0))>>2]|0;
      $170 = ($168>>>0)<($169>>>0);
      if ($170) {
       _abort();
       // unreachable;
      }
      $171 = (($168) + 12|0);
      $172 = HEAP32[$171>>2]|0;
      $173 = ($172|0)==($9|0);
      if (!($173)) {
       _abort();
       // unreachable;
      }
      $174 = (($165) + 8|0);
      $175 = HEAP32[$174>>2]|0;
      $176 = ($175|0)==($9|0);
      if ($176) {
       HEAP32[$171>>2] = $165;
       HEAP32[$174>>2] = $168;
       $R7$1 = $165;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $191 = ($163|0)==(0|0);
    if (!($191)) {
     $$sum18 = (($8) + 20)|0;
     $192 = (($mem) + ($$sum18)|0);
     $193 = HEAP32[$192>>2]|0;
     $194 = ((2264 + ($193<<2)|0) + 304|0);
     $195 = HEAP32[$194>>2]|0;
     $196 = ($9|0)==($195|0);
     if ($196) {
      HEAP32[$194>>2] = $R7$1;
      $cond54 = ($R7$1|0)==(0|0);
      if ($cond54) {
       $197 = 1 << $193;
       $198 = $197 ^ -1;
       $199 = HEAP32[((2264 + 4|0))>>2]|0;
       $200 = $199 & $198;
       HEAP32[((2264 + 4|0))>>2] = $200;
       break;
      }
     } else {
      $201 = HEAP32[((2264 + 16|0))>>2]|0;
      $202 = ($163>>>0)<($201>>>0);
      if ($202) {
       _abort();
       // unreachable;
      }
      $203 = (($163) + 16|0);
      $204 = HEAP32[$203>>2]|0;
      $205 = ($204|0)==($9|0);
      if ($205) {
       HEAP32[$203>>2] = $R7$1;
      } else {
       $206 = (($163) + 20|0);
       HEAP32[$206>>2] = $R7$1;
      }
      $207 = ($R7$1|0)==(0|0);
      if ($207) {
       break;
      }
     }
     $208 = HEAP32[((2264 + 16|0))>>2]|0;
     $209 = ($R7$1>>>0)<($208>>>0);
     if ($209) {
      _abort();
      // unreachable;
     }
     $210 = (($R7$1) + 24|0);
     HEAP32[$210>>2] = $163;
     $$sum19 = (($8) + 8)|0;
     $211 = (($mem) + ($$sum19)|0);
     $212 = HEAP32[$211>>2]|0;
     $213 = ($212|0)==(0|0);
     do {
      if (!($213)) {
       $214 = HEAP32[((2264 + 16|0))>>2]|0;
       $215 = ($212>>>0)<($214>>>0);
       if ($215) {
        _abort();
        // unreachable;
       } else {
        $216 = (($R7$1) + 16|0);
        HEAP32[$216>>2] = $212;
        $217 = (($212) + 24|0);
        HEAP32[$217>>2] = $R7$1;
        break;
       }
      }
     } while(0);
     $$sum20 = (($8) + 12)|0;
     $218 = (($mem) + ($$sum20)|0);
     $219 = HEAP32[$218>>2]|0;
     $220 = ($219|0)==(0|0);
     if (!($220)) {
      $221 = HEAP32[((2264 + 16|0))>>2]|0;
      $222 = ($219>>>0)<($221>>>0);
      if ($222) {
       _abort();
       // unreachable;
      } else {
       $223 = (($R7$1) + 20|0);
       HEAP32[$223>>2] = $219;
       $224 = (($219) + 24|0);
       HEAP32[$224>>2] = $R7$1;
       break;
      }
     }
    }
   }
  } while(0);
  $225 = $135 | 1;
  $226 = (($p$0) + 4|0);
  HEAP32[$226>>2] = $225;
  $227 = (($p$0) + ($135)|0);
  HEAP32[$227>>2] = $135;
  $228 = HEAP32[((2264 + 20|0))>>2]|0;
  $229 = ($p$0|0)==($228|0);
  if ($229) {
   HEAP32[((2264 + 8|0))>>2] = $135;
   STACKTOP = sp;return;
  } else {
   $psize$1 = $135;
  }
 } else {
  $230 = $114 & -2;
  HEAP32[$113>>2] = $230;
  $231 = $psize$0 | 1;
  $232 = (($p$0) + 4|0);
  HEAP32[$232>>2] = $231;
  $233 = (($p$0) + ($psize$0)|0);
  HEAP32[$233>>2] = $psize$0;
  $psize$1 = $psize$0;
 }
 $234 = $psize$1 >>> 3;
 $235 = ($psize$1>>>0)<(256);
 if ($235) {
  $236 = $234 << 1;
  $237 = ((2264 + ($236<<2)|0) + 40|0);
  $238 = HEAP32[2264>>2]|0;
  $239 = 1 << $234;
  $240 = $238 & $239;
  $241 = ($240|0)==(0);
  if ($241) {
   $242 = $238 | $239;
   HEAP32[2264>>2] = $242;
   $$sum16$pre = (($236) + 2)|0;
   $$pre = ((2264 + ($$sum16$pre<<2)|0) + 40|0);
   $$pre$phiZ2D = $$pre;$F16$0 = $237;
  } else {
   $$sum17 = (($236) + 2)|0;
   $243 = ((2264 + ($$sum17<<2)|0) + 40|0);
   $244 = HEAP32[$243>>2]|0;
   $245 = HEAP32[((2264 + 16|0))>>2]|0;
   $246 = ($244>>>0)<($245>>>0);
   if ($246) {
    _abort();
    // unreachable;
   } else {
    $$pre$phiZ2D = $243;$F16$0 = $244;
   }
  }
  HEAP32[$$pre$phiZ2D>>2] = $p$0;
  $247 = (($F16$0) + 12|0);
  HEAP32[$247>>2] = $p$0;
  $248 = (($p$0) + 8|0);
  HEAP32[$248>>2] = $F16$0;
  $249 = (($p$0) + 12|0);
  HEAP32[$249>>2] = $237;
  STACKTOP = sp;return;
 }
 $250 = $psize$1 >>> 8;
 $251 = ($250|0)==(0);
 if ($251) {
  $I18$0 = 0;
 } else {
  $252 = ($psize$1>>>0)>(16777215);
  if ($252) {
   $I18$0 = 31;
  } else {
   $253 = (($250) + 1048320)|0;
   $254 = $253 >>> 16;
   $255 = $254 & 8;
   $256 = $250 << $255;
   $257 = (($256) + 520192)|0;
   $258 = $257 >>> 16;
   $259 = $258 & 4;
   $260 = $259 | $255;
   $261 = $256 << $259;
   $262 = (($261) + 245760)|0;
   $263 = $262 >>> 16;
   $264 = $263 & 2;
   $265 = $260 | $264;
   $266 = (14 - ($265))|0;
   $267 = $261 << $264;
   $268 = $267 >>> 15;
   $269 = (($266) + ($268))|0;
   $270 = $269 << 1;
   $271 = (($269) + 7)|0;
   $272 = $psize$1 >>> $271;
   $273 = $272 & 1;
   $274 = $273 | $270;
   $I18$0 = $274;
  }
 }
 $275 = ((2264 + ($I18$0<<2)|0) + 304|0);
 $276 = (($p$0) + 28|0);
 $I18$0$c = $I18$0;
 HEAP32[$276>>2] = $I18$0$c;
 $277 = (($p$0) + 20|0);
 HEAP32[$277>>2] = 0;
 $278 = (($p$0) + 16|0);
 HEAP32[$278>>2] = 0;
 $279 = HEAP32[((2264 + 4|0))>>2]|0;
 $280 = 1 << $I18$0;
 $281 = $279 & $280;
 $282 = ($281|0)==(0);
 L199: do {
  if ($282) {
   $283 = $279 | $280;
   HEAP32[((2264 + 4|0))>>2] = $283;
   HEAP32[$275>>2] = $p$0;
   $284 = (($p$0) + 24|0);
   HEAP32[$284>>2] = $275;
   $285 = (($p$0) + 12|0);
   HEAP32[$285>>2] = $p$0;
   $286 = (($p$0) + 8|0);
   HEAP32[$286>>2] = $p$0;
  } else {
   $287 = HEAP32[$275>>2]|0;
   $288 = ($I18$0|0)==(31);
   if ($288) {
    $296 = 0;
   } else {
    $289 = $I18$0 >>> 1;
    $290 = (25 - ($289))|0;
    $296 = $290;
   }
   $291 = (($287) + 4|0);
   $292 = HEAP32[$291>>2]|0;
   $293 = $292 & -8;
   $294 = ($293|0)==($psize$1|0);
   L205: do {
    if ($294) {
     $T$0$lcssa = $287;
    } else {
     $295 = $psize$1 << $296;
     $K19$057 = $295;$T$056 = $287;
     while(1) {
      $303 = $K19$057 >>> 31;
      $304 = ((($T$056) + ($303<<2)|0) + 16|0);
      $299 = HEAP32[$304>>2]|0;
      $305 = ($299|0)==(0|0);
      if ($305) {
       break;
      }
      $297 = $K19$057 << 1;
      $298 = (($299) + 4|0);
      $300 = HEAP32[$298>>2]|0;
      $301 = $300 & -8;
      $302 = ($301|0)==($psize$1|0);
      if ($302) {
       $T$0$lcssa = $299;
       break L205;
      } else {
       $K19$057 = $297;$T$056 = $299;
      }
     }
     $306 = HEAP32[((2264 + 16|0))>>2]|0;
     $307 = ($304>>>0)<($306>>>0);
     if ($307) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$304>>2] = $p$0;
      $308 = (($p$0) + 24|0);
      HEAP32[$308>>2] = $T$056;
      $309 = (($p$0) + 12|0);
      HEAP32[$309>>2] = $p$0;
      $310 = (($p$0) + 8|0);
      HEAP32[$310>>2] = $p$0;
      break L199;
     }
    }
   } while(0);
   $311 = (($T$0$lcssa) + 8|0);
   $312 = HEAP32[$311>>2]|0;
   $313 = HEAP32[((2264 + 16|0))>>2]|0;
   $314 = ($T$0$lcssa>>>0)<($313>>>0);
   if ($314) {
    _abort();
    // unreachable;
   }
   $315 = ($312>>>0)<($313>>>0);
   if ($315) {
    _abort();
    // unreachable;
   } else {
    $316 = (($312) + 12|0);
    HEAP32[$316>>2] = $p$0;
    HEAP32[$311>>2] = $p$0;
    $317 = (($p$0) + 8|0);
    HEAP32[$317>>2] = $312;
    $318 = (($p$0) + 12|0);
    HEAP32[$318>>2] = $T$0$lcssa;
    $319 = (($p$0) + 24|0);
    HEAP32[$319>>2] = 0;
    break;
   }
  }
 } while(0);
 $320 = HEAP32[((2264 + 32|0))>>2]|0;
 $321 = (($320) + -1)|0;
 HEAP32[((2264 + 32|0))>>2] = $321;
 $322 = ($321|0)==(0);
 if ($322) {
  $sp$0$in$i = ((2264 + 456|0));
 } else {
  STACKTOP = sp;return;
 }
 while(1) {
  $sp$0$i = HEAP32[$sp$0$in$i>>2]|0;
  $323 = ($sp$0$i|0)==(0|0);
  $324 = (($sp$0$i) + 8|0);
  if ($323) {
   break;
  } else {
   $sp$0$in$i = $324;
  }
 }
 HEAP32[((2264 + 32|0))>>2] = -1;
 STACKTOP = sp;return;
}
function _calloc($n_elements,$elem_size) {
 $n_elements = $n_elements|0;
 $elem_size = $elem_size|0;
 var $$ = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $req$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($n_elements|0)==(0);
 if ($0) {
  $req$0 = 0;
 } else {
  $1 = Math_imul($elem_size, $n_elements)|0;
  $2 = $elem_size | $n_elements;
  $3 = ($2>>>0)>(65535);
  if ($3) {
   $4 = (($1>>>0) / ($n_elements>>>0))&-1;
   $5 = ($4|0)==($elem_size|0);
   $$ = $5 ? $1 : -1;
   $req$0 = $$;
  } else {
   $req$0 = $1;
  }
 }
 $6 = (_malloc($req$0)|0);
 $7 = ($6|0)==(0|0);
 if ($7) {
  STACKTOP = sp;return ($6|0);
 }
 $8 = (($6) + -4|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = $9 & 3;
 $11 = ($10|0)==(0);
 if ($11) {
  STACKTOP = sp;return ($6|0);
 }
 _memset(($6|0),0,($req$0|0))|0;
 STACKTOP = sp;return ($6|0);
}
function _realloc($oldmem,$bytes) {
 $oldmem = $oldmem|0;
 $bytes = $bytes|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0;
 var $7 = 0, $8 = 0, $9 = 0, $mem$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($oldmem|0)==(0|0);
 do {
  if ($0) {
   $1 = (_malloc($bytes)|0);
   $mem$0 = $1;
  } else {
   $2 = ($bytes>>>0)>(4294967231);
   if ($2) {
    $3 = (___errno_location()|0);
    HEAP32[$3>>2] = 12;
    $mem$0 = 0;
    break;
   }
   $4 = ($bytes>>>0)<(11);
   if ($4) {
    $8 = 16;
   } else {
    $5 = (($bytes) + 11)|0;
    $6 = $5 & -8;
    $8 = $6;
   }
   $7 = (($oldmem) + -8|0);
   $9 = (_try_realloc_chunk($7,$8)|0);
   $10 = ($9|0)==(0|0);
   if (!($10)) {
    $11 = (($9) + 8|0);
    $mem$0 = $11;
    break;
   }
   $12 = (_malloc($bytes)|0);
   $13 = ($12|0)==(0|0);
   if ($13) {
    $mem$0 = 0;
   } else {
    $14 = (($oldmem) + -4|0);
    $15 = HEAP32[$14>>2]|0;
    $16 = $15 & -8;
    $17 = $15 & 3;
    $18 = ($17|0)==(0);
    $19 = $18 ? 8 : 4;
    $20 = (($16) - ($19))|0;
    $21 = ($20>>>0)<($bytes>>>0);
    $22 = $21 ? $20 : $bytes;
    _memcpy(($12|0),($oldmem|0),($22|0))|0;
    _free($oldmem);
    $mem$0 = $12;
   }
  }
 } while(0);
 STACKTOP = sp;return ($mem$0|0);
}
function _try_realloc_chunk($p,$nb) {
 $p = $p|0;
 $nb = $nb|0;
 var $$pre = 0, $$pre$phiZ2D = 0, $$sum = 0, $$sum11 = 0, $$sum12 = 0, $$sum13 = 0, $$sum14 = 0, $$sum15 = 0, $$sum16 = 0, $$sum17 = 0, $$sum19 = 0, $$sum2 = 0, $$sum20 = 0, $$sum22 = 0, $$sum23 = 0, $$sum2728 = 0, $$sum3 = 0, $$sum4 = 0, $$sum5 = 0, $$sum78 = 0;
 var $$sum910 = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0;
 var $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0;
 var $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0;
 var $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0;
 var $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0;
 var $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0;
 var $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $R$0 = 0, $R$1 = 0, $RP$0 = 0;
 var $cond = 0, $newp$0 = 0, $or$cond = 0, $storemerge = 0, $storemerge21 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($p) + 4|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = $1 & -8;
 $3 = (($p) + ($2)|0);
 $4 = HEAP32[((2264 + 16|0))>>2]|0;
 $5 = ($p>>>0)<($4>>>0);
 if ($5) {
  _abort();
  // unreachable;
 }
 $6 = $1 & 3;
 $7 = ($6|0)!=(1);
 $8 = ($p>>>0)<($3>>>0);
 $or$cond = $7 & $8;
 if (!($or$cond)) {
  _abort();
  // unreachable;
 }
 $$sum2728 = $2 | 4;
 $9 = (($p) + ($$sum2728)|0);
 $10 = HEAP32[$9>>2]|0;
 $11 = $10 & 1;
 $12 = ($11|0)==(0);
 if ($12) {
  _abort();
  // unreachable;
 }
 $13 = ($6|0)==(0);
 if ($13) {
  $14 = ($nb>>>0)<(256);
  if ($14) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $15 = (($nb) + 4)|0;
  $16 = ($2>>>0)<($15>>>0);
  if (!($16)) {
   $17 = (($2) - ($nb))|0;
   $18 = HEAP32[((2736 + 8|0))>>2]|0;
   $19 = $18 << 1;
   $20 = ($17>>>0)>($19>>>0);
   if (!($20)) {
    $newp$0 = $p;
    STACKTOP = sp;return ($newp$0|0);
   }
  }
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $21 = ($2>>>0)<($nb>>>0);
 if (!($21)) {
  $22 = (($2) - ($nb))|0;
  $23 = ($22>>>0)>(15);
  if (!($23)) {
   $newp$0 = $p;
   STACKTOP = sp;return ($newp$0|0);
  }
  $24 = (($p) + ($nb)|0);
  $25 = $1 & 1;
  $26 = $25 | $nb;
  $27 = $26 | 2;
  HEAP32[$0>>2] = $27;
  $$sum23 = (($nb) + 4)|0;
  $28 = (($p) + ($$sum23)|0);
  $29 = $22 | 3;
  HEAP32[$28>>2] = $29;
  $30 = HEAP32[$9>>2]|0;
  $31 = $30 | 1;
  HEAP32[$9>>2] = $31;
  _dispose_chunk($24,$22);
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $32 = HEAP32[((2264 + 24|0))>>2]|0;
 $33 = ($3|0)==($32|0);
 if ($33) {
  $34 = HEAP32[((2264 + 12|0))>>2]|0;
  $35 = (($34) + ($2))|0;
  $36 = ($35>>>0)>($nb>>>0);
  if (!($36)) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $37 = (($35) - ($nb))|0;
  $38 = (($p) + ($nb)|0);
  $39 = $1 & 1;
  $40 = $39 | $nb;
  $41 = $40 | 2;
  HEAP32[$0>>2] = $41;
  $$sum22 = (($nb) + 4)|0;
  $42 = (($p) + ($$sum22)|0);
  $43 = $37 | 1;
  HEAP32[$42>>2] = $43;
  HEAP32[((2264 + 24|0))>>2] = $38;
  HEAP32[((2264 + 12|0))>>2] = $37;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $44 = HEAP32[((2264 + 20|0))>>2]|0;
 $45 = ($3|0)==($44|0);
 if ($45) {
  $46 = HEAP32[((2264 + 8|0))>>2]|0;
  $47 = (($46) + ($2))|0;
  $48 = ($47>>>0)<($nb>>>0);
  if ($48) {
   $newp$0 = 0;
   STACKTOP = sp;return ($newp$0|0);
  }
  $49 = (($47) - ($nb))|0;
  $50 = ($49>>>0)>(15);
  if ($50) {
   $51 = (($p) + ($nb)|0);
   $52 = (($p) + ($47)|0);
   $53 = $1 & 1;
   $54 = $53 | $nb;
   $55 = $54 | 2;
   HEAP32[$0>>2] = $55;
   $$sum19 = (($nb) + 4)|0;
   $56 = (($p) + ($$sum19)|0);
   $57 = $49 | 1;
   HEAP32[$56>>2] = $57;
   HEAP32[$52>>2] = $49;
   $$sum20 = (($47) + 4)|0;
   $58 = (($p) + ($$sum20)|0);
   $59 = HEAP32[$58>>2]|0;
   $60 = $59 & -2;
   HEAP32[$58>>2] = $60;
   $storemerge = $51;$storemerge21 = $49;
  } else {
   $61 = $1 & 1;
   $62 = $61 | $47;
   $63 = $62 | 2;
   HEAP32[$0>>2] = $63;
   $$sum17 = (($47) + 4)|0;
   $64 = (($p) + ($$sum17)|0);
   $65 = HEAP32[$64>>2]|0;
   $66 = $65 | 1;
   HEAP32[$64>>2] = $66;
   $storemerge = 0;$storemerge21 = 0;
  }
  HEAP32[((2264 + 8|0))>>2] = $storemerge21;
  HEAP32[((2264 + 20|0))>>2] = $storemerge;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 $67 = $10 & 2;
 $68 = ($67|0)==(0);
 if (!($68)) {
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $69 = $10 & -8;
 $70 = (($69) + ($2))|0;
 $71 = ($70>>>0)<($nb>>>0);
 if ($71) {
  $newp$0 = 0;
  STACKTOP = sp;return ($newp$0|0);
 }
 $72 = (($70) - ($nb))|0;
 $73 = $10 >>> 3;
 $74 = ($10>>>0)<(256);
 do {
  if ($74) {
   $$sum15 = (($2) + 8)|0;
   $75 = (($p) + ($$sum15)|0);
   $76 = HEAP32[$75>>2]|0;
   $$sum16 = (($2) + 12)|0;
   $77 = (($p) + ($$sum16)|0);
   $78 = HEAP32[$77>>2]|0;
   $79 = $73 << 1;
   $80 = ((2264 + ($79<<2)|0) + 40|0);
   $81 = ($76|0)==($80|0);
   if (!($81)) {
    $82 = ($76>>>0)<($4>>>0);
    if ($82) {
     _abort();
     // unreachable;
    }
    $83 = (($76) + 12|0);
    $84 = HEAP32[$83>>2]|0;
    $85 = ($84|0)==($3|0);
    if (!($85)) {
     _abort();
     // unreachable;
    }
   }
   $86 = ($78|0)==($76|0);
   if ($86) {
    $87 = 1 << $73;
    $88 = $87 ^ -1;
    $89 = HEAP32[2264>>2]|0;
    $90 = $89 & $88;
    HEAP32[2264>>2] = $90;
    break;
   }
   $91 = ($78|0)==($80|0);
   if ($91) {
    $$pre = (($78) + 8|0);
    $$pre$phiZ2D = $$pre;
   } else {
    $92 = ($78>>>0)<($4>>>0);
    if ($92) {
     _abort();
     // unreachable;
    }
    $93 = (($78) + 8|0);
    $94 = HEAP32[$93>>2]|0;
    $95 = ($94|0)==($3|0);
    if ($95) {
     $$pre$phiZ2D = $93;
    } else {
     _abort();
     // unreachable;
    }
   }
   $96 = (($76) + 12|0);
   HEAP32[$96>>2] = $78;
   HEAP32[$$pre$phiZ2D>>2] = $76;
  } else {
   $$sum = (($2) + 24)|0;
   $97 = (($p) + ($$sum)|0);
   $98 = HEAP32[$97>>2]|0;
   $$sum2 = (($2) + 12)|0;
   $99 = (($p) + ($$sum2)|0);
   $100 = HEAP32[$99>>2]|0;
   $101 = ($100|0)==($3|0);
   do {
    if ($101) {
     $$sum4 = (($2) + 20)|0;
     $111 = (($p) + ($$sum4)|0);
     $112 = HEAP32[$111>>2]|0;
     $113 = ($112|0)==(0|0);
     if ($113) {
      $$sum3 = (($2) + 16)|0;
      $114 = (($p) + ($$sum3)|0);
      $115 = HEAP32[$114>>2]|0;
      $116 = ($115|0)==(0|0);
      if ($116) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $115;$RP$0 = $114;
      }
     } else {
      $R$0 = $112;$RP$0 = $111;
     }
     while(1) {
      $117 = (($R$0) + 20|0);
      $118 = HEAP32[$117>>2]|0;
      $119 = ($118|0)==(0|0);
      if (!($119)) {
       $R$0 = $118;$RP$0 = $117;
       continue;
      }
      $120 = (($R$0) + 16|0);
      $121 = HEAP32[$120>>2]|0;
      $122 = ($121|0)==(0|0);
      if ($122) {
       break;
      } else {
       $R$0 = $121;$RP$0 = $120;
      }
     }
     $123 = ($RP$0>>>0)<($4>>>0);
     if ($123) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $$sum14 = (($2) + 8)|0;
     $102 = (($p) + ($$sum14)|0);
     $103 = HEAP32[$102>>2]|0;
     $104 = ($103>>>0)<($4>>>0);
     if ($104) {
      _abort();
      // unreachable;
     }
     $105 = (($103) + 12|0);
     $106 = HEAP32[$105>>2]|0;
     $107 = ($106|0)==($3|0);
     if (!($107)) {
      _abort();
      // unreachable;
     }
     $108 = (($100) + 8|0);
     $109 = HEAP32[$108>>2]|0;
     $110 = ($109|0)==($3|0);
     if ($110) {
      HEAP32[$105>>2] = $100;
      HEAP32[$108>>2] = $103;
      $R$1 = $100;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $124 = ($98|0)==(0|0);
   if (!($124)) {
    $$sum11 = (($2) + 28)|0;
    $125 = (($p) + ($$sum11)|0);
    $126 = HEAP32[$125>>2]|0;
    $127 = ((2264 + ($126<<2)|0) + 304|0);
    $128 = HEAP32[$127>>2]|0;
    $129 = ($3|0)==($128|0);
    if ($129) {
     HEAP32[$127>>2] = $R$1;
     $cond = ($R$1|0)==(0|0);
     if ($cond) {
      $130 = 1 << $126;
      $131 = $130 ^ -1;
      $132 = HEAP32[((2264 + 4|0))>>2]|0;
      $133 = $132 & $131;
      HEAP32[((2264 + 4|0))>>2] = $133;
      break;
     }
    } else {
     $134 = HEAP32[((2264 + 16|0))>>2]|0;
     $135 = ($98>>>0)<($134>>>0);
     if ($135) {
      _abort();
      // unreachable;
     }
     $136 = (($98) + 16|0);
     $137 = HEAP32[$136>>2]|0;
     $138 = ($137|0)==($3|0);
     if ($138) {
      HEAP32[$136>>2] = $R$1;
     } else {
      $139 = (($98) + 20|0);
      HEAP32[$139>>2] = $R$1;
     }
     $140 = ($R$1|0)==(0|0);
     if ($140) {
      break;
     }
    }
    $141 = HEAP32[((2264 + 16|0))>>2]|0;
    $142 = ($R$1>>>0)<($141>>>0);
    if ($142) {
     _abort();
     // unreachable;
    }
    $143 = (($R$1) + 24|0);
    HEAP32[$143>>2] = $98;
    $$sum12 = (($2) + 16)|0;
    $144 = (($p) + ($$sum12)|0);
    $145 = HEAP32[$144>>2]|0;
    $146 = ($145|0)==(0|0);
    do {
     if (!($146)) {
      $147 = HEAP32[((2264 + 16|0))>>2]|0;
      $148 = ($145>>>0)<($147>>>0);
      if ($148) {
       _abort();
       // unreachable;
      } else {
       $149 = (($R$1) + 16|0);
       HEAP32[$149>>2] = $145;
       $150 = (($145) + 24|0);
       HEAP32[$150>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $$sum13 = (($2) + 20)|0;
    $151 = (($p) + ($$sum13)|0);
    $152 = HEAP32[$151>>2]|0;
    $153 = ($152|0)==(0|0);
    if (!($153)) {
     $154 = HEAP32[((2264 + 16|0))>>2]|0;
     $155 = ($152>>>0)<($154>>>0);
     if ($155) {
      _abort();
      // unreachable;
     } else {
      $156 = (($R$1) + 20|0);
      HEAP32[$156>>2] = $152;
      $157 = (($152) + 24|0);
      HEAP32[$157>>2] = $R$1;
      break;
     }
    }
   }
  }
 } while(0);
 $158 = ($72>>>0)<(16);
 if ($158) {
  $159 = HEAP32[$0>>2]|0;
  $160 = $159 & 1;
  $161 = $70 | $160;
  $162 = $161 | 2;
  HEAP32[$0>>2] = $162;
  $$sum910 = $70 | 4;
  $163 = (($p) + ($$sum910)|0);
  $164 = HEAP32[$163>>2]|0;
  $165 = $164 | 1;
  HEAP32[$163>>2] = $165;
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 } else {
  $166 = (($p) + ($nb)|0);
  $167 = HEAP32[$0>>2]|0;
  $168 = $167 & 1;
  $169 = $168 | $nb;
  $170 = $169 | 2;
  HEAP32[$0>>2] = $170;
  $$sum5 = (($nb) + 4)|0;
  $171 = (($p) + ($$sum5)|0);
  $172 = $72 | 3;
  HEAP32[$171>>2] = $172;
  $$sum78 = $70 | 4;
  $173 = (($p) + ($$sum78)|0);
  $174 = HEAP32[$173>>2]|0;
  $175 = $174 | 1;
  HEAP32[$173>>2] = $175;
  _dispose_chunk($166,$72);
  $newp$0 = $p;
  STACKTOP = sp;return ($newp$0|0);
 }
 return 0|0;
}
function _dispose_chunk($p,$psize) {
 $p = $p|0;
 $psize = $psize|0;
 var $$0 = 0, $$02 = 0, $$1 = 0, $$pre = 0, $$pre$phi63Z2D = 0, $$pre$phi65Z2D = 0, $$pre$phiZ2D = 0, $$pre62 = 0, $$pre64 = 0, $$sum = 0, $$sum1 = 0, $$sum12$pre = 0, $$sum13 = 0, $$sum14 = 0, $$sum15 = 0, $$sum16 = 0, $$sum17 = 0, $$sum18 = 0, $$sum19 = 0, $$sum2 = 0;
 var $$sum20 = 0, $$sum22 = 0, $$sum23 = 0, $$sum24 = 0, $$sum25 = 0, $$sum26 = 0, $$sum27 = 0, $$sum28 = 0, $$sum29 = 0, $$sum3 = 0, $$sum30 = 0, $$sum31 = 0, $$sum4 = 0, $$sum5 = 0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0;
 var $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0;
 var $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0;
 var $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0;
 var $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0;
 var $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0;
 var $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0;
 var $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0;
 var $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0;
 var $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0;
 var $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0;
 var $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0;
 var $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0;
 var $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0;
 var $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $F16$0 = 0, $I19$0 = 0, $I19$0$c = 0, $K20$049 = 0, $R$0 = 0, $R$1 = 0, $R7$0 = 0, $R7$1 = 0, $RP$0 = 0, $RP9$0 = 0, $T$0$lcssa = 0, $T$048 = 0, $cond = 0, $cond46 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $0 = (($p) + ($psize)|0);
 $1 = (($p) + 4|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 & 1;
 $4 = ($3|0)==(0);
 do {
  if ($4) {
   $5 = HEAP32[$p>>2]|0;
   $6 = $2 & 3;
   $7 = ($6|0)==(0);
   if ($7) {
    STACKTOP = sp;return;
   }
   $8 = (0 - ($5))|0;
   $9 = (($p) + ($8)|0);
   $10 = (($5) + ($psize))|0;
   $11 = HEAP32[((2264 + 16|0))>>2]|0;
   $12 = ($9>>>0)<($11>>>0);
   if ($12) {
    _abort();
    // unreachable;
   }
   $13 = HEAP32[((2264 + 20|0))>>2]|0;
   $14 = ($9|0)==($13|0);
   if ($14) {
    $$sum = (($psize) + 4)|0;
    $100 = (($p) + ($$sum)|0);
    $101 = HEAP32[$100>>2]|0;
    $102 = $101 & 3;
    $103 = ($102|0)==(3);
    if (!($103)) {
     $$0 = $9;$$02 = $10;
     break;
    }
    HEAP32[((2264 + 8|0))>>2] = $10;
    $104 = HEAP32[$100>>2]|0;
    $105 = $104 & -2;
    HEAP32[$100>>2] = $105;
    $106 = $10 | 1;
    $$sum20 = (4 - ($5))|0;
    $107 = (($p) + ($$sum20)|0);
    HEAP32[$107>>2] = $106;
    HEAP32[$0>>2] = $10;
    STACKTOP = sp;return;
   }
   $15 = $5 >>> 3;
   $16 = ($5>>>0)<(256);
   if ($16) {
    $$sum30 = (8 - ($5))|0;
    $17 = (($p) + ($$sum30)|0);
    $18 = HEAP32[$17>>2]|0;
    $$sum31 = (12 - ($5))|0;
    $19 = (($p) + ($$sum31)|0);
    $20 = HEAP32[$19>>2]|0;
    $21 = $15 << 1;
    $22 = ((2264 + ($21<<2)|0) + 40|0);
    $23 = ($18|0)==($22|0);
    if (!($23)) {
     $24 = ($18>>>0)<($11>>>0);
     if ($24) {
      _abort();
      // unreachable;
     }
     $25 = (($18) + 12|0);
     $26 = HEAP32[$25>>2]|0;
     $27 = ($26|0)==($9|0);
     if (!($27)) {
      _abort();
      // unreachable;
     }
    }
    $28 = ($20|0)==($18|0);
    if ($28) {
     $29 = 1 << $15;
     $30 = $29 ^ -1;
     $31 = HEAP32[2264>>2]|0;
     $32 = $31 & $30;
     HEAP32[2264>>2] = $32;
     $$0 = $9;$$02 = $10;
     break;
    }
    $33 = ($20|0)==($22|0);
    if ($33) {
     $$pre64 = (($20) + 8|0);
     $$pre$phi65Z2D = $$pre64;
    } else {
     $34 = ($20>>>0)<($11>>>0);
     if ($34) {
      _abort();
      // unreachable;
     }
     $35 = (($20) + 8|0);
     $36 = HEAP32[$35>>2]|0;
     $37 = ($36|0)==($9|0);
     if ($37) {
      $$pre$phi65Z2D = $35;
     } else {
      _abort();
      // unreachable;
     }
    }
    $38 = (($18) + 12|0);
    HEAP32[$38>>2] = $20;
    HEAP32[$$pre$phi65Z2D>>2] = $18;
    $$0 = $9;$$02 = $10;
    break;
   }
   $$sum22 = (24 - ($5))|0;
   $39 = (($p) + ($$sum22)|0);
   $40 = HEAP32[$39>>2]|0;
   $$sum23 = (12 - ($5))|0;
   $41 = (($p) + ($$sum23)|0);
   $42 = HEAP32[$41>>2]|0;
   $43 = ($42|0)==($9|0);
   do {
    if ($43) {
     $$sum24 = (16 - ($5))|0;
     $$sum25 = (($$sum24) + 4)|0;
     $53 = (($p) + ($$sum25)|0);
     $54 = HEAP32[$53>>2]|0;
     $55 = ($54|0)==(0|0);
     if ($55) {
      $56 = (($p) + ($$sum24)|0);
      $57 = HEAP32[$56>>2]|0;
      $58 = ($57|0)==(0|0);
      if ($58) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $57;$RP$0 = $56;
      }
     } else {
      $R$0 = $54;$RP$0 = $53;
     }
     while(1) {
      $59 = (($R$0) + 20|0);
      $60 = HEAP32[$59>>2]|0;
      $61 = ($60|0)==(0|0);
      if (!($61)) {
       $R$0 = $60;$RP$0 = $59;
       continue;
      }
      $62 = (($R$0) + 16|0);
      $63 = HEAP32[$62>>2]|0;
      $64 = ($63|0)==(0|0);
      if ($64) {
       break;
      } else {
       $R$0 = $63;$RP$0 = $62;
      }
     }
     $65 = ($RP$0>>>0)<($11>>>0);
     if ($65) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $$sum29 = (8 - ($5))|0;
     $44 = (($p) + ($$sum29)|0);
     $45 = HEAP32[$44>>2]|0;
     $46 = ($45>>>0)<($11>>>0);
     if ($46) {
      _abort();
      // unreachable;
     }
     $47 = (($45) + 12|0);
     $48 = HEAP32[$47>>2]|0;
     $49 = ($48|0)==($9|0);
     if (!($49)) {
      _abort();
      // unreachable;
     }
     $50 = (($42) + 8|0);
     $51 = HEAP32[$50>>2]|0;
     $52 = ($51|0)==($9|0);
     if ($52) {
      HEAP32[$47>>2] = $42;
      HEAP32[$50>>2] = $45;
      $R$1 = $42;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $66 = ($40|0)==(0|0);
   if ($66) {
    $$0 = $9;$$02 = $10;
   } else {
    $$sum26 = (28 - ($5))|0;
    $67 = (($p) + ($$sum26)|0);
    $68 = HEAP32[$67>>2]|0;
    $69 = ((2264 + ($68<<2)|0) + 304|0);
    $70 = HEAP32[$69>>2]|0;
    $71 = ($9|0)==($70|0);
    if ($71) {
     HEAP32[$69>>2] = $R$1;
     $cond = ($R$1|0)==(0|0);
     if ($cond) {
      $72 = 1 << $68;
      $73 = $72 ^ -1;
      $74 = HEAP32[((2264 + 4|0))>>2]|0;
      $75 = $74 & $73;
      HEAP32[((2264 + 4|0))>>2] = $75;
      $$0 = $9;$$02 = $10;
      break;
     }
    } else {
     $76 = HEAP32[((2264 + 16|0))>>2]|0;
     $77 = ($40>>>0)<($76>>>0);
     if ($77) {
      _abort();
      // unreachable;
     }
     $78 = (($40) + 16|0);
     $79 = HEAP32[$78>>2]|0;
     $80 = ($79|0)==($9|0);
     if ($80) {
      HEAP32[$78>>2] = $R$1;
     } else {
      $81 = (($40) + 20|0);
      HEAP32[$81>>2] = $R$1;
     }
     $82 = ($R$1|0)==(0|0);
     if ($82) {
      $$0 = $9;$$02 = $10;
      break;
     }
    }
    $83 = HEAP32[((2264 + 16|0))>>2]|0;
    $84 = ($R$1>>>0)<($83>>>0);
    if ($84) {
     _abort();
     // unreachable;
    }
    $85 = (($R$1) + 24|0);
    HEAP32[$85>>2] = $40;
    $$sum27 = (16 - ($5))|0;
    $86 = (($p) + ($$sum27)|0);
    $87 = HEAP32[$86>>2]|0;
    $88 = ($87|0)==(0|0);
    do {
     if (!($88)) {
      $89 = HEAP32[((2264 + 16|0))>>2]|0;
      $90 = ($87>>>0)<($89>>>0);
      if ($90) {
       _abort();
       // unreachable;
      } else {
       $91 = (($R$1) + 16|0);
       HEAP32[$91>>2] = $87;
       $92 = (($87) + 24|0);
       HEAP32[$92>>2] = $R$1;
       break;
      }
     }
    } while(0);
    $$sum28 = (($$sum27) + 4)|0;
    $93 = (($p) + ($$sum28)|0);
    $94 = HEAP32[$93>>2]|0;
    $95 = ($94|0)==(0|0);
    if ($95) {
     $$0 = $9;$$02 = $10;
    } else {
     $96 = HEAP32[((2264 + 16|0))>>2]|0;
     $97 = ($94>>>0)<($96>>>0);
     if ($97) {
      _abort();
      // unreachable;
     } else {
      $98 = (($R$1) + 20|0);
      HEAP32[$98>>2] = $94;
      $99 = (($94) + 24|0);
      HEAP32[$99>>2] = $R$1;
      $$0 = $9;$$02 = $10;
      break;
     }
    }
   }
  } else {
   $$0 = $p;$$02 = $psize;
  }
 } while(0);
 $108 = HEAP32[((2264 + 16|0))>>2]|0;
 $109 = ($0>>>0)<($108>>>0);
 if ($109) {
  _abort();
  // unreachable;
 }
 $$sum1 = (($psize) + 4)|0;
 $110 = (($p) + ($$sum1)|0);
 $111 = HEAP32[$110>>2]|0;
 $112 = $111 & 2;
 $113 = ($112|0)==(0);
 if ($113) {
  $114 = HEAP32[((2264 + 24|0))>>2]|0;
  $115 = ($0|0)==($114|0);
  if ($115) {
   $116 = HEAP32[((2264 + 12|0))>>2]|0;
   $117 = (($116) + ($$02))|0;
   HEAP32[((2264 + 12|0))>>2] = $117;
   HEAP32[((2264 + 24|0))>>2] = $$0;
   $118 = $117 | 1;
   $119 = (($$0) + 4|0);
   HEAP32[$119>>2] = $118;
   $120 = HEAP32[((2264 + 20|0))>>2]|0;
   $121 = ($$0|0)==($120|0);
   if (!($121)) {
    STACKTOP = sp;return;
   }
   HEAP32[((2264 + 20|0))>>2] = 0;
   HEAP32[((2264 + 8|0))>>2] = 0;
   STACKTOP = sp;return;
  }
  $122 = HEAP32[((2264 + 20|0))>>2]|0;
  $123 = ($0|0)==($122|0);
  if ($123) {
   $124 = HEAP32[((2264 + 8|0))>>2]|0;
   $125 = (($124) + ($$02))|0;
   HEAP32[((2264 + 8|0))>>2] = $125;
   HEAP32[((2264 + 20|0))>>2] = $$0;
   $126 = $125 | 1;
   $127 = (($$0) + 4|0);
   HEAP32[$127>>2] = $126;
   $128 = (($$0) + ($125)|0);
   HEAP32[$128>>2] = $125;
   STACKTOP = sp;return;
  }
  $129 = $111 & -8;
  $130 = (($129) + ($$02))|0;
  $131 = $111 >>> 3;
  $132 = ($111>>>0)<(256);
  do {
   if ($132) {
    $$sum18 = (($psize) + 8)|0;
    $133 = (($p) + ($$sum18)|0);
    $134 = HEAP32[$133>>2]|0;
    $$sum19 = (($psize) + 12)|0;
    $135 = (($p) + ($$sum19)|0);
    $136 = HEAP32[$135>>2]|0;
    $137 = $131 << 1;
    $138 = ((2264 + ($137<<2)|0) + 40|0);
    $139 = ($134|0)==($138|0);
    if (!($139)) {
     $140 = ($134>>>0)<($108>>>0);
     if ($140) {
      _abort();
      // unreachable;
     }
     $141 = (($134) + 12|0);
     $142 = HEAP32[$141>>2]|0;
     $143 = ($142|0)==($0|0);
     if (!($143)) {
      _abort();
      // unreachable;
     }
    }
    $144 = ($136|0)==($134|0);
    if ($144) {
     $145 = 1 << $131;
     $146 = $145 ^ -1;
     $147 = HEAP32[2264>>2]|0;
     $148 = $147 & $146;
     HEAP32[2264>>2] = $148;
     break;
    }
    $149 = ($136|0)==($138|0);
    if ($149) {
     $$pre62 = (($136) + 8|0);
     $$pre$phi63Z2D = $$pre62;
    } else {
     $150 = ($136>>>0)<($108>>>0);
     if ($150) {
      _abort();
      // unreachable;
     }
     $151 = (($136) + 8|0);
     $152 = HEAP32[$151>>2]|0;
     $153 = ($152|0)==($0|0);
     if ($153) {
      $$pre$phi63Z2D = $151;
     } else {
      _abort();
      // unreachable;
     }
    }
    $154 = (($134) + 12|0);
    HEAP32[$154>>2] = $136;
    HEAP32[$$pre$phi63Z2D>>2] = $134;
   } else {
    $$sum2 = (($psize) + 24)|0;
    $155 = (($p) + ($$sum2)|0);
    $156 = HEAP32[$155>>2]|0;
    $$sum3 = (($psize) + 12)|0;
    $157 = (($p) + ($$sum3)|0);
    $158 = HEAP32[$157>>2]|0;
    $159 = ($158|0)==($0|0);
    do {
     if ($159) {
      $$sum5 = (($psize) + 20)|0;
      $169 = (($p) + ($$sum5)|0);
      $170 = HEAP32[$169>>2]|0;
      $171 = ($170|0)==(0|0);
      if ($171) {
       $$sum4 = (($psize) + 16)|0;
       $172 = (($p) + ($$sum4)|0);
       $173 = HEAP32[$172>>2]|0;
       $174 = ($173|0)==(0|0);
       if ($174) {
        $R7$1 = 0;
        break;
       } else {
        $R7$0 = $173;$RP9$0 = $172;
       }
      } else {
       $R7$0 = $170;$RP9$0 = $169;
      }
      while(1) {
       $175 = (($R7$0) + 20|0);
       $176 = HEAP32[$175>>2]|0;
       $177 = ($176|0)==(0|0);
       if (!($177)) {
        $R7$0 = $176;$RP9$0 = $175;
        continue;
       }
       $178 = (($R7$0) + 16|0);
       $179 = HEAP32[$178>>2]|0;
       $180 = ($179|0)==(0|0);
       if ($180) {
        break;
       } else {
        $R7$0 = $179;$RP9$0 = $178;
       }
      }
      $181 = ($RP9$0>>>0)<($108>>>0);
      if ($181) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$RP9$0>>2] = 0;
       $R7$1 = $R7$0;
       break;
      }
     } else {
      $$sum17 = (($psize) + 8)|0;
      $160 = (($p) + ($$sum17)|0);
      $161 = HEAP32[$160>>2]|0;
      $162 = ($161>>>0)<($108>>>0);
      if ($162) {
       _abort();
       // unreachable;
      }
      $163 = (($161) + 12|0);
      $164 = HEAP32[$163>>2]|0;
      $165 = ($164|0)==($0|0);
      if (!($165)) {
       _abort();
       // unreachable;
      }
      $166 = (($158) + 8|0);
      $167 = HEAP32[$166>>2]|0;
      $168 = ($167|0)==($0|0);
      if ($168) {
       HEAP32[$163>>2] = $158;
       HEAP32[$166>>2] = $161;
       $R7$1 = $158;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $182 = ($156|0)==(0|0);
    if (!($182)) {
     $$sum14 = (($psize) + 28)|0;
     $183 = (($p) + ($$sum14)|0);
     $184 = HEAP32[$183>>2]|0;
     $185 = ((2264 + ($184<<2)|0) + 304|0);
     $186 = HEAP32[$185>>2]|0;
     $187 = ($0|0)==($186|0);
     if ($187) {
      HEAP32[$185>>2] = $R7$1;
      $cond46 = ($R7$1|0)==(0|0);
      if ($cond46) {
       $188 = 1 << $184;
       $189 = $188 ^ -1;
       $190 = HEAP32[((2264 + 4|0))>>2]|0;
       $191 = $190 & $189;
       HEAP32[((2264 + 4|0))>>2] = $191;
       break;
      }
     } else {
      $192 = HEAP32[((2264 + 16|0))>>2]|0;
      $193 = ($156>>>0)<($192>>>0);
      if ($193) {
       _abort();
       // unreachable;
      }
      $194 = (($156) + 16|0);
      $195 = HEAP32[$194>>2]|0;
      $196 = ($195|0)==($0|0);
      if ($196) {
       HEAP32[$194>>2] = $R7$1;
      } else {
       $197 = (($156) + 20|0);
       HEAP32[$197>>2] = $R7$1;
      }
      $198 = ($R7$1|0)==(0|0);
      if ($198) {
       break;
      }
     }
     $199 = HEAP32[((2264 + 16|0))>>2]|0;
     $200 = ($R7$1>>>0)<($199>>>0);
     if ($200) {
      _abort();
      // unreachable;
     }
     $201 = (($R7$1) + 24|0);
     HEAP32[$201>>2] = $156;
     $$sum15 = (($psize) + 16)|0;
     $202 = (($p) + ($$sum15)|0);
     $203 = HEAP32[$202>>2]|0;
     $204 = ($203|0)==(0|0);
     do {
      if (!($204)) {
       $205 = HEAP32[((2264 + 16|0))>>2]|0;
       $206 = ($203>>>0)<($205>>>0);
       if ($206) {
        _abort();
        // unreachable;
       } else {
        $207 = (($R7$1) + 16|0);
        HEAP32[$207>>2] = $203;
        $208 = (($203) + 24|0);
        HEAP32[$208>>2] = $R7$1;
        break;
       }
      }
     } while(0);
     $$sum16 = (($psize) + 20)|0;
     $209 = (($p) + ($$sum16)|0);
     $210 = HEAP32[$209>>2]|0;
     $211 = ($210|0)==(0|0);
     if (!($211)) {
      $212 = HEAP32[((2264 + 16|0))>>2]|0;
      $213 = ($210>>>0)<($212>>>0);
      if ($213) {
       _abort();
       // unreachable;
      } else {
       $214 = (($R7$1) + 20|0);
       HEAP32[$214>>2] = $210;
       $215 = (($210) + 24|0);
       HEAP32[$215>>2] = $R7$1;
       break;
      }
     }
    }
   }
  } while(0);
  $216 = $130 | 1;
  $217 = (($$0) + 4|0);
  HEAP32[$217>>2] = $216;
  $218 = (($$0) + ($130)|0);
  HEAP32[$218>>2] = $130;
  $219 = HEAP32[((2264 + 20|0))>>2]|0;
  $220 = ($$0|0)==($219|0);
  if ($220) {
   HEAP32[((2264 + 8|0))>>2] = $130;
   STACKTOP = sp;return;
  } else {
   $$1 = $130;
  }
 } else {
  $221 = $111 & -2;
  HEAP32[$110>>2] = $221;
  $222 = $$02 | 1;
  $223 = (($$0) + 4|0);
  HEAP32[$223>>2] = $222;
  $224 = (($$0) + ($$02)|0);
  HEAP32[$224>>2] = $$02;
  $$1 = $$02;
 }
 $225 = $$1 >>> 3;
 $226 = ($$1>>>0)<(256);
 if ($226) {
  $227 = $225 << 1;
  $228 = ((2264 + ($227<<2)|0) + 40|0);
  $229 = HEAP32[2264>>2]|0;
  $230 = 1 << $225;
  $231 = $229 & $230;
  $232 = ($231|0)==(0);
  if ($232) {
   $233 = $229 | $230;
   HEAP32[2264>>2] = $233;
   $$sum12$pre = (($227) + 2)|0;
   $$pre = ((2264 + ($$sum12$pre<<2)|0) + 40|0);
   $$pre$phiZ2D = $$pre;$F16$0 = $228;
  } else {
   $$sum13 = (($227) + 2)|0;
   $234 = ((2264 + ($$sum13<<2)|0) + 40|0);
   $235 = HEAP32[$234>>2]|0;
   $236 = HEAP32[((2264 + 16|0))>>2]|0;
   $237 = ($235>>>0)<($236>>>0);
   if ($237) {
    _abort();
    // unreachable;
   } else {
    $$pre$phiZ2D = $234;$F16$0 = $235;
   }
  }
  HEAP32[$$pre$phiZ2D>>2] = $$0;
  $238 = (($F16$0) + 12|0);
  HEAP32[$238>>2] = $$0;
  $239 = (($$0) + 8|0);
  HEAP32[$239>>2] = $F16$0;
  $240 = (($$0) + 12|0);
  HEAP32[$240>>2] = $228;
  STACKTOP = sp;return;
 }
 $241 = $$1 >>> 8;
 $242 = ($241|0)==(0);
 if ($242) {
  $I19$0 = 0;
 } else {
  $243 = ($$1>>>0)>(16777215);
  if ($243) {
   $I19$0 = 31;
  } else {
   $244 = (($241) + 1048320)|0;
   $245 = $244 >>> 16;
   $246 = $245 & 8;
   $247 = $241 << $246;
   $248 = (($247) + 520192)|0;
   $249 = $248 >>> 16;
   $250 = $249 & 4;
   $251 = $250 | $246;
   $252 = $247 << $250;
   $253 = (($252) + 245760)|0;
   $254 = $253 >>> 16;
   $255 = $254 & 2;
   $256 = $251 | $255;
   $257 = (14 - ($256))|0;
   $258 = $252 << $255;
   $259 = $258 >>> 15;
   $260 = (($257) + ($259))|0;
   $261 = $260 << 1;
   $262 = (($260) + 7)|0;
   $263 = $$1 >>> $262;
   $264 = $263 & 1;
   $265 = $264 | $261;
   $I19$0 = $265;
  }
 }
 $266 = ((2264 + ($I19$0<<2)|0) + 304|0);
 $267 = (($$0) + 28|0);
 $I19$0$c = $I19$0;
 HEAP32[$267>>2] = $I19$0$c;
 $268 = (($$0) + 20|0);
 HEAP32[$268>>2] = 0;
 $269 = (($$0) + 16|0);
 HEAP32[$269>>2] = 0;
 $270 = HEAP32[((2264 + 4|0))>>2]|0;
 $271 = 1 << $I19$0;
 $272 = $270 & $271;
 $273 = ($272|0)==(0);
 if ($273) {
  $274 = $270 | $271;
  HEAP32[((2264 + 4|0))>>2] = $274;
  HEAP32[$266>>2] = $$0;
  $275 = (($$0) + 24|0);
  HEAP32[$275>>2] = $266;
  $276 = (($$0) + 12|0);
  HEAP32[$276>>2] = $$0;
  $277 = (($$0) + 8|0);
  HEAP32[$277>>2] = $$0;
  STACKTOP = sp;return;
 }
 $278 = HEAP32[$266>>2]|0;
 $279 = ($I19$0|0)==(31);
 if ($279) {
  $287 = 0;
 } else {
  $280 = $I19$0 >>> 1;
  $281 = (25 - ($280))|0;
  $287 = $281;
 }
 $282 = (($278) + 4|0);
 $283 = HEAP32[$282>>2]|0;
 $284 = $283 & -8;
 $285 = ($284|0)==($$1|0);
 L194: do {
  if ($285) {
   $T$0$lcssa = $278;
  } else {
   $286 = $$1 << $287;
   $K20$049 = $286;$T$048 = $278;
   while(1) {
    $294 = $K20$049 >>> 31;
    $295 = ((($T$048) + ($294<<2)|0) + 16|0);
    $290 = HEAP32[$295>>2]|0;
    $296 = ($290|0)==(0|0);
    if ($296) {
     break;
    }
    $288 = $K20$049 << 1;
    $289 = (($290) + 4|0);
    $291 = HEAP32[$289>>2]|0;
    $292 = $291 & -8;
    $293 = ($292|0)==($$1|0);
    if ($293) {
     $T$0$lcssa = $290;
     break L194;
    } else {
     $K20$049 = $288;$T$048 = $290;
    }
   }
   $297 = HEAP32[((2264 + 16|0))>>2]|0;
   $298 = ($295>>>0)<($297>>>0);
   if ($298) {
    _abort();
    // unreachable;
   }
   HEAP32[$295>>2] = $$0;
   $299 = (($$0) + 24|0);
   HEAP32[$299>>2] = $T$048;
   $300 = (($$0) + 12|0);
   HEAP32[$300>>2] = $$0;
   $301 = (($$0) + 8|0);
   HEAP32[$301>>2] = $$0;
   STACKTOP = sp;return;
  }
 } while(0);
 $302 = (($T$0$lcssa) + 8|0);
 $303 = HEAP32[$302>>2]|0;
 $304 = HEAP32[((2264 + 16|0))>>2]|0;
 $305 = ($T$0$lcssa>>>0)<($304>>>0);
 if ($305) {
  _abort();
  // unreachable;
 }
 $306 = ($303>>>0)<($304>>>0);
 if ($306) {
  _abort();
  // unreachable;
 }
 $307 = (($303) + 12|0);
 HEAP32[$307>>2] = $$0;
 HEAP32[$302>>2] = $$0;
 $308 = (($$0) + 8|0);
 HEAP32[$308>>2] = $303;
 $309 = (($$0) + 12|0);
 HEAP32[$309>>2] = $T$0$lcssa;
 $310 = (($$0) + 24|0);
 HEAP32[$310>>2] = 0;
 STACKTOP = sp;return;
}
function _isdigit($c) {
 $c = $c|0;
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($c) + -48)|0;
 $1 = ($0>>>0)<(10);
 $2 = $1&1;
 STACKTOP = sp;return ($2|0);
}
function _isspace($c) {
 $c = $c|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($c|0)==(32);
 if ($0) {
  $4 = 1;
 } else {
  $1 = (($c) + -9)|0;
  $2 = ($1>>>0)<(5);
  $4 = $2;
 }
 $3 = $4&1;
 STACKTOP = sp;return ($3|0);
}
function ___floatscan($f,$prec,$pok) {
 $f = $f|0;
 $prec = $prec|0;
 $pok = $pok|0;
 var $$$i = 0, $$$i22 = 0, $$0 = 0.0, $$02$i = 0, $$08$i = 0, $$09$i = 0, $$1$be$i = 0, $$1$ph$i = 0, $$10$i = 0, $$14$i = 0, $$2$i = 0, $$3$be$i = 0, $$3$lcssa$i = 0, $$38$i = 0, $$388$i = 0, $$397$i = 0, $$in = 0, $$k$0$i = 0, $$lcssa43$i = 0, $$lnz$0$i = 0;
 var $$neg20$i = 0, $$pn$i = 0.0, $$pre$i = 0.0, $$pre$i17 = 0, $$pre$phi$iZ2D = 0.0, $$promoted$i = 0, $$sink$off0$us$i = 0, $$sink$off0$us53$i = 0, $$x$4$i = 0, $$y$3$i = 0.0, $0 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0;
 var $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0;
 var $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0;
 var $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0;
 var $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0;
 var $18 = 0, $180 = 0, $181 = 0, $182 = 0.0, $183 = 0.0, $184 = 0.0, $185 = 0.0, $186 = 0, $187 = 0, $188 = 0.0, $189 = 0.0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0;
 var $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0.0, $209 = 0.0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0;
 var $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0;
 var $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0;
 var $251 = 0, $252 = 0, $253 = 0, $254 = 0.0, $255 = 0.0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0.0, $264 = 0.0, $265 = 0.0, $266 = 0, $267 = 0, $268 = 0, $269 = 0;
 var $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0.0, $277 = 0.0, $278 = 0.0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0.0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0;
 var $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0.0;
 var $305 = 0.0, $306 = 0.0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0.0, $313 = 0.0, $314 = 0.0, $315 = 0.0, $316 = 0.0, $317 = 0.0, $318 = 0, $319 = 0, $32 = 0, $320 = 0.0, $321 = 0, $322 = 0;
 var $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0;
 var $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0;
 var $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0;
 var $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0;
 var $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0;
 var $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0.0, $418 = 0.0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0;
 var $431 = 0, $432 = 0, $433 = 0, $434 = 0.0, $435 = 0.0, $436 = 0.0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0.0, $447 = 0.0, $448 = 0.0, $449 = 0;
 var $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0.0, $459 = 0.0, $46 = 0, $460 = 0.0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0;
 var $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0.0, $473 = 0, $474 = 0.0, $475 = 0.0, $476 = 0, $477 = 0.0, $478 = 0, $479 = 0.0, $48 = 0, $480 = 0.0, $481 = 0, $482 = 0, $483 = 0, $484 = 0.0, $485 = 0.0;
 var $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0.0, $490 = 0, $491 = 0.0, $492 = 0.0, $493 = 0.0, $494 = 0, $495 = 0, $496 = 0, $497 = 0.0, $498 = 0.0, $499 = 0, $5 = 0, $50 = 0.0, $500 = 0, $501 = 0, $502 = 0;
 var $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0.0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0;
 var $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0, $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0;
 var $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0;
 var $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0;
 var $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0;
 var $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0, $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0;
 var $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0, $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0;
 var $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0.0, $641 = 0, $642 = 0, $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0;
 var $648 = 0.0, $649 = 0.0, $65 = 0, $650 = 0.0, $651 = 0, $652 = 0.0, $653 = 0.0, $654 = 0.0, $655 = 0.0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0, $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0;
 var $666 = 0.0, $667 = 0.0, $668 = 0.0, $669 = 0, $67 = 0, $670 = 0.0, $671 = 0.0, $672 = 0, $673 = 0, $674 = 0, $675 = 0.0, $676 = 0.0, $677 = 0.0, $678 = 0.0, $679 = 0, $68 = 0, $680 = 0, $681 = 0.0, $682 = 0, $683 = 0.0;
 var $684 = 0.0, $685 = 0.0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0.0, $691 = 0, $692 = 0, $693 = 0, $694 = 0.0, $695 = 0, $696 = 0, $697 = 0, $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0;
 var $701 = 0.0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0.0, $707 = 0, $708 = 0, $709 = 0.0, $71 = 0, $710 = 0.0, $711 = 0, $712 = 0, $713 = 0, $714 = 0, $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0;
 var $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $a$0$lcssa161$i = 0, $a$061$i = 0, $a$1$i = 0, $a$2$ph40$i = 0;
 var $a$3$i = 0, $a$3$i$ph = 0, $a$3$ph$i = 0, $a$427$i = 0, $a$5$i = 0, $bias$0$i = 0.0, $bias$07$i = 0.0, $bits$0$ph = 0, $brmerge = 0, $brmerge107 = 0, $c$0 = 0, $c$0$i = 0, $c$1$lcssa = 0, $c$1$ph$i = 0, $c$169 = 0, $c$2 = 0, $c$2$i = 0, $c$2$lcssa$i = 0, $c$364 = 0, $c$4 = 0;
 var $c$5 = 0, $c$6 = 0, $carry$063$i = 0, $carry1$0$us$i = 0, $carry1$0$us49$i = 0, $carry1$1$lcssa$lcssa$i = 0, $carry1$1$us$i = 0, $carry1$1$us54$i = 0, $carry3$030$i = 0, $cond$i = 0, $d$0$i = 0, $denormal$0$i = 0, $denormal$1$i = 0, $denormal$2$i = 0, $e2$0$ph$i = 0, $e2$0$us$i = 0, $e2$0$us44$i = 0, $e2$1$i = 0, $e2$1$i$ph = 0, $e2$1$ph$i = 0;
 var $e2$2$i = 0, $e2$3$i = 0, $emin$0$ph = 0, $exitcond$i = 0, $frac$0$i = 0.0, $frac$1$i = 0.0, $frac$2$i = 0.0, $gotdig$0$i = 0, $gotdig$0$i9 = 0, $gotdig$2$i = 0, $gotdig$2$i11 = 0, $gotdig$3$i = 0, $gotdig$3$lcssa$i = 0, $gotdig$381$i = 0, $gotdig$393$i = 0, $gotdig$4$i = 0, $gotrad$0$i = 0, $gotrad$0$i12 = 0, $gotrad$1$i = 0, $gotrad$1$lcssa$i = 0;
 var $gotrad$194$i = 0, $gotrad$2$i = 0, $gottail$0$i = 0, $gottail$1$i = 0, $gottail$2$i = 0, $i$0$lcssa = 0, $i$025$i = 0, $i$068 = 0, $i$1$i = 0, $i$166 = 0, $i$263 = 0, $i$3 = 0, $i$4 = 0, $j$0$lcssa$i = 0, $j$086$i = 0, $j$096$i = 0, $j$2$i = 0, $j$371$i = 0, $k$0$lcssa$i = 0, $k$084$i = 0;
 var $k$095$i = 0, $k$2$i = 0, $k$3$i = 0, $k$462$i = 0, $k$5$in$us$i = 0, $k$5$in$us48$i = 0, $k$5$us$i = 0, $k$5$us50$i = 0, $k$5$z$2$us$i = 0, $k$5$z$2$us56$i = 0, $k$628$i = 0, $lnz$0$lcssa$i = 0, $lnz$079$i = 0, $lnz$092$i = 0, $lnz$2$i = 0, $notlhs = 0, $notrhs = 0, $or$cond = 0, $or$cond$i = 0, $or$cond$i15 = 0;
 var $or$cond106$not = 0, $or$cond11$i = 0, $or$cond12$us$i = 0, $or$cond12$us55$i = 0, $or$cond13$i = 0, $or$cond15$i = 0, $or$cond16$i = 0, $or$cond17$i = 0, $or$cond3$i = 0, $or$cond3$i16 = 0, $or$cond4$i = 0, $or$cond5 = 0, $or$cond7$i = 0, $or$cond789$i = 0, $or$cond8 = 0, $rp$0$lcssa162$i = 0, $rp$060$i = 0, $rp$1$i18 = 0, $rp$2$ph38$i = 0, $rp$3$i$ph = 0;
 var $rp$3$ph33$i = 0, $rp$426$i = 0, $rp$5$i = 0, $scale$0$i = 0.0, $scale$1$i = 0.0, $scale$2$i = 0.0, $sign$0 = 0, $storemerge$i = 0, $sum$i = 0, $x$0$i = 0, $x$1$i = 0, $x$2$i = 0, $x$3$lcssa$i = 0, $x$313$i = 0, $x$4$lcssa$i = 0, $x$48$i = 0, $x$5$i = 0, $x$6$i = 0, $x$i = 0, $y$0$i = 0.0;
 var $y$1$i = 0.0, $y$1$i23 = 0.0, $y$2$i = 0.0, $y$2$i24 = 0.0, $y$3$i = 0.0, $y$3$lcssa$i = 0.0, $y$39$i = 0.0, $y$4$i = 0.0, $y$5$i = 0.0, $z$0$i = 0, $z$1$ph39$i = 0, $z$1$us$i = 0, $z$1$us45$i = 0, $z$2$us$i = 0, $z$2$us47$i = 0, $z$3$lcssa$lcssa$i = 0, $z$3$us$i = 0, $z$3$us57$i = 0, $z$4$i = 0, $z$5$ph$i = 0;
 var $z$7$1$i = 0, $z$7$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 512|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $x$i = sp;
 if ((($prec|0) == 1)) {
  $bits$0$ph = 53;$emin$0$ph = -1074;
 } else if ((($prec|0) == 0)) {
  $bits$0$ph = 24;$emin$0$ph = -149;
 } else if ((($prec|0) == 2)) {
  $bits$0$ph = 53;$emin$0$ph = -1074;
 } else {
  $$0 = 0.0;
  STACKTOP = sp;return (+$$0);
 }
 $0 = (($f) + 4|0);
 $1 = (($f) + 100|0);
 while(1) {
  $2 = HEAP32[$0>>2]|0;
  $3 = HEAP32[$1>>2]|0;
  $4 = ($2>>>0)<($3>>>0);
  if ($4) {
   $5 = (($2) + 1|0);
   HEAP32[$0>>2] = $5;
   $6 = HEAP8[$2>>0]|0;
   $7 = $6&255;
   $9 = $7;
  } else {
   $8 = (___shgetc($f)|0);
   $9 = $8;
  }
  $10 = (_isspace($9)|0);
  $11 = ($10|0)==(0);
  if ($11) {
   break;
  }
 }
 $12 = ($9|0)==(45);
 do {
  if ((($9|0) == 43) | (($9|0) == 45)) {
   $13 = $12&1;
   $14 = $13 << 1;
   $15 = (1 - ($14))|0;
   $16 = HEAP32[$0>>2]|0;
   $17 = HEAP32[$1>>2]|0;
   $18 = ($16>>>0)<($17>>>0);
   if ($18) {
    $19 = (($16) + 1|0);
    HEAP32[$0>>2] = $19;
    $20 = HEAP8[$16>>0]|0;
    $21 = $20&255;
    $c$0 = $21;$sign$0 = $15;
    break;
   } else {
    $22 = (___shgetc($f)|0);
    $c$0 = $22;$sign$0 = $15;
    break;
   }
  } else {
   $c$0 = $9;$sign$0 = 1;
  }
 } while(0);
 $c$169 = $c$0;$i$068 = 0;
 while(1) {
  $23 = $c$169 | 32;
  $24 = (2760 + ($i$068)|0);
  $25 = HEAP8[$24>>0]|0;
  $26 = $25 << 24 >> 24;
  $27 = ($23|0)==($26|0);
  if (!($27)) {
   $c$1$lcssa = $c$169;$i$0$lcssa = $i$068;
   break;
  }
  $28 = ($i$068>>>0)<(7);
  do {
   if ($28) {
    $29 = HEAP32[$0>>2]|0;
    $30 = HEAP32[$1>>2]|0;
    $31 = ($29>>>0)<($30>>>0);
    if ($31) {
     $32 = (($29) + 1|0);
     HEAP32[$0>>2] = $32;
     $33 = HEAP8[$29>>0]|0;
     $34 = $33&255;
     $c$2 = $34;
     break;
    } else {
     $35 = (___shgetc($f)|0);
     $c$2 = $35;
     break;
    }
   } else {
    $c$2 = $c$169;
   }
  } while(0);
  $36 = (($i$068) + 1)|0;
  $37 = ($36>>>0)<(8);
  if ($37) {
   $c$169 = $c$2;$i$068 = $36;
  } else {
   $c$1$lcssa = $c$2;$i$0$lcssa = $36;
   break;
  }
 }
 do {
  if ((($i$0$lcssa|0) == 3)) {
   label = 23;
  } else if (!((($i$0$lcssa|0) == 8))) {
   $38 = ($i$0$lcssa>>>0)<(4);
   $39 = ($pok|0)==(0);
   $or$cond = $38 | $39;
   if (!($or$cond)) {
    $40 = ($i$0$lcssa|0)==(8);
    if ($40) {
     break;
    } else {
     label = 23;
     break;
    }
   }
   $52 = ($i$0$lcssa|0)==(0);
   L34: do {
    if ($52) {
     $c$364 = $c$1$lcssa;$i$263 = 0;
     while(1) {
      $53 = $c$364 | 32;
      $54 = (2776 + ($i$263)|0);
      $55 = HEAP8[$54>>0]|0;
      $56 = $55 << 24 >> 24;
      $57 = ($53|0)==($56|0);
      if (!($57)) {
       $c$5 = $c$364;$i$3 = $i$263;
       break L34;
      }
      $58 = ($i$263>>>0)<(2);
      do {
       if ($58) {
        $59 = HEAP32[$0>>2]|0;
        $60 = HEAP32[$1>>2]|0;
        $61 = ($59>>>0)<($60>>>0);
        if ($61) {
         $62 = (($59) + 1|0);
         HEAP32[$0>>2] = $62;
         $63 = HEAP8[$59>>0]|0;
         $64 = $63&255;
         $c$4 = $64;
         break;
        } else {
         $65 = (___shgetc($f)|0);
         $c$4 = $65;
         break;
        }
       } else {
        $c$4 = $c$364;
       }
      } while(0);
      $66 = (($i$263) + 1)|0;
      $67 = ($66>>>0)<(3);
      if ($67) {
       $c$364 = $c$4;$i$263 = $66;
      } else {
       $c$5 = $c$4;$i$3 = $66;
       break;
      }
     }
    } else {
     $c$5 = $c$1$lcssa;$i$3 = $i$0$lcssa;
    }
   } while(0);
   if ((($i$3|0) == 3)) {
    $68 = HEAP32[$0>>2]|0;
    $69 = HEAP32[$1>>2]|0;
    $70 = ($68>>>0)<($69>>>0);
    if ($70) {
     $71 = (($68) + 1|0);
     HEAP32[$0>>2] = $71;
     $72 = HEAP8[$68>>0]|0;
     $73 = $72&255;
     $76 = $73;
    } else {
     $74 = (___shgetc($f)|0);
     $76 = $74;
    }
    $75 = ($76|0)==(40);
    if ($75) {
     $i$4 = 1;
    } else {
     $77 = HEAP32[$1>>2]|0;
     $78 = ($77|0)==(0|0);
     if ($78) {
      $$0 = nan;
      STACKTOP = sp;return (+$$0);
     }
     $79 = HEAP32[$0>>2]|0;
     $80 = (($79) + -1|0);
     HEAP32[$0>>2] = $80;
     $$0 = nan;
     STACKTOP = sp;return (+$$0);
    }
    while(1) {
     $81 = HEAP32[$0>>2]|0;
     $82 = HEAP32[$1>>2]|0;
     $83 = ($81>>>0)<($82>>>0);
     if ($83) {
      $84 = (($81) + 1|0);
      HEAP32[$0>>2] = $84;
      $85 = HEAP8[$81>>0]|0;
      $86 = $85&255;
      $89 = $86;
     } else {
      $87 = (___shgetc($f)|0);
      $89 = $87;
     }
     $88 = (($89) + -48)|0;
     $90 = ($88>>>0)<(10);
     $91 = (($89) + -65)|0;
     $92 = ($91>>>0)<(26);
     $or$cond8 = $90 | $92;
     if (!($or$cond8)) {
      $93 = (($89) + -97)|0;
      $94 = ($93>>>0)<(26);
      $95 = ($89|0)==(95);
      $or$cond5 = $94 | $95;
      if (!($or$cond5)) {
       break;
      }
     }
     $107 = (($i$4) + 1)|0;
     $i$4 = $107;
    }
    $96 = ($89|0)==(41);
    if ($96) {
     $$0 = nan;
     STACKTOP = sp;return (+$$0);
    }
    $97 = HEAP32[$1>>2]|0;
    $98 = ($97|0)==(0|0);
    if (!($98)) {
     $99 = HEAP32[$0>>2]|0;
     $100 = (($99) + -1|0);
     HEAP32[$0>>2] = $100;
    }
    if ($39) {
     $102 = (___errno_location()|0);
     HEAP32[$102>>2] = 22;
     ___shlim($f,0);
     $$0 = 0.0;
     STACKTOP = sp;return (+$$0);
    }
    $101 = ($i$4|0)==(0);
    $brmerge107 = $101 | $98;
    if ($brmerge107) {
     $$0 = nan;
     STACKTOP = sp;return (+$$0);
    } else {
     $$in = $i$4;
    }
    while(1) {
     $103 = (($$in) + -1)|0;
     $104 = HEAP32[$0>>2]|0;
     $105 = (($104) + -1|0);
     HEAP32[$0>>2] = $105;
     $106 = ($103|0)==(0);
     if ($106) {
      $$0 = nan;
      break;
     } else {
      $$in = $103;
     }
    }
    STACKTOP = sp;return (+$$0);
   } else if ((($i$3|0) == 0)) {
    $113 = ($c$5|0)==(48);
    do {
     if ($113) {
      $114 = HEAP32[$0>>2]|0;
      $115 = HEAP32[$1>>2]|0;
      $116 = ($114>>>0)<($115>>>0);
      if ($116) {
       $117 = (($114) + 1|0);
       HEAP32[$0>>2] = $117;
       $118 = HEAP8[$114>>0]|0;
       $119 = $118&255;
       $122 = $119;
      } else {
       $120 = (___shgetc($f)|0);
       $122 = $120;
      }
      $121 = $122 | 32;
      $123 = ($121|0)==(120);
      if (!($123)) {
       $321 = HEAP32[$1>>2]|0;
       $322 = ($321|0)==(0|0);
       if ($322) {
        $c$6 = 48;
        break;
       }
       $323 = HEAP32[$0>>2]|0;
       $324 = (($323) + -1|0);
       HEAP32[$0>>2] = $324;
       $c$6 = 48;
       break;
      }
      $124 = HEAP32[$0>>2]|0;
      $125 = HEAP32[$1>>2]|0;
      $126 = ($124>>>0)<($125>>>0);
      if ($126) {
       $127 = (($124) + 1|0);
       HEAP32[$0>>2] = $127;
       $128 = HEAP8[$124>>0]|0;
       $129 = $128&255;
       $c$0$i = $129;$gotdig$0$i = 0;
      } else {
       $130 = (___shgetc($f)|0);
       $c$0$i = $130;$gotdig$0$i = 0;
      }
      while(1) {
       if ((($c$0$i|0) == 46)) {
        label = 70;
        break;
       } else if (!((($c$0$i|0) == 48))) {
        $169 = 0;$172 = 0;$212 = 0;$214 = 0;$c$2$i = $c$0$i;$gotdig$2$i = $gotdig$0$i;$gotrad$0$i = 0;$gottail$0$i = 0;$scale$0$i = 1.0;$x$0$i = 0;$y$0$i = 0.0;
        break;
       }
       $131 = HEAP32[$0>>2]|0;
       $132 = HEAP32[$1>>2]|0;
       $133 = ($131>>>0)<($132>>>0);
       if ($133) {
        $134 = (($131) + 1|0);
        HEAP32[$0>>2] = $134;
        $135 = HEAP8[$131>>0]|0;
        $136 = $135&255;
        $c$0$i = $136;$gotdig$0$i = 1;
        continue;
       } else {
        $137 = (___shgetc($f)|0);
        $c$0$i = $137;$gotdig$0$i = 1;
        continue;
       }
      }
      L107: do {
       if ((label|0) == 70) {
        $138 = HEAP32[$0>>2]|0;
        $139 = HEAP32[$1>>2]|0;
        $140 = ($138>>>0)<($139>>>0);
        if ($140) {
         $141 = (($138) + 1|0);
         HEAP32[$0>>2] = $141;
         $142 = HEAP8[$138>>0]|0;
         $143 = $142&255;
         $c$1$ph$i = $143;
        } else {
         $144 = (___shgetc($f)|0);
         $c$1$ph$i = $144;
        }
        $145 = ($c$1$ph$i|0)==(48);
        if ($145) {
         $155 = -1;$156 = -1;
         while(1) {
          $146 = HEAP32[$0>>2]|0;
          $147 = HEAP32[$1>>2]|0;
          $148 = ($146>>>0)<($147>>>0);
          if ($148) {
           $149 = (($146) + 1|0);
           HEAP32[$0>>2] = $149;
           $150 = HEAP8[$146>>0]|0;
           $151 = $150&255;
           $154 = $151;
          } else {
           $152 = (___shgetc($f)|0);
           $154 = $152;
          }
          $153 = ($154|0)==(48);
          if (!($153)) {
           $169 = 0;$172 = 0;$212 = $155;$214 = $156;$c$2$i = $154;$gotdig$2$i = 1;$gotrad$0$i = 1;$gottail$0$i = 0;$scale$0$i = 1.0;$x$0$i = 0;$y$0$i = 0.0;
           break L107;
          }
          $157 = (_i64Add(($155|0),($156|0),-1,-1)|0);
          $158 = tempRet0;
          $155 = $157;$156 = $158;
         }
        } else {
         $169 = 0;$172 = 0;$212 = 0;$214 = 0;$c$2$i = $c$1$ph$i;$gotdig$2$i = $gotdig$0$i;$gotrad$0$i = 1;$gottail$0$i = 0;$scale$0$i = 1.0;$x$0$i = 0;$y$0$i = 0.0;
        }
       }
      } while(0);
      L120: while(1) {
       $159 = (($c$2$i) + -48)|0;
       $160 = ($159>>>0)<(10);
       do {
        if ($160) {
         $d$0$i = $159;
         label = 84;
        } else {
         $161 = $c$2$i | 32;
         $162 = (($161) + -97)|0;
         $163 = ($162>>>0)<(6);
         $164 = ($c$2$i|0)==(46);
         $or$cond$i = $163 | $164;
         if (!($or$cond$i)) {
          $c$2$lcssa$i = $c$2$i;
          break L120;
         }
         if ($164) {
          $165 = ($gotrad$0$i|0)==(0);
          if ($165) {
           $712 = $172;$713 = $169;$714 = $172;$715 = $169;$gotdig$3$i = $gotdig$2$i;$gotrad$1$i = 1;$gottail$2$i = $gottail$0$i;$scale$2$i = $scale$0$i;$x$2$i = $x$0$i;$y$2$i = $y$0$i;
           break;
          } else {
           $c$2$lcssa$i = 46;
           break L120;
          }
         } else {
          $166 = ($c$2$i|0)>(57);
          $167 = (($161) + -87)|0;
          $$38$i = $166 ? $167 : $159;
          $d$0$i = $$38$i;
          label = 84;
          break;
         }
        }
       } while(0);
       if ((label|0) == 84) {
        label = 0;
        $168 = ($169|0)<(0);
        $170 = ($169|0)==(0);
        $171 = ($172>>>0)<(8);
        $173 = $170 & $171;
        $174 = $168 | $173;
        do {
         if ($174) {
          $175 = $x$0$i << 4;
          $176 = (($d$0$i) + ($175))|0;
          $gottail$1$i = $gottail$0$i;$scale$1$i = $scale$0$i;$x$1$i = $176;$y$1$i = $y$0$i;
         } else {
          $177 = ($169|0)<(0);
          $178 = ($169|0)==(0);
          $179 = ($172>>>0)<(14);
          $180 = $178 & $179;
          $181 = $177 | $180;
          if ($181) {
           $182 = (+($d$0$i|0));
           $183 = $scale$0$i * 0.0625;
           $184 = $183 * $182;
           $185 = $y$0$i + $184;
           $gottail$1$i = $gottail$0$i;$scale$1$i = $183;$x$1$i = $x$0$i;$y$1$i = $185;
           break;
          }
          $186 = ($d$0$i|0)!=(0);
          $187 = ($gottail$0$i|0)==(0);
          $or$cond3$i = $186 & $187;
          if ($or$cond3$i) {
           $188 = $scale$0$i * 0.5;
           $189 = $y$0$i + $188;
           $gottail$1$i = 1;$scale$1$i = $scale$0$i;$x$1$i = $x$0$i;$y$1$i = $189;
          } else {
           $gottail$1$i = $gottail$0$i;$scale$1$i = $scale$0$i;$x$1$i = $x$0$i;$y$1$i = $y$0$i;
          }
         }
        } while(0);
        $190 = (_i64Add(($172|0),($169|0),1,0)|0);
        $191 = tempRet0;
        $712 = $212;$713 = $214;$714 = $190;$715 = $191;$gotdig$3$i = 1;$gotrad$1$i = $gotrad$0$i;$gottail$2$i = $gottail$1$i;$scale$2$i = $scale$1$i;$x$2$i = $x$1$i;$y$2$i = $y$1$i;
       }
       $192 = HEAP32[$0>>2]|0;
       $193 = HEAP32[$1>>2]|0;
       $194 = ($192>>>0)<($193>>>0);
       if ($194) {
        $195 = (($192) + 1|0);
        HEAP32[$0>>2] = $195;
        $196 = HEAP8[$192>>0]|0;
        $197 = $196&255;
        $169 = $715;$172 = $714;$212 = $712;$214 = $713;$c$2$i = $197;$gotdig$2$i = $gotdig$3$i;$gotrad$0$i = $gotrad$1$i;$gottail$0$i = $gottail$2$i;$scale$0$i = $scale$2$i;$x$0$i = $x$2$i;$y$0$i = $y$2$i;
        continue;
       } else {
        $198 = (___shgetc($f)|0);
        $169 = $715;$172 = $714;$212 = $712;$214 = $713;$c$2$i = $198;$gotdig$2$i = $gotdig$3$i;$gotrad$0$i = $gotrad$1$i;$gottail$0$i = $gottail$2$i;$scale$0$i = $scale$2$i;$x$0$i = $x$2$i;$y$0$i = $y$2$i;
        continue;
       }
      }
      $199 = ($gotdig$2$i|0)==(0);
      if ($199) {
       $200 = HEAP32[$1>>2]|0;
       $201 = ($200|0)==(0|0);
       if (!($201)) {
        $202 = HEAP32[$0>>2]|0;
        $203 = (($202) + -1|0);
        HEAP32[$0>>2] = $203;
       }
       if ($39) {
        ___shlim($f,0);
       } else {
        if (!($201)) {
         $204 = HEAP32[$0>>2]|0;
         $205 = (($204) + -1|0);
         HEAP32[$0>>2] = $205;
         $206 = ($gotrad$0$i|0)==(0);
         if (!($206)) {
          $207 = (($204) + -2|0);
          HEAP32[$0>>2] = $207;
         }
        }
       }
       $208 = (+($sign$0|0));
       $209 = $208 * 0.0;
       $$0 = $209;
       STACKTOP = sp;return (+$$0);
      }
      $210 = ($gotrad$0$i|0)==(0);
      $211 = $210 ? $172 : $212;
      $213 = $210 ? $169 : $214;
      $215 = ($169|0)<(0);
      $216 = ($169|0)==(0);
      $217 = ($172>>>0)<(8);
      $218 = $216 & $217;
      $219 = $215 | $218;
      if ($219) {
       $221 = $172;$222 = $169;$x$313$i = $x$0$i;
       while(1) {
        $220 = $x$313$i << 4;
        $223 = (_i64Add(($221|0),($222|0),1,0)|0);
        $224 = tempRet0;
        $225 = ($224|0)<(0);
        $226 = ($224|0)==(0);
        $227 = ($223>>>0)<(8);
        $228 = $226 & $227;
        $229 = $225 | $228;
        if ($229) {
         $221 = $223;$222 = $224;$x$313$i = $220;
        } else {
         $x$3$lcssa$i = $220;
         break;
        }
       }
      } else {
       $x$3$lcssa$i = $x$0$i;
      }
      $230 = $c$2$lcssa$i | 32;
      $231 = ($230|0)==(112);
      do {
       if ($231) {
        $232 = (_scanexp($f,$pok)|0);
        $233 = tempRet0;
        $234 = ($232|0)==(0);
        $235 = ($233|0)==(-2147483648);
        $236 = $234 & $235;
        if ($236) {
         if ($39) {
          ___shlim($f,0);
          $$0 = 0.0;
          STACKTOP = sp;return (+$$0);
         } else {
          $237 = HEAP32[$1>>2]|0;
          $238 = ($237|0)==(0|0);
          if ($238) {
           $249 = 0;$250 = 0;
           break;
          }
          $239 = HEAP32[$0>>2]|0;
          $240 = (($239) + -1|0);
          HEAP32[$0>>2] = $240;
          $249 = 0;$250 = 0;
          break;
         }
        } else {
         $249 = $232;$250 = $233;
        }
       } else {
        $241 = HEAP32[$1>>2]|0;
        $242 = ($241|0)==(0|0);
        if ($242) {
         $249 = 0;$250 = 0;
        } else {
         $243 = HEAP32[$0>>2]|0;
         $244 = (($243) + -1|0);
         HEAP32[$0>>2] = $244;
         $249 = 0;$250 = 0;
        }
       }
      } while(0);
      $245 = (_bitshift64Shl(($211|0),($213|0),2)|0);
      $246 = tempRet0;
      $247 = (_i64Add(($245|0),($246|0),-32,-1)|0);
      $248 = tempRet0;
      $251 = (_i64Add(($247|0),($248|0),($249|0),($250|0))|0);
      $252 = tempRet0;
      $253 = ($x$3$lcssa$i|0)==(0);
      if ($253) {
       $254 = (+($sign$0|0));
       $255 = $254 * 0.0;
       $$0 = $255;
       STACKTOP = sp;return (+$$0);
      }
      $256 = (0 - ($emin$0$ph))|0;
      $257 = ($252|0)>(0);
      $258 = ($252|0)==(0);
      $259 = ($251>>>0)>($256>>>0);
      $260 = $258 & $259;
      $261 = $257 | $260;
      if ($261) {
       $262 = (___errno_location()|0);
       HEAP32[$262>>2] = 34;
       $263 = (+($sign$0|0));
       $264 = $263 * 1.7976931348623157E+308;
       $265 = $264 * 1.7976931348623157E+308;
       $$0 = $265;
       STACKTOP = sp;return (+$$0);
      }
      $266 = (($emin$0$ph) + -106)|0;
      $267 = ($266|0)<(0);
      $268 = $267 << 31 >> 31;
      $269 = ($252|0)<($268|0);
      $270 = ($252|0)==($268|0);
      $271 = ($251>>>0)<($266>>>0);
      $272 = $270 & $271;
      $273 = $269 | $272;
      if ($273) {
       $275 = (___errno_location()|0);
       HEAP32[$275>>2] = 34;
       $276 = (+($sign$0|0));
       $277 = $276 * 2.2250738585072014E-308;
       $278 = $277 * 2.2250738585072014E-308;
       $$0 = $278;
       STACKTOP = sp;return (+$$0);
      }
      $274 = ($x$3$lcssa$i|0)>(-1);
      if ($274) {
       $283 = $251;$284 = $252;$x$48$i = $x$3$lcssa$i;$y$39$i = $y$0$i;
       while(1) {
        $279 = !($y$39$i >= 0.5);
        $280 = $x$48$i << 1;
        if ($279) {
         $$pn$i = $y$39$i;$x$5$i = $280;
        } else {
         $281 = $280 | 1;
         $282 = $y$39$i + -1.0;
         $$pn$i = $282;$x$5$i = $281;
        }
        $y$4$i = $y$39$i + $$pn$i;
        $285 = (_i64Add(($283|0),($284|0),-1,-1)|0);
        $286 = tempRet0;
        $287 = ($x$5$i|0)>(-1);
        if ($287) {
         $283 = $285;$284 = $286;$x$48$i = $x$5$i;$y$39$i = $y$4$i;
        } else {
         $292 = $285;$293 = $286;$x$4$lcssa$i = $x$5$i;$y$3$lcssa$i = $y$4$i;
         break;
        }
       }
      } else {
       $292 = $251;$293 = $252;$x$4$lcssa$i = $x$3$lcssa$i;$y$3$lcssa$i = $y$0$i;
      }
      $288 = ($emin$0$ph|0)<(0);
      $289 = $288 << 31 >> 31;
      $290 = (_i64Subtract(32,0,($emin$0$ph|0),($289|0))|0);
      $291 = tempRet0;
      $294 = (_i64Add(($292|0),($293|0),($290|0),($291|0))|0);
      $295 = tempRet0;
      $296 = (0)>($295|0);
      $297 = (0)==($295|0);
      $298 = ($bits$0$ph>>>0)>($294>>>0);
      $299 = $297 & $298;
      $300 = $296 | $299;
      if ($300) {
       $301 = ($294|0)<(0);
       $$$i = $301 ? 0 : $294;
       $$02$i = $$$i;
      } else {
       $$02$i = $bits$0$ph;
      }
      $302 = ($$02$i|0)<(53);
      do {
       if ($302) {
        $303 = (84 - ($$02$i))|0;
        $304 = (+_scalbn(1.0,$303));
        $305 = (+($sign$0|0));
        $306 = (+_copysignl((+$304),(+$305)));
        $307 = ($$02$i|0)<(32);
        $308 = $y$3$lcssa$i != 0.0;
        $or$cond4$i = $307 & $308;
        if (!($or$cond4$i)) {
         $$pre$phi$iZ2D = $305;$bias$07$i = $306;$x$6$i = $x$4$lcssa$i;$y$5$i = $y$3$lcssa$i;
         break;
        }
        $309 = $x$4$lcssa$i & 1;
        $310 = ($309|0)==(0);
        $311 = $309 ^ 1;
        $$x$4$i = (($311) + ($x$4$lcssa$i))|0;
        $$y$3$i = $310 ? 0.0 : $y$3$lcssa$i;
        $$pre$phi$iZ2D = $305;$bias$07$i = $306;$x$6$i = $$x$4$i;$y$5$i = $$y$3$i;
       } else {
        $$pre$i = (+($sign$0|0));
        $$pre$phi$iZ2D = $$pre$i;$bias$07$i = 0.0;$x$6$i = $x$4$lcssa$i;$y$5$i = $y$3$lcssa$i;
       }
      } while(0);
      $312 = (+($x$6$i>>>0));
      $313 = $$pre$phi$iZ2D * $312;
      $314 = $bias$07$i + $313;
      $315 = $$pre$phi$iZ2D * $y$5$i;
      $316 = $315 + $314;
      $317 = $316 - $bias$07$i;
      $318 = $317 != 0.0;
      if (!($318)) {
       $319 = (___errno_location()|0);
       HEAP32[$319>>2] = 34;
      }
      $320 = (+_scalbnl($317,$292));
      $$0 = $320;
      STACKTOP = sp;return (+$$0);
     } else {
      $c$6 = $c$5;
     }
    } while(0);
    $sum$i = (($emin$0$ph) + ($bits$0$ph))|0;
    $325 = (0 - ($sum$i))|0;
    $$08$i = $c$6;$gotdig$0$i9 = 0;
    while(1) {
     if ((($$08$i|0) == 46)) {
      label = 139;
      break;
     } else if (!((($$08$i|0) == 48))) {
      $$2$i = $$08$i;$716 = 0;$717 = 0;$gotdig$2$i11 = $gotdig$0$i9;$gotrad$0$i12 = 0;
      break;
     }
     $326 = HEAP32[$0>>2]|0;
     $327 = HEAP32[$1>>2]|0;
     $328 = ($326>>>0)<($327>>>0);
     if ($328) {
      $329 = (($326) + 1|0);
      HEAP32[$0>>2] = $329;
      $330 = HEAP8[$326>>0]|0;
      $331 = $330&255;
      $$08$i = $331;$gotdig$0$i9 = 1;
      continue;
     } else {
      $332 = (___shgetc($f)|0);
      $$08$i = $332;$gotdig$0$i9 = 1;
      continue;
     }
    }
    L209: do {
     if ((label|0) == 139) {
      $333 = HEAP32[$0>>2]|0;
      $334 = HEAP32[$1>>2]|0;
      $335 = ($333>>>0)<($334>>>0);
      if ($335) {
       $336 = (($333) + 1|0);
       HEAP32[$0>>2] = $336;
       $337 = HEAP8[$333>>0]|0;
       $338 = $337&255;
       $$1$ph$i = $338;
      } else {
       $339 = (___shgetc($f)|0);
       $$1$ph$i = $339;
      }
      $340 = ($$1$ph$i|0)==(48);
      if ($340) {
       $349 = -1;$350 = -1;
       while(1) {
        $341 = HEAP32[$0>>2]|0;
        $342 = HEAP32[$1>>2]|0;
        $343 = ($341>>>0)<($342>>>0);
        if ($343) {
         $344 = (($341) + 1|0);
         HEAP32[$0>>2] = $344;
         $345 = HEAP8[$341>>0]|0;
         $346 = $345&255;
         $$1$be$i = $346;
        } else {
         $347 = (___shgetc($f)|0);
         $$1$be$i = $347;
        }
        $348 = ($$1$be$i|0)==(48);
        if (!($348)) {
         $$2$i = $$1$be$i;$716 = $349;$717 = $350;$gotdig$2$i11 = 1;$gotrad$0$i12 = 1;
         break L209;
        }
        $351 = (_i64Add(($349|0),($350|0),-1,-1)|0);
        $352 = tempRet0;
        $349 = $351;$350 = $352;
       }
      } else {
       $$2$i = $$1$ph$i;$716 = 0;$717 = 0;$gotdig$2$i11 = $gotdig$0$i9;$gotrad$0$i12 = 1;
      }
     }
    } while(0);
    HEAP32[$x$i>>2] = 0;
    $353 = (($$2$i) + -48)|0;
    $354 = ($353>>>0)<(10);
    $355 = ($$2$i|0)==(46);
    $or$cond789$i = $354 | $355;
    L223: do {
     if ($or$cond789$i) {
      $356 = (($x$i) + 496|0);
      $$397$i = $$2$i;$358 = 0;$359 = 0;$718 = $355;$719 = $353;$720 = $716;$721 = $717;$gotdig$393$i = $gotdig$2$i11;$gotrad$194$i = $gotrad$0$i12;$j$096$i = 0;$k$095$i = 0;$lnz$092$i = 0;
      while(1) {
       do {
        if ($718) {
         $cond$i = ($gotrad$194$i|0)==(0);
         if ($cond$i) {
          $722 = $358;$723 = $359;$724 = $358;$725 = $359;$gotdig$4$i = $gotdig$393$i;$gotrad$2$i = 1;$j$2$i = $j$096$i;$k$2$i = $k$095$i;$lnz$2$i = $lnz$092$i;
         } else {
          $$388$i = $$397$i;$405 = $720;$406 = $721;$421 = $358;$424 = $359;$gotdig$381$i = $gotdig$393$i;$j$086$i = $j$096$i;$k$084$i = $k$095$i;$lnz$079$i = $lnz$092$i;
          break L223;
         }
        } else {
         $357 = ($k$095$i|0)<(125);
         $360 = (_i64Add(($358|0),($359|0),1,0)|0);
         $361 = tempRet0;
         $362 = ($$397$i|0)!=(48);
         if (!($357)) {
          if (!($362)) {
           $722 = $720;$723 = $721;$724 = $360;$725 = $361;$gotdig$4$i = $gotdig$393$i;$gotrad$2$i = $gotrad$194$i;$j$2$i = $j$096$i;$k$2$i = $k$095$i;$lnz$2$i = $lnz$092$i;
           break;
          }
          $372 = HEAP32[$356>>2]|0;
          $373 = $372 | 1;
          HEAP32[$356>>2] = $373;
          $722 = $720;$723 = $721;$724 = $360;$725 = $361;$gotdig$4$i = $gotdig$393$i;$gotrad$2$i = $gotrad$194$i;$j$2$i = $j$096$i;$k$2$i = $k$095$i;$lnz$2$i = $lnz$092$i;
          break;
         }
         $$lnz$0$i = $362 ? $360 : $lnz$092$i;
         $363 = ($j$096$i|0)==(0);
         $364 = (($x$i) + ($k$095$i<<2)|0);
         if ($363) {
          $storemerge$i = $719;
         } else {
          $365 = HEAP32[$364>>2]|0;
          $366 = ($365*10)|0;
          $367 = (($$397$i) + -48)|0;
          $368 = (($367) + ($366))|0;
          $storemerge$i = $368;
         }
         HEAP32[$364>>2] = $storemerge$i;
         $369 = (($j$096$i) + 1)|0;
         $370 = ($369|0)==(9);
         $371 = $370&1;
         $$k$0$i = (($371) + ($k$095$i))|0;
         $$10$i = $370 ? 0 : $369;
         $722 = $720;$723 = $721;$724 = $360;$725 = $361;$gotdig$4$i = 1;$gotrad$2$i = $gotrad$194$i;$j$2$i = $$10$i;$k$2$i = $$k$0$i;$lnz$2$i = $$lnz$0$i;
        }
       } while(0);
       $374 = HEAP32[$0>>2]|0;
       $375 = HEAP32[$1>>2]|0;
       $376 = ($374>>>0)<($375>>>0);
       if ($376) {
        $377 = (($374) + 1|0);
        HEAP32[$0>>2] = $377;
        $378 = HEAP8[$374>>0]|0;
        $379 = $378&255;
        $$3$be$i = $379;
       } else {
        $380 = (___shgetc($f)|0);
        $$3$be$i = $380;
       }
       $381 = (($$3$be$i) + -48)|0;
       $382 = ($381>>>0)<(10);
       $383 = ($$3$be$i|0)==(46);
       $or$cond7$i = $382 | $383;
       if ($or$cond7$i) {
        $$397$i = $$3$be$i;$358 = $724;$359 = $725;$718 = $383;$719 = $381;$720 = $722;$721 = $723;$gotdig$393$i = $gotdig$4$i;$gotrad$194$i = $gotrad$2$i;$j$096$i = $j$2$i;$k$095$i = $k$2$i;$lnz$092$i = $lnz$2$i;
       } else {
        $$3$lcssa$i = $$3$be$i;$386 = $724;$387 = $722;$389 = $725;$390 = $723;$gotdig$3$lcssa$i = $gotdig$4$i;$gotrad$1$lcssa$i = $gotrad$2$i;$j$0$lcssa$i = $j$2$i;$k$0$lcssa$i = $k$2$i;$lnz$0$lcssa$i = $lnz$2$i;
        label = 162;
        break;
       }
      }
     } else {
      $$3$lcssa$i = $$2$i;$386 = 0;$387 = $716;$389 = 0;$390 = $717;$gotdig$3$lcssa$i = $gotdig$2$i11;$gotrad$1$lcssa$i = $gotrad$0$i12;$j$0$lcssa$i = 0;$k$0$lcssa$i = 0;$lnz$0$lcssa$i = 0;
      label = 162;
     }
    } while(0);
    if ((label|0) == 162) {
     $384 = ($gotrad$1$lcssa$i|0)==(0);
     $385 = $384 ? $386 : $387;
     $388 = $384 ? $389 : $390;
     $$388$i = $$3$lcssa$i;$405 = $385;$406 = $388;$421 = $386;$424 = $389;$gotdig$381$i = $gotdig$3$lcssa$i;$j$086$i = $j$0$lcssa$i;$k$084$i = $k$0$lcssa$i;$lnz$079$i = $lnz$0$lcssa$i;
    }
    $391 = ($gotdig$381$i|0)!=(0);
    if ($391) {
     $392 = $$388$i | 32;
     $393 = ($392|0)==(101);
     if ($393) {
      $394 = (_scanexp($f,$pok)|0);
      $395 = tempRet0;
      $396 = ($394|0)==(0);
      $397 = ($395|0)==(-2147483648);
      $398 = $396 & $397;
      do {
       if ($398) {
        if ($39) {
         ___shlim($f,0);
         $$0 = 0.0;
         STACKTOP = sp;return (+$$0);
        } else {
         $399 = HEAP32[$1>>2]|0;
         $400 = ($399|0)==(0|0);
         if ($400) {
          $403 = 0;$404 = 0;
          break;
         }
         $401 = HEAP32[$0>>2]|0;
         $402 = (($401) + -1|0);
         HEAP32[$0>>2] = $402;
         $403 = 0;$404 = 0;
         break;
        }
       } else {
        $403 = $394;$404 = $395;
       }
      } while(0);
      $407 = (_i64Add(($403|0),($404|0),($405|0),($406|0))|0);
      $408 = tempRet0;
      $420 = $407;$423 = $408;
     } else {
      label = 171;
     }
    } else {
     label = 171;
    }
    if ((label|0) == 171) {
     $409 = ($$388$i|0)>(-1);
     if ($409) {
      $410 = HEAP32[$1>>2]|0;
      $411 = ($410|0)==(0|0);
      if ($411) {
       $420 = $405;$423 = $406;
      } else {
       $412 = HEAP32[$0>>2]|0;
       $413 = (($412) + -1|0);
       HEAP32[$0>>2] = $413;
       $420 = $405;$423 = $406;
      }
     } else {
      $420 = $405;$423 = $406;
     }
    }
    if (!($391)) {
     $414 = (___errno_location()|0);
     HEAP32[$414>>2] = 22;
     ___shlim($f,0);
     $$0 = 0.0;
     STACKTOP = sp;return (+$$0);
    }
    $415 = HEAP32[$x$i>>2]|0;
    $416 = ($415|0)==(0);
    if ($416) {
     $417 = (+($sign$0|0));
     $418 = $417 * 0.0;
     $$0 = $418;
     STACKTOP = sp;return (+$$0);
    }
    $419 = ($420|0)==($421|0);
    $422 = ($423|0)==($424|0);
    $425 = $419 & $422;
    $426 = ($424|0)<(0);
    $427 = ($424|0)==(0);
    $428 = ($421>>>0)<(10);
    $429 = $427 & $428;
    $430 = $426 | $429;
    $or$cond$i15 = $425 & $430;
    do {
     if ($or$cond$i15) {
      $431 = ($bits$0$ph>>>0)>(30);
      if (!($431)) {
       $432 = $415 >>> $bits$0$ph;
       $433 = ($432|0)==(0);
       if (!($433)) {
        break;
       }
      }
      $434 = (+($sign$0|0));
      $435 = (+($415>>>0));
      $436 = $434 * $435;
      $$0 = $436;
      STACKTOP = sp;return (+$$0);
     }
    } while(0);
    $437 = (($emin$0$ph|0) / -2)&-1;
    $438 = ($437|0)<(0);
    $439 = $438 << 31 >> 31;
    $440 = ($423|0)>($439|0);
    $441 = ($423|0)==($439|0);
    $442 = ($420>>>0)>($437>>>0);
    $443 = $441 & $442;
    $444 = $440 | $443;
    if ($444) {
     $445 = (___errno_location()|0);
     HEAP32[$445>>2] = 34;
     $446 = (+($sign$0|0));
     $447 = $446 * 1.7976931348623157E+308;
     $448 = $447 * 1.7976931348623157E+308;
     $$0 = $448;
     STACKTOP = sp;return (+$$0);
    }
    $449 = (($emin$0$ph) + -106)|0;
    $450 = ($449|0)<(0);
    $451 = $450 << 31 >> 31;
    $452 = ($423|0)<($451|0);
    $453 = ($423|0)==($451|0);
    $454 = ($420>>>0)<($449>>>0);
    $455 = $453 & $454;
    $456 = $452 | $455;
    if ($456) {
     $457 = (___errno_location()|0);
     HEAP32[$457>>2] = 34;
     $458 = (+($sign$0|0));
     $459 = $458 * 2.2250738585072014E-308;
     $460 = $459 * 2.2250738585072014E-308;
     $$0 = $460;
     STACKTOP = sp;return (+$$0);
    }
    $461 = ($j$086$i|0)==(0);
    if ($461) {
     $k$3$i = $k$084$i;
    } else {
     $462 = ($j$086$i|0)<(9);
     if ($462) {
      $463 = (($x$i) + ($k$084$i<<2)|0);
      $$promoted$i = HEAP32[$463>>2]|0;
      $465 = $$promoted$i;$j$371$i = $j$086$i;
      while(1) {
       $464 = ($465*10)|0;
       $466 = (($j$371$i) + 1)|0;
       $exitcond$i = ($466|0)==(9);
       if ($exitcond$i) {
        break;
       } else {
        $465 = $464;$j$371$i = $466;
       }
      }
      HEAP32[$463>>2] = $464;
     }
     $467 = (($k$084$i) + 1)|0;
     $k$3$i = $467;
    }
    $468 = ($lnz$079$i|0)<(9);
    do {
     if ($468) {
      $469 = ($lnz$079$i|0)<=($420|0);
      $470 = ($420|0)<(18);
      $or$cond3$i16 = $469 & $470;
      if ($or$cond3$i16) {
       $471 = ($420|0)==(9);
       if ($471) {
        $472 = (+($sign$0|0));
        $473 = HEAP32[$x$i>>2]|0;
        $474 = (+($473>>>0));
        $475 = $472 * $474;
        $$0 = $475;
        STACKTOP = sp;return (+$$0);
       }
       $476 = ($420|0)<(9);
       if ($476) {
        $477 = (+($sign$0|0));
        $478 = HEAP32[$x$i>>2]|0;
        $479 = (+($478>>>0));
        $480 = $477 * $479;
        $481 = (8 - ($420))|0;
        $482 = (2792 + ($481<<2)|0);
        $483 = HEAP32[$482>>2]|0;
        $484 = (+($483|0));
        $485 = $480 / $484;
        $$0 = $485;
        STACKTOP = sp;return (+$$0);
       }
       $486 = Math_imul($420, -3)|0;
       $$neg20$i = (($bits$0$ph) + 27)|0;
       $487 = (($$neg20$i) + ($486))|0;
       $488 = ($487|0)>(30);
       $$pre$i17 = HEAP32[$x$i>>2]|0;
       if (!($488)) {
        $489 = $$pre$i17 >>> $487;
        $490 = ($489|0)==(0);
        if (!($490)) {
         break;
        }
       }
       $491 = (+($sign$0|0));
       $492 = (+($$pre$i17>>>0));
       $493 = $491 * $492;
       $494 = (($420) + -10)|0;
       $495 = (2792 + ($494<<2)|0);
       $496 = HEAP32[$495>>2]|0;
       $497 = (+($496|0));
       $498 = $493 * $497;
       $$0 = $498;
       STACKTOP = sp;return (+$$0);
      }
     }
    } while(0);
    $499 = (($420|0) % 9)&-1;
    $500 = ($499|0)==(0);
    if ($500) {
     $a$2$ph40$i = 0;$e2$0$ph$i = 0;$rp$2$ph38$i = $420;$z$1$ph39$i = $k$3$i;
    } else {
     $501 = ($420|0)>(-1);
     $502 = (($499) + 9)|0;
     $503 = $501 ? $499 : $502;
     $504 = (8 - ($503))|0;
     $505 = (2792 + ($504<<2)|0);
     $506 = HEAP32[$505>>2]|0;
     $507 = ($k$3$i|0)==(0);
     if ($507) {
      $a$0$lcssa161$i = 0;$rp$0$lcssa162$i = $420;$z$0$i = 0;
     } else {
      $508 = (1000000000 / ($506|0))&-1;
      $a$061$i = 0;$carry$063$i = 0;$k$462$i = 0;$rp$060$i = $420;
      while(1) {
       $509 = (($x$i) + ($k$462$i<<2)|0);
       $510 = HEAP32[$509>>2]|0;
       $511 = (($510>>>0) % ($506>>>0))&-1;
       $512 = (($510>>>0) / ($506>>>0))&-1;
       $513 = (($512) + ($carry$063$i))|0;
       HEAP32[$509>>2] = $513;
       $514 = Math_imul($511, $508)|0;
       $515 = ($k$462$i|0)==($a$061$i|0);
       $516 = ($513|0)==(0);
       $or$cond11$i = $515 & $516;
       $517 = (($k$462$i) + 1)|0;
       if ($or$cond11$i) {
        $518 = $517 & 127;
        $519 = (($rp$060$i) + -9)|0;
        $a$1$i = $518;$rp$1$i18 = $519;
       } else {
        $a$1$i = $a$061$i;$rp$1$i18 = $rp$060$i;
       }
       $520 = ($517|0)==($k$3$i|0);
       if ($520) {
        break;
       } else {
        $a$061$i = $a$1$i;$carry$063$i = $514;$k$462$i = $517;$rp$060$i = $rp$1$i18;
       }
      }
      $521 = ($514|0)==(0);
      if ($521) {
       $a$0$lcssa161$i = $a$1$i;$rp$0$lcssa162$i = $rp$1$i18;$z$0$i = $k$3$i;
      } else {
       $522 = (($k$3$i) + 1)|0;
       $523 = (($x$i) + ($k$3$i<<2)|0);
       HEAP32[$523>>2] = $514;
       $a$0$lcssa161$i = $a$1$i;$rp$0$lcssa162$i = $rp$1$i18;$z$0$i = $522;
      }
     }
     $524 = (9 - ($503))|0;
     $525 = (($524) + ($rp$0$lcssa162$i))|0;
     $a$2$ph40$i = $a$0$lcssa161$i;$e2$0$ph$i = 0;$rp$2$ph38$i = $525;$z$1$ph39$i = $z$0$i;
    }
    L321: while(1) {
     $526 = ($rp$2$ph38$i|0)<(18);
     $527 = (($x$i) + ($a$2$ph40$i<<2)|0);
     if ($526) {
      $e2$0$us$i = $e2$0$ph$i;$z$1$us$i = $z$1$ph39$i;
      while(1) {
       $529 = (($z$1$us$i) + 127)|0;
       $carry1$0$us$i = 0;$k$5$in$us$i = $529;$z$2$us$i = $z$1$us$i;
       while(1) {
        $k$5$us$i = $k$5$in$us$i & 127;
        $530 = (($x$i) + ($k$5$us$i<<2)|0);
        $531 = HEAP32[$530>>2]|0;
        $532 = (_bitshift64Shl(($531|0),0,29)|0);
        $533 = tempRet0;
        $534 = (_i64Add(($532|0),($533|0),($carry1$0$us$i|0),0)|0);
        $535 = tempRet0;
        $536 = ($535>>>0)>(0);
        $537 = ($535|0)==(0);
        $538 = ($534>>>0)>(1000000000);
        $539 = $537 & $538;
        $540 = $536 | $539;
        if ($540) {
         $541 = (___udivdi3(($534|0),($535|0),1000000000,0)|0);
         $542 = tempRet0;
         $543 = (___uremdi3(($534|0),($535|0),1000000000,0)|0);
         $544 = tempRet0;
         $$sink$off0$us$i = $543;$carry1$1$us$i = $541;
        } else {
         $$sink$off0$us$i = $534;$carry1$1$us$i = 0;
        }
        HEAP32[$530>>2] = $$sink$off0$us$i;
        $545 = (($z$2$us$i) + 127)|0;
        $546 = $545 & 127;
        $547 = ($k$5$us$i|0)!=($546|0);
        $548 = ($k$5$us$i|0)==($a$2$ph40$i|0);
        $or$cond12$us$i = $547 | $548;
        if ($or$cond12$us$i) {
         $z$3$us$i = $z$2$us$i;
        } else {
         $549 = ($$sink$off0$us$i|0)==(0);
         $k$5$z$2$us$i = $549 ? $k$5$us$i : $z$2$us$i;
         $z$3$us$i = $k$5$z$2$us$i;
        }
        $550 = (($k$5$us$i) + -1)|0;
        if ($548) {
         break;
        } else {
         $carry1$0$us$i = $carry1$1$us$i;$k$5$in$us$i = $550;$z$2$us$i = $z$3$us$i;
        }
       }
       $551 = (($e2$0$us$i) + -29)|0;
       $552 = ($carry1$1$us$i|0)==(0);
       if ($552) {
        $e2$0$us$i = $551;$z$1$us$i = $z$3$us$i;
       } else {
        $$lcssa43$i = $551;$carry1$1$lcssa$lcssa$i = $carry1$1$us$i;$z$3$lcssa$lcssa$i = $z$3$us$i;
        break;
       }
      }
     } else {
      $528 = ($rp$2$ph38$i|0)==(18);
      if ($528) {
       $e2$0$us44$i = $e2$0$ph$i;$z$1$us45$i = $z$1$ph39$i;
      } else {
       $a$3$ph$i = $a$2$ph40$i;$e2$1$ph$i = $e2$0$ph$i;$rp$3$ph33$i = $rp$2$ph38$i;$z$5$ph$i = $z$1$ph39$i;
       break;
      }
      while(1) {
       $553 = HEAP32[$527>>2]|0;
       $554 = ($553>>>0)<(9007199);
       if (!($554)) {
        $a$3$ph$i = $a$2$ph40$i;$e2$1$ph$i = $e2$0$us44$i;$rp$3$ph33$i = 18;$z$5$ph$i = $z$1$us45$i;
        break L321;
       }
       $555 = (($z$1$us45$i) + 127)|0;
       $carry1$0$us49$i = 0;$k$5$in$us48$i = $555;$z$2$us47$i = $z$1$us45$i;
       while(1) {
        $k$5$us50$i = $k$5$in$us48$i & 127;
        $556 = (($x$i) + ($k$5$us50$i<<2)|0);
        $557 = HEAP32[$556>>2]|0;
        $558 = (_bitshift64Shl(($557|0),0,29)|0);
        $559 = tempRet0;
        $560 = (_i64Add(($558|0),($559|0),($carry1$0$us49$i|0),0)|0);
        $561 = tempRet0;
        $562 = ($561>>>0)>(0);
        $563 = ($561|0)==(0);
        $564 = ($560>>>0)>(1000000000);
        $565 = $563 & $564;
        $566 = $562 | $565;
        if ($566) {
         $567 = (___udivdi3(($560|0),($561|0),1000000000,0)|0);
         $568 = tempRet0;
         $569 = (___uremdi3(($560|0),($561|0),1000000000,0)|0);
         $570 = tempRet0;
         $$sink$off0$us53$i = $569;$carry1$1$us54$i = $567;
        } else {
         $$sink$off0$us53$i = $560;$carry1$1$us54$i = 0;
        }
        HEAP32[$556>>2] = $$sink$off0$us53$i;
        $571 = (($z$2$us47$i) + 127)|0;
        $572 = $571 & 127;
        $573 = ($k$5$us50$i|0)!=($572|0);
        $574 = ($k$5$us50$i|0)==($a$2$ph40$i|0);
        $or$cond12$us55$i = $573 | $574;
        if ($or$cond12$us55$i) {
         $z$3$us57$i = $z$2$us47$i;
        } else {
         $575 = ($$sink$off0$us53$i|0)==(0);
         $k$5$z$2$us56$i = $575 ? $k$5$us50$i : $z$2$us47$i;
         $z$3$us57$i = $k$5$z$2$us56$i;
        }
        $576 = (($k$5$us50$i) + -1)|0;
        if ($574) {
         break;
        } else {
         $carry1$0$us49$i = $carry1$1$us54$i;$k$5$in$us48$i = $576;$z$2$us47$i = $z$3$us57$i;
        }
       }
       $577 = (($e2$0$us44$i) + -29)|0;
       $578 = ($carry1$1$us54$i|0)==(0);
       if ($578) {
        $e2$0$us44$i = $577;$z$1$us45$i = $z$3$us57$i;
       } else {
        $$lcssa43$i = $577;$carry1$1$lcssa$lcssa$i = $carry1$1$us54$i;$z$3$lcssa$lcssa$i = $z$3$us57$i;
        break;
       }
      }
     }
     $579 = (($rp$2$ph38$i) + 9)|0;
     $580 = (($a$2$ph40$i) + 127)|0;
     $581 = $580 & 127;
     $582 = ($581|0)==($z$3$lcssa$lcssa$i|0);
     if ($582) {
      $583 = (($z$3$lcssa$lcssa$i) + 127)|0;
      $584 = $583 & 127;
      $585 = (($x$i) + ($584<<2)|0);
      $586 = HEAP32[$585>>2]|0;
      $587 = (($z$3$lcssa$lcssa$i) + 126)|0;
      $588 = $587 & 127;
      $589 = (($x$i) + ($588<<2)|0);
      $590 = HEAP32[$589>>2]|0;
      $591 = $590 | $586;
      HEAP32[$589>>2] = $591;
      $z$4$i = $584;
     } else {
      $z$4$i = $z$3$lcssa$lcssa$i;
     }
     $592 = (($x$i) + ($581<<2)|0);
     HEAP32[$592>>2] = $carry1$1$lcssa$lcssa$i;
     $a$2$ph40$i = $581;$e2$0$ph$i = $$lcssa43$i;$rp$2$ph38$i = $579;$z$1$ph39$i = $z$4$i;
    }
    L352: while(1) {
     $629 = (($z$5$ph$i) + 1)|0;
     $627 = $629 & 127;
     $630 = (($z$5$ph$i) + 127)|0;
     $631 = $630 & 127;
     $632 = (($x$i) + ($631<<2)|0);
     $a$3$i$ph = $a$3$ph$i;$e2$1$i$ph = $e2$1$ph$i;$rp$3$i$ph = $rp$3$ph33$i;
     while(1) {
      $605 = ($rp$3$i$ph|0)==(18);
      $633 = ($rp$3$i$ph|0)>(27);
      $$14$i = $633 ? 9 : 1;
      $a$3$i = $a$3$i$ph;$e2$1$i = $e2$1$i$ph;
      while(1) {
       $i$025$i = 0;
       while(1) {
        $595 = (($i$025$i) + ($a$3$i))|0;
        $596 = $595 & 127;
        $597 = ($596|0)==($z$5$ph$i|0);
        if ($597) {
         $i$1$i = 2;
         break;
        }
        $598 = (($x$i) + ($596<<2)|0);
        $599 = HEAP32[$598>>2]|0;
        $600 = (2784 + ($i$025$i<<2)|0);
        $601 = HEAP32[$600>>2]|0;
        $602 = ($599>>>0)<($601>>>0);
        if ($602) {
         $i$1$i = 2;
         break;
        }
        $603 = ($599>>>0)>($601>>>0);
        $594 = (($i$025$i) + 1)|0;
        if ($603) {
         $i$1$i = $i$025$i;
         break;
        }
        $593 = ($594|0)<(2);
        if ($593) {
         $i$025$i = $594;
        } else {
         $i$1$i = $594;
         break;
        }
       }
       $604 = ($i$1$i|0)==(2);
       $or$cond13$i = $604 & $605;
       if ($or$cond13$i) {
        break L352;
       }
       $608 = (($$14$i) + ($e2$1$i))|0;
       $609 = ($a$3$i|0)==($z$5$ph$i|0);
       if ($609) {
        $a$3$i = $z$5$ph$i;$e2$1$i = $608;
       } else {
        break;
       }
      }
      $610 = 1 << $$14$i;
      $611 = (($610) + -1)|0;
      $612 = 1000000000 >>> $$14$i;
      $a$427$i = $a$3$i;$carry3$030$i = 0;$k$628$i = $a$3$i;$rp$426$i = $rp$3$i$ph;
      while(1) {
       $613 = (($x$i) + ($k$628$i<<2)|0);
       $614 = HEAP32[$613>>2]|0;
       $615 = $614 & $611;
       $616 = $614 >>> $$14$i;
       $617 = (($616) + ($carry3$030$i))|0;
       HEAP32[$613>>2] = $617;
       $618 = Math_imul($615, $612)|0;
       $619 = ($k$628$i|0)==($a$427$i|0);
       $620 = ($617|0)==(0);
       $or$cond15$i = $619 & $620;
       $621 = (($k$628$i) + 1)|0;
       $622 = $621 & 127;
       $623 = (($rp$426$i) + -9)|0;
       $rp$5$i = $or$cond15$i ? $623 : $rp$426$i;
       $a$5$i = $or$cond15$i ? $622 : $a$427$i;
       $624 = ($622|0)==($z$5$ph$i|0);
       if ($624) {
        break;
       } else {
        $a$427$i = $a$5$i;$carry3$030$i = $618;$k$628$i = $622;$rp$426$i = $rp$5$i;
       }
      }
      $625 = ($618|0)==(0);
      if ($625) {
       $a$3$i$ph = $a$5$i;$e2$1$i$ph = $608;$rp$3$i$ph = $rp$5$i;
       continue;
      }
      $626 = ($627|0)==($a$5$i|0);
      if (!($626)) {
       break;
      }
      $634 = HEAP32[$632>>2]|0;
      $635 = $634 | 1;
      HEAP32[$632>>2] = $635;
      $a$3$i$ph = $a$5$i;$e2$1$i$ph = $608;$rp$3$i$ph = $rp$5$i;
     }
     $628 = (($x$i) + ($z$5$ph$i<<2)|0);
     HEAP32[$628>>2] = $618;
     $a$3$ph$i = $a$5$i;$e2$1$ph$i = $608;$rp$3$ph33$i = $rp$5$i;$z$5$ph$i = $627;
    }
    $606 = $a$3$i & 127;
    $607 = ($606|0)==($z$5$ph$i|0);
    if ($607) {
     $636 = (($627) + -1)|0;
     $637 = (($x$i) + ($636<<2)|0);
     HEAP32[$637>>2] = 0;
     $z$7$i = $627;
    } else {
     $z$7$i = $z$5$ph$i;
    }
    $638 = (($x$i) + ($606<<2)|0);
    $639 = HEAP32[$638>>2]|0;
    $640 = (+($639>>>0));
    $641 = (($a$3$i) + 1)|0;
    $642 = $641 & 127;
    $643 = ($642|0)==($z$7$i|0);
    if ($643) {
     $702 = (($z$7$i) + 1)|0;
     $703 = $702 & 127;
     $704 = (($703) + -1)|0;
     $705 = (($x$i) + ($704<<2)|0);
     HEAP32[$705>>2] = 0;
     $z$7$1$i = $703;
    } else {
     $z$7$1$i = $z$7$i;
    }
    $706 = $640 * 1.0E+9;
    $707 = (($x$i) + ($642<<2)|0);
    $708 = HEAP32[$707>>2]|0;
    $709 = (+($708>>>0));
    $710 = $706 + $709;
    $667 = (+($sign$0|0));
    $649 = $667 * $710;
    $687 = (($e2$1$i) + 53)|0;
    $645 = (($687) - ($emin$0$ph))|0;
    $711 = ($645|0)<($bits$0$ph|0);
    if ($711) {
     $644 = ($645|0)<(0);
     $$$i22 = $644 ? 0 : $645;
     $$09$i = $$$i22;$denormal$0$i = 1;
    } else {
     $$09$i = $bits$0$ph;$denormal$0$i = 0;
    }
    $646 = ($$09$i|0)<(53);
    if ($646) {
     $647 = (105 - ($$09$i))|0;
     $648 = (+_scalbn(1.0,$647));
     $650 = (+_copysignl((+$648),(+$649)));
     $651 = (53 - ($$09$i))|0;
     $652 = (+_scalbn(1.0,$651));
     $653 = (+_fmodl((+$649),(+$652)));
     $654 = $649 - $653;
     $655 = $650 + $654;
     $bias$0$i = $650;$frac$0$i = $653;$y$1$i23 = $655;
    } else {
     $bias$0$i = 0.0;$frac$0$i = 0.0;$y$1$i23 = $649;
    }
    $656 = (($a$3$i) + 2)|0;
    $657 = $656 & 127;
    $658 = ($657|0)==($z$7$1$i|0);
    do {
     if ($658) {
      $frac$2$i = $frac$0$i;
     } else {
      $659 = (($x$i) + ($657<<2)|0);
      $660 = HEAP32[$659>>2]|0;
      $661 = ($660>>>0)<(500000000);
      do {
       if ($661) {
        $662 = ($660|0)==(0);
        if ($662) {
         $663 = (($a$3$i) + 3)|0;
         $664 = $663 & 127;
         $665 = ($664|0)==($z$7$1$i|0);
         if ($665) {
          $frac$1$i = $frac$0$i;
          break;
         }
        }
        $666 = $667 * 0.25;
        $668 = $666 + $frac$0$i;
        $frac$1$i = $668;
       } else {
        $669 = ($660>>>0)>(500000000);
        if ($669) {
         $670 = $667 * 0.75;
         $671 = $670 + $frac$0$i;
         $frac$1$i = $671;
         break;
        }
        $672 = (($a$3$i) + 3)|0;
        $673 = $672 & 127;
        $674 = ($673|0)==($z$7$1$i|0);
        if ($674) {
         $675 = $667 * 0.5;
         $676 = $675 + $frac$0$i;
         $frac$1$i = $676;
         break;
        } else {
         $677 = $667 * 0.75;
         $678 = $677 + $frac$0$i;
         $frac$1$i = $678;
         break;
        }
       }
      } while(0);
      $679 = (53 - ($$09$i))|0;
      $680 = ($679|0)>(1);
      if (!($680)) {
       $frac$2$i = $frac$1$i;
       break;
      }
      $681 = (+_fmodl((+$frac$1$i),1.0));
      $682 = $681 != 0.0;
      if ($682) {
       $frac$2$i = $frac$1$i;
       break;
      }
      $683 = $frac$1$i + 1.0;
      $frac$2$i = $683;
     }
    } while(0);
    $684 = $y$1$i23 + $frac$2$i;
    $685 = $684 - $bias$0$i;
    $686 = $687 & 2147483647;
    $688 = (-2 - ($sum$i))|0;
    $689 = ($686|0)>($688|0);
    do {
     if ($689) {
      $690 = (+Math_abs((+$685)));
      $691 = !($690 >= 9007199254740992.0);
      if ($691) {
       $denormal$2$i = $denormal$0$i;$e2$2$i = $e2$1$i;$y$2$i24 = $685;
      } else {
       $692 = ($denormal$0$i|0)!=(0);
       $693 = ($$09$i|0)==($645|0);
       $or$cond16$i = $692 & $693;
       $denormal$1$i = $or$cond16$i ? 0 : $denormal$0$i;
       $694 = $685 * 0.5;
       $695 = (($e2$1$i) + 1)|0;
       $denormal$2$i = $denormal$1$i;$e2$2$i = $695;$y$2$i24 = $694;
      }
      $696 = (($e2$2$i) + 50)|0;
      $697 = ($696|0)>($325|0);
      if (!($697)) {
       $698 = ($denormal$2$i|0)!=(0);
       $699 = $frac$2$i != 0.0;
       $or$cond17$i = $698 & $699;
       if (!($or$cond17$i)) {
        $e2$3$i = $e2$2$i;$y$3$i = $y$2$i24;
        break;
       }
      }
      $700 = (___errno_location()|0);
      HEAP32[$700>>2] = 34;
      $e2$3$i = $e2$2$i;$y$3$i = $y$2$i24;
     } else {
      $e2$3$i = $e2$1$i;$y$3$i = $685;
     }
    } while(0);
    $701 = (+_scalbnl($y$3$i,$e2$3$i));
    $$0 = $701;
    STACKTOP = sp;return (+$$0);
   } else {
    $108 = HEAP32[$1>>2]|0;
    $109 = ($108|0)==(0|0);
    if (!($109)) {
     $110 = HEAP32[$0>>2]|0;
     $111 = (($110) + -1|0);
     HEAP32[$0>>2] = $111;
    }
    $112 = (___errno_location()|0);
    HEAP32[$112>>2] = 22;
    ___shlim($f,0);
    $$0 = 0.0;
    STACKTOP = sp;return (+$$0);
   }
  }
 } while(0);
 if ((label|0) == 23) {
  $41 = HEAP32[$1>>2]|0;
  $42 = ($41|0)==(0|0);
  if (!($42)) {
   $43 = HEAP32[$0>>2]|0;
   $44 = (($43) + -1|0);
   HEAP32[$0>>2] = $44;
  }
  $notlhs = ($pok|0)==(0);
  $notrhs = ($i$0$lcssa>>>0)<(4);
  $or$cond106$not = $notrhs | $notlhs;
  $brmerge = $or$cond106$not | $42;
  if (!($brmerge)) {
   $i$166 = $i$0$lcssa;
   while(1) {
    $45 = HEAP32[$0>>2]|0;
    $46 = (($45) + -1|0);
    HEAP32[$0>>2] = $46;
    $47 = (($i$166) + -1)|0;
    $48 = ($47>>>0)>(3);
    if ($48) {
     $i$166 = $47;
    } else {
     break;
    }
   }
  }
 }
 $49 = (+($sign$0|0));
 $50 = $49 * inf;
 $51 = $50;
 $$0 = $51;
 STACKTOP = sp;return (+$$0);
}
function _scanexp($f,$pok) {
 $f = $f|0;
 $pok = $pok|0;
 var $$ = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0;
 var $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0;
 var $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $c$0 = 0, $c$1$be = 0;
 var $c$18 = 0, $c$2$be = 0, $c$2$lcssa = 0, $c$23 = 0, $c$3$be = 0, $neg$0 = 0, $or$cond = 0, $or$cond2 = 0, $phitmp16 = 0, $x$09 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 4|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (($f) + 100|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = ($1>>>0)<($3>>>0);
 if ($4) {
  $5 = (($1) + 1|0);
  HEAP32[$0>>2] = $5;
  $6 = HEAP8[$1>>0]|0;
  $7 = $6&255;
  $10 = $7;
 } else {
  $8 = (___shgetc($f)|0);
  $10 = $8;
 }
 $9 = ($10|0)==(45);
 if ((($10|0) == 43) | (($10|0) == 45)) {
  $11 = $9&1;
  $12 = HEAP32[$0>>2]|0;
  $13 = HEAP32[$2>>2]|0;
  $14 = ($12>>>0)<($13>>>0);
  if ($14) {
   $15 = (($12) + 1|0);
   HEAP32[$0>>2] = $15;
   $16 = HEAP8[$12>>0]|0;
   $17 = $16&255;
   $20 = $17;
  } else {
   $18 = (___shgetc($f)|0);
   $20 = $18;
  }
  $19 = (($20) + -48)|0;
  $21 = ($19>>>0)<(10);
  $22 = ($pok|0)==(0);
  $or$cond = $21 | $22;
  if ($or$cond) {
   $c$0 = $20;$neg$0 = $11;
  } else {
   $23 = HEAP32[$2>>2]|0;
   $24 = ($23|0)==(0|0);
   if ($24) {
    $c$0 = $20;$neg$0 = $11;
   } else {
    $25 = HEAP32[$0>>2]|0;
    $26 = (($25) + -1|0);
    HEAP32[$0>>2] = $26;
    $c$0 = $20;$neg$0 = $11;
   }
  }
 } else {
  $c$0 = $10;$neg$0 = 0;
 }
 $27 = (($c$0) + -48)|0;
 $28 = ($27>>>0)>(9);
 if ($28) {
  $29 = HEAP32[$2>>2]|0;
  $30 = ($29|0)==(0|0);
  if ($30) {
   $95 = -2147483648;$96 = 0;
   tempRet0 = $95;
   STACKTOP = sp;return ($96|0);
  }
  $31 = HEAP32[$0>>2]|0;
  $32 = (($31) + -1|0);
  HEAP32[$0>>2] = $32;
  $95 = -2147483648;$96 = 0;
  tempRet0 = $95;
  STACKTOP = sp;return ($96|0);
 } else {
  $c$18 = $c$0;$x$09 = 0;
 }
 while(1) {
  $33 = (($c$18) + -48)|0;
  $34 = (($33) + ($x$09))|0;
  $35 = HEAP32[$0>>2]|0;
  $36 = HEAP32[$2>>2]|0;
  $37 = ($35>>>0)<($36>>>0);
  if ($37) {
   $38 = (($35) + 1|0);
   HEAP32[$0>>2] = $38;
   $39 = HEAP8[$35>>0]|0;
   $40 = $39&255;
   $c$1$be = $40;
  } else {
   $41 = (___shgetc($f)|0);
   $c$1$be = $41;
  }
  $42 = (($c$1$be) + -48)|0;
  $43 = ($42>>>0)<(10);
  $44 = ($34|0)<(214748364);
  $$ = $43 & $44;
  if (!($$)) {
   break;
  }
  $phitmp16 = ($34*10)|0;
  $c$18 = $c$1$be;$x$09 = $phitmp16;
 }
 $45 = ($34|0)<(0);
 $46 = $45 << 31 >> 31;
 $47 = (($c$1$be) + -48)|0;
 $48 = ($47>>>0)<(10);
 if ($48) {
  $51 = $34;$52 = $46;$c$23 = $c$1$be;
  while(1) {
   $53 = (___muldi3(($51|0),($52|0),10,0)|0);
   $54 = tempRet0;
   $55 = ($c$23|0)<(0);
   $56 = $55 << 31 >> 31;
   $57 = (_i64Add(($c$23|0),($56|0),-48,-1)|0);
   $58 = tempRet0;
   $59 = (_i64Add(($57|0),($58|0),($53|0),($54|0))|0);
   $60 = tempRet0;
   $61 = HEAP32[$0>>2]|0;
   $62 = HEAP32[$2>>2]|0;
   $63 = ($61>>>0)<($62>>>0);
   if ($63) {
    $64 = (($61) + 1|0);
    HEAP32[$0>>2] = $64;
    $65 = HEAP8[$61>>0]|0;
    $66 = $65&255;
    $c$2$be = $66;
   } else {
    $67 = (___shgetc($f)|0);
    $c$2$be = $67;
   }
   $68 = (($c$2$be) + -48)|0;
   $69 = ($68>>>0)<(10);
   $70 = ($60|0)<(21474836);
   $71 = ($60|0)==(21474836);
   $72 = ($59>>>0)<(2061584302);
   $73 = $71 & $72;
   $74 = $70 | $73;
   $or$cond2 = $69 & $74;
   if ($or$cond2) {
    $51 = $59;$52 = $60;$c$23 = $c$2$be;
   } else {
    $89 = $59;$90 = $60;$c$2$lcssa = $c$2$be;
    break;
   }
  }
 } else {
  $89 = $34;$90 = $46;$c$2$lcssa = $c$1$be;
 }
 $49 = (($c$2$lcssa) + -48)|0;
 $50 = ($49>>>0)<(10);
 if ($50) {
  while(1) {
   $75 = HEAP32[$0>>2]|0;
   $76 = HEAP32[$2>>2]|0;
   $77 = ($75>>>0)<($76>>>0);
   if ($77) {
    $78 = (($75) + 1|0);
    HEAP32[$0>>2] = $78;
    $79 = HEAP8[$75>>0]|0;
    $80 = $79&255;
    $c$3$be = $80;
   } else {
    $81 = (___shgetc($f)|0);
    $c$3$be = $81;
   }
   $82 = (($c$3$be) + -48)|0;
   $83 = ($82>>>0)<(10);
   if (!($83)) {
    break;
   }
  }
 }
 $84 = HEAP32[$2>>2]|0;
 $85 = ($84|0)==(0|0);
 if (!($85)) {
  $86 = HEAP32[$0>>2]|0;
  $87 = (($86) + -1|0);
  HEAP32[$0>>2] = $87;
 }
 $88 = ($neg$0|0)!=(0);
 $91 = (_i64Subtract(0,0,($89|0),($90|0))|0);
 $92 = tempRet0;
 $93 = $88 ? $91 : $89;
 $94 = $88 ? $92 : $90;
 $95 = $94;$96 = $93;
 tempRet0 = $95;
 STACKTOP = sp;return ($96|0);
}
function ___shlim($f,$lim) {
 $f = $f|0;
 $lim = $lim|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 104|0);
 HEAP32[$0>>2] = $lim;
 $1 = (($f) + 8|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($f) + 4|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = $2;
 $6 = $4;
 $7 = (($5) - ($6))|0;
 $8 = (($f) + 108|0);
 HEAP32[$8>>2] = $7;
 $9 = ($lim|0)!=(0);
 $10 = ($7|0)>($lim|0);
 $or$cond = $9 & $10;
 if ($or$cond) {
  $11 = (($4) + ($lim)|0);
  $12 = (($f) + 100|0);
  HEAP32[$12>>2] = $11;
  STACKTOP = sp;return;
 } else {
  $13 = (($f) + 100|0);
  HEAP32[$13>>2] = $2;
  STACKTOP = sp;return;
 }
}
function ___shgetc($f) {
 $f = $f|0;
 var $$0 = 0, $$phi$trans$insert = 0, $$phi$trans$insert2 = 0, $$pre = 0, $$pre3 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 104|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==(0);
 if ($2) {
  label = 3;
 } else {
  $3 = (($f) + 108|0);
  $4 = HEAP32[$3>>2]|0;
  $5 = ($4|0)<($1|0);
  if ($5) {
   label = 3;
  }
 }
 if ((label|0) == 3) {
  $6 = (___uflow($f)|0);
  $7 = ($6|0)<(0);
  if (!($7)) {
   $9 = HEAP32[$0>>2]|0;
   $10 = ($9|0)==(0);
   $$phi$trans$insert = (($f) + 8|0);
   $$pre = HEAP32[$$phi$trans$insert>>2]|0;
   if ($10) {
    label = 8;
   } else {
    $11 = (($f) + 4|0);
    $12 = HEAP32[$11>>2]|0;
    $13 = $$pre;
    $14 = $12;
    $15 = (($13) - ($14))|0;
    $16 = (($f) + 108|0);
    $17 = HEAP32[$16>>2]|0;
    $18 = (($9) - ($17))|0;
    $19 = (($18) + -1)|0;
    $20 = ($15|0)>($19|0);
    if ($20) {
     $21 = (($12) + ($19)|0);
     $22 = (($f) + 100|0);
     HEAP32[$22>>2] = $21;
    } else {
     label = 8;
    }
   }
   if ((label|0) == 8) {
    $23 = (($f) + 100|0);
    HEAP32[$23>>2] = $$pre;
   }
   $24 = ($$pre|0)==(0|0);
   $$phi$trans$insert2 = (($f) + 4|0);
   $$pre3 = HEAP32[$$phi$trans$insert2>>2]|0;
   if (!($24)) {
    $25 = $$pre;
    $26 = $$pre3;
    $27 = (($f) + 108|0);
    $28 = HEAP32[$27>>2]|0;
    $29 = (($25) + 1)|0;
    $30 = (($29) - ($26))|0;
    $31 = (($30) + ($28))|0;
    HEAP32[$27>>2] = $31;
   }
   $32 = (($$pre3) + -1|0);
   $33 = HEAP8[$32>>0]|0;
   $34 = $33&255;
   $35 = ($34|0)==($6|0);
   if ($35) {
    $$0 = $6;
    STACKTOP = sp;return ($$0|0);
   }
   $36 = $6&255;
   HEAP8[$32>>0] = $36;
   $$0 = $6;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $8 = (($f) + 100|0);
 HEAP32[$8>>2] = 0;
 $$0 = -1;
 STACKTOP = sp;return ($$0|0);
}
function _frexp($x,$e) {
 $x = +$x;
 $e = $e|0;
 var $$0 = 0.0, $$01 = 0.0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0.0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0.0, $7 = 0.0, $8 = 0, $9 = 0, $storemerge = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF64[tempDoublePtr>>3] = $x;$0 = HEAP32[tempDoublePtr>>2]|0;
 $1 = HEAP32[tempDoublePtr+4>>2]|0;
 $2 = (_bitshift64Lshr(($0|0),($1|0),52)|0);
 $3 = tempRet0;
 $4 = $2 & 2047;
 if ((($4|0) == 0)) {
  $5 = $x != 0.0;
  if ($5) {
   $6 = $x * 1.8446744073709552E+19;
   $7 = (+_frexp($6,$e));
   $8 = HEAP32[$e>>2]|0;
   $9 = (($8) + -64)|0;
   $$01 = $7;$storemerge = $9;
  } else {
   $$01 = $x;$storemerge = 0;
  }
  HEAP32[$e>>2] = $storemerge;
  $$0 = $$01;
  STACKTOP = sp;return (+$$0);
 } else if ((($4|0) == 2047)) {
  $$0 = $x;
  STACKTOP = sp;return (+$$0);
 } else {
  $10 = (($4) + -1022)|0;
  HEAP32[$e>>2] = $10;
  $11 = $1 & -2146435073;
  $12 = $11 | 1071644672;
  HEAP32[tempDoublePtr>>2] = $0;HEAP32[tempDoublePtr+4>>2] = $12;$13 = +HEAPF64[tempDoublePtr>>3];
  $$0 = $13;
  STACKTOP = sp;return (+$$0);
 }
 return +0;
}
function _frexpl($x,$e) {
 $x = +$x;
 $e = $e|0;
 var $0 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (+_frexp($x,$e));
 STACKTOP = sp;return (+$0);
}
function _scalbn($x,$n) {
 $x = +$x;
 $n = $n|0;
 var $$ = 0, $$0 = 0, $$1 = 0, $0 = 0, $1 = 0.0, $10 = 0, $11 = 0.0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0.0, $18 = 0.0, $2 = 0, $3 = 0, $4 = 0.0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0.0, $9 = 0, $y$0 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($n|0)>(1023);
 if ($0) {
  $1 = $x * 8.9884656743115795E+307;
  $2 = (($n) + -1023)|0;
  $3 = ($2|0)>(1023);
  if ($3) {
   $4 = $1 * 8.9884656743115795E+307;
   $5 = (($n) + -2046)|0;
   $6 = ($5|0)>(1023);
   $$ = $6 ? 1023 : $5;
   $$0 = $$;$y$0 = $4;
  } else {
   $$0 = $2;$y$0 = $1;
  }
 } else {
  $7 = ($n|0)<(-1022);
  if ($7) {
   $8 = $x * 2.2250738585072014E-308;
   $9 = (($n) + 1022)|0;
   $10 = ($9|0)<(-1022);
   if ($10) {
    $11 = $8 * 2.2250738585072014E-308;
    $12 = (($n) + 2044)|0;
    $13 = ($12|0)<(-1022);
    $$1 = $13 ? -1022 : $12;
    $$0 = $$1;$y$0 = $11;
   } else {
    $$0 = $9;$y$0 = $8;
   }
  } else {
   $$0 = $n;$y$0 = $x;
  }
 }
 $14 = (($$0) + 1023)|0;
 $15 = (_bitshift64Shl(($14|0),0,52)|0);
 $16 = tempRet0;
 HEAP32[tempDoublePtr>>2] = $15;HEAP32[tempDoublePtr+4>>2] = $16;$17 = +HEAPF64[tempDoublePtr>>3];
 $18 = $y$0 * $17;
 STACKTOP = sp;return (+$18);
}
function _scalbnl($x,$n) {
 $x = +$x;
 $n = $n|0;
 var $0 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (+_scalbn($x,$n));
 STACKTOP = sp;return (+$0);
}
function _wctomb($s,$wc) {
 $s = $s|0;
 $wc = $wc|0;
 var $$0 = 0, $0 = 0, $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($s|0)==(0|0);
 if ($0) {
  $$0 = 0;
 } else {
  $1 = (_wcrtomb($s,$wc,0)|0);
  $$0 = $1;
 }
 STACKTOP = sp;return ($$0|0);
}
function _wcrtomb($s,$wc,$st) {
 $s = $s|0;
 $wc = $wc|0;
 $st = $st|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = ($s|0)==(0|0);
 if ($0) {
  $$0 = 1;
  STACKTOP = sp;return ($$0|0);
 }
 $1 = ($wc>>>0)<(128);
 if ($1) {
  $2 = $wc&255;
  HEAP8[$s>>0] = $2;
  $$0 = 1;
  STACKTOP = sp;return ($$0|0);
 }
 $3 = ($wc>>>0)<(2048);
 if ($3) {
  $4 = $wc >>> 6;
  $5 = $4 | 192;
  $6 = $5&255;
  $7 = (($s) + 1|0);
  HEAP8[$s>>0] = $6;
  $8 = $wc & 63;
  $9 = $8 | 128;
  $10 = $9&255;
  HEAP8[$7>>0] = $10;
  $$0 = 2;
  STACKTOP = sp;return ($$0|0);
 }
 $11 = ($wc>>>0)<(55296);
 $12 = (($wc) + -57344)|0;
 $13 = ($12>>>0)<(8192);
 $or$cond = $11 | $13;
 if ($or$cond) {
  $14 = $wc >>> 12;
  $15 = $14 | 224;
  $16 = $15&255;
  $17 = (($s) + 1|0);
  HEAP8[$s>>0] = $16;
  $18 = $wc >>> 6;
  $19 = $18 & 63;
  $20 = $19 | 128;
  $21 = $20&255;
  $22 = (($s) + 2|0);
  HEAP8[$17>>0] = $21;
  $23 = $wc & 63;
  $24 = $23 | 128;
  $25 = $24&255;
  HEAP8[$22>>0] = $25;
  $$0 = 3;
  STACKTOP = sp;return ($$0|0);
 }
 $26 = (($wc) + -65536)|0;
 $27 = ($26>>>0)<(1048576);
 if ($27) {
  $28 = $wc >>> 18;
  $29 = $28 | 240;
  $30 = $29&255;
  $31 = (($s) + 1|0);
  HEAP8[$s>>0] = $30;
  $32 = $wc >>> 12;
  $33 = $32 & 63;
  $34 = $33 | 128;
  $35 = $34&255;
  $36 = (($s) + 2|0);
  HEAP8[$31>>0] = $35;
  $37 = $wc >>> 6;
  $38 = $37 & 63;
  $39 = $38 | 128;
  $40 = $39&255;
  $41 = (($s) + 3|0);
  HEAP8[$36>>0] = $40;
  $42 = $wc & 63;
  $43 = $42 | 128;
  $44 = $43&255;
  HEAP8[$41>>0] = $44;
  $$0 = 4;
  STACKTOP = sp;return ($$0|0);
 } else {
  $45 = (___errno_location()|0);
  HEAP32[$45>>2] = 84;
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function ___toread($f) {
 $f = $f|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 74|0);
 $1 = HEAP8[$0>>0]|0;
 $2 = $1 << 24 >> 24;
 $3 = (($2) + 255)|0;
 $4 = $3 | $2;
 $5 = $4&255;
 HEAP8[$0>>0] = $5;
 $6 = (($f) + 20|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (($f) + 44|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = ($7>>>0)>($9>>>0);
 if ($10) {
  $11 = (($f) + 36|0);
  $12 = HEAP32[$11>>2]|0;
  (FUNCTION_TABLE_iiii[$12 & 31]($f,0,0)|0);
 }
 $13 = (($f) + 16|0);
 HEAP32[$13>>2] = 0;
 $14 = (($f) + 28|0);
 HEAP32[$14>>2] = 0;
 HEAP32[$6>>2] = 0;
 $15 = HEAP32[$f>>2]|0;
 $16 = $15 & 20;
 $17 = ($16|0)==(0);
 if ($17) {
  $21 = HEAP32[$8>>2]|0;
  $22 = (($f) + 8|0);
  HEAP32[$22>>2] = $21;
  $23 = (($f) + 4|0);
  HEAP32[$23>>2] = $21;
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $18 = $15 & 4;
 $19 = ($18|0)==(0);
 if ($19) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $20 = $15 | 32;
 HEAP32[$f>>2] = $20;
 $$0 = -1;
 STACKTOP = sp;return ($$0|0);
}
function ___towrite($f) {
 $f = $f|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 74|0);
 $1 = HEAP8[$0>>0]|0;
 $2 = $1 << 24 >> 24;
 $3 = (($2) + 255)|0;
 $4 = $3 | $2;
 $5 = $4&255;
 HEAP8[$0>>0] = $5;
 $6 = HEAP32[$f>>2]|0;
 $7 = $6 & 8;
 $8 = ($7|0)==(0);
 if ($8) {
  $10 = (($f) + 8|0);
  HEAP32[$10>>2] = 0;
  $11 = (($f) + 4|0);
  HEAP32[$11>>2] = 0;
  $12 = (($f) + 44|0);
  $13 = HEAP32[$12>>2]|0;
  $14 = (($f) + 28|0);
  HEAP32[$14>>2] = $13;
  $15 = (($f) + 20|0);
  HEAP32[$15>>2] = $13;
  $16 = (($f) + 48|0);
  $17 = HEAP32[$16>>2]|0;
  $18 = (($13) + ($17)|0);
  $19 = (($f) + 16|0);
  HEAP32[$19>>2] = $18;
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 } else {
  $9 = $6 | 32;
  HEAP32[$f>>2] = $9;
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function ___uflow($f) {
 $f = $f|0;
 var $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $c = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $c = sp;
 $0 = (($f) + 8|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==(0|0);
 if ($2) {
  $3 = (___toread($f)|0);
  $4 = ($3|0)==(0);
  if ($4) {
   label = 3;
  } else {
   $$0 = -1;
  }
 } else {
  label = 3;
 }
 if ((label|0) == 3) {
  $5 = (($f) + 32|0);
  $6 = HEAP32[$5>>2]|0;
  $7 = (FUNCTION_TABLE_iiii[$6 & 31]($f,$c,1)|0);
  $8 = ($7|0)==(1);
  if ($8) {
   $9 = HEAP8[$c>>0]|0;
   $10 = $9&255;
   $$0 = $10;
  } else {
   $$0 = -1;
  }
 }
 STACKTOP = sp;return ($$0|0);
}
function ___fwritex($s,$l,$f) {
 $s = $s|0;
 $l = $l|0;
 $f = $f|0;
 var $$0 = 0, $$01 = 0, $$02 = 0, $$pre = 0, $$pre6 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $i$0 = 0, $i$1 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 16|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = ($1|0)==(0|0);
 do {
  if ($2) {
   $3 = (___towrite($f)|0);
   $4 = ($3|0)==(0);
   if ($4) {
    $$pre6 = HEAP32[$0>>2]|0;
    $8 = $$pre6;
    break;
   } else {
    $$0 = 0;
    STACKTOP = sp;return ($$0|0);
   }
  } else {
   $8 = $1;
  }
 } while(0);
 $5 = (($f) + 20|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = $8;
 $9 = $6;
 $10 = (($7) - ($9))|0;
 $11 = ($10>>>0)<($l>>>0);
 if ($11) {
  $12 = (($f) + 36|0);
  $13 = HEAP32[$12>>2]|0;
  $14 = (FUNCTION_TABLE_iiii[$13 & 31]($f,$s,$l)|0);
  $$0 = $14;
  STACKTOP = sp;return ($$0|0);
 }
 $15 = (($f) + 75|0);
 $16 = HEAP8[$15>>0]|0;
 $17 = ($16<<24>>24)>(-1);
 L11: do {
  if ($17) {
   $i$0 = $l;
   while(1) {
    $18 = ($i$0|0)==(0);
    if ($18) {
     $$01 = $l;$$02 = $s;$29 = $6;$i$1 = 0;
     break L11;
    }
    $19 = (($i$0) + -1)|0;
    $20 = (($s) + ($19)|0);
    $21 = HEAP8[$20>>0]|0;
    $22 = ($21<<24>>24)==(10);
    if ($22) {
     break;
    } else {
     $i$0 = $19;
    }
   }
   $23 = (($f) + 36|0);
   $24 = HEAP32[$23>>2]|0;
   $25 = (FUNCTION_TABLE_iiii[$24 & 31]($f,$s,$i$0)|0);
   $26 = ($25>>>0)<($i$0>>>0);
   if ($26) {
    $$0 = $i$0;
    STACKTOP = sp;return ($$0|0);
   } else {
    $27 = (($s) + ($i$0)|0);
    $28 = (($l) - ($i$0))|0;
    $$pre = HEAP32[$5>>2]|0;
    $$01 = $28;$$02 = $27;$29 = $$pre;$i$1 = $i$0;
    break;
   }
  } else {
   $$01 = $l;$$02 = $s;$29 = $6;$i$1 = 0;
  }
 } while(0);
 _memcpy(($29|0),($$02|0),($$01|0))|0;
 $30 = HEAP32[$5>>2]|0;
 $31 = (($30) + ($$01)|0);
 HEAP32[$5>>2] = $31;
 $32 = (($i$1) + ($$01))|0;
 $$0 = $32;
 STACKTOP = sp;return ($$0|0);
}
function _sprintf($s,$fmt,$varargs) {
 $s = $s|0;
 $fmt = $fmt|0;
 $varargs = $varargs|0;
 var $0 = 0, $ap = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $ap = sp;
 HEAP32[$ap>>2] = $varargs;
 $0 = (_vsprintf($s,$fmt,$ap)|0);
 STACKTOP = sp;return ($0|0);
}
function _MUSL_vfprintf($f,$fmt,$ap) {
 $f = $f|0;
 $fmt = $fmt|0;
 $ap = $ap|0;
 var $$ = 0, $$0 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var $ap2 = 0, $internal_buf = 0, $nl_arg = 0, $nl_type = 0, $ret$1 = 0, $vacopy_currentptr = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $ap2 = sp + 120|0;
 $nl_type = sp + 80|0;
 $nl_arg = sp;
 $internal_buf = sp + 136|0;
 dest=$nl_type+0|0; stop=dest+40|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $vacopy_currentptr = HEAP32[$ap>>2]|0;
 HEAP32[$ap2>>2] = $vacopy_currentptr;
 $0 = (_printf_core(0,$fmt,$ap2,$nl_arg,$nl_type)|0);
 $1 = ($0|0)<(0);
 if ($1) {
  $$0 = -1;
  STACKTOP = sp;return ($$0|0);
 }
 $2 = (($f) + 48|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = ($3|0)==(0);
 if ($4) {
  $6 = (($f) + 44|0);
  $7 = HEAP32[$6>>2]|0;
  HEAP32[$6>>2] = $internal_buf;
  $8 = (($f) + 28|0);
  HEAP32[$8>>2] = $internal_buf;
  $9 = (($f) + 20|0);
  HEAP32[$9>>2] = $internal_buf;
  HEAP32[$2>>2] = 80;
  $10 = (($internal_buf) + 80|0);
  $11 = (($f) + 16|0);
  HEAP32[$11>>2] = $10;
  $12 = (_printf_core($f,$fmt,$ap2,$nl_arg,$nl_type)|0);
  $13 = ($7|0)==(0|0);
  if ($13) {
   $ret$1 = $12;
  } else {
   $14 = (($f) + 36|0);
   $15 = HEAP32[$14>>2]|0;
   (FUNCTION_TABLE_iiii[$15 & 31]($f,0,0)|0);
   $16 = HEAP32[$9>>2]|0;
   $17 = ($16|0)==(0|0);
   $$ = $17 ? -1 : $12;
   HEAP32[$6>>2] = $7;
   HEAP32[$2>>2] = 0;
   HEAP32[$11>>2] = 0;
   HEAP32[$8>>2] = 0;
   HEAP32[$9>>2] = 0;
   $ret$1 = $$;
  }
 } else {
  $5 = (_printf_core($f,$fmt,$ap2,$nl_arg,$nl_type)|0);
  $ret$1 = $5;
 }
 $$0 = $ret$1;
 STACKTOP = sp;return ($$0|0);
}
function _printf_core($f,$fmt,$ap,$nl_arg,$nl_type) {
 $f = $f|0;
 $fmt = $fmt|0;
 $ap = $ap|0;
 $nl_arg = $nl_arg|0;
 $nl_type = $nl_type|0;
 var $$ = 0, $$$5$i = 0, $$$i = 0, $$$p$i = 0, $$0 = 0, $$0$lcssa$i = 0, $$0$lcssa$i$i = 0, $$0$lcssa$i103$i = 0, $$0$lcssa$i127$i = 0, $$0$lcssa$i142$i = 0, $$0$lcssa$i37 = 0, $$0$lcssa$i38$i = 0, $$0$lcssa$i43 = 0, $$0$lcssa$i45 = 0, $$0$lcssa$i45$i = 0, $$0$lcssa$i48$i = 0, $$0$lcssa$i52 = 0, $$0$lcssa$i55$i = 0, $$0$lcssa$i59 = 0, $$0$lcssa$i62$i = 0;
 var $$0$lcssa$i66 = 0, $$0$lcssa$i68$i = 0, $$0$lcssa$i75$i = 0, $$0$lcssa$i76 = 0, $$0$lcssa$i84$i = 0, $$0$lcssa$i96$i = 0, $$01$i = 0, $$01$i$i = 0, $$01$i101$i = 0, $$01$i125$i = 0, $$01$i140$i = 0, $$01$i35 = 0, $$01$i36$i = 0, $$01$i43$i = 0, $$01$i50 = 0, $$01$i53$i = 0, $$01$i57 = 0, $$01$i60$i = 0, $$01$i64 = 0, $$01$i66$i = 0;
 var $$01$i73$i = 0, $$01$i74 = 0, $$01$i94$i = 0, $$01$lcssa$off0$i = 0, $$01$lcssa$off0$i$i = 0, $$01$lcssa$off0$i85$i = 0, $$012$i = 0, $$013$i = 0, $$03$i40 = 0, $$05$i = 0, $$05$i$i = 0, $$05$i79$i = 0, $$07$i = 0.0, $$1$i = 0.0, $$1$lcssa$i$i = 0, $$1$lcssa$i112$i = 0, $$114$i = 0, $$12$i = 0, $$12$i$i = 0, $$12$i110$i = 0;
 var $$12$i119$i = 0, $$12$i134$i = 0, $$12$i87$i = 0, $$13 = 0, $$14 = 0, $$15 = 0, $$17 = 0, $$2$i = 0.0, $$2$us$i = 0.0, $$2$us$us$i = 0.0, $$2$us159$i = 0.0, $$20$i = 0, $$20$us$i = 0, $$21$i = 0, $$210$$23$i = 0, $$210$$25$i = 0, $$210$i = 0, $$22$i = 0.0, $$23$i = 0, $$25$i = 0;
 var $$3$i = 0.0, $$31$i = 0, $$311$i = 0, $$4$i = 0.0, $$412$lcssa$i = 0, $$412175$i = 0, $$5193$i = 0, $$a$3$i = 0, $$a$3$us$i = 0, $$a$3$us322$i = 0, $$a$3$us323$i = 0, $$a$3324$i = 0, $$a$3325$i = 0, $$fl$4 = 0, $$lcssa300$i = 0, $$lcssa92 = 0, $$mask$i = 0, $$mask$i30 = 0, $$mask1$i = 0, $$mask1$i29 = 0;
 var $$neg151$i = 0, $$neg152$i = 0, $$not$i = 0, $$p$5 = 0, $$p$i = 0, $$pn$i = 0, $$pr$i = 0, $$pr146$i = 0, $$pre = 0, $$pre$i = 0, $$pre290 = 0, $$pre292 = 0, $$pre319$i = 0, $$sum$i = 0, $$sum15$i = 0, $$sum16$i = 0, $$z$3$i = 0, $$z$4$us$i = 0, $0 = 0, $1 = 0;
 var $10 = 0, $100 = 0, $1000 = 0, $1001 = 0, $1002 = 0, $1003 = 0, $1004 = 0, $1005 = 0, $1006 = 0, $1007 = 0, $1008 = 0, $1009 = 0, $101 = 0, $1010 = 0, $1011 = 0, $1012 = 0, $1013 = 0, $1014 = 0, $1015 = 0, $1016 = 0;
 var $1017 = 0, $1018 = 0, $1019 = 0, $102 = 0, $1020 = 0, $1021 = 0, $1022 = 0, $1023 = 0, $1024 = 0, $1025 = 0, $1026 = 0, $1027 = 0, $1028 = 0, $1029 = 0, $103 = 0, $1030 = 0, $1031 = 0, $1032 = 0, $1033 = 0, $1034 = 0;
 var $1035 = 0, $1036 = 0.0, $1037 = 0.0, $1038 = 0, $1039 = 0, $104 = 0, $1040 = 0, $1041 = 0, $1042 = 0, $1043 = 0, $1044 = 0, $1045 = 0, $1045$phi = 0, $1046 = 0, $1046$phi = 0, $1047 = 0, $1048 = 0, $1049 = 0, $105 = 0, $1050 = 0;
 var $1051 = 0, $1052 = 0, $1053 = 0, $1054 = 0, $1055 = 0, $1056 = 0, $1057 = 0, $1058 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0;
 var $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0;
 var $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0;
 var $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0;
 var $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0;
 var $19 = 0, $190 = 0.0, $191 = 0, $192 = 0, $193 = 0, $194 = 0.0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0;
 var $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0;
 var $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0;
 var $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0;
 var $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0;
 var $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0;
 var $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0;
 var $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0;
 var $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0;
 var $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0.0;
 var $37 = 0, $370 = 0, $371 = 0.0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0;
 var $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0;
 var $405 = 0, $406 = 0, $407 = 0.0, $408 = 0.0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0.0;
 var $423 = 0, $424 = 0, $425 = 0, $426 = 0.0, $427 = 0.0, $428 = 0.0, $429 = 0.0, $43 = 0, $430 = 0.0, $431 = 0.0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0;
 var $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0;
 var $46 = 0, $460 = 0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0;
 var $478 = 0, $479 = 0, $48 = 0, $480 = 0.0, $481 = 0.0, $482 = 0.0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0.0;
 var $496 = 0.0, $497 = 0.0, $498 = 0, $499 = 0, $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0.0, $511 = 0.0, $512 = 0.0;
 var $513 = 0, $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0.0, $526 = 0.0, $527 = 0.0, $528 = 0, $529 = 0, $53 = 0, $530 = 0;
 var $531 = 0, $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0;
 var $55 = 0, $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0;
 var $568 = 0, $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0.0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0.0;
 var $586 = 0.0, $587 = 0.0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0;
 var $603 = 0, $604 = 0, $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0;
 var $621 = 0, $622 = 0, $623 = 0, $624 = 0, $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0;
 var $64 = 0, $640 = 0, $641 = 0, $642 = 0, $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0;
 var $658 = 0, $659 = 0, $66 = 0, $660 = 0, $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0, $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0;
 var $676 = 0, $677 = 0, $678 = 0, $679 = 0, $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0;
 var $694 = 0, $695 = 0, $696 = 0, $697 = 0, $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0;
 var $711 = 0, $712 = 0, $713 = 0, $714 = 0, $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0, $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0.0, $726 = 0.0, $727 = 0, $728 = 0.0, $729 = 0;
 var $73 = 0, $730 = 0, $731 = 0, $732 = 0, $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0;
 var $748 = 0, $749 = 0, $75 = 0, $750 = 0, $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0;
 var $766 = 0, $767 = 0, $768 = 0, $769 = 0, $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0;
 var $784 = 0, $785 = 0, $786 = 0, $787 = 0, $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0, $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0;
 var $801 = 0, $802 = 0, $803 = 0, $804 = 0, $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0;
 var $82 = 0, $820 = 0, $821 = 0, $822 = 0, $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0, $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0;
 var $838 = 0, $839 = 0, $84 = 0, $840 = 0, $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0;
 var $856 = 0, $857 = 0, $858 = 0, $859 = 0, $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0, $864 = 0, $865 = 0, $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0;
 var $874 = 0, $875 = 0, $876 = 0, $877 = 0, $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0, $882 = 0, $883 = 0, $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0;
 var $892 = 0, $893 = 0, $894 = 0, $895 = 0, $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0, $90 = 0, $900 = 0, $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0;
 var $91 = 0, $910 = 0, $911 = 0, $912 = 0, $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0, $918 = 0, $919 = 0, $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0;
 var $928 = 0, $929 = 0, $93 = 0, $930 = 0, $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0, $936 = 0, $937 = 0, $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0;
 var $946 = 0, $947 = 0, $948 = 0, $949 = 0, $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0, $954 = 0, $955 = 0, $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0;
 var $964 = 0, $965 = 0, $966 = 0, $967 = 0, $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0, $972 = 0, $973 = 0, $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $980 = 0, $981 = 0;
 var $982 = 0, $983 = 0, $984 = 0, $985 = 0, $986 = 0, $987 = 0, $988 = 0, $989 = 0, $99 = 0, $990 = 0, $991 = 0, $992 = 0, $993 = 0, $994 = 0, $995 = 0, $996 = 0, $997 = 0, $998 = 0, $999 = 0, $a$0 = 0;
 var $a$1 = 0, $a$1$lcssa$i = 0, $a$1263$i = 0, $a$2 = 0, $a$2$ph$i = 0, $a$3$lcssa$i = 0, $a$3249$i = 0, $a$3249$us$i = 0, $a$5$lcssa$i = 0, $a$5223$i = 0, $a$6$i = 0, $a$7$i = 0, $a$8$ph$i = 0, $arglist_current = 0, $arglist_current11 = 0, $arglist_current14 = 0, $arglist_current17 = 0, $arglist_current2 = 0, $arglist_current20 = 0, $arglist_current23 = 0;
 var $arglist_current26 = 0, $arglist_current29 = 0, $arglist_current32 = 0, $arglist_current35 = 0, $arglist_current38 = 0, $arglist_current41 = 0, $arglist_current44 = 0, $arglist_current47 = 0, $arglist_current5 = 0, $arglist_current50 = 0, $arglist_current53 = 0, $arglist_current56 = 0, $arglist_current59 = 0, $arglist_current62 = 0, $arglist_current8 = 0, $arglist_next = 0, $arglist_next12 = 0, $arglist_next15 = 0, $arglist_next18 = 0, $arglist_next21 = 0;
 var $arglist_next24 = 0, $arglist_next27 = 0, $arglist_next3 = 0, $arglist_next30 = 0, $arglist_next33 = 0, $arglist_next36 = 0, $arglist_next39 = 0, $arglist_next42 = 0, $arglist_next45 = 0, $arglist_next48 = 0, $arglist_next51 = 0, $arglist_next54 = 0, $arglist_next57 = 0, $arglist_next6 = 0, $arglist_next60 = 0, $arglist_next63 = 0, $arglist_next9 = 0, $argpos$0 = 0, $big$i = 0, $brmerge$i = 0;
 var $buf = 0, $buf$i = 0, $carry$0255$i = 0, $carry3$0243$i = 0, $carry3$0243$us$i = 0, $cnt$0 = 0, $cnt$1 = 0, $d$0$i = 0, $d$0254$i = 0, $d$0256$i = 0, $d$1242$i = 0, $d$1242$us$i = 0, $d$2$lcssa$i = 0, $d$2222$i = 0, $d$3$i = 0, $d$4183$i = 0, $d$5174$i = 0, $d$6192$i = 0, $e$0238$i = 0, $e$1$i = 0;
 var $e$2218$i = 0, $e$3$i = 0, $e$4$ph$i = 0, $e2$i = 0, $ebuf0$i = 0, $estr$0$i = 0, $estr$1$lcssa$i = 0, $estr$1$ph$i = 0, $estr$1200$i = 0, $estr$2$i = 0, $exitcond$i = 0, $fl$0100 = 0, $fl$0104 = 0, $fl$1 = 0, $fl$1$ = 0, $fl$3 = 0, $fl$4 = 0, $fl$6 = 0, $i$0$lcssa = 0, $i$0166 = 0;
 var $i$0168 = 0, $i$0237$i = 0, $i$03$i = 0, $i$03$i22 = 0, $i$1$lcssa$i = 0, $i$1174 = 0, $i$1230$i = 0, $i$2217$i = 0, $i$289 = 0, $i$3209$i = 0, $i$388 = 0, $isdigit = 0, $isdigit$i = 0, $isdigit$i24 = 0, $isdigit11 = 0, $isdigit2$i = 0, $isdigit2$i21 = 0, $isdigit9 = 0, $isdigittmp = 0, $isdigittmp$i = 0;
 var $isdigittmp$i23 = 0, $isdigittmp1$i = 0, $isdigittmp1$i20 = 0, $isdigittmp10 = 0, $isdigittmp8 = 0, $j$0$i = 0, $j$0229$i = 0, $j$0231$i = 0, $j$1210$i = 0, $j$2$i = 0, $l$0 = 0, $l$0$i = 0, $l$1$i = 0, $l$1$lcssa = 0, $l$1167 = 0, $l10n$0 = 0, $l10n$0$phi = 0, $l10n$1 = 0, $l10n$2 = 0, $l10n$3 = 0;
 var $mb = 0, $or$cond = 0, $or$cond$i = 0, $or$cond$i$i = 0, $or$cond$i100$i = 0, $or$cond$i35$i = 0, $or$cond$i42$i = 0, $or$cond$i49 = 0, $or$cond$i52$i = 0, $or$cond$i56 = 0, $or$cond$i59$i = 0, $or$cond$i63 = 0, $or$cond$i71 = 0, $or$cond$i72$i = 0, $or$cond$i73 = 0, $or$cond$i93$i = 0, $or$cond28$i = 0, $or$cond28173$i = 0, $or$cond29$i = 0, $or$cond4$i = 0;
 var $p$0 = 0, $p$1 = 0, $p$2 = 0, $p$2$ = 0, $p$4296 = 0, $p$5 = 0, $pad$i = 0, $pl$0 = 0, $pl$0$i = 0, $pl$1 = 0, $pl$1$i = 0, $pl$2 = 0, $prefix$0 = 0, $prefix$0$$i = 0, $prefix$0$i = 0, $prefix$1 = 0, $prefix$2 = 0, $r$0$a$8$i = 0, $re$0$i = 0, $re$1165$i = 0;
 var $round$0164$i = 0.0, $round6$1$i = 0.0, $s$0$i = 0, $s$0$us$i = 0, $s$0$us$us$i = 0, $s$0$us158$i = 0, $s$1$i = 0, $s$1$lcssa$i = 0, $s$1$us$i = 0, $s$1$us$us$i = 0, $s$1$us160$i = 0, $s1$0$i = 0, $s7$0180$i = 0, $s7$1$i = 0, $s8$0$lcssa$i = 0, $s8$0169$i = 0, $s9$0$i = 0, $s9$1188$i = 0, $s9$2$i = 0, $sext = 0;
 var $sext84 = 0, $small$0$i = 0.0, $small$1$i = 0.0, $st$0 = 0, $storemerge = 0, $storemerge12 = 0, $storemerge7103 = 0, $storemerge798 = 0, $t$0 = 0, $t$1 = 0, $w$$i = 0, $w$0 = 0, $w$1 = 0, $w$18$i = 0, $w$2 = 0, $w$30$i = 0, $wc = 0, $ws$0169 = 0, $ws$1175 = 0, $y$03$i = 0;
 var $y$03$i$i = 0, $y$03$i109$i = 0, $y$03$i118$i = 0, $y$03$i133$i = 0, $y$03$i86$i = 0, $z$0$i = 0, $z$0$lcssa = 0, $z$093 = 0, $z$1$lcssa$i = 0, $z$1262$i = 0, $z$2 = 0, $z$2$i = 0, $z$3$lcssa$i = 0, $z$3248$i = 0, $z$3248$us$i = 0, $z$4$i = 0, $z$4$us$i = 0, $z$5$i = 0, $z$6$$i = 0, $z$6$i = 0;
 var $z$6$ph$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 864|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $big$i = sp + 16|0;
 $e2$i = sp + 8|0;
 $buf$i = sp + 560|0;
 $0 = $buf$i;
 $ebuf0$i = sp + 840|0;
 $pad$i = sp + 584|0;
 $buf = sp + 520|0;
 $wc = sp;
 $mb = sp + 852|0;
 $1 = ($f|0)!=(0|0);
 $2 = (($buf) + 40|0);
 $3 = $2;
 $4 = (($buf) + 39|0);
 $5 = (($wc) + 4|0);
 $6 = (($ebuf0$i) + 12|0);
 $7 = (($ebuf0$i) + 11|0);
 $8 = $6;
 $9 = (($8) - ($0))|0;
 $10 = (-2 - ($0))|0;
 $11 = (($8) + 2)|0;
 $12 = (($big$i) + 288|0);
 $13 = (($buf$i) + 9|0);
 $14 = $13;
 $15 = (($buf$i) + 8|0);
 $1045 = 0;$1046 = 0;$22 = $fmt;$cnt$0 = 0;$l$0 = 0;$l10n$0 = 0;
 L1: while(1) {
  $16 = ($cnt$0|0)>(-1);
  do {
   if ($16) {
    $17 = (2147483647 - ($cnt$0))|0;
    $18 = ($l$0|0)>($17|0);
    if ($18) {
     $19 = (___errno_location()|0);
     HEAP32[$19>>2] = 75;
     $cnt$1 = -1;
     break;
    } else {
     $20 = (($l$0) + ($cnt$0))|0;
     $cnt$1 = $20;
     break;
    }
   } else {
    $cnt$1 = $cnt$0;
   }
  } while(0);
  $21 = HEAP8[$22>>0]|0;
  $23 = ($21<<24>>24)==(0);
  if ($23) {
   label = 344;
   break;
  } else {
   $1047 = $21;$25 = $22;
  }
  while(1) {
   if ((($1047<<24>>24) == 0)) {
    $$lcssa92 = $25;$z$0$lcssa = $25;
    break;
   } else if ((($1047<<24>>24) == 37)) {
    $27 = $25;$z$093 = $25;
    label = 9;
    break;
   }
   $24 = (($25) + 1|0);
   $$pre = HEAP8[$24>>0]|0;
   $1047 = $$pre;$25 = $24;
  }
  L12: do {
   if ((label|0) == 9) {
    while(1) {
     label = 0;
     $26 = (($27) + 1|0);
     $28 = HEAP8[$26>>0]|0;
     $29 = ($28<<24>>24)==(37);
     if (!($29)) {
      $$lcssa92 = $27;$z$0$lcssa = $z$093;
      break L12;
     }
     $30 = (($z$093) + 1|0);
     $31 = (($27) + 2|0);
     $32 = HEAP8[$31>>0]|0;
     $33 = ($32<<24>>24)==(37);
     if ($33) {
      $27 = $31;$z$093 = $30;
      label = 9;
     } else {
      $$lcssa92 = $31;$z$0$lcssa = $30;
      break;
     }
    }
   }
  } while(0);
  $34 = $z$0$lcssa;
  $35 = $22;
  $36 = (($34) - ($35))|0;
  if ($1) {
   (___fwritex($22,$36,$f)|0);
  }
  $37 = ($z$0$lcssa|0)==($22|0);
  if (!($37)) {
   $l10n$0$phi = $l10n$0;$1046$phi = $1046;$1045$phi = $1045;$22 = $$lcssa92;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$0$phi;$1046 = $1046$phi;$1045 = $1045$phi;
   continue;
  }
  $38 = (($$lcssa92) + 1|0);
  $39 = HEAP8[$38>>0]|0;
  $40 = $39 << 24 >> 24;
  $isdigittmp = (($40) + -48)|0;
  $isdigit = ($isdigittmp>>>0)<(10);
  if ($isdigit) {
   $41 = (($$lcssa92) + 2|0);
   $42 = HEAP8[$41>>0]|0;
   $43 = ($42<<24>>24)==(36);
   if ($43) {
    $44 = (($$lcssa92) + 3|0);
    $$pre290 = HEAP8[$44>>0]|0;
    $46 = $$pre290;$argpos$0 = $isdigittmp;$l10n$1 = 1;$storemerge = $44;
   } else {
    $46 = $39;$argpos$0 = -1;$l10n$1 = $l10n$0;$storemerge = $38;
   }
  } else {
   $46 = $39;$argpos$0 = -1;$l10n$1 = $l10n$0;$storemerge = $38;
  }
  $45 = $46 << 24 >> 24;
  $47 = (($45) + -32)|0;
  $48 = ($47>>>0)<(32);
  L25: do {
   if ($48) {
    $50 = $45;$55 = $46;$fl$0104 = 0;$storemerge7103 = $storemerge;
    while(1) {
     $49 = (($50) + -32)|0;
     $51 = 1 << $49;
     $52 = $51 & 75913;
     $53 = ($52|0)==(0);
     if ($53) {
      $65 = $55;$fl$0100 = $fl$0104;$storemerge798 = $storemerge7103;
      break L25;
     }
     $54 = $55 << 24 >> 24;
     $56 = (($54) + -32)|0;
     $57 = 1 << $56;
     $58 = $57 | $fl$0104;
     $59 = (($storemerge7103) + 1|0);
     $60 = HEAP8[$59>>0]|0;
     $61 = $60 << 24 >> 24;
     $62 = (($61) + -32)|0;
     $63 = ($62>>>0)<(32);
     if ($63) {
      $50 = $61;$55 = $60;$fl$0104 = $58;$storemerge7103 = $59;
     } else {
      $65 = $60;$fl$0100 = $58;$storemerge798 = $59;
      break;
     }
    }
   } else {
    $65 = $46;$fl$0100 = 0;$storemerge798 = $storemerge;
   }
  } while(0);
  $64 = ($65<<24>>24)==(42);
  do {
   if ($64) {
    $66 = (($storemerge798) + 1|0);
    $67 = HEAP8[$66>>0]|0;
    $68 = $67 << 24 >> 24;
    $isdigittmp10 = (($68) + -48)|0;
    $isdigit11 = ($isdigittmp10>>>0)<(10);
    if ($isdigit11) {
     $69 = (($storemerge798) + 2|0);
     $70 = HEAP8[$69>>0]|0;
     $71 = ($70<<24>>24)==(36);
     if ($71) {
      $72 = (($nl_type) + ($isdigittmp10<<2)|0);
      HEAP32[$72>>2] = 10;
      $73 = HEAP8[$66>>0]|0;
      $74 = $73 << 24 >> 24;
      $75 = (($74) + -48)|0;
      $76 = (($nl_arg) + ($75<<3)|0);
      $77 = $76;
      $78 = $77;
      $79 = HEAP32[$78>>2]|0;
      $80 = (($77) + 4)|0;
      $81 = $80;
      $82 = HEAP32[$81>>2]|0;
      $83 = (($storemerge798) + 3|0);
      $l10n$2 = 1;$storemerge12 = $83;$w$0 = $79;
     } else {
      label = 24;
     }
    } else {
     label = 24;
    }
    if ((label|0) == 24) {
     label = 0;
     $84 = ($l10n$1|0)==(0);
     if (!($84)) {
      $$0 = -1;
      label = 362;
      break L1;
     }
     if (!($1)) {
      $100 = $66;$fl$1 = $fl$0100;$l10n$3 = 0;$w$1 = 0;
      break;
     }
     $arglist_current = HEAP32[$ap>>2]|0;
     $85 = HEAP32[$arglist_current>>2]|0;
     $arglist_next = (($arglist_current) + 4|0);
     HEAP32[$ap>>2] = $arglist_next;
     $l10n$2 = 0;$storemerge12 = $66;$w$0 = $85;
    }
    $86 = ($w$0|0)<(0);
    if ($86) {
     $87 = $fl$0100 | 8192;
     $88 = (0 - ($w$0))|0;
     $100 = $storemerge12;$fl$1 = $87;$l10n$3 = $l10n$2;$w$1 = $88;
    } else {
     $100 = $storemerge12;$fl$1 = $fl$0100;$l10n$3 = $l10n$2;$w$1 = $w$0;
    }
   } else {
    $89 = $65 << 24 >> 24;
    $isdigittmp1$i = (($89) + -48)|0;
    $isdigit2$i = ($isdigittmp1$i>>>0)<(10);
    if ($isdigit2$i) {
     $92 = $89;$95 = $storemerge798;$i$03$i = 0;
     while(1) {
      $90 = ($i$03$i*10)|0;
      $91 = (($92) + -48)|0;
      $93 = (($91) + ($90))|0;
      $94 = (($95) + 1|0);
      $96 = HEAP8[$94>>0]|0;
      $97 = $96 << 24 >> 24;
      $isdigittmp$i = (($97) + -48)|0;
      $isdigit$i = ($isdigittmp$i>>>0)<(10);
      if ($isdigit$i) {
       $92 = $97;$95 = $94;$i$03$i = $93;
      } else {
       break;
      }
     }
     $98 = ($93|0)<(0);
     if ($98) {
      $$0 = -1;
      label = 362;
      break L1;
     } else {
      $100 = $94;$fl$1 = $fl$0100;$l10n$3 = $l10n$1;$w$1 = $93;
     }
    } else {
     $100 = $storemerge798;$fl$1 = $fl$0100;$l10n$3 = $l10n$1;$w$1 = 0;
    }
   }
  } while(0);
  $99 = HEAP8[$100>>0]|0;
  $101 = ($99<<24>>24)==(46);
  L46: do {
   if ($101) {
    $102 = (($100) + 1|0);
    $103 = HEAP8[$102>>0]|0;
    $104 = ($103<<24>>24)==(42);
    if (!($104)) {
     $125 = $103 << 24 >> 24;
     $isdigittmp1$i20 = (($125) + -48)|0;
     $isdigit2$i21 = ($isdigittmp1$i20>>>0)<(10);
     if ($isdigit2$i21) {
      $128 = $125;$131 = $102;$i$03$i22 = 0;
     } else {
      $1048 = $102;$p$0 = 0;
      break;
     }
     while(1) {
      $126 = ($i$03$i22*10)|0;
      $127 = (($128) + -48)|0;
      $129 = (($127) + ($126))|0;
      $130 = (($131) + 1|0);
      $132 = HEAP8[$130>>0]|0;
      $133 = $132 << 24 >> 24;
      $isdigittmp$i23 = (($133) + -48)|0;
      $isdigit$i24 = ($isdigittmp$i23>>>0)<(10);
      if ($isdigit$i24) {
       $128 = $133;$131 = $130;$i$03$i22 = $129;
      } else {
       $1048 = $130;$p$0 = $129;
       break L46;
      }
     }
    }
    $105 = (($100) + 2|0);
    $106 = HEAP8[$105>>0]|0;
    $107 = $106 << 24 >> 24;
    $isdigittmp8 = (($107) + -48)|0;
    $isdigit9 = ($isdigittmp8>>>0)<(10);
    if ($isdigit9) {
     $108 = (($100) + 3|0);
     $109 = HEAP8[$108>>0]|0;
     $110 = ($109<<24>>24)==(36);
     if ($110) {
      $111 = (($nl_type) + ($isdigittmp8<<2)|0);
      HEAP32[$111>>2] = 10;
      $112 = HEAP8[$105>>0]|0;
      $113 = $112 << 24 >> 24;
      $114 = (($113) + -48)|0;
      $115 = (($nl_arg) + ($114<<3)|0);
      $116 = $115;
      $117 = $116;
      $118 = HEAP32[$117>>2]|0;
      $119 = (($116) + 4)|0;
      $120 = $119;
      $121 = HEAP32[$120>>2]|0;
      $122 = (($100) + 4|0);
      $1048 = $122;$p$0 = $118;
      break;
     }
    }
    $123 = ($l10n$3|0)==(0);
    if (!($123)) {
     $$0 = -1;
     label = 362;
     break L1;
    }
    if ($1) {
     $arglist_current2 = HEAP32[$ap>>2]|0;
     $124 = HEAP32[$arglist_current2>>2]|0;
     $arglist_next3 = (($arglist_current2) + 4|0);
     HEAP32[$ap>>2] = $arglist_next3;
     $1048 = $105;$p$0 = $124;
    } else {
     $1048 = $105;$p$0 = 0;
    }
   } else {
    $1048 = $100;$p$0 = -1;
   }
  } while(0);
  $135 = $1048;$st$0 = 0;
  while(1) {
   $134 = HEAP8[$135>>0]|0;
   $136 = $134 << 24 >> 24;
   $137 = (($136) + -65)|0;
   $138 = ($137>>>0)>(57);
   if ($138) {
    $$0 = -1;
    label = 362;
    break L1;
   }
   $139 = (($135) + 1|0);
   $140 = ((2824 + (($st$0*58)|0)|0) + ($137)|0);
   $141 = HEAP8[$140>>0]|0;
   $142 = $141&255;
   $143 = (($142) + -1)|0;
   $144 = ($143>>>0)<(8);
   if ($144) {
    $135 = $139;$st$0 = $142;
   } else {
    break;
   }
  }
  $145 = ($141<<24>>24)==(0);
  if ($145) {
   $$0 = -1;
   label = 362;
   break;
  }
  $146 = ($141<<24>>24)==(19);
  $147 = ($argpos$0|0)>(-1);
  L65: do {
   if ($146) {
    if ($147) {
     $$0 = -1;
     label = 362;
     break L1;
    } else {
     $1049 = $1045;$1050 = $1046;
     label = 63;
    }
   } else {
    if ($147) {
     $148 = (($nl_type) + ($argpos$0<<2)|0);
     HEAP32[$148>>2] = $142;
     $149 = (($nl_arg) + ($argpos$0<<3)|0);
     $150 = $149;
     $151 = $150;
     $152 = HEAP32[$151>>2]|0;
     $153 = (($150) + 4)|0;
     $154 = $153;
     $155 = HEAP32[$154>>2]|0;
     $156 = $152;
     $1049 = $155;$1050 = $156;
     label = 63;
     break;
    }
    if (!($1)) {
     $$0 = 0;
     label = 362;
     break L1;
    }
    $157 = ($141&255)>(20);
    if ($157) {
     $199 = $134;$207 = $1046;$229 = $1045;
    } else {
     do {
      switch ($142|0) {
      case 16:  {
       $arglist_current26 = HEAP32[$ap>>2]|0;
       $188 = HEAP32[$arglist_current26>>2]|0;
       $arglist_next27 = (($arglist_current26) + 4|0);
       HEAP32[$ap>>2] = $arglist_next27;
       $$mask$i30 = $188 & 255;
       $189 = $$mask$i30;
       $1051 = $189;$1052 = 0;
       label = 64;
       break L65;
       break;
      }
      case 14:  {
       $arglist_current20 = HEAP32[$ap>>2]|0;
       $179 = HEAP32[$arglist_current20>>2]|0;
       $arglist_next21 = (($arglist_current20) + 4|0);
       HEAP32[$ap>>2] = $arglist_next21;
       $$mask1$i29 = $179 & 65535;
       $180 = $$mask1$i29;
       $1051 = $180;$1052 = 0;
       label = 64;
       break L65;
       break;
      }
      case 15:  {
       $arglist_current23 = HEAP32[$ap>>2]|0;
       $181 = HEAP32[$arglist_current23>>2]|0;
       $arglist_next24 = (($arglist_current23) + 4|0);
       HEAP32[$ap>>2] = $arglist_next24;
       $182 = $181&255;
       $183 = $182 << 24 >> 24;
       $184 = ($183|0)<(0);
       $185 = $184 << 31 >> 31;
       $sext = $181 << 24;
       $186 = $sext >> 24;
       $187 = $186;
       $1051 = $187;$1052 = $185;
       label = 64;
       break L65;
       break;
      }
      case 9:  {
       $arglist_current5 = HEAP32[$ap>>2]|0;
       $158 = HEAP32[$arglist_current5>>2]|0;
       $arglist_next6 = (($arglist_current5) + 4|0);
       HEAP32[$ap>>2] = $arglist_next6;
       $1051 = $158;$1052 = $1045;
       label = 64;
       break L65;
       break;
      }
      case 18:  {
       $arglist_current32 = HEAP32[$ap>>2]|0;
       HEAP32[tempDoublePtr>>2]=HEAP32[$arglist_current32>>2];HEAP32[tempDoublePtr+4>>2]=HEAP32[$arglist_current32+4>>2];$194 = +HEAPF64[tempDoublePtr>>3];
       $arglist_next33 = (($arglist_current32) + 8|0);
       HEAP32[$ap>>2] = $arglist_next33;
       HEAPF64[tempDoublePtr>>3] = $194;$195 = HEAP32[tempDoublePtr>>2]|0;
       $196 = HEAP32[tempDoublePtr+4>>2]|0;
       $197 = $195;
       $1049 = $196;$1050 = $197;
       label = 63;
       break L65;
       break;
      }
      case 11:  {
       $arglist_current11 = HEAP32[$ap>>2]|0;
       $163 = HEAP32[$arglist_current11>>2]|0;
       $arglist_next12 = (($arglist_current11) + 4|0);
       HEAP32[$ap>>2] = $arglist_next12;
       $164 = $163;
       $1051 = $164;$1052 = 0;
       label = 64;
       break L65;
       break;
      }
      case 12:  {
       $arglist_current14 = HEAP32[$ap>>2]|0;
       $165 = $arglist_current14;
       $166 = $165;
       $167 = HEAP32[$166>>2]|0;
       $168 = (($165) + 4)|0;
       $169 = $168;
       $170 = HEAP32[$169>>2]|0;
       $arglist_next15 = (($arglist_current14) + 8|0);
       HEAP32[$ap>>2] = $arglist_next15;
       $171 = $167;
       $1051 = $171;$1052 = $170;
       label = 64;
       break L65;
       break;
      }
      case 10:  {
       $arglist_current8 = HEAP32[$ap>>2]|0;
       $159 = HEAP32[$arglist_current8>>2]|0;
       $arglist_next9 = (($arglist_current8) + 4|0);
       HEAP32[$ap>>2] = $arglist_next9;
       $160 = ($159|0)<(0);
       $161 = $160 << 31 >> 31;
       $162 = $159;
       $1051 = $162;$1052 = $161;
       label = 64;
       break L65;
       break;
      }
      case 17:  {
       $arglist_current29 = HEAP32[$ap>>2]|0;
       HEAP32[tempDoublePtr>>2]=HEAP32[$arglist_current29>>2];HEAP32[tempDoublePtr+4>>2]=HEAP32[$arglist_current29+4>>2];$190 = +HEAPF64[tempDoublePtr>>3];
       $arglist_next30 = (($arglist_current29) + 8|0);
       HEAP32[$ap>>2] = $arglist_next30;
       HEAPF64[tempDoublePtr>>3] = $190;$191 = HEAP32[tempDoublePtr>>2]|0;
       $192 = HEAP32[tempDoublePtr+4>>2]|0;
       $193 = $191;
       $1051 = $193;$1052 = $192;
       label = 64;
       break L65;
       break;
      }
      case 13:  {
       $arglist_current17 = HEAP32[$ap>>2]|0;
       $172 = HEAP32[$arglist_current17>>2]|0;
       $arglist_next18 = (($arglist_current17) + 4|0);
       HEAP32[$ap>>2] = $arglist_next18;
       $173 = $172&65535;
       $174 = $173 << 16 >> 16;
       $175 = ($174|0)<(0);
       $176 = $175 << 31 >> 31;
       $sext84 = $172 << 16;
       $177 = $sext84 >> 16;
       $178 = $177;
       $1051 = $178;$1052 = $176;
       label = 64;
       break L65;
       break;
      }
      default: {
       $1051 = $1046;$1052 = $1045;
       label = 64;
       break L65;
      }
      }
     } while(0);
    }
   }
  } while(0);
  if ((label|0) == 63) {
   label = 0;
   if ($1) {
    $1051 = $1050;$1052 = $1049;
    label = 64;
   } else {
    $1045 = $1049;$1046 = $1050;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
    continue;
   }
  }
  if ((label|0) == 64) {
   label = 0;
   $$pre292 = HEAP8[$135>>0]|0;
   $199 = $$pre292;$207 = $1051;$229 = $1052;
  }
  $198 = $199 << 24 >> 24;
  $200 = ($st$0|0)==(0);
  if ($200) {
   $t$0 = $198;
  } else {
   $201 = $198 & 15;
   $202 = ($201|0)==(3);
   $203 = $198 & -33;
   $$ = $202 ? $203 : $198;
   $t$0 = $$;
  }
  $204 = $fl$1 & 8192;
  $205 = ($204|0)==(0);
  $206 = $fl$1 & -65537;
  $fl$1$ = $205 ? $fl$1 : $206;
  L92: do {
   switch ($t$0|0) {
   case 65: case 71: case 70: case 69: case 97: case 103: case 102: case 101:  {
    $368 = $207;
    HEAP32[tempDoublePtr>>2] = $368;HEAP32[tempDoublePtr+4>>2] = $229;$369 = +HEAPF64[tempDoublePtr>>3];
    HEAP32[$e2$i>>2] = 0;
    $370 = ($229|0)<(0);
    if ($370) {
     $371 = -$369;
     $$07$i = $371;$pl$0$i = 1;$prefix$0$i = 3312;
    } else {
     $372 = $fl$1$ & 2048;
     $373 = ($372|0)==(0);
     if ($373) {
      $374 = $fl$1$ & 1;
      $375 = ($374|0)==(0);
      $$$i = $375 ? ((3312 + 1|0)) : ((3312 + 6|0));
      $$07$i = $369;$pl$0$i = $374;$prefix$0$i = $$$i;
     } else {
      $$07$i = $369;$pl$0$i = 1;$prefix$0$i = ((3312 + 3|0));
     }
    }
    HEAPF64[tempDoublePtr>>3] = $$07$i;$376 = HEAP32[tempDoublePtr>>2]|0;
    $377 = HEAP32[tempDoublePtr+4>>2]|0;
    $378 = $377 & 2146435072;
    $379 = ($378>>>0)<(2146435072);
    $380 = ($378|0)==(2146435072);
    $381 = (0)<(0);
    $382 = $380 & $381;
    $383 = $379 | $382;
    if (!($383)) {
     $384 = $t$0 & 32;
     $385 = ($384|0)!=(0);
     $386 = $385 ? 3336 : 3344;
     $387 = ($$07$i != $$07$i) | (0.0 != 0.0);
     if ($387) {
      $388 = $385 ? 3352 : 3360;
      $pl$1$i = 0;$s1$0$i = $388;
     } else {
      $pl$1$i = $pl$0$i;$s1$0$i = $386;
     }
     $389 = (($pl$1$i) + 3)|0;
     $390 = $fl$1$ & 8192;
     $391 = ($390|0)==(0);
     $392 = ($389|0)<($w$1|0);
     $or$cond$i35$i = $391 & $392;
     if ($or$cond$i35$i) {
      $393 = (($w$1) - ($389))|0;
      $394 = ($393>>>0)>(256);
      $395 = $394 ? 256 : $393;
      _memset(($pad$i|0),32,($395|0))|0;
      $396 = ($393>>>0)>(255);
      if ($396) {
       $$01$i36$i = $393;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $397 = (($$01$i36$i) + -256)|0;
        $398 = ($397>>>0)>(255);
        if ($398) {
         $$01$i36$i = $397;
        } else {
         $$0$lcssa$i38$i = $397;
         break;
        }
       }
      } else {
       $$0$lcssa$i38$i = $393;
      }
      (___fwritex($pad$i,$$0$lcssa$i38$i,$f)|0);
     }
     (___fwritex($prefix$0$i,$pl$1$i,$f)|0);
     (___fwritex($s1$0$i,3,$f)|0);
     $399 = $fl$1$ & 73728;
     $400 = ($399|0)==(8192);
     $or$cond$i42$i = $400 & $392;
     if ($or$cond$i42$i) {
      $401 = (($w$1) - ($389))|0;
      $402 = ($401>>>0)>(256);
      $403 = $402 ? 256 : $401;
      _memset(($pad$i|0),32,($403|0))|0;
      $404 = ($401>>>0)>(255);
      if ($404) {
       $$01$i43$i = $401;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $405 = (($$01$i43$i) + -256)|0;
        $406 = ($405>>>0)>(255);
        if ($406) {
         $$01$i43$i = $405;
        } else {
         $$0$lcssa$i45$i = $405;
         break;
        }
       }
      } else {
       $$0$lcssa$i45$i = $401;
      }
      (___fwritex($pad$i,$$0$lcssa$i45$i,$f)|0);
     }
     $w$$i = $392 ? $w$1 : $389;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $w$$i;$l10n$0 = $l10n$3;
     continue L1;
    }
    $407 = (+_frexpl($$07$i,$e2$i));
    $408 = $407 * 2.0;
    $409 = $408 != 0.0;
    if ($409) {
     $410 = HEAP32[$e2$i>>2]|0;
     $411 = (($410) + -1)|0;
     HEAP32[$e2$i>>2] = $411;
    }
    $412 = $t$0 | 32;
    $413 = ($412|0)==(97);
    if ($413) {
     $414 = $t$0 & 32;
     $415 = ($414|0)==(0);
     $416 = (($prefix$0$i) + 9|0);
     $prefix$0$$i = $415 ? $prefix$0$i : $416;
     $417 = $pl$0$i | 2;
     $418 = ($p$0>>>0)>(11);
     $419 = (12 - ($p$0))|0;
     $re$0$i = $418 ? 0 : $419;
     $420 = ($re$0$i|0)==(0);
     do {
      if ($420) {
       $$1$i = $408;
      } else {
       $re$1165$i = $re$0$i;$round$0164$i = 8.0;
       while(1) {
        $421 = (($re$1165$i) + -1)|0;
        $422 = $round$0164$i * 16.0;
        $423 = ($421|0)==(0);
        if ($423) {
         break;
        } else {
         $re$1165$i = $421;$round$0164$i = $422;
        }
       }
       $424 = HEAP8[$prefix$0$$i>>0]|0;
       $425 = ($424<<24>>24)==(45);
       if ($425) {
        $426 = -$408;
        $427 = $426 - $422;
        $428 = $422 + $427;
        $429 = -$428;
        $$1$i = $429;
        break;
       } else {
        $430 = $408 + $422;
        $431 = $430 - $422;
        $$1$i = $431;
        break;
       }
      }
     } while(0);
     $432 = HEAP32[$e2$i>>2]|0;
     $433 = ($432|0)<(0);
     $434 = (0 - ($432))|0;
     $435 = $433 ? $434 : $432;
     $436 = ($435|0)<(0);
     if ($436) {
      $437 = ($435|0)<(0);
      $438 = $437 << 31 >> 31;
      $$05$i$i = $6;$439 = $435;$440 = $438;
      while(1) {
       $441 = (___uremdi3(($439|0),($440|0),10,0)|0);
       $442 = tempRet0;
       $443 = $441 | 48;
       $444 = $443&255;
       $445 = (($$05$i$i) + -1|0);
       HEAP8[$445>>0] = $444;
       $446 = (___udivdi3(($439|0),($440|0),10,0)|0);
       $447 = tempRet0;
       $448 = ($440>>>0)>(9);
       $449 = ($440|0)==(9);
       $450 = ($439>>>0)>(4294967295);
       $451 = $449 & $450;
       $452 = $448 | $451;
       if ($452) {
        $$05$i$i = $445;$439 = $446;$440 = $447;
       } else {
        break;
       }
      }
      $$0$lcssa$i48$i = $445;$$01$lcssa$off0$i$i = $446;
     } else {
      $$0$lcssa$i48$i = $6;$$01$lcssa$off0$i$i = $435;
     }
     $453 = ($$01$lcssa$off0$i$i|0)==(0);
     if ($453) {
      $$1$lcssa$i$i = $$0$lcssa$i48$i;
     } else {
      $$12$i$i = $$0$lcssa$i48$i;$y$03$i$i = $$01$lcssa$off0$i$i;
      while(1) {
       $454 = (($y$03$i$i>>>0) % 10)&-1;
       $455 = $454 | 48;
       $456 = $455&255;
       $457 = (($$12$i$i) + -1|0);
       HEAP8[$457>>0] = $456;
       $458 = (($y$03$i$i>>>0) / 10)&-1;
       $459 = ($y$03$i$i>>>0)<(10);
       if ($459) {
        $$1$lcssa$i$i = $457;
        break;
       } else {
        $$12$i$i = $457;$y$03$i$i = $458;
       }
      }
     }
     $460 = ($$1$lcssa$i$i|0)==($6|0);
     if ($460) {
      HEAP8[$7>>0] = 48;
      $estr$0$i = $7;
     } else {
      $estr$0$i = $$1$lcssa$i$i;
     }
     $461 = HEAP32[$e2$i>>2]|0;
     $462 = $461 >> 31;
     $463 = $462 & 2;
     $464 = (($463) + 43)|0;
     $465 = $464&255;
     $466 = (($estr$0$i) + -1|0);
     HEAP8[$466>>0] = $465;
     $467 = (($t$0) + 15)|0;
     $468 = $467&255;
     $469 = (($estr$0$i) + -2|0);
     HEAP8[$469>>0] = $468;
     $470 = ($p$0|0)>(0);
     $471 = $fl$1$ & 8;
     $472 = ($471|0)==(0);
     if ($470) {
      if ($472) {
       $$2$us$us$i = $$1$i;$s$0$us$us$i = $buf$i;
       while(1) {
        $473 = (~~(($$2$us$us$i)));
        $474 = (3368 + ($473)|0);
        $475 = HEAP8[$474>>0]|0;
        $476 = $475&255;
        $477 = $476 | $414;
        $478 = $477&255;
        $479 = (($s$0$us$us$i) + 1|0);
        HEAP8[$s$0$us$us$i>>0] = $478;
        $480 = (+($473|0));
        $481 = $$2$us$us$i - $480;
        $482 = $481 * 16.0;
        $483 = $479;
        $484 = (($483) - ($0))|0;
        $485 = ($484|0)==(1);
        if ($485) {
         $486 = (($s$0$us$us$i) + 2|0);
         HEAP8[$479>>0] = 46;
         $s$1$us$us$i = $486;
        } else {
         $s$1$us$us$i = $479;
        }
        $487 = $482 != 0.0;
        if ($487) {
         $$2$us$us$i = $482;$s$0$us$us$i = $s$1$us$us$i;
        } else {
         $s$1$lcssa$i = $s$1$us$us$i;
         break;
        }
       }
      } else {
       $$2$us$i = $$1$i;$s$0$us$i = $buf$i;
       while(1) {
        $488 = (~~(($$2$us$i)));
        $489 = (3368 + ($488)|0);
        $490 = HEAP8[$489>>0]|0;
        $491 = $490&255;
        $492 = $491 | $414;
        $493 = $492&255;
        $494 = (($s$0$us$i) + 1|0);
        HEAP8[$s$0$us$i>>0] = $493;
        $495 = (+($488|0));
        $496 = $$2$us$i - $495;
        $497 = $496 * 16.0;
        $498 = $494;
        $499 = (($498) - ($0))|0;
        $500 = ($499|0)==(1);
        if ($500) {
         $501 = (($s$0$us$i) + 2|0);
         HEAP8[$494>>0] = 46;
         $s$1$us$i = $501;
        } else {
         $s$1$us$i = $494;
        }
        $502 = $497 != 0.0;
        if ($502) {
         $$2$us$i = $497;$s$0$us$i = $s$1$us$i;
        } else {
         $s$1$lcssa$i = $s$1$us$i;
         break;
        }
       }
      }
     } else {
      if ($472) {
       $$2$us159$i = $$1$i;$s$0$us158$i = $buf$i;
       while(1) {
        $503 = (~~(($$2$us159$i)));
        $504 = (3368 + ($503)|0);
        $505 = HEAP8[$504>>0]|0;
        $506 = $505&255;
        $507 = $506 | $414;
        $508 = $507&255;
        $509 = (($s$0$us158$i) + 1|0);
        HEAP8[$s$0$us158$i>>0] = $508;
        $510 = (+($503|0));
        $511 = $$2$us159$i - $510;
        $512 = $511 * 16.0;
        $513 = $509;
        $514 = (($513) - ($0))|0;
        $515 = ($514|0)==(1);
        $516 = $512 != 0.0;
        $or$cond$i71 = $515 & $516;
        if ($or$cond$i71) {
         $517 = (($s$0$us158$i) + 2|0);
         HEAP8[$509>>0] = 46;
         $s$1$us160$i = $517;
        } else {
         $s$1$us160$i = $509;
        }
        if ($516) {
         $$2$us159$i = $512;$s$0$us158$i = $s$1$us160$i;
        } else {
         $s$1$lcssa$i = $s$1$us160$i;
         break;
        }
       }
      } else {
       $$2$i = $$1$i;$s$0$i = $buf$i;
       while(1) {
        $518 = (~~(($$2$i)));
        $519 = (3368 + ($518)|0);
        $520 = HEAP8[$519>>0]|0;
        $521 = $520&255;
        $522 = $521 | $414;
        $523 = $522&255;
        $524 = (($s$0$i) + 1|0);
        HEAP8[$s$0$i>>0] = $523;
        $525 = (+($518|0));
        $526 = $$2$i - $525;
        $527 = $526 * 16.0;
        $528 = $524;
        $529 = (($528) - ($0))|0;
        $530 = ($529|0)==(1);
        if ($530) {
         $531 = (($s$0$i) + 2|0);
         HEAP8[$524>>0] = 46;
         $s$1$i = $531;
        } else {
         $s$1$i = $524;
        }
        $532 = $527 != 0.0;
        if ($532) {
         $$2$i = $527;$s$0$i = $s$1$i;
        } else {
         $s$1$lcssa$i = $s$1$i;
         break;
        }
       }
      }
     }
     $533 = ($p$0|0)==(0);
     $$pre319$i = $s$1$lcssa$i;
     do {
      if ($533) {
       label = 173;
      } else {
       $534 = (($10) + ($$pre319$i))|0;
       $535 = ($534|0)<($p$0|0);
       if (!($535)) {
        label = 173;
        break;
       }
       $536 = $469;
       $537 = (($11) + ($p$0))|0;
       $538 = (($537) - ($536))|0;
       $l$0$i = $538;
      }
     } while(0);
     if ((label|0) == 173) {
      label = 0;
      $539 = $469;
      $540 = (($9) - ($539))|0;
      $541 = (($540) + ($$pre319$i))|0;
      $l$0$i = $541;
     }
     $542 = (($l$0$i) + ($417))|0;
     $543 = $fl$1$ & 73728;
     $544 = ($543|0)==(0);
     $545 = ($542|0)<($w$1|0);
     $or$cond$i52$i = $544 & $545;
     if ($or$cond$i52$i) {
      $546 = (($w$1) - ($542))|0;
      $547 = ($546>>>0)>(256);
      $548 = $547 ? 256 : $546;
      _memset(($pad$i|0),32,($548|0))|0;
      $549 = ($546>>>0)>(255);
      if ($549) {
       $$01$i53$i = $546;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $550 = (($$01$i53$i) + -256)|0;
        $551 = ($550>>>0)>(255);
        if ($551) {
         $$01$i53$i = $550;
        } else {
         $$0$lcssa$i55$i = $550;
         break;
        }
       }
      } else {
       $$0$lcssa$i55$i = $546;
      }
      (___fwritex($pad$i,$$0$lcssa$i55$i,$f)|0);
     }
     (___fwritex($prefix$0$$i,$417,$f)|0);
     $552 = ($543|0)==(65536);
     $or$cond$i59$i = $552 & $545;
     if ($or$cond$i59$i) {
      $553 = (($w$1) - ($542))|0;
      $554 = ($553>>>0)>(256);
      $555 = $554 ? 256 : $553;
      _memset(($pad$i|0),48,($555|0))|0;
      $556 = ($553>>>0)>(255);
      if ($556) {
       $$01$i60$i = $553;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $557 = (($$01$i60$i) + -256)|0;
        $558 = ($557>>>0)>(255);
        if ($558) {
         $$01$i60$i = $557;
        } else {
         $$0$lcssa$i62$i = $557;
         break;
        }
       }
      } else {
       $$0$lcssa$i62$i = $553;
      }
      (___fwritex($pad$i,$$0$lcssa$i62$i,$f)|0);
     }
     $559 = (($$pre319$i) - ($0))|0;
     (___fwritex($buf$i,$559,$f)|0);
     $560 = $469;
     $561 = (($8) - ($560))|0;
     $562 = (($l$0$i) - ($561))|0;
     $563 = (($562) - ($559))|0;
     $564 = ($563|0)>(0);
     if ($564) {
      $565 = ($563>>>0)>(256);
      $566 = $565 ? 256 : $563;
      _memset(($pad$i|0),48,($566|0))|0;
      $567 = ($563>>>0)>(255);
      if ($567) {
       $$01$i66$i = $563;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $568 = (($$01$i66$i) + -256)|0;
        $569 = ($568>>>0)>(255);
        if ($569) {
         $$01$i66$i = $568;
        } else {
         $$0$lcssa$i68$i = $568;
         break;
        }
       }
      } else {
       $$0$lcssa$i68$i = $563;
      }
      (___fwritex($pad$i,$$0$lcssa$i68$i,$f)|0);
     }
     (___fwritex($469,$561,$f)|0);
     $570 = ($543|0)==(8192);
     $or$cond$i72$i = $570 & $545;
     if ($or$cond$i72$i) {
      $571 = (($w$1) - ($542))|0;
      $572 = ($571>>>0)>(256);
      $573 = $572 ? 256 : $571;
      _memset(($pad$i|0),32,($573|0))|0;
      $574 = ($571>>>0)>(255);
      if ($574) {
       $$01$i73$i = $571;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $575 = (($$01$i73$i) + -256)|0;
        $576 = ($575>>>0)>(255);
        if ($576) {
         $$01$i73$i = $575;
        } else {
         $$0$lcssa$i75$i = $575;
         break;
        }
       }
      } else {
       $$0$lcssa$i75$i = $571;
      }
      (___fwritex($pad$i,$$0$lcssa$i75$i,$f)|0);
     }
     $w$18$i = $545 ? $w$1 : $542;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $w$18$i;$l10n$0 = $l10n$3;
     continue L1;
    }
    $577 = ($p$0|0)<(0);
    $$p$i = $577 ? 6 : $p$0;
    if ($409) {
     $578 = $408 * 268435456.0;
     $579 = HEAP32[$e2$i>>2]|0;
     $580 = (($579) + -28)|0;
     HEAP32[$e2$i>>2] = $580;
     $$3$i = $578;$582 = $580;
    } else {
     $$pre$i = HEAP32[$e2$i>>2]|0;
     $$3$i = $408;$582 = $$pre$i;
    }
    $581 = ($582|0)<(0);
    $$31$i = $581 ? $big$i : $12;
    $$4$i = $$3$i;$z$0$i = $$31$i;
    while(1) {
     $583 = (~~(($$4$i))>>>0);
     HEAP32[$z$0$i>>2] = $583;
     $584 = (($z$0$i) + 4|0);
     $585 = (+($583>>>0));
     $586 = $$4$i - $585;
     $587 = $586 * 1.0E+9;
     $588 = $587 != 0.0;
     if ($588) {
      $$4$i = $587;$z$0$i = $584;
     } else {
      break;
     }
    }
    $$pr$i = HEAP32[$e2$i>>2]|0;
    $589 = ($$pr$i|0)>(0);
    if ($589) {
     $591 = $$pr$i;$a$1263$i = $$31$i;$z$1262$i = $584;
     while(1) {
      $590 = ($591|0)>(29);
      $592 = $590 ? 29 : $591;
      $d$0254$i = (($z$1262$i) + -4|0);
      $593 = ($d$0254$i>>>0)<($a$1263$i>>>0);
      do {
       if ($593) {
        $a$2$ph$i = $a$1263$i;
       } else {
        $carry$0255$i = 0;$d$0256$i = $d$0254$i;
        while(1) {
         $594 = HEAP32[$d$0256$i>>2]|0;
         $595 = (_bitshift64Shl(($594|0),0,($592|0))|0);
         $596 = tempRet0;
         $597 = (_i64Add(($595|0),($596|0),($carry$0255$i|0),0)|0);
         $598 = tempRet0;
         $599 = (___uremdi3(($597|0),($598|0),1000000000,0)|0);
         $600 = tempRet0;
         HEAP32[$d$0256$i>>2] = $599;
         $601 = (___udivdi3(($597|0),($598|0),1000000000,0)|0);
         $602 = tempRet0;
         $d$0$i = (($d$0256$i) + -4|0);
         $603 = ($d$0$i>>>0)<($a$1263$i>>>0);
         if ($603) {
          break;
         } else {
          $carry$0255$i = $601;$d$0256$i = $d$0$i;
         }
        }
        $604 = ($601|0)==(0);
        if ($604) {
         $a$2$ph$i = $a$1263$i;
         break;
        }
        $605 = (($a$1263$i) + -4|0);
        HEAP32[$605>>2] = $601;
        $a$2$ph$i = $605;
       }
      } while(0);
      $z$2$i = $z$1262$i;
      while(1) {
       $606 = ($z$2$i>>>0)>($a$2$ph$i>>>0);
       if (!($606)) {
        break;
       }
       $607 = (($z$2$i) + -4|0);
       $608 = HEAP32[$607>>2]|0;
       $609 = ($608|0)==(0);
       if ($609) {
        $z$2$i = $607;
       } else {
        break;
       }
      }
      $610 = HEAP32[$e2$i>>2]|0;
      $611 = (($610) - ($592))|0;
      HEAP32[$e2$i>>2] = $611;
      $612 = ($611|0)>(0);
      if ($612) {
       $591 = $611;$a$1263$i = $a$2$ph$i;$z$1262$i = $z$2$i;
      } else {
       $$pr146$i = $611;$a$1$lcssa$i = $a$2$ph$i;$z$1$lcssa$i = $z$2$i;
       break;
      }
     }
    } else {
     $$pr146$i = $$pr$i;$a$1$lcssa$i = $$31$i;$z$1$lcssa$i = $584;
    }
    $613 = ($$pr146$i|0)<(0);
    L228: do {
     if ($613) {
      $614 = (($$p$i) + 25)|0;
      $615 = (($614|0) / 9)&-1;
      $616 = (($615) + 1)|0;
      $617 = ($412|0)==(102);
      if ($617) {
       $618 = $$31$i;
       $619 = (($$31$i) + ($616<<2)|0);
       $621 = $$pr146$i;$a$3249$us$i = $a$1$lcssa$i;$z$3248$us$i = $z$1$lcssa$i;
       while(1) {
        $620 = (0 - ($621))|0;
        $622 = ($620|0)>(9);
        $$20$us$i = $622 ? 9 : $620;
        $623 = ($a$3249$us$i>>>0)<($z$3248$us$i>>>0);
        do {
         if ($623) {
          $648 = 1 << $$20$us$i;
          $642 = (($648) + -1)|0;
          $645 = 1000000000 >>> $$20$us$i;
          $carry3$0243$us$i = 0;$d$1242$us$i = $a$3249$us$i;
          while(1) {
           $640 = HEAP32[$d$1242$us$i>>2]|0;
           $641 = $640 & $642;
           $643 = $640 >>> $$20$us$i;
           $644 = (($643) + ($carry3$0243$us$i))|0;
           HEAP32[$d$1242$us$i>>2] = $644;
           $631 = Math_imul($641, $645)|0;
           $646 = (($d$1242$us$i) + 4|0);
           $647 = ($646>>>0)<($z$3248$us$i>>>0);
           if ($647) {
            $carry3$0243$us$i = $631;$d$1242$us$i = $646;
           } else {
            break;
           }
          }
          $627 = HEAP32[$a$3249$us$i>>2]|0;
          $628 = ($627|0)==(0);
          $629 = (($a$3249$us$i) + 4|0);
          $$a$3$us$i = $628 ? $629 : $a$3249$us$i;
          $630 = ($631|0)==(0);
          if ($630) {
           $$a$3$us323$i = $$a$3$us$i;$z$4$us$i = $z$3248$us$i;
           break;
          }
          $632 = (($z$3248$us$i) + 4|0);
          HEAP32[$z$3248$us$i>>2] = $631;
          $$a$3$us323$i = $$a$3$us$i;$z$4$us$i = $632;
         } else {
          $624 = HEAP32[$a$3249$us$i>>2]|0;
          $625 = ($624|0)==(0);
          $626 = (($a$3249$us$i) + 4|0);
          $$a$3$us322$i = $625 ? $626 : $a$3249$us$i;
          $$a$3$us323$i = $$a$3$us322$i;$z$4$us$i = $z$3248$us$i;
         }
        } while(0);
        $633 = $z$4$us$i;
        $634 = (($633) - ($618))|0;
        $635 = $634 >> 2;
        $636 = ($635|0)>($616|0);
        $$z$4$us$i = $636 ? $619 : $z$4$us$i;
        $637 = HEAP32[$e2$i>>2]|0;
        $638 = (($637) + ($$20$us$i))|0;
        HEAP32[$e2$i>>2] = $638;
        $639 = ($638|0)<(0);
        if ($639) {
         $621 = $638;$a$3249$us$i = $$a$3$us323$i;$z$3248$us$i = $$z$4$us$i;
        } else {
         $a$3$lcssa$i = $$a$3$us323$i;$z$3$lcssa$i = $$z$4$us$i;
         break L228;
        }
       }
      } else {
       $650 = $$pr146$i;$a$3249$i = $a$1$lcssa$i;$z$3248$i = $z$1$lcssa$i;
      }
      while(1) {
       $649 = (0 - ($650))|0;
       $651 = ($649|0)>(9);
       $$20$i = $651 ? 9 : $649;
       $652 = ($a$3249$i>>>0)<($z$3248$i>>>0);
       do {
        if ($652) {
         $656 = 1 << $$20$i;
         $657 = (($656) + -1)|0;
         $658 = 1000000000 >>> $$20$i;
         $carry3$0243$i = 0;$d$1242$i = $a$3249$i;
         while(1) {
          $659 = HEAP32[$d$1242$i>>2]|0;
          $660 = $659 & $657;
          $661 = $659 >>> $$20$i;
          $662 = (($661) + ($carry3$0243$i))|0;
          HEAP32[$d$1242$i>>2] = $662;
          $663 = Math_imul($660, $658)|0;
          $664 = (($d$1242$i) + 4|0);
          $665 = ($664>>>0)<($z$3248$i>>>0);
          if ($665) {
           $carry3$0243$i = $663;$d$1242$i = $664;
          } else {
           break;
          }
         }
         $666 = HEAP32[$a$3249$i>>2]|0;
         $667 = ($666|0)==(0);
         $668 = (($a$3249$i) + 4|0);
         $$a$3$i = $667 ? $668 : $a$3249$i;
         $669 = ($663|0)==(0);
         if ($669) {
          $$a$3325$i = $$a$3$i;$z$4$i = $z$3248$i;
          break;
         }
         $670 = (($z$3248$i) + 4|0);
         HEAP32[$z$3248$i>>2] = $663;
         $$a$3325$i = $$a$3$i;$z$4$i = $670;
        } else {
         $653 = HEAP32[$a$3249$i>>2]|0;
         $654 = ($653|0)==(0);
         $655 = (($a$3249$i) + 4|0);
         $$a$3324$i = $654 ? $655 : $a$3249$i;
         $$a$3325$i = $$a$3324$i;$z$4$i = $z$3248$i;
        }
       } while(0);
       $671 = $z$4$i;
       $672 = $$a$3325$i;
       $673 = (($671) - ($672))|0;
       $674 = $673 >> 2;
       $675 = ($674|0)>($616|0);
       if ($675) {
        $676 = (($$a$3325$i) + ($616<<2)|0);
        $z$5$i = $676;
       } else {
        $z$5$i = $z$4$i;
       }
       $677 = HEAP32[$e2$i>>2]|0;
       $678 = (($677) + ($$20$i))|0;
       HEAP32[$e2$i>>2] = $678;
       $679 = ($678|0)<(0);
       if ($679) {
        $650 = $678;$a$3249$i = $$a$3325$i;$z$3248$i = $z$5$i;
       } else {
        $a$3$lcssa$i = $$a$3325$i;$z$3$lcssa$i = $z$5$i;
        break;
       }
      }
     } else {
      $a$3$lcssa$i = $a$1$lcssa$i;$z$3$lcssa$i = $z$1$lcssa$i;
     }
    } while(0);
    $680 = ($a$3$lcssa$i>>>0)<($z$3$lcssa$i>>>0);
    $681 = $$31$i;
    do {
     if ($680) {
      $682 = $a$3$lcssa$i;
      $683 = (($681) - ($682))|0;
      $684 = $683 >> 2;
      $685 = ($684*9)|0;
      $686 = HEAP32[$a$3$lcssa$i>>2]|0;
      $687 = ($686>>>0)<(10);
      if ($687) {
       $e$1$i = $685;
       break;
      } else {
       $e$0238$i = $685;$i$0237$i = 10;
      }
      while(1) {
       $688 = ($i$0237$i*10)|0;
       $689 = (($e$0238$i) + 1)|0;
       $690 = ($686>>>0)<($688>>>0);
       if ($690) {
        $e$1$i = $689;
        break;
       } else {
        $e$0238$i = $689;$i$0237$i = $688;
       }
      }
     } else {
      $e$1$i = 0;
     }
    } while(0);
    $691 = ($412|0)!=(102);
    $692 = $691 ? $e$1$i : 0;
    $693 = (($$p$i) - ($692))|0;
    $694 = ($412|0)==(103);
    $695 = ($$p$i|0)!=(0);
    $$21$i = $694 & $695;
    $$neg151$i = $$21$i << 31 >> 31;
    $696 = (($693) + ($$neg151$i))|0;
    $697 = $z$3$lcssa$i;
    $698 = (($697) - ($681))|0;
    $699 = $698 >> 2;
    $700 = ($699*9)|0;
    $701 = (($700) + -9)|0;
    $702 = ($696|0)<($701|0);
    if ($702) {
     $703 = (($696) + 9216)|0;
     $704 = (($703|0) / 9)&-1;
     $$sum$i = (($704) + -1023)|0;
     $705 = (($$31$i) + ($$sum$i<<2)|0);
     $706 = (($703|0) % 9)&-1;
     $j$0229$i = (($706) + 1)|0;
     $707 = ($j$0229$i|0)<(9);
     if ($707) {
      $i$1230$i = 10;$j$0231$i = $j$0229$i;
      while(1) {
       $708 = ($i$1230$i*10)|0;
       $j$0$i = (($j$0231$i) + 1)|0;
       $exitcond$i = ($j$0$i|0)==(9);
       if ($exitcond$i) {
        $i$1$lcssa$i = $708;
        break;
       } else {
        $i$1230$i = $708;$j$0231$i = $j$0$i;
       }
      }
     } else {
      $i$1$lcssa$i = 10;
     }
     $709 = HEAP32[$705>>2]|0;
     $710 = (($709>>>0) % ($i$1$lcssa$i>>>0))&-1;
     $711 = ($710|0)==(0);
     if ($711) {
      $$sum15$i = (($704) + -1022)|0;
      $712 = (($$31$i) + ($$sum15$i<<2)|0);
      $713 = ($712|0)==($z$3$lcssa$i|0);
      if ($713) {
       $a$7$i = $a$3$lcssa$i;$d$3$i = $705;$e$3$i = $e$1$i;
      } else {
       label = 233;
      }
     } else {
      label = 233;
     }
     do {
      if ((label|0) == 233) {
       label = 0;
       $714 = (($709>>>0) / ($i$1$lcssa$i>>>0))&-1;
       $715 = $714 & 1;
       $716 = ($715|0)==(0);
       $$22$i = $716 ? 9007199254740992.0 : 9007199254740994.0;
       $717 = (($i$1$lcssa$i|0) / 2)&-1;
       $718 = ($710>>>0)<($717>>>0);
       do {
        if ($718) {
         $small$0$i = 0.5;
        } else {
         $719 = ($710|0)==($717|0);
         if ($719) {
          $$sum16$i = (($704) + -1022)|0;
          $720 = (($$31$i) + ($$sum16$i<<2)|0);
          $721 = ($720|0)==($z$3$lcssa$i|0);
          if ($721) {
           $small$0$i = 1.0;
           break;
          }
         }
         $small$0$i = 1.5;
        }
       } while(0);
       $722 = ($pl$0$i|0)==(0);
       do {
        if ($722) {
         $round6$1$i = $$22$i;$small$1$i = $small$0$i;
        } else {
         $723 = HEAP8[$prefix$0$i>>0]|0;
         $724 = ($723<<24>>24)==(45);
         if (!($724)) {
          $round6$1$i = $$22$i;$small$1$i = $small$0$i;
          break;
         }
         $725 = $$22$i * -1.0;
         $726 = $small$0$i * -1.0;
         $round6$1$i = $725;$small$1$i = $726;
        }
       } while(0);
       $727 = (($709) - ($710))|0;
       HEAP32[$705>>2] = $727;
       $728 = $round6$1$i + $small$1$i;
       $729 = $728 != $round6$1$i;
       if (!($729)) {
        $a$7$i = $a$3$lcssa$i;$d$3$i = $705;$e$3$i = $e$1$i;
        break;
       }
       $730 = (($727) + ($i$1$lcssa$i))|0;
       HEAP32[$705>>2] = $730;
       $731 = ($730>>>0)>(999999999);
       if ($731) {
        $a$5223$i = $a$3$lcssa$i;$d$2222$i = $705;
        while(1) {
         $732 = (($d$2222$i) + -4|0);
         HEAP32[$d$2222$i>>2] = 0;
         $733 = ($732>>>0)<($a$5223$i>>>0);
         if ($733) {
          $734 = (($a$5223$i) + -4|0);
          HEAP32[$734>>2] = 0;
          $a$6$i = $734;
         } else {
          $a$6$i = $a$5223$i;
         }
         $735 = HEAP32[$732>>2]|0;
         $736 = (($735) + 1)|0;
         HEAP32[$732>>2] = $736;
         $737 = ($736>>>0)>(999999999);
         if ($737) {
          $a$5223$i = $a$6$i;$d$2222$i = $732;
         } else {
          $a$5$lcssa$i = $a$6$i;$d$2$lcssa$i = $732;
          break;
         }
        }
       } else {
        $a$5$lcssa$i = $a$3$lcssa$i;$d$2$lcssa$i = $705;
       }
       $738 = $a$5$lcssa$i;
       $739 = (($681) - ($738))|0;
       $740 = $739 >> 2;
       $741 = ($740*9)|0;
       $742 = HEAP32[$a$5$lcssa$i>>2]|0;
       $743 = ($742>>>0)<(10);
       if ($743) {
        $a$7$i = $a$5$lcssa$i;$d$3$i = $d$2$lcssa$i;$e$3$i = $741;
        break;
       } else {
        $e$2218$i = $741;$i$2217$i = 10;
       }
       while(1) {
        $744 = ($i$2217$i*10)|0;
        $745 = (($e$2218$i) + 1)|0;
        $746 = ($742>>>0)<($744>>>0);
        if ($746) {
         $a$7$i = $a$5$lcssa$i;$d$3$i = $d$2$lcssa$i;$e$3$i = $745;
         break;
        } else {
         $e$2218$i = $745;$i$2217$i = $744;
        }
       }
      }
     } while(0);
     $747 = (($d$3$i) + 4|0);
     $748 = ($z$3$lcssa$i>>>0)>($747>>>0);
     $$z$3$i = $748 ? $747 : $z$3$lcssa$i;
     $a$8$ph$i = $a$7$i;$e$4$ph$i = $e$3$i;$z$6$ph$i = $$z$3$i;
    } else {
     $a$8$ph$i = $a$3$lcssa$i;$e$4$ph$i = $e$1$i;$z$6$ph$i = $z$3$lcssa$i;
    }
    $749 = (0 - ($e$4$ph$i))|0;
    $z$6$i = $z$6$ph$i;
    while(1) {
     $750 = ($z$6$i>>>0)>($a$8$ph$i>>>0);
     if (!($750)) {
      $$lcssa300$i = 0;
      break;
     }
     $751 = (($z$6$i) + -4|0);
     $752 = HEAP32[$751>>2]|0;
     $753 = ($752|0)==(0);
     if ($753) {
      $z$6$i = $751;
     } else {
      $$lcssa300$i = 1;
      break;
     }
    }
    do {
     if ($694) {
      $754 = ($$p$i|0)==(0);
      $755 = $754&1;
      $$$p$i = (($755) + ($$p$i))|0;
      $756 = ($$$p$i|0)>($e$4$ph$i|0);
      $757 = ($e$4$ph$i|0)>(-5);
      $or$cond4$i = $756 & $757;
      if ($or$cond4$i) {
       $758 = (($t$0) + -1)|0;
       $$neg152$i = (($$$p$i) + -1)|0;
       $759 = (($$neg152$i) - ($e$4$ph$i))|0;
       $$013$i = $758;$$210$i = $759;
      } else {
       $760 = (($t$0) + -2)|0;
       $761 = (($$$p$i) + -1)|0;
       $$013$i = $760;$$210$i = $761;
      }
      $762 = $fl$1$ & 8;
      $763 = ($762|0)==(0);
      if (!($763)) {
       $$114$i = $$013$i;$$311$i = $$210$i;
       break;
      }
      do {
       if ($$lcssa300$i) {
        $764 = (($z$6$i) + -4|0);
        $765 = HEAP32[$764>>2]|0;
        $766 = ($765|0)==(0);
        if ($766) {
         $j$2$i = 9;
         break;
        }
        $767 = (($765>>>0) % 10)&-1;
        $768 = ($767|0)==(0);
        if ($768) {
         $i$3209$i = 10;$j$1210$i = 0;
        } else {
         $j$2$i = 0;
         break;
        }
        while(1) {
         $769 = ($i$3209$i*10)|0;
         $770 = (($j$1210$i) + 1)|0;
         $771 = (($765>>>0) % ($769>>>0))&-1;
         $772 = ($771|0)==(0);
         if ($772) {
          $i$3209$i = $769;$j$1210$i = $770;
         } else {
          $j$2$i = $770;
          break;
         }
        }
       } else {
        $j$2$i = 9;
       }
      } while(0);
      $773 = $$013$i | 32;
      $774 = ($773|0)==(102);
      $775 = $z$6$i;
      $776 = (($775) - ($681))|0;
      $777 = $776 >> 2;
      $778 = ($777*9)|0;
      $779 = (($778) + -9)|0;
      if ($774) {
       $780 = (($779) - ($j$2$i))|0;
       $781 = ($780|0)<(0);
       $$23$i = $781 ? 0 : $780;
       $782 = ($$210$i|0)<($$23$i|0);
       $$210$$23$i = $782 ? $$210$i : $$23$i;
       $$114$i = $$013$i;$$311$i = $$210$$23$i;
       break;
      } else {
       $783 = (($779) + ($e$4$ph$i))|0;
       $784 = (($783) - ($j$2$i))|0;
       $785 = ($784|0)<(0);
       $$25$i = $785 ? 0 : $784;
       $786 = ($$210$i|0)<($$25$i|0);
       $$210$$25$i = $786 ? $$210$i : $$25$i;
       $$114$i = $$013$i;$$311$i = $$210$$25$i;
       break;
      }
     } else {
      $$114$i = $t$0;$$311$i = $$p$i;
     }
    } while(0);
    $787 = ($$311$i|0)!=(0);
    if ($787) {
     $791 = 1;
    } else {
     $788 = $fl$1$ & 8;
     $789 = ($788|0)!=(0);
     $791 = $789;
    }
    $790 = $791&1;
    $792 = $$114$i | 32;
    $793 = ($792|0)==(102);
    if ($793) {
     $794 = ($e$4$ph$i|0)>(0);
     $795 = $794 ? $e$4$ph$i : 0;
     $$pn$i = $795;$estr$2$i = 0;
    } else {
     $796 = ($e$4$ph$i|0)<(0);
     $797 = $796 ? $749 : $e$4$ph$i;
     $798 = ($797|0)<(0);
     if ($798) {
      $799 = ($797|0)<(0);
      $800 = $799 << 31 >> 31;
      $$05$i79$i = $6;$801 = $797;$802 = $800;
      while(1) {
       $803 = (___uremdi3(($801|0),($802|0),10,0)|0);
       $804 = tempRet0;
       $805 = $803 | 48;
       $806 = $805&255;
       $807 = (($$05$i79$i) + -1|0);
       HEAP8[$807>>0] = $806;
       $808 = (___udivdi3(($801|0),($802|0),10,0)|0);
       $809 = tempRet0;
       $810 = ($802>>>0)>(9);
       $811 = ($802|0)==(9);
       $812 = ($801>>>0)>(4294967295);
       $813 = $811 & $812;
       $814 = $810 | $813;
       if ($814) {
        $$05$i79$i = $807;$801 = $808;$802 = $809;
       } else {
        break;
       }
      }
      $$0$lcssa$i84$i = $807;$$01$lcssa$off0$i85$i = $808;
     } else {
      $$0$lcssa$i84$i = $6;$$01$lcssa$off0$i85$i = $797;
     }
     $815 = ($$01$lcssa$off0$i85$i|0)==(0);
     if ($815) {
      $estr$1$ph$i = $$0$lcssa$i84$i;
     } else {
      $$12$i87$i = $$0$lcssa$i84$i;$y$03$i86$i = $$01$lcssa$off0$i85$i;
      while(1) {
       $816 = (($y$03$i86$i>>>0) % 10)&-1;
       $817 = $816 | 48;
       $818 = $817&255;
       $819 = (($$12$i87$i) + -1|0);
       HEAP8[$819>>0] = $818;
       $820 = (($y$03$i86$i>>>0) / 10)&-1;
       $821 = ($y$03$i86$i>>>0)<(10);
       if ($821) {
        $estr$1$ph$i = $819;
        break;
       } else {
        $$12$i87$i = $819;$y$03$i86$i = $820;
       }
      }
     }
     $822 = $estr$1$ph$i;
     $823 = (($8) - ($822))|0;
     $824 = ($823|0)<(2);
     if ($824) {
      $estr$1200$i = $estr$1$ph$i;
      while(1) {
       $825 = (($estr$1200$i) + -1|0);
       HEAP8[$825>>0] = 48;
       $826 = $825;
       $827 = (($8) - ($826))|0;
       $828 = ($827|0)<(2);
       if ($828) {
        $estr$1200$i = $825;
       } else {
        $estr$1$lcssa$i = $825;
        break;
       }
      }
     } else {
      $estr$1$lcssa$i = $estr$1$ph$i;
     }
     $829 = $e$4$ph$i >> 31;
     $830 = $829 & 2;
     $831 = (($830) + 43)|0;
     $832 = $831&255;
     $833 = (($estr$1$lcssa$i) + -1|0);
     HEAP8[$833>>0] = $832;
     $834 = $$114$i&255;
     $835 = (($estr$1$lcssa$i) + -2|0);
     HEAP8[$835>>0] = $834;
     $836 = $835;
     $837 = (($8) - ($836))|0;
     $$pn$i = $837;$estr$2$i = $835;
    }
    $838 = (($pl$0$i) + 1)|0;
    $839 = (($838) + ($$311$i))|0;
    $l$1$i = (($839) + ($790))|0;
    $840 = (($l$1$i) + ($$pn$i))|0;
    $841 = $fl$1$ & 73728;
    $842 = ($841|0)==(0);
    $843 = ($840|0)<($w$1|0);
    $or$cond$i93$i = $842 & $843;
    if ($or$cond$i93$i) {
     $844 = (($w$1) - ($840))|0;
     $845 = ($844>>>0)>(256);
     $846 = $845 ? 256 : $844;
     _memset(($pad$i|0),32,($846|0))|0;
     $847 = ($844>>>0)>(255);
     if ($847) {
      $$01$i94$i = $844;
      while(1) {
       (___fwritex($pad$i,256,$f)|0);
       $848 = (($$01$i94$i) + -256)|0;
       $849 = ($848>>>0)>(255);
       if ($849) {
        $$01$i94$i = $848;
       } else {
        $$0$lcssa$i96$i = $848;
        break;
       }
      }
     } else {
      $$0$lcssa$i96$i = $844;
     }
     (___fwritex($pad$i,$$0$lcssa$i96$i,$f)|0);
    }
    (___fwritex($prefix$0$i,$pl$0$i,$f)|0);
    $850 = ($841|0)==(65536);
    $or$cond$i100$i = $850 & $843;
    if ($or$cond$i100$i) {
     $851 = (($w$1) - ($840))|0;
     $852 = ($851>>>0)>(256);
     $853 = $852 ? 256 : $851;
     _memset(($pad$i|0),48,($853|0))|0;
     $854 = ($851>>>0)>(255);
     if ($854) {
      $$01$i101$i = $851;
      while(1) {
       (___fwritex($pad$i,256,$f)|0);
       $855 = (($$01$i101$i) + -256)|0;
       $856 = ($855>>>0)>(255);
       if ($856) {
        $$01$i101$i = $855;
       } else {
        $$0$lcssa$i103$i = $855;
        break;
       }
      }
     } else {
      $$0$lcssa$i103$i = $851;
     }
     (___fwritex($pad$i,$$0$lcssa$i103$i,$f)|0);
    }
    do {
     if ($793) {
      $857 = ($a$8$ph$i>>>0)>($$31$i>>>0);
      $r$0$a$8$i = $857 ? $$31$i : $a$8$ph$i;
      $d$4183$i = $r$0$a$8$i;
      while(1) {
       $858 = HEAP32[$d$4183$i>>2]|0;
       $859 = ($858|0)==(0);
       if ($859) {
        $$1$lcssa$i112$i = $13;
       } else {
        $$12$i110$i = $13;$y$03$i109$i = $858;
        while(1) {
         $860 = (($y$03$i109$i>>>0) % 10)&-1;
         $861 = $860 | 48;
         $862 = $861&255;
         $863 = (($$12$i110$i) + -1|0);
         HEAP8[$863>>0] = $862;
         $864 = (($y$03$i109$i>>>0) / 10)&-1;
         $865 = ($y$03$i109$i>>>0)<(10);
         if ($865) {
          $$1$lcssa$i112$i = $863;
          break;
         } else {
          $$12$i110$i = $863;$y$03$i109$i = $864;
         }
        }
       }
       $866 = ($d$4183$i|0)==($r$0$a$8$i|0);
       do {
        if ($866) {
         $870 = ($$1$lcssa$i112$i|0)==($13|0);
         if (!($870)) {
          $s7$1$i = $$1$lcssa$i112$i;
          break;
         }
         HEAP8[$15>>0] = 48;
         $s7$1$i = $15;
        } else {
         $867 = ($$1$lcssa$i112$i>>>0)>($buf$i>>>0);
         if ($867) {
          $s7$0180$i = $$1$lcssa$i112$i;
         } else {
          $s7$1$i = $$1$lcssa$i112$i;
          break;
         }
         while(1) {
          $868 = (($s7$0180$i) + -1|0);
          HEAP8[$868>>0] = 48;
          $869 = ($868>>>0)>($buf$i>>>0);
          if ($869) {
           $s7$0180$i = $868;
          } else {
           $s7$1$i = $868;
           break;
          }
         }
        }
       } while(0);
       $871 = $s7$1$i;
       $872 = (($14) - ($871))|0;
       (___fwritex($s7$1$i,$872,$f)|0);
       $873 = (($d$4183$i) + 4|0);
       $874 = ($873>>>0)>($$31$i>>>0);
       if ($874) {
        break;
       } else {
        $d$4183$i = $873;
       }
      }
      if (!($787)) {
       $875 = $fl$1$ & 8;
       $876 = ($875|0)==(0);
       if ($876) {
        break;
       }
      }
      (___fwritex(3384,1,$f)|0);
      $877 = ($873>>>0)<($z$6$i>>>0);
      $878 = ($$311$i|0)>(0);
      $or$cond28173$i = $877 & $878;
      if ($or$cond28173$i) {
       $$412175$i = $$311$i;$d$5174$i = $873;
       while(1) {
        $879 = HEAP32[$d$5174$i>>2]|0;
        $880 = ($879|0)==(0);
        if ($880) {
         $s8$0169$i = $13;
         label = 300;
        } else {
         $$12$i119$i = $13;$y$03$i118$i = $879;
         while(1) {
          $881 = (($y$03$i118$i>>>0) % 10)&-1;
          $882 = $881 | 48;
          $883 = $882&255;
          $884 = (($$12$i119$i) + -1|0);
          HEAP8[$884>>0] = $883;
          $885 = (($y$03$i118$i>>>0) / 10)&-1;
          $886 = ($y$03$i118$i>>>0)<(10);
          if ($886) {
           break;
          } else {
           $$12$i119$i = $884;$y$03$i118$i = $885;
          }
         }
         $887 = ($884>>>0)>($buf$i>>>0);
         if ($887) {
          $s8$0169$i = $884;
          label = 300;
         } else {
          $s8$0$lcssa$i = $884;
         }
        }
        if ((label|0) == 300) {
         while(1) {
          label = 0;
          $888 = (($s8$0169$i) + -1|0);
          HEAP8[$888>>0] = 48;
          $889 = ($888>>>0)>($buf$i>>>0);
          if ($889) {
           $s8$0169$i = $888;
           label = 300;
          } else {
           $s8$0$lcssa$i = $888;
           break;
          }
         }
        }
        $890 = ($$412175$i|0)>(9);
        $891 = $890 ? 9 : $$412175$i;
        (___fwritex($s8$0$lcssa$i,$891,$f)|0);
        $892 = (($d$5174$i) + 4|0);
        $893 = (($$412175$i) + -9)|0;
        $894 = ($892>>>0)<($z$6$i>>>0);
        $895 = ($893|0)>(0);
        $or$cond28$i = $894 & $895;
        if ($or$cond28$i) {
         $$412175$i = $893;$d$5174$i = $892;
        } else {
         $$412$lcssa$i = $893;
         break;
        }
       }
      } else {
       $$412$lcssa$i = $$311$i;
      }
      $896 = ($$412$lcssa$i|0)>(0);
      if (!($896)) {
       break;
      }
      $897 = ($$412$lcssa$i>>>0)>(256);
      $898 = $897 ? 256 : $$412$lcssa$i;
      _memset(($pad$i|0),48,($898|0))|0;
      $899 = ($$412$lcssa$i>>>0)>(255);
      if ($899) {
       $$01$i125$i = $$412$lcssa$i;
       while(1) {
        (___fwritex($pad$i,256,$f)|0);
        $900 = (($$01$i125$i) + -256)|0;
        $901 = ($900>>>0)>(255);
        if ($901) {
         $$01$i125$i = $900;
        } else {
         $$0$lcssa$i127$i = $900;
         break;
        }
       }
      } else {
       $$0$lcssa$i127$i = $$412$lcssa$i;
      }
      (___fwritex($pad$i,$$0$lcssa$i127$i,$f)|0);
     } else {
      $902 = (($a$8$ph$i) + 4|0);
      $z$6$$i = $$lcssa300$i ? $z$6$i : $902;
      $903 = ($$311$i|0)>(-1);
      do {
       if ($903) {
        $904 = $fl$1$ & 8;
        $$not$i = ($904|0)!=(0);
        $$5193$i = $$311$i;$d$6192$i = $a$8$ph$i;
        while(1) {
         $905 = HEAP32[$d$6192$i>>2]|0;
         $906 = ($905|0)==(0);
         if ($906) {
          label = 311;
         } else {
          $$12$i134$i = $13;$y$03$i133$i = $905;
          while(1) {
           $907 = (($y$03$i133$i>>>0) % 10)&-1;
           $908 = $907 | 48;
           $909 = $908&255;
           $910 = (($$12$i134$i) + -1|0);
           HEAP8[$910>>0] = $909;
           $911 = (($y$03$i133$i>>>0) / 10)&-1;
           $912 = ($y$03$i133$i>>>0)<(10);
           if ($912) {
            break;
           } else {
            $$12$i134$i = $910;$y$03$i133$i = $911;
           }
          }
          $913 = ($910|0)==($13|0);
          if ($913) {
           label = 311;
          } else {
           $s9$0$i = $910;
          }
         }
         if ((label|0) == 311) {
          label = 0;
          HEAP8[$15>>0] = 48;
          $s9$0$i = $15;
         }
         $914 = ($d$6192$i|0)==($a$8$ph$i|0);
         do {
          if ($914) {
           $918 = (($s9$0$i) + 1|0);
           (___fwritex($s9$0$i,1,$f)|0);
           $919 = ($$5193$i|0)>(0);
           $brmerge$i = $919 | $$not$i;
           if (!($brmerge$i)) {
            $s9$2$i = $918;
            break;
           }
           (___fwritex(3384,1,$f)|0);
           $s9$2$i = $918;
          } else {
           $915 = ($s9$0$i>>>0)>($buf$i>>>0);
           if ($915) {
            $s9$1188$i = $s9$0$i;
           } else {
            $s9$2$i = $s9$0$i;
            break;
           }
           while(1) {
            $916 = (($s9$1188$i) + -1|0);
            HEAP8[$916>>0] = 48;
            $917 = ($916>>>0)>($buf$i>>>0);
            if ($917) {
             $s9$1188$i = $916;
            } else {
             $s9$2$i = $916;
             break;
            }
           }
          }
         } while(0);
         $920 = $s9$2$i;
         $921 = (($14) - ($920))|0;
         $922 = ($921|0)<($$5193$i|0);
         $$$5$i = $922 ? $921 : $$5193$i;
         (___fwritex($s9$2$i,$$$5$i,$f)|0);
         $923 = (($$5193$i) - ($921))|0;
         $924 = (($d$6192$i) + 4|0);
         $925 = ($924>>>0)<($z$6$$i>>>0);
         $926 = ($923|0)>(-1);
         $or$cond29$i = $925 & $926;
         if ($or$cond29$i) {
          $$5193$i = $923;$d$6192$i = $924;
         } else {
          break;
         }
        }
        $927 = ($923|0)>(0);
        if (!($927)) {
         break;
        }
        $928 = ($923>>>0)>(256);
        $929 = $928 ? 256 : $923;
        _memset(($pad$i|0),48,($929|0))|0;
        $930 = ($923>>>0)>(255);
        if ($930) {
         $$01$i140$i = $923;
         while(1) {
          (___fwritex($pad$i,256,$f)|0);
          $931 = (($$01$i140$i) + -256)|0;
          $932 = ($931>>>0)>(255);
          if ($932) {
           $$01$i140$i = $931;
          } else {
           $$0$lcssa$i142$i = $931;
           break;
          }
         }
        } else {
         $$0$lcssa$i142$i = $923;
        }
        (___fwritex($pad$i,$$0$lcssa$i142$i,$f)|0);
       }
      } while(0);
      $933 = $estr$2$i;
      $934 = (($8) - ($933))|0;
      (___fwritex($estr$2$i,$934,$f)|0);
     }
    } while(0);
    $935 = ($841|0)==(8192);
    $or$cond$i$i = $935 & $843;
    if ($or$cond$i$i) {
     $936 = (($w$1) - ($840))|0;
     $937 = ($936>>>0)>(256);
     $938 = $937 ? 256 : $936;
     _memset(($pad$i|0),32,($938|0))|0;
     $939 = ($936>>>0)>(255);
     if ($939) {
      $$01$i$i = $936;
      while(1) {
       (___fwritex($pad$i,256,$f)|0);
       $940 = (($$01$i$i) + -256)|0;
       $941 = ($940>>>0)>(255);
       if ($941) {
        $$01$i$i = $940;
       } else {
        $$0$lcssa$i$i = $940;
        break;
       }
      }
     } else {
      $$0$lcssa$i$i = $936;
     }
     (___fwritex($pad$i,$$0$lcssa$i$i,$f)|0);
    }
    $w$30$i = $843 ? $w$1 : $840;
    $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $w$30$i;$l10n$0 = $l10n$3;
    continue L1;
    break;
   }
   case 112:  {
    $222 = ($p$0>>>0)>(8);
    $223 = $222 ? $p$0 : 8;
    $224 = $fl$1$ | 8;
    $fl$3 = $224;$p$1 = $223;$t$1 = 120;
    label = 77;
    break;
   }
   case 88: case 120:  {
    $fl$3 = $fl$1$;$p$1 = $p$0;$t$1 = $t$0;
    label = 77;
    break;
   }
   case 111:  {
    $249 = $207;
    $250 = ($249|0)==(0);
    $251 = ($229|0)==(0);
    $252 = $250 & $251;
    if ($252) {
     $$0$lcssa$i43 = $2;
    } else {
     $$03$i40 = $2;$254 = $249;$258 = $229;
     while(1) {
      $253 = $254 & 7;
      $255 = $253 | 48;
      $256 = $255&255;
      $257 = (($$03$i40) + -1|0);
      HEAP8[$257>>0] = $256;
      $259 = (_bitshift64Lshr(($254|0),($258|0),3)|0);
      $260 = tempRet0;
      $261 = ($259|0)==(0);
      $262 = ($260|0)==(0);
      $263 = $261 & $262;
      if ($263) {
       $$0$lcssa$i43 = $257;
       break;
      } else {
       $$03$i40 = $257;$254 = $259;$258 = $260;
      }
     }
    }
    $264 = $fl$1$ & 8;
    $265 = ($264|0)==(0);
    if ($265) {
     $308 = $207;$311 = $229;$a$0 = $$0$lcssa$i43;$fl$4 = $fl$1$;$p$2 = $p$0;$pl$1 = 0;$prefix$1 = 3288;
     label = 94;
    } else {
     $$13 = $252 ? 3288 : ((3288 + 5|0));
     $266 = $252&1;
     $$14 = $266 ^ 1;
     $308 = $207;$311 = $229;$a$0 = $$0$lcssa$i43;$fl$4 = $fl$1$;$p$2 = $p$0;$pl$1 = $$14;$prefix$1 = $$13;
     label = 94;
    }
    break;
   }
   case 105: case 100:  {
    $267 = $207;
    $268 = ($229|0)<(0);
    if ($268) {
     $269 = (_i64Subtract(0,0,($267|0),($229|0))|0);
     $270 = tempRet0;
     $271 = $269;
     $277 = $271;$279 = $270;$pl$0 = 1;$prefix$0 = 3288;
     label = 89;
     break L92;
    }
    $272 = $fl$1$ & 2048;
    $273 = ($272|0)==(0);
    if ($273) {
     $274 = $fl$1$ & 1;
     $275 = ($274|0)==(0);
     $$15 = $275 ? 3288 : ((3288 + 2|0));
     $277 = $207;$279 = $229;$pl$0 = $274;$prefix$0 = $$15;
     label = 89;
    } else {
     $277 = $207;$279 = $229;$pl$0 = 1;$prefix$0 = ((3288 + 1|0));
     label = 89;
    }
    break;
   }
   case 117:  {
    $277 = $207;$279 = $229;$pl$0 = 0;$prefix$0 = 3288;
    label = 89;
    break;
   }
   case 99:  {
    $319 = $207;
    $320 = $319&255;
    HEAP8[$4>>0] = $320;
    $1053 = $229;$1054 = $207;$a$2 = $4;$fl$6 = $206;$p$5 = 1;$pl$2 = 0;$prefix$2 = 3288;$z$2 = $2;
    break;
   }
   case 109:  {
    $321 = (___errno_location()|0);
    $322 = HEAP32[$321>>2]|0;
    $323 = (_strerror(($322|0))|0);
    $a$1 = $323;
    label = 99;
    break;
   }
   case 115:  {
    $324 = ($207|0)==(0|0);
    $$17 = $324 ? 3304 : $207;
    $a$1 = $$17;
    label = 99;
    break;
   }
   case 67:  {
    $331 = $207;
    HEAP32[$wc>>2] = $331;
    HEAP32[$5>>2] = 0;
    $1055 = $wc;$1056 = $wc;$p$4296 = -1;
    label = 104;
    break;
   }
   case 83:  {
    $332 = ($p$0|0)==(0);
    if ($332) {
     $1057 = $207;$1058 = $207;$i$0166 = 0;
     label = 110;
    } else {
     $1055 = $207;$1056 = $207;$p$4296 = $p$0;
     label = 104;
    }
    break;
   }
   case 110:  {
    switch ($st$0|0) {
    case 6:  {
     HEAP32[$207>>2] = $cnt$1;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 7:  {
     $216 = ($cnt$1|0)<(0);
     $217 = $216 << 31 >> 31;
     $218 = $207;
     $219 = $218;
     HEAP32[$219>>2] = $cnt$1;
     $220 = (($218) + 4)|0;
     $221 = $220;
     HEAP32[$221>>2] = $217;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 0:  {
     HEAP32[$207>>2] = $cnt$1;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 1:  {
     HEAP32[$207>>2] = $cnt$1;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 2:  {
     $208 = ($cnt$1|0)<(0);
     $209 = $208 << 31 >> 31;
     $210 = $207;
     $211 = $210;
     HEAP32[$211>>2] = $cnt$1;
     $212 = (($210) + 4)|0;
     $213 = $212;
     HEAP32[$213>>2] = $209;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 3:  {
     $214 = $cnt$1&65535;
     HEAP16[$207>>1] = $214;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    case 4:  {
     $215 = $cnt$1&255;
     HEAP8[$207>>0] = $215;
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
     break;
    }
    default: {
     $1045 = $229;$1046 = $207;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $36;$l10n$0 = $l10n$3;
     continue L1;
    }
    }
    break;
   }
   default: {
    $1053 = $229;$1054 = $207;$a$2 = $22;$fl$6 = $fl$1$;$p$5 = $p$0;$pl$2 = 0;$prefix$2 = 3288;$z$2 = $2;
   }
   }
  } while(0);
  L445: do {
   if ((label|0) == 77) {
    label = 0;
    $225 = $207;
    $226 = $t$1 & 32;
    $227 = ($225|0)==(0);
    $228 = ($229|0)==(0);
    $230 = $227 & $228;
    if ($230) {
     $308 = $207;$311 = $229;$a$0 = $2;$fl$4 = $fl$3;$p$2 = $p$1;$pl$1 = 0;$prefix$1 = 3288;
     label = 94;
    } else {
     $$012$i = $2;$232 = $225;$239 = $229;
     while(1) {
      $231 = $232 & 15;
      $233 = (3368 + ($231)|0);
      $234 = HEAP8[$233>>0]|0;
      $235 = $234&255;
      $236 = $235 | $226;
      $237 = $236&255;
      $238 = (($$012$i) + -1|0);
      HEAP8[$238>>0] = $237;
      $240 = (_bitshift64Lshr(($232|0),($239|0),4)|0);
      $241 = tempRet0;
      $242 = ($240|0)==(0);
      $243 = ($241|0)==(0);
      $244 = $242 & $243;
      if ($244) {
       break;
      } else {
       $$012$i = $238;$232 = $240;$239 = $241;
      }
     }
     $245 = $fl$3 & 8;
     $246 = ($245|0)==(0);
     if ($246) {
      $308 = $207;$311 = $229;$a$0 = $238;$fl$4 = $fl$3;$p$2 = $p$1;$pl$1 = 0;$prefix$1 = 3288;
      label = 94;
     } else {
      $247 = $t$1 >> 4;
      $248 = (3288 + ($247)|0);
      $308 = $207;$311 = $229;$a$0 = $238;$fl$4 = $fl$3;$p$2 = $p$1;$pl$1 = 2;$prefix$1 = $248;
      label = 94;
     }
    }
   }
   else if ((label|0) == 89) {
    label = 0;
    $276 = $277;
    $278 = ($279>>>0)>(0);
    $280 = ($279|0)==(0);
    $281 = ($276>>>0)>(4294967295);
    $282 = $280 & $281;
    $283 = $278 | $282;
    if ($283) {
     $$05$i = $2;$284 = $276;$285 = $279;
     while(1) {
      $286 = (___uremdi3(($284|0),($285|0),10,0)|0);
      $287 = tempRet0;
      $288 = $286 | 48;
      $289 = $288&255;
      $290 = (($$05$i) + -1|0);
      HEAP8[$290>>0] = $289;
      $291 = (___udivdi3(($284|0),($285|0),10,0)|0);
      $292 = tempRet0;
      $293 = ($285>>>0)>(9);
      $294 = ($285|0)==(9);
      $295 = ($284>>>0)>(4294967295);
      $296 = $294 & $295;
      $297 = $293 | $296;
      if ($297) {
       $$05$i = $290;$284 = $291;$285 = $292;
      } else {
       break;
      }
     }
     $$0$lcssa$i45 = $290;$$01$lcssa$off0$i = $291;
    } else {
     $$0$lcssa$i45 = $2;$$01$lcssa$off0$i = $276;
    }
    $298 = ($$01$lcssa$off0$i|0)==(0);
    if ($298) {
     $308 = $277;$311 = $279;$a$0 = $$0$lcssa$i45;$fl$4 = $fl$1$;$p$2 = $p$0;$pl$1 = $pl$0;$prefix$1 = $prefix$0;
     label = 94;
    } else {
     $$12$i = $$0$lcssa$i45;$y$03$i = $$01$lcssa$off0$i;
     while(1) {
      $299 = (($y$03$i>>>0) % 10)&-1;
      $300 = $299 | 48;
      $301 = $300&255;
      $302 = (($$12$i) + -1|0);
      HEAP8[$302>>0] = $301;
      $303 = (($y$03$i>>>0) / 10)&-1;
      $304 = ($y$03$i>>>0)<(10);
      if ($304) {
       $308 = $277;$311 = $279;$a$0 = $302;$fl$4 = $fl$1$;$p$2 = $p$0;$pl$1 = $pl$0;$prefix$1 = $prefix$0;
       label = 94;
       break;
      } else {
       $$12$i = $302;$y$03$i = $303;
      }
     }
    }
   }
   else if ((label|0) == 99) {
    label = 0;
    $325 = (_memchr($a$1,0,$p$0)|0);
    $326 = ($325|0)==(0|0);
    if ($326) {
     $327 = (($a$1) + ($p$0)|0);
     $1053 = $229;$1054 = $207;$a$2 = $a$1;$fl$6 = $206;$p$5 = $p$0;$pl$2 = 0;$prefix$2 = 3288;$z$2 = $327;
     break;
    } else {
     $328 = $325;
     $329 = $a$1;
     $330 = (($328) - ($329))|0;
     $1053 = $229;$1054 = $207;$a$2 = $a$1;$fl$6 = $206;$p$5 = $330;$pl$2 = 0;$prefix$2 = 3288;$z$2 = $325;
     break;
    }
   }
   else if ((label|0) == 104) {
    label = 0;
    $i$0168 = 0;$l$1167 = 0;$ws$0169 = $1055;
    while(1) {
     $336 = HEAP32[$ws$0169>>2]|0;
     $337 = ($336|0)==(0);
     if ($337) {
      $i$0$lcssa = $i$0168;$l$1$lcssa = $l$1167;
      break;
     }
     $338 = (_wctomb($mb,$336)|0);
     $339 = ($338|0)>(-1);
     if (!($339)) {
      $$0 = -1;
      label = 362;
      break L1;
     }
     $340 = (($p$4296) - ($i$0168))|0;
     $341 = ($338>>>0)>($340>>>0);
     $335 = (($338) + ($i$0168))|0;
     if ($341) {
      $1057 = $1055;$1058 = $1056;$i$0166 = $i$0168;
      label = 110;
      break L445;
     }
     $333 = (($ws$0169) + 4|0);
     $334 = ($335>>>0)<($p$4296>>>0);
     if ($334) {
      $i$0168 = $335;$l$1167 = $338;$ws$0169 = $333;
     } else {
      $i$0$lcssa = $335;$l$1$lcssa = $338;
      break;
     }
    }
    $342 = ($l$1$lcssa|0)<(0);
    if ($342) {
     $$0 = -1;
     label = 362;
     break L1;
    } else {
     $1057 = $1055;$1058 = $1056;$i$0166 = $i$0$lcssa;
     label = 110;
    }
   }
  } while(0);
  if ((label|0) == 94) {
   label = 0;
   $305 = ($p$2|0)>(-1);
   $306 = $fl$4 & -65537;
   $$fl$4 = $305 ? $306 : $fl$4;
   $307 = $308;
   $309 = ($307|0)==(0);
   $310 = ($311|0)==(0);
   $312 = $309 & $310;
   $313 = ($p$2|0)==(0);
   $or$cond = $312 & $313;
   if ($or$cond) {
    $1053 = $311;$1054 = $308;$a$2 = $2;$fl$6 = $$fl$4;$p$5 = 0;$pl$2 = $pl$1;$prefix$2 = $prefix$1;$z$2 = $2;
   } else {
    $314 = $a$0;
    $315 = (($3) - ($314))|0;
    $316 = $312&1;
    $317 = (($316) + ($315))|0;
    $318 = ($p$2|0)>($317|0);
    $p$2$ = $318 ? $p$2 : $317;
    $1053 = $311;$1054 = $308;$a$2 = $a$0;$fl$6 = $$fl$4;$p$5 = $p$2$;$pl$2 = $pl$1;$prefix$2 = $prefix$1;$z$2 = $2;
   }
  }
  else if ((label|0) == 110) {
   label = 0;
   $343 = $fl$1$ & 73728;
   $344 = ($343|0)==(0);
   $345 = ($i$0166|0)<($w$1|0);
   $or$cond$i56 = $344 & $345;
   if ($or$cond$i56) {
    $346 = (($w$1) - ($i$0166))|0;
    $347 = ($346>>>0)>(256);
    $348 = $347 ? 256 : $346;
    _memset(($pad$i|0),32,($348|0))|0;
    $349 = ($346>>>0)>(255);
    if ($349) {
     $$01$i57 = $346;
     while(1) {
      (___fwritex($pad$i,256,$f)|0);
      $350 = (($$01$i57) + -256)|0;
      $351 = ($350>>>0)>(255);
      if ($351) {
       $$01$i57 = $350;
      } else {
       $$0$lcssa$i59 = $350;
       break;
      }
     }
    } else {
     $$0$lcssa$i59 = $346;
    }
    (___fwritex($pad$i,$$0$lcssa$i59,$f)|0);
   }
   $352 = ($i$0166|0)==(0);
   L481: do {
    if (!($352)) {
     $i$1174 = 0;$ws$1175 = $1057;
     while(1) {
      $353 = HEAP32[$ws$1175>>2]|0;
      $354 = ($353|0)==(0);
      if ($354) {
       break L481;
      }
      $355 = (_wctomb($mb,$353)|0);
      $356 = (($355) + ($i$1174))|0;
      $357 = ($356|0)>($i$0166|0);
      if ($357) {
       break L481;
      }
      $358 = (($ws$1175) + 4|0);
      (___fwritex($mb,$355,$f)|0);
      $359 = ($356>>>0)<($i$0166>>>0);
      if ($359) {
       $i$1174 = $356;$ws$1175 = $358;
      } else {
       break;
      }
     }
    }
   } while(0);
   $360 = ($343|0)==(8192);
   $or$cond$i63 = $360 & $345;
   if ($or$cond$i63) {
    $361 = (($w$1) - ($i$0166))|0;
    $362 = ($361>>>0)>(256);
    $363 = $362 ? 256 : $361;
    _memset(($pad$i|0),32,($363|0))|0;
    $364 = ($361>>>0)>(255);
    if ($364) {
     $$01$i64 = $361;
     while(1) {
      (___fwritex($pad$i,256,$f)|0);
      $365 = (($$01$i64) + -256)|0;
      $366 = ($365>>>0)>(255);
      if ($366) {
       $$01$i64 = $365;
      } else {
       $$0$lcssa$i66 = $365;
       break;
      }
     }
    } else {
     $$0$lcssa$i66 = $361;
    }
    (___fwritex($pad$i,$$0$lcssa$i66,$f)|0);
   }
   $367 = $345 ? $w$1 : $i$0166;
   $1045 = $229;$1046 = $1058;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $367;$l10n$0 = $l10n$3;
   continue;
  }
  $942 = $z$2;
  $943 = $a$2;
  $944 = (($942) - ($943))|0;
  $945 = ($p$5|0)<($944|0);
  $$p$5 = $945 ? $944 : $p$5;
  $946 = (($pl$2) + ($$p$5))|0;
  $947 = ($w$1|0)<($946|0);
  $w$2 = $947 ? $946 : $w$1;
  $948 = $fl$6 & 73728;
  $949 = ($948|0)==(0);
  $950 = ($946|0)<($w$2|0);
  $or$cond$i73 = $949 & $950;
  if ($or$cond$i73) {
   $951 = (($w$2) - ($946))|0;
   $952 = ($951>>>0)>(256);
   $953 = $952 ? 256 : $951;
   _memset(($pad$i|0),32,($953|0))|0;
   $954 = ($951>>>0)>(255);
   if ($954) {
    $$01$i74 = $951;
    while(1) {
     (___fwritex($pad$i,256,$f)|0);
     $955 = (($$01$i74) + -256)|0;
     $956 = ($955>>>0)>(255);
     if ($956) {
      $$01$i74 = $955;
     } else {
      $$0$lcssa$i76 = $955;
      break;
     }
    }
   } else {
    $$0$lcssa$i76 = $951;
   }
   (___fwritex($pad$i,$$0$lcssa$i76,$f)|0);
  }
  (___fwritex($prefix$2,$pl$2,$f)|0);
  $957 = ($948|0)==(65536);
  $or$cond$i49 = $957 & $950;
  if ($or$cond$i49) {
   $958 = (($w$2) - ($946))|0;
   $959 = ($958>>>0)>(256);
   $960 = $959 ? 256 : $958;
   _memset(($pad$i|0),48,($960|0))|0;
   $961 = ($958>>>0)>(255);
   if ($961) {
    $$01$i50 = $958;
    while(1) {
     (___fwritex($pad$i,256,$f)|0);
     $962 = (($$01$i50) + -256)|0;
     $963 = ($962>>>0)>(255);
     if ($963) {
      $$01$i50 = $962;
     } else {
      $$0$lcssa$i52 = $962;
      break;
     }
    }
   } else {
    $$0$lcssa$i52 = $958;
   }
   (___fwritex($pad$i,$$0$lcssa$i52,$f)|0);
  }
  $964 = ($944|0)<($$p$5|0);
  if ($964) {
   $965 = (($$p$5) - ($944))|0;
   $966 = ($965>>>0)>(256);
   $967 = $966 ? 256 : $965;
   _memset(($pad$i|0),48,($967|0))|0;
   $968 = ($965>>>0)>(255);
   if ($968) {
    $$01$i35 = $965;
    while(1) {
     (___fwritex($pad$i,256,$f)|0);
     $969 = (($$01$i35) + -256)|0;
     $970 = ($969>>>0)>(255);
     if ($970) {
      $$01$i35 = $969;
     } else {
      $$0$lcssa$i37 = $969;
      break;
     }
    }
   } else {
    $$0$lcssa$i37 = $965;
   }
   (___fwritex($pad$i,$$0$lcssa$i37,$f)|0);
  }
  (___fwritex($a$2,$944,$f)|0);
  $971 = ($948|0)==(8192);
  $or$cond$i = $971 & $950;
  if (!($or$cond$i)) {
   $1045 = $1053;$1046 = $1054;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $w$2;$l10n$0 = $l10n$3;
   continue;
  }
  $972 = (($w$2) - ($946))|0;
  $973 = ($972>>>0)>(256);
  $974 = $973 ? 256 : $972;
  _memset(($pad$i|0),32,($974|0))|0;
  $975 = ($972>>>0)>(255);
  if ($975) {
   $$01$i = $972;
   while(1) {
    (___fwritex($pad$i,256,$f)|0);
    $976 = (($$01$i) + -256)|0;
    $977 = ($976>>>0)>(255);
    if ($977) {
     $$01$i = $976;
    } else {
     $$0$lcssa$i = $976;
     break;
    }
   }
  } else {
   $$0$lcssa$i = $972;
  }
  (___fwritex($pad$i,$$0$lcssa$i,$f)|0);
  $1045 = $1053;$1046 = $1054;$22 = $139;$cnt$0 = $cnt$1;$l$0 = $w$2;$l10n$0 = $l10n$3;
 }
 if ((label|0) == 344) {
  $978 = ($f|0)==(0|0);
  if (!($978)) {
   $$0 = $cnt$1;
   STACKTOP = sp;return ($$0|0);
  }
  $979 = ($l10n$0|0)==(0);
  if ($979) {
   $$0 = 0;
   STACKTOP = sp;return ($$0|0);
  } else {
   $i$289 = 1;
  }
  while(1) {
   $980 = (($nl_type) + ($i$289<<2)|0);
   $981 = HEAP32[$980>>2]|0;
   $982 = ($981|0)==(0);
   if ($982) {
    $i$388 = $i$289;
    break;
   }
   $983 = (($nl_arg) + ($i$289<<3)|0);
   $984 = ($981>>>0)>(20);
   L531: do {
    if (!($984)) {
     do {
      switch ($981|0) {
      case 13:  {
       $arglist_current47 = HEAP32[$ap>>2]|0;
       $1008 = HEAP32[$arglist_current47>>2]|0;
       $arglist_next48 = (($arglist_current47) + 4|0);
       HEAP32[$ap>>2] = $arglist_next48;
       $1009 = $1008&65535;
       $1010 = $1009 << 16 >> 16;
       $1011 = ($1010|0)<(0);
       $1012 = $1011 << 31 >> 31;
       $1013 = $983;
       $1014 = $1013;
       HEAP32[$1014>>2] = $1010;
       $1015 = (($1013) + 4)|0;
       $1016 = $1015;
       HEAP32[$1016>>2] = $1012;
       break L531;
       break;
      }
      case 11:  {
       $arglist_current41 = HEAP32[$ap>>2]|0;
       $993 = HEAP32[$arglist_current41>>2]|0;
       $arglist_next42 = (($arglist_current41) + 4|0);
       HEAP32[$ap>>2] = $arglist_next42;
       $994 = $983;
       $995 = $994;
       HEAP32[$995>>2] = $993;
       $996 = (($994) + 4)|0;
       $997 = $996;
       HEAP32[$997>>2] = 0;
       break L531;
       break;
      }
      case 14:  {
       $arglist_current50 = HEAP32[$ap>>2]|0;
       $1017 = HEAP32[$arglist_current50>>2]|0;
       $arglist_next51 = (($arglist_current50) + 4|0);
       HEAP32[$ap>>2] = $arglist_next51;
       $$mask1$i = $1017 & 65535;
       $1018 = $983;
       $1019 = $1018;
       HEAP32[$1019>>2] = $$mask1$i;
       $1020 = (($1018) + 4)|0;
       $1021 = $1020;
       HEAP32[$1021>>2] = 0;
       break L531;
       break;
      }
      case 15:  {
       $arglist_current53 = HEAP32[$ap>>2]|0;
       $1022 = HEAP32[$arglist_current53>>2]|0;
       $arglist_next54 = (($arglist_current53) + 4|0);
       HEAP32[$ap>>2] = $arglist_next54;
       $1023 = $1022&255;
       $1024 = $1023 << 24 >> 24;
       $1025 = ($1024|0)<(0);
       $1026 = $1025 << 31 >> 31;
       $1027 = $983;
       $1028 = $1027;
       HEAP32[$1028>>2] = $1024;
       $1029 = (($1027) + 4)|0;
       $1030 = $1029;
       HEAP32[$1030>>2] = $1026;
       break L531;
       break;
      }
      case 16:  {
       $arglist_current56 = HEAP32[$ap>>2]|0;
       $1031 = HEAP32[$arglist_current56>>2]|0;
       $arglist_next57 = (($arglist_current56) + 4|0);
       HEAP32[$ap>>2] = $arglist_next57;
       $$mask$i = $1031 & 255;
       $1032 = $983;
       $1033 = $1032;
       HEAP32[$1033>>2] = $$mask$i;
       $1034 = (($1032) + 4)|0;
       $1035 = $1034;
       HEAP32[$1035>>2] = 0;
       break L531;
       break;
      }
      case 17:  {
       $arglist_current59 = HEAP32[$ap>>2]|0;
       HEAP32[tempDoublePtr>>2]=HEAP32[$arglist_current59>>2];HEAP32[tempDoublePtr+4>>2]=HEAP32[$arglist_current59+4>>2];$1036 = +HEAPF64[tempDoublePtr>>3];
       $arglist_next60 = (($arglist_current59) + 8|0);
       HEAP32[$ap>>2] = $arglist_next60;
       HEAPF64[$983>>3] = $1036;
       break L531;
       break;
      }
      case 18:  {
       $arglist_current62 = HEAP32[$ap>>2]|0;
       HEAP32[tempDoublePtr>>2]=HEAP32[$arglist_current62>>2];HEAP32[tempDoublePtr+4>>2]=HEAP32[$arglist_current62+4>>2];$1037 = +HEAPF64[tempDoublePtr>>3];
       $arglist_next63 = (($arglist_current62) + 8|0);
       HEAP32[$ap>>2] = $arglist_next63;
       HEAPF64[$983>>3] = $1037;
       break L531;
       break;
      }
      case 9:  {
       $arglist_current35 = HEAP32[$ap>>2]|0;
       $985 = HEAP32[$arglist_current35>>2]|0;
       $arglist_next36 = (($arglist_current35) + 4|0);
       HEAP32[$ap>>2] = $arglist_next36;
       HEAP32[$983>>2] = $985;
       break L531;
       break;
      }
      case 10:  {
       $arglist_current38 = HEAP32[$ap>>2]|0;
       $986 = HEAP32[$arglist_current38>>2]|0;
       $arglist_next39 = (($arglist_current38) + 4|0);
       HEAP32[$ap>>2] = $arglist_next39;
       $987 = ($986|0)<(0);
       $988 = $987 << 31 >> 31;
       $989 = $983;
       $990 = $989;
       HEAP32[$990>>2] = $986;
       $991 = (($989) + 4)|0;
       $992 = $991;
       HEAP32[$992>>2] = $988;
       break L531;
       break;
      }
      case 12:  {
       $arglist_current44 = HEAP32[$ap>>2]|0;
       $998 = $arglist_current44;
       $999 = $998;
       $1000 = HEAP32[$999>>2]|0;
       $1001 = (($998) + 4)|0;
       $1002 = $1001;
       $1003 = HEAP32[$1002>>2]|0;
       $arglist_next45 = (($arglist_current44) + 8|0);
       HEAP32[$ap>>2] = $arglist_next45;
       $1004 = $983;
       $1005 = $1004;
       HEAP32[$1005>>2] = $1000;
       $1006 = (($1004) + 4)|0;
       $1007 = $1006;
       HEAP32[$1007>>2] = $1003;
       break L531;
       break;
      }
      default: {
       break L531;
      }
      }
     } while(0);
    }
   } while(0);
   $1038 = (($i$289) + 1)|0;
   $1039 = ($1038|0)<(10);
   if ($1039) {
    $i$289 = $1038;
   } else {
    $$0 = 1;
    label = 362;
    break;
   }
  }
  if ((label|0) == 362) {
   STACKTOP = sp;return ($$0|0);
  }
  while(1) {
   $1042 = (($nl_type) + ($i$388<<2)|0);
   $1043 = HEAP32[$1042>>2]|0;
   $1044 = ($1043|0)==(0);
   $1041 = (($i$388) + 1)|0;
   if (!($1044)) {
    $$0 = -1;
    label = 362;
    break;
   }
   $1040 = ($1041|0)<(10);
   if ($1040) {
    $i$388 = $1041;
   } else {
    $$0 = 1;
    label = 362;
    break;
   }
  }
  if ((label|0) == 362) {
   STACKTOP = sp;return ($$0|0);
  }
 }
 else if ((label|0) == 362) {
  STACKTOP = sp;return ($$0|0);
 }
 return 0|0;
}
function _vsnprintf($s,$n,$fmt,$ap) {
 $s = $s|0;
 $n = $n|0;
 $fmt = $fmt|0;
 $ap = $ap|0;
 var $$$02 = 0, $$0 = 0, $$01 = 0, $$02 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0;
 var $6 = 0, $7 = 0, $8 = 0, $9 = 0, $b = 0, $f = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $b = sp + 112|0;
 $f = sp;
 dest=$f+0|0; src=3392+0|0; stop=dest+112|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 $0 = (($n) + -1)|0;
 $1 = ($0>>>0)>(2147483646);
 if ($1) {
  $2 = ($n|0)==(0);
  if ($2) {
   $$01 = $b;$$02 = 1;
  } else {
   $3 = (___errno_location()|0);
   HEAP32[$3>>2] = 75;
   $$0 = -1;
   STACKTOP = sp;return ($$0|0);
  }
 } else {
  $$01 = $s;$$02 = $n;
 }
 $4 = $$01;
 $5 = (-2 - ($4))|0;
 $6 = ($$02>>>0)>($5>>>0);
 $$$02 = $6 ? $5 : $$02;
 $7 = (($f) + 48|0);
 HEAP32[$7>>2] = $$$02;
 $8 = (($f) + 20|0);
 HEAP32[$8>>2] = $$01;
 $9 = (($f) + 44|0);
 HEAP32[$9>>2] = $$01;
 $10 = (($$01) + ($$$02)|0);
 $11 = (($f) + 16|0);
 HEAP32[$11>>2] = $10;
 $12 = (($f) + 28|0);
 HEAP32[$12>>2] = $10;
 $13 = (_MUSL_vfprintf($f,$fmt,$ap)|0);
 $14 = ($$$02|0)==(0);
 if ($14) {
  $$0 = $13;
  STACKTOP = sp;return ($$0|0);
 }
 $15 = HEAP32[$8>>2]|0;
 $16 = HEAP32[$11>>2]|0;
 $17 = ($15|0)==($16|0);
 $18 = $17 << 31 >> 31;
 $19 = (($15) + ($18)|0);
 HEAP8[$19>>0] = 0;
 $$0 = $13;
 STACKTOP = sp;return ($$0|0);
}
function _sn_write($f,$s,$l) {
 $f = $f|0;
 $s = $s|0;
 $l = $l|0;
 var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $l$ = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (($f) + 16|0);
 $1 = HEAP32[$0>>2]|0;
 $2 = (($f) + 20|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = $1;
 $5 = $3;
 $6 = (($4) - ($5))|0;
 $7 = ($6>>>0)>($l>>>0);
 $l$ = $7 ? $l : $6;
 _memcpy(($3|0),($s|0),($l$|0))|0;
 $8 = HEAP32[$2>>2]|0;
 $9 = (($8) + ($l$)|0);
 HEAP32[$2>>2] = $9;
 STACKTOP = sp;return ($l|0);
}
function _vsprintf($s,$fmt,$ap) {
 $s = $s|0;
 $fmt = $fmt|0;
 $ap = $ap|0;
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (_vsnprintf($s,2147483647,$fmt,$ap)|0);
 STACKTOP = sp;return ($0|0);
}
function _atof($s) {
 $s = $s|0;
 var $0 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (+_strtod($s,0));
 STACKTOP = sp;return (+$0);
}
function _atoi($s) {
 $s = $s|0;
 var $$0 = 0, $$1$ph = 0, $$12 = 0, $$neg1 = 0, $$pre = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $n$0$lcssa = 0, $n$03 = 0, $neg$0 = 0, $neg$1$ph = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $$0 = $s;
 while(1) {
  $0 = HEAP8[$$0>>0]|0;
  $1 = $0 << 24 >> 24;
  $2 = (_isspace($1)|0);
  $3 = ($2|0)==(0);
  $4 = (($$0) + 1|0);
  if ($3) {
   break;
  } else {
   $$0 = $4;
  }
 }
 $5 = HEAP8[$$0>>0]|0;
 $6 = $5 << 24 >> 24;
 if ((($6|0) == 45)) {
  $neg$0 = 1;
  label = 5;
 } else if ((($6|0) == 43)) {
  $neg$0 = 0;
  label = 5;
 } else {
  $$1$ph = $$0;$8 = $5;$neg$1$ph = 0;
 }
 if ((label|0) == 5) {
  $$pre = HEAP8[$4>>0]|0;
  $$1$ph = $4;$8 = $$pre;$neg$1$ph = $neg$0;
 }
 $7 = $8 << 24 >> 24;
 $9 = (_isdigit($7)|0);
 $10 = ($9|0)==(0);
 if ($10) {
  $n$0$lcssa = 0;
  $20 = ($neg$1$ph|0)!=(0);
  $21 = (0 - ($n$0$lcssa))|0;
  $22 = $20 ? $n$0$lcssa : $21;
  STACKTOP = sp;return ($22|0);
 } else {
  $$12 = $$1$ph;$n$03 = 0;
 }
 while(1) {
  $11 = ($n$03*10)|0;
  $12 = (($$12) + 1|0);
  $13 = HEAP8[$$12>>0]|0;
  $14 = $13 << 24 >> 24;
  $$neg1 = (($11) + 48)|0;
  $15 = (($$neg1) - ($14))|0;
  $16 = HEAP8[$12>>0]|0;
  $17 = $16 << 24 >> 24;
  $18 = (_isdigit($17)|0);
  $19 = ($18|0)==(0);
  if ($19) {
   $n$0$lcssa = $15;
   break;
  } else {
   $$12 = $12;$n$03 = $15;
  }
 }
 $20 = ($neg$1$ph|0)!=(0);
 $21 = (0 - ($n$0$lcssa))|0;
 $22 = $20 ? $n$0$lcssa : $21;
 STACKTOP = sp;return ($22|0);
}
function _strtod($s,$p) {
 $s = $s|0;
 $p = $p|0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0.0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $f$i = 0, dest = 0, label = 0;
 var sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 112|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abort();
 $f$i = sp;
 dest=$f$i+0|0; stop=dest+112|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $0 = (($f$i) + 4|0);
 HEAP32[$0>>2] = $s;
 $1 = (($f$i) + 8|0);
 HEAP32[$1>>2] = (-1);
 $2 = (($f$i) + 44|0);
 HEAP32[$2>>2] = $s;
 $3 = (($f$i) + 76|0);
 HEAP32[$3>>2] = -1;
 ___shlim($f$i,0);
 $4 = (+___floatscan($f$i,1,1));
 $5 = (($f$i) + 108|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = HEAP32[$0>>2]|0;
 $8 = HEAP32[$1>>2]|0;
 $9 = $7;
 $10 = $8;
 $11 = (($9) - ($10))|0;
 $12 = (($11) + ($6))|0;
 $13 = ($p|0)==(0|0);
 if ($13) {
  STACKTOP = sp;return (+$4);
 }
 $14 = ($12|0)==(0);
 if ($14) {
  $16 = $s;
 } else {
  $15 = (($s) + ($12)|0);
  $16 = $15;
 }
 HEAP32[$p>>2] = $16;
 STACKTOP = sp;return (+$4);
}
function _memchr($src,$c,$n) {
 $src = $src|0;
 $c = $c|0;
 $n = $n|0;
 var $$0$lcssa = 0, $$0$lcssa34 = 0, $$013 = 0, $$1$lcssa = 0, $$17 = 0, $$24 = 0, $$3 = 0, $$lcssa = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0;
 var $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond12 = 0, $s$0$lcssa = 0, $s$0$lcssa33 = 0, $s$014 = 0, $s$15 = 0, $s$2 = 0, $w$0$lcssa = 0, $w$08 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = $c & 255;
 $1 = $src;
 $2 = $1 & 3;
 $3 = ($2|0)==(0);
 $4 = ($n|0)==(0);
 $or$cond12 = $3 | $4;
 L1: do {
  if ($or$cond12) {
   $$0$lcssa = $n;$$lcssa = $4;$s$0$lcssa = $src;
   label = 5;
  } else {
   $5 = $c&255;
   $$013 = $n;$s$014 = $src;
   while(1) {
    $6 = HEAP8[$s$014>>0]|0;
    $7 = ($6<<24>>24)==($5<<24>>24);
    if ($7) {
     $$0$lcssa34 = $$013;$s$0$lcssa33 = $s$014;
     label = 6;
     break L1;
    }
    $8 = (($s$014) + 1|0);
    $9 = (($$013) + -1)|0;
    $10 = $8;
    $11 = $10 & 3;
    $12 = ($11|0)==(0);
    $13 = ($9|0)==(0);
    $or$cond = $12 | $13;
    if ($or$cond) {
     $$0$lcssa = $9;$$lcssa = $13;$s$0$lcssa = $8;
     label = 5;
     break;
    } else {
     $$013 = $9;$s$014 = $8;
    }
   }
  }
 } while(0);
 if ((label|0) == 5) {
  if ($$lcssa) {
   $$3 = 0;$s$2 = $s$0$lcssa;
  } else {
   $$0$lcssa34 = $$0$lcssa;$s$0$lcssa33 = $s$0$lcssa;
   label = 6;
  }
 }
 L8: do {
  if ((label|0) == 6) {
   $14 = HEAP8[$s$0$lcssa33>>0]|0;
   $15 = $c&255;
   $16 = ($14<<24>>24)==($15<<24>>24);
   if ($16) {
    $$3 = $$0$lcssa34;$s$2 = $s$0$lcssa33;
   } else {
    $17 = Math_imul($0, 16843009)|0;
    $18 = ($$0$lcssa34>>>0)>(3);
    L11: do {
     if ($18) {
      $$17 = $$0$lcssa34;$w$08 = $s$0$lcssa33;
      while(1) {
       $19 = HEAP32[$w$08>>2]|0;
       $20 = $19 ^ $17;
       $21 = (($20) + -16843009)|0;
       $22 = $20 & -2139062144;
       $23 = $22 ^ -2139062144;
       $24 = $23 & $21;
       $25 = ($24|0)==(0);
       if (!($25)) {
        $$1$lcssa = $$17;$w$0$lcssa = $w$08;
        break L11;
       }
       $26 = (($w$08) + 4|0);
       $27 = (($$17) + -4)|0;
       $28 = ($27>>>0)>(3);
       if ($28) {
        $$17 = $27;$w$08 = $26;
       } else {
        $$1$lcssa = $27;$w$0$lcssa = $26;
        break;
       }
      }
     } else {
      $$1$lcssa = $$0$lcssa34;$w$0$lcssa = $s$0$lcssa33;
     }
    } while(0);
    $29 = ($$1$lcssa|0)==(0);
    if ($29) {
     $$3 = 0;$s$2 = $w$0$lcssa;
    } else {
     $$24 = $$1$lcssa;$s$15 = $w$0$lcssa;
     while(1) {
      $30 = HEAP8[$s$15>>0]|0;
      $31 = ($30<<24>>24)==($15<<24>>24);
      if ($31) {
       $$3 = $$24;$s$2 = $s$15;
       break L8;
      }
      $32 = (($s$15) + 1|0);
      $33 = (($$24) + -1)|0;
      $34 = ($33|0)==(0);
      if ($34) {
       $$3 = 0;$s$2 = $32;
       break;
      } else {
       $$24 = $33;$s$15 = $32;
      }
     }
    }
   }
  }
 } while(0);
 $35 = ($$3|0)!=(0);
 $36 = $35 ? $s$2 : 0;
 STACKTOP = sp;return ($36|0);
}
function _strcmp($l,$r) {
 $l = $l|0;
 $r = $r|0;
 var $$014 = 0, $$05 = 0, $$lcssa = 0, $$lcssa2 = 0, $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond3 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $0 = HEAP8[$l>>0]|0;
 $1 = HEAP8[$r>>0]|0;
 $2 = ($0<<24>>24)!=($1<<24>>24);
 $3 = ($0<<24>>24)==(0);
 $or$cond3 = $2 | $3;
 if ($or$cond3) {
  $$lcssa = $0;$$lcssa2 = $1;
 } else {
  $$014 = $l;$$05 = $r;
  while(1) {
   $4 = (($$014) + 1|0);
   $5 = (($$05) + 1|0);
   $6 = HEAP8[$4>>0]|0;
   $7 = HEAP8[$5>>0]|0;
   $8 = ($6<<24>>24)!=($7<<24>>24);
   $9 = ($6<<24>>24)==(0);
   $or$cond = $8 | $9;
   if ($or$cond) {
    $$lcssa = $6;$$lcssa2 = $7;
    break;
   } else {
    $$014 = $4;$$05 = $5;
   }
  }
 }
 $10 = $$lcssa&255;
 $11 = $$lcssa2&255;
 $12 = (($10) - ($11))|0;
 STACKTOP = sp;return ($12|0);
}
function runPostSets() {
 
}
function _i64Subtract(a, b, c, d) {
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a - c)>>>0;
    h = (b - d)>>>0;
    h = (b - d - (((c>>>0) > (a>>>0))|0))>>>0; // Borrow one from high word to low word on underflow.
    return ((tempRet0 = h,l|0)|0);
}
function _i64Add(a, b, c, d) {
    /*
      x = a + b*2^32
      y = c + d*2^32
      result = l + h*2^32
    */
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a + c)>>>0;
    h = (b + d + (((l>>>0) < (a>>>0))|0))>>>0; // Add carry from low word to high word on overflow.
    return ((tempRet0 = h,l|0)|0);
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
function _bitshift64Lshr(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      tempRet0 = high >>> bits;
      return (low >>> bits) | ((high&ander) << (32 - bits));
    }
    tempRet0 = 0;
    return (high >>> (bits - 32))|0;
}
function _bitshift64Shl(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      tempRet0 = (high << bits) | ((low&(ander << (32 - bits))) >>> (32 - bits));
      return low << bits;
    }
    tempRet0 = low << (bits - 32);
    return 0;
}
function _bitshift64Ashr(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      tempRet0 = high >> bits;
      return (low >>> bits) | ((high&ander) << (32 - bits));
    }
    tempRet0 = (high|0) < 0 ? -1 : 0;
    return (high >> (bits - 32))|0;
  }
function _llvm_ctlz_i32(x) {
    x = x|0;
    var ret = 0;
    ret = ((HEAP8[(((ctlz_i8)+(x >>> 24))>>0)])|0);
    if ((ret|0) < 8) return ret|0;
    ret = ((HEAP8[(((ctlz_i8)+((x >> 16)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 8)|0;
    ret = ((HEAP8[(((ctlz_i8)+((x >> 8)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 16)|0;
    return (((HEAP8[(((ctlz_i8)+(x&0xff))>>0)])|0) + 24)|0;
  }

function _llvm_cttz_i32(x) {
    x = x|0;
    var ret = 0;
    ret = ((HEAP8[(((cttz_i8)+(x & 0xff))>>0)])|0);
    if ((ret|0) < 8) return ret|0;
    ret = ((HEAP8[(((cttz_i8)+((x >> 8)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 8)|0;
    ret = ((HEAP8[(((cttz_i8)+((x >> 16)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 16)|0;
    return (((HEAP8[(((cttz_i8)+(x >>> 24))>>0)])|0) + 24)|0;
  }

// ======== compiled code from system/lib/compiler-rt , see readme therein
function ___muldsi3($a, $b) {
  $a = $a | 0;
  $b = $b | 0;
  var $1 = 0, $2 = 0, $3 = 0, $6 = 0, $8 = 0, $11 = 0, $12 = 0;
  $1 = $a & 65535;
  $2 = $b & 65535;
  $3 = Math_imul($2, $1) | 0;
  $6 = $a >>> 16;
  $8 = ($3 >>> 16) + (Math_imul($2, $6) | 0) | 0;
  $11 = $b >>> 16;
  $12 = Math_imul($11, $1) | 0;
  return (tempRet0 = (($8 >>> 16) + (Math_imul($11, $6) | 0) | 0) + ((($8 & 65535) + $12 | 0) >>> 16) | 0, 0 | ($8 + $12 << 16 | $3 & 65535)) | 0;
}
function ___divdi3($a$0, $a$1, $b$0, $b$1) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  var $1$0 = 0, $1$1 = 0, $2$0 = 0, $2$1 = 0, $4$0 = 0, $4$1 = 0, $6$0 = 0, $7$0 = 0, $7$1 = 0, $8$0 = 0, $10$0 = 0;
  $1$0 = $a$1 >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
  $1$1 = (($a$1 | 0) < 0 ? -1 : 0) >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
  $2$0 = $b$1 >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
  $2$1 = (($b$1 | 0) < 0 ? -1 : 0) >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
  $4$0 = _i64Subtract($1$0 ^ $a$0, $1$1 ^ $a$1, $1$0, $1$1) | 0;
  $4$1 = tempRet0;
  $6$0 = _i64Subtract($2$0 ^ $b$0, $2$1 ^ $b$1, $2$0, $2$1) | 0;
  $7$0 = $2$0 ^ $1$0;
  $7$1 = $2$1 ^ $1$1;
  $8$0 = ___udivmoddi4($4$0, $4$1, $6$0, tempRet0, 0) | 0;
  $10$0 = _i64Subtract($8$0 ^ $7$0, tempRet0 ^ $7$1, $7$0, $7$1) | 0;
  return (tempRet0 = tempRet0, $10$0) | 0;
}
function ___remdi3($a$0, $a$1, $b$0, $b$1) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  var $rem = 0, $1$0 = 0, $1$1 = 0, $2$0 = 0, $2$1 = 0, $4$0 = 0, $4$1 = 0, $6$0 = 0, $10$0 = 0, $10$1 = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  STACKTOP = STACKTOP + 8 | 0;
  $rem = __stackBase__ | 0;
  $1$0 = $a$1 >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
  $1$1 = (($a$1 | 0) < 0 ? -1 : 0) >> 31 | (($a$1 | 0) < 0 ? -1 : 0) << 1;
  $2$0 = $b$1 >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
  $2$1 = (($b$1 | 0) < 0 ? -1 : 0) >> 31 | (($b$1 | 0) < 0 ? -1 : 0) << 1;
  $4$0 = _i64Subtract($1$0 ^ $a$0, $1$1 ^ $a$1, $1$0, $1$1) | 0;
  $4$1 = tempRet0;
  $6$0 = _i64Subtract($2$0 ^ $b$0, $2$1 ^ $b$1, $2$0, $2$1) | 0;
  ___udivmoddi4($4$0, $4$1, $6$0, tempRet0, $rem) | 0;
  $10$0 = _i64Subtract(HEAP32[$rem >> 2] ^ $1$0, HEAP32[$rem + 4 >> 2] ^ $1$1, $1$0, $1$1) | 0;
  $10$1 = tempRet0;
  STACKTOP = __stackBase__;
  return (tempRet0 = $10$1, $10$0) | 0;
}
function ___muldi3($a$0, $a$1, $b$0, $b$1) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  var $x_sroa_0_0_extract_trunc = 0, $y_sroa_0_0_extract_trunc = 0, $1$0 = 0, $1$1 = 0, $2 = 0;
  $x_sroa_0_0_extract_trunc = $a$0;
  $y_sroa_0_0_extract_trunc = $b$0;
  $1$0 = ___muldsi3($x_sroa_0_0_extract_trunc, $y_sroa_0_0_extract_trunc) | 0;
  $1$1 = tempRet0;
  $2 = Math_imul($a$1, $y_sroa_0_0_extract_trunc) | 0;
  return (tempRet0 = ((Math_imul($b$1, $x_sroa_0_0_extract_trunc) | 0) + $2 | 0) + $1$1 | $1$1 & 0, 0 | $1$0 & -1) | 0;
}
function ___udivdi3($a$0, $a$1, $b$0, $b$1) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  var $1$0 = 0;
  $1$0 = ___udivmoddi4($a$0, $a$1, $b$0, $b$1, 0) | 0;
  return (tempRet0 = tempRet0, $1$0) | 0;
}
function ___uremdi3($a$0, $a$1, $b$0, $b$1) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  var $rem = 0, __stackBase__ = 0;
  __stackBase__ = STACKTOP;
  STACKTOP = STACKTOP + 8 | 0;
  $rem = __stackBase__ | 0;
  ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) | 0;
  STACKTOP = __stackBase__;
  return (tempRet0 = HEAP32[$rem + 4 >> 2] | 0, HEAP32[$rem >> 2] | 0) | 0;
}
function ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) {
  $a$0 = $a$0 | 0;
  $a$1 = $a$1 | 0;
  $b$0 = $b$0 | 0;
  $b$1 = $b$1 | 0;
  $rem = $rem | 0;
  var $n_sroa_0_0_extract_trunc = 0, $n_sroa_1_4_extract_shift$0 = 0, $n_sroa_1_4_extract_trunc = 0, $d_sroa_0_0_extract_trunc = 0, $d_sroa_1_4_extract_shift$0 = 0, $d_sroa_1_4_extract_trunc = 0, $4 = 0, $17 = 0, $37 = 0, $49 = 0, $51 = 0, $57 = 0, $58 = 0, $66 = 0, $78 = 0, $86 = 0, $88 = 0, $89 = 0, $91 = 0, $92 = 0, $95 = 0, $105 = 0, $117 = 0, $119 = 0, $125 = 0, $126 = 0, $130 = 0, $q_sroa_1_1_ph = 0, $q_sroa_0_1_ph = 0, $r_sroa_1_1_ph = 0, $r_sroa_0_1_ph = 0, $sr_1_ph = 0, $d_sroa_0_0_insert_insert99$0 = 0, $d_sroa_0_0_insert_insert99$1 = 0, $137$0 = 0, $137$1 = 0, $carry_0203 = 0, $sr_1202 = 0, $r_sroa_0_1201 = 0, $r_sroa_1_1200 = 0, $q_sroa_0_1199 = 0, $q_sroa_1_1198 = 0, $147 = 0, $149 = 0, $r_sroa_0_0_insert_insert42$0 = 0, $r_sroa_0_0_insert_insert42$1 = 0, $150$1 = 0, $151$0 = 0, $152 = 0, $154$0 = 0, $r_sroa_0_0_extract_trunc = 0, $r_sroa_1_4_extract_trunc = 0, $155 = 0, $carry_0_lcssa$0 = 0, $carry_0_lcssa$1 = 0, $r_sroa_0_1_lcssa = 0, $r_sroa_1_1_lcssa = 0, $q_sroa_0_1_lcssa = 0, $q_sroa_1_1_lcssa = 0, $q_sroa_0_0_insert_ext75$0 = 0, $q_sroa_0_0_insert_ext75$1 = 0, $q_sroa_0_0_insert_insert77$1 = 0, $_0$0 = 0, $_0$1 = 0;
  $n_sroa_0_0_extract_trunc = $a$0;
  $n_sroa_1_4_extract_shift$0 = $a$1;
  $n_sroa_1_4_extract_trunc = $n_sroa_1_4_extract_shift$0;
  $d_sroa_0_0_extract_trunc = $b$0;
  $d_sroa_1_4_extract_shift$0 = $b$1;
  $d_sroa_1_4_extract_trunc = $d_sroa_1_4_extract_shift$0;
  if (($n_sroa_1_4_extract_trunc | 0) == 0) {
    $4 = ($rem | 0) != 0;
    if (($d_sroa_1_4_extract_trunc | 0) == 0) {
      if ($4) {
        HEAP32[$rem >> 2] = ($n_sroa_0_0_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
        HEAP32[$rem + 4 >> 2] = 0;
      }
      $_0$1 = 0;
      $_0$0 = ($n_sroa_0_0_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
      return (tempRet0 = $_0$1, $_0$0) | 0;
    } else {
      if (!$4) {
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      HEAP32[$rem >> 2] = $a$0 & -1;
      HEAP32[$rem + 4 >> 2] = $a$1 & 0;
      $_0$1 = 0;
      $_0$0 = 0;
      return (tempRet0 = $_0$1, $_0$0) | 0;
    }
  }
  $17 = ($d_sroa_1_4_extract_trunc | 0) == 0;
  do {
    if (($d_sroa_0_0_extract_trunc | 0) == 0) {
      if ($17) {
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
          HEAP32[$rem + 4 >> 2] = 0;
        }
        $_0$1 = 0;
        $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      if (($n_sroa_0_0_extract_trunc | 0) == 0) {
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = 0;
          HEAP32[$rem + 4 >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_1_4_extract_trunc >>> 0);
        }
        $_0$1 = 0;
        $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_1_4_extract_trunc >>> 0) >>> 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      $37 = $d_sroa_1_4_extract_trunc - 1 | 0;
      if (($37 & $d_sroa_1_4_extract_trunc | 0) == 0) {
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = 0 | $a$0 & -1;
          HEAP32[$rem + 4 >> 2] = $37 & $n_sroa_1_4_extract_trunc | $a$1 & 0;
        }
        $_0$1 = 0;
        $_0$0 = $n_sroa_1_4_extract_trunc >>> ((_llvm_cttz_i32($d_sroa_1_4_extract_trunc | 0) | 0) >>> 0);
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      $49 = _llvm_ctlz_i32($d_sroa_1_4_extract_trunc | 0) | 0;
      $51 = $49 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
      if ($51 >>> 0 <= 30) {
        $57 = $51 + 1 | 0;
        $58 = 31 - $51 | 0;
        $sr_1_ph = $57;
        $r_sroa_0_1_ph = $n_sroa_1_4_extract_trunc << $58 | $n_sroa_0_0_extract_trunc >>> ($57 >>> 0);
        $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($57 >>> 0);
        $q_sroa_0_1_ph = 0;
        $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $58;
        break;
      }
      if (($rem | 0) == 0) {
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      HEAP32[$rem >> 2] = 0 | $a$0 & -1;
      HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
      $_0$1 = 0;
      $_0$0 = 0;
      return (tempRet0 = $_0$1, $_0$0) | 0;
    } else {
      if (!$17) {
        $117 = _llvm_ctlz_i32($d_sroa_1_4_extract_trunc | 0) | 0;
        $119 = $117 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
        if ($119 >>> 0 <= 31) {
          $125 = $119 + 1 | 0;
          $126 = 31 - $119 | 0;
          $130 = $119 - 31 >> 31;
          $sr_1_ph = $125;
          $r_sroa_0_1_ph = $n_sroa_0_0_extract_trunc >>> ($125 >>> 0) & $130 | $n_sroa_1_4_extract_trunc << $126;
          $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($125 >>> 0) & $130;
          $q_sroa_0_1_ph = 0;
          $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $126;
          break;
        }
        if (($rem | 0) == 0) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = 0 | $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
      $66 = $d_sroa_0_0_extract_trunc - 1 | 0;
      if (($66 & $d_sroa_0_0_extract_trunc | 0) != 0) {
        $86 = (_llvm_ctlz_i32($d_sroa_0_0_extract_trunc | 0) | 0) + 33 | 0;
        $88 = $86 - (_llvm_ctlz_i32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
        $89 = 64 - $88 | 0;
        $91 = 32 - $88 | 0;
        $92 = $91 >> 31;
        $95 = $88 - 32 | 0;
        $105 = $95 >> 31;
        $sr_1_ph = $88;
        $r_sroa_0_1_ph = $91 - 1 >> 31 & $n_sroa_1_4_extract_trunc >>> ($95 >>> 0) | ($n_sroa_1_4_extract_trunc << $91 | $n_sroa_0_0_extract_trunc >>> ($88 >>> 0)) & $105;
        $r_sroa_1_1_ph = $105 & $n_sroa_1_4_extract_trunc >>> ($88 >>> 0);
        $q_sroa_0_1_ph = $n_sroa_0_0_extract_trunc << $89 & $92;
        $q_sroa_1_1_ph = ($n_sroa_1_4_extract_trunc << $89 | $n_sroa_0_0_extract_trunc >>> ($95 >>> 0)) & $92 | $n_sroa_0_0_extract_trunc << $91 & $88 - 33 >> 31;
        break;
      }
      if (($rem | 0) != 0) {
        HEAP32[$rem >> 2] = $66 & $n_sroa_0_0_extract_trunc;
        HEAP32[$rem + 4 >> 2] = 0;
      }
      if (($d_sroa_0_0_extract_trunc | 0) == 1) {
        $_0$1 = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
        $_0$0 = 0 | $a$0 & -1;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      } else {
        $78 = _llvm_cttz_i32($d_sroa_0_0_extract_trunc | 0) | 0;
        $_0$1 = 0 | $n_sroa_1_4_extract_trunc >>> ($78 >>> 0);
        $_0$0 = $n_sroa_1_4_extract_trunc << 32 - $78 | $n_sroa_0_0_extract_trunc >>> ($78 >>> 0) | 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
    }
  } while (0);
  if (($sr_1_ph | 0) == 0) {
    $q_sroa_1_1_lcssa = $q_sroa_1_1_ph;
    $q_sroa_0_1_lcssa = $q_sroa_0_1_ph;
    $r_sroa_1_1_lcssa = $r_sroa_1_1_ph;
    $r_sroa_0_1_lcssa = $r_sroa_0_1_ph;
    $carry_0_lcssa$1 = 0;
    $carry_0_lcssa$0 = 0;
  } else {
    $d_sroa_0_0_insert_insert99$0 = 0 | $b$0 & -1;
    $d_sroa_0_0_insert_insert99$1 = $d_sroa_1_4_extract_shift$0 | $b$1 & 0;
    $137$0 = _i64Add($d_sroa_0_0_insert_insert99$0, $d_sroa_0_0_insert_insert99$1, -1, -1) | 0;
    $137$1 = tempRet0;
    $q_sroa_1_1198 = $q_sroa_1_1_ph;
    $q_sroa_0_1199 = $q_sroa_0_1_ph;
    $r_sroa_1_1200 = $r_sroa_1_1_ph;
    $r_sroa_0_1201 = $r_sroa_0_1_ph;
    $sr_1202 = $sr_1_ph;
    $carry_0203 = 0;
    while (1) {
      $147 = $q_sroa_0_1199 >>> 31 | $q_sroa_1_1198 << 1;
      $149 = $carry_0203 | $q_sroa_0_1199 << 1;
      $r_sroa_0_0_insert_insert42$0 = 0 | ($r_sroa_0_1201 << 1 | $q_sroa_1_1198 >>> 31);
      $r_sroa_0_0_insert_insert42$1 = $r_sroa_0_1201 >>> 31 | $r_sroa_1_1200 << 1 | 0;
      _i64Subtract($137$0, $137$1, $r_sroa_0_0_insert_insert42$0, $r_sroa_0_0_insert_insert42$1) | 0;
      $150$1 = tempRet0;
      $151$0 = $150$1 >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1;
      $152 = $151$0 & 1;
      $154$0 = _i64Subtract($r_sroa_0_0_insert_insert42$0, $r_sroa_0_0_insert_insert42$1, $151$0 & $d_sroa_0_0_insert_insert99$0, ((($150$1 | 0) < 0 ? -1 : 0) >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1) & $d_sroa_0_0_insert_insert99$1) | 0;
      $r_sroa_0_0_extract_trunc = $154$0;
      $r_sroa_1_4_extract_trunc = tempRet0;
      $155 = $sr_1202 - 1 | 0;
      if (($155 | 0) == 0) {
        break;
      } else {
        $q_sroa_1_1198 = $147;
        $q_sroa_0_1199 = $149;
        $r_sroa_1_1200 = $r_sroa_1_4_extract_trunc;
        $r_sroa_0_1201 = $r_sroa_0_0_extract_trunc;
        $sr_1202 = $155;
        $carry_0203 = $152;
      }
    }
    $q_sroa_1_1_lcssa = $147;
    $q_sroa_0_1_lcssa = $149;
    $r_sroa_1_1_lcssa = $r_sroa_1_4_extract_trunc;
    $r_sroa_0_1_lcssa = $r_sroa_0_0_extract_trunc;
    $carry_0_lcssa$1 = 0;
    $carry_0_lcssa$0 = $152;
  }
  $q_sroa_0_0_insert_ext75$0 = $q_sroa_0_1_lcssa;
  $q_sroa_0_0_insert_ext75$1 = 0;
  $q_sroa_0_0_insert_insert77$1 = $q_sroa_1_1_lcssa | $q_sroa_0_0_insert_ext75$1;
  if (($rem | 0) != 0) {
    HEAP32[$rem >> 2] = 0 | $r_sroa_0_1_lcssa;
    HEAP32[$rem + 4 >> 2] = $r_sroa_1_1_lcssa | 0;
  }
  $_0$1 = (0 | $q_sroa_0_0_insert_ext75$0) >>> 31 | $q_sroa_0_0_insert_insert77$1 << 1 | ($q_sroa_0_0_insert_ext75$1 << 1 | $q_sroa_0_0_insert_ext75$0 >>> 31) & 0 | $carry_0_lcssa$1;
  $_0$0 = ($q_sroa_0_0_insert_ext75$0 << 1 | 0 >>> 31) & -2 | $carry_0_lcssa$0;
  return (tempRet0 = $_0$1, $_0$0) | 0;
}
// =======================================================================



// EMSCRIPTEN_END_FUNCS

  
  function dynCall_viddd(index,a1,a2,a3,a4) {
    index = index|0;
    a1=a1|0; a2=+a2; a3=+a3; a4=+a4;
    FUNCTION_TABLE_viddd[index&31](a1|0,+a2,+a3,+a4);
  }


  function dynCall_iiii(index,a1,a2,a3) {
    index = index|0;
    a1=a1|0; a2=a2|0; a3=a3|0;
    return FUNCTION_TABLE_iiii[index&31](a1|0,a2|0,a3|0)|0;
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


  function dynCall_viii(index,a1,a2,a3) {
    index = index|0;
    a1=a1|0; a2=a2|0; a3=a3|0;
    FUNCTION_TABLE_viii[index&31](a1|0,a2|0,a3|0);
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
  function b6(p0,p1,p2) { p0 = p0|0;p1 = p1|0;p2 = p2|0; nullFunc_viii(6); }
  function b7() { ; nullFunc_v(7); }
  function b8(p0,p1,p2,p3,p4,p5) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0;p5 = p5|0; nullFunc_viiiiii(8); }
  function b9(p0,p1,p2,p3) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; nullFunc_viiii(9); }
  function _glBufferData__wrapper(p0,p1,p2,p3) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0; _glBufferData(p0|0,p1|0,p2|0,p3|0); }
  // EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_viddd = [b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,__ZN9REMVectorC2Efff,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0,b0
  ,b0,b0,b0];
  var FUNCTION_TABLE_iiii = [b1,b1,b1,b1,b1,b1,b1,b1,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv,b1,b1,b1,b1,b1,b1,b1,_sn_write,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1,b1
  ,b1,b1,b1];
  var FUNCTION_TABLE_viiiii = [b2,b2,b2,b2,b2,b2,b2,b2,b2,b2,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b2,b2,b2,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b2];
  var FUNCTION_TABLE_vi = [b3,__ZNSt9bad_allocD2Ev,__ZNSt9bad_allocD0Ev,b3,__ZN10__cxxabiv116__shim_type_infoD2Ev,__ZN10__cxxabiv117__class_type_infoD0Ev,__ZNK10__cxxabiv116__shim_type_info5noop1Ev,__ZNK10__cxxabiv116__shim_type_info5noop2Ev,b3,b3,b3,b3,__ZN10__cxxabiv120__si_class_type_infoD0Ev,b3,b3,b3,b3,b3,__ZN9REMMatrixC2Ev,__ZN15REMRenderDeviceC2Ev,b3,b3,__ZN14REMSkinManagerC2Ev,b3,b3,b3,b3,b3,b3
  ,b3,b3,b3];
  var FUNCTION_TABLE_vii = [b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,b4,__ZN16REMShaderManagerC2EP15REMRenderDevice,b4,__ZN15REMLightManagerC2EP15REMRenderDevice,b4,_glGenBuffers__wrapper,_glBindBuffer__wrapper,b4,b4,b4];
  var FUNCTION_TABLE_ii = [b5,b5,b5,__ZNKSt9bad_alloc4whatEv,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,b5,__ZN15REMRenderDevice14getSkinManagerEv,b5,b5
  ,b5,b5,b5];
  var FUNCTION_TABLE_viii = [b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,b6,__ZN14REMSimpleModelC2EP15REMRenderDevice14REMVERTEX_TYPE,b6,b6,b6,b6,b6,b6,b6,b6
  ,b6,b6,b6];
  var FUNCTION_TABLE_v = [b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,b7,__Z9web_framev,b7,b7,b7,b7,b7,b7,b7
  ,b7,b7,b7];
  var FUNCTION_TABLE_viiiiii = [b8,b8,b8,b8,b8,b8,b8,b8,b8,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b8,b8,b8,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b8,b8];
  var FUNCTION_TABLE_viiii = [b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,b9,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b9,b9,b9,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b9,b9,b9,b9,b9,b9,b9,b9,__ZN21REMVertexCacheManagerC2EP15REMRenderDevicejj,b9,b9,b9,b9
  ,_glBufferData__wrapper,b9,b9];

  return { _i64Subtract: _i64Subtract, _free: _free, _main: _main, _realloc: _realloc, _i64Add: _i64Add, _strlen: _strlen, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, _bitshift64Lshr: _bitshift64Lshr, _calloc: _calloc, _bitshift64Shl: _bitshift64Shl, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, getTempRet0: getTempRet0, dynCall_viddd: dynCall_viddd, dynCall_iiii: dynCall_iiii, dynCall_viiiii: dynCall_viiiii, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_ii: dynCall_ii, dynCall_viii: dynCall_viii, dynCall_v: dynCall_v, dynCall_viiiiii: dynCall_viiiiii, dynCall_viiii: dynCall_viiii };
})
// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
var real__i64Subtract = asm["_i64Subtract"]; asm["_i64Subtract"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__i64Subtract.apply(null, arguments);
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

var real__i64Add = asm["_i64Add"]; asm["_i64Add"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__i64Add.apply(null, arguments);
};

var real__strlen = asm["_strlen"]; asm["_strlen"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__strlen.apply(null, arguments);
};

var real__bitshift64Lshr = asm["_bitshift64Lshr"]; asm["_bitshift64Lshr"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__bitshift64Lshr.apply(null, arguments);
};

var real__calloc = asm["_calloc"]; asm["_calloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__calloc.apply(null, arguments);
};

var real__bitshift64Shl = asm["_bitshift64Shl"]; asm["_bitshift64Shl"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__bitshift64Shl.apply(null, arguments);
};

var real_runPostSets = asm["runPostSets"]; asm["runPostSets"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_runPostSets.apply(null, arguments);
};
var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _i64Add = Module["_i64Add"] = asm["_i64Add"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_viddd = Module["dynCall_viddd"] = asm["dynCall_viddd"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];

Runtime.stackAlloc = asm['stackAlloc'];
Runtime.stackSave = asm['stackSave'];
Runtime.stackRestore = asm['stackRestore'];
Runtime.setTempRet0 = asm['setTempRet0'];
Runtime.getTempRet0 = asm['getTempRet0'];


// TODO: strip out parts of this we do not need

//======= begin closure i64 code =======

// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */

var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };


  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.

    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };


  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.


  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};


  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }

    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };


  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };


  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };


  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }

    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));

    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };


  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.


  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;


  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;


  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);


  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);


  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);


  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);


  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);


  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);


  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };


  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };


  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }

    if (this.isZero()) {
      return '0';
    }

    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));

    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);

      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };


  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };


  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };


  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };


  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };


  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };


  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };


  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };


  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };


  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }

    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }

    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };


  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };


  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };


  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }

    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;

    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };


  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }

    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }

    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }

      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }

      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };


  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };


  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };


  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };


  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };


  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };


  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };


  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };

  //======= begin jsbn =======

  var navigator = { appName: 'Modern Browser' }; // polyfill a little

  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */

  // Basic JavaScript BN library - subset useful for RSA encryption.

  // Bits per digit
  var dbits;

  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);

  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }

  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }

  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.

  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }

  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);

  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;

  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }

  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }

  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }

  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }

  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }

  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }

  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }

  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }

  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }

  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }

  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }

  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }

  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }

  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }

  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }

  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }

  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }

  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }

  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;

  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }

  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }

  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }

  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }

  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;

  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }

  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }

  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;

  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;

  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);

  // jsbn2 stuff

  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }

  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }

  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }

  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }

  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }

  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }

  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }

  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;

  //======= end jsbn =======

  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();

//======= end closure i64 code =======



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



