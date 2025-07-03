// Populate the area and category dropdowns when the page loads
window.addEventListener("DOMContentLoaded", async function () {
  // Get the area select element
  const areaSelect = document.getElementById("area-select");
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  // A simple mapping of area/cuisine to flag emoji
  const areaFlags = {
    "American": "🇺🇸",
    "British": "🇬🇧",
    "Canadian": "🇨🇦",
    "Chinese": "🇨🇳",
    "Dutch": "🇳🇱",
    "Egyptian": "🇪🇬",
    "French": "🇫🇷",
    "Greek": "🇬🇷",
    "Indian": "🇮🇳",
    "Irish": "🇮🇪",
    "Italian": "🇮🇹",
    "Jamaican": "🇯🇲",
    "Japanese": "🇯🇵",
    "Kenyan": "🇰🇪",
    "Malaysian": "🇲🇾",
    "Mexican": "🇲🇽",
    "Moroccan": "🇲🇦",
    "Polish": "🇵🇱",
    "Portuguese": "🇵🇹",
    "Russian": "🇷🇺",
    "Spanish": "🇪🇸",
    "Thai": "🇹🇭",
    "Tunisian": "🇹🇳",
    "Turkish": "🇹🇷",
    "Vietnamese": "🇻🇳"
    // Add more as needed
  };

  // Fetch areas from the API and add them to the dropdown
  try {
    const areaResponse = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    const areaData = await areaResponse.json();
    if (areaData.meals) {
      areaData.meals.forEach((areaObj) => {
        const option = document.createElement("option");
        option.value = areaObj.strArea;
        // Add flag emoji if available, otherwise use globe emoji
        const flag = areaFlags[areaObj.strArea] ? areaFlags[areaObj.strArea] : "🌎";
        option.textContent = `${flag} ${areaObj.strArea}`;
        areaSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching areas:", error);
  }

  // --- BEGINNER-FRIENDLY CATEGORY DROPDOWN LOGIC ---

  // Get or create the category select element
  let categorySelect = document.getElementById("category-select");
  if (!categorySelect) {
    // If it doesn't exist, create it and add to the page (above area select)
    categorySelect = document.createElement("select");
    categorySelect.id = "category-select";
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    // Insert before areaSelect in the DOM
    areaSelect.parentNode.insertBefore(categorySelect, areaSelect);
  }

  // Fetch categories from the API and add them to the dropdown
  try {
    const catResponse = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const catData = await catResponse.json();
    if (catData.meals) {
      catData.meals.forEach((catObj) => {
        const option = document.createElement("option");
        option.value = catObj.strCategory;
        option.textContent = catObj.strCategory;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

// When the user selects an area, fetch and display meals for that area
document.getElementById("area-select").addEventListener("change", async function () {
  const area = this.value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Remove any open modal when area changes
  const oldModal = document.getElementById("recipe-modal");
  if (oldModal) {
    oldModal.remove();
  }

  if (!area) return;

  // Fetch meals for the selected area
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`
    );
    const data = await response.json();

    if (data.meals) {
      data.meals.forEach((meal) => {
        // Create a card for each meal
        const mealDiv = document.createElement("div");
        mealDiv.className = "meal";
        mealDiv.style.cursor = "pointer"; // Show pointer on hover
        mealDiv.style.background = "#f0f8ff"; // Light blue background
        mealDiv.style.border = "2px solid #4caf50"; // Green border
        mealDiv.style.borderRadius = "10px";
        mealDiv.style.margin = "10px";
        mealDiv.style.padding = "10px";
        mealDiv.style.display = "inline-block";
        mealDiv.style.textAlign = "center";
        mealDiv.style.boxShadow = "0 2px 8px rgba(76,175,80,0.15)";

        // Add meal title
        const title = document.createElement("h3");
        title.textContent = meal.strMeal;
        title.style.color = "#388e3c"; // Dark green

        // Add meal image
        const img = document.createElement("img");
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        img.style.border = "2px solid #81c784"; // Light green

        // Show modal with recipe details when mouse enters the card
        mealDiv.addEventListener("mouseenter", async function () {
          // Prevent multiple modals
          if (document.getElementById("recipe-modal")) return;

          try {
            // Fetch detailed info about the meal
            const detailResponse = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detailData = await detailResponse.json();
            const mealDetail = detailData.meals[0];

            // Create modal background
            const modalBg = document.createElement("div");
            modalBg.id = "recipe-modal";
            modalBg.style.position = "fixed";
            modalBg.style.top = "0";
            modalBg.style.left = "0";
            modalBg.style.width = "100vw";
            modalBg.style.height = "100vh";
            modalBg.style.background = "rgba(0,0,0,0.5)";
            modalBg.style.display = "flex";
            modalBg.style.justifyContent = "center";
            modalBg.style.alignItems = "center";
            modalBg.style.zIndex = "1000";

            // Create modal card
            const modalCard = document.createElement("div");
            modalCard.style.background = "#fffbe7"; // Light yellow
            modalCard.style.padding = "20px";
            modalCard.style.borderRadius = "12px";
            modalCard.style.maxWidth = "400px";
            modalCard.style.width = "90%";
            modalCard.style.boxShadow = "0 4px 16px rgba(255,193,7,0.25)";
            modalCard.style.position = "relative";
            modalCard.style.maxHeight = "80vh";
            modalCard.style.overflowY = "auto";
            modalCard.style.border = "3px solid #ff9800"; // Orange border

            // Recipe title
            const detailTitle = document.createElement("h2");
            detailTitle.textContent = mealDetail.strMeal;
            detailTitle.style.color = "#e65100"; // Deep orange

            // Recipe image
            const detailImg = document.createElement("img");
            detailImg.src = mealDetail.strMealThumb;
            detailImg.alt = mealDetail.strMeal;
            detailImg.style.maxWidth = "100%";
            detailImg.style.borderRadius = "8px";
            detailImg.style.border = "2px solid #ffd54f"; // Yellow border

            // Ingredients list
            const ingredientsList = document.createElement("ul");
            ingredientsList.style.marginTop = "10px";
            ingredientsList.style.background = "#fffde7";
            ingredientsList.style.padding = "10px";
            ingredientsList.style.borderRadius = "6px";
            ingredientsList.style.border = "1px solid #ffe082";
            const ingredientsTitle = document.createElement("strong");
            ingredientsTitle.textContent = "Ingredients:";
            ingredientsList.appendChild(ingredientsTitle);

            // Loop through possible 20 ingredients
            for (let i = 1; i <= 20; i++) {
              const ingredient = mealDetail[`strIngredient${i}`];
              const measure = mealDetail[`strMeasure${i}`];
              if (ingredient && ingredient.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = `${ingredient} - ${measure}`;
                li.style.color = "#6d4c41"; // Brown
                ingredientsList.appendChild(li);
              }
            }

            // Instructions
            const instructions = document.createElement("p");
            instructions.textContent = mealDetail.strInstructions;
            instructions.style.marginTop = "10px";
            instructions.style.background = "#e3f2fd";
            instructions.style.padding = "10px";
            instructions.style.borderRadius = "6px";
            instructions.style.border = "1px solid #90caf9";
            instructions.style.color = "#01579b"; // Blue

            // Add everything to modal card
            modalCard.appendChild(detailTitle);
            modalCard.appendChild(detailImg);
            modalCard.appendChild(ingredientsList);
            modalCard.appendChild(instructions);

            // Add modal card to modal background
            modalBg.appendChild(modalCard);

            // Add modal to the page
            document.body.appendChild(modalBg);

            // Remove modal when mouse leaves the card or modal
            function removeModal() {
              if (modalBg) {
                modalBg.remove();
              }
            }
            mealDiv.addEventListener("mouseleave", removeModal, { once: true });
            modalBg.addEventListener("mouseleave", removeModal, { once: true });

            // Also remove modal on click anywhere
            modalBg.addEventListener("click", removeModal);

          } catch (error) {
            console.error("Error fetching meal details:", error);
          }
        });

        // Add title and image to the meal card
        mealDiv.appendChild(title);
        mealDiv.appendChild(img);
        resultsDiv.appendChild(mealDiv);
      });
    } else {
      resultsDiv.textContent = "No meals found for this area.";
    }
  } catch (error) {
    resultsDiv.textContent = "Error fetching meals.";
    console.error("Error fetching meals:", error);
  }
});
