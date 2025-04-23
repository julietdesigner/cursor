document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const numberOfMembersSelect = document.getElementById('numberOfMembers');
    const individualOption = document.getElementById('individual-option-1');
    const companyOption = document.getElementById('company-option-1');
    const useCompanyAddressCheckbox = document.getElementById('useCompanyAddress1');
    const memberAddressSection = document.getElementById('memberAddressSection1');
    const saveMemberBtn = document.getElementById('saveMemberBtn1');
    const updateBtn = document.getElementById('updateBtn');
    const articlesInfoHeader = document.getElementById('articlesInfoHeader');
    const articlesInfoContent = document.getElementById('articlesInfoContent');
    
    // 设置成员类型选项切换逻辑
    function selectMemberType(option) {
        // 移除所有选中状态
        individualOption.classList.remove('selected');
        companyOption.classList.remove('selected');
        
        // 添加选中状态
        option.classList.add('selected');
        
        // 选择个人，显示个人表单字段
        if (option.id === 'individual-option-1') {
            // 可以在这里添加逻辑来显示/隐藏特定的个人字段
        } else {
            // 可以在这里添加逻辑来显示/隐藏特定的公司字段
        }
    }
    
    // 绑定成员类型选项点击事件
    individualOption.addEventListener('click', function() {
        selectMemberType(individualOption);
    });
    
    companyOption.addEventListener('click', function() {
        selectMemberType(companyOption);
    });
    
    // 使用公司地址复选框逻辑
    useCompanyAddressCheckbox.addEventListener('change', function() {
        if (this.checked) {
            memberAddressSection.style.display = 'none';
        } else {
            memberAddressSection.style.display = 'block';
        }
    });
    
    // 保存成员按钮逻辑
    saveMemberBtn.addEventListener('click', function() {
        const firstName = document.getElementById('firstName1').value.trim();
        const lastName = document.getElementById('lastName1').value.trim();
        
        // 更新成员名称显示
        if (firstName || lastName) {
            document.getElementById('memberName1').textContent = firstName + ' ' + lastName;
        }
        
        // 这里可以添加表单验证逻辑
        
        // 显示保存成功的提示信息
        alert('Member information saved!');
    });
    
    // 手风琴折叠面板逻辑
    articlesInfoHeader.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (articlesInfoContent.style.display === 'block') {
            articlesInfoContent.style.display = 'none';
        } else {
            articlesInfoContent.style.display = 'block';
        }
    });
    
    // 更新按钮逻辑
    updateBtn.addEventListener('click', function() {
        // 收集所有成员的数据
        const membersData = [];
        
        // 收集第一个成员的数据
        const memberType = individualOption.classList.contains('selected') ? 'individual' : 'company';
        const useCompanyAddress = useCompanyAddressCheckbox.checked;
        
        const member1 = {
            type: memberType,
            firstName: document.getElementById('firstName1').value,
            lastName: document.getElementById('lastName1').value,
            useCompanyAddress: useCompanyAddress
        };
        
        // 如果不使用公司地址，收集地址信息
        if (!useCompanyAddress && memberAddressSection.style.display !== 'none') {
            member1.address = {
                street: document.getElementById('memberStreet1').value,
                street2: document.getElementById('memberStreet21').value,
                city: document.getElementById('memberCity1').value,
                state: document.getElementById('memberState1').value,
                zip: document.getElementById('memberZip1').value
            };
        }
        
        membersData.push(member1);
        
        // 如果有多个成员，这里可以添加逻辑来收集其他成员的数据
        
        // 保存数据到sessionStorage
        sessionStorage.setItem('membersData', JSON.stringify(membersData));
        
        // 返回到订单摘要页面
        window.location.href = 'order-summary.html';
    });
    
    // 初始化页面
    // 如果sessionStorage中有成员数据，加载它
    const storedMembersData = sessionStorage.getItem('membersData');
    if (storedMembersData) {
        const membersData = JSON.parse(storedMembersData);
        
        if (membersData.length > 0) {
            const member1 = membersData[0];
            
            // 设置成员类型
            if (member1.type === 'individual') {
                selectMemberType(individualOption);
            } else {
                selectMemberType(companyOption);
            }
            
            // 设置姓名
            document.getElementById('firstName1').value = member1.firstName || '';
            document.getElementById('lastName1').value = member1.lastName || '';
            document.getElementById('memberName1').textContent = 
                (member1.firstName || '') + ' ' + (member1.lastName || '');
            
            // 设置使用公司地址选项
            useCompanyAddressCheckbox.checked = member1.useCompanyAddress;
            memberAddressSection.style.display = member1.useCompanyAddress ? 'none' : 'block';
            
            // 如果有地址数据且不使用公司地址，填充地址表单
            if (member1.address && !member1.useCompanyAddress) {
                document.getElementById('memberStreet1').value = member1.address.street || '';
                document.getElementById('memberStreet21').value = member1.address.street2 || '';
                document.getElementById('memberCity1').value = member1.address.city || '';
                document.getElementById('memberState1').value = member1.address.state || '';
                document.getElementById('memberZip1').value = member1.address.zip || '';
            }
        }
    }
}); 