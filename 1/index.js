const express = require('express')
const app = express();
const axios = require('axios');
const port = 8008

const urlss = ["http://20.244.56.144/numbers/primes","http://20.244.56.144/numbers/fibo","http://20.244.56.144/numbers/odd","http://20.244.56.144/numbers/rand"]

app.get('/', (req, res) => {
    res.send('Hello');
});


app.get('/numbers', async(req, res) => {
    const urlParams = req.query.url;

    if (!urlParams) {
        return res.status(400).json({ error: 'No URLs provided' });
    }

    if(urlss.includes(req.query.url)){
    const urls = Array.isArray(urlParams) ? urlParams : [urlParams];
        const data = [];
        try{
            const responseData = await Promise.all(urls.map(async url => {
            try {

                const response = await axios.get(url);
                const numericData = response.data; 

                data.push(numericData);
                return {
                    url,numericData
                };
            } catch (error) {
                return {
                    error:"Not found"
                };
            }
        }
        ))

        data.sort((a, b) => a - b);
        data = data.filter((value, index, self) => {return self.indexOf(value) === index;});

        res.json(responseData);
    }
    catch(err){
        res.status(500).json({error:"Serverside Error"});
    }
}
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});