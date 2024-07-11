const axios = require('axios');

async function main() {
    const res = await axios.post('http://localhost:3000/death_counter', {increment: 1});
    console.log(res.data);
}

main();