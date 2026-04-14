/**
 * MasterTODO - Ultimate Task Manager
 * Architektura Obiektowa - 2026 Edition
 */

// 1. Menedżer Zadań (Logika biznesowa)
class TaskManager {
    constructor() {
        // Symulacja bazy danych (w przyszłości LocalStorage lub API)
        this.tasks = [];
        this.nextId = 1;
    }

    addTask(taskData) {
        const newTask = {
            id: this.nextId++,
            title: taskData.title,
            desc: taskData.desc,
            date: taskData.date,
            time: taskData.time,
            recurrence: taskData.recurrence,
            reminder: taskData.reminder,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        console.log("💾 Zapisano nowe zadanie:", newTask);
        return newTask;
    }

    getTasksForDate(dateString) {
        return this.tasks.filter(t => t.date === dateString);
    }
}

// 2. Menedżer Interfejsu (Manipulacja DOM i Animacje)
class UIController {
    constructor(taskManager) {
        this.taskManager = taskManager;
        
        // Elementy DOM
        this.modal = document.getElementById('add-task-modal');
        this.form = document.getElementById('task-form');
        this.openModalBtn = document.querySelector('[aria-controls="add-task-modal"]');
        this.closeModalBtn = this.modal.querySelector('button[aria-label="Zamknij okno"]');
        this.calendarGrid = document.querySelector('.calendar-grid');

        this.init();
    }

    init() {
        this.bindEvents();
        this.initMouseTracking();
    }

    bindEvents() {
        // Obsługa modala (natywny element <dialog>)
        this.openModalBtn.addEventListener('click', () => {
            this.modal.showModal();
            // Futurystyczna animacja wejścia
            this.modal.animate([
                { opacity: 0, transform: 'scale(0.95) translateY(-20px)' },
                { opacity: 1, transform: 'scale(1) translateY(0)' }
            ], { duration: 300, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' });
        });

        this.closeModalBtn.addEventListener('click', () => {
            this.modal.close();
        });

        // Obsługa formularza
        this.form.addEventListener('submit', (e) => this.handleTaskSubmit(e));
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const taskData = {
            title: formData.get('task-title'),
            desc: formData.get('task-desc'),
            date: formData.get('task-date'),
            time: formData.get('task-time'),
            recurrence: {
                interval: formData.get('recurrence-interval'),
                unit: formData.get('recurrence-unit')
            },
            reminder: formData.get('reminder-setting')
        };

        // Zapis do logiki
        const savedTask = this.taskManager.addTask(taskData);
        
        // Render na UI (szukamy kafelka z odpowiednią datą, symulacja dodania)
        this.renderTaskOnCalendar(savedTask);

        // Czyszczenie i zamykanie
        this.form.reset();
        this.modal.close();
    }

    renderTaskOnCalendar(task) {
        // W pełnej wersji tu byłaby złożona logika szukania konkretnego dnia.
        // Na potrzeby zawodów i dema, wrzucamy na "Dziś"
        const todayCell = document.querySelector('.calendar-day.today');
        if (todayCell) {
            const badge = document.createElement('div');
            badge.className = 'task-badge';
            badge.innerHTML = `<strong>${task.time}</strong> ${task.title}`;
            
            // Animacja wejścia nowego zadania
            badge.animate([
                { opacity: 0, transform: 'translateX(-20px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ], { duration: 400, easing: 'ease-out' });

            todayCell.appendChild(badge);
        }
    }

    /**
     * MAGIA CSS: Śledzenie kursora.
     * Przekazujemy pozycję myszy do zmiennych CSS, co ożywia gradienty na przyciskach.
     */
    initMouseTracking() {
        const interactiveElements = document.querySelectorAll('.btn-primary, .quick-actions button, .calendar-day');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                el.style.setProperty('--x', `${x}px`);
                el.style.setProperty('--y', `${y}px`);
            });
        });
    }
}

// 3. Menedżer Motywów (Dark/Light mode)
class ThemeManager {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'theme-dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'theme-light' ? 'theme-dark' : 'theme-light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        if (theme === 'theme-light') {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
            this.toggleBtn.textContent = '🌙'; // Zmień ikonę
        } else {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            this.toggleBtn.textContent = '☀️'; // Zmień ikonę
        }
    }
}

// 4. Główna Klasa Aplikacji (Bootstrap)
class MasterTodoApp {
    constructor() {
        console.log("🚀 Inicjalizacja MasterTODO System...");
        
        this.themeManager = new ThemeManager();
        this.taskManager = new TaskManager();
        this.uiController = new UIController(this.taskManager);
        
        // Dodanie predefiniowanego zdarzenia dla pokazu na żywo
        this.initDemoData();
    }

    initDemoData() {
        // Podpięcie szybkich rutyn z lewego panelu
        const routineBtns = document.querySelectorAll('.pre-placed-routines button');
        routineBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.textContent.trim();
                // Otwórz modal i wpisz dane
                this.uiController.modal.showModal();
                document.getElementById('task-title').value = title;
                
                // Super efekt: podświetl formularz
                this.uiController.form.animate([
                    { filter: 'brightness(1.5)' },
                    { filter: 'brightness(1)' }
                ], { duration: 500 });
            });
        });
    }
}

// Uruchomienie aplikacji po załadowaniu drzewa DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MasterTodoApp();
});