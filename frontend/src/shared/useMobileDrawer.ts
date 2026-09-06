import { useEffect, useRef, useState } from 'react';

export function useMobileDrawer() {
  const [open, setOpen] = useState(false);
  const sideRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 960px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', resize);
    return () => desktop.removeEventListener('change', resize);
  }, []);
  useEffect(() => {
    if (!open || !sideRef.current) return;
    const sidebar = sideRef.current;
    const workspace = sidebar.nextElementSibling;
    const overflow = document.body.style.overflow;
    const focusable = () => Array.from(sidebar.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),summary')).filter(el => el.getClientRects().length);
    workspace?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    focusable()[0]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key !== 'Tab') return;
      const items = focusable(), first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    sidebar.addEventListener('keydown', key);
    return () => {
      sidebar.removeEventListener('keydown', key);
      workspace?.removeAttribute('inert');
      document.body.style.overflow = overflow;
      menuButton.current?.focus();
    };
  }, [open]);
  return { open, setOpen, sideRef, menuButton };
}
