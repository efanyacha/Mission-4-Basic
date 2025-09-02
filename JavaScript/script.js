document.addEventListener('DOMContentLoaded', function() {
    // Time
    function updateTime() {
        const timeDiv = document.getElementById('time');
        const now = new Date();
        const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const bulan = [
            'Januari','Februari','Maret','April','Mei','Juni',
            'Juli','Agustus','September','Oktober','November','Desember'
        ];
        const hariIni = hari[now.getDay()];
        const tanggal = now.getDate();
        const bulanIni = bulan[now.getMonth()];
        const tahun = now.getFullYear();
        timeDiv.textContent = `${hariIni}, ${tanggal} ${bulanIni} ${tahun}`;
    }
    updateTime();
    setInterval(updateTime, 60000);

    // To Do List
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dateInput = document.getElementById('dateInput');
    const todoBody = document.getElementById('todoBody');
    const doneList = document.getElementById('doneList');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const returnAllBtn = document.getElementById('returnAllBtn');

    // Data
    let todos = [];
    let dones = [];
    let deletedTodos = []; // Penampungan sementara tugas yang di-delete all

    // Tambah Tugas
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const task = taskInput.value.trim();
        const priority = priorityInput.value;
        let tanggalManual = dateInput.value;

        // Jika user tidak memilih tanggal, pakai hari ini
        let waktuISO, waktu;
        if (tanggalManual) {
            waktuISO = new Date(tanggalManual).toISOString();
            const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
            const bulan = [
                'Januari','Februari','Maret','April','Mei','Juni',
                'Juli','Agustus','September','Oktober','November','Desember'
            ];
            const d = new Date(tanggalManual);
            waktu = `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
        } else {
            const now = new Date();
            waktuISO = now.toISOString();
            const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
            const bulan = [
                'Januari','Februari','Maret','April','Mei','Juni',
                'Juli','Agustus','September','Oktober','November','Desember'
            ];
            waktu = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
        }

        if (!task || !priority) return;

        todos.push({ task, priority, waktu, waktuISO, done: false });
        renderTodos();
        todoForm.reset();
    });

    // Render To Do Table
    function renderTodos() {
        todoBody.innerHTML = '';
        const now = new Date();
        todos.forEach((item, idx) => {
            const tr = document.createElement('tr');

            // Cek overdue
            let isOverdue = false;
            if (item.waktuISO) {
                const submitDate = new Date(item.waktuISO);
                const diffMs = now - submitDate;
                const diffHours = diffMs / (1000 * 60 * 60);
                if (diffHours > 24) isOverdue = true; // overdue jika lebih dari 24 jam
            }

            // Centang
            const tdCheck = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.done;
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    // Ambil waktu selesai
                    const selesaiDate = new Date();
                    const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
                    const bulan = [
                        'Januari','Februari','Maret','April','Mei','Juni',
                        'Juli','Agustus','September','Oktober','November','Desember'
                    ];
                    const hariIni = hari[selesaiDate.getDay()];
                    const tanggal = selesaiDate.getDate();
                    const bulanIni = bulan[selesaiDate.getMonth()];
                    const tahun = selesaiDate.getFullYear();
                    const waktuSelesai = `${hariIni}, ${tanggal} ${bulanIni} ${tahun}`;

                    dones.push({ ...item, waktuSelesai });
                    todos.splice(idx, 1);
                }
                renderTodos();
                renderDones();
            });
            tdCheck.appendChild(checkbox);

            // Tugas
            const tdTask = document.createElement('td');
            tdTask.textContent = item.task;
            if (isOverdue) tdTask.style.color = 'red';

            // Prioritas
            const tdPriority = document.createElement('td');
            tdPriority.textContent = item.priority;
            tdPriority.className = 'priority-' + item.priority;

            // Waktu
            const tdWaktu = document.createElement('td');
            tdWaktu.textContent = item.waktu || '-';
            if (isOverdue) tdWaktu.style.color = 'red';

            // Aksi
            const tdAksi = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';
            delBtn.addEventListener('click', function() {
                todos.splice(idx, 1);
                renderTodos();
            });
            tdAksi.appendChild(delBtn);

            tr.appendChild(tdCheck);
            tr.appendChild(tdTask);
            tr.appendChild(tdPriority);
            tr.appendChild(tdWaktu);
            tr.appendChild(tdAksi);

            // Tambahkan kelas atau style jika overdue
            if (isOverdue) tr.classList.add('overdue');

            todoBody.appendChild(tr);
        });
    }

    // Render Done List (modifikasi: tambah tombol Kembalikan)
    function renderDones() {
        doneList.innerHTML = '';
        dones.forEach((item, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.task}</strong> <span class="priority-${item.priority}">[${item.priority}]</span>`;

            // Tambahkan info tanggal selesai jika ada
            if (item.waktuSelesai) {
                li.innerHTML += `<br><small>Selesai: ${item.waktuSelesai}</small>`;
            }

            // Tombol kembalikan ke To Do
            const returnBtn = document.createElement('button');
            returnBtn.textContent = 'Kembalikan';
            returnBtn.className = 'delete-btn';
            returnBtn.style.marginLeft = '10px';
            returnBtn.addEventListener('click', function() {
                todos.push({ 
                    task: item.task, 
                    priority: item.priority, 
                    waktu: item.waktu, 
                    waktuISO: item.waktuISO,
                    done: false 
                });
                dones.splice(idx, 1);
                renderTodos();
                renderDones();
            });
            li.appendChild(returnBtn);

            // Tombol hapus dari done
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';
            delBtn.style.marginLeft = '10px';
            delBtn.addEventListener('click', function() {
                dones.splice(idx, 1);
                renderDones();
            });
            li.appendChild(delBtn);
            doneList.appendChild(li);
        });
    }

    // Delete All: pindahkan semua tugas ke deletedTodos
    deleteAllBtn.addEventListener('click', function() {
        if (todos.length > 0) {
            deletedTodos = [...todos];
            todos = [];
            renderTodos();
        }
    });

    // Kembalikan All: kembalikan semua tugas dari deletedTodos ke todos
    returnAllBtn.addEventListener('click', function() {
        if (deletedTodos.length > 0) {
            todos = [...todos, ...deletedTodos];
            deletedTodos = [];
            renderTodos();
        }
    });

    // Inisialisasi
    renderTodos();
    renderDones();
});