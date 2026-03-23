# Railway Ticket Booking

Small React + TypeScript + Vite prototype of a modern train ticket flow: search → choose one of the three showcase trains → review booking → pick a payment method → see a success ticket with QR.

## Design
- Figma: [Module-3 React Train Ticket](https://www.figma.com/design/dYoRBMtssFlGNjrBtTAruo/Module-3-React-Train-Ticket--Share-?node-id=2182-1991&t=U32ZjeGj5kOohWm8-1)

## Highlights
- Static train list that matches the design; selected cities/dates are carried through the steps.
- Dynamic passenger forms; bill updates with food, extra baggage, and promo codes.
- Payment selector (card/PayPal/Bitcoin) with styled inputs; success screen shows fare, traveller details, and QR.
- State held in React Context and persisted to `localStorage` for refresh safety.

## Tech Stack
- React (hooks) + TypeScript
- Vite
- React Router
- Ant Design
- Dayjs

## Run locally
```bash
npm install
npm run dev   # open the shown localhost URL

# optional
npm run build
npm run preview
```

## Deploy
- Live: https://katrincik.github.io/Javarush_Project3_1/
