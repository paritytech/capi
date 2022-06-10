// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// @generated file from build script, do not edit
// deno-lint-ignore-file
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

const cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0;
function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * @param {Uint8Array} bytes
 * @returns {Pair}
 */
export function pairFromSecretSeed(bytes) {
  const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.pairFromSecretSeed(ptr0, len0);
  return Pair.__wrap(ret);
}

/**
 * @param {Uint8Array} pub_key_bytes
 * @param {Uint8Array} secret_key_bytes
 * @param {Uint8Array} message
 * @returns {Uint8Array}
 */
export function sign(pub_key_bytes, secret_key_bytes, message) {
  const ptr0 = passArray8ToWasm0(pub_key_bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passArray8ToWasm0(secret_key_bytes, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.sign(ptr0, len0, ptr1, len1, ptr2, len2);
  return takeObject(ret);
}

/**
 * @param {Uint8Array} signature
 * @param {Uint8Array} message
 * @param {Uint8Array} pub_key
 * @returns {boolean}
 */
export function verify(signature, message, pub_key) {
  const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
  const len1 = WASM_VECTOR_LEN;
  const ptr2 = passArray8ToWasm0(pub_key, wasm.__wbindgen_malloc);
  const len2 = WASM_VECTOR_LEN;
  const ret = wasm.verify(ptr0, len0, ptr1, len1, ptr2, len2);
  return ret !== 0;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

const PairFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_pair_free(ptr)
);
/** */
export class Pair {
  static __wrap(ptr) {
    const obj = Object.create(Pair.prototype);
    obj.ptr = ptr;
    PairFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PairFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_pair_free(ptr);
  }
  /**
   * @param {Uint8Array} pub_key_bytes
   * @param {Uint8Array} priv_key_bytes
   */
  constructor(pub_key_bytes, priv_key_bytes) {
    const ptr0 = passArray8ToWasm0(pub_key_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(priv_key_bytes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.pair_new(ptr0, len0, ptr1, len1);
    return Pair.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  get pubKey() {
    const ret = wasm.pair_pubKey(this.ptr);
    return takeObject(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  get secretKey() {
    const ret = wasm.pair_secretKey(this.ptr);
    return takeObject(ret);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbindgen_object_drop_ref: function (arg0) {
      takeObject(arg0);
    },
    __wbindgen_is_undefined: function (arg0) {
      const ret = getObject(arg0) === undefined;
      return ret;
    },
    __wbindgen_is_object: function (arg0) {
      const val = getObject(arg0);
      const ret = typeof (val) === "object" && val !== null;
      return ret;
    },
    __wbg_randomFillSync_378e02b85af41ab6: function () {
      return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_getRandomValues_99bbe8a65f4aef87: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_static_accessor_NODE_MODULE_bdc5ca9096c68aeb: function () {
      const ret = module;
      return addHeapObject(ret);
    },
    __wbg_process_5729605ce9d34ea8: function (arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbg_versions_531e16e1a776ee97: function (arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbg_node_18b58a160b60d170: function (arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbindgen_is_string: function (arg0) {
      const ret = typeof (getObject(arg0)) === "string";
      return ret;
    },
    __wbg_require_edfaedd93e302925: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_crypto_2bc4d5b05161de5b: function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_msCrypto_d003eebe62c636a9: function (arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_newnoargs_f579424187aa1717: function (arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function (arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbg_call_89558c3e96703ca1: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_buffer_5e74a88a1424a2e0: function (arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_self_e23d74ae45fb17d1: function () {
      return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_window_b4be7f48b24ac56e: function () {
      return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_globalThis_d61b1f48a57191ae: function () {
      return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_global_e7669da72fd7f239: function () {
      return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_newwithbyteoffsetandlength_278ec7532799393a: function (
      arg0,
      arg1,
      arg2,
    ) {
      const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_new_e3b800e570795b3c: function (arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_newwithlength_5f4ce114a24dfe1e: function (arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_subarray_a68f835ca2af506f: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_length_30803400a8f15c59: function (arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_set_5b8081e9d002f0df: function (arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbindgen_throw: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_memory: function () {
      const ret = wasm.memory;
      return addHeapObject(ret);
    },
  },
};

const wasm_url = new URL("mod_bg.wasm", import.meta.url);

/** Instantiates an instance of the Wasm module returning its functions.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 */
export async function instantiate() {
  return (await instantiateWithInstance()).exports;
}

let instanceWithExports;
let lastLoadPromise;

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @returns {Promise<{
 *   instance: WebAssembly.Instance;
 *   exports: { pairFromSecretSeed: typeof pairFromSecretSeed; sign: typeof sign; verify: typeof verify }
 * }>}
 */
export function instantiateWithInstance() {
  if (instanceWithExports != null) {
    return Promise.resolve(instanceWithExports);
  }
  if (lastLoadPromise == null) {
    lastLoadPromise = (async () => {
      try {
        const instance = (await instantiateModule()).instance;
        wasm = instance.exports;
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        instanceWithExports = {
          instance,
          exports: { pairFromSecretSeed, sign, verify },
        };
        return instanceWithExports;
      } finally {
        lastLoadPromise = null;
      }
    })();
  }
  return lastLoadPromise;
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated() {
  return instanceWithExports != null;
}

async function instantiateModule() {
  switch (wasm_url.protocol) {
    case "file:": {
      if ("permissions" in Deno) {
        Deno.permissions.request({ name: "read", path: wasm_url });
      }
      const wasmCode = await Deno.readFile(wasm_url);
      return WebAssembly.instantiate(wasmCode, imports);
    }
    case "https:":
    case "http:": {
      if ("permissions" in Deno) {
        Deno.permissions.request({ name: "net", host: wasm_url.host });
      }
      const wasmResponse = await fetch(wasm_url);
      if (
        wasmResponse.headers.get("content-type")?.toLowerCase().startsWith(
          "application/wasm",
        )
      ) {
        return WebAssembly.instantiateStreaming(wasmResponse, imports);
      } else {
        return WebAssembly.instantiate(
          await wasmResponse.arrayBuffer(),
          imports,
        );
      }
    }
    default:
      throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
  }
}
