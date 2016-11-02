'use strict';

var AutoCompleteInlineEditor, TextareaInlineEditor, UserInlineEditor,
    extend = function (child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    },
    hasProp = {}.hasOwnProperty;

const InlineEditor = (() => {


    function set(text, path) {
        focus(path);
        enter(path, text);
        return blur();
    };

    function setField(text, field) {
        set(text, "#resizable-modal #" + field + " .field");
    }

    function setPassword(text, field) {
        element(By.cssContainingText('.button', '${')).click();
        let a = () => {
            $('#resizable-modal .form-group:contains("' + arguments[0] + '") .display').click();
        };
        let b = () => {
            $('#resizable-modal .form-group:contains("' + arguments[0] + '") .editable').text(arguments[1]);
        };
        Browser.executeVoidScript(a, field);
        Browser.executeVoidScript(b, field, text);
        blur();
    }

    function focus(path) {
        return element(By.css(path + ' .display')).click();
    };

    function enter(path, text) {
        return element(By.css(path + ' input')).sendKeys(text);
    };

    function blur() {
        return element(By.css(".modal-header")).click();
    };

    function setTextArea(text, field) {
        var path = '#resizable-modal #' + field + ' .field';

        var clickOnEditIcon = function () {
            return $(arguments[0] + " .edit-icon").click();
        };
        Browser.executeVoidScript(clickOnEditIcon, path);
        element(By.css(path + ' .editable')).sendKeys(text);
        element(By.css(path + ' .ok')).click();
    };


    return {
        set: set,
        setField: setField,
        setPassword: setPassword,
        enter: enter,
        focus: focus,
        blur: blur,
        setTextArea: setTextArea
    }

})();

TextareaInlineEditor = (function (superClass) {
    extend(TextareaInlineEditor, superClass);

    function TextareaInlineEditor() {
        return TextareaInlineEditor.__super__.constructor.apply(this, arguments);
    }

    function set(text) {
        this.focus();
        this.enter(text);
        return element(this.path + ' .ok').click();
    };

    return TextareaInlineEditor;

})(InlineEditor);

AutoCompleteInlineEditor = (function (superClass) {
    extend(AutoCompleteInlineEditor, superClass);

    function AutoCompleteInlineEditor() {
        return AutoCompleteInlineEditor.__super__.constructor.apply(this, arguments);
    }

    AutoCompleteInlineEditor.prototype.set = function (value) {
        this.focus();
        this.enter(value);
        return this.chooseCandidate(value);
    };

    AutoCompleteInlineEditor.prototype.chooseCandidate = function (candidate) {
        return element(".ui-autocomplete:visible .ui-menu-item:contains('" + candidate + "')").click();
    };

    return AutoCompleteInlineEditor;

})(InlineEditor);


UserInlineEditor = (function (superClass) {
    extend(UserInlineEditor, superClass);

    function UserInlineEditor() {
        return UserInlineEditor.__super__.constructor.apply(this, arguments);
    }

    UserInlineEditor.prototype.enter = function (text) {
        return using(this.path).input('draft.username').enter(text);
    };

    return UserInlineEditor;

})(AutoCompleteInlineEditor);

global.inlineEditor = () => InlineEditor
