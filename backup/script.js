document.addEventListener('DOMContentLoaded', function() {
    // 画像のリンクとプレビューリンクの連動設定
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
        const imgLink = item.querySelector('a img')?.parentElement;
        const previewLink = item.querySelector('.preview-link');
        const img = item.querySelector('a img');
        
        if (imgLink && previewLink && img) {
            // 画像ホバー時にプレビューリンクにクラスを追加
            imgLink.addEventListener('mouseenter', () => {
                previewLink.classList.add('hovered');
            });
            
            imgLink.addEventListener('mouseleave', () => {
                previewLink.classList.remove('hovered');
            });
            
            // プレビューリンクホバー時に画像にクラスを追加
            previewLink.addEventListener('mouseenter', () => {
                img.classList.add('hovered');
            });
            
            previewLink.addEventListener('mouseleave', () => {
                img.classList.remove('hovered');
            });
            
            // タッチデバイス用
            imgLink.addEventListener('touchstart', () => {
                previewLink.classList.add('hovered');
            });
            
            imgLink.addEventListener('touchend', () => {
                setTimeout(() => {
                    previewLink.classList.remove('hovered');
                }, 300);
            });
            
            // プレビューリンクタッチ時に画像にクラスを追加
            previewLink.addEventListener('touchstart', () => {
                img.classList.add('hovered');
            });
            
            previewLink.addEventListener('touchend', () => {
                setTimeout(() => {
                    img.classList.remove('hovered');
                }, 300);
            });
        }
    });
}); 