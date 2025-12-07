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
	TITLE_REQUIRED            string = "title must be filled"

	REFERENCE_ID_NONREQUIRED string = "reference id cannot be filled"

	TYPE_IS_INVALID      string = "Type is not valid"
	INVALID_REQUEST_BODY string = "Invalid request body"

	EXPENSES_NOT_FOUND       string = "expense not found"
	EXPENSES_GET_ALL_SUCCESS string = "Expenses fetched successfully"
	EXPENSES_CREATED         string = "Expense successfully created"
	EXPENSES_UPDATED         string = "Expense successfully updated"
	EXPENSES_DELETED         string = "Expense successfully deleted"
)
