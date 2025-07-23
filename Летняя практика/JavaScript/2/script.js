document.addEventListener('DOMContentLoaded', function() {
    let map, placemark;
    ymaps.ready(initMap);
    
    function initMap() {
        map = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        });
        
        map.events.add('click', function(e) {
            const coords = e.get('coords');
            
            if (placemark) {
                map.geoObjects.remove(placemark);
            }
            
            placemark = new ymaps.Placemark(coords, {
                balloonContent: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
            }, {
                preset: 'islands#redDotIcon'
            });
            
            map.geoObjects.add(placemark);
            placemark.balloon.open();
            
            document.getElementById('deliveryCoords').value = coords.join(',');
            document.getElementById('mapError').textContent = '';
        });
    }
    
    const commentField = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    
    commentField.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
    
    const form = document.getElementById('orderForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) {
            document.getElementById('fullNameError').textContent = 'Не заполнено поле ФИО';
            isValid = false;
            errors.push('Не заполнено поле ФИО');
        } else {
            document.getElementById('fullNameError').textContent = '';
        }
        
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            document.getElementById('phoneError').textContent = 'Не заполнено поле Телефон';
            isValid = false;
            errors.push('Не заполнено поле Телефон');
        } else if (!/^\d+$/.test(phone)) {
            document.getElementById('phoneError').textContent = 'Телефон должен содержать только цифры';
            isValid = false;
            errors.push('Телефон должен содержать только цифры');
        } else {
            document.getElementById('phoneError').textContent = '';
        }
        
        const email = document.getElementById('email').value.trim();
        if (email && !email.includes('@')) {
            document.getElementById('emailError').textContent = 'Email должен содержать символ @';
            isValid = false;
            errors.push('Email должен содержать символ @');
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        const deliveryCoords = document.getElementById('deliveryCoords').value;
        if (!deliveryCoords) {
            document.getElementById('mapError').textContent = 'Не отмечен адрес доставки';
            isValid = false;
            errors.push('Не отмечен адрес доставки');
        } else {
            document.getElementById('mapError').textContent = '';
        }
        
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.className = isValid ? 'success' : 'error';
        resultMessage.textContent = isValid ? 'Заказ оформлен' : errors.join(', ');
    });
});