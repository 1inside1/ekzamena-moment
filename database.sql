-- создал бд
CREATE DATABASE korochki_db;

-- подключился к бдшке
\c korochki_db

-- создал таблицу для пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- будто бы 255 много, соглашусь, но решил сделать с запасом для хэширования паролей через bcrypt
    fio VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- создал таблицу для заявок
CREATE TABLE requests (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users(id),
    course_name VARCHAR(200) NOT NULL, -- не стал делать отдельную таблицу для курсов, на первом этапе создания -> возможность модернизации приложения в будущем😃
    start_date VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Новая'
);

-- пред добавил данные для админа вручную
INSERT INTO users (login, password, fio, phone, email) 
VALUES ('Admin', 'KorokNET', 'Администратор', '8(000)000-00-00', 'admin@korochki.est');

