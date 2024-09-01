const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDiplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_-+=[]{};:"<>?/,.';

let password = "";
let passwordLenght = 10;
let checkCount = 0;

handleSlider();

//set strength circle to gray
setIndicator('#ccc');

//handlerSlider => slider k aage piche krne se password ki lenght set hogi
function handleSlider() {
    inputSlider.value = passwordLenght;
    lengthDisplay.innerText = passwordLenght;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLenght - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    // color
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateRandomSymbol() {
    const randomSymbolIndex = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomSymbolIndex);
}

function calcStrengh() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLenght >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower && hasUpper) && (hasNumber || hasSymbol) && passwordLenght >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDiplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }

    // classList add krne se copied wale text pr active class add hojayegi
    copyMsg.classList.add("active");


    // itne time baad mera copied wala text remove hojaayega
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 3000);
}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;

        // special condition
        if (passwordLenght < checkCount) {
            passwordLenght = checkCount;
            handleSlider();
        }
    })
}

// Adding Event Listeners in to our project that password generator
inputSlider.addEventListener('input', (e) => {
    passwordLenght = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if (passwordDiplay.value) {
        copyContent();
    }
})


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleChange);
})

generateBtn.addEventListener('click', () => {
    // none of the checkboxes are selected or checked
    if (checkCount == 0)
        return;

    // Special condtition
    if (passwordLenght < checkCount) {
        passwordLenght = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";

    // if(uppercaseCheck.checked)
    //     password += generateUppercase();

    // if(lowercaseCheck.checked)
    //     password += generateLowercase();

    // if(numbersCheck.checked)
    //     password += generateRandomNumber();

    // if(symbolsCheck.checked)
    //     password += generateRandomSymbol();

    let funArr = [];

    if (uppercaseCheck.checked)
        funArr.push(generateUppercase);

    if (lowercaseCheck.checked)
        funArr.push(generateLowercase);

    if (numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funArr.push(generateRandomSymbol);

    // compulsory condition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    // remaining condition
    for (let i = 0; i < passwordLenght - funArr.length; i++) {
        let randIndex = getRandomInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // shuffling the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDiplay.value = password;

    calcStrengh();

})