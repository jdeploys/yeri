let currentStep = 0;
const button = document.getElementById('main-button');

function handleButtonClick() {
    console.log('버튼 클릭! 현재 스텝:', currentStep);
    
    if (currentStep === 3.5) {
        // 3.5단계: 연습게임 시작 (currentStep 증가 안 함)
        startPracticeGame();
        return;
    }
    
    if (currentStep === 4) {
        // 4단계: 진짜 게임 시작 (currentStep 증가 안 함)
        startRealGame();
        return;
    }
    
    currentStep++;
    console.log('증가 후 스텝:', currentStep);
    
    if (currentStep === 1) {
        // 1단계: 게임 해볼래요 → 연습게임 안내
        document.getElementById('content').classList.add('fade-out');
        document.getElementById('bottles-individual').style.display = 'none';
        
        setTimeout(() => {
            document.getElementById('content').classList.add('hidden');
            document.getElementById('new-text').classList.add('fade-in');
        }, 500);
        
        setTimeout(() => {
            button.textContent = '네 좋아요';
        }, 500);
        
    } else if (currentStep === 2) {
        // 2단계: 네 좋아요 → 게임 설명
        document.getElementById('new-text').style.display = 'none';
        document.getElementById('game-start-screen').classList.add('show');
        button.textContent = '다음';
        
    } else if (currentStep === 3) {
        // 3단계: 다음 → 실제 게임 (콘텐츠만 교체)
        document.getElementById('game-start-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('game-start-screen').style.display = 'none';
            document.getElementById('actual-game-screen').classList.add('show');
        }, 300);
        
        // 버튼 비활성화 상태로 변경
        button.style.background = 'rgba(109, 109, 255, 0.6)';
        button.textContent = '게임 시작';
        button.classList.add('disabled');
    }
}

let hasClickedBottle = false;

function clickBottle() {
    if (hasClickedBottle) return; // 이미 클릭했으면 무시
    hasClickedBottle = true;
    
    console.log('병 클릭!');
    
    const instruction = document.getElementById('game-instruction');
    const button = document.getElementById('main-button');
    
    // 기존 텍스트 fade out
    instruction.style.opacity = '0';
    instruction.style.transition = 'opacity 0.3s ease-out';
    
    // 0.3초 후 텍스트 변경
    setTimeout(() => {
        instruction.innerHTML = `
            <div class="text">잘하셨어요!</div>
            <div class="text">음료를 빠르게 누르면 된답니다.</div>
            <div class="text">이제 연습게임을 시작해볼까요?</div>
        `;
        
        // 새 텍스트 fade in
        setTimeout(() => {
            instruction.style.opacity = '1';
        }, 50);
    }, 300);
    
    // 버튼 활성화 (0.5초 후)
    setTimeout(() => {
        button.style.background = '#2d23e4';
        button.textContent = '연습게임 시작';
        button.classList.remove('disabled');
        
        // 연습게임 시작 가능 상태로 변경
        currentStep = 3.5; // 중간 단계
    }, 800);
}

let practiceClickCount = 0;
let practiceTimer = 5.0;
let practiceInterval = null;
let practiceEnded = false; // 게임 종료 플래그

