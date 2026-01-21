# Auth API – Frontend Integration Guide

Base URL (local): `http://localhost:5000`

---

## 1️⃣ Registration (User / Admin)

### ➤ Register

**POST** `/api/auth/register`

Creates a new account and sends an OTP to email for verification.

**Request Body**

```json
{
  "name": "Test User",
  "email": "user@email.com",
  "password": "123456"
}
```

**Success Response**

```json
{
  "message": "Registered successfully. Please verify email via OTP."
}
```

**Notes for Frontend**

* After this call, redirect user to **OTP verification screen**
* Login is NOT allowed until email is verified

---

### ➤ Verify Email (OTP)

**POST** `/api/auth/verify-email`

Verifies user email using OTP.

**Request Body**

```json
{
  "email": "user@email.com",
  "otp": "123456"
}
```

**Success Response**

```json
{
  "message": "Email verified successfully"
}
```

**Error Cases**

* Invalid OTP
* Expired OTP

---

## 2️⃣ Login

### ➤ Login (Password-based)

**POST** `/api/auth/login`

Logs in verified users and returns JWT token.

**Request Body**

```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

**Success Response**

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "user@email.com",
    "role": "user" | "admin"
  }
}
```

**Important Frontend Rules**

* Store token in **localStorage** or **cookie**
* Send token in header for protected APIs:

```
Authorization: Bearer <token>
```

**Error Cases**

* Invalid credentials
* Email not verified

---

## 3️⃣ Forgot Password

### ➤ Send Reset OTP

**POST** `/api/auth/forgot-password`

Sends OTP to email for password reset.

**Request Body**

```json
{
  "email": "user@email.com"
}
```

**Response (Always same for security)**

```json
{
  "message": "If the email exists, OTP has been sent"
}
```

**Frontend Note**

* Always show success message (do not check if email exists)

---

### ➤ Reset Password

**POST** `/api/auth/reset-password`

Resets password using OTP.

**Request Body**

```json
{
  "email": "user@email.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Success Response**

```json
{
  "message": "Password reset successful"
}
```

**Frontend Flow**

1. Forgot password → enter email
2. Enter OTP + new password
3. Redirect to login

---

## 🔐 Auth Notes (IMPORTANT)

* Same APIs work for **users and admin**
* Admin is identified by `role === "admin"` in login response
* Frontend **must not assume admin access** — backend enforces it
* OTP is valid for **5 minutes**

---

## ✅ Auth Status

✔ Registration
✔ Email verification (OTP)
✔ Login (JWT)
✔ Forgot password
✔ Reset password

