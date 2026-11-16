'use client';
import React, { useState } from 'react';
import {
  TrendingUp, QrCode, Wrench, Headphones, Wallet, ShoppingCart,
  ShieldCheck, Building2, Camera, CheckCircle2, AlertTriangle, PlusCircle
} from 'lucide-react';

const ROLES = {
  it_admin: { label: 'مدير النظام (IT Admin)', central: true },
  executive_board: { label: 'الإدارة العليا (م. أيمن / م. نريمان)', central: true },
  general_ops_manager: { label: 'مدير المواقع العام', central: true },
  site_manager: { label: 'مدير موقع المستشفى', central: false },
  hr_department: { label: 'شؤون الموظفين (HR)', central: true },
  insurance_contracts: { label: 'التأمينات الاجتماعية والعقود', central: true },
  finance_accounts: { label: 'الحسابات والمتابعة المالية', central: true },
  procurement: { label: 'إدارة المشتريات', central: true },
};

const SITES = [
  { id: 'shobrament', name: 'مستشفى شبرامنت المركزي', contractValue: 250000, nonReceiptLimitPct: 10 },
  { id: 'qanater', name: 'مستشفى القناطر الخيرية', contractValue: 220000, nonReceiptLimitPct: 10 },
  { id: 'dental', name: 'مركز الأسنان التخصصي', contractValue: 140000, nonReceiptLimitPct: 8 },
];

