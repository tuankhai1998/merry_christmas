document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const snowCount = 100;
    const typingSpeed = 50;
    
    // Tin nhắn tuần tự
    const messages = [
        "Chúc người đẹp một giáng sinh ấm áp và hạnh phúc!🎁🎄",
        "Hương à ! Anh không muốn gọi em là người đẹp nữa mà anh muốn được gọi em là người yêu ❤️",
        "Làm người yêu anh nhé... ❤️"
    ];

    // Danh sách ảnh bay
    const floatingImages = [
        'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 
        'images/4.jpg', 'images/5.jpg', 'images/6.jpg', 
        'images/7.jpg', 'images/8.jpg', 'images/9.jpg'
    ];

    // --- Snowfall Logic ---
    const createSnow = () => {
        const container = document.querySelector('.snow-container');
        container.innerHTML = ''; 
        
        for (let i = 0; i < snowCount; i++) {
            const snow = document.createElement('div');
            snow.className = 'snowflake';
            snow.innerHTML = '❄';
            snow.style.left = Math.random() * 100 + 'vw';
            snow.style.fontSize = (Math.random() * 15 + 10) + 'px';
            snow.style.opacity = Math.random() * 0.7 + 0.3;
            
            const duration = Math.random() * 5 + 5;
            snow.style.animationDuration = duration + 's';
            snow.style.animationDelay = (Math.random() * 5) * -1 + 's';
            
            container.appendChild(snow);
        }
    };

    // --- Sequential TypeWriter Logic ---
    const typeWriterSequence = async (msgs, elementId, speed) => {
        const element = document.getElementById(elementId);
        const bgMusic = document.getElementById('bgMusic');
        const finalMusic = document.getElementById('finalMusic');
        
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        const typeText = (text) => new Promise(resolve => {
            let i = 0;
            element.innerHTML = "";
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });

        for (let k = 0; k < msgs.length; k++) {
            // Chuyển nhạc khi đến tin nhắn thứ 3 (index 2)
            if (k === 2) {
                bgMusic.pause();
                finalMusic.play().catch(() => {});
            }

            await typeText(msgs[k]);
            
            if (k < msgs.length - 1) {
                await wait(2000);
                element.innerHTML = "";
            } else {
                // Câu cuối cùng -> Hiện nút bấm
                await wait(500);
                document.getElementById('btnContainer').classList.remove('hidden');
            }
        }
    };

    // --- Transform Snow to Hearts ---
    const transformSnowToHearts = () => {
        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach(flake => {
            flake.style.transition = "all 1s ease";
            flake.style.transform = "scale(1.5)";
            flake.innerHTML = "❤️";
            flake.classList.add('heart');
        });
    };

    // --- Floating Images Logic ---
    const showFloatingImages = () => {
        if (window.innerWidth > 768) {
            const zones = [
                // Top Center (Above Card)
                { left: [35, 65], top: [2, 12] },
                
                // Bottom Center (Below Card)
                { left: [35, 65], top: [88, 95] },

                // Left Column
                { left: [2, 18], top: [5, 25] },
                { left: [2, 18], top: [30, 50] },
                { left: [2, 18], top: [55, 75] },
                { left: [2, 18], top: [80, 95] },

                // Right Column
                { left: [82, 98], top: [5, 25] },
                { left: [82, 98], top: [30, 50] },
                { left: [82, 98], top: [55, 75] },
                { left: [82, 98], top: [80, 95] }
            ];

            const shuffledZones = zones.sort(() => 0.5 - Math.random());

            floatingImages.forEach((src, index) => {
                const zoneIndex = index % shuffledZones.length;
                const zone = shuffledZones[zoneIndex];
                
                const img = document.createElement('img');
                img.src = src;
                img.className = 'floating-image';
                
                const left = Math.random() * (zone.left[1] - zone.left[0]) + zone.left[0];
                const top = Math.random() * (zone.top[1] - zone.top[0]) + zone.top[0];
                
                img.style.left = left + '%';
                img.style.top = top + '%';
                img.style.animationDelay = (index * 0.5) + 's';
                
                img.onerror = () => { img.style.display = 'none'; };
                document.body.appendChild(img);
            });
        }
    };

    // --- Button Logic ---
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');
    
    // Nút "Thêm thời gian" né tránh
    btnNo.addEventListener('mouseover', () => {
        // Random vị trí mới
        const x = Math.random() * (window.innerWidth - btnNo.offsetWidth);
        const y = Math.random() * (window.innerHeight - btnNo.offsetHeight);
        
        btnNo.style.position = 'fixed';
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
        
        // Hiệu ứng mờ và nhỏ đi
        btnNo.style.transition = 'all 0.5s';
        btnNo.style.opacity = '0.5';
        btnNo.style.transform = 'scale(0.8)';
        
        // Reset sau 3s
        setTimeout(() => {
            btnNo.style.opacity = '1';
            btnNo.style.transform = 'scale(1)';
        }, 3000);
    });

    // Nút "Đồng ý"
    btnYes.addEventListener('click', () => {
        // Ẩn nội dung card
        document.getElementById('cardContent').classList.add('hidden');
        
        // Hiện GIF
        const gifContainer = document.getElementById('finalGifContainer');
        gifContainer.classList.remove('hidden');
        
        // Đổi tuyết thành tim
        transformSnowToHearts();
        
        // Bắn pháo giấy (tạo thêm tim bay)
        createHeartExplosion();
    });

    // Tạo thêm tim bay khi đồng ý
    const createHeartExplosion = () => {
        const container = document.querySelector('.snow-container');
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.className = 'snowflake heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(heart);
        }
    };

    // --- Interaction Logic ---
    const giftBox = document.getElementById('giftBox');
    const card = document.getElementById('card');
    const bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playMusic');
    let isPlaying = true;

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.textContent = "🎵 Bật nhạc";
        } else {
            bgMusic.play().catch(e => alert("Hãy tương tác với trang web để phát nhạc!"));
            playBtn.textContent = "⏸️ Dừng nhạc";
        }
        isPlaying = !isPlaying;
    });

    giftBox.addEventListener('click', () => {
        giftBox.style.transform = "scale(0) rotate(720deg)";
        giftBox.style.opacity = "0";
        
        setTimeout(() => {
            giftBox.style.display = 'none';
            card.classList.remove('hidden');
            typeWriterSequence(messages, 'message', typingSpeed);
            showFloatingImages();
            
            if (!isPlaying) {
                bgMusic.play().catch(() => {});
                playBtn.textContent = "⏸️ Dừng nhạc";
                isPlaying = true;
            }
        }, 800);
    });

    createSnow();
});