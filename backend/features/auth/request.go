package auth

type LoginRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

type AcceptRegisterRequest struct {
	IDs []string `form:"ids" binding:"required"`
}

type RegisterRequest struct {
	Email string `form:"email" binding:"required,email"`
	Name  string `form:"name" binding:"required"`
	Grade int    `form:"grade" binding:"required"`
}
