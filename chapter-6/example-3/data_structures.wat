(module
    (import "env" "mem" (memory 1))

    (global $obj_base_addr (import "env" "obj_base_addr") i32)
    (global $obj_count (import "env" "obj_count") i32)
    (global $obj_stride (import "env" "obj_stride") i32)


    (global $x_offset (import "env" "x_offset") i32)
    (global $y_offset (import "env" "y_offset") i32)
    (global $radius_offset (import "env" "radius_offset") i32)
    (global $collision_offset (import "env" "collision_offset") i32)

    (func $collision_check
        (param $x1 i32) (param $y1 i32) (param $r1 i32)
        (param $x2 i32) (param $y2 i32) (param $r2 i32)
        (result i32)

        (local $x_diff_sq i32)
        (local $y_diff_sq i32)
        (local $r_sum_sq i32)

        ;; Calculate x diff square
        local.get $x1
        local.get $x2
        i32.sub
        local.tee $x_diff_sq
        local.get $x_diff_sq
        i32.mul
        local.set $x_diff_sq

        ;; Calculate y diff square
        local.get $y1
        local.get $y2
        i32.sub
        local.tee $y_diff_sq
        local.get $y_diff_sq
        i32.mul
        local.set $y_diff_sq

        ;; calculate r sum square
        local.get $r1
        local.get $r2
        i32.add
        local.tee $r_sum_sq
        local.get $r_sum_sq
        i32.mul
        local.tee $r_sum_sq

        local.get $x_diff_sq
        local.get $y_diff_sq
        i32.add

        i32.gt_u ;; if distance is less than sum of the radii return true
    )

    (func $get_attr (param $obj_base i32) (param $attr_offset i32) (result i32)
        local.get $obj_base
        local.get $attr_offset
        i32.add

        i32.load
    )

    (func $set_collision (param $obj_base_1 i32) (param $obj_base_2 i32)
        local.get $obj_base_1
        global.get $collision_offset
        i32.add
        i32.const 1
        i32.store

        local.get $obj_base_2
        global.get $collision_offset
        i32.add
        i32.const 1
        i32.store
    )

    (func $init
        (local $i i32) ;; outer loop counter
        (local $i_obj_add i32)
        (local $x_i i32)
        (local $y_i i32)
        (local $r_i i32)

        (local $j i32) ;; inner loop counter
        (local $j_obj_add i32)
        (local $x_j i32)
        (local $y_j i32)
        (local $r_j i32)

        (loop $outer_loop
            (local.set $j (i32.const 0))

            (loop $inner_loop
                (block $inner_continue
                    (br_if $inner_continue (i32.eq (local.get $i) (local.get $j)))

                    ;; calculate the address of the i-th object
                    global.get $obj_base_addr
                    local.get $i
                    global.get $obj_stride 
                    i32.mul
                    i32.add
                    local.set $i_obj_add

                    ;; load x, y and r attributes for i-th object
                    (call $get_attr (local.get $i_obj_add) (global.get $x_offset))
                    (local.set $x_i)

                    (call $get_attr (local.get $i_obj_add) (global.get $y_offset))
                    (local.set $y_i)

                    (call $get_attr (local.get $i_obj_add) (global.get $radius_offset))
                    (local.set $r_i)

                    ;; calculate the address of the j-th object
                    global.get $obj_base_addr
                    local.get $j
                    global.get $obj_stride 
                    i32.mul
                    i32.add
                    local.set $j_obj_add

                    ;; load x, y and r attributes for j-th object
                    (call $get_attr (local.get $j_obj_add) (global.get $x_offset))
                    (local.set $x_j)

                    (call $get_attr (local.get $j_obj_add) (global.get $y_offset))
                    (local.set $y_j)

                    (call $get_attr (local.get $j_obj_add) (global.get $radius_offset))
                    (local.set $r_j)

                    ;; check for collision
                    (call $collision_check 
                        (local.get $x_i) (local.get $y_i) (local.get $r_i)
                        (local.get $x_j) (local.get $y_j) (local.get $r_j)
                    )

                    if
                        (call $set_collision (local.get $i_obj_add) (local.get $j_obj_add))
                    end

                    ;; increment j
                    local.get $j
                    i32.const 1
                    i32.add
                    local.set $j

                    (br_if $inner_loop (i32.lt_u (local.get $j) (global.get $obj_count)))                    
                )
            )

            ;; increment i
            local.get $i
            i32.const 1
            i32.add
            local.set $i

            (br_if $outer_loop (i32.lt_u (local.get $i) (global.get $obj_count)))
        )
    )

    ;; (start $init)
)