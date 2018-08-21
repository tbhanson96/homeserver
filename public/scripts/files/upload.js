var numFiles = 0;

function submitForm() {
    $('.upload-progress').removeClass('disabled');
    $('#uploadForm').submit();
}

function renderFormInput() {
    let input = $('#file-'+numFiles)[0];
    renderSelectedFile(input.files.item(0).name);
    console.log(input.files.item(0).type);
    input.className += ('disabled');
    numFiles++;
    let newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.name = 'file'+numFiles;
    newInput.id = 'file-'+numFiles;
    newInput.oninput = function() { 
        renderFormInput(); 
    };
    $('#uploadForm')[0].appendChild(newInput);
}

function renderSelectedFile(filename) {
    let filesList = $('#files-list')[0];
    let selectedFile = document.createElement('li');
    selectedFile.className = 'list-group-item';
    // let img = document.createElement('img');
    // img.addClass('file-icon');
    // img.
    selectedFile.textContent += filename;
    filesList.appendChild(selectedFile);
}