async function handleSubmit(e) {
  e.preventDefault();
  const word = document.getElementById("wordInput").value;
  const dictionary = document.getElementById("dictionary");
  const submitButton = document.querySelector("button[type='submit']");

  submitButton.disabled = true;
  submitButton.style.backgroundColor = "gray";
  submitButton.style.cursor = "not-allowed";
  submitButton.innerText = "Fetching data...";

  try {
    const response = await fetch(`http://localhost:3000?word=${word}`);
    const data = await response.text();
    dictionary.innerText = data.split("-")[1] || data;
  } catch (error) {
    console.error("Error fetching data:", error);
    dictionary.innerText = "Error fetching data.";
  } finally {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#007bff";
    submitButton.style.cursor = "pointer";
    submitButton.innerText = "Translate";
  }
}
