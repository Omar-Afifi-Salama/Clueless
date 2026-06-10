// GLOBAL VARIABLES
let wordBank = null;

const templates = [
    (format, domain, tech, audience) => `Build ${format} for ${domain} using ${tech}, specifically designed for ${audience}.`,
    (format, domain, tech, audience) => `Develop ${format} to tackle ${domain}, built with ${tech} and tailored to ${audience}.`,
    (format, domain, tech, audience) => `Create ${format} aimed at ${audience} that focuses on ${domain}, powered entirely by ${tech}.`,
    (format, domain, tech, audience) => `Using ${tech}, engineer ${format} centered around ${domain} to help ${audience}.`,
    (format, domain, tech, audience) => `Design ${format} for ${audience} to explore ${domain}, utilizing ${tech} under the hood.`,
    (format, domain, tech, audience) => `A ${tech}-based ${format} that revolutionizes ${domain} for a target demographic of ${audience}.`,
    (format, domain, tech, audience) => `Targeting ${audience}? Build ${format} about ${domain} using ${tech}.`,
    (format, domain, tech, audience) => `Program ${format} in ${tech} that makes ${domain} more accessible for ${audience}.`,
    (format, domain, tech, audience) => `For your next project, write ${format} for ${audience} dealing with ${domain}, relying on ${tech}.`,
    (format, domain, tech, audience) => `Code ${format} utilizing ${tech} to manage ${domain}, keeping ${audience} in mind as the end users.`,
    (format, domain, tech, audience) => `Construct ${format} focused on ${domain}. Use ${tech} to bring it to life for ${audience}.`,
    (format, domain, tech, audience) => `An open-source ${format} for ${audience} interested in ${domain}, implemented via ${tech}.`,
    (format, domain, tech, audience) => `Prototype ${format} to gamify ${domain} for ${audience}, taking advantage of ${tech}.`,
    (format, domain, tech, audience) => `Solve problems in ${domain} for ${audience} by deploying ${format} written in ${tech}.`,
    (format, domain, tech, audience) => `Dive into ${tech} by building ${format} that simplifies ${domain} for ${audience}.`,
    (format, domain, tech, audience) => `Empower ${audience} with ${format} related to ${domain}, forged with ${tech}.`,
    (format, domain, tech, audience) => `A niche ${format} leveraging ${tech} to analyze ${domain}, perfect for ${audience}.`,
    (format, domain, tech, audience) => `Deploy ${format} exploring the depths of ${domain} for ${audience}, using ${tech} as the core stack.`,
    (format, domain, tech, audience) => `Launch ${format} targeting ${audience} to modernize ${domain}, scaling it with ${tech}.`,
    (format, domain, tech, audience) => `As a portfolio piece, craft ${format} concerning ${domain} for ${audience}, exclusively using ${tech}.`
];

// DOM CONSTANTS
const ideaContainer = document.querySelector(".idea-container");
const paradigmSelector = document.querySelector("#paradigm");
const formatSelector = document.querySelector("#format");
const domainSelector = document.querySelector("#domain");
const techStackSelector = document.querySelector("#tech-stack");
const audienceSelector = document.querySelector("#audience");

const generateButton = document.querySelector("#generateButton");
const favoriteButton = document.querySelector("#favoriteButton");

const historyList = document.querySelector("#history-list");
const favoritesList = document.querySelector("#favorite-list");

const exportButtons = document.querySelectorAll(".export-trigger-btn");

const clearHistoryButton = document.querySelector("#clear-history");
const clearFavoritesButton = document.querySelector("#clear-favorites");

// STATE
const history = loadFromStorage("generatorHistory");
const favorites = loadFromStorage("favorites");

// ASYNC DATA FETCH
async function initApplication() {
    try {
        const response = await fetch("../data/words.json");
        if (!response.ok) throw new Error(`HTTP Error: status ${response.status}`);

        wordBank = await response.json();

        populateParadigmDropdown();
        loadSelectorOptions();
        renderInitialLists();

        paradigmSelector.addEventListener("change", loadSelectorOptions);
    } catch (error) {
        updateIdeaContainer(`<div class="error-msg">⚠️ Failed to load project asset library: ${error.message}</div>`);
    }
}

