let userId = localStorage.getItem('userId');

if (!userId) {
    window.location.href = 'login.html';
}

document.getElementById('requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const courseName = document.getElementById('courseName').value;
    const startDate = document.getElementById('startDate').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    let hasErrors = false;
    
    if (!courseName) {
        document.getElementById('courseError').textContent = 'Выберите курс';
        hasErrors = true;
    }
    
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(startDate)) {
        document.getElementById('dateError').textContent = 'Дата должна быть в формате ДД.ММ.ГГГГ';
        hasErrors = true;
    }
    
    if (!paymentMethod) {
        document.getElementById('paymentError').textContent = 'Выберите способ оплаты';
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    try {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, courseName, startDate, paymentMethod })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Заявка успешно отправлена!');
            window.location.href = 'requests.html';
        } else {
            document.getElementById('formError').textContent = data.error || 'Ошибка создания заявки';
        }
    } catch (error) {
        document.getElementById('formError').textContent = 'Ошибка соединения с сервером';
    }
});

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}
