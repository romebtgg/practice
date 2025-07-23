const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const randomColorBtn = document.getElementById('random-color');
const square = document.getElementById('square');

function updateSquareSize() {
    square.style.width = `${widthInput.value}px`;
    square.style.height = `${heightInput.value}px`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

widthInput.addEventListener('input', updateSquareSize);
heightInput.addEventListener('input', updateSquareSize);

randomColorBtn.addEventListener('click', () => {
    square.style.backgroundColor = getRandomColor();
});

updateSquareSize();