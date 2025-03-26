// Рецепт Сырного Джо
const recipe = {
    name: "Сырный Джо",
    description: "Соберите бургер в правильном порядке:",
    ingredients: [
        "булочка солнечная",
        "соус сырный 15 гр",
        "соус цезарь 10 гр",
        "репчатый лук 6 гр",
        "салат айсберг 20 гр",
        "помидор-долька",
        "ломтик чеддера",
        "тертый сыр пармезан",
        "говяжья котлета 110 гр",
        "пенек"
    ],
    images: {
        "булочка солнечная": "images/bun-sunny.png",
        "соус сырный 15 гр": "images/sauce-cheese.png",
        "соус цезарь 10 гр": "images/sauce-caesar.png",
        "репчатый лук 6 гр": "images/onion.png",
        "салат айсберг 20 гр": "images/lettuce.png",
        "помидор-долька": "images/tomato.png",
        "ломтик чеддера": "images/cheddar.png",
        "тертый сыр пармезан": "images/parmesan.png",
        "говяжья котлета 110 гр": "images/beef-patty.png",
        "пенек": "images/bottom-bun.png"
    }
};

let playerBurger = [];
let score = 0;
let soundEnabled = true;

function initGame() {
    playerBurger = [];
    updateBurgerDisplay();
    setupIngredients();
    
    document.getElementById('clear-btn').addEventListener('click', clearBurger);
    document.getElementById('submit-btn').addEventListener('click', checkBurger);
    
    // Кнопка звука
    document.getElementById('sound-btn').addEventListener('click', toggleSound);
}

function setupIngredients() {
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    
    // Перемешиваем ингредиенты
    const shuffledIngredients = [...recipe.ingredients].sort(() => Math.random() - 0.5);
    
    shuffledIngredients.forEach(ing => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.draggable = true;
        item.addEventListener('dragstart', dragStart);
        
        const img = document.createElement('img');
        img.src = recipe.images[ing];
        img.alt = ing;
        img.className = 'ingredient-image';
        
        const name = document.createElement('div');
        name.className = 'ingredient-name';
        name.textContent = ing;
        
        item.appendChild(img);
        item.appendChild(name);
        ingredientsList.appendChild(item);
    });
    
    // Настройка области для бургера
    const burgerText = document.getElementById('burger-text');
    burgerText.addEventListener('dragover', dragOver);
    burgerText.addEventListener('drop', drop);
}

function dragStart(e) {
    const ingredient = e.target.closest('.ingredient-item').querySelector('.ingredient-name').textContent;
    e.dataTransfer.setData('text/plain', ingredient);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const ingredient = e.dataTransfer.getData('text/plain');
    addIngredientToBurger(ingredient);
}

function addIngredientToBurger(ingredient) {
    playerBurger.push(ingredient);
    updateBurgerDisplay();
    playSound('add-sound');
}

function clearBurger() {
    playerBurger = [];
    updateBurgerDisplay();
    playSound('error-sound');
}

function updateBurgerDisplay() {
    const burgerText = document.getElementById('burger-text');
    burgerText.innerHTML = '';
    
    playerBurger.forEach((ing, index) => {
        const ingElement = document.createElement('div');
        ingElement.className = 'burger-ingredient';
        ingElement.textContent = `${index + 1}. ${ing}`;
        burgerText.appendChild(ingElement);
    });
}

function checkBurger() {
    const messageElement = document.getElementById('message');
    
    if (playerBurger.length !== recipe.ingredients.length) {
        showMessage(`Нужно ${recipe.ingredients.length} ингредиентов! У вас ${playerBurger.length}.`, 'error');
        playSound('error-sound');
        return;
    }
    
    let isCorrect = true;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if (playerBurger[i] !== recipe.ingredients[i]) {
            isCorrect = false;
            break;
        }
    }
    
    if (isCorrect) {
        score += 100;
        document.getElementById('score').textContent = score;
        showMessage('Правильно! +100 очков', 'success');
        playSound('complete-sound');
        setTimeout(initGame, 1500);
    } else {
        showMessage('Неверный порядок ингредиентов!', 'error');
        playSound('error-sound');
    }
}

function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = type;
}

function playSound(soundId) {
    if (!soundEnabled) return;
    
    const sound = document.getElementById(soundId);
    try {
        sound.currentTime = 0;
        sound.play();
    } catch (e) {
        console.log("Ошибка воспроизведения звука:", e);
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-btn').textContent = soundEnabled ? '🔊 Звук Вкл' : '🔇 Звук Выкл';
}

// Запуск игры
initGame();