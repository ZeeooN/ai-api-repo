function toggleToolbar() {
    let toolbar = document.getElementById('toolbarID');
    let filler = document.getElementById('filler');
    let button = document.getElementById('toolbarButtonOpen');

    if (toolbar.classList.contains('slideHidden')) {
        //toolbar.classList.remove('hidden');
        //toolbar.classList.add('display');
        toolbar.classList.remove('slideHidden');
        toolbar.classList.add('slideDisplay');

        filler.classList.remove('hidden');
        filler.classList.add('display');

        button.classList.remove('display');
        button.classList.add('hidden');
    } else {
        //toolbar.classList.remove('display');
        //toolbar.classList.add('hidden');
        toolbar.classList.remove('slideDisplay');
        toolbar.classList.add('slideHidden');

        filler.classList.remove('display');
        filler.classList.add('hidden');

        button.classList.remove('hidden');
        button.classList.add('display');
    }
}