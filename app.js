document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".service-item input[type='checkbox']");
    const selectedList = document.getElementById("selected-list");
    const totalPriceEl = document.getElementById("total-price");

    // Función para actualizar el presupuesto en la calculadora
    function updateCalculator() {
        let total = 0;
        let selectedHTML = "";
        let hasSelection = false;

        checkboxes.forEach((cb) => {
            const card = cb.closest(".service-item");
            if (cb.checked) {
                hasSelection = true;
                card.classList.add("active"); // Añadir clase de brillo activo
                const price = parseFloat(cb.dataset.price);
                const srvName = card.querySelector(".service-name").textContent;
                total += price;

                selectedHTML += `
                    <div class="selected-item">
                        <span>${srvName}</span>
                        <span>$${price} USD</span>
                    </div>
                `;
            } else {
                card.classList.remove("active"); // Quitar brillo activo
            }
        });

        if (hasSelection) {
            selectedList.innerHTML = selectedHTML;
        } else {
            selectedList.innerHTML = `<p class="no-items">No has seleccionado servicios</p>`;
        }

        totalPriceEl.textContent = `$${total} USD`;
    }

    // Permitir clic en toda la tarjeta para activar la selección
    window.toggleService = function(card) {
        const cb = card.querySelector("input[type='checkbox']");
        cb.checked = !cb.checked;
        updateCalculator();
    };

    // Evitar propagación doble si se da clic directo en el checkbox
    checkboxes.forEach((cb) => {
        cb.addEventListener("click", (e) => {
            e.stopPropagation();
            updateCalculator();
        });
    });

    // Formulario de contacto y Modal de Éxito
    const contactForm = document.getElementById("contact-form");
    const successModal = document.getElementById("success-modal");
    const modalStatusText = document.getElementById("modal-status-text");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Simular envío rápido
        modalStatusText.innerHTML = `¡Hola <strong>${name}</strong>!<br><br>Hemos registrado tu propuesta en nuestro sistema local.<br><br>Te responderemos lo antes posible a <strong>${email}</strong> para coordinar las especificaciones y arrancar el análisis musical.`;
        
        // Guardar propuesta en localStorage
        const lead = { name, email, message, date: new Date().toISOString() };
        const leads = JSON.parse(localStorage.getItem("camposderap_leads") || "[]");
        leads.push(lead);
        localStorage.setItem("camposderap_leads", JSON.stringify(leads));

        // Mostrar Modal
        successModal.classList.add("active");

        // Reiniciar formulario
        contactForm.reset();
        
        // Deseleccionar servicios en la calculadora
        checkboxes.forEach(cb => cb.checked = false);
        updateCalculator();
    });

    // Cerrar Modal
    window.closeModal = function() {
        successModal.classList.remove("active");
    };

    // Cerrar modal al hacer clic fuera del recuadro de contenido
    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });

    // --- Lógica de Carrusel de Videos en el Teléfono 3D ---
    const phoneVideo = document.getElementById("phone-video");
    const videoTitle = document.getElementById("video-title");
    const vViews = document.getElementById("v-views");
    const vLikes = document.getElementById("v-likes");
    const vComments = document.getElementById("v-comments");

    const videosList = [
        {
            src: "gona.mp4",
            title: "@camposderap | Análisis: Gona",
            views: "32.4K",
            likes: "4.1K",
            comments: "280"
        },
        {
            src: "sabia_escuela.mp4",
            title: "@camposderap | La Sabia Escuela",
            views: "21.8K",
            likes: "2.8K",
            comments: "195"
        },
        {
            src: "rapiam.mp4",
            title: "@camposderap | Rap I Am",
            views: "18.5K",
            likes: "1.9K",
            comments: "140"
        }
    ];

    let currentVideoIndex = 0;
    let videoInterval = null;

    function showVideo(index) {
        currentVideoIndex = index;
        const video = videosList[currentVideoIndex];
        
        // Cargar y reproducir nuevo video
        phoneVideo.src = video.src;
        phoneVideo.load();
        
        // Intentar reproducción automática (silenciado para evitar restricciones del navegador)
        phoneVideo.play().catch(error => {
            console.log("Error al reproducir automáticamente:", error);
        });

        // Actualizar estadísticas en pantalla
        videoTitle.textContent = video.title;
        vViews.textContent = video.views;
        vLikes.textContent = video.likes;
        vComments.textContent = video.comments;
    }

    window.nextVideo = function() {
        let nextIndex = currentVideoIndex + 1;
        if (nextIndex >= videosList.length) {
            nextIndex = 0;
        }
        showVideo(nextIndex);
        resetAutoCycle();
    };

    window.prevVideo = function() {
        let prevIndex = currentVideoIndex - 1;
        if (prevIndex < 0) {
            prevIndex = videosList.length - 1;
        }
        showVideo(prevIndex);
        resetAutoCycle();
    };

    function startAutoCycle() {
        videoInterval = setInterval(() => {
            let nextIndex = currentVideoIndex + 1;
            if (nextIndex >= videosList.length) {
                nextIndex = 0;
            }
            showVideo(nextIndex);
        }, 10000); // Cambiar de video cada 10 segundos
    }

    function resetAutoCycle() {
        clearInterval(videoInterval);
        startAutoCycle();
    }

    // Iniciar ciclo de video automático
    startAutoCycle();

    // Fetch stats dynamically from stats.json
    fetch('stats.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Update Followers Counts in the Presence section
            if (data.instagram_followers) {
                const igStat = document.querySelector(".stat-card.instagram .stat-number");
                if (igStat) igStat.textContent = data.instagram_followers;
            }
            if (data.tiktok_followers) {
                const ttStat = document.querySelector(".stat-card.tiktok .stat-number");
                if (ttStat) ttStat.textContent = data.tiktok_followers;
            }
            if (data.facebook_likes) {
                const fbStat = document.querySelector(".stat-card.facebook .stat-number");
                if (fbStat) fbStat.textContent = data.facebook_likes;
            }

            // Update Video Metrics in the array
            if (data.videos && data.videos.length > 0) {
                data.videos.forEach(vData => {
                    const videoObj = videosList.find(v => v.src.includes(vData.id));
                    if (videoObj) {
                        videoObj.views = vData.views;
                        videoObj.likes = vData.likes;
                        videoObj.comments = vData.comments;
                    }
                });
                // Reload current video to display updated stats immediately
                showVideo(currentVideoIndex);
            }
        })
        .catch(error => {
            console.warn("Could not load stats.json, using local fallbacks:", error);
        });
});
