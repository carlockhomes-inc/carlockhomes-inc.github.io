// スムーズスクロール
function smoothScroll(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ボタンクリックイベント
function setupButtonEvents() {
    // CTAボタン
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // ボタンアニメーション
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // 実際の申し込みフォームへ遷移（実装時に適切なURLに変更）
            alert('無料体験レッスンのお申し込みありがとうございます！\n担当者から24時間以内にご連絡いたします。');
        });
    });
}

// スクロールアニメーション
function setupScrollAnimation() {
    const animatedElements = document.querySelectorAll('.trouble-card, .feature-card, .testimonial-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// カードホバーエフェクト
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.trouble-card, .feature-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// モバイルメニュー（必要に応じて）
function setupMobileMenu() {
    // モバイル対応のための追加機能が必要な場合
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // モバイル特有の機能をここに追加
        console.log('モバイルデバイスで表示中');
    }
}

// ページ読み込み完了後の初期化
document.addEventListener('DOMContentLoaded', function () {
    setupButtonEvents();
    setupScrollAnimation();
    setupCardHoverEffects();
    setupMobileMenu();

    // ヒーローセクションのフェードイン
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';

        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // スクロール時のパララックス効果（軽度）
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero::before');
        if (parallax) {
            // 軽いパララックス効果
            const speed = scrolled * 0.5;
            // 実際の実装ではtransformを使用
        }
    });

    console.log('おまつさんのスクールLPが正常に読み込まれました');
});

// ウィンドウリサイズ時の対応
window.addEventListener('resize', function () {
    setupMobileMenu();
});

// フォーム送信処理（実装時に使用）
function handleFormSubmit(formData) {
    // 実際のフォーム送信処理をここに実装
    console.log('フォーム送信:', formData);

    // 送信成功メッセージ
    alert('お申し込みありがとうございます！\n担当者からご連絡いたします。');
}

// アクセシビリティ対応
function setupAccessibility() {
    // キーボードナビゲーションの改善
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });
}

// アクセシビリティ初期化
setupAccessibility();
