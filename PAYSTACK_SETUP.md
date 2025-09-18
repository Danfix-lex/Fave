# Paystack Payment Integration Setup

## Environment Variables

Add these environment variables to your `.env` file in the project root:

```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_fa623a1322f923ff6188b679d1963721c2d50783
VITE_PAYSTACK_SECRET_KEY=sk_test_29da34c9ccc6b59544fcb88d40182c50ae034190
```

## Features Implemented

### 1. Payment Modal (`src/components/PaymentModal.jsx`)
- Professional payment interface with Paystack integration
- Token quantity selection
- Email validation
- Real-time price calculation in local currency
- Secure payment processing

### 2. Payment Success Page (`src/pages/PaymentSuccess.jsx`)
- Beautiful success confirmation page
- Transaction details display
- Token allocation confirmation
- Navigation to dashboard and more purchases

### 3. Upcoming Page Integration
- "Buy Tokens" button on each song card
- Payment modal integration
- Database recording of purchases
- Multi-currency support

### 4. Database Integration
- Token purchases recorded in `token_purchases` table
- Payment reference tracking
- User and song association

## How It Works

1. **User clicks "Buy Tokens"** on any live song in the Upcoming page
2. **Payment Modal opens** with song details and price in local currency
3. **User enters email and quantity** of tokens to purchase
4. **Paystack payment form** appears for secure payment processing
5. **Payment success** redirects to success page with transaction details
6. **Tokens are allocated** to user's account and recorded in database

## Testing

The integration uses Paystack's test keys, so you can test with:
- **Test Card**: 4084084084084085
- **CVV**: 408
- **Expiry**: Any future date
- **PIN**: 1234

## Security Features

- ✅ KYC verification required
- ✅ Secure payment processing via Paystack
- ✅ Database transaction recording
- ✅ Payment reference tracking
- ✅ Multi-currency support
- ✅ Professional UI/UX

## Next Steps

1. Add the environment variables to your `.env` file
2. Test the payment flow with test cards
3. Deploy to production with live Paystack keys
4. Monitor transactions in Paystack dashboard
