const passwordInput    = document.getElementById("password");
const lengthSlider     = document.getElementById("length");
const lengthDisplay    = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox  = document.getElementById("numbers");
const symbolsCheckbox  = document.getElementById("symbols");
const generateButton   = document.getElementById("generate-btn");
const copyButton       = document.getElementById("copy-btn");
const strengthBar      = document.querySelector(".strength-bar");
const strengthLabel    = document.getElementById("strength-label");

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// ── Slider: update displayed length value ─────────────────────────────────────
lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value; // FIX: .Value → .value (JavaScript is case-sensitive)
});

// ── Generate button ────────────────────────────────────────────────────────────
generateButton.addEventListener("click", makePassword);

// ── Copy button ────────────────────────────────────────────────────────────────
copyButton.addEventListener("click", () => {
    const pwd = passwordInput.value;
    if (!pwd) return;
    navigator.clipboard.writeText(pwd).then(() => {
        copyButton.classList.replace("fa-copy", "fa-check");
        copyButton.style.color = "#68d391";
        setTimeout(() => {
            copyButton.classList.replace("fa-check", "fa-copy");
            copyButton.style.color = "";
        }, 1500);
    });
});

function makePassword() {
    const length         = Number(lengthSlider.value);           // FIX: .Value → .value
    const includeUppercase = uppercaseCheckbox.checked;          // FIX: .Checked → .checked
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers   = numbersCheckbox.checked;
    const includeSymbols   = symbolsCheckbox.checked;            // FIX: symbolCharacters.checked → symbolsCheckbox.checked
                                                                 //      (was reading .checked on a STRING, not the checkbox element)

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert("Please select at least one character type.");
        return;
    }

    const newPassword = createRandomPassword(
        length, includeUppercase, includeLowercase, includeNumbers, includeSymbols
    );
    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword);
}

function createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let allCharacters = "";
    if (includeUppercase) allCharacters += uppercaseLetters;
    if (includeLowercase) allCharacters += lowercaseLetters;
    if (includeNumbers)   allCharacters += numberCharacters;
    if (includeSymbols)   allCharacters += symbolCharacters;

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex]; // FIX: allCharacters(randomIndex) → allCharacters[randomIndex]
                                                //      strings use bracket notation [], not function call ()
    }
    return password;
}

function updateStrengthMeter(password) {
    const passwordLength = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber    = /[0-9]/.test(password);
    const hasSymbols   = /[!@#$%^&*()|:;,./<>?]/.test(password); // FIX: .text(password) → .test(password)

    let strengthScore = 0;
    strengthScore += Math.min(passwordLength * 2, 40);  // FIX: passwordLength+2 → passwordLength*2 (makes score scale with length)
    if (hasUppercase) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;
    if (hasNumber)    strengthScore += 15;
    if (hasSymbols)   strengthScore += 15;

    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%"; // FIX: strengthBar.computedStyleMap.width → strengthBar.style.width
                                               //      computedStyleMap is read-only, style is writable

    let strengthLabelText = "";
    let barColor = "";

    if (strengthScore < 40) {
        barColor = "#fc8181";
        strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
        barColor = "#fbd38d";           // FIX: "#fbd8d" → "#fbd38d" (invalid 5-char hex was missing a digit)
        strengthLabelText = "Medium";
    } else {
        barColor = "#68d391";           // FIX: the else branch was completely missing — Strong was never shown
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText; // FIX: strengthText was never updated — label stayed "Medium" forever
}

// Generate a password on page load so the field isn't empty
makePassword();
