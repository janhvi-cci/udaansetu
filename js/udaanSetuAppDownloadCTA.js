/**
 * UdaanSetuAppDownloadCTA
 * Reusable floating Android APK download CTA for Udaan Setu website.
 * Follows the project's vanilla JS/CSS architecture.
 */
(function () {
  class UdaanSetuAppDownloadCTA {
    constructor() {
      this.root = null;
      this.link = null;
      this.observer = null;
    }

    getApkHref() {
      // Direct path requirement: /UdaanSetu.apk for HTTP/HTTPS web serving.
      // Gracefully resolve relative path if inspected directly via file:// protocol.
      if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
        const path = window.location.pathname.toLowerCase();
        const isInPages = path.includes("/pages/") || path.includes("\\pages\\");
        return isInPages ? "../UdaanSetu.apk" : "./UdaanSetu.apk";
      }
      return "/UdaanSetu.apk";
    }

    init() {
      if (typeof document === "undefined" || !document.body) {
        return;
      }

      // Guard against duplicate mounting
      if (document.getElementById("udaansetu-download-cta-root")) {
        return;
      }

      const apkHref = this.getApkHref();

      const root = document.createElement("div");
      root.id = "udaansetu-download-cta-root";
      root.className = "udaansetu-cta-container";
      root.setAttribute("role", "region");
      root.setAttribute("aria-label", "Android App Download");

      root.innerHTML = `
        <a href="${apkHref}"
           download="UdaanSetu.apk"
           id="udaansetu-download-cta-btn"
           class="udaansetu-cta-button"
           aria-label="Download Udaan Setu Android App"
           title="Download Udaan Setu Android App (APK)">
          <span class="udaansetu-cta-icon-box" aria-hidden="true">
            <svg class="udaansetu-cta-android-svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
              <!-- Official Android Bugdroid Head Vector -->
              <path d="M6.38 8.42 4.36 4.92a.62.62 0 0 0-.85-.23.63.63 0 0 0-.23.86l2.07 3.58C3.12 10.36 1.6 12.87 1.4 15.8h21.2c-.2-2.93-1.72-5.44-3.95-6.67l2.07-3.58a.63.63 0 0 0-.23-.86.62.62 0 0 0-.85.23L17.62 8.42C15.96 7.66 14.05 7.2 12 7.2s-3.96.46-5.62 1.22zM7.5 12.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm9 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/>
            </svg>
            <span class="udaansetu-cta-pulse-dot" aria-hidden="true"></span>
          </span>

          <span class="udaansetu-cta-content" aria-hidden="true">
            <span class="udaansetu-cta-text-group">
              <span class="udaansetu-cta-title">Download Udaan Setu App</span>
              <span class="udaansetu-cta-subtitle">Official Android APK</span>
            </span>
            <span class="udaansetu-cta-badge">APK</span>
          </span>

          <span class="udaansetu-cta-arrow-box" aria-hidden="true">
            <svg class="udaansetu-cta-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 4v11m0 0-4-4m4 4 4-4M4 19h16"/>
            </svg>
          </span>
        </a>
      `;

      document.body.appendChild(root);
      this.root = root;
      this.link = document.getElementById("udaansetu-download-cta-btn");

      this.bindChatbotInteractions();
    }

    bindChatbotInteractions() {
      // Monitor chatbot open state to ensure no visual overlap when the chat dialog opens
      const checkChatbotState = () => {
        const chatWidget = document.getElementById("udaansetu-chat-widget");
        if (chatWidget && this.root) {
          const isOpen = chatWidget.classList.contains("open");
          this.root.classList.toggle("chat-is-open", isOpen);
        }
      };

      // Mutation observer on chatbot root/widget if present
      const setupObserver = () => {
        const chatWidget = document.getElementById("udaansetu-chat-widget");
        if (chatWidget) {
          this.observer = new MutationObserver(checkChatbotState);
          this.observer.observe(chatWidget, { attributes: true, attributeFilter: ["class"] });
          checkChatbotState();
          return true;
        }
        return false;
      };

      if (!setupObserver()) {
        // Chatbot might be initialized shortly afterwards on DOMContentLoaded
        const interval = setInterval(() => {
          if (setupObserver()) {
            clearInterval(interval);
          }
        }, 300);
        setTimeout(() => clearInterval(interval), 5000);
      }
    }
  }

  window.UdaanSetuAppDownloadCTA = new UdaanSetuAppDownloadCTA();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.UdaanSetuAppDownloadCTA.init();
    });
  } else {
    window.UdaanSetuAppDownloadCTA.init();
  }
})();
