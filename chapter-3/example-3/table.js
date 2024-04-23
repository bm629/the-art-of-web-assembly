const fs = require('fs');
const export_bytes = fs.readFileSync('./table_export.wasm');
const test_bytes = fs.readFileSync('./table_test.wasm');

let i = 0;
let increment = () => {
    i++;
    return i;
}

let decrement = () => {
    i--;
    return i;
}

const import_object = {
    js: {
        tbl: null,
        increment,
        decrement,
        wasm_increment: null,
        wasm_decrement: null
    }
};

(async () => {
    const table_exp_obj = await WebAssembly.instantiate(new Uint8Array(export_bytes), import_object);
    import_object.js.tbl = table_exp_obj.instance.exports.tbl;
    import_object.js.wasm_increment = table_exp_obj.instance.exports.increment;
    import_object.js.wasm_decrement = table_exp_obj.instance.exports.decrement;

    let table_test_obj = await WebAssembly.instantiate(new Uint8Array(test_bytes), import_object);
    ({ js_table_test, js_import_test, wasm_table_test, wasm_import_test } = table_test_obj.instance.exports);

    // 1.
    i = 0;
    let start = Date.now();
    js_table_test();
    let time = Date.now() - start;
    console.log('js_table_test time=' + time);

    // 2.
    i = 0;
    start = Date.now();
    js_import_test();
    time = Date.now() - start;
    console.log('js_import_test time=' + time);

    // 3.
    i = 0;
    start = Date.now();
    wasm_table_test();
    time = Date.now() - start;
    console.log('wasm_table_test time=' + time);

    // 4.
    i = 0;
    start = Date.now();
    wasm_import_test();
    time = Date.now() - start;
    console.log('wasm_import_test time=' + time);

})();