USE financial_health;
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    type ENUM('debit', 'credit', 'loan_payment') NOT NULL,
    reference_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);