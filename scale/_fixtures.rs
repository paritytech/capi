use {
  js_sys::{JsString, Map, Uint8Array},
  parity_scale_codec::Encode,
  paste::paste,
  serde::Serialize,
  wasm_bindgen::prelude::*,
};

macro_rules! make_fixture_getter {
  ($t:ident, $($val:expr),* $(,)?) => { paste! {
    #[wasm_bindgen]
    pub fn [<$t _>]() -> Result<Map, JsError> {
      console_error_panic_hook::set_once();
      let result = Map::new();
      $(result.set(
        &Uint8Array::from(&Encode::encode(&($val))[..]),
        &JsString::from(serde_json::to_string(&($val)).unwrap()),
      );)*
      return Ok(result);
    }
  }};
}

make_fixture_getter!(bool, true, false);

macro_rules! make_num_fixture_getter {
  ($t:ty, $($val:expr),* $(,)?) => { paste! {
    make_fixture_getter!([<$t>], $t::MIN, $t::MAX$(, $val)*);
  }};
}

make_num_fixture_getter!(u8, 0u8, 1u8, 2u8, 9u8);
make_num_fixture_getter!(i8, -9i8, -2i8, -1i8, 0i8, 1i8, 2i8, 9i8);
make_num_fixture_getter!(u16, 0u16, 1u16, 2u16, 9u16);
make_num_fixture_getter!(i16, -9i16, -2i16, -1i16);
make_num_fixture_getter!(u32, 0u32, 1u32, 2u32, 9u32);
make_num_fixture_getter!(i32, -9i32, -2i32, -1i32);
make_num_fixture_getter!(u64, 0u64, 1u64, 2u64, 9u64);
make_num_fixture_getter!(i64, -9i64, -2i64, -1i64);
make_num_fixture_getter!(u128, 0u128, 1u128, 2u128, 9u128);
make_num_fixture_getter!(i128, -9i128, -2i128, -1i128);

const LIPSUM: &'static str = include_str!("../_/assets/lorem_ipsum.txt");
make_fixture_getter!(str, "", "The quick brown fox jumps over the lazy dog", LIPSUM);

make_fixture_getter!(
  option,
  Some("HELLO!"),
  Some(1u8),
  Some(LIPSUM),
  Some(u32::MAX),
  None as Option<()>
);

make_fixture_getter!(
  tuple,
  ("HELLO!", 1u8, LIPSUM, u32::MAX),
  ("GOODBYE!", 2i16, Some(101u16)),
);

make_fixture_getter!(
  fixed_size_array,
  &[1u8, 2u8, 3u8, 4u8, 5u8],
  &[6u8, 7u8, 8u8, 9u8, 10u8],
  &[11u8, 12u8, 13u8, 14u8, 15u8],
  &[16u8, 17u8, 18u8, 19u8, 20u8],
);

make_fixture_getter!(
  unknown_size_array,
  vec![1u8],
  vec![2u8, 3u8],
  vec![4u8, 5u8, 6u8],
  vec![7u8, 8u8, 9u8, 10u8],
  vec![11u8, 12u8, 13u8, 14u8, 15u8],
);

#[derive(Encode, Serialize)]
enum Abc {
  A,
  B(String),
  C(u32, u64),
  // // TODO
  // D { a: u32, b: u64 },
}
make_fixture_getter!(
  variant,
  Abc::A,
  Abc::B("HELLO".to_string()),
  Abc::C(255, 101010101),
  // Abc::D { a: 101, b: 999 }
);

#[derive(Encode, Serialize)]
struct Person {
  pub name: String,
  #[serde(rename = "nickName")]
  pub nick_name: String,
  #[serde(rename = "superPower")]
  pub super_power: Option<String>,
  #[serde(rename = "luckyNumber")]
  pub lucky_number: u8,
}
make_fixture_getter! {
  struct,
  Person {
    name: "Darrel".to_string(),
    nick_name: "The Durst".to_string(),
    super_power: Some("telekinesis".to_string()),
    lucky_number: 9
  },
  Person {
    name: "Michael".to_string(),
    nick_name: "Mike".to_string(),
    super_power: None,
    lucky_number: 7 // Cummon... be more predictable!
  }
}
