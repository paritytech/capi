use {
  frame_metadata::RuntimeMetadataPrefixed,
  js_sys::{JsString, Map, Uint8Array},
  parity_scale_codec::{Decode, Encode},
  wasm_bindgen::prelude::*,
};

macro_rules! frame_metadata_fixture {
  ($r:ident, $($val:expr),* $(,)?) => {{
    $({
      let mut bytes = &$val[..];
      let key = Uint8Array::from(&Encode::encode(bytes)[..]);
      let value = JsString::from(serde_json::to_string(&RuntimeMetadataPrefixed::decode(&mut bytes).unwrap().1).unwrap());
      $r.set(&key, &value);
    })*
  }};
}

#[wasm_bindgen]
pub fn frame_metadata_() -> Result<Map, JsError> {
  console_error_panic_hook::set_once();
  let result = Map::new();
  frame_metadata_fixture!(
    result,
    include_bytes!("../target/frame_metadata/polkadot.scale"),
    include_bytes!("../target/frame_metadata/kusama.scale"),
    include_bytes!("../target/frame_metadata/statemint.scale"),
    include_bytes!("../target/frame_metadata/moonbeam.scale"),
    include_bytes!("../target/frame_metadata/acala.scale"),
    include_bytes!("../target/frame_metadata/subsocial.scale"),
  );
  Ok(result)
}