function startPracticeGame() {
    // 현재 화면 숨기기
    document.getElementById('actual-game-screen').style.display = 'none';
    
    // 연습게임 화면 보여주기
    const practiceScreen = document.getElementById('practice-game-screen');
    practiceScreen.classList.add('show');
    
    // 기존 오버레이 제거 (실패 시 추가된 것)
    const existingOverlay = practiceScreen.querySelector('div[style*="position: absolute"]');
    if (existingOverlay && existingOverlay.innerHTML.includes('실패')) {
        existingOverlay.remove();
    }
    
    // 타이틀 초기화
    const practiceTitle = document.querySelector('.practice-title');
    practiceTitle.style.left = '28px';
    practiceTitle.style.top = 'calc(var(--sat) + 100px)'; // 원래 위치로
    practiceTitle.innerHTML = `
        <div class="line1">5초 안에</div>
        <div class="line2">사진을 빠르게 클릭해보세요</div>
    `;
    practiceTitle.style.opacity = '1';
    
    // 음료 위치 초기화
    const practiceBottles = document.querySelector('.practice-bottles');
    practiceBottles.style.left = '0';
    practiceBottles.style.transform = 'none';
    practiceBottles.style.top = '330px';
    
    // stats 보이기
    document.querySelector('.practice-stats').style.opacity = '1';
    
    // 버튼 숨기기
    document.querySelector('.bottom').style.display = 'none';
    
    // 타이머 시작
    practiceClickCount = 0;
    practiceTimer = 5.0;
    practiceEnded = false; // 게임 종료 플래그 초기화
    updatePracticeStats();
    
    practiceInterval = setInterval(() => {
        practiceTimer -= 0.1;
        if (practiceTimer <= 0) {
            practiceTimer = 0;
            clearInterval(practiceInterval);
            endPracticeGame();
        }
        updatePracticeStats();
    }, 100);
}

function practiceClick() {
    if (practiceTimer > 0 && !practiceEnded) { // 게임 종료되지 않았을 때만
        practiceClickCount++;
        updatePracticeStats();
        
        if (practiceClickCount >= 10) {
            clearInterval(practiceInterval);
            practiceEnded = true; // 게임 종료
            endPracticeGame();
        }
    }
}

function updatePracticeStats() {
    document.getElementById('click-count').textContent = `${practiceClickCount}/10`;
    document.getElementById('timer').textContent = `${practiceTimer.toFixed(1)} sec`;
}

function endPracticeGame() {
    const practiceTitle = document.querySelector('.practice-title');
    const practiceStats = document.querySelector('.practice-stats');
    const practiceBottles = document.querySelector('.practice-bottles');
    const bottomBar = document.querySelector('.bottom');
    const button = document.getElementById('main-button');
    
    // 성공 조건: 5초 안에 10번 클릭
    if (practiceClickCount >= 10) {
        // stats 페이드아웃
        practiceStats.style.transition = 'opacity 0.5s ease-out';
        practiceStats.style.opacity = '0';
        
        // 0.5초 후 타이틀과 사진 위치 이동
        setTimeout(() => {
            // 타이틀 위치 이동
            practiceTitle.style.transition = 'top 0.5s ease-out';
            practiceTitle.style.left = '28px';
            practiceTitle.style.top = 'calc(var(--sat) + 167px)';
            
            // 음료 위치 이동 (중앙 정렬, left는 즉시 변경)
            practiceBottles.style.left = '50%';
            practiceBottles.style.transform = 'translateX(-50%)';
            practiceBottles.style.transition = 'top 0.5s ease-out';
            practiceBottles.style.top = '296px';
            
            practiceTitle.innerHTML = `
                <div class="line1">성공했어요! 👏</div>
                <div class="line2">본격적으로 게임 시작해볼까요?</div>
                <div class="line2">10초동안 진행됩니다.</div>
            `;
            
            // 타이틀 fade in
            practiceTitle.style.opacity = '0';
            practiceTitle.style.transition = 'opacity 0.5s ease-in, top 0.5s ease-out';
            setTimeout(() => {
                practiceTitle.style.opacity = '1';
            }, 50);
            
            // 버튼 활성화
            bottomBar.style.display = 'flex';
            button.style.background = '#2d23e4';
            button.textContent = '게임 시작';
            button.classList.remove('disabled');
            currentStep = 4; // 진짜 게임으로
        }, 500);
        
    } else {
        // 실패 화면
        practiceTitle.innerHTML = `
            <div class="line1">실패 😢</div>
            <div class="line2">다시 해볼까요?</div>
        `;
        
        // 음료 위에 오버레이 메시지 추가
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.left = '0';
        overlay.style.top = '400px';
        overlay.style.width = '100%';
        overlay.style.textAlign = 'center';
        overlay.style.zIndex = '50';
        overlay.innerHTML = `
            <div style="font-size: 23px; font-weight: 700; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                실패 😢<br>다시 해볼까요?
            </div>
        `;
        document.getElementById('practice-game-screen').appendChild(overlay);
        
        // 버튼 활성화 (다시하기)
        bottomBar.style.display = 'flex';
        button.style.background = '#2d23e4';
        button.textContent = '다시 해보기';
        button.classList.remove('disabled');
        currentStep = 3.5; // 연습게임 다시 시작
        
        // 타이틀 fade in
        practiceTitle.style.opacity = '0';
        setTimeout(() => {
            practiceTitle.style.transition = 'opacity 0.5s ease-in';
            practiceTitle.style.opacity = '1';
        }, 100);
    }
}

