// 添加州注册费用数据
const stateFilingFees = {
    'alabama': 236,
    'alaska': 250,
    'arizona': 85,
    'arkansas': 45,
    'california': 70,
    'colorado': 50,
    'connecticut': 120,
    'delaware': 90,
    'florida': 125,
    'georgia': 100,
    'hawaii': 50,
    'idaho': 100,
    'illinois': 150,
    'indiana': 95,
    'iowa': 50,
    'kansas': 160,
    'kentucky': 40,
    'louisiana': 100,
    'maine': 175,
    'maryland': 100,
    'massachusetts': 500,
    'michigan': 50,
    'minnesota': 135,
    'mississippi': 50,
    'missouri': 50,
    'montana': 70,
    'nebraska': 100,
    'nevada': 425,
    'new-hampshire': 100,
    'new-jersey': 125,
    'new-mexico': 50,
    'new-york': 200,
    'north-carolina': 125,
    'north-dakota': 135,
    'ohio': 99,
    'oklahoma': 100,
    'oregon': 100,
    'pennsylvania': 125,
    'rhode-island': 150,
    'south-carolina': 110,
    'south-dakota': 150,
    'tennessee': 300,
    'texas': 300,
    'utah': 70,
    'vermont': 125,
    'virginia': 100,
    'washington': 180,
    'west-virginia': 100,
    'wisconsin': 130,
    'wyoming': 100
};

