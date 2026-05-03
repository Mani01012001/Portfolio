const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const revealItems = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");
const themeToggle = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav a");
const sectionNodes = document.querySelectorAll("main section[id]");
const chatMessages = document.getElementById("chatMessages");
const talkForm = document.getElementById("talkForm");
const talkInput = document.getElementById("talkInput");
const quickPrompts = document.getElementById("quickPrompts");
const projectFilters = document.getElementById("projectFilters");
const projectCards = document.querySelectorAll(".project-grid .card");
const studioActions = document.getElementById("studioActions");
const studioPrompt = document.getElementById("studioPrompt");
const studioOutcome = document.getElementById("studioOutcome");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  updateThemeToggleIcon(theme);
}

function updateThemeToggleIcon(theme) {
  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector("i");
  if (!icon) {
    return;
  }

  if (theme === "dark") {
    icon.className = "ri-moon-clear-line";
  } else {
    icon.className = "ri-sun-line";
  }
}

const savedTheme = window.localStorage.getItem("portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  applyTheme(savedTheme);
} else {
  applyTheme("light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    window.localStorage.setItem("portfolio-theme", next);
  });
}

function updateScrollProgress() {
  if (!scrollProgress) {
    return;
  }

  const total = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("active", href === `#${currentId}`);
      });
    });
  },
  { threshold: 0.35 }
);

sectionNodes.forEach((section) => navObserver.observe(section));

if (projectFilters) {
  projectFilters.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(".filter-btn")) {
      return;
    }

    const selected = target.getAttribute("data-filter") || "all";
    projectFilters.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn === target);
    });

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const visible = selected === "all" || category === selected;
      card.classList.toggle("is-hidden", !visible);
    });
  });
}

const studioPlaybook = {
  incident: {
    prompt:
      "Summarize this incident timeline in 5 bullets with impact, current status, suspected cause, mitigation already applied, and next action for stakeholders.",
    outcome: "A clean and business-ready incident update in less than 1 minute.",
  },
  rca: {
    prompt:
      "Using these logs and alerts, draft an RCA with chronology, probable root cause, evidence mapping, corrective actions, and preventive controls.",
    outcome: "A structured RCA first draft that can be reviewed quickly by engineering leads.",
  },
  change: {
    prompt:
      "Generate a pre-deployment risk brief for this change request: blast radius, failure scenarios, rollback plan, validation checks, and communication notes.",
    outcome: "A release-ready risk brief that improves deployment confidence and audit quality.",
  },
  runbook: {
    prompt:
      "Convert this incident fix into a reusable runbook with prerequisites, step-by-step actions, validation checklist, and escalation points.",
    outcome: "A consistent and reusable runbook entry for faster on-call response.",
  },
};

if (studioActions && studioPrompt && studioOutcome) {
  studioActions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches(".studio-btn")) {
      return;
    }

    const key = target.getAttribute("data-usecase") || "incident";
    const selected = studioPlaybook[key] || studioPlaybook.incident;

    studioActions.querySelectorAll(".studio-btn").forEach((btn) => {
      btn.classList.toggle("active", btn === target);
    });

    studioPrompt.textContent = selected.prompt;
    studioOutcome.textContent = selected.outcome;
  });
}

function appendChatMessage(role, text) {
  if (!chatMessages) {
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = `chat-msg ${role}`;

  if (role === "bot") {
    const icon = document.createElement("i");
    icon.className = "ri-robot-2-line";
    icon.setAttribute("aria-hidden", "true");
    wrap.appendChild(icon);
  }

  const msg = document.createElement("p");
  msg.textContent = text;
  wrap.appendChild(msg);

  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function buildResponse(input) {
  const text = input.toLowerCase();

  if (text.includes("current") || text.includes("opk") || text.includes("project")) {
    return "I currently work on the OPK project across three streams: CI/CD delivery, re-engineering support for production changes, and Linux platform engineering on Ataccama and Cloudera (including Hadoop).";
  }

  if (text.includes("terraform") || text.includes("iac")) {
    return "Yes, I use Terraform hands-on for Azure infrastructure. I build and improve modules, run plan/apply, and help keep provisioning consistent across environments.";
  }

  if (text.includes("visa") || text.includes("sponsor")) {
    return "I am currently based in Utrecht, Netherlands. For my next role, visa sponsorship is required.";
  }

  if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
    return "You can reach me at +31 617886316 (Netherlands), +91 8056353767 (India), or mmani27964@gmail.com.";
  }

  if (text.includes("experience") || text.includes("years")) {
    return "I bring 4+ years of Platform and DevOps experience across Linux operations, CI/CD engineering, automation, observability, and incident response.";
  }

  if (text.includes("skills") || text.includes("tech") || text.includes("tools")) {
    return "My core stack includes Linux (RHEL/CentOS), Azure DevOps, Jenkins, Ansible, Python, Bash, Terraform, Grafana, Splunk, Dynatrace, and Azure services.";
  }

  if (
    text.includes("ai") ||
    text.includes("copilot") ||
    text.includes("prompt") ||
    text.includes("agent")
  ) {
    return "I build and train AI-assisted workflows for practical operations work: incident summaries, RCA first drafts, runbook generation, and pre-deployment change risk briefs. The goal is faster project execution, better decision quality, and reduced manual effort.";
  }

  return "Great question. I focus on production reliability, automation, and delivery speed. You can ask me about my OPK project, Terraform work, visa status, skills, or contact details.";
}

function handleUserMessage(raw) {
  const value = raw.trim();
  if (!value) {
    return;
  }

  appendChatMessage("user", value);

  let typingNode = null;
  if (chatMessages) {
    typingNode = document.createElement("div");
    typingNode.className = "chat-msg bot typing";
    typingNode.innerHTML =
      '<i class="ri-robot-2-line" aria-hidden="true"></i><p><span></span><span></span><span></span></p>';
    chatMessages.appendChild(typingNode);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const response = buildResponse(value);
  window.setTimeout(() => {
    if (typingNode) {
      typingNode.remove();
    }
    appendChatMessage("bot", response);
  }, 500);
}

if (talkForm && talkInput) {
  talkForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = talkInput.value;
    talkInput.value = "";
    handleUserMessage(value);
  });
}

if (quickPrompts) {
  quickPrompts.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.matches(".prompt-btn")) {
      const prompt = target.getAttribute("data-prompt") || "";
      handleUserMessage(prompt);
    }
  });
}
