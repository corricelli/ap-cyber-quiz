// --- 1. CONFIGURATION ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgftyROE4bex5wBf12vYU-FLOa5KlhNJvrKMAt07u5xP0zTkXbaK2A57jd5XuhJJhbNj0TymDdxnL1/pub?gid=1837788739&single=true&output=csv';
const container = document.getElementById('questions-container');

// --- 2. MAIN DATA FETCHING FUNCTION ---
function loadQuestions() {
  // Check if PapaParse is loaded before trying to use it
  if (typeof Papa === 'undefined') {
      console.error('PapaParse library not loaded. Check index.html <script> tag.');
      container.innerHTML = 'Error: Parsing library not loaded.';
      return;
  }
  
  Papa.parse(CSV_URL, {
    download: true,   // Tells Papa Parse to download the file from the URL
    header: true,     // Converts the first row (headers) into object keys
    complete: function(results) {
      // The raw array of data objects
      const questions = results.data;
      
      // Filter out any blank rows Papa Parse might pick up. 
      // We use 'Question Text' because we know it should be filled in.
      //const validQuestions = questions.filter(q => q["Question Text"]); 
      const validQuestions = questions;
      
      console.log('Successfully loaded and parsed questions:', validQuestions);
      
      // Pass the cleaned data to the rendering function
      renderQuestions(validQuestions); 
    },
    error: function(error) {
      console.error('Error fetching or parsing data:', error);
      container.innerHTML = 'Error loading questions. Check the Console for details.';
    }
  });
}

// --- 3. RENDERING FUNCTION ---
function renderQuestions(questions) {
  // Clear the "Loading questions..." message
  container.innerHTML = ''; 
  
  // Check if we actually have data
  if (questions.length === 0) {
    container.innerHTML = 'No questions found in the Google Sheet.';
    return;
  }
  
  // Loop through all valid questions and display them
  questions.forEach((question, index) => {
    
    // Create the HTML structure for a single question
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
        | Skill: ${question.Skill}
      </div>
      <hr>
    `;
    
    container.appendChild(questionDiv);
  });
}

// Start the whole process when the script runs
loadQuestions();
