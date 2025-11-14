// --- 1. CONFIGURATION ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgftyROE4bex5wBf12vYU-FLOa5KlhNJvrKMAt07u5xP0zTkXbaK2A57jd5XuhJJhbNj0TymDdxnL1/pub?gid=1837788739&single=true&output=csv'; 
const container = document.getElementById('questions-container');

// 🆕 Global variable to hold all questions after loading
let allQuestions = []; 
const unitFilter = document.getElementById('unit-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const questionCount = document.getElementById('question-count');


// --- 2. MAIN DATA FETCHING FUNCTION ---
function loadQuestions() {
    // ... (Papa Parse check and error handling remains the same) ...
    if (typeof Papa === 'undefined') {
        console.error('PapaParse library not loaded. Check index.html <script> tag.');
        container.innerHTML = 'Error: Parsing library not loaded.';
        return;
    }

    Papa.parse(CSV_URL, {
        download: true,   
        header: true,     
        skipEmptyLines: true, 
        delimiter: ",",      
        
        complete: function(results) {
            // Filter out empty rows, store the clean data globally
            allQuestions = results.data.filter(q => q["Question Text"]); 
            
            console.log('Total questions loaded:', allQuestions.length);

            // 🚨 ADD THIS LINE 🚨 
            if (allQuestions.length > 0) {
                console.log("ACTUAL KEYS IN FIRST QUESTION OBJECT:", Object.keys(allQuestions[0]));
            }
            
            // 🆕 Populate the dropdowns with unique values
            populateFilters(allQuestions);
            
            // 🆕 Attach event listeners to filters
            unitFilter.addEventListener('change', filterQuestions);
            difficultyFilter.addEventListener('change', filterQuestions);

            // 🆕 Render the initial set (which is all questions)
            filterQuestions(); 
        },
        error: function(error) {
            console.error('Error fetching or parsing data:', error);
            container.innerHTML = 'Error loading questions. Check the Console for details.';
        }
    });
}

// --- 3. POPULATE FILTER DROPDOWNS ---
function populateFilters(questions) {
    // Extract unique unit numbers and difficulty levels
    const uniqueUnits = [...new Set(questions.map(q => q["Unit Number"]))].sort();
    const uniqueDifficulties = [...new Set(questions.map(q => q["Difficulty Level"]))].sort();

    // Populate Unit Filter
    uniqueUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = `Unit ${unit}`;
        unitFilter.appendChild(option);
    });

    // Populate Difficulty Filter
    uniqueDifficulties.forEach(diff => {
        const option = document.createElement('option');
        option.value = diff;
        // Use the difficulty level directly (e.g., '1', '2', etc.)
        option.textContent = `Difficulty ${diff}`; 
        difficultyFilter.appendChild(option);
    });
}


// --- 4. FILTERING LOGIC ---
function filterQuestions() {
    const selectedUnit = unitFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    let filteredQuestions = allQuestions;

    // Filter by Unit
    if (selectedUnit !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q["Unit Number"] === selectedUnit);
    }

    // Filter by Difficulty
    if (selectedDifficulty !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q["Difficulty Level"] === selectedDifficulty);
    }
    
    // Update the question count display
    questionCount.textContent = `Showing ${filteredQuestions.length} of ${allQuestions.length} questions.`;

    // Render the final filtered set
    renderQuestions(filteredQuestions);
}


// --- 5. RENDERING FUNCTION (Same as before, but called with filtered data) ---
function renderQuestions(questions) {
    container.innerHTML = ''; // Clear container

    if (questions.length === 0) {
        container.innerHTML = 'No questions match the current filter selection.';
        return;
    }

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'ap-question-card'; 
        
        // Use the EXACT header names as keys!
        questionDiv.innerHTML = `
            <h2>Question ${index + 1} (Unit ${question["Unit Number"]})</h2>
            <p class="question-text">${question["Question Text"]}</p>
            
            <div class="answer-choices">
                <p>A) ${question["Answer Choice A"]}</p>
                <p>B) ${question["Answer Choice B"]}</p>
                <p>C) ${question["Answer Choice C"]}</p>
                <p>D) ${question["Answer Choice D"]}</p>
            </div>
            
            <div class="correct-answer">
                Correct Answer: <strong>${question["Correct Answer"]}</strong> 
                | Difficulty: ${question["Difficulty Level"]}
            </div>
            <hr>
        `;
        
        container.appendChild(questionDiv);
    });
}

// Start the whole process when the script runs
loadQuestions();
