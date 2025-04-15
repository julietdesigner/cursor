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
        // 获取当前选中的套餐类型
        const selectedPackage = document.querySelector('.package-card.selected').dataset.type;
        
        // 更新基础套餐价格
        currentServiceFee = packagePrices[selectedPackage];
        
        // 更新Order Summary详情
        updateOrderSummary(selectedPackage);
        
        // 计算总费用
        const total = currentStateFee + currentServiceFee + 
            Object.values(currentAddonFees).reduce((sum, fee) => sum + fee, 0);
        
        // 更新所有显示总价的元素
        totalPrice.textContent = `$${total}`;
        if (orderSummaryTotal) {
            orderSummaryTotal.textContent = `$${total}`;
        }
    }

    // 更新Order Summary详情
    function updateOrderSummary(packageType) {
        // 更新基础套餐价格
        basePrice.textContent = `$${currentServiceFee}`;
        
        // 更新州费用
        stateFee.textContent = `$${currentStateFee}`;

        // 更新附加服务价格显示
        updateAddonPrices(packageType);
    }

    // 更新附加服务价格显示
    function updateAddonPrices(packageType) {
        const addons = ['expedited', 'templates', 'ein', 'bylaws'];
        const addonPrices = {
            expedited: 50,
            templates: 150,
            ein: 70,
            bylaws: 30
        };

        addons.forEach(addon => {
            const checkbox = document.getElementById(`${addon}-service-${packageType}`);
            const priceElement = document.getElementById(`${addon}-price`);
            
            if (checkbox && priceElement) {
                if (checkbox.disabled && checkbox.checked) {
                    priceElement.textContent = 'Included';
                    currentAddonFees[addon] = 0;
                } else if (checkbox.checked) {
                    priceElement.textContent = `$${addonPrices[addon]}`;
                    currentAddonFees[addon] = addonPrices[addon];
                } else {
                    priceElement.textContent = '$0';
                    currentAddonFees[addon] = 0;
                }
            }
        });
    }

    // 处理套餐选择
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            packageCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // 重置所有附加服务的状态
            resetAddonServices();
            
            // 初始化新选择的套餐的附加服务状态
            initializePackageAddons(this.dataset.type);
            
            // 更新总费用
            updateTotal();
        });
    });

    // 重置所有附加服务的状态
    function resetAddonServices() {
        document.querySelectorAll('.addon-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
        });
        
        Object.keys(currentAddonFees).forEach(key => {
            currentAddonFees[key] = 0;
        });
    }

    // 初始化套餐的附加服务状态
    function initializePackageAddons(packageType) {
        const addons = document.querySelectorAll(`.${packageType}-addons input[type="checkbox"]`);
        addons.forEach(addon => {
            if (packageType === 'premium') {
                addon.checked = true;
                addon.disabled = true;
            } else if (packageType === 'standard') {
                const serviceId = addon.id.split('-')[0];
                if (serviceId === 'ein' || serviceId === 'corporate') {
                    addon.checked = true;
                    addon.disabled = true;
                }
            }
        });
    }

    // 处理附加服务选择
    document.querySelectorAll('.addon-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (!this.disabled) {
                updateTotal();
            }
        });
    });

    // 处理地址选择
    addressOptions.forEach(option => {
        option.addEventListener('click', function() {
            addressOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            updateTotal();
        });
    });

    // 处理州选择
    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        const stateInfo = stateData[selectedState];
        
        if (stateInfo) {
            // 更新州费用
            currentStateFee = stateInfo.fee;
            stateFeeAmount.textContent = `$${stateInfo.fee}`;
            
            // 更新处理时间
            processingTimeSpan.textContent = stateInfo.processingTime;
            
            // 更新总费用显示
            updateTotal();
        }
    });

    // 设置默认选中的套餐（Basic）和州（Delaware）
    const defaultPackage = document.querySelector('.package-card[data-type="basic"]');
    if (defaultPackage) {
        defaultPackage.classList.add('selected');
        initializePackageAddons('basic');
        updateTotal();
    }

    // 设置默认选中的州（Delaware）
    stateSelect.value = 'delaware';
    const defaultStateInfo = stateData.delaware;
    processingTimeSpan.textContent = defaultStateInfo.processingTime;
    stateFeeAmount.textContent = `$${defaultStateInfo.fee}`;
}); 