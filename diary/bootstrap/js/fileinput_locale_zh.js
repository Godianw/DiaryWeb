/*!
 * FileInput Spanish (Latin American) Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */
(function ($) {
    "use strict";
    $.fn.fileinput.locales.es = {
    		fileSingle: '单个文件',
            filePlural: '多个文件',
            browseLabel: '选择文件 &hellip;',
            removeLabel: '移除文件',
            removeTitle: '移除选中文件',
            cancelLabel: '取消',
            cancelTitle: '取消上传',
            uploadLabel: '上传',
            uploadTitle: '上传选中文件',
            msgSizeTooLarge: '文件 "{name}" (<b>{size} KB</b>) 超过允许上传的最大大小 <b>{maxSize} KB</b>. 请重试!',
            msgFilesTooLess: '文件数量必须大于 <b>{n}</b> {files} ，请重新上传！',
            msgFilesTooMany: '选择上传的文件数量 <b>({n})</b> 超过允许上传的最大数量 <b>{m}</b>. 请重试!',
            msgFileNotFound: '文件 "{name}" 未找到!',
            msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
            msgFileNotReadable: '文件 "{name}" 不可读.',
            msgFilePreviewAborted: 'File preview aborted for "{name}".',
            msgFilePreviewError: '读取 "{name}" 时出现错误.',
            msgInvalidFileType: '无效的文件类型 "{name}". 只支持 "{types}" 类型的文件.',
            msgInvalidFileExtension: '无效的文件后缀 "{name}". 只支持 "{extensions}" 后缀的文件.',
            msgValidationError: '文件上传时出现错误',
            msgLoading: 'Loading file {index} of {files} &hellip;',
            msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
            msgSelected: '选中{n}个文件',
            msgFoldersNotAllowed: 'Drag & drop files only! {n} folder(s) dropped were skipped.',
            dropZoneTitle: 'Drag & drop files here &hellip;'
    };

    $.extend($.fn.fileinput.defaults, $.fn.fileinput.locales.es);
})(window.jQuery);
