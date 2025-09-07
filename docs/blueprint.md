# **App Name**: SaaSboard

## Core Features:

- Collapsible Sidebar Navigation: A responsive sidebar that collapses to a smaller width, featuring icon-based navigation and user profile section with logout functionality.
- Sticky Header Top Bar: A sticky header bar that includes breadcrumbs for navigation, a search bar, and a profile dropdown, maintaining a consistent presence at the top of the interface.
- Leads Table with Status Indicators: A card-style table displaying leads with color-coded status badges and hover effects for each row, integrating infinite scrolling with skeleton loaders during loading states.
- Lead Detail Side Sheet: A slide-in panel providing detailed information about a selected lead, including contact details, campaign information, and a timeline UI for interaction history, with action buttons for contacting or updating the lead status.
- Campaigns Table with Sortable Columns: A table presenting campaign data with sortable column headers, status badges indicating campaign status, and progress bars showing response rates. Includes an actions menu for editing, pausing/resuming, or deleting campaigns.
- Campaign Statistics Summary Cards: Summary cards displaying key campaign statistics such as total campaigns, leads, and response rate, utilizing a grid layout and subtle gradient backgrounds for visual variety.
- Theme Selection: Allows a user to switch between dark and light mode, enhancing the application's adaptability and user preference. 

## Style Guidelines:

- Primary color: Use a saturated blue (#2563EB) for main actions and interactive elements. The blue was chosen as an alternative to teal because it evokes professionalism, trust, and clarity without being overused in SaaS applications.
- Background color: A light gray (#F9FAFB) provides a clean, professional backdrop.
- Accent color: Use a vibrant purple (#A855F7) as an analogous color to highlight key elements and add visual interest.
- Body and headline font: 'Inter', a sans-serif font, to ensure the design feels modern, machined, objective, and neutral, and offering clear legibility and a clean aesthetic suitable for both headings and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Lucide Icons: Utilize a consistent set of icons from Lucide to provide clear and intuitive visual cues.
- Consistent Spacing: Use Tailwind CSS spacing scale (p-4, p-6, gap-4, gap-6) for consistent spacing.
- Rounded Corners: Apply rounded-2xl consistently across components to soften the UI.
- Subtle Shadows: Use shadow-sm and hover:shadow-md to add depth and indicate interactive elements.
- Smooth Transitions: Implement subtle slide, fade, and scale animations using Framer Motion to enhance user experience.