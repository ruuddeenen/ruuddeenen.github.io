const inputEditor = CodeMirror.fromTextArea(document.getElementById("input"), {
    mode: "application/json",
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true  // Add line wrapping to prevent horizontal stretching
});

const outputEditor = CodeMirror.fromTextArea(document.getElementById("output"), {
    mode: "application/json",
    lineNumbers: true,
    readOnly: true,
    matchBrackets: true,
    lineWrapping: true  // Add line wrapping to prevent horizontal stretching
});

inputEditor.on("change", () => {
    formatJSON();
});

function extractJSON(text) {
    const match = text.match(/\{[^]*\}/);
    return match ? match[0] : text;
}

function formatJSON() {
    const input = inputEditor.getValue();
    
    const jsonText = extractJSON(input);
    markNonJSON(input, jsonText);
    try {
        const json = JSON.parse(jsonText);
        outputEditor.setValue(JSON.stringify(json, null, 4));
    } catch (e) {
        outputEditor.setValue(`Fout in JSON: ${e.message}`);
    }
}

function markNonJSON(fullText, jsonText) {
    inputEditor.operation(() => {
        inputEditor.getAllMarks().forEach(mark => mark.clear());
        const startIdx = fullText.indexOf(jsonText);
        if (startIdx === -1) return;
        if (startIdx > 0) {
            inputEditor.markText({line: 0, ch: 0}, inputEditor.posFromIndex(startIdx), {className: "marked-text"});
        }
        const endIdx = startIdx + jsonText.length;
        if (endIdx < fullText.length) {
            inputEditor.markText(inputEditor.posFromIndex(endIdx), {line: inputEditor.lineCount(), ch: 0}, {className: "marked-text"});
        }
    });
}