// 添加州处理时间数据
const stateProcessingTimes = {
    'alabama': '3-5',
    'alaska': '3-5',
    'arizona': '2-3',
    'arkansas': '2-4',
    'california': '5-7',
    'colorado': '2-3',
    'connecticut': '3-5',
    'delaware': '1-2',
    'florida': '3-5',
    'georgia': '2-4',
    'hawaii': '3-5',
    'idaho': '2-3',
    'illinois': '10-15',
    'indiana': '3-5',
    'iowa': '2-4',
    'kansas': '2-3',
    'kentucky': '2-3',
    'louisiana': '3-5',
    'maine': '3-5',
    'maryland': '5-7',
    'massachusetts': '4-5',
    'michigan': '3-5',
    'minnesota': '4-6',
    'mississippi': '2-3',
    'missouri': '2-3',
    'montana': '3-5',
    'nebraska': '2-3',
    'nevada': '1-3',
    'new-hampshire': '3-5',
    'new-jersey': '3-4',
    'new-mexico': '2-3',
    'new-york': '5-7',
    'north-carolina': '5-7',
    'north-dakota': '3-5',
    'ohio': '2-3',
    'oklahoma': '1-2',
    'oregon': '3-5',
    'pennsylvania': '3-5',
    'rhode-island': '4-6',
    'south-carolina': '2-3',
    'south-dakota': '2-3',
    'tennessee': '2-3',
    'texas': '2-3',
    'utah': '2-3',
    'vermont': '3-5',
    'virginia': '4-6',
    'washington': '2-3',
    'west-virginia': '3-5',
    'wisconsin': '3-5',
    'wyoming': '2-3'
};

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有需要的元素
    const packageCards = document.querySelectorAll('.package-card');
    const additionalServices = document.querySelectorAll('.addon-option input[type="checkbox"]');
    const standardCard = document.querySelector('.package-card[data-type="standard"]');
    const calculateButtons = document.querySelectorAll('.calculate-btn');
    const businessTypeIcons = document.querySelectorAll('.business-type-icon');
    const detailCards = document.querySelectorAll('.detail-card');
    const ssnInput = document.getElementById('tax-ssn');
    const dbaForm = document.getElementById('dba-form');

    // 隐藏所有表单的辅助函数
    function hideAllForms() {
        const forms = document.querySelectorAll('.form-container, .llc-form');
        forms.forEach(form => {
            form.classList.add('hidden');
        });
    }

    // 处理计算器按钮点击事件
    function handleCalculateButtonClick() {
        console.log('Calculate button clicked'); // 调试日志
        
        // 获取当前选中的业务类型
        const activeDetailCard = document.querySelector('.detail-card.active');
        const businessType = activeDetailCard ? activeDetailCard.dataset.type : 'llc';
        
        console.log('Business type:', businessType); // 调试日志
        
        // 隐藏所有表单
        hideAllForms();
        
        // 显示对应的表单
        let formId;
        switch(businessType) {
            case 'llc':
                formId = 'llc-form';
                break;
            case 'corporation':
                formId = 'corporation-form';
                break;
            case 'nonprofit':
                formId = 'nonprofit-form';
                break;
            case 'dba':
                formId = 'dba-form';
                break;
            default:
                formId = 'llc-form';
        }
        
        console.log('Form ID:', formId); // 调试日志
        
        const targetForm = document.getElementById(formId);
        if (targetForm) {
            console.log('Found target form, showing it'); // 调试日志
            targetForm.classList.remove('hidden');
            // 滚动到表单位置
            targetForm.scrollIntoView({ behavior: 'smooth' });
            
            // 更新进度条状态
            if (typeof goToStep === 'function') {
                goToStep(3);
            }
        } else {
            console.error('Form not found:', formId);
        }
    }

    // 为计算器按钮添加点击事件
    calculateButtons.forEach(button => {
        // 移除现有的事件监听器
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        // 添加新的事件监听器
        newButton.addEventListener('click', handleCalculateButtonClick);
    });

    // 为业务类型图标添加点击事件
    businessTypeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // 更新图标激活状态
            businessTypeIcons.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 更新详情卡片显示
            detailCards.forEach(card => {
                if (card.dataset.type === type) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            // 更新按钮文案
            updateButtonText(type);
        });
    });

    // 更新按钮文案的函数
    function updateButtonText(businessType) {
        const buttons = document.querySelectorAll('.calculate-btn');
        let buttonText = 'Get Started';
        
        switch(businessType) {
            case 'llc':
                buttonText = 'Start an LLC';
                break;
            case 'corporation':
                buttonText = 'Start a Corporation';
                break;
            case 'nonprofit':
                buttonText = 'Start a Nonprofit';
                break;
            case 'dba':
                buttonText = 'Start a DBA';
                break;
        }
        
        buttons.forEach(button => {
            button.textContent = buttonText;
        });
    }

    // 初始化时设置默认按钮文案
    updateButtonText('llc');

    // 初始化默认选中的LLC卡片
    const defaultCard = document.querySelector('.detail-card[data-type="llc"]');
    if (defaultCard) {
        defaultCard.classList.add('active');
        const defaultIcon = document.querySelector('.business-type-icon[data-type="llc"]');
        if (defaultIcon) {
            defaultIcon.classList.add('active');
        }
    }

    // 修改更新总价格的函数
    function updateTotalPrice() {
        const selectedPackage = document.querySelector('.package-card.selected');
        if (!selectedPackage) return;
        
        const packagePrice = parseInt(selectedPackage.getAttribute('data-price'));
        const selectedState = document.getElementById('entity-type-select').value.toLowerCase();
        const stateFee = stateFilingFees[selectedState] || 0;
        
        // 计算附加服务总价
        let additionalServicesTotal = 0;
        document.querySelectorAll('.addon-option input[type="checkbox"]:checked:not(:disabled)').forEach(checkbox => {
            const priceText = checkbox.closest('.addon-option').querySelector('.addon-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            if (!isNaN(price)) {
                additionalServicesTotal += price;
            }
        });

        // 更新总价
        const total = packagePrice + stateFee + additionalServicesTotal;
        const totalPrice = document.getElementById('total-price');
        if (totalPrice) totalPrice.textContent = `$${total}`;
    }

    // 修改州选择事件监听器
    document.getElementById('entity-type-select').addEventListener('change', function() {
        const selectedState = this.value.toLowerCase();
        const stateFee = stateFilingFees[selectedState] || 0;
        const processingTime = stateProcessingTimes[selectedState] || '3-5';
        
        // 更新所有显示州费用的元素
        const stateFeeElements = document.querySelectorAll('.state-fee-amount, #state-fee');
        stateFeeElements.forEach(element => {
            element.textContent = `$${stateFee}`;
        });

        // 更新套餐卡片中的州费用显示
        document.querySelectorAll('.package-card .price p').forEach(element => {
            element.textContent = `+ $${stateFee} state fee`;
        });
        
        // 更新处理时间
        const processingTimeElement = document.getElementById('processing-time');
        if (processingTimeElement) {
            processingTimeElement.textContent = `${processingTime} business days`;
        }
        
        // 更新所有显示州名的元素
        const stateNameElements = document.querySelectorAll('.state-name');
        const stateName = this.options[this.selectedIndex].text;
        stateNameElements.forEach(element => {
            element.textContent = stateName;
        });
        
        // 更新总价
        updateTotalPrice();
    });

    // 添加更新额外服务选择状态的函数
    function updateAdditionalServices(packageType) {
        console.log('Updating services for package:', packageType); // 调试日志
        
        // 获取所有额外服务复选框
        const einService = document.getElementById('ein-service');
        const corporateBylaws = document.getElementById('corporate-bylaws');
        const expeditedFiling = document.getElementById('expedited-filing');
        const businessTemplates = document.getElementById('business-templates');
        
        // 重置所有复选框状态
        [einService, corporateBylaws, expeditedFiling, businessTemplates].forEach(checkbox => {
            if (checkbox) {
                checkbox.checked = false;
                checkbox.disabled = false;
                const addonOption = checkbox.closest('.addon-option');
                if (addonOption) {
                    addonOption.classList.remove('included');
                    addonOption.style.opacity = '1';
                }
            }
        });

        // 根据套餐类型设置默认选中的服务
        switch(packageType.toLowerCase()) {
            case 'premium':
                // Premium 套餐默认包含所有服务
                [einService, corporateBylaws, expeditedFiling, businessTemplates].forEach(checkbox => {
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.disabled = true;
                        const addonOption = checkbox.closest('.addon-option');
                        if (addonOption) {
                            addonOption.classList.add('included');
                            addonOption.style.opacity = '0.7';
                        }
                    }
                });
                break;
                
            case 'standard':
                // Standard 套餐默认包含 EIN 和 Corporate Bylaws
                if (einService) {
                    einService.checked = true;
                    einService.disabled = true;
                    const einOption = einService.closest('.addon-option');
                    if (einOption) {
                        einOption.classList.add('included');
                        einOption.style.opacity = '0.7';
                    }
                }
                if (corporateBylaws) {
                    corporateBylaws.checked = true;
                    corporateBylaws.disabled = true;
                    const bylawsOption = corporateBylaws.closest('.addon-option');
                    if (bylawsOption) {
                        bylawsOption.classList.add('included');
                        bylawsOption.style.opacity = '0.7';
                    }
                }
                break;
                
            case 'basic':
                // Basic 套餐不包含额外服务，保持未选中状态
                break;
        }
        
        // 更新总价
        updateTotalPrice();
    }

    // 修改套餐卡片点击事件
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', function() {
            // 移除所有套餐卡片的选中状态
            document.querySelectorAll('.package-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // 添加当前套餐卡片的选中状态
            this.classList.add('selected');
            
            // 更新基础价格显示
            const packagePrice = this.getAttribute('data-price');
            document.getElementById('base-price').textContent = `$${packagePrice}`;
            
            // 更新额外服务选择状态
            const packageType = this.getAttribute('data-type');
            updateAdditionalServices(packageType);
            
            // 更新总价
            updateTotalPrice();
        });
    });

    // 为额外服务复选框添加变更事件监听器
    document.querySelectorAll('.addon-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!this.disabled) {
                updateTotalPrice();
            }
        });
    });
}); 