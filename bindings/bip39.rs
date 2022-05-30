// Not much here yet

use {
  bip39::{Language, Mnemonic, MnemonicType},
  wasm_bindgen::prelude::*,
};

#[wasm_bindgen(js_name = mnemonicSeed)]
pub fn seed() -> String {
  let mnemonic = Mnemonic::new(MnemonicType::Words12, Language::English);
  mnemonic.phrase().to_string()
}
