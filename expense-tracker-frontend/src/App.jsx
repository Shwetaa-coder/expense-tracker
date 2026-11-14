import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CreditCard, LayoutDashboard,
  LogOut, Menu, Plus, Search, Settings, Tags, Trash2, TrendingDown, TrendingUp,
  Wallet, X, Pencil, Filter, IndianRupee, PiggyBank, RefreshCw, Check, AlertCircle
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { endpoints, errorMessage, USER_ID } from './api';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const monthName = (m) => new Date(2000, Number(m) - 1, 1).toLocaleString('en-IN', { month: 'long' });
const dateLabel = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function App() {
  const [active, setActive] = useState('Overview');
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [dashboard, setDashboard] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0, categoryWiseExpenses: {} });
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState({ type: '', categoryId: '', startDate: '', endDate: '', search: '' });
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ totalPages: 0, totalElements: 0 });

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(null), 3600);
  };

  const loadCommon = useCallback(async () => {
    const [u, c] = await Promise.all([endpoints.user(), endpoints.categories()]);
    setUser(u.data); setCategories(c.data || []);
  }, []);

  const loadDashboard = useCallback(async () => {
    const [d, t, b] = await Promise.all([
      endpoints.dashboard(month, year),
      endpoints.transactions({ page: 0, size: 5, sortBy: 'date', direction: 'DESC' }),
      endpoints.budgets({ month, year }),
    ]);
    setDashboard(d.data); setTransactions(t.data?.content || []); setBudgets(b.data || []);
  }, [month, year]);

  const loadTransactions = useCallback(async () => {
    const params = { page, size: 10, sortBy: 'date', direction: 'DESC' };
    if (transactionFilters.type) params.type = transactionFilters.type;
    if (transactionFilters.categoryId) params.categoryId = transactionFilters.categoryId;
    if (transactionFilters.startDate) params.startDate = transactionFilters.startDate;
    if (transactionFilters.endDate) params.endDate = transactionFilters.endDate;
    const response = await endpoints.transactions(params);
    setTransactions(response.data?.content || []);
    setPageData({ totalPages: response.data?.totalPages || 0, totalElements: response.data?.totalElements || 0 });
  }, [page, transactionFilters.type, transactionFilters.categoryId, transactionFilters.startDate, transactionFilters.endDate]);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      await Promise.all([loadCommon(), loadDashboard()]);
      if (active === 'Transactions') await loadTransactions();
    } catch (error) { notify(errorMessage(error), 'error'); }
    finally { setLoading(false); setBusy(false); }
  }, [active, loadCommon, loadDashboard, loadTransactions]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (active === 'Transactions') loadTransactions().catch(e => notify(errorMessage(e), 'error')); }, [active, loadTransactions]);

  const runAction = async (action, successText) => {
    try { await action(); await refresh(); setModal(null); notify(successText); }
    catch (error) { notify(errorMessage(error), 'error'); }
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Transactions', icon: CreditCard },
    { label: 'Budgets', icon: PiggyBank }, { label: 'Categories', icon: Tags },
  ];

  if (loading) return <div className="loading-screen"><div className="loader"/><span>Preparing your money overview…</span></div>;

  return <div className="app-shell">
    {mobileNav && <div className="mobile-scrim" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Wallet size={21}/></div><span>pennywise<span className="brand-dot">.</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list">
        {navItems.map(item => <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => { setActive(item.label); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.label === 'Transactions' && <span className="nav-count">{pageData.totalElements || ''}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Keep your finances in check, one day at a time.</p><span>You're doing great <span aria-hidden>✦</span></span></div>
        <button className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => { setActive('Settings'); setMobileNav(false); }}><Settings size={18}/><span>Settings</span></button>
        <div className="profile-mini"><div className="avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div><div className="profile-copy"><strong>{user?.name || 'Your account'}</strong><small>{user?.email || `User #${USER_ID}`}</small></div><ChevronDown size={16} className="muted-icon"/></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div><div className="eyebrow">YOUR FINANCIAL SPACE</div><h1>{active === 'Overview' ? 'Good to see you' : active}</h1></div></div><div className="topbar-actions"><div className="date-chip"><CalendarDays size={16}/><span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div><button className="icon-button notification-button" title="Notifications"><Bell size={18}/><i/></button><div className="avatar top-avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div></div></header>

      {active === 'Overview' && <DashboardView dashboard={dashboard} transactions={transactions} budgets={budgets} month={month} year={year} setMonth={setMonth} setYear={setYear} setActive={setActive} setModal={setModal} categories={categories}/>}
      {active === 'Transactions' && <TransactionsView transactions={transactions} categories={categories} filters={transactionFilters} setFilters={setTransactionFilters} page={page} setPage={setPage} pageData={pageData} setModal={setModal} search={transactionFilters.search} />}
      {active === 'Budgets' && <BudgetsView budgets={budgets} month={month} year={year} setMonth={setMonth} setYear={setYear} setModal={setModal} />}
      {active === 'Categories' && <CategoriesView categories={categories} setModal={setModal} />}
      {active === 'Settings' && <SettingsView user={user} setModal={setModal} />}
      <footer className="footer"><span>Made for mindful money habits.</span><span>Personal finance · <b>pennywise</b></span></footer>
    </main>

    {modal && <Modal modal={modal} onClose={() => setModal(null)} categories={categories} user={user} month={month} year={year} runAction={runAction}/>}
    {toast && <div className={`toast ${toast.type}`}><span className="toast-icon">{toast.type === 'error' ? <AlertCircle size={18}/> : <Check size={18}/>}</span>{toast.message}<button onClick={() => setToast(null)}><X size={15}/></button></div>}
    {busy && <div className="sync-indicator"><RefreshCw size={13}/> Syncing</div>}
  </div>;
}

function PageHeading({ eyebrow, title, description, action, actionLabel = 'Add new' }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <button className="primary-button" onClick={action}><Plus size={17}/>{actionLabel}</button>}</div>;
}

function DashboardView({ dashboard, transactions, budgets, month, year, setMonth, setYear, setActive, setModal, categories }) {
  const chartData = Object.entries(dashboard.categoryWiseExpenses || {}).map(([name, value]) => ({ name, value: Number(value) }));
  const palette = ['#6c63e8', '#22a68a', '#f0a34a', '#e87991', '#5798d2', '#9b83cf'];
  const maxExpense = Math.max(...budgets.map(b => Number(b.amount)), 1);
  return <div className="content-wrap">
    <div className="overview-heading"><div><div className="eyebrow">HERE'S YOUR MONEY SNAPSHOT</div><h2>Financial overview <span className="wave">✦</span></h2><p>A little clarity goes a long way. Here's where things stand.</p></div><div className="month-picker"><CalendarDays size={16}/><select value={month} onChange={e => setMonth(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i}>{monthName(i + 1)}</option>)}</select><select value={year} onChange={e => setYear(Number(e.target.value))}>{[currentYear - 1, currentYear, currentYear + 1].map(y => <option key={y}>{y}</option>)}</select><ChevronDown size={14}/></div></div>
    <div className="stats-grid">
      <StatCard label="Total balance" value={dashboard.balance} icon={Wallet} tone="purple" note="Income minus expenses"/>
      <StatCard label="Total income" value={dashboard.totalIncome} icon={TrendingUp} tone="green" note="Money coming in"/>
      <StatCard label="Total expenses" value={dashboard.totalExpenses} icon={TrendingDown} tone="orange" note="Money going out"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel spending-panel"><div className="panel-heading"><div><h3>Spending breakdown</h3><p>Where your money went this month</p></div><span className="subtle-pill">{monthName(month)} {year}</span></div>
        {chartData.length ? <div className="chart-layout"><div className="donut-wrap"><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={67} outerRadius={91} paddingAngle={4} stroke="none">{chartData.map((entry, i) => <Cell key={entry.name} fill={palette[i % palette.length]}/>)}</Pie><Tooltip formatter={v => money(v)}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(dashboard.totalExpenses)}</strong><small>Total spent</small></div></div><div className="legend-list">{chartData.map((item, i) => <div className="legend-row" key={item.name}><span className="legend-dot" style={{ background: palette[i % palette.length] }}/><span className="legend-name">{item.name}</span><strong>{money(item.value)}</strong></div>)}</div></div> : <EmptyState icon={ChartNoAxesCombined} title="No spending to break down" text="Add an expense and your category insights will show up here."/>}
      </section>
      <section className="panel budget-panel"><div className="panel-heading"><div><h3>Budget progress</h3><p>Stay on track with your limits</p></div><button className="text-button" onClick={() => setActive('Budgets')}>See all <ChevronRight size={15}/></button></div>
        {budgets.length ? <div className="budget-preview-list">{budgets.slice(0, 4).map(b => <BudgetProgress key={b.id} budget={b}/>)}</div> : <EmptyState icon={PiggyBank} title="No budgets yet" text="Create a monthly budget to give your spending a gentle boundary." action={() => setModal({ type: 'budget' })} actionLabel="Create budget"/>}
      </section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h3>Recent transactions</h3><p>Your latest money movements</p></div><button className="text-button" onClick={() => setActive('Transactions')}>View all <ChevronRight size={15}/></button></div>
      {transactions.length ? <TransactionTable transactions={transactions} compact/> : <EmptyState icon={Activity} title="Nothing here just yet" text="Your transactions will appear here once you add them." action={() => setModal({ type: 'transaction' })} actionLabel="Add transaction"/>}
    </section>
    <div className="quick-add-row"><div className="quick-add-copy"><div className="quick-add-icon"><IndianRupee size={19}/></div><div><strong>Keep your records up to date</strong><p>It only takes a moment to log a transaction.</p></div></div><button className="primary-button" onClick={() => setModal({ type: 'transaction' })}><Plus size={17}/>Add transaction</button></div>
  </div>;
}

