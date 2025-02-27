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
  var instructions = document.getElementById('instructions');
  if (instructions.style.display === 'none' || instructions.style.display === '') {
    instructions.style.display = 'block';
    instructions.style.animation = 'fadeIn 0.5s ease-out';
  } else {
    instructions.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
      instructions.style.display = 'none';
    }, 500);
  }
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
      <div class="loading-text">分析中，請稍候...</div>
      <div class="loading-progress"></div>
      <div class="loading-steps">
        <div class="loading-step" data-step="1">
          <i class="fas fa-check-circle"></i>
          <span>驗證邀請碼</span>
        </div>
        <div class="loading-step" data-step="2">
          <i class="fas fa-check-circle"></i>
          <span>計算總積分</span>
        </div>
        <div class="loading-step" data-step="3">
          <i class="fas fa-check-circle"></i>
          <span>分析落點區間</span>
        </div>
        <div class="loading-step" data-step="4">
          <i class="fas fa-check-circle"></i>
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
  const stepDelay = 500; // Time between each step

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('active');
    }, stepDelay * (index + 1));
  });
}

function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      loadingOverlay.remove();
    }, 300);
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
    setTimeout(hideLoading, 2000);
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
  
  resultsHTML += `
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
      exportCsv(resultsText);
      break;
    case 'json':
      exportJson(resultsText);
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
  
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 20;
  
  splitText.forEach(line => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
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
  
  // Create CSV header
  let csvContent = '序號,學校名稱,屬性,類型,群別\n';
  
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
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, '彰化區會考落點分析結果.csv');
}

function exportJson(content) {
  const lines = content.split('\n');
  const jsonData = {
    title: 'CHC 彰化區會考落點分析結果',
    generateTime: new Date().toISOString(),
    content: lines.filter(line => line.trim()),
    scores: {
      chinese: document.getElementById('chinese').value,
      english: document.getElementById('english').value,
      math: document.getElementById('math').value,
      science: document.getElementById('science').value,
      social: document.getElementById('social').value,
      composition: document.getElementById('composition').value
    }
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

initRating();