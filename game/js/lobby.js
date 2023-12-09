function startGame() {
    var playerName = prompt("Введите ваше имя:");

    var difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    // Проверка, чтобы избежать сохранения null (если пользователь отменил ввод)
    if (playerName !== null && playerName.trim() !== '') {
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('difficulty', difficulty);

        window.location.href = '../html/game.html';
    }
    else {
        var errorText = document.getElementById('errorText');
        errorText.textContent = 'Вы не ввели имя. Попробуйте еще раз.'
    }
}

document.getElementById('playButton').addEventListener('click', startGame);