// DROPDOWN LAYOUT BUILDERS
function createOptionHTML(name) {
    const option = document.createElement("option");
    option.innerText = name.charAt(0).toUpperCase() + name.slice(1);
    option.value = name;
    return option;
}

function populateParadigmDropdown() {
    wordBank.paradigms.forEach(p => {
        paradigmSelector.appendChild(createOptionHTML(p.name));
    });
}

function clearChildSelectors() {
    const defaultMarkup = '<option value="">Randomize</option>';
    formatSelector.innerHTML = defaultMarkup;
    domainSelector.innerHTML = defaultMarkup;
    techStackSelector.innerHTML = defaultMarkup;
    audienceSelector.innerHTML = defaultMarkup;
}

function loadSelectorOptions() {
    if (!wordBank) return;

    const currentFormat = formatSelector.value;
    const currentDomain = domainSelector.value;
    const currentTech = techStackSelector.value;
    const currentAudience = audienceSelector.value;

    clearChildSelectors();

    let targetFormats = [];
    let targetDomains = [];
    let targetTechs = [];

    if (paradigmSelector.value) {
        const selectedParadigm = wordBank.paradigms.find(p => p.name === paradigmSelector.value);
        if (selectedParadigm) {
            targetFormats = selectedParadigm.formats;
            targetDomains = selectedParadigm.domains;
            targetTechs = selectedParadigm.techs;
        }
    } else {
        wordBank.paradigms.forEach(p => {
            targetFormats = targetFormats.concat(p.formats);
            targetDomains = targetDomains.concat(p.domains);
            targetTechs = targetTechs.concat(p.techs);
        });
    }

    targetFormats.forEach(item => formatSelector.appendChild(createOptionHTML(item.name)));
    targetDomains.forEach(item => domainSelector.appendChild(createOptionHTML(item.name)));
    targetTechs.forEach(item => techStackSelector.appendChild(createOptionHTML(item.name)));
    wordBank.global_audiences.forEach(item => audienceSelector.appendChild(createOptionHTML(item.name)));

    if ([...formatSelector.options].some(o => o.value === currentFormat)) formatSelector.value = currentFormat;
    if ([...domainSelector.options].some(o => o.value === currentDomain)) domainSelector.value = currentDomain;
    if ([...techStackSelector.options].some(o => o.value === currentTech)) techStackSelector.value = currentTech;
    if ([...audienceSelector.options].some(o => o.value === currentAudience)) audienceSelector.value = currentAudience;
}

function updateIdeaContainer(htmlContent) {
    ideaContainer.innerHTML = htmlContent;
}

// STORAGE PIPELINES
function loadFromStorage(key) {
    const rawData = localStorage.getItem(key);
    return rawData ? JSON.parse(rawData) : [];
}

function addIdeaToState(idea, dataArray, storageKey) {
    if (idea && idea.trim() !== "" && !idea.includes("error-msg") && idea !== "Empty..." && idea !== dataArray[0]) {
        dataArray.unshift(idea);
        localStorage.setItem(storageKey, JSON.stringify(dataArray));
        return true;
    }
    return false;
}

function removeItemFromState(ideaString, dataArray, storageKey) {
    const ideaIndex = dataArray.indexOf(ideaString);
    if (ideaIndex !== -1) {
        dataArray.splice(ideaIndex, 1);
        localStorage.setItem(storageKey, JSON.stringify(dataArray));
    }
}

function clearState(dataArray, storageKey, listDOMElement) {
    localStorage.removeItem(storageKey);
    dataArray.length = 0;
    listDOMElement.innerHTML = "";
}

// VISUAL RENDERER
function refreshListCounters(listEl) {
    const items = listEl.querySelectorAll("li");
    const isReversed = listEl.hasAttribute("reversed");
    const total = items.length;
    items.forEach((li, i) => {
        const num = isReversed ? total - i : i + 1;
        li.setAttribute("data-counter", String(num).padStart(2, "0"));
    });
}

