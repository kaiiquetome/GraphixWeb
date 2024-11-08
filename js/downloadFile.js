window.downloadFileFromBytes = (fileName, fileType, fileBytes) => {
    var blob = new Blob([fileBytes], { type: fileType });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    link.click();
    window.URL.revokeObjectURL(link.href);
};
