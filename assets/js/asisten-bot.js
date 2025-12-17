document.addEventListener('DOMContentLoaded', function () {

    console.log("Asisten Bot Berjalan..."); // Cek di Console Browser

    // === 1. DEFINISI DATABASE (Ditaruh Paling Atas Biar Aman) ===
    // Struktur: keywords (pemicu), response (jawaban), options (tombol lanjutan)
    const knowledgeBase = [
        // --- SYSTEM ---
        {
            keywords: ["reset", "hapus", "clear", "bersihkan"],
            response: "🧹 Chat berhasil dibersihkan! Mulai dari awal ya.",
            action: "reset",
            options: []
        },
        {
            keywords: ["menu", "awal", "start", "mulai", "home", "halo", "hi", "pagi", "siang", "sore", "malam"],
            response: "Halo Sobat Tani! 👋 SIPETANI siap bantu. <br>Silakan pilih kategori di bawah:",
            options: [
                { label: "Info Pupuk", value: "pupuk" },
                { label: "Info Hama", value: "hama" },
                { label: "Cara Tanam", value: "tanaman" },
                { label: "Hidroponik", value: "hidroponik" }
            ]
        },

        // --- PUPUK ---
        {
            keywords: ["pupuk", "nutrisi", "subur"],
            response: "Soal **Pupuk** (Nutrisi). Mau metode yang mana?",
            options: [
                { label: "Pupuk Organik", value: "organik" },
                { label: "Pupuk Kimia", value: "kimia" },
                { label: "Kembali ke Menu", value: "menu" }
            ]
        },
        {
            keywords: ["organik", "kandang", "kompos", "alami"],
            response: "🌿 **Pupuk Organik**: <br>Gunakan **Pupuk Kandang** atau **Kompos**. <br>• Dosis: 2 genggam/pot per 2 minggu. <br>• Efek: Tanah gembur & subur jangka panjang.",
            options: [
                { label: "Cek Pupuk Kimia", value: "kimia" },
                { label: "Kembali ke Menu", value: "menu" }
            ]
        },
        {
            keywords: ["kimia", "npk", "urea", "mutiara"],
            response: "⚡ **Pupuk Kimia (NPK)**: <br>Gunakan NPK 16-16-16 (Biru). <br>• Dosis: 1 sdt/tanaman. <br>• Cara: Tabur di pinggir pot, **JANGAN** kena batang!",
            options: [
                { label: "Cek Pupuk Organik", value: "organik" },
                { label: "Kembali ke Menu", value: "menu" }
            ]
        },

        // --- HAMA ---
        {
            keywords: ["hama", "sakit", "rusak", "obat", "kuning", "keriting"],
            response: "Tanaman sakit? 🚑 Gejalanya yang mana?",
            options: [
                { label: "Ulat", value: "ulat" },
                { label: "Kutu Putih", value: "kutu putih" },
                { label: "Daun Kuning", value: "daun kuning" },
                { label: "Daun Keriting", value: "daun keriting" },
                { label: "Kembali ke Menu", value: "menu" }
            ]
        },
        {
            keywords: ["ulat", "bolong"],
            response: "🐛 **Solusi Ulat**: <br>Ambil manual & buang. Semprot air rendaman puntung rokok/tembakau.",
            options: [{ label: "Cek Hama Lain", value: "hama" }, { label: "Menu Utama", value: "menu" }]
        },
        {
            keywords: ["kutu", "putih", "kebul"],
            response: "🦠 **Solusi Kutu Putih**: <br>Campur 1 liter air + 1 sdt sabun cuci piring + 1 sdt minyak goreng. Semprot sore hari.",
            options: [{ label: "Cek Hama Lain", value: "hama" }, { label: "Menu Utama", value: "menu" }]
        },
        {
            keywords: ["daun kuning", "layu"],
            response: "🍂 **Daun Menguning**: <br>Biasanya karena **Kebanyakan Air** (akar busuk) atau **Kurang Nitrogen**.",
            options: [{ label: "Cek Hama Lain", value: "hama" }, { label: "Menu Utama", value: "menu" }]
        },
        {
            keywords: ["daun keriting", "menggulung"],
            response: "🌀 **Daun Keriting**: <br>Ini serangan **Tungau/Trips**. Pangkas pucuk rusak, semprot air sabun.",
            options: [{ label: "Cek Hama Lain", value: "hama" }, { label: "Menu Utama", value: "menu" }]
        },

        // --- TANAMAN ---
        {
            keywords: ["tanaman", "cara tanam", "tanam"],
            response: "Mau tanam apa sob? SIPETANI punya panduan ini:",
            options: [
                { label: "Cabe", value: "cabe" },
                { label: "Tomat", value: "tomat" },
                { label: "Padi", value: "padi" },
                { label: "Jagung", value: "jagung" },
                { label: "Sawi", value: "sawi" },
                { label: "Kembali ke Menu", value: "menu" }
            ]
        },
        {
            keywords: ["cabe", "cabai", "lombok"],
            response: "🌶️ **Tips Cabe**: <br>Butuh matahari full (min 6 jam). Jangan becek. Saat berbunga kasih pupuk Kalium (KNO3).",
            options: [{ label: "Cek Tanaman Lain", value: "tanaman" }, { label: "Menu Utama", value: "menu" }]
        },
        // Tambahkan tanaman lain dengan pola yang sama...

        // --- TEKNIK ---
        {
            keywords: ["hidroponik", "wick"],
            response: "💧 **Hidroponik**: <br>Nanam pake air & botol bekas. Media tanam pake Rockwool/Arang Sekam.",
            options: [{ label: "Menu Utama", value: "menu" }]
        }
    ];

    // Fallback jika tidak mengerti
    const fallbackResponse = {
        response: "Maaf sob, gue gak paham. 😅 Pilih menu di bawah aja ya:",
        options: [{ label: "Menu Utama", value: "menu" }, { label: "Reset Chat", value: "reset" }]
    };

    // === 2. DOM ELEMENTS & SYSTEM ===
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const STORAGE_KEY = 'chatHistory';

    // Cek apakah elemen ada? (Pencegahan Error)
    if (!chatBox || !userInput || !sendBtn) {
        console.error("ERROR: Elemen HTML tidak ditemukan! Cek ID chatBox/userInput/sendBtn");
        return;
    }

    // === 3. FUNGSI UTAMA ===

    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
        setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 50);
    }

    // Render Pesan
    function createMessageElement(text, sender, time) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        // Fix Bold
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        msgDiv.innerHTML = `<div class="msg-content">${formattedText}</div><span class="msg-time">${time}</span>`;
        chatBox.appendChild(msgDiv);
        scrollToBottom();
    }

    // Tambah Pesan & Simpan
    function addMessage(text, sender) {
        const time = getCurrentTime();
        createMessageElement(text, sender, time);

        // Simpan ke Storage
        try {
            let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            history.push({ text: text, sender: sender, time: time });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Gagal menyimpan chat", e);
        }
    }

    // === 4. LOGIKA OTAK BOT ===
    function getSmartResponse(input) {
        input = input.toLowerCase().trim();
        let bestMatch = null;
        let highestScore = 0;

        knowledgeBase.forEach(data => {
            let score = 0;
            data.keywords.forEach(word => {
                if (input.includes(word)) {
                    score += 1;
                    if (input === word) score += 10; // Prioritas exact match (untuk tombol)
                }
            });
            if (score > highestScore) {
                highestScore = score;
                bestMatch = data;
            }
        });

        return (bestMatch && highestScore > 0) ? bestMatch : null;
    }

    // === 5. SUGGESTION CHIPS (TOMBL) ===
    function showSuggestions(optionsArray) {
        // Hapus tombol lama
        const oldChips = document.querySelector('.suggestion-container');
        if (oldChips) oldChips.remove();

        if (!optionsArray || optionsArray.length === 0) return;

        const chipsContainer = document.createElement('div');
        chipsContainer.classList.add('suggestion-container');

        optionsArray.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt.label;
            btn.classList.add('chip-btn');

            if (opt.value === "reset") {
                btn.style.color = "red";
                btn.style.borderColor = "red";
            }

            // EVENT KLIK TOMBOL
            btn.onclick = () => {
                console.log("Tombol diklik:", opt.label, "Value:", opt.value); // Debug Log
                userInput.value = opt.value;
                handleUserChat();
            };
            chipsContainer.appendChild(btn);
        });

        chatBox.appendChild(chipsContainer);
        scrollToBottom();
    }

    // === 6. RESET SYSTEM ===
    function performReset() {
        localStorage.removeItem(STORAGE_KEY);
        chatBox.innerHTML = ''; // Bersihkan layar

        // Munculkan pesan awal
        const defaultWelcome = document.createElement('div');
        defaultWelcome.classList.add('message', 'bot', 'default-welcome');
        defaultWelcome.innerHTML = `<div class="msg-content">Halo Sobat Tani! 👋<br>Chat sudah di-reset. Mau nanya apa?</div><span class="msg-time">${getCurrentTime()}</span>`;
        chatBox.appendChild(defaultWelcome);

        // Munculkan menu awal lagi
        const initialMenu = knowledgeBase.find(k => k.keywords.includes("menu"));
        if (initialMenu) setTimeout(() => showSuggestions(initialMenu.options), 500);
    }

    // === 7. HANDLER CHAT ===
    function handleUserChat() {
        const text = userInput.value.trim();
        if (text === "") return;

        console.log("User mengirim:", text); // Debug Log

        // Hapus tombol lama saat user mengetik/klik
        const oldChips = document.querySelector('.suggestion-container');
        if (oldChips) oldChips.remove();

        // 1. Tampilkan Pesan User
        addMessage(text, 'user');
        userInput.value = '';

        // 2. Loading...
        const loadingId = "loading-" + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot');
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i>';
        chatBox.appendChild(loadingDiv);
        scrollToBottom();

        // 3. Bot Menjawab
        setTimeout(() => {
            document.getElementById(loadingId).remove();

            const botData = getSmartResponse(text);

            if (botData) {
                if (botData.action === 'reset') {
                    performReset();
                } else {
                    addMessage(botData.response, 'bot');
                    showSuggestions(botData.options);
                }
            } else {
                addMessage(fallbackResponse.response, 'bot');
                showSuggestions(fallbackResponse.options);
            }
        }, 600);
    }

    // === 8. INISIALISASI SAAT LOAD ===
    // Load History
    let savedChat = [];
    try {
        savedChat = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { localStorage.removeItem(STORAGE_KEY); }

    // Render History jika ada
    if (savedChat.length > 0) {
        const defaultMsg = document.querySelector('.default-welcome');
        if (defaultMsg) defaultMsg.remove();

        savedChat.forEach(data => createMessageElement(data.text, data.sender, data.time));

        // Tampilkan Menu Utama di paling bawah
        const menuData = knowledgeBase.find(k => k.keywords.includes("menu"));
        if (menuData) setTimeout(() => showSuggestions(menuData.options), 500);
    } else {
        // Jika chat kosong (pertama kali), tampilkan menu
        const menuData = knowledgeBase.find(k => k.keywords.includes("menu"));
        if (menuData) setTimeout(() => showSuggestions(menuData.options), 800);
    }

    // Event Listeners
    sendBtn.addEventListener('click', handleUserChat);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserChat(); });
});