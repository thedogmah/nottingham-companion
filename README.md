# Nottingham Companion Service - Website Template

A professional, responsive one-page website template for a UK-based friend-for-hire service based in Nottingham.

## Features

- **Professional Design**: Clean, modern layout with muted, earthy colors
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth scrolling, hover effects, and form handling
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Easy to Customize**: Well-organized code with clear comments

## File Structure

```
nottingham-companion-service/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── favicon.ico         # Website icon
└── README.md           # This file
```

## Customization Guide

### 1. Personal Information

Update the following in `index.html`:

- **Contact Details**: Replace the placeholder email, phone, and WhatsApp numbers
- **About Me**: Modify the personal description and features
- **Services**: Customize the services offered and descriptions
- **Company Name**: Change "Nottingham Companion" to your preferred name

### 2. Images

Replace the placeholder images with your actual photos:

- **Hero Section**: Add your professional photo in the hero-image div
- **About Section**: Add a personal photo in the about-image div
- **Favicon**: Replace `favicon.ico` with your own icon

### 3. Colors and Styling

The website uses a professional color scheme that can be customized in `styles.css`:

- **Primary Blue**: `#3498db` (buttons, links)
- **Dark Blue**: `#2c3e50` (header, footer)
- **Light Gray**: `#ecf0f1` (backgrounds, borders)
- **Text Colors**: `#2c3e50` (headings), `#5a6c7d` (body text)

### 4. Content Updates

#### Services Section
Modify the services in the `services-grid` div to match your offerings:

```html
<div class="service-card">
    <div class="service-icon">🛒</div>
    <h3>Your Service Name</h3>
    <p>Description of your service...</p>
</div>
```

#### About Section
Update the personal information and features list:

```html
<p>Your personal description here...</p>
<div class="about-features">
    <div class="feature">
        <span class="feature-icon">✓</span>
        <span>Your feature</span>
    </div>
</div>
```

#### Why Choose Me Section
Customize the reasons why clients should choose you:

```html
<div class="reason-card">
    <h3>Your Reason</h3>
    <p>Explanation of your reason...</p>
</div>
```

### 5. Contact Form

The contact form includes:
- Name (required)
- Email (required)
- Phone (optional)
- Service Interest dropdown
- Message (required)

To make the form functional, you'll need to:
1. Set up a backend service (e.g., Formspree, Netlify Forms, or custom backend)
2. Update the form action and method attributes
3. Handle form submission on your server

### 6. SEO and Meta Tags

Update the following in the `<head>` section:

```html
<title>Your Page Title</title>
<meta name="description" content="Your page description">
<meta name="keywords" content="your, keywords, here">
<meta name="author" content="Your Name">
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Optimized CSS**: Efficient selectors and minimal reflows
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Lazy Loading**: Intersection Observer for scroll-based animations
- **Mobile First**: Responsive design with mobile-first approach

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Indicators**: Clear focus states for interactive elements
- **Alt Text**: Placeholder for image alt text
- **ARIA Labels**: Ready for accessibility enhancements

## Deployment

### Option 1: Static Hosting
Upload the files to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web hosting provider

### Option 2: Local Development
Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## Customization Tips

1. **Keep it Simple**: Don't overcrowd the page - focus on key information
2. **Professional Photos**: Use high-quality, professional photos
3. **Clear Contact Info**: Make it easy for potential clients to reach you
4. **Test on Mobile**: Ensure the site works well on all devices
5. **Loading Speed**: Optimize images and minimize external dependencies

## Support

This template is designed to be easily customizable. If you need help with:
- Custom styling
- Additional functionality
- Form integration
- SEO optimization

Feel free to modify the code or seek professional assistance.

## License

This template is provided as-is for your use. You may modify and use it for commercial purposes.

---

**Note**: Remember to replace all placeholder content (phone numbers, emails, descriptions) with your actual information before going live with the website.
