use {js_sys::Uint8Array, schnorrkel as s, sp_core::sr25519::Signature, wasm_bindgen::prelude::*};

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

// // TODO: delete this
#[wasm_bindgen]
pub struct Keypair(s::Keypair);
#[wasm_bindgen]
impl Keypair {
  #[wasm_bindgen]
  pub fn rand() -> Keypair {
    Keypair(s::MiniSecretKey::generate().expand_to_keypair(s::ExpansionMode::Uniform))
  }

  #[wasm_bindgen(js_name = publicKey, getter)]
  pub fn get_public_key(&self) -> PublicKey {
    console_error_panic_hook::set_once();
    PublicKey(self.0.public)
  }

  #[wasm_bindgen(js_name = secretKey, getter)]
  pub fn get_secret_key(&self) -> Uint8Array {
    console_error_panic_hook::set_once();
    Uint8Array::from(&self.0.secret.to_bytes()[..])
  }
}

#[wasm_bindgen]
pub fn sign(pub_key_bytes: &[u8], secret_key_bytes: &[u8], message: &[u8]) -> Uint8Array {
  console_error_panic_hook::set_once();
  let pub_key = s::PublicKey::from_bytes(pub_key_bytes).unwrap();
  let secret_key = s::SecretKey::from_bytes(secret_key_bytes).unwrap();
  let data = secret_key
    .sign_simple(SIGNING_CTX, message, &pub_key)
    .to_bytes()
    .to_vec();
  let mut inner = [0u8; 64];
  inner.copy_from_slice(&data);
  Signature(inner).0[..].into()
}
