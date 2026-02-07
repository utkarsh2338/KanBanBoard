'use client';

import { useState, useEffect } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <KanbanBoard />
      </div>
    </main>
  );
}

