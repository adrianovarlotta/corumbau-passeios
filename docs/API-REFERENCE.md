# API Reference

## Public Endpoints (No Auth)

### GET /api/tours
List all active tours with available dates.

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Baleia Jubarte",
      "slug": "baleia-jubarte",
      "description": "...",
      "duration": "4 horas",
      "category": "WHALE",
      "priceAdult": 250,
      "priceChild": 125,
      "maxCapacity": 20,
      "images": ["/images/baleia-jubarte.jpg"],
      "tourDates": [
        {
          "id": "td1",
          "date": "2026-03-25T00:00:00Z",
          "time": "08:00",
          "totalSlots": 20,
          "bookedSlots": 12,
          "status": "OPEN"
        }
      ]
    }
  ],
  "success": true
}
```

---

### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "customerName": "Maria Silva",
  "customerEmail": "maria@email.com",
  "customerPhone": "73999999999",
  "adults": 2,
  "children": 1,
  "tourDateId": "clx...",
  "paymentMethod": "PIX",
  "partnerCode": "HOTEL123"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "clx...",
    "voucherCode": "AB3K7M",
    "totalAmount": 625,
    "paymentStatus": "PENDING",
    "paymentMethod": "PIX"
  },
  "success": true
}
```

**Errors:**
- `404` — Tour date not found
- `400` — Date not available / Not enough slots / Validation error

---

### POST /api/payment/pix
Generate Pix payment QR code via Mercado Pago.

**Request Body:**
```json
{ "bookingId": "clx..." }
```

**Response:**
```json
{
  "data": {
    "paymentId": "123456789",
    "status": "pending",
    "qrCode": "00020126...",
    "qrCodeBase64": "iVBORw0KGgo...",
    "copyPaste": "00020126...",
    "ticketUrl": "https://www.mercadopago.com.br/...",
    "expiresAt": "2026-03-25T15:30:00Z"
  },
  "success": true
}
```

---

### POST /api/payment/card
Create Mercado Pago checkout preference for credit card payment.

**Request Body:**
```json
{ "bookingId": "clx..." }
```

**Response:**
```json
{
  "data": {
    "preferenceId": "123456789-abc",
    "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
    "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
  },
  "success": true
}
```

---

### GET /api/payment/status?bookingId=xxx
Check payment status for a booking.

**Response:**
```json
{
  "data": { "status": "PENDING" },
  "success": true
}
```

Status values: `PENDING`, `PAID`, `REFUNDED`, `CANCELLED`

---

### GET /api/voucher/[code]
Validate a voucher code and get booking details.

**Response:**
```json
{
  "data": {
    "id": "clx...",
    "voucherCode": "AB3K7M",
    "customerName": "Maria Silva",
    "adults": 2,
    "children": 1,
    "totalAmount": 625,
    "paymentStatus": "PAID",
    "checkedInAt": null,
    "tourDate": {
      "date": "2026-03-25T00:00:00Z",
      "time": "08:00",
      "tour": {
        "name": "Baleia Jubarte",
        "duration": "4 horas"
      }
    }
  },
  "success": true
}
```

---

## Webhook Endpoints

### POST /api/webhooks/mercadopago
Receives Mercado Pago IPN (Instant Payment Notification).

**Triggered by:** Mercado Pago when payment status changes.

**Actions on `approved`:**
1. Update booking `paymentStatus` to `PAID`
2. Create `Commission` record for operator

**Status mapping:**
| MP Status | Our Status |
|---|---|
| approved | PAID |
| pending, in_process, authorized | PENDING |
| rejected, cancelled | CANCELLED |
| refunded, charged_back | REFUNDED |

---

## Admin Endpoints (Require ADMIN role)

### GET /api/admin/tours
List all tours (including inactive).

### POST /api/admin/tours
Create a new tour.

### PUT /api/admin/tours/[tourId]
Update a tour.

### DELETE /api/admin/tours/[tourId]
Delete a tour (soft delete via `isActive: false`).

### POST /api/admin/tour-dates
Create a new tour date.

### PUT /api/admin/tour-dates/[dateId]
Update or cancel a tour date.

### DELETE /api/admin/tour-dates/[dateId]
Delete a tour date.

### GET /api/admin/bookings
List all bookings with filters.

### GET /api/admin/commissions
List all commissions with filters.

---

## Operator Endpoints (Require OPERATOR or ADMIN role)

### POST /api/operator/checkin
Check in a passenger by voucher code.

**Request Body:**
```json
{ "voucherCode": "AB3K7M" }
```

### GET /api/operator/manifest?tourDateId=xxx
Get passenger manifest for a tour date.
