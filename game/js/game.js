var gameOver = false;

// Получить имя из localStorage
var playerName = localStorage.getItem('playerName');

// Получить сложность из localStorage
var difficulty = localStorage.getItem('difficulty') || 'easy';

// Вывести имя игрока в соответствующий элемент
document.getElementById('playerName').textContent = playerName;
displayDifficulty(difficulty);

// Конфигурация уровней
var levelConfig = [
    { numSquaresPerRow: 2, secondsRemaining: 5 },
    { numSquaresPerRow: 3, secondsRemaining: 10 },
    { numSquaresPerRow: 4, secondsRemaining: 20 },
    { numSquaresPerRow: 5, secondsRemaining: 30 },
    { numSquaresPerRow: 6, secondsRemaining: 40 }
];

// Конфигурация сложности
var difficultyConfig = {
    easy: { numRightColorGrids: 2, scoreMultiplier: 20, timePenaltyDivider: 2, penaltyIncorrectAnswer: 1 },
    medium: { numRightColorGrids: 4, scoreMultiplier: 30, timePenaltyDivider: 3, penaltyIncorrectAnswer: 2 },
    hard: { numRightColorGrids: 6, scoreMultiplier: 40, timePenaltyDivider: 4, penaltyIncorrectAnswer: 3 }
};

var currentLevel = 0;
var levelTextElement = document.getElementById('levelText');
var levelNumberElement = document.getElementById('levelNumber');
var timerElement = document.getElementById('timer');
var secondsRemaining;
var score = 0;
var leftPanelColors = [];

var currentDifficultyConfig = difficultyConfig[difficulty];

// Определение количества блоков в правой области
var numRightColorGrids = currentDifficultyConfig.numRightColorGrids;


function startLevel() {
    currentLevel++;
    gameInProgress = true;

    if (currentLevel > levelConfig.length) {
        finishGame();
    }

    var rightBlock = document.getElementById('rightBlock');
    rightBlock.style.border = '';

    var currentLevelConfig = levelConfig[currentLevel - 1];

    var numSquaresPerRow = currentLevelConfig.numSquaresPerRow;
    var numTotalSquares = numSquaresPerRow ** 2;

    levelNumberElement.textContent = currentLevel;

    secondsRemaining = currentLevelConfig.secondsRemaining;

    // Очистка предыдущих блоков
    document.getElementById('colorGridLeft').innerHTML = '';
    document.getElementById('dynamicRightColorGrids').innerHTML = '';


    createSample(numTotalSquares, currentLevelConfig.numSquaresPerRow);
    createRightGrid(numRightColorGrids);

    var correctSquareIndex = Math.floor(Math.random() * numRightColorGrids);

    // Генерация блоков в правой области
    fillRightGrid(numRightColorGrids, numSquaresPerRow, numTotalSquares, correctSquareIndex);

    // Запуск таймера
    updateTimer();
}

function updateTimer() {
    var minutes = Math.floor(secondsRemaining / 60);
    var seconds = secondsRemaining % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (secondsRemaining > 0) {
        secondsRemaining--;
        setTimeout(updateTimer, 1000);
    } else {
        // Действия при завершении времени (переход к следующему уровню и т. д.)
        alert('Время вышло! Переход к следующему уровню.');
        startLevel();
    }
}

function updateScore() {
    var currentDifficultyConfig = difficultyConfig[difficulty];
    var pointsForCorrectAnswer = currentDifficultyConfig.scoreMultiplier;

    score += pointsForCorrectAnswer;

    var penaltyForTime = Math.floor(secondsRemaining / currentDifficultyConfig.timePenaltyDivider);
    score -= penaltyForTime;


    localStorage.setItem('score', score);

}

function penalize() {
    var currentDifficultyConfig = difficultyConfig[difficulty];
    var penaltyIncorrectAnswer = currentDifficultyConfig.penaltyIncorrectAnswer;

    score -= penaltyIncorrectAnswer;

    localStorage.setItem('score', score);

}

// Начало первого уровня
startLevel();