export default function BelcoERPApp() {
  const [currentUser, setCurrentUser] = useState({
    name: 'م. أحمد حمدي',
    role: 'site_manager',
    siteId: 'shobrament',
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCentralSite, setSelectedCentralSite] = useState('all');

  const effectiveSite = currentUser.siteId || selectedCentralSite;

  const [inventory, setInventory] = useState([
    { id: 1, siteId: 'shobrament', sku: 'EL-101', name: 'قاطع كهربائي رئيسي 100A', category: 'مرافق', qty: 4, cost: 1850 },
    { id: 2, siteId: 'shobrament', sku: 'MD-204', name: 'حساس نبض شاشة متابعة ICU', category: 'أجهزة طبية', qty: 0, cost: 3200 },
    { id: 3, siteId: 'qanater', sku: 'PL-305', name: 'محبس مياه رئيسي 2 بوصة', category: 'مرافق', qty: 2, cost: 950 },
  ]);

  const [faults, setFaults] = useState([
    { id: 'FLT-101', siteId: 'shobrament', dept: 'العناية المركزة (ICU)', desc: 'توقف حساس شاشة المريض رقم 4', status: 'قيد المعاينة' },
    { id: 'FLT-102', siteId: 'shobrament', dept: 'غرفة الكهرباء', desc: 'ارتفاع حرارة قاطع الدور الأرضي', status: 'بانتظار قطعة غيار' },
  ]);

  const [purchaseRequests, setPurchaseRequests] = useState([
    { id: 'PR-501', siteId: 'shobrament', item: 'حساس نبض شاشة متابعة ICU', qty: 2, estCost: 6400, status: 'بانتظار اعتماد المالية' },
  ]);

  const [pettyCash, setPettyCash] = useState([
    { id: 1, siteId: 'shobrament', date: '2026-11-14', desc: 'شراء كابلات ربط طارئة', amount: 1200, hasReceipt: true, justification: '' },
    { id: 2, siteId: 'shobrament', date: '2026-11-15', desc: 'نقل فوري لموتور طلمبة', amount: 450, hasReceipt: false, justification: 'نقل طارئ لعدم توفر فواتير ضريبية' },
  ]);
  const [newExp, setNewExp] = useState({ desc: '', amount: '', hasReceipt: true, justification: '' });

  const [qrScannedAsset, setQrScannedAsset] = useState(null);
  const [pmChecklist, setPmChecklist] = useState({ voltage: false, temp: false, breaker: false, clean: false, notes: '' });

  const [supportVisits] = useState([
    { id: 1, siteId: 'shobrament', system: 'جهاز الأشعة المقطعية (CT)', company: 'سيمنز الطبية', date: '2026-11-15', attended: true, report: true },
    { id: 2, siteId: 'qanater', system: 'المولد الاحتياطي 500 ك.ف.أ', company: 'اليكترو باور', date: '2026-11-14', attended: false, report: false },
  ]);

  const [employees] = useState([
    { id: 'EMP-01', siteId: 'shobrament', name: 'أحمد سامي حسن', job: 'فني كهرباء أول', salary: 7500, insNo: '29481726', insStatus: 'مؤمن عليه', contractEnd: '2027-06-30' },
    { id: 'EMP-02', siteId: 'shobrament', name: 'محمود السيد علي', job: 'فني أجهزة طبية', salary: 8100, insNo: '30192834', insStatus: 'مؤمن عليه', contractEnd: '2026-12-15' },
  ]);

  const filterBySite = (arr) => {
    if (effectiveSite === 'all') return arr;
    return arr.filter(x => x.siteId === effectiveSite);
  };

  const handleSwitchRole = (role, siteId = 'shobrament') => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      siteId: ROLES[role].central ? null : siteId,
    }));
  };

  const menuItems = [
    { id: 'overview', label: 'لوحة القيادة وربحية العقود', icon: TrendingUp },
    { id: 'mobile_pm', label: 'شاشة الفني (QR الصيانة الوقائية)', icon: QrCode },
    { id: 'faults', label: 'بلاغات الأعطال والمخزن', icon: Wrench },
    { id: 'support', label: 'شركات الدعم الفني الخارجية', icon: Headphones },
    { id: 'petty_cash', label: 'العهدة النقدية والتصفية', icon: Wallet },
    { id: 'procurement', label: 'إدارة المشتريات والاعتمادات', icon: ShoppingCart },
    { id: 'hr_insurance', label: 'شؤون العاملين والتأمينات والعقود', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xl">B</div>
            <div>
              <h1 className="font-bold text-lg text-white">بيلكو ERP</h1>
              <p className="text-xs text-slate-400">نظام موحد (Monolith)</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === item.id
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RBAC & Site Switcher */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <p className="text-xs text-amber-400 font-bold">محاكي الصلاحيات (RBAC):</p>
          <select
            value={currentUser.role}
            onChange={(e) => handleSwitchRole(e.target.value, currentUser.siteId || 'shobrament')}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
          >
            {Object.entries(ROLES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          {!ROLES[currentUser.role].central ? (
            <select
              value={currentUser.siteId}
              onChange={(e) => handleSwitchRole(currentUser.role, e.target.value)}
              className="w-full bg-slate-900 border border-emerald-700/60 rounded-lg p-2 text-xs text-emerald-300"
            >
              {SITES.map(s => (
                <option key={s.id} value={s.id}>حساب معزول: {s.name}</option>
              ))}
            </select>
          ) : (
            <div className="text-[11px] text-emerald-400 bg-emerald-950/50 p-2 rounded-lg border border-emerald-800/40">
              صلاحية مركزية: رؤية شاملة لكل المواقع
            </div>
          )}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              المستخدم: <span className="text-amber-400 font-semibold">{ROLES[currentUser.role].label}</span>
              {' • '}
              النطاق: <span className="text-emerald-400 font-semibold">
                {currentUser.siteId ? SITES.find(s => s.id === currentUser.siteId)?.name : 'جميع المستشفيات'}
              </span>
            </p>
          </div>

          {ROLES[currentUser.role].central && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCentralSite}
                onChange={(e) => setSelectedCentralSite(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
              >
                <option value="all">عرض كل المستشفيات</option>
                {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </header>

        {/* TAB 1: OVERVIEW & PROFITABILITY BI */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">إنجاز الصيانة الوقائية (QR)</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">96.4%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">البلاغات النشطة</p>
                <p className="text-2xl font-extrabold text-amber-400 mt-1">{filterBySite(faults).length} بلاغات</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">طلبات الشراء المعلقة</p>
                <p className="text-2xl font-extrabold text-sky-400 mt-1">{filterBySite(purchaseRequests).length} طلبات</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">التزام الدعم الفني</p>
                <p className="text-2xl font-extrabold text-purple-400 mt-1">92%</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <h3 className="font-bold text-lg text-amber-400 mb-4">مؤشر ربحية العقود (Contract Profitability BI)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-3 rounded-r-lg">المستشفى</th>
                      <th className="p-3">قيمة العقد الشهري</th>
                      <th className="p-3">التكاليف الفعلية</th>
                      <th className="p-3">صافي الربح</th>
                      <th className="p-3 rounded-l-lg">هامش الربح</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {SITES.filter(s => effectiveSite === 'all' || s.id === effectiveSite).map(site => {
                      const cost = site.id === 'shobrament' ? 178000 : site.id === 'qanater' ? 198000 : 102000;
                      const profit = site.contractValue - cost;
                      const margin = ((profit / site.contractValue) * 100).toFixed(1);
                      return (
                        <tr key={site.id}>
                          <td className="p-3 font-bold">{site.name}</td>
                          <td className="p-3">{site.contractValue.toLocaleString()} ج.م</td>
                          <td className="p-3 text-rose-400">{cost.toLocaleString()} ج.م</td>
                          <td className="p-3 text-emerald-400 font-bold">+{profit.toLocaleString()} ج.م</td>
                          <td className="p-3 font-bold text-emerald-300">{margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOBILE QR PM */}
        {activeTab === 'mobile_pm' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full font-bold">شاشة الفني الميداني (QR Code)</span>
              <QrCode className="w-6 h-6 text-amber-400" />
            </div>

            {!qrScannedAsset ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-950 border border-dashed border-amber-500 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
                <h3 className="font-bold text-lg">مسح كود المعدة أو الجهاز الطبي</h3>
                <button
                  onClick={() => setQrScannedAsset({ code: 'QR-ICU-04', name: 'شاشة متابعة العلامات الحيوية ICU-04' })}
                  className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm"
                >
                  محاكاة مسح QR (جهاز طبي)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/40">
                  <p className="text-xs text-amber-400">{qrScannedAsset.code}</p>
                  <h4 className="font-bold text-base mt-0.5">{qrScannedAsset.name}</h4>
                </div>

                <div className="space-y-2">
                  {['فحص الجهد والبطارية', 'التأكد من الحرارة والأصوات', 'اختبار وسائل الأمان'].map((lbl, idx) => (
                    <label key={idx} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-amber-500" />
                      <span className="text-sm">{lbl}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setQrScannedAsset(null);
                    alert('تم توثيق الفحص الوقائي بالبصمة الزمنية والمكانية!');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm"
                >
                  إتمام وتوثيق الفحص
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAULTS & INVENTORY */}
        {activeTab === 'faults' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-lg text-amber-400">بلاغات الأعطال بالموقع</h3>
              {filterBySite(faults).map(f => (
                <div key={f.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-amber-400">{f.id} • {f.dept}</span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">{f.status}</span>
                  </div>
                  <p className="text-sm font-semibold">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-lg text-emerald-400">مخزن الموقع (مرافق + أجهزة طبية)</h3>
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">الصنف</th>
                    <th className="p-2.5">التصنيف</th>
                    <th className="p-2.5">الرصيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filterBySite(inventory).map(item => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-semibold">{item.name}</td>
                      <td className="p-2.5 text-xs text-slate-400">{item.category}</td>
                      <td className={`p-2.5 font-bold ${item.qty === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{item.qty} قطعة</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EXTERNAL TECH SUPPORT */}
        {activeTab === 'support' && (
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-purple-400">متابعة زيارات وتقارير شركات الدعم الفني الخارجية</h3>
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">النظام / الجهاز</th>
                  <th className="p-3">الشركة</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">حالة الحضور والتقرير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filterBySite(supportVisits).map(v => (
                  <tr key={v.id}>
                    <td className="p-3 font-bold">{v.system}</td>
                    <td className="p-3">{v.company}</td>
                    <td className="p-3">{v.date}</td>
                    <td className="p-3">
                      {v.attended ? <span className="text-emerald-400">حضرت وتم إرفاق التقرير PDF ✓</span> : <span className="text-rose-400">لم تحضر (متأخرة)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: PETTY CASH (WITH NON-RECEIPT CAP) */}
        {activeTab === 'petty_cash' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-lg text-amber-400">تسجيل مصروف عهدة</h3>
              <input
                type="text"
                placeholder="البيان..."
                value={newExp.desc}
                onChange={e => setNewExp({ ...newExp, desc: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
              />
              <input
                type="number"
                placeholder="المبلغ (ج.م)"
                value={newExp.amount}
                onChange={e => setNewExp({ ...newExp, amount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm"
              />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newExp.hasReceipt}
                  onChange={e => setNewExp({ ...newExp, hasReceipt: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span>يوجد فاتورة / إيصال رسمي</span>
              </label>

              {!newExp.hasReceipt && (
                <div className="bg-amber-950/30 border border-amber-700/40 p-3 rounded-xl space-y-2">
                  <p className="text-xs text-amber-300 font-bold">ضوابط المصروف بدون فاتورة (سقف 10%):</p>
                  <textarea
                    placeholder="التبرير الميداني الإلزامي..."
                    value={newExp.justification}
                    onChange={e => setNewExp({ ...newExp, justification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs"
                    rows={2}
                  />
                </div>
              )}

              <button
                onClick={() => {
                  if (!newExp.desc || !newExp.amount) return;
                  setPettyCash([...pettyCash, { id: Date.now(), siteId: currentUser.siteId || 'shobrament', date: '2026-11-15', desc: newExp.desc, amount: Number(newExp.amount), hasReceipt: newExp.hasReceipt, justification: newExp.justification }]);
                  setNewExp({ desc: '', amount: '', hasReceipt: true, justification: '' });
                  alert('تم تسجيل بند المصروف بنجاح!');
                }}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm"
              >
                حفظ في كشف العهدة
              </button>
            </div>

            <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-lg">كشف حساب العهدة الحي</h3>
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="p-2.5">التاريخ</th>
                    <th className="p-2.5">البيان</th>
                    <th className="p-2.5">المبلغ</th>
                    <th className="p-2.5">المستند / التبرير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filterBySite(pettyCash).map(p => (
                    <tr key={p.id}>
                      <td className="p-2.5 text-xs">{p.date}</td>
                      <td className="p-2.5 font-semibold">{p.desc}</td>
                      <td className="p-2.5 font-bold text-amber-400">{p.amount} ج.م</td>
                      <td className="p-2.5 text-xs">
                        {p.hasReceipt ? <span className="text-emerald-400">فاتورة مرفقة ✓</span> : <span className="text-amber-300">بدون فاتورة: {p.justification}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PROCUREMENT */}
        {activeTab === 'procurement' && (
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-sky-400">إدارة المشتريات والاعتمادات</h3>
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">رقم الطلب</th>
                  <th className="p-3">الصنف</th>
                  <th className="p-3">الكمية</th>
                  <th className="p-3">التكلفة التقديرية</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filterBySite(purchaseRequests).map(pr => (
                  <tr key={pr.id}>
                    <td className="p-3 font-bold">{pr.id}</td>
                    <td className="p-3">{pr.item}</td>
                    <td className="p-3">{pr.qty}</td>
                    <td className="p-3">{pr.estCost} ج.م</td>
                    <td className="p-3 text-amber-400 font-semibold">{pr.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: HR & INSURANCE */}
        {activeTab === 'hr_insurance' && (
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-emerald-400">شؤون العاملين والتأمينات الاجتماعية والعقود</h3>
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">الاسم</th>
                  <th className="p-3">الوظيفة</th>
                  <th className="p-3">الراتب الأساسي</th>
                  <th className="p-3">الرقم التأميني</th>
                  <th className="p-3">حالة التأمين</th>
                  <th className="p-3">نهاية العقد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filterBySite(employees).map(emp => (
                  <tr key={emp.id}>
                    <td className="p-3 font-bold">{emp.name}</td>
                    <td className="p-3">{emp.job}</td>
                    <td className="p-3 text-amber-400 font-bold">{emp.salary} ج.م</td>
                    <td className="p-3 font-mono text-xs">{emp.insNo}</td>
                    <td className="p-3"><span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-xs">{emp.insStatus}</span></td>
                    <td className="p-3 text-xs">{emp.contractEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