function renderItemHTML(htmlContent, targetList, atBottom = false) {
    const item = document.createElement("li");
    item.innerHTML = htmlContent;

    if (targetList.id === "history-list") {
        const favoriteBtn = document.createElement("button");
        favoriteBtn.innerText = "*";
        favoriteBtn.className = "favorite-btn";
        favoriteBtn.dataset.idea = htmlContent;
        item.appendChild(favoriteBtn);
    }

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.idea = htmlContent;
    item.appendChild(deleteButton);

    if (atBottom) {
        targetList.appendChild(item);
    } else {
        targetList.prepend(item);
    }

    refreshListCounters(targetList);
}

function renderInitialLists() {
    if (history.length > 0) history.forEach(idea => renderItemHTML(idea, historyList, true));
    if (favorites.length > 0) favorites.forEach(idea => renderItemHTML(idea, favoritesList, true));
    refreshListCounters(historyList);
    refreshListCounters(favoritesList);
}

// ALGORITHM
function getRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateFunnelComponents() {

    let chosenParadigm = null;
    if (paradigmSelector.value) {
        chosenParadigm = wordBank.paradigms.find(p => p.name === paradigmSelector.value);
    } else {

        const possibleParadigms = wordBank.paradigms.filter(p => {
            if (formatSelector.value && !p.formats.some(f => f.name === formatSelector.value)) return false;
            if (domainSelector.value && !p.domains.some(d => d.name === domainSelector.value)) return false;
            if (techStackSelector.value && !p.techs.some(t => t.name === techStackSelector.value)) return false;
            return true;
        });

        if (possibleParadigms.length === 0) {
            throw new Error("Conflicting selection locks across paradigms! Clear some dropdowns.");
        }
        chosenParadigm = getRandomFrom(possibleParadigms);
    }

    const formatObj = formatSelector.value
        ? chosenParadigm.formats.find(f => f.name === formatSelector.value)
        : getRandomFrom(chosenParadigm.formats);

    const domainObj = domainSelector.value
        ? chosenParadigm.domains.find(d => d.name === domainSelector.value)
        : getRandomFrom(chosenParadigm.domains);

    const techObj = techStackSelector.value
        ? chosenParadigm.techs.find(t => t.name === techStackSelector.value)
        : getRandomFrom(chosenParadigm.techs);

    const audienceObj = audienceSelector.value
        ? wordBank.global_audiences.find(a => a.name === audienceSelector.value)
        : getRandomFrom(wordBank.global_audiences);

    return { chosenParadigm, formatObj, domainObj, techObj, audienceObj };
}

function calculateMetrics(paradigm, format, domain, tech) {
    const finalDifficulty = Math.min(10, Math.max(1, paradigm.base_difficulty + format.difficulty_mod + domain.difficulty_mod + tech.difficulty_mod));
    const totalHours = Math.max(2, paradigm.base_time + format.time_mod + domain.time_mod + tech.time_mod);

    return { finalDifficulty, totalHours };
}

function generateIdea() {
    if (!wordBank) return `<div class="error-msg">⚠️ System data missing.</div>`;

    const { chosenParadigm, formatObj, domainObj, techObj, audienceObj } = generateFunnelComponents();
    const { finalDifficulty, totalHours } = calculateMetrics(chosenParadigm, formatObj, domainObj, techObj);

    const hue = ((10 - finalDifficulty) / 9) * 120;
    const colorStyle = `color: hsl(${hue}, 85%, 35%); background-color: hsl(${hue}, 85%, 95%);`;

    const metricsMarkup = `
        <div class="idea-metrics">
            <span class="metric-badge" style="${colorStyle}">Difficulty: ${finalDifficulty}/10</span>
            <span class="time-badge">Est. Time: ~${totalHours} hrs</span>
        </div>
    `;

    const formatValue = `<span class="keyword format">${formatObj.name}</span>`;
    const domainValue = `<span class="keyword domain">${domainObj.name}</span>`;
    const techStackValue = `<span class="keyword tech-stack">${techObj.name}</span>`;
    const audienceValue = `<span class="keyword audience">${audienceObj.name}</span>`;

    const randomTemplateFunction = templates[Math.floor(Math.random() * templates.length)];
    const textMarkup = randomTemplateFunction(formatValue, domainValue, techStackValue, audienceValue);

    return `
        <div class="idea-text">${textMarkup}</div>
        ${metricsMarkup}
    `;
}

