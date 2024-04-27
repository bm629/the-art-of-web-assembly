const fs = require('fs');
const bytes = fs.readFileSync('./pointer.wasm');

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes));
    let ptr_value = obj.instance.exports.get_ptr();
    console.log(ptr_value);
})();