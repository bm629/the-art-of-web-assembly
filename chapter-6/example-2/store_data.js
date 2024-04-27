const fs = require('fs');
const colors = require('colors');

const bytes = fs.readFileSync('./store_data.wasm');
const mem = new WebAssembly.Memory({ initial: 1 });
const mem_i32 = new Uint32Array(mem.buffer);
const data_addr = 32;
const data_i32_index = data_addr / 4;
const data_count = 16;

const importObject = {
    env: {
        mem,
        data_addr,
        data_count
    }
};

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes), importObject);

    for(let i = 0; i < data_i32_index + data_count + 4; i++) {
        let data = mem_i32[i];
        if (data !== 0) {
            console.log(`data[${i}]=${data}`.red.bold);
        } else {
            console.log(`data[${i}]=${data}`);
        }
    }
})();