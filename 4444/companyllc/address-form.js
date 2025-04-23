document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const virtualAddressOption = document.getElementById('virtual-address-option');
    const ownAddressOption = document.getElementById('own-address-option');
    const companyAddressSection = document.getElementById('company-address-section');
    const updateBtn = document.getElementById('updateBtn');
    
    // 选项切换逻辑
    function selectOption(option) {
        // 移除所有选中状态
        virtualAddressOption.classList.remove('selected');
        ownAddressOption.classList.remove('selected');
        
        // 添加选中状态
        option.classList.add('selected');
        
        // 如果选择使用自己的地址，显示公司地址表单
        if (option.id === 'own-address-option') {
            companyAddressSection.style.display = 'block';
        } else {
            companyAddressSection.style.display = 'none';
        }
    }
    
    // 绑定点击事件
    virtualAddressOption.addEventListener('click', function() {
        selectOption(virtualAddressOption);
    });
    
    ownAddressOption.addEventListener('click', function() {
        selectOption(ownAddressOption);
    });
    
    // 更新按钮逻辑
    updateBtn.addEventListener('click', function() {
        // 获取选中的选项
        const useVirtualAddress = virtualAddressOption.classList.contains('selected');
        
        // 准备数据对象
        const addressData = {
            useVirtualAddress: useVirtualAddress,
        };
        
        // 如果使用自己的地址，收集公司地址表单数据
        if (!useVirtualAddress) {
            addressData.companyAddress = {
                street: document.getElementById('company-street').value,
                street2: document.getElementById('company-street2').value,
                city: document.getElementById('company-city').value,
                state: document.getElementById('company-state').value,
                zip: document.getElementById('company-zip').value
            };
        } else {
            // 如果使用虚拟地址，提供虚拟地址数据
            addressData.virtualAddress = {
                street: '54 STATE STREET',
                suite: 'STE 804',
                city: 'ALBANY',
                state: 'NY',
                zip: '12207'
            };
        }
        
        // 收集联系地址数据
        addressData.contactAddress = {
            country: document.getElementById('contact-country').value,
            street: document.getElementById('contact-street').value,
            street2: document.getElementById('contact-street2').value,
            city: document.getElementById('contact-city').value,
            state: document.getElementById('contact-state').value,
            zip: document.getElementById('contact-zip').value
        };
        
        // 保存数据到sessionStorage
        sessionStorage.setItem('addressData', JSON.stringify(addressData));
        
        // 返回到订单摘要页面
        window.location.href = 'order-summary.html';
    });
}); 