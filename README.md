## UCAN Community Website

Production-ready Next.js 15 (App Router) site for UCAN Community with a lightweight backoffice to edit homepage content, media uploads to S3/MinIO, and simple admin auth via signed cookies.

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Data**: MongoDB (content storage)
- **Storage**: S3-compatible (AWS S3 or MinIO)
- **Animations/Icons**: Motion, react-icons

---

### Requirements
- Node.js 18+ (LTS recommended)
- npm 9+ (use npm in this project)
- MongoDB instance
- S3 or MinIO bucket and credentials

### Quick Start
```bash
npm install
cp .env.local.example .env.local # then edit values (see below)
npm run dev
```
Visit http://localhost:3000

---

### Environment Variables
Create `.env.local` in the project root with the following:

```bash
# Admin authentication
AUTH_SECRET=replace-with-a-long-random-string
ADMIN_USERNAME=admin           # optional, default 'admin'
ADMIN_PASSWORD=admin123       # optional, change in production!

# MongoDB
MONGODB_URI=mongodb://user:pass@host:port/
MONGODB_DB=ucan_community

# S3 / MinIO
S3_ACCESS_KEY=your-access-key              # or AWS_ACCESS_KEY_ID
S3_SECRET_KEY=your-secret-key              # or AWS_SECRET_ACCESS_KEY
S3_BUCKET=your-bucket-name                 # or S3_BUCKET_NAME
AWS_REGION=ap-southeast-1                  # default: us-east-1
# Optional if using MinIO/self-hosted S3
S3_ENDPOINT=https://minio.example.com      # enables path-style requests
# Optional, recommended CDN/base for public images (CloudFront or custom)
S3_PUBLIC_BASE_URL=https://cdn.example.com
```

Notes
- `AUTH_SECRET` is required for signing the admin cookie. Use a secure random value.
- The repo includes a DEV-ONLY default Mongo URI in code. Always override `MONGODB_URI` in any environment.
- If you provide `S3_PUBLIC_BASE_URL`, it is used for public image URLs and Next Image config.

---

### Scripts
- `npm run dev`: Start local dev server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

---

### Backoffice (Content Management)
- Admin Login: `/login`
  - Default credentials if not set: `admin` / `admin123` (change in production)
  - Successful login sets an `ucan_admin` signed cookie.
- Editor UI: `/backoffice`
  - Update homepage content (slides, programs, partners)
  - Upload and pick images via S3/MinIO

---

### API Overview

Auth
- `POST /api/login` → body `{ username, password }` → sets admin cookie
- `POST /api/logout` → clears admin cookie

Content
- `GET /api/content` → public; returns current site content
- `PUT /api/content` → admin only; body is `SiteContent`

Media (S3)
- `GET /api/media?prefix=folder/` → list objects (public listing)
- `PUT /api/media?key=path/to/file.ext` → admin only; raw file body, `Content-Type` required
- `DELETE /api/media?key=path/to/file.ext` → admin only
- `GET /api/media/proxy?u=<public-file-url>` → streams an S3 object by public URL (helps with CORS/host allowlist)
- `POST /api/upload-url` → admin only; body `{ key, contentType }` → returns `{ uploadUrl, publicUrl }`
  - If the signed URL is `http`, the API returns a safe server proxy upload path to avoid mixed content.

Registration
- `POST /api/register` → forwards data to a Google Form; expects `{ email, fullname, nickname, faculty, major, years, interests }`

---

### Images
- Remote images are allowed based on `S3_PUBLIC_BASE_URL` or `S3_ENDPOINT` + `S3_BUCKET` inferred in `next.config.ts`.
- Use `toDisplaySrc(src)` from `src/lib/image.ts` to proxy remote URLs through `/api/media/proxy` when needed.

---

### Project Structure (high level)
```
src/
  app/
    api/                 # API routes (login, content, media, register, etc.)
    backoffice/          # Admin UI (Editor, MediaPicker)
  components/            # Home page sections
  lib/                   # auth, content (MongoDB), s3 helpers, image utils
public/                  # static assets
data/content.json        # optional seed/backup content
```

---

### Deployment
- Works on Vercel or any Node host.
- Ensure all env vars are configured in the hosting platform.
- If using a private bucket, public image access still works via signed preview or your `S3_PUBLIC_BASE_URL`.

---

### Security Notes
- Set a strong `AUTH_SECRET` and change default admin credentials.
- Override the dev Mongo URI with `MONGODB_URI` in all environments.
- Consider restricting `GET /api/media` listing if you need privacy.
- Avoid committing secrets. Use `.env*` files locally and host-level env vars in production.

---

### Troubleshooting
- Mixed content (uploads blocked): set `S3_ENDPOINT` to `https` or rely on the API's proxy upload path returned by `/api/upload-url`.
- Images not loading from S3: set `S3_PUBLIC_BASE_URL` or ensure `S3_ENDPOINT` and `S3_BUCKET` are correct; restart after changing env.
- Unauthorized on admin APIs: ensure your cookie exists and `AUTH_SECRET` is consistent across server restarts.

---

### License
This repository is made for UCAN community. Make sure you request permission before using
