document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userLogin', data.login);
            localStorage.setItem('isAdmin', data.isAdmin);
            
            if (data.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'requests.html';
            }
        } else {
            document.getElementById('formError').textContent = data.error || 'Неверный логин или пароль';
        }
    } catch (error) {
        document.getElementById('formError').textContent = 'Ошибка соединения с сервером';
    }
});
