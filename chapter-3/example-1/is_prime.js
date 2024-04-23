const fs = require('fs');
let bytes = fs.readFileSync('is_prime.wasm');

const value = parseInt(process.argv[2]);

(async () => {
    const obj = await WebAssembly.instantiate(new Uint8Array(bytes));
    const is_prime = obj.instance.exports.is_prime(value);
    if(is_prime) {
        console.log(`${value} is a prime number`)
    } else {
        console.log(`${value} is not a prime number`)
    }
})();