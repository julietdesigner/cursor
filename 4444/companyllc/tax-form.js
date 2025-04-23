document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const foreignYesOption = document.getElementById('foreign-yes-option');
    const foreignNoOption = document.getElementById('foreign-no-option');
    const ssnOption = document.getElementById('ssn-option');
    const itinOption = document.getElementById('itin-option');
    const ssnSection = document.getElementById('ssn-section');
    const itinSection = document.getElementById('itin-section');
    const identificationSection = document.getElementById('identification-section');
    const ssnInfoHeader = document.getElementById('ssnInfoHeader');
    const ssnInfoContent = document.getElementById('ssnInfoContent');
    const useCustomAddressCheck = document.getElementById('useCustomAddressCheck');
    const useCompanyAddressCheck = document.getElementById('useCompanyAddressCheck');
    const physicalAddressSection = document.getElementById('physicalAddressSection');
    const addressSuccessMsg = document.getElementById('addressSuccessMsg');
    const updateBtn = document.getElementById('updateBtn');

    // 外国人选项切换逻辑
    function selectForeignOption(option) {
        // 移除所有选中状态
        foreignYesOption.classList.remove('selected');
        foreignNoOption.classList.remove('selected');
        
        // 添加选中状态
        option.classList.add('selected');
        
        // 如果选择是外国人，隐藏SSN/ITIN部分，否则显示
        if (option.id === 'foreign-yes-option') {
            identificationSection.style.display = 'none';
        } else {
            identificationSection.style.display = 'block';
        }
    }
    
    // 绑定外国人选项点击事件
    foreignYesOption.addEventListener('click', function() {
        selectForeignOption(foreignYesOption);
    });
    
    foreignNoOption.addEventListener('click', function() {
        selectForeignOption(foreignNoOption);
    });
    
    // 身份识别选项切换逻辑
    function selectIdOption(option) {
        // 移除所有选中状态
        ssnOption.classList.remove('selected');
        itinOption.classList.remove('selected');
        
        // 添加选中状态
        option.classList.add('selected');
        
        // 切换显示SSN或ITIN输入框
        if (option.id === 'ssn-option') {
            ssnSection.style.display = 'block';
            itinSection.style.display = 'none';
        } else {
            ssnSection.style.display = 'none';
            itinSection.style.display = 'block';
        }
    }
    
    // 绑定身份识别选项点击事件
    ssnOption.addEventListener('click', function() {
        selectIdOption(ssnOption);
    });
    
    itinOption.addEventListener('click', function() {
        selectIdOption(itinOption);
    });
    
    // SSN输入框格式化
    const ssnInput = document.getElementById('ssnInput');
    ssnInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) {
            value = value.slice(0, 9);
        }
        
        // 格式化为 XXX-XX-XXXX
        if (value.length > 5) {
            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
        } else if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        e.target.value = value;
    });
    
    // ITIN输入框格式化
    const itinInput = document.getElementById('itinInput');
    if (itinInput) {
        itinInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) {
                value = value.slice(0, 9);
            }
            
            // 格式化为 XXX-XX-XXXX
            if (value.length > 5) {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            
            e.target.value = value;
        });
    }
    
    // 手风琴折叠面板逻辑
    ssnInfoHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (ssnInfoContent.style.display === 'block') {
            ssnInfoContent.style.display = 'none';
        } else {
            ssnInfoContent.style.display = 'block';
        }
    });
    
    // 地址选项切换逻辑
    useCustomAddressCheck.addEventListener('change', function() {
        if (this.checked) {
            useCompanyAddressCheck.checked = false;
            physicalAddressSection.style.display = 'block';
            addressSuccessMsg.style.display = 'none';
        } else if (!useCompanyAddressCheck.checked) {
            // 如果两个都没选，默认选择使用公司地址
            useCompanyAddressCheck.checked = true;
            physicalAddressSection.style.display = 'none';
            addressSuccessMsg.style.display = 'flex';
        }
    });
    
    useCompanyAddressCheck.addEventListener('change', function() {
        if (this.checked) {
            useCustomAddressCheck.checked = false;
            physicalAddressSection.style.display = 'none';
            addressSuccessMsg.style.display = 'flex';
        } else if (!useCustomAddressCheck.checked) {
            // 如果两个都没选，默认选择自定义地址
            useCustomAddressCheck.checked = true;
            physicalAddressSection.style.display = 'block';
            addressSuccessMsg.style.display = 'none';
        }
    });
    
    // 更新按钮逻辑
    updateBtn.addEventListener('click', function() {
        // 收集数据
        const isForeign = foreignYesOption.classList.contains('selected');
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        
        // 准备数据对象
        const taxData = {
            isForeign: isForeign,
            firstName: firstName,
            lastName: lastName
        };
        
        // 如果不是外国人，收集身份识别数据
        if (!isForeign) {
            const useSSN = ssnOption.classList.contains('selected');
            
            if (useSSN) {
                taxData.idType = 'SSN';
                taxData.ssn = document.getElementById('ssnInput').value;
            } else {
                taxData.idType = 'ITIN';
                taxData.itin = document.getElementById('itinInput').value;
            }
        }
        
        // 收集地址数据
        const useCompanyAddress = useCompanyAddressCheck.checked;
        taxData.useCompanyAddress = useCompanyAddress;
        
        if (!useCompanyAddress) {
            taxData.address = {
                country: document.getElementById('country').value,
                street: document.getElementById('street').value,
                street2: document.getElementById('street2').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            };
        }
        
        // 保存数据到sessionStorage
        sessionStorage.setItem('taxData', JSON.stringify(taxData));
        
        // 返回到订单摘要页面
        window.location.href = 'order-summary.html';
    });
    
    // 初始化页面
    // 如果sessionStorage中有税务数据，加载它
    const storedTaxData = sessionStorage.getItem('taxData');
    if (storedTaxData) {
        const taxData = JSON.parse(storedTaxData);
        
        // 设置外国人选项
        if (taxData.isForeign) {
            selectForeignOption(foreignYesOption);
        } else {
            selectForeignOption(foreignNoOption);
            
            // 设置身份识别选项
            if (taxData.idType === 'SSN') {
                selectIdOption(ssnOption);
                document.getElementById('ssnInput').value = taxData.ssn || '';
            } else if (taxData.idType === 'ITIN') {
                selectIdOption(itinOption);
                document.getElementById('itinInput').value = taxData.itin || '';
            }
        }
        
        // 设置名字
        document.getElementById('firstName').value = taxData.firstName || '';
        document.getElementById('lastName').value = taxData.lastName || '';
        document.getElementById('applicantName').textContent = 
            (taxData.firstName || '') + ' ' + (taxData.lastName || '');
        
        // 设置地址选项
        useCompanyAddressCheck.checked = taxData.useCompanyAddress;
        useCustomAddressCheck.checked = !taxData.useCompanyAddress;
        
        if (taxData.useCompanyAddress) {
            physicalAddressSection.style.display = 'none';
            addressSuccessMsg.style.display = 'flex';
        } else {
            physicalAddressSection.style.display = 'block';
            addressSuccessMsg.style.display = 'none';
            
            // 如果有地址数据，填充地址表单
            if (taxData.address) {
                document.getElementById('country').value = taxData.address.country || 'CN';
                document.getElementById('street').value = taxData.address.street || '';
                document.getElementById('street2').value = taxData.address.street2 || '';
                document.getElementById('city').value = taxData.address.city || '';
                document.getElementById('state').value = taxData.address.state || '';
                document.getElementById('zip').value = taxData.address.zip || '';
                
                // 更新自定义地址显示文本
                document.getElementById('customAddressText').textContent = 
                    taxData.address.street + ', ' + 
                    taxData.address.city + ', ' + 
                    taxData.address.state + ' ' + 
                    taxData.address.zip + ', ' +
                    (taxData.address.country === 'CN' ? 'CN.' : taxData.address.country + '.');
            }
        }
    }
}); 