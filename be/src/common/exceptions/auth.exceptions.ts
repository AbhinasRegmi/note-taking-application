import { HttpException } from "@nestjs/common";

export const BearerTokenNotFoundError = new HttpException("Bearer token not found", 401);
export const BearerTokenNotValidError = new HttpException("Bearer token is not valid", 401);
export const CannotLogInError = new HttpException("Cannot log in", 401);
export const CannotLogOutError = new HttpException("Cannot log out", 500);
export const LoginRequiredError = new HttpException("Login required", 401);
export const InvalidCredentialsError = new HttpException("Invalid credentials", 401);