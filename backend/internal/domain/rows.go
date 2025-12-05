package domain

type RowsList[T any] struct {
	Rows       []T   `json:"rows"`
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int64 `json:"total_pages"`
}
