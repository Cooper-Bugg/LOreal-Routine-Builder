# L'Oréal Smart Routine & Product Advisor

An AI-powered beauty routine builder featuring real L'Oréal brand products. Users can browse products, select their favorites, and receive personalized skincare/beauty routines powered by OpenAI's GPT-4o.

## ✨ Features

### Core Functionality

- **Product Selection**: Click product cards to select/unselect items with visual feedback
- **Product Details**: Toggle button to reveal full product descriptions
- **Persistent Storage**: Selected products saved in localStorage across page reloads
- **AI-Powered Routines**: Generate personalized routines based on selected products
- **Interactive Chat**: Ask follow-up questions with full conversation history
- **Product Search**: Real-time search by name, brand, or keyword (Extra Credit ⭐)

### Design & UX

- L'Oréal brand colors (#ff003b and #e3a535)
- Gradient buttons and subtle animations
- Responsive design for mobile and tablet
- Intuitive product filtering by category
- Clear visual indicators for selected products
- Professional chat interface with role-based styling

## 🚀 Getting Started

### 1. Set Up Cloudflare Worker

Before you can use the AI features, you need to set up a Cloudflare Worker to securely handle OpenAI API requests:

1. Follow the complete guide in [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)
2. Copy your worker URL
3. Update `script.js` line ~365:
   ```javascript
   const WORKER_URL = "https://your-worker.your-subdomain.workers.dev";
   ```

### 2. Open the Application

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## 📖 How to Use

### Selecting Products

1. **Choose a Category**: Use the dropdown to filter products by type (cleansers, moisturizers, haircare, etc.)
2. **Search (Optional)**: Type in the search box to find specific products
3. **Select Products**: Click on product cards to add them to your selection
   - Selected products show a red border and checkmark
   - They also appear in the "Selected Products" section
4. **View Details**: Click the "Details" button on any product to see its full description
5. **Remove Products**: Click the ✕ on selected items or use "Clear All"

### Generating a Routine

1. Select at least one product
2. Click the **"Generate Routine"** button
3. The AI will create a personalized routine explaining when and how to use each product
4. The routine appears in the chat window

### Asking Follow-Up Questions

1. After generating a routine, use the chat box at the bottom
2. Type questions about:
   - The routine order
   - Product application tips
   - Skincare/beauty advice
   - Product compatibility
3. The AI remembers the full conversation for context

## 🗂️ Project Structure

```
LOreal-Routine-Builder/
├── index.html              # Main HTML structure
├── style.css              # Complete styling with brand colors
├── script.js              # All JavaScript functionality
├── products.json          # Real L'Oréal product data
├── CLOUDFLARE_SETUP.md   # Worker setup guide
├── README.md             # This file
└── img/                  # Logo and product images
    └── loreal-logo.png
```

## 🎨 Customization

The app uses L'Oréal's official brand colors:

- **Primary Red**: `#ff003b` - Used for accents, selections, borders
- **Gold**: `#e3a535` - Used for highlights, buttons, secondary elements
- **Gradients**: Combined for premium feel on buttons

You can customize colors in `style.css` by searching for these hex values.

## 🔧 Technical Details

### Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: OpenAI GPT-4o via Cloudflare Workers
- **Storage**: localStorage for persistence
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Montserrat)

### Key Features Implementation

**Product Selection**

- Array-based state management
- DOM manipulation with data attributes
- LocalStorage for persistence

**Search & Filter**

- Real-time filtering on input
- Combined category + keyword search
- Case-insensitive matching

**AI Integration**

- Secure API key handling via Cloudflare Worker
- Conversation history tracking
- Structured prompts for better results

## 🏆 Extra Credit Features Implemented

✅ **Product Search (10 pts)**: Real-time search field that filters products by name, brand, category, or keyword, working seamlessly with the category dropdown.

## 🔮 Future Enhancements (Not Implemented)

- **Web Search (10 pts)**: Use a model with web search for current product info
- **RTL Support (5 pts)**: Right-to-left language layout support

## 📝 Notes

- Product data includes real L'Oréal brands: CeraVe, La Roche-Posay, Garnier, Lancôme, and more
- All products have detailed descriptions for better AI recommendations
- The chat interface supports markdown-style formatting in responses
- Cloudflare Worker keeps your API key secure and never exposes it to clients

## 🐛 Troubleshooting

**"Please set up your Cloudflare Worker URL"**

- You need to update the `WORKER_URL` in `script.js`
- See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for instructions

**Products not showing**

- Make sure `products.json` is in the same directory as `index.html`
- Check browser console for any errors

**Chat not working**

- Verify your Cloudflare Worker is deployed
- Check that your OpenAI API key is set correctly
- Ensure you have OpenAI API credits available

## 📄 License

This is a student project for educational purposes.

---

Made with ❤️ for the L'Oréal AI Challenge
