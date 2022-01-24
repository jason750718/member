module.exports = class CheckCustomer {
    // 檢查Email格式
    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(email);
        return result;
    }

    // 判斷空值
    checkNull(data) {
        for (var key in data) {
            // 不為空
            return false;
        }
        // 為空值
        return true;
    }

    // 檔案大小
    checkFileSize(fileSize) {
        let maxSize = 1 * 1024 * 1024; // 1MB
        return fileSize < maxSize;
    }

    // 檢查檔案類型
    checkFileType(fileType) {
        if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
            return true;
        }
        return false;
    }
}
