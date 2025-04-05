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
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.txt');
}

async function exportPdf(content) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add a styled header
  doc.setFillColor(198, 40, 40); // Primary color
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('彰化區會考落點分析結果', 105, 12, { align: 'center' });
  
  // Add a watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'italic');
  doc.text('CHC 彰化區會考落點分析', 105, 150, {
    align: 'center',
    angle: 45
  });
  
  // Set text formatting for content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 30;
  
  splitText.forEach(line => {
    if (y > 280) {
      doc.addPage();
      // Add header to new page
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
  
  // Add footer
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
  // Extract key information from the results
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
  
  // Create CSV header with BOM for proper Chinese character encoding
  let csvContent = '\uFEFF序號,學校名稱,屬性,類型,群別\n';
  
  // Add school data rows
  schoolList.forEach(school => {
    csvContent += `${school.序號},${school.學校名稱},${school.屬性},${school.類型},${school.群別}\n`;
  });
  
  // Add summary information
  csvContent += '\n會考成績分析結果\n';
  csvContent += `總積分,${totalPoints}\n`;
  csvContent += `分析時間,${new Date().toLocaleString('zh-TW')}\n`;
  csvContent += '本資料僅供參考，實際錄取結果以各校放榜為準。\n';
  csvContent += 'CHC 彰化區會考落點分析系統 - https://tyctw.github.io\n';
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.csv');
}

function exportJson(content) {
  // Get form inputs
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  // Parse results
  const resultsElement = document.getElementById('results');
  const totalPointsElement = resultsElement.querySelector('.total-points .result-value');
  const totalPoints = totalPointsElement ? parseInt(totalPointsElement.textContent.trim()) : 0;
  
  const schoolItems = resultsElement.querySelectorAll('.school-item');
  const schools = Array.from(schoolItems).map((item, index) => {
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
      id: index + 1,
      name, 
      ownership,
      type,
      group: group || null
    };
  });
  
  // Create structured JSON
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
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('請允許彈出視窗以便列印報表');
    return;
  }
  
  // Get the results content
  const resultsElement = document.getElementById('results');
  const title = '彰化區會考落點分析結果';
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW');
  
  // Get user inputs for the report
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  // Build print document with enhanced styling
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
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #C62828;
          position: relative;
        }
        .header:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 5px;
          background: #C62828;
          border-radius: 10px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #C62828;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        .datetime {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .watermark {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 30px;
          text-align: center;
          font-style: italic;
          color: #666;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }
        .scores-section {
          background: #f0f0f0;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }
        .scores-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #444;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .score-item {
          background: white;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .score-label {
          font-weight: bold;
          color: #C62828;
          margin-bottom: 5px;
        }
        .results-summary {
          margin-bottom: 30px;
        }
        .results-summary h3 {
          color: #C62828;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          font-size: 20px;
        }
        .total-points {
          font-size: 24px;
          font-weight: bold;
          color: #C62828;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background: #ffebee;
          border-radius: 10px;
        }
        .school-list {
          margin-top: 20px;
        }
        .school-item {
          background: #f9f9f9;
          padding: 15px;
          margin-bottom: 15px;
          border-left: 5px solid #C62828;
          border-radius: 0 5px 5px 0;
          transition: all 0.3s ease;
        }
        .school-name {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .school-ownership {
          display: inline-block;
          background-color: #eee;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 0.8em;
          margin-left: 8px;
          color: #555;
        }
        .school-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.9em;
          color: #666;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .disclaimer {
          padding: 15px;
          background: #fffde7;
          border-left: 5px solid #ffd600;
          margin: 30px 0;
          font-size: 14px;
          color: #555;
        }
        .page-number {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 30px;
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
          .no-print {
            display: none;
          }
          .page-break {
            page-break-after: always;
          }
          .watermark-overlay {
            color: rgba(200, 200, 200, 0.1);
          }
          @page {
            margin: 1.5cm;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark-overlay">CHC 彰化區會考落點分析</div>
      <div class="report">
        <div class="header">
          <div class="logo">CHC 彰化區會考落點分析系統</div>
          <div class="datetime">報表產生時間：${dateTime}</div>
        </div>
        
        <div class="watermark">
          本報表僅供參考，實際錄取結果以各校公告為準
        </div>
        
        <div class="scores-section">
          <div class="scores-title">會考成績資料</div>
          <div class="scores-grid">
            <div class="score-item">
              <div class="score-label">國文</div>
              <div>${scores.chinese || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">英文</div>
              <div>${scores.english || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">數學</div>
              <div>${scores.math || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">自然</div>
              <div>${scores.science || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">社會</div>
              <div>${scores.social || '未填'}</div>
            </div>
            <div class="score-item">
              <div class="score-label">作文</div>
              <div>${scores.composition || '未填'} 級分</div>
            </div>
          </div>
        </div>
        
        <div class="content">
          ${resultsElement.innerHTML}
        </div>
        
        <div class="disclaimer">
          <strong>注意事項：</strong>本分析結果僅基於會考的成績，並不考慮其他因素如特殊才藝、體育成績、各校年度的招生政策變化等。實際錄取情況請以學校公布為準。分析資料僅供參考，請勿完全依賴本報表做出決策。
        </div>
        
        <div class="footer">
          <p> 2024 CHC彰化區會考落點分析系統版權所有</p>
          <p>本報表由彰化區會考落點分析系統自動生成</p>
        </div>
        
        <div class="page-number">第 1 頁</div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print();" style="padding: 12px 25px; cursor: pointer; background: #C62828; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="margin-right: 8px; vertical-align: text-bottom;" viewBox="0 0 16 16">
            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
          </svg>
          立即列印
        </button>
        <button onclick="window.close();" style="padding: 12px 25px; cursor: pointer; background: #757575; color: white; border: none; border-radius: 5px; margin-left: 10px; font-size: 16px; font-weight: bold;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="margin-right: 8px; vertical-align: text-bottom;" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
          關閉視窗
        </button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Auto-focus the new window
  printWindow.focus();
}