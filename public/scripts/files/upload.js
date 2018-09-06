var numFiles = 0;
var fileIndex = 0;

function submitForm() {
    if (numFiles === 0) {
        alertNoFiles();
    } else {
        $('.upload-progress').removeClass('disabled');
        $('#uploadForm').submit();
    }
}

function renderFormInput() {
    let input = $('#file-'+fileIndex)[0];
    renderSelectedFile(input.files.item(0).name, fileIndex);
    console.log(input.files.item(0).type);
    fileIndex++;
    numFiles++;
    let newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.className = 'disabled custom-file-input'
    newInput.name = 'file'+fileIndex;
    newInput.id = 'file-'+fileIndex;
    newInput.oninput = function() { 
        renderFormInput(); 
    };
    $('#file-label').attr('for', 'file-'+fileIndex);
    $('#uploadForm')[0].appendChild(newInput);
}

function renderSelectedFile(filename, fileNumber) {
    let filesList = $('#files-list')[0];
    let selectedFile = document.createElement('li');
    selectedFile.className = 'list-group-item';
    selectedFile.id = 'file-list-'+fileNumber
    let img = document.createElement('img');
    img.className = 'file-icon';
    img.setAttribute('src', '/images/')
    selectedFile.innerHTML += filename;

    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm delete-icon';
    deleteButton.type = 'button';
    deleteButton.innerHTML += '&times;';
    deleteButton.onclick = function() { deleteFormInput(fileNumber) }

    selectedFile.appendChild(deleteButton);
    filesList.appendChild(selectedFile);
}

function deleteFormInput(fileNumber) {
    $('#file-'+fileNumber).remove();
    $('#file-list-'+fileNumber).remove();
    numFiles--;
}

function alertNoFiles() {
    console.log('nofiles');
    // let footer = $('.modal-footer')[0];
    // let alert = document.createElement('div');
    // alert.className = 'alert alert-danger fade show no-files';
    // alert.role = 'alert';
    // alert.innerHTML += 'No files selected.';
    // footer.prepend(alert);
    // setTimeout(function() {
    //     alert.alert('close');
    // }, 3000);
}