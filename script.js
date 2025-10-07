document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.pie-menu');
    const trigger = document.querySelector('.pie-menu__trigger');
    const navButtons = document.querySelectorAll('.pie-menu__button');

    trigger.addEventListener('click', () => {
        menu.classList.toggle('is-open');
    });

    const changePage = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.dataset.target;
        if (!targetId) return;
        const currentPage = document.querySelector('.page.is-active');
        if (currentPage) {
            currentPage.classList.remove('is-active');
        }
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('is-active');
        }
        menu.classList.remove('is-open');
    };
    navButtons.forEach(button => {
        button.addEventListener('click', changePage);
    });
});

