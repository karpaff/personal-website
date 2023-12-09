var playerScores = JSON.parse(localStorage.getItem('playerScores')) || {};

var lastGameId = Object.keys(playerScores).pop();

// Получаем тело таблицы, куда будем добавлять строки
var leaderboardBody = document.getElementById('leaderboardBody');

// Преобразуем объект в массив для сортировки
var sortedPlayerScores = Object.entries(playerScores).sort((a, b) => b[1].score - a[1].score);

// Проходим по отсортированным данным и создаем строки таблицы
sortedPlayerScores.forEach(function([gameId, data], index) {
    var row = document.createElement('tr');
    var rankCell = document.createElement('td');
    var playerNameCell = document.createElement('td');
    var scoreCell = document.createElement('td');

    rankCell.textContent = index + 1;
    playerNameCell.textContent = data.name;
    scoreCell.textContent = data.score;

    row.appendChild(rankCell);
    row.appendChild(playerNameCell);
    row.appendChild(scoreCell);

    // Проверяем, является ли текущий айдишник последним в playerScores
    if (gameId === lastGameId) {
        row.style.fontWeight = 'bold';
    }

    leaderboardBody.appendChild(row);
});
