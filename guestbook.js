// guestbook.js (아카이브 버전)

const listContainer = document.getElementById('guestbook-list');

// XSS 방지를 위한 HTML 이스케이프 함수
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 날짜 포맷팅 함수
function formatDate(date) {
    if (!date) return '';
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    });
    return formatter.format(new Date(date))
        .replace(/\.\s/g, '.')
        .replace(/\.$/, '')
        .trim();
}

// 정적 JSON에서 방명록 데이터 로드
let guestbookLoaded = false;

async function loadGuestbook() {
    if (guestbookLoaded || !listContainer) return;
    guestbookLoaded = true;

    try {
        const res = await fetch('guestbook-data.json');
        const data = await res.json();

        if (data.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color: var(--text-light);">작성된 메시지가 없습니다.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        data.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'guestbook-entry';
            div.innerHTML = `
                <div class="guestbook-entry-header">
                    <span class="guestbook-entry-name">${escapeHtml(entry.name)}</span>
                    <span class="guestbook-entry-date">${formatDate(entry.createdAt)}</span>
                </div>
                <div class="guestbook-entry-message">${escapeHtml(entry.message).replace(/\n/g, '<br>')}</div>
            `;
            fragment.appendChild(div);
        });
        listContainer.appendChild(fragment);
    } catch (error) {
        console.error('방명록 로딩 실패:', error);
        listContainer.innerHTML = '<p style="text-align:center; color: red;">방명록 데이터를 불러오지 못했습니다.</p>';
    }
}

// 방명록 탭이 열렸을 때 로드
window.addEventListener('guestbookTabOpened', loadGuestbook, { once: true });
