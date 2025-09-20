# Imagify - AI Image Generator

A modern, responsive AI image generator built with React and Tailwind CSS. Transform your text descriptions into stunning AI-generated images using Hugging Face's Stable Diffusion XL model.

## ✨ Features

- **AI Image Generation**: Generate high-quality images from text prompts using Hugging Face's Stable Diffusion XL
- **User Authentication**: Local authentication system with user registration and login
- **Credit System**: Purchase credits to generate images (100, 500, or 2500 credits)
- **Generation History**: View, favorite, and manage your generated images
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Local Storage**: All data persisted locally (no backend required)
- **Download Images**: Download your generated images in PNG format
- **Search & Filter**: Search through your generation history and filter favorites

## 🚀 Tech Stack

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **AI Integration**: Hugging Face Inference API (Stable Diffusion XL)
- **State Management**: React Context API
- **Storage**: LocalStorage (no backend required)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Imagify/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

4. **Get a Hugging Face API Key**
   - Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
   - Create a new token with **Write** permissions
   - Copy the token and add it to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🎯 Usage

### Getting Started
1. **Register/Login**: Create an account or login to start generating images
2. **Get Credits**: New users get 10 free credits to start
3. **Generate Images**: Go to the Generate page and enter your text prompt
4. **View History**: Check your generation history on the History page
5. **Purchase More Credits**: Visit the Pricing page to buy more credits

### Generating Images
1. Navigate to the **Generate** page
2. Enter a detailed description of the image you want
3. Click **Generate** and wait for the AI to create your image
4. Download or view your generated image

### Managing Your Images
- **View History**: See all your generated images on the History page
- **Search**: Use the search bar to find specific images by prompt
- **Filter**: View all images or just your favorites
- **Download**: Click the download button to save images
- **Favorite**: Heart icon to mark images as favorites
- **Delete**: Remove images you no longer need

## 💳 Pricing Plans

- **Basic**: $10 - 100 credits
- **Advanced**: $50 - 500 credits (Most Popular)
- **Business**: $250 - 2500 credits

*Credits never expire and each image generation costs 1 credit.*

## 🛠️ Development

### Project Structure
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Footer.jsx      # Footer component
│   │   ├── Header.jsx      # Hero section
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Generate.jsx    # Image generation page
│   │   ├── Pricing.jsx     # Pricing plans
│   │   ├── History.jsx     # Generation history
│   │   └── Login.jsx       # Authentication modal
│   ├── context/            # State management
│   │   └── AppContext.jsx  # Global state and API calls
│   ├── assets/             # Static assets
│   └── main.jsx            # App entry point
├── public/                 # Public assets
└── package.json           # Dependencies and scripts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implementation
- **Image Generation**: Uses Hugging Face's Stable Diffusion XL model
- **Local Storage**: All user data, credits, and history stored locally
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: User feedback during image generation

## 🔧 Configuration

### Environment Variables
- `VITE_HUGGINGFACE_API_KEY`: Your Hugging Face API token (required for image generation)

### Customization
- **Styling**: Modify Tailwind classes in components
- **API Model**: Change the model in `AppContext.jsx` (line 205)
- **Credit Costs**: Adjust credit costs in the pricing plans
- **Image Quality**: Modify generation parameters in the API call

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform's dashboard

### Environment Variables for Production
Make sure to set `VITE_HUGGINGFACE_API_KEY` in your hosting platform's environment variables.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ using React, Tailwind CSS, and Hugging Face AI**