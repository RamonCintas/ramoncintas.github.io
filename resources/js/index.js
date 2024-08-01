document.addEventListener("DOMContentLoaded", async () => {
  const userPreferredLanguage =
    localStorage.getItem("language") || "pt";
  const langData = await fetchLanguageData(userPreferredLanguage);
  updateContent(userPreferredLanguage, langData);

  setActiveLink();

  window.addEventListener("hashchange", setActiveLink);

  window.addEventListener('scroll', addMenuBorder);

  typeWrite(document.querySelector(".typewriter"));
});

function typeWrite(element) {
  const arrayText = element.innerHTML.split("");
  element.innerHTML = " ";
  arrayText.forEach(function (letter, i) {
    setTimeout(function () {
      element.innerHTML += letter;
    }, 75 * i);
  });
}

function scrollCards(direction) {
  const container = document.querySelector('.cards');
  const scrollAmount = 300; 
  const currentScroll = container.scrollLeft;

  if (direction === 'next') {
    container.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    document.querySelector('.previous-button').classList.remove('disabled');
    document.querySelector('.next-button').classList.add('disabled');
  } else if (direction === 'prev') {
    container.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth'
    });
    document.querySelector('.previous-button').classList.add('disabled');
    document.querySelector('.next-button').classList.remove('disabled');
  }
}

function addMenuBorder() {
  const menu = document.getElementsByClassName('header-menu')[0];
  if (window.scrollY > 20) { 
    menu.classList.add('scrolled');
  } else {
    menu.classList.remove('scrolled');
  }
};

function setActiveLink() {
  const currentSection = getCurrentSection();
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href").substring(1);
    if (href === currentSection) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function getCurrentSection() {
  const hash = window.location.hash;
  return hash ? hash.substring(1) : "home";
}

function toggleMenuHeader() {
  const menuButton = document.getElementById("mobile-menu-switch");
  var navLinks = document.getElementById("nav-menu-links");
  if (navLinks.style.display === "block") {
    navLinks.style.display = "none";
    menuButton.setAttribute("aria-expanded", "false");
  } else {
    navLinks.style.display = "block";
    menuButton.setAttribute("aria-expanded", "true");
  }
}

function toggleLangSwitchVisibility() {
  const languageButton = document.getElementById("switch-language");
  var languagesContent = document.getElementById("langs-content");
  if (languagesContent.style.display === "flex") {
    languagesContent.style.display = "none";
    languageButton.setAttribute("aria-expanded", "false");
  } else {
    languagesContent.style.display = "flex";
    languageButton.setAttribute("aria-expanded", "true");
  }
}

function updateContent(lang, langData) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const config = JSON.parse(element.getAttribute("data-i18n"));
    if (config.typeKey) {
      if (config.typeKey === "alt") {
        element.alt = langData[config.key];
      }
      if (config.typeKey === "aria-label") {
        element.ariaLabel = langData[config.key];
      }
      if (config.typeKey === "content") {
        element.content = langData[config.key];
      }
    } else {
      element.innerHTML = langData[config.key];
    }
  });

  document.querySelector("html").lang = lang;
}

function setLanguagePreference(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}

async function fetchLanguageData(lang) {
  const response = await fetch(`resources/languages/${lang}.json`);
  return response.json();
}

async function changeLanguage(lang) {
  await setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(lang, langData);
}