// 실제 게임 로직
let realClickCount = 0;
let realTimer = 10.0;
let realInterval = null;
let realGameEnded = false;

function startRealGame() {
    // 연습게임 화면 숨기기
    document.getElementById('practice-game-screen').style.display = 'none';
    
    // 실제 게임 화면 보여주기
    const realGameScreen = document.getElementById('real-game-screen');
    realGameScreen.classList.add('show');
    
    // 버튼 숨기기
    document.querySelector('.bottom').style.display = 'none';
    
    // 타이머 시작
    realClickCount = 0;
    realTimer = 10.0;
    realGameEnded = false;
    updateRealGameStats();
    
    // 음료 초기 위치 (중앙)
    const realBottles = document.querySelector('.real-bottles');
    realBottles.style.left = '50%';
    realBottles.style.transform = 'translateX(-50%) scale(1)';
    realBottles.style.top = '330px';
    realBottles.style.transition = 'all 0.3s ease-out';
    
    realInterval = setInterval(() => {
        realTimer -= 0.1;
        
        // 시간에 따른 위치/크기 변경
        if (realTimer <= 6 && realTimer > 5.9) {
            // 6초 남음: 60% 작아지고 좌측 위로
            realBottles.style.left = '30%';
            realBottles.style.top = '250px';
            realBottles.style.transform = 'translateX(-50%) scale(0.6)';
        } else if (realTimer <= 2 && realTimer > 1.9) {
            // 2초 남음: 40% 작아지고 우측 아래로
            realBottles.style.left = '70%';
            realBottles.style.top = '450px';
            realBottles.style.transform = 'translateX(-50%) scale(0.4)';
        }
        
        if (realTimer <= 0) {
            realTimer = 0;
            clearInterval(realInterval);
            realGameEnded = true;
            endRealGame();
        }
        
        updateRealGameStats();
    }, 100);
}

function realGameClick(event) {
    if (realTimer > 0 && !realGameEnded) {
        realClickCount++;
        updateRealGameStats();
        updateProgressBar();
        
        // 클릭 위치에 +1 텍스트 표시
        showClickFeedback(event);
        
        // 50번 달성 시 성공
        if (realClickCount >= 50) {
            clearInterval(realInterval);
            realGameEnded = true;
            endRealGame();
        }
    }
}

function showClickFeedback(event) {
    const feedback = document.createElement('div');
    feedback.className = 'click-feedback';
    feedback.textContent = '+1';
    
    // 클릭 위치
    feedback.style.left = `${event.clientX}px`;
    feedback.style.top = `${event.clientY}px`;
    
    document.body.appendChild(feedback);
    
    // 애니메이션 끝나면 제거
    setTimeout(() => {
        feedback.remove();
    }, 800);
}

function updateRealGameStats() {
    document.getElementById('real-click-count').textContent = realClickCount;
    document.getElementById('real-timer').textContent = `${realTimer.toFixed(1)} sec`;
    
    // 게이지바 업데이트 (0 → 50회까지)
    const progressBar = document.getElementById('progress-bar');
    const percentage = (realClickCount / 50) * 100;
    progressBar.style.width = `${percentage}%`;
}

function updateProgressBar() {
    const percentage = (realClickCount / 50) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
}

function endRealGame() {
    if (realClickCount >= 50) {
        alert(`성공! 🎉 ${realClickCount}번 클릭했어요!`);
    } else {
        alert(`시간 종료! ${realClickCount}번 클릭했어요. (목표: 50번)`);
    }
    // 결과 화면으로 이동
}