// EXPORT FUNCTIONS
function exportToJSON(dataArray, filename) {
    if (dataArray.length === 0) {
        alert("No data to export!");
        return;
    }

    const tempDiv = document.createElement("div");
    const totalItems = dataArray.length;

    const cleanJSONData = dataArray.map((htmlString, index) => {
        tempDiv.innerHTML = htmlString;
        const text = tempDiv.querySelector(".idea-text")?.innerText || tempDiv.innerText;
        const difficultyText = tempDiv.querySelector(".metric-badge")?.innerText || "0/10";
        const timeText = tempDiv.querySelector(".time-badge")?.innerText || "0 hrs";

        return {
            id: totalItems - index,
            prompt: text.trim(),
            difficulty: parseInt(difficultyText.replace(/[^0-9]/g, ""), 10) || 0,
            estimated_hours: parseInt(timeText.replace(/[^0-9]/g, ""), 10) || 0
        };
    });

    const exportEnvelope = {
        app_source: "Clueless",
        app_url: "https://clueless.vercel.app",
        export_timestamp: new Date().toISOString(),
        total_records: totalItems,
        ideas: cleanJSONData
    };

    const fileContent = JSON.stringify(exportEnvelope, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    triggerDownload(blob, `clueless-${filename}`);
}

function exportToExcel(dataArray, filename) {
    if (dataArray.length === 0) {
        alert("No data to export!");
        return;
    }

    const tempDiv = document.createElement("div");
    const totalItems = dataArray.length;

    const rows = dataArray.map((htmlString, index) => {
        tempDiv.innerHTML = htmlString;
        const rawText = tempDiv.querySelector(".idea-text")?.innerText || tempDiv.innerText;
        const difficultyText = tempDiv.querySelector(".metric-badge")?.innerText || "0/10";
        const timeText = tempDiv.querySelector(".time-badge")?.innerText || "0 hrs";

        return {
            "ID": totalItems - index,
            "Project Prompt": rawText.trim(),
            "Difficulty (Out of 10)": parseInt(difficultyText.replace(/[^0-9]/g, ""), 10) || 0,
            "Estimated Duration (Hours)": parseInt(timeText.replace(/[^0-9]/g, ""), 10) || 0
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, { origin: "A2" });

    worksheet["A1"] = { t: "s", v: "Generated via Clueless (https://clueless.vercel.app)" };

    worksheet["!merges"] = [
        { s: { c: 0, r: 0 }, e: { c: 3, r: 0 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Ideas");
    XLSX.writeFile(workbook, `clueless-${filename}`);
}

function triggerDownload(blob, fullyBrandedFilename) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fullyBrandedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function exportToTextOrMarkdown(dataArray, filename, isMarkdown = false) {
    if (dataArray.length === 0) {
        alert("No data to export!");
        return;
    }

    const tempDiv = document.createElement("div");
    const totalItems = dataArray.length;

    let fileHeader = isMarkdown
        ? `# Generated via Clueless\n> [Open Clueless App](https://clueless.vercel.app)\n\n***\n\n`
        : `========================================\nGENERATED VIA CLUELESS\nLink: https://clueless.example.com\n========================================\n\n`;

    const cleanedLines = dataArray.map((htmlString, index) => {
        tempDiv.innerHTML = htmlString;
        const text = tempDiv.querySelector(".idea-text")?.innerText || tempDiv.innerText;
        const difficulty = tempDiv.querySelector(".metric-badge")?.innerText || "";
        const time = tempDiv.querySelector(".time-badge")?.innerText || "";
        const displayId = totalItems - index;

        return isMarkdown
            ? `### Idea ${displayId}\n> ${text}\n- **${difficulty}**\n- **${time}**\n\n---`
            : `Idea ${displayId}:\n${text}\n${difficulty} | ${time}\n\n------------------------`;
    });

    const fileContent = fileHeader + cleanedLines.join("\n\n");
    const mimeType = isMarkdown ? "text/markdown" : "text/plain";
    const blob = new Blob([fileContent], { type: mimeType });
    triggerDownload(blob, `clueless-${filename}`);
}

function focusAndExpandDropdown(selectorElement) {
    if (!selectorElement) return;

    selectorElement.focus();

    setTimeout(() => {
        const openDropdownEvent = new KeyboardEvent("keydown", {
            key: " ",
            code: "Space",
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });

        selectorElement.dispatchEvent(openDropdownEvent);
    }, 10);

    selectorElement.dispatchEvent(openDropdownEvent);
}

// EVENT LISTENERS
generateButton.addEventListener("click", () => {
    try {
        const previousIdea = ideaContainer.innerHTML;

        if (addIdeaToState(previousIdea, history, "generatorHistory")) {
            renderItemHTML(previousIdea, historyList, false);
        }

        const newIdea = generateIdea();
        updateIdeaContainer(newIdea);
    } catch (error) {
        updateIdeaContainer(`<div class="error-msg">⚠️ ${error.message}</div>`);
    }
});

favoriteButton.addEventListener("click", () => {
    const currentDisplayedIdea = ideaContainer.innerHTML;
    if (addIdeaToState(currentDisplayedIdea, favorites, "favorites")) {
        renderItemHTML(currentDisplayedIdea, favoritesList, false);
    }
});

exportButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const container = button.closest(".export-container");
        if (!container) return;

        const targetCollection = container.getAttribute("data-collection");
        const selectedFormat = container.querySelector(".export-format").value;

        if (selectedFormat === "") {
            alert("Please Select A File Format.");
            return;
        }

        const activeArray = (targetCollection === "history") ? history : favorites;
        const defaultBaseName = (targetCollection === "history") ? "project-history" : "favorite-ideas";

        switch (selectedFormat) {
            case "txt":
                exportToTextOrMarkdown(activeArray, `${defaultBaseName}.txt`, false);
                break;
            case "md":
                exportToTextOrMarkdown(activeArray, `${defaultBaseName}.md`, true);
                break;
            case "xlsx":
                exportToExcel(activeArray, `${defaultBaseName}.xlsx`);
                break;
            case "json":
                exportToJSON(activeArray, `${defaultBaseName}.json`);
                break;
        }
    });
});

clearHistoryButton.addEventListener("click", () => {
    clearState(history, "generatorHistory", historyList);
    refreshListCounters(historyList);
});

clearFavoritesButton.addEventListener("click", () => {
    clearState(favorites, "favorites", favoritesList);
    refreshListCounters(favoritesList);
});

historyList.addEventListener("click", (event) => {
    if (event.target.nodeName === "BUTTON") {
        if (event.target.className === "delete-btn") {
            const ideaMarkup = event.target.dataset.idea;
            removeItemFromState(ideaMarkup, history, "generatorHistory");
            event.target.parentElement.remove();
            refreshListCounters(historyList);
        } else if (event.target.className === "favorite-btn") {
            const ideaMarkup = event.target.dataset.idea;
            if (addIdeaToState(ideaMarkup, favorites, "favorites")) {
                renderItemHTML(ideaMarkup, favoritesList, false);
            }
        }
    }
});

favoritesList.addEventListener("click", (event) => {
    if (event.target.nodeName === "BUTTON") {
        const ideaMarkup = event.target.dataset.idea;
        removeItemFromState(ideaMarkup, favorites, "favorites");
        event.target.parentElement.remove();
        refreshListCounters(favoritesList);
    }
});

window.addEventListener("load", initApplication);

window.addEventListener("beforeunload", () => {
    const currentOnScreenIdea = ideaContainer.innerHTML;
    addIdeaToState(currentOnScreenIdea, history, "generatorHistory");
});

const activeKeys = new Set();

window.addEventListener("keydown", (event) => {
    if (event.target.tagName === "SELECT" || event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return;
    }

    const key = event.key.toLowerCase();
    activeKeys.add(key);

    const isShiftPressed = event.shiftKey;

    if (activeKeys.has("e") && activeKeys.has("h")) {
        event.preventDefault();
        if (activeKeys.has("t")) exportToTextOrMarkdown(history, "project-history.txt", false);
        if (activeKeys.has("m")) exportToTextOrMarkdown(history, "project-history.md", true);
        if (activeKeys.has("x")) exportToExcel(history, "project-history.xlsx");
        if (activeKeys.has("j")) exportToJSON(history, "project-history.json");
        return;
    }

    if (activeKeys.has("e") && activeKeys.has("f")) {
        event.preventDefault();
        if (activeKeys.has("t")) exportToTextOrMarkdown(favorites, "favorite-ideas.txt", false);
        if (activeKeys.has("m")) exportToTextOrMarkdown(favorites, "favorite-ideas.md", true);
        if (activeKeys.has("x")) exportToExcel(favorites, "favorite-ideas.xlsx");
        if (activeKeys.has("j")) exportToJSON(favorites, "favorite-ideas.json");
        return;
    }

    if (activeKeys.has("c") && activeKeys.has("h")) {
        event.preventDefault();
        if (confirm("Clear your generation history log?")) {
            clearState(history, "generatorHistory", historyList);
        }
        return;
    }

    if (activeKeys.has("c") && activeKeys.has("f")) {
        event.preventDefault();
        if (confirm("Clear your saved favorites bookmarked list?")) {
            clearState(favorites, "favorites", favoritesList);
        }
        return;
    }

    if (isShiftPressed) {
        switch (key) {
            case "p": // Shift + P -> Paradigm
                event.preventDefault();
                focusAndExpandDropdown(paradigmSelector);
                return;
            case "f": // Shift + F -> Format
                event.preventDefault();
                focusAndExpandDropdown(formatSelector);
                return;
            case "d": // Shift + D -> Domain
                event.preventDefault();
                focusAndExpandDropdown(domainSelector);
                return;
            case "t": // Shift + T -> Tech Stack
                event.preventDefault();
                focusAndExpandDropdown(techStackSelector);
                return;
            case "a": // Shift + A -> Audience
                event.preventDefault();
                focusAndExpandDropdown(audienceSelector);
                return;
        }
    }

    if (activeKeys.has(" ")) {
        event.preventDefault();
        generateButton.click();
    }

    if (activeKeys.has("f") && !isShiftPressed) {
        favoriteButton.click();
    }

    if (activeKeys.has("g") && !isShiftPressed) {
        generateButton.click();
    }

    if (activeKeys.has("c")) {
        if (confirm("Are you sure you want to clear your generation history log?")) {
            clearHistoryButton.click();
        }
    }

    if (activeKeys.has("?")) {
        alert(
            "CLUELESS KEYBOARD SHORTCUT REGISTRY\n\n" +
            "Core Workspace Commands:\n" +
            "  [Spacebar] or [G]  - Compile / Generate New Prompt\n" +
            "  [F]                - Save Active Prompt to Favorites\n" +
            "  [C]                - Trigger UI History Clear Confirmation\n" +
            "  [?]                - View This Documentation Overlay\n\n" +
            "Quick Dropdown Focus (Hold Shift + Key):\n" +
            "  [Shift + P]        - Open Paradigm Selection Menu\n" +
            "  [Shift + F]        - Open Format Selection Menu\n" +
            "  [Shift + D]        - Open Domain Selection Menu\n" +
            "  [Shift + T]        - Open Technical Stack Selection Menu\n" +
            "  [Shift + A]        - Open Target Audience Selection Menu\n\n" +
            "Instant Local Storage Flush (Bypasses UI Prompts):\n" +
            "  [C + H]            - Wipe Generation History Array\n" +
            "  [C + F]            - Wipe Saved Bookmarked Favorites Array\n\n" +
            "Data Export Pipelines (3-Key Combinations):\n" +
            "  Step 1: Hold down the [E] key.\n" +
            "  Step 2: Add either [H] (History) or [F] (Favorites) to the hold.\n" +
            "  Step 3: Tap a format target key to compile and trigger your download:\n" +
            "          -> [T] Plain Text (.txt)\n" +
            "          -> [M] Markdown Documentation (.md)\n" +
            "          -> [X] Excel Spreadsheet (.xlsx)\n" +
            "          -> [J] JSON Structured Data Stream (.json)"
        );
    }
});

window.addEventListener("keyup", (event) => {
    activeKeys.delete(event.key.toLowerCase());
});

window.addEventListener("blur", () => {
    activeKeys.clear();
});
