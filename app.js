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
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Desactivar botón y mostrar estado de envío
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando propuesta...";

        // Obtener servicios seleccionados de la calculadora
        const selectedServices = [];
        checkboxes.forEach((cb) => {
            if (cb.checked) {
                const card = cb.closest(".service-item");
                const srvName = card.querySelector(".service-name").textContent;
                const price = cb.dataset.price;
                selectedServices.push(`${srvName} ($${price} USD)`);
            }
        });
        const totalBudget = totalPriceEl.textContent;

        // Enviar propuesta a FormSubmit.co
        fetch("https://formsubmit.co/ajax/camposderapcontacto@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Nombre: name,
                Email: email,
                Mensaje: message,
                "Servicios Seleccionados": selectedServices.join(", ") || "Ninguno",
                "Presupuesto Estimado": totalBudget,
                _subject: `Nueva Propuesta de Colaboración - ${name}`
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            // Actualizar texto del modal de éxito
            modalStatusText.innerHTML = `¡Hola <strong>${name}</strong>!<br><br>Tu propuesta ha sido enviada con éxito directamente a <strong>camposderapcontacto@gmail.com</strong>.<br><br>Te responderemos lo antes posible a <strong>${email}</strong> para coordinar las especificaciones y comenzar a trabajar juntos.`;
            
            // Mostrar Modal
            successModal.classList.add("active");

            // Reiniciar formulario
            contactForm.reset();
            
            // Deseleccionar servicios en la calculadora
            checkboxes.forEach(cb => cb.checked = false);
            updateCalculator();
        })
        .catch(error => {
            console.error("Error al enviar formulario:", error);
            // Mensaje de respaldo amigable
            modalStatusText.innerHTML = `¡Hola <strong>${name}</strong>!<br><br>Hubo un problema temporal al enviar el formulario automáticamente.<br><br>Por favor, copia tu propuesta y envíala directamente a: <strong>camposderapcontacto@gmail.com</strong>.`;
            successModal.classList.add("active");
        })
        .finally(() => {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
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
            src: "salsa_neutro.mp4",
            title: "@camposderap | Salsa de Neutro",
            views: "58.4K",
            likes: "915",
            comments: "71"
        },
        {
            src: "pez_fuma.mp4",
            title: "@camposderap | El Pez que Fuma",
            views: "13.4K",
            likes: "1,557",
            comments: "71"
        },
        {
            src: "faker.mp4",
            title: "@camposderap | Faker",
            views: "8,393",
            likes: "443",
            comments: "50"
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
