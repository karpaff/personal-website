let message = ""
if (confirm("Приступаем?")) {
    // Добавляем форму
    const frm = document.getElementById("shoeForm");
    frm.innerHTML = `
    <p>
    <h3>Длина стопы:</h3>
    <input type="number" min="1" id="footLength" name="footLength" placeholder="Длина в см" required>
    </p>

    <p>
    <h3>Пол:</h3>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">Мужской</label><br>

    <input type="radio" id="female" name="gender" value="female">
    <label for="female">Женский</label>
    </p>

    <input type="submit" value="Расчитать">
    `;

    message = "Расчет длины каблука";
}
else {
    message = "Ходите босиком";
}

document.querySelector('#message').innerHTML = message

document
  .getElementById("shoeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const outputDiv = document.getElementById("output");
    const resultHeader = document.getElementById("result-header");

    // Получаем значение пола и длины стопы из формы
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const footLength = parseFloat(document.getElementById("footLength").value);

    // Определяем высоту каблука и тип обуви в зависимости от пола и длины стопы
    let heelHeight;
    let shoeType;
    let imageUrl;

    if (gender == "male") {
      heelHeight = 1;
      imageUrl = "images/boot2.png";
    } else if (gender == "female") {
      heelHeight = footLength / 7;
      imageUrl = heelHeight > 5 ? "images/boot3.png" : "images/boot1.png";
    }

    // Выводим результат на страницу
    resultHeader.innerText = "Результат";
    outputDiv.innerHTML = `<p>Высота каблука: ${heelHeight.toFixed(1)} см<p>`;
    var img = document.createElement("img");
    img.src = imageUrl;
    outputDiv.appendChild(img);
  });
