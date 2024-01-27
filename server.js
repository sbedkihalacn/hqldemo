const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to handle file uploads
app.post('/upload', upload.single('inputFile'), (req, res) => {
    const hqlContent = req.file.buffer.toString('utf-8');
    const apiKey = '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';
    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

    fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Convert following hql to yaml: \n ${hqlContent}` }],
            temperature: 0,
            max_tokens: 100
        }),
    })
    .then(response => response.json())
    .then(result => {
        const yamlContent = result.choices[0].message.content;

        // Save the YAML output to a file on the server
        const outputFileName = `output_${Date.now()}.yaml`;
        const outputFile = path.join(__dirname, 'output', outputFileName);
        fs.writeFileSync(outputFile, yamlContent);

        // Send the file path back to the client
        res.json({ success: true, filePath: outputFile });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
