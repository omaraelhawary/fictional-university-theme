<?php

require get_theme_file_path('/inc/search-route.php');
require get_theme_file_path('/inc/like-route.php'); //Call like custom API route

function pageBannersection($args = NULL){

    if(!isset($args['title'])){
       $args['title'] = get_the_title();
    }

    if(!isset($args['subtitle'])){
        $args['subtitle'] = get_field('page_banner_subtitle');
    }

    if(!isset($args['image'])){
        if (get_field('page_banner_background')){
            $args['image'] = get_field('page_banner_background')['sizes']['pageBanner'];
        } else {
            $args['image'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }

    ?>
<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['image'] ?>)"></div>
    <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
        <div class="page-banner__intro">
            <p><?php echo $args['subtitle']; ?></p>
        </div>
    </div>
</div>
<?php

}

function university_files(){
    wp_enqueue_script('googMapsJs', '//maps.googleapis.com/maps/api/js?key=AIzaSyBbV4y2vPyu8k8PFqyRN1SjC4xHBsqQSNs', NULL, '1.0', true);
    wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
    wp_enqueue_style( 'google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style( 'university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style( 'university_extra_styles', get_theme_file_uri('/build/index.css'));

    wp_localize_script( 'main-university-js', 'uniData', array(
        'root_url' => get_site_url(),
        'nonce' => wp_create_nonce( 'wp_rest' )
    ) );
}

add_action( 'wp_enqueue_scripts', 'university_files');

function university_features(){
    register_nav_menu( 'headerMenuLocation', 'Header Menu Location' );
    register_nav_menu( 'footerLeftMenu', 'Footer Left Menu Location' );
    register_nav_menu( 'footerRightMenu', 'Footer Right Menu Location' );
    add_theme_support( 'title-tag');
    add_theme_support( 'post-thumbnails');
    add_image_size( 'professorLandscape', 400, 260, true );
    add_image_size( 'professorProtriat', 480, 650, true );
    add_image_size( 'pageBanner', 1500, 350, true );
    add_image_size('slideshowImage', 1900, 525, true);
}

add_action('after_setup_theme', 'university_features');

function uni_adjust_queries($query){
    //customize event query
    if(!is_admin() && is_post_type_archive( 'event' ) && $query -> is_main_query()){
        $today = date('Ymd');
        $query -> set('meta_key', 'event_date');
        $query -> set('orderby', 'meta_value_num');
        $query -> set('order', 'ASC');
        $query -> set('meta_query', array(
            array(
              'key' => 'event_date',
              'compare' => '>=',
              'value' => $today,
              'type' => 'numeric'
            )));
    }

    //customize program query
    if(!is_admin() && is_post_type_archive( 'program' ) && $query -> is_main_query()){
        $query -> set('orderby', 'title');
        $query -> set('order', 'ASC');
        $query -> set('posts_per_page', -1);
    }

    //customize campus query
    if(!is_admin() && is_post_type_archive( 'campus' ) && $query -> is_main_query()){
        $query -> set('posts_per_page', -1);
    }
}

add_action( 'pre_get_posts', 'uni_adjust_queries');

function university_map_api($api){
    $api['key'] = '############'; //insert your API here
    return $api; 
}
add_filter( 'acf/fields/google_map/api', 'university_map_api');


/**
 * Registers custom REST fields for the 'post' and 'note' post types.
 *
 * @return void
 */
function universty_custom_rest() {
    register_rest_field(
        'post', 
        'authorName', 
        array(
            'get_callback' => function() {
                return get_the_author();
            }
        )
    );
    register_rest_field(
        'note', 
        'userNoteCount', 
        array(
            'get_callback' => function() {
                return count_user_posts( get_current_user_id(), "note");
            }
        )
    );
}

add_action('rest_api_init', 'universty_custom_rest');



/**
 * Redirects a subscriber to the site's homepage when they try to access the admin dashboard.
 *
 * @return void
 */
function redirectSubs(){
    
    $ourCurrentUser = wp_get_current_user();

    if(count($ourCurrentUser -> roles)==1 && $ourCurrentUser -> roles[0] == 'subscriber'){
        wp_redirect(site_url('/'));
        exit;
    }
}

add_action('admin_init', 'redirectSubs');

/**
 * Hides the admin bar for users with the subscriber role.
 *
 * @return void
 */
function noSubsAdminbar(){
    
    $ourCurrentUser = wp_get_current_user();

    if(count($ourCurrentUser -> roles)==1 && $ourCurrentUser -> roles[0] == 'subscriber'){
        show_admin_bar(false);
    }
}

add_action('wp_loaded', 'noSubsAdminbar');

/**
 * Returns the URL of the site's logo.
 *
 * @return string The URL of the site's logo.
 */
function logo_url(){
    return esc_url(site_url('/'));
}

add_filter('login_headerurl', 'logo_url');

/**
 * Enqueues styles for the login page.
 *
 * @return void
 */
function loginCSS() {
    wp_enqueue_style( 'google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style( 'university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style( 'university_extra_styles', get_theme_file_uri('/build/index.css'));
}

add_action('login_enqueue_scripts', 'loginCSS');

/**
 * Returns the title of the blog.
 *
 * @return string The title of the blog.
 */
function logo_title(){
    return get_bloginfo('name');
}

add_filter('login_headertitle', 'logo_title');

/**
 * Modifies the post data for the 'note' post type, sanitizing the post content and title, 
 * and setting the post status to 'private' if the post is not in the trash.
 *
 * @param array $data The post data to be modified.
 * @param array $postarr The post array.
 *
 * @throws No exception is thrown, but the function will die if the user has reached their notes limit.
 *
 * @return array The modified post data.
 */
function privateNote($data, $postarr){
    if($data['post_type'] == 'note'){
        if(count_user_posts( get_current_user_id(), 'note') > 4 && !$postarr['ID']){
            die("You have reached your notes limit.");
        }

        $data['post_content'] = sanitize_textarea_field($data['post_content']);
        $data['post_title'] = sanitize_text_field($data['post_title']);
    }
    if($data['post_type'] == 'note' && $data['post_status'] != 'trash'){
        $data['post_status'] = 'private';
    }    
    return $data;
}

add_filter('wp_insert_post_data', 'privateNote', 10, 2);