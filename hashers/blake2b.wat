(module
  (import "blake2b" "memory" (memory 1))

  ;; (import "log" "u32" (func $log_u32 (param i32)))
  ;; (import "log" "u64" (func $log_u64 (param i64)))
  ;; (func $dbg_u32 (param $v i32) (result i32) local.get $v call $log_u32 local.get $v)
  ;; (func $dbg_u64 (param $v i64) (result i64) local.get $v call $log_u64 local.get $v)

  (global $staging_adr i32 (i32.const 0))
  (global $iv_adr i32 (i32.const 128))
  (export "iv_adr" (global $iv_adr))
  (global $sigma_adr i32 (i32.const 192))
  (global $free_mem i32 (i32.const 384))
  (export "free_mem" (global $free_mem))

  (func (export "reset")
    (param $state_adr i32)
    (param $dk_len i32)

    (memory.copy
      (local.get $state_adr)
      (global.get $iv_adr)
      (i32.const 64)
    )

    (i64.store (local.get $state_adr)
      (i64.load (local.get $state_adr))
      (i64.xor (i64.const 16842752))
      (i64.xor (i64.extend_i32_u (local.get $dk_len)))
    )
  )

  (func $get
    (param $mem_adr i32)
    (param $idx i32)
    (result i64)

    (i64.load (i32.add (local.get $mem_adr) 
      ;; offset=$sigma_adr
      (i32.load8_u offset=192 (local.get $idx))
    ))
  )

  (func $g
    (param $ai i32)
    (param $bi i32)
    (param $ci i32)
    (param $di i32)
    (param $msg_adr i32)
    (param $idx_1 i32)

    (local $a i64)
    (local $b i64)
    (local $c i64)
    (local $d i64)
    (local $x i64)
    (local $y i64)

    (local.set $a (i64.load (local.get $ai)))
    (local.set $b (i64.load (local.get $bi)))
    (local.set $c (i64.load (local.get $ci)))
    (local.set $d (i64.load (local.get $di)))
    (local.set $x (call $get (local.get $msg_adr) (local.get $idx_1)))
    (local.set $y (call $get (local.get $msg_adr) (i32.add (local.get $idx_1) (i32.const 1))))

    (local.set $a (local.get $a) (i64.add (local.get $b)) (i64.add (local.get $x)))
    (local.set $d (local.get $d) (i64.xor (local.get $a)) (i64.rotr (i64.const 32)))
    (local.set $c (local.get $c) (i64.add (local.get $d)))
    (local.set $b (local.get $b) (i64.xor (local.get $c)) (i64.rotr (i64.const 24)))

    (local.set $a (local.get $a) (i64.add (local.get $b)) (i64.add (local.get $y)))
    (local.set $d (local.get $d) (i64.xor (local.get $a)) (i64.rotr (i64.const 16)))
    (local.set $c (local.get $c) (i64.add (local.get $d)))
    (local.set $b (local.get $b) (i64.xor (local.get $c)) (i64.rotl (i64.const 1)))

    (i64.store (local.get $ai) (local.get $a))
    (i64.store (local.get $bi) (local.get $b))
    (i64.store (local.get $ci) (local.get $c))
    (i64.store (local.get $di) (local.get $d))
  )

  (func $compress
    (param $state_adr i32)
    (param $msg_adr i32)
    (param $written i32)
    (param $is_last_mask i64)

    (local $idx i32)

    (memory.copy
      (i32.const 0)
      (local.get $state_adr)
      (i32.const 64)
    )

    (memory.copy
      (i32.const 64)
      (global.get $iv_adr)
      (i32.const 64)
    )

    (i64.store (i32.const 96)
      (i64.load (i32.const 96))
      (i64.xor (i64.extend_i32_u (local.get $written)))
    )
    
    (i64.store (i32.const 112)
      (i64.load (i32.const 112))
      (i64.xor (local.get $is_last_mask))
    )

    (loop $idx
      (call $g
        (i32.const 0) (i32.const 32) (i32.const 64) (i32.const 96)
        (local.get $msg_adr) (local.get $idx)
      )
      (call $g
        (i32.const 8) (i32.const 40) (i32.const 72) (i32.const 104)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 2))
      )
      (call $g
        (i32.const 16) (i32.const 48) (i32.const 80) (i32.const 112)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 4))
      )
      (call $g
        (i32.const 24) (i32.const 56) (i32.const 88) (i32.const 120)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 6))
      )

      (call $g
        (i32.const 0) (i32.const 40) (i32.const 80) (i32.const 120)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 8))
      )
      (call $g
        (i32.const 8) (i32.const 48) (i32.const 88) (i32.const 96)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 10))
      )
      (call $g
        (i32.const 16) (i32.const 56) (i32.const 64) (i32.const 104)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 12))
      )
      (call $g
        (i32.const 24) (i32.const 32) (i32.const 72) (i32.const 112)
        (local.get $msg_adr) (i32.add (local.get $idx) (i32.const 14))
      )

      (local.tee $idx (i32.add (local.get $idx) (i32.const 16)))
      (br_if $idx (i32.lt_u (i32.const 192)))
    )

    (v128.store (local.get $state_adr)
      (v128.load (local.get $state_adr))
      (v128.xor (v128.load (i32.const 0)))
      (v128.xor (v128.load (i32.const 64)))
    )

    (v128.store offset=16 (local.get $state_adr)
      (v128.load offset=16 (local.get $state_adr))
      (v128.xor (v128.load (i32.const 16)))
      (v128.xor (v128.load (i32.const 80)))
    )

    (v128.store offset=32 (local.get $state_adr)
      (v128.load offset=32 (local.get $state_adr))
      (v128.xor (v128.load (i32.const 32)))
      (v128.xor (v128.load (i32.const 96)))
    )

    (v128.store offset=48 (local.get $state_adr)
      (v128.load offset=48 (local.get $state_adr))
      (v128.xor (v128.load (i32.const 48)))
      (v128.xor (v128.load (i32.const 112)))
    )
  )

  (func (export "update")
    (param $state_adr i32)
    (param $msg_adr i32)
    (param $msg_end i32)
    (param $written i32)

    (loop $chunks
      (local.set $written (i32.add (local.get $written) (i32.const 128)))
      (call $compress (local.get $state_adr) (local.get $msg_adr) (local.get $written) (i64.const 0))

      (local.tee $msg_adr (i32.add (local.get $msg_adr) (i32.const 128)))
      (br_if $chunks (i32.lt_u (local.get $msg_end)))
    )
  )

  (func (export "finish")
    (param $state_adr i32)
    (param $msg_adr i32)
    (param $written i32)

    (call $compress (local.get $state_adr) (local.get $msg_adr) (local.get $written) (i64.const -1))
  )
)
