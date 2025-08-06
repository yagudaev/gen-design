export interface PromptTemplate {
  id: string
  name: string
  category: string
  prompt: string
  description?: string
  tags?: string[]
}

export const promptTemplates: PromptTemplate[] = [
  // Login & Authentication
  {
    id: 'login-email',
    name: 'Email Login Screen',
    category: 'Authentication',
    prompt: 'Create a login screen with email and password fields, a submit button, forgot password link, and sign up option',
    tags: ['auth', 'login', 'form']
  },
  {
    id: 'signup-flow',
    name: 'Sign Up Flow',
    category: 'Authentication',
    prompt: 'Design a multi-step sign up flow with email verification, password creation, and profile setup',
    tags: ['auth', 'signup', 'onboarding']
  },
  {
    id: 'forgot-password',
    name: 'Password Reset',
    category: 'Authentication',
    prompt: 'Create a forgot password screen with email input and a password reset confirmation screen',
    tags: ['auth', 'password', 'reset']
  },

  // Dashboard & Analytics
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    category: 'Dashboard',
    prompt: 'Design an analytics dashboard with key metrics cards, line chart for trends, and a data table',
    tags: ['dashboard', 'analytics', 'charts']
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    category: 'Dashboard',
    prompt: 'Create an admin dashboard with sidebar navigation, user stats, recent activities, and quick actions',
    tags: ['dashboard', 'admin', 'navigation']
  },

  // E-commerce
  {
    id: 'product-card',
    name: 'Product Card',
    category: 'E-commerce',
    prompt: 'Design a product card with image, title, price, rating, and add to cart button',
    tags: ['ecommerce', 'product', 'card']
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    category: 'E-commerce',
    prompt: 'Create a shopping cart page with item list, quantity controls, price summary, and checkout button',
    tags: ['ecommerce', 'cart', 'checkout']
  },
  {
    id: 'product-detail',
    name: 'Product Detail Page',
    category: 'E-commerce',
    prompt: 'Design a product detail page with image gallery, description, specifications, reviews, and purchase options',
    tags: ['ecommerce', 'product', 'detail']
  },

  // Forms
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'Forms',
    prompt: 'Create a contact form with name, email, subject, message fields, and submit button',
    tags: ['form', 'contact', 'input']
  },
  {
    id: 'settings-form',
    name: 'Settings Page',
    category: 'Forms',
    prompt: 'Design a settings page with sections for profile, notifications, privacy, and account management',
    tags: ['form', 'settings', 'profile']
  },

  // Lists & Tables
  {
    id: 'user-list',
    name: 'User List',
    category: 'Lists',
    prompt: 'Create a user list with avatar, name, email, role, status, and action buttons',
    tags: ['list', 'table', 'users']
  },
  {
    id: 'task-list',
    name: 'Task List',
    category: 'Lists',
    prompt: 'Design a task list with checkboxes, priority indicators, due dates, and assignees',
    tags: ['list', 'tasks', 'todo']
  },

  // Navigation
  {
    id: 'sidebar-nav',
    name: 'Sidebar Navigation',
    category: 'Navigation',
    prompt: 'Create a collapsible sidebar navigation with icons, labels, and nested menu items',
    tags: ['navigation', 'sidebar', 'menu']
  },
  {
    id: 'tab-navigation',
    name: 'Tab Navigation',
    category: 'Navigation',
    prompt: 'Design a tab navigation component with active state, icons, and badge indicators',
    tags: ['navigation', 'tabs', 'menu']
  },

  // Cards & Content
  {
    id: 'blog-card',
    name: 'Blog Post Card',
    category: 'Content',
    prompt: 'Create a blog post card with featured image, title, excerpt, author info, and read time',
    tags: ['card', 'blog', 'content']
  },
  {
    id: 'profile-card',
    name: 'Profile Card',
    category: 'Content',
    prompt: 'Design a user profile card with avatar, name, bio, stats, and action buttons',
    tags: ['card', 'profile', 'user']
  },
  {
    id: 'notification-card',
    name: 'Notification Card',
    category: 'Content',
    prompt: 'Create a notification card with icon, title, description, timestamp, and action buttons',
    tags: ['card', 'notification', 'alert']
  },

  // Mobile Patterns
  {
    id: 'mobile-home',
    name: 'Mobile Home Screen',
    category: 'Mobile',
    prompt: 'Design a mobile home screen with header, search bar, category grid, and bottom navigation',
    tags: ['mobile', 'home', 'app']
  },
  {
    id: 'mobile-menu',
    name: 'Mobile Menu',
    category: 'Mobile',
    prompt: 'Create a mobile slide-out menu with user profile, navigation items, and settings',
    tags: ['mobile', 'menu', 'navigation']
  },

  // Messaging & Chat
  {
    id: 'chat-interface',
    name: 'Chat Interface',
    category: 'Messaging',
    prompt: 'Design a chat interface with message list, input field, emoji picker, and attachment button',
    tags: ['chat', 'messaging', 'communication']
  },
  {
    id: 'inbox-list',
    name: 'Inbox List',
    category: 'Messaging',
    prompt: 'Create an inbox list with sender info, subject, preview, timestamp, and unread indicators',
    tags: ['inbox', 'email', 'list']
  },

  // Empty States & Errors
  {
    id: 'empty-state',
    name: 'Empty State',
    category: 'States',
    prompt: 'Design an empty state with illustration, heading, description, and call-to-action button',
    tags: ['empty', 'state', 'placeholder']
  },
  {
    id: 'error-404',
    name: '404 Error Page',
    category: 'States',
    prompt: 'Create a 404 error page with illustration, error message, and navigation options',
    tags: ['error', '404', 'state']
  },
  {
    id: 'loading-state',
    name: 'Loading State',
    category: 'States',
    prompt: 'Design loading states with skeleton screens, spinners, and progress indicators',
    tags: ['loading', 'skeleton', 'state']
  }
]

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return promptTemplates.filter(t => t.category === category)
}

export function getCategories(): string[] {
  return [...new Set(promptTemplates.map(t => t.category))]
}

export function searchTemplates(query: string): PromptTemplate[] {
  const lowerQuery = query.toLowerCase()
  return promptTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.prompt.toLowerCase().includes(lowerQuery) ||
    t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}