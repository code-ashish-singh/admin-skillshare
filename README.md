# SkillShare Admin Panel

SkillShare platform ka **Superadmin Dashboard** — yahan se poore platform ko manage kiya jaata hai. Users, providers, bookings, reviews, blogs aur reports sab ek jagah se control hote hain.

---

## Features

**Dashboard**
- Total users, providers, bookings, revenue ka overview
- Monthly revenue aur user growth charts
- Recent bookings aur new users list

**Users Management**
- Sabhi skill seekers ki list
- Search by name/email
- Block / Unblock users
- User delete karo

**Providers Management**
- Sabhi skill providers ki list
- Verification status filter (Pending / Verified / Rejected)
- Provider approve / reject / block karo
- Provider delete karo

**Bookings**
- Poore platform ki sabhi bookings dekho
- Status wise filter (Pending, Accepted, Completed, Cancelled)

**Reviews**
- Sabhi reviews dekho
- Review hide/unhide karo (adminHidden)
- Review delete karo

**Blogs**
- Blogs create, edit, delete karo
- Draft / Published status manage karo
- Cover image upload karo

**Reports**
- Users ke complaints dekho
- Report status update karo (Open → Under Review → Resolved → Closed)
- Admin notes add karo

**Analytics**
- Total revenue, completed bookings
- Top performing providers
- Skills by category breakdown
- Booking status distribution

---

## Tech Stack

| Technology | Use |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Axios | API calls |
| Lucide React | Icons |
| Context API | Auth state management |

---

## Project Structure

```
src/
├── components/
│   ├── common/       # Shared — Navbar, Sidebar, Table, Modal, Badge
│   ├── dashboard/    # Dashboard charts/widgets
│   ├── users/        # User management components
│   ├── providers/    # Provider management components
│   ├── bookings/     # Bookings components
│   ├── reviews/      # Reviews components
│   ├── blogs/        # Blog management components
│   ├── reports/      # Reports components
│   └── settings/     # Settings components
├── context/
│   └── AuthContext.jsx  # Admin auth state
├── layouts/
│   └── AdminLayout.jsx  # Sidebar + Navbar layout
├── pages/            # One file per section
├── routes/
│   └── ProtectedRoute.jsx
├── services/
│   └── api.js        # All admin API calls
└── utils/
    └── helpers.js
```

---

## Setup & Run

**1. Dependencies install karo**
```bash
cd skillshare-admin
npm install
```

**2. Environment configure karo**
```bash
cp .env.example .env
```

`.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

**3. Backend bhi chal raha hona chahiye**
```bash
# Alag terminal mein
cd skillshare-backend
npm run dev
```

**4. Admin panel start karo**
```bash
npm run dev
```

Admin panel open hogi: `http://localhost:5174`

---

## Pages & Routes

| Route | Page |
|---|---|
| `/login` | Admin Login |
| `/dashboard` | Dashboard Overview |
| `/users` | Users Management |
| `/providers` | Providers Management |
| `/bookings` | All Bookings |
| `/reviews` | Reviews Moderation |
| `/blogs` | Blog Management |
| `/reports` | Reports / Complaints |
| `/analytics` | Platform Analytics |
| `/settings` | Admin Settings |

---

## Admin Credentials

| Email | Password |
|---|---|
| admin@skillshare.com | admin123 |

> Pehle backend mein `npm run seed` run karo admin account banane ke liye.

---

## Important Notes

- Sirf `superAdmin` role wala user login kar sakta hai
- Regular seeker/provider ka yahan access nahi hoga
- Sabhi routes protected hain — bina login ke redirect to `/login`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Related Projects

- [skillshare](../skillshare) — Main user-facing frontend
- [skillshare-backend](../skillshare-backend) — Node.js + Express REST API
