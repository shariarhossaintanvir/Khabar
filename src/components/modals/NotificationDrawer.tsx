import React from 'react';
import { X, Bell, CheckCheck, Bike, Tag, Calendar, ChevronRight } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markAllNotificationsRead,
    navigateTo,
  } = useKhabar();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <Bike className="w-4 h-4 text-brand-600" />;
      case 'PROMO':
        return <Tag className="w-4 h-4 text-amber-500" />;
      default:
        return <Calendar className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-slate-900">Notifications</h3>
                <span className="text-xs text-slate-500">Live order & promo updates</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.actionView) {
                      navigateTo(n.actionView);
                      setIsNotificationDrawerOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                    n.isRead
                      ? 'bg-white border-slate-100 hover:border-slate-200'
                      : 'bg-brand-50/40 border-brand-100 shadow-xs'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{n.message}</p>
                  </div>

                  {n.actionView && (
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
