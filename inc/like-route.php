<?php

/**
 * Registers REST API routes for managing likes.
 *
 * @return void
 */
function universityLikeRoutes(){
    register_rest_route( 'university/v1', 'manageLike', array(
        'methods' => 'POST',
        'callback' => 'createLike'
    ));

    register_rest_route( 'university/v1', 'manageLike', array(
        'methods' => 'DELETE',
        'callback' => 'deleteLike'
    ));
}

add_action('rest_api_init', 'universityLikeRoutes');

function createLike($data) {
    if( is_user_logged_in()){
        $professor = sanitize_text_field( $data['professorID']);

        return wp_insert_post(array(
            'post_type' => 'like',
            'post_status' => 'publish',
            'meta_input' => array(
                'liked_professor_id' => $professor
            )
        ));
    } else {
        die('Only logged in users can like.');
    }
    
  }

  function deleteLike() {
  }