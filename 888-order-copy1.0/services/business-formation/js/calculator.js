// 状态数据
const stateData = {
    'CA': { processingTime: '5-7个工作日', filingFee: 70 },
    'NY': { processingTime: '7-10个工作日', filingFee: 200 },
    'DE': { processingTime: '3-5个工作日', filingFee: 90 },
    'FL': { processingTime: '4-6个工作日', filingFee: 125 },
    'TX': { processingTime: '5-7个工作日', filingFee: 300 }
};

// 套餐数据
const packages = {
    basic: {
        name: '基础套餐',
        price: 99,
        features: [
            '基本文件准备',
            '名称可用性检查',
            '在线文件提交'
        ]
    },
    standard: {
        name: '标准套餐',
        price: 199,
        features: [
            '所有基础套餐功能',
            '运营协议',
            '雇主识别号(EIN)',
            '合规文件包'
        ]
    },
    premium: {
        name: '高级套餐',
        price: 299,
        features: [
            '所有标准套餐功能',
            '加急处理',
            '注册代理服务(1年)',
            '合规警报'
        ]
    }
};

// 附加服务数据
const additionalServices = {
    registeredAgent: {
        name: '注册代理服务',
        price: 99,
        description: '专业注册代理服务(每年)'
    },
    einFiling: {
        name: 'EIN申请',
        price: 79,
        description: '联邦雇主识别号申请'
    },
    compliancePackage: {
        name: '合规文件包',
        price: 89,
        description: '包含所有必要的合规文件'
    }
};

class Calculator {
    constructor() {
        this.selectedState = '';
        this.selectedPackage = null;
        this.selectedServices = new Set();
        this.initializeListeners();
    }

    initializeListeners() {
        // 州选择监听器
        const stateSelect = document.getElementById('state-select');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => this.handleStateChange(e.target.value));
        }

        // 套餐选择监听器
        const packageOptions = document.querySelectorAll('.package-option');
        packageOptions.forEach(option => {
            option.addEventListener('click', () => this.handlePackageSelect(option.dataset.package));
        });

        // 附加服务监听器
        const serviceCheckboxes = document.querySelectorAll('.service-checkbox input');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleServiceToggle(e.target.value));
        });

        // 提交按钮监听器
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.handleSubmit());
        }
    }

    handleStateChange(state) {
        this.selectedState = state;
        this.updateStateInfo();
        this.calculateTotal();
    }

    handlePackageSelect(packageId) {
        this.selectedPackage = packageId;
        // 更新UI
        document.querySelectorAll('.package-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.package === packageId) {
                option.classList.add('selected');
            }
        });
        this.calculateTotal();
    }

    handleServiceToggle(serviceId) {
        if (this.selectedServices.has(serviceId)) {
            this.selectedServices.delete(serviceId);
        } else {
            this.selectedServices.add(serviceId);
        }
        this.calculateTotal();
    }

    updateStateInfo() {
        const stateInfo = document.querySelector('.state-info');
        if (this.selectedState && stateData[this.selectedState]) {
            const data = stateData[this.selectedState];
            stateInfo.innerHTML = `
                <p>处理时间: ${data.processingTime}</p>
                <p>州政府申请费: $${data.filingFee}</p>
            `;
        }
    }

    calculateTotal() {
        let total = 0;

        // 添加套餐价格
        if (this.selectedPackage && packages[this.selectedPackage]) {
            total += packages[this.selectedPackage].price;
        }

        // 添加州申请费
        if (this.selectedState && stateData[this.selectedState]) {
            total += stateData[this.selectedState].filingFee;
        }

        // 添加附加服务费用
        this.selectedServices.forEach(serviceId => {
            if (additionalServices[serviceId]) {
                total += additionalServices[serviceId].price;
            }
        });

        // 更新总价显示
        const totalElement = document.querySelector('.total-price');
        if (totalElement) {
            totalElement.textContent = `总价: $${total}`;
        }

        // 更新提交按钮状态
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.disabled = !this.selectedPackage;
        }
    }

    handleSubmit() {
        if (!this.selectedPackage) {
            alert('请选择一个套餐以继续');
            return;
        }

        const formData = {
            state: this.selectedState,
            package: this.selectedPackage,
            additionalServices: Array.from(this.selectedServices),
            total: document.querySelector('.total-price').textContent.replace('总价: $', '')
        };

        // 这里可以添加表单提交逻辑
        console.log('提交订单:', formData);
    }
}

// 页面加载时初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
}); 