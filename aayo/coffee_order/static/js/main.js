document.addEventListener('DOMContentLoaded', function() {
    const cafeLogos = document.querySelectorAll('.cafe-logo-container');
    const cafeInput = document.getElementById('cafe-input');
    const createRoomForm = document.getElementById('create-room-form');
    const orderForm = document.getElementById('order-form');
    const ordersList = document.getElementById('orders-list');
    const isHomePage = document.querySelector('.home-content');
    const startButton = document.getElementById('start-button');
    const createRoomButton = createRoomForm ? createRoomForm.querySelector('.btn') : null;
    const coffeeCup = document.querySelector('.coffee-cup');
    const coffeeFill = coffeeCup ? coffeeCup.querySelector('.coffee-fill') : null;

    // Cafe selection
    if (cafeLogos && cafeInput) {
        cafeLogos.forEach(logo => {
            logo.addEventListener('click', function() {
                cafeLogos.forEach(logo => logo.classList.remove('selected'));
                this.classList.add('selected');
                cafeInput.value = this.dataset.cafe;
                console.log("Selected cafe:", cafeInput.value);
            });
        });
    }

    // Order form submission
    if (orderForm && ordersList) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            addOrderToList(formData);
            this.reset();
            animateCoffeeFill();
        });
    }

    // Home page interactions
    if (isHomePage && startButton && coffeeCup && coffeeFill) {
        startButton.addEventListener('mouseenter', () => coffeeFill.style.height = '80%');
        startButton.addEventListener('mouseleave', () => coffeeFill.style.height = '0');
        startButton.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => window.location.href = '/create_room/', 500);
        });
    }

    // Create room form interactions
    if (createRoomForm && createRoomButton) {
        createRoomButton.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        createRoomButton.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        createRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!cafeInput.value) {
                alert('카페를 선택해주세요.');
                return;
            }
            createRoomButton.classList.add('clicked');
            setTimeout(() => this.submit(), 500);
        });
    }

    // Utility functions
    function addOrderToList(formData) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `
            <p>☕ ${formData.get('menu')}</p>
            <p>${formData.get('size')} | ${formData.get('temperature')}</p>
        `;
        ordersList.appendChild(orderItem);
    }

    function animateCoffeeFill() {
        if (coffeeFill) {
            coffeeFill.style.height = '100%';
            setTimeout(() => coffeeFill.style.height = '0', 2000);
        }
    }

    function copyLink() {
        const copyText = document.getElementById("room-link");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("링크가 복사되었습니다: " + copyText.value);
    }

    function showCategory(category) {
        var menuItems = document.getElementsByClassName("menu-items");
        for (var i = 0; i < menuItems.length; i++) {
            menuItems[i].style.display = "none";
        }
        document.getElementById(category).style.display = "block";
    }
    
    function goToCustom(roomId, menuName) {
        const url = `/room/${roomId}/?menu=${encodeURIComponent(menuName)}`;
        window.location.href = url;
    }

    // Hover effects
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseover', () => item.style.backgroundColor = '#FFF8E1');
        item.addEventListener('mouseout', () => item.style.backgroundColor = 'white');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Expose functions to global scope
    window.copyLink = copyLink;
    window.showCategory = showCategory;
    window.goToCustom = goToCustom;
});
