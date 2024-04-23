const fs = require('fs');
const bytes = fs.readFileSync('./func_perform.wasm');

let i = 0;
const import_object = {
    js: {
        external_call: function() {
            i++;
            return i;
        }
    }
};

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes), import_object);

    ({ wasm_call, js_call } = obj.instance.exports);

    let start = Date.now();
    wasm_call();
    let time = Date.now() - start;
    console.log('wasm_call time=' + time);

    start = Date.now();
    js_call();
    time = Date.now() - start;
    console.log('js_call time=' + time);
})();