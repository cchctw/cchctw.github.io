// Vocational groups data definition
const vocationalGroups = {
  '機械群': ['機械科', '鑄造科', '板金科', '機械木模科', '配管科', '模具科', '機電科', '製圖科', '生物產業機電科', '電腦機械製圖科'],
  '動力機械群': ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科', '軌道車輛科'],
  '電機與電子群': ['資訊科', '電子科', '控制科', '電機科', '冷凍空調科', '航空電子科', '電機空調科'],
  '化工群': ['化工科', '紡織科', '染整科'],
  '土木與建築群': ['建築科', '土木科', '消防工程科', '空間測繪科'],
  '商業與管理群': ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '不動產事務科', '電子商務科', '流通管理科', '農產行銷科', '航運管理科'],
  '外語群': ['應用外語科（英文組）', '應用外語科（日文組）'],
  '設計群': ['家具木工科', '美工科', '陶瓷工程科', '室內空間設計科', '圖文傳播科', '金屬工藝科', '家具設計科', '廣告設計科', '多媒體設計科', '多媒體應用科', '室內設計科'],
  '農業群': ['農場經營科', '園藝科', '森林科', '野生動物保育科', '造園科', '畜產保健科'],
  '食品群': ['食品加工科', '食品科', '水產食品科', '烘焙科'],
  '家政群': ['家政科', '服裝科', '幼兒保育科', '美容科', '時尚模特兒科', '流行服飾科', '時尚造型科', '照顧服務科'],
  '餐旅群': ['觀光事業科', '餐飲管理科']
};

// Score to points mapping
const scorePoints = {
  'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2
};

// Utility functions and event handlers

function toggleVocationalGroup() {
  const schoolType = document.getElementById('schoolType').value;
  const vocationalGroupContainer = document.getElementById('vocationalGroupContainer');
  const vocationalGroup = document.getElementById('vocationalGroup');

  if (schoolType === '職業類科') {
    vocationalGroupContainer.style.display = 'block';
  } else {
    vocationalGroupContainer.style.display = 'none';
    vocationalGroup.value = 'all';
  }
}

function toggleInstructions() {
  var instructionsModal = document.getElementById('instructionsModal');
  instructionsModal.style.display = 'block';
}

function closeInstructions() {
  var instructionsModal = document.getElementById('instructionsModal');
  instructionsModal.style.display = 'none';
}

function showDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  modal.style.display = 'block';
}

function closeDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  modal.style.display = 'none';
}

function showInvitationValidationAnimation() {
  const invitationGroup = document.getElementById('invitationCode').closest('.form-group');
  if (!invitationGroup) return;
  invitationGroup.style.position = 'relative';
  const overlay = document.createElement('div');
  overlay.id = 'invitationValidationOverlay';
  overlay.className = 'validation-overlay';
  overlay.innerHTML = `
    <div class="validation-spinner"></div>
    <div class="validation-text">驗證邀請碼中...</div>
  `;
  invitationGroup.appendChild(overlay);
}

