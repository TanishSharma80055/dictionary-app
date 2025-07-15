const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value.trim();
    if (!inpWord) {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }
    fetch(`${url}${inpWord}`)
        .then((response) => {
            if (!response.ok) throw new Error("Word not found");
            return response.json();
        })
        .then((data) => {
            const wordData = data[0];
            const phonetic = wordData.phonetic || "";
            const partOfSpeech = wordData.meanings[0].partOfSpeech;
            const definition = wordData.meanings[0].definitions[0].definition;
            let example = "No example available for this word.";
            for (let meaning of wordData.meanings) {
                for (let def of meaning.definitions) {
                    if (def.example) {
                        example = def.example;
                        break;
                    }
                }
                if (example !== "No example available for this word.") break;
            }
            const audio = wordData.phonetics.find(p => p.audio)?.audio || "";
            result.innerHTML = `
                <div class="word">
                    <h3>${wordData.word}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${partOfSpeech}</p>
                    <p>/${phonetic}/</p>
                </div>
                <p class="word-meaning">${definition}</p>
                <p class="word-example">${example}</p>
            `;
            sound.setAttribute("src", audio);
        })
        .catch((err) => {
            console.error(err);
            result.innerHTML = `<h3 class="error">Couldn't find the word. Please try another.</h3>`;
        });
});

function playSound() {
    if (sound.getAttribute("src")) {
        sound.play();
    } else {
        alert("No audio available for this word.");
    }
}
document.getElementById("inp-word").addEventListener("keypress", (e) => {
    if (e.key === "Enter") btn.click();
});
