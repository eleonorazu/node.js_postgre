CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	phone_number VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    menu_item_id INTEGER REFERENCES menu_items(id)
);

CREATE TABLE waiter (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE menu_items (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price INTEGER,
    category VARCHAR(255) NOT NULL,
	waiter_id INTEGER,
	FOREIGN KEY (waiter_id) REFERENCES waiters(id)
);