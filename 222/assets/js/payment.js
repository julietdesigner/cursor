document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const paymentOptions = document.querySelectorAll('.payment-option');
    const creditCardForm = document.getElementById('credit-card-form');
    const checkForm = document.getElementById('check-form');
    const creditCardOption = document.getElementById('credit-card-option');
    const checkOption = document.getElementById('check-option');
    const completePaymentBtn = document.getElementById('complete-payment');
    
    // 设置订单信息
    const orderNumber = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
    const checkAmount = document.getElementById('total-amount').textContent;
    
    // 如果存在订单号和支票金额元素，则设置其值
    if (document.getElementById('order-number')) {
        document.getElementById('order-number').textContent = orderNumber;
    }
    if (document.getElementById('check-amount')) {
        document.getElementById('check-amount').textContent = checkAmount;
    }
    
    // 初始化 - 确保第一个选项被选中
    paymentOptions[0].classList.add('selected');
    
    // 支付方式切换
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.getAttribute('data-payment-method');
            
            // 移除所有选项的选中状态
            paymentOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 添加当前选项的选中状态
            this.classList.add('selected');
            
            // 根据选择的支付方式显示相应的表单
            if (paymentMethod === 'credit-card') {
                creditCardOption.checked = true;
                creditCardForm.style.display = 'block';
                if (checkForm) checkForm.style.display = 'none';
            } else if (paymentMethod === 'check') {
                checkOption.checked = true;
                creditCardForm.style.display = 'none';
                if (checkForm) checkForm.style.display = 'block';
            }
        });
    });
    
    // 单选按钮切换事件
    if (creditCardOption) {
        creditCardOption.addEventListener('change', function() {
            if (this.checked) {
                paymentOptions[0].click();
            }
        });
    }
    
    if (checkOption) {
        checkOption.addEventListener('change', function() {
            if (this.checked) {
                paymentOptions[1].click();
            }
        });
    }
    
    // 信用卡号格式化
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // 完成支付按钮点击事件
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener('click', function() {
            let isValid = true;
            let activeForm;
            
            // 确定当前激活的表单
            if (creditCardOption && creditCardOption.checked) {
                activeForm = creditCardForm;
            } else if (checkOption && checkOption.checked) {
                activeForm = checkForm;
                
                // 检查支票确认复选框
                const checkConfirm = document.getElementById('check-confirm');
                if (checkConfirm && !checkConfirm.checked) {
                    alert('请确认您将按照说明邮寄支票');
                    isValid = false;
                }
            }
            
            // 验证必填字段
            if (activeForm === creditCardForm) {
                const requiredInputs = activeForm.querySelectorAll('[required]');
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.classList.add('error');
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    alert('请填写所有必填字段');
                    return;
                }
            }
            
            // 如果验证通过，显示成功信息或提交表单
            if (isValid) {
                if (creditCardOption && creditCardOption.checked) {
                    alert('支付成功！您的订单已处理。');
                    window.location.href = '/Volumes/work/cmcm-code-item/222/payment-success.html';
                } else {
                    alert('您的订单已创建。请按照说明邮寄支票以完成支付。');
                    window.location.href = '/Volumes/work/cmcm-code-item/222/check-instructions.html';
                }
            }
        });
    }
});