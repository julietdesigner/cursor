document.addEventListener('DOMContentLoaded', function() {
    // 从sessionStorage获取支票数据
    const checkDataString = sessionStorage.getItem('checkData');
    
    if (checkDataString) {
        const checkData = JSON.parse(checkDataString);
        
        // 填充支票详情
        document.getElementById('check-number').textContent = checkData.checkNumber;
        document.getElementById('check-date').textContent = formatDate(checkData.date);
        document.getElementById('check-amount').textContent = '$' + checkData.amount;
        document.getElementById('check-payee').textContent = checkData.payeeName;
        document.getElementById('check-bank').textContent = checkData.bankName;
        document.getElementById('check-memo').textContent = checkData.memo;
    } else {
        // 如果没有数据，显示默认值
        document.getElementById('check-number').textContent = '12345678';
        document.getElementById('check-date').textContent = formatDate(new Date().toISOString().substr(0, 10));
        document.getElementById('check-amount').textContent = '$134.00';
        document.getElementById('check-payee').textContent = '1099 Form Application Service';
        document.getElementById('check-bank').textContent = 'Bank of America';
        document.getElementById('check-memo').textContent = 'Form processing payment';
    }
    
    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // 清除sessionStorage中的支票数据
    sessionStorage.removeItem('checkData');
    
    // 生成交易ID
    const transactionId = generateTransactionId();
    
    // 如果页面上有交易ID元素，则填充它
    const transactionIdElement = document.getElementById('transaction-id');
    if (transactionIdElement) {
        transactionIdElement.textContent = transactionId;
    }
    
    // 添加确认号码到页面
    const confirmationElement = document.createElement('div');
    confirmationElement.className = 'confirmation-number';
    confirmationElement.innerHTML = `
        <span class="detail-label">Confirmation #:</span>
        <span class="detail-value">${transactionId}</span>
    `;
    
    // 将确认号码添加到详情卡片中
    const detailCard = document.querySelector('.detail-card');
    if (detailCard) {
        detailCard.appendChild(confirmationElement);
    }
    
    // 生成随机交易ID
    function generateTransactionId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TX-${timestamp}-${random}`;
    }
    
    // 添加打印功能
    const printButton = document.createElement('button');
    printButton.className = 'btn btn-print';
    printButton.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDQ4IDEyOHYtOTZIMzA0VjBoLTE5MnY0OEg2NHY4MEgwdjIyNGg2NHY4MGgzODR2LTgwaDY0VjEyOGgtNjR6TTI1NiAzMmg0OHY2NEgyNTZWMzJ6TTk2IDQ4aDEyOHY5NmgxNjBWNDhoMzJ2ODBIOTZWNDh6bTMyMCAzNTJIOTZ2LTgwaDMyMHY4MHptNjQtMTEySDMyVjE2MGg0NDh2MTI4eiIvPjwvc3ZnPg==" alt="Print"> Print Receipt';
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // 将打印按钮添加到按钮容器中
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        buttonContainer.appendChild(printButton);
    }
    
    // 添加倒计时重定向
    let countdown = 60; // 60秒后重定向
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    countdownElement.innerHTML = `You will be redirected to the dashboard in <span id="countdown-timer">${countdown}</span> seconds.`;
    
    // 将倒计时元素添加到页面
    const nextSteps = document.querySelector('.next-steps');
    if (nextSteps) {
        nextSteps.after(countdownElement);
    }
    
    // 开始倒计时
    const countdownInterval = setInterval(function() {
        countdown--;
        const countdownTimer = document.getElementById('countdown-timer');
        if (countdownTimer) {
            countdownTimer.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = '/Volumes/work/cmcm-code-item/222/dashboard.html';
        }
    }, 1000);
    
    // 添加取消倒计时的选项
    const cancelCountdown = document.createElement('button');
    cancelCountdown.className = 'btn-link';
    cancelCountdown.textContent = 'Stay on this page';
    cancelCountdown.addEventListener('click', function() {
        clearInterval(countdownInterval);
        countdownElement.style.display = 'none';
    });
    
    countdownElement.appendChild(cancelCountdown);
});