function StatCard({ label, value, icon: Icon, tone, note }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={19}/></span></div><div className="stat-value">{money(value)}</div><div className="stat-note"><span className={`tiny-indicator ${tone}`}/>{note}</div></div>;
}

function EmptyState({ icon: Icon, title, text, action, actionLabel }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={23}/></div><strong>{title}</strong><p>{text}</p>{action && <button className="secondary-button small" onClick={action}><Plus size={15}/>{actionLabel}</button>}</div>;
}

function BudgetProgress({ budget }) {
  const amount = Number(budget.amount || 0), spent = Number(budget.spent || 0), remaining = Number(budget.remaining || 0);
  const percent = amount ? Math.min(100, Math.max(0, spent / amount * 100)) : 0;
  const over = spent > amount;
  return <div className="budget-progress"><div className="budget-progress-top"><div className="budget-name-wrap"><span className="category-bubble">{(budget.categoryName || 'B').slice(0, 1)}</span><div><strong>{budget.categoryName}</strong><small>{money(spent)} spent</small></div></div><div className="budget-remaining"><strong className={over ? 'negative' : ''}>{money(remaining)}</strong><small>{over ? 'over budget' : 'remaining'}</small></div></div><div className="progress-track"><div className={`progress-fill ${over ? 'over' : ''}`} style={{ width: `${percent}%` }}/></div><div className="progress-caption"><span>{Math.round(percent)}% used</span><span>of {money(amount)}</span></div></div>;
}