function hideInvitationValidationAnimation() {
  const overlay = document.getElementById('invitationValidationOverlay');
  if (overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
}

function showLoading() {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  
  loadingOverlay.innerHTML = `
    <div class="loading-spinner-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">分析中，請稍候</div>
      <div class="loading-progress"></div>
      <div class="loading-steps">
        <div class="loading-step" data-step="1">
          <i class="fas fa-key"></i>
          <span>驗證邀請碼</span>
        </div>
        <div class="loading-step" data-step="2">
          <i class="fas fa-calculator"></i>
          <span>計算總積分</span>
        </div>
        <div class="loading-step" data-step="3">
          <i class="fas fa-chart-line"></i>
          <span>分析學校落點</span>
        </div>
        <div class="loading-step" data-step="4">
          <i class="fas fa-file-alt"></i>
          <span>生成分析報告</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(loadingOverlay);
  
  requestAnimationFrame(() => {
    loadingOverlay.style.display = 'flex';
    simulateLoadingSteps();
  });
}

function simulateLoadingSteps() {
  const steps = document.querySelectorAll('.loading-step');
  const stepDelay = 800; // Time between each step
  
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('active');
      
      // Add some animation to the icon for each activated step
      const icon = step.querySelector('i');
      icon.style.animation = 'none';
      setTimeout(() => {
        icon.style.animation = 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }, 50);
      
    }, stepDelay * (index + 1));
  });
}

function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      loadingOverlay.remove();
    }, 500);
  }
}

async function logUserActivity(action, details = {}) {
  try {
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    const timestamp = new Date().toISOString();

    const data = {
      timestamp,
      action,
      userAgent,
      screenResolution,
      viewportSize,
      darkMode: document.body.classList.contains('dark-mode'),
      ...details
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbxt-z29pDhZZaD_17onZKoPwP-LB2DEh0_tNhABar7FKifTXDv34xJGuGXz3HduwK3KrQ/exec', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to log activity');
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

async function analyzeScores() {
  const analyzeButton = document.getElementById('analyzeButton');
  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
  }

  try {
    const invitationCode = document.getElementById('invitationCode').value;
    if (!invitationCode.trim()) {
      alert("請填寫邀請碼");
      return;
    }
    
    // Validate invitation code with animation
    showInvitationValidationAnimation();
    let validationResponse;
    try {
      validationResponse = await fetch('https://script.google.com/macros/s/AKfycbwN_GX-0A_ZllpYAAgPj8fqXofwhX5AL0h7jJwgQe-YXcB63TSRWdJhCZrogIf8b0E/exec', {
        method: 'POST',
        body: JSON.stringify({
          action: 'validateInvitationCode',
          invitationCode: invitationCode
        })
      });
    } catch (error) {
      hideInvitationValidationAnimation();
      throw error;
    }
    hideInvitationValidationAnimation();

    if (!validationResponse.ok) {
      throw new Error('邀請碼驗證失敗');
    }

    const validationResult = await validationResponse.json();
    if (!validationResult.valid) {
      alert('邀請碼錯誤或已過期，請確認最新的邀請碼。');
      return;
    }
    
    showLoading();

    const schoolOwnership = document.getElementById('schoolOwnership').value;
    const schoolType = document.getElementById('schoolType').value;
    const vocationalGroup = document.getElementById('vocationalGroup').value;

    const fields = ['chinese', 'english', 'math', 'science', 'social', 'composition'];
    let isAllFieldsFilled = true;
    let emptyFields = [];

    fields.forEach(field => {
      const value = document.getElementById(field).value;
      if (value === "") {
        isAllFieldsFilled = false;
        emptyFields.push(field);
      }
    });

    if (!isAllFieldsFilled) {
      let errorMessage = '請填寫以下欄位會考成績：\n';
      const fieldNames = {
        'chinese': '國文',
        'english': '英文',
        'math': '數學',
        'science': '自然',
        'social': '社會',
        'composition': '作文'
      };
      emptyFields.forEach(field => {
        errorMessage += `- ${fieldNames[field]}\n`;
      });
      alert(errorMessage);
      return;
    }

    await logUserActivity('analyze_scores', {
      scores: {
        chinese: document.getElementById('chinese').value,
        english: document.getElementById('english').value,
        math: document.getElementById('math').value,
        science: document.getElementById('science').value,
        social: document.getElementById('social').value,
        composition: parseInt(document.getElementById('composition').value)
      },
      filters: {
        schoolOwnership,
        schoolType,
        vocationalGroup
      }
    });

    const scores = {
      chinese: document.getElementById('chinese').value,
      english: document.getElementById('english').value,
      math: document.getElementById('math').value,
      science: document.getElementById('science').value,
      social: document.getElementById('social').value,
      composition: parseInt(document.getElementById('composition').value)
    };

    // Calculate total points locally
    const totalPoints = calculateTotalPoints(scores);
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbzj4OWtd6sKgPyiiyM2Rs4whdoNxNria8vOp24F8ucS6hSnqlrJ9S0Iu3smu6CCHgJ_/exec', {
      method: 'POST',
      body: JSON.stringify({
        scores,
        filters: {
          schoolOwnership,
          schoolType,
          vocationalGroup
        }
      })
    });

    if (!response.ok) {
      throw new Error('無法取得學校資料');
    }

    const data = await response.json();
    
    // Ensure we use our local calculation but still get eligible schools from backend
    data.totalPoints = totalPoints;
    
    displayResults(data);
  } catch (error) {
    await logUserActivity('analyze_error', { error: error.message });
    alert('發生錯誤：' + error.message);
  } finally {
    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.innerHTML = '<i class="fas fa-search icon"></i>分析落點';
    }
    setTimeout(hideLoading, 3000); // Allow animation to complete
  }
}

// Calculate total points from scores
function calculateTotalPoints(scores) {
  return scorePoints[scores.chinese] + 
         scorePoints[scores.english] + 
         scorePoints[scores.math] + 
         scorePoints[scores.science] + 
         scorePoints[scores.social];
}

function displayResults(data) {
  const { totalPoints, eligibleSchools = [] } = data;
  
  let resultsHTML = `
    <div class="results-container">
      <div class="results-header">
        <h2><i class="fas fa-clipboard-check icon"></i> 分析結果總覽</h2>
        <div class="results-summary">
          <div class="result-card total-points">
            <i class="fas fa-star icon"></i>
            <div class="result-value">${totalPoints}</div>
            <div class="result-label">總積分</div>
          </div>
        </div>`;
  
  if (eligibleSchools && eligibleSchools.length > 0) {
    resultsHTML += `
        <div class="schools-analysis">
          <h3><i class="fas fa-school icon"></i> 可能錄取學校 (共 ${eligibleSchools.length} 所)</h3>
          <div class="school-list">`;
    
    eligibleSchools.forEach((school, index) => {
      resultsHTML += `
            <div class="school-item">
              <div class="school-name">
                ${index + 1}. ${school.name}
                <span class="school-ownership">${school.ownership === 'public' ? '公立' : '私立'}</span>
              </div>
              <div class="school-details">
                <span>類型: ${school.type}</span>
                ${school.group ? `<span>群別: ${school.group}</span>` : ''}
              </div>
            </div>`;
    });
    
    resultsHTML += `
          </div>
        </div>`;
  } else {
    resultsHTML += `
        <div class="no-results">
          <i class="fas fa-exclamation-circle icon"></i>
          <h3>未找到符合條件的學校</h3>
          <p>請嘗試調整您的成績或篩選條件</p>
        </div>`;
  }
  
  // Add analysis explanation section
  resultsHTML += `
        <div class="analysis-explanation">
          <h3><i class="fas fa-info-circle icon"></i> 分析說明</h3>
          <div class="explanation-content">
            <p>本系統根據您輸入的會考成績計算總積分，並與各校歷年錄取門檻進行比對，顯示可能錄取的學校。</p>
            <div class="explanation-points">
              <div class="explanation-point">
                <i class="fas fa-calculator"></i>
                <div>
                  <h4>如何計算總積分</h4>
                  <p>依照會考5科目等級計算：<br>A++, A+, A = 6分<br>B++, B+, B = 4分<br>C = 2分</p>
                </div>
              </div>
              <div class="explanation-point">
                <i class="fas fa-chart-line"></i>
                <div>
                  <h4>錄取機率說明</h4>
                  <p>列出的學校是根據您的總積分有可能錄取的學校，但實際錄取結果還受多種因素影響。</p>
                </div>
              </div>
              <div class="explanation-point">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                  <h4>注意事項</h4>
                  <p>本分析結果僅供參考，實際錄取情況可能會受到當年報考人數、特殊加分政策等因素影響。</p>
                </div>
              </div>
              <div class="explanation-point">
                <i class="fas fa-lightbulb"></i>
                <div>
                  <h4>建議</h4>
                  <p>請結合個人興趣、志向與專長，並諮詢學校輔導老師意見，做出最適合自己的升學選擇。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-update-time">資料更新時間：${new Date().toLocaleString('zh-TW')}</div>
      </div>
    </div>`;
  
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = resultsHTML;
  resultsElement.style.display = 'none';
  
  setTimeout(() => {
    resultsElement.style.display = 'block';
    resultsElement.style.animation = 'fadeIn 0.5s ease-out';
    document.getElementById('exportResults').style.display = 'inline-block';
  }, 100);
}

document.getElementById('exportResults').onclick = showExportOptions;

window.onload = function() {
  showDisclaimer();
  
  // Initialize rating system
  initRating();
};

document.oncontextmenu = function () {
  return false;
};

document.body.onkeydown = function(e) {
  var keyCode = e.keyCode || e.which || e.charCode;
  if (
    keyCode === 123 ||
    (e.ctrlKey && e.shiftKey && (keyCode === 73 || keyCode === 74 || keyCode === 67)) ||
    (e.ctrlKey && keyCode === 85)
  ) {
    e.preventDefault();
    return false;
  }
};

(function() {
  var threshold = 160;
  setInterval(function() {
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      document.body.innerHTML = "<h1>禁止使用開發者工具</h1>";
      throw "開發者工具被禁用";
    }
  }, 1000);
})();

let userRating = 0;

function initRating() {
  const stars = document.querySelectorAll("#starsContainer .star");
  
  stars.forEach((star, index) => {
    star.addEventListener("click", function() {
      userRating = Number(this.getAttribute("data-value"));
      updateStarDisplay(userRating);
      
      stars.forEach((s, i) => {
        if (i <= index) {
          s.style.animationDelay = `${i * 0.1}s`;
          s.classList.add('active');
        }
      });
    });
    
    star.addEventListener("mouseover", function() {
      const rating = Number(this.getAttribute("data-value"));
      stars.forEach((s, i) => {
        if (i < rating) {
          s.style.transform = `scale(${1 + (rating - i) * 0.1})`;
        } else {
          s.style.transform = 'scale(1)';
        }
      });
    });
    
    star.addEventListener("mouseout", function() {
      stars.forEach(s => {
        s.style.transform = s.classList.contains('active') ? 'scale(1.2)' : 'scale(1)';
      });
    });
  });

  const submitRatingButton = document.getElementById("submitRating");
  submitRatingButton.addEventListener("click", async function() {
    if (userRating === 0) {
      alert("請選擇評分星數！");
      return;
    }
    
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
    
    try {
      await logUserActivity("user_rating", { rating: userRating });
      
      const ratingMsg = document.getElementById("ratingMessage");
      ratingMsg.textContent = "感謝您的評分！您的意見對我們很重要。";
      ratingMsg.classList.add('show');
      ratingMsg.style.display = "block";
      
      this.innerHTML = '<i class="fas fa-check-circle"></i> 評分成功';
      this.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    } catch (error) {
      console.error('Rating submission error:', error);
      this.disabled = false;
      this.innerHTML = '<i class="fas fa-paper-plane"></i> 重新提交';
      alert('評分提交失敗，請稍後再試！');
    }
  });
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll("#starsContainer .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function toggleMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  menu.classList.toggle("show");
  overlay.classList.toggle("show");
  
  var links = menu.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].style.animationDelay = (i * 0.1) + 's';
  }
}

function closeMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  menu.classList.remove("show");
  overlay.classList.remove("show");
}

document.addEventListener('click', function(event) {
  var menu = document.getElementById("fullscreenMenu");
  var menuIcon = document.querySelector(".menu-icon");
  if (menu.classList.contains('show') && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
    closeMenu();
  }
});

const html5QrCode = new Html5Qrcode("qr-reader");
const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

document.getElementById('scanQRCode').addEventListener('click', () => {
  const qrReader = document.getElementById('qr-reader');
  if (qrReader.style.display === 'none' || qrReader.style.display === '') {
    qrReader.style.display = 'block';
    html5QrCode.start({ facingMode: "environment" }, qrConfig, onScanSuccess);
  } else {
    qrReader.style.display = 'none';
    html5QrCode.stop();
  }
});

function onScanSuccess(decodedText, decodedResult) {
  document.getElementById('invitationCode').value = decodedText;
  html5QrCode.stop();
  document.getElementById('qr-reader').style.display = 'none';
  document.getElementById('qr-result').textContent = `您的邀請碼是：${decodedText}`;

  logUserActivity('qr_scan_success', { invitationCode: decodedText });
}

function handleQRCodeImage(file) {
  logUserActivity('qr_image_upload', { fileName: file.name });

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        document.getElementById('invitationCode').value = code.data;
        document.getElementById('qr-result').textContent = `您的邀請碼是：${code.data}`;
      } else {
        document.getElementById('qr-result').textContent = '無法識別 QR 碼，請嘗試其他圖片';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('fileInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) {
    handleQRCodeImage(file);
  }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  const icon = document.querySelector('#darkModeToggle i');
  icon.classList.add('transitioning');
  
  setTimeout(() => {
    if (isDarkMode) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    
    setTimeout(() => {
      icon.classList.remove('transitioning');
    }, 600);
  }, 300);

  logUserActivity('toggle_dark_mode', { enabled: isDarkMode });
}

const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
  const icon = document.querySelector('#darkModeToggle i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

document.getElementById('currentYear').textContent = new Date().getFullYear();

function showExportOptions() {
  const exportMenu = document.createElement('div');
  exportMenu.className = 'export-menu';
  exportMenu.innerHTML = `
    <div class="export-menu-content">
      <h3><i class="fas fa-file-export"></i> 選擇匯出格式</h3>
      <button onclick="exportResults('txt')">
        <i class="fas fa-file-alt"></i> 文字檔 (.txt)
      </button>
      <button onclick="exportResults('pdf')">
        <i class="fas fa-file-pdf"></i> PDF檔 (.pdf)
      </button>
      <button onclick="exportResults('csv')">
        <i class="fas fa-file-csv"></i> CSV檔 (.csv)
      </button>
      <button onclick="exportResults('json')">
        <i class="fas fa-file-code"></i> JSON檔 (.json)
      </button>
      <button onclick="exportResults('print')">
        <i class="fas fa-print"></i> 直接列印
      </button>
      <button onclick="closeExportMenu()" class="cancel-button">
        <i class="fas fa-times"></i> 取消
      </button>
    </div>
  `;
  document.body.appendChild(exportMenu);
  
  requestAnimationFrame(() => {
    exportMenu.classList.add('show');
  });
}

function closeExportMenu() {
  const exportMenu = document.querySelector('.export-menu');
  if (exportMenu) {
    exportMenu.classList.remove('show');
    setTimeout(() => exportMenu.remove(), 300);
  }
}

async function exportResults(format = 'txt') {
  logUserActivity('export_results', { format });
  const resultsElement = document.getElementById('results');
  const resultsText = resultsElement.innerText;
  
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const watermark =
    "********************************\n" +
    "*                              *\n" +
    "*  CHC 彰化區會考落點分析系統  *\n" +
    "*       以下資料僅供參考      *\n" +
    "*                              *\n" +
    `*   產生時間: ${dateTime}   *\n` +
    "*                              *\n" +
    "********************************\n\n";
  
  const contentWithWatermark = watermark + resultsText;
  
  switch (format) {
    case 'txt':
      exportTxt(contentWithWatermark);
      break;
    case 'pdf':
      await exportPdf(contentWithWatermark);
      break;
    case 'csv':
      exportCsv(contentWithWatermark);
      break;
    case 'json':
      exportJson(contentWithWatermark);
      break;
    case 'print':
      printResults();
      break;
  }
}

function exportTxt(content) {
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW');
  
  let formattedContent = 
    "============================================================\n" +
    "                彰化區會考落點分析系統                      \n" +
    "============================================================\n\n" +
    `報表產生時間: ${dateTime}\n\n` +
    "------------------------------------------------------------\n" +
    "                        分析結果                            \n" +
    "------------------------------------------------------------\n\n";
  
  const resultsElement = document.getElementById('results');
  const totalPointsElement = resultsElement.querySelector('.total-points .result-value');
  const totalPoints = totalPointsElement ? totalPointsElement.textContent.trim() : '';
  
  formattedContent += `總積分: ${totalPoints}\n\n`;
  formattedContent += "可能錄取學校:\n";
  formattedContent += "------------------------------------------------------------\n";
  
  const schoolItems = resultsElement.querySelectorAll('.school-item');
  if (schoolItems.length > 0) {
    Array.from(schoolItems).forEach((item, index) => {
      const nameElement = item.querySelector('.school-name');
      const name = nameElement ? nameElement.textContent.replace(/\d+\.\s+/, '').trim() : '';
      
      const details = item.querySelector('.school-details');
      const detailsText = details ? details.textContent.trim() : '';
      
      formattedContent += `${index + 1}. ${name}\n`;
      formattedContent += `   ${detailsText}\n`;
      formattedContent += "   --------------------\n";
    });
  } else {
    formattedContent += "未找到符合條件的學校\n";
    formattedContent += "------------------------------------------------------------\n";
  }
  
  formattedContent += "\n============================================================\n";
  formattedContent += "注意事項: 本分析結果僅供參考，實際錄取結果以各校公告為準。\n";
  formattedContent += "============================================================\n";
  
  const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.txt');
}

async function exportPdf(content) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFillColor(198, 40, 40); 
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('彰化區會考落點分析結果', 105, 12, { align: 'center' });
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'italic');
  doc.text('CHC 彰化區會考落點分析', 105, 150, {
    align: 'center',
    angle: 45
  });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 30;
  
  splitText.forEach(line => {
    if (y > 280) {
      doc.addPage();
      doc.setFillColor(198, 40, 40);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('彰化區會考落點分析結果', 105, 12, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      y = 30;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`頁 ${i} / ${pageCount} - 產生時間: ${new Date().toLocaleString('zh-TW')}`, 105, 290, { align: 'center' });
  }
  
  doc.save('彰化區會考落點分析結果.pdf');
}

function exportCsv(content) {
  const resultsElement = document.getElementById('results');
  const totalPointsElement = resultsElement.querySelector('.total-points .result-value');
  const totalPoints = totalPointsElement ? totalPointsElement.textContent.trim() : '';
  
  const schoolItems = resultsElement.querySelectorAll('.school-item');
  const schoolList = Array.from(schoolItems).map((item, index) => {
    const nameElement = item.querySelector('.school-name');
    const name = nameElement ? nameElement.textContent.replace(/\d+\.\s+/, '').replace(/公立|私立/, '').trim() : '';
    
    const ownershipMatch = nameElement ? nameElement.textContent.match(/(公立|私立)/) : null;
    const ownership = ownershipMatch ? ownershipMatch[1] : '';
    
    const details = item.querySelector('.school-details');
    const typeMatch = details ? details.textContent.match(/類型:\s*([^,]+)/) : null;
    const type = typeMatch ? typeMatch[1].trim() : '';
    
    const groupMatch = details ? details.textContent.match(/群別:\s*([^,]+)/) : null;
    const group = groupMatch ? groupMatch[1].trim() : '';
    
    return { 
      序號: index + 1,
      學校名稱: name, 
      屬性: ownership,
      類型: type,
      群別: group || '無'
    };
  });
  
  let csvContent = '\uFEFF序號,學校名稱,屬性,類型,群別\n';
  
  schoolList.forEach(school => {
    csvContent += `${school.序號},${school.學校名稱},${school.屬性},${school.類型},${school.群別}\n`;
  });
  
  csvContent += '\n會考成績分析結果\n';
  csvContent += `總積分,${totalPoints}\n`;
  csvContent += `分析時間,${new Date().toLocaleString('zh-TW')}\n`;
  csvContent += '本資料僅供參考，實際錄取結果以各校放榜為準。\n';
  csvContent += 'CHC 彰化區會考落點分析系統 - https://tyctw.github.io\n';
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.csv');
}

function exportJson(content) {
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  const resultsElement = document.getElementById('results');
  const totalPointsElement = resultsElement.querySelector('.total-points .result-value');
  const totalPoints = totalPointsElement ? parseInt(totalPointsElement.textContent.trim()) : 0;
  
  const schoolItems = resultsElement.querySelectorAll('.school-item');
  const schools = Array.from(schoolItems).map((item, index) => {
    const nameElement = item.querySelector('.school-name');
    const name = nameElement ? nameElement.textContent.replace(/\d+\.\s+/, '').replace(/公立|私立/, '').trim() : '';
    
    const details = item.querySelector('.school-details');
    const detailsText = details ? details.textContent.trim() : '';
    
    return { 
      id: index + 1,
      name, 
      ownership: nameElement ? nameElement.textContent.match(/(公立|私立)/)[1] : '',
      type: detailsText.match(/類型:\s*([^,]+)/)[1].trim(),
      group: detailsText.match(/群別:\s*([^,]+)/) ? detailsText.match(/群別:\s*([^,]+)/)[1].trim() : null
    };
  });
  
  const jsonData = {
    meta: {
      title: 'CHC 彰化區會考落點分析結果',
      generated: new Date().toISOString(),
      version: '1.0'
    },
    scores,
    results: {
      totalPoints,
      eligibleSchoolsCount: schools.length
    },
    eligibleSchools: schools,
    disclaimer: '本資料僅供參考，實際錄取結果以各校公告為準。'
  };
  
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.json');
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function printResults() {
  logUserActivity('print_results');
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('請允許彈出視窗以便列印報表');
    return;
  }
  
  const resultsElement = document.getElementById('results');
  const title = '彰化區會考落點分析結果';
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW');
  
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  const totalPointsElement = resultsElement.querySelector('.total-points .result-value');
  const totalPoints = totalPointsElement ? totalPointsElement.textContent.trim() : '';
  
  const schoolItems = resultsElement.querySelectorAll('.school-item');
  let schoolsHTML = '';
  
  if (schoolItems.length > 0) {
    Array.from(schoolItems).forEach((item, index) => {
      const nameElement = item.querySelector('.school-name');
      const name = nameElement ? nameElement.textContent.replace(/\d+\.\s+/, '').trim() : '';
      
      const details = item.querySelector('.school-details');
      const detailsText = details ? details.textContent.trim() : '';
      
      schoolsHTML += `
        <div class="school-item">
          <div class="school-name">${index + 1}. ${name}</div>
          <div class="school-details">${detailsText}</div>
        </div>
      `;
    });
  } else {
    schoolsHTML = `
      <div class="no-schools">
        <p>未找到符合條件的學校</p>
        <p>請嘗試調整您的成績或篩選條件</p>
      </div>
    `;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
        
        body {
          font-family: 'Noto Sans TC', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          position: relative;
        }
        .report {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4a6fa5;
          position: relative;
        }
        .header:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 4px;
          background: linear-gradient(90deg, #4a6fa5, #ff9e43, #4a6fa5);
          border-radius: 10px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #4a6fa5;
          margin-bottom: 10px;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #4a6fa5;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .datetime {
          font-size: 14px;
          color: #666;
          margin: 15px 0;
          padding: 8px 15px;
          background: #f5f7fa;
          border-radius: 20px;
          display: inline-block;
        }
        .watermark {
          background: #f5f7fa;
          border: 1px dashed #bdc3c7;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 30px;
          text-align: center;
          font-style: italic;
          color: #666;
          position: relative;
        }
        .watermark:before {
          content: '⚠️';
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
        }
        .scores-section {
          background: linear-gradient(145deg, #f8f9fa, #e6e9ef);
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        }
        .scores-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #4a6fa5;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .score-item {
          background: white;
          padding: 15px 10px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 3px 8px rgba(0,0,0,0.05);
          border-bottom: 3px solid #4a6fa5;
          transition: all 0.3s ease;
        }
        .score-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .score-label {
          font-weight: bold;
          color: #4a6fa5;
          margin-bottom: 8px;
          font-size: 15px;
        }
        .score-value {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }
        .results-summary {
          margin: 40px 0;
          text-align: center;
        }
        .total-points-container {
          background: linear-gradient(145deg, #4a6fa5, #3b5a85);
          color: white;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          width: 60%;
          margin: 0 auto 30px;
          box-shadow: 0 5px 20px rgba(74, 111, 165, 0.3);
          position: relative;
          overflow: hidden;
        }
        .total-points-container:before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0.6;
        }
        .total-points-label {
          font-size: 18px;
          margin-bottom: 10px;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .total-points-value {
          font-size: 48px;
          font-weight: bold;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .schools-section {
          margin: 40px 0;
        }
        .schools-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          background: linear-gradient(to right, #f5f7fa, transparent);
          padding: 10px 15px;
          border-radius: 8px;
        }
        .schools-title {
          font-size: 20px;
          font-weight: bold;
          color: #4a6fa5;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .schools-count {
          background: #4a6fa5;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }
        .school-list {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .school-item {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 3px 15px rgba(0,0,0,0.05);
          border-left: 5px solid #4a6fa5;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .school-item:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(to right, #4a6fa5, #ff9e43);
        }
        .school-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .school-name {
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 18px;
          color: #2c3e50;
          display: flex;
          align-items: flex-start;
          line-height: 1.4;
        }
        .school-ownership {
          display: inline-block;
          background-color: #eee;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.75em;
          margin-left: 8px;
          color: #555;
          white-space: nowrap;
        }
        .school-details {
          color: #666;
          font-size: 0.95em;
          line-height: 1.6;
        }
        .no-schools {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          color: #7f8c8d;
          font-size: 18px;
          border: 2px dashed #bdc3c7;
        }
        .disclaimer {
          padding: 20px;
          background: #fffde7;
          border-left: 5px solid #ffd600;
          margin: 40px 0 30px;
          font-size: 15px;
          color: #5d4037;
          line-height: 1.8;
          position: relative;
        }
        .disclaimer-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #f57c00;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 13px;
          color: #7f8c8d;
          position: relative;
        }
        .footer:before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(to right, transparent, #bdc3c7, transparent);
        }
        .footer-logo {
          font-weight: bold;
          color: #4a6fa5;
          margin-bottom: 5px;
        }
        .page-number {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 30px;
          font-style: italic;
        }
        .watermark-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 100px;
          color: rgba(200, 200, 200, 0.1);
          font-weight: bold;
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
        }
        .print-controls {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background: #f5f7fa;
          border-radius: 10px;
        }
        .print-button {
          padding: 12px 25px;
          cursor: pointer;
          background: linear-gradient(145deg, #4a6fa5, #3b5a85);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(74, 111, 165, 0.3);
          transition: all 0.3s ease;
        }
        .print-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(74, 111, 165, 0.4);
        }
        .close-button {
          padding: 12px 25px;
          cursor: pointer;
          background: linear-gradient(145deg, #95a5a6, #7f8c8d);
          color: white;
          border: none;
          border-radius: 50px;
          margin-left: 10px;
          font-size: 16px;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(127, 140, 141, 0.3);
          transition: all 0.3s ease;
        }
        .close-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(127, 140, 141, 0.4);
        }
        @media print {
          body {
            width: 100%;
            max-width: none;
            background: white;
            padding: 0;
            margin: 0;
          }
          .report {
            box-shadow: none;
            padding: 20px;
            margin: 0;
          }
          .print-controls {
            display: none;
          }
          .page-break {
            page-break-after: always;
          }
          .watermark-overlay {
            color: rgba(200, 200, 200, 0.08);
          }
          @page {
            margin: 1.5cm;
            size: portrait;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark-overlay">CHC 彰化區會考落點分析</div>
      <div class="report">
        <div class="header">
          <div class="logo">
            <div class="logo-icon">📊</div>
            CHC 彰化區會考落點分析系統
          </div>
          <div class="datetime">報表產生時間：${dateTime}</div>
        </div>
        
        <div class="watermark">
          本報表僅供參考，實際錄取結果以各校公告為準
        </div>
        
        <div class="scores-section">
          <div class="scores-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM13 18H11V16H13V18ZM13 14H11V10H13V14ZM17 18H15V13H17V18Z" fill="#4a6fa5"/>
            </svg>
            會考成績資料
          </div>
          <div class="scores-grid">
            <div class="score-item">
              <div class="score-label">國文</div>
              <div class="score-value">${scores.chinese || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">英文</div>
              <div class="score-value">${scores.english || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">數學</div>
              <div class="score-value">${scores.math || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">自然</div>
              <div class="score-value">${scores.science || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">社會</div>
              <div class="score-value">${scores.social || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">作文</div>
              <div class="score-value">${scores.composition || '未填'} 級分</div>
            </div>
          </div>
        </div>
        
        <div class="results-summary">
          <div class="total-points-container">
            <div class="total-points-label">總積分</div>
            <div class="total-points-value">${totalPoints}</div>
          </div>
        </div>
        
        <div class="schools-section">
          <div class="schools-header">
            <div class="schools-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" fill="#4a6fa5"/>
              </svg>
              可能錄取學校
            </div>
            <div class="schools-count">${schoolItems.length} 所學校</div>
          </div>
          
          <div class="school-list">
            ${schoolsHTML}
          </div>
        </div>
        
        <div class="disclaimer">
          <div class="disclaimer-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14ZM17 18H15V13H17V18Z" fill="#f57c00"/>
            </svg>
            注意事項
          </div>
          <p>本分析結果僅基於會考的成績，並不考慮其他因素如特殊才藝、體育成績、各校年度的招生政策變化等。實際錄取情況請以學校公布為準。分析資料僅供參考，請勿完全依賴本報表做出決策。</p>
        </div>
        
        <div class="footer">
          <div class="footer-logo">CHC彰化區會考落點分析系統</div>
          <p> 2024 版權所有</p>
          <p>本報表由彰化區會考落點分析系統自動生成</p>
        </div>
        
        <div class="page-number">第 1 頁</div>
      </div>
      
      <div class="print-controls">
        <button class="print-button" onclick="window.print();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8H5C3.34 8 2 9.34 2 11V17H6V21H18V17H22V11C22 9.34 20.66 8 19 8ZM16 19H8V14H16V19ZM19 12C18.45 12 18 11.55 18 11C18 10.45 18.45 10 19 10C19.55 10 20 10.45 20 11C20 11.55 19.55 12 19 12ZM18 3H6V7H18V3Z" fill="white"/>
          </svg>
          列印報表
        </button>
        <button class="close-button" onclick="window.close();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
          </svg>
          關閉視窗
        </button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  printWindow.focus();
}