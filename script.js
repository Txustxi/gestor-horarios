// Clase Schedule para manejar los horarios
class Schedule {
    constructor() {
        this.schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        this.filters = {
            day: '',
            task: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSchedules();
    }

    bindEvents() {
        // Formulario
        document.getElementById('scheduleForm')?.addEventListener('submit', e => this.addSchedule(e));
        
        // Filtros
        document.getElementById('dayFilter')?.addEventListener('change', () => this.filterSchedules());
        document.getElementById('taskFilter')?.addEventListener('input', () => this.filterSchedules());
        
        // Acciones
        document.getElementById('clearAll')?.addEventListener('click', () => this.clearAll());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportSchedules());
        document.getElementById('importBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile')?.addEventListener('change', e => {
            if (e.target.files[0]) {
                this.importSchedules(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Delegación de eventos para editar/eliminar
        document.getElementById('scheduleContainer')?.addEventListener('click', e => this.handleContainerClick(e));
    }

    loadSchedules() {
        this.displaySchedules(this.schedules);
    }

    displaySchedules(schedules) {
        const container = document.getElementById('scheduleContainer');
        container.innerHTML = '';

        schedules.forEach((schedule, index) => {
            const scheduleDiv = document.createElement('div');
            scheduleDiv.className = 'schedule-item fade-in';
            scheduleDiv.innerHTML = `
                <h3>${schedule.day}</h3>
                <p>Hora: ${schedule.start} - ${schedule.end}</p>
                <p>Tarea: ${escapeHTML(schedule.task)}</p>
                <p class="priority ${schedule.priority}">Prioridad: ${this.getPriorityLabel(schedule.priority)}</p>
                ${schedule.notes ? `<p><strong>Notas:</strong> ${escapeHTML(schedule.notes)}</p>` : ''}
                <div class="schedule-actions">
                    <button class="action-btn edit-btn" data-action="edit" data-index="${index}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" data-action="delete" data-index="${index}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            container.appendChild(scheduleDiv);
        });
    }

    addSchedule(event) {
        event.preventDefault();
        
        const schedule = {
            day: document.getElementById('day').value,
            start: document.getElementById('start').value,
            end: document.getElementById('end').value,
            task: document.getElementById('task').value,
            priority: document.getElementById('priority').value,
            notes: document.getElementById('notes').value
        };

        if (!schedule.day || !schedule.start || !schedule.end || !schedule.task) {
            alert('Por favor, complete todos los campos requeridos');
            return;
        }

        if (!validateTime(schedule.start, schedule.end)) {
            alert('La hora de inicio debe ser anterior a la hora de fin');
            return;
        }

        this.schedules.push(schedule);
        this.saveSchedules();
        event.target.reset();
        this.displaySchedules(this.schedules);
    }

    editSchedule(index) {
        const schedule = this.schedules[index];
        
        // Poblar el formulario con los datos existentes
        document.getElementById('day').value = schedule.day;
        document.getElementById('start').value = schedule.start;
        document.getElementById('end').value = schedule.end;
        document.getElementById('task').value = schedule.task;
        document.getElementById('priority').value = schedule.priority;
        document.getElementById('notes').value = schedule.notes;

        // Eliminar el horario existente
        this.schedules.splice(index, 1);
        this.saveSchedules();
        this.displaySchedules(this.schedules);
    }

    deleteSchedule(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este horario?')) {
            this.schedules.splice(index, 1);
            this.saveSchedules();
            this.displaySchedules(this.schedules);
        }
    }

    clearAll() {
        if (confirm('¿Estás seguro de que quieres eliminar todos los horarios?')) {
            this.schedules = [];
            this.saveSchedules();
            this.displaySchedules([]);
        }
    }

    exportSchedules() {
        const blob = new Blob([JSON.stringify(this.schedules, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'horarios.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveSchedules() {
        localStorage.setItem('schedules', JSON.stringify(this.schedules));
    }

    filterSchedules() {
        const dayFilter = document.getElementById('dayFilter').value;
        const taskFilter = document.getElementById('taskFilter').value.toLowerCase();
        
        const filtered = this.schedules.filter(schedule => {
            const matchesDay = !dayFilter || schedule.day === dayFilter;
            const matchesTask = !taskFilter || schedule.task.toLowerCase().includes(taskFilter);
            return matchesDay && matchesTask;
        });

        this.displaySchedules(filtered);
    }

    handleContainerClick(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const index = parseInt(btn.dataset.index, 10);
        if (btn.dataset.action === 'edit') {
            this.editSchedule(index);
        } else if (btn.dataset.action === 'delete') {
            this.deleteSchedule(index);
        }
    }

    importSchedules(file) {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    this.schedules = this.schedules.concat(data);
                    this.saveSchedules();
                    this.displaySchedules(this.schedules);
                } else {
                    alert('Archivo inválido');
                }
            } catch (err) {
                alert('Error al leer el archivo');
            }
        };
        reader.readAsText(file);
    }

    getPriorityLabel(priority) {
        const labels = {
            baja: 'Baja',
            media: 'Media',
            alta: 'Alta'
        };
        return labels[priority] || 'Sin especificar';
    }
}

// Inicializar la aplicación
const schedule = new Schedule();

// Validación de horarios
function validateTime(start, end) {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    return startTime < endTime;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

