import './globals.css';

export const metadata = {
  title: 'بيلكو ERP | نظام إدارة صيانة المستشفيات',
  description: 'النظام المتكامل لإدارة صيانة المرافق والأجهزة الطبية لشركة بيلكو',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-['Cairo'] min-h-screen">
        {children}
      </body>
    </html>
  );
}
