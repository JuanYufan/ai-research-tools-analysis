// 从外部数据文件加载工具数据
async function loadToolsData() {
    // 等待数据加载完成
    await new Promise(resolve => setTimeout(resolve, 100)); // 确保data.js已加载
    
    // 返回完整的工具数据
    return toolsInfo;
}

// 生成工具卡片
async function renderToolCards() {
    const container = document.getElementById('tools-container');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载工具数据...</p></div>';
    
    const toolsData = await loadToolsData();
    container.innerHTML = '';
    
    toolsData.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        
        let ratingsHtml = '<div class="rating">';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(tool.overallRating)) {
                ratingsHtml += '★';
            } else if (i - 0.5 <= tool.overallRating) {
                ratingsHtml += '½'; // 实际的半星符号
            } else {
                ratingsHtml += '☆';
            }
        }
        ratingsHtml += ` ${tool.overallRating}/5</div>`;
        
        // 构建优势和劣势列表
        let strengthsHtml = '<div class="strengths"><h4>优势:</h4><ul>';
        tool.strengths.forEach(strength => {
            strengthsHtml += `<li>${strength}</li>`;
        });
        strengthsHtml += '</ul></div>';
        
        let weaknessesHtml = '<div class="weaknesses"><h4>劣势:</h4><ul>';
        if (tool.weaknesses && tool.weaknesses.length > 0) {
            tool.weaknesses.forEach(weakness => {
                weaknessesHtml += `<li>${weakness}</li>`;
            });
        } else {
            weaknessesHtml += '<li>暂无记录</li>';
        }
        weaknessesHtml += '</ul></div>';
        
        toolCard.innerHTML = `
            <div class="tool-header">
                <div class="tool-icon">${tool.name.charAt(0)}</div>
                <div>
                    <h3 class="tool-name">${tool.name}</h3>
                    <span class="market-position">${tool.marketPosition}</span>
                </div>
            </div>
            <p>${tool.description}</p>
            <p><strong>类别:</strong> ${tool.category}</p>
            <p><strong>定价:</strong> ${tool.pricing}</p>
            ${ratingsHtml}
            <div class="tool-stats">
                <p><strong>正面评价:</strong> ${tool.positiveReviews.length}</p>
                <p><strong>负面评价:</strong> ${tool.negativeReviews.length}</p>
            </div>
            ${strengthsHtml}
            ${weaknessesHtml}
        `;
        
        container.appendChild(toolCard);
    });
}

// 生成正面评价
async function renderPositiveReviews() {
    const container = document.getElementById('positive-reviews');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载正面评价...</p></div>';
    
    const toolsData = await loadToolsData();
    container.innerHTML = '';
    
    let allPositiveReviews = [];
    toolsData.forEach(tool => {
        allPositiveReviews = allPositiveReviews.concat(tool.positiveReviews.map(review => ({
            ...review,
            tool: tool.name
        })));
    });
    
    if (allPositiveReviews.length > 0) {
        allPositiveReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card positive';
            
            // 根据验证状态添加视觉指示
            const verificationBadge = review.verificationStatus === 'verified' ? 
                '<span style="color: green;">✓ 已验证</span>' : 
                '<span style="color: orange;">待验证</span>';
                
            reviewCard.innerHTML = `
                <div class="review-content">"${review.content}"</div>
                <div class="review-meta">
                    <div>
                        <strong>${review.author}</strong> • ${review.tool}<br>
                        <small>${review.authorRole}, ${review.authorCompany}</small>
                    </div>
                    <div>${review.platform} • ${review.date} • ${verificationBadge}</div>
                </div>
                ${review.link && review.link !== '#' ? `<div class="review-link"><a href="${review.link}" target="_blank">查看原始评价</a></div>` : ''}
            `;
            container.appendChild(reviewCard);
        });
    } else {
        container.innerHTML = '<p>暂无正面评价</p>';
    }
}

// 生成负面评价
async function renderNegativeReviews() {
    const container = document.getElementById('negative-reviews');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>加载负面评价...</p></div>';
    
    const toolsData = await loadToolsData();
    container.innerHTML = '';
    
    let allNegativeReviews = [];
    toolsData.forEach(tool => {
        allNegativeReviews = allNegativeReviews.concat(tool.negativeReviews.map(review => ({
            ...review,
            tool: tool.name
        })));
    });
    
    if (allNegativeReviews.length > 0) {
        allNegativeReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card negative';
            
            // 根据验证状态添加视觉指示
            const verificationBadge = review.verificationStatus === 'verified' ? 
                '<span style="color: green;">✓ 已验证</span>' : 
                '<span style="color: orange;">待验证</span>';
                
            reviewCard.innerHTML = `
                <div class="review-content">"${review.content}"</div>
                <div class="review-meta">
                    <div>
                        <strong>${review.author}</strong> • ${review.tool}<br>
                        <small>${review.authorRole}, ${review.authorCompany}</small>
                    </div>
                    <div>${review.platform} • ${review.date} • ${verificationBadge}</div>
                </div>
                ${review.link && review.link !== '#' ? `<div class="review-link"><a href="${review.link}" target="_blank">查看原始评价</a></div>` : ''}
            `;
            container.appendChild(reviewCard);
        });
    } else {
        container.innerHTML = '<p>暂无负面评价</p>';
    }
}

// 平滑滚动到锚点
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// 导航栏激活状态
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 初始化网站
document.addEventListener('DOMContentLoaded', async function() {
    await renderToolCards();
    await renderPositiveReviews();
    await renderNegativeReviews();
    
    // 为导航链接添加平滑滚动
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    // 更新导航栏激活状态
    window.addEventListener('scroll', updateActiveNav);
    
    // 初始化激活第一个导航项
    const firstNavLink = document.querySelector('nav a');
    if (firstNavLink) {
        firstNavLink.classList.add('active');
    }
});

// 工具搜索功能
function searchTools(query) {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        const toolName = card.querySelector('.tool-name').textContent.toLowerCase();
        const toolDescription = card.querySelector('p').textContent.toLowerCase();
        if (toolName.includes(query.toLowerCase()) || toolDescription.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 添加搜索功能到页面
document.addEventListener('DOMContentLoaded', function() {
    // 创建搜索框并添加到页面顶部
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style = 'text-align: center; margin: 20px 0;';
    searchContainer.innerHTML = `
        <input type="text" id="toolSearch" placeholder="搜索工具..." style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 5px;">
    `;
    
    const mainHeader = document.querySelector('header');
    mainHeader.parentNode.insertBefore(searchContainer, mainHeader.nextSibling);
    
    // 为搜索框添加事件监听
    document.getElementById('toolSearch').addEventListener('input', function(e) {
        searchTools(e.target.value);
    });
});