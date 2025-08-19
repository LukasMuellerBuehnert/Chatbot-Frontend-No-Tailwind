<?php
/**
 * Plugin Name: Chatbot Widget
 * Description: Fügt ein Chat-Fenster auf jeder Seite hinzu und nutzt dein Render-Backend.
 * Version: 1.0
 * Author: Lukas
 */
if ( ! defined('ABSPATH') ) exit;

// CSS + JS laden (liegen im selben Ordner wie diese PHP-Datei)
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_style('chatbot-style', plugin_dir_url(__FILE__).'chat.css', [], null);
  wp_enqueue_script('chatbot-script', plugin_dir_url(__FILE__).'chat.js', [], null, true);
});

// Markup am Seitenende einfügen
add_action('wp_footer', function () { ?>
  <!-- Floating Toggle Button -->
  <button id="chatToggle" class="cb-fab" aria-label="Chat öffnen/schließen" title="Chat öffnen/schließen">💬</button>

  <!-- Floating Chat Window -->
  <div id="chatWindow" class="cb-window cb-hidden" role="dialog" aria-label="Chatbot">
    <div class="cb-header">
      <h2 class="cb-title">Lukas Demo Chatbot</h2>
      <button id="chatClose" class="cb-close" aria-label="Schließen">✕</button>
    </div>

    <div id="chat" class="cb-chat"></div>

    <form id="form" class="cb-form">
      <input id="msg" type="text" placeholder="Frage eingeben…" class="cb-input" />
      <button id="sendBtn" type="submit" class="cb-send">Senden</button>
    </form>

    <p class="cb-hint">Ask me anything about the website e.g. opening hours.</p>
  </div>
<?php });
