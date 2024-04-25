const fs = require('fs');
const bytes = fs.readFileSync(__dirname + '/strings.wasm');

const memory = new WebAssembly.Memory({ initial: 1 });
const max_mem = 65535;

const importObject = {
    env: {
        buffer: memory,
        str_pos_len: (pos, len) => {
            const bytes = new Uint8Array(memory.buffer, pos, len);
            const log_string = new TextDecoder('utf8').decode(bytes);
            console.log(log_string);
        },
        null_str: (pos) => {
            let bytes = new Uint8Array(memory.buffer, pos, max_mem - pos);
            let log_string = new TextDecoder('utf8').decode(bytes);
            log_string = log_string.split('\0')[0];
            console.log(log_string);
        },
        len_prefix: (pos) => {
            const str_len = new Uint8Array(memory.buffer, pos, 1)[0];
            const bytes = new Uint8Array(memory.buffer, pos + 1, str_len);
            let log_string = new TextDecoder('utf8').decode(bytes);
            console.log(log_string);
        }
    }
};

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes), importObject);
    let main = obj.instance.exports.main;
    main();
})();