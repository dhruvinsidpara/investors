# Simplee – Investor Portal (Frontend)

Frontend implementation of the **Investor – Final Design** Figma file (Simplee investment management platform).
Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Recharts** and **lucide-react**.

> Frontend only: all data comes from `src/lib/data.ts` (mock data). Swap those exports for API calls when a backend is ready.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Screens

| Route | Screen |
| --- | --- |
| `/login` | Login (Welcome Back) |
| `/forgot-password`, `/reset-password` | Forgot / set new password flow |
| `/welcome` | New user invite (Welcome Aboard) |
| `/dashboard` | Dashboard – KPIs, distribution summary, recent investments/distributions, notifications, charts |
| `/investments` | My Investments – group by Investments/Entities, upload data, report error |
| `/properties` | Properties list – group by All/Investments/Entities |
| `/properties/[id]` | Property detail – gallery + lightbox, overview, description, NOI table |
| `/distributions` | Distributions – summary, donut, amount graph, add/upload proof |
| `/entities`, `/entities/[id]` | Entities list and detail |
| `/sponsors` | Sponsors – stats, charts, active/inactive filter |
| `/documents` | Documents – category filter, K1 stats, download |
| `/manage-data` | Manage Data – upload status, comment trail, re-submit |
| `/contacts` | Contacts |
| `/notifications` | Notifications (mark as read) |
| `/settings` | SMS / email notification toggles |
| `/profile` | My Profile – edit profile, change password, entity details |

## Structure

```
src/
  app/
    (auth)/        login, forgot/reset password, welcome – split layout with brand panel
    (app)/         authenticated screens – sidebar layout
  components/
    ui.tsx         PageHeader, Button, StatCard, Panel, badges, chips, RowMenu, Modal, Toggle, Toasts
    DataTable.tsx  useTable hook (search / sort / filter / CSV export), TableToolbar, DataTable
    Charts.tsx     DistributionSummary, InvestmentDonut, AmountBarChart
    Modals.tsx     Upload data, Report error, Add proof
    Sidebar.tsx, Logo.tsx
  lib/data.ts      mock data + types
```

Design tokens (Inter font, primary radial gradient `#5775E5 → #445EBE`, success/indigo/danger palettes) live in `src/app/globals.css`.
