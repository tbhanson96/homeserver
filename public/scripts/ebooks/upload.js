var fileSelected = false;

function submitForm() {
    if(!fileSelected) {
        alertNoFiles();
    } else if (!isEpubOrMobi(getFileInput())) {
        alertInvalidFile();
    } else {
        $('#ebook-uploadProgress').collapse();
        $('#ebook-upload-form').submit();
    }
}

function updateFileLabel() {
    fileSelected = true;
    const val = getFileInput();
    console.log(val);
    $('#ebook-file-label')[0].innerHTML = val;
}

function alertNoFiles() {
    console.log('no ebook selected');
}

function alertInvalidFile() {
    console.log('invalid file fomat');
}

function isEpubOrMobi(filename) {
    return filename.split('.').slice(-1)[0] === 'epub' ||
            filename.split('.').slice(-1)[0] === 'mobi';
}

function getFileInput() {
    return $('#ebook-file')[0].files.item(0).name;
}