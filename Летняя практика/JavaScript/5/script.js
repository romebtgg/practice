document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const addRowBtn = document.getElementById('addRowBtn');
    const addColBtn = document.getElementById('addColBtn');
    const STORAGE_KEY = 'spreadsheetData';
    
    let spreadsheetData = loadFromStorage();
    if (!spreadsheetData || spreadsheetData.length === 0) {
        spreadsheetData = [
            ['12345', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }
    renderTable();
    
    addRowBtn.addEventListener('click', addRow);
    addColBtn.addEventListener('click', addColumn);
    
    function renderTable() {
        tableBody.innerHTML = '';
        
        spreadsheetData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            
            row.forEach((cellValue, colIndex) => {
                const td = document.createElement('td');
                
                const cellContent = document.createElement('div');
                cellContent.className = 'cell-content';
                cellContent.textContent = cellValue;
                td.appendChild(cellContent);
                
                td.addEventListener('dblclick', function() {
                    editCell(td, rowIndex, colIndex);
                });
                
                tr.appendChild(td);
            });
            
            if (spreadsheetData.length > 1) {
                const tdControl = document.createElement('td');
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = '-';
                removeBtn.addEventListener('click', function() {
                    removeRow(rowIndex);
                });
                tdControl.appendChild(removeBtn);
                tr.appendChild(tdControl);
            }
            
            tableBody.appendChild(tr);
        });
        
        if (spreadsheetData[0] && spreadsheetData[0].length > 1) {
            const trControls = document.createElement('tr');
            
            spreadsheetData[0].forEach((_, colIndex) => {
                const tdControl = document.createElement('td');
                
                if (colIndex < spreadsheetData[0].length - 1) {
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-btn';
                    removeBtn.textContent = '-';
                    removeBtn.addEventListener('click', function() {
                        removeColumn(colIndex);
                    });
                    tdControl.appendChild(removeBtn);
                }
                
                trControls.appendChild(tdControl);
            });
            
            tableBody.appendChild(trControls);
        }
        
        saveToStorage();
    }
    
    function editCell(td, rowIndex, colIndex) {
        const cellContent = td.querySelector('.cell-content');
        const currentValue = cellContent.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'cell-edit';
        input.value = currentValue;
        
        td.appendChild(input);
        input.focus();
        
        function saveEdit() {
            const newValue = input.value;
            spreadsheetData[rowIndex][colIndex] = newValue;
            cellContent.textContent = newValue;
            td.removeChild(input);
            saveToStorage();
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }
    
    function addRow() {
        const newRow = new Array(spreadsheetData[0].length).fill('');
        spreadsheetData.push(newRow);
        renderTable();
    }
    
    function addColumn() {
        spreadsheetData.forEach(row => row.push(''));
        renderTable();
    }
    
    function removeRow(rowIndex) {
        if (spreadsheetData.length <= 1) return;
        
        const hasData = spreadsheetData[rowIndex].some(cell => cell.trim() !== '');
        
        if (hasData && !confirm('Строка содержит данные. Удалить?')) {
            return;
        }
        
        spreadsheetData.splice(rowIndex, 1);
        renderTable();
    }
    
    function removeColumn(colIndex) {
        if (spreadsheetData[0].length <= 1) return;
        
        const hasData = spreadsheetData.some(row => row[colIndex].trim() !== '');
        
        if (hasData && !confirm('Столбец содержит данные. Удалить?')) {
            return;
        }
        
        spreadsheetData.forEach(row => row.splice(colIndex, 1));
        renderTable();
    }
    
    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(spreadsheetData));
    }
    
    function loadFromStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
});