function TransactionsView({ transactions, categories, filters, setFilters, page, setPage, pageData, setModal, search }) {
  const visible = useMemo(() => transactions.filter(t => !search || `${t.title} ${t.categoryName} ${t.description || ''}`.toLowerCase().includes(search.toLowerCase())), [transactions, search]);
  return <div className="content-wrap"><PageHeading eyebrow="YOUR MONEY, ORGANIZED" title="Transactions" description="Every rupee has a story. Keep track of yours." action={() => setModal({ type: 'transaction' })} actionLabel="Add transaction"/>
    <section className="panel filters-panel"><div className="filter-heading"><div><Filter size={16}/><strong>Filter transactions</strong></div><button className="text-button" onClick={() => { setFilters({ type: '', categoryId: '', startDate: '', endDate: '', search: '' }); setPage(0); }}>Clear filters</button></div><div className="filters-grid"><label className="field"><span>Type</span><select value={filters.type} onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(0); }}><option value="">All types</option><option value="INCOME">Income</option><option value="EXPENSE">Expense</option></select></label><label className="field"><span>Category</span><select value={filters.categoryId} onChange={e => { setFilters(f => ({ ...f, categoryId: e.target.value })); setPage(0); }}><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="field"><span>From date</span><input type="date" value={filters.startDate} onChange={e => { setFilters(f => ({ ...f, startDate: e.target.value })); setPage(0); }}/></label><label className="field"><span>To date</span><input type="date" value={filters.endDate} onChange={e => { setFilters(f => ({ ...f, endDate: e.target.value })); setPage(0); }}/></label></div><label className="search-field"><Search size={16}/><input placeholder="Search this page by title or category…" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}/></label></section>
    <section className="panel table-panel"><div className="panel-heading"><div><h3>All transactions</h3><p>{pageData.totalElements} records found</p></div><span className="subtle-pill">Page {page + 1} of {Math.max(pageData.totalPages, 1)}</span></div>{visible.length ? <TransactionTable transactions={visible} onEdit={t => setModal({ type: 'transaction', item: t })} onDelete={t => setModal({ type: 'confirmDelete', entity: 'transaction', item: t })}/> : <EmptyState icon={Search} title="No matching transactions" text="Try changing your filters, or add a new transaction." action={() => setModal({ type: 'transaction' })} actionLabel="Add transaction"/>}
      <div className="pagination"><span>Showing {visible.length} on this page · {pageData.totalElements} total</span><div><button className="icon-button" disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}><ChevronLeft size={17}/></button><button className="icon-button" disabled={page + 1 >= pageData.totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={17}/></button></div></div>
    </section>
  </div>;
}

