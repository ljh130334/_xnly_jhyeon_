document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('order-form');
    const tempButtons = document.querySelectorAll('.temp-btn');
    const iceButtons = document.querySelectorAll('.ice-btn');
    const cafe = '{{ room.cafe }}';
    const orderForm = document.getElementById('order-form');
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    tempButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tempButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    iceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            iceButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // 여기에 주문 제출 로직 추가
        console.log('주문이 제출되었습니다.');
    });

    // 카페별 색상 설정
    const cafeColor = cafe === 'starbucks' ? '#006241' : '#ffd700';
    document.querySelectorAll('.btn:not(.pulsating-btn)').forEach(btn => {
        btn.style.setProperty('--hover-color', cafeColor);
    });

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(orderForm);
            const orderData = {
                orderer_name: formData.get('orderer_name'),
                menu: formData.get('menu'),
                temperature: formData.get('temperature'),
                ice: formData.get('ice'),
                extra_shot: formData.get('extra_shot'),
            };

            fetch(orderForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;
                } else {
                    alert('주문을 저장하는 데 문제가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('주문을 저장하는 데 문제가 발생했습니다.');
            });
        });
    }
    
});
