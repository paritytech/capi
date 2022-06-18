// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// @generated file from build script, do not edit
// deno-lint-ignore-file
// source-hash: b3704ddca6847341deba7c45c64b5df2609b5592
let wasm;

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

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

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

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachedInt32Memory0;
function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
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

const cachedTextEncoder = new TextEncoder("utf-8");

const encodeString = function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
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

const KeypairFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_keypair_free(ptr)
);
/** */
export class Keypair {
  static __wrap(ptr) {
    const obj = Object.create(Keypair.prototype);
    obj.ptr = ptr;
    KeypairFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    KeypairFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_keypair_free(ptr);
  }
  /**
   * @returns {Keypair}
   */
  static rand() {
    const ret = wasm.keypair_rand();
    return Keypair.__wrap(ret);
  }
  /**
   * @returns {PublicKey}
   */
  get publicKey() {
    const ret = wasm.keypair_publicKey(this.ptr);
    return PublicKey.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  get secretKey() {
    const ret = wasm.keypair_secretKey(this.ptr);
    return takeObject(ret);
  }
}

const PublicKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_publickey_free(ptr)
);
/** */
export class PublicKey {
  static __wrap(ptr) {
    const obj = Object.create(PublicKey.prototype);
    obj.ptr = ptr;
    PublicKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PublicKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_publickey_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PublicKey}
   */
  static from(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.publickey_from(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  get bytes() {
    const ret = wasm.publickey_bytes(this.ptr);
    return takeObject(ret);
  }
  /**
   * @param {Uint8Array} secret_key_bytes
   * @returns {Signer}
   */
  signer(secret_key_bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(secret_key_bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.publickey_signer(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Signer.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} signature
   * @param {Uint8Array} message
   * @returns {boolean}
   */
  verify(signature, message) {
    const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.publickey_verify(this.ptr, ptr0, len0, ptr1, len1);
    return ret !== 0;
  }
}

const SignerFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_signer_free(ptr)
);
/** */
export class Signer {
  static __wrap(ptr) {
    const obj = Object.create(Signer.prototype);
    obj.ptr = ptr;
    SignerFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    SignerFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_signer_free(ptr);
  }
  /**
   * @param {Uint8Array} message
   * @returns {Uint8Array}
   */
  sign(message) {
    const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.signer_sign(this.ptr, ptr0, len0);
    return takeObject(ret);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbindgen_error_new: function (arg0, arg1) {
      const ret = new Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_object_drop_ref: function (arg0) {
      takeObject(arg0);
    },
    __wbg_new_693216e109162396: function () {
      const ret = new Error();
      return addHeapObject(ret);
    },
    __wbg_stack_0ddaca5d1abfb52f: function (arg0, arg1) {
      const ret = getObject(arg1).stack;
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbg_error_09919627ac0992f5: function (arg0, arg1) {
      try {
        console.error(getStringFromWasm0(arg0, arg1));
      } finally {
        wasm.__wbindgen_free(arg0, arg1);
      }
    },
    __wbindgen_is_object: function (arg0) {
      const val = getObject(arg0);
      const ret = typeof (val) === "object" && val !== null;
      return ret;
    },
    __wbg_randomFillSync_91e2b39becca6147: function () {
      return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_getRandomValues_b14734aa289bc356: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_static_accessor_NODE_MODULE_26b231378c1be7dd: function () {
      const ret = module;
      return addHeapObject(ret);
    },
    __wbg_process_e56fd54cf6319b6c: function (arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbg_versions_77e21455908dad33: function (arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbg_node_0dd25d832e4785d5: function (arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbindgen_is_string: function (arg0) {
      const ret = typeof (getObject(arg0)) === "string";
      return ret;
    },
    __wbg_require_0db1598d9ccecb30: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_crypto_b95d7173266618a9: function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_msCrypto_5a86d77a66230f81: function (arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_newnoargs_fc5356289219b93b: function (arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function (arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbg_call_4573f605ca4b5f10: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_buffer_de1150f91b23aa89: function (arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_self_ba1ddafe9ea7a3a2: function () {
      return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_window_be3cc430364fd32c: function () {
      return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_globalThis_56d9c9f814daeeee: function () {
      return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_global_8c35aeee4ac77f2b: function () {
      return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbindgen_is_undefined: function (arg0) {
      const ret = getObject(arg0) === undefined;
      return ret;
    },
    __wbg_newwithbyteoffsetandlength_9ca61320599a2c84: function (
      arg0,
      arg1,
      arg2,
    ) {
      const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_new_97cf52648830a70d: function (arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_newwithlength_e833b89f9db02732: function (arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_subarray_9482ae5cd5cd99d3: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_length_e09c0b925ab8de5d: function (arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_set_a0172b213e2469e9: function (arg0, arg1, arg2) {
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
 *   exports: { sign: typeof sign; Keypair : typeof Keypair ; PublicKey : typeof PublicKey ; Signer : typeof Signer  }
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
          exports: { sign, Keypair, PublicKey, Signer },
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
      if (typeof Deno !== "object") {
        throw new Error("file urls are not supported in this environment");
      }

      if ("permissions" in Deno) {
        Deno.permissions.request({ name: "read", path: wasm_url });
      }
      const wasmCode = await Deno.readFile(wasm_url);
      return WebAssembly.instantiate(wasmCode, imports);
    }
    case "https:":
    case "http:": {
      if (typeof Deno === "object" && "permissions" in Deno) {
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
