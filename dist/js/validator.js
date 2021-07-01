function Validator(option){
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    //Thực hiện validate
    function validate(inputElement, rule){
        var errorMessage = rule.test(inputElement.value);
        var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector);
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.classList.remove('invalid');
        }
    }

    var formElement = document.querySelector(option.form);
    if(formElement){
        option.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                //Xử lí trường hợp blur
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }

                //Xử lí khi đang gõ
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector);
                    errorElement.innerText = '';
                    inputElement.classList.remove('invalid');
                }
            } 
        });
    }

}

// định nghĩa các rules
// selector là đối số #name, #email đc truyền từ rule 
Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : "Vui lòng nhập trường này"
        }
    };
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : "Trường này phải là email"
        } 
    };
}
 
Validator.minlength = function(selector,min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Mật khẩu phải tối thiểu ${min} kí tự`
        } 
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message||"Giá trị nhập vào không chính xác"
        }
    };
}