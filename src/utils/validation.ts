import { getToastError } from "./toast";

export function focusOnInvalid() {
  // if error occured in accordion, expand it
  const accordionEl = document.getElementsByClassName("accordion-collapse");
  for (const i in accordionEl) {
    if (accordionEl[i].classList) {
      const accordionErr = accordionEl[i].getElementsByClassName("has-error");
      if (accordionErr.length > 0) {
        accordionEl[i].classList.add("show");
      }
    }
  }

  //focus on element
  const erElm = document.getElementsByClassName("has-error");
  const attFor = erElm[0].firstElementChild.getAttribute("for");
  const invalidElement = document.getElementById(attFor);
  if (invalidElement) {
    invalidElement.focus();
  }

  getToastError("Field require attention");
}

export function setInputFocus() {
  const erElm = document.getElementsByClassName("focus");
  // console.log("erElm", erElm);
  if (erElm.length > 0) {
    const attFor = erElm[0].firstElementChild.getAttribute("for");
    const focusEl = document.getElementById(attFor);
    // console.log("focusEl", focusEl);
    if (focusEl) {
      // focusEl.click();
      focusEl.focus();
    } else {
      const inputElements = erElm[0].getElementsByClassName("form-control");
      // console.log("inputElements", inputElements);
      if (inputElements.length > 0) {
        // Assuming you want to focus the first element with the class 'form-control'
        const el = inputElements[0];
        const id = el.id;
        const focusEl = document.getElementById(id);
        // console.log("focusEl2", focusEl);
        if (focusEl) {
          focusEl.focus();
        }
      }
    }
  }
}
