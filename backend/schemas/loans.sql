USE financial_health;
CREATE TABLE IF NOT EXISTS loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    tenor INT NOT NULL, 
    tenor_type ENUM('weekly', 'monthly', 'yearly') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL, -- Installment amount
    amount_due DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    status ENUM('settled', 'on_going', 'overdue') DEFAULT 'on_going',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS loan_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    cycle_number INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
);

CREATE INDEX idx_loans_title ON loans(title);
CREATE INDEX idx_loans_user_id ON loans(user_id);
EXPLAIN SELECT COUNT(*) FROM loans WHERE user_id = 123 AND title LIKE 'A%';
