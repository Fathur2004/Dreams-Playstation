// ============ SORT HELPER ============
function sortByTitle(items) {
    return [...items].sort((a, b) => 
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
}

// ============ LOAD GAMES ============
async function loadGames(consoleKey) {
    const grid = document.getElementById('game-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">⏳ Memuat data...</div>';

    try {
        const response = await fetch(`data/${consoleKey}.json`);
        if (!response.ok) throw new Error('Data tidak ditemukan');

        // 🔥 SORT OTOMATIS SESUAI ABJAD
        const games = sortByTitle(await response.json());

        // Update stats
        const totalEl = document.getElementById('total-games');
        if (totalEl) totalEl.textContent = games.length;

        if (games.length === 0) {
            grid.innerHTML = '<div class="empty-msg">📭 Belum ada game</div>';
            return;
        }

        let html = '';
        games.forEach(game => {
            html += `
                <div class="game-card">
                    <img src="${game.image}" alt="${game.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23e5e5e5%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2228%22 font-family=%22sans-serif%22%3E🎮%3C/text%3E%3C/svg%3E'" />
                    <div class="game-info">
                        <div class="title">${escapeHtml(game.title)}</div>
                        <div class="size">📀 ${game.size}</div>
                        <div class="storage">💾 ${game.storage || 'Hard Disk'}</div>
                        <div class="price">Rp ${formatRupiah(game.price)} <span>💰</span></div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;

        // Setup search
        setupSearch(grid);

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<div class="empty-msg">❌ Gagal memuat data</div>';
    }
}

// ============ LOAD SERVICES ============
async function loadServices() {
    const grid = document.getElementById('service-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">⏳ Memuat data...</div>';

    try {
        const response = await fetch('data/services.json');
        if (!response.ok) throw new Error('Data tidak ditemukan');

        // 🔥 SORT OTOMATIS SESUAI ABJAD
        const services = sortByTitle(await response.json());

        const totalEl = document.getElementById('total-services');
        if (totalEl) totalEl.textContent = services.length;

        if (services.length === 0) {
            grid.innerHTML = '<div class="empty-msg">📭 Belum ada service</div>';
            return;
        }

        let html = '';
        services.forEach(service => {
            html += `
                <div class="game-card">
                    <img src="${service.image}" alt="${service.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23e5e5e5%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2228%22 font-family=%22sans-serif%22%3E🔧%3C/text%3E%3C/svg%3E'" />
                    <div class="game-info">
                        <div class="title">${escapeHtml(service.title)}</div>
                        <div class="price">Rp ${formatRupiah(service.price)} <span>💰</span></div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;

        setupSearch(grid);

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<div class="empty-msg">❌ Gagal memuat data</div>';
    }
}

// ============ SEARCH ============
function setupSearch(grid) {
    const searchInput = document.querySelector('.search-input');
    const clearBtn = document.querySelector('.btn-clear');
    const cards = grid.querySelectorAll('.game-card');

    function filterGames() {
        const query = searchInput.value.toLowerCase().trim();
        cards.forEach(card => {
            const title = card.querySelector('.title')?.textContent?.toLowerCase() || '';
            card.style.display = title.includes(query) ? '' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterGames);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            cards.forEach(card => card.style.display = '');
        });
    }
}

// ============ HELPERS ============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatRupiah(angka) {
    if (!angka) return '0';
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}