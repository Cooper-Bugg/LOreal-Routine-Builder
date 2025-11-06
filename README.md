# L'Oréal Smart Routine & Product Advisor

An AI-powered beauty routine builder featuring real L'Oréal brand products. Users can browse products, select their favorites, and receive personalized skincare and beauty routines powered by OpenAI's GPT-4o.

## Features

**Product Selection**

- Click product cards to select or deselect items
- Visual feedback with border highlighting for selected products
- Remove individual items or clear all selections

**Product Information**

- Toggle button to reveal full product descriptions
- Real-time search by name, brand, or keyword
- Filter products by category

**AI-Powered Routines**

- Generate personalized routines based on selected products
- Interactive chat for follow-up questions
- Full conversation history maintained for context

**Data Persistence**

- Selected products saved in localStorage
- Selections persist across page reloads

**Design**

- L'Oréal brand colors (red #ff003b and gold #e3a535)
- Responsive layout for mobile and desktop
- Clean, professional interface

## Technical Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- API: OpenAI GPT-4o via Cloudflare Workers
- Storage: localStorage
- Icons: Font Awesome 6
- Fonts: Google Fonts (Montserrat)

## Project Structure

```
index.html          Main HTML structure
style.css           Complete styling
script.js           All functionality
products.json       L'Oréal product data
config.js           Worker URL configuration (not tracked)
README.md           Documentation
img/                Images and assets
```

## Usage

Open index.html in a browser. Select products from the grid, click Generate Routine to get AI recommendations, and use the chat for follow-up questions.

## Implementation Notes

- Product selection uses array-based state management
- Search filters work alongside category selection
- Cloudflare Worker handles API requests securely
- API key stored as environment variable in worker

## Browser Compatibility

Works in all modern browsers with ES6+ support.
