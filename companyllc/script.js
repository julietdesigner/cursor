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
        
        // 直接使用LLC表单，不再检查业务类型
        const formId = 'llc-form';
        
        console.log('Form ID:', formId); // 调试日志
        
        // 隐藏所有表单
        hideAllForms();
        
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
        // 不再检查业务类型，始终使用LLC
        const buttonText = 'Pay $505.00';
        
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
        
        // 更新基础套餐价格显示
        const basePrice = document.getElementById('base-price');
        if (basePrice) {
            basePrice.textContent = `$${packagePrice}`;
        }
        
        // 更新州费用显示
        const stateFeeElement = document.getElementById('state-fee');
        if (stateFeeElement) {
            stateFeeElement.textContent = `$${stateFee}`;
        }

        // 获取额外服务的价格容器
        const breakdownContainer = document.querySelector('.total-breakdown');
        if (!breakdownContainer) return;

        // 创建一个映射来存储所有服务的状态
        const serviceStatus = {
            'Expedited Filing': { price: 50, included: false },
            'Business Contract Templates': { price: 150, included: false },
            'EIN Business Tax Number': { price: 70, included: false },
            'Corporate Bylaws': { price: 30, included: false }
        };

        // 获取选中的套餐类型
        const packageType = selectedPackage.getAttribute('data-type');

        // 计算并显示额外服务费用
        document.querySelectorAll('.addon-option').forEach(addonOption => {
            const checkbox = addonOption.querySelector('input[type="checkbox"]');
            const nameElement = addonOption.querySelector('.addon-name');
            
            if (checkbox && nameElement) {
                const serviceName = nameElement.textContent;
                const service = serviceStatus[serviceName];
                
                if (service) {
                    if (checkbox.checked) {
                        service.included = checkbox.disabled;
                    } else {
                        service.price = 0;
                    }
                }
            }
        });

        // 更新 Order Summary 中的服务费用显示
        const expeditedPrice = document.getElementById('expedited-price');
        const templatesPrice = document.getElementById('templates-price');
        const einPrice = document.getElementById('ein-price');
        const bylawsPrice = document.getElementById('corporate-bylaws-price');

        if (expeditedPrice) {
            expeditedPrice.textContent = serviceStatus['Expedited Filing'].price > 0 ? 
                (serviceStatus['Expedited Filing'].included ? `$${serviceStatus['Expedited Filing'].price} (Included)` : `$${serviceStatus['Expedited Filing'].price}`) : 
                '$0';
        }

        if (templatesPrice) {
            templatesPrice.textContent = serviceStatus['Business Contract Templates'].price > 0 ? 
                (serviceStatus['Business Contract Templates'].included ? `$${serviceStatus['Business Contract Templates'].price} (Included)` : `$${serviceStatus['Business Contract Templates'].price}`) : 
                '$0';
        }

        if (einPrice) {
            einPrice.textContent = serviceStatus['EIN Business Tax Number'].price > 0 ? 
                (serviceStatus['EIN Business Tax Number'].included ? `$${serviceStatus['EIN Business Tax Number'].price} (Included)` : `$${serviceStatus['EIN Business Tax Number'].price}`) : 
                '$0';
        }

        if (bylawsPrice) {
            bylawsPrice.textContent = serviceStatus['Corporate Bylaws'].price > 0 ? 
                (serviceStatus['Corporate Bylaws'].included ? `$${serviceStatus['Corporate Bylaws'].price} (Included)` : `$${serviceStatus['Corporate Bylaws'].price}`) : 
                '$0';
        }

        // 计算总价（不包括已包含的服务）
        let additionalServicesTotal = 0;
        Object.values(serviceStatus).forEach(service => {
            if (service.price > 0 && !service.included) {
                additionalServicesTotal += service.price;
            }
        });

        // 更新总价
        const total = packagePrice + stateFee + additionalServicesTotal;
        const totalPrice = document.getElementById('total-price');
        if (totalPrice) {
            totalPrice.textContent = `$${total}`;
        }
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

    // 默认选中 Standard 套餐
    if (standardCard) {
        // 移除其他卡片的选中状态
        packageCards.forEach(card => card.classList.remove('selected'));
        // 添加选中状态
        standardCard.classList.add('selected');
        // 更新基础价格显示
        const packagePrice = standardCard.getAttribute('data-price');
        const basePrice = document.getElementById('base-price');
        if (basePrice) {
            basePrice.textContent = `$${packagePrice}`;
        }
        // 更新总价
        updateTotalPrice();
    }

    // 处理添加成员的功能
    function initializeMemberFunctions() {
        const addMemberBtn = document.querySelector('.add-member-btn');
        const memberFormsContainer = document.querySelector('.member-form').parentElement;
        let memberCount = 1;

        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => {
                memberCount++;
                const newMemberForm = createMemberForm(memberCount);
                memberFormsContainer.insertBefore(newMemberForm, addMemberBtn);
            });
        }
    }

    // 创建新成员表单
    function createMemberForm(memberNumber) {
        const memberForm = document.createElement('div');
        memberForm.className = 'member-form';
        memberForm.innerHTML = `
            <div class="form-header">
                <h4>Member ${memberNumber}</h4>
                ${memberNumber > 1 ? '<button type="button" class="remove-member-btn">删除成员</button>' : ''}
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Enter member name" />
            </div>
            <div class="form-group">
                <label>Ownership %</label>
                <input type="number" placeholder="Enter ownership percentage" min="0" max="100" />
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" placeholder="Enter member address" />
            </div>
        `;

        // 添加删除成员的事件监听
        const removeBtn = memberForm.querySelector('.remove-member-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                memberForm.remove();
            });
        }

        return memberForm;
    }

    // 在文档加载完成后初始化
    initializeMemberFunctions();

    // 处理虚拟地址选择
    function handleAddressTypeSelection() {
        const virtualAddressRadio = document.getElementById('virtual-address');
        const ownAddressRadio = document.getElementById('own-address');
        
        if (virtualAddressRadio && ownAddressRadio) {
            // 监听虚拟地址选项的变化
            virtualAddressRadio.addEventListener('change', () => {
                if (virtualAddressRadio.checked) {
                    updateAddressDisplays(true);
                }
            });

            // 监听自有地址选项的变化
            ownAddressRadio.addEventListener('change', () => {
                if (ownAddressRadio.checked) {
                    updateAddressDisplays(false);
                }
            });

            // 监听州选择变化
            const stateSelect = document.getElementById('entity-type-select');
            if (stateSelect) {
                stateSelect.addEventListener('change', () => {
                    if (virtualAddressRadio.checked) {
                        updateAddressDisplays(true);
                    }
                });
            }

            // 默认选中虚拟地址选项并更新显示
            virtualAddressRadio.checked = true;
            updateAddressDisplays(true);
        }
    }

    // 更新所有表单中的地址显示
    function updateAddressDisplays(useVirtualAddress) {
        // 更新所有表单中的地址显示
        const forms = {
            'llc': '#llc-form',
            'corp': '#corporation-form',
            'np': '#nonprofit-form',
            'dba': '#dba-form'
        };
        
        Object.entries(forms).forEach(([formType, formSelector]) => {
            const virtualDisplay = document.querySelector(`${formSelector} .virtual-address-display`);
            const physicalInput = document.querySelector(`${formSelector} .physical-address-input`);
            
            if (virtualDisplay && physicalInput) {
                if (useVirtualAddress) {
                    virtualDisplay.classList.remove('hidden');
                    physicalInput.classList.add('hidden');
                    
                    // 更新虚拟地址内容
                    const stateSelect = document.getElementById('entity-type-select');
                    const selectedState = stateSelect ? stateSelect.options[stateSelect.selectedIndex].text : 'Alabama';
                    
                    // 更新地址显示
                    const addressContent = virtualDisplay.querySelector('.address-content p');
                    if (addressContent) {
                        addressContent.innerHTML = `181 W VALLEY AVE STE 245<br>${selectedState.toUpperCase()}, AL 35209`;
                    }
                } else {
                    virtualDisplay.classList.add('hidden');
                    physicalInput.classList.remove('hidden');
                }
            }
        });

        // 更新价格显示
        const virtualAddressPrice = document.querySelector('.virtual-address-price');
        if (virtualAddressPrice) {
            virtualAddressPrice.textContent = useVirtualAddress ? '$29/month' : '$0';
        }
        
        // 更新总价
        updateTotalPrice();
    }

    // 初始化地址类型选择
    handleAddressTypeSelection();

    // 处理 Corporation 表单相关功能
    function initializeCorporationForm() {
        // 注册代理人选择
        const agentTypeSelect = document.getElementById('corp-agent-type');
        const selfAgentInfo = document.getElementById('self-agent-info');
        
        if (agentTypeSelect) {
            agentTypeSelect.addEventListener('change', function() {
                if (selfAgentInfo) {
                    selfAgentInfo.classList.toggle('hidden', this.value === 'company-provided');
                }
            });
        }

        // 股份类型选择
        const shareClassSelect = document.getElementById('corp-share-classes');
        const preferredSharesInfo = document.getElementById('preferred-shares-info');
        
        if (shareClassSelect) {
            shareClassSelect.addEventListener('change', function() {
                if (preferredSharesInfo) {
                    preferredSharesInfo.classList.toggle('hidden', this.value === 'common');
                }
            });
        }

        // 公司章程模板选择
        const articlesTemplateSelect = document.getElementById('corp-articles-template');
        const customArticles = document.getElementById('custom-articles');
        
        if (articlesTemplateSelect) {
            articlesTemplateSelect.addEventListener('change', function() {
                if (customArticles) {
                    customArticles.classList.toggle('hidden', this.value === 'standard');
                }
            });
        }

        // Corporate Bylaws 选择
        const bylawsPreferenceSelect = document.getElementById('corp-bylaws-preference');
        const customBylaws = document.getElementById('custom-bylaws');
        
        if (bylawsPreferenceSelect) {
            bylawsPreferenceSelect.addEventListener('change', function() {
                if (customBylaws) {
                    customBylaws.classList.toggle('hidden', this.value !== 'custom');
                }
            });
        }

        // SSN/ITIN 输入格式化
        const ssnInputs = [
            document.getElementById('corp-president-ssn'),
            document.getElementById('corp-secretary-ssn'),
            document.getElementById('corp-treasurer-ssn'),
            document.getElementById('corp-tax-ssn')
        ];

        ssnInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 9) {
                        value = value.substr(0, 9);
                    }
                    if (value.length >= 5) {
                        value = value.substr(0, 3) + '-' + value.substr(3, 2) + '-' + value.substr(5);
                    } else if (value.length >= 3) {
                        value = value.substr(0, 3) + '-' + value.substr(3);
                    }
                    e.target.value = value;
                });
            }
        });

        // 文件上传验证
        const fileInputs = [
            document.getElementById('corp-articles-file'),
            document.getElementById('corp-bylaws-file')
        ];

        fileInputs.forEach(input => {
            if (input) {
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const allowedTypes = ['.pdf', '.doc', '.docx'];
                        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
                        
                        if (!allowedTypes.includes(fileExt)) {
                            alert('Please upload a PDF or Word document.');
                            e.target.value = '';
                        } else if (file.size > 10 * 1024 * 1024) { // 10MB limit
                            alert('File size should not exceed 10MB.');
                            e.target.value = '';
                        }
                    }
                });
            }
        });
    }

    // 在文档加载完成后初始化
    initializeCorporationForm();

    // Form Validation
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, '此字段为必填项');
            } else {
                clearError(field);
            }
        });

        if (isValid) {
            showSuccess(form);
        }
    }

    // Name Availability Check
    async function checkNameAvailability(name) {
        const checkButton = document.querySelector('.check-name-btn');
        const resultDiv = document.createElement('div');
        resultDiv.className = 'name-check-result';

        checkButton.disabled = true;
        checkButton.innerHTML = '<span class="material-icons">hourglass_empty</span> Checking...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock response
            const isAvailable = Math.random() > 0.5;
            
            resultDiv.innerHTML = `
                <span class="material-icons ${isAvailable ? 'success-icon' : 'error-icon'}">
                    ${isAvailable ? 'check_circle' : 'error'}
                </span>
                <span class="${isAvailable ? 'success-message' : 'error-message'}">
                    ${isAvailable ? 'This name is available!' : 'This name is already taken'}
                </span>
            `;
        } catch (error) {
            resultDiv.innerHTML = `
                <span class="material-icons error-icon">error</span>
                <span class="error-message">Error checking name availability</span>
            `;
        } finally {
            checkButton.disabled = false;
            checkButton.innerHTML = '<span class="material-icons">search</span> Check Availability';
            
            const existingResult = document.querySelector('.name-check-result');
            if (existingResult) {
                existingResult.remove();
            }
            
            document.querySelector('.form-field-input-wrapper').appendChild(resultDiv);
        }
    }

    // File Upload Handling
    function setupFileUpload() {
        const dropzone = document.querySelector('.dropzone');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.pdf,.jpg,.jpeg,.png';
        fileInput.style.display = 'none';

        dropzone.appendChild(fileInput);

        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dropzone-active');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dropzone-active');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dropzone-active');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });
    }

    function handleFiles(files) {
        const dropzone = document.querySelector('.dropzone');
        const fileList = document.createElement('div');
        fileList.className = 'file-list';

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span class="material-icons">description</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <button class="remove-file">
                    <span class="material-icons">close</span>
                </button>
            `;

            fileItem.querySelector('.remove-file').addEventListener('click', () => {
                fileItem.remove();
            });

            fileList.appendChild(fileItem);
        });

        const existingList = dropzone.querySelector('.file-list');
        if (existingList) {
            existingList.remove();
        }

        dropzone.appendChild(fileList);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Stepper Navigation
    function setupStepper() {
        const steps = document.querySelectorAll('.stepper-step');
        let currentStep = 0;

        function updateStepper() {
            steps.forEach((step, index) => {
                if (index === currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            const progress = ((currentStep + 1) / steps.length) * 100;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
        }

        document.querySelector('.button-primary').addEventListener('click', () => {
            if (validateForm() && currentStep < steps.length - 1) {
                currentStep++;
                updateStepper();
            }
        });

        document.querySelector('.button-secondary').addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepper();
            }
        });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        setupFileUpload();
        setupStepper();

        // Name availability check
        const checkButton = document.querySelector('.check-name-btn');
        checkButton.addEventListener('click', () => {
            const nameInput = document.querySelector('.form-field-input');
            checkNameAvailability(nameInput.value);
        });

        // Form validation
        const form = document.querySelector('.form-container');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                // Handle form submission
                console.log('Form submitted successfully');
            }
        });
    });

    // 表单验证
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, '此字段为必填项');
            } else {
                clearError(field);
            }
        });

        if (isValid) {
            showSuccess(form);
        }
    }

    // 显示错误信息
    function showError(field, message) {
        const existingError = field.parentElement.querySelector('.error-message');
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentElement.appendChild(errorDiv);
        }
        field.classList.add('error');
    }

    // 清除错误信息
    function clearError(field) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }

    // 显示成功信息
    function showSuccess(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.innerHTML = '<span class="material-icons">check_circle</span>表单提交成功！';
        form.insertBefore(successMessage, form.firstChild);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }

    // 处理文件上传
    function handleFileUpload(input) {
        const file = input.files[0];
        if (file) {
            const preview = input.parentElement.querySelector('.upload-preview');
            if (preview) {
                preview.classList.remove('hidden');
                const fileName = preview.querySelector('.file-name');
                if (fileName) {
                    fileName.textContent = file.name;
                }
            }
        }
    }

    // 设置动态表单字段
    function setupDynamicFields() {
        // 管理结构选择
        const managementTypes = document.querySelectorAll('input[name="management-type"]');
        managementTypes.forEach(type => {
            type.addEventListener('change', function() {
                const memberDesc = document.getElementById('member-managed-desc');
                const managerDesc = document.getElementById('manager-managed-desc');
                
                if (this.value === 'member') {
                    memberDesc.classList.remove('hidden');
                    managerDesc.classList.add('hidden');
                } else {
                    memberDesc.classList.add('hidden');
                    managerDesc.classList.remove('hidden');
                }
            });
        });

        // 邮寄地址选择
        const mailingAddressRadios = document.querySelectorAll('input[name="mailing-address"]');
        mailingAddressRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const mailingDetails = document.getElementById('mailing-address-details');
                if (this.value === 'different') {
                    mailingDetails.classList.remove('hidden');
                } else {
                    mailingDetails.classList.add('hidden');
                }
            });
        });
    }

    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 处理签名选项卡的选择
    document.querySelectorAll('.signature-card').forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的选中状态
            document.querySelectorAll('.signature-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // 添加当前卡片的选中状态
            this.classList.add('selected');
            
            // 更新隐藏的input值
            const signatureType = this.getAttribute('data-value');
            document.getElementById('signature_type').value = signatureType;
        });
    });

    // 初始化时选中电子签名选项
    document.querySelector('.signature-card[data-value="electronic"]').click();

    // Handle citizenship card selection
    document.querySelectorAll('.citizenship-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            document.querySelectorAll('.citizenship-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Update hidden input value
            const citizenshipStatus = this.getAttribute('data-value');
            document.getElementById('citizenship_status').value = citizenshipStatus;
            
            // Show/hide foreign status info section
            const foreignInfoSection = document.getElementById('foreign-status-info');
            if (citizenshipStatus === 'foreign') {
                foreignInfoSection.classList.remove('hidden');
            } else {
                foreignInfoSection.classList.add('hidden');
            }
        });
    });

    // Initialize with U.S. Citizen selected
    document.querySelector('.citizenship-card[data-value="us-citizen"]').click();

    // Stepper functionality
    const stepperSections = document.querySelectorAll('.stepper-section');
    
    // 默认展开第一个部分
    if (stepperSections.length > 0) {
        stepperSections[0].classList.add('expanded', 'active');
    }
    
    // 为每个步骤头部添加点击事件
    stepperSections.forEach((section, index) => {
        const header = section.querySelector('.stepper-header');
        
        header.addEventListener('click', () => {
            // 切换当前部分的展开状态
            section.classList.toggle('expanded');
            
            // 更新活动状态
            stepperSections.forEach(s => s.classList.remove('active'));
            section.classList.add('active');
            
            // 如果展开了当前部分，检查之前的部分是否已完成
            if (section.classList.contains('expanded')) {
                for (let i = 0; i < index; i++) {
                    stepperSections[i].classList.add('completed');
                }
            }
        });
    });
    
    // 表单验证和自动展开下一步
    const formInputs = document.querySelectorAll('.stepper-content input, .stepper-content select, .stepper-content textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            const currentSection = this.closest('.stepper-section');
            const allInputsInSection = currentSection.querySelectorAll('input, select, textarea');
            const allFilled = Array.from(allInputsInSection).every(input => {
                if (input.hasAttribute('required')) {
                    return input.value.trim() !== '';
                }
                return true;
            });
            
            if (allFilled) {
                currentSection.classList.add('completed');
                const nextSection = currentSection.nextElementSibling;
                if (nextSection && nextSection.classList.contains('stepper-section')) {
                    // 自动展开下一部分
                    setTimeout(() => {
                        nextSection.classList.add('expanded', 'active');
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    });
}); 