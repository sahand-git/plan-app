import { useState } from 'react';
import { db, type Task } from './db';
import { Navbar, type AppView } from './components/Navbar';
import { DailyTasksView } from './components/DailyTasksView';
import { CalendarView } from './components/CalendarView';
import { JournalView } from './components/JournalView';
import { HabitTrackerView } from './components/HabitTrackerView';
import { DataManagementView } from './components/DataManagementView';
import { TaskModal } from './components/TaskModal';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { getTodayString } from './utils/date';

export function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<AppView>('tasks');
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());
  
  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Global shortcut 'n' to open new task modal
  useKeyboardShortcut('n', () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  }, !isTaskModalOpen);

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask?.id) {
      await db.tasks.update(editingTask.id, {
        ...taskData,
      });
    } else {
      await db.tasks.add({
        ...taskData,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenNewTask={handleOpenNewTask}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 pb-16">
        {currentView === 'tasks' && (
          <DailyTasksView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            onOpenNewTask={handleOpenNewTask}
            onEditTask={handleEditTask}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
            onJumpToDayTasks={(date) => {
              setCurrentDate(date);
              setCurrentView('tasks');
            }}
          />
        )}

        {currentView === 'notes' && (
          <JournalView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />
        )}

        {currentView === 'habits' && (
          <HabitTrackerView
            currentDate={currentDate}
            onSelectDate={setCurrentDate}
          />
        )}

        {currentView === 'data' && (
          <DataManagementView
            theme={theme}
            onSetTheme={setTheme}
          />
        )}
      </main>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultDate={currentDate}
      />
    </div>
  );
}

export default App;
