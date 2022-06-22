use {
  js_sys::Uint8Array, schnorrkel as s, sp_core::sr25519::Signature, sp_keyring::Sr25519Keyring,
  std::str::FromStr, wasm_bindgen::prelude::*,
};

const SIGNING_CTX: &'static [u8] = b"capi";

const PUBLIC_KEY_INIT_ERROR: &'static str = "PublicKeyInitError";
const INVALID_SECRET_KEY_ERROR: &'static str = "InvalidSecretKeyError";

#[wasm_bindgen]
pub struct PublicKey(s::PublicKey);
#[wasm_bindgen]
impl PublicKey {
  #[wasm_bindgen(js_name = "from")]
  pub fn from(bytes: &[u8]) -> Result<PublicKey, JsError> {
    console_error_panic_hook::set_once();
    match s::PublicKey::from_bytes(bytes) {
      Ok(public_key) => Ok(Self(public_key)),
      Err(_) => Err(JsError::new(PUBLIC_KEY_INIT_ERROR)),
    }
  }

  #[wasm_bindgen(js_name = bytes, getter)]
  pub fn get_bytes(&self) -> Uint8Array {
    console_error_panic_hook::set_once();
    self.0.to_bytes()[..].into()
  }

  #[wasm_bindgen]
  pub fn signer(&self, secret_key_bytes: &[u8]) -> Result<Signer, JsError> {
    console_error_panic_hook::set_once();
    match s::SecretKey::from_bytes(secret_key_bytes) {
      Ok(secret) => Ok(Signer(s::Keypair {
        public: self.0,
        secret,
      })),
      Err(_) => Err(JsError::new(INVALID_SECRET_KEY_ERROR)),
    }
  }

  // TODO: do we want to produce an error instead of `false`?
  #[wasm_bindgen]
  pub fn verify(&self, signature: &[u8], message: &[u8]) -> bool {
    console_error_panic_hook::set_once();
    let signature_result = self.0.verify_simple(
      SIGNING_CTX,
      &message,
      &s::Signature::from_bytes(signature).unwrap(),
    );
    match signature_result {
      Ok(_) => true,
      Err(_) => false,
    }
  }
}

#[wasm_bindgen]
pub struct Signer(s::Keypair);
#[wasm_bindgen]
impl Signer {
  #[wasm_bindgen]
  pub fn sign(&self, message: &[u8]) -> Uint8Array {
    console_error_panic_hook::set_once();
    let data = self
      .0
      .secret
      .sign_simple(SIGNING_CTX, message, &self.0.public)
      .to_bytes()
      .to_vec();
    let mut inner = [0u8; 64];
    inner.copy_from_slice(&data);
    Signature(inner).0[..].into()
  }
}

#[wasm_bindgen]
pub struct TestUser(Sr25519Keyring);
#[wasm_bindgen]
impl TestUser {
  #[wasm_bindgen(js_name = fromName)]
  pub fn from_name(name: &str) -> Result<TestUser, JsError> {
    match Sr25519Keyring::from_str(name) {
      Ok(inner) => Ok(TestUser(inner)),
      Err(_) => Err(JsError::new("")),
    }
  }

  #[wasm_bindgen]
  pub fn sign(&self, message: &[u8]) -> Uint8Array {
    self.0.sign(message).0[..].into()
  }

  #[wasm_bindgen(js_name = publicKey, getter)]
  pub fn public_key(&self) -> Uint8Array {
    self.0.public().0.to_vec()[..].into()
  }
}
