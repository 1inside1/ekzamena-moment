document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const fio = document.getElementById('fio').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
    let hasErrors = false;
    
    if (!/^[a-zA-Z0-9]{6,}$/.test(login)) {
        document.getElementById('loginError').textContent = 'Логин должен содержать только латиницу и цифры, минимум 6 символов';
        hasErrors = true;
    }
    
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Пароль должен содержать минимум 8 символов';
        hasErrors = true;
    }
    
    if (!/^[а-яА-ЯёЁ\s]+$/.test(fio)) {
        document.getElementById('fioError').textContent = 'ФИО должно содержать только кириллицу и пробелы';
        hasErrors = true;
    }
    
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)) {
        document.getElementById('phoneError').textContent = 'Телефон должен быть в формате 8(XXX)XXX-XX-XX';
        hasErrors = true;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Введите корректный email';
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password, fio, phone, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Регистрация успешна!');
            window.location.href = 'login.html';
        } else {
            document.getElementById('formError').textContent = data.error || 'Ошибка регистрации';
        }
    } catch (error) {
        document.getElementById('formError').textContent = 'Ошибка соединения с сервером';
    }
});
