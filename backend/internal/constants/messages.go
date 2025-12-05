package constants

const (
	SUCCESS                 string = "success"
	USER_SUCCESS_LOGIN      string = "Login successful"
	USER_SUCESSS_REGISTERED string = "User registered successfully"

	LOAN_SUCCESS_CREATED string = "Loan created, generating installments in background!"

	TRANSACTION_CREATED string = "Transaction successful"
	TRANSACTION_UPDATED string = "Transaction updated"

	TRANSACTION_NOT_FOUND string = "transaction not found"

	TRANSACTION_DATE_REQUIRED string = "transaction date must be filled"
	REFERENCE_ID_REQUIRED     string = "reference id must be filled"
	AMOUNT_REQUIRED           string = "amount must more than zero"

	REFERENCE_ID_NONREQUIRED string = "reference id cannot be filled"
)
