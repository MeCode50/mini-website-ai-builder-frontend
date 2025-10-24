# AI Website Builder Frontend

A modern, responsive frontend application for generating websites using AI prompts. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✨ Core Functionality
- **AI Website Generation**: Generate complete websites from natural language prompts
- **Real-time Preview**: Live preview of generated websites with responsive views
- **Code Export**: Download HTML, CSS, or complete ZIP files
- **Website Gallery**: Browse, search, and filter generated websites
- **Dashboard**: System health monitoring and generation statistics

### 🎨 Design & UX
- **Modern UI**: Clean, professional interface with dark/light theme support
- **Responsive Design**: Mobile-first approach with tablet and desktop views
- **Smooth Animations**: Subtle transitions and loading states
- **Accessibility**: WCAG compliant components and keyboard navigation

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for global state management
- **Data Fetching**: React Query for efficient API calls and caching
- **Form Validation**: React Hook Form with Zod schema validation
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **File Operations**: File-saver + JSZip

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── generate/          # Website generation page
│   ├── gallery/           # Website gallery page
│   ├── preview/[id]/      # Website preview page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/
│   ├── generate/          # Generation-specific components
│   ├── layout/            # Layout components (sidebar, header)
│   ├── providers/         # React Query provider
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api.ts             # API client and types
│   ├── hooks.ts           # React Query hooks
│   ├── store.ts           # Zustand store
│   ├── file-utils.ts      # File operation utilities
│   └── utils.ts           # General utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3001`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-website-builder-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔗 API Integration

The frontend integrates with the AI Website Builder backend API:

### Production URL
```
https://mini-website-ai-builder-production.up.railway.app/api/v1
```

### Local Development URL
```
http://localhost:3001/api/v1
```

### Key Endpoints
- `POST /websites/generate` - Generate website with AI
- `GET /websites` - List all websites (with pagination)
- `GET /websites/:id` - Get specific website
- `GET /websites/:id/preview` - Get website HTML/CSS
- `GET /websites/public` - Get public websites only
- `GET /health/detailed` - System health and stats

### Example API Usage
```typescript
import { api } from '@/lib/api';

// Generate a website
const result = await api.generateWebsite({
  prompt: "Create a portfolio website for a photographer",
  title: "Photography Portfolio",
  description: "A modern portfolio website",
  isPublic: true
});

// Get websites with pagination
const websites = await api.getWebsites(1, 12, "search query");
```

## 🎯 Key User Flows

### 1. Generate Website
1. User navigates to `/generate`
2. Enters website prompt and optional details
3. Clicks "Generate Website"
4. Shows loading animation with progress
5. Displays generated website with preview
6. User can copy, download, or preview the website

### 2. Browse Websites
1. User navigates to `/gallery`
2. Views grid/list of generated websites
3. Can search and filter by visibility
4. Clicks on website to preview
5. Quick actions: view, copy, download, delete

### 3. Preview Website
1. User clicks on a website
2. Shows full-screen preview with responsive views
3. Can toggle between preview and code view
4. Export options: HTML, CSS, or ZIP
5. Copy code to clipboard functionality

## 🎨 Design System

### Colors
- **Primary**: Blue gradient for CTAs and highlights
- **Secondary**: Muted grays for backgrounds and borders
- **Success**: Green for positive actions
- **Warning**: Orange for warnings
- **Error**: Red for errors and destructive actions

### Typography
- **Headings**: Bold, gradient text for impact
- **Body**: Clean, readable fonts
- **Code**: Monospace for code blocks

### Components
- **Cards**: Consistent spacing and shadows
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Clear labels and validation states
- **Loading**: Skeleton screens and spinners

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Production API URL (Railway deployment)
NEXT_PUBLIC_API_URL=https://mini-website-ai-builder-production.up.railway.app/api/v1

# For local development, use:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Tailwind Configuration
The project uses Tailwind CSS v4 with custom configurations for:
- Dark/light theme support
- Custom color palette
- Component-specific utilities
- Animation classes

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar navigation
- Touch-friendly buttons and inputs
- Optimized gallery grid
- Responsive preview modes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## 🧪 Testing

### Run Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API integration examples
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**