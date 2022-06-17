// Much of the following is adapted from `https://github.com/shamilsan/ss58.org`
use {
  base58::{FromBase58, ToBase58},
  blake2::{Blake2b512, Digest},
  js_sys::Array,
  wasm_bindgen::prelude::*,
};

const BASE58_DECODING_FAILED: &'static str = "Base58DecodingFailed";
const INVALID_LEN: &'static str = "InvalidLen";
const INVALID_CHECKSUM: &'static str = "InvalidChecksum";

#[wasm_bindgen]
pub fn decode(text: &str) -> Result<Array, String> {
  console_error_panic_hook::set_once();
  match text.from_base58() {
    Ok(addr) => {
      let len = addr.len();
      if !(35..=36).contains(&len) {
        Err(INVALID_LEN.to_string())
      } else {
        let checksum = &addr[len - 2..len];
        let mut hasher = Blake2b512::new();
        hasher.update(b"SS58PRE");
        hasher.update(&addr[0..len - 2]);
        if checksum != &hasher.finalize()[0..2] {
          return Err(INVALID_CHECKSUM.to_string());
        }
        let key = hex::encode(&addr[len - 34..len - 2]);
        let prefix_buf = &addr[0..len - 34];
        let prefix = if prefix_buf.len() == 1 {
          prefix_buf[0] as u16
        } else {
          let prefix_hi = ((prefix_buf[1] & 0x3F) as u16) << 8;
          let prefix_lo = ((prefix_buf[0] << 2) | (prefix_buf[1] >> 6)) as u16;
          prefix_hi | prefix_lo
        };
        let result = Array::new();
        result.push(&JsValue::from(prefix));
        result.push(&JsValue::from(key));
        Ok(result)
      }
    }
    Err(_) => Err(BASE58_DECODING_FAILED.to_string()),
  }
}

const HEX_DECODING_FAILED: &'static str = "HexDecodingFailed";
const INVALID_PUB_KEY_LEN: &'static str = "InvalidPubKeyLen";

#[wasm_bindgen]
pub fn encode(prefix: u16, pub_key: &str) -> Result<String, String> {
  match hex::decode(pub_key) {
    Err(_) => Err(HEX_DECODING_FAILED.to_string()),
    Ok(mut raw_key) => {
      if raw_key.len() != 32 {
        Err(INVALID_PUB_KEY_LEN.to_string())
      } else {
        let mut hasher = Blake2b512::new();
        hasher.update(b"SS58PRE");
        let simple_prefix: u8 = (prefix & 0x3F) as _;
        let full_prefix = 0x4000 | ((prefix >> 8) & 0x3F) | ((prefix & 0xFF) << 6);
        let prefix_hi: u8 = (full_prefix >> 8) as _;
        let prefix_low: u8 = (full_prefix & 0xFF) as _;
        if prefix == simple_prefix as u16 {
          hasher.update(&[simple_prefix]);
        } else {
          hasher.update(&[prefix_hi]);
          hasher.update(&[prefix_low]);
        }
        hasher.update(&raw_key);
        let mut addr_bytes: Vec<u8> = Vec::with_capacity(64);
        if prefix == simple_prefix as u16 {
          addr_bytes.push(simple_prefix);
        } else {
          addr_bytes.push(prefix_hi);
          addr_bytes.push(prefix_low);
        }
        addr_bytes.append(&mut raw_key);
        addr_bytes.extend_from_slice(&hasher.finalize()[0..2]);
        Ok(addr_bytes[..].to_base58())
      }
    }
  }
}