// Функция для генерации случайного цвета
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function finishGame() {
    alert(`Игра завершена! Вы прошли все уровни. Ваш итоговый счет: ${score}`);
    var playerScores = JSON.parse(localStorage.getItem('playerScores')) || {};

    // Генерируем уникальный айдишник для текущей игры
    var id = Object.keys(playerScores).length > 0 ? (parseInt(Object.keys(playerScores).pop()) + 1) : "1";

    // Записываем данные об игре в playerScores
    playerScores[id] = { name: playerName, score: score }; // Изначально счет равен 0

    // Сохраняем обновленные данные в localStorage
    localStorage.setItem('playerScores', JSON.stringify(playerScores));

    gameOver = true;

    window.location.href = '../html/results.html';
}


function createSample(numTotalSquares, numSquaresPerRow) {
    // Генерация квадрата в разных цветах в leftPanel
    var colorGridLeft = document.getElementById('colorGridLeft');


    colorGridLeft.style.gridTemplateColumns = `repeat(${Math.ceil(numSquaresPerRow)}, 1fr)`;

    for (let i = 0; i < numTotalSquares; i++) {
        var colorSquare = document.createElement('div');
        var randomColor = getRandomColor();
        colorSquare.style.backgroundColor = randomColor;
        colorGridLeft.appendChild(colorSquare);

        // Добавить цвет в массив
        leftPanelColors.push(randomColor);
    }
}

function createRightGrid(numRightColorGrids) {
    // Определение количества блоков в каждой строке
    var blocksPerRow = numRightColorGrids / (numRightColorGrids / 2);
    // Создаем контейнер для правой сетки
    var dynamicRightColorGrids = document.getElementById('dynamicRightColorGrids');
    // Определение количества столбцов в зависимости от количества блоков
    var numColumns = Math.ceil(numRightColorGrids / blocksPerRow);
    // Устанавливаем количество столбцов в правой сетке
    dynamicRightColorGrids.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
}

function fillRightGrid(numRightColorGrids, numSquaresPerRow, numTotalSquares, correctSquareIndex) {
    for (let curGrid = 0; curGrid <= numRightColorGrids - 1; curGrid++) {
        var colorGridRight = document.createElement('div');
        colorGridRight.className = 'colorGrid';

        // Добавляем обработчик клика на colorGrid
        colorGridRight.addEventListener('click', function () {
            if (gameInProgress) {
                if (curGrid === correctSquareIndex) {
                    updateScore();
                    rightBlock.style.border = '3px solid green';
                }
                else {
                    rightBlock.style.border = '3px solid red';
                    penalize();
                }
                gameInProgress = false;
                setTimeout(function () {
                    startLevel();
                }, 1000);
            }
        });

        rotate(colorGridRight);

        // Устанавливаем количество столбцов и квадратов в сетке colorGrid
        colorGridRight.style.gridTemplateColumns = `repeat(${Math.ceil(numSquaresPerRow)}, 1fr)`;

        fillColorGridRiht(colorGridRight, numTotalSquares, curGrid, correctSquareIndex);

        // Добавляем rightColorGrid в существующий контейнер
        dynamicRightColorGrids.appendChild(colorGridRight);
    }
}

function rotate(colorGridRight) {
    // Генерация случайного числа для поворота
    var rotationAngle = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, 270
    colorGridRight.style.transform = 'rotate(' + rotationAngle + 'deg)';
}

function fillColorGridRiht(colorGridRight, numTotalSquares, curGrid, correctSquareIndex) {
    for (let i = 0; i < numTotalSquares; i++) {
        var colorSquare = document.createElement('div');
        colorSquare.className = 'colorSquare'; // Добавим класс для стилей

        // Использовать цвет из массива для первого квадрата
        if (curGrid === correctSquareIndex) {
            colorSquare.style.backgroundColor = leftPanelColors[i];
            console.log(leftPanelColors[i]);
        } else {
            colorSquare.style.backgroundColor = getRandomColor();
        }

        colorGridRight.appendChild(colorSquare);
    }
}

function displayDifficulty(difficulty) {
    var difficultyElement = document.getElementById('difficulty');
    difficultyElement.textContent = difficulty;
    console.log(difficultyElement);
    switch(difficulty) {
        case "easy":
            difficultyElement.style.color = "green";
            break;
        case "medium":
            difficultyElement.style.color = "orange";
            break;
        case "hard":
            difficultyElement.style.color = "red";
            break;
        default:
            difficultyElement.style.color = "black";
    }
}
