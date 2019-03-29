<?php
/**
 * Plugin Name: Groups Shortcodes
 * Plugin URI: // TODO:  add plugin URI
 * Description: A plugin that enables shortcodes from the Groups plugin as blocks for Gutenberg.
 * Author: Denitsa Slavcheva
 * Author URI: // // TODO: add author URI
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */


add_action( 'plugins_loaded', 'gsb_plugins_loaded' );

function gsb_plugins_loaded() {
	if ( class_exists( 'Groups_Access_Shortcodes' ) ) {
		include_once plugin_dir_path( __FILE__ ) . 'src/class-groups-shortcodes-block';
	};
}
