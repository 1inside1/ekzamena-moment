let isAdmin = localStorage.getItem('isAdmin') === 'true';

if (!isAdmin) {
    window.location.href = 'login.html';
}

let allRequests = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentFilter = '';

async function loadRequests() {
    try {
        const response = await fetch('/api/admin/requests');
        allRequests = await response.json();
        filterRequests();
    } catch (error) {
        document.getElementById('requestsList').innerHTML = '<p>Ошибка загрузки заявок</p>';
    }
}

function filterRequests() {
    currentFilter = document.getElementById('statusFilter').value;
    currentPage = 1;
    displayRequests();
}

function displayRequests() {
    let filtered = allRequests;
    
    if (currentFilter) {
        filtered = allRequests.filter(r => r.status === currentFilter);
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageRequests = filtered.slice(start, end);
    
    const listDiv = document.getElementById('requestsList');
    
    if (pageRequests.length === 0) {
        listDiv.innerHTML = '<p>Заявок не найдено</p>';
        return;
    }
    
    listDiv.innerHTML = pageRequests.map(request => `
        <div class="request-card">
            <h3>${request.course_name}</h3>
            <p><strong>Пользователь:</strong> ${request.fio} (${request.login})</p>
            <p><strong>Дата начала:</strong> ${request.start_date}</p>
            <p><strong>Способ оплаты:</strong> ${request.payment_method}</p>
            <p><strong>Статус:</strong> 
                <select id="status-${request.id}" onchange="updateStatus(${request.id})">
                    <option value="Новая" ${request.status === 'Новая' ? 'selected' : ''}>Новая</option>
                    <option value="Идет обучение" ${request.status === 'Идет обучение' ? 'selected' : ''}>Идет обучение</option>
                    <option value="Обучение завершено" ${request.status === 'Обучение завершено' ? 'selected' : ''}>Обучение завершено</option>
                </select>
            </p>
        </div>
    `).join('');
    
    updatePagination(filtered.length);
}

async function updateStatus(requestId) {
    const status = document.getElementById(`status-${requestId}`).value;
    
    try {
        const response = await fetch(`/api/admin/requests/${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            const request = allRequests.find(r => r.id === requestId);
            if (request) {
                request.status = status;
            }
            alert('Статус обновлен');
        }
    } catch (error) {
        alert('Ошибка обновления статуса');
    }
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    if (currentPage > 1) {
        html += `<button onclick="goToPage(${currentPage - 1})">Предыдущая</button>`;
    }
    
    html += ` <span>Страница ${currentPage} из ${totalPages}</span> `;
    
    if (currentPage < totalPages) {
        html += `<button onclick="goToPage(${currentPage + 1})">Следующая</button>`;
    }
    
    paginationDiv.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    displayRequests();
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

loadRequests();
