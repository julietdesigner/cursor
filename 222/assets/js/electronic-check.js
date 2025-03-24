document.addEventListener('DOMContentLoaded', function() {
    // 设置当前日期
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('check-date').value = formattedDate;
    
    // 生成随机支票号码
    const randomCheckNumber = Math.floor(10000000 + Math.random() * 90000000);
    document.getElementById('check-number-value').textContent = randomCheckNumber;
    
    // 签名板初始化
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // 设置画布大小
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth - 2; // 减去边框宽度
        canvas.height = 100;
        
        // 设置线条样式
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0d47a1';
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 签名事件处理
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 触摸设备支持
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    
    // 清除签名
    document.getElementById('clear-signature').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // 签名绘制函数
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // 金额转换为文字
    const amountNumbersInput = document.getElementById('amount-numbers');
    const amountWordsInput = document.getElementById('amount-words');
    
    amountNumbersInput.addEventListener('input', function() {
        // 移除非数字和小数点
        let value = this.value.replace(/[^\d.]/g, '');
        
        // 确保只有一个小数点
        const decimalPoints = value.match(/\./g) || [];
        if (decimalPoints.length > 1) {
            value = value.replace(/\.(?=.*\.)/g, '');
        }
        
        // 限制小数点后两位
        const parts = value.split('.');
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
            value = parts.join('.');
        }
        
        this.value = value;
        
        // 转换为文字
        if (value) {
            const amount = parseFloat(value);
            if (!isNaN(amount)) {
                amountWordsInput.value = numberToWords(amount);
            }
        }
    });
    
    // 数字转换为文字函数
    function numberToWords(num) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                     'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                     'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        if (num === 0) return 'Zero Dollars and 00/100';
        
        // 分离整数和小数部分
        const dollars = Math.floor(num);
        const cents = Math.round((num - dollars) * 100);
        
        let result = '';
        
        if (dollars > 0) {
            if (dollars >= 1000) {
                result += ones[Math.floor(dollars / 1000)] + ' Thousand ';
                dollars %= 1000;
            }
            
            if (dollars >= 100) {
                result += ones[Math.floor(dollars / 100)] + ' Hundred ';
                dollars %= 100;
            }
            
            if (dollars > 0) {
                if (dollars < 20) {
                    result += ones[dollars] + ' ';
                } else {
                    result += tens[Math.floor(dollars / 10)] + ' ';
                    if (dollars % 10 > 0) {
                        result += ones[dollars % 10] + ' ';
                    }
                }
            }
            
            result += 'Dollars';
        }
        
        // 添加美分
        result += ' and ' + (cents < 10 ? '0' + cents : cents) + '/100';
        
        return result.trim();
    }
    
    // 表单提交
    document.getElementById('submit-check').addEventListener('click', function() {
        if (validateForm()) {
            // 显示加载状态
            showLoading();
            
            // 模拟处理时间
            setTimeout(function() {
                hideLoading();
                alert('Your electronic check payment has been processed successfully!');
                window.location.href = '/Volumes/work/cmcm-code-item/222/payment-success.html';
            }, 2000);
        }
    });
    
    // 表单验证
    function validateForm() {
        const requiredFields = document.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                
                // 查找或创建错误消息
                let errorMsg = field.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    field.parentNode.insertBefore(errorMsg, field.nextSibling);
                }
                
                errorMsg.textContent = 'This field is required';
                errorMsg.classList.add('visible');
            } else {
                field.classList.remove('error');
                
                // 移除错误消息
                const errorMsg = field.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.classList.remove('visible');
                }
            }
        });
        
        // 验证签名
        const canvas = document.getElementById('signature-canvas');
        const ctx = canvas.getContext('2d');
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let hasSignature = false;
        
        for (let i = 0; i < pixelData.length; i += 4) {
            if (pixelData[i + 3] > 0) {
                hasSignature = true;
                break;
            }
        }
        
        if (!hasSignature) {
            const signaturePad = document.querySelector('.signature-pad');
            signaturePad.classList.add('error');
            
            // 查找或创建错误消息
            let errorMsg = canvas.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                signaturePad.appendChild(errorMsg);
            }
            
            errorMsg.textContent = 'Signature is required';
            errorMsg.classList.add('visible');
            isValid = false;
        } else {
            document.querySelector('.signature-pad').classList.remove('error');
            
            // 移除错误消息
            const errorMsg = canvas.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.classList.remove('visible');
            }
        }
        
        if (!isValid) {
            alert('Please fill in all required fields and sign the check');
        }
        
        return isValid;
    }
    
    // 加载状态控制
    function showLoading() {
        let loadingEl = document.querySelector('.loading');
        
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            loadingEl.appendChild(spinner);
            
            document.body.appendChild(loadingEl);
        }
        
        loadingEl.classList.add('visible');
    }
    
    function hideLoading() {
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.classList.remove('visible');
        }
    }
    
    // 银行选择变更处理
    const bankSelect = document.getElementById('bank-name');
    bankSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            // 如果选择"其他"，创建一个输入框让用户输入银行名称
            const container = this.parentElement;
            
            // 检查是否已经存在自定义输入框
            let customInput = container.querySelector('#custom-bank-name');
            if (!customInput) {
                customInput = document.createElement('input');
                customInput.type = 'text';
                customInput.id = 'custom-bank-name';
                customInput.className = 'form-input';
                customInput.placeholder = 'Enter bank name';
                customInput.required = true;
                
                // 插入到选择框后面
                container.appendChild(customInput);
            } else {
                customInput.style.display = 'block';
            }
        } else {
            // 如果选择其他选项，隐藏自定义输入框
            const customInput = bankSelect.parentElement.querySelector('#custom-bank-name');
            if (customInput) {
                customInput.style.display = 'none';
                customInput.value = '';
            }
        }
    });
    
    // 更新支付按钮金额
    function updatePayButtonAmount() {
        const amount = document.getElementById('amount-numbers').value;
        const payButton = document.getElementById('submit-check');
        
        if (amount && !isNaN(parseFloat(amount))) {
            payButton.textContent = `Pay $${amount}`;
        } else {
            payButton.textContent = 'Complete Payment';
        }
    }
    
    // 监听金额变化
    document.getElementById('amount-numbers').addEventListener('input', updatePayButtonAmount);
    
    // 初始化时更新按钮
    updatePayButtonAmount();
    
    // 处理表单输入焦点
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        // 获取焦点时添加高亮样式
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // 失去焦点时移除高亮样式
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // 如果是必填字段，进行验证
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
                
                // 显示错误消息
                let errorMsg = this.nextElementSibling;
                if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    this.parentNode.insertBefore(errorMsg, this.nextSibling);
                }
                
                errorMsg.textContent = 'This field is required';
                errorMsg.classList.add('visible');
            } else {
                // 输入有效，移除错误状态
                this.classList.remove('error');
                
                // 隐藏错误消息
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.classList.remove('visible');
                }
            }
        });
    });
    
    // 创建成功页面跳转
    function redirectToSuccessPage() {
        // 创建成功页面的URL
        const successPageUrl = '/Volumes/work/cmcm-code-item/222/payment-success.html';
        
        // 获取支票信息
        const checkData = {
            checkNumber: document.getElementById('check-number-value').textContent,
            date: document.getElementById('check-date').value,
            payerName: document.getElementById('payer-name').value,
            payeeName: document.getElementById('payee-name').value,
            bankName: getBankName(),
            amount: document.getElementById('amount-numbers').value,
            amountWords: document.getElementById('amount-words').value,
            memo: document.getElementById('memo').value || 'N/A'
        };
        
        // 将数据存储在sessionStorage中，以便在成功页面使用
        sessionStorage.setItem('checkData', JSON.stringify(checkData));
        
        // 跳转到成功页面
        window.location.href = successPageUrl;
    }
    
    // 获取银行名称（处理自定义输入）
    function getBankName() {
        const bankSelect = document.getElementById('bank-name');
        if (bankSelect.value === 'other') {
            const customInput = document.getElementById('custom-bank-name');
            return customInput ? customInput.value : 'Other Bank';
        } else {
            return bankSelect.options[bankSelect.selectedIndex].text;
        }
    }
    
    // 修改表单提交处理
    document.getElementById('submit-check').addEventListener('click', function() {
        if (validateForm()) {
            // 显示加载状态
            showLoading();
            
            // 模拟处理时间
            setTimeout(function() {
                hideLoading();
                
                // 显示成功消息
                alert('Your electronic check payment has been processed successfully!');
                
                // 跳转到成功页面
                redirectToSuccessPage();
            }, 2000);
        }
    });
});