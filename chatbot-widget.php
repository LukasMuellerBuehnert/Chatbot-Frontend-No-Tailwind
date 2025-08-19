<?php
/**
 * Plugin Name: Chatbot Widget
 * Description: Zeigt ein Chat-Fenster auf jeder Seite (Frontend spricht mit deinem Render-Backend).
 * Version: 1.0
 * Author: Lukas
 */
if ( ! defined('ABSPATH') ) exit;

add_action('wp_enqueue_scripts', function () {
  wp_enqueue_style('chatbot-style', plugin_dir_url(__FILE__).'chat.css', [], null);
  wp_enqueue_script('chatbot-script', plugin_dir_url(__FILE__).'chat.js', [], null, true);
});

add_action('wp_footer', function () {
  include plugin_dir_path(__FILE__).'chat.html';
});