function TransactionTable({ transactions, onEdit, onDelete, compact = false }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th>{!compact && <th className="actions-heading">ACTIONS</th>}</tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td><div className="transaction-title-cell"><span className={`transaction-icon ${t.transactionType === 'INCOME' ? 'income' : 'expense'}`}>{t.transactionType === 'INCOME' ? <ArrowDownLeft size={17}/> : <ArrowUpRight size={17}/>}</span><div><strong>{t.title}</strong><small>{t.description || (t.transactionType === 'INCOME' ? 'Income' : 'Expense')}</small></div></div></td><td><span className="category-tag">{t.categoryName || 'Uncategorized'}</span></td><td className="date-cell">{dateLabel(t.date)}</td><td><strong className={t.transactionType === 'INCOME' ? 'amount-income' : 'amount-expense'}>{t.transactionType === 'INCOME' ? '+' : '−'}{money(t.amount)}</strong></td>{!compact && <td><div className="row-actions"><button className="icon-button tiny" title="Edit" onClick={() => onEdit?.(t)}><Pencil size={15}/></button><button className="icon-button tiny danger-hover" title="Delete" onClick={() => onDelete?.(t)}><Trash2 size={15}/></button></div></td>}</tr>)}</tbody></table></div>;
}

function BudgetsView({ budgets, month, year, setMonth, setYear, setModal }) {
  const totalLimit = budgets.reduce((s, b) => s + Number(b.amount || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent || 0), 0);
  return <div className="content-wrap"><PageHeading eyebrow="PLAN WITH PURPOSE" title="Monthly budgets" description="Set thoughtful limits and make room for what matters." action={() => setModal({ type: 'budget' })} actionLabel="Create budget"/>
    <div className="budget-toolbar"><div className="month-picker"><CalendarDays size={16}/><select value={month} onChange={e => setMonth(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i}>{monthName(i + 1)}</option>)}</select><select value={year} onChange={e => setYear(Number(e.target.value))}>{[currentYear - 1, currentYear, currentYear + 1].map(y => <option key={y}>{y}</option>)}</select><ChevronDown size={14}/></div><span className="subtle-pill">{budgets.length} active {budgets.length === 1 ? 'budget' : 'budgets'}</span></div>
    <div className="budget-summary-grid"><div className="budget-summary-card"><span>Total budget</span><strong>{money(totalLimit)}</strong><small>Across {budgets.length} categories</small></div><div className="budget-summary-card"><span>Total spent</span><strong>{money(totalSpent)}</strong><small>{totalLimit ? `${Math.round(totalSpent / totalLimit * 100)}% of your total limit` : 'No spending recorded'}</small></div><div className="budget-summary-card"><span>Available</span><strong className={totalLimit - totalSpent < 0 ? 'negative' : ''}>{money(totalLimit - totalSpent)}</strong><small>Budget minus actual spending</small></div></div>
    <div className="section-title-row"><div><h3>Your category limits</h3><p>Progress updates as you record expenses.</p></div></div>
    {budgets.length ? <div className="budget-cards-grid">{budgets.map(b => <div className="panel budget-card" key={b.id}><div className="budget-card-head"><div className="category-bubble large">{(b.categoryName || 'B').slice(0, 1)}</div><div className="budget-card-title"><strong>{b.categoryName}</strong><small>{monthName(b.month)} {b.year}</small></div><div className="row-actions"><button className="icon-button tiny" onClick={() => setModal({ type: 'budget', item: b })}><Pencil size={15}/></button><button className="icon-button tiny danger-hover" onClick={() => setModal({ type: 'confirmDelete', entity: 'budget', item: b })}><Trash2 size={15}/></button></div></div><div className="budget-card-amount"><span>{money(b.spent)} <small>spent</small></span><strong>{money(b.amount)}</strong></div><BudgetProgress budget={b}/></div>)}</div> : <section className="panel"><EmptyState icon={PiggyBank} title="Give your money a plan" text="Create your first category budget and start tracking your monthly spending." action={() => setModal({ type: 'budget' })} actionLabel="Create first budget"/></section>}
  </div>;
}

