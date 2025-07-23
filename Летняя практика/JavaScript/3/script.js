document.addEventListener('DOMContentLoaded', function() {

    const config = {
        apiEndpoint: 'http://exercise.develop.maximaster.ru/service/products/',
        credentials: {
            username: 'cli',  
            password: '12344321' 
        }
    };


    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const refreshBtn = document.getElementById('refreshBtn');
    const tableBody = document.getElementById('tableBody');
    const productsTable = document.getElementById('productsTable');
    const loadingElement = document.getElementById('loading');
    const noDataElement = document.getElementById('noData');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error';
    document.querySelector('.container').prepend(errorContainer);
    
    let productsData = [];
    let filteredData = [];
    
    loadProducts();
    
    refreshBtn.addEventListener('click', function() {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || 0;
        
        if (minPrice < 0 || maxPrice < 0) {
            showError("Цена не может быть отрицательной");
            return;
        }
        
        if (maxPrice > 0 && minPrice > maxPrice) {
            showError("Минимальная цена не может быть больше максимальной");
            return;
        }
        
        hideError();
        filterProducts(minPrice, maxPrice);
    });
    
    async function loadProducts() {
        try {
            showLoading();
            hideTable();
            hideNoData();
            
            const authString = btoa(`${config.credentials.username}:${config.credentials.password}`);
            
            const response = await fetch(config.apiEndpoint, {
                headers: {
                    'Authorization': `Basic ${authString}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Ошибка авторизации: неверный логин/пароль');
                }
                throw new Error(`Ошибка загрузки данных: ${response.status}`);
            }
            
            productsData = await response.json();
            
            productsData = productsData.map((item, index) => ({
                ...item,
                id: index + 1,
                total: (item.price || 0) * (item.quantity || 0)
            }));
            
            filterProducts(0, 0);
        } catch (error) {
            console.error('Ошибка:', error);
            showError(error.message);
            showNoData();
        } finally {
            hideLoading();
        }
    }
    
    function filterProducts(minPrice, maxPrice) {
        filteredData = productsData.filter(product => {
            if (minPrice === 0 && maxPrice === 0) return true;
            
            const price = product.price;
            const meetsMin = minPrice === 0 || price >= minPrice;
            const meetsMax = maxPrice === 0 || price <= maxPrice;
            
            return meetsMin && meetsMax;
        });
        
        renderTable();
    }
    
    function renderTable() {
        tableBody.innerHTML = '';
        
        if (filteredData.length === 0) {
            showNoData();
            return;
        }
        
        showTable();
        
        filteredData.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name || 'Без названия'}</td>
                <td>${product.quantity || 0}</td>
                <td>${formatPrice(product.price || 0)}</td>
                <td>${formatPrice(product.total || 0)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }
    
    function showLoading() {
        loadingElement.style.display = 'block';
    }
    
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    function showNoData() {
        noDataElement.style.display = 'block';
        hideTable();
    }
    
    function hideNoData() {
        noDataElement.style.display = 'none';
    }
    
    function showTable() {
        productsTable.style.display = 'table';
        hideNoData();
    }
    
    function hideTable() {
        productsTable.style.display = 'none';
    }
    
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
    
    function hideError() {
        errorContainer.style.display = 'none';
    }
});