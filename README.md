# نظام تسجيل الزوار والموردين | Visitors & Suppliers Registration System

**شركة ساهر للخدمات الذكية — SAHER For Smart Services**  
*إدارة الخدمات العامة / قسم إدارة المرافق*

---

## تشغيل النظام محلياً (Run Locally)

**المتطلبات:** Node.js (الإصدار 18 أو أحدث)

1. تثبيت الحزم البرمجية:
   ```bash
   npm install
   ```
2. تشغيل خادم التطوير:
   ```bash
   npm run dev
   ```
3. بناء نسخة الإنتاج (`dist`):
   ```bash
   npm run build
   ```

---

## النشر على GitHub Pages (منع ظهور الصفحة البيضاء أو ملف README)

تم إعداد المشروع بمسارات نسبية (`base: './'`) وملف نشر تلقائي عبر **GitHub Actions** (`.github/workflows/deploy.yml`):

1. ارفع ملفات المشروع إلى مستودعك على GitHub (فرع `main` أو `master`).
2. من صفحة المستودع على GitHub، انتقل إلى **Settings** ثم **Pages** من القائمة الجانبية.
3. تحت قسم **Build and deployment** -> **Source**، اختر **GitHub Actions** بدلاً من `Deploy from a branch`.
4. سيقوم GitHub تلقائياً بتشغيل `npm run build` ونشر مجلد `dist` ليعمل النظام مباشرةً على رابط GitHub Pages دون أي صفحة بيضاء.
