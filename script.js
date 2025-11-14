const CSV_URL = 'https://drive.google.com/file/d/1siwwnlWxo8Wmz_gyEwen8dZvkYHBxS4Z/view?usp=sharing'; 

function loadQuestions() {
  Papa.parse(CSV_URL, {
    download: true, // Tell Papa Parse to download the file from the URL
    header: true,   // Treat the first row as headers/keys (Unit, QuestionText, etc.)
    complete: function(results) {
      // results.data is now an array of JavaScript objects!
      const questions = results.data;
      
      // Filter out any blank rows Google Sheets may include
      const validQuestions = questions.filter(q => q.QuestionID); 
      
      console.log('Successfully loaded questions:', validQuestions);
      
      // **CALL A FUNCTION HERE TO RENDER THE QUESTIONS ON YOUR PAGE**
      renderQuestions(validQuestions); 
    },
    error: function(error) {
      console.error('Error fetching or parsing data:', error);
    }
  });
}

function renderQuestions(questions) {
  const container = document.getElementById('questions-container');
  // Simple example: list each question text
  questions.forEach(question => {
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
      <h3>Unit ${question.Unit}</h3>
      <p>Question: ${question.QuestionText}</p>
      `;
    container.appendChild(questionDiv);
  });
}

// Start the process when the script loads
loadQuestions();
