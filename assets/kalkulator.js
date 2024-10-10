// Inisialisasi kalkulator
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    history: [] // Menyimpan riwayat perhitungan
};

// Fungsi untuk menambah digit ke layar kalkulator
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Fungsi untuk memasukkan desimal
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// Fungsi untuk mengelola operator matematika
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;

        // Tambahkan hasil perhitungan ke riwayat
        addHistory(currentValue, operator, inputValue, result);
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Objek berisi perhitungan matematika
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

// Fungsi untuk mereset kalkulator
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Fungsi untuk memperbarui layar kalkulator
function updateDisplay() {
    const display = document.querySelector('#result');
    display.value = calculator.displayValue;
}

// Fungsi untuk menambahkan riwayat perhitungan
function addHistory(firstOperand, operator, secondOperand, result) {
    const historyDisplay = document.querySelector('#history-list');
    
    const historyItem = `
        <div class="history-item">
            <span class="history-first">${firstOperand}</span> 
            <span class="history-operator">${operator}</span> 
            <span class="history-second">${secondOperand}</span> 
            = 
            <span class="history-result">${result}</span>
        </div>
    `;
    
    calculator.history.push(historyItem);
    historyDisplay.innerHTML += historyItem; // Menampilkan riwayat
}

// Inisialisasi tampilan
updateDisplay();

// Mengatur event listener untuk tombol hapus riwayat
document.querySelector('#clear-history').addEventListener('click', function() {
    const historyList = document.querySelector('#history-list');
    historyList.innerHTML = ''; // Menghapus semua item riwayat
});

// Mengatur event listener untuk tombol kalkulator
const keys = document.querySelector('.calculator-buttons');
keys.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.value === '.') {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

// Mengatur event listener untuk tombol toggle riwayat
document.querySelector('#toggle-history').addEventListener('click', function() {
    const historyContainer = document.querySelector('#history-container');
    
    // Toggle visibilitas riwayat
    if (historyContainer.style.display === 'none' || historyContainer.style.display === '') {
        historyContainer.style.display = 'block';
        this.textContent = 'Sembunyikan Riwayat'; // Mengubah teks tombol
    } else {
        historyContainer.style.display = 'none';
        this.textContent = 'Tampilkan Riwayat'; // Mengubah teks tombol
    }
});
