import { useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { Download, History, LayoutDashboard, Menu, Users, Wallet, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { APP_BASE_PATH, AUTH_SERVICE_URL } from '@/config/api';
import { Notice } from '@/components/ui';

import { ProductSwitcher, AccountMenu } from '@/shared/WorkspaceMenus';
import { useMobileDrawer } from '@/shared/useMobileDrawer';

const navigation=[['/','基金总览',LayoutDashboard],['/funds','基金列表',Wallet],['/investors','投资者',Users],['/operations','操作记录',History],['/data','导入与导出',Download]] as const;
export default function MainLayout(){
  const {user,logout}=useAuthStore();
  const location=useLocation();
  const { open, setOpen, sideRef, menuButton } = useMobileDrawer();
  const displayName = user?.display_name || user?.email?.split('@')[0] || '当前用户';
  const local=['localhost','127.0.0.1'].includes(window.location.hostname);
  const current=location.pathname.includes('/investors/')?'投资者详情':location.pathname.endsWith('/edit')?'编辑基金':location.pathname==='/funds/create'?'新建基金':location.pathname.endsWith('/data')?'导入与导出':navigation.find(([path])=>path!=='/'&&location.pathname.startsWith(path))?.[1]||'基金总览';
  useEffect(()=>{setOpen(false);document.querySelector<HTMLElement>('#main-content')?.focus();},[location.pathname]);
  return <div className="fund-app"><a className="skip-link" href="#main-content">跳到主要内容</a>{open&&<button className="sidebar-backdrop" aria-label="关闭导航" onClick={()=>{setOpen(false);menuButton.current?.focus();}}/>}
    <aside id="product-navigation" ref={sideRef} role={open ? 'dialog' : undefined} aria-modal={open || undefined} className={'sidebar cu-sidebar '+(open?'is-open':'')} aria-label="基金工作区导航"><Link className="brand cu-brand" to="/"><img className="brand-logo" src={`${import.meta.env.BASE_URL}brand-strawberry-a.png`} alt="快刀切草莓君" width={40} height={40} /><span>Compound</span></Link>
      <ProductSwitcher current="vestoria" urls={{vestoria: APP_BASE_PATH, account: AUTH_SERVICE_URL+'/auth/profile', navigation: import.meta.env.VITE_NAVIGATION_URL || (local ? 'http://localhost:20261/' : 'https://navigation.mr-strawberry.com/'), 'data-terminal': import.meta.env.VITE_DATA_TERMINAL_URL || (local ? 'http://localhost:20262/' : 'https://vestoria.mr-strawberry.com/data/')}} />
      <div className="nav-label cu-nav-label">工作空间</div><nav className="side-nav">{navigation.map(([path,label,Icon])=><NavLink to={path} end={path==='/'} key={path} className={({isActive})=>'nav-item '+(isActive?'active':'')}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><a className="nav-item" href={AUTH_SERVICE_URL+'/auth/profile'}><Users size={18}/>账号中心</a><p className="cu-sidebar-note">独立应用 · 统一账号</p></div>
    </aside>
    <div className="workspace"><header className="topbar cu-topbar"><div className="breadcrumb"><button ref={menuButton} className="icon-button mobile-menu" aria-label="打开导航" aria-controls="product-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button><span className="workspace-breadcrumb">工作空间</span><span className="workspace-breadcrumb">/</span><strong>{current}</strong></div><div className="topbar-right"><span className={'badge '+(user?.can_edit?'blue-badge':'')}>{user?.can_edit?'Editor · 可编辑':'Viewer · 只读'}</span><AccountMenu name={displayName} email={user?.email} accountUrl={AUTH_SERVICE_URL+'/auth/profile'} logout={logout} /></div></header>
      <main className="content cu-content" id="main-content" tabIndex={-1}>{!user?.can_edit&&<Notice>当前为 Viewer 只读模式，可查看基金、投资者、历史及导出单基金记录。录入与修改需管理员授权。</Notice>}<Outlet/><footer className="app-footer cu-footer"><span>Compound · Fund Manager</span><span>独立应用 · 统一账号</span></footer></main>
    </div>
  </div>;
}
