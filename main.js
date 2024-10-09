import $ from "jquery";

let currentQuoteId = null;

async function fetchQuote(id) {
  try {
    const response = await $.get(
      `https://api.breakingbadquotes.xyz/v1/quotes/${id}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

async function getRandomQuote() {
  try {
    const random = Math.floor(Math.random() * 30);
    const response = await fetchQuote(random);
    currentQuoteId = random;
    const text = await changeHtml(response[0]);
    return text;
  } catch (error) {
    console.error("Error", error);
  }
}

async function changeHtml(quote) {
  $("#author").text(`Author: ${quote.author}`);
  $("#quote").text(quote.quote);
  return quote.quote;
}

async function clickGetApiButton() {
  try {
    $("#info").click(async () => {
      await getRandomQuote();
    });
  } catch (error) {
    console.error("Error", error);
  }
}

function saveQuoteIntoStorage() {
  $("#save").click(() => {
    if (currentQuoteId !== null) {
      const text = $("#quote").text();
      const author = $("#author").text().replace("Author: ", "");

      const existingQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

      const isDuplicate = existingQuotes.some(
        (quote) => quote.id === currentQuoteId
      );

      if (!isDuplicate) {
        const newQuote = {
          id: currentQuoteId,
          author: author,
          quote: text,
        };

        existingQuotes.push(newQuote);

        localStorage.setItem("quotes", JSON.stringify(existingQuotes));
        console.log(`Cita guardada: ${text}`);
        getAllSavedQuotes();
      } else {
        console.log(`La cita con ID: ${currentQuoteId} ya está guardada.`);
      }
    }
  });
}

function removeQuoteFromStorage() {
  $("#remove").click(() => {
    if (currentQuoteId !== null) {
      const existingQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      const updatedQuotes = existingQuotes.filter(
        (quote) => quote.id !== currentQuoteId
      );

      localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
      console.log(`Cita eliminada con ID: ${currentQuoteId}`);
      getAllSavedQuotes();
    }
  });
}

function getAllSavedQuotes() {
  const quotesContainer = $(".container-all-quotes");
  quotesContainer.empty();
  quotesContainer.css("display", "flex");
  quotesContainer.css("padding", "30px 0");

  const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  
  if (savedQuotes.length > 0) {
    quotesContainer.append(
      $("<div>").text("ALL SAVED QUOTES").addClass("header")
    );
    savedQuotes.forEach((quote) => {
      const newDiv = $("<div>").addClass("quote-save");

      const newId = $("<span>").text(quote.id).addClass("quote-save-span");
      const newAuthor = $("<span>").text(quote.author).addClass("quote-save-span");
      const newQuote = $("<span>").text(quote.quote).addClass("quote-save-span");

      newDiv.append(newId);
      newDiv.append(newAuthor);
      newDiv.append(newQuote);
      quotesContainer.append(newDiv);
    });
  } else {
    quotesContainer.append($("<div>").text("No hay citas guardadas."));
  }

  $("#main").append(quotesContainer);
  return quotesContainer;
}

function deleteAllMySaves() {
  $("#remove-all").click(() => {
    localStorage.clear();
    $(".container-all-quotes").empty().text("No hay citas guardadas.");
  });
}

function searchQuote() {
  $("#search-input").on("input", () => {
    const searchValue = $("#search-input").val().trim();
    const quotesContainer = $(".container-all-quotes");
    quotesContainer.empty();

    const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    if (searchValue) {
      const filteredQuotes = savedQuotes.filter(
        (quote) => quote.id.toString().includes(searchValue)
      );

      if (filteredQuotes.length > 0) {
        filteredQuotes.forEach((quote) => {
          const newDiv = $("<div>").addClass("quote-save");

          const newId = $("<span>").text(quote.id).addClass("quote-save-span");
          const newAuthor = $("<span>").text(quote.author).addClass("quote-save-span");
          const newQuote = $("<span>").text(quote.quote).addClass("quote-save-span");

          newDiv.append(newId);
          newDiv.append(newAuthor);
          newDiv.append(newQuote);
          quotesContainer.append(newDiv);
        });
      } else {
        quotesContainer.append($("<div>").text("No se encontraron citas con ese ID."));
      }
    } else {
      getAllSavedQuotes(); 
    }
  });
}

$(window).on("load", () => {
  getAllSavedQuotes(); 
  getRandomQuote();
  clickGetApiButton();
  saveQuoteIntoStorage();
  removeQuoteFromStorage();
  deleteAllMySaves();
  searchQuote(); 
});
