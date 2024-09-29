"use strict";
///////////////////////////////////////////////////////////////////
const includeUpperCase = document.getElementById("uppercase");
const includeLowerCase = document.getElementById("lowercase");
const includeNumbers = document.getElementById("numbers");
const includeSymbols = document.getElementById("symbols");
const barChangeColor = document.querySelectorAll(".bar");
const copied = document.querySelector(".copied");
let characterSlider = document.getElementById("character-volume");
/////////////////////////////////////////////////////////////////
const alphabetArray = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
const uppercaseArray = [...Array(26)].map((_, i) =>
  String.fromCharCode(i + 65)
);
const numberArray = [...Array(10)].map((_, i) => String.fromCharCode(i + 48));
const specialCharArray = ["!", "@", "#", "$", "%", "&", "*"];

const allCharactersArray = [
  ...alphabetArray,
  ...uppercaseArray,
  ...numberArray,
  ...specialCharArray,
];

function generatePassword(length) {
  let charactersArray = [];
  let errorMessage = "Select An Option";

  if (includeLowerCase.checked) {
    charactersArray = [...charactersArray, ...alphabetArray];
  }
  if (includeUpperCase.checked) {
    charactersArray = [...charactersArray, ...uppercaseArray];
  }
  if (includeNumbers.checked) {
    charactersArray = [...charactersArray, ...numberArray];
  }
  if (includeSymbols.checked) {
    charactersArray = [...charactersArray, ...specialCharArray];
  }
  if (charactersArray.length === 0) {
    return errorMessage;
  }
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersArray.length);
    password += charactersArray[randomIndex];
  }
  return password;
}

///////////////////////////////////////////////////////////////////
const outputCode = document.querySelector(".output-code");
const characterVolume = document.getElementById("character-volume");
const characterDisplayLength = document.querySelector(
  ".character-display__length"
);
const generate = document.querySelector(".generate");
characterVolume.oninput = function () {
  characterDisplayLength.innerHTML = this.value;
};
function evaluatePasswordStrength(password) {
  let strength = 0;
  if (password.length == 5) strength++;
  if (/[a-z]/.test(password) && password.length >= 5) strength++;
  if (/[A-Z]/.test(password) && password.length >= 8) strength++;
  if (
    /\d/.test(password) &&
    /[!@#$%^&*]/.test(password) &&
    password.length >= 10
  )
    strength++;
  if (
    /[!@#$%^&*]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    password.length >= 12
  )
    strength++;
  return strength;
}

function updateBarColor(strength) {
  barChangeColor.forEach((bar, index) => {
    if (index < strength) {
      switch (strength) {
        case 1:
          bar.style.backgroundColor = `hsl(0, 91%, 63%)`;
          bar.style.borderColor = "hsl(248, 15%, 11%)"; //TOO WEAK
          break;
        case 2:
          bar.style.backgroundColor = `hsl(30, 91%, 63%)`;
          bar.style.borderColor = "hsl(248, 15%, 11%)"; // WEAK
          break;
        case 3:
          bar.style.backgroundColor = `hsl(127, 100%, 82%)`;
          bar.style.borderColor = "hsl(248, 15%, 11%)"; // MEDIUM
          break;
        case 4:
          bar.style.backgroundColor = `hsl(180, 91%, 63%)`;
          bar.style.borderColor = "hsl(248, 15%, 11%)"; // STRONG
          break;
        default:
          bar.style.backgroundColor = `hsl(0, 91%, 63%)`;
      }
    } else {
      bar.style.backgroundColor = `hsl(248, 15%, 11%)`;
    }
  });
  document.querySelector(".strength-text").textContent =
    getStrengthText(strength);
}

function getStrengthText(strength) {
  switch (strength) {
    case 1:
      return "TOO WEAK!";
    case 2:
      return "WEAK";
    case 3:
      return "MEDIUM";
    case 4:
      return "STRONG";
    default:
      return "WEAK";
  }
}

generate.addEventListener("click", function (e) {
  e.preventDefault();
  const password = generatePassword(characterVolume.value);
  const strength = evaluatePasswordStrength(password);
  updateBarColor(strength);
  outputCode.value = password;
});

document.addEventListener("DOMContentLoaded", function () {
  const copyCode = document.querySelector(".copy-code");
  const outputCode = document.querySelector(".output-code");
  const clipboard = new ClipboardJS(copyCode, {
    text: function () {
      return outputCode.value;
    },
  });

  clipboard.on("success", function () {
    document.querySelector(".copied").textContent = "COPIED";
    outputCode.style.color = `hsl(252, 11%, 91%)`;
  });
});