function CategoriesView({ categories, setModal }) {
  const expenses = categories.filter(c => c.categoryType === 'EXPENSE');
  const incomes = categories.filter(c => c.categoryType === 'INCOME');
  return <div className="content-wrap"><PageHeading eyebrow="MAKE IT MAKE SENSE" title="Categories" description="Organize your money into the things you spend on and earn from." action={() => setModal({ type: 'category' })} actionLabel="Add category"/>
    <div className="category-groups"><CategoryGroup title="Expense categories" subtitle="Things you spend money on" type="EXPENSE" categories={expenses} setModal={setModal}/><CategoryGroup title="Income categories" subtitle="Where your money comes from" type="INCOME" categories={incomes} setModal={setModal}/></div>
  </div>;
}
function CategoryGroup({ title, subtitle, type, categories, setModal }) {
  return <section className="panel category-group"><div className="panel-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="subtle-pill">{categories.length} categories</span></div>{categories.length ? <div className="category-list">{categories.map(c => <div className="category-list-item" key={c.id}><span className={`category-bubble ${type === 'INCOME' ? 'income-bubble' : ''}`}>{c.name.slice(0, 1).toUpperCase()}</span><div className="category-list-copy"><strong>{c.name}</strong><small>{c.description || (type === 'INCOME' ? 'Income source' : 'Expense category')}</small></div><span className={`type-label ${type.toLowerCase()}`}>{type.toLowerCase()}</span><div className="row-actions"><button className="icon-button tiny" onClick={() => setModal({ type: 'category', item: c })}><Pencil size={15}/></button><button className="icon-button tiny danger-hover" onClick={() => setModal({ type: 'confirmDelete', entity: 'category', item: c })}><Trash2 size={15}/></button></div></div>)}</div> : <EmptyState icon={Tags} title={`No ${type.toLowerCase()} categories`} text="Add a category to make your records easier to understand." action={() => setModal({ type: 'category', initialType: type })} actionLabel="Add category"/>}</section>;
}

