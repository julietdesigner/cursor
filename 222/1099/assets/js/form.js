// 全局变量
let currentStep = 1;
const totalSteps = 5;

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 隐藏所有表单部分，只显示第一步
    showCurrentStep();
    updateProgressBar();
    
    // 选择税务年度
    const taxYearOptions = document.querySelectorAll('.tax-year-option');
    taxYearOptions.forEach(option => {
        option.addEventListener('click', function() {
            taxYearOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('payment-year').value = this.getAttribute('data-year');
        });
    });
    
    // 选择表格类型
    const formTypeOptions = document.querySelectorAll('.form-type-option');
    formTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            formTypeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // 根据表格类型显示/隐藏相关字段
            const formType = this.getAttribute('data-form-type');
            if (formType === '1099-NEC') {
                document.getElementById('nec-payment-section').style.display = 'block';
            } else {
                document.getElementById('nec-payment-section').style.display = 'none';
            }
        });
    });
    
    // 表单导航按钮
    const backButton = document.querySelector('.btn-back');
    const nextButton = document.querySelector('.btn-next');
    
    backButton.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showCurrentStep();
            updateProgressBar();
            updateNavigationButtons();
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                showCurrentStep();
                updateProgressBar();
                updateNavigationButtons();
            } else {
                // 最后一步，提交表单
                submitForm();
            }
        }
    });
    
    // 初始化按钮状态
    updateNavigationButtons();
    
    // 表单验证
    const form = document.getElementById('1099-application-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // 添加输入字段的实时验证
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // 添加金额输入格式化
    const amountInputs = document.querySelectorAll('#nec-payment-amount, #federal-tax-withheld');
    amountInputs.forEach(input => {
        input.addEventListener('blur', function() {
            formatCurrency(this);
        });
    });
    
    // 添加TIN输入格式化
    const tinInputs = document.querySelectorAll('#payer-tin, #recipient-tin');
    tinInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatTIN(this);
        });
    });
    
    // 添加工具提示交互
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        const infoIcon = tooltip.querySelector('.info-icon');
        const tooltipText = tooltip.querySelector('.tooltip-text');
        
        infoIcon.addEventListener('mouseenter', function() {
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
        });
        
        infoIcon.addEventListener('mouseleave', function() {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        });
    });
});

// 显示当前步骤
function showCurrentStep() {
    const sections = document.querySelectorAll('.form-section');
    const steps = document.querySelectorAll('.step');
    
    sections.forEach((section, index) => {
        if (index + 1 === currentStep) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// 更新进度条
function updateProgressBar() {
    const progressBar = document.querySelector('.progress');
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = progressPercentage + '%';
}

// 更新导航按钮
function updateNavigationButtons() {
    const backButton = document.querySelector('.btn-back');
    const nextButton = document.querySelector('.btn-next');
    
    if (currentStep === 1) {
        backButton.style.display = 'none';
    } else {
        backButton.style.display = 'inline-block';
    }
    
    if (currentStep === totalSteps) {
        nextButton.textContent = '提交申请';
    } else {
        nextButton.textContent = '下一步';
    }
}

// 验证当前步骤
function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-section:nth-child(${currentStep})`);
    const requiredFields = currentSection.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('请填写所有必填字段');
    }
    
    return isValid;
}

// 验证单个字段
function validateField(field) {
    if (!field.value.trim()) {
        field.classList.add('error');
        return false;
    } else {
        field.classList.remove('error');
        return true;
    }
}

// 格式化货币输入
function formatCurrency(input) {
    if (input.value) {
        const value = parseFloat(input.value.replace(/[^\d.-]/g, ''));
        if (!isNaN(value)) {
            input.value = value.toFixed(2);
        }
    }
}

// 格式化TIN输入
function formatTIN(input) {
    let value = input.value.replace(/\D/g, '');
    
    // 检测是SSN还是EIN
    if (value.length > 0) {
        if (input.id === 'payer-tin' && document.getElementById('payer-type').value === 'business' ||
            input.id === 'recipient-tin' && document.getElementById('recipient-type').value === 'business') {
            // EIN格式: XX-XXXXXXX
            if (value.length > 2) {
                value = value.substring(0, 2) + '-' + value.substring(2);
            }
        } else {
            // SSN格式: XXX-XX-XXXX
            if (value.length > 3) {
                value = value.substring(0, 3) + '-' + value.substring(3);
                if (value.length > 6) {
                    value = value.substring(0, 6) + '-' + value.substring(6);
                }
            }
        }
    }
    
    input.value = value;
}

// 提交表单
function submitForm() {
    if (validateCurrentStep()) {
        // 收集表单数据
        const formData = collectFormData();
        
        // 这里可以添加AJAX请求或其他提交逻辑
        console.log('表单数据:', formData);
        
        // 显示提交成功消息
        alert('表单已成功提交！');
        
        // 可以选择重置表单或重定向到其他页面
        // resetForm();
        // window.location.href = 'confirmation.html';
    }
}

// 收集表单数据
function collectFormData() {
    const form = document.getElementById('1099-application-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // 添加选中的税务年度
    const selectedTaxYear = document.querySelector('.tax-year-option.selected');
    if (selectedTaxYear) {
        data['tax-year'] = selectedTaxYear.getAttribute('data-year');
    }
    
    // 添加选中的表格类型
    const selectedFormType = document.querySelector('.form-type-option.selected');
    if (selectedFormType) {
        data['form-type'] = selectedFormType.getAttribute('data-form-type');
    }
    
    return data;
}

// 重置表单
function resetForm() {
    const form = document.getElementById('1099-application-form');
    form.reset();
    
    // 重置选择项
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 重置到第一步
    currentStep = 1;
    showCurrentStep();
    updateProgressBar();
    updateNavigationButtons();
}

// 添加邮政编码格式化
document.getElementById('payer-zip').addEventListener('input', function() {
    formatZipCode(this);
});

document.getElementById('recipient-zip').addEventListener('input', function() {
    formatZipCode(this);
});

// 格式化邮政编码
function formatZipCode(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 9);
    }
    
    input.value = value;
}