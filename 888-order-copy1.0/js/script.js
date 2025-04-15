// 定义州费用和处理时间的映射
const stateData = {
    alabama: {
        fee: 250,
        processingTime: "3-5个工作日"
    },
    alaska: {
        fee: 250,
        processingTime: "10-15个工作日"
    },
    arizona: {
        fee: 150,
        processingTime: "5-7个工作日"
    },
    arkansas: {
        fee: 150,
        processingTime: "3-5个工作日"
    },
    california: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    colorado: {
        fee: 50,
        processingTime: "3-5个工作日"
    },
    connecticut: {
        fee: 120,
        processingTime: "5-7个工作日"
    },
    delaware: {
        fee: 90,
        processingTime: "1-2个工作日"
    },
    florida: {
        fee: 125,
        processingTime: "7-10个工作日"
    },
    georgia: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    hawaii: {
        fee: 50,
        processingTime: "5-7个工作日"
    },
    idaho: {
        fee: 100,
        processingTime: "7-10个工作日"
    },
    illinois: {
        fee: 150,
        processingTime: "10-15个工作日"
    },
    indiana: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    iowa: {
        fee: 50,
        processingTime: "5-7个工作日"
    },
    kansas: {
        fee: 165,
        processingTime: "3-5个工作日"
    },
    kentucky: {
        fee: 40,
        processingTime: "3-5个工作日"
    },
    louisiana: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    maine: {
        fee: 175,
        processingTime: "5-7个工作日"
    },
    maryland: {
        fee: 100,
        processingTime: "7-10个工作日"
    },
    massachusetts: {
        fee: 500,
        processingTime: "5-7个工作日"
    },
    michigan: {
        fee: 50,
        processingTime: "3-5个工作日"
    },
    minnesota: {
        fee: 155,
        processingTime: "5-7个工作日"
    },
    mississippi: {
        fee: 50,
        processingTime: "3-5个工作日"
    },
    missouri: {
        fee: 50,
        processingTime: "5-7个工作日"
    },
    montana: {
        fee: 70,
        processingTime: "7-10个工作日"
    },
    nebraska: {
        fee: 100,
        processingTime: "3-5个工作日"
    },
    nevada: {
        fee: 75,
        processingTime: "1-3个工作日"
    },
    newHampshire: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    newJersey: {
        fee: 125,
        processingTime: "7-10个工作日"
    },
    newMexico: {
        fee: 50,
        processingTime: "5-7个工作日"
    },
    newYork: {
        fee: 200,
        processingTime: "7-10个工作日"
    },
    northCarolina: {
        fee: 125,
        processingTime: "5-7个工作日"
    },
    northDakota: {
        fee: 135,
        processingTime: "3-5个工作日"
    },
    ohio: {
        fee: 99,
        processingTime: "3-5个工作日"
    },
    oklahoma: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    oregon: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    pennsylvania: {
        fee: 125,
        processingTime: "7-10个工作日"
    },
    rhodeIsland: {
        fee: 150,
        processingTime: "5-7个工作日"
    },
    southCarolina: {
        fee: 110,
        processingTime: "3-5个工作日"
    },
    southDakota: {
        fee: 150,
        processingTime: "5-7个工作日"
    },
    tennessee: {
        fee: 300,
        processingTime: "5-7个工作日"
    },
    texas: {
        fee: 300,
        processingTime: "3-5个工作日"
    },
    utah: {
        fee: 70,
        processingTime: "5-7个工作日"
    },
    vermont: {
        fee: 125,
        processingTime: "7-10个工作日"
    },
    virginia: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    washington: {
        fee: 180,
        processingTime: "3-5个工作日"
    },
    westVirginia: {
        fee: 100,
        processingTime: "5-7个工作日"
    },
    wisconsin: {
        fee: 130,
        processingTime: "5-7个工作日"
    },
    wyoming: {
        fee: 100,
        processingTime: "3-5个工作日"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有必要的DOM元素
    const stateSelect = document.getElementById('state');
    const processingTimeSpan = document.getElementById('processing-time');
    const stateFeeAmount = document.querySelector('.state-fee-amount');
    const packageCards = document.querySelectorAll('.package-card');
    const addressOptions = document.querySelectorAll('.address-option');
    const basePrice = document.getElementById('base-price');
    const stateFee = document.getElementById('state-fee');
    const expeditedPrice = document.getElementById('expedited-price');
    const templatesPrice = document.getElementById('templates-price');
    const einPrice = document.getElementById('ein-price');
    const corporateBylawsPrice = document.getElementById('corporate-bylaws-price');
    const totalPrice = document.getElementById('total-price');
    const orderSummaryTotal = document.getElementById('order-summary-total');

    // 检查必要的元素是否存在
    if (!stateSelect || !processingTimeSpan || !stateFeeAmount) {
        console.log('Some required elements are missing');
        return;
    }

    // 初始化费用
    let currentStateFee = stateData.delaware.fee; // 默认使用特拉华州的费用
    let currentServiceFee = 199; // 基础套餐价格
    let currentAddonFees = {
        expedited: 0,
        templates: 0,
        ein: 0,
        bylaws: 0
    };

    // 定义套餐基础价格
    const packagePrices = {
        basic: 199,
        standard: 299,
        premium: 399
    };

    // 更新总费用显示
    function updateTotal() {
        if (!totalPrice) return;
        
        // 获取当前选中的套餐类型
        const selectedPackageCard = document.querySelector('.package-card.selected');
        if (!selectedPackageCard) return;
        
        const selectedPackage = selectedPackageCard.dataset.type;
        
        // 更新基础套餐价格
        currentServiceFee = packagePrices[selectedPackage];
        
        // 更新Order Summary详情
        updateOrderSummary(selectedPackage);
        
        // 计算总费用
        const total = currentStateFee + currentServiceFee + 
            currentAddonFees.expedited + 
            currentAddonFees.templates + 
            currentAddonFees.ein + 
            currentAddonFees.bylaws;
        
        // 更新显示
        totalPrice.textContent = `$${total}`;
        if (orderSummaryTotal) {
            orderSummaryTotal.textContent = `$${total}`;
        }
    }

    // 更新Order Summary
    function updateOrderSummary(packageType) {
        if (!basePrice || !stateFee) return;
        
        basePrice.textContent = `$${packagePrices[packageType]}`;
        stateFee.textContent = `$${currentStateFee}`;
        
        if (expeditedPrice) expeditedPrice.textContent = `$${currentAddonFees.expedited}`;
        if (templatesPrice) templatesPrice.textContent = `$${currentAddonFees.templates}`;
        if (einPrice) einPrice.textContent = `$${currentAddonFees.ein}`;
        if (corporateBylawsPrice) corporateBylawsPrice.textContent = `$${currentAddonFees.bylaws}`;
    }

    // 为州选择添加事件监听
    if (stateSelect) {
        stateSelect.addEventListener('change', function() {
            const selectedState = this.value;
            const stateInfo = stateData[selectedState];
            
            if (stateInfo) {
                currentStateFee = stateInfo.fee;
                if (processingTimeSpan) {
                    processingTimeSpan.textContent = stateInfo.processingTime;
                }
                if (stateFeeAmount) {
                    stateFeeAmount.textContent = `$${stateInfo.fee}`;
                }
                updateTotal();
            }
        });
    }

    // 为套餐卡片添加事件监听
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            packageCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            updateTotal();
        });
    });

    // 为地址选项添加事件监听
    addressOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                updateTotal();
            });
        }
    });

    // 初始化显示
    updateTotal();

    // 获取所有业务类型图标
    const businessTypeIcons = document.querySelectorAll('.business-type-icon');
    
    businessTypeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // 移除所有图标的active类
            businessTypeIcons.forEach(i => i.classList.remove('active'));
            
            // 为当前点击的图标添加active类
            this.classList.add('active');
            
            // 隐藏所有表单
            const allForms = document.querySelectorAll('.form-container');
            allForms.forEach(form => form.classList.add('hidden'));
            
            // 获取对应的表单ID
            const formId = this.getAttribute('data-form');
            const targetForm = document.getElementById(formId);
            
            if (targetForm) {
                targetForm.classList.remove('hidden');
                // 滚动到表单位置
                targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            console.log('Selected business type:', formId);
        });
    });

    // 初始化第一个表单为可见（如果存在）
    const firstIcon = businessTypeIcons[0];
    if (firstIcon) {
        firstIcon.click();
    }

    // Nonprofit Form Handling
    initializeNonprofitForm();
});

