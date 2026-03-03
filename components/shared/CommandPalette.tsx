'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
      <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <Command className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <span className="text-gray-400 mr-2">🔍</span>
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="w-full py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs text-gray-500 px-2 py-1">
              <Command.Item
                onSelect={() => navigate('/')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                🏠 Home
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/browse')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📚 Browse Content
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/search')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                🔍 Search
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📊 Dashboard
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/library')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📖 My Library
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Admin" className="text-xs text-gray-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => navigate('/admin')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ⚙️ Admin Dashboard
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/admin/content')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📝 Manage Content
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/admin/users')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                👥 Manage Users
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/admin/reports')}
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                📈 Reports
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">⌘K</kbd> to toggle
          </div>
        </Command>
      </div>
    </div>
  );
}
