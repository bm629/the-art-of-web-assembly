const fs = require('fs');
const { buffer } = require('stream/consumers');
const bytes = fs.readFileSync('./number_string.wasm');

const value = parseInt(process.argv[2]);
const memory = new WebAssembly.Memory({ initial: 1 });

const import_object = {
    env: {
        buffer: memory,
        print_string: (pos, len) => {
            const bytes = new Uint8Array(memory.buffer, pos, len);
            const string = new TextDecoder('utf8').decode(bytes);
            console.log(`>${string}!`);
        }
    }
};

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes), import_object);
    obj.instance.exports.to_string(value);
})();