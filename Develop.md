/**
 * API Integration Guide – Ayurvedic E-Commerce
 *
 * This file documents all backend APIs for frontend integration.
 * Backend contract is stable — frontend should rely on this.
 */

# 📘 API Integration Guide – Ayurvedic E-Commerce

Base URL (Local):
http://localhost:5000

Auth Method:
JWT (Bearer Token)

Authorization Header:
Authorization: Bearer <TOKEN>

==================================================
🔐 1️⃣ Authentication APIs
==================================================

These APIs are common for Users and Admins.
Admin is identified by role === "admin".

--------------------------------------------------
➤ Register (User / Admin)
--------------------------------------------------

POST /api/auth/register

Request Body:
{
  "name": "Test User",
  "email": "user@email.com",
  "password": "123456"
}

Success Response:
{
  "message": "Registered successfully. Please verify email via OTP."
}

Notes:
- Redirect to OTP verification screen
- Login is blocked until email is verified

--------------------------------------------------
➤ Verify Email (OTP)
--------------------------------------------------

POST /api/auth/verify-email

Request Body:
{
  "email": "user@email.com",
  "otp": "123456"
}

Success Response:
{
  "message": "Email verified successfully"
}

Errors:
- Invalid OTP
- OTP expired (5 minutes)

--------------------------------------------------
➤ Login
--------------------------------------------------

POST /api/auth/login

Request Body:
{
  "email": "user@email.com",
  "password": "123456"
}

Success Response:
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "user@email.com",
    "role": "user" | "admin"
  }
}

Frontend Rules:
- Store token in localStorage or cookie
- Send token in Authorization header
- Redirect:
  - Admin → /admin
  - User → /

--------------------------------------------------
➤ Forgot Password (Send OTP)
--------------------------------------------------

POST /api/auth/forgot-password

Request Body:
{
  "email": "user@email.com"
}

Response (always same):
{
  "message": "If the email exists, OTP has been sent"
}

--------------------------------------------------
➤ Reset Password
--------------------------------------------------

POST /api/auth/reset-password

Request Body:
{
  "email": "user@email.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}

Success Response:
{
  "message": "Password reset successful"
}

==================================================
🛒 2️⃣ Cart APIs (USER ONLY)
==================================================

All Cart APIs require a USER token.
Admin tokens are rejected.

--------------------------------------------------
➤ Get Cart
--------------------------------------------------

GET /api/cart

Headers:
Authorization: Bearer <USER_TOKEN>

Success Response:
{
  "_id": "cart_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 6000,
        "images": [],
        "stock": 100
      },
      "quantity": 1
    }
  ]
}

Notes:
- Call on cart page load
- If items.length === 0 → show "Cart is empty"

--------------------------------------------------
➤ Add Item to Cart
--------------------------------------------------

POST /api/cart/add

Request Body:
{
  "productId": "product_id",
  "quantity": 1
}

Notes:
- productId is MongoDB _id
- If product already exists → quantity increases

--------------------------------------------------
➤ Update Cart Item Quantity
--------------------------------------------------

PUT /api/cart/update

Request Body:
{
  "productId": "product_id",
  "quantity": 3
}

--------------------------------------------------
➤ Remove Item from Cart
--------------------------------------------------

DELETE /api/cart/remove/:productId

Example:
DELETE /api/cart/remove/6971d00c9fe4a65b76d23aa8

==================================================
📦 3️⃣ Order APIs (USER)
==================================================

--------------------------------------------------
➤ Place Order (COD)
--------------------------------------------------

POST /api/orders

Headers:
Authorization: Bearer <USER_TOKEN>

Request Body:
(no body required)

Success Response:
{
  "_id": "order_id",
  "items": [
    {
      "name": "Product Name",
      "price": 6000,
      "quantity": 1,
      "images": []
    }
  ],
  "totalAmount": 6000,
  "status": "placed",
  "paymentMethod": "COD"
}

Notes:
- Orders are created only from cart
- Cart is cleared after order
- Prices are calculated server-side

==================================================
🧠 Important Rules
==================================================

- Cart is DB-backed and persistent
- Frontend must never calculate totals
- Orders store product snapshot
- JWT is mandatory for all protected routes

==================================================
✅ Backend Status
==================================================

✔ Auth (OTP + JWT)
✔ Cart (Add / Update / Remove)
✔ Orders (COD)
✔ Admin Products
✔ Secure pricing
`;

