'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Move this note to trash?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh(); // Refresh the page to show updated list
      } else {
        alert('Failed to delete note');
      }
    } catch (err) {
      alert('Error deleting note');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 rounded hover:bg-red-500/10 text-[hsl(var(--fg-muted))] hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete note">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
