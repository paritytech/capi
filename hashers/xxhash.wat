(module
  (import "xxhash" "memory" (memory 1))

  ;; (import "log" "u32" (func $log_u32 (param i32)))
  ;; (import "log" "u64" (func $log_u64 (param i64)))
  ;; (func $dbg_u32 (param $v i32) (result i32) local.get $v call $log_u32 local.get $v)
  ;; (func $dbg_u64 (param $v i64) (result i64) local.get $v call $log_u64 local.get $v)

  (global $max_rounds i32 (i32.const 8))
  (export "max_rounds" (global $max_rounds))
  (global $init_state_adr i32 (i32.const 0))
  (global $alt_digest_init_adr i32 (i32.const 256))
  (global $free_mem i32 (i32.const 320))
  (export "free_mem" (global $free_mem))

  (global $p1 i64 (i64.const 11400714785074694791))
  (global $p11 v128 (v128.const i64x2 11400714785074694791 11400714785074694791))
  (global $p2 i64 (i64.const 14029467366897019727))
  (global $p22 v128 (v128.const i64x2 14029467366897019727 14029467366897019727))
  (global $p3 i64 (i64.const 1609587929392839161))
  (global $p4 i64 (i64.const 9650029242287828579))
  (global $p5 i64 (i64.const 2870177450012600261))

  (global $i12 v128 (v128.const i64x2 6983438078262162902 14029467366897019727))
  (global $i34 v128 (v128.const i64x2 0 7046029288634856825))

  (func (export "init_mod")
    (local $state_adr i32)
    (local $ii v128)
    (local $i i32)

    (local.set $state_adr (global.get $init_state_adr))
    (loop $rounds
      (v128.store
        (local.get $state_adr)
        (i64x2.add (global.get $i12) (local.get $ii))
      )
      (v128.store offset=16
        (local.get $state_adr)
        (i64x2.add (global.get $i34) (local.get $ii))
      )

      (local.set $state_adr (i32.add (local.get $state_adr) (i32.const 32)))
      (local.set $ii (i64x2.add (local.get $ii) (v128.const i64x2 1 1)))
      (local.tee $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $rounds (i32.ne (global.get $max_rounds)))
    )

    (local.set $state_adr (global.get $alt_digest_init_adr))
    (local.set $i (i32.const 0))
    (loop $rounds
      (i64.store (local.get $state_adr) (i64.add (i64.extend_i32_u (local.get $i)) (global.get $p5)))

      (local.set $state_adr (i32.add (local.get $state_adr) (i32.const 8)))
      (local.tee $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $rounds (i32.ne (global.get $max_rounds)))
    )
  )

  (func $i64x2_rotl_31 (param $val v128) (result v128)
    (v128.or
      (i64x2.shl (local.get $val) (i32.const 31))
      (i64x2.shr_u (local.get $val) (i32.const 33))
    )
  )

  (func (export "reset") (param $rounds i32) (param $state_adr i32)
    (memory.copy 
      (local.get $state_adr)
      (global.get $init_state_adr)
      (i32.mul (local.get $rounds) (i32.const 32))
    )
  )

  (func (export "update")
    (param $rounds i32)
    (param $state_adr i32)
    (param $pos i32)
    (param $end i32)

    (local $round_i i32)
    (local $chunk_i i32)
    (local $data01 v128)
    (local $data23 v128)
    (local $state_cur i32)

    (loop $chunks
      (v128.load (local.get $pos))
      (i64x2.mul (global.get $p22))
      (local.set $data01)

      (v128.load offset=16 (local.get $pos))
      (i64x2.mul (global.get $p22))
      (local.set $data23)

      (local.set $round_i (i32.const 0))
      (local.set $state_cur (local.get $state_adr))
      (loop $rounds
        (v128.store (local.get $state_cur)
          (v128.load (local.get $state_cur))
          (i64x2.add (local.get $data01))
          (call $i64x2_rotl_31)
          (i64x2.mul (global.get $p11))
        )
        
        (v128.store offset=16 (local.get $state_cur)
          (v128.load offset=16 (local.get $state_cur))
          (i64x2.add (local.get $data23))
          (call $i64x2_rotl_31)
          (i64x2.mul (global.get $p11))
        )
        
        (local.set $state_cur (i32.add (local.get $state_cur) (i32.const 32)))
        (local.tee $round_i (i32.add (local.get $round_i) (i32.const 1)))
        (br_if $rounds (i32.ne (local.get $rounds)))
      )

      (local.tee $pos (i32.add (local.get $pos) (i32.const 32)))
      (br_if $chunks (i32.lt_u (local.get $end)))
    )
  )

  (func $digest_init
    (param $state_adr i32)
    (result i64)
    
    (local $state01 v128)
    (local $state23 v128)

    (local.set $state01 (v128.load (local.get $state_adr)))
    (local.set $state23 (v128.load offset=16 (local.get $state_adr)))

    (i64.rotl (i64x2.extract_lane 0 (local.get $state01)) (i64.const 1))
    (i64.rotl (i64x2.extract_lane 1 (local.get $state01)) (i64.const 7))
    (i64.rotl (i64x2.extract_lane 0 (local.get $state23)) (i64.const 12))
    (i64.rotl (i64x2.extract_lane 1 (local.get $state23)) (i64.const 18))
    i64.add
    i64.add
    i64.add

    (local.get $state01)
    (i64x2.mul (global.get $p22))
    (call $i64x2_rotl_31)
    (i64x2.mul (global.get $p11))
    (local.set $state01)

    (local.get $state23)
    (i64x2.mul (global.get $p22))
    (call $i64x2_rotl_31)
    (i64x2.mul (global.get $p11))
    (local.set $state23)

    (i64.xor (i64x2.extract_lane 0 (local.get $state01)))
    (i64.mul (global.get $p1))
    (i64.add (global.get $p4))

    (i64.xor (i64x2.extract_lane 1 (local.get $state01)))
    (i64.mul (global.get $p1))
    (i64.add (global.get $p4))

    (i64.xor (i64x2.extract_lane 0 (local.get $state23)))
    (i64.mul (global.get $p1))
    (i64.add (global.get $p4))

    (i64.xor (i64x2.extract_lane 1 (local.get $state23)))
    (i64.mul (global.get $p1))
    (i64.add (global.get $p4))
  )

  (func (export "digest")
    (param $rounds i32)
    (param $state_adr i32)
    (param $written i32) 
    (param $pos i32)
    (param $end i32)
    (param $digest_adr i32)

    (local $i i32)
    (local $digest_cur i32)
    (local $digest_val i64)
    (local $pos_cur i32)
    (local $pos_next i32)

    (if (i32.ge_s (local.get $written) (i32.const 32))
      (then
        (local.set $digest_cur (local.get $digest_adr))
        (loop $rnd
          (i64.store (local.get $digest_cur) (call $digest_init (local.get $state_adr)))

          (local.set $digest_cur (i32.add (local.get $digest_cur) (i32.const 8)))
          (local.set $state_adr (i32.add (local.get $state_adr) (i32.const 32)))
          (local.tee $i (i32.add (local.get $i) (i32.const 1)))
          (br_if $rnd (i32.ne (local.get $rounds)))
        )
      )
      (else
        (memory.copy
          (local.get $digest_adr)
          (global.get $alt_digest_init_adr)
          (i32.mul (local.get $rounds) (i32.const 8))
        )
      )
    )

    (local.set $digest_cur (local.get $digest_adr))
    (local.set $i (i32.const 0))
    (loop $rounds
      (i64.load (local.get $digest_cur))

      (i64.add (i64.extend_i32_u (local.get $written)))
      (local.set $digest_val)

      (local.set $pos_cur (local.get $pos))
      (loop $continue (block $break
        (local.tee $pos_next (i32.add (local.get $pos_cur) (i32.const 8)))
        (br_if $break (i32.gt_u (local.get $end)))

        (local.set $digest_val
          (i64.load (local.get $pos_cur))
          (i64.mul (global.get $p2))
          (i64.rotl (i64.const 31))
          (i64.mul (global.get $p1))
          (i64.xor (local.get $digest_val))
          (i64.rotl (i64.const 27))
          (i64.mul (global.get $p1))
          (i64.add (global.get $p4))
        )

        (local.set $pos_cur (local.get $pos_next))
        (br $continue)
      ))

      (block $break
        (local.tee $pos_next (i32.add (local.get $pos_cur) (i32.const 4)))
        (br_if $break (i32.gt_u (local.get $end)))

        (local.set $digest_val
          (i64.load32_u (local.get $pos_cur))
          (i64.mul (global.get $p1))
          (i64.xor (local.get $digest_val))
          (i64.rotl (i64.const 23))
          (i64.mul (global.get $p2))
          (i64.add (global.get $p3))
        )

        (local.set $pos_cur (local.get $pos_next))
      )
      
      (loop $continue (block $break
        (br_if $break (i32.ge_u (local.get $pos_cur) (local.get $end)))

        (local.set $digest_val
          (i64.load8_u (local.get $pos_cur))
          (i64.mul (global.get $p5))
          (i64.xor (local.get $digest_val))
          (i64.rotl (i64.const 11))
          (i64.mul (global.get $p1))
        )

        (local.set $pos_cur (i32.add (local.get $pos_cur) (i32.const 1)))
        (br $continue)
      ))

      (local.get $digest_val) 
      (i64.xor (local.get $digest_val) (i64.shr_u (i64.const 33)))
      (i64.mul (global.get $p2))

      (local.tee $digest_val)
      (i64.xor (i64.shr_u (local.get $digest_val) (i64.const 29)))
      (i64.mul (global.get $p3))

      (local.tee $digest_val) 
      (i64.xor (i64.shr_u (local.get $digest_val) (i64.const 32)))

      (local.set $digest_val)
      (i64.store (local.get $digest_cur) (local.get $digest_val))

      (local.set $digest_cur (i32.add (local.get $digest_cur) (i32.const 8)))
      (local.tee $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $rounds (i32.ne (local.get $rounds)))
    )
  )
)
