use {js_sys::Uint8Array, schnorrkel as s, sp_core::sr25519::Signature, wasm_bindgen::prelude::*};

const SIGNING_CTX: &'static [u8] = b"capi";

#[wasm_bindgen]
pub struct Pair(s::Keypair);

#[wasm_bindgen]
impl Pair {
  #[wasm_bindgen(constructor)]
  pub fn new(pub_key_bytes: &[u8], secret_key_bytes: &[u8]) -> Self {
    let bytes = [pub_key_bytes, secret_key_bytes].concat();
    Self(s::Keypair::from_bytes(&bytes).unwrap())
  }

  #[wasm_bindgen(js_name = pubKey, getter)]
  pub fn get_pub_key(&self) -> Uint8Array {
    self.0.public.to_bytes()[..].into()
  }

  #[wasm_bindgen(js_name = secretKey, getter)]
  pub fn get_secret_key(&self) -> Uint8Array {
    self.0.secret.to_bytes()[..].into()
  }

  #[wasm_bindgen(js_name = fromSecretSeed)]
  pub fn from_secret_seed(bytes: &[u8]) -> Self {
    let mini_secret_result = s::MiniSecretKey::from_bytes(bytes);
    let mini_secret = mini_secret_result.unwrap();
    let s_pair = mini_secret.expand_to_keypair(s::ExpansionMode::Ed25519);
    Self(s_pair)
  }

  pub fn sign(&self, message: &[u8]) -> Uint8Array {
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
pub fn verify(signature: &[u8], message: &[u8], pub_key: &[u8]) -> bool {
  s::PublicKey::from_bytes(pub_key)
    .unwrap()
    .verify_simple(
      SIGNING_CTX,
      &message,
      &s::Signature::from_bytes(signature).unwrap(),
    )
    .is_ok()
}
