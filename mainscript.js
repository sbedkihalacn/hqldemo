async function convertHqlFilesToYaml() {
    const inputFiles = document.getElementById('inputFile').files;
    const outputFolder = document.getElementById('outputFolder').value;

    if (inputFiles.length === 0 || !outputFolder) {
        alert('Please select one or more input files and provide an output folder name.');
        return;
    }

    for (let i = 0; i < inputFiles.length; i++) {
        const inputFile = inputFiles[i];
        const formData = new FormData();
        formData.append('inputFile', inputFile);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                console.log(`File ${i + 1} processed successfully. Output saved at: ${result.filePath}`);
            } else {
                console.error('Error processing file:', result.error);
            }
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }
}
