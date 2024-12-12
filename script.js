const shelves = [
    { id: 1, name: "Prateleira A1", capacity: 50, usedSpace: 0 },
];

function getProgressBarColor(usagePercentage) {
    if (usagePercentage >= 0 && usagePercentage <= 25) {
        return 'red';
    } else if (usagePercentage > 25 && usagePercentage <= 75) {
        return 'yellow';
    } else {
        return 'green';
    }
}

function createShelfCard(shelf) {
    const usagePercentage = (shelf.usedSpace / shelf.capacity) * 100;
    const progressBarColor = getProgressBarColor(usagePercentage);
    
    const card = document.createElement('div');
    card.className = 'shelf-card';
    
    card.innerHTML = `
        <div class="shelf-header">
            <h2>${shelf.name}</h2>
        </div>
        <div class="shelf-content">
            <div class="shelf-info">
                <div>
                    <span>Capacidade:</span>
                    <span>${shelf.capacity} kg</span>
                </div>
                <div>
                    <span>Peso atual:</span>
                    <span id="peso-atual">${shelf.usedSpace} kg</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" 
                     style="width: ${usagePercentage}%; background-color: ${progressBarColor}">
                </div>
            </div>
            <div class="usage-text">
                ${usagePercentage.toFixed(1)}% utilizado
            </div>
        </div>
    `;
    
    return card;
}

function renderShelves() {
    const container = document.getElementById('shelvesContainer');
    shelves.forEach(shelf => {
        container.appendChild(createShelfCard(shelf));
    });
}

function updateShelf() {
    const pesoRef = firebase.database().ref('peso');
    pesoRef.on('value', (snapshot) => {
        const peso = snapshot.val();
        shelves[0].usedSpace = peso;
        const usagePercentage = (shelves[0].usedSpace / shelves[0].capacity) * 100;
        const progressBarColor = getProgressBarColor(usagePercentage);
        document.getElementById('peso-atual').innerText = peso + " kg";
        document.querySelector('.progress-fill').style.width = usagePercentage + "%";
        document.querySelector('.progress-fill').style.backgroundColor = progressBarColor;
        document.querySelector('.usage-text').innerText = usagePercentage.toFixed(1) + "% utilizado";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderShelves();
    updateShelf();
});