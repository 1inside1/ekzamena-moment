let userId = localStorage.getItem('userId');

if (!userId) {
    window.location.href = 'login.html';
}

async function loadRequests() {
    try {
        const response = await fetch(`/api/requests/${userId}`);
        const requests = await response.json();
        
        const listDiv = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            listDiv.innerHTML = '<p>У вас пока нет заявок</p>';
            return;
        }
        
        listDiv.innerHTML = requests.map(request => `
            <div class="request-card">
                <h3>${request.course_name}</h3>
                <p><strong>Дата начала:</strong> ${request.start_date}</p>
                <p><strong>Способ оплаты:</strong> ${request.payment_method}</p>
                <p><strong>Статус:</strong> <span class="status status-${getStatusClass(request.status)}">${request.status}</span></p>
                ${request.status === 'Обучение завершено' ? `
                    <div class="review-section">
                        <h4>Оставить отзыв:</h4>
                        <textarea id="review-${request.id}" placeholder="Ваш отзыв"></textarea>
                        <button onclick="submitReview(${request.id})">Отправить отзыв</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('requestsList').innerHTML = '<p>Ошибка загрузки заявок</p>';
    }
}

function getStatusClass(status) {
    if (status === 'Новая') return 'new';
    if (status === 'Идет обучение') return 'in-progress';
    if (status === 'Обучение завершено') return 'completed';
    return 'new';
}

function submitReview(requestId) {
    const reviewText = document.getElementById(`review-${requestId}`).value;
    if (reviewText.trim()) {
        alert('Отзыв отправлен: ' + reviewText);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

loadRequests();
