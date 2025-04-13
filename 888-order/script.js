document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion effect
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const arrow = question.querySelector('.arrow');
            
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.querySelector('.arrow').textContent = '▼';
                }
            });
            
            // Toggle current FAQ
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                arrow.textContent = '▼';
            } else {
                answer.style.display = 'block';
                arrow.textContent = '▲';
            }
        });
    });

    // Tab switching functionality
    const businessTypeIcons = document.querySelectorAll('.business-type-icon');
    const detailCards = document.querySelectorAll('.detail-card');

    businessTypeIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // 更新图标激活状态
            businessTypeIcons.forEach(icon => icon.classList.remove('active'));
            this.classList.add('active');
            
            // 更新详情卡片激活状态
            detailCards.forEach(card => {
                if (card.dataset.type === type) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // 隐藏所有表单
            hideAllForms();

            // 在移动端平滑滚动到详情部分
            if (window.innerWidth <= 768) {
                const detailsSection = document.querySelector('.details-container');
                detailsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 添加隐藏所有表单的函数
    function hideAllForms() {
        const forms = [
            document.getElementById('llc-form'),
            document.getElementById('corporation-form'),
            document.getElementById('nonprofit-form'),
            document.getElementById('dba-form')
        ];
        
        forms.forEach(form => {
            if (form) {
                form.classList.add('hidden');
            }
        });
    }

    // Business type card click handling
    const startButtons = document.querySelectorAll('.start-button, .start-now');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const businessType = this.closest('.business-card, .detail-card').querySelector('h2, h3').textContent;
            let type;
            
            // 根据按钮文本或父元素内容确定类型
            if (this.textContent.includes('LLC')) {
                type = 'llc';
            } else if (this.textContent.includes('Corporation')) {
                type = 'corporation';
            } else if (this.textContent.includes('Nonprofit')) {
                type = 'nonprofit';
            } else if (this.textContent.includes('DBA')) {
                type = 'dba';
            } else {
                // 从父元素标题判断
                type = businessType.toLowerCase().includes('corporation') ? 'corporation' :
                       businessType.toLowerCase().includes('nonprofit') ? 'nonprofit' :
                       businessType.toLowerCase().includes('dba') ? 'dba' : 'llc';
            }
            
            showFormByType(type);
        });
    });

    // Show order review page
    function showOrderReview(businessType) {
        const orderReview = document.querySelector('.order-review');
        const packageInfo = orderReview.querySelector('.package-info h3');
        
        // Update package name
        packageInfo.textContent = businessType + ' Pro Package';
        
        // Show order review section
        orderReview.style.display = 'block';
        
        // Scroll to order review section
        orderReview.scrollIntoView({ behavior: 'smooth' });
    }

    // Promo code toggle
    const promoToggle = document.querySelector('.promo-toggle');
    if (promoToggle) {
        promoToggle.addEventListener('click', function() {
            const promoCode = this.parentElement;
            
            // Check if input field already exists
            if (!promoCode.querySelector('.promo-input')) {
                const inputGroup = document.createElement('div');
                inputGroup.className = 'promo-input-group';
                inputGroup.innerHTML = `
                    <input type="text" placeholder="Enter promo code" class="promo-input">
                    <button class="apply-promo">Apply</button>
                `;
                promoCode.appendChild(inputGroup);
            }
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Business type details toggle
    const businessCards = document.querySelectorAll('.business-card');
    businessCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果不是点击开始按钮，则隐藏所有表单
            if (!e.target.classList.contains('start-button')) {
                hideAllForms();
                const type = this.querySelector('h2').textContent;
                showBusinessDetails(type);
            }
        });
    });

    function showBusinessDetails(type) {
        const detailsContainer = document.querySelector('.details-container');
        // Here we can show different details for different business types
        // For demo, we just update the title
        const detailCard = detailsContainer.querySelector('.detail-card');
        detailCard.querySelector('h3').textContent = type;
    }

    // Payment option toggle
    const paymentOptions = document.querySelectorAll('.payment-options .options > div');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // LLC表单处理
    const llcForm = document.getElementById('llc-form');

    // 显示表单
    function showLLCForm() {
        llcForm.classList.remove('hidden');
        // 滚动到表单位置
        llcForm.scrollIntoView({ behavior: 'smooth' });
    }

    // 处理表单编辑
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.form-section');
            const inputs = section.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.removeAttribute('readonly');
                input.focus();
            });
        });
    });

    // 处理成员添加
    const addMemberBtn = document.querySelector('.add-member-btn');
    const memberFormContainer = document.querySelector('.member-form').parentElement;

    let memberCount = 1;

    addMemberBtn.addEventListener('click', function() {
        memberCount++;
        const newMemberForm = document.createElement('div');
        newMemberForm.className = 'member-form';
        newMemberForm.innerHTML = `
            <h4>Member ${memberCount}</h4>
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
            <button class="remove-member-btn">Remove Member</button>
        `;
        
        memberFormContainer.insertBefore(newMemberForm, addMemberBtn);
    });

    // 处理成员删除
    memberFormContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-member-btn')) {
            e.target.closest('.member-form').remove();
            memberCount--;
        }
    });

    // 处理表单保存
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', function() {
        // 收集表单数据
        const formData = {
            formation: {
                state: document.getElementById('formation-state').value,
                entityType: document.getElementById('entity-type').value
            },
            contact: {
                name: document.getElementById('contact-name').value,
                phone: document.getElementById('contact-phone').value,
                email: document.getElementById('contact-email').value,
                address: document.getElementById('contact-address').value
            },
            agent: {
                type: document.getElementById('agent-type').value
            },
            company: {
                name: document.getElementById('company-name').value,
                address: document.getElementById('company-address').value,
                contactAddress: document.getElementById('contact-address-alt').value
            },
            taxInfo: {
                name: document.getElementById('tax-name').value,
                address: document.getElementById('tax-address').value,
                ssn: document.getElementById('tax-ssn').value
            },
            members: []
        };

        // 收集所有成员信息
        document.querySelectorAll('.member-form').forEach(memberForm => {
            const member = {
                name: memberForm.querySelector('input[placeholder="Enter member name"]').value,
                ownership: memberForm.querySelector('input[type="number"]').value,
                address: memberForm.querySelector('input[placeholder="Enter member address"]').value
            };
            formData.members.push(member);
        });

        // 这里可以添加数据验证和提交逻辑
        console.log('Form Data:', formData);
        
        // 隐藏表单
        llcForm.classList.add('hidden');
    });

    // 处理取消按钮
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function() {
        llcForm.classList.add('hidden');
    });

    // 表单显示控制
    function showFormByType(type) {
        // 先隐藏所有表单
        hideAllForms();
        
        // 显示对应表单
        switch(type.toLowerCase()) {
            case 'llc':
                document.getElementById('llc-form').classList.remove('hidden');
                document.getElementById('llc-form').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'corporation':
                document.getElementById('corporation-form').classList.remove('hidden');
                document.getElementById('corporation-form').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'nonprofit':
                document.getElementById('nonprofit-form').classList.remove('hidden');
                document.getElementById('nonprofit-form').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'dba':
                document.getElementById('dba-form').classList.remove('hidden');
                document.getElementById('dba-form').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }

    // Corporation表单处理
    const corpForm = document.getElementById('corporation-form');
    if (corpForm) {
        // 处理董事添加
        const addDirectorBtn = corpForm.querySelector('.add-director-btn');
        const directorContainer = corpForm.querySelector('.director-form').parentElement;
        let directorCount = 1;

        addDirectorBtn.addEventListener('click', function() {
            directorCount++;
            const newDirectorForm = document.createElement('div');
            newDirectorForm.className = 'director-form';
            newDirectorForm.innerHTML = `
                <h4>Director ${directorCount}</h4>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Enter director name" />
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" placeholder="Enter director address" />
                </div>
                <button class="remove-director-btn">Remove Director</button>
            `;
            
            directorContainer.insertBefore(newDirectorForm, addDirectorBtn);
        });

        // 处理股东添加
        const addShareholderBtn = corpForm.querySelector('.add-shareholder-btn');
        const shareholderContainer = corpForm.querySelector('.shareholder-form').parentElement;
        let shareholderCount = 1;

        addShareholderBtn.addEventListener('click', function() {
            shareholderCount++;
            const newShareholderForm = document.createElement('div');
            newShareholderForm.className = 'shareholder-form';
            newShareholderForm.innerHTML = `
                <h4>Shareholder ${shareholderCount}</h4>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Enter shareholder name" />
                </div>
                <div class="form-group">
                    <label>Number of Shares</label>
                    <input type="number" placeholder="Enter number of shares" min="1" />
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" placeholder="Enter shareholder address" />
                </div>
                <div class="form-group">
                    <label>SSN</label>
                    <input type="text" placeholder="Enter SSN" pattern="\d{3}-\d{2}-\d{4}" />
                </div>
                <button class="remove-shareholder-btn">Remove Shareholder</button>
            `;
            
            shareholderContainer.insertBefore(newShareholderForm, addShareholderBtn);
        });

        // 处理删除按钮
        corpForm.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-director-btn')) {
                e.target.closest('.director-form').remove();
                directorCount--;
            }
            if (e.target.classList.contains('remove-shareholder-btn')) {
                e.target.closest('.shareholder-form').remove();
                shareholderCount--;
            }
        });
    }

    // Nonprofit表单处理
    const npForm = document.getElementById('nonprofit-form');
    if (npForm) {
        // 处理董事添加
        const addDirectorBtn = npForm.querySelector('.add-director-btn');
        const directorContainer = npForm.querySelector('.director-form').parentElement;
        let directorCount = 1;

        addDirectorBtn.addEventListener('click', function() {
            directorCount++;
            const newDirectorForm = document.createElement('div');
            newDirectorForm.className = 'director-form';
            newDirectorForm.innerHTML = `
                <h4>Director ${directorCount}</h4>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Enter director name" />
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" placeholder="Enter director address" />
                </div>
                <button class="remove-director-btn">Remove Director</button>
            `;
            
            directorContainer.insertBefore(newDirectorForm, addDirectorBtn);
        });

        // 处理删除按钮
        npForm.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-director-btn')) {
                e.target.closest('.director-form').remove();
                directorCount--;
            }
        });
    }

    // 移除之前的showLLCForm函数调用
    startButtons.forEach(button => {
        button.removeEventListener('click', showLLCForm);
    });

    // 添加SSN格式化
    const ssnInput = document.getElementById('tax-ssn');
    ssnInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);
        
        if (value.length >= 5) {
            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
        } else if (value.length >= 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        e.target.value = value;
    });

    // DBA表单处理
    const dbaForm = document.getElementById('dba-form');
    if (dbaForm) {
        // 处理业务类型切换
        const businessTypeSelect = dbaForm.querySelector('#dba-business-type');
        const existingEntitySection = dbaForm.querySelector('.existing-entity-section');
        
        businessTypeSelect.addEventListener('change', function() {
            if (this.value === 'existing-entity') {
                existingEntitySection.classList.remove('hidden');
            } else {
                existingEntitySection.classList.add('hidden');
            }
        });

        // 处理地址复制
        const sameAsPhysical = dbaForm.querySelector('#same-as-physical');
        const physicalAddress = dbaForm.querySelector('#dba-physical-address');
        const mailingAddress = dbaForm.querySelector('#dba-mailing-address');

        sameAsPhysical.addEventListener('change', function() {
            if (this.checked) {
                mailingAddress.value = physicalAddress.value;
                mailingAddress.setAttribute('readonly', true);
            } else {
                mailingAddress.removeAttribute('readonly');
            }
        });

        // 监听物理地址变化
        physicalAddress.addEventListener('input', function() {
            if (sameAsPhysical.checked) {
                mailingAddress.value = this.value;
            }
        });

        // 处理保存按钮
        const saveBtn = dbaForm.querySelector('.save-btn');
        saveBtn.addEventListener('click', function() {
            // 收集表单数据
            const formData = {
                businessType: businessTypeSelect.value,
                dbaInfo: {
                    name: document.getElementById('dba-name').value,
                    state: document.getElementById('dba-state').value,
                    county: document.getElementById('dba-county').value
                },
                ownerInfo: {
                    name: document.getElementById('dba-owner-name').value,
                    phone: document.getElementById('dba-owner-phone').value,
                    email: document.getElementById('dba-owner-email').value
                },
                address: {
                    physical: document.getElementById('dba-physical-address').value,
                    mailing: document.getElementById('dba-mailing-address').value
                },
                businessDetails: {
                    nature: document.getElementById('dba-business-nature').value,
                    startDate: document.getElementById('dba-start-date').value
                }
            };

            // 如果是现有实体，添加实体信息
            if (businessTypeSelect.value === 'existing-entity') {
                formData.entityInfo = {
                    name: document.getElementById('dba-entity-name').value,
                    type: document.getElementById('dba-entity-type').value,
                    number: document.getElementById('dba-entity-number').value
                };
            }

            console.log('DBA Form Data:', formData);
            
            // 隐藏表单
            dbaForm.classList.add('hidden');
        });

        // 处理取消按钮
        const cancelBtn = dbaForm.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            dbaForm.classList.add('hidden');
        });
    }
}); 