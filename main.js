import "./style.css";
import Experience from "./Experience/Experience.js";

const canvas = document.querySelector(".experience-canvas");
if (canvas) {
  new Experience(canvas);
}

const subjectSelect = document.getElementById("boko-subject");
const customSubjectWrap = document.getElementById("boko-custom-subject-wrap");
const customSubjectInput = document.getElementById("boko-custom-subject");
const contactForm = document.getElementById("boko-contact-form");

if (subjectSelect && customSubjectWrap && customSubjectInput) {
  subjectSelect.addEventListener("change", () => {
    if (subjectSelect.value === "Other") {
      customSubjectWrap.style.display = "flex";
      customSubjectInput.required = true;
    } else {
      customSubjectWrap.style.display = "none";
      customSubjectInput.required = false;
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const senderName =
      document.getElementById("boko-name")?.value.trim() || "Visitor";
    const senderEmail =
      document.getElementById("boko-email")?.value.trim() || "Not provided";
    const subjectChoice =
      document.getElementById("boko-subject")?.value || "Project Collaboration";
    const customSubject =
      document.getElementById("boko-custom-subject")?.value.trim() || "";
    const message =
      document.getElementById("boko-message")?.value.trim() ||
      "I would like to connect with you.";

    const finalSubject =
      subjectChoice === "Other"
        ? customSubject || "Custom Inquiry - Abdullah Saami Portfolio"
        : subjectChoice;

    const body = [
      "Hello Abdullah Saami,",
      "",
      `Subject Category: ${finalSubject}`,
      `Name: ${senderName}`,
      `Email: ${senderEmail}`,
      "----------------------------------------",
      "",
      message,
      "",
      "----------------------------------------",
      "Sent via Abdullah Saami's 3D Room Portfolio",
    ].join("\r\n");

    window.location.href = `mailto:getsaami@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${finalSubject} - from ${senderName}`
    )}&body=${encodeURIComponent(body)}`;
  });
}
