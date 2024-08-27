const axios = require('axios');

async function main() {
    // const res = await axios.post('http://localhost:3000/death_counter', {increment: 1});
    // console.log(res.data);
    fetch("http://localhost:3000/death_counter", {
		method: "POST",
        headers: {'Content-type': "application/json"},
		body: JSON.stringify({ type: "counter", mode:"increment", value:100})
	}).then(resp => resp.json()).then(data => console.log(data)).catch(err => console.error("Request error :", err));
}

main();