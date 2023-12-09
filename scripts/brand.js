const letter1 = document.getElementById("letter1");
const letter2 = document.getElementById("letter2");
const container = document.getElementById("container");
var text = document.getElementById("text");
var img = document.getElementById("iamge");

var animationPlayed = false;

container.addEventListener("mouseover", function () {
if (!animationPlayed) {
    letter1.style.animation = "moveAlongPath 3s reverse linear";
    letter2.style.animation = "moveAlongPath 3s linear";

    container.addEventListener("animationend", function () {
        letter1.style.animation = "none";
        letter1.style.offsetDistance = "0%";
        letter2.style.animation = "none";
        letter2.style.offsetDistance = "100%";

        container.addEventListener("click", function () {
            letter1.style.transform = 'scale(1.1)'
            letter2.style.transform = 'scale(1.1)'
            text.innerHTML = "Борисов Андрей"
            image.innerHTML = '<img src="images/emoji.png" width="80px" height="80px" alt="Изображение">';
            setTimeout(() => {  container.style.transform = 'scale(0.8)'; }, 3000);
        });

    });


    animationPlayed = true;
}
});
