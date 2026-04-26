const upload = document.getElementById('upload');
const imgPreview = document.getElementById('img-preview');
const canvas = document.getElementById('canvas');
const paletteContainer = document.getElementById('palette');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        imgPreview.src = event.target.result;
        
        // Espera a imagem carregar para processar as cores
        imgPreview.onload = () => {
            extractPalette();
        };
    };
    reader.readAsDataURL(file);
});

function extractPalette() {
    // Ajusta o canvas ao tamanho da imagem (ou minificado para performance)
    canvas.width = imgPreview.width;
    canvas.height = imgPreview.height;
    ctx.drawImage(imgPreview, 0, 0, canvas.width, canvas.height);

    // Limpa a paleta anterior
    paletteContainer.innerHTML = '';

    // Vamos dividir a imagem em 5 áreas para pegar 5 cores diferentes
    const sectionWidth = canvas.width / 5;
    
    for (let i = 0; i < 5; i++) {
        // Pega os dados de um quadrado no centro de cada seção
        const imageData = ctx.getImageData(i * sectionWidth, canvas.height / 2, 10, 10).data;
        const color = calculateAverageColor(imageData);
        createColorCard(color);
    }
}

function calculateAverageColor(data) {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    const count = data.length / 4;
    return `rgb(${Math.floor(r/count)}, ${Math.floor(g/count)}, ${Math.floor(b/count)})`;
}

function createColorCard(color) {
    const div = document.createElement('div');
    div.className = 'color-card';
    div.style.backgroundColor = color;
    
    // Adiciona o código RGB/HEX no card
    const span = document.createElement('span');
    span.innerText = color;
    div.appendChild(span);
    
    paletteContainer.appendChild(div);
}