function SettingsView({ user, setModal }) {
  return <div className="content-wrap"><PageHeading eyebrow="YOUR ACCOUNT" title="Settings" description="A few details about your Pennywise profile."/><section className="panel settings-card"><div className="settings-profile"><div className="avatar settings-avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div><div><h3>{user?.name || 'Your account'}</h3><p>{user?.email}</p></div><button className="secondary-button" onClick={() => setModal({ type: 'profile', item: user })}><Pencil size={15}/>Edit profile</button></div><div className="settings-detail-grid"><div><span>Account ID</span><strong>#{user?.id || USER_ID}</strong></div><div><span>Account email</span><strong>{user?.email || '—'}</strong></div><div><span>Currency</span><strong>Indian Rupee (₹)</strong></div><div><span>Backend connection</span><strong className="connection-status"><i/> Connected locally</strong></div></div></section><div className="notice-card"><AlertCircle size={18}/><p><strong>Learning project note</strong><br/>This version uses your existing backend user ID and does not include login or authentication. Keep it local while developing.</p></div></div>;
}

function Modal({ modal, onClose, categories, user, month, year, runAction }) {
  const [form, setForm] = useState(() => {
    const item = modal.item || {};
    if (modal.type === 'transaction') return { title: item.title || '', amount: item.amount || '', transactionType: item.transactionType || 'EXPENSE', date: item.date || today(), description: item.description || '', categoryId: item.categoryId || '' };
    if (modal.type === 'category') return { name: item.name || '', categoryType: item.categoryType || modal.initialType || 'EXPENSE', description: item.description || '' };
    if (modal.type === 'budget') return { amount: item.amount || '', month: item.month || month, year: item.year || year, categoryId: item.categoryId || '' };
    if (modal.type === 'profile') return { name: item.name || '', email: item.email || '' };
    return {};
  });
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const isEdit = Boolean(modal.item);
  const title = modal.type === 'transaction' ? `${isEdit ? 'Edit' : 'Add'} transaction` : modal.type === 'category' ? `${isEdit ? 'Edit' : 'Add'} category` : modal.type === 'budget' ? `${isEdit ? 'Edit' : 'Create'} budget` : modal.type === 'profile' ? 'Edit profile' : 'Delete this item?';
  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    const action = async () => {
      if (modal.type === 'transaction') {
        const data = { ...form, amount: Number(form.amount), categoryId: Number(form.categoryId) };
        if (isEdit) await endpoints.updateTransaction(modal.item.id, data); else await endpoints.createTransaction(data);
      } else if (modal.type === 'category') {
        if (isEdit) await endpoints.updateCategory(modal.item.id, form); else await endpoints.createCategory(form);
      } else if (modal.type === 'budget') {
        const data = { ...form, amount: Number(form.amount), month: Number(form.month), year: Number(form.year), categoryId: Number(form.categoryId) };
        if (isEdit) await endpoints.updateBudget(modal.item.id, data); else await endpoints.createBudget(data);
      } else if (modal.type === 'profile') await endpoints.updateUser(form);
      else if (modal.type === 'confirmDelete') {
        if (modal.entity === 'transaction') await endpoints.deleteTransaction(modal.item.id);
        if (modal.entity === 'budget') await endpoints.deleteBudget(modal.item.id);
        if (modal.entity === 'category') await endpoints.deleteCategory(modal.item.id);
      }
    };
    try { await runAction(action, modal.type === 'confirmDelete' ? 'Deleted successfully.' : `${modal.type[0].toUpperCase() + modal.type.slice(1)} saved successfully.`); }
    finally { setSaving(false); }
  };
  if (modal.type === 'confirmDelete') return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card confirm-modal" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18}/></button><div className="confirm-icon"><Trash2 size={22}/></div><h3>{title}</h3><p>Are you sure you want to delete <strong>{modal.item?.title || modal.item?.name || modal.item?.categoryName || 'this item'}</strong>? This action cannot be undone.</p><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button danger-button" onClick={submit} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button></div></div></div>;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={e => e.stopPropagation()}><div className="modal-header"><div><div className="eyebrow">PENNYWISE</div><h3>{title}</h3></div><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
    <form onSubmit={submit}>
      {modal.type === 'transaction' && <>
        <label className="field"><span>Transaction title</span><input required maxLength="120" placeholder="e.g. Grocery shopping" value={form.title} onChange={e => set('title', e.target.value)}/></label>
        <div className="form-two"><label className="field"><span>Amount (₹)</span><input required type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)}/></label><label className="field"><span>Type</span><select value={form.transactionType} onChange={e => { set('transactionType', e.target.value); set('categoryId', ''); }}><option value="EXPENSE">Expense</option><option value="INCOME">Income</option></select></label></div>
        <div className="form-two"><label className="field"><span>Category</span><select required value={form.categoryId} onChange={e => set('categoryId', e.target.value)}><option value="">Choose category</option>{categories.filter(c => c.categoryType === form.transactionType).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="field"><span>Date</span><input required type="date" max={today()} value={form.date} onChange={e => set('date', e.target.value)}/></label></div>
        <label className="field"><span>Description <small>(optional)</small></span><textarea rows="3" maxLength="1000" placeholder="Add a note…" value={form.description} onChange={e => set('description', e.target.value)}/></label>
      </>}
      {modal.type === 'category' && <><label className="field"><span>Category name</span><input required placeholder="e.g. Food, Salary, Rent" value={form.name} onChange={e => set('name', e.target.value)}/></label><label className="field"><span>Category type</span><select value={form.categoryType} onChange={e => set('categoryType', e.target.value)}><option value="EXPENSE">Expense</option><option value="INCOME">Income</option></select></label><label className="field"><span>Description <small>(optional)</small></span><textarea rows="3" placeholder="What does this category cover?" value={form.description} onChange={e => set('description', e.target.value)}/></label></>}
      {modal.type === 'budget' && <><label className="field"><span>Expense category</span><select required value={form.categoryId} onChange={e => set('categoryId', e.target.value)}><option value="">Choose an expense category</option>{categories.filter(c => c.categoryType === 'EXPENSE').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="field"><span>Monthly limit (₹)</span><input required type="number" min="0.01" step="0.01" placeholder="e.g. 5000" value={form.amount} onChange={e => set('amount', e.target.value)}/></label><div className="form-two"><label className="field"><span>Month</span><select value={form.month} onChange={e => set('month', e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i}>{monthName(i + 1)}</option>)}</select></label><label className="field"><span>Year</span><input type="number" min="2000" value={form.year} onChange={e => set('year', e.target.value)}/></label></div></>}
      {modal.type === 'profile' && <><label className="field"><span>Full name</span><input required value={form.name} onChange={e => set('name', e.target.value)}/></label><label className="field"><span>Email address</span><input required type="email" value={form.email} onChange={e => set('email', e.target.value)}/></label></>}
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save'}</button></div>
    </form>
  </div></div>;
}

export default App;
