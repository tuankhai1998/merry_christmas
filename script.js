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
        bgMusic.play().catch(() => {});
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
                finalMusic.play().catch(() => { });
            }

            await typeText(msgs[k]);

            if (k < msgs.length - 1) {
                await wait(2000);
                element.innerHTML = "";
            } else {
                // Câu cuối cùng -> Hiện nút bấm
                await wait(500);
                document.getElementById('btnContainer').classList.remove('hidden');
                
                // Bắt đầu đếm giờ và gửi email định kỳ
                buttonShownTime = new Date();
                
                // Gửi email báo cáo mỗi 30 giây (để tránh spam, bạn có thể chỉnh xuống 3000ms = 3s nếu muốn)
                // Lưu ý: Gửi mỗi 3s sẽ rất tốn quota miễn phí của EmailJS
                emailInterval = setInterval(() => {
                    // Chỉ gửi nếu số lần hover thay đổi so với lần trước
                    if (hoverNoCount > lastHoverCount) {
                        sendEmail("ĐANG SUY NGHĨ 🤔");
                        lastHoverCount = hoverNoCount; // Cập nhật lại số lần hover đã gửi
                    }
                }, 3000); 
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
        if (window.innerWidth <= 768) return;

        const maxImages = 6;
        const activeImages = [];
        const zones = [
            // Top Center (Above Card)
            { left: [35, 55], top: [2, 10] },
            
            // Bottom Center (Below Card)
            { left: [35, 55], top: [80, 85] },

            // Left Column
            { left: [2, 12], top: [5, 20] },
            { left: [2, 12], top: [30, 45] },
            { left: [2, 12], top: [55, 70] },
            { left: [2, 12], top: [80, 90] },

            // Right Column
            { left: [80, 88], top: [5, 20] },
            { left: [80, 88], top: [30, 45] },
            { left: [80, 88], top: [55, 70] },
            { left: [80, 88], top: [80, 90] }
        ];

        const spawnImage = () => {
            // Pick random image source
            const src = floatingImages[Math.floor(Math.random() * floatingImages.length)];

            // Pick random zone
            const zone = zones[Math.floor(Math.random() * zones.length)];

            // Calculate position
            const left = Math.random() * (zone.left[1] - zone.left[0]) + zone.left[0];
            const top = Math.random() * (zone.top[1] - zone.top[0]) + zone.top[0];

            const img = document.createElement('img');
            img.src = src;
            img.className = 'floating-image';
            img.style.left = left + '%';
            img.style.top = top + '%';
            img.style.opacity = '0'; // Start invisible
            img.style.transition = 'opacity 1s ease'; // Fade effect

            document.body.appendChild(img);

            // Fade in
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });

            activeImages.push(img);

            // Manage limit
            if (activeImages.length > maxImages) {
                const oldImg = activeImages.shift();
                oldImg.style.opacity = '0';
                setTimeout(() => {
                    oldImg.remove();
                }, 1000); // Wait for fade out
            }
        };

        // Start spawning
        spawnImage();

        // Spawn new image every 2 seconds to create continuous flow
        setInterval(spawnImage, 2000);
    };

    // --- Button Logic ---
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');
    
    // Email tracking variables
    let hoverNoCount = 0;
    let lastHoverCount = 0; // Lưu số lần hover lần trước để so sánh
    let buttonShownTime = null;
    let emailInterval = null;

    // Helper: Send Email via Web3Forms
    const sendEmail = (type) => {
        const now = new Date();
        const timeElapsed = buttonShownTime ? Math.floor((now - buttonShownTime) / 1000) : 0;
        
        // Cấu trúc dữ liệu gửi đi
        const formData = {
            access_key: '27046ba6-3dee-4685-927f-01da376f8c5c', // Thay bằng Access Key của bạn từ Web3Forms
            subject: `Thông báo mới: ${type}`,
            message: `
                TRẠNG THÁI: ${type}
                -----------------------------------
                📊 Thống kê chi tiết:
                - Số lần định nhấn nút "Thêm thời gian": ${hoverNoCount} lần
                - Thời gian đã suy nghĩ: ${timeElapsed} giây
                - Thời điểm ghi nhận: ${now.toLocaleString('vi-VN')}
            `
        };

        // Gửi request đến Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async (response) => {
            const json = await response.json();
            if (response.status == 200) {
                console.log('Email sent successfully:', json.message);
            } else {
                console.log('Email sending failed:', json);
            }
        })
        .catch(error => {
            console.log('Error sending email:', error);
        });
    };

    // Nút "Thêm thời gian" né tránh
    btnNo.addEventListener('mouseover', () => {
        hoverNoCount++; // Tăng biến đếm
        
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
        // Gửi email xác nhận ngay lập tức
        sendEmail("ĐÃ ĐỒNG Ý ❤️");
        
        // Dừng gửi email định kỳ
        if (emailInterval) clearInterval(emailInterval);

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
                bgMusic.play().catch(() => { });
                playBtn.textContent = "⏸️ Dừng nhạc";
                isPlaying = true;
            }
        }, 800);
    });

    createSnow();
});