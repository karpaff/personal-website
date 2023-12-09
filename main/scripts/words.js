    var draggedElement;
    var originalText;
    var newElement; 
    var addedKeys = [];
    var wordsCounter = 1;
    var numsCounter = 1;

    function handleButtonClick() {
        var inputText = document.getElementById('input-field').value;
        var items = inputText.split('-');
        var resultMap = {};
        var wordsArray = [];
        var numbersArray = [];
        
        var validInputRegex = /^[\wа-яА-Я]+(-[\wа-яА-Я]+)*$/;

        // Проверка корректности ввода
        if (!validInputRegex.test(inputText)) {
            displayError("Некорректный ввод");
            return;
        }
        else {
            clearError();
        }

        items.forEach(function (item) {
            if (isNaN(item.trim())) {
                wordsArray.push(item.trim());
            } else {
                numbersArray.push(parseFloat(item.trim()));
            }
        });

        wordsArray.sort();
        numbersArray.sort(function (a, b) {
            return a - b;
        });

        wordsArray.forEach(function (word) {
            resultMap['a' + wordsCounter++] = word;
        });

        numbersArray.forEach(function (number) {
            resultMap['n' + numsCounter++] = number;
        });

        displayResult(resultMap);
    }

    function displayError(message) {
        var resultBlock = document.getElementById('error-text');
        resultBlock.textContent = message;
    }

    function clearError() {
        var errorBlock = document.getElementById('error-text');
        errorBlock.textContent = "";
    }

    function displayResult(resultMap) {
        var resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = '';

        for (var key in resultMap) {
            var resultItem = document.createElement('div');
            resultItem.textContent = key + ' ' + resultMap[key];
            resultItem.className = 'result-item';
            resultItem.draggable = true;
            resultItem.addEventListener('dragstart', drag);
            resultContainer.appendChild(resultItem);
        }
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drag(event) {
        draggedElement = event.target;
        originalText = event.target.textContent;
        event.dataTransfer.setData("text", originalText);
    }

    function drop(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var dropTarget = event.target;

        var leftContainer = dropTarget.closest('#left-container');
        if (leftContainer) {
            // Создаем новый элемент и добавляем его в left-container
            newElement = document.createElement('div');
            newElement.textContent = originalText;
            newElement.className = 'result-item';
            newElement.draggable = true;
            newElement.addEventListener('dragstart', drag);

            newElement.dataset.moved = 'true';

            // Устанавливаем начальные координаты элемента
            var x = event.clientX - newElement.clientWidth / 2;
            var y = event.clientY - newElement.clientHeight / 2;

            newElement.style.position = 'absolute';
            newElement.style.left = x + 'px';
            newElement.style.top = y + 'px';
            leftContainer.appendChild(newElement);

            // Удаляем только перетащенный элемент из result-container
            var draggedElement = document.querySelector('.result-item:active');
            draggedElement.parentNode.removeChild(draggedElement);

            draggedElement = null; // Сбрасываем переменную после отпускания мыши

            var resultBlock = document.getElementById('result');
            var key = originalText.split(' ')[0]; 
            var value = originalText.split(' ')[1];
            
            if(!addedKeys.includes(key)) {
                resultBlock.textContent += ' ' + value;
                addedKeys.push(key);
            }

        }
    }