// Nonprofit Form Handling
function initializeNonprofitForm() {
    // Form elements
    const form = document.getElementById('nonprofit-form');
    const activityType = document.getElementById('nonprofit-activity-type');
    const conflictPolicy = document.getElementById('nonprofit-conflict-policy');
    const customPolicy = document.getElementById('custom-policy');
    const duration = document.getElementById('nonprofit-duration');
    const fixedDuration = document.getElementById('fixed-duration');
    const addDirectorBtn = document.getElementById('add-director');
    const directorsContainer = document.getElementById('directors-container');

    // Activity Type Change Handler
    if (activityType) {
        activityType.addEventListener('change', function() {
            const otherInput = document.getElementById('other-activity-type');
            if (this.value === 'other') {
                if (!otherInput) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = 'other-activity-type';
                    input.placeholder = 'Specify other activity type';
                    input.required = true;
                    this.parentNode.appendChild(input);
                }
            } else if (otherInput) {
                otherInput.remove();
            }
        });
    }

    // Conflict Policy Change Handler
    if (conflictPolicy) {
        conflictPolicy.addEventListener('change', function() {
            if (customPolicy) {
                customPolicy.classList.toggle('hidden', this.value !== 'custom');
            }
        });
    }

    // Duration Type Change Handler
    if (duration) {
        duration.addEventListener('change', function() {
            if (fixedDuration) {
                fixedDuration.classList.toggle('hidden', this.value !== 'fixed');
            }
        });
    }

    // Add Director Handler
    if (addDirectorBtn && directorsContainer) {
        addDirectorBtn.addEventListener('click', function() {
            const directorCount = directorsContainer.children.length + 1;
            const directorTemplate = `
                <div class="director-form">
                    <h4>Director ${directorCount}</h4>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="director-name" placeholder="Enter director's name" required />
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" class="director-address" placeholder="Enter director's address" required />
                    </div>
                    <div class="form-group">
                        <label>Position</label>
                        <input type="text" class="director-position" placeholder="Enter director's position" required />
                    </div>
                    <button type="button" class="remove-director">Remove Director</button>
                </div>
            `;
            directorsContainer.insertAdjacentHTML('beforeend', directorTemplate);
        });
    }

    // Remove Director Handler
    if (directorsContainer) {
        directorsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-director')) {
                e.target.closest('.director-form').remove();
                // Update director numbers
                const directors = directorsContainer.querySelectorAll('.director-form h4');
                directors.forEach((header, index) => {
                    header.textContent = `Director ${index + 1}`;
                });
            }
        });
    }

    // Form Validation
    function validateNonprofitForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // Form Submission Handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateNonprofitForm()) {
                // Collect form data
                const formData = {
                    name: document.getElementById('nonprofit-name').value,
                    state: document.getElementById('nonprofit-state').value,
                    purpose: document.getElementById('nonprofit-purpose').value,
                    activityType: activityType.value,
                    directors: Array.from(directorsContainer.querySelectorAll('.director-form')).map(director => ({
                        name: director.querySelector('.director-name').value,
                        address: director.querySelector('.director-address').value,
                        position: director.querySelector('.director-position').value
                    })),
                    beneficiaries: document.getElementById('nonprofit-beneficiaries').value,
                    geographicScope: document.getElementById('nonprofit-geographic-scope').value,
                    conflictPolicy: conflictPolicy.value,
                    duration: duration.value
                };

                // Process form submission
                console.log('Nonprofit form data:', formData);
                // Add API call or further processing here
            }
        });
    }
} 